import processorURL from "./GlobalTransportProcessor.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import { GlobalTransportParameter, IGlobalTransportNode, IGlobalTransportProcessor } from "./GlobalTransport.types";
import AudioWorkletRegister from "./AudioWorkletRegister";

const processorId = "__JSPatcher_GlobalTransport";

export default class GlobalTransportNode extends AudioWorkletProxyNode<IGlobalTransportNode, IGlobalTransportProcessor, GlobalTransportParameter> implements IGlobalTransportNode {
    static processorId = processorId;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorId, processorURL);
    static fnNames: (keyof IGlobalTransportProcessor)[] = ["_getTick", "_setTick", "destroy"];
    handleReceiveBuffer: (buffer: Float32Array[], $total: number) => any;
    private _tick: Uint32Array = new Uint32Array(new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT));
    constructor(context: BaseAudioContext) {
        super(context, processorId, { numberOfInputs: 0, numberOfOutputs: 1 });
        this.connect(context.destination);
        const _destroy = this.destroy;
        this.destroy = async () => {
            this.disconnect();
            await _destroy.call(this);
            this._disposed = true;
        };
    }
    rewind() {
        this.tick = 0;
    }
    get tick() {
        return Atomics.load(this._tick, 0);
    }
    set tick(tick: number) {
        Atomics.store(this._tick, 0, ~~tick);
        this._setTick(tick);
    }
    updateTick(tick: Uint32Array) {
        this._tick = tick;
    }
}
