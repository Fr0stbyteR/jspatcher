import DefaultObject from "../base/DefaultObject";

export class DefaultSerialObject<D = {}, S = {}, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P = {}, U = {}, E = {}> extends DefaultObject<D, S, I, O, A, P, U, E> {
    static package = "WebSerial";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "WebSerial Object";
}
