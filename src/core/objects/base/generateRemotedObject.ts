import type BaseObject from "./BaseObject";

export default <
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends {} = {}
>(O: typeof BaseObject) => class RemotedObject extends O<D, S, I, O, A, P, U, E> {
    get proxy() {
        return this.patcher.state.patcherProcessor;
    }
    subscribe() {
        super.subscribe();
        const handleBoxIoCountChanged = () => {
            const { id, inlets, outlets } = this.box;
            this.proxy.objectEmitFromWorklet(id, "boxIoCountChanged", { inlets, outlets });
        };
        this.box.on("ioCountChanged", handleBoxIoCountChanged);
        this.on("destroy", () => this.box.off("ioCountChanged", handleBoxIoCountChanged));
    }
};
