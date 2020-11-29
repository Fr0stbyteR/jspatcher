(window["webpackJsonpJSPatcher"] = window["webpackJsonpJSPatcher"] || []).push([[10],{

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/Gen.scss":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/Gen.scss ***!
  \****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "", "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/core/objects/Gen.scss":
/*!***********************************!*\
  !*** ./src/core/objects/Gen.scss ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Gen_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js!./Gen.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/Gen.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Gen_scss__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Gen_scss__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./src/core/objects/Gen.tsx":
/*!**********************************!*\
  !*** ./src/core/objects/Gen.tsx ***!
  \**********************************/
/*! exports provided: GenLibOp, GenExpr, Cycle, Interp, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenLibOp", function() { return GenLibOp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenExpr", function() { return GenExpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cycle", function() { return Cycle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Interp", function() { return Interp; });
/* harmony import */ var _UI_comment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI/comment */ "./src/core/objects/UI/comment.tsx");
/* harmony import */ var _Faust__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Faust */ "./src/core/objects/Faust.tsx");
/* harmony import */ var _Gen_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Gen.scss */ "./src/core/objects/Gen.scss");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class GenLibOp extends _Faust__WEBPACK_IMPORTED_MODULE_1__["LibOp"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handleUpdate", e => {
      if (e.args || "ins" in e.props || "outs" in e.props) {
        this.inlets = ~~this.state.inlets - Math.min(~~this.state.inlets, this.constArgsCount);
        this.outlets = ~~this.state.outlets;
      }
    });
  }

  toOnceExpr() {
    return ['import("gen2faust.lib");'];
  }

}

_defineProperty(GenLibOp, "package", "Gen");

_defineProperty(GenLibOp, "author", "Fr0stbyteR");

_defineProperty(GenLibOp, "version", "1.0.0");

_defineProperty(GenLibOp, "description", "Gen Operator");

class GenExpr extends _Faust__WEBPACK_IMPORTED_MODULE_1__["Expr"] {
  toOnceExpr() {
    return ['import("gen2faust.lib");'];
  }

}
class Cycle extends GenLibOp {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      inlets: 1,
      outlets: 1,
      defaultArgs: [440]
    }));
  }

  get symbol() {
    return [this.getProp("index") === "freq" ? "cycle" : "cycle_phase"];
  }

}

_defineProperty(Cycle, "description", "An interpolating oscillator that reads repeatedly through one cycle of a sine wave. By default it is driven by a frequency input, but if the @index attribute is set to 'phase', it can be driven by a phase input instead.");

_defineProperty(Cycle, "props", _objectSpread(_objectSpread({}, _Faust__WEBPACK_IMPORTED_MODULE_1__["LibOp"].props), {}, {
  index: {
    type: "enum",
    enums: ["freq", "phase"],
    default: "freq",
    description: "Driver"
  }
}));

class Interp extends GenLibOp {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      inlets: 3,
      outlets: 1,
      defaultArgs: [440]
    }));

    _defineProperty(this, "handleUpdate", e => {
      if ("mode" in e.props) {
        const {
          mode
        } = e.props;
        this.state.inlets = mode === "linear" || mode === "cosine" ? 3 : mode === "cubic" || mode === "spline" ? 5 : mode === "spline6" ? 6 : 3;
        this.inlets = ~~this.state.inlets - Math.min(~~this.state.inlets, this.constArgsCount);
        this.outlets = ~~this.state.outlets;
      }
    });
  }

  get symbol() {
    return ["interp_".concat(this.getProp("mode"))];
  }

}

_defineProperty(Interp, "description", "An interpolating oscillator that reads repeatedly through one cycle of a sine wave. By default it is driven by a frequency input, but if the @index attribute is set to 'phase', it can be driven by a phase input instead.");

_defineProperty(Interp, "props", _objectSpread(_objectSpread({}, _Faust__WEBPACK_IMPORTED_MODULE_1__["LibOp"].props), {}, {
  mode: {
    type: "enum",
    enums: ["linear", "cosine", "cubic", "spline", "spline6"],
    default: "linear",
    description: "Interpolation mode"
  }
}));

