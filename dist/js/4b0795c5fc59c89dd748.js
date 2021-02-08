(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_Std_tsx"],{

/***/ "./src/core/objects/Std.tsx":
/*!**********************************!*\
  !*** ./src/core/objects/Std.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "call": () => /* binding */ call,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! util */ "./node_modules/util/util.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _utils_symbols__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/symbols */ "./src/utils/symbols.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class StdObject extends _Base__WEBPACK_IMPORTED_MODULE_1__.DefaultObject {}

_defineProperty(StdObject, "package", "Std");

_defineProperty(StdObject, "author", "Fr0stbyteR");

_defineProperty(StdObject, "version", "1.0.0");

_defineProperty(StdObject, "description", "Standard Objects");

class print extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      title: "Print"
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] !== "undefined") this.state.title = args[0];
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          this.patcher.newLog("none", this.state.title, "Bang", this.box);
        } else {
          this.patcher.newLog("none", this.state.title, typeof data === "string" ? data : util__WEBPACK_IMPORTED_MODULE_0__.inspect(data), this.box);
        }
      }
    });
  }

}

_defineProperty(print, "description", "Print to console");

_defineProperty(print, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Anything to stringify"
}]);

_defineProperty(print, "args", [{
  type: "string",
  optional: true,
  default: "Print",
  description: "Title"
}]);

class bang extends StdObject {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", (_ref2) => {
      let {
        inlet
      } = _ref2;
      if (inlet === 0) this.outlet(0, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang());
    });
  }

}

_defineProperty(bang, "description", "Transform to bang");

_defineProperty(bang, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Anything to transform to a bang"
}]);

_defineProperty(bang, "outlets", [{
  type: "bang",
  description: "Bang when inlet"
}]);

class loadbang extends StdObject {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
      this.patcher.on("postInited", () => this.outlet(0, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang()));
    });
  }

}

_defineProperty(loadbang, "description", "Bang when patcher is loaded");

_defineProperty(loadbang, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Anything to transform to a bang"
}]);

_defineProperty(loadbang, "outlets", [{
  type: "bang",
  description: "Bang when inlet"
}]);

class unloadbang extends StdObject {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
      this.patcher.on("unload", () => this.outlet(0, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang()));
    });
  }

}

_defineProperty(unloadbang, "description", "Bang when patcher will be unloaded");

_defineProperty(unloadbang, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Anything to transform to a bang"
}]);

_defineProperty(unloadbang, "outlets", [{
  type: "bang",
  description: "Bang when inlet"
}]);

class For extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      start: 0,
      end: 0,
      step: 1
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 4;
      this.outlets = 2;
    });
    this.on("updateArgs", args => {
      this.state.start = +args[0] || 0;
      this.state.end = +args[1] || 0;
      this.state.step = +args[2] || 1;
    });
    this.on("inlet", (_ref3) => {
      let {
        data,
        inlet
      } = _ref3;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          const {
            start,
            end,
            step
          } = this.state;
          const times = (end - start) / step;

          if (!isFinite(times) || times < 0) {
            this.error("Infinite loop from ".concat(start, " to ").concat(end, " with step ").concat(step, "."));
            return;
          }

          for (let i = start; i < end; i += step) {
            this.outlet(1, i);
          }

          this.outlet(0, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang());
        }
      } else if (inlet === 1) this.state.start = +data;else if (inlet === 2) this.state.end = +data;else if (inlet === 3) this.state.step = +data;
    });
  }

}

_defineProperty(For, "description", "Number iterator");

_defineProperty(For, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Do iterations"
}, {
  isHot: false,
  type: "number",
  description: "Set the starting point"
}, {
  isHot: false,
  type: "number",
  description: "Set the end point (excluded)"
}, {
  isHot: false,
  type: "number",
  description: "Set the step"
}]);

_defineProperty(For, "outlets", [{
  type: "bang",
  description: "Bang when finished"
}, {
  type: "number",
  description: "Output all iterations one by one"
}]);

_defineProperty(For, "args", [{
  type: "number",
  optional: false,
  description: "The starting point"
}, {
  type: "number",
  optional: false,
  description: "The end point (excluded)"
}, {
  type: "number",
  optional: true,
  default: 1,
  description: "The step"
}]);

