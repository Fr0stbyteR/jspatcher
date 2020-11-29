import { DefaultObject } from "./Base";
import Patcher from "../patcher/Patcher";
import Box from "../patcher/Box";
import Line from "../patcher/Line";
import { TPackage, TMeta, TPropsMeta, RawPatcher } from "../types";
import { SubPatcherUI } from "./SubPatcher";
import { TFaustDocs } from "../../misc/monaco-faust/Faust2Doc";
import { CodeUI } from "./UI/code";
import comment from "./UI/comment";
import { ImporterDirSelfObject } from "../../utils/symbols";
import PatcherFile from "../patcher/PatcherFile";

type TObjectExpr = {
    exprs?: string[];
    onces?: string[];
};
type TLineMap = Map<Line, string>;

const findOutletFromLineMap = (lineMap: TLineMap, linesIn: Set<Line>) => {
    const iterator = linesIn.values();
    let r: IteratorResult<Line, Line>;
    while (!(r = iterator.next()).done) {
        const outlet = lineMap.get(r.value);
        if (outlet) return outlet;
    }
    return undefined;
};
export interface FaustOpState {
    inlets: number;
    outlets: number;
    defaultArgs: (number | string)[];
}
export class FaustOp<D extends Record<string, any> = {}, S extends Partial<FaustOpState> & Record<string, any> = FaustOpState, A extends any[] = (number | "_")[], P extends Record<string, any> = {}, U extends Record<string, any> = {}, E extends Record<string, any> = {}> extends DefaultObject<D, S & FaustOpState, [], [], A, P, U, E> {
    static package = "FaustOps";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Faust Operator";
    static inlets: TMeta["inlets"] = [{
        type: "number",
        isHot: true,
        varLength: true,
        description: "_"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "number",
        varLength: true,
        description: "_"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        optional: true,
        varLength: true,
        description: "Parameters"
    }];
    /**
     * Symbol(s) used to register class
     *
     * @type {string[]}
     * @memberof FaustOp
     */
    get symbol(): string[] {
        return [];
    }
    /**
     * Apply args and inlets from end.
     *
     * @memberof FaustOp
     */
    reverseApply = false;
    state = { inlets: 1, outlets: 1, defaultArgs: [0] } as S & FaustOpState;
    get resultID() {
        return `${this.meta.name.replace(".", "_")}_${this.box.id.substr(4)}`;
    }
    get constArgsCount() {
        const { args } = this.box;
        return args.filter(s => s !== "_").length;
    }
    /**
     * Supress inlet if defined in args
     *
     * @memberof FaustOp
     */
    handleUpdate = (e: { args?: any[]; props?: Record<string, any> }) => {
        if (!e.args) return;
        this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
        this.outlets = this.state.outlets;
    };
    subscribe() {
        super.subscribe();
        this.on("update", this.handleUpdate);
    }
    /**
     * Get the parameters' expression "in1, in2, in3"
     *
     * @param {TLineMap} lineMap
     * @memberof FaustOp
     */
    toInletsExpr(lineMap: TLineMap) {
        const { inletLines, box, state } = this;
        const { args } = box;
        const { inlets: totalInlets } = state;
        const inlets = new Array(totalInlets);
        const incoming = inletLines.map((set, i) => {
            const lines = Array.from(set);
            const defaultArg = typeof state.defaultArgs[i] === "undefined" ? "0" : `${state.defaultArgs[i]}`;
            if (lines.length === 0) return defaultArg;
            if (lines.length === 1) return lineMap.get(lines[0]) || defaultArg;
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        });
        if (this.reverseApply) {
            for (let i = 0; i < totalInlets; i++) {
                if (i < args.length) {
                    const arg = args[args.length - 1 - i];
                    if (arg !== "_") {
                        inlets[totalInlets - 1 - i] = arg;
                        continue;
                    }
                }
                inlets[totalInlets - 1 - i] = incoming.pop() || "0";
            }
        } else {
            for (let i = 0; i < totalInlets; i++) {
                if (i < args.length) {
                    const arg = args[i];
                    if (arg !== "_") {
                        inlets[i] = arg;
                        continue;
                    }
                }
                inlets[i] = incoming.shift() || "0";
            }
        }
        return inlets.join(", ");
    }
    /**
     * Main expresstion format, i.e. `out = func(in1, in2, in3);`
     *
     * @param {string} out
     * @param {string} inlets
     * @returns
     * @memberof FaustOp
     */
    toMainExpr(out: string, inlets: string) {
        if (inlets) return `${out} = ${this.symbol[0]}(${inlets});`;
        return `${out} = ${this.symbol[0]};`;
    }
    /**
     * Faust code that will be included once in the final dsp code.
     *
     * @returns {string[]}
     * @memberof FaustOp
     */
    toOnceExpr(): string[] {
        return [];
    }
    /**
     * Transform to faust dsp expression using a string map for line IDs.
     *
     * @param {TLineMap} lineMap
     * @returns {TObjectExpr}
     * @memberof FaustOp
     */
    toExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const onces = this.toOnceExpr();

        const { outletLines, resultID } = this;
        const inlets = this.toInletsExpr(lineMap);

