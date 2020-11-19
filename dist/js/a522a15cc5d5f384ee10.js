(window["webpackJsonpJSPatcher"] = window["webpackJsonpJSPatcher"] || []).push([[7],{

/***/ "./src/core/objects/dsp/AudioWorklet/Base.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/dsp/AudioWorklet/Base.ts ***!
  \***************************************************/
/*! exports provided: registeredProcessors, DisposableAudioWorkletNode, AudioWorkletRegister */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registeredProcessors", function() { return registeredProcessors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisposableAudioWorkletNode", function() { return DisposableAudioWorkletNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AudioWorkletRegister", function() { return AudioWorkletRegister; });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const registeredProcessors = new Set();
const AWN = window.AudioWorkletNode ? AudioWorkletNode : null;
class DisposableAudioWorkletNode extends AWN {
  get port() {
    return super.port;
  }

  get parameters() {
    return super.parameters;
  }

  destroy() {
    this.port.postMessage({
      destroy: true
    });
    this.port.close();
    this.destroyed = true;
  }

  constructor(context, name, options) {
    super(context, name, options);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "destroyed", false);

    this.options = options;
  }

}
class AudioWorkletRegister {
  static get registered() {
    return this.registeredProcessors.has(this.processorID);
  }

  static set registered(b) {
    this.registeredProcessors.add(this.processorID);
  }

  static async registerProcessor(audioWorklet) {
    this.registering = true;

    try {
      const url = this.processorURL || window.URL.createObjectURL(new Blob(["(".concat(this.processor.toString(), ")();")], {
        type: "text/javascript"
      }));
      await audioWorklet.addModule(url);
      this.resolves[this.processorID].forEach(f => f());
      this.registering = false;
      this.registered = true;
    } catch (e) {
      this.rejects[this.processorID].forEach(f => f(e));
    }

    this.rejects[this.processorID] = [];
    this.resolves[this.processorID] = [];
  }

  static async register(audioWorklet) {
    if (!this.resolves[this.processorID]) this.resolves[this.processorID] = [];
    if (!this.rejects[this.processorID]) this.rejects[this.processorID] = [];
    const promise = new Promise((resolve, reject) => {
      this.resolves[this.processorID].push(resolve);
      this.rejects[this.processorID].push(reject);
    });
    if (this.registered) return new Promise(resolve => resolve());
    if (this.registering) return promise;
    if (!this.registered && audioWorklet) this.registerProcessor(audioWorklet);
    return promise;
  }

}

_defineProperty(AudioWorkletRegister, "processorID", void 0);

_defineProperty(AudioWorkletRegister, "processorURL", void 0);

_defineProperty(AudioWorkletRegister, "registeredProcessors", registeredProcessors);

_defineProperty(AudioWorkletRegister, "registering", false);

_defineProperty(AudioWorkletRegister, "processor", void 0);

_defineProperty(AudioWorkletRegister, "Node", void 0);

_defineProperty(AudioWorkletRegister, "resolves", {});

_defineProperty(AudioWorkletRegister, "rejects", {});

/***/ }),

/***/ "./src/core/objects/dsp/AudioWorklet/SpectralAnalyser.ts":
/*!***************************************************************!*\
  !*** ./src/core/objects/dsp/AudioWorklet/SpectralAnalyser.ts ***!
  \***************************************************************/
/*! exports provided: processorID, SpectralAnalyserNode, SpectralAnalyserRegister */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processorID", function() { return processorID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpectralAnalyserNode", function() { return SpectralAnalyserNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpectralAnalyserRegister", function() { return SpectralAnalyserRegister; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/AudioWorklet/Base.ts");
/* harmony import */ var _SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SpectralAnalyser.worklet.ts */ "./src/core/objects/dsp/AudioWorklet/SpectralAnalyser.worklet.ts");
/* harmony import */ var _SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_1__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


 // eslint-disable-line import/extensions

const processorID = "__JSPatcher_SpectralAnalyser";
class SpectralAnalyserNode extends _Base__WEBPACK_IMPORTED_MODULE_0__["DisposableAudioWorkletNode"] {
  constructor(context) {
    super(context, processorID, {
      numberOfInputs: 1,
      numberOfOutputs: 0
    });

    _defineProperty(this, "promiseID", 0);

    _defineProperty(this, "resolves", {});

    this.port.onmessage = e => {
      const {
        id
      } = e.data;
      delete e.data.id;
      const f = this.resolves[id];
      if (f) f(e.data);
      delete this.resolves[id];
    };
  }

  gets(options) {
    if (this.destroyed) throw new Error("The Node is already destroyed.");
    const promise = new Promise(resolve => this.resolves[this.promiseID] = resolve);
    this.port.postMessage(_objectSpread({
      id: this.promiseID++
    }, options));
    return promise;
  }

}
class SpectralAnalyserRegister extends _Base__WEBPACK_IMPORTED_MODULE_0__["AudioWorkletRegister"] {}

