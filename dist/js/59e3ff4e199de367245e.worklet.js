/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/PackageManager.ts":
/*!************************************!*\
  !*** ./src/core/PackageManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PackageManager)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
/* harmony import */ var _utils_symbols__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/symbols */ "./src/utils/symbols.ts");
/* harmony import */ var _objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/base/AbstractObject */ "./src/core/objects/base/AbstractObject.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class PackageManager extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  get global() {
    return this.patcher.env.pkgMgr;
  }

  get mode() {
    return this.patcher.props.mode;
  }

  get patcherDependencies() {
    return this.patcher.props.dependencies;
  }

  get patcherDependenciesNames() {
    return this.patcher.props.dependencies.map(t => t[0]);
  }

  get packagesInfo() {
    return Object.keys(this.global[this.mode]).map(id => {
      var _this$global$imported;

      return {
        id,
        isBuiltIn: this.global.builtInPackagesNames.indexOf(id) !== -1,
        url: (_this$global$imported = this.global.importedPackages.find(p => p.name === id)) === null || _this$global$imported === void 0 ? void 0 : _this$global$imported.baseUrl,
        enabled: id in this.pkg
      };
    });
  }

  constructor(patcher) {
    super();

    _defineProperty(this, "patcher", void 0);

    _defineProperty(this, "pkg", void 0);

    _defineProperty(this, "lib", void 0);

    this.patcher = patcher;
  }

  async init() {
    await this.loadPatcherDependencies();
    this.pkg = {};

    for (const pkgName of Object.keys(this.global[this.mode]).sort((a, b) => b === "globalThis" ? -1 : 1)) {
      if (this.global.builtInPackagesNames.indexOf(pkgName) !== -1) {
        const pkg = this.global[this.mode][pkgName];
        if (pkg) this.pkg[pkgName] = pkg;
      }
    }

    for (const pkgName of this.patcherDependenciesNames) {
      const pkg = this.global[this.mode][pkgName];
      if (pkg) this.pkg[pkgName] = pkg;
    }

    this.lib = this.packageRegister(this.pkg);
    this.emitLibChanged();
  }

  async loadPatcherDependencies() {
    try {
      var _this$patcher$file;

      await this.patcher.env.taskMgr.newTask(this, "".concat(((_this$patcher$file = this.patcher.file) === null || _this$patcher$file === void 0 ? void 0 : _this$patcher$file.name) || "", " Loading dependencies"), async onUpdate => {
        for (let i = 0; i < this.patcherDependencies.length; i++) {
          const [name, url] = this.patcherDependencies[i];
          onUpdate("".concat(name, " from ").concat(url));
          if (this.global[this.mode][name]) return;

          try {
            var _this$global$importFr, _this$global;

            await ((_this$global$importFr = (_this$global = this.global).importFromURL) === null || _this$global$importFr === void 0 ? void 0 : _this$global$importFr.call(_this$global, url, name));
          } catch (e) {
            throw new Error("Loading dependency: ".concat(name, " from ").concat(url, " failed"));
          }
        }
      });
    } catch (error) {
      this.patcher.error(error.message);
    }
  }

  async importFromURL(url, id) {
    if (!this.global.importFromURL) throw new Error("Cannot import from this context");
    await this.global.importFromURL(url, id);
    this.init();
    this.emitLibChanged();
  }

  emitLibChanged() {
    this.patcher.emit("libChanged", {
      pkg: this.pkg,
      lib: this.lib
    });
  }

  packageRegister(pkg) {
    let libOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let rootifyDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
    let pathIn = arguments.length > 3 ? arguments[3] : undefined;
    const path = pathIn ? pathIn.slice() : [];

    if (path.length && _utils_symbols__WEBPACK_IMPORTED_MODULE_1__.ImporterDirSelfObject in pkg) {
      const el = pkg[_utils_symbols__WEBPACK_IMPORTED_MODULE_1__.ImporterDirSelfObject];

      if ((0,_objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__.isJSPatcherObjectConstructor)(el)) {
        const full = path.join(".");
        if (full in libOut) this.emit("pathDuplicated", full); // this.patcher.newLog("warn", "Patcher", "Path duplicated, cannot register " + full, this);
        else libOut[full] = el;
        const p = path.slice();

        while (p.length && path.length - p.length < rootifyDepth) {
          const k = p.join(".");
          if (!(k in libOut)) libOut[k] = el;
          p.shift();
        }
      }
    }

    for (const key in pkg) {
      const el = pkg[key];

      if (typeof el === "object") {
        this.packageRegister(el, libOut, rootifyDepth, [...path, key]);
      } else if ((0,_objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__.isJSPatcherObjectConstructor)(el)) {
        const full = [...path, key].join(".");
        if (full in libOut) this.emit("pathDuplicated", full); // this.patcher.newLog("warn", "Patcher", "Path duplicated, cannot register " + full, this);
        else libOut[full] = el;
        const p = [...path, key];

        while (p.length && path.length + 1 - p.length < rootifyDepth) {
          const k = p.join(".");
          if (!(k in libOut)) libOut[k] = el;
          p.shift();
        }
      }
    }

    return libOut;
  }

  searchInLib(query) {
    let limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
    let staticMethodOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let lib = arguments.length > 3 ? arguments[3] : undefined;
    const keys = Object.keys(lib).sort();
    const items = [];

    for (let i = 0; i < keys.length; i++) {
      if (items.length >= limit) break;
      const key = keys[i];

      if (key.startsWith(query)) {
        const o = lib[key];

        if (staticMethodOnly) {
          if (o[_utils_symbols__WEBPACK_IMPORTED_MODULE_1__.ImporterDirSelfObject]) {
            items.push({
              key,
              object: o
            });
          }
        } else {
          items.push({
            key,
            object: o
          });
        }
      }
    }

    return items;
  }

  searchInPkg(query) {
    let limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
    let staticMethodOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let pkg = arguments.length > 3 ? arguments[3] : undefined;
    let path = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    const outs = [];

    for (const key in pkg) {
      if (outs.length >= limit) break;
      const o = pkg[key];

      if (typeof o === "object") {
        if (key.indexOf(query) !== -1) outs.push({
          path: [...path, key],
          object: o
        });else outs.push(...this.searchInPkg(query, limit, staticMethodOnly, o, [...path, key]));
      } else {
        if (key.indexOf(query) !== -1) outs.push({
          path: [...path, key],
          object: o
        });
      }
    }

    return outs;
  }

  getFromPath(pathIn, pkg) {
    const path = pathIn.slice();
    let o = pkg;

    while (path.length) {
      const key = path.shift();
      o = o[key];
      if (!o) return null;
      if (typeof o !== "object" && !(0,_objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__.isJSPatcherObjectConstructor)(o)) return null;
    }

    return o;
  }

}

/***/ }),

/***/ "./src/core/Project.ts":
/*!*****************************!*\
  !*** ./src/core/Project.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Project)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Project extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  get audioCtx() {
    return this.env.audioCtx;
  }

  constructor(envIn) {
    super();

    _defineProperty(this, "projectFilename", ".jspatproj");

    _defineProperty(this, "env", void 0);

    _defineProperty(this, "instances", void 0);

    _defineProperty(this, "props", {
      name: Project.props.name.default,
      author: Project.props.author.default,
      version: Project.props.version.default
    });

    this.env = envIn;
  }

  setProps(props) {
    let changed = false;

    for (const keyIn in props) {
      const key = keyIn;
      if (this.props[key] === props[key]) continue;
      changed = true;
      this.props[key] = props[key];
    }

    if (changed) this.emit("propsChanged", props);
  }

  async save() {
    await this.emit("save");
  }

  async load() {
    let clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    await this.env.fileMgr.init(clean);
    await this.init();
  }

  async init() {
    try {
      const item = this.env.fileMgr.getProjectItemFromPath("./".concat(this.projectFilename));
      const json = JSON.parse((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.ab2str)(item.data));
      this.setProps(json);
    } catch (error) {
      const data = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.str2ab)(JSON.stringify(this.props));
      await this.env.fileMgr.projectRoot.addFile(this.projectFilename, data);
    }
  }

  async unload() {
    for (const i of this.env.instances) {
      if (i.project === this) await i.destroy();
    }

    await this.emit("unload");
  }

}

_defineProperty(Project, "props", {
  name: {
    type: "string",
    description: "Project name",
    default: "Untitled"
  },
  author: {
    type: "string",
    description: "Author",
    default: "Anonymous"
  },
  version: {
    type: "string",
    description: "Current version",
    default: "0.0.0"
  }
});

/***/ }),

/***/ "./src/core/TaskMgr.ts":
/*!*****************************!*\
  !*** ./src/core/TaskMgr.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskManager)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class TaskManager extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_id", 0);

    _defineProperty(this, "_tasks", {});

    _defineProperty(this, "_errors", {});
  }

  get tasks() {
    const tasks = [];

    for (const key in this._tasks) {
      tasks.push(...this._tasks[key].filter(e => !!e));
    }

    return tasks;
  }

  get errors() {
    const errors = [];

    for (const key in this._errors) {
      errors.push(...this._errors[key].filter(e => !!e));
    }

    return errors;
  }

  async newTask(emitter, message, callback) {
    const thread = globalThis.constructor.name;
    const timestamp = Date.now();
    const id = thread + this._id++;
    const task = {
      id,
      thread,
      timestamp,
      emitter,
      message,
      callback
    };
    if (!(thread in this._tasks)) this._tasks[thread] = [];
    const $ = this._tasks[thread].push(task) - 1;
    this.emit("tasks", this.tasks);
    this.emit("taskBegin", task);
    let returnValue;

    const handleUpdate = msg => {
      const task = {
        id,
        thread,
        timestamp,
        emitter,
        message: "".concat(message, ": ").concat(msg),
        callback
      };
      this._tasks[thread][$] = task;
      this.emit("tasks", this.tasks);
      this.emit("taskUpdate", task);
    };

    try {
      returnValue = await callback(handleUpdate);
    } catch (error) {
      const taskError = {
        id,
        thread,
        timestamp,
        emitter,
        message,
        error
      };
      if (!(thread in this._errors)) this._errors[thread] = [];

      this._errors[thread].push(taskError);

      this.emit("errors", this.errors);
      this.emit("taskError", taskError);
      throw error;
    } finally {
      this._tasks[thread][$] = null;
      this.emit("tasks", this.tasks);
      this.emit("taskEnd", task);
    }

    return returnValue;
  }

  get lastError() {
    return this.errors.sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  get lastTask() {
    return this.tasks.sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  getTasksFromEmitter(emitter) {
    return this.tasks.filter(task => task.emitter === emitter);
  }

  getErrorsFromEmitter(emitter) {
    return this.errors.filter(error => error.emitter === emitter);
  }

  dismissLastError() {
    const {
      lastError
    } = this;
    if (!lastError) return;

    const $ = this._errors[lastError.thread].indexOf(lastError);

    this._errors[lastError.thread][$] = null;
    this.emit("errors", this.errors);
  }

  dismissAllErrors() {
    this._errors = {};
    this.emit("errors", this.errors);
  }

}

/***/ }),

/***/ "./src/core/WorkletGlobalPackageManager.ts":
/*!*************************************************!*\
  !*** ./src/core/WorkletGlobalPackageManager.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkletGlobalPackageManager)
/* harmony export */ });
/* harmony import */ var _utils_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/symbols */ "./src/utils/symbols.ts");
/* harmony import */ var _objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/base/AbstractObject */ "./src/core/objects/base/AbstractObject.ts");
/* harmony import */ var _objects_base_index_jsdsppkg_aw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/base/index.jsdsppkg.aw */ "./src/core/objects/base/index.jsdsppkg.aw.ts");
/* harmony import */ var _objects_globalThis_index_jsdsppkg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/globalThis/index.jsdsppkg */ "./src/core/objects/globalThis/index.jsdsppkg.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class WorkletGlobalPackageManager {
  get builtInPackagesNames() {
    return [...this.importedPackages.filter(p => p.isBuiltIn).map(p => p.name), "Base", "globalThis"];
  }

  get externalPackagesNames() {
    return this.importedPackages.filter(p => !p.isBuiltIn).map(p => p.name);
  }

  constructor(envIn) {
    _defineProperty(this, "js", void 0);

    _defineProperty(this, "jsaw", void 0);

    _defineProperty(this, "faust", void 0);

    _defineProperty(this, "max", void 0);

    _defineProperty(this, "gen", void 0);

    _defineProperty(this, "env", void 0);

    _defineProperty(this, "externals", new Map());

    _defineProperty(this, "importedPackages", []);

    this.env = envIn;
  }

  async init() {
    this.jsaw = {
      Base: await (0,_objects_base_index_jsdsppkg_aw__WEBPACK_IMPORTED_MODULE_2__.default)(),
      globalThis: await (0,_objects_globalThis_index_jsdsppkg__WEBPACK_IMPORTED_MODULE_3__.default)()
    };
    await this.env.addObjects(this.getDescriptors(this.jsaw.globalThis, "globalThis"), "globalThis");
  }

  toDescriptor(O, pkgName) {
    const {
      path
    } = O;
    return {
      isObjectDescriptor: true,
      ctor: O.importedObjectType,
      path,
      name: path[path.length - 1] || pkgName
    };
  }

  getDescriptors() {
    let pkgIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.jsaw.globalThis;
    let pkgName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "globalThis";
    const $self = "__JSPatcher_Importer_ImporterDirSelfObject";
    const pkg = Object.entries(pkgIn).reduce((acc, _ref) => {
      let [k, v] = _ref;

      if (typeof v === "function") {
        const descriptor = this.toDescriptor(v, pkgName);
        if (k === _utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject) acc[$self] = descriptor;else acc[k] = descriptor;
      } else {
        acc[k] = this.getDescriptors(v, pkgName);
      }

      return acc;
    }, {});
    if (_utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject in pkgIn) pkg[$self] = this.toDescriptor(pkgIn[_utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject], pkgName);
    return pkg;
  }

  add(pkgIn, lib) {
    let pathIn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    const path = pathIn.slice();
    let pkg = this[lib];

    while (path.length) {
      const key = path.shift();
      if (!pkg[key]) pkg[key] = {};else if ((0,_objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_1__.isJSPatcherObjectConstructor)(pkg[key])) pkg[key] = {
        [_utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject]: pkg[key]
      };
      pkg = pkg[key];
    }

    Object.assign(pkg, pkgIn);
  }

  async fetchModule(url) {
    const toExport = {};
    globalThis.exports = toExport;
    globalThis.module = {
      exports: toExport
    };
    await this.env.addWorkletModule(url);
    const exported = globalThis.module.exports;
    delete globalThis.exports;
    delete globalThis.module;
    return exported;
  }

  async importPackage(url, pkgInfo) {
    if (this.importedPackages.find(p => p.name === pkgInfo.name)) return;
    const getter = (await this.fetchModule(url)).default;
    this.add(await getter(this.env), "jsaw", [pkgInfo.name]);
    this.importedPackages.push(pkgInfo);
  }

}

/***/ }),

/***/ "./src/core/WorkletSDK.ts":
/*!********************************!*\
  !*** ./src/core/WorkletSDK.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JSPatcherWorkletSDK)
/* harmony export */ });
/* harmony import */ var _objects_base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _patcher_Patcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./patcher/Patcher */ "./src/core/patcher/Patcher.ts");
/* harmony import */ var _patcher_Box__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./patcher/Box */ "./src/core/patcher/Box.ts");
/* harmony import */ var _patcher_Line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patcher/Line */ "./src/core/patcher/Line.ts");
/* harmony import */ var _objects_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./objects/base/generateRemotedObject */ "./src/core/objects/base/generateRemotedObject.ts");
/* harmony import */ var _objects_base_Bang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./objects/base/Bang */ "./src/core/objects/base/Bang.ts");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/buffer */ "./src/utils/buffer.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










class JSPatcherWorkletSDK {
  constructor() {
    _defineProperty(this, "Patcher", _patcher_Patcher__WEBPACK_IMPORTED_MODULE_1__.default);

    _defineProperty(this, "Box", _patcher_Box__WEBPACK_IMPORTED_MODULE_2__.default);

    _defineProperty(this, "Line", _patcher_Line__WEBPACK_IMPORTED_MODULE_3__.default);

    _defineProperty(this, "BaseObject", _objects_base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default);

    _defineProperty(this, "generateRemotedObject", _objects_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_4__.default);

    _defineProperty(this, "Bang", _objects_base_Bang__WEBPACK_IMPORTED_MODULE_5__.default);

    _defineProperty(this, "isBang", _objects_base_Bang__WEBPACK_IMPORTED_MODULE_5__.isBang);

    _defineProperty(this, "MathUtils", _utils_math__WEBPACK_IMPORTED_MODULE_6__);

    _defineProperty(this, "BufferUtils", _utils_buffer__WEBPACK_IMPORTED_MODULE_7__);

    _defineProperty(this, "Utils", _utils_utils__WEBPACK_IMPORTED_MODULE_8__);
  }

}

/***/ }),

/***/ "./src/core/audio/TempAudioFile.ts":
/*!*****************************************!*\
  !*** ./src/core/audio/TempAudioFile.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TempAudioFile)
/* harmony export */ });
/* harmony import */ var _file_TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/TemporaryProjectFile */ "./src/core/file/TemporaryProjectFile.ts");

class TempAudioFile extends _file_TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_0__.default {
  get type() {
    return "audio";
  }

  async instantiate() {
    return this.data;
  }

  async instantiateEditor(_ref) {
    let {
      env,
      project,
      instanceId
    } = _ref;
    const AudioEditor = (await __webpack_require__.e(/*! import() */ "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./AudioEditor */ "./src/core/audio/AudioEditor.ts"))).default;
    return AudioEditor.fromProjectItem({
      file: this,
      env,
      project,
      instanceId
    });
  }

}

/***/ }),

/***/ "./src/core/file/AbstractProjectFile.ts":
/*!**********************************************!*\
  !*** ./src/core/file/AbstractProjectFile.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractProjectFile)
/* harmony export */ });
/* harmony import */ var _AbstractProjectItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractProjectItem */ "./src/core/file/AbstractProjectItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AbstractProjectFile extends _AbstractProjectItem__WEBPACK_IMPORTED_MODULE_0__.default {
  get type() {
    return this.fileMgr.getTypeFromFileName(this.name);
  }

  get data() {
    return this._data;
  }

  set data(dataIn) {
    this._data = dataIn;
  }

  get fileExtension() {
    const splitted = this.name.split(".");
    return splitted[splitted.length - 1];
  }

  constructor(fileMgrIn, parentIn, nameIn, dataIn) {
    super(fileMgrIn, parentIn, nameIn);

    _defineProperty(this, "isFolder", false);

    _defineProperty(this, "_data", void 0);

    if (dataIn) this._data = dataIn;
    this.onAny((eventName, eventData) => {
      const {
        id,
        isFolder,
        type,
        path,
        data
      } = this;
      this.fileMgr.emit("itemChanged", {
        id,
        isFolder,
        type,
        path,
        data,
        eventName,
        eventData
      });
    });
  }

  async save(newData, by) {
    this._data = newData;
    await this.emit("saved", by);
    await this.fileMgr.emitChanged();
  }

  async saveAsCopy(parent, name, newData, manager) {
    const item = this.clone(parent, name, newData);
    parent.items.add(item);
    await this.emitTreeChanged();
    await this.fileMgr.emitChanged();
    return item;
  }

  async saveAs(to, newName, newData, by, manager) {
    const {
      parent,
      name,
      data
    } = this;
    const from = parent;
    this._data = newData;
    await this.move(to, newName);
    const item = this.clone(parent, name, data);
    parent.items.add(item);
    await parent.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", {
      from: from.path,
      to: to.path
    });
    await this.emit("saved", by);
    await this.fileMgr.emitChanged();
    return item;
  }

}

/***/ }),

/***/ "./src/core/file/AbstractProjectFolder.ts":
/*!************************************************!*\
  !*** ./src/core/file/AbstractProjectFolder.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractProjectFolder)
/* harmony export */ });
/* harmony import */ var _AbstractProjectItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractProjectItem */ "./src/core/file/AbstractProjectItem.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AbstractProjectFolder extends _AbstractProjectItem__WEBPACK_IMPORTED_MODULE_0__.default {
  get type() {
    return "folder";
  }

  get isDirty() {
    return !this.getDescendantFiles().every(f => !f.isDirty);
  }

  constructor(fileMgrIn, parentIn, nameIn) {
    super(fileMgrIn, parentIn, nameIn);

    _defineProperty(this, "isFolder", true);

    _defineProperty(this, "items", new Set());

    this.onAny((eventName, eventData) => {
      const {
        id,
        isFolder,
        type,
        path
      } = this;
      this.fileMgr.emit("itemChanged", {
        id,
        isFolder,
        type,
        path,
        eventName,
        eventData
      });
    });
  }

  findItem(itemIn) {
    return Array.from(this.items).find(item => item.name === itemIn);
  }

  existItem(itemIn) {
    return typeof itemIn === "string" ? !!this.findItem(itemIn) : this.items.has(itemIn);
  }

  uniqueName(nameIn) {
    if (!this.existItem(nameIn)) return nameIn;
    let i = 0;
    let name;

    do {
      i++;
      name = "nameIn_".concat(i);
    } while (this.existItem(nameIn));

    return name;
  }

  async empty() {
    for (const item of this.items) {
      await item.destroy();
    }
  }

  getTree() {
    return {
      type: "folder",
      id: this.id,
      isFolder: true,
      name: this.name,
      items: Array.from(this.items).map(item => {
        if (item.isFolder === false) {
          const {
            id,
            isFolder,
            type,
            name,
            data
          } = item;
          return {
            id,
            isFolder,
            type,
            name,
            data
          };
        }

        return item.getTree();
      })
    };
  }

  getDescendantFiles() {
    return Array.from(this.items).reduce((acc, cur) => {
      if (cur.isFolder === false) acc.push(cur);else acc.push(...cur.getDescendantFiles());
      return acc;
    }, []);
  }

  isParentOf(itemIn) {
    let {
      parent
    } = itemIn;

    while (parent !== this) {
      if (!parent) return false;
      parent = parent.parent;
    }

    return true;
  }

  getOrderedItems() {
    const items = Array.from(this.items);
    const folders = items.filter(i => i.isFolder).sort((a, b) => a.name.localeCompare(b.name));
    const files = items.filter(i => !i.isFolder).sort((a, b) => a.name.localeCompare(b.name));
    return [...folders, ...files];
  }

}

/***/ }),

/***/ "./src/core/file/AbstractProjectItem.ts":
/*!**********************************************!*\
  !*** ./src/core/file/AbstractProjectItem.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractProjectItem)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AbstractProjectItem extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  get type() {
    return "unknown";
  }

  get fileMgr() {
    return this._fileMgr;
  }

  get name() {
    return this._name;
  }

  get isDirty() {
    return this._isDirty;
  }

  get path() {
    return this.parent ? "".concat(this.parentPath, "/").concat(this._name) : "";
  }

  get parentPath() {
    var _this$parent;

    return (_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.path;
  }

  get projectPath() {
    return this.path.replace(new RegExp("^/".concat(this._fileMgr.projectFolderName)), "");
  }

  async addObserver(observer) {
    this._observers.add(observer);

    await this.emit("observers", this._observers);
    await this.fileMgr.emitChanged();
  }

  async removeObserver(observer) {
    this._observers.delete(observer);

    await this.emit("observers", this._observers);
    await this.fileMgr.emitChanged();
  }

  constructor(fileMgrIn, parentIn, nameIn) {
    super();

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "isFolder", void 0);

    _defineProperty(this, "_fileMgr", void 0);

    _defineProperty(this, "_name", void 0);

    _defineProperty(this, "parent", void 0);

    _defineProperty(this, "_isDirty", void 0);

    _defineProperty(this, "_observers", new Set());

    this._fileMgr = fileMgrIn;
    this.parent = parentIn;
    this._name = nameIn;
    this.on("dirty", dirty => this._isDirty = dirty);
  }

  async init() {
    this.id = this.fileMgr.generateItemId(this);
    await this.emit("ready");
    await this.fileMgr.emitChanged();
  }

  async emitTreeChanged() {
    await this.emit("treeChanged");
    await (this.parent || this.fileMgr).emitTreeChanged();
  }

}

/***/ }),

/***/ "./src/core/file/AbstractProjectItemManager.ts":
/*!*****************************************************!*\
  !*** ./src/core/file/AbstractProjectItemManager.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractProjectItemManager)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class AbstractProjectItemManager extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  get allItems() {
    const items = {};

    const rec = cur => {
      items[cur.id] = cur;
      if (cur.isFolder) cur.items.forEach(rec);
    };

    rec(this.root);
    return items;
  }

  get allProjectItems() {
    const items = {};

    const rec = cur => {
      items[cur.id] = cur;
      if (cur.isFolder) cur.items.forEach(rec);
    };

    rec(this.projectRoot);
    return items;
  }

  constructor(envIn) {
    super();

    _defineProperty(this, "projectFolderName", "project");

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "env", void 0);

    _defineProperty(this, "taskMgr", void 0);

    _defineProperty(this, "root", void 0);

    this.env = envIn;
    this.id = envIn.generateId(this);
    this.taskMgr = envIn.taskMgr;
  }

  emptyProject() {
    return this.projectRoot.empty();
  }

  getTypeFromFileName(name) {
    const splitted = name.split(".");
    const ext = splitted[splitted.length - 1];
    return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.extToType)(ext);
  }

  getProjectItemFromId(id) {
    return this.allItems[id];
  }

  getProjectItemFromPath(path) {
    const pathArray = path.split("/");
    const itemArray = [this.root, this.projectRoot];

    for (let i = 0; i < pathArray.length; i++) {
      const id = pathArray[i];
      if (id.length === 0) continue;
      if (id === ".") continue;

      if (id === "..") {
        itemArray.pop();
        continue;
      }

      const cur = itemArray[itemArray.length - 1];
      if (!cur.isFolder) throw new Error("".concat(cur.name, " from path ").concat(path, " is not a folder"));
      const next = cur.findItem(id);
      if (!next) throw new Error("Cannot find ".concat(id, " from path ").concat(path));
      itemArray.push(next);
    }

    return itemArray[itemArray.length - 1];
  }

  getPathIdMap() {
    const map = {};
    Object.entries(this.allItems).forEach(_ref => {
      let [id, {
        path
      }] = _ref;
      return map[path] = id;
    });
    return map;
  }

  instantiateProjectPath(path, envIn, projectIn) {
    const item = this.getProjectItemFromPath(path);
    if (item.isFolder === false) return item.instantiate({
      env: envIn,
      project: projectIn
    });
    throw new Error("Cannot instantiate ".concat(item.name, " from path ").concat(path, " as it is a folder"));
  }

  async emitTreeChanged() {
    this.emit("treeChanged", this.root.getTree());
  }

  async emitChanged() {
    this.emit("changed");
  }

  get projectRoot() {
    return this.root.findItem(this.projectFolderName);
  }

  generateItemId(item) {
    return this.env.generateId(item);
  }

}

/***/ }),

/***/ "./src/core/file/FileEditor.ts":
/*!*************************************!*\
  !*** ./src/core/file/FileEditor.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileEditor)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
/* harmony import */ var _TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemporaryProjectFile */ "./src/core/file/TemporaryProjectFile.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class FileEditor extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  static async fromProjectItem(_ref) {
    let {
      file,
      env,
      project,
      instanceId
    } = _ref;
    return new this(await file.instantiate({
      env,
      project,
      instanceId
    }));
  }

  get env() {
    return this.instance.env;
  }

  get project() {
    return this.instance.project;
  }

  get file() {
    return this.instance.file;
  }

  set file(value) {
    this.instance.file = value;
  }

  get ctx() {
    return this.instance.ctx;
  }

  get isInMemory() {
    return this.instance.isInMemory;
  }

  get isTemporary() {
    return this.instance.isTemporary;
  }

  get isReadonly() {
    return this.instance.isReadonly;
  }

  set isReadonly(value) {
    this.instance.isReadonly = value;
  }

  get isReady() {
    return this._isReady;
  }

  get isDestroyed() {
    return this._isDestroyed;
  }

  get isDirty() {
    return this.history.isDirty;
  }

  get isLocked() {
    return false;
  }

  get history() {
    return this.instance.history;
  }

  get fileExtension() {
    return "data";
  }

  get fileIcon() {
    return "code";
  }

  setActive() {
    this.env.activeEditor = this;
  }

  get isActive() {
    return this.env.thread === "main" && this.env.activeEditor === this;
  }

  constructor(instance) {
    var _this$instance;

    super();

    _defineProperty(this, "instance", void 0);

    _defineProperty(this, "_isReady", false);

    _defineProperty(this, "_isDestroyed", false);

    _defineProperty(this, "editorId", void 0);

    _defineProperty(this, "handleProjectSave", async () => this.save());

    _defineProperty(this, "handleProjectUnload", async () => this.destroy());

    _defineProperty(this, "handleDestroy", () => this.destroy());

    this.instance = instance;
    (_this$instance = this.instance) === null || _this$instance === void 0 ? void 0 : _this$instance.addObserver(this);
    this.instance.on("destroy", this.handleDestroy);
    this.history.addEditor(this);
    this.on("dirty", isDirty => {
      var _this$file;

      return (_this$file = this.file) === null || _this$file === void 0 ? void 0 : _this$file.emit("dirty", isDirty);
    });
    this.on("destroy", () => {
      var _this$file2;

      return (_this$file2 = this.file) === null || _this$file2 === void 0 ? void 0 : _this$file2.emit("dirty", false);
    });

    const handleReady = () => {
      this._isReady = true;
      this.off("ready", handleReady);
    };

    this.on("ready", handleReady);
    this.editorId = this.env.generateId(this);
    if (this.env.thread === "main") this.env.registerInstance(this.instance);

    if (this.project) {
      this.project.on("save", this.handleProjectSave);
      this.project.on("unload", this.handleProjectUnload);
    }
  }

  async toFileData() {
    return this.instance.serialize();
  }

  async toTempData() {
    return this.instance;
  }

  undo() {
    return this.history.undo();
  }

  redo() {
    return this.history.redo();
  }

  async copy() {
    throw new Error("Not implemented.");
  }

  async cut() {
    throw new Error("Not implemented.");
  }

  async paste() {
    throw new Error("Not implemented.");
  }

  async deleteSelected() {
    throw new Error("Not implemented.");
  }

  async selectAll() {
    throw new Error("Not implemented.");
  }

  onUiResized() {
    throw new Error("Not implemented.");
  }

  async save() {
    if (this.isReadonly) throw new Error("Cannot save readonly file");
    if (this.isInMemory) throw new Error("Cannot save in-memory instance");
    const data = await (this.file instanceof _TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_1__.default ? this.toTempData() : this.toFileData());
    await this.file.save(data, this);
    await this.emit("saved");
  }

  async saveAs(parent, name) {
    const data = await this.toFileData();

    if (this.isTemporary) {
      await this.file.saveAsCopy(parent, name, data);
    } else if (this.isReadonly) {
      await this.file.saveAs(parent, name, data, this);
    } else if (this.isInMemory) {
      this.file = await parent.addFile(name, data);
    } else {
      await this.file.saveAs(parent, name, data, this);
    }

    this.isReadonly = false;
    await this.emit("saved");
  }

  async destroy() {
    if (this.isDestroyed) return;

    if (this.project) {
      this.project.off("save", this.handleProjectSave);
      this.project.off("unload", this.handleProjectUnload);
    }

    this.instance.off("destroy", this.handleDestroy);
    this.instance.removeObserver(this);
    this.history.removeEditor(this);
    this._isDestroyed = true;
    await this.emit("destroy");
  }

}

