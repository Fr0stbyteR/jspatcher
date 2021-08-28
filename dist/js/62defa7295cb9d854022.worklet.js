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
    return this.patcher.props.dependencies.map((t) => t[0]);
  }
  get packagesInfo() {
    return Object.keys(this.global[this.mode]).map((id) => {
      var _a;
      return {
        id,
        isBuiltIn: this.global.builtInPackagesNames.indexOf(id) !== -1,
        url: (_a = this.global.importedPackages.find((p) => p.name === id)) == null ? void 0 : _a.baseUrl,
        enabled: id in this.pkg
      };
    });
  }
  constructor(patcher) {
    super();
    this.patcher = patcher;
  }
  async init() {
    await this.loadPatcherDependencies();
    this.pkg = {};
    for (const pkgName of Object.keys(this.global[this.mode]).sort((a, b) => b === "globalThis" ? -1 : 1)) {
      if (this.global.builtInPackagesNames.indexOf(pkgName) !== -1) {
        const pkg = this.global[this.mode][pkgName];
        if (pkg)
          this.pkg[pkgName] = pkg;
      }
    }
    for (const pkgName of this.patcherDependenciesNames) {
      const pkg = this.global[this.mode][pkgName];
      if (pkg)
        this.pkg[pkgName] = pkg;
    }
    this.lib = this.packageRegister(this.pkg);
    this.emitLibChanged();
  }
  async loadPatcherDependencies() {
    var _a;
    try {
      await this.patcher.env.taskMgr.newTask(this, `${((_a = this.patcher.file) == null ? void 0 : _a.name) || ""} Loading dependencies`, async (onUpdate) => {
        var _a2, _b;
        for (let i = 0; i < this.patcherDependencies.length; i++) {
          const [name, url] = this.patcherDependencies[i];
          onUpdate(`${name} from ${url}`);
          if (this.global[this.mode][name])
            continue;
          try {
            await ((_b = (_a2 = this.global).importFromURL) == null ? void 0 : _b.call(_a2, url, name));
          } catch (e) {
            throw new Error(`Loading dependency: ${name} from ${url} failed`);
          }
        }
      });
    } catch (error) {
      this.patcher.error(error.message);
    }
  }
  async importFromURL(url, id) {
    if (!this.global.importFromURL)
      throw new Error("Cannot import from this context");
    await this.global.importFromURL(url, id);
    this.init();
    this.emitLibChanged();
  }
  emitLibChanged() {
    this.patcher.emit("libChanged", { pkg: this.pkg, lib: this.lib });
  }
  packageRegister(pkg, libOut = {}, rootifyDepth = Infinity, pathIn) {
    const path = pathIn ? pathIn.slice() : [];
    if (path.length && _utils_symbols__WEBPACK_IMPORTED_MODULE_1__.ImporterDirSelfObject in pkg) {
      const el = pkg[_utils_symbols__WEBPACK_IMPORTED_MODULE_1__.ImporterDirSelfObject];
      if ((0,_objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__.isJSPatcherObjectConstructor)(el)) {
        const full = path.join(".");
        if (full in libOut)
          this.emit("pathDuplicated", full);
        else
          libOut[full] = el;
        const p = path.slice();
        while (p.length && path.length - p.length < rootifyDepth) {
          const k = p.join(".");
          if (!(k in libOut))
            libOut[k] = el;
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
        if (full in libOut)
          this.emit("pathDuplicated", full);
        else
          libOut[full] = el;
        const p = [...path, key];
        while (p.length && path.length + 1 - p.length < rootifyDepth) {
          const k = p.join(".");
          if (!(k in libOut))
            libOut[k] = el;
          p.shift();
        }
      }
    }
    return libOut;
  }
  searchInLib(query, limit = Infinity, staticMethodOnly = false, lib) {
    const keys = Object.keys(lib).sort();
    const items = [];
    for (let i = 0; i < keys.length; i++) {
      if (items.length >= limit)
        break;
      const key = keys[i];
      if (key.startsWith(query)) {
        const o = lib[key];
        if (staticMethodOnly) {
          if (o[_utils_symbols__WEBPACK_IMPORTED_MODULE_1__.ImporterDirSelfObject]) {
            items.push({ key, object: o });
          }
        } else {
          items.push({ key, object: o });
        }
      }
    }
    return items;
  }
  searchInPkg(query, limit = Infinity, staticMethodOnly = false, pkg, path = []) {
    const outs = [];
    for (const key in pkg) {
      if (outs.length >= limit)
        break;
      const o = pkg[key];
      if (typeof o === "object") {
        if (key.indexOf(query) !== -1)
          outs.push({ path: [...path, key], object: o });
        else
          outs.push(...this.searchInPkg(query, limit, staticMethodOnly, o, [...path, key]));
      } else {
        if (key.indexOf(query) !== -1)
          outs.push({ path: [...path, key], object: o });
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
      if (!o)
        return null;
      if (typeof o !== "object" && !(0,_objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__.isJSPatcherObjectConstructor)(o))
        return null;
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


const _Project = class extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(envIn) {
    super();
    this.projectFilename = ".jspatproj";
    this.props = {
      name: _Project.props.name.default,
      author: _Project.props.author.default,
      version: _Project.props.version.default
    };
    this.env = envIn;
  }
  get audioCtx() {
    return this.env.audioCtx;
  }
  setProps(props) {
    let changed = false;
    for (const keyIn in props) {
      const key = keyIn;
      if (this.props[key] === props[key])
        continue;
      changed = true;
      this.props[key] = props[key];
    }
    if (changed)
      this.emit("propsChanged", props);
  }
  async save() {
    await this.emit("save");
  }
  async load(clean = false) {
    await this.env.fileMgr.init(clean);
    await this.init();
  }
  async init() {
    try {
      const item = this.env.fileMgr.getProjectItemFromPath(`./${this.projectFilename}`);
      const json = JSON.parse((0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.ab2str)(item.data));
      this.setProps(json);
    } catch (error) {
      const data = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.str2ab)(JSON.stringify(this.props));
      await this.env.fileMgr.projectRoot.addFile(this.projectFilename, data);
    }
  }
  async unload() {
    for (const i of this.env.instances) {
      if (i.project === this)
        await i.destroy();
    }
    await this.emit("unload");
  }
};
let Project = _Project;
Project.props = {
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
};



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

class TaskManager extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._id = 0;
    this._tasks = {};
    this._errors = {};
  }
  get tasks() {
    const tasks = [];
    for (const key in this._tasks) {
      tasks.push(...this._tasks[key].filter((e) => !!e));
    }
    return tasks;
  }
  get errors() {
    const errors = [];
    for (const key in this._errors) {
      errors.push(...this._errors[key].filter((e) => !!e));
    }
    return errors;
  }
  async newTask(emitter, message, callback) {
    const thread = globalThis.constructor.name;
    const timestamp = Date.now();
    const id = thread + this._id++;
    const task = { id, thread, timestamp, emitter, message, callback };
    if (!(thread in this._tasks))
      this._tasks[thread] = [];
    const $ = this._tasks[thread].push(task) - 1;
    this.emit("tasks", this.tasks);
    this.emit("taskBegin", task);
    let returnValue;
    const handleUpdate = (msg) => {
      const task2 = { id, thread, timestamp, emitter, message: `${message}: ${msg}`, callback };
      this._tasks[thread][$] = task2;
      this.emit("tasks", this.tasks);
      this.emit("taskUpdate", task2);
    };
    try {
      returnValue = await callback(handleUpdate);
    } catch (error) {
      const taskError = { id, thread, timestamp, emitter, message, error };
      if (!(thread in this._errors))
        this._errors[thread] = [];
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
    return this.tasks.filter((task) => task.emitter === emitter);
  }
  getErrorsFromEmitter(emitter) {
    return this.errors.filter((error) => error.emitter === emitter);
  }
  dismissLastError() {
    const { lastError } = this;
    if (!lastError)
      return;
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




class WorkletGlobalPackageManager {
  constructor(envIn) {
    this.externals = new Map();
    this.importedPackages = [];
    this.env = envIn;
  }
  get builtInPackagesNames() {
    return [...this.importedPackages.filter((p) => p.isBuiltIn).map((p) => p.name), "Base", "globalThis"];
  }
  get externalPackagesNames() {
    return this.importedPackages.filter((p) => !p.isBuiltIn).map((p) => p.name);
  }
  async init() {
    this.jsaw = {
      Base: await (0,_objects_base_index_jsdsppkg_aw__WEBPACK_IMPORTED_MODULE_2__.default)(),
      globalThis: await (0,_objects_globalThis_index_jsdsppkg__WEBPACK_IMPORTED_MODULE_3__.default)()
    };
    await this.env.addObjects(this.getDescriptors(this.jsaw.globalThis, "globalThis"), "globalThis");
  }
  toDescriptor(O, pkgName) {
    const { path } = O;
    return {
      isObjectDescriptor: true,
      ctor: O.importedObjectType,
      path,
      name: path[path.length - 1] || pkgName
    };
  }
  getDescriptors(pkgIn = this.jsaw.globalThis, pkgName = "globalThis") {
    const $self = "__JSPatcher_Importer_ImporterDirSelfObject";
    const pkg = Object.entries(pkgIn).reduce((acc, [k, v]) => {
      if (typeof v === "function") {
        const descriptor = this.toDescriptor(v, pkgName);
        if (k === _utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject)
          acc[$self] = descriptor;
        else
          acc[k] = descriptor;
      } else {
        acc[k] = this.getDescriptors(v, pkgName);
      }
      return acc;
    }, {});
    if (_utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject in pkgIn)
      pkg[$self] = this.toDescriptor(pkgIn[_utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject], pkgName);
    return pkg;
  }
  add(pkgIn, lib, pathIn = []) {
    const path = pathIn.slice();
    let pkg = this[lib];
    while (path.length) {
      const key = path.shift();
      if (!pkg[key])
        pkg[key] = {};
      else if ((0,_objects_base_AbstractObject__WEBPACK_IMPORTED_MODULE_1__.isJSPatcherObjectConstructor)(pkg[key]))
        pkg[key] = { [_utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject]: pkg[key] };
      pkg = pkg[key];
    }
    Object.assign(pkg, pkgIn);
  }
  async fetchModule(url) {
    const toExport = {};
    globalThis.exports = toExport;
    globalThis.module = { exports: toExport };
    await this.env.addWorkletModule(url);
    const exported = globalThis.module.exports;
    delete globalThis.exports;
    delete globalThis.module;
    return exported;
  }
  async importPackage(url, pkgInfo) {
    if (this.importedPackages.find((p) => p.name === pkgInfo.name))
      return;
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
/* harmony import */ var _objects_importer_Importer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./objects/importer/Importer */ "./src/core/objects/importer/Importer.ts");
/* harmony import */ var _objects_importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./objects/importer/RemotedImporter */ "./src/core/objects/importer/RemotedImporter.ts");











class JSPatcherWorkletSDK {
  constructor() {
    this.Patcher = _patcher_Patcher__WEBPACK_IMPORTED_MODULE_1__.default;
    this.Box = _patcher_Box__WEBPACK_IMPORTED_MODULE_2__.default;
    this.Line = _patcher_Line__WEBPACK_IMPORTED_MODULE_3__.default;
    this.BaseObject = _objects_base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default;
    this.generateRemotedObject = _objects_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_4__.default;
    this.Bang = _objects_base_Bang__WEBPACK_IMPORTED_MODULE_5__.default;
    this.isBang = _objects_base_Bang__WEBPACK_IMPORTED_MODULE_5__.isBang;
    this.MathUtils = _utils_math__WEBPACK_IMPORTED_MODULE_6__;
    this.BufferUtils = _utils_buffer__WEBPACK_IMPORTED_MODULE_7__;
    this.Utils = _utils_utils__WEBPACK_IMPORTED_MODULE_8__;
    this.Importer = _objects_importer_Importer__WEBPACK_IMPORTED_MODULE_9__.default;
    this.RemotedImporter = _objects_importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_10__.default;
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
  async instantiateEditor({ env, project, instanceId }) {
    const AudioEditor = (await __webpack_require__.e(/*! import() */ "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./AudioEditor */ "./src/core/audio/AudioEditor.ts"))).default;
    return AudioEditor.fromProjectItem({ file: this, env, project, instanceId });
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

class AbstractProjectFile extends _AbstractProjectItem__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(fileMgrIn, parentIn, nameIn, dataIn) {
    super(fileMgrIn, parentIn, nameIn);
    this.isFolder = false;
    if (dataIn)
      this._data = dataIn;
    this.onAny((eventName, eventData) => {
      const { id, isFolder, type, path, data } = this;
      this.fileMgr.emit("itemChanged", { id, isFolder, type, path, data, eventName, eventData });
    });
  }
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
    const { parent, name, data } = this;
    const from = parent;
    this._data = newData;
    await this.move(to, newName);
    const item = this.clone(parent, name, data);
    parent.items.add(item);
    await parent.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", { from: from.path, to: to.path });
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

class AbstractProjectFolder extends _AbstractProjectItem__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(fileMgrIn, parentIn, nameIn) {
    super(fileMgrIn, parentIn, nameIn);
    this.isFolder = true;
    this.items = new Set();
    this.onAny((eventName, eventData) => {
      const { id, isFolder, type, path } = this;
      this.fileMgr.emit("itemChanged", { id, isFolder, type, path, eventName, eventData });
    });
  }
  get type() {
    return "folder";
  }
  get isDirty() {
    return !this.getDescendantFiles().every((f) => !f.isDirty);
  }
  findItem(itemIn) {
    return Array.from(this.items).find((item) => item.name === itemIn);
  }
  existItem(itemIn) {
    return typeof itemIn === "string" ? !!this.findItem(itemIn) : this.items.has(itemIn);
  }
  uniqueName(nameIn) {
    if (!this.existItem(nameIn))
      return nameIn;
    let i = 0;
    let name;
    do {
      i++;
      name = `nameIn_${i}`;
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
      items: Array.from(this.items).map((item) => {
        if (item.isFolder === false) {
          const { id, isFolder, type, name, data } = item;
          return { id, isFolder, type, name, data };
        }
        return item.getTree();
      })
    };
  }
  getDescendantFiles() {
    return Array.from(this.items).reduce((acc, cur) => {
      if (cur.isFolder === false)
        acc.push(cur);
      else
        acc.push(...cur.getDescendantFiles());
      return acc;
    }, []);
  }
  isParentOf(itemIn) {
    let { parent } = itemIn;
    while (parent !== this) {
      if (!parent)
        return false;
      parent = parent.parent;
    }
    return true;
  }
  getOrderedItems() {
    const items = Array.from(this.items);
    const folders = items.filter((i) => i.isFolder).sort((a, b) => a.name.localeCompare(b.name));
    const files = items.filter((i) => !i.isFolder).sort((a, b) => a.name.localeCompare(b.name));
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

class AbstractProjectItem extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(fileMgrIn, parentIn, nameIn) {
    super();
    this._isDirty = false;
    this._observers = new Set();
    this._fileMgr = fileMgrIn;
    this.parent = parentIn;
    this._name = nameIn;
    this.on("dirty", (dirty) => this._isDirty = dirty);
  }
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
    return this.parent ? `${this.parentPath}/${this._name}` : "";
  }
  get parentPath() {
    var _a;
    return (_a = this.parent) == null ? void 0 : _a.path;
  }
  get projectPath() {
    return this.path.replace(new RegExp(`^/${this._fileMgr.projectFolderName}`), "");
  }
  async addObserver(observer) {
    this._observers.add(observer);
    await this.emit("observers", this._observers);
    await this.fileMgr.emitChanged();
  }
  async removeObserver(observer) {
    this._observers.delete(observer);
    await this.emit("observers", this._observers);
    if (this._observers.size === 0)
      this.emit("dirty", false);
    await this.fileMgr.emitChanged();
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


class AbstractProjectItemManager extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(envIn) {
    super();
    this.projectFolderName = "project";
    this.env = envIn;
    this.id = envIn.generateId(this);
    this.taskMgr = envIn.taskMgr;
  }
  get allItems() {
    const items = {};
    const rec = (cur) => {
      items[cur.id] = cur;
      if (cur.isFolder)
        cur.items.forEach(rec);
    };
    rec(this.root);
    return items;
  }
  get allProjectItems() {
    const items = {};
    const rec = (cur) => {
      items[cur.id] = cur;
      if (cur.isFolder)
        cur.items.forEach(rec);
    };
    rec(this.projectRoot);
    return items;
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
      if (id.length === 0)
        continue;
      if (id === ".")
        continue;
      if (id === "..") {
        itemArray.pop();
        continue;
      }
      const cur = itemArray[itemArray.length - 1];
      if (!cur.isFolder)
        throw new Error(`${cur.name} from path ${path} is not a folder`);
      const next = cur.findItem(id);
      if (!next)
        throw new Error(`Cannot find ${id} from path ${path}`);
      itemArray.push(next);
    }
    return itemArray[itemArray.length - 1];
  }
  getPathIdMap() {
    const map = {};
    Object.entries(this.allItems).forEach(([id, { path }]) => map[path] = id);
    return map;
  }
  instantiateProjectPath(path, envIn, projectIn) {
    const item = this.getProjectItemFromPath(path);
    if (item.isFolder === false)
      return item.instantiate({ env: envIn, project: projectIn });
    throw new Error(`Cannot instantiate ${item.name} from path ${path} as it is a folder`);
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


class FileEditor extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(instance) {
    super();
    this._isReady = false;
    this._isDestroyed = false;
    this.handleProjectSave = async () => this.save();
    this.handleProjectUnload = async () => this.destroy();
    this.handleDestroy = () => this.destroy();
    var _a, _b;
    this.instance = instance;
    (_a = this.instance) == null ? void 0 : _a.addObserver(this);
    this.instance.on("destroy", this.handleDestroy);
    (_b = this.history) == null ? void 0 : _b.addEditor(this);
    this.on("dirty", (isDirty) => {
      var _a2;
      return (_a2 = this.file) == null ? void 0 : _a2.emit("dirty", isDirty);
    });
    this.on("destroy", () => {
      var _a2;
      return (_a2 = this.file) == null ? void 0 : _a2.emit("dirty", false);
    });
    const handleReady = () => {
      this._isReady = true;
      this.off("ready", handleReady);
    };
    this.on("ready", handleReady);
    this.editorId = this.env.generateId(this);
    if (this.env.thread === "main")
      this.env.registerInstance(this.instance);
    if (this.project) {
      this.project.on("save", this.handleProjectSave);
      this.project.on("unload", this.handleProjectUnload);
    }
  }
  static async fromProjectItem({ file, env, project, instanceId }) {
    return new this(await file.instantiate({ env, project, instanceId }));
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
    var _a;
    return (_a = this.history) == null ? void 0 : _a.isDirty;
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
    if (this.isReadonly)
      throw new Error("Cannot save readonly file");
    if (this.isInMemory)
      throw new Error("Cannot save in-memory instance");
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
    var _a;
    if (this.isDestroyed)
      return;
    if (this.project) {
      this.project.off("save", this.handleProjectSave);
      this.project.off("unload", this.handleProjectUnload);
    }
    this.instance.off("destroy", this.handleDestroy);
    this.instance.removeObserver(this);
    (_a = this.history) == null ? void 0 : _a.removeEditor(this);
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


class FileInstance extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor({ env, project, file, instanceId }) {
    super();
    this._isReadonly = false;
    this._isReady = false;
    this._observers = new Set();
    var _a;
    this._env = env;
    this._project = project;
    this._file = file;
    this._id = this.env.registerInstance(this, instanceId);
    (_a = this._file) == null ? void 0 : _a.addObserver(this._id);
  }
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
    var _a, _b;
    if (value === this._file)
      return;
    (_a = this._file) == null ? void 0 : _a.removeObserver(this._id);
    this._file = value;
    (_b = this._file) == null ? void 0 : _b.addObserver(this._id);
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
    if (this._observers.size === 0)
      await this.destroy();
  }
  get id() {
    return this._id;
  }
  get history() {
    return this._history;
  }
  async init() {
    return this;
  }
  async serialize() {
    throw new Error("Not implemented.");
  }
  async destroy() {
    var _a;
    await this.emit("destroy");
    await ((_a = this.file) == null ? void 0 : _a.removeObserver(this._id));
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
class History {
  constructor() {
    this.editors = new Set();
    this.saveTime = 0;
    this.$ = 0;
    this.eventQueue = [];
    this.capture = true;
    this.handleEditorEvent = async (eventName, eventData, editor) => {
      if (this.eventListening.indexOf(eventName) === -1)
        return;
      if (!this.capture)
        return;
      this.capture = false;
      await Promise.all(Array.from(this.editors).filter(($editor) => $editor !== editor).map(($editor) => $editor.emit(eventName, eventData)));
      this.capture = true;
      this.eventQueue.splice(this.$);
      this.$ = this.eventQueue.push({ eventName, eventData, timestamp: this.now, editorId: editor.editorId });
      this.emitChanged();
    };
    this.handleSaved = () => {
      var _a;
      this.saveTime = (_a = this.eventQueue[this.$ - 1]) == null ? void 0 : _a.timestamp;
      this.emitDirty();
    };
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
    this.editors.forEach((editor) => editor.emit("changed"));
    this.emitDirty();
  }
  emitDirty() {
    const { isDirty } = this;
    this.editors.forEach((editor) => editor.emit("dirty", isDirty));
  }
  destroy() {
    this.editors.forEach((editor) => this.removeEditor(editor));
  }
  get isDirty() {
    var _a;
    if (!this.saveTime)
      return this.isUndoable;
    return this.saveTime !== ((_a = this.eventQueue[this.$ - 1]) == null ? void 0 : _a.timestamp);
  }
  get isUndoable() {
    return this.$ !== 0;
  }
  get isRedoable() {
    return this.$ !== this.eventQueue.length;
  }
  async undo() {
    if (!this.editors.size)
      return;
    if (!this.isUndoable)
      return;
    this.capture = false;
    const { eventName, eventData } = this.eventQueue[this.$ - 1];
    await Promise.all(Array.from(this.editors).map((editor) => this.undoOf(editor, eventName, eventData)));
    this.$--;
    this.capture = true;
    this.emitChanged();
  }
  async redo() {
    if (!this.editors.size)
      return;
    if (!this.isRedoable)
      return;
    this.capture = false;
    const { eventName, eventData } = this.eventQueue[this.$];
    await Promise.all(Array.from(this.editors).map((editor) => this.redoOf(editor, eventName, eventData)));
    this.$++;
    this.capture = true;
    this.emitChanged();
  }
  async undoUntil(timestamp) {
    while (this.isUndoable && this.eventQueue[this.$ - 1].timestamp >= timestamp) {
      await this.undo();
    }
  }
  async redoUntil(timestamp) {
    while (this.isRedoable && this.eventQueue[this.$].timestamp <= timestamp) {
      await this.redo();
    }
  }
  async setIndex($) {
    if ($ < this.$)
      await this.undoUntil(this.eventQueue[$].timestamp);
    else if ($ > this.$)
      await this.redoUntil(this.eventQueue[$ - 1].timestamp);
  }
  getSyncData() {
    const { $, saveTime, eventQueue } = this;
    return { $, saveTime, eventQueue };
  }
  async syncData(data) {
    var _a;
    this.saveTime = data.saveTime;
    for (let i = 0; i < this.eventQueue.length; i++) {
      const { timestamp } = this.eventQueue[i];
      if (timestamp !== ((_a = data.eventQueue[i]) == null ? void 0 : _a.timestamp)) {
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
    this.lastModifiedId = this.id;
    this._data = dataIn;
  }
  async init() {
    this.id = this.fileMgr.generateItemId(this);
    if (!this.data)
      this.data = await this.fileMgr.readFile(this.path);
    await this.emit("ready");
    await this.fileMgr.emitChanged();
  }
  clone(parentIn = this.parent, nameIn = this._name, dataIn = this.data) {
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
    const { parent, name, data } = this;
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
    await this.emit("pathChanged", { from: from.path, to: to.path });
    await this.emit("saved", by);
    await this.fileMgr.emitChanged();
    return item;
  }
  async rename(newNameIn) {
    const newName = newNameIn.trim();
    const oldName = this._name;
    if (newName === oldName)
      return;
    if (this.parent.existItem(newNameIn))
      throw new Error(`${newName} already exists.`);
    await this.fileMgr.rename(this.path, `${this.parentPath}/${newNameIn}`);
    this._name = newName;
    await this.emitTreeChanged();
    await this.emit("nameChanged", { oldName, newName });
    await this.fileMgr.emitChanged();
  }
  async move(to, newName = this.name) {
    if (to === this)
      return;
    if (to === this.parent && newName === this.name)
      return;
    if (to.existItem(newName))
      throw new Error(`${newName} already exists in ${to.name}`);
    await this._fileMgr.rename(this.path, `${to.path}/${newName}`);
    const from = this.parent;
    from.items.delete(this);
    this.parent = to;
    const oldName = this._name;
    this._name = newName;
    this.parent.items.add(this);
    await from.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", { from: from.path, to: to.path });
    if (oldName !== newName)
      await this.emit("nameChanged", { oldName, newName });
    await this.fileMgr.emitChanged();
  }
  async destroy() {
    await this._fileMgr.remove(this.path, this.isFolder);
    this.parent.items.delete(this);
    await this.emitTreeChanged();
    await this.emit("destroyed");
    await this.fileMgr.emitChanged();
  }
  async instantiate({ env, project, instanceId }) {
    const { type } = this;
    const Constructor = {
      patcher: (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../patcher/Patcher */ "./src/core/patcher/Patcher.ts"))).default,
      audio: (await __webpack_require__.e(/*! import() */ "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../audio/PatcherAudio */ "./src/core/audio/PatcherAudio.ts"))).default,
      image: (await __webpack_require__.e(/*! import() */ "src_core_image_PatcherImage_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../image/PatcherImage */ "./src/core/image/PatcherImage.ts"))).default,
      text: (await __webpack_require__.e(/*! import() */ "src_core_text_PatcherText_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../text/PatcherText */ "./src/core/text/PatcherText.ts"))).default,
      video: void 0,
      unknown: (await __webpack_require__.e(/*! import() */ "src_core_text_PatcherText_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../text/PatcherText */ "./src/core/text/PatcherText.ts"))).default
    }[type];
    if (Constructor)
      return Constructor.fromProjectItem({ file: this, env, project, instanceId });
    throw new Error("Not implemented.");
  }
  async instantiateEditor({ env, project, instanceId }) {
    const { type } = this;
    const Constructor = {
      patcher: (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../patcher/PatcherEditor */ "./src/core/patcher/PatcherEditor.ts"))).default,
      audio: (await __webpack_require__.e(/*! import() */ "src_core_audio_AudioEditor_ts-src_core_audio_AudioRecorder_ts-src_core_audio_PatcherAudio_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../audio/AudioEditor */ "./src/core/audio/AudioEditor.ts"))).default,
      image: (await __webpack_require__.e(/*! import() */ "src_core_image_ImageEditor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../image/ImageEditor */ "./src/core/image/ImageEditor.ts"))).default,
      text: (await __webpack_require__.e(/*! import() */ "src_core_text_TextEditor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../text/TextEditor */ "./src/core/text/TextEditor.ts"))).default,
      video: void 0,
      unknown: (await __webpack_require__.e(/*! import() */ "src_core_text_TextEditor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../text/TextEditor */ "./src/core/text/TextEditor.ts"))).default
    }[type];
    if (Constructor)
      return Constructor.fromProjectItem({ file: this, env, project, instanceId });
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
      const { name, isFolder } = rawItem;
      const item = this.createProjectItem(name, isFolder);
      this.items.add(item);
      await this.emitTreeChanged();
      await item.init();
    }
    await this.emit("ready");
    await this.fileMgr.emitChanged();
  }
  clone(parentIn = this.parent, nameIn = this._name) {
    const Ctor = this.constructor;
    return new Ctor(this._fileMgr, parentIn, nameIn);
  }
  createProjectItem(nameIn, isFolder, dataIn) {
    if (isFolder)
      return new PersistentProjectFolder(this.fileMgr, this, nameIn);
    return new _PersistentProjectFile__WEBPACK_IMPORTED_MODULE_0__.default(this.fileMgr, this, nameIn, dataIn);
  }
  async addFile(nameIn, dataIn) {
    if (this.existItem(nameIn))
      throw new Error(`${nameIn} already exists.`);
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
    if (this.existItem(name))
      throw new Error(`${name} already exists.`);
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
    if (newName === oldName)
      return;
    if (this.parent.existItem(newNameIn))
      throw new Error(`${newName} already exists.`);
    await this.fileMgr.rename(this.path, `${this.parentPath}/${newNameIn}`);
    this._name = newName;
    await this.emitTreeChanged();
    await this.emit("nameChanged", { oldName, newName });
  }
  async move(to, newName = this.name) {
    if (to === this)
      return;
    if (to === this.parent && newName === this.name)
      return;
    if (to.existItem(newName))
      throw new Error(`${newName} already exists in ${to.name}`);
    await this._fileMgr.rename(this.path, `${to.path}/${newName}`);
    const from = this.parent;
    from.items.delete(this);
    this.parent = to;
    const oldName = this._name;
    this._name = newName;
    this.parent.items.add(this);
    await from.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", { from: from.path, to: to.path });
    if (oldName !== newName)
      await this.emit("nameChanged", { oldName, newName });
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


class TemporaryProjectFile extends _AbstractProjectFile__WEBPACK_IMPORTED_MODULE_0__.default {
  async removeObserver(observer) {
    await super.removeObserver(observer);
    await this.fileMgr.emitChanged();
    if (this._observers.size === 0)
      await this.destroy();
  }
  clone(parentIn = this.parent, nameIn = this._name, dataIn = this.data) {
    const Ctor = this.constructor;
    return new Ctor(this._fileMgr, parentIn, nameIn, dataIn);
  }
  async rename(newNameIn) {
    const newName = newNameIn.trim();
    const oldName = this._name;
    if (newName === oldName)
      return;
    if (this.parent.existItem(newNameIn))
      throw new Error(`${newName} already exists.`);
    this._name = newName;
    await this.emitTreeChanged();
    await this.emit("nameChanged", { oldName, newName });
    await this.fileMgr.emitChanged();
  }
  async move(to, newName = this.name) {
    if (to === this)
      return;
    if (to === this.parent)
      return;
    if (to.existItem(newName))
      throw new Error(`${newName} already exists in ${to.name}`);
    const from = this.parent;
    from.items.delete(this);
    this.parent = to;
    const oldName = this._name;
    this._name = newName;
    this.parent.items.add(this);
    await from.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", { from: from.path, to: to.path });
    if (oldName !== newName)
      await this.emit("nameChanged", { oldName, newName });
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
    await this.emit("pathChanged", { from: from.path, to: to.path });
    await this.emit("saved", by);
    await item.init();
    return this;
  }
  async instantiate(options) {
    throw new Error("Not implemented.");
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
  clone(parentIn = this.parent, nameIn = this._name) {
    const Ctor = this.constructor;
    return new Ctor(this._fileMgr, parentIn, nameIn);
  }
  createProjectItem(name, isFolder, data, typeIn) {
    const type = typeIn || this.fileMgr.getTypeFromFileName(name);
    if (type === "patcher")
      return new _patcher_TempPatcherFile__WEBPACK_IMPORTED_MODULE_1__.default(this.fileMgr, this, name, data);
    if (type === "audio")
      return new _audio_TempAudioFile__WEBPACK_IMPORTED_MODULE_0__.default(this.fileMgr, this, name, data);
    if (type === "text")
      return new _text_TempTextFile__WEBPACK_IMPORTED_MODULE_2__.default(this.fileMgr, this, name, data);
    return new _TempData__WEBPACK_IMPORTED_MODULE_3__.default(this.fileMgr, this, name, data);
  }
  async addFile(name, data, typeIn) {
    if (this.existItem(name))
      throw new Error(`${name} already exists.`);
    const item = this.createProjectItem(name, false, data, typeIn);
    this.items.add(item);
    await this.emitTreeChanged();
    await item.init();
    return item;
  }
  async addFolder(name) {
    if (this.existItem(name))
      throw new Error(`${name} already exists.`);
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
    if (newName === oldName)
      return;
    if (this.parent.existItem(newNameIn))
      throw new Error(`${newName} already exists.`);
    this._name = newName;
    await this.emitTreeChanged();
    await this.emit("nameChanged", { oldName, newName });
    await this.fileMgr.emitChanged();
  }
  async move(to, newName = this.name) {
    if (to === this)
      return;
    if (to === this.parent)
      return;
    if (to.existItem(newName))
      throw new Error(`${newName} already exists in ${to.name}`);
    const from = this.parent;
    from.items.delete(this);
    this.parent = to;
    const oldName = this._name;
    this._name = newName;
    this.parent.items.add(this);
    await from.emitTreeChanged();
    await this.emitTreeChanged();
    await this.emit("pathChanged", { from: from.path, to: to.path });
    if (oldName !== newName)
      await this.emit("nameChanged", { oldName, newName });
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


class TemporaryProjectItemManager extends _AbstractProjectItemManager__WEBPACK_IMPORTED_MODULE_1__.default {
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
      if (id.length === 0)
        continue;
      if (id === ".")
        continue;
      if (id === "..") {
        itemArray.pop();
        continue;
      }
      const cur = itemArray[itemArray.length - 1];
      if (cur.isFolder === false)
        throw new Error(`${cur.name} from path ${path} is not a folder`);
      const next = cur.findItem(id);
      if (!next)
        throw new Error(`Cannot find ${id} from path ${path}`);
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


class WorkletProjectItemManager extends _AbstractProjectItemManager__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(envIn) {
    super(envIn);
    this.cachedPathIdMap = {};
    this.disabled = false;
    this.env = envIn;
  }
  empty() {
    throw new Error("Empty is not allowed from other threads.");
  }
  async init() {
    this.cachedPathIdMap = await this.env.fileMgrGetPathIdMap();
    this.root = new _PersistentProjectFolder__WEBPACK_IMPORTED_MODULE_1__.default(this, null, null);
    await this.root.init();
    if (!this.projectRoot)
      await this.root.addFolder(this.projectFolderName);
    this.emit("ready");
    return this;
  }
  getDataForDiff() {
    var _a, _b;
    const map = {};
    const { allItems } = this;
    for (const id in allItems) {
      const item = allItems[id];
      if (item.isFolder === true)
        map[id] = { isFolder: item.isFolder, parent: (_a = item.parent) == null ? void 0 : _a.id, name: item.name, path: item.path };
      else
        map[id] = { isFolder: item.isFolder, data: item.sab, lastModifiedId: item.lastModifiedId, parent: (_b = item.parent) == null ? void 0 : _b.id, name: item.name, path: item.path };
    }
    return map;
  }
  async processDiff(diff) {
    this.disabled = true;
    for (const id in diff) {
      const process = async (id2) => {
        var _a;
        const $item = diff[id2];
        const $parentId = $item.parent;
        if (!$parentId)
          return;
        let parent = this.getProjectItemFromId($parentId);
        if (!parent)
          await process($parentId);
        parent = this.getProjectItemFromId($parentId);
        const current = this.getProjectItemFromId(id2);
        if (!current) {
          if (parent.isFolder === true) {
            this.cachedPathIdMap[$item.path] = id2;
            if ($item.isFolder === true) {
              await parent.addFolder($item.name);
            } else {
              const newFile = await parent.addFile($item.name, $item.data);
              newFile.lastModifiedId = $item.lastModifiedId;
            }
          }
        } else {
          if (current.isFolder === false && $item.isFolder === false) {
            if (current.lastModifiedId !== $item.lastModifiedId)
              await current.save($item.data, this);
            if (current.name !== $item.name)
              await current.rename($item.name);
            if (((_a = current.parent) == null ? void 0 : _a.id) !== $item.parent)
              await current.move(parent);
          }
        }
      };
      await process(id);
    }
    this.disabled = false;
  }
  generateItemId(item) {
    const id = this.cachedPathIdMap[item.path];
    if (!id)
      return this.env.generateId(item);
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
    if (this.disabled)
      return null;
    return this.env.fileMgrPutFile(item);
  }
  async writeFile(path, data) {
    if (this.disabled)
      return null;
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



const isJSPatcherObjectConstructor = (x) => typeof x === "function" && (x == null ? void 0 : x.isJSPatcherObjectConstructor);
const isJSPatcherObject = (x) => typeof x === "object" && (x == null ? void 0 : x.isJSPatcherObject);
class AbstractObject extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(box, patcher) {
    super();
    this.isJSPatcherObject = true;
    this._meta = this.constructor.meta;
    this.setState = (stateIn) => {
      const oldState = __spreadValues({}, this.state);
      this.state = Object.assign(this.state, stateIn);
      this.emit("stateUpdated", { oldState, state: __spreadValues({}, this.state) });
    };
    this.setProps = (propsIn) => {
      const keys = Object.keys(propsIn);
      const oldProps = __spreadValues({}, this.props);
      this.box.update({ props: propsIn });
      const props = __spreadValues({}, this.props);
      for (const key in oldProps) {
        if (keys.indexOf(key) === -1) {
          delete oldProps[key];
          delete props[key];
        }
      }
      this.emit("propsUpdated", { oldProps, props });
    };
    this.setArgs = (args) => {
      const oldArgs = this.args.slice();
      this.box.update({ args });
      this.emit("argsUpdated", { oldArgs, args: this.args.slice() });
    };
    this.inletAudioConnections = [];
    this.outletAudioConnections = [];
    this._patcher = patcher;
    this._box = box;
    this.id = this.env.generateId(this);
  }
  static get _name() {
    return this.name;
  }
  static get meta() {
    return {
      package: this.package,
      name: this._name,
      icon: this.icon,
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
    const oldMeta = __spreadValues({}, this.meta);
    this._meta = Object.assign(this.meta, metaIn);
    this.emit("metaUpdated", { oldMeta, meta: __spreadValues({}, this.meta) });
  }
  get data() {
    return this._box.data;
  }
  setData(dataIn) {
    const oldData = __spreadValues({}, this._box.data);
    this._box.data = Object.assign(this.data, dataIn);
    this.emit("dataUpdated", { oldData, data: __spreadValues({}, this.data) });
  }
  get props() {
    const props = {};
    for (const key in this.meta.props) {
      props[key] = this.getProp(key);
    }
    return props;
  }
  getProp(key) {
    if (key === "rect")
      return this.box.rect;
    if (key === "presentationRect")
      return this.box.presentationRect;
    if (key === "background")
      return this.box.background;
    if (key === "presentation")
      return this.box.presentation;
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
  async init() {
    this.subscribe();
    await this.emit("preInit");
  }
  async postInit() {
    await this.emit("postInit");
  }
  subscribe() {
  }
  updateUI(state) {
    this.emit("updateUI", state);
  }
  async updateArgs(args, options) {
    if (args == null ? void 0 : args.length) {
      const oldArgs = this.args.slice();
      await this.emit("updateArgs", args);
      if (options == null ? void 0 : options.undoable)
        this.undoable({ oldArgs, args: this.args.slice() });
    }
  }
  async updateProps(propsIn, options) {
    if (propsIn && Object.keys(propsIn).length) {
      const keys = Object.keys(propsIn);
      const oldProps = __spreadValues({}, this.props);
      await this.emit("updateProps", propsIn);
      const props = __spreadValues({}, this.props);
      for (const key in oldProps) {
        if (keys.indexOf(key) === -1) {
          delete oldProps[key];
          delete props[key];
        }
      }
      if (options == null ? void 0 : options.undoable)
        this.undoable({ oldProps, props });
    }
  }
  async updateState(state, options) {
    if (state && Object.keys(state).length) {
      const oldState = __spreadValues({}, this.state);
      await this.emit("updateState", state);
      if (options == null ? void 0 : options.undoable)
        this.undoable({ oldState, state: __spreadValues({}, this.state) });
    }
  }
  fn(inlet, data) {
    if (inlet === 0) {
      if (data !== null && typeof data === "object") {
        const propsInKeys = Object.keys(data);
        const propsKeys = Object.keys(this.meta.props);
        if (propsInKeys.length && propsInKeys.every((k) => propsKeys.indexOf(k) !== -1)) {
          this.updateProps(data);
          return;
        }
      }
    }
    this.emit("inlet", { data, inlet });
  }
  outlet(outlet, data) {
    if (outlet >= this.outlets)
      return;
    Array.from(this.outletLines[outlet]).sort(_patcher_Line__WEBPACK_IMPORTED_MODULE_2__.default.compare).map((line) => line.pass(data));
  }
  outletAll(outputs) {
    for (let i = outputs.length - 1; i >= 0; i--) {
      if (i in outputs)
        this.outlet(i, outputs[i]);
    }
  }
  undoable(e) {
    this.box.undoable(e);
  }
  async destroy() {
    await this.emit("destroy");
  }
  connectedOutlet(outlet, destBoxId, destInlet, lineId) {
    this.emit("connectedOutlet", { outlet, destBoxId, destInlet, lineId });
  }
  connectedInlet(inlet, srcBoxId, srcOutlet, lineId) {
    this.emit("connectedInlet", { inlet, srcBoxId, srcOutlet, lineId });
  }
  disconnectedOutlet(outlet, destBoxId, destInlet, lineId) {
    this.emit("disconnectedOutlet", { outlet, destBoxId, destInlet, lineId });
  }
  disconnectedInlet(inlet, srcBoxId, srcOutlet, lineId) {
    this.emit("disconnectedInlet", { inlet, srcBoxId, srcOutlet, lineId });
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
    this.box.allLines.forEach((line) => line.enable());
  }
  connectAudioInlet(portIn) {
    this.inletLines.forEach((lines, port) => {
      if (typeof portIn === "undefined" || port === portIn)
        lines.forEach((line) => line.enable());
    });
  }
  connectAudioOutlet(portIn) {
    this.outletLines.forEach((lines, port) => {
      if (typeof portIn === "undefined" || port === portIn)
        lines.forEach((line) => line.enable());
    });
  }
  disconnectAudio() {
    this.box.allLines.forEach((line) => line.disable());
  }
  disconnectAudioInlet(portIn) {
    this.inletLines.forEach((lines, port) => {
      if (typeof portIn === "undefined" || port === portIn)
        lines.forEach((line) => line.disable());
    });
  }
  disconnectAudioOutlet(portIn) {
    this.outletLines.forEach((lines, port) => {
      if (typeof portIn === "undefined" || port === portIn)
        lines.forEach((line) => line.disable());
    });
  }
  applyBPF(param, bpf) {
    const { audioCtx } = this;
    const { currentTime } = audioCtx;
    param.cancelScheduledValues(currentTime);
    param.setValueAtTime(param.value, currentTime);
    let t = 0;
    bpf.forEach((a) => {
      if (a.length === 1) {
        param.setValueAtTime(a[0], currentTime + t);
      } else if (a.length > 1) {
        t += a[1];
        param.linearRampToValueAtTime(a[0], currentTime + t);
      }
    });
  }
  async getSharedItem(id = this.box.id, type = "unknown", data, onceCreate) {
    let item;
    let newItem = false;
    const { fileMgr, tempMgr } = this.patcher.env;
    try {
      item = fileMgr.getProjectItemFromPath(id);
    } catch (e) {
      try {
        item = tempMgr.getProjectItemFromPath(id);
      } catch (e2) {
        if (data) {
          const d = await data();
          try {
            item = await tempMgr.root.addFile(id, d, type);
            newItem = true;
          } catch (e3) {
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
              } catch (e3) {
              }
            };
            const handleTempMgrTreeChanged = () => {
              try {
                item = tempMgr.getProjectItemFromPath(id);
                off();
                onceCreate(item);
              } catch (e3) {
              }
            };
            fileMgr.on("treeChanged", handleFileMgrTreeChanged);
            tempMgr.on("treeChanged", handleTempMgrTreeChanged);
            return { id, item: null, newItem, off };
          }
          return { id, item: null, newItem };
        }
      }
    }
    if (item.type !== type)
      throw new Error(`Getting shared item ${id}, but returned item is of type ${item.type}, not of type ${type}.`);
    return { id, item, newItem };
  }
}
AbstractObject.isJSPatcherObjectConstructor = true;
AbstractObject.package = "Base";
AbstractObject.icon = null;
AbstractObject.author = "";
AbstractObject.version = "0.0.0";
AbstractObject.description = "";
AbstractObject.inlets = [];
AbstractObject.outlets = [];
AbstractObject.args = [];
AbstractObject.props = {};
AbstractObject.isPatcherInlet = false;
AbstractObject.isPatcherOutlet = false;


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
class Bang {
  constructor() {
    this.isBang = true;
  }
  toString() {
    return "bang";
  }
}
const isBang = (x) => typeof x === "object" && (x == null ? void 0 : x.isBang);


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

class BaseObject extends _AbstractObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.isUIStateKey = (x) => this.meta.props[x] && this.meta.props[x].isUIState;
    this.updateUIFromProps = (props) => {
      if (props) {
        const uiState = {};
        for (const key in props) {
          if (this.isUIStateKey(key))
            uiState[key] = props[key];
        }
        this.updateUI(uiState);
      }
    };
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
      props: __spreadValues(__spreadValues({}, superProps), thisProps),
      isPatcherInlet: this.isPatcherInlet,
      isPatcherOutlet: this.isPatcherOutlet
    };
  }
  subscribe() {
    super.subscribe();
    this.on("metaUpdated", (e) => this.box.emit("metaUpdated", e));
    this.on("argsUpdated", (e) => this.box.emit("argsUpdated", e));
    this.on("propsUpdated", (e) => this.box.emit("propsUpdated", e));
    this.on("dataUpdated", (e) => this.box.emit("dataUpdated", e));
    this.on("stateUpdated", (e) => this.box.emit("stateUpdated", e));
    this.on("updateArgs", this.setArgs);
    this.on("updateProps", this.setProps);
    this.on("updateProps", this.updateUIFromProps);
  }
}
BaseObject.package = "base";
BaseObject.props = {
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
};


/***/ }),

/***/ "./src/core/objects/base/Comment.ts":
/*!******************************************!*\
  !*** ./src/core/objects/base/Comment.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ comment)
/* harmony export */ });
/* harmony import */ var _BaseObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseObject */ "./src/core/objects/base/BaseObject.ts");

class comment extends _BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = 1;
      this.outlets = 0;
    });
    this.on("updateArgs", (args) => {
      if (!this.data.hasOwnProperty("value"))
        this.setData({ value: args.join(" ") });
    });
    this.on("inlet", ({ data, inlet }) => {
      if (typeof data === "string") {
        this.setData({ value: data });
        this.updateUI({ value: data });
      }
    });
  }
}
comment.description = "Text Comment";
comment.args = [{
  type: "string",
  optional: true,
  varLength: true,
  description: "Initial text"
}];
comment.props = {
  bgColor: {
    type: "color",
    default: "transparent",
    description: "Background color",
    isUIState: true
  },
  textColor: {
    type: "color",
    default: "rgb(255, 255, 255)",
    description: "Text color",
    isUIState: true
  },
  fontFamily: {
    type: "enum",
    enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
    default: "Lato",
    description: "Font family",
    isUIState: true
  },
  fontSize: {
    type: "number",
    default: 12,
    description: "Text font size",
    isUIState: true
  },
  fontStyle: {
    type: "enum",
    enums: ["normal", "italic", "oblique"],
    default: "normal",
    description: "Text style",
    isUIState: true
  },
  fontWeight: {
    type: "string",
    default: "normal",
    description: 'Text style: "normal" | "bold" | "lighter" | "bolder" | number',
    isUIState: true
  },
  textAlign: {
    type: "enum",
    enums: ["left", "center", "right"],
    default: "left",
    description: "Text style",
    isUIState: true
  }
};


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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((O) => class RemotedObject extends O {
  static get _name() {
    return O._name;
  }
  get proxy() {
    return this.patcher.state.patcherProcessor;
  }
  subscribe() {
    super.subscribe();
    const handleBoxIoCountChanged = () => {
      var _a;
      const { id, inlets, outlets } = this.box;
      (_a = this.proxy) == null ? void 0 : _a.objectEmitFromWorklet(id, "boxIoCountChanged", { inlets, outlets });
    };
    this.box.on("ioCountChanged", handleBoxIoCountChanged);
    this.on("outlet", ({ outlet, data }) => this.outlet(outlet, data));
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
/* harmony import */ var _Comment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Comment */ "./src/core/objects/base/Comment.ts");
/* harmony import */ var _generateRemotedObject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./generateRemotedObject */ "./src/core/objects/base/generateRemotedObject.ts");
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





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => __spreadValues({
  BaseObject: _BaseObject__WEBPACK_IMPORTED_MODULE_0__.default,
  EmptyObject: _BaseObject__WEBPACK_IMPORTED_MODULE_0__.default,
  InvalidObject: _BaseObject__WEBPACK_IMPORTED_MODULE_0__.default,
  func: _importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_1__.Func,
  new: _importer_RemotedImporter__WEBPACK_IMPORTED_MODULE_1__.New,
  comment: (0,_generateRemotedObject__WEBPACK_IMPORTED_MODULE_4__.default)(_Comment__WEBPACK_IMPORTED_MODULE_3__.default)
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




class Func extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    super(...arguments);
    this._ = { Wrapper: null };
    this.callback = () => this.outlet(0, this.imported);
  }
  subscribe() {
    super.subscribe();
    this.on("postInit", () => {
      this.inlets = 1;
      this.outlets = 1;
      handleUpdateArgs(this.args);
    });
    const handleUpdateArgs = (args) => {
      if (typeof args[0] !== "undefined") {
        const Wrapper = this.patcher.activeLib[args[0]];
        if (!Wrapper)
          this.error(`Function ${args[0]} not found.`);
        else if (Wrapper.prototype instanceof _StaticMethod__WEBPACK_IMPORTED_MODULE_0__.default || Wrapper.prototype instanceof _Method__WEBPACK_IMPORTED_MODULE_1__.default) {
          this._.Wrapper = Wrapper;
        } else {
          this.error("Given identifier function is not a function");
        }
      } else {
        this.error("A function identifier is needed.");
      }
    };
    this.on("updateArgs", handleUpdateArgs);
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_base_Bang__WEBPACK_IMPORTED_MODULE_3__.isBang)(data))
          this.output();
      }
    });
  }
  output() {
    return this.callback();
  }
  set loading(loading) {
    this.updateUI({ loading });
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
        c.path.slice(0, -1).forEach((key) => parent = parent[key]);
        parent[c.path[c.path.length - 1]] = v;
      }
    } catch (e) {
      this.error(e);
    }
  }
}
Func.description = "Get the function itself";
Func.inlets = [{
  isHot: true,
  type: "bang",
  description: "Bang to get the function itself"
}];
Func.outlets = [{
  type: "function",
  description: "function"
}];
Func.args = [{
  type: "string",
  optional: false,
  varLength: false,
  description: "Function name"
}];


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


class Getter extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { instance: void 0, result: null };
    this.handlePreInit = () => {
      this.inlets = 1;
      this.outlets = 2;
    };
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this._.instance = data;
        if (this.execute())
          this.output();
      }
    };
    this.callback = () => this.outletAll([this._.result, this._.instance]);
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
      this._.result.then((r) => {
        this.loading = false;
        this._.result = r;
        this.callback();
      }, (r) => {
        this.loading = false;
        this.error(r);
      });
      return this;
    }
    return this.callback();
  }
  set loading(loading) {
    this.updateUI({ loading });
  }
}
Getter.importedObjectType = "Getter";
Getter.description = "Auto-imported getter";
Getter.inlets = [{
  isHot: true,
  type: "anything",
  description: "Instance to read"
}];
Getter.outlets = [{
  type: "anything",
  description: "Value"
}, {
  type: "anything",
  description: "Instance bypass"
}];
Getter.props = {
  sync: {
    type: "boolean",
    default: false,
    description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
  }
};


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
        c.path.slice(0, -1).forEach((key) => parent = parent[key]);
        parent[c.path[c.path.length - 1]] = v;
      }
    } catch (e) {
      this.error(e);
    }
  }
}
ImportedObject.description = "Auto-imported object";
class AnyImportedObject extends ImportedObject {
}


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



class Importer {
  static getObject(p, pkgName, root, path, meta) {
    throw new Error("getObject not implemented");
  }
  static writeInPath(pkgIn, pathIn, object) {
    if (pathIn.length === 0) {
      Object.assign(pkgIn, { [this.$self]: object });
      return;
    }
    const path = pathIn.slice();
    let pkg = pkgIn;
    while (path.length > 1) {
      const key = path.shift();
      if (!pkg[key])
        pkg[key] = {};
      else if ((0,_base_AbstractObject__WEBPACK_IMPORTED_MODULE_2__.isJSPatcherObjectConstructor)(pkg[key]))
        pkg[key] = { [this.$self]: pkg[key] };
      pkg = pkg[key];
    }
    pkg[path[0]] = object;
  }
  static import(pkgName, root, all, metaIn = {}, outIn, pathIn, stackIn, depthIn) {
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
    if (typeof o === "undefined" || o === null || stack.indexOf(o) !== -1 || depth && o === globalThis || o === globalThis.jspatcherEnv)
      return out;
    stack[depth] = o;
    let props;
    try {
      props = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.getPropertyDescriptors)(o);
    } catch (e) {
      return out;
    }
    if (path.length === 0) {
      const newObj = this.getObject({ value: root }, pkgName, root, []);
      if (newObj)
        this.writeInPath(out, [], newObj);
    }
    for (const key in props) {
      if (key.startsWith("$"))
        continue;
      if (typeof o === "function" && ["arguments", "caller", "length", "name", "__proto__"].indexOf(key) >= 0)
        continue;
      if (typeof o === "object" && ["constructor", "__proto__"].indexOf(key) >= 0)
        continue;
      const prop = props[key];
      const newPath = [...path, key];
      if (!all && !prop.enumerable && key.startsWith("_") && key !== "prototype")
        continue;
      const newObj = this.getObject(prop, pkgName, root, newPath, metaIn[newPath.join(".")]);
      if (newObj)
        this.writeInPath(out, newPath.map((s, i) => i !== newPath.length - 1 && s === "prototype" ? "" : s), newObj);
      const value = prop.value;
      if ((typeof value === "object" || typeof value === "function") && value !== null && (value === Array.prototype || !Array.isArray(value))) {
        this.import(pkgName, root, all, metaIn, out, newPath, stack, depth + 1);
      }
    }
    return out;
  }
}
Importer.$self = _utils_symbols__WEBPACK_IMPORTED_MODULE_0__.ImporterDirSelfObject;


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


class Method extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { instance: void 0, inputs: [], result: null };
    this.initialInlets = 1;
    this.initialOutlets = 2;
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this._.instance = data;
        if (this.execute())
          this.output();
      } else {
        this._.inputs[inlet - 1] = data;
      }
    };
    this.callback = () => this.outletAll([this._.result, this._.instance, ...this._.inputs]);
  }
  subscribe() {
    super.subscribe();
    this.on("postInit", () => {
      handleUpdateArgs(this.args);
    });
    const handleUpdateArgs = (args) => {
      this._.inputs = args.slice();
      const fn = this.imported;
      const argsCount = Math.max(fn.length, args.length, ~~+this.getProp("args"));
      this.inlets = Math.max(1, this.initialInlets + argsCount);
      this.outlets = this.initialOutlets + argsCount;
    };
    this.on("updateArgs", handleUpdateArgs);
    this.on("updateProps", (props) => {
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
      this._.result = fn.call(this._.instance, ...this.getProp("spreadArgs") ? this._.inputs.reduce((acc, cur) => [...acc, ...cur], []) : this._.inputs);
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }
  output() {
    if (this._.result instanceof Promise && !this.getProp("sync")) {
      this.loading = true;
      this._.result.then((r) => {
        this.loading = false;
        this._.result = r;
        this.callback();
      }, (r) => {
        this.loading = false;
        this.error(r);
      });
      return this;
    }
    return this.callback();
  }
  set loading(loading) {
    this.updateUI({ loading });
  }
}
Method.importedObjectType = "Method";
Method.description = "Auto-imported method";
Method.inlets = [{
  isHot: true,
  type: "anything",
  description: "Instance to read"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Method argument"
}];
Method.outlets = [{
  type: "anything",
  description: "Method return value"
}, {
  type: "anything",
  description: "Instance bypass"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after method called"
}];
Method.args = [{
  type: "anything",
  optional: true,
  varLength: true,
  description: "Set arguments while loaded"
}];
Method.props = {
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
};


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



class New extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor() {
    super(...arguments);
    this._ = { Wrapper: null, inputs: [], result: null };
    this.callback = () => this.outletAll([this._.result, ...this._.inputs]);
  }
  subscribe() {
    super.subscribe();
    this.on("postInit", () => {
      handleUpdateArgs(this.args);
    });
    const handleUpdateArgs = (args) => {
      if (typeof args[0] !== "undefined") {
        const Wrapper = this.patcher.activeLib[args[0]];
        if (!Wrapper)
          this.error(`Function ${args[0]} not found.`);
        else if (Wrapper.prototype instanceof _StaticMethod__WEBPACK_IMPORTED_MODULE_0__.default) {
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
    this.on("updateProps", (props) => {
      if (props.args && typeof props.args === "number" && props.args >= 0) {
        const Fn = this.imported;
        const argsCount = Math.max(Fn.length, this.box.args.length - 1, ~~+props.args);
        this.inlets = Math.max(1, argsCount);
        this.outlets = 1 + this.inlets;
      }
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_2__.isBang)(data))
          this._.inputs[inlet] = data;
        if (this.execute())
          this.output();
      } else {
        this._.inputs[inlet] = data;
      }
    });
  }
  execute() {
    const Fn = this.imported;
    try {
      this._.result = new Fn(...this.getProp("spreadArgs") ? this._.inputs.reduce((acc, cur) => [...acc, ...cur], []) : this._.inputs);
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
    this.updateUI({ loading });
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
        c.path.slice(0, -1).forEach((key) => parent = parent[key]);
        parent[c.path[c.path.length - 1]] = v;
      }
    } catch (e) {
      this.error(e);
    }
  }
}
New.description = "Call function as a constructor";
New.inlets = [{
  isHot: true,
  type: "anything",
  description: "Constructor argument, output instance constructed"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Constructor argument"
}];
New.outlets = [{
  type: "anything",
  description: "Instance constructed"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after constructor called"
}];
New.args = [{
  type: "string",
  optional: false,
  varLength: false,
  description: "Constructor name"
}, {
  type: "anything",
  optional: true,
  varLength: true,
  description: "Set arguments while loaded"
}];
New.props = {
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
};


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


