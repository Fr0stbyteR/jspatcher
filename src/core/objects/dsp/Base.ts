import { BaseAudioObject, DefaultAudioObject } from "../Base";

export class BaseDSP<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends {} = {},
    U extends {} = {}, E extends {} = {}
> extends BaseAudioObject<D, S, I, O, A, P, U, E> {
    static package = "dsp";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
}

export class DefaultDSP<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends {} = {},
    U extends {} = {}, E extends {} = {}
> extends DefaultAudioObject<D, S, I, O, A, P, U, E> {
    static package = "dsp";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
}
