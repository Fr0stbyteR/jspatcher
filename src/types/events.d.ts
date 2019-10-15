declare module "events" {
    export interface EventEmitter<M = { [key: string]: any }, K extends keyof M = keyof M> {
        addListener(event: K, listener: (e: M[K]) => void): this;
        on(event: K, listener: (e: M[K], ...args: any) => void): this;
        once(event: K, listener: (e: M[K]) => void): this;
        prependListener(event: K, listener: (e: M[K]) => void): this;
        prependOnceListener(event: K, listener: (e: M[K]) => void): this;
        removeListener(event: K, listener: (e: M[K]) => void): this;
        off(event: K, listener: (e: M[K]) => void): this;
        removeAllListeners(event?: K): this;
        setMaxListeners(n: number): this;
        getMaxListeners(): number;
        listeners(event: K): Function[];
        rawListeners(event: K): Function[];
        emit(event: K, e?: M[K]): boolean;
        eventNames(): K[];
        listenerCount(type: K): number;
    }
}
