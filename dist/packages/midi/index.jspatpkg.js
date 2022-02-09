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

/***/ "./src/objects/Base.ts":
/*!*****************************!*\
  !*** ./src/objects/Base.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MidiObject)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.ts");
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");


class MidiObject extends _sdk__WEBPACK_IMPORTED_MODULE_1__.DefaultObject {
}
MidiObject.package = _index__WEBPACK_IMPORTED_MODULE_0__.name;
MidiObject.author = _index__WEBPACK_IMPORTED_MODULE_0__.author;
MidiObject.version = _index__WEBPACK_IMPORTED_MODULE_0__.version;
MidiObject.description = _index__WEBPACK_IMPORTED_MODULE_0__.description;


/***/ }),

/***/ "./src/objects/devices.ts":
/*!********************************!*\
  !*** ./src/objects/devices.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiDevices)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");


class midiDevices extends _Base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this._ = { midiAccess: void 0 };
    this.handleDeviceChange = async () => {
      if (!this.getProp("autoUpdate"))
        return;
      const filters = this.args.slice();
      if (!filters.length)
        filters.push("input", "output");
      const { midiAccess } = this._;
      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }
      const devices = [];
      if (filters.indexOf("input") !== -1)
        midiAccess.inputs.forEach((v) => devices.push(v));
      if (filters.indexOf("output") !== -1)
        midiAccess.outputs.forEach((v) => devices.push(v));
      const options = devices.map((d, key) => {
        const { type, name, id } = d;
        return { key, icon: { input: "sign-in", output: "sign-out" }[type], text: name || id, value: id };
      });
      this.outletAll([devices, options]);
    };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("postInit", async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
        this._.midiAccess = midiAccess;
        midiAccess.addEventListener("statechange", this.handleDeviceChange);
        if (this.getProp("autoUpdate"))
          this.handleDeviceChange();
      } catch (e) {
        this.error(e);
      }
    });
    this.on("inlet", async ({ data, inlet }) => {
      if (inlet === 0) {
        let filters;
        if ((0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          filters = this.args.slice();
          if (!filters.length)
            filters.push("input", "output");
        } else {
          filters = data.slice();
        }
        const { midiAccess } = this._;
        if (!midiAccess) {
          this.error("MIDIAccess not available.");
          return;
        }
        const devices = [];
        if (filters.indexOf("input") !== -1)
          midiAccess.inputs.forEach((v) => devices.push(v));
        if (filters.indexOf("output") !== -1)
          midiAccess.outputs.forEach((v) => devices.push(v));
        const options = devices.map((d, key) => {
          const { type, name, id } = d;
          return { key, icon: { input: "sign-in", output: "sign-out" }[type], text: name || id, value: id };
        });
        this.outletAll([devices, options]);
      }
    });
    this.on("destroy", () => {
      if (this._.midiAccess)
        this._.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
    });
  }
}
midiDevices.description = "Enumerate MIDI devices";
midiDevices.inlets = [{
  isHot: true,
  type: "object",
  description: "Bang to enumerate, MIDIPortType[] to use a filter"
}];
midiDevices.outlets = [{
  type: "object",
  description: "Array of MIDIPort"
}, {
  type: "object",
  description: "Array of DropdownItemProps"
}];
midiDevices.args = [{
  type: "enum",
  varLength: true,
  optional: true,
  enums: ["input", "output"],
  default: ["input", "output"],
  description: "Output only kinds of devices"
}];
midiDevices.props = {
  autoUpdate: {
    type: "boolean",
    default: true,
    description: "Auto output devices when devices change"
  }
};


/***/ }),

