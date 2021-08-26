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

/***/ "./src/objects/Base.ts":
/*!*****************************!*\
  !*** ./src/objects/Base.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MidiObject)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class MidiObject extends _sdk__WEBPACK_IMPORTED_MODULE_1__.DefaultObject {}

_defineProperty(MidiObject, "package", _index__WEBPACK_IMPORTED_MODULE_0__.name);

_defineProperty(MidiObject, "author", _index__WEBPACK_IMPORTED_MODULE_0__.author);

_defineProperty(MidiObject, "version", _index__WEBPACK_IMPORTED_MODULE_0__.version);

_defineProperty(MidiObject, "description", _index__WEBPACK_IMPORTED_MODULE_0__.description);

/***/ }),

/***/ "./src/objects/devices.ts":
/*!********************************!*\
  !*** ./src/objects/devices.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiDevices)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class midiDevices extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      midiAccess: undefined
    });

    _defineProperty(this, "handleDeviceChange", async () => {
      if (!this.getProp("autoUpdate")) return;
      const filters = this.args.slice();
      if (!filters.length) filters.push("input", "output");
      const {
        midiAccess
      } = this._;

      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }

      const devices = [];
      if (filters.indexOf("input") !== -1) midiAccess.inputs.forEach(v => devices.push(v));
      if (filters.indexOf("output") !== -1) midiAccess.outputs.forEach(v => devices.push(v));
      const options = devices.map((d, key) => {
        const {
          type,
          name,
          id
        } = d;
        return {
          key,
          icon: {
            input: "sign-in",
            output: "sign-out"
          }[type],
          text: name || id,
          value: id
        };
      });
      this.outletAll([devices, options]);
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("postInit", async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess({
          sysex: true
        });
        this._.midiAccess = midiAccess;
        midiAccess.addEventListener("statechange", this.handleDeviceChange);
        if (this.getProp("autoUpdate")) this.handleDeviceChange();
      } catch (e) {
        this.error(e);
      }
    });
    this.on("inlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        let filters;

        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          filters = this.args.slice();
          if (!filters.length) filters.push("input", "output");
        } else {
          filters = data.slice();
        }

        const {
          midiAccess
        } = this._;

        if (!midiAccess) {
          this.error("MIDIAccess not available.");
          return;
        }

        const devices = [];
        if (filters.indexOf("input") !== -1) midiAccess.inputs.forEach(v => devices.push(v));
        if (filters.indexOf("output") !== -1) midiAccess.outputs.forEach(v => devices.push(v));
        const options = devices.map((d, key) => {
          const {
            type,
            name,
            id
          } = d;
          return {
            key,
            icon: {
              input: "sign-in",
              output: "sign-out"
            }[type],
            text: name || id,
            value: id
          };
        });
        this.outletAll([devices, options]);
      }
    });
    this.on("destroy", () => {
      if (this._.midiAccess) this._.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
    });
  }

}

_defineProperty(midiDevices, "description", "Enumerate MIDI devices");

_defineProperty(midiDevices, "inlets", [{
  isHot: true,
  type: "object",
  description: "Bang to enumerate, MIDIPortType[] to use a filter"
}]);

_defineProperty(midiDevices, "outlets", [{
  type: "object",
  description: "Array of MIDIPort"
}, {
  type: "object",
  description: "Array of DropdownItemProps"
}]);

_defineProperty(midiDevices, "args", [{
  type: "enum",
  varLength: true,
  optional: true,
  enums: ["input", "output"],
  default: ["input", "output"],
  description: "Output only kinds of devices"
}]);

_defineProperty(midiDevices, "props", {
  autoUpdate: {
    type: "boolean",
    default: true,
    description: "Auto output devices when devices change"
  }
});

/***/ }),

