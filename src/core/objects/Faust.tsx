import { DefaultObject } from "./Base";
import Patcher from "../Patcher";
import Box from "../Box";
import Line from "../Line";
import { TPackage, TMeta, TPropsMeta } from "../types";
import { subPatchersMap, TSubPatchersMap, SubPatcherUI } from "./SubPatcher";
import { TFaustDocs } from "../../misc/monaco-faust/Faust2Doc";
import { CodeUI, comment } from "./UI";
import { ImporterDirSelfObject } from "../../utils/symbols";

type TObjectExpr = {
    exprs?: string[];
    onces?: string[];
};
type TLineMap = Map<Line, string>;

const findOutletFromLineMap = (lineMap: TLineMap, linesIn: Set<Line>) => {
    const lines = Array.from(linesIn);
    for (let i = 0; i < lines.length; i++) {
        const outlet = lineMap.get(lines[i]);
        if (outlet) return outlet;
    }
    return undefined;
};
interface FaustOpState {
    inlets: number;
    outlets: number;
}
export class FaustOp<D extends { [key: string]: any } = {}, S extends Partial<FaustOpState> & { [key: string]: any } = FaustOpState, A extends any[] = (number | "_")[], P extends { [key: string]: any } = {}, U extends { [key: string]: any } = {}, E extends { [key: string]: any } = {}> extends DefaultObject<D, S & FaustOpState, [], [], A, P, U, E> {
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
     * Symbol used to register class
     *
     * @type {string[]}
     * @memberof FaustOp
     */
    symbol: string[] = [];
    /**
     * Apply args and inlets from end.
     *
     * @memberof FaustOp
     */
    reverseApply = false;
    state = { inlets: 1, outlets: 1 } as S & FaustOpState;
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
    handleUpdate = (e: { args?: any[]; props?: { [key: string]: any } }) => {
        if (!e.args) return;
        this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
        this.outlets = this.state.outlets;
    }
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
        const incoming = inletLines.map((set) => {
            const lines = Array.from(set);
            if (lines.length === 0) return "0";
            if (lines.length === 1) return lineMap.get(lines[0]) || "0";
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
class EmptyObject extends FaustOp<{}, { editing: boolean }> {
    static description = "No-op";
    state = { inlets: 0, outlets: 0, editing: false };
    toExpr(): TObjectExpr {
        return {};
    }
}
class InvalidObject extends FaustOp {
    static description = "No-op";
    static props: TMeta["props"] = {
        bgColor: {
            type: "color",
            default: "rgb(128, 64, 64)",
            description: "Background color",
            isUIState: true
        }
    };
    state = { inlets: 0, outlets: 0 };
    toExpr(): TObjectExpr {
        return {};
    }
}
class Param extends FaustOp<{}, {}, [string, number, number, number, number]> {
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
    symbol = ["hslider"];
    state = { inlets: 0, outlets: 1 };
    toInletsExpr(lineMap: TLineMap) {
        const { box, resultID } = this;
        const args = box.args.slice(0, 5);
        args[0] = args[0] ? `"${args[0]}"` : `"${resultID}"`;
        args[1] = args[1] || 0;
        args[2] = args[2] || 0;
        args[3] = args[3] || 1;
        args[4] = args[4] || 0.01;
        return args.join(", ");
    }
}
class HSlider extends Param {}
class VSlider extends Param {
    symbol = ["vslider"];
}
class Nentry extends Param {
    symbol = ["nentry"];
}
class Checkbox extends Param {
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Parameter name / descriptor"
    }];
    symbol = ["checkbox"];
    toInletsExpr(lineMap: TLineMap) {
        const { box, resultID } = this;
        const { args } = box;
        return args[0] ? `"${args[0]}"` : `"${resultID}"`;
    }
}
class Button extends Checkbox {
    symbol = ["button"];
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
    symbol = ["hbargraph"];
    state = { inlets: 1, outlets: 1 };
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
    symbol = ["vbargraph"];
}
class HGroup extends FaustOp<{}, {}, [string]> {
    static description = "UI group";
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "UI name / descriptor"
    }];
    symbol = ["hgroup"];
    state = { inlets: 1, outlets: 1 };
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
    symbol = ["vgroup"];
}
class TGroup extends HGroup {
    symbol = ["tgroup"];
}

