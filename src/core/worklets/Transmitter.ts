import processorURL from "./Transmitter.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import { ITransmitterNode, ITransmitterProcessor, TransmitterParameters } from "./TransmitterWorklet.types";
import AudioWorkletRegister from "./AudioWorkletRegister";

export const processorId = "__JSPatcher_Transmitter";
export default class TransmitterNode extends AudioWorkletProxyNode<ITransmitterNode, ITransmitterProcessor, TransmitterParameters> implements ITransmitterNode {
    static processorId = processorId;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorId, processorURL);
    static fnNames: (keyof ITransmitterProcessor)[] = ["start", "stop", "reset", "destroy"];
    handleReceiveBuffer: (buffer: Float32Array[], $total: number) => any;
    constructor(context: BaseAudioContext) {
        super(context, processorId, { numberOfInputs: 1, numberOfOutputs: 0 });
        const _destroy = this.destroy;
        this.destroy = async () => {
            await _destroy.call(this);
            this._disposed = true;
        };
    }
    setBuffer({ buffer, $total }: { buffer: Float32Array[]; $total: number }) {
        if (this.handleReceiveBuffer) this.handleReceiveBuffer(buffer, $total);
    }
}