/***/ "./src/objects/midiFormat.ts":
/*!***********************************!*\
  !*** ./src/objects/midiFormat.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiFormat)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class midiFormat extends _Base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      channel: 0
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 7;
      this.outlets = 1;
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet < 3) {
        try {
          let [data1, data2] = data;

          if (typeof data1 !== "number" || typeof data2 !== "number") {
            throw new Error("Input MIDI data is not numbers");
          }

          data1 = Math.round(Math.max(0, Math.min(127, data1)));
          data2 = Math.round(Math.max(0, Math.min(127, data2)));

          if (inlet === 0) {
            this.outlet(0, new Uint8Array([0x90 + this._.channel, data1, data2]));
          } else if (inlet === 1) {
            this.outlet(0, new Uint8Array([0xa0 + this._.channel, data1, data2]));
          } else if (inlet === 2) {
            this.outlet(0, new Uint8Array([0xb0 + this._.channel, data1, data2]));
          }
        } catch (e) {
          this.error(e);
        }
      } else if (inlet >= 3) {
        if (typeof data !== "number") {
          this.error("Input MIDI data is not number");
          return;
        }

        const data1 = Math.round(Math.max(0, Math.min(127, data)));

        if (inlet === 3) {
          this.outlet(0, new Uint8Array([0xc0 + this._.channel, data1]));
        } else if (inlet === 4) {
          this.outlet(0, new Uint8Array([0xd0 + this._.channel, data1]));
        } else if (inlet === 5) {
          const hires = this.getProp("hires");

          if (hires === "off") {
            this.outlet(0, new Uint8Array([0xe0 + this._.channel, 0, data1]));
          } else if (hires === "float") {
            const data = ~~((Math.max(-1, Math.min(1, data1)) + 1) * 0.5 * 16383);
            this.outlet(0, new Uint8Array([0xe0 + this._.channel, data & 0x7f, data >> 7]));
          } else {
            const data = ~~Math.max(-8192, Math.min(8191, data1)) + 8192;
            this.outlet(0, new Uint8Array([0xe0 + this._.channel, data & 0x7f, data >> 7]));
          }
        } else if (inlet === 6) {
          this._.channel = Math.min(15, data1 - 1);
        }
      }
    });
  }

}

_defineProperty(midiFormat, "description", "Prepare data in the form of a MIDI message");

_defineProperty(midiFormat, "outlets", [{
  type: "object",
  description: "Raw MIDI message: Uint8Array"
}]);

_defineProperty(midiFormat, "inlets", [{
  isHot: true,
  type: "object",
  description: "Note-on and Note-off [pitch, velocity]: Iterable<number>"
}, {
  isHot: true,
  type: "object",
  description: "Poly Key Pressure [key, value]: Iterable<number>"
}, {
  isHot: true,
  type: "object",
  description: "Control Change [controller, value]: Iterable<number>"
}, {
  isHot: true,
  type: "number",
  description: "Program Change"
}, {
  isHot: true,
  type: "number",
  description: "Aftertouch"
}, {
  isHot: true,
  type: "number",
  description: "Pitch Bend"
}, {
  isHot: false,
  type: "number",
  description: "MIDI Channel"
}]);

_defineProperty(midiFormat, "props", {
  hires: {
    type: "enum",
    enums: ["off", "float", "14bit"],
    default: "off",
    description: "High-resolution Pitch Bend (Off (0-127), Float (-1 to 1), 14-bit Fixed (-8192 to 8191))"
  }
});

/***/ }),

/***/ "./src/objects/midiIn.ts":
/*!*******************************!*\
  !*** ./src/objects/midiIn.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiIn)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class midiIn extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      midiAccess: undefined,
      search: undefined,
      port: undefined
    });

    _defineProperty(this, "handleDeviceChange", async () => {
      const {
        midiAccess
      } = this._;

      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }

      const devices = [];
      midiAccess.inputs.forEach(v => devices.push(v));
      const enums = devices.map(d => d.name || d.id);
      const {
        meta
      } = this;
      meta.args[0] = _objectSpread(_objectSpread({}, midiIn.args[0]), {}, {
        type: "enum",
        enums
      });
      this.setMeta(meta);
    });

    _defineProperty(this, "handleMIDIMessage", e => this.outlet(0, e.data));

    _defineProperty(this, "newSearch", async search => {
      this._.search = search;
      const {
        midiAccess
      } = this._;

      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }

      const devices = [];
      midiAccess.inputs.forEach(v => devices.push(v));

      for (let i = 0; i < devices.length; i++) {
        const port = devices[i];

        if (!search || port.id === search || port.name === search) {
          if (port !== this._.port) {
            if (this._.port) this._.port.removeEventListener("midimessage", this.handleMIDIMessage);
            this._.port = port;
            port.addEventListener("midimessage", this.handleMIDIMessage);
            break;
          }
        }
      }
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("postInit", async () => {
      const search = this.args[0];

      try {
        const midiAccess = await navigator.requestMIDIAccess({
          sysex: true
        });
        this._.midiAccess = midiAccess;
        midiAccess.addEventListener("statechange", this.handleDeviceChange);
        this.handleDeviceChange();
        this.newSearch(search);
      } catch (e) {
        this.error(e);
      }
    });
    this.on("updateArgs", args => {
      this.newSearch(args[0]);
    });
    this.on("updateProps", () => {
      this.newSearch(this._.search);
    });
    this.on("inlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          await this.newSearch(data);
        }

        if (this._.port) this.outlet(1, this._.port);
      }
    });
    this.on("destroy", () => {
      if (this._.midiAccess) this._.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
      if (this._.port) this._.port.removeEventListener("midimessage", this.handleMIDIMessage);
    });
  }

}

_defineProperty(midiIn, "description", "Get MIDI input from device name or ID");

_defineProperty(midiIn, "inlets", [{
  isHot: true,
  type: "anything",
  description: "string to fetch device name or ID, bang to output MIDI port instance"
}]);

_defineProperty(midiIn, "outlets", [{
  type: "object",
  description: "MIDI message: Uint8Array"
}, {
  type: "object",
  description: "Instance: MIDIPort"
}]);

_defineProperty(midiIn, "args", [{
  type: "string",
  optional: false,
  description: "Device name or ID"
}]);

/***/ }),

