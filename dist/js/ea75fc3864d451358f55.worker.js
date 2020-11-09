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
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/babel-loader/lib/index.js!./src/core/workers/Waveform.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js!./src/core/workers/Waveform.worker.ts":
/*!*****************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./src/core/workers/Waveform.worker.ts ***!
  \*****************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ProxyWorker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProxyWorker */ "./src/core/workers/ProxyWorker.ts");
/* eslint-disable no-new */
 // eslint-disable-next-line no-undef

const SAB = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;

class Waveform extends _ProxyWorker__WEBPACK_IMPORTED_MODULE_0__["default"] {
  generate(buffer) {
    let stepsFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
    const waveformData = {};
    if (buffer.length === 0) return waveformData;
    const l = buffer[0].length;

    for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
      const stepData = [];
      waveformData[stepLength] = stepData;
      const stepsCount = Math.ceil(l / stepLength);
      const idxData = new Int32Array(new SAB(stepsCount * Int32Array.BYTES_PER_ELEMENT));

      for (let i = 0; i < idxData.length; i++) {
        idxData[i] = i * stepLength;
      }

      stepData.idx = idxData;

      for (let channel = 0; channel < buffer.length; channel++) {
        const samples = buffer[channel];
        const minData = new Float32Array(new SAB(stepsCount * Float32Array.BYTES_PER_ELEMENT));
        const maxData = new Float32Array(new SAB(stepsCount * Float32Array.BYTES_PER_ELEMENT));
        stepData[channel] = {
          min: minData,
          max: maxData
        };
        let maxInStep;
        let minInStep;
        let $step;
        let step;

        if (stepLength === stepsFactor) {
          let samp;

          for (let i = 0; i < l; i++) {
            samp = samples[i];
            $step = i % stepsFactor;
            step = ~~(i / stepsFactor);

            if ($step === 0) {
              maxInStep = samp;
              minInStep = samp;
            } else {
              if (samp > maxInStep) maxInStep = samp;
              if (samp < minInStep) minInStep = samp;
            }

            if ($step === stepsFactor - 1 || $step === l - 1) {
              minData[step] = minInStep;
              maxData[step] = maxInStep;
            }
          }
        } else {
          const {
            idx: prevIdx
          } = waveformData[stepLength / stepsFactor];
          const {
            min: prevMin,
            max: prevMax
          } = waveformData[stepLength / stepsFactor][channel];
          let sampMin;
          let sampMax;

          for (let i = 0; i < prevIdx.length; i++) {
            sampMin = prevMin[i];
            sampMax = prevMax[i];
            $step = i % stepsFactor;
            step = ~~(i / stepsFactor);

            if ($step === 0) {
              maxInStep = sampMax;
              minInStep = sampMin;
            } else {
              if (sampMax > maxInStep) maxInStep = sampMax;
              if (sampMin < minInStep) minInStep = sampMin;
            }

            if ($step === stepsFactor - 1) {
              minData[step] = minInStep;
              maxData[step] = maxInStep;
            }
          }
        }
      }
    }

    return waveformData;
  }

}

new Waveform();

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

/***/ })

/******/ });
//# sourceMappingURL=ea75fc3864d451358f55.worker.js.map