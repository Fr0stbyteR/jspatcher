(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_WebAudio_exports_ts"],{

/***/ "./src/core/objects/WebAudio/Analyser.ts":
/*!***********************************************!*\
  !*** ./src/core/objects/WebAudio/Analyser.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Analyser)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Analyser extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createAnalyser()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 6;
      this.outlets = 6;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateProps", props => {
      try {
        if (typeof props.fftSize === "number") this.node.fftSize = props.fftSize;
        if (typeof props.minDecibels === "number") this.node.minDecibels = props.minDecibels;
        if (typeof props.maxDecibels === "number") this.node.maxDecibels = props.maxDecibels;
        if (typeof props.smoothingTimeConstant === "number") this.node.smoothingTimeConstant = props.smoothingTimeConstant;
      } catch (e) {
        this.error(e.message);
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(5, this.node);
      } else if (inlet === 5) {
        if (typeof data === "object") {
          const props = data;

          try {
            if (typeof props.fftSize === "number") this.node.fftSize = props.fftSize;
            if (typeof props.minDecibels === "number") this.node.minDecibels = props.minDecibels;
            if (typeof props.maxDecibels === "number") this.node.maxDecibels = props.maxDecibels;
            if (typeof props.smoothingTimeConstant === "number") this.node.smoothingTimeConstant = props.smoothingTimeConstant;
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

_defineProperty(Analyser, "description", "WebAudio AnalyserNode");

_defineProperty(Analyser, "inlets", [{
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
}]);

_defineProperty(Analyser, "outlets", [{
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
}]);

_defineProperty(Analyser, "props", {
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
});

/***/ }),

/***/ "./src/core/objects/WebAudio/AnyNode.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/WebAudio/AnyNode.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnyNode)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AnyNode extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined
    });

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        try {
          if (data instanceof AudioNode) {
            this.disconnectAudio();
            this.state.node = data;
            const inlets = this.node.numberOfInputs || 1;
            const outlets = this.node.numberOfOutputs;
            const factoryMeta = AnyNode.meta;
            const inlet0 = factoryMeta.inlets[0];
            const inlet1 = factoryMeta.inlets[1];
            const outlet0 = factoryMeta.inlets[0];
            this.inletAudioConnections = [{
              node: this.node,
              index: 0
            }];
            factoryMeta.inlets = [inlet0];

            for (let i = 1; i < inlets; i++) {
              factoryMeta.inlets[i] = inlet1;
            }

            for (let i = 0; i < outlets; i++) {
              factoryMeta.outlets[i] = outlet0;
            }

            for (let i = 0; i < this.node.numberOfInputs; i++) {
              this.inletAudioConnections[i] = {
                node: this.node,
                index: i
              };
            }

            for (let i = 0; i < this.node.numberOfOutputs; i++) {
              this.outletAudioConnections[i] = {
                node: this.node,
                index: i
              };
            }

            this.meta = factoryMeta;
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
    });
  }

  subscribe() {
    super.subscribe();
    this.on("inlet", this.handleInlet);
  }

}

_defineProperty(AnyNode, "description", "WebAudio AudioNode");

_defineProperty(AnyNode, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, AudioNode instance to set the node."
}, {
  isHot: false,
  type: "signal",
  description: "Node connection"
}]);

_defineProperty(AnyNode, "outlets", [{
  type: "signal",
  description: "Node connection"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/AudioIO.tsx":
/*!***********************************************!*\
  !*** ./src/core/objects/WebAudio/AudioIO.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AudioIn": () => (/* binding */ AudioIn),
/* harmony export */   "AudioOut": () => (/* binding */ AudioOut)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class AudioIn extends _AudioNode__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined,
      stream: undefined,
      search: undefined
    });

    _defineProperty(this, "handleDeviceChange", async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const enums = devices.filter(d => d.kind === "audioinput").map(d => d.label || d.deviceId);
      const {
        meta
      } = this;
      meta.args[0] = _objectSpread(_objectSpread({}, AudioIn.args[0]), {}, {
        type: "enum",
        enums
      });
      this.meta = meta;
    });

    _defineProperty(this, "newSearch", async search => {
      this.state.search = search;
      let deviceId;

      if (search) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const device = devices.find(d => d.kind === "audioinput" && (d.deviceId === search || d.label === search));
        if (device) deviceId = device.deviceId;
      }

      this.state.stream = await navigator.mediaDevices.getUserMedia({
        audio: this.getConstraints(deviceId)
      });
      if (this.state.stream) this.resetNode();
    });
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
    this.on("updateArgs", args => {
      this.newSearch(args[0]);
    });
    this.on("updateProps", () => {
      this.newSearch(this.state.search);
    });
    this.on("inlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_2__.isBang)(data)) {
          await this.newSearch(data);
        }

        if (this.node) this.outlet(1, this.node);
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

    if (this.state.stream) {
      this.node = this.audioCtx.createMediaStreamSource(this.state.stream);
      this.node.channelInterpretation = "discrete";
    }

    this.outletAudioConnections[0] = {
      node: this.node,
      index: 0
    };
    this.connectAudio();
  }

}

_defineProperty(AudioIn, "description", "Get Audio input from device name or ID");

_defineProperty(AudioIn, "inlets", [{
  isHot: true,
  type: "anything",
  description: "string to fetch device name or ID, bang to output Node"
}]);

_defineProperty(AudioIn, "outlets", [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: MediaStreamAudioSourceNode"
}]);

_defineProperty(AudioIn, "args", [{
  type: "string",
  optional: false,
  description: "Device name or ID"
}]);

_defineProperty(AudioIn, "props", {
  autoGainControl: {
    type: "boolean",
    default: false,
    description: "Automatic gain control"
  },
  channelCount: {
    type: "number",
    default: undefined,
    description: "The number of independent channels of sound"
  },
  echoCancellation: {
    type: "boolean",
    default: false,
    description: "Remove all the sound being played from the input signals recorded by the microphones"
  },
  latency: {
    type: "number",
    default: undefined,
    description: "The latency or latency range, in seconds"
  },
  noiseSuppression: {
    type: "boolean",
    default: false,
    description: "Noise suppression"
  },
  sampleRate: {
    type: "number",
    default: undefined,
    description: "The sample rate in samples per second for the audio data"
  },
  sampleSize: {
    type: "number",
    default: undefined,
    description: "The linear sample size in bits"
  }
});

const supportSetSinkId = window.MediaStreamAudioDestinationNode && HTMLMediaElement.prototype.setSinkId;
class AudioOut extends _AudioNode__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", supportSetSinkId ? {
      node: this.audioCtx.destination,
      msadn: this.audioCtx.createMediaStreamDestination(),
      audio: new Audio(),
      search: undefined
    } : {
      node: this.audioCtx.destination
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }]);

    _defineProperty(this, "handleDeviceChange", async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const enums = devices.filter(d => d.kind === "audiooutput").map(d => d.label || d.deviceId);
      const {
        meta
      } = this;
      meta.args[0] = _objectSpread(_objectSpread({}, AudioOut.args[0]), {}, {
        type: "enum",
        enums
      });
      this.meta = meta;
    });

    _defineProperty(this, "newSearch", async search => {
      if (!supportSetSinkId) return;
      this.state.search = search;

      if (!search || search === "default") {
        this.resetNode();
        return;
      }

      const {
        audio
      } = this.state;
      let deviceId = audio.sinkId || "default";
      const devices = await navigator.mediaDevices.enumerateDevices();
      const device = devices.find(d => d.kind === "audiooutput" && (d.deviceId === search || d.label === search));
      if (device) deviceId = device.deviceId;

      if (audio.sinkId !== deviceId) {
        if (audio.played) audio.pause();
        audio.setSinkId(deviceId);
        audio.play();
      }

      this.resetNode(true);
    });
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
        this.state.msadn.channelInterpretation = "discrete";
        const {
          audio,
          msadn
        } = this.state;
        const {
          stream
        } = msadn;
        if ("srcObject" in audio) audio.srcObject = stream;else audio.src = URL.createObjectURL(stream);
        const search = this.box.args[0];
        navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
        this.on("destroy", () => {
          navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
        });
        this.handleDeviceChange();
        this.newSearch(search);
      }
    });
    this.on("updateArgs", args => {
      this.newSearch(args[0]);
    });
    this.on("updateProps", () => {
      this.newSearch(this.state.search);
    });
    this.on("inlet", async _ref2 => {
      let {
        data,
        inlet
      } = _ref2;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_2__.isBang)(data)) {
          await this.newSearch(data);
        }

        if (this.node) this.outlet(1, this.node);
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
      if (this.node !== this.state.msadn) {
        this.disconnectAudio();
        this.node = this.state.msadn;
        this.inletAudioConnections[0] = {
          node: this.node,
          index: 0
        };
        this.connectAudio();
      }
    } else {
      if (this.node !== this.audioCtx.destination) {
        this.disconnectAudio();
        this.node = this.audioCtx.destination;
        this.inletAudioConnections[0] = {
          node: this.node,
          index: 0
        };
        this.connectAudio();
      }
    }
  }

}