class ForIn extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      buffer: null
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 3;
    });
    this.on("updateArgs", args => this.state.buffer = args[0]);
    this.on("inlet", (_ref4) => {
      let {
        data,
        inlet
      } = _ref4;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.state.buffer = data;

        for (const key in this.state.buffer) {
          this.outletAll([, key, this.state.buffer[key]]);
        }

        this.outlet(0, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang());
      } else if (inlet === 1) {
        this.state.buffer = data;
      }
    });
  }

}

_defineProperty(ForIn, "description", "Object key-value iterator");

_defineProperty(ForIn, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Iterate input, bang to redo"
}, {
  isHot: false,
  type: "object",
  description: "Set the iteration object"
}]);

_defineProperty(ForIn, "outlets", [{
  type: "bang",
  description: "Bang when finished"
}, {
  type: "anything",
  description: "Key"
}, {
  type: "anything",
  description: "Value"
}]);

_defineProperty(ForIn, "args", [{
  type: "object",
  optional: true,
  description: "Initial object to iterate"
}]);

class gate extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      pass: true
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", args => {
      this.state.pass = args[0] === "undefined" || args[0] === "" || !!args[0];
    });
    this.on("inlet", (_ref5) => {
      let {
        data,
        inlet
      } = _ref5;

      if (inlet === 0) {
        if (this.state.pass) this.outlet(0, data);
      } else if (inlet === 1) {
        this.state.pass = !!data;
      }
    });
  }

}

_defineProperty(gate, "description", "Bypass or block incoming data");

_defineProperty(gate, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Anything to bypass"
}, {
  isHot: false,
  type: "anything",
  description: "Test, falsable to block"
}]);

_defineProperty(gate, "outlets", [{
  type: "anything",
  description: "Anything bypass"
}]);

_defineProperty(gate, "args", [{
  type: "anything",
  optional: true,
  default: true,
  description: "default state"
}]);

class set extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      key: undefined,
      value: undefined
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 1;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] === "string" || typeof args[0] === "number") this.state.key = args[0];
      if (typeof args[1] !== "undefined") this.state.value = args[1];
    });
    this.on("inlet", (_ref6) => {
      let {
        data,
        inlet
      } = _ref6;

      if (inlet === 0) {
        if (typeof this.state.key === "string" || typeof this.state.key === "number") {
          try {
            data[this.state.key] = this.state.value;
            this.outlet(0, data);
          } catch (e) {
            this.error(e.message);
          }
        } else {
          this.error("Key not defined");
        }
      } else if (inlet === 1) {
        if (typeof data === "string" || typeof data === "number") this.state.key = data;else this.error("Key should be a number or a string");
      } else if (inlet === 2) {
        this.state.value = data;
      }
    });
  }

}

_defineProperty(set, "description", "Set a property of incoming object");

_defineProperty(set, "inlets", [{
  isHot: true,
  type: "object",
  description: "Object to set a property"
}, {
  isHot: false,
  type: "string",
  description: "Key / name of the property"
}, {
  isHot: false,
  type: "anything",
  description: "Value to set to the property"
}]);

_defineProperty(set, "outlets", [{
  type: "anything",
  description: "Object bypass"
}]);

_defineProperty(set, "args", [{
  type: "anything",
  optional: false,
  description: "Initial key of the property"
}, {
  type: "anything",
  optional: true,
  default: undefined,
  description: "Initial value of the property"
}]);

class get extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      keys: []
    });

    _defineProperty(this, "resetIO", () => {
      const {
        args
      } = this.box;
      this.state.keys = args.slice();
      this.inlets = 1 + args.length;
      this.outlets = args.length;
    });
  }

  subscribe() {
    super.subscribe();
    this.on("postInit", this.resetIO);
    this.on("updateArgs", this.resetIO);
    this.on("inlet", (_ref7) => {
      let {
        data,
        inlet
      } = _ref7;

      if (inlet === 0) {
        for (let i = this.state.keys.length - 1; i >= 0; i--) {
          const key = this.state.keys[i];

          if (typeof key === "string" || typeof key === "number") {
            try {
              this.outlet(i, data[key]);
            } catch (e) {
              this.error(e.message);
            }
          }
        }
      } else {
        if (typeof data === "string" || typeof data === "number") this.state.keys[inlet - 1] = data;else this.error("Key should be a number or a string");
      }
    });
  }

}

_defineProperty(get, "description", "Get properties of incoming object");

_defineProperty(get, "inlets", [{
  isHot: true,
  type: "object",
  description: "Object to get a property"
}, {
  isHot: false,
  type: "string",
  varLength: true,
  description: "Key / name of the property"
}]);

_defineProperty(get, "outlets", [{
  type: "anything",
  varLength: true,
  description: "Value got"
}]);