_defineProperty(SpectralAnalyserRegister, "processorID", processorID);

_defineProperty(SpectralAnalyserRegister, "processorURL", _SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_1___default.a);

_defineProperty(SpectralAnalyserRegister, "Node", SpectralAnalyserNode);

/***/ }),

/***/ "./src/core/objects/dsp/AudioWorklet/SpectralAnalyser.worklet.ts":
/*!***********************************************************************!*\
  !*** ./src/core/objects/dsp/AudioWorklet/SpectralAnalyser.worklet.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "js/d0a48ae56cd511de667e.worklet.js";

/***/ }),

/***/ "./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.ts":
/*!***************************************************************!*\
  !*** ./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.ts ***!
  \***************************************************************/
/*! exports provided: processorID, TemporalAnalyserNode, TemporalAnalyserRegister */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processorID", function() { return processorID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemporalAnalyserNode", function() { return TemporalAnalyserNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemporalAnalyserRegister", function() { return TemporalAnalyserRegister; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/AudioWorklet/Base.ts");
/* harmony import */ var _TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemporalAnalyser.worklet.ts */ "./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.worklet.ts");
/* harmony import */ var _TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_1__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


 // eslint-disable-line import/extensions

const processorID = "__JSPatcher_TemporalAnalyser";
class TemporalAnalyserNode extends _Base__WEBPACK_IMPORTED_MODULE_0__["DisposableAudioWorkletNode"] {
  constructor(context) {
    super(context, processorID, {
      numberOfInputs: 1,
      numberOfOutputs: 0
    });

    _defineProperty(this, "promiseID", 0);

    _defineProperty(this, "resolves", {});

    this.port.onmessage = e => {
      const {
        id
      } = e.data;
      delete e.data.id;
      const f = this.resolves[id];
      if (f) f(e.data);
      delete this.resolves[id];
    };
  }

  get rms() {
    return this.gets({
      rms: true
    });
  }

  get zcr() {
    return this.gets({
      zcr: true
    });
  }

  get buffer() {
    return this.gets({
      buffer: true
    });
  }

  gets(options) {
    if (this.destroyed) throw new Error("The Node is already destroyed.");
    const promise = new Promise(resolve => this.resolves[this.promiseID] = resolve);
    this.port.postMessage(_objectSpread({
      id: this.promiseID++
    }, options));
    return promise;
  }

}
class TemporalAnalyserRegister extends _Base__WEBPACK_IMPORTED_MODULE_0__["AudioWorkletRegister"] {}

_defineProperty(TemporalAnalyserRegister, "processorID", processorID);

_defineProperty(TemporalAnalyserRegister, "processorURL", _TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_1___default.a);

_defineProperty(TemporalAnalyserRegister, "Node", TemporalAnalyserNode);

/***/ }),

/***/ "./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.worklet.ts":
/*!***********************************************************************!*\
  !*** ./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.worklet.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "js/6c74c1a3f009d1037f95.worklet.js";

/***/ }),

/***/ "./src/core/objects/dsp/Base.ts":
/*!**************************************!*\
  !*** ./src/core/objects/dsp/Base.ts ***!
  \**************************************/
/*! exports provided: BaseDSP, DefaultDSP */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseDSP", function() { return BaseDSP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultDSP", function() { return DefaultDSP; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class BaseDSP extends _Base__WEBPACK_IMPORTED_MODULE_0__["BaseAudioObject"] {}

_defineProperty(BaseDSP, "package", "dsp");

_defineProperty(BaseDSP, "author", "Fr0stbyteR");

_defineProperty(BaseDSP, "version", "1.0.0");

class DefaultDSP extends _Base__WEBPACK_IMPORTED_MODULE_0__["DefaultAudioObject"] {}

_defineProperty(DefaultDSP, "package", "dsp");

_defineProperty(DefaultDSP, "author", "Fr0stbyteR");

_defineProperty(DefaultDSP, "version", "1.0.0");

/***/ }),

/***/ "./src/core/objects/dsp/Oscilloscope.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/dsp/Oscilloscope.ts ***!
  \**********************************************/
