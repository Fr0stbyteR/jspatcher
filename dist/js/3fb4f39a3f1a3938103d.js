"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_video_PatcherVideo_ts"],{

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


/***/ })

}]);
//# sourceMappingURL=3fb4f39a3f1a3938103d.js.map