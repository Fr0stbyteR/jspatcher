(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_worklets_PatcherNode_ts"],{

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
class PatcherNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__.default {
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
PatcherNode.register = (audioWorklet) => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__.default.register(audioWorklet, processorId, (_Patcher_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default()));
PatcherNode.fnNames = ["init", "fn", "sync", "objectEmit", "destroy"];


/***/ }),

/***/ "./src/core/worklets/Patcher.worklet.ts":
/*!**********************************************!*\
  !*** ./src/core/worklets/Patcher.worklet.ts ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "js/943363437dc1dfc71795.worklet.js";

/***/ })

}]);
//# sourceMappingURL=90ab0c62fb5cb88280a6.js.map