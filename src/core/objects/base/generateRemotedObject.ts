import type BaseObject from "./BaseObject";

export interface RemotedObjectEventMap {
    "outlet": { outlet: number; data: any };
}

/** Generate an object that can be used in the AudioWorklet as remoted. */
export default <
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends Partial<RemotedObjectEventMap> & Record<string, any> = {}
>(O: typeof BaseObject) => class RemotedObject extends O<D, S, I, O, A, P, U, E & RemotedObjectEventMap> {
    get proxy() {
        return this.patcher.state.patcherProcessor;
    }
    subscribe() {
        super.subscribe();
        const handleBoxIoCountChanged = () => {
            const { id, inlets, outlets } = this.box;
            this.proxy?.objectEmitFromWorklet(id, "boxIoCountChanged", { inlets, outlets });
        };
        this.box.on("ioCountChanged", handleBoxIoCountChanged);
        this.on("outlet", ({ outlet, data }) => this.outlet(outlet, data));
        this.on("destroy", () => this.box.off("ioCountChanged", handleBoxIoCountChanged));
    }
};
