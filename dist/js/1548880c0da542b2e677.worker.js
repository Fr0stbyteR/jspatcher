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
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/babel-loader/lib/index.js!./src/core/workers/WavEncoder.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js!./src/core/workers/WavEncoder.worker.ts":
/*!*******************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./src/core/workers/WavEncoder.worker.ts ***!
  \*******************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_WavEncoder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/WavEncoder */ "./src/utils/WavEncoder.ts");
/* harmony import */ var _ProxyWorker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProxyWorker */ "./src/core/workers/ProxyWorker.ts");
/* eslint-disable no-new */



class WavEncoderWorker extends _ProxyWorker__WEBPACK_IMPORTED_MODULE_1__["default"] {
  encode(audioBuffer, options) {
    return _utils_WavEncoder__WEBPACK_IMPORTED_MODULE_0__["default"].encode(audioBuffer, options);
  }

}

new WavEncoderWorker();

/***/ }),

/***/ "./src/core/workers/ProxyWorker.ts":
/*!*****************************************!*\
  !*** ./src/core/workers/ProxyWorker.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const Worker = class {
  static get fnNames() {
    return [];
  }

  constructor() {
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

        postMessage(r);
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
        postMessage({
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
    addEventListener("message", handleMessage);
  }

};
/* harmony default export */ __webpack_exports__["default"] = (Worker);

/***/ }),

