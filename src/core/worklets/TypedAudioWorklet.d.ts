import type { IJSPatcherEnv } from "../Env";
import type { TypedMessagePort } from "../workers/Worker";

export * from "../workers/Worker";

export interface TypedAudioWorkletNodeOptions<T = any> extends AudioWorkletNodeOptions {
    processorOptions?: T;
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
    jspatcherEnv: IJSPatcherEnv;
}

export type TypedAudioParamMap<P extends string = string> = ReadonlyMap<P, AudioParam>;

export interface TypedAudioWorkletNode<MsgIn = any, MsgOut = any, Par extends string = string, EventMap extends Record<string, any> = any> extends AudioWorkletNode {
    readonly port: TypedMessagePort<MsgIn, MsgOut>;
    readonly parameters: TypedAudioParamMap<Par>;
    destroyed: boolean;
    destroy(): void;
    addEventListener<K extends keyof AudioWorkletNodeEventMap>(type: K, listener: (this: AudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener<K extends keyof EventMap>(type: K, listener: (this: AudioWorkletNode, ev: CustomEvent<EventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AudioWorkletNodeEventMap>(type: K, listener: (this: AudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener<K extends keyof EventMap>(type: K, listener: (this: AudioWorkletNode, ev: CustomEvent<EventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export const TypedAudioWorkletNode: {
    prototype: TypedAudioWorkletNode;
    new <MsgIn = any, MsgOut = any, Par extends string = string, EventMap extends Record<string, any> = any, Opt = any>(context: BaseAudioContext, name: string, options?: TypedAudioWorkletNodeOptions<Opt>): TypedAudioWorkletNode<MsgIn, MsgOut, Par, EventMap>;
};
