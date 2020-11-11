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

/***/ "./src/core/objects/live/Base.tsx":
/*!****************************************!*\
  !*** ./src/core/objects/live/Base.tsx ***!
  \****************************************/
/*! exports provided: getDisplayValue, LiveUI, LiveObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDisplayValue", function() { return getDisplayValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveUI", function() { return LiveUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveObject", function() { return LiveObject; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





const getDisplayValue = (value, type, unitstyle, units, enums) => {
  if (type === "enum") return enums[value];
  if (unitstyle === "int") return value.toFixed(0);
  if (unitstyle === "float") return value.toFixed(2);
  if (unitstyle === "time") return value.toFixed(type === "int" ? 0 : 2) + " ms";
  if (unitstyle === "hertz") return value.toFixed(type === "int" ? 0 : 2) + " Hz";
  if (unitstyle === "decibel") return value.toFixed(type === "int" ? 0 : 2) + " dB";
  if (unitstyle === "%") return value.toFixed(type === "int" ? 0 : 2) + " %";
  if (unitstyle === "pan") return value === 0 ? "C" : (type === "int" ? Math.abs(value) : Math.abs(value).toFixed(2)) + (value < 0 ? " L" : " R");
  if (unitstyle === "semitones") return value.toFixed(type === "int" ? 0 : 2) + " st";
  if (unitstyle === "midi") return Object(_utils_math__WEBPACK_IMPORTED_MODULE_1__["toMIDI"])(value);
  if (unitstyle === "custom") return value.toFixed(type === "int" ? 0 : 2) + " " + units;
  if (unitstyle === "native") return value.toFixed(type === "int" ? 0 : 2);
  return "N/A";
};
class LiveUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_3__["CanvasUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", void 0);

    _defineProperty(this, "$changeTimer", -1);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      value: this.object.state.value
    }));

    _defineProperty(this, "handleKeyDown", e => {});

    _defineProperty(this, "handleKeyUp", e => {});

    _defineProperty(this, "handleTouchStart", e => {
      this.canvas.focus();
      const rect = this.canvas.getBoundingClientRect();
      let prevX = e.touches[0].clientX;
      let prevY = e.touches[0].clientY;
      const fromX = prevX - rect.left;
      const fromY = prevY - rect.top;
      const prevValue = this.state.value;
      this.handlePointerDown({
        x: fromX,
        y: fromY,
        originalEvent: e
      });

      const handleTouchMove = e => {
        e.preventDefault();
        const clientX = e.changedTouches[0].clientX;
        const clientY = e.changedTouches[0].clientY;
        const movementX = clientX - prevX;
        const movementY = clientY - prevY;
        prevX = clientX;
        prevY = clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        this.handlePointerDrag({
          prevValue,
          x,
          y,
          fromX,
          fromY,
          movementX,
          movementY,
          originalEvent: e
        });
      };

      const handleTouchEnd = e => {
        e.preventDefault();
        const x = e.changedTouches[0].clientX - rect.left;
        const y = e.changedTouches[0].clientY - rect.top;
        this.handlePointerUp({
          x,
          y,
          originalEvent: e
        });
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false
      });
      document.addEventListener("touchend", handleTouchEnd, {
        passive: false
      });
    });

    _defineProperty(this, "handleWheel", e => {});

    _defineProperty(this, "handleClick", e => {});

    _defineProperty(this, "handleMouseDown", e => {
      e.preventDefault();
      this.canvas.focus();
      const rect = this.canvas.getBoundingClientRect();
      const fromX = e.clientX - rect.left;
      const fromY = e.clientY - rect.top;
      const prevValue = this.state.value;
      this.handlePointerDown({
        x: fromX,
        y: fromY,
        originalEvent: e
      });

      const handleMouseMove = e => {
        e.preventDefault();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.handlePointerDrag({
          prevValue,
          x,
          y,
          fromX,
          fromY,
          movementX: e.movementX,
          movementY: e.movementY,
          originalEvent: e
        });
      };

      const handleMouseUp = e => {
        e.preventDefault();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.handlePointerUp({
          x,
          y,
          originalEvent: e
        });
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });

    _defineProperty(this, "handleMouseOver", e => {});

    _defineProperty(this, "handleMouseOut", e => {});

    _defineProperty(this, "handleContextMenu", e => {});

    _defineProperty(this, "handlePointerDown", e => {});

    _defineProperty(this, "handlePointerDrag", e => {});

    _defineProperty(this, "handlePointerUp", e => {});

    _defineProperty(this, "handleFocusIn", e => this.setState({
      focus: true
    }));

    _defineProperty(this, "handleFocusOut", e => this.setState({
      focus: false
    }));

    _defineProperty(this, "changeCallback", () => {
      this.props.object.onChangeFromUI({
        value: this.state.value,
        displayValue: this.displayValue
      });
      this.$changeTimer = -1;
    });
  }

  /**
   * Normalized value between 0 - 1.
   *
   * @readonly
   * @memberof LiveUI
   */
  get distance() {
    return LiveUI.getDistance(this.state);
  }

  static getDistance(state) {
    const {
      type,
      max,
      min,
      value,
      exponent,
      enums
    } = state;
    const normalized = type === "enum" ? Math.max(0, Math.min(enums.length - 1, value)) / (enums.length - 1) : (Math.max(min, Math.min(max, value)) - min) / (max - min);
    return Object(_utils_math__WEBPACK_IMPORTED_MODULE_1__["iNormExp"])(normalized || 0, exponent);
  }
  /**
   * Count steps in range min-max with step
   *
   * @readonly
   * @memberof LiveUI
   */


  get stepsCount() {
    const {
      type,
      max,
      min,
      step,
      enums
    } = this.state;
    if (type === "enum") return enums.length - 1;
    if (type === "float") return Math.min(Number.MAX_SAFE_INTEGER, Math.floor((max - min) / step));
    return Math.min(Math.floor((max - min) / (Math.round(step) || 1)), max - min);
  }

  get displayValue() {
    const {
      value,
      type,
      unitStyle,
      units,
      enums
    } = this.state;
    return getDisplayValue(value, type, unitStyle, units, enums);
  }

  setValueToOutput(value) {
    this.setState({
      value
    });
    this.scheduleChangeHandler();
  }

  scheduleChangeHandler() {
    if (this.$changeTimer === -1) this.$changeTimer = window.setTimeout(this.changeCallback, this.state.speedLim);
  }

  paint() {}

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_BaseUI__WEBPACK_IMPORTED_MODULE_3__["BaseUI"], this.props, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("canvas", _extends({
      ref: this.refCanvas,
      className: ["live-component", this.className].join(" "),
      style: {
        position: "absolute",
        display: "inline-block",
        width: "100%",
        height: "100%"
      },
      tabIndex: 1,
      onKeyDown: this.handleKeyDown,
      onKeyUp: this.handleKeyUp,
      onTouchStart: this.handleTouchStart,
      onWheel: this.handleWheel,
      onClick: this.handleClick,
      onMouseDown: this.handleMouseDown,
      onMouseOver: this.handleMouseOver,
      onMouseOut: this.handleMouseOut,
      onContextMenu: this.handleContextMenu,
      onFocus: this.handleFocusIn,
      onBlur: this.handleFocusOut
    }, this.props.canvasProps)));
  }

}
class LiveObject extends _Base__WEBPACK_IMPORTED_MODULE_2__["BaseAudioObject"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      value: 0,
      displayValue: "0"
    });
  }

  /**
   * Get a nearest valid number
   *
   * @returns {number}
   * @memberof LiveObject
   */
  toValidValue(value) {
    const min = this.getProp("min");
    const max = this.getProp("max");
    const step = this.getProp("step");
    const v = Math.min(max, Math.max(min, value));
    return min + Math.floor((v - min) / step) * step;
  }

  toDisplayValue(value) {
    const {
      type,
      unitStyle,
      units,
      enums
    } = this.props;
    return getDisplayValue(value, type, unitStyle, units, enums);
  }

  validateValue() {
    this.state.value = this.toValidValue(this.state.value);
    this.state.displayValue = this.toDisplayValue(this.state.value);
  }

  onChangeFromUI(e) {
    this.emit("changeFromUI", e);
  }

  subscribe() {
    super.subscribe();
    this.on("updateProps", props => {
      if (typeof props.max !== "undefined" || typeof props.min !== "undefined" || typeof props.step !== "undefined") {
        const lastValue = this.state.value;
        this.validateValue();
        if (lastValue !== this.state.value) this.updateUI({
          value: this.state.value
        });
      }
    });
  }

}

_defineProperty(LiveObject, "package", "live");

_defineProperty(LiveObject, "author", "Fr0stbyteR");

_defineProperty(LiveObject, "version", "1.0.0");

_defineProperty(LiveObject, "description", "Ab**ton Live User ?");

_defineProperty(LiveObject, "props", {
  /*
  value: {
  type: "number",
  default: 0,
  description: "Initial value",
  isUIState: true
  },*/
  min: {
    type: "number",
    default: 0,
    description: "Minimum value",
    isUIState: true
  },
  max: {
    type: "number",
    default: 127,
    description: "Maximum value",
    isUIState: true
  },
  step: {
    type: "number",
    default: 1,
    description: "Value change step",
    isUIState: true
  },
  type: {
    type: "enum",
    enums: ["enum", "float", "int"],
    default: "int",
    description: "Value type",
    isUIState: true
  },
  enums: {
    type: "object",
    default: [""],
    description: "Enum values",
    isUIState: true
  },
  active: {
    type: "boolean",
    default: true,
    description: "Active state",
    isUIState: true
  },
  focus: {
    type: "boolean",
    default: false,
    description: "Focus state",
    isUIState: true
  },
  shortName: {
    type: "string",
    default: "",
    description: "Short name to display",
    isUIState: true
  },
  longName: {
    type: "string",
    default: "",
    description: "Long name to display",
    isUIState: true
  },
  unitStyle: {
    type: "enum",
    enums: ["float", "int", "time", "hertz", "decibel", "%", "pan", "semitones", "midi", "custom", "native"],
    default: "int",
    description: "Style of unit to display",
    isUIState: true
  },
  units: {
    type: "string",
    default: "",
    description: "If unitStyle set to custom, display this as unit",
    isUIState: true
  },
  exponent: {
    type: "number",
    default: 0,
    description: "UI modulation bpf, 0 for linear",
    isUIState: true
  },
  speedLim: {
    type: "number",
    default: 16,
    description: "Value output speed limit in ms",
    isUIState: true
  },
  frameRate: {
    type: "number",
    default: 60,
    description: "UI refresh rate",
    isUIState: true
  }
});

_defineProperty(LiveObject, "ui", void 0);

/***/ }),

/***/ "./src/core/objects/live/button.tsx":
/*!******************************************!*\
  !*** ./src/core/objects/live/button.tsx ***!
  \******************************************/
