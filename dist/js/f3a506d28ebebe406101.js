(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["vendors-node_modules_shren_faust-ui_dist_faust-ui_js"],{

/***/ "./node_modules/@shren/faust-ui/dist/faust-ui.js":
/*!*******************************************************!*\
  !*** ./node_modules/@shren/faust-ui/dist/faust-ui.js ***!
  \*******************************************************/
/***/ ((module) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@shren/typed-event-emitter/dist/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@shren/typed-event-emitter/dist/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class TypedEventEmitter {
    constructor() {
        this._listeners = {};
    }
    get listeners() {
        return this._listeners;
    }
    getListeners(eventName) {
        if (!(eventName in this._listeners))
            this._listeners[eventName] = [];
        return this._listeners[eventName];
    }
    on(eventName, listener) {
        if (this.getListeners(eventName).indexOf(listener) === -1)
            this.getListeners(eventName).push(listener);
    }
    once(eventName, listener) {
        const listenerWithOff = (arg) => {
            const returnValue = listener(arg);
            this.off(eventName, listenerWithOff);
            return returnValue;
        };
        this.on(eventName, listenerWithOff);
    }
    off(eventName, listener) {
        const i = this.getListeners(eventName).indexOf(listener);
        if (i !== -1)
            this.getListeners(eventName).splice(i, 1);
    }
    async emit(eventName, eventData) {
        const listeners = this.getListeners(eventName);
        if (!listeners.length)
            return [];
        return Promise.all(listeners.map(f => f(eventData)));
    }
    async emitSerial(eventName, eventData) {
        const listeners = this.getListeners(eventName);
        if (!listeners.length)
            return [];
        const returnValues = [];
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            returnValues[i] = await listener(eventData);
        }
        return returnValues;
    }
    emitSync(eventName, eventData) {
        const listeners = this.getListeners(eventName);
        if (!listeners.length)
            return [];
        return listeners.map(f => f(eventData));
    }
    removeAllListeners(eventName) {
        if (eventName) {
            this._listeners[eventName] = [];
        }
        else {
            this._listeners = {};
        }
    }
    listenerCount(eventName) {
        if (!(eventName in this._listeners))
            return 0;
        return this._listeners[eventName].length;
    }
}
exports.default = TypedEventEmitter;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./src/FaustUI.ts":
/*!************************!*\
  !*** ./src/FaustUI.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_3234__) => {

__nested_webpack_require_3234__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_3234__.d(__webpack_exports__, {
/* harmony export */   "FaustUI": () => (/* binding */ FaustUI)
/* harmony export */ });
/* harmony import */ var _layout_Layout__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_3234__(/*! ./layout/Layout */ "./src/layout/Layout.ts");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_3234__(/*! ./index.scss */ "./src/index.scss");
/* harmony import */ var _components_Group__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_3234__(/*! ./components/Group */ "./src/components/Group.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/**
 * The main class of UI constructor,
 * listening to `resize` window event to resize component,
 * listening to `message` window event to change UI or param value.
 * See readme.
 */
class FaustUI {
  /**
   * Calculate incoming UI's layout, bind window events
   */
  constructor(options) {
    _defineProperty(this, "componentMap", {});

    _defineProperty(this, "DOMroot", void 0);

    _defineProperty(this, "faustUIRoot", void 0);

    _defineProperty(this, "hostWindow", void 0);

    _defineProperty(this, "grid", void 0);

    _defineProperty(this, "_ui", void 0);

    _defineProperty(this, "_layout", void 0);

    _defineProperty(this, "paramChangeByUI", (path, value) => {
      if (!this.hostWindow) return;
      this.hostWindow.postMessage({
        path,
        value,
        type: "param"
      }, "*");
    });

    var root = options.root,
        uiIn = options.ui,
        listenWindowResize = options.listenWindowResize,
        listenWindowMessage = options.listenWindowMessage;
    this.DOMroot = root;
    this.ui = uiIn || [];

    if (typeof listenWindowResize === "undefined" || listenWindowResize === true) {
      window.addEventListener("resize", () => {
        this.resize();
      });
    }

    if (typeof listenWindowMessage === "undefined" || listenWindowMessage === true) {
      window.addEventListener("message", e => {
        var data = e.data,
            source = e.source;
        this.hostWindow = source;
        var type = data.type;
        if (!type) return;

        if (type === "ui") {
          this.ui = data.ui;
        } else if (type === "param") {
          var _path = data.path,
              value = data.value;
          this.paramChangeByDSP(_path, value);
        }
      });
    }
  }
  /**
   * Render the UI to DOM root
   */


  mount() {
    this.componentMap = {};
    this.DOMroot.innerHTML = "";
    var props = {
      label: "",
      type: "vgroup",
      items: this.ui,
      style: {
        grid: this.grid,
        width: this.layout.width,
        height: this.layout.height,
        left: this.layout.offsetLeft,
        top: this.layout.offsetTop
      },
      isRoot: true,
      emitter: this
    };
    this.faustUIRoot = new _components_Group__WEBPACK_IMPORTED_MODULE_2__.Group(props);
    this.faustUIRoot.componentWillMount();
    this.faustUIRoot.mount();
    this.DOMroot.appendChild(this.faustUIRoot.container);
    this.faustUIRoot.componentDidMount();
  }
  /**
   * This method should be called by components to register itself to map.
   */


  register(path, item) {
    if (this.componentMap[path]) this.componentMap[path].push(item);else this.componentMap[path] = [item];
  }
  /**
   * Notify the component to change its value.
   */


  paramChangeByDSP(path, value) {
    if (this.componentMap[path]) this.componentMap[path].forEach(item => item.setState({
      value
    }));
  }
  /**
   * Can be overriden, called by components when its value is changed by user.
   */


  /**
   * Calculate UI layout in grid then calculate grid size.
   */
  calc() {
    var _Layout$calc = _layout_Layout__WEBPACK_IMPORTED_MODULE_0__.Layout.calc(this.ui),
        items = _Layout$calc.items,
        layout = _Layout$calc.layout;

    this._ui = items;
    this._layout = layout;
    this.calcGrid();
  }
  /**
   * Calculate grid size by DOM root size and layout size in grids.
   */


  calcGrid() {
    var _this$DOMroot$getBoun = this.DOMroot.getBoundingClientRect(),
        width = _this$DOMroot$getBoun.width,
        height = _this$DOMroot$getBoun.height;

    var grid = Math.max(40, Math.min(width / this._layout.width, height / this._layout.height));
    this.grid = grid;
    return grid;
  }
  /**
   * Force recalculate grid size and resize UI
   */


  resize() {
    if (!this.faustUIRoot) return;
    this.calcGrid();
    this.faustUIRoot.setState({
      style: {
        grid: this.grid
      }
    });
  }

  get ui() {
    return this._ui;
  }

  set ui(uiIn) {
    this._ui = uiIn;
    this.calc();
    this.mount();
  }

  get layout() {
    return this._layout;
  }

  get minWidth() {
    return this._layout.width * 40 + 1;
  }

  get minHeight() {
    return this._layout.height * 40 + 1;
  }

}

/***/ }),

/***/ "./src/components/AbstractComponent.ts":
/*!*********************************************!*\
  !*** ./src/components/AbstractComponent.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_8584__) => {

__nested_webpack_require_8584__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_8584__.d(__webpack_exports__, {
/* harmony export */   "AbstractComponent": () => (/* binding */ AbstractComponent)
/* harmony export */ });
/* harmony import */ var _shren_typed_event_emitter__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_8584__(/*! @shren/typed-event-emitter */ "./node_modules/@shren/typed-event-emitter/dist/index.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AbstractComponent extends _shren_typed_event_emitter__WEBPACK_IMPORTED_MODULE_0__.default {
  /**
   * The default state of the component.
   */
  get defaultProps() {
    return this.constructor.defaultProps;
  }
  /**
   * Here stores corrent state of component
   * change the state with `setState` method to fire state events
   * then UI parts will get notified and rerender
   */


  /**
   * Initiate default state with incoming state.
   */
  constructor(props) {
    super();

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "$frame", 0);

    _defineProperty(this, "frameReduce", 1);

    _defineProperty(this, "$raf", void 0);

    _defineProperty(this, "raf", () => {
      this.$frame++;

      if (this.$frame % this.frameReduce !== 0) {
        this.$raf = window.requestAnimationFrame(this.raf);
        return;
      }

      this.$raf = undefined;
      this.tasks.forEach(f => f());
      this.tasks = [];
    });

    _defineProperty(this, "tasks", []);

    this.state = _objectSpread(_objectSpread({}, this.defaultProps), props);
    return this;
  }
  /**
   * set internal state and fire events for UI parts subscribed
   */


  setState(newState) {
    var shouldUpdate = false;

    for (var stateKey in newState) {
      var stateValue = newState[stateKey];

      if (stateKey in this.state && this.state[stateKey] !== stateValue) {
        this.state[stateKey] = stateValue;
        shouldUpdate = true;
      } else return;

      if (shouldUpdate) this.emit(stateKey, this.state[stateKey]);
    }
  }
  /**
   * Use this method to request a new rendering
   * schedule what you need to do in next render tick in `raf` callback
   */


  schedule(func) {
    if (this.tasks.indexOf(func) === -1) this.tasks.push(func);
    if (this.$raf) return;
    this.$raf = window.requestAnimationFrame(this.raf);
  }

}

_defineProperty(AbstractComponent, "defaultProps", {});

/***/ }),

/***/ "./src/components/AbstractItem.ts":
/*!****************************************!*\
  !*** ./src/components/AbstractItem.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_12292__) => {

__nested_webpack_require_12292__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_12292__.d(__webpack_exports__, {
/* harmony export */   "AbstractItem": () => (/* binding */ AbstractItem)
/* harmony export */ });
/* harmony import */ var _Base_scss__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_12292__(/*! ./Base.scss */ "./src/components/Base.scss");
/* harmony import */ var _AbstractComponent__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_12292__(/*! ./AbstractComponent */ "./src/components/AbstractComponent.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_12292__(/*! ./utils */ "./src/components/utils.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable @typescript-eslint/no-unused-vars */



/**
 * Abstract class that describes a FaustUI Component
 * this is an event emitter that emits every state change to inform UI renderer parts
 * Each UI parts could subscribe to a specific state such as `value`, `min`, `max` or `style`
 * when the event subscribed is fired, this part of ui updated using its own handler without updating the rest of UI parts
 * the types of events is restricted to the same as keys of `state` object:
 * `state` object is a `FaustUIItemProps` with a `style` object that contains `T` defined by child class.
 * Child class can override life cycle methods
 * `componentWillMount` prepare data before DOM get loads to page
 * `mount` get DOMs append to page
 * `componentDidMount` Now draw canvas etc.
 */

class AbstractItem extends _AbstractComponent__WEBPACK_IMPORTED_MODULE_1__.AbstractComponent {
  /**
   * The default state of the component.
   */

  /**
   * DOM Div container of the component
   */

  /**
   * DOM Div container of label canvas
   */

  /**
   * Use canvas as label to fit full text in.
   */

  /**
   * Override this to get css work
   */

  /**
   * Default DOM event listeners, unify mousedown and touchstart events
   * For mouse or touch events, please use `handlePointerDown` `handlePointerUp` `handlePointerDrag` callbacks
   */

  /**
   * Initiate default state with incoming state.
   */
  constructor(props) {
    super(props);

    _defineProperty(this, "container", void 0);

    _defineProperty(this, "label", void 0);

    _defineProperty(this, "labelCanvas", void 0);

    _defineProperty(this, "labelCtx", void 0);

    _defineProperty(this, "className", void 0);

    _defineProperty(this, "frameReduce", 3);

    _defineProperty(this, "handleKeyDown", e => {});

    _defineProperty(this, "handleKeyUp", e => {});

    _defineProperty(this, "handleTouchStart", e => {
      e.preventDefault();
      var rect = e.currentTarget.getBoundingClientRect();
      var prevX = e.touches[0].pageX;
      var prevY = e.touches[0].pageY;
      var fromX = prevX - rect.left;
      var fromY = prevY - rect.top;
      var prevValue = this.state.value;
      this.handlePointerDown({
        x: fromX,
        y: fromY,
        originalEvent: e
      });

      var handleTouchMove = e => {
        e.preventDefault();
        var pageX = e.changedTouches[0].pageX;
        var pageY = e.changedTouches[0].pageY;
        var movementX = pageX - prevX;
        var movementY = pageY - prevY;
        prevX = pageX;
        prevY = pageY;
        var x = pageX - rect.left;
        var y = pageY - rect.top;
        this.handlePointerDrag({
          prevValue,
          x,
          y,
          fromX,
          fromY,
          movementX,
          movementY,
          originalEvent: e
        });
      };

      var handleTouchEnd = e => {
        e.preventDefault();
        var x = e.changedTouches[0].pageX - rect.left;
        var y = e.changedTouches[0].pageY - rect.top;
        this.handlePointerUp({
          x,
          y,
          originalEvent: e
        });
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false
      });
      document.addEventListener("touchend", handleTouchEnd, {
        passive: false
      });
    });

    _defineProperty(this, "handleWheel", e => {});

    _defineProperty(this, "handleClick", e => {});

    _defineProperty(this, "handleMouseDown", e => {
      e.preventDefault();
      e.currentTarget.focus();
      var rect = e.currentTarget.getBoundingClientRect();
      var fromX = e.pageX - rect.left;
      var fromY = e.pageY - rect.top;
      var prevValue = this.state.value;
      this.handlePointerDown({
        x: fromX,
        y: fromY,
        originalEvent: e
      });

      var handleMouseMove = e => {
        e.preventDefault();
        var x = e.pageX - rect.left;
        var y = e.pageY - rect.top;
        this.handlePointerDrag({
          prevValue,
          x,
          y,
          fromX,
          fromY,
          movementX: e.movementX,
          movementY: e.movementY,
          originalEvent: e
        });
      };

      var handleMouseUp = e => {
        e.preventDefault();
        var x = e.pageX - rect.left;
        var y = e.pageY - rect.top;
        this.handlePointerUp({
          x,
          y,
          originalEvent: e
        });
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });

    _defineProperty(this, "handleMouseOver", e => {});

    _defineProperty(this, "handleMouseOut", e => {});

    _defineProperty(this, "handleContextMenu", e => {});

    _defineProperty(this, "handlePointerDown", e => {});

    _defineProperty(this, "handlePointerDrag", e => {});

    _defineProperty(this, "handlePointerUp", e => {});

    _defineProperty(this, "handleFocusIn", e => this.setState({
      focus: true
    }));

    _defineProperty(this, "handleFocusOut", e => this.setState({
      focus: false
    }));

    this.state.style = _objectSpread(_objectSpread({}, this.defaultProps.style), props.style);
    if (this.state.emitter) this.state.emitter.register(this.state.address, this);
    return this;
  }
  /**
   * Get a nearest valid number
   */


  toValidNumber(value) {
    var _this$state = this.state,
        min = _this$state.min,
        max = _this$state.max,
        step = _this$state.step;
    if (typeof min !== "number" || typeof max !== "number") return value;
    var v = Math.min(max, Math.max(min, value));
    if (!step) return v;
    return min + Math.floor((v - min) / step) * step;
  }
  /**
   * Use this method if you want the emitter to send value to DSP
   */


  setValue(valueIn) {
    var value = this.toValidNumber(valueIn);
    var changed = this.setState({
      value
    });
    if (changed) this.change(value);
    return changed;
  }
  /**
   * Send value to DSP
   */


  change(valueIn) {
    if (this.state.emitter) this.state.emitter.paramChangeByUI(this.state.address, typeof valueIn === "number" ? valueIn : this.state.value);
  }
  /**
   * set internal state and fire events for UI parts subscribed
   * This will not send anything to DSP
   * @returns is state updated
   */


  setState(newState) {
    var shouldUpdate = false;

    for (var _key in newState) {
      var stateKey = _key;
      var stateValue = newState[stateKey];

      if (stateKey === "style") {
        for (var styleKey in newState.style) {
          if (styleKey in this.state.style && this.state.style[styleKey] !== newState.style[styleKey]) {
            this.state.style[styleKey] = newState.style[styleKey];
            shouldUpdate = true;
          }
        }
      } else if (stateKey in this.state && this.state[stateKey] !== stateValue) {
        this.state[stateKey] = stateValue;
        shouldUpdate = true;
      } else return false;

      if (shouldUpdate) this.emit(stateKey, this.state[stateKey]);
    }

    return shouldUpdate;
  }
  /**
   * Create container with class name
   * override it with `super.componentWillMount();`
   */


  componentWillMount() {
    this.container = document.createElement("div");
    this.container.className = ["faust-ui-component", "faust-ui-component-" + this.className].join(" ");
    this.container.tabIndex = 1;
    this.container.id = this.state.address;
    if (this.state.tooltip) this.container.title = this.state.tooltip;
    this.label = document.createElement("div");
    this.label.className = "faust-ui-component-label";
    this.labelCanvas = document.createElement("canvas");
    this.labelCtx = this.labelCanvas.getContext("2d");
    return this;
  }
  /**
   * Here append all child DOM to container
   */


  mount() {
    this.label.appendChild(this.labelCanvas);
    return this;
  }

  paintLabel(align) {
    var label = this.state.label;
    var color = this.state.style.labelcolor;
    var ctx = this.labelCtx;
    var canvas = this.labelCanvas;

    var _this$label$getBoundi = this.label.getBoundingClientRect(),
        width = _this$label$getBoundi.width,
        height = _this$label$getBoundi.height;

    if (!width || !height) return this;
    width = Math.floor(width);
    height = Math.floor(height);
    canvas.height = height;
    canvas.width = width;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = align || "center";
    ctx.font = "bold ".concat(height * 0.9, "px -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"");
    ctx.fillText(label, align === "left" ? 0 : align === "right" ? width : width / 2, height / 2, width);
    return this;
  }
  /**
   * will call this method when mounted
   */


  componentDidMount() {
    var handleResize = () => {
      var _this$state$style = this.state.style,
          grid = _this$state$style.grid,
          left = _this$state$style.left,
          top = _this$state$style.top,
          width = _this$state$style.width,
          height = _this$state$style.height;
      this.container.style.width = "".concat(width * grid, "px");
      this.container.style.height = "".concat(height * grid, "px");
      this.container.style.left = "".concat(left * grid, "px");
      this.container.style.top = "".concat(top * grid, "px");
      this.label.style.height = "".concat(grid * 0.25, "px");
      this.paintLabel();
    };

    this.on("style", () => this.schedule(handleResize));
    handleResize();
    return this;
  }
  /**
   * Count steps in range min-max with step
   */


  get stepsCount() {
    var _this$state2 = this.state,
        type = _this$state2.type,
        max = _this$state2.max,
        min = _this$state2.min,
        step = _this$state2.step,
        enums = _this$state2.enums;
    var maxSteps = type === "enum" ? enums.length : type === "int" ? max - min : (max - min) / step;

    if (step) {
      if (type === "enum") return enums.length;
      if (type === "int") return Math.min(Math.floor((max - min) / (Math.round(step) || 1)), maxSteps);
      return Math.floor((max - min) / step);
    }

    return maxSteps;
  }
  /**
   * Normalized value between 0 - 1.
   */


  get distance() {
    var _this$state3 = this.state,
        type = _this$state3.type,
        max = _this$state3.max,
        min = _this$state3.min,
        value = _this$state3.value,
        enums = _this$state3.enums,
        scale = _this$state3.scale;
    return AbstractItem.getDistance({
      type,
      max,
      min,
      value,
      enums,
      scale
    });
  }

  static getDistance(state) {
    var type = state.type,
        max = state.max,
        min = state.min,
        value = state.value,
        enums = state.enums,
        scale = state.scale;
    if (type === "enum") return value / (enums.length - 1);
    var v = scale === "exp" ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.normLog)(value, min, max) : scale === "log" ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.normExp)(value, min, max) : value;
    return (0,_utils__WEBPACK_IMPORTED_MODULE_2__.normalize)(v, min, max);
  }
  /**
   * Mousemove pixels for each step
   */


  get stepRange() {
    var full = 100;
    var stepsCount = this.stepsCount;
    return full / stepsCount;
  }

}

