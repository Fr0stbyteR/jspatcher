"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_core_image_PatcherImage_ts"],{

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


class PatcherImage extends _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__.default {
  static async fromProjectItem(options) {
    return new this(options).init(options.file.data);
  }
  async getEditor() {
    const editor = new _ImageEditor__WEBPACK_IMPORTED_MODULE_1__.default(this);
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

}]);
//# sourceMappingURL=57e4115a5ff45fae0108.js.map