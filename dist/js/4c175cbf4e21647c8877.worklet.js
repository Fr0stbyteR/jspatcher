/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/babel-loader/lib/index.js!./src/core/worklets/TemporalAnalyser.worklet.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js!./src/core/worklets/TemporalAnalyser.worklet.ts":
/*!***************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./src/core/worklets/TemporalAnalyser.worklet.ts ***!
  \***************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/buffer */ "./src/utils/buffer.ts");
/* harmony import */ var _utils_yin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/yin */ "./src/utils/yin.ts");
/* harmony import */ var _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioWorkletProxyProcessor */ "./src/core/worklets/AudioWorkletProxyProcessor.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




const processorID = "__Sheng_TemporalAnalyser";
if (!globalThis.SharedArrayBuffer) globalThis.SharedArrayBuffer = ArrayBuffer;
const {
  registerProcessor,
  sampleRate
} = globalThis;
/**
 * Some data to transfer across threads
 */

class TemporalAnalyserAtoms {
  /**
   * Atomic Lock
   */
  get lock() {
    return globalThis.Atomics ? Atomics.load(this._lock, 0) : null;
  }

  set lock(value) {
    if (globalThis.Atomics) Atomics.store(this._lock, 0, value);
  }
  /**
   * Next audio sample index to write into window
   */


  get $() {
    return this._$[0];
  }

  set $(value) {
    this._$[0] = value;
  }
  /**
   * Total samples written counter
   */


  get $total() {
    return this._$total[0];
  }

  set $total(value) {
    this._$total[0] = value;
  }
  /**
   * Infinite loop until unlocked
   */


  wait() {
    while (this.lock);
  }
  /**
   * Get all atoms
   */


  get asObject() {
    return {
      $: this._$,
      $total: this._$total,
      lock: this._lock
    };
  }

  constructor() {
    _defineProperty(this, "_sab", void 0);

    _defineProperty(this, "_lock", void 0);

    _defineProperty(this, "_$", void 0);

    _defineProperty(this, "_$total", void 0);

    this._sab = new SharedArrayBuffer(3 * Uint32Array.BYTES_PER_ELEMENT);
    this._lock = new Int32Array(this._sab, 0, 1);
    this._$ = new Uint32Array(this._sab, 4, 1);
    this._$total = new Uint32Array(this._sab, 8, 1);
  }

}

class TemporalAnalyserProcessor extends _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "destroyed", false);

    _defineProperty(this, "atoms", new TemporalAnalyserAtoms());

    _defineProperty(this, "windowSab", []);

    _defineProperty(this, "window", []);

    _defineProperty(this, "_windowSize", 1024);
  }

  static get parameterDescriptors() {
    return [{
      defaultValue: 1024,
      maxValue: 2 ** 32,
      minValue: 128,
      name: "windowSize"
    }];
  }

  /**
   * Atomic Lock
   */
  get lock() {
    return this.atoms.lock;
  }

  set lock(value) {
    this.atoms.lock = value;
  }
  /**
   * Next audio sample index to write into window
   */


  get $() {
    return this.atoms.$;
  }

  set $(value) {
    this.atoms.$ = value;
  }
  /**
   * Total samples written counter
   */


  get $total() {
    return this.atoms.$total;
  }

  set $total(value) {
    this.atoms.$total = value;
  }
  /**
   * Infinite loop until unlocked
   */


  wait() {
    this.atoms.wait();
  }

  getRMS() {
    return this.window.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["rms"]);
  }

  getAbsMax() {
    return this.window.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["absMax"]);
  }

  getZCR() {
    return this.window.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["zcr"]);
  }

  getEstimatedFreq(threshold, probabilityThreshold) {
    return this.window.map(ch => Object(_utils_yin__WEBPACK_IMPORTED_MODULE_1__["default"])(ch, {
      sampleRate,
      threshold,
      probabilityThreshold
    }));
  }

  getBuffer() {
    const data = this.window;
    const {
      $,
      $total,
      lock
    } = this.atoms.asObject;
    return {
      data,
      $,
      $total,
      lock
    };
  }

  destroy() {
    this.destroyed = true;
    this.port.close();
  }

  get windowSize() {
    return this._windowSize;
  }

  set windowSize(sizeIn) {
    this._windowSize = ~~Math.min(2 ** 32, Math.max(128, sizeIn || 1024));
  }

  process(inputs, outputs, parameters) {
    if (this.destroyed) return false;
    const input = inputs[0];
    this.windowSize = ~~parameters.windowSize[0];
    const {
      windowSize
    } = this;

    if (this.window.length > input.length) {
      // Too much channels ?
      this.windowSab.splice(input.length);
      this.window.splice(input.length);
    }

    if (input.length === 0) return true;
    const bufferSize = Math.max(...input.map(c => c.length)) || 128;
    this.wait();
    this.lock = 1;
    this.$ %= windowSize;
    this.$total += bufferSize;
    let {
      $
    } = this; // Init windows

    for (let i = 0; i < input.length; i++) {
      $ = this.$;

      if (!this.window[i]) {
        // Initialise channel if not exist
        this.windowSab[i] = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
        this.window[i] = new Float32Array(windowSize);
      } else {
        if (this.window[i].length !== windowSize) {
          // adjust window size if not corresponded
          const oldWindow = this.window[i];
          const oldWindowSize = oldWindow.length;
          const windowSab = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
          const window = new Float32Array(windowSab);
          $ = Object(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["setTypedArray"])(window, oldWindow, 0, $ - Math.min(windowSize, oldWindowSize));
          this.windowSab[i] = windowSab;
          this.window[i] = window;
        }
      }
    }

    this.$ = $; // Write

    for (let i = 0; i < input.length; i++) {
      const window = this.window[i];
      const channel = input[i].length ? input[i] : new Float32Array(bufferSize);
      $ = this.$;

      if (bufferSize > windowSize) {
        window.set(channel.subarray(bufferSize - windowSize));
        $ = 0;
      } else {
        $ = Object(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["setTypedArray"])(window, channel, $);
      }
    }

    this.$ = $;
    this.lock = 0;
    return true;
  }

}

