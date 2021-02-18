(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_guido_view_tsx"],{

/***/ "./src/core/objects/guido/view.tsx":
/*!*****************************************!*\
  !*** ./src/core/objects/guido/view.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ GuidoView
/* harmony export */ });
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _UI_Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../UI/Base */ "./src/core/objects/UI/Base.ts");
var _temp;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class GuidoView extends _UI_Base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      gmn: undefined,
      svgs: [],
      container: undefined,
      parser: undefined,
      ar: undefined,
      gr: undefined
    });
  }

  subscribe() {
    super.subscribe();

    const processAR = async () => {
      const guido = this.patcher.env.guidoWorker;
      const {
        parser,
        gmn
      } = this.state;
      const ar = await guido.string2AR(parser, gmn);
      if (this.state.ar) await guido.freeAR(this.state.ar);
      this.setState({
        ar
      });
    };

    const processGR = async () => {
      const guido = this.patcher.env.guidoWorker;
      const {
        parser,
        ar
      } = this.state;

      if (ar) {
        const {
          systemsDistance,
          systemsDistribution,
          systemsDistribLimit,
          force,
          spring,
          neighborhoodSpacing,
          optimalPageFill,
          resizePage2Music,
          proportionalRenderingForceMultiplicator,
          checkLyricsCollisions
        } = this.props;
        const settings = {
          systemsDistance,
          systemsDistribution,
          systemsDistribLimit,
          force,
          spring,
          neighborhoodSpacing,
          optimalPageFill,
          resizePage2Music,
          proportionalRenderingForceMultiplicator,
          checkLyricsCollisions
        };
        const gr = await guido.ar2grSettings(ar, settings);
        if (this.state.gr) await guido.freeGR(this.state.gr);
        this.setState({
          gr
        });
      } else {
        const error = await guido.parserGetErrorCode(parser);
        throw error;
      }
    };

    const processSVG = async () => {
      const guido = this.patcher.env.guidoWorker;
      const {
        gr
      } = this.state;

      if (gr) {
        const pagesCount = await guido.getPageCount(gr);
        const svgs = await Promise.all(new Array(pagesCount).fill(null).map((v, i) => guido.gr2SVGColored(gr, i + 1, 0, 0, 0, false)));
        this.setState({
          svgs
        });
        const template = document.createElement("template");
        const container = document.createElement("div");
        template.appendChild(container);

        for (const svg of svgs) {
          const svgContainer = document.createElement("div");
          svgContainer.innerHTML = svg;
          container.appendChild(svgContainer);
        }

        this.setState({
          container
        });
        this.updateUI({
          children: [container]
        });
        this.outlet(0, svgs);
      }
    };

    const process = async () => {
      try {
        await processAR();
        await processGR();
        await processSVG();
      } catch (error) {
        this.error(error);
      }
    };

    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });
    this.on("postInit", async () => {
      const parser = await this.patcher.env.guidoWorker.openParser();
      this.setState({
        parser
      });
    });
    this.on("inlet", (_ref) => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (typeof data === "string") {
          this.setState({
            gmn: data
          });
          process();
        }
      }
    });
    this.on("updateProps", async () => {
      if (!this.state.gmn) return;

      try {
        await processGR();
        await processSVG();
      } catch (error) {
        this.error(error);
      }
    });
    this.on("destroy", async () => {
      const guido = this.patcher.env.guidoWorker;
      const {
        ar,
        gr,
        parser
      } = this.state;
      if (ar) await guido.freeAR(ar);
      if (gr) await guido.freeGR(gr);
      if (parser) await guido.closeParser(parser);
    });
  }

}

_defineProperty(GuidoView, "package", "Guido");

_defineProperty(GuidoView, "description", "Get Guido Graphic Representation from code");

_defineProperty(GuidoView, "inlets", [{
  isHot: true,
  type: "string",
  description: "Guido code to compile and display"
}]);

_defineProperty(GuidoView, "outlets", [{
  type: "object",
  description: "SVG codes"
}]);

_defineProperty(GuidoView, "props", {
  systemsDistance: {
    type: "number",
    default: 75,
    description: "System distance"
  },
  systemsDistribution: {
    type: "number",
    default: 0,
    description: "0 = auto, 1 = always, 2 = never"
  },
  systemsDistribLimit: {
    type: "number",
    default: 25,
    description: "Maximum distance"
  },
  force: {
    type: "number",
    default: 750,
    description: "Force"
  },
  spring: {
    type: "number",
    default: 110,
    description: "Spring"
  },
  neighborhoodSpacing: {
    type: "number",
    default: 0,
    description: "Neighborhood spacing, 0 / 1"
  },
  optimalPageFill: {
    type: "number",
    default: 0,
    description: "Optimum page fill, 0 / 1"
  },
  resizePage2Music: {
    type: "number",
    default: 1,
    description: "Resize page to music, 0 / 1"
  },
  proportionalRenderingForceMultiplicator: {
    type: "number",
    default: 0,
    description: "Proportional Rendering Force Multiplicator"
  },
  checkLyricsCollisions: {
    type: "number",
    default: 0,
    description: "Check lyrics collisions"
  }
});

_defineProperty(GuidoView, "UI", (_temp = class extends _BaseUI__WEBPACK_IMPORTED_MODULE_0__.DOMUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      children: this.props.object.state.container ? [this.props.object.state.container] : []
    }));
  }

}, _temp));

/***/ })

}]);
//# sourceMappingURL=1fcb895f339cb7a4a5ef.js.map