const genOps = {
  comment: _UI_comment__WEBPACK_IMPORTED_MODULE_0__["default"],
  EmptyObject: _Faust__WEBPACK_IMPORTED_MODULE_1__["EmptyObject"],
  InvalidObject: _Faust__WEBPACK_IMPORTED_MODULE_1__["InvalidObject"],
  in: _Faust__WEBPACK_IMPORTED_MODULE_1__["In"],
  out: _Faust__WEBPACK_IMPORTED_MODULE_1__["Out"],
  send: _Faust__WEBPACK_IMPORTED_MODULE_1__["Send"],
  receive: _Faust__WEBPACK_IMPORTED_MODULE_1__["Receive"],
  gen: _Faust__WEBPACK_IMPORTED_MODULE_1__["Gen"],
  constant: _Faust__WEBPACK_IMPORTED_MODULE_1__["Const"],
  Param: _Faust__WEBPACK_IMPORTED_MODULE_1__["Param"],
  param: _Faust__WEBPACK_IMPORTED_MODULE_1__["Param"],
  expr: GenExpr,
  delay: _Faust__WEBPACK_IMPORTED_MODULE_1__["Rec"],
  history: _Faust__WEBPACK_IMPORTED_MODULE_1__["Rec"]
};
const opMap = {
  common: {
    // Comparison
    Neqp: {
      symbol: ["neqp", "!=p"],
      inlets: 2,
      desc: "Returns in1 if it does not equal in2, else returns zero. Equivalent to in1*(in1 != in2)."
    },
    Eq: {
      symbol: ["eq", "=="],
      inlets: 2,
      desc: "Returns 1 if in1 equals in2, else returns zero."
    },
    Eqp: {
      symbol: ["eqp", "==p"],
      inlets: 2,
      desc: "Returns in1 if it equals in2, else returns zero. Equivalent to in1*(in1 == in2)."
    },
    Gt: {
      symbol: ["gt", ">"],
      inlets: 2,
      desc: "Returns 1 if in1 is greater than in2, else returns zero."
    },
    Gtp: {
      symbol: ["gtp", ">p"],
      inlets: 2,
      desc: "Returns in1 if in1 is greater than in2, else returns zero. Equivalent to in1*(in1 > in2)."
    },
    Gtr: {
      symbol: ["gte", ">="],
      inlets: 2,
      desc: "Returns 1 if in1 is equal to or greater than in2, else returns zero."
    },
    Gtep: {
      symbol: ["gtep", ">=p"],
      inlets: 2,
      desc: "Returns in1 if in1 is equal to or greater than in2, else returns zero. Equivalent to in1*(in1 >= in2)."
    },
    Lt: {
      symbol: ["lt", "<"],
      inlets: 2,
      desc: "Returns 1 if in1 is less than than in2, else returns zero."
    },
    Ltp: {
      symbol: ["ltp", "<p"],
      inlets: 2,
      desc: "Returns in1 if in1 is less than in2, else returns zero. Equivalent to in1*(in1 < in2)."
    },
    Lte: {
      symbol: ["lte", "<="],
      inlets: 2,
      desc: "Returns 1 if in1 is equal to or less than in2, else returns zero."
    },
    Ltep: {
      symbol: ["ltep", "<=p"],
      inlets: 2,
      desc: "Returns in1 if in1 is equal to or less than in2, else returns zero. Equivalent to in1*(in1 <= in2)."
    },
    Max: {
      symbol: ["maximum", "max"],
      inlets: 2,
      desc: "The maximum of the inputs"
    },
    Min: {
      symbol: ["minimum", "min"],
      inlets: 2,
      desc: "The minimum of the inputs"
    },
    Neq: {
      symbol: ["neq", "!="],
      inlets: 2,
      desc: "Returns 1 if in1 does not equal in2, else returns zero."
    },
    Step: {
      symbol: ["step"],
      inlets: 2,
      desc: "Akin to the GLSL step operator: 0 is returned if in1 < in2, and 1 is returned otherwise."
    },
    // Constant
    F: {
      symbol: ["float", "f"],
      inlets: 1,
      desc: "Either outputs a constant float or converts its input value to a float"
    },
    i: {
      symbol: ["int", "i"],
      inlets: 1,
      desc: "Either outputs a constant integer or converts its input value to an integer."
    },
    Degtorad: {
      symbol: ["DEGTORAD", "degtorad"],
      inlets: 0,
      desc: "A constant value"
    },
    E: {
      symbol: ["E", "e"],
      inlets: 0,
      desc: "A constant value"
    },
    Halfpi: {
      symbol: ["HALFPI", "halfpi"],
      inlets: 0,
      desc: "A constant value"
    },
    Invpi: {
      symbol: ["INVPI", "invpi"],
      inlets: 0,
      desc: "A constant value"
    },
    Ln10: {
      symbol: ["LN10", "ln10"],
      inlets: 0,
      desc: "A constant value"
    },
    Ln2: {
      symbol: ["LN2", "ln2"],
      inlets: 0,
      desc: "A constant value"
    },
    Log10e: {
      symbol: ["LOG10E", "log10e"],
      inlets: 0,
      desc: "A constant value"
    },
    Log2e: {
      symbol: ["LOG2E", "log2e"],
      inlets: 0,
      desc: "A constant value"
    },
    PHI: {
      symbol: ["phi", "PHI"],
      inlets: 0,
      desc: "A constant value"
    },
    PI: {
      symbol: ["PI", "pi"],
      inlets: 0,
      desc: "A constant value"
    },
    Radtodeg: {
      symbol: ["RADTODEG", "radtodeg"],
      inlets: 0,
      desc: "A constant value"
    },
    Sqrt1_2: {
      symbol: ["SQRT1_2", "sqrt1_2"],
      inlets: 0,
      desc: "A constant value"
    },
    Sqrt2: {
      symbol: ["SQRT2", "sqrt2"],
      inlets: 0,
      desc: "A constant value"
    },
    Twopi: {
      symbol: ["TWOPI", "twopi"],
      inlets: 0,
      desc: "A constant value"
    },
    // Ignore
    Pass: {
      symbol: ["pass"],
      inlets: 1,
      desc: "Passes the value through unchanged."
    },
    // Logic
    Not: {
      symbol: ["not", "!"],
      inlets: 1,
      desc: "An input value of zero returns 1, any other value returns zero."
    },
    And: {
      symbol: ["and", "&&"],
      inlets: 2,
      desc: "Returns 1 if both in1 and in2 are nonzero."
    },
    Bool: {
      symbol: ["bool"],
      inlets: 1,
      desc: "Converts any nonzero value to 1 while zero passes through."
    },
    Or: {
      symbol: ["or", "||"],
      inlets: 2,
      desc: "Returns 1 if either in1 or in2 are nonzero."
    },
    Xor: {
      symbol: ["xor", "^^"],
      inlets: 2,
      desc: "Returns 1 if one of in1 and in2 are nonzero, but not both."
    },
    // Math
    Neg: {
      symbol: ["neg"],
      inlets: 1,
      desc: "Negate input"
    },
    Add: {
      symbol: ["add", "+"],
      inlets: 2,
      desc: "Add inputs"
    },
    Sub: {
      symbol: ["sub", "-"],
      inlets: 2,
      desc: "Subtract inputs"
    },
    Rsub: {
      symbol: ["rsub", "!-"],
      inlets: 2,
      desc: "Reverse subtraction (subtract first input from second)"
    },
    Mul: {
      symbol: ["mul", "*"],
      inlets: 2,
      defaultArgs: [1, 1],
      desc: "Multiply inputs"
    },
    Div: {
      symbol: ["div", "/"],
      inlets: 2,
      defaultArgs: [1, 1],
      desc: "Divide inputs"
    },
    Rdiv: {
      symbol: ["rdiv", "!/"],
      inlets: 2,
      desc: "Reverse division (divide second input by first)"
    },
    Mod: {
      symbol: ["mod", "%"],
      inlets: 2,
      desc: "Modulo inputs (remainder of first input / second input)"
    },
    Rmod: {
      symbol: ["rmod", "!%"],
      inlets: 2,
      desc: "Reverse modulo (remainder of second input / first input)"
    },
    Absdiff: {
      symbol: ["absdiff"],
      inlets: 2,
      desc: "Compute the absolute difference between two inputs using the equation abs(in1-in2)."
    },
    Cartopol: {
      symbol: ["cartopol"],
      inlets: 2,
      outlets: 2,
      desc: "Convert Cartesian values to polar format. Angles are in radians."
    },
    Poltocar: {
      symbol: ["poltocar"],
      inlets: 2,
      outlets: 2,
      desc: "Convert polar values to Cartesian format. Angles are in radians."
    },
    // Numeric
    Abs: {
      symbol: ["abs"],
      inlets: 1,
      desc: "Negative values will be converted to positive counterparts."
    },
    Ceil: {
      symbol: ["ceil"],
      inlets: 1,
      desc: "Round the value up to the next higher integer"
    },
    Floor: {
      symbol: ["floor"],
      inlets: 1,
      desc: "Round the value down to the next lower integer (toward negative infinity)"
    },
    Fract: {
      symbol: ["fract"],
      inlets: 1,
      desc: "Return only the fractional component"
    },
    Sign: {
      symbol: ["sign"],
      inlets: 1,
      desc: "Positive input returns 1, negative input returns -1, zero returns itself."
    },
    Trunc: {
      symbol: ["trunc"],
      inlets: 1,
      desc: "Round the value down to the next smaller integer (toward zero)"
    },
    // Powers
    Exp: {
      symbol: ["exp"],
      inlets: 1,
      desc: "Raise the mathematical value e to a power"
    },
    Exp2: {
      symbol: ["exp2"],
      inlets: 1,
      desc: "Raise 2 to a power"
    },
    Fastexp: {
      symbol: ["fastexp"],
      inlets: 1,
      desc: "Approximated e to a power"
    },
    Fastpow: {
      symbol: ["fastpow"],
      inlets: 2,
      desc: "Approximated in1 to the power of in2"
    },
    Log: {
      symbol: ["log", "ln"],
      inlets: 1,
      desc: "The natural logarithm"
    },
    Log10: {
      symbol: ["log10"],
      inlets: 1,
      desc: "The logarithm base 10 of the input"
    },
    Log2: {
      symbol: ["log2"],
      inlets: 1,
      desc: "The logarithm base 2 of the input"
    },
    Pow: {
      symbol: ["pow"],
      inlets: 2,
      desc: "Raise in1 to the power of in2"
    },
    Sqrt: {
      symbol: ["sqrt"],
      inlets: 1,
      desc: "The square root of the input"
    },
    // Range
    Clip: {
      symbol: ["clip", "clamp"],
      inlets: 3,
      defaultArgs: [0, 0, 1],
      desc: "Clamps the input value between specified min and max. Ranges are inclusive (both min and max values may be output)"
    },
    Fold: {
      symbol: ["fold"],
      inlets: 3,
      defaultArgs: [0, 0, 1],
      desc: "Low and high values can be specified by arguments or by inlets. The default range is 0..1."
    },
    Scale: {
      symbol: ["scale"],
      inlets: 6,
      defaultArgs: [0, 0, 1, 0, 1, 1],
      desc: "Similar to the Max scale and MSP scale~ objects. Inputs are: 1) value to scale, 2) input lower bound, 3), input upper bound, 4) output lower bound, 5) output upper bound, 6) exponential curve. Default lower and upper bounds are zero and one; default exponential curve is 1 (linear). No bound clamping is performed. The high and low values can be reversed for inverted mapping."
    },
    Wrap: {
      symbol: ["wrap"],
      inlets: 3,
      defaultArgs: [0, 0, 1],
      desc: "Low and high values can be specified by arguments or by inlets. The default range is 0..1."
    },
    // Route
    Switch: {
      symbol: ["switch", "?"],
      inlets: 3,
      desc: "Selects between the second and third inputs according to the boolean value of the first. If the first argument is true, the second argument will be output. Otherwise, the third argument will be output."
    },
    // TODO: gate: { symbol: ["gate"], inlets: 0, desc: "Similar to the MSP gate~ object. It takes an argument for number of outputs (one is the default) and lets you choose which the incoming signal (at the right inlet) is sent to according to the (integer) value in the left inlet. A value of zero or less to the left inlet will choose no output; a value greater than the number of outlets will select the last outlet. Like gate~, un-selected outlets will send zero." },
    Mix: {
      symbol: ["mix"],
      inlets: 3,
      defaultArgs: [0, 1, 0.5],
      desc: "Mixes (interpolates) between inputs a and b according to the value of the third input t, using linear interpolation. The factor (t) should vary between 0 (for a) and 1 (for b). If one argument is given, it specifies the mix (interpolation) factor."
    },
    // TODO: selector: { symbol: ["selector"], inlets: 0, desc: "Similar to the MSP selector~ object. In a Gen patcher it takes an argument for number of choices (one is the default). In GenExpr, the number of choices is determined by the number of arguments. The first input lets you choose which of the remaining inputs is sent to the output. A value of zero or less to the first input will result in a zero signal at the output; a value greater than the number of choices will select the last input." },
    Smoothstep: {
      symbol: ["smoothstep"],
      inlets: 3,
      defaultArgs: [0, 1, 0.5],
      desc: "Smoothstep is a scalar interpolation function commonly used in computer graphics. The function interpolates smoothly between two input values based on a third one that should be between the first two. The returned value is clamped between 0 and 1. The slope (i.e. derivative) of the smoothstep function starts at 0 and ends at 0."
    },
    // Trigonometry
    Acos: {
      symbol: ["acos"],
      inlets: 1,
      desc: "The arc cosine of the input (returns radians)"
    },
    Acosh: {
      symbol: ["acosh"],
      inlets: 1,
      desc: "The inverse hyperbolic cosine of the input"
    },
    Asin: {
      symbol: ["asin"],
      inlets: 1,
      desc: "The arc sine of the input (returns radians)"
    },
    Asinh: {
      symbol: ["asinh"],
      inlets: 1,
      desc: "The inverse hyperbolic sine of the input"
    },
    Atan: {
      symbol: ["atan"],
      inlets: 1,
      desc: "The arc tangent of the input (returns radians)"
    },
    Atan2: {
      symbol: ["atan2"],
      inlets: 1,
      desc: "Returns the angle to the coordinate (x,y) in radians."
    },
    Atanh: {
      symbol: ["atanh"],
      inlets: 1,
      desc: "The inverse hyperbolic tangent of the input"
    },
    Cos: {
      symbol: ["cos"],
      inlets: 1,
      desc: "The cosine of the input (in radians)"
    },
    Cosh: {
      symbol: ["cosh"],
      inlets: 1,
      desc: "The hyperbolic cosine of the input"
    },
    Degrees: {
      symbol: ["degrees"],
      inlets: 1,
      desc: "convert radians to degrees"
    },
    Fastcos: {
      symbol: ["fastcos"],
      inlets: 1,
      desc: "The approximated cosine of the input (in radians)"
    },
    Fastsin: {
      symbol: ["fastsin"],
      inlets: 1,
      desc: "The approximated sine of the input (in radians)"
    },
    Fasttan: {
      symbol: ["fasttan"],
      inlets: 1,
      desc: "The approximated tangent of the input (in radians)"
    },
    Hypot: {
      symbol: ["hypot"],
      inlets: 2,
      desc: "Returns the length of the vector to (in1, in2)."
    },
    Radians: {
      symbol: ["radians"],
      inlets: 1,
      desc: "convert degrees to radians"
    },
    Sin: {
      symbol: ["sin"],
      inlets: 1,
      desc: "The sine of the input (in radians)"
    },
    Sinh: {
      symbol: ["sinh"],
      inlets: 1,
      desc: "The hyperbolic sine of the input"
    },
    Tan: {
      symbol: ["tan"],
      inlets: 1,
      desc: "The tangent of the input (in radians)"
    },
    Tanh: {
      symbol: ["tanh"],
      inlets: 1,
      desc: "The hyperbolic tangent of the input"
    },
    // Waveform
    Noise: {
      symbol: ["noise"],
      inlets: 0,
      desc: "A random number generator"
    }
  },
  dsp: {
    // Convert
    Atodb: {
      symbol: ["atodb"],
      inlets: 1,
      desc: "Convert linear amplitude to deciBel value"
    },
    DBtoa: {
      symbol: ["dbtoa"],
      inlets: 1,
      desc: "Convert deciBel value to linear amplitude"
    },
    Ftom: {
      symbol: ["ftom"],
      inlets: 2,
      defaultArgs: [440, 440],
      applyArgsFromStart: true,
      desc: "Frequency given in Hertz is converted to MIDI note number (0-127). Fractional note numbers are supported. The second input sets the tuning base (default 440)."
    },
    Mtof: {
      symbol: ["mtof"],
      inlets: 2,
      defaultArgs: [69, 440],
      applyArgsFromStart: true,
      desc: "MIDI note number (0-127) is converted to frequency in Hertz. Fractional note numbers are supported. The second input sets the tuning base (default 440)."
    },
    MStosamps: {
      symbol: ["mstosamps"],
      inlets: 1,
      defaultArgs: [1000],
      desc: "Convert period in milliseconds to samples"
    },
    Sampstoms: {
      symbol: ["sampstoms"],
      inlets: 1,
      defaultArgs: [1],
      desc: "Convert period in samples to milliseconds"
    },
    // Constants
    Samplerate: {
      symbol: ["SAMPLERATE", "samplerate"],
      inlets: 0,
      desc: "The DSP samplerate"
    },
    Vectorsize: {
      symbol: ["VECTORSIZE", "vectorsize"],
      inlets: 0,
      desc: "The DSP vectorsize"
    },
    // DSP
    Fixdenorm: {
      symbol: ["fixdenorm"],
      inlets: 1,
      desc: "This operator detects denormal numbers and replaces them with zero. Note: As of Max 6.0 the x87 control flags are set to flush to zero and disable exception handling in audio processing, so denormal fixing should only be required for exported code. A denormal number is a floating point value very close to zero (filling the underflow gap). Calculations with denormal values can be up to 100 times more expensive, so it is often beneficial to replace them with zeroes. Denormals often occur in feedback loops with multipliers, such as filters, delays and exponential decays. Denormal detection is based on a bitmask. Note that feedback operators in gen~ (delay, history) apply fixdenorm to their input signals by default."
    },
    Fixnan: {
      symbol: ["fixnan"],
      inlets: 1,
      desc: "This operator replaces NaNs with zero. A NaN (Not a Number) is a floating point data value which represents an undefined or unrepresentable value, such as the result of dividing by zero. Computations on NaNs produce more NaNs, and so it is often preferable to replace the NaN with a zero value. Note that division and modulo operators in gen~ protect against generating NaNs by default."
    },
    Isdenorm: {
      symbol: ["isdenorm"],
      inlets: 1,
      desc: "This operator detects denormal numbers and returns 1 if the input is denormal, and zero otherwise. Note: As of Max 6.0 the x87 control flags are set to flush to zero and disable exception handling in audio processing, so denormal fixing should only be required for exported code. A denormal number is a floating point value very close to zero (filling the underflow gap). Calculations with denormal values can be up to 100 times more expensive, so it is often beneficial to replace them with zeroes. Denormals often occur in feedback loops with multipliers, such as filters, delays and exponential decays. Denormal detection is based on a bitmask. Note that feedback operators in gen~ (delay, history) apply fixdenorm to their input signals by default."
    },
    Isnan: {
      symbol: ["isnan"],
      inlets: 1,
      desc: "This operator detects the presence of NaN values, returning 1 if the input is NaN, and zero otherwise. A NaN (Not a Number) is a floating point data value which represents an undefined or unrepresentable value, such as the result of dividing by zero. Computations on NaNs produce more NaNs, and so it is often preferable to replace the NaN with a zero value. Note that division and modulo operators in gen~ protect against generating NaNs by default."
    },
    T60: {
      symbol: ["t60"],
      inlets: 1,
      defaultArgs: ["ma.SR"],
      desc: "Given an input T, returns a number X such that, after T multiplications of a signal by X, that signal would be attenuated by 60 decibels. Roughly, -60db = 0db * pow(X, T). This could be used as a per-sample multiplier (X) to ensure a decay time (of T samples), for example. The name t60 is borrowed form the RT60 time used to measure reverberation time, which specifies the time taken for a signal to decay by 60db, as an approximation of fading to inaudibility."
    },
    T60time: {
      symbol: ["t60time"],
      inlets: 1,
      defaultArgs: [1],
      desc: "Estimates the decay time (in samples) of a given decay factor. That is, given a multiplier X, returns a number T such that, after T multiplications of a signal by X, that signal would be attenuated by 60 decibels. It is the dual of the t60 object."
    },
    // Filter
    Change: {
      symbol: ["change"],
      inlets: 1,
      desc: "Returns the sign of the difference between the current and previous input: 1 if the input is increasing, -1 if decreasing, and 0 if unchanging."
    },
    Dcblock: {
      symbol: ["dcblock"],
      inlets: 1,
      desc: "A one-pole high-pass filter to remove DC components. Equivalent to the GenExpr: History x1, y1; y = in1 - x1 + y1*0.9997; x1 = in1; y1 = y; out1 = y;"
    },
    Delta: {
      symbol: ["delta"],
      inlets: 1,
      desc: "Returns the difference between the current and previous input."
    },
    Latch: {
      symbol: ["latch"],
      inlets: 2,
      desc: "Conditionally passes or holds input. The first inlet is the 'input' and the second inlet is the 'control'. When the control is non-zero, the input value is passed through. When the control is zero, the previous input value is output. It can be used to periodically sample & hold a source signal with a simpler trigger logic than the sah operator."
    },
    Phasewrap: {
      symbol: ["phasewrap"],
      inlets: 1,
      desc: "Wrap input to the range -pi to +pi"
    },
    Sah: {
      symbol: ["sah"],
      inlets: 1,
      desc: "The first inlet is the 'input' and the second inlet is the 'control'. When the control makes a transition from being at or below the trigger value to being above the trigger threshold, the input is sampled. The sampled value is output until another control transition occurs, at which point the input is sampled again. The default threshold value is 0, but can be specified as the last inlet/argument. The @init attribute sets the initial previous value to compare to (default 0)."
    },
    Slide: {
      symbol: ["slide"],
      inlets: 3,
      defaultArgs: [0, 1, 1],
      desc: "Use the slide operator for envelope following and lowpass filtering. Related to the MSP slide~ object."
    },
    // Globals
    Elapsed: {
      symbol: ["elapsed"],
      inlets: 1,
      desc: "The number of samples elapsed since the patcher DSP began, or since the last reset."
    },
    // Integrator
    Mulequals: {
      symbol: ["mulequals", "*="],
      inlets: 2,
      desc: "The object multiplies by, and then outputs, an internal value. This occurs at sample-rate, so the stored value can grow very large or very small, very fast. The value to be multiplied by is specified by either the first inlet or argument. The internal sum can be reset to the minimum by sending a nonzero value to the right-most inlet. The minimum value is 0 by default, but can be changed with the @min attribute. An optional maximum value can be specified with the @max attribute; values will wrap at the maximum."
    },
    Plusequals: {
      symbol: ["accum", "plusequals", "+="],
      inlets: 2,
      desc: "The object adds to, and then outputs, an internal sum. This occurs at sample-rate, so the sum can grow very large, very fast. The value to be added is specified by either the first inlet or argument. The internal sum can be reset to the minimum by sending a nonzero value to the right-most inlet. The minimum value is 0 by default, but can be changed with the @min attribute. An optional maximum value can be specified with the @max attribute; values will wrap at the maximum."
    },
    Counter: {
      symbol: ["counter"],
      inlets: 3,
      defaultArgs: [1, 0, 0],
      desc: "Accumulates and outputs a stored count, similarly to Max's counter object, but triggered at sample-rate. The amount to accumulate per sample is set by the first input (incr). The count can be reset by a non-zero value in the second input (reset). The third inlet (max) sets a maximum value; the counter will wrap if it reaches this value. However if the maximum value is set to 0 (the default), the counter will assume no limit and count indefinitely. The first outlet outputs the current count, the second outlet outputs 1 when the count wraps at the maximum and zero otherwise, and the third outlet outputs the number of wraps (the carry count)."
    },
    // Numeric
    Round: {
      symbol: ["round"],
      inlets: 1,
      desc: "Returns the integral value that is nearest to the input, with halfway cases rounded away from zero."
    },
    // Waveform
    Phasor: {
      symbol: ["phasor"],
      inlets: 2,
      defaultArgs: [440, 0],
      desc: "A non-bandlimited sawtooth-waveform signal generator which can be used as LFO audio signal or a sample-accurate timing/control signal."
    },
    // TODO rate: { symbol: ["rate"], inlets: 1, desc: "The rate operator time-scales an input phase (such as from a phasor) by a multiplier. Multipliers less than 1 create several ramps per phase cycle." },
    Train: {
      symbol: ["train"],
      inlets: 3,
      defaultArgs: ["ma.SR", 0.5, 0],
      desc: "train~ generates a pulse signal whose period is specifiable in terms of samples. The first input sets the pulse period (in samples). The second input sets the pulse width (default 0.5). The third inlet sets the phase of the 'on' portion (default 0.)"
    },
    Triangle: {
      symbol: ["triangle"],
      inlets: 2,
      defaultArgs: [0, 0.5],
      desc: "A triangle/ramp wavetable with input to change phase offset of the peak value. The phase ranges from 0 to 1 (and wraps outside these values). With a duty cycle of 0, it produces a descending sawtooth; with a duty cycle of 1 it produces ascending sawtooth; with a duty cycle of 0.5 it produces a triangle waveform. Output values always bounded in 0 to 1."
    }
  }
};
/*
const genOperators: Record<string, string[]> = {
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
*/

for (const category in opMap) {
  for (const name in opMap[category]) {
    var _class, _temp;

    const entry = opMap[category][name];
    const {
      symbol,
      inlets,
      outlets,
      desc,
      applyArgsFromStart,
      defaultArgs
    } = entry;
    const Op = (_temp = _class = class Op extends GenLibOp {
      constructor() {
        super(...arguments);

        _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
          inlets,
          outlets: outlets || 1,
          defaultArgs: defaultArgs || new Array(inlets).fill(0)
        }));

        _defineProperty(this, "reverseApply", !applyArgsFromStart);
      }

      static get _name() {
        return name;
      }

      get symbol() {
        return typeof symbol === "string" ? [symbol] : symbol;
      }

    }, _defineProperty(_class, "description", desc), _temp);
    genOps[name] = Op;
    if (typeof symbol === "string") genOps[symbol] = Op;else symbol.forEach(s => genOps[s] = Op);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (genOps);

/***/ })

}]);
//# sourceMappingURL=0018c2c943772d62332c.js.map