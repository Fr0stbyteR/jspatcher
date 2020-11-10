(window["webpackJsonpJSPatcher"] = window["webpackJsonpJSPatcher"] || []).push([[12],{

/***/ "./src/core/objects/WebRTC/Base.ts":
/*!*****************************************!*\
  !*** ./src/core/objects/WebRTC/Base.ts ***!
  \*****************************************/
/*! exports provided: DefaultWebRTCObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultWebRTCObject", function() { return DefaultWebRTCObject; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class DefaultWebRTCObject extends _Base__WEBPACK_IMPORTED_MODULE_0__["DefaultObject"] {}

_defineProperty(DefaultWebRTCObject, "package", "WebRTC");

_defineProperty(DefaultWebRTCObject, "author", "Fr0stbyteR");

_defineProperty(DefaultWebRTCObject, "version", "1.0.0");

_defineProperty(DefaultWebRTCObject, "description", "WebRTC Object");

/***/ }),

/***/ "./src/core/objects/WebRTC/devices.ts":
/*!********************************************!*\
  !*** ./src/core/objects/WebRTC/devices.ts ***!
  \********************************************/
/*! exports provided: mediaDevices */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mediaDevices", function() { return mediaDevices; });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Base */ "./src/core/objects/Base.tsx");
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Base */ "./src/core/objects/WebRTC/Base.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class mediaDevices extends _Base__WEBPACK_IMPORTED_MODULE_1__["DefaultWebRTCObject"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handleDeviceChange", async () => {
      if (!this.getProp("autoUpdate")) return;
      const filters = this.box.args.slice();
      if (!filters.length) filters.push("audioinput", "audiooutput", "videoinput");
      const devices = await navigator.mediaDevices.enumerateDevices();
      const options = devices.filter(d => filters.indexOf(d.kind) !== -1).map((d, key) => {
        const {
          kind,
          deviceId,
          label
        } = d;
        return {
          key,
          icon: {
            audioinput: "microphone",
            audiooutput: "volume up",
            videoinput: "camera"
          }[kind],
          text: label || deviceId,
          value: deviceId
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
    this.on("postInit", () => {
      navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
      if (this.getProp("autoUpdate")) this.handleDeviceChange();
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
          if (!filters.length) filters.push("audioinput", "audiooutput", "videoinput");
        } else {
          filters = data.slice();
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const options = devices.filter(d => filters.indexOf(d.kind) !== -1).map((d, key) => {
          const {
            kind,
            deviceId,
            label
          } = d;
          return {
            key,
            icon: {
              audioinput: "microphone",
              audiooutput: "volume up",
              videoinput: "camera"
            }[kind],
            text: label || deviceId,
            value: deviceId
          };
        });
        this.outletAll([devices, options]);
      }
    });
    this.on("destroy", () => {
      navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
    });
  }

}

_defineProperty(mediaDevices, "description", "Enumerate media devices");

_defineProperty(mediaDevices, "inlets", [{
  isHot: true,
  type: "object",
  description: "Bang to enumerate, MediaDeviceKind[] to use a filter"
}]);

_defineProperty(mediaDevices, "outlets", [{
  type: "object",
  description: "Array of MediaDeviceInfo"
}, {
  type: "object",
  description: "Array of DropdownItemProps"
}]);

_defineProperty(mediaDevices, "args", [{
  type: "enum",
  varLength: true,
  optional: true,
  enums: ["audioinput", "audiooutput", "videoinput"],
  default: ["audioinput", "audiooutput", "videoinput"],
  description: "Output only kinds of devices"
}]);

_defineProperty(mediaDevices, "props", {
  autoUpdate: {
    type: "boolean",
    default: true,
    description: "Auto output devices when devices change"
  }
});

/***/ }),

/***/ "./src/core/objects/WebRTC/exports.ts":
/*!********************************************!*\
  !*** ./src/core/objects/WebRTC/exports.ts ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _devices__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./devices */ "./src/core/objects/WebRTC/devices.ts");

/* harmony default export */ __webpack_exports__["default"] = ({
  mediaDevices: _devices__WEBPACK_IMPORTED_MODULE_0__["mediaDevices"]
});

/***/ })

}]);
//# sourceMappingURL=0dc942948e50dc16b15b.js.map