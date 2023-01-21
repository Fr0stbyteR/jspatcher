import FaustFFTNode from "../../worklets/FaustFFTNode";
import FaustNode, { FaustNodeData, FaustNodeInternalState } from "./FaustNode";
import Bang, { isBang } from "../base/Bang";
import type { IInletMeta, IOutletMeta, IPropsMeta } from "../base/AbstractObject";
import type { DefaultObjectProps } from "../base/DefaultObject";
import type { UnPromisifiedFunction } from "../../workers/Worker";

export interface FaustFFTInternalState extends FaustNodeInternalState {
    fftNode: FaustFFTNode;
    params: string[];
}
export interface FaustFFTProps {
    fftSize: number;
    windowFunction: "rectangular" | "blackman" | "hamming" | "hann" | "triangular";
    fftOverlap: 1 | 2 | 4 | 8;
}
type I = [Bang | number | string | Record<string, number>, ...number[]];
export default class FaustFFT<
    D extends Record<string, any> & Partial<FaustNodeData> = {},
    S extends {} = {},
    A extends any[] = [],
    P extends Record<string, any> & Partial<FaustFFTProps> & Partial<DefaultObjectProps> = {},
    U extends {} = {}
> extends FaustNode<D, S, A, P & FaustFFTProps & DefaultObjectProps, U> {
    static description = "Use Faust DSP for spectral processing inside an AudioWorklet, each input <: real, imag, bin, real, imag :> each output";
    static props: IPropsMeta<FaustFFTProps> = {
        windowFunction: {
            type: "enum",
            enums: ["rectangular", "blackman", "hamming", "hann", "triangular"],
            description: "Window function used for both input and output of FFT",
            default: "hann"
        },
        fftSize: {
            type: "enum",
            enums: new Array(20).fill(0).map((v, i) => 2 ** (i + 1)),
            default: 1024,
            description: "FFT Size for analysis"
        },
        fftOverlap: {
            type: "enum",
            enums: [1, 2, 4, 8],
            description: "FFT Overlaps",
            default: 2
        }
    };
    _: FaustFFTInternalState = {
        merger: undefined,
        splitter: undefined,
        node: undefined,
        fftNode: undefined,
        params: [],
        voices: 0
    };
    registerProcessor() {
        return FaustFFTNode.register(this.audioCtx.audioWorklet);
    }
    async getFaustFFTNode(code: string) {
        const { audioCtx } = this;
        const { FaustMonoDspGenerator } = this.env.Faust;
        const faustCompiler = await this.env.getFaustCompiler();
        const generator = new FaustMonoDspGenerator();
        const { factory } = await generator.compile(faustCompiler, "FaustDSP", code, "");
        const offlineProcessor = await generator.createOfflineProcessor(audioCtx.sampleRate, 128);
        const node = new FaustFFTNode(audioCtx, {
            channelCount: Math.ceil(offlineProcessor.getNumInputs() / 3) || 1,
            outputChannelCount: [Math.ceil(offlineProcessor.getNumOutputs() / 2) || 1],
            processorOptions: { factory }
        });
        return { node, offlineProcessor };
    }
    async compileFaustFFTNode(code: string) {
        let splitter: ChannelSplitterNode;
        let merger: ChannelMergerNode;
        const { node, offlineProcessor } = await this.getFaustFFTNode(code);
        if (!node) throw new Error("Cannot compile Faust code");
        node.channelInterpretation = "discrete";
        node.dspCode = code;
        if (this.meta.props.fftSize.enums.indexOf(this.getProp("fftSize")) !== -1) node.parameters.get("fftSize").value = this.getProp("fftSize");
        if (this.meta.props.windowFunction.enums.indexOf(this.getProp("windowFunction")) !== -1) node.parameters.get("windowFunction").value = this.meta.props.windowFunction.enums.indexOf(this.getProp("windowFunction"));
        if (this.meta.props.fftOverlap.enums.indexOf(this.getProp("fftOverlap")) !== -1) node.parameters.get("fftOverlap").value = this.getProp("fftOverlap");
        const { audioCtx } = this.patcher;
        const inlets = node.inputChannels;
        const outlets = node.outputChannels;
        if (inlets) {
            merger = audioCtx.createChannelMerger(inlets);
            merger.channelInterpretation = "discrete";
            merger.connect(node, 0, 0);
        }
        if (outlets) {
            splitter = audioCtx.createChannelSplitter(outlets);
            node.connect(splitter, 0, 0);
        }
        return { inlets, outlets, node, splitter, merger, offlineProcessor };
    }
    async newNode(code: string) {
        let compiled: ReturnType<UnPromisifiedFunction<FaustFFT["compileFaustFFTNode"]>>;
        try {
            compiled = await this.compileFaustFFTNode(code);
        } catch (e) {
            this.error((e as Error).message);
            return;
        }
        const { inlets, outlets, merger, splitter, node, offlineProcessor } = compiled;
        this.disconnectAudio();
        this.handleDestroy();
        Object.assign(this._, { merger, splitter, fftNode: node } as FaustFFTInternalState);
        const Ctor = this.constructor as typeof FaustNode;
        const firstInletMeta = Ctor.inlets[0];
        const firstInletSignalMeta: IInletMeta = { ...firstInletMeta, type: "signal" };
        const inletMeta: IInletMeta = { isHot: false, type: "signal", description: "Node connection" };
        const audioParamInletMeta: IInletMeta = { isHot: false, type: "number", description: ": number" };
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

        const params: string[] = offlineProcessor.getParams().filter(s => !s.endsWith("fftSize") && !s.endsWith("fftHopSize")).sort();
        this._.params = params;
        for (let i = inlets || 1; i < (inlets || 1) + params.length; i++) {
            const path = params[i - (inlets || 1)];
            const param = offlineProcessor.getParameterDescriptors().find(p => p.name === path);
            const { defaultValue, minValue, maxValue } = param;
            factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
        }

        this.setMeta(factoryMeta);
        this.inlets = (inlets || 1) + params.length;
        this.outlets = outlets + 1;
        this.connectAudio();
        this.outlet(this.outlets - 1, this._.fftNode);
    }
    handleUpdateProps = async (props: Partial<FaustFFTProps>) => {
        if (!("fftSize" in props || "windowFunction" in props || "fftOverlap" in props)) return;
        if (!this._.fftNode) return;
        if (props.fftSize !== this.getProp("fftSize") && this.meta.props.fftSize.enums.indexOf(props.fftSize) !== -1) this._.fftNode.parameters.get("fftSize").value = props.fftSize;
        if (props.windowFunction !== this.getProp("windowFunction") && this.meta.props.windowFunction.enums.indexOf(props.windowFunction) !== -1) this._.fftNode.parameters.get("windowFunction").value = this.meta.props.windowFunction.enums.indexOf(props.windowFunction);
        if (props.fftOverlap !== this.getProp("fftOverlap") && this.meta.props.fftOverlap.enums.indexOf(props.fftOverlap) !== -1) this._.fftNode.parameters.get("fftOverlap").value = props.fftOverlap;
    };
    handlePostInit = async () => {
        await this.registerProcessor();
        if (this.data.code) await this.newNode(this.data.code);
    };
    handleInlet = async ({ data, inlet }: { data: I[number]; inlet: number }) => {
        if (inlet === 0) {
            if (isBang(data)) {
                if (this._.fftNode) this.outlet(this.outlets - 1, this._.fftNode);
            } else if (typeof data === "string") {
                this.setData({ code: data } as D);
                await this.newNode(data);
            } else if (typeof data === "object") {
                if (this._.node) {
                    for (const key in data) {
                        if (typeof data[key] === "number") this._.fftNode.setProcessorParamValue(key, data[key]);
                    }
                }
            }
        } else if (this._.fftNode) {
            const paramInlet = inlet - (this._.fftNode.inputChannels || 1);
            const param = this._.params[paramInlet];
            if (typeof data === "number") this._.fftNode.setProcessorParamValue(param, data);
        }
    };
    subscribe() {
        this.on("updateProps", this.handleUpdateProps);
        super.subscribe();
    }
}
