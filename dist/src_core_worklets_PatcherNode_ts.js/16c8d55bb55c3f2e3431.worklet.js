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
var _a;
const Node = (_a = class extends AudioWorkletNode {
  constructor(context, name, options) {
    super(context, name, options);
    this._disposed = false;
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = 1;
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
    const call = (call2, ...args) => {
      return new Promise((resolve, reject) => {
        const id = messagePortRequestId++;
        resolves[id] = resolve;
        rejects[id] = reject;
        this.port.postMessage({ id, call: call2, args });
      });
    };
    const Ctor = this.constructor;
    Ctor.fnNames.forEach((name2) => this[name2] = (...args) => call(name2, ...args));
    this.port.start();
    this.port.addEventListener("message", handleMessage);
  }
}, _a.fnNames = [], _a);
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
var _a, _b, _c, _d, _e, _f, _g, _h;
const registeredProcessors = ((_b = (_a = window.jspatcherEnv) == null ? void 0 : _a.AudioWorkletRegister) == null ? void 0 : _b.registeredProcessors) || /* @__PURE__ */ new WeakMap();
const registeringProcessors = ((_d = (_c = window.jspatcherEnv) == null ? void 0 : _c.AudioWorkletRegister) == null ? void 0 : _d.registeringProcessors) || /* @__PURE__ */ new WeakMap();
const resolves = ((_f = (_e = window.jspatcherEnv) == null ? void 0 : _e.AudioWorkletRegister) == null ? void 0 : _f.resolves) || {};
const rejects = ((_h = (_g = window.jspatcherEnv) == null ? void 0 : _g.AudioWorkletRegister) == null ? void 0 : _h.rejects) || {};
class AudioWorkletRegister {
  static async registerProcessor(audioWorklet, processorId, processor, ...injection) {
    this.registeringProcessors.get(audioWorklet).add(processorId);
    try {
      const url = typeof processor === "string" ? processor : URL.createObjectURL(new Blob([`(${processor.toString()})(${[processorId, ...injection].map(JSON.stringify).join(", ")});`], { type: "text/javascript" }));
      await audioWorklet.addModule(url);
      this.resolves[processorId].forEach((f) => f());
      this.registeringProcessors.get(audioWorklet).delete(processorId);
      this.registeredProcessors.get(audioWorklet).add(processorId);
    } catch (e) {
      this.rejects[processorId].forEach((f) => f(e));
    }
    this.rejects[processorId] = [];
    this.resolves[processorId] = [];
  }
  static async register(audioWorklet, processorId, processor, ...injection) {
    if (!this.resolves[processorId])
      this.resolves[processorId] = [];
    if (!this.rejects[processorId])
      this.rejects[processorId] = [];
    const promise = new Promise((resolve, reject) => {
      this.resolves[processorId].push(resolve);
      this.rejects[processorId].push(reject);
    });
    if (!this.registeringProcessors.has(audioWorklet)) {
      this.registeringProcessors.set(audioWorklet, /* @__PURE__ */ new Set());
    }
    if (!this.registeredProcessors.has(audioWorklet)) {
      this.registeredProcessors.set(audioWorklet, /* @__PURE__ */ new Set());
    }
    const registered = this.registeredProcessors.get(audioWorklet).has(processorId);
    const registering = this.registeringProcessors.get(audioWorklet).has(processorId);
    if (registered)
      return Promise.resolve();
    if (registering)
      return promise;
    if (!registered && audioWorklet) {
      this.registerProcessor(audioWorklet, processorId, processor, ...injection);
    }
    return promise;
  }
}
AudioWorkletRegister.registeredProcessors = registeredProcessors;
AudioWorkletRegister.registeringProcessors = registeringProcessors;
AudioWorkletRegister.resolves = resolves;
AudioWorkletRegister.rejects = rejects;


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



const processorId = "__JSPatcher_Patcher";
class PatcherNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(context, options) {
    super(context, processorId, {
      numberOfInputs: options.inputs,
      numberOfOutputs: options.outputs,
      channelCountMode: "explicit",
      channelInterpretation: "discrete",
      processorOptions: { instanceId: options.instanceId, fileId: options.fileId, data: options.data }
    });
    this.handleChanged = () => {
      const syncData = this.patcher.history.getSyncData();
      this.sync(syncData);
    };
    this.handleInput = (e) => this.fn(e.data, e.inlet);
    this.handleDestroy = () => this.destroy();
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
    var _a;
    return (_a = this.patcher.boxes[boxId]) == null ? void 0 : _a.object.emit(eventName, eventData);
  }
}
PatcherNode.processorId = processorId;
PatcherNode.register = (audioWorklet) => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__["default"].register(audioWorklet, processorId, (_Patcher_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default()));
PatcherNode.fnNames = ["init", "fn", "sync", "objectEmit", "destroy"];


/***/ }),

/***/ "./src/core/worklets/Patcher.worklet.ts":
/*!**********************************************!*\
  !*** ./src/core/worklets/Patcher.worklet.ts ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "js/13c21bf3ee3f9663ac0f.worklet.js";

/***/ })

};
//# sourceMappingURL=16c8d55bb55c3f2e3431.worklet.js.map