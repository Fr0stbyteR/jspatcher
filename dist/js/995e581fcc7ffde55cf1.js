"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_faust_index_jspatpkg_ts"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/faust/Diagram.scss":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/faust/Diagram.scss ***!
  \**************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, ".patcher div.box-ui > div.package-faust-diagram > div > div > svg {\n  height: 100%;\n  width: 100%;\n}", "",{"version":3,"sources":["webpack://./src/core/objects/faust/Diagram.scss"],"names":[],"mappings":"AACI;EACI,YAAA;EACA,WAAA;AAAR","sourcesContent":[".patcher div.box-ui > div.package-faust-diagram {\n    & > div > div > svg {\n        height: 100%;\n        width: 100%;\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/core/objects/faust/Diagram.ts":
/*!*******************************************!*\
  !*** ./src/core/objects/faust/Diagram.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ diagram)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
/* harmony import */ var _base_DOMUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/DOMUI */ "./src/core/objects/base/DOMUI.tsx");
/* harmony import */ var _Diagram_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Diagram.scss */ "./src/core/objects/faust/Diagram.scss");
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




class diagram extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { svg: "", container: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", async ({ data, inlet }) => {
      const faust = await this.env.getFaust();
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          try {
            this._.svg = faust.getDiagram(typeof data === "string" ? data : data.dspCode, { "-I": ["libraries/", "project/"] });
          } catch (e) {
            this.error(e);
            return;
          }
        }
        if (this._.svg) {
          this.outlet(0, this._.svg);
          const template = document.createElement("template");
          const container = document.createElement("div");
          container.addEventListener("click", (e) => {
            let target = e.target;
            while (target !== container && !(target instanceof SVGAElement)) {
              target = target.parentElement;
            }
            if (target === container)
              return;
            if (target instanceof SVGAElement) {
              e.preventDefault();
              const fileName = target.href.baseVal;
              const svg = faust.fs.readFile("FaustDSP-svg/" + fileName, { encoding: "utf8" });
              container.innerHTML = svg;
            }
          });
          template.appendChild(container);
          container.innerHTML = this._.svg;
          this._.container = container;
          this.updateUI({ children: [container] });
        }
      }
    });
  }
}
diagram.package = "Faust";
diagram.description = "Get Faust code diagram";
diagram.inlets = [{
  isHot: true,
  type: "string",
  description: "Code or FaustNode to compile, bang to output only"
}];
diagram.outlets = [{
  type: "string",
  description: "SVG code"
}];
diagram.UI = class extends _base_DOMUI__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    super(...arguments);
    this.state = __spreadProps(__spreadValues({}, this.state), { children: this.props.object._.container ? [this.props.object._.container] : [] });
  }
};


/***/ }),

/***/ "./src/core/objects/faust/LibFaust.ts":
/*!********************************************!*\
  !*** ./src/core/objects/faust/LibFaust.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ libFaust)
/* harmony export */ });
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
/* harmony import */ var _base_DefaultObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/DefaultObject */ "./src/core/objects/base/DefaultObject.ts");


class libFaust extends _base_DefaultObject__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", async ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_base_Bang__WEBPACK_IMPORTED_MODULE_0__.isBang)(data))
          this.outlet(0, await this.env.getFaust());
      }
    });
  }
}
libFaust.package = "Faust";
libFaust.description = "Get LibFaust instance";
libFaust.inlets = [{
  isHot: true,
  type: "bang",
  description: "Output LibFaust instance"
}];
libFaust.outlets = [{
  type: "object",
  description: "LibFaust instance"
}];


/***/ }),

/***/ "./src/core/objects/faust/faustUI.ts":
/*!*******************************************!*\
  !*** ./src/core/objects/faust/faustUI.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ui)
/* harmony export */ });
/* harmony import */ var _base_DOMUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/DOMUI */ "./src/core/objects/base/DOMUI.tsx");
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
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


