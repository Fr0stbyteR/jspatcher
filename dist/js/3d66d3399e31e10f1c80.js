"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_csound_index_jspatpkg_ts"],{

/***/ "./src/core/objects/csound/CsoundNode.ts":
/*!***********************************************!*\
  !*** ./src/core/objects/csound/CsoundNode.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CsoundNode)
/* harmony export */ });
/* harmony import */ var _base_CodePopupUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/CodePopupUI */ "./src/core/objects/base/CodePopupUI.tsx");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
/* harmony import */ var _base_DefaultObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));




class CsoundNodeUI extends _base_CodePopupUI__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.editorLanguage = "plain";
    this.handleSave = (code) => {
      this.object.setData({ code });
      this.object.newNode(code, this.object._.voices);
    };
  }
  get code() {
    return this.object.data.code;
  }
}
class CsoundNode extends _base_DefaultObject__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor() {
    super(...arguments);
    this._ = { merger: void 0, splitter: void 0, csoundObj: void 0, node: void 0, voices: ~~Math.max(0, this.args[0]) };
    this.handlePreInit = () => void 0;
    this.handlePostInit = async () => {
      if (this.data.code)
        await this.newNode(this.data.code, this._.voices);
    };
    this.handleUpdateArgs = (args) => {
      if (typeof args[0] === "number")
        this._.voices = ~~Math.max(0, args[0]);
    };
    this.handleInlet = async ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          if (this._.node)
            this.outlet(this.outlets - 1, this._.node);
        } else if (typeof data === "string") {
          this.setData({ code: data });
          await this.newNode(data, this._.voices);
        } else if (typeof data === "number") {
          this._.voices = Math.max(0, ~~data);
        } else if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.isMIDIEvent)(data)) {
          if (this._.csoundObj)
            this._.csoundObj.midiMessage(data[0], data[1], data[2]);
        } else if (typeof data === "object") {
          if (this._.node) {
            for (const key in data) {
              try {
                const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.decodeLine)(data[key]);
                this.applyBPF(this._.node.parameters.get(key), bpf);
              } catch (e) {
                this.error(e.message);
              }
            }
          }
        }
      } else if (this._.node) {
        const con = this.inletAudioConnections[inlet].node;
        if (con instanceof AudioParam) {
          try {
            const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.decodeLine)(data);
            this.applyBPF(con, bpf);
          } catch (e) {
            this.error(e.message);
          }
        }
      }
    };
    this.handleDestroy = async () => {
      const { merger, node, csoundObj } = this._;
      if (merger)
        merger.disconnect();
      if (node) {
        node.disconnect();
      }
      if (csoundObj)
        await csoundObj.destroy();
    };
  }
  async getCsoundNode(code) {
    const Csound = await this.env.getCsound();
    const csoundObj = await Csound({
      audioContext: this.audioCtx,
      autoConnect: false,
      useSAB: typeof SharedArrayBuffer !== "undefined",
      useSPN: false,
      useWorker: false
    });
    csoundObj.setOption("-odac");
    csoundObj.on("message", (message) => this.outlet(0, message));
    const result = await csoundObj.compileCsdText(code);
    if (result === 0) {
      await csoundObj.start();
    } else {
      try {
        await csoundObj.cleanup();
      } catch (error) {
        this.error(error);
      }
    }
    const node = await csoundObj.getNode();
    node.channelInterpretation = "discrete";
    return { csoundObj, node };
  }
  async compile(code) {
    let splitter;
    let merger;
    const { node, csoundObj } = await this.getCsoundNode(code);
    if (!node)
      throw new Error("Cannot compile Csound code");
    node.channelInterpretation = "discrete";
    const { audioCtx } = this.patcher;
    const inlets = await csoundObj.getNchnlsInput();
    const outlets = await csoundObj.getNchnls();
    if (inlets) {
      merger = audioCtx.createChannelMerger(inlets);
      merger.channelInterpretation = "discrete";
      merger.connect(node, 0, 0);
    }
    if (outlets) {
      splitter = audioCtx.createChannelSplitter(outlets);
      node.connect(splitter, 0, 0);
    }
    return { inlets, outlets, node, splitter, merger, csoundObj };
  }
  async newNode(code, voices) {
    this.disconnectAudio();
    await this.handleDestroy();
    let compiled;
    try {
      compiled = await this.compile(code);
    } catch (e) {
      this.error(e.message);
      return;
    }
    const { inlets, outlets, merger, splitter, node, csoundObj } = compiled;
    Object.assign(this._, { voices, merger, splitter, node, csoundObj });
    const Ctor = this.constructor;
    const firstInletMeta = Ctor.inlets[0];
    const firstInletSignalMeta = __spreadProps(__spreadValues({}, firstInletMeta), { type: "signal" });
    const inletMeta = { isHot: false, type: "signal", description: "Node connection" };
    const audioParamInletMeta = { isHot: false, type: "signal", description: ": bpf or node connection" };
    const outletMeta = { type: "signal", description: "Node connection" };
    const lastOutletMeta = Ctor.outlets[0];
    const factoryMeta = Ctor.meta;
    for (let i = 0; i < inlets; i++) {
      if (i === 0)
        factoryMeta.inlets[i] = compiled.inlets ? firstInletSignalMeta : firstInletMeta;
      else
        factoryMeta.inlets[i] = inletMeta;
      this.inletAudioConnections[i] = { node: merger, index: i };
    }
    for (let i = 0; i < outlets; i++) {
      factoryMeta.outlets[i] = outletMeta;
      this.outletAudioConnections[i] = { node: splitter, index: i };
    }
    factoryMeta.outlets[outlets] = lastOutletMeta;
    const audioParams = [...node.parameters].map(([k]) => k).sort();
    for (let i = inlets || 1; i < (inlets || 1) + audioParams.length; i++) {
      const path = audioParams[i - (inlets || 1)];
      const param = node.parameters.get(path);
      const { defaultValue, minValue, maxValue } = param;
      factoryMeta.inlets[i] = __spreadProps(__spreadValues({}, audioParamInletMeta), { description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` });
      this.inletAudioConnections[i] = { node: param };
    }
    this.setMeta(factoryMeta);
    this.inlets = (inlets || 1) + audioParams.length;
    this.outlets = outlets + 1;
    this.connectAudio();
    this.outlet(this.outlets - 1, this._.node);
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", this.handlePreInit);
    this.on("postInit", this.handlePostInit);
    this.on("updateArgs", this.handleUpdateArgs);
    this.on("inlet", this.handleInlet);
    this.on("destroy", this.handleDestroy);
  }
}
CsoundNode.package = "Csound";
CsoundNode.author = "Fr0stbyteR";
CsoundNode.version = "1.0.0";
CsoundNode.description = "Dynamically generate WebAudioNode from Csound";
CsoundNode.inlets = [{
  isHot: true,
  type: "anything",
  description: "A bang to output the node, csd string to compile, number to set voices, or a param-bpf map, or a MIDI event"
}];
CsoundNode.outlets = [{
  type: "object",
  description: "CsoundNode instance output: AudioWorkletNode | ScriptProcessor"
}];
CsoundNode.args = [{
  type: "number",
  optional: true,
  default: 0,
  description: "Polyphonic instrument voices count"
}];
CsoundNode.UI = CsoundNodeUI;


/***/ }),

/***/ "./src/core/objects/csound/index.jspatpkg.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/csound/index.jspatpkg.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CsoundNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CsoundNode */ "./src/core/objects/csound/CsoundNode.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (env) => ({
  "csoundnode~": _CsoundNode__WEBPACK_IMPORTED_MODULE_0__["default"]
}));


/***/ })

}]);
//# sourceMappingURL=3d66d3399e31e10f1c80.js.map