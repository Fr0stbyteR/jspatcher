/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
      var _a2, _b;
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

/***/ "./src/utils/buffer.ts":
/*!*****************************!*\
  !*** ./src/utils/buffer.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "absMax": () => (/* binding */ absMax),
/* harmony export */   "centroid": () => (/* binding */ centroid),
/* harmony export */   "conjugatedCentroid": () => (/* binding */ conjugatedCentroid),
/* harmony export */   "energy": () => (/* binding */ energy),
/* harmony export */   "estimateFreq": () => (/* binding */ estimateFreq),
/* harmony export */   "fftw2Amp": () => (/* binding */ fftw2Amp),
/* harmony export */   "flatness": () => (/* binding */ flatness),
/* harmony export */   "flux": () => (/* binding */ flux),
/* harmony export */   "geometricMean": () => (/* binding */ geometricMean),
/* harmony export */   "getSubTypedArray": () => (/* binding */ getSubTypedArray),
/* harmony export */   "indexToFreq": () => (/* binding */ indexToFreq),
/* harmony export */   "kurtosis": () => (/* binding */ kurtosis),
/* harmony export */   "maxIndex": () => (/* binding */ maxIndex),
/* harmony export */   "mean": () => (/* binding */ mean),
/* harmony export */   "median": () => (/* binding */ median),
/* harmony export */   "rms": () => (/* binding */ rms),
/* harmony export */   "rolloff": () => (/* binding */ rolloff),
/* harmony export */   "setTypedArray": () => (/* binding */ setTypedArray),
/* harmony export */   "skewness": () => (/* binding */ skewness),
/* harmony export */   "sliceBuffer": () => (/* binding */ sliceBuffer),
/* harmony export */   "slope": () => (/* binding */ slope),
/* harmony export */   "spread": () => (/* binding */ spread),
/* harmony export */   "sum": () => (/* binding */ sum),
/* harmony export */   "zcr": () => (/* binding */ zcr)
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
/* harmony export */   "atodb": () => (/* binding */ atodb),
/* harmony export */   "ceil": () => (/* binding */ ceil),
/* harmony export */   "dbtoa": () => (/* binding */ dbtoa),
/* harmony export */   "floor": () => (/* binding */ floor),
/* harmony export */   "iNormExp": () => (/* binding */ iNormExp),
/* harmony export */   "identityMatrix": () => (/* binding */ identityMatrix),
/* harmony export */   "isIdentityMatrix": () => (/* binding */ isIdentityMatrix),
/* harmony export */   "mod": () => (/* binding */ mod),
/* harmony export */   "normExp": () => (/* binding */ normExp),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "scaleClip": () => (/* binding */ scaleClip),
/* harmony export */   "toMIDI": () => (/* binding */ toMIDI),
/* harmony export */   "toRad": () => (/* binding */ toRad)
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

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MEASURE_UNIT_REGEX": () => (/* binding */ MEASURE_UNIT_REGEX),
/* harmony export */   "TIME_UNIT_REGEX": () => (/* binding */ TIME_UNIT_REGEX),
/* harmony export */   "ab2sab": () => (/* binding */ ab2sab),
/* harmony export */   "ab2str": () => (/* binding */ ab2str),
/* harmony export */   "chunkArray": () => (/* binding */ chunkArray),
/* harmony export */   "convertSampleToUnit": () => (/* binding */ convertSampleToUnit),
/* harmony export */   "convertUnitToSample": () => (/* binding */ convertUnitToSample),
/* harmony export */   "css2RgbaMax": () => (/* binding */ css2RgbaMax),
/* harmony export */   "decodeBPF": () => (/* binding */ decodeBPF),
/* harmony export */   "decodeCurve": () => (/* binding */ decodeCurve),
/* harmony export */   "decodeLine": () => (/* binding */ decodeLine),
/* harmony export */   "detectBrowserCore": () => (/* binding */ detectBrowserCore),
/* harmony export */   "detectOS": () => (/* binding */ detectOS),
/* harmony export */   "extToType": () => (/* binding */ extToType),
/* harmony export */   "fillRoundedRect": () => (/* binding */ fillRoundedRect),
/* harmony export */   "findFromAscendants": () => (/* binding */ findFromAscendants),
/* harmony export */   "getFactors": () => (/* binding */ getFactors),
/* harmony export */   "getPropertyDescriptor": () => (/* binding */ getPropertyDescriptor),
/* harmony export */   "getPropertyDescriptors": () => (/* binding */ getPropertyDescriptors),
/* harmony export */   "getRuler": () => (/* binding */ getRuler),
/* harmony export */   "getTimestamp": () => (/* binding */ getTimestamp),
/* harmony export */   "isMIDIEvent": () => (/* binding */ isMIDIEvent),
/* harmony export */   "isNumberArray": () => (/* binding */ isNumberArray),
/* harmony export */   "isRectMovable": () => (/* binding */ isRectMovable),
/* harmony export */   "isRectResizable": () => (/* binding */ isRectResizable),
/* harmony export */   "isStringArray": () => (/* binding */ isStringArray),
/* harmony export */   "isTPresentationRect": () => (/* binding */ isTPresentationRect),
/* harmony export */   "isTRect": () => (/* binding */ isTRect),
/* harmony export */   "isTypedArray": () => (/* binding */ isTypedArray),
/* harmony export */   "js2max": () => (/* binding */ js2max),
/* harmony export */   "max2js": () => (/* binding */ max2js),
/* harmony export */   "parseToPrimitive": () => (/* binding */ parseToPrimitive),
/* harmony export */   "rgbaMax2Css": () => (/* binding */ rgbaMax2Css),
/* harmony export */   "roundedRect": () => (/* binding */ roundedRect),
/* harmony export */   "sab2ab": () => (/* binding */ sab2ab),
/* harmony export */   "selectElementPos": () => (/* binding */ selectElementPos),
/* harmony export */   "selectElementRange": () => (/* binding */ selectElementRange),
/* harmony export */   "str2ab": () => (/* binding */ str2ab),
/* harmony export */   "stringifyError": () => (/* binding */ stringifyError),
/* harmony export */   "uuid": () => (/* binding */ uuid)
/* harmony export */ });

