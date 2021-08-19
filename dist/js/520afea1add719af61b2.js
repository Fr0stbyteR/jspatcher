"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_base_index_jspatpkg_ts"],{

/***/ "./src/core/objects/base/CodePopupUI.tsx":
/*!***********************************************!*\
  !*** ./src/core/objects/base/CodePopupUI.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
    const reactMonacoEditor = await Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_buffer_index_js"), __webpack_require__.e("vendors-include-loader_node_modules_monaco-editor_esm_vs_editor_editor_api_js"), __webpack_require__.e("vendors-node_modules_react-monaco-editor_lib_index_js"), __webpack_require__.e("data_image_png_base64_iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5_AAAAAXNSR0IArs4c6QAAAARnQU1-f7db0a1")]).then(__webpack_require__.bind(__webpack_require__, /*! react-monaco-editor */ "./node_modules/react-monaco-editor/lib/index.js"));
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

/***/ "./src/core/objects/base/DOMUI.tsx":
/*!*****************************************!*\
  !*** ./src/core/objects/base/DOMUI.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DivContainer": () => (/* binding */ DivContainer),
/* harmony export */   "ShadowDOMContainer": () => (/* binding */ ShadowDOMContainer),
/* harmony export */   "default": () => (/* binding */ DOMUI)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BaseUI */ "./src/core/objects/base/BaseUI.tsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class DivContainer extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent {
  constructor() {
    super(...arguments);

    _defineProperty(this, "root", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef());

    _defineProperty(this, "state", {
      root: undefined
    });
  }

  componentDidMount() {
    const root = this.root.current;
    if (this.props.children) this.props.children.forEach(v => root.appendChild(v));
    this.setState({
      root
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.root) return;

    if (this.props.children !== prevProps.children) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.root.innerHTML = "";
      this.props.children.forEach(v => this.state.root.appendChild(v));
    }
  }

  render() {
    const {
      containerProps
    } = this.props;

    const containerStyle = _objectSpread({
      width: "100%",
      height: "100%",
      position: "absolute",
      display: "block",
      overflow: "auto"
    }, containerProps && containerProps.style ? containerProps.style : {});

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", _extends({}, containerProps, {
      style: containerStyle,
      ref: this.root
    }));
  }

}
class ShadowDOMContainer extends react__WEBPACK_IMPORTED_MODULE_0__.PureComponent {
  constructor() {
    super(...arguments);

    _defineProperty(this, "root", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef());

    _defineProperty(this, "state", {
      root: undefined
    });
  }

  componentDidMount() {
    const root = this.root.current.attachShadow({
      mode: "open"
    });
    if (this.props.children) this.props.children.forEach(v => root.appendChild(v));
    this.setState({
      root
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.root) return;

    if (this.props.children !== prevProps.children) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.root.innerHTML = "";
      this.props.children.forEach(v => this.state.root.appendChild(v));
    }
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      style: {
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "block",
        overflow: "auto"
      },
      ref: this.root
    });
  }

}
class DOMUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      shadow: false,
      containerProps: {},
      children: []
    }));
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BaseUI__WEBPACK_IMPORTED_MODULE_1__.default, this.props, this.state.shadow ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ShadowDOMContainer, {
      children: this.state.children
    }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DivContainer, {
      containerProps: this.state.containerProps,
      children: this.state.children
    }));
  }

}

_defineProperty(DOMUI, "sizing", "both");

_defineProperty(DOMUI, "defaultSize", [210, 90]);

/***/ }),

