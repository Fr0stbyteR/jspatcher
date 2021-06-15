import { PromisifiedFunctionMap } from "./Worker";

export type ProxyWorker<IWorker extends {} = {}, IMain extends {} = {}> = PromisifiedFunctionMap<IMain> & IWorker & { _disposed: boolean };
export const ProxyWorker: {
    fnNames: string[];
    prototype: ProxyWorker;
    new <IWorker extends {} = {}, IMain extends {} = {}>(): ProxyWorker<IWorker, IMain>;
};