const uuid = () => {
  var _a;
  return ((_a = globalThis == null ? void 0 : globalThis.crypto) == null ? void 0 : _a.randomUUID) ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
const getTimestamp = () => {
  if (globalThis.performance) {
    return performance.now() + (performance.timeOrigin || performance.timing.navigationStart);
  }
  return Date.now();
};
const isStringArray = (x) => Array.isArray(x) && x.every((e) => typeof e === "string");
const isNumberArray = (x) => Array.isArray(x) && x.every((e) => typeof e === "number");
const isTypedArray = (x) => {
  return typeof x === "object" && (x instanceof Int8Array || x instanceof Int16Array || x instanceof Int32Array || x instanceof Uint8Array || x instanceof Uint8ClampedArray || x instanceof Uint16Array || x instanceof Uint32Array || x instanceof Float32Array || x instanceof Float64Array || x instanceof BigInt64Array || x instanceof BigUint64Array);
};
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
const chunkArray = (array, perChunk) => {
  return array.reduce((acc, cur, idx) => {
    const i = ~~(idx / perChunk);
    acc[i] = [...acc[i] || [], cur];
    return acc;
  }, []);
};
const decodeBPF = (sIn, tupleLength) => {
  if (typeof sIn === "number")
    return [[sIn]];
  if (isNumberArray(sIn))
    return chunkArray(sIn, tupleLength);
  if (Array.isArray(sIn) && sIn.every((a) => isNumberArray(a)))
    return sIn;
  if (typeof sIn !== "string")
    throw new Error("Failed to decode curve.");
  const numbers = sIn.split(" ").filter((s) => !!s).map((s) => +s);
  if (numbers.find((v) => !isFinite(v)))
    throw new Error("BPF contains invalid number.");
  return chunkArray(numbers, tupleLength);
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


/***/ }),

