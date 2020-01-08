import { EventEmitter } from "events";

export class MappedEventEmitter<M> {
    private readonly _emitter = new EventEmitter();
    addListener<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.addListener(event as string, listener);
    }
    on<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.on(event as string, listener);
    }
    once<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.once(event as string, listener);
    }
    prependListener<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.prependListener(event as string, listener);
    }
    prependOnceListener<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.prependOnceListener(event as string, listener);
    }
    removeListener<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.removeListener(event as string, listener);
    }
    off<K extends keyof M>(event: K, listener: (e: M[K]) => void) {
        return this._emitter.off(event as string, listener);
    }
    removeAllListeners(event?: keyof M) {
        return this._emitter.removeAllListeners(event as string);
    }
    setMaxListeners(n: number) {
        return this._emitter.setMaxListeners(n);
    }
    getMaxListeners() {
        return this._emitter.getMaxListeners();
    }
    listeners(event: keyof M) {
        return this._emitter.listeners(event as string);
    }
    rawListeners(event: keyof M) {
        return this._emitter.rawListeners(event as string);
    }
    emit<K extends keyof M>(event: K, e?: M[K]) {
        return this._emitter.emit(event as string, e);
    }
    eventNames() {
        return this._emitter.eventNames();
    }
    listenerCount(type: keyof M) {
        return this._emitter.listenerCount(type as string);
    }
}
