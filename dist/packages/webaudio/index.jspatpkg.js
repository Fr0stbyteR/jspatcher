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

/***/ "./src/objects/Analyser.ts":
/*!*********************************!*\
  !*** ./src/objects/Analyser.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Analyser)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


;
class Analyser extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createAnalyser() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 6;
      this.outlets = 6;
      this.node.channelInterpretation = "discrete";
      handleProps(this.box.props);
    });
    const handleProps = (props) => {
      try {
        if (typeof props.fftSize === "number")
          this.node.fftSize = props.fftSize;
        if (typeof props.minDecibels === "number")
          this.node.minDecibels = props.minDecibels;
        if (typeof props.maxDecibels === "number")
          this.node.maxDecibels = props.maxDecibels;
        if (typeof props.smoothingTimeConstant === "number")
          this.node.smoothingTimeConstant = props.smoothingTimeConstant;
      } catch (e) {
        this.error(e.message);
      }
    };
    this.on("updateProps", handleProps);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(5, this.node);
      } else if (inlet === 5) {
        if (typeof data === "object") {
          const props = data;
          try {
            if (typeof props.fftSize === "number")
              this.node.fftSize = props.fftSize;
            if (typeof props.minDecibels === "number")
              this.node.minDecibels = props.minDecibels;
            if (typeof props.maxDecibels === "number")
              this.node.maxDecibels = props.maxDecibels;
            if (typeof props.smoothingTimeConstant === "number")
              this.node.smoothingTimeConstant = props.smoothingTimeConstant;
          } catch (e) {
            this.error(e.message);
          }
        } else {
          this.error("Invalid options");
        }
      } else {
        try {
          if (inlet === 1) {
            this.node.getFloatTimeDomainData(data);
            this.outlet(1, data);
          } else if (inlet === 2) {
            this.node.getByteTimeDomainData(data);
            this.outlet(2, data);
          } else if (inlet === 3) {
            this.node.getFloatFrequencyData(data);
            this.outlet(3, data);
          } else if (inlet === 4) {
            this.node.getByteFrequencyData(data);
            this.outlet(4, data);
          }
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
}
Analyser.description = "WebAudio AnalyserNode";
Analyser.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output AnalyserNode instance"
}, {
  isHot: true,
  type: "object",
  description: "getFloatTimeDomainData(): Float32Array"
}, {
  isHot: true,
  type: "object",
  description: "getByteTimeDomainData(): Uint8Array"
}, {
  isHot: true,
  type: "object",
  description: "getFloatFrequencyData(): Float32Array"
}, {
  isHot: true,
  type: "object",
  description: "getByteFrequencyData(): Uint8Array"
}, {
  isHot: false,
  type: "object",
  description: "Options: { fftSize, minDecibels, maxDecibels, smoothingTimeConstant }"
}];
Analyser.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "getFloatTimeDomainData result"
}, {
  type: "object",
  description: "getByteTimeDomainData result"
}, {
  type: "object",
  description: "getFloatFrequencyData result"
}, {
  type: "object",
  description: "getByteFrequencyData result"
}, {
  type: "object",
  description: "Instance: AnalyserNode"
}];
Analyser.props = {
  fftSize: {
    type: "number",
    default: 2048,
    description: "The size of the FFT to be used: power of 2"
  },
  minDecibels: {
    type: "number",
    default: -100,
    description: "The minimum power value in the scaling range for the FFT analysis data"
  },
  maxDecibels: {
    type: "number",
    default: -10,
    description: "The maximum power value in the scaling range for the FFT analysis data"
  },
  smoothingTimeConstant: {
    type: "number",
    default: 0.8,
    description: "The averaging constant with the last analysis frame"
  }
};


/***/ }),

/***/ "./src/objects/AnyNode.ts":
/*!********************************!*\
  !*** ./src/objects/AnyNode.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnyNode)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");

const _AnyNode = class extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: void 0 };
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        try {
          if (data instanceof AudioNode) {
            this.disconnectAudio();
            this._.node = data;
            const inlets = this.node.numberOfInputs || 1;
            const outlets = this.node.numberOfOutputs;
            const factoryMeta = _AnyNode.meta;
            const inlet0 = factoryMeta.inlets[0];
            const inlet1 = factoryMeta.inlets[1];
            const outlet0 = factoryMeta.inlets[0];
            this.inletAudioConnections = [{ node: this.node, index: 0 }];
            factoryMeta.inlets = [inlet0];
            for (let i = 1; i < inlets; i++) {
              factoryMeta.inlets[i] = inlet1;
            }
            for (let i = 0; i < outlets; i++) {
              factoryMeta.outlets[i] = outlet0;
            }
            for (let i = 0; i < this.node.numberOfInputs; i++) {
              this.inletAudioConnections[i] = { node: this.node, index: i };
            }
            for (let i = 0; i < this.node.numberOfOutputs; i++) {
              this.outletAudioConnections[i] = { node: this.node, index: i };
            }
            this.setMeta(factoryMeta);
            this.inlets = inlets;
            this.outlets = outlets;
            this.connectAudio();
          }
        } catch (e) {
          this.error(e.message);
          return this;
        }
      }
      return this;
    };
  }
  subscribe() {
    super.subscribe();
    this.on("inlet", this.handleInlet);
  }
};
let AnyNode = _AnyNode;
AnyNode.description = "WebAudio AudioNode";
AnyNode.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, AudioNode instance to set the node."
}, {
  isHot: false,
  type: "signal",
  description: "Node connection"
}];
AnyNode.outlets = [{
  type: "signal",
  description: "Node connection"
}];



/***/ }),