_defineProperty(get, "args", [{
  type: "anything",
  optional: false,
  varLength: true,
  description: "Initial key of the property"
}]);

class If extends StdObject {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });
    this.on("inlet", (_ref8) => {
      let {
        data,
        inlet
      } = _ref8;
      if (inlet === 0) this.outlet(+!data, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang());
    });
  }

}

_defineProperty(If, "description", "Output a bang on true / false");

_defineProperty(If, "inlets", [{
  isHot: true,
  type: "boolean",
  description: "True for a bang to left outlet, false for right"
}]);

_defineProperty(If, "outlets", [{
  type: "bang",
  description: "True?"
}, {
  type: "bang",
  description: "False?"
}]);

class sel extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      array: []
    });

    _defineProperty(this, "resetIO", () => {
      const {
        args
      } = this.box;
      const testsCount = args.length;
      const [inletMeta0, inletMeta1] = sel.meta.inlets;
      const [outletMeta0, outletMeta1] = sel.meta.inlets;
      const {
        meta
      } = this;
      meta.inlets = [inletMeta0];
      meta.outlets = [];

      for (let i = 0; i < testsCount; i++) {
        meta.outlets[i] = _objectSpread({}, outletMeta0);
        meta.outlets[i].description += " index ".concat(i);
        meta.inlets[i + 1] = _objectSpread({}, inletMeta1);
        meta.inlets[i + 1].description += " index ".concat(i);
      }

      meta.outlets[testsCount] = outletMeta1;
      this.meta = meta;
      this.state.array = args.slice();
      this.inlets = 1 + testsCount;
      this.outlets = testsCount + 1;
    });
  }

  subscribe() {
    super.subscribe();
    this.on("postInit", this.resetIO);
    this.on("updateArgs", this.resetIO);
    this.on("inlet", (_ref9) => {
      let {
        data,
        inlet
      } = _ref9;

      if (inlet === 0) {
        const foundIndex = this.state.array.indexOf(data);
        if (foundIndex === -1) this.outlet(this.outlets - 1, data);else this.outlet(foundIndex, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang());
      } else {
        this.state.array[inlet - 1] = data;
      }
    });
  }

}

_defineProperty(sel, "description", "Output a bang on a matched inlet");

_defineProperty(sel, "inlets", [{
  isHot: true,
  type: "anything",
  varLength: false,
  description: "Test for match"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Set value for match"
}]);

_defineProperty(sel, "outlets", [{
  type: "bang",
  varLength: false,
  description: "Bang if match"
}, {
  type: "anything",
  varLength: false,
  description: "Bypass if not matched"
}]);

_defineProperty(sel, "args", [{
  type: "anything",
  optional: false,
  varLength: true,
  description: "Initial value for match"
}]);

