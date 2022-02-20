"use strict";
{

/***/ "./src/core/text/TextEditor.ts":
/*!*************************************!*\
  !*** ./src/core/text/TextEditor.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TextEditor)
/* harmony export */ });
/* harmony import */ var _file_FileEditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/FileEditor */ "./src/core/file/FileEditor.ts");
/* harmony import */ var _TempTextFile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TempTextFile */ "./src/core/text/TempTextFile.ts");


class TextEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static async fromProjectItem({ file, env, project, instanceId }) {
    const text = file instanceof _TempTextFile__WEBPACK_IMPORTED_MODULE_1__["default"] ? file.data : await file.instantiate({ env, project, instanceId });
    const editor = new this(text);
    return editor.init();
  }
  get fileExtension() {
    return "txt";
  }
  get fileIcon() {
    return "code";
  }
  get text() {
    return this.instance.text;
  }
  set text(value) {
    this.instance.text = value;
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
  get editorLanguage() {
    if (!this.file)
      return "none";
    if (this.file.name.endsWith(".js"))
      return "js";
    if (this.file.name.endsWith(".json"))
      return "json";
    if (this.file.name.endsWith(".html"))
      return "html";
    if (this.file.name.endsWith(".dsp"))
      return "faust";
    return "none";
  }
  bindEditor(editor) {
    this.editor = editor;
    const didChanged = editor.onDidChangeModelContent((e) => {
      const oldText = this.text;
      const text = editor.getValue();
      this.text = text;
      this.emit("textModified", { text, oldText });
      this.emit("changed");
    });
    const didDispose = editor.onDidDispose(() => {
      didChanged.dispose();
      didDispose.dispose();
      this.editor = void 0;
      this.emit("destroy");
    });
    editor.addAction({
      id: "editor.action.save",
      label: "Save",
      keybindings: [2048 | 49],
      run: () => this.save()
    });
  }
  async copy() {
    if (!this.editor)
      return;
    this.editor.focus();
    document.execCommand("copy");
  }
  async cut() {
    if (!this.editor)
      return;
    this.editor.focus();
    document.execCommand("cut");
  }
  async paste() {
    if (!this.editor)
      return;
    this.editor.focus();
    const text = await navigator.clipboard.readText();
    this.editor.executeEdits("", [{ range: this.editor.getSelection(), text, forceMoveMarkers: true }]);
  }
  async deleteSelected() {
    if (!this.editor)
      return;
    this.editor.executeEdits("", [{ range: this.editor.getSelection(), text: null }]);
  }
  async selectAll() {
    if (!this.editor)
      return;
    const range = this.editor.getModel().getFullModelRange();
    this.editor.setSelection(range);
  }
  onUiResized() {
  }
}


/***/ })

};
//# sourceMappingURL=62a9e6eaa0362ba42c3e.worklet.js.map