/***/ "./node_modules/window-function/apply.js":
/*!***********************************************!*\
  !*** ./node_modules/window-function/apply.js ***!
  \***********************************************/
/***/ ((module) => {



module.exports = function applyWindow(signal, func) {
  var i, n=signal.length, args=[0,n]

  // pass rest of args
  for(i=2; i<arguments.length; i++) {
    args[i] = arguments[i]
  }

  for(i=n-1; i>=0; i--) {
    args[0] = i
    signal[i] *= func.apply(null,args)
  }

  return signal;
}


/***/ }),

/***/ "./node_modules/window-function/bartlett-hann.js":
/*!*******************************************************!*\
  !*** ./node_modules/window-function/bartlett-hann.js ***!
  \*******************************************************/
/***/ ((module) => {



function bartlettHann (i,N) {
  var inm1 = i/(N-1),
      a0 = 0.62,
      a1 = 0.48,
      a2 = 0.38

  return a0 - a1 * Math.abs(inm1 - 0.5) - a2 * Math.cos(6.283185307179586*inm1)
}

module.exports = bartlettHann


/***/ }),

/***/ "./node_modules/window-function/bartlett.js":
/*!**************************************************!*\
  !*** ./node_modules/window-function/bartlett.js ***!
  \**************************************************/
/***/ ((module) => {



function bartlett (i,N) {
  return 1 - Math.abs( 2 * (i - 0.5*(N-1)) / (N-1) )
}

module.exports = bartlett


/***/ }),

/***/ "./node_modules/window-function/blackman-harris.js":
/*!*********************************************************!*\
  !*** ./node_modules/window-function/blackman-harris.js ***!
  \*********************************************************/
/***/ ((module) => {



function blackmanHarris (i,N) {
  var a0 = 0.35875,
      a1 = 0.48829,
      a2 = 0.14128,
      a3 = 0.01168,
      f = 6.283185307179586*i/(N-1)

  return a0 - a1*Math.cos(f) +a2*Math.cos(2*f) - a3*Math.cos(3*f)
}

module.exports = blackmanHarris


/***/ }),

/***/ "./node_modules/window-function/blackman-nuttall.js":
/*!**********************************************************!*\
  !*** ./node_modules/window-function/blackman-nuttall.js ***!
  \**********************************************************/
/***/ ((module) => {



function blackmanNuttall (i,N) {
  var a0 = 0.3635819,
      a1 = 0.4891775,
      a2 = 0.1365995,
      a3 = 0.0106411,
      f = 6.283185307179586*i/(N-1)

  return a0 - a1*Math.cos(f) +a2*Math.cos(2*f) - a3*Math.cos(3*f)
}

module.exports = blackmanNuttall


/***/ }),

/***/ "./node_modules/window-function/blackman.js":
/*!**************************************************!*\
  !*** ./node_modules/window-function/blackman.js ***!
  \**************************************************/
/***/ ((module) => {



function blackman (i,N) {
  var a0 = 0.42,
      a1 = 0.5,
      a2 = 0.08,
      f = 6.283185307179586*i/(N-1)

  return a0 - a1 * Math.cos(f) + a2*Math.cos(2*f)
}

module.exports = blackman


/***/ }),

/***/ "./node_modules/window-function/cosine.js":
/*!************************************************!*\
  !*** ./node_modules/window-function/cosine.js ***!
  \************************************************/
/***/ ((module) => {



function cosine (i,N) {
  return Math.sin(3.141592653589793*i/(N-1))
}

module.exports = cosine


/***/ }),

/***/ "./node_modules/window-function/exact-blackman.js":
/*!********************************************************!*\
  !*** ./node_modules/window-function/exact-blackman.js ***!
  \********************************************************/
