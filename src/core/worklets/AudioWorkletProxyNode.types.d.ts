import { PromisifiedFunctionMap, TypedAudioWorkletNode, MessagePortRequest, MessagePortResponse, TypedAudioWorkletNodeOptions } from "./TypedAudioWorklet";

export type AudioWorkletProxyNode<INode extends {} = {}, IProcessor extends {} = {}, Par extends string = string> = PromisifiedFunctionMap<IProcessor> & TypedAudioWorkletNode<MessagePortRequest<INode> & MessagePortResponse<IProcessor>, MessagePortResponse<INode> & MessagePortRequest<IProcessor>, Par>;
export const AudioWorkletProxyNode: {
    fnNames: string[];
    prototype: AudioWorkletProxyNode;
    new <INode extends {} = {}, IProcessor extends {} = {}, Par extends string = string, Opt = any>(context: BaseAudioContext, name: string, options?: TypedAudioWorkletNodeOptions<Opt>): AudioWorkletProxyNode<INode, IProcessor, Par>;
};
