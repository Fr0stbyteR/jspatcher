"use strict";
{

/***/ "./src/core/image/ImageEditor.ts":
/*!***************************************!*\
  !*** ./src/core/image/ImageEditor.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImageEditor)
/* harmony export */ });
/* harmony import */ var _file_FileEditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/FileEditor */ "./src/core/file/FileEditor.ts");

class ImageEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_0__.default {
  static async fromProjectItem({ file, env, project, instanceId }) {
    const image = await file.instantiate({ env, project, instanceId });
    const editor = new this(image);
    return editor.init();
  }
  get fileExtension() {
    return "png";
  }
  get fileIcon() {
    return "picture";
  }
  get history() {
    return this._history;
  }
  async init() {
    if (!this.instance.isReady) {
      await new Promise((resolve, reject) => {
        const handleReady = () => {
          resolve();
          this.instance.off("ready", handleReady);
        };
        this.instance.on("ready", handleReady);
      });
    }
    this._isReady = true;
    this.emit("ready");
    return this;
  }
  async undo() {
  }
  async redo() {
  }
  async copy() {
  }
  async cut() {
  }
  async paste() {
  }
  async deleteSelected() {
  }
  async selectAll() {
  }
  onUiResized() {
  }
}


/***/ })

};
//# sourceMappingURL=584ea18f5287878d2071.worklet.js.map