        if (outletLines.length === 0) return {};
        if (outletLines.length === 1) {
            if (outletLines[0].size === 0) return {};
            const outlet = findOutletFromLineMap(lineMap, outletLines[0]);
            return outlet ? { exprs: [this.toMainExpr(outlet, inlets)], onces } : {};
        }
        exprs.push(this.toMainExpr(resultID, inlets));
        const allCut = new Array(this.outlets).fill("!");
        outletLines.forEach((lines, i) => {
            if (lines.size === 0) return;
            const outlet = findOutletFromLineMap(lineMap, lines);
            if (!outlet) return;
            const pass = allCut.slice();
            pass[i] = "_";
            exprs.push(`${outlet} = ${resultID} : ${pass.join(", ")};`);
        });
        return { exprs, onces };
    }
}
export class EmptyObject extends FaustOp<{}, { editing: boolean }> {
    static description = "No-op";
    state: FaustOpState & { editing: boolean } = { ...this.state, inlets: 0, outlets: 0, editing: false };
    toExpr(): TObjectExpr {
        return {};
    }
}
export class InvalidObject extends FaustOp {
    static description = "No-op";
    static props: TMeta["props"] = {
        bgColor: {
            type: "color",
            default: "rgb(128, 64, 64)",
            description: "Background color",
            isUIState: true
        }
    };
    state: FaustOpState = { ...this.state, inlets: 0, outlets: 0 };
    toExpr(): TObjectExpr {
        return {};
    }
}
interface GenParamProps {
    default: number;
    max: number;
    min: number;
    name: string;
}
export class Param extends FaustOp<{}, {}, [string, number, number, number, number], GenParamProps> {
    static description = "DSP Parameter";
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Parameter name / descriptor"
    }, {
        type: "number",
        optional: false,
        description: "Parameter default"
    }, {
        type: "number",
        optional: false,
        description: "Parameter min"
    }, {
        type: "number",
        optional: false,
        description: "Parameter max"
    }, {
        type: "number",
        optional: false,
        description: "Parameter step"
    }];
    static props: TPropsMeta<GenParamProps> = {
        default: {
            type: "number",
            default: 0,
            description: "Parameter default"
        },
        max: {
            type: "number",
            default: 2147483647,
            description: "Parameter max"
        },
        min: {
            type: "number",
            default: -2147483648,
            description: "Parameter min"
        },
        name: {
            type: "string",
            default: "",
            description: "Parameter name / descriptor"
        }
    };
    get symbol() {
        return ["hslider"];
    }
    state: FaustOpState = { ...this.state, inlets: 0, outlets: 1 };
    toInletsExpr(lineMap: TLineMap) {
        const { box, resultID } = this;
        const { default: d, max, min, name } = this.props;
        const args = box.args.slice(0, 5);
        args[0] = args[0] ? `"${args[0]}"` : name ? `"${name}"` : `"${resultID}"`;
        if (typeof args[1] === "undefined") args[1] = d;
        if (typeof args[2] === "undefined") args[2] = min;
        if (typeof args[3] === "undefined") args[3] = max;
        if (typeof args[4] === "undefined") args[4] = 0.01;
        return args.join(", ");
    }
}
class HSlider extends Param {}
class VSlider extends Param {
    get symbol() {
        return ["vslider"];
    }
}
class Nentry extends Param {
    get symbol() {
        return ["nentry"];
    }
}
class Checkbox extends Param {
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Parameter name / descriptor"
    }];
    get symbol() {
        return ["checkbox"];
    }
    toInletsExpr(lineMap: TLineMap) {
        const { box, resultID } = this;
        const { args } = box;
        return args[0] ? `"${args[0]}"` : `"${resultID}"`;
    }
}
class Button extends Checkbox {
    get symbol() {
        return ["button"];
    }
}
class HBargraph extends FaustOp<{}, {}, [string, number, number]> {
    static description = "Bargraph monitor";
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "UI name / descriptor"
    }, {
        type: "number",
        optional: false,
        description: "Parameter min"
    }, {
        type: "number",
        optional: false,
        description: "Parameter max"
    }];
    get symbol() {
        return ["hbargraph"];
    }
    state: FaustOpState = { ...this.state, inlets: 1, outlets: 1 };
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
    }
    toInletsExpr(lineMap: TLineMap) {
        const { box, resultID } = this;
        const args = box.args.slice(0, 3);
        args[0] = args[0] ? `"${args[0]}"` : `"${resultID}"`;
        args[1] = args[1] || 0;
        args[2] = args[2] || 1;
        return args.join(", ");
    }
    toExpr(lineMap: TLineMap): TObjectExpr {
        const { inletLines, outletLines, symbol } = this;
        const incoming = inletLines.length ? inletLines.map((set) => {
            const lines = Array.from(set);
            if (lines.length === 0) return "0";
            if (lines.length === 1) return lineMap.get(lines[0]) || "0";
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        }) : ["0"];
        const inlets = this.toInletsExpr(lineMap);

        if (outletLines.length === 1) {
            if (outletLines[0].size === 0) return {};
            const outlet = findOutletFromLineMap(lineMap, outletLines[0]);
            if (!outlet) return {};
            const mainExpr = `${outlet} = ${incoming[0]} : ${symbol[0]}(${inlets});`;
            return outlet ? { exprs: [mainExpr] } : {};
        }
        return {};
    }
}
class VBargraph extends HBargraph {
    get symbol() {
        return ["vbargraph"];
    }
}
class HGroup extends FaustOp<{}, {}, [string]> {
    static description = "UI group";
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "UI name / descriptor"
    }];
    get symbol() {
        return ["hgroup"];
    }
    state: FaustOpState = { ...this.state, inlets: 1, outlets: 1 };
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
    }
    toInletsExpr(lineMap: TLineMap) {
        const { inletLines, box, resultID } = this;
        const incoming = inletLines.length ? inletLines.map((set) => {
            const lines = Array.from(set);
            if (lines.length === 0) return "0";
            if (lines.length === 1) return lineMap.get(lines[0]) || "0";
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        }) : ["0"];
        const { args } = box;
        return [args[0] ? `"${args[0]}"` : `"${resultID}"`, incoming[0]].join(", ");
    }
}
class VGroup extends HGroup {
    get symbol() {
        return ["vgroup"];
    }
}
class TGroup extends HGroup {
    get symbol() {
        return ["tgroup"];
    }
}