/*! exports provided: OscilloscopeUI, Oscilloscope */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: D:\\p\\jspatcher\\src\\core\\objects\\dsp\\Oscilloscope.ts: Lexical declaration cannot appear in a single-statement context (147:16)\n\n\u001b[0m \u001b[90m 145 | \u001b[39m            \u001b[36mif\u001b[39m (stablize) { \u001b[90m// Stablization\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 146 | \u001b[39m                \u001b[36mif\u001b[39m (i \u001b[33m===\u001b[39m \u001b[35m0\u001b[39m)\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 147 | \u001b[39m                \u001b[36mconst\u001b[39m thresh \u001b[33m=\u001b[39m (min \u001b[33m+\u001b[39m max) \u001b[33m*\u001b[39m \u001b[35m0.5\u001b[39m \u001b[33m+\u001b[39m \u001b[35m0.001\u001b[39m\u001b[33m;\u001b[39m \u001b[90m// the zero-crossing with \"offset\"\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m     | \u001b[39m                \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 148 | \u001b[39m                \u001b[36mconst\u001b[39m period \u001b[33m=\u001b[39m sampleRate \u001b[33m/\u001b[39m estimatedFreq[i]\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 149 | \u001b[39m                \u001b[36mconst\u001b[39m times \u001b[33m=\u001b[39m \u001b[33mMath\u001b[39m\u001b[33m.\u001b[39mfloor(l \u001b[33m/\u001b[39m period) \u001b[33m-\u001b[39m \u001b[35m1\u001b[39m\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 150 | \u001b[39m                \u001b[36mwhile\u001b[39m ($zerox \u001b[33m<\u001b[39m l \u001b[33m&&\u001b[39m t[i][($ \u001b[33m+\u001b[39m $zerox\u001b[33m++\u001b[39m) \u001b[33m%\u001b[39m l] \u001b[33m>\u001b[39m thresh)\u001b[33m;\u001b[39m \u001b[90m// Find first raise\u001b[39m\u001b[0m\n    at Object._raise (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:766:17)\n    at Object.raiseWithData (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:759:17)\n    at Object.raise (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:753:17)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11495:16)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:6698:18)\n    at Object.parseStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at Object.parseIfStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11785:28)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11476:21)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:6698:18)\n    at Object.parseStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at Object.parseBlockOrModuleBlockBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12013:25)\n    at Object.parseBlockBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11999:10)\n    at Object.parseBlock (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11983:10)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11507:21)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:6698:18)\n    at Object.parseStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at Object.parseIfStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11785:28)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11476:21)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:6698:18)\n    at Object.parseStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at Object.parseBlockOrModuleBlockBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12013:25)\n    at Object.parseBlockBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11999:10)\n    at Object.parseBlock (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11983:10)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11507:21)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:6698:18)\n    at Object.parseStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12056:60\n    at Object.withTopicForbiddingContext (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11272:14)\n    at Object.parseFor (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12056:22)\n    at Object.parseForStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11755:19)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11456:21)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:6698:18)\n    at Object.parseStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11431:17)\n    at Object.parseBlockOrModuleBlockBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12013:25)\n    at Object.parseBlockBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11999:10)\n    at Object.parseBlock (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11983:10)");

/***/ }),

/***/ "./src/core/objects/dsp/SpectralAnalyser.ts":
/*!**************************************************!*\
  !*** ./src/core/objects/dsp/SpectralAnalyser.ts ***!
  \**************************************************/
/*! exports provided: SpectralAnalyser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpectralAnalyser", function() { return SpectralAnalyser; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioWorklet/SpectralAnalyser */ "./src/core/objects/dsp/AudioWorklet/SpectralAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class SpectralAnalyser extends _Base__WEBPACK_IMPORTED_MODULE_0__["DefaultDSP"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined,
      $requestTimer: -1
    });
  }

  subscribe() {
    super.subscribe();

    const startRequest = () => {
      const request = async () => {
        if (this.state.node && !this.state.node.destroyed) {
          const extractorKeys = ["buffer", "lastAmplitudes", "allAmplitudes", "amplitude", "estimatedFreq", "centroid", "flatness", "flux", "kurtosis", "skewness", "rolloff", "slope", "spread"];
          const gets = {};
          extractorKeys.forEach(key => gets[key] = this.getProp(key));
          const got = await this.state.node.gets(gets);
          this.outlet(0, got);
        }

        if (this.getProp("continuous")) scheduleRequest();
      };

      const scheduleRequest = () => {
        this.state.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
      };

      request();
    };

    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("updateProps", props => {
      if (this.state.node) {
        const {
          parameters
        } = this.state.node;
        if (props.continuous) startRequest();
        if (props.windowFunction) this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(props.windowFunction)]]);
        if (props.fftSize) this.applyBPF(parameters.get("fftSize"), [[props.fftSize]]);
        if (props.fftOverlap) this.applyBPF(parameters.get("fftOverlap"), [[props.fftOverlap]]);
        if (props.windowSize) this.applyBPF(parameters.get("windowSize"), [[props.windowSize]]);
      }
    });
    this.on("postInit", async () => {
      await _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__["SpectralAnalyserRegister"].register(this.audioCtx.audioWorklet);
      this.state.node = new _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__["SpectralAnalyserRegister"].Node(this.audioCtx);
      const {
        parameters
      } = this.state.node;
      this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(this.getProp("windowFunction"))]]);
      this.applyBPF(parameters.get("fftSize"), [[this.getProp("fftSize")]]);
      this.applyBPF(parameters.get("fftOverlap"), [[this.getProp("fftOverlap")]]);
      this.applyBPF(parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      this.disconnectAudioInlet();
      this.inletConnections[0] = {
        node: this.state.node,
        index: 0
      };
      this.connectAudioInlet();
      if (this.getProp("continuous")) startRequest();
      this.on("inlet", e => {
        if (e.inlet === 0) {
          if (e.data instanceof _Base__WEBPACK_IMPORTED_MODULE_2__["Bang"]) startRequest();
        }
      });
    });
    this.on("destroy", () => {
      window.clearTimeout(this.state.$requestTimer);
      if (this.state.node) this.state.node.destroy();
    });
  }

}

