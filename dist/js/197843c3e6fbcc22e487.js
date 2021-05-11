(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_Op_tsx"],{

/***/ "./src/core/objects/Op.tsx":
/*!*********************************!*\
  !*** ./src/core/objects/Op.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class JSOp extends _Base__WEBPACK_IMPORTED_MODULE_0__.DefaultObject {}

_defineProperty(JSOp, "package", "Op");

class JSUnaryOp extends JSOp {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      result: null
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("update", () => this.state.result = 0);
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            this.state.result = this.constructor.execute(data);
          } catch (e) {
            this.error(e);
            return;
          }
        }

        this.outlet(0, this.state.result);
      }
    });
  }

}

_defineProperty(JSUnaryOp, "description", "Unary Operation");

_defineProperty(JSUnaryOp, "inlets", [{
  isHot: true,
  type: "anything",
  description: "First element"
}]);

_defineProperty(JSUnaryOp, "outlets", [{
  type: "anything",
  description: "Result"
}]);

_defineProperty(JSUnaryOp, "execute", void 0);

class JSBinaryOp extends JSOp {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      arg: 0,
      result: 0
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("updateArgs", args => {
      this.state.arg = 0;
      this.state.result = 0;
      if (!args || args.length === 0) return;
      this.state.arg = args[0];
    });
    this.on("inlet", _ref2 => {
      let {
        data,
        inlet
      } = _ref2;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            this.state.result = this.constructor.execute(data, this.state.arg);
          } catch (e) {
            this.error(e);
            return;
          }
        }

        this.outlet(0, this.state.result);
      } else if (inlet === 1) {
        this.state.arg = data;
      }
    });
  }

}

_defineProperty(JSBinaryOp, "description", "Binary Operation");

_defineProperty(JSBinaryOp, "inlets", [{
  isHot: true,
  type: "anything",
  description: "First element"
}, {
  isHot: false,
  type: "anything",
  description: "Second element"
}]);

_defineProperty(JSBinaryOp, "outlets", [{
  type: "anything",
  description: "Result"
}]);

_defineProperty(JSBinaryOp, "args", [{
  type: "anything",
  optional: true,
  default: 0,
  description: "Initial second element"
}]);

_defineProperty(JSBinaryOp, "execute", void 0);

class JSTernaryOp extends JSOp {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      args: [true, false],
      result: true
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 3;
      this.outlets = 1;
    });
    this.on("updateArgs", args => {
      this.state.args = [true, false];
      this.state.result = true;
      if (!args || args.length === 0) return;
      this.state.args[0] = args[0];
      this.state.args[1] = args[1];
    });
    this.on("inlet", _ref3 => {
      let {
        data,
        inlet
      } = _ref3;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_0__.isBang)(data)) {
          try {
            this.state.result = data ? this.state.args[0] : this.state.args[1];
          } catch (e) {
            this.error(e);
            return;
          }
        }

        this.outlet(0, this.state.result);
      } else if (inlet === 1) {
        this.state.args[0] = data;
      } else if (inlet === 2) {
        this.state.args[1] = data;
      }
    });
  }

}

_defineProperty(JSTernaryOp, "description", "Ternary Operation");

_defineProperty(JSTernaryOp, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Test"
}, {
  isHot: false,
  type: "anything",
  description: "True output"
}, {
  isHot: false,
  type: "anything",
  description: "False output"
}]);

_defineProperty(JSTernaryOp, "outlets", [{
  type: "anything",
  description: "Result"
}]);

_defineProperty(JSTernaryOp, "args", [{
  type: "anything",
  optional: true,
  default: true,
  description: "Initial true output"
}, {
  type: "anything",
  optional: true,
  default: false,
  description: "Initial false output"
}]);

const functions = {
  Add: (a, b) => a + b,
  Sub: (a, b) => a - b,
  $Sub: (a, b) => b - a,
  Mul: (a, b) => a * b,
  Div: (a, b) => a / b,
  $Div: (a, b) => b / a,
  Exp: (a, b) => a ** b,
  $Exp: (a, b) => b ** a,
  Mod: (a, b) => a % b,
  $Mod: (a, b) => b % a,
  Inc: a => ++a,
  // eslint-disable-line no-param-reassign
  Dec: a => --a,
  // eslint-disable-line no-param-reassign
  Eql: (a, b) => a == b,
  // eslint-disable-line eqeqeq
  EqlS: (a, b) => a === b,
  NEql: (a, b) => a != b,
  // eslint-disable-line eqeqeq
  NEqlS: (a, b) => a !== b,
  Gtr: (a, b) => a > b,
  Geq: (a, b) => a >= b,
  Lss: (a, b) => a < b,
  Leq: (a, b) => a <= b,
  And: (a, b) => a && b,
  Or: (a, b) => a || b,
  Not: a => !a,
  BAnd: (a, b) => a & b,
  BOr: (a, b) => a | b,
  BXor: (a, b) => a ^ b,
  BNot: a => ~a,
  BLS: (a, b) => a << b,
  BRS: (a, b) => a >> b,
  BRSZ: (a, b) => a >>> b,
  Typeof: a => typeof a,
  Instanceof: (a, b) => a instanceof b,
  void: a => void a,
  // eslint-disable-line no-void
  in: (a, b) => a in b
};
const Ops = {};

for (const key in functions) {
  const f = functions[key];

  if (f.length === 1) {
    var _class, _temp;

    Ops[key] = (_temp = _class = class extends JSUnaryOp {
      static get _name() {
        return key;
      }

    }, _defineProperty(_class, "execute", f), _temp);
  } else if (f.length === 2) {
    var _class2, _temp2;

    Ops[key] = (_temp2 = _class2 = class extends JSBinaryOp {
      static get _name() {
        return key;
      }

    }, _defineProperty(_class2, "execute", f), _temp2);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  typeof: Ops.Typeof,
  instanceof: Ops.Instanceof,
  void: Ops.void,
  in: Ops.in,
  "+": Ops.Add,
  "-": Ops.Sub,
  "!-": Ops.$Sub,
  "*": Ops.Mul,
  "/": Ops.Div,
  "!/": Ops.$Div,
  "**": Ops.Exp,
  "!**": Ops.$Exp,
  "%": Ops.Mod,
  "!%": Ops.Mod,
  "++": Ops.Inc,
  "--": Ops.Dec,
  "==": Ops.Eql,
  "===": Ops.EqlS,
  "!=": Ops.NEql,
  "!==": Ops.NEqlS,
  ">": Ops.Gtr,
  ">=": Ops.Geq,
  "<": Ops.Lss,
  "<=": Ops.Leq,
  "&&": Ops.And,
  "||": Ops.Or,
  "!": Ops.Not,
  "&": Ops.BAnd,
  "|": Ops.BOr,
  "^": Ops.BXor,
  "~": Ops.BNot,
  "<<": Ops.BLS,
  ">>": Ops.BRS,
  ">>>": Ops.BRSZ,
  "?": JSTernaryOp
});

/***/ })

}]);
//# sourceMappingURL=197843c3e6fbcc22e487.js.map