/*! exports provided: LiveButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveButton", function() { return LiveButton; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class LiveButtonUI extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "live-button");

    _defineProperty(this, "inTouch", false);

    _defineProperty(this, "$resetTimer", -1);

    _defineProperty(this, "resetCallback", () => {
      this.setValueToOutput(0);
      this.$resetTimer = -1;
    });

    _defineProperty(this, "handlePointerDown", () => {
      this.inTouch = true;
      this.setValueToOutput(1);
    });

    _defineProperty(this, "handlePointerUp", () => {
      this.inTouch = false;
      this.setValueToOutput(0);
    });
  }

  paint() {
    if (this.$resetTimer !== -1) {
      window.clearTimeout(this.$resetTimer);
      this.resetCallback();
    }

    const {
      // width,
      // height,
      active,
      focus,
      bgColor,
      activeBgColor,
      bgOnColor,
      activeBgOnColor,
      borderColor,
      focusBorderColor,
      value
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const borderWidth = 1;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = borderWidth;
    const buttonBgColor = active ? value ? activeBgOnColor : activeBgColor : value ? bgOnColor : bgColor;
    const buttonBorderColor = focus ? focusBorderColor : borderColor;
    ctx.fillStyle = buttonBgColor;
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.5, width * 0.5 - 2 * borderWidth, height * 0.5 - 2 * borderWidth, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = buttonBorderColor;
    ctx.stroke();
    if (value && !this.inTouch) this.$resetTimer = window.setTimeout(this.resetCallback, 100);
  }

}

_defineProperty(LiveButtonUI, "defaultSize", [30, 30]);

class LiveButton extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      this.state.value = +!!args[0];
      this.validateValue();
      this.updateUI({
        value: this.state.value
      });
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        this.state.value = +!!data;
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
        this.outlet(1, this.state.value);
        if (this.state.value && this.getProp("transition") !== "One->Zero") this.outlet(0, new _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"]());
      }
    });
    this.on("changeFromUI", (_ref2) => {
      let {
        value
      } = _ref2;
      const lastValue = this.state.value;
      this.state.value = value;
      this.validateValue();
      this.outlet(1, value);
      const transition = this.getProp("transition");
      const b01 = transition !== "One->Zero";
      const b10 = transition !== "Zero->One";
      if (b01 && lastValue < this.state.value || b10 && lastValue > this.state.value) this.outlet(0, new _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"]());
    });
  }

}

_defineProperty(LiveButton, "description", "Button");

_defineProperty(LiveButton, "inlets", [{
  isHot: true,
  type: "number",
  description: "Output a bang following transition prop."
}]);

_defineProperty(LiveButton, "outlets", [{
  type: "bang",
  description: "Bang"
}, {
  type: "number",
  description: "Current value"
}]);

_defineProperty(LiveButton, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}]);

_defineProperty(LiveButton, "props", {
  shortName: {
    type: "string",
    default: "live.button",
    description: "Short name to display",
    isUIState: true
  },
  longName: {
    type: "string",
    default: "live.button",
    description: "Long name to display",
    isUIState: true
  },
  max: {
    type: "number",
    default: 1,
    description: "Maximum value",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgba(90, 90, 90, 1)",
    description: "Background color (inactive)",
    isUIState: true
  },
  activeBgColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Background color (active)",
    isUIState: true
  },
  bgOnColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Background color (on / inactive)",
    isUIState: true
  },
  activeBgOnColor: {
    type: "color",
    default: "rgba(109, 215, 255, 1)",
    description: "Background color (on / active)",
    isUIState: true
  },
  borderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (unfocus)",
    isUIState: true
  },
  focusBorderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (focus)",
    isUIState: true
  },
  transition: {
    type: "enum",
    enums: ["Zero->One", "One->Zero", "Both"],
    default: "Zero->One",
    description: "Specifies when a bang message will be sent to the outlet"
  }
});

_defineProperty(LiveButton, "ui", LiveButtonUI);

/***/ }),

/***/ "./src/core/objects/live/dial.tsx":
/*!****************************************!*\
  !*** ./src/core/objects/live/dial.tsx ***!
  \****************************************/
/*! exports provided: LiveDial */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveDial", function() { return LiveDial; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class LiveDialUI extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      inputBuffer: ""
    }));

    _defineProperty(this, "className", "live-dial");

    _defineProperty(this, "interactionRect", [0, 0, 0, 0]);

    _defineProperty(this, "inTouch", false);

    _defineProperty(this, "handlePointerDown", e => {
      if (e.x < this.interactionRect[0] || e.x > this.interactionRect[0] + this.interactionRect[2] || e.y < this.interactionRect[1] || e.y > this.interactionRect[1] + this.interactionRect[3]) return;
      this.inTouch = true;
    });

    _defineProperty(this, "handlePointerDrag", e => {
      if (!this.inTouch) return;
      const newValue = this.getValueFromDelta(e);
      if (newValue !== this.state.value) this.setValueToOutput(newValue);
    });

    _defineProperty(this, "handlePointerUp", () => {
      this.inTouch = false;
    });

    _defineProperty(this, "handleKeyDown", e => {
      if (!this.state.inputBuffer) {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") addStep = -1;

        if (addStep !== 0) {
          const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
          if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
      }

      if (e.key.match(/[0-9.-]/)) {
        this.setState({
          inputBuffer: this.state.inputBuffer + e.key
        });
        return;
      }

      if (e.key === "Backspace") {
        this.setState({
          inputBuffer: this.state.inputBuffer.slice(0, -1)
        });
        return;
      }

      if (e.key === "Enter") {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({
          inputBuffer: ""
        });
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }
    });

    _defineProperty(this, "handleFocusOut", () => {
      if (this.state.inputBuffer) {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({
          inputBuffer: ""
        });
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }

      this.setState({
        focus: false
      });
    });
  }

  paint() {
    const {
      // width,
      // height,
      active,
      focus,
      fontFamily,
      fontSize,
      fontFace,
      appearance,
      triangle,
      showName,
      showNumber,
      borderColor,
      focusBorderColor,
      panelColor,
      activeNeedleColor,
      needleColor,
      activeDialColor,
      dialColor,
      textColor,
      triBorderColor,
      triColor,
      shortName,
      inputBuffer
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const distance = this.distance;
    const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    const triangleHeight = 4;
    const triangleLineWidth = 0.6;
    let start;
    let end;
    let valPos;
    let dialHeight;

    if (appearance === "tiny") {
      dialHeight = 18;
      start = -3 * Math.PI * 0.5;
      end = 0;
      valPos = start + Object(_utils_math__WEBPACK_IMPORTED_MODULE_3__["toRad"])(this.distance * 270);
    } else {
      dialHeight = 25;
      start = Math.PI - 3 * Math.PI / 8;
      end = 2 * Math.PI + 3 * Math.PI / 8;
      valPos = start + Object(_utils_math__WEBPACK_IMPORTED_MODULE_3__["toRad"])(this.distance * 315);
    }

    const dialRadius = dialHeight * 0.5;
    let dialCenterX = width * 0.5;
    let dialCenterY = height * 0.5 + 1;

    if (appearance === "panel") {
      dialCenterY += 10;
    } else if (appearance === "vertical") {
      if (showNumber) dialCenterY -= fontSize - 5;
      if (showName) dialCenterY += fontSize - 5;
      if (triangle) dialCenterY += triangleHeight - 1;
    } else if (appearance === "tiny") {
      if (showName) {
        dialCenterY += 6;
        dialCenterX = 10;
      }
    }

    this.interactionRect = [0, dialCenterY - dialHeight * 0.5, width, dialHeight];
    const arcStartX = dialCenterX + dialHeight * 0.5 * Math.cos(start);
    const arcStartY = dialCenterY + dialHeight * 0.5 * Math.sin(start);
    const arcEndX = dialCenterX + dialHeight * 0.5 * Math.cos(end);
    const arcEndY = dialCenterY + dialHeight * 0.5 * Math.sin(end);
    const valuePosX = dialCenterX + dialHeight * 0.5 * Math.cos(valPos);
    const valuePosY = dialCenterY + dialHeight * 0.5 * Math.sin(valPos);
    const endCapRadius = 1;
    const lineWidth = 2;
    let panelOffset = 0;

    if (appearance === "panel") {
      panelOffset = 5;
      ctx.strokeStyle = focus ? focusBorderColor : borderColor;
      ctx.lineWidth = 0.4;
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["roundedRect"])(ctx, 1, 1, width - 2, height - 2, 5);
      ctx.fillStyle = panelColor;
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["fillRoundedRect"])(ctx, 1.2, 1.2, width - 2.4, 30 - 0.4, [5, 5, 0, 0]);
    }

    ctx.strokeStyle = active ? activeNeedleColor : needleColor;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = lineWidth; // draw background arc endcaps

    ctx.beginPath();
    ctx.arc(arcStartX, arcStartY, endCapRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(arcEndX, arcEndY, endCapRadius, 0, 2 * Math.PI);
    ctx.fill(); // draw background arc

    ctx.beginPath();
    ctx.arc(dialCenterX, dialCenterY, dialRadius, start, end);
    ctx.stroke(); // draw value arc, which changes if triangle is enabled

    ctx.strokeStyle = active ? activeDialColor : dialColor;
    ctx.fillStyle = ctx.strokeStyle;

    if (triangle) {
      const midpoint = (start + end) * 0.5;
      ctx.strokeStyle = active ? activeDialColor : dialColor;
      ctx.beginPath();
      if (distance > 0.5) ctx.arc(dialCenterX, dialCenterY, dialRadius, midpoint, valPos);else ctx.arc(dialCenterX, dialCenterY, dialRadius, valPos, midpoint);
      ctx.stroke();
    } else {
      // draw value arc endcap
      ctx.beginPath();
      ctx.arc(arcStartX, arcStartY, endCapRadius, 0, 2 * Math.PI);
      ctx.fill(); // draw value arc

      ctx.beginPath();
      ctx.arc(dialCenterX, dialCenterY, dialRadius, start, valPos);
      ctx.stroke();
    } // draw dial
    // draw dial round endcaps


    ctx.strokeStyle = active ? activeNeedleColor : needleColor;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(dialCenterX, dialCenterY, endCapRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(valuePosX, valuePosY, endCapRadius, 0, 2 * Math.PI);
    ctx.fill(); // draw dial line

    ctx.beginPath();
    ctx.moveTo(dialCenterX, dialCenterY);
    ctx.lineTo(valuePosX, valuePosY);
    ctx.stroke(); // add text if it is enabled

    ctx.font = "".concat(fontFace === "regular" ? "" : fontFace, " ").concat(fontSize, "px ").concat(fontFamily, ", sans-serif");
    ctx.fillStyle = textColor;

    if (showName) {
      if (appearance === "tiny") {
        ctx.textAlign = "left";
        ctx.fillText(shortName, 0, panelOffset + fontSize, width);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(shortName, width * 0.5, panelOffset + fontSize, width);
      }
    }

    if (showNumber) {
      const tinyOffset = appearance === "tiny" ? 12 : 0;

      if (appearance === "tiny") {
        ctx.textAlign = "left";
        ctx.fillText(displayValue, tinyOffset, height - 2, width);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(displayValue, width * 0.5, height - 2, width);
      }
    } // draw triangle if it is enabled


    if (triangle) {
      if (!distance) ctx.fillStyle = triColor;else if (!active) ctx.fillStyle = dialColor;else ctx.fillStyle = activeDialColor;
      ctx.beginPath();

      if (appearance === "tiny") {
        const tipPositionX = dialCenterX + dialHeight * 0.5 * Math.cos(-3 * Math.PI / 4) - 1;
        const tipPositionY = dialCenterY + dialHeight * 0.5 * Math.sin(-3 * Math.PI / 4) - 1;
        ctx.moveTo(tipPositionX, tipPositionY);
        ctx.lineTo(tipPositionX - triangleHeight, tipPositionY);
        ctx.lineTo(tipPositionX, tipPositionY - triangleHeight);
        ctx.lineTo(tipPositionX, tipPositionY);
      } else {
        ctx.moveTo(dialCenterX, dialCenterY - dialRadius - 1);
        ctx.lineTo(dialCenterX - triangleHeight, dialCenterY - dialRadius - 1 - triangleHeight);
        ctx.lineTo(dialCenterX + triangleHeight, dialCenterY - dialRadius - 1 - triangleHeight);
        ctx.lineTo(dialCenterX, dialCenterY - dialRadius - 1);
      }

      ctx.fill();
      ctx.strokeStyle = triBorderColor || "transparent";
      ctx.lineWidth = triangleLineWidth;
      ctx.stroke();
    }
  }

  getValueFromDelta(e) {
    const {
      type,
      min,
      max,
      enums,
      exponent
    } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = 100;
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const prevPixels = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
      value: e.prevValue,
      type,
      min,
      max,
      enums,
      exponent
    }) * totalPixels;
    const pixels = prevPixels + e.fromY - e.y;
    let steps = Math.round(Object(_utils_math__WEBPACK_IMPORTED_MODULE_3__["normExp"])(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum") return steps;
    if (type === "int") return Math.round(steps * step + min);
    return steps * step + min;
  }

}

