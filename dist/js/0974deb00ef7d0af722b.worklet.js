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

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.worklet.ts":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./src/core/objects/dsp/AudioWorklet/TemporalAnalyser.worklet.ts ***!
  \*******************************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/buffer */ "./src/utils/buffer.ts");


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }


var processorID = "__JSPatcher_TemporalAnalyser";

class TemporalAnalyserProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      defaultValue: 1024,
      maxValue: Math.pow(2, 32),
      minValue: 128,
      name: "windowSize"
    }];
  }

  constructor(options) {
    super(options);
    this.destroyed = false;
    this.window = [];
    this.$ = 0;
    this.$total = 0;

    this.port.onmessage = e => {
      var id = e.data.id;
      if (e.data.destroy) this.destroy();
      var message = {};
      if (e.data.rms) message.rms = this.rms;
      if (e.data.zcr) message.zcr = this.zcr;
      if (e.data.buffer) message.buffer = this.buffer;
      this.port.postMessage(_objectSpread({
        id
      }, message));
    };
  }

  get rms() {
    return this.window.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_1__["rms"]);
  }

  get zcr() {
    return this.window.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_1__["zcr"]);
  }

  get buffer() {
    var data = this.window;
    return {
      data,
      startPointer: this.$,
      sampleIndex: data.length ? this.$total - data[0].length : 0
    };
  }

  process(inputs, outputs, parameters) {
    if (this.destroyed) return false;
    var input = inputs[0];
    var windowSize = ~~parameters.windowSize[0] || 1024;
    this.$ %= windowSize;
    if (this.window.length > input.length) this.window.splice(input.length);
    if (input.length === 0) return true;
    var bufferSize = input[0].length || 128;
    this.$total += bufferSize;

    for (var i = 0; i < input.length; i++) {
      var channel = input[i];
      if (!channel.length) channel = new Float32Array(bufferSize);

      if (!this.window[i]) {
        this.window[i] = new Float32Array(windowSize);
      } else if (this.window[i].length !== windowSize) {
        var oldWindow = this.window[i];
        var oldWindowSize = oldWindow.length;

        var _window = new Float32Array(windowSize);

        if (oldWindowSize > windowSize) {
          _window.set(oldWindow.subarray(oldWindowSize - windowSize));

          this.$ = 0;
        } else {
          _window.set(oldWindow);
        }

        this.window[i] = _window;
      }

      var window = this.window[i];
      var $ = this.$;

      if (bufferSize > windowSize) {
        window.set(channel.subarray(bufferSize - windowSize));
        $ = 0;
      } else {
        Object(_utils_buffer__WEBPACK_IMPORTED_MODULE_1__["setBuffer"])(window, channel, $);
        $ = ($ + bufferSize) % windowSize;
      }

      if (i === input.length - 1) this.$ = $;
    }

    return true;
  }

  destroy() {
    this.destroyed = true;
    this.port.close();
    this.window = [];
  }

}

registerProcessor(processorID, TemporalAnalyserProcessor);

/***/ }),

/***/ "./src/utils/buffer.ts":
/*!*****************************!*\
  !*** ./src/utils/buffer.ts ***!
  \*****************************/