_defineProperty(AudioOut, "description", "Get Audio output from device name or ID (if supported)");

_defineProperty(AudioOut, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, string to fetch device name or ID, bang to output Node"
}]);

_defineProperty(AudioOut, "outlets", [{
  type: "object",
  description: "Instance: ".concat(supportSetSinkId ? "MediaStreamAudioDestinationNode | " : "", "AudioDestinationNode")
}]);

_defineProperty(AudioOut, "args", supportSetSinkId ? AudioIn.args : []);

_defineProperty(AudioOut, "props", supportSetSinkId ? AudioIn.props : {});

_defineProperty(AudioOut, "UI", supportSetSinkId ? class AudioOutUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_3__.DefaultUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "refContainer", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef());
  }

  componentDidMount() {
    super.componentDidMount();
    const div = this.refContainer.current;
    const {
      audio
    } = this.object.state;

    if (div && audio) {
      audio.style.display = "none";
      div.appendChild(audio);
    }
  }

  render() {
    const textContainerProps = _objectSpread(_objectSpread({}, this.props.textContainerProps), {}, {
      ref: this.refContainer
    });

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BaseUI__WEBPACK_IMPORTED_MODULE_3__.DefaultUI, _extends({
      textContainerProps: textContainerProps
    }, this.props));
  }

} : _BaseUI__WEBPACK_IMPORTED_MODULE_3__.DefaultUI);

/***/ }),

/***/ "./src/core/objects/WebAudio/AudioNode.ts":
/*!************************************************!*\
  !*** ./src/core/objects/WebAudio/AudioNode.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JSPAudioNode)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class JSPAudioNode extends _Base__WEBPACK_IMPORTED_MODULE_0__.DefaultObject {
  set node(nodeIn) {
    this.state.node = nodeIn;
  }

  get node() {
    return this.state.node;
  }

}

_defineProperty(JSPAudioNode, "package", "WebAudio");

_defineProperty(JSPAudioNode, "icon", "volume up");

_defineProperty(JSPAudioNode, "author", "Fr0stbyteR");

_defineProperty(JSPAudioNode, "version", "1.0.0");

_defineProperty(JSPAudioNode, "description", "WebAudio Nodes implementation");

/***/ }),

/***/ "./src/core/objects/WebAudio/Biquad.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/WebAudio/Biquad.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biquad)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Biquad extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createBiquadFilter()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }, {
      node: this.node.frequency
    }, {
      node: this.node.detune
    }, {
      node: this.node.Q
    }, {
      node: this.node.gain
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 6;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateProps", props => {
      const paramMap = ["frequency", "detune", "Q", "gain"];
      paramMap.forEach(key => {
        try {
          if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
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
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      const paramMap = ["frequency", "detune", "Q", "gain"];

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet === 5) {
        if (Biquad.isBiquadFilterType(data)) this.node.type = data;
      } else if (inlet > 0 && inlet < 5) {
        try {
          const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node[paramMap[inlet - 1]], bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }

}

_defineProperty(Biquad, "description", "WebAudio BiquadFilterNode");

_defineProperty(Biquad, "inlets", [{
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
}]);

_defineProperty(Biquad, "outlets", [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: BiquadFilterNode"
}]);

_defineProperty(Biquad, "props", {
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
});

_defineProperty(Biquad, "isBiquadFilterType", x => ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"].indexOf(x) >= 0);

/***/ }),

/***/ "./src/core/objects/WebAudio/BufferSource.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/WebAudio/BufferSource.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BufferSrc)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../audio/PatcherAudio */ "./src/core/audio/PatcherAudio.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class BufferSrc extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createBufferSource(),
      playing: false
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }, {
      node: this.node.playbackRate
    }, {
      node: this.node.detune
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);

    _defineProperty(this, "handleEnded", () => {
      this.outlet(1, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang());
      this.resetNode();
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 6;
      this.outlets = 2;
      this.node.addEventListener("ended", this.handleEnded);
    });
    this.on("updateProps", props => {
      const paramMap = ["playbackRate", "detune"];
      const numberParamMap = ["loopStart", "loopEnd"];
      const booleanParamMap = ["loop"];

      try {
        paramMap.forEach(key => {
          if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
        });
        numberParamMap.forEach(key => {
          if (typeof props[key] === "number") this.node[key] = props[key];
        });
        booleanParamMap.forEach(key => {
          if (typeof props[key] === "boolean") this.node[key] = props[key];
        });
      } catch (e) {
        this.error(e.message);
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      const paramMap = ["playbackRate", "detune"];

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          this.outlet(2, this.node);
        } else if (typeof data === "boolean" || typeof data === "number") {
          if (data) {
            if (!this.state.playing) {
              this.node.start();
              this.setState({
                playing: true
              });
            }
          } else {
            if (this.state.playing) {
              this.node.stop();
              this.resetNode();
            }
          }
        } else if (data instanceof AudioBuffer) {
          if (data !== this.node.buffer) this.resetNode(data);
        } else if (data instanceof _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_3__.default) {
          if (data.audioBuffer !== this.node.buffer) this.resetNode(data.audioBuffer);
        }
      } else if (inlet >= 1 && inlet <= 2) {
        try {
          const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
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
            if (inlet === 4) this.node.loopStart = data;else if (inlet === 5) this.node.loopEnd = data;
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    });
    this.on("destroy", () => {
      if (this.state.playing) this.node.stop();
      this.node.removeEventListener("ended", this.handleEnded);
    });
  }

  resetNode(bufferIn) {
    this.disconnectAudio();
    this.setState({
      playing: false
    });
    this.node.removeEventListener("ended", this.handleEnded);
    const {
      loop,
      loopStart,
      loopEnd
    } = this.node;
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
    this.inletAudioConnections[0] = {
      node: this.node,
      index: 0
    };
    this.inletAudioConnections[1] = {
      node: this.node.playbackRate
    };
    this.inletAudioConnections[2] = {
      node: this.node.detune
    };
    this.outletAudioConnections[0] = {
      node: this.node,
      index: 0
    };
    this.connectAudio();
  }

}

_defineProperty(BufferSrc, "description", "WebAudio AudioBufferSourceNode");

_defineProperty(BufferSrc, "inlets", [{
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
}]);

_defineProperty(BufferSrc, "outlets", [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: AudioBufferSourceNode"
}]);

_defineProperty(BufferSrc, "props", {
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
});

/***/ }),

