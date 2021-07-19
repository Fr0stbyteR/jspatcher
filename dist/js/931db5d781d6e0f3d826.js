(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_objects_UI_exports_ts"],{

/***/ "./src/core/objects/UI/ButtonUI.tsx":
/*!******************************************!*\
  !*** ./src/core/objects/UI/ButtonUI.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ButtonUI)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/elements/Icon/Icon.js");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class ButtonUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_1__.BaseUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      loading: false,
      text: this.props.object.data.text
    }));

    _defineProperty(this, "refSpan", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef());

    _defineProperty(this, "handleChanged", text => {});

    _defineProperty(this, "handleMouseDown", e => this.props.editing ? e.stopPropagation() : null);

    _defineProperty(this, "handleClickSpan", e => this.props.editing ? e.stopPropagation() : null);

    _defineProperty(this, "handleClick", e => {});

    _defineProperty(this, "handleKeyDown", e => {
      // propagate for parent for focus on boxUI
      if (!this.props.editing) return;

      if (e.key === "Enter") {
        e.preventDefault();
        return;
      }

      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    });

    _defineProperty(this, "handlePaste", e => {
      if (!this.props.editing) return;
      e.preventDefault();
      document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    });
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.editing) this.toggleEdit(this.props.editing);
  }

  componentDidUpdate(prevProps) {
    if (this.props.editing !== prevProps.editing) this.toggleEdit(this.props.editing);
  }

  toggleEdit(toggle) {
    const {
      editor,
      box
    } = this;
    if (editor.state.locked) return;
    if (!this.refSpan.current) return;
    const span = this.refSpan.current;

    if (toggle) {
      editor.selectOnly(box.id);
      this.setState({
        text: span.textContent
      }, () => {
        span.focus();
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.selectElementRange)(span);
      });
    } else {
      window.getSelection().removeAllRanges();
      span.blur();
      this.setState({
        text: span.textContent
      });
      this.handleChanged(span.textContent);
    }
  }

  render() {
    const {
      object
    } = this;
    const classArray = ["box-ui-button", "ui", "button", "compact", "mini"];
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BaseUI__WEBPACK_IMPORTED_MODULE_1__.BaseUI, _extends({}, this.props, {
      additionalClassName: classArray.join(" "),
      containerProps: {
        onClick: this.handleClick
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      className: "box-ui-text-container"
    }, object.meta.icon ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_3__.default, {
      inverted: true,
      loading: this.state.loading,
      size: "small",
      name: this.state.loading ? "spinner" : object.meta.icon
    }) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
      contentEditable: this.props.editing,
      className: "editable" + (this.props.editing ? " editing" : ""),
      ref: this.refSpan,
      onMouseDown: this.handleMouseDown,
      onClick: this.handleClickSpan,
      onPaste: this.handlePaste,
      onKeyDown: this.handleKeyDown,
      onBlur: this.props.onEditEnd,
      suppressContentEditableWarning: true
    }, this.state.text)));
  }

}

/***/ }),

/***/ "./src/core/objects/UI/bpf.tsx":
/*!*************************************!*\
  !*** ./src/core/objects/UI/bpf.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BPFUI": () => (/* binding */ BPFUI),
/* harmony export */   "default": () => (/* binding */ bpf)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/UI/Base.ts");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







class BPFUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_3__.BaseUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      points: this.object.data.points,
      ghostPoint: undefined
    }));

    _defineProperty(this, "dragged", false);

    _defineProperty(this, "mouseDown", false);

    _defineProperty(this, "refG", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createRef());

    _defineProperty(this, "handleResized", () => {
      if (this.refG.current) {
        this.refG.current.style.transformOrigin = "0";
        requestAnimationFrame(() => this.refG.current.style.transformOrigin = "center");
      }
    });

    _defineProperty(this, "handleMouseMove", () => {
      this.setState({
        ghostPoint: undefined
      });
    });

    _defineProperty(this, "handleDoubleClick", e => {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
      this.dragged = false;
      const {
        points
      } = this.state;
      const svg = e.currentTarget;
      let {
        left,
        top,
        width,
        height
      } = svg.getBoundingClientRect();
      left += 0.025 * width;
      top += 0.025 * height;
      width *= 0.95;
      height *= 0.95;
      const normalizedX = (e.clientX - left) / width;
      const normalizedY = 1 - (e.clientY - top) / height;
      const [x, y] = this.denormalizePoint(normalizedX, normalizedY);
      const {
        index: $point,
        point
      } = this.getInsertPoint(x, y);
      points.splice($point, 0, point);
      this.setState({
        points: points.slice()
      });
      this.object.setData({
        points: this.state.points
      });
    });

    _defineProperty(this, "handleMouseMoveLine", e => {
      if (this.mouseDown) return;
      e.stopPropagation();
      const line = e.currentTarget;

      if (e.altKey) {
        line.style.cursor = "ns-resize";
        return;
      }

      line.style.cursor = "unset";
      const {
        domain
      } = this.state;
      const svg = line.parentElement.parentElement;
      let {
        left,
        width
      } = svg.getBoundingClientRect();
      left += 0.025 * width;
      width *= 0.95;
      const normalizedX = (e.clientX - left) / width;
      const {
        point
      } = this.getInsertPoint(normalizedX * domain);
      this.setState({
        ghostPoint: point
      });
    });

    _defineProperty(this, "handleMouseDownLine", e => {
      e.stopPropagation();
      this.dragged = false;
      this.mouseDown = true;
      const line = e.currentTarget;
      const {
        points,
        domain,
        range
      } = this.state;
      const svg = line.parentElement.parentElement;
      let {
        left,
        top,
        width,
        height
      } = svg.getBoundingClientRect();
      left += 0.025 * width;
      top += 0.025 * height;
      width *= 0.95;
      height *= 0.95;

      if (e.altKey) {
        const i = +line.getAttribute("values");
        const prev = points[i];
        const next = points[i + 1];
        const {
          clientY
        } = e;

        const handleMouseMove = e => {
          this.dragged = true;
          let [rangeMin, rangeMax] = range;
          if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];
          const rangeInterval = rangeMax - rangeMin;
          if (!rangeInterval) return;
          const delta = (e.clientY - clientY) / height * rangeInterval;
          points[i] = prev.slice();
          points[i][1] = Math.min(rangeMax, Math.max(rangeMin, prev[1] - delta));

          if (next) {
            points[i + 1] = next.slice();
            points[i + 1][1] = Math.min(rangeMax, Math.max(rangeMin, next[1] - delta));
          }

          this.setState({
            points: points.slice()
          });
          this.object.setData({
            points: this.state.points
          });
        };

        const handleMouseUp = () => {
          this.mouseDown = false;
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      } else {
        const normalizedX = (e.clientX - left) / width;
        const {
          index: $point,
          point
        } = this.getInsertPoint(normalizedX * domain);
        const limits = [points[$point - 1][0] / domain * width + left, points[$point] ? points[$point][0] / domain * width + left : left + width];
        points.splice($point, 0, point);
        this.setState({
          points: points.slice()
        });
        this.object.setData({
          points: this.state.points
        });

        const handleMouseMove = e => {
          this.dragged = true;
          const clientX = Math.max(limits[0], Math.min(limits[1], e.clientX));
          const clientY = Math.max(top, Math.min(top + height, e.clientY));
          const normalized = [(clientX - left) / width, 1 - (clientY - top) / height];
          const [x, y] = this.denormalizePoint(...normalized);
          const point = [x, y, 0];
          points[$point] = point;
          this.setState({
            points: points.slice()
          });
          this.object.setData({
            points: this.state.points
          });
        };

        const handleMouseUp = () => {
          this.mouseDown = false;
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    });

    _defineProperty(this, "handleMouseDownCircle", e => {
      e.stopPropagation();
      this.dragged = false;
      const {
        points,
        domain
      } = this.state;
      const circle = e.currentTarget;
      const svg = circle.parentElement.parentElement;
      let {
        left,
        top,
        width,
        height
      } = svg.getBoundingClientRect();
      left += 0.05 * width;
      top += 0.05 * height;
      width *= 0.9;
      height *= 0.9;
      const i = +circle.getAttribute("values");
      const limits = [points[i - 1] ? points[i - 1][0] / domain * width + left : left, points[i + 1] ? points[i + 1][0] / domain * width + left : left + width];
      const [x, y] = this.normalizePoint(points[i][0], points[i][1]);
      const circleX = left + x * width;
      const circleY = top + (1 - y) * height;

      const handleMouseMove = e => {
        this.dragged = true;
        const clientX = Math.max(limits[0], Math.min(limits[1], e.shiftKey || Math.abs(circleX - e.clientX) > 5 ? e.clientX : circleX));
        const clientY = Math.max(top, Math.min(top + height, e.shiftKey || Math.abs(circleY - e.clientY) > 5 ? e.clientY : circleY));
        const normalized = [(clientX - left) / width, 1 - (clientY - top) / height];
        const [x, y] = this.denormalizePoint(...normalized);
        const point = [x, y, 0];
        points[i] = point;
        this.setState({
          points: points.slice()
        });
        this.object.setData({
          points: this.state.points
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });

    _defineProperty(this, "handleDoubleClickCircle", e => {
      e.stopPropagation();
      if (this.dragged) return;
      const circle = e.currentTarget;
      const i = +circle.getAttribute("values");
      const {
        points
      } = this.state;
      points.splice(i, 1);
      this.setState({
        points: points.slice()
      });
      this.object.setData({
        points: this.state.points
      });
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.box.on("rectChanged", this.handleResized);
    this.box.on("presentationRectChanged", this.handleResized);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.box.off("rectChanged", this.handleResized);
    this.box.off("presentationRectChanged", this.handleResized);
  }

  getInsertPoint(x, yIn) {
    let e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    const {
      points
    } = this.state;
    let $point = 0;
    let prev = points[0];
    let next;

    while ($point < points.length) {
      next = points[$point];
      if (next[0] > x) break;
      prev = next;
      $point++;
    }

    if (prev === next) return {
      index: $point,
      point: [x, typeof yIn === "number" ? yIn : prev[1], e]
    };
    if (typeof yIn === "number") return {
      index: $point,
      point: [x, yIn, e]
    };
    const exponent = prev[2] || 0;
    const normalizedX = (x - prev[0]) / (next[0] - prev[0]);
    const normalizedY = (0,_utils_math__WEBPACK_IMPORTED_MODULE_5__.normExp)(normalizedX, exponent);
    const y = prev[1] + normalizedY * (next[1] - prev[1]);
    return {
      index: $point,
      point: [x, y, e]
    };
  }

  get normalizedPoints() {
    const {
      domain,
      range,
      points
    } = this.state;
    let [rangeMin, rangeMax] = range;
    if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];
    const rangeInterval = rangeMax - rangeMin;
    return points.map(point => [point[0] / domain, rangeInterval ? (point[1] - rangeMin) / rangeInterval : 0.5]);
  }

  normalizePoint(x, y) {
    const {
      domain,
      range
    } = this.state;
    let [rangeMin, rangeMax] = range;
    if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];
    const rangeInterval = rangeMax - rangeMin;
    return [x / domain, rangeInterval ? (y - rangeMin) / rangeInterval : 0.5];
  }

  denormalizePoint(x, y) {
    const {
      domain,
      range
    } = this.state;
    let [rangeMin, rangeMax] = range;
    if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];
    const rangeInterval = rangeMax - rangeMin;
    return [x * domain, y * rangeInterval + rangeMin];
  }

  get font() {
    const {
      fontFace,
      fontSize,
      fontFamily
    } = this.state;
    return "".concat(fontFace === "regular" ? "" : fontFace, " ").concat(fontSize, "px ").concat(fontFamily, ", sans-serif");
  }

  render() {
    const {
      normalizedPoints,
      font,
      state
    } = this;
    const {
      domain,
      points,
      textColor,
      ghostPoint,
      lineColor,
      pointColor,
      bgColor
    } = state;
    const circles = [];
    const lines = [];
    const linesEvents = [];
    const texts = [];
    let prevX;
    let prevY;

    for (let i = 0; i < normalizedPoints.length; i++) {
      const point = normalizedPoints[i];
      const x = point[0] * 100 + "%";
      const y = (1 - point[1]) * 100 + "%";
      const textAnchor = point[0] < 0.5 ? "start" : "end";
      const textX = point[0] * 100 + (point[0] < 0.5 ? 2 : -2) + "%";
      const textY = (1 - point[1]) * 100 + (point[1] < 0.5 ? -1 : 4) + "%";
      const textStyle = {
        userSelect: "none",
        WebkitUserSelect: "none",
        pointerEvents: "none",
        font,
        // stylelint-disable-line font-family-no-missing-generic-family-keyword
        fill: textColor
      };
      circles.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
        key: i,
        cx: x,
        cy: y,
        r: 4,
        values: "".concat(i),
        fill: pointColor,
        onMouseDown: this.handleMouseDownCircle,
        onDoubleClick: this.handleDoubleClickCircle
      }));
      texts.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("text", {
        textAnchor: textAnchor,
        key: "".concat(i, "_text"),
        x: textX,
        y: textY,
        style: textStyle
      }, "".concat((0,_utils_math__WEBPACK_IMPORTED_MODULE_5__.round)(points[i][0], 0.01), ", ").concat((0,_utils_math__WEBPACK_IMPORTED_MODULE_5__.round)(points[i][1], 0.01))));

      if (prevX && prevY) {
        lines.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("line", {
          key: "".concat(i - 1, "_line"),
          x1: prevX,
          y1: prevY,
          x2: x,
          y2: y,
          stroke: lineColor,
          strokeWidth: 2
        }));
        linesEvents.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("line", {
          key: "".concat(i - 1, "_events"),
          x1: prevX,
          y1: prevY,
          x2: x,
          y2: y,
          values: "".concat(i - 1),
          stroke: "transparent",
          strokeWidth: 10,
          onMouseDown: this.handleMouseDownLine,
          onMouseMove: this.handleMouseMoveLine
        }));
      }

      prevX = x;
      prevY = y;
    }

    let ghostCircle;

    if (ghostPoint) {
      const point = this.normalizePoint(ghostPoint[0], ghostPoint[1]);
      const x = point[0] * 100 + "%";
      const y = (1 - point[1]) * 100 + "%";
      ghostCircle = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("circle", {
        key: "ghostPoint",
        cx: x,
        cy: y,
        r: 4,
        fill: pointColor,
        style: {
          opacity: 0.25,
          pointerEvents: "none"
        }
      });
    }

    if (points.length && points[points.length - 1][0] !== domain) {
      const i = points.length - 1;
      lines.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("line", {
        key: "".concat(i, "_line"),
        x1: prevX,
        y1: prevY,
        x2: "100%",
        y2: prevY,
        stroke: lineColor,
        strokeWidth: 2
      }));
      linesEvents.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("line", {
        key: "".concat(i, "_events"),
        x1: prevX,
        y1: prevY,
        x2: "100%",
        y2: prevY,
        values: "".concat(i),
        stroke: "transparent",
        strokeWidth: 10,
        onMouseDown: this.handleMouseDownLine,
        onMouseMove: this.handleMouseMoveLine
      }));
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BaseUI__WEBPACK_IMPORTED_MODULE_3__.BaseUI, _extends({}, this.props, {
      containerProps: {
        style: {
          height: "100%",
          width: "100%"
        }
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", {
      width: "100%",
      height: "100%",
      style: {
        backgroundColor: bgColor
      },
      onMouseMove: this.handleMouseMove,
      onDoubleClick: this.handleDoubleClick
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("g", {
      ref: this.refG,
      transform: "scale(0.95, 0.95)",
      style: {
        transformOrigin: "center"
      }
    }, texts, ghostCircle, lines, linesEvents, circles)));
  }

}

