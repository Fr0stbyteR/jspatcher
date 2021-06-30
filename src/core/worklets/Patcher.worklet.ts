import Patcher from "../patcher/Patcher";
import { PackageManager } from "../PkgMgr";
import { RawPatcher } from "../types";
import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import { IPatcherNode, IPatcherProcessor } from "./PatcherWorklet.types";
import { AudioWorkletGlobalScope } from "./TypedAudioWorklet";

const processorID = "__JSPatcher_Patcher";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor } = globalThis;

class PatcherProcessor extends AudioWorkletProxyProcessor<IPatcherProcessor, IPatcherNode> {
    patcher = new Patcher();
    async load(patcherIn: RawPatcher) {
        await this.patcher.load(patcherIn, "jsaw");
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