/***/ "./src/objects/midiOut.ts":
/*!********************************!*\
  !*** ./src/objects/midiOut.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiOut)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class midiOut extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      midiAccess: undefined,
      search: undefined,
      port: undefined,
      timestamp: 0
    });

    _defineProperty(this, "handleDeviceChange", async () => {
      const {
        midiAccess
      } = this._;

      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }

      const devices = [];
      midiAccess.outputs.forEach(v => devices.push(v));
      const enums = devices.map(d => d.name || d.id);
      const {
        meta
      } = this;
      meta.args[0] = _objectSpread(_objectSpread({}, midiOut.args[0]), {}, {
        type: "enum",
        enums
      });
      this.setMeta(meta);
    });

    _defineProperty(this, "newSearch", async search => {
      this._.search = search;
      const {
        midiAccess
      } = this._;

      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }

      const devices = [];
      midiAccess.outputs.forEach(v => devices.push(v));

      for (let i = 0; i < devices.length; i++) {
        const port = devices[i];

        if (!search || port.id === search || port.name === search) {
          this._.port = port;
          break;
        }
      }
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("postInit", async () => {
      const search = this.box.args[0];

      try {
        const midiAccess = await navigator.requestMIDIAccess({
          sysex: true
        });
        this._.midiAccess = midiAccess;
        midiAccess.addEventListener("statechange", this.handleDeviceChange);
        this.handleDeviceChange();
        this.newSearch(search);
      } catch (e) {
        this.error(e);
      }
    });
    this.on("updateArgs", args => {
      this.newSearch(args[0]);
    });
    this.on("updateProps", () => {
      this.newSearch(this._.search);
    });
    this.on("inlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          if (typeof data === "string") {
            await this.newSearch(data);
          } else {
            if (this._.port) this._.port.send(data);
            return;
          }
        }

        if (this._.port) this.outlet(0, this._.port);
      } else if (inlet === 1) {
        this._.timestamp = +data || 0;
      }
    });
    this.on("destroy", () => {
      if (this._.midiAccess) this._.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
    });
  }

}

_defineProperty(midiOut, "description", "Get MIDI output from device name or ID");

_defineProperty(midiOut, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Uint8Array or number[] to output MIDI message, string to fetch device name or ID, bang to output MIDI port instance"
}, {
  isHot: false,
  type: "number",
  description: "The time at which to begin sending the data to the port. 0 or past means immediate send."
}]);

_defineProperty(midiOut, "outlets", [{
  type: "object",
  description: "Instance: MIDIPort"
}]);

_defineProperty(midiOut, "args", [{
  type: "string",
  optional: false,
  description: "Device name or ID"
}]);

/***/ }),