/***/ ((module) => {



function exactBlackman (i,N) {
  var a0 = 0.42659,
      a1 = 0.49656,
      a2 = 0.076849,
      f = 6.283185307179586*i/(N-1)

  return a0 - a1 * Math.cos(f) + a2*Math.cos(2*f)
}

module.exports = exactBlackman


/***/ }),

/***/ "./node_modules/window-function/flat-top.js":
/*!**************************************************!*\
  !*** ./node_modules/window-function/flat-top.js ***!
  \**************************************************/
/***/ ((module) => {



function flatTop (i,N) {
  var a0 = 1,
      a1 = 1.93,
      a2 = 1.29,
      a3 = 0.388,
      a4 = 0.028,
      f = 6.283185307179586*i/(N-1)

  return a0 - a1*Math.cos(f) +a2*Math.cos(2*f) - a3*Math.cos(3*f) + a4 * Math.cos(4*f)
}

module.exports = flatTop


/***/ }),

/***/ "./node_modules/window-function/gaussian.js":
/*!**************************************************!*\
  !*** ./node_modules/window-function/gaussian.js ***!
  \**************************************************/
/***/ ((module) => {



function gaussian (i,N,sigma) {
  var nm12 = 0.5*(N-1),
      f = (i-nm12)/sigma/nm12

  return Math.exp(-0.5*f*f)
}

module.exports = gaussian


/***/ }),

/***/ "./node_modules/window-function/hamming.js":
/*!*************************************************!*\
  !*** ./node_modules/window-function/hamming.js ***!
  \*************************************************/
/***/ ((module) => {



function hamming (i,N) {
  return 0.54 - 0.46 * Math.cos(6.283185307179586*i/(N-1))
}

module.exports = hamming


/***/ }),

/***/ "./node_modules/window-function/hann.js":
/*!**********************************************!*\
  !*** ./node_modules/window-function/hann.js ***!
  \**********************************************/
/***/ ((module) => {



function hann (i,N) {
  return 0.5*(1 - Math.cos(6.283185307179586*i/(N-1)))
}

module.exports = hann


/***/ }),

/***/ "./node_modules/window-function/index.js":
/*!***********************************************!*\
  !*** ./node_modules/window-function/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = {
  lanczos: __webpack_require__(/*! ./lanczos */ "./node_modules/window-function/lanczos.js"),
  rectangular: __webpack_require__(/*! ./rectangular */ "./node_modules/window-function/rectangular.js"),
  triangular: __webpack_require__(/*! ./triangular */ "./node_modules/window-function/triangular.js"),
  bartlett: __webpack_require__(/*! ./bartlett */ "./node_modules/window-function/bartlett.js"),
  bartlettHann: __webpack_require__(/*! ./bartlett-hann */ "./node_modules/window-function/bartlett-hann.js"),
  welch: __webpack_require__(/*! ./welch */ "./node_modules/window-function/welch.js"),
  hann: __webpack_require__(/*! ./hann */ "./node_modules/window-function/hann.js"),
  hamming: __webpack_require__(/*! ./hamming */ "./node_modules/window-function/hamming.js"),
  blackman: __webpack_require__(/*! ./blackman */ "./node_modules/window-function/blackman.js"),
  nuttall: __webpack_require__(/*! ./nuttall */ "./node_modules/window-function/nuttall.js"),
  blackmanNuttall: __webpack_require__(/*! ./blackman-nuttall */ "./node_modules/window-function/blackman-nuttall.js"),
  blackmanHarris: __webpack_require__(/*! ./blackman-harris */ "./node_modules/window-function/blackman-harris.js"),
  exactBlackman: __webpack_require__(/*! ./exact-blackman */ "./node_modules/window-function/exact-blackman.js"),
  flatTop: __webpack_require__(/*! ./flat-top */ "./node_modules/window-function/flat-top.js"),
  cosine: __webpack_require__(/*! ./cosine */ "./node_modules/window-function/cosine.js"),
  gaussian: __webpack_require__(/*! ./gaussian */ "./node_modules/window-function/gaussian.js"),
  tukey: __webpack_require__(/*! ./tukey */ "./node_modules/window-function/tukey.js")
}