/***/ "./src/objects/makeNote.ts":
/*!*********************************!*\
  !*** ./src/objects/makeNote.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ makeNote)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");

class makeNote extends _Base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = {
      velocity: Math.min(127, Math.max(0, ~~+this.args[0])) || 0,
      duration: Math.max(0, +this.args[1]) || 0,
      channel: Math.min(16, Math.max(1, ~~+this.args[2])) || 1,
      map: new Array(16).fill(null).map(() => new Array(128).fill(null).map(() => /* @__PURE__ */ new Set()))
    };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 4;
      this.outlets = 3;
    });
    this.on("inlet", async ({ data, inlet }) => {
      if (inlet === 0) {
        if (typeof data === "number") {
          if (isNaN(data))
            return;
          const note = Math.min(127, Math.max(0, ~~+data));
          const { velocity, duration, channel, map } = this._;
          const repeatMode = this.getProp("repeatMode");
          const set = map[channel - 1][note];
          const ref = window.setTimeout(() => {
            set.delete(ref);
            this.outletAll([note, 0, channel]);
          }, duration);
          if (set.size) {
            if (repeatMode === "Re-trigger") {
              set.forEach((ref2) => {
                window.clearTimeout(ref2);
                this.outletAll([note, 0, channel]);
              });
              set.clear();
            } else if (repeatMode === "Stop last") {
              set.forEach((ref2) => {
                window.clearTimeout(ref2);
              });
              set.clear();
            }
          }
          set.add(ref);
          this.outletAll([note, velocity, channel]);
        } else if (data === "clear") {
          this._.map.forEach((noteMap) => {
            noteMap.forEach((set) => {
              set.forEach((ref) => window.clearTimeout(ref));
              set.clear();
            });
          });
        } else if (data === "stop") {
          const repeatMode = this.getProp("repeatMode");
          this._.map.forEach((noteMap, channel) => {
            noteMap.forEach((set, note) => {
              set.forEach((ref) => window.clearTimeout(ref));
              if (repeatMode === "Stop last")
                this.outletAll([note, 0, channel]);
              else
                set.forEach(() => this.outletAll([note, 0, channel]));
              set.clear();
            });
          });
        }
      } else if (inlet === 1) {
        this._.velocity = Math.min(127, Math.max(0, ~~+data)) || 0;
      } else if (inlet === 2) {
        this._.duration = Math.max(0, +data) || 0;
      } else if (inlet === 3) {
        this._.channel = Math.min(16, Math.max(1, ~~+data)) || 1;
      }
    });
    this.on("destroy", () => {
      this._.map.forEach((channel) => {
        channel.forEach((note) => {
          note.forEach((ref) => window.clearTimeout(ref));
          note.clear();
        });
      });
    });
  }
}
makeNote.description = "Generate a note-on/note-off pair";
makeNote.inlets = [{
  isHot: true,
  type: "anything",
  description: 'MIDI-note number to start a note, "clear" to cancel future note-offs, "stop" to send note-offs now.'
}, {
  isHot: false,
  type: "number",
  description: "Velocity (0-127)"
}, {
  isHot: false,
  type: "number",
  description: "Duration in seconds"
}, {
  isHot: false,
  type: "number",
  description: "Channel (1-based)"
}];
makeNote.outlets = [{
  type: "number",
  description: "Pitch (0-127)"
}, {
  type: "number",
  description: "Velocity (0-127)"
}, {
  type: "number",
  description: "Channel (1-based)"
}];
makeNote.args = [{
  type: "number",
  optional: false,
  description: "Initial velocity (0-127)",
  default: 0
}, {
  type: "number",
  optional: false,
  description: "Initial duration in seconds",
  default: 0
}, {
  type: "number",
  optional: true,
  description: "Initial channel (1-based)",
  default: 1
}];
makeNote.props = {
  repeatMode: {
    type: "enum",
    enums: ["Poly", "Re-trigger", "Stop last"],
    description: "Re-trigger: if the note was already playing, send a note-off and retrigger the note; Stop last: send only one note-off message at the end of the last note.",
    default: "Poly"
  }
};


/***/ }),

/***/ "./src/objects/midiFormat.ts":
/*!***********************************!*\
  !*** ./src/objects/midiFormat.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiFormat)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");

class midiFormat extends _Base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this._ = { channel: 0 };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 7;
      this.outlets = 1;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet < 3) {
        try {
          let [data1, data2] = data;
          if (typeof data1 !== "number" || typeof data2 !== "number") {
            throw new Error("Input MIDI data is not numbers");
          }
          data1 = Math.round(Math.max(0, Math.min(127, data1)));
          data2 = Math.round(Math.max(0, Math.min(127, data2)));
          if (inlet === 0) {
            this.outlet(0, new Uint8Array([144 + this._.channel, data1, data2]));
          } else if (inlet === 1) {
            this.outlet(0, new Uint8Array([160 + this._.channel, data1, data2]));
          } else if (inlet === 2) {
            this.outlet(0, new Uint8Array([176 + this._.channel, data1, data2]));
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
          this.outlet(0, new Uint8Array([192 + this._.channel, data1]));
        } else if (inlet === 4) {
          this.outlet(0, new Uint8Array([208 + this._.channel, data1]));
        } else if (inlet === 5) {
          const hires = this.getProp("hires");
          if (hires === "off") {
            this.outlet(0, new Uint8Array([224 + this._.channel, 0, data1]));
          } else if (hires === "float") {
            const data2 = ~~((Math.max(-1, Math.min(1, data1)) + 1) * 0.5 * 16383);
            this.outlet(0, new Uint8Array([224 + this._.channel, data2 & 127, data2 >> 7]));
          } else {
            const data2 = ~~Math.max(-8192, Math.min(8191, data1)) + 8192;
            this.outlet(0, new Uint8Array([224 + this._.channel, data2 & 127, data2 >> 7]));
          }
        } else if (inlet === 6) {
          this._.channel = Math.min(15, data1 - 1);
        }
      }
    });
  }
}
midiFormat.description = "Prepare data in the form of a MIDI message";
midiFormat.outlets = [{
  type: "object",
  description: "Raw MIDI message: Uint8Array"
}];
midiFormat.inlets = [{
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
}];
midiFormat.props = {
  hires: {
    type: "enum",
    enums: ["off", "float", "14bit"],
    default: "off",
    description: "High-resolution Pitch Bend (Off (0-127), Float (-1 to 1), 14-bit Fixed (-8192 to 8191))"
  }
};


/***/ }),