_defineProperty(LiveDialUI, "defaultSize", [45, 60]);

class LiveDial extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        this.state.value = args[0];
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) {
          const value = +data;
          this.state.value = value;
          this.validateValue();
          this.updateUI({
            value: this.state.value
          });
        }

        this.outletAll([this.state.value, this.state.displayValue]);
      } else if (inlet === 1) {
        const value = +data;
        this.state.value = value;
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("changeFromUI", (_ref2) => {
      let {
        value,
        displayValue
      } = _ref2;
      this.state.value = value;
      this.state.displayValue = displayValue;
      this.outletAll([this.state.value, this.state.displayValue]);
    });
  }

}

_defineProperty(LiveDial, "description", "Dial knob");

_defineProperty(LiveDial, "inlets", [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}]);

_defineProperty(LiveDial, "outlets", [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}]);

_defineProperty(LiveDial, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}]);

_defineProperty(LiveDial, "props", {
  shortName: {
    type: "string",
    default: "live.dial",
    description: "Short name to display",
    isUIState: true
  },
  longName: {
    type: "string",
    default: "live.dial",
    description: "Long name to display",
    isUIState: true
  },
  borderColor: {
    type: "color",
    default: "rgba(90, 90, 90, 1)",
    description: "Border color (unfocus)",
    isUIState: true
  },
  focusBorderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (focus)",
    isUIState: true
  },
  dialColor: {
    type: "color",
    default: "rgba(109, 215, 255, 1)",
    description: "Dial color (inactive)",
    isUIState: true
  },
  activeDialColor: {
    type: "color",
    default: "rgba(109, 215, 255, 1)",
    description: "Dial color (active)",
    isUIState: true
  },
  needleColor: {
    type: "color",
    default: "rgba(105, 105, 105, 1)",
    description: "Needle color (inactive)",
    isUIState: true
  },
  activeNeedleColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Needle color (active)",
    isUIState: true
  },
  panelColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Panel color",
    isUIState: true
  },
  triBorderColor: {
    type: "color",
    default: "rgba(50, 50, 50, 1)",
    description: "Triangle border color",
    isUIState: true
  },
  triColor: {
    type: "color",
    default: "rgba(40, 40, 40, 1)",
    description: "Triangle color (inactive)",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "rgba(255, 255, 255, 1)",
    description: "Text color",
    isUIState: true
  },
  fontFamily: {
    type: "enum",
    enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
    default: "Arial",
    description: "Font family",
    isUIState: true
  },
  fontSize: {
    type: "number",
    default: 10,
    description: "Text font size",
    isUIState: true
  },
  fontFace: {
    type: "enum",
    enums: ["regular", "bold", "italic", "bold italic"],
    default: "regular",
    description: "Text style",
    isUIState: true
  },
  appearance: {
    type: "enum",
    enums: ["vertical", "tiny", "panel"],
    default: "vertical",
    description: "Dial style",
    isUIState: true
  },
  showName: {
    type: "boolean",
    default: true,
    description: "Display name",
    isUIState: true
  },
  showNumber: {
    type: "boolean",
    default: true,
    description: "Display number as text",
    isUIState: true
  },
  triangle: {
    type: "boolean",
    default: false,
    description: "Display yriangle",
    isUIState: true
  }
});

_defineProperty(LiveDial, "ui", LiveDialUI);

/***/ }),

/***/ "./src/core/objects/live/exports.ts":
/*!******************************************!*\
  !*** ./src/core/objects/live/exports.ts ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _numbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./numbox */ "./src/core/objects/live/numbox.tsx");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button */ "./src/core/objects/live/button.tsx");
/* harmony import */ var _dial__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dial */ "./src/core/objects/live/dial.tsx");
/* harmony import */ var _slider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./slider */ "./src/core/objects/live/slider.tsx");
/* harmony import */ var _tab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tab */ "./src/core/objects/live/tab.tsx");
/* harmony import */ var _toggle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./toggle */ "./src/core/objects/live/toggle.tsx");
/* harmony import */ var _text__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./text */ "./src/core/objects/live/text.tsx");
/* harmony import */ var _meter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./meter */ "./src/core/objects/live/meter.tsx");
/* harmony import */ var _gain__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./gain */ "./src/core/objects/live/gain.tsx");









/* harmony default export */ __webpack_exports__["default"] = ({
  numbox: _numbox__WEBPACK_IMPORTED_MODULE_0__["LiveNumbox"],
  button: _button__WEBPACK_IMPORTED_MODULE_1__["LiveButton"],
  dial: _dial__WEBPACK_IMPORTED_MODULE_2__["LiveDial"],
  slider: _slider__WEBPACK_IMPORTED_MODULE_3__["LiveSlider"],
  tab: _tab__WEBPACK_IMPORTED_MODULE_4__["LiveTab"],
  toggle: _toggle__WEBPACK_IMPORTED_MODULE_5__["LiveToggle"],
  text: _text__WEBPACK_IMPORTED_MODULE_6__["LiveText"],
  "meter~": _meter__WEBPACK_IMPORTED_MODULE_7__["LiveMeter"],
  "gain~": _gain__WEBPACK_IMPORTED_MODULE_8__["LiveGain"]
});

/***/ }),

/***/ "./src/core/objects/live/gain.tsx":
/*!****************************************!*\
  !*** ./src/core/objects/live/gain.tsx ***!
  \****************************************/
