(window["webpackJsonpJSPatcher"] = window["webpackJsonpJSPatcher"] || []).push([[9],{

/***/ "./src/core/objects/WebMIDI/Base.ts":
/*!******************************************!*\
  !*** ./src/core/objects/WebMIDI/Base.ts ***!
  \******************************************/
/*! exports provided: DefaultWebMIDIObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultWebMIDIObject", function() { return DefaultWebMIDIObject; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class DefaultWebMIDIObject extends _Base__WEBPACK_IMPORTED_MODULE_0__["DefaultObject"] {}

_defineProperty(DefaultWebMIDIObject, "package", "WebMIDI");

_defineProperty(DefaultWebMIDIObject, "author", "Fr0stbyteR");

_defineProperty(DefaultWebMIDIObject, "version", "1.0.0");

_defineProperty(DefaultWebMIDIObject, "description", "WebMIDI Object");

/***/ }),

/***/ "./src/core/objects/WebMIDI/devices.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/WebMIDI/devices.ts ***!
  \*********************************************/
/*! exports provided: midiDevices */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "midiDevices", function() { return midiDevices; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/WebMIDI/Base.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class midiDevices extends _Base__WEBPACK_IMPORTED_MODULE_1__["DefaultWebMIDIObject"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      midiAccess: undefined
    });

    _defineProperty(this, "handleDeviceChange", async () => {
      if (!this.getProp("autoUpdate")) return;
      const filters = this.box.args.slice();
      if (!filters.length) filters.push("input", "output");
      const {
        midiAccess
      } = this.state;

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
        this.state.midiAccess = midiAccess;
        midiAccess.addEventListener("statechange", this.handleDeviceChange);
        if (this.getProp("autoUpdate")) this.handleDeviceChange();
      } catch (e) {
        this.error(e);
      }
    });
    this.on("inlet", async (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        let filters;

        if (data instanceof _Base__WEBPACK_IMPORTED_MODULE_0__["Bang"]) {
          filters = this.box.args.slice();
          if (!filters.length) filters.push("input", "output");
        } else {
          filters = data.slice();
        }

        const {
          midiAccess
        } = this.state;

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
      if (this.state.midiAccess) this.state.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
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

/***/ "./src/core/objects/WebMIDI/exports.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/WebMIDI/exports.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _devices__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./devices */ "./src/core/objects/WebMIDI/devices.ts");
/* harmony import */ var _midiIO__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./midiIO */ "./src/core/objects/WebMIDI/midiIO.ts");


/* harmony default export */ __webpack_exports__["default"] = ({
  midiDevices: _devices__WEBPACK_IMPORTED_MODULE_0__["midiDevices"],
  midiIn: _midiIO__WEBPACK_IMPORTED_MODULE_1__["midiIn"],
  midiOut: _midiIO__WEBPACK_IMPORTED_MODULE_1__["midiOut"]
});

/***/ }),

/***/ "./src/core/objects/WebMIDI/midiIO.ts":
/*!********************************************!*\
  !*** ./src/core/objects/WebMIDI/midiIO.ts ***!
  \********************************************/
/*! exports provided: midiIn, midiOut */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "midiIn", function() { return midiIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "midiOut", function() { return midiOut; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/WebMIDI/Base.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class midiIn extends _Base__WEBPACK_IMPORTED_MODULE_0__["DefaultWebMIDIObject"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      midiAccess: undefined,
      search: undefined,
      port: undefined
    });

    _defineProperty(this, "handleDeviceChange", async () => {
      const {
        midiAccess
      } = this.state;

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
      this.meta = meta;
    });

    _defineProperty(this, "handleMIDIMessage", e => this.outlet(0, e.data));

    _defineProperty(this, "newSearch", async search => {
      this.state.search = search;
      const {
        midiAccess
      } = this.state;

      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }

      const devices = [];
      midiAccess.inputs.forEach(v => devices.push(v));

      for (let i = 0; i < devices.length; i++) {
        const port = devices[i];

        if (!search || port.id === search || port.name === search) {
          if (port !== this.state.port) {
            if (this.state.port) this.state.port.removeEventListener("midimessage", this.handleMIDIMessage);
            this.state.port = port;
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
      const search = this.box.args[0];

      try {
        const midiAccess = await navigator.requestMIDIAccess({
          sysex: true
        });
        this.state.midiAccess = midiAccess;
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
      this.newSearch(this.state.search);
    });
    this.on("inlet", async (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) {
          await this.newSearch(data);
        }

        if (this.state.port) this.outlet(1, this.state.port);
      }
    });
    this.on("destroy", () => {
      if (this.state.midiAccess) this.state.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
      if (this.state.port) this.state.port.removeEventListener("midimessage", this.handleMIDIMessage);
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

class midiOut extends _Base__WEBPACK_IMPORTED_MODULE_0__["DefaultWebMIDIObject"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      midiAccess: undefined,
      search: undefined,
      port: undefined
    });

    _defineProperty(this, "handleDeviceChange", async () => {
      const {
        midiAccess
      } = this.state;

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
      this.meta = meta;
    });

    _defineProperty(this, "newSearch", async search => {
      this.state.search = search;
      const {
        midiAccess
      } = this.state;

      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }

      const devices = [];
      midiAccess.outputs.forEach(v => devices.push(v));

      for (let i = 0; i < devices.length; i++) {
        const port = devices[i];

        if (!search || port.id === search || port.name === search) {
          this.state.port = port;
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
        this.state.midiAccess = midiAccess;
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
      this.newSearch(this.state.search);
    });
    this.on("inlet", async (_ref2) => {
      let {
        data,
        inlet
      } = _ref2;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) {
          if (typeof data === "string") {
            await this.newSearch(data);
          } else {
            if (this.state.port) this.state.port.send(data);
            return;
          }
        }

        if (this.state.port) this.outlet(0, this.state.port);
      }
    });
    this.on("destroy", () => {
      if (this.state.midiAccess) this.state.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
    });
  }

}

_defineProperty(midiOut, "description", "Get MIDI output from device name or ID");

_defineProperty(midiOut, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Uint8Array or number[] to output MIDI message, string to fetch device name or ID, bang to output MIDI port instance"
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

/***/ })

}]);
//# sourceMappingURL=7b5741d7d24a0aee1659.js.map