class v extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      key: this.box.args[0].toString(),
      value: _utils_symbols__WEBPACK_IMPORTED_MODULE_2__.SharedDataNoValue,
      sharedItem: null
    });
  }

  subscribe() {
    super.subscribe();

    const handleFilePathChanged = () => {
      var _this$state$sharedIte;

      this.setState({
        key: (_this$state$sharedIte = this.state.sharedItem) === null || _this$state$sharedIte === void 0 ? void 0 : _this$state$sharedIte.projectPath
      });
    };

    const handleSaved = e => {
      var _this$state$sharedIte2;

      if (e === this) return;
      this.setState({
        value: (_this$state$sharedIte2 = this.state.sharedItem) === null || _this$state$sharedIte2 === void 0 ? void 0 : _this$state$sharedIte2.data
      });
    };

    const subsribeItem = () => {
      const file = this.state.sharedItem;
      if (!file) return;
      file.addObserver(this);
      file.on("destroyed", reload);
      file.on("nameChanged", handleFilePathChanged);
      file.on("pathChanged", handleFilePathChanged);
      file.on("saved", handleSaved);
    };

    const unsubsribeItem = () => {
      var _this$state$sharedIte3;

      const file = this.state.sharedItem;
      if (!file) return;
      file.off("destroyed", reload);
      file.off("nameChanged", handleFilePathChanged);
      file.off("pathChanged", handleFilePathChanged);
      file.off("saved", handleSaved);
      (_this$state$sharedIte3 = this.state.sharedItem) === null || _this$state$sharedIte3 === void 0 ? void 0 : _this$state$sharedIte3.removeObserver(this);
    };

    const reload = async () => {
      unsubsribeItem();
      const {
        key
      } = this.state;
      const {
        item
      } = await this.getSharedItem(key, "unknown", () => this.state.value);
      this.setState({
        value: item.data,
        sharedItem: item
      });
      subsribeItem();
    };

    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 1;
    });
    this.on("updateArgs", async args => {
      const key = typeof args[0] === "undefined" ? args[0] : args[0].toString();

      if (key !== this.state.key) {
        this.setState({
          key
        });
        await reload();
      } else {
        if (typeof args[1] !== "undefined") {
          var _this$state$sharedIte4, _this$state$sharedIte5;

          this.setState({
            value: args[1]
          });
          (_this$state$sharedIte4 = this.state.sharedItem) === null || _this$state$sharedIte4 === void 0 ? void 0 : (_this$state$sharedIte5 = _this$state$sharedIte4.save) === null || _this$state$sharedIte5 === void 0 ? void 0 : _this$state$sharedIte5.call(_this$state$sharedIte4, this.state.value, this);
        }
      }
    });
    this.on("postInit", reload);
    this.on("inlet", (_ref10) => {
      let {
        data,
        inlet
      } = _ref10;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) {
          var _this$state$sharedIte6, _this$state$sharedIte7;

          this.setState({
            value: data
          });
          (_this$state$sharedIte6 = this.state.sharedItem) === null || _this$state$sharedIte6 === void 0 ? void 0 : (_this$state$sharedIte7 = _this$state$sharedIte6.save) === null || _this$state$sharedIte7 === void 0 ? void 0 : _this$state$sharedIte7.call(_this$state$sharedIte6, this.state.value, this);
        }

        this.outlet(0, this.state.value);
      } else if (inlet === 1) {
        var _this$state$sharedIte8, _this$state$sharedIte9;

        this.setState({
          value: data
        });
        (_this$state$sharedIte8 = this.state.sharedItem) === null || _this$state$sharedIte8 === void 0 ? void 0 : (_this$state$sharedIte9 = _this$state$sharedIte8.save) === null || _this$state$sharedIte9 === void 0 ? void 0 : _this$state$sharedIte9.call(_this$state$sharedIte8, this.state.value, this);
      } else if (inlet === 2) {
        if (typeof data === "string" || typeof data === "number") {
          const key = data.toString() || "";

          if (key !== this.state.key) {
            this.setState({
              key
            });
            reload();
          }
        }
      }
    });
    this.on("destroy", () => {
      unsubsribeItem();
    });
  }

}

_defineProperty(v, "description", "Store anything as named sharable variable");

_defineProperty(v, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Bang to output stored value, anything to set the value then output it."
}, {
  isHot: false,
  type: "anything",
  description: "Anything to set the value."
}, {
  isHot: false,
  type: "anything",
  description: "Set variable name."
}]);

_defineProperty(v, "outlets", [{
  type: "anything",
  description: "Value"
}]);

_defineProperty(v, "args", [{
  type: "anything",
  optional: true,
  description: "Variable name"
}, {
  type: "anything",
  optional: true,
  description: "Initial value"
}]);

class lambda extends StdObject {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "state", {
      argsCount: 0,
      result: undefined
    });

    _defineProperty(this, "lambda", function () {
      _this.state.result = undefined;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (_this.state.argsCount === 0) {
        _this.outletAll([, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang(), args]);
      } else {
        _this.outletAll([, new _Base__WEBPACK_IMPORTED_MODULE_1__.Bang(), ...args]);
      }

      return _this.state.result; // After outlet, result will be received.
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 3;
    });
    this.on("updateArgs", () => {
      const {
        args
      } = this.box;

      if (typeof args[0] === "number" && args[0] >= 0) {
        this.state.argsCount = ~~args[0];
        this.outlets = 2 + this.state.argsCount;
      }
    });
    this.on("inlet", (_ref11) => {
      let {
        data,
        inlet
      } = _ref11;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(0, this.lambda);
      } else if (inlet === 1) this.state.result = data;
    });
  }

}

_defineProperty(lambda, "description", "Generate anonymous function, output args when called");

_defineProperty(lambda, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Output anonymous function"
}, {
  isHot: false,
  type: "anything",
  description: "Result of the anonymous function"
}]);

_defineProperty(lambda, "outlets", [{
  type: "function",
  description: "Anonymous function"
}, {
  type: "bang",
  description: "bang while lambda is called"
}, {
  type: "anything",
  varLength: true,
  description: "If args=0, outlet args as array, else argument of current index"
}]);