/*! exports provided: LiveGain */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveGain", function() { return LiveGain; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _dsp_AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dsp/AudioWorklet/TemporalAnalyser */ "./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.ts");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class LiveGainUI extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      levels: [],
      inputBuffer: ""
    }));

    _defineProperty(this, "className", "live-gain");

    _defineProperty(this, "interactionRect", [0, 0, 0, 0]);

    _defineProperty(this, "inTouch", false);

    _defineProperty(this, "levels", []);

    _defineProperty(this, "maxValues", []);

    _defineProperty(this, "maxTimer", void 0);

    _defineProperty(this, "handlePointerDown", e => {
      if (e.x < this.interactionRect[0] || e.x > this.interactionRect[0] + this.interactionRect[2] || e.y < this.interactionRect[1] || e.y > this.interactionRect[1] + this.interactionRect[3]) return;

      if (!this.state.relative) {
        const newValue = this.getValueFromPos(e);
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }

      this.inTouch = true;
    });

    _defineProperty(this, "handlePointerDrag", e => {
      if (!this.inTouch) return;
      let newValue;
      if (this.state.relative) newValue = this.getValueFromDelta(e);else newValue = this.getValueFromPos(e);
      if (newValue !== this.state.value) this.setValueToOutput(newValue);
    });

    _defineProperty(this, "handlePointerUp", () => {
      this.inTouch = false;
    });

    _defineProperty(this, "handleKeyDown", e => {
      if (!this.state.inputBuffer) {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") addStep = -1;

        if (addStep !== 0) {
          const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
          if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
      }

      if (e.key.match(/[0-9.-]/)) {
        this.setState({
          inputBuffer: this.state.inputBuffer + e.key
        });
        return;
      }

      if (e.key === "Backspace") {
        this.setState({
          inputBuffer: this.state.inputBuffer.slice(0, -1)
        });
        return;
      }

      if (e.key === "Enter") {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({
          inputBuffer: ""
        });
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }
    });

    _defineProperty(this, "handleFocusOut", () => {
      if (this.state.inputBuffer) {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({
          inputBuffer: ""
        });
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }

      this.setState({
        focus: false
      });
    });
  }

  paint() {
    const {
      // width,
      // height,
      fontFamily,
      fontSize,
      fontFace,
      orientation,
      showName,
      showNumber,
      textColor,
      triBorderColor,
      triOnColor,
      triColor,
      shortName,
      levels,
      min,
      max,
      exponent,
      active,
      mode,
      bgColor,
      coldColor,
      warmColor,
      hotColor,
      overloadColor,
      inactiveColdColor,
      inactiveWarmColor,
      inputBuffer
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const lineWidth = 0.5;
    const padding = 8;
    const distance = this.distance;
    const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    this.levels = levels.slice();
    if (this.levels.length === 0) this.levels = [min];

    if (this.levels.find((v, i) => typeof this.maxValues[i] === "undefined" || v > this.maxValues[i])) {
      this.maxValues = [...this.levels];
      if (this.maxTimer) window.clearTimeout(this.maxTimer);
      this.maxTimer = window.setTimeout(() => {
        this.maxValues = [...this.levels];
        this.maxTimer = undefined;
        this.schedulePaint();
      }, 1000);
    } else if (this.levels.find((v, i) => v < this.maxValues[i]) && typeof this.maxTimer === "undefined") {
      this.maxTimer = window.setTimeout(() => {
        this.maxValues = [...this.levels];
        this.maxTimer = undefined;
        this.schedulePaint();
      }, 1000);
    }

    const channels = this.levels.length;
    const clipValue = +(mode === "linear");
    const meterThick = 8;
    const metersThick = (meterThick + 1) * channels - 1;
    ctx.font = "".concat(fontFace === "regular" ? "" : fontFace, " ").concat(fontSize, "px ").concat(fontFamily, ", sans-serif");
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    if (showName) ctx.fillText(shortName, width * 0.5, fontSize, width);

    if (showNumber) {
      if (orientation === "horizontal") {
        ctx.textAlign = "left";
        ctx.fillText(displayValue, 4, height - 2, width);
      } else {
        ctx.fillText(displayValue, width * 0.5, height - 2, width);
      }
    }

    this.interactionRect = [0, fontSize + padding, width, height - 2 * (fontSize + padding)];
    ctx.save();
    let $width;
    const $height = meterThick;

    if (orientation === "horizontal") {
      $width = width;
      ctx.translate(0, (height - metersThick) * 0.5);
    } else {
      $width = this.interactionRect[3];
      ctx.translate((width - metersThick) * 0.5, height - fontSize - padding);
      ctx.rotate(-Math.PI * 0.5);
    }

    ctx.fillStyle = bgColor;

    if (min >= clipValue || clipValue >= max) {
      const fgColor = min >= clipValue ? active ? overloadColor : inactiveWarmColor : active ? coldColor : inactiveColdColor;
      let $top = 0;
      this.levels.forEach(v => {
        if (v < max) ctx.fillRect(0, $top, $width, $height);
        $top += $height + 1;
      });
      $top = 0;
      ctx.fillStyle = fgColor;
      this.levels.forEach((v, i) => {
        const distance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
          type: "float",
          value: v,
          min,
          max,
          exponent
        });
        if (distance > 0) ctx.fillRect(0, $top, distance * $width, $height);
        const histMax = this.maxValues[i];

        if (typeof histMax === "number" && histMax > v) {
          const histDistance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
            type: "float",
            value: histMax,
            min,
            max,
            exponent
          });
          ctx.fillRect(Math.min($width - 1, histDistance * $width), $top, 1, $height);
        }

        $top += $height + 1;
      });
    } else {
      const clipDistance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
        type: "float",
        value: clipValue,
        min,
        max,
        exponent
      });
      const clip = $width - clipDistance * $width;
      const hotStop = $width - clip;
      const warmStop = hotStop - 1;
      const gradient = ctx.createLinearGradient(0, 0, $width, 0);
      gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
      gradient.addColorStop(warmStop / $width, active ? warmColor : inactiveWarmColor);
      gradient.addColorStop(hotStop / $width, active ? hotColor : inactiveWarmColor);
      gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);
      let $top = 0;
      this.levels.forEach(v => {
        if (v < clipValue) ctx.fillRect(0, $top, warmStop, $height);
        if (v < max) ctx.fillRect(hotStop, $top, clip, $height);
        $top += $height + 1;
      });
      $top = 0;
      ctx.fillStyle = gradient;
      this.levels.forEach((v, i) => {
        const distance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
          type: "float",
          value: v,
          min,
          max,
          exponent
        });
        if (distance > 0) ctx.fillRect(0, $top, Math.min(warmStop, distance * $width), $height);
        if (distance > clipDistance) ctx.fillRect(hotStop, $top, Math.min(clip, (distance - clipDistance) * $width), $height);
        const histMax = this.maxValues[i];

        if (typeof histMax === "number" && histMax > v) {
          const histDistance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
            type: "float",
            value: histMax,
            min,
            max,
            exponent
          });
          if (histDistance <= clipDistance) ctx.fillRect(histDistance * $width, $top, 1, $height);else ctx.fillRect(Math.min($width - 1, histDistance * $width), $top, 1, $height);
        }

        $top += $height + 1;
      });
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = triBorderColor;
    const triOrigin = [$width * distance, metersThick + lineWidth];
    ctx.beginPath();
    ctx.moveTo(triOrigin[0], triOrigin[1]);
    ctx.lineTo(triOrigin[0] - 4, triOrigin[1] + 8);
    ctx.lineTo(triOrigin[0] + 4, triOrigin[1] + 8);
    ctx.lineTo(triOrigin[0], triOrigin[1]);
    ctx.stroke();
    ctx.fillStyle = this.inTouch ? triOnColor : triColor;
    ctx.fill();
    ctx.restore();
  }

  getValueFromPos(e) {
    const {
      orientation,
      type,
      min,
      exponent
    } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = orientation === "vertical" ? this.interactionRect[3] : this.interactionRect[2];
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const pixels = orientation === "vertical" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0];
    let steps = Math.round(Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["normExp"])(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum") return steps;
    if (type === "int") return Math.round(steps * step + min);
    return steps * step + min;
  }

  getValueFromDelta(e) {
    const {
      type,
      min,
      max,
      enums,
      exponent,
      orientation
    } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = orientation === "horizontal" ? this.interactionRect[2] : this.interactionRect[3];
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const prevPixels = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
      value: e.prevValue,
      type,
      min,
      max,
      enums,
      exponent
    }) * totalPixels;
    const pixels = prevPixels + (orientation === "horizontal" ? e.x - e.fromX : e.fromY - e.y);
    let steps = Math.round(Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["normExp"])(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum") return steps;
    if (type === "int") return Math.round(steps * step + min);
    return steps * step + min;
  }

}

_defineProperty(LiveGainUI, "defaultSize", [120, 45]);

class LiveGain extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      rmsNode: undefined,
      gainNode: this.audioCtx.createGain(),
      bypassNode: this.audioCtx.createGain(),
      $requestTimer: -1
    }));

    _defineProperty(this, "inletConnections", [{
      node: this.state.bypassNode,
      index: 0
    }]);

    _defineProperty(this, "outletConnections", [{
      node: this.state.gainNode,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();

    const startRequest = () => {
      let lastResult = [];

      const request = async () => {
        if (this.state.rmsNode && !this.state.rmsNode.destroyed) {
          const {
            rms
          } = await this.state.rmsNode.gets({
            rms: true
          });
          const mode = this.getProp("mode");
          const thresh = this.getProp(mode === "deciBel" ? "thresholdDB" : "thresholdLinear");
          const result = mode === "deciBel" ? rms.map(v => Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["atodb"])(v)) : rms;

          if (!lastResult.every((v, i) => v === result[i] || Math.abs(v - result[i]) < thresh) || lastResult.length !== result.length) {
            this.outlet(3, result);
            this.updateUI({
              levels: result
            });
            lastResult = result;
          }
        }

        scheduleRequest();
      };

      const scheduleRequest = () => {
        this.state.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
      };

      request();
    };

    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 4;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        this.state.value = args[0];
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    let lastMetering;
    let lastMode;
    this.on("updateProps", async props => {
      if (props.windowSize && this.state.rmsNode) this.applyBPF(this.state.rmsNode.parameters.get("windowSize"), [[props.windowSize]]);

      if (props.metering && lastMetering !== props.metering && this.state.rmsNode) {
        if (lastMetering) {
          if (lastMetering === "postFader") this.state.gainNode.disconnect(this.state.rmsNode);else this.state.bypassNode.disconnect(this.state.rmsNode);
        }

        lastMetering = props.metering;
        if (props.metering === "preFader") this.state.bypassNode.connect(this.state.rmsNode, 0, 0);else this.state.gainNode.connect(this.state.rmsNode, 0, 0);
      }

      if (props.mode && lastMode && lastMode !== props.mode) {
        lastMode = props.mode;
        let value;

        if (props.mode === "linear") {
          value = Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["dbtoa"])(this.state.value);
          await this.update(undefined, {
            min: 0,
            max: 1.5,
            unitStyle: "float"
          });
        } else {
          value = Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["atodb"])(this.state.value);
          await this.update(undefined, {
            min: -70,
            max: 6,
            unitStyle: "decibel"
          });
        }

        this.state.value = value;
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("postInit", async () => {
      lastMode = this.getProp("mode");
      this.applyBPF(this.state.gainNode.gain, [[this.getProp("mode") === "deciBel" ? Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["dbtoa"])(this.state.value) : this.state.value]]);
      this.state.bypassNode.connect(this.state.gainNode);
      await _dsp_AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__["TemporalAnalyserRegister"].register(this.audioCtx.audioWorklet);
      this.state.rmsNode = new _dsp_AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__["TemporalAnalyserRegister"].Node(this.audioCtx);
      this.applyBPF(this.state.rmsNode.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      if (this.getProp("metering") === "preFader") this.state.bypassNode.connect(this.state.rmsNode, 0, 0);else this.state.gainNode.connect(this.state.rmsNode, 0, 0);
      startRequest();
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_3__["Bang"])) {
          const value = +data;
          this.state.value = value;
          this.validateValue();
          const paramValue = this.state.value === this.getProp("min") ? 0 : this.getProp("mode") === "deciBel" ? Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["dbtoa"])(this.state.value) : this.state.value;
          this.applyBPF(this.state.gainNode.gain, [[paramValue, this.getProp("interp")]]);
          this.updateUI({
            value: this.state.value
          });
        }

        this.outletAll([, this.state.value, this.state.displayValue]);
      }
    });
    this.on("changeFromUI", (_ref2) => {
      let {
        value,
        displayValue
      } = _ref2;
      this.state.value = value;
      this.state.displayValue = displayValue;
      const paramValue = this.state.value === this.getProp("min") ? 0 : this.getProp("mode") === "deciBel" ? Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["dbtoa"])(this.state.value) : this.state.value;
      this.applyBPF(this.state.gainNode.gain, [[paramValue, this.getProp("interp")]]);
      this.outletAll([, this.state.value, this.state.displayValue]);
    });
    this.on("destroy", () => {
      this.state.bypassNode.disconnect();
      this.state.gainNode.disconnect();
      window.clearTimeout(this.state.$requestTimer);
      if (this.state.rmsNode) this.state.rmsNode.destroy();
    });
  }

}

_defineProperty(LiveGain, "description", "Gain slider and monitor");

_defineProperty(LiveGain, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Signal in, number to set gain"
}]);

_defineProperty(LiveGain, "outlets", [{
  type: "signal",
  description: "Audio out"
}, {
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}, {
  type: "object",
  description: "Amplitude value: number[]"
}]);

_defineProperty(LiveGain, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}]);