_defineProperty(AbstractItem, "defaultProps", {
  value: 0,
  active: true,
  focus: false,
  label: "",
  address: "",
  min: 0,
  max: 1,
  enums: {},
  type: "float",
  unit: "",
  scale: "linear",
  step: 0.01,
  style: {
    width: 45,
    height: 15,
    left: 0,
    top: 0,
    labelcolor: "rgba(226, 222, 255, 0.5)"
  }
});

/***/ }),

/***/ "./src/components/Button.ts":
/*!**********************************!*\
  !*** ./src/components/Button.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_26286__) => {

__nested_webpack_require_26286__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_26286__.d(__webpack_exports__, {
/* harmony export */   "Button": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_26286__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Button_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_26286__(/*! ./Button.scss */ "./src/components/Button.scss");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Button extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "button");

    _defineProperty(this, "btn", void 0);

    _defineProperty(this, "span", void 0);

    _defineProperty(this, "setStyle", () => {
      var _this$state = this.state,
          value = _this$state.value,
          style = _this$state.style;
      var height = style.height,
          grid = style.grid,
          fontsize = style.fontsize,
          fontname = style.fontname,
          fontface = style.fontface,
          textcolor = style.textcolor,
          textoncolor = style.textoncolor,
          bgoncolor = style.bgoncolor,
          bgcolor = style.bgcolor,
          bordercolor = style.bordercolor,
          borderoncolor = style.borderoncolor;
      this.btn.style.backgroundColor = value ? bgoncolor : bgcolor;
      this.btn.style.borderColor = value ? borderoncolor : bordercolor;
      this.btn.style.color = value ? textoncolor : textcolor;
      this.btn.style.fontSize = "".concat(fontsize || height * grid / 4, "px");
      this.btn.style.fontFamily = "".concat(fontname, ", sans-serif");
      this.btn.style.fontStyle = fontface;
    });

    _defineProperty(this, "handlePointerDown", () => {
      this.setValue(1);
    });

    _defineProperty(this, "handlePointerUp", () => {
      this.setValue(0);
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "normal",
        bgcolor: "rgba(40, 40, 40, 1)",
        bgoncolor: "rgba(18, 18, 18, 1)",
        bordercolor: "rgba(80, 80, 80, 1)",
        borderoncolor: "rgba(255, 165, 0, 1)",
        textcolor: "rgba(226, 222, 255, 0.5)",
        textoncolor: "rgba(255, 165, 0, 1)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.btn = document.createElement("div");
    this.span = document.createElement("span");
    this.span.innerText = this.state.label;
    this.setStyle();
    return this;
  }

  mount() {
    this.btn.appendChild(this.span);
    this.container.appendChild(this.btn);
    return super.mount();
  }

  componentDidMount() {
    super.componentDidMount();
    this.btn.addEventListener("mousedown", this.handleMouseDown);
    this.btn.addEventListener("touchstart", this.handleTouchStart);
    this.on("style", () => this.schedule(this.setStyle));

    var labelChange = () => this.span.innerText = this.state.label;

    this.on("label", () => this.schedule(labelChange));
    this.on("value", () => this.schedule(this.setStyle));
    return this;
  }

}

/***/ }),

/***/ "./src/components/Checkbox.ts":
/*!************************************!*\
  !*** ./src/components/Checkbox.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_30931__) => {

__nested_webpack_require_30931__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_30931__.d(__webpack_exports__, {
/* harmony export */   "Checkbox": () => (/* binding */ Checkbox)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_30931__(/*! ./Button */ "./src/components/Button.ts");
/* harmony import */ var _Checkbox_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_30931__(/*! ./Checkbox.scss */ "./src/components/Checkbox.scss");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Checkbox extends _Button__WEBPACK_IMPORTED_MODULE_0__.Button {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "checkbox");

    _defineProperty(this, "handlePointerDown", () => {
      this.setValue(1 - this.state.value);
    });

    _defineProperty(this, "handlePointerUp", () => {});
  }

}

/***/ }),

/***/ "./src/components/Group.ts":
/*!*********************************!*\
  !*** ./src/components/Group.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_32205__) => {

__nested_webpack_require_32205__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_32205__.d(__webpack_exports__, {
/* harmony export */   "Group": () => (/* binding */ Group)
/* harmony export */ });
/* harmony import */ var _AbstractComponent__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_32205__(/*! ./AbstractComponent */ "./src/components/AbstractComponent.ts");
/* harmony import */ var _HSlider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_32205__(/*! ./HSlider */ "./src/components/HSlider.ts");
/* harmony import */ var _VSlider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_32205__(/*! ./VSlider */ "./src/components/VSlider.ts");
/* harmony import */ var _Nentry__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_32205__(/*! ./Nentry */ "./src/components/Nentry.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_32205__(/*! ./Button */ "./src/components/Button.ts");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_32205__(/*! ./Checkbox */ "./src/components/Checkbox.ts");
/* harmony import */ var _Knob__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_32205__(/*! ./Knob */ "./src/components/Knob.ts");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_32205__(/*! ./Menu */ "./src/components/Menu.ts");
/* harmony import */ var _Radio__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_32205__(/*! ./Radio */ "./src/components/Radio.ts");
/* harmony import */ var _Led__WEBPACK_IMPORTED_MODULE_9__ = __nested_webpack_require_32205__(/*! ./Led */ "./src/components/Led.ts");
/* harmony import */ var _Numerical__WEBPACK_IMPORTED_MODULE_10__ = __nested_webpack_require_32205__(/*! ./Numerical */ "./src/components/Numerical.ts");
/* harmony import */ var _HBargraph__WEBPACK_IMPORTED_MODULE_11__ = __nested_webpack_require_32205__(/*! ./HBargraph */ "./src/components/HBargraph.ts");
/* harmony import */ var _VBargraph__WEBPACK_IMPORTED_MODULE_12__ = __nested_webpack_require_32205__(/*! ./VBargraph */ "./src/components/VBargraph.ts");
/* harmony import */ var _layout_Layout__WEBPACK_IMPORTED_MODULE_13__ = __nested_webpack_require_32205__(/*! ../layout/Layout */ "./src/layout/Layout.ts");
/* harmony import */ var _Group_scss__WEBPACK_IMPORTED_MODULE_14__ = __nested_webpack_require_32205__(/*! ./Group.scss */ "./src/components/Group.scss");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
















class Group extends _AbstractComponent__WEBPACK_IMPORTED_MODULE_0__.AbstractComponent {
  constructor() {
    super(...arguments);

    _defineProperty(this, "container", void 0);

    _defineProperty(this, "label", void 0);

    _defineProperty(this, "labelCanvas", void 0);

    _defineProperty(this, "labelCtx", void 0);

    _defineProperty(this, "tabs", void 0);

    _defineProperty(this, "children", void 0);

    _defineProperty(this, "layout", void 0);

    _defineProperty(this, "updateUI", () => {
      this.children = [];
      var _this$state = this.state,
          style = _this$state.style,
          type = _this$state.type,
          items = _this$state.items,
          emitter = _this$state.emitter,
          isRoot = _this$state.isRoot;
      var grid = style.grid,
          left = style.left,
          top = style.top,
          width = style.width,
          height = style.height;
      this.label.style.height = "".concat(grid * 0.3, "px");
      this.container.style.left = "".concat(left * grid, "px");
      this.container.style.top = "".concat(top * grid, "px");
      this.container.style.width = "".concat(width * grid, "px");
      this.container.style.height = "".concat(height * grid, "px");
      this.container.className = ["faust-ui-group", "faust-ui-".concat(type), "".concat(isRoot ? "faust-ui-root" : "")].join(" ");
      items.forEach(item => {
        if (item.type.endsWith("group")) {
          var component = Group.getComponent(item, emitter, grid);
          if (component) this.children.push(component);
        } else {
          var ioItem = item;
          var itemComponent = Group.getComponent(ioItem, this.state.emitter, grid);
          if (itemComponent) this.children.push(itemComponent);
        }
      });

      if (type === "tgroup") {
        this.tabs.innerHTML = "";
        this.tabs.style.height = "".concat(grid, "px");
        this.tabs.style.top = "".concat(0.25 * grid, "px");
        this.state.items.forEach((item, i) => {
          var label = item.label;
          var tab = document.createElement("span");
          tab.innerText = label;
          tab.className = "faust-ui-tgroup-tab";
          tab.style.fontSize = "".concat(0.25 * grid, "px");
          tab.style.width = "".concat(2 * grid - 20, "px");
          tab.style.height = "".concat(grid - 20, "px");
          tab.style.lineHeight = "".concat(grid - 20, "px");
          tab.addEventListener("click", () => {
            var groups = [];

            for (var j = 0; j < this.container.children.length; j++) {
              var element = this.container.children[j];
              if (j > 1) groups.push(element);
            }

            for (var _j = 0; _j < groups.length; _j++) {
              var _element = groups[_j];
              _element.style.visibility = i === _j ? "visible" : "hidden";
            }

            for (var _j2 = 0; _j2 < this.tabs.children.length; _j2++) {
              var e = this.tabs.children[_j2];

              if (i !== _j2) {
                if (e.classList.contains("active")) e.classList.remove("active");
              } else e.classList.add("active");
            }
          });
          this.tabs.appendChild(tab);
        });
      }
    });
  }

  static parseMeta(metaIn) {
    var metaObject = {};
    if (!metaIn) return {
      metaObject
    };
    metaIn.forEach(m => Object.assign(metaObject, m));

    if (metaObject.style) {
      var enumsRegex = /\{(?:(?:'|_)(.+?)(?:'|_):([-+]?[0-9]*\.?[0-9]+?);)+(?:(?:'|_)(.+?)(?:'|_):([-+]?[0-9]*\.?[0-9]+?))\}/;
      var matched = metaObject.style.match(enumsRegex);

      if (matched) {
        var itemsRegex = /(?:(?:'|_)(.+?)(?:'|_):([-+]?[0-9]*\.?[0-9]+?))/g;
        var enums = {};
        var item; // eslint-disable-next-line no-cond-assign

        while (item = itemsRegex.exec(matched[0])) {
          enums[item[1]] = +item[2];
        }

        return {
          metaObject,
          enums
        };
      }
    }

    return {
      metaObject
    };
  }

  static getComponent(item, emitter, grid) {
    var type = _layout_Layout__WEBPACK_IMPORTED_MODULE_13__.Layout.predictType(item);

    if (type.endsWith("group")) {
      var _ref = item,
          _label = _ref.label,
          items = _ref.items,
          _type = _ref.type,
          _layout = _ref.layout;
      var _props = {
        label: _label,
        type: _type,
        items,
        style: {
          grid,
          width: _layout.width,
          height: _layout.height,
          left: _layout.offsetLeft,
          top: _layout.offsetTop,
          labelcolor: "rgba(255, 255, 255, 0.7)"
        },
        emitter
      };
      return new Group(_props);
    }

    var ioItem = item;

    var _this$parseMeta = this.parseMeta(ioItem.meta),
        metaObject = _this$parseMeta.metaObject,
        enums = _this$parseMeta.enums;

    var tooltip = metaObject.tooltip,
        unit = metaObject.unit,
        scale = metaObject.scale;
    var label = ioItem.label,
        min = ioItem.min,
        max = ioItem.max,
        address = ioItem.address,
        layout = ioItem.layout;
    var props = {
      label,
      address,
      tooltip,
      unit,
      scale: scale || "linear",
      emitter,
      enums,
      style: {
        grid,
        width: layout.width,
        height: layout.height,
        left: layout.offsetLeft,
        top: layout.offsetTop
      },
      type: "float",
      min: isFinite(min) ? min : 0,
      max: isFinite(max) ? max : 1,
      step: "step" in item ? +item.step : 1,
      value: "init" in item ? +item.init || 0 : 0
    };
    if (type === "button") return new _Button__WEBPACK_IMPORTED_MODULE_4__.Button(props);
    if (type === "checkbox") return new _Checkbox__WEBPACK_IMPORTED_MODULE_5__.Checkbox(props);
    if (type === "nentry") return new _Nentry__WEBPACK_IMPORTED_MODULE_3__.Nentry(props);
    if (type === "knob") return new _Knob__WEBPACK_IMPORTED_MODULE_6__.Knob(props);
    if (type === "menu") return new _Menu__WEBPACK_IMPORTED_MODULE_7__.Menu(props);
    if (type === "radio") return new _Radio__WEBPACK_IMPORTED_MODULE_8__.Radio(props);
    if (type === "hslider") return new _HSlider__WEBPACK_IMPORTED_MODULE_1__.HSlider(props);
    if (type === "vslider") return new _VSlider__WEBPACK_IMPORTED_MODULE_2__.VSlider(props);
    if (type === "hbargraph") return new _HBargraph__WEBPACK_IMPORTED_MODULE_11__.HBargraph(props);
    if (type === "vbargraph") return new _VBargraph__WEBPACK_IMPORTED_MODULE_12__.VBargraph(props);
    if (type === "numerical") return new _Numerical__WEBPACK_IMPORTED_MODULE_10__.Numerical(props);
    if (type === "led") return new _Led__WEBPACK_IMPORTED_MODULE_9__.Led(props);
    return null;
  }
  /**
   * DOM Div container of the group
   */


  setState(newState) {
    var shouldUpdate = false;

    for (var _key in newState) {
      var stateKey = _key;
      var stateValue = newState[stateKey];

      if (stateKey === "style") {
        for (var _key2 in newState.style) {
          var styleKey = _key2;

          if (styleKey in this.state.style && this.state.style[styleKey] !== newState.style[styleKey]) {
            this.state.style[styleKey] = newState.style[styleKey];
            shouldUpdate = true;
          }
        }
      } else if (stateKey in this.state && this.state[stateKey] !== stateValue) {
        this.state[stateKey] = stateValue;
        shouldUpdate = true;
      } else return;

      if (shouldUpdate) this.emit(stateKey, this.state[stateKey]);
    }
  }

  componentWillMount() {
    this.container = document.createElement("div");
    this.tabs = document.createElement("div");
    this.tabs.className = "faust-ui-tgroup-tabs";
    this.label = document.createElement("div");
    this.label.className = "faust-ui-group-label";
    this.labelCanvas = document.createElement("canvas");
    this.labelCtx = this.labelCanvas.getContext("2d");
    this.updateUI();
    this.children.forEach(item => item.componentWillMount());
    return this;
  }

  paintLabel() {
    var label = this.state.label;
    var color = this.state.style.labelcolor;
    var ctx = this.labelCtx;
    var canvas = this.labelCanvas;

    var _this$label$getBoundi = this.label.getBoundingClientRect(),
        width = _this$label$getBoundi.width,
        height = _this$label$getBoundi.height;

    if (!width || !height) return this;
    width = Math.floor(width);
    height = Math.floor(height);
    canvas.height = height;
    canvas.width = width;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.font = "bold ".concat(height * 0.9, "px -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"");
    ctx.fillText(label, 0, height / 2, width);
    return this;
  }

  mount() {
    this.label.appendChild(this.labelCanvas);
    this.container.appendChild(this.label);
    if (this.tabs.children.length) this.container.appendChild(this.tabs);
    this.children.forEach(item => {
      item.mount();
      this.container.appendChild(item.container);
    });
    return this;
  }

  componentDidMount() {
    var handleResize = () => {
      var _this$state$style = this.state.style,
          grid = _this$state$style.grid,
          left = _this$state$style.left,
          top = _this$state$style.top,
          width = _this$state$style.width,
          height = _this$state$style.height;
      this.label.style.height = "".concat(grid * 0.3, "px");
      this.container.style.width = "".concat(width * grid, "px");
      this.container.style.height = "".concat(height * grid, "px");
      this.container.style.left = "".concat(left * grid, "px");
      this.container.style.top = "".concat(top * grid, "px");

      if (this.state.type === "tgroup") {
        this.tabs.style.height = "".concat(grid, "px");
        this.tabs.style.top = "".concat(0.25 * grid, "px");

        for (var i = 0; i < this.tabs.children.length; i++) {
          var tab = this.tabs.children[i];
          tab.style.fontSize = "".concat(0.25 * grid, "px");
          tab.style.width = "".concat(2 * grid - 20, "px");
          tab.style.height = "".concat(grid - 20, "px");
          tab.style.lineHeight = "".concat(grid - 20, "px");
        }
      }

      this.paintLabel();
      this.children.forEach(item => item.setState({
        style: {
          grid
        }
      }));
    };

    this.on("style", () => this.schedule(handleResize));

    var itemsChange = () => {
      this.updateUI();
      this.children.forEach(item => item.componentWillMount());
    };

    this.on("items", () => this.schedule(itemsChange));

    var labelChange = () => {
      this.paintLabel();
      this.label.title = this.state.label;
    };

    this.on("label", () => this.schedule(labelChange));
    this.paintLabel();
    if (this.tabs && this.tabs.children.length) this.tabs.children[0].click();
    this.children.forEach(item => item.componentDidMount());
    return this;
  }

}

/***/ }),

