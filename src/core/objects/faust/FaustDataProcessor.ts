import type { FaustOfflineProcessor } from "@shren/faustwasm/dist/esm";
import CodePopupUI from "../base/CodePopupUI";
import Bang, { isBang } from "../base/Bang";
import DefaultObject, { DefaultObjectProps } from "../base/DefaultObject";
import { isNumberArray } from "../../../utils/utils";
import type DefaultUI from "../base/DefaultUI";
import type { UnPromisifiedFunction } from "../../workers/Worker";
import type { IInletMeta, IOutletMeta, IInletsMeta, IOutletsMeta, IPropsMeta } from "../base/AbstractObject";

class FaustDataProcessorUI extends CodePopupUI<FaustDataProcessor> {
    editorLanguage = "faust";
    get code() {
        return this.object.data.code;
    }
    handleSave = (code: string) => {
        this.object.setData({ code });
        this.object.newProcessor(code);
    };
}
export interface FaustDataProcessorData {
    code?: string;
}
export interface FaustDataProcessorInternalState {
    processor: FaustOfflineProcessor;
    inputBuffer: Float32Array[];
    nextInputIndex: number;
}
export interface FaustDataProcessorProps {
    sampleRate: number;
    bufferSize: number;
}
type I = [Bang | number | number[] | Float32Array, ...(number | number[] | Float32Array)[]];
type O = (Float32Array | FaustOfflineProcessor)[];

export default class FaustDataProcessor<
    D extends Record<string, any> & Partial<FaustDataProcessorData> = {},
    S extends {} = {},
    A extends any[] = [],
    P extends Record<string, any> & Partial<FaustDataProcessorProps> & Partial<DefaultObjectProps> = {},
    U extends {} = {}
> extends DefaultObject<D & FaustDataProcessorData, S, I, O, A, P & FaustDataProcessorProps & DefaultObjectProps, U> {
    static package = "Faust";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Faust Offline Processor, use data for I/O";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the processor, code string to compile, number or Float32Array as data input"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "FaustOfflineProcessor instance output"
    }];
    static props: IPropsMeta<FaustDataProcessorProps> = {
        sampleRate: {
            type: "number",
            default: 1000,
            description: "Data sampling rate"
        },
        bufferSize: {
            type: "number",
            default: 1,
            description: "Data processing buffer size"
        }
    };
    static UI: typeof DefaultUI = FaustDataProcessorUI;
    _: FaustDataProcessorInternalState = {
        processor: undefined,
        inputBuffer: undefined,
        nextInputIndex: 0
    };
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
        let compiled: ReturnType<UnPromisifiedFunction<FaustDataProcessor["compile"]>>;
        try {
            compiled = await this.compile(code);
        } catch (e) {
            this.error((e as Error).message);
            return;
        }
        const { inlets, outlets, processor } = compiled;
        this.handleDestroy();
        Object.assign(this._, { processor } as FaustDataProcessorInternalState);
        const Ctor = this.constructor as typeof FaustDataProcessor;
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
    handlePreInit = () => undefined as any;
    handlePostInit = async () => {
        if (this.data.code) await this.newProcessor(this.data.code);
    };
    handleUpdateProps = async (props: Partial<FaustDataProcessorProps>) => {
        if (this.data.code) await this.newProcessor(this.data.code);
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
    handleDestroy = () => {
        const { processor } = this._;
        if (processor) {
            processor.stop();
            processor.destroy();
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
        this.on("postInit", this.handlePostInit);
        this.on("updateProps", this.handleUpdateProps);
        this.on("inlet", this.handleInlet);
        this.on("destroy", this.handleDestroy);
    }
}
