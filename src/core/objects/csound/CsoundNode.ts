import type { CsoundObj } from "@csound/browser";
import CodePopupUI from "../base/CodePopupUI";
import Bang, { isBang } from "../base/Bang";
import DefaultObject from "../base/DefaultObject";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";
import type DefaultUI from "../base/DefaultUI";
import type { TBPF, TMIDIEvent } from "../../types";
import type { UnPromisifiedFunction } from "../../workers/Worker";
import type { IInletMeta, IOutletMeta, IInletsMeta, IOutletsMeta, IArgsMeta } from "../base/AbstractObject";

class CsoundNodeUI extends CodePopupUI<CsoundNode> {
    editorLanguage = "plain";
    get code() {
        return this.object.data.code;
    }
    handleSave = (code: string) => {
        this.object.setData({ code });
        this.object.newNode(code, this.object._.voices);
    };
}
export interface CsoundNodeData {
    code?: string;
}
export interface CsoundNodeInternalState {
    merger: ChannelMergerNode;
    splitter: ChannelSplitterNode;
    csoundObj: CsoundObj;
    node: AudioWorkletNode;
    voices: number;
}
type Args = [number];
type I = [Bang | number | string | TMIDIEvent | Record<string, TBPF>, ...TBPF[]];
type O = (null | string | AudioWorkletNode)[];

export default class CsoundNode<
    D extends Record<string, any> & Partial<CsoundNodeData> = {},
    S extends {} = {},
    A extends any[] = Args,
    U extends {} = {}
> extends DefaultObject<D & CsoundNodeData, S, I, O, A, {}, U> {
    static package = "Csound";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Dynamically generate WebAudioNode from Csound";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the node, csd string to compile, number to set voices, or a param-bpf map, or a MIDI event"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "CsoundNode instance output: AudioWorkletNode | ScriptProcessor"
    }];
    static args: IArgsMeta = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Polyphonic instrument voices count"
    }];
    static UI: typeof DefaultUI = CsoundNodeUI;
    _: CsoundNodeInternalState = { merger: undefined, splitter: undefined, csoundObj: undefined, node: undefined, voices: ~~Math.max(0, this.args[0]) };
    async getCsoundNode(code: string) {
        const Csound = await this.env.getCsound();
        const csoundObj = await Csound({
            audioContext: this.audioCtx,
            autoConnect: false,
            useSAB: typeof SharedArrayBuffer !== "undefined",
            useSPN: false,
            useWorker: false
        });
        csoundObj.setOption("-odac");
        csoundObj.on("message", (message: string) => this.outlet(0, message));
        // console.log(csoundObj);
        const result = await csoundObj.compileCsdText(code);
        if (result === 0) {
            await csoundObj.start();
        } else {
            try {
                await csoundObj.cleanup();
            } catch (error) {
                this.error(error);
            }
        }
        const node = await csoundObj.getNode() as AudioWorkletNode;
        node.channelInterpretation = "discrete";
        // console.log(node);
        return { csoundObj, node };
    }
    async compile(code: string) {
        let splitter: ChannelSplitterNode;
        let merger: ChannelMergerNode;
        const { node, csoundObj } = await this.getCsoundNode(code);
        if (!node) throw new Error("Cannot compile Csound code");
        node.channelInterpretation = "discrete";
        const { audioCtx } = this.patcher;
        const inlets = await csoundObj.getNchnlsInput();
        const outlets = await csoundObj.getNchnls();
        if (inlets) {
            merger = audioCtx.createChannelMerger(inlets);
            merger.channelInterpretation = "discrete";
            merger.connect(node, 0, 0);
        }
        if (outlets) {
            splitter = audioCtx.createChannelSplitter(outlets);
            node.connect(splitter, 0, 0);
        }
        return { inlets, outlets, node, splitter, merger, csoundObj };
    }
    async newNode(code: string, voices: number) {
        this.disconnectAudio();
        await this.handleDestroy();
        let compiled: ReturnType<UnPromisifiedFunction<CsoundNode["compile"]>>;
        try {
            compiled = await this.compile(code);
        } catch (e) {
            this.error((e as Error).message);
            return;
        }
        const { inlets, outlets, merger, splitter, node, csoundObj } = compiled;
        Object.assign(this._, { voices, merger, splitter, node, csoundObj } as CsoundNodeInternalState);
        const Ctor = this.constructor as typeof CsoundNode;
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
                if (this._.csoundObj) this._.csoundObj.midiMessage(data[0], data[1], data[2]);
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
    handleDestroy = async () => {
        const { merger, node, csoundObj } = this._;
        if (merger) merger.disconnect();
        if (node) {
            node.disconnect();
        }
        if (csoundObj) await csoundObj.destroy();
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