/***/ "./src/core/objects/base/index.jspatpkg.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/base/index.jspatpkg.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/core/objects/main/AudioIn.ts":
/*!******************************************!*\
  !*** ./src/core/objects/main/AudioIn.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/core/objects/main/Buffer.ts":
/*!*****************************************!*\
  !*** ./src/core/objects/main/Buffer.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Buffer)
/* harmony export */ });
/* harmony import */ var _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../audio/PatcherAudio */ "./src/core/audio/PatcherAudio.ts");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
/* harmony import */ var _base_DefaultObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
/* harmony import */ var _BufferUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BufferUI */ "./src/core/objects/main/BufferUI.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class Buffer extends _base_DefaultObject__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    var _this$box$args$;

    super(...arguments);

    _defineProperty(this, "_", {
      key: (_this$box$args$ = this.box.args[0]) === null || _this$box$args$ === void 0 ? void 0 : _this$box$args$.toString(),
      audio: undefined,
      file: undefined,
      numberOfChannels: 1,
      length: this.audioCtx.sampleRate,
      sampleRate: this.audioCtx.sampleRate
    });
  }

  subscribe() {
    super.subscribe();

    const assertBuffer = audio => {
      if (!audio) return false;
      const {
        numberOfChannels,
        length,
        sampleRate
      } = this._;
      return audio.numberOfChannels === numberOfChannels && audio.length === length && audio.sampleRate === sampleRate;
    };

    const handleFilePathChanged = () => {
      var _this$_$file;

      this._.key = (_this$_$file = this._.file) === null || _this$_$file === void 0 ? void 0 : _this$_$file.projectPath;
    };

    const handleSaved = async e => {
      if (e.instance === this._.audio) return;
      await reload();
    };

    const subsribeItem = async () => {
      const {
        audio,
        file
      } = this._;
      await audio.addObserver(this);

      if (file) {
        file.on("destroyed", reload);
        file.on("nameChanged", handleFilePathChanged);
        file.on("pathChanged", handleFilePathChanged);
        file.on("saved", handleSaved);
      }
    };

    const unsubscribeItem = async () => {
      const {
        audio,
        file
      } = this._;

      if (file) {
        file.off("destroyed", reload);
        file.off("nameChanged", handleFilePathChanged);
        file.off("pathChanged", handleFilePathChanged);
        file.off("saved", handleSaved);
      }

      await audio.removeObserver(this);
    };

    const reload = async () => {
      if (this._.audio) await unsubscribeItem();
      const {
        key
      } = this._;
      let audio;

      try {
        const {
          item,
          newItem
        } = await this.getSharedItem(key, "audio", async () => {
          const {
            numberOfChannels,
            length,
            sampleRate
          } = this._;
          audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_0__.default.fromSilence({
            env: this.env,
            project: this.patcher.project
          }, numberOfChannels, length, sampleRate);
          return audio;
        });

        if (newItem) {
          audio.file = item;
        } else {
          audio = await item.instantiate({
            env: this.env,
            project: this.patcher.project
          });
        }

        this._.audio = audio;
        this._.file = item;
        this.updateUI({
          audio
        });
      } catch (error) {
        this.error(error);
      } finally {
        await subsribeItem();
        this.outlet(1, new _base_Bang__WEBPACK_IMPORTED_MODULE_1__.default());
      }
    };

    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      var _args$;

      if (!this._.audio) return;
      const oldKey = this._.key;
      const key = (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.toString();
      const numberOfChannels = typeof args[1] === "number" ? ~~args[1] : 1;
      const length = typeof args[2] === "number" ? ~~args[2] : this.audioCtx.sampleRate;
      const sampleRate = typeof args[3] === "number" ? ~~args[3] : this.audioCtx.sampleRate;
      Object.assign(this._, {
        key,
        numberOfChannels,
        length,
        sampleRate
      });

      if (key !== oldKey || !assertBuffer(this._.audio)) {
        reload();
      }
    });
    this.on("postInit", reload);
    this.on("inlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          if (data instanceof _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_0__.default) {
            this._.audio.setAudio(data);
          } else if (data instanceof AudioBuffer) {
            const audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_0__.default.fromNativeAudioBuffer({
              env: this.env,
              project: this.patcher.project
            }, data);

            this._.audio.setAudio(audio);
          } else {
            let audioBuffer;

            try {
              const ab = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
              audioBuffer = await this.patcher.audioCtx.decodeAudioData(ab);
            } catch (e) {
              this.error("Decode File failed.");
              return;
            }

            const audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_0__.default.fromNativeAudioBuffer({
              env: this.env,
              project: this.patcher.project
            }, audioBuffer);

            this._.audio.setAudio(audio);
          }
        }

        this.outlet(0, this._.audio);
      } else if (inlet === 1) {
        if (data instanceof _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_0__.default) {
          this._.audio.setAudio(data);
        } else if (data instanceof AudioBuffer) {
          const audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_0__.default.fromNativeAudioBuffer({
            env: this.env,
            project: this.patcher.project
          }, data);

          this._.audio.setAudio(audio);
        } else {
          let audioBuffer;

          try {
            const ab = data instanceof ArrayBuffer ? data : await data.arrayBuffer();
            audioBuffer = await this.patcher.audioCtx.decodeAudioData(ab);
          } catch (e) {
            this.error("Decode File failed.");
            return;
          }

          const audio = await _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_0__.default.fromNativeAudioBuffer({
            env: this.env,
            project: this.patcher.project
          }, audioBuffer);

          this._.audio.setAudio(audio);
        }
      } else if (inlet === 2) {
        if (typeof data === "string" || typeof data === "number") {
          this._.key = data === null || data === void 0 ? void 0 : data.toString();
          reload();
        }
      }
    });
    this.on("destroy", unsubscribeItem);
  }

}