/***/ "./src/components/HBargraph.ts":
/*!*************************************!*\
  !*** ./src/components/HBargraph.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_46069__) => {

__nested_webpack_require_46069__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_46069__.d(__webpack_exports__, {
/* harmony export */   "HBargraph": () => (/* binding */ HBargraph)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_46069__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _HBargraph_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_46069__(/*! ./HBargraph.scss */ "./src/components/HBargraph.scss");
/* harmony import */ var _VBargraph__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_46069__(/*! ./VBargraph */ "./src/components/VBargraph.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class HBargraph extends _VBargraph__WEBPACK_IMPORTED_MODULE_2__.VBargraph {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "hbargraph");

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          height = _this$state$style.height,
          grid = _this$state$style.grid,
          fontsize = _this$state$style.fontsize,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      this.input.style.fontSize = "".concat(fontsize || height * grid * 0.2, "px");
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    });

    _defineProperty(this, "paint", () => {
      var _this$state$style2 = this.state.style,
          barwidth = _this$state$style2.barwidth,
          barbgcolor = _this$state$style2.barbgcolor,
          coldcolor = _this$state$style2.coldcolor,
          warmcolor = _this$state$style2.warmcolor,
          hotcolor = _this$state$style2.hotcolor,
          overloadcolor = _this$state$style2.overloadcolor;
      var _this$state = this.state,
          type = _this$state.type,
          max = _this$state.max,
          min = _this$state.min,
          enums = _this$state.enums,
          scale = _this$state.scale,
          value = _this$state.value;
      var ctx = this.ctx;
      var canvas = this.canvas;

      var _this$canvasDiv$getBo = this.canvasDiv.getBoundingClientRect(),
          width = _this$canvasDiv$getBo.width,
          height = _this$canvasDiv$getBo.height;

      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      var drawWidth = width * 0.9;
      var drawHeight = barwidth || Math.min(height / 3, drawWidth * 0.05);
      var left = width * 0.05;
      var top = (height - drawHeight) * 0.5;
      this.paintValue = value;
      var paintValue = this.paintValue;

      if (paintValue > this.maxValue) {
        this.maxValue = paintValue;
        if (this.maxTimer) window.clearTimeout(this.maxTimer);
        this.maxTimer = window.setTimeout(() => {
          this.maxValue = this.paintValue;
          this.maxTimer = undefined;
          this.schedule(this.paint);
        }, 1000);
      }

      if (paintValue < this.maxValue && typeof this.maxTimer === "undefined") {
        this.maxTimer = window.setTimeout(() => {
          this.maxValue = this.paintValue;
          this.maxTimer = undefined;
          this.schedule(this.paint);
        }, 1000);
      }

      var maxValue = this.maxValue;
      var coldStop = (-18 - min) / (max - min);
      var warmStop = (-6 - min) / (max - min);
      var hotStop = (-3 - min) / (max - min);
      var overloadStop = Math.max(0, -min / (max - min));
      var gradient = ctx.createLinearGradient(left, 0, drawWidth, 0);
      if (coldStop <= 1 && coldStop >= 0) gradient.addColorStop(coldStop, coldcolor);else if (coldStop > 1) gradient.addColorStop(1, coldcolor);
      if (warmStop <= 1 && warmStop >= 0) gradient.addColorStop(warmStop, warmcolor);
      if (hotStop <= 1 && hotStop >= 0) gradient.addColorStop(hotStop, hotcolor);
      if (overloadStop <= 1 && overloadStop >= 0) gradient.addColorStop(overloadStop, overloadcolor);else if (overloadStop < 0) gradient.addColorStop(0, coldcolor);
      ctx.fillStyle = barbgcolor;
      if (paintValue < 0) ctx.fillRect(left, top, drawWidth * overloadStop, drawHeight);
      if (paintValue < max) ctx.fillRect(left + drawWidth * overloadStop + 1, top, drawWidth * (1 - overloadStop) - 1, drawHeight);
      ctx.fillStyle = gradient;

      if (paintValue > min) {
        var distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
          type,
          max,
          min,
          enums,
          scale,
          value: Math.min(0, paintValue)
        }));
        ctx.fillRect(left, top, distance * drawWidth, drawHeight);
      }

      if (paintValue > 0) {
        var _distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
          type,
          max,
          min,
          enums,
          scale,
          value: Math.min(max, paintValue)
        }) - overloadStop);

        ctx.fillRect(left + overloadStop * drawWidth + 1, top, _distance * drawWidth - 1, drawHeight);
      }

      if (maxValue > paintValue) {
        if (maxValue <= 0) {
          var _distance2 = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
            type,
            max,
            min,
            enums,
            scale,
            value: Math.min(0, maxValue)
          }));

          ctx.fillRect(left + _distance2 * drawWidth - 1, top, 1, drawHeight);
        }

        if (maxValue > 0) {
          var _distance3 = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
            type,
            max,
            min,
            enums,
            scale,
            value: Math.min(max, maxValue)
          }) - overloadStop);

          ctx.fillRect(left + Math.min(drawWidth - 1, (overloadStop + _distance3) * drawWidth), top, 1, drawHeight);
        }
      }
    });
  }

  paintLabel() {
    return super.paintLabel("left");
  }

}

/***/ }),

/***/ "./src/components/HSlider.ts":
/*!***********************************!*\
  !*** ./src/components/HSlider.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_52591__) => {

__nested_webpack_require_52591__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_52591__.d(__webpack_exports__, {
/* harmony export */   "HSlider": () => (/* binding */ HSlider)
/* harmony export */ });
/* harmony import */ var _HSlider_scss__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_52591__(/*! ./HSlider.scss */ "./src/components/HSlider.scss");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_52591__(/*! ./utils */ "./src/components/utils.ts");
/* harmony import */ var _VSlider__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_52591__(/*! ./VSlider */ "./src/components/VSlider.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class HSlider extends _VSlider__WEBPACK_IMPORTED_MODULE_2__.VSlider {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "hslider");

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          height = _this$state$style.height,
          grid = _this$state$style.grid,
          fontsize = _this$state$style.fontsize,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      this.input.style.fontSize = "".concat(fontsize || height * grid * 0.2, "px");
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    });

    _defineProperty(this, "paint", () => {
      var _this$state$style2 = this.state.style,
          sliderwidth = _this$state$style2.sliderwidth,
          sliderbgcolor = _this$state$style2.sliderbgcolor,
          sliderbgoncolor = _this$state$style2.sliderbgoncolor,
          slidercolor = _this$state$style2.slidercolor;
      var ctx = this.ctx;
      var canvas = this.canvas;
      var distance = this.distance;

      var _this$canvasDiv$getBo = this.canvasDiv.getBoundingClientRect(),
          width = _this$canvasDiv$getBo.width,
          height = _this$canvasDiv$getBo.height;

      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      var drawWidth = width * 0.9;
      var drawHeight = sliderwidth || Math.min(height / 3, drawWidth * 0.05);
      var left = width * 0.05;
      var top = (height - drawHeight) * 0.5;
      var borderRadius = drawHeight * 0.25;
      this.interactionRect = [left, 0, drawWidth, height];
      var grd = ctx.createLinearGradient(left, 0, left + drawWidth, 0);
      grd.addColorStop(Math.max(0, Math.min(1, distance)), sliderbgoncolor);
      grd.addColorStop(Math.max(0, Math.min(1, distance)), sliderbgcolor);
      ctx.fillStyle = grd;
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__.fillRoundedRect)(ctx, left, top, drawWidth, drawHeight, borderRadius); // draw slider

      ctx.fillStyle = slidercolor;
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__.fillRoundedRect)(ctx, left + drawWidth * distance - drawHeight, top - drawHeight, drawHeight * 2, drawHeight * 3, borderRadius);
    });
  }

  paintLabel() {
    return super.paintLabel("left");
  }

}

/***/ }),

/***/ "./src/components/Knob.ts":
/*!********************************!*\
  !*** ./src/components/Knob.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_56121__) => {

__nested_webpack_require_56121__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_56121__.d(__webpack_exports__, {
/* harmony export */   "Knob": () => (/* binding */ Knob)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_56121__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Knob_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_56121__(/*! ./Knob.scss */ "./src/components/Knob.scss");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_56121__(/*! ./utils */ "./src/components/utils.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Knob extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "knob");

    _defineProperty(this, "canvas", void 0);

    _defineProperty(this, "inputNumber", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "ctx", void 0);

    _defineProperty(this, "handleChange", e => {
      var value = parseFloat(e.currentTarget.value);

      if (isFinite(value)) {
        var changed = this.setValue(+this.inputNumber.value);
        if (changed) return;
      }

      this.input.value = this.inputNumber.value + (this.state.unit || "");
    });

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          fontsize = _this$state$style.fontsize,
          height = _this$state$style.height,
          grid = _this$state$style.grid,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      this.input.style.fontSize = "".concat(fontsize || height * grid * 0.1, "px");
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    });

    _defineProperty(this, "paint", () => {
      var _this$state$style2 = this.state.style,
          knobwidth = _this$state$style2.knobwidth,
          knobcolor = _this$state$style2.knobcolor,
          knoboncolor = _this$state$style2.knoboncolor,
          needlecolor = _this$state$style2.needlecolor;
      var ctx = this.ctx;
      var canvas = this.canvas;
      var distance = this.distance;

      var _this$canvas$getBound = this.canvas.getBoundingClientRect(),
          width = _this$canvas$getBound.width,
          height = _this$canvas$getBound.height;

      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      var start = 5 / 8 * Math.PI;
      var end = 19 / 8 * Math.PI;
      var valPos = start + (0,_utils__WEBPACK_IMPORTED_MODULE_2__.toRad)(distance * 315);
      var dialHeight = Math.min(width, height) * 0.75;
      var dialRadius = dialHeight * 0.5;
      var dialCenterX = width * 0.5;
      var dialCenterY = height * 0.5; // const arcStartX = dialCenterX + (dialHeight * 0.5 * Math.cos(start));
      // const arcStartY = dialCenterY + (dialHeight * 0.5 * Math.sin(start));
      // const arcEndX = dialCenterX + (dialHeight * 0.5 * Math.cos(end));
      // const arcEndY = dialCenterY + (dialHeight * 0.5 * Math.sin(end));

      var valuePosX = dialCenterX + dialHeight * 0.5 * Math.cos(valPos);
      var valuePosY = dialCenterY + dialHeight * 0.5 * Math.sin(valPos);
      var lineWidth = knobwidth || dialRadius * 0.2;
      ctx.strokeStyle = knobcolor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round"; // draw background arc

      ctx.beginPath();
      ctx.arc(dialCenterX, dialCenterY, dialRadius, valPos, end);
      ctx.stroke(); // draw value arc

      if (distance) {
        ctx.strokeStyle = knoboncolor;
        ctx.beginPath();
        ctx.arc(dialCenterX, dialCenterY, dialRadius, start, valPos);
        ctx.stroke();
      } // draw dial needle


      ctx.strokeStyle = needlecolor;
      ctx.beginPath();
      ctx.moveTo(dialCenterX, dialCenterY);
      ctx.lineTo(valuePosX, valuePosY);
      ctx.stroke();
    });

    _defineProperty(this, "handlePointerDrag", e => {
      var newValue = this.getValueFromDelta(e);
      if (newValue !== this.state.value) this.setValue(newValue);
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "regular",
        bgcolor: "rgba(18, 18, 18, 0)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)",
        knobwidth: undefined,
        knobcolor: "rgba(18, 18, 18, 1)",
        knoboncolor: "rgba(255, 165, 0, 1)",
        needlecolor: "rgba(200, 200, 200, 0.75)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.canvas = document.createElement("canvas");
    this.canvas.width = 10;
    this.canvas.height = 10;
    this.ctx = this.canvas.getContext("2d");
    this.inputNumber = document.createElement("input");
    this.inputNumber.type = "number";
    this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
    this.inputNumber.max = this.state.max.toString();
    this.inputNumber.min = this.state.min.toString();
    this.inputNumber.step = this.state.step.toString();
    this.input = document.createElement("input");
    this.input.value = this.inputNumber.value + (this.state.unit || "");
    this.input.spellcheck = false;
    this.setStyle();
    return this;
  }

  componentDidMount() {
    super.componentDidMount();
    this.input.addEventListener("change", this.handleChange);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, {
      passive: false
    });
    this.on("style", () => {
      this.schedule(this.setStyle);
      this.schedule(this.paint);
    });
    this.on("label", () => this.schedule(this.paintLabel));

    var valueChange = () => {
      this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
      this.input.value = this.inputNumber.value + (this.state.unit || "");
    };

    this.on("value", () => {
      this.schedule(valueChange);
      this.schedule(this.paint);
    });

    var maxChange = () => this.inputNumber.max = this.state.max.toString();

    this.on("max", () => {
      this.schedule(maxChange);
      this.schedule(this.paint);
    });

    var minChange = () => this.inputNumber.min = this.state.min.toString();

    this.on("min", () => {
      this.schedule(minChange);
      this.schedule(this.paint);
    });

    var stepChange = () => this.inputNumber.step = this.state.step.toString();

    this.on("step", () => {
      this.schedule(stepChange);
      this.schedule(this.paint);
    });
    this.schedule(this.paint);
    return this;
  }

  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.input);
    return super.mount();
  }

  getValueFromDelta(e) {
    var _this$state = this.state,
        type = _this$state.type,
        min = _this$state.min,
        max = _this$state.max,
        enums = _this$state.enums,
        scale = _this$state.scale;
    var step = type === "enum" ? 1 : this.state.step || 1;
    var stepRange = this.stepRange;
    var stepsCount = this.stepsCount;
    var range = 100;
    var prevDistance = _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
      value: e.prevValue,
      type,
      min,
      max,
      enums,
      scale
    }) * range;
    var distance = prevDistance + e.fromY - e.y;
    var denormalized = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.denormalize)(distance / range, min, max);
    var v = scale === "exp" ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.normExp)(denormalized, min, max) : scale === "log" ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.normLog)(denormalized, min, max) : denormalized;
    var steps = Math.round((0,_utils__WEBPACK_IMPORTED_MODULE_2__.normalize)(v, min, max) * range / stepRange);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum") return steps;
    if (type === "int") return Math.round(steps * step + min);
    return steps * step + min;
  }

}

/***/ }),

