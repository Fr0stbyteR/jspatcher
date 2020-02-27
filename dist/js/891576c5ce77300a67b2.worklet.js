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
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/babel-loader/lib/index.js!./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.worklet.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js!./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.worklet.ts":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.worklet.ts ***!
  \*******************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../utils/buffer */ "./src/utils/buffer.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const processorID = "__JSPatcher_TemporalAnalyser";
/**
 * Some data to transfer across threads
 *
 * @class TemporalAnalyserAtoms
 */

class TemporalAnalyserAtoms {
  /**
   * Next audio sample index to write into window
   *
   * @type {number}
   * @memberof TemporalAnalyserAtoms
   */
  get $() {
    return this._$[0];
  }

  set $(value) {
    this._$[0] = value;
  }
  /**
   * Total samples written counter
   *
   * @type {number}
   * @memberof TemporalAnalyserAtoms
   */


  get $total() {
    return this._$total[0];
  }

  set $total(value) {
    this._$total[0] = value;
  }
  /**
   * Get all atoms
   *
   * @readonly
   * @memberof TemporalAnalyserAtoms
   */


  get atoms() {
    return {
      $: this._$,
      $total: this._$total
    };
  }

  constructor(sab) {
    this._sab = void 0;
    this._$ = void 0;
    this._$total = void 0;
    this._sab = sab;
    this._$ = new Uint32Array(this._sab, 0, 1);
    this._$total = new Uint32Array(this._sab, 4, 1);
  }

}

class TemporalAnalyserProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      defaultValue: 1024,
      maxValue: 2 ** 32,
      minValue: 128,
      name: "windowSize"
    }];
  }

  /**
   * Shared Data
   *
   * @memberof TemporalAnalyserProcessor
   */
  get atoms() {
    return this._atoms.atoms;
  }
  /**
   * Next audio sample index to write into window
   *
   * @memberof TemporalAnalyserProcessor
   */


  get $() {
    return this._atoms.$;
  }

  set $(value) {
    this._atoms.$ = value;
  }
  /**
   * Total samples written counter
   *
   * @memberof TemporalAnalyserProcessor
   */


  get $total() {
    return this._atoms.$total;
  }

  set $total(value) {
    this._atoms.$total = value;
  }

  constructor(options) {
    super(options);
    this.destroyed = false;
    this.window = [];
    this.windowF32 = [];
    this._atoms = void 0;
    this._windowSize = 1024;
    this._atoms = new TemporalAnalyserAtoms(options.processorOptions);

    this.port.onmessage = e => {
      const {
        id
      } = e.data;
      if (e.data.destroy) this.destroy();
      const message = {};
      if (e.data.rms) message.rms = this.rms;
      if (e.data.zcr) message.zcr = this.zcr;
      if (e.data.buffer) message.buffer = this.buffer;
      this.port.postMessage(_objectSpread({
        id
      }, message));
    };
  }

  get rms() {
    return this.windowF32.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["rms"]);
  }

  get zcr() {
    return this.windowF32.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["zcr"]);
  }

  get buffer() {
    const data = this.windowF32;
    const {
      $,
      $total
    } = this.atoms;
    return {
      data,
      $,
      $total
    };
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
    this.$ %= windowSize;

    if (this.window.length > input.length) {
      // Too much channels ?
      this.window.splice(input.length);
      this.windowF32.splice(input.length);
    }

    if (input.length === 0) return true;
    const bufferSize = Math.max(...input.map(c => c.length)) || 128;
    this.$total += bufferSize;
    let {
      $
    } = this; // Init windows

    for (let i = 0; i < input.length; i++) {
      $ = this.$;

      if (!this.window[i]) {
        // Initialise channel if not exist
        this.window[i] = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
        this.windowF32[i] = new Float32Array(this.window[i]);
      } else {
        if (this.windowF32[i].length !== windowSize) {
          // adjust window size if not corresponded
          const oldWindow = this.window[i];
          const oldWindowSize = oldWindow.length;
          const window = new SharedArrayBuffer(windowSize * Float32Array.BYTES_PER_ELEMENT);
          $ = Object(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["setTypedArray"])(new Float32Array(window), new Float32Array(oldWindow), 0, $ - Math.min(windowSize, oldWindowSize));
          this.window[i] = window;
          this.windowF32[i] = new Float32Array(window);
        }
      }
    }

    this.$ = $; // Write

    for (let i = 0; i < input.length; i++) {
      const window = this.windowF32[i];
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
    return true;
  }

  destroy() {
    this.destroyed = true;
    this.port.close();
  }

}

registerProcessor(processorID, TemporalAnalyserProcessor);

/***/ }),

/***/ "./src/utils/buffer.ts":
/*!*****************************!*\
  !*** ./src/utils/buffer.ts ***!
  \*****************************/
/*! exports provided: sum, mean, median, maxIndex, energy, rms, zcr, centroid, conjugatedCentroid, geometricMean, flatness, flux, kurtosis, skewness, rolloff, slope, spread, setTypedArray, getSubTypedArray, sliceBuffer, fftw2Amp, estimateFreq, indexToFreq */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sum", function() { return sum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mean", function() { return mean; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "median", function() { return median; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxIndex", function() { return maxIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "energy", function() { return energy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rms", function() { return rms; });
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
/*! exports provided: mod, round, floor, ceil, toRad, toMIDI, atodb, dbtoa, iNormExp, normExp */
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
/**
 * Mod support wrapping with negative numbers
 *
 * @param {number} x
 * @param {number} y
 */
const mod = (x, y) => (x % y + y) % y;
/**
 * Round a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */

const round = (x, to) => Math.round(x / to) * to;
/**
 * Floor a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */

const floor = (x, to) => Math.floor(x / to) * to;
/**
 * Ceil a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */

const ceil = (x, to) => Math.ceil(x / to) * to;
const toRad = degrees => degrees * Math.PI / 180;
const toMIDI = f => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
const atodb = a => 20 * Math.log10(a);
const dbtoa = db => 10 ** (db / 20);
const iNormExp = (x, e) => Math.max(0, x) ** 1.5 ** -e;
const normExp = (x, e) => Math.max(0, x) ** 1.5 ** e;

/***/ })

/******/ });
//# sourceMappingURL=891576c5ce77300a67b2.worklet.js.map