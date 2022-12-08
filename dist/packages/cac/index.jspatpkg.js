/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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


/***/ }),

/***/ "./src/objects/base.ts":
/*!*****************************!*\
  !*** ./src/objects/base.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CacBaseObject)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class CacBaseObject extends _sdk__WEBPACK_IMPORTED_MODULE_1__.BaseObject {
}
CacBaseObject.package = _index__WEBPACK_IMPORTED_MODULE_0__.name;
CacBaseObject.author = _index__WEBPACK_IMPORTED_MODULE_0__.author;
CacBaseObject.version = _index__WEBPACK_IMPORTED_MODULE_0__.version;
CacBaseObject.description = _index__WEBPACK_IMPORTED_MODULE_0__.description;


/***/ }),

/***/ "./src/objects/default.ts":
/*!********************************!*\
  !*** ./src/objects/default.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CacDefaultObject)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class CacDefaultObject extends _sdk__WEBPACK_IMPORTED_MODULE_1__.DefaultObject {
}
CacDefaultObject.package = _index__WEBPACK_IMPORTED_MODULE_0__.name;
CacDefaultObject.author = _index__WEBPACK_IMPORTED_MODULE_0__.author;
CacDefaultObject.version = _index__WEBPACK_IMPORTED_MODULE_0__.version;
CacDefaultObject.description = _index__WEBPACK_IMPORTED_MODULE_0__.description;


/***/ }),

/***/ "./src/objects/guido-view.ts":
/*!***********************************!*\
  !*** ./src/objects/guido-view.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GuidoView)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./src/objects/base.ts");
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


class GuidoView extends _base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this._ = { guido: void 0, gmn: void 0, svgs: [], container: void 0, parser: void 0, ar: void 0, gr: void 0, busy: false };
  }
  subscribe() {
    super.subscribe();
    const setBusy = (busy) => {
      this._.busy = busy;
      this.outlet(1, busy);
    };
    const processAR = async () => {
      const { guido, parser, gmn } = this._;
      const ar = await guido.string2AR(parser, gmn);
      if (this._.gr)
        await guido.freeGR(this._.gr);
      if (this._.ar)
        await guido.freeAR(this._.ar);
      this._.ar = ar;
      this._.gr = void 0;
    };
    const processGR = async () => {
      const { guido, parser, ar } = this._;
      if (ar) {
        const { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions } = this.props;
        const settings = { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions };
        const gr = await guido.ar2grSettings(ar, settings);
        if (this._.gr)
          await guido.freeGR(this._.gr);
        this._.gr = gr;
      } else {
        const error = await guido.parserGetErrorCode(parser);
        throw error;
      }
    };
    const updateGR = async () => {
      const { guido, gr } = this._;
      if (gr) {
        const { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions } = this.props;
        const settings = { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions };
        await guido.updateGRSettings(gr, settings);
      }
    };
    const processSVG = async () => {
      const { guido, gr } = this._;
      if (gr) {
        const pagesCount = await guido.getPageCount(gr);
        const svgs = await Promise.all(new Array(pagesCount).fill(null).map((v, i) => guido.gr2SVGColored(gr, i + 1, 0, 0, 0, false)));
        this._.svgs = svgs;
        const template = document.createElement("template");
        const container = document.createElement("div");
        template.appendChild(container);
        for (const svg of svgs) {
          const svgContainer = document.createElement("div");
          svgContainer.innerHTML = svg;
          container.appendChild(svgContainer);
        }
        this._.container = container;
        this.updateUI({ children: [container] });
        this.outlet(0, svgs);
      }
    };
    const process = async () => {
      setBusy(true);
      try {
        await processAR();
        await processGR();
        await processSVG();
      } catch (error) {
        this.error(error);
      } finally {
        setBusy(false);
      }
    };
    const processFromAR = async (ar) => {
      setBusy(true);
      try {
        const { guido } = this._;
        if (this._.gr)
          await guido.freeGR(this._.gr);
        if (this._.ar)
          await guido.freeAR(this._.ar);
        this._.ar = ar;
        this._.gr = void 0;
        await processGR();
        await processSVG();
      } catch (error) {
        this.error(error);
      } finally {
        setBusy(false);
      }
    };
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("postInit", async () => {
      this._.guido = await this.env.getGuido();
      this._.parser = await this._.guido.openParser();
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (typeof data === "string") {
          this._.gmn = data;
          process();
        } else if (typeof data === "number") {
          processFromAR(data);
        }
      }
    });
    this.on("updateProps", async (props) => {
      if ("bgColor" in props) {
        this.updateUI({ containerProps: { style: { backgroundColor: props.bgColor } } });
      }
      if (Object.keys(props).filter((v) => v !== "bgColor").length) {
        if (!this._.gr)
          return;
        setBusy(true);
        try {
          await updateGR();
          await processSVG();
        } catch (error) {
          this.error(error);
        } finally {
          setBusy(false);
        }
      }
    });
    this.on("destroy", async () => {
      const { guido, ar, gr, parser } = this._;
      if (ar)
        await guido.freeAR(ar);
      if (gr)
        await guido.freeGR(gr);
      if (parser)
        await guido.closeParser(parser);
    });
  }
}
GuidoView.package = "Guido";
GuidoView.description = "Get Guido Graphic Representation from code";
GuidoView.inlets = [{
  isHot: true,
  type: "string",
  description: "Guido AR / GMN code to compile and display"
}];
GuidoView.outlets = [{
  type: "object",
  description: "SVG codes"
}, {
  type: "boolean",
  description: "Busy state update"
}];
GuidoView.props = {
  bgColor: {
    type: "color",
    default: "white",
    description: "Background color"
  },
  systemsDistance: {
    type: "number",
    default: 75,
    description: "Control distance between systems, distance is in internal units (default value: 75)"
  },
  systemsDistribution: {
    type: "number",
    default: 1,
    description: "control systems distribution. Possible values: 1 = auto, 2 = always, 3 = never"
  },
  systemsDistribLimit: {
    type: "number",
    default: 0.25,
    description: "Maximum distance allowed between two systems, for automatic distribution mode. Distance is relative to the height of the inner page. Default value: 0.25 (that is: 1/4 of the page height)"
  },
  force: {
    type: "number",
    default: 750,
    description: "force value of the Space-Force function typical values range from 400 to 1500. Default value: 750"
  },
  spring: {
    type: "number",
    default: 1.1,
    description: "the spring parameter typical values range from 1 to 5. Default value: 1.1"
  },
  neighborhoodSpacing: {
    type: "number",
    default: 0,
    description: "boolean value to tell the engine to use the Neighborhood spacing algorithm or not (default value: 0)"
  },
  optimalPageFill: {
    type: "number",
    default: 0,
    description: "boolean value to tell the engine to use the optimal page fill algorithm or not (default value: 0)"
  },
  resizePage2Music: {
    type: "number",
    default: 1,
    description: "boolean value to tell the engine to resize page to music (default value: 1)"
  },
  proportionalRenderingForceMultiplicator: {
    type: "number",
    default: 0,
    description: "float value to tell the engine what is the force multiplicator applied to proportional rendering If value is 0, proportional mode is not enabled, otherwise value corresponds to the force multiplicator value (default value: 0)"
  },
  checkLyricsCollisions: {
    type: "number",
    default: 0,
    description: "used to check lyrics and resolve collisions (default value is false)"
  }
};
GuidoView.UI = class extends _sdk__WEBPACK_IMPORTED_MODULE_0__.DOMUI {
  constructor() {
    super(...arguments);
    this.state = __spreadProps(__spreadValues({}, this.state), { children: this.object._.container ? [this.object._.container] : [], containerProps: { style: { backgroundColor: this.object.props.bgColor } } });
  }
};


/***/ }),

/***/ "./src/objects/to-guido.ts":
/*!*********************************!*\
  !*** ./src/objects/to-guido.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ToGuido)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./default */ "./src/objects/default.ts");


class ToGuido extends _default__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this._ = { guido: void 0, buffer: void 0, busy: false, busyInput: false, tasks: [] };
  }
  scheduleTask(data) {
    if (data)
      this._.tasks.push(data);
    if (!this._.busy && !this._.busyInput)
      this.executeTask();
  }
  async executeTask() {
    this._.busy = true;
    if (this._.tasks.length) {
      const data = this._.tasks.shift();
      this.outlet(0, await data.toGuidoAR(this._.guido));
      this.scheduleTask();
    }
    this._.busy = false;
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("postInit", async () => {
      this._.guido = await this.env.getGuido();
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data) && typeof this._.buffer === "number") {
          this.outlet(0, this._.buffer);
        } else if (typeof data === "object" && data.toGuidoAR) {
          this.scheduleTask(data);
        }
      } else if (inlet === 1) {
        this._.busyInput = !!data;
        this.scheduleTask();
      }
    });
  }
}
ToGuido.inlets = [{
  isHot: true,
  type: "object",
  description: "A musical object: Chord | Note | Pitch | Roll | Sequence"
}, {
  isHot: false,
  type: "boolean",
  description: "Busy state input"
}];
ToGuido.outlets = [{
  type: "anything",
  description: "A Guido reference for Guido View"
}];


/***/ }),

/***/ "./src/package-info.ts":
/*!*****************************!*\
  !*** ./src/package-info.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "React": () => (/* binding */ React),
/* harmony export */   "ReactDOM": () => (/* binding */ ReactDOM),
/* harmony export */   "SemanticUI": () => (/* binding */ SemanticUI),
/* harmony export */   "PatcherAudio": () => (/* binding */ PatcherAudio),
/* harmony export */   "OperableAudioBuffer": () => (/* binding */ OperableAudioBuffer),
/* harmony export */   "Patcher": () => (/* binding */ Patcher),
/* harmony export */   "Box": () => (/* binding */ Box),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "BaseObject": () => (/* binding */ BaseObject),
/* harmony export */   "DefaultObject": () => (/* binding */ DefaultObject),
/* harmony export */   "BaseUI": () => (/* binding */ BaseUI),
/* harmony export */   "DefaultUI": () => (/* binding */ DefaultUI),
/* harmony export */   "CanvasUI": () => (/* binding */ CanvasUI),
/* harmony export */   "CodeUI": () => (/* binding */ CodeUI),
/* harmony export */   "DefaultPopupUI": () => (/* binding */ DefaultPopupUI),
/* harmony export */   "CodePopupUI": () => (/* binding */ CodePopupUI),
/* harmony export */   "DOMUI": () => (/* binding */ DOMUI),
/* harmony export */   "generateDefaultObject": () => (/* binding */ generateDefaultObject),
/* harmony export */   "generateRemoteObject": () => (/* binding */ generateRemoteObject),
/* harmony export */   "generateRemotedObject": () => (/* binding */ generateRemotedObject),
/* harmony export */   "Bang": () => (/* binding */ Bang),
/* harmony export */   "isBang": () => (/* binding */ isBang),
/* harmony export */   "TransmitterNode": () => (/* binding */ TransmitterNode),
/* harmony export */   "TemporalAnalyserNode": () => (/* binding */ TemporalAnalyserNode),
/* harmony export */   "SpectralAnalyserNode": () => (/* binding */ SpectralAnalyserNode),
/* harmony export */   "MathUtils": () => (/* binding */ MathUtils),
/* harmony export */   "BufferUtils": () => (/* binding */ BufferUtils),
/* harmony export */   "Utils": () => (/* binding */ Utils),
/* harmony export */   "DefaultImporter": () => (/* binding */ DefaultImporter),
/* harmony export */   "getReactMonacoEditor": () => (/* binding */ getReactMonacoEditor)
/* harmony export */ });
const sdk = globalThis.jspatcherEnv.sdk;
const {
  React,
  ReactDOM,
  SemanticUI,
  PatcherAudio,
  OperableAudioBuffer,
  Patcher,
  Box,
  Line,
  BaseObject,
  DefaultObject,
  BaseUI,
  DefaultUI,
  CanvasUI,
  CodeUI,
  DefaultPopupUI,
  CodePopupUI,
  DOMUI,
  generateDefaultObject,
  generateRemoteObject,
  generateRemotedObject,
  Bang,
  isBang,
  TransmitterNode,
  TemporalAnalyserNode,
  SpectralAnalyserNode,
  MathUtils,
  BufferUtils,
  Utils,
  DefaultImporter,
  getReactMonacoEditor
} = sdk;


/***/ }),

