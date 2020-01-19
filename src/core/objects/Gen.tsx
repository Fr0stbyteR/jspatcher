import { DefaultObject, EmptyObject, InvalidObject } from "./Base";
import { comment } from "./UI";
import "./Gen.scss";

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
export class GenOp extends DefaultObject {
    static package = "Gen";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Gen Operator";
}
const GenOps: { [key: string]: typeof GenOp | typeof comment | typeof EmptyObject | typeof InvalidObject } = { comment, EmptyObject, InvalidObject };
for (const key in genOperators) {
    genOperators[key].forEach((name) => {
        GenOps[name] = class extends GenOp {
            static description = "Gen Operator " + name;
        };
    });
}
export default GenOps;
