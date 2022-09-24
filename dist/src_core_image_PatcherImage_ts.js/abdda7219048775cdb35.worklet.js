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

class ImageEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_0__["default"] {
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


/***/ }),

/***/ "./src/core/image/PatcherImage.ts":
/*!****************************************!*\
  !*** ./src/core/image/PatcherImage.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherImage)
/* harmony export */ });
/* harmony import */ var _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/FileInstance */ "./src/core/file/FileInstance.ts");
/* harmony import */ var _ImageEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImageEditor */ "./src/core/image/ImageEditor.ts");


class PatcherImage extends _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static async fromProjectItem(options) {
    return new this(options).init(options.file.data);
  }
  async getEditor() {
    const editor = new _ImageEditor__WEBPACK_IMPORTED_MODULE_1__["default"](this);
    return editor.init();
  }
  async init(data) {
    if (data)
      this.objectURL = URL.createObjectURL(await new Response(data).blob());
    else
      this.objectURL = "";
    this._isReady = true;
    this.emit("ready");
    return this;
  }
  async serialize() {
    return (await fetch(this.objectURL)).arrayBuffer();
  }
  clone() {
    const patcherImage = new PatcherImage({ env: this.env, project: this.project, file: this.file });
    patcherImage.objectURL = this.objectURL;
    return patcherImage;
  }
}


/***/ })

};
//# sourceMappingURL=abdda7219048775cdb35.worklet.js.map