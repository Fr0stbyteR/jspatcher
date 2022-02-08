(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["vendors-node_modules_shren_faust-ui_dist_index_js"],{

/***/ "./node_modules/@shren/faust-ui/dist/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@shren/faust-ui/dist/index.js ***!
  \****************************************************/
/***/ ((module) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@shren/typed-event-emitter/dist/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@shren/typed-event-emitter/dist/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypedEventEmitter = exports.$AnyEventType = void 0;
exports.$AnyEventType = Symbol("__TypedEventListener_AnyEventType");
class TypedEventEmitter {
    constructor() {
        this._listeners = { [exports.$AnyEventType]: [] };
    }
    get listeners() {
        return this._listeners;
    }
    getListeners(eventName) {
        if (!(eventName in this._listeners))
            this._listeners[eventName] = [];
        return this._listeners[eventName];
    }
    on(eventName, listener) {
        if (this.getListeners(eventName).indexOf(listener) === -1)
            this.getListeners(eventName).push(listener);
    }
    once(eventName, listener) {
        const listenerWithOff = (arg, emitter) => {
            const returnValue = listener(arg, emitter);
            this.off(eventName, listenerWithOff);
            return returnValue;
        };
        this.on(eventName, listenerWithOff);
    }
    onAny(listener) {
        this._listeners[exports.$AnyEventType].push(listener);
    }
    off(eventName, listener) {
        const i = this.getListeners(eventName).indexOf(listener);
        if (i !== -1)
            this.getListeners(eventName).splice(i, 1);
    }
    offAny(listener) {
        const i = this._listeners[exports.$AnyEventType].indexOf(listener);
        if (i !== -1)
            this._listeners[exports.$AnyEventType].splice(i, 1);
    }
    async emit(eventName, eventData, options) {
        var _a;
        let listeners = this.getListeners(eventName);
        let anyListeners = (options === null || options === void 0 ? void 0 : options.excludeAny) ? [] : this._listeners[exports.$AnyEventType];
        if (!listeners.length && !anyListeners.length)
            return [];
        if ((_a = options === null || options === void 0 ? void 0 : options.exclude) === null || _a === void 0 ? void 0 : _a.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        return Promise.all([...listeners.map(f => f(eventData, this)), ...anyListeners.map(f => f(eventName, eventData, this))]);
    }
    async emitSerial(eventName, eventData, options) {
        var _a;
        let listeners = this.getListeners(eventName);
        let anyListeners = (options === null || options === void 0 ? void 0 : options.excludeAny) ? [] : this._listeners[exports.$AnyEventType];
        if (!listeners.length && !anyListeners.length)
            return [];
        if ((_a = options === null || options === void 0 ? void 0 : options.exclude) === null || _a === void 0 ? void 0 : _a.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        const returnValues = [];
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            returnValues[i] = await listener(eventData, this);
        }
        for (let i = 0; i < anyListeners.length; i++) {
            const listener = anyListeners[i];
            returnValues[listeners.length + i] = await listener(eventName, eventData, this);
        }
        return returnValues;
    }
    emitSync(eventName, eventData, options) {
        var _a;
        let listeners = this.getListeners(eventName);
        let anyListeners = (options === null || options === void 0 ? void 0 : options.excludeAny) ? [] : this._listeners[exports.$AnyEventType];
        if (!listeners.length && !anyListeners.length)
            return [];
        if ((_a = options === null || options === void 0 ? void 0 : options.exclude) === null || _a === void 0 ? void 0 : _a.length) {
            const { exclude } = options;
            listeners = listeners.filter(l => exclude.indexOf(l) === -1);
            anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
        }
        return [...listeners.map(f => f(eventData, this)), ...anyListeners.map(f => f(eventName, eventData, this))];
    }
    offAll(eventName) {
        if (eventName) {
            this._listeners[eventName] = [];
        }
        else {
            this._listeners = { [exports.$AnyEventType]: [] };
        }
    }
    listenerCount(eventName) {
        const anyListenerCount = this._listeners[exports.$AnyEventType].length;
        if (!(eventName in this._listeners))
            return anyListenerCount;
        return this._listeners[eventName].length + anyListenerCount;
    }
}
exports.TypedEventEmitter = TypedEventEmitter;
exports["default"] = TypedEventEmitter;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Base.scss":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Base.scss ***!
  \***************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_6079__) => {

__nested_webpack_require_6079__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_6079__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_6079__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_6079__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_6079__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_6079__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component {\n  display: flex;\n  position: absolute;\n  flex-direction: column;\n  overflow: hidden;\n}\n.faust-ui-component:focus {\n  outline: none;\n}\n.faust-ui-component > .faust-ui-component-label {\n  position: relative;\n  margin-top: 4px;\n  width: 100%;\n  user-select: none;\n}\n.faust-ui-component > .faust-ui-component-label > canvas {\n  position: relative;\n  display: block;\n  max-width: 100%;\n  max-height: 100%;\n}\n.faust-ui-component input {\n  box-shadow: none;\n}", "",{"version":3,"sources":["webpack://./src/components/Base.scss"],"names":[],"mappings":"AAAA;EACI,aAAA;EACA,kBAAA;EACA,sBAAA;EACA,gBAAA;AACJ;AAAI;EACI,aAAA;AAER;AAAI;EACI,kBAAA;EACA,eAAA;EACA,WAAA;EACA,iBAAA;AAER;AADQ;EACI,kBAAA;EACA,cAAA;EACA,eAAA;EACA,gBAAA;AAGZ;AAAI;EACI,gBAAA;AAER","sourcesContent":[".faust-ui-component {\n    display: flex;\n    position: absolute;\n    flex-direction: column;\n    overflow: hidden;\n    &:focus {\n        outline: none;\n    }\n    & > .faust-ui-component-label {\n        position: relative;\n        margin-top: 4px;\n        width: 100%;\n        user-select: none;\n        & > canvas {\n            position: relative;\n            display: block;\n            max-width: 100%;\n            max-height: 100%;\n        }\n    }\n    & input {\n        box-shadow: none;\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Button.scss":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Button.scss ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_9490__) => {

__nested_webpack_require_9490__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_9490__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_9490__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_9490__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_9490__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_9490__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-button > div {\n  display: flex;\n  position: relative;\n  cursor: pointer;\n  border-width: 1px;\n  text-align: center;\n  border-radius: 4px;\n  flex: 1 0 auto;\n  border-style: solid;\n}\n.faust-ui-component.faust-ui-component-button > div > span {\n  user-select: none;\n  margin: auto;\n}", "",{"version":3,"sources":["webpack://./src/components/Button.scss"],"names":[],"mappings":"AACI;EACI,aAAA;EACA,kBAAA;EACA,eAAA;EACA,iBAAA;EACA,kBAAA;EACA,kBAAA;EACA,cAAA;EACA,mBAAA;AAAR;AACQ;EACI,iBAAA;EACA,YAAA;AACZ","sourcesContent":[".faust-ui-component.faust-ui-component-button {\n    & > div {\n        display: flex;\n        position: relative;\n        cursor: pointer;\n        border-width: 1px;\n        text-align: center;\n        border-radius: 4px;\n        flex: 1 0 auto;\n        border-style: solid;\n        & > span {\n            user-select: none;\n            margin: auto;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Checkbox.scss":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Checkbox.scss ***!
  \*******************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_12535__) => {

__nested_webpack_require_12535__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_12535__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_12535__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_12535__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_12535__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_12535__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-checkbox > div {\n  display: flex;\n  position: relative;\n  cursor: pointer;\n  border-width: 1px;\n  text-align: center;\n  border-radius: 1px;\n  flex: 1 0 auto;\n  border-style: solid;\n}\n.faust-ui-component.faust-ui-component-checkbox > div > span {\n  margin: auto;\n  user-select: none;\n}", "",{"version":3,"sources":["webpack://./src/components/Checkbox.scss"],"names":[],"mappings":"AACI;EACI,aAAA;EACA,kBAAA;EACA,eAAA;EACA,iBAAA;EACA,kBAAA;EACA,kBAAA;EACA,cAAA;EACA,mBAAA;AAAR;AACQ;EACI,YAAA;EACA,iBAAA;AACZ","sourcesContent":[".faust-ui-component.faust-ui-component-checkbox {\n    & > div {\n        display: flex;\n        position: relative;\n        cursor: pointer;\n        border-width: 1px;\n        text-align: center;\n        border-radius: 1px;\n        flex: 1 0 auto;\n        border-style: solid;\n        & > span {\n            margin: auto;\n            user-select: none;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Group.scss":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Group.scss ***!
  \****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_15576__) => {

__nested_webpack_require_15576__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_15576__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_15576__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_15576__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_15576__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_15576__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-group {\n  position: absolute;\n  display: block;\n  background-color: rgba(80, 80, 80, 0.75);\n  border-radius: 4px;\n  border: 1px rgba(255, 255, 255, 0.25) solid;\n}\n.faust-ui-group > .faust-ui-group-label {\n  position: relative;\n  margin: 4px;\n  width: calc(100% - 8px);\n  user-select: none;\n}\n.faust-ui-group > .faust-ui-group-label > canvas {\n  position: relative;\n  display: block;\n  max-width: 100%;\n  max-height: 100%;\n}\n.faust-ui-group .faust-ui-tgroup-tabs {\n  position: absolute;\n  display: inline-block;\n}\n.faust-ui-group .faust-ui-tgroup-tabs .faust-ui-tgroup-tab {\n  position: relative;\n  display: inline-block;\n  border-radius: 5px;\n  cursor: pointer;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  user-select: none;\n  margin: 10px;\n  text-align: center;\n  background-color: rgba(255, 255, 255, 0.5);\n}\n.faust-ui-group .faust-ui-tgroup-tabs .faust-ui-tgroup-tab:hover {\n  background-color: white;\n}\n.faust-ui-group .faust-ui-tgroup-tabs .faust-ui-tgroup-tab.active {\n  background-color: #282828;\n  color: white;\n}", "",{"version":3,"sources":["webpack://./src/components/Group.scss"],"names":[],"mappings":"AACA;EACI,kBAAA;EACA,cAAA;EACA,wCAAA;EACA,kBAAA;EACA,2CAAA;AAAJ;AACI;EACI,kBAAA;EACA,WAAA;EACA,uBAAA;EACA,iBAAA;AACR;AAAQ;EACI,kBAAA;EACA,cAAA;EACA,eAAA;EACA,gBAAA;AAEZ;AACI;EACI,kBAAA;EACA,qBAAA;AACR;AAAQ;EACI,kBAAA;EACA,qBAAA;EACA,kBAAA;EACA,eAAA;EACA,uBAAA;EACA,mBAAA;EACA,iBAAA;EACA,YAAA;EACA,kBAAA;EACA,0CAAA;AAEZ;AADY;EACI,uBAAA;AAGhB;AADY;EACI,yBAAA;EACA,YAAA;AAGhB","sourcesContent":["\n.faust-ui-group {\n    position: absolute;\n    display: block;\n    background-color: rgba(80, 80, 80, 0.75);\n    border-radius: 4px;\n    border: 1px rgba(255, 255, 255, 0.25) solid;\n    & > .faust-ui-group-label {\n        position: relative;\n        margin: 4px;\n        width: calc(100% - 8px);\n        user-select: none;\n        & > canvas {\n            position: relative;\n            display: block;\n            max-width: 100%;\n            max-height: 100%;\n        }\n    }\n    & .faust-ui-tgroup-tabs {\n        position: absolute;\n        display: inline-block;\n        & .faust-ui-tgroup-tab {\n            position: relative;\n            display: inline-block;\n            border-radius: 5px;\n            cursor: pointer;\n            text-overflow: ellipsis;\n            white-space: nowrap;\n            user-select: none;\n            margin: 10px;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.5);\n            &:hover {\n                background-color: rgba(255, 255, 255, 1);\n            }\n            &.active {\n                background-color: rgba(40, 40, 40, 1);\n                color: white;\n            }\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HBargraph.scss":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HBargraph.scss ***!
  \********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_20456__) => {

__nested_webpack_require_20456__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_20456__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_20456__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_20456__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_20456__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_20456__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-label {\n  flex: 0 0 auto;\n}\n.faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-hbargraph-flexdiv {\n  position: relative;\n  display: flex;\n  flex-direction: row-reverse;\n  flex: 1 1 auto;\n  width: 100%;\n  height: auto;\n}\n.faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-hbargraph-flexdiv > .faust-ui-component-hbargraph-canvasdiv {\n  position: relative;\n  display: block;\n  flex: 1 1 auto;\n  height: 100%;\n  margin: auto;\n}\n.faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-hbargraph-flexdiv > .faust-ui-component-hbargraph-canvasdiv > canvas {\n  position: absolute;\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n.faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-hbargraph-flexdiv > input {\n  position: relative;\n  display: block;\n  flex: 0 1 auto;\n  text-align: center;\n  background-color: rgba(255, 255, 255, 0.25);\n  margin: auto 5px auto auto;\n  border-width: 0px;\n  border-radius: 4px;\n  width: calc(20% - 13px);\n  padding: 2px 4px;\n}", "",{"version":3,"sources":["webpack://./src/components/HBargraph.scss"],"names":[],"mappings":"AACI;EACI,cAAA;AAAR;AAEI;EACI,kBAAA;EACA,aAAA;EACA,2BAAA;EACA,cAAA;EACA,WAAA;EACA,YAAA;AAAR;AACQ;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,YAAA;EACA,YAAA;AACZ;AAAY;EACI,kBAAA;EACA,cAAA;EACA,YAAA;EACA,WAAA;AAEhB;AACQ;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,2CAAA;EACA,0BAAA;EACA,iBAAA;EACA,kBAAA;EACA,uBAAA;EACA,gBAAA;AACZ","sourcesContent":[".faust-ui-component.faust-ui-component-hbargraph {\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-hbargraph-flexdiv {\n        position: relative;\n        display: flex;\n        flex-direction: row-reverse;\n        flex: 1 1 auto;\n        width: 100%;\n        height: auto;\n        & > .faust-ui-component-hbargraph-canvasdiv {\n            position: relative;\n            display: block;\n            flex: 1 1 auto;\n            height: 100%;\n            margin: auto;\n            & > canvas {\n                position: absolute;\n                display: block;\n                height: 100%;\n                width: 100%;\n            }\n        }\n        & > input {\n            position: relative;\n            display: block;\n            flex: 0 1 auto;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.25);\n            margin: auto 5px auto auto;\n            border-width: 0px;\n            border-radius: 4px;\n            width: calc(20% - 13px);\n            padding: 2px 4px;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HSlider.scss":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HSlider.scss ***!
  \******************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_25227__) => {

__nested_webpack_require_25227__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_25227__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_25227__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_25227__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_25227__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_25227__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-hslider > .faust-ui-component-label {\n  flex: 0 0 auto;\n}\n.faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv {\n  position: relative;\n  display: flex;\n  flex-direction: row-reverse;\n  flex: 1 1 auto;\n  width: 100%;\n  height: auto;\n}\n.faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > .faust-ui-component-hslider-canvasdiv {\n  position: relative;\n  display: block;\n  flex: 1 1 auto;\n  height: 100%;\n  margin: auto;\n}\n.faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > .faust-ui-component-hslider-canvasdiv > canvas {\n  position: absolute;\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n.faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > input {\n  position: relative;\n  display: block;\n  flex: 0 1 auto;\n  text-align: center;\n  background-color: rgba(255, 255, 255, 0.25);\n  margin: auto 5px auto auto;\n  border-width: 0px;\n  border-radius: 4px;\n  width: calc(20% - 13px);\n  padding: 2px 4px;\n  -moz-appearance: textfield;\n}\n.faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > input::-webkit-inner-spin-button, .faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > input::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}", "",{"version":3,"sources":["webpack://./src/components/HSlider.scss"],"names":[],"mappings":"AACI;EACI,cAAA;AAAR;AAEI;EACI,kBAAA;EACA,aAAA;EACA,2BAAA;EACA,cAAA;EACA,WAAA;EACA,YAAA;AAAR;AACQ;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,YAAA;EACA,YAAA;AACZ;AAAY;EACI,kBAAA;EACA,cAAA;EACA,YAAA;EACA,WAAA;AAEhB;AACQ;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,2CAAA;EACA,0BAAA;EACA,iBAAA;EACA,kBAAA;EACA,uBAAA;EACA,gBAAA;EACA,0BAAA;AACZ;AAAY;EAEI,wBAAA;EACA,SAAA;AAChB","sourcesContent":[".faust-ui-component.faust-ui-component-hslider {\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-hslider-flexdiv {\n        position: relative;\n        display: flex;\n        flex-direction: row-reverse;\n        flex: 1 1 auto;\n        width: 100%;\n        height: auto;\n        & > .faust-ui-component-hslider-canvasdiv {\n            position: relative;\n            display: block;\n            flex: 1 1 auto;\n            height: 100%;\n            margin: auto;\n            & > canvas {\n                position: absolute;\n                display: block;\n                height: 100%;\n                width: 100%;\n            }\n        }\n        & > input {\n            position: relative;\n            display: block;\n            flex: 0 1 auto;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.25);\n            margin: auto 5px auto auto;\n            border-width: 0px;\n            border-radius: 4px;\n            width: calc(20% - 13px);\n            padding: 2px 4px;\n            -moz-appearance:textfield;\n            &::-webkit-inner-spin-button, \n            &::-webkit-outer-spin-button {\n                -webkit-appearance: none;\n                margin: 0;\n            }\n        }\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Knob.scss":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Knob.scss ***!
  \***************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_30536__) => {

__nested_webpack_require_30536__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_30536__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_30536__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_30536__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_30536__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_30536__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-knob {\n  align-items: center;\n}\n.faust-ui-component.faust-ui-component-knob > canvas {\n  position: relative;\n  display: block;\n  flex: 1 1 auto;\n  min-height: 50%;\n  width: 100%;\n}\n.faust-ui-component.faust-ui-component-knob > input {\n  position: relative;\n  display: block;\n  flex: 0 1 auto;\n  text-align: center;\n  background-color: rgba(255, 255, 255, 0.25);\n  margin: 0px;\n  border-width: 0px;\n  border-radius: 4px;\n  max-width: calc(100% - 8px);\n  padding: 2px 4px;\n  -moz-appearance: textfield;\n}\n.faust-ui-component.faust-ui-component-knob > input::-webkit-inner-spin-button, .faust-ui-component.faust-ui-component-knob > input::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}", "",{"version":3,"sources":["webpack://./src/components/Knob.scss"],"names":[],"mappings":"AAAA;EACI,mBAAA;AACJ;AAAI;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,eAAA;EACA,WAAA;AAER;AAAI;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,2CAAA;EACA,WAAA;EACA,iBAAA;EACA,kBAAA;EACA,2BAAA;EACA,gBAAA;EACA,0BAAA;AAER;AADQ;EAEI,wBAAA;EACA,SAAA;AAEZ","sourcesContent":[".faust-ui-component.faust-ui-component-knob {\n    align-items: center;\n    & > canvas {\n        position: relative;\n        display: block;\n        flex: 1 1 auto;\n        min-height: 50%;\n        width: 100%;\n    }\n    & > input {\n        position: relative;\n        display: block;\n        flex: 0 1 auto;\n        text-align: center;\n        background-color: rgba(255, 255, 255, 0.25);\n        margin: 0px;\n        border-width: 0px;\n        border-radius: 4px;\n        max-width: calc(100% - 8px);\n        padding: 2px 4px;\n        -moz-appearance:textfield;\n        &::-webkit-inner-spin-button, \n        &::-webkit-outer-spin-button {\n            -webkit-appearance: none;\n            margin: 0;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Led.scss":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Led.scss ***!
  \**************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_34477__) => {

__nested_webpack_require_34477__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_34477__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_34477__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_34477__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_34477__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_34477__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-led {\n  align-items: center;\n}\n.faust-ui-component.faust-ui-component-led > .faust-ui-component-label {\n  flex: 0 0 auto;\n}\n.faust-ui-component.faust-ui-component-led > .faust-ui-component-led-canvasdiv {\n  position: relative;\n  display: block;\n  flex: 1 1 auto;\n  width: 100%;\n}\n.faust-ui-component.faust-ui-component-led > .faust-ui-component-led-canvasdiv > canvas {\n  position: absolute;\n  display: block;\n  height: 100%;\n  width: 100%;\n}", "",{"version":3,"sources":["webpack://./src/components/Led.scss"],"names":[],"mappings":"AAAA;EACI,mBAAA;AACJ;AAAI;EACI,cAAA;AAER;AAAI;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,WAAA;AAER;AADQ;EACI,kBAAA;EACA,cAAA;EACA,YAAA;EACA,WAAA;AAGZ","sourcesContent":[".faust-ui-component.faust-ui-component-led {\n    align-items: center;\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-led-canvasdiv {\n        position: relative;\n        display: block;\n        flex: 1 1 auto;\n        width: 100%;\n        & > canvas {\n            position: absolute;\n            display: block;\n            height: 100%;\n            width: 100%;\n        }\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Menu.scss":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Menu.scss ***!
  \***************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_37749__) => {

__nested_webpack_require_37749__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_37749__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_37749__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_37749__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_37749__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_37749__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-menu {\n  align-items: center;\n}\n.faust-ui-component.faust-ui-component-menu > select {\n  margin: 0px;\n  text-align: center;\n  border-width: 1px;\n  border-radius: 4px;\n  padding: 2px 4px;\n  width: calc(100% - 8px);\n}", "",{"version":3,"sources":["webpack://./src/components/Menu.scss"],"names":[],"mappings":"AAAA;EACI,mBAAA;AACJ;AAAI;EACI,WAAA;EACA,kBAAA;EACA,iBAAA;EACA,kBAAA;EACA,gBAAA;EACA,uBAAA;AAER","sourcesContent":[".faust-ui-component.faust-ui-component-menu {\n    align-items: center;\n    & > select {\n        margin: 0px;\n        text-align: center;\n        border-width: 1px;\n        border-radius: 4px;\n        padding: 2px 4px;\n        width: calc(100% - 8px);\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Nentry.scss":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Nentry.scss ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_40572__) => {

__nested_webpack_require_40572__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_40572__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_40572__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_40572__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_40572__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_40572__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-nentry {\n  align-items: center;\n}\n.faust-ui-component.faust-ui-component-nentry input {\n  margin: 0px;\n  text-align: center;\n  border-width: 1px;\n  border-radius: 4px;\n  padding: 2px 4px;\n  width: calc(100% - 8px);\n}\n.faust-ui-component.faust-ui-component-nentry input::-webkit-inner-spin-button, .faust-ui-component.faust-ui-component-nentry input::-webkit-outer-spin-button {\n  opacity: 1;\n}", "",{"version":3,"sources":["webpack://./src/components/Nentry.scss"],"names":[],"mappings":"AAAA;EACI,mBAAA;AACJ;AAAI;EACI,WAAA;EACA,kBAAA;EACA,iBAAA;EACA,kBAAA;EACA,gBAAA;EACA,uBAAA;AAER;AADQ;EAEI,UAAA;AAEZ","sourcesContent":[".faust-ui-component.faust-ui-component-nentry {\n    align-items: center;\n    & input {\n        margin: 0px;\n        text-align: center;\n        border-width: 1px;\n        border-radius: 4px;\n        padding: 2px 4px;\n        width: calc(100% - 8px);\n        &::-webkit-inner-spin-button, \n        &::-webkit-outer-spin-button {\n            opacity: 1;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Numerical.scss":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Numerical.scss ***!
  \********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_43725__) => {

__nested_webpack_require_43725__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_43725__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_43725__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_43725__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_43725__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_43725__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-numerical {\n  align-items: center;\n}\n.faust-ui-component.faust-ui-component-numerical > input {\n  position: relative;\n  display: block;\n  flex: 0 1 auto;\n  text-align: center;\n  background-color: rgba(255, 255, 255, 0.25);\n  margin: auto;\n  border-width: 0px;\n  border-radius: 4px;\n  width: calc(100% - 8px);\n  padding: 2px 4px;\n}", "",{"version":3,"sources":["webpack://./src/components/Numerical.scss"],"names":[],"mappings":"AAAA;EACI,mBAAA;AACJ;AAAI;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,2CAAA;EACA,YAAA;EACA,iBAAA;EACA,kBAAA;EACA,uBAAA;EACA,gBAAA;AAER","sourcesContent":[".faust-ui-component.faust-ui-component-numerical {\n    align-items: center;\n    & > input {\n        position: relative;\n        display: block;\n        flex: 0 1 auto;\n        text-align: center;\n        background-color: rgba(255, 255, 255, 0.25);\n        margin: auto;\n        border-width: 0px;\n        border-radius: 4px;\n        width: calc(100% - 8px);\n        padding: 2px 4px;\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Radio.scss":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Radio.scss ***!
  \****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_46848__) => {

__nested_webpack_require_46848__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_46848__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_46848__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_46848__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_46848__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_46848__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-radio {\n  align-items: center;\n}\n.faust-ui-component.faust-ui-component-radio > .faust-ui-component-label {\n  flex: 0 0 auto;\n  margin-top: auto;\n}\n.faust-ui-component.faust-ui-component-radio > .faust-ui-component-radio-group {\n  flex: 0 0 auto;\n  margin-bottom: auto;\n  border-width: 1px;\n  border-radius: 4px;\n  padding: 2px 4px;\n  width: calc(100% - 8px);\n}\n.faust-ui-component.faust-ui-component-radio > .faust-ui-component-radio-group > div {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}", "",{"version":3,"sources":["webpack://./src/components/Radio.scss"],"names":[],"mappings":"AAAA;EACI,mBAAA;AACJ;AAAI;EACI,cAAA;EACA,gBAAA;AAER;AAAI;EACI,cAAA;EACA,mBAAA;EACA,iBAAA;EACA,kBAAA;EACA,gBAAA;EACA,uBAAA;AAER;AADQ;EACI,uBAAA;EACA,mBAAA;EACA,gBAAA;AAGZ","sourcesContent":[".faust-ui-component.faust-ui-component-radio {\n    align-items: center;\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n        margin-top: auto;\n    }\n    & > .faust-ui-component-radio-group {\n        flex: 0 0 auto;\n        margin-bottom: auto;\n        border-width: 1px;\n        border-radius: 4px;\n        padding: 2px 4px;\n        width: calc(100% - 8px);\n        & > div {\n            text-overflow: ellipsis;\n            white-space: nowrap;\n            overflow: hidden;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VBargraph.scss":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VBargraph.scss ***!
  \********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_50331__) => {

__nested_webpack_require_50331__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_50331__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_50331__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_50331__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_50331__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_50331__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-vbargraph {\n  align-items: center;\n}\n.faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-label {\n  flex: 0 0 auto;\n}\n.faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-vbargraph-flexdiv {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  width: 100%;\n  height: inherit;\n}\n.faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-vbargraph-flexdiv > .faust-ui-component-vbargraph-canvasdiv {\n  position: relative;\n  display: block;\n  flex: 1 1 auto;\n  width: 100%;\n}\n.faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-vbargraph-flexdiv > .faust-ui-component-vbargraph-canvasdiv > canvas {\n  position: absolute;\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n.faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-vbargraph-flexdiv > input {\n  position: relative;\n  display: block;\n  flex: 0 1 auto;\n  text-align: center;\n  background-color: rgba(255, 255, 255, 0.25);\n  margin: 5px auto auto auto;\n  border-width: 0px;\n  border-radius: 4px;\n  height: 5%;\n  width: calc(100% - 8px);\n  padding: 2px 4px;\n}", "",{"version":3,"sources":["webpack://./src/components/VBargraph.scss"],"names":[],"mappings":"AAAA;EACI,mBAAA;AACJ;AAAI;EACI,cAAA;AAER;AAAI;EACI,kBAAA;EACA,aAAA;EACA,sBAAA;EACA,cAAA;EACA,WAAA;EACA,eAAA;AAER;AADQ;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,WAAA;AAGZ;AAFY;EACI,kBAAA;EACA,cAAA;EACA,YAAA;EACA,WAAA;AAIhB;AADQ;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,2CAAA;EACA,0BAAA;EACA,iBAAA;EACA,kBAAA;EACA,UAAA;EACA,uBAAA;EACA,gBAAA;AAGZ","sourcesContent":[".faust-ui-component.faust-ui-component-vbargraph {\n    align-items: center;\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-vbargraph-flexdiv {\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        flex: 1 1 auto;\n        width: 100%;\n        height: inherit;\n        & > .faust-ui-component-vbargraph-canvasdiv {\n            position: relative;\n            display: block;\n            flex: 1 1 auto;\n            width: 100%;\n            & > canvas {\n                position: absolute;\n                display: block;\n                height: 100%;\n                width: 100%;\n            }\n        }\n        & > input {\n            position: relative;\n            display: block;\n            flex: 0 1 auto;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.25);\n            margin: 5px auto auto auto;\n            border-width: 0px;\n            border-radius: 4px;\n            height: 5%;\n            width: calc(100% - 8px);\n            padding: 2px 4px;\n        }\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VSlider.scss":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VSlider.scss ***!
  \******************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_55220__) => {

__nested_webpack_require_55220__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_55220__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_55220__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_55220__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_55220__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_55220__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-vslider {\n  align-items: center;\n}\n.faust-ui-component.faust-ui-component-vslider > .faust-ui-component-label {\n  flex: 0 0 auto;\n}\n.faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  width: 100%;\n  height: auto;\n}\n.faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv > .faust-ui-component-vslider-canvasdiv {\n  position: relative;\n  display: block;\n  flex: 1 1 auto;\n  width: 100%;\n}\n.faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv > .faust-ui-component-vslider-canvasdiv > canvas {\n  position: absolute;\n  display: block;\n  height: 100%;\n  width: 100%;\n}\n.faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv input {\n  position: relative;\n  display: block;\n  flex: 0 1 auto;\n  text-align: center;\n  background-color: rgba(255, 255, 255, 0.25);\n  margin: 5px auto auto auto;\n  border-width: 0px;\n  border-radius: 4px;\n  height: 5%;\n  max-width: calc(100% - 8px);\n  padding: 2px 4px;\n  -moz-appearance: textfield;\n}\n.faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv input::-webkit-inner-spin-button, .faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv input::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}", "",{"version":3,"sources":["webpack://./src/components/VSlider.scss"],"names":[],"mappings":"AAAA;EACI,mBAAA;AACJ;AAAI;EACI,cAAA;AAER;AAAI;EACI,kBAAA;EACA,aAAA;EACA,sBAAA;EACA,cAAA;EACA,WAAA;EACA,YAAA;AAER;AADQ;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,WAAA;AAGZ;AAFY;EACI,kBAAA;EACA,cAAA;EACA,YAAA;EACA,WAAA;AAIhB;AADQ;EACI,kBAAA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,2CAAA;EACA,0BAAA;EACA,iBAAA;EACA,kBAAA;EACA,UAAA;EACA,2BAAA;EACA,gBAAA;EACA,0BAAA;AAGZ;AAFY;EAEI,wBAAA;EACA,SAAA;AAGhB","sourcesContent":[".faust-ui-component.faust-ui-component-vslider {\n    align-items: center;\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-vslider-flexdiv {\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        flex: 1 1 auto;\n        width: 100%;\n        height: auto;\n        & > .faust-ui-component-vslider-canvasdiv {\n            position: relative;\n            display: block;\n            flex: 1 1 auto;\n            width: 100%;\n            & > canvas {\n                position: absolute;\n                display: block;\n                height: 100%;\n                width: 100%;\n            }\n        }\n        & input {\n            position: relative;\n            display: block;\n            flex: 0 1 auto;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.25);\n            margin: 5px auto auto auto;\n            border-width: 0px;\n            border-radius: 4px;\n            height: 5%;\n            max-width: calc(100% - 8px);\n            padding: 2px 4px;\n            -moz-appearance:textfield;\n            &::-webkit-inner-spin-button, \n            &::-webkit-outer-spin-button {\n                -webkit-appearance: none;\n                margin: 0;\n            }\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss ***!
  \*****************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_60595__) => {

__nested_webpack_require_60595__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_60595__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_60595__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_60595__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_60595__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_60595__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-root {\n  margin: 0px auto;\n  flex: 1 0 auto;\n  position: relative !important;\n  background-color: transparent !important;\n  border: none !important;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n}", "",{"version":3,"sources":["webpack://./src/index.scss"],"names":[],"mappings":"AAAA;EACI,gBAAA;EACA,cAAA;EACA,6BAAA;EACA,wCAAA;EACA,uBAAA;EACA,kMAAA;AACJ","sourcesContent":[".faust-ui-root {\n    margin: 0px auto;\n    flex: 1 0 auto;\n    position: relative !important;\n    background-color: transparent !important;\n    border: none !important;\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/FaustUI.ts":
/*!************************!*\
  !*** ./src/FaustUI.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_66820__) => {

__nested_webpack_require_66820__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_66820__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FaustUI)
/* harmony export */ });
/* harmony import */ var _layout_Layout__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_66820__(/*! ./layout/Layout */ "./src/layout/Layout.ts");
/* harmony import */ var _components_Group__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_66820__(/*! ./components/Group */ "./src/components/Group.ts");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_66820__(/*! ./index.scss */ "./src/index.scss");



class FaustUI {
  constructor(options) {
    this.componentMap = {};
    this.paramChangeByUI = (path, value) => {
      if (!this.hostWindow)
        return;
      this.hostWindow.postMessage({ path, value, type: "param" }, "*");
    };
    const { root, ui: uiIn, listenWindowResize, listenWindowMessage } = options;
    this.DOMroot = root;
    this.ui = uiIn || [];
    if (typeof listenWindowResize === "undefined" || listenWindowResize === true) {
      window.addEventListener("resize", () => {
        this.resize();
      });
    }
    if (typeof listenWindowMessage === "undefined" || listenWindowMessage === true) {
      window.addEventListener("message", (e) => {
        const { data, source } = e;
        this.hostWindow = source;
        const { type } = data;
        if (!type)
          return;
        if (type === "ui") {
          this.ui = data.ui;
        } else if (type === "param") {
          const { path, value } = data;
          this.paramChangeByDSP(path, value);
        }
      });
    }
  }
  mount() {
    this.componentMap = {};
    this.DOMroot.innerHTML = "";
    const props = {
      label: "",
      type: "vgroup",
      items: this.ui,
      style: {
        grid: this.grid,
        width: this.layout.width,
        height: this.layout.height,
        left: this.layout.offsetLeft,
        top: this.layout.offsetTop
      },
      isRoot: true,
      emitter: this
    };
    this.faustUIRoot = new _components_Group__WEBPACK_IMPORTED_MODULE_1__["default"](props);
    this.faustUIRoot.componentWillMount();
    this.faustUIRoot.mount();
    this.DOMroot.appendChild(this.faustUIRoot.container);
    this.faustUIRoot.componentDidMount();
  }
  register(path, item) {
    if (this.componentMap[path])
      this.componentMap[path].push(item);
    else
      this.componentMap[path] = [item];
  }
  paramChangeByDSP(path, value) {
    if (this.componentMap[path])
      this.componentMap[path].forEach((item) => item.setState({ value }));
  }
  calc() {
    const { items, layout } = _layout_Layout__WEBPACK_IMPORTED_MODULE_0__["default"].calc(this.ui);
    this._ui = items;
    this._layout = layout;
    this.calcGrid();
  }
  calcGrid() {
    const { width, height } = this.DOMroot.getBoundingClientRect();
    const grid = Math.max(40, Math.min(width / this._layout.width, height / this._layout.height));
    this.grid = grid;
    return grid;
  }
  resize() {
    if (!this.faustUIRoot)
      return;
    this.calcGrid();
    this.faustUIRoot.setState({ style: { grid: this.grid } });
  }
  get ui() {
    return this._ui;
  }
  set ui(uiIn) {
    this._ui = uiIn;
    this.calc();
    this.mount();
  }
  get layout() {
    return this._layout;
  }
  get minWidth() {
    return this._layout.width * 40 + 1;
  }
  get minHeight() {
    return this._layout.height * 40 + 1;
  }
}


/***/ }),

