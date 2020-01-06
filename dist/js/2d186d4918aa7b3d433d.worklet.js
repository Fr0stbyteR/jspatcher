/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/babel-loader/lib/index.js!./src/core/objects/dsp/AudioWorklet/Analyser.worklet.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js!./src/core/objects/dsp/AudioWorklet/Analyser.worklet.ts":
/*!***********************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./src/core/objects/dsp/AudioWorklet/Analyser.worklet.ts ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class RMSProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      defaultValue: 1024,
      maxValue: sampleRate * 16,
      minValue: 128,
      name: "windowSize"
    }];
  }

  constructor(options) {
    super(options);
    this.destroyed = void 0;
    this.window = void 0;
    this.$ = void 0;
    this.destroyed = false;
    this.window = [];
    this.$ = 0;

    this.port.onmessage = e => {
      if (e.data.destroy) this.destroy();else if (e.data.get === "rms") this.port.postMessage({
        rms: this.rms
      });else if (e.data.get === "buffer") this.port.postMessage({
        buffer: this.buffer
      });
    };
  }

  get rms() {
    var rms = [];

    for (var i = 0; i < this.window.length; i++) {
      var channel = this.window[i];
      var sum = 0;
      var sample = 0;
      var length = channel.length;

      for (var j = 0; j < length; j++) {
        sample = channel[j];
        sum += sample * sample;
      }

      rms[i] = Math.sqrt(sum / length);
    }

    return rms;
  }

  get buffer() {
    return {
      startPointer: this.$,
      data: this.window
    };
  }

  process(inputs, outputs, parameters) {
    if (this.destroyed) return false;
    var input = inputs[0];
    var windowSize = ~~parameters.windowSize[0] || 1024;
    this.$ %= windowSize;
    if (this.window.length > input.length) this.window.splice(input.length);

    for (var i = 0; i < input.length; i++) {
      var channel = input[i];
      var bufferSize = channel.length || 128;
      if (!channel.length) channel = new Float32Array(bufferSize);
      if (!this.window[i]) this.window[i] = new Float32Array(windowSize);else if (this.window[i].length !== windowSize) {
        var oldWindow = this.window[i];
        var oldWindowSize = oldWindow.length;
        this.window[i] = new Float32Array(windowSize);
        this.window[i].set(oldWindowSize > windowSize ? oldWindow.subarray(0, windowSize) : oldWindow);
      }
      var window = this.window[i];
      var $ = this.$;

      if (bufferSize > windowSize) {
        window.set(channel.subarray(bufferSize - windowSize));
        $ = 0;
      } else if (this.$ + bufferSize > windowSize) {
        var split = windowSize - $;
        window.set(channel.subarray(0, split), this.$);
        $ = bufferSize - split;
        window.set(channel.subarray(0, this.$));
      } else {
        window.set(channel, $);
        $ += bufferSize;
      }

      if (i === input.length - 1) this.$ = $;
    }

    return true;
  }

  destroy() {
    this.destroyed = true;
    this.port.close();
    this.window = [];
  }

}

registerProcessor("__JSPatcher_RMS", RMSProcessor);

/***/ })

/******/ });
//# sourceMappingURL=2d186d4918aa7b3d433d.worklet.js.map