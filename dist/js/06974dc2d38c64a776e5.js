(window["webpackJsonpJSPatcher"] = window["webpackJsonpJSPatcher"] || []).push([[18],{

/***/ "./src/core/objects/importer/New.tsx":
/*!*******************************************!*\
  !*** ./src/core/objects/importer/New.tsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return New; });
/* harmony import */ var _StaticMethod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StaticMethod */ "./src/core/objects/importer/StaticMethod.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _ImportedObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ImportedObject */ "./src/core/objects/importer/ImportedObject.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class NewUI extends _ImportedObject__WEBPACK_IMPORTED_MODULE_2__["ImportedObjectUI"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "prependColor", "rgb(78, 201, 176)");
  }

}

class New extends _Base__WEBPACK_IMPORTED_MODULE_1__["DefaultObject"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      Wrapper: null,
      inputs: [],
      result: null
    });

    _defineProperty(this, "callback", () => this.outletAll([this.state.result, ...this.state.inputs]));
  }

  subscribe() {
    super.subscribe();
    this.on("postInit", () => {
      const Fn = this.imported;
      const argsCount = Math.max(Fn.length, this.box.args.length - 1, ~~+this.getProp("args"));
      this.inlets = Math.max(1, argsCount);
      this.outlets = 1 + this.inlets;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] !== "undefined") {
        const Wrapper = this.patcher.activeLib[args[0]];
        if (!Wrapper) this.error("Function ".concat(args[0], " not found."));else if (Wrapper.prototype instanceof _StaticMethod__WEBPACK_IMPORTED_MODULE_0__["StaticMethod"]) {
          this.state.Wrapper = Wrapper;
          const Fn = this.imported;
          const argsCount = Math.max(Fn.length, args.length - 1, ~~+this.getProp("args"));
          this.inlets = Math.max(1, argsCount);
          this.outlets = 1 + this.inlets;
        } else {
          this.error("Given function is not constructable");
        }
      } else {
        this.error("A constructor is needed.");
      }

      this.state.inputs = args.slice(1);
    });
    this.on("updateProps", props => {
      if (props.args && typeof props.args === "number" && props.args >= 0) {
        const Fn = this.imported;
        const argsCount = Math.max(Fn.length, this.box.args.length - 1, ~~+props.args);
        this.inlets = Math.max(1, argsCount);
        this.outlets = 1 + this.inlets;
      }
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(data instanceof _Base__WEBPACK_IMPORTED_MODULE_1__["Bang"])) this.state.inputs[inlet] = data;
        if (this.execute()) this.output();
      } else {
        this.state.inputs[inlet] = data;
      }
    });
  }

  execute() {
    const Fn = this.imported;

    try {
      this.state.result = new Fn(...this.state.inputs);
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

  output() {
    return this.callback();
  }

  set loading(loading) {
    this.updateUI({
      loading
    });
  }

  get name() {
    const c = this.state.Wrapper;
    return c.path[c.path.length - 1];
  }

  get imported() {
    const c = this.state.Wrapper || this.patcher.activeLib.Object;
    let r;

    try {
      r = c.path.reduce((acc, cur) => acc[cur], c.root);
    } catch (e) {
      this.error(e);
    }

    return r;
  }

  set imported(v) {
    const c = this.constructor;
    let parent = c.root;

    try {
      if (!c.path.length) {
        c.root = v;
      } else {
        c.path.slice(0, -1).forEach(key => parent = parent[key]);
        parent[c.path[c.path.length - 1]] = v;
      }
    } catch (e) {
      this.error(e);
    }
  }

}

_defineProperty(New, "description", "Call function as a constructor");

_defineProperty(New, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Constructor argument, output instance constructed"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Constructor argument"
}]);

_defineProperty(New, "outlets", [{
  type: "anything",
  description: "Instance constructed"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after constructor called"
}]);

_defineProperty(New, "args", [{
  type: "string",
  optional: false,
  varLength: false,
  description: "Constructor name"
}, {
  type: "anything",
  optional: true,
  varLength: true,
  description: "Set arguments while loaded"
}]);

_defineProperty(New, "props", {
  args: {
    type: "number",
    default: 0,
    description: "arguments count for method"
  }
});

_defineProperty(New, "ui", NewUI);

/***/ })

}]);
//# sourceMappingURL=06974dc2d38c64a776e5.js.map