/***/ "./src/objects/AudioIn.ts":
/*!********************************!*\
  !*** ./src/objects/AudioIn.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioIn)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
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


const _AudioIn = class extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { node: void 0, stream: void 0, search: void 0 };
    this.handleDeviceChange = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const enums = devices.filter((d) => d.kind === "audioinput").map((d) => d.label || d.deviceId);
      const { meta } = this;
      meta.args[0] = __spreadProps(__spreadValues({}, _AudioIn.args[0]), { type: "enum", enums });
      this.setMeta(meta);
    };
    this.newSearch = async (search) => {
      this._.search = search;
      let deviceId;
      if (search) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const device = devices.find((d) => d.kind === "audioinput" && (d.deviceId === search || d.label === search));
        if (device)
          deviceId = device.deviceId;
      }
      this._.stream = await navigator.mediaDevices.getUserMedia({ audio: this.getConstraints(deviceId) });
      if (this._.stream)
        this.resetNode();
    };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("postInit", () => {
      const search = this.box.args[0];
      navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
      this.handleDeviceChange();
      this.newSearch(search);
    });
    this.on("updateArgs", (args) => {
      this.newSearch(args[0]);
    });
    this.on("updateProps", () => {
      this.newSearch(this._.search);
    });
    this.on("inlet", async ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          await this.newSearch(data);
        }
        if (this.node)
          this.outlet(1, this.node);
      }
    });
    this.on("destroy", () => {
      navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
    });
  }
  getConstraints(deviceId) {
    return {
      deviceId,
      autoGainControl: this.getProp("autoGainControl"),
      channelCount: this.getProp("channelCount"),
      echoCancellation: this.getProp("echoCancellation"),
      latency: this.getProp("latency"),
      noiseSuppression: this.getProp("noiseSuppression"),
      sampleRate: this.getProp("sampleRate"),
      sampleSize: this.getProp("sampleSize")
    };
  }
  resetNode() {
    this.disconnectAudio();
    if (this._.stream) {
      this.node = this.audioCtx.createMediaStreamSource(this._.stream);
      this.node.channelInterpretation = "discrete";
    }
    this.outletAudioConnections[0] = { node: this.node, index: 0 };
    this.connectAudio();
  }
};
let AudioIn = _AudioIn;
AudioIn.description = "Get Audio input from device name or ID";
AudioIn.inlets = [{
  isHot: true,
  type: "anything",
  description: "string to fetch device name or ID, bang to output Node"
}];
AudioIn.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: MediaStreamAudioSourceNode"
}];
AudioIn.args = [{
  type: "string",
  optional: false,
  description: "Device name or ID"
}];
AudioIn.props = {
  autoGainControl: {
    type: "boolean",
    default: false,
    description: "Automatic gain control"
  },
  channelCount: {
    type: "number",
    default: void 0,
    description: "The number of independent channels of sound"
  },
  echoCancellation: {
    type: "boolean",
    default: false,
    description: "Remove all the sound being played from the input signals recorded by the microphones"
  },
  latency: {
    type: "number",
    default: void 0,
    description: "The latency or latency range, in seconds"
  },
  noiseSuppression: {
    type: "boolean",
    default: false,
    description: "Noise suppression"
  },
  sampleRate: {
    type: "number",
    default: void 0,
    description: "The sample rate in samples per second for the audio data"
  },
  sampleSize: {
    type: "number",
    default: void 0,
    description: "The linear sample size in bits"
  }
};



/***/ }),

/***/ "./src/objects/AudioOut.tsx":
/*!**********************************!*\
  !*** ./src/objects/AudioOut.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioOut)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _AudioIn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioIn */ "./src/objects/AudioIn.ts");
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



const supportSetSinkId = window.MediaStreamAudioDestinationNode && HTMLMediaElement.prototype.setSinkId;
const _AudioOut = class extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = supportSetSinkId ? { node: this.audioCtx.destination, msadn: this.audioCtx.createMediaStreamDestination(), audio: new Audio(), search: void 0 } : { node: this.audioCtx.destination };
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
    this.handleDeviceChange = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const enums = devices.filter((d) => d.kind === "audiooutput").map((d) => d.label || d.deviceId);
      const { meta } = this;
      meta.args[0] = __spreadProps(__spreadValues({}, _AudioOut.args[0]), { type: "enum", enums });
      this.setMeta(meta);
    };
    this.newSearch = async (search) => {
      if (!supportSetSinkId)
        return;
      this._.search = search;
      if (!search || search === "default") {
        this.resetNode();
        return;
      }
      const { audio } = this._;
      let deviceId = audio.sinkId || "default";
      const devices = await navigator.mediaDevices.enumerateDevices();
      const device = devices.find((d) => d.kind === "audiooutput" && (d.deviceId === search || d.label === search));
      if (device)
        deviceId = device.deviceId;
      if (audio.sinkId !== deviceId) {
        if (audio.played)
          audio.pause();
        audio.setSinkId(deviceId);
        audio.play();
      }
      this.resetNode(true);
    };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("postInit", () => {
      this.node.channelInterpretation = "discrete";
      if (supportSetSinkId) {
        this._.msadn.channelInterpretation = "discrete";
        const { audio, msadn } = this._;
        const { stream } = msadn;
        if ("srcObject" in audio)
          audio.srcObject = stream;
        else
          audio.src = URL.createObjectURL(stream);
        const search = this.box.args[0];
        navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
        this.on("destroy", () => {
          navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
        });
        this.handleDeviceChange();
        this.newSearch(search);
      }
    });
    this.on("updateArgs", (args) => {
      this.newSearch(args[0]);
    });
    this.on("updateProps", () => {
      this.newSearch(this._.search);
    });
    this.on("inlet", async ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          await this.newSearch(data);
        }
        if (this.node)
          this.outlet(1, this.node);
      }
    });
  }
  getConstraints(deviceId) {
    return {
      deviceId,
      autoGainControl: this.getProp("autoGainControl"),
      channelCount: this.getProp("channelCount"),
      echoCancellation: this.getProp("echoCancellation"),
      latency: this.getProp("latency"),
      noiseSuppression: this.getProp("noiseSuppression"),
      sampleRate: this.getProp("sampleRate"),
      sampleSize: this.getProp("sampleSize")
    };
  }
  resetNode(msadn) {
    if (msadn) {
      if (this.node !== this._.msadn) {
        this.disconnectAudio();
        this.node = this._.msadn;
        this.inletAudioConnections[0] = { node: this.node, index: 0 };
        this.connectAudio();
      }
    } else {
      if (this.node !== this.audioCtx.destination) {
        this.disconnectAudio();
        this.node = this.audioCtx.destination;
        this.inletAudioConnections[0] = { node: this.node, index: 0 };
        this.connectAudio();
      }
    }
  }
};
let AudioOut = _AudioOut;
AudioOut.description = "Get Audio output from device name or ID (if supported)";
AudioOut.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, string to fetch device name or ID, bang to output Node"
}];
AudioOut.outlets = [{
  type: "object",
  description: `Instance: ${supportSetSinkId ? "MediaStreamAudioDestinationNode | " : ""}AudioDestinationNode`
}];
AudioOut.args = supportSetSinkId ? _AudioIn__WEBPACK_IMPORTED_MODULE_2__.default.args : [];
AudioOut.props = supportSetSinkId ? _AudioIn__WEBPACK_IMPORTED_MODULE_2__.default.props : {};
AudioOut.UI = supportSetSinkId ? class AudioOutUI extends _sdk__WEBPACK_IMPORTED_MODULE_0__.DefaultUI {
  constructor() {
    super(...arguments);
    this.refContainer = _sdk__WEBPACK_IMPORTED_MODULE_0__.React.createRef();
  }
  componentDidMount() {
    super.componentDidMount();
    const div = this.refContainer.current;
    const { audio } = this.object._;
    if (div && audio) {
      audio.style.display = "none";
      div.appendChild(audio);
    }
  }
  render() {
    const textContainerProps = __spreadProps(__spreadValues({}, this.props.textContainerProps), { ref: this.refContainer });
    return /* @__PURE__ */ _sdk__WEBPACK_IMPORTED_MODULE_0__.React.createElement(_sdk__WEBPACK_IMPORTED_MODULE_0__.DefaultUI, __spreadValues({
      textContainerProps
    }, this.props));
  }
} : _sdk__WEBPACK_IMPORTED_MODULE_0__.DefaultUI;



/***/ }),

