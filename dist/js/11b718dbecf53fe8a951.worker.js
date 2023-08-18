/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

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
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
exports.__esModule = true;
var api_error_1 = __webpack_require__(/*! ./api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var file_flag_1 = __webpack_require__(/*! ./file_flag */ "./node_modules/browserfs/dist/node/core/file_flag.js");
var path = __webpack_require__(/*! path */ "./node_modules/path/path.js");
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

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/api_error.js":
/*!************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/api_error.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
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

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/file.js":
/*!*******************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/file.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
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
var api_error_1 = __webpack_require__(/*! ./api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var file_flag_1 = __webpack_require__(/*! ./file_flag */ "./node_modules/browserfs/dist/node/core/file_flag.js");
var path = __webpack_require__(/*! path */ "./node_modules/path/path.js");
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

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/global.js":
/*!*********************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/global.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.__esModule = true;
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
    toExport = __webpack_require__.g;
}
exports["default"] = toExport;
//# sourceMappingURL=global.js.map

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/levenshtein.js":
/*!**************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/levenshtein.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
exports.__esModule = true;
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

/***/ }),

/***/ "./node_modules/browserfs/dist/node/core/util.js":
/*!*******************************************************!*\
  !*** ./node_modules/browserfs/dist/node/core/util.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
exports.__esModule = true;
var api_error_1 = __webpack_require__(/*! ./api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var levenshtein_1 = __webpack_require__(/*! ./levenshtein */ "./node_modules/browserfs/dist/node/core/levenshtein.js");
var path = __webpack_require__(/*! path */ "./node_modules/path/path.js");
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

/***/ }),

/***/ "./node_modules/browserfs/dist/node/generic/inode.js":
/*!***********************************************************!*\
  !*** ./node_modules/browserfs/dist/node/generic/inode.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
exports.__esModule = true;
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

/***/ }),

/***/ "./node_modules/browserfs/dist/node/generic/key_value_filesystem.js":
/*!**************************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/generic/key_value_filesystem.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
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
var file_system_1 = __webpack_require__(/*! ../core/file_system */ "./node_modules/browserfs/dist/node/core/file_system.js");
var api_error_1 = __webpack_require__(/*! ../core/api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
var node_fs_stats_1 = __webpack_require__(/*! ../core/node_fs_stats */ "./node_modules/browserfs/dist/node/core/node_fs_stats.js");
var path = __webpack_require__(/*! path */ "./node_modules/path/path.js");
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

/***/ }),

/***/ "./node_modules/browserfs/dist/node/generic/preload_file.js":
/*!******************************************************************!*\
  !*** ./node_modules/browserfs/dist/node/generic/preload_file.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
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

/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
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
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
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
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
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
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
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
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
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
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

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

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
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

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
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

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
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
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
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
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

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

  let i
  if (dir) {
    let foundIndex = -1
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
      let found = true
      for (let j = 0; j < valLength; j++) {
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
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
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
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

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
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

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
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
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

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
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
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
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
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
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
  value = +value
  offset = offset >>> 0
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
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
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
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
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
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
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

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
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
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
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
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./src/core/workers/ProxyWorker.ts":
/*!*****************************************!*\
  !*** ./src/core/workers/ProxyWorker.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

var _a;
const Worker = (_a = class {
  constructor() {
    this._disposed = false;
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = -1;
    const handleDisposed = () => {
      removeEventListener("message", handleMessage);
      close();
    };
    const handleMessage = async (e) => {
      var _a2, _b;
      const { id, call: call2, args, value, error } = e.data;
      if (call2) {
        const r = { id };
        try {
          r.value = await this[call2](...args);
        } catch (e2) {
          r.error = e2;
        }
        postMessage(r);
        if (this._disposed)
          handleDisposed();
      } else {
        if (error)
          (_a2 = rejects[id]) == null ? void 0 : _a2.call(rejects, error);
        else if (resolves[id])
          (_b = resolves[id]) == null ? void 0 : _b.call(resolves, value);
        delete resolves[id];
        delete rejects[id];
      }
    };
    const call = (call2, ...args) => new Promise((resolve, reject) => {
      const id = messagePortRequestId--;
      resolves[id] = resolve;
      rejects[id] = reject;
      postMessage({ id, call: call2, args });
    });
    const Ctor = this.constructor;
    Ctor.fnNames.forEach((name) => this[name] = (...args) => call(name, ...args));
    addEventListener("message", handleMessage);
  }
}, _a.fnNames = [], _a);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Worker);


/***/ }),

