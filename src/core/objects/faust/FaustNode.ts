import type { FaustAudioWorkletNode } from "@shren/faustwasm/dist/esm";
import CodePopupUI from "../base/CodePopupUI";
import Bang, { isBang } from "../base/Bang";
import DefaultObject from "../base/DefaultObject";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";
import type DefaultUI from "../base/DefaultUI";
import type { TBPF, TMIDIEvent } from "../../types";
import type { UnPromisifiedFunction } from "../../workers/Worker";
import type { IInletMeta, IOutletMeta, IInletsMeta, IOutletsMeta, IArgsMeta } from "../base/AbstractObject";

class FaustNodeUI extends CodePopupUI<FaustNode> {
    editorLanguage = "faust";
    get code() {
        return this.object.data.code;
    }
    handleSave = (code: string) => {
        this.object.setData({ code });
        this.object.newNode(code, this.object._.voices);
    };
}
export interface FaustNodeData {
    code?: string;
}
export interface FaustNodeInternalState {
    merger: ChannelMergerNode;
    splitter: ChannelSplitterNode;
    node: FaustAudioWorkletNode & { dspCode?: string };
    voices: number;
}
type Args = [number];
type I = [Bang | number | string | TMIDIEvent | Record<string, TBPF>, ...TBPF[]];
type O = (null | FaustAudioWorkletNode)[];

export default class FaustNode<
    D extends Record<string, any> & Partial<FaustNodeData> = {},
    S extends {} = {},
    A extends any[] = Args,
    U extends {} = {}
> extends DefaultObject<D & FaustNodeData, S, I, O, A, {}, U> {
    static package = "Faust";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Dynamically generate WebAudioNode from Faust";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the node, code string to compile, number to set voices, or a param-bpf map, or a MIDI event"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "FaustNode instance output: AudioWorkletNode | ScriptProcessor"
    }];
    static args: IArgsMeta = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Polyphonic instrument voices count"
    }];
    static UI: typeof DefaultUI = FaustNodeUI;
    _: FaustNodeInternalState = { merger: undefined, splitter: undefined, node: undefined, voices: ~~Math.max(0, this.args[0]) };
    async getFaustNode(code: string, voices: number) {
        const { audioCtx } = this;
        const { FaustMonoDspGenerator, FaustPolyDspGenerator } = this.env.Faust;
        const faustCompiler = await this.env.getFaustCompiler();
        if (voices) {
            const generator = new FaustPolyDspGenerator();
            await generator.compile(faustCompiler, "FaustDSP", code, "");
            return generator.createNode(audioCtx, voices);
        }
        const generator = new FaustMonoDspGenerator();
        await generator.compile(faustCompiler, "FaustDSP", code, "");
        return generator.createNode(audioCtx);
    }
    async compile(code: string, voices: number) {
        let splitter: ChannelSplitterNode;
        let merger: ChannelMergerNode;
        const node = await this.getFaustNode(code, voices) as FaustAudioWorkletNode & { dspCode?: string };
        if (!node) throw new Error("Cannot compile Faust code");
        node.channelInterpretation = "discrete";
        node.dspCode = code;
        const { audioCtx } = this.patcher;
        const inlets = node.getNumInputs();
        const outlets = node.getNumOutputs();
        if (inlets) {
            merger = audioCtx.createChannelMerger(inlets);
            merger.channelInterpretation = "discrete";
            merger.connect(node, 0, 0);
        }
        if (outlets) {
            splitter = audioCtx.createChannelSplitter(outlets);
            node.connect(splitter, 0, 0);
        }
        return { inlets, outlets, node, splitter, merger };
    }
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
        Object.assign(this._, { voices, merger, splitter, node } as FaustNodeInternalState);
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
        const audioParams: string[] = [...node.parameters].map(([k]) => k).sort();
        for (let i = inlets || 1; i < (inlets || 1) + audioParams.length; i++) {
            const path = audioParams[i - (inlets || 1)];
            const param = node.parameters.get(path);
            const { defaultValue, minValue, maxValue } = param;
            factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
            this.inletAudioConnections[i] = { node: param };
        }
        this.setMeta(factoryMeta);
        this.inlets = (inlets || 1) + audioParams.length;
        this.outlets = outlets + 1;
        this.connectAudio();
        this.outlet(this.outlets - 1, this._.node);
    }
    handlePreInit = () => undefined as any;
    handlePostInit = async () => {
        if (this.data.code) await this.newNode(this.data.code, this._.voices);
    };
    handleUpdateArgs = (args: Partial<A>): void => {
        if (typeof args[0] === "number") this._.voices = ~~Math.max(0, args[0]);
    };
    handleInlet = async ({ data, inlet }: { data: I[number]; inlet: number }) => {
        if (inlet === 0) {
            if (isBang(data)) {
                if (this._.node) this.outlet(this.outlets - 1, this._.node);
            } else if (typeof data === "string") {
                this.setData({ code: data } as D);
                await this.newNode(data, this._.voices);
            } else if (typeof data === "number") {
                this._.voices = Math.max(0, ~~data);
            } else if (isMIDIEvent(data)) {
                if (this._.node) this._.node.midiMessage(data);
            } else if (typeof data === "object") {
                if (this._.node) {
                    for (const key in data) {
                        try {
                            const bpf = decodeLine((data as Record<string, TBPF>)[key]);
                            this.applyBPF(this._.node.parameters.get(key), bpf);
                        } catch (e) {
                            this.error(e.message);
                        }
                    }
                }
            }
        } else if (this._.node) {
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
        const { merger, node } = this._;
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
