import FaustNode, { FaustNodeInternalState } from "../faust/FaustNode";
import SubPatcherUI from "./SubPatcherUI";
import type Patcher from "../../patcher/Patcher";
import type { ProjectFileEventMap } from "../../file/AbstractProjectFile";
import type { RawPatcher } from "../../types";
import type { IInletMeta, IJSPatcherObjectMeta, IOutletMeta, IOutletsMeta, IPropsMeta } from "../base/AbstractObject";
import FaustFFTNode from "../../worklets/FaustFFTNode";
import { UnPromisifiedFunction } from "../../workers/Worker";

interface InternalState extends FaustNodeInternalState {
    fftNode: FaustFFTNode;
    patcher: Patcher;
    key: string;
    code: string;
}
interface Props {
    fftSize: number;
    windowFunction: "rectangular" | "blackman" | "hamming" | "hann" | "triangular";
    fftOverlap: 1 | 2 | 4 | 8;
}
export default class FaustFFTPatcher extends FaustNode<Partial<RawPatcher>, {}, [string, number], Props, { patcher: Patcher }> {
    static package = "SubPatcher";
    static description = "Use Faust Sub-patcher for spectral processing inside an AudioWorklet, each input <: real, imag, bin, real, imag :> each output";
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "FaustFFTNode instance output"
    }];
    static props: IPropsMeta<Props> = {
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
    static UI = SubPatcherUI;
    _: InternalState = {
        merger: undefined,
        splitter: undefined,
        node: undefined,
        fftNode: undefined,
        voices: 0,
        patcher: undefined,
        key: this.box.args[0],
        code: undefined
    };
    type: "faust" | "gen" = "faust";
    async getFaustFFTNode(code: string) {
        const { audioCtx } = this;
        const { FaustMonoDspGenerator } = this.env.Faust;
        const faustCompiler = await this.env.getFaustCompiler();
        const generator = new FaustMonoDspGenerator();
        const { factory } = await generator.compile(faustCompiler, "FaustDSP", code, "");
        const op = await generator.createOfflineProcessor(audioCtx.sampleRate, 128);
        const node = new FaustFFTNode(audioCtx, {
            channelCount: Math.ceil(op.getNumInputs() / 3) || 1,
            outputChannelCount: [Math.ceil(op.getNumOutputs() / 2) || 1],
            processorOptions: { factory }
        });
        return node;
    }
    async compileFaustFFTNode(code: string) {
        let splitter: ChannelSplitterNode;
        let merger: ChannelMergerNode;
        const node = await this.getFaustFFTNode(code);
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
        return { inlets, outlets, node, splitter, merger };
    }
    async newNode(code: string) {
        let compiled: ReturnType<UnPromisifiedFunction<FaustFFTPatcher["compileFaustFFTNode"]>>;
        try {
            compiled = await this.compileFaustFFTNode(code);
        } catch (e) {
            this.error((e as Error).message);
            return;
        }
        const { inlets, outlets, merger, splitter, node } = compiled;
        this.disconnectAudio();
        this.handleDestroy();
        Object.assign(this._, { merger, splitter, fftNode: node } as InternalState);
        const Ctor = this.constructor as typeof FaustNode;
        const firstInletMeta = Ctor.inlets[0];
        const firstInletSignalMeta: IInletMeta = { ...firstInletMeta, type: "signal" };
        const inletMeta: IInletMeta = { isHot: false, type: "signal", description: "Node connection" };
        // const audioParamInletMeta: IInletMeta = { isHot: false, type: "signal", description: ": bpf or node connection" };
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
        /*
        const audioParams: string[] = [...node.parameters].map(([k]) => k).sort();
        for (let i = inlets || 1; i < (inlets || 1) + audioParams.length; i++) {
            const path = audioParams[i - (inlets || 1)];
            const param = node.parameters.get(path);
            const { defaultValue, minValue, maxValue } = param;
            factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
            this.inletAudioConnections[i] = { node: param };
        }
        */
        this.setMeta(factoryMeta);
        this.inlets = (inlets || 1);// + audioParams.length;
        this.outlets = outlets + 1;
        this.connectAudio();
        this.outlet(this.outlets - 1, this._.fftNode);
    }
    handleFilePathChanged = () => {
        this._.key = this._.patcher.file.projectPath;
    };
    handleSaved = (e: ProjectFileEventMap["saved"]) => {
        if (e.instance === this._.patcher) return;
        this.reload();
    };
    subscribePatcher = async () => {
        const { patcher } = this._;
        if (patcher) {
            await patcher.addObserver(this);
            patcher.on("graphChanged", this.handleGraphChanged);
            patcher.on("changed", this.handlePatcherChanged);
            const { file } = patcher;
            if (file) {
                file.on("destroyed", this.reload);
                file.on("nameChanged", this.handleFilePathChanged);
                file.on("pathChanged", this.handleFilePathChanged);
                file.on("saved", this.handleSaved);
            }
        }
    };
    unsubscribePatcher = async () => {
        const { patcher } = this._;
        if (patcher) {
            patcher.off("graphChanged", this.handleGraphChanged);
            patcher.off("changed", this.handlePatcherChanged);
            const { file } = patcher;
            if (file) {
                file.off("destroyed", this.reload);
                file.off("nameChanged", this.handleFilePathChanged);
                file.off("pathChanged", this.handleFilePathChanged);
                file.off("saved", this.handleSaved);
            }
            await patcher.removeObserver(this); // patcher will be destroyed if no observers left.
        }
    };
    async compilePatcher() {
        const code = this._.patcher.toFaustDspCode();
        if (code && code !== this._.code) {
            this._.code = code;
            await this.newNode(code);
        }
    }
    handleGraphChanged = async () => {
        await this.compilePatcher();
        this.patcher.emit("graphChanged");
    };
    handlePatcherChanged = () => {
        const { patcher } = this._;
        if (patcher.isTemporary) {
            const rawPatcher = patcher.toSerializable();
            this.setData(rawPatcher);
        }
        this.patcher.emit("changed");
    };
    reload = async () => {
        if (this._.patcher) {
            this.disconnectAudio();
            await this.unsubscribePatcher();
        }
        const { key } = this._;
        let patcher: Patcher;
        let rawPatcher: RawPatcher;
        try {
            const { item, newItem } = await this.getSharedItem(key, "patcher", async () => {
                patcher = new this.Patcher({ env: this.patcher.env, project: this.patcher.project });
                await patcher.load(this.data, this.type);
                rawPatcher = patcher.toSerializable();
                return rawPatcher;
            });
            if (newItem) {
                patcher.file = item;
                this.setData(rawPatcher);
            } else {
                await patcher?.destroy();
                patcher = await item.instantiate({ env: this.patcher.env, project: this.patcher.project }) as Patcher;
                this.setData(patcher.toSerializable());
            }
            this._.patcher = patcher;
            this.updateUI({ patcher });
        } catch (error) {
            this.error(error);
        } finally {
            await this.subscribePatcher();
            await this.handleGraphChanged();
            this.connectAudio();
        }
    };
    handlePreInit = () => {};
    handleUpdateArgs = async (args: Partial<[string, number]>): Promise<void> => {
        if (!this._.patcher) return;
        const { key } = this._;
        let newKey = key;
        if (typeof args[0] === "string" || typeof args[0] === "undefined") {
            newKey = args[0];
            if (newKey !== key) this._.key = newKey;
        }
        if (newKey !== key) {
            await this.reload();
        }
    };
    handleUpdateProps = async (props: Partial<Props>) => {
        if (!this._.fftNode) return;
        if (props.fftSize !== this.getProp("fftSize") && this.meta.props.fftSize.enums.indexOf(props.fftSize) !== -1) this._.fftNode.parameters.get("fftSize").value = props.fftSize;
        if (props.windowFunction !== this.getProp("windowFunction") && this.meta.props.windowFunction.enums.indexOf(props.windowFunction) !== -1) this._.fftNode.parameters.get("windowFunction").value = this.meta.props.windowFunction.enums.indexOf(props.windowFunction);
        if (props.fftOverlap !== this.getProp("fftOverlap") && this.meta.props.fftOverlap.enums.indexOf(props.fftOverlap) !== -1) this._.fftNode.parameters.get("fftOverlap").value = props.fftOverlap;
    };
    handlePostInit = async () => {
        await FaustFFTNode.register(this.audioCtx.audioWorklet);
        return this.reload();
    };
    subscribe() {
        this.on("updateProps", this.handleUpdateProps);
        super.subscribe();
        this.on("destroy", this.unsubscribePatcher);
    }
}
