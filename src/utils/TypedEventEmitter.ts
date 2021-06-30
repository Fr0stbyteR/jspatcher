export const $AnyEventType = Symbol("__TypedEventListener_AnyEventType");
export class TypedEventEmitter<M> {
    private _listeners: { [eventName: string]: ((e: any) => any | Promise<any>)[]; [$AnyEventType]: ((e: { eventName: string; eventData?: any }) => any | Promise<any>)[] } = { [$AnyEventType]: [] };
    get listeners() {
        return this._listeners;
    }
    private getListeners<K extends Extract<keyof M, string>>(eventName: K) {
        if (!(eventName in this._listeners)) this._listeners[eventName] = [];
        return this._listeners[eventName];
    }
    on<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any) {
        if (this.getListeners(eventName).indexOf(listener) === -1) this.getListeners(eventName).push(listener);
    }
    once<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any) {
        const listenerWithOff = (arg: M[K]) => {
            const returnValue = listener(arg);
            this.off(eventName, listenerWithOff);
            return returnValue;
        };
        this.on(eventName, listenerWithOff);
    }
    onAny<K extends Extract<keyof M, string>>(listener: (e: { eventName: K; eventData?: M[K] }) => any) {
        this._listeners[$AnyEventType].push(listener);
    }
    off<K extends Extract<keyof M, string>>(eventName: K, listener: (e: M[K]) => any) {
        const i = this.getListeners(eventName).indexOf(listener);
        if (i !== -1) this.getListeners(eventName).splice(i, 1);
    }
    offAny<K extends Extract<keyof M, string>>(listener: (e: { eventName: K; eventData?: M[K] }) => any) {
        const i = this._listeners[$AnyEventType].indexOf(listener);
        if (i !== -1) this._listeners[$AnyEventType].splice(i, 1);
    }
    async emit<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        const anyListeners = this._listeners[$AnyEventType];
        if (!listeners.length && !anyListeners.length) return [];
        return Promise.all([...listeners.map(f => f(eventData)), ...anyListeners.map(f => f({ eventName, eventData }))]);
    }
    async emitSerial<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        const anyListeners = this._listeners[$AnyEventType];
        if (!listeners.length && !anyListeners.length) return [];
        const returnValues = [];
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            returnValues[i] = await listener(eventData);
        }
        for (let i = 0; i < anyListeners.length; i++) {
            const listener = anyListeners[i];
            returnValues[listeners.length + i] = await listener({ eventName, eventData });
        }
        return returnValues;
    }
    emitSync<K extends Extract<keyof M, string>>(eventName: K, eventData?: M[K]) {
        const listeners = this.getListeners(eventName);
        const anyListeners = this._listeners[$AnyEventType];
        if (!listeners.length && !anyListeners.length) return [];
        return [...listeners.map(f => f(eventData)), ...anyListeners.map(f => f({ eventName, eventData }))];
    }
    removeAllListeners(eventName?: Extract<keyof M, string>) {
        if (eventName) {
            this._listeners[eventName] = [];
        } else {
            this._listeners = { [$AnyEventType]: [] };
        }
    }
    listenerCount(eventName: Extract<keyof M, string>) {
        const anyListenerCount = this._listeners[$AnyEventType].length;
        if (!(eventName in this._listeners)) return anyListenerCount;
        return this._listeners[eventName].length + anyListenerCount;
    }
}

export default TypedEventEmitter;