/***/ "./src/components/AbstractComponent.ts":
/*!*********************************************!*\
  !*** ./src/components/AbstractComponent.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_70568__) => {

__nested_webpack_require_70568__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_70568__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractComponent)
/* harmony export */ });
/* harmony import */ var _shren_typed_event_emitter__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_70568__(/*! @shren/typed-event-emitter */ "./node_modules/@shren/typed-event-emitter/dist/index.js");
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

class AbstractComponent extends _shren_typed_event_emitter__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(props) {
    super();
    this.$frame = 0;
    this.frameReduce = 1;
    this.raf = () => {
      this.$frame++;
      if (this.$frame % this.frameReduce !== 0) {
        this.$raf = window.requestAnimationFrame(this.raf);
        return;
      }
      this.$raf = void 0;
      this.tasks.forEach((f) => f());
      this.tasks = [];
    };
    this.tasks = [];
    this.state = __spreadValues(__spreadValues({}, this.defaultProps), props);
  }
  get defaultProps() {
    return this.constructor.defaultProps;
  }
  setState(newState) {
    let shouldUpdate = false;
    for (const stateKey in newState) {
      const stateValue = newState[stateKey];
      if (stateKey in this.state && this.state[stateKey] !== stateValue) {
        this.state[stateKey] = stateValue;
        shouldUpdate = true;
      } else
        return;
      if (shouldUpdate)
        this.emit(stateKey, this.state[stateKey]);
    }
  }
  schedule(func) {
    if (this.tasks.indexOf(func) === -1)
      this.tasks.push(func);
    if (this.$raf)
      return;
    this.$raf = window.requestAnimationFrame(this.raf);
  }
}
AbstractComponent.defaultProps = {};