class Property extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { instance: void 0 };
    this.handlePreInit = () => {
      this.inlets = 2;
      this.outlets = 2;
    };
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this._.instance = data;
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
    };
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", this.handlePreInit);
    this.on("inlet", this.handleInlet);
  }
}
Property.importedObjectType = "Property";
Property.description = "Auto-imported property";
Property.inlets = [{
  isHot: true,
  type: "anything",
  description: "Constructor argument, output instance constructed"
}, {
  isHot: false,
  type: "anything",
  varLength: true,
  description: "Constructor argument"
}];
Property.outlets = [{
  type: "anything",
  description: "Value"
}, {
  type: "anything",
  description: "Instance bypass"
}];


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
/* harmony export */   "default": () => (/* binding */ RemotedImporter)
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














class New extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_New__WEBPACK_IMPORTED_MODULE_0__.default) {
}
class Func extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Func__WEBPACK_IMPORTED_MODULE_1__.default) {
}
class Property extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Property__WEBPACK_IMPORTED_MODULE_2__.default) {
}
class Getter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Getter__WEBPACK_IMPORTED_MODULE_3__.default) {
}
class Setter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Setter__WEBPACK_IMPORTED_MODULE_4__.default) {
}
class SetterGetter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_SetterGetter__WEBPACK_IMPORTED_MODULE_5__.default) {
}
class Method extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_Method__WEBPACK_IMPORTED_MODULE_6__.default) {
}
class StaticProperty extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticProperty__WEBPACK_IMPORTED_MODULE_7__.default) {
}
class StaticGetter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticGetter__WEBPACK_IMPORTED_MODULE_8__.default) {
}
class StaticSetter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticSetter__WEBPACK_IMPORTED_MODULE_9__.default) {
}
class StaticSetterGetter extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticSetterGetter__WEBPACK_IMPORTED_MODULE_10__.default) {
}
class StaticMethod extends (0,_base_generateRemotedObject__WEBPACK_IMPORTED_MODULE_12__.default)(_StaticMethod__WEBPACK_IMPORTED_MODULE_11__.default) {
}
class RemotedImporter extends _Importer__WEBPACK_IMPORTED_MODULE_13__.default {
  static getObject(p, pkgName, root, path, meta) {
    var _a;
    const isStatic = path[path.length - 2] !== "prototype";
    let Super;
    const type = typeof p.value;
    if (type === "function") {
      if (isStatic)
        Super = StaticMethod;
      else
        Super = Method;
    } else if (type === "undefined") {
      const setter = p.set;
      const getter = p.get;
      if (isStatic) {
        if (setter && getter)
          Super = StaticSetterGetter;
        else if (setter)
          Super = StaticSetter;
        else if (getter)
          Super = StaticGetter;
        else
          return null;
      } else {
        if (setter && getter)
          Super = SetterGetter;
        else if (setter)
          Super = Setter;
        else if (getter)
          Super = Getter;
        else
          return null;
      }
    } else {
      if (isStatic)
        Super = StaticProperty;
      else
        Super = Property;
    }
    const Ctor = (_a = class extends Super {
      static get _name() {
        return path[path.length - 1] || pkgName;
      }
    }, _a.package = pkgName, _a.root = root, _a.path = path, _a);
    if (meta) {
      for (const keyIn in meta) {
        const key = keyIn;
        if (key === "name")
          continue;
        Ctor[key] = meta[key];
      }
    }
    return Ctor;
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


class Setter extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.initialInlets = 2;
    this.initialOutlets = 1;
    this._ = { instance: void 0, input: null };
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this._.instance = data;
        if (typeof this._.instance === "undefined")
          return;
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
    };
    this.handleUpdateArgs = (args) => {
      if (args.length)
        this._.input = args[0];
    };
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
Setter.importedObjectType = "Setter";
Setter.description = "Auto-imported setter";
Setter.inlets = [{
  isHot: true,
  type: "anything",
  description: "Instance to set property"
}, {
  isHot: false,
  type: "anything",
  description: "Set the value"
}];
Setter.outlets = [{
  type: "anything",
  description: "Instance bypass"
}];
Setter.args = [{
  type: "anything",
  optional: true,
  varLength: false,
  description: "Initial value to set"
}];


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


class SetterGetter extends _ImportedObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.initialInlets = 2;
    this.initialOutlets = 2;
    this._ = { instance: void 0, input: null, result: null };
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this._.instance = data;
        if (typeof this._.instance === "undefined")
          return;
        if (typeof this._.input !== "undefined") {
          try {
            this._.instance[this.name] = this._.input;
          } catch (e) {
            this.error(e);
            return;
          }
        }
        if (this.execute())
          this.output();
      } else if (inlet === 1) {
        this._.input = data;
      }
    };
    this.callback = () => this.outletAll([this._.result, this._.instance]);
  }
  subscribe() {
    super.subscribe();
    this.on("preInit", () => {
      this.inlets = this.initialInlets;
      this.outlets = this.initialOutlets;
      handleUpdateArgs(this.args);
    });
    const handleUpdateArgs = (args) => {
      if (args.length)
        this._.input = args[0];
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
      this._.result.then((r) => {
        this.loading = false;
        this._.result = r;
        this.callback();
      }, (r) => {
        this.loading = false;
        this.error(r);
      });
      return this;
    }
    return this.callback();
  }
  set loading(loading) {
    this.updateUI({ loading });
  }
}
SetterGetter.importedObjectType = "SetterGetter";
SetterGetter.description = "Auto-imported setter / getter";
SetterGetter.inlets = [{
  isHot: true,
  type: "anything",
  description: "Instance to manipulate"
}, {
  isHot: false,
  type: "anything",
  description: "Set the value"
}];
SetterGetter.outlets = [{
  type: "anything",
  description: "Value"
}, {
  type: "anything",
  description: "Instance bypass"
}];
SetterGetter.args = [{
  type: "anything",
  optional: true,
  varLength: false,
  description: "Initial value to set"
}];
SetterGetter.props = {
  sync: {
    type: "boolean",
    default: false,
    description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
  }
};


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


