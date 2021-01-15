import { setTypedArray } from "../../utils/buffer";
import { AudioWorkletGlobalScope } from "./TypedAudioWorklet";
import { ITransmitterProcessor, ITransmitterNode, TransmitterParameters } from "./TransmitterWorklet.types";
import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";

const processorID = "__JSPatcher_Transmitter";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor } = globalThis;

class TransmitterProcessor extends AudioWorkletProxyProcessor<ITransmitterProcessor, ITransmitterNode, TransmitterParameters> implements ITransmitterProcessor {
    static fnNames: (keyof ITransmitterNode)[] = ["setBuffer"];
    private destroyed = false;
    private readonly window: Float32Array[] = [];
    enabled = false;
    $ = 0;
    $total = 0;
    private _windowSize = 1024;

    start() {
        this.enabled = true;
    }
    stop() {
        this.enabled = false;
    }
    reset() {
        this.$ = 0;
        this.$total = 0;
    }
    destroy() {
        this.destroyed = true;
        this._disposed = true;
    }
    get windowSize() {
        return this._windowSize;
    }
    set windowSize(sizeIn: number) {
        this._windowSize = ~~Math.min(2 ** 32, Math.max(128, sizeIn || 1024));
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]) {
        if (this.destroyed) return false;
        if (!this.enabled) return true;
        const input = inputs[0];
        const { windowSize } = this;

        if (this.window.length > input.length) { // Too much channels ?
            this.window.splice(input.length);
        }
        if (input.length === 0) return true;

        this.$ %= windowSize;
        const bufferSize = Math.max(...input.map(c => c.length)) || 128;
        this.$total += bufferSize;
        let { $ } = this;
        // Init windows
        for (let i = 0; i < input.length; i++) {
            $ = this.$;
            if (!this.window[i]) { // Initialise channel if not exist
                this.window[i] = new Float32Array(windowSize);
            }
        }
        this.$ = $;
        // Write
        for (let i = 0; i < input.length; i++) {
            const window = this.window[i];
            const channel = input[i].length ? input[i] : new Float32Array(bufferSize);
            $ = this.$;
            $ = setTypedArray(window, channel, $);
        }
        this.$ = $;
        if ($ === 0) {
            this.setBuffer({ buffer: this.window, $total: this.$total });
        }
        return true;
    }
}
try {
    registerProcessor(processorID, TransmitterProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
