import { FaustAudioWorkletNode, FaustScriptProcessorNode } from "faust2webaudio";
import FaustDynamicNode from "../dsp/FaustDynamicNode";
import { Bang } from "../Base";
import { TMeta, TBPF, TMIDIEvent, TInletMeta, TOutletMeta } from "../../types";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";
import { CodePopupUI, DefaultUI } from "../BaseUI";

class FaustNodeUI extends CodePopupUI<FaustNode> {
    editorLanguage = "faust";
    get code() {
        return this.object.data.code;
    }
    handleSave = (code: string) => {
        this.object.data.code = code;
        this.object.newNode(code, this.object.state.voices);
    }
}
const AWN: typeof AudioWorkletNode = window.AudioWorkletNode ? AudioWorkletNode : null;
export interface FaustNodeData {
    code: string;
}
export interface FaustNodeState {
    merger: ChannelMergerNode;
    splitter: ChannelSplitterNode;
    node: FaustAudioWorkletNode | FaustScriptProcessorNode;
    voices: number;
}
type Args = [number];
type I = [Bang | number | string | TMIDIEvent | { [key: string]: TBPF }, ...TBPF[]];
type O = (null | FaustAudioWorkletNode | FaustScriptProcessorNode)[];

export default class FaustNode<D extends Partial<FaustNodeData> & { [key: string]: any } = FaustNodeData, S extends FaustNodeState & { [key: string]: any } = FaustNodeState, A extends any[] = Args, U extends { [key: string]: any } = {}> extends FaustDynamicNode<D, S, I, O, A, {}, U> {
    static package = "Faust";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Dynamically generate WebAudioNode from Faust";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the node, code string to compile, number to set voices, or a param-bpf map, or a MIDI event"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "FaustNode instance output: AudioWorkletNode | ScriptProcessor"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Polyphonic instrument voices count"
    }];
    uiComponent: typeof DefaultUI = FaustNodeUI;
    state = { merger: undefined, splitter: undefined, node: undefined, voices: 0 } as S;
    _meta: TMeta = FaustNode.meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
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
        this.disconnectAudio();
        this.handleDestroy();
        this.state = { voices, merger, splitter, node } as S;
        const firstInletMeta = FaustNode.inlets[0];
        const firstInletSignalMeta: TInletMeta = { ...firstInletMeta, type: "signal" };
        const inletMeta: TInletMeta = { isHot: false, type: "signal", description: "Node connection" };
        const audioParamInletMeta: TInletMeta = { isHot: false, type: "signal", description: ": bpf or node connection" };
        const outletMeta: TOutletMeta = { type: "signal", description: "Node connection" };
        const lastOutletMeta = FaustNode.outlets[0];
        const factoryMeta = FaustNode.meta;
        for (let i = 0; i < inlets; i++) {
            if (i === 0) factoryMeta.inlets[i] = compiled.inlets ? firstInletSignalMeta : firstInletMeta;
            else factoryMeta.inlets[i] = inletMeta;
            this.inletConnections[i] = { node: merger, index: i };
        }
        for (let i = 0; i < outlets; i++) {
            factoryMeta.outlets[i] = outletMeta;
            this.outletConnections[i] = { node: splitter, index: i };
        }
        factoryMeta.outlets[outlets] = lastOutletMeta;
        if (node instanceof AWN) {
            const audioParams: string[] = [];
            node.parameters.forEach((v, k) => audioParams.push(k));
            for (let i = inlets || 1; i < (inlets || 1) + audioParams.length; i++) {
                const path = audioParams[i - (inlets || 1)];
                const param = node.parameters.get(path);
                const { defaultValue, minValue, maxValue } = param;
                factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
                this.inletConnections[i] = { node: param };
            }
        }
        this.meta = factoryMeta;
        this.inlets = (inlets || 1) + (node instanceof AWN ? node.parameters.size : 0);
        this.outlets = outlets + 1;
        this.connectAudio();
        this.outlet(this.outlets - 1, this.state.node);
    }
    handlePreInit = () => undefined as any;
    handlePostInit = async () => {
        if (this.data.code) await this.newNode(this.data.code, this.state.voices);
    };
    handleUpdateArgs = (args: Partial<A>): void => {
        if (typeof args[0] === "number") this.state.voices = ~~Math.max(0, args[0]);
    };
    handleInlet = async ({ data, inlet }: { data: I[number]; inlet: number }) => {
        if (inlet === 0) {
            if (data instanceof Bang) {
                if (this.state.node) this.outlet(this.outlets - 1, this.state.node);
            } else if (typeof data === "string") {
                this.data.code = data;
                await this.newNode(data, this.state.voices);
            } else if (typeof data === "number") {
                this.state.voices = Math.max(0, ~~data);
            } else if (isMIDIEvent(data)) {
                if (this.state.node) this.state.node.midiMessage(data);
            } else if (typeof data === "object") {
                if (this.state.node) {
                    for (const key in data) {
                        try {
                            const bpf = decodeLine((data as { [key: string]: TBPF })[key]);
                            if (this.state.node instanceof AWN) this.applyBPF(this.state.node.parameters.get(key), bpf);
                            else this.state.node.setParamValue(key, bpf[bpf.length - 1][0]);
                        } catch (e) {
                            this.error(e.message);
                        }
                    }
                }
            }
        } else if (this.state.node instanceof AWN) {
            const con = this.inletConnections[inlet].node;
            if (con instanceof AudioParam) {
                try {
                    const bpf = decodeLine(data as TBPF);
                    this.applyBPF(con, bpf);
                } catch (e) {
                    this.error(e.message);
                }
            }
        }
    };
    handleDestroy = () => {
        const { merger, node } = this.state;
        if (merger) merger.disconnect();
        if (node) {
            node.disconnect();
            node.destroy();
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
        this.on("postInit", this.handlePostInit);
        this.on("updateArgs", this.handleUpdateArgs);
        this.on("inlet", this.handleInlet);
        this.on("destroy", this.handleDestroy);
    }
}
