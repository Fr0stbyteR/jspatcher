/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "author": () => (/* binding */ author),
/* harmony export */   "license": () => (/* binding */ license),
/* harmony export */   "keywords": () => (/* binding */ keywords),
/* harmony export */   "version": () => (/* binding */ version),
/* harmony export */   "description": () => (/* binding */ description),
/* harmony export */   "jspatcher": () => (/* binding */ jspatcher),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _package_info__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./package-info */ "./src/package-info.ts");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

const name = _package_info__WEBPACK_IMPORTED_MODULE_0__.default.name.split("/").pop().replace(/^package-/, "");
const { author, license, keywords, version, description, jspatcher } = _package_info__WEBPACK_IMPORTED_MODULE_0__.default;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__spreadValues({ name, author, license, keywords, version, description }, jspatcher));


/***/ }),

/***/ "./src/objects/base.ts":
/*!*****************************!*\
  !*** ./src/objects/base.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveObject)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/base */ "./src/ui/base.tsx");



;
class LiveObject extends _sdk__WEBPACK_IMPORTED_MODULE_1__.BaseObject {
  constructor() {
    super(...arguments);
    this.state = { value: 0 };
    this._ = { displayValue: "0" };
  }
  toValidValue(value) {
    const min = this.getProp("min");
    const max = this.getProp("max");
    const step = this.getProp("step");
    const v = Math.min(max, Math.max(min, value));
    return min + Math.floor((v - min) / step) * step;
  }
  toDisplayValue(value) {
    const { type, unitStyle, units, enums } = this.props;
    return (0,_ui_base__WEBPACK_IMPORTED_MODULE_2__.getDisplayValue)(value, type, unitStyle, units, enums);
  }
  validateValue(valueIn, id) {
    const value = this.toValidValue(valueIn || 0);
    if (value === this.state.value)
      return;
    this.setState({ value }, id);
    this._.displayValue = this.toDisplayValue(this.state.value);
  }
  onChangeFromUI(e) {
    this.emit("changeFromUI", e);
  }
  subscribe() {
    super.subscribe();
    this.on("updateProps", (props) => {
      if (typeof props.max !== "undefined" || typeof props.min !== "undefined" || typeof props.step !== "undefined") {
        const lastValue = this.state.value;
        this.validateValue(this.state.value);
        if (lastValue !== this.state.value)
          this.updateUI({ value: this.state.value });
      }
    });
  }
}
LiveObject.package = _index__WEBPACK_IMPORTED_MODULE_0__.name;
LiveObject.author = _index__WEBPACK_IMPORTED_MODULE_0__.author;
LiveObject.version = _index__WEBPACK_IMPORTED_MODULE_0__.version;
LiveObject.description = _index__WEBPACK_IMPORTED_MODULE_0__.description;
LiveObject.props = {
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
};


/***/ }),

/***/ "./src/objects/button.ts":
/*!*******************************!*\
  !*** ./src/objects/button.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveButton)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/button */ "./src/ui/button.tsx");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");



class LiveButton extends _base__WEBPACK_IMPORTED_MODULE_2__.default {
  subscribe() {
    super.subscribe();
    const validateAndUpdateUI = (value = 0, id) => {
      this.validateValue(value, id);
      this.updateUI({ value: this.state.value });
    };
    const handleUpdateArgs = (args) => {
      if (typeof args[0] === "number") {
        validateAndUpdateUI(+!!args[0]);
      }
    };
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
      validateAndUpdateUI(+!!this.args[0]);
    });
    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        validateAndUpdateUI(+!!data);
        this.outlet(1, this.state.value);
        if (this.state.value && this.getProp("transition") !== "One->Zero")
          this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_0__.Bang());
      }
    });
    this.on("changeFromUI", ({ value }) => {
      const lastValue = this.state.value;
      validateAndUpdateUI(value);
      this.outlet(1, value);
      const transition = this.getProp("transition");
      const b01 = transition !== "One->Zero";
      const b10 = transition !== "Zero->One";
      if (b01 && lastValue < this.state.value || b10 && lastValue > this.state.value)
        this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_0__.Bang());
    });
    this.on("updateState", ({ state: { value }, id }) => {
      validateAndUpdateUI(value, id);
      this.outlet(1, this.state.value);
      if (this.state.value && this.getProp("transition") !== "One->Zero")
        this.outlet(0, new _sdk__WEBPACK_IMPORTED_MODULE_0__.Bang());
    });
  }
}
LiveButton.description = "Button";
LiveButton.inlets = [{
  isHot: true,
  type: "number",
  description: "Output a bang following transition prop."
}];
LiveButton.outlets = [{
  type: "bang",
  description: "Bang"
}, {
  type: "number",
  description: "Current value"
}];
LiveButton.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}];
LiveButton.props = {
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
};
LiveButton.UI = _ui_button__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/objects/dial.ts":
/*!*****************************!*\
  !*** ./src/objects/dial.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveDial)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_dial__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/dial */ "./src/ui/dial.tsx");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");



class LiveDial extends _base__WEBPACK_IMPORTED_MODULE_2__.default {
  subscribe() {
    super.subscribe();
    const validateAndUpdateUI = (value = 0, id) => {
      this.validateValue(value, id);
      this.updateUI({ value: this.state.value });
    };
    const handleUpdateArgs = (args) => {
      if (typeof args[0] === "number") {
        validateAndUpdateUI(args[0]);
      }
    };
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      validateAndUpdateUI(this.args[0] || 0);
    });
    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          validateAndUpdateUI(+data);
        }
        this.outletAll([this.state.value, this._.displayValue]);
      } else if (inlet === 1) {
        validateAndUpdateUI(+data);
      }
    });
    this.on("changeFromUI", ({ value }) => {
      this.validateValue(value);
      this.outletAll([this.state.value, this._.displayValue]);
    });
    this.on("updateState", ({ state: { value }, id }) => {
      validateAndUpdateUI(value, id);
      this.outletAll([this.state.value, this._.displayValue]);
    });
  }
}
LiveDial.description = "Dial knob";
LiveDial.inlets = [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}];
LiveDial.outlets = [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}];
LiveDial.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}];
LiveDial.props = {
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
  fgDialColor: {
    type: "color",
    default: "rgba(105, 105, 105, 1)",
    description: "Forground dial color (inactive)",
    isUIState: true
  },
  activeFgDialColor: {
    type: "color",
    default: "rgba(195, 195, 195, 1)",
    description: "Forground dial color (active)",
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
    description: "Display triangle",
    isUIState: true
  }
};
LiveDial.UI = _ui_dial__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/objects/gain.ts":
/*!*****************************!*\
  !*** ./src/objects/gain.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveGain)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _ui_gain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/gain */ "./src/ui/gain.tsx");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));



