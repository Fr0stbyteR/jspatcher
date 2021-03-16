import { ProxyMain } from "./ProxyMain.types";
import { TypedMessageEvent, MessagePortResponse, MessagePortRequest } from "./Worker";

const Main = class {
    static get Worker(): typeof WebpackWorker {
        return undefined;
    }
    static get fnNames(): string[] {
        return [];
    }
    constructor() {
        const Ctor = (this.constructor as typeof ProxyMain);
        const worker = new Ctor.Worker();
        const resolves: Record<number, ((...args: any[]) => any)> = {};
        const rejects: Record<number, ((...args: any[]) => any)> = {};
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
                const id = performance.now();
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