/***/ "./src/objects/Biquad.ts":
/*!*******************************!*\
  !*** ./src/objects/Biquad.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biquad)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



const _Biquad = class extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createBiquadFilter() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.frequency }, { node: this.node.detune }, { node: this.node.Q }, { node: this.node.gain }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 6;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleProps(this.box.props);
    });
    const handleProps = (props) => {
      const paramMap = ["frequency", "detune", "Q", "gain"];
      paramMap.forEach((key) => {
        try {
          if (typeof props[key] === "number")
            this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      });
      if (typeof props.type === "string") {
        try {
          this.node.type = props.type;
        } catch (e) {
          this.error(e.message);
        }
      }
    };
    this.on("updateProps", handleProps);
    this.on("inlet", ({ data, inlet }) => {
      const paramMap = ["frequency", "detune", "Q", "gain"];
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet === 5) {
        if (_Biquad.isBiquadFilterType(data))
          this.node.type = data;
      } else if (inlet > 0 && inlet < 5) {
        try {
          const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node[paramMap[inlet - 1]], bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
};
let Biquad = _Biquad;
Biquad.description = "WebAudio BiquadFilterNode";
Biquad.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection (1 channel), bang to output BiquadFilterNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "frequency: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "detune: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "Q: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "gain: bpf or node connection"
}, {
  isHot: false,
  type: "enum",
  enums: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"],
  description: 'type: "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass"'
}];
Biquad.outlets = [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: BiquadFilterNode"
}];
Biquad.props = {
  frequency: {
    type: "number",
    default: 350,
    description: "Initial frequency"
  },
  detune: {
    type: "number",
    default: 100,
    description: "Initial detune"
  },
  Q: {
    type: "number",
    default: 100,
    description: "Initial Q"
  },
  gain: {
    type: "number",
    default: 25,
    description: "Initial gain"
  },
  type: {
    type: "enum",
    enums: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"],
    default: "lowpass",
    description: 'Initial type: "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass"'
  }
};
Biquad.isBiquadFilterType = (x) => ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"].indexOf(x) >= 0;



/***/ }),

/***/ "./src/objects/BufferSource.ts":
/*!*************************************!*\
  !*** ./src/objects/BufferSource.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BufferSrc)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class BufferSrc extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createBufferSource(), playing: false };
    this.inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.playbackRate }, { node: this.node.detune }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
    this.handleEnded = () => {
      this.outlet(1, new _sdk__WEBPACK_IMPORTED_MODULE_1__.Bang());
      this.resetNode();
    };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 6;
      this.outlets = 2;
      this.node.addEventListener("ended", this.handleEnded);
      handleProps(this.box.props);
    });
    const handleProps = (props) => {
      const paramMap = ["playbackRate", "detune"];
      const numberParamMap = ["loopStart", "loopEnd"];
      const booleanParamMap = ["loop"];
      try {
        paramMap.forEach((key) => {
          if (typeof props[key] === "number")
            this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
        });
        numberParamMap.forEach((key) => {
          if (typeof props[key] === "number")
            this.node[key] = props[key];
        });
        booleanParamMap.forEach((key) => {
          if (typeof props[key] === "boolean")
            this.node[key] = props[key];
        });
      } catch (e) {
        this.error(e.message);
      }
    };
    this.on("updateProps", handleProps);
    this.on("inlet", ({ data, inlet }) => {
      const paramMap = ["playbackRate", "detune"];
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          this.outlet(2, this.node);
        } else if (typeof data === "boolean" || typeof data === "number") {
          if (data) {
            if (!this._.playing) {
              this.node.start();
              this._.playing = true;
            }
          } else {
            if (this._.playing) {
              this.node.stop();
              this.resetNode();
            }
          }
        } else if (data instanceof AudioBuffer) {
          if (data !== this.node.buffer)
            this.resetNode(data);
        } else if (data instanceof _sdk__WEBPACK_IMPORTED_MODULE_1__.PatcherAudio) {
          if (data.audioBuffer !== this.node.buffer)
            this.resetNode(data.audioBuffer);
        }
      } else if (inlet >= 1 && inlet <= 2) {
        try {
          const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node[paramMap[inlet - 1]], bpf);
        } catch (e) {
          this.error(e.message);
        }
      } else if (inlet === 3) {
        if (typeof data === "boolean") {
          try {
            this.node.loop = data;
          } catch (e) {
            this.error(e.message);
          }
        }
      } else if (inlet > 3) {
        if (typeof data === "number") {
          try {
            if (inlet === 4)
              this.node.loopStart = data;
            else if (inlet === 5)
              this.node.loopEnd = data;
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    });
    this.on("destroy", () => {
      if (this._.playing)
        this.node.stop();
      this.node.removeEventListener("ended", this.handleEnded);
    });
  }
  resetNode(bufferIn) {
    this.disconnectAudio();
    this._.playing = false;
    this.node.removeEventListener("ended", this.handleEnded);
    const { loop, loopStart, loopEnd } = this.node;
    const buffer = bufferIn || this.node.buffer;
    const playbackRate = this.node.playbackRate.value;
    const detune = this.node.detune.value;
    this.node = this.audioCtx.createBufferSource();
    this.node.buffer = buffer;
    this.node.loop = loop;
    this.node.loopStart = loopStart;
    this.node.loopEnd = loopEnd;
    this.node.playbackRate.setValueAtTime(playbackRate, this.audioCtx.currentTime);
    this.node.detune.setValueAtTime(detune, this.audioCtx.currentTime);
    this.node.addEventListener("ended", this.handleEnded);
    this.inletAudioConnections[0] = { node: this.node, index: 0 };
    this.inletAudioConnections[1] = { node: this.node.playbackRate };
    this.inletAudioConnections[2] = { node: this.node.detune };
    this.outletAudioConnections[0] = { node: this.node, index: 0 };
    this.connectAudio();
  }
}
BufferSrc.description = "WebAudio AudioBufferSourceNode";
BufferSrc.inlets = [{
  isHot: true,
  type: "anything",
  description: "Bang to output AudioBufferSourceNode instance, boolean/number to start/stop, AudioBuffer/PatcherAudio to set buffer"
}, {
  isHot: false,
  type: "signal",
  description: "playbackRate: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "detune: bpf or node connection"
}, {
  isHot: false,
  type: "boolean",
  description: "loop"
}, {
  isHot: false,
  type: "number",
  description: "loopStart (seconds)"
}, {
  isHot: false,
  type: "number",
  description: "loopEnd (seconds)"
}];
BufferSrc.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: AudioBufferSourceNode"
}];
BufferSrc.props = {
  detune: {
    type: "number",
    default: 0,
    description: "Initial detune, detuning of playback in cents"
  },
  playbackRate: {
    type: "number",
    default: 1,
    description: "Initial playbackRate, The speed at which to render the audio stream"
  },
  loop: {
    type: "boolean",
    default: false,
    description: "Initial loop, Indicates if the region of audio data designated by loopStart and loopEnd should be played continuously in a loop"
  },
  loopStart: {
    type: "number",
    default: 0,
    description: "An optional playhead position where looping should begin if the loop attribute is true. If <=0 or > duration, loop will end at the end of the buffer."
  },
  loopEnd: {
    type: "number",
    default: 0,
    description: "An optional playhead position where looping should end if the loop attribute is true. If <=0 or > duration, loop will end at the end of the buffer."
  }
};


/***/ }),