/***/ }),

/***/ "./src/core/file/FileInstance.ts":
/*!***************************************!*\
  !*** ./src/core/file/FileInstance.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileInstance)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
/* harmony import */ var _TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TemporaryProjectFile */ "./src/core/file/TemporaryProjectFile.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class FileInstance extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  get env() {
    return this._env;
  }

  get project() {
    return this._project;
  }

  get file() {
    return this._file;
  }

  set file(value) {
    var _this$_file, _this$_file2;

    if (value === this._file) return;
    (_this$_file = this._file) === null || _this$_file === void 0 ? void 0 : _this$_file.removeObserver(this._id);
    this._file = value;
    (_this$_file2 = this._file) === null || _this$_file2 === void 0 ? void 0 : _this$_file2.addObserver(this._id);
  }

  get ctx() {
    return this.file || this.project || this.env;
  }

  get isInMemory() {
    return !this.file;
  }

  get isTemporary() {
    return this.file instanceof _TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_1__.default;
  }

  get isReadonly() {
    return this._isReadonly;
  }

  set isReadonly(value) {
    this._isReadonly = value;
  }

  get isReady() {
    return this._isReady;
  }

  setActive() {
    this.env.activeInstance = this;
  }

  get isActive() {
    return this.env.activeInstance === this;
  }

  async getEditor() {
    throw new Error("Not implemented.");
  }

  async addObserver(observer) {
    this._observers.add(observer);

    await this.emit("observers", this._observers);
  }

  async removeObserver(observer) {
    this._observers.delete(observer);

    await this.emit("observers", this._observers);
    if (this._observers.size === 0) await this.destroy();
  }

  get id() {
    return this._id;
  }

  get history() {
    return this._history;
  }

  constructor(_ref) {
    var _this$_file3;

    let {
      env,
      project,
      file,
      instanceId
    } = _ref;
    super();

    _defineProperty(this, "_env", void 0);

    _defineProperty(this, "_project", void 0);

    _defineProperty(this, "_file", void 0);

    _defineProperty(this, "_isReadonly", false);

    _defineProperty(this, "_isReady", false);

    _defineProperty(this, "_observers", new Set());

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "_history", void 0);

    this._env = env;
    this._project = project;
    this._file = file;
    this._id = this.env.registerInstance(this, instanceId);
    (_this$_file3 = this._file) === null || _this$_file3 === void 0 ? void 0 : _this$_file3.addObserver(this._id);
  }

  async init() {
    return this;
  }

  async serialize() {
    throw new Error("Not implemented.");
  }

  async destroy() {
    var _this$file;

    await this.emit("destroy");
    await ((_this$file = this.file) === null || _this$file === void 0 ? void 0 : _this$file.removeObserver(this._id));
  }

}

/***/ }),

/***/ "./src/core/file/History.ts":
/*!**********************************!*\
  !*** ./src/core/file/History.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ History)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** The class records some events and allows to perform undo/redo with a specific editor. */
class History {
  constructor() {
    _defineProperty(this, "editors", new Set());

    _defineProperty(this, "saveTime", 0);

    _defineProperty(this, "$", 0);

    _defineProperty(this, "eventQueue", []);

    _defineProperty(this, "capture", true);

    _defineProperty(this, "handleEditorEvent", async (eventName, eventData, editor) => {
      if (this.eventListening.indexOf(eventName) === -1) return;
      if (!this.capture) return;
      this.capture = false;
      await Promise.all(Array.from(this.editors).filter($editor => $editor !== editor).map($editor => $editor.emit(eventName, eventData)));
      this.capture = true;
      this.eventQueue.splice(this.$);
      this.$ = this.eventQueue.push({
        eventName,
        eventData,
        timestamp: this.now,
        editorId: editor.editorId
      });
      this.emitChanged();
    });

    _defineProperty(this, "handleSaved", () => {
      var _this$eventQueue;

      this.saveTime = (_this$eventQueue = this.eventQueue[this.$ - 1]) === null || _this$eventQueue === void 0 ? void 0 : _this$eventQueue.timestamp;
      this.emitDirty();
    });
  }

  get eventListening() {
    return [];
  }

  get now() {
    if (globalThis.performance) {
      return performance.now() + (performance.timeOrigin || performance.timing.navigationStart);
    }

    return Date.now();
  }

  addEditor(editor) {
    this.editors.add(editor);
    editor.onAny(this.handleEditorEvent);
    editor.on("saved", this.handleSaved);
    editor.once("destroy", () => this.removeEditor(editor));
  }

  removeEditor(editor) {
    editor.offAny(this.handleEditorEvent);
    this.editors.delete(editor);
  }

  emitChanged() {
    this.editors.forEach(editor => editor.emit("changed"));
    this.emitDirty();
  }

  emitDirty() {
    const {
      isDirty
    } = this;
    this.editors.forEach(editor => editor.emit("dirty", isDirty));
  }

  destroy() {
    this.editors.forEach(editor => this.removeEditor(editor));
  }

  get isDirty() {
    var _this$eventQueue2;

    if (!this.saveTime) return this.isUndoable;
    return this.saveTime !== ((_this$eventQueue2 = this.eventQueue[this.$ - 1]) === null || _this$eventQueue2 === void 0 ? void 0 : _this$eventQueue2.timestamp);
  }

  get isUndoable() {
    return this.$ !== 0;
  }

  get isRedoable() {
    return this.$ !== this.eventQueue.length;
  }

  async undo() {
    if (!this.editors.size) return;
    if (!this.isUndoable) return;
    this.capture = false;
    const {
      eventName,
      eventData
    } = this.eventQueue[this.$ - 1];
    await Promise.all(Array.from(this.editors).map(editor => this.undoOf(editor, eventName, eventData)));
    this.$--;
    this.capture = true;
    this.emitChanged();
  }

  async redo() {
    if (!this.editors.size) return;
    if (!this.isRedoable) return;
    this.capture = false;
    const {
      eventName,
      eventData
    } = this.eventQueue[this.$];
    await Promise.all(Array.from(this.editors).map(editor => this.redoOf(editor, eventName, eventData)));
    this.$++;
    this.capture = true;
    this.emitChanged();
  }
  /** event at timestamp exclusive */


  async undoUntil(timestamp) {
    while (this.isUndoable && this.eventQueue[this.$ - 1].timestamp >= timestamp) {
      await this.undo();
    }
  }
  /** event at timestamp inclusive */


  async redoUntil(timestamp) {
    while (this.isRedoable && this.eventQueue[this.$].timestamp <= timestamp) {
      await this.redo();
    }
  }

  async setIndex($) {
    if ($ < this.$) await this.undoUntil(this.eventQueue[$].timestamp);else if ($ > this.$) await this.redoUntil(this.eventQueue[$ - 1].timestamp);
  }

  getSyncData() {
    const {
      $,
      saveTime,
      eventQueue
    } = this;
    return {
      $,
      saveTime,
      eventQueue
    };
  }

  async syncData(data) {
    this.saveTime = data.saveTime;

    for (let i = 0; i < this.eventQueue.length; i++) {
      var _data$eventQueue$i;

      const {
        timestamp
      } = this.eventQueue[i];

      if (timestamp !== ((_data$eventQueue$i = data.eventQueue[i]) === null || _data$eventQueue$i === void 0 ? void 0 : _data$eventQueue$i.timestamp)) {
        await this.undoUntil(timestamp);
        break;
      }
    }

    this.eventQueue = data.eventQueue;
    await this.setIndex(data.$);
  }

}

/***/ }),

/***/ "./src/core/file/PersistentProjectFile.ts":
/*!************************************************!*\
  !*** ./src/core/file/PersistentProjectFile.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PersistentProjectFile)
/* harmony export */ });
/* harmony import */ var _AbstractProjectFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractProjectFile */ "./src/core/file/AbstractProjectFile.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class PersistentProjectFile extends _AbstractProjectFile__WEBPACK_IMPORTED_MODULE_0__.default {
  get sab() {
    return this._sab;
  }

  get data() {
    return this._data;
  }

  set data(dataIn) {
    this._data = dataIn;

    if (dataIn instanceof SharedArrayBuffer) {
      this._sab = dataIn;
      return;
    }

    this._sab = new SharedArrayBuffer(dataIn.byteLength);
    const ui8ab = new Uint8Array(dataIn);
    const ui8sab = new Uint8Array(this._sab);

    for (let i = 0; i < ui8ab.length; i++) {
      ui8sab[i] = ui8ab[i];
    }
  }

  constructor(fileMgrIn, parentIn, nameIn, dataIn) {
    super(fileMgrIn, parentIn, nameIn);

    _defineProperty(this, "_sab", void 0);

    _defineProperty(this, "lastModifiedId", void 0);

    this.lastModifiedId = this.id;
    this._data = dataIn;
  }

  async init() {
    this.id = this.fileMgr.generateItemId(this);
    if (!this.data) this.data = await this.fileMgr.readFile(this.path);
    await this.emit("ready");
    await this.fileMgr.emitChanged();
  }

  clone() {
    let parentIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.parent;
    let nameIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._name;
    let dataIn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.data;
    const Ctor = this.constructor;
    return new Ctor(this._fileMgr, parentIn, nameIn, dataIn);
  }

  async save(newData, by) {
    this.data = newData;
    this.lastModifiedId = this.fileMgr.generateItemId(this);
    await this._fileMgr.putFile(this);
    await this.emit("saved", by);
    await this.fileMgr.emitChanged();
  }

  async saveAsCopy(parent, name, newData) {
    const item = this.clone(parent, name, newData);
    await this._fileMgr.putFile(item);
    parent.items.add(item);
    await this.emitTreeChanged();
    await this.fileMgr.emitChanged();
    return item;
  }

  async saveAs(to, newName, newData, by) {
    const {
      parent,
      name,
      data
    } = this;
    const from = parent;
    this.data = newData;
    this.lastModifiedId = this.fileMgr.generateItemId(this);
    await this.move(to, newName);
    await this._fileMgr.putFile(this);
    const item = this.clone(parent, name, data);
    await this._fileMgr.putFile(item);
    parent.items.add(item);
    await parent.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", {
      from: from.path,
      to: to.path
    });
    await this.emit("saved", by);
    await this.fileMgr.emitChanged();
    return item;
  }

  async rename(newNameIn) {
    const newName = newNameIn.trim();
    const oldName = this._name;
    if (newName === oldName) return;
    if (this.parent.existItem(newNameIn)) throw new Error("".concat(newName, " already exists."));
    await this.fileMgr.rename(this.path, "".concat(this.parentPath, "/").concat(newNameIn));
    this._name = newName;
    await this.emitTreeChanged();
    await this.emit("nameChanged", {
      oldName,
      newName
    });
    await this.fileMgr.emitChanged();
  }

  async move(to) {
    let newName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.name;
    if (to === this) return;
    if (to === this.parent && newName === this.name) return;
    if (to.existItem(newName)) throw new Error("".concat(newName, " already exists in ").concat(to.name));
    await this._fileMgr.rename(this.path, "".concat(to.path, "/").concat(newName));
    const from = this.parent;
    from.items.delete(this);
    this.parent = to;
    const oldName = this._name;
    this._name = newName;
    this.parent.items.add(this);
    await from.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", {
      from: from.path,
      to: to.path
    });
    if (oldName !== newName) await this.emit("nameChanged", {
      oldName,
      newName
    });
    await this.fileMgr.emitChanged();
  }

  async destroy() {
    await this._fileMgr.remove(this.path, this.isFolder);
    this.parent.items.delete(this);
    await this.emitTreeChanged();
    await this.emit("destroyed");
    await this.fileMgr.emitChanged();
  }

  async instantiate(_ref) {
    let {
      env,
      project,
      instanceId
    } = _ref;
    const {
      type
    } = this;
    const Constructor = {
      patcher: (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../patcher/Patcher */ "./src/core/patcher/Patcher.ts"))).default,
      audio: (await __webpack_require__.e(/*! import() */ "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../audio/PatcherAudio */ "./src/core/audio/PatcherAudio.ts"))).default,
      image: (await __webpack_require__.e(/*! import() */ "src_core_image_PatcherImage_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../image/PatcherImage */ "./src/core/image/PatcherImage.ts"))).default,
      text: (await __webpack_require__.e(/*! import() */ "src_core_text_PatcherText_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../text/PatcherText */ "./src/core/text/PatcherText.ts"))).default,
      video: undefined,
      unknown: (await __webpack_require__.e(/*! import() */ "src_core_text_PatcherText_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../text/PatcherText */ "./src/core/text/PatcherText.ts"))).default
    }[type];
    if (Constructor) return Constructor.fromProjectItem({
      file: this,
      env,
      project,
      instanceId
    });
    throw new Error("Not implemented.");
  }

  async instantiateEditor(_ref2) {
    let {
      env,
      project,
      instanceId
    } = _ref2;
    const {
      type
    } = this;
    const Constructor = {
      patcher: (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../patcher/PatcherEditor */ "./src/core/patcher/PatcherEditor.ts"))).default,
      audio: (await __webpack_require__.e(/*! import() */ "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../audio/AudioEditor */ "./src/core/audio/AudioEditor.ts"))).default,
      image: (await __webpack_require__.e(/*! import() */ "src_core_image_ImageEditor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../image/ImageEditor */ "./src/core/image/ImageEditor.ts"))).default,
      text: (await __webpack_require__.e(/*! import() */ "src_core_text_TextEditor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../text/TextEditor */ "./src/core/text/TextEditor.ts"))).default,
      video: undefined,
      unknown: (await __webpack_require__.e(/*! import() */ "src_core_text_TextEditor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../text/TextEditor */ "./src/core/text/TextEditor.ts"))).default
    }[type];
    if (Constructor) return Constructor.fromProjectItem({
      file: this,
      env,
      project,
      instanceId
    });
    throw new Error("Not implemented.");
  }

}

/***/ }),

/***/ "./src/core/file/PersistentProjectFolder.ts":
/*!**************************************************!*\
  !*** ./src/core/file/PersistentProjectFolder.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PersistentProjectFolder)
/* harmony export */ });
/* harmony import */ var _PersistentProjectFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PersistentProjectFile */ "./src/core/file/PersistentProjectFile.ts");
/* harmony import */ var _AbstractProjectFolder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractProjectFolder */ "./src/core/file/AbstractProjectFolder.ts");


class PersistentProjectFolder extends _AbstractProjectFolder__WEBPACK_IMPORTED_MODULE_1__.default {
  async init() {
    this.id = this.fileMgr.generateItemId(this);
    const items = await this.fileMgr.readDir(this.path || "/");

    for (const rawItem of items) {
      const {
        name,
        isFolder
      } = rawItem;
      const item = this.createProjectItem(name, isFolder);
      this.items.add(item);
      await this.emitTreeChanged();
      await item.init();
    }

    await this.emit("ready");
    await this.fileMgr.emitChanged();
  }

  clone() {
    let parentIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.parent;
    let nameIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._name;
    const Ctor = this.constructor;
    return new Ctor(this._fileMgr, parentIn, nameIn);
  }

  createProjectItem(nameIn, isFolder, dataIn) {
    if (isFolder) return new PersistentProjectFolder(this.fileMgr, this, nameIn);
    return new _PersistentProjectFile__WEBPACK_IMPORTED_MODULE_0__.default(this.fileMgr, this, nameIn, dataIn);
  }

  async addFile(nameIn, dataIn) {
    if (this.existItem(nameIn)) throw new Error("".concat(nameIn, " already exists."));
    const tempItem = new _PersistentProjectFile__WEBPACK_IMPORTED_MODULE_0__.default(this.fileMgr, this, nameIn, dataIn);
    await this.fileMgr.putFile(tempItem);
    const fileDetail = await this.fileMgr.getFileDetails(this.path, nameIn);
    const item = this.createProjectItem(nameIn, fileDetail.isFolder, dataIn);
    this.items.add(item);
    await this.emitTreeChanged();
    item.init();
    return item;
  }

  async addFolder(name) {
    if (this.existItem(name)) throw new Error("".concat(name, " already exists."));
    const folder = new PersistentProjectFolder(this.fileMgr, this, name);
    await this.fileMgr.putFile(folder);
    this.items.add(folder);
    await folder.init();
    await this.emitTreeChanged();
    return folder;
  }

  async rename(newNameIn) {
    const newName = newNameIn.trim();
    const oldName = this._name;
    if (newName === oldName) return;
    if (this.parent.existItem(newNameIn)) throw new Error("".concat(newName, " already exists."));
    await this.fileMgr.rename(this.path, "".concat(this.parentPath, "/").concat(newNameIn));
    this._name = newName;
    await this.emitTreeChanged();
    await this.emit("nameChanged", {
      oldName,
      newName
    });
  }

  async move(to) {
    let newName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.name;
    if (to === this) return;
    if (to === this.parent && newName === this.name) return;
    if (to.existItem(newName)) throw new Error("".concat(newName, " already exists in ").concat(to.name));
    await this._fileMgr.rename(this.path, "".concat(to.path, "/").concat(newName));
    const from = this.parent;
    from.items.delete(this);
    this.parent = to;
    const oldName = this._name;
    this._name = newName;
    this.parent.items.add(this);
    await from.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", {
      from: from.path,
      to: to.path
    });
    if (oldName !== newName) await this.emit("nameChanged", {
      oldName,
      newName
    });
  }

  async destroy() {
    await this._fileMgr.remove(this.path, this.isFolder);
    this.parent.items.delete(this);
    await this.emitTreeChanged();
    await this.emit("destroyed");
  }

}

/***/ }),

/***/ "./src/core/file/TempData.ts":
/*!***********************************!*\
  !*** ./src/core/file/TempData.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TempData)
/* harmony export */ });
/* harmony import */ var _TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemporaryProjectFile */ "./src/core/file/TemporaryProjectFile.ts");

class TempData extends _TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_0__.default {
  get type() {
    return "unknown";
  }

  async instantiate() {
    return this.data;
  }

}

/***/ }),

/***/ "./src/core/file/TemporaryProjectFile.ts":
/*!***********************************************!*\
  !*** ./src/core/file/TemporaryProjectFile.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TemporaryProjectFile)
/* harmony export */ });
/* harmony import */ var _AbstractProjectFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractProjectFile */ "./src/core/file/AbstractProjectFile.ts");
/* harmony import */ var _PersistentProjectFile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PersistentProjectFile */ "./src/core/file/PersistentProjectFile.ts");



/**
 * An item under TempMgr, this contains in-memory data/instance.
 */
class TemporaryProjectFile extends _AbstractProjectFile__WEBPACK_IMPORTED_MODULE_0__.default {
  async removeObserver(observer) {
    await super.removeObserver(observer);
    await this.fileMgr.emitChanged();
    if (this._observers.size === 0) await this.destroy();
  }
  /**
   * Creating alias (do not copy the data, new item has the same ref)
   */


  clone() {
    let parentIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.parent;
    let nameIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._name;
    let dataIn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.data;
    const Ctor = this.constructor;
    return new Ctor(this._fileMgr, parentIn, nameIn, dataIn);
  }

  async rename(newNameIn) {
    const newName = newNameIn.trim();
    const oldName = this._name;
    if (newName === oldName) return;
    if (this.parent.existItem(newNameIn)) throw new Error("".concat(newName, " already exists."));
    this._name = newName;
    await this.emitTreeChanged();
    await this.emit("nameChanged", {
      oldName,
      newName
    });
    await this.fileMgr.emitChanged();
  }

  async move(to) {
    let newName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.name;
    if (to === this) return;
    if (to === this.parent) return;
    if (to.existItem(newName)) throw new Error("".concat(newName, " already exists in ").concat(to.name));
    const from = this.parent;
    from.items.delete(this);
    this.parent = to;
    const oldName = this._name;
    this._name = newName;
    this.parent.items.add(this);
    await from.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", {
      from: from.path,
      to: to.path
    });
    if (oldName !== newName) await this.emit("nameChanged", {
      oldName,
      newName
    });
    await this.fileMgr.emitChanged();
  }

  async destroy() {
    this.parent.items.delete(this);
    await this.emitTreeChanged();
    await this.emit("destroyed");
    await this.fileMgr.emitChanged();
  }

  async save(newData, by) {
    this._data = newData;
    this.emit("saved", by);
    await this.fileMgr.emitChanged();
  }

  async saveAsCopy(parent, name, newData, persistentMgr) {
    const item = new _PersistentProjectFile__WEBPACK_IMPORTED_MODULE_1__.default(persistentMgr, parent, name, newData);
    await persistentMgr.putFile(item);
    parent.items.add(item);
    await this.emitTreeChanged();
    await item.init();
    return item;
  }

  async saveAs(to, name, newData, by, persistentMgr) {
    const item = new _PersistentProjectFile__WEBPACK_IMPORTED_MODULE_1__.default(persistentMgr, to, name, newData);
    await persistentMgr.putFile(item);
    const from = this.parent;
    this.parent = to;
    this._name = name;

    const _this = Object.setPrototypeOf(this, _PersistentProjectFile__WEBPACK_IMPORTED_MODULE_1__.default.prototype);

    this.parent.items.add(_this);
    await this.emitTreeChanged();
    await this.emit("pathChanged", {
      from: from.path,
      to: to.path
    });
    await this.emit("saved", by);
    await item.init();
    return this;
  }

  async instantiate(options) {
    throw new Error("Not implemented."); // new instance Patcher / AudioBuffer etc
  }

  async instantiateEditor(options) {
    throw new Error("Not implemented.");
  }

}

/***/ }),

/***/ "./src/core/file/TemporaryProjectFolder.ts":
/*!*************************************************!*\
  !*** ./src/core/file/TemporaryProjectFolder.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TemporaryProjectFolder)
/* harmony export */ });
/* harmony import */ var _audio_TempAudioFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../audio/TempAudioFile */ "./src/core/audio/TempAudioFile.ts");
/* harmony import */ var _patcher_TempPatcherFile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../patcher/TempPatcherFile */ "./src/core/patcher/TempPatcherFile.ts");
/* harmony import */ var _text_TempTextFile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../text/TempTextFile */ "./src/core/text/TempTextFile.ts");
/* harmony import */ var _TempData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TempData */ "./src/core/file/TempData.ts");
/* harmony import */ var _AbstractProjectFolder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AbstractProjectFolder */ "./src/core/file/AbstractProjectFolder.ts");





class TemporaryProjectFolder extends _AbstractProjectFolder__WEBPACK_IMPORTED_MODULE_4__.default {
  async init() {
    this.id = this.fileMgr.generateItemId(this);
    await this.emit("ready");
  }

  clone() {
    let parentIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.parent;
    let nameIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._name;
    const Ctor = this.constructor;
    return new Ctor(this._fileMgr, parentIn, nameIn);
  }

  createProjectItem(name, isFolder, data, typeIn) {
    const type = typeIn || this.fileMgr.getTypeFromFileName(name);
    if (type === "patcher") return new _patcher_TempPatcherFile__WEBPACK_IMPORTED_MODULE_1__.default(this.fileMgr, this, name, data);
    if (type === "audio") return new _audio_TempAudioFile__WEBPACK_IMPORTED_MODULE_0__.default(this.fileMgr, this, name, data);
    if (type === "text") return new _text_TempTextFile__WEBPACK_IMPORTED_MODULE_2__.default(this.fileMgr, this, name, data);
    return new _TempData__WEBPACK_IMPORTED_MODULE_3__.default(this.fileMgr, this, name, data);
  }

  async addFile(name, data, typeIn) {
    if (this.existItem(name)) throw new Error("".concat(name, " already exists."));
    const item = this.createProjectItem(name, false, data, typeIn);
    this.items.add(item);
    await this.emitTreeChanged();
    await item.init();
    return item;
  }

  async addFolder(name) {
    if (this.existItem(name)) throw new Error("".concat(name, " already exists."));
    const folder = new TemporaryProjectFolder(this.fileMgr, this, name);
    this.items.add(folder);
    await folder.init();
    await this.emitTreeChanged();
    await this.fileMgr.emitChanged();
    return folder;
  }

  async rename(newNameIn) {
    const newName = newNameIn.trim();
    const oldName = this._name;
    if (newName === oldName) return;
    if (this.parent.existItem(newNameIn)) throw new Error("".concat(newName, " already exists."));
    this._name = newName;
    await this.emitTreeChanged();
    await this.emit("nameChanged", {
      oldName,
      newName
    });
    await this.fileMgr.emitChanged();
  }

  async move(to) {
    let newName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.name;
    if (to === this) return;
    if (to === this.parent) return;
    if (to.existItem(newName)) throw new Error("".concat(newName, " already exists in ").concat(to.name));
    const from = this.parent;
    from.items.delete(this);
    this.parent = to;
    const oldName = this._name;
    this._name = newName;
    this.parent.items.add(this);
    await from.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", {
      from: from.path,
      to: to.path
    });
    if (oldName !== newName) await this.emit("nameChanged", {
      oldName,
      newName
    });
    await this.fileMgr.emitChanged();
  }

  async destroy() {
    this.parent.items.delete(this);
    await this.emitTreeChanged();
    await this.emit("destroyed");
    await this.fileMgr.emitChanged();
  }

}

/***/ }),

/***/ "./src/core/file/TemporaryProjectItemManager.ts":
/*!******************************************************!*\
  !*** ./src/core/file/TemporaryProjectItemManager.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TemporaryProjectItemManager)
/* harmony export */ });
/* harmony import */ var _TemporaryProjectFolder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemporaryProjectFolder */ "./src/core/file/TemporaryProjectFolder.ts");
/* harmony import */ var _AbstractProjectItemManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractProjectItemManager */ "./src/core/file/AbstractProjectItemManager.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class TemporaryProjectItemManager extends _AbstractProjectItemManager__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "root", void 0);
  }

  async empty() {
    return true;
  }

  async init(clean) {
    this.root = new _TemporaryProjectFolder__WEBPACK_IMPORTED_MODULE_0__.default(this, null, null);
    await this.root.init();
    this.emit("ready");
    return this;
  }

  getProjectItemFromPath(path) {
    const pathArray = path.split("/");
    const itemArray = [this.root];

    for (let i = 0; i < pathArray.length; i++) {
      const id = pathArray[i];
      if (id.length === 0) continue;
      if (id === ".") continue;

      if (id === "..") {
        itemArray.pop();
        continue;
      }

      const cur = itemArray[itemArray.length - 1];
      if (cur.isFolder === false) throw new Error("".concat(cur.name, " from path ").concat(path, " is not a folder"));
      const next = cur.findItem(id);
      if (!next) throw new Error("Cannot find ".concat(id, " from path ").concat(path));
      itemArray.push(next);
    }

    return itemArray[itemArray.length - 1];
  }

}

/***/ }),

/***/ "./src/core/file/WorkletProjectItemManager.ts":
/*!****************************************************!*\
  !*** ./src/core/file/WorkletProjectItemManager.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkletProjectItemManager)
/* harmony export */ });
/* harmony import */ var _AbstractProjectItemManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractProjectItemManager */ "./src/core/file/AbstractProjectItemManager.ts");
/* harmony import */ var _PersistentProjectFolder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PersistentProjectFolder */ "./src/core/file/PersistentProjectFolder.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class WorkletProjectItemManager extends _AbstractProjectItemManager__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(envIn) {
    super(envIn);

    _defineProperty(this, "port", void 0);

    _defineProperty(this, "env", void 0);

    _defineProperty(this, "cachedPathIdMap", {});

    _defineProperty(this, "disabled", false);

    this.env = envIn;
  }

  empty() {
    throw new Error("Empty is not allowed from other threads.");
  }

  async init() {
    this.cachedPathIdMap = await this.env.fileMgrGetPathIdMap();
    this.root = new _PersistentProjectFolder__WEBPACK_IMPORTED_MODULE_1__.default(this, null, null);
    await this.root.init();
    if (!this.projectRoot) await this.root.addFolder(this.projectFolderName);
    this.emit("ready");
    return this;
  }

  getDataForDiff() {
    const map = {};
    const {
      allItems
    } = this;

    for (const id in allItems) {
      var _item$parent, _item$parent2;

      const item = allItems[id];
      if (item.isFolder === true) map[id] = {
        isFolder: item.isFolder,
        parent: (_item$parent = item.parent) === null || _item$parent === void 0 ? void 0 : _item$parent.id,
        name: item.name,
        path: item.path
      };else map[id] = {
        isFolder: item.isFolder,
        data: item.sab,
        lastModifiedId: item.lastModifiedId,
        parent: (_item$parent2 = item.parent) === null || _item$parent2 === void 0 ? void 0 : _item$parent2.id,
        name: item.name,
        path: item.path
      };
    }

    return map;
  }

  async processDiff(diff) {
    this.disabled = true;

    for (const id in diff) {
      const process = async id => {
        const $item = diff[id];
        const $parentId = $item.parent;
        if (!$parentId) return;
        let parent = this.getProjectItemFromId($parentId);
        if (!parent) await process($parentId);
        parent = this.getProjectItemFromId($parentId);
        const current = this.getProjectItemFromId(id);

        if (!current) {
          if (parent.isFolder === true) {
            this.cachedPathIdMap[$item.path] = id;

            if ($item.isFolder === true) {
              await parent.addFolder($item.name);
            } else {
              const newFile = await parent.addFile($item.name, $item.data);
              newFile.lastModifiedId = $item.lastModifiedId;
            }
          }
        } else {
          if (current.isFolder === false && $item.isFolder === false) {
            var _current$parent;

            if (current.lastModifiedId !== $item.lastModifiedId) await current.save($item.data, this);
            if (current.name !== $item.name) await current.rename($item.name);
            if (((_current$parent = current.parent) === null || _current$parent === void 0 ? void 0 : _current$parent.id) !== $item.parent) await current.move(parent);
          }
        }
      };

      await process(id);
    }

    this.disabled = false;
  }

  generateItemId(item) {
    const id = this.cachedPathIdMap[item.path];
    if (!id) return this.env.generateId(item);
    delete this.cachedPathIdMap[item.path];
    return id;
  }

  readFile(path) {
    return this.env.fileMgrReadFile(path);
  }

  readDir(path) {
    return this.env.fileMgrReadDir(path);
  }

  getFileDetails(path, name) {
    return this.env.fileMgrGetFileDetails(path, name);
  }

  exists(path) {
    return this.env.fileMgrExists(path);
  }

  putFile(item) {
    if (this.disabled) return null;
    return this.env.fileMgrPutFile(item);
  }

  async writeFile(path, data) {
    if (this.disabled) return null;
    return this.env.fileMgrWriteFile(path, data);
  }

  async remove(path, isFolder) {
    return true;
  }

  async rename(oldPath, newPath) {
    return true;
  }

  importFileZip(data, subfolder, to, taskHost) {
    throw new Error("Import is not allowed from other threads.");
  }

  exportProjectZip() {
    throw new Error("Import is not allowed from other threads.");
  }

}

