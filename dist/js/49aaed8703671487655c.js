(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_importer_Func_tsx"],{

/***/ "./src/core/objects/importer/Func.tsx":
/*!********************************************!*\
  !*** ./src/core/objects/importer/Func.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Func)
/* harmony export */ });
/* harmony import */ var _StaticMethod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StaticMethod */ "./src/core/objects/importer/StaticMethod.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _ImportedObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ImportedObject */ "./src/core/objects/importer/ImportedObject.tsx");
/* harmony import */ var _Method__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Method */ "./src/core/objects/importer/Method.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class FuncUI extends _ImportedObject__WEBPACK_IMPORTED_MODULE_2__.ImportedObjectUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "prependColor", "rgb(78, 201, 176)");
  }

}

class Func extends _Base__WEBPACK_IMPORTED_MODULE_1__.DefaultObject {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      Wrapper: null
    });

    _defineProperty(this, "callback", () => this.outlet(0, this.imported));
  }

  subscribe() {
    super.subscribe();
    this.on("postInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("updateArgs", args => {
      if (typeof args[0] !== "undefined") {
        const Wrapper = this.patcher.activeLib[args[0]];
        if (!Wrapper) this.error("Function ".concat(args[0], " not found."));else if (Wrapper.prototype instanceof _StaticMethod__WEBPACK_IMPORTED_MODULE_0__.StaticMethod || Wrapper.prototype instanceof _Method__WEBPACK_IMPORTED_MODULE_3__.Method) {
          this.state.Wrapper = Wrapper;
        } else {
          this.error("Given identifier function is not a function");
        }
      } else {
        this.error("A function identifier is needed.");
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_Base__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.output();
      }
    });
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

_defineProperty(Func, "description", "Get the function itself");

_defineProperty(Func, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Bang to get the function itself"
}]);

_defineProperty(Func, "outlets", [{
  type: "function",
  description: "function"
}]);

_defineProperty(Func, "args", [{
  type: "string",
  optional: false,
  varLength: false,
  description: "Function name"
}]);

_defineProperty(Func, "UI", FuncUI);

/***/ })

}]);
//# sourceMappingURL=49aaed8703671487655c.js.map