/***/ "./src/objects/Compressor.ts":
/*!***********************************!*\
  !*** ./src/objects/Compressor.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Compressor)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class Compressor extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createDynamicsCompressor() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.threshold }, { node: this.node.knee }, { node: this.node.ratio }, null, { node: this.node.attack }, { node: this.node.release }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 6;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleProps(this.box.props);
    });
    const handleProps = (props) => {
      const paramMap = ["threshold", "knee", "ratio", "attack", "release"];
      paramMap.forEach((key) => {
        try {
          if (typeof props[key] === "number")
            this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      });
    };
    this.on("updateProps", handleProps);
    this.on("inlet", ({ data, inlet }) => {
      const paramMap = ["threshold", "knee", "ratio", "attack", "release"];
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet > 0 && inlet < 6) {
        try {
          const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node[paramMap[inlet - 1]], bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
}
Compressor.description = "WebAudio DynamicsCompressorNode";
Compressor.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection (1 channel), bang to output DynamicsCompressorNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "threshold: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "knee: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "ratio: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "attack: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "release: bpf or node connection"
}];
Compressor.outlets = [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: DynamicsCompressorNode"
}];
Compressor.props = {
  threshold: {
    type: "number",
    default: -24,
    description: "Initial threshold"
  },
  knee: {
    type: "number",
    default: 30,
    description: "Initial knee"
  },
  ratio: {
    type: "number",
    default: 12,
    description: "Initial ratio"
  },
  attack: {
    type: "number",
    default: 3e-3,
    description: "Initial attack"
  },
  release: {
    type: "number",
    default: 0.25,
    description: "Initial release"
  }
};


/***/ }),

/***/ "./src/objects/Constant.ts":
/*!*********************************!*\
  !*** ./src/objects/Constant.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Constant)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class Constant extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createConstantSource() };
    this.inletAudioConnections = [null, { node: this.node.offset }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleArgs(this.args);
      this.node.start();
    });
    const handleArgs = (args) => {
      if (typeof args[0] === "number") {
        try {
          this.node.offset.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    };
    this.on("updateArgs", handleArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node.offset, bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
}
Constant.description = "WebAudio ConstantSourceNode";
Constant.inlets = [{
  isHot: true,
  type: "bang",
  description: "Output ConstantSourceNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "offset: bpf or node connection"
}];
Constant.outlets = [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: ConstantSourceNode"
}];
Constant.args = [{
  type: "number",
  optional: true,
  description: "Initial offset",
  default: 1
}];


/***/ }),

/***/ "./src/objects/Convolver.ts":
/*!**********************************!*\
  !*** ./src/objects/Convolver.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Convolver)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class Convolver extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createConvolver() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleProps(this.box.props);
    });
    const handleProps = (props) => {
      try {
        if (typeof props.normalize === "boolean")
          this.node.normalize = props.normalize;
      } catch (e) {
        this.error(e.message);
      }
    };
    this.on("updateProps", handleProps);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet === 1) {
        if (data instanceof AudioBuffer) {
          try {
            this.node.buffer = data;
          } catch (e) {
            this.error(e.message);
          }
        } else if (data instanceof _sdk__WEBPACK_IMPORTED_MODULE_1__.PatcherAudio) {
          try {
            this.node.buffer = data.audioBuffer;
          } catch (e) {
            this.error(e.message);
          }
        } else {
          this.error("Invalid ArrayBuffer");
        }
      } else if (inlet === 2) {
        if (typeof data === "boolean") {
          try {
            this.node.normalize = data;
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    });
  }
}
Convolver.description = "WebAudio ConvolverNode";
Convolver.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output ConvolverNode instance"
}, {
  isHot: true,
  type: "object",
  description: "buffer (2-4 channels): AudioBuffer"
}, {
  isHot: true,
  type: "boolean",
  description: "normalize: boolean"
}];
Convolver.outlets = [{
  type: "signal",
  description: "Node connection (2-4 channels)"
}, {
  type: "object",
  description: "Instance: ConvolverNode"
}];
Convolver.props = {
  normalize: {
    type: "boolean",
    default: true,
    description: "Controls whether the impulse response from the buffer will be scaled by an equal-power normalization"
  }
};


/***/ }),

/***/ "./src/objects/Delay.ts":
/*!******************************!*\
  !*** ./src/objects/Delay.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Delay)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class Delay extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createDelay() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.delayTime }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleArgs(this.args);
    });
    const handleArgs = (args) => {
      if (typeof args[0] === "number") {
        try {
          this.node.delayTime.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    };
    this.on("updateArgs", handleArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node.delayTime, bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
}
Delay.description = "WebAudio DelayNode";
Delay.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output DelayNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "delayTime: bpf or node connection"
}];
Delay.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: DelayNode"
}];
Delay.args = [{
  type: "number",
  optional: true,
  description: "Initial delayTime"
}];


/***/ }),

/***/ "./src/objects/Destination.ts":
/*!************************************!*\
  !*** ./src/objects/Destination.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Destination)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class Destination extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.destination };
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
      this.node.channelInterpretation = "discrete";
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(0, this.node);
      }
    });
  }
}
Destination.description = "WebAudio DestinationNode";
Destination.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output DestinationNode instance"
}];
Destination.outlets = [{
  type: "object",
  description: "Instance: DestinationNode"
}];


/***/ }),

/***/ "./src/objects/Gain.ts":
/*!*****************************!*\
  !*** ./src/objects/Gain.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gain)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class Gain extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createGain() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.gain }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleArgs(this.args);
    });
    const handleArgs = (args) => {
      if (typeof args[0] === "number") {
        try {
          this.node.gain.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    };
    this.on("updateArgs", handleArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node.gain, bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
}
Gain.description = "WebAudio GainNode";
Gain.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output GainNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "gain: bpf or node connection"
}];
Gain.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: GainNode"
}];
Gain.args = [{
  type: "number",
  optional: true,
  description: "Initial gain",
  default: 1
}];


/***/ }),

