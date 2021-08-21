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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  AudioWorkletProcessor
} = globalThis;
const Processor = class Processor extends AudioWorkletProcessor {
  static get fnNames() {
    return [];
  }

  constructor(options) {
    var _this;

    super(options);
    _this = this;

    _defineProperty(this, "_disposed", false);

    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;

    const handleDisposed = () => {
      this.port.removeEventListener("message", handleMessage);
      this.port.close();
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

        this.port.postMessage(r);
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
/*!***************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./src/core/worklets/Patcher.worklet.ts ***!
  \***************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherProcessor)
/* harmony export */ });
/* harmony import */ var _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioWorkletProxyProcessor */ "./src/core/worklets/AudioWorkletProxyProcessor.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const processorId = "__JSPatcher_Patcher";
const {
  registerProcessor,
  jspatcherEnv
} = globalThis;
class PatcherProcessor extends _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__.default {
  static get parameterDescriptors() {
    return new Array(128).fill(null).map((v, i) => ({
      defaultValue: 0,
      // maxValue: Number.MAX_VALUE,
      // minValue: -Number.MAX_VALUE,
      name: "00".concat(i).slice(-3)
    }));
  }

  constructor(options) {
    super(options);

    _defineProperty(this, "env", jspatcherEnv);

    _defineProperty(this, "instanceId", void 0);

    _defineProperty(this, "file", void 0);

    _defineProperty(this, "initData", void 0);

    _defineProperty(this, "patcher", void 0);

    _defineProperty(this, "editor", void 0);

    _defineProperty(this, "handleOutlet", e => this.outlet(e.outlet, e.data));

    const {
      instanceId,
      fileId,
      data
    } = options.processorOptions;
    this.instanceId = instanceId;
    this.file = this.env.fileMgr.getProjectItemFromId(fileId);
    this.initData = data;
  }

  async init() {
    const Patcher = this.env.sdk.Patcher;
    this.patcher = new Patcher({
      env: this.env,
      file: this.file,
      project: this.env.currentProject,
      instanceId: this.instanceId
    });
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
    var _inputs$, _inputs$$;

    if (this._disposed) return false;
    if (!(inputs !== null && inputs !== void 0 && (_inputs$ = inputs[0]) !== null && _inputs$ !== void 0 && (_inputs$$ = _inputs$[0]) !== null && _inputs$$ !== void 0 && _inputs$$.length)) return true;
    const {
      parametersBoxes
    } = this.patcher.inspectAudioIO();

    const handleOutput = _ref => {
      var _outputs$output;

      let {
        output,
        buffer
      } = _ref;
      if ((_outputs$output = outputs[output]) !== null && _outputs$output !== void 0 && _outputs$output[0]) outputs[output][0].set(buffer);
    };

    this.patcher.on("audioOutput", handleOutput);

    for (let i = 0; i < inputs.length; i++) {
      var _inputs$i;

      if ((_inputs$i = inputs[i]) !== null && _inputs$i !== void 0 && _inputs$i[0]) this.patcher.inputAudio(i, inputs[i][0]);
    }

    for (const key in parameters) {
      const boxInfo = parametersBoxes[+key];
      if (!boxInfo) continue;
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
    var _this$patcher$boxes$b;

    return (_this$patcher$boxes$b = this.patcher.boxes[boxId]) === null || _this$patcher$boxes$b === void 0 ? void 0 : _this$patcher$boxes$b.object.emit(eventName, eventData);
  }

}

_defineProperty(PatcherProcessor, "fnNames", ["outlet", "objectEmitFromWorklet"]);

try {
  registerProcessor(processorId, PatcherProcessor);
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(error);
}
})();

/******/ })()
;
//# sourceMappingURL=d7c431b73aee550d8d90.worklet.js.map