_defineProperty(LiveGain, "props", {
  shortName: {
    type: "string",
    default: "live.gain",
    description: "Short name to display",
    isUIState: true
  },
  longName: {
    type: "string",
    default: "live.gain",
    description: "Long name to display",
    isUIState: true
  },
  min: {
    type: "number",
    default: -70,
    description: "Minimum value (dB)",
    isUIState: true
  },
  max: {
    type: "number",
    default: 6,
    description: "Maximum value (dB)",
    isUIState: true
  },
  step: {
    type: "number",
    default: 0.01,
    description: "Value change step",
    isUIState: true
  },
  type: {
    type: "enum",
    enums: ["enum", "float", "int"],
    default: "float",
    description: "Value type",
    isUIState: true
  },
  unitStyle: {
    type: "enum",
    enums: ["float", "int", "time", "hertz", "decibel", "%", "pan", "semitones", "midi", "custom", "native"],
    default: "decibel",
    description: "Style of unit to display",
    isUIState: true
  },
  relative: {
    type: "boolean",
    default: false,
    description: "Modify value use relative mouse move",
    isUIState: true
  },
  sliderColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Slider color",
    isUIState: true
  },
  triBorderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Triangle border color",
    isUIState: true
  },
  triColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Triangle color",
    isUIState: true
  },
  triOnColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Triangle color while on",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "rgba(255, 255, 255, 1)",
    description: "Text color",
    isUIState: true
  },
  fontFamily: {
    type: "enum",
    enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
    default: "Arial",
    description: "Font family",
    isUIState: true
  },
  fontSize: {
    type: "number",
    default: 10,
    description: "Text font size",
    isUIState: true
  },
  fontFace: {
    type: "enum",
    enums: ["regular", "bold", "italic", "bold italic"],
    default: "regular",
    description: "Text style",
    isUIState: true
  },
  orientation: {
    type: "enum",
    enums: ["vertical", "horizontal"],
    default: "horizontal",
    description: "Slider orientation",
    isUIState: true
  },
  showName: {
    type: "boolean",
    default: true,
    description: "Display name",
    isUIState: true
  },
  showNumber: {
    type: "boolean",
    default: true,
    description: "Display number as text",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgb(40, 40, 40)",
    description: "Background color",
    isUIState: true
  },
  inactiveColdColor: {
    type: "color",
    default: "rgb(130, 130, 130)",
    description: "Cold color (inactive)",
    isUIState: true
  },
  inactiveWarmColor: {
    type: "color",
    default: "rgb(149, 149, 149)",
    description: "Warm color (inactive)",
    isUIState: true
  },
  coldColor: {
    type: "color",
    default: "rgb(12, 248, 100)",
    description: "Cold color (active)",
    isUIState: true
  },
  warmColor: {
    type: "color",
    default: "rgb(195, 248, 100)",
    description: "Warm color (active)",
    isUIState: true
  },
  hotColor: {
    type: "color",
    default: "rgb(255, 193, 10)",
    description: "Hot color (active)",
    isUIState: true
  },
  overloadColor: {
    type: "color",
    default: "rgb(255, 10, 10)",
    description: "Overload color (active)",
    isUIState: true
  },
  mode: {
    type: "enum",
    enums: ["deciBel", "linear"],
    default: "deciBel",
    description: "Display mode",
    isUIState: true
  },
  speedLim: {
    type: "number",
    default: 16,
    description: "Value output speed limit in ms"
  },
  frameRate: {
    type: "number",
    default: 60,
    description: "UI refresh rate",
    isUIState: true
  },
  windowSize: {
    type: "number",
    default: 1024,
    description: "RMS window size"
  },
  thresholdDB: {
    type: "number",
    default: 0.1,
    description: "Redraw Threshold in dB"
  },
  thresholdLinear: {
    type: "number",
    default: 0.01,
    description: "Redraw Threshold in Linear"
  },
  metering: {
    type: "enum",
    enums: ["postFader", "preFader"],
    default: "postFader",
    description: "Display meter pre/post fader"
  },
  interp: {
    type: "number",
    default: 0.01,
    description: "Ramp time"
  }
});

_defineProperty(LiveGain, "ui", LiveGainUI);

/***/ }),

/***/ "./src/core/objects/live/meter.tsx":
/*!*****************************************!*\
  !*** ./src/core/objects/live/meter.tsx ***!
  \*****************************************/
/*! exports provided: LiveMeterUI, LiveMeter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveMeterUI", function() { return LiveMeterUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveMeter", function() { return LiveMeter; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _dsp_AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dsp/AudioWorklet/TemporalAnalyser */ "./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.ts");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class LiveMeterUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_4__["CanvasUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      value: []
    }));

    _defineProperty(this, "values", []);

    _defineProperty(this, "maxValues", []);

    _defineProperty(this, "maxTimer", void 0);
  }

  paint() {
    const {
      // width,
      // height,
      active,
      mode,
      value,
      min,
      max,
      orientation,
      bgColor,
      coldColor,
      warmColor,
      hotColor,
      overloadColor,
      inactiveColdColor,
      inactiveWarmColor
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    let [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    this.values = value.slice();
    if (this.values.length === 0) this.values = [min];

    if (this.values.find((v, i) => typeof this.maxValues[i] === "undefined" || v > this.maxValues[i])) {
      this.maxValues = [...this.values];
      if (this.maxTimer) window.clearTimeout(this.maxTimer);
      this.maxTimer = window.setTimeout(() => {
        this.maxValues = [...this.values];
        this.maxTimer = undefined;
        this.schedulePaint();
      }, 1000);
    } else if (this.values.find((v, i) => v < this.maxValues[i]) && typeof this.maxTimer === "undefined") {
      this.maxTimer = window.setTimeout(() => {
        this.maxValues = [...this.values];
        this.maxTimer = undefined;
        this.schedulePaint();
      }, 1000);
    }

    const channels = this.values.length;
    const clipValue = +(mode === "linear");

    if (orientation === "vertical") {
      ctx.save();
      ctx.translate(0, height);
      ctx.rotate(-Math.PI * 0.5);
      [height, width] = [width, height];
    }

    const $height = (height - channels - 1) / this.values.length;
    ctx.fillStyle = bgColor;

    if (min >= clipValue || clipValue >= max) {
      const fgColor = min >= clipValue ? active ? overloadColor : inactiveWarmColor : active ? coldColor : inactiveColdColor;
      let $top = 0;
      this.values.forEach(v => {
        if (v < max) ctx.fillRect(0, $top, width, $height);
        $top += $height + 1;
      });
      $top = 0;
      ctx.fillStyle = fgColor;
      this.values.forEach((v, i) => {
        const distance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
          type: "float",
          value: v,
          min,
          max,
          exponent: 0
        });
        if (distance > 0) ctx.fillRect(0, $top, distance * width, $height);
        const histMax = this.maxValues[i];

        if (typeof histMax === "number" && histMax > v) {
          const histDistance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
            type: "float",
            value: histMax,
            min,
            max,
            exponent: 0
          });
          ctx.fillRect(Math.min(width - 1, histDistance * width), $top, 1, $height);
        }

        $top += $height + 1;
      });
    } else {
      const clipDistance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
        type: "float",
        value: clipValue,
        min,
        max,
        exponent: 0
      });
      const clip = width - clipDistance * width;
      const hotStop = width - clip;
      const warmStop = hotStop - 1;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
      gradient.addColorStop(warmStop / width, active ? warmColor : inactiveWarmColor);
      gradient.addColorStop(hotStop / width, active ? hotColor : inactiveWarmColor);
      gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);
      let $top = 0;
      this.values.forEach(v => {
        if (v < clipValue) ctx.fillRect(0, $top, warmStop, $height);
        if (v < max) ctx.fillRect(hotStop, $top, clip, $height);
        $top += $height + 1;
      });
      $top = 0;
      ctx.fillStyle = gradient;
      this.values.forEach((v, i) => {
        const distance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
          type: "float",
          value: v,
          min,
          max,
          exponent: 0
        });
        if (distance > 0) ctx.fillRect(0, $top, Math.min(warmStop, distance * width), $height);
        if (distance > clipDistance) ctx.fillRect(hotStop, $top, Math.min(clip, (distance - clipDistance) * width), $height);
        const histMax = this.maxValues[i];

        if (typeof histMax === "number" && histMax > v) {
          const histDistance = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
            type: "float",
            value: histMax,
            min,
            max,
            exponent: 0
          });
          if (histDistance <= clipDistance) ctx.fillRect(histDistance * width, $top, 1, $height);else ctx.fillRect(Math.min(width - 1, histDistance * width), $top, 1, $height);
        }

        $top += $height + 1;
      });
    }

    if (orientation === "vertical") ctx.restore();
  }

}
class LiveMeter extends _Base__WEBPACK_IMPORTED_MODULE_1__["BaseAudioObject"] {
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
      let lastResult = [];

      const request = async () => {
        if (this.state.node && !this.state.node.destroyed) {
          const {
            rms
          } = await this.state.node.gets({
            rms: true
          });
          const mode = this.getProp("mode");
          const thresh = this.getProp(mode === "deciBel" ? "thresholdDB" : "thresholdLinear");
          const result = mode === "deciBel" ? rms.map(v => Object(_utils_math__WEBPACK_IMPORTED_MODULE_3__["atodb"])(v)) : rms;

          if (!lastResult.every((v, i) => v === result[i] || Math.abs(v - result[i]) < thresh) || lastResult.length !== result.length) {
            this.outlet(0, result);
            this.updateUI({
              value: result
            });
            lastResult = result;
          }
        }

        scheduleRequest();
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
      if (props.windowSize && this.state.node) this.applyBPF(this.state.node.parameters.get("windowSize"), [[props.windowSize]]);
    });
    this.on("postInit", async () => {
      await _dsp_AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_2__["TemporalAnalyserRegister"].register(this.audioCtx.audioWorklet);
      this.state.node = new _dsp_AudioWorklet_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_2__["TemporalAnalyserRegister"].Node(this.audioCtx);
      this.applyBPF(this.state.node.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      this.disconnectAudioInlet();
      this.inletConnections[0] = {
        node: this.state.node,
        index: 0
      };
      this.connectAudioInlet();
      startRequest();
    });
    this.on("destroy", () => {
      window.clearTimeout(this.state.$requestTimer);
      if (this.state.node) this.state.node.destroy();
    });
  }

}