registerProcessor(processorID, TemporalAnalyserProcessor);

/***/ }),

/***/ "./src/core/worklets/AudioWorkletProxyProcessor.ts":
/*!*********************************************************!*\
  !*** ./src/core/worklets/AudioWorkletProxyProcessor.ts ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* eslint-disable no-undef */
const {
  AudioWorkletProcessor
} = globalThis;
const Processor = class extends AudioWorkletProcessor {
  static get fnNames() {
    return [];
  }

  constructor(options) {
    var _this;

    super(options);
    _this = this;
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;

    const handleMessage = async e => {
      const {
        id,
        call,
        args,
        value,
        error
      } = e.data;

      if (call) {
        const r = {
          id
        };

        try {
          r.value = await this[call](...args);
        } catch (e) {
          r.error = e;
        }

        this.port.postMessage(r);
      } else {
        if (error) {
          if (rejects[id]) rejects[id](error);
          delete rejects[id];
          return;
        }

        if (resolves[id]) {
          resolves[id](value);
          delete resolves[id];
        }
      }
    };

    const call = function call(_call) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return new Promise((resolve, reject) => {
        const id = messagePortRequestId--;
        resolves[id] = resolve;
        rejects[id] = reject;

        _this.port.postMessage({
          id,
          call: _call,
          args
        });
      });
    };

    const Ctor = this.constructor;
    Ctor.fnNames.forEach(name => this[name] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return call(name, ...args);
    });
    this.port.start();
    this.port.addEventListener("message", handleMessage);
  }

};
/* harmony default export */ __webpack_exports__["default"] = (Processor);

/***/ }),

/***/ "./src/utils/buffer.ts":
/*!*****************************!*\
  !*** ./src/utils/buffer.ts ***!
  \*****************************/
