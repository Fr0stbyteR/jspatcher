import { EventEmitter } from "events";

export class TypedEventEmitter<M> {
    private _listeners: { [eventName: string]: ((...e: any[]) => any | Promise<any>)[] } = {};
    get listeners() {
        return this._listeners;
    }
    private getListeners<K extends Extract<keyof M, string>>(eventName: K) {
        if (!(eventName in this._listeners)) this._listeners[eventName] = [];
        return this._listeners[eventName];
    }
    on<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        if (this.getListeners(eventName).indexOf(listener) === -1) this.getListeners(eventName).push(listener);
    }
    off<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => void) {
        const i = this.getListeners(eventName).indexOf(listener);
        if (i !== -1) this.getListeners(eventName).splice(i, 1);
    }
    async emit<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners) return [];
        return Promise.all(listeners.map(f => f(eventData)));
    }
    async emitSerial<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners) return [];
        const returnValues = [];
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            returnValues[i] = await listener(eventData);
        }
        return returnValues;
    }
    emitSync<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        if (!listeners) return [];
        return listeners.map(f => f(eventData));
    }
    removeAllListeners(eventName?: Extract<keyof M, string>) {
        if (eventName) {
            this._listeners[eventName] = [];
        } else {
            this._listeners = {};
        }
    }
    listenerCount(eventName: Extract<keyof M, string>) {
        if (!(eventName in this._listeners)) return 0;
        return this._listeners[eventName].length;
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
