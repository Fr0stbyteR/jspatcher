/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "author": () => (/* binding */ author),
/* harmony export */   "license": () => (/* binding */ license),
/* harmony export */   "keywords": () => (/* binding */ keywords),
/* harmony export */   "version": () => (/* binding */ version),
/* harmony export */   "description": () => (/* binding */ description),
/* harmony export */   "jspatcher": () => (/* binding */ jspatcher),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _package_info__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./package-info */ "./src/package-info.ts");
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

const name = _package_info__WEBPACK_IMPORTED_MODULE_0__.default.name.split("/").pop().replace(/^package-/, "");
const { author, license, keywords, version, description, jspatcher } = _package_info__WEBPACK_IMPORTED_MODULE_0__.default;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__spreadValues({ name, author, license, keywords, version, description }, jspatcher));


/***/ }),

/***/ "./src/objects/arr-binary.ts":
/*!***********************************!*\
  !*** ./src/objects/arr-binary.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Binary)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");


class Binary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { arg: this.args[0], result: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", (args) => {
      this._.arg = void 0;
      this._.result = void 0;
      if (!args || args.length === 0)
        return;
      this._.arg = args[0];
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            this._.result = this.execute(data, this._.arg);
          } catch (e) {
            this.error(e);
            return;
          }
        }
        this.outlet(0, this._.result);
      } else if (inlet === 1) {
        this._.arg = data;
      }
    });
  }
}
Binary.description = "Binary Operation for Array";
Binary.inlets = [{
  isHot: true,
  type: "anything",
  description: "First array"
}, {
  isHot: false,
  type: "anything",
  description: "Second element or array"
}];
Binary.outlets = [{
  type: "anything",
  description: "Result"
}];
Binary.args = [{
  type: "anything",
  optional: true,
  default: 0,
  description: "Initial second element or array"
}];


/***/ }),

/***/ "./src/objects/arr-ternary.ts":
/*!************************************!*\
  !*** ./src/objects/arr-ternary.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ternary)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");


class Ternary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { args: [this.args.length ? this.args[0] : true, this.args.length > 1 ? this.args[1] : false], result: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 1;
    });
    this.on("updateArgs", (args) => {
      this._.args = [args.length ? args[0] : true, args.length > 1 ? args[1] : false];
      this._.result = void 0;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            if (Array.isArray(data)) {
              const result = [];
              const trueArray = this._.args[0];
              const falseArray = this._.args[1];
              const length = Math.min(data.length, Array.isArray(trueArray) ? trueArray.length : data.length, Array.isArray(falseArray) ? falseArray.length : data.length);
              for (let i = 0; i < length; i++) {
                result[i] = data[i] ? Array.isArray(trueArray) ? trueArray[i] : trueArray : Array.isArray(falseArray) ? falseArray[i] : falseArray;
              }
              this._.result = result;
            } else {
              this._.result = data ? this._.args[0] : this._.args[1];
            }
          } catch (e) {
            this.error(e);
            return;
          }
        }
        this.outlet(0, this._.result);
      } else if (inlet === 1) {
        this._.args[0] = data;
      } else if (inlet === 2) {
        this._.args[1] = data;
      }
    });
  }
}
Ternary.description = "Ternary Operation for array";
Ternary.inlets = [{
  isHot: true,
  type: "anything",
  description: "Test array"
}, {
  isHot: false,
  type: "anything",
  description: "True output array"
}, {
  isHot: false,
  type: "anything",
  description: "False output array"
}];
Ternary.outlets = [{
  type: "anything",
  description: "Result"
}];
Ternary.args = [{
  type: "anything",
  optional: true,
  default: true,
  description: "Initial true output"
}, {
  type: "anything",
  optional: true,
  default: false,
  description: "Initial false output"
}];


/***/ }),

/***/ "./src/objects/arr-unary.ts":
/*!**********************************!*\
  !*** ./src/objects/arr-unary.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ArrUnary)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");


class ArrUnary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { result: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("updateArgs", () => this._.result = void 0);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            this._.result = this.execute(data);
          } catch (e) {
            this.error(e);
            return;
          }
        }
        this.outlet(0, this._.result);
      }
    });
  }
}
ArrUnary.description = "Unary Operation for Array";
ArrUnary.inlets = [{
  isHot: true,
  type: "anything",
  description: "Array in"
}];
ArrUnary.outlets = [{
  type: "anything",
  description: "Result"
}];


/***/ }),