/***/ "./src/objects/midiIn.ts":
/*!*******************************!*\
  !*** ./src/objects/midiIn.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiIn)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");
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


const _midiIn = class extends _Base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this._ = { midiAccess: void 0, search: void 0, port: void 0 };
    this.handleDeviceChange = async () => {
      const { midiAccess } = this._;
      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }
      const devices = [];
      midiAccess.inputs.forEach((v) => devices.push(v));
      const enums = devices.map((d) => d.name || d.id);
      const { meta } = this;
      meta.args[0] = __spreadProps(__spreadValues({}, _midiIn.args[0]), { type: "enum", enums });
      this.setMeta(meta);
    };
    this.handleMIDIMessage = (e) => this.outlet(0, e.data);
    this.newSearch = async (search) => {
      this._.search = search;
      const { midiAccess } = this._;
      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }
      const devices = [];
      midiAccess.inputs.forEach((v) => devices.push(v));
      for (let i = 0; i < devices.length; i++) {
        const port = devices[i];
        if (!search || port.id === search || port.name === search) {
          if (port !== this._.port) {
            if (this._.port)
              this._.port.removeEventListener("midimessage", this.handleMIDIMessage);
            this._.port = port;
            port.addEventListener("midimessage", this.handleMIDIMessage);
            break;
          }
        }
      }
    };
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
        const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
        this._.midiAccess = midiAccess;
        midiAccess.addEventListener("statechange", this.handleDeviceChange);
        this.handleDeviceChange();
        this.newSearch(search);
      } catch (e) {
        this.error(e);
      }
    });
    this.on("updateArgs", (args) => {
      this.newSearch(args[0]);
    });
    this.on("updateProps", () => {
      this.newSearch(this._.search);
    });
    this.on("inlet", async ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          await this.newSearch(data);
        }
        if (this._.port)
          this.outlet(1, this._.port);
      }
    });
    this.on("destroy", () => {
      if (this._.midiAccess)
        this._.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
      if (this._.port)
        this._.port.removeEventListener("midimessage", this.handleMIDIMessage);
    });
  }
};
let midiIn = _midiIn;
midiIn.description = "Get MIDI input from device name or ID";
midiIn.inlets = [{
  isHot: true,
  type: "anything",
  description: "string to fetch device name or ID, bang to output MIDI port instance"
}];
midiIn.outlets = [{
  type: "object",
  description: "MIDI message: Uint8Array"
}, {
  type: "object",
  description: "Instance: MIDIPort"
}];
midiIn.args = [{
  type: "string",
  optional: false,
  description: "Device name or ID"
}];



/***/ }),

/***/ "./src/objects/midiOut.ts":
/*!********************************!*\
  !*** ./src/objects/midiOut.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiOut)
/* harmony export */ });
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sdk */ "./src/sdk.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");
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


const _midiOut = class extends _Base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this._ = { midiAccess: void 0, search: void 0, port: void 0, timestamp: 0 };
    this.handleDeviceChange = async () => {
      const { midiAccess } = this._;
      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }
      const devices = [];
      midiAccess.outputs.forEach((v) => devices.push(v));
      const enums = devices.map((d) => d.name || d.id);
      const { meta } = this;
      meta.args[0] = __spreadProps(__spreadValues({}, _midiOut.args[0]), { type: "enum", enums });
      this.setMeta(meta);
    };
    this.newSearch = async (search) => {
      this._.search = search;
      const { midiAccess } = this._;
      if (!midiAccess) {
        this.error("MIDIAccess not available.");
        return;
      }
      const devices = [];
      midiAccess.outputs.forEach((v) => devices.push(v));
      for (let i = 0; i < devices.length; i++) {
        const port = devices[i];
        if (!search || port.id === search || port.name === search) {
          this._.port = port;
          break;
        }
      }
    };
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
        const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
        this._.midiAccess = midiAccess;
        midiAccess.addEventListener("statechange", this.handleDeviceChange);
        this.handleDeviceChange();
        this.newSearch(search);
      } catch (e) {
        this.error(e);
      }
    });
    this.on("updateArgs", (args) => {
      this.newSearch(args[0]);
    });
    this.on("updateProps", () => {
      this.newSearch(this._.search);
    });
    this.on("inlet", async ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_sdk__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          if (typeof data === "string") {
            await this.newSearch(data);
          } else {
            if (this._.port)
              this._.port.send(data);
            return;
          }
        }
        if (this._.port)
          this.outlet(0, this._.port);
      } else if (inlet === 1) {
        this._.timestamp = +data || 0;
      }
    });
    this.on("destroy", () => {
      if (this._.midiAccess)
        this._.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
    });
  }
};
let midiOut = _midiOut;
midiOut.description = "Get MIDI output from device name or ID";
midiOut.inlets = [{
  isHot: true,
  type: "anything",
  description: "Uint8Array or number[] to output MIDI message, string to fetch device name or ID, bang to output MIDI port instance"
}, {
  isHot: false,
  type: "number",
  description: "The time at which to begin sending the data to the port. 0 or past means immediate send."
}];
midiOut.outlets = [{
  type: "object",
  description: "Instance: MIDIPort"
}];
midiOut.args = [{
  type: "string",
  optional: false,
  description: "Device name or ID"
}];



/***/ }),

/***/ "./src/objects/midiParse.ts":
/*!**********************************!*\
  !*** ./src/objects/midiParse.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiParse)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");

class midiParse extends _Base__WEBPACK_IMPORTED_MODULE_0__["default"] {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 7;
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        try {
          const [data0, data1, data2] = data;
          const eventType = data0 >> 4;
          const channel = data0 & 15 + 1;
          if (eventType === 8) {
            this.outlet(0, [data1, 0]);
          } else if (eventType === 9) {
            this.outlet(6, channel);
            this.outlet(0, [data1, data2]);
          } else if (eventType === 10) {
            this.outlet(6, channel);
            this.outlet(1, [data1, data2]);
          } else if (eventType === 11) {
            this.outlet(6, channel);
            this.outlet(2, [data1, data2]);
          } else if (eventType === 12) {
            this.outlet(6, channel);
            this.outlet(3, data1);
          } else if (eventType === 13) {
            this.outlet(6, channel);
            this.outlet(4, data1);
          } else if (eventType === 14) {
            this.outlet(6, channel);
            const hires = this.getProp("hires");
            if (hires === "off")
              this.outlet(5, data2);
            else if (hires === "float")
              this.outlet(5, (data1 + (data2 << 7)) / 16383 * 2 - 1);
            else
              this.outlet(5, -8192 + data1 + (data2 << 7));
          } else {
            this.error(`Unrecognised MIDI event type: ${eventType}`);
          }
        } catch (e) {
          this.error(e);
        }
      }
    });
  }
}
midiParse.description = "Interpret raw MIDI data";
midiParse.inlets = [{
  isHot: true,
  type: "anything",
  description: "Raw MIDI message: Iterable<number>"
}];
midiParse.outlets = [{
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
}];
midiParse.props = {
  hires: {
    type: "enum",
    enums: ["off", "float", "14bit"],
    default: "off",
    description: "High-resolution Pitch Bend (Off (0-127), Float (-1 to 1), 14-bit Fixed (-8192 to 8191))"
  }
};


/***/ }),

