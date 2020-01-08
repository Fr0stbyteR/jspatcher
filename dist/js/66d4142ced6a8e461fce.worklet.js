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
// import { RFFT } from "fftw-js";

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

    this.port.onmessage = e => {
      var id = e.data.id;
      if (e.data.destroy) this.destroy();
      if (e.data.rms) this.port.postMessage({
        id,
        rms: this.rms
      });
      if (e.data.zcr) this.port.postMessage({
        id,
        zcr: this.zcr
      });
      if (e.data.buffer) this.port.postMessage({
        id,
        buffer: this.buffer
      });
    };
  }

  get rms() {
    return this.window.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["rms"]);
  }

  get zcr() {
    return this.window.map(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["zcr"]);
  }

  get buffer() {
    return {
      startPointer: this.$,
      data: this.window
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
        Object(_utils_buffer__WEBPACK_IMPORTED_MODULE_0__["setBuffer"])(window, channel, $);
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
/*! exports provided: energy, rms, zcr, setBuffer, getSubBuffer, fftw2Amp, estimateFreq, indexToFreq */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "energy", function() { return energy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rms", function() { return rms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zcr", function() { return zcr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setBuffer", function() { return setBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSubBuffer", function() { return getSubBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fftw2Amp", function() { return fftw2Amp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "estimateFreq", function() { return estimateFreq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "indexToFreq", function() { return indexToFreq; });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./src/utils/math.ts");

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
// eslint-disable-next-line arrow-parens
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
    if ($from === 0 && $fromEnd === fromLength) to.set(from, $to);
    to.set(from.subarray($from, $fromEnd), $to);
    $to %= $to + $spillLength;
    $from %= $fromEnd;
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
var estimateFreq = (amps, sampleRate) => {
  var index = 0;
  var max = 0;
  var i = amps.length;

  while (i-- > 1) {
    var cur = amps[i];
    if (cur <= max) continue;
    max = cur;
    index = i;
  }

  return indexToFreq(index, amps.length, sampleRate);
};
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
//# sourceMappingURL=66d4142ced6a8e461fce.worklet.js.map