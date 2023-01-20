"use strict";
(self["webpackChunkJSPatcher"] = self["webpackChunkJSPatcher"] || []).push([["src_misc_monaco-faust_FaustLang_ts-data_image_png_base64_iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYA-9f175e"],{

/***/ "./src/misc/monaco-faust/Faust2Doc.ts":
/*!********************************************!*\
  !*** ./src/misc/monaco-faust/Faust2Doc.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Faust2Doc": () => (/* binding */ Faust2Doc)
/* harmony export */ });
/* harmony import */ var _Faust2MD__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Faust2MD */ "./src/misc/monaco-faust/Faust2MD.ts");


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
      exps.forEach((exp) => {
        const matched = exp.match(this.REGEX_DEF_LIB);
        if (matched)
          libs.push({ namespace: matched[1], fileName: matched[2] });
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
      exps.forEach((exp) => {
        const matched = exp.match(this.REGEX_DEF_IMP);
        if (matched)
          imps.push(matched[1]);
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
    condsIn.forEach((cond) => {
      const regexp = new RegExp(this.REGEX_FUNC_NAME_COND, "g");
      const result = regexp.exec(cond);
      if (!result)
        return;
      const found = result[0];
      const index = result.index;
      const subConds = result.splice(1).filter((el) => typeof el === "string").map((str) => str.replace(/^\|/, ""));
      const before = cond.substring(0, index);
      const after = cond.substring(index + found.length);
      if (subConds.length === 1) {
        conds.push(before + after);
        conds.push(before + subConds + after);
      } else {
        subConds.forEach((subCond) => conds.push(before + subCond + after));
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
    if (depthIn === 0)
      return docIn;
    const depth = depthIn || 2;
    const strIn = await getFile(fileName);
    const doc = docIn || {};
    const path = pathIn || [];
    let inComment = false;
    let idt = 0;
    let curName = "";
    let strBuffer = "";
    const lines = strIn.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line)
        continue;
      if (!_Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.isComment(line)) {
        if (inComment) {
          inComment = false;
          if (curName)
            this.getAllConditions(curName).forEach((name) => doc[path.concat(name).join(".")] = { name: curName, path: [...path], doc: strBuffer });
          curName = "";
          strBuffer = "";
        }
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
        if (idt === 0)
          idt = _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.indentation(line);
        const { endC, endS, endT } = { endC: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchEndComment(line), endS: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchEndSection(line), endT: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchEndTitle(line) };
        if (endC || endS || endT)
          inComment = false;
        else
          strBuffer += _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.outdent(line, idt) + "\n";
        if (endC) {
          if (curName)
            this.getAllConditions(curName).forEach((name) => doc[path.concat(name).join(".")] = { name: curName, path: [...path], doc: strBuffer });
          curName = "";
          strBuffer = "";
        }
        continue;
      }
      const { c, s, t } = { c: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchBeginComment(line), s: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchBeginSection(line), t: _Faust2MD__WEBPACK_IMPORTED_MODULE_0__.Faust2MD.matchBeginTitle(line) };
      if (c)
        curName = this.matchFuncName(c);
      if (c || s || t) {
        inComment = true;
        idt = 0;
        strBuffer = "";
      }
    }
    return doc;
  }
}
Faust2Doc.REGEX_DEF_LIB = /\b(\w+)\s*=\s*library\("(.+)"\);/;
Faust2Doc.REGEX_DEF_IMP = /\bimport\("(.+)"\);/;
Faust2Doc.REGEX_FUNC_NAME = /`.*?([\w[\]|]+)`/;
Faust2Doc.REGEX_FUNC_NAME_COND = /\[(.+?)(\|.+?)*?]/;


/***/ }),

/***/ "./src/misc/monaco-faust/Faust2MD.ts":
/*!*******************************************!*\
  !*** ./src/misc/monaco-faust/Faust2MD.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Faust2MD": () => (/* binding */ Faust2MD)