_defineProperty(Buffer, "package", "WebAudio");

_defineProperty(Buffer, "icon", "volume up");

_defineProperty(Buffer, "author", "Fr0stbyteR");

_defineProperty(Buffer, "version", "1.0.0");

_defineProperty(Buffer, "description", "Audio File Decoder");

_defineProperty(Buffer, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Bang to output stored buffer, file to decode, AudioBuffer or PatcherAudio to store then output it as PatcherAudio."
}, {
  isHot: false,
  type: "anything",
  description: "File to decode, AudioBuffer or PatcherAudio to store the buffer."
}, {
  isHot: false,
  type: "anything",
  description: "Set variable name."
}]);

_defineProperty(Buffer, "outlets", [{
  type: "anything",
  description: "PatcherAudio"
}, {
  type: "bang",
  description: "Output a bang while the PatcherAudio buffer object is loaded/changed."
}]);

_defineProperty(Buffer, "args", [{
  type: "anything",
  optional: true,
  description: "Variable name"
}, {
  type: "number",
  optional: true,
  description: "Initialize buffer's number of channels"
}, {
  type: "number",
  optional: true,
  description: "Initialize buffer's length in samples"
}, {
  type: "number",
  optional: true,
  description: "Initialize buffer's sample rate"
}]);

_defineProperty(Buffer, "UI", _BufferUI__WEBPACK_IMPORTED_MODULE_3__.default);

/***/ }),

