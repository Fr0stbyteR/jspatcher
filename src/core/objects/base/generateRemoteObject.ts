import generateDefaultObject from "./generateDefaultObject";
import type BaseObject from "./BaseObject";
import type { RemoteEventMap } from "./RemoteObject";

export default <
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends Partial<RemoteEventMap> & Record<string, any> = RemoteEventMap
>(O: typeof BaseObject) => class extends generateDefaultObject<D, S, I, O, A, P, U, E & RemoteEventMap>(O) {
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
};