/* harmony export */ });

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
    return `---
file: ${fileName}
date: ${new Date().toLocaleDateString()}
---
`;
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
    const options = __spreadValues({ tabsize: 4, code: false, front: false }, optionsIn);
    let strOut = "";
    let inComment = false;
    let idt = 0;
    if (options.front && fileName)
      strOut += this.frontMatter(fileName);
    strIn.split("\n").forEach((line) => {
      if (!this.isComment(line)) {
        if (inComment) {
          strOut += "\n";
          inComment = false;
        }
        if (options.code)
          strOut += `	${line}
`;
        return;
      }
      if (inComment) {
        if (idt === 0)
          idt = this.indentation(line);
        const { endC, endS, endT } = { endC: this.matchEndComment(line), endS: this.matchEndSection(line), endT: this.matchEndTitle(line) };
        if (endC)
          strOut += "\n---\n\n";
        if (endC || endS || endT)
          inComment = false;
        else
          strOut += this.outdent(line, idt) + "\n";
        return;
      }
      const { c, s, t } = { c: this.matchBeginComment(line), s: this.matchBeginSection(line), t: this.matchBeginTitle(line) };
      if (c)
        strOut += `
### ${c}
`;
      else if (s)
        strOut += `
## ${s}
`;
      else if (t)
        strOut += `
# ${t}
`;
      if (c || s || t) {
        inComment = true;
        idt = 0;
      } else if (options.code)
        strOut += `	${line}
`;
    });
    return strOut;
  }
}
Faust2MD.REGEX_BEG_TITLE = /^\s*\/\/#{3,}\s*([^#]*[^#\s])\s*#{3,}$/;
Faust2MD.REGEX_END_TITLE = /^\s*((\/\/#{3,})|(\s*))$/;
Faust2MD.REGEX_BEG_SECTION = /^\s*\/\/={3,}\s*([^=]*[^=\s])\s*={3,}$/;
Faust2MD.REGEX_END_SECTION = /^\s*((\/\/={3,})|(\s*))$/;
Faust2MD.REGEX_BEG_COMMENT = /^\s*\/\/-{3,}\s*([^-]*[^=\s])\s*-{3,}$/;
Faust2MD.REGEX_END_COMMENT = /^\s*((\/\/-{3,})|(\s*))$/;
Faust2MD.REGEX_INDENT = /(^\s*\/\/\s*)[^\s]/;
Faust2MD.REGEX_COMMENT = /^\s*\/\//;


/***/ }),

/***/ "./src/misc/monaco-faust/FaustLang.ts":
/*!********************************************!*\
  !*** ./src/misc/monaco-faust/FaustLang.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "config": () => (/* binding */ config),
