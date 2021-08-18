(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_base_index_jspatpkg_ts"],{

/***/ "./src/core/objects/base/CodePopupUI.tsx":
/*!***********************************************!*\
  !*** ./src/core/objects/base/CodePopupUI.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CodePopupUI)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/modules/Dimmer/Dimmer.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/elements/Loader/Loader.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/elements/Button/Button.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/modules/Modal/Modal.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/elements/Icon/Icon.js");
/* harmony import */ var _DefaultPopupUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DefaultPopupUI */ "./src/core/objects/base/DefaultPopupUI.tsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class CodePopupUI extends _DefaultPopupUI__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      editorLoaded: false
    }));

    _defineProperty(this, "codeEditor", void 0);

    _defineProperty(this, "editorJSX", void 0);

    _defineProperty(this, "editorLanguage", "javascript");

    _defineProperty(this, "handleSave", code => undefined);

    _defineProperty(this, "handleCloseAndSave", () => {
      this.setState({
        modalOpen: false
      });
      this.handleSave(this.codeEditor.getValue());
    });

    _defineProperty(this, "handleCodeEditorMount", monaco => this.codeEditor = monaco);

    _defineProperty(this, "handleResize", () => this.state.editorLoaded && this.codeEditor ? this.codeEditor.layout() : undefined);
  }

  get code() {
    return "";
  }

  async componentDidMount() {
    super.componentDidMount();
    window.addEventListener("resize", this.handleResize);
    const reactMonacoEditor = await Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_buffer_index_js"), __webpack_require__.e("vendors-include-loader_node_modules_monaco-editor_esm_vs_editor_editor_api_js"), __webpack_require__.e("vendors-node_modules_react-monaco-editor_lib_index_js")]).then(__webpack_require__.bind(__webpack_require__, /*! react-monaco-editor */ "./node_modules/react-monaco-editor/lib/index.js"));
    this.editorJSX = reactMonacoEditor.default;
    this.setState({
      editorLoaded: true
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.inDock) {
      if (this.state.width !== prevState.width || this.state.height !== prevState.height) this.handleResize();
    }
  }

  render() {
    if (this.props.inDock) {
      if (!this.state.editorLoaded) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__.default, {
        active: true
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_3__.default, {
        content: "Loading"
      }));
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          width: "100%",
          height: "100%"
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        style: {
          flex: "1 1 auto",
          overflow: "hidden"
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(this.editorJSX, {
        value: this.code,
        language: this.editorLanguage,
        theme: "vs-dark",
        editorDidMount: this.handleCodeEditorMount,
        options: {
          fontSize: 12
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        style: {
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "row-reverse",
          padding: "10px"
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_4__.default, {
        icon: "checkmark",
        content: "OK",
        color: "green",
        onClick: this.handleCloseAndSave,
        inverted: true
      })));
    }

    const children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_5__.default.Content, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      style: {
        height: window.innerHeight * 0.8
      }
    }, this.state.editorLoaded ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(this.editorJSX, {
      value: this.code,
      language: this.editorLanguage,
      theme: "vs-dark",
      editorDidMount: this.handleCodeEditorMount,
      options: {
        fontSize: 12
      }
    }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_2__.default, {
      active: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_3__.default, {
      content: "Loading"
    })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_5__.default.Actions, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_4__.default, {
      basic: true,
      color: "red",
      onClick: this.handleClose,
      inverted: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_6__.default, {
      name: "remove"
    }), " Cancel"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_4__.default, {
      color: "green",
      onClick: this.handleCloseAndSave,
      inverted: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_6__.default, {
      name: "checkmark"
    }), " OK")));

    const containerProps = _objectSpread({}, this.props.containerProps);

    if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;

    const modalProps = _objectSpread(_objectSpread({}, this.props.modalProps), {}, {
      children,
      open: this.state.modalOpen,
      onClose: this.handleClose,
      basic: true,
      size: "fullscreen"
    });

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_DefaultPopupUI__WEBPACK_IMPORTED_MODULE_1__.default, _extends({}, this.props, {
      modalProps: modalProps,
      containerProps: containerProps
    }));
  }

}

_defineProperty(CodePopupUI, "dockable", true);

/***/ }),

/***/ "./src/core/objects/base/EmptyObject.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/base/EmptyObject.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmptyObject)
/* harmony export */ });
/* harmony import */ var _DefaultObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class EmptyObject extends _DefaultObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      editing: false
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.outlets = 1;
      this.inlets = 1;
    });
    this.on("inlet", _ref => {
      let {
        data
      } = _ref;
      return this.outlet(0, data);
    });
  }

}

_defineProperty(EmptyObject, "author", "Fr0stbyteR");

_defineProperty(EmptyObject, "version", "1.0.0");

_defineProperty(EmptyObject, "description", "Bypass input");

_defineProperty(EmptyObject, "inlets", [{
  isHot: true,
  type: "anything",
  description: "output same thing"
}]);

_defineProperty(EmptyObject, "outlets", [{
  type: "anything",
  description: "output same thing"
}]);

/***/ }),

/***/ "./src/core/objects/base/InvalidObject.ts":
/*!************************************************!*\
  !*** ./src/core/objects/base/InvalidObject.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InvalidObject)
/* harmony export */ });
/* harmony import */ var _DefaultObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
/* harmony import */ var _InvalidObject_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InvalidObject.scss */ "./src/core/objects/base/InvalidObject.scss");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class InvalidObject extends _DefaultObject__WEBPACK_IMPORTED_MODULE_0__.default {
  subscribe() {
    this.patcher.on("libChanged", () => this.box.changeText(this.box.text, true));
  }

}