/***/ "./src/utils/WavEncoder.ts":
/*!*********************************!*\
  !*** ./src/utils/WavEncoder.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WavEncoder; });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WavEncoder {
  static encode(audioBuffer, options) {
    const numberOfChannels = audioBuffer.length;
    const length = audioBuffer[0].length;
    const {
      shared,
      float
    } = options;
    const bitDepth = float ? 32 : options.bitDepth | 0 || 16;
    const byteDepth = bitDepth >> 3;
    const byteLength = length * numberOfChannels * byteDepth; // eslint-disable-next-line no-undef

    const AB = shared ? globalThis.SharedArrayBuffer || globalThis.ArrayBuffer : globalThis.ArrayBuffer;
    const ab = new AB((44 + byteLength) * Uint8Array.BYTES_PER_ELEMENT);
    const dataView = new DataView(ab);
    const writer = new Writer(dataView);
    const format = {
      formatId: float ? 0x0003 : 0x0001,
      float,
      numberOfChannels,
      sampleRate: options.sampleRate,
      symmetric: !!options.symmetric,
      length,
      bitDepth,
      byteDepth
    };
    this.writeHeader(writer, format);
    this.writeData(writer, audioBuffer, format);
    return ab;
  }

  static writeHeader(writer, format) {
    const {
      formatId,
      sampleRate,
      bitDepth,
      numberOfChannels,
      length,
      byteDepth
    } = format;
    writer.string("RIFF");
    writer.uint32(writer.dataView.byteLength - 8);
    writer.string("WAVE");
    writer.string("fmt ");
    writer.uint32(16);
    writer.uint16(formatId);
    writer.uint16(numberOfChannels);
    writer.uint32(sampleRate);
    writer.uint32(sampleRate * numberOfChannels * byteDepth);
    writer.uint16(numberOfChannels * byteDepth);
    writer.uint16(bitDepth);
    writer.string("data");
    writer.uint32(length * numberOfChannels * byteDepth);
    return writer.pos;
  }

  static writeData(writer, audioBuffer, format) {
    const {
      bitDepth,
      float,
      length,
      numberOfChannels,
      symmetric
    } = format;

    if (bitDepth === 32 && float) {
      const {
        dataView,
        pos
      } = writer;
      const ab = dataView.buffer;
      const f32View = new Float32Array(ab, pos);

      if (numberOfChannels === 1) {
        f32View.set(audioBuffer[0]);
        return;
      }

      for (let ch = 0; ch < numberOfChannels; ch++) {
        const channel = audioBuffer[ch];

        for (let i = 0; i < length; i++) {
          f32View[i * numberOfChannels + ch] = channel[i];
        }
      }

      return;
    }

    const encoderOption = float ? "f" : symmetric ? "s" : "";
    const methodName = "pcm" + bitDepth + encoderOption;

    if (!writer[methodName]) {
      throw new TypeError("Not supported bit depth: " + bitDepth);
    }

    const write = writer[methodName].bind(writer);
    writer.string("data");
    writer.uint32(length);

    for (let i = 0; i < length; i++) {
      for (let j = 0; j < numberOfChannels; j++) {
        write(audioBuffer[j][i]);
      }
    }
  }

}

class Writer {
  constructor(dataView) {
    _defineProperty(this, "pos", 0);

    _defineProperty(this, "dataView", void 0);

    this.dataView = dataView;
  }

  int16(value) {
    this.dataView.setInt16(this.pos, value, true);
    this.pos += 2;
  }

  uint16(value) {
    this.dataView.setUint16(this.pos, value, true);
    this.pos += 2;
  }

  uint32(value) {
    this.dataView.setUint32(this.pos, value, true);
    this.pos += 4;
  }

  string(value) {
    for (let i = 0, imax = value.length; i < imax; i++) {
      this.dataView.setUint8(this.pos++, value.charCodeAt(i));
    }
  }

  pcm8(valueIn) {
    let value = valueIn;
    value = Math.max(-1, Math.min(value, +1));
    value = (value * 0.5 + 0.5) * 255;
    value = Math.round(value) | 0;
    this.dataView.setUint8(this.pos, value
    /* , true*/
    );
    this.pos += 1;
  }

  pcm8s(valueIn) {
    let value = valueIn;
    value = Math.round(value * 128) + 128;
    value = Math.max(0, Math.min(value, 255));
    this.dataView.setUint8(this.pos, value
    /* , true*/
    );
    this.pos += 1;
  }

  pcm16(valueIn) {
    let value = valueIn;
    value = Math.max(-1, Math.min(value, +1));
    value = value < 0 ? value * 32768 : value * 32767;
    value = Math.round(value) | 0;
    this.dataView.setInt16(this.pos, value, true);
    this.pos += 2;
  }

  pcm16s(valueIn) {
    let value = valueIn;
    value = Math.round(value * 32768);
    value = Math.max(-32768, Math.min(value, 32767));
    this.dataView.setInt16(this.pos, value, true);
    this.pos += 2;
  }

  pcm24(valueIn) {
    let value = valueIn;
    value = Math.max(-1, Math.min(value, +1));
    value = value < 0 ? 0x1000000 + value * 8388608 : value * 8388607;
    value = Math.round(value) | 0;
    const x0 = value >> 0 & 0xFF;
    const x1 = value >> 8 & 0xFF;
    const x2 = value >> 16 & 0xFF;
    this.dataView.setUint8(this.pos + 0, x0);
    this.dataView.setUint8(this.pos + 1, x1);
    this.dataView.setUint8(this.pos + 2, x2);
    this.pos += 3;
  }

  pcm24s(valueIn) {
    let value = valueIn;
    value = Math.round(value * 8388608);
    value = Math.max(-8388608, Math.min(value, 8388607));
    const x0 = value >> 0 & 0xFF;
    const x1 = value >> 8 & 0xFF;
    const x2 = value >> 16 & 0xFF;
    this.dataView.setUint8(this.pos + 0, x0);
    this.dataView.setUint8(this.pos + 1, x1);
    this.dataView.setUint8(this.pos + 2, x2);
    this.pos += 3;
  }

  pcm32(valueIn) {
    let value = valueIn;
    value = Math.max(-1, Math.min(value, +1));
    value = value < 0 ? value * 2147483648 : value * 2147483647;
    value = Math.round(value) | 0;
    this.dataView.setInt32(this.pos, value, true);
    this.pos += 4;
  }

  pcm32s(valueIn) {
    let value = valueIn;
    value = Math.round(value * 2147483648);
    value = Math.max(-2147483648, Math.min(value, +2147483647));
    this.dataView.setInt32(this.pos, value, true);
    this.pos += 4;
  }

  pcm32f(value) {
    this.dataView.setFloat32(this.pos, value, true);
    this.pos += 4;
  }

}

/***/ })

/******/ });
//# sourceMappingURL=1548880c0da542b2e677.worker.js.map