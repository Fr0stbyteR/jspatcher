import { FaustAudioWorkletNode, FaustScriptProcessorNode } from "faust2webaudio";
import FaustDynamicNode from "../dsp/FaustDynamicNode";
import { Bang } from "../Base";
import { TMeta, TCurve, TMIDIEvent, TInletMeta } from "../../types";
import { isMIDIEvent } from "../../../utils";

export default class FaustNode extends FaustDynamicNode<{ code: string }, { voices: number }, [Bang | number | string | TMIDIEvent, { [key: string]: TCurve }], (null | FaustAudioWorkletNode | FaustScriptProcessorNode)[], [number]> {
    static package = "Faust";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Dynamically generate WebAudioNode from Faust";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the node, code string to compile, number to set voices, or a param-curve map, or a MIDI event"
    }, {
        isHot: false,
        type: "signal",
        description: "Node connection"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "FaustNode instance output: AudioWorkletNode | ScriptProcessor"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Polyphonic instrument voices count"
    }]
    state = { merger: undefined as ChannelMergerNode, splitter: undefined as ChannelSplitterNode, node: undefined as FaustAudioWorkletNode | FaustScriptProcessorNode, voices: 0 };
    _meta: TMeta = FaustNode.meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
    }
    handleInlet: (e: { data: any; inlet: number }) => void = async ({ data, inlet }) => {
        if (inlet === 0) {
            if (data instanceof Bang) {
                if (this.state.node) this.outlet(this.outlets - 1, this.state.node);
            } else if (typeof data === "string") {
                await this.newNode(data, this.state.voices);
            } else if (typeof data === "number") {
                this.state.voices = Math.max(0, ~~data);
            } else if (isMIDIEvent(data)) {
                if (this.state.node) this.state.node.midiMessage(data);
            }
        }
    }
    async newNode(code: string, voices: number) {
        let compiled: { inlets: number; outlets: number; node: FaustAudioWorkletNode | FaustScriptProcessorNode; splitter: ChannelSplitterNode; merger: ChannelMergerNode };
        try {
            compiled = await this.compile(code, voices);
        } catch (e) {
            this.error((e as Error).message);
            return;
        }
        const { inlets, outlets, merger, splitter, node } = compiled;
        this.disconnectAll();
        this.handleDestroy();
        this.state = { voices, merger, splitter, node };
        this.data.code = code;
        const firstInletMeta = FaustNode.inlets[0];
        const firstInletSignalMeta: TInletMeta = { ...FaustNode.inlets[0], type: "signal" };
        const inletMeta = FaustNode.inlets[1];
        const outletMeta = FaustNode.outlets[0];
        const lastOutletMeta = FaustNode.outlets[1];
        const factoryMeta = FaustNode.meta;
        factoryMeta.inlets[0] = compiled.inlets ? firstInletSignalMeta : firstInletMeta;
        for (let i = 1; i < inlets; i++) {
            factoryMeta.inlets[i] = inletMeta;
        }
        for (let i = 0; i < outlets; i++) {
            factoryMeta.outlets[i] = outletMeta;
        }
        factoryMeta.outlets[outlets] = lastOutletMeta;
        this.meta = factoryMeta;
        for (let i = 0; i < inlets; i++) {
            this.inletConnections[i] = { node: merger, index: i };
        }
        for (let i = 0; i < outlets; i++) {
            this.outletConnections[i] = { node: splitter, index: i };
        }
        this.inlets = inlets || 1;
        this.outlets = outlets + 1;
        this.connectAll();
        this.outlet(this.outlets - 1, this.state.node);
    }
    handleDestroy = () => {
        if (this.state.merger) this.state.merger.disconnect();
        if (this.state.node) this.state.node.disconnect();
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", async () => {
            if (this.data.code) await this.newNode(this.data.code, this.state.voices);
        });
        this.on("inlet", this.handleInlet);
    }
}
