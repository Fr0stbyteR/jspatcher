{

/***/ "./src/core/worklets/AudioWorkletProxyNode.ts":
/*!****************************************************!*\
  !*** ./src/core/worklets/AudioWorkletProxyNode.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Node = class Node extends AudioWorkletNode {
  static get fnNames() {
    return [];
  }

  constructor(context, name, options) {
    var _this;

    super(context, name, options);
    _this = this;

    _defineProperty(this, "_disposed", false);

    const resolves = {};
    const rejects = {};
    let messagePortRequestId = 1;

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
    }; // eslint-disable-next-line


    const call = function call(_call) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return new Promise((resolve, reject) => {
        const id = messagePortRequestId++;
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Node);

/***/ }),

/***/ "./src/core/worklets/AudioWorkletRegister.ts":
/*!***************************************************!*\
  !*** ./src/core/worklets/AudioWorkletRegister.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registeredProcessors": () => (/* binding */ registeredProcessors),
/* harmony export */   "registeringProcessors": () => (/* binding */ registeringProcessors),
/* harmony export */   "resolves": () => (/* binding */ resolves),
/* harmony export */   "rejects": () => (/* binding */ rejects),
/* harmony export */   "default": () => (/* binding */ AudioWorkletRegister)
/* harmony export */ });
var _window$jspatcherEnv, _window$jspatcherEnv$, _window$jspatcherEnv2, _window$jspatcherEnv3, _window$jspatcherEnv4, _window$jspatcherEnv5, _window$jspatcherEnv6, _window$jspatcherEnv7;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const registeredProcessors = ((_window$jspatcherEnv = window.jspatcherEnv) === null || _window$jspatcherEnv === void 0 ? void 0 : (_window$jspatcherEnv$ = _window$jspatcherEnv.AudioWorkletRegister) === null || _window$jspatcherEnv$ === void 0 ? void 0 : _window$jspatcherEnv$.registeredProcessors) || new WeakMap();
const registeringProcessors = ((_window$jspatcherEnv2 = window.jspatcherEnv) === null || _window$jspatcherEnv2 === void 0 ? void 0 : (_window$jspatcherEnv3 = _window$jspatcherEnv2.AudioWorkletRegister) === null || _window$jspatcherEnv3 === void 0 ? void 0 : _window$jspatcherEnv3.registeringProcessors) || new WeakMap();
const resolves = ((_window$jspatcherEnv4 = window.jspatcherEnv) === null || _window$jspatcherEnv4 === void 0 ? void 0 : (_window$jspatcherEnv5 = _window$jspatcherEnv4.AudioWorkletRegister) === null || _window$jspatcherEnv5 === void 0 ? void 0 : _window$jspatcherEnv5.resolves) || {};
const rejects = ((_window$jspatcherEnv6 = window.jspatcherEnv) === null || _window$jspatcherEnv6 === void 0 ? void 0 : (_window$jspatcherEnv7 = _window$jspatcherEnv6.AudioWorkletRegister) === null || _window$jspatcherEnv7 === void 0 ? void 0 : _window$jspatcherEnv7.rejects) || {};
class AudioWorkletRegister {
  static async registerProcessor(audioWorklet, processorId, processor) {
    this.registeringProcessors.get(audioWorklet).add(processorId);

    try {
      for (var _len = arguments.length, injection = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        injection[_key - 3] = arguments[_key];
      }

      const url = typeof processor === "string" ? processor : URL.createObjectURL(new Blob(["(".concat(processor.toString(), ")(").concat([processorId, ...injection].map(JSON.stringify).join(", "), ");")], {
        type: "text/javascript"
      }));
      await audioWorklet.addModule(url);
      this.resolves[processorId].forEach(f => f());
      this.registeringProcessors.get(audioWorklet).delete(processorId);
      this.registeredProcessors.get(audioWorklet).add(processorId);
    } catch (e) {
      this.rejects[processorId].forEach(f => f(e));
    }

    this.rejects[processorId] = [];
    this.resolves[processorId] = [];
  }

