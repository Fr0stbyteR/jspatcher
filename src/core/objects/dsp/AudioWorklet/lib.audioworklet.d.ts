//// <reference no-default-lib="true"/>

/////////////////////////////
/// AudioWorkletGlobalScope APIs
/////////////////////////////

declare class AudioWorkletProcessor {
    static get parameterDescriptors(): AudioParamDescriptor[];
    public port: MessagePort;
    public process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: { [key: string]: Float32Array }): boolean;
    constructor(options: AudioWorkletNodeOptions);
}
interface AudioWorkletProcessorConstructor<T extends AudioWorkletProcessor> {
    new (options: AudioWorkletNodeOptions): T;
}
declare function registerProcessor<T extends AudioWorkletProcessor>(name: string, constructor: AudioWorkletProcessorConstructor<T>): void;
declare const currentFrame: number;
declare const currentTime: number;
declare const sampleRate: number;

interface AudioParamDescriptor {
    automationRate?: AutomationRate;
    defaultValue?: number;
    maxValue?: number;
    minValue?: number;
    name: string;
}