_defineProperty(SpectralAnalyser, "description", "Spectral feature extractor");

_defineProperty(SpectralAnalyser, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Signal, bang to extract features"
}]);

_defineProperty(SpectralAnalyser, "outlets", [{
  type: "object",
  description: "Features chosen as object"
}]);

_defineProperty(SpectralAnalyser, "props", {
  speedLim: {
    type: "number",
    default: 16,
    description: "If continuous, value output speed limit in ms"
  },
  windowSize: {
    type: "number",
    default: 1024,
    description: "Buffer window size"
  },
  fftSize: {
    type: "number",
    default: 1024,
    description: "FFT Size for analysis"
  },
  fftOverlap: {
    type: "number",
    default: 2,
    description: "FFT overlap count (integer)"
  },
  windowFunction: {
    type: "enum",
    enums: ["blackman", "hamming", "hann", "triangular"],
    default: "blackman",
    description: "Window Function aoolied for FFT analysis window"
  },
  continuous: {
    type: "boolean",
    default: false,
    description: "Whether output is continuous"
  },
  buffer: {
    type: "boolean",
    default: false,
    description: "Getting the signal buffer"
  },
  lastAmplitudes: {
    type: "boolean",
    default: false,
    description: "Getting the last amplitudes frame"
  },
  allAmplitudes: {
    type: "boolean",
    default: false,
    description: "Getting all the amplitudes frame"
  },
  amplitude: {
    type: "boolean",
    default: false,
    description: "Getting the sum of the last amplitude frame"
  },
  estimatedFreq: {
    type: "boolean",
    default: false,
    description: "Getting the estimated frequency"
  },
  centroid: {
    type: "boolean",
    default: false,
    description: "Getting the spectral centroid"
  },
  flatness: {
    type: "boolean",
    default: false,
    description: "Getting the spectral flatness"
  },
  flux: {
    type: "boolean",
    default: false,
    description: "Getting the spectral flux"
  },
  kurtosis: {
    type: "boolean",
    default: false,
    description: "Getting the spectral kurtosis"
  },
  skewness: {
    type: "boolean",
    default: false,
    description: "Getting the spectral skewness"
  },
  rolloff: {
    type: "boolean",
    default: false,
    description: "Getting the spectral rolloff"
  },
  slope: {
    type: "boolean",
    default: false,
    description: "Getting the spectral slope"
  },
  spread: {
    type: "boolean",
    default: false,
    description: "Getting the spectral spread"
  }
});

/***/ }),

/***/ "./src/core/objects/dsp/Spectrogram.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/dsp/Spectrogram.ts ***!
  \*********************************************/
/*! exports provided: SpectrogramUI, Spectrogram */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpectrogramUI", function() { return SpectrogramUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Spectrogram", function() { return Spectrogram; });
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioWorklet/SpectralAnalyser */ "./src/core/objects/dsp/AudioWorklet/SpectralAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import * as Color from "color-js";





class SpectrogramUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_0__["CanvasUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "$lastFrame", -1);

    _defineProperty(this, "frames", 1);

    _defineProperty(this, "offscreenCtx", document.createElement("canvas").getContext("2d"));

    _defineProperty(this, "offscreenVRes", 1024);
  }

  componentDidMount() {
    const {
      bgColor
    } = this.state;
    const {
      ctx,
      offscreenCtx,
      frames
    } = this;
    if (!ctx) return;
    const [width, height] = this.fullSize();
    offscreenCtx.canvas.width = frames;
    offscreenCtx.canvas.height = this.offscreenVRes; // Background

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    super.componentDidMount();
  }

  async paint() {
    if (this.state.continuous) this.schedulePaint();
    if (!this.object.state.node) return;
    if (this.object.state.node.destroyed) return;
    const {
      // width,
      // height,
      // zoom,
      // zoomOffset,
      // $cursor,
      bgColor,
      gridColor,
      seperatorColor
    } = this.state;
    const {
      ctx,
      offscreenCtx,
      offscreenVRes
    } = this;
    if (!ctx || !offscreenCtx) return;
    const left = 0;
    const bottom = 0;
    const {
      allAmplitudes
    } = await this.object.state.node.gets({
      allAmplitudes: true
    }); // Background

    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    if (!allAmplitudes) return;
    const {
      data: f,
      $totalFrames,
      fftBins: bins,
      frames: framesIn,
      $frame: $frameUi32,
      lock
    } = allAmplitudes;
    if (!f || !f.length || !f[0].length) return;
    const l = f[0].length;
    const channels = f.length;

    while (Atomics.load(lock, 0));

    Atomics.store(lock, 0, 1); // Draw to offscreen canvas

    let frames = this.frames;
    const $lastFrame = $totalFrames[0] - 1;
    const $frame = $frameUi32[0];
    let $frame0 = $frame;
    const $frame1 = $frame0 + framesIn;

    if (frames !== framesIn) {
      offscreenCtx.canvas.width = framesIn;
      this.frames = framesIn;
      frames = framesIn;
    } else if ($lastFrame >= this.$lastFrame) {
      $frame0 = Math.max($frame0, $frame1 - ($lastFrame - this.$lastFrame));
    }

    this.$lastFrame = $lastFrame;
    const osChannelHeight = offscreenVRes / channels;
    const step = Math.max(1, Math.round(bins / osChannelHeight));
    const vGrid = osChannelHeight / bins;

    for (let i = 0; i < f.length; i++) {
      for (let j = $frame0; j < $frame1; j++) {
        let maxInStep;
        offscreenCtx.fillStyle = "black";
        offscreenCtx.fillRect(j % frames, i * osChannelHeight, 1, osChannelHeight);

        for (let k = 0; k < bins; k++) {
          const samp = Object(_utils_math__WEBPACK_IMPORTED_MODULE_4__["atodb"])(f[i][(k + j * bins) % l]);
          const $step = k % step;
          if ($step === 0) maxInStep = samp;

          if ($step !== step - 1) {
            if ($step !== 0 && samp > maxInStep) maxInStep = samp;
            continue;
          }

          const normalized = Math.min(1, Math.max(0, (maxInStep + 10) / 100 + 1));
          if (normalized === 0) continue;
          const hue = (normalized * 180 + 240) % 360;
          const lum = normalized * 50;
          offscreenCtx.fillStyle = "hsl(".concat(hue, ", 100%, ").concat(lum, "%)");
          offscreenCtx.fillRect(j % frames, (bins - k - 1) * vGrid + i * osChannelHeight, 1, Math.max(1, vGrid));
        }
      }
    }

    Atomics.store(lock, 0, 0); // Grids

    ctx.strokeStyle = gridColor;
    const vStep = 0.25;
    const hStep = 0.25;
    ctx.beginPath();
    ctx.setLineDash([]);
    const gridChannels = channels;
    const channelHeight = (height - bottom) / gridChannels;

    for (let i = 0; i < gridChannels; i++) {
      for (let j = vStep; j < 1; j += vStep) {
        // Horizontal lines
        const y = (i + j) * channelHeight;
        ctx.moveTo(left, y);
        ctx.lineTo(width, y);
      }
    }

    for (let i = hStep; i < 1; i += hStep) {
      const x = left + (width - left) * i;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, bottom);
    }

    ctx.stroke();
    ctx.beginPath();
    ctx.setLineDash([4, 2]);
    ctx.strokeStyle = seperatorColor;

    for (let i = 1; i < gridChannels; i++) {
      ctx.moveTo(left, i * channelHeight);
      ctx.lineTo(width, i * channelHeight);
    }

    ctx.stroke();
    ctx.setLineDash([]); // Horizontal Range

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.imageSmoothingEnabled = false;
    $frame0 = $frame;

    if ($frame1 === frames) {
      ctx.drawImage(offscreenCtx.canvas, 0, 0, frames, offscreenVRes, left, 0, width - left, height - bottom);
    } else {
      const sSplit = frames - $frame0;
      const dSplit = sSplit / frames * (width - left);
      ctx.drawImage(offscreenCtx.canvas, $frame0, 0, sSplit, offscreenVRes, left, 0, dSplit, height - bottom);
      ctx.drawImage(offscreenCtx.canvas, 0, 0, $frame1 - frames - 0.01, offscreenVRes, dSplit + left, 0, width - left - dSplit, height - bottom);
    }

    ctx.restore();
  }

}

_defineProperty(SpectrogramUI, "defaultSize", [120, 60]);