/***/ "./src/scripts/PatchBrowserFSPreloadFile.js":
/*!**************************************************!*\
  !*** ./src/scripts/PatchBrowserFSPreloadFile.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var browserfs_dist_node_generic_preload_file__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! browserfs/dist/node/generic/preload_file */ "./node_modules/browserfs/dist/node/generic/preload_file.js");
/* harmony import */ var browserfs_dist_node_generic_preload_file__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(browserfs_dist_node_generic_preload_file__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! browserfs/dist/node/core/api_error */ "./node_modules/browserfs/dist/node/core/api_error.js");
/* harmony import */ var browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1__);
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];



(browserfs_dist_node_generic_preload_file__WEBPACK_IMPORTED_MODULE_0___default().prototype).writeSync = function(buffer, offset, length, position) {
  this._dirty = true;
  if (position === void 0 || position === null) {
    position = this.getPos();
  }
  if (!this._flag.isWriteable()) {
    throw new browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1__.ApiError(browserfs_dist_node_core_api_error__WEBPACK_IMPORTED_MODULE_1__.ErrorCode.EPERM, "File not opened with a writeable mode.");
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


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
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

/***/ "./node_modules/path/node_modules/inherits/inherits_browser.js":
/*!*********************************************************************!*\
  !*** ./node_modules/path/node_modules/inherits/inherits_browser.js ***!
  \*********************************************************************/
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ "./node_modules/path/node_modules/util/support/isBufferBrowser.js":
/*!************************************************************************!*\
  !*** ./node_modules/path/node_modules/util/support/isBufferBrowser.js ***!
  \************************************************************************/
/***/ ((module) => {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ "./node_modules/path/node_modules/util/util.js":
/*!*****************************************************!*\
  !*** ./node_modules/path/node_modules/util/util.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(__webpack_require__.g.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = ({"NODE_ENV":"development"}).NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "./node_modules/path/node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(/*! inherits */ "./node_modules/path/node_modules/inherits/inherits_browser.js");

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}


/***/ }),

/***/ "./node_modules/path/path.js":
/*!***********************************!*\
  !*** ./node_modules/path/path.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
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




var isWindows = ({}) === 'win32';
var util = __webpack_require__(/*! util */ "./node_modules/path/node_modules/util/util.js");


// resolves . and .. elements in a path array with directory names there
// must be no slashes or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  var res = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];

    // ignore empty parts
    if (!p || p === '.')
      continue;

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop();
      } else if (allowAboveRoot) {
        res.push('..');
      }
    } else {
      res.push(p);
    }
  }

  return res;
}

// returns an array with empty elements removed from either end of the input
// array or the original array if no elements need to be removed
function trimArray(arr) {
  var lastIndex = arr.length - 1;
  var start = 0;
  for (; start <= lastIndex; start++) {
    if (arr[start])
      break;
  }

  var end = lastIndex;
  for (; end >= 0; end--) {
    if (arr[end])
      break;
  }

  if (start === 0 && end === lastIndex)
    return arr;
  if (start > end)
    return [];
  return arr.slice(start, end + 1);
}

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
var splitDeviceRe =
    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
var splitTailRe =
    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

var win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  var result = splitDeviceRe.exec(filename),
      device = (result[1] || '') + (result[2] || ''),
      tail = result[3] || '';
  // Split the tail into dir, basename and extension
  var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3];
  return [device, dir, basename, ext];
}

function win32StatPath(path) {
  var result = splitDeviceRe.exec(path),
      device = result[1] || '',
      isUnc = !!device && device[1] !== ':';
  return {
    device: device,
    isUnc: isUnc,
    isAbsolute: isUnc || !!result[2], // UNC paths are always absolute
    tail: result[3]
  };
}