/***/ }),

/***/ "./node_modules/window-function/lanczos.js":
/*!*************************************************!*\
  !*** ./node_modules/window-function/lanczos.js ***!
  \*************************************************/
/***/ ((module) => {



function sinc (x) {
  return x === 0 ? 1 : 0.3183098861837907 * Math.sin(Math.PI*x) / x
}

function lanczos (i, N) {
  return sinc(2*i/(N-1)-1)
}

module.exports = lanczos


/***/ }),

/***/ "./node_modules/window-function/nuttall.js":
/*!*************************************************!*\
  !*** ./node_modules/window-function/nuttall.js ***!
  \*************************************************/
/***/ ((module) => {



var TWOPI = Math.PI * 2

function nuttall (i,N) {
  var a0 = 0.355768,
      a1 = 0.487396,
      a2 = 0.144232,
      a3 = 0.012604,
      f = TWOPI*i/(N-1)

  return a0 - a1*Math.cos(f) +a2*Math.cos(2*f) - a3*Math.cos(3*f)
}

module.exports = nuttall


/***/ }),

/***/ "./node_modules/window-function/rectangular.js":
/*!*****************************************************!*\
  !*** ./node_modules/window-function/rectangular.js ***!
  \*****************************************************/
/***/ ((module) => {



function rectangular (i,N) {
  return 1
}

module.exports = rectangular


/***/ }),

/***/ "./node_modules/window-function/triangular.js":
/*!****************************************************!*\
  !*** ./node_modules/window-function/triangular.js ***!
  \****************************************************/
/***/ ((module) => {



function triangular (i,N) {
  return 1 - Math.abs( 2 * (i - 0.5*(N-1)) / N )
}

module.exports = triangular


/***/ }),

/***/ "./node_modules/window-function/tukey.js":
/*!***********************************************!*\
  !*** ./node_modules/window-function/tukey.js ***!
  \***********************************************/
/***/ ((module) => {



function tukey (i,N, alpha) {
  var anm12 = 0.5*alpha*(N-1)

  if( i <= anm12 ) {
    return 0.5*(1+Math.cos(Math.PI*(i/anm12 - 1)))
  } else if ( i < (N-1)*(1-0.5*alpha) ) {
    return 1
  } else {
    return 0.5*(1+Math.cos(Math.PI*(i/anm12 - 2/alpha + 1)))
  }
}

module.exports = tukey


/***/ }),

/***/ "./node_modules/window-function/welch.js":
/*!***********************************************!*\
  !*** ./node_modules/window-function/welch.js ***!
  \***********************************************/
/***/ ((module) => {



function welch (i,N) {
  var nm12 = 0.5*(N-1),
      f = (i - nm12)/nm12
  return 1 - f*f
}

module.exports = welch


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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************************************************************************************************************!*\
  !*** ./node_modules/esbuild-loader/dist/index.js??ruleSet[1].rules[2].use!./src/core/worklets/FaustFFTProcessor.worklet.ts ***!
  \*****************************************************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var window_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! window-function */ "./node_modules/window-function/index.js");
/* harmony import */ var window_function__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(window_function__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var window_function_apply__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! window-function/apply */ "./node_modules/window-function/apply.js");
/* harmony import */ var window_function_apply__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(window_function_apply__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/buffer */ "./src/utils/buffer.ts");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AudioWorkletProxyProcessor */ "./src/core/worklets/AudioWorkletProxyProcessor.ts");






