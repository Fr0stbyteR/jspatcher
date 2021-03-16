/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/babel-loader/lib/index.js!./src/core/workers/Guido.worker.ts":
/*!***********************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./src/core/workers/Guido.worker.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ProxyWorker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProxyWorker */ "./src/core/workers/ProxyWorker.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Guido extends _ProxyWorker__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "module", void 0);

    _defineProperty(this, "fEngine", void 0);

    _defineProperty(this, "fPianoRoll", void 0);

    _defineProperty(this, "fScoreMap", void 0);

    _defineProperty(this, "fFactory", void 0);

    _defineProperty(this, "fSPR", void 0);

    _defineProperty(this, "$oMap", []);
  }

  $2o($) {
    return this.$oMap[$];
  }

  o2$(o) {
    const i = this.$oMap.indexOf(o);
    if (i !== -1) return i;
    return this.$oMap.push(o) - 1;
  }

  async init() {
    const locateFile = (url, dir) => "../deps/" + url;

    const Module = (await __webpack_require__.e(/*! import() */ "node_modules_grame_guidolib_libGUIDOEngine_js").then(__webpack_require__.t.bind(__webpack_require__, /*! @grame/guidolib */ "./node_modules/@grame/guidolib/libGUIDOEngine.js", 23))).default;
    return new Promise((resolve, reject) => {
      const module = new Module({
        locateFile
      });

      module.onRuntimeInitialized = () => {
        this.module = module;
        this.fEngine = new this.module.GuidoEngineAdapter();
        this.fScoreMap = new this.module.GUIDOScoreMap();
        this.fPianoRoll = new this.module.GUIDOPianoRollAdapter();
        this.fFactory = new this.module.GUIDOFactoryAdapter();
        this.fSPR = new this.module.GUIDOReducedProportionalAdapter();
        this.fEngine.init();
        resolve();
      };
    });
  } // ------------------------------------------------------------------------
  // Guido Engine interface


  start() {
    this.fEngine.init();
  }

  shutdown() {
    this.fEngine.shutdown();
  }

  ar2gr(ar) {
    return this.o2$(this.fEngine.ar2gr(this.$2o(ar)));
  }

  ar2grSettings(ar, settings) {
    return this.o2$(this.fEngine.ar2grSettings(this.$2o(ar), settings));
  }

  updateGR(gr) {
    return this.fEngine.updateGR(this.$2o(gr));
  }

  updateGRSettings(gr, settings) {
    return this.fEngine.updateGRSettings(this.$2o(gr), settings);
  }

  freeAR(ar) {
    this.fEngine.freeAR(this.$2o(ar));
  }

  freeGR(gr) {
    this.fEngine.freeGR(this.$2o(gr));
  }

  getDefaultLayoutSettings() {
    return this.fEngine.getDefaultLayoutSettings();
  }

  resizePageToMusic(gr) {
    return this.fEngine.resizePageToMusic(this.$2o(gr));
  }

  getErrorString(errCode) {
    return this.fEngine.getErrorString(errCode);
  }

  showElement(gr, elt, status) {
    return this.fEngine.showElement(this.$2o(gr), elt, status);
  }

  countVoices(ar) {
    return this.fEngine.countVoices(this.$2o(ar));
  }

  getPageCount(gr) {
    return this.fEngine.getPageCount(this.$2o(gr));
  }

  getSystemCount(gr, page) {
    return this.fEngine.getSystemCount(this.$2o(gr), page);
  }

  duration(gr) {
    return this.fEngine.duration(this.$2o(gr));
  }

  findEventPage(gr, date) {
    return this.fEngine.findEventPage(this.$2o(gr), date);
  }

  findPageAt(gr, date) {
    return this.fEngine.findPageAt(this.$2o(gr), date);
  }

  getPageDate(gr, pageNum) {
    return this.fEngine.getPageDate(this.$2o(gr), pageNum);
  }

  gr2SVG(gr, page, embedFont, mappingMode) {
    return this.fEngine.gr2SVG(this.$2o(gr), page, embedFont, mappingMode);
  }

  gr2SVGColored(gr, page, r, g, b, embedFont) {
    return this.fEngine.gr2SVGColored(this.$2o(gr), page, r, g, b, embedFont);
  }

  abstractExport(gr, page) {
    return this.fEngine.abstractExport(this.$2o(gr), page);
  }

  binaryExport(gr, page) {
    return this.fEngine.binaryExport(this.$2o(gr), page);
  }

  jsExport(gr, page) {
    return this.fEngine.javascriptExport(this.$2o(gr), page);
  }

  setDefaultPageFormat(format) {
    this.fEngine.setDefaultPageFormat(format);
  }

  getDefaultPageFormat() {
    return this.fEngine.getDefaultPageFormat();
  }

  setDrawBoundingBoxes(bmap) {
    this.fEngine.setDrawBoundingBoxes(bmap);
  }

  getDrawBoundingBoxes() {
    return this.fEngine.getDrawBoundingBoxes();
  }

  getPageFormat(gr, page) {
    return this.fEngine.getPageFormat(this.$2o(gr), page);
  }

  unit2CM(val) {
    return this.fEngine.unit2CM(val);
  }

  cm2Unit(val) {
    return this.fEngine.cm2Unit(val);
  }

  unit2Inches(val) {
    return this.fEngine.unit2Inches(val);
  }

  inches2Unit(val) {
    return this.fEngine.inches2Unit(val);
  }

  getLineSpace() {
    return this.fEngine.getLineSpace();
  }

  getVersion() {
    return this.fEngine.getVersion();
  }

  getFloatVersion() {
    const v = this.fEngine.getVersion();
    return parseFloat(v.major + "." + v.minor + v.sub);
  }

  getVersionStr() {
    return this.fEngine.getVersionStr();
  }

  checkVersionNums(major, minor, sub) {
    return this.fEngine.checkVersionNums(major, minor, sub);
  }

  markVoice(ar, voicenum, date, duration, r, g, b) {
    return this.fEngine.markVoice(this.$2o(ar), voicenum, date, duration, r, g, b);
  }

  openParser() {
    return this.o2$(this.fEngine.openParser());
  }

  closeParser(p) {
    return this.fEngine.closeParser(this.$2o(p));
  }

  file2AR(p, file) {
    return this.o2$(this.fEngine.file2AR(this.$2o(p), file));
  }

  string2AR(p, gmn) {
    return this.o2$(this.fEngine.string2AR(this.$2o(p), gmn));
  }

  parserGetErrorCode(p) {
    return this.fEngine.parserGetErrorCode(this.$2o(p));
  }

  openStream() {
    return this.o2$(this.fEngine.openStream());
  }

  closeStream(s) {
    return this.fEngine.closeStream(this.$2o(s));
  }

  getStream(s) {
    return this.fEngine.getStream(this.$2o(s));
  }

  stream2AR(p, stream) {
    return this.o2$(this.fEngine.stream2AR(this.$2o(p), this.$2o(stream)));
  }

  writeStream(s, str) {
    return this.fEngine.writeStream(this.$2o(s), str);
  }

  resetStream(s) {
    return this.fEngine.resetStream(this.$2o(s));
  }

  getParsingTime(ar) {
    return this.fEngine.getParsingTime(this.$2o(ar));
  }

  getAR2GRTime(gr) {
    return this.fEngine.getAR2GRTime(this.$2o(gr));
  }

  getOnDrawTime(gr) {
    return this.fEngine.getOnDrawTime(this.$2o(gr));
  } // ------------------------------------------------------------------------
  // Guido mappings interface


  getPageMap(gr, page, w, h) {
    return this.fScoreMap.getPageMap(this.$2o(gr), page, w, h);
  }

  getStaffMap(gr, page, w, h, staff) {
    return this.fScoreMap.getStaffMap(this.$2o(gr), page, w, h, staff);
  }

  getVoiceMap(gr, page, w, h, voice) {
    return this.fScoreMap.getVoiceMap(this.$2o(gr), page, w, h, voice);
  }

  getSystemMap(gr, page, w, h) {
    return this.fScoreMap.getSystemMap(this.$2o(gr), page, w, h);
  }

  getTime(date, map) {
    return this.fScoreMap.getTime(date, map);
  }

  getPoint(x, y, map) {
    return this.fScoreMap.getPoint(x, y, map);
  }

  getTimeMap(ar) {
    return this.fScoreMap.getTimeMap(this.$2o(ar));
  }

  getPianoRollMap(pr, width, height) {
    return this.fScoreMap.getPianoRollMap(this.$2o(pr), width, height);
  } // ------------------------------------------------------------------------
  // Guido piano roll interface


  pianoRoll() {
    return this.fPianoRoll;
  }

  ar2PianoRoll(type, ar) {
    return this.o2$(this.fPianoRoll.ar2PianoRoll(type, this.$2o(ar)));
  }

  destroyPianoRoll(pr) {
    return this.fPianoRoll.destroyPianoRoll(this.$2o(pr));
  }

  prSetLimits(pr, limits) {
    return this.fPianoRoll.setLimits(this.$2o(pr), limits);
  }

  prEnableKeyboard(pr, status) {
    return this.fPianoRoll.enableKeyboard(this.$2o(pr), status);
  }

  prGetKeyboardWidth(pr, height) {
    return this.fPianoRoll.getKeyboardWidth(this.$2o(pr), height);
  }

  prEnableAutoVoicesColoration(pr, status) {
    return this.fPianoRoll.enableAutoVoicesColoration(this.$2o(pr), status);
  }

  prSetVoiceColor(pr, voice, r, g, b, a) {
    return this.fPianoRoll.setRGBColorToVoice(this.$2o(pr), voice, r, g, b, a);
  }

  prSetVoiceNamedColor(pr, voice, c) {
    return this.fPianoRoll.setColorToVoice(this.$2o(pr), voice, c);
  }

  prRemoveVoiceColor(pr, voice) {
    return this.fPianoRoll.removeColorToVoice(this.$2o(pr), voice);
  }

  prEnableMeasureBars(pr, status) {
    return this.fPianoRoll.enableMeasureBars(this.$2o(pr), status);
  }

  prSetPitchLinesDisplayMode(pr, mode) {
    return this.fPianoRoll.setPitchLinesDisplayMode(this.$2o(pr), mode);
  }

  proll2svg(pr, w, h) {
    return this.fPianoRoll.svgExport(this.$2o(pr), w, h);
  }

  prGetMap(pr, width, height) {
    return this.fPianoRoll.getMap(this.$2o(pr), width, height);
  }

  prSvgExport(pr, width, height) {
    return this.fPianoRoll.svgExport(this.$2o(pr), width, height);
  }

  prJsExport(pr, width, height) {
    return this.fPianoRoll.javascriptExport(this.$2o(pr), width, height);
  } // ------------------------------------------------------------------------
  // Reduced Proportional representation
  // no relay for the interface


  reducedProp() {
    return this.fSPR;
  } // ------------------------------------------------------------------------
  // Guido factory interface


  openMusic() {
    return this.fFactory.openMusic();
  }

  closeMusic() {
    return this.o2$(this.fFactory.closeMusic());
  }

  openVoice() {
    return this.fFactory.openVoice();
  }

  closeVoice() {
    return this.fFactory.closeVoice();
  }

  openChord() {
    return this.fFactory.openChord();
  }

  closeChord() {
    return this.fFactory.closeChord();
  }

  insertCommata() {
    return this.fFactory.insertCommata();
  }

  openEvent(name) {
    return this.fFactory.openEvent(name);
  }

  closeEvent() {
    return this.fFactory.closeEvent();
  }

  addSharp() {
    return this.fFactory.addSharp();
  }

  addFlat() {
    return this.fFactory.addFlat();
  }

  setEventDots(dots) {
    return this.fFactory.setEventDots(dots);
  }

  setEventAccidentals(acc) {
    return this.fFactory.setEventAccidentals(acc);
  }

  setOctave(oct) {
    return this.fFactory.setOctave(oct);
  }

  setDuration(numerator, denominator) {
    return this.fFactory.setDuration(numerator, denominator);
  }

  openTag(name, tagID) {
    return this.fFactory.openTag(name, tagID);
  }

  openRangeTag(name, tagID) {
    return this.fFactory.openRangeTag(name, tagID);
  }

  endTag() {
    return this.fFactory.endTag();
  }

  closeTag() {
    return this.fFactory.closeTag();
  }

  addTagParameterString(val) {
    return this.fFactory.addTagParameterString(val);
  }

  addTagParameterInt(val) {
    return this.fFactory.addTagParameterInt(val);
  }

  addTagParameterFloat(val) {
    return this.fFactory.addTagParameterFloat(val);
  }

  setParameterName(name) {
    return this.fFactory.setParameterName(name);
  }

  setParameterUnit(unit) {
    return this.fFactory.setParameterUnit(unit);
  }

} // eslint-disable-next-line no-new


