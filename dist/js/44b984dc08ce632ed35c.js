(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["vendors-node_modules_react-monaco-editor_lib_index_js"],{

/***/ "./node_modules/react-monaco-editor/lib/diff.js":
/*!******************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/diff.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./node_modules/react-monaco-editor/lib/utils.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};




var MonacoDiffEditor = /** @class */ (function (_super) {
    __extends(MonacoDiffEditor, _super);
    function MonacoDiffEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.assignRef = function (component) {
            _this.containerElement = component;
        };
        _this.containerElement = undefined;
        return _this;
    }
    MonacoDiffEditor.prototype.componentDidMount = function () {
        this.initMonaco();
    };
    MonacoDiffEditor.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, language = _a.language, theme = _a.theme, height = _a.height, options = _a.options, width = _a.width, className = _a.className;
        var _b = this.editor.getModel(), original = _b.original, modified = _b.modified;
        if (this.props.original !== original.getValue()) {
            original.setValue(this.props.original);
        }
        if (this.props.value != null && this.props.value !== modified.getValue()) {
            this.__prevent_trigger_change_event = true;
            // modifiedEditor is not in the public API for diff editors
            this.editor.getModifiedEditor().pushUndoStop();
            // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
            // @ts-expect-error
            modified.pushEditOperations([], [
                {
                    range: modified.getFullModelRange(),
                    text: this.props.value,
                },
            ]);
            // modifiedEditor is not in the public API for diff editors
            this.editor.getModifiedEditor().pushUndoStop();
            this.__prevent_trigger_change_event = false;
        }
        if (prevProps.language !== language) {
            monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setModelLanguage(original, language);
            monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setModelLanguage(modified, language);
        }
        if (prevProps.theme !== theme) {
            monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setTheme(theme);
        }
        if (this.editor &&
            (width !== prevProps.width || height !== prevProps.height)) {
            this.editor.layout();
        }
        if (prevProps.options !== options) {
            this.editor.updateOptions(__assign(__assign({}, (className ? { extraEditorClassName: className } : {})), options));
        }
    };
    MonacoDiffEditor.prototype.componentWillUnmount = function () {
        this.destroyMonaco();
    };
    MonacoDiffEditor.prototype.editorWillMount = function () {
        var editorWillMount = this.props.editorWillMount;
        var options = editorWillMount(monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
        return options || {};
    };
    MonacoDiffEditor.prototype.editorDidMount = function (editor) {
        var _this = this;
        this.props.editorDidMount(editor, monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
        var modified = editor.getModel().modified;
        this._subscription = modified.onDidChangeContent(function (event) {
            if (!_this.__prevent_trigger_change_event) {
                _this.props.onChange(modified.getValue(), event);
            }
        });
    };
    MonacoDiffEditor.prototype.initModels = function (value, original) {
        var language = this.props.language;
        var originalModel = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.createModel(original, language);
        var modifiedModel = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.createModel(value, language);
        this.editor.setModel({
            original: originalModel,
            modified: modifiedModel,
        });
    };
    MonacoDiffEditor.prototype.initMonaco = function () {
        var value = this.props.value != null ? this.props.value : this.props.defaultValue;
        var _a = this.props, original = _a.original, theme = _a.theme, options = _a.options, overrideServices = _a.overrideServices, className = _a.className;
        if (this.containerElement) {
            // Before initializing monaco editor
            this.editorWillMount();
            this.editor = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.createDiffEditor(this.containerElement, __assign(__assign(__assign({}, (className ? { extraEditorClassName: className } : {})), options), (theme ? { theme: theme } : {})), overrideServices);
            // After initializing monaco editor
            this.initModels(value, original);
            this.editorDidMount(this.editor);
        }
    };
    MonacoDiffEditor.prototype.destroyMonaco = function () {
        if (this.editor) {
            this.editor.dispose();
            var _a = this.editor.getModel(), original = _a.original, modified = _a.modified;
            if (original) {
                original.dispose();
            }
            if (modified) {
                modified.dispose();
            }
        }
        if (this._subscription) {
            this._subscription.dispose();
        }
    };
    MonacoDiffEditor.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height;
        var fixedWidth = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.processSize)(width);
        var fixedHeight = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.processSize)(height);
        var style = {
            width: fixedWidth,
            height: fixedHeight,
        };
        return (react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", { ref: this.assignRef, style: style, className: "react-monaco-editor-container" }));
    };
    MonacoDiffEditor.propTypes = {
        width: prop_types__WEBPACK_IMPORTED_MODULE_1__.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1__.string, prop_types__WEBPACK_IMPORTED_MODULE_1__.number]),
        height: prop_types__WEBPACK_IMPORTED_MODULE_1__.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1__.string, prop_types__WEBPACK_IMPORTED_MODULE_1__.number]),
        original: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        value: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        defaultValue: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        language: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        theme: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        options: prop_types__WEBPACK_IMPORTED_MODULE_1__.object,
        overrideServices: prop_types__WEBPACK_IMPORTED_MODULE_1__.object,
        editorDidMount: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
        editorWillMount: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
        onChange: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
        className: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
    };
    MonacoDiffEditor.defaultProps = {
        width: "100%",
        height: "100%",
        original: null,
        value: null,
        defaultValue: "",
        language: "javascript",
        theme: null,
        options: {},
        overrideServices: {},
        editorDidMount: _utils__WEBPACK_IMPORTED_MODULE_3__.noop,
        editorWillMount: _utils__WEBPACK_IMPORTED_MODULE_3__.noop,
        onChange: _utils__WEBPACK_IMPORTED_MODULE_3__.noop,
        className: null,
    };
    return MonacoDiffEditor;
}(react__WEBPACK_IMPORTED_MODULE_2__.Component));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MonacoDiffEditor);
//# sourceMappingURL=diff.js.map

