import { ProxyMain } from "./ProxyMain.types";
import { TypedMessageEvent, MessagePortResponse, MessagePortRequest } from "./Worker";

const Main = class ProxyMain {
    static Worker: typeof WebpackWorker;
    static fnNames: string[] = [];
    _disposed = false;
    constructor() {
        const Ctor = (this.constructor as typeof ProxyMain);
        const worker = new Ctor.Worker();
        const resolves: Record<number, ((...args: any[]) => any)> = {};
        const rejects: Record<number, ((...args: any[]) => any)> = {};
        let messagePortRequestId = 1;
        const handleDisposed = () => {
            worker.removeEventListener("message", handleMessage);
            worker.terminate();
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
                worker.postMessage(r);
                if (this._disposed) handleDisposed();
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
        // eslint-disable-next-line
        const call = (call: string, ...args: any[]) => {
            return new Promise<any>((resolve, reject) => {
                const id = messagePortRequestId++;
                resolves[id] = resolve;
                rejects[id] = reject;
                worker.postMessage({ id, call, args });
            });
        };
        Ctor.fnNames.forEach(name => (this as any)[name] = (...args: any[]) => call(name, ...args));
        worker.addEventListener("message", handleMessage);
    }
} as typeof ProxyMain;

export default Main;