class LiveGain extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = __spreadProps(__spreadValues({}, this._), {
      analyserNode: void 0,
      gainNode: this.audioCtx.createGain(),
      bypassNode: this.audioCtx.createGain(),
      $requestTimer: -1,
      levels: []
    });
    this.inletAudioConnections = [{ node: this._.bypassNode, index: 0 }];
    this.outletAudioConnections = [{ node: this._.gainNode, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    const validateAndUpdateUI = (value = 0, id) => {
      this.validateValue(value, id);
      const paramValue = this.state.value === this.getProp("min") ? 0 : this.getProp("mode") === "deciBel" ? _sdk__WEBPACK_IMPORTED_MODULE_2__.MathUtils.dbtoa(this.state.value) : this.state.value;
      this.applyBPF(this._.gainNode.gain, [[paramValue, this.getProp("interp")]]);
      this.updateUI({ value: this.state.value });
    };
    const handleUpdateArgs = (args) => {
      if (typeof args[0] === "number") {
        validateAndUpdateUI(args[0]);
      }
    };
    const startRequest = () => {
      let lastResult = [];
      const request = async () => {
        if (this._.analyserNode && !this._.analyserNode.destroyed) {
          const absMax = await this._.analyserNode.getAbsMax();
          const mode = this.getProp("mode");
          const thresh = this.getProp(mode === "deciBel" ? "thresholdDB" : "thresholdLinear");
          const result = mode === "deciBel" ? absMax.map((v) => _sdk__WEBPACK_IMPORTED_MODULE_2__.MathUtils.atodb(v)) : absMax;
          if (!lastResult.every((v, i) => v === result[i] || Math.abs(v - result[i]) < thresh) || lastResult.length !== result.length) {
            this.outlet(3, result);
            this._.levels = result;
            this.updateUI({ levels: result });
            lastResult = result;
          }
        }
        scheduleRequest();
      };
      const scheduleRequest = () => {
        this._.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
      };
      request();
    };
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 4;
    });
    this.on("updateArgs", handleUpdateArgs);
    let lastMetering;
    let lastMode;
    this.on("updateProps", async (props) => {
      if (props.windowSize && this._.analyserNode)
        this.applyBPF(this._.analyserNode.parameters.get("windowSize"), [[props.windowSize]]);
      if (props.metering && lastMetering !== props.metering && this._.analyserNode) {
        if (lastMetering) {
          if (lastMetering === "postFader")
            this._.gainNode.disconnect(this._.analyserNode);
          else
            this._.bypassNode.disconnect(this._.analyserNode);
        }
        lastMetering = props.metering;
        if (props.metering === "preFader")
          this._.bypassNode.connect(this._.analyserNode, 0, 0);
        else
          this._.gainNode.connect(this._.analyserNode, 0, 0);
      }
      if (props.mode && lastMode && lastMode !== props.mode) {
        lastMode = props.mode;
        let value;
        if (props.mode === "linear") {
          value = _sdk__WEBPACK_IMPORTED_MODULE_2__.MathUtils.dbtoa(this.state.value);
          await this.updateProps({ min: 0, max: 1.5, unitStyle: "float" });
        } else {
          value = _sdk__WEBPACK_IMPORTED_MODULE_2__.MathUtils.atodb(this.state.value);
          await this.updateProps({ min: -70, max: 6, unitStyle: "decibel" });
        }
        validateAndUpdateUI(value);
      }
    });
    this.on("postInit", async () => {
      lastMode = this.getProp("mode");
      validateAndUpdateUI(this.args[0] || 0);
      this._.bypassNode.connect(this._.gainNode);
      await _sdk__WEBPACK_IMPORTED_MODULE_2__.TemporalAnalyserNode.register(this.audioCtx.audioWorklet);
      this._.analyserNode = new _sdk__WEBPACK_IMPORTED_MODULE_2__.TemporalAnalyserNode(this.audioCtx);
      this.applyBPF(this._.analyserNode.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      if (this.getProp("metering") === "preFader")
        this._.bypassNode.connect(this._.analyserNode, 0, 0);
      else
        this._.gainNode.connect(this._.analyserNode, 0, 0);
      startRequest();
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_2__.isBang)(data)) {
          validateAndUpdateUI(+data);
        }
        this.outletAll([, this.state.value, this._.displayValue]);
      }
    });
    this.on("changeFromUI", ({ value }) => {
      this.validateValue(value);
      const paramValue = this.state.value === this.getProp("min") ? 0 : this.getProp("mode") === "deciBel" ? _sdk__WEBPACK_IMPORTED_MODULE_2__.MathUtils.dbtoa(this.state.value) : this.state.value;
      this.applyBPF(this._.gainNode.gain, [[paramValue, this.getProp("interp")]]);
      this.outletAll([, this.state.value, this._.displayValue]);
    });
    this.on("destroy", async () => {
      this._.bypassNode.disconnect();
      this._.gainNode.disconnect();
      window.clearTimeout(this._.$requestTimer);
      if (this._.analyserNode)
        await this._.analyserNode.destroy();
    });
    this.on("updateState", ({ state: { value }, id }) => {
      validateAndUpdateUI(value, id);
      this.outletAll([, this.state.value, this._.displayValue]);
    });
  }
}
LiveGain.description = "Gain slider and monitor";
LiveGain.inlets = [{
  isHot: true,
  type: "signal",
  description: "Signal in, number to set gain"
}];
LiveGain.outlets = [{
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
}];
LiveGain.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}];
LiveGain.props = {
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
};
LiveGain.UI = _ui_gain__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/objects/meter.ts":
/*!******************************!*\
  !*** ./src/objects/meter.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveMeter)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_meter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/meter */ "./src/ui/meter.tsx");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");



class LiveMeter extends _sdk__WEBPACK_IMPORTED_MODULE_0__.BaseObject {
  constructor() {
    super(...arguments);
    this._ = { node: void 0, $requestTimer: -1, levels: [] };
  }
  subscribe() {
    super.subscribe();
    const startRequest = () => {
      let lastResult = [];
      const request = async () => {
        if (this._.node && !this._.node.destroyed) {
          const absMax = await this._.node.getAbsMax();
          const mode = this.getProp("mode");
          const thresh = this.getProp(mode === "deciBel" ? "thresholdDB" : "thresholdLinear");
          const result = mode === "deciBel" ? absMax.map((v) => _sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.atodb(v)) : absMax;
          if (!lastResult.every((v, i) => v === result[i] || Math.abs(v - result[i]) < thresh) || lastResult.length !== result.length) {
            this.outlet(0, result);
            this._.levels = result;
            this.updateUI({ levels: result });
            lastResult = result;
          }
        }
        scheduleRequest();
      };
      const scheduleRequest = () => {
        this._.$requestTimer = window.setTimeout(request, this.getProp("speedLim"));
      };
      request();
    };
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("updateProps", (props) => {
      if (props.windowSize && this._.node)
        this.applyBPF(this._.node.parameters.get("windowSize"), [[props.windowSize]]);
    });
    this.on("postInit", async () => {
      await _sdk__WEBPACK_IMPORTED_MODULE_0__.TemporalAnalyserNode.register(this.audioCtx.audioWorklet);
      this._.node = new _sdk__WEBPACK_IMPORTED_MODULE_0__.TemporalAnalyserNode(this.audioCtx);
      this.applyBPF(this._.node.parameters.get("windowSize"), [[this.getProp("windowSize")]]);
      this.disconnectAudioInlet();
      this.inletAudioConnections[0] = { node: this._.node, index: 0 };
      this.connectAudioInlet();
      startRequest();
    });
    this.on("destroy", () => {
      window.clearTimeout(this._.$requestTimer);
      if (this._.node)
        this._.node.destroy();
    });
  }
}
LiveMeter.package = _base__WEBPACK_IMPORTED_MODULE_2__.default.package;
LiveMeter.author = _base__WEBPACK_IMPORTED_MODULE_2__.default.author;
LiveMeter.version = _base__WEBPACK_IMPORTED_MODULE_2__.default.version;
LiveMeter.description = "Meter";
LiveMeter.inlets = [{
  isHot: true,
  type: "signal",
  description: "Signal to measure"
}];
LiveMeter.outlets = [{
  type: "object",
  description: "Amplitude value: number[]"
}];
LiveMeter.props = {
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
    description: "Active _",
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
};
LiveMeter.UI = _ui_meter__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/objects/numbox.ts":
/*!*******************************!*\
  !*** ./src/objects/numbox.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveNumbox)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_numbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/numbox */ "./src/ui/numbox.tsx");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");



class LiveNumbox extends _base__WEBPACK_IMPORTED_MODULE_2__.default {
  subscribe() {
    super.subscribe();
    const validateAndUpdateUI = (value = 0, id) => {
      this.validateValue(value, id);
      this.updateUI({ value: this.state.value });
    };
    const handleUpdateArgs = (args) => {
      if (typeof args[0] === "number") {
        validateAndUpdateUI(args[0]);
      }
    };
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      validateAndUpdateUI(this.args[0] || 0);
    });
    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          validateAndUpdateUI(+data);
        }
        this.outletAll([this.state.value, this._.displayValue]);
      } else if (inlet === 1) {
        validateAndUpdateUI(+data);
      }
    });
    this.on("changeFromUI", ({ value }) => {
      this.validateValue(value);
      this.outletAll([this.state.value, this._.displayValue]);
    });
    this.on("updateState", ({ state: { value }, id }) => {
      validateAndUpdateUI(value, id);
      this.outletAll([this.state.value, this._.displayValue]);
    });
  }
}
LiveNumbox.description = "Number box";
LiveNumbox.inlets = [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}];
LiveNumbox.outlets = [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}];
LiveNumbox.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}];
LiveNumbox.props = {
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
};
LiveNumbox.UI = _ui_numbox__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/objects/slider.ts":
/*!*******************************!*\
  !*** ./src/objects/slider.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveSlider)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/slider */ "./src/ui/slider.tsx");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");



