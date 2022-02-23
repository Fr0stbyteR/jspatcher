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
var _a;
const Worker = (_a = class {
  constructor() {
    this._disposed = false;
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;
    const handleDisposed = () => {
      removeEventListener("message", handleMessage);
      close();
    };
    const handleMessage = async (e) => {
      var _a2, _b;
      const { id, call: call2, args, value, error } = e.data;
      if (call2) {
        const r = { id };
        try {
          r.value = await this[call2](...args);
        } catch (e2) {
          r.error = e2;
        }
        postMessage(r);
        if (this._disposed)
          handleDisposed();
      } else {
        if (error)
          (_a2 = rejects[id]) == null ? void 0 : _a2.call(rejects, error);
        else if (resolves[id])
          (_b = resolves[id]) == null ? void 0 : _b.call(resolves, value);
        delete resolves[id];
        delete rejects[id];
      }
    };
    const call = (call2, ...args) => new Promise((resolve, reject) => {
      const id = messagePortRequestId--;
      resolves[id] = resolve;
      rejects[id] = reject;
      postMessage({ id, call: call2, args });
    });
    const Ctor = this.constructor;
    Ctor.fnNames.forEach((name) => this[name] = (...args) => call(name, ...args));
    addEventListener("message", handleMessage);
  }
}, _a.fnNames = [], _a);
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
/*!******************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.js??ruleSet[1].rules[2].use!./src/core/workers/Waveform.worker.ts ***!
  \******************************************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ProxyWorker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProxyWorker */ "./src/core/workers/ProxyWorker.ts");

const SAB = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;
class Waveform extends _ProxyWorker__WEBPACK_IMPORTED_MODULE_0__["default"] {
  generate(buffer, stepsFactor = 16) {
    const waveformData = {};
    if (buffer.length === 0)
      return waveformData;
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
        stepData[channel] = { min: minData, max: maxData };
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
              if (samp > maxInStep)
                maxInStep = samp;
              if (samp < minInStep)
                minInStep = samp;
            }
            if ($step === stepsFactor - 1 || $step === l - 1) {
              minData[step] = minInStep;
              maxData[step] = maxInStep;
            }
          }
        } else {
          const { idx: prevIdx } = waveformData[stepLength / stepsFactor];
          const { min: prevMin, max: prevMax } = waveformData[stepLength / stepsFactor][channel];
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
              if (sampMax > maxInStep)
                maxInStep = sampMax;
              if (sampMin < minInStep)
                minInStep = sampMin;
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

})();

/******/ })()
;
//# sourceMappingURL=1c50b3e8b002743ad72c.worker.js.map