/***/ "./src/core/objects/main/BufferUI.tsx":
/*!********************************************!*\
  !*** ./src/core/objects/main/BufferUI.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BufferUI)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/modules/Modal/Modal.js");
/* harmony import */ var _components_editors_audio_AudioEditorUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/editors/audio/AudioEditorUI */ "./src/components/editors/audio/AudioEditorUI.tsx");
/* harmony import */ var _audio_AudioEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../audio/AudioEditor */ "./src/core/audio/AudioEditor.ts");
/* harmony import */ var _base_DefaultPopupUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../base/DefaultPopupUI */ "./src/core/objects/base/DefaultPopupUI.tsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class BufferUI extends _base_DefaultPopupUI__WEBPACK_IMPORTED_MODULE_3__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      audio: this.object._.audio,
      timestamp: performance.now(),
      editor: undefined,
      dockEditor: undefined
    }));

    _defineProperty(this, "handleChanged", () => {
      const editor = this.props.inDock ? this.state.editor : this.state.dockEditor;
      if (editor.isTemporary) editor.save();
    });

    _defineProperty(this, "handleDoubleClick", async () => {
      if (!this.editor.state.locked) return;
      if (!this.state.audio) return;
      this.unloadEditor();
      await this.loadEditor();
      this.setState({
        modalOpen: true
      });
    });

    _defineProperty(this, "handleClose", () => {
      this.unloadEditor();
      this.setState({
        modalOpen: false
      });
    });

    _defineProperty(this, "handleMouseDownModal", e => e.stopPropagation());
  }

  async loadEditor() {
    const key = this.props.inDock ? "editor" : "dockEditor";
    const editor = new _audio_AudioEditor__WEBPACK_IMPORTED_MODULE_2__.default(this.object._.audio);
    await editor.init();
    editor.on("changed", this.handleChanged);
    this.setState({
      timestamp: performance.now(),
      [key]: editor
    }, () => editor.setActive());
  }

  unloadEditor() {
    const key = this.props.inDock ? "editor" : "dockEditor";
    const editor = this.state[key];
    if (!editor) return;
    editor.off("changed", this.handleChanged);
    editor.destroy();
    this.setState({
      timestamp: performance.now(),
      [key]: undefined
    }, () => this.props.editor.setActive());
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.inDock) this.loadEditor();
  }

  componentDidUpdate(prevProps, prevState) {
    const key = this.props.inDock ? "editor" : "dockEditor";
    const editor = this.state[key];

    if (prevState.audio !== this.state.audio) {
      if (editor) {
        this.unloadEditor();
        this.loadEditor();
      }
    }

    if (prevProps.inDock !== this.props.inDock) {
      if (this.props.inDock) {
        this.loadEditor();
      } else {
        if (editor) {
          this.unloadEditor();
        }
      }
    }

    if (editor) {
      if (prevState.width !== this.state.width || prevState.height !== this.state.height) {
        editor.onUiResized();
      }
    }

    super.componentDidUpdate(prevProps, prevState);
  }

  componentWillUnmount() {
    this.unloadEditor();
    super.componentWillUnmount();
  }

  render() {
    const editor = this.props.inDock ? this.state.editor : this.state.dockEditor;
    const content = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "editor-container",
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        position: "relative"
      }
    }, editor ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_editors_audio_AudioEditorUI__WEBPACK_IMPORTED_MODULE_1__.default, {
      key: this.state.timestamp,
      editor: editor,
      env: this.env,
      lang: this.env.language
    }) : undefined);
    const children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_4__.default.Content, {
      style: {
        height: "100%",
        width: "100%",
        position: "relative"
      },
      onMouseDown: this.handleMouseDownModal
    }, content);
    if (this.props.inDock) return children;

    const containerProps = _objectSpread({}, this.props.containerProps);

    if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;

    const modalProps = _objectSpread(_objectSpread({}, this.props.modalProps), {}, {
      children,
      className: "audio-editor",
      open: this.state.modalOpen,
      onClose: this.handleClose,
      onKeyDown: undefined,
      basic: true,
      size: "fullscreen",
      closeIcon: true
    });

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_base_DefaultPopupUI__WEBPACK_IMPORTED_MODULE_3__.default, _extends({}, this.props, {
      modalProps: modalProps,
      containerProps: containerProps
    }));
  }

}

_defineProperty(BufferUI, "dockable", true);

/***/ }),

/***/ "./src/core/objects/main/DspSubPatcher.ts":
/*!************************************************!*\
  !*** ./src/core/objects/main/DspSubPatcher.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_generateDefaultObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/generateDefaultObject */ "./src/core/objects/base/generateDefaultObject.ts");
/* harmony import */ var _jsaw_Out__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../jsaw/Out */ "./src/core/objects/jsaw/Out.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_base_generateDefaultObject__WEBPACK_IMPORTED_MODULE_0__.default)(_jsaw_Out__WEBPACK_IMPORTED_MODULE_1__.default));

/***/ }),