class LiveSlider extends _base__WEBPACK_IMPORTED_MODULE_2__.default {
  subscribe() {
    super.subscribe();
    const validateAndUpdateUI = (value = 0, id) => {
      this.validateValue(value, id);
      this.updateUI({ value: this.state.value });
    };
    const handleUpdateArgs = (args) => {
      if (typeof args[0] === "number") {
        validateAndUpdateUI(+!!args[0]);
      }
    };
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      validateAndUpdateUI(this.args[0] || 0);
    });
    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          validateAndUpdateUI(+data);
        }
        this.outletAll([this.state.value, this._.displayValue]);
      } else if (inlet === 1) {
        validateAndUpdateUI(+data);
      }
    });
    this.on("changeFromUI", ({ value }) => {
      this.validateValue(value);
      this.outletAll([this.state.value, this._.displayValue]);
    });
    this.on("updateState", ({ state: { value }, id }) => {
      validateAndUpdateUI(value, id);
      this.outletAll([this.state.value, this._.displayValue]);
    });
  }
}
LiveSlider.description = "Slider";
LiveSlider.inlets = [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}];
LiveSlider.outlets = [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}];
LiveSlider.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}];
LiveSlider.props = {
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
};
LiveSlider.UI = _ui_slider__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/objects/tab.ts":
/*!****************************!*\
  !*** ./src/objects/tab.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveTab)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_tab__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/tab */ "./src/ui/tab.tsx");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");



class LiveTab extends _base__WEBPACK_IMPORTED_MODULE_2__.default {
  subscribe() {
    super.subscribe();
    const validateAndUpdateUI = (value = 0, id) => {
      this.validateValue(value, id);
      this.updateUI({ value: this.state.value });
    };
    const handleUpdateArgs = (args) => {
      if (typeof args[0] === "number") {
        validateAndUpdateUI(args[0]);
      }
    };
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      validateAndUpdateUI(this.args[0] || 0);
    });
    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          validateAndUpdateUI(+data);
        }
        this.outletAll([this.state.value, this._.displayValue]);
      } else if (inlet === 1) {
        validateAndUpdateUI(+data);
      }
    });
    this.on("changeFromUI", ({ value }) => {
      this.validateValue(value);
      this.outletAll([this.state.value, this._.displayValue]);
    });
    this.on("updateState", ({ state: { value }, id }) => {
      validateAndUpdateUI(value, id);
      this.outletAll([this.state.value, this._.displayValue]);
    });
  }
}
LiveTab.description = "Buttons as tab";
LiveTab.inlets = [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}];
LiveTab.outlets = [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}];
LiveTab.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}];
LiveTab.props = {
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
};
LiveTab.UI = _ui_tab__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/objects/text.ts":
/*!*****************************!*\
  !*** ./src/objects/text.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveText)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/text */ "./src/ui/text.tsx");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");



class LiveText extends _base__WEBPACK_IMPORTED_MODULE_2__.default {
  subscribe() {
    super.subscribe();
    const validateAndUpdateUI = (value = 0, id) => {
      this.validateValue(value, id);
      this.updateUI({ value: this.state.value });
    };
    const handleUpdateArgs = (args) => {
      if (typeof args[0] === "number") {
        validateAndUpdateUI(args[0]);
      }
    };
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      validateAndUpdateUI(this.args[0] || 0);
    });
    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          validateAndUpdateUI(+data);
        }
        this.outletAll([this.state.value, this._.displayValue]);
      } else if (inlet === 1) {
        validateAndUpdateUI(+data);
      }
    });
    this.on("changeFromUI", ({ value }) => {
      this.validateValue(value);
      this.outletAll([this.state.value, this._.displayValue]);
    });
    this.on("updateState", ({ state: { value }, id }) => {
      validateAndUpdateUI(value, id);
      this.outletAll([this.state.value, this._.displayValue]);
    });
  }
}
LiveText.description = "Button or toggle with text";
LiveText.inlets = [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}];
LiveText.outlets = [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}];
LiveText.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}];
LiveText.props = {
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
};
LiveText.UI = _ui_text__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/objects/toggle.ts":
/*!*******************************!*\
  !*** ./src/objects/toggle.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveToggle)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _ui_toggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui/toggle */ "./src/ui/toggle.tsx");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");



class LiveToggle extends _base__WEBPACK_IMPORTED_MODULE_2__.default {
  subscribe() {
    super.subscribe();
    const validateAndUpdateUI = (value = 0, id) => {
      this.validateValue(value, id);
      this.updateUI({ value: this.state.value });
    };
    const handleUpdateArgs = (args) => {
      if (typeof args[0] === "number") {
        validateAndUpdateUI(args[0]);
      }
    };
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      validateAndUpdateUI(this.args[0] || 0);
    });
    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          validateAndUpdateUI(+data);
        }
        this.outletAll([this.state.value, this._.displayValue]);
      } else if (inlet === 1) {
        validateAndUpdateUI(+data);
      }
    });
    this.on("changeFromUI", ({ value }) => {
      this.validateValue(value);
      this.outletAll([this.state.value, this._.displayValue]);
    });
    this.on("updateState", ({ state: { value }, id }) => {
      validateAndUpdateUI(value, id);
      this.outletAll([this.state.value, this._.displayValue]);
    });
  }
}
LiveToggle.description = "Toggle";
LiveToggle.inlets = [{
  isHot: true,
  type: "number",
  description: "Set and output the value"
}, {
  isHot: false,
  type: "number",
  description: "Set without output the value"
}];
LiveToggle.outlets = [{
  type: "number",
  description: "Number value"
}, {
  type: "string",
  description: "Display value"
}];
LiveToggle.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Initial value"
}];
LiveToggle.props = {
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
};
LiveToggle.UI = _ui_toggle__WEBPACK_IMPORTED_MODULE_1__.default;


/***/ }),

/***/ "./src/package-info.ts":
/*!*****************************!*\
  !*** ./src/package-info.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

var _package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../package.json */ "./package.json");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/*#__PURE__*/ (_package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_package_json__WEBPACK_IMPORTED_MODULE_0__, 2))));


/***/ }),

/***/ "./src/sdk.ts":
/*!********************!*\
  !*** ./src/sdk.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "React": () => (/* binding */ React),