/***/ }),

/***/ "./src/components/AbstractItem.ts":
/*!****************************************!*\
  !*** ./src/components/AbstractItem.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_73182__) => {

__nested_webpack_require_73182__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_73182__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractItem)
/* harmony export */ });
/* harmony import */ var _AbstractComponent__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_73182__(/*! ./AbstractComponent */ "./src/components/AbstractComponent.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_73182__(/*! ./utils */ "./src/components/utils.ts");
/* harmony import */ var _Base_scss__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_73182__(/*! ./Base.scss */ "./src/components/Base.scss");
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



const _AbstractItem = class extends _AbstractComponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(props) {
    super(props);
    this.frameReduce = 3;
    this.handleKeyDown = (e) => {
    };
    this.handleKeyUp = (e) => {
    };
    this.handleTouchStart = (e) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      let prevX = e.touches[0].clientX;
      let prevY = e.touches[0].clientY;
      const fromX = prevX - rect.left;
      const fromY = prevY - rect.top;
      const prevValue = this.state.value;
      this.handlePointerDown({ x: fromX, y: fromY, originalEvent: e });
      const handleTouchMove = (e2) => {
        e2.preventDefault();
        const clientX = e2.changedTouches[0].clientX;
        const clientY = e2.changedTouches[0].clientY;
        const movementX = clientX - prevX;
        const movementY = clientY - prevY;
        prevX = clientX;
        prevY = clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        this.handlePointerDrag({ prevValue, x, y, fromX, fromY, movementX, movementY, originalEvent: e2 });
      };
      const handleTouchEnd = (e2) => {
        e2.preventDefault();
        const x = e2.changedTouches[0].clientX - rect.left;
        const y = e2.changedTouches[0].clientY - rect.top;
        this.handlePointerUp({ x, y, originalEvent: e2 });
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd, { passive: false });
    };
    this.handleWheel = (e) => {
    };
    this.handleClick = (e) => {
    };
    this.handleMouseDown = (e) => {
      e.preventDefault();
      e.currentTarget.focus();
      const rect = e.currentTarget.getBoundingClientRect();
      const fromX = e.clientX - rect.left;
      const fromY = e.clientY - rect.top;
      const prevValue = this.state.value;
      this.handlePointerDown({ x: fromX, y: fromY, originalEvent: e });
      const handleMouseMove = (e2) => {
        e2.preventDefault();
        const x = e2.clientX - rect.left;
        const y = e2.clientY - rect.top;
        this.handlePointerDrag({ prevValue, x, y, fromX, fromY, movementX: e2.movementX, movementY: e2.movementY, originalEvent: e2 });
      };
      const handleMouseUp = (e2) => {
        e2.preventDefault();
        const x = e2.clientX - rect.left;
        const y = e2.clientY - rect.top;
        this.handlePointerUp({ x, y, originalEvent: e2 });
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };
    this.handleMouseOver = (e) => {
    };
    this.handleMouseOut = (e) => {
    };
    this.handleContextMenu = (e) => {
    };
    this.handlePointerDown = (e) => {
    };
    this.handlePointerDrag = (e) => {
    };
    this.handlePointerUp = (e) => {
    };
    this.handleFocusIn = (e) => this.setState({ focus: true });
    this.handleFocusOut = (e) => this.setState({ focus: false });
    this.state.style = __spreadValues(__spreadValues({}, this.defaultProps.style), props.style);
    if (this.state.emitter)
      this.state.emitter.register(this.state.address, this);
  }
  toValidNumber(value) {
    const { min, max, step } = this.state;
    if (typeof min !== "number" || typeof max !== "number")
      return value;
    const v = Math.min(max, Math.max(min, value));
    if (!step)
      return v;
    return min + Math.floor((v - min) / step) * step;
  }
  setValue(valueIn) {
    const value = this.toValidNumber(valueIn);
    const changed = this.setState({ value });
    if (changed)
      this.change(value);
    return changed;
  }
  change(valueIn) {
    if (this.state.emitter)
      this.state.emitter.paramChangeByUI(this.state.address, typeof valueIn === "number" ? valueIn : this.state.value);
  }
  setState(newState) {
    let shouldUpdate = false;
    for (const key in newState) {
      const stateKey = key;
      const stateValue = newState[stateKey];
      if (stateKey === "style") {
        for (const styleKey in newState.style) {
          if (styleKey in this.state.style && this.state.style[styleKey] !== newState.style[styleKey]) {
            this.state.style[styleKey] = newState.style[styleKey];
            shouldUpdate = true;
          }
        }
      } else if (stateKey in this.state && this.state[stateKey] !== stateValue) {
        this.state[stateKey] = stateValue;
        shouldUpdate = true;
      } else
        return false;
      if (shouldUpdate)
        this.emit(stateKey, this.state[stateKey]);
    }
    return shouldUpdate;
  }
  componentWillMount() {
    this.container = document.createElement("div");
    this.container.className = ["faust-ui-component", "faust-ui-component-" + this.className].join(" ");
    this.container.tabIndex = 1;
    this.container.id = this.state.address;
    if (this.state.tooltip)
      this.container.title = this.state.tooltip;
    this.label = document.createElement("div");
    this.label.className = "faust-ui-component-label";
    this.labelCanvas = document.createElement("canvas");
    this.labelCtx = this.labelCanvas.getContext("2d");
    return this;
  }
  mount() {
    this.label.appendChild(this.labelCanvas);
    return this;
  }
  paintLabel(align) {
    const label = this.state.label;
    const color = this.state.style.labelcolor;
    const ctx = this.labelCtx;
    const canvas = this.labelCanvas;
    let { width, height } = this.label.getBoundingClientRect();
    if (!width || !height)
      return this;
    width = Math.floor(width);
    height = Math.floor(height);
    canvas.height = height;
    canvas.width = width;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = align || "center";
    ctx.font = `bold ${height * 0.9}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    ctx.fillText(label, align === "left" ? 0 : align === "right" ? width : width / 2, height / 2, width);
    return this;
  }
  componentDidMount() {
    const handleResize = () => {
      const { grid, left, top, width, height } = this.state.style;
      this.container.style.width = `${width * grid}px`;
      this.container.style.height = `${height * grid}px`;
      this.container.style.left = `${left * grid}px`;
      this.container.style.top = `${top * grid}px`;
      this.label.style.height = `${grid * 0.25}px`;
      this.paintLabel();
    };
    this.on("style", () => this.schedule(handleResize));
    handleResize();
    return this;
  }
  get stepsCount() {
    const { type, max, min, step, enums } = this.state;
    const maxSteps = type === "enum" ? enums.length : type === "int" ? max - min : (max - min) / step;
    if (step) {
      if (type === "enum")
        return enums.length;
      if (type === "int")
        return Math.min(Math.floor((max - min) / (Math.round(step) || 1)), maxSteps);
      return Math.floor((max - min) / step);
    }
    return maxSteps;
  }
  get distance() {
    const { type, max, min, value, enums, scale } = this.state;
    return _AbstractItem.getDistance({ type, max, min, value, enums, scale });
  }
  static getDistance(state) {
    const { type, max, min, value, enums, scale } = state;
    if (type === "enum")
      return value / (enums.length - 1);
    const v = scale === "exp" ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normLog)(value, min, max) : scale === "log" ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normExp)(value, min, max) : value;
    return (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normalize)(v, min, max);
  }
  get stepRange() {
    const full = 100;
    const stepsCount = this.stepsCount;
    return full / stepsCount;
  }
};
let AbstractItem = _AbstractItem;
AbstractItem.defaultProps = {
  value: 0,
  active: true,
  focus: false,
  label: "",
  address: "",
  min: 0,
  max: 1,
  enums: {},
  type: "float",
  unit: "",
  scale: "linear",
  step: 0.01,
  style: { width: 45, height: 15, left: 0, top: 0, labelcolor: "rgba(226, 222, 255, 0.5)" }
};



/***/ }),

/***/ "./src/components/Button.ts":
/*!**********************************!*\
  !*** ./src/components/Button.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_83202__) => {

__nested_webpack_require_83202__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_83202__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_83202__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Button_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_83202__(/*! ./Button.scss */ "./src/components/Button.scss");
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


class Button extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "button";
    this.setStyle = () => {
      const { value, style } = this.state;
      const { height, grid, fontsize, fontname, fontface, textcolor, textoncolor, bgoncolor, bgcolor, bordercolor, borderoncolor } = style;
      this.btn.style.backgroundColor = value ? bgoncolor : bgcolor;
      this.btn.style.borderColor = value ? borderoncolor : bordercolor;
      this.btn.style.color = value ? textoncolor : textcolor;
      this.btn.style.fontSize = `${fontsize || height * grid / 4}px`;
      this.btn.style.fontFamily = `${fontname}, sans-serif`;
      this.btn.style.fontStyle = fontface;
    };
    this.handlePointerDown = () => {
      this.setValue(1);
    };
    this.handlePointerUp = () => {
      this.setValue(0);
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "normal",
        bgcolor: "rgba(40, 40, 40, 1)",
        bgoncolor: "rgba(18, 18, 18, 1)",
        bordercolor: "rgba(80, 80, 80, 1)",
        borderoncolor: "rgba(255, 165, 0, 1)",
        textcolor: "rgba(226, 222, 255, 0.5)",
        textoncolor: "rgba(255, 165, 0, 1)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.btn = document.createElement("div");
    this.span = document.createElement("span");
    this.span.innerText = this.state.label;
    this.setStyle();
    return this;
  }
  mount() {
    this.btn.appendChild(this.span);
    this.container.appendChild(this.btn);
    return super.mount();
  }
  componentDidMount() {
    super.componentDidMount();
    this.btn.addEventListener("mousedown", this.handleMouseDown);
    this.btn.addEventListener("touchstart", this.handleTouchStart);
    this.on("style", () => this.schedule(this.setStyle));
    const labelChange = () => this.span.innerText = this.state.label;
    this.on("label", () => this.schedule(labelChange));
    this.on("value", () => this.schedule(this.setStyle));
    return this;
  }
}


/***/ }),

/***/ "./src/components/Checkbox.ts":
/*!************************************!*\
  !*** ./src/components/Checkbox.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_87061__) => {

__nested_webpack_require_87061__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_87061__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Checkbox)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_87061__(/*! ./Button */ "./src/components/Button.ts");
/* harmony import */ var _Checkbox_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_87061__(/*! ./Checkbox.scss */ "./src/components/Checkbox.scss");


class Checkbox extends _Button__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "checkbox";
    this.handlePointerDown = () => {
      this.setValue(1 - this.state.value);
    };
    this.handlePointerUp = () => {
    };
  }
}


/***/ }),

/***/ "./src/components/Group.ts":
/*!*********************************!*\
  !*** ./src/components/Group.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_88072__) => {

__nested_webpack_require_88072__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_88072__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Group)
/* harmony export */ });
/* harmony import */ var _AbstractComponent__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_88072__(/*! ./AbstractComponent */ "./src/components/AbstractComponent.ts");
/* harmony import */ var _HSlider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_88072__(/*! ./HSlider */ "./src/components/HSlider.ts");
/* harmony import */ var _VSlider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_88072__(/*! ./VSlider */ "./src/components/VSlider.ts");
/* harmony import */ var _Nentry__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_88072__(/*! ./Nentry */ "./src/components/Nentry.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_88072__(/*! ./Button */ "./src/components/Button.ts");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_88072__(/*! ./Checkbox */ "./src/components/Checkbox.ts");
/* harmony import */ var _Knob__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_88072__(/*! ./Knob */ "./src/components/Knob.ts");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_88072__(/*! ./Menu */ "./src/components/Menu.ts");
/* harmony import */ var _Radio__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_88072__(/*! ./Radio */ "./src/components/Radio.ts");
/* harmony import */ var _Led__WEBPACK_IMPORTED_MODULE_9__ = __nested_webpack_require_88072__(/*! ./Led */ "./src/components/Led.ts");
/* harmony import */ var _Numerical__WEBPACK_IMPORTED_MODULE_10__ = __nested_webpack_require_88072__(/*! ./Numerical */ "./src/components/Numerical.ts");
/* harmony import */ var _HBargraph__WEBPACK_IMPORTED_MODULE_11__ = __nested_webpack_require_88072__(/*! ./HBargraph */ "./src/components/HBargraph.ts");
/* harmony import */ var _VBargraph__WEBPACK_IMPORTED_MODULE_12__ = __nested_webpack_require_88072__(/*! ./VBargraph */ "./src/components/VBargraph.ts");
/* harmony import */ var _layout_Layout__WEBPACK_IMPORTED_MODULE_13__ = __nested_webpack_require_88072__(/*! ../layout/Layout */ "./src/layout/Layout.ts");
/* harmony import */ var _Group_scss__WEBPACK_IMPORTED_MODULE_14__ = __nested_webpack_require_88072__(/*! ./Group.scss */ "./src/components/Group.scss");















class Group extends _AbstractComponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.updateUI = () => {
      this.children = [];
      const { style, type, items, emitter, isRoot } = this.state;
      const { grid, left, top, width, height } = style;
      this.label.style.height = `${grid * 0.3}px`;
      this.container.style.left = `${left * grid}px`;
      this.container.style.top = `${top * grid}px`;
      this.container.style.width = `${width * grid}px`;
      this.container.style.height = `${height * grid}px`;
      this.container.className = ["faust-ui-group", `faust-ui-${type}`, `${isRoot ? "faust-ui-root" : ""}`].join(" ");
      items.forEach((item) => {
        if (item.type.endsWith("group")) {
          const component = Group.getComponent(item, emitter, grid);
          if (component)
            this.children.push(component);
        } else {
          const ioItem = item;
          const itemComponent = Group.getComponent(ioItem, this.state.emitter, grid);
          if (itemComponent)
            this.children.push(itemComponent);
        }
      });
      if (type === "tgroup") {
        this.tabs.innerHTML = "";
        this.tabs.style.height = `${grid}px`;
        this.tabs.style.top = `${0.25 * grid}px`;
        this.state.items.forEach((item, i) => {
          const label = item.label;
          const tab = document.createElement("span");
          tab.innerText = label;
          tab.className = "faust-ui-tgroup-tab";
          tab.style.fontSize = `${0.25 * grid}px`;
          tab.style.width = `${2 * grid - 20}px`;
          tab.style.height = `${grid - 20}px`;
          tab.style.lineHeight = `${grid - 20}px`;
          tab.addEventListener("click", () => {
            const groups = [];
            for (let j = 0; j < this.container.children.length; j++) {
              const element = this.container.children[j];
              if (j > 1)
                groups.push(element);
            }
            for (let j = 0; j < groups.length; j++) {
              const element = groups[j];
              element.style.visibility = i === j ? "visible" : "hidden";
            }
            for (let j = 0; j < this.tabs.children.length; j++) {
              const e = this.tabs.children[j];
              if (i !== j) {
                if (e.classList.contains("active"))
                  e.classList.remove("active");
              } else
                e.classList.add("active");
            }
          });
          this.tabs.appendChild(tab);
        });
      }
    };
  }
  static parseMeta(metaIn) {
    const metaObject = {};
    if (!metaIn)
      return { metaObject };
    metaIn.forEach((m) => Object.assign(metaObject, m));
    if (metaObject.style) {
      const enumsRegex = /\{(?:(?:'|_)(.+?)(?:'|_):([-+]?[0-9]*\.?[0-9]+?);)+(?:(?:'|_)(.+?)(?:'|_):([-+]?[0-9]*\.?[0-9]+?))\}/;
      const matched = metaObject.style.match(enumsRegex);
      if (matched) {
        const itemsRegex = /(?:(?:'|_)(.+?)(?:'|_):([-+]?[0-9]*\.?[0-9]+?))/g;
        const enums = {};
        let item;
        while (item = itemsRegex.exec(matched[0])) {
          enums[item[1]] = +item[2];
        }
        return { metaObject, enums };
      }
    }
    return { metaObject };
  }
  static getComponent(item, emitter, grid) {
    const type = _layout_Layout__WEBPACK_IMPORTED_MODULE_13__["default"].predictType(item);
    if (type.endsWith("group")) {
      const { label: label2, items, type: type2, layout: layout2 } = item;
      const props2 = {
        label: label2,
        type: type2,
        items,
        style: {
          grid,
          width: layout2.width,
          height: layout2.height,
          left: layout2.offsetLeft,
          top: layout2.offsetTop,
          labelcolor: "rgba(255, 255, 255, 0.7)"
        },
        emitter
      };
      return new Group(props2);
    }
    const ioItem = item;
    const { metaObject, enums } = this.parseMeta(ioItem.meta);
    const { tooltip, unit, scale } = metaObject;
    const { label, min, max, address, layout } = ioItem;
    const props = {
      label,
      address,
      tooltip,
      unit,
      scale: scale || "linear",
      emitter,
      enums,
      style: {
        grid,
        width: layout.width,
        height: layout.height,
        left: layout.offsetLeft,
        top: layout.offsetTop
      },
      type: "float",
      min: isFinite(min) ? min : 0,
      max: isFinite(max) ? max : 1,
      step: "step" in item ? +item.step : 1,
      value: "init" in item ? +item.init || 0 : 0
    };
    if (type === "button")
      return new _Button__WEBPACK_IMPORTED_MODULE_4__["default"](props);
    if (type === "checkbox")
      return new _Checkbox__WEBPACK_IMPORTED_MODULE_5__["default"](props);
    if (type === "nentry")
      return new _Nentry__WEBPACK_IMPORTED_MODULE_3__["default"](props);
    if (type === "knob")
      return new _Knob__WEBPACK_IMPORTED_MODULE_6__["default"](props);
    if (type === "menu")
      return new _Menu__WEBPACK_IMPORTED_MODULE_7__["default"](props);
    if (type === "radio")
      return new _Radio__WEBPACK_IMPORTED_MODULE_8__["default"](props);
    if (type === "hslider")
      return new _HSlider__WEBPACK_IMPORTED_MODULE_1__["default"](props);
    if (type === "vslider")
      return new _VSlider__WEBPACK_IMPORTED_MODULE_2__["default"](props);
    if (type === "hbargraph")
      return new _HBargraph__WEBPACK_IMPORTED_MODULE_11__["default"](props);
    if (type === "vbargraph")
      return new _VBargraph__WEBPACK_IMPORTED_MODULE_12__["default"](props);
    if (type === "numerical")
      return new _Numerical__WEBPACK_IMPORTED_MODULE_10__["default"](props);
    if (type === "led")
      return new _Led__WEBPACK_IMPORTED_MODULE_9__["default"](props);
    return null;
  }
  setState(newState) {
    let shouldUpdate = false;
    for (const key in newState) {
      const stateKey = key;
      const stateValue = newState[stateKey];
      if (stateKey === "style") {
        for (const key2 in newState.style) {
          const styleKey = key2;
          if (styleKey in this.state.style && this.state.style[styleKey] !== newState.style[styleKey]) {
            this.state.style[styleKey] = newState.style[styleKey];
            shouldUpdate = true;
          }
        }
      } else if (stateKey in this.state && this.state[stateKey] !== stateValue) {
        this.state[stateKey] = stateValue;
        shouldUpdate = true;
      } else
        return;
      if (shouldUpdate)
        this.emit(stateKey, this.state[stateKey]);
    }
  }
  componentWillMount() {
    this.container = document.createElement("div");
    this.tabs = document.createElement("div");
    this.tabs.className = "faust-ui-tgroup-tabs";
    this.label = document.createElement("div");
    this.label.className = "faust-ui-group-label";
    this.labelCanvas = document.createElement("canvas");
    this.labelCtx = this.labelCanvas.getContext("2d");
    this.updateUI();
    this.children.forEach((item) => item.componentWillMount());
    return this;
  }
  paintLabel() {
    const label = this.state.label;
    const color = this.state.style.labelcolor;
    const ctx = this.labelCtx;
    const canvas = this.labelCanvas;
    let { width, height } = this.label.getBoundingClientRect();
    if (!width || !height)
      return this;
    width = Math.floor(width);
    height = Math.floor(height);
    canvas.height = height;
    canvas.width = width;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.font = `bold ${height * 0.9}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    ctx.fillText(label, 0, height / 2, width);
    return this;
  }
  mount() {
    this.label.appendChild(this.labelCanvas);
    this.container.appendChild(this.label);
    if (this.tabs.children.length)
      this.container.appendChild(this.tabs);
    this.children.forEach((item) => {
      item.mount();
      this.container.appendChild(item.container);
    });
    return this;
  }
  componentDidMount() {
    const handleResize = () => {
      const { grid, left, top, width, height } = this.state.style;
      this.label.style.height = `${grid * 0.3}px`;
      this.container.style.width = `${width * grid}px`;
      this.container.style.height = `${height * grid}px`;
      this.container.style.left = `${left * grid}px`;
      this.container.style.top = `${top * grid}px`;
      if (this.state.type === "tgroup") {
        this.tabs.style.height = `${grid}px`;
        this.tabs.style.top = `${0.25 * grid}px`;
        for (let i = 0; i < this.tabs.children.length; i++) {
          const tab = this.tabs.children[i];
          tab.style.fontSize = `${0.25 * grid}px`;
          tab.style.width = `${2 * grid - 20}px`;
          tab.style.height = `${grid - 20}px`;
          tab.style.lineHeight = `${grid - 20}px`;
        }
      }
      this.paintLabel();
      this.children.forEach((item) => item.setState({ style: { grid } }));
    };
    this.on("style", () => this.schedule(handleResize));
    const itemsChange = () => {
      this.updateUI();
      this.children.forEach((item) => item.componentWillMount());
    };
    this.on("items", () => this.schedule(itemsChange));
    const labelChange = () => {
      this.paintLabel();
      this.label.title = this.state.label;
    };
    this.on("label", () => this.schedule(labelChange));
    this.paintLabel();
    if (this.tabs && this.tabs.children.length)
      this.tabs.children[0].click();
    this.children.forEach((item) => item.componentDidMount());
    return this;
  }
}