_defineProperty(BPFUI, "sizing", "both");

_defineProperty(BPFUI, "defaultSize", [450, 300]);

class bpf extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
      if (!this.data.points) this.data.points = [];
    });
    let prevRange;
    let prevDomain;
    this.on("postInit", () => {
      prevRange = this.getProp("range");
      prevDomain = this.getProp("domain");
    });
    this.on("updateProps", () => {
      const range = this.getProp("range");

      if (prevRange && prevRange !== range) {
        const points = this.data.points.map(p => [p[0], (0,_utils_math__WEBPACK_IMPORTED_MODULE_5__.scaleClip)(p[1], prevRange[0], prevRange[1], range[0], range[1]), p[2]]);
        this.setData({
          points
        });
        this.updateUI(this.data);
        prevRange = range;
      }

      const domain = this.getProp("domain");

      if (typeof prevDomain === "number" && prevDomain !== domain) {
        const points = this.data.points.map(p => [(0,_utils_math__WEBPACK_IMPORTED_MODULE_5__.scaleClip)(p[0], 0, prevDomain, 0, domain), p[1], p[2]]);
        this.setData({
          points
        });
        this.updateUI(this.data);
        prevDomain = domain;
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if ((0,_Base__WEBPACK_IMPORTED_MODULE_2__.isBang)(data)) {
        if (inlet === 0) {
          const {
            points
          } = this.data;
          this.outlet(0, points.map((p, i) => [p[1], p[0] - (i > 0 ? points[i - 1][0] : 0), p[2]]));
        }
      } else {
        let points;

        try {
          points = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_4__.decodeBPF)(data, 3);
        } catch (e) {
          this.error("Cannot decode inlet BPF");
        }

        this.setData({
          points
        });
        this.updateUI(this.data);
      }
    });
  }

}

_defineProperty(bpf, "description", "Break-point function editor");

_defineProperty(bpf, "inlets", [{
  type: "anything",
  isHot: true,
  description: "Display & output a bpf, bang to output"
}, {
  type: "anything",
  isHot: true,
  description: "Display without output"
}]);

_defineProperty(bpf, "outlets", [{
  type: "object",
  description: "BPF triggered"
}]);

_defineProperty(bpf, "props", {
  domain: {
    type: "number",
    default: 1000,
    description: "X-axis range, starts from 0",
    isUIState: true
  },
  range: {
    type: "object",
    default: [0, 1],
    description: "Y-axis range, [low, high]",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "rgba(0, 255, 255, 1)",
    description: "Text color",
    isUIState: true
  },
  fontFamily: {
    type: "enum",
    enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
    default: "Arial",
    description: "Font family",
    isUIState: true
  },
  fontSize: {
    type: "number",
    default: 10,
    description: "Text font size",
    isUIState: true
  },
  fontFace: {
    type: "enum",
    enums: ["regular", "bold", "italic", "bold italic"],
    default: "regular",
    description: "Text style",
    isUIState: true
  },
  pointColor: {
    type: "color",
    default: "white",
    description: "Text color",
    isUIState: true
  },
  lineColor: {
    type: "color",
    default: "white",
    description: "Line color",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgba(0, 0, 0, 0.5)",
    description: "Background color",
    isUIState: true
  }
});

_defineProperty(bpf, "UI", BPFUI);

/***/ }),

/***/ "./src/core/objects/UI/exports.ts":
/*!****************************************!*\
  !*** ./src/core/objects/UI/exports.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _comment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./comment */ "./src/core/objects/UI/comment.tsx");
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./message */ "./src/core/objects/UI/message.ts");
/* harmony import */ var _code__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./code */ "./src/core/objects/UI/code.tsx");
/* harmony import */ var _menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./menu */ "./src/core/objects/UI/menu.tsx");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./view */ "./src/core/objects/UI/view.ts");
/* harmony import */ var _keyboard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./keyboard */ "./src/core/objects/UI/keyboard.tsx");
/* harmony import */ var _bpf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./bpf */ "./src/core/objects/UI/bpf.tsx");
/* harmony import */ var _waveform__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./waveform */ "./src/core/objects/UI/waveform.ts");
/* harmony import */ var _img__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./img */ "./src/core/objects/UI/img.tsx");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  message: _message__WEBPACK_IMPORTED_MODULE_1__.default,
  comment: _comment__WEBPACK_IMPORTED_MODULE_0__.default,
  code: _code__WEBPACK_IMPORTED_MODULE_2__.default,
  menu: _menu__WEBPACK_IMPORTED_MODULE_3__.default,
  view: _view__WEBPACK_IMPORTED_MODULE_4__.default,
  keyboard: _keyboard__WEBPACK_IMPORTED_MODULE_5__.default,
  bpf: _bpf__WEBPACK_IMPORTED_MODULE_6__.default,
  waveform: _waveform__WEBPACK_IMPORTED_MODULE_7__.default,
  img: _img__WEBPACK_IMPORTED_MODULE_8__.default
});

/***/ }),

