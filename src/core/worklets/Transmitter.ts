// import { TContext } from "standardized-audio-context";
import processorURL from "./Transmitter.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import { ITransmitterNode, ITransmitterProcessor, TransmitterParameters } from "./TransmitterWorklet.types";
import AudioWorkletRegister from "./AudioWorkletRegister";

export const processorID = "__Sheng_Transmitter";
export class TransmitterNode extends AudioWorkletProxyNode<ITransmitterNode, ITransmitterProcessor, TransmitterParameters> implements ITransmitterNode {
    static fnNames: (keyof ITransmitterProcessor)[] = ["start", "stop", "reset", "destroy"];
    handleReceiveBuffer: (buffer: Float32Array[], $total: number) => any;
    constructor(context: BaseAudioContext) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        const _destroy = this.destroy;
        this.destroy = async () => {
            await _destroy.call(this);
            this.port.close();
        };
    }
    setBuffer({ buffer, $total }: { buffer: Float32Array[]; $total: number }) {
        if (this.handleReceiveBuffer) this.handleReceiveBuffer(buffer, $total);
    }
}
export const register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorID, processorURL);
export const Node = TransmitterNode;
