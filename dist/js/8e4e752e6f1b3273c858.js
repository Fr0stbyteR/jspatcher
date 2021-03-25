(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_misc_monaco-faust_FaustLang_ts"],{

/***/ "./src/misc/monaco-faust/Faust2Doc.ts":
/*!********************************************!*\
  !*** ./src/misc/monaco-faust/Faust2Doc.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Faust2Doc": () => /* binding */ Faust2Doc
/* harmony export */ });
/* harmony import */ var _Faust2MD__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Faust2MD */ "./src/misc/monaco-faust/Faust2MD.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-await-in-loop */

/*
Retrive faust2md doc by parsing .dsp file

The format of a title is :
    //############# Title Name #################
    //  markdown text....
    //  markdown text....
    //##########################################

The format of a section is :
    //============== Section Name ==============
    //  markdown text....
    //  markdown text....
    //==========================================

The format of a comment is :
    //-------------- foo(x,y) ------------------
    //  markdown text....
    //  markdown text....
    //------------------------------------------
everything else is considered Faust code.
--------------------------------------------------------
*/

/**
 *
 * @class Faust2Doc
 */
class Faust2Doc {
  /**
   * Retrieve a library definition
   *
   * @static
   * @param {string} line
   * @returns {{ namespace: string, fileName: string }[]}
   * @memberof Faust2Doc
   */
  static matchLibrary(line) {
    const libs = [];
    const exps = line.match(new RegExp(this.REGEX_DEF_LIB, "g"));

    if (exps) {
      exps.forEach(exp => {
        const matched = exp.match(this.REGEX_DEF_LIB);
        if (matched) libs.push({
          namespace: matched[1],
          fileName: matched[2]
        });
      });
    }

    return libs;
  }
  /**
   * Retrieve an import expression
   *
   * @static
   * @param {string} line
   * @returns {string[]}
   * @memberof Faust2Doc
   */


  static matchImport(line) {
    const imps = [];
    const exps = line.match(new RegExp(this.REGEX_DEF_IMP, "g"));

    if (exps) {
      exps.forEach(exp => {
        const matched = exp.match(this.REGEX_DEF_IMP);
        if (matched) imps.push(matched[1]);
      });
    }

    return imps;
  }
  /**
   * Retrieve true function name from string in comments
   * `(si.)bus`
   *
   * @static
   * @param {string} str
   * @returns {string}
   * @memberof Faust2MD
   */


  static matchFuncName(str) {
    const matched = str.match(this.REGEX_FUNC_NAME);
    return matched ? matched[1] : null;
  }
  /**
   * Get all conditions in func name like `[third|half]_octave_[analyzer|filterbank][n]`
   *
   * @static
   * @param {string} str
   * @returns {string[]}
   * @memberof Faust2Doc
   */


  static getAllConditions(str) {
    return this.getCondition([str]);
  }
  /**
   * getAllConditions Recursive body
   *
   * @static
   * @param {string[]} [condsIn]
   * @param {RegExp} [regexp]
   * @returns {string[]}
   * @memberof Faust2Doc
   */


  static getCondition(condsIn) {
    const conds = [];
    condsIn.forEach(cond => {
      const regexp = new RegExp(this.REGEX_FUNC_NAME_COND, "g");
      const result = regexp.exec(cond);
      if (!result) return;
      const found = result[0];
      const index = result.index;
      const subConds = result.splice(1).filter(el => typeof el === "string").map(str => str.replace(/^\|/, ""));
      const before = cond.substring(0, index);
      const after = cond.substring(index + found.length);

      if (subConds.length === 1) {
        conds.push(before + after);
        conds.push(before + subConds + after);
      } else {
        subConds.forEach(subCond => conds.push(before + subCond + after));
      }
    });
    return conds.length ? this.getCondition(conds) : condsIn;
  }
  /**
   * Process the file
   *
   * @static
   * @param {string} fileName fileName to be fetch using getFile
   * @param {string} getFile callback used for import and library expressions
   * @param {string[]} [depthIn] current Depth, stop when 0;
   * @param {string[]} [pathIn] path of current namespace
   * @param {string} [docIn] recursive accum object for output
   * @returns {Promise<TFaustDocs>}
   * @memberof Faust2MD
   */