_defineProperty(InvalidObject, "description", "invalid object");

_defineProperty(InvalidObject, "inlets", [{
  isHot: false,
  type: "anything",
  varLength: true,
  description: "nothing"
}]);

_defineProperty(InvalidObject, "outlets", [{
  type: "anything",
  varLength: true,
  description: "nothing"
}]);

_defineProperty(InvalidObject, "props", {
  bgColor: {
    type: "color",
    default: "rgb(128, 64, 64)",
    description: "Background color",
    isUIState: true
  }
});

/***/ }),

/***/ "./src/core/objects/base/index.jspatpkg.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/base/index.jspatpkg.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _EmptyObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmptyObject */ "./src/core/objects/base/EmptyObject.ts");
/* harmony import */ var _InvalidObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InvalidObject */ "./src/core/objects/base/InvalidObject.ts");
/* harmony import */ var _importer_DefaultImporter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../importer/DefaultImporter */ "./src/core/objects/importer/DefaultImporter.ts");
/* harmony import */ var _main_index_jspatpkg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../main/index.jspatpkg */ "./src/core/objects/main/index.jspatpkg.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => _objectSpread({
  BaseObject: _BaseObject__WEBPACK_IMPORTED_MODULE_0__.default,
  EmptyObject: _EmptyObject__WEBPACK_IMPORTED_MODULE_1__.default,
  InvalidObject: _InvalidObject__WEBPACK_IMPORTED_MODULE_2__.default,
  func: _importer_DefaultImporter__WEBPACK_IMPORTED_MODULE_3__.Func,
  new: _importer_DefaultImporter__WEBPACK_IMPORTED_MODULE_3__.New
}, await (0,_main_index_jspatpkg__WEBPACK_IMPORTED_MODULE_4__.default)()));

/***/ }),

/***/ "./src/core/objects/faust/FaustNode.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/faust/FaustNode.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FaustNode)
/* harmony export */ });
/* harmony import */ var _base_CodePopupUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/CodePopupUI */ "./src/core/objects/base/CodePopupUI.tsx");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
/* harmony import */ var _base_DefaultObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class FaustNodeUI extends _base_CodePopupUI__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "editorLanguage", "faust");

    _defineProperty(this, "handleSave", code => {
      this.object.setData({
        code
      });
      this.object.newNode(code, this.object._.voices);
    });
  }

  get code() {
    return this.object.data.code;
  }

}

class FaustNode extends _base_DefaultObject__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      merger: undefined,
      splitter: undefined,
      node: undefined,
      voices: 0
    });

    _defineProperty(this, "handlePreInit", () => undefined);

    _defineProperty(this, "handlePostInit", async () => {
      if (this.data.code) await this.newNode(this.data.code, this._.voices);
    });

    _defineProperty(this, "handleUpdateArgs", args => {
      if (typeof args[0] === "number") this._.voices = ~~Math.max(0, args[0]);
    });

    _defineProperty(this, "handleInlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          if (this._.node) this.outlet(this.outlets - 1, this._.node);
        } else if (typeof data === "string") {
          this.setData({
            code: data
          });
          await this.newNode(data, this._.voices);
        } else if (typeof data === "number") {
          this._.voices = Math.max(0, ~~data);
        } else if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.isMIDIEvent)(data)) {
          if (this._.node) this._.node.midiMessage(data);
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
    });

    _defineProperty(this, "handleDestroy", () => {
      const {
        merger,
        node
      } = this._;
      if (merger) merger.disconnect();

      if (node) {
        node.disconnect();
        node.destroy();
      }
    });
  }

  async getFaustNode(code, voices) {
    const {
      audioCtx
    } = this;
    const faust = await this.env.getFaust();
    return faust.getNode(code, {
      audioCtx,
      useWorklet: true,
      voices,
      args: {
        "-I": ["libraries/", "project/"]
      }
    });
  }

  async compile(code, voices) {
    let splitter;
    let merger;
    const node = await this.getFaustNode(code, voices);
    if (!node) throw new Error("Cannot compile Faust code");
    node.channelInterpretation = "discrete";
    node.dspCode = code;
    const {
      audioCtx
    } = this.patcher;
    const inlets = node.getNumInputs();
    const outlets = node.getNumOutputs();

    if (inlets) {
      merger = audioCtx.createChannelMerger(inlets);
      merger.channelInterpretation = "discrete";
      merger.connect(node, 0, 0);
    }

    if (outlets) {
      splitter = audioCtx.createChannelSplitter(outlets);
      node.connect(splitter, 0, 0);
    }

    return {
      inlets,
      outlets,
      node,
      splitter,
      merger
    };
  }

  async newNode(code, voices) {
    let compiled;

    try {
      compiled = await this.compile(code, voices);
    } catch (e) {
      this.error(e.message);
      return;
    }

    const {
      inlets,
      outlets,
      merger,
      splitter,
      node
    } = compiled;
    this.disconnectAudio();
    this.handleDestroy();
    Object.assign(this._, {
      voices,
      merger,
      splitter,
      node
    });
    const Ctor = this.constructor;
    const firstInletMeta = Ctor.inlets[0];

    const firstInletSignalMeta = _objectSpread(_objectSpread({}, firstInletMeta), {}, {
      type: "signal"
    });

    const inletMeta = {
      isHot: false,
      type: "signal",
      description: "Node connection"
    };
    const audioParamInletMeta = {
      isHot: false,
      type: "signal",
      description: ": bpf or node connection"
    };
    const outletMeta = {
      type: "signal",
      description: "Node connection"
    };
    const lastOutletMeta = Ctor.outlets[0];
    const factoryMeta = Ctor.meta;

    for (let i = 0; i < inlets; i++) {
      if (i === 0) factoryMeta.inlets[i] = compiled.inlets ? firstInletSignalMeta : firstInletMeta;else factoryMeta.inlets[i] = inletMeta;
      this.inletAudioConnections[i] = {
        node: merger,
        index: i
      };
    }

    for (let i = 0; i < outlets; i++) {
      factoryMeta.outlets[i] = outletMeta;
      this.outletAudioConnections[i] = {
        node: splitter,
        index: i
      };
    }

    factoryMeta.outlets[outlets] = lastOutletMeta;
    const audioParams = [];
    node.parameters.forEach((v, k) => audioParams.push(k));

    for (let i = inlets || 1; i < (inlets || 1) + audioParams.length; i++) {
      const path = audioParams[i - (inlets || 1)];
      const param = node.parameters.get(path);
      const {
        defaultValue,
        minValue,
        maxValue
      } = param;
      factoryMeta.inlets[i] = _objectSpread(_objectSpread({}, audioParamInletMeta), {}, {
        description: "".concat(path).concat(audioParamInletMeta.description, ": ").concat(defaultValue, " (").concat(minValue, " - ").concat(maxValue, ")")
      });
      this.inletAudioConnections[i] = {
        node: param
      };
    }

    this.setMeta(factoryMeta);
    this.inlets = (inlets || 1) + node.parameters.size;
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

_defineProperty(FaustNode, "package", "Faust");

_defineProperty(FaustNode, "author", "Fr0stbyteR");

_defineProperty(FaustNode, "version", "1.0.0");

_defineProperty(FaustNode, "description", "Dynamically generate WebAudioNode from Faust");

_defineProperty(FaustNode, "inlets", [{
  isHot: true,
  type: "anything",
  description: "A bang to output the node, code string to compile, number to set voices, or a param-bpf map, or a MIDI event"
}]);

_defineProperty(FaustNode, "outlets", [{
  type: "object",
  description: "FaustNode instance output: AudioWorkletNode | ScriptProcessor"
}]);

_defineProperty(FaustNode, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Polyphonic instrument voices count"
}]);

