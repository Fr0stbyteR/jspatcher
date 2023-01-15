import type { FaustOfflineProcessor } from "@shren/faustwasm/dist/esm";
import { isNumberArray } from "../../../utils/utils";
import type { ProjectFileEventMap } from "../../file/AbstractProjectFile";
import type Patcher from "../../patcher/Patcher";
import type { RawPatcher } from "../../types";
import { UnPromisifiedFunction } from "../../workers/Worker";
import type { IArgsMeta, IInletMeta, IOutletMeta, IPropsMeta } from "../base/AbstractObject";
import Bang, { isBang } from "../base/Bang";
import DefaultObject from "../base/DefaultObject";
import SubPatcherUI from "./SubPatcherUI";

interface InternalState {
    patcher: Patcher;
    key: string;
    code: string;
    processor: FaustOfflineProcessor;
    inputBuffer: Float32Array[];
    nextInputIndex: number;
}

type Args = [key: string];
interface Props {
    sampleRate: number;
    bufferSize: number;
}
type I = [Bang | number | number[] | Float32Array, ...(number | number[] | Float32Array)[]];
type O = (Float32Array | FaustOfflineProcessor)[];

export default class FaustDataPatcher extends DefaultObject<Partial<RawPatcher>, {}, I, O, Args, Props, { patcher: Patcher }> {
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static package = "SubPatcher";
    static description = "Faust Sub-patcher, compiled to offline processor";
    static args: IArgsMeta = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }];
    static props: IPropsMeta<Props> = {
        sampleRate: {
            type: "number",
            description: "Sample Rate",
            default: 10
        },
        bufferSize: {
            type: "number",
            description: "Buffer Size",
            default: 1
        }
    };
    static UI = SubPatcherUI;
    _: InternalState = {
        patcher: undefined,
        key: this.box.args[0],
        code: undefined,
        processor: undefined,
        inputBuffer: undefined,
        nextInputIndex: 0
    };
    type = "faust";
    async getFaustProcessor(code: string) {
        const { FaustMonoDspGenerator } = this.env.Faust;
        const faustCompiler = await this.env.getFaustCompiler();
        const generator = new FaustMonoDspGenerator();
        await generator.compile(faustCompiler, "FaustDSP", code, "");
        return generator.createOfflineProcessor(this.getProp("sampleRate"), this.getProp("bufferSize"));
    }
    async compile(code: string) {
        const processor = await this.getFaustProcessor(code) as FaustOfflineProcessor & { dspCode?: string };
        if (!processor) throw new Error("Cannot compile Faust code");
        processor.dspCode = code;
        processor.start();
        const inlets = processor.getNumInputs();
        const outlets = processor.getNumOutputs();
        return { inlets, outlets, processor };
    }
    async newProcessor(code: string) {
        let compiled: ReturnType<UnPromisifiedFunction<FaustDataPatcher["compile"]>>;
        try {
            compiled = await this.compile(code);
        } catch (e) {
            this.error((e as Error).message);
            return;
        }
        const { inlets, outlets, processor } = compiled;
        this.handleDestroy();
        Object.assign(this._, { processor } as InternalState);
        const Ctor = this.constructor as typeof FaustDataPatcher;
        const firstInletMeta = Ctor.inlets[0];
        const firstInletSignalMeta: IInletMeta = { ...firstInletMeta, type: "object" };
        const inletMeta: IInletMeta = { isHot: false, type: "object", description: "Data input" };
        const audioParamInletMeta: IInletMeta = { isHot: false, type: "number", description: "Parameter change" };
        const outletMeta: IOutletMeta = { type: "object", description: "Data output" };
        const lastOutletMeta = Ctor.outlets[0];
        const factoryMeta = Ctor.meta as this["meta"];
        for (let i = 0; i < inlets; i++) {
            if (i === 0) factoryMeta.inlets[i] = compiled.inlets ? firstInletSignalMeta : firstInletMeta;
            else factoryMeta.inlets[i] = inletMeta;
        }
        for (let i = 0; i < outlets; i++) {
            factoryMeta.outlets[i] = outletMeta;
        }
        factoryMeta.outlets[outlets] = lastOutletMeta;
        const params = processor.getParams().sort();
        for (let i = inlets || 1; i < (inlets || 1) + params.length; i++) {
            const path = params[i - (inlets || 1)];
            const param = processor.getParameterDescriptors().find(p => p.name === path);
            const { defaultValue, minValue, maxValue } = param;
            factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
        }
        this.setMeta(factoryMeta);
        this.inlets = (inlets || 1) + params.length;
        this.outlets = outlets + 1;
        this._.inputBuffer = [];
        this._.nextInputIndex = 0;
        this.outlet(this.outlets - 1, this._.processor);
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
            await this.newProcessor(code);
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
            await this.unsubscribePatcher();
        }
        const { key } = this._;
        let patcher: Patcher;
        let rawPatcher: RawPatcher;
        try {
            const { item, newItem } = await this.getSharedItem(key, "patcher", async () => {
                patcher = new this.Patcher({ env: this.patcher.env, project: this.patcher.project });
                await patcher.load(this.data, "faust");
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
        }
    };
    handlePreInit = () => {};
    handleUpdateArgs = async (args: Partial<Args>) => {
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
        await this.reload();
    };
    handlePostInit = this.reload;
    handleDestroy = () => {
        const { processor } = this._;
        if (processor) {
            processor.stop();
            processor.destroy();
        }
    };
    handleInlet = async ({ data, inlet }: { data: I[number]; inlet: number }) => {
        if (!this._.processor) return;
        if (inlet === 0 && isBang(data)) {
            this.outlet(this.outlets - 1, this._.processor);
        } else if (inlet < this._.processor.getNumInputs()) {
            const bufferSize = this.getProp("bufferSize");
            if (typeof data === "number") {
                if (this._.nextInputIndex === 0) this._.inputBuffer[inlet] = new Float32Array(bufferSize);
                this._.inputBuffer[inlet][this._.nextInputIndex] = data;
                if (inlet === 0) this._.nextInputIndex++;
                if (inlet === 0 && this._.nextInputIndex === bufferSize) {
                    const output = new Array(this._.processor.getNumOutputs()).fill(null).map(() => new Float32Array(bufferSize));
                    this._.processor.compute(this._.inputBuffer, output);
                    this.outletAll(output);
                    this._.nextInputIndex = 0;
                }
            } else if (data instanceof Float32Array) {
                if (data.length === bufferSize) {
                    this._.inputBuffer[inlet] = data;
                } else if (data.length > bufferSize) {
                    this._.inputBuffer[inlet] = data.subarray(0, bufferSize);
                } else {
                    this._.inputBuffer[inlet] = new Float32Array(bufferSize);
                    this._.inputBuffer[inlet].set(data);
                }
                const output = new Array(this._.processor.getNumOutputs()).fill(null).map(() => new Float32Array(bufferSize));
                this._.processor.compute(this._.inputBuffer, output);
                this.outletAll(output);
                this._.nextInputIndex = 0;
            } else if (isNumberArray(data)) {
                this._.inputBuffer[inlet] = new Float32Array(bufferSize);
                if (data.length <= bufferSize) {
                    this._.inputBuffer[inlet].set(data);
                } else {
                    this._.inputBuffer[inlet].set(data.slice(0, bufferSize));
                }
                const output = new Array(this._.processor.getNumOutputs()).fill(null).map(() => new Float32Array(bufferSize));
                this._.processor.compute(this._.inputBuffer, output);
                this.outletAll(output);
                this._.nextInputIndex = 0;
            }
        } else if (typeof data === "number") {
            const params = this._.processor.getParams().sort();
            const param = params[inlet - this._.processor.getNumInputs()];
            if (param) this._.processor.setParamValue(param, data);
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
        this.on("postInit", this.handlePostInit);
        this.on("updateArgs", this.handleUpdateArgs);
        this.on("updateProps", this.handleUpdateProps);
        this.on("inlet", this.handleInlet);
        this.on("destroy", this.handleDestroy);
        this.on("destroy", this.unsubscribePatcher);
    }
}