/***/ "./src/core/objects/UI/img.tsx":
/*!*************************************!*\
  !*** ./src/core/objects/UI/img.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ img)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/UI/Base.ts");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class ImgUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_2__.BaseUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      url: this.object.state.url
    }));
  }

  render() {
    const {
      objectFit,
      objectPosition,
      scroll
    } = this.state;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BaseUI__WEBPACK_IMPORTED_MODULE_2__.BaseUI, this.props, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      style: {
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "block",
        overflow: "auto"
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
      src: this.state.url,
      style: _objectSpread(_objectSpread({
        position: "absolute"
      }, scroll ? {} : {
        width: "100%",
        height: "100%"
      }), {}, {
        objectFit,
        objectPosition
      })
    })));
  }

}

_defineProperty(ImgUI, "sizing", "both");

_defineProperty(ImgUI, "defaultSize", [210, 90]);

class img extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    var _this$box$args$;

    super(...arguments);

    _defineProperty(this, "state", {
      key: (_this$box$args$ = this.box.args[0]) === null || _this$box$args$ === void 0 ? void 0 : _this$box$args$.toString(),
      image: undefined,
      file: undefined,
      url: ""
    });
  }

  subscribe() {
    super.subscribe();

    const handleFilePathChanged = () => {
      var _this$state$file;

      this.setState({
        key: (_this$state$file = this.state.file) === null || _this$state$file === void 0 ? void 0 : _this$state$file.projectPath
      });
    };

    const subsribeItem = async () => {
      const {
        image,
        file
      } = this.state;
      if (image) await image.addObserver(this);

      if (file) {
        file.on("destroyed", reload);
        file.on("nameChanged", handleFilePathChanged);
        file.on("pathChanged", handleFilePathChanged);
      }
    };

    const unsubscribeItem = async () => {
      const {
        image,
        file
      } = this.state;

      if (file) {
        file.off("destroyed", reload);
        file.off("nameChanged", handleFilePathChanged);
        file.off("pathChanged", handleFilePathChanged);
      }

      if (image) await image.removeObserver(this);
    };

    const reload = async () => {
      await unsubscribeItem();
      const {
        key
      } = this.state;
      let image;
      let url;

      try {
        const {
          item
        } = await this.getSharedItem(key, "image");
        image = await item.instantiate();
        this.setState({
          image,
          file: item
        });
        url = image.objectURL;
      } catch (_unused) {
        url = key;
      } finally {
        this.setState({
          url
        });
        this.updateUI({
          url
        });
        await subsribeItem();
      }
    };

    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("postInit", reload);
    this.on("updateArgs", args => {
      if (typeof args[0] === "string") {
        var _args$;

        const oldKey = this.state.key;
        const key = (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.toString();
        this.setState({
          key
        });
        if (key !== oldKey) reload();
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_3__.isBang)(data)) {
          if (typeof data === "string") {
            this.setState({
              key: data
            });
            reload();
          }
        }
      }
    });
    this.on("destroy", unsubscribeItem);
  }

}

_defineProperty(img, "description", "Display an image");

_defineProperty(img, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Image file name or url"
}]);

_defineProperty(img, "args", [{
  type: "string",
  optional: true,
  description: "Image file name or url"
}]);

_defineProperty(img, "props", {
  scroll: {
    type: "boolean",
    default: false,
    description: "Allow overflow-scroll",
    isUIState: true
  },
  objectFit: {
    type: "enum",
    enums: ["fill", "cover", "contain", "none", "scale-down"],
    default: "contain",
    description: "CSS object-fit property",
    isUIState: true
  },
  objectPosition: {
    type: "string",
    default: "50% 50%",
    description: 'CSS object-position property, for example "50% 50%" or "left top"',
    isUIState: true
  }
});

_defineProperty(img, "UI", ImgUI);

/***/ }),

/***/ "./src/core/objects/UI/keyboard.tsx":
/*!******************************************!*\
  !*** ./src/core/objects/UI/keyboard.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeyboardUI": () => (/* binding */ KeyboardUI),
/* harmony export */   "default": () => (/* binding */ keyboard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/UI/Base.ts");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class KeyboardUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_2__.BaseUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      keys: this.object.state.keys,
      selected: undefined
    }));

    _defineProperty(this, "mouseDown", false);

    _defineProperty(this, "touches", []);

    _defineProperty(this, "handleMouseDownKey", e => {
      const key = +e.currentTarget.getAttribute("values");

      if (this.state.mode === "touch") {
        if (this.state.keys[key]) return;
        this.touches[-1] = key;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.pageY - rect.top;
      const height = rect.height;
      const velocity = Math.min(127, ~~(y / height * 128)) || 1;
      this.object.keyTrigger(key, velocity);
      this.mouseDown = true;

      const handleMouseUp = () => {
        this.mouseDown = false;

        if (this.state.mode === "touch" && this.touches[-1]) {
          this.object.keyTrigger(this.touches[-1], 0);
          delete this.touches[-1];
        }

        this.setState({
          selected: undefined
        });
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mouseup", handleMouseUp);
    });

    _defineProperty(this, "handleMouseEnterKey", e => {
      if (!this.mouseDown) return;
      const key = +e.currentTarget.getAttribute("values");

      if (this.state.mode === "touch") {
        if (this.touches[-1] && this.touches[-1] !== key) {
          this.object.keyTrigger(this.touches[-1], 0);
          delete this.touches[-1];
        }

        if (this.state.keys[key]) return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.pageY - rect.top;
      const height = rect.height;
      const velocity = Math.min(127, ~~(y / height * 128)) || 1;
      this.object.keyTrigger(key, velocity);
      if (this.state.mode === "touch") this.touches[-1] = key;
    });

    _defineProperty(this, "handleTouchStartKey", (e, keyIn) => {
      if (this.state.mode !== "touch") return;
      e.stopPropagation();
      const key = typeof keyIn === "number" ? keyIn : +e.currentTarget.getAttribute("values");
      Array.from(e.changedTouches).forEach(touch => {
        const {
          identifier: id
        } = touch;
        if (this.touches[id]) this.object.keyTrigger(this.touches[id], 0);
        this.touches[id] = key;
        const rect = e.currentTarget.getBoundingClientRect();
        const y = touch.pageY - rect.top;
        const height = rect.height;
        const velocity = Math.min(127, ~~(y / height * 128)) || 1;
        this.object.keyTrigger(key, velocity);
      });
    });

    _defineProperty(this, "handleTouchMoveKey", e => {
      if (this.state.mode !== "touch") return;
      e.stopPropagation();
      e.preventDefault();
      Array.from(e.changedTouches).forEach(touch => {
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target.parentElement !== e.currentTarget.parentElement) return;
        const key = +target.getAttribute("values");
        if (typeof key === "undefined") return;
        if (this.state.keys[key]) return;
        this.handleTouchStartKey(e, key);
      });
    });

    _defineProperty(this, "handleTouchEndKey", e => {
      if (this.state.mode !== "touch") return;
      e.stopPropagation();
      e.preventDefault();
      Array.from(e.changedTouches).forEach(touch => {
        const {
          identifier: id
        } = touch;
        if (this.touches[id]) this.object.keyTrigger(this.touches[id], 0);
        delete this.touches[id];
      });
    });
  }

  isBlack(key) {
    return KeyboardUI.blacks.indexOf(key % 12) !== -1;
  }

  get from() {
    if (this.isBlack(this.state.from)) return this.state.from - 1;
    return this.state.from;
  }

  get to() {
    if (this.isBlack(this.state.to)) return this.state.to + 1;
    return this.state.to;
  }

  get whiteCount() {
    const {
      to
    } = this;
    let {
      from
    } = this;
    if (from >= to) return 0;
    let count = 0;

    while (from <= to) {
      if (!this.isBlack(from++)) count++;
    }

    return count;
  }

  render() {
    const {
      from,
      to,
      whiteCount,
      state
    } = this;
    const {
      blackKeyColor,
      whiteKeyColor,
      keyOnColor,
      selectedColor,
      selected
    } = state;
    const whites = [];
    const blacks = [];
    const blackStyle = {
      fill: blackKeyColor,
      strokeWidth: 1,
      stroke: "black"
    };
    const whiteStyle = {
      fill: whiteKeyColor,
      strokeWidth: 1,
      stroke: "black"
    };
    const keyOnStyle = {
      fill: keyOnColor,
      strokeWidth: 1,
      stroke: "black"
    };
    const selectedStyle = {
      fill: selectedColor,
      strokeWidth: 1,
      stroke: "black"
    };
    const whiteWidthPercentage = 100 / whiteCount;
    const blackWidthPercentage = 100 / whiteCount * 2 / 3;
    const whiteWidth = "".concat(whiteWidthPercentage, "%");
    const blackWidth = "".concat(blackWidthPercentage, "%");
    let $white = 0;
    let key = from;

    while (key <= to) {
      const $key = key;
      const keyOn = +!!this.state.keys[$key];
      const commonProps = {
        key: $key,
        values: "".concat(key),
        onMouseDown: this.handleMouseDownKey,
        onMouseEnter: this.handleMouseEnterKey,
        onTouchStart: this.handleTouchStartKey,
        onTouchMove: this.handleTouchMoveKey,
        onTouchEnd: this.handleTouchEndKey
      };

      if (this.isBlack(key)) {
        const style = key === selected ? selectedStyle : keyOn ? keyOnStyle : blackStyle;
        const x = "".concat(($white - 1 / 3) * whiteWidthPercentage, "%");
        blacks.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", _extends({
          x: x,
          y: 0,
          width: blackWidth,
          height: "70%",
          style: style
        }, commonProps)));
      } else {
        const style = key === selected ? selectedStyle : keyOn ? keyOnStyle : whiteStyle;
        const x = "".concat($white * whiteWidthPercentage, "%");
        whites.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", _extends({
          x: x,
          y: 0,
          width: whiteWidth,
          height: "100%",
          style: style
        }, commonProps)));
        $white++;
      }

      key++;
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BaseUI__WEBPACK_IMPORTED_MODULE_2__.BaseUI, _extends({}, this.props, {
      containerProps: {
        style: {
          height: "100%",
          width: "100%"
        }
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg", {
      width: "100%",
      height: "100%",
      style: {
        touchAction: "none"
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("rect", {
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      style: {
        fill: "transparent",
        strokeWidth: 2,
        stroke: "black"
      }
    }), whites, blacks));
  }

}

