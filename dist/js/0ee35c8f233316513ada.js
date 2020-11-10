(window["webpackJsonpJSPatcher"] = window["webpackJsonpJSPatcher"] || []).push([[11],{

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/Max.scss":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/Max.scss ***!
  \****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(true);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "", "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/core/objects/Max.scss":
/*!***********************************!*\
  !*** ./src/core/objects/Max.scss ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Max_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js!./Max.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/core/objects/Max.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Max_scss__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Max_scss__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./src/core/objects/Max.tsx":
/*!**********************************!*\
  !*** ./src/core/objects/Max.tsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Max_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Max.scss */ "./src/core/objects/Max.scss");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class DefaultMaxObject extends _Base__WEBPACK_IMPORTED_MODULE_1__["DefaultObject"] {}

_defineProperty(DefaultMaxObject, "package", "Max");

_defineProperty(DefaultMaxObject, "author", "Fr0stbyteR");

_defineProperty(DefaultMaxObject, "version", "1.0.0");

_defineProperty(DefaultMaxObject, "description", "Max/MSP Objects");

class mtof extends DefaultMaxObject {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;
      const base = this.getProp("base");

      if (inlet === 0) {
        if (typeof data === "number") {
          this.outlet(0, base * 2 ** ((data - 69) / 12));
        } else if (Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["isNumberArray"])(data)) {
          this.outlet(0, data.map(n => base * 2 ** ((n - 69) / 12)));
        }
      }
    });
  }

}

_defineProperty(mtof, "description", "Convert a MIDI note number to frequency");

_defineProperty(mtof, "inlets", [{
  isHot: true,
  type: "anything",
  description: "MIDI note: number | number[]"
}]);

_defineProperty(mtof, "outlets", [{
  type: "anything",
  description: "The frequency corresponding to the received MIDI pitch value."
}]);

_defineProperty(mtof, "props", {
  base: {
    type: "number",
    default: 440,
    description: 'Sets the "base frequency" used when calculating frequency values (e.g., A = 440.). The default base frequency is 440 Hz'
  }
});

class ftom extends DefaultMaxObject {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", (_ref2) => {
      let {
        data,
        inlet
      } = _ref2;
      const base = this.getProp("base");

      if (inlet === 0) {
        if (typeof data === "number") {
          this.outlet(0, Math.log(data / base) / Math.log(2) * 12 + 69);
        } else if (Object(_utils_utils__WEBPACK_IMPORTED_MODULE_2__["isNumberArray"])(data)) {
          this.outlet(0, data.map(n => Math.log(n / base) / Math.log(2) * 12 + 69));
        }
      }
    });
  }

}

_defineProperty(ftom, "description", "Convert frequency to a MIDI note number");

_defineProperty(ftom, "inlets", [{
  isHot: true,
  type: "anything",
  description: "frequency value: number | number[]"
}]);

_defineProperty(ftom, "outlets", [{
  type: "anything",
  description: "The MIDI note value that corresponds to the input frequency."
}]);

_defineProperty(ftom, "props", {
  base: {
    type: "number",
    default: 440,
    description: 'Sets the "base frequency" used when calculating frequency values (e.g., A = 440.). The default base frequency is 440 Hz'
  }
});

/* harmony default export */ __webpack_exports__["default"] = ({
  EmptyObject: _Base__WEBPACK_IMPORTED_MODULE_1__["EmptyObject"],
  InvalidObject: _Base__WEBPACK_IMPORTED_MODULE_1__["InvalidObject"],
  ftom,
  mtof
});

/***/ })

}]);
//# sourceMappingURL=0ee35c8f233316513ada.js.map