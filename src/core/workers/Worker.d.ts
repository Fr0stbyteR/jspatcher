export type PromisifiedFunction<F extends (...args: any[]) => any> = (...args: Parameters<F>) => ReturnType<F> extends Promise<any> ? ReturnType<F> : Promise<ReturnType<F>>;

export type UnPromisifiedFunction<F extends (...args: any[]) => any> = (...args: Parameters<F>) => ReturnType<F> extends Promise<infer P> ? P : ReturnType<F>;

export type FunctionMap = Record<string, (...args: any[]) => any>;

export type PromisifiedFunctionMap<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? PromisifiedFunction<T[K]> : T[K];
};
export type UnPromisifiedFunctionMap<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? UnPromisifiedFunction<T[K]> : T[K];
};
export interface MessagePortRequest<M = Record<string, (...args: any[]) => any>, K extends keyof M = keyof M> {
    id: number;
    call: K;
    args?: M[K] extends (...args: any[]) => any ? Parameters<M[K]> : M[K];
}
export interface MessagePortResponse<M = Record<string, any>, K extends keyof M = keyof M> {
    id: number;
    value?: M[K] extends (...args: any[]) => any ? ReturnType<M[K]> : M[K];
    error?: Error;
}