/***/ "./src/core/objects/WebAudio/Compressor.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/WebAudio/Compressor.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Compressor)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Compressor extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createDynamicsCompressor()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }, {
      node: this.node.threshold
    }, {
      node: this.node.knee
    }, {
      node: this.node.ratio
    }, null, {
      node: this.node.attack
    }, {
      node: this.node.release
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 6;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateProps", props => {
      const paramMap = ["threshold", "knee", "ratio", "attack", "release"];
      paramMap.forEach(key => {
        try {
          if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      });
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      const paramMap = ["threshold", "knee", "ratio", "attack", "release"];

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet > 0 && inlet < 6) {
        try {
          const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node[paramMap[inlet - 1]], bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }

}

_defineProperty(Compressor, "description", "WebAudio DynamicsCompressorNode");

_defineProperty(Compressor, "inlets", [{
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
}]);

_defineProperty(Compressor, "outlets", [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: DynamicsCompressorNode"
}]);

_defineProperty(Compressor, "props", {
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
    default: 0.003,
    description: "Initial attack"
  },
  release: {
    type: "number",
    default: 0.25,
    description: "Initial release"
  }
});

/***/ }),

/***/ "./src/core/objects/WebAudio/Constant.ts":
/*!***********************************************!*\
  !*** ./src/core/objects/WebAudio/Constant.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Constant)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Constant extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createConstantSource()
    });

    _defineProperty(this, "inletAudioConnections", [null, {
      node: this.node.offset
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      this.node.start();
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        try {
          this.node.offset.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node.offset, bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }

}

_defineProperty(Constant, "description", "WebAudio ConstantSourceNode");

_defineProperty(Constant, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Output ConstantSourceNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "offset: bpf or node connection"
}]);

_defineProperty(Constant, "outlets", [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: ConstantSourceNode"
}]);

_defineProperty(Constant, "args", [{
  type: "number",
  optional: true,
  description: "Initial offset"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/Convolver.ts":
/*!************************************************!*\
  !*** ./src/core/objects/WebAudio/Convolver.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Convolver)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Convolver extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createConvolver()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateProps", props => {
      try {
        if (typeof props.normalize === "boolean") this.node.normalize = props.normalize;
      } catch (e) {
        this.error(e.message);
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet === 1) {
        if (data instanceof AudioBuffer) {
          try {
            this.node.buffer = data;
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

_defineProperty(Convolver, "description", "WebAudio ConvolverNode");

_defineProperty(Convolver, "inlets", [{
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
}]);

_defineProperty(Convolver, "outlets", [{
  type: "signal",
  description: "Node connection (2-4 channels)"
}, {
  type: "object",
  description: "Instance: ConvolverNode"
}]);

_defineProperty(Convolver, "props", {
  normalize: {
    type: "boolean",
    default: true,
    description: "Controls whether the impulse response from the buffer will be scaled by an equal-power normalization"
  }
});

/***/ }),

/***/ "./src/core/objects/WebAudio/Delay.ts":
/*!********************************************!*\
  !*** ./src/core/objects/WebAudio/Delay.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Delay)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Delay extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createDelay()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }, {
      node: this.node.delayTime
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        try {
          this.node.delayTime.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node.delayTime, bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }

}

_defineProperty(Delay, "description", "WebAudio DelayNode");

_defineProperty(Delay, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output DelayNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "delayTime: bpf or node connection"
}]);

_defineProperty(Delay, "outlets", [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: DelayNode"
}]);

_defineProperty(Delay, "args", [{
  type: "number",
  optional: true,
  description: "Initial delayTime"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/Destination.ts":
/*!**************************************************!*\
  !*** ./src/core/objects/WebAudio/Destination.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Destination)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Destination extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.destination
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
      this.node.channelInterpretation = "discrete";
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(0, this.node);
      }
    });
  }

}

_defineProperty(Destination, "description", "WebAudio DestinationNode");

_defineProperty(Destination, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output DestinationNode instance"
}]);

_defineProperty(Destination, "outlets", [{
  type: "object",
  description: "Instance: DestinationNode"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/Gain.ts":
/*!*******************************************!*\
  !*** ./src/core/objects/WebAudio/Gain.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gain)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Gain extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createGain()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }, {
      node: this.node.gain
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        try {
          this.node.gain.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node.gain, bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }

}

_defineProperty(Gain, "description", "WebAudio GainNode");

_defineProperty(Gain, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output GainNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "gain: bpf or node connection"
}]);

_defineProperty(Gain, "outlets", [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: GainNode"
}]);

_defineProperty(Gain, "args", [{
  type: "number",
  optional: true,
  description: "Initial gain"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/IIRFilter.ts":
/*!************************************************!*\
  !*** ./src/core/objects/WebAudio/IIRFilter.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IIRFilter)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class IIRFilter extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined,
      feedforward: [],
      feedback: []
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
    });
    this.on("update", _ref => {
      let {
        args
      } = _ref;
      if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.isNumberArray)(args[0])) this.state.feedforward = args[0];
      if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.isNumberArray)(args[1])) this.state.feedback = args[1];
      this.resetNode();
    });
    this.on("inlet", _ref2 => {
      let {
        data,
        inlet
      } = _ref2;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet === 1) {
        if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.isNumberArray)(data)) this.state.feedforward = data;
        this.resetNode();
      } else if (inlet === 2) {
        if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.isNumberArray)(data)) this.state.feedback = data;
        this.resetNode();
      }
    });
  }

  resetNode() {
    this.disconnectAudio();
    this.node = this.audioCtx.createIIRFilter(this.state.feedforward, this.state.feedback);
    this.node.channelInterpretation = "discrete";
    this.inletAudioConnections[0] = {
      node: this.node,
      index: 0
    };
    this.outletAudioConnections[0] = {
      node: this.node,
      index: 0
    };
    this.connectAudio();
  }

}

_defineProperty(IIRFilter, "description", "WebAudio IIRFilterNode");

_defineProperty(IIRFilter, "inlets", [{
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
}]);

_defineProperty(IIRFilter, "outlets", [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: IIRFilterNode"
}]);

_defineProperty(IIRFilter, "args", [{
  type: "object",
  optional: false,
  default: [],
  description: "feedforward, A sequence of coefficients: number[]"
}, {
  type: "object",
  optional: false,
  default: [],
  description: "feedback, A sequence of coefficients: number[]"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/Media.ts":
/*!********************************************!*\
  !*** ./src/core/objects/WebAudio/Media.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Media)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Media extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined,
      element: undefined
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          if (this.node) this.outlet(1, this.node);
        } else if (data instanceof HTMLMediaElement) {
          this.state.element = data;
          this.resetNode();
          this.outlet(1, this.node);
        }
      }
    });
  }

  resetNode() {
    this.disconnectAudio();
    this.node = this.audioCtx.createMediaElementSource(this.state.element);
    this.node.channelInterpretation = "discrete";
    this.outletAudioConnections[0] = {
      node: this.node,
      index: 0
    };
    this.connectAudio();
  }

}

_defineProperty(Media, "description", "WebAudio MediaElementAudioSourceNode");

_defineProperty(Media, "inlets", [{
  isHot: true,
  type: "object",
  description: "HTMLMediaElement to construct node, bang to output MediaElementAudioSourceNode instance"
}]);

_defineProperty(Media, "outlets", [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: MediaElementAudioSourceNode"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/Merger.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/WebAudio/Merger.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Merger)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Merger extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: null
    });

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.outlets = 2;
    });
    this.on("update", _ref => {
      let {
        args
      } = _ref;
      const channelCount = (typeof args[0] === "number" && ~~args[0]) > 0 ? ~~args[0] : 6;
      this.resetNode(channelCount);
    });
    this.on("inlet", _ref2 => {
      let {
        data,
        inlet
      } = _ref2;

      if (inlet === 0) {
        if (typeof data === "number") {
          const channelCount = ~~data > 0 ? ~~data : 6;
          if (this.node && channelCount !== this.node.numberOfInputs) this.resetNode(channelCount);
          this.outlet(1, this.node);
        } else if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      }
    });
  }

  resetNode(channelCount) {
    this.disconnectAudio();
    this.node = this.audioCtx.createChannelMerger(channelCount);
    this.node.channelInterpretation = "discrete";
    const factoryMeta = Merger.meta;
    const bangInlet = factoryMeta.inlets[0];
    const siganlInlet = factoryMeta.inlets[1];
    this.inletAudioConnections = [{
      node: this.node,
      index: 0
    }];
    this.outletAudioConnections = [{
      node: this.node,
      index: 0
    }];
    factoryMeta.inlets = [bangInlet];

    for (let i = 1; i < channelCount; i++) {
      factoryMeta.inlets[i] = siganlInlet;
      this.inletAudioConnections[i] = {
        node: this.node,
        index: i
      };
    }

    this.meta = factoryMeta;
    this.inlets = channelCount;
    this.connectAudio();
  }

}

_defineProperty(Merger, "description", "WebAudio ChannelMergerNode");

_defineProperty(Merger, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output DestinationNode instance, number to change inputs"
}, {
  isHot: false,
  type: "signal",
  description: "Node connection"
}]);

_defineProperty(Merger, "outlets", [{
  type: "signal",
  description: "Node connection (n channels)"
}, {
  type: "object",
  description: "Instance: ChannelMergerNode"
}]);

_defineProperty(Merger, "args", [{
  type: "number",
  optional: true,
  description: "Number of Inputs"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/Oscillator.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/WebAudio/Oscillator.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Oscillator)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Oscillator extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createOscillator()
    });

    _defineProperty(this, "inletAudioConnections", [null, {
      node: this.node.frequency
    }, {
      node: this.node.detune
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 4;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
      this.node.start();
    });
    this.on("updateProps", props => {
      if (typeof props.detune === "number") {
        try {
          this.node.detune.setValueAtTime(props.detune, this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
    this.on("updateArgs", args => {
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
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else {
        try {
          if (inlet === 1) {
            const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
            this.applyBPF(this.node.frequency, bpf);
          } else if (inlet === 2) {
            const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
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

_defineProperty(Oscillator, "description", "WebAudio OscillatorNode");

_defineProperty(Oscillator, "inlets", [{
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
}]);

_defineProperty(Oscillator, "outlets", [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: OscillatorNode"
}]);

_defineProperty(Oscillator, "args", [{
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
}]);

_defineProperty(Oscillator, "props", {
  detune: {
    type: "number",
    default: 0,
    description: "Initial detune"
  }
});

_defineProperty(Oscillator, "isOscillatorType", x => x === "sine" || x === "square" || x === "sawtooth" || x === "triangle" || x === "custom");

/***/ }),

