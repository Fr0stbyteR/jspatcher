"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["vendors-node_modules_react-monaco-editor_lib_index_js"],{

/***/ "./node_modules/react-monaco-editor/lib/diff.js":
/*!******************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/diff.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/react-monaco-editor/lib/utils.js");
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




function MonacoDiffEditor(_a) {
    var width = _a.width, height = _a.height, value = _a.value, defaultValue = _a.defaultValue, language = _a.language, theme = _a.theme, options = _a.options, overrideServices = _a.overrideServices, editorWillMount = _a.editorWillMount, editorDidMount = _a.editorDidMount, editorWillUnmount = _a.editorWillUnmount, onChange = _a.onChange, className = _a.className, original = _a.original;
    var containerElement = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var editor = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var _subscription = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var __prevent_trigger_change_event = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var fixedWidth = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processSize)(width);
    var fixedHeight = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processSize)(height);
    var style = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return ({
        width: fixedWidth,
        height: fixedHeight,
    }); }, [fixedWidth, fixedHeight]);
    var handleEditorWillMount = function () {
        var finalOptions = editorWillMount(monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
        return finalOptions || {};
    };
    var handleEditorDidMount = function () {
        editorDidMount(editor.current, monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
        var modified = editor.current.getModel().modified;
        _subscription.current = modified.onDidChangeContent(function (event) {
            if (!__prevent_trigger_change_event.current) {
                onChange(modified.getValue(), event);
            }
        });
    };
    var handleEditorWillUnmount = function () {
        editorWillUnmount(editor.current, monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
    };
    var initModels = function () {
        var finalValue = value != null ? value : defaultValue;
        var originalModel = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.createModel(original, language);
        var modifiedModel = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.createModel(finalValue, language);
        editor.current.setModel({
            original: originalModel,
            modified: modifiedModel,
        });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (containerElement.current) {
            // Before initializing monaco editor
            handleEditorWillMount();
            editor.current = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.createDiffEditor(containerElement.current, __assign(__assign(__assign({}, (className ? { extraEditorClassName: className } : {})), options), (theme ? { theme: theme } : {})), overrideServices);
            // After initializing monaco editor
            initModels();
            handleEditorDidMount();
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            editor.current.updateOptions(__assign(__assign({}, (className ? { extraEditorClassName: className } : {})), options));
        }
    }, [className, options]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            editor.current.layout();
        }
    }, [width, height]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            var _a = editor.current.getModel(), originalEditor = _a.original, modified = _a.modified;
            monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setModelLanguage(originalEditor, language);
            monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setModelLanguage(modified, language);
        }
    }, [language]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            var modified = editor.current.getModel().modified;
            __prevent_trigger_change_event.current = true;
            // modifiedEditor is not in the public API for diff editors
            editor.current.getModifiedEditor().pushUndoStop();
            // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
            // @ts-expect-error
            modified.pushEditOperations([], [
                {
                    range: modified.getFullModelRange(),
                    text: value,
                },
            ]);
            // modifiedEditor is not in the public API for diff editors
            editor.current.getModifiedEditor().pushUndoStop();
            __prevent_trigger_change_event.current = false;
        }
    }, [value]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setTheme(theme);
    }, [theme]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            var originalEditor = editor.current.getModel().original;
            if (original !== originalEditor.getValue()) {
                originalEditor.setValue(original);
            }
        }
    }, [original]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () { return function () {
        if (editor.current) {
            handleEditorWillUnmount();
            editor.current.dispose();
            var _a = editor.current.getModel(), originalEditor = _a.original, modified = _a.modified;
            if (originalEditor) {
                originalEditor.dispose();
            }
            if (modified) {
                modified.dispose();
            }
        }
        if (_subscription.current) {
            _subscription.current.dispose();
        }
    }; }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    return (react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { ref: containerElement, style: style, className: "react-monaco-editor-container" }));
}
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
    editorWillMount: _utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    editorDidMount: _utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    editorWillUnmount: _utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    onChange: _utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    className: null,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MonacoDiffEditor);
//# sourceMappingURL=diff.js.map

/***/ }),

