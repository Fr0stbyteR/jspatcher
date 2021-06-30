import { PromisifiedFunctionMap, TypedAudioWorkletNode, MessagePortRequest, MessagePortResponse, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";

export type AudioWorkletProxyNode<INode extends {} = {}, IProcessor extends {} = {}, Par extends string = string, EventMap extends Record<string, any> = any> = PromisifiedFunctionMap<IProcessor> & TypedAudioWorkletNode<MessagePortRequest<INode> & MessagePortResponse<IProcessor>, MessagePortResponse<INode> & MessagePortRequest<IProcessor>, Par, EventMap> & { _disposed: boolean };
export const AudioWorkletProxyNode: {
    fnNames: string[];
    prototype: AudioWorkletProxyNode;
    new <INode extends {} = {}, IProcessor extends {} = {}, Par extends string = string, Opt = any, EventMap extends Record<string, any> = any>(context: BaseAudioContext, name: string, options?: TypedAudioWorkletNodeOptions<Opt>): AudioWorkletProxyNode<INode, IProcessor, Par, EventMap>;
};