class StaticGetter extends _Getter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.handlePreInit = () => {
      this.inlets = 1;
      this.outlets = 1;
    };
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0 && (0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data) && this.execute())
        this.output();
    };
    this.callback = () => this.outlet(0, this._.result);
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
StaticGetter.importedObjectType = "StaticGetter";
StaticGetter.description = "Auto-imported static getter";
StaticGetter.inlets = [{
  isHot: true,
  type: "bang",
  description: "Get the value"
}];
StaticGetter.outlets = [{
  type: "anything",
  description: "Value"
}];


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
var _a;



class StaticMethod extends _Method__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.initialInlets = 0;
    this.initialOutlets = 1;
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_2__.isBang)(data))
          this._.inputs[inlet] = data;
        if (this.execute())
          this.output();
      } else {
        this._.inputs[inlet] = data;
      }
    };
    this.callback = () => this.outletAll([this._.result, ...this._.inputs]);
  }
  execute() {
    const fn = this.imported;
    try {
      this._.result = fn(...this.getProp("spreadArgs") ? this._.inputs.reduce((acc, cur) => [...acc, ...cur], []) : this._.inputs);
      return true;
    } catch (e) {
      this.error(e);
      return false;
    }
  }
}
_a = _utils_symbols__WEBPACK_IMPORTED_MODULE_1__.ImportedStaticMethodObject;
StaticMethod.importedObjectType = "StaticMethod";
StaticMethod[_a] = true;
StaticMethod.description = "Auto-imported static method";
StaticMethod.inlets = [{
  isHot: true,
  type: "anything",
  varLength: true,
  description: "Method argument"
}];
StaticMethod.outlets = [{
  type: "anything",
  description: "Method return value"
}, {
  type: "anything",
  varLength: true,
  description: "Argument after method called"
}];


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


