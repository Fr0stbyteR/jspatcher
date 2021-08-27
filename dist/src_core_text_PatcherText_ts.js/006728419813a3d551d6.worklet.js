"use strict";
{

/***/ "./src/core/text/PatcherText.ts":
/*!**************************************!*\
  !*** ./src/core/text/PatcherText.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherText)
/* harmony export */ });
/* harmony import */ var _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/FileInstance */ "./src/core/file/FileInstance.ts");
/* harmony import */ var _TextEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextEditor */ "./src/core/text/TextEditor.ts");
/* harmony import */ var _TextHistory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TextHistory */ "./src/core/text/TextHistory.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class PatcherText extends _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "text", void 0);

    _defineProperty(this, "_history", new _TextHistory__WEBPACK_IMPORTED_MODULE_2__.default());
  }

  static async fromProjectItem(options) {
    return new this(options).init(options.file.data);
  }

  async getEditor() {
    const editor = new _TextEditor__WEBPACK_IMPORTED_MODULE_1__.default(this);
    return editor.init();
  }

  async init(data) {
    if (data) this.text = await new Response(data).text();else this.text = "";
    this._isReady = true;
    this.emit("ready");
    return this;
  }

  async serialize() {
    return new Blob([this.text]).arrayBuffer();
  }

  clone() {
    const patcherText = new PatcherText({
      env: this.env,
      project: this.project,
      file: this.file
    });
    patcherText.text = this.text;
    return patcherText;
  }

}

/***/ }),

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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class TextEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "editor", void 0);

    _defineProperty(this, "editorJSX", void 0);
  }

  static async fromProjectItem(_ref) {
    let {
      file,
      env,
      project,
      instanceId
    } = _ref;
    const text = file instanceof _TempTextFile__WEBPACK_IMPORTED_MODULE_1__.default ? file.data : await file.instantiate({
      env,
      project,
      instanceId
    });
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
    if (!this.file) return "none";
    if (this.file.name.endsWith(".js")) return "js";
    if (this.file.name.endsWith(".json")) return "json";
    if (this.file.name.endsWith(".html")) return "html";
    if (this.file.name.endsWith(".dsp")) return "faust";
    return "none";
  }

  bindEditor(editor) {
    this.editor = editor;
    const didChanged = editor.onDidChangeModelContent(e => {
      const oldText = this.text;
      const text = editor.getValue();
      this.text = text;
      this.emit("textModified", {
        text,
        oldText
      });
      this.emit("changed");
    });
    const didDispose = editor.onDidDispose(() => {
      didChanged.dispose();
      didDispose.dispose();
      this.editor = undefined;
      this.emit("destroy");
    });
    editor.addAction({
      id: "editor.action.save",
      label: "Save",
      keybindings: [
      /* KeyMod.CtrlCmd */
      2048 |
      /* KeyCode.KEY_S */
      49],
      run: () => this.save()
    });
  }

  async copy() {
    if (!this.editor) return;
    this.editor.focus();
    document.execCommand("copy");
  }

  async cut() {
    if (!this.editor) return;
    this.editor.focus();
    document.execCommand("cut");
  }

  async paste() {
    if (!this.editor) return;
    this.editor.focus();
    const text = await navigator.clipboard.readText();
    this.editor.executeEdits("", [{
      range: this.editor.getSelection(),
      text,
      forceMoveMarkers: true
    }]);
  }

  async deleteSelected() {
    if (!this.editor) return;
    this.editor.executeEdits("", [{
      range: this.editor.getSelection(),
      text: null
    }]);
  }

  async selectAll() {
    if (!this.editor) return;
    const range = this.editor.getModel().getFullModelRange();
    this.editor.setSelection(range);
  }

  onUiResized() {}

}

/***/ }),

/***/ "./src/core/text/TextHistory.ts":
/*!**************************************!*\
  !*** ./src/core/text/TextHistory.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TextHistory)
/* harmony export */ });
/* harmony import */ var _file_History__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/History */ "./src/core/file/History.ts");

class TextHistory extends _file_History__WEBPACK_IMPORTED_MODULE_0__.default {
  get eventListening() {
    return ["textModified"];
  }

  async undoOf(editor, eventName, eventData) {
    if (eventName === "textModified") {
      const e = eventData;
      const {
        oldText
      } = e;

      if (editor.editor) {
        editor.editor.focus();

        if (!document.execCommand("undo")) {
          var _editor$editor$getMod;

          (_editor$editor$getMod = editor.editor.getModel()) === null || _editor$editor$getMod === void 0 ? void 0 : _editor$editor$getMod.undo();
        }

        editor.text = editor.editor.getValue();
        e.oldText = editor.text;
      } else {
        editor.text = oldText;
      }
    }
  }

  async redoOf(editor, eventName, eventData) {
    if (eventName === "textModified") {
      const e = eventData;
      const {
        text
      } = e;

      if (editor.editor) {
        editor.editor.focus();

        if (!document.execCommand("undo")) {
          var _editor$editor$getMod2;

          (_editor$editor$getMod2 = editor.editor.getModel()) === null || _editor$editor$getMod2 === void 0 ? void 0 : _editor$editor$getMod2.redo();
        }

        editor.text = editor.editor.getValue();
        e.text = editor.text;
      } else {
        editor.text = text;
      }
    }
  }

}

/***/ })

};
//# sourceMappingURL=006728419813a3d551d6.worklet.js.map