  static async register(audioWorklet, processorId, processor) {
    if (!this.resolves[processorId]) this.resolves[processorId] = [];
    if (!this.rejects[processorId]) this.rejects[processorId] = [];
    const promise = new Promise((resolve, reject) => {
      this.resolves[processorId].push(resolve);
      this.rejects[processorId].push(reject);
    });

    if (!this.registeringProcessors.has(audioWorklet)) {
      this.registeringProcessors.set(audioWorklet, new Set());
    }

    if (!this.registeredProcessors.has(audioWorklet)) {
      this.registeredProcessors.set(audioWorklet, new Set());
    }

    const registered = this.registeredProcessors.get(audioWorklet).has(processorId);
    const registering = this.registeringProcessors.get(audioWorklet).has(processorId);
    if (registered) return Promise.resolve();
    if (registering) return promise;

    if (!registered && audioWorklet) {
      for (var _len2 = arguments.length, injection = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        injection[_key2 - 3] = arguments[_key2];
      }

      this.registerProcessor(audioWorklet, processorId, processor, ...injection);
    }

    return promise;
  }

}

_defineProperty(AudioWorkletRegister, "registeredProcessors", registeredProcessors);

_defineProperty(AudioWorkletRegister, "registeringProcessors", registeringProcessors);

_defineProperty(AudioWorkletRegister, "resolves", resolves);

_defineProperty(AudioWorkletRegister, "rejects", rejects);

/***/ }),

/***/ "./src/core/worklets/PatcherNode.ts":
/*!******************************************!*\
  !*** ./src/core/worklets/PatcherNode.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherNode)
/* harmony export */ });
/* harmony import */ var _Patcher_worklet_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Patcher.worklet.ts */ "./src/core/worklets/Patcher.worklet.ts");
/* harmony import */ var _Patcher_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Patcher_worklet_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioWorkletProxyNode */ "./src/core/worklets/AudioWorkletProxyNode.ts");
/* harmony import */ var _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioWorkletRegister */ "./src/core/worklets/AudioWorkletRegister.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // eslint-disable-line import/extensions



const processorId = "__JSPatcher_Patcher";
class PatcherNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor(context, options) {
    super(context, processorId, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 16,
      channelCountMode: "explicit",
      channelInterpretation: "discrete",
      processorOptions: {
        instanceId: options.instanceId,
        fileId: options.fileId,
        data: options.data
      }
    });

    _defineProperty(this, "patcher", void 0);

    _defineProperty(this, "handleChanged", () => {
      const syncData = this.patcher.history.getSyncData();
      this.sync(syncData);
    });

    _defineProperty(this, "handleInput", e => this.fn(e.data, e.inlet));

    _defineProperty(this, "handleDestroy", () => this.destroy());

    this.patcher = options.env.getInstanceById(options.instanceId);
    this.patcher.on("changed", this.handleChanged);
    this.patcher.on("dataInput", this.handleInput);
    this.patcher.on("destroy", this.handleDestroy);
    const _destroy = this.destroy;

    this.destroy = async () => {
      await _destroy.call(this);
      this._disposed = true;
    };
  }

  outlet(port, data) {
    this.patcher.outlet(port, data);
  }

  objectEmitFromWorklet(boxId, eventName, eventData) {
    var _this$patcher$boxes$b;

    return (_this$patcher$boxes$b = this.patcher.boxes[boxId]) === null || _this$patcher$boxes$b === void 0 ? void 0 : _this$patcher$boxes$b.object.emit(eventName, eventData);
  }

}

_defineProperty(PatcherNode, "processorId", processorId);

_defineProperty(PatcherNode, "register", audioWorklet => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__.default.register(audioWorklet, processorId, (_Patcher_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default())));

_defineProperty(PatcherNode, "fnNames", ["init", "fn", "sync", "objectEmit", "destroy"]);

/***/ }),

/***/ "./src/core/worklets/Patcher.worklet.ts":
/*!**********************************************!*\
  !*** ./src/core/worklets/Patcher.worklet.ts ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "js/b862f93c77ff2d6bfe33.worklet.js";

/***/ })

};
//# sourceMappingURL=ff5b9ebb2570e528fa11.worklet.js.map