/***/ "./node_modules/react-monaco-editor/lib/editor.js":
/*!********************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/editor.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/react-monaco-editor/lib/utils.js");
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




function MonacoEditor(_a) {
    var width = _a.width, height = _a.height, value = _a.value, defaultValue = _a.defaultValue, language = _a.language, theme = _a.theme, options = _a.options, overrideServices = _a.overrideServices, editorWillMount = _a.editorWillMount, editorDidMount = _a.editorDidMount, editorWillUnmount = _a.editorWillUnmount, onChange = _a.onChange, className = _a.className;
    var containerElement = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var editor = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var _subscription = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var __prevent_trigger_change_event = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var fixedWidth = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processSize)(width);
    var fixedHeight = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.processSize)(height);
    var style = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return ({
        width: fixedWidth,
        height: fixedHeight,
    }); }, [fixedWidth, fixedHeight]);
    var handleEditorWillMount = function () {
        var finalOptions = editorWillMount(monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
        return finalOptions || {};
    };
    var handleEditorDidMount = function () {
        editorDidMount(editor.current, monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
        _subscription.current = editor.current.onDidChangeModelContent(function (event) {
            if (!__prevent_trigger_change_event.current) {
                onChange(editor.current.getValue(), event);
            }
        });
    };
    var handleEditorWillUnmount = function () {
        editorWillUnmount(editor.current, monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__);
    };
    var initMonaco = function () {
        var finalValue = value !== null ? value : defaultValue;
        if (containerElement.current) {
            // Before initializing monaco editor
            var finalOptions = __assign(__assign({}, options), handleEditorWillMount());
            editor.current = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.create(containerElement.current, __assign(__assign(__assign({ value: finalValue, language: language }, (className ? { extraEditorClassName: className } : {})), finalOptions), (theme ? { theme: theme } : {})), overrideServices);
            // After initializing monaco editor
            handleEditorDidMount();
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(initMonaco, []);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            var model = editor.current.getModel();
            __prevent_trigger_change_event.current = true;
            editor.current.pushUndoStop();
            // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
            model.pushEditOperations([], [
                {
                    range: model.getFullModelRange(),
                    text: value,
                },
            ], undefined);
            editor.current.pushUndoStop();
            __prevent_trigger_change_event.current = false;
        }
    }, [value]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            var model = editor.current.getModel();
            monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setModelLanguage(model, language);
        }
    }, [language]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            // Don't pass in the model on update because monaco crashes if we pass the model
            // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
            var _model = options.model, optionsWithoutModel = __rest(options, ["model"]);
            editor.current.updateOptions(__assign(__assign({}, (className ? { extraEditorClassName: className } : {})), optionsWithoutModel));
        }
    }, [className, options]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (editor.current) {
            editor.current.layout();
        }
    }, [width, height]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.setTheme(theme);
    }, [theme]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () { return function () {
        if (editor.current) {
            handleEditorWillUnmount();
            editor.current.dispose();
            var model = editor.current.getModel();
            if (model) {
                model.dispose();
            }
        }
        if (_subscription.current) {
            _subscription.current.dispose();
        }
    }; }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    return (react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { ref: containerElement, style: style, className: "react-monaco-editor-container" }));
}
MonacoEditor.defaultProps = {
    width: "100%",
    height: "100%",
    value: null,
    defaultValue: "",
    language: "javascript",
    theme: null,
    options: {},
    overrideServices: {},
    editorWillMount: _utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    editorDidMount: _utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    editorWillUnmount: _utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    onChange: _utils__WEBPACK_IMPORTED_MODULE_2__.noop,
    className: null,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MonacoEditor);
//# sourceMappingURL=editor.js.map

/***/ }),

/***/ "./node_modules/react-monaco-editor/lib/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MonacoDiffEditor: () => (/* reexport safe */ _diff__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "default": () => (/* reexport safe */ _editor__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   monaco: () => (/* reexport module object */ monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./diff */ "./node_modules/react-monaco-editor/lib/diff.js");
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor */ "./node_modules/react-monaco-editor/lib/editor.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types */ "./node_modules/react-monaco-editor/lib/types.js");




// eslint-disable-next-line no-restricted-exports

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/react-monaco-editor/lib/types.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/types.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/react-monaco-editor/lib/utils.js":
/*!*******************************************************!*\
  !*** ./node_modules/react-monaco-editor/lib/utils.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   noop: () => (/* binding */ noop),
/* harmony export */   processSize: () => (/* binding */ processSize)
/* harmony export */ });
function processSize(size) {
    return !/^\d+$/.test(size) ? size : "".concat(size, "px");
}
function noop() { }
//# sourceMappingURL=utils.js.map

/***/ })

}]);
//# sourceMappingURL=34799dc78b11a16ba5a3.js.map