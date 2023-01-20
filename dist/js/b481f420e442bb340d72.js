"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_base_index_jsdsppkg_main_ts"],{

/***/ "./src/core/objects/base/index.jsdsppkg.main.ts":
/*!******************************************************!*\
  !*** ./src/core/objects/base/index.jsdsppkg.main.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _EmptyObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmptyObject */ "./src/core/objects/base/EmptyObject.ts");
/* harmony import */ var _InvalidObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InvalidObject */ "./src/core/objects/base/InvalidObject.ts");
/* harmony import */ var _importer_RemoteImporter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../importer/RemoteImporter */ "./src/core/objects/importer/RemoteImporter.ts");
/* harmony import */ var _index_jspatpkg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./index.jspatpkg */ "./src/core/objects/base/index.jspatpkg.ts");
/* harmony import */ var _jsaw_index_jsdsppkg_main__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../jsaw/index.jsdsppkg.main */ "./src/core/objects/jsaw/index.jsdsppkg.main.ts");

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => __spreadValues({
  BaseObject: _BaseObject__WEBPACK_IMPORTED_MODULE_0__["default"],
  EmptyObject: _EmptyObject__WEBPACK_IMPORTED_MODULE_1__["default"],
  InvalidObject: _InvalidObject__WEBPACK_IMPORTED_MODULE_2__["default"],
  func: _importer_RemoteImporter__WEBPACK_IMPORTED_MODULE_3__.Func,
  new: _importer_RemoteImporter__WEBPACK_IMPORTED_MODULE_3__.New,
  comment: _index_jspatpkg__WEBPACK_IMPORTED_MODULE_4__.comment
}, await (0,_jsaw_index_jsdsppkg_main__WEBPACK_IMPORTED_MODULE_5__["default"])()));


/***/ }),

/***/ "./src/core/objects/jsaw/AudioIn.ts":
/*!******************************************!*\
  !*** ./src/core/objects/jsaw/AudioIn.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioIn)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

class AudioIn extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { index: this.index };
    this.handlePatcherInput = ({ input, buffer }) => {
      if (input === this.index - 1)
        this.outlet(0, buffer);
    };
    this.emitPatcherChangeIO = () => this.patcher.changeIO();
  }
  get index() {
    return Math.max(1, ~~this.box.args[0] || 1);
  }
  subscribe() {
    super.subscribe();
    this.on("metaUpdated", this.emitPatcherChangeIO);
    this.on("preInit", () => {
      this.inlets = 0;
      this.outlets = 1;
    });
    this.on("postInit", this.emitPatcherChangeIO);
    this.on("updateArgs", () => {
      const { index } = this;
      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", (props) => {
      const outlet0 = __spreadValues({}, this.meta.outlets[0]);
      if (typeof props.description === "string")
        outlet0.description = props.description;
      this.setMeta({ outlets: [outlet0] });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet")
      this.patcher.on("audioInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("audioInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }
}
AudioIn.isPatcherInlet = "audio";
AudioIn.description = "Patcher inlet (audio)";
AudioIn.args = [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}];
AudioIn.props = {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
};
AudioIn.outlets = [{
  type: "object",
  description: "Float32Array buffer"
}];


/***/ }),

