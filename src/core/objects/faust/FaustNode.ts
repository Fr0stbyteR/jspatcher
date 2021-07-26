import { FaustAudioWorkletNode, FaustScriptProcessorNode } from "faust2webaudio";
import FaustDynamicNode, { DefaultFaustDynamicNodeState } from "../dsp/FaustDynamicNode";
import { Bang, isBang } from "../Base";
import { TBPF, TMIDIEvent } from "../../types";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";
import { CodePopupUI } from "../BaseUI";
import { UnPromisifiedFunction } from "../../workers/Worker";
import { IJSPatcherObjectMeta, IInletMeta, IOutletMeta } from "../base/AbstractObject";
import DefaultUI from "../base/DefaultUI";

class FaustNodeUI extends CodePopupUI<FaustNode> {
    editorLanguage = "faust";
    get code() {
        return this.object.data.code;
    }
    handleSave = (code: string) => {
        this.object.setData({ code });
        this.object.newNode(code, this.object.state.voices);
    };
}
const AWN: typeof AudioWorkletNode = window.AudioWorkletNode ? AudioWorkletNode : null;
export interface FaustNodeData {
    code?: string;
}
export interface FaustNodeState extends DefaultFaustDynamicNodeState {
    voices: number;
}
type Args = [number];
type I = [Bang | number | string | TMIDIEvent | Record<string, TBPF>, ...TBPF[]];
type O = (null | FaustAudioWorkletNode | FaustScriptProcessorNode)[];

export default class FaustNode<D extends Partial<FaustNodeData> & Record<string, any> = {}, S extends Partial<FaustNodeState> & Record<string, any> = {}, A extends any[] = Args, U extends Record<string, any> = {}> extends FaustDynamicNode<D & FaustNodeData, S & FaustNodeState, I, O, A, {}, U> {
    static package = "Faust";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Dynamically generate WebAudioNode from Faust";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the node, code string to compile, number to set voices, or a param-bpf map, or a MIDI event"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "FaustNode instance output: AudioWorkletNode | ScriptProcessor"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Polyphonic instrument voices count"
    }];
    static UI: typeof DefaultUI = FaustNodeUI;
    state = { merger: undefined, splitter: undefined, node: undefined, voices: 0 } as S & FaustNodeState;
    async newNode(code: string, voices: number) {
        let compiled: ReturnType<UnPromisifiedFunction<FaustNode["compile"]>>;
        try {
            compiled = await this.compile(code, voices);
        } catch (e) {
            this.error((e as Error).message);
            return;
        }
        const { inlets, outlets, merger, splitter, node } = compiled;
        this.disconnectAudio();
        this.handleDestroy();
        Object.assign(this.state, { voices, merger, splitter, node } as S);
        const Ctor = this.constructor as typeof FaustNode;
        const firstInletMeta = Ctor.inlets[0];
        const firstInletSignalMeta: IInletMeta = { ...firstInletMeta, type: "signal" };
        const inletMeta: IInletMeta = { isHot: false, type: "signal", description: "Node connection" };
        const audioParamInletMeta: IInletMeta = { isHot: false, type: "signal", description: ": bpf or node connection" };
        const outletMeta: IOutletMeta = { type: "signal", description: "Node connection" };
        const lastOutletMeta = Ctor.outlets[0];
        const factoryMeta = Ctor.meta as this["meta"];
        for (let i = 0; i < inlets; i++) {
            if (i === 0) factoryMeta.inlets[i] = compiled.inlets ? firstInletSignalMeta : firstInletMeta;
            else factoryMeta.inlets[i] = inletMeta;
            this.inletAudioConnections[i] = { node: merger, index: i };
        }
        for (let i = 0; i < outlets; i++) {
            factoryMeta.outlets[i] = outletMeta;
            this.outletAudioConnections[i] = { node: splitter, index: i };
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
                this.inletAudioConnections[i] = { node: param };
            }
        }
        this.setMeta(factoryMeta);
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
            if (isBang(data)) {
                if (this.state.node) this.outlet(this.outlets - 1, this.state.node);
            } else if (typeof data === "string") {
                this.setData({ code: data } as D);
                await this.newNode(data, this.state.voices);
            } else if (typeof data === "number") {
                this.state.voices = Math.max(0, ~~data);
            } else if (isMIDIEvent(data)) {
                if (this.state.node) this.state.node.midiMessage(data);
            } else if (typeof data === "object") {
                if (this.state.node) {
                    for (const key in data) {
                        try {
                            const bpf = decodeLine((data as Record<string, TBPF>)[key]);
                            if (this.state.node instanceof AWN) this.applyBPF(this.state.node.parameters.get(key), bpf);
                            else this.state.node.setParamValue(key, bpf[bpf.length - 1][0]);
                        } catch (e) {
                            this.error(e.message);
                        }
                    }
                }
            }
        } else if (this.state.node instanceof AWN) {
            const con = this.inletAudioConnections[inlet].node;
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