  static async parse(fileName, getFile, depthIn, pathIn, docIn) {
    if (depthIn === 0) return docIn;
    const depth = depthIn || 2;
    const strIn = await getFile(fileName);
    const doc = docIn || {};
    const path = pathIn || [];
    let inComment = false; // false: in code; true: in md-comment

    let idt = 0; // indentation retained to outdent comment lines

    let curName = ""; // current function name

    let strBuffer = ""; // current function doc

    const lines = strIn.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!_Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.isComment(line)) {
        if (inComment) inComment = false; // we are closing a md-comment

        const libs = this.matchLibrary(line);
        const imps = this.matchImport(line);

        for (let j = 0; j < libs.length; j++) {
          const lib = libs[j];
          await this.parse(lib.fileName, getFile, depth - 1, [...path, lib.namespace], doc);
        }

        for (let j = 0; j < imps.length; j++) {
          const imp = imps[j];
          await this.parse(imp, getFile, depth - 1, path, doc);
        }

        continue;
      }

      if (inComment) {
        // we are in a md-comment (not first line)
        if (idt === 0) idt = _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.indentation(line); // we have to measure the indentation
        // check end of md-comment

        const {
          endC,
          endS,
          endT
        } = {
          endC: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchEndComment(line),
          endS: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchEndSection(line),
          endT: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchEndTitle(line)
        };
        if (endC || endS || endT) inComment = false; // end of md-comment switch back to mode O
        else strBuffer += _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.outdent(line, idt) + "\n";

        if (endC) {
          // pop buffer
          if (curName) this.getAllConditions(curName).forEach(name => doc[path.concat(name).join(".")] = {
            name: curName,
            path: [...path],
            doc: strBuffer
          });
          curName = "";
          strBuffer = "";
        }

        continue;
      } // check begin of md-comment


      const {
        c,
        s,
        t
      } = {
        c: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchBeginComment(line),
        s: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchBeginSection(line),
        t: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchBeginTitle(line)
      };
      if (c) curName = this.matchFuncName(c);

      if (c || s || t) {
        inComment = true;
        idt = 0;
        strBuffer = "";
      }
    }

    return doc;
  }

}

_defineProperty(Faust2Doc, "REGEX_DEF_LIB", /\b(\w+)\s*=\s*library\("(.+)"\);/);

_defineProperty(Faust2Doc, "REGEX_DEF_IMP", /\bimport\("(.+)"\);/);

_defineProperty(Faust2Doc, "REGEX_FUNC_NAME", /`.*?([\w[\]|]+)`/);

_defineProperty(Faust2Doc, "REGEX_FUNC_NAME_COND", /\[(.+?)(\|.+?)*?]/);

/***/ }),

/***/ "./src/misc/monaco-faust/Faust2MD.ts":
/*!*******************************************!*\
  !*** ./src/misc/monaco-faust/Faust2MD.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Faust2MD": () => /* binding */ Faust2MD
/* harmony export */ });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*

Ultra simple automatic documentation system for Faust.
Creates a markdown file by extracting the comments from
a Faust file. The option -t n can be used to change the
default (4) tab setting. The option -c can be used to
include the Faust code itself into the generated doc.
And the option -f can be used to include a YAML front
matter with the name of the file and the date.

The format of a title is :
    //############# Title Name #################
    //  markdown text....
    //  markdown text....
    //##########################################

The format of a section is :
    //============== Section Name ==============
    //  markdown text....
    //  markdown text....
    //==========================================

The format of a comment is :
    //-------------- foo(x,y) ------------------
    //  markdown text....
    //  markdown text....
    //------------------------------------------
everything else is considered Faust code.
The translation is the following:
  ## foo(x,y)
    markdown text....
    markdown text....
--------------------------------------------------------
*/

/**
 * faust2md ts port
 *
 * @class Faust2MD
 */
class Faust2MD {
  /**
   * Print the front matter of the file
   *
   * @static
   * @param {string} fileName
   * @returns {string}
   * @memberof Faust2MD
   */
  static frontMatter(fileName) {
    return "---\n" + "file: ".concat(fileName, "\n") + "date: ".concat(new Date().toLocaleDateString(), "\n") + "---\n";
  }
  /**
   * Outdent a comment line by n characters in
   * order to remove the prefix "//   "
   *
   * @static
   * @param {string} line
   * @param {number} idt
   * @returns {string}
   * @memberof Faust2MD
   */


  static outdent(line, idt) {
    return line.length <= idt ? "\n" : line.substr(idt);
  }
  /**
   * Match the first line of a title
   * of type "//#### Title ####"
   * at least 3 # are needed
   *
   * @static
   * @param {string} line
   * @returns {string}
   * @memberof Faust2MD
   */


