(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_dsp_exports_ts"],{

/***/ "./src/core/objects/dsp/Base.ts":
/*!**************************************!*\
  !*** ./src/core/objects/dsp/Base.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseDSP": () => (/* binding */ BaseDSP),
/* harmony export */   "DefaultDSP": () => (/* binding */ DefaultDSP)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class BaseDSP extends _Base__WEBPACK_IMPORTED_MODULE_0__.BaseObject {}

_defineProperty(BaseDSP, "package", "dsp");

_defineProperty(BaseDSP, "author", "Fr0stbyteR");

_defineProperty(BaseDSP, "version", "1.0.0");

class DefaultDSP extends _Base__WEBPACK_IMPORTED_MODULE_0__.DefaultObject {}

_defineProperty(DefaultDSP, "package", "dsp");

_defineProperty(DefaultDSP, "author", "Fr0stbyteR");

_defineProperty(DefaultDSP, "version", "1.0.0");

/***/ }),

/***/ "./src/core/objects/dsp/Oscilloscope.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/dsp/Oscilloscope.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OscilloscopeUI": () => (/* binding */ OscilloscopeUI),
/* harmony export */   "Oscilloscope": () => (/* binding */ Oscilloscope)
/* harmony export */ });
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! color-js */ "./node_modules/color-js/color.js");
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../worklets/SpectralAnalyser */ "./src/core/worklets/SpectralAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class OscilloscopeUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_1__.CanvasUI {
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
    const l = this.object.getProp("windowSize");
    const {
      sampleRate
    } = this.object.audioCtx; // Background

    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    if (!buffer) return;
    const {
      $read: $ui32,
      data: t
    } = buffer;
    if (!t || !t.length || !t[0].length) return;
    const $ = Atomics.load($ui32, 0);
    const channels = t.length;
    const dl = t[0].length; // Vertical Range

    let yMin = -range;
    let yMax = range;
    let yFactor = range;

    if (autoRange) {
      // Fastest way to get min and max to have: 1. max abs value for y scaling, 2. mean value for zero-crossing
      let i = channels;
      let s = 0;

      while (i--) {
        let j = l;

        while (j--) {
          s = t[i][($ + j) % dl];
          if (s < yMin) yMin = s;else if (s > yMax) yMax = s;
        }
      }

      yFactor = Math.max(1, Math.abs(yMin), Math.abs(yMax))
      /* * vzoom*/
      ;
    }

    const calcY = (v, i) => channelHeight * (+interleaved * i + 1 - (v - yMin) / (yMax - yMin)); // Grids


    ctx.strokeStyle = gridColor;
    let vStep = 0.25;

    while (yFactor / 2 / vStep > 2) vStep *= 2; // Minimum horizontal grids in channel one side = 2


    ctx.beginPath();
    ctx.setLineDash([]);
    const gridChannels = interleaved ? channels : 1;
    const channelHeight = (height - bottom) / gridChannels;

    for (let i = 0; i < gridChannels; i++) {
      let y = calcY(0, i);
      ctx.moveTo(left, y);
      ctx.lineTo(width, y); // 0-line

      for (let j = vStep; j < yFactor; j += vStep) {
        y = calcY(j, i);
        ctx.moveTo(left, y);
        ctx.lineTo(width, y); // below 0

        y = calcY(-j, i);
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
          const thresh = (yMin + yMax) * 0.5 + 0.001; // the zero-crossing with "offset"

          while ($zerox < l && t[i][($ + $zerox++) % dl] > thresh); // Find first raise


          if ($zerox >= l - 1) {
            // Found nothing, no stablization
            $zerox = 0;
          } else {
            while ($zerox < l && t[i][($ + $zerox++) % dl] < thresh); // Find first drop


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
      const pixelsPerSamp = (width - left) / ($1 - 1 - $0);
      const sampsPerPixel = Math.max(1, Math.round(1 / pixelsPerSamp));

      if (interleaved) {
        ctx.save();
        const clip = new Path2D();
        clip.rect(0, i * channelHeight, width, channelHeight);
        ctx.clip(clip);
      }

      ctx.beginPath();
      channelColor[i] = color_js__WEBPACK_IMPORTED_MODULE_0__(phosphorColor).shiftHue(i * hueOffset).toHSL();
      ctx.strokeStyle = channelColor[i];
      let maxInStep;
      let minInStep;

      for (let j = $0; j < $1; j++) {
        const $j = (j + $) % dl;
        const samp = t[i][$j];
        const $step = (j - $0) % sampsPerPixel;

        if ($step === 0) {
          maxInStep = samp;
          minInStep = samp;
        }

        if ($step !== sampsPerPixel - 1) {
          if ($step !== 0) {
            if (samp > maxInStep) maxInStep = samp;
            if (samp < minInStep) minInStep = samp;
          }

          continue;
        }

        const x = (j - $step - $0) * pixelsPerSamp;
        let y = calcY(maxInStep, i);
        if (j === $0) ctx.moveTo(x, y);else ctx.lineTo(x, y);

        if (minInStep !== maxInStep) {
          y = calcY(minInStep, i);
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      if (interleaved) ctx.restore();
    } // Stats


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

class Oscilloscope extends _Base__WEBPACK_IMPORTED_MODULE_3__.BaseDSP {
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
      await _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__.default.register(this.audioCtx.audioWorklet);
      this.state.node = new _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__.default(this.audioCtx);
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
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_4__.isBang)(data)) this.updateUI({
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpectralAnalyser": () => (/* binding */ SpectralAnalyser)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../worklets/SpectralAnalyser */ "./src/core/worklets/SpectralAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class SpectralAnalyser extends _Base__WEBPACK_IMPORTED_MODULE_0__.DefaultDSP {
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
      await _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__.default.register(this.audioCtx.audioWorklet);
      this.state.node = new _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__.default(this.audioCtx);
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
          if ((0,_Base__WEBPACK_IMPORTED_MODULE_2__.isBang)(e.data)) startRequest();
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpectrogramUI": () => (/* binding */ SpectrogramUI),
/* harmony export */   "Spectrogram": () => (/* binding */ Spectrogram)
/* harmony export */ });
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../worklets/SpectralAnalyser */ "./src/core/worklets/SpectralAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import * as Color from "color-js";





class SpectrogramUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_0__.CanvasUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "$lastFrame", -1);

    _defineProperty(this, "dataFrames", 1);

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
      dataFrames
    } = this;
    if (!ctx) return;
    const [width, height] = this.fullSize();
    offscreenCtx.canvas.width = dataFrames;
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
    const allAmplitudes = await this.object.state.node.getAllAmplitudes(); // Background

    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    if (!allAmplitudes) return;
    const {
      data: f,
      $totalFrames,
      fftBins: bins,
      frames,
      dataFrames,
      $writeFrame: $writeFrameUi32
    } = allAmplitudes;
    if (!f || !f.length || !f[0].length) return;
    const l = f[0].length;
    const channels = f.length; // Draw to offscreen canvas

    const $lastFrame = Atomics.load($totalFrames, 0) - 1;
    const $writeFrame = Atomics.load($writeFrameUi32, 0);
    let $frame0 = $writeFrame;
    let $frame1 = $frame0 + dataFrames;

    if (this.dataFrames !== dataFrames) {
      offscreenCtx.canvas.width = dataFrames;
      this.dataFrames = dataFrames;
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
        offscreenCtx.fillRect(j % dataFrames, i * osChannelHeight, 1, osChannelHeight);

        for (let k = 0; k < bins; k++) {
          const samp = (0,_utils_math__WEBPACK_IMPORTED_MODULE_4__.atodb)(f[i][(k + j * bins) % l]);
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
          offscreenCtx.fillRect(j % dataFrames, (bins - k - 1) * vGrid + i * osChannelHeight, 1, Math.max(1, vGrid));
        }
      }
    } // Grids


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
    $frame0 = ($frame1 - frames) % dataFrames;
    $frame1 = $frame0 + frames;

    if ($frame1 <= dataFrames) {
      ctx.drawImage(offscreenCtx.canvas, $frame0, 0, frames, offscreenVRes, left, 0, width - left, height - bottom);
    } else {
      const sSplit = dataFrames - $frame0;
      const dSplit = sSplit / frames * (width - left);
      ctx.drawImage(offscreenCtx.canvas, $frame0, 0, sSplit, offscreenVRes, left, 0, dSplit, height - bottom);
      ctx.drawImage(offscreenCtx.canvas, 0, 0, $frame1 - dataFrames - 0.01, offscreenVRes, dSplit + left, 0, width - left - dSplit, height - bottom);
    }

    ctx.restore();
  }

}

