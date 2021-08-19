"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_base_EmptyObject_ts-src_core_objects_base_InvalidObject_ts-src_core_objects_-13e8d1"],{

/***/ "./src/core/objects/base/EmptyObject.ts":
/*!**********************************************!*\
  !*** ./src/core/objects/base/EmptyObject.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/core/objects/jsaw/In.ts":
/*!*************************************!*\
  !*** ./src/core/objects/jsaw/In.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/base/InvalidObject.scss":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/base/InvalidObject.scss ***!
  \*******************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".patcher div.box-ui > div.package-base.package-base-invalidobject > .box-ui-text-container {\n  background-color: #804040; }\n", "",{"version":3,"sources":["webpack://./src/core/objects/base/InvalidObject.scss"],"names":[],"mappings":"AAAA;EAEQ,yBAAkC,EAAA","sourcesContent":[".patcher div.box-ui > div.package-base {\n    &.package-base-invalidobject > .box-ui-text-container {\n        background-color: rgb(128, 64, 64);\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/core/objects/base/InvalidObject.scss":
/*!**************************************************!*\
  !*** ./src/core/objects/base/InvalidObject.scss ***!
  \**************************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_InvalidObject_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/sass-loader/dist/cjs.js!./InvalidObject.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/base/InvalidObject.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_InvalidObject_scss__WEBPACK_IMPORTED_MODULE_6__.default, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_InvalidObject_scss__WEBPACK_IMPORTED_MODULE_6__.default && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_InvalidObject_scss__WEBPACK_IMPORTED_MODULE_6__.default.locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_InvalidObject_scss__WEBPACK_IMPORTED_MODULE_6__.default.locals : undefined);


/***/ })

}]);
//# sourceMappingURL=ea41a0a95e25fbd11756.js.map