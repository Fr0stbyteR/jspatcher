export const $AnyEventType = Symbol("__TypedEventListener_AnyEventType");
export interface ITypedEventEmitter<M> extends Omit<TypedEventEmitter<M>, "_listeners" | "getListeners"> {
}
export interface IEmitOptions {
    /** if true, the emission will not trigger `onAny` listeners */
    excludeAny?: boolean;
    /** Exclude listeners with emit */
    exclude?: ((...args: any[]) => any)[];
}
export class TypedEventEmitter<M> {
    private _listeners: { [eventName: string]: ((e?: any, emitter?: any) => any | Promise<any>)[]; [$AnyEventType]: ((eventName: string, eventData?: any, emitter?: any) => any | Promise<any>)[] } = { [$AnyEventType]: [] };
    get listeners() {
        return this._listeners;
    }
    private getListeners<K extends keyof M & string>(eventName: K) {
        if (!(eventName in this._listeners)) this._listeners[eventName] = [];
        return this._listeners[eventName];
    }
    on<K extends keyof M & string>(eventName: K, listener: (e: M[K], emitter?: this) => any) {
        if (this.getListeners(eventName).indexOf(listener) === -1) this.getListeners(eventName).push(listener);
    }
    once<K extends keyof M & string>(eventName: K, listener: (e: M[K], emitter?: this) => any) {
        const listenerWithOff = (arg: M[K], emitter?: this) => {
            const returnValue = listener(arg, emitter);
            this.off(eventName, listenerWithOff);
            return returnValue;
        };
        this.on(eventName, listenerWithOff);
    }
    onAny<K extends keyof M & string>(listener: <KK extends K>(eventName: KK, eventData?: M[KK], emitter?: this) => any) {
        this._listeners[$AnyEventType].push(listener);
    }
    off<K extends keyof M & string>(eventName: K, listener: (e: M[K], emitter?: this) => any) {
        const i = this.getListeners(eventName).indexOf(listener);
        if (i !== -1) this.getListeners(eventName).splice(i, 1);
    }
    offAny<K extends keyof M & string>(listener: <KK extends K>(eventName: KK, eventData?: M[KK], emitter?: this) => any) {
        const i = this._listeners[$AnyEventType].indexOf(listener);
        if (i !== -1) this._listeners[$AnyEventType].splice(i, 1);
    }
    async emit<K extends keyof M & string>(eventName: K, eventData?: M[K], options?: IEmitOptions) {
        let listeners = this.getListeners(eventName);
        let anyListeners = options?.excludeAny ? [] : this._listeners[$AnyEventType];
        if (!listeners.length && !anyListeners.length) return [];
        if (options?.exclude?.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        return Promise.all([...listeners.map(f => f(eventData, this)), ...anyListeners.map(f => f(eventName, eventData, this))]);
    }
    async emitSerial<K extends keyof M & string>(eventName: K, eventData?: M[K], options?: IEmitOptions) {
        let listeners = this.getListeners(eventName);
        let anyListeners = options?.excludeAny ? [] : this._listeners[$AnyEventType];
        if (!listeners.length && !anyListeners.length) return [];
        if (options?.exclude?.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        const returnValues = [];
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            returnValues[i] = await listener(eventData, this);
        }
        for (let i = 0; i < anyListeners.length; i++) {
            const listener = anyListeners[i];
            returnValues[listeners.length + i] = await listener(eventName, eventData, this);
        }
        return returnValues;
    }
    emitSync<K extends keyof M & string>(eventName: K, eventData?: M[K], options?: IEmitOptions) {
        let listeners = this.getListeners(eventName);
        let anyListeners = options?.excludeAny ? [] : this._listeners[$AnyEventType];
        if (!listeners.length && !anyListeners.length) return [];
        if (options?.exclude?.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        return [...listeners.map(f => f(eventData, this)), ...anyListeners.map(f => f(eventName, eventData, this))];
    }
    offAll(eventName?: keyof M & string) {
        if (eventName) {
            this._listeners[eventName] = [];
        } else {
            this._listeners = { [$AnyEventType]: [] };
        }
    }
    listenerCount(eventName: keyof M & string) {
        const anyListenerCount = this._listeners[$AnyEventType].length;
        if (!(eventName in this._listeners)) return anyListenerCount;
        return this._listeners[eventName].length + anyListenerCount;
    }
}

export default TypedEventEmitter;