_defineProperty(KeyboardUI, "sizing", "both");

_defineProperty(KeyboardUI, "defaultSize", [450, 60]);

_defineProperty(KeyboardUI, "blacks", [1, 3, 6, 8, 10]);

class keyboard extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      keys: this.flushed,
      selected: undefined
    });
  }

  get flushed() {
    const keys = [];

    for (let i = 0; i < 128; i++) {
      keys[i] = 0;
    }

    return keys;
  }

  flush() {
    const {
      keys
    } = this.state;

    for (let $key = 0; $key < 128; $key++) {
      if (keys[$key]) {
        this.outlet(0, new Uint8Array([9 << 4, $key, 0]));
        this.state.keys[$key] = 0;
      }
    }

    this.state.selected = undefined;
  }

  keyTrigger(keyIn, velocityIn, noOutput) {
    const key = Math.max(0, Math.min(127, ~~+keyIn));
    const velocity = Math.max(0, Math.min(127, ~~+velocityIn));
    const mode = this.getProp("mode");

    if (mode === "mono") {
      const keys = this.flushed;
      keys[key] = velocity;
      if (!noOutput) this.outlet(0, new Uint8Array([9 << 4, key, velocity]));
      this.setState({
        keys,
        selected: key
      });
    } else if (mode === "poly") {
      const {
        keys
      } = this.state;
      const v = +!keys[key] * (velocity || 1);
      keys[key] = v;
      if (!noOutput) this.outlet(0, new Uint8Array([9 << 4, key, v]));
      this.setState({
        keys: _objectSpread({}, keys),
        selected: v ? key : undefined
      });
    } else {
      const {
        keys
      } = this.state;
      keys[key] = velocity;
      if (!noOutput) this.outlet(0, new Uint8Array([9 << 4, key, velocity]));
      this.setState({
        keys: _objectSpread({}, keys),
        selected: velocity ? key : undefined
      });
    }

    this.updateUI(this.state);
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    let prevMode;
    this.on("postInit", () => prevMode = this.getProp("mode"));
    this.on("updateProps", () => {
      if (prevMode && prevMode !== this.getProp("mode")) {
        this.flush();
        this.setState({
          keys: _objectSpread({}, this.state.keys),
          selected: undefined
        });
        this.updateUI(this.state);
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0 && data === "flush") {
        this.flush();
        this.setState({
          keys: _objectSpread({}, this.state.keys),
          selected: undefined
        });
        this.updateUI(this.state);
      } else if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.isMIDIEvent)(data)) {
        const cmd = data[0] >> 4;
        const channel = data[0] & 0xf;
        const data1 = data[1];
        const data2 = data[2];
        if (channel === 9) return;
        if (cmd === 8 || cmd === 9 && data2 === 0) this.keyTrigger(data1, 0, inlet === 1);else if (cmd === 9) this.keyTrigger(data1, data2, inlet === 1);
      }
    });
  }

}

_defineProperty(keyboard, "description", "Keyboard");

_defineProperty(keyboard, "inlets", [{
  type: "anything",
  isHot: true,
  description: 'Display & output same MIDI event, "flush" to flush active notes'
}, {
  type: "object",
  isHot: true,
  description: "Display without output"
}]);

_defineProperty(keyboard, "outlets", [{
  type: "object",
  description: "MIDI event triggered"
}]);

_defineProperty(keyboard, "props", {
  from: {
    type: "number",
    default: 24,
    description: "Lowest MIDI key to display",
    isUIState: true
  },
  to: {
    type: "number",
    default: 96,
    description: "Highest MIDI key to display",
    isUIState: true
  },
  blackKeyColor: {
    type: "color",
    default: "black",
    description: "Display color of black key",
    isUIState: true
  },
  whiteKeyColor: {
    type: "color",
    default: "white",
    description: "Display color of white key",
    isUIState: true
  },
  keyOnColor: {
    type: "color",
    default: "grey",
    description: "Display color of pressed key",
    isUIState: true
  },
  selectedColor: {
    type: "color",
    default: "yellow",
    description: "Display color of selected key",
    isUIState: true
  },
  mode: {
    type: "enum",
    enums: ["mono", "poly", "touch"],
    default: "poly",
    description: "Triggering mode",
    isUIState: true
  }
});

_defineProperty(keyboard, "UI", KeyboardUI);

/***/ }),