_defineProperty(FaustNode, "UI", FaustNodeUI);

/***/ }),

/***/ "./src/core/objects/jsaw/In.ts":
/*!*************************************!*\
  !*** ./src/core/objects/jsaw/In.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ In)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class In extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      index: this.index
    });

    _defineProperty(this, "handlePatcherInput", _ref => {
      let {
        data,
        inlet
      } = _ref;
      if (inlet === this.index - 1) this.outlet(0, data);
    });

    _defineProperty(this, "emitPatcherChangeIO", () => this.patcher.changeIO());
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
      const {
        index
      } = this;

      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", props => {
      const outlet0 = _objectSpread({}, this.meta.outlets[0]);

      if (typeof props.description === "string") outlet0.description = props.description;
      if (typeof props.type === "string") outlet0.type = props.type || "anything";
      this.setMeta({
        outlets: [outlet0]
      });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet") this.patcher.on("dataInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("dataInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }

}

_defineProperty(In, "isPatcherInlet", "data");

_defineProperty(In, "description", "Patcher inlet (data)");

_defineProperty(In, "args", [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}]);

_defineProperty(In, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  },
  type: {
    type: "enum",
    enums: ["string", "number", "boolean", "object", "function", "anything", "bang", "color"],
    default: "anything",
    description: "Inlet data type"
  }
});

_defineProperty(In, "outlets", [{
  type: "anything",
  description: ""
}]);

/***/ }),

/***/ "./src/core/objects/jsaw/Out.ts":
/*!**************************************!*\
  !*** ./src/core/objects/jsaw/Out.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Out)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Out extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      index: this.index
    });

    _defineProperty(this, "emitPatcherChangeIO", () => this.patcher.changeIO());
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
      const {
        index
      } = this;

      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", props => {
      const inlet0 = _objectSpread({}, this.meta.inlets[0]);

      if (typeof props.description === "string") inlet0.description = props.description;
      if (typeof props.type === "string") inlet0.type = props.type || "anything";
      this.setMeta({
        inlets: [inlet0]
      });
      this.emitPatcherChangeIO();
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      if (inlet === 0) this.patcher.outlet(this.index - 1, data);
    });
    this.on("destroy", this.emitPatcherChangeIO);
  }

}

_defineProperty(Out, "isPatcherOutlet", "data");

_defineProperty(Out, "description", "Patcher outlet (data)");

_defineProperty(Out, "args", [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}]);

_defineProperty(Out, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  },
  type: {
    type: "enum",
    enums: ["string", "number", "boolean", "object", "function", "anything", "bang", "color"],
    default: "anything",
    description: "Inlet data type"
  }
});

_defineProperty(Out, "inlets", [{
  isHot: true,
  type: "anything",
  description: ""
}]);

/***/ }),