/***/ }),

/***/ "./src/components/HBargraph.ts":
/*!*************************************!*\
  !*** ./src/components/HBargraph.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_100359__) => {

__nested_webpack_require_100359__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_100359__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HBargraph)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_100359__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _VBargraph__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_100359__(/*! ./VBargraph */ "./src/components/VBargraph.ts");
/* harmony import */ var _HBargraph_scss__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_100359__(/*! ./HBargraph.scss */ "./src/components/HBargraph.scss");



class HBargraph extends _VBargraph__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this.className = "hbargraph";
    this.setStyle = () => {
      const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
      this.input.style.fontSize = `${fontsize || height * grid * 0.2}px`;
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    };
    this.paint = () => {
      const { barwidth, barbgcolor, coldcolor, warmcolor, hotcolor, overloadcolor } = this.state.style;
      const { type, max, min, enums, scale, value } = this.state;
      const ctx = this.ctx;
      const canvas = this.canvas;
      let { width, height } = this.canvasDiv.getBoundingClientRect();
      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      const drawWidth = width * 0.9;
      const drawHeight = barwidth || Math.min(height / 3, drawWidth * 0.05);
      const left = width * 0.05;
      const top = (height - drawHeight) * 0.5;
      this.paintValue = value;
      const paintValue = this.paintValue;
      if (paintValue > this.maxValue) {
        this.maxValue = paintValue;
        if (this.maxTimer)
          window.clearTimeout(this.maxTimer);
        this.maxTimer = window.setTimeout(() => {
          this.maxValue = this.paintValue;
          this.maxTimer = void 0;
          this.schedule(this.paint);
        }, 1e3);
      }
      if (paintValue < this.maxValue && typeof this.maxTimer === "undefined") {
        this.maxTimer = window.setTimeout(() => {
          this.maxValue = this.paintValue;
          this.maxTimer = void 0;
          this.schedule(this.paint);
        }, 1e3);
      }
      const maxValue = this.maxValue;
      const coldStop = (-18 - min) / (max - min);
      const warmStop = (-6 - min) / (max - min);
      const hotStop = (-3 - min) / (max - min);
      const overloadStop = Math.max(0, -min / (max - min));
      const gradient = ctx.createLinearGradient(left, 0, drawWidth, 0);
      if (coldStop <= 1 && coldStop >= 0)
        gradient.addColorStop(coldStop, coldcolor);
      else if (coldStop > 1)
        gradient.addColorStop(1, coldcolor);
      if (warmStop <= 1 && warmStop >= 0)
        gradient.addColorStop(warmStop, warmcolor);
      if (hotStop <= 1 && hotStop >= 0)
        gradient.addColorStop(hotStop, hotcolor);
      if (overloadStop <= 1 && overloadStop >= 0)
        gradient.addColorStop(overloadStop, overloadcolor);
      else if (overloadStop < 0)
        gradient.addColorStop(0, coldcolor);
      ctx.fillStyle = barbgcolor;
      if (paintValue < 0)
        ctx.fillRect(left, top, drawWidth * overloadStop, drawHeight);
      if (paintValue < max)
        ctx.fillRect(left + drawWidth * overloadStop + 1, top, drawWidth * (1 - overloadStop) - 1, drawHeight);
      ctx.fillStyle = gradient;
      if (paintValue > min) {
        const distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ type, max, min, enums, scale, value: Math.min(0, paintValue) }));
        ctx.fillRect(left, top, distance * drawWidth, drawHeight);
      }
      if (paintValue > 0) {
        const distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ type, max, min, enums, scale, value: Math.min(max, paintValue) }) - overloadStop);
        ctx.fillRect(left + overloadStop * drawWidth + 1, top, distance * drawWidth - 1, drawHeight);
      }
      if (maxValue > paintValue) {
        if (maxValue <= 0) {
          const distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ type, max, min, enums, scale, value: Math.min(0, maxValue) }));
          ctx.fillRect(left + distance * drawWidth - 1, top, 1, drawHeight);
        }
        if (maxValue > 0) {
          const distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ type, max, min, enums, scale, value: Math.min(max, maxValue) }) - overloadStop);
          ctx.fillRect(left + Math.min(drawWidth - 1, (overloadStop + distance) * drawWidth), top, 1, drawHeight);
        }
      }
    };
  }
  paintLabel() {
    return super.paintLabel("left");
  }
}