class Import extends FaustOp {
    static description = "Import a library";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "stdfaust.lib",
        description: "imported library"
    }];
    get symbol() {
        return ["import"];
    }
    state: FaustOpState = { ...this.state, inlets: 0, outlets: 0, defaultArgs: [Import.args[0].default] };
    toOnceExpr(): string[] {
        return [`${this.symbol[0]}("${this.box.args[0] || this.state.defaultArgs[0]}");`];
    }
}
export class In extends FaustOp {
    static description = "Signal Input";
    static args: TMeta["args"] = [{
        type: "number",
        optional: false,
        description: "Signal index (0-based)"
    }];
    get symbol() {
        return ["in"];
    }
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 1;
        });
    }
    get index() {
        const i = this.box.args[0];
        return typeof i === "number" && i >= 0 ? i : Infinity;
    }
    get resultID() {
        const i = this.box.args[0];
        return `${this.meta.name.replace(".", "_")}_${typeof i === "number" && i >= 0 ? i : this.box.id.substr(4)}`;
    }
    toMainExpr(out: string, inlets: string) {
        return `${out} = _;`;
    }
}
export class Out extends FaustOp {
    static description = "Signal Output";
    static args: TMeta["args"] = [{
        type: "number",
        optional: false,
        description: "Signal index (0-based)"
    }];
    get symbol() {
        return ["out"];
    }
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
    }
    get index() {
        const i = this.box.args[0];
        return typeof i === "number" && i >= 0 ? i : Infinity;
    }
    get resultID() {
        const i = this.box.args[0];
        return `${this.meta.name.replace(".", "_")}_${typeof i === "number" && i >= 0 ? i : this.box.id.substr(4)}`;
    }
    toExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const inlets = this.inletLines.map((set) => {
            const lines = Array.from(set);
            if (lines.length === 0) return "0";
            if (lines.length === 1) return lineMap.get(lines[0]) || "0";
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        });

        exprs.push(`${this.resultID} = ${inlets.join(", ")};`);
        return { exprs };
    }
}
class Pass extends FaustOp {
    static description = "Bypass Signal";
    get symbol() {
        return ["_"];
    }
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
    }
    toMainExpr(out: string, inlets: string) {
        return `${out} = ${inlets};`;
    }
}
type TSendMap = Record<string, Send[]>;
const sendMap: TSendMap = {};
export class Send extends FaustOp<{}, { sendMap: TSendMap }> {
    static description = "Send Signal to receive";
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Send / Receive ID"
    }];
    get symbol() {
        return ["s"];
    }
    state: FaustOpState & { sendMap: TSendMap } = { ...this.state, inlets: 1, outlets: 0, sendMap };
    get sendID() {
        return this.box.args[0];
    }
    handleUpdate = (e: { args?: any[] }) => {
        if (!e.args) return;
        const { args } = this.box;
        if (args && args[0]) {
            const sendID = args[0];
            if (!this.state.sendMap[sendID]) this.state.sendMap[sendID] = [];
            if (this.state.sendMap[sendID].indexOf(this) === -1) this.state.sendMap[sendID].push(this);
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("destroy", () => {
            const sendID = this.box.args[0];
            if (!sendID) return;
            if (!this.state.sendMap[sendID]) return;
            const $ = this.state.sendMap[sendID].indexOf(this);
            if ($ === -1) return;
            this.state.sendMap[sendID].splice($, 1);
        });
    }
    toMainExpr(out: string, inlets: string) {
        return `${out} = ${inlets};`;
    }
}
export class Receive extends FaustOp<{}, { sendMap: TSendMap }> {
    static description = "Receive Signal from send";
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Send / Receive ID"
    }];
    get symbol() {
        return ["r"];
    }
    state: FaustOpState & { sendMap: TSendMap } = { ...this.state, inlets: 0, outlets: 1, sendMap };
    get sendID() {
        return this.box.args[0];
    }
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 1;
        });
    }
    toInletsExpr(lineMap: TLineMap) {
        const { box, state } = this;
        const { args } = box;
        const inletLines: Set<Line>[] = [new Set<Line>()];
        const sendID = args[0];
        if (sendID && state.sendMap[sendID]) {
            state.sendMap[sendID].forEach(s => s.inletLines.forEach(lines => lines.forEach(line => inletLines[0].add(line))));
        }
        return inletLines.map((set) => { // inlets as 0, 1, 2
            const lines = Array.from(set);
            if (lines.length === 0) return "0";
            if (lines.length === 1) return lineMap.get(lines[0]) || "0";
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        }).join(", ");
    }
    toMainExpr(out: string, inlets: string) {
        if (inlets) return `${out} = ${inlets};`;
        return `${out} = 0;`;
    }
}
class Split extends FaustOp {
    static description = "Split Signal";
    get symbol() {
        return ["<:"];
    }
    state: FaustOpState = { ...this.state, inlets: 1, outlets: 2 };
    toMainExpr(out: string, inlets: string) {
        return `${out} = ${inlets} ${this.symbol[0]} ${new Array(this.outlets).fill("_").join(", ")};`;
    }
}
class Merge extends FaustOp {
    static description = "Merge Signal";
    get symbol() {
        return [":>"];
    }
    state: FaustOpState = { ...this.state, inlets: 2, outlets: 1 };
    toMainExpr(out: string, inlets: string) {
        return `${out} = ${inlets} ${this.symbol[0]} _;`;
    }
}
export class Rec extends FaustOp {
    static description = "Recursion with 1-sample delay";
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 1,
        description: "Samples to delay"
    }];
    get symbol() {
        return ["~"];
    }
    state: FaustOpState = { ...this.state, inlets: 1, outlets: 1 };
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
    }
    toInletsExpr(lineMap: TLineMap) {
        const { inletLines, state } = this;
        const incoming = inletLines.map((set, i) => {
            const lines = Array.from(set);
            if (lines.length === 0) return `${state.defaultArgs[i]}` || "0";
            if (lines.length === 1) return lineMap.get(lines[0]) || `${state.defaultArgs[i]}` || "0";
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        });
        return incoming.join(", ");
    }
    toExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const inlets = this.toInletsExpr(lineMap);

        exprs.push(`${this.resultID} = ${inlets}${~~this.box.args[0] > 1 ? ` : @(${~~this.box.args[0] - 1})` : ""};`);
        return { exprs };
    }
}
class Mem extends FaustOp {
    static description = "1-sample delay";
    get symbol() {
        return ["mem", "'"];
    }
    state: FaustOpState = { ...this.state, inlets: 1, outlets: 1 };
}
export class Const extends FaustOp {
    static description = "Output a constant";
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Constant value"
    }];
    get symbol() {
        return ["const", "c"];
    }
    state: FaustOpState = { ...this.state, inlets: 1, outlets: 1 };
    toMainExpr(out: string, inlets: string) {
        return `${out} = ${inlets};`;
    }
}
class Group extends FaustOp<{}, {}, (number | "_")[], { ins: number }> {
    static description = "Group inlets like (x, x, x)";
    static outlets: TMeta["outlets"] = [{
        type: "number",
        varLength: true,
        description: "(...)"
    }];
    static props: TPropsMeta<{ ins: number }> = {
        ins: {
            type: "number",
            default: 1,
            description: "Inputs count"
        }
    };
    state: FaustOpState = { ...this.state, inlets: 1, outlets: 1 };
    get symbol() {
        return ["()"];
    }
    handleUpdate = (e?: { args?: any[]; props?: LibOpProps }) => {
        if ("ins" in e.props) this.state.inlets = ~~+this.getProp("ins");
        if (e.args.length || "ins" in e.props) {
            this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
            this.outlets = this.state.outlets;
        }
    };
    toMainExpr(out: string, inlets: string) {
        return `${out} = (${inlets});`;
    }
}
class Waveform extends FaustOp {
    static description = "Waveform";
    static outlets: TMeta["outlets"] = [{
        type: "number",
        description: "a constant and indicating the size (as a number of samples) of the period"
    }, {
        type: "number",
        description: "the periodic signal itself"
    }];
    get symbol() {
        return ["waveform"];
    }
    state: FaustOpState = { ...this.state, inlets: 0, outlets: 2 };
    toInletsExpr(lineMap: TLineMap) {
        return this.box.args.join(", ");
    }
    toMainExpr(out: string, inlets: string) {
        if (inlets) return `${out} = ${this.symbol[0]}{${inlets}};`;
        return `${out} = ${this.symbol[0]}{0};`;
    }
}
class SR extends FaustOp {
    static description = "Sample Rate";
    get symbol() {
        return ["ma.SR"];
    }
    state: FaustOpState = { ...this.state, inlets: 0, outlets: 1 };
    toOnceExpr(): string[] {
        return ['import("stdfaust.lib");'];
    }
}
class Iterator extends FaustOp {
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "number",
        description: "Result of the function to iterate"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "number",
        description: "Result of all iterations"
    }, {
        type: "number",
        description: "An incremental value on each iteration"
    }];
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Iterations count"
    }];
    state: FaustOpState = { ...this.state, inlets: 1, outlets: 2 };
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = this.state.inlets;
            this.outlets = this.state.outlets;
        });
    }
    toExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const { inletLines, outletLines, box, resultID } = this;
        const inlet0Lines = inletLines[0];
        const { exprs: lExprs, onces } = toFaustLambda(this.patcher, [this], "lambda");
        const lambda = inlet0Lines.size ? `lambda with {
${lExprs.map(s => `    ${s.replace(/\n/g, "\n    ")}`).join("\n")}
}` : "0";
        const inlets = `${resultID}_${this.outlets - 1}, ${box.args[0] || 0}, ${lambda}`;

        if (outletLines.length === 0) return {};
        if (outletLines.length === 1) {
            if (outletLines[0].size === 0) return {};
            const outlet = findOutletFromLineMap(lineMap, outletLines[0]);
            return outlet ? { exprs: [this.toMainExpr(outlet, inlets)], onces } : {};
        }

        exprs.push(this.toMainExpr(resultID, inlets));
        const allCut = new Array(this.outlets - 1).fill("!");
        outletLines.forEach((lines, i) => {
            if (i === this.outlets - 1) return;
            if (lines.size === 0) return;
            const outlet = findOutletFromLineMap(lineMap, lines);
            if (!outlet) return;
            const pass = allCut.slice();
            pass[i] = "_";
            exprs.push(`${outlet} = ${resultID} : ${pass.join(", ")};`);
        });
        return { exprs, onces };
    }
    toNormalExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const { inletLines, outletLines, resultID } = this;
        const inlet0Lines = Array.from(inletLines[0]);
        let inlets;
        if (inlet0Lines.length === 0) inlets = "0";
        else if (inlet0Lines.length === 1) inlets = lineMap.get(inlet0Lines[0]) || "0";
        else inlets = `(${inlet0Lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;

        if (outletLines.length === 0) return {};
        if (outletLines.length === 1) {
            if (outletLines[0].size === 0) return {};
            const outlet = findOutletFromLineMap(lineMap, outletLines[0]);
            return outlet ? { exprs: [`${outlet} = ${inlets};`] } : {};
        }

        exprs.push(`${resultID} = ${inlets};`);
        const allCut = new Array(this.outlets - 1).fill("!");
        outletLines.forEach((lines, i) => {
            if (i === this.outlets - 1) return;
            if (outletLines.length === 0) return;
            const outlet = findOutletFromLineMap(lineMap, lines);
            if (!outlet) return;
            const pass = allCut.slice();
            pass[i] = "_";
            exprs.push(`${outlet} = ${resultID} : ${pass.join(", ")};`);
        });
        return { exprs };
    }
}
class Sum extends Iterator {
    static description = "Sum iterator";
    get symbol() {
        return ["sum"];
    }
}
class Prod extends Iterator {
    static description = "Production iterator";
    get symbol() {
        return ["prod"];
    }
}
class Seq extends Iterator {
    static description = "Seqential iterator";
    get symbol() {
        return ["seq"];
    }
}
class Par extends Iterator {
    static description = "Parallel iterator";
    get symbol() {
        return ["par"];
    }
    handleUpdate = (e: { args?: any[] }) => {
        if (!e.args) return;
        const { args } = this.box;
        this.inlets = 1;
        const outlets = (args ? ~~args[0] : 0) + 1;
        if (outlets === this.outlets) return;
        const outlet0Meta = Par.outlets[0];
        const outlet1Meta = Par.outlets[1];
        const { meta } = this;
        for (let i = 0; i < outlets - 1; i++) {
            meta.outlets[i] = outlet0Meta;
        }
        meta.outlets[outlets - 1] = outlet1Meta;
        this.meta = meta;
        this.outlets = outlets;
    };
    subscribe() {
        super.subscribe();
        this.on("update", this.handleUpdate);
    }
}
export class Effect extends Iterator {
    static description = "Effect processor";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "number",
        description: "Effect output 1"
    }, {
        isHot: true,
        type: "number",
        description: "Effect output 2"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "number",
        description: "Effect input 1"
    }, {
        type: "number",
        description: "Effect input 2"
    }];
    get symbol() {
        return ["effect"];
    }
    state: FaustOpState = { ...this.state, inlets: 2, outlets: 2 };
    toMainExpr(out: string, inlets: string) {
        if (inlets) return `${out} = ${inlets};`;
        return `${out} = _, _;`;
    }
    toExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const { inletLines, outletLines, resultID } = this;
        const inlet0Lines = inletLines[0];
        const { exprs: lExprs, onces } = toFaustLambda(this.patcher, [this], "lambda");
        const lambda = inlet0Lines.size ? `lambda with {
${lExprs.map(s => `    ${s.replace(/\n/g, "\n    ")}`).join("\n")}
}` : "0";
        const inlets = lambda;

        if (outletLines.length === 0) return {};
        if (outletLines.length === 1) {
            if (outletLines[0].size === 0) return {};
            const outlet = findOutletFromLineMap(lineMap, outletLines[0]);
            return outlet ? { exprs: [this.toMainExpr(outlet, inlets)], onces } : {};
        }

        exprs.push(this.toMainExpr(resultID, inlets));
        const allCut = new Array(this.outlets - 1).fill("!");
        outletLines.forEach((lines, i) => {
            if (i === this.outlets - 1) return;
            if (lines.size === 0) return;
            const outlet = findOutletFromLineMap(lineMap, lines);
            if (!outlet) return;
            const pass = allCut.slice();
            pass[i] = "_";
            exprs.push(`${outlet} = ${resultID} : ${pass.join(", ")};`);
        });
        return { exprs, onces };
    }
    toNormalExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const onces = this.toOnceExpr();

        const { outletLines, resultID } = this;
        const inlets = this.toInletsExpr(lineMap);

        if (outletLines.length === 0) return {};
        if (outletLines.length === 1) {
            if (outletLines[0].size === 0) return {};
            const outlet = findOutletFromLineMap(lineMap, outletLines[0]);
            return outlet ? { exprs: [this.toMainExpr(outlet, inlets)], onces } : {};
        }
        exprs.push(this.toMainExpr(resultID, inlets));
        return { exprs, onces };
    }
}
export class Expr extends FaustOp<{}, {}, (string | number)[]> {
    static description = "Evaluate expression with inputs `in1, in2...`";
    get symbol() {
        return ["expr"];
    }
    handleUpdate = async (e: { args?: any[] }) => {
        if (!e.args) return;
        this.inlets = this.getExprInputs();
        this.outlets = await this.getExprOutputs();
    };
    getExprInputs() {
        let inputs = 0;
        const expr = this.box.args.join(" ");
        const regexp = /\bin(\d+)\b/g;
        let r: RegExpExecArray;
        while ((r = regexp.exec(expr))) {
            const input = +r[1];
            if (input > inputs) inputs = input;
        }
        return inputs;
    }
    async getExprOutputs() {
        const regexp = /\bin\d+\b/g;
        const expr = this.box.args.join(" ").replace(/\\,/g, ",").replace(/^-/, "0-");
        const inspectCode = `${this.toOnceExpr().join(" ")} process = ${expr.replace(regexp, "0")};`;
        try {
            const { dspMeta } = await this.patcher.env.faust.inspect(inspectCode, { args: { "-I": "libraries/" } });
            return ~~dspMeta.outputs;
        } catch {
            return 1;
        }
    }
    toExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const onces = this.toOnceExpr();

        const { outletLines, resultID } = this;
        const { inletLines, state } = this;
        const incoming = inletLines.map((set, i) => {
            const lines = Array.from(set);
            if (lines.length === 0) return `${state.defaultArgs[i]}` || "0";
            if (lines.length === 1) return lineMap.get(lines[0]) || `${state.defaultArgs[i]}` || "0";
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        });

        const regexp = /\bin(\d+)\b/g;
        let expr = this.box.args.join(" ").replace(/\\,/g, ",").replace(/^-/, "0-");
        let r: RegExpExecArray;
        while ((r = regexp.exec(expr))) {
            const $ = r.index;
            const l = r[0].length;
            const i = +r[1] - 1;
            expr = `${expr.slice(0, $)}${incoming[i]}${expr.slice($ + l)}`;
        }

        if (outletLines.length === 0) return {};
        if (outletLines.length === 1) {
            if (outletLines[0].size === 0) return {};
            const outlet = findOutletFromLineMap(lineMap, outletLines[0]);
            return outlet ? { exprs: [`${outlet} = ${expr};`], onces } : {};
        }
        exprs.push(`${resultID} = ${expr};`);
        const allCut = new Array(this.outlets).fill("!");
        outletLines.forEach((lines, i) => {
            if (lines.size === 0) return;
            const outlet = findOutletFromLineMap(lineMap, lines);
            if (!outlet) return;
            const pass = allCut.slice();
            pass[i] = "_";
            exprs.push(`${outlet} = ${resultID} : ${pass.join(", ")};`);
        });
        return { exprs, onces };
    }
    toOnceExpr(): string[] {
        return ['import("stdfaust.lib");'];
    }
}
export interface LibOpProps {
    ins: number;
    outs: number;
}
export class LibOp<P extends Record<string, any> = {}> extends FaustOp<{}, {}, (number | "_")[], Partial<LibOpProps> & P> {
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "number",
        varLength: true,
        description: "Function input"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "number",
        varLength: true,
        description: "Function output"
    }];
    static props: TPropsMeta<LibOpProps> = {
        ins: {
            type: "number",
            default: undefined,
            description: "Force function inputs count"
        },
        outs: {
            type: "number",
            default: undefined,
            description: "Force function outputs count"
        }
    };
    state = { inlets: undefined, outlets: undefined, defaultArgs: [] } as FaustOpState;
    handlePostInit = async () => {
        const inletsForced = typeof this.state.inlets === "number";
        const outletsForced = typeof this.state.outlets === "number";
        if (inletsForced && outletsForced) return;
        const { args } = this.box;
        const inspectCode = `${this.toOnceExpr().join(" ")} process = ${this.symbol[0]}${args.length ? `(${args.map(_ => (_ === "_" ? 0 : _)).join(", ")})` : ""};`;
        try {
            const { dspMeta } = await this.patcher.env.faust.inspect(inspectCode, { args: { "-I": "libraries/" } });
            if (!inletsForced) this.state.inlets = ~~dspMeta.inputs + args.length;
            if (!outletsForced) this.state.outlets = ~~dspMeta.outputs;
        } catch (e) {
            if (!inletsForced) this.state.inlets = 0;
            if (!outletsForced) this.state.outlets = 0;
        }
        this.state.defaultArgs = new Array(this.state.inlets).fill(0);
        if (!inletsForced) this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
        if (!outletsForced) this.outlets = this.state.outlets;
        this.patcher.emit("graphChanged");
    };
    handleUpdate = (e?: { args?: any[]; props?: LibOpProps }) => {
        if ("ins" in e.props) this.state.inlets = ~~+this.getProp("ins");
        if ("outs" in e.props) this.state.outlets = ~~+this.getProp("outs");
        if (e.args.length || "ins" in e.props || "outs" in e.props) {
            if (typeof this.state.inlets === "number") this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
            if (typeof this.state.outlets === "number") this.outlets = this.state.outlets;
        }
    };
    subscribe() {
        super.subscribe();
        this.on("postInit", this.handlePostInit);
    }
    toOnceExpr(): string[] {
        return ['import("stdfaust.lib");'];
    }
}
interface SubPatcherState extends FaustOpState {
    patcher: Patcher;
    key: string;
    cachedCode: { exprs: string[]; onces: string[]; ins: number; outs: number };
}
export class SubPatcher extends FaustOp<RawPatcher | {}, SubPatcherState, [string], {}, { patcher: Patcher }> {
    static description = "Sub-patcher represents a sub-process";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "number",
        varLength: true,
        description: "Sub-patcher input"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "number",
        varLength: true,
        description: "Sub-patcher output"
    }];
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }];
    static ui = SubPatcherUI;
    type: "faust" | "gen" = "faust";
    state: SubPatcherState = { inlets: 0, outlets: 0, defaultArgs: [], patcher: new (this.patcher.constructor as typeof Patcher)(this.patcher.project), key: this.box.args[0], cachedCode: { exprs: ["process = 0"], onces: [], ins: 0, outs: 0 } };
    handleFilePathChanged = () => {
        this.state.key = this.state.patcher.file.projectPath;
    };
    subscribePatcher = () => {
        const { patcher, key } = this.state;
        patcher.on("graphChanged", this.handleGraphChanged);
        if (key) {
            const patcherFile = patcher.file;
            if (patcherFile) {
                patcherFile.on("destroyed", this.reload);
                patcherFile.on("nameChanged", this.handleFilePathChanged);
                patcherFile.on("pathChanged", this.handleFilePathChanged);
                patcherFile.on("saved", this.reload);
            } else {
                this.sharedData.subscribe("patcher", key, this);
            }
        }
    };
    unsubscribePatcher = async () => {
        const { patcher, key } = this.state;
        patcher.off("graphChanged", this.handleGraphChanged);
        await patcher.unload();
        if (key) {
            const patcherFile = this.state.patcher.file;
            if (patcherFile) {
                patcherFile.off("destroyed", this.reload);
                patcherFile.off("nameChanged", this.handleFilePathChanged);
                patcherFile.off("pathChanged", this.handleFilePathChanged);
                patcherFile.off("saved", this.reload);
            } else {
                this.sharedData.unsubscribe("patcher", this.state.key, this);
            }
        }
        const newPatcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
        await newPatcher.load({}, this.type);
        this.state.patcher = newPatcher;
    };
    handlePatcherReset = () => {
        this.updateUI({ patcher: this.state.patcher });
    };
    handleGraphChanged = (passive?: boolean) => {
        if (!passive && this.state.key) {
            if (!this.state.patcher.file) {
                this.sharedData.set("patcher", this.state.key, this.state.patcher.toSerializable(), this);
            }
        }
        const { ins, outs, exprs, onces } = inspectFaustPatcher(this.state.patcher);
        this.inlets = ins.length;
        this.outlets = outs.length;
        this.state.inlets = ins.length;
        this.state.outlets = outs.length;
        this.state.defaultArgs = new Array(this.inlets).fill(0);
        this.state.cachedCode = { exprs, onces, ins: ins.length, outs: outs.length };
        this.data = this.state.patcher.toSerializable();
        this.patcher.emit("graphChanged");
    };
    reload = async () => {
        await this.unsubscribePatcher();
        const { args } = this.box;
        if (typeof args[0] === "string" || typeof args[0] === "undefined") this.state.key = args[0];
        const { key } = this.state;
        if (key) {
            this.data = {};
            try {
                const patcherFile = this.patcher.env.fileMgr.getProjectItemFromPath(key) as PatcherFile;
                const patcher = await patcherFile.instantiate();
                this.state.patcher = patcher;
            } catch {
                const shared: RawPatcher = this.sharedData.get("patcher", key);
                if (typeof shared === "object") {
                    const patcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
                    await patcher.load(shared, this.type);
                    this.state.patcher = patcher;
                } else {
                    this.sharedData.set("patcher", key, this.state.patcher.toSerializable(), this);
                }
            }
        } else {
            const { data } = this;
            const patcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
            await patcher.load(data, this.type);
            this.state.patcher = patcher;
            this.data = this.state.patcher.toSerializable();
        }
        this.handlePatcherReset();
        this.subscribePatcher();
        this.handleGraphChanged(true);
    };
    handlePreInit = () => {
        this.state.patcher.props.mode = this.type;
    };
    handleUpdate = async ({ args }: { args?: [string?] }) => {
        if (typeof args[0] === "string" || typeof args[0] === "undefined") {
            const key = args[0];
            if (key !== this.state.key) await this.reload();
        }
    };
    handlePostInit = async () => {
        await this.reload();
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
        this.on("postInit", this.handlePostInit);
        this.on("sharedDataUpdated", this.reload);
        this.on("destroy", this.unsubscribePatcher);
    }
    toInletsExpr(lineMap: TLineMap) {
        const { inletLines, box, state } = this;
        const { args } = box;
        const { inlets: totalInlets } = state;
        const inlets = new Array(totalInlets);
        const incoming = inletLines.map((set, i) => {
            const lines = Array.from(set);
            const defaultArg = typeof state.defaultArgs[i] === "undefined" ? "0" : `${state.defaultArgs[i]}`;
            if (lines.length === 0) return defaultArg;
            if (lines.length === 1) return lineMap.get(lines[0]) || defaultArg;
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        });
        for (let i = 0; i < totalInlets; i++) {
            if (i + 1 < args.length) {
                const arg = args[i + 1];
                if (arg !== "_") {
                    inlets[i] = arg;
                    continue;
                }
            }
            inlets[i] = incoming.shift() || "0";
        }
        return inlets.join(", ");
    }
    toMainExpr(out: string, inlets: string) {
        const { exprs, outs } = this.state.cachedCode;
        if (!outs) return `${out} = ${new Array(this.outlets).fill("0").join(", ")};`;
        const expr = exprs.map(s => `    ${s.replace(/\n/g, "\n    ")}`).join("\n");
        if (inlets) {
            return `${out} = process(${inlets}) with {
${expr}
};`;
        }
        return `${out} = process with {
${expr}
};`;
    }
    toOnceExpr() {
        return this.state.cachedCode.onces;
    }
}
export class Gen extends SubPatcher {
    type = "gen" as const;
}
class Code extends FaustOp<{ value: string }, FaustOpState, [], LibOpProps, { language: string; value: string }, { editorBlur: string; editorLoaded: never }> {
    static description = "Code block a sub-process";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "number",
        varLength: true,
        description: "Sub-process input"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "number",
        varLength: true,
        description: "Sub-process output"
    }];
    static props: TPropsMeta<LibOpProps> = {
        ins: {
            type: "number",
            default: undefined,
            description: "Force function inputs count"
        },
        outs: {
            type: "number",
            default: undefined,
            description: "Force function outputs count"
        }
    };
    static ui = CodeUI as any;
    state = { inlets: undefined, outlets: undefined, defaultArgs: [] } as FaustOpState;
    handlePostInit = async () => {
        const definedInlets = this.getProp("ins");
        const inletsForced = typeof definedInlets === "number";
        const definedOutlets = this.getProp("outs");
        const outletsForced = typeof definedOutlets === "number";
        if (inletsForced && outletsForced) return;
        const { value: code } = this.data;
        if (!code) {
            this.inlets = 0;
            this.outlets = 0;
            return;
        }
        try {
            const { dspMeta } = await this.patcher.env.faust.inspect(code, { args: { "-I": "libraries/" } });
            if (!inletsForced) this.state.inlets = ~~dspMeta.inputs;
            if (!outletsForced) this.state.outlets = ~~dspMeta.outputs;
        } catch (e) {
            if (!inletsForced) this.state.inlets = 0;
            if (!outletsForced) this.state.outlets = 0;
        }
        this.state.defaultArgs = new Array(this.state.inlets).fill(0);
        if (!inletsForced) this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
        if (!outletsForced) this.outlets = this.state.outlets;
        this.patcher.emit("graphChanged");
    };
    handleUpdate = (e?: { args?: any[]; props?: LibOpProps }) => {
        if ("ins" in e.props) this.state.inlets = ~~+this.getProp("ins");
        if ("outs" in e.props) this.state.outlets = ~~+this.getProp("outs");
        if (e.args.length || "ins" in e.props || "outs" in e.props) {
            this.inlets = ~~this.state.inlets - Math.min(~~this.state.inlets, this.constArgsCount);
            this.outlets = ~~this.state.outlets;
        }
    };
    handleBlur = () => {
        this.patcher.emit("graphChanged");
        this.handlePostInit();
    };
    subscribe() {
        super.subscribe();
        this.on("editorLoaded", () => this.updateUI({ language: "faust" }));
        this.on("postInit", this.handlePostInit);
        this.on("editorBlur", this.handleBlur);
    }
    toMainExpr(out: string, inlets: string) {
        const { value } = this.data;
        const code = value.replace(/\n/g, "\n    ");
        if (inlets) {
            return `${out} = environment{
    ${code}
}.process(${inlets});`;
        }
        return `${out} = environment{
    ${code}
}.process;`;
    }
}

const faustOps: TPackage = {
    import: Import,
    in: In,
    out: Out,
    effect: Effect,
    _: Pass,
    "<:": Split,
    ":>": Merge,
    "()": Group,
    "~": Rec,
    "'": Mem,
    mem: Mem,
    const: Const,
    c: Const,
    SR,
    sr: SR,
    sampleRate: SR,
    sum: Sum,
    prod: Prod,
    seq: Seq,
    par: Par,
    waveform: Waveform,
    param: Param,
    hslider: HSlider,
    vslider: VSlider,
    nentry: Nentry,
    checkbox: Checkbox,
    button: Button,
    hbargraph: HBargraph,
    vbargraph: VBargraph,
    hgroup: HGroup,
    vgroup: VGroup,
    tgroup: TGroup,
    send: Send,
    s: Send,
    receive: Receive,
    r: Receive,
    patcher: SubPatcher,
    p: SubPatcher,
    gen: Gen,
    code: Code,
    comment,
    EmptyObject,
    InvalidObject
};

type TOpMap = { [category: string]: { [className: string]: { desc: string; symbol: string | string[]; inlets: number; applyArgsFromStart?: boolean } } };
const opMap: TOpMap = {
    mathOps: {
        Int: { symbol: ["int", "i"], inlets: 1, desc: "Force cast to int" },
        Float: { symbol: ["float", "f"], inlets: 1, desc: "Force cast to float" },

        Delay: { symbol: "@", inlets: 2, desc: "n-sample delay" },
        Add: { symbol: "+", inlets: 2, desc: "Add two signals" },
        Sub: { symbol: "-", inlets: 2, desc: "Substract two signals" },
        Mul: { symbol: "*", inlets: 2, desc: "Multiply two signals" },
        Div: { symbol: "/", inlets: 2, desc: "Divide two signals" },
        Pow: { symbol: "^", inlets: 2, desc: "Raise to the power of N a signal" },
        Mod: { symbol: "%", inlets: 2, desc: "Take the modulo of a signal" },
        And: { symbol: "&", inlets: 2, desc: "Logical AND of two signals" },
        Or: { symbol: "|", inlets: 2, desc: "Logical OR of two signals" },
        Xor: { symbol: "xor", inlets: 2, desc: "Logical XOR of two signals" },
        BLS: { symbol: "<<", inlets: 2, desc: "Bitwise left shift" },
        BRS: { symbol: ">>", inlets: 2, desc: "Bitwise right shift" },
        Lss: { symbol: "<", inlets: 2, desc: "Smaller than comparison" },
        Leq: { symbol: "<=", inlets: 2, desc: "Smaller or equal than comparison" },
        Gtr: { symbol: ">", inlets: 2, desc: "Greater than comparison" },
        Geq: { symbol: ">=", inlets: 2, desc: "Greater or equal than comparison" },
        Eql: { symbol: "==", inlets: 2, desc: "Equal to comparison" },
        NEql: { symbol: "!=", inlets: 2, desc: "Different than comparison" },

        Acos: { symbol: "acos", inlets: 1, desc: "Arc cosine" },
        Asin: { symbol: "asin", inlets: 1, desc: "Arc sine" },
        Atan: { symbol: "atan", inlets: 1, desc: "Arc tangent" },
        Atan2: { symbol: "atan2", inlets: 2, desc: "Arc tangent of 2 signals" },
        Cos: { symbol: "cos", inlets: 1, desc: "Cosine" },
        Sin: { symbol: "sin", inlets: 1, desc: "Sine" },
        Tan: { symbol: "tan", inlets: 1, desc: "Tangent" },
        Exp: { symbol: "exp", inlets: 1, desc: "Base-e exponential" },
        Log: { symbol: "log", inlets: 1, desc: "Base-e logarithm" },
        Log10: { symbol: "log10", inlets: 1, desc: "Base-10 logarithm" },
        Powf: { symbol: "pow", inlets: 2, desc: "Power" },
        Sqrt: { symbol: "sqrt", inlets: 1, desc: "Square root" },
        Abs: { symbol: "abs", inlets: 1, desc: "Absolute value" },
        Min: { symbol: "min", inlets: 2, desc: "Minimum" },
        Max: { symbol: "max", inlets: 2, desc: "Maximum" },
        Modf: { symbol: "fmod", inlets: 2, desc: "Float modulo" },
        Remainder: { symbol: "remainder", inlets: 2, desc: "Float remainder" },
        Floor: { symbol: "floor", inlets: 1, desc: "Largest int" },
        Ceil: { symbol: "ceil", inlets: 1, desc: "Smallest int" },
        Rint: { symbol: "rint", inlets: 1, desc: "Closest int" },

        RdTable: { symbol: "rdtable", inlets: 3, desc: "Read through a read-only table" },
        RWTable: { symbol: "rwtable", inlets: 5, desc: "Read/write table" },

        Select2: { symbol: "select2", inlets: 3, desc: "Two-way selector", applyArgsFromStart: true },
        Select3: { symbol: "select3", inlets: 4, desc: "Three-way selector", applyArgsFromStart: true },
        Attach: { symbol: "attach", inlets: 2, desc: "Force its second input signal to be compiled with the first one", applyArgsFromStart: true }
    }
};
for (const className in opMap.mathOps) {
    const op = opMap.mathOps[className];
    const { symbol, inlets, desc, applyArgsFromStart } = op;
    const outletDesc = `${symbol}(${new Array(inlets).fill("_").join(", ")})`;
    const Op = class extends FaustOp {
        static get _name() { return className; }
        static description = desc;
        static outlets: TMeta["outlets"] = [{
            type: "number",
            description: outletDesc
        }];
        get symbol() {
            return typeof symbol === "string" ? [symbol] : symbol;
        }
        state = { inlets, outlets: 1, defaultArgs: new Array(inlets).fill(0) };
        reverseApply = !applyArgsFromStart;
    };
    if (typeof symbol === "string") faustOps[symbol] = Op;
    else symbol.forEach(s => faustOps[s] = Op);
}
export const getFaustLibObjects = (docs: TFaustDocs) => {
    const ops: TPackage = {};
    for (const key in docs) {
        const doc = docs[key];
        const docStr = doc.doc;
        const Op = class extends LibOp {
            static get _name() { return key; }
            static description = docStr.substr(0, docStr.indexOf("\n"));
            get symbol() {
                return [key];
            }
        };
        const path = key.split(".");
        let pkg = ops;
        while (path.length - 1) {
            const key = path.shift();
            if (!pkg[key]) pkg[key] = {};
            else if (typeof pkg[key] === "function" && pkg[key].prototype instanceof LibOp) pkg[key] = { [ImporterDirSelfObject]: pkg[key] };
            pkg = pkg[key] as TPackage;
        }
        pkg[path[0]] = Op;
    }
    return ops;
};
const mapLines = (box: Box, patcher: Patcher, visitedBoxes: Box[], ins: In[], recs: Rec[], lineMap: Map<Line, string>) => {
    if (visitedBoxes.indexOf(box) >= 0) return;
    visitedBoxes.push(box);
    if (box.object instanceof Iterator && box !== visitedBoxes[0]) return;
    const inletLines = Array.from(box.inletLines);
    if (box.object instanceof Receive) {
        const { sendID } = box.object;
        if (sendMap[sendID]) {
            sendMap[sendID].forEach(s => inletLines.push(...s.inletLines));
        }
    }
    inletLines.forEach(lines => lines.forEach((line) => {
        const { srcBox } = line;
        if (srcBox.object instanceof In && ins.indexOf(srcBox.object) === -1) ins.push(srcBox.object);
        else if (srcBox.object instanceof Rec && recs.indexOf(srcBox.object) === -1) recs.push(srcBox.object);
        if (srcBox.object instanceof Effect) lineMap.set(line, "_");
        else lineMap.set(line, `${(srcBox.object as FaustOp).resultID}_${line.srcOutlet}`);
        mapLines(srcBox, patcher, visitedBoxes, ins, recs, lineMap);
    }));
};
export const toFaustLambda = (patcher: Patcher, outs: FaustOp[], lambdaName: string) => {
    const exprs: string[] = [];
    const onces: string[] = [];
    const mainIns: string[] = [];
    const mainOuts: string[] = [];
    const recIns: string[] = [];
    const recOuts: string[] = [];
    const visitedBoxes: Box[] = [];
    let ins: In[] = [];
    const recs: Rec[] = [];
    const lineMap: TLineMap = new Map<Line, string>();
    // Build graph
    outs.forEach(out => mapLines(out.box, patcher, visitedBoxes, ins, recs, lineMap));
    visitedBoxes.forEach((box) => {
        if (box.object instanceof In) return;
        if (box.object instanceof Out) return;
        if (box.object instanceof Rec) return;
        if (outs.indexOf(box.object as FaustOp) !== -1) return;
        const { onces: o, exprs: e } = (box.object as FaustOp).toExpr(lineMap);
        if (o) onces.push(...o.filter(v => onces.indexOf(v) === -1));
        if (e) exprs.push(...e);
    });
    // Reverse order for readibility
    exprs.reverse();
    // Build rec in/outs
    recs.forEach((rec) => {
        exprs.push(...rec.toExpr(lineMap).exprs || []);
        const recIn = rec.resultID;
        const recOut = `${recIn}_0`;
        recIns.push(recIn);
        recOuts.push(recOut);
    });
    // Build main in/outs
    ins = ins.sort((a, b) => a.index - b.index);
    ins.forEach((in_) => {
        const id = `${in_.resultID}_0`;
        if (mainIns.indexOf(id) === -1) mainIns.push(id);
    });
    outs.forEach((out) => {
        if (out instanceof Iterator) exprs.push(...out.toNormalExpr(lineMap).exprs || []);
        else exprs.push(...out.toExpr(lineMap).exprs || []);
        const id = out.resultID;
        if (mainIns.indexOf(id) === -1) mainOuts.push(id);
    });
    // Generate Final expressions
    exprs.forEach((s, i) => exprs[i] = `    ${s.replace(/\n/g, "\n    ")}`); // indent
    if (recIns.length) {
        exprs.unshift(`Main(${[...recOuts, ...mainIns].join(", ")}) = ${[...recIns, ...mainOuts].join(", ")} with {`);
        exprs.push(
            "};",
            `Rec = ${recIns.map(() => "_").join(", ")} : ${recOuts.map(() => "_").join(", ")};`,
            `${lambdaName} = Main ~ Rec : ${[...recIns.map(() => "!"), ...mainOuts.map(() => "_")].join(", ")};`
        );
    } else if (mainIns.length) {
        exprs.unshift(`${lambdaName}(${mainIns.join(", ")}) = ${mainOuts.join(", ")} with {`);
        exprs.push("};");
    } else if (exprs.length) {
        exprs.unshift(`${lambdaName} = ${mainOuts.join(", ")} with {`);
        exprs.push("};");
    } else {
        exprs.push(`${lambdaName} = 0;`);
    }
    return { onces, exprs, ins, outs };
};
export const toFaustDspCode = (patcher: Patcher) => inspectFaustPatcher(patcher).code;
export const inspectFaustPatcher = (patcher: Patcher) => {
    const imports: Import[] = [];
    let outs: Out[] = [];
    const effects: Effect[] = [];
    // Find outs and imports
    for (const boxID in patcher.boxes) {
        const box = patcher.boxes[boxID];
        if (box.object instanceof Effect) effects.push(box.object);
        else if (box.object instanceof Out) outs.push(box.object);
        else if (box.object instanceof Import) imports.push(box.object);
    }
    outs = outs.sort((a, b) => a.index - b.index);
    const { onces, exprs, ins } = toFaustLambda(patcher, outs, "process");
    if (effects.length) {
        const { onces: fxOnces, exprs: fxExprs, ins: fxIns } = toFaustLambda(patcher, [effects[0]], "effect");
        onces.push(...fxOnces.filter(v => onces.indexOf(v) === -1));
        exprs.push(...fxExprs);
        ins.push(...fxIns);
    }
    imports.map(i => i.toOnceExpr()).forEach(o => onces.push(...o.filter(v => onces.indexOf(v) === -1)));
    const code = `${onces.join("\n")}${onces.length ? "\n" : ""}${exprs.join("\n")}\n`;
    return { code, onces, exprs, ins, outs };
};
export default faustOps;
