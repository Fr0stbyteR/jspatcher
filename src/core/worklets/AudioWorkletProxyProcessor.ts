import { AudioWorkletGlobalScope, MessagePortRequest, MessagePortResponse, TypedMessageEvent } from "./TypedAudioWorklet";
import { AudioWorkletProxyProcessor } from "./AudioWorkletProxyProcessor.types";

declare const globalThis: AudioWorkletGlobalScope;
const { AudioWorkletProcessor } = globalThis;

const Processor = class AudioWorkletProxyProcessor extends AudioWorkletProcessor {
    static fnNames: string[] = [];
    _disposed = false;
    constructor(options: AudioWorkletNodeOptions) {
        super(options);
        const resolves: Record<number, ((...args: any[]) => any)> = {};
        const rejects: Record<number, ((...args: any[]) => any)> = {};
        let messagePortRequestId = -1;
        const handleDisposed = () => {
            this.port.removeEventListener("message", handleMessage);
            this.port.close();
        };
        const handleMessage = async (e: TypedMessageEvent<MessagePortResponse & MessagePortRequest>) => {
            const { id, call, args, value, error } = e.data;
            if (call) {
                const r: MessagePortResponse = { id };
                try {
                    r.value = await (this as any)[call](...args);
                } catch (e) {
                    r.error = e;
                }
                this.port.postMessage(r as any);
                if (this._disposed) handleDisposed();
            } else {
                if (error) rejects[id]?.(error);
                else if (resolves[id]) resolves[id]?.(value);
                delete resolves[id];
                delete rejects[id];
            }
        };
        const call = (call: string, ...args: any[]) => new Promise<any>((resolve, reject) => {
            const id = messagePortRequestId--;
            resolves[id] = resolve;
            rejects[id] = reject;
            this.port.postMessage({ id, call, args });
        });
        const Ctor = (this.constructor as typeof AudioWorkletProxyProcessor);
        Ctor.fnNames.forEach(name => (this as any)[name] = (...args: any[]) => call(name, ...args));
        this.port.start();
        this.port.addEventListener("message", handleMessage);
    }
} as typeof AudioWorkletProxyProcessor;

export default Processor;