/***/ }),

/***/ "./src/core/objects/base/AbstractObject.ts":
/*!*************************************************!*\
  !*** ./src/core/objects/base/AbstractObject.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isJSPatcherObjectConstructor": () => (/* binding */ isJSPatcherObjectConstructor),
/* harmony export */   "isJSPatcherObject": () => (/* binding */ isJSPatcherObject),
/* harmony export */   "default": () => (/* binding */ AbstractObject)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _patcher_Line__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../patcher/Line */ "./src/core/patcher/Line.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




const isJSPatcherObjectConstructor = x => typeof x === "function" && (x === null || x === void 0 ? void 0 : x.isJSPatcherObjectConstructor);
const isJSPatcherObject = x => typeof x === "object" && (x === null || x === void 0 ? void 0 : x.isJSPatcherObject);
class AbstractObject extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  static get _name() {
    return this.name;
  }

  static get meta() {
    return {
      package: this.package,
      // div will have class "package-name" "package-name-objectname"
      name: this._name,
      icon: this.icon,
      // semantic icon to display in UI
      author: this.author,
      version: this.version,
      description: this.description,
      inlets: this.inlets,
      outlets: this.outlets,
      args: this.args,
      props: this.props,
      isPatcherInlet: this.isPatcherInlet,
      isPatcherOutlet: this.isPatcherOutlet
    };
  }

  get class() {
    return this.constructor.name;
  }

  get patcher() {
    return this._patcher;
  }

  get Patcher() {
    return this._patcher.constructor;
  }

  get box() {
    return this._box;
  }

  get env() {
    return this.patcher.env;
  }

  get audioCtx() {
    return this.patcher.audioCtx;
  }

  get meta() {
    return this._meta;
  }

  setMeta(metaIn) {
    const oldMeta = _objectSpread({}, this.meta);

    this._meta = Object.assign(this.meta, metaIn);
    this.emit("metaUpdated", {
      oldMeta,
      meta: _objectSpread({}, this.meta)
    });
  }

  get data() {
    return this._box.data;
  }

  setData(dataIn) {
    const oldData = _objectSpread({}, this._box.data);

    this._box.data = Object.assign(this.data, dataIn);
    this.emit("dataUpdated", {
      oldData,
      data: _objectSpread({}, this.data)
    });
  }

  get props() {
    const props = {};

    for (const key in this.meta.props) {
      props[key] = this.getProp(key);
    }

    return props;
  }

  getProp(key) {
    if (key === "rect") return this.box.rect;
    if (key === "presentationRect") return this.box.presentationRect;
    if (key === "background") return this.box.background;
    if (key === "presentation") return this.box.presentation;
    return typeof this.box.props[key] === "undefined" ? this.meta.props[key].default : this.box.props[key];
  }

  get args() {
    return this.box.args;
  }

  get inlets() {
    return this._box.inlets;
  }

  set inlets(i) {
    this._box.setInlets(i);
  }

  get outlets() {
    return this._box.outlets;
  }

  set outlets(i) {
    this._box.setOutlets(i);
  }

  get outletLines() {
    return this._box.outletLines;
  }

  get inletLines() {
    return this._box.inletLines;
  }

  constructor(box, patcher) {
    super(); // line connected = metaChange event subscribed
    // patcher object outside, use _ for prevent recursive stringify

    _defineProperty(this, "isJSPatcherObject", true);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "_patcher", void 0);

    _defineProperty(this, "_box", void 0);

    _defineProperty(this, "_meta", this.constructor.meta);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "setState", stateIn => {
      const oldState = _objectSpread({}, this.state);

      this.state = Object.assign(this.state, stateIn);
      this.emit("stateUpdated", {
        oldState,
        state: _objectSpread({}, this.state)
      });
    });

    _defineProperty(this, "setProps", propsIn => {
      const keys = Object.keys(propsIn);

      const oldProps = _objectSpread({}, this.props);

      this.box.update({
        props: propsIn
      });

      const props = _objectSpread({}, this.props);

      for (const key in oldProps) {
        if (keys.indexOf(key) === -1) {
          delete oldProps[key];
          delete props[key];
        }
      }

      this.emit("propsUpdated", {
        oldProps,
        props
      });
    });

    _defineProperty(this, "setArgs", args => {
      const oldArgs = this.args.slice();
      this.box.update({
        args
      });
      this.emit("argsUpdated", {
        oldArgs,
        args: this.args.slice()
      });
    });

    _defineProperty(this, "inletAudioConnections", []);

    _defineProperty(this, "outletAudioConnections", []);

    this._patcher = patcher; // the box which create this instance, use _ for prevent recursive stringify

    this._box = box;
    this.id = this.env.generateId(this);
  }

  async init() {
    // process args and props
    this.subscribe();
    await this.emit("preInit");
  }

  async postInit() {
    await this.emit("postInit");
  }
  /** Do everything here */


  subscribe() {}

  updateUI(state) {
    this.emit("updateUI", state);
  }

  async updateArgs(args, options) {
    if (args !== null && args !== void 0 && args.length) {
      const oldArgs = this.args.slice();
      await this.emit("updateArgs", args);
      if (options !== null && options !== void 0 && options.undoable) this.undoable({
        oldArgs,
        args: this.args.slice()
      });
    }
  }

  async updateProps(propsIn, options) {
    if (propsIn && Object.keys(propsIn).length) {
      const keys = Object.keys(propsIn);

      const oldProps = _objectSpread({}, this.props);

      await this.emit("updateProps", propsIn);

      const props = _objectSpread({}, this.props);

      for (const key in oldProps) {
        if (keys.indexOf(key) === -1) {
          delete oldProps[key];
          delete props[key];
        }
      }

      if (options !== null && options !== void 0 && options.undoable) this.undoable({
        oldProps,
        props
      });
    }
  }

  async updateState(state, options) {
    if (state && Object.keys(state).length) {
      const oldState = _objectSpread({}, this.state);

      await this.emit("updateState", state);
      if (options !== null && options !== void 0 && options.undoable) this.undoable({
        oldState,
        state: _objectSpread({}, this.state)
      });
    }
  }

  fn(inlet, data) {
    if (inlet === 0) {
      // allow change props via first inlet with an props object
      if (data !== null && typeof data === "object") {
        const propsInKeys = Object.keys(data);
        const propsKeys = Object.keys(this.meta.props);

        if (propsInKeys.length && propsInKeys.every(k => propsKeys.indexOf(k) !== -1)) {
          this.updateProps(data);
          return;
        }
      }
    }

    this.emit("inlet", {
      data,
      inlet
    });
  }

  outlet(outlet, data) {
    if (outlet >= this.outlets) return;
    Array.from(this.outletLines[outlet]).sort(_patcher_Line__WEBPACK_IMPORTED_MODULE_2__.default.compare).map(line => line.pass(data));
  }

  outletAll(outputs) {
    for (let i = outputs.length - 1; i >= 0; i--) {
      if (i in outputs) this.outlet(i, outputs[i]);
    }
  }

  undoable(e) {
    this.box.undoable(e);
  }

  async destroy() {
    await this.emit("destroy");
  }

  connectedOutlet(outlet, destBoxId, destInlet, lineId) {
    this.emit("connectedOutlet", {
      outlet,
      destBoxId,
      destInlet,
      lineId
    });
  }

  connectedInlet(inlet, srcBoxId, srcOutlet, lineId) {
    this.emit("connectedInlet", {
      inlet,
      srcBoxId,
      srcOutlet,
      lineId
    });
  }

  disconnectedOutlet(outlet, destBoxId, destInlet, lineId) {
    this.emit("disconnectedOutlet", {
      outlet,
      destBoxId,
      destInlet,
      lineId
    });
  }

  disconnectedInlet(inlet, srcBoxId, srcOutlet, lineId) {
    this.emit("disconnectedInlet", {
      inlet,
      srcBoxId,
      srcOutlet,
      lineId
    });
  }

  post(data) {
    this._patcher.newLog("none", this.meta.name, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.stringifyError)(data), this._box);
  }

  error(data) {
    const s = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.stringifyError)(data);

    this._patcher.newLog("error", this.meta.name, s, this._box);

    this._box.error(s);
  }

  info(data) {
    this._patcher.newLog("info", this.meta.name, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.stringifyError)(data), this._box);
  }

  warn(data) {
    this._patcher.newLog("warn", this.meta.name, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.stringifyError)(data), this._box);
  }

  highlight() {
    this._box.highlight();
  }

  connectAudio() {
    this.box.allLines.forEach(line => line.enable());
  }

  connectAudioInlet(portIn) {
    this.inletLines.forEach((lines, port) => {
      if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.enable());
    });
  }

  connectAudioOutlet(portIn) {
    this.outletLines.forEach((lines, port) => {
      if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.enable());
    });
  }

  disconnectAudio() {
    this.box.allLines.forEach(line => line.disable());
  }

  disconnectAudioInlet(portIn) {
    this.inletLines.forEach((lines, port) => {
      if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.disable());
    });
  }

  disconnectAudioOutlet(portIn) {
    this.outletLines.forEach((lines, port) => {
      if (typeof portIn === "undefined" || port === portIn) lines.forEach(line => line.disable());
    });
  }

  applyBPF(param, bpf) {
    const {
      audioCtx
    } = this;
    const {
      currentTime
    } = audioCtx;
    param.cancelScheduledValues(currentTime);
    param.setValueAtTime(param.value, currentTime);
    let t = 0;
    bpf.forEach(a => {
      if (a.length === 1) {
        param.setValueAtTime(a[0], currentTime + t);
      } else if (a.length > 1) {
        t += a[1];
        param.linearRampToValueAtTime(a[0], currentTime + t);
      }
    });
  }

  async getSharedItem() {
    let id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.box.id;
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "unknown";
    let data = arguments.length > 2 ? arguments[2] : undefined;
    let onceCreate = arguments.length > 3 ? arguments[3] : undefined;
    let item;
    let newItem = false;
    const {
      fileMgr,
      tempMgr
    } = this.patcher.env;

    try {
      item = fileMgr.getProjectItemFromPath(id);
    } catch (_unused) {
      try {
        item = tempMgr.getProjectItemFromPath(id);
      } catch (_unused2) {
        if (data) {
          const d = await data();

          try {
            item = await tempMgr.root.addFile(id, d, type);
            newItem = true;
          } catch (_unused3) {
            item = tempMgr.getProjectItemFromPath(id);
          }
        } else {
          if (onceCreate) {
            const off = () => {
              fileMgr.off("treeChanged", handleFileMgrTreeChanged);
              tempMgr.off("treeChanged", handleTempMgrTreeChanged);
            };

            const handleFileMgrTreeChanged = () => {
              try {
                item = fileMgr.getProjectItemFromPath(id);
                off();
                onceCreate(item);
              } catch (_unused4) {}
            };

            const handleTempMgrTreeChanged = () => {
              try {
                item = tempMgr.getProjectItemFromPath(id);
                off();
                onceCreate(item);
              } catch (_unused5) {}
            };

            fileMgr.on("treeChanged", handleFileMgrTreeChanged);
            tempMgr.on("treeChanged", handleTempMgrTreeChanged);
            return {
              id,
              item: null,
              newItem,
              off
            };
          }

          return {
            id,
            item: null,
            newItem
          };
        }
      }
    }

    if (item.type !== type) throw new Error("Getting shared item ".concat(id, ", but returned item is of type ").concat(item.type, ", not of type ").concat(type, "."));
    return {
      id,
      item,
      newItem
    };
  }

}

_defineProperty(AbstractObject, "isJSPatcherObjectConstructor", true);

_defineProperty(AbstractObject, "package", "Base");

_defineProperty(AbstractObject, "icon", null);

_defineProperty(AbstractObject, "author", "");

_defineProperty(AbstractObject, "version", "0.0.0");

_defineProperty(AbstractObject, "description", "");

_defineProperty(AbstractObject, "inlets", []);

_defineProperty(AbstractObject, "outlets", []);

_defineProperty(AbstractObject, "args", []);

_defineProperty(AbstractObject, "props", {});

_defineProperty(AbstractObject, "isPatcherInlet", false);

_defineProperty(AbstractObject, "isPatcherOutlet", false);

_defineProperty(AbstractObject, "UI", void 0);

/***/ }),

/***/ "./src/core/objects/base/Bang.ts":
/*!***************************************!*\
  !*** ./src/core/objects/base/Bang.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Bang),
/* harmony export */   "isBang": () => (/* binding */ isBang)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Bang {
  constructor() {
    _defineProperty(this, "isBang", true);
  }

  toString() {
    return "bang";
  }

}
const isBang = x => typeof x === "object" && (x === null || x === void 0 ? void 0 : x.isBang);

/***/ }),

/***/ "./src/core/objects/base/BaseObject.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/base/BaseObject.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseObject)
/* harmony export */ });
/* harmony import */ var _AbstractObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractObject */ "./src/core/objects/base/AbstractObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class BaseObject extends _AbstractObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "isUIStateKey", x => this.meta.props[x] && this.meta.props[x].isUIState);

    _defineProperty(this, "updateUIFromProps", props => {
      if (props) {
        const uiState = {};

        for (const key in props) {
          if (this.isUIStateKey(key)) uiState[key] = props[key];
        }

        this.updateUI(uiState);
      }
    });
  }

  static get meta() {
    const thisName = this._name;
    const superMeta = Object.getPrototypeOf(this).meta;
    const superProps = superMeta.props;
    const thisProps = this.props;

    for (const key in thisProps) {
      thisProps[key].group = key in superProps ? superProps[key].group : thisName;
    }

    return {
      package: this.package,
      name: this._name,
      icon: this.icon,
      author: this.author,
      version: this.version,
      description: this.description,
      inlets: [...this.inlets],
      outlets: [...this.outlets],
      args: [...this.args],
      props: _objectSpread(_objectSpread({}, superProps), thisProps),
      isPatcherInlet: this.isPatcherInlet,
      isPatcherOutlet: this.isPatcherOutlet
    };
  }

  subscribe() {
    super.subscribe();
    this.on("metaUpdated", e => this.box.emit("metaUpdated", e));
    this.on("argsUpdated", e => this.box.emit("argsUpdated", e));
    this.on("propsUpdated", e => this.box.emit("propsUpdated", e));
    this.on("dataUpdated", e => this.box.emit("dataUpdated", e));
    this.on("stateUpdated", e => this.box.emit("stateUpdated", e));
    this.on("updateArgs", this.setArgs);
    this.on("updateProps", this.setProps);
    this.on("updateProps", this.updateUIFromProps);
  }

}

_defineProperty(BaseObject, "props", {
  hidden: {
    type: "boolean",
    default: false,
    description: "Hide on lock",
    isUIState: true
  },
  background: {
    type: "boolean",
    default: false,
    description: "Include in background"
  },
  presentation: {
    type: "boolean",
    default: false,
    description: "Include in presentation"
  },
  rect: {
    type: "object",
    default: [0, 0, 90, 20],
    description: "Position and dimensions in patch"
  },
  presentationRect: {
    type: "object",
    default: [0, 0, 90, 20],
    description: "Position and dimensions in presentation"
  },
  ignoreClick: {
    type: "boolean",
    default: false,
    description: "Ignore Click",
    isUIState: true
  },
  hint: {
    type: "string",
    default: "",
    description: "Hint on hover",
    isUIState: true
  }
});

/***/ }),

/***/ "./src/core/objects/base/generateRemotedObject.ts":
/*!********************************************************!*\
  !*** ./src/core/objects/base/generateRemotedObject.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Generate an object that can be used in the AudioWorklet as remoted. */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (O => class RemotedObject extends O {
  get proxy() {
    return this.patcher.state.patcherProcessor;
  }

  subscribe() {
    super.subscribe();

    const handleBoxIoCountChanged = () => {
      var _this$proxy;

      const {
        id,
        inlets,
        outlets
      } = this.box;
      (_this$proxy = this.proxy) === null || _this$proxy === void 0 ? void 0 : _this$proxy.objectEmitFromWorklet(id, "boxIoCountChanged", {
        inlets,
        outlets
      });
    };

    this.box.on("ioCountChanged", handleBoxIoCountChanged);
    this.on("outlet", _ref => {
      let {
        outlet,
        data
      } = _ref;
      return this.outlet(outlet, data);
    });
    this.on("destroy", () => this.box.off("ioCountChanged", handleBoxIoCountChanged));
  }

});

/***/ }),

/***/ "./src/core/objects/base/index.jsdsppkg.aw.ts":
/*!****************************************************!*\
  !*** ./src/core/objects/base/index.jsdsppkg.aw.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../importer/RemotedImporter */ "./src/core/objects/importer/RemotedImporter.ts");
/* harmony import */ var _jsaw_index_jsdsppkg_aw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../jsaw/index.jsdsppkg.aw */ "./src/core/objects/jsaw/index.jsdsppkg.aw.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => _objectSpread({
  BaseObject: _BaseObject__WEBPACK_IMPORTED_MODULE_0__.default,
  EmptyObject: _BaseObject__WEBPACK_IMPORTED_MODULE_0__.default,
  InvalidObject: _BaseObject__WEBPACK_IMPORTED_MODULE_0__.default,
  func: _importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_1__.Func,
  new: _importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_1__.New
}, await (0,_jsaw_index_jsdsppkg_aw__WEBPACK_IMPORTED_MODULE_2__.default)()));

/***/ }),

/***/ "./src/core/objects/globalThis/index.jsdsppkg.ts":
/*!*******************************************************!*\
  !*** ./src/core/objects/globalThis/index.jsdsppkg.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../importer/RemotedImporter */ "./src/core/objects/importer/RemotedImporter.ts");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => _importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_0__.default.import("globalThis", globalThis, true));

/***/ }),

/***/ "./src/core/objects/importer/Func.tsx":
/*!********************************************!*\
  !*** ./src/core/objects/importer/Func.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Func)
/* harmony export */ });
/* harmony import */ var _StaticMethod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StaticMethod */ "./src/core/objects/importer/StaticMethod.ts");
/* harmony import */ var _Method__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Method */ "./src/core/objects/importer/Method.ts");
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class Func extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      Wrapper: null
    });

    _defineProperty(this, "callback", () => this.outlet(0, this.imported));
  }

  subscribe() {
    super.subscribe();
    this.on("postInit", () => {
      this.inlets = 1;
      this.outlets = 1;
      handleUpdateArgs(this.args);
    });

    const handleUpdateArgs = args => {
      if (typeof args[0] !== "undefined") {
        const Wrapper = this.patcher.activeLib[args[0]];
        if (!Wrapper) this.error("Function ".concat(args[0], " not found."));else if (Wrapper.prototype instanceof _StaticMethod__WEBPACK_IMPORTED_MODULE_0__.default || Wrapper.prototype instanceof _Method__WEBPACK_IMPORTED_MODULE_1__.default) {
          this._.Wrapper = Wrapper;
        } else {
          this.error("Given identifier function is not a function");
        }
      } else {
        this.error("A function identifier is needed.");
      }
    };

    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_base_Bang__WEBPACK_IMPORTED_MODULE_3__.isBang)(data)) this.output();
      }
    });
  }

  output() {
    return this.callback();
  }

  set loading(loading) {
    this.updateUI({
      loading
    });
  }

  get name() {
    const c = this._.Wrapper;
    return c.path[c.path.length - 1];
  }

  get imported() {
    const c = this._.Wrapper || this.patcher.activeLib.Object;
    let r;

    try {
      r = c.path.reduce((acc, cur) => acc[cur], c.root);
    } catch (e) {
      this.error(e);
    }

    return r;
  }

  set imported(v) {
    const c = this.constructor;
    let parent = c.root;

    try {
      if (!c.path.length) {
        c.root = v;
      } else {
        c.path.slice(0, -1).forEach(key => parent = parent[key]);
        parent[c.path[c.path.length - 1]] = v;
      }
    } catch (e) {
      this.error(e);
    }
  }

}

_defineProperty(Func, "description", "Get the function itself");

_defineProperty(Func, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Bang to get the function itself"
}]);

_defineProperty(Func, "outlets", [{
  type: "function",
  description: "function"
}]);

_defineProperty(Func, "args", [{
  type: "string",
  optional: false,
  varLength: false,
  description: "Function name"
}]);

/***/ }),

/***/ "./src/core/objects/importer/Getter.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/importer/Getter.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Getter)
/* harmony export */ });
/* harmony import */ var _ImportedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImportedObject */ "./src/core/objects/importer/ImportedObject.tsx");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Getter extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      instance: undefined,
      result: null
    });

    _defineProperty(this, "handlePreInit", () => {
      this.inlets = 1;
      this.outlets = 2;
    });

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this._.instance = data;
        if (this.execute()) this.output();
      }
    });

    _defineProperty(this, "callback", () => this.outletAll([this._.result, this._.instance]));
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", this.handlePreInit);
    this.on("inlet", this.handleInlet);
  }

  execute() {
    try {
      this._.result = this._.instance[this.name];
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

  output() {
    if (this._.result instanceof Promise && !this.getProp("sync")) {
      this.loading = true;

      this._.result.then(r => {
        this.loading = false;
        this._.result = r;
        this.callback();
      }, r => {
        this.loading = false;
        this.error(r);
      });

      return this;
    }

    return this.callback();
  }

  set loading(loading) {
    this.updateUI({
      loading
    });
  }

}

_defineProperty(Getter, "importedObjectType", "Getter");

_defineProperty(Getter, "description", "Auto-imported getter");

_defineProperty(Getter, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Instance to read"
}]);

_defineProperty(Getter, "outlets", [{
  type: "anything",
  description: "Value"
}, {
  type: "anything",
  description: "Instance bypass"
}]);

_defineProperty(Getter, "props", {
  sync: {
    type: "boolean",
    default: false,
    description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
  }
});

/***/ }),

/***/ "./src/core/objects/importer/ImportedObject.tsx":
/*!******************************************************!*\
  !*** ./src/core/objects/importer/ImportedObject.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImportedObject),
/* harmony export */   "AnyImportedObject": () => (/* binding */ AnyImportedObject)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/**
* ```JavaScript
*   class A {
*       static a = {} // A.a
*       static b() {} // A.b
*       static get c() {} // A.c (get)
*       static set d(x) {} // A.d (set)
*       e = {} // Nothing
*       f() {} // A.prototype.f
*       get g() {} // A.prototype.g (get)
*       set h(x) {} // A.prototype.h (set)
*       constructor() {} // A.prototype.constructor
*   }
*   const B = {
*       a: {}, // B.a
*       b() {} // B.b
*   }
*   const C = function() {
*       this.a = null; // C.prototype.constructor
*   }
* ```
*/
class ImportedObject extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  get name() {
    const c = this.constructor;
    return c.path[c.path.length - 1];
  }

  get imported() {
    const c = this.constructor;
    let r;

    try {
      r = c.path.reduce((acc, cur) => acc[cur], c.root);
    } catch (e) {
      this.error(e);
    }

    return r;
  }

  set imported(v) {
    const c = this.constructor;
    let parent = c.root;

    try {
      if (!c.path.length) {
        c.root = v;
      } else {
        c.path.slice(0, -1).forEach(key => parent = parent[key]);
        parent[c.path[c.path.length - 1]] = v;
      }
    } catch (e) {
      this.error(e);
    }
  }

}

_defineProperty(ImportedObject, "importedObjectType", void 0);

_defineProperty(ImportedObject, "root", void 0);

_defineProperty(ImportedObject, "path", void 0);

_defineProperty(ImportedObject, "description", "Auto-imported object");

class AnyImportedObject extends ImportedObject {}

/***/ }),

/***/ "./src/core/objects/importer/Importer.ts":
/*!***********************************************!*\
  !*** ./src/core/objects/importer/Importer.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Importer)
/* harmony export */ });
/* harmony import */ var _utils_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/symbols */ "./src/utils/symbols.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/AbstractObject */ "./src/core/objects/base/AbstractObject.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class Importer {
  static getObject(p, pkgName, root, path) {
    throw new Error("getObject not implemented");
  }
  /*
  static async test() {
      await Importer.importFrom("https://unpkg.com/@tensorflow/tfjs", "tf").then(console.log);
      await Importer.importFrom("https://unpkg.com/three", "THREE").then(console.log);
      await Importer.importFrom("https://unpkg.com/webmidi", "MIDI").then(console.log);
  }
  */


  static writeInPath(pkgIn, pathIn, object) {
    if (pathIn.length === 0) {
      Object.assign(pkgIn, {
        [this.$self]: object
      });
      return;
    }

    const path = pathIn.slice();
    let pkg = pkgIn;

    while (path.length > 1) {
      const key = path.shift();
      if (!pkg[key]) pkg[key] = {};else if ((0,_base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__.isJSPatcherObjectConstructor)(pkg[key])) pkg[key] = {
        [this.$self]: pkg[key]
      };
      pkg = pkg[key];
    }

    pkg[path[0]] = object;
  }
  /**
   * Recursive transform JavaScript object to JSPatcher Package
   *
   * @param {string} pkgName package identifier
   * @param {Record<string, any>} root imported JavaScript object
   * @param {boolean} [all] import non-iterables
   * @param {TPackage} [outIn]
   * @param {string[]} [pathIn]
   * @param {any[]} [stackIn]
   * @param {number} [depthIn]
   */


  static import(pkgName, root, all, outIn, pathIn, stackIn, depthIn) {
    const depth = typeof depthIn === "undefined" ? 0 : depthIn;
    const out = outIn || {};
    const path = pathIn || [];
    const stack = stackIn ? stackIn.slice() : [];
    let o;

    try {
      o = path.reduce((acc, cur) => acc[cur], root);
    } catch (e) {
      return out;
    }

    if (typeof o === "undefined" || o === null || stack.indexOf(o) !== -1 || depth && o === globalThis || o === globalThis.jspatcherEnv) return out; // cyclic object

    stack[depth] = o;
    let props;

    try {
      // mitigate opener.location.href error
      props = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getPropertyDescriptors)(o);
    } catch (e) {
      return out;
    }

    if (path.length === 0) {
      const newObj = this.getObject({
        value: root
      }, pkgName, root, []);
      if (newObj) this.writeInPath(out, [], newObj);
    }

    for (const key in props) {
      if (typeof o === "function" && ["arguments", "caller", "length", "name", "__proto__"].indexOf(key) >= 0) continue;
      if (typeof o === "object" && ["constructor", "__proto__"].indexOf(key) >= 0) continue;
      const prop = props[key];
      const newPath = [...path, key];
      if (!all && !prop.enumerable && key.startsWith("_") && key !== "prototype") continue;
      const newObj = this.getObject(prop, pkgName, root, newPath);
      if (newObj) this.writeInPath(out, newPath.map((s, i) => i !== newPath.length - 1 && s === "prototype" ? "" : s), newObj);
      const value = prop.value;

      if ((typeof value === "object" || typeof value === "function") && value !== null && (value === Array.prototype || !Array.isArray(value))) {
        this.import(pkgName, root, all, out, newPath, stack, depth + 1);
      }
    }

    return out;
  }

}

_defineProperty(Importer, "$self", _utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject);

/***/ }),

/***/ "./src/core/objects/importer/Method.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/importer/Method.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Method)
/* harmony export */ });
/* harmony import */ var _ImportedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImportedObject */ "./src/core/objects/importer/ImportedObject.tsx");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Method extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      instance: undefined,
      inputs: [],
      result: null
    });

    _defineProperty(this, "initialInlets", 1);

    _defineProperty(this, "initialOutlets", 2);

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this._.instance = data;
        if (this.execute()) this.output();
      } else {
        this._.inputs[inlet - 1] = data;
      }
    });

    _defineProperty(this, "callback", () => this.outletAll([this._.result, this._.instance, ...this._.inputs]));
  }

  subscribe() {
    super.subscribe();
    this.on("postInit", () => {
      handleUpdateArgs(this.args);
    });

    const handleUpdateArgs = args => {
      this._.inputs = args.slice();
      const fn = this.imported;
      const argsCount = Math.max(fn.length, args.length, ~~+this.getProp("args"));
      this.inlets = Math.max(1, this.initialInlets + argsCount);
      this.outlets = this.initialOutlets + argsCount;
    };

    this.on("updateArgs", handleUpdateArgs);
    this.on("updateProps", props => {
      if (props.args && typeof props.args === "number" && props.args >= 0) {
        const fn = this.imported;
        const argsCount = Math.max(fn.length, this.box.args.length, ~~props.args);
        this.inlets = Math.max(1, this.initialInlets + argsCount);
        this.outlets = this.initialOutlets + argsCount;
      }
    });
    this.on("inlet", this.handleInlet);
  }

  execute() {
    const fn = this.imported;

    try {
      this._.result = fn.call(this._.instance, ...(this.getProp("spreadArgs") ? this._.inputs.reduce((acc, cur) => [...acc, ...cur], []) : this._.inputs));
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

  output() {
    if (this._.result instanceof Promise && !this.getProp("sync")) {
      this.loading = true;

      this._.result.then(r => {
        this.loading = false;
        this._.result = r;
        this.callback();
      }, r => {
        this.loading = false;
        this.error(r);
      });

      return this;
    }

    return this.callback();
  }

  set loading(loading) {
    this.updateUI({
      loading
    });
  }

}

_defineProperty(Method, "importedObjectType", "Method");

_defineProperty(Method, "description", "Auto-imported method");

_defineProperty(Method, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Instance to read"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Method argument"
}]);

_defineProperty(Method, "outlets", [{
  type: "anything",
  description: "Method return value"
}, {
  type: "anything",
  description: "Instance bypass"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after method called"
}]);

_defineProperty(Method, "args", [{
  type: "anything",
  optional: true,
  varLength: true,
  description: "Set arguments while loaded"
}]);

_defineProperty(Method, "props", {
  args: {
    type: "number",
    default: 0,
    description: "arguments count for method"
  },
  spreadArgs: {
    type: "boolean",
    default: false,
    description: "arguments input will be spreaded if true"
  },
  sync: {
    type: "boolean",
    default: false,
    description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
  }
});

/***/ }),