/* harmony export */   "ReactDOM": () => (/* binding */ ReactDOM),
/* harmony export */   "SemanticUI": () => (/* binding */ SemanticUI),
/* harmony export */   "PatcherAudio": () => (/* binding */ PatcherAudio),
/* harmony export */   "OperableAudioBuffer": () => (/* binding */ OperableAudioBuffer),
/* harmony export */   "Patcher": () => (/* binding */ Patcher),
/* harmony export */   "Box": () => (/* binding */ Box),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "BaseObject": () => (/* binding */ BaseObject),
/* harmony export */   "DefaultObject": () => (/* binding */ DefaultObject),
/* harmony export */   "BaseUI": () => (/* binding */ BaseUI),
/* harmony export */   "DefaultUI": () => (/* binding */ DefaultUI),
/* harmony export */   "CanvasUI": () => (/* binding */ CanvasUI),
/* harmony export */   "CodeUI": () => (/* binding */ CodeUI),
/* harmony export */   "DefaultPopupUI": () => (/* binding */ DefaultPopupUI),
/* harmony export */   "CodePopupUI": () => (/* binding */ CodePopupUI),
/* harmony export */   "DOMUI": () => (/* binding */ DOMUI),
/* harmony export */   "generateDefaultObject": () => (/* binding */ generateDefaultObject),
/* harmony export */   "generateRemoteObject": () => (/* binding */ generateRemoteObject),
/* harmony export */   "generateRemotedObject": () => (/* binding */ generateRemotedObject),
/* harmony export */   "Bang": () => (/* binding */ Bang),
/* harmony export */   "isBang": () => (/* binding */ isBang),
/* harmony export */   "TransmitterNode": () => (/* binding */ TransmitterNode),
/* harmony export */   "TemporalAnalyserNode": () => (/* binding */ TemporalAnalyserNode),
/* harmony export */   "SpectralAnalyserNode": () => (/* binding */ SpectralAnalyserNode),
/* harmony export */   "MathUtils": () => (/* binding */ MathUtils),
/* harmony export */   "BufferUtils": () => (/* binding */ BufferUtils),
/* harmony export */   "Utils": () => (/* binding */ Utils),
/* harmony export */   "getReactMonacoEditor": () => (/* binding */ getReactMonacoEditor)
/* harmony export */ });
const sdk = globalThis.jspatcherEnv.sdk;
const {
  React,
  ReactDOM,
  SemanticUI,
  PatcherAudio,
  OperableAudioBuffer,
  Patcher,
  Box,
  Line,
  BaseObject,
  DefaultObject,
  BaseUI,
  DefaultUI,
  CanvasUI,
  CodeUI,
  DefaultPopupUI,
  CodePopupUI,
  DOMUI,
  generateDefaultObject,
  generateRemoteObject,
  generateRemotedObject,
  Bang,
  isBang,
  TransmitterNode,
  TemporalAnalyserNode,
  SpectralAnalyserNode,
  MathUtils,
  BufferUtils,
  Utils,
  getReactMonacoEditor
} = sdk;


/***/ }),

/***/ "./src/ui/base.tsx":
/*!*************************!*\
  !*** ./src/ui/base.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDisplayValue": () => (/* binding */ getDisplayValue),
/* harmony export */   "default": () => (/* binding */ LiveObjectUI)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