/*! exports provided: sum, mean, median, maxIndex, energy, rms, absMax, zcr, centroid, conjugatedCentroid, geometricMean, flatness, flux, kurtosis, skewness, rolloff, slope, spread, setTypedArray, getSubTypedArray, sliceBuffer, fftw2Amp, estimateFreq, indexToFreq */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sum", function() { return sum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mean", function() { return mean; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "median", function() { return median; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxIndex", function() { return maxIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "energy", function() { return energy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rms", function() { return rms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "absMax", function() { return absMax; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zcr", function() { return zcr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "centroid", function() { return centroid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conjugatedCentroid", function() { return conjugatedCentroid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geometricMean", function() { return geometricMean; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatness", function() { return flatness; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flux", function() { return flux; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kurtosis", function() { return kurtosis; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "skewness", function() { return skewness; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rolloff", function() { return rolloff; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slope", function() { return slope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spread", function() { return spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTypedArray", function() { return setTypedArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSubTypedArray", function() { return getSubTypedArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sliceBuffer", function() { return sliceBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fftw2Amp", function() { return fftw2Amp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "estimateFreq", function() { return estimateFreq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "indexToFreq", function() { return indexToFreq; });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./src/utils/math.ts");

const sum = array => {
  let sum = 0;

  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }

  return sum;
};
const mean = array => sum(array) / array.length;
const median = array => {
  const length = array.length;
  if (length === 0) throw new Error("trying to calculate median of empty array");
  const sortedArray = array.slice().sort();
  if (length % 2 === 0) return (sortedArray[length / 2 - 1] + sortedArray[length / 2]) / 2;
  return sortedArray[~~(length / 2)];
};
const maxIndex = array => {
  if (!array.length) return 0;
  let index = 0;
  let max = array[0];
  let i = array.length;

  while (i-- > 1) {
    const cur = array[i];
    if (cur <= max) continue;
    max = cur;
    index = i;
  }

  return index;
};
const energy = signal => {
  let sum = 0;
  let sample = 0;

  for (let i = 0; i < signal.length; i++) {
    sample = signal[i];
    sum += sample * sample;
  }

  return sum;
};
const rms = signal => Math.sqrt(energy(signal) / signal.length);
const absMax = signal => {
  let max = 0;
  let sample = 0;

  for (let i = 0; i < signal.length; i++) {
    sample = Math.abs(signal[i]);
    if (sample > max) max = sample;
  }

  return max;
};
const zcr = signal => {
  let zcr = 0;
  let lastPositive = true;
  let positive = true;

  for (let i = 0; i < signal.length; i++) {
    positive = signal[i] >= 0;
    if (positive !== lastPositive) zcr++;
    lastPositive = positive;
  }

  return zcr;
};
const centroid = array => {
  let weightedSum = 0;
  let weight = 0;

  for (let i = 0; i < array.length; i++) {
    weightedSum += i * Math.abs(array[i]);
    weight += array[i];
  }

  return weight === 0 ? 0 : weightedSum / weight;
};
const conjugatedCentroid = (array, factor) => {
  let weightedSum = 0;
  let weight = 0;

  for (let i = 0; i < array.length; i++) {
    weightedSum += i ** factor * Math.abs(array[i]);
    weight += array[i];
  }

  return weight === 0 ? 0 : weightedSum / weight;
};
const geometricMean = array => {
  const length = array.length;
  let sum = 0;
  let sample = 0;

  for (let i = 0; i < length; i++) {
    sample = array[i];
    if (sample <= 0) return 0;
    sum += Math.log(array[i]);
  }

  return Math.exp(sum / length);
};
const flatness = array => geometricMean(array) / mean(array);
/**
 * https://essentia.upf.edu/reference/std_Flux.html
 *
 * @param {TypedArray} cur
 * @param {TypedArray} prev
 * @param {("L1" | "L2")} [norm]
 * @param {boolean} [halfRectify]
 * @returns
 */

const flux = (cur, prev, norm, halfRectify) => {
  let flux = 0;

  if (norm === "L2") {
    if (halfRectify === true) {
      // L2 + halfRectify
      for (let i = 0; i < cur.length; i++) {
        const diff = cur[i] - prev[i];
        if (diff < 0) continue;
        flux += diff * diff;
      }

      return Math.sqrt(flux);
    }

    for (let i = 0; i < cur.length; i++) {
      // L2 not halfRectify
      const diff = cur[i] - prev[i];
      flux += diff * diff;
    }

    return Math.sqrt(flux);
  }

  if (halfRectify === true) {
    // L1 + halfRectify
    for (let i = 0; i < cur.length; i++) {
      const diff = cur[i] - prev[i];
      if (diff < 0) continue;
      flux += diff;
    }

    return flux;
  }

  for (let i = 0; i < cur.length; i++) {
    // L1 not halfRectify
    const diff = cur[i] - prev[i];
    flux += Math.abs(diff);
  }

  return flux;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralKurtosis.js
 *
 * @param {TypedArray} array
 */

const kurtosis = array => {
  const c1 = centroid(array);
  const c2 = conjugatedCentroid(array, 2);
  const c3 = conjugatedCentroid(array, 3);
  const c4 = conjugatedCentroid(array, 4);
  const numerator = -3 * c1 ** 4 + 6 * c1 * c2 - 4 * c1 * c3 + c4;
  const denominator = (c2 - c1 ** 2) ** 2;
  return numerator / denominator;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralSkewness.js
 *
 * @param {TypedArray} array
 */

const skewness = array => {
  const c1 = centroid(array);
  const c2 = conjugatedCentroid(array, 2);
  const c3 = conjugatedCentroid(array, 3);
  const numerator = 2 * c1 ** 3 - 3 * c1 * c2 + c3;
  const denominator = (c2 - c1 ** 2) ** 1.5;
  return numerator / denominator;
};
/**
 * https://essentia.upf.edu/reference/std_RollOff.html
 *
 * @param {TypedArray} array
 * @param {number} [cutoff] Between 0 - 1
 * @returns
 */

const rolloff = (array, cutoff) => {
  const length = array.length;
  let e = energy(array);
  const threshold = (cutoff || 0.99) * e;
  let n = length - 1;

  while (e > threshold && n >= 0) {
    const element = array[n];
    e -= element * element;
    --n;
  }

  return n + 1;
};
const slope = array => {
  const n = array.length;
  const xSum = n * n / 2;
  const x2Sum = (n - 1) * n * (2 * n - 1) / 6;
  let ySum = 0;
  let xySum = 0;

  for (let x = 0; x < n; x++) {
    const y = array[x];
    ySum += y;
    xySum += x * y;
  }

  return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
};
const spread = array => Math.sqrt(conjugatedCentroid(array, 2)) - centroid(array) ** 2;
/**
 * Copy buffer to another, support negative offset index
 *
 * @template T
 * @param {T} to
 * @param {T} from
 * @param {number} [offsetTo]
 * @param {number} [offsetFrom]
 * @returns
 */
// eslint-disable-next-line arrow-parens

const setTypedArray = (to, from, offsetTo, offsetFrom) => {
  const toLength = to.length;
  const fromLength = from.length;
  const spillLength = Math.min(toLength, fromLength);
  let spilled = 0;
  let $to = Object(_math__WEBPACK_IMPORTED_MODULE_0__["mod"])(offsetTo, toLength) || 0;
  let $from = Object(_math__WEBPACK_IMPORTED_MODULE_0__["mod"])(offsetFrom, fromLength) || 0;

  while (spilled < spillLength) {
    const $spillLength = Math.min(spillLength - spilled, toLength - $to, fromLength - $from);
    const $fromEnd = $from + $spillLength;
    if ($from === 0 && $fromEnd === fromLength) to.set(from, $to);else to.set(from.subarray($from, $fromEnd), $to);
    $to = ($to + $spillLength) % toLength;
    $from = $fromEnd % fromLength;
    spilled += $spillLength;
  }

  return $to;
}; // eslint-disable-next-line arrow-parens

const getSubTypedArray = (from, length, offset) => {
  const fromLength = from.length;
  const $ = Object(_math__WEBPACK_IMPORTED_MODULE_0__["mod"])(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength) return from;
  if ($ + length < fromLength) return from.subarray($, $ + length);
  const to = new from.constructor(length);
  setTypedArray(to, from, 0, $);
  return to;
}; // eslint-disable-next-line arrow-parens

const sliceBuffer = (from, length, offset) => {
  const fromLength = from.length;
  const $ = Object(_math__WEBPACK_IMPORTED_MODULE_0__["mod"])(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength) return from.slice();
  if ($ + length < fromLength) return from.slice($, $ + length);
  const to = new from.constructor(length);
  setTypedArray(to, from, 0, $);
  return to;
};
/**
 * http://www.fftw.org/fftw3_doc/The-Halfcomplex_002dformat-DFT.html
 *
 * @param {Float32Array} from
 */

const fftw2Amp = (from, windowEnergyFactor) => {
  const {
    length
  } = from;
  const amps = new Float32Array(length / 2);

  for (let i = 0; i < length / 2; i++) {
    const real = from[i];
    const imag = i === 0 || i === length / 2 - 1 ? 0 : from[length - i];
    amps[i] = (real * real + imag * imag) ** 0.5 / length * windowEnergyFactor;
  }

  return amps;
};
const estimateFreq = (amps, sampleRate) => indexToFreq(maxIndex(amps), amps.length, sampleRate);
const indexToFreq = (i, fftBins, sampleRate) => i % fftBins / fftBins * sampleRate / 2;

/***/ }),

/***/ "./src/utils/math.ts":
/*!***************************!*\
  !*** ./src/utils/math.ts ***!
  \***************************/
/*! exports provided: mod, round, floor, ceil, toRad, toMIDI, atodb, dbtoa, iNormExp, normExp, scale, scaleClip, isIdentityMatrix, identityMatrix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mod", function() { return mod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "round", function() { return round; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "floor", function() { return floor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ceil", function() { return ceil; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRad", function() { return toRad; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toMIDI", function() { return toMIDI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "atodb", function() { return atodb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dbtoa", function() { return dbtoa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iNormExp", function() { return iNormExp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normExp", function() { return normExp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scale", function() { return scale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scaleClip", function() { return scaleClip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isIdentityMatrix", function() { return isIdentityMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "identityMatrix", function() { return identityMatrix; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/utils.ts");

/**
 * Mod support wrapping with negative numbers
 */

const mod = (x, y) => (x % y + y) % y;
/**
 * Round a number to multiple of another
 */

const round = (x, to) => Math.abs(to) < 1 ? Math.round(x * (1 / to)) / (1 / to) : Math.round(x / to) * to;
/**
 * Floor a number to multiple of another
 */

const floor = (x, to) => Math.abs(to) < 1 ? Math.floor(x * (1 / to)) / (1 / to) : Math.floor(x / to) * to;
/**
 * Ceil a number to multiple of another
 */

const ceil = (x, to) => Math.abs(to) < 1 ? Math.ceil(x * (1 / to)) / (1 / to) : Math.ceil(x / to) * to;
/**
 * Degree to radian
 */

const toRad = degrees => degrees * Math.PI / 180;
/**
 * MIDI note number to string
 */

const toMIDI = f => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
/**
 * Linear amplitude ([0, 1]) to dB ([-Inf, 0])
 *
 * @param {number} a linear amplitude value
 * @returns {number} dB value
 */

const atodb = a => 20 * Math.log10(a);
/**
 * dB ([-Inf, 0]) to Linear mplitude ([0, 1])
 *
 * @param {number} db dB value
 * @returns {number} linear amplitude value
 */

const dbtoa = db => 10 ** (db / 20);
/**
 * De-scale a exponently scaled value
 *
 * @param {number} x normalized value to scale between ([0, 1])
 * @param {number} e exponent factor used to scale, 0 means linear, 1 does ** 1.5 curve
 * @returns {number} de-scaled value
 */

const iNormExp = (x, e) => Math.max(0, x) ** 1.5 ** -e;
/**
 * Scale exponently a normalized value
 *
 * @param {number} x normalized value to scale between ([0, 1])
 * @param {number} e exponent factor, 0 means linear, 1 does ** 1.5 curve
 * @returns {number} scaled value
 */

const normExp = (x, e) => Math.max(0, x) ** 1.5 ** e;
const scale = (x, l1, h1, l2, h2) => {
  const r1 = h1 - l1;
  const r2 = h2 - l2;
  return (x - l1) / r1 * r2 + l2;
};
const scaleClip = (x, l1, h1, l2, h2) => Math.max(l2, Math.min(h2, scale(x, l1, h1, l2, h2))); // eslint-disable-next-line arrow-body-style

const isIdentityMatrix = x => {
  return Array.isArray(x) && x.every((row, i) => Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isNumberArray"])(row) && row.length === x.length && row.every((e, j) => e === (j === i ? 1 : 0)));
};
const identityMatrix = dim => new Array(dim).fill(undefined).map((x, i) => new Array(dim).fill(undefined).map((y, j) => +(i === j)));

/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/*! exports provided: isStringArray, isNumberArray, isTRect, isTPresentationRect, isRectMovable, isRectResizable, isMIDIEvent, stringifyError, parseToPrimitive, rgbaMax2Css, css2RgbaMax, decodeBPF, decodeCurve, decodeLine, detectOS, detectBrowserCore, roundedRect, fillRoundedRect, selectElementRange, selectElementPos, findFromAscendants, getPropertyDescriptor, getPropertyDescriptors, extToType, max2js, js2max, convertSampleToUnit, MEASURE_UNIT_REGEX, TIME_UNIT_REGEX, convertUnitToSample */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isStringArray", function() { return isStringArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNumberArray", function() { return isNumberArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isTRect", function() { return isTRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isTPresentationRect", function() { return isTPresentationRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRectMovable", function() { return isRectMovable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRectResizable", function() { return isRectResizable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMIDIEvent", function() { return isMIDIEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringifyError", function() { return stringifyError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseToPrimitive", function() { return parseToPrimitive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgbaMax2Css", function() { return rgbaMax2Css; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "css2RgbaMax", function() { return css2RgbaMax; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeBPF", function() { return decodeBPF; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeCurve", function() { return decodeCurve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeLine", function() { return decodeLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectOS", function() { return detectOS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectBrowserCore", function() { return detectBrowserCore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "roundedRect", function() { return roundedRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillRoundedRect", function() { return fillRoundedRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectElementRange", function() { return selectElementRange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectElementPos", function() { return selectElementPos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findFromAscendants", function() { return findFromAscendants; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPropertyDescriptor", function() { return getPropertyDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPropertyDescriptors", function() { return getPropertyDescriptors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extToType", function() { return extToType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "max2js", function() { return max2js; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "js2max", function() { return js2max; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertSampleToUnit", function() { return convertSampleToUnit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MEASURE_UNIT_REGEX", function() { return MEASURE_UNIT_REGEX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIME_UNIT_REGEX", function() { return TIME_UNIT_REGEX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convertUnitToSample", function() { return convertUnitToSample; });
/* eslint-disable arrow-body-style */
const isStringArray = x => Array.isArray(x) && x.every(e => typeof e === "string");
const isNumberArray = x => Array.isArray(x) && x.every(e => typeof e === "number");
const isTRect = x => {
  return isNumberArray(x) && x.length === 4 && x[0] >= 0 && x[1] >= 0 && x[2] >= 15 && x[3] >= 15;
};
const isTPresentationRect = x => {
  return Array.isArray(x) && x.length === 4 && x.every(v => typeof v === "number" || typeof v === "string");
};
const isRectMovable = x => {
  return isTPresentationRect(x) && typeof x[0] === "number" && typeof x[1] === "number";
};
const isRectResizable = x => isTRect(x);
const isMIDIEvent = x => (isNumberArray(x) || x instanceof Uint8Array) && x.length === 3;
const stringifyError = data => {
  if (typeof data === "string") return data;
  if (data instanceof Error) return data.message;
  if (typeof data === "object") return JSON.stringify(data);
  return "".concat(data);
};
const parseToPrimitive = value => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value.toString();
  }
};
const rgbaMax2Css = maxColor => {
  const cssColor = [255, 255, 255, 1];

  if (Array.isArray(maxColor)) {
    for (let i = 0; i < 3; i++) {
      if (typeof maxColor[i] === "number") cssColor[i] = Math.floor(maxColor[i] * 255);
    }

    if (typeof maxColor[3] === "number") cssColor[3] = maxColor[3];
  }

  return "rgba(".concat(cssColor.join(","), ")");
};
const css2RgbaMax = color => {
  const maxColor = [0.2, 0.2, 0.2, 1];
  const matched = color.match(/rgba\((.+)\)/);
  if (!matched) return maxColor;
  const cssColor = matched[1].split(",").map(s => +s);

  for (let i = 0; i < 3; i++) {
    if (typeof cssColor[i] === "number") maxColor[i] = cssColor[i] / 255;
    if (typeof cssColor[3] === "number") maxColor[3] = cssColor[3];
  }

  return maxColor;
};
/**
 * A BPF can be described as a succesion of three number tuples.
 * i.e. `1 1 0.5 2 1 1` curve mode means go to 0 immediately then go to 1 in 1s with a curve of e^0.5, then go to 2 in 1s linear.
 * The function transform the string to number[][], i.e. `[[1, 1, 0.5], [2, 1, 1]]`
 *
 * @param {TBPF} sIn
 * @returns {number[][]}
 */

const decodeBPF = (sIn, tupleLength) => {
  if (typeof sIn === "number") return [[sIn]];
  if (isNumberArray(sIn)) return [sIn];
  if (Array.isArray(sIn) && sIn.every(a => isNumberArray(a))) return sIn;
  if (typeof sIn !== "string") throw new Error("Failed to decode curve.");
  const numbers = sIn.split(" ").filter(s => !!s).map(s => +s);
  if (numbers.find(v => !isFinite(v))) throw new Error("BPF contains invalid number.");
  const tuples = [];

  for (let i = 0; i < numbers.length; i++) {
    const $tuple = ~~(i / tupleLength);
    const $ = i % tupleLength;
    if (!tuples[$tuple]) tuples[$tuple] = [];
    tuples[$tuple][$] = numbers[i];
  }

  return tuples;
};
const decodeCurve = sIn => decodeBPF(sIn, 3);
const decodeLine = sIn => decodeBPF(sIn, 2);
/**
 * Gives OS name as follows:
 * "Windows"    for all versions of Windows,
 * "MacOS"      for all versions of Macintosh OS,
 * "Linux"      for all versions of Linux,
 * "UNIX"       for all other UNIX flavors,
 * "Unknown" indicates failure to detect the OS
 *
 * @returns {"Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown"} OS name
 */

const detectOS = () => {
  const {
    appVersion
  } = navigator;
  if (appVersion.indexOf("Win") !== -1) return "Windows";
  if (appVersion.indexOf("Mac") !== -1) return "MacOS";
  if (appVersion.indexOf("X11") !== -1) return "UNIX";
  if (appVersion.indexOf("Linux") !== -1) return "Linux";
  return "Unknown";
};
const detectBrowserCore = () => {
  if (window.chrome) return "Chromium";
  if (window.InstallTrigger) return "Gecko";
  return "Unknown";
};
const roundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number") radii.fill(radius);else radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.stroke();
};
const fillRoundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number") radii.fill(radius);else radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.fill();
};
const selectElementRange = e => {
  const elementIsEditable = e => !!e.nodeName.match(/^(INPUT|TEXTAREA)$/i);

  const selection = window.getSelection();

  if (elementIsEditable(e)) {
    e.focus();
    e.select();
    return;
  }

  if (selection.setBaseAndExtent) {
    // Safari
    selection.setBaseAndExtent(e, 0, e, e.hasChildNodes() ? 1 : 0);
    return;
  }

  if (selection.addRange && selection.removeAllRanges && document.createRange) {
    // Mozilla or Opera 10.5+
    const range = document.createRange();
    range.selectNodeContents(e);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
const selectElementPos = (e, pos) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(e.childNodes[0], pos);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};
const findFromAscendants = (e, predict) => {
  const ascendants = [];
  let parent = e.parentElement;

  while (parent !== document.body) {
    ascendants.push(parent);
    parent = parent.parentElement;
  }

  return ascendants.find(predict);
}; // eslint-disable-next-line arrow-body-style

const getPropertyDescriptor = (obj, key) => {
  return Object.getOwnPropertyDescriptor(obj, key) || getPropertyDescriptor(Object.getPrototypeOf(obj), key);
};
const getPropertyDescriptors = obj => {
  if (typeof obj === "function") return Object.getOwnPropertyDescriptors(obj);
  const proto = Object.getPrototypeOf(obj);
  if (obj !== Object.prototype && proto === Object.prototype) return Object.getOwnPropertyDescriptors(obj);
  return Object.assign(proto ? getPropertyDescriptors(proto) : {}, Object.getOwnPropertyDescriptors(obj));
};
const extToType = ext => {
  if (["jspat", "maxpat", "gendsp", "dsppat"].indexOf(ext) !== -1) return "patcher";
  if (["wav", "aif", "aiff", "mp3", "aac", "flac", "ogg"].indexOf(ext) !== -1) return "audio";
  if (["text", "json"].indexOf(ext) !== -1) return "text";
  return "unknown";
};
const max2js = patcherIn => {
  const patcher = {
    boxes: {},
    lines: {}
  };
  const maxPatcher = patcherIn.patcher;
  patcher.props = {
    bgColor: rgbaMax2Css(maxPatcher.bgcolor),
    editingBgColor: rgbaMax2Css(maxPatcher.editing_bgcolor),
    dependencies: [],
    grid: maxPatcher.gridsize,
    openInPresentation: !!maxPatcher.openinpresentation
  };
  const maxBoxes = maxPatcher.boxes;
  const maxLines = maxPatcher.lines;

  for (let i = 0; i < maxBoxes.length; i++) {
    const maxBox = maxBoxes[i].box;
    const numID = parseInt(maxBox.id.match(/\d+/)[0]);
    const id = "box-" + numID;
    patcher.boxes[id] = {
      id,
      inlets: maxBox.numinlets,
      outlets: maxBox.numoutlets,
      rect: maxBox.patching_rect,
      presentationRect: maxBox.presentation_rect,
      background: !!maxBox.background,
      presentation: !!maxBox.presentation,
      text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
    };
  }

  for (let i = 0; i < maxLines.length; i++) {
    const lineArgs = maxLines[i].patchline;
    const id = "line-" + i;
    patcher.lines[id] = {
      id,
      src: [lineArgs.source[0].replace(/obj/, "box"), lineArgs.source[1]],
      dest: [lineArgs.destination[0].replace(/obj/, "box"), lineArgs.destination[1]]
    };
  }

  return patcher;
};
const js2max = patcherIn => {
  const maxPatcher = {
    boxes: [],
    lines: [],
    rect: undefined,
    bgcolor: css2RgbaMax(patcherIn.props.bgColor),
    editing_bgcolor: css2RgbaMax(patcherIn.props.editingBgColor),
    gridsize: patcherIn.props.grid,
    openinpresentation: +patcherIn.props.openInPresentation
  };

  for (const id in patcherIn.boxes) {
    const box = patcherIn.boxes[id];
    const numID = parseInt(id.match(/\d+/)[0]);
    maxPatcher.boxes.push({
      box: {
        id: "obj-".concat(numID),
        maxclass: "newobj",
        numinlets: box.inlets,
        numoutlets: box.outlets,
        patching_rect: box.rect,
        presentation: +box.presentation,
        background: +box.background,
        text: box.text
      }
    });
  }

  for (const id in patcherIn.lines) {
    const line = patcherIn.lines[id];
    maxPatcher.lines.push({
      patchline: {
        source: [line.src[0].replace(/box/, "obj"), line.src[1]],
        destination: [line.dest[0].replace(/box/, "obj"), line.dest[1]]
      }
    });
  }

  return {
    patcher: maxPatcher
  };
};
const convertSampleToUnit = (sample, unit, _ref) => {
  let {
    sampleRate = 48000,
    bpm = 60,
    beatsPerMeasure = 4,
    division = 16
  } = _ref;
  if (unit === "sample") return {
    unit,
    str: sample.toString(),
    value: sample,
    values: [sample]
  };
  const milliseconds = sample * 1000 / sampleRate;
  const roundedMs = Math.round(milliseconds);

  if (unit === "measure") {
    const dpms = bpm * division / 60000;
    const totalDivisions = dpms * milliseconds;
    const roundedTotalDivisions = dpms * milliseconds;
    const divisions = ~~(roundedTotalDivisions % division);
    const beats = ~~(roundedTotalDivisions / division) % beatsPerMeasure + 1;
    const measure = ~~(roundedTotalDivisions / beatsPerMeasure / division) + 1;
    const str = "".concat(measure, ":").concat(beats, ".").concat(divisions.toString().padStart(2, "0"));
    return {
      unit,
      str,
      value: totalDivisions / division,
      values: [measure, beats, divisions]
    };
  } // if (unit === "time")


  const ms = roundedMs % 1000;
  const s = ~~(roundedMs / 1000) % 60;
  const min = ~~(roundedMs / 60000) % 60;
  const h = ~~(roundedMs / 3600000);
  const str = !min ? "".concat(s, ".").concat(ms.toString().padStart(3, "0")) : !h ? "".concat(min, ":").concat(s.toString().padStart(2, "0"), ".").concat(ms.toString().padStart(3, "0")) : "".concat(h, ":").concat(min.toString().padStart(2, "0"), ":").concat(s.toString().padStart(2, "0"), ".").concat(ms.toString().padStart(3, "0"));
  return {
    unit,
    str,
    value: milliseconds / 1000,
    values: [h, min, s, ms]
  };
};
const MEASURE_UNIT_REGEX = /^((\d+):)?(\d+)\.?(\d+)?$/;
const TIME_UNIT_REGEX = /^((\d+):)??((\d+):)?(\d+)\.?(\d+)?$/;
const convertUnitToSample = (str, unit, _ref2) => {
  let {
    sampleRate = 48000,
    bpm = 60,
    beatsPerMeasure = 4,
    division = 16
  } = _ref2;
  if (unit === "sample") return +str || 0;

  if (unit === "measure") {
    const matched = str.match(MEASURE_UNIT_REGEX);
    if (!matched) throw new Error("String ".concat(str, " cannot be parsed to ").concat(unit));
    const [,, measureIn, beatsIn, divisionsIn] = matched;
    const bps = bpm / 60;
    const samplesPerBeat = sampleRate / bps;
    let measures = +measureIn || 0;
    let beats = +beatsIn || 0;
    let divisions = +divisionsIn || 0;
    beats += ~~(divisions / division);
    divisions %= division;
    measures += ~~(beats / beatsPerMeasure);
    beats %= beatsPerMeasure;
    return (measures * beatsPerMeasure + beats + divisions / division) * samplesPerBeat;
  }

  const matched = str.match(TIME_UNIT_REGEX);
  if (!matched) throw new Error("String ".concat(str, " cannot be parsed to ").concat(unit));
  const [,, hIn,, minIn, sIn, msIn] = matched;
  let h = +hIn || 0;
  let min = +minIn || 0;
  let s = +sIn || 0;
  let ms = +msIn || 0;
  s += ~~(ms / 1000);
  ms %= 1000;
  min += ~~(s / 60);
  s %= 60;
  h += ~~(min / 60);
  min %= 60;
  return (h * 3600 + min * 60 + s + ms / 1000) * sampleRate;
};

/***/ }),

/***/ "./src/utils/yin.ts":
/*!**************************!*\
  !*** ./src/utils/yin.ts ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const detect = (bufferIn, paramsIn) => {
  const {
    threshold = 0.1,
    sampleRate = 48000,
    probabilityThreshold = 0.1
  } = paramsIn;
  let bufferSize = 1;

  while (bufferSize < bufferIn.length) {
    bufferSize *= 2;
  }

  bufferSize /= 2;
  const yinBufferSize = bufferSize / 2;
  const yinBuffer = new Float32Array(yinBufferSize);
  let prob = 0;
  let tau;
  let delta;

  for (let t = 1; t < yinBufferSize; t++) {
    for (let i = 0; i < yinBufferSize; i++) {
      delta = bufferIn[i] - bufferIn[i + t];
      yinBuffer[t] += delta * delta;
    }
  }

  yinBuffer[0] = 1;
  yinBuffer[1] = 1;
  let runningSum = 0;

  for (let t = 1; t < yinBufferSize; t++) {
    runningSum += yinBuffer[t];
    yinBuffer[t] *= t / runningSum;
  }

  for (tau = 2; tau < yinBufferSize; tau++) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < yinBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }

      prob = 1 - yinBuffer[tau];
      break;
    }
  }

  if (tau === yinBufferSize || yinBuffer[tau] >= threshold) {
    return null;
  }

  if (prob < probabilityThreshold) {
    return null;
  }

  let betterTau;
  let x0;
  let x2;

  if (tau < 1) {
    x0 = tau;
  } else {
    x0 = tau - 1;
  }

  if (tau + 1 < yinBufferSize) {
    x2 = tau + 1;
  } else {
    x2 = tau;
  }

  if (x0 === tau) {
    if (yinBuffer[tau] <= yinBuffer[x2]) {
      betterTau = tau;
    } else {
      betterTau = x2;
    }
  } else if (x2 === tau) {
    if (yinBuffer[tau] <= yinBuffer[x0]) {
      betterTau = tau;
    } else {
      betterTau = x0;
    }
  } else {
    const s0 = yinBuffer[x0];
    const s1 = yinBuffer[tau];
    const s2 = yinBuffer[x2];
    betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
  }

  return sampleRate / betterTau;
};

/* harmony default export */ __webpack_exports__["default"] = (detect);

/***/ })

/******/ });
//# sourceMappingURL=4c175cbf4e21647c8877.worklet.js.map