/***/ "./src/core/objects/main/Record.ts":
/*!*****************************************!*\
  !*** ./src/core/objects/main/Record.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Record)
/* harmony export */ });
/* harmony import */ var _worklets_Transmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../worklets/Transmitter */ "./src/core/worklets/Transmitter.ts");
/* harmony import */ var _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../audio/PatcherAudio */ "./src/core/audio/PatcherAudio.ts");
/* harmony import */ var _audio_OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../audio/OperableAudioBuffer */ "./src/core/audio/OperableAudioBuffer.ts");
/* harmony import */ var _base_DefaultObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../base/DefaultObject */ "./src/core/objects/base/DefaultObject.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class Record extends _base_DefaultObject__WEBPACK_IMPORTED_MODULE_3__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      node: undefined,
      audio: undefined,
      dummyNode: this.audioCtx.createConstantSource(),
      // overwrittenAudio: undefined,
      recording: false,
      $: 0,
      $start: 0,
      $end: 0,
      inPlace: true
    });

    _defineProperty(this, "handleReceiveBuffer", async (bufferIn, $total) => {
      if (!this._.recording) return;
      const {
        $,
        audio
      } = this._;
      const {
        length,
        numberOfChannels,
        sampleRate
      } = audio;
      const mono = this.getProp("mono");
      const channelOffset = this.getProp("channelOffset");
      const loop = this.getProp("loop");
      const append = this.getProp("append");
      const $start = loop ? this.getProp("loopStart") : 0;
      if ($start >= length) return;
      const $end = loop ? Math.max($start, this.getProp("loopEnd")) : length;
      if ($end === $start) return;
      const range = $end - $start;
      const bufferSize = bufferIn[0].length;
      if (mono) bufferIn.splice(1);
      if (channelOffset) bufferIn.unshift(...new Array(channelOffset));
      const $target = $ + bufferSize;

      if (append && !loop && $target > $end) {
        // extend current buffer
        const newLength = 2 ** Math.ceil(Math.log(length + sampleRate) / Math.log(2));
        const newBuffer = new _audio_OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_2__.default({
          numberOfChannels,
          length: newLength,
          sampleRate
        });

        for (let i = 0; i < numberOfChannels; i++) {
          const channel = newBuffer.getChannelData(i);
          channel.set(audio.audioBuffer.getChannelData(i));
          if (bufferIn[i]) channel.set(bufferIn[i], $);
        }

        audio.audioBuffer = newBuffer;
        audio.waveform.update($, newLength);
        this._.$ = $target;
      } else {
        for (let i = 0; i < numberOfChannels; i++) {
          const channel = audio.audioBuffer.getChannelData(i);

          if (bufferIn[i]) {
            if ($target > $end) {
              if (loop) {
                const $copyEnd = $start + ($ - $start + bufferSize) % range;
                const buffer = bufferSize > range ? bufferIn[i].subarray(bufferSize - range) : bufferIn[i];
                const $sSplit = buffer.length - ($copyEnd - $start);
                channel.set(buffer.subarray($sSplit), $start);
                channel.set(buffer.subarray(0, $sSplit), $);
                this._.$ = $copyEnd;
                audio.waveform.update($, $end);
                audio.waveform.update($start, $copyEnd);
              } else {
                channel.set(bufferIn[i].subarray(0, $end - $), $);
                this._.$ = $end;
                audio.waveform.update($, $end);
              }
            } else {
              channel.set(bufferIn[i], $);
              this._.$ = $target;
              audio.waveform.update($, $target);
            }
          }
        }
      }

      audio.emit("setAudio");
      audio.emit("changed");
      this.outlet(0, this._.$);

      if (!append && !loop && this._.$ === $end) {
        await this.stop();
      }
    });
  }

  set node(nodeIn) {
    this._.node = nodeIn;
  }

  get node() {
    return this._.node;
  }

  async start() {
    if (!this.node) return false;
    this._.$ = this.getProp("loop") ? this.getProp("loopStart") : 0;
    this._.recording = true;
    await this.node.reset();
    await this.node.start();
    return true;
  }

  async stop() {
    this._.recording = false;
    if (!this.node) return;
    await this.node.stop();
    const {
      inPlace,
      $,
      $end
    } = this._;

    if (!inPlace && $ > $end && $ < this._.audio.length) {
      const [audio] = await this._.audio.split($);

      this._.audio.setAudio(audio);
    }
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 4;
      this.outlets = 1;
    });
    this.on("postInit", async () => {
      await _worklets_Transmitter__WEBPACK_IMPORTED_MODULE_0__.default.register(this.audioCtx.audioWorklet);
      const node = new _worklets_Transmitter__WEBPACK_IMPORTED_MODULE_0__.default(this.audioCtx);
      node.handleReceiveBuffer = this.handleReceiveBuffer;
      this.node = node;
      this._.dummyNode.offset.value = 0;

      this._.dummyNode.connect(this.node);

      this._.dummyNode.start();

      this.disconnectAudioInlet();
      this.inletAudioConnections = [{
        node: this.node,
        index: 0
      }];
      this._.node = node;
      this.connectAudioInlet();
    });
    this.on("inlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (typeof data === "boolean" || typeof data === "number") {
          if (data) {
            if (!this._.recording) {
              await this.start();
            }
          } else {
            if (this._.recording) {
              await this.stop();
            }
          }
        } else if (data instanceof _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default) {
          this._.audio = data;
        }
      } else if (inlet === 1) {
        if (typeof data === "boolean" || typeof data === "number") {
          this.setProps({
            loop: !!data
          });
        }
      } else if (inlet === 2) {
        if (typeof data === "number") {
          this.setProps({
            loopStart: data
          });
        }
      } else if (inlet === 3) {
        if (typeof data === "number") {
          this.setProps({
            loopEnd: data
          });
        }
      }
    });
    this.on("destroy", async () => {
      this._.dummyNode.disconnect();

      if (this._.recording) await this.stop();
      await this.node.destroy();
    });
  }

}