const getDisplayValue = (value, type, unitstyle, units, enums) => {
  if (type === "enum")
    return enums[value];
  if (unitstyle === "int")
    return value.toFixed(0);
  if (unitstyle === "float")
    return value.toFixed(2);
  if (unitstyle === "time")
    return value.toFixed(type === "int" ? 0 : 2) + " ms";
  if (unitstyle === "hertz")
    return value.toFixed(type === "int" ? 0 : 2) + " Hz";
  if (unitstyle === "decibel")
    return value.toFixed(type === "int" ? 0 : 2) + " dB";
  if (unitstyle === "%")
    return value.toFixed(type === "int" ? 0 : 2) + " %";
  if (unitstyle === "pan")
    return value === 0 ? "C" : (type === "int" ? Math.abs(value) : Math.abs(value).toFixed(2)) + (value < 0 ? " L" : " R");
  if (unitstyle === "semitones")
    return value.toFixed(type === "int" ? 0 : 2) + " st";
  if (unitstyle === "midi")
    return _sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.toMIDI(value);
  if (unitstyle === "custom")
    return value.toFixed(type === "int" ? 0 : 2) + " " + units;
  if (unitstyle === "native")
    return value.toFixed(type === "int" ? 0 : 2);
  return "N/A";
};
class LiveObjectUI extends _sdk__WEBPACK_IMPORTED_MODULE_0__.CanvasUI {
  constructor() {
    super(...arguments);
    this.$changeTimer = -1;
    this.state = __spreadProps(__spreadValues({}, this.state), {
      value: this.object.state.value
    });
    this.handleKeyDown = (e) => {
    };
    this.handleKeyUp = (e) => {
    };
    this.handleTouchStart = (e) => {
      this.canvas.focus();
      const rect = this.canvas.getBoundingClientRect();
      let prevX = e.touches[0].clientX;
      let prevY = e.touches[0].clientY;
      const fromX = prevX - rect.left;
      const fromY = prevY - rect.top;
      const prevValue = this.state.value;
      this.handlePointerDown({ x: fromX, y: fromY, originalEvent: e });
      const handleTouchMove = (e2) => {
        e2.preventDefault();
        const clientX = e2.changedTouches[0].clientX;
        const clientY = e2.changedTouches[0].clientY;
        const movementX = clientX - prevX;
        const movementY = clientY - prevY;
        prevX = clientX;
        prevY = clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        this.handlePointerDrag({ prevValue, x, y, fromX, fromY, movementX, movementY, originalEvent: e2 });
      };
      const handleTouchEnd = (e2) => {
        e2.preventDefault();
        const x = e2.changedTouches[0].clientX - rect.left;
        const y = e2.changedTouches[0].clientY - rect.top;
        this.handlePointerUp({ x, y, originalEvent: e2 });
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd, { passive: false });
    };
    this.handleWheel = (e) => {
    };
    this.handleClick = (e) => {
    };
    this.handleMouseDown = (e) => {
      e.preventDefault();
      this.canvas.focus();
      const rect = this.canvas.getBoundingClientRect();
      const fromX = e.clientX - rect.left;
      const fromY = e.clientY - rect.top;
      const prevValue = this.state.value;
      this.handlePointerDown({ x: fromX, y: fromY, originalEvent: e });
      const handleMouseMove = (e2) => {
        e2.preventDefault();
        const x = e2.clientX - rect.left;
        const y = e2.clientY - rect.top;
        this.handlePointerDrag({ prevValue, x, y, fromX, fromY, movementX: e2.movementX, movementY: e2.movementY, originalEvent: e2 });
      };
      const handleMouseUp = (e2) => {
        e2.preventDefault();
        const x = e2.clientX - rect.left;
        const y = e2.clientY - rect.top;
        this.handlePointerUp({ x, y, originalEvent: e2 });
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };
    this.handleMouseOver = (e) => {
    };
    this.handleMouseOut = (e) => {
    };
    this.handleContextMenu = (e) => {
    };
    this.handlePointerDown = (e) => {
    };
    this.handlePointerDrag = (e) => {
    };
    this.handlePointerUp = (e) => {
    };
    this.handleFocusIn = (e) => this.setState({ focus: true });
    this.handleFocusOut = (e) => this.setState({ focus: false });
    this.changeCallback = () => {
      this.props.object.onChangeFromUI({ value: this.state.value, displayValue: this.displayValue });
      this.$changeTimer = -1;
    };
  }
  get distance() {
    return LiveObjectUI.getDistance(this.state);
  }
  static getDistance(state) {
    const { type, max, min, value, exponent, enums } = state;
    const normalized = type === "enum" ? Math.max(0, Math.min(enums.length - 1, value)) / (enums.length - 1) : (Math.max(min, Math.min(max, value)) - min) / (max - min);
    return _sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.iNormExp(normalized || 0, exponent);
  }
  get stepsCount() {
    const { type, max, min, step, enums } = this.state;
    if (type === "enum")
      return enums.length - 1;
    if (type === "float")
      return Math.min(Number.MAX_SAFE_INTEGER, Math.floor((max - min) / step));
    return Math.min(Math.floor((max - min) / (Math.round(step) || 1)), max - min);
  }
  get displayValue() {
    const { value, type, unitStyle, units, enums } = this.state;
    return getDisplayValue(value, type, unitStyle, units, enums);
  }
  setValueToOutput(value) {
    this.setState({ value });
    this.scheduleChangeHandler();
  }
  scheduleChangeHandler() {
    if (this.$changeTimer === -1)
      this.$changeTimer = window.setTimeout(this.changeCallback, this.state.speedLim);
  }
  paint() {
  }
  render() {
    return /* @__PURE__ */ _sdk__WEBPACK_IMPORTED_MODULE_0__.React.createElement(_sdk__WEBPACK_IMPORTED_MODULE_0__.BaseUI, __spreadValues({}, this.props), /* @__PURE__ */ _sdk__WEBPACK_IMPORTED_MODULE_0__.React.createElement("canvas", __spreadValues({
      ref: this.refCanvas,
      className: ["live-component", this.className].join(" "),
      style: { position: "absolute", display: "inline-block", width: "100%", height: "100%" },
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


/***/ }),

/***/ "./src/ui/button.tsx":
/*!***************************!*\
  !*** ./src/ui/button.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveButtonUI)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");

class LiveButtonUI extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.className = "live-button";
    this.inTouch = false;
    this.$resetTimer = -1;
    this.resetCallback = () => {
      this.setValueToOutput(0);
      this.$resetTimer = -1;
    };
    this.handlePointerDown = () => {
      this.inTouch = true;
      this.setValueToOutput(1);
    };
    this.handlePointerUp = () => {
      this.inTouch = false;
      this.setValueToOutput(0);
    };
  }
  paint() {
    if (this.$resetTimer !== -1) {
      window.clearTimeout(this.$resetTimer);
      this.resetCallback();
    }
    const {
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
    if (!ctx)
      return;
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
    if (value && !this.inTouch)
      this.$resetTimer = window.setTimeout(this.resetCallback, 100);
  }
}
LiveButtonUI.defaultSize = [30, 30];


/***/ }),

/***/ "./src/ui/dial.tsx":
/*!*************************!*\
  !*** ./src/ui/dial.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveDialUI)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));


class LiveDialUI extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this.state = __spreadProps(__spreadValues({}, this.state), {
      inputBuffer: ""
    });
    this.className = "live-dial";
    this.interactionRect = [0, 0, 0, 0];
    this.inTouch = false;
    this.handlePointerDown = (e) => {
      if (e.x < this.interactionRect[0] || e.x > this.interactionRect[0] + this.interactionRect[2] || e.y < this.interactionRect[1] || e.y > this.interactionRect[1] + this.interactionRect[3])
        return;
      this.inTouch = true;
    };
    this.handlePointerDrag = (e) => {
      if (!this.inTouch)
        return;
      const newValue = this.getValueFromDelta(e);
      if (newValue !== this.state.value)
        this.setValueToOutput(newValue);
    };
    this.handlePointerUp = () => {
      this.inTouch = false;
    };
    this.handleKeyDown = (e) => {
      if (!this.state.inputBuffer) {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight")
          addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft")
          addStep = -1;
        if (addStep !== 0) {
          const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
          if (newValue !== this.state.value)
            this.setValueToOutput(newValue);
        }
      }
      if (e.key.match(/[0-9.-]/)) {
        this.setState({ inputBuffer: this.state.inputBuffer + e.key });
        return;
      }
      if (e.key === "Backspace") {
        this.setState({ inputBuffer: this.state.inputBuffer.slice(0, -1) });
        return;
      }
      if (e.key === "Enter") {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({ inputBuffer: "" });
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
    };
    this.handleFocusOut = () => {
      if (this.state.inputBuffer) {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({ inputBuffer: "" });
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
      this.setState({ focus: false });
    };
  }
  paint() {
    const {
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
      activeFgDialColor,
      fgDialColor,
      textColor,
      triBorderColor,
      triColor,
      shortName,
      inputBuffer
    } = this.state;
    const ctx = this.ctx;
    if (!ctx)
      return;
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
      dialHeight = Math.min(width, height) / 3;
      start = -3 * Math.PI * 0.5;
      end = 0;
      valPos = start + _sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.toRad(this.distance * 270);
    } else {
      dialHeight = Math.min(width, height) / 2;
      start = Math.PI - 3 * Math.PI / 8;
      end = 2 * Math.PI + 3 * Math.PI / 8;
      valPos = start + _sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.toRad(this.distance * 315);
    }
    const dialRadius = dialHeight * 0.5;
    let dialCenterX = width * 0.5;
    let dialCenterY = height * 0.5 + 1;
    if (appearance === "panel") {
      dialCenterY += 10;
    } else if (appearance === "vertical") {
      if (showNumber)
        dialCenterY -= fontSize - 5;
      if (showName)
        dialCenterY += fontSize - 5;
      if (triangle)
        dialCenterY += triangleHeight - 1;
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
      _sdk__WEBPACK_IMPORTED_MODULE_0__.Utils.roundedRect(ctx, 1, 1, width - 2, height - 2, 5);
      ctx.fillStyle = panelColor;
      _sdk__WEBPACK_IMPORTED_MODULE_0__.Utils.fillRoundedRect(ctx, 1.2, 1.2, width - 2.4, 30 - 0.4, [5, 5, 0, 0]);
    }
    ctx.strokeStyle = active ? activeFgDialColor : fgDialColor;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(arcStartX, arcStartY, endCapRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(arcEndX, arcEndY, endCapRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dialCenterX, dialCenterY, dialRadius, start, end);
    ctx.stroke();
    ctx.strokeStyle = active ? activeDialColor : dialColor;
    ctx.fillStyle = ctx.strokeStyle;
    if (triangle) {
      const midpoint = (start + end) * 0.5;
      ctx.strokeStyle = active ? activeDialColor : dialColor;
      ctx.beginPath();
      if (distance > 0.5)
        ctx.arc(dialCenterX, dialCenterY, dialRadius, midpoint, valPos);
      else
        ctx.arc(dialCenterX, dialCenterY, dialRadius, valPos, midpoint);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(arcStartX, arcStartY, endCapRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dialCenterX, dialCenterY, dialRadius, start, valPos);
      ctx.stroke();
    }
    ctx.strokeStyle = active ? activeNeedleColor : needleColor;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(dialCenterX, dialCenterY, endCapRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(valuePosX, valuePosY, endCapRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(dialCenterX, dialCenterY);
    ctx.lineTo(valuePosX, valuePosY);
    ctx.stroke();
    ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
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
    }
    if (triangle) {
      if (!distance)
        ctx.fillStyle = triColor;
      else if (!active)
        ctx.fillStyle = dialColor;
      else
        ctx.fillStyle = activeDialColor;
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
    const { type, min, max, enums, exponent } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = 100;
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const prevPixels = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ value: e.prevValue, type, min, max, enums, exponent }) * totalPixels;
    const pixels = prevPixels + e.fromY - e.y;
    let steps = Math.round(_sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum")
      return steps;
    if (type === "int")
      return Math.round(steps * step + min);
    return steps * step + min;
  }
}
LiveDialUI.defaultSize = [45, 60];


/***/ }),

/***/ "./src/ui/gain.tsx":
/*!*************************!*\
  !*** ./src/ui/gain.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveGainUI)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));


class LiveGainUI extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this.state = __spreadProps(__spreadValues({}, this.state), {
      levels: this.object._.levels,
      inputBuffer: ""
    });
    this.className = "live-gain";
    this.interactionRect = [0, 0, 0, 0];
    this.inTouch = false;
    this.levels = [];
    this.maxValues = [];
    this.handlePointerDown = (e) => {
      if (e.x < this.interactionRect[0] || e.x > this.interactionRect[0] + this.interactionRect[2] || e.y < this.interactionRect[1] || e.y > this.interactionRect[1] + this.interactionRect[3])
        return;
      if (!this.state.relative) {
        const newValue = this.getValueFromPos(e);
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
      this.inTouch = true;
    };
    this.handlePointerDrag = (e) => {
      if (!this.inTouch)
        return;
      let newValue;
      if (this.state.relative)
        newValue = this.getValueFromDelta(e);
      else
        newValue = this.getValueFromPos(e);
      if (newValue !== this.state.value)
        this.setValueToOutput(newValue);
    };
    this.handlePointerUp = () => {
      this.inTouch = false;
    };
    this.handleKeyDown = (e) => {
      if (!this.state.inputBuffer) {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight")
          addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft")
          addStep = -1;
        if (addStep !== 0) {
          const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
          if (newValue !== this.state.value)
            this.setValueToOutput(newValue);
        }
      }
      if (e.key.match(/[0-9.-]/)) {
        this.setState({ inputBuffer: this.state.inputBuffer + e.key });
        return;
      }
      if (e.key === "Backspace") {
        this.setState({ inputBuffer: this.state.inputBuffer.slice(0, -1) });
        return;
      }
      if (e.key === "Enter") {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({ inputBuffer: "" });
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
    };
    this.handleFocusOut = () => {
      if (this.state.inputBuffer) {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({ inputBuffer: "" });
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
      this.setState({ focus: false });
    };
  }
  paint() {
    const {
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
    if (!ctx)
      return;
    const lineWidth = 0.5;
    const padding = 8;
    const distance = this.distance;
    const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    this.levels = levels.slice();
    if (this.levels.length === 0)
      this.levels = [min];
    if (this.levels.find((v, i) => typeof this.maxValues[i] === "undefined" || v > this.maxValues[i])) {
      this.maxValues = [...this.levels];
      if (this.maxTimer)
        window.clearTimeout(this.maxTimer);
      this.maxTimer = window.setTimeout(() => {
        this.maxValues = [...this.levels];
        this.maxTimer = void 0;
        this.schedulePaint();
      }, 1e3);
    } else if (this.levels.find((v, i) => v < this.maxValues[i]) && typeof this.maxTimer === "undefined") {
      this.maxTimer = window.setTimeout(() => {
        this.maxValues = [...this.levels];
        this.maxTimer = void 0;
        this.schedulePaint();
      }, 1e3);
    }
    const channels = this.levels.length;
    const clipValue = +(mode === "linear");
    const meterThick = 8;
    const metersThick = (meterThick + 1) * channels - 1;
    ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    if (showName)
      ctx.fillText(shortName, width * 0.5, fontSize, width);
    if (showNumber) {
      if (orientation === "horizontal") {
        ctx.textAlign = "left";
        ctx.fillText(displayValue, 4, height - 2, width);
      } else {
        ctx.fillText(displayValue, width * 0.5, height - 2, width);
      }
    }
    this.interactionRect = [
      0,
      fontSize + padding,
      width,
      height - 2 * (fontSize + padding)
    ];
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
      this.levels.forEach((v) => {
        if (v < max)
          ctx.fillRect(0, $top, $width, $height);
        $top += $height + 1;
      });
      $top = 0;
      ctx.fillStyle = fgColor;
      this.levels.forEach((v, i) => {
        const distance2 = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: v, min, max, exponent });
        if (distance2 > 0)
          ctx.fillRect(0, $top, distance2 * $width, $height);
        const histMax = this.maxValues[i];
        if (typeof histMax === "number" && histMax > v) {
          const histDistance = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: histMax, min, max, exponent });
          ctx.fillRect(Math.min($width - 1, histDistance * $width), $top, 1, $height);
        }
        $top += $height + 1;
      });
    } else {
      const clipDistance = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: clipValue, min, max, exponent });
      const clip = $width - clipDistance * $width;
      const hotStop = $width - clip;
      const warmStop = hotStop - 1;
      const gradient = ctx.createLinearGradient(0, 0, $width, 0);
      gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
      gradient.addColorStop(warmStop / $width, active ? warmColor : inactiveWarmColor);
      gradient.addColorStop(hotStop / $width, active ? hotColor : inactiveWarmColor);
      gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);
      let $top = 0;
      this.levels.forEach((v) => {
        if (v < clipValue)
          ctx.fillRect(0, $top, warmStop, $height);
        if (v < max)
          ctx.fillRect(hotStop, $top, clip, $height);
        $top += $height + 1;
      });
      $top = 0;
      ctx.fillStyle = gradient;
      this.levels.forEach((v, i) => {
        const distance2 = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: v, min, max, exponent });
        if (distance2 > 0)
          ctx.fillRect(0, $top, Math.min(warmStop, distance2 * $width), $height);
        if (distance2 > clipDistance)
          ctx.fillRect(hotStop, $top, Math.min(clip, (distance2 - clipDistance) * $width), $height);
        const histMax = this.maxValues[i];
        if (typeof histMax === "number" && histMax > v) {
          const histDistance = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: histMax, min, max, exponent });
          if (histDistance <= clipDistance)
            ctx.fillRect(histDistance * $width, $top, 1, $height);
          else
            ctx.fillRect(Math.min($width - 1, histDistance * $width), $top, 1, $height);
        }
        $top += $height + 1;
      });
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = triBorderColor;
    const triOrigin = [
      $width * distance,
      metersThick + lineWidth
    ];
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
    const { orientation, type, min, exponent } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = orientation === "vertical" ? this.interactionRect[3] : this.interactionRect[2];
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const pixels = orientation === "vertical" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0];
    let steps = Math.round(_sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum")
      return steps;
    if (type === "int")
      return Math.round(steps * step + min);
    return steps * step + min;
  }
  getValueFromDelta(e) {
    const { type, min, max, enums, exponent, orientation } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = orientation === "horizontal" ? this.interactionRect[2] : this.interactionRect[3];
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const prevPixels = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ value: e.prevValue, type, min, max, enums, exponent }) * totalPixels;
    const pixels = prevPixels + (orientation === "horizontal" ? e.x - e.fromX : e.fromY - e.y);
    let steps = Math.round(_sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum")
      return steps;
    if (type === "int")
      return Math.round(steps * step + min);
    return steps * step + min;
  }
}
LiveGainUI.defaultSize = [120, 45];


/***/ }),

