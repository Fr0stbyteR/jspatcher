import { ProxyWorker } from "./ProxyWorker.types";
import { MessagePortResponse, MessagePortRequest } from "./Worker";

const Worker = class ProxyWorker {
    static fnNames: string[] = [];
    _disposed = false;
    constructor() {
        const resolves: Record<number, ((...args: any[]) => any)> = {};
        const rejects: Record<number, ((...args: any[]) => any)> = {};
        let messagePortRequestId = -1;
        const handleDisposed = () => {
            removeEventListener("message", handleMessage);
            close();
        };
        const handleMessage = async (e: MessageEvent<MessagePortResponse & MessagePortRequest>) => {
            const { id, call, args, value, error } = e.data;
            if (call) {
                const r: MessagePortResponse = { id };
                try {
                    r.value = await (this as any)[call](...args);
                } catch (e) {
                    r.error = e;
                }
                postMessage(r as any);
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
            postMessage({ id, call, args });
        });
        const Ctor = (this.constructor as typeof ProxyWorker);
        Ctor.fnNames.forEach(name => (this as any)[name] = (...args: any[]) => call(name, ...args));
        addEventListener("message", handleMessage);
    }
} as typeof ProxyWorker;

export default Worker;
