import DefaultObject from "./DefaultObject";

export default class RemoteObject<
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends {} = {},
    U extends {} = {},
    E extends {} = {}
> extends DefaultObject<D, S, I, O, A, P, U, E> {
    subscribe() {
        super.subscribe();
        // TODO
    }
}
