import { EventEmitter } from "events";

export class TypedEventEmitter<M> {
    private _listeners = new Map<string, Set<(...e: any[]) => void | Promise<void>>>();
    get listeners() {
        return this._listeners;
    }
    private getListeners<K extends Extract<keyof M, string>>(eventName: K) {
        if (!this._listeners.has(eventName)) this._listeners.set(eventName, new Set<(e: M[K]) => void | Promise<void>>());
        return this._listeners.get(eventName);
    }
    on<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        this.getListeners(eventName).add(listener);
    }
    off<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        this.getListeners(eventName).delete(listener);
    }
    async emit<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners) return [];
        return Promise.all(Array.from(listeners).map(f => f(eventData)));
    }
    async emitSerial<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners) return;
        /* eslint-disable no-await-in-loop */
        for (const listener of listeners) {
            await listener(eventData);
        }
    }
    emitSync<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners) return [];
        return Array.from(listeners).map(f => f(eventData));
    }
    removeAllListeners(eventName?: Extract<keyof M, string>) {
        if (eventName) {
            const listeners = this.getListeners(eventName);
            if (listeners) listeners.clear();
        } else {
            this._listeners.clear();
        }
    }
    listenerCount(eventName: Extract<keyof M, string>) {
        const listeners = this.getListeners(eventName);
        if (!listeners) return 0;
        return listeners.size;
    }
}

export class TypedEventEmitterNodeJS<M> {
    private readonly _emitter = new EventEmitter();
    addListener<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.addListener(eventName, listener);
    }
    on<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.on(eventName, listener);
    }
    once<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.once(eventName, listener);
    }
    prependListener<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.prependListener(eventName, listener);
    }
    prependOnceListener<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.prependOnceListener(eventName, listener);
    }
    removeListener<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.removeListener(eventName, listener);
    }
    off<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.off(eventName, listener);
    }
    removeAllListeners(event?: Extract<keyof M, string>) {
        return this._emitter.removeAllListeners(event);
    }
    setMaxListeners(n: number) {
        return this._emitter.setMaxListeners(n);
    }
    getMaxListeners() {
        return this._emitter.getMaxListeners();
    }
    listeners(eventName: Extract<keyof M, string>) {
        return this._emitter.listeners(eventName);
    }
    rawListeners(eventName: Extract<keyof M, string>) {
        return this._emitter.rawListeners(eventName);
    }
    emit<K extends Extract<keyof M, string>>(eventName: K, e?: M[K]) {
        return this._emitter.emit(eventName, e);
    }
    eventNames() {
        return this._emitter.eventNames();
    }
    listenerCount(eventName: Extract<keyof M, string>) {
        return this._emitter.listenerCount(eventName);
    }
}
