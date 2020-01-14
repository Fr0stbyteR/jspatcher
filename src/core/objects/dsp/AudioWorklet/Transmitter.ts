import { DisposableAudioWorkletNode } from "./Base";
import { setBuffer } from "../../../../utils/buffer";

export type DataToProcessor = DisposableAudioWorkletMessageEventDataToProcessor;
export interface DataFromProcessor {
    bufferIndex: number;
    buffer: Float32Array[];
}
export interface DataToGet {
    buffer?: boolean;
}
export interface DataGot {
    buffer?: { startPointer: number; data: Float32Array[]; sampleIndex: number };
}
export type Parameters = "windowSize";
export const processorID = "__JSPatcher_Transmitter";
export class TransmitterNode extends DisposableAudioWorkletNode<DataFromProcessor, DataToProcessor, Parameters> {
    window: Float32Array[] = [];
    $ = 0;
    $total = 0;
    constructor(context: AudioContext, options?: AudioWorkletNodeOptions) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        this.port.onmessage = (e: AudioWorkletMessageEvent<DataFromProcessor>) => {
            const { buffer } = e.data;
            if (buffer) {
                const windowSize = ~~this.parameters.get("windowSize") || 1024;
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
    get buffer() {
        const data = this.window;
        return { data, startPointer: this.$, sampleIndex: data.length ? this.$total - data[0].length : 0 };
    }
    gets(options: DataToGet): DataGot {
        const message = {} as DataGot;
        if (options.buffer) {
            const data = this.window;
            message.buffer = { data, startPointer: this.$, sampleIndex: data.length ? this.$total - data[0].length : 0 };
        }
        return message;
    }
}