/***/ }),

/***/ "./node_modules/react-monaco-editor/lib/editor.js":
/*!********************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/editor.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./node_modules/react-monaco-editor/lib/utils.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};




var MonacoEditor = /** @class */ (function (_super) {
    __extends(MonacoEditor, _super);
    function MonacoEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.assignRef = function (component) {
            _this.containerElement = component;
        };
        _this.containerElement = undefined;
        return _this;
    }
    MonacoEditor.prototype.componentDidMount = function () {
        this.initMonaco();
    };
    MonacoEditor.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, value = _a.value, language = _a.language, theme = _a.theme, height = _a.height, options = _a.options, width = _a.width, className = _a.className;
        var editor = this.editor;
        var model = editor.getModel();
        if (this.props.value != null && this.props.value !== model.getValue()) {
            this.__prevent_trigger_change_event = true;
            this.editor.pushUndoStop();
            // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
            // @ts-expect-error
            model.pushEditOperations([], [
                {
                    range: model.getFullModelRange(),
                    text: value,
                },
            ]);
            this.editor.pushUndoStop();
            this.__prevent_trigger_change_event = false;
        }
        if (prevProps.language !== language) {
            monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setModelLanguage(model, language);
        }
        if (prevProps.theme !== theme) {
            monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setTheme(theme);
        }
        if (editor && (width !== prevProps.width || height !== prevProps.height)) {
            editor.layout();
        }
        if (prevProps.options !== options) {
            // Don't pass in the model on update because monaco crashes if we pass the model
            // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
            var _model = options.model, optionsWithoutModel = __rest(options, ["model"]);
            editor.updateOptions(__assign(__assign({}, (className ? { extraEditorClassName: className } : {})), optionsWithoutModel));
        }
    };
    MonacoEditor.prototype.componentWillUnmount = function () {
        this.destroyMonaco();
    };
    MonacoEditor.prototype.destroyMonaco = function () {
        if (this.editor) {
            this.editor.dispose();
            var model = this.editor.getModel();
            if (model) {
                model.dispose();
            }
        }
        if (this._subscription) {
            this._subscription.dispose();
        }
    };
    MonacoEditor.prototype.initMonaco = function () {
        var value = this.props.value != null ? this.props.value : this.props.defaultValue;
        var _a = this.props, language = _a.language, theme = _a.theme, overrideServices = _a.overrideServices, className = _a.className;
        if (this.containerElement) {
            // Before initializing monaco editor
            var options = __assign(__assign({}, this.props.options), this.editorWillMount());
            this.editor = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.create(this.containerElement, __assign(__assign(__assign({ value: value,
                language: language }, (className ? { extraEditorClassName: className } : {})), options), (theme ? { theme: theme } : {})), overrideServices);
            // After initializing monaco editor
            this.editorDidMount(this.editor);
        }
    };
    MonacoEditor.prototype.editorWillMount = function () {
        var editorWillMount = this.props.editorWillMount;
        var options = editorWillMount(monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
        return options || {};
    };
    MonacoEditor.prototype.editorDidMount = function (editor) {
        var _this = this;
        this.props.editorDidMount(editor, monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
        this._subscription = editor.onDidChangeModelContent(function (event) {
            if (!_this.__prevent_trigger_change_event) {
                _this.props.onChange(editor.getValue(), event);
            }
        });
    };
    MonacoEditor.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height;
        var fixedWidth = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.processSize)(width);
        var fixedHeight = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.processSize)(height);
        var style = {
            width: fixedWidth,
            height: fixedHeight,
        };
        return (react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", { ref: this.assignRef, style: style, className: "react-monaco-editor-container" }));
    };
    MonacoEditor.propTypes = {
        width: prop_types__WEBPACK_IMPORTED_MODULE_1__.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1__.string, prop_types__WEBPACK_IMPORTED_MODULE_1__.number]),
        height: prop_types__WEBPACK_IMPORTED_MODULE_1__.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1__.string, prop_types__WEBPACK_IMPORTED_MODULE_1__.number]),
        value: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        defaultValue: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        language: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        theme: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
        options: prop_types__WEBPACK_IMPORTED_MODULE_1__.object,
        overrideServices: prop_types__WEBPACK_IMPORTED_MODULE_1__.object,
        editorDidMount: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
        editorWillMount: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
        onChange: prop_types__WEBPACK_IMPORTED_MODULE_1__.func,
        className: prop_types__WEBPACK_IMPORTED_MODULE_1__.string,
    };
    MonacoEditor.defaultProps = {
        width: "100%",
        height: "100%",
        value: null,
        defaultValue: "",
        language: "javascript",
        theme: null,
        options: {},
        overrideServices: {},
        editorDidMount: _utils__WEBPACK_IMPORTED_MODULE_3__.noop,
        editorWillMount: _utils__WEBPACK_IMPORTED_MODULE_3__.noop,
        onChange: _utils__WEBPACK_IMPORTED_MODULE_3__.noop,
        className: null,
    };
    return MonacoEditor;
}(react__WEBPACK_IMPORTED_MODULE_2__.Component));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MonacoEditor);
//# sourceMappingURL=editor.js.map

/***/ }),

/***/ "./node_modules/react-monaco-editor/lib/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _editor__WEBPACK_IMPORTED_MODULE_2__.default),
/* harmony export */   "MonacoDiffEditor": () => (/* reexport safe */ _diff__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "monaco": () => (/* reexport module object */ monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./diff */ "./node_modules/react-monaco-editor/lib/diff.js");
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor */ "./node_modules/react-monaco-editor/lib/editor.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types */ "./node_modules/react-monaco-editor/lib/types.js");





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/react-monaco-editor/lib/types.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/types.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/react-monaco-editor/lib/utils.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/utils.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "processSize": () => (/* binding */ processSize),
/* harmony export */   "noop": () => (/* binding */ noop)
/* harmony export */ });
function processSize(size) {
    return !/^\d+$/.test(size) ? size : size + "px";
}
function noop() { }
//# sourceMappingURL=utils.js.map

/***/ })

}]);
//# sourceMappingURL=44b984dc08ce632ed35c.js.map