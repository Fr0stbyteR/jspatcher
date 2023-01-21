import type { FaustDspFactory, FaustMonoOfflineProcessor } from "@shren/faustwasm/dist/esm";
import type { FFT, FFTW } from "@shren/fftw-js/dist/esm-bundle";
import * as WindowFunction from "window-function";
import apply from "window-function/apply";
import { setTypedArray } from "../../utils/buffer";
import { ceil, mod } from "../../utils/math";
import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import type { FaustFFTParameters, IFaustFFTNode, IFaustFFTProcessor } from "./FaustFFT.types";
import type { AudioWorkletGlobalScope, TypedAudioParamDescriptor, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";
import type WorkletEnvProcessor from "./WorkletEnv.worklet";

const processorId = "__JSPatcher_FaustFFTProcessor";
declare const globalThis: AudioWorkletGlobalScope & { SharedArrayBuffer: typeof SharedArrayBuffer | typeof ArrayBuffer; Atomics: typeof Atomics; jspatcherEnv: WorkletEnvProcessor };
if (!globalThis.SharedArrayBuffer) globalThis.SharedArrayBuffer = ArrayBuffer;
const { registerProcessor, sampleRate, jspatcherEnv } = globalThis;

const fftToSignal = (f: Float32Array) => {
    const fftSize = f.length;
    const len = fftSize / 2 + 1;
    const r = new Float32Array(len);
    const i = new Float32Array(len);
    const b = new Float32Array(len);
    for (let j = 0; j < len; j++) {
        r[j] = f[j] / fftSize;
        i[j] = (j === 0 || j === len - 1) ? 0 : f[fftSize - j] / fftSize;
        b[j] = j;
    }
    return [r, i, b];
};

const signalToFFT = (r: Float32Array, i: Float32Array) => {
    const len = (r.length - 1) * 2;
    const f = new Float32Array(len);
    for (let j = 0; j < r.length; j++) {
        f[j] = r[j];
        if (j === 0 || j === r.length - 1) continue;
        f[len - j] = i[j];
    }
    return f;
};

class FaustFFTProcessor extends AudioWorkletProxyProcessor<IFaustFFTProcessor, IFaustFFTNode, FaustFFTParameters> implements IFaustFFTProcessor {
    static get parameterDescriptors(): TypedAudioParamDescriptor<FaustFFTParameters>[] {
        return [{
            defaultValue: 1024,
            maxValue: 2 ** 32,
            minValue: 1,
            name: "fftSize"
        }, {
            defaultValue: 2,
            maxValue: 32,
            minValue: 1,
            name: "fftOverlap"
        }, {
            defaultValue: 3,
            maxValue: 4,
            minValue: 0,
            name: "windowFunction"
        }];
    }
    private destroyed = false;
    /** Pointer of next start sample to write of the input window */
    private $inputWrite = 0;
    /** Pointer of next start sample to read of the input window */
    private $inputRead = 0;
    /** Pointer of next start sample to write of the output window */
    private $outputWrite = 0;
    /** Pointer of next start sample to read of the output window */
    private $outputRead = 0;
    /** audio data from input, array of channels */
    private readonly fftInput: Float32Array[] = [];
    /** audio data for output, array of channels */
    private readonly fftOutput: Float32Array[] = [];
    /** Generated from the current window function */
    private window: Float32Array;
    /** Generated from the current window's rolling sum square */
    private windowSumSquare: Float32Array;
    destroy() {
        this.fftProcessor?.stop();
        this.fftProcessor?.destroy();
        this.destroyed = true;
        this._disposed = true;
    }
    private fftw: FFTW;
    private get FFT1D() {
        return this.fftw.r2r.FFT1D;
    }
    private rfft: FFT;
    private fftProcessorFactory: FaustDspFactory;
    private fftProcessor: FaustMonoOfflineProcessor;
    private fftHopSizeParam: string;
    private fftOverlap = 0;
    private fftHopSize = 0;
    private fftSize = 0;
    private fftBufferSize = 0;
    get fftBins() {
        return this.fftSize / 2;
    }
    get fftProcessorBufferSize() {
        return this.fftSize / 2 + 1;
    }
    private windowFunction = WindowFunction.blackman;
    resetFFT(sizeIn: number, overlapIn: number, windowFunctionIn: number, inputChannels: number, outputChannels: number, bufferSize: number) {
        const fftSize = ~~ceil(Math.max(2, sizeIn || 1024), 2);
        const fftOverlap = ~~Math.min(fftSize, Math.max(1, overlapIn));
        const fftHopSize = ~~Math.max(1, fftSize / fftOverlap);
        const latency = fftSize - Math.min(fftHopSize, bufferSize);
        let windowFunction: (i: number, N: number) => number = null;
        if (windowFunctionIn !== 0) {
            const id = (["blackman", "hamming", "hann", "triangular"] as const)[~~windowFunctionIn - 1];
            windowFunction = WindowFunction[id];
        }
        const fftSizeChanged = fftSize !== this.fftSize;
        if (fftSizeChanged || fftOverlap !== this.fftOverlap) {
            this.fftSize = fftSize;
            this.fftOverlap = fftOverlap;
            this.fftHopSize = fftHopSize;
            this.$inputWrite = 0;
            this.$inputRead = 0;
            this.$outputWrite = 0;
            this.$outputRead = -latency;
            this.fftBufferSize = Math.max(fftSize * 2 - this.fftHopSize, bufferSize * 2);
            if (!fftSizeChanged && this.fftHopSizeParam) this.fftProcessor.setParamValue(this.fftHopSizeParam, this.fftHopSize);
        }
        if (fftSizeChanged) {
            this.rfft?.dispose();
            this.rfft = new this.FFT1D(fftSize);
            this.createFFTProcessor();
        }
        if (fftSizeChanged || windowFunction !== this.windowFunction) {
            this.windowFunction = windowFunction;
            this.window = new Float32Array(fftSize);
            this.window.fill(1);
            if (windowFunction) apply(this.window, windowFunction);
            this.windowSumSquare = new Float32Array(this.fftBufferSize);
        }
        if (this.fftInput.length > inputChannels) {
            this.fftInput.splice(inputChannels);
        }
        if (this.fftOutput.length > outputChannels) {
            this.fftOutput.splice(outputChannels);
        }
        if (fftSizeChanged) {
            for (let i = 0; i < inputChannels; i++) {
                this.fftInput[i] = new Float32Array(this.fftBufferSize);
            }
            for (let i = 0; i < outputChannels; i++) {
                this.fftOutput[i] = new Float32Array(this.fftBufferSize);
            }
        } else {
            if (this.fftInput.length < inputChannels) {
                for (let i = this.fftInput.length; i < inputChannels; i++) {
                    this.fftInput[i] = new Float32Array(this.fftBufferSize);
                }
            }
            if (this.fftOutput.length < outputChannels) {
                for (let i = this.fftOutput.length; i < outputChannels; i++) {
                    this.fftOutput[i] = new Float32Array(this.fftBufferSize);
                }
            }
        }
    }
    constructor(options: TypedAudioWorkletNodeOptions<{ factory: FaustDspFactory }>) {
        super(options);
        this.fftProcessorFactory = options.processorOptions.factory;
        this.init();
    }
    async init(): Promise<true> {
        this.fftw = jspatcherEnv.fftw;
        await this.createFFTProcessor();
        return true;
    }
    processFFT() {
        let samplesForFFT = mod(this.$inputWrite - this.$inputRead, this.fftBufferSize) || this.fftBufferSize;
        while (samplesForFFT >= this.fftSize) {
            const fftProcessorInputs = [];
            const fftProcessorOutputs = new Array(this.fftProcessor.getNumOutputs()).fill(null).map(() => new Float32Array(this.fftProcessorBufferSize));
            for (let i = 0; i < this.fftInput.length; i++) {
                const fftBuffer = new Float32Array(this.fftSize);
                setTypedArray(fftBuffer, this.fftInput[i], 0, this.$inputRead);
                for (let j = 0; j < fftBuffer.length; j++) {
                    fftBuffer[j] *= this.window[j];
                }
                const ffted = this.rfft.forward(fftBuffer);
                fftProcessorInputs.push(...fftToSignal(ffted));
            }
            this.$inputRead += this.fftHopSize;
            this.$inputRead %= this.fftBufferSize;
            samplesForFFT -= this.fftHopSize;
            this.fftProcessor.compute(fftProcessorInputs.slice(0, this.fftProcessor.getNumInputs()), fftProcessorOutputs);
            for (let i = 0; i < this.fftOutput.length; i++) {
                const ifftBuffer = signalToFFT(fftProcessorOutputs[i * 2] || new Float32Array(this.fftProcessorBufferSize), fftProcessorOutputs[i * 2 + 1] || new Float32Array(this.fftProcessorBufferSize));
                const iffted = this.rfft.inverse(ifftBuffer);
                for (let j = 0; j < iffted.length; j++) {
                    iffted[j] *= this.window[j];
                }
                let $: number;
                for (let j = 0; j < iffted.length - this.fftHopSize; j++) {
                    $ = mod(this.$outputWrite + j, this.fftBufferSize);
                    this.fftOutput[i][$] += iffted[j];
                    if (i === 0) this.windowSumSquare[$] += this.window[j] ** 2;
                }
                for (let j = iffted.length - this.fftHopSize; j < iffted.length; j++) {
                    $ = mod(this.$outputWrite + j, this.fftBufferSize);
                    this.fftOutput[i][$] = iffted[j];
                    if (i === 0) this.windowSumSquare[$] = this.window[j] ** 2;
                }
            }
            this.$outputWrite += this.fftHopSize;
            this.$outputWrite %= this.fftBufferSize;
        }
    }
    async createFFTProcessor() {
        this.fftProcessor?.stop();
        this.fftProcessor?.destroy();
        const { Faust } = jspatcherEnv as WorkletEnvProcessor;
        const { FaustMonoDspGenerator } = Faust;
        const gen = new FaustMonoDspGenerator();
        this.fftProcessor = await gen.createOfflineProcessor(sampleRate, this.fftProcessorBufferSize, this.fftProcessorFactory) as FaustMonoOfflineProcessor;
        const params = this.fftProcessor.getParams();
        this.fftProcessor.start();
        const fftSizeParam = params.find(s => s.endsWith("/fftSize"));
        if (fftSizeParam) this.fftProcessor.setParamValue(fftSizeParam, this.fftSize);
        this.fftHopSizeParam = params.find(s => s.endsWith("/fftHopSize"));
        if (this.fftHopSizeParam) this.fftProcessor.setParamValue(this.fftHopSizeParam, this.fftHopSize);
    }
    setProcessorParamValue(path: string, value: number) {
        this.fftProcessor?.setParamValue(path, value);
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<FaustFFTParameters, Float32Array>) {
        if (this.destroyed) return false;
        if (!this.fftw) return true;
        const input = inputs[0];
        const output = outputs[0];
        const inputChannels = input.length;
        const outputChannels = output.length;
        if (input.length === 0) return true;

        const bufferSize = Math.max(...input.map(c => c.length)) || 128;

        this.resetFFT(~~parameters.fftSize[0], ~~parameters.fftOverlap[0], ~~parameters.windowFunction[0], inputChannels, outputChannels, bufferSize);

        if (!this.fftProcessor) return true;

        let $inputWrite: number;
        for (let i = 0; i < input.length; i++) {
            const inputWindow = this.fftInput[i];
            const channel = input[i].length ? input[i] : new Float32Array(bufferSize);
            $inputWrite = setTypedArray(inputWindow, channel, this.$inputWrite);
        }
        this.$inputWrite = $inputWrite;

        this.processFFT();

        for (let i = 0; i < output.length; i++) {
            setTypedArray(output[i], this.fftOutput[i], 0, this.$outputRead);
            // let a = 0;
            let div = 0;
            for (let j = 0; j < bufferSize; j++) {
                div = this.windowSumSquare[mod(this.$outputRead + j, this.fftBufferSize)];
                output[i][j] /= div < Number.EPSILON ? 1 : div;
                // a = output[i][j];
                // b = this.windowSumSquare[mod(this.$outputRead + j, this.fftBufferSize)];
                // output[i][j] = Math.abs(a - b) < Number.EPSILON ? Math.sign(a * b) : b < Number.EPSILON ? Math.sign(a * b) : a / b;
            }
        }
        this.$outputRead += bufferSize;
        this.$outputRead %= this.fftBufferSize;
        return true;
    }
}
try {
    registerProcessor(processorId, FaustFFTProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
