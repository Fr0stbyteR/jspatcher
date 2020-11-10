/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/babel-loader/lib/index.js!./src/core/workers/FileMgr.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js!./src/core/workers/FileMgr.worker.ts":
/*!****************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./src/core/workers/FileMgr.worker.ts ***!
  \****************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var browserfs_dist_node_backend_IndexedDB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! browserfs/dist/node/backend/IndexedDB */ "./node_modules/browserfs/dist/node/backend/IndexedDB.js");
/* harmony import */ var browserfs_dist_node_backend_IndexedDB__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(browserfs_dist_node_backend_IndexedDB__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var browserfs_dist_node_core_file_flag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! browserfs/dist/node/core/file_flag */ "./node_modules/browserfs/dist/node/core/file_flag.js");
/* harmony import */ var browserfs_dist_node_core_file_flag__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(browserfs_dist_node_core_file_flag__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js");
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(buffer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _scripts_PatchBrowserFSPreloadFile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../scripts/PatchBrowserFSPreloadFile */ "./src/scripts/PatchBrowserFSPreloadFile.js");
/* harmony import */ var _ProxyWorker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ProxyWorker */ "./src/core/workers/ProxyWorker.ts");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-new */






class FileMgr extends _ProxyWorker__WEBPACK_IMPORTED_MODULE_4__["default"] {
  constructor() {
    super(...arguments);

    _defineProperty(this, "fs", void 0);
  }

  init() {
    return new Promise((resolve, reject) => browserfs_dist_node_backend_IndexedDB__WEBPACK_IMPORTED_MODULE_0___default.a.Create({
      storeName: "JSPatcher"
    }, (e, r) => {
      if (e) {
        reject(e);
      } else {
        this.fs = r;
        resolve(true);
      }
    }));
  }

  mkdir(path) {
    return new Promise((resolve, reject) => this.fs.mkdir(path, 0o777, e => e ? reject(e) : resolve(true)));
  }

  createFile(path, data) {
    Object.setPrototypeOf(data, buffer__WEBPACK_IMPORTED_MODULE_2__["Buffer"].prototype);
    return new Promise((resolve, reject) => {
      this.fs.createFile(path, new browserfs_dist_node_core_file_flag__WEBPACK_IMPORTED_MODULE_1__["FileFlag"]("w"), 0o777, (e, r) => e ? reject(e) : r.write(data, 0, data.byteLength, null, e => e ? reject(e) : r.close(e => e ? reject(e) : resolve(true))));
    });
  }

  rename(oldPath, newPath) {
    return new Promise((resolve, reject) => this.fs.rename(oldPath, newPath, e => e ? reject(e) : resolve(true)));
  }

  exists(path) {
    return new Promise(resolve => this.fs.exists(path, resolve));
  }

  readdir(path) {
    return new Promise((resolve, reject) => this.fs.readdir(path, (e, r) => e ? reject(e) : resolve(r)));
  }

  readFile(path) {
    return new Promise((resolve, reject) => this.fs.readFile(path, null, new browserfs_dist_node_core_file_flag__WEBPACK_IMPORTED_MODULE_1__["FileFlag"]("r"), (e, r) => e ? reject(e) : resolve(r.buffer)));
  }

  unlink(path) {
    return new Promise((resolve, reject) => this.fs.unlink(path, e => e ? reject(e) : resolve(true)));
  }

  rmdir(path) {
    return new Promise((resolve, reject) => this.fs.rmdir(path, e => e ? reject(e) : resolve(true)));
  }

  isFile(path) {
    return new Promise((resolve, reject) => this.fs.stat(path, false, (e, r) => e ? reject(e) : resolve(r.isFile())));
  }

  empty() {
    return new Promise((resolve, reject) => this.fs.empty(e => e ? reject(e) : resolve(true)));
  }

}

new FileMgr();

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/browserfs/dist/node/backend/IndexedDB.js":
/*!***************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/backend/IndexedDB.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var key_value_filesystem_1 = __webpack_require__(/*! ../generic/key_value_filesystem */ "./node_modules/browserfs/dist/node/generic/key_value_filesystem.js");
var api_error_1 = __webpack_require__(/*! ../core/api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var global_1 = __webpack_require__(/*! ../core/global */ "./node_modules/browserfs/dist/node/core/global.js");
var util_1 = __webpack_require__(/*! ../core/util */ "./node_modules/browserfs/dist/node/core/util.js");
/**
 * Get the indexedDB constructor for the current browser.
 * @hidden
 */
var indexedDB = global_1["default"].indexedDB ||
    global_1["default"].mozIndexedDB ||
    global_1["default"].webkitIndexedDB ||
    global_1["default"].msIndexedDB;
/**
 * Converts a DOMException or a DOMError from an IndexedDB event into a
 * standardized BrowserFS API error.
 * @hidden
 */
function convertError(e, message) {
    if (message === void 0) { message = e.toString(); }
    switch (e.name) {
        case "NotFoundError":
            return new api_error_1.ApiError(api_error_1.ErrorCode.ENOENT, message);
        case "QuotaExceededError":
            return new api_error_1.ApiError(api_error_1.ErrorCode.ENOSPC, message);
        default:
            // The rest do not seem to map cleanly to standard error codes.
            return new api_error_1.ApiError(api_error_1.ErrorCode.EIO, message);
    }
}
/**
 * Produces a new onerror handler for IDB. Our errors are always fatal, so we
 * handle them generically: Call the user-supplied callback with a translated
 * version of the error, and let the error bubble up.
 * @hidden
 */
function onErrorHandler(cb, code, message) {
    if (code === void 0) { code = api_error_1.ErrorCode.EIO; }
    if (message === void 0) { message = null; }
    return function (e) {
        // Prevent the error from canceling the transaction.
        e.preventDefault();
        cb(new api_error_1.ApiError(code, message !== null ? message : undefined));
    };
}
/**
 * @hidden
 */
var IndexedDBROTransaction = (function () {
    function IndexedDBROTransaction(tx, store) {
        this.tx = tx;
        this.store = store;
    }
    IndexedDBROTransaction.prototype.get = function (key, cb) {
        try {
            var r = this.store.get(key);
            r.onerror = onErrorHandler(cb);
            r.onsuccess = function (event) {
                // IDB returns the value 'undefined' when you try to get keys that
                // don't exist. The caller expects this behavior.
                var result = event.target.result;
                if (result === undefined) {
                    cb(null, result);
                }
                else {
                    // IDB data is stored as an ArrayBuffer
                    cb(null, util_1.arrayBuffer2Buffer(result));
                }
            };
        }
        catch (e) {
            cb(convertError(e));
        }
    };
    return IndexedDBROTransaction;
}());
exports.IndexedDBROTransaction = IndexedDBROTransaction;
/**
 * @hidden
 */
var IndexedDBRWTransaction = (function (_super) {
    __extends(IndexedDBRWTransaction, _super);
    function IndexedDBRWTransaction(tx, store) {
        return _super.call(this, tx, store) || this;
    }
    IndexedDBRWTransaction.prototype.put = function (key, data, overwrite, cb) {
        try {
            var arraybuffer = util_1.buffer2ArrayBuffer(data);
            var r = void 0;
            if (overwrite) {
                r = this.store.put(arraybuffer, key);
            }
            else {
                // 'add' will never overwrite an existing key.
                r = this.store.add(arraybuffer, key);
            }
            // XXX: NEED TO RETURN FALSE WHEN ADD HAS A KEY CONFLICT. NO ERROR.
            r.onerror = onErrorHandler(cb);
            r.onsuccess = function (event) {
                cb(null, true);
            };
        }
        catch (e) {
            cb(convertError(e));
        }
    };
    IndexedDBRWTransaction.prototype.del = function (key, cb) {
        try {
            // NOTE: IE8 has a bug with identifiers named 'delete' unless used as a string
            // like this.
            // http://stackoverflow.com/a/26479152
            var r = this.store['delete'](key);
            r.onerror = onErrorHandler(cb);
            r.onsuccess = function (event) {
                cb();
            };
        }
        catch (e) {
            cb(convertError(e));
        }
    };
    IndexedDBRWTransaction.prototype.commit = function (cb) {
        // Return to the event loop to commit the transaction.
        setTimeout(cb, 0);
    };
    IndexedDBRWTransaction.prototype.abort = function (cb) {
        var _e = null;
        try {
            this.tx.abort();
        }
        catch (e) {
            _e = convertError(e);
        }
        finally {
            cb(_e);
        }
    };
    return IndexedDBRWTransaction;
}(IndexedDBROTransaction));
exports.IndexedDBRWTransaction = IndexedDBRWTransaction;
var IndexedDBStore = (function () {
    function IndexedDBStore(cb, storeName) {
        if (storeName === void 0) { storeName = 'browserfs'; }
        var _this = this;
        this.storeName = storeName;
        var openReq = indexedDB.open(this.storeName, 1);
        openReq.onupgradeneeded = function (event) {
            var db = event.target.result;
            // Huh. This should never happen; we're at version 1. Why does another
            // database exist?
            if (db.objectStoreNames.contains(_this.storeName)) {
                db.deleteObjectStore(_this.storeName);
            }
            db.createObjectStore(_this.storeName);
        };
        openReq.onsuccess = function (event) {
            _this.db = event.target.result;
            cb(null, _this);
        };
        openReq.onerror = onErrorHandler(cb, api_error_1.ErrorCode.EACCES);
    }
    IndexedDBStore.prototype.name = function () {
        return IndexedDBFileSystem.Name + " - " + this.storeName;
    };
    IndexedDBStore.prototype.clear = function (cb) {
        try {
            var tx = this.db.transaction(this.storeName, 'readwrite'), objectStore = tx.objectStore(this.storeName), r = objectStore.clear();
            r.onsuccess = function (event) {
                // Use setTimeout to commit transaction.
                setTimeout(cb, 0);
            };
            r.onerror = onErrorHandler(cb);
        }
        catch (e) {
            cb(convertError(e));
        }
    };
    IndexedDBStore.prototype.beginTransaction = function (type) {
        if (type === void 0) { type = 'readonly'; }
        var tx = this.db.transaction(this.storeName, type), objectStore = tx.objectStore(this.storeName);
        if (type === 'readwrite') {
            return new IndexedDBRWTransaction(tx, objectStore);
        }
        else if (type === 'readonly') {
            return new IndexedDBROTransaction(tx, objectStore);
        }
        else {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid transaction type.');
        }
    };
    return IndexedDBStore;
}());
exports.IndexedDBStore = IndexedDBStore;
/**
 * A file system that uses the IndexedDB key value file system.
 */
var IndexedDBFileSystem = (function (_super) {
    __extends(IndexedDBFileSystem, _super);
    /**
     * **Deprecated. Use IndexedDB.Create() method instead.**
     *
     * Constructs an IndexedDB file system.
     * @param cb Called once the database is instantiated and ready for use.
     *   Passes an error if there was an issue instantiating the database.
     * @param storeName The name of this file system. You can have
     *   multiple IndexedDB file systems operating at once, but each must have
     *   a different name.
     */
    function IndexedDBFileSystem(cb, storeName, deprecateMsg) {
        if (deprecateMsg === void 0) { deprecateMsg = true; }
        var _this = _super.call(this) || this;
        _this.store = new IndexedDBStore(function (e) {
            if (e) {
                cb(e);
            }
            else {
                _this.init(_this.store, function (e) {
                    cb(e, _this);
                });
            }
        }, storeName);
        util_1.deprecationMessage(deprecateMsg, IndexedDBFileSystem.Name, { storeName: storeName });
        return _this;
    }
    /**
     * Constructs an IndexedDB file system with the given options.
     */
    IndexedDBFileSystem.Create = function (opts, cb) {
        // tslint:disable-next-line:no-unused-new
        new IndexedDBFileSystem(cb, opts.storeName, false);
        // tslint:enable-next-line:no-unused-new
    };
    IndexedDBFileSystem.isAvailable = function () {
        // In Safari's private browsing mode, indexedDB.open returns NULL.
        // In Firefox, it throws an exception.
        // In Chrome, it "just works", and clears the database when you leave the page.
        // Untested: Opera, IE.
        try {
            return typeof indexedDB !== 'undefined' && null !== indexedDB.open("__browserfs_test__");
        }
        catch (e) {
            return false;
        }
    };
    return IndexedDBFileSystem;
}(key_value_filesystem_1.AsyncKeyValueFileSystem));
IndexedDBFileSystem.Name = "IndexedDB";
IndexedDBFileSystem.Options = {
    storeName: {
        type: "string",
        optional: true,
        description: "The name of this file system. You can have multiple IndexedDB file systems operating at once, but each must have a different name."
    }
};
exports["default"] = IndexedDBFileSystem;
//# sourceMappingURL=IndexedDB.js.map

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/FS.js":
/*!*****************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/FS.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {exports.__esModule = true;
var api_error_1 = __webpack_require__(/*! ./api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var file_flag_1 = __webpack_require__(/*! ./file_flag */ "./node_modules/browserfs/dist/node/core/file_flag.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
var node_fs_stats_1 = __webpack_require__(/*! ./node_fs_stats */ "./node_modules/browserfs/dist/node/core/node_fs_stats.js");
/**
 * Wraps a callback function. Used for unit testing. Defaults to a NOP.
 * @hidden
 */
var wrapCb = function (cb, numArgs) {
    return cb;
};
/**
 * @hidden
 */
function assertRoot(fs) {
    if (fs) {
        return fs;
    }
    throw new api_error_1.ApiError(api_error_1.ErrorCode.EIO, "Initialize BrowserFS with a file system using BrowserFS.initialize(filesystem)");
}
/**
 * @hidden
 */
function normalizeMode(mode, def) {
    switch (typeof mode) {
        case 'number':
            // (path, flag, mode, cb?)
            return mode;
        case 'string':
            // (path, flag, modeString, cb?)
            var trueMode = parseInt(mode, 8);
            if (!isNaN(trueMode)) {
                return trueMode;
            }
            // Invalid string.
            return def;
        default:
            return def;
    }
}
/**
 * @hidden
 */
function normalizeTime(time) {
    if (time instanceof Date) {
        return time;
    }
    else if (typeof time === 'number') {
        return new Date(time * 1000);
    }
    else {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "Invalid time.");
    }
}
/**
 * @hidden
 */
function normalizePath(p) {
    // Node doesn't allow null characters in paths.
    if (p.indexOf('\u0000') >= 0) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Path must be a string without null bytes.');
    }
    else if (p === '') {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Path must not be empty.');
    }
    return path.resolve(p);
}
/**
 * @hidden
 */
function normalizeOptions(options, defEnc, defFlag, defMode) {
    switch (typeof options) {
        case 'object':
            return {
                encoding: typeof options['encoding'] !== 'undefined' ? options['encoding'] : defEnc,
                flag: typeof options['flag'] !== 'undefined' ? options['flag'] : defFlag,
                mode: normalizeMode(options['mode'], defMode)
            };
        case 'string':
            return {
                encoding: options,
                flag: defFlag,
                mode: defMode
            };
        default:
            return {
                encoding: defEnc,
                flag: defFlag,
                mode: defMode
            };
    }
}
/**
 * The default callback is a NOP.
 * @hidden
 * @private
 */
function nopCb() {
    // NOP.
}
/**
 * The node frontend to all filesystems.
 * This layer handles:
 *
 * * Sanity checking inputs.
 * * Normalizing paths.
 * * Resetting stack depth for asynchronous operations which may not go through
 *   the browser by wrapping all input callbacks using `setImmediate`.
 * * Performing the requested operation through the filesystem or the file
 *   descriptor, as appropriate.
 * * Handling optional arguments and setting default arguments.
 * @see http://nodejs.org/api/fs.html
 */
