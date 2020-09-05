export { PromisifiedFunction, UnPromisifiedFunction, FunctionMap, PromisifiedFunctionMap, UnPromisifiedFunctionMap, MessagePortRequest, MessagePortResponse } from "../workers/Worker";

export interface TypedAudioWorkletNodeOptions<T = any> extends AudioWorkletNodeOptions {
    processorOptions?: T;
}
export interface TypedMessageEvent<T = any> extends MessageEvent {
    data: T;
}
export interface TypedMessagePortEventMap<T = any> extends MessagePortEventMap {
    "message": TypedMessageEvent<T>;
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
export interface TypedAudioParamDescriptor<Par extends string = string> extends AudioParamDescriptor {
    automationRate?: AutomationRate;
    defaultValue?: number;
    maxValue?: number;
    minValue?: number;
    name: Par;
}
export interface TypedAudioWorkletProcessor<MsgIn = any, MsgOut = any, Par extends string = string> {
    port: TypedMessagePort<MsgIn, MsgOut>;
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<Par, Float32Array>): boolean;
}
export const TypedAudioWorkletProcessor: {
    parameterDescriptors: TypedAudioParamDescriptor[];
    new <MsgIn = any, MsgOut = any, Par extends string = string, Opt = any>(options: TypedAudioWorkletNodeOptions<Opt>): TypedAudioWorkletProcessor<MsgIn, MsgOut, Par>;
};

export interface AudioWorkletGlobalScope {
    registerProcessor: (name: string, constructor: new (options: any) => TypedAudioWorkletProcessor) => void;
    currentFrame: number;
    currentTime: number;
    sampleRate: number;
    AudioWorkletProcessor: typeof TypedAudioWorkletProcessor;
}

export type TypedAudioParamMap<P extends string = string> = ReadonlyMap<P, AudioParam>;

export interface TypedAudioWorkletNode<MsgIn = any, MsgOut = any, Par extends string = string> extends AudioWorkletNode {
    readonly port: TypedMessagePort<MsgIn, MsgOut>;
    readonly parameters: TypedAudioParamMap<Par>;
    destroyed: boolean;
    destroy(): void;
}
export const TypedAudioWorkletNode: {
    prototype: TypedAudioWorkletNode;
    new <MsgIn = any, MsgOut = any, Par extends string = string, Opt = any>(context: BaseAudioContext, name: string, options?: TypedAudioWorkletNodeOptions<Opt>): TypedAudioWorkletNode<MsgIn, MsgOut, Par>;
};