/***/ "./src/core/objects/main/AudioIn.ts":
/*!******************************************!*\
  !*** ./src/core/objects/main/AudioIn.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioIn)
/* harmony export */ });
/* harmony import */ var _base_DefaultObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AudioIn extends _base_DefaultObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "outletAudioConnections", [{
      node: undefined,
      index: 0
    }]);

    _defineProperty(this, "_duringInit", true);

    _defineProperty(this, "_", {
      index: this.index
    });

    _defineProperty(this, "emitPatcherChangeIO", () => this.patcher.changeIO());
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
    this.on("postInit", () => {
      this._duringInit = false;
      this.connectAudio();
      this.patcher.connectAudioInlet(this.index - 1);
      this.patcher.inspectAudioIO();
      this.emitPatcherChangeIO();
    });
    this.on("updateArgs", () => {
      const {
        index
      } = this;

      if (index !== this._.index) {
        this._.index = index;
        this.patcher.disconnectAudioInlet(index - 1);
        this.disconnectAudio();

        if (!this.patcher.inletAudioConnections[index - 1]) {
          const node = this.audioCtx.createGain();
          node.channelInterpretation = "discrete";
          this.patcher.inletAudioConnections[index - 1] = {
            node,
            index: 0
          };
        }

        const {
          node
        } = this.patcher.inletAudioConnections[index - 1];
        this.outletAudioConnections[0].node = node;

        if (!this._duringInit) {
          this.connectAudio();
          this.patcher.connectAudioInlet(index - 1);
          this.patcher.inspectAudioIO();
          this.emitPatcherChangeIO();
        }
      }
    });
    this.on("updateProps", props => {
      const outlet0 = _objectSpread({}, this.meta.outlets[0]);

      if (typeof props.description === "string") outlet0.description = props.description;
      this.setMeta({
        outlets: [outlet0]
      });
      this.emitPatcherChangeIO();
    });
    this.on("destroy", () => {
      this.patcher.inspectAudioIO();
      this.emitPatcherChangeIO();
    });
  }

}

_defineProperty(AudioIn, "package", "SubPatcher");

_defineProperty(AudioIn, "description", "Patcher inlet (audio)");

_defineProperty(AudioIn, "args", [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}]);

_defineProperty(AudioIn, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
});

_defineProperty(AudioIn, "outlets", [{
  type: "signal",
  description: ""
}]);

/***/ }),

/***/ "./src/core/objects/main/AudioOut.ts":
/*!*******************************************!*\
  !*** ./src/core/objects/main/AudioOut.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioOut)
/* harmony export */ });
/* harmony import */ var _base_DefaultObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AudioOut extends _base_DefaultObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "inletAudioConnections", [{
      node: undefined,
      index: 0
    }]);

    _defineProperty(this, "_duringInit", true);

    _defineProperty(this, "_", {
      index: this.index
    });

    _defineProperty(this, "emitPatcherChangeIO", () => this.patcher.changeIO());
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
    this.on("postInit", () => {
      this._duringInit = false;
      this.connectAudio();
      this.patcher.connectAudioInlet(this.state.index - 1);
      this.patcher.inspectAudioIO();
      this.emitPatcherChangeIO();
    });
    this.on("updateArgs", () => {
      const {
        index
      } = this;

      if (index !== this._.index) {
        this._.index = index;
        this.patcher.disconnectAudioOutlet(index - 1);
        this.disconnectAudio();

        if (!this.patcher.outletAudioConnections[index - 1]) {
          const node = this.audioCtx.createGain();
          node.channelInterpretation = "discrete";
          this.patcher.outletAudioConnections[index - 1] = {
            node,
            index: 0
          };
        }

        const {
          node
        } = this.patcher.outletAudioConnections[index - 1];
        this.inletAudioConnections[0].node = node;

        if (!this._duringInit) {
          this.connectAudio();
          this.patcher.connectAudioOutlet(index - 1);
          this.patcher.inspectAudioIO();
          this.emitPatcherChangeIO();
        }
      }
    });
    this.on("updateProps", props => {
      const inlet0 = _objectSpread({}, this.meta.inlets[0]);

      if (typeof props.description === "string") inlet0.description = props.description;
      this.setMeta({
        inlets: [inlet0]
      });
      this.emitPatcherChangeIO();
    });
    this.on("destroy", () => {
      this.patcher.inspectAudioIO();
      this.emitPatcherChangeIO();
    });
  }

}

_defineProperty(AudioOut, "package", "SubPatcher");

_defineProperty(AudioOut, "description", "Patcher outlet (audio)");

_defineProperty(AudioOut, "args", [{
  type: "number",
  optional: false,
  default: 1,
  description: "Outlet index (1-based)"
}]);

_defineProperty(AudioOut, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
});

_defineProperty(AudioOut, "inlets", [{
  type: "signal",
  description: "",
  isHot: true
}]);

/***/ }),

/***/ "./src/core/objects/main/BPatcher.ts":
/*!*******************************************!*\
  !*** ./src/core/objects/main/BPatcher.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BPatcher)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _BPatcherUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BPatcherUI */ "./src/core/objects/main/BPatcherUI.tsx");
/* harmony import */ var _SubPatcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SubPatcher */ "./src/core/objects/main/SubPatcher.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class BPatcher extends _SubPatcher__WEBPACK_IMPORTED_MODULE_2__.default {}

_defineProperty(BPatcher, "props", _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default.props);

_defineProperty(BPatcher, "UI", _BPatcherUI__WEBPACK_IMPORTED_MODULE_1__.default);

/***/ }),

/***/ "./src/core/objects/main/BPatcherUI.tsx":
/*!**********************************************!*\
  !*** ./src/core/objects/main/BPatcherUI.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BPatcherUI)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _components_editors_PatcherEditorUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/editors/PatcherEditorUI */ "./src/components/editors/PatcherEditorUI.tsx");