class Spectrogram extends _Base__WEBPACK_IMPORTED_MODULE_2__["BaseDSP"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("updateProps", props => {
      if (this.state.node) {
        const {
          parameters
        } = this.state.node;
        if (props.windowFunction) this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(props.windowFunction)]]);
        if (props.fftSize) this.applyBPF(parameters.get("fftSize"), [[props.fftSize]]);
        if (props.fftOverlap) this.applyBPF(parameters.get("fftOverlap"), [[props.fftOverlap]]);
        if (props.windowSize) this.applyBPF(parameters.get("windowSize"), [[props.windowSize]]);
      }
    });
    this.on("postInit", async () => {
      await _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__["SpectralAnalyserRegister"].register(this.audioCtx.audioWorklet);
      this.state.node = new _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__["SpectralAnalyserRegister"].Node(this.audioCtx);
      const {
        parameters
      } = this.state.node;
      this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(this.getProp("windowFunction"))]]);
      this.applyBPF(parameters.get("fftSize"), [[this.getProp("fftSize")]]);
      this.applyBPF(parameters.get("fftOverlap"), [[this.getProp("fftOverlap")]]);
      this.applyBPF(parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      this.disconnectAudioInlet();
      this.inletConnections[0] = {
        node: this.state.node,
        index: 0
      };
      this.connectAudioInlet();
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (data instanceof _Base__WEBPACK_IMPORTED_MODULE_3__["Bang"]) this.updateUI({
          paint: {}
        });
      }
    });
    this.on("destroy", () => {
      if (this.state.node) this.state.node.destroy();
    });
  }

}

_defineProperty(Spectrogram, "description", "Spectroscope");

_defineProperty(Spectrogram, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Signal"
}]);

_defineProperty(Spectrogram, "props", {
  windowSize: {
    type: "number",
    default: 1024,
    description: "Signal window size"
  },
  fftSize: {
    type: "number",
    default: 1024,
    description: "FFT Size for analysis"
  },
  fftOverlap: {
    type: "number",
    default: 2,
    description: "FFT overlap count (integer)"
  },
  windowFunction: {
    type: "enum",
    enums: ["blackman", "hamming", "hann", "triangular"],
    default: "blackman",
    description: "Window Function aoolied for FFT analysis window"
  },
  continuous: {
    type: "boolean",
    default: true,
    description: "Continuous drawing",
    isUIState: true
  },
  frameRate: {
    type: "number",
    default: 60,
    description: "UI refresh rate",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgb(40, 40, 40)",
    description: "Background color",
    isUIState: true
  },
  gridColor: {
    type: "color",
    default: "#404040",
    description: "Grid color",
    isUIState: true
  },
  seperatorColor: {
    type: "color",
    default: "white",
    description: "Channel seperator color",
    isUIState: true
  }
});

_defineProperty(Spectrogram, "ui", SpectrogramUI);

/***/ }),

/***/ "./src/core/objects/dsp/Spectroscope.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/dsp/Spectroscope.ts ***!
  \**********************************************/
/*! exports provided: SpectroscopeUI, Spectroscope */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpectroscopeUI", function() { return SpectroscopeUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Spectroscope", function() { return Spectroscope; });
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! color-js */ "./node_modules/color-js/color.js");
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioWorklet/SpectralAnalyser */ "./src/core/objects/dsp/AudioWorklet/SpectralAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







class SpectroscopeUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_1__["CanvasUI"] {
  componentDidMount() {
    const {
      bgColor
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const [width, height] = this.fullSize(); // Background

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    super.componentDidMount();
  }

  async paint() {
    if (this.state.continuous) this.schedulePaint();
    if (!this.object.state.node) return;
    if (this.object.state.node.destroyed) return;
    const {
      // width,
      // height,
      // zoom,
      // zoomOffset,
      // $cursor,
      bgColor,
      fgColor,
      hueOffset,
      gridColor,
      seperatorColor
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const left = 0;
    const bottom = 0;
    const {
      lastAmplitudes
    } = await this.object.state.node.gets({
      lastAmplitudes: true
    }); // Background

    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    if (!lastAmplitudes) return;
    const {
      data: f
    } = lastAmplitudes;
    if (!f || !f.length || !f[0].length) return;
    const l = f[0].length;
    const channels = f.length; // Grids

    ctx.strokeStyle = gridColor;
    const vStep = 0.25;
    const hStep = 0.25;
    ctx.beginPath();
    ctx.setLineDash([]);
    const gridChannels = channels;
    const channelHeight = (height - bottom) / gridChannels;

    for (let i = 0; i < gridChannels; i++) {
      for (let j = vStep; j < 1; j += vStep) {
        // Horizontal lines
        const y = (i + j) * channelHeight;
        ctx.moveTo(left, y);
        ctx.lineTo(width, y);
      }
    }

    for (let i = hStep; i < 1; i += hStep) {
      const x = left + (width - left) * i;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, bottom);
    }

    ctx.stroke();
    ctx.beginPath();
    ctx.setLineDash([4, 2]);
    ctx.strokeStyle = seperatorColor;

    for (let i = 1; i < gridChannels; i++) {
      ctx.moveTo(left, i * channelHeight);
      ctx.lineTo(width, i * channelHeight);
    }

    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    const channelColor = []; // Horizontal Range

    const $0 = 0; // Draw start

    const $1 = l; // Draw End

    const gridX = (width - left) / ($1 - $0);
    const step = Math.max(1, Math.round(1 / gridX));

    for (let i = 0; i < f.length; i++) {
      ctx.beginPath();
      channelColor[i] = color_js__WEBPACK_IMPORTED_MODULE_0__(fgColor).shiftHue(i * hueOffset).toHSL();
      ctx.fillStyle = channelColor[i];
      let maxInStep;

      for (let j = $0; j < $1; j++) {
        const samp = Object(_utils_math__WEBPACK_IMPORTED_MODULE_5__["atodb"])(f[i][j]);
        const $step = (j - $0) % step;
        if ($step === 0) maxInStep = samp;

        if ($step !== step - 1) {
          if ($step !== 0 && samp > maxInStep) maxInStep = samp;
          continue;
        }

        const x = (j - $0) * gridX + left;
        const y = channelHeight * (i + 1 - Math.min(1, Math.max(0, maxInStep / 100 + 1)));
        if (j === $0) ctx.moveTo(x, y);else ctx.lineTo(x, y);
      }

      ctx.lineTo(width, channelHeight * (i + 1));
      ctx.lineTo(left, channelHeight * (i + 1));
      ctx.closePath();
      ctx.fill();
    }
  }

}

_defineProperty(SpectroscopeUI, "defaultSize", [120, 60]);

class Spectroscope extends _Base__WEBPACK_IMPORTED_MODULE_3__["BaseDSP"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("updateProps", props => {
      if (this.state.node) {
        const {
          parameters
        } = this.state.node;
        if (props.windowFunction) this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(props.windowFunction)]]);
        if (props.fftSize) this.applyBPF(parameters.get("fftSize"), [[props.fftSize]]);
        if (props.fftOverlap) this.applyBPF(parameters.get("fftOverlap"), [[props.fftOverlap]]);
        if (props.windowSize) this.applyBPF(parameters.get("windowSize"), [[props.windowSize]]);
      }
    });
    this.on("postInit", async () => {
      await _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__["SpectralAnalyserRegister"].register(this.audioCtx.audioWorklet);
      this.state.node = new _AudioWorklet_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__["SpectralAnalyserRegister"].Node(this.audioCtx);
      const {
        parameters
      } = this.state.node;
      this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(this.getProp("windowFunction"))]]);
      this.applyBPF(parameters.get("fftSize"), [[this.getProp("fftSize")]]);
      this.applyBPF(parameters.get("fftOverlap"), [[this.getProp("fftOverlap")]]);
      this.applyBPF(parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      this.disconnectAudioInlet();
      this.inletConnections[0] = {
        node: this.state.node,
        index: 0
      };
      this.connectAudioInlet();
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (data instanceof _Base__WEBPACK_IMPORTED_MODULE_4__["Bang"]) this.updateUI({
          paint: {}
        });
      }
    });
    this.on("destroy", () => {
      if (this.state.node) this.state.node.destroy();
    });
  }

}

_defineProperty(Spectroscope, "description", "Spectroscope");

_defineProperty(Spectroscope, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Signal"
}]);

_defineProperty(Spectroscope, "props", {
  windowSize: {
    type: "number",
    default: 1024,
    description: "Signal window size"
  },
  fftSize: {
    type: "number",
    default: 1024,
    description: "FFT Size for analysis"
  },
  fftOverlap: {
    type: "number",
    default: 2,
    description: "FFT overlap count (integer)"
  },
  windowFunction: {
    type: "enum",
    enums: ["blackman", "hamming", "hann", "triangular"],
    default: "blackman",
    description: "Window Function aoolied for FFT analysis window"
  },
  continuous: {
    type: "boolean",
    default: true,
    description: "Continuous drawing",
    isUIState: true
  },
  frameRate: {
    type: "number",
    default: 60,
    description: "UI refresh rate",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgb(40, 40, 40)",
    description: "Background color",
    isUIState: true
  },
  fgColor: {
    type: "color",
    default: "hsl(0, 100%, 85%)",
    description: "Foreground color",
    isUIState: true
  },
  hueOffset: {
    type: "number",
    default: 60,
    description: "Channel Color Hue offset",
    isUIState: true
  },
  gridColor: {
    type: "color",
    default: "#404040",
    description: "Grid color",
    isUIState: true
  },
  seperatorColor: {
    type: "color",
    default: "white",
    description: "Channel seperator color",
    isUIState: true
  }
});

