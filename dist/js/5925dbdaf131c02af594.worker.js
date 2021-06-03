/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/workers/ProxyWorker.ts":
/*!*****************************************!*\
  !*** ./src/core/workers/ProxyWorker.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Worker = class Worker {
  static get fnNames() {
    return [];
  }

  constructor() {
    _defineProperty(this, "_disposed", false);

    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;

    const handleDisposed = () => {
      removeEventListener("message", handleMessage);
      close();
    };

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
        if (this._disposed) handleDisposed();
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Worker);

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
/*!**************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./src/core/workers/Waveform.worker.ts ***!
  \**************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ProxyWorker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProxyWorker */ "./src/core/workers/ProxyWorker.ts");

const SAB = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;

class Waveform extends _ProxyWorker__WEBPACK_IMPORTED_MODULE_0__.default {
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

} // eslint-disable-next-line no-new


new Waveform();
})();

/******/ })()
;
//# sourceMappingURL=5925dbdaf131c02af594.worker.js.map