/***/ "./src/ui/meter.tsx":
/*!**************************!*\
  !*** ./src/ui/meter.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveMeterUI)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));


class LiveMeterUI extends _sdk__WEBPACK_IMPORTED_MODULE_0__.CanvasUI {
  constructor() {
    super(...arguments);
    this.state = __spreadProps(__spreadValues({}, this.state), {
      levels: this.object._.levels
    });
    this.levels = [];
    this.maxValues = [];
  }
  paint() {
    const {
      active,
      mode,
      levels,
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
    if (!ctx)
      return;
    let [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    this.levels = levels.slice();
    if (this.levels.length === 0)
      this.levels = [min];
    if (this.levels.find((v, i) => typeof this.maxValues[i] === "undefined" || v > this.maxValues[i])) {
      this.maxValues = [...this.levels];
      if (this.maxTimer)
        window.clearTimeout(this.maxTimer);
      this.maxTimer = window.setTimeout(() => {
        this.maxValues = [...this.levels];
        this.maxTimer = void 0;
        this.schedulePaint();
      }, 1e3);
    } else if (this.levels.find((v, i) => v < this.maxValues[i]) && typeof this.maxTimer === "undefined") {
      this.maxTimer = window.setTimeout(() => {
        this.maxValues = [...this.levels];
        this.maxTimer = void 0;
        this.schedulePaint();
      }, 1e3);
    }
    const channels = this.levels.length;
    const clipValue = +(mode === "linear");
    if (orientation === "vertical") {
      ctx.save();
      ctx.translate(0, height);
      ctx.rotate(-Math.PI * 0.5);
      [height, width] = [width, height];
    }
    const $height = (height - channels - 1) / this.levels.length;
    ctx.fillStyle = bgColor;
    if (min >= clipValue || clipValue >= max) {
      const fgColor = min >= clipValue ? active ? overloadColor : inactiveWarmColor : active ? coldColor : inactiveColdColor;
      let $top = 0;
      this.levels.forEach((v) => {
        if (v < max)
          ctx.fillRect(0, $top, width, $height);
        $top += $height + 1;
      });
      $top = 0;
      ctx.fillStyle = fgColor;
      this.levels.forEach((v, i) => {
        const distance = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: v, min, max, exponent: 0 });
        if (distance > 0)
          ctx.fillRect(0, $top, distance * width, $height);
        const histMax = this.maxValues[i];
        if (typeof histMax === "number" && histMax > v) {
          const histDistance = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: histMax, min, max, exponent: 0 });
          ctx.fillRect(Math.min(width - 1, histDistance * width), $top, 1, $height);
        }
        $top += $height + 1;
      });
    } else {
      const clipDistance = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: clipValue, min, max, exponent: 0 });
      const clip = width - clipDistance * width;
      const hotStop = width - clip;
      const warmStop = hotStop - 1;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, active ? coldColor : inactiveColdColor);
      gradient.addColorStop(warmStop / width, active ? warmColor : inactiveWarmColor);
      gradient.addColorStop(hotStop / width, active ? hotColor : inactiveWarmColor);
      gradient.addColorStop(1, active ? overloadColor : inactiveWarmColor);
      let $top = 0;
      this.levels.forEach((v) => {
        if (v < clipValue)
          ctx.fillRect(0, $top, warmStop, $height);
        if (v < max)
          ctx.fillRect(hotStop, $top, clip, $height);
        $top += $height + 1;
      });
      $top = 0;
      ctx.fillStyle = gradient;
      this.levels.forEach((v, i) => {
        const distance = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: v, min, max, exponent: 0 });
        if (distance > 0)
          ctx.fillRect(0, $top, Math.min(warmStop, distance * width), $height);
        if (distance > clipDistance)
          ctx.fillRect(hotStop, $top, Math.min(clip, (distance - clipDistance) * width), $height);
        const histMax = this.maxValues[i];
        if (typeof histMax === "number" && histMax > v) {
          const histDistance = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ type: "float", value: histMax, min, max, exponent: 0 });
          if (histDistance <= clipDistance)
            ctx.fillRect(histDistance * width, $top, 1, $height);
          else
            ctx.fillRect(Math.min(width - 1, histDistance * width), $top, 1, $height);
        }
        $top += $height + 1;
      });
    }
    if (orientation === "vertical")
      ctx.restore();
  }
}


/***/ }),