_defineProperty(Record, "description", "Record audio into an audio buffer");

_defineProperty(Record, "icon", "volume up");

_defineProperty(Record, "inlets", [{
  isHot: true,
  type: "signal",
  description: "signal to record, boolean/number to start/stop, AudioBuffer/PatcherAudio to set buffer"
}, {
  isHot: false,
  type: "boolean",
  description: "loop"
}, {
  isHot: false,
  type: "number",
  description: "loopStart (seconds)"
}, {
  isHot: false,
  type: "number",
  description: "loopEnd (seconds)"
}]);

_defineProperty(Record, "outlets", [{
  type: "number",
  description: "sample index writted"
}]);

_defineProperty(Record, "props", {
  mono: {
    type: "boolean",
    default: false,
    description: "Record only one channel"
  },
  channelOffset: {
    type: "number",
    default: 0,
    description: "Record into channels with offset"
  },
  loop: {
    type: "boolean",
    default: false,
    description: "Initial loop, Indicates if the region of audio data designated by loopStart and loopEnd should be played continuously in a loop"
  },
  loopStart: {
    type: "number",
    default: 0,
    description: "An optional playhead position where looping should begin if the loop attribute is true. If <=0 or > duration, loop will end at the end of the buffer."
  },
  loopEnd: {
    type: "number",
    default: 0,
    description: "An optional playhead position where looping should end if the loop attribute is true. If <=0 or > duration, loop will end at the end of the buffer."
  },
  append: {
    type: "boolean",
    default: false,
    description: "Allows buffer to growth when recording exceeds the end."
  }
});

/***/ }),

/***/ "./src/core/objects/main/SubPatcher.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/main/SubPatcher.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/core/objects/main/WebAudioModule.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/main/WebAudioModule.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Plugin)
/* harmony export */ });
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _base_DOMUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/DOMUI */ "./src/core/objects/base/DOMUI.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class PluginUI extends _base_DOMUI__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      children: this.object._.children
    }));
  }

}

