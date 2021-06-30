import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import TaskManager, { TaskError } from "../TaskMgr";
import type { WorkletEnvParameters, IWorkletEnvNode, IWorkletEnvProcessor } from "./WorkletEnv.types";
import type { AudioWorkletGlobalScope, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";
import type { Task } from "../TaskMgr";

export const processorID = "__JSPatcher_WorkletEnv";
declare const globalThis: AudioWorkletGlobalScope;
const { registerProcessor } = globalThis;

class WorkletEnvProcessor extends AudioWorkletProxyProcessor<IWorkletEnvProcessor, IWorkletEnvNode, WorkletEnvParameters> implements IWorkletEnvProcessor {
    static fnNames: (keyof IWorkletEnvNode)[] = ["taskBegin", "taskUpdate", "taskError", "taskEnd"];
    readonly thread = "AudioWorklet";
    readonly taskMgr = new TaskManager();
    constructor(options?: TypedAudioWorkletNodeOptions<any>) {
        super(options);
        globalThis.jspatcherEnv = this;
        this.bindTaskMgr();
    }
    bindTaskMgr() {
        const handleTaskBegin = ({ id, message, emitter }: Task) => this.taskBegin({ id, message, emitter: typeof emitter === "string" ? emitter : emitter.constructor?.name });
        const handleTaskUpdate = ({ id, message }: Task) => this.taskUpdate({ id, message });
        const handleTaskError = ({ id, error }: TaskError) => this.taskError({ id, error });
        const handleTaskEnd = ({ id }: Task) => this.taskEnd({ id });
        this.taskMgr.on("taskBegin", handleTaskBegin);
        this.taskMgr.on("taskUpdate", handleTaskUpdate);
        this.taskMgr.on("taskError", handleTaskError);
        this.taskMgr.on("taskEnd", handleTaskEnd);
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]) {
        if (this._disposed) return false;
        return true;
    }
}

try {
    registerProcessor(processorID, WorkletEnvProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
