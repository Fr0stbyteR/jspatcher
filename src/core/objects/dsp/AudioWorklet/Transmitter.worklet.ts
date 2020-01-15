import { DataToProcessor, DataFromProcessor, Parameters } from "./Transmitter";

const processorID = "__JSPatcher_Transmitter";

class TransmitterProcessor extends AudioWorkletProcessor<DataToProcessor, DataFromProcessor, Parameters> {
    destroyed = false;
    $ = 0;
    constructor(options: AudioWorkletNodeOptions) {
        super(options);
        this.port.onmessage = () => undefined;
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in Parameters]: Float32Array }) {
        if (this.destroyed) return false;
        const input = inputs[0];
        if (input.length === 0) return true;
        const bufferSize = input[0].length || 128;
        for (let i = 0; i < input.length; i++) {
            if (!input[i].length) input[i] = new Float32Array(bufferSize);
        }
        this.port.postMessage({ buffer: input, bufferIndex: this.$++ });
        return true;
    }
    destroy() {
        this.destroyed = true;
        this.port.close();
    }
}
registerProcessor(processorID, TransmitterProcessor);