/***/ "./src/core/objects/UI/menu.tsx":
/*!**************************************!*\
  !*** ./src/core/objects/UI/menu.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ menu)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var semantic_ui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/modules/Dropdown/Dropdown.js");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/UI/Base.ts");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







class MenuUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_2__.BaseUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      value: this.object.getProp("defaultValue")
    }));

    _defineProperty(this, "handleChange", (event, data) => {
      const {
        value
      } = data;
      this.setState({
        value
      });
      this.object.outlet(0, value);
    });

    _defineProperty(this, "handleQuery", query => {
      const {
        options
      } = this.state;
      let value;

      if (typeof query === "number") {
        if (options[query]) {
          value = options[query].value;
        }
      } else if (typeof query === "string") {
        const found = options.find(o => o.text === query);

        if (found) {
          value = found.value;
        }
      } else if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.isNumberArray)(query)) {
        value = query.filter(i => !!options[i]).map(i => options[i].value);
      } else {
        value = options.filter(o => query.indexOf(o.text) !== -1).map(o => o.value);
      }

      if (value) {
        this.setState({
          value
        });
        this.object.outlet(0, value);
      }
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.object.on("query", this.handleQuery);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.object.off("query", this.handleQuery);
  }

  render() {
    const {
      clearable,
      closeOnBlur,
      closeOnChange,
      closeOnEscape,
      deburr,
      defaultOpen,
      defaultValue,
      direction,
      disabled,
      error,
      lazyLoad,
      minCharacters,
      multiple,
      noResultsMessage,
      options,
      placeholder,
      scrolling,
      search,
      selectOnBlur,
      selectOnNavigation,
      simple,
      tabIndex,
      text,
      upward,
      wrapSelection,
      value
    } = this.state;
    const dropdownProps = {
      clearable,
      closeOnBlur,
      closeOnChange,
      closeOnEscape,
      deburr,
      defaultOpen,
      defaultValue,
      direction,
      disabled,
      error,
      lazyLoad,
      minCharacters,
      multiple,
      noResultsMessage,
      options,
      placeholder,
      scrolling,
      search,
      selectOnBlur,
      selectOnNavigation,
      simple,
      tabIndex,
      text,
      upward,
      wrapSelection,
      value
    };
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BaseUI__WEBPACK_IMPORTED_MODULE_2__.BaseUI, this.props, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(semantic_ui_react__WEBPACK_IMPORTED_MODULE_4__.default, _extends({}, dropdownProps, {
      selection: true,
      fluid: true,
      onChange: this.handleChange
    })));
  }

}

class menu extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        this.emit("query", data);
      } else {
        const options = data;
        this.update(undefined, {
          options
        });
      }
    });
  }

}

_defineProperty(menu, "description", "Dropdown Menu");

_defineProperty(menu, "inlets", [{
  isHot: true,
  type: "anything",
  description: "number or display text or array to select item(s)"
}, {
  isHot: false,
  type: "object",
  description: "Array of DropdownItemProps: { key, icon, text, value, ... }"
}]);

_defineProperty(menu, "outlets", [{
  type: "anything",
  description: "Selected value"
}]);

_defineProperty(menu, "args", [{
  type: "anything",
  varLength: true,
  optional: true,
  default: undefined,
  description: "Initial value(s)"
}]);

_defineProperty(menu, "props", {
  clearable: {
    type: "boolean",
    default: false,
    description: "Using the clearable setting will let users remove their selection",
    isUIState: true
  },
  closeOnBlur: {
    type: "boolean",
    default: true,
    description: "Whether or not the menu should close when the dropdown is blurred",
    isUIState: true
  },
  closeOnChange: {
    type: "boolean",
    default: undefined,
    description: "Whether or not the menu should close when a value is selected",
    isUIState: true
  },
  closeOnEscape: {
    type: "boolean",
    default: true,
    description: "Whether or not the dropdown should close when the escape key is pressed",
    isUIState: true
  },
  deburr: {
    type: "boolean",
    default: false,
    description: "Whether or not the dropdown should strip diacritics in options and input search",
    isUIState: true
  },
  defaultOpen: {
    type: "boolean",
    default: false,
    description: "Initial value of open",
    isUIState: true
  },
  defaultValue: {
    type: "anything",
    default: undefined,
    description: "Initial value or value array if multiple",
    isUIState: true
  },
  direction: {
    type: "enum",
    enums: ["left", "right"],
    default: "left",
    description: "A dropdown menu can open to the left or to the right",
    isUIState: true
  },
  disabled: {
    type: "boolean",
    default: false,
    description: " A disabled dropdown menu or item does not allow user interaction",
    isUIState: true
  },
  error: {
    type: "boolean",
    default: false,
    description: "An errored dropdown can alert a user to a problem",
    isUIState: true
  },
  lazyLoad: {
    type: "boolean",
    default: false,
    description: "A dropdown can defer rendering its options until it is open",
    isUIState: true
  },
  minCharacters: {
    type: "number",
    default: 1,
    description: "The minimum characters for a search to begin showing results",
    isUIState: true
  },
  multiple: {
    type: "boolean",
    default: false,
    description: "A selection dropdown can allow multiple selections",
    isUIState: true
  },
  noResultsMessage: {
    type: "string",
    default: "No results found",
    description: "Message to display when there are no results",
    isUIState: true
  },
  options: {
    type: "anything",
    default: [],
    description: "Array of Dropdown.Item props",
    isUIState: true
  },
  placeholder: {
    type: "string",
    default: "",
    description: "Placeholder text",
    isUIState: true
  },
  scrolling: {
    type: "boolean",
    default: false,
    description: "A dropdown can have its menu scroll",
    isUIState: true
  },
  search: {
    type: "boolean",
    default: false,
    description: "A selection dropdown can allow a user to search through a large list of choices",
    isUIState: true
  },
  selectOnBlur: {
    type: "boolean",
    default: true,
    description: "Whether the highlighted item should be selected on blur",
    isUIState: true
  },
  selectOnNavigation: {
    type: "boolean",
    default: true,
    description: "Whether dropdown should select new option when using keyboard shortcuts.",
    isUIState: true
  },
  simple: {
    type: "boolean",
    default: false,
    description: "A dropdown menu can open to the left or to the right",
    isUIState: true
  },
  tabIndex: {
    type: "anything",
    default: undefined,
    description: "A dropdown can receive focus",
    isUIState: true
  },
  text: {
    type: "string",
    default: undefined,
    description: "The text displayed in the dropdown, usually for the active item",
    isUIState: true
  },
  upward: {
    type: "boolean",
    default: false,
    description: "Controls whether the dropdown will open upward",
    isUIState: true
  },
  wrapSelection: {
    type: "boolean",
    default: false,
    description: "Selection will wrap to end or start on press ArrowUp or ArrowDown",
    isUIState: true
  }
});

_defineProperty(menu, "UI", MenuUI);

/***/ }),

/***/ "./src/core/objects/UI/message.ts":
/*!****************************************!*\
  !*** ./src/core/objects/UI/message.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ message)
/* harmony export */ });
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! util */ "./node_modules/util/util.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/UI/Base.ts");
/* harmony import */ var _ButtonUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ButtonUI */ "./src/core/objects/UI/ButtonUI.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class MessageUI extends _ButtonUI__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handleChanged", text => this.object.handleUpdateArgs([text]));

    _defineProperty(this, "handleClick", e => {
      if (this.editor.state.locked) this.object.outlet(0, this.object.state.buffer);
    });
  }

}

_defineProperty(MessageUI, "editableOnUnlock", true);

class message extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      buffer: new _Base__WEBPACK_IMPORTED_MODULE_3__.Bang(),
      editing: false
    });

    _defineProperty(this, "handleUpdateArgs", args => {
      if (typeof args[0] !== "undefined") {
        this.setData({
          text: this.stringify(args[0])
        });
        this.state.buffer = this.parse(args[0]);
      } else {
        this.state.buffer = new _Base__WEBPACK_IMPORTED_MODULE_3__.Bang();
      }

      this.updateUI({
        text: this.data.text
      });
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });
    this.on("postInit", () => {
      const args = this.box.args;
      if (typeof this.data.text === "string") this.state.buffer = this.parse(this.data.text);else if (typeof args[0] !== "undefined") {
        if (typeof this.data.text !== "string") {
          this.setData({
            text: this.stringify(args[0])
          });
          this.state.buffer = args[0];
        }
      } else {
        this.setData({
          text: ""
        });
        this.state.buffer = new _Base__WEBPACK_IMPORTED_MODULE_3__.Bang();
      }
      this.on("updateArgs", this.handleUpdateArgs);
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      if (inlet === 0) this.outlet(0, this.state.buffer);else if (inlet === 1) this.handleUpdateArgs([data]);
    });
  }

  parse(o) {
    if (typeof o === "string") {
      if (o.length > 0) {
        try {
          return JSON.parse(o);
        } catch (e) {
          return o;
        }
      }

      return new _Base__WEBPACK_IMPORTED_MODULE_3__.Bang();
    }

    return o;
  }

  stringify(o) {
    if (typeof o === "string") return o;

    try {
      return JSON.stringify(o);
    } catch (e) {
      return util__WEBPACK_IMPORTED_MODULE_0__.inspect(o);
    }
  }

}