/***/ "../../sol/dist/index.js":
/*!*******************************!*\
  !*** ../../sol/dist/index.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

(() => {
  var __webpack_modules__ = {
    "./node_modules/@tonejs/midi/dist/BinarySearch.js": (__unused_webpack_module, exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      function search(array, value, prop) {
        if (prop === void 0) {
          prop = "ticks";
        }
        var beginning = 0;
        var len = array.length;
        var end = len;
        if (len > 0 && array[len - 1][prop] <= value) {
          return len - 1;
        }
        while (beginning < end) {
          var midPoint = Math.floor(beginning + (end - beginning) / 2);
          var event_1 = array[midPoint];
          var nextEvent = array[midPoint + 1];
          if (event_1[prop] === value) {
            for (var i2 = midPoint; i2 < array.length; i2++) {
              var testEvent = array[i2];
              if (testEvent[prop] === value) {
                midPoint = i2;
              }
            }
            return midPoint;
          } else if (event_1[prop] < value && nextEvent[prop] > value) {
            return midPoint;
          } else if (event_1[prop] > value) {
            end = midPoint;
          } else if (event_1[prop] < value) {
            beginning = midPoint + 1;
          }
        }
        return -1;
      }
      exports2.search = search;
      function insert(array, event, prop) {
        if (prop === void 0) {
          prop = "ticks";
        }
        if (array.length) {
          var index = search(array, event[prop], prop);
          array.splice(index + 1, 0, event);
        } else {
          array.push(event);
        }
      }
      exports2.insert = insert;
    },
    "./node_modules/@tonejs/midi/dist/ControlChange.js": (__unused_webpack_module, exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.controlChangeNames = {
        1: "modulationWheel",
        2: "breath",
        4: "footController",
        5: "portamentoTime",
        7: "volume",
        8: "balance",
        10: "pan",
        64: "sustain",
        65: "portamentoTime",
        66: "sostenuto",
        67: "softPedal",
        68: "legatoFootswitch",
        84: "portamentoControl"
      };
      exports2.controlChangeIds = Object.keys(exports2.controlChangeNames).reduce(function(obj, key) {
        obj[exports2.controlChangeNames[key]] = key;
        return obj;
      }, {});
      var privateHeaderMap = new WeakMap();
      var privateCCNumberMap = new WeakMap();
      var ControlChange = function() {
        function ControlChange2(event, header) {
          privateHeaderMap.set(this, header);
          privateCCNumberMap.set(this, event.controllerType);
          this.ticks = event.absoluteTime;
          this.value = event.value;
        }
        Object.defineProperty(ControlChange2.prototype, "number", {
          get: function() {
            return privateCCNumberMap.get(this);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ControlChange2.prototype, "name", {
          get: function() {
            if (exports2.controlChangeNames[this.number]) {
              return exports2.controlChangeNames[this.number];
            } else {
              return null;
            }
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ControlChange2.prototype, "time", {
          get: function() {
            var header = privateHeaderMap.get(this);
            return header.ticksToSeconds(this.ticks);
          },
          set: function(t) {
            var header = privateHeaderMap.get(this);
            this.ticks = header.secondsToTicks(t);
          },
          enumerable: true,
          configurable: true
        });
        ControlChange2.prototype.toJSON = function() {
          return {
            number: this.number,
            ticks: this.ticks,
            time: this.time,
            value: this.value
          };
        };
        return ControlChange2;
      }();
      exports2.ControlChange = ControlChange;
    },
    "./node_modules/@tonejs/midi/dist/ControlChanges.js": (__unused_webpack_module, exports2, __webpack_require__2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var ControlChange_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/ControlChange.js");
      function createControlChanges() {
        return new Proxy({}, {
          get: function(target, handler) {
            if (target[handler]) {
              return target[handler];
            } else if (ControlChange_1.controlChangeIds.hasOwnProperty(handler)) {
              return target[ControlChange_1.controlChangeIds[handler]];
            }
          },
          set: function(target, handler, value) {
            if (ControlChange_1.controlChangeIds.hasOwnProperty(handler)) {
              target[ControlChange_1.controlChangeIds[handler]] = value;
            } else {
              target[handler] = value;
            }
            return true;
          }
        });
      }
      exports2.createControlChanges = createControlChanges;
    },
    "./node_modules/@tonejs/midi/dist/Encode.js": function(__unused_webpack_module, exports2, __webpack_require__2) {
      "use strict";
      var __spreadArrays = this && this.__spreadArrays || function() {
        for (var s = 0, i2 = 0, il = arguments.length; i2 < il; i2++)
          s += arguments[i2].length;
        for (var r = Array(s), k = 0, i2 = 0; i2 < il; i2++)
          for (var a = arguments[i2], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
        return r;
      };
      var __importDefault = this && this.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var midi_file_1 = __webpack_require__2("./node_modules/midi-file/index.js");
      var Header_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/Header.js");
      var array_flatten_1 = __importDefault(__webpack_require__2("./node_modules/array-flatten/array-flatten.js"));
      function encodeNote(note, channel) {
        return [
          {
            absoluteTime: note.ticks,
            channel,
            deltaTime: 0,
            noteNumber: note.midi,
            type: "noteOn",
            velocity: Math.floor(note.velocity * 127)
          },
          {
            absoluteTime: note.ticks + note.durationTicks,
            channel,
            deltaTime: 0,
            noteNumber: note.midi,
            type: "noteOff",
            velocity: Math.floor(note.noteOffVelocity * 127)
          }
        ];
      }
      function encodeNotes(track) {
        return array_flatten_1.default(track.notes.map(function(note) {
          return encodeNote(note, track.channel);
        }));
      }
      function encodeControlChange(cc, channel) {
        return {
          absoluteTime: cc.ticks,
          channel,
          controllerType: cc.number,
          deltaTime: 0,
          type: "controller",
          value: Math.floor(cc.value * 127)
        };
      }
      function encodeControlChanges(track) {
        var controlChanges = [];
        for (var i2 = 0; i2 < 127; i2++) {
          if (track.controlChanges.hasOwnProperty(i2)) {
            track.controlChanges[i2].forEach(function(cc) {
              controlChanges.push(encodeControlChange(cc, track.channel));
            });
          }
        }
        return controlChanges;
      }
      function encodePitchBend(pb, channel) {
        return {
          absoluteTime: pb.ticks,
          channel,
          deltaTime: 0,
          type: "pitchBend",
          value: pb.value
        };
      }
      function encodePitchBends(track) {
        var pitchBends = [];
        track.pitchBends.forEach(function(pb) {
          pitchBends.push(encodePitchBend(pb, track.channel));
        });
        return pitchBends;
      }
      function encodeInstrument(track) {
        return {
          absoluteTime: 0,
          channel: track.channel,
          deltaTime: 0,
          programNumber: track.instrument.number,
          type: "programChange"
        };
      }
      function encodeTrackName(name) {
        return {
          absoluteTime: 0,
          deltaTime: 0,
          meta: true,
          text: name,
          type: "trackName"
        };
      }
      function encodeTempo(tempo) {
        return {
          absoluteTime: tempo.ticks,
          deltaTime: 0,
          meta: true,
          microsecondsPerBeat: Math.floor(6e7 / tempo.bpm),
          type: "setTempo"
        };
      }
      function encodeTimeSignature(timeSig) {
        return {
          absoluteTime: timeSig.ticks,
          deltaTime: 0,
          denominator: timeSig.timeSignature[1],
          meta: true,
          metronome: 24,
          numerator: timeSig.timeSignature[0],
          thirtyseconds: 8,
          type: "timeSignature"
        };
      }
      function encodeKeySignature(keySig) {
        var keyIndex = Header_1.keySignatureKeys.indexOf(keySig.key);
        return {
          absoluteTime: keySig.ticks,
          deltaTime: 0,
          key: keyIndex + 7,
          meta: true,
          scale: keySig.scale === "major" ? 0 : 1,
          type: "keySignature"
        };
      }
      function encodeText(textEvent) {
        return {
          absoluteTime: textEvent.ticks,
          deltaTime: 0,
          meta: true,
          text: textEvent.text,
          type: textEvent.type
        };
      }
      function encode(midi) {
        var midiData = {
          header: {
            format: 1,
            numTracks: midi.tracks.length + 1,
            ticksPerBeat: midi.header.ppq
          },
          tracks: __spreadArrays([
            __spreadArrays([
              {
                absoluteTime: 0,
                deltaTime: 0,
                meta: true,
                text: midi.header.name,
                type: "trackName"
              }
            ], midi.header.keySignatures.map(function(keySig) {
              return encodeKeySignature(keySig);
            }), midi.header.meta.map(function(e) {
              return encodeText(e);
            }), midi.header.tempos.map(function(tempo) {
              return encodeTempo(tempo);
            }), midi.header.timeSignatures.map(function(timeSig) {
              return encodeTimeSignature(timeSig);
            }))
          ], midi.tracks.map(function(track) {
            return __spreadArrays([
              encodeTrackName(track.name),
              encodeInstrument(track)
            ], encodeNotes(track), encodeControlChanges(track), encodePitchBends(track));
          }))
        };
        midiData.tracks = midiData.tracks.map(function(track) {
          track = track.sort(function(a, b) {
            return a.absoluteTime - b.absoluteTime;
          });
          var lastTime = 0;
          track.forEach(function(note) {
            note.deltaTime = note.absoluteTime - lastTime;
            lastTime = note.absoluteTime;
            delete note.absoluteTime;
          });
          track.push({
            deltaTime: 0,
            meta: true,
            type: "endOfTrack"
          });
          return track;
        });
        return new Uint8Array(midi_file_1.writeMidi(midiData));
      }
      exports2.encode = encode;
    },
    "./node_modules/@tonejs/midi/dist/Header.js": (__unused_webpack_module, exports2, __webpack_require__2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var BinarySearch_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/BinarySearch.js");
      var privatePPQMap = new WeakMap();
      exports2.keySignatureKeys = [
        "Cb",
        "Gb",
        "Db",
        "Ab",
        "Eb",
        "Bb",
        "F",
        "C",
        "G",
        "D",
        "A",
        "E",
        "B",
        "F#",
        "C#"
      ];
      var Header = function() {
        function Header2(midiData) {
          var _this = this;
          this.tempos = [];
          this.timeSignatures = [];
          this.keySignatures = [];
          this.meta = [];
          this.name = "";
          privatePPQMap.set(this, 480);
          if (midiData) {
            privatePPQMap.set(this, midiData.header.ticksPerBeat);
            midiData.tracks.forEach(function(track) {
              return track.forEach(function(event) {
                if (event.meta) {
                  if (event.type === "timeSignature") {
                    _this.timeSignatures.push({
                      ticks: event.absoluteTime,
                      timeSignature: [
                        event.numerator,
                        event.denominator
                      ]
                    });
                  } else if (event.type === "setTempo") {
                    _this.tempos.push({
                      bpm: 6e7 / event.microsecondsPerBeat,
                      ticks: event.absoluteTime
                    });
                  } else if (event.type === "keySignature") {
                    _this.keySignatures.push({
                      key: exports2.keySignatureKeys[event.key + 7],
                      scale: event.scale === 0 ? "major" : "minor",
                      ticks: event.absoluteTime
                    });
                  }
                }
              });
            });
            midiData.tracks[0].forEach(function(event) {
              if (event.meta) {
                if (event.type === "trackName") {
                  _this.name = event.text;
                } else if (event.type === "text" || event.type === "cuePoint" || event.type === "marker" || event.type === "lyrics") {
                  _this.meta.push({
                    text: event.text,
                    ticks: event.absoluteTime,
                    type: event.type
                  });
                }
              }
            });
            this.update();
          }
        }
        Header2.prototype.update = function() {
          var _this = this;
          var currentTime = 0;
          var lastEventBeats = 0;
          this.tempos.sort(function(a, b) {
            return a.ticks - b.ticks;
          });
          this.tempos.forEach(function(event, index) {
            var lastBPM = index > 0 ? _this.tempos[index - 1].bpm : _this.tempos[0].bpm;
            var beats = event.ticks / _this.ppq - lastEventBeats;
            var elapsedSeconds = 60 / lastBPM * beats;
            event.time = elapsedSeconds + currentTime;
            currentTime = event.time;
            lastEventBeats += beats;
          });
          this.timeSignatures.sort(function(a, b) {
            return a.ticks - b.ticks;
          });
          this.timeSignatures.forEach(function(event, index) {
            var lastEvent = index > 0 ? _this.timeSignatures[index - 1] : _this.timeSignatures[0];
            var elapsedBeats = (event.ticks - lastEvent.ticks) / _this.ppq;
            var elapsedMeasures = elapsedBeats / lastEvent.timeSignature[0] / (lastEvent.timeSignature[1] / 4);
            lastEvent.measures = lastEvent.measures || 0;
            event.measures = elapsedMeasures + lastEvent.measures;
          });
        };
        Header2.prototype.ticksToSeconds = function(ticks) {
          var index = BinarySearch_1.search(this.tempos, ticks);
          if (index !== -1) {
            var tempo = this.tempos[index];
            var tempoTime = tempo.time;
            var elapsedBeats = (ticks - tempo.ticks) / this.ppq;
            return tempoTime + 60 / tempo.bpm * elapsedBeats;
          } else {
            var beats = ticks / this.ppq;
            return 60 / 120 * beats;
          }
        };
        Header2.prototype.ticksToMeasures = function(ticks) {
          var index = BinarySearch_1.search(this.timeSignatures, ticks);
          if (index !== -1) {
            var timeSigEvent = this.timeSignatures[index];
            var elapsedBeats = (ticks - timeSigEvent.ticks) / this.ppq;
            return timeSigEvent.measures + elapsedBeats / (timeSigEvent.timeSignature[0] / timeSigEvent.timeSignature[1]) / 4;
          } else {
            return ticks / this.ppq / 4;
          }
        };
        Object.defineProperty(Header2.prototype, "ppq", {
          get: function() {
            return privatePPQMap.get(this);
          },
          enumerable: true,
          configurable: true
        });
        Header2.prototype.secondsToTicks = function(seconds) {
          var index = BinarySearch_1.search(this.tempos, seconds, "time");
          if (index !== -1) {
            var tempo = this.tempos[index];
            var tempoTime = tempo.time;
            var elapsedTime = seconds - tempoTime;
            var elapsedBeats = elapsedTime / (60 / tempo.bpm);
            return Math.round(tempo.ticks + elapsedBeats * this.ppq);
          } else {
            var beats = seconds / (60 / 120);
            return Math.round(beats * this.ppq);
          }
        };
        Header2.prototype.toJSON = function() {
          return {
            keySignatures: this.keySignatures,
            meta: this.meta,
            name: this.name,
            ppq: this.ppq,
            tempos: this.tempos.map(function(t) {
              return {
                bpm: t.bpm,
                ticks: t.ticks
              };
            }),
            timeSignatures: this.timeSignatures
          };
        };
        Header2.prototype.fromJSON = function(json) {
          this.name = json.name;
          this.tempos = json.tempos.map(function(t) {
            return Object.assign({}, t);
          });
          this.timeSignatures = json.timeSignatures.map(function(t) {
            return Object.assign({}, t);
          });
          this.keySignatures = json.keySignatures.map(function(t) {
            return Object.assign({}, t);
          });
          this.meta = json.meta.map(function(t) {
            return Object.assign({}, t);
          });
          privatePPQMap.set(this, json.ppq);
          this.update();
        };
        Header2.prototype.setTempo = function(bpm) {
          this.tempos = [
            {
              bpm,
              ticks: 0
            }
          ];
          this.update();
        };
        return Header2;
      }();
      exports2.Header = Header;
    },
    "./node_modules/@tonejs/midi/dist/Instrument.js": (__unused_webpack_module, exports2, __webpack_require__2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var InstrumentMaps_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/InstrumentMaps.js");
      var privateTrackMap = new WeakMap();
      var Instrument = function() {
        function Instrument2(trackData, track) {
          this.number = 0;
          privateTrackMap.set(this, track);
          this.number = 0;
          if (trackData) {
            var programChange = trackData.find(function(e) {
              return e.type === "programChange";
            });
            if (programChange) {
              this.number = programChange.programNumber;
            }
          }
        }
        Object.defineProperty(Instrument2.prototype, "name", {
          get: function() {
            if (this.percussion) {
              return InstrumentMaps_1.DrumKitByPatchID[this.number];
            } else {
              return InstrumentMaps_1.instrumentByPatchID[this.number];
            }
          },
          set: function(n) {
            var patchNumber = InstrumentMaps_1.instrumentByPatchID.indexOf(n);
            if (patchNumber !== -1) {
              this.number = patchNumber;
            }
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Instrument2.prototype, "family", {
          get: function() {
            if (this.percussion) {
              return "drums";
            } else {
              return InstrumentMaps_1.InstrumentFamilyByID[Math.floor(this.number / 8)];
            }
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Instrument2.prototype, "percussion", {
          get: function() {
            var track = privateTrackMap.get(this);
            return track.channel === 9;
          },
          enumerable: true,
          configurable: true
        });
        Instrument2.prototype.toJSON = function() {
          return {
            family: this.family,
            name: this.name,
            number: this.number
          };
        };
        Instrument2.prototype.fromJSON = function(json) {
          this.number = json.number;
        };
        return Instrument2;
      }();
      exports2.Instrument = Instrument;
    },
    "./node_modules/@tonejs/midi/dist/InstrumentMaps.js": (__unused_webpack_module, exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.instrumentByPatchID = [
        "acoustic grand piano",
        "bright acoustic piano",
        "electric grand piano",
        "honky-tonk piano",
        "electric piano 1",
        "electric piano 2",
        "harpsichord",
        "clavi",
        "celesta",
        "glockenspiel",
        "music box",
        "vibraphone",
        "marimba",
        "xylophone",
        "tubular bells",
        "dulcimer",
        "drawbar organ",
        "percussive organ",
        "rock organ",
        "church organ",
        "reed organ",
        "accordion",
        "harmonica",
        "tango accordion",
        "acoustic guitar (nylon)",
        "acoustic guitar (steel)",
        "electric guitar (jazz)",
        "electric guitar (clean)",
        "electric guitar (muted)",
        "overdriven guitar",
        "distortion guitar",
        "guitar harmonics",
        "acoustic bass",
        "electric bass (finger)",
        "electric bass (pick)",
        "fretless bass",
        "slap bass 1",
        "slap bass 2",
        "synth bass 1",
        "synth bass 2",
        "violin",
        "viola",
        "cello",
        "contrabass",
        "tremolo strings",
        "pizzicato strings",
        "orchestral harp",
        "timpani",
        "string ensemble 1",
        "string ensemble 2",
        "synthstrings 1",
        "synthstrings 2",
        "choir aahs",
        "voice oohs",
        "synth voice",
        "orchestra hit",
        "trumpet",
        "trombone",
        "tuba",
        "muted trumpet",
        "french horn",
        "brass section",
        "synthbrass 1",
        "synthbrass 2",
        "soprano sax",
        "alto sax",
        "tenor sax",
        "baritone sax",
        "oboe",
        "english horn",
        "bassoon",
        "clarinet",
        "piccolo",
        "flute",
        "recorder",
        "pan flute",
        "blown bottle",
        "shakuhachi",
        "whistle",
        "ocarina",
        "lead 1 (square)",
        "lead 2 (sawtooth)",
        "lead 3 (calliope)",
        "lead 4 (chiff)",
        "lead 5 (charang)",
        "lead 6 (voice)",
        "lead 7 (fifths)",
        "lead 8 (bass + lead)",
        "pad 1 (new age)",
        "pad 2 (warm)",
        "pad 3 (polysynth)",
        "pad 4 (choir)",
        "pad 5 (bowed)",
        "pad 6 (metallic)",
        "pad 7 (halo)",
        "pad 8 (sweep)",
        "fx 1 (rain)",
        "fx 2 (soundtrack)",
        "fx 3 (crystal)",
        "fx 4 (atmosphere)",
        "fx 5 (brightness)",
        "fx 6 (goblins)",
        "fx 7 (echoes)",
        "fx 8 (sci-fi)",
        "sitar",
        "banjo",
        "shamisen",
        "koto",
        "kalimba",
        "bag pipe",
        "fiddle",
        "shanai",
        "tinkle bell",
        "agogo",
        "steel drums",
        "woodblock",
        "taiko drum",
        "melodic tom",
        "synth drum",
        "reverse cymbal",
        "guitar fret noise",
        "breath noise",
        "seashore",
        "bird tweet",
        "telephone ring",
        "helicopter",
        "applause",
        "gunshot"
      ];
      exports2.InstrumentFamilyByID = [
        "piano",
        "chromatic percussion",
        "organ",
        "guitar",
        "bass",
        "strings",
        "ensemble",
        "brass",
        "reed",
        "pipe",
        "synth lead",
        "synth pad",
        "synth effects",
        "world",
        "percussive",
        "sound effects"
      ];
      exports2.DrumKitByPatchID = {
        0: "standard kit",
        8: "room kit",
        16: "power kit",
        24: "electronic kit",
        25: "tr-808 kit",
        32: "jazz kit",
        40: "brush kit",
        48: "orchestra kit",
        56: "sound fx kit"
      };
    },
    "./node_modules/@tonejs/midi/dist/Midi.js": function(__unused_webpack_module, exports2, __webpack_require__2) {
      "use strict";
      var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      var __generator = this && this.__generator || function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var midi_file_1 = __webpack_require__2("./node_modules/midi-file/index.js");
      var Encode_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/Encode.js");
      var Header_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/Header.js");
      var Track_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/Track.js");
      var Midi = function() {
        function Midi2(midiArray) {
          var _this = this;
          var midiData = null;
          if (midiArray) {
            if (midiArray instanceof ArrayBuffer) {
              midiArray = new Uint8Array(midiArray);
            }
            midiData = midi_file_1.parseMidi(midiArray);
            midiData.tracks.forEach(function(track) {
              var currentTicks = 0;
              track.forEach(function(event) {
                currentTicks += event.deltaTime;
                event.absoluteTime = currentTicks;
              });
            });
            midiData.tracks = splitTracks(midiData.tracks);
          }
          this.header = new Header_1.Header(midiData);
          this.tracks = [];
          if (midiArray) {
            this.tracks = midiData.tracks.map(function(trackData) {
              return new Track_1.Track(trackData, _this.header);
            });
            if (midiData.header.format === 1 && this.tracks[0].duration === 0) {
              this.tracks.shift();
            }
          }
        }
        Midi2.fromUrl = function(url) {
          return __awaiter(this, void 0, void 0, function() {
            var response, arrayBuffer;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, fetch(url)];
                case 1:
                  response = _a.sent();
                  if (!response.ok)
                    return [3, 3];
                  return [4, response.arrayBuffer()];
                case 2:
                  arrayBuffer = _a.sent();
                  return [2, new Midi2(arrayBuffer)];
                case 3:
                  throw new Error("could not load " + url);
              }
            });
          });
        };
        Object.defineProperty(Midi2.prototype, "name", {
          get: function() {
            return this.header.name;
          },
          set: function(n) {
            this.header.name = n;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Midi2.prototype, "duration", {
          get: function() {
            var durations = this.tracks.map(function(t) {
              return t.duration;
            });
            return Math.max.apply(Math, durations);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Midi2.prototype, "durationTicks", {
          get: function() {
            var durationTicks = this.tracks.map(function(t) {
              return t.durationTicks;
            });
            return Math.max.apply(Math, durationTicks);
          },
          enumerable: true,
          configurable: true
        });
        Midi2.prototype.addTrack = function() {
          var track = new Track_1.Track(void 0, this.header);
          this.tracks.push(track);
          return track;
        };
        Midi2.prototype.toArray = function() {
          return Encode_1.encode(this);
        };
        Midi2.prototype.toJSON = function() {
          return {
            header: this.header.toJSON(),
            tracks: this.tracks.map(function(track) {
              return track.toJSON();
            })
          };
        };
        Midi2.prototype.fromJSON = function(json) {
          var _this = this;
          this.header = new Header_1.Header();
          this.header.fromJSON(json.header);
          this.tracks = json.tracks.map(function(trackJSON) {
            var track = new Track_1.Track(void 0, _this.header);
            track.fromJSON(trackJSON);
            return track;
          });
        };
        Midi2.prototype.clone = function() {
          var midi = new Midi2();
          midi.fromJSON(this.toJSON());
          return midi;
        };
        return Midi2;
      }();
      exports2.Midi = Midi;
      var Track_2 = __webpack_require__2("./node_modules/@tonejs/midi/dist/Track.js");
      exports2.Track = Track_2.Track;
      var Header_2 = __webpack_require__2("./node_modules/@tonejs/midi/dist/Header.js");
      exports2.Header = Header_2.Header;
      function splitTracks(tracks) {
        var newTracks = [];
        for (var i2 = 0; i2 < tracks.length; i2++) {
          var defaultTrack = newTracks.length;
          var trackMap = new Map();
          var currentProgram = Array(16).fill(0);
          for (var _i = 0, _a = tracks[i2]; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            var targetTrack = defaultTrack;
            var channel = event_1.channel;
            if (channel !== void 0) {
              if (event_1.type === "programChange") {
                currentProgram[channel] = event_1.programNumber;
              }
              var program = currentProgram[channel];
              var trackKey = program + " " + channel;
              if (trackMap.has(trackKey)) {
                targetTrack = trackMap.get(trackKey);
              } else {
                targetTrack = defaultTrack + trackMap.size;
                trackMap.set(trackKey, targetTrack);
              }
            }
            if (!newTracks[targetTrack]) {
              newTracks.push([]);
            }
            newTracks[targetTrack].push(event_1);
          }
        }
        return newTracks;
      }
    },
    "./node_modules/@tonejs/midi/dist/Note.js": (__unused_webpack_module, exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      function midiToPitch(midi) {
        var octave = Math.floor(midi / 12) - 1;
        return midiToPitchClass(midi) + octave.toString();
      }
      function midiToPitchClass(midi) {
        var scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        var note = midi % 12;
        return scaleIndexToNote[note];
      }
      function pitchClassToMidi(pitch) {
        var scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        return scaleIndexToNote.indexOf(pitch);
      }
      var pitchToMidi = function() {
        var regexp = /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i;
        var noteToScaleIndex = {
          cbb: -2,
          cb: -1,
          c: 0,
          "c#": 1,
          cx: 2,
          dbb: 0,
          db: 1,
          d: 2,
          "d#": 3,
          dx: 4,
          ebb: 2,
          eb: 3,
          e: 4,
          "e#": 5,
          ex: 6,
          fbb: 3,
          fb: 4,
          f: 5,
          "f#": 6,
          fx: 7,
          gbb: 5,
          gb: 6,
          g: 7,
          "g#": 8,
          gx: 9,
          abb: 7,
          ab: 8,
          a: 9,
          "a#": 10,
          ax: 11,
          bbb: 9,
          bb: 10,
          b: 11,
          "b#": 12,
          bx: 13
        };
        return function(note) {
          var split = regexp.exec(note);
          var pitch = split[1];
          var octave = split[2];
          var index = noteToScaleIndex[pitch.toLowerCase()];
          return index + (parseInt(octave, 10) + 1) * 12;
        };
      }();
      var privateHeaderMap = new WeakMap();
      var Note = function() {
        function Note2(noteOn, noteOff, header) {
          privateHeaderMap.set(this, header);
          this.midi = noteOn.midi;
          this.velocity = noteOn.velocity;
          this.noteOffVelocity = noteOff.velocity;
          this.ticks = noteOn.ticks;
          this.durationTicks = noteOff.ticks - noteOn.ticks;
        }
        Object.defineProperty(Note2.prototype, "name", {
          get: function() {
            return midiToPitch(this.midi);
          },
          set: function(n) {
            this.midi = pitchToMidi(n);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Note2.prototype, "octave", {
          get: function() {
            return Math.floor(this.midi / 12) - 1;
          },
          set: function(o) {
            var diff = o - this.octave;
            this.midi += diff * 12;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Note2.prototype, "pitch", {
          get: function() {
            return midiToPitchClass(this.midi);
          },
          set: function(p) {
            this.midi = 12 * (this.octave + 1) + pitchClassToMidi(p);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Note2.prototype, "duration", {
          get: function() {
            var header = privateHeaderMap.get(this);
            return header.ticksToSeconds(this.ticks + this.durationTicks) - header.ticksToSeconds(this.ticks);
          },
          set: function(d) {
            var header = privateHeaderMap.get(this);
            var noteEndTicks = header.secondsToTicks(this.time + d);
            this.durationTicks = noteEndTicks - this.ticks;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Note2.prototype, "time", {
          get: function() {
            var header = privateHeaderMap.get(this);
            return header.ticksToSeconds(this.ticks);
          },
          set: function(t) {
            var header = privateHeaderMap.get(this);
            this.ticks = header.secondsToTicks(t);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Note2.prototype, "bars", {
          get: function() {
            var header = privateHeaderMap.get(this);
            return header.ticksToMeasures(this.ticks);
          },
          enumerable: true,
          configurable: true
        });
        Note2.prototype.toJSON = function() {
          return {
            duration: this.duration,
            durationTicks: this.durationTicks,
            midi: this.midi,
            name: this.name,
            ticks: this.ticks,
            time: this.time,
            velocity: this.velocity
          };
        };
        return Note2;
      }();
      exports2.Note = Note;
    },
    "./node_modules/@tonejs/midi/dist/PitchBend.js": (__unused_webpack_module, exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var privateHeaderMap = new WeakMap();
      var PitchBend = function() {
        function PitchBend2(event, header) {
          privateHeaderMap.set(this, header);
          this.ticks = event.absoluteTime;
          this.value = event.value;
        }
        Object.defineProperty(PitchBend2.prototype, "time", {
          get: function() {
            var header = privateHeaderMap.get(this);
            return header.ticksToSeconds(this.ticks);
          },
          set: function(t) {
            var header = privateHeaderMap.get(this);
            this.ticks = header.secondsToTicks(t);
          },
          enumerable: true,
          configurable: true
        });
        PitchBend2.prototype.toJSON = function() {
          return {
            ticks: this.ticks,
            time: this.time,
            value: this.value
          };
        };
        return PitchBend2;
      }();
      exports2.PitchBend = PitchBend;
    },
    "./node_modules/@tonejs/midi/dist/Track.js": (__unused_webpack_module, exports2, __webpack_require__2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var BinarySearch_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/BinarySearch.js");
      var ControlChange_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/ControlChange.js");
      var ControlChanges_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/ControlChanges.js");
      var PitchBend_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/PitchBend.js");
      var Instrument_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/Instrument.js");
      var Note_1 = __webpack_require__2("./node_modules/@tonejs/midi/dist/Note.js");
      var privateHeaderMap = new WeakMap();
      var Track = function() {
        function Track2(trackData, header) {
          var _this = this;
          this.name = "";
          this.notes = [];
          this.controlChanges = ControlChanges_1.createControlChanges();
          this.pitchBends = [];
          privateHeaderMap.set(this, header);
          if (trackData) {
            var nameEvent = trackData.find(function(e) {
              return e.type === "trackName";
            });
            this.name = nameEvent ? nameEvent.text : "";
          }
          this.instrument = new Instrument_1.Instrument(trackData, this);
          this.channel = 0;
          if (trackData) {
            var noteOns = trackData.filter(function(event) {
              return event.type === "noteOn";
            });
            var noteOffs = trackData.filter(function(event) {
              return event.type === "noteOff";
            });
            var _loop_1 = function() {
              var currentNote = noteOns.shift();
              this_1.channel = currentNote.channel;
              var offIndex = noteOffs.findIndex(function(note) {
                return note.noteNumber === currentNote.noteNumber && note.absoluteTime >= currentNote.absoluteTime;
              });
              if (offIndex !== -1) {
                var noteOff = noteOffs.splice(offIndex, 1)[0];
                this_1.addNote({
                  durationTicks: noteOff.absoluteTime - currentNote.absoluteTime,
                  midi: currentNote.noteNumber,
                  noteOffVelocity: noteOff.velocity / 127,
                  ticks: currentNote.absoluteTime,
                  velocity: currentNote.velocity / 127
                });
              }
            };
            var this_1 = this;
            while (noteOns.length) {
              _loop_1();
            }
            var controlChanges = trackData.filter(function(event) {
              return event.type === "controller";
            });
            controlChanges.forEach(function(event) {
              _this.addCC({
                number: event.controllerType,
                ticks: event.absoluteTime,
                value: event.value / 127
              });
            });
            var pitchBends = trackData.filter(function(event) {
              return event.type === "pitchBend";
            });
            pitchBends.forEach(function(event) {
              _this.addPitchBend({
                ticks: event.absoluteTime,
                value: event.value / Math.pow(2, 13)
              });
            });
            var endOfTrackEvent = trackData.find(function(event) {
              return event.type === "endOfTrack";
            });
            this.endOfTrackTicks = endOfTrackEvent !== void 0 ? endOfTrackEvent.absoluteTime : void 0;
          }
        }
        Track2.prototype.addNote = function(props) {
          var header = privateHeaderMap.get(this);
          var note = new Note_1.Note({
            midi: 0,
            ticks: 0,
            velocity: 1
          }, {
            ticks: 0,
            velocity: 0
          }, header);
          Object.assign(note, props);
          BinarySearch_1.insert(this.notes, note, "ticks");
          return this;
        };
        Track2.prototype.addCC = function(props) {
          var header = privateHeaderMap.get(this);
          var cc = new ControlChange_1.ControlChange({
            controllerType: props.number
          }, header);
          delete props.number;
          Object.assign(cc, props);
          if (!Array.isArray(this.controlChanges[cc.number])) {
            this.controlChanges[cc.number] = [];
          }
          BinarySearch_1.insert(this.controlChanges[cc.number], cc, "ticks");
          return this;
        };
        Track2.prototype.addPitchBend = function(props) {
          var header = privateHeaderMap.get(this);
          var pb = new PitchBend_1.PitchBend({}, header);
          Object.assign(pb, props);
          BinarySearch_1.insert(this.pitchBends, pb, "ticks");
          return this;
        };
        Object.defineProperty(Track2.prototype, "duration", {
          get: function() {
            if (!this.notes.length) {
              return 0;
            }
            var maxDuration = this.notes[this.notes.length - 1].time + this.notes[this.notes.length - 1].duration;
            for (var i2 = 0; i2 < this.notes.length - 1; i2++) {
              var duration = this.notes[i2].time + this.notes[i2].duration;
              if (maxDuration < duration) {
                maxDuration = duration;
              }
            }
            return maxDuration;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Track2.prototype, "durationTicks", {
          get: function() {
            if (!this.notes.length) {
              return 0;
            }
            var maxDuration = this.notes[this.notes.length - 1].ticks + this.notes[this.notes.length - 1].durationTicks;
            for (var i2 = 0; i2 < this.notes.length - 1; i2++) {
              var duration = this.notes[i2].ticks + this.notes[i2].durationTicks;
              if (maxDuration < duration) {
                maxDuration = duration;
              }
            }
            return maxDuration;
          },
          enumerable: true,
          configurable: true
        });
        Track2.prototype.fromJSON = function(json) {
          var _this = this;
          this.name = json.name;
          this.channel = json.channel;
          this.instrument = new Instrument_1.Instrument(void 0, this);
          this.instrument.fromJSON(json.instrument);
          if (json.endOfTrackTicks !== void 0) {
            this.endOfTrackTicks = json.endOfTrackTicks;
          }
          for (var number in json.controlChanges) {
            if (json.controlChanges[number]) {
              json.controlChanges[number].forEach(function(cc) {
                _this.addCC({
                  number: cc.number,
                  ticks: cc.ticks,
                  value: cc.value
                });
              });
            }
          }
          json.notes.forEach(function(n) {
            _this.addNote({
              durationTicks: n.durationTicks,
              midi: n.midi,
              ticks: n.ticks,
              velocity: n.velocity
            });
          });
        };
        Track2.prototype.toJSON = function() {
          var controlChanges = {};
          for (var i2 = 0; i2 < 127; i2++) {
            if (this.controlChanges.hasOwnProperty(i2)) {
              controlChanges[i2] = this.controlChanges[i2].map(function(c) {
                return c.toJSON();
              });
            }
          }
          var json = {
            channel: this.channel,
            controlChanges,
            pitchBends: this.pitchBends.map(function(pb) {
              return pb.toJSON();
            }),
            instrument: this.instrument.toJSON(),
            name: this.name,
            notes: this.notes.map(function(n) {
              return n.toJSON();
            })
          };
          if (this.endOfTrackTicks !== void 0) {
            json.endOfTrackTicks = this.endOfTrackTicks;
          }
          return json;
        };
        return Track2;
      }();
      exports2.Track = Track;
    },
    "./node_modules/array-flatten/array-flatten.js": (module) => {
      "use strict";
      module.exports = flatten;
      module.exports.from = flattenFrom;
      module.exports.depth = flattenDepth;
      module.exports.fromDepth = flattenFromDepth;
      function flatten(array) {
        if (!Array.isArray(array)) {
          throw new TypeError("Expected value to be an array");
        }
        return flattenFrom(array);
      }
      function flattenFrom(array) {
        return flattenDown(array, []);
      }
      function flattenDepth(array, depth) {
        if (!Array.isArray(array)) {
          throw new TypeError("Expected value to be an array");
        }
        return flattenFromDepth(array, depth);
      }
      function flattenFromDepth(array, depth) {
        if (typeof depth !== "number") {
          throw new TypeError("Expected the depth to be a number");
        }
        return flattenDownDepth(array, [], depth);
      }
      function flattenDown(array, result) {
        for (var i2 = 0; i2 < array.length; i2++) {
          var value = array[i2];
          if (Array.isArray(value)) {
            flattenDown(value, result);
          } else {
            result.push(value);
          }
        }
        return result;
      }
      function flattenDownDepth(array, result, depth) {
        depth--;
        for (var i2 = 0; i2 < array.length; i2++) {
          var value = array[i2];
          if (depth > -1 && Array.isArray(value)) {
            flattenDownDepth(value, result, depth);
          } else {
            result.push(value);
          }
        }
        return result;
      }
    },
    "./src/Articulation.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isArticulation": () => isArticulation,
        "EnumArticulation": () => EnumArticulation,
        "Articulation": () => Articulation,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      const isArticulation = (x) => {
        return x instanceof Articulation || typeof x === "object" && x !== null && (typeof x.name === "undefined" || typeof x.name === "string") && typeof x.velocity === "number" && typeof x.length === "number";
      };
      class EnumArticulation {
        static get STACCATISSIMO() {
          return new Articulation("staccatissimo", 1, 0.25);
        }
        static get STACCATO() {
          return new Articulation("staccato", 1, 0.4);
        }
        static get MEZZO_STACCATO() {
          return new Articulation("mezzo staccato", 1, 0.75);
        }
        static get LEGATO() {
          return new Articulation("legato", 1, 0.95);
        }
        static get TENUTO() {
          return new Articulation("tenuto", 1, 1);
        }
        static get SOSTENUTO() {
          return new Articulation("sostenuto", 1, 1.2);
        }
        static get ACCENT() {
          return new Articulation("accent", 1.2, 1);
        }
        static get MARCATO() {
          return new Articulation("marcato", 1.5, 1);
        }
        static get PIZZICATO() {
          return new Articulation("pizzicato", 1, 1);
        }
        static get MUTED() {
          return new Articulation("muted", 1, 1);
        }
      }
      const _Articulation = class {
        constructor(p1, velocityIn = 1, lengthIn = 1) {
          this.become(p1, velocityIn, lengthIn);
        }
        become(p1, velocityIn = 1, lengthIn = 1) {
          if (isArticulation(p1)) {
            this.name = p1.name;
            this.velocity = p1.velocity;
            this.length = p1.length;
          } else {
            this.name = p1;
            this.velocity = velocityIn;
            this.length = lengthIn;
          }
          return this;
        }
        clone() {
          return new _Articulation(this);
        }
        toString() {
          return `Art: ${this.name} [Vel: ${this.velocity} Len: ${this.length}]`;
        }
      };
      let Articulation = _Articulation;
      Articulation.isArticulation = isArticulation;
      Articulation.EnumArticulation = EnumArticulation;
      const __WEBPACK_DEFAULT_EXPORT__ = Articulation;
    },
    "./src/Chord.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isChord": () => isChord,
        "isChordArray": () => isChordArray,
        "Chord": () => Chord,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _Interval__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Interval.ts");
      var _Note__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Note.ts");
      var _Pitch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Pitch.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/utils.ts");
      var _EnumChord__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__2("./src/EnumChord.ts");
      const isChord = (x) => {
        return x instanceof Chord || typeof x === "object" && x !== null && (0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNote)(x.base) && (0, _Interval__WEBPACK_IMPORTED_MODULE_0__.isIntervalArray)(x.intervals);
      };
      const isChordArray = (x) => {
        return Array.isArray(x) && x.every((e) => isChord(e));
      };
      const _Chord = class {
        constructor(p1, ...arrayIn) {
          this.base = null;
          this.intervals = [];
          this.become(p1, ...arrayIn);
        }
        become(p1, ...arrayIn) {
          if (isChord(p1)) {
            const _isNote = (0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNote)(p1);
            if (_isNote)
              this.base = new _Note__WEBPACK_IMPORTED_MODULE_1__["default"](p1.base);
            else
              this.base = new _Pitch__WEBPACK_IMPORTED_MODULE_2__["default"](p1.base);
            this.intervals = _Interval__WEBPACK_IMPORTED_MODULE_0__["default"].fromArray(p1.intervals);
            return this;
          }
          if (Array.isArray(p1)) {
            const [e0, ...e1] = p1;
            return this.become(e0, ...e1);
          }
          if (typeof p1 === "string") {
            const isNote2 = _Note__WEBPACK_IMPORTED_MODULE_1__["default"].REGEX.exec(p1);
            if (isNote2)
              this.base = new _Note__WEBPACK_IMPORTED_MODULE_1__["default"](p1);
            else
              this.base = new _Pitch__WEBPACK_IMPORTED_MODULE_2__["default"](p1);
          } else if (typeof p1 === "number") {
            this.base = new _Pitch__WEBPACK_IMPORTED_MODULE_2__["default"](p1);
          } else {
            this.base = p1;
          }
          if ((0, _Pitch__WEBPACK_IMPORTED_MODULE_2__.isPitchArray)(arrayIn)) {
            this.intervals = arrayIn.sort(_Pitch__WEBPACK_IMPORTED_MODULE_2__["default"].compare).map((pitch) => this.base.getInterval(pitch));
          } else if ((0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNoteArray)(arrayIn)) {
            this.intervals = arrayIn.map((note) => this.base.getInterval(note));
          } else if ((0, _utils__WEBPACK_IMPORTED_MODULE_3__.isNumberArray)(arrayIn)) {
            this.intervals = arrayIn.map((pitch) => this.base.getInterval(new _Pitch__WEBPACK_IMPORTED_MODULE_2__["default"](pitch)));
          } else if ((0, _Interval__WEBPACK_IMPORTED_MODULE_0__.isIntervalArray)(arrayIn)) {
            this.intervals = arrayIn.sort(_Interval__WEBPACK_IMPORTED_MODULE_0__["default"].compare);
          } else {
            this.intervals = _Interval__WEBPACK_IMPORTED_MODULE_0__["default"].fromArray(arrayIn).sort(_Interval__WEBPACK_IMPORTED_MODULE_0__["default"].compare);
          }
          return this;
        }
        get size() {
          return this.intervals.length + 1;
        }
        get notes() {
          return [this.base, ...this.intervals.map((i2) => this.base.clone().add(i2))];
        }
        set notes(notesIn) {
          if (!notesIn.length)
            return;
          const [p1, ...arrayIn] = notesIn;
          this.base = p1;
          if ((0, _Pitch__WEBPACK_IMPORTED_MODULE_2__.isPitchArray)(arrayIn)) {
            this.intervals = arrayIn.sort(_Pitch__WEBPACK_IMPORTED_MODULE_2__["default"].compare).map((pitch) => this.base.getInterval(pitch));
          } else if ((0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNoteArray)(arrayIn)) {
            this.intervals = arrayIn.map((note) => this.base.getInterval(note));
          }
        }
        get isAbsolute() {
          return this.base instanceof _Pitch__WEBPACK_IMPORTED_MODULE_2__["default"];
        }
        toAbsolute(octaveIn = 4) {
          if (!this.isAbsolute)
            this.base = new _Pitch__WEBPACK_IMPORTED_MODULE_2__["default"](this.base, octaveIn);
          return this;
        }
        get ratio() {
          return (0, _utils__WEBPACK_IMPORTED_MODULE_3__.nearestFractions)([1, ...this.intervals.map((i2) => i2.ratio)]);
        }
        get reciprocal() {
          return (0, _utils__WEBPACK_IMPORTED_MODULE_3__.nearestReciprocals)([1, ...this.intervals.map((i2) => i2.ratio)]);
        }
        removeDup() {
          const { intervals } = this;
          this.intervals = intervals.filter((i0, i2) => {
            const { offset } = i0;
            if (offset === 0)
              return false;
            if (intervals.findIndex((i1) => i1 === i0 || i1.offset === offset) === i2)
              return true;
            return false;
          });
        }
        reorder() {
          this.intervals = this.intervals.sort(_Interval__WEBPACK_IMPORTED_MODULE_0__["default"].compare);
          if (this.intervals.length && this.intervals[0].offset < 0) {
            const d = this.intervals[0].reverse();
            for (let i2 = 1; i2 < this.intervals.length; i2++) {
              this.intervals[i2].add(d);
            }
          }
        }
        contains(noteIn) {
          for (const note of this.notes) {
            if (noteIn.equals(note))
              return true;
          }
          return false;
        }
        inverseUp() {
          if (this.intervals.length === 0)
            return this;
          const interval0 = this.intervals[0];
          this.base.add(interval0);
          for (let i2 = 0; i2 < this.intervals.length - 1; i2++) {
            this.intervals[i2] = this.intervals[i2 + 1].sub(interval0);
          }
          this.intervals[this.intervals.length - 1] = interval0.octaveReverse();
          return this;
        }
        inverseDown() {
          if (this.intervals.length === 0)
            return this;
          const interval0 = this.intervals[this.intervals.length - 1].octaveReverse();
          this.base.sub(interval0);
          for (let i2 = this.intervals.length - 1; i2 > 0; i2--) {
            this.intervals[i2] = this.intervals[i2 - 1].add(interval0);
          }
          this.intervals[0] = interval0;
          return this;
        }
        inverse(inversion) {
          if (this.intervals.length === 0)
            return this;
          if (inversion > 0) {
            for (let i2 = 0; i2 < inversion; i2++) {
              this.inverseUp();
            }
          }
          if (inversion < 0) {
            for (let i2 = 0; i2 > inversion; i2--) {
              this.inverseDown();
            }
          }
          return this;
        }
        get enumChord() {
          return _EnumChord__WEBPACK_IMPORTED_MODULE_4__["default"].byChord(this);
        }
        get phantomBase() {
          return this.base.clone().div(this.ratio[0]);
        }
        get phantomTop() {
          return this.base.clone().mul(this.reciprocal[0]);
        }
        add(p1) {
          if (p1 instanceof _Interval__WEBPACK_IMPORTED_MODULE_0__["default"]) {
            this.intervals.push(p1);
          } else if ((0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNote)(p1)) {
            this.intervals.push(this.base.getInterval(p1));
          } else if ((0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNoteArray)(p1)) {
            this.intervals.push(...p1.map((p) => this.base.getInterval(p)));
          } else {
            const d = this.base.getInterval(p1.base);
            for (const interval of p1.intervals) {
              this.intervals.push(d.clone().add(interval));
            }
          }
          this.reorder();
          return this;
        }
        static add(a, b) {
          return a.clone().add(b);
        }
        sub(p1) {
          if (p1 instanceof _Interval__WEBPACK_IMPORTED_MODULE_0__["default"]) {
            this.intervals = this.intervals.filter((i0) => !i0.equals(p1));
          } else if ((0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNote)(p1)) {
            const that = p1 instanceof _Note__WEBPACK_IMPORTED_MODULE_1__["default"] ? p1 : (0, _Pitch__WEBPACK_IMPORTED_MODULE_2__.isPitch)(p1) ? new _Pitch__WEBPACK_IMPORTED_MODULE_2__["default"](p1) : new _Note__WEBPACK_IMPORTED_MODULE_1__["default"](p1);
            const notes = this.notes.filter((n0) => !that.equals(n0));
            if (!notes.length)
              return null;
            this.notes = notes;
          } else if ((0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNoteArray)(p1)) {
            let { notes } = this;
            p1.forEach((n) => {
              const that = n instanceof _Note__WEBPACK_IMPORTED_MODULE_1__["default"] ? n : (0, _Pitch__WEBPACK_IMPORTED_MODULE_2__.isPitch)(n) ? new _Pitch__WEBPACK_IMPORTED_MODULE_2__["default"](n) : new _Note__WEBPACK_IMPORTED_MODULE_1__["default"](n);
              notes = this.notes.filter((n0) => !that.equals(n0));
            });
            if (!notes.length)
              return null;
            this.notes = notes;
          } else {
            this.sub(p1.notes);
          }
          this.reorder();
          return this;
        }
        static sub(a, b) {
          return a.clone().sub(b);
        }
        compareTo(that) {
          return _Chord.compare(this, that);
        }
        static compare(x, y) {
          return x.intervals.length - y.intervals.length;
        }
        equals(chordIn) {
          return isChord(chordIn) && this.base.equals(chordIn.base) && chordIn.intervals.length === this.intervals.length && chordIn.intervals.every((e, i2) => this.intervals[i2].equals(e));
        }
        toString() {
          return this.base.toString() + ":" + this.intervals.toString();
        }
        clone() {
          return new _Chord(this);
        }
        async toGuidoAR(factory) {
          factory.openMusic();
          factory.openVoice();
          factory.openChord();
          for (const note of this.notes) {
            note.openGuidoEvent(factory);
          }
          factory.closeChord();
          factory.closeVoice();
          return factory.closeMusic();
        }
        *[Symbol.iterator]() {
          for (const note of this.notes) {
            yield note;
          }
        }
        getTendancy(that) {
          const m = [];
          const { notes } = this;
          const { notes: $notes } = that;
          for (let i2 = 0; i2 < $notes.length; i2++) {
            m[i2] = [];
            for (let j = 0; j < notes.length; j++) {
              m[i2][j] = notes[j].getTendancy($notes[i2]);
            }
          }
          return m.map((r) => Math.max(...r)).reduce((s, e) => s + e, 0) / m.length;
        }
        getStability(that) {
          const m = [];
          const { notes } = this;
          const { notes: $notes } = that;
          for (let i2 = 0; i2 < $notes.length; i2++) {
            m[i2] = [];
            for (let j = 0; j < notes.length; j++) {
              m[i2][j] = notes[j].getStability($notes[i2]);
            }
          }
          return m.map((r) => Math.max(...r)).reduce((s, e) => s + e, 0) / m.length;
        }
      };
      let Chord = _Chord;
      Chord.isChord = isChord;
      Chord.isChordArray = isChordArray;
      Chord.EnumChord = _EnumChord__WEBPACK_IMPORTED_MODULE_4__["default"];
      const __WEBPACK_DEFAULT_EXPORT__ = Chord;
    },
    "./src/Color.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isColor": () => isColor,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/utils.ts");
      const isColor = (x) => {
        return x instanceof Color || typeof x === "object" && x !== null && typeof x.t === "number" && typeof x.s === "number" && typeof x.d === "number" && x.major === "number";
      };
      const _Color = class {
        constructor(p1, s, d, major) {
          if (isColor(p1)) {
            this.t = p1.t;
            this.s = p1.s;
            this.d = p1.d;
            this.major = p1.major;
          } else if ((0, _utils__WEBPACK_IMPORTED_MODULE_0__.isNumberArray)(p1)) {
            this.fromArray(p1);
          } else {
            this.t = p1 || 0;
            this.s = s || 0;
            this.d = d || 0;
            this.major = major || 0;
          }
        }
        toArray() {
          return [this.t, this.s, this.d, this.major];
        }
        fromArray(color) {
          this.t = color[0] || 0;
          this.s = color[1] || 0;
          this.d = color[2] || 0;
          this.major = color[3] || 0;
          return this;
        }
        equals(colorIn) {
          return isColor(colorIn) && this.t === colorIn.t && this.s === colorIn.s && this.d === colorIn.d && this.major === colorIn.major;
        }
        toString() {
          return `Color{t=${this.t}, s=${this.s}, d=${this.d}, major=${this.major}}`;
        }
        clone() {
          return new _Color(this);
        }
      };
      let Color = _Color;
      Color.isColor = isColor;
      const __WEBPACK_DEFAULT_EXPORT__ = Color;
    },
    "./src/Duration.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isDurationAbbreviation": () => isDurationAbbreviation,
        "isDuration": () => isDuration,
        "Duration": () => Duration,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/utils.ts");
      const isDurationAbbreviation = (x) => {
        return typeof x === "string" && (x === "0" || !!x.match(/^\d+n(t|d)?$/) && new Array(8).fill(null).map((v, i2) => 2 ** i2).indexOf(parseInt(x)) !== -1);
      };
      const isDuration = (x) => {
        return x instanceof Duration || typeof x === "object" && x !== null && typeof x.isAbsolute === "boolean" && (x.isAbsolute ? typeof x.seconds === "number" : typeof x.numerator === "number" && typeof x.denominator === "number");
      };
      const _Duration = class {
        static fromArray(arrayIn) {
          return arrayIn.map((e) => new _Duration(e));
        }
        constructor(p1, p2) {
          this.become(p1, p2);
        }
        become(p1, p2) {
          if (isDurationAbbreviation(p1)) {
            this.isAbsolute = false;
            this.denominator = parseInt(p1);
            if (p1.endsWith("d")) {
              this.numerator = 3;
              this.denominator *= 2;
            } else if (p1.endsWith("t")) {
              this.numerator = 2;
              this.denominator *= 3;
            } else {
              this.numerator = 1;
            }
            this.simplify();
          } else if (isDuration(p1)) {
            this.isAbsolute = p1.isAbsolute;
            this.numerator = p1.numerator;
            this.denominator = p1.denominator;
            this.seconds = p1.seconds;
            this.simplify();
          } else if (typeof p2 === "number") {
            this.isAbsolute = false;
            this.numerator = p1;
            this.denominator = p2;
            this.simplify();
          } else {
            this.isAbsolute = true;
            this.seconds = p1;
          }
          return this;
        }
        get value() {
          return this.isAbsolute ? this.seconds : this.numerator / this.denominator;
        }
        get isRelative() {
          return !this.isAbsolute;
        }
        getBeats(p1) {
          if (!this.isAbsolute)
            return this.value * 4;
          if (typeof p1 === "undefined")
            throw new Error("Absolute duration needs BPM to calculate.");
          if (typeof p1 === "number")
            return this.value * 4 * p1 / 60;
          return this.value * 4 * p1.getSecondsFromBeats();
        }
        getTicks(p1) {
          return Math.round(this.getBeats(p1) * 480);
        }
        toAbsolute(p1) {
          if (this.isAbsolute)
            return this;
          if (typeof p1 === "number")
            this.seconds = this.getBeats() * 60 / p1;
          else
            this.seconds = p1.getSecondsFromBeats(this.getBeats());
          this.isAbsolute = true;
          return this;
        }
        toRelative(p1) {
          if (!this.isAbsolute)
            return this;
          if (typeof p1 === "number")
            this.numerator = this.seconds * p1 / 60;
          else
            this.numerator = p1.getBeatsFromSeconds(this.seconds);
          this.denominator = 4;
          this.isAbsolute = false;
          this.simplify();
          return this;
        }
        add(durationIn) {
          if (this.isAbsolute && durationIn.isAbsolute) {
            this.seconds += durationIn.seconds;
          } else if (!this.isAbsolute && !durationIn.isAbsolute) {
            if (this.denominator === durationIn.denominator) {
              this.numerator += durationIn.numerator;
            } else {
              this.numerator = this.numerator * durationIn.denominator + durationIn.numerator * this.denominator;
              this.denominator *= durationIn.denominator;
            }
            this.simplify();
          } else {
            throw new Error("Cannot operate between absolute and relative duration.");
          }
          return this;
        }
        static add(a, b) {
          return a.clone().add(b);
        }
        sub(durationIn) {
          if (this.isAbsolute && durationIn.isAbsolute) {
            this.seconds -= durationIn.seconds;
          } else if (!this.isAbsolute && !durationIn.isAbsolute) {
            if (this.denominator === durationIn.denominator) {
              this.numerator -= durationIn.numerator;
            } else {
              this.numerator = this.numerator * durationIn.denominator - durationIn.numerator * this.denominator;
              this.denominator *= durationIn.denominator;
            }
            this.simplify();
          } else {
            throw new Error("Cannot operate between absolute and relative duration.");
          }
          return this;
        }
        static sub(a, b) {
          return a.clone().sub(b);
        }
        mul(f) {
          if (this.isAbsolute) {
            this.seconds *= f;
          } else {
            this.numerator *= f;
            this.simplify();
          }
          return this;
        }
        static mul(a, b) {
          return a.clone().mul(b);
        }
        div(p1) {
          if (typeof p1 === "number") {
            if (this.isAbsolute) {
              this.seconds /= p1;
            } else {
              this.denominator *= p1;
              this.simplify();
            }
            return this;
          }
          if (this.isAbsolute === p1.isAbsolute)
            return this.value / p1.value;
          throw new Error("Cannot operate between absolute and relative duration.");
        }
        static div(a, b) {
          if (typeof b === "number")
            return a.clone().div(b);
          return a.clone().div(b);
        }
        equals(durationIn) {
          return isDuration(durationIn) && this.compareTo(durationIn) === 0;
        }
        compareTo(that) {
          return _Duration.compare(this, that);
        }
        static compare(x, y) {
          if (x.isAbsolute !== y.isAbsolute)
            throw new Error("Cannot compare between absolute and relative duration");
          return x.isAbsolute ? x.seconds - y.seconds : x.numerator / x.denominator - y.numerator / y.denominator;
        }
        simplify() {
          if (this.numerator === 0)
            return this;
          const f = Math.max((0, _utils__WEBPACK_IMPORTED_MODULE_0__.precisionFactor)(this.numerator), (0, _utils__WEBPACK_IMPORTED_MODULE_0__.precisionFactor)(this.denominator));
          const $gcd = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.gcd)(this.numerator * f, this.denominator * f) / f;
          if ($gcd !== 1) {
            this.denominator /= $gcd;
            this.numerator /= $gcd;
          }
          const [n, d] = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.nearestFractions)([this.numerator, this.denominator], 1.001);
          this.numerator = n;
          this.denominator = d;
          return this;
        }
        clone() {
          return new _Duration(this);
        }
        static random(randomIn, min, max, step) {
          if (min.equals(max))
            return min.clone();
          const d = max.clone().sub(min);
          const steps = randomIn.randint(0, ~~d.div(step));
          return min.clone().add(step.clone().mul(steps));
        }
        toString() {
          return this.isAbsolute ? this.seconds + "s" : this.getBeats() + " beats";
        }
      };
      let Duration = _Duration;
      Duration.isDuration = isDuration;
      Duration.isDuractionAbbreviation = isDurationAbbreviation;
      const __WEBPACK_DEFAULT_EXPORT__ = Duration;
    },
    "./src/Enum.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "Enum": () => Enum,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      class Enum {
        static values() {
          return this.indexes.map((key) => this[key]);
        }
        static valueOf(key) {
          return this[key];
        }
        constructor() {
        }
        get className() {
          return "Enum";
        }
        name() {
          throw new Error("Method not implemented");
        }
        ordinal() {
          return this.constructor.indexes.indexOf(this.name());
        }
        toString() {
          return this.name();
        }
      }
      Enum.indexes = [];
      const __WEBPACK_DEFAULT_EXPORT__ = Enum;
    },
    "./src/EnumChord.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isEnumChord": () => isEnumChord,
        "EnumChord": () => EnumChord,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _Interval__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Interval.ts");
      var _Enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Enum.ts");
      var _Chord__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Chord.ts");
      const isEnumChord = (x) => {
        return x instanceof EnumChord || typeof x === "object" && x !== null && x.className === "EnumChord" && (0, _Interval__WEBPACK_IMPORTED_MODULE_0__.isIntervalArray)(x.intervals);
      };
      const _EnumChord = class extends _Enum__WEBPACK_IMPORTED_MODULE_1__["default"] {
        static get MAJ() {
          return new _EnumChord("MAJ", "M3", "P5");
        }
        static get MIN() {
          return new _EnumChord("MIN", "m3", "P5");
        }
        static get AUG() {
          return new _EnumChord("AUG", "M3", "A5");
        }
        static get DIM() {
          return new _EnumChord("DIM", "m3", "d5");
        }
        static get SUS2() {
          return new _EnumChord("SUS2", "M2", "P5");
        }
        static get SUS() {
          return new _EnumChord("SUS", "P5", "P5");
        }
        static get SUS4() {
          return new _EnumChord("SUS4", "P5", "P5");
        }
        static get DOM7() {
          return new _EnumChord("DOM7", "M3", "P5", "m7");
        }
        static get MAJ7() {
          return new _EnumChord("MAJ7", "M3", "P5", "M7");
        }
        static get MINMAJ7() {
          return new _EnumChord("MINMAJ7", "m3", "P5", "M7");
        }
        static get MIN7() {
          return new _EnumChord("MIN7", "m3", "P5", "m7");
        }
        static get AUGMAJ7() {
          return new _EnumChord("AUGMAJ7", "M3", "A5", "M7");
        }
        static get AUG7() {
          return new _EnumChord("AUG7", "M3", "A5", "m7");
        }
        static get DIMMIN7() {
          return new _EnumChord("DIMMIN7", "m3", "d5", "m7");
        }
        static get DIM7() {
          return new _EnumChord("DIM7", "m3", "d5", "d7");
        }
        static get DOM7DIM5() {
          return new _EnumChord("DOM7DIM5", "M3", "d5", "m7");
        }
        constructor(p1, ...intervalsIn) {
          super();
          if (typeof p1 === "string") {
            this._name = p1;
            this.intervals = _Interval__WEBPACK_IMPORTED_MODULE_0__["default"].fromArray(intervalsIn);
          } else {
            this._name = p1._name;
            this.intervals = p1.intervals.map((i2) => i2.clone());
          }
        }
        static from(that) {
          return this.byChord(that);
        }
        static byChord(chordIn) {
          return this.values().find((enumChord) => {
            return enumChord.intervals.length === chordIn.intervals.length && enumChord.intervals.every((interval, i2) => interval.equals(chordIn.intervals[i2]));
          }) || null;
        }
        static byName(chordIn) {
          return _EnumChord[chordIn];
        }
        get className() {
          return "EnumChord";
        }
        toChord(base) {
          return new _Chord__WEBPACK_IMPORTED_MODULE_2__.Chord(base, ...this.intervals);
        }
        name() {
          return this._name;
        }
        equals(chordIn) {
          return ((0, _Chord__WEBPACK_IMPORTED_MODULE_2__.isChord)(chordIn) || isEnumChord(chordIn)) && chordIn.intervals.length === this.intervals.length && chordIn.intervals.every((e, i2) => this.intervals[i2].equals(e));
        }
        clone() {
          return new _EnumChord(this);
        }
      };
      let EnumChord = _EnumChord;
      EnumChord.indexes = ["MAJ", "MIN", "AUG", "DIM", "SUS2", "SUS", "SUS4", "DOM7", "MAJ7", "MINMAJ7", "MIN7", "AUGMAJ7", "AUG7", "DIMMIN7", "DIM7", "DOM7DIM5"];
      const __WEBPACK_DEFAULT_EXPORT__ = EnumChord;
    },
    "./src/EnumNote.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isEnumNote": () => isEnumNote,
        "EnumNote": () => EnumNote,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/utils.ts");
      var _Interval__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Interval.ts");
      var _Enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Enum.ts");
      const isEnumNote = (x) => {
        return x instanceof EnumNote || typeof x === "object" && x !== null && x.className === "EnumNote" && _Interval__WEBPACK_IMPORTED_MODULE_1__.DEGREE_TO_OFFSET.indexOf(x.offset) !== -1;
      };
      const _EnumNote = class extends _Enum__WEBPACK_IMPORTED_MODULE_2__["default"] {
        static get C() {
          return new _EnumNote(0);
        }
        static get D() {
          return new _EnumNote(2);
        }
        static get E() {
          return new _EnumNote(4);
        }
        static get F() {
          return new _EnumNote(5);
        }
        static get G() {
          return new _EnumNote(7);
        }
        static get A() {
          return new _EnumNote(9);
        }
        static get B() {
          return new _EnumNote(11);
        }
        constructor(offsetIn) {
          super();
          this.offset = offsetIn;
        }
        static from(that) {
          return this.byOffset(that.offset);
        }
        static byOffset(offsetIn) {
          if (typeof offsetIn !== "number")
            return null;
          const name = _EnumNote.offsetMap[(0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(offsetIn, 12)];
          if (name)
            return _EnumNote[name];
          throw new SyntaxError(`No such note with offset ${offsetIn}.`);
        }
        static byIndex(indexIn) {
          if (typeof indexIn !== "number")
            return null;
          const name = _EnumNote.indexes[(0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(indexIn, 7)];
          if (name)
            return _EnumNote[name];
          throw new SyntaxError(`No such note with index ${indexIn}.`);
        }
        get className() {
          return "EnumNote";
        }
        name() {
          return _EnumNote.offsetMap[this.offset];
        }
        get index() {
          return _Interval__WEBPACK_IMPORTED_MODULE_1__.DEGREE_TO_OFFSET.indexOf(this.offset);
        }
        ordinal() {
          return this.index;
        }
        equals(noteIn) {
          return noteIn instanceof _EnumNote && noteIn.offset === this.offset;
        }
      };
      let EnumNote = _EnumNote;
      EnumNote.indexes = ["C", "D", "E", "F", "G", "A", "B"];
      EnumNote.offsetMap = { 0: "C", 2: "D", 4: "E", 5: "F", 7: "G", 9: "A", 11: "B" };
      EnumNote.c = _EnumNote.C;
      EnumNote.d = _EnumNote.D;
      EnumNote.e = _EnumNote.E;
      EnumNote.f = _EnumNote.F;
      EnumNote.g = _EnumNote.G;
      EnumNote.a = _EnumNote.A;
      EnumNote.b = _EnumNote.B;
      const __WEBPACK_DEFAULT_EXPORT__ = EnumNote;
    },
    "./src/Frequency.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "Frequency": () => Frequency,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      class Frequency {
      }
      Frequency.A440 = 440;
      Frequency.SEMITONE = 2 ** (1 / 12);
      Frequency.THRES_AUDIT = 2 ** (1 / 36);
      Frequency.getRatio = (d) => 2 ** (d / 12);
      const __WEBPACK_DEFAULT_EXPORT__ = Frequency;
    },
    "./src/Interval.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "DEGREE_TO_OFFSET": () => DEGREE_TO_OFFSET,
        "isInterval": () => isInterval,
        "isIntervalArray": () => isIntervalArray,
        "Interval": () => Interval,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/utils.ts");
      var _Enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Enum.ts");
      var _Frequency__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Frequency.ts");
      const DEGREE_TO_OFFSET = [0, 2, 4, 5, 7, 9, 11];
      const isInterval = (x) => {
        return x instanceof Interval || typeof x === "object" && x !== null && typeof x.degree === "number" && typeof x.onset === "number" && typeof x.octave === "number";
      };
      const isIntervalArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.isObjectArray)(x, isInterval);
      };
      const _EnumIntervalProperty = class extends _Enum__WEBPACK_IMPORTED_MODULE_1__["default"] {
        static get PERFECT() {
          return new _EnumIntervalProperty("P");
        }
        static get MAJOR() {
          return new _EnumIntervalProperty("M");
        }
        static get MINOR() {
          return new _EnumIntervalProperty("m");
        }
        static get AUGMENTED() {
          return new _EnumIntervalProperty("A");
        }
        static get DIMINISHED() {
          return new _EnumIntervalProperty("d");
        }
        static byAbb(abbIn) {
          const name = this.abbMap[abbIn];
          if (name)
            return _EnumIntervalProperty[name];
          throw new SyntaxError(`No such interval property with abbreviation ${abbIn}.`);
        }
        constructor(abbIn) {
          super();
          this.abb = abbIn;
        }
        get className() {
          return "EnumIntervalProperty";
        }
        name() {
          return _EnumIntervalProperty.abbMap[this.abb];
        }
        toString() {
          return this.name();
        }
        equals(propertyIn) {
          return propertyIn instanceof _EnumIntervalProperty && this.abb === propertyIn.abb;
        }
      };
      let EnumIntervalProperty = _EnumIntervalProperty;
      EnumIntervalProperty.indexes = ["PERFECT", "MAJOR", "MINOR", "AUGMENTED", "DIMINISHED"];
      EnumIntervalProperty.abbMap = { P: "PERFECT", M: "MAJOR", m: "MINOR", A: "AUGMENTED", d: "DIMINISHED" };
      const _Interval = class {
        static getOffsetFromProperty(propertyIn, degreeIn) {
          const degree = typeof degreeIn === "number" ? (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(degreeIn - 1, 7) + 1 : 1;
          if (degree === 1 || degree === 4 || degree === 5) {
            if (propertyIn.equals(EnumIntervalProperty.PERFECT))
              return 0;
            if (propertyIn.equals(EnumIntervalProperty.AUGMENTED))
              return 1;
            if (propertyIn.equals(EnumIntervalProperty.DIMINISHED))
              return -1;
          } else {
            if (propertyIn.equals(EnumIntervalProperty.MAJOR))
              return 0;
            if (propertyIn.equals(EnumIntervalProperty.MINOR))
              return -1;
            if (propertyIn.equals(EnumIntervalProperty.AUGMENTED))
              return 1;
            if (propertyIn.equals(EnumIntervalProperty.DIMINISHED))
              return -2;
          }
          return 0;
        }
        static getPropertyFromOffset(onsetIn, degreeIn) {
          const degree = typeof degreeIn === "number" ? (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(degreeIn - 1, 7) + 1 : 1;
          if (degree === 1 || degree === 4 || degree === 5) {
            if (onsetIn === 0)
              return EnumIntervalProperty.PERFECT;
            if (onsetIn === 1)
              return EnumIntervalProperty.AUGMENTED;
            if (onsetIn === -1)
              return EnumIntervalProperty.DIMINISHED;
          } else {
            if (onsetIn === 0)
              return EnumIntervalProperty.MAJOR;
            if (onsetIn === -1)
              return EnumIntervalProperty.MINOR;
            if (onsetIn === 1)
              return EnumIntervalProperty.AUGMENTED;
            if (onsetIn === -2)
              return EnumIntervalProperty.DIMINISHED;
          }
          return null;
        }
        static getOffsetFromDegree(degreeIn) {
          return typeof degreeIn === "number" ? DEGREE_TO_OFFSET[(0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(degreeIn - 1, 7)] + 12 * Math.floor((degreeIn - 1) / 7) : 0;
        }
        constructor(p1, p2, p3) {
          this.become(p1, p2, p3);
        }
        become(p1, p2, p3) {
          this.degree = 0;
          this.onset = 0;
          this.octave = 0;
          if (isInterval(p1)) {
            this.fromInterval(p1.degree, p1.onset, p1.octave);
          } else if (typeof p1 === "string") {
            this.fromString(p1);
          } else if (typeof p1 === "number") {
            this.fromInterval(p1, p2, p3);
          }
          return this;
        }
        fromInterval(degreeIn, onsetIn = 0, octaveIn = 0) {
          this.degree = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(degreeIn - 1, 7) + 1;
          this.onset = onsetIn;
          this.octave = Math.floor((degreeIn - 1) / 7) + octaveIn;
        }
        static fromString(nameIn) {
          const matched = _Interval.REGEX.exec(nameIn);
          if (matched === null)
            throw new SyntaxError(`No such interval ${nameIn}.`);
          const degree = parseInt(matched[2]);
          const onset = _Interval.getOffsetFromProperty(EnumIntervalProperty.byAbb(matched[1]), degree);
          const octave = parseInt(matched[3]) || 0;
          return { degree, onset, octave };
        }
        fromString(nameIn) {
          const { degree, onset, octave } = _Interval.fromString(nameIn);
          this.become(degree, onset, octave);
          return this;
        }
        static fromOffset(offsetIn) {
          let degree = 0;
          let onset = 0;
          const octave = Math.floor(offsetIn / 12);
          for (let i2 = 0; i2 < DEGREE_TO_OFFSET.length; i2++) {
            if (DEGREE_TO_OFFSET[i2] === (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(offsetIn, 12)) {
              degree = i2 + 1;
              onset = 0;
              break;
            } else if (DEGREE_TO_OFFSET[i2] === (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(offsetIn, 12) + 1) {
              degree = i2 + 1;
              onset = -1;
              break;
            }
          }
          return { degree, onset, octave };
        }
        fromOffset(offsetIn) {
          const { degree, onset, octave } = _Interval.fromOffset(offsetIn);
          this.degree = degree;
          this.onset = onset;
          this.octave = octave;
          return this;
        }
        static fromRatio(ratioIn) {
          const offset = Math.round(Math.log(ratioIn) / Math.log(_Frequency__WEBPACK_IMPORTED_MODULE_2__["default"].SEMITONE));
          return new _Interval(offset);
        }
        add(iIn) {
          const i2 = { degree: 0, onset: 0, octave: 0 };
          i2.degree = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(this.degree + iIn.degree - 1 - 1, 7) + 1;
          i2.onset = this.offset - 12 * this.octave + iIn.offset - 12 * iIn.octave - _Interval.getOffsetFromDegree(this.degree + iIn.degree - 1);
          i2.octave = this.octave + iIn.octave + Math.floor((this.degree + iIn.degree - 1 - 1) / 7);
          this.degree = i2.degree;
          this.onset = i2.onset;
          this.octave = i2.octave;
          return this;
        }
        static add(a, b) {
          return a.clone().add(b);
        }
        sub(iIn) {
          const i2 = { degree: 0, onset: 0, octave: 0 };
          i2.degree = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(this.degree - iIn.degree + 1 - 1, 7) + 1;
          i2.onset = this.offset - 12 * this.octave - (iIn.offset - 12 * iIn.octave) - _Interval.getOffsetFromDegree(this.degree - iIn.degree + 1);
          i2.octave = this.octave - iIn.octave + Math.floor((this.degree - iIn.degree + 1 - 1) / 7);
          this.degree = i2.degree;
          this.onset = i2.onset;
          this.octave = i2.octave;
          return this;
        }
        static sub(a, b) {
          return a.clone().sub(b);
        }
        equals(intervalIn) {
          return isInterval(intervalIn) && this.degree === intervalIn.degree && this.onset === intervalIn.onset && this.octave === intervalIn.octave;
        }
        compareTo(iIn) {
          return _Interval.compare(this, iIn);
        }
        static compare(x, y) {
          return x.offset - y.offset;
        }
        reverse() {
          const i2 = { degree: 0, onset: 0, octave: 0 };
          i2.degree = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(1 - this.degree, 7) + 1;
          i2.onset = 0 - (this.offset - 12 * this.octave) - _Interval.getOffsetFromDegree(1 - this.degree + 1);
          i2.octave = 0 - this.octave + Math.floor((1 - this.degree + 1 - 1) / 7);
          this.degree = i2.degree;
          this.onset = i2.onset;
          this.octave = i2.octave;
          return this;
        }
        octaveReverse() {
          const i2 = { degree: 0, onset: 0, octave: 0 };
          i2.degree = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(1 - this.degree, 7) + 1;
          i2.onset = 0 - (this.offset - 12 * this.octave) - _Interval.getOffsetFromDegree(1 - this.degree + 1);
          i2.octave = 1 - this.octave + Math.floor((1 - this.degree + 1 - 1) / 7);
          this.degree = i2.degree;
          this.onset = i2.onset;
          this.octave = i2.octave;
          return this;
        }
        get offset() {
          return DEGREE_TO_OFFSET[(0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(this.degree - 1, 7)] + 12 * Math.floor((this.degree - 1) / 7) + this.onset + 12 * this.octave;
        }
        get ratio() {
          return _Frequency__WEBPACK_IMPORTED_MODULE_2__["default"].getRatio(this.offset);
        }
        get fraction() {
          return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.nearestFraction)(this.ratio);
        }
        get reciprocal() {
          return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.nearestReciprocal)(this.ratio);
        }
        get property() {
          return _Interval.getPropertyFromOffset(this.onset, this.degree);
        }
        static fromArray(arrayIn) {
          return arrayIn.map((e) => new _Interval(e));
        }
        toString() {
          const sOnset = this.property ? this.property.abb : (this.onset > 0 ? "+" : "") + this.onset.toString() + "_";
          const sOctave = this.octave > 0 ? "+" + this.octave : this.octave < 0 ? this.octave : "";
          return sOnset + this.degree + sOctave;
        }
        clone() {
          return new _Interval(this);
        }
      };
      let Interval = _Interval;
      Interval.REGEX = /^([PMmAd])([0-9]+)((\+|-)\d+)?$/;
      Interval.DEGREE_TO_OFFSET = DEGREE_TO_OFFSET;
      Interval.isInterval = isInterval;
      Interval.isIntervalArray = isIntervalArray;
      Interval.EnumIntervalProperty = EnumIntervalProperty;
      const __WEBPACK_DEFAULT_EXPORT__ = Interval;
    },
    "./src/Note.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isNote": () => isNote,
        "isNoteArray": () => isNoteArray,
        "Note": () => Note,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/utils.ts");
      var _Interval__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Interval.ts");
      var _Frequency__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Frequency.ts");
      var _EnumNote__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/EnumNote.ts");
      const isNote = (x) => {
        return x instanceof Note || typeof x === "object" && x !== null && (0, _EnumNote__WEBPACK_IMPORTED_MODULE_3__.isEnumNote)(x.enumNote) && typeof x.alteration === "number";
      };
      const isNoteArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.isObjectArray)(x, isNote);
      };
      const _Note = class {
        constructor(p1, p2) {
          this.enumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_3__["default"].C;
          this.alteration = 0;
          this.become(p1, p2);
        }
        become(p1, p2) {
          if (p1 instanceof _EnumNote__WEBPACK_IMPORTED_MODULE_3__["default"]) {
            this.enumNote = p1;
            if (p2)
              this.alteration = p2;
          } else if (isNote(p1)) {
            this.enumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_3__["default"].from(p1.enumNote);
            this.alteration = p1.alteration;
          } else if (typeof p1 === "string") {
            this.fromString(p1);
          } else if (typeof p1 === "number") {
            this.fromOffset(p1, p2);
          }
          return this;
        }
        static fromString(nameIn) {
          const matched = _Note.REGEX.exec(nameIn);
          if (matched === null)
            throw new SyntaxError(`No such note ${nameIn}.`);
          const enumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_3__["default"][matched[1]];
          let alteration = 0;
          matched[2].split("").forEach((c) => alteration += c === "x" ? 2 : c === "#" ? 1 : -1);
          return { enumNote, alteration };
        }
        fromString(nameIn) {
          const { enumNote, alteration } = _Note.fromString(nameIn);
          this.enumNote = enumNote;
          this.alteration = alteration;
          return this;
        }
        static fromOffset(offsetIn, alterationIn) {
          const note = (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(offsetIn, 12);
          let offset = 11;
          for (let i2 = _Interval__WEBPACK_IMPORTED_MODULE_1__.DEGREE_TO_OFFSET.length - 1; i2 >= 0; i2--) {
            const el = _Interval__WEBPACK_IMPORTED_MODULE_1__.DEGREE_TO_OFFSET[i2];
            if (el <= note) {
              offset = el;
              break;
            }
          }
          const enumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_3__["default"].byOffset(offset);
          let alteration = note - offset;
          if (alterationIn)
            alteration += alterationIn;
          return { enumNote, alteration };
        }
        fromOffset(offsetIn, alterationIn) {
          const { enumNote, alteration } = _Note.fromOffset(offsetIn, alterationIn);
          this.enumNote = enumNote;
          this.alteration = alteration;
          return this;
        }
        static ratioToOffset(ratio) {
          return Math.round(Math.log(ratio) / Math.log(_Frequency__WEBPACK_IMPORTED_MODULE_2__["default"].SEMITONE));
        }
        static offsetToRatio(offset) {
          return _Frequency__WEBPACK_IMPORTED_MODULE_2__["default"].SEMITONE ** offset;
        }
        add(p1) {
          if (typeof p1 === "number")
            return this.fromOffset(this.offset + p1);
          let i2;
          if (typeof p1 === "string")
            i2 = new _Interval__WEBPACK_IMPORTED_MODULE_1__["default"](p1);
          else if (p1 instanceof _Interval__WEBPACK_IMPORTED_MODULE_1__["default"])
            i2 = p1;
          const newEnumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_3__["default"].byIndex(this.enumNote.index + i2.degree - 1);
          this.alteration += i2.offset - 12 * i2.octave - (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(newEnumNote.offset - this.enumNote.offset, 12);
          this.enumNote = newEnumNote;
          return this;
        }
        static add(a, b) {
          if (typeof b === "number")
            return a.clone().add(b);
          return a.clone().add(b);
        }
        sub(p1) {
          if (typeof p1 === "number")
            return this.fromOffset(this.offset - p1);
          if (p1 instanceof _Note)
            return (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(this.offset - p1.offset, 12);
          let i2;
          if (typeof p1 === "string")
            i2 = new _Interval__WEBPACK_IMPORTED_MODULE_1__["default"](p1);
          else if (p1 instanceof _Interval__WEBPACK_IMPORTED_MODULE_1__["default"])
            i2 = p1;
          const newEnumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_3__["default"].byIndex(this.enumNote.index - i2.degree + 1);
          this.alteration += i2.offset - 12 * i2.octave - (0, _utils__WEBPACK_IMPORTED_MODULE_0__.floorMod)(this.enumNote.offset - newEnumNote.offset, 12);
          this.enumNote = newEnumNote;
          return this;
        }
        static sub(a, b) {
          if (typeof b === "number")
            return a.clone().sub(b);
          if (b instanceof _Note)
            return a.clone().sub(b);
          return a.clone().sub(b);
        }
        mul(fIn) {
          return this.add(_Note.ratioToOffset(fIn));
        }
        static mul(a, b) {
          return a.clone().mul(b);
        }
        div(p1) {
          if (p1 instanceof _Note)
            return _Note.offsetToRatio(this.offset - p1.offset);
          return this.mul(1 / p1);
        }
        static div(a, b) {
          if (typeof b === "number")
            return a.clone().div(b);
          return a.clone().div(b);
        }
        equals(noteIn) {
          return isNote(noteIn) && this.enumNote.equals(noteIn.enumNote) && this.alteration === noteIn.alteration;
        }
        compareTo(that) {
          return _Note.compare(this, that);
        }
        static compare(x, y) {
          return x.offset - y.offset;
        }
        getInterval(noteIn) {
          const that = noteIn instanceof _Note && noteIn.constructor === _Note ? noteIn : new _Note(noteIn);
          const degree = that.enumNote.index - this.enumNote.index + 1;
          const onset = that.offset - this.offset - _Interval__WEBPACK_IMPORTED_MODULE_1__["default"].getOffsetFromDegree(degree);
          const octave = 0;
          return new _Interval__WEBPACK_IMPORTED_MODULE_1__["default"](degree, onset, octave);
        }
        getDistance(that) {
          const distance = Math.abs(this.offset - that.offset);
          return distance > 6 ? 12 - distance : distance;
        }
        get offset() {
          return this.enumNote.offset + this.alteration;
        }
        static fromArray(arrayIn) {
          return arrayIn.map((e) => new _Note(e));
        }
        toString() {
          return this.enumNote.name() + (this.alteration > 0 ? "#" : "b").repeat(Math.abs(this.alteration));
        }
        clone() {
          return new _Note(this);
        }
        async openGuidoEvent(factory, durationIn, close = true, octaveIn = 3) {
          const { alteration } = this;
          const accidentals = Math.max(-2, Math.min(2, ~~alteration));
          const alterDetune = alteration - accidentals;
          if (alterDetune) {
            factory.openRangeTag("alter", 0);
            factory.addTagParameterFloat(alterDetune);
            factory.setParameterName("detune");
          }
          factory.openEvent(this.enumNote.name());
          factory.setEventAccidentals(this.alteration);
          factory.setOctave(octaveIn - 3);
          if (durationIn)
            factory.setDuration(durationIn.numerator, durationIn.denominator);
          if (close) {
            factory.closeEvent();
            if (alterDetune) {
              factory.closeTag();
              factory.endTag();
            }
          }
        }
        async toGuidoAR(factory) {
          factory.openMusic();
          factory.openVoice();
          this.openGuidoEvent(factory);
          factory.closeVoice();
          return factory.closeMusic();
        }
        getTendancy(that) {
          const d = this.getDistance(that);
          return d === 0 || d > 2 ? 0 : 1 / d;
        }
        getStability(that) {
          const d = this.getDistance(that);
          const [, f] = new _Interval__WEBPACK_IMPORTED_MODULE_1__["default"](_Interval__WEBPACK_IMPORTED_MODULE_1__["default"].fromOffset(d)).fraction;
          return 1 / f;
        }
      };
      let Note = _Note;
      Note.REGEX = /^([a-gA-G])([b#x]*)$/;
      Note.isNote = isNote;
      Note.isNoteArray = isNoteArray;
      Note.EnumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_3__["default"];
      const __WEBPACK_DEFAULT_EXPORT__ = Note;
    },
    "./src/Param.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isParam": () => isParam,
        "Param": () => Param,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      const isParam = (x) => {
        return x instanceof Param || typeof x === "object" && x !== null && typeof x.path === "string" && (typeof x.name === "undefined" || x.name === "string") && typeof x.min === "number" && typeof x.max === "number" && typeof x.step === "number" && typeof x.value === "number" && typeof x.init === "number";
      };
      const _Param = class {
        constructor(optionsIn) {
          this.path = optionsIn.path;
          this.name = optionsIn.name;
          this._value = optionsIn.value;
          this.step = optionsIn.step;
          this.setRange(optionsIn.min, optionsIn.max);
        }
        get value() {
          return this._value;
        }
        set value(valueIn) {
          if (valueIn < this.min) {
            this._value = this.min;
          } else if (valueIn > this.max) {
            const d = this.max - this.min;
            this._value = this.min + d - d % this.step;
          } else {
            const d = valueIn - this.min;
            this._value = this.min + d - d % this.step;
          }
        }
        get min() {
          return this._min;
        }
        set min(minIn) {
          this._min = Math.min(minIn, this.max);
          if (this.value < this.min)
            this.value = this.min;
        }
        get max() {
          return this._max;
        }
        set max(maxIn) {
          this._max = Math.max(maxIn, this.min);
          if (this.value > this.max)
            this.value = this.max;
        }
        setRange(minIn, maxIn) {
          const min = Math.min(minIn, maxIn);
          const max = Math.max(minIn, maxIn);
          this._min = min;
          this._max = max;
          this.value = this._value;
        }
        clone() {
          return new _Param(this);
        }
      };
      let Param = _Param;
      Param.isParam = isParam;
      const __WEBPACK_DEFAULT_EXPORT__ = Param;
    },
    "./src/Pitch.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isPitch": () => isPitch,
        "isPitchArray": () => isPitchArray,
        "Pitch": () => Pitch,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _Note__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Note.ts");
      var _EnumNote__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/EnumNote.ts");
      var _Interval__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Interval.ts");
      var _Frequency__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/Frequency.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__2("./src/utils.ts");
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
      const isPitch = (x) => {
        return x instanceof Pitch || typeof x === "object" && x !== null && (0, _EnumNote__WEBPACK_IMPORTED_MODULE_1__.isEnumNote)(x.enumNote) && typeof x.alteration === "number" && typeof x.octave === "number";
      };
      const isPitchArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_4__.isObjectArray)(x, isPitchArray);
      };
      const _Pitch = class extends _Note__WEBPACK_IMPORTED_MODULE_0__["default"] {
        static fromFrequency(f) {
          return new _Pitch(69 + 12 * (Math.log(f / _Frequency__WEBPACK_IMPORTED_MODULE_3__["default"].A440) / Math.log(2)));
        }
        constructor(p1, p2 = 4) {
          super();
          this.become(p1, p2);
        }
        become(p1, p2 = 4) {
          if (isPitch(p1)) {
            super.become(p1);
            this.octave = p1.octave;
          } else if (p1 instanceof _EnumNote__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            super.become(p1);
            this.octave = p2;
          } else if ((0, _Note__WEBPACK_IMPORTED_MODULE_0__.isNote)(p1)) {
            super.become(p1);
            this.octave = p2;
          } else if (typeof p1 === "string") {
            super.become();
            this.fromString(p1);
          } else if (typeof p1 === "number") {
            super.become(p1);
            this.octave = Math.floor(p1 / 12 - 1);
          } else {
            super.become();
          }
          return this;
        }
        get frequency() {
          return _Frequency__WEBPACK_IMPORTED_MODULE_3__["default"].A440 * 2 ** ((this.offset - 69) / 12);
        }
        static fromString(nameIn) {
          const matched = _Pitch.REGEX.exec(nameIn);
          if (matched === null)
            throw new SyntaxError(`No such pitch ${nameIn}.`);
          const octave = parseInt(matched[2]) || 0;
          return __spreadProps(__spreadValues({}, _Note__WEBPACK_IMPORTED_MODULE_0__["default"].fromString(matched[1])), { octave });
        }
        fromString(nameIn) {
          const { enumNote, alteration, octave } = _Pitch.fromString(nameIn);
          this.enumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_1__["default"].from(enumNote);
          this.alteration = alteration;
          this.octave = octave;
          return this;
        }
        static fromOffset(offsetIn) {
          return __spreadProps(__spreadValues({}, super.fromOffset(offsetIn)), { octave: Math.floor(offsetIn / 12 - 1) });
        }
        fromOffset(offsetIn) {
          const { enumNote, alteration, octave } = _Pitch.fromOffset(offsetIn);
          this.enumNote = _EnumNote__WEBPACK_IMPORTED_MODULE_1__["default"].from(enumNote);
          this.alteration = alteration;
          this.octave = octave;
          return this;
        }
        add(p1) {
          if (typeof p1 === "number")
            return this.fromOffset(this.offset + p1);
          let i2;
          if (typeof p1 === "string")
            i2 = new _Interval__WEBPACK_IMPORTED_MODULE_2__["default"](p1);
          else if (p1 instanceof _Interval__WEBPACK_IMPORTED_MODULE_2__["default"])
            i2 = p1;
          this.octave += Math.floor((this.enumNote.index + i2.degree - 1) / 7) + i2.octave;
          return super.add(i2);
        }
        static add(a, b) {
          if (typeof b === "number")
            return a.clone().add(b);
          return a.clone().add(b);
        }
        sub(p1) {
          if (typeof p1 === "number")
            return this.fromOffset(this.offset - p1);
          if (p1 instanceof _Pitch)
            return this.offset - p1.offset;
          let i2;
          if (typeof p1 === "string")
            i2 = new _Interval__WEBPACK_IMPORTED_MODULE_2__["default"](p1);
          else if (p1 instanceof _Interval__WEBPACK_IMPORTED_MODULE_2__["default"])
            i2 = p1;
          this.octave += Math.floor((this.enumNote.index - i2.degree + 1) / 7) - i2.octave;
          return super.sub(i2);
        }
        static sub(a, b) {
          if (typeof b === "number")
            return a.clone().sub(b);
          if (b instanceof _Pitch)
            return a.clone().sub(b);
          return a.clone().sub(b);
        }
        mul(fIn) {
          const d = _Note__WEBPACK_IMPORTED_MODULE_0__["default"].ratioToOffset(fIn);
          return this.add(d);
        }
        static mul(a, b) {
          return a.clone().mul(b);
        }
        div(p1) {
          if (p1 instanceof _Pitch)
            return this.frequency / p1.frequency;
          return this.mul(1 / p1);
        }
        static div(a, b) {
          if (typeof b === "number")
            return a.clone().div(b);
          return a.clone().div(b);
        }
        equals(pitchIn) {
          return super.equals(pitchIn) && isPitch(pitchIn) && this.octave === pitchIn.octave;
        }
        compareTo(pitchIn) {
          return _Pitch.compare(this, pitchIn);
        }
        static compare(x, y) {
          return x.offset - y.offset;
        }
        getInterval(pitchIn) {
          const that = pitchIn instanceof _Pitch ? pitchIn : isPitch(pitchIn) ? new _Pitch(pitchIn) : new _Pitch(pitchIn, this.octave);
          const degree = that.enumNote.index - this.enumNote.index + 1 + (that.octave - this.octave) * 7;
          const onset = that.offset - this.offset - _Interval__WEBPACK_IMPORTED_MODULE_2__["default"].getOffsetFromDegree(degree);
          const octave = 0;
          return new _Interval__WEBPACK_IMPORTED_MODULE_2__["default"](degree, onset, octave);
        }
        getDistance(that) {
          return Math.abs(this.offset - that.offset);
        }
        get offset() {
          return this.enumNote.offset + this.alteration + 12 * (this.octave + 1);
        }
        static fromArray(arrayIn) {
          return arrayIn.map((e) => new _Pitch(e));
        }
        toString() {
          return super.toString() + this.octave;
        }
        clone() {
          return new _Pitch(this);
        }
        async openGuidoEvent(factory, durationIn, close = true) {
          super.openGuidoEvent(factory, durationIn, close, this.octave);
        }
        getTendancy(that) {
          return super.getTendancy(that);
        }
        getStability(that) {
          return super.getStability(that);
        }
      };
      let Pitch = _Pitch;
      Pitch.REGEX = /^([a-gA-G][b#x]*)(-?\d+)?$/;
      Pitch.MINIMUM = _Pitch.fromFrequency(20);
      Pitch.MAXIMUM = _Pitch.fromFrequency(2e4);
      Pitch.isPitch = isPitch;
      Pitch.isPitchArray = isPitchArray;
      const __WEBPACK_DEFAULT_EXPORT__ = Pitch;
    },
    "./src/Scale.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "EnumScale": () => EnumScale,
        "isScale": () => isScale,
        "Scale": () => Scale,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _Pitch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Pitch.ts");
      var _Interval__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Interval.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/utils.ts");
      class EnumScale {
        static get MAJOR() {
          return new Scale("Major", "P1:Tonic", "M2:Supertonic", "M3:Mediant", "P4:Subdominant", "P5:Dominant", "M6:Submediant", "M7:Leading");
        }
        static get MINOR() {
          return new Scale("Minor", "P1:Tonic", "M2:Supertonic", "m3:Mediant", "P4:Subdominant", "P5:Dominant", "m6:Submediant", "m7:Subtonic");
        }
        static get PENTA() {
          return new Scale("Penta", "P1:Gong", "M2:Shang", "M3:Jiao", "P5:Zhi", "M6:Yu");
        }
        static get IONIAN() {
          return EnumScale.MAJOR;
        }
        static get DORIAN() {
          return new Scale("Dorian", "P1:Tonic", "M2:Supertonic", "m3:Mediant", "P4:Subdominant", "P5:Dominant", "M6:Submediant", "m7:Subtonic");
        }
        static get PHRYGIAN() {
          return new Scale("Phrygian", "P1:Tonic", "m2:Supertonic", "m3:Mediant", "P4:Subdominant", "P5:Dominant", "m6:Submediant", "m7:Subtonic");
        }
        static get LYDIAN() {
          return new Scale("Lydian", "P1:Tonic", "M2:Supertonic", "M3:Mediant", "A4:Subdominant", "P5:Dominant", "M6:Submediant", "M7:Leading");
        }
        static get MIXOLYDIAN() {
          return new Scale("Mixolydian", "P1:Tonic", "M2:Supertonic", "M3:Mediant", "P4:Subdominant", "P5:Dominant", "M6:Submediant", "m7:Subtonic");
        }
        static get AEOLIAN() {
          return EnumScale.MINOR;
        }
        static get LOCRIAN() {
          return new Scale("Locrian", "P1:Tonic", "m2:Supertonic", "m3:Mediant", "P4:Subdominant", "d5:Dominant", "m6:Submediant", "m7:Subtonic");
        }
        static get ASCENDING_MELODIC_MINOR() {
          return new Scale("Ascending Melodic Minor", "P1:Tonic", "M2:Supertonic", "m3:Mediant", "P4:Subdominant", "P5:Dominant", "M6:Submediant", "M7:Leading");
        }
        static get PHRYGIAN_MAJ6() {
          return new Scale("Phrygian M6", "P1:Tonic", "m2:Supertonic", "m3:Mediant", "P4:Subdominant", "P5:Dominant", "M6:Submediant", "m7:Subtonic");
        }
        static get LYDIAN_AUG() {
          return new Scale("Lydian Augmented", "P1:Tonic", "M2:Supertonic", "M3:Mediant", "A4:Subdominant", "A5:Dominant", "M6:Submediant", "M7:Leading");
        }
        static get LYDIAN_DOM() {
          return new Scale("Lydian Dominant", "P1:Tonic", "M2:Supertonic", "M3:Mediant", "A4:Subdominant", "P5:Dominant", "M6:Submediant", "m7:Subtonic");
        }
        static get MIXOLYDIAN_MIN6() {
          return new Scale("Mixolydian m6", "P1:Tonic", "M2:Supertonic", "M3:Mediant", "P4:Subdominant", "P5:Dominant", "m6:Submediant", "m7:Subtonic");
        }
        static get LOCRIAN_MAJ2() {
          return new Scale("Locrian M2", "P1:Tonic", "M2:Supertonic", "m3:Mediant", "P4:Subdominant", "d5:Dominant", "m6:Submediant", "m7:Subtonic");
        }
        static get SUPER_LOCRIAN() {
          return new Scale("Super Locrian", "P1:Tonic", "m2:Supertonic", "m3:Mediant", "d4:Subdominant", "d5:Dominant", "m6:Submediant", "m7:Subtonic");
        }
      }
      const isScale = (x) => {
        return x instanceof Scale || typeof x === "object" && x !== null && (0, _utils__WEBPACK_IMPORTED_MODULE_2__.isStringArray)(x.degreeNames) && (0, _Interval__WEBPACK_IMPORTED_MODULE_1__.isIntervalArray)(x.intervals);
      };
      const _Scale = class {
        constructor(p1, ...degreesIn) {
          this.become(p1, ...degreesIn);
        }
        become(p1, ...degreesIn) {
          if (typeof p1 === "string") {
            this.scaleName = p1;
            this.intervals = [];
            this.degreeNames = [];
            for (let i2 = 0; i2 < degreesIn.length; i2++) {
              const degreeName = degreesIn[i2];
              const split = degreeName.split(":");
              if (split.length === 2) {
                this.intervals[i2] = new _Interval__WEBPACK_IMPORTED_MODULE_1__["default"](split[0]);
                this.degreeNames[i2] = split[1];
              } else {
                this.intervals[i2] = new _Interval__WEBPACK_IMPORTED_MODULE_1__["default"](degreeName);
                this.degreeNames[i2] = degreeName;
              }
            }
          } else {
            this.scaleName = p1.scaleName;
            this.intervals = _Interval__WEBPACK_IMPORTED_MODULE_1__["default"].fromArray(p1.intervals);
            this.degreeNames = [...p1.degreeNames];
          }
          return this;
        }
        get size() {
          return this.intervals.length;
        }
        addNote(noteIn) {
          let interval;
          let name;
          const split = noteIn.split(":");
          if (split.length === 2) {
            interval = new _Interval__WEBPACK_IMPORTED_MODULE_1__["default"](split[0]);
            name = split[1];
          } else {
            interval = new _Interval__WEBPACK_IMPORTED_MODULE_1__["default"](noteIn);
            name = noteIn;
          }
          this.intervals.push(interval);
          this.degreeNames.push(name);
          return this;
        }
        getIntervalFromIndex(index) {
          return this.intervals[index];
        }
        getIntervalFromDegree(degreeIn) {
          return this.intervals.find((interval) => {
            return (0, _utils__WEBPACK_IMPORTED_MODULE_2__.floorMod)(degreeIn - 1, this.intervals.length) + 1 === interval.degree;
          });
        }
        get degrees() {
          return this.intervals.map((i2) => i2.degree);
        }
        equals(scaleIn) {
          return isScale(scaleIn) && this.intervals.length === scaleIn.intervals.length && this.intervals.every((interval, i2) => interval.equals(scaleIn.intervals[i2])) && this.degreeNames.length === scaleIn.degreeNames.length && this.degreeNames.every((name, i2) => name === scaleIn.degreeNames[i2]);
        }
        getName() {
          return this.scaleName;
        }
        toNotes(from = new _Pitch__WEBPACK_IMPORTED_MODULE_0__["default"](60)) {
          return this.intervals.map((interval) => from.clone().add(interval));
        }
        async toGuidoAR(factory) {
          factory.openMusic();
          factory.openVoice();
          for (const note of this.toNotes()) {
            factory.openChord();
            note.openGuidoEvent(factory);
            factory.closeChord();
          }
          factory.closeVoice();
          return factory.closeMusic();
        }
        toString() {
          let s = this.scaleName ? `Scale "${this.scaleName}": {` : "Scale :{";
          for (let i2 = 0; i2 < this.intervals.length; i2++) {
            const sI = this.intervals[i2].toString();
            const sN = this.degreeNames[i2];
            s += sI + (sN.length > 0 && sN !== sI ? ":" + sN : "");
            if (i2 !== this.intervals.length - 1)
              s += ", ";
          }
          s += "}";
          return s;
        }
        clone() {
          return new _Scale(this);
        }
        *[Symbol.iterator]() {
          for (const interval of this.intervals) {
            yield interval;
          }
        }
      };
      let Scale = _Scale;
      Scale.isScale = isScale;
      Scale.EnumScale = EnumScale;
      const __WEBPACK_DEFAULT_EXPORT__ = Scale;
    },
    "./src/TimeCode.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isTimeCode": () => isTimeCode,
        "TimeCode": () => TimeCode,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      const isTimeCode = (x) => {
        return x instanceof TimeCode || typeof x.beats === "number" && typeof x.beatDuration === "number" && typeof x.bpm === "number";
      };
      const _TimeCode = class {
        constructor(p1, p2, p3) {
          if (isTimeCode(p1)) {
            this.beats = p1.beats;
            this.beatDuration = p1.beatDuration;
            this.bpm = p1.bpm;
          } else {
            this.beats = p1 || 4;
            this.beatDuration = p2 || 4;
            this.bpm = p3 || 60;
          }
        }
        getSecondsFromBeats(beatsIn = 1) {
          return beatsIn * 60 / this.bpm;
        }
        getBeatsFromSeconds(secondsIn = 1) {
          return secondsIn * this.bpm / 60;
        }
        toString() {
          return this.beats + "/" + this.beatDuration + " @" + this.bpm;
        }
        clone() {
          return new _TimeCode(this);
        }
      };
      let TimeCode = _TimeCode;
      TimeCode.DEFAULT = new _TimeCode(4, 4, 60);
      TimeCode.isTimeCode = isTimeCode;
      const __WEBPACK_DEFAULT_EXPORT__ = TimeCode;
    },
    "./src/TonalChord.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isTonalChord": () => isTonalChord,
        "isTonalChordArray": () => isTonalChordArray,
        "TonalChord": () => TonalChord,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _Chord__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Chord.ts");
      var _EnumChord__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/EnumChord.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/utils.ts");
      var _Interval__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/Interval.ts");
      const isTonalChord = (x) => {
        return x instanceof TonalChord || typeof x.alteration === "number" && typeof x.degree === "number" && x.chord instanceof _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"];
      };
      const isTonalChordArray = (x) => {
        return Array.isArray(x) && x.every((e) => e instanceof TonalChord);
      };
      const _TonalChord = class {
        constructor(p1) {
          if (typeof p1 === "string") {
            let matched = _TonalChord.REGEX1.exec(p1);
            if (matched) {
              let s = matched[1];
              this.alteration = s === "#" ? 1 : s === "b" ? -1 : 0;
              s = matched[2];
              const p = (0, _utils__WEBPACK_IMPORTED_MODULE_2__.parseRoman)(s);
              if (p !== 0 && p > 7 && p < -7)
                throw new Error("Roman number too large for degree.");
              this.degree = Math.abs(p);
              s = matched[3];
              this.chord = s.length === 0 ? p > 0 ? _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].MAJ : _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].MIN : s === "+" ? _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].AUG : _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].DIM;
            } else {
              matched = _TonalChord.REGEX2.exec(p1);
              if (matched) {
                let s = matched[1];
                this.alteration = s === "#" ? 1 : s === "b" ? -1 : 0;
                s = matched[2];
                this.degree = +s;
                s = matched[3];
                this.chord = s.length === 0 ? null : s === "M" ? _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].MAJ : s === "m" ? _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].MAJ : s === "+" ? _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].AUG : _EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].DIM;
              } else
                throw new Error("Input string error: " + p1);
            }
          } else {
            this.alteration = p1.alteration;
            this.degree = p1.degree;
            this.chord = p1.chord.clone();
          }
        }
        getChord(tonalityIn) {
          let chord;
          if (this.chord)
            chord = new _Chord__WEBPACK_IMPORTED_MODULE_0__["default"](tonalityIn.getNoteFromDegree(this.degree));
          else
            chord = tonalityIn.getTriad(this.degree);
          if (this.alteration === 1)
            chord.base.add(new _Interval__WEBPACK_IMPORTED_MODULE_3__["default"]("A1"));
          else if (this.alteration === -1)
            chord.base.sub(new _Interval__WEBPACK_IMPORTED_MODULE_3__["default"]("A1"));
          return chord;
        }
        equals(chordIn) {
          return isTonalChord(chordIn) && chordIn.alteration === this.alteration && chordIn.degree === this.degree && chordIn.chord.equals(this.chord);
        }
        toString() {
          let s = "";
          if (this.alteration === 1)
            s = "#";
          else if (this.alteration === -1)
            s = "b";
          if (!this.chord)
            return s + this.degree;
          s += (0, _utils__WEBPACK_IMPORTED_MODULE_2__.toRoman)(this.degree * (this.chord.equals(_EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].MIN) ? -1 : 1));
          if (!this.chord.equals(_EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].MAJ) && !this.chord.equals(_EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].MIN)) {
            if (this.chord.equals(_EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].AUG))
              s += "+";
            else if (this.chord.equals(_EnumChord__WEBPACK_IMPORTED_MODULE_1__["default"].AUG))
              s += "-";
            else
              s += this.chord.name().toLowerCase();
          }
          return s;
        }
        clone() {
          return new _TonalChord(this);
        }
      };
      let TonalChord = _TonalChord;
      TonalChord.REGEX1 = /^([#b]?)(I{1,3}|i{1,3}|I?V|i?v|VI{1,2}|vi{1,2})(\+|-?)$/;
      TonalChord.REGEX2 = /^([#b]?)([1-7])(M|m|\+|-?)$/;
      TonalChord.isTonalChord = isTonalChord;
      TonalChord.isTonalChordArray = isTonalChordArray;
      const __WEBPACK_DEFAULT_EXPORT__ = TonalChord;
    },
    "./src/Tonality.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isTonality": () => isTonality,
        "Tonality": () => Tonality,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _Scale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Scale.ts");
      var _Note__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Note.ts");
      var _Chord__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Chord.ts");
      var _Interval__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/Interval.ts");
      const isTonality = (x) => {
        return x instanceof Tonality || typeof x === "object" && x !== null && (0, _Note__WEBPACK_IMPORTED_MODULE_1__.isNote)(x.note) && (0, _Scale__WEBPACK_IMPORTED_MODULE_0__.isScale)(x.scale);
      };
      const _Tonality = class {
        constructor(p1, p2) {
          this.become(p1, p2);
        }
        become(p1, p2) {
          if (isTonality(p1)) {
            this.note = new _Note__WEBPACK_IMPORTED_MODULE_1__["default"](p1.note);
            this.scale = new _Scale__WEBPACK_IMPORTED_MODULE_0__["default"](p1.scale);
          } else if (typeof p1 === "string") {
            try {
              this.note = new _Note__WEBPACK_IMPORTED_MODULE_1__["default"](p1);
            } catch (e) {
              throw new Error(`No such tonality: ${p1}.`);
            }
            this.scale = p1.substr(p1.length - 1).match("[A-G]") ? _Scale__WEBPACK_IMPORTED_MODULE_0__.EnumScale.MAJOR : _Scale__WEBPACK_IMPORTED_MODULE_0__.EnumScale.MINOR;
          } else {
            this.note = p1;
            this.scale = p2;
          }
          return this;
        }
        add(intervalIn) {
          this.note.add(intervalIn);
          return this;
        }
        sub(intervalIn) {
          this.note.sub(intervalIn);
          return this;
        }
        get notes() {
          return this.scale.intervals.map((i2) => this.note.clone().add(i2));
        }
        getNoteFromDegree(degreeIn) {
          return this.note.clone().add(this.scale.getIntervalFromDegree(degreeIn));
        }
        getTriad(degreeIn) {
          return new _Chord__WEBPACK_IMPORTED_MODULE_2__["default"](this.getNoteFromDegree(degreeIn), this.getNoteFromDegree(degreeIn + 2), this.getNoteFromDegree(degreeIn + 4));
        }
        getTriads() {
          return this.scale.degrees.map((d) => this.getTriad(d));
        }
        get triads() {
          return this.getTriads();
        }
        toRelative() {
          if (this.scale.equals(_Scale__WEBPACK_IMPORTED_MODULE_0__.EnumScale.MAJOR)) {
            this.note.sub(new _Interval__WEBPACK_IMPORTED_MODULE_3__["default"]("m3"));
            this.scale = _Scale__WEBPACK_IMPORTED_MODULE_0__.EnumScale.MINOR;
          } else if (this.scale.equals(_Scale__WEBPACK_IMPORTED_MODULE_0__.EnumScale.MINOR)) {
            this.note.add(new _Interval__WEBPACK_IMPORTED_MODULE_3__["default"]("m3"));
            this.scale = _Scale__WEBPACK_IMPORTED_MODULE_0__.EnumScale.MAJOR;
          } else
            throw new Error("Relative not found.");
          return this;
        }
        get relative() {
          return this.clone().toRelative();
        }
        toNext() {
          this.note.add(new _Interval__WEBPACK_IMPORTED_MODULE_3__["default"]("P5"));
          return this;
        }
        get next() {
          return this.clone().toNext();
        }
        toPrev() {
          this.note.sub(new _Interval__WEBPACK_IMPORTED_MODULE_3__["default"]("P5"));
          return this;
        }
        get prev() {
          return this.clone().toPrev();
        }
        toString() {
          return `${this.note.toString()} ${this.scale.getName() || this.scale.toString()}`;
        }
        clone() {
          return new _Tonality(this);
        }
        *[Symbol.iterator]() {
          for (let i2 = 0; i2 < this.scale.size; i2++) {
            yield this.note.clone().add(this.scale.intervals[i2]);
          }
        }
      };
      let Tonality = _Tonality;
      Tonality.isTonality = isTonality;
      const __WEBPACK_DEFAULT_EXPORT__ = Tonality;
    },
    "./src/Velocity.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isVelocity": () => isVelocity,
        "EnumVelocity": () => EnumVelocity,
        "Velocity": () => Velocity,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      const isVelocity = (x) => {
        return x instanceof Velocity || typeof x === "object" && x !== null && typeof x.velocity === "number";
      };
      class EnumVelocity {
        static get SILENT() {
          return new Velocity(0);
        }
        static get PPP() {
          return new Velocity(10);
        }
        static get PP() {
          return new Velocity(25);
        }
        static get PIANISSIMO() {
          return new Velocity(25);
        }
        static get P() {
          return new Velocity(50);
        }
        static get MP() {
          return new Velocity(60);
        }
        static get MEZZO_PIANO() {
          return new Velocity(60);
        }
        static get MF() {
          return new Velocity(70);
        }
        static get MEZZO_FORTE() {
          return new Velocity(70);
        }
        static get F() {
          return new Velocity(85);
        }
        static get FORTE() {
          return new Velocity(85);
        }
        static get FF() {
          return new Velocity(100);
        }
        static get FORTISSIMO() {
          return new Velocity(100);
        }
        static get FFF() {
          return new Velocity(120);
        }
      }
      const _Velocity = class {
        constructor(velocityIn) {
          this.become(velocityIn);
        }
        become(velocityIn) {
          if (typeof velocityIn === "undefined")
            this.velocity = 85;
          else if (typeof velocityIn === "number")
            this.velocity = velocityIn;
          else
            this.velocity = velocityIn.velocity;
          return this;
        }
        get velocity() {
          return this._velocity;
        }
        set velocity(value) {
          this._velocity = Math.max(0, Math.min(128, ~~value));
        }
        add(that) {
          this.velocity += that.velocity;
          return this;
        }
        sub(that) {
          this.velocity -= that.velocity;
          return this;
        }
        mul(fIn) {
          this.velocity *= fIn;
          return this;
        }
        div(that) {
          if (typeof that === "number") {
            this.velocity /= that;
            return this;
          }
          return this.velocity /= that.velocity;
        }
        equals(that) {
          return isVelocity(that) && this.velocity === that.velocity;
        }
        compareTo(that) {
          return this.velocity - that.velocity;
        }
        normalize() {
          return this.velocity / 128;
        }
        clone() {
          return new _Velocity(this);
        }
        toString() {
          return `Vel: ${this.velocity}`;
        }
      };
      let Velocity = _Velocity;
      Velocity.isVelocity = isVelocity;
      Velocity.EnumVelocity = EnumVelocity;
      const __WEBPACK_DEFAULT_EXPORT__ = Velocity;
    },
    "./src/effect/Automation.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isAutomation": () => isAutomation,
        "isAutomationArray": () => isAutomationArray,
        "Automation": () => Automation,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _AutomationPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/effect/AutomationPoint.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/utils.ts");
      const isAutomation = (x) => {
        return x instanceof Automation || typeof x.path === "string" && (0, _AutomationPoint__WEBPACK_IMPORTED_MODULE_0__.isAutomationPointArray)(x.points);
      };
      const isAutomationArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_1__.isObjectArray)(x, isAutomation);
      };
      const _Automation = class {
        static fromArray(automationsIn) {
          return automationsIn.map((e) => new _Automation(e));
        }
        constructor(p1, points) {
          if (typeof p1 === "string") {
            this.path = p1;
            this.points = points ? points.map((e) => e.clone()) : [];
          } else {
            this.path = p1.path;
            this.points = _AutomationPoint__WEBPACK_IMPORTED_MODULE_0__["default"].fromArray(p1.points);
          }
        }
        getValueAtTime(time) {
          this.sort();
          let prev;
          let next;
          for (const p of this.points) {
            if (p.offset.compareTo(time) < 0)
              prev = p;
            if (p.offset.compareTo(time) > 0) {
              next = p;
              break;
            }
          }
          if (!prev)
            return next.value;
          if (!next)
            return prev.value;
          if (prev && next) {
            const duration = next.offset.clone().sub(prev.offset);
            const split = time.clone().sub(prev.offset);
            const ratio = split.div(duration);
            return (0, _utils__WEBPACK_IMPORTED_MODULE_1__.getValueFromCurve)(prev.value, next.value, ratio, prev.exponent);
          }
          throw new Error(`No point in automation: ${this.path}`);
        }
        addPointAtTime(time) {
          this.points.push(new _AutomationPoint__WEBPACK_IMPORTED_MODULE_0__["default"](this.getValueAtTime(time), time, 0));
        }
        sort() {
          this.points = this.points.sort((a, b) => a.offset.compareTo(b.offset));
        }
        forward(duration) {
          this.points.forEach((p) => p.offset.add(duration));
        }
        rewind(duration) {
          this.points.forEach((p) => p.offset.sub(duration));
        }
        toString() {
          return `Automation: "${this.path}": {${this.points.map((p) => `${p.value.toFixed(2)}@${p.offset.toString()}`).join()}}`;
        }
        clone() {
          return new _Automation(this);
        }
      };
      let Automation = _Automation;
      Automation.isAutomation = isAutomation;
      Automation.isAutomationArray = isAutomationArray;
      const __WEBPACK_DEFAULT_EXPORT__ = Automation;
    },
    "./src/effect/AutomationPoint.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isAutomationPoint": () => isAutomationPoint,
        "isAutomationPointArray": () => isAutomationPointArray,
        "AutomationPoint": () => AutomationPoint,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _Duration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Duration.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/utils.ts");
      const isAutomationPoint = (x) => {
        return x instanceof AutomationPoint || typeof x.value === "number" && (0, _Duration__WEBPACK_IMPORTED_MODULE_0__.isDuration)(x.offset) && typeof x.exponent === "number";
      };
      const isAutomationPointArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_1__.isObjectArray)(x, isAutomationPoint);
      };
      const _AutomationPoint = class {
        static fromArray(arrayIn) {
          return arrayIn.map((e) => new _AutomationPoint(e));
        }
        constructor(p1, offset, exponent) {
          this.become(p1, offset, exponent);
        }
        become(p1, offset, exponent) {
          if (typeof p1 === "number") {
            this.value = p1;
            this.offset = offset.clone();
            this.exponent = exponent || 0;
          } else {
            this.value = p1.value;
            this.offset = new _Duration__WEBPACK_IMPORTED_MODULE_0__["default"](p1.offset);
            this.exponent = p1.exponent;
          }
          return this;
        }
        clone() {
          return new _AutomationPoint(this);
        }
      };
      let AutomationPoint = _AutomationPoint;
      AutomationPoint.isAutomationPoint = isAutomationPoint;
      AutomationPoint.isAutomationPointArray = isAutomationPointArray;
      const __WEBPACK_DEFAULT_EXPORT__ = AutomationPoint;
    },
    "./src/genre/Random.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "Random": () => Random,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var seedrandom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./node_modules/seedrandom/index.js");
      var seedrandom__WEBPACK_IMPORTED_MODULE_0___default = /* @__PURE__ */ __webpack_require__2.n(seedrandom__WEBPACK_IMPORTED_MODULE_0__);
      class Random {
        constructor(seedIn) {
          this.prng = seedrandom__WEBPACK_IMPORTED_MODULE_0___default()(seedIn || "");
        }
        quick() {
          return this.prng.quick();
        }
        int32() {
          return this.prng.int32();
        }
        double() {
          return this.prng.double();
        }
        state() {
          return this.prng.state();
        }
        randint(minimum, maximum) {
          return Math.floor(this.quick() * (maximum - minimum + 1)) + minimum;
        }
      }
      const __WEBPACK_DEFAULT_EXPORT__ = Random;
    },
    "./src/series.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "x2dx": () => x2dx,
        "dx2x": () => dx2x,
        "arithSer": () => arithSer,
        "fiboSer": () => fiboSer,
        "geometricSer": () => geometricSer,
        "isPrime": () => isPrime,
        "primeSer": () => primeSer,
        "inharmSer": () => inharmSer,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      const x2dx = (array) => {
        const [, ...rest] = array;
        return rest.map((v2, i2) => v2 - array[i2]);
      };
      const dx2x = (array, start = 0) => {
        let acc = start;
        const ret = array.map((v) => acc += v);
        return [start, ...ret];
      };
      const arithSer = (begin = 0, end = 10, step = 1, nummax = Number.MAX_SAFE_INTEGER) => {
        const array = [];
        for (let n = begin; step >= 0 ? n <= end : n >= end; n += step) {
          array.push(n);
          if (array.length >= nummax)
            return array;
        }
        return array;
      };
      const fiboSer = (seed1 = 0, seed2 = 1, limit = 10) => {
        const array = [];
        if (seed1 < limit)
          array.push(seed1);
        if (seed2 < limit)
          array.push(seed2);
        let acc1 = seed2;
        let acc2 = seed1 + seed2;
        while (acc2 < limit) {
          array.push(acc2);
          [acc1, acc2] = [acc2, acc2 + acc1];
        }
        return array;
      };
      const geometricSer = (seed = 1, factor = 2, limit = 10, nummax = Number.MAX_SAFE_INTEGER) => {
        const array = [];
        if (factor < 1)
          return array;
        for (let n = seed; n < limit; n *= factor) {
          array.push(n);
          if (array.length >= nummax)
            return array;
        }
        return array;
      };
      const isPrime = (num) => {
        for (let i2 = 2; i2 <= Math.sqrt(num); i2++) {
          if (num % i2 === 0) {
            return false;
          }
        }
        return true;
      };
      const primeSer = (max = 100, nummax = Number.MAX_SAFE_INTEGER) => {
        const array = [];
        for (let n = 2; n < max; n++) {
          if (isPrime(n))
            array.push(n);
          if (array.length >= nummax)
            return array;
        }
        return array;
      };
      const inharmSer = (begin = 1, dist = 1, npart = 1) => {
        const array = [];
        for (let i2 = 1; i2 <= npart; i2++) {
          array.push(begin * i2 ** dist);
        }
        return array;
      };
      const Series = {
        x2dx,
        dx2x,
        arithSer,
        fiboSer,
        geometricSer,
        isPrime,
        primeSer,
        inharmSer
      };
      const __WEBPACK_DEFAULT_EXPORT__ = Series;
    },
    "./src/track/Roll.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isRoll": () => isRoll,
        "Roll": () => Roll,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _tonejs_midi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./node_modules/@tonejs/midi/dist/Midi.js");
      var _tonejs_midi__WEBPACK_IMPORTED_MODULE_0___default = /* @__PURE__ */ __webpack_require__2.n(_tonejs_midi__WEBPACK_IMPORTED_MODULE_0__);
      var _TimeCode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/TimeCode.ts");
      var _TrackChord__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/track/TrackChord.ts");
      const isRoll = _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChordArray;
      const _Roll = class extends Array {
        static from(arrayLike, mapfn, thisArg) {
          if (!((0, _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChordInstanceArrayLike)(arrayLike) || (0, _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChordInstanceIterable)(arrayLike)))
            throw new TypeError("Items from are not TrackChords");
          if (mapfn)
            return super.from(arrayLike, mapfn, thisArg);
          return super.from(arrayLike);
        }
        static of(...items) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChordArray)(items))
            throw new TypeError("Items of are not TrackChords");
          return super.of(...items);
        }
        static fromArrays(chordsIn, offsetsIn, durationsIn, velocitiesIn, articulationsIn) {
          const seq = new _Roll();
          for (let i2 = 0; i2 < Math.max(chordsIn.length, (durationsIn == null ? void 0 : durationsIn.length) || 0); i2++) {
            let tc;
            const cIn = chordsIn[i2];
            const oIn = offsetsIn == null ? void 0 : offsetsIn[i2];
            const dIn = durationsIn == null ? void 0 : durationsIn[i2];
            const vIn = velocitiesIn == null ? void 0 : velocitiesIn[i2];
            const aIn = articulationsIn == null ? void 0 : articulationsIn[i2];
            if ((0, _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChord)(cIn))
              tc = new _TrackChord__WEBPACK_IMPORTED_MODULE_2__["default"](cIn);
            else
              tc = new _TrackChord__WEBPACK_IMPORTED_MODULE_2__["default"](cIn, dIn, oIn, aIn);
            tc.setVelocities(vIn);
            seq[i2] = tc;
          }
          return seq;
        }
        constructor(p1, ...arrayIn) {
          if (typeof p1 === "number" || typeof p1 === "undefined") {
            super(p1);
          } else {
            super(arrayIn.length + 1);
            const trackChords = [p1, ...arrayIn];
            if (isRoll(trackChords))
              super(..._TrackChord__WEBPACK_IMPORTED_MODULE_2__["default"].fromArray(trackChords));
          }
        }
        push(...itemsIn) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChordArray)(itemsIn))
            throw new TypeError("Items to push are not TrackChords");
          return super.push(..._TrackChord__WEBPACK_IMPORTED_MODULE_2__["default"].fromArray(itemsIn));
        }
        concat(...itemsIn) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChordArray)(itemsIn))
            throw new TypeError("Items to concat are not TrackChords");
          return super.concat(..._TrackChord__WEBPACK_IMPORTED_MODULE_2__["default"].fromArray(itemsIn));
        }
        unshift(...itemsIn) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChordArray)(itemsIn))
            throw new TypeError("Items to unshift are not TrackChords");
          return super.unshift(..._TrackChord__WEBPACK_IMPORTED_MODULE_2__["default"].fromArray(itemsIn));
        }
        fill(value, start, end) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_2__.isTrackChord)(value))
            throw new TypeError("Item to fill is not a TrackChord");
          return super.fill(new _TrackChord__WEBPACK_IMPORTED_MODULE_2__["default"](value), start, end);
        }
        toMidi({ bpm, beats, beatDuration } = new _TimeCode__WEBPACK_IMPORTED_MODULE_1__["default"](4, 4, 60)) {
          const midi = new _tonejs_midi__WEBPACK_IMPORTED_MODULE_0__.Midi();
          midi.header.setTempo(bpm);
          midi.header.timeSignatures.push({ ticks: 0, measures: 0, timeSignature: [beats, beatDuration] });
          midi.header.update();
          const track = midi.addTrack();
          this.forEach((trackChord) => {
            const ticks = trackChord.offset.getTicks(bpm);
            const durationTicks = trackChord.duration.getTicks(bpm);
            trackChord.trackNotes.forEach((trackNote) => {
              track.addNote({
                midi: ~~trackNote.pitch.offset,
                velocity: trackNote.velocity.normalize(),
                ticks,
                durationTicks
              });
            });
          });
          return midi.toArray();
        }
        async toGuidoAR(factory, spaceFactor = 1) {
          factory.openMusic();
          factory.openVoice();
          for (let i2 = 0; i2 < this.length; i2++) {
            const trackChord = this[i2];
            const nextTrackChord = this[i2 + 1];
            const space = nextTrackChord ? nextTrackChord.offset.sub(trackChord.offset).getBeats() : trackChord.duration.getBeats();
            factory.openChord();
            if (!trackChord.trackNotes.length) {
              factory.openEvent("_");
              factory.closeEvent();
            } else {
              for (const trackNote of trackChord) {
                trackNote.pitch.openGuidoEvent(factory, trackChord.duration);
              }
            }
            factory.closeChord();
            factory.openTag("space", 0);
            factory.addTagParameterFloat(space * 16 * spaceFactor);
            factory.setParameterUnit("hs");
            factory.setParameterName("dd");
            factory.closeTag();
          }
          factory.closeVoice();
          return factory.closeMusic();
        }
      };
      let Roll = _Roll;
      Roll.isRoll = isRoll;
      const __WEBPACK_DEFAULT_EXPORT__ = Roll;
    },
    "./src/track/Segment.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isSegment": () => isSegment,
        "isSegmentArray": () => isSegmentArray,
        "Segment": () => Segment,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _TrackChord__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/track/TrackChord.ts");
      var _effect_Automation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/effect/Automation.ts");
      var _Duration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Duration.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/utils.ts");
      var _TimeCode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__2("./src/TimeCode.ts");
      var _Sequence__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__2("./src/track/Sequence.ts");
      const isSegment = (x) => {
        return x instanceof Segment || typeof x === "object" && x !== null && (0, _TrackChord__WEBPACK_IMPORTED_MODULE_0__.isTrackChordArray)(x.trackChords) && (0, _effect_Automation__WEBPACK_IMPORTED_MODULE_1__.isAutomationArray)(x.automations) && (0, _Duration__WEBPACK_IMPORTED_MODULE_2__.isDuration)(x.duration);
      };
      const isSegmentArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_3__.isObjectArray)(x, isSegment);
      };
      const _Segment = class {
        constructor(optionsIn) {
          this.trackChords = _Sequence__WEBPACK_IMPORTED_MODULE_5__["default"].fromArrays(optionsIn.trackChords);
          this.automations = _effect_Automation__WEBPACK_IMPORTED_MODULE_1__["default"].fromArray(optionsIn.automations);
          this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_2__["default"](optionsIn.duration);
        }
        getChords() {
          return this.trackChords.map((trackChord) => trackChord.getChord());
        }
        setChords(chordsIn, velocitiesIn) {
          chordsIn.forEach((e, i2) => {
            const trackChord = this.trackChords[i2];
            trackChord.setChord(e, velocitiesIn == null ? void 0 : velocitiesIn[i2]);
          });
        }
        get noteDurations() {
          return this.trackChords.map((note) => note.duration);
        }
        set noteDurations(durationsIn) {
          durationsIn.forEach((e, i2) => {
            const trackNote = this.trackChords[i2];
            if (trackNote)
              trackNote.duration = e.clone();
          });
        }
        get noteOffsets() {
          return this.trackChords.map((note) => note.offset);
        }
        set noteOffsets(offsetsIn) {
          offsetsIn.forEach((e, i2) => {
            const trackNote = this.trackChords[i2];
            if (trackNote)
              trackNote.offset = e.clone();
          });
        }
        clone() {
          return new _Segment(this);
        }
        toMidi({ bpm, beats, beatDuration } = new _TimeCode__WEBPACK_IMPORTED_MODULE_4__["default"](4, 4, 60)) {
          return this.trackChords.toMidi({ bpm, beats, beatDuration });
        }
      };
      let Segment = _Segment;
      Segment.isSegment = isSegment;
      Segment.isSegmentArray = isSegmentArray;
      const __WEBPACK_DEFAULT_EXPORT__ = Segment;
    },
    "./src/track/Sequence.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isSequence": () => isSequence,
        "isSequenceArray": () => isSequenceArray,
        "isSequenceInstanceArrayLike": () => isSequenceInstanceArrayLike,
        "isSequenceInstanceIterable": () => isSequenceInstanceIterable,
        "Sequence": () => Sequence,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _tonejs_midi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./node_modules/@tonejs/midi/dist/Midi.js");
      var _tonejs_midi__WEBPACK_IMPORTED_MODULE_0___default = /* @__PURE__ */ __webpack_require__2.n(_tonejs_midi__WEBPACK_IMPORTED_MODULE_0__);
      var _Duration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Duration.ts");
      var _TimeCode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/TimeCode.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/utils.ts");
      var _TrackChord__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__2("./src/track/TrackChord.ts");
      const isSequence = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_3__.isObjectInstanceArray)(x, _TrackChord__WEBPACK_IMPORTED_MODULE_4__["default"]);
      };
      const isSequenceArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_3__.isObjectArray)(x, isSequence);
      };
      const isSequenceInstanceArrayLike = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_3__.isObjectInstanceArrayLike)(x, Sequence);
      };
      const isSequenceInstanceIterable = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_3__.isObjectInstanceIterable)(x, Sequence);
      };
      const _Sequence = class extends Array {
        static from(arrayLike, mapfn, thisArg) {
          if (!((0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChordInstanceArrayLike)(arrayLike) || (0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChordInstanceIterable)(arrayLike)))
            throw new TypeError("Items from are not TrackChords");
          const o = mapfn ? super.from(arrayLike, mapfn, thisArg) : super.from(arrayLike);
          return Object.setPrototypeOf(o, _Sequence.prototype);
        }
        static of(...items) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChordArray)(items))
            throw new TypeError("Items of are not TrackChords");
          const o = super.of(...items);
          return Object.setPrototypeOf(o, _Sequence.prototype);
        }
        static fromArray(arrayIn) {
          return arrayIn.map((e) => new _Sequence(...e));
        }
        static fromArrays(chordsIn, durationsIn, velocitiesIn, articulationsIn) {
          const seq = new _Sequence();
          const o = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](0, 4);
          for (let i2 = 0; i2 < Math.max(chordsIn.length, (durationsIn == null ? void 0 : durationsIn.length) || 0); i2++) {
            let tc;
            const cIn = chordsIn[i2];
            const dIn = durationsIn == null ? void 0 : durationsIn[i2];
            const vIn = velocitiesIn == null ? void 0 : velocitiesIn[i2];
            const aIn = articulationsIn == null ? void 0 : articulationsIn[i2];
            if ((0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChord)(cIn))
              tc = new _TrackChord__WEBPACK_IMPORTED_MODULE_4__["default"](cIn);
            else
              tc = new _TrackChord__WEBPACK_IMPORTED_MODULE_4__["default"](cIn, dIn, o.clone(), aIn);
            tc.setVelocities(vIn);
            o.add(tc.duration);
            seq[i2] = tc;
          }
          return seq;
        }
        constructor(p1, ...arrayIn) {
          if (typeof p1 === "number" || typeof p1 === "undefined") {
            super(p1);
          } else {
            super(arrayIn.length + 1);
            const trackChords = [p1, ...arrayIn];
            if ((0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChordArray)(trackChords))
              super(..._TrackChord__WEBPACK_IMPORTED_MODULE_4__["default"].fromArray(trackChords));
          }
        }
        push(...itemsIn) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChordArray)(itemsIn))
            throw new TypeError("Items to push are not TrackChords");
          return super.push(..._TrackChord__WEBPACK_IMPORTED_MODULE_4__["default"].fromArray(itemsIn));
        }
        concat(...itemsIn) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChordArray)(itemsIn))
            throw new TypeError("Items to concat are not TrackChords");
          return super.concat(..._TrackChord__WEBPACK_IMPORTED_MODULE_4__["default"].fromArray(itemsIn));
        }
        unshift(...itemsIn) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChordArray)(itemsIn))
            throw new TypeError("Items to unshift are not TrackChords");
          return super.unshift(..._TrackChord__WEBPACK_IMPORTED_MODULE_4__["default"].fromArray(itemsIn));
        }
        fill(value, start, end) {
          if (!(0, _TrackChord__WEBPACK_IMPORTED_MODULE_4__.isTrackChord)(value))
            throw new TypeError("Item to fill is not a TrackChord");
          return super.fill(new _TrackChord__WEBPACK_IMPORTED_MODULE_4__["default"](value), start, end);
        }
        toMidi({ bpm, beats, beatDuration } = new _TimeCode__WEBPACK_IMPORTED_MODULE_2__["default"](4, 4, 60)) {
          const midi = new _tonejs_midi__WEBPACK_IMPORTED_MODULE_0__.Midi();
          midi.header.setTempo(bpm);
          midi.header.timeSignatures.push({ ticks: 0, measures: 0, timeSignature: [beats, beatDuration] });
          midi.header.update();
          const track = midi.addTrack();
          this.forEach((trackChord) => {
            const ticks = trackChord.offset.getTicks(bpm);
            const durationTicks = trackChord.duration.getTicks(bpm);
            trackChord.trackNotes.forEach((trackNote) => {
              track.addNote({
                midi: ~~trackNote.pitch.offset,
                velocity: trackNote.velocity.normalize(),
                ticks,
                durationTicks
              });
            });
          });
          return midi.toArray();
        }
        async toGuidoAR(factory) {
          factory.openMusic();
          factory.openVoice();
          for (const trackChord of this) {
            factory.openChord();
            if (!trackChord.trackNotes.length) {
              factory.openEvent("_");
              factory.closeEvent();
            } else {
              for (const trackNote of trackChord) {
                trackNote.pitch.openGuidoEvent(factory, trackChord.duration);
              }
            }
            factory.closeChord();
          }
          factory.closeVoice();
          return factory.closeMusic();
        }
      };
      let Sequence = _Sequence;
      Sequence.isSequence = isSequence;
      Sequence.isSequenceArray = isSequenceArray;
      Sequence.isSequenceInstanceArrayLike = isSequenceInstanceArrayLike;
      Sequence.isSequenceInstanceIterable = isSequenceInstanceIterable;
      const __WEBPACK_DEFAULT_EXPORT__ = Sequence;
    },
    "./src/track/Sequences.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isSequences": () => isSequences,
        "Sequences": () => Sequences,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _tonejs_midi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./node_modules/@tonejs/midi/dist/Midi.js");
      var _tonejs_midi__WEBPACK_IMPORTED_MODULE_0___default = /* @__PURE__ */ __webpack_require__2.n(_tonejs_midi__WEBPACK_IMPORTED_MODULE_0__);
      var _TimeCode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/TimeCode.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/utils.ts");
      var _Sequence__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/track/Sequence.ts");
      const isSequences = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_2__.isObjectInstanceArray)(x, _Sequence__WEBPACK_IMPORTED_MODULE_3__["default"]);
      };
      const _Sequences = class extends Array {
        static from(arrayLike, mapfn, thisArg) {
          if (!((0, _Sequence__WEBPACK_IMPORTED_MODULE_3__.isSequenceInstanceArrayLike)(arrayLike) || (0, _Sequence__WEBPACK_IMPORTED_MODULE_3__.isSequenceInstanceIterable)(arrayLike)))
            throw new TypeError("Items from are not Sequences");
          const o = mapfn ? super.from(arrayLike, mapfn, thisArg) : super.from(arrayLike);
          return Object.setPrototypeOf(o, _Sequences.prototype);
        }
        static of(...items) {
          if (!(0, _Sequence__WEBPACK_IMPORTED_MODULE_3__.isSequenceArray)(items))
            throw new TypeError("Items of are not Sequences");
          const o = super.of(...items);
          return Object.setPrototypeOf(o, _Sequences.prototype);
        }
        constructor(p1, ...arrayIn) {
          if (typeof p1 === "number" || typeof p1 === "undefined") {
            super(p1);
          } else {
            super(arrayIn.length + 1);
            const sequences = [p1, ...arrayIn];
            if ((0, _Sequence__WEBPACK_IMPORTED_MODULE_3__.isSequenceArray)(sequences))
              super(..._Sequence__WEBPACK_IMPORTED_MODULE_3__["default"].fromArray(sequences));
          }
        }
        push(...itemsIn) {
          if (!(0, _Sequence__WEBPACK_IMPORTED_MODULE_3__.isSequenceArray)(itemsIn))
            throw new TypeError("Items to push are not Sequences");
          return super.push(..._Sequence__WEBPACK_IMPORTED_MODULE_3__["default"].fromArray(itemsIn));
        }
        concat(...itemsIn) {
          if (!(0, _Sequence__WEBPACK_IMPORTED_MODULE_3__.isSequenceArray)(itemsIn))
            throw new TypeError("Items to concat are not Sequences");
          return super.concat(..._Sequence__WEBPACK_IMPORTED_MODULE_3__["default"].fromArray(itemsIn));
        }
        unshift(...itemsIn) {
          if (!(0, _Sequence__WEBPACK_IMPORTED_MODULE_3__.isSequenceArray)(itemsIn))
            throw new TypeError("Items to unshift are not Sequences");
          return super.unshift(..._Sequence__WEBPACK_IMPORTED_MODULE_3__["default"].fromArray(itemsIn));
        }
        fill(value, start, end) {
          if (!(0, _Sequence__WEBPACK_IMPORTED_MODULE_3__.isSequence)(value))
            throw new TypeError("Item to fill is not a Sequence");
          return super.fill(new _Sequence__WEBPACK_IMPORTED_MODULE_3__["default"](...value), start, end);
        }
        toMidi({ bpm, beats, beatDuration } = new _TimeCode__WEBPACK_IMPORTED_MODULE_1__["default"](4, 4, 60)) {
          const midi = new _tonejs_midi__WEBPACK_IMPORTED_MODULE_0__.Midi();
          midi.header.setTempo(bpm);
          midi.header.timeSignatures.push({ ticks: 0, measures: 0, timeSignature: [beats, beatDuration] });
          midi.header.update();
          this.forEach((sequence, i2) => {
            const track = midi.addTrack();
            track.channel = i2;
            sequence.forEach((trackChord) => {
              const ticks = trackChord.offset.getTicks(bpm);
              const durationTicks = trackChord.duration.getTicks(bpm);
              trackChord.trackNotes.forEach((trackNote) => {
                track.addNote({
                  midi: ~~trackNote.pitch.offset,
                  velocity: trackNote.velocity.normalize(),
                  ticks,
                  durationTicks
                });
              });
            });
          });
          return midi.toArray();
        }
        async toGuidoAR(factory) {
          factory.openMusic();
          for (const sequence of this) {
            factory.openVoice();
            for (const trackChord of sequence) {
              factory.openChord();
              if (!trackChord.trackNotes.length) {
                factory.openEvent("_");
                factory.closeEvent();
              } else {
                for (const trackNote of trackChord) {
                  trackNote.pitch.openGuidoEvent(factory, trackChord.duration);
                }
              }
              factory.closeChord();
            }
            factory.closeVoice();
          }
          return factory.closeMusic();
        }
      };
      let Sequences = _Sequences;
      Sequences.isSequences = isSequences;
      const __WEBPACK_DEFAULT_EXPORT__ = Sequences;
    },
    "./src/track/TrackChord.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isTrackChord": () => isTrackChord,
        "isTrackChordArray": () => isTrackChordArray,
        "isTrackChordInstanceArrayLike": () => isTrackChordInstanceArrayLike,
        "isTrackChordInstanceIterable": () => isTrackChordInstanceIterable,
        "TrackChord": () => TrackChord,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _tonejs_midi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./node_modules/@tonejs/midi/dist/Midi.js");
      var _tonejs_midi__WEBPACK_IMPORTED_MODULE_0___default = /* @__PURE__ */ __webpack_require__2.n(_tonejs_midi__WEBPACK_IMPORTED_MODULE_0__);
      var _Duration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Duration.ts");
      var _Articulation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/Articulation.ts");
      var _TrackNote__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/track/TrackNote.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__2("./src/utils.ts");
      var _TimeCode__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__2("./src/TimeCode.ts");
      var _Chord__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__2("./src/Chord.ts");
      var _Velocity__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__2("./src/Velocity.ts");
      var _Note__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__2("./src/Note.ts");
      const isTrackChord = (x) => {
        return x instanceof TrackChord || typeof x === "object" && x !== null && (0, _Duration__WEBPACK_IMPORTED_MODULE_1__.isDuration)(x.duration) && (0, _Duration__WEBPACK_IMPORTED_MODULE_1__.isDuration)(x.offset) && (typeof x.trackNotes === "undefined" || (0, _TrackNote__WEBPACK_IMPORTED_MODULE_3__.isTrackNoteArray)(x.trackNotes)) && (typeof x.articulation === "undefined" || (0, _Articulation__WEBPACK_IMPORTED_MODULE_2__.isArticulation)(x.articulation));
      };
      const isTrackChordArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_4__.isObjectArray)(x, isTrackChord);
      };
      const isTrackChordInstanceArrayLike = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_4__.isObjectInstanceArrayLike)(x, TrackChord);
      };
      const isTrackChordInstanceIterable = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_4__.isObjectInstanceIterable)(x, TrackChord);
      };
      const _TrackChord = class {
        static fromArray(arrayIn) {
          return arrayIn.map((e) => new _TrackChord(e));
        }
        constructor(p1, durationIn = "4n", offsetIn = "0", articulationIn) {
          this.become(p1, durationIn, offsetIn, articulationIn);
        }
        become(p1, durationIn = "4n", offsetIn = "0", articulationIn) {
          if (isTrackChord(p1)) {
            this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](p1.duration);
            this.offset = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](p1.offset);
            if (p1.trackNotes)
              this.trackNotes = _TrackNote__WEBPACK_IMPORTED_MODULE_3__["default"].fromArray(p1.trackNotes);
            if (p1.articulation)
              this.articulation = new _Articulation__WEBPACK_IMPORTED_MODULE_2__["default"](p1.articulation);
          } else {
            if ((0, _utils__WEBPACK_IMPORTED_MODULE_4__.isNumberArray)(p1) || (0, _utils__WEBPACK_IMPORTED_MODULE_4__.isStringArray)(p1) || (0, _Note__WEBPACK_IMPORTED_MODULE_8__.isNoteArray)(p1) || (0, _TrackNote__WEBPACK_IMPORTED_MODULE_3__.isTrackNoteArray)(p1))
              this.trackNotes = _TrackNote__WEBPACK_IMPORTED_MODULE_3__["default"].fromArray(p1);
            else if ((0, _Chord__WEBPACK_IMPORTED_MODULE_6__.isChord)(p1))
              this.trackNotes = _TrackNote__WEBPACK_IMPORTED_MODULE_3__["default"].fromArray(new _Chord__WEBPACK_IMPORTED_MODULE_6__["default"](p1).notes);
            else
              this.trackNotes = _TrackNote__WEBPACK_IMPORTED_MODULE_3__["default"].fromArray([p1]);
            if ((0, _Duration__WEBPACK_IMPORTED_MODULE_1__.isDuration)(durationIn))
              this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](durationIn);
            else if ((0, _Duration__WEBPACK_IMPORTED_MODULE_1__.isDurationAbbreviation)(durationIn))
              this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](durationIn);
            else if (typeof durationIn === "number")
              this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](durationIn, 4);
            else
              this.duration = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](durationIn[0], durationIn[1]);
            if ((0, _Duration__WEBPACK_IMPORTED_MODULE_1__.isDuration)(offsetIn))
              this.offset = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](offsetIn);
            else if ((0, _Duration__WEBPACK_IMPORTED_MODULE_1__.isDurationAbbreviation)(offsetIn))
              this.offset = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](offsetIn);
            else if (typeof offsetIn === "number")
              this.offset = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](offsetIn, 4);
            else
              this.offset = new _Duration__WEBPACK_IMPORTED_MODULE_1__["default"](offsetIn[0], offsetIn[1]);
            this.articulation = new _Articulation__WEBPACK_IMPORTED_MODULE_2__["default"](articulationIn);
          }
          return this;
        }
        getChord() {
          if (this.trackNotes.length === 0)
            return null;
          return new _Chord__WEBPACK_IMPORTED_MODULE_6__["default"](...this.trackNotes.map((tn) => tn.pitch));
        }
        setChord(chordIn, velocitiesIn) {
          if (chordIn) {
            this.trackNotes = void 0;
            return;
          }
          this.trackNotes = chordIn.notes.map((n, i2) => {
            return new _TrackNote__WEBPACK_IMPORTED_MODULE_3__["default"](n, velocitiesIn == null ? void 0 : velocitiesIn[i2]);
          });
        }
        setVelocities(velocitiesIn) {
          this.trackNotes.forEach((tn, i2) => {
            const v = Array.isArray(velocitiesIn) ? velocitiesIn[i2] : velocitiesIn;
            tn.velocity = typeof v === "number" ? new _Velocity__WEBPACK_IMPORTED_MODULE_7__["default"](v) : new _Velocity__WEBPACK_IMPORTED_MODULE_7__["default"](v);
          });
        }
        clone() {
          return new _TrackChord(this);
        }
        toMidi({ bpm, beats, beatDuration } = new _TimeCode__WEBPACK_IMPORTED_MODULE_5__["default"](4, 4, 60)) {
          const midi = new _tonejs_midi__WEBPACK_IMPORTED_MODULE_0__.Midi();
          midi.header.setTempo(bpm);
          midi.header.timeSignatures.push({ ticks: 0, measures: 0, timeSignature: [beats, beatDuration] });
          midi.header.update();
          const track = midi.addTrack();
          const ticks = this.offset.getTicks(bpm);
          const durationTicks = this.duration.getTicks(bpm);
          this.trackNotes.forEach((trackNote) => {
            track.addNote({
              midi: ~~trackNote.pitch.offset,
              velocity: trackNote.velocity.normalize(),
              ticks,
              durationTicks
            });
          });
          return midi.toArray();
        }
        *[Symbol.iterator]() {
          for (const trackNote of this.trackNotes) {
            yield trackNote;
          }
        }
        toString() {
          return `${this.offset} -> ${this.trackNotes ? this.trackNotes.toString() : "*"} ${this.duration}`;
        }
      };
      let TrackChord = _TrackChord;
      TrackChord.isTrackChord = isTrackChord;
      TrackChord.isTrackChordArray = isTrackChordArray;
      TrackChord.isTrackChordInstanceArrayLike = isTrackChordInstanceArrayLike;
      TrackChord.isTrackChordInstanceIterable = isTrackChordInstanceIterable;
      const __WEBPACK_DEFAULT_EXPORT__ = TrackChord;
    },
    "./src/track/TrackNote.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "isTrackNote": () => isTrackNote,
        "isTrackNoteArray": () => isTrackNoteArray,
        "default": () => TrackNote
      });
      var _Note__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Note.ts");
      var _Pitch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__2("./src/Pitch.ts");
      var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__2("./src/utils.ts");
      var _Velocity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__2("./src/Velocity.ts");
      const isTrackNote = (x) => {
        return x instanceof TrackNote || typeof x === "object" && x !== null && (0, _Pitch__WEBPACK_IMPORTED_MODULE_1__.isPitch)(x.pitch) && (0, _Velocity__WEBPACK_IMPORTED_MODULE_3__.isVelocity)(x.velocity);
      };
      const isTrackNoteArray = (x) => {
        return (0, _utils__WEBPACK_IMPORTED_MODULE_2__.isObjectArray)(x, isTrackNote);
      };
      const _TrackNote = class {
        static fromArray(notesIn, velocitiesIn = []) {
          return notesIn.map((e, i2) => {
            const velocity = velocitiesIn[i2];
            if (isTrackNote(e))
              return new _TrackNote(e);
            return new _TrackNote(e, velocity);
          });
        }
        constructor(p1, velocityIn) {
          this.become(p1, velocityIn);
        }
        become(p1, velocityIn) {
          if (isTrackNote(p1)) {
            const { pitch, velocity } = p1;
            this.pitch = new _Pitch__WEBPACK_IMPORTED_MODULE_1__["default"](pitch);
            this.velocity = new _Velocity__WEBPACK_IMPORTED_MODULE_3__["default"](velocity);
          } else {
            if (typeof p1 === "number")
              this.pitch = new _Pitch__WEBPACK_IMPORTED_MODULE_1__["default"](p1);
            else if (typeof p1 === "string")
              this.pitch = new _Pitch__WEBPACK_IMPORTED_MODULE_1__["default"](p1);
            else if ((0, _Note__WEBPACK_IMPORTED_MODULE_0__.isNote)(p1))
              this.pitch = new _Pitch__WEBPACK_IMPORTED_MODULE_1__["default"](p1);
            if (velocityIn instanceof _Velocity__WEBPACK_IMPORTED_MODULE_3__["default"])
              this.velocity = velocityIn.clone();
            else if (typeof velocityIn === "number")
              this.velocity = new _Velocity__WEBPACK_IMPORTED_MODULE_3__["default"](velocityIn);
            else
              this.velocity = new _Velocity__WEBPACK_IMPORTED_MODULE_3__["default"](85);
          }
          return this;
        }
        clone() {
          return new _TrackNote(this);
        }
      };
      let TrackNote = _TrackNote;
      TrackNote.isTrackNote = isTrackNote;
      TrackNote.isTrackNoteArray = isTrackNoteArray;
    },
    "./src/utils.ts": (__unused_webpack_module, __webpack_exports__2, __webpack_require__2) => {
      "use strict";
      __webpack_require__2.r(__webpack_exports__2);
      __webpack_require__2.d(__webpack_exports__2, {
        "precisionFactor": () => precisionFactor,
        "gcd": () => gcd,
        "lcm": () => lcm,
        "floorMod": () => floorMod,
        "isStringArray": () => isStringArray,
        "isNumberArray": () => isNumberArray,
        "isObjectArray": () => isObjectArray,
        "isObjectInstanceArray": () => isObjectInstanceArray,
        "isObjectArrayLike": () => isObjectArrayLike,
        "isObjectInstanceArrayLike": () => isObjectInstanceArrayLike,
        "isObjectIterable": () => isObjectIterable,
        "isObjectInstanceIterable": () => isObjectInstanceIterable,
        "parseRoman": () => parseRoman,
        "toRoman": () => toRoman,
        "getValueFromCurve": () => getValueFromCurve,
        "nearestFraction": () => nearestFraction,
        "nearestFractions": () => nearestFractions,
        "nearestReciprocal": () => nearestReciprocal,
        "nearestReciprocals": () => nearestReciprocals,
        "permutations": () => permutations,
        "permute": () => permute,
        "combinations": () => combinations,
        "combinationsSized": () => combinationsSized,
        "randomCombination": () => randomCombination,
        "randomCombinationSized": () => randomCombinationSized,
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      var _Frequency__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__2("./src/Frequency.ts");
      const precisionFactor = (x, e = 1) => Math.round(x * e) !== x * e ? precisionFactor(x, e * 10) : e;
      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      const lcm = (a, b) => a * (b / gcd(a, b));
      const floorMod = (x, y) => (x % y + y) % y;
      const isStringArray = (x) => {
        return Array.isArray(x) && x.every((e) => typeof e === "string");
      };
      const isNumberArray = (x) => {
        return Array.isArray(x) && x.every((e) => typeof e === "number");
      };
      const isObjectArray = (x, typeGuard) => {
        return Array.isArray(x) && x.every(typeGuard);
      };
      const isObjectInstanceArray = (x, Type) => {
        return Array.isArray(x) && x.every((e) => e instanceof Type);
      };
      const isObjectArrayLike = (x, typeGuard) => {
        if (x === null || typeof x !== "object" || typeof x.length !== "number")
          return false;
        for (let i2 = 0; i2 < x.length; i2++) {
          if (typeGuard(x[i2]))
            continue;
          else
            return false;
        }
        return true;
      };
      const isObjectInstanceArrayLike = (x, Type) => {
        if (x === null || typeof x !== "object" || typeof x.length !== "number")
          return false;
        for (let i2 = 0; i2 < x.length; i2++) {
          if (x[i2] instanceof Type)
            continue;
          else
            return false;
        }
        return true;
      };
      const isObjectIterable = (x, typeGuard) => {
        if (typeof x !== "object" || x === null)
          return false;
        if (typeof x[Symbol.iterator] !== "function")
          return false;
        return Array.from(x).every(typeGuard);
      };
      const isObjectInstanceIterable = (x, Type) => {
        if (typeof x !== "object" || x === null)
          return false;
        if (typeof x[Symbol.iterator] !== "function")
          return false;
        return Array.from(x).every((e) => e instanceof Type);
      };
      const parseRoman = (stringIn) => {
        if (stringIn.length === 0)
          return 0;
        let c;
        if (stringIn.match(/[IVXLCDM]+/))
          c = 1;
        else if (stringIn.match(/[ivxlcdm]+/))
          c = -1;
        else
          throw new Error("Roman number error.");
        const string = stringIn.toUpperCase();
        if (!string.match(/(M{0,3})(C{1,3}|C?D|DC{1,3}|CM)?(X{1,3}|X?L|LX{1,3}|XC)?(I{1,3}|I?V|VI{1,3}|IX)?$/)) {
          throw new Error("Roman number error.");
        }
        const r = ["I", "V", "X", "L", "C", "D", "M"];
        const a = [1, 5, 10, 50, 100, 500, 1e3];
        const rIn = string.split("");
        const aOut = [];
        for (let i2 = 0; i2 < rIn.length; i2++) {
          for (let j = 0; j < r.length; j++) {
            if (rIn[i2] === r[j])
              aOut[i2] = a[j];
          }
        }
        let sum = aOut[0];
        for (let i2 = 0; i2 < rIn.length - 1; i2++) {
          if (aOut[i2] >= aOut[i2 + 1]) {
            sum += aOut[i2 + 1];
          } else {
            sum = sum + aOut[i2 + 1] - 2 * aOut[i2];
          }
        }
        return sum * c;
      };
      const toRoman = (nIn) => {
        let n = Math.round(Math.abs(nIn));
        if (n > 3999 || n === 0)
          throw new Error("Too large or Too small for Roman Number.");
        const a = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const r = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
        let rOut = "";
        for (let i2 = 0; i2 < a.length; i2++) {
          while (n >= a[i2]) {
            rOut += r[i2];
            n -= a[i2];
          }
        }
        return nIn > 0 ? rOut : rOut.toLowerCase();
      };
      const getValueFromCurve = (t0, t1, t, exp) => t0 + (t1 - t0) * t ** 2 ** exp;
      const nearestFraction = (v, approxIn = _Frequency__WEBPACK_IMPORTED_MODULE_0__["default"].THRES_AUDIT) => nearestFractions([1, v], approxIn);
      const nearestFractions = (ratio, approxIn = _Frequency__WEBPACK_IMPORTED_MODULE_0__["default"].THRES_AUDIT) => {
        if (ratio.length < 2)
          return ratio.map(() => 1);
        let approx = approxIn;
        let iApprox = 1 / approx;
        if (iApprox > approx)
          [iApprox, approx] = [approx, iApprox];
        let div = 0;
        let ref;
        const factor = [];
        const iFactor = [];
        const delta = [];
        do {
          ref = ratio[0] / ++div;
          factor[0] = div;
          iFactor[0] = div;
          delta[0] = 1;
          for (let i2 = 1; i2 < ratio.length; i2++) {
            factor[i2] = ratio[i2] / ref;
            iFactor[i2] = Math.round(factor[i2]);
            delta[i2] = iFactor[i2] / factor[i2];
          }
        } while (!delta.every((d) => iApprox < d && d < approx));
        return iFactor;
      };
      const nearestReciprocal = (ratio, approxIn = _Frequency__WEBPACK_IMPORTED_MODULE_0__["default"].THRES_AUDIT) => nearestReciprocals([ratio, 1], approxIn);
      const nearestReciprocals = (ratio, approxIn = _Frequency__WEBPACK_IMPORTED_MODULE_0__["default"].THRES_AUDIT) => {
        if (ratio.length < 2)
          return ratio.map(() => 1);
        let approx = approxIn;
        let iApprox = 1 / approx;
        if (iApprox > approx)
          [iApprox, approx] = [approx, iApprox];
        let mul = 0;
        let ref;
        const factor = [];
        const iFactor = [];
        const delta = [];
        do {
          ref = ratio[0] * ++mul;
          factor[0] = mul;
          iFactor[0] = mul;
          delta[0] = 1;
          for (let i2 = 1; i2 < ratio.length; i2++) {
            factor[i2] = ref / ratio[i2];
            iFactor[i2] = Math.round(factor[i2]);
            delta[i2] = iFactor[i2] / factor[i2];
          }
        } while (!delta.every((d) => iApprox < d && d < approx));
        return iFactor;
      };
      const permutations = (array) => {
        const { length } = array;
        const result = [array.slice()];
        const c = new Array(length).fill(0);
        let i2 = 1;
        let k;
        let p;
        while (i2 < length) {
          if (c[i2] < i2) {
            k = i2 % 2 && c[i2];
            const permutation = array.slice();
            p = permutation[i2];
            permutation[i2] = permutation[k];
            permutation[k] = p;
            c[i2]++;
            i2 = 1;
            result.push(permutation);
          } else {
            c[i2] = 0;
            i2++;
          }
        }
        return result;
      };
      const permute = (array, random) => {
        for (let i2 = array.length - 1; i2 > 0; i2--) {
          const j = random ? random.randint(0, i2 + 1) : ~~(Math.random() * (i2 + 1));
          [array[i2], array[j]] = [array[j], array[i2]];
        }
        return array;
      };
      const combinations = (array) => {
        const { length } = array;
        const helper = ($, current, result) => {
          for (let i2 = $; i2 < length; i2++) {
            const next = current.slice().concat(array[i2]);
            result.push(next);
            if ($ < length - 1)
              helper(i2 + 1, next, result);
          }
          return result;
        };
        return helper(0, [], []);
      };
      const combinationsSized = (array, size, allowDuplicate = false) => {
        const { length } = array;
        if (!size)
          throw new RangeError("Combination size must be > 0.");
        if (size > length)
          throw new RangeError("Combination size is larger than the array length.");
        const helper = ($, current, result) => {
          for (let i2 = $; i2 <= length - size; i2++) {
            const next = current.slice().concat(array[i2]);
            if (next.length === size)
              result.push(next);
            else
              helper(allowDuplicate ? i2 : i2 + 1, next, result);
          }
          return result;
        };
        return helper(0, [], []);
      };
      const randomCombination = (array, random) => {
        return array.filter(() => random ? !!random.randint(0, 1) : Math.random() < 0.5);
      };
      const randomCombinationSized = (array, size, allowDuplicate = false, random) => {
        const { length } = array;
        if (!size)
          throw new RangeError("Combination size must be > 0.");
        if (size > length)
          throw new RangeError("Combination size is larger than the array length.");
        let n = size;
        const taken = new Array(array.length).fill(0);
        while (n--) {
          const $ = random ? random.randint(0, length) : ~~(Math.random() * length);
          if (taken[$] && !allowDuplicate)
            n++;
          else
            taken[$]++;
        }
        const result = [];
        for (let i2 = 0; i2 < array.length; i2++) {
          while (taken[i2]--) {
            result.push(array[i2]);
          }
        }
        return result;
      };
      const Utils = {
        precisionFactor,
        gcd,
        lcm,
        floorMod,
        isStringArray,
        isNumberArray,
        isObjectArray,
        isObjectInstanceArray,
        isObjectArrayLike,
        isObjectInstanceArrayLike,
        isObjectIterable,
        isObjectInstanceIterable,
        parseRoman,
        toRoman,
        getValueFromCurve,
        nearestFraction,
        nearestFractions,
        nearestReciprocal,
        nearestReciprocals,
        permutations,
        permute,
        combinations,
        randomCombination
      };
      const __WEBPACK_DEFAULT_EXPORT__ = Utils;
    },
    "./node_modules/midi-file/index.js": (__unused_webpack_module, exports2, __webpack_require__2) => {
      exports2.parseMidi = __webpack_require__2("./node_modules/midi-file/lib/midi-parser.js");
      exports2.writeMidi = __webpack_require__2("./node_modules/midi-file/lib/midi-writer.js");
    },
    "./node_modules/midi-file/lib/midi-parser.js": (module) => {
      function parseMidi(data) {
        var p = new Parser(data);
        var headerChunk = p.readChunk();
        if (headerChunk.id != "MThd")
          throw "Bad MIDI file.  Expected 'MHdr', got: '" + headerChunk.id + "'";
        var header = parseHeader(headerChunk.data);
        var tracks = [];
        for (var i2 = 0; !p.eof() && i2 < header.numTracks; i2++) {
          var trackChunk = p.readChunk();
          if (trackChunk.id != "MTrk")
            throw "Bad MIDI file.  Expected 'MTrk', got: '" + trackChunk.id + "'";
          var track = parseTrack(trackChunk.data);
          tracks.push(track);
        }
        return {
          header,
          tracks
        };
      }
      function parseHeader(data) {
        var p = new Parser(data);
        var format = p.readUInt16();
        var numTracks = p.readUInt16();
        var result = {
          format,
          numTracks
        };
        var timeDivision = p.readUInt16();
        if (timeDivision & 32768) {
          result.framesPerSecond = 256 - (timeDivision >> 8);
          result.ticksPerFrame = timeDivision & 255;
        } else {
          result.ticksPerBeat = timeDivision;
        }
        return result;
      }
      function parseTrack(data) {
        var p = new Parser(data);
        var events = [];
        while (!p.eof()) {
          var event = readEvent();
          events.push(event);
        }
        return events;
        var lastEventTypeByte = null;
        function readEvent() {
          var event2 = {};
          event2.deltaTime = p.readVarInt();
          var eventTypeByte = p.readUInt8();
          if ((eventTypeByte & 240) === 240) {
            if (eventTypeByte === 255) {
              event2.meta = true;
              var metatypeByte = p.readUInt8();
              var length = p.readVarInt();
              switch (metatypeByte) {
                case 0:
                  event2.type = "sequenceNumber";
                  if (length !== 2)
                    throw "Expected length for sequenceNumber event is 2, got " + length;
                  event2.number = p.readUInt16();
                  return event2;
                case 1:
                  event2.type = "text";
                  event2.text = p.readString(length);
                  return event2;
                case 2:
                  event2.type = "copyrightNotice";
                  event2.text = p.readString(length);
                  return event2;
                case 3:
                  event2.type = "trackName";
                  event2.text = p.readString(length);
                  return event2;
                case 4:
                  event2.type = "instrumentName";
                  event2.text = p.readString(length);
                  return event2;
                case 5:
                  event2.type = "lyrics";
                  event2.text = p.readString(length);
                  return event2;
                case 6:
                  event2.type = "marker";
                  event2.text = p.readString(length);
                  return event2;
                case 7:
                  event2.type = "cuePoint";
                  event2.text = p.readString(length);
                  return event2;
                case 32:
                  event2.type = "channelPrefix";
                  if (length != 1)
                    throw "Expected length for channelPrefix event is 1, got " + length;
                  event2.channel = p.readUInt8();
                  return event2;
                case 33:
                  event2.type = "portPrefix";
                  if (length != 1)
                    throw "Expected length for portPrefix event is 1, got " + length;
                  event2.port = p.readUInt8();
                  return event2;
                case 47:
                  event2.type = "endOfTrack";
                  if (length != 0)
                    throw "Expected length for endOfTrack event is 0, got " + length;
                  return event2;
                case 81:
                  event2.type = "setTempo";
                  if (length != 3)
                    throw "Expected length for setTempo event is 3, got " + length;
                  event2.microsecondsPerBeat = p.readUInt24();
                  return event2;
                case 84:
                  event2.type = "smpteOffset";
                  if (length != 5)
                    throw "Expected length for smpteOffset event is 5, got " + length;
                  var hourByte = p.readUInt8();
                  var FRAME_RATES = { 0: 24, 32: 25, 64: 29, 96: 30 };
                  event2.frameRate = FRAME_RATES[hourByte & 96];
                  event2.hour = hourByte & 31;
                  event2.min = p.readUInt8();
                  event2.sec = p.readUInt8();
                  event2.frame = p.readUInt8();
                  event2.subFrame = p.readUInt8();
                  return event2;
                case 88:
                  event2.type = "timeSignature";
                  if (length != 4)
                    throw "Expected length for timeSignature event is 4, got " + length;
                  event2.numerator = p.readUInt8();
                  event2.denominator = 1 << p.readUInt8();
                  event2.metronome = p.readUInt8();
                  event2.thirtyseconds = p.readUInt8();
                  return event2;
                case 89:
                  event2.type = "keySignature";
                  if (length != 2)
                    throw "Expected length for keySignature event is 2, got " + length;
                  event2.key = p.readInt8();
                  event2.scale = p.readUInt8();
                  return event2;
                case 127:
                  event2.type = "sequencerSpecific";
                  event2.data = p.readBytes(length);
                  return event2;
                default:
                  event2.type = "unknownMeta";
                  event2.data = p.readBytes(length);
                  event2.metatypeByte = metatypeByte;
                  return event2;
              }
            } else if (eventTypeByte == 240) {
              event2.type = "sysEx";
              var length = p.readVarInt();
              event2.data = p.readBytes(length);
              return event2;
            } else if (eventTypeByte == 247) {
              event2.type = "endSysEx";
              var length = p.readVarInt();
              event2.data = p.readBytes(length);
              return event2;
            } else {
              throw "Unrecognised MIDI event type byte: " + eventTypeByte;
            }
          } else {
            var param1;
            if ((eventTypeByte & 128) === 0) {
              if (lastEventTypeByte === null)
                throw "Running status byte encountered before status byte";
              param1 = eventTypeByte;
              eventTypeByte = lastEventTypeByte;
              event2.running = true;
            } else {
              param1 = p.readUInt8();
              lastEventTypeByte = eventTypeByte;
            }
            var eventType = eventTypeByte >> 4;
            event2.channel = eventTypeByte & 15;
            switch (eventType) {
              case 8:
                event2.type = "noteOff";
                event2.noteNumber = param1;
                event2.velocity = p.readUInt8();
                return event2;
              case 9:
                var velocity = p.readUInt8();
                event2.type = velocity === 0 ? "noteOff" : "noteOn";
                event2.noteNumber = param1;
                event2.velocity = velocity;
                if (velocity === 0)
                  event2.byte9 = true;
                return event2;
              case 10:
                event2.type = "noteAftertouch";
                event2.noteNumber = param1;
                event2.amount = p.readUInt8();
                return event2;
              case 11:
                event2.type = "controller";
                event2.controllerType = param1;
                event2.value = p.readUInt8();
                return event2;
              case 12:
                event2.type = "programChange";
                event2.programNumber = param1;
                return event2;
              case 13:
                event2.type = "channelAftertouch";
                event2.amount = param1;
                return event2;
              case 14:
                event2.type = "pitchBend";
                event2.value = param1 + (p.readUInt8() << 7) - 8192;
                return event2;
              default:
                throw "Unrecognised MIDI event type: " + eventType;
            }
          }
        }
      }
      function Parser(data) {
        this.buffer = data;
        this.bufferLen = this.buffer.length;
        this.pos = 0;
      }
      Parser.prototype.eof = function() {
        return this.pos >= this.bufferLen;
      };
      Parser.prototype.readUInt8 = function() {
        var result = this.buffer[this.pos];
        this.pos += 1;
        return result;
      };
      Parser.prototype.readInt8 = function() {
        var u = this.readUInt8();
        if (u & 128)
          return u - 256;
        else
          return u;
      };
      Parser.prototype.readUInt16 = function() {
        var b0 = this.readUInt8(), b1 = this.readUInt8();
        return (b0 << 8) + b1;
      };
      Parser.prototype.readInt16 = function() {
        var u = this.readUInt16();
        if (u & 32768)
          return u - 65536;
        else
          return u;
      };
      Parser.prototype.readUInt24 = function() {
        var b0 = this.readUInt8(), b1 = this.readUInt8(), b2 = this.readUInt8();
        return (b0 << 16) + (b1 << 8) + b2;
      };
      Parser.prototype.readInt24 = function() {
        var u = this.readUInt24();
        if (u & 8388608)
          return u - 16777216;
        else
          return u;
      };
      Parser.prototype.readUInt32 = function() {
        var b0 = this.readUInt8(), b1 = this.readUInt8(), b2 = this.readUInt8(), b3 = this.readUInt8();
        return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
      };
      Parser.prototype.readBytes = function(len) {
        var bytes = this.buffer.slice(this.pos, this.pos + len);
        this.pos += len;
        return bytes;
      };
      Parser.prototype.readString = function(len) {
        var bytes = this.readBytes(len);
        return String.fromCharCode.apply(null, bytes);
      };
      Parser.prototype.readVarInt = function() {
        var result = 0;
        while (!this.eof()) {
          var b = this.readUInt8();
          if (b & 128) {
            result += b & 127;
            result <<= 7;
          } else {
            return result + b;
          }
        }
        return result;
      };
      Parser.prototype.readChunk = function() {
        var id = this.readString(4);
        var length = this.readUInt32();
        var data = this.readBytes(length);
        return {
          id,
          length,
          data
        };
      };
      module.exports = parseMidi;
    },
    "./node_modules/midi-file/lib/midi-writer.js": (module) => {
      function writeMidi(data, opts) {
        if (typeof data !== "object")
          throw "Invalid MIDI data";
        opts = opts || {};
        var header = data.header || {};
        var tracks = data.tracks || [];
        var i2, len = tracks.length;
        var w = new Writer();
        writeHeader(w, header, len);
        for (i2 = 0; i2 < len; i2++) {
          writeTrack(w, tracks[i2], opts);
        }
        return w.buffer;
      }
      function writeHeader(w, header, numTracks) {
        var format = header.format == null ? 1 : header.format;
        var timeDivision = 128;
        if (header.timeDivision) {
          timeDivision = header.timeDivision;
        } else if (header.ticksPerFrame && header.framesPerSecond) {
          timeDivision = -(header.framesPerSecond & 255) << 8 | header.ticksPerFrame & 255;
        } else if (header.ticksPerBeat) {
          timeDivision = header.ticksPerBeat & 32767;
        }
        var h = new Writer();
        h.writeUInt16(format);
        h.writeUInt16(numTracks);
        h.writeUInt16(timeDivision);
        w.writeChunk("MThd", h.buffer);
      }
      function writeTrack(w, track, opts) {
        var t = new Writer();
        var i2, len = track.length;
        var eventTypeByte = null;
        for (i2 = 0; i2 < len; i2++) {
          if (opts.running === false || !opts.running && !track[i2].running)
            eventTypeByte = null;
          eventTypeByte = writeEvent(t, track[i2], eventTypeByte, opts.useByte9ForNoteOff);
        }
        w.writeChunk("MTrk", t.buffer);
      }
      function writeEvent(w, event, lastEventTypeByte, useByte9ForNoteOff) {
        var type = event.type;
        var deltaTime = event.deltaTime;
        var text = event.text || "";
        var data = event.data || [];
        var eventTypeByte = null;
        w.writeVarInt(deltaTime);
        switch (type) {
          case "sequenceNumber":
            w.writeUInt8(255);
            w.writeUInt8(0);
            w.writeVarInt(2);
            w.writeUInt16(event.number);
            break;
          case "text":
            w.writeUInt8(255);
            w.writeUInt8(1);
            w.writeVarInt(text.length);
            w.writeString(text);
            break;
          case "copyrightNotice":
            w.writeUInt8(255);
            w.writeUInt8(2);
            w.writeVarInt(text.length);
            w.writeString(text);
            break;
          case "trackName":
            w.writeUInt8(255);
            w.writeUInt8(3);
            w.writeVarInt(text.length);
            w.writeString(text);
            break;
          case "instrumentName":
            w.writeUInt8(255);
            w.writeUInt8(4);
            w.writeVarInt(text.length);
            w.writeString(text);
            break;
          case "lyrics":
            w.writeUInt8(255);
            w.writeUInt8(5);
            w.writeVarInt(text.length);
            w.writeString(text);
            break;
          case "marker":
            w.writeUInt8(255);
            w.writeUInt8(6);
            w.writeVarInt(text.length);
            w.writeString(text);
            break;
          case "cuePoint":
            w.writeUInt8(255);
            w.writeUInt8(7);
            w.writeVarInt(text.length);
            w.writeString(text);
            break;
          case "channelPrefix":
            w.writeUInt8(255);
            w.writeUInt8(32);
            w.writeVarInt(1);
            w.writeUInt8(event.channel);
            break;
          case "portPrefix":
            w.writeUInt8(255);
            w.writeUInt8(33);
            w.writeVarInt(1);
            w.writeUInt8(event.port);
            break;
          case "endOfTrack":
            w.writeUInt8(255);
            w.writeUInt8(47);
            w.writeVarInt(0);
            break;
          case "setTempo":
            w.writeUInt8(255);
            w.writeUInt8(81);
            w.writeVarInt(3);
            w.writeUInt24(event.microsecondsPerBeat);
            break;
          case "smpteOffset":
            w.writeUInt8(255);
            w.writeUInt8(84);
            w.writeVarInt(5);
            var FRAME_RATES = { 24: 0, 25: 32, 29: 64, 30: 96 };
            var hourByte = event.hour & 31 | FRAME_RATES[event.frameRate];
            w.writeUInt8(hourByte);
            w.writeUInt8(event.min);
            w.writeUInt8(event.sec);
            w.writeUInt8(event.frame);
            w.writeUInt8(event.subFrame);
            break;
          case "timeSignature":
            w.writeUInt8(255);
            w.writeUInt8(88);
            w.writeVarInt(4);
            w.writeUInt8(event.numerator);
            var denominator = Math.floor(Math.log(event.denominator) / Math.LN2) & 255;
            w.writeUInt8(denominator);
            w.writeUInt8(event.metronome);
            w.writeUInt8(event.thirtyseconds || 8);
            break;
          case "keySignature":
            w.writeUInt8(255);
            w.writeUInt8(89);
            w.writeVarInt(2);
            w.writeInt8(event.key);
            w.writeUInt8(event.scale);
            break;
          case "sequencerSpecific":
            w.writeUInt8(255);
            w.writeUInt8(127);
            w.writeVarInt(data.length);
            w.writeBytes(data);
            break;
          case "unknownMeta":
            if (event.metatypeByte != null) {
              w.writeUInt8(255);
              w.writeUInt8(event.metatypeByte);
              w.writeVarInt(data.length);
              w.writeBytes(data);
            }
            break;
          case "sysEx":
            w.writeUInt8(240);
            w.writeVarInt(data.length);
            w.writeBytes(data);
            break;
          case "endSysEx":
            w.writeUInt8(247);
            w.writeVarInt(data.length);
            w.writeBytes(data);
            break;
          case "noteOff":
            var noteByte = useByte9ForNoteOff !== false && event.byte9 || useByte9ForNoteOff && event.velocity == 0 ? 144 : 128;
            eventTypeByte = noteByte | event.channel;
            if (eventTypeByte !== lastEventTypeByte)
              w.writeUInt8(eventTypeByte);
            w.writeUInt8(event.noteNumber);
            w.writeUInt8(event.velocity);
            break;
          case "noteOn":
            eventTypeByte = 144 | event.channel;
            if (eventTypeByte !== lastEventTypeByte)
              w.writeUInt8(eventTypeByte);
            w.writeUInt8(event.noteNumber);
            w.writeUInt8(event.velocity);
            break;
          case "noteAftertouch":
            eventTypeByte = 160 | event.channel;
            if (eventTypeByte !== lastEventTypeByte)
              w.writeUInt8(eventTypeByte);
            w.writeUInt8(event.noteNumber);
            w.writeUInt8(event.amount);
            break;
          case "controller":
            eventTypeByte = 176 | event.channel;
            if (eventTypeByte !== lastEventTypeByte)
              w.writeUInt8(eventTypeByte);
            w.writeUInt8(event.controllerType);
            w.writeUInt8(event.value);
            break;
          case "programChange":
            eventTypeByte = 192 | event.channel;
            if (eventTypeByte !== lastEventTypeByte)
              w.writeUInt8(eventTypeByte);
            w.writeUInt8(event.programNumber);
            break;
          case "channelAftertouch":
            eventTypeByte = 208 | event.channel;
            if (eventTypeByte !== lastEventTypeByte)
              w.writeUInt8(eventTypeByte);
            w.writeUInt8(event.amount);
            break;
          case "pitchBend":
            eventTypeByte = 224 | event.channel;
            if (eventTypeByte !== lastEventTypeByte)
              w.writeUInt8(eventTypeByte);
            var value14 = 8192 + event.value;
            var lsb14 = value14 & 127;
            var msb14 = value14 >> 7 & 127;
            w.writeUInt8(lsb14);
            w.writeUInt8(msb14);
            break;
          default:
            throw "Unrecognized event type: " + type;
        }
        return eventTypeByte;
      }
      function Writer() {
        this.buffer = [];
      }
      Writer.prototype.writeUInt8 = function(v) {
        this.buffer.push(v & 255);
      };
      Writer.prototype.writeInt8 = Writer.prototype.writeUInt8;
      Writer.prototype.writeUInt16 = function(v) {
        var b0 = v >> 8 & 255, b1 = v & 255;
        this.writeUInt8(b0);
        this.writeUInt8(b1);
      };
      Writer.prototype.writeInt16 = Writer.prototype.writeUInt16;
      Writer.prototype.writeUInt24 = function(v) {
        var b0 = v >> 16 & 255, b1 = v >> 8 & 255, b2 = v & 255;
        this.writeUInt8(b0);
        this.writeUInt8(b1);
        this.writeUInt8(b2);
      };
      Writer.prototype.writeInt24 = Writer.prototype.writeUInt24;
      Writer.prototype.writeUInt32 = function(v) {
        var b0 = v >> 24 & 255, b1 = v >> 16 & 255, b2 = v >> 8 & 255, b3 = v & 255;
        this.writeUInt8(b0);
        this.writeUInt8(b1);
        this.writeUInt8(b2);
        this.writeUInt8(b3);
      };
      Writer.prototype.writeInt32 = Writer.prototype.writeUInt32;
      Writer.prototype.writeBytes = function(arr) {
        this.buffer = this.buffer.concat(Array.prototype.slice.call(arr, 0));
      };
      Writer.prototype.writeString = function(str) {
        var i2, len = str.length, arr = [];
        for (i2 = 0; i2 < len; i2++) {
          arr.push(str.codePointAt(i2));
        }
        this.writeBytes(arr);
      };
      Writer.prototype.writeVarInt = function(v) {
        if (v < 0)
          throw "Cannot write negative variable-length integer";
        if (v <= 127) {
          this.writeUInt8(v);
        } else {
          var i2 = v;
          var bytes = [];
          bytes.push(i2 & 127);
          i2 >>= 7;
          while (i2) {
            var b = i2 & 127 | 128;
            bytes.push(b);
            i2 >>= 7;
          }
          this.writeBytes(bytes.reverse());
        }
      };
      Writer.prototype.writeChunk = function(id, data) {
        this.writeString(id);
        this.writeUInt32(data.length);
        this.writeBytes(data);
      };
      module.exports = writeMidi;
    },
    "./node_modules/seedrandom/index.js": (module, __unused_webpack_exports, __webpack_require__2) => {
      var alea = __webpack_require__2("./node_modules/seedrandom/lib/alea.js");
      var xor128 = __webpack_require__2("./node_modules/seedrandom/lib/xor128.js");
      var xorwow = __webpack_require__2("./node_modules/seedrandom/lib/xorwow.js");
      var xorshift7 = __webpack_require__2("./node_modules/seedrandom/lib/xorshift7.js");
      var xor4096 = __webpack_require__2("./node_modules/seedrandom/lib/xor4096.js");
      var tychei = __webpack_require__2("./node_modules/seedrandom/lib/tychei.js");
      var sr = __webpack_require__2("./node_modules/seedrandom/seedrandom.js");
      sr.alea = alea;
      sr.xor128 = xor128;
      sr.xorwow = xorwow;
      sr.xorshift7 = xorshift7;
      sr.xor4096 = xor4096;
      sr.tychei = tychei;
      module.exports = sr;
    },
    "./node_modules/seedrandom/lib/alea.js": function(module, exports2, __webpack_require__2) {
      module = __webpack_require__2.nmd(module);
      var __WEBPACK_AMD_DEFINE_RESULT__;
      (function(global, module2, define) {
        function Alea(seed) {
          var me = this, mash = Mash();
          me.next = function() {
            var t = 2091639 * me.s0 + me.c * 23283064365386963e-26;
            me.s0 = me.s1;
            me.s1 = me.s2;
            return me.s2 = t - (me.c = t | 0);
          };
          me.c = 1;
          me.s0 = mash(" ");
          me.s1 = mash(" ");
          me.s2 = mash(" ");
          me.s0 -= mash(seed);
          if (me.s0 < 0) {
            me.s0 += 1;
          }
          me.s1 -= mash(seed);
          if (me.s1 < 0) {
            me.s1 += 1;
          }
          me.s2 -= mash(seed);
          if (me.s2 < 0) {
            me.s2 += 1;
          }
          mash = null;
        }
        function copy(f, t) {
          t.c = f.c;
          t.s0 = f.s0;
          t.s1 = f.s1;
          t.s2 = f.s2;
          return t;
        }
        function impl(seed, opts) {
          var xg = new Alea(seed), state = opts && opts.state, prng = xg.next;
          prng.int32 = function() {
            return xg.next() * 4294967296 | 0;
          };
          prng.double = function() {
            return prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
          };
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        function Mash() {
          var n = 4022871197;
          var mash = function(data) {
            data = String(data);
            for (var i2 = 0; i2 < data.length; i2++) {
              n += data.charCodeAt(i2);
              var h = 0.02519603282416938 * n;
              n = h >>> 0;
              h -= n;
              h *= n;
              n = h >>> 0;
              h -= n;
              n += h * 4294967296;
            }
            return (n >>> 0) * 23283064365386963e-26;
          };
          return mash;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (__webpack_require__2.amdD && __webpack_require__2.amdO) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return impl;
          }.call(exports2, __webpack_require__2, exports2, module2), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {
          this.alea = impl;
        }
      })(this, module, __webpack_require__2.amdD);
    },
    "./node_modules/seedrandom/lib/tychei.js": function(module, exports2, __webpack_require__2) {
      module = __webpack_require__2.nmd(module);
      var __WEBPACK_AMD_DEFINE_RESULT__;
      (function(global, module2, define) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.next = function() {
            var b = me.b, c = me.c, d = me.d, a = me.a;
            b = b << 25 ^ b >>> 7 ^ c;
            c = c - d | 0;
            d = d << 24 ^ d >>> 8 ^ a;
            a = a - b | 0;
            me.b = b = b << 20 ^ b >>> 12 ^ c;
            me.c = c = c - d | 0;
            me.d = d << 16 ^ c >>> 16 ^ a;
            return me.a = a - b | 0;
          };
          me.a = 0;
          me.b = 0;
          me.c = 2654435769 | 0;
          me.d = 1367130551;
          if (seed === Math.floor(seed)) {
            me.a = seed / 4294967296 | 0;
            me.b = seed | 0;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 20; k++) {
            me.b ^= strseed.charCodeAt(k) | 0;
            me.next();
          }
        }
        function copy(f, t) {
          t.a = f.a;
          t.b = f.b;
          t.c = f.c;
          t.d = f.d;
          return t;
        }
        ;
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (__webpack_require__2.amdD && __webpack_require__2.amdO) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return impl;
          }.call(exports2, __webpack_require__2, exports2, module2), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {
          this.tychei = impl;
        }
      })(this, module, __webpack_require__2.amdD);
    },
    "./node_modules/seedrandom/lib/xor128.js": function(module, exports2, __webpack_require__2) {
      module = __webpack_require__2.nmd(module);
      var __WEBPACK_AMD_DEFINE_RESULT__;
      (function(global, module2, define) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.x = 0;
          me.y = 0;
          me.z = 0;
          me.w = 0;
          me.next = function() {
            var t = me.x ^ me.x << 11;
            me.x = me.y;
            me.y = me.z;
            me.z = me.w;
            return me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
          };
          if (seed === (seed | 0)) {
            me.x = seed;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 64; k++) {
            me.x ^= strseed.charCodeAt(k) | 0;
            me.next();
          }
        }
        function copy(f, t) {
          t.x = f.x;
          t.y = f.y;
          t.z = f.z;
          t.w = f.w;
          return t;
        }
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (__webpack_require__2.amdD && __webpack_require__2.amdO) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return impl;
          }.call(exports2, __webpack_require__2, exports2, module2), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {
          this.xor128 = impl;
        }
      })(this, module, __webpack_require__2.amdD);
    },
    "./node_modules/seedrandom/lib/xor4096.js": function(module, exports2, __webpack_require__2) {
      module = __webpack_require__2.nmd(module);
      var __WEBPACK_AMD_DEFINE_RESULT__;
      (function(global, module2, define) {
        function XorGen(seed) {
          var me = this;
          me.next = function() {
            var w = me.w, X = me.X, i2 = me.i, t, v;
            me.w = w = w + 1640531527 | 0;
            v = X[i2 + 34 & 127];
            t = X[i2 = i2 + 1 & 127];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            v = X[i2] = v ^ t;
            me.i = i2;
            return v + (w ^ w >>> 16) | 0;
          };
          function init(me2, seed2) {
            var t, v, i2, j, w, X = [], limit = 128;
            if (seed2 === (seed2 | 0)) {
              v = seed2;
              seed2 = null;
            } else {
              seed2 = seed2 + "\0";
              v = 0;
              limit = Math.max(limit, seed2.length);
            }
            for (i2 = 0, j = -32; j < limit; ++j) {
              if (seed2)
                v ^= seed2.charCodeAt((j + 32) % seed2.length);
              if (j === 0)
                w = v;
              v ^= v << 10;
              v ^= v >>> 15;
              v ^= v << 4;
              v ^= v >>> 13;
              if (j >= 0) {
                w = w + 1640531527 | 0;
                t = X[j & 127] ^= v + w;
                i2 = t == 0 ? i2 + 1 : 0;
              }
            }
            if (i2 >= 128) {
              X[(seed2 && seed2.length || 0) & 127] = -1;
            }
            i2 = 127;
            for (j = 4 * 128; j > 0; --j) {
              v = X[i2 + 34 & 127];
              t = X[i2 = i2 + 1 & 127];
              v ^= v << 13;
              t ^= t << 17;
              v ^= v >>> 15;
              t ^= t >>> 12;
              X[i2] = v ^ t;
            }
            me2.w = w;
            me2.X = X;
            me2.i = i2;
          }
          init(me, seed);
        }
        function copy(f, t) {
          t.i = f.i;
          t.w = f.w;
          t.X = f.X.slice();
          return t;
        }
        ;
        function impl(seed, opts) {
          if (seed == null)
            seed = +new Date();
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (state.X)
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (__webpack_require__2.amdD && __webpack_require__2.amdO) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return impl;
          }.call(exports2, __webpack_require__2, exports2, module2), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {
          this.xor4096 = impl;
        }
      })(this, module, __webpack_require__2.amdD);
    },
    "./node_modules/seedrandom/lib/xorshift7.js": function(module, exports2, __webpack_require__2) {
      module = __webpack_require__2.nmd(module);
      var __WEBPACK_AMD_DEFINE_RESULT__;
      (function(global, module2, define) {
        function XorGen(seed) {
          var me = this;
          me.next = function() {
            var X = me.x, i2 = me.i, t, v, w;
            t = X[i2];
            t ^= t >>> 7;
            v = t ^ t << 24;
            t = X[i2 + 1 & 7];
            v ^= t ^ t >>> 10;
            t = X[i2 + 3 & 7];
            v ^= t ^ t >>> 3;
            t = X[i2 + 4 & 7];
            v ^= t ^ t << 7;
            t = X[i2 + 7 & 7];
            t = t ^ t << 13;
            v ^= t ^ t << 9;
            X[i2] = v;
            me.i = i2 + 1 & 7;
            return v;
          };
          function init(me2, seed2) {
            var j, w, X = [];
            if (seed2 === (seed2 | 0)) {
              w = X[0] = seed2;
            } else {
              seed2 = "" + seed2;
              for (j = 0; j < seed2.length; ++j) {
                X[j & 7] = X[j & 7] << 15 ^ seed2.charCodeAt(j) + X[j + 1 & 7] << 13;
              }
            }
            while (X.length < 8)
              X.push(0);
            for (j = 0; j < 8 && X[j] === 0; ++j)
              ;
            if (j == 8)
              w = X[7] = -1;
            else
              w = X[j];
            me2.x = X;
            me2.i = 0;
            for (j = 256; j > 0; --j) {
              me2.next();
            }
          }
          init(me, seed);
        }
        function copy(f, t) {
          t.x = f.x.slice();
          t.i = f.i;
          return t;
        }
        function impl(seed, opts) {
          if (seed == null)
            seed = +new Date();
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (state.x)
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (__webpack_require__2.amdD && __webpack_require__2.amdO) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return impl;
          }.call(exports2, __webpack_require__2, exports2, module2), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {
          this.xorshift7 = impl;
        }
      })(this, module, __webpack_require__2.amdD);
    },
    "./node_modules/seedrandom/lib/xorwow.js": function(module, exports2, __webpack_require__2) {
      module = __webpack_require__2.nmd(module);
      var __WEBPACK_AMD_DEFINE_RESULT__;
      (function(global, module2, define) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.next = function() {
            var t = me.x ^ me.x >>> 2;
            me.x = me.y;
            me.y = me.z;
            me.z = me.w;
            me.w = me.v;
            return (me.d = me.d + 362437 | 0) + (me.v = me.v ^ me.v << 4 ^ (t ^ t << 1)) | 0;
          };
          me.x = 0;
          me.y = 0;
          me.z = 0;
          me.w = 0;
          me.v = 0;
          if (seed === (seed | 0)) {
            me.x = seed;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 64; k++) {
            me.x ^= strseed.charCodeAt(k) | 0;
            if (k == strseed.length) {
              me.d = me.x << 10 ^ me.x >>> 4;
            }
            me.next();
          }
        }
        function copy(f, t) {
          t.x = f.x;
          t.y = f.y;
          t.z = f.z;
          t.w = f.w;
          t.v = f.v;
          t.d = f.d;
          return t;
        }
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object")
              copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (__webpack_require__2.amdD && __webpack_require__2.amdO) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return impl;
          }.call(exports2, __webpack_require__2, exports2, module2), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {
          this.xorwow = impl;
        }
      })(this, module, __webpack_require__2.amdD);
    },
    "./node_modules/seedrandom/seedrandom.js": function(module, exports2, __webpack_require__2) {
      var __WEBPACK_AMD_DEFINE_RESULT__;
      (function(global, pool, math) {
        var width = 256, chunks = 6, digits = 52, rngname = "random", startdenom = math.pow(width, chunks), significance = math.pow(2, digits), overflow = significance * 2, mask = width - 1, nodecrypto;
        function seedrandom(seed, options, callback) {
          var key = [];
          options = options == true ? { entropy: true } : options || {};
          var shortseed = mixkey(flatten(options.entropy ? [seed, tostring(pool)] : seed == null ? autoseed() : seed, 3), key);
          var arc4 = new ARC4(key);
          var prng = function() {
            var n = arc4.g(chunks), d = startdenom, x = 0;
            while (n < significance) {
              n = (n + x) * width;
              d *= width;
              x = arc4.g(1);
            }
            while (n >= overflow) {
              n /= 2;
              d /= 2;
              x >>>= 1;
            }
            return (n + x) / d;
          };
          prng.int32 = function() {
            return arc4.g(4) | 0;
          };
          prng.quick = function() {
            return arc4.g(4) / 4294967296;
          };
          prng.double = prng;
          mixkey(tostring(arc4.S), pool);
          return (options.pass || callback || function(prng2, seed2, is_math_call, state) {
            if (state) {
              if (state.S) {
                copy(state, arc4);
              }
              prng2.state = function() {
                return copy(arc4, {});
              };
            }
            if (is_math_call) {
              math[rngname] = prng2;
              return seed2;
            } else
              return prng2;
          })(prng, shortseed, "global" in options ? options.global : this == math, options.state);
        }
        function ARC4(key) {
          var t, keylen = key.length, me = this, i2 = 0, j = me.i = me.j = 0, s = me.S = [];
          if (!keylen) {
            key = [keylen++];
          }
          while (i2 < width) {
            s[i2] = i2++;
          }
          for (i2 = 0; i2 < width; i2++) {
            s[i2] = s[j = mask & j + key[i2 % keylen] + (t = s[i2])];
            s[j] = t;
          }
          (me.g = function(count) {
            var t2, r = 0, i3 = me.i, j2 = me.j, s2 = me.S;
            while (count--) {
              t2 = s2[i3 = mask & i3 + 1];
              r = r * width + s2[mask & (s2[i3] = s2[j2 = mask & j2 + t2]) + (s2[j2] = t2)];
            }
            me.i = i3;
            me.j = j2;
            return r;
          })(width);
        }
        function copy(f, t) {
          t.i = f.i;
          t.j = f.j;
          t.S = f.S.slice();
          return t;
        }
        ;
        function flatten(obj, depth) {
          var result = [], typ = typeof obj, prop;
          if (depth && typ == "object") {
            for (prop in obj) {
              try {
                result.push(flatten(obj[prop], depth - 1));
              } catch (e) {
              }
            }
          }
          return result.length ? result : typ == "string" ? obj : obj + "\0";
        }
        function mixkey(seed, key) {
          var stringseed = seed + "", smear, j = 0;
          while (j < stringseed.length) {
            key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
          }
          return tostring(key);
        }
        function autoseed() {
          try {
            var out;
            if (nodecrypto && (out = nodecrypto.randomBytes)) {
              out = out(width);
            } else {
              out = new Uint8Array(width);
              (global.crypto || global.msCrypto).getRandomValues(out);
            }
            return tostring(out);
          } catch (e) {
            var browser = global.navigator, plugins = browser && browser.plugins;
            return [+new Date(), global, plugins, global.screen, tostring(pool)];
          }
        }
        function tostring(a) {
          return String.fromCharCode.apply(0, a);
        }
        mixkey(math.random(), pool);
        if (module.exports) {
          module.exports = seedrandom;
          try {
            nodecrypto = __webpack_require__2("?d4c0");
          } catch (ex) {
          }
        } else if (true) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return seedrandom;
          }.call(exports2, __webpack_require__2, exports2, module), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {}
      })(typeof self !== "undefined" ? self : this, [], Math);
    },
    "?d4c0": () => {
    }
  };
  var __webpack_module_cache__ = {};
  function __nested_webpack_require_233960__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== void 0) {
      return cachedModule.exports;
    }
    var module = __webpack_module_cache__[moduleId] = {
      id: moduleId,
      loaded: false,
      exports: {}
    };
    __webpack_modules__[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_233960__);
    module.loaded = true;
    return module.exports;
  }
  (() => {
    __nested_webpack_require_233960__.amdD = function() {
      throw new Error("define cannot be used indirect");
    };
  })();
  (() => {
    __nested_webpack_require_233960__.amdO = {};
  })();
  (() => {
    __nested_webpack_require_233960__.n = (module) => {
      var getter = module && module.__esModule ? () => module["default"] : () => module;
      __nested_webpack_require_233960__.d(getter, { a: getter });
      return getter;
    };
  })();
  (() => {
    __nested_webpack_require_233960__.d = (exports2, definition) => {
      for (var key in definition) {
        if (__nested_webpack_require_233960__.o(definition, key) && !__nested_webpack_require_233960__.o(exports2, key)) {
          Object.defineProperty(exports2, key, { enumerable: true, get: definition[key] });
        }
      }
    };
  })();
  (() => {
    __nested_webpack_require_233960__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    __nested_webpack_require_233960__.r = (exports2) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports2, "__esModule", { value: true });
    };
  })();
  (() => {
    __nested_webpack_require_233960__.nmd = (module) => {
      module.paths = [];
      if (!module.children)
        module.children = [];
      return module;
    };
  })();
  var __webpack_exports__ = {};
  (() => {
    "use strict";
    /*!**********************!*\
      !*** ./src/index.ts ***!
      \**********************/
    __nested_webpack_require_233960__.r(__webpack_exports__);
    __nested_webpack_require_233960__.d(__webpack_exports__, {
      "Articulation": () => _Articulation__WEBPACK_IMPORTED_MODULE_0__["default"],
      "Chord": () => _Chord__WEBPACK_IMPORTED_MODULE_1__["default"],
      "Color": () => _Color__WEBPACK_IMPORTED_MODULE_2__["default"],
      "Duration": () => _Duration__WEBPACK_IMPORTED_MODULE_3__["default"],
      "Frequency": () => _Frequency__WEBPACK_IMPORTED_MODULE_4__["default"],
      "Interval": () => _Interval__WEBPACK_IMPORTED_MODULE_5__["default"],
      "Note": () => _Note__WEBPACK_IMPORTED_MODULE_6__["default"],
      "Param": () => _Param__WEBPACK_IMPORTED_MODULE_7__["default"],
      "Pitch": () => _Pitch__WEBPACK_IMPORTED_MODULE_8__["default"],
      "Scale": () => _Scale__WEBPACK_IMPORTED_MODULE_9__["default"],
      "TimeCode": () => _TimeCode__WEBPACK_IMPORTED_MODULE_10__["default"],
      "TonalChord": () => _TonalChord__WEBPACK_IMPORTED_MODULE_11__["default"],
      "Tonality": () => _Tonality__WEBPACK_IMPORTED_MODULE_12__["default"],
      "Velocity": () => _Velocity__WEBPACK_IMPORTED_MODULE_13__["default"],
      "Random": () => _genre_Random__WEBPACK_IMPORTED_MODULE_14__["default"],
      "TrackNote": () => _track_TrackNote__WEBPACK_IMPORTED_MODULE_22__["default"],
      "TrackChord": () => _track_TrackChord__WEBPACK_IMPORTED_MODULE_21__["default"],
      "Sequence": () => _track_Sequence__WEBPACK_IMPORTED_MODULE_18__["default"],
      "Sequences": () => _track_Sequences__WEBPACK_IMPORTED_MODULE_19__["default"],
      "Segment": () => _track_Segment__WEBPACK_IMPORTED_MODULE_17__["default"],
      "Roll": () => _track_Roll__WEBPACK_IMPORTED_MODULE_20__["default"],
      "Utils": () => _utils__WEBPACK_IMPORTED_MODULE_15__["default"],
      "Series": () => _series__WEBPACK_IMPORTED_MODULE_16__["default"]
    });
    var _Articulation__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_233960__("./src/Articulation.ts");
    var _Chord__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_233960__("./src/Chord.ts");
    var _Color__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_233960__("./src/Color.ts");
    var _Duration__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_233960__("./src/Duration.ts");
    var _Frequency__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_233960__("./src/Frequency.ts");
    var _Interval__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_233960__("./src/Interval.ts");
    var _Note__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_233960__("./src/Note.ts");
    var _Param__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_233960__("./src/Param.ts");
    var _Pitch__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_233960__("./src/Pitch.ts");
    var _Scale__WEBPACK_IMPORTED_MODULE_9__ = __nested_webpack_require_233960__("./src/Scale.ts");
    var _TimeCode__WEBPACK_IMPORTED_MODULE_10__ = __nested_webpack_require_233960__("./src/TimeCode.ts");
    var _TonalChord__WEBPACK_IMPORTED_MODULE_11__ = __nested_webpack_require_233960__("./src/TonalChord.ts");
    var _Tonality__WEBPACK_IMPORTED_MODULE_12__ = __nested_webpack_require_233960__("./src/Tonality.ts");
    var _Velocity__WEBPACK_IMPORTED_MODULE_13__ = __nested_webpack_require_233960__("./src/Velocity.ts");
    var _genre_Random__WEBPACK_IMPORTED_MODULE_14__ = __nested_webpack_require_233960__("./src/genre/Random.ts");
    var _utils__WEBPACK_IMPORTED_MODULE_15__ = __nested_webpack_require_233960__("./src/utils.ts");
    var _series__WEBPACK_IMPORTED_MODULE_16__ = __nested_webpack_require_233960__("./src/series.ts");
    var _track_Segment__WEBPACK_IMPORTED_MODULE_17__ = __nested_webpack_require_233960__("./src/track/Segment.ts");
    var _track_Sequence__WEBPACK_IMPORTED_MODULE_18__ = __nested_webpack_require_233960__("./src/track/Sequence.ts");
    var _track_Sequences__WEBPACK_IMPORTED_MODULE_19__ = __nested_webpack_require_233960__("./src/track/Sequences.ts");
    var _track_Roll__WEBPACK_IMPORTED_MODULE_20__ = __nested_webpack_require_233960__("./src/track/Roll.ts");
    var _track_TrackChord__WEBPACK_IMPORTED_MODULE_21__ = __nested_webpack_require_233960__("./src/track/TrackChord.ts");
    var _track_TrackNote__WEBPACK_IMPORTED_MODULE_22__ = __nested_webpack_require_233960__("./src/track/TrackNote.ts");
  })();
  var __webpack_export_target__ = exports;
  for (var i in __webpack_exports__)
    __webpack_export_target__[i] = __webpack_exports__[i];
  if (__webpack_exports__.__esModule)
    Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
})();


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@jspatcher/package-cac","version":"1.0.0","description":"The Computer-Aided Coposition package for JSPatcher","main":"dist/index.js","scripts":{"build":"webpack --mode development","build-watch":"webpack --mode development --watch --stats-children"},"keywords":["jspatcher"],"jspatcher":{"isJSPatcherPackage":true,"thumbnail":"","jspatpkg":"index.jspatpkg.js"},"author":"Fr0stbyteR","license":"GPL-3.0-or-later","repository":"https://github.com/jspatcher/package-cac","devDependencies":{"@jspatcher/jspatcher":"^0.0.9","@shren/guidolib":"^1.7.3","@shren/sol":"file:../../sol","@types/react":"^17.0.32","@types/react-dom":"^17.0.10","clean-webpack-plugin":"^4.0.0","copy-webpack-plugin":"^9.0.1","esbuild":"^0.14.1","esbuild-loader":"^2.16.0","react":"^17.0.2","react-dom":"^17.0.2","typescript":"^4.4.4","webpack":"^5.59.1","webpack-cli":"^4.9.1"}}');

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************!*\
  !*** ./src/index.jspatpkg.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sdk */ "./src/sdk.ts");
/* harmony import */ var _shren_sol__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shren/sol */ "../../sol/dist/index.js");
/* harmony import */ var _shren_sol__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_shren_sol__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _objects_to_guido__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/to-guido */ "./src/objects/to-guido.ts");
/* harmony import */ var _objects_guido_view__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/guido-view */ "./src/objects/guido-view.ts");
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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => __spreadValues({
  cac2guido: _objects_to_guido__WEBPACK_IMPORTED_MODULE_2__["default"],
  "guido-view": _objects_guido_view__WEBPACK_IMPORTED_MODULE_3__["default"]
}, _sdk__WEBPACK_IMPORTED_MODULE_0__.DefaultImporter["import"]("cac", _shren_sol__WEBPACK_IMPORTED_MODULE_1__)));

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.jspatpkg.js.map