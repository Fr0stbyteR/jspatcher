import { AudioWorkletRegister, DisposableAudioWorkletNode } from "./Base";
import processorURL from "./Transmitter.worklet.ts"; // eslint-disable-line import/extensions
import { rms, zcr, setBuffer } from "../../../../utils/buffer";
import { DataFromProcessor, DataToProcessor, processorID } from "./Transmitter";

export interface DataToGet {
    rms?: boolean;
    zcr?: boolean;
    buffer?: boolean;
}
export interface DataGot {
    rms: number[];
    zcr: number[];
    buffer?: { startPointer: number; data: Float32Array[]; sampleIndex: number };
}
export type Parameters = null;
export class TemporalAnalyserNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
    window: Float32Array[] = [];
    $ = 0;
    $total = 0;
    _windowSize = 1024;
    constructor(context: AudioContext, options?: AudioWorkletNodeOptions) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        this.port.onmessage = (e: AudioWorkletMessageEvent<DataFromProcessor>) => {
            const { buffer } = e.data;
            if (buffer) {
                const windowSize = this.windowSize;
                this.$ %= windowSize;
                if (this.window.length > buffer.length) this.window.splice(buffer.length);
                if (buffer.length === 0) return;
                const bufferSize = buffer[0].length;
                this.$total += bufferSize;
                let $ = this.$;
                for (let i = 0; i < buffer.length; i++) {
                    const channel = buffer[i];
                    if (!this.window[i]) {
                        this.window[i] = new Float32Array(windowSize);
                    } else if (this.window[i].length !== windowSize) {
                        const oldWindow = this.window[i];
                        const oldWindowSize = oldWindow.length;
                        const window = new Float32Array(windowSize);
                        if (oldWindowSize > windowSize) {
                            window.set(oldWindow.subarray(oldWindowSize - windowSize));
                            this.$ = 0;
                        } else {
                            window.set(oldWindow);
                        }
                        this.window[i] = window;
                    }
                    const window = this.window[i];
                    $ = this.$;
                    if (bufferSize > windowSize) {
                        window.set(channel.subarray(bufferSize - windowSize));
                        $ = 0;
                    } else {
                        setBuffer(window, channel, $);
                        $ = ($ + bufferSize) % windowSize;
                    }
                }
                this.$ = $;
            }
        };
    }
    get rms() {
        return this.window.map(rms);
    }
    get zcr() {
        return this.window.map(zcr);
    }
    get buffer() {
        const data = this.window;
        return { data, startPointer: this.$, sampleIndex: data.length ? this.$total - data[0].length : 0 };
    }
    get windowSize() {
        return this._windowSize;
    }
    set windowSize(sizeIn: number) {
        this._windowSize = ~~Math.min(2 ** 32, Math.max(128, sizeIn || 1024));
    }
    gets(options: DataToGet): DataGot {
        const message = {} as DataGot;
        if (options.rms) message.rms = this.rms;
        if (options.zcr) message.zcr = this.zcr;
        if (options.buffer) message.buffer = this.buffer;
        return message;
    }
}
export class TemporalAnalyserRegister extends AudioWorkletRegister {
    static processorID = processorID;
    static processorURL = processorURL;
    static Node = TemporalAnalyserNode;
}