/***/ "./src/objects/midiSequencer.ts":
/*!**************************************!*\
  !*** ./src/objects/midiSequencer.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ midiSequencer)
/* harmony export */ });
/* harmony import */ var _worklets_MidiSequencerNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../worklets/MidiSequencerNode */ "./src/worklets/MidiSequencerNode.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/objects/Base.ts");


class midiSequencer extends _Base__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(...arguments);
    this._ = { node: null };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("postInit", async () => {
      await _worklets_MidiSequencerNode__WEBPACK_IMPORTED_MODULE_0__["default"].register(this.audioCtx);
      const node = new _worklets_MidiSequencerNode__WEBPACK_IMPORTED_MODULE_0__["default"](this.audioCtx);
      node.onMidi = (bytes) => this.outlet(0, bytes);
      this._.node = node;
    });
    this.on("updateProps", () => {
      this._.node.parameters.get("loop").value = +!!this.getProp("loop");
      this._.node.parameters.get("replaceOnEnd").value = +!!this.getProp("replaceOnEnd");
    });
    this.on("inlet", async ({ data, inlet }) => {
      if (inlet === 0) {
        if (typeof data === "number" || typeof data === "boolean") {
          this._.node.parameters.get("playing").value = +!!data;
        } else if (data instanceof ArrayBuffer) {
          this._.node.loadFile(data);
        } else if (data instanceof Uint8Array) {
          this._.node.loadFile(data.buffer);
        } else if (typeof data === "object") {
          if (typeof data.goto === "number")
            this._.node.goto(data.goto);
        }
      }
    });
    this.on("destroy", () => {
      this._.node.destroy();
    });
  }
}
midiSequencer.description = "MIDI File Player";
midiSequencer.inlets = [{
  isHot: true,
  type: "anything",
  description: "ArrayBuffer as MIDI File, { goto: number } to jump, boolean/number to switch play/stop"
}];
midiSequencer.outlets = [{
  type: "object",
  description: "realtime MIDI event"
}];
midiSequencer.args = [];
midiSequencer.props = {
  loop: {
    type: "boolean",
    description: "Loop",
    default: false
  },
  replaceOnEnd: {
    type: "boolean",
    description: "Replace MIDI file when current playing file ends",
    default: false
  }
};


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

