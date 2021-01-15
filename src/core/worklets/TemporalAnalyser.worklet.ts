import { rms, zcr, setTypedArray, absMax } from "../../utils/buffer";
import yinEstimate from "../../utils/yin";
import { AudioWorkletGlobalScope, TypedAudioParamDescriptor } from "./TypedAudioWorklet";
import { ITemporalAnalyserProcessor, ITemporalAnalyserNode, TemporalAnalyserParameters, TemporalAnalysis } from "./TemporalAnalyserWorklet.types";
import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";

const processorID = "__JSPatcher_TemporalAnalyser";
declare const globalThis: AudioWorkletGlobalScope & { SharedArrayBuffer: typeof SharedArrayBuffer | typeof ArrayBuffer; Atomics: typeof Atomics };
if (!globalThis.SharedArrayBuffer) globalThis.SharedArrayBuffer = ArrayBuffer;
const { registerProcessor, sampleRate } = globalThis;

/**
 * Some data to transfer across threads
 */
class TemporalAnalyserAtoms {
    private readonly _sab: SharedArrayBuffer;
    private readonly _lock: Int32Array;
    private readonly _$: Uint32Array;
    private readonly _$total: Uint32Array;
    /**
     * Atomic Lock
     */
    get lock(): number {
        return globalThis.Atomics ? Atomics.load(this._lock, 0) : null;
    }
    set lock(value: number) {
        if (globalThis.Atomics) Atomics.store(this._lock, 0, value);
    }
    /**
     * Next audio sample index to write into window
     */
    get $(): number {
        return this._$[0];
    }
    set $(value: number) {
        this._$[0] = value;
    }
    /**
     * Total samples written counter
     */
    get $total(): number {
        return this._$total[0];
    }
    set $total(value: number) {
        this._$total[0] = value;
    }
    /**
     * Infinite loop until unlocked
     */
    wait() {
        while (this.lock);
    }
    /**
     * Get all atoms
     */
    get asObject() {
        return { $: this._$, $total: this._$total, lock: this._lock };
    }
    constructor() {
        this._sab = new SharedArrayBuffer(3 * Uint32Array.BYTES_PER_ELEMENT);
        this._lock = new Int32Array(this._sab, 0, 1);
        this._$ = new Uint32Array(this._sab, 4, 1);
        this._$total = new Uint32Array(this._sab, 8, 1);
    }
}
class TemporalAnalyserProcessor extends AudioWorkletProxyProcessor<ITemporalAnalyserProcessor, ITemporalAnalyserNode, TemporalAnalyserParameters> implements ITemporalAnalyserProcessor {
    static get parameterDescriptors(): TypedAudioParamDescriptor<TemporalAnalyserParameters>[] {
        return [{
            defaultValue: 1024,
            maxValue: 2 ** 32,
            minValue: 128,
            name: "windowSize"
        }];
    }
    private destroyed = false;
    private readonly atoms = new TemporalAnalyserAtoms();
    /**
     * Concatenated audio data, array of channels
     */
    private readonly windowSab: SharedArrayBuffer[] = [];
    /**
     * Float32Array Buffer view of window
     */
    private readonly window: Float32Array[] = [];
    /**
     * Atomic Lock
     */
    get lock() {
        return this.atoms.lock;
    }
    set lock(value: number) {
        this.atoms.lock = value;
    }
    /**
     * Next audio sample index to write into window
     */
    get $() {
        return this.atoms.$;
    }
    set $(value: number) {
        this.atoms.$ = value;
    }
    /**
     * Total samples written counter
     */
    get $total() {
        return this.atoms.$total;
    }
    set $total(value: number) {
        this.atoms.$total = value;
    }
    /**
     * Infinite loop until unlocked
     */
    wait() {
        this.atoms.wait();
    }
    getRms() {
        return this.window.map(rms);
    }
    getAbsMax() {
        return this.window.map(absMax);
    }
    getZcr() {
        return this.window.map(zcr);
    }
    getEstimatedFreq(threshold?: number, probabilityThreshold?: number) {
        return this.window.map(ch => yinEstimate(ch, { sampleRate, threshold, probabilityThreshold }));
    }
    getBuffer() {
        const data = this.window;
        const { $, $total, lock } = this.atoms.asObject;
        return { data, $, $total, lock };
    }
    gets<K extends keyof TemporalAnalysis>(...analysis: K[]) {
        const result: Partial<TemporalAnalysis> = {};
        for (const key of analysis) {
            if (typeof key !== "string" || !key.length) continue;
            const method = `get${key.charAt(0).toUpperCase()}${key.slice(1)}` as `get${Capitalize<string & K>}`;
            if (this[method]) result[key] = this[method]() as TemporalAnalysis[K];
        }
        return result;
    }
    destroy() {
        this.destroyed = true;
        this.port.close();
    }
    private _windowSize = 1024;
    get windowSize() {
        return this._windowSize;
    }
    set windowSize(sizeIn: number) {
        this._windowSize = ~~Math.min(2 ** 32, Math.max(128, sizeIn || 1024));
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<TemporalAnalyserParameters, Float32Array>) {
        if (this.destroyed) return false;
        const input = inputs[0];
        this.windowSize = ~~parameters.windowSize[0];
        const { windowSize } = this;

        if (this.window.length > input.length) { // Too much channels ?
            this.windowSab.splice(input.length);
            this.window.splice(input.length);
        }
        if (input.length === 0) return true;

        const bufferSize = Math.max(...input.map(c => c.length)) || 128;

        this.wait();
        this.lock = 1;

        this.$ %= windowSize;
        this.$total += bufferSize;
        let { $ } = this;
        // Init windows
        for (let i = 0; i < input.length; i++) {
            $ = this.$;
            if (!this.window[i]) { // Initialise channel if not exist
                this.windowSab[i] = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
                this.window[i] = new Float32Array(windowSize);
            } else {
                if (this.window[i].length !== windowSize) { // adjust window size if not corresponded
                    const oldWindow = this.window[i];
                    const oldWindowSize = oldWindow.length;
                    const windowSab = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
                    const window = new Float32Array(windowSab);
                    $ = setTypedArray(window, oldWindow, 0, $ - Math.min(windowSize, oldWindowSize));
                    this.windowSab[i] = windowSab;
                    this.window[i] = window;
                }
            }
        }
        this.$ = $;
        // Write
        for (let i = 0; i < input.length; i++) {
            const window = this.window[i];
            const channel = input[i].length ? input[i] : new Float32Array(bufferSize);
            $ = this.$;
            if (bufferSize > windowSize) {
                window.set(channel.subarray(bufferSize - windowSize));
                $ = 0;
            } else {
                $ = setTypedArray(window, channel, $);
            }
        }
        this.$ = $;
        this.lock = 0;
        return true;
    }
}
try {
    registerProcessor(processorID, TemporalAnalyserProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
