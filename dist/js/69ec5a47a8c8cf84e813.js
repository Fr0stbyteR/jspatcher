(window["webpackJsonpJSPatcher"] = window["webpackJsonpJSPatcher"] || []).push([[6],{

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

module.exports = __webpack_require__.p + "js/9e69b551a452dd7dda4f.worklet.js";

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

module.exports = __webpack_require__.p + "js/ec324d1044060ffb29bf.worklet.js";

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


class BaseDSP extends _Base__WEBPACK_IMPORTED_MODULE_0__["BaseObject"] {}

_defineProperty(BaseDSP, "package", "dsp");

_defineProperty(BaseDSP, "author", "Fr0stbyteR");

_defineProperty(BaseDSP, "version", "1.0.0");

class DefaultDSP extends _Base__WEBPACK_IMPORTED_MODULE_0__["DefaultObject"] {}

_defineProperty(DefaultDSP, "package", "dsp");

_defineProperty(DefaultDSP, "author", "Fr0stbyteR");

_defineProperty(DefaultDSP, "version", "1.0.0");

/***/ }),

/***/ "./src/core/objects/dsp/Oscilloscope.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/dsp/Oscilloscope.ts ***!
  \**********************************************/
/*! exports provided: OscilloscopeUI, Oscilloscope */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OscilloscopeUI", function() { return OscilloscopeUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Oscilloscope", function() { return Oscilloscope; });
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! color-js */ "./node_modules/color-js/color.js");
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../worklets/SpectralAnalyser */ "./src/core/worklets/SpectralAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class OscilloscopeUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_1__["CanvasUI"] {
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
      stablize,
      interleaved,
      // $cursor,
      range,
      autoRange,
      showStats,
      bgColor,
      phosphorColor,
      hueOffset,
      textColor,
      gridColor,
      seperatorColor
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const left = 0;
    const bottom = 0;
    const {
      estimatedFreq,
      buffer
    } = await this.object.state.node.gets("estimatedFreq", "buffer");
    const {
      sampleRate
    } = this.object.audioCtx; // Background

    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    if (!buffer) return;
    const {
      $: $ui32,
      data: t,
      lock
    } = buffer;
    if (!t || !t.length || !t[0].length) return;

    while (Atomics.load(lock, 0));

    Atomics.store(lock, 0, 1);
    const $ = $ui32[0];
    const channels = t.length;
    const l = t[0].length; // Vertical Range

    let min = -range;
    let max = range;
    let yFactor = range;

    if (autoRange) {
      // Fastest way to get min and max to have: 1. max abs value for y scaling, 2. mean value for zero-crossing
      let i = channels;
      let s = 0;

      while (i--) {
        let j = l;

        while (j--) {
          s = t[i][j];
          if (s < min) min = s;else if (s > max) max = s;
        }
      }

      yFactor = Math.max(1, Math.abs(min), Math.abs(max))
      /* * vzoom*/
      ;
    } // Grids


    ctx.strokeStyle = gridColor;
    let vStep = 0.25;

    while (yFactor / 2 / vStep > 2) vStep *= 2; // Minimum horizontal grids in channel one side = 2


    ctx.beginPath();
    ctx.setLineDash([]);
    const gridChannels = interleaved ? channels : 1;
    const channelHeight = (height - bottom) / gridChannels;

    for (let i = 0; i < gridChannels; i++) {
      let y = (i + 0.5) * channelHeight;
      ctx.moveTo(left, y);
      ctx.lineTo(width, y); // 0-line

      for (let j = vStep; j < yFactor; j += vStep) {
        y = (i + 0.5 + j / yFactor / 2) * channelHeight;
        ctx.moveTo(left, y);
        ctx.lineTo(width, y); // below 0

        y = (i + 0.5 - j / yFactor / 2) * channelHeight;
        ctx.moveTo(left, y);
        ctx.lineTo(width, y); // above 0
      }
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
    const channelColor = [];
    let $zerox = 0; // First Zero-crossing of first channel

    const period = sampleRate / estimatedFreq[0];
    const times = Math.floor(l / period) - 1;

    for (let i = 0; i < channels; i++) {
      // Horizontal Range
      let $0 = 0; // Draw start

      let $1 = l; // Draw End

      let drawL = l; // Length to draw

      if (stablize) {
        // Stablization
        if (i === 0) {
          const thresh = (min + max) * 0.5 + 0.001; // the zero-crossing with "offset"

          while ($zerox < l && t[i][($ + $zerox++) % l] > thresh); // Find first raise


          if ($zerox >= l - 1) {
            // Found nothing, no stablization
            $zerox = 0;
          } else {
            while ($zerox < l && t[i][($ + $zerox++) % l] < thresh); // Find first drop


            $zerox--;

            if ($zerox >= l - 1 || $zerox < 0) {
              $zerox = 0;
            }
          }
        }

        drawL = times > 0 && isFinite(period) ? ~~Math.min(period * times, l - $zerox) : l - $zerox; // length to draw
      }

      $0 = Math.round($zerox
      /* + drawL * zoomOffset*/
      );
      $1 = Math.round($zerox + drawL
      /* / zoom + drawL * zoomOffset*/
      );
      const gridX = (width - left) / ($1 - $0);
      const step = Math.max(1, Math.round(1 / gridX));
      ctx.beginPath();
      channelColor[i] = color_js__WEBPACK_IMPORTED_MODULE_0__(phosphorColor).shiftHue(i * hueOffset).toHSL();
      ctx.strokeStyle = channelColor[i];
      let maxInStep;
      let minInStep;

      for (let j = $0; j < $1; j++) {
        const $j = (j + $) % l;
        const samp = t[i][$j];
        const $step = (j - $0) % step;

        if ($step === 0) {
          maxInStep = samp;
          minInStep = samp;
        }

        if ($step !== step - 1) {
          if ($step !== 0) {
            if (samp > maxInStep) maxInStep = samp;
            if (samp < minInStep) minInStep = samp;
          }

          continue;
        }

        const x = (j - $0) * gridX + left;
        let y = channelHeight * (+interleaved * i + 0.5 - maxInStep / yFactor * 0.5);
        if (j === $0) ctx.moveTo(x, y);else ctx.lineTo(x, y);

        if (minInStep !== maxInStep) {
          y = channelHeight * (+interleaved * i + 0.5 - minInStep / yFactor * 0.5);
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    Atomics.store(lock, 0, 0); // Stats

    if (showStats) {
      ctx.font = "bold 12px Consolas, monospace";
      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(yFactor.toFixed(2), 2, 2);
      ctx.textBaseline = "bottom";
      ctx.fillText((-yFactor).toFixed(2), 2, height - 2);
      ctx.textAlign = "right";
      const freqStatY = height - 2 - (estimatedFreq.length - 1) * 14;

      for (let i = 0; i < estimatedFreq.length; i++) {
        const freq = estimatedFreq[i];
        ctx.fillStyle = channelColor[i];
        const y = interleaved ? channelHeight * (i + 1) - 2 : freqStatY + 14 * i;
        ctx.fillText(freq.toFixed(2) + "Hz", width - 2, y);
      }
    }
  }

}

_defineProperty(OscilloscopeUI, "defaultSize", [120, 60]);

class Oscilloscope extends _Base__WEBPACK_IMPORTED_MODULE_3__["BaseDSP"] {
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
      await _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__["default"].register(this.audioCtx.audioWorklet);
      this.state.node = new _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__["default"](this.audioCtx);
      const {
        parameters
      } = this.state.node;
      this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(this.getProp("windowFunction"))]]);
      this.applyBPF(parameters.get("fftSize"), [[this.getProp("fftSize")]]);
      this.applyBPF(parameters.get("fftOverlap"), [[this.getProp("fftOverlap")]]);
      this.applyBPF(parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      this.disconnectAudioInlet();
      this.inletAudioConnections[0] = {
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
        if (Object(_Base__WEBPACK_IMPORTED_MODULE_4__["isBang"])(data)) this.updateUI({
          paint: {}
        });
      }
    });
    this.on("destroy", () => {
      if (this.state.node) this.state.node.destroy();
    });
  }

}