class Plugin extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      merger: undefined,
      splitter: undefined,
      node: undefined,
      plugin: undefined,
      children: []
    });

    _defineProperty(this, "handleDestroy", () => {
      const {
        node,
        plugin
      } = this._;

      if (node) {
        node.disconnect();
        node.disconnectEvents();
      }

      if (plugin) {
        var _this$_$children;

        plugin.audioNode.destroy();
        if ((_this$_$children = this._.children) !== null && _this$_$children !== void 0 && _this$_$children[0]) plugin.destroyGui(this._.children[0]);
      }
    });

    _defineProperty(this, "handlePreInit", () => undefined);

    _defineProperty(this, "handlePostInit", async () => {
      await this.handleUpdateArgs(this.args);
    });

    _defineProperty(this, "handleUpdateArgs", async args => {
      if (typeof args[0] === "string") await this.load(this.box.args[0]);
    });

    _defineProperty(this, "handleInlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_base_Bang__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          if (this._.node) this.outlet(this.outlets - 1, this._.node);
        } else if (typeof data === "string") {
          await this.load(data);
        } else if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.isMIDIEvent)(data)) {
          const bytes = Array.from(data);
          if (this._.node) this._.node.scheduleEvents({
            type: "wam-midi",
            data: {
              bytes
            },
            time: this.audioCtx.currentTime
          });
        } else if (typeof data === "object") {
          if (this._.node) {
            for (const key in data) {
              try {
                const bpf = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.decodeLine)(data[key]);
                let t = 0;
                bpf.forEach(a => {
                  if (a.length > 1) t += a[1];

                  this._.node.scheduleEvents({
                    type: "wam-automation",
                    data: {
                      id: key,
                      value: a[0],
                      normalized: false
                    },
                    time: this.audioCtx.currentTime + t
                  });
                }); // else this._.node.setParam(key, bpf[bpf.length - 1][0]);
              } catch (e) {
                this.error(e.message);
              }
            }
          }
        }
      } else {
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
  }

  async load(url) {
    let WAPCtor;
    let plugin;

    try {
      WAPCtor = (await import(
      /* webpackIgnore: true */
      url)).default;
    } catch (e) {
      this.error(e.message);
    }

    let node;
    let element;

    try {
      plugin = await WAPCtor.createInstance(this.audioCtx);
      node = plugin.audioNode;
      element = await plugin.createGui();
    } catch (e) {
      if (e) this.error(e.message);
      return;
    }

    this.disconnectAudio();
    this.handleDestroy();
    element.style.width = "100%";
    element.style.height = "100%";
    element.style.position = "absolute";
    this._.children = [element];
    this.updateUI({
      children: this._.children
    });
    node.channelInterpretation = "discrete";
    const inlets = node.numberOfInputs;
    const outlets = node.numberOfOutputs;
    Object.assign(this._, {
      node,
      plugin
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
      type: "number",
      description: ": bpf or node connection"
    };
    const outletMeta = {
      type: "signal",
      description: "Node connection"
    };
    const lastOutletMeta = Ctor.outlets[0];
    const factoryMeta = Ctor.meta;

    for (let i = 0; i < inlets; i++) {
      if (i === 0) factoryMeta.inlets[i] = inlets ? firstInletSignalMeta : firstInletMeta;else factoryMeta.inlets[i] = inletMeta;
      this.inletAudioConnections[i] = {
        node,
        index: i
      };
    }

    for (let i = 0; i < outlets; i++) {
      factoryMeta.outlets[i] = outletMeta;
      this.outletAudioConnections[i] = {
        node,
        index: i
      };
    }

    factoryMeta.outlets[outlets] = lastOutletMeta;
    const paramInfo = await plugin.audioNode.getParameterInfo();
    const params = Object.keys(paramInfo);

    for (let i = inlets || 1; i < (inlets || 1) + params.length; i++) {
      const path = params[i - (inlets || 1)];
      const param = paramInfo[path];
      const {
        defaultValue,
        minValue,
        maxValue
      } = param;
      factoryMeta.inlets[i] = _objectSpread(_objectSpread({}, audioParamInletMeta), {}, {
        description: "".concat(path).concat(audioParamInletMeta.description, ": ").concat(defaultValue, " (").concat(minValue, " - ").concat(maxValue, ")")
      });
    }

    this.setMeta(factoryMeta);
    this.inlets = (inlets || 1) + params.length;
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

_defineProperty(Plugin, "description", "Dynamically load WebAudioModule");

_defineProperty(Plugin, "inlets", [{
  isHot: true,
  type: "anything",
  description: "A bang to output the instance, url to load, or a param-bpf map, or a MIDI event"
}]);

_defineProperty(Plugin, "outlets", [{
  type: "object",
  description: "WebAudioModule instance"
}]);

_defineProperty(Plugin, "args", [{
  type: "string",
  optional: false,
  description: "WebAudioModule URL"
}]);

_defineProperty(Plugin, "UI", PluginUI);

/***/ }),

/***/ "./src/core/objects/main/index.jspatpkg.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/main/index.jspatpkg.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var _Buffer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Buffer */ "./src/core/objects/main/Buffer.ts");
/* harmony import */ var _Record__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Record */ "./src/core/objects/main/Record.ts");
/* harmony import */ var _WebAudioModule__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./WebAudioModule */ "./src/core/objects/main/WebAudioModule.ts");












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
  bpatcher: _BPatcher__WEBPACK_IMPORTED_MODULE_7__.default,
  "buffer~": _Buffer__WEBPACK_IMPORTED_MODULE_9__.default,
  "record~": _Record__WEBPACK_IMPORTED_MODULE_10__.default,
  "plugin~": _WebAudioModule__WEBPACK_IMPORTED_MODULE_11__.default
}));

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/main/BPatcherUI.scss":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/main/BPatcherUI.scss ***!
  \****************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/core/objects/main/BPatcherUI.scss":
/*!***********************************************!*\
  !*** ./src/core/objects/main/BPatcherUI.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/sass-loader/dist/cjs.js!./BPatcherUI.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/main/BPatcherUI.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_6__.default, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_6__.default && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_6__.default.locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_BPatcherUI_scss__WEBPACK_IMPORTED_MODULE_6__.default.locals : undefined);


/***/ })

}]);
//# sourceMappingURL=520afea1add719af61b2.js.map