_defineProperty(SpectrogramUI, "defaultSize", [120, 60]);

class Spectrogram extends _Base__WEBPACK_IMPORTED_MODULE_2__.BaseDSP {
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
      await _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__.default.register(this.audioCtx.audioWorklet);
      this.state.node = new _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_1__.default(this.audioCtx);
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
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_3__.isBang)(data)) this.updateUI({
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

_defineProperty(Spectrogram, "UI", SpectrogramUI);

/***/ }),

/***/ "./src/core/objects/dsp/Spectroscope.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/dsp/Spectroscope.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpectroscopeUI": () => (/* binding */ SpectroscopeUI),
/* harmony export */   "Spectroscope": () => (/* binding */ Spectroscope)
/* harmony export */ });
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! color-js */ "./node_modules/color-js/color.js");
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../worklets/SpectralAnalyser */ "./src/core/worklets/SpectralAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







class SpectroscopeUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_1__.CanvasUI {
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
    const lastAmplitudes = await this.object.state.node.getLastAmplitudes(); // Background

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
        const samp = (0,_utils_math__WEBPACK_IMPORTED_MODULE_5__.atodb)(f[i][j]);
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

class Spectroscope extends _Base__WEBPACK_IMPORTED_MODULE_3__.BaseDSP {
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
      await _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__.default.register(this.audioCtx.audioWorklet);
      this.state.node = new _worklets_SpectralAnalyser__WEBPACK_IMPORTED_MODULE_2__.default(this.audioCtx);
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
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_4__.isBang)(data)) this.updateUI({
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TemporalAnalyser": () => (/* binding */ TemporalAnalyser)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/dsp/Base.ts");
/* harmony import */ var _worklets_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../worklets/TemporalAnalyser */ "./src/core/worklets/TemporalAnalyser.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class TemporalAnalyser extends _Base__WEBPACK_IMPORTED_MODULE_0__.DefaultDSP {
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
          const extractorKeys = ["buffer", "rms", "zcr", "absMax"];
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
        if (props.windowSize) this.applyBPF(parameters.get("windowSize"), [[props.windowSize]]);
      }
    });
    this.on("postInit", async () => {
      await _worklets_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__.default.register(this.audioCtx.audioWorklet);
      this.state.node = new _worklets_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__.default(this.audioCtx);
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
          if ((0,_Base__WEBPACK_IMPORTED_MODULE_2__.isBang)(e.data)) startRequest();
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
  absMax: {
    type: "boolean",
    default: false,
    description: "Getting the absolute Maximum"
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SpectralAnalyser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SpectralAnalyser */ "./src/core/objects/dsp/SpectralAnalyser.ts");
/* harmony import */ var _TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemporalAnalyser */ "./src/core/objects/dsp/TemporalAnalyser.ts");
/* harmony import */ var _Oscilloscope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Oscilloscope */ "./src/core/objects/dsp/Oscilloscope.ts");
/* harmony import */ var _Spectroscope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Spectroscope */ "./src/core/objects/dsp/Spectroscope.ts");
/* harmony import */ var _Spectrogram__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Spectrogram */ "./src/core/objects/dsp/Spectrogram.ts");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "temporalAnalyser~": _TemporalAnalyser__WEBPACK_IMPORTED_MODULE_1__.TemporalAnalyser,
  "spectralAnalyser~": _SpectralAnalyser__WEBPACK_IMPORTED_MODULE_0__.SpectralAnalyser,
  "scope~": _Oscilloscope__WEBPACK_IMPORTED_MODULE_2__.Oscilloscope,
  "spectroscope~": _Spectroscope__WEBPACK_IMPORTED_MODULE_3__.Spectroscope,
  "spectrogram~": _Spectrogram__WEBPACK_IMPORTED_MODULE_4__.Spectrogram
});