/* harmony import */ var _base_BaseUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/BaseUI */ "./src/core/objects/base/BaseUI.tsx");
/* harmony import */ var _components_editors_patcher_PatcherUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../components/editors/patcher/PatcherUI */ "./src/components/editors/patcher/PatcherUI.tsx");
/* harmony import */ var _BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BPatcherUI.scss */ "./src/core/objects/main/BPatcherUI.scss");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class BPatcherUI extends _base_BaseUI__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      patcher: this.object._.patcher,
      timestamp: performance.now(),
      editor: undefined
    }));

    _defineProperty(this, "handleChanged", () => {
      if (this.state.editor.isTemporary) this.state.editor.save();
    });
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.state.patcher) {
      const Editor = this.editor.constructor;
      const editor = new Editor(this.object._.patcher);
      this.setState({
        editor
      });
      editor.init();
      editor.on("changed", this.handleChanged);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.patcher !== this.state.patcher) {
      if (this.state.editor) {
        this.state.editor.off("changed", this.handleChanged);
        this.state.editor.destroy();
      }

      if (this.state.patcher) {
        const Editor = this.editor.constructor;
        const editor = new Editor(this.object._.patcher);
        this.setState({
          timestamp: performance.now(),
          editor
        });
        editor.init();
        editor.on("changed", this.handleChanged);
      } else {
        this.setState({
          timestamp: performance.now(),
          editor: undefined
        });
      }
    }
  }

  componentWillUnmount() {
    var _this$state$editor;

    (_this$state$editor = this.state.editor) === null || _this$state$editor === void 0 ? void 0 : _this$state$editor.off("changed", this.handleChanged);
    super.componentWillUnmount();
  }

  render() {
    if (this.props.inDock) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        style: {
          height: "100%",
          width: "100%",
          display: "flex"
        }
      }, this.state.editor ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_editors_PatcherEditorUI__WEBPACK_IMPORTED_MODULE_1__.default, {
        key: this.state.timestamp,
        editor: this.state.editor,
        env: this.env,
        lang: this.env.language
      }) : undefined);
    }

    const children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      style: {
        height: "100%",
        width: "100%",
        display: "flex"
      }
    }, this.state.editor ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_editors_patcher_PatcherUI__WEBPACK_IMPORTED_MODULE_3__.default, {
      key: this.state.timestamp,
      editor: this.state.editor,
      transparent: true,
      runtime: true
    }) : undefined);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_base_BaseUI__WEBPACK_IMPORTED_MODULE_2__.default, _extends({}, this.props, {
      children: children
    }));
  }

}

_defineProperty(BPatcherUI, "sizing", "both");

_defineProperty(BPatcherUI, "defaultSize", [210, 90]);

_defineProperty(BPatcherUI, "dockable", true);

/***/ }),

/***/ "./src/core/objects/main/DspSubPatcher.ts":
/*!************************************************!*\
  !*** ./src/core/objects/main/DspSubPatcher.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DspSubPatcher)
/* harmony export */ });
/* harmony import */ var _SubPatcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SubPatcher */ "./src/core/objects/main/SubPatcher.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class DspSubPatcher extends _SubPatcher__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "type", "jsaw");

    _defineProperty(this, "_", _objectSpread(_objectSpread({}, this._), {}, {
      node: undefined
    }));

    _defineProperty(this, "reload", async () => {
      if (this._.patcher) {
        this.disconnectAudio();
        await this.unsubscribePatcher();
      } // const { key } = this._;


      let patcher; // let rawPatcher: RawPatcher;

      try {
        patcher = new this.Patcher({
          env: this.patcher.env,
          project: this.patcher.project
        });
        await patcher.load(this.data, this.type);
        this._.node = await patcher.getPatcherNode();
        this._.patcher = patcher;
        this.updateUI({
          patcher
        });
      } catch (error) {
        this.error(error);
      } finally {
        this.handlePatcherIOChanged(this._.patcher.meta);
        this.subscribePatcher();
        this.handlePatcherGraphChanged();
        this.connectAudio();
      }
    });

    _defineProperty(this, "handlePatcherChanged", () => {
      const rawPatcher = this._.patcher.toSerializable();

      this.setData(rawPatcher);
      this.patcher.emit("changed");
    });

    _defineProperty(this, "handlePatcherIOChanged", meta => {
      this.inlets = meta.inlets.length;
      this.outlets = meta.outlets.length;
      const {
        inlets,
        outlets
      } = meta;
      const {
        node
      } = this._;
      this.inletAudioConnections = new Array(inlets).fill(null).map((v, index) => ({
        node,
        index
      }));
      this.outletAudioConnections = new Array(outlets).fill(null).map((v, index) => ({
        node,
        index
      }));
      this.setMeta(_objectSpread(_objectSpread({}, this.meta), {}, {
        inlets,
        outlets,
        args: _SubPatcher__WEBPACK_IMPORTED_MODULE_0__.default.args
      }));
    });
  }

}

/***/ }),