/***/ "./src/core/objects/WebAudio/Panner.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/WebAudio/Panner.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Panner)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Panner extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createPanner()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }, {
      node: this.node.orientationX
    }, {
      node: this.node.orientationY
    }, {
      node: this.node.orientationZ
    }, null, {
      node: this.node.positionX
    }, {
      node: this.node.positionY
    }, {
      node: this.node.positionZ
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 8;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateProps", props => {
      const paramMap = ["orientationX", "orientationY", "orientationZ", "positionX", "positionY", "positionZ"];
      const numberParamMap = ["coneInnerAngle", "coneOuterAngle", "coneOuterGain", "maxDistance", "refDistance", "rolloffFactor"];

      try {
        paramMap.forEach(key => {
          if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
        });
        numberParamMap.forEach(key => {
          if (typeof props[key] === "number") this.node[key] = props[key];
        });
        if (typeof props.distanceModel === "string") this.node.distanceModel = props.distanceModel;
        if (typeof props.panningModel === "string") this.node.panningModel = props.panningModel;
      } catch (e) {
        this.error(e.message);
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      const paramMap = ["orientationX", "orientationY", "orientationZ", "positionX", "positionY", "positionZ"];
      const numberParamMap = ["coneInnerAngle", "coneOuterAngle", "coneOuterGain", "maxDistance", "refDistance", "rolloffFactor"];

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet > 0 && inlet < 7) {
        try {
          const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node[paramMap[inlet - 1]], bpf);
        } catch (e) {
          this.error(e.message);
        }
      } else if (inlet === 7) {
        if (typeof data === "object") {
          const props = data;

          try {
            paramMap.forEach(key => {
              if (typeof props[key] === "number") this.node[key].setValueAtTime(props[key], this.audioCtx.currentTime);
            });
            numberParamMap.forEach(key => {
              if (typeof props[key] === "number") this.node[key] = props[key];
            });
            if (typeof props.distanceModel === "string") this.node.distanceModel = props.distanceModel;
            if (typeof props.panningModel === "string") this.node.panningModel = props.panningModel;
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    });
  }

}

_defineProperty(Panner, "description", "WebAudio PannerNode");

_defineProperty(Panner, "inlets", [{
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
}]);

_defineProperty(Panner, "outlets", [{
  type: "signal",
  description: "Node connection (2 channel)"
}, {
  type: "object",
  description: "Instance: PannerNode"
}]);

_defineProperty(Panner, "props", {
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
    default: 10000,
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
});

/***/ }),

/***/ "./src/core/objects/WebAudio/Record.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/WebAudio/Record.ts ***!
  \*********************************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: D:\\p\\jspatcher\\src\\core\\objects\\WebAudio\\Record.ts: Unexpected token, expected \",\" (104:69)\n\n\u001b[0m \u001b[90m 102 |\u001b[39m         \u001b[36mconst\u001b[39m $start \u001b[33m=\u001b[39m loop \u001b[33m?\u001b[39m \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mgetProp(\u001b[32m\"loopStart\"\u001b[39m) \u001b[33m:\u001b[39m \u001b[35m0\u001b[39m\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 103 |\u001b[39m         \u001b[36mif\u001b[39m ($start \u001b[33m>=\u001b[39m length) \u001b[36mreturn\u001b[39m\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 104 |\u001b[39m         \u001b[36mconst\u001b[39m $end \u001b[33m=\u001b[39m loop \u001b[33m?\u001b[39m \u001b[33mMath\u001b[39m\u001b[33m.\u001b[39mmax(\u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mgetProp(\u001b[32m\"loopEnd\"\u001b[39m) \u001b[33m:\u001b[39m length\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m     |\u001b[39m                                                                      \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 105 |\u001b[39m         \u001b[36mconst\u001b[39m range \u001b[33m=\u001b[39m $end \u001b[33m-\u001b[39m $start\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 106 |\u001b[39m         \u001b[36mconst\u001b[39m bufferSize \u001b[33m=\u001b[39m bufferIn[\u001b[35m0\u001b[39m]\u001b[33m.\u001b[39mlength\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 107 |\u001b[39m         \u001b[36mif\u001b[39m (mono) bufferIn\u001b[33m.\u001b[39msplice(\u001b[35m1\u001b[39m)\u001b[33m;\u001b[39m\u001b[0m\n    at Object._raise (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:807:17)\n    at Object.raiseWithData (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:800:17)\n    at Object.raise (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:761:17)\n    at Object.unexpected (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:9931:16)\n    at Object.expect (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:9905:28)\n    at Object.parseCallExpressionArguments (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11086:14)\n    at Object.parseCoverCallAndAsyncArrowHead (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:11012:29)\n    at Object.parseSubscript (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10948:19)\n    at Object.parseSubscript (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:7099:18)\n    at Object.parseSubscripts (D:\\p\\jspatcher\\node_modules\\@babel\\core\\node_modules\\@babel\\parser\\lib\\index.js:10921:19)");

/***/ }),