/***/ "./src/worklets/MidiParser.ts":
/*!************************************!*\
  !*** ./src/worklets/MidiParser.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Parser {
  constructor(data) {
    this.buffer = new DataView(data);
    this.bufferLen = this.buffer.byteLength;
    this.pos = 0;
  }
  eof() {
    return this.pos >= this.bufferLen;
  }
  readUInt8() {
    const result = this.buffer.getUint8(this.pos);
    this.pos += 1;
    return result;
  }
  readInt8() {
    const result = this.buffer.getInt8(this.pos);
    this.pos += 1;
    return result;
  }
  readUInt16() {
    const result = this.buffer.getUint16(this.pos);
    this.pos += 2;
    return result;
  }
  readInt16() {
    const result = this.buffer.getInt16(this.pos);
    this.pos += 2;
    return result;
  }
  readUInt24() {
    const b0 = this.readUInt8();
    const b1 = this.readUInt8();
    const b2 = this.readUInt8();
    return (b0 << 16) + (b1 << 8) + b2;
  }
  readInt24() {
    const u = this.readUInt24();
    if (u & 8388608)
      return u - 16777216;
    else
      return u;
  }
  readUInt32() {
    const result = this.buffer.getUint32(this.pos);
    this.pos += 4;
    return result;
  }
  readInt32() {
    const result = this.buffer.getInt32(this.pos);
    this.pos += 4;
    return result;
  }
  readBytes(len) {
    const bytes = this.buffer.buffer.slice(this.pos, this.pos + len);
    this.pos += len;
    return bytes;
  }
  readString(len) {
    const bytes = this.readBytes(len);
    return String.fromCharCode.apply(null, new Uint8Array(bytes));
  }
  readVarInt() {
    let result = 0;
    while (!this.eof()) {
      const b = this.readUInt8();
      if (b & 128) {
        result += b & 127;
        result <<= 7;
      } else {
        return result + b;
      }
    }
    return result;
  }
  readChunk() {
    const id = this.readString(4);
    const length = this.readUInt32();
    const data = this.readBytes(length);
    return { id, length, data };
  }
}
const parseMidi = (data) => {
  const p = new Parser(data);
  const headerChunk = p.readChunk();
  if (headerChunk.id != "MThd")
    throw new Error(`Bad MIDI file.  Expected "MHdr", got: "${headerChunk.id}"`);
  const header = parseHeader(headerChunk.data);
  const tracks = [];
  let duration = 0;
  for (let i = 0; !p.eof() && i < header.numTracks; i++) {
    const trackChunk = p.readChunk();
    if (trackChunk.id != "MTrk")
      throw new Error(`Bad MIDI file.  Expected "MTrk", got: "${trackChunk.id}"`);
    const track = parseTrack(trackChunk.data, header.ticksPerBeat);
    tracks.push(track);
    const lastEvent = track[track.length - 1];
    if ("time" in lastEvent && lastEvent.time > duration)
      duration = lastEvent.time;
  }
  return { header, tracks, duration };
};
const parseHeader = (data) => {
  const p = new Parser(data);
  const format = p.readUInt16();
  const numTracks = p.readUInt16();
  const timeDivision = p.readUInt16();
  if (timeDivision & 32768) {
    const framesPerSecond = 256 - (timeDivision >> 8);
    const ticksPerFrame = timeDivision & 255;
    return { format, numTracks, timeDivision, framesPerSecond, ticksPerFrame };
  } else {
    const ticksPerBeat = timeDivision;
    return { format, numTracks, timeDivision, ticksPerBeat };
  }
};
const parseTrack = (data, ppq = 480) => {
  const p = new Parser(data);
  let lastEventTypeByte = null;
  let ticks = 0;
  let bpm = 120;
  let tempoTicks = 0;
  let tempoTime = 0;
  const readEvent = () => {
    const deltaTicks = p.readVarInt();
    ticks += deltaTicks;
    const elapsedBeats = (ticks - tempoTicks) / ppq;
    const time = tempoTime + 60 / bpm * elapsedBeats;
    let eventTypeByte = p.readUInt8();
    const event = { ticks, deltaTicks, time };
    if ((eventTypeByte & 240) === 240) {
      if (eventTypeByte === 255) {
        event.meta = true;
        const metatypeByte = p.readUInt8();
        const length = p.readVarInt();
        if (metatypeByte === 0) {
          event.type = "sequenceNumber";
          if (length !== 2)
            throw `Expected length for sequenceNumber event is 2, got ${length}`;
          event.number = p.readUInt16();
        } else if (metatypeByte === 1) {
          event.type = "text";
          event.text = p.readString(length);
        } else if (metatypeByte === 2) {
          event.type = "copyrightNotice";
          event.text = p.readString(length);
        } else if (metatypeByte === 3) {
          event.type = "trackName";
          event.text = p.readString(length);
        } else if (metatypeByte === 4) {
          event.type = "instrumentName";
          event.text = p.readString(length);
        } else if (metatypeByte === 5) {
          event.type = "lyrics";
          event.text = p.readString(length);
        } else if (metatypeByte === 6) {
          event.type = "marker";
          event.text = p.readString(length);
        } else if (metatypeByte === 7) {
          event.type = "cuePoint";
          event.text = p.readString(length);
        } else if (metatypeByte === 32) {
          event.type = "channelPrefix";
          if (length != 1)
            throw new Error(`Expected length for channelPrefix event is 1, got ${length}`);
          event.channel = p.readUInt8();
        } else if (metatypeByte === 33) {
          event.type = "portPrefix";
          if (length != 1)
            throw new Error(`Expected length for portPrefix event is 1, got ${length}`);
          event.port = p.readUInt8();
        } else if (metatypeByte === 47) {
          event.type = "endOfTrack";
          if (length != 0)
            throw new Error(`Expected length for endOfTrack event is 0, got ${length}`);
        } else if (metatypeByte === 81) {
          event.type = "setTempo";
          if (length != 3)
            throw new Error(`Expected length for setTempo event is 3, got ${length}`);
          const microsecondsPerBeat = p.readUInt24();
          event.microsecondsPerBeat = microsecondsPerBeat;
          bpm = 6e7 / event.microsecondsPerBeat;
          tempoTicks = ticks;
          tempoTime = time;
        } else if (metatypeByte === 84) {
          event.type = "smpteOffset";
          if (length != 5)
            throw new Error(`Expected length for smpteOffset event is 5, got ${length}`);
          const hourByte = p.readUInt8();
          const FRAME_RATES = { 0: 24, 32: 25, 64: 29, 96: 30 };
          event.frameRate = FRAME_RATES[hourByte & 96];
          event.hour = hourByte & 31;
          event.min = p.readUInt8();
          event.sec = p.readUInt8();
          event.frame = p.readUInt8();
          event.subFrame = p.readUInt8();
        } else if (metatypeByte === 88) {
          event.type = "timeSignature";
          if (length != 4)
            throw new Error(`Expected length for timeSignature event is 4, got ${length}`);
          event.numerator = p.readUInt8();
          event.denominator = 1 << p.readUInt8();
          event.metronome = p.readUInt8();
          event.thirtyseconds = p.readUInt8();
        } else if (metatypeByte === 89) {
          event.type = "keySignature";
          if (length != 2)
            throw new Error(`Expected length for keySignature event is 2, got ${length}`);
          event.key = p.readInt8();
          event.scale = p.readUInt8();
        } else if (metatypeByte === 127) {
          event.type = "sequencerSpecific";
          event.data = p.readBytes(length);
        } else {
          event.type = "unknownMeta";
          event.data = p.readBytes(length);
          event.metatypeByte = metatypeByte;
        }
      } else if (eventTypeByte == 240) {
        event.type = "sysEx";
        const length = p.readVarInt();
        const data2 = p.readBytes(length);
        event.bytes = new Uint8Array([eventTypeByte, ...new Uint8Array(data2)]);
      } else if (eventTypeByte == 247) {
        event.type = "endSysEx";
        const length = p.readVarInt();
        const data2 = p.readBytes(length);
        event.bytes = new Uint8Array([eventTypeByte, ...new Uint8Array(data2)]);
      } else {
        throw new Error(`Unrecognised MIDI event type byte: ${eventTypeByte}`);
      }
    } else {
      let param1;
      if ((eventTypeByte & 128) === 0) {
        if (lastEventTypeByte === null)
          throw new Error("Running status byte encountered before status byte");
        param1 = eventTypeByte;
        eventTypeByte = lastEventTypeByte;
        event.running = true;
      } else {
        param1 = p.readUInt8();
        lastEventTypeByte = eventTypeByte;
      }
      const eventType = eventTypeByte >> 4;
      event.channel = eventTypeByte & 15;
      if (eventType === 8) {
        event.type = "noteOff";
        event.noteNumber = param1;
        const param2 = p.readUInt8();
        event.velocity = param2;
        event.bytes = new Uint8Array([eventTypeByte, param1, param2]);
      } else if (eventType === 9) {
        const velocity = p.readUInt8();
        event.type = velocity === 0 ? "noteOff" : "noteOn";
        event.noteNumber = param1;
        event.velocity = velocity;
        if (velocity === 0)
          event.byte9 = true;
        event.bytes = new Uint8Array([eventTypeByte, param1, velocity]);
      } else if (eventType === 10) {
        event.type = "noteAftertouch";
        event.noteNumber = param1;
        const param2 = p.readUInt8();
        event.amount = param2;
        event.bytes = new Uint8Array([eventTypeByte, param1, param2]);
      } else if (eventType === 11) {
        event.type = "controller";
        event.controllerType = param1;
        const param2 = p.readUInt8();
        event.value = param2;
        event.bytes = new Uint8Array([eventTypeByte, param1, param2]);
      } else if (eventType === 12) {
        event.type = "programChange";
        event.programNumber = param1;
        event.bytes = new Uint8Array([eventTypeByte, param1]);
      } else if (eventType === 13) {
        event.type = "channelAftertouch";
        event.amount = param1;
        event.bytes = new Uint8Array([eventTypeByte, param1]);
      } else if (eventType === 14) {
        event.type = "pitchBend";
        const param2 = p.readUInt8();
        event.value = param1 + (param2 << 7) - 8192;
        event.bytes = new Uint8Array([eventTypeByte, param1, param2]);
      } else {
        throw new Error(`Unrecognised MIDI event type: ${eventType}`);
      }
    }
    return event;
  };
  const events = [];
  while (!p.eof()) {
    const event = readEvent();
    events.push(event);
  }
  return events;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parseMidi);


/***/ }),

