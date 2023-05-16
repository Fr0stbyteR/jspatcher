// import FaustFFTNode from "../../worklets/FaustFFTNode";
import type { FaustFFTOptionsData, FaustMonoAudioWorkletNode } from "@shren/faustwasm";
import FaustNode, { FaustNodeData, FaustNodeInternalState } from "./FaustNode";
import Bang, { isBang } from "../base/Bang";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";
import type { IInletMeta, IOutletMeta, IPropsMeta } from "../base/AbstractObject";
import type { DefaultObjectProps } from "../base/DefaultObject";
import type { UnPromisifiedFunction } from "../../workers/Worker";
import type { TBPF } from "../../types";

export const FFTUtils = class {
    static get windowFunctions() {
        return [
            // blackman
            (i: number, N: number) => {
                const a0 = 0.42;
                const a1 = 0.5;
                const a2 = 0.08;
                const f = 6.283185307179586 * i / (N - 1);
                return a0 - a1 * Math.cos(f) + a2 * Math.cos(2 * f);
            },
            // hamming
            (i: number, N: number) => 0.54 - 0.46 * Math.cos(6.283185307179586 * i / (N - 1)),
            // hann
            (i: number, N: number) => 0.5 * (1 - Math.cos(6.283185307179586 * i / (N - 1))),
            // triangular
            (i: number, N: number) => 1 - Math.abs(2 * (i - 0.5 * (N - 1)) / N)
        ];
    }
    static async getFFT() {
        const { fftw } = (globalThis as unknown as AudioWorkletGlobalScope).jspatcherEnv;
        return fftw.r2r.FFT1D;
    }
    static fftToSignal(f: Float32Array, r: Float32Array, i: Float32Array, b: Float32Array) {
        const fftSize = f.length;
        const len = fftSize / 2 + 1;
        const invFFTSize = 1 / fftSize;
        for (let j = 0; j < len; j++) {
            r[j] = f[j] * invFFTSize;
            if (i) i[j] = (j === 0 || j === len - 1) ? 0 : f[fftSize - j] * invFFTSize;
            if (b) b[j] = j;
        }
    }
    static signalToFFT(r: Float32Array, i: Float32Array, f: Float32Array) {
        const len = (r.length - 1) * 2;
        f.set(r);
        if (!i) return;
        for (let j = 1; j < i.length - 1; j++) {
            f[len - j] = i[j];
        }
    }
    static signalToNoFFT(r: Float32Array, i: Float32Array, f: Float32Array) {
        f.set(r.subarray(1, r.length));
        if (i) f.set(i.subarray(0, i.length - 1), r.length - 1);
    }
};