/***/ "./src/core/objects/WebAudio/Splitter.ts":
/*!***********************************************!*\
  !*** ./src/core/objects/WebAudio/Splitter.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Splitter)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Splitter extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: null
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
    });
    this.on("update", _ref => {
      let {
        args
      } = _ref;
      const channelCount = (args && typeof args[0] === "number" && ~~args[0]) > 0 ? ~~args[0] : 6;
      this.resetNode(channelCount);
    });
    this.on("inlet", _ref2 => {
      let {
        data,
        inlet
      } = _ref2;

      if (inlet === 0) {
        if (typeof data === "number") {
          const channelCount = ~~data > 0 ? ~~data : 6;
          if (this.node && channelCount !== this.node.numberOfOutputs) this.resetNode(channelCount);
          this.outlet(this.outlets - 1, this.node);
        } else if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(this.outlets - 1, this.node);
      }
    });
  }

  resetNode(channelCount) {
    this.disconnectAudio();
    this.node = this.audioCtx.createChannelSplitter(channelCount);
    this.node.channelInterpretation = "discrete";
    const factoryMeta = Splitter.meta;
    const signalOutlet = factoryMeta.outlets[0];
    const nodeOutlet = factoryMeta.outlets[1];
    this.inletAudioConnections = [{
      node: this.node,
      index: 0
    }];
    this.outletAudioConnections = [];

    for (let i = 0; i < channelCount; i++) {
      factoryMeta.outlets[i] = signalOutlet;
      this.outletAudioConnections[i] = {
        node: this.node,
        index: i
      };
    }

    factoryMeta.outlets[channelCount] = nodeOutlet;
    this.meta = factoryMeta;
    this.outlets = channelCount + 1;
    this.connectAudio();
  }

}

_defineProperty(Splitter, "description", "WebAudio ChannelSplitterNode");

_defineProperty(Splitter, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output ChannelSplitterNode instance, number to change outputs"
}]);

_defineProperty(Splitter, "outlets", [{
  type: "signal",
  description: "Node connection (1 channel)"
}, {
  type: "object",
  description: "Instance: ChannelSplitterNode"
}]);

_defineProperty(Splitter, "args", [{
  type: "number",
  optional: true,
  description: "Number of Outputs"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/StereoPanner.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/WebAudio/StereoPanner.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StereoPanner)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class StereoPanner extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createStereoPanner()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }, {
      node: this.node.pan
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "number") {
        try {
          this.node.pan.setValueAtTime(args[0], this.audioCtx.currentTime);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
          this.applyBPF(this.node.pan, bpf);
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }

}

_defineProperty(StereoPanner, "description", "WebAudio StereoPannerNode");

_defineProperty(StereoPanner, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output StereoPannerNode instance"
}, {
  isHot: false,
  type: "signal",
  description: "pan: bpf or node connection"
}]);

_defineProperty(StereoPanner, "outlets", [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: StereoPannerNode"
}]);

_defineProperty(StereoPanner, "args", [{
  type: "number",
  optional: true,
  description: "Initial pan"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/StreamDestination.ts":
/*!********************************************************!*\
  !*** ./src/core/objects/WebAudio/StreamDestination.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StreamDest)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class StreamDest extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createMediaStreamDestination()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outletAll([this.node, this.node.stream]);
      }
    });
  }

}

_defineProperty(StreamDest, "description", "WebAudio MediaStreamAudioDestinationNode");

_defineProperty(StreamDest, "inlets", [{
  isHot: true,
  type: "signal",
  description: "Node connection, bang to output MediaStreamAudioDestinationNode instance with its stream"
}]);

_defineProperty(StreamDest, "outlets", [{
  type: "object",
  description: "Instance: MediaStreamAudioDestinationNode"
}, {
  type: "object",
  description: "Stream"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/StreamSource.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/WebAudio/StreamSource.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StreamSrc)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class StreamSrc extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: undefined,
      stream: undefined
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          this.state.stream = data;
          this.resetNode();
        }

        if (this.node) this.outlet(1, this.node);
      }
    });
  }

  resetNode() {
    this.disconnectAudio();
    this.node = this.audioCtx.createMediaStreamSource(this.state.stream);
    this.node.channelInterpretation = "discrete";
    this.outletAudioConnections[0] = {
      node: this.node,
      index: 0
    };
    this.connectAudio();
  }

}

_defineProperty(StreamSrc, "description", "WebAudio MediaStreamAudioSourceNode");

_defineProperty(StreamSrc, "inlets", [{
  isHot: true,
  type: "object",
  description: "MediaStream to construct node, bang to output MediaStreamAudioSourceNode instance"
}]);

_defineProperty(StreamSrc, "outlets", [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: MediaStreamAudioSourceNode"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/WaveShaper.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/WebAudio/WaveShaper.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WaveShaper)
/* harmony export */ });
/* harmony import */ var _AudioNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioNode */ "./src/core/objects/WebAudio/AudioNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class WaveShaper extends _AudioNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      node: this.audioCtx.createWaveShaper()
    });

    _defineProperty(this, "inletAudioConnections", [{
      node: this.node,
      index: 0
    }]);

    _defineProperty(this, "outletAudioConnections", [{
      node: this.node,
      index: 0
    }]);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
      this.node.channelInterpretation = "discrete";
    });
    this.on("updateProps", props => {
      try {
        if (typeof props.oversample === "string") this.node.oversample = props.oversample;
      } catch (e) {
        this.error(e.message);
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(1, this.node);
      } else if (inlet === 1) {
        try {
          if (data instanceof Float32Array) this.node.curve = data;else this.error("The curve is not a Float32Array.");
        } catch (e) {
          this.error(e.message);
        }
      } else if (inlet === 2) {
        try {
          if (typeof data === "string") this.node.oversample = data;else this.error("Incorrect oversample type.");
        } catch (e) {
          this.error(e.message);
        }
      }
    });
  }

}

_defineProperty(WaveShaper, "description", "WebAudio WaveShaperNode");

_defineProperty(WaveShaper, "inlets", [{
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
}]);

_defineProperty(WaveShaper, "outlets", [{
  type: "signal",
  description: "Node connection"
}, {
  type: "object",
  description: "Instance: WaveShaperNode"
}]);

_defineProperty(WaveShaper, "props", {
  oversample: {
    type: "enum",
    enums: ["none", "2x", "4x"],
    default: "none",
    description: "Initial oversample"
  }
});

/***/ }),

