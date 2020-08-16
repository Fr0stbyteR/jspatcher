import comment from "./UI/comment";
import { LibOp, EmptyObject, InvalidObject, Const, In, Out, Send, Receive, SubPatcher, Param } from "./Faust";
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
    gen: Gen,
    constant: Const,
    Param,
    param: Param
};
type TOpMap = { [category: string]: {[className: string]: { desc: string; symbol: string | string[]; inlets: number; outlets?: number; defaultArgs?: (number | string)[]; applyArgsFromStart?: boolean }} };
const opMap: TOpMap = {
    common: {
        // Comparison
        Neqp: { symbol: ["!=p", "neqp"], inlets: 2, desc: "Returns in1 if it does not equal in2, else returns zero. Equivalent to in1*(in1 != in2)." },
        Eq: { symbol: ["==", "eq"], inlets: 2, desc: "Returns 1 if in1 equals in2, else returns zero." },
        Eqp: { symbol: ["==p", "eqp"], inlets: 2, desc: "Returns in1 if it equals in2, else returns zero. Equivalent to in1*(in1 == in2)." },
        Gt: { symbol: [">", "gt"], inlets: 2, desc: "Returns 1 if in1 is greater than in2, else returns zero." },
        Gtp: { symbol: [">p", "gtp"], inlets: 2, desc: "Returns in1 if in1 is greater than in2, else returns zero. Equivalent to in1*(in1 > in2)." },
        Gtr: { symbol: [">=", "gte"], inlets: 2, desc: "Returns 1 if in1 is equal to or greater than in2, else returns zero." },
        Gtep: { symbol: [">=p", "gtep"], inlets: 2, desc: "Returns in1 if in1 is equal to or greater than in2, else returns zero. Equivalent to in1*(in1 >= in2)." },
        Lt: { symbol: ["<", "lt"], inlets: 2, desc: "Returns 1 if in1 is less than than in2, else returns zero." },
        Ltp: { symbol: ["<p", "ltp"], inlets: 2, desc: "Returns in1 if in1 is less than in2, else returns zero. Equivalent to in1*(in1 < in2)." },
        Lte: { symbol: ["<=", "lte"], inlets: 2, desc: "Returns 1 if in1 is equal to or less than in2, else returns zero." },
        Ltep: { symbol: ["<=p", "ltep"], inlets: 2, desc: "Returns in1 if in1 is equal to or less than in2, else returns zero. Equivalent to in1*(in1 <= in2)." },
        Max: { symbol: ["max", "maximum"], inlets: 2, desc: "The maximum of the inputs" },
        Min: { symbol: ["min", "minimum"], inlets: 2, desc: "The minimum of the inputs" },
        Neq: { symbol: ["!=", "neq"], inlets: 2, desc: "Returns 1 if in1 does not equal in2, else returns zero." },
        Step: { symbol: ["step"], inlets: 2, desc: "Akin to the GLSL step operator: 0 is returned if in1 < in2, and 1 is returned otherwise." },
        // Constant
        F: { symbol: ["f", "float"], inlets: 1, desc: "Either outputs a constant float or converts its input value to a float" },
        i: { symbol: ["i", "int"], inlets: 1, desc: "Either outputs a constant integer or converts its input value to an integer." },
        Degtorad: { symbol: ["degtorad", "DEGTORAD"], inlets: 0, desc: "A constant value" },
        E: { symbol: ["e", "E"], inlets: 0, desc: "A constant value" },
        Halfpi: { symbol: ["halfpi", "HALFPI"], inlets: 0, desc: "A constant value" },
        Invpi: { symbol: ["invpi", "INVPI"], inlets: 0, desc: "A constant value" },
        Ln10: { symbol: ["ln10", "LN10"], inlets: 0, desc: "A constant value" },
        Ln2: { symbol: ["ln2", "LN2"], inlets: 0, desc: "A constant value" },
        Log10e: { symbol: ["log10e", "LOG10E"], inlets: 0, desc: "A constant value" },
        Log2e: { symbol: ["log2e", "LOG2E"], inlets: 0, desc: "A constant value" },
        PHI: { symbol: ["PHI", "phi"], inlets: 0, desc: "A constant value" },
        PI: { symbol: ["pi", "PI"], inlets: 0, desc: "A constant value" },
        Radtodeg: { symbol: ["radtodeg", "RADTODEG"], inlets: 0, desc: "A constant value" },
        Sqrt1_2: { symbol: ["sqrt1_2", "SQRT1_2"], inlets: 0, desc: "A constant value" }, // eslint-disable-line @typescript-eslint/camelcase
        Sqrt2: { symbol: ["sqrt2", "SQRT2"], inlets: 0, desc: "A constant value" },
        Twopi: { symbol: ["twopi", "TWOPI"], inlets: 0, desc: "A constant value" },

        // TODO expr

        // Ignore
        Pass: { symbol: ["pass"], inlets: 1, desc: "Passes the value through unchanged." },
        // Logic
        Not: { symbol: ["!", "not"], inlets: 1, desc: "An input value of zero returns 1, any other value returns zero." },
        And: { symbol: ["&&", "and"], inlets: 2, desc: "Returns 1 if both in1 and in2 are nonzero." },
        Bool: { symbol: ["bool"], inlets: 1, desc: "Converts any nonzero value to 1 while zero passes through." },
        Or: { symbol: ["or", "||"], inlets: 2, desc: "Returns 1 if either in1 or in2 are nonzero." },
        Xor: { symbol: ["^^", "xor"], inlets: 2, desc: "Returns 1 if one of in1 and in2 are nonzero, but not both." },
        // Math
        Neg: { symbol: ["neg"], inlets: 1, desc: "Negate input" },
        Add: { symbol: ["+", "add"], inlets: 2, desc: "Add inputs" },
        Sub: { symbol: ["-", "sub"], inlets: 2, desc: "Subtract inputs" },
        Rsub: { symbol: ["!-", "rsub"], inlets: 2, desc: "Reverse subtraction (subtract first input from second)" },
        Mul: { symbol: ["*", "mul"], inlets: 2, defaultArgs: [1, 1], desc: "Multiply inputs" },
        Div: { symbol: ["/", "div"], inlets: 2, defaultArgs: [1, 1], desc: "Divide inputs" },
        Rdiv: { symbol: ["!/", "rdiv"], inlets: 2, desc: "Reverse division (divide second input by first)" },
        Mod: { symbol: ["%", "mod"], inlets: 2, desc: "Modulo inputs (remainder of first input / second input)" },
        Rmod: { symbol: ["!%", "rmod"], inlets: 2, desc: "Reverse modulo (remainder of second input / first input)" },
        Absdiff: { symbol: ["absdiff"], inlets: 2, desc: "Compute the absolute difference between two inputs using the equation abs(in1-in2)." },
        Cartopol: { symbol: ["cartopol"], inlets: 2, outlets: 2, desc: "Convert Cartesian values to polar format. Angles are in radians." },
        Poltocar: { symbol: ["poltocar"], inlets: 2, outlets: 2, desc: "Convert polar values to Cartesian format. Angles are in radians." },
        // Numeric
        Abs: { symbol: ["abs"], inlets: 1, desc: "Negative values will be converted to positive counterparts." },
        Ceil: { symbol: ["ceil"], inlets: 1, desc: "Round the value up to the next higher integer" },
        Floor: { symbol: ["floor"], inlets: 1, desc: "Round the value down to the next lower integer (toward negative infinity)" },
        Fract: { symbol: ["fract"], inlets: 1, desc: "Return only the fractional component" },
        Sign: { symbol: ["sign"], inlets: 1, desc: "Positive input returns 1, negative input returns -1, zero returns itself." },
        Trunc: { symbol: ["trunc"], inlets: 1, desc: "Round the value down to the next smaller integer (toward zero)" },
        // Powers
        Exp: { symbol: ["exp"], inlets: 1, desc: "Raise the mathematical value e to a power" },
        Exp2: { symbol: ["exp2"], inlets: 1, desc: "Raise 2 to a power" },
        Fastexp: { symbol: ["fastexp"], inlets: 1, desc: "Approximated e to a power" },
        Fastpow: { symbol: ["fastpow"], inlets: 2, desc: "Approximated in1 to the power of in2" },
        Log: { symbol: ["ln", "log"], inlets: 1, desc: "The natural logarithm" },
        Log10: { symbol: ["log10"], inlets: 1, desc: "The logarithm base 10 of the input" },
        Log2: { symbol: ["log2"], inlets: 1, desc: "The logarithm base 2 of the input" },
        Pow: { symbol: ["pow"], inlets: 2, desc: "Raise in1 to the power of in2" },
        Sqrt: { symbol: ["sqrt"], inlets: 1, desc: "The square root of the input" },
        // Range
        Clip: { symbol: ["clamp", "clip"], inlets: 3, defaultArgs: [0, 0, 1], desc: "Clamps the input value between specified min and max. Ranges are inclusive (both min and max values may be output)" },
        Fold: { symbol: ["fold"], inlets: 3, defaultArgs: [0, 0, 1], desc: "Low and high values can be specified by arguments or by inlets. The default range is 0..1." },
        Scale: { symbol: ["scale"], inlets: 6, defaultArgs: [0, 0, 1, 0, 1, 1], desc: "Similar to the Max scale and MSP scale~ objects. Inputs are: 1) value to scale, 2) input lower bound, 3), input upper bound, 4) output lower bound, 5) output upper bound, 6) exponential curve. Default lower and upper bounds are zero and one; default exponential curve is 1 (linear). No bound clamping is performed. The high and low values can be reversed for inverted mapping." },
        Wrap: { symbol: ["wrap"], inlets: 3, defaultArgs: [0, 0, 1], desc: "Low and high values can be specified by arguments or by inlets. The default range is 0..1." },
        // Route
        Switch: { symbol: ["?", "switch"], inlets: 3, desc: "Selects between the second and third inputs according to the boolean value of the first. If the first argument is true, the second argument will be output. Otherwise, the third argument will be output." },
        // gate: { symbol: ["gate"], inlets: 0, desc: "Similar to the MSP gate~ object. It takes an argument for number of outputs (one is the default) and lets you choose which the incoming signal (at the right inlet) is sent to according to the (integer) value in the left inlet. A value of zero or less to the left inlet will choose no output; a value greater than the number of outlets will select the last outlet. Like gate~, un-selected outlets will send zero." },
        Mix: { symbol: ["mix"], inlets: 3, defaultArgs: [0, 1, 0.5], desc: "Mixes (interpolates) between inputs a and b according to the value of the third input t, using linear interpolation. The factor (t) should vary between 0 (for a) and 1 (for b). If one argument is given, it specifies the mix (interpolation) factor." },
        // selector: { symbol: ["selector"], inlets: 0, desc: "Similar to the MSP selector~ object. In a Gen patcher it takes an argument for number of choices (one is the default). In GenExpr, the number of choices is determined by the number of arguments. The first input lets you choose which of the remaining inputs is sent to the output. A value of zero or less to the first input will result in a zero signal at the output; a value greater than the number of choices will select the last input." },
        Smoothstep: { symbol: ["smoothstep"], inlets: 3, defaultArgs: [0, 1, 0.5], desc: "Smoothstep is a scalar interpolation function commonly used in computer graphics. The function interpolates smoothly between two input values based on a third one that should be between the first two. The returned value is clamped between 0 and 1. The slope (i.e. derivative) of the smoothstep function starts at 0 and ends at 0." },
        // Trigonometry
        Acos: { symbol: ["acos"], inlets: 1, desc: "The arc cosine of the input (returns radians)" },
        Acosh: { symbol: ["acosh"], inlets: 1, desc: "The inverse hyperbolic cosine of the input" },
        Asin: { symbol: ["asin"], inlets: 1, desc: "The arc sine of the input (returns radians)" },
        Asinh: { symbol: ["asinh"], inlets: 1, desc: "The inverse hyperbolic sine of the input" },
        Atan: { symbol: ["atan"], inlets: 1, desc: "The arc tangent of the input (returns radians)" },
        Atan2: { symbol: ["atan2"], inlets: 1, desc: "Returns the angle to the coordinate (x,y) in radians." },
        Atanh: { symbol: ["atanh"], inlets: 1, desc: "The inverse hyperbolic tangent of the input" },
        Cos: { symbol: ["cos"], inlets: 1, desc: "The cosine of the input (in radians)" },
        Cosh: { symbol: ["cosh"], inlets: 1, desc: "The hyperbolic cosine of the input" },
        Degrees: { symbol: ["degrees"], inlets: 1, desc: "convert radians to degrees" },
        Fastcos: { symbol: ["fastcos"], inlets: 1, desc: "The approximated cosine of the input (in radians)" },
        Fastsin: { symbol: ["fastsin"], inlets: 1, desc: "The approximated sine of the input (in radians)" },
        Fasttan: { symbol: ["fasttan"], inlets: 1, desc: "The approximated tangent of the input (in radians)" },
        Hypot: { symbol: ["hypot"], inlets: 2, desc: "Returns the length of the vector to (in1, in2)." },
        Radians: { symbol: ["radians"], inlets: 1, desc: "convert degrees to radians" },
        Sin: { symbol: ["sin"], inlets: 1, desc: "The sine of the input (in radians)" },
        Sinh: { symbol: ["sinh"], inlets: 1, desc: "The hyperbolic sine of the input" },
        Tan: { symbol: ["tan"], inlets: 1, desc: "The tangent of the input (in radians)" },
        Tanh: { symbol: ["tanh"], inlets: 1, desc: "The hyperbolic tangent of the input" },
        // Waveform
        Noise: { symbol: ["noise"], inlets: 0, desc: "A random number generator" }
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
