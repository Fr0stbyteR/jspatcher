import type TypedEventEmitter from "../../utils/TypedEventEmitter";
import type { PromisifiedFunctionMap } from "../workers/Worker";

export interface WebSocketRequest<M = Record<string, (...args: any[]) => any>, K extends keyof M = keyof M> {
    id: string;
    call: K;
    args?: M[K] extends (...args: any[]) => any ? Parameters<M[K]> : M[K];
}
export interface WebSocketResponse<M = Record<string, any>, K extends keyof M = keyof M> {
    id: string;
    value?: M[K] extends (...args: any[]) => any ? ReturnType<M[K]> : M[K];
    error?: string;
}

export interface WebSocketLog {
    error?: boolean;
    msg: string;
}

export type ProxyClient<IClient extends {} = {}, IServer extends {} = {}, EventMap extends {} = {}> = PromisifiedFunctionMap<IServer> & IClient & TypedEventEmitter<EventMap> & { _handleLog?: (log: WebSocketLog) => any; _serverUrl: string; _socket: WebSocket; _connect(): Promise<void> };
export const ProxyClient: {
    fnNames: string[];
    prototype: ProxyClient;
    new <IClient extends {} = {}, IServer extends {} = {}, EventMap extends {} = {}>(): ProxyClient<IClient, IServer, EventMap>;
};