class StaticProperty extends _Property__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.handlePreInit = () => {
      this.inlets = 2;
      this.outlets = 1;
    };
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        if ((0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          this.outlet(0, this.imported);
      } else if (inlet === 1) {
        this.imported = data;
      }
    };
  }
  subscribe() {
    super.subscribe();
    this.on("updateArgs", (args) => {
      if (args.length)
        this.imported = args[0];
    });
    this.on("inlet", this.handleInlet);
  }
}
StaticProperty.importedObjectType = "StaticProperty";
StaticProperty.description = "Auto-imported static property";
StaticProperty.inlets = [{
  isHot: true,
  type: "bang",
  description: "Get the value"
}, {
  isHot: false,
  type: "anything",
  description: "Set the value"
}];
StaticProperty.outlets = [{
  type: "anything",
  description: "Value"
}];
StaticProperty.args = [{
  type: "anything",
  optional: true,
  description: "Set the value while loaded."
}];


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

class StaticSetter extends _Setter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.initialInlets = 1;
    this.initialOutlets = 0;
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0)
        this.imported = data;
    };
    this.handleUpdateArgs = (args) => {
      if (args.length)
        this.imported = args[0];
    };
  }
}
StaticSetter.importedObjectType = "StaticSetter";
StaticSetter.description = "Auto-imported static setter";
StaticSetter.inlets = [{
  isHot: false,
  type: "anything",
  description: "Set the value"
}];
StaticSetter.outlets = [];


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


class StaticSetterGetter extends _SetterGetter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.initialInlets = 2;
    this.initialOutlets = 1;
    this.handleInlet = ({ data, inlet }) => {
      if (inlet === 0) {
        if (!(0,_base_Bang__WEBPACK_IMPORTED_MODULE_1__.isBang)(data))
          return;
        if (typeof this._.input !== "undefined") {
          try {
            this.imported = this._.input;
          } catch (e) {
            this.error(e);
            return;
          }
        }
        if (this.execute())
          this.output();
      } else if (inlet === 1) {
        this._.input = data;
      }
    };
    this.callback = () => this.outlet(0, this._.result);
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
StaticSetterGetter.importedObjectType = "StaticSetterGetter";
StaticSetterGetter.description = "Auto-imported static setter / getter";
StaticSetterGetter.inlets = [{
  isHot: true,
  type: "bang",
  description: "Get the value"
}, {
  isHot: false,
  type: "anything",
  description: "Set the value"
}];
StaticSetterGetter.outlets = [{
  type: "anything",
  description: "Value"
}];


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

class AudioIn extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { index: this.index };
    this.handlePatcherInput = ({ input, buffer }) => {
      if (input === this.index - 1)
        this.outlet(0, buffer);
    };
    this.emitPatcherChangeIO = () => this.patcher.changeIO();
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
      const { index } = this;
      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", (props) => {
      const outlet0 = __spreadValues({}, this.meta.outlets[0]);
      if (typeof props.description === "string")
        outlet0.description = props.description;
      this.setMeta({ outlets: [outlet0] });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet")
      this.patcher.on("audioInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("audioInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }
}
AudioIn.isPatcherInlet = "audio";
AudioIn.description = "Patcher inlet (audio)";
AudioIn.args = [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}];
AudioIn.props = {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
};
AudioIn.outlets = [{
  type: "object",
  description: "Float32Array buffer"
}];


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

class AudioOut extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { index: this.index };
    this.emitPatcherChangeIO = () => {
      this.patcher.inspectAudioIO();
      this.patcher.changeIO();
    };
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
      const { index } = this;
      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", (props) => {
      const inlet0 = __spreadValues({}, this.meta.inlets[0]);
      if (typeof props.description === "string")
        inlet0.description = props.description;
      this.setMeta({ inlets: [inlet0] });
      this.emitPatcherChangeIO();
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0)
        this.patcher.outputAudio(this.index - 1, data);
    });
    this.on("destroy", this.emitPatcherChangeIO);
  }
}
AudioOut.isPatcherOutlet = "audio";
AudioOut.description = "Patcher outlet (audio)";
AudioOut.args = [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}];
AudioOut.props = {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
};
AudioOut.inlets = [{
  isHot: true,
  type: "anything",
  description: "Float32Array buffer"
}];


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

class In extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { index: this.index };
    this.handlePatcherInput = ({ data, inlet }) => {
      if (inlet === this.index - 1)
        this.outlet(0, data);
    };
    this.emitPatcherChangeIO = () => this.patcher.changeIO();
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
      const { index } = this;
      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", (props) => {
      const outlet0 = __spreadValues({}, this.meta.outlets[0]);
      if (typeof props.description === "string")
        outlet0.description = props.description;
      if (typeof props.type === "string")
        outlet0.type = props.type || "anything";
      this.setMeta({ outlets: [outlet0] });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet")
      this.patcher.on("dataInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("dataInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }
}
In.isPatcherInlet = "data";
In.description = "Patcher inlet (data)";
In.args = [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}];
In.props = {
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
};
In.outlets = [{
  type: "anything",
  description: ""
}];


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

class Out extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this._ = { index: this.index };
    this.emitPatcherChangeIO = () => this.patcher.changeIO();
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
      const { index } = this;
      if (index !== this._.index) {
        this._.index = index;
        this.patcher.changeIO();
      }
    });
    this.on("updateProps", (props) => {
      const inlet0 = __spreadValues({}, this.meta.inlets[0]);
      if (typeof props.description === "string")
        inlet0.description = props.description;
      if (typeof props.type === "string")
        inlet0.type = props.type || "anything";
      this.setMeta({ inlets: [inlet0] });
      this.emitPatcherChangeIO();
    });
    this.on("inlet", ({ data, inlet }) => {
      if (inlet === 0)
        this.patcher.outlet(this.index - 1, data);
    });
    this.on("destroy", this.emitPatcherChangeIO);
  }
}
Out.isPatcherOutlet = "data";
Out.description = "Patcher outlet (data)";
Out.args = [{
  type: "number",
  optional: false,
  default: 1,
  description: "Inlet index (1-based)"
}];
Out.props = {
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
};
Out.inlets = [{
  isHot: true,
  type: "anything",
  description: ""
}];


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

class Param extends _base_BaseObject__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor() {
    super(...arguments);
    this.handlePatcherInput = ({ param, buffer }) => {
      if (this.args[0] === param)
        this.outlet(0, buffer);
    };
    this.emitPatcherChangeIO = () => this.patcher.changeIO();
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
    this.on("updateProps", (props) => {
      const outlet0 = __spreadValues({}, this.meta.outlets[0]);
      if (typeof props.description === "string")
        outlet0.description = props.description;
      this.setMeta({ outlets: [outlet0] });
      this.emitPatcherChangeIO();
    });
    if (this.env.thread === "AudioWorklet")
      this.patcher.on("paramInput", this.handlePatcherInput);
    this.on("destroy", () => {
      this.patcher.off("paramInput", this.handlePatcherInput);
      this.patcher.changeIO();
    });
  }
}
Param.description = "Patcher outlet (data)";
Param.args = [{
  type: "string",
  optional: false,
  default: "",
  description: "Parameter name"
}];
Param.props = {
  description: {
    type: "string",
    default: "",
    description: "Description text"
  }
};
Param.outlets = [{
  type: "anything",
  description: ""
}];


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