_defineProperty(message, "description", "Message");

_defineProperty(message, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Trigger output the message"
}, {
  isHot: false,
  type: "anything",
  description: "Set the message"
}]);

_defineProperty(message, "outlets", [{
  type: "anything",
  description: "Message to send"
}]);

_defineProperty(message, "UI", MessageUI);

/***/ }),

/***/ "./src/core/objects/UI/view.ts":
/*!*************************************!*\
  !*** ./src/core/objects/UI/view.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ViewUI": () => (/* binding */ ViewUI),
/* harmony export */   "default": () => (/* binding */ view)
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./src/core/objects/UI/Base.ts");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class ViewUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_1__.DOMUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      children: this.object.state.children,
      containerProps: this.object.getProp("containerProps")
    }));
  }

}
class view extends _Base__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      children: []
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("updateArgs", args => {
      if (typeof this.box.args[0] === "string") {
        const template = document.createElement("template");
        template.innerHTML = this.box.args[0];
        this.state.children = Array.from(template.content.children);
        this.updateUI({
          children: this.state.children
        });
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_Base__WEBPACK_IMPORTED_MODULE_2__.isBang)(data)) {
          if (typeof data === "string") {
            const template = document.createElement("template");
            template.innerHTML = data;
            this.state.children = Array.from(template.content.children);
          } else if (data instanceof Element) {
            this.state.children = [data];
          }

          this.updateUI({
            children: this.state.children
          });
        }
      }
    });
  }

}

_defineProperty(view, "description", "View HTML Element");

_defineProperty(view, "inlets", [{
  isHot: true,
  type: "anything",
  description: "HTML string or HTMLElement object to view"
}]);

_defineProperty(view, "args", [{
  type: "string",
  optional: true,
  description: "initial innerHTML"
}]);

_defineProperty(view, "props", {
  shadow: {
    type: "boolean",
    default: true,
    description: "Whether children should be attached to a Shadow DOM",
    isUIState: true
  },
  containerProps: {
    type: "object",
    default: {},
    description: "Available under non-shadow mode, the props for div container",
    isUIState: true
  }
});

_defineProperty(view, "UI", ViewUI);

/***/ }),

/***/ "./src/core/objects/UI/waveform.ts":
/*!*****************************************!*\
  !*** ./src/core/objects/UI/waveform.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WaveformUI": () => (/* binding */ WaveformUI),
/* harmony export */   "default": () => (/* binding */ waveform)
/* harmony export */ });
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! color-js */ "./node_modules/color-js/color.js");
/* harmony import */ var color_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(color_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/UI/Base.ts");
/* harmony import */ var _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../audio/PatcherAudio */ "./src/core/audio/PatcherAudio.ts");
/* harmony import */ var _BaseUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../BaseUI */ "./src/core/objects/BaseUI.tsx");
/* harmony import */ var _components_editors_audio_AudioEditorMainUI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../components/editors/audio/AudioEditorMainUI */ "./src/components/editors/audio/AudioEditorMainUI.tsx");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../utils/math */ "./src/utils/math.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







