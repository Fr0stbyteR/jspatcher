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

export interface TypedMessageEvent<T = any> extends MessageEvent {
	data: T;
}
export interface TypedMessagePortEventMap<T = any> extends MessagePortEventMap {
	"message": TypedMessageEvent<T>;
}

export interface TypedEventListener<EventDetail = any> {
    (evt: CustomEvent<EventDetail>): void;
}

export interface TypedEventListenerObject<EventDetail = any> {
    handleEvent(evt: CustomEvent<EventDetail>): void;
}

export type TypedEventListenerOrEventListenerObject<EventDetail = any> = TypedEventListener<EventDetail> | TypedEventListenerObject<EventDetail>;

export interface TypedEventTarget<EventMap extends Record<string, any> = any> extends EventTarget {
	addEventListener<K extends keyof EventMap>(type: K, listener: TypedEventListenerOrEventListenerObject<EventMap[K]> | null, options?: boolean | AddEventListenerOptions): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    dispatchEvent(event: Event): boolean;
    removeEventListener<K extends keyof EventMap>(type: K, listener: TypedEventListenerOrEventListenerObject<EventMap[K]> | null, options?: EventListenerOptions | boolean): void;
	removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
export interface TypedMessagePort<In = any, Out = any> extends MessagePort {
	onmessage: ((this: TypedMessagePort<In, Out>, ev: TypedMessageEvent<In>) => any) | null;
	onmessageerror: ((this: TypedMessagePort<In, Out>, ev: TypedMessageEvent<In>) => any) | null;
	postMessage(message: Out, transfer: Transferable[]): void;
	postMessage(message: Out, options?: PostMessageOptions): void;
	addEventListener<K extends keyof TypedMessagePortEventMap<In>>(type: K, listener: (this: MessagePort, ev: TypedMessagePortEventMap<In>[K]) => any, options?: boolean | AddEventListenerOptions): void;
	addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
	removeEventListener<K extends keyof TypedMessagePortEventMap<In>>(type: K, listener: (this: MessagePort, ev: TypedMessagePortEventMap<In>[K]) => any, options?: boolean | EventListenerOptions): void;
	removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