/***/ "./src/objects/base.ts":
/*!*****************************!*\
  !*** ./src/objects/base.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Op)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class Op extends _sdk__WEBPACK_IMPORTED_MODULE_1__.BaseObject {
}
Op.package = _index__WEBPACK_IMPORTED_MODULE_0__.name;
Op.author = _index__WEBPACK_IMPORTED_MODULE_0__.author;
Op.version = _index__WEBPACK_IMPORTED_MODULE_0__.version;
Op.description = _index__WEBPACK_IMPORTED_MODULE_0__.description;


/***/ }),

/***/ "./src/objects/binary.ts":
/*!*******************************!*\
  !*** ./src/objects/binary.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Binary)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");


class Binary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { arg: this.args[0], result: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", (args) => {
      this._.arg = void 0;
      this._.result = void 0;
      if (!args || args.length === 0)
        return;
      this._.arg = args[0];
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            this._.result = this.execute(data, this._.arg);
          } catch (e) {
            this.error(e);
            return;
          }
        }
        this.outlet(0, this._.result);
      } else if (inlet === 1) {
        this._.arg = data;
      }
    });
  }
}
Binary.description = "Binary Operation";
Binary.inlets = [{
  isHot: true,
  type: "anything",
  description: "First element"
}, {
  isHot: false,
  type: "anything",
  description: "Second element"
}];
Binary.outlets = [{
  type: "anything",
  description: "Result"
}];
Binary.args = [{
  type: "anything",
  optional: true,
  default: 0,
  description: "Initial second element"
}];


/***/ }),

/***/ "./src/objects/function-names.ts":
/*!***************************************!*\
  !*** ./src/objects/function-names.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const functions = {
  "+": "Add",
  "-": "Sub",
  "!-": "$Sub",
  "*": "Mul",
  "/": "Div",
  "!/": "$Div",
  "**": "Exp",
  "!**": "$Exp",
  "%": "Mod",
  "!%": "$Mod",
  "++": "Inc",
  "--": "Dec",
  "==": "Eql",
  "===": "EqlS",
  "!=": "NEql",
  "!==": "NEqlS",
  ">": "Gtr",
  ">=": "Geq",
  "<": "Lss",
  "<=": "Leq",
  "&&": "And",
  "||": "Or",
  "!": "Not",
  "!!": "ToBoolean",
  "&": "BAnd",
  "|": "BOr",
  "^": "BXor",
  "~": "BNot",
  "~~": "BitTrunk",
  "<<": "BLS",
  ">>": "BRS",
  ">>>": "BRSZ",
  "typeof": "typeof",
  "instanceof": "instanceof",
  "void": "void",
  "in": "in"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (functions);


/***/ }),

/***/ "./src/objects/functions.ts":
/*!**********************************!*\
  !*** ./src/objects/functions.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const functions = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "!-": (a, b) => b - a,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "!/": (a, b) => b / a,
  "**": (a, b) => a ** b,
  "!**": (a, b) => b ** a,
  "%": (a, b) => a % b,
  "!%": (a, b) => b % a,
  "++": (a) => ++a,
  "--": (a) => --a,
  "==": (a, b) => a == b,
  "===": (a, b) => a === b,
  "!=": (a, b) => a != b,
  "!==": (a, b) => a !== b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  "&&": (a, b) => a && b,
  "||": (a, b) => a || b,
  "!": (a) => !a,
  "!!": (a) => !!a,
  "&": (a, b) => a & b,
  "|": (a, b) => a | b,
  "^": (a, b) => a ^ b,
  "~": (a) => ~a,
  "~~": (a) => ~~a,
  "<<": (a, b) => a << b,
  ">>": (a, b) => a >> b,
  ">>>": (a, b) => a >>> b,
  "typeof": (a) => typeof a,
  "instanceof": (a, b) => a instanceof b,
  "void": (a) => void 0,
  "in": (a, b) => a in b
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (functions);


/***/ }),