  static matchBeginTitle(line) {
    const matched = line.match(this.REGEX_BEG_TITLE);
    return matched ? matched[1] : null;
  }
  /**
   * Match the last line of a title
   * of type "//########"
   * or a blank line
   *
   * @static
   * @param {string} line
   * @returns {boolean}
   * @memberof Faust2MD
   */


  static matchEndTitle(line) {
    const matched = line.match(this.REGEX_END_TITLE);
    return !!matched;
  }
  /**
   * Match the first line of a section
   * of type "//==== Section ===="
   * at least 3 = are needed
   *
   * @static
   * @param {string} line
   * @returns {string}
   * @memberof Faust2MD
   */


  static matchBeginSection(line) {
    const matched = line.match(this.REGEX_BEG_SECTION);
    return matched ? matched[1] : null;
  }
  /**
   * Match the last line of a section
   * of type "//======="
   * or a blank line
   *
   * @static
   * @param {string} line
   * @returns {boolean}
   * @memberof Faust2MD
   */


  static matchEndSection(line) {
    const matched = line.match(this.REGEX_END_SECTION);
    return !!matched;
  }
  /**
   * Match the first line of a comment
   * of type "//--- foo(x,y) ----"
   * at least 3 - are needed
   *
   * @static
   * @param {string} line
   * @returns {string}
   * @memberof Faust2MD
   */


  static matchBeginComment(line) {
    const matched = line.match(this.REGEX_BEG_COMMENT);
    return matched ? matched[1] : null;
  }
  /**
   * Match the last line of a comment
   * of type "//-----------------"
   * or a blank line
   *
   * @static
   * @param {string} line
   * @returns {boolean}
   * @memberof Faust2MD
   */


  static matchEndComment(line) {
    const matched = line.match(this.REGEX_END_COMMENT);
    return !!matched;
  }
  /**
   * Measure the indentation of a md-comment line
   * that is the len of the prefix '//   '
   *
   * @static
   * @param {string} line
   * @returns {number}
   * @memberof Faust2MD
   */


  static indentation(line) {
    const matched = line.match(this.REGEX_INDENT);
    return matched ? matched[1].length : 0;
  }
  /**
   * Indicates if a line is a comment
   *
   * @static
   * @param {string} line
   * @returns {boolean}
   * @memberof Faust2MD
   */


  static isComment(line) {
    const matched = line.match(this.REGEX_COMMENT);
    return !!matched;
  }
  /**
   * Process the file
   *
   * @static
   * @param {string} strIn
   * @param {string} [fileName]
   * @param {{ tabsize?: number, code?: boolean, front?: boolean }} [optionsIn]
   * @returns {string}
   * @memberof Faust2MD
   */


  static parse(strIn, fileName, optionsIn) {
    const options = _objectSpread({
      tabsize: 4,
      code: false,
      front: false
    }, optionsIn);

    let strOut = "";
    let inComment = false; // false: in code; true: in md-comment

    let idt = 0; // indentation retained to outdent comment lines

    if (options.front && fileName) strOut += this.frontMatter(fileName);
    strIn.split("\n").forEach(line => {
      if (!this.isComment(line)) {
        if (inComment) {
          // we are closing a md-comment
          strOut += "\n";
          inComment = false;
        }

        if (options.code) strOut += "\t".concat(line, "\n");
        return;
      }

      if (inComment) {
        // we are in a md-comment
        if (idt === 0) idt = this.indentation(line); // we have to measure the indentation
        // check end of md-comment

        const {
          endC,
          endS,
          endT
        } = {
          endC: this.matchEndComment(line),
          endS: this.matchEndSection(line),
          endT: this.matchEndTitle(line)
        };
        if (endC) strOut += "\n---\n\n";
        if (endC || endS || endT) inComment = false; // end of md-comment switch back to mode O
        else strOut += this.outdent(line, idt) + "\n";
        return;
      } // check begin of md-comment


      const {
        c,
        s,
        t
      } = {
        c: this.matchBeginComment(line),
        s: this.matchBeginSection(line),
        t: this.matchBeginTitle(line)
      };
      if (c) strOut += "\n### ".concat(c, "\n");else if (s) strOut += "\n## ".concat(s, "\n");else if (t) strOut += "\n# ".concat(t, "\n");

      if (c || s || t) {
        inComment = true;
        idt = 0;
      } else if (options.code) strOut += "\t".concat(line, "\n");
    });
    return strOut;
  }

}

