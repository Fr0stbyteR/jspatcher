/******/ var __webpack_modules__ = ({

/***/ "./src/package-info.ts":
/*!*****************************!*\
  !*** ./src/package-info.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const json = __webpack_require__(/*! ../package.json */ "./package.json");
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JSON.parse(json));


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = "{\n  \"name\": \"@jspatcher/package-dsp\",\n  \"version\": \"1.0.0\",\n  \"description\": \"The DSP package for JSPatcher\",\n  \"main\": \"dist/index.js\",\n  \"scripts\": {\n    \"prebuild\": \"node src/scripts/build-faust.js\",\n    \"build\": \"webpack --mode development\",\n    \"build-watch\": \"webpack --mode development --watch --stats-children\"\n  },\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"git+https://github.com/jspatcher/package-dsp.git\"\n  },\n  \"keywords\": [\n    \"jspatcher\"\n  ],\n  \"jspatcher\": {\n    \"isJSPatcherPackage\": true,\n    \"thumbnail\": \"\",\n    \"jspatpkg\": \"index.jspatpkg.js\"\n  },\n  \"author\": \"Fr0stbyteR\",\n  \"license\": \"GPL-3.0-or-later\",\n  \"bugs\": {\n    \"url\": \"https://github.com/jspatcher/package-dsp/issues\"\n  },\n  \"homepage\": \"https://github.com/jspatcher/package-dsp#readme\",\n  \"devDependencies\": {\n    \"@jspatcher/jspatcher\": \"^0.0.9\",\n    \"@shren/faustwasm\": \"^0.0.6\",\n    \"clean-webpack-plugin\": \"^4.0.0\",\n    \"esbuild-loader\": \"^2.16.0\",\n    \"typescript\": \"^4.4.4\",\n    \"webpack\": \"^5.64.1\",\n    \"webpack-cli\": \"^4.9.1\"\n  }\n}\n";

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
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

const name = _package_info__WEBPACK_IMPORTED_MODULE_0__["default"].name.split("/").pop().replace(/^package-/, "");
const { author, license, keywords, version, description, jspatcher } = _package_info__WEBPACK_IMPORTED_MODULE_0__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__spreadValues({ name, author, license, keywords, version, description }, jspatcher));

})();

var __webpack_exports__author = __webpack_exports__.author;
var __webpack_exports__default = __webpack_exports__["default"];
var __webpack_exports__description = __webpack_exports__.description;
var __webpack_exports__jspatcher = __webpack_exports__.jspatcher;
var __webpack_exports__keywords = __webpack_exports__.keywords;
var __webpack_exports__license = __webpack_exports__.license;
var __webpack_exports__name = __webpack_exports__.name;
var __webpack_exports__version = __webpack_exports__.version;
export { __webpack_exports__author as author, __webpack_exports__default as default, __webpack_exports__description as description, __webpack_exports__jspatcher as jspatcher, __webpack_exports__keywords as keywords, __webpack_exports__license as license, __webpack_exports__name as name, __webpack_exports__version as version };

//# sourceMappingURL=index.js.map