/***/ "./src/worklets/MidiSequencerNode.ts":
/*!*******************************************!*\
  !*** ./src/worklets/MidiSequencerNode.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "processorId": () => (/* binding */ processorId),
/* harmony export */   "AudioWorkletNode": () => (/* binding */ AudioWorkletNode),
/* harmony export */   "default": () => (/* binding */ MidiSequencerNode)
/* harmony export */ });
/* harmony import */ var _MidiSequencerProcessor_worklet_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MidiSequencerProcessor.worklet.ts */ "./src/worklets/MidiSequencerProcessor.worklet.ts");
/* harmony import */ var _MidiSequencerProcessor_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_MidiSequencerProcessor_worklet_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _MidiParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MidiParser */ "./src/worklets/MidiParser.ts");


const processorId = "__JSPatcher_package-midi_MidiSequencer";
const AudioWorkletNode = globalThis.AudioWorkletNode;
class MidiSequencerNode extends AudioWorkletNode {
  static register(context) {
    return context.audioWorklet.addModule((_MidiSequencerProcessor_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default()));
  }
  constructor(context) {
    super(context, processorId, { numberOfInputs: 0, numberOfOutputs: 1 });
    this.timeOffset = 0;
    this.totalDuration = 0;
    this.handleMessage = (e) => {
      if (e.data.type === "midiMessage") {
        this.onMidi(e.data.data.bytes, e.data.data.time);
      } else if (e.data.type === "timeOffset") {
        this.timeOffset = e.data.data;
      }
    };
    this.port.onmessage = this.handleMessage;
  }
  loadFile(file) {
    const data = (0,_MidiParser__WEBPACK_IMPORTED_MODULE_1__["default"])(file);
    this.totalDuration = data.duration;
    this.port.postMessage({ type: "midiJson", data });
  }
  goto(time) {
    this.port.postMessage({ type: "goto", data: time });
  }
  sendFlush() {
    this.onMidi(new Uint8Array([176, 121, 0]), this.context.currentTime);
    this.onMidi(new Uint8Array([176, 123, 0]), this.context.currentTime);
  }
  destroy() {
    this.sendFlush();
  }
}


/***/ }),