const processorId = "__JSPatcher_FaustFFTProcessor";
if (!globalThis.SharedArrayBuffer)
  globalThis.SharedArrayBuffer = ArrayBuffer;
const { registerProcessor, sampleRate, jspatcherEnv } = globalThis;
const fftToSignal = (f) => {
  const fftSize = f.length;
  const len = fftSize / 2 + 1;
  const r = new Float32Array(len);
  const i = new Float32Array(len);
  const b = new Float32Array(len);
  for (let j = 0; j < len; j++) {
    r[j] = f[j] / fftSize;
    i[j] = j === 0 || j === len - 1 ? 0 : f[fftSize - j] / fftSize;
    b[j] = j;
  }
  return [r, i, b];
};
const signalToFFT = (r, i) => {
  const len = (r.length - 1) * 2;
  const f = new Float32Array(len);
  for (let j = 0; j < r.length; j++) {
    f[j] = r[j];
    if (j === 0 || j === r.length - 1)
      continue;
    f[len - j] = i[j];
  }
  return f;
};
class FaustFFTProcessor extends _AudioWorkletProxyProcessor__WEBPACK_IMPORTED_MODULE_4__["default"] {
  constructor(options) {
    super(options);
    this.destroyed = false;
    /** Pointer of next start sample to write of the input window */
    this.$inputWrite = 0;
    /** Pointer of next start sample to read of the input window */
    this.$inputRead = 0;
    /** Pointer of next start sample to write of the output window */
    this.$outputWrite = 0;
    /** Pointer of next start sample to read of the output window */
    this.$outputRead = 0;
    /** audio data from input, array of channels */
    this.fftInput = [];
    /** audio data for output, array of channels */
    this.fftOutput = [];
    this.fftOverlap = 0;
    this.fftHopSize = 0;
    this.fftSize = 0;
    this.fftBufferSize = 0;
    this.windowFunction = window_function__WEBPACK_IMPORTED_MODULE_0__.blackman;
    this.fftProcessorFactory = options.processorOptions.factory;
    this.init();
  }
  static get parameterDescriptors() {
    return [{
      defaultValue: 1024,
      maxValue: 2 ** 32,
      minValue: 1,
      name: "fftSize"
    }, {
      defaultValue: 2,
      maxValue: 32,
      minValue: 1,
      name: "fftOverlap"
    }, {
      defaultValue: 3,
      maxValue: 4,
      minValue: 0,
      name: "windowFunction"
    }];
  }
  destroy() {
    var _a, _b;
    (_a = this.fftProcessor) == null ? void 0 : _a.stop();
    (_b = this.fftProcessor) == null ? void 0 : _b.destroy();
    this.destroyed = true;
    this._disposed = true;
  }
  get FFT1D() {
    return this.fftw.r2r.FFT1D;
  }
  get fftBins() {
    return this.fftSize / 2;
  }
  get fftProcessorBufferSize() {
    return this.fftSize / 2 + 1;
  }
  resetFFT(sizeIn, overlapIn, windowFunctionIn, inputChannels, outputChannels, bufferSize) {
    var _a;
    const fftSize = ~~(0,_utils_math__WEBPACK_IMPORTED_MODULE_3__.ceil)(Math.max(2, sizeIn || 1024), 2);
    const fftOverlap = ~~Math.min(fftSize, Math.max(1, overlapIn));
    const fftHopSize = ~~Math.max(1, fftSize / fftOverlap);
    const latency = fftSize - Math.min(fftHopSize, bufferSize);
    let windowFunction = null;
    if (windowFunctionIn !== 0) {
      const id = ["blackman", "hamming", "hann", "triangular"][~~windowFunctionIn - 1];
      windowFunction = window_function__WEBPACK_IMPORTED_MODULE_0__[id];
    }
    const fftSizeChanged = fftSize !== this.fftSize;
    if (fftSizeChanged || fftOverlap !== this.fftOverlap) {
      this.fftSize = fftSize;
      this.fftOverlap = fftOverlap;
      this.fftHopSize = fftHopSize;
      this.$inputWrite = 0;
      this.$inputRead = 0;
      this.$outputWrite = 0;
      this.$outputRead = -latency;
      this.fftBufferSize = Math.max(fftSize * 2 - this.fftHopSize, bufferSize * 2);
      if (!fftSizeChanged && this.fftHopSizeParam)
        this.fftProcessor.setParamValue(this.fftHopSizeParam, this.fftHopSize);
    }
    if (fftSizeChanged) {
      (_a = this.rfft) == null ? void 0 : _a.dispose();
      this.rfft = new this.FFT1D(fftSize);
      this.createFFTProcessor();
    }
    if (fftSizeChanged || windowFunction !== this.windowFunction) {
      this.windowFunction = windowFunction;
      this.window = new Float32Array(fftSize);
      this.window.fill(1);
      if (windowFunction)
        window_function_apply__WEBPACK_IMPORTED_MODULE_1___default()(this.window, windowFunction);
      this.windowSumSquare = new Float32Array(this.fftBufferSize);
    }
    if (this.fftInput.length > inputChannels) {
      this.fftInput.splice(inputChannels);
    }
    if (this.fftOutput.length > outputChannels) {
      this.fftOutput.splice(outputChannels);
    }
    if (fftSizeChanged) {
      for (let i = 0; i < inputChannels; i++) {
        this.fftInput[i] = new Float32Array(this.fftBufferSize);
      }
      for (let i = 0; i < outputChannels; i++) {
        this.fftOutput[i] = new Float32Array(this.fftBufferSize);
      }
    } else {
      if (this.fftInput.length < inputChannels) {
        for (let i = this.fftInput.length; i < inputChannels; i++) {
          this.fftInput[i] = new Float32Array(this.fftBufferSize);
        }
      }
      if (this.fftOutput.length < outputChannels) {
        for (let i = this.fftOutput.length; i < outputChannels; i++) {
          this.fftOutput[i] = new Float32Array(this.fftBufferSize);
        }
      }
    }
  }
  async init() {
    this.fftw = jspatcherEnv.fftw;
    await this.createFFTProcessor();
    return true;
  }
  processFFT() {
    let samplesForFFT = (0,_utils_math__WEBPACK_IMPORTED_MODULE_3__.mod)(this.$inputWrite - this.$inputRead, this.fftBufferSize) || this.fftBufferSize;
    while (samplesForFFT >= this.fftSize) {
      const fftProcessorInputs = [];
      const fftProcessorOutputs = new Array(this.fftProcessor.getNumOutputs()).fill(null).map(() => new Float32Array(this.fftProcessorBufferSize));
      for (let i = 0; i < this.fftInput.length; i++) {
        const fftBuffer = new Float32Array(this.fftSize);
        (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.setTypedArray)(fftBuffer, this.fftInput[i], 0, this.$inputRead);
        for (let j = 0; j < fftBuffer.length; j++) {
          fftBuffer[j] *= this.window[j];
        }
        const ffted = this.rfft.forward(fftBuffer);
        fftProcessorInputs.push(...fftToSignal(ffted));
      }
      this.$inputRead += this.fftHopSize;
      this.$inputRead %= this.fftBufferSize;
      samplesForFFT -= this.fftHopSize;
      this.fftProcessor.compute(fftProcessorInputs.slice(0, this.fftProcessor.getNumInputs()), fftProcessorOutputs);
      for (let i = 0; i < this.fftOutput.length; i++) {
        const ifftBuffer = signalToFFT(fftProcessorOutputs[i * 2] || new Float32Array(this.fftProcessorBufferSize), fftProcessorOutputs[i * 2 + 1] || new Float32Array(this.fftProcessorBufferSize));
        const iffted = this.rfft.inverse(ifftBuffer);
        for (let j = 0; j < iffted.length; j++) {
          iffted[j] *= this.window[j];
        }
        let $;
        for (let j = 0; j < iffted.length - this.fftHopSize; j++) {
          $ = (0,_utils_math__WEBPACK_IMPORTED_MODULE_3__.mod)(this.$outputWrite + j, this.fftBufferSize);
          this.fftOutput[i][$] += iffted[j];
          if (i === 0)
            this.windowSumSquare[$] += this.window[j] ** 2;
        }
        for (let j = iffted.length - this.fftHopSize; j < iffted.length; j++) {
          $ = (0,_utils_math__WEBPACK_IMPORTED_MODULE_3__.mod)(this.$outputWrite + j, this.fftBufferSize);
          this.fftOutput[i][$] = iffted[j];
          if (i === 0)
            this.windowSumSquare[$] = this.window[j] ** 2;
        }
      }
      this.$outputWrite += this.fftHopSize;
      this.$outputWrite %= this.fftBufferSize;
    }
  }
  async createFFTProcessor() {
    var _a, _b;
    (_a = this.fftProcessor) == null ? void 0 : _a.stop();
    (_b = this.fftProcessor) == null ? void 0 : _b.destroy();
    const { Faust } = jspatcherEnv;
    const { FaustMonoDspGenerator } = Faust;
    const gen = new FaustMonoDspGenerator();
    this.fftProcessor = await gen.createOfflineProcessor(sampleRate, this.fftProcessorBufferSize, this.fftProcessorFactory);
    const params = this.fftProcessor.getParams();
    this.fftProcessor.start();
    const fftSizeParam = params.find((s) => s.endsWith("/fftSize"));
    if (fftSizeParam)
      this.fftProcessor.setParamValue(fftSizeParam, this.fftSize);
    this.fftHopSizeParam = params.find((s) => s.endsWith("/fftHopSize"));
    if (this.fftHopSizeParam)
      this.fftProcessor.setParamValue(this.fftHopSizeParam, this.fftHopSize);
  }
  setProcessorParamValue(path, value) {
    var _a;
    (_a = this.fftProcessor) == null ? void 0 : _a.setParamValue(path, value);
  }
  process(inputs, outputs, parameters) {
    if (this.destroyed)
      return false;
    if (!this.fftw)
      return true;
    const input = inputs[0];
    const output = outputs[0];
    const inputChannels = input.length;
    const outputChannels = output.length;
    if (input.length === 0)
      return true;
    const bufferSize = Math.max(...input.map((c) => c.length)) || 128;
    this.resetFFT(~~parameters.fftSize[0], ~~parameters.fftOverlap[0], ~~parameters.windowFunction[0], inputChannels, outputChannels, bufferSize);
    if (!this.fftProcessor)
      return true;
    let $inputWrite;
    for (let i = 0; i < input.length; i++) {
      const inputWindow = this.fftInput[i];
      const channel = input[i].length ? input[i] : new Float32Array(bufferSize);
      $inputWrite = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.setTypedArray)(inputWindow, channel, this.$inputWrite);
    }
    this.$inputWrite = $inputWrite;
    this.processFFT();
    for (let i = 0; i < output.length; i++) {
      (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.setTypedArray)(output[i], this.fftOutput[i], 0, this.$outputRead);
      let div = 0;
      for (let j = 0; j < bufferSize; j++) {
        div = this.windowSumSquare[(0,_utils_math__WEBPACK_IMPORTED_MODULE_3__.mod)(this.$outputRead + j, this.fftBufferSize)];
        output[i][j] /= div < Number.EPSILON ? 1 : div;
      }
    }
    this.$outputRead += bufferSize;
    this.$outputRead %= this.fftBufferSize;
    return true;
  }
}
try {
  registerProcessor(processorId, FaustFFTProcessor);
} catch (error) {
  console.warn(error);
}

})();

/******/ })()
;
//# sourceMappingURL=1e75ad1554262d64766d.worklet.js.map