/***/ "./src/objects/IIRFilter.ts":
/*!**********************************!*\
  !*** ./src/objects/IIRFilter.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IIRFilter)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class IIRFilter extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: void 0, feedforward: [], feedback: [] };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
      handleArgs(this.args);
    });
    const handleArgs = (args) => {
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.isNumberArray)(args[0]))
        this._.feedforward = args[0];
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.isNumberArray)(args[1]))
        this._.feedback = args[1];
      this.resetNode();
    };
    this.on("updateArgs", handleArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet === 1) {
        if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.isNumberArray)(data))
          this._.feedforward = data;
        this.resetNode();
      } else if (inlet === 2) {
        if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.isNumberArray)(data))
          this._.feedback = data;
        this.resetNode();
      }
    });
  }
  resetNode() {
    this.disconnectAudio();
    this.node = this.audioCtx.createIIRFilter(this._.feedforward, this._.feedback);
    this.node.channelInterpretation = "discrete";
    this.inletAudioConnections[0] = { node: this.node, index: 0 };
    this.outletAudioConnections[0] = { node: this.node, index: 0 };
    this.connectAudio();
  }
}
IIRFilter.description = "WebAudio IIRFilterNode";
IIRFilter.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection (1 channel), bang to output IIRFilterNode instance"
}, {
  isHot: false,
  type: "object",
  description: "feedforward, A sequence of coefficients, change will reconstruct the node: number[]"
}, {
  isHot: false,
  type: "object",
  description: "feedback, A sequence of coefficients, change will reconstruct the node: number[]"
}];
IIRFilter.outlets = [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: IIRFilterNode"
}];
IIRFilter.args = [{
  type: "object",
  optional: false,
  default: [],
  description: "feedforward, A sequence of coefficients: number[]"
}, {
  type: "object",
  optional: false,
  default: [],
  description: "feedback, A sequence of coefficients: number[]"
}];


/***/ }),

/***/ "./src/objects/Media.ts":
/*!******************************!*\
  !*** ./src/objects/Media.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Media)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class Media extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: void 0, element: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          if (this.node)
            this.outlet(1, this.node);
        } else if (data instanceof HTMLMediaElement) {
          this._.element = data;
          this.resetNode();
          this.outlet(1, this.node);
        }
      }
    });
  }
  resetNode() {
    this.disconnectAudio();
    this.node = this.audioCtx.createMediaElementSource(this._.element);
    this.node.channelInterpretation = "discrete";
    this.outletAudioConnections[0] = { node: this.node, index: 0 };
    this.connectAudio();
  }
}
Media.description = "WebAudio MediaElementAudioSourceNode";
Media.inlets = [{
  isHot: true,
  type: "object",
  description: "HTMLMediaElement to construct node, bang to output MediaElementAudioSourceNode instance"
}];
Media.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: MediaElementAudioSourceNode"
}];


/***/ }),

/***/ "./src/objects/Merger.ts":
/*!*******************************!*\
  !*** ./src/objects/Merger.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Merger)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


const _Merger = class extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: null };
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.outlets = 2;
      handleArgs(this.args);
    });
    const handleArgs = (args) => {
      const channelCount = (typeof args[0] === "number" && ~~args[0]) > 0 ? ~~args[0] : 6;
      this.resetNode(channelCount);
    };
    this.on("updateArgs", handleArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (typeof data === "number") {
          const channelCount = ~~data > 0 ? ~~data : 6;
          if (this.node && channelCount !== this.node.numberOfInputs)
            this.resetNode(channelCount);
          this.outlet(1, this.node);
        } else if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      }
    });
  }
  resetNode(channelCount) {
    this.disconnectAudio();
    this.node = this.audioCtx.createChannelMerger(channelCount);
    this.node.channelInterpretation = "discrete";
    const factoryMeta = _Merger.meta;
    const bangInlet = factoryMeta.inlets[0];
    const siganlInlet = factoryMeta.inlets[1];
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
    factoryMeta.inlets = [bangInlet];
    for (let i = 1; i < channelCount; i++) {
      factoryMeta.inlets[i] = siganlInlet;
      this.inletAudioConnections[i] = { node: this.node, index: i };
    }
    this.setMeta(factoryMeta);
    this.inlets = channelCount;
    this.connectAudio();
  }
};
let Merger = _Merger;
Merger.description = "WebAudio ChannelMergerNode";
Merger.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output DestinationNode instance, number to change inputs"
}, {
  isHot: false,
  type: "signal",
  description: "Node connection"
}];
Merger.outlets = [{
  type: "signal",
  description: "Node connection (n channels)"
}, {
  type: "object",
  description: "Instance: ChannelMergerNode"
}];
Merger.args = [{
  type: "number",
  optional: true,
  description: "Number of Inputs",
  default: 6
}];



/***/ }),

/***/ "./src/objects/Oscillator.ts":
/*!***********************************!*\
  !*** ./src/objects/Oscillator.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Oscillator)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class Oscillator extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createOscillator() };
    this.inletAudioConnections = [null, { node: this.node.frequency }, { node: this.node.detune }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 4;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleProps(this.box.props);
      handleArgs(this.args);
      this.node.start();
    });
    const handleProps = (props) => {
      if (typeof props.detune === "number") {
        try {
          this.node.detune.setValueAtTime(props.detune, this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    };
    this.on("updateProps", handleProps);
    const handleArgs = (args) => {
      if (typeof args[0] === "number") {
        try {
          this.node.frequency.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
      if (typeof args[1] === "string") {
        try {
          this.node.type = args[1];
        } catch (e) {
          this.error(e.message);
        }
      }
    };
    this.on("updateArgs", handleArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else {
        try {
          if (inlet === 1) {
            const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
            this.applyBPF(this.node.frequency, bpf);
          } else if (inlet === 2) {
            const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
            this.applyBPF(this.node.detune, bpf);
          } else if (inlet === 3) {
            this.node.type = data;
          }
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
}
Oscillator.description = "WebAudio OscillatorNode";
Oscillator.inlets = [{
  isHot: true,
  type: "bang",
  description: "Output OscillatorNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "frequency: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "detune: bpf or node connection"
}, {
  isHot: false,
  type: "enum",
  enums: ["sine", "square", "sawtooth", "triangle", "custom"],
  description: 'type: "sine" | "square" | "sawtooth" | "triangle" | "custom"'
}];
Oscillator.outlets = [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: OscillatorNode"
}];
Oscillator.args = [{
  type: "number",
  optional: true,
  default: 440,
  description: "Initial frequency"
}, {
  type: "enum",
  enums: ["sine", "square", "sawtooth", "triangle", "custom"],
  optional: true,
  default: "sine",
  description: 'Initial type: "sine" | "square" | "sawtooth" | "triangle" | "custom"'
}];
Oscillator.props = {
  detune: {
    type: "number",
    default: 0,
    description: "Initial detune"
  }
};
Oscillator.isOscillatorType = (x) => x === "sine" || x === "square" || x === "sawtooth" || x === "triangle" || x === "custom";


/***/ }),