/***/ "./src/core/objects/main/FaustPatcher.ts":
/*!***********************************************!*\
  !*** ./src/core/objects/main/FaustPatcher.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FaustPatcher)
/* harmony export */ });
/* harmony import */ var _faust_FaustNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../faust/FaustNode */ "./src/core/objects/faust/FaustNode.ts");
/* harmony import */ var _SubPatcherUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SubPatcherUI */ "./src/core/objects/main/SubPatcherUI.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class FaustPatcher extends _faust_FaustNode__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      merger: undefined,
      splitter: undefined,
      node: undefined,
      patcher: undefined,
      key: this.box.args[0],
      code: undefined,
      voices: ~~Math.max(0, this.box.args[1])
    });

    _defineProperty(this, "type", "faust");

    _defineProperty(this, "handleFilePathChanged", () => {
      this._.key = this._.patcher.file.projectPath;
    });

    _defineProperty(this, "handleSaved", e => {
      if (e.instance === this._.patcher) return;
      this.reload();
    });

    _defineProperty(this, "subscribePatcher", async () => {
      const {
        patcher
      } = this._;

      if (patcher) {
        await patcher.addObserver(this);
        patcher.on("graphChanged", this.handleGraphChanged);
        patcher.on("changed", this.handlePatcherChanged);
        const {
          file
        } = patcher;

        if (file) {
          file.on("destroyed", this.reload);
          file.on("nameChanged", this.handleFilePathChanged);
          file.on("pathChanged", this.handleFilePathChanged);
          file.on("saved", this.handleSaved);
        }
      }
    });

    _defineProperty(this, "unsubscribePatcher", async () => {
      const {
        patcher
      } = this._;

      if (patcher) {
        patcher.off("graphChanged", this.handleGraphChanged);
        patcher.off("changed", this.handlePatcherChanged);
        const {
          file
        } = patcher;

        if (file) {
          file.off("destroyed", this.reload);
          file.off("nameChanged", this.handleFilePathChanged);
          file.off("pathChanged", this.handleFilePathChanged);
          file.off("saved", this.handleSaved);
        }

        await patcher.removeObserver(this); // patcher will be destroyed if no observers left.
      }
    });

    _defineProperty(this, "handleGraphChanged", async () => {
      await this.compilePatcher();
      this.patcher.emit("graphChanged");
    });

    _defineProperty(this, "handlePatcherChanged", () => {
      const {
        patcher
      } = this._;

      if (patcher.isTemporary) {
        const rawPatcher = patcher.toSerializable();
        this.setData(rawPatcher);
      }

      this.patcher.emit("changed");
    });

    _defineProperty(this, "reload", async () => {
      if (this._.patcher) {
        this.disconnectAudio();
        await this.unsubscribePatcher();
      }

      const {
        key
      } = this._;
      let patcher;
      let rawPatcher;

      try {
        const {
          item,
          newItem
        } = await this.getSharedItem(key, "patcher", async () => {
          patcher = new this.Patcher({
            env: this.patcher.env,
            project: this.patcher.project
          });
          await patcher.load(this.data, this.type);
          rawPatcher = patcher.toSerializable();
          return rawPatcher;
        });

        if (newItem) {
          patcher.file = item;
          this.setData(rawPatcher);
        } else {
          patcher = await item.instantiate({
            env: this.patcher.env,
            project: this.patcher.project
          });
          this.setData(patcher.toSerializable());
        }

        this._.patcher = patcher;
        this.updateUI({
          patcher
        });
      } catch (error) {
        this.error(error);
      } finally {
        await this.subscribePatcher();
        await this.handleGraphChanged();
        this.connectAudio();
      }
    });

    _defineProperty(this, "handlePreInit", () => {});

    _defineProperty(this, "handleUpdateArgs", async args => {
      if (!this._.patcher) return;
      const {
        voices,
        key
      } = this._;
      let newKey = key;
      let newVoices = voices;

      if (typeof args[0] === "string" || typeof args[0] === "undefined") {
        newKey = args[0];
        if (newKey !== key) this._.key = newKey;
      }

      if (typeof args[1] === "number") {
        newVoices = ~~Math.max(0, args[1]);
        this._.voices = newVoices;
      }

      if (newKey !== key) {
        await this.reload();
      } else if (newVoices !== voices) {
        this.disconnectAudio();
        await this.compilePatcher();
        this.connectAudio();
      }
    });

    _defineProperty(this, "handlePostInit", this.reload);
  }

  async compilePatcher() {
    const code = this._.patcher.toFaustDspCode();

    if (code && code !== this._.code) {
      this._.code = code;
      await this.newNode(code, this._.voices);
    }
  }

  subscribe() {
    super.subscribe();
    this.on("destroy", this.unsubscribePatcher);
  }

}

_defineProperty(FaustPatcher, "package", "SubPatcher");

_defineProperty(FaustPatcher, "description", "Faust Sub-patcher, compiled to AudioNode");

_defineProperty(FaustPatcher, "args", [{
  type: "string",
  optional: true,
  default: "",
  description: "Name of the subpatcher"
}, {
  type: "number",
  optional: true,
  default: 0,
  description: "Polyphonic instrument voices count"
}]);

_defineProperty(FaustPatcher, "UI", _SubPatcherUI__WEBPACK_IMPORTED_MODULE_1__.default);

/***/ }),

/***/ "./src/core/objects/main/GenPatcher.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/main/GenPatcher.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GenPatcher)
/* harmony export */ });
/* harmony import */ var _FaustPatcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FaustPatcher */ "./src/core/objects/main/FaustPatcher.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class GenPatcher extends _FaustPatcher__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "type", "gen");
  }

}

_defineProperty(GenPatcher, "description", "Gen Sub-patcher, compiled to AudioNode");

/***/ }),

/***/ "./src/core/objects/main/In.ts":
/*!*************************************!*\
  !*** ./src/core/objects/main/In.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_generateDefaultObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/generateDefaultObject */ "./src/core/objects/base/generateDefaultObject.ts");
/* harmony import */ var _jsaw_In__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../jsaw/In */ "./src/core/objects/jsaw/In.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_base_generateDefaultObject__WEBPACK_IMPORTED_MODULE_0__.default)(_jsaw_In__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./src/core/objects/main/Out.ts":
/*!**************************************!*\
  !*** ./src/core/objects/main/Out.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_generateDefaultObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/generateDefaultObject */ "./src/core/objects/base/generateDefaultObject.ts");