/***/ "./src/core/objects/WebAudio/WebAudioPlugin.ts":
/*!*****************************************************!*\
  !*** ./src/core/objects/WebAudio/WebAudioPlugin.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Plugin)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class PluginUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_1__.DOMUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      children: this.object.state.children
    }));
  }

}

class Plugin extends _Base__WEBPACK_IMPORTED_MODULE_0__.BaseObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      merger: undefined,
      splitter: undefined,
      node: undefined,
      plugin: undefined,
      children: []
    });

    _defineProperty(this, "handleDestroy", () => {
      const {
        node,
        plugin
      } = this.state;
      if (node) node.disconnect();
      if (plugin) plugin.audioNode.destroy();
    });

    _defineProperty(this, "handlePreInit", () => undefined);

    _defineProperty(this, "handlePostInit", async () => {
      if (this.box.args[0]) await this.load(this.box.args[0]);
      this.on("updateArgs", this.handleUpdateArgs);
    });

    _defineProperty(this, "handleUpdateArgs", async args => {
      if (typeof args[0] === "string") await this.load(this.box.args[0]);
    });

    _defineProperty(this, "handleInlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          if (this.state.node) this.outlet(this.outlets - 1, this.state.node);
        } else if (typeof data === "string") {
          await this.load(data);
        } else if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.isMIDIEvent)(data)) {
          const bytes = Array.from(data);
          if (this.state.node) this.state.node.scheduleEvents({
            type: "midi",
            data: {
              bytes
            },
            time: this.audioCtx.currentTime
          });
        } else if (typeof data === "object") {
          if (this.state.node) {
            for (const key in data) {
              try {
                const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data[key]);
                let t = 0;
                bpf.forEach(a => {
                  if (a.length > 1) t += a[1];
                  this.state.node.scheduleEvents({
                    type: "automation",
                    data: {
                      id: key,
                      value: a[0],
                      normalized: false
                    },
                    time: this.audioCtx.currentTime + t
                  });
                }); // else this.state.node.setParam(key, bpf[bpf.length - 1][0]);
              } catch (e) {
                this.error(e.message);
              }
            }
          }
        }
      } else {
        const con = this.inletAudioConnections[inlet].node;

        if (con instanceof AudioParam) {
          try {
            const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.decodeLine)(data);
            this.applyBPF(con, bpf);
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    });
  }

  async load(url) {
    let WAPCtor;
    let plugin;

    try {
      WAPCtor = (await import(
      /* webpackIgnore: true */
      url)).default;
    } catch (e) {
      this.error(e.message);
    }

    let node;
    let element;

    try {
      plugin = await WAPCtor.createInstance(this.audioCtx);
      node = plugin.audioNode;
      element = await plugin.createGui();
    } catch (e) {
      if (e) this.error(e.message);
      return;
    }

    this.disconnectAudio();
    this.handleDestroy();
    this.state.children = [element];
    this.updateUI({
      children: this.state.children
    });
    node.channelInterpretation = "discrete";
    const inlets = node.numberOfInputs;
    const outlets = node.numberOfOutputs;
    Object.assign(this.state, {
      node,
      plugin
    });
    const Ctor = this.constructor;
    const firstInletMeta = Ctor.inlets[0];

    const firstInletSignalMeta = _objectSpread(_objectSpread({}, firstInletMeta), {}, {
      type: "signal"
    });

    const inletMeta = {
      isHot: false,
      type: "signal",
      description: "Node connection"
    };
    const audioParamInletMeta = {
      isHot: false,
      type: "number",
      description: ": bpf or node connection"
    };
    const outletMeta = {
      type: "signal",
      description: "Node connection"
    };
    const lastOutletMeta = Ctor.outlets[0];
    const factoryMeta = Ctor.meta;

    for (let i = 0; i < inlets; i++) {
      if (i === 0) factoryMeta.inlets[i] = inlets ? firstInletSignalMeta : firstInletMeta;else factoryMeta.inlets[i] = inletMeta;
      this.inletAudioConnections[i] = {
        node,
        index: i
      };
    }

    for (let i = 0; i < outlets; i++) {
      factoryMeta.outlets[i] = outletMeta;
      this.outletAudioConnections[i] = {
        node,
        index: i
      };
    }

    factoryMeta.outlets[outlets] = lastOutletMeta;
    const paramInfo = await plugin.audioNode.getParameterInfo();
    const params = Object.keys(paramInfo);

    for (let i = inlets || 1; i < (inlets || 1) + params.length; i++) {
      const path = params[i - (inlets || 1)];
      const param = paramInfo[path];
      const {
        defaultValue,
        minValue,
        maxValue
      } = param;
      factoryMeta.inlets[i] = _objectSpread(_objectSpread({}, audioParamInletMeta), {}, {
        description: "".concat(path).concat(audioParamInletMeta.description, ": ").concat(defaultValue, " (").concat(minValue, " - ").concat(maxValue, ")")
      });
    }

    this.meta = factoryMeta;
    this.inlets = (inlets || 1) + params.length;
    this.outlets = outlets + 1;
    this.connectAudio();
    this.outlet(this.outlets - 1, this.state.node);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", this.handlePreInit);
    this.on("postInit", this.handlePostInit);
    this.on("inlet", this.handleInlet);
    this.on("destroy", this.handleDestroy);
  }

}

_defineProperty(Plugin, "description", "Dynamically load WebAudioModule");

_defineProperty(Plugin, "inlets", [{
  isHot: true,
  type: "anything",
  description: "A bang to output the instance, url to load, or a param-bpf map, or a MIDI event"
}]);

_defineProperty(Plugin, "outlets", [{
  type: "object",
  description: "WebAudioModule instance"
}]);

_defineProperty(Plugin, "args", [{
  type: "string",
  optional: false,
  description: "WebAudioModule URL"
}]);

_defineProperty(Plugin, "UI", PluginUI);

/***/ }),

/***/ "./src/core/objects/WebAudio/audioContext.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/WebAudio/audioContext.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ audioContext)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class audioContext extends _Base__WEBPACK_IMPORTED_MODULE_0__.DefaultObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {});
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) this.outlet(0, this.patcher.audioCtx);
      }
    });
  }

}

_defineProperty(audioContext, "description", "Get currrent patcher's audio context");

_defineProperty(audioContext, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Output current audio context"
}]);

_defineProperty(audioContext, "outlets", [{
  type: "object",
  description: "Current audio context"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/audioWorklet.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/WebAudio/audioWorklet.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ audioWorklet)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class audioWorklet extends _Base__WEBPACK_IMPORTED_MODULE_0__.DefaultObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {});

    _defineProperty(this, "audioWorklet", void 0);

    _defineProperty(this, "handleInlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) this.outlet(0, this.audioWorklet);
      } else if (inlet === 1) {
        if (typeof data === "string") {
          try {
            const url = window.URL.createObjectURL(new Blob([data], {
              type: "text/javascript"
            }));
            await this.audioWorklet.addModule(url);
            this.outlet(1, new _Base__WEBPACK_IMPORTED_MODULE_0__.Bang());
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 2;
      if (!this.patcher.audioCtx.audioWorklet) this.error("AudioWorklet not found.");else this.audioWorklet = this.patcher.audioCtx.audioWorklet;
    });
    this.on("inlet", this.handleInlet);
  }

}

_defineProperty(audioWorklet, "description", "Get currrent patcher's audio worklet from context");

_defineProperty(audioWorklet, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Output current audio worklet"
}, {
  isHot: true,
  type: "string",
  description: "Code to add as module"
}]);

_defineProperty(audioWorklet, "outlets", [{
  type: "object",
  description: "Current audio worklet"
}, {
  type: "bang",
  description: "Output a bang while module is added"
}]);

/***/ }),

/***/ "./src/core/objects/WebAudio/buffer.tsx":
/*!**********************************************!*\
  !*** ./src/core/objects/WebAudio/buffer.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BufferUI": () => (/* binding */ BufferUI),
/* harmony export */   "default": () => (/* binding */ Buffer)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/modules/Modal/Modal.js");
/* harmony import */ var _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../audio/PatcherAudio */ "./src/core/audio/PatcherAudio.ts");
/* harmony import */ var _audio_AudioEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../audio/AudioEditor */ "./src/core/audio/AudioEditor.ts");
/* harmony import */ var _components_editors_audio_AudioEditorUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../components/editors/audio/AudioEditorUI */ "./src/components/editors/audio/AudioEditorUI.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








class BufferUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_5__.DefaultPopupUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      audio: this.object.state.audio,
      timestamp: performance.now(),
      editor: undefined,
      dockEditor: undefined
    }));

    _defineProperty(this, "handleChanged", () => {
      const editor = this.props.inDock ? this.state.editor : this.state.dockEditor;
      if (editor.isTemporary) editor.save();
    });

    _defineProperty(this, "handleDoubleClick", async () => {
      if (!this.editor.state.locked) return;
      if (!this.state.audio) return;
      this.unloadEditor();
      await this.loadEditor();
      this.setState({
        modalOpen: true
      });
    });

    _defineProperty(this, "handleClose", () => {
      this.unloadEditor();
      this.setState({
        modalOpen: false
      });
    });

    _defineProperty(this, "handleMouseDownModal", e => e.stopPropagation());
  }

  async loadEditor() {
    const key = this.props.inDock ? "editor" : "dockEditor";
    const editor = new _audio_AudioEditor__WEBPACK_IMPORTED_MODULE_2__.default(this.object.state.audio);
    await editor.init();
    editor.on("changed", this.handleChanged);
    this.setState({
      timestamp: performance.now(),
      [key]: editor
    }, () => editor.setActive());
  }

  unloadEditor() {
    const key = this.props.inDock ? "editor" : "dockEditor";
    const editor = this.state[key];
    if (!editor) return;
    editor.off("changed", this.handleChanged);
    editor.destroy();
    this.setState({
      timestamp: performance.now(),
      [key]: undefined
    }, () => this.props.editor.setActive());
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.inDock) this.loadEditor();
  }

  componentDidUpdate(prevProps, prevState) {
    const key = this.props.inDock ? "editor" : "dockEditor";
    const editor = this.state[key];

    if (prevState.audio !== this.state.audio) {
      if (editor) {
        this.unloadEditor();
        this.loadEditor();
      }
    }

    if (prevProps.inDock !== this.props.inDock) {
      if (this.props.inDock) {
        this.loadEditor();
      } else {
        if (editor) {
          this.unloadEditor();
        }
      }
    }

    if (editor) {
      if (prevState.width !== this.state.width || prevState.height !== this.state.height) {
        editor.onUiResized();
      }
    }

    super.componentDidUpdate(prevProps, prevState);
  }

  componentWillUnmount() {
    this.unloadEditor();
    super.componentWillUnmount();
  }

  render() {
    const editor = this.props.inDock ? this.state.editor : this.state.dockEditor;
    const content = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "editor-container",
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        position: "relative"
      }
    }, editor ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_editors_audio_AudioEditorUI__WEBPACK_IMPORTED_MODULE_3__.default, {
      key: this.state.timestamp,
      editor: editor,
      env: this.props.object.patcher.env,
      lang: this.props.object.patcher.env.language
    }) : undefined);
    const children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_6__.default.Content, {
      style: {
        height: "100%",
        width: "100%",
        position: "relative"
      },
      onMouseDown: this.handleMouseDownModal
    }, content);
    if (this.props.inDock) return children;

    const containerProps = _objectSpread({}, this.props.containerProps);

    if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;

    const modalProps = _objectSpread(_objectSpread({}, this.props.modalProps), {}, {
      children,
      className: "audio-editor",
      open: this.state.modalOpen,
      onClose: this.handleClose,
      onKeyDown: undefined,
      basic: true,
      size: "fullscreen",
      closeIcon: true
    });

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BaseUI__WEBPACK_IMPORTED_MODULE_5__.DefaultPopupUI, _extends({}, this.props, {
      modalProps: modalProps,
      containerProps: containerProps
    }));
  }

}

_defineProperty(BufferUI, "dockable", true);

class Buffer extends _Base__WEBPACK_IMPORTED_MODULE_4__.DefaultObject {
  constructor() {
    var _this$box$args$;

    super(...arguments);

    _defineProperty(this, "state", {
      key: (_this$box$args$ = this.box.args[0]) === null || _this$box$args$ === void 0 ? void 0 : _this$box$args$.toString(),
      audio: undefined,
      file: undefined,
      numberOfChannels: 1,
      length: this.audioCtx.sampleRate,
      sampleRate: this.audioCtx.sampleRate
    });
  }

  subscribe() {
    super.subscribe();

    const assertBuffer = audio => {
      if (!audio) return false;
      const {
        numberOfChannels,
        length,
        sampleRate
      } = this.state;
      return audio.numberOfChannels === numberOfChannels && audio.length === length && audio.sampleRate === sampleRate;
    };

    const handleFilePathChanged = () => {
      var _this$state$file;

      this.setState({
        key: (_this$state$file = this.state.file) === null || _this$state$file === void 0 ? void 0 : _this$state$file.projectPath
      });
    };

    const handleSaved = async e => {
      if (e.instance === this.state.audio) return;
      await reload();
    };

    const subsribeItem = async () => {
      const {
        audio,
        file
      } = this.state;
      await audio.addObserver(this);

      if (file) {
        file.on("destroyed", reload);
        file.on("nameChanged", handleFilePathChanged);
        file.on("pathChanged", handleFilePathChanged);
        file.on("saved", handleSaved);
      }
    };

    const unsubscribeItem = async () => {
      const {
        audio,
        file
      } = this.state;

      if (file) {
        file.off("destroyed", reload);
        file.off("nameChanged", handleFilePathChanged);
        file.off("pathChanged", handleFilePathChanged);
        file.off("saved", handleSaved);
      }

      await audio.removeObserver(this);
    };

    const reload = async () => {
      if (this.state.audio) await unsubscribeItem();
      const {
        key
      } = this.state;
      let audio;

      try {
        const {
          item,
          newItem
        } = await this.getSharedItem(key, "audio", async () => {
          const {
            numberOfChannels,
            length,
            sampleRate
          } = this.state;
          audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default.fromSilence(this.patcher.project, numberOfChannels, length, sampleRate);
          return audio;
        });

        if (newItem) {
          audio.file = item;
        } else {
          audio = await item.instantiate();
        }

        this.setState({
          audio,
          file: item
        });
        this.updateUI({
          audio
        });
      } catch (error) {
        this.error(error);
      } finally {
        await subsribeItem();
        this.outlet(1, new _Base__WEBPACK_IMPORTED_MODULE_4__.Bang());
      }
    };

    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      var _args$;

      if (!this.state.audio) return;
      const oldKey = this.state.key;
      const key = (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.toString();
      const numberOfChannels = typeof args[1] === "number" ? ~~args[1] : 1;
      const length = typeof args[2] === "number" ? ~~args[2] : this.audioCtx.sampleRate;
      const sampleRate = typeof args[3] === "number" ? ~~args[3] : this.audioCtx.sampleRate;
      this.setState({
        key,
        numberOfChannels,
        length,
        sampleRate
      });

      if (key !== oldKey || !assertBuffer(this.state.audio)) {
        reload();
      }
    });
    this.on("postInit", reload);
    this.on("inlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_4__.isBang)(data)) {
          if (data instanceof _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default) {
            this.state.audio.setAudio(data);
          } else if (data instanceof AudioBuffer) {
            const audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default.fromNativeAudioBuffer(this.patcher.project, data);
            this.state.audio.setAudio(audio);
          } else {
            let audioBuffer;

            try {
              const ab = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
              audioBuffer = await this.patcher.audioCtx.decodeAudioData(ab);
            } catch (e) {
              this.error("Decode File failed.");
              return;
            }

            const audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default.fromNativeAudioBuffer(this.patcher.project, audioBuffer);
            this.state.audio.setAudio(audio);
          }
        }

        this.outlet(0, this.state.audio);
      } else if (inlet === 1) {
        if (data instanceof _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default) {
          this.state.audio.setAudio(data);
        } else if (data instanceof AudioBuffer) {
          const audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default.fromNativeAudioBuffer(this.patcher.project, data);
          this.state.audio.setAudio(audio);
        } else {
          let audioBuffer;

          try {
            const ab = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
            audioBuffer = await this.patcher.audioCtx.decodeAudioData(ab);
          } catch (e) {
            this.error("Decode File failed.");
            return;
          }

          const audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default.fromNativeAudioBuffer(this.patcher.project, audioBuffer);
          this.state.audio.setAudio(audio);
        }
      } else if (inlet === 2) {
        if (typeof data === "string" || typeof data === "number") {
          this.setState({
            key: data === null || data === void 0 ? void 0 : data.toString()
          });
          reload();
        }
      }
    });
    this.on("destroy", unsubscribeItem);
  }

}

_defineProperty(Buffer, "package", "WebAudio");

_defineProperty(Buffer, "icon", "volume up");

