import { TypedMessageEvent, MessagePortResponse } from "../worklets/AudioWorklet";
import { ProxyWorker } from "./ProxyWorker.types";

const Worker = class {
    static get fnNames(): string[] {
        return [];
    }
    constructor() {
        const resolves: Record<number, ((...args: any[]) => any)> = {};
        const rejects: Record<number, ((...args: any[]) => any)> = {};
        let messagePortRequestId = -1;
        const handleMessage = async (e: TypedMessageEvent) => {
            const { id, call, args, value, error } = e.data;
            if (call) {
                const r: MessagePortResponse = { id };
                try {
                    r.value = await (this as any)[call](...args);
                } catch (e) {
                    r.error = e;
                }
                postMessage(r as any);
            } else {
                if (error) {
                    if (rejects[id]) rejects[id](error);
                    delete rejects[id];
                    return;
                }
                if (resolves[id]) {
                    resolves[id](value);
                    delete resolves[id];
                }
            }
        };
        const call = (call: string, ...args: any[]) => new Promise<any>((resolve, reject) => {
            const id = messagePortRequestId--;
            resolves[id] = resolve;
            rejects[id] = reject;
            postMessage({ id, call, args });
        });
        const Ctor = (this.constructor as typeof ProxyWorker);
        Ctor.fnNames.forEach(name => (this as any)[name] = (...args: any[]) => call(name, ...args));
        addEventListener("message", handleMessage);
    }
} as typeof ProxyWorker;

export default Worker;
