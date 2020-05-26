//// <reference no-default-lib="true"/>

/////////////////////////////
/// AudioWorkletGlobalScope APIs
/////////////////////////////

interface TypedAudioWorkletNodeOptions<T extends any = any> extends AudioWorkletNodeOptions {
    processorOptions?: T;
}
declare class AudioWorkletProcessor<T extends { [key: string]: any } = { [key: string]: any }, F extends { [key: string]: any } = { [key: string]: any }, P extends string = string, O extends any = any> {
    static get parameterDescriptors(): AudioWorkletAudioParamDescriptor[];
    public port: AudioWorkletMessagePort<T, F>;
    public process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in P]: Float32Array }): boolean;
    constructor(options: TypedAudioWorkletNodeOptions<O>);
}
type ProcessorOptions<T> = T extends AudioWorkletProcessor<any, any, any, infer O> ? O : never;
interface AudioWorkletProcessorConstructor<T extends AudioWorkletProcessor> {
    new (options: TypedAudioWorkletNodeOptions<ProcessorOptions<T>>): T;
}
declare function registerProcessor<T extends AudioWorkletProcessor>(name: string, constructor: AudioWorkletProcessorConstructor<T>): void;
declare const currentFrame: number;
declare const currentTime: number;
declare const sampleRate: number;

interface AudioWorkletAudioParamDescriptor<P extends string = string> extends AudioParamDescriptor {
    automationRate?: AutomationRate;
    defaultValue?: number;
    maxValue?: number;
    minValue?: number;
    name: P;
}
interface DisposableAudioWorkletMessageEventDataToProcessor {
    destroy?: boolean;
}
interface AudioWorkletMessagePort<I extends { [key: string]: any } = { [key: string]: any }, O extends { [key: string]: any } = { [key: string]: any }> extends MessagePort {
    onmessage: ((this: MessagePort, ev: AudioWorkletMessageEvent<I>) => any) | null;
    onmessageerror: ((this: MessagePort, ev: AudioWorkletMessageEvent<I>) => any) | null;
    postMessage(message: O, transfer: Transferable[]): void
    postMessage(message: O, options?: PostMessageOptions): void
}
interface AudioWorkletMessageEvent<T extends any = any> extends MessageEvent {
    data: T;
}
type DisposableAudioParamMap<P extends string = string> = ReadonlyMap<P, AudioParam>;

declare module "*.worklet.ts" {
    const exportString: string;
    export default exportString;
}