_defineProperty(Buffer, "author", "Fr0stbyteR");

_defineProperty(Buffer, "version", "1.0.0");

_defineProperty(Buffer, "description", "Audio File Decoder");

_defineProperty(Buffer, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Bang to output stored buffer, file to decode, AudioBuffer or PatcherAudio to store then output it as PatcherAudio."
}, {
  isHot: false,
  type: "anything",
  description: "File to decode, AudioBuffer or PatcherAudio to store the buffer."
}, {
  isHot: false,
  type: "anything",
  description: "Set variable name."
}]);

_defineProperty(Buffer, "outlets", [{
  type: "anything",
  description: "PatcherAudio"
}, {
  type: "bang",
  description: "Output a bang while the PatcherAudio buffer object is loaded/changed."
}]);

_defineProperty(Buffer, "args", [{
  type: "anything",
  optional: true,
  description: "Variable name"
}, {
  type: "number",
  optional: true,
  description: "Initialize buffer's number of channels"
}, {
  type: "number",
  optional: true,
  description: "Initialize buffer's length in samples"
}, {
  type: "number",
  optional: true,
  description: "Initialize buffer's sample rate"
}]);

_defineProperty(Buffer, "UI", BufferUI);

/***/ }),

/***/ "./src/core/objects/WebAudio/exports.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/WebAudio/exports.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _audioContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audioContext */ "./src/core/objects/WebAudio/audioContext.ts");
/* harmony import */ var _audioWorklet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./audioWorklet */ "./src/core/objects/WebAudio/audioWorklet.ts");
/* harmony import */ var _AnyNode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AnyNode */ "./src/core/objects/WebAudio/AnyNode.ts");
/* harmony import */ var _Constant__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Constant */ "./src/core/objects/WebAudio/Constant.ts");
/* harmony import */ var _Oscillator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Oscillator */ "./src/core/objects/WebAudio/Oscillator.ts");
/* harmony import */ var _Destination__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Destination */ "./src/core/objects/WebAudio/Destination.ts");
/* harmony import */ var _Splitter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Splitter */ "./src/core/objects/WebAudio/Splitter.ts");
/* harmony import */ var _Merger__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Merger */ "./src/core/objects/WebAudio/Merger.ts");
/* harmony import */ var _Gain__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Gain */ "./src/core/objects/WebAudio/Gain.ts");
/* harmony import */ var _Analyser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Analyser */ "./src/core/objects/WebAudio/Analyser.ts");
/* harmony import */ var _Biquad__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Biquad */ "./src/core/objects/WebAudio/Biquad.ts");
/* harmony import */ var _Convolver__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Convolver */ "./src/core/objects/WebAudio/Convolver.ts");
/* harmony import */ var _Delay__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Delay */ "./src/core/objects/WebAudio/Delay.ts");
/* harmony import */ var _Compressor__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Compressor */ "./src/core/objects/WebAudio/Compressor.ts");
/* harmony import */ var _IIRFilter__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./IIRFilter */ "./src/core/objects/WebAudio/IIRFilter.ts");
/* harmony import */ var _Media__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Media */ "./src/core/objects/WebAudio/Media.ts");
/* harmony import */ var _StreamDestination__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./StreamDestination */ "./src/core/objects/WebAudio/StreamDestination.ts");
/* harmony import */ var _StreamSource__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./StreamSource */ "./src/core/objects/WebAudio/StreamSource.ts");
/* harmony import */ var _Panner__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./Panner */ "./src/core/objects/WebAudio/Panner.ts");
/* harmony import */ var _StereoPanner__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./StereoPanner */ "./src/core/objects/WebAudio/StereoPanner.ts");
/* harmony import */ var _WaveShaper__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./WaveShaper */ "./src/core/objects/WebAudio/WaveShaper.ts");
/* harmony import */ var _AudioIO__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./AudioIO */ "./src/core/objects/WebAudio/AudioIO.tsx");
/* harmony import */ var _WebAudioPlugin__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./WebAudioPlugin */ "./src/core/objects/WebAudio/WebAudioPlugin.ts");
/* harmony import */ var _buffer__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./buffer */ "./src/core/objects/WebAudio/buffer.tsx");
/* harmony import */ var _BufferSource__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./BufferSource */ "./src/core/objects/WebAudio/BufferSource.ts");
/* harmony import */ var _Record__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./Record */ "./src/core/objects/WebAudio/Record.ts");


























/*
const {
    BaseAudioContext,
    AudioContext,
    webkitAudioContext,
    AudioParam,
    AudioNode,
    AudioScheduledSourceNode,
    OscillatorNode,
    GainNode,
    AudioDestinationNode,
    ChannelSplitterNode
} = window;
const WebAudioAPI: Record<string, any> = {
    BaseAudioContext,
    AudioContext,
    webkitAudioContext,
    AudioParam,
    AudioNode,
    AudioScheduledSourceNode,
    OscillatorNode,
    GainNode,
    AudioDestinationNode,
    ChannelSplitterNode
};
const outs: TPackage = {};
for (const key in WebAudioAPI) {
    outs[key] = Importer.import(key, WebAudioAPI[key]);
}*/

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  // ...outs,
  audioContext: _audioContext__WEBPACK_IMPORTED_MODULE_0__.default,
  audioWorklet: _audioWorklet__WEBPACK_IMPORTED_MODULE_1__.default,
  "node~": _AnyNode__WEBPACK_IMPORTED_MODULE_2__.default,
  "constant~": _Constant__WEBPACK_IMPORTED_MODULE_3__.default,
  "oscillator~": _Oscillator__WEBPACK_IMPORTED_MODULE_4__.default,
  "gain~": _Gain__WEBPACK_IMPORTED_MODULE_8__.default,
  "destination~": _Destination__WEBPACK_IMPORTED_MODULE_5__.default,
  "splitter~": _Splitter__WEBPACK_IMPORTED_MODULE_6__.default,
  "merger~": _Merger__WEBPACK_IMPORTED_MODULE_7__.default,
  "analyser~": _Analyser__WEBPACK_IMPORTED_MODULE_9__.default,
  "biquad~": _Biquad__WEBPACK_IMPORTED_MODULE_10__.default,
  "convolver~": _Convolver__WEBPACK_IMPORTED_MODULE_11__.default,
  "delay~": _Delay__WEBPACK_IMPORTED_MODULE_12__.default,
  "compressor~": _Compressor__WEBPACK_IMPORTED_MODULE_13__.default,
  "iir~": _IIRFilter__WEBPACK_IMPORTED_MODULE_14__.default,
  "media~": _Media__WEBPACK_IMPORTED_MODULE_15__.default,
  "streamdest~": _StreamDestination__WEBPACK_IMPORTED_MODULE_16__.default,
  "streamsrc~": _StreamSource__WEBPACK_IMPORTED_MODULE_17__.default,
  "panner~": _Panner__WEBPACK_IMPORTED_MODULE_18__.default,
  "pan~": _StereoPanner__WEBPACK_IMPORTED_MODULE_19__.default,
  "waveshaper~": _WaveShaper__WEBPACK_IMPORTED_MODULE_20__.default,
  "audioIn~": _AudioIO__WEBPACK_IMPORTED_MODULE_21__.AudioIn,
  "audioOut~": _AudioIO__WEBPACK_IMPORTED_MODULE_21__.AudioOut,
  "plugin~": _WebAudioPlugin__WEBPACK_IMPORTED_MODULE_22__.default,
  "buffer~": _buffer__WEBPACK_IMPORTED_MODULE_23__.default,
  "bufferSource~": _BufferSource__WEBPACK_IMPORTED_MODULE_24__.default,
  "record~": _Record__WEBPACK_IMPORTED_MODULE_25__.default
});

/***/ })

}]);
//# sourceMappingURL=072f3c6ded8feb39f03b.js.map