function normalizeUNCRoot(device) {
  return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
}

// path.resolve([from ...], to)
win32.resolve = function() {
  var resolvedDevice = '',
      resolvedTail = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1; i--) {
    var path;
    if (i >= 0) {
      path = arguments[i];
    } else if (!resolvedDevice) {
      path = process.cwd();
    } else {
      // Windows has the concept of drive-specific current working
      // directories. If we've resolved a drive letter but not yet an
      // absolute path, get cwd for that drive. We're sure the device is not
      // an unc path at this points, because unc paths are always absolute.
      path = ({"NODE_ENV":"development"})['=' + resolvedDevice];
      // Verify that a drive-local cwd was found and that it actually points
      // to our drive. If not, default to the drive's root.
      if (!path || path.substr(0, 3).toLowerCase() !==
          resolvedDevice.toLowerCase() + '\\') {
        path = resolvedDevice + '\\';
      }
    }

    // Skip empty and invalid entries
    if (!util.isString(path)) {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    var result = win32StatPath(path),
        device = result.device,
        isUnc = result.isUnc,
        isAbsolute = result.isAbsolute,
        tail = result.tail;

    if (device &&
        resolvedDevice &&
        device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      // This path points to another device so it is not applicable
      continue;
    }

    if (!resolvedDevice) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = tail + '\\' + resolvedTail;
      resolvedAbsolute = isAbsolute;
    }

    if (resolvedDevice && resolvedAbsolute) {
      break;
    }
  }

  // Convert slashes to backslashes when `resolvedDevice` points to an UNC
  // root. Also squash multiple slashes into a single one where appropriate.
  if (isUnc) {
    resolvedDevice = normalizeUNCRoot(resolvedDevice);
  }

  // At this point the path should be resolved to a full absolute path,
  // but handle relative paths to be safe (might happen when process.cwd()
  // fails)

  // Normalize the tail path
  resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/),
                                !resolvedAbsolute).join('\\');

  return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
         '.';
};


win32.normalize = function(path) {
  var result = win32StatPath(path),
      device = result.device,
      isUnc = result.isUnc,
      isAbsolute = result.isAbsolute,
      tail = result.tail,
      trailingSlash = /[\\\/]$/.test(tail);

  // Normalize the tail path
  tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join('\\');

  if (!tail && !isAbsolute) {
    tail = '.';
  }
  if (tail && trailingSlash) {
    tail += '\\';
  }

  // Convert slashes to backslashes when `device` points to an UNC root.
  // Also squash multiple slashes into a single one where appropriate.
  if (isUnc) {
    device = normalizeUNCRoot(device);
  }

  return device + (isAbsolute ? '\\' : '') + tail;
};


win32.isAbsolute = function(path) {
  return win32StatPath(path).isAbsolute;
};

win32.join = function() {
  var paths = [];
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!util.isString(arg)) {
      throw new TypeError('Arguments to path.join must be strings');
    }
    if (arg) {
      paths.push(arg);
    }
  }

  var joined = paths.join('\\');

  // Make sure that the joined path doesn't start with two slashes, because
  // normalize() will mistake it for an UNC path then.
  //
  // This step is skipped when it is very clear that the user actually
  // intended to point at an UNC path. This is assumed when the first
  // non-empty string arguments starts with exactly two slashes followed by
  // at least one more non-slash character.
  //
  // Note that for normalize() to treat a path as an UNC path it needs to
  // have at least 2 components, so we don't filter for that here.
  // This means that the user can use join to construct UNC paths from
  // a server name and a share name; for example:
  //   path.join('//server', 'share') -> '\\\\server\\share\')
  if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
    joined = joined.replace(/^[\\\/]{2,}/, '\\');
  }

  return win32.normalize(joined);
};