export interface FaustFFTInternalState extends FaustNodeInternalState {
    fftNode: FaustMonoAudioWorkletNode;
    params: string[];
}
export interface FaustFFTProps {
    fftSize: number;
    windowFunction: "rectangular" | "blackman" | "hamming" | "hann" | "triangular";
    fftOverlap: 1 | 2 | 4 | 8;
    noIFFT: boolean;
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
        },
        noIFFT: {
            type: "boolean",
            description: "Not Perform IFFt when reconstructing signal, the first element of the real output and the last element of the imaginary output will be dropped.",
            default: false
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
    async getFaustFFTNode(code: string) {
        const { audioCtx } = this;
        const { FaustMonoDspGenerator } = this.env.Faust;
        const faustCompiler = await this.env.getFaustCompiler();
        const generator = new FaustMonoDspGenerator();
        const { factory } = await generator.compile(faustCompiler, "FaustFFTDSP", code, "");
        const fftOptions: Partial<FaustFFTOptionsData> = {};
        if (this.meta.props.fftSize.enums.indexOf(this.getProp("fftSize")) !== -1) fftOptions.fftSize = this.getProp("fftSize");
        if (this.meta.props.windowFunction.enums.indexOf(this.getProp("windowFunction")) !== -1) fftOptions.defaultWindowFunction = this.meta.props.windowFunction.enums.indexOf(this.getProp("windowFunction"));
        if (this.meta.props.fftOverlap.enums.indexOf(this.getProp("fftOverlap")) !== -1) fftOptions.fftOverlap = this.getProp("fftOverlap");
        fftOptions.noIFFT = !!this.getProp("noIFFT");
        const node = await generator.createFFTNode(audioCtx, FFTUtils, "FaustFFTDSP", factory, fftOptions);
        return node as FaustMonoAudioWorkletNode & { dspCode?: string };
    }
    async compileFaustFFTNode(code: string) {
        let splitter: ChannelSplitterNode;
        let merger: ChannelMergerNode;
        const node = await this.getFaustFFTNode(code);
        if (!node) throw new Error("Cannot compile Faust code");
        node.channelInterpretation = "discrete";
        node.dspCode = code;
        const { audioCtx } = this.patcher;
        const inlets = Math.ceil(node.getNumInputs() / 3);
        const outlets = Math.ceil(node.getNumOutputs() / 2);
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
    async newNode(code: string) {
        let compiled: ReturnType<UnPromisifiedFunction<FaustFFT["compileFaustFFTNode"]>>;
        try {
            compiled = await this.compileFaustFFTNode(code);
        } catch (e) {
            this.error((e as Error).message);
            return;
        }
        const { inlets, outlets, merger, splitter, node } = compiled;
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

        const params: string[] = node.getParams().filter(s => !s.endsWith("fftSize") && !s.endsWith("fftHopSize")).sort();
        this._.params = params;
        for (let i = inlets || 1; i < (inlets || 1) + params.length; i++) {
            const path = params[i - (inlets || 1)];
            const param = node.parameters.get(path);
            const { defaultValue, minValue, maxValue } = param;
            factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
            this.inletAudioConnections[i] = { node: param };
        }

        this.setMeta(factoryMeta);
        this.inlets = (inlets || 1) + params.length;
        this.outlets = outlets + 1;
        this.connectAudio();
        this.outlet(this.outlets - 1, this._.fftNode);
    }
    handleUpdateProps = async (props: Partial<FaustFFTProps>) => {
        if (!this._.fftNode) return;
        if ("fftSize" in props && props.fftSize !== this.getProp("fftSize") && this.meta.props.fftSize.enums.indexOf(props.fftSize) !== -1) this._.fftNode.parameters.get("fftSize").value = props.fftSize;
        if ("windowFunction" in props && props.windowFunction !== this.getProp("windowFunction") && this.meta.props.windowFunction.enums.indexOf(props.windowFunction) !== -1) this._.fftNode.parameters.get("windowFunction").value = this.meta.props.windowFunction.enums.indexOf(props.windowFunction);
        if ("fftOverlap" in props && props.fftOverlap !== this.getProp("fftOverlap") && this.meta.props.fftOverlap.enums.indexOf(props.fftOverlap) !== -1) this._.fftNode.parameters.get("fftOverlap").value = props.fftOverlap;
        if ("noIFFT" in props && props.noIFFT !== this.getProp("noIFFT")) this._.fftNode.parameters.get("noIFFT").value = +!!props.noIFFT;
    };
    handlePostInit = async () => {
        if (this.data.code) await this.newNode(this.data.code);
    };
    handleInlet = async ({ data, inlet }: { data: I[number]; inlet: number }) => {
        if (inlet === 0) {
            if (isBang(data)) {
                if (this._.fftNode) this.outlet(this.outlets - 1, this._.fftNode);
            } else if (typeof data === "string") {
                this.setData({ code: data } as D);
                await this.newNode(data);
            } else if (isMIDIEvent(data)) {
                if (this._.fftNode) this._.fftNode.midiMessage(data);
            } else if (typeof data === "object") {
                if (this._.fftNode) {
                    for (const key in data) {
                        try {
                            const bpf = decodeLine((data as Record<string, TBPF>)[key]);
                            this.applyBPF(this._.fftNode.parameters.get(key), bpf);
                        } catch (e) {
                            this.error(e.message);
                        }
                    }
                }
            }
        } else if (this._.fftNode) {
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
    subscribe() {
        this.on("updateProps", this.handleUpdateProps);
        super.subscribe();
    }
}