/***/ "./src/ui/numbox.tsx":
/*!***************************!*\
  !*** ./src/ui/numbox.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveNumboxUI)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));


class LiveNumboxUI extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this.state = __spreadProps(__spreadValues({}, this.state), {
      inputBuffer: ""
    });
    this.className = "live-numbox";
    this.handlePointerDrag = (e) => {
      const newValue = this.getValueFromDelta(e);
      if (newValue !== this.state.value)
        this.setValueToOutput(newValue);
    };
    this.handleKeyDown = (e) => {
      if (!this.state.inputBuffer) {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight")
          addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft")
          addStep = -1;
        if (addStep !== 0) {
          const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
          if (newValue !== this.state.value)
            this.setValueToOutput(newValue);
        }
      }
      if (e.key.match(/[0-9.-]/)) {
        this.setState({ inputBuffer: this.state.inputBuffer + e.key });
        return;
      }
      if (e.key === "Backspace") {
        this.setState({ inputBuffer: this.state.inputBuffer.slice(0, -1) });
        return;
      }
      if (e.key === "Enter") {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({ inputBuffer: "" });
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
    };
    this.handleFocusOut = () => {
      if (this.state.inputBuffer) {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({ inputBuffer: "" });
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
      this.setState({ focus: false });
    };
  }
  paint() {
    const {
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
    if (!ctx)
      return;
    const distance = this.distance;
    const displayValue = inputBuffer ? inputBuffer + "_" : this.displayValue;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = active ? activeBgColor : bgColor;
    ctx.rect(0, 0, width, height);
    ctx.fill();
    if (appearance === "slider" && active && distance) {
      ctx.fillStyle = activeSliderColor;
      ctx.fillRect(0, 0, distance * width, height);
    }
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
    }
    ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayValue, width * 0.5, height * 0.5, width);
  }
  getValueFromDelta(e) {
    const { type, min, max, enums, exponent } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = 100;
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const prevPixels = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ value: e.prevValue, type, min, max, enums, exponent }) * totalPixels;
    const pixels = prevPixels + e.fromY - e.y;
    let steps = Math.round(_sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum")
      return steps;
    if (type === "int")
      return Math.round(steps * step + min);
    return steps * step + min;
  }
}


/***/ }),

/***/ "./src/ui/slider.tsx":
/*!***************************!*\
  !*** ./src/ui/slider.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveSliderUI)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));


class LiveSliderUI extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this.state = __spreadProps(__spreadValues({}, this.state), {
      inputBuffer: ""
    });
    this.className = "live-slider";
    this.interactionRect = [0, 0, 0, 0];
    this.inTouch = false;
    this.handlePointerDown = (e) => {
      if (e.x < this.interactionRect[0] || e.x > this.interactionRect[0] + this.interactionRect[2] || e.y < this.interactionRect[1] || e.y > this.interactionRect[1] + this.interactionRect[3])
        return;
      if (!this.state.relative) {
        const newValue = this.getValueFromPos(e);
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
      this.inTouch = true;
    };
    this.handlePointerDrag = (e) => {
      if (!this.inTouch)
        return;
      let newValue;
      if (this.state.relative)
        newValue = this.getValueFromDelta(e);
      else
        newValue = this.getValueFromPos(e);
      if (newValue !== this.state.value)
        this.setValueToOutput(newValue);
    };
    this.handlePointerUp = () => {
      this.inTouch = false;
    };
    this.handleKeyDown = (e) => {
      if (!this.state.inputBuffer) {
        let addStep = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowRight")
          addStep = 1;
        if (e.key === "ArrowDown" || e.key === "ArrowLeft")
          addStep = -1;
        if (addStep !== 0) {
          const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
          if (newValue !== this.state.value)
            this.setValueToOutput(newValue);
        }
      }
      if (e.key.match(/[0-9.-]/)) {
        this.setState({ inputBuffer: this.state.inputBuffer + e.key });
        return;
      }
      if (e.key === "Backspace") {
        this.setState({ inputBuffer: this.state.inputBuffer.slice(0, -1) });
        return;
      }
      if (e.key === "Enter") {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({ inputBuffer: "" });
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
    };
    this.handleFocusOut = () => {
      if (this.state.inputBuffer) {
        const newValue = this.object.toValidValue(+this.state.inputBuffer);
        this.setState({ inputBuffer: "" });
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
      this.setState({ focus: false });
    };
  }
  paint() {
    const {
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
    if (!ctx)
      return;
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
      this.interactionRect = [
        width * 0.5 - interactionWidth * 0.5,
        fontSize + padding,
        interactionWidth,
        height - 2 * (fontSize + padding)
      ];
      ctx.lineWidth = 1;
      ctx.strokeStyle = triBorderColor;
      const triOrigin = [
        width * 0.5 + lineWidth * 0.5 + 0.5,
        this.interactionRect[1] - 4 + this.interactionRect[3] * (1 - distance)
      ];
      ctx.beginPath();
      ctx.moveTo(triOrigin[0], triOrigin[1] + 4);
      ctx.lineTo(triOrigin[0] + 8, triOrigin[1]);
      ctx.lineTo(triOrigin[0] + 8, triOrigin[1] + 8);
      ctx.lineTo(triOrigin[0], triOrigin[1] + 4);
      ctx.stroke();
      ctx.fillStyle = this.inTouch ? triOnColor : triColor;
      ctx.fill();
      ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = textColor;
      if (showName)
        ctx.fillText(shortName, width * 0.5, fontSize, width);
      if (showNumber)
        ctx.fillText(displayValue, width * 0.5, height - 2, width);
    } else {
      ctx.beginPath();
      ctx.moveTo(padding, height * 0.5);
      ctx.lineTo(width - padding, height * 0.5);
      ctx.stroke();
      const interactionWidth = height * 0.5;
      this.interactionRect = [
        padding,
        height * 0.5 - interactionWidth * 0.5,
        width - 2 * padding,
        interactionWidth
      ];
      ctx.lineWidth = 1;
      ctx.strokeStyle = triBorderColor;
      const triOrigin = [
        this.interactionRect[0] + this.interactionRect[2] * distance - 4,
        height * 0.5 + lineWidth * 0.5 + 2
      ];
      ctx.beginPath();
      ctx.moveTo(triOrigin[0], triOrigin[1] + 8);
      ctx.lineTo(triOrigin[0] + 4, triOrigin[1]);
      ctx.lineTo(triOrigin[0] + 8, triOrigin[1] + 8);
      ctx.lineTo(triOrigin[0], triOrigin[1] + 8);
      ctx.stroke();
      ctx.fillStyle = this.inTouch ? triOnColor : triColor;
      ctx.fill();
      ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = textColor;
      if (showName)
        ctx.fillText(shortName, width * 0.5, fontSize, width);
      ctx.textAlign = "left";
      if (showNumber)
        ctx.fillText(displayValue, 4, height - 2, width);
    }
  }
  getValueFromPos(e) {
    const { orientation, type, min, exponent } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = orientation === "vertical" ? this.interactionRect[3] : this.interactionRect[2];
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const pixels = orientation === "vertical" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0];
    let steps = Math.round(_sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum")
      return steps;
    if (type === "int")
      return Math.round(steps * step + min);
    return steps * step + min;
  }
  getValueFromDelta(e) {
    const { type, min, max, enums, exponent, orientation } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const totalPixels = orientation === "horizontal" ? this.interactionRect[2] : this.interactionRect[3];
    const stepsCount = this.stepsCount;
    const stepPixels = totalPixels / stepsCount;
    const prevPixels = _base__WEBPACK_IMPORTED_MODULE_1__.default.getDistance({ value: e.prevValue, type, min, max, enums, exponent }) * totalPixels;
    const pixels = prevPixels + (orientation === "horizontal" ? e.x - e.fromX : e.fromY - e.y);
    let steps = Math.round(_sdk__WEBPACK_IMPORTED_MODULE_0__.MathUtils.normExp(pixels / totalPixels, exponent) * totalPixels / stepPixels);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum")
      return steps;
    if (type === "int")
      return Math.round(steps * step + min);
    return steps * step + min;
  }
}
LiveSliderUI.defaultSize = [120, 45];


/***/ }),