/***/ "./src/core/objects/importer/New.tsx":
/*!*******************************************!*\
  !*** ./src/core/objects/importer/New.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ New)
/* harmony export */ });
/* harmony import */ var _StaticMethod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StaticMethod */ "./src/core/objects/importer/StaticMethod.ts");
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class New extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      Wrapper: null,
      inputs: [],
      result: null
    });

    _defineProperty(this, "callback", () => this.outletAll([this._.result, ...this._.inputs]));
  }

  subscribe() {
    super.subscribe();
    this.on("postInit", () => {
      handleUpdateArgs(this.args);
    });

    const handleUpdateArgs = args => {
      if (typeof args[0] !== "undefined") {
        const Wrapper = this.patcher.activeLib[args[0]];
        if (!Wrapper) this.error("Function ".concat(args[0], " not found."));else if (Wrapper.prototype instanceof _StaticMethod__WEBPACK_IMPORTED_MODULE_0__.default) {
          this._.Wrapper = Wrapper;
          const Fn = this.imported;
          const argsCount = Math.max(Fn.length, args.length - 1, ~~+this.getProp("args"));
          this.inlets = Math.max(1, argsCount);
          this.outlets = 1 + this.inlets;
        } else {
          this.error("Given function is not constructable");
        }
      } else {
        this.error("A constructor is needed.");
      }

      this._.inputs = args.slice(1);
    };

    this.on("updateArgs", handleUpdateArgs);
    this.on("updateProps", props => {
      if (props.args && typeof props.args === "number" && props.args >= 0) {
        const Fn = this.imported;
        const argsCount = Math.max(Fn.length, this.box.args.length - 1, ~~+props.args);
        this.inlets = Math.max(1, argsCount);
        this.outlets = 1 + this.inlets;
      }
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_2__.isBang)(data)) this._.inputs[inlet] = data;
        if (this.execute()) this.output();
      } else {
        this._.inputs[inlet] = data;
      }
    });
  }

  execute() {
    const Fn = this.imported;

    try {
      this._.result = new Fn(...(this.getProp("spreadArgs") ? this._.inputs.reduce((acc, cur) => [...acc, ...cur], []) : this._.inputs));
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

  output() {
    return this.callback();
  }

  set loading(loading) {
    this.updateUI({
      loading
    });
  }

  get name() {
    const c = this._.Wrapper;
    return c.path[c.path.length - 1];
  }

  get imported() {
    const c = this._.Wrapper || this.patcher.activeLib.Object;
    let r;

    try {
      r = c.path.reduce((acc, cur) => acc[cur], c.root);
    } catch (e) {
      this.error(e);
    }

    return r;
  }

  set imported(v) {
    const c = this.constructor;
    let parent = c.root;

    try {
      if (!c.path.length) {
        c.root = v;
      } else {
        c.path.slice(0, -1).forEach(key => parent = parent[key]);
        parent[c.path[c.path.length - 1]] = v;
      }
    } catch (e) {
      this.error(e);
    }
  }

}

_defineProperty(New, "description", "Call function as a constructor");

_defineProperty(New, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Constructor argument, output instance constructed"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Constructor argument"
}]);

_defineProperty(New, "outlets", [{
  type: "anything",
  description: "Instance constructed"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after constructor called"
}]);

_defineProperty(New, "args", [{
  type: "string",
  optional: false,
  varLength: false,
  description: "Constructor name"
}, {
  type: "anything",
  optional: true,
  varLength: true,
  description: "Set arguments while loaded"
}]);

_defineProperty(New, "props", {
  args: {
    type: "number",
    default: 0,
    description: "arguments count for method"
  },
  spreadArgs: {
    type: "boolean",
    default: false,
    description: "arguments input will be spreaded if true"
  }
});

/***/ }),

/***/ "./src/core/objects/importer/Property.ts":
/*!***********************************************!*\
  !*** ./src/core/objects/importer/Property.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Property)
/* harmony export */ });
/* harmony import */ var _ImportedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImportedObject */ "./src/core/objects/importer/ImportedObject.tsx");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Property extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      instance: undefined
    });

    _defineProperty(this, "handlePreInit", () => {
      this.inlets = 2;
      this.outlets = 2;
    });

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this._.instance = data;
        let result;

        try {
          result = this._.instance[this.name];
        } catch (e) {
          this.error(e);
        }

        this.outletAll([result, this._.instance]);
      } else if (inlet === 1) {
        try {
          this._.instance[this.name] = data;
        } catch (e) {
          this.error(e);
        }
      }
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", this.handlePreInit);
    this.on("inlet", this.handleInlet);
  }

}

_defineProperty(Property, "importedObjectType", "Property");

_defineProperty(Property, "description", "Auto-imported property");

_defineProperty(Property, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Constructor argument, output instance constructed"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Constructor argument"
}]);

_defineProperty(Property, "outlets", [{
  type: "anything",
  description: "Value"
}, {
  type: "anything",
  description: "Instance bypass"
}]);

/***/ }),

/***/ "./src/core/objects/importer/RemotedImporter.ts":
/*!******************************************************!*\
  !*** ./src/core/objects/importer/RemotedImporter.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "New": () => (/* binding */ New),
/* harmony export */   "Func": () => (/* binding */ Func),
/* harmony export */   "Property": () => (/* binding */ Property),
/* harmony export */   "Getter": () => (/* binding */ Getter),
/* harmony export */   "Setter": () => (/* binding */ Setter),
/* harmony export */   "SetterGetter": () => (/* binding */ SetterGetter),
/* harmony export */   "Method": () => (/* binding */ Method),
/* harmony export */   "StaticProperty": () => (/* binding */ StaticProperty),
/* harmony export */   "StaticGetter": () => (/* binding */ StaticGetter),
/* harmony export */   "StaticSetter": () => (/* binding */ StaticSetter),
/* harmony export */   "StaticSetterGetter": () => (/* binding */ StaticSetterGetter),
/* harmony export */   "StaticMethod": () => (/* binding */ StaticMethod),
/* harmony export */   "default": () => (/* binding */ DefaultImporter)
/* harmony export */ });
/* harmony import */ var _New__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./New */ "./src/core/objects/importer/New.tsx");
/* harmony import */ var _Func__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Func */ "./src/core/objects/importer/Func.tsx");
/* harmony import */ var _Property__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Property */ "./src/core/objects/importer/Property.ts");
/* harmony import */ var _Getter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Getter */ "./src/core/objects/importer/Getter.ts");
/* harmony import */ var _Setter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Setter */ "./src/core/objects/importer/Setter.ts");
/* harmony import */ var _SetterGetter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SetterGetter */ "./src/core/objects/importer/SetterGetter.ts");
/* harmony import */ var _Method__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Method */ "./src/core/objects/importer/Method.ts");
/* harmony import */ var _StaticProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./StaticProperty */ "./src/core/objects/importer/StaticProperty.ts");
/* harmony import */ var _StaticGetter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./StaticGetter */ "./src/core/objects/importer/StaticGetter.ts");
/* harmony import */ var _StaticSetter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./StaticSetter */ "./src/core/objects/importer/StaticSetter.ts");
/* harmony import */ var _StaticSetterGetter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./StaticSetterGetter */ "./src/core/objects/importer/StaticSetterGetter.ts");
/* harmony import */ var _StaticMethod__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./StaticMethod */ "./src/core/objects/importer/StaticMethod.ts");
/* harmony import */ var _base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../base/generateRemotedObject */ "./src/core/objects/base/generateRemotedObject.ts");
/* harmony import */ var _Importer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Importer */ "./src/core/objects/importer/Importer.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }















class New extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_New__WEBPACK_IMPORTED_MODULE_0__.default) {}
class Func extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Func__WEBPACK_IMPORTED_MODULE_1__.default) {}
class Property extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Property__WEBPACK_IMPORTED_MODULE_2__.default) {}
class Getter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Getter__WEBPACK_IMPORTED_MODULE_3__.default) {}
class Setter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Setter__WEBPACK_IMPORTED_MODULE_4__.default) {}
class SetterGetter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_SetterGetter__WEBPACK_IMPORTED_MODULE_5__.default) {}
class Method extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Method__WEBPACK_IMPORTED_MODULE_6__.default) {}
class StaticProperty extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticProperty__WEBPACK_IMPORTED_MODULE_7__.default) {}
class StaticGetter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticGetter__WEBPACK_IMPORTED_MODULE_8__.default) {}
class StaticSetter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticSetter__WEBPACK_IMPORTED_MODULE_9__.default) {}
class StaticSetterGetter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticSetterGetter__WEBPACK_IMPORTED_MODULE_10__.default) {}
class StaticMethod extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticMethod__WEBPACK_IMPORTED_MODULE_11__.default) {}
class DefaultImporter extends _Importer__WEBPACK_IMPORTED_MODULE_13__.default {
  static getObject(p, pkgName, root, path) {
    var _class, _temp;

    const isStatic = path[path.length - 2] !== "prototype";
    let Super;
    const type = typeof p.value;

    if (type === "function") {
      if (isStatic) Super = StaticMethod;else Super = Method;
    } else if (type === "undefined") {
      const setter = p.set;
      const getter = p.get;

      if (isStatic) {
        if (setter && getter) Super = StaticSetterGetter;else if (setter) Super = StaticSetter;else if (getter) Super = StaticGetter;else return null;
      } else {
        if (setter && getter) Super = SetterGetter;else if (setter) Super = Setter;else if (getter) Super = Getter;else return null;
      }
    } else {
      if (isStatic) Super = StaticProperty;else Super = Property;
    }

    return _temp = _class = class extends Super {
      static get _name() {
        return path[path.length - 1] || pkgName;
      }

    }, _defineProperty(_class, "package", pkgName), _defineProperty(_class, "root", root), _defineProperty(_class, "path", path), _temp;
  }

}

/***/ }),

/***/ "./src/core/objects/importer/Setter.ts":
/*!*********************************************!*\
  !*** ./src/core/objects/importer/Setter.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Setter)
/* harmony export */ });
/* harmony import */ var _ImportedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImportedObject */ "./src/core/objects/importer/ImportedObject.tsx");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Setter extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "initialInlets", 2);

    _defineProperty(this, "initialOutlets", 1);

    _defineProperty(this, "_", {
      instance: undefined,
      input: null
    });

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this._.instance = data;
        if (typeof this._.instance === "undefined") return;

        try {
          this._.instance[this.name] = this._.input;
        } catch (e) {
          this.error(e);
          return;
        }

        this.outlet(0, this._.instance);
      } else {
        this._.input = data;
      }
    });

    _defineProperty(this, "handleUpdateArgs", args => {
      if (args.length) this._.input = args[0];
    });
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = this.initialInlets;
      this.outlets = this.initialOutlets;
      this.handleUpdateArgs(this.args);
    });
    this.on("updateArgs", this.handleUpdateArgs);
    this.on("inlet", this.handleInlet);
  }

}

_defineProperty(Setter, "importedObjectType", "Setter");

_defineProperty(Setter, "description", "Auto-imported setter");

_defineProperty(Setter, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Instance to set property"
}, {
  isHot: false,
  type: "anything",
  description: "Set the value"
}]);

_defineProperty(Setter, "outlets", [{
  type: "anything",
  description: "Instance bypass"
}]);

_defineProperty(Setter, "args", [{
  type: "anything",
  optional: true,
  varLength: false,
  description: "Initial value to set"
}]);

/***/ }),

/***/ "./src/core/objects/importer/SetterGetter.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/importer/SetterGetter.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SetterGetter)
/* harmony export */ });
/* harmony import */ var _ImportedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImportedObject */ "./src/core/objects/importer/ImportedObject.tsx");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class SetterGetter extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "initialInlets", 2);

    _defineProperty(this, "initialOutlets", 2);

    _defineProperty(this, "_", {
      instance: undefined,
      input: null,
      result: null
    });

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this._.instance = data;
        if (typeof this._.instance === "undefined") return;

        if (typeof this._.input !== "undefined") {
          try {
            this._.instance[this.name] = this._.input;
          } catch (e) {
            this.error(e);
            return;
          }
        }

        if (this.execute()) this.output();
      } else if (inlet === 1) {
        this._.input = data;
      }
    });

    _defineProperty(this, "callback", () => this.outletAll([this._.result, this._.instance]));
  }

  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = this.initialInlets;
      this.outlets = this.initialOutlets;
      handleUpdateArgs(this.args);
    });

    const handleUpdateArgs = args => {
      if (args.length) this._.input = args[0];
    };

    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", this.handleInlet);
  }

  execute() {
    try {
      this._.result = this._.instance[this.name];
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

  output() {
    if (this._.result instanceof Promise && !this.getProp("sync")) {
      this.loading = true;

      this._.result.then(r => {
        this.loading = false;
        this._.result = r;
        this.callback();
      }, r => {
        this.loading = false;
        this.error(r);
      });

      return this;
    }

    return this.callback();
  }

  set loading(loading) {
    this.updateUI({
      loading
    });
  }

}

_defineProperty(SetterGetter, "importedObjectType", "SetterGetter");

_defineProperty(SetterGetter, "description", "Auto-imported setter / getter");

_defineProperty(SetterGetter, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Instance to manipulate"
}, {
  isHot: false,
  type: "anything",
  description: "Set the value"
}]);

_defineProperty(SetterGetter, "outlets", [{
  type: "anything",
  description: "Value"
}, {
  type: "anything",
  description: "Instance bypass"
}]);

_defineProperty(SetterGetter, "args", [{
  type: "anything",
  optional: true,
  varLength: false,
  description: "Initial value to set"
}]);

_defineProperty(SetterGetter, "props", {
  sync: {
    type: "boolean",
    default: false,
    description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
  }
});

/***/ }),

/***/ "./src/core/objects/importer/StaticGetter.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/importer/StaticGetter.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StaticGetter)
/* harmony export */ });
/* harmony import */ var _Getter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Getter */ "./src/core/objects/importer/Getter.ts");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class StaticGetter extends _Getter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handlePreInit", () => {
      this.inlets = 1;
      this.outlets = 1;
    });

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      if (inlet === 0 && (0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data) && this.execute()) this.output();
    });

    _defineProperty(this, "callback", () => this.outlet(0, this._.result));
  }

  execute() {
    try {
      this._.result = this.imported;
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

}

_defineProperty(StaticGetter, "importedObjectType", "StaticGetter");

_defineProperty(StaticGetter, "description", "Auto-imported static getter");

_defineProperty(StaticGetter, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Get the value"
}]);

_defineProperty(StaticGetter, "outlets", [{
  type: "anything",
  description: "Value"
}]);

/***/ }),

/***/ "./src/core/objects/importer/StaticMethod.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/importer/StaticMethod.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StaticMethod)
/* harmony export */ });
/* harmony import */ var _Method__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Method */ "./src/core/objects/importer/Method.ts");
/* harmony import */ var _utils_symbols__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/symbols */ "./src/utils/symbols.ts");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class StaticMethod extends _Method__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "initialInlets", 0);

    _defineProperty(this, "initialOutlets", 1);

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_2__.isBang)(data)) this._.inputs[inlet] = data;
        if (this.execute()) this.output();
      } else {
        this._.inputs[inlet] = data;
      }
    });

    _defineProperty(this, "callback", () => this.outletAll([this._.result, ...this._.inputs]));
  }

  execute() {
    const fn = this.imported;

    try {
      this._.result = fn(...(this.getProp("spreadArgs") ? this._.inputs.reduce((acc, cur) => [...acc, ...cur], []) : this._.inputs));
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

}

_defineProperty(StaticMethod, "importedObjectType", "StaticMethod");

_defineProperty(StaticMethod, _utils_symbols__WEBPACK_IMPORTED_MODULE_1__.ImportedStaticMethodObject, true);

_defineProperty(StaticMethod, "description", "Auto-imported static method");

_defineProperty(StaticMethod, "inlets", [{
  isHot: true,
  type: "anything",
  varLength: true,
  description: "Method argument"
}]);

_defineProperty(StaticMethod, "outlets", [{
  type: "anything",
  description: "Method return value"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after method called"
}]);

/***/ }),

/***/ "./src/core/objects/importer/StaticProperty.ts":
/*!*****************************************************!*\
  !*** ./src/core/objects/importer/StaticProperty.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StaticProperty)
/* harmony export */ });
/* harmony import */ var _Property__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Property */ "./src/core/objects/importer/Property.ts");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class StaticProperty extends _Property__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handlePreInit", () => {
      this.inlets = 2;
      this.outlets = 1;
    });

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if ((0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) this.outlet(0, this.imported);
      } else if (inlet === 1) {
        this.imported = data;
      }
    });
  }

  subscribe() {
    super.subscribe();
    this.on("updateArgs", args => {
      if (args.length) this.imported = args[0];
    });
    this.on("inlet", this.handleInlet);
  }

}

_defineProperty(StaticProperty, "importedObjectType", "StaticProperty");

_defineProperty(StaticProperty, "description", "Auto-imported static property");

_defineProperty(StaticProperty, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Get the value"
}, {
  isHot: false,
  type: "anything",
  description: "Set the value"
}]);

_defineProperty(StaticProperty, "outlets", [{
  type: "anything",
  description: "Value"
}]);

_defineProperty(StaticProperty, "args", [{
  type: "anything",
  optional: true,
  description: "Set the value while loaded."
}]);

/***/ }),

/***/ "./src/core/objects/importer/StaticSetter.ts":
/*!***************************************************!*\
  !*** ./src/core/objects/importer/StaticSetter.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StaticSetter)
/* harmony export */ });
/* harmony import */ var _Setter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Setter */ "./src/core/objects/importer/Setter.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class StaticSetter extends _Setter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "initialInlets", 1);

    _defineProperty(this, "initialOutlets", 0);

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      if (inlet === 0) this.imported = data;
    });

    _defineProperty(this, "handleUpdateArgs", args => {
      if (args.length) this.imported = args[0];
    });
  }

}

_defineProperty(StaticSetter, "importedObjectType", "StaticSetter");

_defineProperty(StaticSetter, "description", "Auto-imported static setter");

_defineProperty(StaticSetter, "inlets", [{
  isHot: false,
  type: "anything",
  description: "Set the value"
}]);

_defineProperty(StaticSetter, "outlets", []);

/***/ }),

/***/ "./src/core/objects/importer/StaticSetterGetter.ts":
/*!*********************************************************!*\
  !*** ./src/core/objects/importer/StaticSetterGetter.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StaticSetterGetter)
/* harmony export */ });
/* harmony import */ var _SetterGetter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SetterGetter */ "./src/core/objects/importer/SetterGetter.ts");
/* harmony import */ var _base_Bang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Bang */ "./src/core/objects/base/Bang.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class StaticSetterGetter extends _SetterGetter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "initialInlets", 2);

    _defineProperty(this, "initialOutlets", 1);

    _defineProperty(this, "handleInlet", _ref => {
      let {
        data,
        inlet
      } = _ref;

      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data)) return;

        if (typeof this._.input !== "undefined") {
          try {
            this.imported = this._.input;
          } catch (e) {
            this.error(e);
            return;
          }
        }

        if (this.execute()) this.output();
      } else if (inlet === 1) {
        this._.input = data;
      }
    });

    _defineProperty(this, "callback", () => this.outlet(0, this._.result));
  }

  execute() {
    try {
      this._.result = this.imported;
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }

}

_defineProperty(StaticSetterGetter, "importedObjectType", "StaticSetterGetter");

_defineProperty(StaticSetterGetter, "description", "Auto-imported static setter / getter");

_defineProperty(StaticSetterGetter, "inlets", [{
  isHot: true,
  type: "bang",
  description: "Get the value"
}, {
  isHot: false,
  type: "anything",
  description: "Set the value"
}]);

_defineProperty(StaticSetterGetter, "outlets", [{
  type: "anything",
  description: "Value"
}]);

/***/ }),

/***/ "./src/core/objects/jsaw/AudioIn.ts":
/*!******************************************!*\
  !*** ./src/core/objects/jsaw/AudioIn.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioIn)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AudioIn extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      index: this.index
    });

    _defineProperty(this, "handlePatcherInput", _ref => {
      let {
        input,
        buffer
      } = _ref;
      if (input === this.index - 1) this.outlet(0, buffer);
    });

    _defineProperty(this, "emitPatcherChangeIO", () => this.patcher.changeIO());
  }

  get index() {
    return Math.max(1, ~~this.box.args[0] || 1);
  }

  subscribe() {
    super.subscribe();
    this.on("metaUpdated", this.emitPatcherChangeIO);
    this.on("preInit", () => {
      this.inlets = 0;
      this.outlets = 1;
    });
    this.on("postInit", this.emitPatcherChangeIO);
    this.on("updateArgs", () => {
      const {
        index
      } = this;

      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", props => {
      const outlet0 = _objectSpread({}, this.meta.outlets[0]);

      if (typeof props.description === "string") outlet0.description = props.description;
      this.setMeta({
        outlets: [outlet0]
      });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet") this.patcher.on("audioInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("audioInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }

}

_defineProperty(AudioIn, "isPatcherInlet", "audio");

_defineProperty(AudioIn, "description", "Patcher inlet (audio)");

_defineProperty(AudioIn, "args", [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}]);

_defineProperty(AudioIn, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
});

_defineProperty(AudioIn, "outlets", [{
  type: "object",
  description: "Float32Array buffer"
}]);

/***/ }),

/***/ "./src/core/objects/jsaw/AudioOut.ts":
/*!*******************************************!*\
  !*** ./src/core/objects/jsaw/AudioOut.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioOut)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class AudioOut extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      index: this.index
    });

    _defineProperty(this, "emitPatcherChangeIO", () => {
      this.patcher.inspectAudioIO();
      this.patcher.changeIO();
    });
  }

  get index() {
    return Math.max(1, ~~this.box.args[0] || 1);
  }

  subscribe() {
    super.subscribe();
    this.on("metaUpdated", this.emitPatcherChangeIO);
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("postInit", this.emitPatcherChangeIO);
    this.on("updateArgs", () => {
      const {
        index
      } = this;

      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", props => {
      const inlet0 = _objectSpread({}, this.meta.inlets[0]);

      if (typeof props.description === "string") inlet0.description = props.description;
      this.setMeta({
        inlets: [inlet0]
      });
      this.emitPatcherChangeIO();
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      if (inlet === 0) this.patcher.outputAudio(this.index - 1, data);
    });
    this.on("destroy", this.emitPatcherChangeIO);
  }

}

_defineProperty(AudioOut, "isPatcherOutlet", "audio");

_defineProperty(AudioOut, "description", "Patcher outlet (audio)");

_defineProperty(AudioOut, "args", [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}]);

_defineProperty(AudioOut, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
});

_defineProperty(AudioOut, "inlets", [{
  isHot: true,
  type: "anything",
  description: "Float32Array buffer"
}]);

/***/ }),

/***/ "./src/core/objects/jsaw/In.ts":
/*!*************************************!*\
  !*** ./src/core/objects/jsaw/In.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ In)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class In extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      index: this.index
    });

    _defineProperty(this, "handlePatcherInput", _ref => {
      let {
        data,
        inlet
      } = _ref;
      if (inlet === this.index - 1) this.outlet(0, data);
    });

    _defineProperty(this, "emitPatcherChangeIO", () => this.patcher.changeIO());
  }

  get index() {
    return Math.max(1, ~~this.box.args[0] || 1);
  }

  subscribe() {
    super.subscribe();
    this.on("metaUpdated", this.emitPatcherChangeIO);
    this.on("preInit", () => {
      this.inlets = 0;
      this.outlets = 1;
    });
    this.on("postInit", this.emitPatcherChangeIO);
    this.on("updateArgs", () => {
      const {
        index
      } = this;

      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", props => {
      const outlet0 = _objectSpread({}, this.meta.outlets[0]);

      if (typeof props.description === "string") outlet0.description = props.description;
      if (typeof props.type === "string") outlet0.type = props.type || "anything";
      this.setMeta({
        outlets: [outlet0]
      });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet") this.patcher.on("dataInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("dataInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }

}

_defineProperty(In, "isPatcherInlet", "data");

_defineProperty(In, "description", "Patcher inlet (data)");

_defineProperty(In, "args", [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}]);

_defineProperty(In, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  },
  type: {
    type: "enum",
    enums: ["string", "number", "boolean", "object", "function", "anything", "bang", "color"],
    default: "anything",
    description: "Inlet data type"
  }
});

_defineProperty(In, "outlets", [{
  type: "anything",
  description: ""
}]);

/***/ }),

/***/ "./src/core/objects/jsaw/Out.ts":
/*!**************************************!*\
  !*** ./src/core/objects/jsaw/Out.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Out)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Out extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_", {
      index: this.index
    });

    _defineProperty(this, "emitPatcherChangeIO", () => this.patcher.changeIO());
  }

  get index() {
    return Math.max(1, ~~this.box.args[0] || 1);
  }

  subscribe() {
    super.subscribe();
    this.on("metaUpdated", this.emitPatcherChangeIO);
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("postInit", this.emitPatcherChangeIO);
    this.on("updateArgs", () => {
      const {
        index
      } = this;

      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", props => {
      const inlet0 = _objectSpread({}, this.meta.inlets[0]);

      if (typeof props.description === "string") inlet0.description = props.description;
      if (typeof props.type === "string") inlet0.type = props.type || "anything";
      this.setMeta({
        inlets: [inlet0]
      });
      this.emitPatcherChangeIO();
    });
    this.on("inlet", _ref => {
      let {
        data,
        inlet
      } = _ref;
      if (inlet === 0) this.patcher.outlet(this.index - 1, data);
    });
    this.on("destroy", this.emitPatcherChangeIO);
  }

}

_defineProperty(Out, "isPatcherOutlet", "data");

_defineProperty(Out, "description", "Patcher outlet (data)");

_defineProperty(Out, "args", [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}]);

_defineProperty(Out, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  },
  type: {
    type: "enum",
    enums: ["string", "number", "boolean", "object", "function", "anything", "bang", "color"],
    default: "anything",
    description: "Inlet data type"
  }
});

_defineProperty(Out, "inlets", [{
  isHot: true,
  type: "anything",
  description: ""
}]);

/***/ }),

/***/ "./src/core/objects/jsaw/Param.ts":
/*!****************************************!*\
  !*** ./src/core/objects/jsaw/Param.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Param)
/* harmony export */ });
/* harmony import */ var _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/BaseObject */ "./src/core/objects/base/BaseObject.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Param extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handlePatcherInput", _ref => {
      let {
        param,
        buffer
      } = _ref;
      if (this.args[0] === param) this.outlet(0, buffer);
    });

    _defineProperty(this, "emitPatcherChangeIO", () => this.patcher.changeIO());
  }

  subscribe() {
    super.subscribe();
    this.on("metaUpdated", this.emitPatcherChangeIO);
    this.on("preInit", () => {
      this.inlets = 0;
      this.outlets = 1;
    });
    this.on("postInit", this.emitPatcherChangeIO);
    this.on("updateArgs", this.emitPatcherChangeIO);
    this.on("updateProps", props => {
      const outlet0 = _objectSpread({}, this.meta.outlets[0]);

      if (typeof props.description === "string") outlet0.description = props.description;
      this.setMeta({
        outlets: [outlet0]
      });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet") this.patcher.on("paramInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("paramInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }

}

_defineProperty(Param, "description", "Patcher outlet (data)");

_defineProperty(Param, "args", [{
  type: "string",
  optional: false,
  default: "",
  description: "Parameter name"
}]);

_defineProperty(Param, "props", {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
});

_defineProperty(Param, "outlets", [{
  type: "anything",
  description: ""
}]);

/***/ }),

/***/ "./src/core/objects/jsaw/index.jsdsppkg.aw.ts":
/*!****************************************************!*\
  !*** ./src/core/objects/jsaw/index.jsdsppkg.aw.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/generateRemotedObject */ "./src/core/objects/base/generateRemotedObject.ts");
/* harmony import */ var _In__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./In */ "./src/core/objects/jsaw/In.ts");
/* harmony import */ var _Out__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Out */ "./src/core/objects/jsaw/Out.ts");
/* harmony import */ var _Param__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Param */ "./src/core/objects/jsaw/Param.ts");
/* harmony import */ var _AudioIn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AudioIn */ "./src/core/objects/jsaw/AudioIn.ts");
/* harmony import */ var _AudioOut__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AudioOut */ "./src/core/objects/jsaw/AudioOut.ts");






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => ({
  in: (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_0__.default)(_In__WEBPACK_IMPORTED_MODULE_1__.default),
  out: (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_0__.default)(_Out__WEBPACK_IMPORTED_MODULE_2__.default),
  "param~": (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_0__.default)(_Param__WEBPACK_IMPORTED_MODULE_3__.default),
  "in~": (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_0__.default)(_AudioIn__WEBPACK_IMPORTED_MODULE_4__.default),
  "out~": (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_0__.default)(_AudioOut__WEBPACK_IMPORTED_MODULE_5__.default)
}));

/***/ }),

