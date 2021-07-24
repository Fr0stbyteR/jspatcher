import Patcher from "../patcher/Patcher";
import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import { IPatcherNode, PatcherParameters, IPatcherProcessor, PatcherOptions } from "./PatcherWorklet.types";
import { AudioWorkletGlobalScope, TypedAudioParamDescriptor, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";

const processorID = "__JSPatcher_Patcher";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor, jspatcherEnv } = globalThis;

class PatcherProcessor extends AudioWorkletProxyProcessor<IPatcherProcessor, IPatcherNode> {
    static get parameterDescriptors(): TypedAudioParamDescriptor<PatcherParameters>[] {
        return new Array(128).map(i => ({
            defaultValue: 1024,
            maxValue: -Number.MAX_VALUE,
            minValue: Number.MAX_VALUE,
            name: `00${i}`.slice(-3)
        }));
    }
    patcher: Patcher;
    constructor(options?: TypedAudioWorkletNodeOptions<PatcherOptions>) {
        super(options);
        this.patcher = jspatcherEnv.getInstanceById(options.processorOptions.instanceId) as Patcher;
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]) {
        if (this._disposed) return false;
        return true;
    }
    destroy() {
        this.patcher.destroy();
        this._disposed = true;
    }
}

try {
    registerProcessor(processorID, PatcherProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