/***/ "./src/ui/tab.tsx":
/*!************************!*\
  !*** ./src/ui/tab.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveTabUI)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");

class LiveTabUI extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.className = "live-tab";
    this.tabRects = [];
    this.inTouch = false;
    this.handlePointerDown = (e) => {
      this.inTouch = true;
      for (let i = 0; i < this.tabRects.length; i++) {
        const rect = this.tabRects[i];
        if (e.x >= rect[0] && e.x <= rect[2] + rect[0] && e.y >= rect[1] && e.y <= rect[3] + rect[1]) {
          this.setValueToOutput(i);
          return;
        }
      }
    };
    this.handlePointerDrag = (e) => {
      this.handlePointerDown(e);
    };
    this.handleKeyDown = (e) => {
      let addStep = 0;
      if (e.key === "ArrowUp" || e.key === "ArrowRight")
        addStep = 1;
      if (e.key === "ArrowDown" || e.key === "ArrowLeft")
        addStep = -1;
      if (addStep !== 0) {
        const newValue = this.object.toValidValue(this.state.value + this.state.step * addStep);
        if (newValue !== this.state.value)
          this.setValueToOutput(newValue);
      }
    };
  }
  getTabRects(width, height) {
    const {
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
      countPerLine = Math.ceil(count / lines);
      while (lines * countPerLine < count) {
        countPerLine++;
        if (lines > 1)
          lines--;
      }
      while (lines * countPerLine > count && (lines - 1) * countPerLine >= count) {
        lines--;
      }
      step = height / lines;
    }
    if (mode === "equal") {
      interval = width / countPerLine;
      rectWidth = interval - spacingX;
      for (let i = 0; i < count; i++) {
        this.tabRects[i] = [
          i % countPerLine * interval + spacingX * 0.5,
          Math.floor(i / countPerLine) * step + spacingY * 0.5,
          rectWidth,
          height / lines - spacingY
        ];
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
          this.tabRects[j] = [
            used + spacingX * 0.5,
            i * step + spacingY * 0.5,
            space * rectSpace + 2 * margin,
            height / lines - spacingY
          ];
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
    if (!ctx)
      return;
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
      ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = active ? value === i ? activeTextOnColor : activeTextColor : value === i ? textOnColor : textColor;
      ctx.fillText(enums[i], tabRects[i][0] + tabRects[i][2] * 0.5, tabRects[i][1] + tabRects[i][3] * 0.5);
    }
  }
}
LiveTabUI.defaultSize = [120, 15];


/***/ }),

/***/ "./src/ui/text.tsx":
/*!*************************!*\
  !*** ./src/ui/text.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveTextUI)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");


class LiveTextUI extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this.className = "live-text";
    this.inTouch = false;
    this.handlePointerDown = (e) => {
      const { value, mode } = this.state;
      this.inTouch = true;
      this.setValueToOutput(mode === "button" ? 1 : 1 - +!!value);
    };
    this.handlePointerUp = () => {
      const { mode } = this.state;
      this.inTouch = false;
      if (mode === "button")
        this.setValueToOutput(0);
    };
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
      mode,
      text,
      textOn,
      value
    } = this.state;
    const ctx = this.ctx;
    if (!ctx)
      return;
    const borderWidth = 0.5;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = borderWidth;
    const buttonBgColor = active ? value ? activeBgOnColor : activeBgColor : value ? bgOnColor : bgColor;
    const buttonBorderColor = focus ? focusBorderColor : borderColor;
    ctx.fillStyle = buttonBgColor;
    if (mode === "button") {
      _sdk__WEBPACK_IMPORTED_MODULE_0__.Utils.fillRoundedRect(ctx, 0.5, 0.5, width - 1, height - 1, height * 0.5 - 1);
    } else {
      ctx.beginPath();
      ctx.rect(0.5, 0.5, width - 1, height - 1);
      ctx.fill();
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = buttonBorderColor;
    ctx.stroke();
    ctx.font = `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = active ? value ? activeTextOnColor : activeTextColor : value ? textOnColor : textColor;
    ctx.fillText(value && mode === "toggle" ? textOn : text, width * 0.5, height * 0.5);
  }
}


/***/ }),

/***/ "./src/ui/toggle.tsx":
/*!***************************!*\
  !*** ./src/ui/toggle.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LiveToggleUI)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/ui/base.tsx");

class LiveToggleUI extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.className = "live-toggle";
    this.handlePointerDown = () => {
      this.setValueToOutput(1 - +!!this.state.value);
    };
  }
  paint() {
    const {
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
    if (!ctx)
      return;
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
LiveToggleUI.defaultSize = [30, 30];


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = JSON.parse('{"name":"@jspatcher/package-live","version":"1.0.1","description":"The Live UI package for JSPatcher","main":"dist/index.js","scripts":{"build":"webpack --mode development","build-watch":"webpack --mode development --watch --stats-children"},"keywords":["jspatcher"],"jspatcher":{"isJSPatcherPackage":true,"thumbnail":"","jspatpkg":"index.jspatpkg.js"},"author":"Fr0stbyteR","license":"GPL-3.0-or-later","repository":"https://github.com/jspatcher/package-live","devDependencies":{"@jspatcher/jspatcher":"^0.0.9","@types/react":"^17.0.19","clean-webpack-plugin":"^4.0.0-alpha.0","esbuild-loader":"^2.15.1","react":"^17.0.2","typescript":"^4.4.2","webpack":"^5.51.1","webpack-cli":"^4.7.2"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/index.jspatpkg.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _objects_numbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/numbox */ "./src/objects/numbox.ts");
/* harmony import */ var _objects_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/button */ "./src/objects/button.ts");
/* harmony import */ var _objects_dial__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/dial */ "./src/objects/dial.ts");
/* harmony import */ var _objects_slider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/slider */ "./src/objects/slider.ts");
/* harmony import */ var _objects_tab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/tab */ "./src/objects/tab.ts");
/* harmony import */ var _objects_toggle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./objects/toggle */ "./src/objects/toggle.ts");
/* harmony import */ var _objects_text__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./objects/text */ "./src/objects/text.ts");
/* harmony import */ var _objects_meter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./objects/meter */ "./src/objects/meter.ts");
/* harmony import */ var _objects_gain__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./objects/gain */ "./src/objects/gain.ts");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => ({
  numbox: _objects_numbox__WEBPACK_IMPORTED_MODULE_0__.default,
  button: _objects_button__WEBPACK_IMPORTED_MODULE_1__.default,
  dial: _objects_dial__WEBPACK_IMPORTED_MODULE_2__.default,
  slider: _objects_slider__WEBPACK_IMPORTED_MODULE_3__.default,
  tab: _objects_tab__WEBPACK_IMPORTED_MODULE_4__.default,
  toggle: _objects_toggle__WEBPACK_IMPORTED_MODULE_5__.default,
  text: _objects_text__WEBPACK_IMPORTED_MODULE_6__.default,
  "meter~": _objects_meter__WEBPACK_IMPORTED_MODULE_7__.default,
  "gain~": _objects_gain__WEBPACK_IMPORTED_MODULE_8__.default
}));

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.jspatpkg.js.map