_defineProperty(lambda, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Arguments count"
}]);

class delay extends StdObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      time: 0,
      ref: new Set()
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", () => {
      const {
        args
      } = this.box;
      if (typeof args[0] === "number") this.state.time = +args[0];
    });
    this.on("inlet", (_ref12) => {
      let {
        data,
        inlet
      } = _ref12;

      if (inlet === 0) {
        this.state.ref.add(window.setTimeout(() => this.outlet(0, data), this.state.time || 0));
      } else if (inlet === 1) {
        this.state.time = +data;
      }
    });
    this.on("destroy", () => {
      this.state.ref.forEach(ref => window.clearTimeout(ref));
    });
  }

}

_defineProperty(delay, "description", "Delay an input");

_defineProperty(delay, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Input to be delayed"
}, {
  isHot: false,
  type: "number",
  description: "Delay time in seconds"
}]);

_defineProperty(delay, "outlets", [{
  type: "anything",
  description: "Delayed input"
}]);

_defineProperty(delay, "args", [{
  type: "number",
  optional: true,
  default: 0,
  description: "Default delay time"
}]);

class call extends _Base__WEBPACK_IMPORTED_MODULE_1__.DefaultObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      instance: undefined,
      inputs: [],
      result: null
    });

    _defineProperty(this, "initialInlets", 1);

    _defineProperty(this, "initialOutlets", 2);

    _defineProperty(this, "callback", () => this.outletAll([this.state.result, this.state.instance, ...this.state.inputs]));
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = this.initialInlets;
      this.outlets = this.initialOutlets;
    });
    this.on("updateArgs", args => {
      this.state.inputs = args.slice(1);
      const argsCount = Math.max(args.length - 1, ~~+this.getProp("args"));
      this.inlets = Math.max(1, this.initialInlets + argsCount);
      this.outlets = this.initialOutlets + argsCount;
    });
    this.on("updateProps", props => {
      if (props.args && typeof props.args === "number" && props.args >= 0) {
        const argsCount = Math.max(this.box.args.length - 1, ~~props.args);
        this.inlets = Math.max(1, this.initialInlets + argsCount);
        this.outlets = this.initialOutlets + argsCount;
      }
    });
    this.on("inlet", (_ref13) => {
      let {
        data,
        inlet
      } = _ref13;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.state.instance = data;
        if (this.execute()) this.output();
      } else {
        this.state.inputs[inlet - 1] = data;
      }
    });
  }

  execute() {
    const m = this.box.args[0];

    try {
      this.state.result = this.state.instance[m](...this.state.inputs);
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

  output() {
    if (this.state.result instanceof Promise && !this.getProp("sync")) {
      this.loading = true;
      this.state.result.then(r => {
        this.loading = false;
        this.state.result = r;
        this.callback();
      }, r => {
        this.loading = false;
        this.error(r);
      });
      return this;
    }

    return this.callback();
  }

  set loading(loading) {
    this.updateUI({
      loading
    });
  }

}

_defineProperty(call, "description", "Call a method of current object");

_defineProperty(call, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Instance to read"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Method argument"
}]);

_defineProperty(call, "outlets", [{
  type: "anything",
  description: "Method return value"
}, {
  type: "anything",
  description: "Instance bypass"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after method called"
}]);

_defineProperty(call, "args", [{
  type: "string",
  optional: false,
  description: "Method name"
}, {
  type: "anything",
  optional: true,
  varLength: true,
  description: "Set arguments while loaded"
}]);

_defineProperty(call, "props", {
  args: {
    type: "number",
    default: 0,
    description: "arguments count for method"
  },
  sync: {
    type: "boolean",
    default: false,
    description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
  }
});

class thispatcher extends StdObject {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("inlet", (_ref14) => {
      let {
        data,
        inlet
      } = _ref14;

      if (inlet === 0) {
        this.outlet(0, this.patcher);
      }
    });
  }

}

_defineProperty(thispatcher, "description", "Current patcher instance");

_defineProperty(thispatcher, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Bang to output patcher instance"
}]);

_defineProperty(thispatcher, "outlets", [{
  type: "object",
  description: "Patcher instance"
}]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  print,
  for: For,
  "for-in": ForIn,
  if: If,
  gate,
  sel,
  set,
  get,
  call,
  v,
  lambda,
  bang,
  loadbang,
  unloadbang,
  delay,
  thispatcher
});

/***/ })

}]);
//# sourceMappingURL=4b0795c5fc59c89dd748.js.map