/***/ "./src/objects/Panner.ts":
/*!*******************************!*\
  !*** ./src/objects/Panner.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Panner)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class Panner extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createPanner() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.orientationX }, { node: this.node.orientationY }, { node: this.node.orientationZ }, null, { node: this.node.positionX }, { node: this.node.positionY }, { node: this.node.positionZ }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 8;
      this.outlets = 2;
      handleProps(this.props);
      this.node.channelInterpretation = "discrete";
    });
    const handleProps = (props) => {
      const paramMap = ["orientationX", "orientationY", "orientationZ", "positionX", "positionY", "positionZ"];
      const numberParamMap = ["coneInnerAngle", "coneOuterAngle", "coneOuterGain", "maxDistance", "refDistance", "rolloffFactor"];
      try {
        paramMap.forEach((key) => {
          if (typeof props[key] === "number")
            this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
        });
        numberParamMap.forEach((key) => {
          if (typeof props[key] === "number")
            this.node[key] = props[key];
        });
        if (typeof props.distanceModel === "string")
          this.node.distanceModel = props.distanceModel;
        if (typeof props.panningModel === "string")
          this.node.panningModel = props.panningModel;
      } catch (e) {
        this.error(e.message);
      }
    };
    this.on("updateProps", handleProps);
    this.on("inlet", ({ data, inlet }) => {
      const paramMap = ["orientationX", "orientationY", "orientationZ", "positionX", "positionY", "positionZ"];
      const numberParamMap = ["coneInnerAngle", "coneOuterAngle", "coneOuterGain", "maxDistance", "refDistance", "rolloffFactor"];
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet > 0 && inlet < 7) {
        try {
          const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node[paramMap[inlet - 1]], bpf);
        } catch (e) {
          this.error(e.message);
        }
      } else if (inlet === 7) {
        if (typeof data === "object") {
          const props = data;
          try {
            paramMap.forEach((key) => {
              if (typeof props[key] === "number")
                this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
            });
            numberParamMap.forEach((key) => {
              if (typeof props[key] === "number")
                this.node[key] = props[key];
            });
            if (typeof props.distanceModel === "string")
              this.node.distanceModel = props.distanceModel;
            if (typeof props.panningModel === "string")
              this.node.panningModel = props.panningModel;
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    });
  }
}
Panner.description = "WebAudio PannerNode";
Panner.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output PannerNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "orientationX: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "orientationY: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "orientationZ: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "positionX: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "positionY: bpf or node connection"
}, {
  isHot: false,
  type: "signal",
  description: "positionZ: bpf or node connection"
}, {
  isHot: false,
  type: "object",
  description: "options: coneInnerAngle, coneOuterAngle, coneOuterGain, distanceModel, maxDistance, orientationX, orientationY, orientationZ, panningModel, positionX, positionY, positionZ, refDistance, rolloffFactor"
}];
Panner.outlets = [{
  type: "signal",
  description: "Node connection (2 channel)"
}, {
  type: "object",
  description: "Instance: PannerNode"
}];
Panner.props = {
  coneInnerAngle: {
    type: "number",
    default: 360,
    description: "Initial coneInnerAngle"
  },
  coneOuterAngle: {
    type: "number",
    default: 0,
    description: "Initial coneOuterAngle"
  },
  coneOuterGain: {
    type: "number",
    default: 0,
    description: "Initial coneOuterGain"
  },
  distanceModel: {
    type: "enum",
    enums: ["linear", "inverse", "exponential"],
    default: "inverse",
    description: 'Initial distanceModel: "linear" | "inverse" | "exponential"'
  },
  maxDistance: {
    type: "number",
    default: 1e4,
    description: "Initial maxDistance"
  },
  orientationX: {
    type: "number",
    default: 1,
    description: "Initial orientationX"
  },
  orientationY: {
    type: "number",
    default: 0,
    description: "Initial orientationY"
  },
  orientationZ: {
    type: "number",
    default: 0,
    description: "Initial orientationZ"
  },
  panningModel: {
    type: "enum",
    enums: ["equalpower", "HRTF"],
    default: "equalpower",
    description: 'Initial panningModel: "equalpower" | "HRTF"'
  },
  positionX: {
    type: "number",
    default: 0,
    description: "Initial positionX"
  },
  positionY: {
    type: "number",
    default: 0,
    description: "Initial positionY"
  },
  positionZ: {
    type: "number",
    default: 0,
    description: "Initial positionZ"
  },
  refDistance: {
    type: "number",
    default: 1,
    description: "Initial refDistance"
  },
  rolloffFactor: {
    type: "number",
    default: 1,
    description: "Initial rolloffFactor"
  }
};


/***/ }),

/***/ "./src/objects/Splitter.ts":
/*!*********************************!*\
  !*** ./src/objects/Splitter.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Splitter)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


const _Splitter = class extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: null };
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      handleArgs(this.args);
    });
    const handleArgs = (args) => {
      const channelCount = (args && typeof args[0] === "number" && ~~args[0]) > 0 ? ~~args[0] : 6;
      this.resetNode(channelCount);
    };
    this.on("updateArgs", handleArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (typeof data === "number") {
          const channelCount = ~~data > 0 ? ~~data : 6;
          if (this.node && channelCount !== this.node.numberOfOutputs)
            this.resetNode(channelCount);
          this.outlet(this.outlets - 1, this.node);
        } else if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(this.outlets - 1, this.node);
      }
    });
  }
  resetNode(channelCount) {
    this.disconnectAudio();
    this.node = this.audioCtx.createChannelSplitter(channelCount);
    this.node.channelInterpretation = "discrete";
    const factoryMeta = _Splitter.meta;
    const signalOutlet = factoryMeta.outlets[0];
    const nodeOutlet = factoryMeta.outlets[1];
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
    this.outletAudioConnections = [];
    for (let i = 0; i < channelCount; i++) {
      factoryMeta.outlets[i] = signalOutlet;
      this.outletAudioConnections[i] = { node: this.node, index: i };
    }
    factoryMeta.outlets[channelCount] = nodeOutlet;
    this.setMeta(factoryMeta);
    this.outlets = channelCount + 1;
    this.connectAudio();
  }
};
let Splitter = _Splitter;
Splitter.description = "WebAudio ChannelSplitterNode";
Splitter.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output ChannelSplitterNode instance, number to change outputs"
}];
Splitter.outlets = [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: ChannelSplitterNode"
}];
Splitter.args = [{
  type: "number",
  optional: true,
  description: "Number of Outputs",
  default: 6
}];



/***/ }),

/***/ "./src/objects/StereoPanner.ts":
/*!*************************************!*\
  !*** ./src/objects/StereoPanner.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StereoPanner)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



class StereoPanner extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createStereoPanner() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }, { node: this.node.pan }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleArgs(this.args);
    });
    const handleArgs = (args) => {
      if (typeof args[0] === "number") {
        try {
          this.node.pan.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    };
    this.on("updateArgs", handleArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          const bpf = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node.pan, bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
}
StereoPanner.description = "WebAudio StereoPannerNode";
StereoPanner.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output StereoPannerNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "pan: bpf or node connection"
}];
StereoPanner.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: StereoPannerNode"
}];
StereoPanner.args = [{
  type: "number",
  optional: true,
  description: "Initial pan",
  default: 0
}];


/***/ }),

/***/ "./src/objects/StreamDestination.ts":
/*!******************************************!*\
  !*** ./src/objects/StreamDestination.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StreamDest)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class StreamDest extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createMediaStreamDestination() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outletAll([this.node, this.node.stream]);
      }
    });
  }
}
StreamDest.description = "WebAudio MediaStreamAudioDestinationNode";
StreamDest.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output MediaStreamAudioDestinationNode instance with its stream"
}];
StreamDest.outlets = [{
  type: "object",
  description: "Instance: MediaStreamAudioDestinationNode"
}, {
  type: "object",
  description: "Stream"
}];


/***/ }),

