//// <reference no-default-lib="true"/>

/////////////////////////////
/// AudioWorkletGlobalScope APIs
/////////////////////////////

declare class AudioWorkletProcessor<I extends { [key: string]: any } = { [key: string]: any }, O extends { [key: string]: any } = { [key: string]: any }, P extends string = string> {
    static get parameterDescriptors(): AudioWorkletAudioParamDescriptor[];
    public port: AudioWorkletMessagePort<I, O>;
    public process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key in P]: Float32Array }): boolean;
    constructor(options: AudioWorkletNodeOptions);
}
interface AudioWorkletProcessorConstructor<T extends AudioWorkletProcessor> {
    new (options: AudioWorkletNodeOptions): T;
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
type DisposableAudioParamMap<P extends string = string> = ReadonlyMap<P, AudioParam>

declare module "*.worklet.ts" {
    const exportString: string;
    export default exportString;
}
