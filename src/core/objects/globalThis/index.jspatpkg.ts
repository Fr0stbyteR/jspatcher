/* eslint-disable no-shadow-restricted-names */
/* eslint-disable @typescript-eslint/no-unused-vars */
import DefaultImporter from "../importer/DefaultImporter";
/*
const { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
    // Lot of non-enumerables
    // Value properties
    Infinity,
    NaN,
    // undefined,
    // Function properties
    // eval,
    // uneval,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    escape,
    unescape,
    // Fundamental objects
    Object,
    Function,
    Boolean,
    Symbol,
    Error,
    // AggregateError,
    EvalError,
    // InternalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    // Numbers and dates
    Number,
    BigInt,
    Math,
    Date,
    // Text processing
    String,
    RegExp,
    // Indexed collections
    Array,
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,
    // Keyed collections
    Map,
    Set,
    WeakMap,
    WeakSet,
    // Structured data
    ArrayBuffer,
    SharedArrayBuffer,
    Atomics,
    DataView,
    JSON,
    // Control abstraction objects
    Promise,
    // Generator,
    // GeneratorFunction,
    // AsyncFunction,
    // Reflection
    Reflect,
    Proxy,
    // Internationalization
    Intl,
    // WebAssembly
    WebAssembly
} = window;*/
const lib = DefaultImporter.import("globalThis", globalThis, true);
// Importer.import("Window", { Array }, lib);

export default lib;
