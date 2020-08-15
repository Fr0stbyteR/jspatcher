import comment from "./UI/comment";
import { LibOp, EmptyObject, InvalidObject, In, Out, Send, Receive, SubPatcher } from "./Faust";
import { TPackage } from "../types";
import "./Gen.scss";

export class GenLibOp extends LibOp {
    static package = "Gen";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Gen Operator";
    toOnceExpr(): string[] {
        return ['import("gen2faust.lib");'];
    }
}
export class Gen extends SubPatcher {
    type = "gen" as const;
}
const genOps: TPackage = {
    in: In,
    out: Out,
    send: Send,
    receive: Receive,
    gen: Gen
};
type TOpMap = { [category: string]: {[className: string]: { desc: string; symbol: string | string[]; inlets: number; applyArgsFromStart?: boolean }} };
const opMap: TOpMap = {
    common: {
        Neqp: { symbol: ["!=p", "neqp"], inlets: 2, desc: "Returns in1 if it does not equal in2, else returns zero. Equivalent to in1*(in1 != in2)." },
        Gt: { symbol: [">, gt"], inlets: 2, desc: "Returns 1 if in1 is greater than in2, else returns zero." },
        Eq: { symbol: ["==, eq"], inlets: 2, desc: "Returns 1 if in1 equals in2, else returns zero." },
        Eqp: { symbol: ["==p, eqp"], inlets: 2, desc: "Returns in1 if it equals in2, else returns zero. Equivalent to in1*(in1 == in2)." },
        Gtr: { symbol: [">=, gte"], inlets: 2, desc: "Returns 1 if in1 is equal to or greater than in2, else returns zero." },
        Gtep: { symbol: [">=p, gtep"], inlets: 2, desc: "Returns in1 if in1 is equal to or greater than in2, else returns zero. Equivalent to in1*(in1 >= in2)." },
        Gtp: { symbol: [">p, gtp"], inlets: 2, desc: "Returns in1 if in1 is greater than in2, else returns zero. Equivalent to in1*(in1 > in2)." },
        Lt: { symbol: ["<, lt"], inlets: 2, desc: "Returns 1 if in1 is less than than in2, else returns zero." },
        Lte: { symbol: ["<=, lte"], inlets: 2, desc: "Returns 1 if in1 is equal to or less than in2, else returns zero." },
        Ltep: { symbol: ["<=p, ltep"], inlets: 2, desc: "Returns in1 if in1 is equal to or less than in2, else returns zero. Equivalent to in1*(in1 <= in2)." },
        Ltp: { symbol: ["<p, ltp"], inlets: 2, desc: "Returns in1 if in1 is less than in2, else returns zero. Equivalent to in1*(in1 < in2)." },
        Max: { symbol: ["max, maximum"], inlets: 2, desc: "The maximum of the inputs" },
        Min: { symbol: ["min, minimum"], inlets: 2, desc: "The minimum of the inputs" },
        Neq: { symbol: ["!=, neq"], inlets: 2, desc: "Returns 1 if in1 does not equal in2, else returns zero." },
        Step: { symbol: ["step"], inlets: 2, desc: "Akin to the GLSL step operator: 0 is returned if in1 < in2, and 1 is returned otherwise." }
    }
};
const genOperators: { [key: string]: string[] } = {
    common: [
        "!=p", "neqp", "==", "eq", "==p", "eqp",
        ">", "gt", ">=", "gte", ">=p", "gtep", ">p", "gtp",
        "<", "lt", "<=", "lte", "<=p", "ltep", "<p", "ltp",
        "max", "maximum", "min", "minimum", "!=", "neq", "step",
        "constant", "degtorad", "DEGTORAD", "e", "E", "f", "float",
        "halfpi", "HALFPI", "i", "int", "invpi", "INVPI",
        "ln10", "LN10", "ln2", "LN2", "log10e", "LOG10E",
        "log2e", "LOG2E", "PHI", "phi", "pi", "PI",
        "radtodeg", "RADTODEG", "sqrt1_2", "SQRT1_2", "sqrt2", "SQRT2", "twopi", "TWOPI",
        "param", "Param", "expr", "pass", "in", "out",
        "!", "not", "&&", "and", "bool", "or", "||", "^^", "xor",
        "!%", "rmod", "!-", "rsub", "%", "mod", "+", "add", "-", "sub", "/", "div",
        "absdiff", "cartopol", "*", "mul", "neg", "poltocar", "!/", "rdiv",
        "abs", "ceil", "floor", "trunc", "fract", "sign", "trunc",
        "exp", "exp2", "fastexp", "fastpow", "ln", "log", "log10", "log2", "pow", "sqrt",
        "clamp", "clip", "fold", "scale", "wrap",
        "?", "switch", "gate", "mix", "r", "receive", "s", "send", "selector", "smoothstep",
        "gen", "setparam",
        "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh", "cos", "cosh",
        "degrees", "fastcos", "fastsin", "fasttan", "hypot", "radians", "sin", "sinh", "tan", "tanh",
        "noise"
    ],
    dsp: [
        "buffer", "channels", "cycle", "data", "dim", "lookup", "nearest", "peek", "poke", "sample", "splat", "wave",
        "atodb", "dbtoa", "ftom", "mstosamps", "mtof", "sampstoms",
        "fftfullspect", "FFTFULLSPECT", "ffthop", "FFTHOP", "fftoffset", "FFTOFFSET",
        "fftsize", "FFTSIZE", "samplerate", "SAMPLERATE", "vectorsize", "VECTORSIZE",
        "fixdenorm", "fixnan", "isdenorm", "isnan", "t60", "t60time",
        "delay", "history",
        "fftinfo",
        "change", "dcblock", "delta", "interp", "latch", "phasewrap", "sah", "slide",
        "elapsed", "voice", "*=", "mulequals", "+=", "accum", "plusequals", "counter",
        "round", "phasor", "rate", "train", "triangle"
    ],
    jitter: [
        "hsl2rgb", "rgb2hsl", "cell", "dim", "norm", "snorm", "qconj", "qmul", "qrot",
        "nearest", "nearestpix", "sample", "samplepix",
        "circle", "cone", "cylinder", "plane", "sphere", "torus",
        "concat", "cross", "dot", "faceforward", "length", "normalize", "reflect", "refract", "rotor", "swiz", "vec"
    ]
};
const GenOps: { [key: string]: typeof GenLibOp | typeof comment | typeof EmptyObject | typeof InvalidObject } = { comment, EmptyObject, InvalidObject };
for (const key in genOperators) {
    genOperators[key].forEach((name) => {
        GenOps[name] = class extends GenLibOp {
            static description = "Gen Operator " + name;
        };
    });
}
export default GenOps;