_defineProperty(LiveMeter, "package", _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"].package);

_defineProperty(LiveMeter, "author", _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"].author);

_defineProperty(LiveMeter, "version", _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"].version);

_defineProperty(LiveMeter, "description", "Meter");

_defineProperty(LiveMeter, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Signal to measure"
}]);

_defineProperty(LiveMeter, "outlets", [{
  type: "object",
  description: "Amplitude value: number[]"
}]);

_defineProperty(LiveMeter, "props", {
  min: {
    type: "number",
    default: -70,
    description: "Minimum value (dB)",
    isUIState: true
  },
  max: {
    type: "number",
    default: 6,
    description: "Maximum value (dB)",
    isUIState: true
  },
  active: {
    type: "boolean",
    default: true,
    description: "Active state",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgb(40, 40, 40)",
    description: "Background color",
    isUIState: true
  },
  inactiveColdColor: {
    type: "color",
    default: "rgb(130, 130, 130)",
    description: "Cold color (inactive)",
    isUIState: true
  },
  inactiveWarmColor: {
    type: "color",
    default: "rgb(149, 149, 149)",
    description: "Warm color (inactive)",
    isUIState: true
  },
  coldColor: {
    type: "color",
    default: "rgb(12, 248, 100)",
    description: "Cold color (active)",
    isUIState: true
  },
  warmColor: {
    type: "color",
    default: "rgb(195, 248, 100)",
    description: "Warm color (active)",
    isUIState: true
  },
  hotColor: {
    type: "color",
    default: "rgb(255, 193, 10)",
    description: "Hot color (active)",
    isUIState: true
  },
  overloadColor: {
    type: "color",
    default: "rgb(255, 10, 10)",
    description: "Overload color (active)",
    isUIState: true
  },
  orientation: {
    type: "enum",
    enums: ["vertical", "horizontal"],
    default: "horizontal",
    description: "Meter orientation",
    isUIState: true
  },
  mode: {
    type: "enum",
    enums: ["deciBel", "linear"],
    default: "deciBel",
    description: "Display mode",
    isUIState: true
  },
  speedLim: {
    type: "number",
    default: 16,
    description: "Value output speed limit in ms"
  },
  frameRate: {
    type: "number",
    default: 60,
    description: "UI refresh rate",
    isUIState: true
  },
  windowSize: {
    type: "number",
    default: 1024,
    description: "RMS window size"
  },
  thresholdDB: {
    type: "number",
    default: 0.1,
    description: "Redraw Threshold in dB"
  },
  thresholdLinear: {
    type: "number",
    default: 0.01,
    description: "Redraw Threshold in Linear"
  }
});

_defineProperty(LiveMeter, "ui", LiveMeterUI);

/***/ }),

/***/ "./src/core/objects/live/numbox.tsx":
/*!******************************************!*\
  !*** ./src/core/objects/live/numbox.tsx ***!
  \******************************************/
/*! exports provided: LiveNumbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveNumbox", function() { return LiveNumbox; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class LiveNumboxUI extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      inputBuffer: ""
    }));

    _defineProperty(this, "className", "live-numbox");

    _defineProperty(this, "handlePointerDrag", e => {
      const newValue = this.getValueFromDelta(e);
      if (newValue !== this.state.value) this.setValueToOutput(newValue);
    });

    _defineProperty(this, "handleKeyDown", e => {
      if (!this.state.inputBuffer) {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") addStep = -1;

        if (addStep !== 0) {
          const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
          if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
      }

      if (e.key.match(/[0-9.-]/)) {
        this.setState({
          inputBuffer: this.state.inputBuffer + e.key
        });
        return;
      }

      if (e.key === "Backspace") {
        this.setState({
          inputBuffer: this.state.inputBuffer.slice(0, -1)
        });
        return;
      }

      if (e.key === "Enter") {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({
          inputBuffer: ""
        });
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }
    });

    _defineProperty(this, "handleFocusOut", () => {
      if (this.state.inputBuffer) {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({
          inputBuffer: ""
        });
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }

      this.setState({
        focus: false
      });
    });
  }

  paint() {
    const {
      // width,
      // height,
      active,
      focus,
      fontFamily,
      fontSize,
      fontFace,
      appearance,
      bgColor,
      activeBgColor,
      borderColor,
      focusBorderColor,
      textColor,
      triColor,
      activeTriColor,
      triColor2,
      activeTriColor2,
      activeSliderColor,
      inputBuffer
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const distance = this.distance;
    const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height); // draw background

    ctx.fillStyle = active ? activeBgColor : bgColor;
    ctx.rect(0, 0, width, height);
    ctx.fill();

    if (appearance === "slider" && active && distance) {
      ctx.fillStyle = activeSliderColor;
      ctx.fillRect(0, 0, distance * width, height);
    } // draw border (eventually we might need to redefine the shape)


    ctx.lineWidth = 1;
    ctx.strokeStyle = focus ? focusBorderColor : borderColor;
    ctx.stroke();

    if (appearance === "triangle") {
      const triangleHeight = 8;
      ctx.fillStyle = active ? distance ? activeTriColor2 : activeTriColor : distance ? triColor2 : triColor;
      ctx.beginPath();
      ctx.moveTo(width - triangleHeight - 1, height * 0.5);
      ctx.lineTo(width - 1, 1);
      ctx.lineTo(width - 1, height - 1);
      ctx.closePath();
      ctx.fill();
    } // display the text


    ctx.font = "".concat(fontFace === "regular" ? "" : fontFace, " ").concat(fontSize, "px ").concat(fontFamily, ", sans-serif");
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayValue, width * 0.5, height * 0.5, width);
  }

  getValueFromDelta(e) {
    const {
      type,
      min,
      max,
      enums,
      exponent
    } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = 100;
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const prevPixels = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
      value: e.prevValue,
      type,
      min,
      max,
      enums,
      exponent
    }) * totalPixels;
    const pixels = prevPixels + e.fromY - e.y;
    let steps = Math.round(Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["normExp"])(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum") return steps;
    if (type === "int") return Math.round(steps * step + min);
    return steps * step + min;
  }

}

class LiveNumbox extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        this.state.value = args[0];
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) {
          const value = +data;
          this.state.value = value;
          this.validateValue();
          this.updateUI({
            value: this.state.value
          });
        }

        this.outletAll([this.state.value, this.state.displayValue]);
      } else if (inlet === 1) {
        const value = +data;
        this.state.value = value;
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("changeFromUI", (_ref2) => {
      let {
        value,
        displayValue
      } = _ref2;
      this.state.value = value;
      this.state.displayValue = displayValue;
      this.outletAll([this.state.value, this.state.displayValue]);
    });
  }

}

_defineProperty(LiveNumbox, "description", "Number box");

_defineProperty(LiveNumbox, "inlets", [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}]);

_defineProperty(LiveNumbox, "outlets", [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}]);

_defineProperty(LiveNumbox, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}]);

_defineProperty(LiveNumbox, "props", {
  bgColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Background color (inactive)",
    isUIState: true
  },
  activeBgColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Background color (active)",
    isUIState: true
  },
  borderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (unfocus)",
    isUIState: true
  },
  focusBorderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (focus)",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "rgba(0, 0, 0, 1)",
    description: "Text color",
    isUIState: true
  },
  fontFamily: {
    type: "enum",
    enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
    default: "Arial",
    description: "Font family",
    isUIState: true
  },
  fontSize: {
    type: "number",
    default: 10,
    description: "Text font size",
    isUIState: true
  },
  fontFace: {
    type: "enum",
    enums: ["regular", "bold", "italic", "bold italic"],
    default: "regular",
    description: "Text style",
    isUIState: true
  },
  appearance: {
    type: "enum",
    enums: ["default", "slider", "triangle"],
    default: "default",
    description: "Text style",
    isUIState: true
  },
  triColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Triangle color (inactive)",
    isUIState: true
  },
  activeTriColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Triangle color (active)",
    isUIState: true
  },
  triColor2: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Triangle color on positive value (inactive)",
    isUIState: true
  },
  activeTriColor2: {
    type: "color",
    default: "rgba(109, 215, 255, 1)",
    description: "Triangle color on positive value (active)",
    isUIState: true
  },
  activeSliderColor: {
    type: "color",
    default: "rgba(109, 215, 255, 1)",
    description: "Slider color",
    isUIState: true
  }
});

_defineProperty(LiveNumbox, "ui", LiveNumboxUI);

/***/ }),

/***/ "./src/core/objects/live/slider.tsx":
/*!******************************************!*\
  !*** ./src/core/objects/live/slider.tsx ***!
  \******************************************/