var FS = (function () {
    function FS() {
        /* tslint:enable:variable-name */
        this.F_OK = 0;
        this.R_OK = 4;
        this.W_OK = 2;
        this.X_OK = 1;
        this.root = null;
        this.fdMap = {};
        this.nextFd = 100;
    }
    FS.prototype.initialize = function (rootFS) {
        if (!rootFS.constructor.isAvailable()) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Tried to instantiate BrowserFS with an unavailable file system.');
        }
        return this.root = rootFS;
    };
    /**
     * converts Date or number to a fractional UNIX timestamp
     * Grabbed from NodeJS sources (lib/fs.js)
     */
    FS.prototype._toUnixTimestamp = function (time) {
        if (typeof time === 'number') {
            return time;
        }
        else if (time instanceof Date) {
            return time.getTime() / 1000;
        }
        throw new Error("Cannot parse time: " + time);
    };
    /**
     * **NONSTANDARD**: Grab the FileSystem instance that backs this API.
     * @return [BrowserFS.FileSystem | null] Returns null if the file system has
     *   not been initialized.
     */
    FS.prototype.getRootFS = function () {
        if (this.root) {
            return this.root;
        }
        else {
            return null;
        }
    };
    // FILE OR DIRECTORY METHODS
    /**
     * Asynchronous rename. No arguments other than a possible exception are given
     * to the completion callback.
     * @param oldPath
     * @param newPath
     * @param callback
     */
    FS.prototype.rename = function (oldPath, newPath, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            assertRoot(this.root).rename(normalizePath(oldPath), normalizePath(newPath), newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous rename.
     * @param oldPath
     * @param newPath
     */
    FS.prototype.renameSync = function (oldPath, newPath) {
        assertRoot(this.root).renameSync(normalizePath(oldPath), normalizePath(newPath));
    };
    /**
     * Test whether or not the given path exists by checking with the file system.
     * Then call the callback argument with either true or false.
     * @example Sample invocation
     *   fs.exists('/etc/passwd', function (exists) {
     *     util.debug(exists ? "it's there" : "no passwd!");
     *   });
     * @param path
     * @param callback
     */
    FS.prototype.exists = function (path, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            return assertRoot(this.root).exists(normalizePath(path), newCb);
        }
        catch (e) {
            // Doesn't return an error. If something bad happens, we assume it just
            // doesn't exist.
            return newCb(false);
        }
    };
    /**
     * Test whether or not the given path exists by checking with the file system.
     * @param path
     * @return [boolean]
     */
    FS.prototype.existsSync = function (path) {
        try {
            return assertRoot(this.root).existsSync(normalizePath(path));
        }
        catch (e) {
            // Doesn't return an error. If something bad happens, we assume it just
            // doesn't exist.
            return false;
        }
    };
    /**
     * Asynchronous `stat`.
     * @param path
     * @param callback
     */
    FS.prototype.stat = function (path, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 2);
        try {
            return assertRoot(this.root).stat(normalizePath(path), false, newCb);
        }
        catch (e) {
            return newCb(e);
        }
    };
    /**
     * Synchronous `stat`.
     * @param path
     * @return [BrowserFS.node.fs.Stats]
     */
    FS.prototype.statSync = function (path) {
        return assertRoot(this.root).statSync(normalizePath(path), false);
    };
    /**
     * Asynchronous `lstat`.
     * `lstat()` is identical to `stat()`, except that if path is a symbolic link,
     * then the link itself is stat-ed, not the file that it refers to.
     * @param path
     * @param callback
     */
    FS.prototype.lstat = function (path, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 2);
        try {
            return assertRoot(this.root).stat(normalizePath(path), true, newCb);
        }
        catch (e) {
            return newCb(e);
        }
    };
    /**
     * Synchronous `lstat`.
     * `lstat()` is identical to `stat()`, except that if path is a symbolic link,
     * then the link itself is stat-ed, not the file that it refers to.
     * @param path
     * @return [BrowserFS.node.fs.Stats]
     */
    FS.prototype.lstatSync = function (path) {
        return assertRoot(this.root).statSync(normalizePath(path), true);
    };
    FS.prototype.truncate = function (path, arg2, cb) {
        if (arg2 === void 0) { arg2 = 0; }
        if (cb === void 0) { cb = nopCb; }
        var len = 0;
        if (typeof arg2 === 'function') {
            cb = arg2;
        }
        else if (typeof arg2 === 'number') {
            len = arg2;
        }
        var newCb = wrapCb(cb, 1);
        try {
            if (len < 0) {
                throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL);
            }
            return assertRoot(this.root).truncate(normalizePath(path), len, newCb);
        }
        catch (e) {
            return newCb(e);
        }
    };
    /**
     * Synchronous `truncate`.
     * @param path
     * @param len
     */
    FS.prototype.truncateSync = function (path, len) {
        if (len === void 0) { len = 0; }
        if (len < 0) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL);
        }
        return assertRoot(this.root).truncateSync(normalizePath(path), len);
    };
    /**
     * Asynchronous `unlink`.
     * @param path
     * @param callback
     */
    FS.prototype.unlink = function (path, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            return assertRoot(this.root).unlink(normalizePath(path), newCb);
        }
        catch (e) {
            return newCb(e);
        }
    };
    /**
     * Synchronous `unlink`.
     * @param path
     */
    FS.prototype.unlinkSync = function (path) {
        return assertRoot(this.root).unlinkSync(normalizePath(path));
    };
    FS.prototype.open = function (path, flag, arg2, cb) {
        var _this = this;
        if (cb === void 0) { cb = nopCb; }
        var mode = normalizeMode(arg2, 0x1a4);
        cb = typeof arg2 === 'function' ? arg2 : cb;
        var newCb = wrapCb(cb, 2);
        try {
            assertRoot(this.root).open(normalizePath(path), file_flag_1.FileFlag.getFileFlag(flag), mode, function (e, file) {
                if (file) {
                    newCb(e, _this.getFdForFile(file));
                }
                else {
                    newCb(e);
                }
            });
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous file open.
     * @see http://www.manpagez.com/man/2/open/
     * @param path
     * @param flags
     * @param mode defaults to `0644`
     * @return [BrowserFS.File]
     */
    FS.prototype.openSync = function (path, flag, mode) {
        if (mode === void 0) { mode = 0x1a4; }
        return this.getFdForFile(assertRoot(this.root).openSync(normalizePath(path), file_flag_1.FileFlag.getFileFlag(flag), normalizeMode(mode, 0x1a4)));
    };
    FS.prototype.readFile = function (filename, arg2, cb) {
        if (arg2 === void 0) { arg2 = {}; }
        if (cb === void 0) { cb = nopCb; }
        var options = normalizeOptions(arg2, null, 'r', null);
        cb = typeof arg2 === 'function' ? arg2 : cb;
        var newCb = wrapCb(cb, 2);
        try {
            var flag = file_flag_1.FileFlag.getFileFlag(options['flag']);
            if (!flag.isReadable()) {
                return newCb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Flag passed to readFile must allow for reading.'));
            }
            return assertRoot(this.root).readFile(normalizePath(filename), options.encoding, flag, newCb);
        }
        catch (e) {
            return newCb(e);
        }
    };
    FS.prototype.readFileSync = function (filename, arg2) {
        if (arg2 === void 0) { arg2 = {}; }
        var options = normalizeOptions(arg2, null, 'r', null);
        var flag = file_flag_1.FileFlag.getFileFlag(options.flag);
        if (!flag.isReadable()) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Flag passed to readFile must allow for reading.');
        }
        return assertRoot(this.root).readFileSync(normalizePath(filename), options.encoding, flag);
    };
    FS.prototype.writeFile = function (filename, data, arg3, cb) {
        if (arg3 === void 0) { arg3 = {}; }
        if (cb === void 0) { cb = nopCb; }
        var options = normalizeOptions(arg3, 'utf8', 'w', 0x1a4);
        cb = typeof arg3 === 'function' ? arg3 : cb;
        var newCb = wrapCb(cb, 1);
        try {
            var flag = file_flag_1.FileFlag.getFileFlag(options.flag);
            if (!flag.isWriteable()) {
                return newCb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Flag passed to writeFile must allow for writing.'));
            }
            return assertRoot(this.root).writeFile(normalizePath(filename), data, options.encoding, flag, options.mode, newCb);
        }
        catch (e) {
            return newCb(e);
        }
    };
    FS.prototype.writeFileSync = function (filename, data, arg3) {
        var options = normalizeOptions(arg3, 'utf8', 'w', 0x1a4);
        var flag = file_flag_1.FileFlag.getFileFlag(options.flag);
        if (!flag.isWriteable()) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Flag passed to writeFile must allow for writing.');
        }
        return assertRoot(this.root).writeFileSync(normalizePath(filename), data, options.encoding, flag, options.mode);
    };
    FS.prototype.appendFile = function (filename, data, arg3, cb) {
        if (cb === void 0) { cb = nopCb; }
        var options = normalizeOptions(arg3, 'utf8', 'a', 0x1a4);
        cb = typeof arg3 === 'function' ? arg3 : cb;
        var newCb = wrapCb(cb, 1);
        try {
            var flag = file_flag_1.FileFlag.getFileFlag(options.flag);
            if (!flag.isAppendable()) {
                return newCb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Flag passed to appendFile must allow for appending.'));
            }
            assertRoot(this.root).appendFile(normalizePath(filename), data, options.encoding, flag, options.mode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    FS.prototype.appendFileSync = function (filename, data, arg3) {
        var options = normalizeOptions(arg3, 'utf8', 'a', 0x1a4);
        var flag = file_flag_1.FileFlag.getFileFlag(options.flag);
        if (!flag.isAppendable()) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Flag passed to appendFile must allow for appending.');
        }
        return assertRoot(this.root).appendFileSync(normalizePath(filename), data, options.encoding, flag, options.mode);
    };
    // FILE DESCRIPTOR METHODS
    /**
     * Asynchronous `fstat`.
     * `fstat()` is identical to `stat()`, except that the file to be stat-ed is
     * specified by the file descriptor `fd`.
     * @param fd
     * @param callback
     */
    FS.prototype.fstat = function (fd, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 2);
        try {
            var file = this.fd2file(fd);
            file.stat(newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `fstat`.
     * `fstat()` is identical to `stat()`, except that the file to be stat-ed is
     * specified by the file descriptor `fd`.
     * @param fd
     * @return [BrowserFS.node.fs.Stats]
     */
    FS.prototype.fstatSync = function (fd) {
        return this.fd2file(fd).statSync();
    };
    /**
     * Asynchronous close.
     * @param fd
     * @param callback
     */
    FS.prototype.close = function (fd, cb) {
        var _this = this;
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            this.fd2file(fd).close(function (e) {
                if (!e) {
                    _this.closeFd(fd);
                }
                newCb(e);
            });
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous close.
     * @param fd
     */
    FS.prototype.closeSync = function (fd) {
        this.fd2file(fd).closeSync();
        this.closeFd(fd);
    };
    FS.prototype.ftruncate = function (fd, arg2, cb) {
        if (cb === void 0) { cb = nopCb; }
        var length = typeof arg2 === 'number' ? arg2 : 0;
        cb = typeof arg2 === 'function' ? arg2 : cb;
        var newCb = wrapCb(cb, 1);
        try {
            var file = this.fd2file(fd);
            if (length < 0) {
                throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL);
            }
            file.truncate(length, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous ftruncate.
     * @param fd
     * @param len
     */
    FS.prototype.ftruncateSync = function (fd, len) {
        if (len === void 0) { len = 0; }
        var file = this.fd2file(fd);
        if (len < 0) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL);
        }
        file.truncateSync(len);
    };
    /**
     * Asynchronous fsync.
     * @param fd
     * @param callback
     */
    FS.prototype.fsync = function (fd, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            this.fd2file(fd).sync(newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous fsync.
     * @param fd
     */
    FS.prototype.fsyncSync = function (fd) {
        this.fd2file(fd).syncSync();
    };
    /**
     * Asynchronous fdatasync.
     * @param fd
     * @param callback
     */
    FS.prototype.fdatasync = function (fd, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            this.fd2file(fd).datasync(newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous fdatasync.
     * @param fd
     */
    FS.prototype.fdatasyncSync = function (fd) {
        this.fd2file(fd).datasyncSync();
    };
    FS.prototype.write = function (fd, arg2, arg3, arg4, arg5, cb) {
        if (cb === void 0) { cb = nopCb; }
        var buffer, offset, length, position = null;
        if (typeof arg2 === 'string') {
            // Signature 1: (fd, string, [position?, [encoding?]], cb?)
            var encoding = 'utf8';
            switch (typeof arg3) {
                case 'function':
                    // (fd, string, cb)
                    cb = arg3;
                    break;
                case 'number':
                    // (fd, string, position, encoding?, cb?)
                    position = arg3;
                    encoding = typeof arg4 === 'string' ? arg4 : 'utf8';
                    cb = typeof arg5 === 'function' ? arg5 : cb;
                    break;
                default:
                    // ...try to find the callback and get out of here!
                    cb = typeof arg4 === 'function' ? arg4 : typeof arg5 === 'function' ? arg5 : cb;
                    return cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid arguments.'));
            }
            buffer = Buffer.from(arg2, encoding);
            offset = 0;
            length = buffer.length;
        }
        else {
            // Signature 2: (fd, buffer, offset, length, position?, cb?)
            buffer = arg2;
            offset = arg3;
            length = arg4;
            position = typeof arg5 === 'number' ? arg5 : null;
            cb = typeof arg5 === 'function' ? arg5 : cb;
        }
        var newCb = wrapCb(cb, 3);
        try {
            var file = this.fd2file(fd);
            if (position === undefined || position === null) {
                position = file.getPos();
            }
            file.write(buffer, offset, length, position, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    FS.prototype.writeSync = function (fd, arg2, arg3, arg4, arg5) {
        var buffer, offset = 0, length, position;
        if (typeof arg2 === 'string') {
            // Signature 1: (fd, string, [position?, [encoding?]])
            position = typeof arg3 === 'number' ? arg3 : null;
            var encoding = typeof arg4 === 'string' ? arg4 : 'utf8';
            offset = 0;
            buffer = Buffer.from(arg2, encoding);
            length = buffer.length;
        }
        else {
            // Signature 2: (fd, buffer, offset, length, position?)
            buffer = arg2;
            offset = arg3;
            length = arg4;
            position = typeof arg5 === 'number' ? arg5 : null;
        }
        var file = this.fd2file(fd);
        if (position === undefined || position === null) {
            position = file.getPos();
        }
        return file.writeSync(buffer, offset, length, position);
    };
    FS.prototype.read = function (fd, arg2, arg3, arg4, arg5, cb) {
        if (cb === void 0) { cb = nopCb; }
        var position, offset, length, buffer, newCb;
        if (typeof arg2 === 'number') {
            // legacy interface
            // (fd, length, position, encoding, callback)
            length = arg2;
            position = arg3;
            var encoding_1 = arg4;
            cb = typeof arg5 === 'function' ? arg5 : cb;
            offset = 0;
            buffer = Buffer.alloc(length);
            // XXX: Inefficient.
            // Wrap the cb so we shelter upper layers of the API from these
            // shenanigans.
            newCb = wrapCb(function (err, bytesRead, buf) {
                if (err) {
                    return cb(err);
                }
                cb(err, buf.toString(encoding_1), bytesRead);
            }, 3);
        }
        else {
            buffer = arg2;
            offset = arg3;
            length = arg4;
            position = arg5;
            newCb = wrapCb(cb, 3);
        }
        try {
            var file = this.fd2file(fd);
            if (position === undefined || position === null) {
                position = file.getPos();
            }
            file.read(buffer, offset, length, position, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    FS.prototype.readSync = function (fd, arg2, arg3, arg4, arg5) {
        var shenanigans = false;
        var buffer, offset, length, position, encoding = 'utf8';
        if (typeof arg2 === 'number') {
            length = arg2;
            position = arg3;
            encoding = arg4;
            offset = 0;
            buffer = Buffer.alloc(length);
            shenanigans = true;
        }
        else {
            buffer = arg2;
            offset = arg3;
            length = arg4;
            position = arg5;
        }
        var file = this.fd2file(fd);
        if (position === undefined || position === null) {
            position = file.getPos();
        }
        var rv = file.readSync(buffer, offset, length, position);
        if (!shenanigans) {
            return rv;
        }
        else {
            return [buffer.toString(encoding), rv];
        }
    };
    /**
     * Asynchronous `fchown`.
     * @param fd
     * @param uid
     * @param gid
     * @param callback
     */
    FS.prototype.fchown = function (fd, uid, gid, callback) {
        if (callback === void 0) { callback = nopCb; }
        var newCb = wrapCb(callback, 1);
        try {
            this.fd2file(fd).chown(uid, gid, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `fchown`.
     * @param fd
     * @param uid
     * @param gid
     */
    FS.prototype.fchownSync = function (fd, uid, gid) {
        this.fd2file(fd).chownSync(uid, gid);
    };
    /**
     * Asynchronous `fchmod`.
     * @param fd
     * @param mode
     * @param callback
     */
    FS.prototype.fchmod = function (fd, mode, cb) {
        var newCb = wrapCb(cb, 1);
        try {
            var numMode = typeof mode === 'string' ? parseInt(mode, 8) : mode;
            this.fd2file(fd).chmod(numMode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `fchmod`.
     * @param fd
     * @param mode
     */
    FS.prototype.fchmodSync = function (fd, mode) {
        var numMode = typeof mode === 'string' ? parseInt(mode, 8) : mode;
        this.fd2file(fd).chmodSync(numMode);
    };
    /**
     * Change the file timestamps of a file referenced by the supplied file
     * descriptor.
     * @param fd
     * @param atime
     * @param mtime
     * @param callback
     */
    FS.prototype.futimes = function (fd, atime, mtime, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            var file = this.fd2file(fd);
            if (typeof atime === 'number') {
                atime = new Date(atime * 1000);
            }
            if (typeof mtime === 'number') {
                mtime = new Date(mtime * 1000);
            }
            file.utimes(atime, mtime, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Change the file timestamps of a file referenced by the supplied file
     * descriptor.
     * @param fd
     * @param atime
     * @param mtime
     */
    FS.prototype.futimesSync = function (fd, atime, mtime) {
        this.fd2file(fd).utimesSync(normalizeTime(atime), normalizeTime(mtime));
    };
    // DIRECTORY-ONLY METHODS
    /**
     * Asynchronous `rmdir`.
     * @param path
     * @param callback
     */
    FS.prototype.rmdir = function (path, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            path = normalizePath(path);
            assertRoot(this.root).rmdir(path, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `rmdir`.
     * @param path
     */
    FS.prototype.rmdirSync = function (path) {
        path = normalizePath(path);
        return assertRoot(this.root).rmdirSync(path);
    };
    /**
     * Asynchronous `mkdir`.
     * @param path
     * @param mode defaults to `0777`
     * @param callback
     */
    FS.prototype.mkdir = function (path, mode, cb) {
        if (cb === void 0) { cb = nopCb; }
        if (typeof mode === 'function') {
            cb = mode;
            mode = 0x1ff;
        }
        var newCb = wrapCb(cb, 1);
        try {
            path = normalizePath(path);
            assertRoot(this.root).mkdir(path, mode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `mkdir`.
     * @param path
     * @param mode defaults to `0777`
     */
    FS.prototype.mkdirSync = function (path, mode) {
        assertRoot(this.root).mkdirSync(normalizePath(path), normalizeMode(mode, 0x1ff));
    };
    /**
     * Asynchronous `readdir`. Reads the contents of a directory.
     * The callback gets two arguments `(err, files)` where `files` is an array of
     * the names of the files in the directory excluding `'.'` and `'..'`.
     * @param path
     * @param callback
     */
    FS.prototype.readdir = function (path, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 2);
        try {
            path = normalizePath(path);
            assertRoot(this.root).readdir(path, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `readdir`. Reads the contents of a directory.
     * @param path
     * @return [String[]]
     */
    FS.prototype.readdirSync = function (path) {
        path = normalizePath(path);
        return assertRoot(this.root).readdirSync(path);
    };
    // SYMLINK METHODS
    /**
     * Asynchronous `link`.
     * @param srcpath
     * @param dstpath
     * @param callback
     */
    FS.prototype.link = function (srcpath, dstpath, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            srcpath = normalizePath(srcpath);
            dstpath = normalizePath(dstpath);
            assertRoot(this.root).link(srcpath, dstpath, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `link`.
     * @param srcpath
     * @param dstpath
     */
    FS.prototype.linkSync = function (srcpath, dstpath) {
        srcpath = normalizePath(srcpath);
        dstpath = normalizePath(dstpath);
        return assertRoot(this.root).linkSync(srcpath, dstpath);
    };
    FS.prototype.symlink = function (srcpath, dstpath, arg3, cb) {
        if (cb === void 0) { cb = nopCb; }
        var type = typeof arg3 === 'string' ? arg3 : 'file';
        cb = typeof arg3 === 'function' ? arg3 : cb;
        var newCb = wrapCb(cb, 1);
        try {
            if (type !== 'file' && type !== 'dir') {
                return newCb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "Invalid type: " + type));
            }
            srcpath = normalizePath(srcpath);
            dstpath = normalizePath(dstpath);
            assertRoot(this.root).symlink(srcpath, dstpath, type, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `symlink`.
     * @param srcpath
     * @param dstpath
     * @param type can be either `'dir'` or `'file'` (default is `'file'`)
     */
    FS.prototype.symlinkSync = function (srcpath, dstpath, type) {
        if (!type) {
            type = 'file';
        }
        else if (type !== 'file' && type !== 'dir') {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "Invalid type: " + type);
        }
        srcpath = normalizePath(srcpath);
        dstpath = normalizePath(dstpath);
        return assertRoot(this.root).symlinkSync(srcpath, dstpath, type);
    };
    /**
     * Asynchronous readlink.
     * @param path
     * @param callback
     */
    FS.prototype.readlink = function (path, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 2);
        try {
            path = normalizePath(path);
            assertRoot(this.root).readlink(path, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous readlink.
     * @param path
     * @return [String]
     */
    FS.prototype.readlinkSync = function (path) {
        path = normalizePath(path);
        return assertRoot(this.root).readlinkSync(path);
    };
    // PROPERTY OPERATIONS
    /**
     * Asynchronous `chown`.
     * @param path
     * @param uid
     * @param gid
     * @param callback
     */
    FS.prototype.chown = function (path, uid, gid, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            path = normalizePath(path);
            assertRoot(this.root).chown(path, false, uid, gid, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `chown`.
     * @param path
     * @param uid
     * @param gid
     */
    FS.prototype.chownSync = function (path, uid, gid) {
        path = normalizePath(path);
        assertRoot(this.root).chownSync(path, false, uid, gid);
    };
    /**
     * Asynchronous `lchown`.
     * @param path
     * @param uid
     * @param gid
     * @param callback
     */
    FS.prototype.lchown = function (path, uid, gid, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            path = normalizePath(path);
            assertRoot(this.root).chown(path, true, uid, gid, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `lchown`.
     * @param path
     * @param uid
     * @param gid
     */
    FS.prototype.lchownSync = function (path, uid, gid) {
        path = normalizePath(path);
        assertRoot(this.root).chownSync(path, true, uid, gid);
    };
    /**
     * Asynchronous `chmod`.
     * @param path
     * @param mode
     * @param callback
     */
    FS.prototype.chmod = function (path, mode, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            var numMode = normalizeMode(mode, -1);
            if (numMode < 0) {
                throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "Invalid mode.");
            }
            assertRoot(this.root).chmod(normalizePath(path), false, numMode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `chmod`.
     * @param path
     * @param mode
     */
    FS.prototype.chmodSync = function (path, mode) {
        var numMode = normalizeMode(mode, -1);
        if (numMode < 0) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "Invalid mode.");
        }
        path = normalizePath(path);
        assertRoot(this.root).chmodSync(path, false, numMode);
    };
    /**
     * Asynchronous `lchmod`.
     * @param path
     * @param mode
     * @param callback
     */
    FS.prototype.lchmod = function (path, mode, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            var numMode = normalizeMode(mode, -1);
            if (numMode < 0) {
                throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "Invalid mode.");
            }
            assertRoot(this.root).chmod(normalizePath(path), true, numMode, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `lchmod`.
     * @param path
     * @param mode
     */
    FS.prototype.lchmodSync = function (path, mode) {
        var numMode = normalizeMode(mode, -1);
        if (numMode < 1) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "Invalid mode.");
        }
        assertRoot(this.root).chmodSync(normalizePath(path), true, numMode);
    };
    /**
     * Change file timestamps of the file referenced by the supplied path.
     * @param path
     * @param atime
     * @param mtime
     * @param callback
     */
    FS.prototype.utimes = function (path, atime, mtime, cb) {
        if (cb === void 0) { cb = nopCb; }
        var newCb = wrapCb(cb, 1);
        try {
            assertRoot(this.root).utimes(normalizePath(path), normalizeTime(atime), normalizeTime(mtime), newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Change file timestamps of the file referenced by the supplied path.
     * @param path
     * @param atime
     * @param mtime
     */
    FS.prototype.utimesSync = function (path, atime, mtime) {
        assertRoot(this.root).utimesSync(normalizePath(path), normalizeTime(atime), normalizeTime(mtime));
    };
    FS.prototype.realpath = function (path, arg2, cb) {
        if (cb === void 0) { cb = nopCb; }
        var cache = typeof (arg2) === 'object' ? arg2 : {};
        cb = typeof (arg2) === 'function' ? arg2 : nopCb;
        var newCb = wrapCb(cb, 2);
        try {
            path = normalizePath(path);
            assertRoot(this.root).realpath(path, cache, newCb);
        }
        catch (e) {
            newCb(e);
        }
    };
    /**
     * Synchronous `realpath`.
     * @param path
     * @param cache An object literal of mapped paths that can be used to
     *   force a specific path resolution or avoid additional `fs.stat` calls for
     *   known real paths.
     * @return [String]
     */
    FS.prototype.realpathSync = function (path, cache) {
        if (cache === void 0) { cache = {}; }
        path = normalizePath(path);
        return assertRoot(this.root).realpathSync(path, cache);
    };
    FS.prototype.watchFile = function (filename, arg2, listener) {
        if (listener === void 0) { listener = nopCb; }
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    FS.prototype.unwatchFile = function (filename, listener) {
        if (listener === void 0) { listener = nopCb; }
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    FS.prototype.watch = function (filename, arg2, listener) {
        if (listener === void 0) { listener = nopCb; }
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    FS.prototype.access = function (path, arg2, cb) {
        if (cb === void 0) { cb = nopCb; }
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    FS.prototype.accessSync = function (path, mode) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    FS.prototype.createReadStream = function (path, options) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    FS.prototype.createWriteStream = function (path, options) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * For unit testing. Passes all incoming callbacks to cbWrapper for wrapping.
     */
    FS.prototype.wrapCallbacks = function (cbWrapper) {
        wrapCb = cbWrapper;
    };
    FS.prototype.getFdForFile = function (file) {
        var fd = this.nextFd++;
        this.fdMap[fd] = file;
        return fd;
    };
    FS.prototype.fd2file = function (fd) {
        var rv = this.fdMap[fd];
        if (rv) {
            return rv;
        }
        else {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EBADF, 'Invalid file descriptor.');
        }
    };
    FS.prototype.closeFd = function (fd) {
        delete this.fdMap[fd];
    };
    return FS;
}());
/* tslint:disable:variable-name */
// Exported fs.Stats.
FS.Stats = node_fs_stats_1["default"];
exports["default"] = FS;
//# sourceMappingURL=FS.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/api_error.js":
/*!************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/api_error.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * Standard libc error codes. Add more to this enum and ErrorStrings as they are
 * needed.
 * @url http://www.gnu.org/software/libc/manual/html_node/Error-Codes.html
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["EPERM"] = 1] = "EPERM";
    ErrorCode[ErrorCode["ENOENT"] = 2] = "ENOENT";
    ErrorCode[ErrorCode["EIO"] = 5] = "EIO";
    ErrorCode[ErrorCode["EBADF"] = 9] = "EBADF";
    ErrorCode[ErrorCode["EACCES"] = 13] = "EACCES";
    ErrorCode[ErrorCode["EBUSY"] = 16] = "EBUSY";
    ErrorCode[ErrorCode["EEXIST"] = 17] = "EEXIST";
    ErrorCode[ErrorCode["ENOTDIR"] = 20] = "ENOTDIR";
    ErrorCode[ErrorCode["EISDIR"] = 21] = "EISDIR";
    ErrorCode[ErrorCode["EINVAL"] = 22] = "EINVAL";
    ErrorCode[ErrorCode["EFBIG"] = 27] = "EFBIG";
    ErrorCode[ErrorCode["ENOSPC"] = 28] = "ENOSPC";
    ErrorCode[ErrorCode["EROFS"] = 30] = "EROFS";
    ErrorCode[ErrorCode["ENOTEMPTY"] = 39] = "ENOTEMPTY";
    ErrorCode[ErrorCode["ENOTSUP"] = 95] = "ENOTSUP";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
/* tslint:disable:variable-name */
/**
 * Strings associated with each error code.
 * @hidden
 */
exports.ErrorStrings = {};
exports.ErrorStrings[ErrorCode.EPERM] = 'Operation not permitted.';
exports.ErrorStrings[ErrorCode.ENOENT] = 'No such file or directory.';
exports.ErrorStrings[ErrorCode.EIO] = 'Input/output error.';
exports.ErrorStrings[ErrorCode.EBADF] = 'Bad file descriptor.';
exports.ErrorStrings[ErrorCode.EACCES] = 'Permission denied.';
exports.ErrorStrings[ErrorCode.EBUSY] = 'Resource busy or locked.';
exports.ErrorStrings[ErrorCode.EEXIST] = 'File exists.';
exports.ErrorStrings[ErrorCode.ENOTDIR] = 'File is not a directory.';
exports.ErrorStrings[ErrorCode.EISDIR] = 'File is a directory.';
exports.ErrorStrings[ErrorCode.EINVAL] = 'Invalid argument.';
exports.ErrorStrings[ErrorCode.EFBIG] = 'File is too big.';
exports.ErrorStrings[ErrorCode.ENOSPC] = 'No space left on disk.';
exports.ErrorStrings[ErrorCode.EROFS] = 'Cannot modify a read-only file system.';
exports.ErrorStrings[ErrorCode.ENOTEMPTY] = 'Directory is not empty.';
exports.ErrorStrings[ErrorCode.ENOTSUP] = 'Operation is not supported.';
/* tslint:enable:variable-name */
/**
 * Represents a BrowserFS error. Passed back to applications after a failed
 * call to the BrowserFS API.
 */
var ApiError = (function (_super) {
    __extends(ApiError, _super);
    /**
     * Represents a BrowserFS error. Passed back to applications after a failed
     * call to the BrowserFS API.
     *
     * Error codes mirror those returned by regular Unix file operations, which is
     * what Node returns.
     * @constructor ApiError
     * @param type The type of the error.
     * @param [message] A descriptive error message.
     */
    function ApiError(type, message, path) {
        if (message === void 0) { message = exports.ErrorStrings[type]; }
        var _this = _super.call(this, message) || this;
        // Unsupported.
        _this.syscall = "";
        _this.errno = type;
        _this.code = ErrorCode[type];
        _this.path = path;
        _this.stack = new Error().stack;
        _this.message = "Error: " + _this.code + ": " + message + (_this.path ? ", '" + _this.path + "'" : '');
        return _this;
    }
    ApiError.fromJSON = function (json) {
        var err = new ApiError(0);
        err.errno = json.errno;
        err.code = json.code;
        err.path = json.path;
        err.stack = json.stack;
        err.message = json.message;
        return err;
    };
    /**
     * Creates an ApiError object from a buffer.
     */
    ApiError.fromBuffer = function (buffer, i) {
        if (i === void 0) { i = 0; }
        return ApiError.fromJSON(JSON.parse(buffer.toString('utf8', i + 4, i + 4 + buffer.readUInt32LE(i))));
    };
    ApiError.FileError = function (code, p) {
        return new ApiError(code, exports.ErrorStrings[code], p);
    };
    ApiError.ENOENT = function (path) {
        return this.FileError(ErrorCode.ENOENT, path);
    };
    ApiError.EEXIST = function (path) {
        return this.FileError(ErrorCode.EEXIST, path);
    };
    ApiError.EISDIR = function (path) {
        return this.FileError(ErrorCode.EISDIR, path);
    };
    ApiError.ENOTDIR = function (path) {
        return this.FileError(ErrorCode.ENOTDIR, path);
    };
    ApiError.EPERM = function (path) {
        return this.FileError(ErrorCode.EPERM, path);
    };
    ApiError.ENOTEMPTY = function (path) {
        return this.FileError(ErrorCode.ENOTEMPTY, path);
    };
    /**
     * @return A friendly error message.
     */
    ApiError.prototype.toString = function () {
        return this.message;
    };
    ApiError.prototype.toJSON = function () {
        return {
            errno: this.errno,
            code: this.code,
            path: this.path,
            stack: this.stack,
            message: this.message
        };
    };
    /**
     * Writes the API error into a buffer.
     */
    ApiError.prototype.writeToBuffer = function (buffer, i) {
        if (buffer === void 0) { buffer = Buffer.alloc(this.bufferSize()); }
        if (i === void 0) { i = 0; }
        var bytesWritten = buffer.write(JSON.stringify(this.toJSON()), i + 4);
        buffer.writeUInt32LE(bytesWritten, i);
        return buffer;
    };
    /**
     * The size of the API error in buffer-form in bytes.
     */
    ApiError.prototype.bufferSize = function () {
        // 4 bytes for string length.
        return 4 + Buffer.byteLength(JSON.stringify(this.toJSON()));
    };
    return ApiError;
}(Error));
exports.ApiError = ApiError;
//# sourceMappingURL=api_error.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/file.js":
/*!*******************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/file.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.__esModule = true;
var api_error_1 = __webpack_require__(/*! ./api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
/**
 * Base class that contains shared implementations of functions for the file
 * object.
 */
var BaseFile = (function () {
    function BaseFile() {
    }
    BaseFile.prototype.sync = function (cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFile.prototype.syncSync = function () {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFile.prototype.datasync = function (cb) {
        this.sync(cb);
    };
    BaseFile.prototype.datasyncSync = function () {
        return this.syncSync();
    };
    BaseFile.prototype.chown = function (uid, gid, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFile.prototype.chownSync = function (uid, gid) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFile.prototype.chmod = function (mode, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFile.prototype.chmodSync = function (mode) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFile.prototype.utimes = function (atime, mtime, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFile.prototype.utimesSync = function (atime, mtime) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    return BaseFile;
}());
exports.BaseFile = BaseFile;
//# sourceMappingURL=file.js.map

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/file_flag.js":
/*!************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/file_flag.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.__esModule = true;
var api_error_1 = __webpack_require__(/*! ./api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var ActionType;
(function (ActionType) {
    // Indicates that the code should not do anything.
    ActionType[ActionType["NOP"] = 0] = "NOP";
    // Indicates that the code should throw an exception.
    ActionType[ActionType["THROW_EXCEPTION"] = 1] = "THROW_EXCEPTION";
    // Indicates that the code should truncate the file, but only if it is a file.
    ActionType[ActionType["TRUNCATE_FILE"] = 2] = "TRUNCATE_FILE";
    // Indicates that the code should create the file.
    ActionType[ActionType["CREATE_FILE"] = 3] = "CREATE_FILE";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
/**
 * Represents one of the following file flags. A convenience object.
 *
 * * `'r'` - Open file for reading. An exception occurs if the file does not exist.
 * * `'r+'` - Open file for reading and writing. An exception occurs if the file does not exist.
 * * `'rs'` - Open file for reading in synchronous mode. Instructs the filesystem to not cache writes.
 * * `'rs+'` - Open file for reading and writing, and opens the file in synchronous mode.
 * * `'w'` - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
 * * `'wx'` - Like 'w' but opens the file in exclusive mode.
 * * `'w+'` - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
 * * `'wx+'` - Like 'w+' but opens the file in exclusive mode.
 * * `'a'` - Open file for appending. The file is created if it does not exist.
 * * `'ax'` - Like 'a' but opens the file in exclusive mode.
 * * `'a+'` - Open file for reading and appending. The file is created if it does not exist.
 * * `'ax+'` - Like 'a+' but opens the file in exclusive mode.
 *
 * Exclusive mode ensures that the file path is newly created.
 */
var FileFlag = (function () {
    /**
     * This should never be called directly.
     * @param modeStr The string representing the mode
     * @throw when the mode string is invalid
     */
    function FileFlag(flagStr) {
        this.flagStr = flagStr;
        if (FileFlag.validFlagStrs.indexOf(flagStr) < 0) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "Invalid flag: " + flagStr);
        }
    }
    /**
     * Get an object representing the given file flag.
     * @param modeStr The string representing the flag
     * @return The FileFlag object representing the flag
     * @throw when the flag string is invalid
     */
    FileFlag.getFileFlag = function (flagStr) {
        // Check cache first.
        if (FileFlag.flagCache.hasOwnProperty(flagStr)) {
            return FileFlag.flagCache[flagStr];
        }
        return FileFlag.flagCache[flagStr] = new FileFlag(flagStr);
    };
    /**
     * Get the underlying flag string for this flag.
     */
    FileFlag.prototype.getFlagString = function () {
        return this.flagStr;
    };
    /**
     * Returns true if the file is readable.
     */
    FileFlag.prototype.isReadable = function () {
        return this.flagStr.indexOf('r') !== -1 || this.flagStr.indexOf('+') !== -1;
    };
    /**
     * Returns true if the file is writeable.
     */
    FileFlag.prototype.isWriteable = function () {
        return this.flagStr.indexOf('w') !== -1 || this.flagStr.indexOf('a') !== -1 || this.flagStr.indexOf('+') !== -1;
    };
    /**
     * Returns true if the file mode should truncate.
     */
    FileFlag.prototype.isTruncating = function () {
        return this.flagStr.indexOf('w') !== -1;
    };
    /**
     * Returns true if the file is appendable.
     */
    FileFlag.prototype.isAppendable = function () {
        return this.flagStr.indexOf('a') !== -1;
    };
    /**
     * Returns true if the file is open in synchronous mode.
     */
    FileFlag.prototype.isSynchronous = function () {
        return this.flagStr.indexOf('s') !== -1;
    };
    /**
     * Returns true if the file is open in exclusive mode.
     */
    FileFlag.prototype.isExclusive = function () {
        return this.flagStr.indexOf('x') !== -1;
    };
    /**
     * Returns one of the static fields on this object that indicates the
     * appropriate response to the path existing.
     */
    FileFlag.prototype.pathExistsAction = function () {
        if (this.isExclusive()) {
            return ActionType.THROW_EXCEPTION;
        }
        else if (this.isTruncating()) {
            return ActionType.TRUNCATE_FILE;
        }
        else {
            return ActionType.NOP;
        }
    };
    /**
     * Returns one of the static fields on this object that indicates the
     * appropriate response to the path not existing.
     */
    FileFlag.prototype.pathNotExistsAction = function () {
        if ((this.isWriteable() || this.isAppendable()) && this.flagStr !== 'r+') {
            return ActionType.CREATE_FILE;
        }
        else {
            return ActionType.THROW_EXCEPTION;
        }
    };
    return FileFlag;
}());
// Contains cached FileMode instances.
FileFlag.flagCache = {};
// Array of valid mode strings.
FileFlag.validFlagStrs = ['r', 'r+', 'rs', 'rs+', 'w', 'wx', 'w+', 'wx+', 'a', 'ax', 'a+', 'ax+'];
exports.FileFlag = FileFlag;
//# sourceMappingURL=file_flag.js.map

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/file_system.js":
/*!**************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/file_system.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var api_error_1 = __webpack_require__(/*! ./api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var file_flag_1 = __webpack_require__(/*! ./file_flag */ "./node_modules/browserfs/dist/node/core/file_flag.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
var util_1 = __webpack_require__(/*! ./util */ "./node_modules/browserfs/dist/node/core/util.js");
/**
 * Basic filesystem class. Most filesystems should extend this class, as it
 * provides default implementations for a handful of methods.
 */
var BaseFileSystem = (function () {
    function BaseFileSystem() {
    }
    BaseFileSystem.prototype.supportsLinks = function () {
        return false;
    };
    BaseFileSystem.prototype.diskSpace = function (p, cb) {
        cb(0, 0);
    };
    /**
     * Opens the file at path p with the given flag. The file must exist.
     * @param p The path to open.
     * @param flag The flag to use when opening the file.
     */
    BaseFileSystem.prototype.openFile = function (p, flag, cb) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * Create the file at path p with the given mode. Then, open it with the given
     * flag.
     */
    BaseFileSystem.prototype.createFile = function (p, flag, mode, cb) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.open = function (p, flag, mode, cb) {
        var _this = this;
        var mustBeFile = function (e, stats) {
            if (e) {
                // File does not exist.
                switch (flag.pathNotExistsAction()) {
                    case file_flag_1.ActionType.CREATE_FILE:
                        // Ensure parent exists.
                        return _this.stat(path.dirname(p), false, function (e, parentStats) {
                            if (e) {
                                cb(e);
                            }
                            else if (parentStats && !parentStats.isDirectory()) {
                                cb(api_error_1.ApiError.ENOTDIR(path.dirname(p)));
                            }
                            else {
                                _this.createFile(p, flag, mode, cb);
                            }
                        });
                    case file_flag_1.ActionType.THROW_EXCEPTION:
                        return cb(api_error_1.ApiError.ENOENT(p));
                    default:
                        return cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid FileFlag object.'));
                }
            }
            else {
                // File exists.
                if (stats && stats.isDirectory()) {
                    return cb(api_error_1.ApiError.EISDIR(p));
                }
                switch (flag.pathExistsAction()) {
                    case file_flag_1.ActionType.THROW_EXCEPTION:
                        return cb(api_error_1.ApiError.EEXIST(p));
                    case file_flag_1.ActionType.TRUNCATE_FILE:
                        // NOTE: In a previous implementation, we deleted the file and
                        // re-created it. However, this created a race condition if another
                        // asynchronous request was trying to read the file, as the file
                        // would not exist for a small period of time.
                        return _this.openFile(p, flag, function (e, fd) {
                            if (e) {
                                cb(e);
                            }
                            else if (fd) {
                                fd.truncate(0, function () {
                                    fd.sync(function () {
                                        cb(null, fd);
                                    });
                                });
                            }
                            else {
                                util_1.fail();
                            }
                        });
                    case file_flag_1.ActionType.NOP:
                        return _this.openFile(p, flag, cb);
                    default:
                        return cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid FileFlag object.'));
                }
            }
        };
        this.stat(p, false, mustBeFile);
    };
    BaseFileSystem.prototype.rename = function (oldPath, newPath, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.renameSync = function (oldPath, newPath) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.stat = function (p, isLstat, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.statSync = function (p, isLstat) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * Opens the file at path p with the given flag. The file must exist.
     * @param p The path to open.
     * @param flag The flag to use when opening the file.
     * @return A File object corresponding to the opened file.
     */
    BaseFileSystem.prototype.openFileSync = function (p, flag, mode) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * Create the file at path p with the given mode. Then, open it with the given
     * flag.
     */
    BaseFileSystem.prototype.createFileSync = function (p, flag, mode) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.openSync = function (p, flag, mode) {
        // Check if the path exists, and is a file.
        var stats;
        try {
            stats = this.statSync(p, false);
        }
        catch (e) {
            // File does not exist.
            switch (flag.pathNotExistsAction()) {
                case file_flag_1.ActionType.CREATE_FILE:
                    // Ensure parent exists.
                    var parentStats = this.statSync(path.dirname(p), false);
                    if (!parentStats.isDirectory()) {
                        throw api_error_1.ApiError.ENOTDIR(path.dirname(p));
                    }
                    return this.createFileSync(p, flag, mode);
                case file_flag_1.ActionType.THROW_EXCEPTION:
                    throw api_error_1.ApiError.ENOENT(p);
                default:
                    throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid FileFlag object.');
            }
        }
        // File exists.
        if (stats.isDirectory()) {
            throw api_error_1.ApiError.EISDIR(p);
        }
        switch (flag.pathExistsAction()) {
            case file_flag_1.ActionType.THROW_EXCEPTION:
                throw api_error_1.ApiError.EEXIST(p);
            case file_flag_1.ActionType.TRUNCATE_FILE:
                // Delete file.
                this.unlinkSync(p);
                // Create file. Use the same mode as the old file.
                // Node itself modifies the ctime when this occurs, so this action
                // will preserve that behavior if the underlying file system
                // supports those properties.
                return this.createFileSync(p, flag, stats.mode);
            case file_flag_1.ActionType.NOP:
                return this.openFileSync(p, flag, mode);
            default:
                throw new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, 'Invalid FileFlag object.');
        }
    };
    BaseFileSystem.prototype.unlink = function (p, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.unlinkSync = function (p) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.rmdir = function (p, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.rmdirSync = function (p) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.mkdir = function (p, mode, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.mkdirSync = function (p, mode) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.readdir = function (p, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.readdirSync = function (p) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.exists = function (p, cb) {
        this.stat(p, null, function (err) {
            cb(!err);
        });
    };
    BaseFileSystem.prototype.existsSync = function (p) {
        try {
            this.statSync(p, true);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    BaseFileSystem.prototype.realpath = function (p, cache, cb) {
        if (this.supportsLinks()) {
            // The path could contain symlinks. Split up the path,
            // resolve any symlinks, return the resolved string.
            var splitPath = p.split(path.sep);
            // TODO: Simpler to just pass through file, find sep and such.
            for (var i = 0; i < splitPath.length; i++) {
                var addPaths = splitPath.slice(0, i + 1);
                splitPath[i] = path.join.apply(null, addPaths);
            }
        }
        else {
            // No symlinks. We just need to verify that it exists.
            this.exists(p, function (doesExist) {
                if (doesExist) {
                    cb(null, p);
                }
                else {
                    cb(api_error_1.ApiError.ENOENT(p));
                }
            });
        }
    };
    BaseFileSystem.prototype.realpathSync = function (p, cache) {
        if (this.supportsLinks()) {
            // The path could contain symlinks. Split up the path,
            // resolve any symlinks, return the resolved string.
            var splitPath = p.split(path.sep);
            // TODO: Simpler to just pass through file, find sep and such.
            for (var i = 0; i < splitPath.length; i++) {
                var addPaths = splitPath.slice(0, i + 1);
                splitPath[i] = path.join.apply(path, addPaths);
            }
            return splitPath.join(path.sep);
        }
        else {
            // No symlinks. We just need to verify that it exists.
            if (this.existsSync(p)) {
                return p;
            }
            else {
                throw api_error_1.ApiError.ENOENT(p);
            }
        }
    };
    BaseFileSystem.prototype.truncate = function (p, len, cb) {
        this.open(p, file_flag_1.FileFlag.getFileFlag('r+'), 0x1a4, (function (er, fd) {
            if (er) {
                return cb(er);
            }
            fd.truncate(len, (function (er) {
                fd.close((function (er2) {
                    cb(er || er2);
                }));
            }));
        }));
    };
    BaseFileSystem.prototype.truncateSync = function (p, len) {
        var fd = this.openSync(p, file_flag_1.FileFlag.getFileFlag('r+'), 0x1a4);
        // Need to safely close FD, regardless of whether or not truncate succeeds.
        try {
            fd.truncateSync(len);
        }
        catch (e) {
            throw e;
        }
        finally {
            fd.closeSync();
        }
    };
    BaseFileSystem.prototype.readFile = function (fname, encoding, flag, cb) {
        // Wrap cb in file closing code.
        var oldCb = cb;
        // Get file.
        this.open(fname, flag, 0x1a4, function (err, fd) {
            if (err) {
                return cb(err);
            }
            cb = function (err, arg) {
                fd.close(function (err2) {
                    if (!err) {
                        err = err2;
                    }
                    return oldCb(err, arg);
                });
            };
            fd.stat(function (err, stat) {
                if (err) {
                    return cb(err);
                }
                // Allocate buffer.
                var buf = Buffer.alloc(stat.size);
                fd.read(buf, 0, stat.size, 0, function (err) {
                    if (err) {
                        return cb(err);
                    }
                    else if (encoding === null) {
                        return cb(err, buf);
                    }
                    try {
                        cb(null, buf.toString(encoding));
                    }
                    catch (e) {
                        cb(e);
                    }
                });
            });
        });
    };
    BaseFileSystem.prototype.readFileSync = function (fname, encoding, flag) {
        // Get file.
        var fd = this.openSync(fname, flag, 0x1a4);
        try {
            var stat = fd.statSync();
            // Allocate buffer.
            var buf = Buffer.alloc(stat.size);
            fd.readSync(buf, 0, stat.size, 0);
            fd.closeSync();
            if (encoding === null) {
                return buf;
            }
            return buf.toString(encoding);
        }
        finally {
            fd.closeSync();
        }
    };
    BaseFileSystem.prototype.writeFile = function (fname, data, encoding, flag, mode, cb) {
        // Wrap cb in file closing code.
        var oldCb = cb;
        // Get file.
        this.open(fname, flag, 0x1a4, function (err, fd) {
            if (err) {
                return cb(err);
            }
            cb = function (err) {
                fd.close(function (err2) {
                    oldCb(err ? err : err2);
                });
            };
            try {
                if (typeof data === 'string') {
                    data = Buffer.from(data, encoding);
                }
            }
            catch (e) {
                return cb(e);
            }
            // Write into file.
            fd.write(data, 0, data.length, 0, cb);
        });
    };
    BaseFileSystem.prototype.writeFileSync = function (fname, data, encoding, flag, mode) {
        // Get file.
        var fd = this.openSync(fname, flag, mode);
        try {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            // Write into file.
            fd.writeSync(data, 0, data.length, 0);
        }
        finally {
            fd.closeSync();
        }
    };
    BaseFileSystem.prototype.appendFile = function (fname, data, encoding, flag, mode, cb) {
        // Wrap cb in file closing code.
        var oldCb = cb;
        this.open(fname, flag, mode, function (err, fd) {
            if (err) {
                return cb(err);
            }
            cb = function (err) {
                fd.close(function (err2) {
                    oldCb(err ? err : err2);
                });
            };
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            fd.write(data, 0, data.length, null, cb);
        });
    };
    BaseFileSystem.prototype.appendFileSync = function (fname, data, encoding, flag, mode) {
        var fd = this.openSync(fname, flag, mode);
        try {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            fd.writeSync(data, 0, data.length, null);
        }
        finally {
            fd.closeSync();
        }
    };
    BaseFileSystem.prototype.chmod = function (p, isLchmod, mode, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.chmodSync = function (p, isLchmod, mode) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.chown = function (p, isLchown, uid, gid, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.chownSync = function (p, isLchown, uid, gid) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.utimes = function (p, atime, mtime, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.utimesSync = function (p, atime, mtime) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.link = function (srcpath, dstpath, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.linkSync = function (srcpath, dstpath) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.symlink = function (srcpath, dstpath, type, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.symlinkSync = function (srcpath, dstpath, type) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    BaseFileSystem.prototype.readlink = function (p, cb) {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP));
    };
    BaseFileSystem.prototype.readlinkSync = function (p) {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    return BaseFileSystem;
}());
exports.BaseFileSystem = BaseFileSystem;
/**
 * Implements the asynchronous API in terms of the synchronous API.
 * @class SynchronousFileSystem
 */
var SynchronousFileSystem = (function (_super) {
    __extends(SynchronousFileSystem, _super);
    function SynchronousFileSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SynchronousFileSystem.prototype.supportsSynch = function () {
        return true;
    };
    SynchronousFileSystem.prototype.rename = function (oldPath, newPath, cb) {
        try {
            this.renameSync(oldPath, newPath);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.stat = function (p, isLstat, cb) {
        try {
            cb(null, this.statSync(p, isLstat));
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.open = function (p, flags, mode, cb) {
        try {
            cb(null, this.openSync(p, flags, mode));
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.unlink = function (p, cb) {
        try {
            this.unlinkSync(p);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.rmdir = function (p, cb) {
        try {
            this.rmdirSync(p);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.mkdir = function (p, mode, cb) {
        try {
            this.mkdirSync(p, mode);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.readdir = function (p, cb) {
        try {
            cb(null, this.readdirSync(p));
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.chmod = function (p, isLchmod, mode, cb) {
        try {
            this.chmodSync(p, isLchmod, mode);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.chown = function (p, isLchown, uid, gid, cb) {
        try {
            this.chownSync(p, isLchown, uid, gid);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.utimes = function (p, atime, mtime, cb) {
        try {
            this.utimesSync(p, atime, mtime);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.link = function (srcpath, dstpath, cb) {
        try {
            this.linkSync(srcpath, dstpath);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.symlink = function (srcpath, dstpath, type, cb) {
        try {
            this.symlinkSync(srcpath, dstpath, type);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    SynchronousFileSystem.prototype.readlink = function (p, cb) {
        try {
            cb(null, this.readlinkSync(p));
        }
        catch (e) {
            cb(e);
        }
    };
    return SynchronousFileSystem;
}(BaseFileSystem));
exports.SynchronousFileSystem = SynchronousFileSystem;
//# sourceMappingURL=file_system.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/global.js":
/*!*********************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/global.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {exports.__esModule = true;
/**
 * @hidden
 */
var toExport;
if (typeof (window) !== 'undefined') {
    toExport = window;
}
else if (typeof (self) !== 'undefined') {
    toExport = self;
}
else {
    toExport = global;
}
exports["default"] = toExport;
//# sourceMappingURL=global.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/levenshtein.js":
/*!**************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/levenshtein.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * Levenshtein distance, from the `js-levenshtein` NPM module.
 * Copied here to avoid complexity of adding another CommonJS module dependency.
 */
exports.__esModule = true;
function _min(d0, d1, d2, bx, ay) {
    return d0 < d1 || d2 < d1
        ? d0 > d2
            ? d2 + 1
            : d0 + 1
        : bx === ay
            ? d1
            : d1 + 1;
}
/**
 * Calculates levenshtein distance.
 * @param a
 * @param b
 */
function levenshtein(a, b) {
    if (a === b) {
        return 0;
    }
    if (a.length > b.length) {
        var tmp = a;
        a = b;
        b = tmp;
    }
    var la = a.length;
    var lb = b.length;
    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
        la--;
        lb--;
    }
    var offset = 0;
    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
        offset++;
    }
    la -= offset;
    lb -= offset;
    if (la === 0 || lb === 1) {
        return lb;
    }
    var vector = new Array(la << 1);
    for (var y = 0; y < la;) {
        vector[la + y] = a.charCodeAt(offset + y);
        vector[y] = ++y;
    }
    var x;
    var d0;
    var d1;
    var d2;
    var d3;
    for (x = 0; (x + 3) < lb;) {
        var bx0 = b.charCodeAt(offset + (d0 = x));
        var bx1 = b.charCodeAt(offset + (d1 = x + 1));
        var bx2 = b.charCodeAt(offset + (d2 = x + 2));
        var bx3 = b.charCodeAt(offset + (d3 = x + 3));
        var dd_1 = (x += 4);
        for (var y = 0; y < la;) {
            var ay = vector[la + y];
            var dy = vector[y];
            d0 = _min(dy, d0, d1, bx0, ay);
            d1 = _min(d0, d1, d2, bx1, ay);
            d2 = _min(d1, d2, d3, bx2, ay);
            dd_1 = _min(d2, d3, dd_1, bx3, ay);
            vector[y++] = dd_1;
            d3 = d2;
            d2 = d1;
            d1 = d0;
            d0 = dy;
        }
    }
    var dd = 0;
    for (; x < lb;) {
        var bx0 = b.charCodeAt(offset + (d0 = x));
        dd = ++x;
        for (var y = 0; y < la; y++) {
            var dy = vector[y];
            vector[y] = dd = dy < d0 || dd < d0
                ? dy > dd ? dd + 1 : dy + 1
                : bx0 === vector[la + y]
                    ? d0
                    : d0 + 1;
            d0 = dy;
        }
    }
    return dd;
}
exports["default"] = levenshtein;
//# sourceMappingURL=levenshtein.js.map

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/node_fs.js":
/*!**********************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/node_fs.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.__esModule = true;
var FS_1 = __webpack_require__(/*! ./FS */ "./node_modules/browserfs/dist/node/core/FS.js");
// Manually export the individual public functions of fs.
// Required because some code will invoke functions off of the module.
// e.g.:
// let writeFile = fs.writeFile;
// writeFile(...)
/**
 * @hidden
 */
var fs = new FS_1["default"]();
/**
 * @hidden
 */
var _fsMock = {};
/**
 * @hidden
 */
var fsProto = FS_1["default"].prototype;
Object.keys(fsProto).forEach(function (key) {
    if (typeof fs[key] === 'function') {
        _fsMock[key] = function () {
            return fs[key].apply(fs, arguments);
        };
    }
    else {
        _fsMock[key] = fs[key];
    }
});
_fsMock['changeFSModule'] = function (newFs) {
    fs = newFs;
};
_fsMock['getFSModule'] = function () {
    return fs;
};
_fsMock['FS'] = FS_1["default"];
exports["default"] = _fsMock;
//# sourceMappingURL=node_fs.js.map

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/node_fs_stats.js":
/*!****************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/node_fs_stats.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {exports.__esModule = true;
/**
 * Indicates the type of the given file. Applied to 'mode'.
 */
var FileType;
(function (FileType) {
    FileType[FileType["FILE"] = 32768] = "FILE";
    FileType[FileType["DIRECTORY"] = 16384] = "DIRECTORY";
    FileType[FileType["SYMLINK"] = 40960] = "SYMLINK";
})(FileType = exports.FileType || (exports.FileType = {}));
/**
 * Emulation of Node's `fs.Stats` object.
 *
 * Attribute descriptions are from `man 2 stat'
 * @see http://nodejs.org/api/fs.html#fs_class_fs_stats
 * @see http://man7.org/linux/man-pages/man2/stat.2.html
 */
var Stats = (function () {
    /**
     * Provides information about a particular entry in the file system.
     * @param [Number] item_type type of the item (FILE, DIRECTORY, SYMLINK, or SOCKET)
     * @param [Number] size Size of the item in bytes. For directories/symlinks,
     *   this is normally the size of the struct that represents the item.
     * @param [Number] mode Unix-style file mode (e.g. 0o644)
     * @param [Date?] atime time of last access
     * @param [Date?] mtime time of last modification
     * @param [Date?] ctime time of creation
     */
    function Stats(itemType, size, mode, atime, mtime, ctime) {
        if (atime === void 0) { atime = new Date(); }
        if (mtime === void 0) { mtime = new Date(); }
        if (ctime === void 0) { ctime = new Date(); }
        this.size = size;
        this.atime = atime;
        this.mtime = mtime;
        this.ctime = ctime;
        /**
         * UNSUPPORTED ATTRIBUTES
         * I assume no one is going to need these details, although we could fake
         * appropriate values if need be.
         */
        // ID of device containing file
        this.dev = 0;
        // inode number
        this.ino = 0;
        // device ID (if special file)
        this.rdev = 0;
        // number of hard links
        this.nlink = 1;
        // blocksize for file system I/O
        this.blksize = 4096;
        // @todo Maybe support these? atm, it's a one-user filesystem.
        // user ID of owner
        this.uid = 0;
        // group ID of owner
        this.gid = 0;
        // time file was created (currently unsupported)
        this.birthtime = new Date(0);
        // XXX: Some file systems stash data on stats objects.
        this.fileData = null;
        if (!mode) {
            switch (itemType) {
                case FileType.FILE:
                    this.mode = 0x1a4;
                    break;
                case FileType.DIRECTORY:
                default:
                    this.mode = 0x1ff;
            }
        }
        else {
            this.mode = mode;
        }
        // number of 512B blocks allocated
        this.blocks = Math.ceil(size / 512);
        // Check if mode also includes top-most bits, which indicate the file's
        // type.
        if (this.mode < 0x1000) {
            this.mode |= itemType;
        }
    }
    Stats.fromBuffer = function (buffer) {
        var size = buffer.readUInt32LE(0), mode = buffer.readUInt32LE(4), atime = buffer.readDoubleLE(8), mtime = buffer.readDoubleLE(16), ctime = buffer.readDoubleLE(24);
        return new Stats(mode & 0xF000, size, mode & 0xFFF, new Date(atime), new Date(mtime), new Date(ctime));
    };
    Stats.prototype.toBuffer = function () {
        var buffer = Buffer.alloc(32);
        buffer.writeUInt32LE(this.size, 0);
        buffer.writeUInt32LE(this.mode, 4);
        buffer.writeDoubleLE(this.atime.getTime(), 8);
        buffer.writeDoubleLE(this.mtime.getTime(), 16);
        buffer.writeDoubleLE(this.ctime.getTime(), 24);
        return buffer;
    };
    /**
     * **Nonstandard**: Clone the stats object.
     * @return [BrowserFS.node.fs.Stats]
     */
    Stats.prototype.clone = function () {
        return new Stats(this.mode & 0xF000, this.size, this.mode & 0xFFF, this.atime, this.mtime, this.ctime);
    };
    /**
     * @return [Boolean] True if this item is a file.
     */
    Stats.prototype.isFile = function () {
        return (this.mode & 0xF000) === FileType.FILE;
    };
    /**
     * @return [Boolean] True if this item is a directory.
     */
    Stats.prototype.isDirectory = function () {
        return (this.mode & 0xF000) === FileType.DIRECTORY;
    };
    /**
     * @return [Boolean] True if this item is a symbolic link (only valid through lstat)
     */
    Stats.prototype.isSymbolicLink = function () {
        return (this.mode & 0xF000) === FileType.SYMLINK;
    };
    /**
     * Change the mode of the file. We use this helper function to prevent messing
     * up the type of the file, which is encoded in mode.
     */
    Stats.prototype.chmod = function (mode) {
        this.mode = (this.mode & 0xF000) | mode;
    };
    // We don't support the following types of files.
    Stats.prototype.isSocket = function () {
        return false;
    };
    Stats.prototype.isBlockDevice = function () {
        return false;
    };
    Stats.prototype.isCharacterDevice = function () {
        return false;
    };
    Stats.prototype.isFIFO = function () {
        return false;
    };
    return Stats;
}());
exports["default"] = Stats;
//# sourceMappingURL=node_fs_stats.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/util.js":
/*!*******************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/util.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {exports.__esModule = true;
var api_error_1 = __webpack_require__(/*! ./api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var levenshtein_1 = __webpack_require__(/*! ./levenshtein */ "./node_modules/browserfs/dist/node/core/levenshtein.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
function deprecationMessage(print, fsName, opts) {
    if (print) {
        console.warn("[" + fsName + "] Direct file system constructor usage is deprecated for this file system, and will be removed in the next major version. Please use the '" + fsName + ".Create(" + JSON.stringify(opts) + ", callback)' method instead. See https://github.com/jvilk/BrowserFS/issues/176 for more details.");
    }
}
exports.deprecationMessage = deprecationMessage;
/**
 * Checks for any IE version, including IE11 which removed MSIE from the
 * userAgent string.
 * @hidden
 */
exports.isIE = typeof navigator !== "undefined" && !!(/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || navigator.userAgent.indexOf('Trident') !== -1);
/**
 * Check if we're in a web worker.
 * @hidden
 */
exports.isWebWorker = typeof window === "undefined";
/**
 * Throws an exception. Called on code paths that should be impossible.
 * @hidden
 */
function fail() {
    throw new Error("BFS has reached an impossible code path; please file a bug.");
}
exports.fail = fail;
/**
 * Synchronous recursive makedir.
 * @hidden
 */
function mkdirpSync(p, mode, fs) {
    if (!fs.existsSync(p)) {
        mkdirpSync(path.dirname(p), mode, fs);
        fs.mkdirSync(p, mode);
    }
}
exports.mkdirpSync = mkdirpSync;
/**
 * Converts a buffer into an array buffer. Attempts to do so in a
 * zero-copy manner, e.g. the array references the same memory.
 * @hidden
 */
function buffer2ArrayBuffer(buff) {
    var u8 = buffer2Uint8array(buff), u8offset = u8.byteOffset, u8Len = u8.byteLength;
    if (u8offset === 0 && u8Len === u8.buffer.byteLength) {
        return u8.buffer;
    }
    else {
        return u8.buffer.slice(u8offset, u8offset + u8Len);
    }
}
exports.buffer2ArrayBuffer = buffer2ArrayBuffer;
/**
 * Converts a buffer into a Uint8Array. Attempts to do so in a
 * zero-copy manner, e.g. the array references the same memory.
 * @hidden
 */
function buffer2Uint8array(buff) {
    if (buff instanceof Uint8Array) {
        // BFS & Node v4.0 buffers *are* Uint8Arrays.
        return buff;
    }
    else {
        // Uint8Arrays can be constructed from arrayish numbers.
        // At this point, we assume this isn't a BFS array.
        return new Uint8Array(buff);
    }
}
exports.buffer2Uint8array = buffer2Uint8array;
/**
 * Converts the given arrayish object into a Buffer. Attempts to
 * be zero-copy.
 * @hidden
 */
function arrayish2Buffer(arr) {
    if (arr instanceof Buffer) {
        return arr;
    }
    else if (arr instanceof Uint8Array) {
        return uint8Array2Buffer(arr);
    }
    else {
        return Buffer.from(arr);
    }
}
exports.arrayish2Buffer = arrayish2Buffer;
/**
 * Converts the given Uint8Array into a Buffer. Attempts to be zero-copy.
 * @hidden
 */
function uint8Array2Buffer(u8) {
    if (u8 instanceof Buffer) {
        return u8;
    }
    else if (u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength) {
        return arrayBuffer2Buffer(u8.buffer);
    }
    else {
        return Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength);
    }
}
exports.uint8Array2Buffer = uint8Array2Buffer;
/**
 * Converts the given array buffer into a Buffer. Attempts to be
 * zero-copy.
 * @hidden
 */
function arrayBuffer2Buffer(ab) {
    return Buffer.from(ab);
}
exports.arrayBuffer2Buffer = arrayBuffer2Buffer;
/**
 * Copies a slice of the given buffer
 * @hidden
 */
function copyingSlice(buff, start, end) {
    if (start === void 0) { start = 0; }
    if (end === void 0) { end = buff.length; }
    if (start < 0 || end < 0 || end > buff.length || start > end) {
        throw new TypeError("Invalid slice bounds on buffer of length " + buff.length + ": [" + start + ", " + end + "]");
    }
    if (buff.length === 0) {
        // Avoid s0 corner case in ArrayBuffer case.
        return emptyBuffer();
    }
    else {
        var u8 = buffer2Uint8array(buff), s0 = buff[0], newS0 = (s0 + 1) % 0xFF;
        buff[0] = newS0;
        if (u8[0] === newS0) {
            // Same memory. Revert & copy.
            u8[0] = s0;
            return uint8Array2Buffer(u8.slice(start, end));
        }
        else {
            // Revert.
            buff[0] = s0;
            return uint8Array2Buffer(u8.subarray(start, end));
        }
    }
}
exports.copyingSlice = copyingSlice;
/**
 * @hidden
 */
var emptyBuff = null;
/**
 * Returns an empty buffer.
 * @hidden
 */
function emptyBuffer() {
    if (emptyBuff) {
        return emptyBuff;
    }
    return emptyBuff = Buffer.alloc(0);
}
exports.emptyBuffer = emptyBuffer;
/**
 * Option validator for a Buffer file system option.
 * @hidden
 */
function bufferValidator(v, cb) {
    if (Buffer.isBuffer(v)) {
        cb();
    }
    else {
        cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "option must be a Buffer."));
    }
}
exports.bufferValidator = bufferValidator;
/**
 * Checks that the given options object is valid for the file system options.
 * @hidden
 */
function checkOptions(fsType, opts, cb) {
    var optsInfo = fsType.Options;
    var fsName = fsType.Name;
    var pendingValidators = 0;
    var callbackCalled = false;
    var loopEnded = false;
    function validatorCallback(e) {
        if (!callbackCalled) {
            if (e) {
                callbackCalled = true;
                cb(e);
            }
            pendingValidators--;
            if (pendingValidators === 0 && loopEnded) {
                cb();
            }
        }
    }
    var _loop_1 = function (optName) {
        if (optsInfo.hasOwnProperty(optName)) {
            var opt = optsInfo[optName];
            var providedValue = opts[optName];
            if (providedValue === undefined || providedValue === null) {
                if (!opt.optional) {
                    // Required option, not provided.
                    // Any incorrect options provided? Which ones are close to the provided one?
                    // (edit distance 5 === close)
                    var incorrectOptions = Object.keys(opts).filter(function (o) { return !(o in optsInfo); }).map(function (a) {
                        return { str: a, distance: levenshtein_1["default"](optName, a) };
                    }).filter(function (o) { return o.distance < 5; }).sort(function (a, b) { return a.distance - b.distance; });
                    // Validators may be synchronous.
                    if (callbackCalled) {
                        return { value: void 0 };
                    }
                    callbackCalled = true;
                    return { value: cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "[" + fsName + "] Required option '" + optName + "' not provided." + (incorrectOptions.length > 0 ? " You provided unrecognized option '" + incorrectOptions[0].str + "'; perhaps you meant to type '" + optName + "'." : '') + "\nOption description: " + opt.description)) };
                }
                // Else: Optional option, not provided. That is OK.
            }
            else {
                // Option provided! Check type.
                var typeMatches = false;
                if (Array.isArray(opt.type)) {
                    typeMatches = opt.type.indexOf(typeof (providedValue)) !== -1;
                }
                else {
                    typeMatches = typeof (providedValue) === opt.type;
                }
                if (!typeMatches) {
                    // Validators may be synchronous.
                    if (callbackCalled) {
                        return { value: void 0 };
                    }
                    callbackCalled = true;
                    return { value: cb(new api_error_1.ApiError(api_error_1.ErrorCode.EINVAL, "[" + fsName + "] Value provided for option " + optName + " is not the proper type. Expected " + (Array.isArray(opt.type) ? "one of {" + opt.type.join(", ") + "}" : opt.type) + ", but received " + typeof (providedValue) + "\nOption description: " + opt.description)) };
                }
                else if (opt.validator) {
                    pendingValidators++;
                    opt.validator(providedValue, validatorCallback);
                }
                // Otherwise: All good!
            }
        }
    };
    // Check for required options.
    for (var optName in optsInfo) {
        var state_1 = _loop_1(optName);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    loopEnded = true;
    if (pendingValidators === 0 && !callbackCalled) {
        cb();
    }
}
exports.checkOptions = checkOptions;
//# sourceMappingURL=util.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/browserfs/dist/node/generic/inode.js":
/*!***********************************************************!*\
  !*** ./node_modules/browserfs/dist/node/generic/inode.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {exports.__esModule = true;
var node_fs_stats_1 = __webpack_require__(/*! ../core/node_fs_stats */ "./node_modules/browserfs/dist/node/core/node_fs_stats.js");
/**
 * Generic inode definition that can easily be serialized.
 */
var Inode = (function () {
    function Inode(id, size, mode, atime, mtime, ctime) {
        this.id = id;
        this.size = size;
        this.mode = mode;
        this.atime = atime;
        this.mtime = mtime;
        this.ctime = ctime;
    }
    /**
     * Converts the buffer into an Inode.
     */
    Inode.fromBuffer = function (buffer) {
        if (buffer === undefined) {
            throw new Error("NO");
        }
        return new Inode(buffer.toString('ascii', 30), buffer.readUInt32LE(0), buffer.readUInt16LE(4), buffer.readDoubleLE(6), buffer.readDoubleLE(14), buffer.readDoubleLE(22));
    };
    /**
     * Handy function that converts the Inode to a Node Stats object.
     */
    Inode.prototype.toStats = function () {
        return new node_fs_stats_1["default"]((this.mode & 0xF000) === node_fs_stats_1.FileType.DIRECTORY ? node_fs_stats_1.FileType.DIRECTORY : node_fs_stats_1.FileType.FILE, this.size, this.mode, new Date(this.atime), new Date(this.mtime), new Date(this.ctime));
    };
    /**
     * Get the size of this Inode, in bytes.
     */
    Inode.prototype.getSize = function () {
        // ASSUMPTION: ID is ASCII (1 byte per char).
        return 30 + this.id.length;
    };
    /**
     * Writes the inode into the start of the buffer.
     */
    Inode.prototype.toBuffer = function (buff) {
        if (buff === void 0) { buff = Buffer.alloc(this.getSize()); }
        buff.writeUInt32LE(this.size, 0);
        buff.writeUInt16LE(this.mode, 4);
        buff.writeDoubleLE(this.atime, 6);
        buff.writeDoubleLE(this.mtime, 14);
        buff.writeDoubleLE(this.ctime, 22);
        buff.write(this.id, 30, this.id.length, 'ascii');
        return buff;
    };
    /**
     * Updates the Inode using information from the stats object. Used by file
     * systems at sync time, e.g.:
     * - Program opens file and gets a File object.
     * - Program mutates file. File object is responsible for maintaining
     *   metadata changes locally -- typically in a Stats object.
     * - Program closes file. File object's metadata changes are synced with the
     *   file system.
     * @return True if any changes have occurred.
     */
    Inode.prototype.update = function (stats) {
        var hasChanged = false;
        if (this.size !== stats.size) {
            this.size = stats.size;
            hasChanged = true;
        }
        if (this.mode !== stats.mode) {
            this.mode = stats.mode;
            hasChanged = true;
        }
        var atimeMs = stats.atime.getTime();
        if (this.atime !== atimeMs) {
            this.atime = atimeMs;
            hasChanged = true;
        }
        var mtimeMs = stats.mtime.getTime();
        if (this.mtime !== mtimeMs) {
            this.mtime = mtimeMs;
            hasChanged = true;
        }
        var ctimeMs = stats.ctime.getTime();
        if (this.ctime !== ctimeMs) {
            this.ctime = ctimeMs;
            hasChanged = true;
        }
        return hasChanged;
    };
    // XXX: Copied from Stats. Should reconcile these two into something more
    //      compact.
    /**
     * @return [Boolean] True if this item is a file.
     */
    Inode.prototype.isFile = function () {
        return (this.mode & 0xF000) === node_fs_stats_1.FileType.FILE;
    };
    /**
     * @return [Boolean] True if this item is a directory.
     */
    Inode.prototype.isDirectory = function () {
        return (this.mode & 0xF000) === node_fs_stats_1.FileType.DIRECTORY;
    };
    return Inode;
}());
exports["default"] = Inode;
//# sourceMappingURL=inode.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/browserfs/dist/node/generic/key_value_filesystem.js":
/*!**************************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/generic/key_value_filesystem.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var file_system_1 = __webpack_require__(/*! ../core/file_system */ "./node_modules/browserfs/dist/node/core/file_system.js");
var api_error_1 = __webpack_require__(/*! ../core/api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var node_fs_stats_1 = __webpack_require__(/*! ../core/node_fs_stats */ "./node_modules/browserfs/dist/node/core/node_fs_stats.js");
var path = __webpack_require__(/*! path */ "./node_modules/path-browserify/index.js");
var inode_1 = __webpack_require__(/*! ../generic/inode */ "./node_modules/browserfs/dist/node/generic/inode.js");
var preload_file_1 = __webpack_require__(/*! ../generic/preload_file */ "./node_modules/browserfs/dist/node/generic/preload_file.js");
var util_1 = __webpack_require__(/*! ../core/util */ "./node_modules/browserfs/dist/node/core/util.js");
/**
 * @hidden
 */
var ROOT_NODE_ID = "/";
/**
 * @hidden
 */
var emptyDirNode = null;
/**
 * Returns an empty directory node.
 * @hidden
 */
function getEmptyDirNode() {
    if (emptyDirNode) {
        return emptyDirNode;
    }
    return emptyDirNode = Buffer.from("{}");
}
/**
 * Generates a random ID.
 * @hidden
 */
function GenerateRandomID() {
    // From http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * Helper function. Checks if 'e' is defined. If so, it triggers the callback
 * with 'e' and returns false. Otherwise, returns true.
 * @hidden
 */
function noError(e, cb) {
    if (e) {
        cb(e);
        return false;
    }
    return true;
}
/**
 * Helper function. Checks if 'e' is defined. If so, it aborts the transaction,
 * triggers the callback with 'e', and returns false. Otherwise, returns true.
 * @hidden
 */
function noErrorTx(e, tx, cb) {
    if (e) {
        tx.abort(function () {
            cb(e);
        });
        return false;
    }
    return true;
}
/**
 * A simple RW transaction for simple synchronous key-value stores.
 */
var SimpleSyncRWTransaction = (function () {
    function SimpleSyncRWTransaction(store) {
        this.store = store;
        /**
         * Stores data in the keys we modify prior to modifying them.
         * Allows us to roll back commits.
         */
        this.originalData = {};
        /**
         * List of keys modified in this transaction, if any.
         */
        this.modifiedKeys = [];
    }
    SimpleSyncRWTransaction.prototype.get = function (key) {
        var val = this.store.get(key);
        this.stashOldValue(key, val);
        return val;
    };
    SimpleSyncRWTransaction.prototype.put = function (key, data, overwrite) {
        this.markModified(key);
        return this.store.put(key, data, overwrite);
    };
    SimpleSyncRWTransaction.prototype.del = function (key) {
        this.markModified(key);
        this.store.del(key);
    };
    SimpleSyncRWTransaction.prototype.commit = function () { };
    SimpleSyncRWTransaction.prototype.abort = function () {
        // Rollback old values.
        for (var _i = 0, _a = this.modifiedKeys; _i < _a.length; _i++) {
            var key = _a[_i];
            var value = this.originalData[key];
            if (!value) {
                // Key didn't exist.
                this.store.del(key);
            }
            else {
                // Key existed. Store old value.
                this.store.put(key, value, true);
            }
        }
    };
    /**
     * Stashes given key value pair into `originalData` if it doesn't already
     * exist. Allows us to stash values the program is requesting anyway to
     * prevent needless `get` requests if the program modifies the data later
     * on during the transaction.
     */
    SimpleSyncRWTransaction.prototype.stashOldValue = function (key, value) {
        // Keep only the earliest value in the transaction.
        if (!this.originalData.hasOwnProperty(key)) {
            this.originalData[key] = value;
        }
    };
    /**
     * Marks the given key as modified, and stashes its value if it has not been
     * stashed already.
     */
    SimpleSyncRWTransaction.prototype.markModified = function (key) {
        if (this.modifiedKeys.indexOf(key) === -1) {
            this.modifiedKeys.push(key);
            if (!this.originalData.hasOwnProperty(key)) {
                this.originalData[key] = this.store.get(key);
            }
        }
    };
    return SimpleSyncRWTransaction;
}());
exports.SimpleSyncRWTransaction = SimpleSyncRWTransaction;
var SyncKeyValueFile = (function (_super) {
    __extends(SyncKeyValueFile, _super);
    function SyncKeyValueFile(_fs, _path, _flag, _stat, contents) {
        return _super.call(this, _fs, _path, _flag, _stat, contents) || this;
    }
    SyncKeyValueFile.prototype.syncSync = function () {
        if (this.isDirty()) {
            this._fs._syncSync(this.getPath(), this.getBuffer(), this.getStats());
            this.resetDirty();
        }
    };
    SyncKeyValueFile.prototype.closeSync = function () {
        this.syncSync();
    };
    return SyncKeyValueFile;
}(preload_file_1["default"]));
exports.SyncKeyValueFile = SyncKeyValueFile;
/**
 * A "Synchronous key-value file system". Stores data to/retrieves data from an
 * underlying key-value store.
 *
 * We use a unique ID for each node in the file system. The root node has a
 * fixed ID.
 * @todo Introduce Node ID caching.
 * @todo Check modes.
 */
var SyncKeyValueFileSystem = (function (_super) {
    __extends(SyncKeyValueFileSystem, _super);
    function SyncKeyValueFileSystem(options) {
        var _this = _super.call(this) || this;
        _this.store = options.store;
        // INVARIANT: Ensure that the root exists.
        _this.makeRootDirectory();
        return _this;
    }
    SyncKeyValueFileSystem.isAvailable = function () { return true; };
    SyncKeyValueFileSystem.prototype.getName = function () { return this.store.name(); };
    SyncKeyValueFileSystem.prototype.isReadOnly = function () { return false; };
    SyncKeyValueFileSystem.prototype.supportsSymlinks = function () { return false; };
    SyncKeyValueFileSystem.prototype.supportsProps = function () { return false; };
    SyncKeyValueFileSystem.prototype.supportsSynch = function () { return true; };
    /**
     * Delete all contents stored in the file system.
     */
    SyncKeyValueFileSystem.prototype.empty = function () {
        this.store.clear();
        // INVARIANT: Root always exists.
        this.makeRootDirectory();
    };
    SyncKeyValueFileSystem.prototype.renameSync = function (oldPath, newPath) {
        var tx = this.store.beginTransaction('readwrite'), oldParent = path.dirname(oldPath), oldName = path.basename(oldPath), newParent = path.dirname(newPath), newName = path.basename(newPath), 
        // Remove oldPath from parent's directory listing.
        oldDirNode = this.findINode(tx, oldParent), oldDirList = this.getDirListing(tx, oldParent, oldDirNode);
        if (!oldDirList[oldName]) {
            throw api_error_1.ApiError.ENOENT(oldPath);
        }
        var nodeId = oldDirList[oldName];
        delete oldDirList[oldName];
        // Invariant: Can't move a folder inside itself.
        // This funny little hack ensures that the check passes only if oldPath
        // is a subpath of newParent. We append '/' to avoid matching folders that
        // are a substring of the bottom-most folder in the path.
        if ((newParent + '/').indexOf(oldPath + '/') === 0) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EBUSY, oldParent);
        }
        // Add newPath to parent's directory listing.
        var newDirNode, newDirList;
        if (newParent === oldParent) {
            // Prevent us from re-grabbing the same directory listing, which still
            // contains oldName.
            newDirNode = oldDirNode;
            newDirList = oldDirList;
        }
        else {
            newDirNode = this.findINode(tx, newParent);
            newDirList = this.getDirListing(tx, newParent, newDirNode);
        }
        if (newDirList[newName]) {
            // If it's a file, delete it.
            var newNameNode = this.getINode(tx, newPath, newDirList[newName]);
            if (newNameNode.isFile()) {
                try {
                    tx.del(newNameNode.id);
                    tx.del(newDirList[newName]);
                }
                catch (e) {
                    tx.abort();
                    throw e;
                }
            }
            else {
                // If it's a directory, throw a permissions error.
                throw api_error_1.ApiError.EPERM(newPath);
            }
        }
        newDirList[newName] = nodeId;
        // Commit the two changed directory listings.
        try {
            tx.put(oldDirNode.id, Buffer.from(JSON.stringify(oldDirList)), true);
            tx.put(newDirNode.id, Buffer.from(JSON.stringify(newDirList)), true);
        }
        catch (e) {
            tx.abort();
            throw e;
        }
        tx.commit();
    };
    SyncKeyValueFileSystem.prototype.statSync = function (p, isLstat) {
        // Get the inode to the item, convert it into a Stats object.
        return this.findINode(this.store.beginTransaction('readonly'), p).toStats();
    };
    SyncKeyValueFileSystem.prototype.createFileSync = function (p, flag, mode) {
        var tx = this.store.beginTransaction('readwrite'), data = util_1.emptyBuffer(), newFile = this.commitNewFile(tx, p, node_fs_stats_1.FileType.FILE, mode, data);
        // Open the file.
        return new SyncKeyValueFile(this, p, flag, newFile.toStats(), data);
    };
    SyncKeyValueFileSystem.prototype.openFileSync = function (p, flag) {
        var tx = this.store.beginTransaction('readonly'), node = this.findINode(tx, p), data = tx.get(node.id);
        if (data === undefined) {
            throw api_error_1.ApiError.ENOENT(p);
        }
        return new SyncKeyValueFile(this, p, flag, node.toStats(), data);
    };
    SyncKeyValueFileSystem.prototype.unlinkSync = function (p) {
        this.removeEntry(p, false);
    };
    SyncKeyValueFileSystem.prototype.rmdirSync = function (p) {
        // Check first if directory is empty.
        if (this.readdirSync(p).length > 0) {
            throw api_error_1.ApiError.ENOTEMPTY(p);
        }
        else {
            this.removeEntry(p, true);
        }
    };
    SyncKeyValueFileSystem.prototype.mkdirSync = function (p, mode) {
        var tx = this.store.beginTransaction('readwrite'), data = Buffer.from('{}');
        this.commitNewFile(tx, p, node_fs_stats_1.FileType.DIRECTORY, mode, data);
    };
    SyncKeyValueFileSystem.prototype.readdirSync = function (p) {
        var tx = this.store.beginTransaction('readonly');
        return Object.keys(this.getDirListing(tx, p, this.findINode(tx, p)));
    };
    SyncKeyValueFileSystem.prototype._syncSync = function (p, data, stats) {
        // @todo Ensure mtime updates properly, and use that to determine if a data
        //       update is required.
        var tx = this.store.beginTransaction('readwrite'), 
        // We use the _findInode helper because we actually need the INode id.
        fileInodeId = this._findINode(tx, path.dirname(p), path.basename(p)), fileInode = this.getINode(tx, p, fileInodeId), inodeChanged = fileInode.update(stats);
        try {
            // Sync data.
            tx.put(fileInode.id, data, true);
            // Sync metadata.
            if (inodeChanged) {
                tx.put(fileInodeId, fileInode.toBuffer(), true);
            }
        }
        catch (e) {
            tx.abort();
            throw e;
        }
        tx.commit();
    };
    /**
     * Checks if the root directory exists. Creates it if it doesn't.
     */
    SyncKeyValueFileSystem.prototype.makeRootDirectory = function () {
        var tx = this.store.beginTransaction('readwrite');
        if (tx.get(ROOT_NODE_ID) === undefined) {
            // Create new inode.
            var currTime = (new Date()).getTime(), 
            // Mode 0666
            dirInode = new inode_1["default"](GenerateRandomID(), 4096, 511 | node_fs_stats_1.FileType.DIRECTORY, currTime, currTime, currTime);
            // If the root doesn't exist, the first random ID shouldn't exist,
            // either.
            tx.put(dirInode.id, getEmptyDirNode(), false);
            tx.put(ROOT_NODE_ID, dirInode.toBuffer(), false);
            tx.commit();
        }
    };
    /**
     * Helper function for findINode.
     * @param parent The parent directory of the file we are attempting to find.
     * @param filename The filename of the inode we are attempting to find, minus
     *   the parent.
     * @return string The ID of the file's inode in the file system.
     */
    SyncKeyValueFileSystem.prototype._findINode = function (tx, parent, filename) {
        var _this = this;
        var readDirectory = function (inode) {
            // Get the root's directory listing.
            var dirList = _this.getDirListing(tx, parent, inode);
            // Get the file's ID.
            if (dirList[filename]) {
                return dirList[filename];
            }
            else {
                throw api_error_1.ApiError.ENOENT(path.resolve(parent, filename));
            }
        };
        if (parent === '/') {
            if (filename === '') {
                // BASE CASE #1: Return the root's ID.
                return ROOT_NODE_ID;
            }
            else {
                // BASE CASE #2: Find the item in the root ndoe.
                return readDirectory(this.getINode(tx, parent, ROOT_NODE_ID));
            }
        }
        else {
            return readDirectory(this.getINode(tx, parent + path.sep + filename, this._findINode(tx, path.dirname(parent), path.basename(parent))));
        }
    };
    /**
     * Finds the Inode of the given path.
     * @param p The path to look up.
     * @return The Inode of the path p.
     * @todo memoize/cache
     */
    SyncKeyValueFileSystem.prototype.findINode = function (tx, p) {
        return this.getINode(tx, p, this._findINode(tx, path.dirname(p), path.basename(p)));
    };
    /**
     * Given the ID of a node, retrieves the corresponding Inode.
     * @param tx The transaction to use.
     * @param p The corresponding path to the file (used for error messages).
     * @param id The ID to look up.
     */
    SyncKeyValueFileSystem.prototype.getINode = function (tx, p, id) {
        var inode = tx.get(id);
        if (inode === undefined) {
            throw api_error_1.ApiError.ENOENT(p);
        }
        return inode_1["default"].fromBuffer(inode);
    };
    /**
     * Given the Inode of a directory, retrieves the corresponding directory
     * listing.
     */
    SyncKeyValueFileSystem.prototype.getDirListing = function (tx, p, inode) {
        if (!inode.isDirectory()) {
            throw api_error_1.ApiError.ENOTDIR(p);
        }
        var data = tx.get(inode.id);
        if (data === undefined) {
            throw api_error_1.ApiError.ENOENT(p);
        }
        return JSON.parse(data.toString());
    };
    /**
     * Creates a new node under a random ID. Retries 5 times before giving up in
     * the exceedingly unlikely chance that we try to reuse a random GUID.
     * @return The GUID that the data was stored under.
     */
    SyncKeyValueFileSystem.prototype.addNewNode = function (tx, data) {
        var retries = 0;
        var currId;
        while (retries < 5) {
            try {
                currId = GenerateRandomID();
                tx.put(currId, data, false);
                return currId;
            }
            catch (e) {
                // Ignore and reroll.
            }
        }
        throw new api_error_1.ApiError(api_error_1.ErrorCode.EIO, 'Unable to commit data to key-value store.');
    };
    /**
     * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
     * the given mode.
     * Note: This will commit the transaction.
     * @param p The path to the new file.
     * @param type The type of the new file.
     * @param mode The mode to create the new file with.
     * @param data The data to store at the file's data node.
     * @return The Inode for the new file.
     */
    SyncKeyValueFileSystem.prototype.commitNewFile = function (tx, p, type, mode, data) {
        var parentDir = path.dirname(p), fname = path.basename(p), parentNode = this.findINode(tx, parentDir), dirListing = this.getDirListing(tx, parentDir, parentNode), currTime = (new Date()).getTime();
        // Invariant: The root always exists.
        // If we don't check this prior to taking steps below, we will create a
        // file with name '' in root should p == '/'.
        if (p === '/') {
            throw api_error_1.ApiError.EEXIST(p);
        }
        // Check if file already exists.
        if (dirListing[fname]) {
            throw api_error_1.ApiError.EEXIST(p);
        }
        var fileNode;
        try {
            // Commit data.
            var dataId = this.addNewNode(tx, data);
            fileNode = new inode_1["default"](dataId, data.length, mode | type, currTime, currTime, currTime);
            // Commit file node.
            var fileNodeId = this.addNewNode(tx, fileNode.toBuffer());
            // Update and commit parent directory listing.
            dirListing[fname] = fileNodeId;
            tx.put(parentNode.id, Buffer.from(JSON.stringify(dirListing)), true);
        }
        catch (e) {
            tx.abort();
            throw e;
        }
        tx.commit();
        return fileNode;
    };
    /**
     * Remove all traces of the given path from the file system.
     * @param p The path to remove from the file system.
     * @param isDir Does the path belong to a directory, or a file?
     * @todo Update mtime.
     */
    SyncKeyValueFileSystem.prototype.removeEntry = function (p, isDir) {
        var tx = this.store.beginTransaction('readwrite'), parent = path.dirname(p), parentNode = this.findINode(tx, parent), parentListing = this.getDirListing(tx, parent, parentNode), fileName = path.basename(p);
        if (!parentListing[fileName]) {
            throw api_error_1.ApiError.ENOENT(p);
        }
        // Remove from directory listing of parent.
        var fileNodeId = parentListing[fileName];
        delete parentListing[fileName];
        // Get file inode.
        var fileNode = this.getINode(tx, p, fileNodeId);
        if (!isDir && fileNode.isDirectory()) {
            throw api_error_1.ApiError.EISDIR(p);
        }
        else if (isDir && !fileNode.isDirectory()) {
            throw api_error_1.ApiError.ENOTDIR(p);
        }
        try {
            // Delete data.
            tx.del(fileNode.id);
            // Delete node.
            tx.del(fileNodeId);
            // Update directory listing.
            tx.put(parentNode.id, Buffer.from(JSON.stringify(parentListing)), true);
        }
        catch (e) {
            tx.abort();
            throw e;
        }
        // Success.
        tx.commit();
    };
    return SyncKeyValueFileSystem;
}(file_system_1.SynchronousFileSystem));
exports.SyncKeyValueFileSystem = SyncKeyValueFileSystem;
var AsyncKeyValueFile = (function (_super) {
    __extends(AsyncKeyValueFile, _super);
    function AsyncKeyValueFile(_fs, _path, _flag, _stat, contents) {
        return _super.call(this, _fs, _path, _flag, _stat, contents) || this;
    }
    AsyncKeyValueFile.prototype.sync = function (cb) {
        var _this = this;
        if (this.isDirty()) {
            this._fs._sync(this.getPath(), this.getBuffer(), this.getStats(), function (e) {
                if (!e) {
                    _this.resetDirty();
                }
                cb(e);
            });
        }
        else {
            cb();
        }
    };
    AsyncKeyValueFile.prototype.close = function (cb) {
        this.sync(cb);
    };
    return AsyncKeyValueFile;
}(preload_file_1["default"]));
exports.AsyncKeyValueFile = AsyncKeyValueFile;
/**
 * An "Asynchronous key-value file system". Stores data to/retrieves data from
 * an underlying asynchronous key-value store.
 */
var AsyncKeyValueFileSystem = (function (_super) {
    __extends(AsyncKeyValueFileSystem, _super);
    function AsyncKeyValueFileSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsyncKeyValueFileSystem.isAvailable = function () { return true; };
    /**
     * Initializes the file system. Typically called by subclasses' async
     * constructors.
     */
    AsyncKeyValueFileSystem.prototype.init = function (store, cb) {
        this.store = store;
        // INVARIANT: Ensure that the root exists.
        this.makeRootDirectory(cb);
    };
    AsyncKeyValueFileSystem.prototype.getName = function () { return this.store.name(); };
    AsyncKeyValueFileSystem.prototype.isReadOnly = function () { return false; };
    AsyncKeyValueFileSystem.prototype.supportsSymlinks = function () { return false; };
    AsyncKeyValueFileSystem.prototype.supportsProps = function () { return false; };
    AsyncKeyValueFileSystem.prototype.supportsSynch = function () { return false; };
    /**
     * Delete all contents stored in the file system.
     */
    AsyncKeyValueFileSystem.prototype.empty = function (cb) {
        var _this = this;
        this.store.clear(function (e) {
            if (noError(e, cb)) {
                // INVARIANT: Root always exists.
                _this.makeRootDirectory(cb);
            }
        });
    };
    AsyncKeyValueFileSystem.prototype.rename = function (oldPath, newPath, cb) {
        var _this = this;
        var tx = this.store.beginTransaction('readwrite');
        var oldParent = path.dirname(oldPath), oldName = path.basename(oldPath);
        var newParent = path.dirname(newPath), newName = path.basename(newPath);
        var inodes = {};
        var lists = {};
        var errorOccurred = false;
        // Invariant: Can't move a folder inside itself.
        // This funny little hack ensures that the check passes only if oldPath
        // is a subpath of newParent. We append '/' to avoid matching folders that
        // are a substring of the bottom-most folder in the path.
        if ((newParent + '/').indexOf(oldPath + '/') === 0) {
            return cb(new api_error_1.ApiError(api_error_1.ErrorCode.EBUSY, oldParent));
        }
        /**
         * Responsible for Phase 2 of the rename operation: Modifying and
         * committing the directory listings. Called once we have successfully
         * retrieved both the old and new parent's inodes and listings.
         */
        var theOleSwitcharoo = function () {
            // Sanity check: Ensure both paths are present, and no error has occurred.
            if (errorOccurred || !lists.hasOwnProperty(oldParent) || !lists.hasOwnProperty(newParent)) {
                return;
            }
            var oldParentList = lists[oldParent], oldParentINode = inodes[oldParent], newParentList = lists[newParent], newParentINode = inodes[newParent];
            // Delete file from old parent.
            if (!oldParentList[oldName]) {
                cb(api_error_1.ApiError.ENOENT(oldPath));
            }
            else {
                var fileId_1 = oldParentList[oldName];
                delete oldParentList[oldName];
                // Finishes off the renaming process by adding the file to the new
                // parent.
                var completeRename_1 = function () {
                    newParentList[newName] = fileId_1;
                    // Commit old parent's list.
                    tx.put(oldParentINode.id, Buffer.from(JSON.stringify(oldParentList)), true, function (e) {
                        if (noErrorTx(e, tx, cb)) {
                            if (oldParent === newParent) {
                                // DONE!
                                tx.commit(cb);
                            }
                            else {
                                // Commit new parent's list.
                                tx.put(newParentINode.id, Buffer.from(JSON.stringify(newParentList)), true, function (e) {
                                    if (noErrorTx(e, tx, cb)) {
                                        tx.commit(cb);
                                    }
                                });
                            }
                        }
                    });
                };
                if (newParentList[newName]) {
                    // 'newPath' already exists. Check if it's a file or a directory, and
                    // act accordingly.
                    _this.getINode(tx, newPath, newParentList[newName], function (e, inode) {
                        if (noErrorTx(e, tx, cb)) {
                            if (inode.isFile()) {
                                // Delete the file and continue.
                                tx.del(inode.id, function (e) {
                                    if (noErrorTx(e, tx, cb)) {
                                        tx.del(newParentList[newName], function (e) {
                                            if (noErrorTx(e, tx, cb)) {
                                                completeRename_1();
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                // Can't overwrite a directory using rename.
                                tx.abort(function (e) {
                                    cb(api_error_1.ApiError.EPERM(newPath));
                                });
                            }
                        }
                    });
                }
                else {
                    completeRename_1();
                }
            }
        };
        /**
         * Grabs a path's inode and directory listing, and shoves it into the
         * inodes and lists hashes.
         */
        var processInodeAndListings = function (p) {
            _this.findINodeAndDirListing(tx, p, function (e, node, dirList) {
                if (e) {
                    if (!errorOccurred) {
                        errorOccurred = true;
                        tx.abort(function () {
                            cb(e);
                        });
                    }
                    // If error has occurred already, just stop here.
                }
                else {
                    inodes[p] = node;
                    lists[p] = dirList;
                    theOleSwitcharoo();
                }
            });
        };
        processInodeAndListings(oldParent);
        if (oldParent !== newParent) {
            processInodeAndListings(newParent);
        }
    };
    AsyncKeyValueFileSystem.prototype.stat = function (p, isLstat, cb) {
        var tx = this.store.beginTransaction('readonly');
        this.findINode(tx, p, function (e, inode) {
            if (noError(e, cb)) {
                cb(null, inode.toStats());
            }
        });
    };
    AsyncKeyValueFileSystem.prototype.createFile = function (p, flag, mode, cb) {
        var _this = this;
        var tx = this.store.beginTransaction('readwrite'), data = util_1.emptyBuffer();
        this.commitNewFile(tx, p, node_fs_stats_1.FileType.FILE, mode, data, function (e, newFile) {
            if (noError(e, cb)) {
                cb(null, new AsyncKeyValueFile(_this, p, flag, newFile.toStats(), data));
            }
        });
    };
    AsyncKeyValueFileSystem.prototype.openFile = function (p, flag, cb) {
        var _this = this;
        var tx = this.store.beginTransaction('readonly');
        // Step 1: Grab the file's inode.
        this.findINode(tx, p, function (e, inode) {
            if (noError(e, cb)) {
                // Step 2: Grab the file's data.
                tx.get(inode.id, function (e, data) {
                    if (noError(e, cb)) {
                        if (data === undefined) {
                            cb(api_error_1.ApiError.ENOENT(p));
                        }
                        else {
                            cb(null, new AsyncKeyValueFile(_this, p, flag, inode.toStats(), data));
                        }
                    }
                });
            }
        });
    };
    AsyncKeyValueFileSystem.prototype.unlink = function (p, cb) {
        this.removeEntry(p, false, cb);
    };
    AsyncKeyValueFileSystem.prototype.rmdir = function (p, cb) {
        var _this = this;
        // Check first if directory is empty.
        this.readdir(p, function (err, files) {
            if (err) {
                cb(err);
            }
            else if (files.length > 0) {
                cb(api_error_1.ApiError.ENOTEMPTY(p));
            }
            else {
                _this.removeEntry(p, true, cb);
            }
        });
    };
    AsyncKeyValueFileSystem.prototype.mkdir = function (p, mode, cb) {
        var tx = this.store.beginTransaction('readwrite'), data = Buffer.from('{}');
        this.commitNewFile(tx, p, node_fs_stats_1.FileType.DIRECTORY, mode, data, cb);
    };
    AsyncKeyValueFileSystem.prototype.readdir = function (p, cb) {
        var _this = this;
        var tx = this.store.beginTransaction('readonly');
        this.findINode(tx, p, function (e, inode) {
            if (noError(e, cb)) {
                _this.getDirListing(tx, p, inode, function (e, dirListing) {
                    if (noError(e, cb)) {
                        cb(null, Object.keys(dirListing));
                    }
                });
            }
        });
    };
    AsyncKeyValueFileSystem.prototype._sync = function (p, data, stats, cb) {
        var _this = this;
        // @todo Ensure mtime updates properly, and use that to determine if a data
        //       update is required.
        var tx = this.store.beginTransaction('readwrite');
        // Step 1: Get the file node's ID.
        this._findINode(tx, path.dirname(p), path.basename(p), function (e, fileInodeId) {
            if (noErrorTx(e, tx, cb)) {
                // Step 2: Get the file inode.
                _this.getINode(tx, p, fileInodeId, function (e, fileInode) {
                    if (noErrorTx(e, tx, cb)) {
                        var inodeChanged_1 = fileInode.update(stats);
                        // Step 3: Sync the data.
                        tx.put(fileInode.id, data, true, function (e) {
                            if (noErrorTx(e, tx, cb)) {
                                // Step 4: Sync the metadata (if it changed)!
                                if (inodeChanged_1) {
                                    tx.put(fileInodeId, fileInode.toBuffer(), true, function (e) {
                                        if (noErrorTx(e, tx, cb)) {
                                            tx.commit(cb);
                                        }
                                    });
                                }
                                else {
                                    // No need to sync metadata; return.
                                    tx.commit(cb);
                                }
                            }
                        });
                    }
                });
            }
        });
    };
    /**
     * Checks if the root directory exists. Creates it if it doesn't.
     */
    AsyncKeyValueFileSystem.prototype.makeRootDirectory = function (cb) {
        var tx = this.store.beginTransaction('readwrite');
        tx.get(ROOT_NODE_ID, function (e, data) {
            if (e || data === undefined) {
                // Create new inode.
                var currTime = (new Date()).getTime(), 
                // Mode 0666
                dirInode_1 = new inode_1["default"](GenerateRandomID(), 4096, 511 | node_fs_stats_1.FileType.DIRECTORY, currTime, currTime, currTime);
                // If the root doesn't exist, the first random ID shouldn't exist,
                // either.
                tx.put(dirInode_1.id, getEmptyDirNode(), false, function (e) {
                    if (noErrorTx(e, tx, cb)) {
                        tx.put(ROOT_NODE_ID, dirInode_1.toBuffer(), false, function (e) {
                            if (e) {
                                tx.abort(function () { cb(e); });
                            }
                            else {
                                tx.commit(cb);
                            }
                        });
                    }
                });
            }
            else {
                // We're good.
                tx.commit(cb);
            }
        });
    };
    /**
     * Helper function for findINode.
     * @param parent The parent directory of the file we are attempting to find.
     * @param filename The filename of the inode we are attempting to find, minus
     *   the parent.
     * @param cb Passed an error or the ID of the file's inode in the file system.
     */
    AsyncKeyValueFileSystem.prototype._findINode = function (tx, parent, filename, cb) {
        var _this = this;
        var handleDirectoryListings = function (e, inode, dirList) {
            if (e) {
                cb(e);
            }
            else if (dirList[filename]) {
                cb(null, dirList[filename]);
            }
            else {
                cb(api_error_1.ApiError.ENOENT(path.resolve(parent, filename)));
            }
        };
        if (parent === '/') {
            if (filename === '') {
                // BASE CASE #1: Return the root's ID.
                cb(null, ROOT_NODE_ID);
            }
            else {
                // BASE CASE #2: Find the item in the root node.
                this.getINode(tx, parent, ROOT_NODE_ID, function (e, inode) {
                    if (noError(e, cb)) {
                        _this.getDirListing(tx, parent, inode, function (e, dirList) {
                            // handle_directory_listings will handle e for us.
                            handleDirectoryListings(e, inode, dirList);
                        });
                    }
                });
            }
        }
        else {
            // Get the parent directory's INode, and find the file in its directory
            // listing.
            this.findINodeAndDirListing(tx, parent, handleDirectoryListings);
        }
    };
    /**
     * Finds the Inode of the given path.
     * @param p The path to look up.
     * @param cb Passed an error or the Inode of the path p.
     * @todo memoize/cache
     */
    AsyncKeyValueFileSystem.prototype.findINode = function (tx, p, cb) {
        var _this = this;
        this._findINode(tx, path.dirname(p), path.basename(p), function (e, id) {
            if (noError(e, cb)) {
                _this.getINode(tx, p, id, cb);
            }
        });
    };
    /**
     * Given the ID of a node, retrieves the corresponding Inode.
     * @param tx The transaction to use.
     * @param p The corresponding path to the file (used for error messages).
     * @param id The ID to look up.
     * @param cb Passed an error or the inode under the given id.
     */
    AsyncKeyValueFileSystem.prototype.getINode = function (tx, p, id, cb) {
        tx.get(id, function (e, data) {
            if (noError(e, cb)) {
                if (data === undefined) {
                    cb(api_error_1.ApiError.ENOENT(p));
                }
                else {
                    cb(null, inode_1["default"].fromBuffer(data));
                }
            }
        });
    };
    /**
     * Given the Inode of a directory, retrieves the corresponding directory
     * listing.
     */
    AsyncKeyValueFileSystem.prototype.getDirListing = function (tx, p, inode, cb) {
        if (!inode.isDirectory()) {
            cb(api_error_1.ApiError.ENOTDIR(p));
        }
        else {
            tx.get(inode.id, function (e, data) {
                if (noError(e, cb)) {
                    try {
                        cb(null, JSON.parse(data.toString()));
                    }
                    catch (e) {
                        // Occurs when data is undefined, or corresponds to something other
                        // than a directory listing. The latter should never occur unless
                        // the file system is corrupted.
                        cb(api_error_1.ApiError.ENOENT(p));
                    }
                }
            });
        }
    };
    /**
     * Given a path to a directory, retrieves the corresponding INode and
     * directory listing.
     */
    AsyncKeyValueFileSystem.prototype.findINodeAndDirListing = function (tx, p, cb) {
        var _this = this;
        this.findINode(tx, p, function (e, inode) {
            if (noError(e, cb)) {
                _this.getDirListing(tx, p, inode, function (e, listing) {
                    if (noError(e, cb)) {
                        cb(null, inode, listing);
                    }
                });
            }
        });
    };
    /**
     * Adds a new node under a random ID. Retries 5 times before giving up in
     * the exceedingly unlikely chance that we try to reuse a random GUID.
     * @param cb Passed an error or the GUID that the data was stored under.
     */
    AsyncKeyValueFileSystem.prototype.addNewNode = function (tx, data, cb) {
        var retries = 0, currId;
        var reroll = function () {
            if (++retries === 5) {
                // Max retries hit. Return with an error.
                cb(new api_error_1.ApiError(api_error_1.ErrorCode.EIO, 'Unable to commit data to key-value store.'));
            }
            else {
                // Try again.
                currId = GenerateRandomID();
                tx.put(currId, data, false, function (e, committed) {
                    if (e || !committed) {
                        reroll();
                    }
                    else {
                        // Successfully stored under 'currId'.
                        cb(null, currId);
                    }
                });
            }
        };
        reroll();
    };
    /**
     * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
     * the given mode.
     * Note: This will commit the transaction.
     * @param p The path to the new file.
     * @param type The type of the new file.
     * @param mode The mode to create the new file with.
     * @param data The data to store at the file's data node.
     * @param cb Passed an error or the Inode for the new file.
     */
    AsyncKeyValueFileSystem.prototype.commitNewFile = function (tx, p, type, mode, data, cb) {
        var _this = this;
        var parentDir = path.dirname(p), fname = path.basename(p), currTime = (new Date()).getTime();
        // Invariant: The root always exists.
        // If we don't check this prior to taking steps below, we will create a
        // file with name '' in root should p == '/'.
        if (p === '/') {
            return cb(api_error_1.ApiError.EEXIST(p));
        }
        // Let's build a pyramid of code!
        // Step 1: Get the parent directory's inode and directory listing
        this.findINodeAndDirListing(tx, parentDir, function (e, parentNode, dirListing) {
            if (noErrorTx(e, tx, cb)) {
                if (dirListing[fname]) {
                    // File already exists.
                    tx.abort(function () {
                        cb(api_error_1.ApiError.EEXIST(p));
                    });
                }
                else {
                    // Step 2: Commit data to store.
                    _this.addNewNode(tx, data, function (e, dataId) {
                        if (noErrorTx(e, tx, cb)) {
                            // Step 3: Commit the file's inode to the store.
                            var fileInode_1 = new inode_1["default"](dataId, data.length, mode | type, currTime, currTime, currTime);
                            _this.addNewNode(tx, fileInode_1.toBuffer(), function (e, fileInodeId) {
                                if (noErrorTx(e, tx, cb)) {
                                    // Step 4: Update parent directory's listing.
                                    dirListing[fname] = fileInodeId;
                                    tx.put(parentNode.id, Buffer.from(JSON.stringify(dirListing)), true, function (e) {
                                        if (noErrorTx(e, tx, cb)) {
                                            // Step 5: Commit and return the new inode.
                                            tx.commit(function (e) {
                                                if (noErrorTx(e, tx, cb)) {
                                                    cb(null, fileInode_1);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    };
    /**
     * Remove all traces of the given path from the file system.
     * @param p The path to remove from the file system.
     * @param isDir Does the path belong to a directory, or a file?
     * @todo Update mtime.
     */
    AsyncKeyValueFileSystem.prototype.removeEntry = function (p, isDir, cb) {
        var _this = this;
        var tx = this.store.beginTransaction('readwrite'), parent = path.dirname(p), fileName = path.basename(p);
        // Step 1: Get parent directory's node and directory listing.
        this.findINodeAndDirListing(tx, parent, function (e, parentNode, parentListing) {
            if (noErrorTx(e, tx, cb)) {
                if (!parentListing[fileName]) {
                    tx.abort(function () {
                        cb(api_error_1.ApiError.ENOENT(p));
                    });
                }
                else {
                    // Remove from directory listing of parent.
                    var fileNodeId_1 = parentListing[fileName];
                    delete parentListing[fileName];
                    // Step 2: Get file inode.
                    _this.getINode(tx, p, fileNodeId_1, function (e, fileNode) {
                        if (noErrorTx(e, tx, cb)) {
                            if (!isDir && fileNode.isDirectory()) {
                                tx.abort(function () {
                                    cb(api_error_1.ApiError.EISDIR(p));
                                });
                            }
                            else if (isDir && !fileNode.isDirectory()) {
                                tx.abort(function () {
                                    cb(api_error_1.ApiError.ENOTDIR(p));
                                });
                            }
                            else {
                                // Step 3: Delete data.
                                tx.del(fileNode.id, function (e) {
                                    if (noErrorTx(e, tx, cb)) {
                                        // Step 4: Delete node.
                                        tx.del(fileNodeId_1, function (e) {
                                            if (noErrorTx(e, tx, cb)) {
                                                // Step 5: Update directory listing.
                                                tx.put(parentNode.id, Buffer.from(JSON.stringify(parentListing)), true, function (e) {
                                                    if (noErrorTx(e, tx, cb)) {
                                                        tx.commit(cb);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };
    return AsyncKeyValueFileSystem;
}(file_system_1.BaseFileSystem));
exports.AsyncKeyValueFileSystem = AsyncKeyValueFileSystem;
//# sourceMappingURL=key_value_filesystem.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/browserfs/dist/node/generic/preload_file.js":
/*!******************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/generic/preload_file.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var file_1 = __webpack_require__(/*! ../core/file */ "./node_modules/browserfs/dist/node/core/file.js");
var api_error_1 = __webpack_require__(/*! ../core/api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var node_fs_1 = __webpack_require__(/*! ../core/node_fs */ "./node_modules/browserfs/dist/node/core/node_fs.js");
var util_1 = __webpack_require__(/*! ../core/util */ "./node_modules/browserfs/dist/node/core/util.js");
/**
 * An implementation of the File interface that operates on a file that is
 * completely in-memory. PreloadFiles are backed by a Buffer.
 *
 * This is also an abstract class, as it lacks an implementation of 'sync' and
 * 'close'. Each filesystem that wishes to use this file representation must
 * extend this class and implement those two methods.
 * @todo 'close' lever that disables functionality once closed.
 */
var PreloadFile = (function (_super) {
    __extends(PreloadFile, _super);
    /**
     * Creates a file with the given path and, optionally, the given contents. Note
     * that, if contents is specified, it will be mutated by the file!
     * @param _fs The file system that created the file.
     * @param _path
     * @param _mode The mode that the file was opened using.
     *   Dictates permissions and where the file pointer starts.
     * @param _stat The stats object for the given file.
     *   PreloadFile will mutate this object. Note that this object must contain
     *   the appropriate mode that the file was opened as.
     * @param contents A buffer containing the entire
     *   contents of the file. PreloadFile will mutate this buffer. If not
     *   specified, we assume it is a new file.
     */
    function PreloadFile(_fs, _path, _flag, _stat, contents) {
        var _this = _super.call(this) || this;
        _this._pos = 0;
        _this._dirty = false;
        _this._fs = _fs;
        _this._path = _path;
        _this._flag = _flag;
        _this._stat = _stat;
        if (contents) {
            _this._buffer = contents;
        }
        else {
            // Empty buffer. It'll expand once we write stuff to it.
            _this._buffer = util_1.emptyBuffer();
        }
        // Note: This invariant is *not* maintained once the file starts getting
        // modified.
        // Note: Only actually matters if file is readable, as writeable modes may
        // truncate/append to file.
        if (_this._stat.size !== _this._buffer.length && _this._flag.isReadable()) {
            throw new Error("Invalid buffer: Buffer is " + _this._buffer.length + " long, yet Stats object specifies that file is " + _this._stat.size + " long.");
        }
        return _this;
    }
    /**
     * NONSTANDARD: Get the underlying buffer for this file. !!DO NOT MUTATE!! Will mess up dirty tracking.
     */
    PreloadFile.prototype.getBuffer = function () {
        return this._buffer;
    };
    /**
     * NONSTANDARD: Get underlying stats for this file. !!DO NOT MUTATE!!
     */
    PreloadFile.prototype.getStats = function () {
        return this._stat;
    };
    PreloadFile.prototype.getFlag = function () {
        return this._flag;
    };
    /**
     * Get the path to this file.
     * @return [String] The path to the file.
     */
    PreloadFile.prototype.getPath = function () {
        return this._path;
    };
    /**
     * Get the current file position.
     *
     * We emulate the following bug mentioned in the Node documentation:
     * > On Linux, positional writes don't work when the file is opened in append
     *   mode. The kernel ignores the position argument and always appends the data
     *   to the end of the file.
     * @return [Number] The current file position.
     */
    PreloadFile.prototype.getPos = function () {
        if (this._flag.isAppendable()) {
            return this._stat.size;
        }
        return this._pos;
    };
    /**
     * Advance the current file position by the indicated number of positions.
     * @param [Number] delta
     */
    PreloadFile.prototype.advancePos = function (delta) {
        return this._pos += delta;
    };
    /**
     * Set the file position.
     * @param [Number] newPos
     */
    PreloadFile.prototype.setPos = function (newPos) {
        return this._pos = newPos;
    };
    /**
     * **Core**: Asynchronous sync. Must be implemented by subclasses of this
     * class.
     * @param [Function(BrowserFS.ApiError)] cb
     */
    PreloadFile.prototype.sync = function (cb) {
        try {
            this.syncSync();
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    /**
     * **Core**: Synchronous sync.
     */
    PreloadFile.prototype.syncSync = function () {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * **Core**: Asynchronous close. Must be implemented by subclasses of this
     * class.
     * @param [Function(BrowserFS.ApiError)] cb
     */
    PreloadFile.prototype.close = function (cb) {
        try {
            this.closeSync();
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    /**
     * **Core**: Synchronous close.
     */
    PreloadFile.prototype.closeSync = function () {
        throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
    };
    /**
     * Asynchronous `stat`.
     * @param [Function(BrowserFS.ApiError, BrowserFS.node.fs.Stats)] cb
     */
    PreloadFile.prototype.stat = function (cb) {
        try {
            cb(null, this._stat.clone());
        }
        catch (e) {
            cb(e);
        }
    };
    /**
     * Synchronous `stat`.
     */
    PreloadFile.prototype.statSync = function () {
        return this._stat.clone();
    };
    /**
     * Asynchronous truncate.
     * @param [Number] len
     * @param [Function(BrowserFS.ApiError)] cb
     */
    PreloadFile.prototype.truncate = function (len, cb) {
        try {
            this.truncateSync(len);
            if (this._flag.isSynchronous() && !node_fs_1["default"].getRootFS().supportsSynch()) {
                this.sync(cb);
            }
            cb();
        }
        catch (e) {
            return cb(e);
        }
    };
    /**
     * Synchronous truncate.
     * @param [Number] len
     */
    PreloadFile.prototype.truncateSync = function (len) {
        this._dirty = true;
        if (!this._flag.isWriteable()) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EPERM, 'File not opened with a writeable mode.');
        }
        this._stat.mtime = new Date();
        if (len > this._buffer.length) {
            var buf = Buffer.alloc(len - this._buffer.length, 0);
            // Write will set @_stat.size for us.
            this.writeSync(buf, 0, buf.length, this._buffer.length);
            if (this._flag.isSynchronous() && node_fs_1["default"].getRootFS().supportsSynch()) {
                this.syncSync();
            }
            return;
        }
        this._stat.size = len;
        // Truncate buffer to 'len'.
        var newBuff = Buffer.alloc(len);
        this._buffer.copy(newBuff, 0, 0, len);
        this._buffer = newBuff;
        if (this._flag.isSynchronous() && node_fs_1["default"].getRootFS().supportsSynch()) {
            this.syncSync();
        }
    };
    /**
     * Write buffer to the file.
     * Note that it is unsafe to use fs.write multiple times on the same file
     * without waiting for the callback.
     * @param [BrowserFS.node.Buffer] buffer Buffer containing the data to write to
     *  the file.
     * @param [Number] offset Offset in the buffer to start reading data from.
     * @param [Number] length The amount of bytes to write to the file.
     * @param [Number] position Offset from the beginning of the file where this
     *   data should be written. If position is null, the data will be written at
     *   the current position.
     * @param [Function(BrowserFS.ApiError, Number, BrowserFS.node.Buffer)]
     *   cb The number specifies the number of bytes written into the file.
     */
    PreloadFile.prototype.write = function (buffer, offset, length, position, cb) {
        try {
            cb(null, this.writeSync(buffer, offset, length, position), buffer);
        }
        catch (e) {
            cb(e);
        }
    };
    /**
     * Write buffer to the file.
     * Note that it is unsafe to use fs.writeSync multiple times on the same file
     * without waiting for the callback.
     * @param [BrowserFS.node.Buffer] buffer Buffer containing the data to write to
     *  the file.
     * @param [Number] offset Offset in the buffer to start reading data from.
     * @param [Number] length The amount of bytes to write to the file.
     * @param [Number] position Offset from the beginning of the file where this
     *   data should be written. If position is null, the data will be written at
     *   the current position.
     * @return [Number]
     */
    PreloadFile.prototype.writeSync = function (buffer, offset, length, position) {
        this._dirty = true;
        if (position === undefined || position === null) {
            position = this.getPos();
        }
        if (!this._flag.isWriteable()) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EPERM, 'File not opened with a writeable mode.');
        }
        var endFp = position + length;
        if (endFp > this._stat.size) {
            this._stat.size = endFp;
            if (endFp > this._buffer.length) {
                // Extend the buffer!
                var newBuff = Buffer.alloc(endFp);
                this._buffer.copy(newBuff);
                this._buffer = newBuff;
            }
        }
        var len = buffer.copy(this._buffer, position, offset, offset + length);
        this._stat.mtime = new Date();
        if (this._flag.isSynchronous()) {
            this.syncSync();
            return len;
        }
        this.setPos(position + len);
        return len;
    };
    /**
     * Read data from the file.
     * @param [BrowserFS.node.Buffer] buffer The buffer that the data will be
     *   written to.
     * @param [Number] offset The offset within the buffer where writing will
     *   start.
     * @param [Number] length An integer specifying the number of bytes to read.
     * @param [Number] position An integer specifying where to begin reading from
     *   in the file. If position is null, data will be read from the current file
     *   position.
     * @param [Function(BrowserFS.ApiError, Number, BrowserFS.node.Buffer)] cb The
     *   number is the number of bytes read
     */
    PreloadFile.prototype.read = function (buffer, offset, length, position, cb) {
        try {
            cb(null, this.readSync(buffer, offset, length, position), buffer);
        }
        catch (e) {
            cb(e);
        }
    };
    /**
     * Read data from the file.
     * @param [BrowserFS.node.Buffer] buffer The buffer that the data will be
     *   written to.
     * @param [Number] offset The offset within the buffer where writing will
     *   start.
     * @param [Number] length An integer specifying the number of bytes to read.
     * @param [Number] position An integer specifying where to begin reading from
     *   in the file. If position is null, data will be read from the current file
     *   position.
     * @return [Number]
     */
    PreloadFile.prototype.readSync = function (buffer, offset, length, position) {
        if (!this._flag.isReadable()) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.EPERM, 'File not opened with a readable mode.');
        }
        if (position === undefined || position === null) {
            position = this.getPos();
        }
        var endRead = position + length;
        if (endRead > this._stat.size) {
            length = this._stat.size - position;
        }
        var rv = this._buffer.copy(buffer, offset, position, position + length);
        this._stat.atime = new Date();
        this._pos = position + length;
        return rv;
    };
    /**
     * Asynchronous `fchmod`.
     * @param [Number|String] mode
     * @param [Function(BrowserFS.ApiError)] cb
     */
    PreloadFile.prototype.chmod = function (mode, cb) {
        try {
            this.chmodSync(mode);
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    /**
     * Asynchronous `fchmod`.
     * @param [Number] mode
     */
    PreloadFile.prototype.chmodSync = function (mode) {
        if (!this._fs.supportsProps()) {
            throw new api_error_1.ApiError(api_error_1.ErrorCode.ENOTSUP);
        }
        this._dirty = true;
        this._stat.chmod(mode);
        this.syncSync();
    };
    PreloadFile.prototype.isDirty = function () {
        return this._dirty;
    };
    /**
     * Resets the dirty bit. Should only be called after a sync has completed successfully.
     */
    PreloadFile.prototype.resetDirty = function () {
        this._dirty = false;
    };
    return PreloadFile;
}(file_1.BaseFile));
exports["default"] = PreloadFile;
/**
 * File class for the InMemory and XHR file systems.
 * Doesn't sync to anything, so it works nicely for memory-only files.
 */
var NoSyncFile = (function (_super) {
    __extends(NoSyncFile, _super);
    function NoSyncFile(_fs, _path, _flag, _stat, contents) {
        return _super.call(this, _fs, _path, _flag, _stat, contents) || this;
    }
    /**
     * Asynchronous sync. Doesn't do anything, simply calls the cb.
     * @param [Function(BrowserFS.ApiError)] cb
     */
    NoSyncFile.prototype.sync = function (cb) {
        cb();
    };
    /**
     * Synchronous sync. Doesn't do anything.
     */
    NoSyncFile.prototype.syncSync = function () {
        // NOP.
    };
    /**
     * Asynchronous close. Doesn't do anything, simply calls the cb.
     * @param [Function(BrowserFS.ApiError)] cb
     */
    NoSyncFile.prototype.close = function (cb) {
        cb();
    };
    /**
     * Synchronous close. Doesn't do anything.
     */
    NoSyncFile.prototype.closeSync = function () {
        // NOP.
    };
    return NoSyncFile;
}(PreloadFile));
exports.NoSyncFile = NoSyncFile;
//# sourceMappingURL=preload_file.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/path-browserify/index.js":
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/core/workers/ProxyWorker.ts":
/*!*****************************************!*\
  !*** ./src/core/workers/ProxyWorker.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const Worker = class {
  static get fnNames() {
    return [];
  }

  constructor() {
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;

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

        postMessage(r);
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
        postMessage({
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
    addEventListener("message", handleMessage);
  }

};
/* harmony default export */ __webpack_exports__["default"] = (Worker);

/***/ }),

/***/ "./src/scripts/PatchBrowserFSPreloadFile.js":
/*!**************************************************!*\
  !*** ./src/scripts/PatchBrowserFSPreloadFile.js ***!
  \**************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony import */ var browserfs_dist_node_generic_preload_file__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! browserfs/dist/node/generic/preload_file */ "./node_modules/browserfs/dist/node/generic/preload_file.js");
/* harmony import */ var browserfs_dist_node_generic_preload_file__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(browserfs_dist_node_generic_preload_file__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! browserfs/dist/node/core/api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
/* harmony import */ var browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1__);


/* eslint-disable no-param-reassign */
// eslint-disable-next-line func-names

browserfs_dist_node_generic_preload_file__WEBPACK_IMPORTED_MODULE_0___default.a.prototype.writeSync = function (buffer, offset, length, position) {
  this._dirty = true;

  if (position === undefined || position === null) {
    position = this.getPos();
  }

  if (!this._flag.isWriteable()) {
    throw new browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1__["ApiError"](browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1__["ErrorCode"].EPERM, "File not opened with a writeable mode.");
  }

  let len;

  if (!offset && !position && length === buffer.length) {
    this._stat.size = buffer.length;
    this._buffer = buffer;
    len = length;
  } else {
    const endFp = position + length;

    if (endFp > this._stat.size) {
      this._stat.size = endFp;

      if (endFp > this._buffer.length) {
        // Extend the buffer!
        const newBuff = Buffer.alloc(endFp);

        this._buffer.copy(newBuff);

        this._buffer = newBuff;
      }
    }

    len = buffer.copy(this._buffer, position, offset, offset + length);
  }

  this._stat.mtime = new Date();

  if (this._flag.isSynchronous()) {
    this.syncSync();
    return len;
  }

  this.setPos(position + len);
  return len;
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ })

/******/ });
//# sourceMappingURL=f93eeb8c3f3b608a3d74.worker.js.map