/***/ "./src/components/Led.ts":
/*!*******************************!*\
  !*** ./src/components/Led.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_65840__) => {

__nested_webpack_require_65840__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_65840__.d(__webpack_exports__, {
/* harmony export */   "Led": () => (/* binding */ Led)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_65840__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Led_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_65840__(/*! ./Led.scss */ "./src/components/Led.scss");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Led extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "led");

    _defineProperty(this, "canvasDiv", void 0);

    _defineProperty(this, "canvas", void 0);

    _defineProperty(this, "tempCanvas", void 0);

    _defineProperty(this, "ctx", void 0);

    _defineProperty(this, "tempCtx", void 0);

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    });

    _defineProperty(this, "paint", () => {
      var _this$state$style2 = this.state.style,
          shape = _this$state$style2.shape,
          ledbgcolor = _this$state$style2.ledbgcolor,
          coldcolor = _this$state$style2.coldcolor,
          warmcolor = _this$state$style2.warmcolor,
          hotcolor = _this$state$style2.hotcolor,
          overloadcolor = _this$state$style2.overloadcolor;
      var _this$state = this.state,
          min = _this$state.min,
          max = _this$state.max;
      var canvas = this.canvas,
          ctx = this.ctx,
          tempCanvas = this.tempCanvas,
          tempCtx = this.tempCtx,
          distance = this.distance;

      var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
          width = _canvas$getBoundingCl.width,
          height = _canvas$getBoundingCl.height;

      canvas.width = width;
      canvas.height = height;
      var drawHeight = Math.min(height, width) * 0.75;
      var drawWidth = drawHeight;
      var left = (width - drawWidth) * 0.5;
      var top = (height - drawHeight) * 0.5;
      var coldStop = (-18 - min) / (max - min);
      var warmStop = (-6 - min) / (max - min);
      var hotStop = (-3 - min) / (max - min);
      var overloadStop = -min / (max - min);
      var gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, 0);
      if (coldStop <= 1 && coldStop >= 0) gradient.addColorStop(coldStop, coldcolor);else if (coldStop > 1) gradient.addColorStop(1, coldcolor);
      if (warmStop <= 1 && warmStop >= 0) gradient.addColorStop(warmStop, warmcolor);
      if (hotStop <= 1 && hotStop >= 0) gradient.addColorStop(hotStop, hotcolor);
      if (overloadStop <= 1 && overloadStop >= 0) gradient.addColorStop(overloadStop, overloadcolor);else if (overloadStop < 0) gradient.addColorStop(0, coldcolor);
      tempCtx.fillStyle = gradient;
      tempCtx.fillRect(0, 0, tempCanvas.width, 10);
      var d = tempCtx.getImageData(Math.min(tempCanvas.width - 1, distance * tempCanvas.width), 0, 1, 1).data;
      if (distance) ctx.fillStyle = "rgb(".concat(d[0], ", ").concat(d[1], ", ").concat(d[2], ")");else ctx.fillStyle = ledbgcolor;
      if (shape === "circle") ctx.arc(width / 2, height / 2, width / 2 - left, 0, 2 * Math.PI);else ctx.rect(left, top, drawWidth, drawHeight);
      ctx.fill();
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "regular",
        bgcolor: "rgba(18, 18, 18, 0)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)",
        shape: "circle",
        ledbgcolor: "rgba(18, 18, 18, 1)",
        coldcolor: "rgba(12, 248, 100, 1)",
        warmcolor: "rgba(195, 248, 100, 1)",
        hotcolor: "rgba(255, 193, 10, 1)",
        overloadcolor: "rgba(255, 10, 10, 1)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.canvasDiv = document.createElement("div");
    this.canvasDiv.className = "faust-ui-component-".concat(this.className, "-canvasdiv");
    this.canvas = document.createElement("canvas");
    this.canvas.width = 10;
    this.canvas.height = 10;
    this.ctx = this.canvas.getContext("2d");
    this.tempCanvas = document.createElement("canvas");
    this.tempCtx = this.tempCanvas.getContext("2d");
    this.tempCanvas.width = 128;
    this.tempCanvas.height = 1;
    this.setStyle();
    return this;
  }

  componentDidMount() {
    super.componentDidMount();
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, {
      passive: false
    });
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));
    this.on("value", () => this.schedule(this.paint));
    this.on("max", () => this.schedule(this.paint));
    this.on("min", () => this.schedule(this.paint));
    this.on("step", () => this.schedule(this.paint));
    this.schedule(this.paint);
    return this;
  }

  mount() {
    this.canvasDiv.appendChild(this.canvas);
    this.container.appendChild(this.label);
    this.container.appendChild(this.canvasDiv);
    return super.mount();
  }

}

/***/ }),

/***/ "./src/components/Menu.ts":
/*!********************************!*\
  !*** ./src/components/Menu.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_72779__) => {

__nested_webpack_require_72779__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_72779__.d(__webpack_exports__, {
/* harmony export */   "Menu": () => (/* binding */ Menu)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_72779__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Menu_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_72779__(/*! ./Menu.scss */ "./src/components/Menu.scss");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Menu extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "menu");

    _defineProperty(this, "select", void 0);

    _defineProperty(this, "handleChange", e => {
      this.setValue(+e.currentTarget.value);
    });

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          height = _this$state$style.height,
          grid = _this$state$style.grid,
          fontsize = _this$state$style.fontsize,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      this.select.style.backgroundColor = bgcolor;
      this.select.style.borderColor = bordercolor;
      this.select.style.color = textcolor;
      this.select.style.fontSize = "".concat(fontsize || height * grid / 4, "px");
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "regular",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.select = document.createElement("select");
    this.getOptions();
    this.setStyle();
    return this;
  }

  getOptions() {
    var enums = this.state.enums;
    this.select.innerHTML = "";

    if (enums) {
      var i = 0;

      for (var key in enums) {
        var option = document.createElement("option");
        option.value = enums[key].toString();
        option.text = key;
        if (i === 0) option.selected = true;
        this.select.appendChild(option);
        i++;
      }
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.select.addEventListener("change", this.handleChange);
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));
    this.on("enums", () => this.schedule(this.getOptions));

    var valueChange = () => {
      for (var i = this.select.children.length - 1; i >= 0; i--) {
        var option = this.select.children[i];
        if (+option.value === this.state.value) this.select.selectedIndex = i;
      }
    };

    this.on("value", () => this.schedule(valueChange));
    valueChange();
    return this;
  }

  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.select);
    return super.mount();
  }

}

/***/ }),

/***/ "./src/components/Nentry.ts":
/*!**********************************!*\
  !*** ./src/components/Nentry.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_77367__) => {

__nested_webpack_require_77367__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_77367__.d(__webpack_exports__, {
/* harmony export */   "Nentry": () => (/* binding */ Nentry)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_77367__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Nentry_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_77367__(/*! ./Nentry.scss */ "./src/components/Nentry.scss");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Nentry extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "nentry");

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "handleChange", e => {
      this.setValue(+e.currentTarget.value);
    });

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          height = _this$state$style.height,
          grid = _this$state$style.grid,
          fontsize = _this$state$style.fontsize,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      this.input.style.backgroundColor = bgcolor;
      this.input.style.borderColor = bordercolor;
      this.input.style.color = textcolor;
      this.input.style.fontSize = "".concat(fontsize || height * grid / 4, "px");
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "regular",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.input = document.createElement("input");
    this.input.type = "number";
    this.input.value = (+this.state.value.toFixed(3)).toString();
    this.input.max = this.state.max.toString();
    this.input.min = this.state.min.toString();
    this.input.step = this.state.step.toString();
    this.setStyle();
    return this;
  }

  componentDidMount() {
    super.componentDidMount();
    this.input.addEventListener("change", this.handleChange);
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));

    var valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString();

    this.on("value", () => this.schedule(valueChange));

    var maxChange = () => this.input.max = this.state.max.toString();

    this.on("max", () => this.schedule(maxChange));

    var minChange = () => this.input.min = this.state.min.toString();

    this.on("min", () => this.schedule(minChange));

    var stepChange = () => this.input.step = this.state.step.toString();

    this.on("step", () => this.schedule(stepChange));
    return this;
  }

  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.input);
    return super.mount();
  }

}

/***/ }),

/***/ "./src/components/Numerical.ts":
/*!*************************************!*\
  !*** ./src/components/Numerical.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_81948__) => {

__nested_webpack_require_81948__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_81948__.d(__webpack_exports__, {
/* harmony export */   "Numerical": () => (/* binding */ Numerical)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_81948__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Numerical_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_81948__(/*! ./Numerical.scss */ "./src/components/Numerical.scss");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Numerical extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "numerical");

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          height = _this$state$style.height,
          grid = _this$state$style.grid,
          fontsize = _this$state$style.fontsize,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      this.input.style.backgroundColor = bgcolor;
      this.input.style.borderColor = bordercolor;
      this.input.style.color = textcolor;
      this.input.style.fontSize = "".concat(fontsize || height * grid / 4, "px");
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "regular",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.input = document.createElement("input");
    this.input.disabled = true;
    this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
    this.setStyle();
    return this;
  }

  componentDidMount() {
    super.componentDidMount();
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));

    var valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");

    this.on("value", () => this.schedule(valueChange));
    return this;
  }

  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.input);
    return super.mount();
  }

}

/***/ }),

/***/ "./src/components/Radio.ts":
/*!*********************************!*\
  !*** ./src/components/Radio.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_85898__) => {

__nested_webpack_require_85898__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_85898__.d(__webpack_exports__, {
/* harmony export */   "Radio": () => (/* binding */ Radio)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_85898__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _Radio_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_85898__(/*! ./Radio.scss */ "./src/components/Radio.scss");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Radio extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "className", "radio");

    _defineProperty(this, "group", void 0);

    _defineProperty(this, "getOptions", () => {
      var _this$state = this.state,
          enums = _this$state.enums,
          address = _this$state.address;
      this.group.innerHTML = "";

      if (enums) {
        var i = 0;

        var _loop = function _loop(key) {
          var input = document.createElement("input");
          var div = document.createElement("div");
          input.value = enums[key].toString();
          input.name = address;
          input.type = "radio";
          if (i === 0) input.checked = true;
          input.addEventListener("change", () => {
            if (input.checked) _this.setValue(enums[key]);
          });
          div.appendChild(input);
          div.append(key);

          _this.group.appendChild(div);

          i++;
        };

        for (var key in enums) {
          _loop(key);
        }
      }
    });

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          height = _this$state$style.height,
          width = _this$state$style.width,
          grid = _this$state$style.grid,
          fontsize = _this$state$style.fontsize,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      var fontSize = Math.min(height * grid * 0.1, width * grid * 0.1);
      this.group.style.backgroundColor = bgcolor;
      this.group.style.borderColor = bordercolor;
      this.group.style.color = textcolor;
      this.group.style.fontSize = "".concat(fontsize || fontSize, "px");
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "regular",
        bgcolor: "rgba(255, 255, 255, 0.25)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.group = document.createElement("div");
    this.group.className = "faust-ui-component-radio-group";
    this.getOptions();
    this.setStyle();
    return this;
  }

  componentDidMount() {
    super.componentDidMount();
    this.on("style", () => this.schedule(this.setStyle));
    this.on("label", () => this.schedule(this.paintLabel));
    this.on("enums", () => this.schedule(this.getOptions));

    var valueChange = () => {
      for (var i = this.group.children.length - 1; i >= 0; i--) {
        var input = this.group.children[i].querySelector("input");
        if (+input.value === this.state.value) input.checked = true;
      }
    };

    this.on("value", () => this.schedule(valueChange));
    valueChange();
    return this;
  }

  mount() {
    this.container.appendChild(this.label);
    this.container.appendChild(this.group);
    return super.mount();
  }

}

/***/ }),

/***/ "./src/components/VBargraph.ts":
/*!*************************************!*\
  !*** ./src/components/VBargraph.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_91019__) => {

__nested_webpack_require_91019__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_91019__.d(__webpack_exports__, {
/* harmony export */   "VBargraph": () => (/* binding */ VBargraph)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_91019__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _VBargraph_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_91019__(/*! ./VBargraph.scss */ "./src/components/VBargraph.scss");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class VBargraph extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "vbargraph");

    _defineProperty(this, "canvas", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "flexDiv", void 0);

    _defineProperty(this, "canvasDiv", void 0);

    _defineProperty(this, "ctx", void 0);

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          height = _this$state$style.height,
          width = _this$state$style.width,
          grid = _this$state$style.grid,
          fontsize = _this$state$style.fontsize,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      var fontSize = Math.min(height * grid * 0.05, width * grid * 0.2);
      this.input.style.fontSize = "".concat(fontsize || fontSize, "px");
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    });

    _defineProperty(this, "paintValue", 0);

    _defineProperty(this, "maxValue", -Infinity);

    _defineProperty(this, "maxTimer", void 0);

    _defineProperty(this, "paint", () => {
      var _this$state$style2 = this.state.style,
          barwidth = _this$state$style2.barwidth,
          barbgcolor = _this$state$style2.barbgcolor,
          coldcolor = _this$state$style2.coldcolor,
          warmcolor = _this$state$style2.warmcolor,
          hotcolor = _this$state$style2.hotcolor,
          overloadcolor = _this$state$style2.overloadcolor;
      var _this$state = this.state,
          type = _this$state.type,
          max = _this$state.max,
          min = _this$state.min,
          enums = _this$state.enums,
          scale = _this$state.scale,
          value = _this$state.value;
      var ctx = this.ctx;
      var canvas = this.canvas;

      var _this$canvasDiv$getBo = this.canvasDiv.getBoundingClientRect(),
          width = _this$canvasDiv$getBo.width,
          height = _this$canvasDiv$getBo.height;

      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      var drawHeight = height * 0.9;
      var drawWidth = barwidth || Math.min(width / 3, drawHeight * 0.05);
      var left = (width - drawWidth) * 0.5;
      var top = height * 0.05;
      this.paintValue = value;
      var paintValue = this.paintValue;

      if (paintValue > this.maxValue) {
        this.maxValue = paintValue;
        if (this.maxTimer) window.clearTimeout(this.maxTimer);
        this.maxTimer = window.setTimeout(() => {
          this.maxValue = this.paintValue;
          this.maxTimer = undefined;
          this.schedule(this.paint);
        }, 1000);
      }

      if (paintValue < this.maxValue && typeof this.maxTimer === "undefined") {
        this.maxTimer = window.setTimeout(() => {
          this.maxValue = this.paintValue;
          this.maxTimer = undefined;
          this.schedule(this.paint);
        }, 1000);
      }

      var maxValue = this.maxValue;
      var coldStop = (-18 - min) / (max - min);
      var warmStop = (-6 - min) / (max - min);
      var hotStop = (-3 - min) / (max - min);
      var overloadStop = Math.max(0, -min / (max - min));
      var gradient = ctx.createLinearGradient(0, drawHeight, 0, top);
      if (coldStop <= 1 && coldStop >= 0) gradient.addColorStop(coldStop, coldcolor);else if (coldStop > 1) gradient.addColorStop(1, coldcolor);
      if (warmStop <= 1 && warmStop >= 0) gradient.addColorStop(warmStop, warmcolor);
      if (hotStop <= 1 && hotStop >= 0) gradient.addColorStop(hotStop, hotcolor);
      if (overloadStop <= 1 && overloadStop >= 0) gradient.addColorStop(overloadStop, overloadcolor);else if (overloadStop < 0) gradient.addColorStop(0, coldcolor);
      ctx.fillStyle = barbgcolor;
      if (paintValue < 0) ctx.fillRect(left, top + (1 - overloadStop) * drawHeight, drawWidth, drawHeight * overloadStop);
      if (paintValue < max) ctx.fillRect(left, top, drawWidth, (1 - overloadStop) * drawHeight - 1);
      ctx.fillStyle = gradient;

      if (paintValue > min) {
        var distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
          type,
          max,
          min,
          enums,
          scale,
          value: Math.min(0, paintValue)
        }));
        ctx.fillRect(left, top + (1 - distance) * drawHeight, drawWidth, drawHeight * distance);
      }

      if (paintValue > 0) {
        var _distance = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
          type,
          max,
          min,
          enums,
          scale,
          value: Math.min(max, paintValue)
        }) - overloadStop);

        ctx.fillRect(left, top + (1 - overloadStop - _distance) * drawHeight, drawWidth, drawHeight * _distance - 1);
      }

      if (maxValue > paintValue) {
        if (maxValue <= 0) {
          var _distance2 = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
            type,
            max,
            min,
            enums,
            scale,
            value: Math.min(0, maxValue)
          }));

          ctx.fillRect(left, top + (1 - _distance2) * drawHeight, drawWidth, 1);
        }

        if (maxValue > 0) {
          var _distance3 = Math.max(0, _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem.getDistance({
            type,
            max,
            min,
            enums,
            scale,
            value: Math.min(max, maxValue)
          }) - overloadStop);

          ctx.fillRect(left, Math.max(top, top + (1 - overloadStop - _distance3) * drawHeight - 1), drawWidth, 1);
        }
      }
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "regular",
        bgcolor: "rgba(18, 18, 18, 0)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)",
        barwidth: undefined,
        barbgcolor: "rgba(18, 18, 18, 1)",
        coldcolor: "rgba(12, 248, 100, 1)",
        warmcolor: "rgba(195, 248, 100, 1)",
        hotcolor: "rgba(255, 193, 10, 1)",
        overloadcolor: "rgba(255, 10, 10, 1)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.flexDiv = document.createElement("div");
    this.flexDiv.className = "faust-ui-component-".concat(this.className, "-flexdiv");
    this.canvasDiv = document.createElement("div");
    this.canvasDiv.className = "faust-ui-component-".concat(this.className, "-canvasdiv");
    this.canvas = document.createElement("canvas");
    this.canvas.width = 10;
    this.canvas.height = 10;
    this.ctx = this.canvas.getContext("2d");
    this.input = document.createElement("input");
    this.input.disabled = true;
    this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");
    this.setStyle();
    return this;
  }

  componentDidMount() {
    super.componentDidMount();
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, {
      passive: false
    });
    this.on("style", () => {
      this.schedule(this.setStyle);
      this.schedule(this.paint);
    });
    this.on("label", () => this.schedule(this.paintLabel));

    var valueChange = () => this.input.value = (+this.state.value.toFixed(3)).toString() + (this.state.unit || "");

    this.on("value", () => {
      this.schedule(valueChange);
      this.schedule(this.paint);
    });
    this.on("max", () => this.schedule(this.paint));
    this.on("min", () => this.schedule(this.paint));
    this.on("step", () => this.schedule(this.paint));
    this.schedule(this.paint);
    return this;
  }

  mount() {
    this.canvasDiv.appendChild(this.canvas);
    this.flexDiv.appendChild(this.canvasDiv);
    this.flexDiv.appendChild(this.input);
    this.container.appendChild(this.label);
    this.container.appendChild(this.flexDiv);
    return super.mount();
  }

}

/***/ }),