/* harmony import */ var _jsaw_Out__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../jsaw/Out */ "./src/core/objects/jsaw/Out.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_base_generateDefaultObject__WEBPACK_IMPORTED_MODULE_0__.default)(_jsaw_Out__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./src/core/objects/main/SubPatcher.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/main/SubPatcher.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SubPatcher)
/* harmony export */ });
/* harmony import */ var _base_DefaultObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
/* harmony import */ var _SubPatcherUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SubPatcherUI */ "./src/core/objects/main/SubPatcherUI.tsx");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class SubPatcher extends _base_DefaultObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      patcher: undefined,
      key: this.box.args[0]
    });

    _defineProperty(this, "type", "js");

    _defineProperty(this, "handlePatcherOutput", _ref => {
      let {
        outlet,
        data
      } = _ref;
      return this.outlet(outlet, data);
    });

    _defineProperty(this, "handlePatcherDisconnectAudioInlet", port => this.disconnectAudioInlet(port));

    _defineProperty(this, "handlePatcherDisconnectAudioOutlet", port => this.disconnectAudioOutlet(port));

    _defineProperty(this, "handlePatcherConnectAudioInlet", port => this.connectAudioInlet(port));

    _defineProperty(this, "handlePatcherConnectAudioOutlet", port => this.connectAudioOutlet(port));

    _defineProperty(this, "handlePatcherIOChanged", meta => {
      this.inletAudioConnections = this._.patcher.inletAudioConnections.slice();
      this.outletAudioConnections = this._.patcher.outletAudioConnections.slice();
      this.inlets = meta.inlets.length;
      this.outlets = meta.outlets.length;
      const {
        inlets,
        outlets
      } = meta;
      this.setMeta(_objectSpread(_objectSpread({}, this.meta), {}, {
        inlets,
        outlets,
        args: SubPatcher.args
      }));
    });

    _defineProperty(this, "handlePatcherGraphChanged", () => {
      this.patcher.emit("graphChanged");
    });

    _defineProperty(this, "handlePatcherChanged", () => {
      const {
        patcher
      } = this._;

      if (patcher.isTemporary) {
        const rawPatcher = patcher.toSerializable();
        this.setData(rawPatcher);
      }

      this.patcher.emit("changed");
    });

    _defineProperty(this, "handleFilePathChanged", () => {
      this._.key = this._.patcher.file.projectPath;
    });

    _defineProperty(this, "handleSaved", e => {
      if (e.instance === this._.patcher) return;
      this.reload();
    });

    _defineProperty(this, "subscribePatcher", async () => {
      const {
        patcher
      } = this._;

      if (patcher) {
        await patcher.addObserver(this);
        patcher.on("dataOutput", this.handlePatcherOutput);
        patcher.on("disconnectAudioInlet", this.handlePatcherDisconnectAudioInlet);
        patcher.on("disconnectAudioOutlet", this.handlePatcherDisconnectAudioOutlet);
        patcher.on("connectAudioInlet", this.handlePatcherConnectAudioInlet);
        patcher.on("connectAudioOutlet", this.handlePatcherConnectAudioOutlet);
        patcher.on("ioChanged", this.handlePatcherIOChanged);
        patcher.on("graphChanged", this.handlePatcherGraphChanged);
        patcher.on("changed", this.handlePatcherChanged);
        const {
          file
        } = patcher;

        if (file) {
          file.on("destroyed", this.reload);
          file.on("nameChanged", this.handleFilePathChanged);
          file.on("pathChanged", this.handleFilePathChanged);
          file.on("saved", this.handleSaved);
        }
      }
    });

    _defineProperty(this, "unsubscribePatcher", async () => {
      const {
        patcher
      } = this._;

      if (patcher) {
        patcher.off("dataOutput", this.handlePatcherOutput);
        patcher.off("disconnectAudioInlet", this.handlePatcherDisconnectAudioInlet);
        patcher.off("disconnectAudioOutlet", this.handlePatcherDisconnectAudioOutlet);
        patcher.off("connectAudioInlet", this.handlePatcherConnectAudioInlet);
        patcher.off("connectAudioOutlet", this.handlePatcherConnectAudioOutlet);
        patcher.off("ioChanged", this.handlePatcherIOChanged);
        patcher.off("graphChanged", this.handlePatcherGraphChanged);
        patcher.off("changed", this.handlePatcherChanged);
        const {
          file
        } = patcher;

        if (file) {
          file.off("destroyed", this.reload);
          file.off("nameChanged", this.handleFilePathChanged);
          file.off("pathChanged", this.handleFilePathChanged);
          file.off("saved", this.handleSaved);
        }

        await patcher.removeObserver(this); // patcher will be destroyed if no observers left.
      }
    });

    _defineProperty(this, "reload", async () => {
      if (this._.patcher) {
        this.disconnectAudio();
        await this.unsubscribePatcher();
      }

      const {
        key
      } = this._;
      let patcher;
      let rawPatcher;

      try {
        const {
          item,
          newItem
        } = await this.getSharedItem(key, "patcher", async () => {
          patcher = new this.Patcher({
            env: this.patcher.env,
            project: this.patcher.project
          });
          await patcher.load(this.data, this.type);
          rawPatcher = patcher.toSerializable();
          return rawPatcher;
        });

        if (newItem) {
          patcher.file = item;
          this.setData(rawPatcher);
        } else {
          patcher = await item.instantiate({
            env: this.patcher.env,
            project: this.patcher.project
          });
          this.setData(patcher.toSerializable());
        }

        this._.patcher = patcher;
        this.updateUI({
          patcher
        });
      } catch (error) {
        this.error(error);
      } finally {
        this.handlePatcherIOChanged(this._.patcher.meta);
        this.subscribePatcher();
        this.handlePatcherGraphChanged();
        this.connectAudio();
      }
    });
  }

  subscribe() {
    super.subscribe();
    this.on("updateArgs", async args => {
      if (!this._.patcher) return;

      if (typeof args[0] === "string" || typeof args[0] === "undefined") {
        const newKey = args[0];

        if (newKey !== this._.key) {
          this._.key = newKey;
          await this.reload();
        }
      }
    });
    this.on("postInit", this.reload);
    this.on("inlet", _ref2 => {
      let {
        data,
        inlet
      } = _ref2;
      return this._.patcher.fn(data, inlet);
    });
    this.on("destroy", this.unsubscribePatcher);
  }

}