_defineProperty(Spectroscope, "ui", SpectroscopeUI);

/***/ }),

/***/ "./src/core/objects/dsp/TemporalAnalyser.ts":
/*!**************************************************!*\
  !*** ./src/core/objects/dsp/TemporalAnalyser.ts ***!
  \**************************************************/
/*! exports provided: TemporalAnalyser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemporalAnalyser", function() { return TemporalAnalyser; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioWorklet/TemporalAnalyser */ "./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class TemporalAnalyser extends _Base__WEBPACK_IMPORTED_MODULE_0__["DefaultDSP"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined,
      $requestTimer: -1
    });
  }

  subscribe() {
    super.subscribe();

    const startRequest = () => {
      const request = async () => {
        if (this.state.node && !this.state.node.destroyed) {
          const extractorKeys = ["buffer", "rms", "zcr"];
          const gets = {};
          extractorKeys.forEach(key => gets[key] = this.getProp(key));
          const got = await this.state.node.gets(gets);
          this.outlet(0, got);
        }

        if (this.getProp("continuous")) scheduleRequest();
      };

      const scheduleRequest = () => {
        this.state.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
      };

      request();
    };

    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("updateProps", props => {
      if (this.state.node) {
        const {
          parameters
        } = this.state.node;
        if (props.continuous) startRequest();
        if (props.windowSize) this.applyBPF(parameters.get("windowSize"), [[props.windowSize]]);
      }
    });
    this.on("postInit", async () => {
      await _AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__["TemporalAnalyserRegister"].register(this.audioCtx.audioWorklet);
      this.state.node = new _AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__["TemporalAnalyserRegister"].Node(this.audioCtx);
      const {
        parameters
      } = this.state.node;
      this.applyBPF(parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      this.disconnectAudioInlet();
      this.inletConnections[0] = {
        node: this.state.node,
        index: 0
      };
      this.connectAudioInlet();
      if (this.getProp("continuous")) startRequest();
      this.on("inlet", e => {
        if (e.inlet === 0) {
          if (e.data instanceof _Base__WEBPACK_IMPORTED_MODULE_2__["Bang"]) startRequest();
        }
      });
    });
    this.on("destroy", () => {
      window.clearTimeout(this.state.$requestTimer);
      if (this.state.node) this.state.node.destroy();
    });
  }

}

_defineProperty(TemporalAnalyser, "description", "Temporal feature extractor");

_defineProperty(TemporalAnalyser, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Signal, bang to extract features"
}]);

_defineProperty(TemporalAnalyser, "outlets", [{
  type: "object",
  description: "Features chosen as object"
}]);

_defineProperty(TemporalAnalyser, "props", {
  speedLim: {
    type: "number",
    default: 16,
    description: "If continuous, value output speed limit in ms"
  },
  windowSize: {
    type: "number",
    default: 1024,
    description: "Buffer window size"
  },
  continuous: {
    type: "boolean",
    default: false,
    description: "Whether output is continuous"
  },
  buffer: {
    type: "boolean",
    default: false,
    description: "Getting the signal buffer"
  },
  rms: {
    type: "boolean",
    default: false,
    description: "Getting the Root Mean Square"
  },
  zcr: {
    type: "boolean",
    default: false,
    description: "Getting the zero crossing count"
  }
});

/***/ }),

/***/ "./src/core/objects/dsp/exports.ts":
/*!*****************************************!*\
  !*** ./src/core/objects/dsp/exports.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SpectralAnalyser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SpectralAnalyser */ "./src/core/objects/dsp/SpectralAnalyser.ts");
/* harmony import */ var _TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemporalAnalyser */ "./src/core/objects/dsp/TemporalAnalyser.ts");
/* harmony import */ var _Oscilloscope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Oscilloscope */ "./src/core/objects/dsp/Oscilloscope.ts");
/* harmony import */ var _Spectroscope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Spectroscope */ "./src/core/objects/dsp/Spectroscope.ts");
/* harmony import */ var _Spectrogram__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Spectrogram */ "./src/core/objects/dsp/Spectrogram.ts");





/* harmony default export */ __webpack_exports__["default"] = ({
  "temporalAnalyser~": _TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__["TemporalAnalyser"],
  "spectralAnalyser~": _SpectralAnalyser__WEBPACK_IMPORTED_MODULE_0__["SpectralAnalyser"],
  "scope~": _Oscilloscope__WEBPACK_IMPORTED_MODULE_2__["Oscilloscope"],
  "spectroscope~": _Spectroscope__WEBPACK_IMPORTED_MODULE_3__["Spectroscope"],
  "spectrogram~": _Spectrogram__WEBPACK_IMPORTED_MODULE_4__["Spectrogram"]
});

/***/ })

}]);
//# sourceMappingURL=a522a15cc5d5f384ee10.js.map