/***/ "./src/objects/StreamSource.ts":
/*!*************************************!*\
  !*** ./src/objects/StreamSource.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StreamSrc)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class StreamSrc extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: void 0, stream: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          this._.stream = data;
          this.resetNode();
        }
        if (this.node)
          this.outlet(1, this.node);
      }
    });
  }
  resetNode() {
    this.disconnectAudio();
    this.node = this.audioCtx.createMediaStreamSource(this._.stream);
    this.node.channelInterpretation = "discrete";
    this.outletAudioConnections[0] = { node: this.node, index: 0 };
    this.connectAudio();
  }
}
StreamSrc.description = "WebAudio MediaStreamAudioSourceNode";
StreamSrc.inlets = [{
  isHot: true,
  type: "object",
  description: "MediaStream to construct node, bang to output MediaStreamAudioSourceNode instance"
}];
StreamSrc.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: MediaStreamAudioSourceNode"
}];


/***/ }),

/***/ "./src/objects/WaveShaper.ts":
/*!***********************************!*\
  !*** ./src/objects/WaveShaper.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WaveShaper)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class WaveShaper extends _base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { node: this.audioCtx.createWaveShaper() };
    this.inletAudioConnections = [{ node: this.node, index: 0 }];
    this.outletAudioConnections = [{ node: this.node, index: 0 }];
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      handleProps(this.box.props);
    });
    const handleProps = (props) => {
      try {
        if (typeof props.oversample === "string")
          this.node.oversample = props.oversample;
      } catch (e) {
        this.error(e.message);
      }
    };
    this.on("updateProps", handleProps);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          if (data instanceof Float32Array)
            this.node.curve = data;
          else
            this.error("The curve is not a Float32Array.");
        } catch (e) {
          this.error(e.message);
        }
      } else if (inlet === 2) {
        try {
          if (typeof data === "string")
            this.node.oversample = data;
          else
            this.error("Incorrect oversample type.");
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }
}
WaveShaper.description = "WebAudio WaveShaperNode";
WaveShaper.inlets = [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output WaveShaperNode instance"
}, {
  isHot: false,
  type: "object",
  description: "curve: Float32Array"
}, {
  isHot: false,
  type: "enum",
  enums: ["none", "2x", "4x"],
  description: 'oversample: "none" | "2x" | "4x"'
}];
WaveShaper.outlets = [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: WaveShaperNode"
}];
WaveShaper.props = {
  oversample: {
    type: "enum",
    enums: ["none", "2x", "4x"],
    default: "none",
    description: "Initial oversample"
  }
};


/***/ }),

/***/ "./src/objects/audioContext.ts":
/*!*************************************!*\
  !*** ./src/objects/audioContext.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ audioContext)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");

class audioContext extends _sdk__WEBPACK_IMPORTED_MODULE_0__.DefaultObject {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data))
          this.outlet(0, this.patcher.audioCtx);
      }
    });
  }
}
audioContext.description = "Get currrent patcher's audio context";
audioContext.inlets = [{
  isHot: true,
  type: "bang",
  description: "Output current audio context"
}];
audioContext.outlets = [{
  type: "object",
  description: "Current audio context"
}];


/***/ }),

/***/ "./src/objects/audioWorklet.ts":
/*!*************************************!*\
  !*** ./src/objects/audioWorklet.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ audioWorklet)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");

class audioWorklet extends _sdk__WEBPACK_IMPORTED_MODULE_0__.DefaultObject {
  constructor() {
    super(...arguments);
    this.handleInlet = async ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data))
          this.outlet(0, this.audioWorklet);
      } else if (inlet === 1) {
        if (typeof data === "string") {
          try {
            const url = window.URL.createObjectURL(new Blob([data], { type: "text/javascript" }));
            await this.audioWorklet.addModule(url);
            this.outlet(1, new _sdk__WEBPACK_IMPORTED_MODULE_0__.Bang());
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      if (!this.patcher.audioCtx.audioWorklet)
        this.error("AudioWorklet not found.");
      else
        this.audioWorklet = this.patcher.audioCtx.audioWorklet;
    });
    this.on("inlet", this.handleInlet);
  }
}
audioWorklet.description = "Get currrent patcher's audio worklet from context";
audioWorklet.inlets = [{
  isHot: true,
  type: "bang",
  description: "Output current audio worklet"
}, {
  isHot: true,
  type: "string",
  description: "Code to add as module"
}];
audioWorklet.outlets = [{
  type: "object",
  description: "Current audio worklet"
}, {
  type: "bang",
  description: "Output a bang while module is added"
}];


/***/ }),