/***/ "./src/core/patcher/Box.ts":
/*!*********************************!*\
  !*** ./src/core/patcher/Box.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Box)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class Box extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(patcherIn, boxIn) {
    var _prevData;

    super();

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "text", "");

    _defineProperty(this, "inlets", 0);

    _defineProperty(this, "outlets", 0);

    _defineProperty(this, "rect", void 0);

    _defineProperty(this, "background", void 0);

    _defineProperty(this, "presentation", void 0);

    _defineProperty(this, "presentationRect", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "args", void 0);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_editing", void 0);

    _defineProperty(this, "_parsed", void 0);

    _defineProperty(this, "_object", void 0);

    _defineProperty(this, "_Object", void 0);

    _defineProperty(this, "_patcher", void 0);

    _defineProperty(this, "_inletLines", void 0);

    _defineProperty(this, "_outletLines", void 0);

    this.id = boxIn.id;
    this.text = boxIn.text;
    this.args = boxIn.args || [];
    this.props = boxIn.props || {};
    this.inlets = boxIn.inlets;
    this.outlets = boxIn.outlets;
    this._inletLines = new Array(this.inlets).fill(null).map(() => new Set());
    this._outletLines = new Array(this.outlets).fill(null).map(() => new Set());
    const maxBoxIn = boxIn;
    this.rect = boxIn.rect || maxBoxIn.patching_rect;
    this.background = boxIn.background || !!maxBoxIn.background;
    this.presentation = boxIn.presentation || !!maxBoxIn.presentation;
    this.presentationRect = boxIn.presentationRect || maxBoxIn.presentation_rect;
    if (!this.presentationRect) this.presentationRect = this.rect.slice();
    this.data = boxIn.data || ((_prevData = boxIn.prevData) === null || _prevData === void 0 ? void 0 : _prevData.storage) || {};
    this._editing = !!boxIn._editing;
    this._patcher = patcherIn;
    this.on("dataUpdated", () => this._patcher.emitChanged());
    this.on("argsUpdated", () => this._patcher.emitChanged());
    this.on("propsUpdated", () => this._patcher.emitChanged());
  }

  async init() {
    this._parsed = Box.parseObjText(this.text);

    const newMeta = this._patcher.getObjectMeta(this._parsed);

    for (const key in this.props) {
      if (!newMeta.props[key]) delete this.props[key];
    }

    if (this._parsed.args.length) this.args = this._parsed.args;
    Object.assign(this.props, this._parsed.props);

    const Constructor = this._patcher.getObjectConstructor(this._parsed);

    this._Object = Constructor;
    if (!this.size.every(v => v > 0)) this.size = this.defaultSize;
    if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isTPresentationRect)(this.presentationRect) || this.presentationSize.every(v => typeof v === "number") && !this.presentationSize.every(v => v > 0)) this.presentationSize = this.defaultSize;
    this._object = new Constructor(this, this._patcher);
    await this._object.init();
    return this;
  }

  async postInit() {
    await this._object.postInit();
    return this;
  }
  /**
   * Main function when receive data from a inlet (base 0)
   */


  fn(inlet, data) {
    this._object.fn(inlet, data);

    return this;
  }

  get UI() {
    return this._Object.UI;
  }

  get defaultSize() {
    var _this$UI;

    return ((_this$UI = this.UI) === null || _this$UI === void 0 ? void 0 : _this$UI.defaultSize) || [90, 20];
  }

  get meta() {
    return this._object.meta;
  }

  get outletLines() {
    return this._outletLines;
  }

  get inletLines() {
    return this._inletLines;
  }

  get object() {
    return this._object;
  }

  set object(oIn) {
    this._object = oIn;
  }

  get Object() {
    return this._Object;
  }

  get parsed() {
    return this._parsed;
  }

  addInletLine(line) {
    const index = line.destInlet;
    if (!this._inletLines[index]) this._inletLines[index] = new Set();

    this._inletLines[index].add(line);
  }

  removeInletLine(line) {
    const index = line.destInlet;
    if (this._inletLines[index]) this._inletLines[index].delete(line);
  }

  addOutletLine(line) {
    const index = line.srcOutlet;
    if (!this._outletLines[index]) this._outletLines[index] = new Set();

    this._outletLines[index].add(line);
  }

  removeOutletLine(line) {
    const index = line.srcOutlet;
    if (this._outletLines[index]) this._outletLines[index].delete(line);
  }

  setInlets(count) {
    const lines = this.allLines;
    lines.forEach(line => line.disable());
    this.inlets = count; // Lines that should be removed will destroy themselves when enable()

    lines.forEach(line => line.enable());
    const linesSetLength = this._inletLines.length;
    if (count > linesSetLength) this._inletLines.push(...new Array(count - linesSetLength).fill(null).map(() => new Set()));else if (count < linesSetLength) this._inletLines.splice(count);

    this._inletLines.forEach(set => set.forEach(line => line.uiUpdateDest()));

    this.emit("ioCountChanged", this);
  }

  setOutlets(count) {
    const lines = this.allLines;
    lines.forEach(line => line.disable());
    this.outlets = count; // Lines that should be removed will destroy themselves when enable()

    lines.forEach(line => line.enable());
    const linesSetLength = this._outletLines.length;
    if (count > linesSetLength) this._outletLines.push(...new Array(count - linesSetLength).fill(null).map(() => new Set()));else if (count < linesSetLength) this._outletLines.splice(count);

    this._outletLines.forEach(set => set.forEach(line => line.uiUpdateSrc()));

    this.emit("ioCountChanged", this);
  }

  getInletPos(port) {
    const {
      rect,
      inlets
    } = this;
    const [left, top, width] = rect;
    return {
      top,
      left: left + 10 + (width - 20) * port / (inlets > 1 ? inlets - 1 : 1)
    };
  }

  getOutletPos(port) {
    const {
      rect,
      outlets
    } = this;
    const [left, top, width, height] = rect;
    return {
      top: top + height,
      left: left + 10 + (width - 20) * port / (outlets > 1 ? outlets - 1 : 1)
    };
  }

  get inletsPositions() {
    const positions = [];

    for (let i = 0; i < this.inlets; i++) {
      positions[i] = this.getInletPos(i);
    }

    return positions;
  }

  get outletsPositions() {
    const positions = [];

    for (let i = 0; i < this.outlets; i++) {
      positions[i] = this.getOutletPos(i);
    }

    return positions;
  }

  get allLines() {
    const lines = new Set();

    this._inletLines.forEach(set => set.forEach(line => lines.add(line)));

    this._outletLines.forEach(set => set.forEach(line => lines.add(line)));

    return lines;
  } // called when inlet or outlet are connected or disconnected


  connectedOutlet(outlet, destBoxId, destInlet, lineId) {
    if (this._object) this._object.connectedOutlet(outlet, destBoxId, destInlet, lineId);
    this.emit("connectedPort", {
      isSrc: true,
      i: outlet
    });
    return this;
  }

  connectedInlet(inlet, srcBoxId, srcOutlet, lineId) {
    if (this._object) this._object.connectedInlet(inlet, srcBoxId, srcOutlet, lineId);
    this.emit("connectedPort", {
      isSrc: false,
      i: inlet
    });
    return this;
  }

  disconnectedOutlet(outlet, destBoxId, destInlet, lineId) {
    if (this._object) this._object.disconnectedOutlet(outlet, destBoxId, destInlet, lineId);
    const last = this._patcher.getLinesBySrcID(this.id)[outlet].length === 1;
    this.emit("disconnectedPort", {
      isSrc: true,
      i: outlet,
      last
    });
    return this;
  }

  disconnectedInlet(inlet, srcBoxId, srcOutlet, lineId) {
    if (this._object) this._object.disconnectedInlet(inlet, srcBoxId, srcOutlet, lineId);
    const last = this._patcher.getLinesByDestID(this.id)[inlet].length === 1;
    this.emit("disconnectedPort", {
      isSrc: false,
      i: inlet,
      last
    });
    return this;
  }

  isOutletTo(outlet, box, inlet) {
    const iterator = this._outletLines[outlet].values();

    let r;

    while (!(r = iterator.next()).done) {
      const line = r.value;
      if (line.destBox === box && line.destInlet === inlet) return true;
    }

    return false;
  }

  isInletFrom(inlet, box, outlet) {
    const iterator = this._inletLines[inlet].values();

    let r;

    while (!(r = iterator.next()).done) {
      const line = r.value;
      if (line.srcBox === box && line.srcOutlet === outlet) return true;
    }

    return false;
  }

  async changeText(textIn, force) {
    if (!force && textIn === this.text) return this;
    const {
      defaultSize: oldDefaultSize
    } = this;
    this.allLines.forEach(line => line.disable());
    await this._object.destroy();
    this.text = textIn;
    this.args = [];
    await this.init();
    this.allLines.forEach(line => line.enable());
    const {
      defaultSize
    } = this;

    if (!defaultSize.every((v, i) => v === oldDefaultSize[i])) {
      this.size = defaultSize;
      this.presentationSize = defaultSize;
    }

    this.emit("textChanged", this);

    this._object.setMeta(this._object.meta);

    await this.postInit();
    return this;
  }

  update(e) {
    const {
      args,
      props
    } = e;
    if (args) this.args = args;

    if (props) {
      if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isTRect)(props.rect)) {
        this.setRect(props.rect);
        delete props.rect;
      }

      if ((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isTPresentationRect)(props.presentationRect)) {
        this.setPresentationRect(props.presentationRect);
        delete props.presentationRect;
      }

      if (typeof props.presentation === "boolean") {
        this.setPresentation(props.presentation);
        delete props.presentation;
      }

      if (typeof props.background === "boolean") {
        this.setBackground(props.background);
        delete props.background;
      }

      this.props = Object.assign(this.props, props);
    }

    return this;
  }

  get position() {
    return this.rect.slice(0, 2);
  }

  set position(_ref) {
    let [leftIn, topIn] = _ref;
    const [left, top, width, height] = this.rect;
    this.setRect([typeof leftIn === "number" ? leftIn : left, typeof topIn === "number" ? topIn : top, width, height]);
  }

  get presentationPosition() {
    return this.presentationRect.slice(0, 2);
  }

  set presentationPosition(_ref2) {
    let [leftIn, topIn] = _ref2;
    const [left, top, width, height] = this.presentationRect;
    this.setPresentationRect([typeof leftIn === "number" || typeof leftIn === "string" ? leftIn : left, typeof topIn === "number" || typeof topIn === "string" ? topIn : top, width, height]);
  }

  get size() {
    return this.rect.slice(2);
  }

  set size(_ref3) {
    let [widthIn, heightIn] = _ref3;
    const [left, top, width, height] = this.rect;
    this.setRect([left, top, widthIn || width, heightIn || height]);
  }

  get presentationSize() {
    return this.presentationRect.slice(2);
  }

  set presentationSize(_ref4) {
    let [widthIn, heightIn] = _ref4;
    const [left, top, width, height] = this.presentationRect;
    this.setPresentationRect([left, top, widthIn || width, heightIn || height]);
  }

  getLeft() {
    let inPresentation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const rectKey = inPresentation ? "presentationRect" : "rect";
    return this[rectKey][0];
  }

  setLeft(leftIn) {
    let inPresentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const positionKey = inPresentation ? "presentationPosition" : "position";
    this[positionKey] = [leftIn, undefined];
  }

  getTop() {
    let inPresentation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const rectKey = inPresentation ? "presentationRect" : "rect";
    return this[rectKey][1];
  }

  setTop(topIn) {
    let inPresentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const positionKey = inPresentation ? "presentationPosition" : "position";
    this[positionKey] = [undefined, topIn];
  }

  getWidth() {
    let inPresentation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const rectKey = inPresentation ? "presentationRect" : "rect";
    return this[rectKey][2];
  }

  setWidth(widthIn) {
    let inPresentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const sizeKey = inPresentation ? "presentationSize" : "size";
    this[sizeKey] = [widthIn, undefined];
  }

  getHeight() {
    let inPresentation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const rectKey = inPresentation ? "presentationRect" : "rect";
    return this[rectKey][3];
  }

  setHeight(heightIn) {
    let inPresentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const sizeKey = inPresentation ? "presentationSize" : "size";
    this[sizeKey] = [undefined, heightIn];
  }

  setBackground(bool) {
    if (!!this.background === !!bool) return this;
    this.background = bool;
    this.emit("backgroundChanged", this);
    return this;
  }

  setPresentation(bool) {
    if (!!this.presentation === !!bool) return this;
    this.presentation = bool;
    if (bool) this.presentationRect = this.rect.slice();
    this.emit("presentationChanged", this);
    return this;
  }

  setRect(rect) {
    if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isTRect)(rect)) return this;
    rect[0] = Math.max(0, rect[0]);
    rect[1] = Math.max(0, rect[1]);
    rect[2] = Math.max(15, rect[2]);
    rect[3] = Math.max(15, rect[3]);
    this.rect = rect;
    this.inletLines.forEach(set => set.forEach(line => line.uiUpdateDest()));
    this.outletLines.forEach(set => set.forEach(line => line.uiUpdateSrc()));
    this.emit("rectChanged", this);
    return this;
  }

  setPresentationRect(rect) {
    if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isTPresentationRect)(rect)) return this;
    if (typeof rect[0] === "number") rect[0] = Math.max(0, rect[0]);
    if (typeof rect[1] === "number") rect[1] = Math.max(0, rect[1]);
    if (typeof rect[2] === "number") rect[2] = Math.max(15, rect[2]);
    if (typeof rect[3] === "number") rect[3] = Math.max(15, rect[3]);
    this.presentationRect = rect;
    this.emit("presentationRectChanged", this);
    return this;
  }

  getIsMovable() {
    let inPresentation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!inPresentation) return true;
    return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isRectMovable)(this.presentationRect);
  }

  getIsResizable() {
    let inPresentation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!inPresentation) return true;
    return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isRectResizable)(this.presentationRect);
  }

  error(text) {
    this.emit("error", text);
  }

  highlight() {
    this.emit("highlight", this);
  }

  highlightPort(isSrc, i, highlight) {
    this.emit("highlightPort", {
      isSrc,
      i,
      highlight
    });
  }

  undoable(e) {
    this._patcher.boxChanged(this.id, e);
  }

  async changeObject(_ref5, options) {
    let {
      args,
      props,
      state
    } = _ref5;
    if (args) await this._object.updateArgs(args, options);
    if (props) await this._object.updateProps(props, options);
    if (state) await this._object.updateState(state, options);
  }

  async destroy() {
    this.allLines.forEach(line => this._patcher.deleteLine(line.id));
    await this._object.destroy();
    delete this._patcher.boxes[this.id];
    return this;
  }

  static parseObjText(strIn) {
    const REGEX = /`([^`]*)`|[^\s]+/gi;
    const strArray = [];
    let match = REGEX.exec(strIn);

    while (match != null) {
      // Index 1 in the array is the captured group if it exists
      // Index 0 is the matched text, which we use if no captured group exists
      strArray.push(match[1] ? match[1] : match[0]); // Each call to exec returns the next regex match as an array

      match = REGEX.exec(strIn);
    }

    const objOut = {
      class: "",
      args: [],
      props: {}
    };
    let lastProp;
    if (strArray.length) objOut.class = strArray.shift();

    while (strArray.length) {
      const el = strArray.shift();

      if (typeof lastProp === "undefined" && el.charAt(0) !== "@") {
        // is arg, to push
        try {
          objOut.args.push(JSON.parse(el));
        } catch (e) {
          objOut.args.push(el);
        }

        continue;
      }

      if (el.length > 1 && el.charAt(0) === "@") {
        // is prop key
        lastProp = el.substr(1);
        objOut.props[lastProp] = [];
        continue;
      }

      try {
        // is prop value
        objOut.props[lastProp].push(JSON.parse(el));
      } catch (e) {
        objOut.props[lastProp].push(el);
      }
    }

    for (const key in objOut.props) {
      // no value = true, one value need to parse, else array
      if (objOut.props[key].length === 0) objOut.props[key] = true;else if (objOut.props[key].length === 1) objOut.props[key] = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseToPrimitive)(objOut.props[key][0]);else objOut.props[key] = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseToPrimitive)(objOut.props[key].join(" "));
    }

    return objOut;
  }

  toString() {
    const {
      id,
      text,
      inlets,
      outlets,
      rect,
      background,
      presentation,
      presentationRect,
      args,
      props,
      data
    } = this;
    return JSON.stringify({
      id,
      text,
      inlets,
      outlets,
      rect,
      background,
      presentation,
      presentationRect,
      args,
      props,
      data
    });
  }

  toSerializable() {
    return JSON.parse(this.toString());
  }

}

/***/ }),

/***/ "./src/core/patcher/FaustPatcherAnalyser.ts":
/*!**************************************************!*\
  !*** ./src/core/patcher/FaustPatcherAnalyser.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toFaustLambda": () => (/* binding */ toFaustLambda),
/* harmony export */   "toFaustDspCode": () => (/* binding */ toFaustDspCode),
/* harmony export */   "inspectFaustPatcher": () => (/* binding */ inspectFaustPatcher)
/* harmony export */ });
const mapLines = (box, patcher, visitedBoxes, ins, recs, lineMap) => {
  if (visitedBoxes.indexOf(box) >= 0) return;
  visitedBoxes.push(box);
  if (box.object.class === "Iterator" && box !== visitedBoxes[0]) return;
  const inletLines = Array.from(box.inletLines);

  if (box.object.class === "Receive") {
    const {
      sendID,
      state: {
        sendMap
      }
    } = box.object;

    if (sendMap[sendID]) {
      sendMap[sendID].forEach(s => inletLines.push(...s.inletLines));
    }
  }

  inletLines.forEach(lines => lines.forEach(line => {
    const {
      srcBox
    } = line;
    if (srcBox.object.class === "In" && ins.indexOf(srcBox.object) === -1) ins.push(srcBox.object);else if (srcBox.object.class === "Rec" && recs.indexOf(srcBox.object) === -1) recs.push(srcBox.object);
    if (srcBox.object.class === "Effect") lineMap.set(line, "_");else lineMap.set(line, "".concat(srcBox.object.resultID, "_").concat(line.srcOutlet));
    mapLines(srcBox, patcher, visitedBoxes, ins, recs, lineMap);
  }));
};

const toFaustLambda = (patcher, outs, lambdaName) => {
  const exprs = [];
  const onces = [];
  const mainIns = [];
  const mainOuts = [];
  const recIns = [];
  const recOuts = [];
  const visitedBoxes = [];
  let ins = [];
  const recs = [];
  const lineMap = new Map(); // Build graph

  outs.forEach(out => mapLines(out.box, patcher, visitedBoxes, ins, recs, lineMap));
  visitedBoxes.forEach(box => {
    if (box.object.class === "In") return;
    if (box.object.class === "Out") return;
    if (box.object.class === "Rec") return;
    if (outs.indexOf(box.object) !== -1) return;
    const {
      onces: o,
      exprs: e
    } = box.object.toExpr(lineMap);
    if (o) onces.push(...o.filter(v => onces.indexOf(v) === -1));
    if (e) exprs.push(...e);
  }); // Reverse order for readibility

  exprs.reverse(); // Build rec in/outs

  recs.forEach(rec => {
    exprs.push(...(rec.toExpr(lineMap).exprs || []));
    const recIn = rec.resultID;
    const recOut = "".concat(recIn, "_0");
    recIns.push(recIn);
    recOuts.push(recOut);
  }); // Build main in/outs

  ins = ins.sort((a, b) => a.index - b.index);
  ins.forEach(in_ => {
    const id = "".concat(in_.resultID, "_0");
    if (mainIns.indexOf(id) === -1) mainIns.push(id);
  });
  outs.forEach(out => {
    if (out.class === "Iterator") exprs.push(...(out.toNormalExpr(lineMap).exprs || []));else exprs.push(...(out.toExpr(lineMap).exprs || []));
    const id = out.resultID;
    if (mainIns.indexOf(id) === -1) mainOuts.push(id);
  }); // Generate Final expressions

  exprs.forEach((s, i) => exprs[i] = "    ".concat(s.replace(/\n/g, "\n    "))); // indent

  if (recIns.length) {
    exprs.unshift("Main(".concat([...recOuts, ...mainIns].join(", "), ") = ").concat([...recIns, ...mainOuts].join(", "), " with {"));
    exprs.push("};", "Rec = ".concat(recIns.map(() => "_").join(", "), " : ").concat(recOuts.map(() => "_").join(", "), ";"), "".concat(lambdaName, " = Main ~ Rec : ").concat([...recIns.map(() => "!"), ...mainOuts.map(() => "_")].join(", "), ";"));
  } else if (mainIns.length) {
    exprs.unshift("".concat(lambdaName, "(").concat(mainIns.join(", "), ") = ").concat(mainOuts.join(", "), " with {"));
    exprs.push("};");
  } else if (exprs.length) {
    exprs.unshift("".concat(lambdaName, " = ").concat(mainOuts.join(", "), " with {"));
    exprs.push("};");
  } else {
    exprs.push("".concat(lambdaName, " = 0;"));
  }

  return {
    onces,
    exprs,
    ins,
    outs
  };
};
const toFaustDspCode = patcher => inspectFaustPatcher(patcher).code;
const inspectFaustPatcher = patcher => {
  const imports = [];
  let outs = [];
  const effects = []; // Find outs and imports

  for (const boxId in patcher.boxes) {
    const box = patcher.boxes[boxId];
    if (box.object.class === "Effect") effects.push(box.object);else if (box.object.class === "Out") outs.push(box.object);else if (box.object.class === "Import") imports.push(box.object);
  }

  outs = outs.sort((a, b) => a.index - b.index);
  const {
    onces,
    exprs,
    ins
  } = toFaustLambda(patcher, outs, "process");

  if (effects.length) {
    const {
      onces: fxOnces,
      exprs: fxExprs,
      ins: fxIns
    } = toFaustLambda(patcher, [effects[0]], "effect");
    onces.push(...fxOnces.filter(v => onces.indexOf(v) === -1));
    exprs.push(...fxExprs);
    ins.push(...fxIns);
  }

  imports.map(i => i.toOnceExpr()).forEach(o => onces.push(...o.filter(v => onces.indexOf(v) === -1)));
  const code = "".concat(onces.join("\n")).concat(onces.length ? "\n" : "").concat(exprs.join("\n"), "\n");
  return {
    code,
    onces,
    exprs,
    ins,
    outs
  };
};

/***/ }),

/***/ "./src/core/patcher/Line.ts":
/*!**********************************!*\
  !*** ./src/core/patcher/Line.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Line)
/* harmony export */ });
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Line extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  static isConnectableByAudio(from, outlet, to, inlet) {
    const fromConnection = from.outletAudioConnections[outlet];
    const toConnection = to.inletAudioConnections[inlet];
    if (!fromConnection) return false;
    if (!toConnection) return false;
    if (!fromConnection.node) return false;
    if (!toConnection.node) return false;
    return true;
  }

  static isWamNode(x) {
    var _x$module;

    return typeof x === "object" && x !== null && (x === null || x === void 0 ? void 0 : (_x$module = x.module) === null || _x$module === void 0 ? void 0 : _x$module.isWebAudioModule);
  }

  static compare(line1, line2) {
    return line2.positionHash - line1.positionHash;
  }

  constructor(patcherIn, lineIn) {
    super();

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "src", void 0);

    _defineProperty(this, "dest", void 0);

    _defineProperty(this, "disabled", true);

    _defineProperty(this, "_type", void 0);

    _defineProperty(this, "_patcher", void 0);

    _defineProperty(this, "updateType", () => {
      const type = this.calcType();

      if (type !== this._type) {
        this._type = type;
        this.emit("typeChanged", type);
      }
    });

    this.id = lineIn.id;
    this.src = lineIn.src;
    this.dest = lineIn.dest;
    this.disabled = true;
    this._patcher = patcherIn;
    const {
      srcBox,
      destBox
    } = this;
    this._type = this.calcType();

    if (srcBox) {
      srcBox.on("metaUpdated", this.updateType);
      srcBox.addOutletLine(this);
    }

    if (destBox) {
      destBox.on("metaUpdated", this.updateType);
      destBox.addInletLine(this);
    }
  }

  get isConnectableByAudio() {
    if (this._patcher.props.mode !== "js") return false;
    return Line.isConnectableByAudio(this.srcBox.object, this.srcOutlet, this.destBox.object, this.destInlet);
  }

  get presentation() {
    return this.srcBox && this.srcBox.presentation && this.destBox && this.destBox.presentation;
  }

  setSrc(src) {
    const srcId = src[0];
    const srcOutlet = src[1];
    if (srcId === this.src[0] && srcOutlet === this.src[1]) return this;
    this.srcBox.off("metaUpdated", this.updateType);
    this.disable();
    this.srcBox.removeOutletLine(this);
    this.src = [srcId, srcOutlet];
    this.srcBox.addOutletLine(this);
    this.enable();
    this.srcBox.on("metaUpdated", this.updateType);
    this.updateType();
    return this.uiUpdateSrc();
  }

  getSrc() {
    return this.src;
  }

  uiUpdateSrc() {
    this.emit("srcPosChanged", this.srcPos);
    return this;
  }

  setDest(dest) {
    const destId = dest[0];
    const destInlet = dest[1];
    if (destId === this.dest[0] && destInlet === this.dest[1]) return this;
    this.destBox.off("metaUpdated", this.updateType);
    this.disable();
    this.destBox.removeInletLine(this);
    this.dest = [destId, destInlet];
    this.destBox.addInletLine(this);
    this.enable();
    this.destBox.on("metaUpdated", this.updateType);
    this.updateType();
    return this.uiUpdateDest();
  }

  getDest() {
    return this.dest;
  }

  uiUpdateDest() {
    this.emit("destPosChanged", this.destPos);
    return this;
  }

  disable(bool) {
    if (bool === false) return this.enable();
    if (this.disabled) return this;
    this.disabled = true;
    const {
      srcBox,
      destBox
    } = this;
    if (this._patcher.getLinesByBox(this.srcId, this.destId, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable

    if (this.isConnectableByAudio) {
      const from = this.srcBox.object.outletAudioConnections[this.srcOutlet];
      const to = this.destBox.object.inletAudioConnections[this.destInlet];

      if (from && to && from.node && to.node) {
        const isAudioParam = to.node instanceof AudioParam;

        try {
          if (isAudioParam) from.node.disconnect(to.node, from.index);else from.node.disconnect(to.node, from.index, to.index);
          if (Line.isWamNode(from.node) && Line.isWamNode(to.node)) from.node.disconnectEvents(to.node);
        } catch (e) {
          this._patcher.error(e.message);
        }
      }
    }

    srcBox.disconnectedOutlet(this.srcOutlet, destBox.id, this.destInlet, this.id);
    destBox.disconnectedInlet(this.destInlet, srcBox.id, this.srcOutlet, this.id);
    return this;
  }

  enable(bool) {
    if (bool === false) return this.disable();
    if (!this.disabled) return this;
    const {
      srcBox,
      destBox
    } = this;
    if (this.srcOutlet >= srcBox.outlets || this.destInlet >= destBox.inlets) return this._patcher.deleteLine(this.id);
    if (this._patcher.getLinesByBox(this.srcId, this.destId, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable

    if (this.isConnectableByAudio) {
      const from = this.srcBox.object.outletAudioConnections[this.srcOutlet];
      const to = this.destBox.object.inletAudioConnections[this.destInlet];

      if (from && to && from.node && to.node) {
        const isAudioParam = to.node instanceof AudioParam;

        try {
          if (isAudioParam) from.node.connect(to.node, from.index);else from.node.connect(to.node, from.index, to.index);
          if (Line.isWamNode(from.node) && Line.isWamNode(to.node)) from.node.connectEvents(to.node);
        } catch (e) {
          this._patcher.error(e.message);
        }
      }
    }

    srcBox.connectedOutlet(this.srcOutlet, destBox.id, this.destInlet, this.id);
    destBox.connectedInlet(this.destInlet, srcBox.id, this.srcOutlet, this.id);
    this.disabled = false;
    return this;
  }

  destroy() {
    this.destBox.off("metaUpdated", this.updateType);
    this.srcBox.off("metaUpdated", this.updateType);
    this.disable();
    this.srcBox.removeOutletLine(this);
    this.destBox.removeInletLine(this);
    delete this._patcher.lines[this.id];
    return this;
  }

  pass(data) {
    this.emit("passData", data);
    return this.disabled ? this : this.destBox.fn(this.destInlet, data);
  }

  get positionHash() {
    const {
      top,
      left
    } = this._patcher.boxes[this.dest[0]].getInletPos(this.dest[1]);

    return left * 65536 + top;
  }

  get srcPos() {
    return this._patcher.boxes[this.src[0]].getOutletPos(this.src[1]);
  }

  get destPos() {
    return this._patcher.boxes[this.dest[0]].getInletPos(this.dest[1]);
  }

  get srcId() {
    return this.src[0];
  }

  get srcOutlet() {
    return this.src[1];
  }

  get destId() {
    return this.dest[0];
  }

  get destInlet() {
    return this.dest[1];
  }

  get srcBox() {
    return this._patcher.boxes[this.src[0]];
  }

  get destBox() {
    return this._patcher.boxes[this.dest[0]];
  }

  calcType() {
    const srcMeta = this.srcBox.object.meta.outlets;
    const destMeta = this.destBox.object.meta.inlets;
    let srcType = "anything";
    let destType = "anything";
    if (srcMeta[this.srcOutlet]) srcType = srcMeta[this.srcOutlet].type;else if (srcMeta[srcMeta.length - 1] && srcMeta[srcMeta.length - 1].varLength) srcType = srcMeta[srcMeta.length - 1].type;
    if (destMeta[this.destInlet]) destType = destMeta[this.destInlet].type;else if (destMeta[destMeta.length - 1] && destMeta[destMeta.length - 1].varLength) destType = destMeta[destMeta.length - 1].type;
    return srcType === "signal" && destType === "signal" ? "audio" : "normal";
  }

  get type() {
    return this._type;
  }

  toString() {
    return JSON.stringify(this.toSerializable());
  }

  toSerializable() {
    const {
      id,
      src,
      dest,
      disabled
    } = this;
    return {
      id,
      src: [...src],
      dest: [...dest],
      disabled
    };
  }

}

/***/ }),

/***/ "./src/core/patcher/Patcher.ts":
/*!*************************************!*\
  !*** ./src/core/patcher/Patcher.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Patcher)
/* harmony export */ });
/* harmony import */ var _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/FileInstance */ "./src/core/file/FileInstance.ts");
/* harmony import */ var _PatcherEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PatcherEditor */ "./src/core/patcher/PatcherEditor.ts");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Line */ "./src/core/patcher/Line.ts");
/* harmony import */ var _Box__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Box */ "./src/core/patcher/Box.ts");
/* harmony import */ var _PatcherHistory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PatcherHistory */ "./src/core/patcher/PatcherHistory.ts");
/* harmony import */ var _PackageManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../PackageManager */ "./src/core/PackageManager.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _FaustPatcherAnalyser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./FaustPatcherAnalyser */ "./src/core/patcher/FaustPatcherAnalyser.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









class Patcher extends _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__.default {
  static async fromProjectItem(options) {
    return new this(options).init();
  }

  async getEditor() {
    const editor = new _PatcherEditor__WEBPACK_IMPORTED_MODULE_1__.default(this);
    return editor.init();
  }

  constructor(options) {
    super(options);

    _defineProperty(this, "lines", {});

    _defineProperty(this, "boxes", {});

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_state", void 0);

    _defineProperty(this, "_inletAudioConnections", []);

    _defineProperty(this, "_outletAudioConnections", []);

    _defineProperty(this, "_history", new _PatcherHistory__WEBPACK_IMPORTED_MODULE_4__.default());

    this._state = {
      name: "patcher",
      isReady: false,
      log: [],
      selected: [],
      pkgMgr: undefined,
      preventEmitChanged: false
    };
    this.lines = {};
    this.boxes = {};
    this.props = {
      mode: "js",
      dependencies: Patcher.props.dependencies.default.slice(),
      bgColor: Patcher.props.bgColor.default,
      editingBgColor: Patcher.props.editingBgColor.default,
      grid: Patcher.props.grid.default.slice(),
      openInPresentation: Patcher.props.openInPresentation.default,
      boxIndexCount: 0,
      lineIndexCount: 0
    };
  }

  get state() {
    return this._state;
  }

  get activePkg() {
    return this._state.pkgMgr.pkg;
  }

  get activeLib() {
    return this._state.pkgMgr.lib;
  }

  get isReady() {
    return true;
  }

  get audioCtx() {
    var _this$project;

    return ((_this$project = this.project) === null || _this$project === void 0 ? void 0 : _this$project.audioCtx) || this.env.audioCtx;
  }

  get fileExtension() {
    return {
      js: "jspat",
      max: "maxpat",
      gen: "gendsp",
      faust: "dsppat",
      jsaw: "jsdsp"
    }[this.props.mode];
  }

  get fileName() {
    var _this$file;

    return ((_this$file = this.file) === null || _this$file === void 0 ? void 0 : _this$file.name) || "".concat(this._state.name, ".").concat(this.fileExtension);
  }

  emitGraphChanged() {
    if (this._state.preventEmitChanged) return;
    this.emit("graphChanged");
    this.emitChanged();
  }

  emitChanged() {
    if (this._state.preventEmitChanged) return;
    this.emit("changed");
  }

  boxChanged(boxId, changed) {
    this.emit("boxChanged", _objectSpread({
      boxId
    }, changed));
  }

  async init() {
    var _this$file2;

    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_this$file2 = this.file) === null || _this$file2 === void 0 ? void 0 : _this$file2.data;
    let fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.fileName;

    if (data instanceof ArrayBuffer) {
      if (!data.byteLength) return this.load({});
      const patcherIn = await new Response(data).json();
      const splitName = fileName.split(".");
      const ext = splitName.pop();
      const extMap = {
        json: "js",
        jspat: "js",
        maxpat: "max",
        gendsp: "gen",
        dsppat: "faust"
      };
      return this.load(patcherIn, extMap[ext] || "js");
    }

    return this.load(data || {});
  }

  async load(patcherIn, modeIn) {
    var _patcherIn$props;

    this._state.isReady = false;
    this._state.preventEmitChanged = true;
    await this.unload();

    if (typeof patcherIn !== "object") {
      this._state.isReady = true;
      this._state.preventEmitChanged = false;
      this.emit("ready");
      return this;
    }

    this.props.mode = ((_patcherIn$props = patcherIn.props) === null || _patcherIn$props === void 0 ? void 0 : _patcherIn$props.mode) || modeIn || "js";
    this.state.pkgMgr = new _PackageManager__WEBPACK_IMPORTED_MODULE_5__.default(this);
    const {
      mode
    } = this.props;
    const $init = [];
    let patcher;

    if (mode === "max" || mode === "gen") {
      if (!patcherIn.patcher) {
        patcher = patcherIn;
      } else {
        patcher = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.max2js)(patcherIn);
      }
    } else if (mode === "js" || mode === "faust" || mode === "jsaw") {
      if ("data" in patcherIn && "patcher" in patcherIn) {
        patcher = patcherIn.patcher;
      } else {
        patcher = patcherIn;
      }
    }

    if (patcher.props) this.props = _objectSpread(_objectSpread(_objectSpread({}, this.props), patcher.props), {}, {
      mode
    });
    if (Array.isArray(this.props.bgColor)) this.props.bgColor = "rgba(".concat(this.props.bgColor.join(", "), ")");
    if (Array.isArray(this.props.editingBgColor)) this.props.editingBgColor = "rgba(".concat(this.props.editingBgColor.join(", "), ")");

    if (mode === "js" && this.props.dependencies) {
      const {
        dependencies
      } = this.props;

      if (!Array.isArray(dependencies)) {
        this.props.dependencies = [];

        for (const key in dependencies) {
          this.props.dependencies.push([key, dependencies[key]]);
        }
      }
    }

    await this._state.pkgMgr.init();

    if (patcher.boxes) {
      // Boxes & data
      for (const id in patcher.boxes) {
        const $ = this.createBox(patcher.boxes[id]);
        $init.push($);
        const numID = parseInt(id.match(/\d+/)[0]);
        if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
      }
    }

    await Promise.all($init);

    if (patcher.lines) {
      // Lines
      for (const id in patcher.lines) {
        this.createLine(patcher.lines[id]);
        const numID = parseInt(id.match(/\d+/)[0]);
        if (numID > this.props.lineIndexCount) this.props.lineIndexCount = numID;
      }
    }

    this._state.isReady = true;
    this._state.preventEmitChanged = false;
    this.emitGraphChanged();
    this.emit("ready");
    await Promise.all(Object.keys(this.boxes).map(id => this.boxes[id].postInit()));
    this.emit("postInited");
    return this;
  }

  async getPatcherNode() {
    let inputs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
    let outputs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    if (this.props.mode === "jsaw" && this.env.thread === "main") {
      var _this$file3;

      const PatcherNode = (await __webpack_require__.e(/*! import() */ "src_core_worklets_PatcherNode_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../worklets/PatcherNode */ "./src/core/worklets/PatcherNode.ts"))).default;
      await PatcherNode.register(this.audioCtx.audioWorklet);
      this.state.patcherNode = new PatcherNode(this.audioCtx, {
        env: this.env,
        instanceId: this.id,
        fileId: (_this$file3 = this.file) === null || _this$file3 === void 0 ? void 0 : _this$file3.id,
        data: this.file ? undefined : this.toSerializable(),
        inputs,
        outputs
      });
      await this.state.patcherNode.init();
      return this.state.patcherNode;
    }

    return null;
  }

  async loadFromURL(url) {
    try {
      const file = await fetch(url);
      const parsed = await file.json();
      return this.load(parsed);
    } catch (e) {
      this.error("Fetch file ".concat(url, " failed."));
    }

    return this;
  }

  async loadFromString(sIn) {
    try {
      const parsed = JSON.parse(sIn);
      return this.load(parsed);
    } catch (e) {
      this.error("Load from string: ".concat(sIn.slice(20), "... failed."));
    }

    return this;
  }

  async loadFromFile(file) {
    const splitName = file.name.split(".");
    const ext = splitName.pop();
    const name = splitName.join(".");
    const extMap = {
      json: "js",
      jspat: "js",
      maxpat: "max",
      gendsp: "gen",
      dsppat: "faust"
    };
    if (!extMap[ext]) return this;
    const reader = new FileReader();

    reader.onload = () => {
      let parsed;

      try {
        parsed = JSON.parse(reader.result.toString());
      } catch (e) {
        this.error(e.message);
      }

      if (parsed) {
        this.load(parsed, extMap[ext]);
        this._state.name = name;
      }
    };

    reader.onerror = () => this.error(reader.error.message);

    reader.readAsText(file, "UTF-8");
    return this;
  }

  async unload() {
    await this.emit("unload");

    if (Object.keys(this.boxes).length) {
      this._state.preventEmitChanged = true;
      await Promise.all(Object.keys(this.boxes).map(id => this.boxes[id].destroy()));
      this._state.preventEmitChanged = false;
      this.emitGraphChanged();
    }

    this.lines = {};
    this.boxes = {};
    this.props = {
      mode: "js",
      dependencies: Patcher.props.dependencies.default.slice(),
      bgColor: Patcher.props.bgColor.default,
      editingBgColor: Patcher.props.editingBgColor.default,
      grid: Patcher.props.grid.default.slice(),
      openInPresentation: Patcher.props.openInPresentation.default,
      boxIndexCount: 0,
      lineIndexCount: 0
    };
    this._state.selected = [];
  }

  async destroy() {
    await this.unload();
    await super.destroy();
  }

  async addPackage(namespace, url) {
    const {
      dependencies
    } = this.props;
    dependencies.push([namespace, url]);
    this.setProps({
      dependencies: dependencies.slice()
    });
    await this.state.pkgMgr.init();

    if (!(namespace in this.activePkg)) {
      this.setProps({
        dependencies: dependencies.filter(_ref => {
          let [id] = _ref;
          return id !== namespace;
        })
      });
    }
  }

  async removePackage(id) {
    const {
      dependencies
    } = this.props;
    const i = dependencies.findIndex(t => t[0] === id);
    if (i === -1) return;
    dependencies.splice(i, 1);
    this.setProps({
      dependencies: dependencies.slice()
    });
    await this.state.pkgMgr.init();
  }

  async createBox(boxIn) {
    if (!boxIn.id || boxIn.id in this.boxes) boxIn.id = "box-" + ++this.props.boxIndexCount;
    const box = new _Box__WEBPACK_IMPORTED_MODULE_3__.default(this, boxIn);
    this.boxes[box.id] = box;
    await box.init();
    this.emitGraphChanged();
    return box;
  }

  getObjectConstructor(parsed) {
    const className = parsed.class;
    if (typeof className !== "string" || className.length === 0) return this.activeLib.EmptyObject;
    if (this.activeLib[className]) return this.activeLib[className];
    this.error("Object ".concat(className, " not found."));
    return this.activeLib.InvalidObject;
  }

  getObjectMeta(parsed) {
    return this.getObjectConstructor(parsed).meta;
  }

  async changeBoxText(boxId, text) {
    const oldText = this.boxes[boxId].text;
    if (oldText === text) return this.boxes[boxId];
    await this.boxes[boxId].changeText(text);
    this.emit("changeBoxText", {
      oldText,
      text,
      boxId
    });
    return this.boxes[boxId];
  }

  async deleteBox(boxId) {
    const box = this.boxes[boxId];
    if (!box) return null;
    await box.destroy();
    this.emitGraphChanged();
    return box;
  }

  createLine(lineIn) {
    if (!this.canCreateLine(lineIn)) return null;
    if (!lineIn.id || lineIn.id in this.lines) lineIn.id = "line-" + ++this.props.lineIndexCount;
    const line = new _Line__WEBPACK_IMPORTED_MODULE_2__.default(this, lineIn);
    this.lines[line.id] = line;
    line.enable();
    this.emitGraphChanged();
    return line;
  }

  canCreateLine(lineIn) {
    if (lineIn.src[1] >= this.boxes[lineIn.src[0]].outlets) return false;
    if (lineIn.dest[1] >= this.boxes[lineIn.dest[0]].inlets) return false;
    if (this.getLinesByBox(lineIn.src[0], lineIn.dest[0], lineIn.src[1], lineIn.dest[1]).length > 0) return false;
    return true;
  }

  deleteLine(lineId) {
    const line = this.lines[lineId];
    if (!line) return null;
    line.destroy();
    if (!this._state.preventEmitChanged) this.emit("passiveDeleteLine", line);
    this.emitGraphChanged();
    return line;
  }

  changeLineSrc(lineId, srcId, srcOutlet) {
    const line = this.lines[lineId]; // if (this.instance.getLinesByBox(srcId, line.destId, srcOutlet, line.destInlet).length > 0) return line;

    const oldSrc = [line.srcId, line.srcOutlet];
    const src = [srcId, srcOutlet];
    line.setSrc(src);
    this.emitGraphChanged();
    return {
      lineId,
      oldSrc,
      src
    };
  }

  changeLineDest(lineId, destId, destOutlet) {
    const line = this.lines[lineId]; // if (this.getLinesByBox(line.srcId, destId, line.destInlet, destOutlet).length > 0) return line;

    const oldDest = [line.destId, line.destInlet];
    const dest = [destId, destOutlet];
    line.setDest(dest);
    this.emitGraphChanged();
    return {
      lineId,
      oldDest,
      dest
    };
  }

  getLinesBySrcID(srcId) {
    const result = [];

    for (let i = 0; i < this.boxes[srcId].outlets; i++) {
      // Array.fill fills the array with same instance
      result[i] = [];
    }

    for (const id in this.lines) {
      const line = this.lines[id];

      if (line && line.srcId === srcId) {
        const srcOutlet = line.srcOutlet;
        if (!result[srcOutlet]) result[srcOutlet] = [id];else result[srcOutlet].push(id);
      }
    }

    return result;
  }

  getLinesByDestID(destId) {
    const result = [];

    for (let i = 0; i < this.boxes[destId].inlets; i++) {
      result[i] = [];
    }

    for (const id in this.lines) {
      const line = this.lines[id];

      if (line && line.destId === destId) {
        const destInlet = line.destInlet;
        if (!result[destInlet]) result[destInlet] = [id];else result[destInlet].push(id);
      }
    }

    return result;
  }

  getLinesByBox(srcId, destId, srcOutlet, destInlet) {
    const result = [];
    let srcOuts = [];
    let destIns = [];
    const srcOutsWraped = this.getLinesBySrcID(srcId);
    if (srcOutlet !== undefined) srcOuts = srcOutsWraped[srcOutlet];else srcOutsWraped.forEach(el => srcOuts = srcOuts.concat(el));
    const destInsWraped = this.getLinesByDestID(destId);
    if (destInlet !== undefined) destIns = destInsWraped[destInlet];else destInsWraped.forEach(el => destIns = destIns.concat(el));
    if (!srcOuts || !destIns) return result;
    srcOuts.forEach(idOut => destIns.forEach(idIn => idIn === idOut ? result.push(idIn) : undefined));
    return result;
  }

  fn(data, inlet) {
    this.emit("dataInput", {
      data,
      inlet
    });
  }

  inputAudio(input, buffer) {
    this.emitSync("audioInput", {
      input,
      buffer
    });
  }

  inputParam(param, buffer) {
    this.emitSync("paramInput", {
      param,
      buffer
    });
  }

  outputAudio(output, buffer) {
    this.emitSync("audioOutput", {
      output,
      buffer
    });
  }

  outlet(outlet, data) {
    this.emit("dataOutput", {
      data,
      outlet
    });
  }

  get inletAudioConnections() {
    return this._inletAudioConnections;
  }

  get outletAudioConnections() {
    return this._outletAudioConnections;
  }

  connectAudioInlet(index) {
    this.emit("connectAudioInlet", index);
  }

  connectAudioOutlet(index) {
    this.emit("connectAudioOutlet", index);
  }

  disconnectAudioInlet(index) {
    this.emit("disconnectAudioInlet", index);
  }

  disconnectAudioOutlet(index) {
    this.emit("disconnectAudioOutlet", index);
  }

  changeIO() {
    this.emit("ioChanged", this.meta);
  }

  inspectAudioIO() {
    const inputBoxes = [];
    const outputBoxes = [];
    const parametersBoxes = [];

    for (const boxId in this.boxes) {
      const box = this.boxes[boxId];
      const arg0 = box.args[0];
      const port = Math.max(1, ~~arg0) - 1;
      if (box.meta.isPatcherInlet === "audio") inputBoxes[port] = box;else if (box.meta.isPatcherInlet === "parameter") parametersBoxes.push([arg0, box]);else if (box.meta.isPatcherOutlet === "audio") outputBoxes[port] = box;
    }

    for (let i = 0; i < this._inletAudioConnections.length; i++) {
      if (!inputBoxes[i]) delete this._inletAudioConnections[i];
    }

    for (let i = 0; i < this._outletAudioConnections.length; i++) {
      if (!outputBoxes[i]) delete this._outletAudioConnections[i];
    }

    return {
      inputBoxes,
      outputBoxes,
      parametersBoxes
    };
  }

  get meta() {
    const {
      metaFromPatcher
    } = this;
    return _objectSpread({
      package: this.props.package || "",
      name: this.props.name || "",
      icon: null,
      author: this.props.author || "",
      version: this.props.version || "",
      description: this.props.description || "",
      isPatcherInlet: false,
      isPatcherOutlet: false
    }, metaFromPatcher);
  }

  get metaFromPatcher() {
    const inlets = [];
    const outlets = [];

    for (const boxId in this.boxes) {
      const box = this.boxes[boxId];
      const port = Math.max(1, ~~box.args[0]) - 1;
      const description = box.props.description || "";

      if (box.meta.isPatcherInlet === "data" && !inlets[port]) {
        inlets[port] = {
          isHot: true,
          type: box.props.type || "anything",
          description
        };
      } else if (box.meta.isPatcherInlet === "audio") {
        inlets[port] = {
          isHot: true,
          type: "signal",
          description
        };
      } else if (box.meta.isPatcherOutlet === "data" && !outlets[port]) {
        outlets[port] = {
          type: box.props.type || "anything",
          description
        };
      } else if (box.meta.isPatcherOutlet === "audio") {
        outlets[port] = {
          type: "signal",
          description
        };
      }
    }

    return {
      inlets,
      outlets,
      args: [],
      props: {}
    };
  }

  log(message) {
    this.newLog("none", "Patcher", message, this);
  }

  error(message) {
    this.newLog("error", "Patcher", message, this);
  }

  newLog(errorLevel, title, message, emitter) {
    this.env.newLog(errorLevel, title, message, emitter);
  }

  setProps(props) {
    let changed = false;

    for (const keyIn in props) {
      const key = keyIn;
      if (this.props[key] === props[key]) continue;
      changed = true;
      this.props[key] = props[key];
      this.emit(key, props[key]);
    }

    if (changed) {
      this.emit("propsChanged", props);
      this.emitChanged();
    }
  }

  get publicProps() {
    const {
      dependencies,
      bgColor,
      editingBgColor,
      grid,
      openInPresentation
    } = this.props;
    return {
      dependencies,
      bgColor,
      editingBgColor,
      grid,
      openInPresentation
    };
  }

  toFaustDspCode() {
    const code = (0,_FaustPatcherAnalyser__WEBPACK_IMPORTED_MODULE_7__.toFaustDspCode)(this);
    return code;
  }

  toString(spacing) {
    if (this.props.mode === "max" || this.props.mode === "gen") {
      return JSON.stringify((0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.js2max)(this), undefined, spacing);
    }

    const {
      props
    } = this;
    const boxes = {};
    const lines = {};

    for (const id in this.boxes) {
      boxes[id] = this.boxes[id].toSerializable();
    }

    for (const id in this.lines) {
      lines[id] = this.lines[id].toSerializable();
    }

    return JSON.stringify({
      boxes,
      lines,
      props
    }, undefined, spacing);
  }

  toSerializable() {
    return JSON.parse(this.toString());
  }

  serialize() {
    return new Blob([this.toString()]).arrayBuffer();
  }

}

_defineProperty(Patcher, "props", {
  dependencies: {
    type: "object",
    description: "Patcher dependencies",
    default: []
  },
  bgColor: {
    type: "color",
    description: "Background color",
    default: "rgba(61, 65, 70, 1)"
  },
  editingBgColor: {
    type: "color",
    description: "Background color while unlocked",
    default: "rgba(82, 87, 94, 1)"
  },
  grid: {
    type: "object",
    description: "Grid size",
    default: [15, 15]
  },
  openInPresentation: {
    type: "boolean",
    description: "Open patcher in presentation",
    default: false
  }
});

/***/ }),

/***/ "./src/core/patcher/PatcherEditor.ts":
/*!*******************************************!*\
  !*** ./src/core/patcher/PatcherEditor.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherEditor)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _file_FileEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../file/FileEditor */ "./src/core/file/FileEditor.ts");
/* harmony import */ var _Box__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Box */ "./src/core/patcher/Box.ts");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Line */ "./src/core/patcher/Line.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class PatcherEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_1__.default {
  static async fromProjectItem(_ref) {
    let {
      file,
      env,
      project,
      instanceId
    } = _ref;
    const patcher = await file.instantiate({
      env,
      project,
      instanceId
    });
    const editor = new this(patcher);
    return editor.init();
  }

  get isLocked() {
    return this.state.locked;
  }

  get boxes() {
    return this.instance.boxes;
  }

  get lines() {
    return this.instance.lines;
  }

  get props() {
    return this.instance.props;
  }

  get publicProps() {
    return this.instance.publicProps;
  }

  get fileExtension() {
    return this.instance.fileExtension;
  }

  get fileName() {
    return this.instance.fileName;
  }

  get fileIcon() {
    return "sitemap";
  }

  constructor(instance) {
    super(instance);

    _defineProperty(this, "state", {
      locked: true,
      presentation: false,
      showGrid: true,
      snapToGrid: true,
      selected: []
    });

    _defineProperty(this, "handleChangeBoxText", e => this.emit("changeBoxText", e));

    _defineProperty(this, "handlePassiveDeleteLine", e => this.emit("delete", {
      boxes: {},
      lines: {
        [e.id]: e.toSerializable()
      }
    }));

    _defineProperty(this, "handleBoxChanged", e => this.emit("boxChanged", e));

    _defineProperty(this, "handleChanged", () => this.instance.emitChanged());

    const {
      openInPresentation
    } = this.props;
    this.setState({
      locked: true,
      presentation: !!openInPresentation,
      showGrid: true,
      snapToGrid: true,
      selected: []
    });
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

    this.on("changed", this.handleChanged);
    this.instance.on("changeBoxText", this.handleChangeBoxText);
    this.instance.on("passiveDeleteLine", this.handlePassiveDeleteLine);
    this.instance.on("boxChanged", this.handleBoxChanged);
    const {
      openInPresentation
    } = this.props;
    this.setState({
      locked: true,
      presentation: !!openInPresentation,
      showGrid: true,
      snapToGrid: true,
      selected: []
    });
    this._isReady = true;
    this.emit("ready");
    return this;
  }

  setState(state) {
    let changed = false;

    for (const keyIn in state) {
      const key = keyIn;
      if (this.state[key] === state[key]) continue;
      changed = true;
      if (key === "locked" || key === "presentation") this.deselectAll();
      this.state[key] = state[key];
      this.emit(key, state[key]);
    } // if (changed) this.emit("stateChanged", this.state);


    return changed;
  }

  async createBox(boxIn) {
    const box = await this.instance.createBox(boxIn);
    this.emit("create", {
      boxes: {
        [box.id]: box.toSerializable()
      },
      lines: {}
    });
    await box.postInit();
    return box;
  }

  async createBoxFromFile(file, boxIn) {
    const path = file.projectPath;
    const type = file.type;
    const ext = file.fileExtension;

    if (type === "patcher") {
      const extMap = this.props.mode === "js" ? {
        json: "p",
        jspat: "p",
        maxpat: "max",
        gendsp: "gen",
        dsppat: "pfaust"
      } : this.props.mode === "faust" ? {
        gendsp: "gen",
        dsppat: "p"
      } : this.props.mode === "gen" ? {
        gendsp: "gen"
      } : {};
      const obj = extMap[ext];
      if (obj) await this.createBox(_objectSpread({
        text: "".concat(obj, " ").concat(path)
      }, boxIn));
    } else if (type === "audio") {
      await this.createBox(_objectSpread({
        text: "buffer~ ".concat(path)
      }, boxIn));
    } else if (type === "image") {
      await this.createBox(_objectSpread({
        text: "img ".concat(path)
      }, boxIn));
    }
  }

  async deleteBox(boxId) {
    this.deselect(boxId);
    const box = await this.instance.deleteBox(boxId);
    if (!box) return null;
    this.emit("delete", {
      boxes: {
        [box.id]: box.toSerializable()
      },
      lines: {}
    });
    return box;
  }

  createLine(lineIn) {
    const line = this.instance.createLine(lineIn);
    if (!line) return null;
    this.emit("create", {
      boxes: {},
      lines: {
        [line.id]: line.toSerializable()
      }
    });
    return line;
  }

  deleteLine(lineId) {
    this.deselect(lineId);
    const line = this.instance.deleteLine(lineId);
    if (!line) return null;
    this.emit("delete", {
      boxes: {},
      lines: {
        [line.id]: line.toSerializable()
      }
    });
    return line;
  }

  changeLineSrc(lineId, srcId, srcOutlet) {
    const e = this.instance.changeLineSrc(lineId, srcId, srcOutlet);
    this.emit("changeLineSrc", e);
  }

  changeLineDest(lineId, destId, destOutlet) {
    const e = this.instance.changeLineDest(lineId, destId, destOutlet);
    this.emit("changeLineDest", e);
  }

  async changeBox(boxId, change) {
    var _this$instance$boxes$;

    await ((_this$instance$boxes$ = this.instance.boxes[boxId]) === null || _this$instance$boxes$ === void 0 ? void 0 : _this$instance$boxes$.changeObject(change));
  }

  select() {
    for (var _len = arguments.length, ids = new Array(_len), _key = 0; _key < _len; _key++) {
      ids[_key] = arguments[_key];
    }

    ids.forEach(id => {
      if (this.state.selected.indexOf(id) >= 0) return;
      if (this.boxes[id] || this.lines[id]) this.state.selected.push(id);
    });
    this.emit("selected", this.state.selected.slice());
  }

  selectAllBoxes() {
    let ids = Object.keys(this.boxes);
    if (this.state.presentation) ids = ids.filter(id => this.boxes[id].presentation);
    this.state.selected = ids;
    this.emit("selected", ids);
  }

  selectOnly() {
    this.state.selected = [];
    this.select(...arguments);
  }

  deselect() {
    for (var _len2 = arguments.length, ids = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      ids[_key2] = arguments[_key2];
    }

    ids.forEach(id => {
      const i = this.state.selected.indexOf(id);
      if (i === -1) return;
      this.state.selected.splice(i, 1);
    });
    this.emit("selected", this.state.selected.slice());
  }

  deselectAll() {
    this.state.selected = [];
    this.emit("selected", []);
  }

  selectedToString() {
    const lineSet = new Set();
    const patcher = {
      lines: {},
      boxes: {}
    };
    this.state.selected.filter(id => id.startsWith("box") && this.boxes[id]).map(id => this.boxes[id]).forEach(box => {
      box.allLines.forEach(line => lineSet.add(line));
      patcher.boxes[box.id] = box.toSerializable();
    });
    lineSet.forEach(line => {
      if (patcher.boxes[line.srcId] && patcher.boxes[line.destId]) patcher.lines[line.id] = line.toSerializable();
    });
    if (!Object.keys(patcher.boxes)) return undefined;
    return JSON.stringify(patcher, undefined, 4);
  }

  async pasteToPatcher(clipboard) {
    const idMap = {};
    const pasted = {
      boxes: {},
      lines: {}
    };
    if (!clipboard || !clipboard.boxes) return pasted;
    const $init = [];
    const $postInit = [];

    if (Array.isArray(clipboard.boxes)) {
      // Max Patcher
      this.instance.state.preventEmitChanged = true;
      const maxBoxes = clipboard.boxes;

      for (let i = 0; i < maxBoxes.length; i++) {
        const maxBox = maxBoxes[i].box;
        const numID = parseInt(maxBox.id.match(/\d+/)[0]);
        let id = "box-" + numID;

        if (this.boxes[id]) {
          idMap[id] = "box-" + ++this.props.boxIndexCount;
          id = idMap[id];
        } else {
          idMap[id] = id;
          if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
        }

        const box = {
          id,
          inlets: maxBox.numinlets,
          outlets: maxBox.numoutlets,
          rect: maxBox.patching_rect,
          text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
        };
        $init.push(this.instance.createBox(box));
      }

      const createdBoxes = (await Promise.all($init)).filter(box => !!box);
      createdBoxes.forEach(box => {
        pasted.boxes[box.id] = box.toSerializable();
        $postInit.push(box.postInit());
      });

      if (Array.isArray(clipboard.lines)) {
        const maxLines = clipboard.lines;

        for (let i = 0; i < maxLines.length; i++) {
          const lineArgs = maxLines[i].patchline;
          const id = "line-" + ++this.props.lineIndexCount;
          const line = {
            id,
            src: [idMap[lineArgs.source[0].replace(/obj/, "box")], lineArgs.source[1]],
            dest: [idMap[lineArgs.destination[0].replace(/obj/, "box")], lineArgs.destination[1]]
          };
          const createdLine = this.instance.createLine(line);
          if (createdLine) pasted.lines[createdLine.id] = createdLine.toSerializable();
        }
      }

      this.instance.state.preventEmitChanged = false;

      if (Object.keys(pasted.boxes).length) {
        this.deselectAll();
        this.select(...Object.keys(pasted.boxes));
        this.emit("create", pasted);
        this.instance.emitGraphChanged();
        await Promise.all($postInit);
      }

      return pasted;
    }

    if (Array.isArray(clipboard.boxes) || Array.isArray(clipboard.lines)) return pasted;
    this.instance.state.preventEmitChanged = true;

    for (const boxId in clipboard.boxes) {
      const box = clipboard.boxes[boxId];

      if (this.boxes[box.id]) {
        idMap[box.id] = "box-" + ++this.props.boxIndexCount;
        box.id = idMap[box.id];
      } else {
        idMap[box.id] = box.id;
        const numID = parseInt(box.id.match(/\d+/)[0]);
        if (numID > this.props.boxIndexCount) this.props.boxIndexCount = numID;
      }

      box.rect = [box.rect[0] + 30, box.rect[1] + 30, box.rect[2], box.rect[3]];
      $init.push(this.instance.createBox(box));
    }

    const createdBoxes = (await Promise.all($init)).filter(box => !!box);
    createdBoxes.forEach(box => {
      pasted.boxes[box.id] = box.toSerializable();
      $postInit.push(box.postInit());
    });
    await Promise.all($postInit);

    for (const lineId in clipboard.lines) {
      const line = clipboard.lines[lineId];
      line.id = "line-" + ++this.props.lineIndexCount;
      line.src[0] = idMap[line.src[0]];
      line.dest[0] = idMap[line.dest[0]];
      const createdLine = this.instance.createLine(line);
      if (createdLine) pasted.lines[createdLine.id] = createdLine.toSerializable();
    }

    this.instance.state.preventEmitChanged = false;

    if (Object.keys(pasted.boxes).length) {
      this.deselectAll();
      this.select(...Object.keys(pasted.boxes));
      this.emit("create", pasted);
      this.instance.emitGraphChanged();
    }

    return pasted;
  }

  async create(objects) {
    const $init = [];
    const $postInit = [];
    const created = {
      boxes: {},
      lines: {}
    };

    for (const boxId in objects.boxes) {
      const boxIn = objects.boxes[boxId];
      const box = new _Box__WEBPACK_IMPORTED_MODULE_2__.default(this.instance, boxIn);
      this.boxes[box.id] = box;
      created.boxes[box.id] = box.toSerializable();
      $init.push(box.init());
      $postInit.push(box.postInit());
    }

    await Promise.all($init);
    await Promise.all($postInit);

    for (const lineId in objects.lines) {
      const lineIn = objects.lines[lineId];
      if (!this.instance.canCreateLine(lineIn)) continue;
      const line = new _Line__WEBPACK_IMPORTED_MODULE_3__.default(this.instance, lineIn);
      this.lines[line.id] = line;
      created.lines[line.id] = line.toSerializable();
      line.enable();
    }

    this.deselectAll();
    this.select(...Object.keys(objects.boxes));
    this.emit("create", created);
    this.instance.emitGraphChanged();
  }

  async deleteSelected() {
    const boxSet = new Set();
    const lineSet = new Set();
    this.state.selected.filter(id => id.startsWith("line")).forEach(id => lineSet.add(this.lines[id]));
    this.state.selected.filter(id => id.startsWith("box")).forEach(id => {
      boxSet.add(this.boxes[id]);
      this.boxes[id].allLines.forEach(line => lineSet.add(line));
    });
    if (!boxSet.size && !lineSet.size) return undefined;
    this.state.selected = [];
    const deleted = {
      boxes: {},
      lines: {}
    };
    const promises = [];
    lineSet.forEach(line => {
      deleted.lines[line.id] = line.toSerializable();
      line.destroy();
    });
    boxSet.forEach(box => {
      deleted.boxes[box.id] = box.toSerializable();
      promises.push(box.destroy());
    });
    await Promise.all(promises);
    this.emit("selected", this.state.selected.slice());
    this.emit("delete", deleted);
    this.instance.emitGraphChanged();
    return deleted;
  }

  async delete(objects) {
    const deleted = {
      boxes: {},
      lines: {}
    };

    for (const id in objects.lines) {
      deleted.lines[id] = this.lines[id].destroy().toSerializable();
    }

    const promises = [];

    for (const id in objects.boxes) {
      deleted.boxes[id] = this.boxes[id].toSerializable();
      promises.push(this.boxes[id].destroy());
    }

    await Promise.all(promises);
    this.emit("selected", this.state.selected.slice());
    this.emit("delete", deleted);
    this.instance.emitGraphChanged();
  }

  async cut() {
    if (this.state.locked) return;
    await this.copy();
    this.deleteSelected();
  }

  async copy() {
    if (this.state.locked) return;
    const s = this.selectedToString();
    if (!s) return;
    await navigator.clipboard.writeText(s);
  }

  async paste() {
    if (this.state.locked) return;
    const s = await navigator.clipboard.readText();
    if (!s) return;
    let parsed;

    try {
      parsed = JSON.parse(s);
    } catch (e) {} // eslint-disable-line no-empty


    await this.pasteToPatcher(parsed);
  }

  async duplicate() {
    if (this.state.locked) return;
    const s = this.selectedToString();
    if (!s) return;
    let parsed;

    try {
      parsed = JSON.parse(s);
    } catch (e) {} // eslint-disable-line no-empty


    await this.pasteToPatcher(parsed);
  }

  async selectAll() {
    this.selectAllBoxes();
  }

  selectRegion(selectionRect, selectedBefore) {
    let [left, top, right, bottom] = selectionRect;
    if (left > right) [left, right] = [right, left];
    if (top > bottom) [top, bottom] = [bottom, top];
    const {
      presentation
    } = this.state;
    const rectKey = presentation ? "presentationRect" : "rect";
    const select = selectedBefore.slice();

    for (const boxId in this.boxes) {
      const box = this.boxes[boxId];
      if (presentation && !box.presentation) continue;
      const rect = box[rectKey];
      if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isTRect)(rect)) continue;
      const [boxLeft, boxTop, boxWidth, boxHeight] = rect;
      const [boxRight, boxBottom] = [boxLeft + boxWidth, boxTop + boxHeight];

      if (boxLeft < right && boxTop < bottom && boxRight > left && boxBottom > top) {
        const i = select.indexOf(boxId);
        if (i === -1) select.push(boxId);else select.splice(i, 1);
      }
    }

    const deselect = this.state.selected.filter(id => select.indexOf(id) === -1);
    this.select(...select);
    this.deselect(...deselect);
  }

  moveSelectedBox(dragOffset, refBoxID) {
    const {
      presentation,
      snapToGrid,
      selected
    } = this.state;
    const rectKey = presentation ? "presentationRect" : "rect";

    const delta = _objectSpread({}, dragOffset);

    if (refBoxID) {
      const rect = this.boxes[refBoxID][rectKey];
      if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectMovable)(rect)) return {
        x: 0,
        y: 0
      };
      delta.x = snapToGrid ? Math.round((rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] : dragOffset.x;
      delta.y = snapToGrid ? Math.round((rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] : dragOffset.y;
    }

    if (!delta.x && !delta.y) return dragOffset;
    this.move(selected, delta, presentation);
    return {
      x: dragOffset.x - delta.x,
      y: dragOffset.y - delta.y
    };
  }

  moveEnd(delta) {
    const {
      presentation,
      selected
    } = this.state;
    const rectKey = presentation ? "presentationRect" : "rect";
    let ids = selected.filter(id => id.startsWith("box") && this.boxes[id]);
    if (presentation) ids = ids.filter(id => (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectMovable)(this.boxes[id][rectKey]));
    const boxes = ids.map(id => this.boxes[id]);
    boxes.forEach(box => box.emit(presentation ? "presentationRectChanged" : "rectChanged", box));
    this.emit("moved", {
      delta,
      selected: ids,
      presentation: this.state.presentation
    });
  }

  move(selected, delta, presentation) {
    this.select(...selected);
    const rectKey = presentation ? "presentationRect" : "rect";
    let ids = selected.filter(id => id.startsWith("box") && this.boxes[id]);
    if (presentation) ids = ids.filter(id => (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectMovable)(this.boxes[id][rectKey]));
    const boxes = ids.map(id => this.boxes[id]);
    if (boxes.length === 0) return;
    let [left, top] = boxes[0][rectKey];

    for (let i = 1; i < boxes.length; i++) {
      const box = boxes[i];
      const [$left, $top] = box[rectKey];
      if ($left < left) left = $left;
      if ($top < top) top = $top;
    } // Not allowing resize out of bound


    delta.x = Math.max(delta.x, -left);
    delta.y = Math.max(delta.y, -top);
    if (delta.x) boxes.forEach(box => box[rectKey][0] += delta.x);
    if (delta.y) boxes.forEach(box => box[rectKey][1] += delta.y); // Emit events

    if (!delta.x && !delta.y) return;
    if (presentation !== this.state.presentation) return; // boxes.forEach(box => box.emit(presentation ? "presentationRectChanged" : "rectChanged", box));

    this.emit("moving", {
      selected: ids,
      delta,
      presentation
    });
    if (presentation) return;
    const lineSet = new Set();
    boxes.forEach(box => {
      box.inletLines.forEach(set => set.forEach(line => lineSet.add(line)));
      box.outletLines.forEach(set => set.forEach(line => lineSet.add(line)));
    });
    lineSet.forEach(line => line.emit("posChanged", line));
  }

  resizeSelectedBox(boxId, dragOffset, type) {
    const {
      presentation,
      snapToGrid,
      selected
    } = this.state;
    const rectKey = presentation ? "presentationRect" : "rect";
    const rect = this.boxes[boxId][rectKey];
    if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectResizable)(rect)) return {
      x: 0,
      y: 0
    };
    const delta = {
      x: 0,
      y: 0
    }; // Round delta to grid

    if (type === "e" || type === "se" || type === "ne") {
      delta.x = snapToGrid ? Math.round((rect[0] + rect[2] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] - rect[2] : dragOffset.x;
    }

    if (type === "s" || type === "se" || type === "sw") {
      delta.y = snapToGrid ? Math.round((rect[1] + rect[3] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] - rect[3] : dragOffset.y;
    }

    if (type === "w" || type === "nw" || type === "sw") {
      delta.x = snapToGrid ? Math.round((rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] : dragOffset.x;
    }

    if (type === "n" || type === "nw" || type === "ne") {
      delta.y = snapToGrid ? Math.round((rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] : dragOffset.y;
    }

    if (!delta.x && !delta.y) return dragOffset;
    this.resize(selected, delta, type, presentation);
    return {
      x: dragOffset.x - delta.x,
      y: dragOffset.y - delta.y
    };
  }

  resizeEnd(delta, type) {
    const {
      selected,
      presentation
    } = this.state;
    this.emit("resized", {
      delta,
      type,
      selected,
      presentation
    });
  }

  resize(selected, delta, type, presentation) {
    this.select(...selected);
    const rectKey = presentation ? "presentationRect" : "rect";
    let ids = selected.filter(id => id.startsWith("box") && this.boxes[id]);
    if (presentation) ids = ids.filter(id => (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectResizable)(this.boxes[id][rectKey]));
    const boxes = ids.map(id => this.boxes[id]);
    if (boxes.length === 0) return;
    let [left, top, width, height] = boxes[0][rectKey];

    for (let i = 1; i < boxes.length; i++) {
      const box = boxes[i];
      const [$left, $top, $width, $height] = box[rectKey];
      if ($left < left) left = $left;
      if ($top < top) top = $top;
      if ($width < width) width = $width;
      if ($height < height) height = $height;
    } // Not allowing resize out of bound


    if (type === "sw" || type === "w" || type === "nw") delta.x = Math.max(delta.x, -left);
    if (type === "nw" || type === "n" || type === "ne") delta.y = Math.max(delta.y, -top); // Not allowing resize below 15px width or height

    if (type === "ne" || type === "e" || type === "se") delta.x = Math.max(delta.x, 15 - width);
    if (type === "sw" || type === "w" || type === "nw") delta.x = Math.min(delta.x, width - 15);
    if (type === "se" || type === "s" || type === "sw") delta.y = Math.max(delta.y, 15 - height);
    if (type === "nw" || type === "n" || type === "ne") delta.y = Math.min(delta.y, height - 15);
    boxes.forEach(box => {
      var _box$UI, _box$UI2, _box$UI3, _box$UI4;

      const sizingX = box.UI ? ((_box$UI = box.UI) === null || _box$UI === void 0 ? void 0 : _box$UI.sizing) === "horizontal" || ((_box$UI2 = box.UI) === null || _box$UI2 === void 0 ? void 0 : _box$UI2.sizing) === "both" : true;
      const sizingY = box.UI ? ((_box$UI3 = box.UI) === null || _box$UI3 === void 0 ? void 0 : _box$UI3.sizing) === "vertical" || ((_box$UI4 = box.UI) === null || _box$UI4 === void 0 ? void 0 : _box$UI4.sizing) === "both" : true;

      if (delta.x && sizingX) {
        if (type === "ne" || type === "e" || type === "se") box[rectKey][2] += delta.x;

        if (type === "sw" || type === "w" || type === "nw") {
          box[rectKey][2] -= delta.x;
          box[rectKey][0] += delta.x;
        }
      }

      if (delta.y && sizingY) {
        if (type === "se" || type === "s" || type === "sw") box[rectKey][3] += delta.y;

        if (type === "nw" || type === "n" || type === "ne") {
          box[rectKey][3] -= delta.y;
          box[rectKey][1] += delta.y;
        }
      }
    }); // Emit events

    if (!delta.x && !delta.y) return;
    if (presentation !== this.state.presentation) return;
    boxes.forEach(box => box.emit(presentation ? "presentationRectChanged" : "rectChanged", box));
    if (presentation) return;
    const lineSet = new Set();
    boxes.forEach(box => {
      box.inletLines.forEach(set => set.forEach(line => lineSet.add(line)));
      box.outletLines.forEach(set => set.forEach(line => lineSet.add(line)));
    });
    lineSet.forEach(line => line.emit("posChanged", line));
  }

  findNearestPort(findSrc, left, top, from, to) {
    let nearest = [null, null];
    let minDistance = 100;

    if (to) {
      const currentPos = this.boxes[to[0]][findSrc ? "getOutletPos" : "getInletPos"](to[1]);
      const currentDistance = ((currentPos.left - left) ** 2 + (currentPos.top - top) ** 2) ** 0.5;

      if (currentDistance < 100) {
        nearest = to;
        minDistance = currentDistance;
      }
    }

    for (const id in this.boxes) {
      const box = this.boxes[id];
      box[findSrc ? "outletsPositions" : "inletsPositions"].forEach((pos, i) => {
        const distance = ((pos.left - left) ** 2 + (pos.top - top) ** 2) ** 0.5;

        if (distance < minDistance) {
          const canCreate = this.instance.canCreateLine({
            src: findSrc ? [id, i] : from,
            dest: findSrc ? from : [id, i]
          });
          if (!canCreate) return;
          nearest = [id, i];
          minDistance = distance;
        }
      });
    }

    return nearest;
  }

  highlightNearestPort(findSrc, dragOffset, from, to) {
    // to = the port need to be reconnect
    const origPos = to ? this.boxes[to[0]][findSrc ? "getOutletPos" : "getInletPos"](to[1]) : this.boxes[from[0]][findSrc ? "getInletPos" : "getOutletPos"](from[1]);
    const left = origPos.left + dragOffset.x;
    const top = origPos.top + dragOffset.y;
    const nearest = this.findNearestPort(findSrc, left, top, from, to);

    for (const id in this.boxes) {
      const box = this.boxes[id];

      for (let i = 0; i < box[findSrc ? "outlets" : "inlets"]; i++) {
        box.highlightPort(findSrc, i, nearest[0] === id && nearest[1] === i);
      }
    }

    return nearest;
  }

  tempLine(findSrc, from) {
    this.emit("tempLine", {
      findSrc,
      from
    });
    return this;
  }

  inspector(box) {
    if (box) this.emit("inspector");else if (this.state.selected.length) {
      const found = this.state.selected.find(id => id.startsWith("box"));
      if (found && this.boxes[found]) this.emit("inspector");
    }
  }

  dockUI(box) {
    if (box && box.UI.dockable) this.emit("dockUI", box.id);else if (this.state.selected.length) {
      const found = this.state.selected.find(id => id.startsWith("box"));
      if (found && this.boxes[found] && this.boxes[found].UI.dockable) this.emit("dockUI", found);
    }
  }

  onUiResized() {}

  async toTempData() {
    return this.instance.toSerializable();
  }

}

/***/ }),

/***/ "./src/core/patcher/PatcherHistory.ts":
/*!********************************************!*\
  !*** ./src/core/patcher/PatcherHistory.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherHistory)
/* harmony export */ });
/* harmony import */ var _file_History__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/History */ "./src/core/file/History.ts");

class PatcherHistory extends _file_History__WEBPACK_IMPORTED_MODULE_0__.default {
  get eventListening() {
    return ["create", "delete", "changeBoxText", "boxChanged", "changeLineSrc", "changeLineDest", "moved", "resized"];
  }

  async undoOf(editor, eventName, eventData) {
    if (eventName === "delete") {
      const e = eventData;
      await editor.create(e);
    } else if (eventName === "changeBoxText") {
      const e = eventData;
      const {
        boxId,
        oldText
      } = e;
      await editor.instance.changeBoxText(boxId, oldText);
    } else if (eventName === "boxChanged") {
      const e = eventData;
      const {
        boxId,
        oldArgs,
        oldProps,
        oldState
      } = e;
      await editor.changeBox(boxId, {
        args: oldArgs,
        props: oldProps,
        state: oldState
      });
    } else if (eventName === "moved") {
      const e = eventData;
      const {
        selected,
        delta,
        presentation
      } = e;
      const d = {
        x: -1 * delta.x,
        y: -1 * delta.y
      };
      editor.move(selected, d, presentation);
      editor.moveEnd(d);
    } else if (eventName === "changeLineSrc") {
      const e = eventData;
      const {
        lineId,
        oldSrc
      } = e;
      editor.changeLineSrc(lineId, oldSrc[0], oldSrc[1]);
    } else if (eventName === "changeLineDest") {
      const e = eventData;
      const {
        lineId,
        oldDest
      } = e;
      editor.changeLineDest(lineId, oldDest[0], oldDest[1]);
    } else if (eventName === "create") {
      const e = eventData;
      await editor.delete(e);
    } else if (eventName === "resized") {
      const e = eventData;
      const {
        selected,
        delta,
        type: t,
        presentation
      } = e;
      const d = {
        x: -1 * delta.x,
        y: -1 * delta.y
      };
      editor.resize(selected, d, t, presentation);
      editor.resizeEnd(d, t);
    }
  }

  async redoOf(editor, eventName, eventData) {
    if (eventName === "create") {
      const e = eventData;
      await editor.create(e);
    } else if (eventName === "changeBoxText") {
      const e = eventData;
      const {
        boxId,
        text
      } = e;
      await editor.instance.changeBoxText(boxId, text);
    } else if (eventName === "boxChanged") {
      const e = eventData;
      const {
        boxId,
        args,
        props,
        state
      } = e;
      await editor.changeBox(boxId, {
        args,
        props,
        state
      });
    } else if (eventName === "moved") {
      const e = eventData;
      const {
        selected,
        delta,
        presentation
      } = e;
      editor.move(selected, delta, presentation);
      editor.moveEnd(delta);
    } else if (eventName === "changeLineSrc") {
      const e = eventData;
      const {
        lineId,
        src
      } = e;
      editor.changeLineSrc(lineId, src[0], src[1]);
    } else if (eventName === "changeLineDest") {
      const e = eventData;
      const {
        lineId,
        dest
      } = e;
      editor.changeLineDest(lineId, dest[0], dest[1]);
    } else if (eventName === "delete") {
      const e = eventData;
      await editor.delete(e);
    } else if (eventName === "resized") {
      const e = eventData;
      const {
        selected,
        delta,
        type: t,
        presentation
      } = e;
      editor.resize(selected, delta, t, presentation);
      editor.resizeEnd(delta, t);
    }
  }

}

/***/ }),

/***/ "./src/core/patcher/TempPatcherFile.ts":
/*!*********************************************!*\
  !*** ./src/core/patcher/TempPatcherFile.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TempPatcherFile)
/* harmony export */ });
/* harmony import */ var _file_TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/TemporaryProjectFile */ "./src/core/file/TemporaryProjectFile.ts");

class TempPatcherFile extends _file_TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_0__.default {
  get type() {
    return "patcher";
  }

  async instantiate(_ref) {
    let {
      env,
      project,
      instanceId
    } = _ref;
    const Patcher = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./Patcher */ "./src/core/patcher/Patcher.ts"))).default;
    const patcher = new Patcher({
      file: this,
      env,
      project,
      instanceId
    });
    await patcher.load(this.data);
    return patcher;
  }

  async instantiateEditor(_ref2) {
    let {
      env,
      project,
      instanceId
    } = _ref2;
    const PatcherEditor = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./PatcherEditor */ "./src/core/patcher/PatcherEditor.ts"))).default;
    return PatcherEditor.fromProjectItem({
      file: this,
      env,
      project,
      instanceId
    });
  }

}

/***/ }),

/***/ "./src/core/text/TempTextFile.ts":
/*!***************************************!*\
  !*** ./src/core/text/TempTextFile.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TempTextFile)
/* harmony export */ });
/* harmony import */ var _file_TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/TemporaryProjectFile */ "./src/core/file/TemporaryProjectFile.ts");

class TempTextFile extends _file_TemporaryProjectFile__WEBPACK_IMPORTED_MODULE_0__.default {
  get type() {
    return "text";
  }

  async instantiate() {
    return this.data;
  }

  async instantiateEditor(_ref) {
    let {
      env,
      project,
      instanceId
    } = _ref;
    const TextEditor = (await __webpack_require__.e(/*! import() */ "src_core_text_TextEditor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./TextEditor */ "./src/core/text/TextEditor.ts"))).default;
    return TextEditor.fromProjectItem({
      file: this,
      env,
      project,
      instanceId
    });
  }

}

/***/ }),

/***/ "./src/core/worklets/AudioWorkletProxyProcessor.ts":
/*!*********************************************************!*\
  !*** ./src/core/worklets/AudioWorkletProxyProcessor.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  AudioWorkletProcessor
} = globalThis;
const Processor = class Processor extends AudioWorkletProcessor {
  static get fnNames() {
    return [];
  }

  constructor(options) {
    var _this;

    super(options);
    _this = this;

    _defineProperty(this, "_disposed", false);

    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;

    const handleDisposed = () => {
      this.port.removeEventListener("message", handleMessage);
      this.port.close();
    };

    const handleMessage = async e => {
      const {
        id,
        call,
        args,
        value,
        error
      } = e.data;

      if (call) {
        const r = {
          id
        };

        try {
          r.value = await this[call](...args);
        } catch (e) {
          r.error = e;
        }

        this.port.postMessage(r);
        if (this._disposed) handleDisposed();
      } else {
        if (error) {
          if (rejects[id]) rejects[id](error);
          delete rejects[id];
          return;
        }

        if (resolves[id]) {
          resolves[id](value);
          delete resolves[id];
        }
      }
    };

    const call = function call(_call) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return new Promise((resolve, reject) => {
        const id = messagePortRequestId--;
        resolves[id] = resolve;
        rejects[id] = reject;

        _this.port.postMessage({
          id,
          call: _call,
          args
        });
      });
    };

    const Ctor = this.constructor;
    Ctor.fnNames.forEach(name => this[name] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return call(name, ...args);
    });
    this.port.start();
    this.port.addEventListener("message", handleMessage);
  }

};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Processor);

/***/ }),

/***/ "./src/utils/TypedEventEmitter.ts":
/*!****************************************!*\
  !*** ./src/utils/TypedEventEmitter.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$AnyEventType": () => (/* binding */ $AnyEventType),
/* harmony export */   "TypedEventEmitter": () => (/* binding */ TypedEventEmitter),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const $AnyEventType = Symbol("__TypedEventListener_AnyEventType");
class TypedEventEmitter {
  constructor() {
    _defineProperty(this, "_listeners", {
      [$AnyEventType]: []
    });
  }

  get listeners() {
    return this._listeners;
  }

  getListeners(eventName) {
    if (!(eventName in this._listeners)) this._listeners[eventName] = [];
    return this._listeners[eventName];
  }

  on(eventName, listener) {
    if (this.getListeners(eventName).indexOf(listener) === -1) this.getListeners(eventName).push(listener);
  }

  once(eventName, listener) {
    const listenerWithOff = (arg, emitter) => {
      const returnValue = listener(arg, emitter);
      this.off(eventName, listenerWithOff);
      return returnValue;
    };

    this.on(eventName, listenerWithOff);
  }

  onAny(listener) {
    this._listeners[$AnyEventType].push(listener);
  }

  off(eventName, listener) {
    const i = this.getListeners(eventName).indexOf(listener);
    if (i !== -1) this.getListeners(eventName).splice(i, 1);
  }

  offAny(listener) {
    const i = this._listeners[$AnyEventType].indexOf(listener);

    if (i !== -1) this._listeners[$AnyEventType].splice(i, 1);
  }

  async emit(eventName, eventData, options) {
    var _options$exclude;

    let listeners = this.getListeners(eventName);
    let anyListeners = options !== null && options !== void 0 && options.excludeAny ? [] : this._listeners[$AnyEventType];
    if (!listeners.length && !anyListeners.length) return [];

    if (options !== null && options !== void 0 && (_options$exclude = options.exclude) !== null && _options$exclude !== void 0 && _options$exclude.length) {
      const {
        exclude
      } = options;
      listeners = listeners.filter(l => exclude.indexOf(l) === -1);
      anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
    }

    return Promise.all([...listeners.map(f => f(eventData, this)), ...anyListeners.map(f => f(eventName, eventData, this))]);
  }

  async emitSerial(eventName, eventData, options) {
    var _options$exclude2;

    let listeners = this.getListeners(eventName);
    let anyListeners = options !== null && options !== void 0 && options.excludeAny ? [] : this._listeners[$AnyEventType];
    if (!listeners.length && !anyListeners.length) return [];

    if (options !== null && options !== void 0 && (_options$exclude2 = options.exclude) !== null && _options$exclude2 !== void 0 && _options$exclude2.length) {
      const {
        exclude
      } = options;
      listeners = listeners.filter(l => exclude.indexOf(l) === -1);
      anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
    }

    const returnValues = [];

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      returnValues[i] = await listener(eventData, this);
    }

    for (let i = 0; i < anyListeners.length; i++) {
      const listener = anyListeners[i];
      returnValues[listeners.length + i] = await listener(eventName, eventData, this);
    }

    return returnValues;
  }

  emitSync(eventName, eventData, options) {
    var _options$exclude3;

    let listeners = this.getListeners(eventName);
    let anyListeners = options !== null && options !== void 0 && options.excludeAny ? [] : this._listeners[$AnyEventType];
    if (!listeners.length && !anyListeners.length) return [];

    if (options !== null && options !== void 0 && (_options$exclude3 = options.exclude) !== null && _options$exclude3 !== void 0 && _options$exclude3.length) {
      const {
        exclude
      } = options;
      listeners = listeners.filter(l => exclude.indexOf(l) === -1);
      anyListeners = anyListeners.filter(l => exclude.indexOf(l) === -1);
    }

    return [...listeners.map(f => f(eventData, this)), ...anyListeners.map(f => f(eventName, eventData, this))];
  }

  offAll(eventName) {
    if (eventName) {
      this._listeners[eventName] = [];
    } else {
      this._listeners = {
        [$AnyEventType]: []
      };
    }
  }

  listenerCount(eventName) {
    const anyListenerCount = this._listeners[$AnyEventType].length;
    if (!(eventName in this._listeners)) return anyListenerCount;
    return this._listeners[eventName].length + anyListenerCount;
  }

}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TypedEventEmitter);

/***/ }),

/***/ "./src/utils/buffer.ts":
/*!*****************************!*\
  !*** ./src/utils/buffer.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "mean": () => (/* binding */ mean),
/* harmony export */   "median": () => (/* binding */ median),
/* harmony export */   "maxIndex": () => (/* binding */ maxIndex),
/* harmony export */   "energy": () => (/* binding */ energy),
/* harmony export */   "rms": () => (/* binding */ rms),
/* harmony export */   "absMax": () => (/* binding */ absMax),
/* harmony export */   "zcr": () => (/* binding */ zcr),
/* harmony export */   "centroid": () => (/* binding */ centroid),
/* harmony export */   "conjugatedCentroid": () => (/* binding */ conjugatedCentroid),
/* harmony export */   "geometricMean": () => (/* binding */ geometricMean),
/* harmony export */   "flatness": () => (/* binding */ flatness),
/* harmony export */   "flux": () => (/* binding */ flux),
/* harmony export */   "kurtosis": () => (/* binding */ kurtosis),
/* harmony export */   "skewness": () => (/* binding */ skewness),
/* harmony export */   "rolloff": () => (/* binding */ rolloff),
/* harmony export */   "slope": () => (/* binding */ slope),
/* harmony export */   "spread": () => (/* binding */ spread),
/* harmony export */   "setTypedArray": () => (/* binding */ setTypedArray),
/* harmony export */   "getSubTypedArray": () => (/* binding */ getSubTypedArray),
/* harmony export */   "sliceBuffer": () => (/* binding */ sliceBuffer),
/* harmony export */   "fftw2Amp": () => (/* binding */ fftw2Amp),
/* harmony export */   "estimateFreq": () => (/* binding */ estimateFreq),
/* harmony export */   "indexToFreq": () => (/* binding */ indexToFreq)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./src/utils/math.ts");

const sum = function sum(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  let sum = 0;
  const l = array.length;

  for (let i = 0; i < length; i++) {
    sum += array[(from + i) % l];
  }

  return sum;
};
const mean = function mean(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  return sum(array, from, length) / length;
};
const median = function median(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  if (length === 0) throw new Error("trying to calculate median of empty array");
  const sortedArray = (from + length > array.length ? Array.isArray(array) ? array.slice(from).concat(array.slice(0, from + length - array.length)) : sliceBuffer(array, length, from) : array.slice(from, from + length)).sort();
  if (length % 2 === 0) return (sortedArray[length / 2 - 1] + sortedArray[length / 2]) / 2;
  return sortedArray[~~(length / 2)];
};
const maxIndex = function maxIndex(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  const l = array.length;
  if (!l) return 0;
  let index = 0;
  let max = array[0];
  let i = length;

  while (i-- > 1) {
    const cur = array[(from + i) % l];
    if (cur <= max) continue;
    max = cur;
    index = i;
  }

  return index;
};
const energy = function energy(signal) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : signal.length;
  let sum = 0;
  let sample = 0;
  const l = signal.length;

  for (let i = 0; i < length; i++) {
    sample = signal[(from + i) % l];
    sum += sample * sample;
  }

  return sum;
};
const rms = function rms(signal) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : signal.length;
  return Math.sqrt(energy(signal, from, length) / signal.length);
};
const absMax = function absMax(signal) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : signal.length;
  let max = 0;
  let sample = 0;
  const l = signal.length;

  for (let i = 0; i < length; i++) {
    sample = Math.abs(signal[(from + i) % l]);
    if (sample > max) max = sample;
  }

  return max;
};
const zcr = function zcr(signal) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : signal.length;
  let zcr = 0;
  let lastPositive = true;
  let positive = true;
  const l = signal.length;

  for (let i = 0; i < length; i++) {
    positive = signal[(from + i) % l] >= 0;
    if (positive !== lastPositive) zcr++;
    lastPositive = positive;
  }

  return zcr;
};
const centroid = function centroid(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  let weightedSum = 0;
  let weight = 0;
  let sample = 0;
  const l = array.length;

  for (let i = 0; i < length; i++) {
    sample = array[(from + i) % l];
    weightedSum += i * Math.abs(sample);
    weight += sample;
  }

  return weight === 0 ? 0 : weightedSum / weight;
};
const conjugatedCentroid = function conjugatedCentroid(array, factor) {
  let from = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : array.length;
  let weightedSum = 0;
  let weight = 0;
  let sample = 0;
  const l = array.length;

  for (let i = 0; i < length; i++) {
    sample = array[(from + i) % l];
    weightedSum += i ** factor * Math.abs(sample);
    weight += sample;
  }

  return weight === 0 ? 0 : weightedSum / weight;
};
const geometricMean = function geometricMean(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  let sum = 0;
  let sample = 0;
  const l = array.length;

  for (let i = 0; i < length; i++) {
    sample = array[(from + i) % l];
    if (sample <= 0) return 0;
    sum += Math.log(sample);
  }

  return Math.exp(sum / length);
};
const flatness = function flatness(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  return geometricMean(array, from, length) / mean(array, from, length);
};
/**
 * https://essentia.upf.edu/reference/std_Flux.html
 */

const flux = (cur, prev, norm, halfRectify) => {
  let flux = 0;

  if (norm === "L2") {
    if (halfRectify === true) {
      // L2 + halfRectify
      for (let i = 0; i < cur.length; i++) {
        const diff = cur[i] - prev[i];
        if (diff < 0) continue;
        flux += diff * diff;
      }

      return Math.sqrt(flux);
    }

    for (let i = 0; i < cur.length; i++) {
      // L2 not halfRectify
      const diff = cur[i] - prev[i];
      flux += diff * diff;
    }

    return Math.sqrt(flux);
  }

  if (halfRectify === true) {
    // L1 + halfRectify
    for (let i = 0; i < cur.length; i++) {
      const diff = cur[i] - prev[i];
      if (diff < 0) continue;
      flux += diff;
    }

    return flux;
  }

  for (let i = 0; i < cur.length; i++) {
    // L1 not halfRectify
    const diff = cur[i] - prev[i];
    flux += Math.abs(diff);
  }

  return flux;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralKurtosis.js=
 */

const kurtosis = function kurtosis(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  const c1 = centroid(array, from, length);
  const c2 = conjugatedCentroid(array, 2, from, length);
  const c3 = conjugatedCentroid(array, 3, from, length);
  const c4 = conjugatedCentroid(array, 4, from, length);
  const numerator = -3 * c1 ** 4 + 6 * c1 * c2 - 4 * c1 * c3 + c4;
  const denominator = (c2 - c1 ** 2) ** 2;
  return numerator / denominator;
};
/**
 * https://github.com/meyda/meyda/blob/master/src/extractors/spectralSkewness.js
 */

const skewness = function skewness(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  const c1 = centroid(array, from, length);
  const c2 = conjugatedCentroid(array, 2, from, length);
  const c3 = conjugatedCentroid(array, 3, from, length);
  const numerator = 2 * c1 ** 3 - 3 * c1 * c2 + c3;
  const denominator = (c2 - c1 ** 2) ** 1.5;
  return numerator / denominator;
};
/**
 * https://essentia.upf.edu/reference/std_RollOff.html
 *
 * @param {TypedArray} array
 * @param {number} [cutoff] Between 0 - 1
 * @returns
 */

const rolloff = function rolloff(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  let cutoff = arguments.length > 3 ? arguments[3] : undefined;
  let e = energy(array, from, length);
  const threshold = (cutoff || 0.99) * e;
  let n = length - 1;
  let element;

  while (e > threshold && n >= 0) {
    element = array[(n + from) % length];
    e -= element * element;
    --n;
  }

  return n + 1;
};
const slope = function slope(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  const xSum = n * n / 2;
  const x2Sum = (n - 1) * n * (2 * n - 1) / 6;
  let ySum = 0;
  let xySum = 0;
  let y;

  for (let x = 0; x < n; x++) {
    y = array[(x + from) % n];
    ySum += y;
    xySum += x * y;
  }

  return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
};
const spread = function spread(array) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
  return Math.sqrt(conjugatedCentroid(array, 2, from, length)) - centroid(array, from, length) ** 2;
};
/**
 * Copy buffer to another, support negative offset index
 */

const setTypedArray = (to, from, offsetTo, offsetFrom) => {
  const toLength = to.length;
  const fromLength = from.length;
  const spillLength = Math.min(toLength, fromLength);
  let spilled = 0;
  let $to = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offsetTo, toLength) || 0;
  let $from = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offsetFrom, fromLength) || 0;

  while (spilled < spillLength) {
    const $spillLength = Math.min(spillLength - spilled, toLength - $to, fromLength - $from);
    const $fromEnd = $from + $spillLength;
    if ($from === 0 && $fromEnd === fromLength) to.set(from, $to);else to.set(from.subarray($from, $fromEnd), $to);
    $to = ($to + $spillLength) % toLength;
    $from = $fromEnd % fromLength;
    spilled += $spillLength;
  }

  return $to;
};
const getSubTypedArray = function getSubTypedArray(from, length) {
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  const fromLength = from.length;
  const $ = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength) return from;
  if ($ + length < fromLength) return from.subarray($, $ + length);
  const to = new from.constructor(length);
  setTypedArray(to, from, 0, $);
  return to;
};
const sliceBuffer = (from, length, offset) => {
  const fromLength = from.length;
  const $ = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength) return from.slice();
  if ($ + length < fromLength) return from.slice($, $ + length);
  const to = new from.constructor(length);
  setTypedArray(to, from, 0, $);
  return to;
};
/**
 * http://www.fftw.org/fftw3_doc/The-Halfcomplex_002dformat-DFT.html
 */

const fftw2Amp = (from, windowEnergyFactor) => {
  const {
    length
  } = from;
  const amps = new Float32Array(length / 2);

  for (let i = 0; i < length / 2; i++) {
    const real = from[i];
    const imag = i === 0 || i === length / 2 - 1 ? 0 : from[length - i];
    amps[i] = (real * real + imag * imag) ** 0.5 / length * windowEnergyFactor;
  }

  return amps;
};
const estimateFreq = (amps, sampleRate) => indexToFreq(maxIndex(amps), amps.length, sampleRate);
const indexToFreq = (i, fftBins, sampleRate) => i % fftBins / fftBins * sampleRate / 2;

/***/ }),

/***/ "./src/utils/math.ts":
/*!***************************!*\
  !*** ./src/utils/math.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mod": () => (/* binding */ mod),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "floor": () => (/* binding */ floor),
/* harmony export */   "ceil": () => (/* binding */ ceil),
/* harmony export */   "toRad": () => (/* binding */ toRad),
/* harmony export */   "toMIDI": () => (/* binding */ toMIDI),
/* harmony export */   "atodb": () => (/* binding */ atodb),
/* harmony export */   "dbtoa": () => (/* binding */ dbtoa),
/* harmony export */   "iNormExp": () => (/* binding */ iNormExp),
/* harmony export */   "normExp": () => (/* binding */ normExp),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "scaleClip": () => (/* binding */ scaleClip),
/* harmony export */   "isIdentityMatrix": () => (/* binding */ isIdentityMatrix),
/* harmony export */   "identityMatrix": () => (/* binding */ identityMatrix)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/utils.ts");

/**
 * Mod support wrapping with negative numbers
 */

const mod = (x, y) => (x % y + y) % y;
/**
 * Round a number to multiple of another
 */

const round = (x, to) => Math.abs(to) < 1 ? Math.round(x * (1 / to)) / (1 / to) : Math.round(x / to) * to;
/**
 * Floor a number to multiple of another
 */

const floor = (x, to) => Math.abs(to) < 1 ? Math.floor(x * (1 / to)) / (1 / to) : Math.floor(x / to) * to;
/**
 * Ceil a number to multiple of another
 */

const ceil = (x, to) => Math.abs(to) < 1 ? Math.ceil(x * (1 / to)) / (1 / to) : Math.ceil(x / to) * to;
/**
 * Degree to radian
 */

const toRad = degrees => degrees * Math.PI / 180;
/**
 * MIDI note number to string
 */

const toMIDI = f => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
/**
 * Linear amplitude ([0, 1]) to dB ([-Inf, 0])
 *
 * @param {number} a linear amplitude value
 * @returns {number} dB value
 */

const atodb = a => 20 * Math.log10(a);
/**
 * dB ([-Inf, 0]) to Linear mplitude ([0, 1])
 *
 * @param {number} db dB value
 * @returns {number} linear amplitude value
 */

const dbtoa = db => 10 ** (db / 20);
/**
 * De-scale a exponently scaled value
 *
 * @param {number} x normalized value to scale between ([0, 1])
 * @param {number} e exponent factor used to scale, 0 means linear, 1 does ** 1.5 curve
 * @returns {number} de-scaled value
 */

const iNormExp = (x, e) => Math.max(0, x) ** 1.5 ** -e;
/**
 * Scale exponently a normalized value
 *
 * @param {number} x normalized value to scale between ([0, 1])
 * @param {number} e exponent factor, 0 means linear, 1 does ** 1.5 curve
 * @returns {number} scaled value
 */

const normExp = (x, e) => Math.max(0, x) ** 1.5 ** e;
const scale = (x, l1, h1, l2, h2) => {
  const r1 = h1 - l1;
  const r2 = h2 - l2;
  return (x - l1) / r1 * r2 + l2;
};
const scaleClip = (x, l1, h1, l2, h2) => Math.max(l2, Math.min(h2, scale(x, l1, h1, l2, h2))); // eslint-disable-next-line arrow-body-style

const isIdentityMatrix = x => {
  return Array.isArray(x) && x.every((row, i) => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumberArray)(row) && row.length === x.length && row.every((e, j) => e === (j === i ? 1 : 0)));
};
const identityMatrix = dim => new Array(dim).fill(undefined).map((x, i) => new Array(dim).fill(undefined).map((y, j) => +(i === j)));

/***/ }),

/***/ "./src/utils/symbols.ts":
/*!******************************!*\
  !*** ./src/utils/symbols.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImporterDirSelfObject": () => (/* binding */ ImporterDirSelfObject),
/* harmony export */   "ImportedStaticMethodObject": () => (/* binding */ ImportedStaticMethodObject),
/* harmony export */   "SharedDataNoValue": () => (/* binding */ SharedDataNoValue),
/* harmony export */   "TempManagerFolder": () => (/* binding */ TempManagerFolder)
/* harmony export */ });
const ImporterDirSelfObject = Symbol("__JSPatcher_ImporterDirSelfObject");
const ImportedStaticMethodObject = Symbol("__JSPatcher_ImportedStaticMethodObject");
const SharedDataNoValue = Symbol("__JSPatcher_ShareDataNoValue");
const TempManagerFolder = Symbol("__JSPatcher_TempManagerFolder");

/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isStringArray": () => (/* binding */ isStringArray),
/* harmony export */   "isNumberArray": () => (/* binding */ isNumberArray),
/* harmony export */   "isTRect": () => (/* binding */ isTRect),
/* harmony export */   "isTPresentationRect": () => (/* binding */ isTPresentationRect),
/* harmony export */   "isRectMovable": () => (/* binding */ isRectMovable),
/* harmony export */   "isRectResizable": () => (/* binding */ isRectResizable),
/* harmony export */   "isMIDIEvent": () => (/* binding */ isMIDIEvent),
/* harmony export */   "stringifyError": () => (/* binding */ stringifyError),
/* harmony export */   "parseToPrimitive": () => (/* binding */ parseToPrimitive),
/* harmony export */   "rgbaMax2Css": () => (/* binding */ rgbaMax2Css),
/* harmony export */   "css2RgbaMax": () => (/* binding */ css2RgbaMax),
/* harmony export */   "decodeBPF": () => (/* binding */ decodeBPF),
/* harmony export */   "decodeCurve": () => (/* binding */ decodeCurve),
/* harmony export */   "decodeLine": () => (/* binding */ decodeLine),
/* harmony export */   "detectOS": () => (/* binding */ detectOS),
/* harmony export */   "detectBrowserCore": () => (/* binding */ detectBrowserCore),
/* harmony export */   "roundedRect": () => (/* binding */ roundedRect),
/* harmony export */   "fillRoundedRect": () => (/* binding */ fillRoundedRect),
/* harmony export */   "selectElementRange": () => (/* binding */ selectElementRange),
/* harmony export */   "selectElementPos": () => (/* binding */ selectElementPos),
/* harmony export */   "findFromAscendants": () => (/* binding */ findFromAscendants),
/* harmony export */   "getPropertyDescriptor": () => (/* binding */ getPropertyDescriptor),
/* harmony export */   "getPropertyDescriptors": () => (/* binding */ getPropertyDescriptors),
/* harmony export */   "extToType": () => (/* binding */ extToType),
/* harmony export */   "max2js": () => (/* binding */ max2js),
/* harmony export */   "js2max": () => (/* binding */ js2max),
/* harmony export */   "convertSampleToUnit": () => (/* binding */ convertSampleToUnit),
/* harmony export */   "MEASURE_UNIT_REGEX": () => (/* binding */ MEASURE_UNIT_REGEX),
/* harmony export */   "TIME_UNIT_REGEX": () => (/* binding */ TIME_UNIT_REGEX),
/* harmony export */   "convertUnitToSample": () => (/* binding */ convertUnitToSample),
/* harmony export */   "ab2sab": () => (/* binding */ ab2sab),
/* harmony export */   "sab2ab": () => (/* binding */ sab2ab),
/* harmony export */   "ab2str": () => (/* binding */ ab2str),
/* harmony export */   "str2ab": () => (/* binding */ str2ab)
/* harmony export */ });
/* eslint-disable arrow-body-style */
const isStringArray = x => Array.isArray(x) && x.every(e => typeof e === "string");
const isNumberArray = x => Array.isArray(x) && x.every(e => typeof e === "number");
const isTRect = x => {
  return isNumberArray(x) && x.length === 4 && x[0] >= 0 && x[1] >= 0 && x[2] >= 15 && x[3] >= 15;
};
const isTPresentationRect = x => {
  return Array.isArray(x) && x.length === 4 && x.every(v => typeof v === "number" || typeof v === "string");
};
const isRectMovable = x => {
  return isTPresentationRect(x) && typeof x[0] === "number" && typeof x[1] === "number";
};
const isRectResizable = x => isTRect(x);
const isMIDIEvent = x => (isNumberArray(x) || x instanceof Uint8Array) && x.length === 3;
const stringifyError = data => {
  if (typeof data === "string") return data;
  if (data instanceof Error) return data.message;
  if (typeof data === "object") return JSON.stringify(data);
  return "".concat(data);
};
const parseToPrimitive = value => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value.toString();
  }
};
const rgbaMax2Css = maxColor => {
  const cssColor = [255, 255, 255, 1];

  if (Array.isArray(maxColor)) {
    for (let i = 0; i < 3; i++) {
      if (typeof maxColor[i] === "number") cssColor[i] = Math.floor(maxColor[i] * 255);
    }

    if (typeof maxColor[3] === "number") cssColor[3] = maxColor[3];
  }

  return "rgba(".concat(cssColor.join(","), ")");
};
const css2RgbaMax = color => {
  const maxColor = [0.2, 0.2, 0.2, 1];
  const matched = color.match(/rgba\((.+)\)/);
  if (!matched) return maxColor;
  const cssColor = matched[1].split(",").map(s => +s);

  for (let i = 0; i < 3; i++) {
    if (typeof cssColor[i] === "number") maxColor[i] = cssColor[i] / 255;
    if (typeof cssColor[3] === "number") maxColor[3] = cssColor[3];
  }

  return maxColor;
};
/**
 * A BPF can be described as a succesion of three number tuples.
 * i.e. `1 1 0.5 2 1 1` curve mode means go to 0 immediately then go to 1 in 1s with a curve of e^0.5, then go to 2 in 1s linear.
 * The function transform the string to number[][], i.e. `[[1, 1, 0.5], [2, 1, 1]]`
 *
 * @param {TBPF} sIn
 * @returns {number[][]}
 */

const decodeBPF = (sIn, tupleLength) => {
  if (typeof sIn === "number") return [[sIn]];
  if (isNumberArray(sIn)) return [sIn];
  if (Array.isArray(sIn) && sIn.every(a => isNumberArray(a))) return sIn;
  if (typeof sIn !== "string") throw new Error("Failed to decode curve.");
  const numbers = sIn.split(" ").filter(s => !!s).map(s => +s);
  if (numbers.find(v => !isFinite(v))) throw new Error("BPF contains invalid number.");
  const tuples = [];

  for (let i = 0; i < numbers.length; i++) {
    const $tuple = ~~(i / tupleLength);
    const $ = i % tupleLength;
    if (!tuples[$tuple]) tuples[$tuple] = [];
    tuples[$tuple][$] = numbers[i];
  }

  return tuples;
};
const decodeCurve = sIn => decodeBPF(sIn, 3);
const decodeLine = sIn => decodeBPF(sIn, 2);
/**
 * Gives OS name as follows:
 * "Windows"    for all versions of Windows,
 * "MacOS"      for all versions of Macintosh OS,
 * "Linux"      for all versions of Linux,
 * "UNIX"       for all other UNIX flavors,
 * "Unknown" indicates failure to detect the OS
 *
 * @returns {"Windows" | "MacOS" | "UNIX" | "Linux" | "Unknown"} OS name
 */

const detectOS = () => {
  const {
    appVersion
  } = navigator;
  if (appVersion.indexOf("Win") !== -1) return "Windows";
  if (appVersion.indexOf("Mac") !== -1) return "MacOS";
  if (appVersion.indexOf("X11") !== -1) return "UNIX";
  if (appVersion.indexOf("Linux") !== -1) return "Linux";
  return "Unknown";
};
const detectBrowserCore = () => {
  if (window.chrome) return "Chromium";
  if (window.InstallTrigger) return "Gecko";
  if (navigator.vendor.indexOf("Apple") !== -1) return "WebKit";
  return "Unknown";
};
const roundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number") radii.fill(radius);else radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.stroke();
};
const fillRoundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number") radii.fill(radius);else radius.forEach((v, i) => radii[i] = v);
  ctx.beginPath();
  ctx.moveTo(x + radii[0], y);
  ctx.lineTo(x + width - radii[1], y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
  ctx.lineTo(x + width, y + height - radii[2]);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height);
  ctx.lineTo(x + radii[3], y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3]);
  ctx.lineTo(x, y + radii[0]);
  ctx.quadraticCurveTo(x, y, x + radii[0], y);
  ctx.closePath();
  ctx.fill();
};
const selectElementRange = e => {
  const elementIsEditable = e => !!e.nodeName.match(/^(INPUT|TEXTAREA)$/i);

  const selection = window.getSelection();

  if (elementIsEditable(e)) {
    e.focus();
    e.select();
    return;
  }

  if (selection.setBaseAndExtent) {
    // Safari
    selection.setBaseAndExtent(e, 0, e, e.hasChildNodes() ? 1 : 0);
    return;
  }

  if (selection.addRange && selection.removeAllRanges && document.createRange) {
    // Mozilla or Opera 10.5+
    const range = document.createRange();
    range.selectNodeContents(e);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
const selectElementPos = (e, pos) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(e.childNodes[0], pos);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};
const findFromAscendants = (e, predict) => {
  const ascendants = [];
  let parent = e.parentElement;

  while (parent !== document.body) {
    ascendants.push(parent);
    parent = parent.parentElement;
  }

  return ascendants.find(predict);
}; // eslint-disable-next-line arrow-body-style

const getPropertyDescriptor = (obj, key) => {
  return Object.getOwnPropertyDescriptor(obj, key) || getPropertyDescriptor(Object.getPrototypeOf(obj), key);
};
const getPropertyDescriptors = obj => {
  if (typeof obj === "function") return Object.getOwnPropertyDescriptors(obj);
  const proto = Object.getPrototypeOf(obj);
  if (obj !== Object.prototype && proto === Object.prototype) return Object.getOwnPropertyDescriptors(obj);
  return Object.assign(proto ? getPropertyDescriptors(proto) : {}, Object.getOwnPropertyDescriptors(obj));
};
const extToType = ext => {
  if (["jspat", "maxpat", "gendsp", "dsppat"].indexOf(ext) !== -1) return "patcher";
  if (["wav", "aif", "aiff", "mp3", "aac", "flac", "ogg", "m4a"].indexOf(ext) !== -1) return "audio";
  if (["txt", "json"].indexOf(ext) !== -1) return "text";
  if (["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp", "bmp", "ico", "cur", "tif", "tiff"].indexOf(ext) !== -1) return "image";
  if (["mp4", "webm", "3gp"].indexOf(ext) !== -1) return "video";
  return "unknown";
};
const max2js = function max2js(patcherIn) {
  let mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "max";
  const patcher = {
    boxes: {},
    lines: {}
  };
  const maxPatcher = patcherIn.patcher;
  patcher.props = {
    bgColor: rgbaMax2Css(maxPatcher.bgcolor),
    editingBgColor: rgbaMax2Css(maxPatcher.editing_bgcolor),
    dependencies: [],
    grid: maxPatcher.gridsize,
    openInPresentation: !!maxPatcher.openinpresentation,
    mode
  };
  const maxBoxes = maxPatcher.boxes;
  const maxLines = maxPatcher.lines;

  for (let i = 0; i < maxBoxes.length; i++) {
    const maxBox = maxBoxes[i].box;
    const numID = parseInt(maxBox.id.match(/\d+/)[0]);
    const id = "box-" + numID;
    patcher.boxes[id] = {
      id,
      inlets: maxBox.numinlets,
      outlets: maxBox.numoutlets,
      rect: maxBox.patching_rect,
      presentationRect: maxBox.presentation_rect,
      background: !!maxBox.background,
      presentation: !!maxBox.presentation,
      text: (maxBox.maxclass === "newobj" ? "" : maxBox.maxclass + " ") + (maxBox.text ? maxBox.text : "")
    };
  }

  for (let i = 0; i < maxLines.length; i++) {
    const lineArgs = maxLines[i].patchline;
    const id = "line-" + i;
    patcher.lines[id] = {
      id,
      src: [lineArgs.source[0].replace(/obj/, "box"), lineArgs.source[1]],
      dest: [lineArgs.destination[0].replace(/obj/, "box"), lineArgs.destination[1]]
    };
  }

  return patcher;
};
const js2max = patcherIn => {
  const maxPatcher = {
    boxes: [],
    lines: [],
    rect: undefined,
    bgcolor: css2RgbaMax(patcherIn.props.bgColor),
    editing_bgcolor: css2RgbaMax(patcherIn.props.editingBgColor),
    gridsize: patcherIn.props.grid,
    openinpresentation: +patcherIn.props.openInPresentation
  };

  for (const id in patcherIn.boxes) {
    const box = patcherIn.boxes[id];
    const numID = parseInt(id.match(/\d+/)[0]);
    maxPatcher.boxes.push({
      box: {
        id: "obj-".concat(numID),
        maxclass: "newobj",
        numinlets: box.inlets,
        numoutlets: box.outlets,
        patching_rect: box.rect,
        presentation: +box.presentation,
        background: +box.background,
        text: box.text
      }
    });
  }

  for (const id in patcherIn.lines) {
    const line = patcherIn.lines[id];
    maxPatcher.lines.push({
      patchline: {
        source: [line.src[0].replace(/box/, "obj"), line.src[1]],
        destination: [line.dest[0].replace(/box/, "obj"), line.dest[1]]
      }
    });
  }

  return {
    patcher: maxPatcher
  };
};
const convertSampleToUnit = (sample, unit, _ref) => {
  let {
    sampleRate = 48000,
    bpm = 60,
    beatsPerMeasure = 4,
    division = 16
  } = _ref;
  if (unit === "sample") return {
    unit,
    str: sample.toString(),
    value: sample,
    values: [sample]
  };
  const milliseconds = sample * 1000 / sampleRate;
  const roundedMs = Math.round(milliseconds);

  if (unit === "measure") {
    const dpms = bpm * division / 60000;
    const totalDivisions = dpms * milliseconds;
    const roundedTotalDivisions = dpms * milliseconds;
    const divisions = ~~(roundedTotalDivisions % division);
    const beats = ~~(roundedTotalDivisions / division) % beatsPerMeasure + 1;
    const measure = ~~(roundedTotalDivisions / beatsPerMeasure / division) + 1;
    const str = "".concat(measure, ":").concat(beats, ".").concat(divisions.toString().padStart(2, "0"));
    return {
      unit,
      str,
      value: totalDivisions / division,
      values: [measure, beats, divisions]
    };
  } // if (unit === "time")


  const ms = roundedMs % 1000;
  const s = ~~(roundedMs / 1000) % 60;
  const min = ~~(roundedMs / 60000) % 60;
  const h = ~~(roundedMs / 3600000);
  const str = !min ? "".concat(s, ".").concat(ms.toString().padStart(3, "0")) : !h ? "".concat(min, ":").concat(s.toString().padStart(2, "0"), ".").concat(ms.toString().padStart(3, "0")) : "".concat(h, ":").concat(min.toString().padStart(2, "0"), ":").concat(s.toString().padStart(2, "0"), ".").concat(ms.toString().padStart(3, "0"));
  return {
    unit,
    str,
    value: milliseconds / 1000,
    values: [h, min, s, ms]
  };
};
const MEASURE_UNIT_REGEX = /^((\d+):)?(\d+)\.?(\d+)?$/;
const TIME_UNIT_REGEX = /^((\d+):)??((\d+):)?(\d+)\.?(\d+)?$/;
const convertUnitToSample = (str, unit, _ref2) => {
  let {
    sampleRate = 48000,
    bpm = 60,
    beatsPerMeasure = 4,
    division = 16
  } = _ref2;
  if (unit === "sample") return +str || 0;

  if (unit === "measure") {
    const matched = str.match(MEASURE_UNIT_REGEX);
    if (!matched) throw new Error("String ".concat(str, " cannot be parsed to ").concat(unit));
    const [,, measureIn, beatsIn, divisionsIn] = matched;
    const bps = bpm / 60;
    const samplesPerBeat = sampleRate / bps;
    let measures = +measureIn || 0;
    let beats = +beatsIn || 0;
    let divisions = +divisionsIn || 0;
    beats += ~~(divisions / division);
    divisions %= division;
    measures += ~~(beats / beatsPerMeasure);
    beats %= beatsPerMeasure;
    return (measures * beatsPerMeasure + beats + divisions / division) * samplesPerBeat;
  }

  const matched = str.match(TIME_UNIT_REGEX);
  if (!matched) throw new Error("String ".concat(str, " cannot be parsed to ").concat(unit));
  const [,, hIn,, minIn, sIn, msIn] = matched;
  let h = +hIn || 0;
  let min = +minIn || 0;
  let s = +sIn || 0;
  let ms = +msIn || 0;
  s += ~~(ms / 1000);
  ms %= 1000;
  min += ~~(s / 60);
  s %= 60;
  h += ~~(min / 60);
  min %= 60;
  return (h * 3600 + min * 60 + s + ms / 1000) * sampleRate;
};
const ab2sab = ab => {
  if (ab instanceof ArrayBuffer) return ab;
  const sab = new SharedArrayBuffer(ab.byteLength);
  const ui8ab = new Uint8Array(ab);
  const ui8sab = new Uint8Array(sab);

  for (let i = 0; i < ui8ab.length; i++) {
    ui8sab[i] = ui8ab[i];
  }

  return sab;
};
const sab2ab = sab => {
  if (sab instanceof SharedArrayBuffer) return sab;
  const ab = new ArrayBuffer(sab.byteLength);
  const ui8ab = new Uint8Array(ab);
  const ui8sab = new Uint8Array(sab);

  for (let i = 0; i < ui8sab.length; i++) {
    ui8ab[i] = ui8sab[i];
  }

  return ab;
};
const ab2str = buf => {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
};
const str2ab = str => {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char

  const bufView = new Uint16Array(buf);

  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./src/core/worklets/WorkletEnv.worklet.ts ***!
  \******************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "processorId": () => (/* binding */ processorId),
/* harmony export */   "default": () => (/* binding */ WorkletEnvProcessor)
/* harmony export */ });
/* harmony import */ var _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AudioWorkletProxyProcessor */ "./src/core/worklets/AudioWorkletProxyProcessor.ts");
/* harmony import */ var _TaskMgr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TaskMgr */ "./src/core/TaskMgr.ts");
/* harmony import */ var _file_TemporaryProjectItemManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../file/TemporaryProjectItemManager */ "./src/core/file/TemporaryProjectItemManager.ts");
/* harmony import */ var _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/TypedEventEmitter */ "./src/utils/TypedEventEmitter.ts");
/* harmony import */ var _file_WorkletProjectItemManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../file/WorkletProjectItemManager */ "./src/core/file/WorkletProjectItemManager.ts");
/* harmony import */ var _WorkletGlobalPackageManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../WorkletGlobalPackageManager */ "./src/core/WorkletGlobalPackageManager.ts");
/* harmony import */ var _Project__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Project */ "./src/core/Project.ts");
/* harmony import */ var _WorkletSDK__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../WorkletSDK */ "./src/core/WorkletSDK.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









const processorId = "__JSPatcher_WorkletEnv";
const {
  registerProcessor
} = globalThis;
class WorkletEnvProcessor extends _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(options) {
    super(options);

    _defineProperty(this, "ee", new _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_3__.default());

    _defineProperty(this, "thread", "AudioWorklet");

    _defineProperty(this, "os", void 0);

    _defineProperty(this, "browser", void 0);

    _defineProperty(this, "language", void 0);

    _defineProperty(this, "generatedId", void 0);

    _defineProperty(this, "taskMgr", new _TaskMgr__WEBPACK_IMPORTED_MODULE_1__.default());

    _defineProperty(this, "fileMgr", void 0);

    _defineProperty(this, "tempMgr", void 0);

    _defineProperty(this, "pkgMgr", void 0);

    _defineProperty(this, "sdk", new _WorkletSDK__WEBPACK_IMPORTED_MODULE_7__.default());

    _defineProperty(this, "currentProject", void 0);

    _defineProperty(this, "instances", new Set());

    _defineProperty(this, "activeInstance", void 0);

    _defineProperty(this, "activeEditor", void 0);

    _defineProperty(this, "handleFileMgrChange", () => {
      if (this.fileMgr.disabled) return;
      this.fileMgrDiff(this.fileMgr.getDataForDiff());
    });

    globalThis.jspatcherEnv = this;
    const {
      os,
      browser,
      language,
      generatedId
    } = options.processorOptions;
    this.os = os;
    this.browser = browser;
    this.language = language;
    this.generatedId = generatedId;
    this.fileMgr = new _file_WorkletProjectItemManager__WEBPACK_IMPORTED_MODULE_4__.default(this);
    this.tempMgr = new _file_TemporaryProjectItemManager__WEBPACK_IMPORTED_MODULE_2__.default(this);
    this.pkgMgr = new _WorkletGlobalPackageManager__WEBPACK_IMPORTED_MODULE_5__.default(this);
  }

  async init() {
    await this.pkgMgr.init();
    this.currentProject = new _Project__WEBPACK_IMPORTED_MODULE_6__.default(this);
    await this.fileMgr.init();
    await this.tempMgr.init();
    this.bindTaskMgr();
    this.bindFileMgr();
  }

  newLog(errorLevel, title, message, emitterIn) {
    const emitter = typeof emitterIn === "string" ? emitterIn : typeof emitterIn === "object" ? emitterIn.constructor.name : typeof emitterIn === "function" ? emitterIn.name : "";
    this.envNewLog(errorLevel, title, message, emitter);
  }

  generateId(objectIn) {
    return this.thread + objectIn.constructor.name + Atomics.add(this.generatedId, 0, 1);
  }

  registerInstance(i, id) {
    this.instances.add(i);
    i.on("destroy", () => {
      this.instances.delete(i);
      this.ee.emit("instances", Array.from(this.instances));
    });
    this.ee.emit("instances", Array.from(this.instances));
    if (!id) return this.generateId(i);
    return id;
  }

  getInstanceById(id) {
    for (const instance of this.instances) {
      if (instance.id === id) return instance;
    }

    return null;
  } // get _listeners() { return this.ee._listeners; }
  // get getListeners() { return this.ee.getListeners; }


  get listeners() {
    return this.ee.listeners;
  }

  get on() {
    return this.ee.on;
  }

  get once() {
    return this.ee.once;
  }

  get onAny() {
    return this.ee.onAny;
  }

  get off() {
    return this.ee.off;
  }

  get offAny() {
    return this.ee.offAny;
  }

  get offAll() {
    return this.ee.offAll;
  }

  get emit() {
    return this.ee.emit;
  }

  get emitSerial() {
    return this.ee.emitSerial;
  }

  get emitSync() {
    return this.ee.emitSync;
  }

  get listenerCount() {
    return this.ee.listenerCount;
  }

  bindTaskMgr() {
    const handleTaskBegin = _ref => {
      var _emitter$constructor;

      let {
        id,
        message,
        emitter
      } = _ref;
      return this.taskBegin({
        id,
        message,
        emitter: typeof emitter === "string" ? emitter : (_emitter$constructor = emitter.constructor) === null || _emitter$constructor === void 0 ? void 0 : _emitter$constructor.name
      });
    };

    const handleTaskUpdate = _ref2 => {
      let {
        id,
        message
      } = _ref2;
      return this.taskUpdate({
        id,
        message
      });
    };

    const handleTaskError = _ref3 => {
      let {
        id,
        error
      } = _ref3;
      return this.taskError({
        id,
        error
      });
    };

    const handleTaskEnd = _ref4 => {
      let {
        id
      } = _ref4;
      return this.taskEnd({
        id
      });
    };

    this.taskMgr.on("taskBegin", handleTaskBegin);
    this.taskMgr.on("taskUpdate", handleTaskUpdate);
    this.taskMgr.on("taskError", handleTaskError);
    this.taskMgr.on("taskEnd", handleTaskEnd);
  }

  bindFileMgr() {
    this.fileMgr.on("changed", this.handleFileMgrChange);
  }

  async workletFileMgrDiff(diff) {
    this.fileMgr.off("changed", this.handleFileMgrChange);
    await this.fileMgr.processDiff(diff);
    this.fileMgr.on("changed", this.handleFileMgrChange);
  }

  async importPackage(url, pkgInfo) {
    await this.pkgMgr.importPackage(url, pkgInfo);
  }

  process(inputs, outputs) {
    if (this._disposed) return false;
    return true;
  }

}

_defineProperty(WorkletEnvProcessor, "fnNames", ["envNewLog", "taskBegin", "taskUpdate", "taskError", "taskEnd", "fileMgrExists", "fileMgrGetFileDetails", "fileMgrPutFile", "fileMgrReadDir", "fileMgrReadFile", "fileMgrWriteFile", "fileMgrGetPathIdMap", "fileMgrDiff", "addObjects", "addWorkletModule"]);

try {
  registerProcessor(processorId, WorkletEnvProcessor);
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn(error);
}
})();

/******/ })()
;
//# sourceMappingURL=59e3ff4e199de367245e.worklet.js.map