/*! exports provided: LiveSlider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveSlider", function() { return LiveSlider; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class LiveSliderUI extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      inputBuffer: ""
    }));

    _defineProperty(this, "className", "live-slider");

    _defineProperty(this, "interactionRect", [0, 0, 0, 0]);

    _defineProperty(this, "inTouch", false);

    _defineProperty(this, "handlePointerDown", e => {
      if (e.x < this.interactionRect[0] || e.x > this.interactionRect[0] + this.interactionRect[2] || e.y < this.interactionRect[1] || e.y > this.interactionRect[1] + this.interactionRect[3]) return;

      if (!this.state.relative) {
        const newValue = this.getValueFromPos(e);
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }

      this.inTouch = true;
    });

    _defineProperty(this, "handlePointerDrag", e => {
      if (!this.inTouch) return;
      let newValue;
      if (this.state.relative) newValue = this.getValueFromDelta(e);else newValue = this.getValueFromPos(e);
      if (newValue !== this.state.value) this.setValueToOutput(newValue);
    });

    _defineProperty(this, "handlePointerUp", () => {
      this.inTouch = false;
    });

    _defineProperty(this, "handleKeyDown", e => {
      if (!this.state.inputBuffer) {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") addStep = -1;

        if (addStep !== 0) {
          const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
          if (newValue !== this.state.value) this.setValueToOutput(newValue);
        }
      }

      if (e.key.match(/[0-9.-]/)) {
        this.setState({
          inputBuffer: this.state.inputBuffer + e.key
        });
        return;
      }

      if (e.key === "Backspace") {
        this.setState({
          inputBuffer: this.state.inputBuffer.slice(0, -1)
        });
        return;
      }

      if (e.key === "Enter") {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({
          inputBuffer: ""
        });
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }
    });

    _defineProperty(this, "handleFocusOut", () => {
      if (this.state.inputBuffer) {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({
          inputBuffer: ""
        });
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }

      this.setState({
        focus: false
      });
    });
  }

  paint() {
    const {
      // width,
      // height,
      fontFamily,
      fontSize,
      fontFace,
      orientation,
      showName,
      showNumber,
      sliderColor,
      textColor,
      triBorderColor,
      triOnColor,
      triColor,
      shortName,
      inputBuffer
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const lineWidth = 0.5;
    const padding = 8;
    const distance = this.distance;
    const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = sliderColor;

    if (orientation === "vertical") {
      ctx.beginPath();
      ctx.moveTo(width * 0.5, fontSize + padding);
      ctx.lineTo(width * 0.5, height - (fontSize + padding));
      ctx.stroke();
      const interactionWidth = width * 0.5;
      this.interactionRect = [width * 0.5 - interactionWidth * 0.5, fontSize + padding, interactionWidth, height - 2 * (fontSize + padding)];
      ctx.lineWidth = 1;
      ctx.strokeStyle = triBorderColor;
      const triOrigin = [width * 0.5 + lineWidth * 0.5 + 0.5, this.interactionRect[1] - 4 + this.interactionRect[3] * (1 - distance)];
      ctx.beginPath();
      ctx.moveTo(triOrigin[0], triOrigin[1] + 4);
      ctx.lineTo(triOrigin[0] + 8, triOrigin[1]);
      ctx.lineTo(triOrigin[0] + 8, triOrigin[1] + 8);
      ctx.lineTo(triOrigin[0], triOrigin[1] + 4);
      ctx.stroke();
      ctx.fillStyle = this.inTouch ? triOnColor : triColor;
      ctx.fill();
      ctx.font = "".concat(fontFace === "regular" ? "" : fontFace, " ").concat(fontSize, "px ").concat(fontFamily, ", sans-serif");
      ctx.textAlign = "center";
      ctx.fillStyle = textColor;
      if (showName) ctx.fillText(shortName, width * 0.5, fontSize, width);
      if (showNumber) ctx.fillText(displayValue, width * 0.5, height - 2, width);
    } else {
      ctx.beginPath();
      ctx.moveTo(padding, height * 0.5);
      ctx.lineTo(width - padding, height * 0.5);
      ctx.stroke();
      const interactionWidth = height * 0.5;
      this.interactionRect = [padding, height * 0.5 - interactionWidth * 0.5, width - 2 * padding, interactionWidth];
      ctx.lineWidth = 1;
      ctx.strokeStyle = triBorderColor;
      const triOrigin = [this.interactionRect[0] + this.interactionRect[2] * distance - 4, height * 0.5 + lineWidth * 0.5 + 2];
      ctx.beginPath();
      ctx.moveTo(triOrigin[0], triOrigin[1] + 8);
      ctx.lineTo(triOrigin[0] + 4, triOrigin[1]);
      ctx.lineTo(triOrigin[0] + 8, triOrigin[1] + 8);
      ctx.lineTo(triOrigin[0], triOrigin[1] + 8);
      ctx.stroke();
      ctx.fillStyle = this.inTouch ? triOnColor : triColor;
      ctx.fill();
      ctx.font = "".concat(fontFace === "regular" ? "" : fontFace, " ").concat(fontSize, "px ").concat(fontFamily, ", sans-serif");
      ctx.textAlign = "center";
      ctx.fillStyle = textColor;
      if (showName) ctx.fillText(shortName, width * 0.5, fontSize, width);
      ctx.textAlign = "left";
      if (showNumber) ctx.fillText(displayValue, 4, height - 2, width);
    }
  }

  getValueFromPos(e) {
    const {
      orientation,
      type,
      min,
      exponent
    } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = orientation === "vertical" ? this.interactionRect[3] : this.interactionRect[2];
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const pixels = orientation === "vertical" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0];
    let steps = Math.round(Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["normExp"])(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum") return steps;
    if (type === "int") return Math.round(steps * step + min);
    return steps * step + min;
  }

  getValueFromDelta(e) {
    const {
      type,
      min,
      max,
      enums,
      exponent,
      orientation
    } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = orientation === "horizontal" ? this.interactionRect[2] : this.interactionRect[3];
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const prevPixels = _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"].getDistance({
      value: e.prevValue,
      type,
      min,
      max,
      enums,
      exponent
    }) * totalPixels;
    const pixels = prevPixels + (orientation === "horizontal" ? e.x - e.fromX : e.fromY - e.y);
    let steps = Math.round(Object(_utils_math__WEBPACK_IMPORTED_MODULE_2__["normExp"])(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum") return steps;
    if (type === "int") return Math.round(steps * step + min);
    return steps * step + min;
  }

}

_defineProperty(LiveSliderUI, "defaultSize", [120, 45]);

class LiveSlider extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        this.state.value = args[0];
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) {
          const value = +data;
          this.state.value = value;
          this.validateValue();
          this.updateUI({
            value: this.state.value
          });
        }

        this.outletAll([this.state.value, this.state.displayValue]);
      } else if (inlet === 1) {
        const value = +data;
        this.state.value = value;
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("changeFromUI", (_ref2) => {
      let {
        value,
        displayValue
      } = _ref2;
      this.state.value = value;
      this.state.displayValue = displayValue;
      this.outletAll([this.state.value, this.state.displayValue]);
    });
  }

}

_defineProperty(LiveSlider, "description", "Slider");

_defineProperty(LiveSlider, "inlets", [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}]);

_defineProperty(LiveSlider, "outlets", [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}]);

_defineProperty(LiveSlider, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}]);

_defineProperty(LiveSlider, "props", {
  shortName: {
    type: "string",
    default: "live.slider",
    description: "Short name to display",
    isUIState: true
  },
  longName: {
    type: "string",
    default: "live.slider",
    description: "Long name to display",
    isUIState: true
  },
  relative: {
    type: "boolean",
    default: false,
    description: "Modify value use relative mouse move",
    isUIState: true
  },
  sliderColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Slider color",
    isUIState: true
  },
  triBorderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Triangle border color",
    isUIState: true
  },
  triColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Triangle color",
    isUIState: true
  },
  triOnColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Triangle color while on",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "rgba(255, 255, 255, 1)",
    description: "Text color",
    isUIState: true
  },
  fontFamily: {
    type: "enum",
    enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
    default: "Arial",
    description: "Font family",
    isUIState: true
  },
  fontSize: {
    type: "number",
    default: 10,
    description: "Text font size",
    isUIState: true
  },
  fontFace: {
    type: "enum",
    enums: ["regular", "bold", "italic", "bold italic"],
    default: "regular",
    description: "Text style",
    isUIState: true
  },
  orientation: {
    type: "enum",
    enums: ["vertical", "horizontal"],
    default: "horizontal",
    description: "Slider orientation",
    isUIState: true
  },
  showName: {
    type: "boolean",
    default: true,
    description: "Display name",
    isUIState: true
  },
  showNumber: {
    type: "boolean",
    default: true,
    description: "Display number as text",
    isUIState: true
  }
});

_defineProperty(LiveSlider, "ui", LiveSliderUI);

/***/ }),

/***/ "./src/core/objects/live/tab.tsx":
/*!***************************************!*\
  !*** ./src/core/objects/live/tab.tsx ***!
  \***************************************/
/*! exports provided: LiveTab */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveTab", function() { return LiveTab; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class LiveTabUI extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "live-tab");

    _defineProperty(this, "tabRects", []);

    _defineProperty(this, "inTouch", false);

    _defineProperty(this, "handlePointerDown", e => {
      this.inTouch = true;

      for (let i = 0; i < this.tabRects.length; i++) {
        const rect = this.tabRects[i];

        if (e.x >= rect[0] && e.x <= rect[2] + rect[0] && e.y >= rect[1] && e.y <= rect[3] + rect[1]) {
          this.setValueToOutput(i);
          return;
        }
      }
    });

    _defineProperty(this, "handlePointerDrag", e => {
      this.handlePointerDown(e);
    });

    _defineProperty(this, "handleKeyDown", e => {
      let addStep = 0;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") addStep = 1;
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") addStep = -1;

      if (addStep !== 0) {
        const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
        if (newValue !== this.state.value) this.setValueToOutput(newValue);
      }
    });
  }

  getTabRects(width, height) {
    const {
      // width,
      // height,
      multiline,
      mode,
      enums,
      spacingX: spacingXIn,
      spacingY: spacingYIn
    } = this.state;
    const margin = 4;
    const minHeight = 10;
    const count = enums.length;
    let countPerLine = count;
    let lines = 1;
    let step = height / lines;
    let interval = 0;
    let rectWidth = 0;
    const spacingX = spacingXIn * 0.5;
    const spacingY = spacingYIn * 0.5;

    if (multiline && height >= 2 * minHeight) {
      lines = Math.max(1, Math.min(count, Math.floor(height / minHeight)));
      countPerLine = Math.ceil(count / lines); // if there's not enough height, increase the number of tabs per row

      while (lines * countPerLine < count) {
        countPerLine++;
        if (lines > 1) lines--;
      } // if there's extra height, reduce the number of rows


      while (lines * countPerLine > count && (lines - 1) * countPerLine >= count) {
        lines--;
      }

      step = height / lines;
    }

    if (mode === "equal") {
      interval = width / countPerLine;
      rectWidth = interval - spacingX;

      for (let i = 0; i < count; i++) {
        this.tabRects[i] = [i % countPerLine * interval + spacingX * 0.5, Math.floor(i / countPerLine) * step + spacingY * 0.5, rectWidth, height / lines - spacingY];
      }
    } else {
      const textWidths = [];

      for (let i = 0; i < lines; i++) {
        let total = 0;
        let space = width;

        for (let j = i * countPerLine; j < Math.min((i + 1) * countPerLine, count); j++) {
          const textDimensions = this.ctx.measureText(enums[j]);
          textWidths[j] = textDimensions.width;
          total += textWidths[j];
          space -= 2 * margin + spacingX;
        }

        let used = 0;

        for (let j = i * countPerLine; j < Math.min((i + 1) * countPerLine, count); j++) {
          const rectSpace = textWidths[j] / total;
          this.tabRects[j] = [used + spacingX * 0.5, i * step + spacingY * 0.5, space * rectSpace + 2 * margin, height / lines - spacingY];
          used += this.tabRects[j][2] + spacingX;
        }
      }
    }

    return this.tabRects;
  }

  paint() {
    const {
      active,
      focus,
      fontFamily,
      fontSize,
      fontFace,
      activeBgColor,
      activeBgOnColor,
      bgColor,
      bgOnColor,
      borderColor,
      focusBorderColor,
      textColor,
      textOnColor,
      activeTextColor,
      activeTextOnColor,
      enums,
      value
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const [width, height] = this.fullSize();
    const tabRects = this.getTabRects(width, height);
    const borderWidth = 0.5;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = borderWidth;
    const buttonBorderColor = focus ? focusBorderColor : borderColor;

    for (let i = 0; i < enums.length; i++) {
      const buttonBgColor = active ? value === i ? activeBgOnColor : activeBgColor : value === i ? bgOnColor : bgColor;
      ctx.fillStyle = buttonBgColor;
      ctx.beginPath();
      ctx.rect(...tabRects[i]);
      ctx.fill();
      ctx.strokeStyle = buttonBorderColor;
      ctx.stroke();
      ctx.font = "".concat(fontFace === "regular" ? "" : fontFace, " ").concat(fontSize, "px ").concat(fontFamily, ", sans-serif");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = active ? value === i ? activeTextOnColor : activeTextColor : value === i ? textOnColor : textColor;
      ctx.fillText(enums[i], tabRects[i][0] + tabRects[i][2] * 0.5, tabRects[i][1] + tabRects[i][3] * 0.5);
    }
  }

}

_defineProperty(LiveTabUI, "defaultSize", [120, 15]);

class LiveTab extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        this.state.value = args[0];
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) {
          const value = +data;
          this.state.value = value;
          this.validateValue();
          this.updateUI({
            value: this.state.value
          });
        }

        this.outletAll([this.state.value, this.state.displayValue]);
      } else if (inlet === 1) {
        const value = +data;
        this.state.value = value;
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("changeFromUI", (_ref2) => {
      let {
        value,
        displayValue
      } = _ref2;
      this.state.value = value;
      this.state.displayValue = displayValue;
      this.outletAll([this.state.value, this.state.displayValue]);
    });
  }

}