/***/ "./src/objects/ternary.ts":
/*!********************************!*\
  !*** ./src/objects/ternary.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ternary)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");


class Ternary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { args: [this.args.length ? this.args[0] : true, this.args.length > 1 ? this.args[1] : false], result: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 1;
    });
    this.on("updateArgs", (args) => {
      this._.args = [args.length ? args[0] : true, args.length > 1 ? args[1] : false];
      this._.result = void 0;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            this._.result = data ? this._.args[0] : this._.args[1];
          } catch (e) {
            this.error(e);
            return;
          }
        }
        this.outlet(0, this._.result);
      } else if (inlet === 1) {
        this._.args[0] = data;
      } else if (inlet === 2) {
        this._.args[1] = data;
      }
    });
  }
}
Ternary.description = "Ternary Operation";
Ternary.inlets = [{
  isHot: true,
  type: "anything",
  description: "Test"
}, {
  isHot: false,
  type: "anything",
  description: "True output"
}, {
  isHot: false,
  type: "anything",
  description: "False output"
}];
Ternary.outlets = [{
  type: "anything",
  description: "Result"
}];
Ternary.args = [{
  type: "anything",
  optional: true,
  default: true,
  description: "Initial true output"
}, {
  type: "anything",
  optional: true,
  default: false,
  description: "Initial false output"
}];


/***/ }),

/***/ "./src/objects/unary.ts":
/*!******************************!*\
  !*** ./src/objects/unary.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Unary)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");


class Unary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { result: void 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("updateArgs", () => this._.result = void 0);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            this._.result = this.execute(data);
          } catch (e) {
            this.error(e);
            return;
          }
        }
        this.outlet(0, this._.result);
      }
    });
  }
}
Unary.description = "Unary Operation";
Unary.inlets = [{
  isHot: true,
  type: "anything",
  description: "First element"
}];
Unary.outlets = [{
  type: "anything",
  description: "Result"
}];


/***/ }),

/***/ "./src/package-info.ts":
/*!*****************************!*\
  !*** ./src/package-info.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

var _package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../package.json */ "./package.json");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/*#__PURE__*/ (_package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (_package_json__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(_package_json__WEBPACK_IMPORTED_MODULE_0__, 2))));


/***/ }),

/***/ "./src/sdk.ts":
/*!********************!*\
  !*** ./src/sdk.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "React": () => (/* binding */ React),
/* harmony export */   "Patcher": () => (/* binding */ Patcher),
/* harmony export */   "Box": () => (/* binding */ Box),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "BaseObject": () => (/* binding */ BaseObject),
/* harmony export */   "BaseUI": () => (/* binding */ BaseUI),
/* harmony export */   "DefaultObject": () => (/* binding */ DefaultObject),
/* harmony export */   "DefaultUI": () => (/* binding */ DefaultUI),
/* harmony export */   "generateRemotedObject": () => (/* binding */ generateRemotedObject),
/* harmony export */   "generateDefaultObject": () => (/* binding */ generateDefaultObject),
/* harmony export */   "generateRemoteObject": () => (/* binding */ generateRemoteObject),
/* harmony export */   "Bang": () => (/* binding */ Bang),
/* harmony export */   "isBang": () => (/* binding */ isBang)
/* harmony export */ });
const sdk = globalThis.jspatcherEnv.sdk;
const {
  React,
  Patcher,
  Box,
  Line,
  BaseObject,
  BaseUI,
  DefaultObject,
  DefaultUI,
  generateRemotedObject,
  generateDefaultObject,
  generateRemoteObject,
  Bang,
  isBang
} = sdk;


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = JSON.parse('{"name":"@jspatcher/package-op","version":"1.0.3","description":"The operators package for JSPatcher","main":"dist/index.js","scripts":{"build":"webpack --mode development","build-watch":"webpack --mode development --watch --stats-children"},"keywords":["jspatcher"],"jspatcher":{"isJSPatcherPackage":true,"thumbnail":"","jspatpkg":"index.jspatpkg.js","jsdsppkg.main":"index.jsdsppkg.main.js","jsdsppkg.aw":"index.jsdsppkg.aw.js"},"author":"Fr0stbyteR","license":"GPL-3.0-or-later","repository":"https://github.com/jspatcher/package-op","devDependencies":{"@jspatcher/jspatcher":"^0.0.9","@types/react":"^17.0.19","clean-webpack-plugin":"^4.0.0-alpha.0","esbuild-loader":"^2.15.1","react":"^17.0.2","typescript":"^4.4.2","webpack":"^5.51.1","webpack-cli":"^4.8.0"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/index.jspatpkg.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _objects_unary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/unary */ "./src/objects/unary.ts");
/* harmony import */ var _objects_binary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/binary */ "./src/objects/binary.ts");
/* harmony import */ var _objects_ternary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/ternary */ "./src/objects/ternary.ts");
/* harmony import */ var _objects_arr_unary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/arr-unary */ "./src/objects/arr-unary.ts");
/* harmony import */ var _objects_arr_binary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/arr-binary */ "./src/objects/arr-binary.ts");
/* harmony import */ var _objects_arr_ternary__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./objects/arr-ternary */ "./src/objects/arr-ternary.ts");
/* harmony import */ var _objects_functions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./objects/functions */ "./src/objects/functions.ts");
/* harmony import */ var _objects_function_names__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./objects/function-names */ "./src/objects/function-names.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./sdk */ "./src/sdk.ts");