/***/ "./src/objects/midiparse.ts":
/*!**********************************!*\
  !*** ./src/objects/midiparse.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiParse)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class midiParse extends _Base__WEBPACK_IMPORTED_MODULE_0__.default {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 7;
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        try {
          const [data0, data1, data2] = data;
          const eventType = data0 >> 4;
          const channel = data0 & 0x0f + 1;

          if (eventType === 0x08) {
            this.outlet(0, [data1, 0]);
          } else if (eventType === 0x09) {
            this.outlet(6, channel);
            this.outlet(0, [data1, data2]);
          } else if (eventType === 0x0a) {
            this.outlet(6, channel);
            this.outlet(1, [data1, data2]);
          } else if (eventType === 0x0b) {
            this.outlet(6, channel);
            this.outlet(2, [data1, data2]);
          } else if (eventType === 0x0c) {
            this.outlet(6, channel);
            this.outlet(3, data1);
          } else if (eventType === 0x0d) {
            this.outlet(6, channel);
            this.outlet(4, data1);
          } else if (eventType === 0x0e) {
            this.outlet(6, channel);
            const hires = this.getProp("hires");
            if (hires === "off") this.outlet(5, data2);else if (hires === "float") this.outlet(5, (data1 + (data2 << 7)) / 16383 * 2 - 1);else this.outlet(5, -8192 + data1 + (data2 << 7));
          } else {
            this.error("Unrecognised MIDI event type: ".concat(eventType));
          }
        } catch (e) {
          this.error(e);
        }
      }
    });
  }

}

_defineProperty(midiParse, "description", "Interpret raw MIDI data");

_defineProperty(midiParse, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Raw MIDI message: Iterable<number>"
}]);

_defineProperty(midiParse, "outlets", [{
  type: "object",
  description: "Note-on and Note-off [pitch, velocity]: Uint8Array"
}, {
  type: "object",
  description: "Poly Key Pressure [key, value]: Uint8Array"
}, {
  type: "object",
  description: "Control Change [controller, value]: Uint8Array"
}, {
  type: "number",
  description: "Program Change"
}, {
  type: "number",
  description: "Aftertouch"
}, {
  type: "number",
  description: "Pitch Bend"
}, {
  type: "number",
  description: "MIDI Channel"
}]);

_defineProperty(midiParse, "props", {
  hires: {
    type: "enum",
    enums: ["off", "float", "14bit"],
    default: "off",
    description: "High-resolution Pitch Bend (Off (0-127), Float (-1 to 1), 14-bit Fixed (-8192 to 8191))"
  }
});

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
  getReactMonacoEditor
} = sdk;

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = JSON.parse('{"name":"@jspatcher/package-midi","version":"1.0.0","description":"The MIDI package for JSPatcher","main":"dist/index.js","scripts":{"build":"webpack --mode development","build-watch":"webpack --mode development --watch --stats-children"},"keywords":["jspatcher"],"jspatcher":{"isJSPatcherPackage":true,"thumbnail":"","jspatpkg":"index.jspatpkg.js"},"author":"Fr0stbyteR","license":"GPL-3.0-or-later","repository":"https://github.com/jspatcher/package-midi","devDependencies":{"@babel/core":"^7.15.0","@babel/plugin-proposal-class-properties":"^7.14.5","@babel/preset-env":"^7.15.0","@babel/preset-typescript":"^7.15.0","@jspatcher/jspatcher":"^0.0.8","@types/webmidi":"^2.0.6","babel-loader":"^8.2.2","clean-webpack-plugin":"^4.0.0-alpha.0","semantic-ui-react":"^2.0.3","typescript":"^4.3.5","webpack":"^5.50.0","webpack-cli":"^4.7.2"}}');

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
/* harmony import */ var _objects_devices__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/devices */ "./src/objects/devices.ts");
/* harmony import */ var _objects_midiFormat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/midiFormat */ "./src/objects/midiFormat.ts");
/* harmony import */ var _objects_midiIn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/midiIn */ "./src/objects/midiIn.ts");
/* harmony import */ var _objects_midiOut__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/midiOut */ "./src/objects/midiOut.ts");
/* harmony import */ var _objects_midiparse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/midiparse */ "./src/objects/midiparse.ts");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  return {
    midiDevices: _objects_devices__WEBPACK_IMPORTED_MODULE_0__.default,
    midiIn: _objects_midiIn__WEBPACK_IMPORTED_MODULE_2__.default,
    midiin: _objects_midiIn__WEBPACK_IMPORTED_MODULE_2__.default,
    midiOut: _objects_midiOut__WEBPACK_IMPORTED_MODULE_3__.default,
    midiout: _objects_midiOut__WEBPACK_IMPORTED_MODULE_3__.default,
    midiFormat: _objects_midiFormat__WEBPACK_IMPORTED_MODULE_1__.default,
    midiformat: _objects_midiFormat__WEBPACK_IMPORTED_MODULE_1__.default,
    midiParse: _objects_midiparse__WEBPACK_IMPORTED_MODULE_4__.default,
    midiparse: _objects_midiparse__WEBPACK_IMPORTED_MODULE_4__.default
  };
});
})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.jspatpkg.js.map