_defineProperty(LiveTab, "description", "Buttons as tab");

_defineProperty(LiveTab, "inlets", [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}]);

_defineProperty(LiveTab, "outlets", [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}]);

_defineProperty(LiveTab, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}]);

_defineProperty(LiveTab, "props", {
  bgColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Background color (inactive / off)",
    isUIState: true
  },
  activeBgColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Background color (active / off)",
    isUIState: true
  },
  bgOnColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Background color (inactive / on)",
    isUIState: true
  },
  activeBgOnColor: {
    type: "color",
    default: "rgba(255, 181, 50, 1)",
    description: "Background color (active / on)",
    isUIState: true
  },
  borderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (unfocus)",
    isUIState: true
  },
  focusBorderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (focus)",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "rgba(90, 90, 90, 1)",
    description: "Text color (inactive / off)",
    isUIState: true
  },
  textOnColor: {
    type: "color",
    default: "rgba(90, 90, 90, 1)",
    description: "Text color (inactive / on)",
    isUIState: true
  },
  activeTextColor: {
    type: "color",
    default: "rgba(0, 0, 0, 1)",
    description: "Text color (active / off)",
    isUIState: true
  },
  activeTextOnColor: {
    type: "color",
    default: "rgba(0, 0, 0, 1)",
    description: "Text color (active / on)",
    isUIState: true
  },
  fontFamily: {
    type: "enum",
    enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
    default: "Arial",
    description: "Font family",
    isUIState: true
  },
  fontSize: {
    type: "number",
    default: 10,
    description: "Text font size",
    isUIState: true
  },
  fontFace: {
    type: "enum",
    enums: ["regular", "bold", "italic", "bold italic"],
    default: "regular",
    description: "Text style",
    isUIState: true
  },
  mode: {
    type: "enum",
    enums: ["equal", "proportional"],
    default: "equal",
    description: "Spacing mode",
    isUIState: true
  },
  spacingX: {
    type: "number",
    default: 6,
    description: "Tab horizontal spacing",
    isUIState: true
  },
  spacingY: {
    type: "number",
    default: 6,
    description: "Tab vertical spacing",
    isUIState: true
  },
  multiline: {
    type: "boolean",
    default: true,
    description: "Multi-line tabs",
    isUIState: true
  },
  enums: {
    type: "object",
    default: ["one", "two", "three"],
    description: "Enum values",
    isUIState: true
  }
});

_defineProperty(LiveTab, "ui", LiveTabUI);

/***/ }),

/***/ "./src/core/objects/live/text.tsx":
/*!****************************************!*\
  !*** ./src/core/objects/live/text.tsx ***!
  \****************************************/
/*! exports provided: LiveText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveText", function() { return LiveText; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class LiveTextUI extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "live-text");

    _defineProperty(this, "inTouch", false);

    _defineProperty(this, "handlePointerDown", e => {
      const {
        value,
        mode
      } = this.state;
      this.inTouch = true;
      this.setValueToOutput(mode === "button" ? 1 : 1 - +!!value);
    });

    _defineProperty(this, "handlePointerUp", () => {
      const {
        mode
      } = this.state;
      this.inTouch = false;
      if (mode === "button") this.setValueToOutput(0);
    });
  }

  paint() {
    const {
      // width,
      // height,
      active,
      focus,
      fontFamily,
      fontSize,
      fontFace,
      activeBgColor,
      activeBgOnColor,
      bgColor,
      bgOnColor,
      borderColor,
      focusBorderColor,
      textColor,
      textOnColor,
      activeTextColor,
      activeTextOnColor,
      mode,
      text,
      textOn,
      value
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const borderWidth = 0.5;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = borderWidth;
    const buttonBgColor = active ? value ? activeBgOnColor : activeBgColor : value ? bgOnColor : bgColor;
    const buttonBorderColor = focus ? focusBorderColor : borderColor;
    ctx.fillStyle = buttonBgColor;

    if (mode === "button") {
      Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["fillRoundedRect"])(ctx, 0.5, 0.5, width - 1, height - 1, height * 0.5 - 1);
    } else {
      ctx.beginPath();
      ctx.rect(0.5, 0.5, width - 1, height - 1);
      ctx.fill();
    }

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = buttonBorderColor;
    ctx.stroke();
    ctx.font = "".concat(fontFace === "regular" ? "" : fontFace, " ").concat(fontSize, "px ").concat(fontFamily, ", sans-serif");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = active ? value ? activeTextOnColor : activeTextColor : value ? textOnColor : textColor;
    ctx.fillText(value && mode === "toggle" ? textOn : text, width * 0.5, height * 0.5);
  }

}

class LiveText extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        this.state.value = args[0];
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) {
          const value = +data;
          this.state.value = value;
          this.validateValue();
          this.updateUI({
            value: this.state.value
          });
        }

        this.outletAll([this.state.value, this.state.displayValue]);
      } else if (inlet === 1) {
        const value = +data;
        this.state.value = value;
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("changeFromUI", (_ref2) => {
      let {
        value,
        displayValue
      } = _ref2;
      this.state.value = value;
      this.state.displayValue = displayValue;
      this.outletAll([this.state.value, this.state.displayValue]);
    });
  }

}

_defineProperty(LiveText, "description", "Button or toggle with text");

_defineProperty(LiveText, "inlets", [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}]);

_defineProperty(LiveText, "outlets", [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}]);

_defineProperty(LiveText, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}]);

_defineProperty(LiveText, "props", {
  bgColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Background color (inactive / off)",
    isUIState: true
  },
  activeBgColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Background color (active / off)",
    isUIState: true
  },
  bgOnColor: {
    type: "color",
    default: "rgba(165, 165, 165, 1)",
    description: "Background color (inactive / on)",
    isUIState: true
  },
  activeBgOnColor: {
    type: "color",
    default: "rgba(255, 181, 50, 1)",
    description: "Background color (active / on)",
    isUIState: true
  },
  borderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (unfocus)",
    isUIState: true
  },
  focusBorderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (focus)",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "rgba(90, 90, 90, 1)",
    description: "Text color (inactive / off)",
    isUIState: true
  },
  textOnColor: {
    type: "color",
    default: "rgba(90, 90, 90, 1)",
    description: "Text color (inactive / on)",
    isUIState: true
  },
  activeTextColor: {
    type: "color",
    default: "rgba(0, 0, 0, 1)",
    description: "Text color (active / off)",
    isUIState: true
  },
  activeTextOnColor: {
    type: "color",
    default: "rgba(0, 0, 0, 1)",
    description: "Text color (active / on)",
    isUIState: true
  },
  fontFamily: {
    type: "enum",
    enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
    default: "Arial",
    description: "Font family",
    isUIState: true
  },
  fontSize: {
    type: "number",
    default: 10,
    description: "Text font size",
    isUIState: true
  },
  fontFace: {
    type: "enum",
    enums: ["regular", "bold", "italic", "bold italic"],
    default: "regular",
    description: "Text style",
    isUIState: true
  },
  mode: {
    type: "enum",
    enums: ["button", "toggle"],
    default: "toggle",
    description: "Trigger mode",
    isUIState: true
  },
  text: {
    type: "string",
    default: "A",
    description: "Text (off)",
    isUIState: true
  },
  textOn: {
    type: "string",
    default: "B",
    description: "Text (off)",
    isUIState: true
  }
});

_defineProperty(LiveText, "ui", LiveTextUI);

/***/ }),

/***/ "./src/core/objects/live/toggle.tsx":
/*!******************************************!*\
  !*** ./src/core/objects/live/toggle.tsx ***!
  \******************************************/
/*! exports provided: LiveToggle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LiveToggle", function() { return LiveToggle; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/live/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class LiveToggleUI extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "live-toggle");

    _defineProperty(this, "handlePointerDown", () => {
      this.setValueToOutput(1 - +!!this.state.value);
    });
  }

  paint() {
    const {
      // width,
      // height,
      active,
      focus,
      bgColor,
      activeBgColor,
      bgOnColor,
      activeBgOnColor,
      borderColor,
      focusBorderColor,
      value
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const borderWidth = 1;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = borderWidth;
    const buttonBgColor = active ? value ? activeBgOnColor : activeBgColor : value ? bgOnColor : bgColor;
    const buttonBorderColor = focus ? focusBorderColor : borderColor;
    ctx.fillStyle = buttonBgColor;
    ctx.beginPath();
    ctx.rect(borderWidth, borderWidth, width - 2 * borderWidth, height - 2 * borderWidth);
    ctx.fill();
    ctx.strokeStyle = buttonBorderColor;
    ctx.stroke();
  }

}

_defineProperty(LiveToggleUI, "defaultSize", [30, 30]);

class LiveToggle extends _Base__WEBPACK_IMPORTED_MODULE_0__["LiveObject"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      this.state.value = +!!args[0];
      this.validateValue();
      this.updateUI({
        value: this.state.value
      });
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) {
          const value = +data;
          this.state.value = value;
          this.validateValue();
          this.updateUI({
            value: this.state.value
          });
        }

        this.outletAll([this.state.value, this.state.displayValue]);
      } else if (inlet === 1) {
        const value = +data;
        this.state.value = value;
        this.validateValue();
        this.updateUI({
          value: this.state.value
        });
      }
    });
    this.on("changeFromUI", (_ref2) => {
      let {
        value,
        displayValue
      } = _ref2;
      this.state.value = value;
      this.state.displayValue = displayValue;
      this.outletAll([this.state.value, this.state.displayValue]);
    });
  }

}

_defineProperty(LiveToggle, "description", "Toggle");

_defineProperty(LiveToggle, "inlets", [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}]);

_defineProperty(LiveToggle, "outlets", [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}]);

_defineProperty(LiveToggle, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}]);

_defineProperty(LiveToggle, "props", {
  max: {
    type: "number",
    default: 1,
    description: "Maximum value",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgba(90, 90, 90, 1)",
    description: "Background color (inactive)",
    isUIState: true
  },
  activeBgColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Background color (active)",
    isUIState: true
  },
  bgOnColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Background color (on / inactive)",
    isUIState: true
  },
  activeBgOnColor: {
    type: "color",
    default: "rgba(109, 215, 255, 1)",
    description: "Background color (on / active)",
    isUIState: true
  },
  borderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (unfocus)",
    isUIState: true
  },
  focusBorderColor: {
    type: "color",
    default: "rgba(80, 80, 80, 1)",
    description: "Border color (focus)",
    isUIState: true
  }
});

_defineProperty(LiveToggle, "ui", LiveToggleUI);

/***/ })

}]);
//# sourceMappingURL=355161505b6280078f42.js.map