/***/ }),

/***/ "./src/core/worklets/SpectralAnalyser.ts":
/*!***********************************************!*\
  !*** ./src/core/worklets/SpectralAnalyser.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "processorID": () => (/* binding */ processorID),
/* harmony export */   "default": () => (/* binding */ SpectralAnalyserNode)
/* harmony export */ });
/* harmony import */ var _SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SpectralAnalyser.worklet.ts */ "./src/core/worklets/SpectralAnalyser.worklet.ts");
/* harmony import */ var _SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioWorkletProxyNode */ "./src/core/worklets/AudioWorkletProxyNode.ts");
/* harmony import */ var _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioWorkletRegister */ "./src/core/worklets/AudioWorkletRegister.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // eslint-disable-line import/extensions



const processorID = "__JSPatcher_SpectralAnalyser";
class SpectralAnalyserNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor(context) {
    super(context, processorID, {
      numberOfInputs: 1,
      numberOfOutputs: 0
    });
    const _destroy = this.destroy;

    this.destroy = async () => {
      await _destroy.call(this);
      this._disposed = true;
    };
  }

}

_defineProperty(SpectralAnalyserNode, "processorID", processorID);

_defineProperty(SpectralAnalyserNode, "register", audioWorklet => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__.default.register(audioWorklet, processorID, (_SpectralAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default())));

_defineProperty(SpectralAnalyserNode, "fnNames", ["getBuffer", "getLastAmplitudes", "getAllAmplitudes", "getAllAmplitudes", "getEstimatedFreq", "getCentroid", "getFlatness", "getFlux", "getKurtosis", "getSkewness", "getRolloff", "getSlope", "getSpread", "gets", "destroy"]);

/***/ }),

/***/ "./src/core/worklets/SpectralAnalyser.worklet.ts":
/*!*******************************************************!*\
  !*** ./src/core/worklets/SpectralAnalyser.worklet.ts ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "js/f305085e3f0a7ee57877.worklet.js";

/***/ })

}]);
//# sourceMappingURL=0babb8c9ed1b9328a3ea.js.map