_defineProperty(SubPatcher, "package", "SubPatcher");

_defineProperty(SubPatcher, "description", "Sub-patcher");

_defineProperty(SubPatcher, "args", [{
  type: "string",
  optional: true,
  default: "",
  description: "Name of the subpatcher"
}]);

_defineProperty(SubPatcher, "UI", _SubPatcherUI__WEBPACK_IMPORTED_MODULE_1__.default);

/***/ }),

/***/ "./src/core/objects/main/index.jspatpkg.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/main/index.jspatpkg.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _In__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./In */ "./src/core/objects/main/In.ts");
/* harmony import */ var _Out__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Out */ "./src/core/objects/main/Out.ts");
/* harmony import */ var _AudioIn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioIn */ "./src/core/objects/main/AudioIn.ts");
/* harmony import */ var _AudioOut__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AudioOut */ "./src/core/objects/main/AudioOut.ts");
/* harmony import */ var _SubPatcher__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SubPatcher */ "./src/core/objects/main/SubPatcher.ts");
/* harmony import */ var _FaustPatcher__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FaustPatcher */ "./src/core/objects/main/FaustPatcher.ts");
/* harmony import */ var _GenPatcher__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./GenPatcher */ "./src/core/objects/main/GenPatcher.ts");
/* harmony import */ var _BPatcher__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./BPatcher */ "./src/core/objects/main/BPatcher.ts");
/* harmony import */ var _DspSubPatcher__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DspSubPatcher */ "./src/core/objects/main/DspSubPatcher.ts");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => ({
  in: _In__WEBPACK_IMPORTED_MODULE_0__.default,
  out: _Out__WEBPACK_IMPORTED_MODULE_1__.default,
  "in~": _AudioIn__WEBPACK_IMPORTED_MODULE_2__.default,
  "out~": _AudioOut__WEBPACK_IMPORTED_MODULE_3__.default,
  patcher: _SubPatcher__WEBPACK_IMPORTED_MODULE_4__.default,
  p: _SubPatcher__WEBPACK_IMPORTED_MODULE_4__.default,
  pdsp: _DspSubPatcher__WEBPACK_IMPORTED_MODULE_8__.default,
  faustPatcher: _FaustPatcher__WEBPACK_IMPORTED_MODULE_5__.default,
  pfaust: _FaustPatcher__WEBPACK_IMPORTED_MODULE_5__.default,
  gen: _GenPatcher__WEBPACK_IMPORTED_MODULE_6__.default,
  bpatcher: _BPatcher__WEBPACK_IMPORTED_MODULE_7__.default
}));

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/base/InvalidObject.scss":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/base/InvalidObject.scss ***!
  \*******************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".patcher div.box-ui > div.package-base.package-base-invalidobject > .box-ui-text-container {\n  background-color: #804040; }\n", "",{"version":3,"sources":["webpack://./src/core/objects/base/InvalidObject.scss"],"names":[],"mappings":"AAAA;EAEQ,yBAAkC,EAAA","sourcesContent":[".patcher div.box-ui > div.package-base {\n    &.package-base-invalidobject > .box-ui-text-container {\n        background-color: rgb(128, 64, 64);\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/main/BPatcherUI.scss":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/main/BPatcherUI.scss ***!
  \****************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".patcher div.box-ui > div.package-subpatcher-bpatcher {\n  position: relative;\n  height: 100%;\n  width: 100%; }\n  .patcher div.box-ui > div.package-subpatcher-bpatcher > div > div.patcher {\n    overflow: hidden; }\n\n.patcher.locked div.box-ui > div.package-subpatcher-bpatcher {\n  overflow: hidden; }\n  .patcher.locked div.box-ui > div.package-subpatcher-bpatcher > div > div.patcher {\n    overflow: hidden; }\n", "",{"version":3,"sources":["webpack://./src/core/objects/main/BPatcherUI.scss"],"names":[],"mappings":"AAAA;EAEQ,kBAAkB;EAClB,YAAY;EACZ,WAAW,EAAA;EAJnB;IAMY,gBAAgB,EAAA;;AAN5B;EAWY,gBAAgB,EAAA;EAX5B;IAagB,gBAAgB,EAAA","sourcesContent":[".patcher {\n    & div.box-ui > div.package-subpatcher-bpatcher {\n        position: relative;\n        height: 100%;\n        width: 100%;\n        & > div > div.patcher {\n            overflow: hidden;\n        }\n    }\n    &.locked {\n        & div.box-ui > div.package-subpatcher-bpatcher {\n            overflow: hidden;\n            & > div > div.patcher {\n                overflow: hidden;\n            }\n        }\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/core/objects/base/InvalidObject.scss":
/*!**************************************************!*\
  !*** ./src/core/objects/base/InvalidObject.scss ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_InvalidObject_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/sass-loader/dist/cjs.js!./InvalidObject.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/base/InvalidObject.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_InvalidObject_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_InvalidObject_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/core/objects/main/BPatcherUI.scss":
/*!***********************************************!*\
  !*** ./src/core/objects/main/BPatcherUI.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/sass-loader/dist/cjs.js!./BPatcherUI.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/main/BPatcherUI.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ })

}]);
//# sourceMappingURL=9b3cc38265bf952cf09e.js.map