/*! exports provided: sum, mean, median, maxIndex, energy, rms, zcr, centroid, conjugatedCentroid, geometricMean, flatness, flux, kurtosis, skewness, rolloff, slope, spread, setBuffer, getSubBuffer, sliceBuffer, fftw2Amp, estimateFreq, indexToFreq */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setBuffer", function() { return setBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSubBuffer", function() { return getSubBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sliceBuffer", function() { return sliceBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fftw2Amp", function() { return fftw2Amp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "estimateFreq", function() { return estimateFreq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "indexToFreq", function() { return indexToFreq; });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./src/utils/math.ts");

var sum = array => {
  var sum = 0;

  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }

  return sum;
};
var mean = array => sum(array) / array.length;
var median = array => {
  var length = array.length;
  if (length === 0) throw new Error("trying to calculate median of empty array");
  var sortedArray = array.slice().sort();
  if (length % 2 === 0) return (sortedArray[length / 2 - 1] + sortedArray[length / 2]) / 2;
  return sortedArray[~~(length / 2)];
};
var maxIndex = array => {
  if (!array.length) return 0;
  var index = 0;
  var max = array[0];
  var i = array.length;

  while (i-- > 1) {
    var cur = array[i];
    if (cur <= max) continue;
    max = cur;
    index = i;
  }

  return index;
};
var energy = signal => {
  var sum = 0;
  var sample = 0;

  for (var i = 0; i < signal.length; i++) {
    sample = signal[i];
    sum += sample * sample;
  }

  return sum;
};
var rms = signal => Math.sqrt(energy(signal) / signal.length);
var zcr = signal => {
  var zcr = 0;
  var lastPositive = true;
  var positive = true;

  for (var i = 0; i < signal.length; i++) {
    positive = signal[i] >= 0;
    if (positive !== lastPositive) zcr++;
    lastPositive = positive;
  }

  return zcr;
};
var centroid = array => {
  var weightedSum = 0;
  var weight = 0;

  for (var i = 0; i < array.length; i++) {
    weightedSum += i * Math.abs(array[i]);
    weight += array[i];
  }

  return weight === 0 ? 0 : weightedSum / weight;
};
var conjugatedCentroid = (array, factor) => {
  var weightedSum = 0;
  var weight = 0;

  for (var i = 0; i < array.length; i++) {
    weightedSum += Math.pow(i, factor) * Math.abs(array[i]);
    weight += array[i];
  }

  return weight === 0 ? 0 : weightedSum / weight;
};
var geometricMean = array => {
  var length = array.length;
  var sum = 0;
  var sample = 0;

  for (var i = 0; i < length; i++) {
    sample = array[i];
    if (sample <= 0) return 0;
    sum += Math.log(array[i]);
  }

  return Math.exp(sum / length);
};
var flatness = array => geometricMean(array) / mean(array);
/**
 * https://essentia.upf.edu/reference/std_Flux.html
 *
 * @param {TypedArray} cur
 * @param {TypedArray} prev
 * @param {("L1" | "L2")} [norm]
 * @param {boolean} [halfRectify]
 * @returns
 */

var flux = (cur, prev, norm, halfRectify) => {
  var flux = 0;

  if (norm === "L2") {
    if (halfRectify === true) {
      // L2 + halfRectify
      for (var i = 0; i < cur.length; i++) {
        var diff = cur[i] - prev[i];
        if (diff < 0) continue;
        flux += diff * diff;
      }

      return Math.sqrt(flux);
    }

    for (var _i = 0; _i < cur.length; _i++) {
      // L2 not halfRectify
      var _diff = cur[_i] - prev[_i];

      flux += _diff * _diff;
    }

    return Math.sqrt(flux);
  }

  if (halfRectify === true) {
    // L1 + halfRectify
    for (var _i2 = 0; _i2 < cur.length; _i2++) {
      var _diff2 = cur[_i2] - prev[_i2];

      if (_diff2 < 0) continue;
      flux += _diff2;
    }

    return flux;
  }

  for (var _i3 = 0; _i3 < cur.length; _i3++) {
    // L1 not halfRectify
    var _diff3 = cur[_i3] - prev[_i3];

    flux += Math.abs(_diff3);
  }

  return flux;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralKurtosis.js
 *
 * @param {TypedArray} array
 */

var kurtosis = array => {
  var c1 = centroid(array);
  var c2 = conjugatedCentroid(array, 2);
  var c3 = conjugatedCentroid(array, 3);
  var c4 = conjugatedCentroid(array, 4);
  var numerator = -3 * Math.pow(c1, 4) + 6 * c1 * c2 - 4 * c1 * c3 + c4;
  var denominator = Math.pow(c2 - Math.pow(c1, 2), 2);
  return numerator / denominator;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralSkewness.js
 *
 * @param {TypedArray} array
 */

var skewness = array => {
  var c1 = centroid(array);
  var c2 = conjugatedCentroid(array, 2);
  var c3 = conjugatedCentroid(array, 3);
  var numerator = 2 * Math.pow(c1, 3) - 3 * c1 * c2 + c3;
  var denominator = Math.pow(c2 - Math.pow(c1, 2), 1.5);
  return numerator / denominator;
};
/**
 * https://essentia.upf.edu/reference/std_RollOff.html
 *
 * @param {TypedArray} array
 * @param {number} [cutoff] Between 0 - 1
 * @returns
 */

var rolloff = (array, cutoff) => {
  var length = array.length;
  var e = energy(array);
  var threshold = (cutoff || 0.99) * e;
  var n = length - 1;

  while (e > threshold && n >= 0) {
    var element = array[n];
    e -= element * element;
    --n;
  }

  return n + 1;
};
var slope = array => {
  var n = array.length;
  var xSum = n * n / 2;
  var x2Sum = (n - 1) * n * (2 * n - 1) / 6;
  var ySum = 0;
  var xySum = 0;

  for (var x = 0; x < n; x++) {
    var y = array[x];
    ySum += y;
    xySum += x * y;
  }

  return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
};
var spread = array => Math.sqrt(conjugatedCentroid(array, 2)) - Math.pow(centroid(array), 2); // eslint-disable-next-line arrow-parens

var setBuffer = (to, from, offsetTo, offsetFrom) => {
  var toLength = to.length;
  var fromLength = from.length;
  var spillLength = Math.min(toLength, fromLength);
  var spilled = 0;
  var $to = Object(_math__WEBPACK_IMPORTED_MODULE_0__["mod"])(offsetTo, toLength) || 0;
  var $from = Object(_math__WEBPACK_IMPORTED_MODULE_0__["mod"])(offsetFrom, fromLength) || 0;

  while (spilled < spillLength) {
    var $spillLength = Math.min(spillLength - spilled, toLength - $to, fromLength - $from);
    var $fromEnd = $from + $spillLength;
    if ($from === 0 && $fromEnd === fromLength) to.set(from, $to);else to.set(from.subarray($from, $fromEnd), $to);
    $to = ($to + $spillLength) % toLength;
    $from = $fromEnd % fromLength;
    spilled += $spillLength;
  }

  return to;
}; // eslint-disable-next-line arrow-parens

var getSubBuffer = (from, length, offset) => {
  var fromLength = from.length;
  var $ = Object(_math__WEBPACK_IMPORTED_MODULE_0__["mod"])(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength) return from;
  if ($ + length < fromLength) return from.subarray($, $ + length);
  var to = new from.constructor(length);
  return setBuffer(to, from, 0, $);
}; // eslint-disable-next-line arrow-parens

var sliceBuffer = (from, length, offset) => {
  var fromLength = from.length;
  var $ = Object(_math__WEBPACK_IMPORTED_MODULE_0__["mod"])(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength) return from.slice();
  if ($ + length < fromLength) return from.slice($, $ + length);
  var to = new from.constructor(length);
  return setBuffer(to, from, 0, $);
};
/**
 * http://www.fftw.org/fftw3_doc/The-Halfcomplex_002dformat-DFT.html
 *
 * @param {Float32Array} from
 */

var fftw2Amp = (from, windowEnergyFactor) => {
  var length = from.length;
  var amps = new Float32Array(length / 2);

  for (var i = 0; i < length / 2; i++) {
    var real = from[i];
    var imag = i === 0 || i === length / 2 - 1 ? 0 : from[length - i];
    amps[i] = Math.pow(real * real + imag * imag, 0.5) / length * windowEnergyFactor;
  }

  return amps;
};
var estimateFreq = (amps, sampleRate) => indexToFreq(maxIndex(amps), amps.length, sampleRate);
var indexToFreq = (i, fftBins, sampleRate) => i % fftBins / fftBins * sampleRate / 2;

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
var mod = (x, y) => (x % y + y) % y;
/**
 * Round a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */

var round = (x, to) => Math.round(x / to) * to;
/**
 * Floor a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */

var floor = (x, to) => Math.floor(x / to) * to;
/**
 * Ceil a number to multiple of another
 *
 * @param {number} x
 * @param {number} to
 * @returns
 */

var ceil = (x, to) => Math.ceil(x / to) * to;
var toRad = degrees => degrees * Math.PI / 180;
var toMIDI = f => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
var atodb = a => 20 * Math.log10(a);
var dbtoa = db => Math.pow(10, db / 20);
var iNormExp = (x, e) => Math.pow(Math.max(0, x), Math.pow(1.5, -e));
var normExp = (x, e) => Math.pow(Math.max(0, x), Math.pow(1.5, e));

/***/ })

/******/ });
//# sourceMappingURL=0974deb00ef7d0af722b.worklet.js.map