/***/ "./src/worklets/MidiSequencerProcessor.worklet.ts":
/*!********************************************************!*\
  !*** ./src/worklets/MidiSequencerProcessor.worklet.ts ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! !!./node_modules/worklet-loader/dist/worklets/InlineWorklet.js */ "./node_modules/worklet-loader/dist/worklets/InlineWorklet.js")("/******/ (() => { // webpackBootstrap\n/******/ \t\"use strict\";\n/******/ \t// The require scope\n/******/ \tvar __webpack_require__ = {};\n/******/ \t\n/************************************************************************/\n/******/ \t/* webpack/runtime/define property getters */\n/******/ \t(() => {\n/******/ \t\t// define getter functions for harmony exports\n/******/ \t\t__webpack_require__.d = (exports, definition) => {\n/******/ \t\t\tfor(var key in definition) {\n/******/ \t\t\t\tif(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {\n/******/ \t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: definition[key] });\n/******/ \t\t\t\t}\n/******/ \t\t\t}\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/hasOwnProperty shorthand */\n/******/ \t(() => {\n/******/ \t\t__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/make namespace object */\n/******/ \t(() => {\n/******/ \t\t// define __esModule on exports\n/******/ \t\t__webpack_require__.r = (exports) => {\n/******/ \t\t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n/******/ \t\t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t\t}\n/******/ \t\t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/************************************************************************/\nvar __webpack_exports__ = {};\n/*!*****************************************************************************************************************************!*\\\n  !*** ./node_modules/esbuild-loader/dist/index.js??ruleSet[1].rules[1].use!./src/worklets/MidiSequencerProcessor.worklet.ts ***!\n  \\*****************************************************************************************************************************/\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"processorId\": () => (/* binding */ processorId)\n/* harmony export */ });\nconst processorId = \"__JSPatcher_package-midi_MidiSequencer\";\nconst audioWorkletGlobalScope = globalThis;\nconst { registerProcessor, sampleRate } = audioWorkletGlobalScope;\nconst AudioWorkletProcessor = audioWorkletGlobalScope.AudioWorkletProcessor;\nclass MidiSequencerProcessor extends AudioWorkletProcessor {\n  constructor(options) {\n    super(options);\n    this.playing = false;\n    this.loop = false;\n    this.replaceOnEnd = false;\n    this.toReplaceOnEnd = null;\n    this.data = null;\n    this.orderedEvents = [];\n    this.$event = 0;\n    this.timeOffset = 0;\n    this.totalDuration = 0;\n    this.handleMessage = (e) => {\n      if (e.data.type === \"midiJson\") {\n        this.setData(e.data.data);\n      } else if (e.data.type === \"goto\") {\n        this.goto(e.data.data);\n      }\n    };\n    this.port.onmessage = this.handleMessage;\n  }\n  static get parameterDescriptors() {\n    return [{\n      name: \"playing\",\n      minValue: 0,\n      maxValue: 1,\n      defaultValue: 0\n    }, {\n      name: \"loop\",\n      minValue: 0,\n      maxValue: 1,\n      defaultValue: 0\n    }, {\n      name: \"replaceOnEnd\",\n      minValue: 0,\n      maxValue: 1,\n      defaultValue: 0\n    }];\n  }\n  _setData(data) {\n    this.sendFlush();\n    this.data = data;\n    this.orderedEvents = [];\n    this.$event = 0;\n    this.timeOffset = 0;\n    this.totalDuration = data.duration;\n    data.tracks.forEach((track) => {\n      track.forEach((event) => {\n        if (event.bytes) {\n          this.orderedEvents.push({ time: event.time, data: event.bytes });\n        }\n      });\n    });\n    this.orderedEvents.sort((a, b) => a.time - b.time);\n  }\n  setData(data) {\n    if (this.replaceOnEnd) {\n      this.toReplaceOnEnd = data;\n    } else {\n      this._setData(data);\n    }\n  }\n  goto(time) {\n    this.sendFlush();\n    let $ = 0;\n    this.timeOffset = Math.min(time, this.totalDuration);\n    for (let i = 0; i < this.orderedEvents.length; i++) {\n      const event = this.orderedEvents[i];\n      if (event.time < this.timeOffset)\n        $ = i;\n      else\n        break;\n    }\n    this.$event = $;\n  }\n  onMidi(data, time) {\n    this.port.postMessage({ type: \"midiMessage\", data: { bytes: data, time } });\n  }\n  sendFlush() {\n    const { currentTime } = audioWorkletGlobalScope;\n    this.onMidi(new Uint8Array([176, 121, 0]), currentTime);\n    this.onMidi(new Uint8Array([176, 123, 0]), currentTime);\n  }\n  advance(offset, playing, loop, fromTime) {\n    if (!playing)\n      return;\n    if (this.timeOffset >= this.totalDuration) {\n      if (this.toReplaceOnEnd && this.replaceOnEnd) {\n        this._setData(this.toReplaceOnEnd);\n        this.toReplaceOnEnd = null;\n      }\n      if (loop) {\n        this.timeOffset = 0;\n        this.$event = 0;\n      } else\n        return;\n    }\n    if (!this.orderedEvents.length)\n      return;\n    let advanced = 0;\n    while (advanced < offset) {\n      let $ = this.$event + 1;\n      let nextEventDeltaTime = 0;\n      let nextEvent = null;\n      const timeOffset = this.timeOffset + advanced;\n      if ($ >= this.orderedEvents.length) {\n        nextEventDeltaTime += this.totalDuration - timeOffset;\n        if (loop) {\n          $ = 0;\n          nextEvent = this.orderedEvents[$];\n          const { time } = nextEvent;\n          this.timeOffset -= this.totalDuration;\n          nextEventDeltaTime += time;\n        }\n      } else {\n        nextEvent = this.orderedEvents[$];\n        const { time } = nextEvent;\n        nextEventDeltaTime += time - timeOffset;\n      }\n      if (advanced + nextEventDeltaTime < offset) {\n        if (nextEvent) {\n          const { data } = nextEvent;\n          this.onMidi(data, fromTime + advanced);\n        } else\n          break;\n        this.$event = $;\n      }\n      advanced += nextEventDeltaTime;\n    }\n    this.timeOffset += offset;\n    if (loop) {\n      this.timeOffset %= this.totalDuration;\n    } else if (this.timeOffset > this.totalDuration) {\n      this.timeOffset = this.totalDuration;\n    }\n  }\n  updateTime() {\n    this.port.postMessage({ type: \"timeOffset\", data: this.timeOffset });\n  }\n  process(inputs, outputs, parameters) {\n    const bufferSize = outputs[0][0].length;\n    const advanceTime = 1 / sampleRate;\n    const { currentTime } = audioWorkletGlobalScope;\n    for (let i = 0; i < bufferSize; i++) {\n      const fromTime = currentTime * advanceTime * i;\n      const playing = !!(i < parameters.playing.length ? parameters.playing[i] : parameters.playing[0]);\n      if (playing !== this.playing && !playing)\n        this.onMidi(new Uint8Array([176, 123, 0]), fromTime);\n      this.playing = playing;\n      const loop = !!(i < parameters.loop.length ? parameters.loop[i] : parameters.loop[0]);\n      this.loop = loop;\n      const replaceOnEnd = !!(i < parameters.replaceOnEnd.length ? parameters.replaceOnEnd[i] : parameters.replaceOnEnd[0]);\n      if (replaceOnEnd !== this.replaceOnEnd && !replaceOnEnd)\n        this.toReplaceOnEnd = null;\n      this.replaceOnEnd = replaceOnEnd;\n      this.advance(advanceTime, this.playing, this.loop, fromTime);\n    }\n    this.updateTime();\n    return true;\n  }\n}\ntry {\n  registerProcessor(processorId, MidiSequencerProcessor);\n} catch (error) {\n  console.warn(error);\n}\n\n/******/ })()\n;\n//# sourceMappingURL=c3c842c83350a53f1ded.worklet.js.map");