/* harmony export */   "getProviders": () => (/* binding */ getProviders),
/* harmony export */   "language": () => (/* binding */ language),
/* harmony export */   "matchDocKey": () => (/* binding */ matchDocKey),
/* harmony export */   "theme": () => (/* binding */ theme)
/* harmony export */ });
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "include-loader!./node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var _Faust2Doc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Faust2Doc */ "./src/misc/monaco-faust/Faust2Doc.ts");
/* harmony import */ var _documentation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./documentation */ "./src/misc/monaco-faust/documentation.ts");

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};



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
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "/*", close: "*/", notIn: ["string"] }
  ]
};
const theme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "faustFunctions", foreground: "DDDD99" },
    { token: "faustKeywords", foreground: "4499CC" },
    { token: "faustLib", foreground: "CCCCBB" },
    { token: "faustCompOperators", foreground: "FFDDFF" },
    { token: "identifier", foreground: "77CCFF" }
  ],
  colors: {}
};
const faustKeywords = [
  "import",
  "component",
  "declare",
  "library",
  "environment",
  "int",
  "float",
  "letrec",
  "with",
  "class",
  "process",
  "effect",
  "inputs",
  "outputs"
];
const faustFunctions = [
  "mem",
  "prefix",
  "rdtable",
  "rwtable",
  "select2",
  "select3",
  "ffunction",
  "fconstant",
  "fvariable",
  "route",
  "waveform",
  "soundfile",
  "button",
  "checkbox",
  "vslider",
  "hslider",
  "nentry",
  "vgroup",
  "hgroup",
  "tgroup",
  "vbargraph",
  "hbargraph",
  "attach",
  "acos",
  "asin",
  "atan",
  "atan2",
  "cos",
  "sin",
  "tan",
  "exp",
  "log",
  "log10",
  "pow",
  "sqrt",
  "abs",
  "min",
  "max",
  "fmod",
  "remainder",
  "floor",
  "ceil",
  "rint",
  "seq",
  "par",
  "sum",
  "prod"
];
const getFile = async (fileName, faust) => {
  if (faust)
    return faust.fs().readFile("/usr/share/faust/" + fileName, { encoding: "utf8" });
  const libPath = "https://faustlibraries.grame.fr/libs/";
  const res = await fetch(libPath + fileName);
  return res.text();
};
const matchDocKey = (doc, model, position) => {
  const line$ = position.lineNumber;
  const line = model.getLineContent(line$);
  const wordAtPosition = model.getWordAtPosition(position);
  if (!wordAtPosition)
    return null;
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
    const name2 = nameArray.join(".");
    const e = doc[name2];
    if (e) {
      return {
        nameArray,
        name: name2,
        range: new monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.Range(line$, column$ + 1, line$, wordAtPosition.endColumn),
        doc: e
      };
    }
    column$ += nameArray.splice(0, 1)[0].length + 1;
  }
  return null;
};
const getProviders = async (faust) => {
  let libDocs = {};
  let primDocs = {};
  try {
    libDocs = await _Faust2Doc__WEBPACK_IMPORTED_MODULE_1__.Faust2Doc.parse("stdfaust.lib", async (fileName) => getFile(fileName, faust));
    primDocs = await _Faust2Doc__WEBPACK_IMPORTED_MODULE_1__.Faust2Doc.parse("primitives.lib", async (fileName) => getFile(fileName, faust));
  } catch (e) {
    console.error(e);
  }
  const faustLib = Object.keys(libDocs);
  const hoverProvider = {
    provideHover: (model, position) => {
      const matched = matchDocKey(__spreadValues(__spreadValues({}, primDocs), libDocs), model, position);
      if (matched) {
        const prefix = matched.nameArray.slice();
        const name = prefix.pop();
        const doc = matched.doc;
        return {
          range: matched.range,
          contents: [
            { value: `\`\`\`
${prefix.length ? "(" + prefix.join(".") + ".)" : ""}${name}
\`\`\`` },
            { value: doc.doc.replace(/#+/g, "######") },
            { value: prefix.length ? `[Detail...](${_documentation__WEBPACK_IMPORTED_MODULE_2__.faustDocURL}/${_documentation__WEBPACK_IMPORTED_MODULE_2__.docSections[prefix.slice(0, 2).toString()]}/#${prefix.join(".")}${doc.name.replace(/[[\]|]/g, "").toLowerCase()})` : "[Detail...](https://faustdoc.grame.fr/manual/syntax/index.html#faust-syntax)" }
          ]
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
    faustCompOperators: [
      "~",
      ",",
      ":",
      "<:",
      ":>"
    ],
    operators: [
      "=",
      "+",
      "-",
      "*",
      "/",
      "%",
      "^",
      "&",
      "|",
      "xor",
      "<<",
      ">>",
      ">",
      "<",
      "==",
      "<=",
      ">=",
      "!=",
      "@",
      "'"
    ],
    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*/^%]+/,
    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // identifiers and keywords
        [/!|_/, "keyword"],
        [/[a-z_$]([\w.$]*[\w$])?/, {
          cases: {
            "@faustFunctions": "faustFunctions",
            "@faustKeywords": "faustKeywords",
            "@faustLib": "faustLib",
            "@default": "identifier"
          }
        }],
        [/[A-Z][\w$]*/, "type.identifier"],
        // whitespace
        { include: "@whitespace" },
        // delimiters and operators
        [/[{}()[\]]/, "@brackets"],
        [/~|,|<:|:>|:/, "faustCompOperators"],
        [/[<>](?!@symbols)/, "@brackets"],
        [/=|\+|-|\*|\/|%|\^|&|\||xor|<<|>>|>|<|==|<=|>=|!=|@|'/, {
          cases: {
            "@operators": "operators",
            "@default": ""
          }
        }],
        // numbers
        [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+/, "number"],
        // delimiter: after number because of .\d floats
        [/[;.]/, "delimiter"],
        // strings
        [/"/, { token: "string", next: "@string" }]
      ],
      comment: [
        [/[^/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        [/\*\//, "comment", "@pop"],
        [/[/*]/, "comment"]
      ],
      string: [
        [/[^\\"$]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"]
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"]
      ]
    }
  };
  const completionItemProvider = {
    provideCompletionItems: () => {
      const suggestions = [];
      [...faustKeywords, ...faustFunctions, ...faustLib].forEach((e) => {
        suggestions.push({
          label: e,
          kind: monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.languages.CompletionItemKind.Text,
          insertText: e,
          range: null
        });
      });
      return { suggestions };
    }
  };
  return { hoverProvider, tokensProvider, completionItemProvider, docs: libDocs };
};


/***/ }),

/***/ "./src/misc/monaco-faust/documentation.ts":
/*!************************************************!*\
  !*** ./src/misc/monaco-faust/documentation.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "docSections": () => (/* binding */ docSections),
/* harmony export */   "faustDocURL": () => (/* binding */ faustDocURL)
/* harmony export */ });

const faustDocURL = "https://faustlibraries.grame.fr/libs";
const docSections = {
  aa: "aanl",
  an: "analyzers",
  ba: "basics",
  co: "compressors",
  de: "delays",
  dm: "demos",
  dx: "dx7",
  en: "envelopes",
  fd: "fds",
  fi: "filters",
  ho: "hoa",
  it: "interpolators",
  ma: "maths",
  mi: "mi",
  ef: "misceffects",
  os: "oscillators",
  no: "noises",
  pf: "phaflangers",
  pm: "physmodels",
  qu: "quantizers",
  rm: "reducemaps",
  re: "reverbs",
  ro: "routes",
  si: "signals",
  so: "soundfiles",
  sp: "spats",
  sy: "synths",
  ve: "vaeffects",
  vl: "version",
  wa: "webaudio",
  wd: "wdmodels"
};


/***/ }),

/***/ "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII= ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=";

/***/ }),

/***/ "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg== ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

/***/ }),

/***/ "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg== ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

/***/ })

}]);
//# sourceMappingURL=dd086a72d72a49236cb2.js.map