/***/ "./src/core/objects/jsaw/AudioOut.ts":
/*!*******************************************!*\
  !*** ./src/core/objects/jsaw/AudioOut.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioOut)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

class AudioOut extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { index: this.index };
    this.emitPatcherChangeIO = () => {
      this.patcher.inspectAudioIO();
      this.patcher.changeIO();
    };
  }
  get index() {
    return Math.max(1, ~~this.box.args[0] || 1);
  }
  subscribe() {
    super.subscribe();
    this.on("metaUpdated", this.emitPatcherChangeIO);
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("postInit", this.emitPatcherChangeIO);
    this.on("updateArgs", () => {
      const { index } = this;
      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", (props) => {
      const inlet0 = __spreadValues({}, this.meta.inlets[0]);
      if (typeof props.description === "string")
        inlet0.description = props.description;
      this.setMeta({ inlets: [inlet0] });
      this.emitPatcherChangeIO();
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0)
        this.patcher.outputAudio(this.index - 1, data);
    });
    this.on("destroy", this.emitPatcherChangeIO);
  }
}
AudioOut.isPatcherOutlet = "audio";
AudioOut.description = "Patcher outlet (audio)";
AudioOut.args = [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}];
AudioOut.props = {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
};
AudioOut.inlets = [{
  isHot: true,
  type: "anything",
  description: "Float32Array buffer"
}];


/***/ }),

/***/ "./src/core/objects/jsaw/Param.ts":
/*!****************************************!*\
  !*** ./src/core/objects/jsaw/Param.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Param)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

class Param extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.handlePatcherInput = ({ param, buffer }) => {
      if (this.args[0] === param)
        this.outlet(0, buffer);
    };
    this.emitPatcherChangeIO = () => this.patcher.changeIO();
  }
  subscribe() {
    super.subscribe();
    this.on("metaUpdated", this.emitPatcherChangeIO);
    this.on("preInit", () => {
      this.inlets = 0;
      this.outlets = 1;
    });
    this.on("postInit", this.emitPatcherChangeIO);
    this.on("updateArgs", this.emitPatcherChangeIO);
    this.on("updateProps", (props) => {
      const outlet0 = __spreadValues({}, this.meta.outlets[0]);
      if (typeof props.description === "string")
        outlet0.description = props.description;
      this.setMeta({ outlets: [outlet0] });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet")
      this.patcher.on("paramInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("paramInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }
}
Param.description = "Patcher outlet (data)";
Param.args = [{
  type: "string",
  optional: false,
  default: "",
  description: "Parameter name"
}];
Param.props = {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
};
Param.outlets = [{
  type: "anything",
  description: ""
}];


/***/ }),

/***/ "./src/core/objects/jsaw/index.jsdsppkg.main.ts":
/*!******************************************************!*\
  !*** ./src/core/objects/jsaw/index.jsdsppkg.main.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_generateRemoteObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/generateRemoteObject */ "./src/core/objects/base/generateRemoteObject.ts");
/* harmony import */ var _In__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./In */ "./src/core/objects/jsaw/In.ts");
/* harmony import */ var _Out__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Out */ "./src/core/objects/jsaw/Out.ts");
/* harmony import */ var _Param__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Param */ "./src/core/objects/jsaw/Param.ts");
/* harmony import */ var _AudioIn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AudioIn */ "./src/core/objects/jsaw/AudioIn.ts");
/* harmony import */ var _AudioOut__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AudioOut */ "./src/core/objects/jsaw/AudioOut.ts");







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => ({
  in: (0,_base_generateRemoteObject__WEBPACK_IMPORTED_MODULE_0__["default"])(_In__WEBPACK_IMPORTED_MODULE_1__["default"]),
  out: (0,_base_generateRemoteObject__WEBPACK_IMPORTED_MODULE_0__["default"])(_Out__WEBPACK_IMPORTED_MODULE_2__["default"]),
  "param~": (0,_base_generateRemoteObject__WEBPACK_IMPORTED_MODULE_0__["default"])(_Param__WEBPACK_IMPORTED_MODULE_3__["default"]),
  "in~": (0,_base_generateRemoteObject__WEBPACK_IMPORTED_MODULE_0__["default"])(_AudioIn__WEBPACK_IMPORTED_MODULE_4__["default"]),
  "out~": (0,_base_generateRemoteObject__WEBPACK_IMPORTED_MODULE_0__["default"])(_AudioOut__WEBPACK_IMPORTED_MODULE_5__["default"])
}));


/***/ })

}]);
//# sourceMappingURL=b481f420e442bb340d72.js.map