class ui extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { node: void 0, faustUI: void 0, root: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("postInit", () => this.updateUI({ shadow: false }));
    const handleParamChangedByDSP = (e) => {
      var _a;
      (_a = this._.faustUI) == null ? void 0 : _a.paramChangeByDSP(e.detail.path, e.detail.value);
    };
    const handleDestroyDSP = (e) => {
      var _a, _b;
      (_a = e.detail.target) == null ? void 0 : _a.removeEventListener("paramChanged", handleParamChangedByDSP);
      (_b = e.detail.target) == null ? void 0 : _b.removeEventListener("destroy", handleDestroyDSP);
    };
    this.on("inlet", async ({ data, inlet }) => {
      var _a, _b;
      if (inlet === 0) {
        if (data instanceof AudioWorkletNode) {
          (_a = this._.node) == null ? void 0 : _a.removeEventListener("paramChanged", handleParamChangedByDSP);
          (_b = this._.node) == null ? void 0 : _b.removeEventListener("destroy", handleDestroyDSP);
          this._.node = data;
          const ui2 = data.getUI();
          const root = document.createElement("div");
          root.style.width = "100%";
          root.style.height = "100%";
          root.style.margin = "0";
          root.style.position = "absolute";
          root.style.overflow = "auto";
          root.style.display = "flex";
          root.style.flexDirection = "column";
          const { FaustUI } = await __webpack_require__.e(/*! import() */ "vendors-node_modules_shren_faust-ui_dist_faust-ui_js").then(__webpack_require__.t.bind(__webpack_require__, /*! @shren/faust-ui */ "./node_modules/@shren/faust-ui/dist/faust-ui.js", 23));
          const faustUI = new FaustUI({ ui: ui2, root, listenWindowMessage: false, listenWindowResize: false });
          this._.faustUI = faustUI;
          faustUI.paramChangeByUI = (path, value) => {
            this.outlet(0, { [path]: value });
          };
          if (!data.outputHandler)
            data.outputHandler = (path, value) => data.dispatchEvent(new CustomEvent("paramChanged", { detail: { path, value } }));
          data.destroy = () => {
            data.dispatchEvent(new CustomEvent("destroy", { detail: { target: data } }));
            data.port.postMessage({ type: "destroy" });
            data.port.close();
            delete data.plotHandler;
            delete data.outputHandler;
          };
          data.addEventListener("paramChanged", handleParamChangedByDSP);
          data.addEventListener("destroy", handleDestroyDSP);
          this.updateUI({ children: [root] });
          this._.root = root;
          faustUI.resize();
        }
      }
    });
    this.on("destroy", () => {
      var _a, _b;
      (_a = this._.node) == null ? void 0 : _a.removeEventListener("paramChanged", handleParamChangedByDSP);
      (_b = this._.node) == null ? void 0 : _b.removeEventListener("destroy", handleDestroyDSP);
    });
    const handleResize = () => {
      var _a;
      (_a = this._.faustUI) == null ? void 0 : _a.resize();
    };
    this.box.on("rectChanged", handleResize);
    this.box.on("presentationRectChanged", handleResize);
  }
}
ui.package = "faust";
ui.description = "Display a Faust UI";
ui.inlets = [{
  isHot: false,
  type: "object",
  description: "Compiled Faust AudioWorkletNode"
}];
ui.outlets = [{
  type: "object",
  description: "Changed parameter name-value map"
}];
ui.UI = class extends _base_DOMUI__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.state = __spreadProps(__spreadValues({}, this.state), { children: this.props.object._.root ? [this.props.object._.root] : [] });
  }
  componentDidMount() {
    var _a;
    super.componentDidMount();
    (_a = this.props.object._.faustUI) == null ? void 0 : _a.resize();
  }
};


/***/ }),

/***/ "./src/core/objects/faust/index.jspatpkg.ts":
/*!**************************************************!*\
  !*** ./src/core/objects/faust/index.jspatpkg.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FaustNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FaustNode */ "./src/core/objects/faust/FaustNode.ts");
/* harmony import */ var _Diagram__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Diagram */ "./src/core/objects/faust/Diagram.ts");
/* harmony import */ var _faustUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./faustUI */ "./src/core/objects/faust/faustUI.ts");
/* harmony import */ var _LibFaust__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LibFaust */ "./src/core/objects/faust/LibFaust.ts");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => ({
  "faustnode~": _FaustNode__WEBPACK_IMPORTED_MODULE_0__.default,
  diagram: _Diagram__WEBPACK_IMPORTED_MODULE_1__.default,
  ui: _faustUI__WEBPACK_IMPORTED_MODULE_2__.default,
  libFaust: _LibFaust__WEBPACK_IMPORTED_MODULE_3__.default
}));


/***/ }),

/***/ "./src/core/objects/faust/Diagram.scss":
/*!*********************************************!*\
  !*** ./src/core/objects/faust/Diagram.scss ***!
  \*********************************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Diagram_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/sass-loader/dist/cjs.js!./Diagram.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/faust/Diagram.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Diagram_scss__WEBPACK_IMPORTED_MODULE_6__.default, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Diagram_scss__WEBPACK_IMPORTED_MODULE_6__.default && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Diagram_scss__WEBPACK_IMPORTED_MODULE_6__.default.locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Diagram_scss__WEBPACK_IMPORTED_MODULE_6__.default.locals : undefined);


/***/ })

}]);
//# sourceMappingURL=995e581fcc7ffde55cf1.js.map