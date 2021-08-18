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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const name = _package_info__WEBPACK_IMPORTED_MODULE_0__.default.name.split("/").pop().replace(/^package-/, '');
const {
  author,
  license,
  keywords,
  version,
  description,
  jspatcher
} = _package_info__WEBPACK_IMPORTED_MODULE_0__.default;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_objectSpread({
  name,
  author,
  license,
  keywords,
  version,
  description
}, jspatcher));

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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Op extends _sdk__WEBPACK_IMPORTED_MODULE_1__.BaseObject {}

_defineProperty(Op, "package", _index__WEBPACK_IMPORTED_MODULE_0__.name);

_defineProperty(Op, "author", _index__WEBPACK_IMPORTED_MODULE_0__.author);

_defineProperty(Op, "version", _index__WEBPACK_IMPORTED_MODULE_0__.version);

_defineProperty(Op, "description", _index__WEBPACK_IMPORTED_MODULE_0__.description);

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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Binary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "execute", void 0);

    _defineProperty(this, "_", {
      arg: undefined,
      result: undefined
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", args => {
      this._.arg = undefined;
      this._.result = undefined;
      if (!args || args.length === 0) return;
      this._.arg = args[0];
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

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

_defineProperty(Binary, "description", "Binary Operation");

_defineProperty(Binary, "inlets", [{
  isHot: true,
  type: "anything",
  description: "First element"
}, {
  isHot: false,
  type: "anything",
  description: "Second element"
}]);

_defineProperty(Binary, "outlets", [{
  type: "anything",
  description: "Result"
}]);

_defineProperty(Binary, "args", [{
  type: "anything",
  optional: true,
  default: 0,
  description: "Initial second element"
}]);

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
  "&": "BAnd",
  "|": "BOr",
  "^": "BXor",
  "~": "BNot",
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
  "++": a => ++a,
  "--": a => --a,
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
  "!": a => !a,
  "&": (a, b) => a & b,
  "|": (a, b) => a | b,
  "^": (a, b) => a ^ b,
  "~": a => ~a,
  "<<": (a, b) => a << b,
  ">>": (a, b) => a >> b,
  ">>>": (a, b) => a >>> b,
  "typeof": a => typeof a,
  "instanceof": (a, b) => a instanceof b,
  "void": a => void a,
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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Ternary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      args: [true, false],
      result: true
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 1;
    });
    this.on("updateArgs", args => {
      this._.args = [true, false];
      this._.result = true;
      if (!args || args.length === 0) return;
      this._.args[0] = args[0];
      this._.args[1] = args[1];
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

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

_defineProperty(Ternary, "description", "Ternary Operation");

_defineProperty(Ternary, "inlets", [{
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
}]);

_defineProperty(Ternary, "outlets", [{
  type: "anything",
  description: "Result"
}]);

_defineProperty(Ternary, "args", [{
  type: "anything",
  optional: true,
  default: true,
  description: "Initial true output"
}, {
  type: "anything",
  optional: true,
  default: false,
  description: "Initial false output"
}]);

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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Unary extends _base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "execute", void 0);

    _defineProperty(this, "_", {
      result: undefined
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("updateArgs", () => this._.result = undefined);
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

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

_defineProperty(Unary, "description", "Unary Operation");

_defineProperty(Unary, "inlets", [{
  isHot: true,
  type: "anything",
  description: "First element"
}]);

_defineProperty(Unary, "outlets", [{
  type: "anything",
  description: "Result"
}]);

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

module.exports = JSON.parse('{"name":"@jspatcher/package-op","version":"1.0.0","description":"The operators package for JSPatcher","main":"dist/index.js","scripts":{"build":"webpack --mode development","build-watch":"webpack --mode development --watch --stats-children"},"keywords":["jspatcher"],"jspatcher":{"isJSPatcherPackage":true,"thumbnail":"","jspatpkg":"index.jspatpkg.js","jsdsppkg.main":"index.jsdsppkg.main.js","jsdsppkg.aw":"index.jsdsppkg.aw.js"},"author":"Fr0stbyteR","license":"GPL-3.0-or-later","repository":"https://github.com/jspatcher/package-op","devDependencies":{"@babel/core":"^7.15.0","@babel/plugin-proposal-class-properties":"^7.14.5","@babel/preset-env":"^7.15.0","@babel/preset-react":"^7.14.5","@babel/preset-typescript":"^7.15.0","@jspatcher/jspatcher":"0.0.2","@types/react":"^17.0.18","babel-loader":"^8.2.2","clean-webpack-plugin":"^4.0.0-alpha.0","copy-webpack-plugin":"^9.0.1","react":"^17.0.2","typescript":"^4.3.5","util":"^0.12.4","webpack":"^5.50.0","webpack-cli":"^4.7.2"}}');

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
/*!**********************************!*\
  !*** ./src/index.jsdsppkg.aw.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _objects_unary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/unary */ "./src/objects/unary.ts");
/* harmony import */ var _objects_binary__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/binary */ "./src/objects/binary.ts");
/* harmony import */ var _objects_ternary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/ternary */ "./src/objects/ternary.ts");
/* harmony import */ var _objects_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/functions */ "./src/objects/functions.ts");
/* harmony import */ var _objects_function_names__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/function-names */ "./src/objects/function-names.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sdk */ "./src/sdk.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







const Unary = (0,_sdk__WEBPACK_IMPORTED_MODULE_5__.generateRemotedObject)(_objects_unary__WEBPACK_IMPORTED_MODULE_0__.default);
const Binary = (0,_sdk__WEBPACK_IMPORTED_MODULE_5__.generateRemotedObject)(_objects_binary__WEBPACK_IMPORTED_MODULE_1__.default);
const Ternary = (0,_sdk__WEBPACK_IMPORTED_MODULE_5__.generateRemotedObject)(_objects_ternary__WEBPACK_IMPORTED_MODULE_2__.default);
const Ops = {
  "?": Ternary
};

for (const key in _objects_functions__WEBPACK_IMPORTED_MODULE_3__.default) {
  const f = _objects_functions__WEBPACK_IMPORTED_MODULE_3__.default[key];

  if (f.length === 1) {
    Ops[key] = class extends Unary {
      constructor() {
        super(...arguments);

        _defineProperty(this, "execute", f);
      }

      static get _name() {
        return _objects_function_names__WEBPACK_IMPORTED_MODULE_4__.default[key];
      }

    };
  } else if (f.length === 2) {
    Ops[key] = class extends Binary {
      constructor() {
        super(...arguments);

        _defineProperty(this, "execute", f);
      }

      static get _name() {
        return _objects_function_names__WEBPACK_IMPORTED_MODULE_4__.default[key];
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
//# sourceMappingURL=index.jsdsppkg.aw.js.map