new Guido();

/***/ }),

/***/ "./src/core/workers/ProxyWorker.ts":
/*!*****************************************!*\
  !*** ./src/core/workers/ProxyWorker.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
const Worker = class {
  static get fnNames() {
    return [];
  }

  constructor() {
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;

    const handleMessage = async e => {
      const {
        id,
        call,
        args,
        value,
        error
      } = e.data;

      if (call) {
        const r = {
          id
        };

        try {
          r.value = await this[call](...args);
        } catch (e) {
          r.error = e;
        }

        postMessage(r);
      } else {
        if (error) {
          if (rejects[id]) rejects[id](error);
          delete rejects[id];
          return;
        }

        if (resolves[id]) {
          resolves[id](value);
          delete resolves[id];
        }
      }
    };

    const call = function call(_call) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return new Promise((resolve, reject) => {
        const id = messagePortRequestId--;
        resolves[id] = resolve;
        rejects[id] = reject;
        postMessage({
          id,
          call: _call,
          args
        });
      });
    };

    const Ctor = this.constructor;
    Ctor.fnNames.forEach(name => this[name] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return call(name, ...args);
    });
    addEventListener("message", handleMessage);
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Worker);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => Object.getPrototypeOf(obj) : (obj) => obj.__proto__;
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
/******/ 				Object.getOwnPropertyNames(current).forEach(key => def[key] = () => value[key]);
/******/ 			}
/******/ 			def['default'] = () => value;
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "js/" + "fa55fc5f0b8dc70725d2" + ".worker.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"Guido.worker": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var chunkLoadingCallback = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				importScripts("../" + __webpack_require__.u(chunkId));
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = chunkLoadingCallback;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./node_modules/babel-loader/lib/index.js!./src/core/workers/Guido.worker.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=32314d427fdcf75df646.worker.js.map