/***/ "./src/components/VSlider.ts":
/*!***********************************!*\
  !*** ./src/components/VSlider.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_101288__) => {

__nested_webpack_require_101288__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_101288__.d(__webpack_exports__, {
/* harmony export */   "VSlider": () => (/* binding */ VSlider)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_101288__(/*! ./AbstractItem */ "./src/components/AbstractItem.ts");
/* harmony import */ var _VSlider_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_101288__(/*! ./VSlider.scss */ "./src/components/VSlider.scss");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_101288__(/*! ./utils */ "./src/components/utils.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class VSlider extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "className", "vslider");

    _defineProperty(this, "canvas", void 0);

    _defineProperty(this, "inputNumber", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "flexDiv", void 0);

    _defineProperty(this, "canvasDiv", void 0);

    _defineProperty(this, "ctx", void 0);

    _defineProperty(this, "interactionRect", [0, 0, 0, 0]);

    _defineProperty(this, "handleChange", e => {
      var value = parseFloat(e.currentTarget.value);

      if (isFinite(value)) {
        var changed = this.setValue(+value);
        if (changed) return;
      }

      this.input.value = this.inputNumber.value + (this.state.unit || "");
    });

    _defineProperty(this, "setStyle", () => {
      var _this$state$style = this.state.style,
          height = _this$state$style.height,
          width = _this$state$style.width,
          grid = _this$state$style.grid,
          fontsize = _this$state$style.fontsize,
          textcolor = _this$state$style.textcolor,
          bgcolor = _this$state$style.bgcolor,
          bordercolor = _this$state$style.bordercolor;
      var fontSize = Math.min(height * grid * 0.05, width * grid * 0.2);
      this.input.style.fontSize = "".concat(fontsize || fontSize, "px");
      this.input.style.color = textcolor;
      this.container.style.backgroundColor = bgcolor;
      this.container.style.borderColor = bordercolor;
    });

    _defineProperty(this, "paint", () => {
      var _this$state$style2 = this.state.style,
          sliderwidth = _this$state$style2.sliderwidth,
          sliderbgcolor = _this$state$style2.sliderbgcolor,
          sliderbgoncolor = _this$state$style2.sliderbgoncolor,
          slidercolor = _this$state$style2.slidercolor;
      var ctx = this.ctx;
      var canvas = this.canvas;
      var distance = this.distance;

      var _this$canvasDiv$getBo = this.canvasDiv.getBoundingClientRect(),
          width = _this$canvasDiv$getBo.width,
          height = _this$canvasDiv$getBo.height;

      width = Math.floor(width);
      height = Math.floor(height);
      canvas.width = width;
      canvas.height = height;
      var drawHeight = height * 0.9;
      var drawWidth = sliderwidth || Math.min(width / 3, drawHeight * 0.05);
      var left = (width - drawWidth) * 0.5;
      var top = height * 0.05;
      var borderRadius = drawWidth * 0.25;
      this.interactionRect = [0, top, width, drawHeight];
      var grd = ctx.createLinearGradient(0, top, 0, top + drawHeight);
      grd.addColorStop(Math.max(0, Math.min(1, 1 - distance)), sliderbgcolor);
      grd.addColorStop(Math.max(0, Math.min(1, 1 - distance)), sliderbgoncolor);
      ctx.fillStyle = grd;
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.fillRoundedRect)(ctx, left, top, drawWidth, drawHeight, borderRadius); // draw slider

      ctx.fillStyle = slidercolor;
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__.fillRoundedRect)(ctx, left - drawWidth, top + drawHeight * (1 - distance) - drawWidth, drawWidth * 3, drawWidth * 2, borderRadius);
    });

    _defineProperty(this, "handlePointerDown", e => {
      var value = this.state.value;
      if (e.x < this.interactionRect[0] || e.x > this.interactionRect[0] + this.interactionRect[2] || e.y < this.interactionRect[1] || e.y > this.interactionRect[1] + this.interactionRect[3]) return;
      var newValue = this.getValueFromPos(e);
      if (newValue !== value) this.setValue(this.getValueFromPos(e));
    });

    _defineProperty(this, "handlePointerDrag", e => {
      var newValue = this.getValueFromPos(e);
      if (newValue !== this.state.value) this.setValue(newValue);
    });
  }

  static get defaultProps() {
    var inherited = super.defaultProps;
    return _objectSpread(_objectSpread({}, inherited), {}, {
      style: _objectSpread(_objectSpread({}, inherited.style), {}, {
        fontname: "Arial",
        fontsize: undefined,
        fontface: "regular",
        bgcolor: "rgba(18, 18, 18, 0)",
        bordercolor: "rgba(80, 80, 80, 0)",
        labelcolor: "rgba(226, 222, 255, 0.5)",
        textcolor: "rgba(18, 18, 18, 1)",
        sliderwidth: undefined,
        sliderbgcolor: "rgba(18, 18, 18, 1)",
        sliderbgoncolor: "rgba(255, 165, 0, 1)",
        slidercolor: "rgba(200, 200, 200, 0.75)"
      })
    });
  }

  componentWillMount() {
    super.componentWillMount();
    this.flexDiv = document.createElement("div");
    this.flexDiv.className = "faust-ui-component-".concat(this.className, "-flexdiv");
    this.canvasDiv = document.createElement("div");
    this.canvasDiv.className = "faust-ui-component-".concat(this.className, "-canvasdiv");
    this.canvas = document.createElement("canvas");
    this.canvas.width = 10;
    this.canvas.height = 10;
    this.ctx = this.canvas.getContext("2d");
    this.inputNumber = document.createElement("input");
    this.inputNumber.type = "number";
    this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
    this.inputNumber.max = this.state.max.toString();
    this.inputNumber.min = this.state.min.toString();
    this.inputNumber.step = this.state.step.toString();
    this.input = document.createElement("input");
    this.input.value = this.inputNumber.value + (this.state.unit || "");
    this.input.spellcheck = false;
    this.setStyle();
    return this;
  }

  componentDidMount() {
    super.componentDidMount();
    this.input.addEventListener("change", this.handleChange);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, {
      passive: false
    });
    this.on("style", () => {
      this.schedule(this.setStyle);
      this.schedule(this.paint);
    });
    this.on("label", () => this.schedule(this.paintLabel));

    var valueChange = () => {
      this.inputNumber.value = (+this.state.value.toFixed(3)).toString();
      this.input.value = this.inputNumber.value + (this.state.unit || "");
    };

    this.on("value", () => {
      this.schedule(valueChange);
      this.schedule(this.paint);
    });

    var maxChange = () => this.inputNumber.max = this.state.max.toString();

    this.on("max", () => {
      this.schedule(maxChange);
      this.schedule(this.paint);
    });

    var minChange = () => this.inputNumber.min = this.state.min.toString();

    this.on("min", () => {
      this.schedule(minChange);
      this.schedule(this.paint);
    });

    var stepChange = () => this.inputNumber.step = this.state.step.toString();

    this.on("step", () => {
      this.schedule(stepChange);
      this.schedule(this.paint);
    });
    this.schedule(this.paint);
    return this;
  }

  mount() {
    this.canvasDiv.appendChild(this.canvas);
    this.flexDiv.appendChild(this.canvasDiv);
    this.flexDiv.appendChild(this.input);
    this.container.appendChild(this.label);
    this.container.appendChild(this.flexDiv);
    return super.mount();
  }

  get stepsCount() {
    var _this$state = this.state,
        type = _this$state.type,
        max = _this$state.max,
        min = _this$state.min,
        step = _this$state.step,
        enums = _this$state.enums;
    var maxSteps = type === "enum" ? enums.length : type === "int" ? max - min : (max - min) / step;

    if (step) {
      if (type === "enum") return enums.length;
      if (type === "int") return Math.min(Math.floor((max - min) / (Math.round(step) || 0)), maxSteps);
      return Math.floor((max - min) / step);
    }

    return maxSteps;
  }

  get stepRange() {
    var full = this.interactionRect[this.className === "vslider" ? 3 : 2];
    var stepsCount = this.stepsCount;
    return full / stepsCount;
  }

  getValueFromPos(e) {
    var _this$state2 = this.state,
        type = _this$state2.type,
        min = _this$state2.min,
        max = _this$state2.max,
        scale = _this$state2.scale;
    var step = type === "enum" ? 1 : this.state.step || 1;
    var stepRange = this.stepRange;
    var stepsCount = this.stepsCount;
    var distance = this.className === "vslider" ? this.interactionRect[3] - (e.y - this.interactionRect[1]) : e.x - this.interactionRect[0];
    var range = this.className === "vslider" ? this.interactionRect[3] : this.interactionRect[2];
    var denormalized = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.denormalize)(distance / range, min, max);
    var v = scale === "exp" ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.normExp)(denormalized, min, max) : scale === "log" ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.normLog)(denormalized, min, max) : denormalized;
    var steps = Math.round((0,_utils__WEBPACK_IMPORTED_MODULE_2__.normalize)(v, min, max) * range / stepRange);
    steps = Math.min(stepsCount, Math.max(0, steps));
    if (type === "enum") return steps;
    if (type === "int") return Math.round(steps * step + min);
    return steps * step + min;
  }

}

/***/ }),

/***/ "./src/components/utils.ts":
/*!*********************************!*\
  !*** ./src/components/utils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_112213__) => {

__nested_webpack_require_112213__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_112213__.d(__webpack_exports__, {
/* harmony export */   "toMIDI": () => (/* binding */ toMIDI),
/* harmony export */   "toRad": () => (/* binding */ toRad),
/* harmony export */   "atodb": () => (/* binding */ atodb),
/* harmony export */   "dbtoa": () => (/* binding */ dbtoa),
/* harmony export */   "denormalize": () => (/* binding */ denormalize),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "normLog": () => (/* binding */ normLog),
/* harmony export */   "iNormLog": () => (/* binding */ iNormLog),
/* harmony export */   "normExp": () => (/* binding */ normExp),
/* harmony export */   "iNormExp": () => (/* binding */ iNormExp),
/* harmony export */   "roundedRect": () => (/* binding */ roundedRect),
/* harmony export */   "fillRoundedRect": () => (/* binding */ fillRoundedRect)
/* harmony export */ });
var toMIDI = f => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
var toRad = degrees => degrees * Math.PI / 180;
var atodb = a => 20 * Math.log10(a);
var dbtoa = db => Math.pow(10, db / 20);
var denormalize = (x, min, max) => min + (max - min) * x;
var normalize = (x, min, max) => (x - min) / (max - min) || 0;
var normLog = (x, min, max) => {
  var normalized = normalize(x, min, max);
  var logMin = Math.log(Math.max(Number.EPSILON, min));
  var logMax = Math.log(Math.max(Number.EPSILON, max));
  var vLog = denormalize(normalized, logMin, logMax);
  var v = Math.exp(vLog);
  return Math.max(min, Math.min(max, v));
};
var iNormLog = (vIn, min, max) => {
  var v = Math.max(min, Math.min(max, vIn));
  var vLog = Math.log(Math.max(Number.EPSILON, v));
  var logMin = Math.log(Math.max(Number.EPSILON, min));
  var logMax = Math.log(Math.max(Number.EPSILON, max));
  var normalized = normalize(vLog, logMin, logMax);
  return denormalize(normalized, min, max);
};
var normExp = iNormLog;
var iNormExp = normLog;
var roundedRect = (ctx, x, y, width, height, radius) => {
  var radii = [0, 0, 0, 0];
  if (typeof radius === "number") radii.fill(radius);else radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.stroke();
};
var fillRoundedRect = (ctx, x, y, width, height, radius) => {
  var radii = [0, 0, 0, 0];
  if (typeof radius === "number") radii.fill(radius);else radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.fill();
};

/***/ }),

/***/ "./src/instantiate.ts":
/*!****************************!*\
  !*** ./src/instantiate.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_115833__) => {

__nested_webpack_require_115833__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_115833__.d(__webpack_exports__, {
/* harmony export */   "instantiate": () => (/* binding */ instantiate)
/* harmony export */ });
/* harmony import */ var _FaustUI__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_115833__(/*! ./FaustUI */ "./src/FaustUI.ts");

var instantiate = () => {
  var faustUI = new _FaustUI__WEBPACK_IMPORTED_MODULE_0__.FaustUI({
    root: document.getElementById("root")
  });
  var host;
  window.addEventListener("message", e => {
    var source = e.source;
    host = source;
  });
  window.addEventListener("keydown", e => {
    if (host) host.postMessage({
      type: "keydown",
      key: e.key
    }, "*");
  });
  window.addEventListener("keyup", e => {
    if (host) host.postMessage({
      type: "keyup",
      key: e.key
    }, "*");
  });
  window.faustUI = faustUI;
};

/***/ }),

/***/ "./src/layout/AbstractGroup.ts":
/*!*************************************!*\
  !*** ./src/layout/AbstractGroup.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_116973__) => {

__nested_webpack_require_116973__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_116973__.d(__webpack_exports__, {
/* harmony export */   "AbstractGroup": () => (/* binding */ AbstractGroup)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable @typescript-eslint/no-unused-vars */
class AbstractGroup {
  constructor(group, isRoot) {
    _defineProperty(this, "isRoot", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "label", void 0);

    _defineProperty(this, "items", void 0);

    _defineProperty(this, "layout", void 0);

    this.isRoot = !!isRoot;
    Object.assign(this, group);
    var hasHSizingDesc = this.hasHSizingDesc,
        hasVSizingDesc = this.hasVSizingDesc;
    var sizing = hasHSizingDesc && hasVSizingDesc ? "both" : hasHSizingDesc ? "horizontal" : hasVSizingDesc ? "vertical" : "none";
    this.layout = {
      type: group.type,
      width: AbstractGroup.padding * 2,
      height: AbstractGroup.padding * 2 + AbstractGroup.labelHeight,
      sizing
    };
  }
  /**
   * find recursively if the group has horizontal-sizable item
   */


  get hasHSizingDesc() {
    return !!this.items.find(item => {
      if (item instanceof AbstractGroup) return item.hasHSizingDesc;
      return item.layout.sizing === "horizontal" || item.layout.sizing === "both";
    });
  }
  /**
   * find recursively if the group has vertical-sizable item
   */


  get hasVSizingDesc() {
    return !!this.items.find(item => {
      if (item instanceof AbstractGroup) return item.hasVSizingDesc;
      return item.layout.sizing === "vertical" || item.layout.sizing === "both";
    });
  }

  adjust() {
    return this;
  }

  expand(dX, dY) {
    return this;
  }

  offset() {
    return this;
  }

}

_defineProperty(AbstractGroup, "padding", 0.2);

_defineProperty(AbstractGroup, "labelHeight", 0.25);

_defineProperty(AbstractGroup, "spaceBetween", 0.1);

/***/ }),

/***/ "./src/layout/AbstractInputItem.ts":
/*!*****************************************!*\
  !*** ./src/layout/AbstractInputItem.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_119342__) => {

__nested_webpack_require_119342__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_119342__.d(__webpack_exports__, {
/* harmony export */   "AbstractInputItem": () => (/* binding */ AbstractInputItem)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_119342__(/*! ./AbstractItem */ "./src/layout/AbstractItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AbstractInputItem extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {
  constructor(item) {
    super(item);

    _defineProperty(this, "init", void 0);

    _defineProperty(this, "step", void 0);

    this.init = +item.init || 0;
    this.step = +item.step || 1;
  }

}

/***/ }),

/***/ "./src/layout/AbstractItem.ts":
/*!************************************!*\
  !*** ./src/layout/AbstractItem.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_120465__) => {

__nested_webpack_require_120465__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_120465__.d(__webpack_exports__, {
/* harmony export */   "AbstractItem": () => (/* binding */ AbstractItem)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AbstractItem {
  constructor(item) {
    _defineProperty(this, "type", void 0);

    _defineProperty(this, "label", void 0);

    _defineProperty(this, "address", void 0);

    _defineProperty(this, "index", void 0);

    _defineProperty(this, "init", void 0);

    _defineProperty(this, "min", void 0);

    _defineProperty(this, "max", void 0);

    _defineProperty(this, "meta", void 0);

    _defineProperty(this, "layout", void 0);

    Object.assign(this, item);
    this.min = isFinite(+this.min) ? +this.min : 0;
    this.max = isFinite(+this.max) ? +this.max : 1;
  }

  adjust() {
    return this;
  }

  expand(dX, dY) {
    return this;
  }

  offset() {
    return this;
  }

}

/***/ }),

/***/ "./src/layout/AbstractOutputItem.ts":
/*!******************************************!*\
  !*** ./src/layout/AbstractOutputItem.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_121862__) => {

__nested_webpack_require_121862__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_121862__.d(__webpack_exports__, {
/* harmony export */   "AbstractOutputItem": () => (/* binding */ AbstractOutputItem)
/* harmony export */ });
/* harmony import */ var _AbstractItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_121862__(/*! ./AbstractItem */ "./src/layout/AbstractItem.ts");

class AbstractOutputItem extends _AbstractItem__WEBPACK_IMPORTED_MODULE_0__.AbstractItem {}

/***/ }),

/***/ "./src/layout/Button.ts":
/*!******************************!*\
  !*** ./src/layout/Button.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_122553__) => {

__nested_webpack_require_122553__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_122553__.d(__webpack_exports__, {
/* harmony export */   "Button": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_122553__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Button extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractInputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "button",
      width: 2,
      height: 1,
      sizing: "horizontal"
    });
  }

}

/***/ }),

/***/ "./src/layout/Checkbox.ts":
/*!********************************!*\
  !*** ./src/layout/Checkbox.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_123630__) => {

__nested_webpack_require_123630__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_123630__.d(__webpack_exports__, {
/* harmony export */   "Checkbox": () => (/* binding */ Checkbox)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_123630__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Checkbox extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractInputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "checkbox",
      width: 2,
      height: 1,
      sizing: "horizontal"
    });
  }

}