class WaveformUI extends _BaseUI__WEBPACK_IMPORTED_MODULE_3__.CanvasUI {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.state), {}, {
      audio: this.object.state.audio
    }));
  }

  async paint() {
    const {
      interleaved,
      cursor,
      autoVerticalRange,
      verticalRange,
      viewRange,
      showStats,
      bgColor,
      cursorColor,
      phosphorColor,
      hueOffset,
      textColor,
      gridColor,
      seperatorColor,
      audioUnit,
      bpm,
      audio
    } = this.state;
    const {
      ctx
    } = this;
    const [width, height] = this.fullSize();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    if (!audio) return;
    const {
      audioBuffer,
      waveform,
      numberOfChannels,
      length,
      sampleRate
    } = audio;
    const t = audioBuffer.toArray();
    if (!t.length || !t[0].length) return; // View Range

    let [$0, $1] = viewRange || [0, length];
    if ($1 < $0) [$0, $1] = [$1, $0];
    const pixelsPerSamp = width / ($1 - $0);
    const sampsPerPixel = Math.max(1, Math.round(1 / pixelsPerSamp)); // Vertical Range

    let [yMin, yMax] = autoVerticalRange ? [-1, 1] : verticalRange;

    if (autoVerticalRange) {
      // Fastest way to get min and max to have: 1. max abs value for y scaling, 2. mean value for zero-crossing
      let i = numberOfChannels;
      let s = 0;

      while (i--) {
        let j = viewRange[1];

        while (j-- > viewRange[0]) {
          s = t[i][j];
          if (s < yMin) yMin = s;else if (s > yMax) yMax = s;
        }
      }

      const yFactor = Math.max(1, Math.abs(yMin), Math.abs(yMax));
      [yMin, yMax] = [-yFactor, yFactor];
    } else {
      if (yMax < yMin) [yMin, yMax] = [yMax, yMin];
    }

    const calcY = (v, i) => channelHeight * (+interleaved * i + 1 - (v - yMin) / (yMax - yMin)); // Grids


    const {
      ruler
    } = (0,_components_editors_audio_AudioEditorMainUI__WEBPACK_IMPORTED_MODULE_4__.getRuler)(viewRange, audioUnit, {
      bpm,
      sampleRate
    });
    const gridChannels = interleaved ? numberOfChannels : 1;
    const channelHeight = height / gridChannels; // Vertical

    ctx.strokeStyle = gridColor;
    ctx.beginPath();

    for (const sampleIn in ruler) {
      const sample = +sampleIn;
      const x = (sample - $0 + 0.5) * pixelsPerSamp;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    ctx.stroke(); // Horizontal

    ctx.beginPath();
    const range = [18, 12, 6, 3, 0, -3, -6, -12, -18].filter(v => (0,_utils_math__WEBPACK_IMPORTED_MODULE_5__.dbtoa)(v) < Math.max(Math.abs(yMin), Math.abs(yMax)));

    for (let i = 0; i < gridChannels; i++) {
      let y = calcY(0, i);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);

      for (let j = 0; j < range.length; j++) {
        const a = (0,_utils_math__WEBPACK_IMPORTED_MODULE_5__.dbtoa)(range[j]);

        if (a < yMax) {
          y = calcY(a, i);
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }

        if (a > yMin) {
          y = calcY(-a, i);
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
      }
    }

    ctx.stroke(); // Seperator

    ctx.beginPath();
    ctx.setLineDash([4, 2]);
    ctx.strokeStyle = seperatorColor;

    for (let i = 1; i < gridChannels; i++) {
      ctx.moveTo(0, i * channelHeight);
      ctx.lineTo(width, i * channelHeight);
    }

    ctx.stroke();
    ctx.setLineDash([]); // Iteration

    ctx.lineWidth = 1;
    const channelColor = [];
    const currentWaveform = waveform.findStep(sampsPerPixel);

    for (let i = 0; i < numberOfChannels; i++) {
      if (interleaved) {
        ctx.save();
        const clip = new Path2D();
        clip.rect(0, i * channelHeight, width, channelHeight);
        ctx.clip(clip);
      }

      ctx.beginPath();
      channelColor[i] = color_js__WEBPACK_IMPORTED_MODULE_0__(phosphorColor).shiftHue(i * hueOffset).toHSL();
      ctx.strokeStyle = channelColor[i];
      ctx.fillStyle = channelColor[i];

      if (currentWaveform) {
        const sampsPerPixel = 1 / pixelsPerSamp;
        const {
          idx
        } = currentWaveform;
        const {
          min,
          max
        } = currentWaveform[i];
        let x = 0;
        let maxInStep;
        let minInStep;

        for (let j = 0; j < idx.length - 1; j++) {
          const $ = idx[j];
          if ($ > $1) break;
          const $next = j === idx.length - 1 ? length : idx[j + 1];
          if ($next <= $0) continue;

          if (typeof maxInStep === "undefined") {
            maxInStep = max[j];
            minInStep = min[j];
          } else {
            if (min[j] < minInStep) minInStep = min[j];
            if (max[j] > maxInStep) maxInStep = max[j];
          }

          if ($next >= $0 + sampsPerPixel * (x + 1)) {
            let y = calcY(maxInStep, i);
            if (x === 0) ctx.moveTo(x, y);else ctx.lineTo(x, y);

            if (minInStep !== maxInStep) {
              y = calcY(minInStep, i);
              ctx.lineTo(x, y);
            }

            maxInStep = undefined;
            x++;
          }
        }
      } else {
        let maxInStep;
        let minInStep;
        const prev = t[i][$0 - 1] || 0;
        const prevX = -0.5 * pixelsPerSamp;
        const prevY = calcY(prev, i);
        ctx.moveTo(prevX, prevY);

        for (let j = $0; j < $1; j++) {
          const samp = t[i][j];
          const $step = (j - $0) % sampsPerPixel;

          if ($step === 0) {
            maxInStep = samp;
            minInStep = samp;
          } else {
            if (samp > maxInStep) maxInStep = samp;
            if (samp < minInStep) minInStep = samp;
          }

          if ($step === sampsPerPixel - 1) {
            const x = (j - $step - $0 + 0.5) * pixelsPerSamp;
            let y = calcY(maxInStep, i);
            ctx.lineTo(x, y);

            if (minInStep !== maxInStep && pixelsPerSamp < 1) {
              y = calcY(minInStep, i);
              ctx.lineTo(x, y);
            }

            if (pixelsPerSamp > 10) ctx.fillRect(x - 2, y - 2, 4, 4);
          }
        }

        const next = t[i][$1] || 0;
        const nextX = ($1 - $0 + 0.5) * pixelsPerSamp;
        const nextY = calcY(next, i);
        ctx.lineTo(nextX, nextY);
      }

      ctx.stroke();
      if (interleaved) ctx.restore();
    } // cursor


    if (cursor > $0 && cursor < $1) {
      ctx.strokeStyle = cursorColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const cursorX = (cursor - $0) / ($1 - $0) * width;
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, height);
      ctx.stroke();
    } // Stats


    if (showStats) {
      ctx.font = "bold 12px Consolas, monospace";
      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(yMax.toFixed(2), 2, 2);
      ctx.textBaseline = "bottom";
      ctx.fillText(yMax.toFixed(2), 2, height - 2);
    }
  }

  componentDidMount() {
    var _this$state$audio;

    const {
      bgColor
    } = this.state;
    const ctx = this.ctx;
    if (!ctx) return;
    const [width, height] = this.fullSize(); // Background

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    (_this$state$audio = this.state.audio) === null || _this$state$audio === void 0 ? void 0 : _this$state$audio.on("changed", this.schedulePaint);
    super.componentDidMount();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.audio !== this.state.audio) {
      var _prevState$audio, _this$state$audio2;

      (_prevState$audio = prevState.audio) === null || _prevState$audio === void 0 ? void 0 : _prevState$audio.off("changed", this.schedulePaint);
      (_this$state$audio2 = this.state.audio) === null || _this$state$audio2 === void 0 ? void 0 : _this$state$audio2.on("changed", this.schedulePaint);
    }

    super.componentDidUpdate(prevProps, prevState);
  }

  componentWillUnmount() {
    var _this$state$audio3;

    (_this$state$audio3 = this.state.audio) === null || _this$state$audio3 === void 0 ? void 0 : _this$state$audio3.off("changed", this.schedulePaint);
    super.componentWillUnmount();
  }

}

_defineProperty(WaveformUI, "defaultSize", [120, 60]);

class waveform extends _Base__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      audio: undefined
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("inlet", async _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (data instanceof _audio_PatcherAudio__WEBPACK_IMPORTED_MODULE_2__.default) {
          this.setState({
            audio: data
          });
          this.updateUI(this.state);
          this.update(null, {
            selRange: null,
            viewRange: [0, data.length],
            cursor: 0
          });
        } else {
          this.error("Input data is not PatcherAudio instance");
        }
      }
    });
  }

}

_defineProperty(waveform, "description", "Buffer waveform view");

_defineProperty(waveform, "inlets", [{
  isHot: false,
  type: "object",
  description: "Patcher Audio object (from buffer~)"
}]);

_defineProperty(waveform, "props", {
  interleaved: {
    type: "boolean",
    default: false,
    description: "Draw channels seperately",
    isUIState: true
  },
  cursor: {
    type: "number",
    default: 0,
    description: "Display a cursor",
    isUIState: true
  },
  viewRange: {
    type: "object",
    default: [0, 1],
    description: "Display only a part of the buffer",
    isUIState: true
  },
  selRange: {
    type: "object",
    default: null,
    description: "Nullable, display selection of a part of the buffer",
    isUIState: true
  },
  verticalRange: {
    type: "object",
    default: [-1, 1],
    description: "Vertical range",
    isUIState: true
  },
  autoVerticalRange: {
    type: "boolean",
    default: true,
    description: "Auto adjust vertical range if > 1",
    isUIState: true
  },
  showStats: {
    type: "boolean",
    default: true,
    description: "Show stats texts",
    isUIState: true
  },
  bgColor: {
    type: "color",
    default: "rgb(40, 40, 40)",
    description: "Background color",
    isUIState: true
  },
  cursorColor: {
    type: "color",
    default: "white",
    description: "Cursor color",
    isUIState: true
  },
  phosphorColor: {
    type: "color",
    default: "hsl(0, 100%, 85%)",
    description: "Phosphor color",
    isUIState: true
  },
  hueOffset: {
    type: "number",
    default: 60,
    description: "Channel Color Hue offset",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "#DDDD99",
    description: "Info text color",
    isUIState: true
  },
  gridColor: {
    type: "color",
    default: "#404040",
    description: "Grid color",
    isUIState: true
  },
  seperatorColor: {
    type: "color",
    default: "white",
    description: "Channel seperator color",
    isUIState: true
  },
  audioUnit: {
    type: "enum",
    default: "time",
    enums: ["time", "sample", "measure"],
    description: "Vertical grid mode",
    isUIState: true
  },
  bpm: {
    type: "number",
    default: 60,
    description: "If audioUnit is measure, a BPM can be used",
    isUIState: true
  }
});

_defineProperty(waveform, "UI", WaveformUI);

/***/ })

}]);
//# sourceMappingURL=931db5d781d6e0f3d826.js.map