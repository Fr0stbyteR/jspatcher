import { EventEmitter } from "events";
import * as Emittery from "emittery";

export class TypedEventEmitter<M> {
    private readonly _emitter = new Emittery();
    on<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.on(eventName, listener);
    }
    events<K extends Extract<keyof M, string>>(eventName: K) {
        return this._emitter.events(eventName) as AsyncIterableIterator<M[K]>;
    }
    async once<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        const data = await this._emitter.once(eventName) as M[K];
        return listener(data);
    }
    off<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        return this._emitter.off(eventName, listener);
    }
    onAny<K extends Extract<keyof M, string>>(listener: (eventName: K, eventData?: M[K]) => void) {
        return this._emitter.onAny(listener);
    }
    anyEvent<K extends Extract<keyof M, string>>() {
        return this._emitter.anyEvent() as AsyncIterableIterator<[M, K]>;
    }
    offAny<K extends Extract<keyof M, string>>(listener: (eventName: K, eventData?: M[K]) => void) {
        return this._emitter.offAny(listener);
    }
    emit<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        return this._emitter.emit(eventName, eventData);
    }
    emitSerial<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        return this._emitter.emitSerial(eventName, eventData);
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
