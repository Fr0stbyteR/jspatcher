"use strict";
{

/***/ "./src/core/video/PatcherVideo.ts":
/*!****************************************!*\
  !*** ./src/core/video/PatcherVideo.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherVideo)
/* harmony export */ });
/* harmony import */ var _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/FileInstance */ "./src/core/file/FileInstance.ts");
/* harmony import */ var _VideoEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VideoEditor */ "./src/core/video/VideoEditor.ts");


class PatcherVideo extends _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static async fromProjectItem(options) {
    return new this(options).init(options.file.data);
  }
  async getEditor() {
    const editor = new _VideoEditor__WEBPACK_IMPORTED_MODULE_1__["default"](this);
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
    const patcherVideo = new PatcherVideo({ env: this.env, project: this.project, file: this.file });
    patcherVideo.objectURL = this.objectURL;
    return patcherVideo;
  }
}


/***/ }),

/***/ "./src/core/video/VideoEditor.ts":
/*!***************************************!*\
  !*** ./src/core/video/VideoEditor.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VideoEditor)
/* harmony export */ });
/* harmony import */ var _file_FileEditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/FileEditor */ "./src/core/file/FileEditor.ts");

class VideoEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static async fromProjectItem({ file, env, project, instanceId }) {
    const image = await file.instantiate({ env, project, instanceId });
    const editor = new this(image);
    return editor.init();
  }
  get fileExtension() {
    return "mp4";
  }
  get fileIcon() {
    return "video";
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
//# sourceMappingURL=2986be4c6755a61b6228.worklet.js.map