/***/ }),

/***/ "./src/components/HSlider.ts":
/*!***********************************!*\
  !*** ./src/components/HSlider.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_105593__) => {

__nested_webpack_require_105593__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_105593__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HSlider)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_105593__(/*! ./utils */ "./src/components/utils.ts");
/* harmony import */ var _VSlider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_105593__(/*! ./VSlider */ "./src/components/VSlider.ts");
/* harmony import */ var _HSlider_scss__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_105593__(/*! ./HSlider.scss */ "./src/components/HSlider.scss");



class HSlider extends _VSlider__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this.className = "hslider";
    this.setStyle = () => {
      const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
      this.input.style.fontSize = `${fontsize || height * grid * 0.2}px`;
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    };
    this.paint = () => {
      const { sliderwidth, sliderbgcolor, sliderbgoncolor, slidercolor } = this.state.style;
      const ctx = this.ctx;
      const canvas = this.canvas;
      const distance = this.distance;
      let { width, height } = this.canvasDiv.getBoundingClientRect();
      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      const drawWidth = width * 0.9;
      const drawHeight = sliderwidth || Math.min(height / 3, drawWidth * 0.05);
      const left = width * 0.05;
      const top = (height - drawHeight) * 0.5;
      const borderRadius = drawHeight * 0.25;
      this.interactionRect = [left, 0, drawWidth, height];
      const grd = ctx.createLinearGradient(left, 0, left + drawWidth, 0);
      grd.addColorStop(Math.max(0, Math.min(1, distance)), sliderbgoncolor);
      grd.addColorStop(Math.max(0, Math.min(1, distance)), sliderbgcolor);
      ctx.fillStyle = grd;
      (0,_utils__WEBPACK_IMPORTED_MODULE_0__.fillRoundedRect)(ctx, left, top, drawWidth, drawHeight, borderRadius);
      ctx.fillStyle = slidercolor;
      (0,_utils__WEBPACK_IMPORTED_MODULE_0__.fillRoundedRect)(ctx, left + drawWidth * distance - drawHeight, top - drawHeight, drawHeight * 2, drawHeight * 3, borderRadius);
    };
  }
  paintLabel() {
    return super.paintLabel("left");
  }
}


/***/ }),

/***/ "./src/components/Knob.ts":
/*!********************************!*\
  !*** ./src/components/Knob.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_108308__) => {

__nested_webpack_require_108308__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_108308__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Knob)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_108308__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_108308__(/*! ./utils */ "./src/components/utils.ts");
/* harmony import */ var _Knob_scss__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_108308__(/*! ./Knob.scss */ "./src/components/Knob.scss");
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



class Knob extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "knob";
    this.handleChange = (e) => {
      const value = parseFloat(e.currentTarget.value);
      if (isFinite(value)) {
        const changed = this.setValue(+this.inputNumber.value);
        if (changed)
          return;
      }
      this.input.value = this.inputNumber.value + (this.state.unit || "");
    };
    this.setStyle = () => {
      const { fontsize, height, grid, textcolor, bgcolor, bordercolor } = this.state.style;
      this.input.style.fontSize = `${fontsize || height * grid * 0.1}px`;
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    };
    this.paint = () => {
      const { knobwidth, knobcolor, knoboncolor, needlecolor } = this.state.style;
      const ctx = this.ctx;
      const canvas = this.canvas;
      const distance = this.distance;
      let { width, height } = this.canvas.getBoundingClientRect();
      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      const start = 5 / 8 * Math.PI;
      const end = 19 / 8 * Math.PI;
      const valPos = start + (0,_utils__WEBPACK_IMPORTED_MODULE_1__.toRad)(distance * 315);
      const dialHeight = Math.min(width, height) * 0.75;
      const dialRadius = dialHeight * 0.5;
      const dialCenterX = width * 0.5;
      const dialCenterY = height * 0.5;
      const valuePosX = dialCenterX + dialHeight * 0.5 * Math.cos(valPos);
      const valuePosY = dialCenterY + dialHeight * 0.5 * Math.sin(valPos);
      const lineWidth = knobwidth || dialRadius * 0.2;
      ctx.strokeStyle = knobcolor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(dialCenterX, dialCenterY, dialRadius, valPos, end);
      ctx.stroke();
      if (distance) {
        ctx.strokeStyle = knoboncolor;
        ctx.beginPath();
        ctx.arc(dialCenterX, dialCenterY, dialRadius, start, valPos);
        ctx.stroke();
      }
      ctx.strokeStyle = needlecolor;
      ctx.beginPath();
      ctx.moveTo(dialCenterX, dialCenterY);
      ctx.lineTo(valuePosX, valuePosY);
      ctx.stroke();
    };
    this.handlePointerDrag = (e) => {
      const newValue = this.getValueFromDelta(e);
      if (newValue !== this.state.value)
        this.setValue(newValue);
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "regular",
        bgcolor: "rgba(18, 18, 18, 0)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)",
        knobwidth: void 0,
        knobcolor: "rgba(18, 18, 18, 1)",
        knoboncolor: "rgba(255, 165, 0, 1)",
        needlecolor: "rgba(200, 200, 200, 0.75)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.canvas = document.createElement("canvas");
    this.canvas.width = 10;
    this.canvas.height = 10;
    this.ctx = this.canvas.getContext("2d");
    this.inputNumber = document.createElement("input");
    this.inputNumber.type = "number";
    this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
    this.inputNumber.max = this.state.max.toString();
    this.inputNumber.min = this.state.min.toString();
    this.inputNumber.step = this.state.step.toString();
    this.input = document.createElement("input");
    this.input.value = this.inputNumber.value + (this.state.unit || "");
    this.input.spellcheck = false;
    this.setStyle();
    return this;
  }
  componentDidMount() {
    super.componentDidMount();
    this.input.addEventListener("change", this.handleChange);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    this.on("style", () => {
      this.schedule(this.setStyle);
      this.schedule(this.paint);
    });
    this.on("label", () => this.schedule(this.paintLabel));
    const valueChange = () => {
      this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
      this.input.value = this.inputNumber.value + (this.state.unit || "");
    };
    this.on("value", () => {
      this.schedule(valueChange);
      this.schedule(this.paint);
    });
    const maxChange = () => this.inputNumber.max = this.state.max.toString();
    this.on("max", () => {
      this.schedule(maxChange);
      this.schedule(this.paint);
    });
    const minChange = () => this.inputNumber.min = this.state.min.toString();
    this.on("min", () => {
      this.schedule(minChange);
      this.schedule(this.paint);
    });
    const stepChange = () => this.inputNumber.step = this.state.step.toString();
    this.on("step", () => {
      this.schedule(stepChange);
      this.schedule(this.paint);
    });
    this.schedule(this.paint);
    return this;
  }
  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.input);
    return super.mount();
  }
  getValueFromDelta(e) {
    const { type, min, max, enums, scale } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const stepRange = this.stepRange;
    const stepsCount = this.stepsCount;
    const range = 100;
    const prevDistance = _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ value: e.prevValue, type, min, max, enums, scale }) * range;
    const distance = prevDistance + e.fromY - e.y;
    const denormalized = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.denormalize)(distance / range, min, max);
    const v = scale === "exp" ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normExp)(denormalized, min, max) : scale === "log" ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normLog)(denormalized, min, max) : denormalized;
    let steps = Math.round((0,_utils__WEBPACK_IMPORTED_MODULE_1__.normalize)(v, min, max) * range / stepRange);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum")
      return steps;
    if (type === "int")
      return Math.round(steps * step + min);
    return steps * step + min;
  }
}


/***/ }),

/***/ "./src/components/Led.ts":
/*!*******************************!*\
  !*** ./src/components/Led.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_116467__) => {

__nested_webpack_require_116467__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_116467__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Led)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_116467__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Led_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_116467__(/*! ./Led.scss */ "./src/components/Led.scss");
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