/***/ }),

/***/ "./src/layout/HBargraph.ts":
/*!*********************************!*\
  !*** ./src/layout/HBargraph.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_124719__) => {

__nested_webpack_require_124719__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_124719__.d(__webpack_exports__, {
/* harmony export */   "HBargraph": () => (/* binding */ HBargraph)
/* harmony export */ });
/* harmony import */ var _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_124719__(/*! ./AbstractOutputItem */ "./src/layout/AbstractOutputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class HBargraph extends _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractOutputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "hbargraph",
      width: 5,
      height: 1,
      sizing: "horizontal"
    });
  }

}

/***/ }),

/***/ "./src/layout/HGroup.ts":
/*!******************************!*\
  !*** ./src/layout/HGroup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_125805__) => {

__nested_webpack_require_125805__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_125805__.d(__webpack_exports__, {
/* harmony export */   "HGroup": () => (/* binding */ HGroup)
/* harmony export */ });
/* harmony import */ var _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_125805__(/*! ./AbstractGroup */ "./src/layout/AbstractGroup.ts");

class HGroup extends _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup {
  adjust() {
    this.items.forEach(item => {
      item.adjust();
      this.layout.width += item.layout.width;
      this.layout.height = Math.max(this.layout.height, item.layout.height + 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding + _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.labelHeight);
    });
    this.layout.width += _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.spaceBetween * (this.items.length - 1);
    if (this.layout.width < 1) this.layout.width += 1;
    return this;
  }

  expand(dX) {
    var hExpandItems = 0;
    this.items.forEach(item => {
      // Count items that need to expand horizontally
      if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") hExpandItems++;
    });
    this.items.forEach(item => {
      var dX$ = 0;
      var dY$ = 0; // Space available to expand for current item

      if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") {
        dX$ = hExpandItems ? dX / hExpandItems : 0;
        item.layout.width += dX$;
      }

      if (item.layout.sizing === "both" || item.layout.sizing === "vertical") {
        dY$ = this.layout.height - 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding - _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.labelHeight - item.layout.height;
        item.layout.height += dY$;
      }

      item.expand(dX$, dY$);
    });
    return this;
  }

  offset() {
    var labelHeight = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.labelHeight,
        padding = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding,
        spaceBetween = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.spaceBetween;
    var $left = padding;
    var $top = padding + labelHeight;
    var height = this.layout.height;
    this.items.forEach(item => {
      item.layout.offsetLeft = $left;
      item.layout.offsetTop = $top; // center the item

      item.layout.offsetTop += (height - labelHeight - item.layout.height) / 2 - padding;
      item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
      item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
      item.offset();
      $left += item.layout.width + spaceBetween;
    });
    return this;
  }

}

/***/ }),

/***/ "./src/layout/HSlider.ts":
/*!*******************************!*\
  !*** ./src/layout/HSlider.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_128771__) => {

__nested_webpack_require_128771__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_128771__.d(__webpack_exports__, {
/* harmony export */   "HSlider": () => (/* binding */ HSlider)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_128771__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class HSlider extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractInputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "hslider",
      width: 5,
      height: 1,
      sizing: "horizontal"
    });
  }

}

/***/ }),

/***/ "./src/layout/Knob.ts":
/*!****************************!*\
  !*** ./src/layout/Knob.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_129836__) => {

__nested_webpack_require_129836__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_129836__.d(__webpack_exports__, {
/* harmony export */   "Knob": () => (/* binding */ Knob)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_129836__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Knob extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractInputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "knob",
      width: 1,
      height: 1.75,
      sizing: "none"
    });
  }

}

/***/ }),

/***/ "./src/layout/Layout.ts":
/*!******************************!*\
  !*** ./src/layout/Layout.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_130894__) => {

__nested_webpack_require_130894__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_130894__.d(__webpack_exports__, {
/* harmony export */   "Layout": () => (/* binding */ Layout)
/* harmony export */ });
/* harmony import */ var _HSlider__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_130894__(/*! ./HSlider */ "./src/layout/HSlider.ts");
/* harmony import */ var _VSlider__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_130894__(/*! ./VSlider */ "./src/layout/VSlider.ts");
/* harmony import */ var _Nentry__WEBPACK_IMPORTED_MODULE_2__ = __nested_webpack_require_130894__(/*! ./Nentry */ "./src/layout/Nentry.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __nested_webpack_require_130894__(/*! ./Button */ "./src/layout/Button.ts");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_4__ = __nested_webpack_require_130894__(/*! ./Checkbox */ "./src/layout/Checkbox.ts");
/* harmony import */ var _Knob__WEBPACK_IMPORTED_MODULE_5__ = __nested_webpack_require_130894__(/*! ./Knob */ "./src/layout/Knob.ts");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_6__ = __nested_webpack_require_130894__(/*! ./Menu */ "./src/layout/Menu.ts");
/* harmony import */ var _Radio__WEBPACK_IMPORTED_MODULE_7__ = __nested_webpack_require_130894__(/*! ./Radio */ "./src/layout/Radio.ts");
/* harmony import */ var _Led__WEBPACK_IMPORTED_MODULE_8__ = __nested_webpack_require_130894__(/*! ./Led */ "./src/layout/Led.ts");
/* harmony import */ var _Numerical__WEBPACK_IMPORTED_MODULE_9__ = __nested_webpack_require_130894__(/*! ./Numerical */ "./src/layout/Numerical.ts");
/* harmony import */ var _HBargraph__WEBPACK_IMPORTED_MODULE_10__ = __nested_webpack_require_130894__(/*! ./HBargraph */ "./src/layout/HBargraph.ts");
/* harmony import */ var _VBargraph__WEBPACK_IMPORTED_MODULE_11__ = __nested_webpack_require_130894__(/*! ./VBargraph */ "./src/layout/VBargraph.ts");
/* harmony import */ var _HGroup__WEBPACK_IMPORTED_MODULE_12__ = __nested_webpack_require_130894__(/*! ./HGroup */ "./src/layout/HGroup.ts");
/* harmony import */ var _VGroup__WEBPACK_IMPORTED_MODULE_13__ = __nested_webpack_require_130894__(/*! ./VGroup */ "./src/layout/VGroup.ts");
/* harmony import */ var _TGroup__WEBPACK_IMPORTED_MODULE_14__ = __nested_webpack_require_130894__(/*! ./TGroup */ "./src/layout/TGroup.ts");















class Layout {
  /**
   * Get the rendering type of an item by parsing its metadata
   */
  static predictType(item) {
    if (item.type === "vgroup" || item.type === "hgroup" || item.type === "tgroup" || item.type === "button" || item.type === "checkbox") return item.type;

    if (item.type === "hbargraph" || item.type === "vbargraph") {
      if (item.meta && item.meta.find(meta => meta.style && meta.style.startsWith("led"))) return "led";
      if (item.meta && item.meta.find(meta => meta.style && meta.style.startsWith("numerical"))) return "numerical";
      return item.type;
    }

    if (item.type === "hslider" || item.type === "nentry" || item.type === "vslider") {
      if (item.meta && item.meta.find(meta => meta.style && meta.style.startsWith("knob"))) return "knob";
      if (item.meta && item.meta.find(meta => meta.style && meta.style.startsWith("menu"))) return "menu";
      if (item.meta && item.meta.find(meta => meta.style && meta.style.startsWith("radio"))) return "radio";
    }

    return item.type;
  }
  /**
   * Get the Layout class constructor of an item
   */


  static getItem(item) {
    var Ctor = {
      hslider: _HSlider__WEBPACK_IMPORTED_MODULE_0__.HSlider,
      vslider: _VSlider__WEBPACK_IMPORTED_MODULE_1__.VSlider,
      nentry: _Nentry__WEBPACK_IMPORTED_MODULE_2__.Nentry,
      button: _Button__WEBPACK_IMPORTED_MODULE_3__.Button,
      checkbox: _Checkbox__WEBPACK_IMPORTED_MODULE_4__.Checkbox,
      knob: _Knob__WEBPACK_IMPORTED_MODULE_5__.Knob,
      menu: _Menu__WEBPACK_IMPORTED_MODULE_6__.Menu,
      radio: _Radio__WEBPACK_IMPORTED_MODULE_7__.Radio,
      led: _Led__WEBPACK_IMPORTED_MODULE_8__.Led,
      numerical: _Numerical__WEBPACK_IMPORTED_MODULE_9__.Numerical,
      hbargraph: _HBargraph__WEBPACK_IMPORTED_MODULE_10__.HBargraph,
      vbargraph: _VBargraph__WEBPACK_IMPORTED_MODULE_11__.VBargraph,
      hgroup: _HGroup__WEBPACK_IMPORTED_MODULE_12__.HGroup,
      vgroup: _VGroup__WEBPACK_IMPORTED_MODULE_13__.VGroup,
      tgroup: _TGroup__WEBPACK_IMPORTED_MODULE_14__.TGroup
    };
    var layoutType = this.predictType(item);
    return new Ctor[layoutType](item);
  }

  static getItems(items) {
    return items.map(item => {
      if ("items" in item) item.items = this.getItems(item.items);
      return this.getItem(item);
    });
  }

  static calc(ui) {
    var rootGroup = new _VGroup__WEBPACK_IMPORTED_MODULE_13__.VGroup({
      items: this.getItems(ui),
      type: "vgroup",
      label: ""
    }, true);
    rootGroup.adjust();
    rootGroup.expand(0, 0);
    rootGroup.offset();
    return rootGroup;
  }

}

/***/ }),

/***/ "./src/layout/Led.ts":
/*!***************************!*\
  !*** ./src/layout/Led.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_135846__) => {

__nested_webpack_require_135846__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_135846__.d(__webpack_exports__, {
/* harmony export */   "Led": () => (/* binding */ Led)
/* harmony export */ });
/* harmony import */ var _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_135846__(/*! ./AbstractOutputItem */ "./src/layout/AbstractOutputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Led extends _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractOutputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "led",
      width: 1,
      height: 1,
      sizing: "none"
    });
  }

}

/***/ }),

/***/ "./src/layout/Menu.ts":
/*!****************************!*\
  !*** ./src/layout/Menu.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_136894__) => {

__nested_webpack_require_136894__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_136894__.d(__webpack_exports__, {
/* harmony export */   "Menu": () => (/* binding */ Menu)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_136894__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Menu extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractInputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "menu",
      width: 2,
      height: 1,
      sizing: "horizontal"
    });
  }

}

/***/ }),

/***/ "./src/layout/Nentry.ts":
/*!******************************!*\
  !*** ./src/layout/Nentry.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_137955__) => {

__nested_webpack_require_137955__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_137955__.d(__webpack_exports__, {
/* harmony export */   "Nentry": () => (/* binding */ Nentry)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_137955__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Nentry extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractInputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "nentry",
      width: 1,
      height: 1,
      sizing: "none"
    });
  }

}

/***/ }),

/***/ "./src/layout/Numerical.ts":
/*!*********************************!*\
  !*** ./src/layout/Numerical.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_139030__) => {

__nested_webpack_require_139030__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_139030__.d(__webpack_exports__, {
/* harmony export */   "Numerical": () => (/* binding */ Numerical)
/* harmony export */ });
/* harmony import */ var _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_139030__(/*! ./AbstractOutputItem */ "./src/layout/AbstractOutputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Numerical extends _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractOutputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "numerical",
      width: 1,
      height: 1,
      sizing: "none"
    });
  }

}

/***/ }),

/***/ "./src/layout/Radio.ts":
/*!*****************************!*\
  !*** ./src/layout/Radio.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_140106__) => {

__nested_webpack_require_140106__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_140106__.d(__webpack_exports__, {
/* harmony export */   "Radio": () => (/* binding */ Radio)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_140106__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Radio extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractInputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "radio",
      width: 2,
      height: 2,
      // TODO: vradio and hradio
      sizing: "both"
    });
  }

}

/***/ }),

/***/ "./src/layout/TGroup.ts":
/*!******************************!*\
  !*** ./src/layout/TGroup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_141198__) => {

__nested_webpack_require_141198__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_141198__.d(__webpack_exports__, {
/* harmony export */   "TGroup": () => (/* binding */ TGroup)
/* harmony export */ });
/* harmony import */ var _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_141198__(/*! ./AbstractGroup */ "./src/layout/AbstractGroup.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class TGroup extends _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup {
  adjust() {
    this.items.forEach(item => {
      item.adjust();
      this.layout.width = Math.max(this.layout.width, item.layout.width + 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding);
      this.layout.height = Math.max(this.layout.height, item.layout.height + 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding + TGroup.labelHeight);
    });
    var tabsCount = this.items.length;
    this.layout.width = Math.max(this.layout.width, tabsCount * TGroup.tabLayout.width);
    this.layout.height += TGroup.tabLayout.height;
    if (this.layout.width < 1) this.layout.width += 1;
    return this;
  }

  expand() {
    var tabsCount = this.items.length;
    this.items.forEach(item => {
      var dY$ = 0; // Space available to expand for current item

      var dX$ = 0;
      if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") dX$ = this.layout.width - 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding - item.layout.width;
      if (item.layout.sizing === "both" || item.layout.sizing === "vertical") dY$ = this.layout.height - 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding - _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.labelHeight - (tabsCount ? TGroup.tabLayout.height : 0) - item.layout.height;
      item.expand(dX$, dY$);
    });
    return this;
  }

  offset() {
    var labelHeight = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.labelHeight,
        padding = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding;
    var $left = padding;
    var $top = padding + labelHeight + TGroup.tabLayout.height;
    this.items.forEach(item => {
      item.layout.offsetLeft = $left;
      item.layout.offsetTop = $top;
      item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
      item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
      item.offset();
    });
    return this;
  }

}

_defineProperty(TGroup, "tabLayout", {
  width: 2,
  height: 1
});

/***/ }),

/***/ "./src/layout/VBargraph.ts":
/*!*********************************!*\
  !*** ./src/layout/VBargraph.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_144121__) => {

__nested_webpack_require_144121__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_144121__.d(__webpack_exports__, {
/* harmony export */   "VBargraph": () => (/* binding */ VBargraph)
/* harmony export */ });
/* harmony import */ var _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_144121__(/*! ./AbstractOutputItem */ "./src/layout/AbstractOutputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class VBargraph extends _AbstractOutputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractOutputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "vbargraph",
      width: 1,
      height: 5,
      sizing: "vertical"
    });
  }

}

/***/ }),

/***/ "./src/layout/VGroup.ts":
/*!******************************!*\
  !*** ./src/layout/VGroup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_145205__) => {

__nested_webpack_require_145205__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_145205__.d(__webpack_exports__, {
/* harmony export */   "VGroup": () => (/* binding */ VGroup)
/* harmony export */ });
/* harmony import */ var _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_145205__(/*! ./AbstractGroup */ "./src/layout/AbstractGroup.ts");

class VGroup extends _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup {
  adjust() {
    this.items.forEach(item => {
      item.adjust();
      this.layout.width = Math.max(this.layout.width, item.layout.width + 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding);
      this.layout.height += item.layout.height;
    });
    this.layout.height += _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.spaceBetween * (this.items.length - 1);
    if (this.layout.width < 1) this.layout.width += 1;
    return this;
  }

  expand(dX, dY) {
    var vExpandItems = 0;
    this.items.forEach(item => {
      if (item.layout.sizing === "both" || item.layout.sizing === "vertical") vExpandItems++;
    });
    this.items.forEach(item => {
      var dX$ = 0;
      var dY$ = 0; // Space available to expand for current item

      if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") {
        dX$ = this.layout.width - 2 * _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding - item.layout.width;
        item.layout.width += dX$;
      }

      if (item.layout.sizing === "both" || item.layout.sizing === "vertical") {
        dY$ = vExpandItems ? dY / vExpandItems : 0;
        item.layout.height += dY$;
      }

      item.expand(dX$, dY$);
    });
    return this;
  }

  offset() {
    var labelHeight = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.labelHeight,
        padding = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.padding,
        spaceBetween = _AbstractGroup__WEBPACK_IMPORTED_MODULE_0__.AbstractGroup.spaceBetween;
    var $left = padding;
    var $top = padding + labelHeight;
    var width = this.layout.width;
    this.items.forEach(item => {
      item.layout.offsetLeft = $left;
      item.layout.offsetTop = $top; // center the item

      item.layout.offsetLeft += (width - item.layout.width) / 2 - padding;
      item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
      item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
      item.offset();
      $top += item.layout.height + spaceBetween;
    });
    return this;
  }

}

/***/ }),