const Unary = (0,_sdk__WEBPACK_IMPORTED_MODULE_8__.generateDefaultObject)(_objects_unary__WEBPACK_IMPORTED_MODULE_0__.default);
const Binary = (0,_sdk__WEBPACK_IMPORTED_MODULE_8__.generateDefaultObject)(_objects_binary__WEBPACK_IMPORTED_MODULE_1__.default);
const Ternary = (0,_sdk__WEBPACK_IMPORTED_MODULE_8__.generateDefaultObject)(_objects_ternary__WEBPACK_IMPORTED_MODULE_2__.default);
const ArrUnary = (0,_sdk__WEBPACK_IMPORTED_MODULE_8__.generateDefaultObject)(_objects_arr_unary__WEBPACK_IMPORTED_MODULE_3__.default);
const ArrBinary = (0,_sdk__WEBPACK_IMPORTED_MODULE_8__.generateDefaultObject)(_objects_arr_binary__WEBPACK_IMPORTED_MODULE_4__.default);
const ArrTernary = (0,_sdk__WEBPACK_IMPORTED_MODULE_8__.generateDefaultObject)(_objects_arr_ternary__WEBPACK_IMPORTED_MODULE_5__.default);
const Ops = { "?": Ternary, "[]?": ArrTernary };
for (const key in _objects_functions__WEBPACK_IMPORTED_MODULE_6__.default) {
  const f = _objects_functions__WEBPACK_IMPORTED_MODULE_6__.default[key];
  if (f.length === 1) {
    Ops[key] = class extends Unary {
      constructor() {
        super(...arguments);
        this.execute = f;
      }
      static get _name() {
        return _objects_function_names__WEBPACK_IMPORTED_MODULE_7__.default[key];
      }
    };
    Ops[`[]${key}`] = class extends ArrUnary {
      constructor() {
        super(...arguments);
        this.execute = (a) => {
          if (Array.isArray(a))
            return a.map(f);
          else
            return f(a);
        };
      }
      static get _name() {
        return _objects_function_names__WEBPACK_IMPORTED_MODULE_7__.default[key];
      }
    };
  } else if (f.length === 2) {
    Ops[key] = class extends Binary {
      constructor() {
        super(...arguments);
        this.execute = f;
      }
      static get _name() {
        return _objects_function_names__WEBPACK_IMPORTED_MODULE_7__.default[key];
      }
    };
    Ops[`[]${key}`] = class extends ArrBinary {
      constructor() {
        super(...arguments);
        this.execute = (a, b) => {
          if (Array.isArray(a)) {
            if (Array.isArray(b)) {
              const result = [];
              const length = Math.min(a.length, b.length);
              for (let i = 0; i < length; i++) {
                result[i] = f(a[i], b[i]);
              }
              return result;
            } else {
              return a.map((v) => f(v, b));
            }
          } else {
            return f(a, b);
          }
        };
      }
      static get _name() {
        return _objects_function_names__WEBPACK_IMPORTED_MODULE_7__.default[key];
      }
    };
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  return Ops;
});

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.jspatpkg.js.map