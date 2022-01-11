/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/worklets/AudioWorkletProxyProcessor.ts":
/*!*********************************************************!*\
  !*** ./src/core/worklets/AudioWorkletProxyProcessor.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var _a;
const { AudioWorkletProcessor } = globalThis;
const Processor = (_a = class extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this._disposed = false;
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;
    const handleDisposed = () => {
      this.port.removeEventListener("message", handleMessage);
      this.port.close();
    };
    const handleMessage = async (e) => {
      const { id, call: call2, args, value, error } = e.data;
      if (call2) {
        const r = { id };
        try {
          r.value = await this[call2](...args);
        } catch (e2) {
          r.error = e2;
        }
        this.port.postMessage(r);
        if (this._disposed)
          handleDisposed();
      } else {
        if (error) {
          if (rejects[id])
            rejects[id](error);
          delete rejects[id];
          return;
        }
        if (resolves[id]) {
          resolves[id](value);
          delete resolves[id];
        }
      }
    };
    const call = (call2, ...args) => new Promise((resolve, reject) => {
      const id = messagePortRequestId--;
      resolves[id] = resolve;
      rejects[id] = reject;
      this.port.postMessage({ id, call: call2, args });
    });
    const Ctor = this.constructor;
    Ctor.fnNames.forEach((name) => this[name] = (...args) => call(name, ...args));
    this.port.start();
    this.port.addEventListener("message", handleMessage);
  }
}, _a.fnNames = [], _a);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Processor);


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
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.js??ruleSet[1].rules[2].use!./src/core/worklets/GlobalTransportProcessor.worklet.ts ***!
  \************************************************************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GlobalTransportProcessor)
/* harmony export */ });
/* harmony import */ var _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioWorkletProxyProcessor */ "./src/core/worklets/AudioWorkletProxyProcessor.ts");

const processorId = "__JSPatcher_GlobalTransport";
if (!globalThis.SharedArrayBuffer)
  globalThis.SharedArrayBuffer = ArrayBuffer;
const { registerProcessor, sampleRate, jspatcherEnv } = globalThis;
class GlobalTransportProcessor extends _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(options) {
    super(options);
    this.destroyed = false;
    this.timeOffset = globalThis.currentTime;
    this.tickOffset = 0;
    this.tempo = 60;
    this.currentTick = new Uint32Array(new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT));
    this.updateTick(this.currentTick);
    jspatcherEnv.globalTransport = this;
  }
  static get parameterDescriptors() {
    return [{
      defaultValue: 0,
      maxValue: 1,
      minValue: 0,
      name: "playing"
    }, {
      defaultValue: 120,
      maxValue: 240,
      minValue: 1,
      name: "tempo"
    }, {
      defaultValue: 4,
      maxValue: 128,
      minValue: 1,
      name: "timeSigDenominator"
    }, {
      defaultValue: 4,
      maxValue: 128,
      minValue: 1,
      name: "timeSigNumerator"
    }];
  }
  getSampsPerTick(tempo) {
    const secondsPerBeat = 60 / tempo;
    return secondsPerBeat * sampleRate / 240;
  }
  getTickPerSamps(tempo) {
    const ticksPerMinute = tempo * 240;
    return ticksPerMinute / 60 / sampleRate;
  }
  _getTick() {
    return Atomics.load(this.currentTick, 0);
  }
  _setTick(tick) {
    this.tickOffset = tick;
    this.timeOffset = globalThis.currentTime;
    Atomics.store(this.currentTick, 0, ~~this.tickOffset);
    this.updateTick(this.currentTick);
  }
  getSamplesUntil(tick) {
    return this.getSampsPerTick(this.tempo) * (tick - this.tickOffset);
  }
  process(inputs, outputs, parameters) {
    if (this.destroyed)
      return false;
    if (!parameters.playing[0])
      return true;
    const bufferSize = outputs[0][0].length;
    let tick = 0;
    if (parameters.tempo.length > 1) {
      for (let i = 0; i < parameters.tempo.length; i++) {
        const $tempo = parameters.tempo[i];
        const $ticks = this.getTickPerSamps($tempo);
        tick += $ticks;
      }
    } else {
      const $tempo = parameters.tempo[0];
      const $ticks = this.getTickPerSamps($tempo);
      tick += $ticks * bufferSize;
    }
    this.tempo = parameters.tempo[parameters.tempo.length - 1];
    this._setTick(this.tickOffset + tick);
    return true;
  }
  destroy() {
    this.destroyed = true;
    this._disposed = true;
  }
}
GlobalTransportProcessor.fnNames = ["updateTick"];
try {
  registerProcessor(processorId, GlobalTransportProcessor);
} catch (error) {
  console.warn(error);
}

})();

/******/ })()
;
//# sourceMappingURL=a20423a665f33600a061.worklet.js.map