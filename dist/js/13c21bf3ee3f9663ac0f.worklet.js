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
      var _a2, _b;
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
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.js??ruleSet[1].rules[2].use!./src/core/worklets/Patcher.worklet.ts ***!
  \*******************************************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherProcessor)
/* harmony export */ });
/* harmony import */ var _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioWorkletProxyProcessor */ "./src/core/worklets/AudioWorkletProxyProcessor.ts");

const processorId = "__JSPatcher_Patcher";
const { registerProcessor, jspatcherEnv } = globalThis;
class PatcherProcessor extends _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    super(options);
    this.env = jspatcherEnv;
    this.handleOutlet = (e) => this.outlet(e.outlet, e.data);
    const { instanceId, fileId, data } = options.processorOptions;
    this.instanceId = instanceId;
    this.file = this.env.fileMgr.getProjectItemFromId(fileId);
    this.initData = data;
  }
  static get parameterDescriptors() {
    return new Array(128).fill(null).map((v, i) => ({
      defaultValue: 0,
      name: `00${i}`.slice(-3)
    }));
  }
  async init() {
    const Patcher = this.env.sdk.Patcher;
    this.patcher = new Patcher({ env: this.env, file: this.file, project: this.env.currentProject, instanceId: this.instanceId });
    this.patcher.state.patcherProcessor = this;
    await this.patcher.init(this.initData);
    this.patcher.on("dataOutput", this.handleOutlet);
    this.editor = await this.patcher.getEditor();
  }
  fn(data, port) {
    this.patcher.fn(data, port);
  }
  sync(data) {
    this.patcher.history.syncData(data);
  }
  process(inputs, outputs, parameters) {
    var _a, _b, _c;
    if (this._disposed)
      return false;
    if (!((_b = (_a = inputs == null ? void 0 : inputs[0]) == null ? void 0 : _a[0]) == null ? void 0 : _b.length))
      return true;
    const { parametersBoxes } = this.patcher.inspectAudioIO();
    const handleOutput = ({ output, buffer }) => {
      var _a2;
      if ((_a2 = outputs[output]) == null ? void 0 : _a2[0])
        outputs[output][0].set(buffer);
    };
    this.patcher.on("audioOutput", handleOutput);
    for (let i = 0; i < inputs.length; i++) {
      if ((_c = inputs[i]) == null ? void 0 : _c[0])
        this.patcher.inputAudio(i, inputs[i][0]);
    }
    for (const key in parameters) {
      const boxInfo = parametersBoxes[+key];
      if (!boxInfo)
        continue;
      const param = boxInfo[0];
      this.patcher.inputParam(param, parameters[param]);
    }
    this.patcher.off("audioOutput", handleOutput);
    return true;
  }
  destroy() {
    this.patcher.destroy();
    this._disposed = true;
  }
  objectEmit(boxId, eventName, eventData) {
    var _a;
    return (_a = this.patcher.boxes[boxId]) == null ? void 0 : _a.object.emit(eventName, eventData);
  }
}
PatcherProcessor.fnNames = ["outlet", "objectEmitFromWorklet"];
try {
  registerProcessor(processorId, PatcherProcessor);
} catch (error) {
  console.warn(error);
}

})();

/******/ })()
;
//# sourceMappingURL=13c21bf3ee3f9663ac0f.worklet.js.map