class In extends FaustOp {
    static description = "Signal Input";
    static args: TMeta["args"] = [{
        type: "number",
        optional: false,
        description: "Signal index (0-based)"
    }];
    symbol = ["in"];
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
    toMainExpr(out: string, inlets: string) {
        return `${out} = _;`;
    }
}
class Out extends FaustOp {
    static description = "Signal Output";
    static args: TMeta["args"] = [{
        type: "number",
        optional: false,
        description: "Signal index (0-based)"
    }];
    symbol = ["out"];
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
    toExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const inlets = this.inletLines.map((set) => {
            const lines = Array.from(set);
            if (lines.length === 0) return "0";
            if (lines.length === 1) return lineMap.get(lines[0]) || "0";
            return `(${lines.map(line => lineMap.get(line)).filter(line => line !== undefined).join(", ")} :> _)`;
        });

        exprs.push(`${this.resultID} = ${inlets};`);
        return { exprs };
    }
}
class Pass extends FaustOp {
    static description = "Bypass Signal";
    symbol = ["_"];
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
type TSendMap = { [key: string]: Send[] };
const sendMap: TSendMap = {};
class Send extends FaustOp<{}, { sendMap: TSendMap }> {
    static description = "Send Signal to receive";
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Send / Receive ID"
    }];
    symbol = ["s"];
    state = { inlets: 1, outlets: 0, sendMap };
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
    }
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
class Receive extends FaustOp<{}, { sendMap: TSendMap }> {
    static description = "Receive Signal from send";
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Send / Receive ID"
    }];
    symbol = ["r"];
    state = { inlets: 0, outlets: 1, sendMap };
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
    symbol = ["<:"];
    state = { inlets: 1, outlets: 2 };
    toMainExpr(out: string, inlets: string) {
        return `${out} = ${inlets} ${this.symbol[0]} ${new Array(this.outlets).fill("_").join(", ")};`;
    }
}
class Merge extends FaustOp {
    static description = "Merge Signal";
    symbol = [":>"];
    state = { inlets: 2, outlets: 1 };
    toMainExpr(out: string, inlets: string) {
        return `${out} = ${inlets} ${this.symbol[0]} _;`;
    }
}
class Rec extends FaustOp {
    static description = "Recursion with 1-sample delay";
    symbol = ["~"];
    state = { inlets: 1, outlets: 1 };
    toExpr(lineMap: TLineMap): TObjectExpr {
        const exprs: string[] = [];
        const inlets = this.toInletsExpr(lineMap);

        exprs.push(`${this.resultID} = ${inlets};`);
        return { exprs };
    }
}
class Mem extends FaustOp {
    static description = "1-sample delay";
    symbol = ["mem", "'"];
    state = { inlets: 1, outlets: 1 };
}
class Const extends FaustOp {
    static description = "Output a constant";
    static args: TMeta["args"] = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Constant value"
    }];
    symbol = ["const", "c"];
    state = { inlets: 1, outlets: 1 };
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
    }
    state = { inlets: 1, outlets: 1 };
    symbol = ["()"];
    handleUpdate = (e?: { args?: any[]; props?: LibOpProps }) => {
        if ("ins" in e.props) this.state.inlets = ~~+this.getProp("ins");
        if (e.args.length || "ins" in e.props) {
            this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
            this.outlets = this.state.outlets;
        }
    }
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
    symbol = ["waveform"];
    state = { inlets: 0, outlets: 2 };
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
    symbol = ["ma.SR"];
    state = { inlets: 0, outlets: 1 };
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
    state = { inlets: 1, outlets: 2 };
    subscribe() {
        super.subscribe();
        this.off("update", this.handleUpdate);
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
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
    symbol = ["sum"];
}
class Prod extends Iterator {
    static description = "Production iterator";
    symbol = ["prod"];
}
class Seq extends Iterator {
    static description = "Seqential iterator";
    symbol = ["seq"];
}
class Par extends Iterator {
    static description = "Parallel iterator";
    _meta = Par.meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
    }
    symbol = ["par"];
    handleUpdate = (e: { args?: any[] }) => {
        if (!e.args) return;
        const { args } = this.box;
        this.inlets = 1;
        const outlets = (args ? ~~args[0] : 0) + 1;
        if (outlets === this.outlets) return;
        const outlet0Meta = Par.outlets[0];
        const outlet1Meta = Par.outlets[1];
        for (let i = 0; i < outlets - 1; i++) {
            this._meta.outlets[i] = outlet0Meta;
        }
        this._meta.outlets[outlets - 1] = outlet1Meta;
        this.meta = this._meta;
        this.outlets = outlets;
    }
    subscribe() {
        super.subscribe();
        this.on("update", this.handleUpdate);
    }
}
interface LibOpProps {
    ins: number;
    outs: number;
}
class LibOp extends FaustOp<{}, {}, (number | "_")[], LibOpProps> {
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
    }
    state = { inlets: undefined as number, outlets: undefined as number };
    handlePostInit = async () => {
        const inletsForced = typeof this.state.inlets === "number";
        const outletsForced = typeof this.state.outlets === "number";
        if (inletsForced && outletsForced) return;
        const { args } = this.box;
        const inspectCode = `import("stdfaust.lib"); process = ${this.symbol[0]}${args.length ? `(${args.map(_ => (_ === "_" ? 0 : _)).join(", ")})` : ""};`;
        try {
            const { dspMeta } = await this.patcher.env.faust.inspect(inspectCode, { args: { "-I": "libraries/" } });
            if (!inletsForced) this.state.inlets = ~~dspMeta.inputs + args.length;
            if (!outletsForced) this.state.outlets = ~~dspMeta.outputs;
        } catch (e) {
            if (!inletsForced) this.state.inlets = 0;
            if (!outletsForced) this.state.outlets = 0;
        }
        if (!inletsForced) this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
        if (!outletsForced) this.outlets = this.state.outlets;
        this.patcher.emit("graphChanged");
    }
    handleUpdate = (e?: { args?: any[]; props?: LibOpProps }) => {
        if ("ins" in e.props) this.state.inlets = ~~+this.getProp("ins");
        if ("outs" in e.props) this.state.outlets = ~~+this.getProp("outs");
        if (e.args.length || "ins" in e.props || "outs" in e.props) {
            if (typeof this.state.inlets === "number") this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
            if (typeof this.state.outlets === "number") this.outlets = this.state.outlets;
        }
    }
    subscribe() {
        super.subscribe();
        this.on("postInit", this.handlePostInit);
    }
    toOnceExpr(): string[] {
        return ['import("stdfaust.lib");'];
    }
}
interface SubPatcherState extends FaustOpState {
    map: TSubPatchersMap;
    key: string;
    cachedCode: { exprs: string[]; onces: string[]; ins: number; outs: number };
}
class SubPatcher extends FaustOp<Patcher, SubPatcherState, [string], {}, { patcher: Patcher }> {
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
    state: SubPatcherState = { inlets: 0, outlets: 0, map: subPatchersMap, key: "", cachedCode: { exprs: ["process = 0"], onces: [], ins: 0, outs: 0 } };
    subscribePatcher = () => {
        const patcher = this.data;
        patcher.on("graphChanged", this.handleGraphChanged);
    };
    unsubscribePatcher = () => {
        const patcher = this.data;
        if (!(patcher instanceof Patcher)) return;
        patcher.off("graphChanged", this.handleGraphChanged);
    };
    handlePatcherReset = () => {
        const patcher = this.data;
        if (!(patcher instanceof Patcher)) return;
        this.updateUI({ patcher });
    };
    handleGraphChanged = () => {
        const { ins, outs, exprs, onces } = inspectFaustPatcher(this.data);
        this.inlets = ins.length;
        this.outlets = outs.length;
        this.state.cachedCode = { exprs, onces, ins: ins.length, outs: outs.length };
        this.patcher.emit("graphChanged");
    };
    handlePreInit = async () => {
        if (this.data.boxes) {
            const patcher = new Patcher(this.patcher.env);
            await patcher.load(this.data);
            this.data = patcher;
        }
    };
    handlePostInit = async () => {
        if (!(this.data instanceof Patcher)) {
            const patcher = new Patcher(this.patcher.env);
            this.data = patcher;
            await patcher.load({}, "faust");
        }
        this.handlePatcherReset();
        this.subscribePatcher();
        this.handleGraphChanged();
    };
    handleUpdate = ({ args }: { args?: any[] }) => {
        if (args && typeof args[0] === "string") {
            const newKey = args[0] || "";
            if (newKey !== this.state.key) {
                this.unsubscribePatcher();
                if (!this.state.map[newKey]) {
                    const patcher = new Patcher(this.patcher.env);
                    patcher.load({}, "faust");
                    if (newKey) this.state.map[newKey] = patcher;
                    this.data = patcher;
                } else {
                    this.data = this.state.map[newKey];
                }
                this.handlePatcherReset();
                this.handleGraphChanged();
                this.subscribePatcher();
                this.state.key = newKey;
            }
        }
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
        this.on("postInit", this.handlePostInit);
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
    }
    static ui = CodeUI as any;
    state = { inlets: undefined as number, outlets: undefined as number };
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
        if (!inletsForced) this.inlets = this.state.inlets - Math.min(this.state.inlets, this.constArgsCount);
        if (!outletsForced) this.outlets = this.state.outlets;
        this.patcher.emit("graphChanged");
    }
    handleUpdate = (e?: { args?: any[]; props?: LibOpProps }) => {
        if ("ins" in e.props) this.state.inlets = ~~+this.getProp("ins");
        if ("outs" in e.props) this.state.outlets = ~~+this.getProp("outs");
        if (e.args.length || "ins" in e.props || "outs" in e.props) {
            this.inlets = ~~this.state.inlets - Math.min(~~this.state.inlets, this.constArgsCount);
            this.outlets = ~~this.state.outlets;
        }
    }
    handleBlur = () => {
        this.patcher.emit("graphChanged");
        this.handlePostInit();
    }
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
    in: In,
    out: Out,
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
    code: Code,
    comment,
    EmptyObject,
    InvalidObject
};

type TOpMap = { [category: string]: {[className: string]: { desc: string; symbol: string | string[]; inlets: number; applyArgsFromStart?: boolean }} };
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
        symbol = typeof symbol === "string" ? [symbol] : symbol;
        state = { inlets, outlets: 1 };
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
            symbol = [key];
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
        lineMap.set(line, `${(srcBox.object as FaustOp).resultID}_${line.srcOutlet}`);
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
        mainIns.push(`${in_.resultID}_0`);
    });
    outs.forEach((out) => {
        if (out instanceof Iterator) exprs.push(...out.toNormalExpr(lineMap).exprs || []);
        else exprs.push(...out.toExpr(lineMap).exprs || []);
        mainOuts.push(out.resultID);
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
    let outs: Out[] = [];
    // Find outs
    for (const boxID in patcher.boxes) {
        const box = patcher.boxes[boxID];
        if (box.object instanceof Out) outs.push(box.object);
    }
    outs = outs.sort((a, b) => a.index - b.index);
    const { onces, exprs, ins } = toFaustLambda(patcher, outs, "process");
    const code = `${onces.join("\n")}${onces.length ? "\n" : ""}${exprs.join("\n")}\n`;
    return { code, onces, exprs, ins, outs };
};
export default faustOps;