/***/ "./src/layout/VSlider.ts":
/*!*******************************!*\
  !*** ./src/layout/VSlider.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_147956__) => {

__nested_webpack_require_147956__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_147956__.d(__webpack_exports__, {
/* harmony export */   "VSlider": () => (/* binding */ VSlider)
/* harmony export */ });
/* harmony import */ var _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_147956__(/*! ./AbstractInputItem */ "./src/layout/AbstractInputItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class VSlider extends _AbstractInputItem__WEBPACK_IMPORTED_MODULE_0__.AbstractInputItem {
  constructor() {
    super(...arguments);

    _defineProperty(this, "layout", {
      type: "vslider",
      width: 1,
      height: 5,
      sizing: "vertical"
    });
  }

}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Base.scss":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Base.scss ***!
  \***************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_149334__) => {

__nested_webpack_require_149334__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_149334__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_149334__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_149334__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_149334__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_149334__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component {\n  display: flex;\n  position: absolute;\n  flex-direction: column;\n  overflow: hidden; }\n  .faust-ui-component:focus {\n    outline: none; }\n  .faust-ui-component > .faust-ui-component-label {\n    position: relative;\n    margin-top: 4px;\n    width: 100%;\n    user-select: none; }\n    .faust-ui-component > .faust-ui-component-label > canvas {\n      position: relative;\n      display: block;\n      max-width: 100%;\n      max-height: 100%; }\n  .faust-ui-component input {\n    box-shadow: none; }\n", "",{"version":3,"sources":["webpack://./src/components/Base.scss"],"names":[],"mappings":"AAAA;EACI,aAAa;EACb,kBAAkB;EAClB,sBAAsB;EACtB,gBAAgB,EAAA;EAJpB;IAMQ,aAAa,EAAA;EANrB;IASQ,kBAAkB;IAClB,eAAe;IACf,WAAW;IACX,iBAAiB,EAAA;IAZzB;MAcY,kBAAkB;MAClB,cAAc;MACd,eAAe;MACf,gBAAgB,EAAA;EAjB5B;IAqBQ,gBAAgB,EAAA","sourcesContent":[".faust-ui-component {\n    display: flex;\n    position: absolute;\n    flex-direction: column;\n    overflow: hidden;\n    &:focus {\n        outline: none;\n    }\n    & > .faust-ui-component-label {\n        position: relative;\n        margin-top: 4px;\n        width: 100%;\n        user-select: none;\n        & > canvas {\n            position: relative;\n            display: block;\n            max-width: 100%;\n            max-height: 100%;\n        }\n    }\n    & input {\n        box-shadow: none;\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Button.scss":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Button.scss ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_152870__) => {

__nested_webpack_require_152870__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_152870__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_152870__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_152870__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_152870__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_152870__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-button > div {\n  display: flex;\n  position: relative;\n  cursor: pointer;\n  border-width: 1px;\n  text-align: center;\n  border-radius: 4px;\n  flex: 1 0 auto;\n  border-style: solid; }\n  .faust-ui-component.faust-ui-component-button > div > span {\n    user-select: none;\n    margin: auto; }\n", "",{"version":3,"sources":["webpack://./src/components/Button.scss"],"names":[],"mappings":"AAAA;EAEQ,aAAa;EACb,kBAAkB;EAClB,eAAe;EACf,iBAAiB;EACjB,kBAAkB;EAClB,kBAAkB;EAClB,cAAc;EACd,mBAAmB,EAAA;EAT3B;IAWY,iBAAiB;IACjB,YAAY,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-button {\n    & > div {\n        display: flex;\n        position: relative;\n        cursor: pointer;\n        border-width: 1px;\n        text-align: center;\n        border-radius: 4px;\n        flex: 1 0 auto;\n        border-style: solid;\n        & > span {\n            user-select: none;\n            margin: auto;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Checkbox.scss":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Checkbox.scss ***!
  \*******************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_156005__) => {

__nested_webpack_require_156005__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_156005__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_156005__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_156005__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_156005__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_156005__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-checkbox > div {\n  display: flex;\n  position: relative;\n  cursor: pointer;\n  border-width: 1px;\n  text-align: center;\n  border-radius: 1px;\n  flex: 1 0 auto;\n  border-style: solid; }\n  .faust-ui-component.faust-ui-component-checkbox > div > span {\n    margin: auto;\n    user-select: none; }\n", "",{"version":3,"sources":["webpack://./src/components/Checkbox.scss"],"names":[],"mappings":"AAAA;EAEQ,aAAa;EACb,kBAAkB;EAClB,eAAe;EACf,iBAAiB;EACjB,kBAAkB;EAClB,kBAAkB;EAClB,cAAc;EACd,mBAAmB,EAAA;EAT3B;IAWY,YAAY;IACZ,iBAAiB,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-checkbox {\n    & > div {\n        display: flex;\n        position: relative;\n        cursor: pointer;\n        border-width: 1px;\n        text-align: center;\n        border-radius: 1px;\n        flex: 1 0 auto;\n        border-style: solid;\n        & > span {\n            margin: auto;\n            user-select: none;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Group.scss":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Group.scss ***!
  \****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_159135__) => {

__nested_webpack_require_159135__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_159135__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_159135__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_159135__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_159135__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_159135__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-group {\n  position: absolute;\n  display: block;\n  background-color: rgba(80, 80, 80, 0.75);\n  border-radius: 4px;\n  border: 1px rgba(255, 255, 255, 0.25) solid; }\n  .faust-ui-group > .faust-ui-group-label {\n    position: relative;\n    margin: 4px;\n    width: calc(100% - 8px);\n    user-select: none; }\n    .faust-ui-group > .faust-ui-group-label > canvas {\n      position: relative;\n      display: block;\n      max-width: 100%;\n      max-height: 100%; }\n  .faust-ui-group .faust-ui-tgroup-tabs {\n    position: absolute;\n    display: inline-block; }\n    .faust-ui-group .faust-ui-tgroup-tabs .faust-ui-tgroup-tab {\n      position: relative;\n      display: inline-block;\n      border-radius: 5px;\n      cursor: pointer;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      user-select: none;\n      margin: 10px;\n      text-align: center;\n      background-color: rgba(255, 255, 255, 0.5); }\n      .faust-ui-group .faust-ui-tgroup-tabs .faust-ui-tgroup-tab:hover {\n        background-color: white; }\n      .faust-ui-group .faust-ui-tgroup-tabs .faust-ui-tgroup-tab.active {\n        background-color: #282828;\n        color: white; }\n", "",{"version":3,"sources":["webpack://./src/components/Group.scss"],"names":[],"mappings":"AACA;EACI,kBAAkB;EAClB,cAAc;EACd,wCAAwC;EACxC,kBAAkB;EAClB,2CAA2C,EAAA;EAL/C;IAOQ,kBAAkB;IAClB,WAAW;IACX,uBAAuB;IACvB,iBAAiB,EAAA;IAVzB;MAYY,kBAAkB;MAClB,cAAc;MACd,eAAe;MACf,gBAAgB,EAAA;EAf5B;IAmBQ,kBAAkB;IAClB,qBAAqB,EAAA;IApB7B;MAsBY,kBAAkB;MAClB,qBAAqB;MACrB,kBAAkB;MAClB,eAAe;MACf,uBAAuB;MACvB,mBAAmB;MACnB,iBAAiB;MACjB,YAAY;MACZ,kBAAkB;MAClB,0CAA0C,EAAA;MA/BtD;QAiCgB,uBAAwC,EAAA;MAjCxD;QAoCgB,yBAAqC;QACrC,YAAY,EAAA","sourcesContent":["\n.faust-ui-group {\n    position: absolute;\n    display: block;\n    background-color: rgba(80, 80, 80, 0.75);\n    border-radius: 4px;\n    border: 1px rgba(255, 255, 255, 0.25) solid;\n    & > .faust-ui-group-label {\n        position: relative;\n        margin: 4px;\n        width: calc(100% - 8px);\n        user-select: none;\n        & > canvas {\n            position: relative;\n            display: block;\n            max-width: 100%;\n            max-height: 100%;\n        }\n    }\n    & .faust-ui-tgroup-tabs {\n        position: absolute;\n        display: inline-block;\n        & .faust-ui-tgroup-tab {\n            position: relative;\n            display: inline-block;\n            border-radius: 5px;\n            cursor: pointer;\n            text-overflow: ellipsis;\n            white-space: nowrap;\n            user-select: none;\n            margin: 10px;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.5);\n            &:hover {\n                background-color: rgba(255, 255, 255, 1);\n            }\n            &.active {\n                background-color: rgba(40, 40, 40, 1);\n                color: white;\n            }\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HBargraph.scss":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HBargraph.scss ***!
  \********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_164241__) => {

__nested_webpack_require_164241__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_164241__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_164241__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_164241__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_164241__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_164241__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-label {\n  flex: 0 0 auto; }\n\n.faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-hbargraph-flexdiv {\n  position: relative;\n  display: flex;\n  flex-direction: row-reverse;\n  flex: 1 1 auto;\n  width: 100%;\n  height: auto; }\n  .faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-hbargraph-flexdiv > .faust-ui-component-hbargraph-canvasdiv {\n    position: relative;\n    display: block;\n    flex: 1 1 auto;\n    height: 100%;\n    margin: auto; }\n    .faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-hbargraph-flexdiv > .faust-ui-component-hbargraph-canvasdiv > canvas {\n      position: absolute;\n      display: block;\n      height: 100%;\n      width: 100%; }\n  .faust-ui-component.faust-ui-component-hbargraph > .faust-ui-component-hbargraph-flexdiv > input {\n    position: relative;\n    display: block;\n    flex: 0 1 auto;\n    text-align: center;\n    background-color: rgba(255, 255, 255, 0.25);\n    margin: auto 5px auto auto;\n    border-width: 0px;\n    border-radius: 4px;\n    width: calc(20% - 13px);\n    padding: 2px 4px; }\n", "",{"version":3,"sources":["webpack://./src/components/HBargraph.scss"],"names":[],"mappings":"AAAA;EAEQ,cAAc,EAAA;;AAFtB;EAKQ,kBAAkB;EAClB,aAAa;EACb,2BAA2B;EAC3B,cAAc;EACd,WAAW;EACX,YAAY,EAAA;EAVpB;IAYY,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,YAAY;IACZ,YAAY,EAAA;IAhBxB;MAkBgB,kBAAkB;MAClB,cAAc;MACd,YAAY;MACZ,WAAW,EAAA;EArB3B;IAyBY,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,kBAAkB;IAClB,2CAA2C;IAC3C,0BAA0B;IAC1B,iBAAiB;IACjB,kBAAkB;IAClB,uBAAuB;IACvB,gBAAgB,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-hbargraph {\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-hbargraph-flexdiv {\n        position: relative;\n        display: flex;\n        flex-direction: row-reverse;\n        flex: 1 1 auto;\n        width: 100%;\n        height: auto;\n        & > .faust-ui-component-hbargraph-canvasdiv {\n            position: relative;\n            display: block;\n            flex: 1 1 auto;\n            height: 100%;\n            margin: auto;\n            & > canvas {\n                position: absolute;\n                display: block;\n                height: 100%;\n                width: 100%;\n            }\n        }\n        & > input {\n            position: relative;\n            display: block;\n            flex: 0 1 auto;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.25);\n            margin: auto 5px auto auto;\n            border-width: 0px;\n            border-radius: 4px;\n            width: calc(20% - 13px);\n            padding: 2px 4px;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HSlider.scss":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HSlider.scss ***!
  \******************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_169169__) => {

__nested_webpack_require_169169__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_169169__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_169169__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_169169__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_169169__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_169169__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-hslider > .faust-ui-component-label {\n  flex: 0 0 auto; }\n\n.faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv {\n  position: relative;\n  display: flex;\n  flex-direction: row-reverse;\n  flex: 1 1 auto;\n  width: 100%;\n  height: auto; }\n  .faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > .faust-ui-component-hslider-canvasdiv {\n    position: relative;\n    display: block;\n    flex: 1 1 auto;\n    height: 100%;\n    margin: auto; }\n    .faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > .faust-ui-component-hslider-canvasdiv > canvas {\n      position: absolute;\n      display: block;\n      height: 100%;\n      width: 100%; }\n  .faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > input {\n    position: relative;\n    display: block;\n    flex: 0 1 auto;\n    text-align: center;\n    background-color: rgba(255, 255, 255, 0.25);\n    margin: auto 5px auto auto;\n    border-width: 0px;\n    border-radius: 4px;\n    width: calc(20% - 13px);\n    padding: 2px 4px;\n    -moz-appearance: textfield; }\n    .faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > input::-webkit-inner-spin-button, .faust-ui-component.faust-ui-component-hslider > .faust-ui-component-hslider-flexdiv > input::-webkit-outer-spin-button {\n      -webkit-appearance: none;\n      margin: 0; }\n", "",{"version":3,"sources":["webpack://./src/components/HSlider.scss"],"names":[],"mappings":"AAAA;EAEQ,cAAc,EAAA;;AAFtB;EAKQ,kBAAkB;EAClB,aAAa;EACb,2BAA2B;EAC3B,cAAc;EACd,WAAW;EACX,YAAY,EAAA;EAVpB;IAYY,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,YAAY;IACZ,YAAY,EAAA;IAhBxB;MAkBgB,kBAAkB;MAClB,cAAc;MACd,YAAY;MACZ,WAAW,EAAA;EArB3B;IAyBY,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,kBAAkB;IAClB,2CAA2C;IAC3C,0BAA0B;IAC1B,iBAAiB;IACjB,kBAAkB;IAClB,uBAAuB;IACvB,gBAAgB;IAChB,0BAAyB,EAAA;IAnCrC;MAsCgB,wBAAwB;MACxB,SAAS,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-hslider {\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-hslider-flexdiv {\n        position: relative;\n        display: flex;\n        flex-direction: row-reverse;\n        flex: 1 1 auto;\n        width: 100%;\n        height: auto;\n        & > .faust-ui-component-hslider-canvasdiv {\n            position: relative;\n            display: block;\n            flex: 1 1 auto;\n            height: 100%;\n            margin: auto;\n            & > canvas {\n                position: absolute;\n                display: block;\n                height: 100%;\n                width: 100%;\n            }\n        }\n        & > input {\n            position: relative;\n            display: block;\n            flex: 0 1 auto;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.25);\n            margin: auto 5px auto auto;\n            border-width: 0px;\n            border-radius: 4px;\n            width: calc(20% - 13px);\n            padding: 2px 4px;\n            -moz-appearance:textfield;\n            &::-webkit-inner-spin-button, \n            &::-webkit-outer-spin-button {\n                -webkit-appearance: none;\n                margin: 0;\n            }\n        }\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Knob.scss":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Knob.scss ***!
  \***************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_174655__) => {

__nested_webpack_require_174655__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_174655__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_174655__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_174655__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_174655__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_174655__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-knob {\n  align-items: center; }\n  .faust-ui-component.faust-ui-component-knob > canvas {\n    position: relative;\n    display: block;\n    flex: 1 1 auto;\n    min-height: 50%;\n    width: 100%; }\n  .faust-ui-component.faust-ui-component-knob > input {\n    position: relative;\n    display: block;\n    flex: 0 1 auto;\n    text-align: center;\n    background-color: rgba(255, 255, 255, 0.25);\n    margin: 0px;\n    border-width: 0px;\n    border-radius: 4px;\n    max-width: calc(100% - 8px);\n    padding: 2px 4px;\n    -moz-appearance: textfield; }\n    .faust-ui-component.faust-ui-component-knob > input::-webkit-inner-spin-button, .faust-ui-component.faust-ui-component-knob > input::-webkit-outer-spin-button {\n      -webkit-appearance: none;\n      margin: 0; }\n", "",{"version":3,"sources":["webpack://./src/components/Knob.scss"],"names":[],"mappings":"AAAA;EACI,mBAAmB,EAAA;EADvB;IAGQ,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,eAAe;IACf,WAAW,EAAA;EAPnB;IAUQ,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,kBAAkB;IAClB,2CAA2C;IAC3C,WAAW;IACX,iBAAiB;IACjB,kBAAkB;IAClB,2BAA2B;IAC3B,gBAAgB;IAChB,0BAAyB,EAAA;IApBjC;MAuBY,wBAAwB;MACxB,SAAS,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-knob {\n    align-items: center;\n    & > canvas {\n        position: relative;\n        display: block;\n        flex: 1 1 auto;\n        min-height: 50%;\n        width: 100%;\n    }\n    & > input {\n        position: relative;\n        display: block;\n        flex: 0 1 auto;\n        text-align: center;\n        background-color: rgba(255, 255, 255, 0.25);\n        margin: 0px;\n        border-width: 0px;\n        border-radius: 4px;\n        max-width: calc(100% - 8px);\n        padding: 2px 4px;\n        -moz-appearance:textfield;\n        &::-webkit-inner-spin-button, \n        &::-webkit-outer-spin-button {\n            -webkit-appearance: none;\n            margin: 0;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Led.scss":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Led.scss ***!
  \**************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_178739__) => {

__nested_webpack_require_178739__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_178739__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_178739__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_178739__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_178739__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_178739__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-led {\n  align-items: center; }\n  .faust-ui-component.faust-ui-component-led > .faust-ui-component-label {\n    flex: 0 0 auto; }\n  .faust-ui-component.faust-ui-component-led > .faust-ui-component-led-canvasdiv {\n    position: relative;\n    display: block;\n    flex: 1 1 auto;\n    width: 100%; }\n    .faust-ui-component.faust-ui-component-led > .faust-ui-component-led-canvasdiv > canvas {\n      position: absolute;\n      display: block;\n      height: 100%;\n      width: 100%; }\n", "",{"version":3,"sources":["webpack://./src/components/Led.scss"],"names":[],"mappings":"AAAA;EACI,mBAAmB,EAAA;EADvB;IAGQ,cAAc,EAAA;EAHtB;IAMQ,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,WAAW,EAAA;IATnB;MAWY,kBAAkB;MAClB,cAAc;MACd,YAAY;MACZ,WAAW,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-led {\n    align-items: center;\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-led-canvasdiv {\n        position: relative;\n        display: block;\n        flex: 1 1 auto;\n        width: 100%;\n        & > canvas {\n            position: absolute;\n            display: block;\n            height: 100%;\n            width: 100%;\n        }\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Menu.scss":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Menu.scss ***!
  \***************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_182123__) => {

__nested_webpack_require_182123__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_182123__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_182123__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_182123__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_182123__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_182123__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-menu {\n  align-items: center; }\n  .faust-ui-component.faust-ui-component-menu > select {\n    margin: 0px;\n    text-align: center;\n    border-width: 1px;\n    border-radius: 4px;\n    padding: 2px 4px;\n    width: calc(100% - 8px); }\n", "",{"version":3,"sources":["webpack://./src/components/Menu.scss"],"names":[],"mappings":"AAAA;EACI,mBAAmB,EAAA;EADvB;IAGQ,WAAW;IACX,kBAAkB;IAClB,iBAAiB;IACjB,kBAAkB;IAClB,gBAAgB;IAChB,uBAAuB,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-menu {\n    align-items: center;\n    & > select {\n        margin: 0px;\n        text-align: center;\n        border-width: 1px;\n        border-radius: 4px;\n        padding: 2px 4px;\n        width: calc(100% - 8px);\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Nentry.scss":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Nentry.scss ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_185043__) => {

__nested_webpack_require_185043__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_185043__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_185043__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_185043__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_185043__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_185043__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-nentry {\n  align-items: center; }\n  .faust-ui-component.faust-ui-component-nentry input {\n    margin: 0px;\n    text-align: center;\n    border-width: 1px;\n    border-radius: 4px;\n    padding: 2px 4px;\n    width: calc(100% - 8px); }\n    .faust-ui-component.faust-ui-component-nentry input::-webkit-inner-spin-button, .faust-ui-component.faust-ui-component-nentry input::-webkit-outer-spin-button {\n      opacity: 1; }\n", "",{"version":3,"sources":["webpack://./src/components/Nentry.scss"],"names":[],"mappings":"AAAA;EACI,mBAAmB,EAAA;EADvB;IAGQ,WAAW;IACX,kBAAkB;IAClB,iBAAiB;IACjB,kBAAkB;IAClB,gBAAgB;IAChB,uBAAuB,EAAA;IAR/B;MAWY,UAAU,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-nentry {\n    align-items: center;\n    & input {\n        margin: 0px;\n        text-align: center;\n        border-width: 1px;\n        border-radius: 4px;\n        padding: 2px 4px;\n        width: calc(100% - 8px);\n        &::-webkit-inner-spin-button, \n        &::-webkit-outer-spin-button {\n            opacity: 1;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Numerical.scss":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Numerical.scss ***!
  \********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_188301__) => {

__nested_webpack_require_188301__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_188301__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_188301__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_188301__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_188301__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_188301__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-numerical {\n  align-items: center; }\n  .faust-ui-component.faust-ui-component-numerical > input {\n    position: relative;\n    display: block;\n    flex: 0 1 auto;\n    text-align: center;\n    background-color: rgba(255, 255, 255, 0.25);\n    margin: auto;\n    border-width: 0px;\n    border-radius: 4px;\n    width: calc(100% - 8px);\n    padding: 2px 4px; }\n", "",{"version":3,"sources":["webpack://./src/components/Numerical.scss"],"names":[],"mappings":"AAAA;EACI,mBAAmB,EAAA;EADvB;IAGQ,kBAAkB;IAClB,cAAc;IACd,cAAc;IACd,kBAAkB;IAClB,2CAA2C;IAC3C,YAAY;IACZ,iBAAiB;IACjB,kBAAkB;IAClB,uBAAuB;IACvB,gBAAgB,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-numerical {\n    align-items: center;\n    & > input {\n        position: relative;\n        display: block;\n        flex: 0 1 auto;\n        text-align: center;\n        background-color: rgba(255, 255, 255, 0.25);\n        margin: auto;\n        border-width: 0px;\n        border-radius: 4px;\n        width: calc(100% - 8px);\n        padding: 2px 4px;\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Radio.scss":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Radio.scss ***!
  \****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_191533__) => {

__nested_webpack_require_191533__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_191533__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_191533__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_191533__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_191533__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_191533__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-radio {\n  align-items: center; }\n  .faust-ui-component.faust-ui-component-radio > .faust-ui-component-label {\n    flex: 0 0 auto;\n    margin-top: auto; }\n  .faust-ui-component.faust-ui-component-radio > .faust-ui-component-radio-group {\n    flex: 0 0 auto;\n    margin-bottom: auto;\n    border-width: 1px;\n    border-radius: 4px;\n    padding: 2px 4px;\n    width: calc(100% - 8px); }\n    .faust-ui-component.faust-ui-component-radio > .faust-ui-component-radio-group > div {\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      overflow: hidden; }\n", "",{"version":3,"sources":["webpack://./src/components/Radio.scss"],"names":[],"mappings":"AAAA;EACI,mBAAmB,EAAA;EADvB;IAGQ,cAAc;IACd,gBAAgB,EAAA;EAJxB;IAOQ,cAAc;IACd,mBAAmB;IACnB,iBAAiB;IACjB,kBAAkB;IAClB,gBAAgB;IAChB,uBAAuB,EAAA;IAZ/B;MAcY,uBAAuB;MACvB,mBAAmB;MACnB,gBAAgB,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-radio {\n    align-items: center;\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n        margin-top: auto;\n    }\n    & > .faust-ui-component-radio-group {\n        flex: 0 0 auto;\n        margin-bottom: auto;\n        border-width: 1px;\n        border-radius: 4px;\n        padding: 2px 4px;\n        width: calc(100% - 8px);\n        & > div {\n            text-overflow: ellipsis;\n            white-space: nowrap;\n            overflow: hidden;\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VBargraph.scss":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VBargraph.scss ***!
  \********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_195141__) => {

__nested_webpack_require_195141__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_195141__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_195141__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_195141__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_195141__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_195141__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-vbargraph {\n  align-items: center; }\n  .faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-label {\n    flex: 0 0 auto; }\n  .faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-vbargraph-flexdiv {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    flex: 1 1 auto;\n    width: 100%;\n    height: inherit; }\n    .faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-vbargraph-flexdiv > .faust-ui-component-vbargraph-canvasdiv {\n      position: relative;\n      display: block;\n      flex: 1 1 auto;\n      width: 100%; }\n      .faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-vbargraph-flexdiv > .faust-ui-component-vbargraph-canvasdiv > canvas {\n        position: absolute;\n        display: block;\n        height: 100%;\n        width: 100%; }\n    .faust-ui-component.faust-ui-component-vbargraph > .faust-ui-component-vbargraph-flexdiv > input {\n      position: relative;\n      display: block;\n      flex: 0 1 auto;\n      text-align: center;\n      background-color: rgba(255, 255, 255, 0.25);\n      margin: 5px auto auto auto;\n      border-width: 0px;\n      border-radius: 4px;\n      height: 5%;\n      width: calc(100% - 8px);\n      padding: 2px 4px; }\n", "",{"version":3,"sources":["webpack://./src/components/VBargraph.scss"],"names":[],"mappings":"AAAA;EACI,mBAAmB,EAAA;EADvB;IAGQ,cAAc,EAAA;EAHtB;IAMQ,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,cAAc;IACd,WAAW;IACX,eAAe,EAAA;IAXvB;MAaY,kBAAkB;MAClB,cAAc;MACd,cAAc;MACd,WAAW,EAAA;MAhBvB;QAkBgB,kBAAkB;QAClB,cAAc;QACd,YAAY;QACZ,WAAW,EAAA;IArB3B;MAyBY,kBAAkB;MAClB,cAAc;MACd,cAAc;MACd,kBAAkB;MAClB,2CAA2C;MAC3C,0BAA0B;MAC1B,iBAAiB;MACjB,kBAAkB;MAClB,UAAU;MACV,uBAAuB;MACvB,gBAAgB,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-vbargraph {\n    align-items: center;\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-vbargraph-flexdiv {\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        flex: 1 1 auto;\n        width: 100%;\n        height: inherit;\n        & > .faust-ui-component-vbargraph-canvasdiv {\n            position: relative;\n            display: block;\n            flex: 1 1 auto;\n            width: 100%;\n            & > canvas {\n                position: absolute;\n                display: block;\n                height: 100%;\n                width: 100%;\n            }\n        }\n        & > input {\n            position: relative;\n            display: block;\n            flex: 0 1 auto;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.25);\n            margin: 5px auto auto auto;\n            border-width: 0px;\n            border-radius: 4px;\n            height: 5%;\n            width: calc(100% - 8px);\n            padding: 2px 4px;\n        }\n    }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VSlider.scss":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VSlider.scss ***!
  \******************************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_200247__) => {

__nested_webpack_require_200247__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_200247__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_200247__(/*! ../../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_200247__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_200247__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_200247__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-component.faust-ui-component-vslider {\n  align-items: center; }\n  .faust-ui-component.faust-ui-component-vslider > .faust-ui-component-label {\n    flex: 0 0 auto; }\n  .faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    flex: 1 1 auto;\n    width: 100%;\n    height: auto; }\n    .faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv > .faust-ui-component-vslider-canvasdiv {\n      position: relative;\n      display: block;\n      flex: 1 1 auto;\n      width: 100%; }\n      .faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv > .faust-ui-component-vslider-canvasdiv > canvas {\n        position: absolute;\n        display: block;\n        height: 100%;\n        width: 100%; }\n    .faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv input {\n      position: relative;\n      display: block;\n      flex: 0 1 auto;\n      text-align: center;\n      background-color: rgba(255, 255, 255, 0.25);\n      margin: 5px auto auto auto;\n      border-width: 0px;\n      border-radius: 4px;\n      height: 5%;\n      max-width: calc(100% - 8px);\n      padding: 2px 4px;\n      -moz-appearance: textfield; }\n      .faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv input::-webkit-inner-spin-button, .faust-ui-component.faust-ui-component-vslider > .faust-ui-component-vslider-flexdiv input::-webkit-outer-spin-button {\n        -webkit-appearance: none;\n        margin: 0; }\n", "",{"version":3,"sources":["webpack://./src/components/VSlider.scss"],"names":[],"mappings":"AAAA;EACI,mBAAmB,EAAA;EADvB;IAGQ,cAAc,EAAA;EAHtB;IAMQ,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,cAAc;IACd,WAAW;IACX,YAAY,EAAA;IAXpB;MAaY,kBAAkB;MAClB,cAAc;MACd,cAAc;MACd,WAAW,EAAA;MAhBvB;QAkBgB,kBAAkB;QAClB,cAAc;QACd,YAAY;QACZ,WAAW,EAAA;IArB3B;MAyBY,kBAAkB;MAClB,cAAc;MACd,cAAc;MACd,kBAAkB;MAClB,2CAA2C;MAC3C,0BAA0B;MAC1B,iBAAiB;MACjB,kBAAkB;MAClB,UAAU;MACV,2BAA2B;MAC3B,gBAAgB;MAChB,0BAAyB,EAAA;MApCrC;QAuCgB,wBAAwB;QACxB,SAAS,EAAA","sourcesContent":[".faust-ui-component.faust-ui-component-vslider {\n    align-items: center;\n    & > .faust-ui-component-label {\n        flex: 0 0 auto;\n    }\n    & > .faust-ui-component-vslider-flexdiv {\n        position: relative;\n        display: flex;\n        flex-direction: column;\n        flex: 1 1 auto;\n        width: 100%;\n        height: auto;\n        & > .faust-ui-component-vslider-canvasdiv {\n            position: relative;\n            display: block;\n            flex: 1 1 auto;\n            width: 100%;\n            & > canvas {\n                position: absolute;\n                display: block;\n                height: 100%;\n                width: 100%;\n            }\n        }\n        & input {\n            position: relative;\n            display: block;\n            flex: 0 1 auto;\n            text-align: center;\n            background-color: rgba(255, 255, 255, 0.25);\n            margin: 5px auto auto auto;\n            border-width: 0px;\n            border-radius: 4px;\n            height: 5%;\n            max-width: calc(100% - 8px);\n            padding: 2px 4px;\n            -moz-appearance:textfield;\n            &::-webkit-inner-spin-button, \n            &::-webkit-outer-spin-button {\n                -webkit-appearance: none;\n                margin: 0;\n            }\n        }\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss ***!
  \*****************************************************************************************************/
/***/ ((module, __webpack_exports__, __nested_webpack_require_205867__) => {

__nested_webpack_require_205867__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_205867__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_205867__(/*! ../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_205867__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_205867__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nested_webpack_require_205867__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".faust-ui-root {\n  margin: 0px auto;\n  flex: 1 0 auto;\n  position: relative !important;\n  background-color: transparent !important;\n  border: none !important;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; }\n", "",{"version":3,"sources":["webpack://./src/index.scss"],"names":[],"mappings":"AAAA;EACI,gBAAgB;EAChB,cAAc;EACd,6BAA6B;EAC7B,wCAAwC;EACxC,uBAAuB;EACvB,kMAAkM,EAAA","sourcesContent":[".faust-ui-root {\n    margin: 0px auto;\n    flex: 1 0 auto;\n    position: relative !important;\n    background-color: transparent !important;\n    border: none !important;\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \************************************************************************/
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/components/Base.scss":
/*!**********************************!*\
  !*** ./src/components/Base.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_213139__) => {

__nested_webpack_require_213139__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_213139__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_213139__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_213139__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Base_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_213139__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Base.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Base.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Base_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Base_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Button.scss":
/*!************************************!*\
  !*** ./src/components/Button.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_215080__) => {

__nested_webpack_require_215080__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_215080__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_215080__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_215080__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Button_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_215080__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Button.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Button.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Button_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Button_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Checkbox.scss":
/*!**************************************!*\
  !*** ./src/components/Checkbox.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_217039__) => {

__nested_webpack_require_217039__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_217039__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_217039__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_217039__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Checkbox_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_217039__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Checkbox.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Checkbox.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Checkbox_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Checkbox_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Group.scss":
/*!***********************************!*\
  !*** ./src/components/Group.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_218996__) => {

__nested_webpack_require_218996__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_218996__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_218996__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_218996__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Group_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_218996__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Group.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Group.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Group_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Group_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/HBargraph.scss":
/*!***************************************!*\
  !*** ./src/components/HBargraph.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_220954__) => {

__nested_webpack_require_220954__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_220954__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_220954__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_220954__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HBargraph_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_220954__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./HBargraph.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HBargraph.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HBargraph_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HBargraph_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/HSlider.scss":
/*!*************************************!*\
  !*** ./src/components/HSlider.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_222924__) => {

__nested_webpack_require_222924__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_222924__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_222924__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_222924__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HSlider_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_222924__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./HSlider.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/HSlider.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HSlider_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_HSlider_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Knob.scss":
/*!**********************************!*\
  !*** ./src/components/Knob.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_224872__) => {

__nested_webpack_require_224872__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_224872__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_224872__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_224872__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Knob_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_224872__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Knob.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Knob.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Knob_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Knob_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Led.scss":
/*!*********************************!*\
  !*** ./src/components/Led.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_226801__) => {

__nested_webpack_require_226801__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_226801__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_226801__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_226801__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Led_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_226801__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Led.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Led.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Led_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Led_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Menu.scss":
/*!**********************************!*\
  !*** ./src/components/Menu.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_228729__) => {

__nested_webpack_require_228729__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_228729__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_228729__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_228729__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Menu_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_228729__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Menu.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Menu.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Menu_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Menu_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Nentry.scss":
/*!************************************!*\
  !*** ./src/components/Nentry.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_230670__) => {

__nested_webpack_require_230670__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_230670__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_230670__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_230670__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Nentry_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_230670__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Nentry.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Nentry.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Nentry_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Nentry_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Numerical.scss":
/*!***************************************!*\
  !*** ./src/components/Numerical.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_232633__) => {

__nested_webpack_require_232633__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_232633__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_232633__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_232633__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Numerical_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_232633__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Numerical.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Numerical.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Numerical_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Numerical_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/Radio.scss":
/*!***********************************!*\
  !*** ./src/components/Radio.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_234595__) => {

__nested_webpack_require_234595__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_234595__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_234595__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_234595__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Radio_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_234595__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Radio.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Radio.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Radio_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Radio_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/VBargraph.scss":
/*!***************************************!*\
  !*** ./src/components/VBargraph.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_236553__) => {

__nested_webpack_require_236553__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_236553__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_236553__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_236553__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VBargraph_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_236553__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./VBargraph.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VBargraph.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VBargraph_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VBargraph_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/components/VSlider.scss":
/*!*************************************!*\
  !*** ./src/components/VSlider.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_238523__) => {

__nested_webpack_require_238523__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_238523__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_238523__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_238523__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VSlider_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_238523__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./VSlider.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/VSlider.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VSlider_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_VSlider_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./src/index.scss":
/*!************************!*\
  !*** ./src/index.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __nested_webpack_require_240431__) => {

__nested_webpack_require_240431__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_240431__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_240431__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_240431__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_240431__(/*! !!../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/dist/cjs.js!./index.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __nested_webpack_require_242505__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =   true ? __nested_webpack_require_242505__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_249544__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_249544__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nested_webpack_require_249544__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nested_webpack_require_249544__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_249544__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_249544__.o(definition, key) && !__nested_webpack_require_249544__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_249544__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_249544__.r = (exports) => {
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
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__nested_webpack_require_249544__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_249544__.d(__webpack_exports__, {
/* harmony export */   "FaustUI": () => (/* reexport safe */ _FaustUI__WEBPACK_IMPORTED_MODULE_0__.FaustUI),
/* harmony export */   "instantiate": () => (/* reexport safe */ _instantiate__WEBPACK_IMPORTED_MODULE_1__.instantiate)
/* harmony export */ });
/* harmony import */ var _FaustUI__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_249544__(/*! ./FaustUI */ "./src/FaustUI.ts");
/* harmony import */ var _instantiate__WEBPACK_IMPORTED_MODULE_1__ = __nested_webpack_require_249544__(/*! ./instantiate */ "./src/instantiate.ts");


})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=faust-ui.js.map

/***/ })

}]);
//# sourceMappingURL=f3a506d28ebebe406101.js.map