_defineProperty(Faust2MD, "REGEX_BEG_TITLE", /^\s*\/\/#{3,}\s*([^#]*[^#\s])\s*#{3,}$/);

_defineProperty(Faust2MD, "REGEX_END_TITLE", /^\s*((\/\/#{3,})|(\s*))$/);

_defineProperty(Faust2MD, "REGEX_BEG_SECTION", /^\s*\/\/={3,}\s*([^=]*[^=\s])\s*={3,}$/);

_defineProperty(Faust2MD, "REGEX_END_SECTION", /^\s*((\/\/={3,})|(\s*))$/);

_defineProperty(Faust2MD, "REGEX_BEG_COMMENT", /^\s*\/\/-{3,}\s*([^-]*[^=\s])\s*-{3,}$/);

_defineProperty(Faust2MD, "REGEX_END_COMMENT", /^\s*((\/\/-{3,})|(\s*))$/);

_defineProperty(Faust2MD, "REGEX_INDENT", /(^\s*\/\/\s*)[^\s]/);

_defineProperty(Faust2MD, "REGEX_COMMENT", /^\s*\/\//);

/***/ }),

/***/ "./src/misc/monaco-faust/FaustLang.ts":
/*!********************************************!*\
  !*** ./src/misc/monaco-faust/FaustLang.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "language": () => /* binding */ language,
/* harmony export */   "config": () => /* binding */ config,
/* harmony export */   "theme": () => /* binding */ theme,
/* harmony export */   "matchDocKey": () => /* binding */ matchDocKey,
/* harmony export */   "getProviders": () => /* binding */ getProviders
/* harmony export */ });
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "./node_modules/monaco-editor/esm/vs/editor/editor.api.js?01bf");
/* harmony import */ var _Faust2Doc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Faust2Doc */ "./src/misc/monaco-faust/Faust2Doc.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const language = {
  id: "faust",
  extensions: ["dsp", "lib"],
  mimetypes: ["application/faust"]
};
const config = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
  autoClosingPairs: [{
    open: "{",
    close: "}"
  }, {
    open: "[",
    close: "]"
  }, {
    open: "(",
    close: ")"
  }, {
    open: '"',
    close: '"',
    notIn: ["string"]
  }, {
    open: "/*",
    close: "*/",
    notIn: ["string"]
  }]
};
const theme = {
  base: "vs-dark",
  inherit: true,
  rules: [{
    token: "faustFunctions",
    foreground: "DDDD99"
  }, {
    token: "faustKeywords",
    foreground: "4499CC"
  }, {
    token: "faustLib",
    foreground: "CCCCBB"
  }, {
    token: "faustCompOperators",
    foreground: "FFDDFF"
  }, {
    token: "identifier",
    foreground: "77CCFF"
  }],
  colors: null
};
const faustKeywords = ["import", "component", "declare", "library", "environment", "int", "float", "letrec", "with", "class", "process", "effect", "inputs", "outputs"];
const faustFunctions = ["mem", "prefix", "rdtable", "rwtable", "select2", "select3", "ffunction", "fconstant", "fvariable", "button", "checkbox", "vslider", "hslider", "nentry", "vgroup", "hgroup", "tgroup", "vbargraph", "hbargraph", "attach", "acos", "asin", "atan", "atan2", "cos", "sin", "tan", "exp", "log", "log10", "pow", "sqrt", "abs", "min", "max", "fmod", "remainder", "floor", "ceil", "rint", "seq", "par", "sum", "prod"];

const getFile = async (fileName, faust) => {
  if (faust) return faust.fs.readFile("libraries/" + fileName, {
    encoding: "utf8"
  });
  const libPath = "https://faust.grame.fr/tools/editor/libraries/";
  const res = await fetch(libPath + fileName);
  return res.text();
};

/**
 * Match an available doc key from monaco editor
 *
 * @param {TFaustDocs} doc
 * @param {editor.ITextModel} model
 * @param {Position} position
 * @returns {TMatchedFaustDoc} full: [...prefixes, name], range: a monaco range object, doc: a FaustDoc object
 */