class Box extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(patcherIn, boxIn) {
    super();
    this.text = "";
    this.inlets = 0;
    this.outlets = 0;
    var _a;
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
    if (!this.presentationRect)
      this.presentationRect = this.rect.slice();
    this.data = boxIn.data || ((_a = boxIn.prevData) == null ? void 0 : _a.storage) || {};
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
      if (!newMeta.props[key])
        delete this.props[key];
    }
    if (this._parsed.args.length)
      this.args = this._parsed.args;
    Object.assign(this.props, this._parsed.props);
    const Constructor = this._patcher.getObjectConstructor(this._parsed);
    this._Object = Constructor;
    if (!this.size.every((v) => v > 0))
      this.size = this.defaultSize;
    if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isTPresentationRect)(this.presentationRect) || this.presentationSize.every((v) => typeof v === "number") && !this.presentationSize.every((v) => v > 0))
      this.presentationSize = this.defaultSize;
    this._object = new Constructor(this, this._patcher);
    await this._object.init();
    return this;
  }
  async postInit() {
    await this._object.postInit();
    return this;
  }
  fn(inlet, data) {
    this._object.fn(inlet, data);
    return this;
  }
  get UI() {
    return this._Object.UI;
  }
  get defaultSize() {
    var _a;
    return ((_a = this.UI) == null ? void 0 : _a.defaultSize) || [90, 20];
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
    if (!this._inletLines[index])
      this._inletLines[index] = new Set();
    this._inletLines[index].add(line);
  }
  removeInletLine(line) {
    const index = line.destInlet;
    if (this._inletLines[index])
      this._inletLines[index].delete(line);
  }
  addOutletLine(line) {
    const index = line.srcOutlet;
    if (!this._outletLines[index])
      this._outletLines[index] = new Set();
    this._outletLines[index].add(line);
  }
  removeOutletLine(line) {
    const index = line.srcOutlet;
    if (this._outletLines[index])
      this._outletLines[index].delete(line);
  }
  setInlets(count) {
    const lines = this.allLines;
    lines.forEach((line) => line.disable());
    this.inlets = count;
    lines.forEach((line) => line.enable());
    const linesSetLength = this._inletLines.length;
    if (count > linesSetLength)
      this._inletLines.push(...new Array(count - linesSetLength).fill(null).map(() => new Set()));
    else if (count < linesSetLength)
      this._inletLines.splice(count);
    this._inletLines.forEach((set) => set.forEach((line) => line.uiUpdateDest()));
    this.emit("ioCountChanged", this);
  }
  setOutlets(count) {
    const lines = this.allLines;
    lines.forEach((line) => line.disable());
    this.outlets = count;
    lines.forEach((line) => line.enable());
    const linesSetLength = this._outletLines.length;
    if (count > linesSetLength)
      this._outletLines.push(...new Array(count - linesSetLength).fill(null).map(() => new Set()));
    else if (count < linesSetLength)
      this._outletLines.splice(count);
    this._outletLines.forEach((set) => set.forEach((line) => line.uiUpdateSrc()));
    this.emit("ioCountChanged", this);
  }
  getInletPos(port) {
    const { rect, inlets } = this;
    const [left, top, width] = rect;
    return { top, left: left + 10 + (width - 20) * port / (inlets > 1 ? inlets - 1 : 1) };
  }
  getOutletPos(port) {
    const { rect, outlets } = this;
    const [left, top, width, height] = rect;
    return { top: top + height, left: left + 10 + (width - 20) * port / (outlets > 1 ? outlets - 1 : 1) };
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
    this._inletLines.forEach((set) => set.forEach((line) => lines.add(line)));
    this._outletLines.forEach((set) => set.forEach((line) => lines.add(line)));
    return lines;
  }
  connectedOutlet(outlet, destBoxId, destInlet, lineId) {
    if (this._object)
      this._object.connectedOutlet(outlet, destBoxId, destInlet, lineId);
    this.emit("connectedPort", { isSrc: true, i: outlet });
    return this;
  }
  connectedInlet(inlet, srcBoxId, srcOutlet, lineId) {
    if (this._object)
      this._object.connectedInlet(inlet, srcBoxId, srcOutlet, lineId);
    this.emit("connectedPort", { isSrc: false, i: inlet });
    return this;
  }
  disconnectedOutlet(outlet, destBoxId, destInlet, lineId) {
    if (this._object)
      this._object.disconnectedOutlet(outlet, destBoxId, destInlet, lineId);
    const last = this._patcher.getLinesBySrcID(this.id)[outlet].length === 1;
    this.emit("disconnectedPort", { isSrc: true, i: outlet, last });
    return this;
  }
  disconnectedInlet(inlet, srcBoxId, srcOutlet, lineId) {
    if (this._object)
      this._object.disconnectedInlet(inlet, srcBoxId, srcOutlet, lineId);
    const last = this._patcher.getLinesByDestID(this.id)[inlet].length === 1;
    this.emit("disconnectedPort", { isSrc: false, i: inlet, last });
    return this;
  }
  isOutletTo(outlet, box, inlet) {
    const iterator = this._outletLines[outlet].values();
    let r;
    while (!(r = iterator.next()).done) {
      const line = r.value;
      if (line.destBox === box && line.destInlet === inlet)
        return true;
    }
    return false;
  }
  isInletFrom(inlet, box, outlet) {
    const iterator = this._inletLines[inlet].values();
    let r;
    while (!(r = iterator.next()).done) {
      const line = r.value;
      if (line.srcBox === box && line.srcOutlet === outlet)
        return true;
    }
    return false;
  }
  async changeText(textIn, force) {
    if (!force && textIn === this.text)
      return this;
    const { defaultSize: oldDefaultSize } = this;
    this.allLines.forEach((line) => line.disable());
    await this._object.destroy();
    this.text = textIn;
    this.args = [];
    await this.init();
    this.allLines.forEach((line) => line.enable());
    const { defaultSize } = this;
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
    const { args, props } = e;
    if (args)
      this.args = args;
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
  set position([leftIn, topIn]) {
    const [left, top, width, height] = this.rect;
    this.setRect([typeof leftIn === "number" ? leftIn : left, typeof topIn === "number" ? topIn : top, width, height]);
  }
  get presentationPosition() {
    return this.presentationRect.slice(0, 2);
  }
  set presentationPosition([leftIn, topIn]) {
    const [left, top, width, height] = this.presentationRect;
    this.setPresentationRect([typeof leftIn === "number" || typeof leftIn === "string" ? leftIn : left, typeof topIn === "number" || typeof topIn === "string" ? topIn : top, width, height]);
  }
  get size() {
    return this.rect.slice(2);
  }
  set size([widthIn, heightIn]) {
    const [left, top, width, height] = this.rect;
    this.setRect([left, top, widthIn || width, heightIn || height]);
  }
  get presentationSize() {
    return this.presentationRect.slice(2);
  }
  set presentationSize([widthIn, heightIn]) {
    const [left, top, width, height] = this.presentationRect;
    this.setPresentationRect([left, top, widthIn || width, heightIn || height]);
  }
  getLeft(inPresentation = false) {
    const rectKey = inPresentation ? "presentationRect" : "rect";
    return this[rectKey][0];
  }
  setLeft(leftIn, inPresentation = false) {
    const positionKey = inPresentation ? "presentationPosition" : "position";
    this[positionKey] = [leftIn, void 0];
  }
  getTop(inPresentation = false) {
    const rectKey = inPresentation ? "presentationRect" : "rect";
    return this[rectKey][1];
  }
  setTop(topIn, inPresentation = false) {
    const positionKey = inPresentation ? "presentationPosition" : "position";
    this[positionKey] = [void 0, topIn];
  }
  getWidth(inPresentation = false) {
    const rectKey = inPresentation ? "presentationRect" : "rect";
    return this[rectKey][2];
  }
  setWidth(widthIn, inPresentation = false) {
    const sizeKey = inPresentation ? "presentationSize" : "size";
    this[sizeKey] = [widthIn, void 0];
  }
  getHeight(inPresentation = false) {
    const rectKey = inPresentation ? "presentationRect" : "rect";
    return this[rectKey][3];
  }
  setHeight(heightIn, inPresentation = false) {
    const sizeKey = inPresentation ? "presentationSize" : "size";
    this[sizeKey] = [void 0, heightIn];
  }
  setBackground(bool) {
    if (!!this.background === !!bool)
      return this;
    this.background = bool;
    this.emit("backgroundChanged", this);
    return this;
  }
  setPresentation(bool) {
    if (!!this.presentation === !!bool)
      return this;
    this.presentation = bool;
    if (bool)
      this.presentationRect = this.rect.slice();
    this.emit("presentationChanged", this);
    return this;
  }
  setRect(rect) {
    if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isTRect)(rect))
      return this;
    rect[0] = Math.max(0, rect[0]);
    rect[1] = Math.max(0, rect[1]);
    rect[2] = Math.max(15, rect[2]);
    rect[3] = Math.max(15, rect[3]);
    this.rect = rect;
    this.inletLines.forEach((set) => set.forEach((line) => line.uiUpdateDest()));
    this.outletLines.forEach((set) => set.forEach((line) => line.uiUpdateSrc()));
    this.emit("rectChanged", this);
    return this;
  }
  setPresentationRect(rect) {
    if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isTPresentationRect)(rect))
      return this;
    if (typeof rect[0] === "number")
      rect[0] = Math.max(0, rect[0]);
    if (typeof rect[1] === "number")
      rect[1] = Math.max(0, rect[1]);
    if (typeof rect[2] === "number")
      rect[2] = Math.max(15, rect[2]);
    if (typeof rect[3] === "number")
      rect[3] = Math.max(15, rect[3]);
    this.presentationRect = rect;
    this.emit("presentationRectChanged", this);
    return this;
  }
  getIsMovable(inPresentation = false) {
    if (!inPresentation)
      return true;
    return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isRectMovable)(this.presentationRect);
  }
  getIsResizable(inPresentation = false) {
    if (!inPresentation)
      return true;
    return (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.isRectResizable)(this.presentationRect);
  }
  error(text) {
    this.emit("error", text);
  }
  highlight() {
    this.emit("highlight", this);
  }
  highlightPort(isSrc, i, highlight) {
    this.emit("highlightPort", { isSrc, i, highlight });
  }
  undoable(e) {
    this._patcher.boxChanged(this.id, e);
  }
  async changeObject({ args, props, state }, options) {
    if (args)
      await this._object.updateArgs(args, options);
    if (props)
      await this._object.updateProps(props, options);
    if (state)
      await this._object.updateState(state, options);
  }
  async destroy() {
    this.allLines.forEach((line) => this._patcher.deleteLine(line.id));
    await this._object.destroy();
    delete this._patcher.boxes[this.id];
    return this;
  }
  static parseObjText(strIn) {
    const REGEX = /`([^`]*)`|[^\s]+/gi;
    const strArray = [];
    let match = REGEX.exec(strIn);
    while (match != null) {
      strArray.push(match[1] ? match[1] : match[0]);
      match = REGEX.exec(strIn);
    }
    const objOut = { class: "", args: [], props: {} };
    let lastProp;
    if (strArray.length)
      objOut.class = strArray.shift();
    while (strArray.length) {
      const el = strArray.shift();
      if (typeof lastProp === "undefined" && el.charAt(0) !== "@") {
        try {
          objOut.args.push(JSON.parse(el));
        } catch (e) {
          objOut.args.push(el);
        }
        continue;
      }
      if (el.length > 1 && el.charAt(0) === "@") {
        lastProp = el.substr(1);
        objOut.props[lastProp] = [];
        continue;
      }
      try {
        objOut.props[lastProp].push(JSON.parse(el));
      } catch (e) {
        objOut.props[lastProp].push(el);
      }
    }
    for (const key in objOut.props) {
      if (objOut.props[key].length === 0)
        objOut.props[key] = true;
      else if (objOut.props[key].length === 1)
        objOut.props[key] = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseToPrimitive)(objOut.props[key][0]);
      else
        objOut.props[key] = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.parseToPrimitive)(objOut.props[key].join(" "));
    }
    return objOut;
  }
  toString() {
    const { id, text, inlets, outlets, rect, background, presentation, presentationRect, args, props, data } = this;
    return JSON.stringify({ id, text, inlets, outlets, rect, background, presentation, presentationRect, args, props, data });
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
  if (visitedBoxes.indexOf(box) >= 0)
    return;
  visitedBoxes.push(box);
  if (box.object.class === "Iterator" && box !== visitedBoxes[0])
    return;
  const inletLines = Array.from(box.inletLines);
  if (box.object.class === "Receive") {
    const { sendID, _: { sendMap } } = box.object;
    if (sendMap[sendID]) {
      sendMap[sendID].forEach((s) => inletLines.push(...s.inletLines));
    }
  }
  inletLines.forEach((lines) => lines.forEach((line) => {
    const { srcBox } = line;
    if (srcBox.object.class === "In" && ins.indexOf(srcBox.object) === -1)
      ins.push(srcBox.object);
    else if (srcBox.object.class === "Rec" && recs.indexOf(srcBox.object) === -1)
      recs.push(srcBox.object);
    if (srcBox.object.class === "Effect")
      lineMap.set(line, "_");
    else
      lineMap.set(line, `${srcBox.object.resultID}_${line.srcOutlet}`);
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
  const lineMap = new Map();
  outs.forEach((out) => mapLines(out.box, patcher, visitedBoxes, ins, recs, lineMap));
  visitedBoxes.forEach((box) => {
    if (box.object.class === "In")
      return;
    if (box.object.class === "Out")
      return;
    if (box.object.class === "Rec")
      return;
    if (outs.indexOf(box.object) !== -1)
      return;
    const { onces: o, exprs: e } = box.object.toExpr(lineMap);
    if (o)
      onces.push(...o.filter((v) => onces.indexOf(v) === -1));
    if (e)
      exprs.push(...e);
  });
  exprs.reverse();
  recs.forEach((rec) => {
    exprs.push(...rec.toExpr(lineMap).exprs || []);
    const recIn = rec.resultID;
    const recOut = `${recIn}_0`;
    recIns.push(recIn);
    recOuts.push(recOut);
  });
  ins = ins.sort((a, b) => a.index - b.index);
  ins.forEach((in_) => {
    const id = `${in_.resultID}_0`;
    if (mainIns.indexOf(id) === -1)
      mainIns.push(id);
  });
  outs.forEach((out) => {
    if (out.class === "Iterator")
      exprs.push(...out.toNormalExpr(lineMap).exprs || []);
    else
      exprs.push(...out.toExpr(lineMap).exprs || []);
    const id = out.resultID;
    if (mainIns.indexOf(id) === -1)
      mainOuts.push(id);
  });
  exprs.forEach((s, i) => exprs[i] = `    ${s.replace(/\n/g, "\n    ")}`);
  if (recIns.length) {
    exprs.unshift(`Main(${[...recOuts, ...mainIns].join(", ")}) = ${[...recIns, ...mainOuts].join(", ")} with {`);
    exprs.push("};", `Rec = ${recIns.map(() => "_").join(", ")} : ${recOuts.map(() => "_").join(", ")};`, `${lambdaName} = Main ~ Rec : ${[...recIns.map(() => "!"), ...mainOuts.map(() => "_")].join(", ")};`);
  } else if (mainIns.length) {
    exprs.unshift(`${lambdaName}(${mainIns.join(", ")}) = ${mainOuts.join(", ")} with {`);
    exprs.push("};");
  } else if (exprs.length) {
    exprs.unshift(`${lambdaName} = ${mainOuts.join(", ")} with {`);
    exprs.push("};");
  } else {
    exprs.push(`${lambdaName} = 0;`);
  }
  return { onces, exprs, ins, outs };
};
const toFaustDspCode = (patcher) => inspectFaustPatcher(patcher).code;
const inspectFaustPatcher = (patcher) => {
  const imports = [];
  let outs = [];
  const effects = [];
  for (const boxId in patcher.boxes) {
    const box = patcher.boxes[boxId];
    if (box.object.class === "Effect")
      effects.push(box.object);
    else if (box.object.class === "Out")
      outs.push(box.object);
    else if (box.object.class === "Import")
      imports.push(box.object);
  }
  outs = outs.sort((a, b) => a.index - b.index);
  const { onces, exprs, ins } = toFaustLambda(patcher, outs, "process");
  if (effects.length) {
    const { onces: fxOnces, exprs: fxExprs, ins: fxIns } = toFaustLambda(patcher, [effects[0]], "effect");
    onces.push(...fxOnces.filter((v) => onces.indexOf(v) === -1));
    exprs.push(...fxExprs);
    ins.push(...fxIns);
  }
  imports.map((i) => i.toOnceExpr()).forEach((o) => onces.push(...o.filter((v) => onces.indexOf(v) === -1)));
  const code = `${onces.join("\n")}${onces.length ? "\n" : ""}${exprs.join("\n")}
`;
  return { code, onces, exprs, ins, outs };
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

class Line extends _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(patcherIn, lineIn) {
    super();
    this.disabled = true;
    this.updateType = () => {
      const type = this.calcType();
      if (type !== this._type) {
        this._type = type;
        this.emit("typeChanged", type);
      }
    };
    this.id = lineIn.id;
    this.src = lineIn.src;
    this.dest = lineIn.dest;
    this.disabled = true;
    this._patcher = patcherIn;
    const { srcBox, destBox } = this;
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
  static isConnectableByAudio(from, outlet, to, inlet) {
    const fromConnection = from.outletAudioConnections[outlet];
    const toConnection = to.inletAudioConnections[inlet];
    if (!fromConnection)
      return false;
    if (!toConnection)
      return false;
    if (!fromConnection.node)
      return false;
    if (!toConnection.node)
      return false;
    return true;
  }
  static isWamNode(x) {
    var _a;
    return typeof x === "object" && x !== null && ((_a = x == null ? void 0 : x.module) == null ? void 0 : _a.isWebAudioModule);
  }
  static compare(line1, line2) {
    return line2.positionHash - line1.positionHash;
  }
  get isConnectableByAudio() {
    if (this._patcher.props.mode !== "js")
      return false;
    return Line.isConnectableByAudio(this.srcBox.object, this.srcOutlet, this.destBox.object, this.destInlet);
  }
  get presentation() {
    return this.srcBox && this.srcBox.presentation && this.destBox && this.destBox.presentation;
  }
  setSrc(src) {
    const srcId = src[0];
    const srcOutlet = src[1];
    if (srcId === this.src[0] && srcOutlet === this.src[1])
      return this;
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
    if (destId === this.dest[0] && destInlet === this.dest[1])
      return this;
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
    if (bool === false)
      return this.enable();
    if (this.disabled)
      return this;
    this.disabled = true;
    const { srcBox, destBox } = this;
    if (this._patcher.getLinesByBox(this.srcId, this.destId, this.srcOutlet, this.destInlet).length > 1)
      return this;
    if (this.isConnectableByAudio) {
      const from = this.srcBox.object.outletAudioConnections[this.srcOutlet];
      const to = this.destBox.object.inletAudioConnections[this.destInlet];
      if (from && to && from.node && to.node) {
        const isAudioParam = to.node instanceof AudioParam;
        try {
          if (isAudioParam)
            from.node.disconnect(to.node, from.index);
          else
            from.node.disconnect(to.node, from.index, to.index);
          if (Line.isWamNode(from.node) && Line.isWamNode(to.node))
            from.node.disconnectEvents(to.node);
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
    if (bool === false)
      return this.disable();
    if (!this.disabled)
      return this;
    const { srcBox, destBox } = this;
    if (this.srcOutlet >= srcBox.outlets || this.destInlet >= destBox.inlets)
      return this._patcher.deleteLine(this.id);
    if (this._patcher.getLinesByBox(this.srcId, this.destId, this.srcOutlet, this.destInlet).length > 1)
      return this;
    if (this.isConnectableByAudio) {
      const from = this.srcBox.object.outletAudioConnections[this.srcOutlet];
      const to = this.destBox.object.inletAudioConnections[this.destInlet];
      if (from && to && from.node && to.node) {
        const isAudioParam = to.node instanceof AudioParam;
        try {
          if (isAudioParam)
            from.node.connect(to.node, from.index);
          else
            from.node.connect(to.node, from.index, to.index);
          if (Line.isWamNode(from.node) && Line.isWamNode(to.node))
            from.node.connectEvents(to.node);
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
    const { top, left } = this._patcher.boxes[this.dest[0]].getInletPos(this.dest[1]);
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
    if (srcMeta[this.srcOutlet])
      srcType = srcMeta[this.srcOutlet].type;
    else if (srcMeta[srcMeta.length - 1] && srcMeta[srcMeta.length - 1].varLength)
      srcType = srcMeta[srcMeta.length - 1].type;
    if (destMeta[this.destInlet])
      destType = destMeta[this.destInlet].type;
    else if (destMeta[destMeta.length - 1] && destMeta[destMeta.length - 1].varLength)
      destType = destMeta[destMeta.length - 1].type;
    return srcType === "signal" && destType === "signal" ? "audio" : "normal";
  }
  get type() {
    return this._type;
  }
  toString() {
    return JSON.stringify(this.toSerializable());
  }
  toSerializable() {
    const { id, src, dest, disabled } = this;
    return { id, src: [...src], dest: [...dest], disabled };
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
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));








const _Patcher = class extends _file_FileInstance__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(options) {
    super(options);
    this.lines = {};
    this.boxes = {};
    this._inletAudioConnections = [];
    this._outletAudioConnections = [];
    this._history = new _PatcherHistory__WEBPACK_IMPORTED_MODULE_4__.default();
    this._state = {
      name: "patcher",
      isReady: false,
      log: [],
      selected: [],
      pkgMgr: void 0,
      preventEmitChanged: false
    };
    this.lines = {};
    this.boxes = {};
    this.props = {
      mode: "js",
      dependencies: _Patcher.props.dependencies.default.slice(),
      bgColor: _Patcher.props.bgColor.default,
      editingBgColor: _Patcher.props.editingBgColor.default,
      grid: _Patcher.props.grid.default.slice(),
      openInPresentation: _Patcher.props.openInPresentation.default,
      boxIndexCount: 0,
      lineIndexCount: 0
    };
  }
  static async fromProjectItem(options) {
    return new this(options).init();
  }
  async getEditor() {
    const editor = new _PatcherEditor__WEBPACK_IMPORTED_MODULE_1__.default(this);
    return editor.init();
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
    var _a;
    return ((_a = this.project) == null ? void 0 : _a.audioCtx) || this.env.audioCtx;
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
    var _a;
    return ((_a = this.file) == null ? void 0 : _a.name) || `${this._state.name}.${this.fileExtension}`;
  }
  emitGraphChanged() {
    if (this._state.preventEmitChanged)
      return;
    this.emit("graphChanged");
    this.emitChanged();
  }
  emitChanged() {
    if (this._state.preventEmitChanged)
      return;
    this.emit("changed");
  }
  boxChanged(boxId, changed) {
    this.emit("boxChanged", __spreadValues({ boxId }, changed));
  }
  async init(data = ((_a) => (_a = this.file) == null ? void 0 : _a.data)(), fileName = this.fileName) {
    if (data instanceof ArrayBuffer) {
      if (!data.byteLength)
        return this.load({});
      const patcherIn = await new Response(data).json();
      const splitName = fileName.split(".");
      const ext = splitName.pop();
      const extMap = { json: "js", jspat: "js", maxpat: "max", gendsp: "gen", dsppat: "faust" };
      return this.load(patcherIn, extMap[ext] || "js");
    }
    return this.load(data || {});
  }
  async load(patcherIn, modeIn) {
    var _a;
    this._state.isReady = false;
    this._state.preventEmitChanged = true;
    await this.unload();
    if (typeof patcherIn !== "object") {
      this._state.isReady = true;
      this._state.preventEmitChanged = false;
      this.emit("ready");
      return this;
    }
    this.props.mode = ((_a = patcherIn.props) == null ? void 0 : _a.mode) || modeIn || "js";
    this.state.pkgMgr = new _PackageManager__WEBPACK_IMPORTED_MODULE_5__.default(this);
    const { mode } = this.props;
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
    if (patcher.props)
      this.props = __spreadProps(__spreadValues(__spreadValues({}, this.props), patcher.props), { mode });
    if (Array.isArray(this.props.bgColor))
      this.props.bgColor = `rgba(${this.props.bgColor.join(", ")})`;
    if (Array.isArray(this.props.editingBgColor))
      this.props.editingBgColor = `rgba(${this.props.editingBgColor.join(", ")})`;
    if (mode === "js" && this.props.dependencies) {
      const { dependencies } = this.props;
      if (!Array.isArray(dependencies)) {
        this.props.dependencies = [];
        for (const key in dependencies) {
          this.props.dependencies.push([key, dependencies[key]]);
        }
      }
    }
    await this._state.pkgMgr.init();
    if (patcher.boxes) {
      for (const id in patcher.boxes) {
        const $ = this.createBox(patcher.boxes[id]);
        $init.push($);
        const numID = parseInt(id.match(/\d+/)[0]);
        if (numID > this.props.boxIndexCount)
          this.props.boxIndexCount = numID;
      }
    }
    await Promise.all($init);
    if (patcher.lines) {
      for (const id in patcher.lines) {
        this.createLine(patcher.lines[id]);
        const numID = parseInt(id.match(/\d+/)[0]);
        if (numID > this.props.lineIndexCount)
          this.props.lineIndexCount = numID;
      }
    }
    this._state.isReady = true;
    this._state.preventEmitChanged = false;
    this.emitGraphChanged();
    this.emit("ready");
    await Promise.all(Object.keys(this.boxes).map((id) => this.boxes[id].postInit()));
    this.emit("postInited");
    return this;
  }
  async getPatcherNode(inputs = 2, outputs = 2) {
    var _a;
    if (this.props.mode === "jsaw" && this.env.thread === "main") {
      const PatcherNode = (await __webpack_require__.e(/*! import() */ "src_core_worklets_PatcherNode_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../worklets/PatcherNode */ "./src/core/worklets/PatcherNode.ts"))).default;
      await PatcherNode.register(this.audioCtx.audioWorklet);
      this.state.patcherNode = new PatcherNode(this.audioCtx, { env: this.env, instanceId: this.id, fileId: (_a = this.file) == null ? void 0 : _a.id, data: this.file ? void 0 : this.toSerializable(), inputs, outputs });
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
      this.error(`Fetch file ${url} failed.`);
    }
    return this;
  }
  async loadFromString(sIn) {
    try {
      const parsed = JSON.parse(sIn);
      return this.load(parsed);
    } catch (e) {
      this.error(`Load from string: ${sIn.slice(20)}... failed.`);
    }
    return this;
  }
  async loadFromFile(file) {
    const splitName = file.name.split(".");
    const ext = splitName.pop();
    const name = splitName.join(".");
    const extMap = { json: "js", jspat: "js", maxpat: "max", gendsp: "gen", dsppat: "faust" };
    if (!extMap[ext])
      return this;
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
      await Promise.all(Object.keys(this.boxes).map((id) => this.boxes[id].destroy()));
      this._state.preventEmitChanged = false;
      this.emitGraphChanged();
    }
    this.lines = {};
    this.boxes = {};
    this.props = {
      mode: "js",
      dependencies: _Patcher.props.dependencies.default.slice(),
      bgColor: _Patcher.props.bgColor.default,
      editingBgColor: _Patcher.props.editingBgColor.default,
      grid: _Patcher.props.grid.default.slice(),
      openInPresentation: _Patcher.props.openInPresentation.default,
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
    const { dependencies } = this.props;
    dependencies.push([namespace, url]);
    this.setProps({ dependencies: dependencies.slice() });
    await this.state.pkgMgr.init();
    if (!(namespace in this.activePkg)) {
      this.setProps({ dependencies: dependencies.filter(([id]) => id !== namespace) });
    }
  }
  async removePackage(id) {
    const { dependencies } = this.props;
    const i = dependencies.findIndex((t) => t[0] === id);
    if (i === -1)
      return;
    dependencies.splice(i, 1);
    this.setProps({ dependencies: dependencies.slice() });
    await this.state.pkgMgr.init();
  }
  async createBox(boxIn) {
    if (!boxIn.id || boxIn.id in this.boxes)
      boxIn.id = "box-" + ++this.props.boxIndexCount;
    const box = new _Box__WEBPACK_IMPORTED_MODULE_3__.default(this, boxIn);
    this.boxes[box.id] = box;
    await box.init();
    this.emitGraphChanged();
    return box;
  }
  getObjectConstructor(parsed) {
    const className = parsed.class;
    if (typeof className !== "string" || className.length === 0)
      return this.activeLib.EmptyObject;
    if (this.activeLib[className])
      return this.activeLib[className];
    this.error(`Object ${className} not found.`);
    return this.activeLib.InvalidObject;
  }
  getObjectMeta(parsed) {
    return this.getObjectConstructor(parsed).meta;
  }
  async changeBoxText(boxId, text) {
    const oldText = this.boxes[boxId].text;
    if (oldText === text)
      return this.boxes[boxId];
    await this.boxes[boxId].changeText(text);
    this.emit("changeBoxText", { oldText, text, boxId });
    return this.boxes[boxId];
  }
  async deleteBox(boxId) {
    const box = this.boxes[boxId];
    if (!box)
      return null;
    await box.destroy();
    this.emitGraphChanged();
    return box;
  }
  createLine(lineIn) {
    if (!this.canCreateLine(lineIn))
      return null;
    if (!lineIn.id || lineIn.id in this.lines)
      lineIn.id = "line-" + ++this.props.lineIndexCount;
    const line = new _Line__WEBPACK_IMPORTED_MODULE_2__.default(this, lineIn);
    this.lines[line.id] = line;
    line.enable();
    this.emitGraphChanged();
    return line;
  }
  canCreateLine(lineIn) {
    if (lineIn.src[1] >= this.boxes[lineIn.src[0]].outlets)
      return false;
    if (lineIn.dest[1] >= this.boxes[lineIn.dest[0]].inlets)
      return false;
    if (this.getLinesByBox(lineIn.src[0], lineIn.dest[0], lineIn.src[1], lineIn.dest[1]).length > 0)
      return false;
    return true;
  }
  deleteLine(lineId) {
    const line = this.lines[lineId];
    if (!line)
      return null;
    line.destroy();
    if (!this._state.preventEmitChanged)
      this.emit("passiveDeleteLine", line);
    this.emitGraphChanged();
    return line;
  }
  changeLineSrc(lineId, srcId, srcOutlet) {
    const line = this.lines[lineId];
    const oldSrc = [line.srcId, line.srcOutlet];
    const src = [srcId, srcOutlet];
    line.setSrc(src);
    this.emitGraphChanged();
    return { lineId, oldSrc, src };
  }
  changeLineDest(lineId, destId, destOutlet) {
    const line = this.lines[lineId];
    const oldDest = [line.destId, line.destInlet];
    const dest = [destId, destOutlet];
    line.setDest(dest);
    this.emitGraphChanged();
    return { lineId, oldDest, dest };
  }
  getLinesBySrcID(srcId) {
    const result = [];
    for (let i = 0; i < this.boxes[srcId].outlets; i++) {
      result[i] = [];
    }
    for (const id in this.lines) {
      const line = this.lines[id];
      if (line && line.srcId === srcId) {
        const srcOutlet = line.srcOutlet;
        if (!result[srcOutlet])
          result[srcOutlet] = [id];
        else
          result[srcOutlet].push(id);
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
        if (!result[destInlet])
          result[destInlet] = [id];
        else
          result[destInlet].push(id);
      }
    }
    return result;
  }
  getLinesByBox(srcId, destId, srcOutlet, destInlet) {
    const result = [];
    let srcOuts = [];
    let destIns = [];
    const srcOutsWraped = this.getLinesBySrcID(srcId);
    if (srcOutlet !== void 0)
      srcOuts = srcOutsWraped[srcOutlet];
    else
      srcOutsWraped.forEach((el) => srcOuts = srcOuts.concat(el));
    const destInsWraped = this.getLinesByDestID(destId);
    if (destInlet !== void 0)
      destIns = destInsWraped[destInlet];
    else
      destInsWraped.forEach((el) => destIns = destIns.concat(el));
    if (!srcOuts || !destIns)
      return result;
    srcOuts.forEach((idOut) => destIns.forEach((idIn) => idIn === idOut ? result.push(idIn) : void 0));
    return result;
  }
  fn(data, inlet) {
    this.emit("dataInput", { data, inlet });
  }
  inputAudio(input, buffer) {
    this.emitSync("audioInput", { input, buffer });
  }
  inputParam(param, buffer) {
    this.emitSync("paramInput", { param, buffer });
  }
  outputAudio(output, buffer) {
    this.emitSync("audioOutput", { output, buffer });
  }
  outlet(outlet, data) {
    this.emit("dataOutput", { data, outlet });
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
      if (box.meta.isPatcherInlet === "audio")
        inputBoxes[port] = box;
      else if (box.meta.isPatcherInlet === "parameter")
        parametersBoxes.push([arg0, box]);
      else if (box.meta.isPatcherOutlet === "audio")
        outputBoxes[port] = box;
    }
    for (let i = 0; i < this._inletAudioConnections.length; i++) {
      if (!inputBoxes[i])
        delete this._inletAudioConnections[i];
    }
    for (let i = 0; i < this._outletAudioConnections.length; i++) {
      if (!outputBoxes[i])
        delete this._outletAudioConnections[i];
    }
    return { inputBoxes, outputBoxes, parametersBoxes };
  }
  get meta() {
    const { metaFromPatcher } = this;
    return __spreadValues({
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
    return { inlets, outlets, args: [], props: {} };
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
      if (this.props[key] === props[key])
        continue;
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
    const { dependencies, bgColor, editingBgColor, grid, openInPresentation } = this.props;
    return { dependencies, bgColor, editingBgColor, grid, openInPresentation };
  }
  toFaustDspCode() {
    const code = (0,_FaustPatcherAnalyser__WEBPACK_IMPORTED_MODULE_7__.toFaustDspCode)(this);
    return code;
  }
  toString(spacing) {
    if (this.props.mode === "max" || this.props.mode === "gen") {
      return JSON.stringify((0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.js2max)(this), void 0, spacing);
    }
    const { props } = this;
    const boxes = {};
    const lines = {};
    for (const id in this.boxes) {
      boxes[id] = this.boxes[id].toSerializable();
    }
    for (const id in this.lines) {
      lines[id] = this.lines[id].toSerializable();
    }
    return JSON.stringify({ boxes, lines, props }, void 0, spacing);
  }
  toSerializable() {
    return JSON.parse(this.toString());
  }
  serialize() {
    return new Blob([this.toString()]).arrayBuffer();
  }
};
let Patcher = _Patcher;
Patcher.props = {
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
};



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




class PatcherEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor(instance) {
    super(instance);
    this.state = {
      locked: true,
      presentation: false,
      showGrid: true,
      snapToGrid: true,
      selected: []
    };
    this.handleChangeBoxText = (e) => this.emit("changeBoxText", e);
    this.handlePassiveDeleteLine = (e) => this.emit("delete", { boxes: {}, lines: { [e.id]: e.toSerializable() } });
    this.handleBoxChanged = (e) => this.emit("boxChanged", e);
    this.handleChanged = () => this.instance.emitChanged();
    const { openInPresentation } = this.props;
    this.setState({
      locked: true,
      presentation: !!openInPresentation,
      showGrid: true,
      snapToGrid: true,
      selected: []
    });
  }
  static async fromProjectItem({ file, env, project, instanceId }) {
    const patcher = await file.instantiate({ env, project, instanceId });
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
    const { openInPresentation } = this.props;
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
      if (this.state[key] === state[key])
        continue;
      changed = true;
      if (key === "locked" || key === "presentation")
        this.deselectAll();
      this.state[key] = state[key];
      this.emit(key, state[key]);
    }
    return changed;
  }
  async createBox(boxIn) {
    const box = await this.instance.createBox(boxIn);
    this.emit("create", { boxes: { [box.id]: box.toSerializable() }, lines: {} });
    await box.postInit();
    return box;
  }
  async createBoxFromFile(file, boxIn) {
    const path = file.projectPath;
    const type = file.type;
    const ext = file.fileExtension;
    if (type === "patcher") {
      const extMap = this.props.mode === "js" ? { json: "p", jspat: "p", maxpat: "max", gendsp: "gen", dsppat: "pfaust" } : this.props.mode === "faust" ? { gendsp: "gen", dsppat: "p" } : this.props.mode === "gen" ? { gendsp: "gen" } : {};
      const obj = extMap[ext];
      if (obj)
        await this.createBox(__spreadValues({ text: `${obj} ${path}` }, boxIn));
    } else if (type === "audio") {
      await this.createBox(__spreadValues({ text: `buffer~ ${path}` }, boxIn));
    } else if (type === "image") {
      await this.createBox(__spreadValues({ text: `img ${path}` }, boxIn));
    }
  }
  async deleteBox(boxId) {
    this.deselect(boxId);
    const box = await this.instance.deleteBox(boxId);
    if (!box)
      return null;
    this.emit("delete", { boxes: { [box.id]: box.toSerializable() }, lines: {} });
    return box;
  }
  createLine(lineIn) {
    const line = this.instance.createLine(lineIn);
    if (!line)
      return null;
    this.emit("create", { boxes: {}, lines: { [line.id]: line.toSerializable() } });
    return line;
  }
  deleteLine(lineId) {
    this.deselect(lineId);
    const line = this.instance.deleteLine(lineId);
    if (!line)
      return null;
    this.emit("delete", { boxes: {}, lines: { [line.id]: line.toSerializable() } });
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
    var _a;
    await ((_a = this.instance.boxes[boxId]) == null ? void 0 : _a.changeObject(change));
  }
  select(...ids) {
    ids.forEach((id) => {
      if (this.state.selected.indexOf(id) >= 0)
        return;
      if (this.boxes[id] || this.lines[id])
        this.state.selected.push(id);
    });
    this.emit("selected", this.state.selected.slice());
  }
  selectAllBoxes() {
    let ids = Object.keys(this.boxes);
    if (this.state.presentation)
      ids = ids.filter((id) => this.boxes[id].presentation);
    this.state.selected = ids;
    this.emit("selected", ids);
  }
  selectOnly(...ids) {
    this.state.selected = [];
    this.select(...ids);
  }
  deselect(...ids) {
    ids.forEach((id) => {
      const i = this.state.selected.indexOf(id);
      if (i === -1)
        return;
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
    const patcher = { lines: {}, boxes: {} };
    this.state.selected.filter((id) => id.startsWith("box") && this.boxes[id]).map((id) => this.boxes[id]).forEach((box) => {
      box.allLines.forEach((line) => lineSet.add(line));
      patcher.boxes[box.id] = box.toSerializable();
    });
    lineSet.forEach((line) => {
      if (patcher.boxes[line.srcId] && patcher.boxes[line.destId])
        patcher.lines[line.id] = line.toSerializable();
    });
    if (!Object.keys(patcher.boxes))
      return void 0;
    return JSON.stringify(patcher, void 0, 4);
  }
  async pasteToPatcher(clipboard) {
    const idMap = {};
    const pasted = { boxes: {}, lines: {} };
    if (!clipboard || !clipboard.boxes)
      return pasted;
    const $init = [];
    const $postInit = [];
    if (Array.isArray(clipboard.boxes)) {
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
          if (numID > this.props.boxIndexCount)
            this.props.boxIndexCount = numID;
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
      const createdBoxes2 = (await Promise.all($init)).filter((box) => !!box);
      createdBoxes2.forEach((box) => {
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
          if (createdLine)
            pasted.lines[createdLine.id] = createdLine.toSerializable();
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
    if (Array.isArray(clipboard.boxes) || Array.isArray(clipboard.lines))
      return pasted;
    this.instance.state.preventEmitChanged = true;
    for (const boxId in clipboard.boxes) {
      const box = clipboard.boxes[boxId];
      if (this.boxes[box.id]) {
        idMap[box.id] = "box-" + ++this.props.boxIndexCount;
        box.id = idMap[box.id];
      } else {
        idMap[box.id] = box.id;
        const numID = parseInt(box.id.match(/\d+/)[0]);
        if (numID > this.props.boxIndexCount)
          this.props.boxIndexCount = numID;
      }
      box.rect = [box.rect[0] + 30, box.rect[1] + 30, box.rect[2], box.rect[3]];
      $init.push(this.instance.createBox(box));
    }
    const createdBoxes = (await Promise.all($init)).filter((box) => !!box);
    createdBoxes.forEach((box) => {
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
      if (createdLine)
        pasted.lines[createdLine.id] = createdLine.toSerializable();
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
    const created = { boxes: {}, lines: {} };
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
      if (!this.instance.canCreateLine(lineIn))
        continue;
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
    this.state.selected.filter((id) => id.startsWith("line")).forEach((id) => lineSet.add(this.lines[id]));
    this.state.selected.filter((id) => id.startsWith("box")).forEach((id) => {
      boxSet.add(this.boxes[id]);
      this.boxes[id].allLines.forEach((line) => lineSet.add(line));
    });
    if (!boxSet.size && !lineSet.size)
      return void 0;
    this.state.selected = [];
    const deleted = { boxes: {}, lines: {} };
    const promises = [];
    lineSet.forEach((line) => {
      deleted.lines[line.id] = line.toSerializable();
      line.destroy();
    });
    boxSet.forEach((box) => {
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
    const deleted = { boxes: {}, lines: {} };
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
    if (this.state.locked)
      return;
    await this.copy();
    this.deleteSelected();
  }
  async copy() {
    if (this.state.locked)
      return;
    const s = this.selectedToString();
    if (!s)
      return;
    await navigator.clipboard.writeText(s);
  }
  async paste() {
    if (this.state.locked)
      return;
    const s = await navigator.clipboard.readText();
    if (!s)
      return;
    let parsed;
    try {
      parsed = JSON.parse(s);
    } catch (e) {
    }
    await this.pasteToPatcher(parsed);
  }
  async duplicate() {
    if (this.state.locked)
      return;
    const s = this.selectedToString();
    if (!s)
      return;
    let parsed;
    try {
      parsed = JSON.parse(s);
    } catch (e) {
    }
    await this.pasteToPatcher(parsed);
  }
  async selectAll() {
    this.selectAllBoxes();
  }
  selectRegion(selectionRect, selectedBefore) {
    let [left, top, right, bottom] = selectionRect;
    if (left > right)
      [left, right] = [right, left];
    if (top > bottom)
      [top, bottom] = [bottom, top];
    const { presentation } = this.state;
    const rectKey = presentation ? "presentationRect" : "rect";
    const select = selectedBefore.slice();
    for (const boxId in this.boxes) {
      const box = this.boxes[boxId];
      if (presentation && !box.presentation)
        continue;
      const rect = box[rectKey];
      if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isTRect)(rect))
        continue;
      const [boxLeft, boxTop, boxWidth, boxHeight] = rect;
      const [boxRight, boxBottom] = [boxLeft + boxWidth, boxTop + boxHeight];
      if (boxLeft < right && boxTop < bottom && boxRight > left && boxBottom > top) {
        const i = select.indexOf(boxId);
        if (i === -1)
          select.push(boxId);
        else
          select.splice(i, 1);
      }
    }
    const deselect = this.state.selected.filter((id) => select.indexOf(id) === -1);
    this.select(...select);
    this.deselect(...deselect);
  }
  moveSelectedBox(dragOffset, refBoxID) {
    const { presentation, snapToGrid, selected } = this.state;
    const rectKey = presentation ? "presentationRect" : "rect";
    const delta = __spreadValues({}, dragOffset);
    if (refBoxID) {
      const rect = this.boxes[refBoxID][rectKey];
      if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectMovable)(rect))
        return { x: 0, y: 0 };
      delta.x = snapToGrid ? Math.round((rect[0] + dragOffset.x) / this.props.grid[0]) * this.props.grid[0] - rect[0] : dragOffset.x;
      delta.y = snapToGrid ? Math.round((rect[1] + dragOffset.y) / this.props.grid[1]) * this.props.grid[1] - rect[1] : dragOffset.y;
    }
    if (!delta.x && !delta.y)
      return dragOffset;
    this.move(selected, delta, presentation);
    return { x: dragOffset.x - delta.x, y: dragOffset.y - delta.y };
  }
  moveEnd(delta) {
    const { presentation, selected } = this.state;
    const rectKey = presentation ? "presentationRect" : "rect";
    let ids = selected.filter((id) => id.startsWith("box") && this.boxes[id]);
    if (presentation)
      ids = ids.filter((id) => (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectMovable)(this.boxes[id][rectKey]));
    const boxes = ids.map((id) => this.boxes[id]);
    boxes.forEach((box) => box.emit(presentation ? "presentationRectChanged" : "rectChanged", box));
    this.emit("moved", { delta, selected: ids, presentation: this.state.presentation });
  }
  move(selected, delta, presentation) {
    this.select(...selected);
    const rectKey = presentation ? "presentationRect" : "rect";
    let ids = selected.filter((id) => id.startsWith("box") && this.boxes[id]);
    if (presentation)
      ids = ids.filter((id) => (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectMovable)(this.boxes[id][rectKey]));
    const boxes = ids.map((id) => this.boxes[id]);
    if (boxes.length === 0)
      return;
    let [left, top] = boxes[0][rectKey];
    for (let i = 1; i < boxes.length; i++) {
      const box = boxes[i];
      const [$left, $top] = box[rectKey];
      if ($left < left)
        left = $left;
      if ($top < top)
        top = $top;
    }
    delta.x = Math.max(delta.x, -left);
    delta.y = Math.max(delta.y, -top);
    if (delta.x)
      boxes.forEach((box) => box[rectKey][0] += delta.x);
    if (delta.y)
      boxes.forEach((box) => box[rectKey][1] += delta.y);
    if (!delta.x && !delta.y)
      return;
    if (presentation !== this.state.presentation)
      return;
    this.emit("moving", { selected: ids, delta, presentation });
    if (presentation)
      return;
    const lineSet = new Set();
    boxes.forEach((box) => {
      box.inletLines.forEach((set) => set.forEach((line) => lineSet.add(line)));
      box.outletLines.forEach((set) => set.forEach((line) => lineSet.add(line)));
    });
    lineSet.forEach((line) => line.emit("posChanged", line));
  }
  resizeSelectedBox(boxId, dragOffset, type) {
    const { presentation, snapToGrid, selected } = this.state;
    const rectKey = presentation ? "presentationRect" : "rect";
    const rect = this.boxes[boxId][rectKey];
    if (!(0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectResizable)(rect))
      return { x: 0, y: 0 };
    const delta = { x: 0, y: 0 };
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
    if (!delta.x && !delta.y)
      return dragOffset;
    this.resize(selected, delta, type, presentation);
    return { x: dragOffset.x - delta.x, y: dragOffset.y - delta.y };
  }
  resizeEnd(delta, type) {
    const { selected, presentation } = this.state;
    this.emit("resized", { delta, type, selected, presentation });
  }
  resize(selected, delta, type, presentation) {
    this.select(...selected);
    const rectKey = presentation ? "presentationRect" : "rect";
    let ids = selected.filter((id) => id.startsWith("box") && this.boxes[id]);
    if (presentation)
      ids = ids.filter((id) => (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.isRectResizable)(this.boxes[id][rectKey]));
    const boxes = ids.map((id) => this.boxes[id]);
    if (boxes.length === 0)
      return;
    let [left, top, width, height] = boxes[0][rectKey];
    for (let i = 1; i < boxes.length; i++) {
      const box = boxes[i];
      const [$left, $top, $width, $height] = box[rectKey];
      if ($left < left)
        left = $left;
      if ($top < top)
        top = $top;
      if ($width < width)
        width = $width;
      if ($height < height)
        height = $height;
    }
    if (type === "sw" || type === "w" || type === "nw")
      delta.x = Math.max(delta.x, -left);
    if (type === "nw" || type === "n" || type === "ne")
      delta.y = Math.max(delta.y, -top);
    if (type === "ne" || type === "e" || type === "se")
      delta.x = Math.max(delta.x, 15 - width);
    if (type === "sw" || type === "w" || type === "nw")
      delta.x = Math.min(delta.x, width - 15);
    if (type === "se" || type === "s" || type === "sw")
      delta.y = Math.max(delta.y, 15 - height);
    if (type === "nw" || type === "n" || type === "ne")
      delta.y = Math.min(delta.y, height - 15);
    boxes.forEach((box) => {
      var _a, _b, _c, _d;
      const sizingX = box.UI ? ((_a = box.UI) == null ? void 0 : _a.sizing) === "horizontal" || ((_b = box.UI) == null ? void 0 : _b.sizing) === "both" : true;
      const sizingY = box.UI ? ((_c = box.UI) == null ? void 0 : _c.sizing) === "vertical" || ((_d = box.UI) == null ? void 0 : _d.sizing) === "both" : true;
      if (delta.x && sizingX) {
        if (type === "ne" || type === "e" || type === "se")
          box[rectKey][2] += delta.x;
        if (type === "sw" || type === "w" || type === "nw") {
          box[rectKey][2] -= delta.x;
          box[rectKey][0] += delta.x;
        }
      }
      if (delta.y && sizingY) {
        if (type === "se" || type === "s" || type === "sw")
          box[rectKey][3] += delta.y;
        if (type === "nw" || type === "n" || type === "ne") {
          box[rectKey][3] -= delta.y;
          box[rectKey][1] += delta.y;
        }
      }
    });
    if (!delta.x && !delta.y)
      return;
    if (presentation !== this.state.presentation)
      return;
    boxes.forEach((box) => box.emit(presentation ? "presentationRectChanged" : "rectChanged", box));
    if (presentation)
      return;
    const lineSet = new Set();
    boxes.forEach((box) => {
      box.inletLines.forEach((set) => set.forEach((line) => lineSet.add(line)));
      box.outletLines.forEach((set) => set.forEach((line) => lineSet.add(line)));
    });
    lineSet.forEach((line) => line.emit("posChanged", line));
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
          const canCreate = this.instance.canCreateLine({ src: findSrc ? [id, i] : from, dest: findSrc ? from : [id, i] });
          if (!canCreate)
            return;
          nearest = [id, i];
          minDistance = distance;
        }
      });
    }
    return nearest;
  }
  highlightNearestPort(findSrc, dragOffset, from, to) {
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
    this.emit("tempLine", { findSrc, from });
    return this;
  }
  inspector(box) {
    if (box)
      this.emit("inspector");
    else if (this.state.selected.length) {
      const found = this.state.selected.find((id) => id.startsWith("box"));
      if (found && this.boxes[found])
        this.emit("inspector");
    }
  }
  dockUI(box) {
    if (box && box.UI.dockable)
      this.emit("dockUI", box.id);
    else if (this.state.selected.length) {
      const found = this.state.selected.find((id) => id.startsWith("box"));
      if (found && this.boxes[found] && this.boxes[found].UI.dockable)
        this.emit("dockUI", found);
    }
  }
  onUiResized() {
  }
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
    return [
      "create",
      "delete",
      "changeBoxText",
      "boxChanged",
      "changeLineSrc",
      "changeLineDest",
      "moved",
      "resized"
    ];
  }
  async undoOf(editor, eventName, eventData) {
    if (eventName === "delete") {
      const e = eventData;
      await editor.create(e);
    } else if (eventName === "changeBoxText") {
      const e = eventData;
      const { boxId, oldText } = e;
      await editor.instance.changeBoxText(boxId, oldText);
    } else if (eventName === "boxChanged") {
      const e = eventData;
      const { boxId, oldArgs, oldProps, oldState } = e;
      await editor.changeBox(boxId, { args: oldArgs, props: oldProps, state: oldState });
    } else if (eventName === "moved") {
      const e = eventData;
      const { selected, delta, presentation } = e;
      const d = { x: -1 * delta.x, y: -1 * delta.y };
      editor.move(selected, d, presentation);
      editor.moveEnd(d);
    } else if (eventName === "changeLineSrc") {
      const e = eventData;
      const { lineId, oldSrc } = e;
      editor.changeLineSrc(lineId, oldSrc[0], oldSrc[1]);
    } else if (eventName === "changeLineDest") {
      const e = eventData;
      const { lineId, oldDest } = e;
      editor.changeLineDest(lineId, oldDest[0], oldDest[1]);
    } else if (eventName === "create") {
      const e = eventData;
      await editor.delete(e);
    } else if (eventName === "resized") {
      const e = eventData;
      const { selected, delta, type: t, presentation } = e;
      const d = { x: -1 * delta.x, y: -1 * delta.y };
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
      const { boxId, text } = e;
      await editor.instance.changeBoxText(boxId, text);
    } else if (eventName === "boxChanged") {
      const e = eventData;
      const { boxId, args, props, state } = e;
      await editor.changeBox(boxId, { args, props, state });
    } else if (eventName === "moved") {
      const e = eventData;
      const { selected, delta, presentation } = e;
      editor.move(selected, delta, presentation);
      editor.moveEnd(delta);
    } else if (eventName === "changeLineSrc") {
      const e = eventData;
      const { lineId, src } = e;
      editor.changeLineSrc(lineId, src[0], src[1]);
    } else if (eventName === "changeLineDest") {
      const e = eventData;
      const { lineId, dest } = e;
      editor.changeLineDest(lineId, dest[0], dest[1]);
    } else if (eventName === "delete") {
      const e = eventData;
      await editor.delete(e);
    } else if (eventName === "resized") {
      const e = eventData;
      const { selected, delta, type: t, presentation } = e;
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
  async instantiate({ env, project, instanceId }) {
    const Patcher = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./Patcher */ "./src/core/patcher/Patcher.ts"))).default;
    const patcher = new Patcher({ file: this, env, project, instanceId });
    await patcher.load(this.data);
    return patcher;
  }
  async instantiateEditor({ env, project, instanceId }) {
    const PatcherEditor = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./PatcherEditor */ "./src/core/patcher/PatcherEditor.ts"))).default;
    return PatcherEditor.fromProjectItem({ file: this, env, project, instanceId });
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
  async instantiateEditor({ env, project, instanceId }) {
    const TextEditor = (await __webpack_require__.e(/*! import() */ "src_core_text_TextEditor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./TextEditor */ "./src/core/text/TextEditor.ts"))).default;
    return TextEditor.fromProjectItem({ file: this, env, project, instanceId });
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
var _a;
const { AudioWorkletProcessor } = globalThis;
const Processor = (_a = class extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this._disposed = false;
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;
    const handleDisposed = () => {
      this.port.removeEventListener("message", handleMessage);
      this.port.close();
    };
    const handleMessage = async (e) => {
      const { id, call: call2, args, value, error } = e.data;
      if (call2) {
        const r = { id };
        try {
          r.value = await this[call2](...args);
        } catch (e2) {
          r.error = e2;
        }
        this.port.postMessage(r);
        if (this._disposed)
          handleDisposed();
      } else {
        if (error) {
          if (rejects[id])
            rejects[id](error);
          delete rejects[id];
          return;
        }
        if (resolves[id]) {
          resolves[id](value);
          delete resolves[id];
        }
      }
    };
    const call = (call2, ...args) => new Promise((resolve, reject) => {
      const id = messagePortRequestId--;
      resolves[id] = resolve;
      rejects[id] = reject;
      this.port.postMessage({ id, call: call2, args });
    });
    const Ctor = this.constructor;
    Ctor.fnNames.forEach((name) => this[name] = (...args) => call(name, ...args));
    this.port.start();
    this.port.addEventListener("message", handleMessage);
  }
}, _a.fnNames = [], _a);
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
const $AnyEventType = Symbol("__TypedEventListener_AnyEventType");
class TypedEventEmitter {
  constructor() {
    this._listeners = { [$AnyEventType]: [] };
  }
  get listeners() {
    return this._listeners;
  }
  getListeners(eventName) {
    if (!(eventName in this._listeners))
      this._listeners[eventName] = [];
    return this._listeners[eventName];
  }
  on(eventName, listener) {
    if (this.getListeners(eventName).indexOf(listener) === -1)
      this.getListeners(eventName).push(listener);
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
    if (i !== -1)
      this.getListeners(eventName).splice(i, 1);
  }
  offAny(listener) {
    const i = this._listeners[$AnyEventType].indexOf(listener);
    if (i !== -1)
      this._listeners[$AnyEventType].splice(i, 1);
  }
  async emit(eventName, eventData, options) {
    var _a;
    let listeners = this.getListeners(eventName);
    let anyListeners = (options == null ? void 0 : options.excludeAny) ? [] : this._listeners[$AnyEventType];
    if (!listeners.length && !anyListeners.length)
      return [];
    if ((_a = options == null ? void 0 : options.exclude) == null ? void 0 : _a.length) {
      const { exclude } = options;
      listeners = listeners.filter((l) => exclude.indexOf(l) === -1);
      anyListeners = anyListeners.filter((l) => exclude.indexOf(l) === -1);
    }
    return Promise.all([...listeners.map((f) => f(eventData, this)), ...anyListeners.map((f) => f(eventName, eventData, this))]);
  }
  async emitSerial(eventName, eventData, options) {
    var _a;
    let listeners = this.getListeners(eventName);
    let anyListeners = (options == null ? void 0 : options.excludeAny) ? [] : this._listeners[$AnyEventType];
    if (!listeners.length && !anyListeners.length)
      return [];
    if ((_a = options == null ? void 0 : options.exclude) == null ? void 0 : _a.length) {
      const { exclude } = options;
      listeners = listeners.filter((l) => exclude.indexOf(l) === -1);
      anyListeners = anyListeners.filter((l) => exclude.indexOf(l) === -1);
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
    var _a;
    let listeners = this.getListeners(eventName);
    let anyListeners = (options == null ? void 0 : options.excludeAny) ? [] : this._listeners[$AnyEventType];
    if (!listeners.length && !anyListeners.length)
      return [];
    if ((_a = options == null ? void 0 : options.exclude) == null ? void 0 : _a.length) {
      const { exclude } = options;
      listeners = listeners.filter((l) => exclude.indexOf(l) === -1);
      anyListeners = anyListeners.filter((l) => exclude.indexOf(l) === -1);
    }
    return [...listeners.map((f) => f(eventData, this)), ...anyListeners.map((f) => f(eventName, eventData, this))];
  }
  offAll(eventName) {
    if (eventName) {
      this._listeners[eventName] = [];
    } else {
      this._listeners = { [$AnyEventType]: [] };
    }
  }
  listenerCount(eventName) {
    const anyListenerCount = this._listeners[$AnyEventType].length;
    if (!(eventName in this._listeners))
      return anyListenerCount;
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

const sum = (array, from = 0, length = array.length) => {
  let sum2 = 0;
  const l = array.length;
  for (let i = 0; i < length; i++) {
    sum2 += array[(from + i) % l];
  }
  return sum2;
};
const mean = (array, from = 0, length = array.length) => sum(array, from, length) / length;
const median = (array, from = 0, length = array.length) => {
  if (length === 0)
    throw new Error("trying to calculate median of empty array");
  const sortedArray = (from + length > array.length ? Array.isArray(array) ? array.slice(from).concat(array.slice(0, from + length - array.length)) : sliceBuffer(array, length, from) : array.slice(from, from + length)).sort();
  if (length % 2 === 0)
    return (sortedArray[length / 2 - 1] + sortedArray[length / 2]) / 2;
  return sortedArray[~~(length / 2)];
};
const maxIndex = (array, from = 0, length = array.length) => {
  const l = array.length;
  if (!l)
    return 0;
  let index = 0;
  let max = array[0];
  let i = length;
  while (i-- > 1) {
    const cur = array[(from + i) % l];
    if (cur <= max)
      continue;
    max = cur;
    index = i;
  }
  return index;
};
const energy = (signal, from = 0, length = signal.length) => {
  let sum2 = 0;
  let sample = 0;
  const l = signal.length;
  for (let i = 0; i < length; i++) {
    sample = signal[(from + i) % l];
    sum2 += sample * sample;
  }
  return sum2;
};
const rms = (signal, from = 0, length = signal.length) => Math.sqrt(energy(signal, from, length) / signal.length);
const absMax = (signal, from = 0, length = signal.length) => {
  let max = 0;
  let sample = 0;
  const l = signal.length;
  for (let i = 0; i < length; i++) {
    sample = Math.abs(signal[(from + i) % l]);
    if (sample > max)
      max = sample;
  }
  return max;
};
const zcr = (signal, from = 0, length = signal.length) => {
  let zcr2 = 0;
  let lastPositive = true;
  let positive = true;
  const l = signal.length;
  for (let i = 0; i < length; i++) {
    positive = signal[(from + i) % l] >= 0;
    if (positive !== lastPositive)
      zcr2++;
    lastPositive = positive;
  }
  return zcr2;
};
const centroid = (array, from = 0, length = array.length) => {
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
const conjugatedCentroid = (array, factor, from = 0, length = array.length) => {
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
const geometricMean = (array, from = 0, length = array.length) => {
  let sum2 = 0;
  let sample = 0;
  const l = array.length;
  for (let i = 0; i < length; i++) {
    sample = array[(from + i) % l];
    if (sample <= 0)
      return 0;
    sum2 += Math.log(sample);
  }
  return Math.exp(sum2 / length);
};
const flatness = (array, from = 0, length = array.length) => geometricMean(array, from, length) / mean(array, from, length);
const flux = (cur, prev, norm, halfRectify) => {
  let flux2 = 0;
  if (norm === "L2") {
    if (halfRectify === true) {
      for (let i = 0; i < cur.length; i++) {
        const diff = cur[i] - prev[i];
        if (diff < 0)
          continue;
        flux2 += diff * diff;
      }
      return Math.sqrt(flux2);
    }
    for (let i = 0; i < cur.length; i++) {
      const diff = cur[i] - prev[i];
      flux2 += diff * diff;
    }
    return Math.sqrt(flux2);
  }
  if (halfRectify === true) {
    for (let i = 0; i < cur.length; i++) {
      const diff = cur[i] - prev[i];
      if (diff < 0)
        continue;
      flux2 += diff;
    }
    return flux2;
  }
  for (let i = 0; i < cur.length; i++) {
    const diff = cur[i] - prev[i];
    flux2 += Math.abs(diff);
  }
  return flux2;
};
const kurtosis = (array, from = 0, length = array.length) => {
  const c1 = centroid(array, from, length);
  const c2 = conjugatedCentroid(array, 2, from, length);
  const c3 = conjugatedCentroid(array, 3, from, length);
  const c4 = conjugatedCentroid(array, 4, from, length);
  const numerator = -3 * c1 ** 4 + 6 * c1 * c2 - 4 * c1 * c3 + c4;
  const denominator = (c2 - c1 ** 2) ** 2;
  return numerator / denominator;
};
const skewness = (array, from = 0, length = array.length) => {
  const c1 = centroid(array, from, length);
  const c2 = conjugatedCentroid(array, 2, from, length);
  const c3 = conjugatedCentroid(array, 3, from, length);
  const numerator = 2 * c1 ** 3 - 3 * c1 * c2 + c3;
  const denominator = (c2 - c1 ** 2) ** 1.5;
  return numerator / denominator;
};
const rolloff = (array, from = 0, length = array.length, cutoff) => {
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
const slope = (array, from = 0, n = array.length) => {
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
const spread = (array, from = 0, length = array.length) => Math.sqrt(conjugatedCentroid(array, 2, from, length)) - centroid(array, from, length) ** 2;
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
    if ($from === 0 && $fromEnd === fromLength)
      to.set(from, $to);
    else
      to.set(from.subarray($from, $fromEnd), $to);
    $to = ($to + $spillLength) % toLength;
    $from = $fromEnd % fromLength;
    spilled += $spillLength;
  }
  return $to;
};
const getSubTypedArray = (from, length, offset = 0) => {
  const fromLength = from.length;
  const $ = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength)
    return from;
  if ($ + length < fromLength)
    return from.subarray($, $ + length);
  const to = new from.constructor(length);
  setTypedArray(to, from, 0, $);
  return to;
};
const sliceBuffer = (from, length, offset) => {
  const fromLength = from.length;
  const $ = (0,_math__WEBPACK_IMPORTED_MODULE_0__.mod)(offset, fromLength) || 0;
  if ($ === 0 && length === fromLength)
    return from.slice();
  if ($ + length < fromLength)
    return from.slice($, $ + length);
  const to = new from.constructor(length);
  setTypedArray(to, from, 0, $);
  return to;
};
const fftw2Amp = (from, windowEnergyFactor) => {
  const { length } = from;
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

const mod = (x, y) => (x % y + y) % y;
const round = (x, to) => Math.abs(to) < 1 ? Math.round(x * (1 / to)) / (1 / to) : Math.round(x / to) * to;
const floor = (x, to) => Math.abs(to) < 1 ? Math.floor(x * (1 / to)) / (1 / to) : Math.floor(x / to) * to;
const ceil = (x, to) => Math.abs(to) < 1 ? Math.ceil(x * (1 / to)) / (1 / to) : Math.ceil(x / to) * to;
const toRad = (degrees) => degrees * Math.PI / 180;
const toMIDI = (f) => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][(f % 12 + 12) % 12] + Math.round(f / 12 - 2);
const atodb = (a) => 20 * Math.log10(a);
const dbtoa = (db) => 10 ** (db / 20);
const iNormExp = (x, e) => Math.max(0, x) ** 1.5 ** -e;
const normExp = (x, e) => Math.max(0, x) ** 1.5 ** e;
const scale = (x, l1, h1, l2, h2) => {
  const r1 = h1 - l1;
  const r2 = h2 - l2;
  return (x - l1) / r1 * r2 + l2;
};
const scaleClip = (x, l1, h1, l2, h2) => Math.max(l2, Math.min(h2, scale(x, l1, h1, l2, h2)));
const isIdentityMatrix = (x) => {
  return Array.isArray(x) && x.every((row, i) => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isNumberArray)(row) && row.length === x.length && row.every((e, j) => e === (j === i ? 1 : 0)));
};
const identityMatrix = (dim) => new Array(dim).fill(void 0).map((x, i) => new Array(dim).fill(void 0).map((y, j) => +(i === j)));


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
/* harmony export */   "str2ab": () => (/* binding */ str2ab),
/* harmony export */   "getFactors": () => (/* binding */ getFactors),
/* harmony export */   "getRuler": () => (/* binding */ getRuler)
/* harmony export */ });
const isStringArray = (x) => Array.isArray(x) && x.every((e) => typeof e === "string");
const isNumberArray = (x) => Array.isArray(x) && x.every((e) => typeof e === "number");
const isTRect = (x) => {
  return isNumberArray(x) && x.length === 4 && x[0] >= 0 && x[1] >= 0 && x[2] >= 15 && x[3] >= 15;
};
const isTPresentationRect = (x) => {
  return Array.isArray(x) && x.length === 4 && x.every((v) => typeof v === "number" || typeof v === "string");
};
const isRectMovable = (x) => {
  return isTPresentationRect(x) && typeof x[0] === "number" && typeof x[1] === "number";
};
const isRectResizable = (x) => isTRect(x);
const isMIDIEvent = (x) => (isNumberArray(x) || x instanceof Uint8Array) && x.length === 3;
const stringifyError = (data) => {
  if (typeof data === "string")
    return data;
  if (data instanceof Error)
    return data.message;
  if (typeof data === "object")
    return JSON.stringify(data);
  return `${data}`;
};
const parseToPrimitive = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value.toString();
  }
};
const rgbaMax2Css = (maxColor) => {
  const cssColor = [255, 255, 255, 1];
  if (Array.isArray(maxColor)) {
    for (let i = 0; i < 3; i++) {
      if (typeof maxColor[i] === "number")
        cssColor[i] = Math.floor(maxColor[i] * 255);
    }
    if (typeof maxColor[3] === "number")
      cssColor[3] = maxColor[3];
  }
  return `rgba(${cssColor.join(",")})`;
};
const css2RgbaMax = (color) => {
  const maxColor = [0.2, 0.2, 0.2, 1];
  const matched = color.match(/rgba\((.+)\)/);
  if (!matched)
    return maxColor;
  const cssColor = matched[1].split(",").map((s) => +s);
  for (let i = 0; i < 3; i++) {
    if (typeof cssColor[i] === "number")
      maxColor[i] = cssColor[i] / 255;
    if (typeof cssColor[3] === "number")
      maxColor[3] = cssColor[3];
  }
  return maxColor;
};
const decodeBPF = (sIn, tupleLength) => {
  if (typeof sIn === "number")
    return [[sIn]];
  if (isNumberArray(sIn))
    return [sIn];
  if (Array.isArray(sIn) && sIn.every((a) => isNumberArray(a)))
    return sIn;
  if (typeof sIn !== "string")
    throw new Error("Failed to decode curve.");
  const numbers = sIn.split(" ").filter((s) => !!s).map((s) => +s);
  if (numbers.find((v) => !isFinite(v)))
    throw new Error("BPF contains invalid number.");
  const tuples = [];
  for (let i = 0; i < numbers.length; i++) {
    const $tuple = ~~(i / tupleLength);
    const $ = i % tupleLength;
    if (!tuples[$tuple])
      tuples[$tuple] = [];
    tuples[$tuple][$] = numbers[i];
  }
  return tuples;
};
const decodeCurve = (sIn) => decodeBPF(sIn, 3);
const decodeLine = (sIn) => decodeBPF(sIn, 2);
const detectOS = () => {
  const { appVersion } = navigator;
  if (appVersion.indexOf("Win") !== -1)
    return "Windows";
  if (appVersion.indexOf("Mac") !== -1)
    return "MacOS";
  if (appVersion.indexOf("X11") !== -1)
    return "UNIX";
  if (appVersion.indexOf("Linux") !== -1)
    return "Linux";
  return "Unknown";
};
const detectBrowserCore = () => {
  if (window.chrome)
    return "Chromium";
  if (window.InstallTrigger)
    return "Gecko";
  if (navigator.vendor.indexOf("Apple") !== -1)
    return "WebKit";
  return "Unknown";
};
const roundedRect = (ctx, x, y, width, height, radius) => {
  const radii = [0, 0, 0, 0];
  if (typeof radius === "number")
    radii.fill(radius);
  else
    radius.forEach((v, i) => radii[i] = v);
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
  if (typeof radius === "number")
    radii.fill(radius);
  else
    radius.forEach((v, i) => radii[i] = v);
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
const selectElementRange = (e) => {
  const elementIsEditable = (e2) => !!e2.nodeName.match(/^(INPUT|TEXTAREA)$/i);
  const selection = window.getSelection();
  if (elementIsEditable(e)) {
    e.focus();
    e.select();
    return;
  }
  if (selection.setBaseAndExtent) {
    selection.setBaseAndExtent(e, 0, e, e.hasChildNodes() ? 1 : 0);
    return;
  }
  if (selection.addRange && selection.removeAllRanges && document.createRange) {
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
};
const getPropertyDescriptor = (obj, key) => {
  return Object.getOwnPropertyDescriptor(obj, key) || getPropertyDescriptor(Object.getPrototypeOf(obj), key);
};
const getPropertyDescriptors = (obj) => {
  if (typeof obj === "function")
    return Object.getOwnPropertyDescriptors(obj);
  const proto = Object.getPrototypeOf(obj);
  if (obj !== Object.prototype && proto === Object.prototype)
    return Object.getOwnPropertyDescriptors(obj);
  return Object.assign(proto ? getPropertyDescriptors(proto) : {}, Object.getOwnPropertyDescriptors(obj));
};
const extToType = (ext) => {
  if (["jspat", "maxpat", "gendsp", "dsppat"].indexOf(ext) !== -1)
    return "patcher";
  if (["wav", "aif", "aiff", "mp3", "aac", "flac", "ogg", "m4a"].indexOf(ext) !== -1)
    return "audio";
  if (["txt", "json"].indexOf(ext) !== -1)
    return "text";
  if (["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp", "bmp", "ico", "cur", "tif", "tiff"].indexOf(ext) !== -1)
    return "image";
  if (["mp4", "webm", "3gp"].indexOf(ext) !== -1)
    return "video";
  return "unknown";
};
const max2js = (patcherIn, mode = "max") => {
  const patcher = { boxes: {}, lines: {} };
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
const js2max = (patcherIn) => {
  const maxPatcher = {
    boxes: [],
    lines: [],
    rect: void 0,
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
        id: `obj-${numID}`,
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
  return { patcher: maxPatcher };
};
const convertSampleToUnit = (sample, unit, { sampleRate = 48e3, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
  if (unit === "sample")
    return { unit, str: sample.toString(), value: sample, values: [sample] };
  const milliseconds = sample * 1e3 / sampleRate;
  const roundedMs = Math.round(milliseconds);
  if (unit === "measure") {
    const dpms = bpm * division / 6e4;
    const totalDivisions = dpms * milliseconds;
    const roundedTotalDivisions = dpms * milliseconds;
    const divisions = ~~(roundedTotalDivisions % division);
    const beats = ~~(roundedTotalDivisions / division) % beatsPerMeasure + 1;
    const measure = ~~(roundedTotalDivisions / beatsPerMeasure / division) + 1;
    const str2 = `${measure}:${beats}.${divisions.toString().padStart(2, "0")}`;
    return { unit, str: str2, value: totalDivisions / division, values: [measure, beats, divisions] };
  }
  const ms = roundedMs % 1e3;
  const s = ~~(roundedMs / 1e3) % 60;
  const min = ~~(roundedMs / 6e4) % 60;
  const h = ~~(roundedMs / 36e5);
  const str = !min ? `${s}.${ms.toString().padStart(3, "0")}` : !h ? `${min}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}` : `${h}:${min.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  return { unit, str, value: milliseconds / 1e3, values: [h, min, s, ms] };
};
const MEASURE_UNIT_REGEX = /^((\d+):)?(\d+)\.?(\d+)?$/;
const TIME_UNIT_REGEX = /^((\d+):)??((\d+):)?(\d+)\.?(\d+)?$/;
const convertUnitToSample = (str, unit, { sampleRate = 48e3, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
  if (unit === "sample")
    return +str || 0;
  if (unit === "measure") {
    const matched2 = str.match(MEASURE_UNIT_REGEX);
    if (!matched2)
      throw new Error(`String ${str} cannot be parsed to ${unit}`);
    const [, , measureIn, beatsIn, divisionsIn] = matched2;
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
  if (!matched)
    throw new Error(`String ${str} cannot be parsed to ${unit}`);
  const [, , hIn, , minIn, sIn, msIn] = matched;
  let h = +hIn || 0;
  let min = +minIn || 0;
  let s = +sIn || 0;
  let ms = +msIn || 0;
  s += ~~(ms / 1e3);
  ms %= 1e3;
  min += ~~(s / 60);
  s %= 60;
  h += ~~(min / 60);
  min %= 60;
  return (h * 3600 + min * 60 + s + ms / 1e3) * sampleRate;
};
const ab2sab = (ab) => {
  if (ab instanceof ArrayBuffer)
    return ab;
  const sab = new SharedArrayBuffer(ab.byteLength);
  const ui8ab = new Uint8Array(ab);
  const ui8sab = new Uint8Array(sab);
  for (let i = 0; i < ui8ab.length; i++) {
    ui8sab[i] = ui8ab[i];
  }
  return sab;
};
const sab2ab = (sab) => {
  if (sab instanceof SharedArrayBuffer)
    return sab;
  const ab = new ArrayBuffer(sab.byteLength);
  const ui8ab = new Uint8Array(ab);
  const ui8sab = new Uint8Array(sab);
  for (let i = 0; i < ui8sab.length; i++) {
    ui8ab[i] = ui8sab[i];
  }
  return ab;
};
const ab2str = (buf) => {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
};
const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length * 2);
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
const getFactors = (n) => {
  const factors = [1];
  let i = 2;
  while (i < Math.sqrt(n)) {
    if (n % i === 0)
      factors.push(i, n / i);
    i++;
  }
  return factors.sort((a, b) => a - b);
};
const getRuler = (range, unit, { sampleRate = 48e3, bpm = 60, beatsPerMeasure = 4, division = 16 }) => {
  const ruler = {};
  const length = range[1] - range[0];
  let coarse;
  let refined;
  if (unit === "sample") {
    const steps = [1, 2, 5];
    let mag = 1;
    let step = 0;
    do {
      const grid = steps[step] * mag;
      if (step + 1 < steps.length) {
        step++;
      } else {
        step = 0;
        mag *= 10;
      }
      if (!coarse && length / grid <= 10)
        coarse = grid;
      if (!refined && length / grid <= 50)
        refined = grid;
    } while (!coarse || !refined);
  } else if (unit === "measure") {
    const bps = bpm / 60;
    const samplesPerBeat = sampleRate / bps;
    const divisionFactors = getFactors(division);
    const beatsFactors = getFactors(beatsPerMeasure);
    const measureFactors = [1, 2, 5];
    let actualUnit = "division";
    let mag = 1;
    let step = 0;
    do {
      const grid = actualUnit === "division" ? samplesPerBeat * divisionFactors[step] / division : actualUnit === "beat" ? samplesPerBeat * beatsFactors[step] : samplesPerBeat * measureFactors[step] * mag * beatsPerMeasure;
      if (actualUnit === "division") {
        if (step + 1 < divisionFactors.length) {
          step++;
        } else {
          actualUnit = "beat";
          step = 0;
        }
      } else if (actualUnit === "beat") {
        if (step + 1 < beatsFactors.length) {
          step++;
        } else {
          actualUnit = "measure";
          step = 0;
        }
      } else {
        if (step + 1 < measureFactors.length) {
          step++;
        } else {
          step = 0;
          mag *= 10;
        }
      }
      if (!coarse && length / grid <= 10)
        coarse = grid;
      if (!refined && length / grid <= 50)
        refined = grid;
    } while (!coarse || !refined);
  } else {
    const msFactors = [1, 2, 5, 10, 20, 50, 100, 200, 500];
    const sFactors = getFactors(60);
    const minFactors = sFactors;
    const hFactors = [1, 2, 5];
    let actualUnit = "ms";
    let mag = 1;
    let step = 0;
    do {
      const grid = actualUnit === "ms" ? sampleRate * msFactors[step] / 1e3 : actualUnit === "s" ? sampleRate * sFactors[step] : actualUnit === "min" ? sampleRate * minFactors[step] * 60 : sampleRate * hFactors[step] * mag * 60;
      if (actualUnit === "ms") {
        if (step + 1 < msFactors.length) {
          step++;
        } else {
          actualUnit = "s";
          step = 0;
        }
      } else if (actualUnit === "s") {
        if (step + 1 < sFactors.length) {
          step++;
        } else {
          actualUnit = "min";
          step = 0;
        }
      } else if (actualUnit === "min") {
        if (step + 1 < minFactors.length) {
          step++;
        } else {
          actualUnit = "h";
          step = 0;
        }
      } else {
        if (step + 1 < hFactors.length) {
          step++;
        } else {
          step = 0;
          mag *= 10;
        }
      }
      if (!coarse && length / grid <= 10)
        coarse = grid;
      if (!refined && length / grid <= 50)
        refined = grid;
    } while (!coarse || !refined);
  }
  let m = ~~(range[0] / refined);
  if (m * refined < range[0])
    m++;
  while (m * refined < range[1]) {
    const t = m * refined;
    if (t && t % coarse < 1e-3 || coarse - t % coarse < 1e-3) {
      ruler[t] = unit === "sample" ? t.toString() : convertSampleToUnit(t, unit, { sampleRate, bpm, beatsPerMeasure, division }).str.replace(/\.[0.]+$/, "");
    } else {
      ruler[t] = "";
    }
    m++;
  }
  return { ruler, coarse, refined };
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
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.js??ruleSet[1].rules[2].use!./src/core/worklets/WorkletEnv.worklet.ts ***!
  \**********************************************************************************************************************/
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








const processorId = "__JSPatcher_WorkletEnv";
const { registerProcessor } = globalThis;
class WorkletEnvProcessor extends _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_0__.default {
  constructor(options) {
    super(options);
    this.ee = new _utils_TypedEventEmitter__WEBPACK_IMPORTED_MODULE_3__.default();
    this.thread = "AudioWorklet";
    this.taskMgr = new _TaskMgr__WEBPACK_IMPORTED_MODULE_1__.default();
    this.sdk = new _WorkletSDK__WEBPACK_IMPORTED_MODULE_7__.default();
    this.instances = new Set();
    this.handleFileMgrChange = () => {
      if (this.fileMgr.disabled)
        return;
      this.fileMgrDiff(this.fileMgr.getDataForDiff());
    };
    globalThis.jspatcherEnv = this;
    const { os, browser, language, generatedId } = options.processorOptions;
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
    if (!id)
      return this.generateId(i);
    return id;
  }
  getInstanceById(id) {
    for (const instance of this.instances) {
      if (instance.id === id)
        return instance;
    }
    return null;
  }
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
    const handleTaskBegin = ({ id, message, emitter }) => {
      var _a;
      return this.taskBegin({ id, message, emitter: typeof emitter === "string" ? emitter : (_a = emitter.constructor) == null ? void 0 : _a.name });
    };
    const handleTaskUpdate = ({ id, message }) => this.taskUpdate({ id, message });
    const handleTaskError = ({ id, error }) => this.taskError({ id, error });
    const handleTaskEnd = ({ id }) => this.taskEnd({ id });
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
    if (this._disposed)
      return false;
    return true;
  }
}
WorkletEnvProcessor.fnNames = ["envNewLog", "taskBegin", "taskUpdate", "taskError", "taskEnd", "fileMgrExists", "fileMgrGetFileDetails", "fileMgrPutFile", "fileMgrReadDir", "fileMgrReadFile", "fileMgrWriteFile", "fileMgrGetPathIdMap", "fileMgrDiff", "addObjects", "addWorkletModule"];
try {
  registerProcessor(processorId, WorkletEnvProcessor);
} catch (error) {
  console.warn(error);
}

})();

/******/ })()
;
//# sourceMappingURL=62defa7295cb9d854022.worklet.js.map