class Led extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "led";
    this.setStyle = () => {
      const { bgcolor, bordercolor } = this.state.style;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    };
    this.paint = () => {
      const { shape, ledbgcolor, coldcolor, warmcolor, hotcolor, overloadcolor } = this.state.style;
      const { min, max } = this.state;
      const { canvas, ctx, tempCanvas, tempCtx, distance } = this;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const drawHeight = Math.min(height, width) * 0.75;
      const drawWidth = drawHeight;
      const left = (width - drawWidth) * 0.5;
      const top = (height - drawHeight) * 0.5;
      const coldStop = (-18 - min) / (max - min);
      const warmStop = (-6 - min) / (max - min);
      const hotStop = (-3 - min) / (max - min);
      const overloadStop = -min / (max - min);
      const gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, 0);
      if (coldStop <= 1 && coldStop >= 0)
        gradient.addColorStop(coldStop, coldcolor);
      else if (coldStop > 1)
        gradient.addColorStop(1, coldcolor);
      if (warmStop <= 1 && warmStop >= 0)
        gradient.addColorStop(warmStop, warmcolor);
      if (hotStop <= 1 && hotStop >= 0)
        gradient.addColorStop(hotStop, hotcolor);
      if (overloadStop <= 1 && overloadStop >= 0)
        gradient.addColorStop(overloadStop, overloadcolor);
      else if (overloadStop < 0)
        gradient.addColorStop(0, coldcolor);
      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(0, 0, tempCanvas.width, 10);
      const d = tempCtx.getImageData(Math.min(tempCanvas.width - 1, distance * tempCanvas.width), 0, 1, 1).data;
      if (distance)
        ctx.fillStyle = `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
      else
        ctx.fillStyle = ledbgcolor;
      if (shape === "circle")
        ctx.arc(width / 2, height / 2, width / 2 - left, 0, 2 * Math.PI);
      else
        ctx.rect(left, top, drawWidth, drawHeight);
      ctx.fill();
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "regular",
        bgcolor: "rgba(18, 18, 18, 0)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)",
        shape: "circle",
        ledbgcolor: "rgba(18, 18, 18, 1)",
        coldcolor: "rgba(12, 248, 100, 1)",
        warmcolor: "rgba(195, 248, 100, 1)",
        hotcolor: "rgba(255, 193, 10, 1)",
        overloadcolor: "rgba(255, 10, 10, 1)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.canvasDiv = document.createElement("div");
    this.canvasDiv.className = `faust-ui-component-${this.className}-canvasdiv`;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 10;
    this.canvas.height = 10;
    this.ctx = this.canvas.getContext("2d");
    this.tempCanvas = document.createElement("canvas");
    this.tempCtx = this.tempCanvas.getContext("2d");
    this.tempCanvas.width = 128;
    this.tempCanvas.height = 1;
    this.setStyle();
    return this;
  }
  componentDidMount() {
    super.componentDidMount();
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));
    this.on("value", () => this.schedule(this.paint));
    this.on("max", () => this.schedule(this.paint));
    this.on("min", () => this.schedule(this.paint));
    this.on("step", () => this.schedule(this.paint));
    this.schedule(this.paint);
    return this;
  }
  mount() {
    this.canvasDiv.appendChild(this.canvas);
    this.container.appendChild(this.label);
    this.container.appendChild(this.canvasDiv);
    return super.mount();
  }
}


/***/ }),

/***/ "./src/components/Menu.ts":
/*!********************************!*\
  !*** ./src/components/Menu.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_122322__) => {

__nested_webpack_require_122322__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_122322__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Menu)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_122322__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Menu_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_122322__(/*! ./Menu.scss */ "./src/components/Menu.scss");
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


class Menu extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "menu";
    this.handleChange = (e) => {
      this.setValue(+e.currentTarget.value);
    };
    this.setStyle = () => {
      const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
      this.select.style.backgroundColor = bgcolor;
      this.select.style.borderColor = bordercolor;
      this.select.style.color = textcolor;
      this.select.style.fontSize = `${fontsize || height * grid / 4}px`;
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "regular",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.select = document.createElement("select");
    this.getOptions();
    this.setStyle();
    return this;
  }
  getOptions() {
    const { enums } = this.state;
    this.select.innerHTML = "";
    if (enums) {
      let i = 0;
      for (const key in enums) {
        const option = document.createElement("option");
        option.value = enums[key].toString();
        option.text = key;
        if (i === 0)
          option.selected = true;
        this.select.appendChild(option);
        i++;
      }
    }
  }
  componentDidMount() {
    super.componentDidMount();
    this.select.addEventListener("change", this.handleChange);
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));
    this.on("enums", () => this.schedule(this.getOptions));
    const valueChange = () => {
      for (let i = this.select.children.length - 1; i >= 0; i--) {
        const option = this.select.children[i];
        if (+option.value === this.state.value)
          this.select.selectedIndex = i;
      }
    };
    this.on("value", () => this.schedule(valueChange));
    valueChange();
    return this;
  }
  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.select);
    return super.mount();
  }
}


/***/ }),

/***/ "./src/components/Nentry.ts":
/*!**********************************!*\
  !*** ./src/components/Nentry.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_126324__) => {

__nested_webpack_require_126324__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_126324__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Nentry)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_126324__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Nentry_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_126324__(/*! ./Nentry.scss */ "./src/components/Nentry.scss");
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


class Nentry extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "nentry";
    this.handleChange = (e) => {
      this.setValue(+e.currentTarget.value);
    };
    this.setStyle = () => {
      const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
      this.input.style.backgroundColor = bgcolor;
      this.input.style.borderColor = bordercolor;
      this.input.style.color = textcolor;
      this.input.style.fontSize = `${fontsize || height * grid / 4}px`;
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "regular",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.input = document.createElement("input");
    this.input.type = "number";
    this.input.value = (+this.state.value.toFixed(3)).toString();
    this.input.max = this.state.max.toString();
    this.input.min = this.state.min.toString();
    this.input.step = this.state.step.toString();
    this.setStyle();
    return this;
  }
  componentDidMount() {
    super.componentDidMount();
    this.input.addEventListener("change", this.handleChange);
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));
    const valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString();
    this.on("value", () => this.schedule(valueChange));
    const maxChange = () => this.input.max = this.state.max.toString();
    this.on("max", () => this.schedule(maxChange));
    const minChange = () => this.input.min = this.state.min.toString();
    this.on("min", () => this.schedule(minChange));
    const stepChange = () => this.input.step = this.state.step.toString();
    this.on("step", () => this.schedule(stepChange));
    return this;
  }
  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.input);
    return super.mount();
  }
}


/***/ }),

/***/ "./src/components/Numerical.ts":
/*!*************************************!*\
  !*** ./src/components/Numerical.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_130295__) => {

__nested_webpack_require_130295__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_130295__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Numerical)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_130295__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Numerical_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_130295__(/*! ./Numerical.scss */ "./src/components/Numerical.scss");
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


class Numerical extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "numerical";
    this.setStyle = () => {
      const { height, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
      this.input.style.backgroundColor = bgcolor;
      this.input.style.borderColor = bordercolor;
      this.input.style.color = textcolor;
      this.input.style.fontSize = `${fontsize || height * grid / 4}px`;
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "regular",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.input = document.createElement("input");
    this.input.disabled = true;
    this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
    this.setStyle();
    return this;
  }
  componentDidMount() {
    super.componentDidMount();
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));
    const valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
    this.on("value", () => this.schedule(valueChange));
    return this;
  }
  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.input);
    return super.mount();
  }
}


/***/ }),

/***/ "./src/components/Radio.ts":
/*!*********************************!*\
  !*** ./src/components/Radio.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_133650__) => {

__nested_webpack_require_133650__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_133650__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Radio)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_133650__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Radio_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_133650__(/*! ./Radio.scss */ "./src/components/Radio.scss");
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


class Radio extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "radio";
    this.getOptions = () => {
      const { enums, address } = this.state;
      this.group.innerHTML = "";
      if (enums) {
        let i = 0;
        for (const key in enums) {
          const input = document.createElement("input");
          const div = document.createElement("div");
          input.value = enums[key].toString();
          input.name = address;
          input.type = "radio";
          if (i === 0)
            input.checked = true;
          input.addEventListener("change", () => {
            if (input.checked)
              this.setValue(enums[key]);
          });
          div.appendChild(input);
          div.append(key);
          this.group.appendChild(div);
          i++;
        }
      }
    };
    this.setStyle = () => {
      const { height, width, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
      const fontSize = Math.min(height * grid * 0.1, width * grid * 0.1);
      this.group.style.backgroundColor = bgcolor;
      this.group.style.borderColor = bordercolor;
      this.group.style.color = textcolor;
      this.group.style.fontSize = `${fontsize || fontSize}px`;
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "regular",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.group = document.createElement("div");
    this.group.className = "faust-ui-component-radio-group";
    this.getOptions();
    this.setStyle();
    return this;
  }
  componentDidMount() {
    super.componentDidMount();
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));
    this.on("enums", () => this.schedule(this.getOptions));
    const valueChange = () => {
      for (let i = this.group.children.length - 1; i >= 0; i--) {
        const input = this.group.children[i].querySelector("input");
        if (+input.value === this.state.value)
          input.checked = true;
      }
    };
    this.on("value", () => this.schedule(valueChange));
    valueChange();
    return this;
  }
  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.group);
    return super.mount();
  }
}


/***/ }),

/***/ "./src/components/VBargraph.ts":
/*!*************************************!*\
  !*** ./src/components/VBargraph.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_137985__) => {

__nested_webpack_require_137985__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_137985__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VBargraph)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_137985__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _VBargraph_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_137985__(/*! ./VBargraph.scss */ "./src/components/VBargraph.scss");
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


class VBargraph extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "vbargraph";
    this.setStyle = () => {
      const { height, width, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
      const fontSize = Math.min(height * grid * 0.05, width * grid * 0.2);
      this.input.style.fontSize = `${fontsize || fontSize}px`;
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    };
    this.paintValue = 0;
    this.maxValue = -Infinity;
    this.paint = () => {
      const { barwidth, barbgcolor, coldcolor, warmcolor, hotcolor, overloadcolor } = this.state.style;
      const { type, max, min, enums, scale, value } = this.state;
      const ctx = this.ctx;
      const canvas = this.canvas;
      let { width, height } = this.canvasDiv.getBoundingClientRect();
      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      const drawHeight = height * 0.9;
      const drawWidth = barwidth || Math.min(width / 3, drawHeight * 0.05);
      const left = (width - drawWidth) * 0.5;
      const top = height * 0.05;
      this.paintValue = value;
      const paintValue = this.paintValue;
      if (paintValue > this.maxValue) {
        this.maxValue = paintValue;
        if (this.maxTimer)
          window.clearTimeout(this.maxTimer);
        this.maxTimer = window.setTimeout(() => {
          this.maxValue = this.paintValue;
          this.maxTimer = void 0;
          this.schedule(this.paint);
        }, 1e3);
      }
      if (paintValue < this.maxValue && typeof this.maxTimer === "undefined") {
        this.maxTimer = window.setTimeout(() => {
          this.maxValue = this.paintValue;
          this.maxTimer = void 0;
          this.schedule(this.paint);
        }, 1e3);
      }
      const maxValue = this.maxValue;
      const coldStop = (-18 - min) / (max - min);
      const warmStop = (-6 - min) / (max - min);
      const hotStop = (-3 - min) / (max - min);
      const overloadStop = Math.max(0, -min / (max - min));
      const gradient = ctx.createLinearGradient(0, drawHeight, 0, top);
      if (coldStop <= 1 && coldStop >= 0)
        gradient.addColorStop(coldStop, coldcolor);
      else if (coldStop > 1)
        gradient.addColorStop(1, coldcolor);
      if (warmStop <= 1 && warmStop >= 0)
        gradient.addColorStop(warmStop, warmcolor);
      if (hotStop <= 1 && hotStop >= 0)
        gradient.addColorStop(hotStop, hotcolor);
      if (overloadStop <= 1 && overloadStop >= 0)
        gradient.addColorStop(overloadStop, overloadcolor);
      else if (overloadStop < 0)
        gradient.addColorStop(0, coldcolor);
      ctx.fillStyle = barbgcolor;
      if (paintValue < 0)
        ctx.fillRect(left, top + (1 - overloadStop) * drawHeight, drawWidth, drawHeight * overloadStop);
      if (paintValue < max)
        ctx.fillRect(left, top, drawWidth, (1 - overloadStop) * drawHeight - 1);
      ctx.fillStyle = gradient;
      if (paintValue > min) {
        const distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ type, max, min, enums, scale, value: Math.min(0, paintValue) }));
        ctx.fillRect(left, top + (1 - distance) * drawHeight, drawWidth, drawHeight * distance);
      }
      if (paintValue > 0) {
        const distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ type, max, min, enums, scale, value: Math.min(max, paintValue) }) - overloadStop);
        ctx.fillRect(left, top + (1 - overloadStop - distance) * drawHeight, drawWidth, drawHeight * distance - 1);
      }
      if (maxValue > paintValue) {
        if (maxValue <= 0) {
          const distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ type, max, min, enums, scale, value: Math.min(0, maxValue) }));
          ctx.fillRect(left, top + (1 - distance) * drawHeight, drawWidth, 1);
        }
        if (maxValue > 0) {
          const distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"].getDistance({ type, max, min, enums, scale, value: Math.min(max, maxValue) }) - overloadStop);
          ctx.fillRect(left, Math.max(top, top + (1 - overloadStop - distance) * drawHeight - 1), drawWidth, 1);
        }
      }
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "regular",
        bgcolor: "rgba(18, 18, 18, 0)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)",
        barwidth: void 0,
        barbgcolor: "rgba(18, 18, 18, 1)",
        coldcolor: "rgba(12, 248, 100, 1)",
        warmcolor: "rgba(195, 248, 100, 1)",
        hotcolor: "rgba(255, 193, 10, 1)",
        overloadcolor: "rgba(255, 10, 10, 1)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.flexDiv = document.createElement("div");
    this.flexDiv.className = `faust-ui-component-${this.className}-flexdiv`;
    this.canvasDiv = document.createElement("div");
    this.canvasDiv.className = `faust-ui-component-${this.className}-canvasdiv`;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 10;
    this.canvas.height = 10;
    this.ctx = this.canvas.getContext("2d");
    this.input = document.createElement("input");
    this.input.disabled = true;
    this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
    this.setStyle();
    return this;
  }
  componentDidMount() {
    super.componentDidMount();
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    this.on("style", () => {
      this.schedule(this.setStyle);
      this.schedule(this.paint);
    });
    this.on("label", () => this.schedule(this.paintLabel));
    const valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
    this.on("value", () => {
      this.schedule(valueChange);
      this.schedule(this.paint);
    });
    this.on("max", () => this.schedule(this.paint));
    this.on("min", () => this.schedule(this.paint));
    this.on("step", () => this.schedule(this.paint));
    this.schedule(this.paint);
    return this;
  }
  mount() {
    this.canvasDiv.appendChild(this.canvas);
    this.flexDiv.appendChild(this.canvasDiv);
    this.flexDiv.appendChild(this.input);
    this.container.appendChild(this.label);
    this.container.appendChild(this.flexDiv);
    return super.mount();
  }
}


/***/ }),

/***/ "./src/components/VSlider.ts":
/*!***********************************!*\
  !*** ./src/components/VSlider.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_146537__) => {

__nested_webpack_require_146537__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_146537__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VSlider)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_146537__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_146537__(/*! ./utils */ "./src/components/utils.ts");
/* harmony import */ var _VSlider_scss__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_146537__(/*! ./VSlider.scss */ "./src/components/VSlider.scss");
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



class VSlider extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.className = "vslider";
    this.interactionRect = [0, 0, 0, 0];
    this.handleChange = (e) => {
      const value = parseFloat(e.currentTarget.value);
      if (isFinite(value)) {
        const changed = this.setValue(+value);
        if (changed)
          return;
      }
      this.input.value = this.inputNumber.value + (this.state.unit || "");
    };
    this.setStyle = () => {
      const { height, width, grid, fontsize, textcolor, bgcolor, bordercolor } = this.state.style;
      const fontSize = Math.min(height * grid * 0.05, width * grid * 0.2);
      this.input.style.fontSize = `${fontsize || fontSize}px`;
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    };
    this.paint = () => {
      const { sliderwidth, sliderbgcolor, sliderbgoncolor, slidercolor } = this.state.style;
      const ctx = this.ctx;
      const canvas = this.canvas;
      const distance = this.distance;
      let { width, height } = this.canvasDiv.getBoundingClientRect();
      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      const drawHeight = height * 0.9;
      const drawWidth = sliderwidth || Math.min(width / 3, drawHeight * 0.05);
      const left = (width - drawWidth) * 0.5;
      const top = height * 0.05;
      const borderRadius = drawWidth * 0.25;
      this.interactionRect = [0, top, width, drawHeight];
      const grd = ctx.createLinearGradient(0, top, 0, top + drawHeight);
      grd.addColorStop(Math.max(0, Math.min(1, 1 - distance)), sliderbgcolor);
      grd.addColorStop(Math.max(0, Math.min(1, 1 - distance)), sliderbgoncolor);
      ctx.fillStyle = grd;
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__.fillRoundedRect)(ctx, left, top, drawWidth, drawHeight, borderRadius);
      ctx.fillStyle = slidercolor;
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__.fillRoundedRect)(ctx, left - drawWidth, top + drawHeight * (1 - distance) - drawWidth, drawWidth * 3, drawWidth * 2, borderRadius);
    };
    this.handlePointerDown = (e) => {
      const { value } = this.state;
      if (e.x < this.interactionRect[0] || e.x > this.interactionRect[0] + this.interactionRect[2] || e.y < this.interactionRect[1] || e.y > this.interactionRect[1] + this.interactionRect[3])
        return;
      const newValue = this.getValueFromPos(e);
      if (newValue !== value)
        this.setValue(this.getValueFromPos(e));
    };
    this.handlePointerDrag = (e) => {
      const newValue = this.getValueFromPos(e);
      if (newValue !== this.state.value)
        this.setValue(newValue);
    };
  }
  static get defaultProps() {
    const inherited = super.defaultProps;
    return __spreadProps(__spreadValues({}, inherited), {
      style: __spreadProps(__spreadValues({}, inherited.style), {
        fontname: "Arial",
        fontsize: void 0,
        fontface: "regular",
        bgcolor: "rgba(18, 18, 18, 0)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)",
        sliderwidth: void 0,
        sliderbgcolor: "rgba(18, 18, 18, 1)",
        sliderbgoncolor: "rgba(255, 165, 0, 1)",
        slidercolor: "rgba(200, 200, 200, 0.75)"
      })
    });
  }
  componentWillMount() {
    super.componentWillMount();
    this.flexDiv = document.createElement("div");
    this.flexDiv.className = `faust-ui-component-${this.className}-flexdiv`;
    this.canvasDiv = document.createElement("div");
    this.canvasDiv.className = `faust-ui-component-${this.className}-canvasdiv`;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 10;
    this.canvas.height = 10;
    this.ctx = this.canvas.getContext("2d");
    this.inputNumber = document.createElement("input");
    this.inputNumber.type = "number";
    this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
    this.inputNumber.max = this.state.max.toString();
    this.inputNumber.min = this.state.min.toString();
    this.inputNumber.step = this.state.step.toString();
    this.input = document.createElement("input");
    this.input.value = this.inputNumber.value + (this.state.unit || "");
    this.input.spellcheck = false;
    this.setStyle();
    return this;
  }
  componentDidMount() {
    super.componentDidMount();
    this.input.addEventListener("change", this.handleChange);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    this.on("style", () => {
      this.schedule(this.setStyle);
      this.schedule(this.paint);
    });
    this.on("label", () => this.schedule(this.paintLabel));
    const valueChange = () => {
      this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
      this.input.value = this.inputNumber.value + (this.state.unit || "");
    };
    this.on("value", () => {
      this.schedule(valueChange);
      this.schedule(this.paint);
    });
    const maxChange = () => this.inputNumber.max = this.state.max.toString();
    this.on("max", () => {
      this.schedule(maxChange);
      this.schedule(this.paint);
    });
    const minChange = () => this.inputNumber.min = this.state.min.toString();
    this.on("min", () => {
      this.schedule(minChange);
      this.schedule(this.paint);
    });
    const stepChange = () => this.inputNumber.step = this.state.step.toString();
    this.on("step", () => {
      this.schedule(stepChange);
      this.schedule(this.paint);
    });
    this.schedule(this.paint);
    return this;
  }
  mount() {
    this.canvasDiv.appendChild(this.canvas);
    this.flexDiv.appendChild(this.canvasDiv);
    this.flexDiv.appendChild(this.input);
    this.container.appendChild(this.label);
    this.container.appendChild(this.flexDiv);
    return super.mount();
  }
  get stepsCount() {
    const { type, max, min, step, enums } = this.state;
    const maxSteps = type === "enum" ? enums.length : type === "int" ? max - min : (max - min) / step;
    if (step) {
      if (type === "enum")
        return enums.length;
      if (type === "int")
        return Math.min(Math.floor((max - min) / (Math.round(step) || 0)), maxSteps);
      return Math.floor((max - min) / step);
    }
    return maxSteps;
  }
  get stepRange() {
    const full = this.interactionRect[this.className === "vslider" ? 3 : 2];
    const stepsCount = this.stepsCount;
    return full / stepsCount;
  }
  getValueFromPos(e) {
    const { type, min, max, scale } = this.state;
    const step = type === "enum" ? 1 : this.state.step || 1;
    const stepRange = this.stepRange;
    const stepsCount = this.stepsCount;
    const distance = this.className === "vslider" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0];
    const range = this.className === "vslider" ? this.interactionRect[3] : this.interactionRect[2];
    const denormalized = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.denormalize)(distance / range, min, max);
    const v = scale === "exp" ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normExp)(denormalized, min, max) : scale === "log" ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normLog)(denormalized, min, max) : denormalized;
    let steps = Math.round((0,_utils__WEBPACK_IMPORTED_MODULE_1__.normalize)(v, min, max) * range / stepRange);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum")
      return steps;
    if (type === "int")
      return Math.round(steps * step + min);
    return steps * step + min;
  }
}


/***/ }),

/***/ "./src/components/utils.ts":
/*!*********************************!*\
  !*** ./src/components/utils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_156003__) => {

__nested_webpack_require_156003__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_156003__.d(__webpack_exports__, {
/* harmony export */   "toMIDI": () => (/* binding */ toMIDI),
/* harmony export */   "toRad": () => (/* binding */ toRad),
/* harmony export */   "atodb": () => (/* binding */ atodb),
/* harmony export */   "dbtoa": () => (/* binding */ dbtoa),
/* harmony export */   "denormalize": () => (/* binding */ denormalize),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "normLog": () => (/* binding */ normLog),
/* harmony export */   "iNormLog": () => (/* binding */ iNormLog),
/* harmony export */   "normExp": () => (/* binding */ normExp),
/* harmony export */   "iNormExp": () => (/* binding */ iNormExp),
/* harmony export */   "roundedRect": () => (/* binding */ roundedRect),
/* harmony export */   "fillRoundedRect": () => (/* binding */ fillRoundedRect)
/* harmony export */ });
const toMIDI = (f) => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
const toRad = (degrees) => degrees * Math.PI / 180;
const atodb = (a) => 20 * Math.log10(a);
const dbtoa = (db) => 10 ** (db / 20);
const denormalize = (x, min, max) => min + (max - min) * x;
const normalize = (x, min, max) => (x - min) / (max - min) || 0;
const normLog = (x, min, max) => {
  const normalized = normalize(x, min, max);
  const logMin = Math.log(Math.max(Number.EPSILON, min));
  const logMax = Math.log(Math.max(Number.EPSILON, max));
  const vLog = denormalize(normalized, logMin, logMax);
  const v = Math.exp(vLog);
  return Math.max(min, Math.min(max, v));
};
const iNormLog = (vIn, min, max) => {
  const v = Math.max(min, Math.min(max, vIn));
  const vLog = Math.log(Math.max(Number.EPSILON, v));
  const logMin = Math.log(Math.max(Number.EPSILON, min));
  const logMax = Math.log(Math.max(Number.EPSILON, max));
  const normalized = normalize(vLog, logMin, logMax);
  return denormalize(normalized, min, max);
};
const normExp = iNormLog;
const iNormExp = normLog;
const roundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number")
    radii.fill(radius);
  else
    radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.stroke();
};
const fillRoundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number")
    radii.fill(radius);
  else
    radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.fill();
};


/***/ }),

/***/ "./src/instantiate.ts":
/*!****************************!*\
  !*** ./src/instantiate.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_159696__) => {

__nested_webpack_require_159696__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_159696__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FaustUI__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_159696__(/*! ./FaustUI */ "./src/FaustUI.ts");

const instantiate = () => {
  const faustUI = new _FaustUI__WEBPACK_IMPORTED_MODULE_0__["default"]({
    root: document.getElementById("root"),
    listenWindowResize: true,
    listenWindowMessage: true
  });
  let host;
  window.addEventListener("message", (e) => {
    const { source } = e;
    host = source;
  });
  window.addEventListener("keydown", (e) => {
    if (host)
      host.postMessage({ type: "keydown", key: e.key }, "*");
  });
  window.addEventListener("keyup", (e) => {
    if (host)
      host.postMessage({ type: "keyup", key: e.key }, "*");
  });
  window.faustUI = faustUI;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (instantiate);


/***/ }),

/***/ "./src/layout/AbstractGroup.ts":
/*!*************************************!*\
  !*** ./src/layout/AbstractGroup.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_160966__) => {

__nested_webpack_require_160966__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_160966__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractGroup)
/* harmony export */ });
const _AbstractGroup = class {
  constructor(group, isRoot) {
    this.isRoot = !!isRoot;
    Object.assign(this, group);
    const { hasHSizingDesc, hasVSizingDesc } = this;
    const sizing = hasHSizingDesc && hasVSizingDesc ? "both" : hasHSizingDesc ? "horizontal" : hasVSizingDesc ? "vertical" : "none";
    this.layout = {
      type: group.type,
      width: _AbstractGroup.padding * 2,
      height: _AbstractGroup.padding * 2 + _AbstractGroup.labelHeight,
      sizing
    };
  }
  get hasHSizingDesc() {
    return !!this.items.find((item) => {
      if (item instanceof _AbstractGroup)
        return item.hasHSizingDesc;
      return item.layout.sizing === "horizontal" || item.layout.sizing === "both";
    });
  }
  get hasVSizingDesc() {
    return !!this.items.find((item) => {
      if (item instanceof _AbstractGroup)
        return item.hasVSizingDesc;
      return item.layout.sizing === "vertical" || item.layout.sizing === "both";
    });
  }
  adjust() {
    return this;
  }
  expand(dX, dY) {
    return this;
  }
  offset() {
    return this;
  }
};
let AbstractGroup = _AbstractGroup;
AbstractGroup.padding = 0.2;
AbstractGroup.labelHeight = 0.25;
AbstractGroup.spaceBetween = 0.1;



/***/ }),

/***/ "./src/layout/AbstractInputItem.ts":
/*!*****************************************!*\
  !*** ./src/layout/AbstractInputItem.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_162657__) => {

__nested_webpack_require_162657__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_162657__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractInputItem)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_162657__(/*! ./AbstractItem */ "./src/layout/AbstractItem.ts");

class AbstractInputItem extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(item) {
    super(item);
    this.init = +item.init || 0;
    this.step = +item.step || 1;
  }
}


/***/ }),

/***/ "./src/layout/AbstractItem.ts":
/*!************************************!*\
  !*** ./src/layout/AbstractItem.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_163468__) => {

__nested_webpack_require_163468__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_163468__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractItem)
/* harmony export */ });
class AbstractItem {
  constructor(item) {
    Object.assign(this, item);
    this.min = isFinite(+this.min) ? +this.min : 0;
    this.max = isFinite(+this.max) ? +this.max : 1;
  }
  adjust() {
    return this;
  }
  expand(dX, dY) {
    return this;
  }
  offset() {
    return this;
  }
}


/***/ }),

/***/ "./src/layout/AbstractOutputItem.ts":
/*!******************************************!*\
  !*** ./src/layout/AbstractOutputItem.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_164245__) => {

__nested_webpack_require_164245__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_164245__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractOutputItem)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_164245__(/*! ./AbstractItem */ "./src/layout/AbstractItem.ts");

class AbstractOutputItem extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
}


/***/ }),

/***/ "./src/layout/Button.ts":
/*!******************************!*\
  !*** ./src/layout/Button.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_164925__) => {

__nested_webpack_require_164925__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_164925__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_164925__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");

class Button extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "button",
      width: 2,
      height: 1,
      sizing: "horizontal"
    };
  }
}


/***/ }),

/***/ "./src/layout/Checkbox.ts":
/*!********************************!*\
  !*** ./src/layout/Checkbox.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_165765__) => {

__nested_webpack_require_165765__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_165765__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Checkbox)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_165765__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");

class Checkbox extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "checkbox",
      width: 2,
      height: 1,
      sizing: "horizontal"
    };
  }
}


/***/ }),

/***/ "./src/layout/HBargraph.ts":
/*!*********************************!*\
  !*** ./src/layout/HBargraph.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_166615__) => {

__nested_webpack_require_166615__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_166615__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HBargraph)
/* harmony export */ });
/* harmony import */ var _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_166615__(/*! ./AbstractOutputItem */ "./src/layout/AbstractOutputItem.ts");

class HBargraph extends _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "hbargraph",
      width: 5,
      height: 1,
      sizing: "horizontal"
    };
  }
}


/***/ }),

/***/ "./src/layout/HGroup.ts":
/*!******************************!*\
  !*** ./src/layout/HGroup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_167460__) => {

__nested_webpack_require_167460__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_167460__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HGroup)
/* harmony export */ });
/* harmony import */ var _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_167460__(/*! ./AbstractGroup */ "./src/layout/AbstractGroup.ts");

class HGroup extends _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"] {
  adjust() {
    this.items.forEach((item) => {
      item.adjust();
      this.layout.width += item.layout.width;
      this.layout.height = Math.max(this.layout.height, item.layout.height + 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].padding + _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].labelHeight);
    });
    this.layout.width += _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].spaceBetween * (this.items.length - 1);
    if (this.layout.width < 1)
      this.layout.width += 1;
    return this;
  }
  expand(dX) {
    let hExpandItems = 0;
    this.items.forEach((item) => {
      if (item.layout.sizing === "both" || item.layout.sizing === "horizontal")
        hExpandItems++;
    });
    this.items.forEach((item) => {
      let dX$ = 0;
      let dY$ = 0;
      if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") {
        dX$ = hExpandItems ? dX / hExpandItems : 0;
        item.layout.width += dX$;
      }
      if (item.layout.sizing === "both" || item.layout.sizing === "vertical") {
        dY$ = this.layout.height - 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].padding - _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].labelHeight - item.layout.height;
        item.layout.height += dY$;
      }
      item.expand(dX$, dY$);
    });
    return this;
  }
  offset() {
    const { labelHeight, padding, spaceBetween } = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"];
    let $left = padding;
    const $top = padding + labelHeight;
    const { height } = this.layout;
    this.items.forEach((item) => {
      item.layout.offsetLeft = $left;
      item.layout.offsetTop = $top;
      item.layout.offsetTop += (height - labelHeight - item.layout.height) / 2 - padding;
      item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
      item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
      item.offset();
      $left += item.layout.width + spaceBetween;
    });
    return this;
  }
}


/***/ }),

/***/ "./src/layout/HSlider.ts":
/*!*******************************!*\
  !*** ./src/layout/HSlider.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_170141__) => {

__nested_webpack_require_170141__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_170141__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HSlider)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_170141__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");

class HSlider extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "hslider",
      width: 5,
      height: 1,
      sizing: "horizontal"
    };
  }
}


/***/ }),

/***/ "./src/layout/Knob.ts":
/*!****************************!*\
  !*** ./src/layout/Knob.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_170968__) => {

__nested_webpack_require_170968__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_170968__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Knob)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_170968__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");

class Knob extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "knob",
      width: 1,
      height: 1.75,
      sizing: "none"
    };
  }
}


/***/ }),

/***/ "./src/layout/Layout.ts":
/*!******************************!*\
  !*** ./src/layout/Layout.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_171791__) => {

__nested_webpack_require_171791__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_171791__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var _HSlider__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_171791__(/*! ./HSlider */ "./src/layout/HSlider.ts");
/* harmony import */ var _VSlider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_171791__(/*! ./VSlider */ "./src/layout/VSlider.ts");
/* harmony import */ var _Nentry__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_171791__(/*! ./Nentry */ "./src/layout/Nentry.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_171791__(/*! ./Button */ "./src/layout/Button.ts");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_171791__(/*! ./Checkbox */ "./src/layout/Checkbox.ts");
/* harmony import */ var _Knob__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_171791__(/*! ./Knob */ "./src/layout/Knob.ts");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_171791__(/*! ./Menu */ "./src/layout/Menu.ts");
/* harmony import */ var _Radio__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_171791__(/*! ./Radio */ "./src/layout/Radio.ts");
/* harmony import */ var _Led__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_171791__(/*! ./Led */ "./src/layout/Led.ts");
/* harmony import */ var _Numerical__WEBPACK_IMPORTED_MODULE_9__ = __nested_webpack_require_171791__(/*! ./Numerical */ "./src/layout/Numerical.ts");
/* harmony import */ var _HBargraph__WEBPACK_IMPORTED_MODULE_10__ = __nested_webpack_require_171791__(/*! ./HBargraph */ "./src/layout/HBargraph.ts");
/* harmony import */ var _VBargraph__WEBPACK_IMPORTED_MODULE_11__ = __nested_webpack_require_171791__(/*! ./VBargraph */ "./src/layout/VBargraph.ts");
/* harmony import */ var _HGroup__WEBPACK_IMPORTED_MODULE_12__ = __nested_webpack_require_171791__(/*! ./HGroup */ "./src/layout/HGroup.ts");
/* harmony import */ var _VGroup__WEBPACK_IMPORTED_MODULE_13__ = __nested_webpack_require_171791__(/*! ./VGroup */ "./src/layout/VGroup.ts");
/* harmony import */ var _TGroup__WEBPACK_IMPORTED_MODULE_14__ = __nested_webpack_require_171791__(/*! ./TGroup */ "./src/layout/TGroup.ts");















class Layout {
  static predictType(item) {
    if (item.type === "vgroup" || item.type === "hgroup" || item.type === "tgroup" || item.type === "button" || item.type === "checkbox")
      return item.type;
    if (item.type === "hbargraph" || item.type === "vbargraph") {
      if (item.meta && item.meta.find((meta) => meta.style && meta.style.startsWith("led")))
        return "led";
      if (item.meta && item.meta.find((meta) => meta.style && meta.style.startsWith("numerical")))
        return "numerical";
      return item.type;
    }
    if (item.type === "hslider" || item.type === "nentry" || item.type === "vslider") {
      if (item.meta && item.meta.find((meta) => meta.style && meta.style.startsWith("knob")))
        return "knob";
      if (item.meta && item.meta.find((meta) => meta.style && meta.style.startsWith("menu")))
        return "menu";
      if (item.meta && item.meta.find((meta) => meta.style && meta.style.startsWith("radio")))
        return "radio";
    }
    return item.type;
  }
  static getItem(item) {
    const Ctor = {
      hslider: _HSlider__WEBPACK_IMPORTED_MODULE_0__["default"],
      vslider: _VSlider__WEBPACK_IMPORTED_MODULE_1__["default"],
      nentry: _Nentry__WEBPACK_IMPORTED_MODULE_2__["default"],
      button: _Button__WEBPACK_IMPORTED_MODULE_3__["default"],
      checkbox: _Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"],
      knob: _Knob__WEBPACK_IMPORTED_MODULE_5__["default"],
      menu: _Menu__WEBPACK_IMPORTED_MODULE_6__["default"],
      radio: _Radio__WEBPACK_IMPORTED_MODULE_7__["default"],
      led: _Led__WEBPACK_IMPORTED_MODULE_8__["default"],
      numerical: _Numerical__WEBPACK_IMPORTED_MODULE_9__["default"],
      hbargraph: _HBargraph__WEBPACK_IMPORTED_MODULE_10__["default"],
      vbargraph: _VBargraph__WEBPACK_IMPORTED_MODULE_11__["default"],
      hgroup: _HGroup__WEBPACK_IMPORTED_MODULE_12__["default"],
      vgroup: _VGroup__WEBPACK_IMPORTED_MODULE_13__["default"],
      tgroup: _TGroup__WEBPACK_IMPORTED_MODULE_14__["default"]
    };
    const layoutType = this.predictType(item);
    return new Ctor[layoutType](item);
  }
  static getItems(items) {
    return items.map((item) => {
      if ("items" in item)
        item.items = this.getItems(item.items);
      return this.getItem(item);
    });
  }
  static calc(ui) {
    const rootGroup = new _VGroup__WEBPACK_IMPORTED_MODULE_13__["default"]({ items: this.getItems(ui), type: "vgroup", label: "" }, true);
    rootGroup.adjust();
    rootGroup.expand(0, 0);
    rootGroup.offset();
    return rootGroup;
  }
}


/***/ }),

/***/ "./src/layout/Led.ts":
/*!***************************!*\
  !*** ./src/layout/Led.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_176710__) => {

__nested_webpack_require_176710__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_176710__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Led)
/* harmony export */ });
/* harmony import */ var _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_176710__(/*! ./AbstractOutputItem */ "./src/layout/AbstractOutputItem.ts");

class Led extends _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "led",
      width: 1,
      height: 1,
      sizing: "none"
    };
  }
}


/***/ }),

/***/ "./src/layout/Menu.ts":
/*!****************************!*\
  !*** ./src/layout/Menu.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_177523__) => {

__nested_webpack_require_177523__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_177523__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Menu)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_177523__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");

class Menu extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "menu",
      width: 2,
      height: 1,
      sizing: "horizontal"
    };
  }
}


/***/ }),

/***/ "./src/layout/Nentry.ts":
/*!******************************!*\
  !*** ./src/layout/Nentry.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_178349__) => {

__nested_webpack_require_178349__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_178349__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Nentry)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_178349__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");

class Nentry extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "nentry",
      width: 1,
      height: 1,
      sizing: "none"
    };
  }
}


/***/ }),

/***/ "./src/layout/Numerical.ts":
/*!*********************************!*\
  !*** ./src/layout/Numerical.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_179187__) => {

__nested_webpack_require_179187__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_179187__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Numerical)
/* harmony export */ });
/* harmony import */ var _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_179187__(/*! ./AbstractOutputItem */ "./src/layout/AbstractOutputItem.ts");

class Numerical extends _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "numerical",
      width: 1,
      height: 1,
      sizing: "none"
    };
  }
}


/***/ }),

/***/ "./src/layout/Radio.ts":
/*!*****************************!*\
  !*** ./src/layout/Radio.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_180022__) => {

__nested_webpack_require_180022__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_180022__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Radio)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_180022__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");

class Radio extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "radio",
      width: 2,
      height: 2,
      sizing: "both"
    };
  }
}


/***/ }),

/***/ "./src/layout/TGroup.ts":
/*!******************************!*\
  !*** ./src/layout/TGroup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_180845__) => {

__nested_webpack_require_180845__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_180845__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TGroup)
/* harmony export */ });
/* harmony import */ var _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_180845__(/*! ./AbstractGroup */ "./src/layout/AbstractGroup.ts");

const _TGroup = class extends _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"] {
  adjust() {
    this.items.forEach((item) => {
      item.adjust();
      this.layout.width = Math.max(this.layout.width, item.layout.width + 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].padding);
      this.layout.height = Math.max(this.layout.height, item.layout.height + 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].padding + _TGroup.labelHeight);
    });
    const tabsCount = this.items.length;
    this.layout.width = Math.max(this.layout.width, tabsCount * _TGroup.tabLayout.width);
    this.layout.height += _TGroup.tabLayout.height;
    if (this.layout.width < 1)
      this.layout.width += 1;
    return this;
  }
  expand() {
    const tabsCount = this.items.length;
    this.items.forEach((item) => {
      let dY$ = 0;
      let dX$ = 0;
      if (item.layout.sizing === "both" || item.layout.sizing === "horizontal")
        dX$ = this.layout.width - 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].padding - item.layout.width;
      if (item.layout.sizing === "both" || item.layout.sizing === "vertical")
        dY$ = this.layout.height - 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].padding - _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].labelHeight - (tabsCount ? _TGroup.tabLayout.height : 0) - item.layout.height;
      item.expand(dX$, dY$);
    });
    return this;
  }
  offset() {
    const { labelHeight, padding } = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"];
    const $left = padding;
    const $top = padding + labelHeight + _TGroup.tabLayout.height;
    this.items.forEach((item) => {
      item.layout.offsetLeft = $left;
      item.layout.offsetTop = $top;
      item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
      item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
      item.offset();
    });
    return this;
  }
};
let TGroup = _TGroup;
TGroup.tabLayout = {
  width: 2,
  height: 1
};



/***/ }),

/***/ "./src/layout/VBargraph.ts":
/*!*********************************!*\
  !*** ./src/layout/VBargraph.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_183460__) => {

__nested_webpack_require_183460__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_183460__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VBargraph)
/* harmony export */ });
/* harmony import */ var _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_183460__(/*! ./AbstractOutputItem */ "./src/layout/AbstractOutputItem.ts");

class VBargraph extends _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "vbargraph",
      width: 1,
      height: 5,
      sizing: "vertical"
    };
  }
}


/***/ }),

/***/ "./src/layout/VGroup.ts":
/*!******************************!*\
  !*** ./src/layout/VGroup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_184303__) => {

__nested_webpack_require_184303__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_184303__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VGroup)
/* harmony export */ });
/* harmony import */ var _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_184303__(/*! ./AbstractGroup */ "./src/layout/AbstractGroup.ts");

class VGroup extends _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"] {
  adjust() {
    this.items.forEach((item) => {
      item.adjust();
      this.layout.width = Math.max(this.layout.width, item.layout.width + 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].padding);
      this.layout.height += item.layout.height;
    });
    this.layout.height += _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].spaceBetween * (this.items.length - 1);
    if (this.layout.width < 1)
      this.layout.width += 1;
    return this;
  }
  expand(dX, dY) {
    let vExpandItems = 0;
    this.items.forEach((item) => {
      if (item.layout.sizing === "both" || item.layout.sizing === "vertical")
        vExpandItems++;
    });
    this.items.forEach((item) => {
      let dX$ = 0;
      let dY$ = 0;
      if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") {
        dX$ = this.layout.width - 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"].padding - item.layout.width;
        item.layout.width += dX$;
      }
      if (item.layout.sizing === "both" || item.layout.sizing === "vertical") {
        dY$ = vExpandItems ? dY / vExpandItems : 0;
        item.layout.height += dY$;
      }
      item.expand(dX$, dY$);
    });
    return this;
  }
  offset() {
    const { labelHeight, padding, spaceBetween } = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__["default"];
    const $left = padding;
    let $top = padding + labelHeight;
    const { width } = this.layout;
    this.items.forEach((item) => {
      item.layout.offsetLeft = $left;
      item.layout.offsetTop = $top;
      item.layout.offsetLeft += (width - item.layout.width) / 2 - padding;
      item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
      item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
      item.offset();
      $top += item.layout.height + spaceBetween;
    });
    return this;
  }
}


/***/ }),

/***/ "./src/layout/VSlider.ts":
/*!*******************************!*\
  !*** ./src/layout/VSlider.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_186830__) => {

__nested_webpack_require_186830__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_186830__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VSlider)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_186830__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");

class VSlider extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.layout = {
      type: "vslider",
      width: 1,
      height: 5,
      sizing: "vertical"
    };
  }
}


/***/ }),

/***/ "./src/components/Base.scss":
/*!**********************************!*\
  !*** ./src/components/Base.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_187679__) => {

__nested_webpack_require_187679__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_187679__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_187679__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_187679__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_187679__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_187679__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_187679__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_187679__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_187679__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_187679__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_187679__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_187679__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_187679__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_187679__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Base_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_187679__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Base.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Base.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Base_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Base_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Base_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Base_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Button.scss":
/*!************************************!*\
  !*** ./src/components/Button.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_193245__) => {

__nested_webpack_require_193245__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_193245__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_193245__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_193245__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_193245__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_193245__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_193245__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_193245__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_193245__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_193245__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_193245__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_193245__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_193245__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_193245__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Button_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_193245__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Button.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Button.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Button_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Button_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Checkbox.scss":
/*!**************************************!*\
  !*** ./src/components/Checkbox.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_198833__) => {

__nested_webpack_require_198833__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_198833__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_198833__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_198833__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_198833__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_198833__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_198833__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_198833__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_198833__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_198833__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_198833__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_198833__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_198833__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_198833__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Checkbox_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_198833__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Checkbox.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Checkbox.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Checkbox_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Checkbox_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Checkbox_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Checkbox_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Group.scss":
/*!***********************************!*\
  !*** ./src/components/Group.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_204423__) => {

__nested_webpack_require_204423__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_204423__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_204423__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_204423__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_204423__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_204423__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_204423__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_204423__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_204423__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_204423__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_204423__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_204423__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_204423__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_204423__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Group_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_204423__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Group.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Group.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Group_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Group_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Group_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Group_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/HBargraph.scss":
/*!***************************************!*\
  !*** ./src/components/HBargraph.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_210008__) => {

__nested_webpack_require_210008__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_210008__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_210008__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_210008__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_210008__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_210008__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_210008__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_210008__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_210008__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_210008__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_210008__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_210008__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_210008__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_210008__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HBargraph_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_210008__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./HBargraph.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HBargraph.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HBargraph_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HBargraph_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HBargraph_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HBargraph_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/HSlider.scss":
/*!*************************************!*\
  !*** ./src/components/HSlider.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_215613__) => {

__nested_webpack_require_215613__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_215613__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_215613__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_215613__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_215613__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_215613__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_215613__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_215613__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_215613__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_215613__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_215613__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_215613__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_215613__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_215613__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HSlider_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_215613__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./HSlider.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HSlider.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HSlider_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HSlider_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HSlider_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HSlider_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Knob.scss":
/*!**********************************!*\
  !*** ./src/components/Knob.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_221192__) => {

__nested_webpack_require_221192__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_221192__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_221192__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_221192__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_221192__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_221192__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_221192__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_221192__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_221192__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_221192__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_221192__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_221192__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_221192__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_221192__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Knob_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_221192__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Knob.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Knob.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Knob_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Knob_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Knob_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Knob_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Led.scss":
/*!*********************************!*\
  !*** ./src/components/Led.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_226746__) => {

__nested_webpack_require_226746__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_226746__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_226746__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_226746__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_226746__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_226746__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_226746__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_226746__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_226746__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_226746__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_226746__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_226746__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_226746__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_226746__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Led_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_226746__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Led.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Led.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Led_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Led_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Led_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Led_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Menu.scss":
/*!**********************************!*\
  !*** ./src/components/Menu.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_232297__) => {

__nested_webpack_require_232297__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_232297__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_232297__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_232297__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_232297__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_232297__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_232297__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_232297__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_232297__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_232297__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_232297__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_232297__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_232297__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_232297__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Menu_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_232297__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Menu.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Menu.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Menu_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Menu_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Menu_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Menu_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Nentry.scss":
/*!************************************!*\
  !*** ./src/components/Nentry.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_237863__) => {

__nested_webpack_require_237863__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_237863__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_237863__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_237863__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_237863__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_237863__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_237863__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_237863__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_237863__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_237863__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_237863__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_237863__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_237863__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_237863__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Nentry_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_237863__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Nentry.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Nentry.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Nentry_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Nentry_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Nentry_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Nentry_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Numerical.scss":
/*!***************************************!*\
  !*** ./src/components/Numerical.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_243455__) => {

__nested_webpack_require_243455__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_243455__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_243455__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_243455__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_243455__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_243455__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_243455__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_243455__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_243455__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_243455__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_243455__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_243455__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_243455__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_243455__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Numerical_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_243455__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Numerical.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Numerical.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Numerical_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Numerical_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Numerical_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Numerical_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Radio.scss":
/*!***********************************!*\
  !*** ./src/components/Radio.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_249052__) => {

__nested_webpack_require_249052__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_249052__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_249052__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_249052__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_249052__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_249052__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_249052__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_249052__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_249052__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_249052__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_249052__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_249052__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_249052__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_249052__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Radio_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_249052__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Radio.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Radio.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Radio_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Radio_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Radio_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Radio_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/VBargraph.scss":
/*!***************************************!*\
  !*** ./src/components/VBargraph.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_254637__) => {

__nested_webpack_require_254637__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_254637__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_254637__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_254637__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_254637__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_254637__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_254637__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_254637__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_254637__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_254637__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_254637__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_254637__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_254637__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_254637__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VBargraph_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_254637__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./VBargraph.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VBargraph.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VBargraph_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VBargraph_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VBargraph_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VBargraph_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/VSlider.scss":
/*!*************************************!*\
  !*** ./src/components/VSlider.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_260242__) => {

__nested_webpack_require_260242__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_260242__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_260242__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_260242__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_260242__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_260242__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_260242__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_260242__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_260242__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_260242__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_260242__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_260242__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_260242__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_260242__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VSlider_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_260242__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./VSlider.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VSlider.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VSlider_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VSlider_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VSlider_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VSlider_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/index.scss":
/*!************************!*\
  !*** ./src/index.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_265781__) => {

__nested_webpack_require_265781__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_265781__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_265781__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_265781__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_265781__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_265781__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_265781__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nested_webpack_require_265781__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_265781__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nested_webpack_require_265781__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_265781__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nested_webpack_require_265781__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_265781__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__nested_webpack_require_265781__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_265781__(/*! !!../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/dist/cjs.js!./index.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_276261__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =   true ? __nested_webpack_require_276261__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_279177__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_279177__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nested_webpack_require_279177__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nested_webpack_require_279177__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_279177__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_279177__.o(definition, key) && !__nested_webpack_require_279177__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_279177__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_279177__.r = (exports) => {
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
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__nested_webpack_require_279177__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_279177__.d(__webpack_exports__, {
/* harmony export */   "FaustUI": () => (/* reexport safe */ _FaustUI__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "instantiate": () => (/* reexport safe */ _instantiate__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _FaustUI__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_279177__(/*! ./FaustUI */ "./src/FaustUI.ts");
/* harmony import */ var _instantiate__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_279177__(/*! ./instantiate */ "./src/instantiate.ts");



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map

/***/ })

}]);
//# sourceMappingURL=692f81aa5bbfa47d5dbd.js.map