const matchDocKey = (doc, model, position) => {
  const line$ = position.lineNumber;
  const line = model.getLineContent(line$);
  const wordAtPosition = model.getWordAtPosition(position);
  if (!wordAtPosition) return null;
  let column$ = wordAtPosition.startColumn - 1;
  const name = wordAtPosition.word;
  const prefixes = [];

  while (column$ - 2 >= 0 && line[column$ - 1] === ".") {
    column$ -= 2;
    const prefixWord = model.getWordAtPosition(new monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.Position(line$, column$));
    prefixes.splice(0, 0, prefixWord.word);
    column$ = prefixWord.startColumn - 1;
  }

  const nameArray = [...prefixes, name];

  while (nameArray.length) {
    const name = nameArray.join(".");
    const e = doc[name];

    if (e) {
      return {
        nameArray,
        name,
        range: new monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.Range(line$, column$ + 1, line$, wordAtPosition.endColumn),
        doc: e
      };
    }

    column$ += nameArray.splice(0, 1)[0].length + 1;
  }

  return null;
};
const getProviders = async faust => {
  let libDocs = {};
  let primDocs = {};

  try {
    libDocs = await _Faust2Doc__WEBPACK_IMPORTED_MODULE_1__.Faust2Doc.parse("stdfaust.lib", async fileName => getFile(fileName, faust));
    primDocs = await _Faust2Doc__WEBPACK_IMPORTED_MODULE_1__.Faust2Doc.parse("primitives.lib", async fileName => getFile(fileName, faust));
  } catch (e) {
    console.error(e);
  } // eslint-disable-line no-empty, no-console


  const faustLib = Object.keys(libDocs);

  const allDocs = _objectSpread(_objectSpread({}, primDocs), libDocs);

  const hoverProvider = {
    provideHover: (model, position) => {
      const matched = matchDocKey(allDocs, model, position);

      if (matched) {
        const prefix = matched.nameArray.slice();
        const name = prefix.pop();
        const doc = matched.doc;
        return {
          range: matched.range,
          contents: [{
            value: "```\n".concat(prefix.length ? "(" + prefix.join(".") + ".)" : "").concat(name, "\n```")
          }, {
            value: doc.doc.replace(/#+/g, "######")
          }, {
            value: prefix.length ? "[Detail...](https://faust.grame.fr/doc/libraries/#".concat(prefix.join(".") + ".").concat(doc.name.replace(/[[\]|]/g, "").toLowerCase(), ")") : "[Detail...](https://faust.grame.fr/doc/manual/index.html#faust-syntax)"
          }]
        };
      }

      return null;
    }
  };
  const tokensProvider = {
    faustKeywords,
    faustFunctions,
    faustLib,
    defaultToken: "invalid",
    tokenPostfix: ".dsp",
    faustCompOperators: ["~", ",", ":", "<:", ":>"],
    operators: ["=", "+", "-", "*", "/", "%", "^", "&", "|", "xor", "<<", ">>", ">", "<", "==", "<=", ">=", "!=", "@", "'"],
    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*/^%]+/,
    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
      root: [// identifiers and keywords
      [/!|_/, "keyword"], [/[a-z_$]([\w.$]*[\w$])?/, {
        cases: {
          "@faustFunctions": "faustFunctions",
          "@faustKeywords": "faustKeywords",
          "@faustLib": "faustLib",
          "@default": "identifier"
        }
      }], [/[A-Z][\w$]*/, "type.identifier"], // whitespace
      {
        include: "@whitespace"
      }, // delimiters and operators
      [/[{}()[\]]/, "@brackets"], [/~|,|<:|:>|:/, "faustCompOperators"], [/[<>](?!@symbols)/, "@brackets"], [/=|\+|-|\*|\/|%|\^|&|\||xor|<<|>>|>|<|==|<=|>=|!=|@|'/, {
        cases: {
          "@operators": "operators",
          "@default": ""
        }
      }], // numbers
      [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"], [/0[xX][0-9a-fA-F]+/, "number.hex"], [/\d+/, "number"], // delimiter: after number because of .\d floats
      [/[;.]/, "delimiter"], // strings
      [/"/, {
        token: "string",
        next: "@string"
      }]],
      comment: [[/[^/*]+/, "comment"], [/\/\*/, "comment", "@push"], [/\*\//, "comment", "@pop"], [/[/*]/, "comment"]],
      string: [[/[^\\"$]+/, "string"], [/@escapes/, "string.escape"], [/\\./, "string.escape.invalid"], [/"/, "string", "@pop"]],
      whitespace: [[/[ \t\r\n]+/, "white"], [/\/\*/, "comment", "@comment"], [/\/\/.*$/, "comment"]]
    }
  };
  const completionItemProvider = {
    provideCompletionItems: () => {
      const suggestions = [];
      [...faustKeywords, ...faustFunctions, ...faustLib].forEach(e => {
        suggestions.push({
          label: e,
          kind: monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.languages.CompletionItemKind.Text,
          insertText: e,
          range: null
        });
      });
      return {
        suggestions
      };
    }
  };
  return {
    hoverProvider,
    tokensProvider,
    completionItemProvider,
    docs: libDocs
  };
};

/***/ })

}]);
//# sourceMappingURL=8e4e752e6f1b3273c858.js.map