// path.relative(from, to)
// it will solve the relative path from 'from' to 'to', for instance:
// from = 'C:\\orandea\\test\\aaa'
// to = 'C:\\orandea\\impl\\bbb'
// The output of the function should be: '..\\..\\impl\\bbb'
win32.relative = function(from, to) {
  from = win32.resolve(from);
  to = win32.resolve(to);

  // windows is not case sensitive
  var lowerFrom = from.toLowerCase();
  var lowerTo = to.toLowerCase();

  var toParts = trimArray(to.split('\\'));

  var lowerFromParts = trimArray(lowerFrom.split('\\'));
  var lowerToParts = trimArray(lowerTo.split('\\'));

  var length = Math.min(lowerFromParts.length, lowerToParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (lowerFromParts[i] !== lowerToParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  if (samePartsLength == 0) {
    return to;
  }

  var outputParts = [];
  for (var i = samePartsLength; i < lowerFromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('\\');
};


win32._makeLong = function(path) {
  // Note: this will *probably* throw somewhere.
  if (!util.isString(path))
    return path;

  if (!path) {
    return '';
  }

  var resolvedPath = win32.resolve(path);

  if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
    // path is local filesystem path, which needs to be converted
    // to long UNC path.
    return '\\\\?\\' + resolvedPath;
  } else if (/^\\\\[^?.]/.test(resolvedPath)) {
    // path is network UNC path, which needs to be converted
    // to long UNC path.
    return '\\\\?\\UNC\\' + resolvedPath.substring(2);
  }

  return path;
};


win32.dirname = function(path) {
  var result = win32SplitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


win32.basename = function(path, ext) {
  var f = win32SplitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


win32.extname = function(path) {
  return win32SplitPath(path)[3];
};


win32.format = function(pathObject) {
  if (!util.isObject(pathObject)) {
    throw new TypeError(
        "Parameter 'pathObject' must be an object, not " + typeof pathObject
    );
  }

  var root = pathObject.root || '';

  if (!util.isString(root)) {
    throw new TypeError(
        "'pathObject.root' must be a string or undefined, not " +
        typeof pathObject.root
    );
  }

  var dir = pathObject.dir;
  var base = pathObject.base || '';
  if (!dir) {
    return base;
  }
  if (dir[dir.length - 1] === win32.sep) {
    return dir + base;
  }
  return dir + win32.sep + base;
};


win32.parse = function(pathString) {
  if (!util.isString(pathString)) {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


win32.sep = '\\';
win32.delimiter = ';';


// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var posix = {};


function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}


// path.resolve([from ...], to)
// posix version
posix.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (!util.isString(path)) {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path[0] === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(resolvedPath.split('/'),
                                !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
posix.normalize = function(path) {
  var isAbsolute = posix.isAbsolute(path),
      trailingSlash = path && path[path.length - 1] === '/';

  // Normalize the path
  path = normalizeArray(path.split('/'), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
posix.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
posix.join = function() {
  var path = '';
  for (var i = 0; i < arguments.length; i++) {
    var segment = arguments[i];
    if (!util.isString(segment)) {
      throw new TypeError('Arguments to path.join must be strings');
    }
    if (segment) {
      if (!path) {
        path += segment;
      } else {
        path += '/' + segment;
      }
    }
  }
  return posix.normalize(path);
};


// path.relative(from, to)
// posix version
posix.relative = function(from, to) {
  from = posix.resolve(from).substr(1);
  to = posix.resolve(to).substr(1);

  var fromParts = trimArray(from.split('/'));
  var toParts = trimArray(to.split('/'));

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


posix._makeLong = function(path) {
  return path;
};


posix.dirname = function(path) {
  var result = posixSplitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


posix.basename = function(path, ext) {
  var f = posixSplitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


posix.extname = function(path) {
  return posixSplitPath(path)[3];
};


posix.format = function(pathObject) {
  if (!util.isObject(pathObject)) {
    throw new TypeError(
        "Parameter 'pathObject' must be an object, not " + typeof pathObject
    );
  }

  var root = pathObject.root || '';

  if (!util.isString(root)) {
    throw new TypeError(
        "'pathObject.root' must be a string or undefined, not " +
        typeof pathObject.root
    );
  }

  var dir = pathObject.dir ? pathObject.dir + posix.sep : '';
  var base = pathObject.base || '';
  return dir + base;
};


posix.parse = function(pathString) {
  if (!util.isString(pathString)) {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


posix.sep = '/';
posix.delimiter = ':';


if (isWindows)
  module.exports = win32;
else /* posix */
  module.exports = posix;

module.exports.posix = posix;
module.exports.win32 = win32;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.js??ruleSet[1].rules[2].use!./src/core/workers/FileMgr.worker.ts ***!
  \*****************************************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var browserfs_dist_node_backend_IndexedDB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! browserfs/dist/node/backend/IndexedDB */ "./node_modules/browserfs/dist/node/backend/IndexedDB.js");
/* harmony import */ var browserfs_dist_node_backend_IndexedDB__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(browserfs_dist_node_backend_IndexedDB__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var browserfs_dist_node_core_file_flag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! browserfs/dist/node/core/file_flag */ "./node_modules/browserfs/dist/node/core/file_flag.js");
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js");
/* harmony import */ var _scripts_PatchBrowserFSPreloadFile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../scripts/PatchBrowserFSPreloadFile */ "./src/scripts/PatchBrowserFSPreloadFile.js");
/* harmony import */ var _ProxyWorker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ProxyWorker */ "./src/core/workers/ProxyWorker.ts");






class FileMgr extends _ProxyWorker__WEBPACK_IMPORTED_MODULE_4__["default"] {
  init() {
    return new Promise((resolve, reject) => browserfs_dist_node_backend_IndexedDB__WEBPACK_IMPORTED_MODULE_0___default().Create({ storeName: "JSPatcher" }, (e, r) => {
      if (e) {
        reject(e);
      } else {
        this.fs = r;
        resolve(true);
      }
    }));
  }
  mkdir(path) {
    return new Promise((resolve, reject) => this.fs.mkdir(path, 511, (e) => e ? reject(e) : resolve(true)));
  }
  createFile(path, data) {
    Object.setPrototypeOf(data, buffer__WEBPACK_IMPORTED_MODULE_2__.Buffer.prototype);
    return new Promise((resolve, reject) => {
      this.fs.createFile(path, new browserfs_dist_node_core_file_flag__WEBPACK_IMPORTED_MODULE_1__.FileFlag("w"), 511, (e, r) => e ? reject(e) : r.write(data, 0, data.byteLength, null, (e2) => e2 ? reject(e2) : r.close((e3) => e3 ? reject(e3) : resolve(true))));
    });
  }
  rename(oldPath, newPath) {
    return new Promise((resolve, reject) => this.fs.rename(oldPath, newPath, (e) => e ? reject(e) : resolve(true)));
  }
  exists(path) {
    return new Promise((resolve) => this.fs.exists(path, resolve));
  }
  readdir(path) {
    return new Promise((resolve, reject) => this.fs.readdir(path, (e, r) => e ? reject(e) : resolve(r)));
  }
  readFile(path) {
    return new Promise((resolve, reject) => this.fs.readFile(path, null, new browserfs_dist_node_core_file_flag__WEBPACK_IMPORTED_MODULE_1__.FileFlag("r"), (e, r) => e ? reject(e) : resolve(r.buffer)));
  }
  unlink(path) {
    return new Promise((resolve, reject) => this.fs.unlink(path, (e) => e ? reject(e) : resolve(true)));
  }
  rmdir(path) {
    return new Promise((resolve, reject) => this.fs.rmdir(path, (e) => e ? reject(e) : resolve(true)));
  }
  isFile(path) {
    return new Promise((resolve, reject) => this.fs.stat(path, false, (e, r) => e ? reject(e) : resolve(r.isFile())));
  }
  empty() {
    return new Promise((resolve, reject) => this.fs.empty((e) => e ? reject(e) : resolve(true)));
  }
}
new FileMgr();

})();

/******/ })()
;
//# sourceMappingURL=11b718dbecf53fe8a951.worker.js.map