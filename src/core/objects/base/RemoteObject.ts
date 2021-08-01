import DefaultObject from "./DefaultObject";

export interface RemoteEventMap {
    "boxIoCountChanged": { inlets: number; outlets: number };
}

export default class RemoteObject<
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends Partial<RemoteEventMap> & Record<string, any> = RemoteEventMap
> extends DefaultObject<D, S, I, O, A, P, U, E & RemoteEventMap> {
    get proxy() {
        return this.patcher.state.patcherNode;
    }
    subscribe() {
        super.subscribe();
        this.on("boxIoCountChanged", ({ inlets, outlets }) => {
            this.inlets = inlets;
            this.outlets = outlets;
        });
    }
}