/***/ "./src/objects/base.ts":
/*!*****************************!*\
  !*** ./src/objects/base.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebAudioObject)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class WebAudioObject extends _sdk__WEBPACK_IMPORTED_MODULE_1__.DefaultObject {
  set node(nodeIn) {
    this._.node = nodeIn;
  }
  get node() {
    return this._.node;
  }
}
WebAudioObject.package = _index__WEBPACK_IMPORTED_MODULE_0__.name;
WebAudioObject.icon = "volume up";
WebAudioObject.author = _index__WEBPACK_IMPORTED_MODULE_0__.author;
WebAudioObject.version = _index__WEBPACK_IMPORTED_MODULE_0__.version;
WebAudioObject.description = _index__WEBPACK_IMPORTED_MODULE_0__.description;


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
/* harmony export */   "PatcherAudio": () => (/* binding */ PatcherAudio),
/* harmony export */   "Patcher": () => (/* binding */ Patcher),
/* harmony export */   "Box": () => (/* binding */ Box),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "BaseObject": () => (/* binding */ BaseObject),
/* harmony export */   "BaseUI": () => (/* binding */ BaseUI),
/* harmony export */   "DefaultObject": () => (/* binding */ DefaultObject),
/* harmony export */   "DefaultUI": () => (/* binding */ DefaultUI),
/* harmony export */   "generateRemotedObject": () => (/* binding */ generateRemotedObject),
/* harmony export */   "generateDefaultObject": () => (/* binding */ generateDefaultObject),
/* harmony export */   "generateRemoteObject": () => (/* binding */ generateRemoteObject),
/* harmony export */   "Bang": () => (/* binding */ Bang),
/* harmony export */   "isBang": () => (/* binding */ isBang)
/* harmony export */ });
const sdk = globalThis.jspatcherEnv.sdk;
const {
  React,
  PatcherAudio,
  Patcher,
  Box,
  Line,
  BaseObject,
  BaseUI,
  DefaultObject,
  DefaultUI,
  generateRemotedObject,
  generateDefaultObject,
  generateRemoteObject,
  Bang,
  isBang
} = sdk;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNumberArray": () => (/* binding */ isNumberArray),
/* harmony export */   "decodeBPF": () => (/* binding */ decodeBPF),
/* harmony export */   "decodeCurve": () => (/* binding */ decodeCurve),
/* harmony export */   "decodeLine": () => (/* binding */ decodeLine)
/* harmony export */ });
const isNumberArray = (x) => Array.isArray(x) && x.every((e) => typeof e === "number");
const decodeBPF = (sIn, tupleLength) => {
  if (typeof sIn === "number")
    return [[sIn]];
  if (isNumberArray(sIn))
    return [sIn];
  if (Array.isArray(sIn) && sIn.every((a) => isNumberArray(a)))
    return sIn;
  if (typeof sIn !== "string")
    throw new Error("Failed to decode curve.");
  const numbers = sIn.split(" ").filter((s) => !!s).map((s) => +s);
  if (numbers.find((v) => !isFinite(v)))
    throw new Error("BPF contains invalid number.");
  const tuples = [];
  for (let i = 0; i < numbers.length; i++) {
    const $tuple = ~~(i / tupleLength);
    const $ = i % tupleLength;
    if (!tuples[$tuple])
      tuples[$tuple] = [];
    tuples[$tuple][$] = numbers[i];
  }
  return tuples;
};
const decodeCurve = (sIn) => decodeBPF(sIn, 3);
const decodeLine = (sIn) => decodeBPF(sIn, 2);


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = JSON.parse('{"name":"@jspatcher/package-webaudio","version":"1.0.0","description":"The WebAudio package for JSPatcher","main":"dist/index.js","scripts":{"build":"webpack --mode development","build-watch":"webpack --mode development --watch --stats-children"},"keywords":["jspatcher"],"jspatcher":{"isJSPatcherPackage":true,"thumbnail":"","jspatpkg":"index.jspatpkg.js"},"author":"Fr0stbyteR","license":"GPL-3.0-or-later","repository":"https://github.com/jspatcher/package-webaudio","devDependencies":{"@jspatcher/jspatcher":"^0.0.9","@types/react":"^17.0.19","clean-webpack-plugin":"^4.0.0-alpha.0","esbuild-loader":"^2.15.1","react":"^17.0.2","typescript":"^4.4.2","webpack":"^5.51.1","webpack-cli":"^4.8.0"}}');

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
/* harmony import */ var _objects_audioContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/audioContext */ "./src/objects/audioContext.ts");
/* harmony import */ var _objects_audioWorklet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/audioWorklet */ "./src/objects/audioWorklet.ts");
/* harmony import */ var _objects_AnyNode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/AnyNode */ "./src/objects/AnyNode.ts");
/* harmony import */ var _objects_Constant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/Constant */ "./src/objects/Constant.ts");
/* harmony import */ var _objects_Oscillator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/Oscillator */ "./src/objects/Oscillator.ts");
/* harmony import */ var _objects_Destination__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./objects/Destination */ "./src/objects/Destination.ts");
/* harmony import */ var _objects_Splitter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./objects/Splitter */ "./src/objects/Splitter.ts");
/* harmony import */ var _objects_Merger__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./objects/Merger */ "./src/objects/Merger.ts");
/* harmony import */ var _objects_Gain__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./objects/Gain */ "./src/objects/Gain.ts");
/* harmony import */ var _objects_Analyser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./objects/Analyser */ "./src/objects/Analyser.ts");
/* harmony import */ var _objects_Biquad__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./objects/Biquad */ "./src/objects/Biquad.ts");
/* harmony import */ var _objects_Convolver__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./objects/Convolver */ "./src/objects/Convolver.ts");
/* harmony import */ var _objects_Delay__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./objects/Delay */ "./src/objects/Delay.ts");
/* harmony import */ var _objects_Compressor__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./objects/Compressor */ "./src/objects/Compressor.ts");
/* harmony import */ var _objects_IIRFilter__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./objects/IIRFilter */ "./src/objects/IIRFilter.ts");
/* harmony import */ var _objects_Media__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./objects/Media */ "./src/objects/Media.ts");
/* harmony import */ var _objects_StreamDestination__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./objects/StreamDestination */ "./src/objects/StreamDestination.ts");
/* harmony import */ var _objects_StreamSource__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./objects/StreamSource */ "./src/objects/StreamSource.ts");
/* harmony import */ var _objects_Panner__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./objects/Panner */ "./src/objects/Panner.ts");
/* harmony import */ var _objects_StereoPanner__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./objects/StereoPanner */ "./src/objects/StereoPanner.ts");
/* harmony import */ var _objects_WaveShaper__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./objects/WaveShaper */ "./src/objects/WaveShaper.ts");
/* harmony import */ var _objects_AudioIn__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./objects/AudioIn */ "./src/objects/AudioIn.ts");
/* harmony import */ var _objects_AudioOut__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./objects/AudioOut */ "./src/objects/AudioOut.tsx");
/* harmony import */ var _objects_BufferSource__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./objects/BufferSource */ "./src/objects/BufferSource.ts");
























/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => ({
  audioContext: _objects_audioContext__WEBPACK_IMPORTED_MODULE_0__.default,
  audioWorklet: _objects_audioWorklet__WEBPACK_IMPORTED_MODULE_1__.default,
  "node~": _objects_AnyNode__WEBPACK_IMPORTED_MODULE_2__.default,
  "constant~": _objects_Constant__WEBPACK_IMPORTED_MODULE_3__.default,
  "oscillator~": _objects_Oscillator__WEBPACK_IMPORTED_MODULE_4__.default,
  "gain~": _objects_Gain__WEBPACK_IMPORTED_MODULE_8__.default,
  "destination~": _objects_Destination__WEBPACK_IMPORTED_MODULE_5__.default,
  "splitter~": _objects_Splitter__WEBPACK_IMPORTED_MODULE_6__.default,
  "merger~": _objects_Merger__WEBPACK_IMPORTED_MODULE_7__.default,
  "analyser~": _objects_Analyser__WEBPACK_IMPORTED_MODULE_9__.default,
  "biquad~": _objects_Biquad__WEBPACK_IMPORTED_MODULE_10__.default,
  "convolver~": _objects_Convolver__WEBPACK_IMPORTED_MODULE_11__.default,
  "delay~": _objects_Delay__WEBPACK_IMPORTED_MODULE_12__.default,
  "compressor~": _objects_Compressor__WEBPACK_IMPORTED_MODULE_13__.default,
  "iir~": _objects_IIRFilter__WEBPACK_IMPORTED_MODULE_14__.default,
  "media~": _objects_Media__WEBPACK_IMPORTED_MODULE_15__.default,
  "streamdest~": _objects_StreamDestination__WEBPACK_IMPORTED_MODULE_16__.default,
  "streamsrc~": _objects_StreamSource__WEBPACK_IMPORTED_MODULE_17__.default,
  "panner~": _objects_Panner__WEBPACK_IMPORTED_MODULE_18__.default,
  "pan~": _objects_StereoPanner__WEBPACK_IMPORTED_MODULE_19__.default,
  "waveshaper~": _objects_WaveShaper__WEBPACK_IMPORTED_MODULE_20__.default,
  "audioIn~": _objects_AudioIn__WEBPACK_IMPORTED_MODULE_21__.default,
  "audioOut~": _objects_AudioOut__WEBPACK_IMPORTED_MODULE_22__.default,
  "plugin~": Plugin,
  "bufferSource~": _objects_BufferSource__WEBPACK_IMPORTED_MODULE_23__.default
}));

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.jspatpkg.js.map