/***/ }),

/***/ "./node_modules/worklet-loader/dist/worklets/InlineWorklet.js":
/*!********************************************************************!*\
  !*** ./node_modules/worklet-loader/dist/worklets/InlineWorklet.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
var URL = window.URL || window.webkitURL;

module.exports = function (content) {
  try {
    var blob;

    try {
      // BlobBuilder = Deprecated, but widely implemented
      var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
      blob = new BlobBuilder();
      blob.append(content);
      blob = blob.getBlob('application/javascript; charset=utf-8');
    } catch (e) {
      // The proposed API
      blob = new Blob([content], {
        type: 'application/javascript; charset=utf-8'
      });
    }

    return URL.createObjectURL(blob);
  } catch (e) {
    return 'data:application/javascript,' + encodeURIComponent(content);
  }
};

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@jspatcher/package-midi","version":"1.0.1","description":"The MIDI package for JSPatcher","main":"dist/index.js","scripts":{"build":"webpack --mode development","build-watch":"webpack --mode development --watch --stats-children"},"keywords":["jspatcher"],"jspatcher":{"isJSPatcherPackage":true,"thumbnail":"","jspatpkg":"index.jspatpkg.js"},"author":"Fr0stbyteR","license":"GPL-3.0-or-later","repository":"https://github.com/jspatcher/package-midi","devDependencies":{"@jspatcher/jspatcher":"^0.0.9","@types/webmidi":"^2.0.6","clean-webpack-plugin":"^4.0.0","esbuild-loader":"^2.18.0","semantic-ui-react":"^2.0.4","typescript":"^4.5.4","webpack":"^5.65.0","webpack-cli":"^4.9.1","worklet-loader":"^2.0.0"}}');

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
/* harmony import */ var _objects_devices__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/devices */ "./src/objects/devices.ts");
/* harmony import */ var _objects_midiFormat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/midiFormat */ "./src/objects/midiFormat.ts");
/* harmony import */ var _objects_midiIn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/midiIn */ "./src/objects/midiIn.ts");
/* harmony import */ var _objects_midiOut__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/midiOut */ "./src/objects/midiOut.ts");
/* harmony import */ var _objects_midiParse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/midiParse */ "./src/objects/midiParse.ts");
/* harmony import */ var _objects_midiSequencer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./objects/midiSequencer */ "./src/objects/midiSequencer.ts");
/* harmony import */ var _objects_makeNote__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./objects/makeNote */ "./src/objects/makeNote.ts");







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  return {
    midiDevices: _objects_devices__WEBPACK_IMPORTED_MODULE_0__["default"],
    midiIn: _objects_midiIn__WEBPACK_IMPORTED_MODULE_2__["default"],
    midiin: _objects_midiIn__WEBPACK_IMPORTED_MODULE_2__["default"],
    midiOut: _objects_midiOut__WEBPACK_IMPORTED_MODULE_3__["default"],
    midiout: _objects_midiOut__WEBPACK_IMPORTED_MODULE_3__["default"],
    midiFormat: _objects_midiFormat__WEBPACK_IMPORTED_MODULE_1__["default"],
    midiformat: _objects_midiFormat__WEBPACK_IMPORTED_MODULE_1__["default"],
    midiParse: _objects_midiParse__WEBPACK_IMPORTED_MODULE_4__["default"],
    midiparse: _objects_midiParse__WEBPACK_IMPORTED_MODULE_4__["default"],
    midiSequencer: _objects_midiSequencer__WEBPACK_IMPORTED_MODULE_5__["default"],
    midisequencer: _objects_midiSequencer__WEBPACK_IMPORTED_MODULE_5__["default"],
    makenote: _objects_makeNote__WEBPACK_IMPORTED_MODULE_6__["default"],
    makeNote: _objects_makeNote__WEBPACK_IMPORTED_MODULE_6__["default"]
  };
});

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.jspatpkg.js.map