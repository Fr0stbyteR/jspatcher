import { DataToProcessor, DataFromProcessor, Parameters } from "./TemporalAnalyser";
import { rms, zcr, setTypedArray } from "../../../../utils/buffer";

const processorID = "__JSPatcher_TemporalAnalyser";

class TemporalAnalyserProcessor extends AudioWorkletProcessor<DataToProcessor, DataFromProcessor, Parameters> {
    static get parameterDescriptors(): AudioWorkletAudioParamDescriptor<Parameters>[] {
        return [{
            defaultValue: 1024,
            maxValue: 2 ** 32,
            minValue: 128,
            name: "windowSize"
        }];
    }
    private destroyed = false;
    /**
     * Concatenated audio data, array of channels
     *
     * @type {SharedArrayBuffer[]}
     * @memberof TemporalAnalyserProcessor
     */
    private window: SharedArrayBuffer[] = [];
    /**
     * Float32Array Buffer view of window
     *
     * @private
     * @type {Float32Array[]}
     * @memberof TemporalAnalyserProcessor
     */
    private windowF32: Float32Array[] = [];
    /**
     * Next audio sample index to write into window
     *
     * @memberof TemporalAnalyserProcessor
     */
    private $ = 0;
    /**
     * Total samples written counter
     *
     * @memberof TemporalAnalyserProcessor
     */
    private $total = 0;
    private _windowSize = 1024;
    constructor(options: AudioWorkletNodeOptions) {
        super(options);
        this.port.onmessage = (e) => {
            const { id } = e.data;
            if (e.data.destroy) this.destroy();
            const message = {} as DataFromProcessor;
            if (e.data.rms) message.rms = this.rms;
            if (e.data.zcr) message.zcr = this.zcr;
            if (e.data.buffer) message.buffer = this.buffer;
            this.port.postMessage({ id, ...message });
        };
    }
    get rms() {
        return this.windowF32.map(rms);
    }
    get zcr() {
        return this.windowF32.map(zcr);
    }
    get buffer() {
        const data = this.windowF32;
        return { data, startPointer: this.$, sampleIndex: data.length ? this.$total - data[0].length : 0 };
    }
    get windowSize() {
        return this._windowSize;
    }
    set windowSize(sizeIn: number) {
        this._windowSize = ~~Math.min(2 ** 32, Math.max(128, sizeIn || 1024));
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in Parameters]: Float32Array }) {
        if (this.destroyed) return false;
        const input = inputs[0];
        this.windowSize = ~~parameters.windowSize[0];
        const { windowSize } = this;
        this.$ %= windowSize;
        if (this.window.length > input.length) { // Too much channels ?
            this.window.splice(input.length);
            this.windowF32.splice(input.length);
        }
        if (input.length === 0) return true;
        const bufferSize = Math.max(...input.map(c => c.length)) || 128;
        this.$total += bufferSize;
        let { $ } = this;
        // Init windows
        for (let i = 0; i < input.length; i++) {
            $ = this.$;
            if (!this.window[i]) { // Initialise channel if not exist
                this.window[i] = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
                this.windowF32[i] = new Float32Array(this.window[i]);
            } else {
                if (this.windowF32[i].length !== windowSize) { // adjust window size if not corresponded
                    const oldWindow = this.window[i];
                    const oldWindowSize = oldWindow.length;
                    const window = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
                    $ = setTypedArray(new Float32Array(window), new Float32Array(oldWindow), 0, $ - Math.min(windowSize, oldWindowSize));
                    this.window[i] = window;
                    this.windowF32[i] = new Float32Array(window);
                }
            }
        }
        this.$ = $;
        // Write
        for (let i = 0; i < input.length; i++) {
            const window = this.windowF32[i];
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
        return true;
    }
    destroy() {
        this.destroyed = true;
        this.port.close();
        this.window = [];
    }
}
registerProcessor(processorID, TemporalAnalyserProcessor);