_defineProperty(Oscilloscope, "description", "Oscilloscope");

_defineProperty(Oscilloscope, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Signal"
}]);

_defineProperty(Oscilloscope, "props", {
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
  interleaved: {
    type: "boolean",
    default: false,
    description: "Draw channels seperately",
    isUIState: true
  },
  stablize: {
    type: "boolean",
    default: true,
    description: "Stablize",
    isUIState: true
  },
  range: {
    type: "number",
    default: 1,
    description: "Vertical range",
    isUIState: true
  },
  autoRange: {
    type: "boolean",
    default: true,
    description: "Auto adjust range if > 1",
    isUIState: true
  },
  showStats: {
    type: "boolean",
    default: true,
    description: "Show stats texts",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgb(40, 40, 40)",
    description: "Background color",
    isUIState: true
  },
  phosphorColor: {
    type: "color",
    default: "hsl(0, 100%, 85%)",
    description: "Phosphor color",
    isUIState: true
  },
  hueOffset: {
    type: "number",
    default: 60,
    description: "Channel Color Hue offset",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "#DDDD99",
    description: "Info text color",
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

_defineProperty(Oscilloscope, "UI", OscilloscopeUI);

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
/* harmony import */ var _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../worklets/SpectralAnalyser */ "./src/core/worklets/SpectralAnalyser.ts");
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
          const gets = [];
          extractorKeys.forEach(key => {
            if (this.getProp(key)) gets.push(key);
          });
          const got = await this.state.node.gets(...gets);
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
      await _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__["default"].register(this.audioCtx.audioWorklet);
      this.state.node = new _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__["default"](this.audioCtx);
      const {
        parameters
      } = this.state.node;
      this.applyBPF(parameters.get("windowFunction"), [[["blackman", "hamming", "hann", "triangular"].indexOf(this.getProp("windowFunction"))]]);
      this.applyBPF(parameters.get("fftSize"), [[this.getProp("fftSize")]]);
      this.applyBPF(parameters.get("fftOverlap"), [[this.getProp("fftOverlap")]]);
      this.applyBPF(parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      this.disconnectAudioInlet();
      this.inletAudioConnections[0] = {
        node: this.state.node,
        index: 0
      };
      this.connectAudioInlet();
      if (this.getProp("continuous")) startRequest();
      this.on("inlet", e => {
        if (e.inlet === 0) {
          if (Object(_Base__WEBPACK_IMPORTED_MODULE_2__["isBang"])(e.data)) startRequest();
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
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: D:\\p\\jspatcher\\src\\core\\objects\\dsp\\Spectrogram.ts: Unterminated string constant (61:68)\n\n\u001b[0m \u001b[90m 59 | \u001b[39m        \u001b[36mconst\u001b[39m bottom \u001b[33m=\u001b[39m \u001b[35m0\u001b[39m\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 60 | \u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 61 | \u001b[39m        \u001b[36mconst\u001b[39m { allAmplitudes } \u001b[33m=\u001b[39m await \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mobject\u001b[33m.\u001b[39mstate\u001b[33m.\u001b[39mnode\u001b[33m.\u001b[39mgets(\u001b[32m\"allAmplitudes: true });\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m    | \u001b[39m                                                                    \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 62 | \u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 63 | \u001b[39m        \u001b[90m// Background\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 64 | \u001b[39m\u001b[0m\n    at Object._raise (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:748:17)\n    at Object.raiseWithData (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:741:17)\n    at Object.raise (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:735:17)\n    at Object.readString (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:8724:20)\n    at Object.getTokenFromCode (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:8362:14)\n    at Object.getTokenFromCode (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:7251:20)\n    at Object.nextToken (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:7889:12)\n    at Object.next (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:7819:10)\n    at Object.parseCoverCallAndAsyncArrowHead (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10243:10)\n    at Object.parseSubscript (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10194:19)\n    at Object.parseSubscript (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:6675:18)\n    at Object.parseSubscripts (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10167:19)\n    at Object.parseExprSubscripts (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10156:17)\n    at Object.parseUpdate (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10130:21)\n    at Object.parseMaybeUnary (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10119:17)\n    at Object.parseMaybeUnary (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:7126:20)\n    at Object.parseAwait (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11421:28)\n    at Object.parseMaybeUnary (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10085:19)\n    at Object.parseMaybeUnary (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:7126:20)\n    at Object.parseExprOps (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:9989:23)\n    at Object.parseMaybeConditional (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:9963:23)\n    at Object.parseMaybeAssign (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:9926:21)\n    at Object.parseMaybeAssign (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:7071:20)\n    at D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:9893:39\n    at Object.allowInAnd (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11541:16)\n    at Object.parseMaybeAssignAllowIn (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:9893:17)\n    at Object.parseVar (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12339:70)\n    at Object.parseVarStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12151:10)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11743:21)\n    at Object.parseStatementContent (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:6806:18)\n    at Object.parseStatement (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11676:17)\n    at Object.parseBlockOrModuleBlockBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12258:25)\n    at Object.parseBlockBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12249:10)\n    at Object.parseBlock (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:12233:10)\n    at Object.parseFunctionBody (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11221:24)\n    at Object.parseFunctionBodyAndFinish (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11205:10)");

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
      this.inletAudioConnections[0] = {
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
        if (Object(_Base__WEBPACK_IMPORTED_MODULE_4__["isBang"])(data)) this.updateUI({
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

_defineProperty(Spectroscope, "UI", SpectroscopeUI);

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
      this.inletAudioConnections[0] = {
        node: this.state.node,
        index: 0
      };
      this.connectAudioInlet();
      if (this.getProp("continuous")) startRequest();
      this.on("inlet", e => {
        if (e.inlet === 0) {
          if (Object(_Base__WEBPACK_IMPORTED_MODULE_2__["isBang"])(e.data)) startRequest();
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

/***/ }),

/***/ "./src/core/worklets/SpectralAnalyser.ts":
/*!***********************************************!*\
  !*** ./src/core/worklets/SpectralAnalyser.ts ***!
  \***********************************************/
/*! exports provided: processorID, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processorID", function() { return processorID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SpectralAnalyserNode; });
/* harmony import */ var _SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SpectralAnalyser.worklet.ts */ "./src/core/worklets/SpectralAnalyser.worklet.ts");
/* harmony import */ var _SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioWorkletProxyNode */ "./src/core/worklets/AudioWorkletProxyNode.ts");
/* harmony import */ var _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioWorkletRegister */ "./src/core/worklets/AudioWorkletRegister.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // eslint-disable-line import/extensions



const processorID = "__JSPatcher_SpectralAnalyser";
class SpectralAnalyserNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(context) {
    super(context, processorID, {
      numberOfInputs: 1,
      numberOfOutputs: 0
    });
    const _destroy = this.destroy;

    this.destroy = async () => {
      await _destroy.call(this);
      this.port.close();
    };
  }

}

_defineProperty(SpectralAnalyserNode, "processorID", processorID);

_defineProperty(SpectralAnalyserNode, "register", audioWorklet => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__["default"].register(audioWorklet, processorID, _SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default.a));

_defineProperty(SpectralAnalyserNode, "fnNames", ["getBuffer", "getLastAmplitudes", "getAllAmplitudes", "getAllAmplitudes", "getEstimatedFreq", "getCentroid", "getFlatness", "getFlux", "getKurtosis", "getSkewness", "getRolloff", "getSlope", "getSpread", "gets", "destroy"]);

/***/ }),

/***/ "./src/core/worklets/SpectralAnalyser.worklet.ts":
/*!*******************************************************!*\
  !*** ./src/core/worklets/SpectralAnalyser.worklet.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "js/ad4c614a09f39bccddfc.worklet.js";

/***/ })

}]);
//# sourceMappingURL=69ec5a47a8c8cf84e813.js.map