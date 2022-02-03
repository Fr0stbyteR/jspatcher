{

/***/ "./src/core/audio/AudioEditor.ts":
/*!***************************************!*\
  !*** ./src/core/audio/AudioEditor.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioEditor)
/* harmony export */ });
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _AudioPlayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioPlayer */ "./src/core/audio/AudioPlayer.ts");
/* harmony import */ var _AudioRecorder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioRecorder */ "./src/core/audio/AudioRecorder.ts");
/* harmony import */ var _file_FileEditor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../file/FileEditor */ "./src/core/file/FileEditor.ts");
/* harmony import */ var _TempAudioFile__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TempAudioFile */ "./src/core/audio/TempAudioFile.ts");
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





class AudioEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_3__.default {
  constructor() {
    super(...arguments);
    this.player = new _AudioPlayer__WEBPACK_IMPORTED_MODULE_1__.default(this);
    this.recorder = new _AudioRecorder__WEBPACK_IMPORTED_MODULE_2__.default(this);
    this.state = {
      playing: "stopped",
      monitoring: false,
      loop: true,
      recording: false,
      cursor: 0,
      selRange: null,
      viewRange: [0, 0],
      enabledChannels: [],
      plugins: new Array(10).fill(void 0),
      pluginsEnabled: new WeakSet(),
      pluginsShowing: new WeakSet(),
      preFxGain: 0,
      postFxGain: 0
    };
    this.handleSetAudio = () => {
      const { cursor, selRange, viewRange } = this.state;
      const { length, numberOfChannels } = this;
      if (cursor > length)
        this.setCursor(length);
      if (selRange && selRange[1] > length)
        this.setSelRange(selRange);
      if (viewRange[1] > length)
        this.setViewRange(viewRange);
      if (this.state.enabledChannels.length !== numberOfChannels) {
        const enabledChannels = new Array(numberOfChannels).fill(true);
        this.state.enabledChannels.slice(numberOfChannels).forEach((v, i) => enabledChannels[i] = v);
        this.setState({ enabledChannels });
        this.emit("enabledChannels", enabledChannels);
      }
      this.emit("setAudio");
    };
    this.handlePlayerEnded = (cursor) => {
      const playing = "stopped";
      this.setState({ playing });
      this.emit("playing", playing);
      this.setCursor(cursor);
    };
    this.handleInputChanged = async (deviceId) => {
      await this.recorder.newSearch(deviceId);
      if (this.state.monitoring)
        this.player.startMonitoring();
    };
  }
  static async fromProjectItem({ file, env, project, instanceId }) {
    const audio = file instanceof _TempAudioFile__WEBPACK_IMPORTED_MODULE_4__.default ? file.data : await file.instantiate({ env, project, instanceId });
    const editor = new this(audio);
    return editor.init();
  }
  get fileExtension() {
    return "wav";
  }
  get fileIcon() {
    return "music";
  }
  get clipboard() {
    return this.env.audioClipboard;
  }
  set clipboard(audio) {
    this.env.audioClipboard = audio;
  }
  get ctx() {
    return this.instance.ctx;
  }
  get audioCtx() {
    return this.instance.audioCtx;
  }
  get length() {
    return this.instance.length;
  }
  get numberOfChannels() {
    return this.instance.numberOfChannels;
  }
  get sampleRate() {
    return this.instance.sampleRate;
  }
  get audioBuffer() {
    return this.instance.audioBuffer;
  }
  get waveform() {
    return this.instance.waveform;
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
    this.setState({
      viewRange: [0, this.length],
      enabledChannels: new Array(this.numberOfChannels).fill(true)
    });
    this.instance.on("setAudio", this.handleSetAudio);
    this.on("changed", () => this.instance.emit("changed"));
    await this.env.taskMgr.newTask(this, "Initializing Audio Editor...", async () => {
      await this.player.init();
      await this.recorder.init();
    });
    this._isReady = true;
    this.emit("ready");
    return this;
  }
  setState(state) {
    Object.assign(this.state, state);
  }
  onUiResized() {
    this.emit("uiResized");
  }
  get pluginsState() {
    const { plugins, pluginsEnabled, pluginsShowing, preFxGain, postFxGain } = this.state;
    return {
      plugins: plugins.slice(),
      pluginsEnabled: plugins.map((p) => pluginsEnabled.has(p)),
      pluginsShowing: plugins.map((p) => pluginsShowing.has(p)),
      preFxGain,
      postFxGain
    };
  }
  emitPluginsChanged() {
    this.emit("pluginsChanged", this.pluginsState);
  }
  emitUIResized() {
    this.emit("uiResized");
  }
  emitSelRangeToPlay() {
    this.emit("selRangeToPlay", this.state.selRange);
  }
  zoomH(refIn, factor) {
    const { viewRange } = this.state;
    const { length } = this;
    const [viewStart, viewEnd] = viewRange;
    const viewLength = viewEnd - viewStart;
    const minRange = Math.min(length, 5);
    const ref = Math.max(0, Math.min(length, Math.round(refIn)));
    if (ref < viewStart || ref > viewEnd) {
      const start = Math.max(0, Math.min(length - viewLength, Math.round(ref - viewLength / 2)));
      const end = Math.max(viewLength, Math.min(length, Math.round(ref + viewLength / 2)));
      const range = [start, end];
      this.setState({ viewRange: range });
      this.emit("viewRange", range);
    } else if (factor < 0 || viewLength > minRange) {
      const multiplier = 1.5 ** -factor;
      const start = ref - (ref - viewStart) * multiplier;
      const end = ref + (viewEnd - ref) * multiplier;
      this.setViewRange([start, end]);
    }
  }
  scrollH(speed) {
    const { viewRange } = this.state;
    const { length } = this;
    const [viewStart, viewEnd] = viewRange;
    const viewLength = viewEnd - viewStart;
    const deltaSamples = viewLength * speed;
    const start = Math.min(length - viewLength, viewStart + deltaSamples);
    const end = Math.max(viewLength, viewEnd + deltaSamples);
    this.setViewRange([start, end]);
  }
  setEnabledChannel(channel, enabled) {
    const enabledChannels = this.state.enabledChannels.slice();
    enabledChannels[channel] = enabled;
    this.setState({ enabledChannels });
    this.emit("enabledChannels", enabledChannels);
  }
  setLoop(loop) {
    this.setState({ loop });
    this.emit("loop", loop);
  }
  setRecording(recording) {
    this.setState({ recording });
    this.emit("recording", recording);
  }
  setCursor(cursorIn, fromPlayer) {
    const shouldReplay = !fromPlayer && this.state.playing === "playing";
    if (shouldReplay)
      this.stop();
    const { length } = this;
    const cursor = Math.max(0, Math.min(length, Math.round(cursorIn)));
    this.setState({ cursor });
    this.emit("cursor", cursor);
    if (shouldReplay)
      this.play();
  }
  setSelRange(range) {
    if (!range) {
      this.setState({ selRange: null });
      this.emit("selRange", null);
      return;
    }
    const { length } = this;
    let [start, end] = range;
    if (end < start)
      [start, end] = [end, start];
    start = Math.max(0, Math.min(length - 1, Math.round(start)));
    end = Math.max(1, Math.min(length, Math.round(end)));
    if (start === end) {
      this.setState({ selRange: null });
      this.emit("selRange", null);
      return;
    }
    const selRange = [start, end];
    this.setState({ selRange, cursor: start });
    this.emit("selRange", selRange);
    this.emit("cursor", start);
  }
  setSelRangeToAll() {
    const { length } = this;
    const selRange = [0, length];
    this.setState({ selRange });
    this.emit("selRange", selRange);
    this.emitSelRangeToPlay();
  }
  async selectAll() {
    this.setSelRangeToAll();
  }
  async deleteSelected() {
    this.delete();
  }
  setViewRange(range) {
    const { length } = this;
    let [start, end] = range;
    if (end < start)
      [start, end] = [end, start];
    const minRange = Math.min(length, 5);
    start = Math.max(0, Math.min(length - minRange, Math.round(start)));
    end = Math.max(minRange, Math.min(length, Math.round(end)));
    const viewRange = [start, end];
    this.setState({ viewRange });
    this.emit("viewRange", viewRange);
  }
  setViewRangeToAll() {
    const { length } = this;
    const viewRange = [0, length];
    this.setState({ viewRange });
    this.emit("viewRange", viewRange);
  }
  async cut() {
    const { selRange } = this.state;
    if (!selRange)
      return;
    const [selStart, selEnd] = selRange;
    this.setSelRange(null);
    this.clipboard = await this.instance.removeFromRange(selStart, selEnd);
    const oldAudio = this.clipboard;
    this.emit("cutEnd", { range: [selStart, selEnd], oldAudio });
  }
  async copy() {
    const { selRange } = this.state;
    if (!selRange)
      return;
    const [selStart, selEnd] = selRange;
    this.clipboard = await this.instance.pick(selStart, selEnd, true);
  }
  async paste() {
    const { clipboard } = this;
    if (!clipboard)
      return;
    const { cursor, selRange } = this.state;
    if (selRange) {
      const [selStart, selEnd] = selRange;
      const oldAudio = await this.instance.pasteToRange(clipboard, selStart, selEnd);
      this.emit("pasted", { range: [selStart, selEnd], audio: clipboard, oldAudio });
    } else {
      this.instance.insertToCursor(clipboard, cursor);
      this.emit("pasted", { cursor, audio: clipboard });
    }
  }
  async delete() {
    const { selRange } = this.state;
    if (!selRange)
      return;
    const [selStart, selEnd] = selRange;
    this.setSelRange(null);
    const oldAudio = await this.instance.removeFromRange(selStart, selEnd);
    this.emit("deleted", { range: [selStart, selEnd], oldAudio });
  }
  async silence() {
    const { selRange } = this.state;
    if (!selRange)
      return;
    const silenced = await this.instance.silence(...selRange);
    if (silenced)
      this.emit("silenced", silenced);
  }
  async insertSilence(length) {
    if (!length)
      return;
    const { cursor } = this.state;
    const inserted = await this.instance.insertSilence(length, cursor);
    if (inserted)
      this.emit("insertedSilence", inserted);
  }
  async reverse() {
    const { selRange } = this.state;
    const [selStart, selEnd] = selRange || [0, this.length];
    const audio = await this.instance.pick(selStart, selEnd, true);
    audio.reverse();
    const oldAudio = await this.instance.pasteToRange(audio, selStart, selEnd);
    this.emit("reversed", { range: [0, this.length], audio, oldAudio });
  }
  async inverse() {
    const { selRange } = this.state;
    const [selStart, selEnd] = selRange || [0, this.length];
    const audio = await this.instance.pick(selStart, selEnd, true);
    audio.inverse();
    const oldAudio = await this.instance.pasteToRange(audio, selStart, selEnd);
    this.emit("inversed", { range: [selStart, selEnd], audio, oldAudio });
  }
  async fade(gain) {
    const { selRange, enabledChannels } = this.state;
    if (!selRange)
      return;
    const faded = await this.instance.fade(gain, ...selRange, enabledChannels);
    if (faded)
      this.emit("faded", faded);
  }
  async fadeIn(length, exponent) {
    const { enabledChannels } = this.state;
    const faded = await this.instance.fadeIn(length, exponent, enabledChannels);
    if (faded)
      this.emit("fadedIn", faded);
  }
  async fadeOut(length, exponent) {
    const { enabledChannels } = this.state;
    const faded = await this.instance.fadeOut(length, exponent, enabledChannels);
    if (faded)
      this.emit("fadedOut", faded);
  }
  async resample(to) {
    if (to <= 0)
      return;
    const oldAudio = await this.instance.clone();
    if (oldAudio.sampleRate === to)
      return;
    const audio = await this.instance.render(to);
    this.instance.setAudio(audio);
    this.emit("resampled", { audio, oldAudio });
  }
  async remixChannels(mix) {
    const oldAudio = await this.instance.clone();
    const audio = await this.instance.render(void 0, mix);
    this.instance.setAudio(audio);
    this.emit("remixed", { audio, oldAudio });
  }
  async applyPlugins(selected) {
    const { selRange, plugins, pluginsEnabled, preFxGain, postFxGain } = this.state;
    if (plugins.every((p) => !p || !pluginsEnabled.has(p)))
      return;
    if (selected && !selRange)
      return;
    const oldAudio = selected ? await this.instance.pick(...selRange) : await this.instance.clone();
    const audio = await oldAudio.render(void 0, void 0, true, { plugins, pluginsEnabled, preFxGain, postFxGain });
    if (selected)
      await this.instance.pasteToRange(audio, ...selRange);
    else
      this.instance.setAudio(audio);
    plugins.forEach((p, i) => {
      if (!p)
        return;
      this.setPluginEnabled(i, false);
    });
    this.emit("pluginsApplied", __spreadProps(__spreadValues({}, selected ? { range: selRange } : {}), { audio, oldAudio }));
  }
  play() {
    const playing = "playing";
    this.setState({ playing });
    this.emit("playing", playing);
    this.player.play();
  }
  pause() {
    const playing = "paused";
    this.setState({ playing });
    this.emit("playing", playing);
    this.player.stop();
  }
  resume() {
    const playing = "playing";
    this.setState({ playing });
    this.emit("playing", playing);
    this.player.play();
  }
  stop() {
    const playing = "stopped";
    this.setState({ playing });
    this.emit("playing", playing);
    this.player.stop();
  }
  startMonitoring() {
    const monitoring = true;
    this.setState({ monitoring });
    this.emit("monitoring", monitoring);
    this.player.startMonitoring();
  }
  stopMonitoring() {
    const monitoring = false;
    this.setState({ monitoring });
    this.emit("monitoring", monitoring);
    this.player.stopMonitoring();
  }
  async startRecord() {
    this.stop();
    const started = await this.recorder.start();
    if (!started)
      return;
    this.setState({ recording: true });
    this.emit("recording", true);
  }
  async stopRecord() {
    await this.recorder.stop();
    this.setState({ recording: false });
    this.emit("recording", false);
  }
  async addPlugin(url, index) {
    return this.env.taskMgr.newTask(this, "Adding Plugin...", () => this.player.addPlugin(url, index));
  }
  removePlugin(index) {
    this.player.removePlugin(index);
  }
  movePlugin(fromIndex, toIndex) {
    this.player.movePlugin(fromIndex, toIndex);
  }
  setPluginEnabled(index, enabled) {
    this.player.setPluginEnabled(index, enabled);
  }
  setPluginShowing(index, showing) {
    const { plugins, pluginsShowing } = this.state;
    const plugin = plugins[index];
    if (!plugin)
      return;
    if (showing)
      pluginsShowing.add(plugin);
    else
      pluginsShowing.delete(plugin);
    this.emitPluginsChanged();
  }
  setPreFxGain(gain) {
    this.state.preFxGain = gain;
    const { playing, monitoring } = this.state;
    if (monitoring || playing === "playing")
      this.player.preFxGainNode.gain.setTargetAtTime((0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.dbtoa)(gain), this.env.audioCtx.currentTime, 0.01);
  }
  setPostFxGain(gain) {
    this.state.postFxGain = gain;
    const { playing, monitoring } = this.state;
    if (monitoring || playing === "playing")
      this.player.postFxGainNode.gain.setTargetAtTime((0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.dbtoa)(gain), this.env.audioCtx.currentTime, 0.01);
  }
  async destroy() {
    this._isReady = false;
    this.instance.off("setAudio", this.handleSetAudio);
    if (this.state.recording)
      await this.stopRecord();
    if (this.state.playing !== "stopped")
      this.stop();
    for (let i = 0; i < this.state.plugins.length; i++) {
      this.removePlugin(i);
    }
    await this.recorder.destroy();
    await this.player.destroy();
    await super.destroy();
  }
}


/***/ }),

/***/ "./src/core/audio/AudioHistory.ts":
/*!****************************************!*\
  !*** ./src/core/audio/AudioHistory.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioHistory)
/* harmony export */ });
/* harmony import */ var _file_History__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../file/History */ "./src/core/file/History.ts");

class AudioHistory extends _file_History__WEBPACK_IMPORTED_MODULE_0__.default {
  get eventListening() {
    return ["faded", "fadedIn", "fadedOut", "cutEnd", "pasted", "deleted", "silenced", "insertedSilence", "reversed", "inversed", "resampled", "remixed", "recorded", "pluginsApplied"];
  }
  async undoOf(editor, eventName, eventData) {
    if (eventName === "faded") {
      const e = eventData;
      const { range: [selStart, selEnd], oldAudio } = e;
      await editor.instance.pasteToRange(oldAudio, selStart, selEnd);
    } else if (eventName === "fadedIn") {
      const e = eventData;
      const { length, oldAudio } = e;
      await editor.instance.pasteToRange(oldAudio, 0, length);
    } else if (eventName === "fadedOut") {
      const e = eventData;
      const { length, oldAudio } = e;
      const l = editor.instance.audioBuffer.length;
      await editor.instance.pasteToRange(oldAudio, l - length, l);
    } else if (eventName === "cutEnd") {
      const e = eventData;
      const { range: [cursor], oldAudio } = e;
      await editor.instance.insertToCursor(oldAudio, cursor);
    } else if (eventName === "pasted") {
      const e = eventData;
      const { range, cursor, audio, oldAudio } = e;
      if (range) {
        await editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
      } else {
        await editor.instance.removeFromRange(cursor, cursor + audio.length);
      }
    } else if (eventName === "deleted") {
      const e = eventData;
      const { range: [cursor], oldAudio } = e;
      await editor.instance.insertToCursor(oldAudio, cursor);
    } else if (eventName === "silenced") {
      const e = eventData;
      const { range: [from, to], oldAudio } = e;
      await editor.instance.pasteToRange(oldAudio, from, to);
    } else if (eventName === "insertedSilence") {
      const e = eventData;
      const { range: [from, to] } = e;
      await editor.instance.removeFromRange(from, to);
    } else if (eventName === "reversed") {
      const e = eventData;
      const { range: [from, to], oldAudio } = e;
      await editor.instance.pasteToRange(oldAudio, from, to);
    } else if (eventName === "inversed") {
      const e = eventData;
      const { range: [from, to], oldAudio } = e;
      await editor.instance.pasteToRange(oldAudio, from, to);
    } else if (eventName === "resampled") {
      const e = eventData;
      const { oldAudio } = e;
      editor.instance.setAudio(oldAudio);
    } else if (eventName === "remixed") {
      const e = eventData;
      const { oldAudio } = e;
      editor.instance.setAudio(oldAudio);
    } else if (eventName === "recorded") {
      const e = eventData;
      const { range, cursor, audio, oldAudio } = e;
      if (range) {
        await editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
      } else {
        await editor.instance.removeFromRange(cursor, cursor + audio.length);
      }
    } else if (eventName === "pluginsApplied") {
      const e = eventData;
      const { range, audio, oldAudio } = e;
      if (range) {
        await editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
      } else {
        editor.instance.setAudio(oldAudio);
      }
    }
  }
  async redoOf(editor, eventName, eventData) {
    if (eventName === "faded") {
      const e = eventData;
      const { range: [selStart, selEnd], audio } = e;
      await editor.instance.pasteToRange(audio, selStart, selEnd);
    } else if (eventName === "fadedIn") {
      const e = eventData;
      const { length, audio } = e;
      await editor.instance.pasteToRange(audio, 0, length);
    } else if (eventName === "fadedOut") {
      const e = eventData;
      const { length, audio } = e;
      const l = audio.length;
      await editor.instance.pasteToRange(audio, l - length, l);
    } else if (eventName === "cutEnd") {
      const e = eventData;
      const { range: [selStart, selEnd] } = e;
      await editor.instance.removeFromRange(selStart, selEnd);
    } else if (eventName === "pasted") {
      const e = eventData;
      const { range, cursor, audio, oldAudio } = e;
      if (range) {
        await editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
      } else {
        await editor.instance.insertToCursor(audio, cursor);
      }
    } else if (eventName === "deleted") {
      const e = eventData;
      const { range: [selStart, selEnd] } = e;
      await editor.instance.removeFromRange(selStart, selEnd);
    } else if (eventName === "silenced") {
      const e = eventData;
      const { range: [from, to], audio } = e;
      await editor.instance.pasteToRange(audio, from, to);
    } else if (eventName === "insertedSilence") {
      const e = eventData;
      const { range: [cursor], audio } = e;
      await editor.instance.insertToCursor(audio, cursor);
    } else if (eventName === "reversed") {
      const e = eventData;
      const { range: [from, to], audio } = e;
      await editor.instance.pasteToRange(audio, from, to);
    } else if (eventName === "inversed") {
      const e = eventData;
      const { range: [from, to], audio } = e;
      await editor.instance.pasteToRange(audio, from, to);
    } else if (eventName === "resampled") {
      const e = eventData;
      const { audio } = e;
      editor.instance.setAudio(audio);
    } else if (eventName === "remixed") {
      const e = eventData;
      const { audio } = e;
      editor.instance.setAudio(audio);
    } else if (eventName === "recorded") {
      const e = eventData;
      const { range, cursor, audio, oldAudio } = e;
      if (range) {
        await editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
      } else {
        await editor.instance.insertToCursor(audio, cursor);
      }
    } else if (eventName === "pluginsApplied") {
      const e = eventData;
      const { range, audio, oldAudio } = e;
      if (range) {
        await editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
      } else {
        editor.instance.setAudio(audio);
      }
    }
  }
}


/***/ }),

/***/ "./src/core/audio/AudioPlayer.ts":
/*!***************************************!*\
  !*** ./src/core/audio/AudioPlayer.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioPlayer)
/* harmony export */ });
/* harmony import */ var _worklets_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../worklets/TemporalAnalyser */ "./src/core/worklets/TemporalAnalyser.ts");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/math */ "./src/utils/math.ts");


class AudioPlayer {
  constructor(editor) {
    this.handleLoopChanged = (loopIn) => {
      const { bufferSourceNode, editor } = this;
      if (!bufferSourceNode)
        return;
      const { buffer, loop } = bufferSourceNode;
      if (loop === loopIn)
        return;
      const { sampleRate } = buffer;
      const selRange = editor.state.selRange;
      bufferSourceNode.loop = loopIn;
      if (loopIn) {
        if (selRange) {
          bufferSourceNode.loopStart = selRange[0] / sampleRate;
          bufferSourceNode.loopEnd = selRange[1] / sampleRate;
        } else {
          bufferSourceNode.loopStart = 0;
          bufferSourceNode.loopEnd = 0;
        }
        bufferSourceNode.stop(Number.MAX_VALUE);
      } else {
        bufferSourceNode.loopStart = 0;
        bufferSourceNode.loopEnd = 0;
        if (selRange)
          bufferSourceNode.stop(this.currentTime + (selRange[1] - this.currentSample) / sampleRate);
        else
          bufferSourceNode.stop(Number.MAX_VALUE);
      }
    };
    this.handleSelRangeChanged = (selRange) => {
      const { bufferSourceNode } = this;
      if (!bufferSourceNode)
        return;
      const { buffer, loop } = bufferSourceNode;
      const { sampleRate } = buffer;
      if (loop) {
        if (selRange) {
          bufferSourceNode.loopStart = selRange[0] / sampleRate;
          bufferSourceNode.loopEnd = selRange[1] / sampleRate;
        } else {
          bufferSourceNode.loopStart = 0;
          bufferSourceNode.loopEnd = 0;
        }
      } else {
        bufferSourceNode.loopStart = 0;
        bufferSourceNode.loopEnd = 0;
        if (selRange)
          bufferSourceNode.stop(this.currentTime + (selRange[1] - this.currentSample) / sampleRate);
        else
          bufferSourceNode.stop(Number.MAX_VALUE);
      }
    };
    this.handleEnded = () => {
      const { bufferSourceNode } = this;
      if (!bufferSourceNode)
        return;
      this.editor.handlePlayerEnded(this.getCurrentSample());
      this.bufferSourceNode.removeEventListener("ended", this.handleEnded);
      this.bufferSourceNode.disconnect();
      this.splitterNode.disconnect();
      this.mergerNode.disconnect();
      delete this.bufferSourceNode;
      delete this.splitterNode;
      delete this.mergerNode;
    };
    this.handleEnabledChannelsChanged = (enabledChannels) => {
      const { bufferSourceNode } = this;
      if (!bufferSourceNode)
        return;
      this.currentChannels.forEach((enabled, i) => {
        if (enabledChannels[i] !== enabled) {
          if (enabledChannels[i])
            this.splitterNode.connect(this.mergerNode, i, i);
          else
            this.splitterNode.disconnect(this.mergerNode, i, i);
        }
      });
      this.currentChannels = enabledChannels.slice();
    };
    this.updateCursorScheduled = false;
    this.$updateCursorRaf = -1;
    this.updateCursorCallback = () => {
      this.$updateCursorRaf = -1;
      this.updateCursorScheduled = false;
      this.updateCursor();
    };
    this.scheduleUpdateCursor = () => {
      if (this.updateCursorScheduled)
        return;
      if (this.$updateCursorRaf === -1)
        this.$updateCursorRaf = requestAnimationFrame(this.updateCursorCallback);
      this.updateCursorScheduled = true;
    };
    this.editor = editor;
    this.playing = false;
    this.monitoring = false;
    this.dummyAnalyserNode = this.audioCtx.createAnalyser();
    this.preFxGainNode = this.audioCtx.createGain();
    this.postFxGainNode = this.audioCtx.createGain();
    this.postFxGainNode.connect(this.destination);
    this.editor.on("loop", this.handleLoopChanged);
    this.editor.on("selRangeToPlay", this.handleSelRangeChanged);
    this.editor.on("enabledChannels", this.handleEnabledChannelsChanged);
  }
  get audioCtx() {
    return this.editor.audioCtx;
  }
  get destination() {
    return this.audioCtx.destination;
  }
  get loop() {
    var _a;
    return (_a = this.bufferSourceNode) == null ? void 0 : _a.loop;
  }
  updateCursor() {
    if (!this.bufferSourceNode)
      return;
    this.editor.setCursor(this.getCurrentSample(), true);
    this.scheduleUpdateCursor();
  }
  async init() {
    const audioWorklet = this.audioCtx.audioWorklet;
    await _worklets_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_0__.default.register(audioWorklet);
    this.postAnalyserNode = new _worklets_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_0__.default(this.audioCtx);
    this.postFxGainNode.connect(this.postAnalyserNode);
  }
  async destroy() {
    if (this.monitoring)
      this.stopMonitoring();
    if (this.playing)
      this.stop();
    await this.postAnalyserNode.destroy();
  }
  getCurrentSample() {
    var _a;
    const { buffer } = this.bufferSourceNode;
    const delta = (this.audioCtx.currentTime - this.currentTime) * buffer.sampleRate;
    const selRange = ((_a = this.editor.state) == null ? void 0 : _a.selRange) || [0, buffer.length];
    this.currentSample += delta;
    this.currentTime = this.audioCtx.currentTime;
    if (this.loop) {
      if (this.currentSample > selRange[1])
        this.currentSample = (this.currentSample - selRange[0]) % (selRange[1] - selRange[0]) + selRange[0];
    } else {
      if (this.currentSample > selRange[1])
        this.currentSample = selRange[1];
    }
    return ~~this.currentSample;
  }
  play() {
    this.stop();
    const audio = this.editor;
    const { cursor, selRange, enabledChannels, preFxGain, postFxGain, loop } = this.editor.state;
    const { sampleRate, numberOfChannels, audioBuffer } = audio;
    const offset = (selRange ? selRange[0] : cursor) / sampleRate;
    const duration = selRange ? (selRange[1] - selRange[0]) / sampleRate : void 0;
    const bufferSourceNode = this.audioCtx.createBufferSource();
    bufferSourceNode.channelCountMode = "explicit";
    bufferSourceNode.channelInterpretation = "discrete";
    bufferSourceNode.channelCount = numberOfChannels;
    this.currentTime = this.audioCtx.currentTime;
    this.currentSample = selRange ? selRange[0] : cursor;
    this.currentChannels = enabledChannels.slice();
    this.bufferSourceNode = bufferSourceNode;
    this.splitterNode = this.audioCtx.createChannelSplitter(numberOfChannels);
    this.mergerNode = this.audioCtx.createChannelMerger(numberOfChannels);
    this.mergerNode.channelInterpretation = "discrete";
    this.preFxGainNode.gain.value = (0,_utils_math__WEBPACK_IMPORTED_MODULE_1__.dbtoa)(preFxGain);
    this.postFxGainNode.gain.value = (0,_utils_math__WEBPACK_IMPORTED_MODULE_1__.dbtoa)(postFxGain);
    bufferSourceNode.buffer = audioBuffer;
    bufferSourceNode.connect(this.dummyAnalyserNode);
    bufferSourceNode.connect(this.splitterNode);
    enabledChannels.forEach((enabled, i) => {
      if (enabled && i < numberOfChannels)
        this.splitterNode.connect(this.mergerNode, i, i);
    });
    this.mergerNode.connect(this.preFxGainNode);
    if (!this.monitoring)
      this.connectPlugins();
    bufferSourceNode.loop = !!loop;
    bufferSourceNode.addEventListener("ended", this.handleEnded);
    if (loop) {
      if (duration) {
        bufferSourceNode.loopStart = offset;
        bufferSourceNode.loopEnd = offset + duration;
      }
      bufferSourceNode.start(this.currentTime, offset);
    } else {
      bufferSourceNode.start(this.currentTime, offset);
      if (duration)
        bufferSourceNode.stop(this.currentTime + duration);
      else
        bufferSourceNode.stop(Number.MAX_VALUE);
    }
    this.playing = true;
    this.scheduleUpdateCursor();
  }
  stop() {
    if (!this.bufferSourceNode)
      return;
    this.bufferSourceNode.stop();
    this.bufferSourceNode.removeEventListener("ended", this.handleEnded);
    this.bufferSourceNode.disconnect();
    this.splitterNode.disconnect();
    this.mergerNode.disconnect();
    if (!this.monitoring)
      this.disconnectPlugins();
    delete this.bufferSourceNode;
    delete this.splitterNode;
    delete this.mergerNode;
    this.playing = false;
  }
  startMonitoring() {
    this.stopMonitoring();
    const sourceNode = this.editor.recorder.node;
    if (!sourceNode)
      return;
    this.mediaStreamSourceNode = sourceNode;
    if (!this.playing)
      this.connectPlugins();
    this.mediaStreamSourceNode.connect(this.preFxGainNode);
    this.monitoring = true;
  }
  stopMonitoring() {
    if (!this.mediaStreamSourceNode)
      return;
    this.mediaStreamSourceNode.disconnect(this.preFxGainNode);
    if (!this.playing)
      this.disconnectPlugins();
    delete this.mediaStreamSourceNode;
    this.monitoring = false;
  }
  connectPlugins() {
    const { plugins, pluginsEnabled } = this.editor.state;
    let firstPluginNode;
    let lastPluginNode;
    plugins.forEach((p) => {
      if (!p)
        return;
      if (!pluginsEnabled.has(p))
        return;
      if (!firstPluginNode)
        firstPluginNode = p.audioNode;
      lastPluginNode = p.audioNode;
    });
    if (firstPluginNode) {
      this.preFxGainNode.connect(firstPluginNode);
      lastPluginNode.connect(this.postFxGainNode);
    } else {
      this.preFxGainNode.connect(this.postFxGainNode);
    }
  }
  disconnectPlugins() {
    const { plugins, pluginsEnabled } = this.editor.state;
    this.preFxGainNode.disconnect();
    let lastPluginNode;
    plugins.forEach((p) => {
      if (!p)
        return;
      if (!pluginsEnabled.has(p))
        return;
      lastPluginNode = p.audioNode;
    });
    if (lastPluginNode)
      lastPluginNode.disconnect(this.postFxGainNode);
  }
  async addPlugin(url, indexIn) {
    const { plugins, pluginsEnabled } = this.editor.state;
    const { default: Plugin } = await import(
      /* webpackIgnore: true */
      url
    );
    const plugin = await Plugin.createInstance(this.editor.instance.wamGroupId, this.audioCtx);
    const { audioNode } = plugin;
    const usingPlugins = this.playing || this.monitoring;
    let preNode;
    let postNode;
    let index = indexIn;
    while (index >= 0) {
      index--;
      if (plugins[index]) {
        preNode = plugins[index].audioNode;
        break;
      }
    }
    if (!preNode && usingPlugins)
      preNode = this.preFxGainNode;
    index = indexIn;
    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }
      index++;
    }
    if (!postNode && usingPlugins)
      postNode = this.postFxGainNode;
    audioNode.connect(this.dummyAnalyserNode);
    if (preNode && postNode)
      preNode.disconnect(postNode);
    if (preNode)
      preNode.connect(audioNode);
    if (postNode)
      audioNode.connect(postNode);
    plugins.splice(indexIn, 0, plugin);
    pluginsEnabled.add(plugin);
    this.editor.emitPluginsChanged();
    return plugin;
  }
  removePlugin(indexIn) {
    const { plugins, pluginsEnabled } = this.editor.state;
    const plugin = plugins[indexIn];
    if (!plugin)
      return;
    const { audioNode } = plugin;
    const usingPlugins = this.playing || this.monitoring;
    let preNode;
    let postNode;
    let index = indexIn - 1;
    while (index >= 0) {
      if (plugins[index]) {
        preNode = plugins[index].audioNode;
        break;
      }
      index--;
    }
    if (!preNode && usingPlugins)
      preNode = this.preFxGainNode;
    index = indexIn + 1;
    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }
      index++;
    }
    if (!postNode && usingPlugins)
      postNode = this.postFxGainNode;
    audioNode.disconnect();
    if (pluginsEnabled.has(plugin) && preNode) {
      preNode.disconnect(audioNode);
      if (postNode)
        preNode.connect(postNode);
    }
    if (plugin.audioNode)
      plugin.audioNode.destroy();
    delete plugins[indexIn];
    plugins.splice(indexIn, 1);
    if (plugins.length < 10)
      plugins.push(void 0);
    this.editor.emitPluginsChanged();
  }
  movePlugin(fromIndexIn, toIndexIn) {
    const { plugins, pluginsEnabled } = this.editor.state;
    if (!plugins[fromIndexIn])
      return;
    const plugin = plugins[fromIndexIn];
    const { audioNode } = plugin;
    const usingPlugins = this.playing || this.monitoring;
    const enabled = pluginsEnabled.has(plugin);
    let preNode;
    let postNode;
    let index = fromIndexIn - 1;
    while (index >= 0) {
      if (plugins[index]) {
        preNode = plugins[index].audioNode;
        break;
      }
      index--;
    }
    if (!preNode && usingPlugins)
      preNode = this.preFxGainNode;
    index = fromIndexIn + 1;
    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }
      index++;
    }
    if (!postNode && usingPlugins)
      postNode = this.postFxGainNode;
    if (enabled) {
      if (preNode)
        preNode.disconnect(audioNode);
      if (postNode)
        audioNode.disconnect(postNode);
      if (preNode && postNode)
        preNode.connect(postNode);
    }
    plugins.splice(fromIndexIn, 1);
    preNode = void 0;
    postNode = void 0;
    index = toIndexIn - 1;
    while (index >= 0) {
      if (plugins[index]) {
        preNode = plugins[index].audioNode;
        break;
      }
      index--;
    }
    if (!preNode && usingPlugins)
      preNode = this.preFxGainNode;
    index = toIndexIn + 1;
    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }
      index++;
    }
    if (!postNode && usingPlugins)
      postNode = this.postFxGainNode;
    if (enabled) {
      if (preNode && postNode)
        preNode.disconnect(postNode);
      if (preNode)
        preNode.connect(audioNode);
      if (postNode)
        audioNode.connect(postNode);
    }
    plugins.splice(toIndexIn, 0, plugin);
    this.editor.emitPluginsChanged();
  }
  setPluginEnabled(indexIn, enabled) {
    const { plugins, pluginsEnabled } = this.editor.state;
    const plugin = plugins[indexIn];
    if (!plugin)
      return;
    if (pluginsEnabled.has(plugin) === enabled)
      return;
    let index = indexIn - 1;
    const { audioNode } = plugins[indexIn];
    const usingPlugins = this.playing || this.monitoring;
    let preNode;
    let postNode;
    while (index >= 0) {
      if (plugins[index]) {
        preNode = plugins[index].audioNode;
        break;
      }
      index--;
    }
    if (!preNode && usingPlugins)
      preNode = this.preFxGainNode;
    index = indexIn + 1;
    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }
      index++;
    }
    if (!postNode && usingPlugins)
      postNode = this.postFxGainNode;
    if (enabled) {
      if (preNode && postNode)
        preNode.disconnect(postNode);
      if (preNode)
        preNode.connect(audioNode);
      if (postNode)
        audioNode.connect(postNode);
    } else {
      if (preNode)
        preNode.disconnect(audioNode);
      if (postNode)
        audioNode.disconnect(postNode);
      if (preNode && postNode)
        preNode.connect(postNode);
    }
    if (enabled)
      pluginsEnabled.add(plugin);
    else
      pluginsEnabled.delete(plugin);
    this.editor.emitPluginsChanged();
  }
}


/***/ }),

/***/ "./src/core/audio/AudioRecorder.ts":
/*!*****************************************!*\
  !*** ./src/core/audio/AudioRecorder.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioRecorder)
/* harmony export */ });
/* harmony import */ var _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OperableAudioBuffer */ "./src/core/audio/OperableAudioBuffer.ts");
/* harmony import */ var _PatcherAudio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PatcherAudio */ "./src/core/audio/PatcherAudio.ts");
/* harmony import */ var _worklets_Transmitter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../worklets/Transmitter */ "./src/core/worklets/Transmitter.ts");
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



class AudioRecorder {
  constructor(editor) {
    this.constraints = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
    this.recording = false;
    this.handleDeviceChange = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const enums = devices.filter((d) => d.kind === "audioinput").map((d) => d.label || d.deviceId);
      if (enums.indexOf(this.device) === -1) {
        this.device = devices.find((d) => d.deviceId === "default") ? "default" : devices.length ? devices[0].deviceId : "default";
        await this.newSearch(this.device);
      }
    };
    this.handleReceiveBuffer = async (bufferIn, $total) => {
      if (!this.recording)
        return;
      let extended = false;
      const { $, $start, $end, inPlace, audio, overwrittenAudio } = this;
      const { length, numberOfChannels, sampleRate } = audio;
      const $target = $start + $total;
      const copyLength = (inPlace ? Math.min($target, $end) : $target) - $;
      if (!inPlace && $target > length) {
        const newLength = 2 ** Math.ceil(Math.log(length + sampleRate) / Math.log(2));
        const newBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_0__.default({ numberOfChannels, length: newLength, sampleRate });
        for (let i = 0; i < numberOfChannels; i++) {
          const channel = newBuffer.getChannelData(i);
          channel.set(audio.audioBuffer.getChannelData(i));
          if (bufferIn[i]) {
            if (overwrittenAudio && $ < $end) {
              const overwrittenChannel = overwrittenAudio.audioBuffer.getChannelData(i);
              overwrittenChannel.set(channel.subarray($, $end), $ - $start);
            }
            channel.set(bufferIn[i], $);
          }
        }
        audio.instance.audioBuffer = newBuffer;
        audio.waveform.update($, newLength);
        extended = true;
      } else {
        for (let i = 0; i < numberOfChannels; i++) {
          const channel = audio.audioBuffer.getChannelData(i);
          if (bufferIn[i]) {
            if (overwrittenAudio && $ < $end) {
              const overwrittenChannel = overwrittenAudio.audioBuffer.getChannelData(i);
              overwrittenChannel.set(channel.subarray($, Math.min($ + copyLength, $end)), $ - $start);
            }
            if (!inPlace || $target <= $end)
              channel.set(bufferIn[i], $);
            else
              channel.set(bufferIn[i].subarray(0, copyLength), $);
          }
        }
        audio.waveform.update($, $ + copyLength);
      }
      this.$ += copyLength;
      audio.instance.emit("setAudio");
      this.editor.setCursor(this.$);
      if (extended)
        this.editor.setViewRange([this.editor.state.viewRange[0], this.audio.length]);
      if (inPlace && this.$ === $end) {
        this.editor.setRecording(false);
        await this.stop();
      }
    };
    this.newSearch = async (search) => {
      if (this.device && this.device === search)
        return;
      if (this.stream && (this.recording || this.editor.player.monitoring)) {
        this.node.disconnect();
        this.stream.getAudioTracks().forEach((t) => t.stop());
        delete this.node;
        delete this.stream;
        delete this.editor.player.mediaStreamSourceNode;
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const enums = devices.filter((d) => d.kind === "audioinput");
      if (search) {
        const device = devices.find((d) => d.kind === "audioinput" && (d.deviceId === search || d.label === search));
        if (device)
          this.device = device.deviceId;
      } else {
        this.device = enums.length ? enums[0].deviceId : void 0;
      }
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: this.getConstraints(this.device) });
      if (this.stream) {
        if (this.recording || this.editor.player.monitoring) {
          this.resetNode();
          this.node.connect(this.transmitter);
          if (this.editor.player.monitoring)
            this.node.connect(this.editor.player.preFxGainNode);
          else
            this.node.connect(this.editor.player.postAnalyserNode);
        } else {
          this.resetNode();
        }
      }
    };
    this.editor = editor;
    navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
  }
  get audioCtx() {
    return this.editor.audioCtx;
  }
  get audio() {
    return this.editor;
  }
  async init() {
    await _worklets_Transmitter__WEBPACK_IMPORTED_MODULE_2__.default.register(this.audioCtx.audioWorklet);
    this.transmitter = new _worklets_Transmitter__WEBPACK_IMPORTED_MODULE_2__.default(this.audioCtx);
    this.transmitter.handleReceiveBuffer = this.handleReceiveBuffer;
    await this.newSearch();
  }
  async destroy() {
    navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
    if (this.recording)
      await this.stop();
    await this.transmitter.destroy();
  }
  getConstraints(deviceId) {
    return __spreadValues({
      deviceId,
      sampleRate: this.editor.sampleRate || this.audioCtx.sampleRate,
      channelCount: this.editor.numberOfChannels || void 0
    }, this.constraints);
  }
  resetNode() {
    if (this.stream) {
      this.node = this.audioCtx.createMediaStreamSource(this.stream);
      this.node.channelInterpretation = "discrete";
    }
  }
  async start() {
    if (!this.node)
      return false;
    this.node.connect(this.transmitter);
    if (!this.editor.player.monitoring)
      this.node.connect(this.editor.player.postAnalyserNode);
    const { state, env, project, length, numberOfChannels, sampleRate } = this.editor;
    const { cursor, selRange } = state;
    if (selRange) {
      const [$start, $end] = selRange;
      this.inPlace = true;
      this.$start = $start;
      this.$end = $end;
      this.$ = $start;
    } else {
      this.inPlace = false;
      this.$start = cursor;
      this.$end = length;
      this.$ = cursor;
    }
    const overwrittenBufferLength = this.$end - this.$start;
    if (overwrittenBufferLength)
      this.overwrittenAudio = await _PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default.fromSilence({ env, project, noRegister: true }, numberOfChannels, overwrittenBufferLength, sampleRate);
    else
      this.overwrittenAudio = void 0;
    this.recording = true;
    await this.transmitter.reset();
    await this.transmitter.start();
    return true;
  }
  async stop() {
    this.recording = false;
    if (!this.node)
      return;
    if (!this.editor.player.monitoring)
      this.node.disconnect(this.editor.player.postAnalyserNode);
    await this.transmitter.stop();
    if (!this.inPlace && this.$ > this.$end && this.$ < this.audio.length) {
      const [audio2] = await this.audio.instance.split(this.$);
      this.audio.instance.setAudio(audio2);
      if (this.overwrittenAudio)
        this.overwrittenAudio.waveform.update();
    } else {
      if (this.overwrittenAudio) {
        if (this.$ < this.$end) {
          const [audio2] = await this.overwrittenAudio.split(this.$ - this.$start);
          this.overwrittenAudio.setAudio(audio2);
        }
        this.overwrittenAudio.waveform.update();
      }
    }
    const audio = await this.audio.instance.pick(this.$start, this.$, true);
    this.editor.emit("recorded", { range: this.inPlace || this.overwrittenAudio ? [this.$start, this.$] : void 0, cursor: this.inPlace || this.overwrittenAudio ? void 0 : this.$start, audio, oldAudio: this.overwrittenAudio });
    this.editor.setSelRange([this.$start, this.$]);
  }
}


/***/ }),

/***/ "./src/core/audio/OperableAudioBuffer.ts":
/*!***********************************************!*\
  !*** ./src/core/audio/OperableAudioBuffer.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OperableAudioBuffer)
/* harmony export */ });
class OperableAudioBuffer extends AudioBuffer {
  clone() {
    const newBuffer = new OperableAudioBuffer(this);
    for (let i = 0; i < this.numberOfChannels; i++) {
      const channel = this.getChannelData(i);
      newBuffer.copyToChannel(channel, i);
    }
    return newBuffer;
  }
  reverse() {
    for (let i = 0; i < this.numberOfChannels; i++) {
      const channel = this.getChannelData(i);
      channel.reverse();
    }
  }
  inverse() {
    for (let i = 0; i < this.numberOfChannels; i++) {
      const channel = this.getChannelData(i);
      for (let j = 0; j < channel.length; j++) {
        channel[j] = -channel[j];
      }
    }
  }
  concat(that, numberOfChannels = this.numberOfChannels) {
    const { sampleRate } = this;
    const length = this.length + that.length;
    const buffer = new OperableAudioBuffer({ numberOfChannels, length, sampleRate });
    const from = this.length;
    for (let i = 0; i < numberOfChannels; i++) {
      if (i < this.numberOfChannels)
        buffer.copyToChannel(this.getChannelData(i), i);
      if (i < that.numberOfChannels)
        buffer.copyToChannel(that.getChannelData(i), i, from);
    }
    return buffer;
  }
  split(from) {
    if (from >= this.length || from <= 0)
      throw new RangeError("Split point is out of bound");
    const { length, sampleRate, numberOfChannels } = this;
    const buffer1 = new OperableAudioBuffer({ length: from, numberOfChannels, sampleRate });
    const buffer2 = new OperableAudioBuffer({ length: length - from, numberOfChannels, sampleRate });
    for (let i = 0; i < numberOfChannels; i++) {
      const channel1 = buffer1.getChannelData(i);
      const channel2 = buffer2.getChannelData(i);
      this.copyFromChannel(channel1, i);
      this.copyFromChannel(channel2, i, from);
    }
    return [buffer1, buffer2];
  }
  write(channel, index, value) {
    if (channel > this.numberOfChannels)
      throw new Error(`Channel written ${channel} out of range ${this.numberOfChannels}`);
    if (index > this.length)
      throw new Error(`Index written ${index} out of range ${this.length}`);
    this.getChannelData(channel)[index] = value;
  }
  toArray(shared = false) {
    const supportSAB = typeof SharedArrayBuffer !== "undefined";
    const channelData = [];
    const { numberOfChannels, length } = this;
    for (let i = 0; i < numberOfChannels; i++) {
      if (shared && supportSAB) {
        channelData[i] = new Float32Array(new SharedArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT));
        channelData[i].set(this.getChannelData(i));
      } else {
        channelData[i] = this.getChannelData(i);
      }
    }
    return channelData;
  }
}


/***/ }),

/***/ "./src/core/audio/PatcherAudio.ts":
/*!****************************************!*\
  !*** ./src/core/audio/PatcherAudio.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PatcherAudio)
/* harmony export */ });
/* harmony import */ var _webaudiomodules_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webaudiomodules/api */ "./node_modules/@webaudiomodules/api/dist/index.js");
/* harmony import */ var _webaudiomodules_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @webaudiomodules/sdk */ "./node_modules/@webaudiomodules/sdk/dist/index.js");
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _AudioEditor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AudioEditor */ "./src/core/audio/AudioEditor.ts");
/* harmony import */ var _file_FileInstance__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../file/FileInstance */ "./src/core/file/FileInstance.ts");
/* harmony import */ var _AudioHistory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AudioHistory */ "./src/core/audio/AudioHistory.ts");
/* harmony import */ var _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./OperableAudioBuffer */ "./src/core/audio/OperableAudioBuffer.ts");
/* harmony import */ var _utils_Waveform__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/Waveform */ "./src/utils/Waveform.ts");
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








class PatcherAudio extends _file_FileInstance__WEBPACK_IMPORTED_MODULE_4__.default {
  constructor() {
    super(...arguments);
    this._history = new _AudioHistory__WEBPACK_IMPORTED_MODULE_5__.default();
  }
  static async fromProjectItem(options) {
    return new this(options).init(options.file.data.slice(0));
  }
  static async fromArrayBuffer(options, data) {
    const audio = new PatcherAudio(options);
    await audio.init(data.slice(0));
    return audio;
  }
  static async fromNativeAudioBuffer(options, bufferIn) {
    const audio = new PatcherAudio(options);
    const audioBuffer = Object.setPrototypeOf(bufferIn, _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_6__.default.prototype);
    audio.audioBuffer = audioBuffer;
    audio.waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_7__.default(audio);
    await audio.waveform.generate();
    await audio.emit("postInit");
    audio._isReady = true;
    await audio.emit("ready");
    return audio;
  }
  static async fromSilence(optionsIn, numberOfChannels, length, sampleRate) {
    const audio = new PatcherAudio(optionsIn);
    audio.audioBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_6__.default({ length, numberOfChannels, sampleRate });
    audio.waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_7__.default(audio);
    audio.waveform.generateEmpty(numberOfChannels, length);
    await audio.emit("postInit");
    audio._isReady = true;
    await audio.emit("ready");
    return audio;
  }
  async getEditor() {
    const editor = new _AudioEditor__WEBPACK_IMPORTED_MODULE_3__.default(this);
    return editor.init();
  }
  get audioCtx() {
    var _a;
    return ((_a = this.project) == null ? void 0 : _a.audioCtx) || this.env.audioCtx;
  }
  get length() {
    return this.audioBuffer.length;
  }
  get numberOfChannels() {
    return this.audioBuffer.numberOfChannels;
  }
  get sampleRate() {
    return this.audioBuffer.sampleRate;
  }
  get wamGroupId() {
    return this.env.wamGroupId;
  }
  get wamGroupKey() {
    return this.env.wamGroupKey;
  }
  async init(data) {
    const { audioCtx } = this;
    await this.env.taskMgr.newTask(this, "Initializing Audio", async (onUpdate) => {
      onUpdate("Decoding Audio...");
      if (data == null ? void 0 : data.byteLength) {
        const audioBuffer = await audioCtx.decodeAudioData(data);
        this.audioBuffer = Object.setPrototypeOf(audioBuffer, _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_6__.default.prototype);
      } else {
        this.audioBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_6__.default({ length: 1, numberOfChannels: 1, sampleRate: audioCtx.sampleRate });
      }
      onUpdate("Generating Waveform...");
      this.waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_7__.default(this);
      await this.waveform.generate();
    });
    this.on("setAudio", () => this.emit("changed"));
    await this.emit("postInit");
    this._isReady = true;
    await this.emit("ready");
    return this;
  }
  async initWithOptions(options) {
    const { length = 1, numberOfChannels = 1, sampleRate = this.audioCtx.sampleRate } = options;
    this.audioBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_6__.default({ length, numberOfChannels, sampleRate });
    this.waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_7__.default(this);
    await this.waveform.generate();
    await this.emit("postInit");
    this._isReady = true;
    await this.emit("ready");
  }
  async initWith(audio) {
    this.setAudio(audio);
    await this.emit("postInit");
    this._isReady = true;
    await this.emit("ready");
  }
  async serialize(optionsIn = { bitDepth: 32, float: true }) {
    return this.env.taskMgr.newTask(this, "Encoding audio WAVE...", () => {
      const audioData = this.audioBuffer.toArray(true);
      const options = __spreadValues({ sampleRate: this.audioBuffer.sampleRate, bitDepth: 32, float: true }, optionsIn);
      return this.env.wavEncoderWorker.encode(audioData, options);
    });
  }
  encodeFFmpegWorker(wav, inputFileName, outputFileName, ...args) {
    return this.env.taskMgr.newTask(this, `Encoding audio ${outputFileName}...`, async (onUpdate) => {
      const ffmpegWorker = await this.env.getFFmpeg();
      ffmpegWorker.on("ffout", onUpdate);
      ffmpegWorker.on("fferr", onUpdate);
      ffmpegWorker.on("info", onUpdate);
      try {
        const result = await ffmpegWorker.run({
          data: wav,
          input: inputFileName,
          output: outputFileName,
          args: ["-i", inputFileName, ...args, outputFileName]
        });
        return result;
      } finally {
        ffmpegWorker.off("ffout", onUpdate);
        ffmpegWorker.off("fferr", onUpdate);
        ffmpegWorker.off("info", onUpdate);
      }
    });
  }
  async encodeMp3(bitrate) {
    const wav = new Uint8Array(await this.serialize({ shared: true }));
    const inputFileName = "in.wav";
    const outputFileName = "out.mp3";
    return this.encodeFFmpegWorker(wav, inputFileName, outputFileName, "-codec:a", "libmp3lame", "-b:a", `${bitrate}k`);
  }
  async encodeAac(bitrate) {
    const wav = new Uint8Array(await this.serialize({ shared: true }));
    const inputFileName = "in.wav";
    const outputFileName = "out.m4a";
    return this.encodeFFmpegWorker(wav, inputFileName, outputFileName, "-codec:a", "aac", "-b:a", `${bitrate}k`);
  }
  async clone() {
    const audio = new PatcherAudio({ env: this.env, project: this.project, noRegister: true });
    await audio.initWith({
      audioBuffer: this.audioBuffer.clone(),
      waveform: this.waveform.clone()
    });
    return audio;
  }
  setAudio(that) {
    this.audioBuffer = that.audioBuffer;
    this.waveform = that.waveform;
    this.waveform.patcherAudio = this;
    this.emit("setAudio");
  }
  async silence(selStart = 0, selEnd = this.length) {
    const length = selEnd - selStart;
    const audio = await PatcherAudio.fromSilence({ env: this.env, project: this.project, noRegister: true }, this.numberOfChannels, length, this.sampleRate);
    const oldAudio = await this.pasteToRange(audio, selStart, selEnd);
    return { range: [selStart, selEnd], audio, oldAudio };
  }
  async insertSilence(length, from) {
    if (!length)
      return null;
    const audio = await PatcherAudio.fromSilence({ env: this.env, project: this.project, noRegister: true }, this.numberOfChannels, length, this.sampleRate);
    this.insertToCursor(audio, from);
    return { range: [from, from + length], audio };
  }
  reverse() {
    this.audioBuffer.reverse();
    this.waveform.reverse();
  }
  inverse() {
    this.audioBuffer.inverse();
    this.waveform.inverse();
  }
  async concat(that, numberOfChannels = this.audioBuffer.numberOfChannels) {
    const audio = new PatcherAudio({ env: this.env, project: this.project, noRegister: true });
    const audioBuffer = this.audioBuffer.concat(that.audioBuffer, numberOfChannels);
    audio.audioBuffer = audioBuffer;
    const waveform = this.waveform.concat(that.waveform, audio, numberOfChannels);
    await audio.initWith({ audioBuffer, waveform });
    return audio;
  }
  async split(from) {
    const audio1 = new PatcherAudio({ env: this.env, project: this.project, noRegister: true });
    const audio2 = new PatcherAudio({ env: this.env, project: this.project, noRegister: true });
    const [ab1, ab2] = this.audioBuffer.split(from);
    audio1.audioBuffer = ab1;
    audio2.audioBuffer = ab2;
    const [wf1, wf2] = this.waveform.split(from, audio1, audio2);
    await audio1.initWith({ audioBuffer: ab1, waveform: wf1 });
    await audio2.initWith({ audioBuffer: ab2, waveform: wf2 });
    return [audio1, audio2];
  }
  async pick(from, to, clone = false) {
    let picked;
    let audioBuffer;
    let waveform;
    if (from <= 0 && to >= this.length) {
      picked = new PatcherAudio({ env: this.env, project: this.project, noRegister: true });
      if (clone) {
        audioBuffer = this.audioBuffer.clone();
        waveform = this.waveform.clone();
      } else {
        audioBuffer = this.audioBuffer;
        waveform = this.waveform;
      }
      await picked.initWith({ audioBuffer, waveform });
      return picked;
    } else if (from <= 0) {
      picked = (await this.split(to))[0];
    } else if (to >= this.length) {
      picked = (await this.split(from))[1];
    } else {
      const p0 = (await this.split(to))[0];
      picked = (await p0.split(from))[1];
    }
    if (clone)
      picked.waveform = picked.waveform.clone();
    return picked;
  }
  async removeFromRange(from, to) {
    if (from === 0 && to === this.length) {
      const old = await this.clone();
      const { numberOfChannels, sampleRate } = this.audioBuffer;
      const audioBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_6__.default({ length: 1, numberOfChannels, sampleRate });
      const waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_7__.default(this);
      this.setAudio({ audioBuffer, waveform });
      this.setCursor(from);
      return old;
    } else if (from === 0) {
      const [p1, p2] = await this.split(to);
      this.setAudio(p2);
      this.setCursor(from);
      return p1;
    } else if (to === this.audioBuffer.length) {
      const [p1, p2] = await this.split(from);
      this.setAudio(p1);
      this.setCursor(from);
      return p2;
    } else {
      const [p0, p3] = await this.split(to);
      const [p1, p2] = await p0.split(from);
      const concat = await p1.concat(p3);
      this.setAudio(concat);
      this.setCursor(from);
      return p2;
    }
  }
  async pasteToRange(that, from, to) {
    if (from <= 0 && to >= this.length) {
      const old = await this.clone();
      this.setAudio(that);
      this.setSelRangeToAll();
      return old;
    } else if (from <= 0) {
      const [p1, p2] = await this.split(to);
      const concat = await that.concat(p2, p2.numberOfChannels);
      this.setAudio(concat);
      this.setSelRange([0, that.length]);
      return p1;
    } else if (to >= this.length) {
      const [p1, p2] = await this.split(from);
      const concat = await p1.concat(that);
      this.setAudio(concat);
      this.setSelRange([from, this.length]);
      return p2;
    } else {
      const [p, p2] = await this.split(to);
      const [p0, old] = await p.split(from);
      const p1 = await p0.concat(that);
      const concat = await p1.concat(p2);
      this.setAudio(concat);
      this.setSelRange([from, from + that.length]);
      return old;
    }
  }
  async insertToCursor(that, cursor) {
    if (cursor <= 0) {
      const concat = await that.concat(this, this.numberOfChannels);
      this.setAudio(concat);
      this.setSelRange([0, that.length]);
    } else if (cursor >= this.length) {
      const concat = await this.concat(that);
      this.setAudio(concat);
      this.setSelRange([cursor, this.length]);
    } else {
      const [p0, p2] = await this.split(cursor);
      const p1 = await p0.concat(that);
      const concat = await p1.concat(p2);
      this.setAudio(concat);
      this.setSelRange([cursor, cursor + that.length]);
    }
  }
  async fade(gain, from = 0, to = this.length, enabledChannels = new Array(this.numberOfChannels).fill(true)) {
    const oldAudio = await this.pick(from, to, true);
    const factor = (0,_utils_math__WEBPACK_IMPORTED_MODULE_2__.dbtoa)(gain);
    for (let c = 0; c < this.numberOfChannels; c++) {
      if (!enabledChannels[c])
        return null;
      const channel = this.audioBuffer.getChannelData(c);
      for (let i = from; i < to; i++) {
        channel[i] *= factor;
      }
    }
    this.waveform.update(from, to);
    const audio = await this.pick(from, to, true);
    return { gain, range: [from, to], audio, oldAudio };
  }
  async fadeIn(lengthIn, exponent = 0, enabledChannels = new Array(this.numberOfChannels).fill(true)) {
    const length = Math.max(0, Math.min(this.length, ~~lengthIn));
    if (!length)
      return null;
    const oldAudio = await this.pick(0, length, true);
    for (let c = 0; c < this.numberOfChannels; c++) {
      if (!enabledChannels[c])
        return null;
      const channel = this.audioBuffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        channel[i] *= (0,_utils_math__WEBPACK_IMPORTED_MODULE_2__.normExp)(i / length, exponent);
      }
    }
    this.waveform.update(0, length);
    const audio = await this.pick(0, length, true);
    return { length, exponent, audio, oldAudio };
  }
  async fadeOut(lengthIn, exponent = 0, enabledChannels = new Array(this.numberOfChannels).fill(true)) {
    const l = this.length;
    const length = Math.max(0, Math.min(l, ~~lengthIn));
    if (!length)
      return null;
    const oldAudio = await this.pick(l - length, l, true);
    for (let c = 0; c < this.numberOfChannels; c++) {
      if (!enabledChannels[c])
        return null;
      const channel = this.audioBuffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        channel[l - i] *= (0,_utils_math__WEBPACK_IMPORTED_MODULE_2__.normExp)(i / length, exponent);
      }
    }
    this.waveform.update(l - length, l);
    const audio = await this.pick(l - length, l, true);
    return { length, exponent, audio, oldAudio };
  }
  write(channel, index, value) {
    this.audioBuffer.write(channel, index, value);
    this.waveform.update(index, index + 1);
  }
  async render(sampleRateIn, mix, applyPlugins, pluginsOptions) {
    return this.env.taskMgr.newTask(this, "Rendering audio...", async () => {
      let { length } = this;
      const needResample = sampleRateIn && this.sampleRate !== sampleRateIn;
      const needRemix = mix && (mix.length !== this.numberOfChannels || !(0,_utils_math__WEBPACK_IMPORTED_MODULE_2__.isIdentityMatrix)(mix));
      if (!needResample && !needRemix && !applyPlugins)
        return this;
      if (needResample)
        length = Math.ceil(length * sampleRateIn / this.sampleRate);
      const numberOfChannels = mix ? mix.length : this.numberOfChannels;
      const sampleRate = sampleRateIn || this.sampleRate;
      let mixBuffer;
      if (!needRemix) {
        mixBuffer = this.audioBuffer;
      } else {
        await this.env.taskMgr.newTask(this, "Remixing audio...", () => {
          mixBuffer = new AudioBuffer({ numberOfChannels, length: this.length, sampleRate: this.sampleRate });
          for (let i = 0; i < mixBuffer.numberOfChannels; i++) {
            const mixChannel = mixBuffer.getChannelData(i);
            for (let j = 0; j < mix[i].length; j++) {
              const gain = mix[i][j];
              const channel = this.audioBuffer.getChannelData(j);
              for (let k = 0; k < mixChannel.length; k++) {
                mixChannel[k] += channel[k] * gain;
              }
            }
          }
        });
      }
      if (!applyPlugins && !needResample)
        return PatcherAudio.fromNativeAudioBuffer({ env: this.env, project: this.project, noRegister: true }, mixBuffer);
      const offlineAudioCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
      const { audioWorklet } = offlineAudioCtx;
      await (0,_webaudiomodules_sdk__WEBPACK_IMPORTED_MODULE_1__.addFunctionModule)(audioWorklet, _webaudiomodules_sdk__WEBPACK_IMPORTED_MODULE_1__.initializeWamEnv, _webaudiomodules_api__WEBPACK_IMPORTED_MODULE_0__.VERSION);
      await (0,_webaudiomodules_sdk__WEBPACK_IMPORTED_MODULE_1__.addFunctionModule)(audioWorklet, _webaudiomodules_sdk__WEBPACK_IMPORTED_MODULE_1__.initializeWamGroup, this.wamGroupId, this.wamGroupKey);
      const source = offlineAudioCtx.createBufferSource();
      source.buffer = mixBuffer;
      if (applyPlugins) {
        await this.env.taskMgr.newTask(this, "Applying plugins...", async (onUpdate) => {
          const { plugins, pluginsEnabled, preFxGain, postFxGain } = pluginsOptions;
          const preFxGainNode = offlineAudioCtx.createGain();
          preFxGainNode.gain.value = (0,_utils_math__WEBPACK_IMPORTED_MODULE_2__.dbtoa)(preFxGain);
          const postFxGainNode = offlineAudioCtx.createGain();
          postFxGainNode.gain.value = (0,_utils_math__WEBPACK_IMPORTED_MODULE_2__.dbtoa)(postFxGain);
          source.connect(preFxGainNode);
          let lastNode = preFxGainNode;
          for (const plugin of plugins) {
            if (!plugin)
              continue;
            if (!pluginsEnabled.has(plugin))
              continue;
            onUpdate(plugin.name);
            try {
              const Plugin = Object.getPrototypeOf(plugin).constructor;
              const p = await Plugin.createInstance(this.wamGroupId, offlineAudioCtx);
              await p.audioNode.setParameterValues(await plugin.audioNode.getParameterValues());
              lastNode.connect(p.audioNode);
              lastNode = p.audioNode;
            } catch (e) {
              continue;
            }
          }
          lastNode.connect(postFxGainNode);
          postFxGainNode.connect(offlineAudioCtx.destination);
        });
      } else {
        source.connect(offlineAudioCtx.destination);
      }
      source.start(0);
      return this.env.taskMgr.newTask(this, "Applying plugins...", async () => {
        const bufferOut = await offlineAudioCtx.startRendering();
        return PatcherAudio.fromNativeAudioBuffer({ env: this.env, project: this.project, noRegister: true }, bufferOut);
      });
    });
  }
  setCursor(cursor) {
    this.emit("cursor", cursor);
  }
  setSelRange(range) {
    this.emit("selRange", range);
  }
  setSelRangeToAll() {
    this.emit("selRange", [0, this.length]);
  }
}


/***/ }),

/***/ "./src/core/worklets/AudioWorkletProxyNode.ts":
/*!****************************************************!*\
  !*** ./src/core/worklets/AudioWorkletProxyNode.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var _a;
const Node = (_a = class extends AudioWorkletNode {
  constructor(context, name, options) {
    super(context, name, options);
    this._disposed = false;
    const resolves = {};
    const rejects = {};
    let messagePortRequestId = 1;
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
    const call = (call2, ...args) => {
      return new Promise((resolve, reject) => {
        const id = messagePortRequestId++;
        resolves[id] = resolve;
        rejects[id] = reject;
        this.port.postMessage({ id, call: call2, args });
      });
    };
    const Ctor = this.constructor;
    Ctor.fnNames.forEach((name2) => this[name2] = (...args) => call(name2, ...args));
    this.port.start();
    this.port.addEventListener("message", handleMessage);
  }
}, _a.fnNames = [], _a);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Node);


/***/ }),

/***/ "./src/core/worklets/AudioWorkletRegister.ts":
/*!***************************************************!*\
  !*** ./src/core/worklets/AudioWorkletRegister.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registeredProcessors": () => (/* binding */ registeredProcessors),
/* harmony export */   "registeringProcessors": () => (/* binding */ registeringProcessors),
/* harmony export */   "resolves": () => (/* binding */ resolves),
/* harmony export */   "rejects": () => (/* binding */ rejects),
/* harmony export */   "default": () => (/* binding */ AudioWorkletRegister)
/* harmony export */ });
var _a, _b, _c, _d, _e, _f, _g, _h;
const registeredProcessors = ((_b = (_a = window.jspatcherEnv) == null ? void 0 : _a.AudioWorkletRegister) == null ? void 0 : _b.registeredProcessors) || new WeakMap();
const registeringProcessors = ((_d = (_c = window.jspatcherEnv) == null ? void 0 : _c.AudioWorkletRegister) == null ? void 0 : _d.registeringProcessors) || new WeakMap();
const resolves = ((_f = (_e = window.jspatcherEnv) == null ? void 0 : _e.AudioWorkletRegister) == null ? void 0 : _f.resolves) || {};
const rejects = ((_h = (_g = window.jspatcherEnv) == null ? void 0 : _g.AudioWorkletRegister) == null ? void 0 : _h.rejects) || {};
class AudioWorkletRegister {
  static async registerProcessor(audioWorklet, processorId, processor, ...injection) {
    this.registeringProcessors.get(audioWorklet).add(processorId);
    try {
      const url = typeof processor === "string" ? processor : URL.createObjectURL(new Blob([`(${processor.toString()})(${[processorId, ...injection].map(JSON.stringify).join(", ")});`], { type: "text/javascript" }));
      await audioWorklet.addModule(url);
      this.resolves[processorId].forEach((f) => f());
      this.registeringProcessors.get(audioWorklet).delete(processorId);
      this.registeredProcessors.get(audioWorklet).add(processorId);
    } catch (e) {
      this.rejects[processorId].forEach((f) => f(e));
    }
    this.rejects[processorId] = [];
    this.resolves[processorId] = [];
  }
  static async register(audioWorklet, processorId, processor, ...injection) {
    if (!this.resolves[processorId])
      this.resolves[processorId] = [];
    if (!this.rejects[processorId])
      this.rejects[processorId] = [];
    const promise = new Promise((resolve, reject) => {
      this.resolves[processorId].push(resolve);
      this.rejects[processorId].push(reject);
    });
    if (!this.registeringProcessors.has(audioWorklet)) {
      this.registeringProcessors.set(audioWorklet, new Set());
    }
    if (!this.registeredProcessors.has(audioWorklet)) {
      this.registeredProcessors.set(audioWorklet, new Set());
    }
    const registered = this.registeredProcessors.get(audioWorklet).has(processorId);
    const registering = this.registeringProcessors.get(audioWorklet).has(processorId);
    if (registered)
      return Promise.resolve();
    if (registering)
      return promise;
    if (!registered && audioWorklet) {
      this.registerProcessor(audioWorklet, processorId, processor, ...injection);
    }
    return promise;
  }
}
AudioWorkletRegister.registeredProcessors = registeredProcessors;
AudioWorkletRegister.registeringProcessors = registeringProcessors;
AudioWorkletRegister.resolves = resolves;
AudioWorkletRegister.rejects = rejects;


/***/ }),

/***/ "./src/core/worklets/TemporalAnalyser.ts":
/*!***********************************************!*\
  !*** ./src/core/worklets/TemporalAnalyser.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "processorId": () => (/* binding */ processorId),
/* harmony export */   "default": () => (/* binding */ TemporalAnalyserNode)
/* harmony export */ });
/* harmony import */ var _TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TemporalAnalyser.worklet.ts */ "./src/core/worklets/TemporalAnalyser.worklet.ts");
/* harmony import */ var _TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioWorkletProxyNode */ "./src/core/worklets/AudioWorkletProxyNode.ts");
/* harmony import */ var _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioWorkletRegister */ "./src/core/worklets/AudioWorkletRegister.ts");



const processorId = "__JSPatcher_TemporalAnalyser";
class TemporalAnalyserNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor(context) {
    super(context, processorId, { numberOfInputs: 1, numberOfOutputs: 0 });
    const _destroy = this.destroy;
    this.destroy = async () => {
      await _destroy.call(this);
      this._disposed = true;
    };
  }
}
TemporalAnalyserNode.processorId = processorId;
TemporalAnalyserNode.register = (audioWorklet) => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__.default.register(audioWorklet, processorId, (_TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default()));
TemporalAnalyserNode.fnNames = ["getRms", "getAbsMax", "getZcr", "getEstimatedFreq", "getBuffer", "gets", "destroy"];


/***/ }),

/***/ "./src/core/worklets/Transmitter.ts":
/*!******************************************!*\
  !*** ./src/core/worklets/Transmitter.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "processorId": () => (/* binding */ processorId),
/* harmony export */   "default": () => (/* binding */ TransmitterNode)
/* harmony export */ });
/* harmony import */ var _Transmitter_worklet_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Transmitter.worklet.ts */ "./src/core/worklets/Transmitter.worklet.ts");
/* harmony import */ var _Transmitter_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Transmitter_worklet_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioWorkletProxyNode */ "./src/core/worklets/AudioWorkletProxyNode.ts");
/* harmony import */ var _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AudioWorkletRegister */ "./src/core/worklets/AudioWorkletRegister.ts");



const processorId = "__JSPatcher_Transmitter";
class TransmitterNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor(context) {
    super(context, processorId, { numberOfInputs: 1, numberOfOutputs: 0 });
    const _destroy = this.destroy;
    this.destroy = async () => {
      await _destroy.call(this);
      this._disposed = true;
    };
  }
  setBuffer({ buffer, $total }) {
    if (this.handleReceiveBuffer)
      this.handleReceiveBuffer(buffer, $total);
  }
}
TransmitterNode.processorId = processorId;
TransmitterNode.register = (audioWorklet) => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__.default.register(audioWorklet, processorId, (_Transmitter_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default()));
TransmitterNode.fnNames = ["start", "stop", "reset", "destroy"];


/***/ }),

/***/ "./src/utils/Waveform.ts":
/*!*******************************!*\
  !*** ./src/utils/Waveform.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Waveform)
/* harmony export */ });
const _Waveform = class {
  get patcherAudio() {
    return this._patcherAudio;
  }
  set patcherAudio(audio) {
    this._patcherAudio = audio;
  }
  get audioBuffer() {
    return this.patcherAudio.audioBuffer;
  }
  get length() {
    return this.audioBuffer.length;
  }
  get steps() {
    return Object.keys(this).filter((v) => +v).map((v) => +v).sort((a, b) => a - b);
  }
  constructor(patcherAudioIn, waveformDataIn) {
    this.worker = patcherAudioIn.env.waveformWorker;
    this.patcherAudio = patcherAudioIn;
    if (!waveformDataIn)
      return;
    Object.keys(waveformDataIn).filter((v) => +v).map((v) => +v).forEach((stepLength) => {
      const stepData = waveformDataIn[stepLength];
      this[stepLength] = [];
      const newStepData = this[stepLength];
      if (stepData.length)
        newStepData.idx = stepData.idx.slice();
      for (let c = 0; c < stepData.length; c++) {
        const { min, max } = stepData[c];
        newStepData[c] = { min: min.slice(), max: max.slice() };
      }
    });
  }
  clone() {
    return new _Waveform(this.patcherAudio, this);
  }
  async generate() {
    const audioChannelData = this.audioBuffer.toArray(true);
    const data = await this.worker.generate(audioChannelData, _Waveform.stepsFactor);
    for (const key in data) {
      this[key] = data[key];
    }
  }
  generateEmpty(numberOfChannels, l) {
    const { stepsFactor } = _Waveform;
    for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
      const stepData = [];
      this[stepLength] = stepData;
      const stepsCount = Math.ceil(l / stepLength);
      const idxData = new Int32Array(stepsCount);
      for (let i = 0; i < idxData.length; i++) {
        idxData[i] = i * stepLength;
      }
      stepData.idx = idxData;
      for (let c = 0; c < numberOfChannels; c++) {
        const minData = new Float32Array(stepsCount);
        const maxData = new Float32Array(stepsCount);
        stepData[c] = { min: minData, max: maxData };
      }
    }
  }
  generateStep(stepLength) {
    const { stepsFactor } = _Waveform;
    const { audioBuffer: buffer } = this;
    if (!this[stepLength])
      this[stepLength] = [];
    const l = buffer.length;
    let maxInStep;
    let minInStep;
    if (stepLength === stepsFactor) {
      const stepsCount = Math.ceil(l / stepLength);
      const idxData = new Int32Array(stepsCount);
      for (let i = 0; i < idxData.length; i++) {
        idxData[i] = i * stepLength;
      }
      this[stepLength].idx = idxData;
      for (let c = 0; c < buffer.numberOfChannels; c++) {
        const minData = new Float32Array(stepsCount);
        const maxData = new Float32Array(stepsCount);
        const channel = buffer.getChannelData(c);
        for (let i = 0; i < idxData.length; i++) {
          const $0 = idxData[i];
          const $1 = i === idxData.length - 1 ? l : idxData[i + 1];
          for (let j = $0; j < $1; j++) {
            const samp = channel[j];
            if (j === $0) {
              maxInStep = samp;
              minInStep = samp;
            } else {
              if (samp > maxInStep)
                maxInStep = samp;
              if (samp < minInStep)
                minInStep = samp;
            }
          }
          minData[i] = minInStep;
          maxData[i] = maxInStep;
        }
        this[stepLength][c] = { min: minData, max: maxData };
      }
    } else {
      const { idx: prevIdx } = this[stepLength / stepsFactor];
      const stepsCount = Math.ceil(prevIdx.length / 16);
      const idxData = new Int32Array(stepsCount);
      for (let i = 0; i < idxData.length; i++) {
        idxData[i] = prevIdx[i * stepsFactor];
      }
      this[stepLength].idx = idxData;
      for (let c = 0; c < buffer.numberOfChannels; c++) {
        const minData = new Float32Array(stepsCount);
        const maxData = new Float32Array(stepsCount);
        const { min: prevMin, max: prevMax } = this[stepLength / stepsFactor][c];
        for (let i = 0; i < idxData.length; i++) {
          const $prev0 = i * stepsFactor;
          const $prev1 = i === idxData.length - 1 ? prevIdx.length : (i + 1) * stepsFactor;
          for (let j = $prev0; j < $prev1; j++) {
            const sampMax = prevMax[j];
            const sampMin = prevMin[j];
            if (j === $prev0) {
              maxInStep = sampMax;
              minInStep = sampMin;
            } else {
              if (sampMax > maxInStep)
                maxInStep = sampMax;
              if (sampMin < minInStep)
                minInStep = sampMin;
            }
          }
          minData[i] = minInStep;
          maxData[i] = maxInStep;
        }
        this[stepLength][c] = { min: minData, max: maxData };
      }
    }
    return this[stepLength];
  }
  update(from = 0, to = this.audioBuffer.length) {
    const { stepsFactor } = _Waveform;
    const { audioBuffer: buffer } = this;
    const l = buffer.length;
    for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
      let stepData;
      if (this[stepLength]) {
        stepData = this[stepLength];
        let { idx: idxData } = stepData;
        let expand = 0;
        const oldLength = idxData[idxData.length - 1] + stepLength;
        if (l > oldLength) {
          expand = Math.ceil((l - oldLength) / stepLength);
          const newLength = idxData.length + expand;
          const newIdxData = new Int32Array(newLength);
          newIdxData.set(idxData);
          for (let i = idxData.length, j = oldLength; i < newIdxData.length; i++, j += stepLength) {
            newIdxData[i] = j;
          }
          idxData = newIdxData;
        }
        stepData.idx = idxData;
        for (let c = 0; c < buffer.numberOfChannels; c++) {
          const samples = buffer.getChannelData(c);
          let { min: minData, max: maxData } = stepData[c];
          if (expand) {
            const min = new Float32Array(idxData.length);
            const max = new Float32Array(idxData.length);
            min.set(minData);
            max.set(maxData);
            minData = min;
            maxData = max;
            stepData[c] = { min: minData, max: maxData };
          }
          let $from;
          let $to;
          for (let i = 1; i <= idxData.length; i++) {
            const $ = i === idxData.length ? l : idxData[i];
            if (typeof $from === "undefined" && $ > from) {
              $from = i - 1;
            }
            if (typeof $to === "undefined" && $ >= to) {
              $to = i;
              break;
            }
          }
          let maxInStep;
          let minInStep;
          if (stepLength === stepsFactor) {
            for (let i = $from; i < $to; i++) {
              const $0 = idxData[i];
              const $1 = i === idxData.length - 1 ? l : idxData[i + 1];
              for (let j = $0; j < $1; j++) {
                const samp = samples[j];
                if (j === $0) {
                  maxInStep = samp;
                  minInStep = samp;
                } else {
                  if (samp > maxInStep)
                    maxInStep = samp;
                  if (samp < minInStep)
                    minInStep = samp;
                }
              }
              minData[i] = minInStep;
              maxData[i] = maxInStep;
            }
          } else {
            const { idx: prevIdx } = this[stepLength / stepsFactor];
            const { min: prevMin, max: prevMax } = this[stepLength / stepsFactor][c];
            for (let i = $from; i < $to; i++) {
              let $prev0 = Math.min(prevIdx.length - 1, i * stepsFactor);
              const idx0 = idxData[i];
              if (prevIdx[$prev0] < idx0) {
                do {
                  $prev0++;
                } while ($prev0 < prevIdx.length - 1 && prevIdx[$prev0] < idx0);
              } else if (prevIdx[$prev0] > idx0) {
                do {
                  $prev0--;
                } while ($prev0 > 0 && prevIdx[$prev0] > idx0);
              }
              let $prev1;
              if (i === idxData.length - 1) {
                $prev1 = prevIdx.length;
              } else {
                $prev1 = Math.min(prevIdx.length, (i + 1) * stepsFactor);
                const idx1 = idxData[i + 1];
                if (prevIdx[$prev1] < idx1) {
                  do {
                    $prev1++;
                  } while ($prev1 < prevIdx.length && prevIdx[$prev1] < idx1);
                } else if (prevIdx[$prev1] > idx1) {
                  do {
                    $prev1--;
                  } while ($prev1 > 1 && prevIdx[$prev1] > idx1);
                }
              }
              for (let j = $prev0; j < $prev1; j++) {
                const sampMin = prevMin[j];
                const sampMax = prevMax[j];
                if (j === $prev0) {
                  maxInStep = sampMax;
                  minInStep = sampMin;
                } else {
                  if (sampMax > maxInStep)
                    maxInStep = sampMax;
                  if (sampMin < minInStep)
                    minInStep = sampMin;
                }
              }
              minData[i] = minInStep;
              maxData[i] = maxInStep;
            }
          }
        }
      } else {
        this.generateStep(stepLength);
      }
    }
  }
  inverse() {
    this.steps.forEach((stepLength) => {
      const stepData = this[stepLength];
      for (let c = 0; c < stepData.length; c++) {
        const { min, max } = stepData[c];
        for (let i = 0; i < min.length; i++) {
          const $max = -min[i];
          const $min = -max[i];
          min[i] = $min;
          max[i] = $max;
        }
      }
    });
  }
  reverse() {
    this.steps.forEach((stepLength) => {
      const stepData = this[stepLength];
      if (stepData.length) {
        const { idx } = stepData;
        idx.reverse();
        for (let i = 0; i < idx.length; i++) {
          idx[i] = length - idx[i];
        }
        idx.set(idx.subarray(0, -1), 1);
        idx[0] = 0;
      }
      for (let c = 0; c < stepData.length; c++) {
        const { min, max } = stepData[c];
        min.reverse();
        max.reverse();
      }
    });
  }
  concat(that, patcherAudio, numberOfChannels = patcherAudio.audioBuffer.numberOfChannels) {
    const { stepsFactor } = _Waveform;
    const { length: l } = patcherAudio.audioBuffer;
    const from = this.length;
    const waveform = new _Waveform(patcherAudio);
    for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
      const stepData = [];
      let stepData1 = this[stepLength];
      let stepData2 = that[stepLength];
      waveform[stepLength] = stepData;
      if (!stepData1) {
        stepData1 = this.generateStep(stepLength);
      }
      if (!stepData2) {
        stepData2 = that.generateStep(stepLength);
      }
      const { idx: idxData1 } = stepData1;
      const { idx: idxData2 } = stepData2;
      const idxData = new Int32Array(idxData1.length + idxData2.length);
      idxData.set(idxData1);
      idxData.set(idxData2, idxData1.length);
      for (let j = idxData1.length; j < idxData.length; j++) {
        idxData[j] += from;
      }
      stepData.idx = idxData;
      for (let c = 0; c < numberOfChannels; c++) {
        const { min: minData1, max: maxData1 } = stepData1[c] || {};
        const { min: minData2, max: maxData2 } = stepData2[c] || {};
        const minData = new Float32Array(idxData1.length + idxData2.length);
        const maxData = new Float32Array(idxData1.length + idxData2.length);
        if (minData1)
          minData.set(minData1);
        if (minData2)
          minData.set(minData2, idxData1.length);
        if (maxData1)
          maxData.set(maxData1);
        if (maxData2)
          maxData.set(maxData2, idxData1.length);
        stepData[c] = { min: minData, max: maxData };
      }
    }
    return waveform;
  }
  split(from, patcherAudio1, patcherAudio2) {
    const { audioBuffer: buffer } = this;
    const l = buffer.length;
    if (from >= l || from <= 0)
      throw new RangeError("Split point is out of bound");
    const { audioBuffer: audioBuffer1 } = patcherAudio1;
    const { audioBuffer: audioBuffer2 } = patcherAudio2;
    const waveform1 = new _Waveform(patcherAudio1);
    const waveform2 = new _Waveform(patcherAudio2);
    const waveformKeys = this.steps;
    for (let i = 0; i < waveformKeys.length; i++) {
      const stepLength = waveformKeys[i];
      const stepData = this[stepLength];
      const stepData1 = [];
      const stepData2 = [];
      waveform1[stepLength] = stepData1;
      waveform2[stepLength] = stepData2;
      const { idx } = stepData;
      let $data;
      let splitBetween = false;
      for (let i2 = 1; i2 <= idx.length; i2++) {
        const $ = i2 === idx.length ? l : idx[i2];
        if ($ >= from) {
          splitBetween = $ !== from;
          $data = i2;
          break;
        }
      }
      let idxData1 = idx.slice();
      let idxData2 = idx.slice();
      if ($data !== idx.length) {
        idxData1 = idxData1.subarray(0, $data);
      }
      if ($data - 1 !== 0) {
        idxData2 = idxData2.subarray($data - +splitBetween);
        for (let j = 0; j < idxData2.length; j++) {
          idxData2[j] = j === 0 ? 0 : idxData2[j] - from;
        }
      }
      stepData1.idx = idxData1;
      stepData2.idx = idxData2;
      for (let c = 0; c < buffer.numberOfChannels; c++) {
        let { min: minData1, max: maxData1 } = stepData[c];
        if ($data !== idx.length) {
          minData1 = minData1.subarray(0, $data);
          maxData1 = maxData1.subarray(0, $data);
        }
        stepData1[c] = { min: minData1, max: maxData1 };
        let { min: minData2, max: maxData2 } = stepData[c];
        if ($data - 1 !== 0) {
          minData2 = minData2.subarray($data - +splitBetween);
          maxData2 = maxData2.subarray($data - +splitBetween);
        }
        stepData2[c] = { min: minData2, max: maxData2 };
        if (splitBetween) {
          let maxInStep;
          let minInStep;
          if (i === 0) {
            const channel1 = audioBuffer1.getChannelData(c);
            for (let j = idxData1[idxData1.length - 1]; j < from; j++) {
              const samp = channel1[j];
              if (j === 0) {
                maxInStep = samp;
                minInStep = samp;
              } else {
                if (samp > maxInStep)
                  maxInStep = samp;
                if (samp < minInStep)
                  minInStep = samp;
              }
            }
            minData1[idxData1.length - 1] = minInStep;
            maxData1[idxData1.length - 1] = maxInStep;
            const channel2 = audioBuffer2.getChannelData(c);
            for (let j = 0; j < (idxData2.length === 1 ? audioBuffer2.length : idxData2[1]); j++) {
              const samp = channel2[j];
              if (j === 0) {
                maxInStep = samp;
                minInStep = samp;
              } else {
                if (samp > maxInStep)
                  maxInStep = samp;
                if (samp < minInStep)
                  minInStep = samp;
              }
            }
            minData2[0] = minInStep;
            maxData2[0] = maxInStep;
          } else {
            const { idx: prevIdx1 } = waveform1[waveformKeys[i - 1]];
            const { min: prevMin1, max: prevMax1 } = waveform1[waveformKeys[i - 1]][c];
            let $prev1 = prevIdx1.length - 1;
            const idx1 = idxData1[idxData1.length - 1];
            while (prevIdx1[$prev1] > idx1) {
              $prev1--;
            }
            for (let k = $prev1; k < prevIdx1.length; k++) {
              const sampMax = prevMax1[k];
              const sampMin = prevMin1[k];
              if (k === $prev1) {
                maxInStep = sampMax;
                minInStep = sampMin;
              } else {
                if (sampMax > maxInStep)
                  maxInStep = sampMax;
                if (sampMin < minInStep)
                  minInStep = sampMin;
              }
            }
            minData1[idxData1.length - 1] = minInStep;
            maxData1[idxData1.length - 1] = maxInStep;
            const { idx: prevIdx2 } = waveform2[waveformKeys[i - 1]];
            const { min: prevMin2, max: prevMax2 } = waveform2[waveformKeys[i - 1]][c];
            let $prev2 = 1;
            if (idxData2.length > 1) {
              const idx2 = idxData2[1];
              while (prevIdx2[$prev2] < idx2) {
                $prev2++;
              }
            }
            for (let k = 0; k < $prev2; k++) {
              const sampMax = prevMax2[k];
              const sampMin = prevMin2[k];
              if (k === $prev2) {
                maxInStep = sampMax;
                minInStep = sampMin;
              } else {
                if (sampMax > maxInStep)
                  maxInStep = sampMax;
                if (sampMin < minInStep)
                  minInStep = sampMin;
              }
            }
            minData2[0] = minInStep;
            maxData2[0] = maxInStep;
          }
        }
      }
    }
    return [waveform1, waveform2];
  }
  findStep(precision) {
    const key = this.steps.reduce((acc, cur) => cur < precision && cur > (acc || 0) ? cur : acc, void 0);
    if (!key)
      return null;
    return this[key];
  }
};
let Waveform = _Waveform;
Waveform.stepsFactor = 16;



/***/ }),

/***/ "./src/core/worklets/TemporalAnalyser.worklet.ts":
/*!*******************************************************!*\
  !*** ./src/core/worklets/TemporalAnalyser.worklet.ts ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "js/1e5ebab907071b4f0cc2.worklet.js";

/***/ }),

/***/ "./src/core/worklets/Transmitter.worklet.ts":
/*!**************************************************!*\
  !*** ./src/core/worklets/Transmitter.worklet.ts ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "js/44379b2cd93add36e170.worklet.js";

/***/ }),

/***/ "./node_modules/@webaudiomodules/api/dist/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@webaudiomodules/api/dist/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AbstractWamNode": () => (/* binding */ WamNode),
/* harmony export */   "AbstractWamParameter": () => (/* binding */ WamParameter),
/* harmony export */   "AbstractWamParameterInfo": () => (/* binding */ WamParameterInfo),
/* harmony export */   "AbstractWebAudioModule": () => (/* binding */ WebAudioModule),
/* harmony export */   "VERSION": () => (/* binding */ version_default),
/* harmony export */   "getAbstractWamEnv": () => (/* binding */ AbstractWamEnv_default),
/* harmony export */   "getAbstractWamGroup": () => (/* binding */ AbstractWamGroup_default),
/* harmony export */   "getAbstractWamProcessor": () => (/* binding */ AbstractWamProcessor_default)
/* harmony export */ });
// src/AbstractWamEnv.js
var getWamEnv = (apiVersion) => {
  class WamEnv {
    get apiVersion() {
      throw new Error("Not Implemented.");
      return null;
    }
    getModuleScope(moduleId) {
      throw new Error("Not Implemented.");
      return null;
    }
    getGroup(groupId, groupKey) {
      throw new Error("Not Implemented.");
      return null;
    }
    addGroup(group) {
      throw new Error("Not Implemented.");
      return null;
    }
    removeGroup(group) {
      throw new Error("Not Implemented.");
      return null;
    }
    addWam(wam) {
      throw new Error("Not Implemented.");
      return null;
    }
    removeWam(wam) {
      throw new Error("Not Implemented.");
      return null;
    }
    connectEvents(groupId, fromId, toId, output) {
      throw new Error("Not Implemented.");
      return null;
    }
    disconnectEvents(groupId, fromId, toId, output) {
      throw new Error("Not Implemented.");
      return null;
    }
    emitEvents(from, ...events) {
      throw new Error("Not Implemented.");
      return null;
    }
  }
  return WamEnv;
};
var AbstractWamEnv_default = getWamEnv;

// src/AbstractWamGroup.js
var initializeWamGroup = (groupId, groupKey) => {
  class WamGroup {
    get groupId() {
      throw new Error("Not Implemented.");
      return null;
    }
    validate(groupKey2) {
      throw new Error("Not Implemented.");
      return null;
    }
    addWam(wam) {
      throw new Error("Not Implemented.");
      return null;
    }
    removeWam(wam) {
      throw new Error("Not Implemented.");
      return null;
    }
    connectEvents(fromId, toId, output) {
      throw new Error("Not Implemented.");
      return null;
    }
    disconnectEvents(fromId, toId, output) {
      throw new Error("Not Implemented.");
      return null;
    }
    emitEvents(from, ...events) {
      throw new Error("Not Implemented.");
      return null;
    }
  }
  return WamGroup;
};
var AbstractWamGroup_default = initializeWamGroup;

// src/AbstractWamNode.js
var WamNode = class extends AudioWorkletNode {
  constructor(module, options) {
    super(module.audioContext, module.moduleId, options);
  }
  get groupId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get moduleId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get instanceId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get module() {
    throw new Error("Not Implemented.");
    return null;
  }
  async getCompensationDelay() {
    throw new Error("Not Implemented.");
    return null;
  }
  async getParameterInfo(...parameterIdQuery) {
    throw new Error("Not Implemented.");
    return null;
  }
  async getParameterValues(normalized, ...parameterIdQuery) {
    throw new Error("Not Implemented.");
    return null;
  }
  async setParameterValues(parameterValues) {
    throw new Error("Not Implemented.");
  }
  async getState() {
    throw new Error("Not Implemented.");
    return null;
  }
  async setState(state) {
    throw new Error("Not Implemented.");
  }
  scheduleEvents(...events) {
    throw new Error("Not Implemented.");
  }
  async clearEvents() {
    throw new Error("Not Implemented.");
  }
  connectEvents(toId, output) {
    throw new Error("Not Implemented.");
  }
  disconnectEvents(toId, output) {
    throw new Error("Not Implemented.");
  }
  destroy() {
    throw new Error("Not Implemented.");
  }
};

// src/AbstractWamParameter.js
var WamParameter = class {
  constructor(info) {
  }
  get info() {
    throw new Error("Not Implemented.");
    return null;
  }
  get value() {
    throw new Error("Not Implemented.");
    return null;
  }
  set value(value) {
    throw new Error("Not Implemented.");
  }
  get normalizedValue() {
    throw new Error("Not Implemented.");
    return null;
  }
  set normalizedValue(normalizedValue) {
    throw new Error("Not Implemented.");
  }
};

// src/AbstractWamParameterInfo.js
var WamParameterInfo = class {
  constructor(id, config) {
  }
  get id() {
    throw new Error("Not Implemented.");
    return null;
  }
  get label() {
    throw new Error("Not Implemented.");
    return null;
  }
  get type() {
    throw new Error("Not Implemented.");
    return null;
  }
  get defaultValue() {
    throw new Error("Not Implemented.");
    return null;
  }
  get minValue() {
    throw new Error("Not Implemented.");
    return null;
  }
  get maxValue() {
    throw new Error("Not Implemented.");
    return null;
  }
  get discreteStep() {
    throw new Error("Not Implemented.");
    return null;
  }
  get exponent() {
    throw new Error("Not Implemented.");
    return null;
  }
  get choices() {
    throw new Error("Not Implemented.");
    return null;
  }
  get units() {
    throw new Error("Not Implemented.");
    return null;
  }
  normalize(value) {
    throw new Error("Not Implemented.");
    return null;
  }
  denormalize(value) {
    throw new Error("Not Implemented.");
    return null;
  }
  valueString(value) {
    throw new Error("Not Implemented.");
    return null;
  }
};

// src/AbstractWamProcessor.js
var getWamProcessor = (moduleId) => {
  const { AudioWorkletProcessor } = globalThis;
  class WamProcessor extends AudioWorkletProcessor {
    get groupId() {
      throw new Error("Not Implemented.");
      return null;
    }
    get moduleId() {
      throw new Error("Not Implemented.");
      return null;
    }
    get instanceId() {
      throw new Error("Not Implemented.");
      return null;
    }
    getCompensationDelay() {
      throw new Error("Not Implemented.");
      return null;
    }
    scheduleEvents(...events) {
      throw new Error("Not Implemented.");
    }
    emitEvents(...events) {
      throw new Error("Not Implemented.");
    }
    clearEvents() {
      throw new Error("Not Implemented.");
    }
    destroy() {
      throw new Error("Not Implemented.");
    }
  }
  return WamProcessor;
};
var AbstractWamProcessor_default = getWamProcessor;

// src/AbstractWebAudioModule.js
var WebAudioModule = class {
  static get isWebAudioModuleConstructor() {
    throw new Error("Not Implemented.");
    return null;
  }
  static async createInstance(groupId, audioContext, initialState) {
    throw new Error("Not Implemented.");
    return null;
  }
  constructor(groupId, audioContext) {
  }
  get isWebAudioModule() {
    throw new Error("Not Implemented.");
    return null;
  }
  get audioContext() {
    throw new Error("Not Implemented.");
    return null;
  }
  set audioContext(audioContext) {
    throw new Error("Not Implemented.");
  }
  get audioNode() {
    throw new Error("Not Implemented.");
    return null;
  }
  set audioNode(audioNode) {
    throw new Error("Not Implemented.");
  }
  get initialized() {
    throw new Error("Not Implemented.");
    return null;
  }
  set initialized(initialized) {
    throw new Error("Not Implemented.");
  }
  get groupId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get moduleId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get instanceId() {
    throw new Error("Not Implemented.");
    return null;
  }
  set instanceId(instanceId) {
    throw new Error("Not Implemented.");
  }
  get descriptor() {
    throw new Error("Not Implemented.");
    return null;
  }
  get name() {
    throw new Error("Not Implemented.");
    return null;
  }
  get vendor() {
    throw new Error("Not Implemented.");
    return null;
  }
  async initialize(state) {
    throw new Error("Not Implemented.");
    return null;
  }
  async createAudioNode(initialState) {
    throw new Error("Not Implemented.");
    return null;
  }
  async createGui() {
    throw new Error("Not Implemented.");
    return null;
  }
  destroyGui(gui) {
    throw new Error("Not Implemented.");
  }
};

// src/version.js
var version_default = "2.0.0-alpha.3";

//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@webaudiomodules/sdk/dist/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@webaudiomodules/sdk/dist/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WamNode": () => (/* binding */ WamNode),
/* harmony export */   "WebAudioModule": () => (/* binding */ WebAudioModule_default),
/* harmony export */   "addFunctionModule": () => (/* binding */ addFunctionModule_default),
/* harmony export */   "apiVersion": () => (/* binding */ apiVersion_default),
/* harmony export */   "getRingBuffer": () => (/* binding */ RingBuffer_default),
/* harmony export */   "getWamArrayRingBuffer": () => (/* binding */ WamArrayRingBuffer_default),
/* harmony export */   "getWamEventRingBuffer": () => (/* binding */ WamEventRingBuffer_default),
/* harmony export */   "getWamParameter": () => (/* binding */ WamParameter_default),
/* harmony export */   "getWamParameterInfo": () => (/* binding */ WamParameterInfo_default),
/* harmony export */   "getWamParameterInterpolator": () => (/* binding */ WamParameterInterpolator_default),
/* harmony export */   "getWamProcessor": () => (/* binding */ WamProcessor_default),
/* harmony export */   "initializeWamEnv": () => (/* binding */ WamEnv_default),
/* harmony export */   "initializeWamGroup": () => (/* binding */ WamGroup_default),
/* harmony export */   "initializeWamHost": () => (/* binding */ initializeWamHost_default)
/* harmony export */ });
// src/WebAudioModule.js
var WebAudioModule = class {
  static get isWebAudioModuleConstructor() {
    return true;
  }
  static createInstance(groupId, audioContext, initialState) {
    return new this(groupId, audioContext).initialize(initialState);
  }
  constructor(groupId, audioContext) {
    this._groupId = groupId;
    this._audioContext = audioContext;
    this._initialized = false;
    this._audioNode = void 0;
    this._timestamp = performance.now();
    this._guiModuleUrl = void 0;
    this._descriptorUrl = "./descriptor.json";
    this._descriptor = {
      name: `WebAudioModule_${this.constructor.name}`,
      vendor: "WebAudioModuleVendor",
      description: "",
      version: "0.0.0",
      apiVersion: "2.0.0",
      thumbnail: "",
      keywords: [],
      isInstrument: false,
      website: "",
      hasAudioInput: true,
      hasAudioOutput: true,
      hasAutomationInput: true,
      hasAutomationOutput: true,
      hasMidiInput: true,
      hasMidiOutput: true,
      hasMpeInput: true,
      hasMpeOutput: true,
      hasOscInput: true,
      hasOscOutput: true,
      hasSysexInput: true,
      hasSysexOutput: true
    };
  }
  get isWebAudioModule() {
    return true;
  }
  get groupId() {
    return this._groupId;
  }
  get moduleId() {
    return this.vendor + this.name;
  }
  get instanceId() {
    return this.moduleId + this._timestamp;
  }
  get descriptor() {
    return this._descriptor;
  }
  get name() {
    return this.descriptor.name;
  }
  get vendor() {
    return this.descriptor.vendor;
  }
  get audioContext() {
    return this._audioContext;
  }
  get audioNode() {
    if (!this.initialized)
      console.warn("WAM should be initialized before getting the audioNode");
    return this._audioNode;
  }
  set audioNode(node) {
    this._audioNode = node;
  }
  get initialized() {
    return this._initialized;
  }
  set initialized(value) {
    this._initialized = value;
  }
  async createAudioNode(initialState) {
    throw new TypeError("createAudioNode() not provided");
  }
  async initialize(state) {
    if (!this._audioNode)
      this.audioNode = await this.createAudioNode();
    this.initialized = true;
    return this;
  }
  async _loadGui() {
    const url = this._guiModuleUrl;
    if (!url)
      throw new TypeError("Gui module not found");
    return import(
      /* webpackIgnore: true */
      url
    );
  }
  async _loadDescriptor() {
    const url = this._descriptorUrl;
    if (!url)
      throw new TypeError("Descriptor not found");
    const response = await fetch(url);
    const descriptor = await response.json();
    Object.assign(this._descriptor, descriptor);
    return this._descriptor;
  }
  async createGui() {
    if (!this.initialized)
      console.warn("Plugin should be initialized before getting the gui");
    if (!this._guiModuleUrl)
      return void 0;
    const { createElement } = await this._loadGui();
    return createElement(this);
  }
  destroyGui() {
  }
};
var WebAudioModule_default = WebAudioModule;

// src/RingBuffer.js
var getRingBuffer = (moduleId) => {
  const audioWorkletGlobalScope = globalThis;
  class RingBuffer2 {
    static getStorageForCapacity(capacity, Type) {
      if (!Type.BYTES_PER_ELEMENT) {
        throw new Error("Pass in a ArrayBuffer subclass");
      }
      const bytes = 8 + (capacity + 1) * Type.BYTES_PER_ELEMENT;
      return new SharedArrayBuffer(bytes);
    }
    constructor(sab, Type) {
      if (!Type.BYTES_PER_ELEMENT) {
        throw new Error("Pass a concrete typed array class as second argument");
      }
      this._Type = Type;
      this._capacity = (sab.byteLength - 8) / Type.BYTES_PER_ELEMENT;
      this.buf = sab;
      this.write_ptr = new Uint32Array(this.buf, 0, 1);
      this.read_ptr = new Uint32Array(this.buf, 4, 1);
      this.storage = new Type(this.buf, 8, this._capacity);
    }
    get type() {
      return this._Type.name;
    }
    push(elements) {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      if ((wr + 1) % this._storageCapacity() === rd) {
        return 0;
      }
      const toWrite = Math.min(this._availableWrite(rd, wr), elements.length);
      const firstPart = Math.min(this._storageCapacity() - wr, toWrite);
      const secondPart = toWrite - firstPart;
      this._copy(elements, 0, this.storage, wr, firstPart);
      this._copy(elements, firstPart, this.storage, 0, secondPart);
      Atomics.store(this.write_ptr, 0, (wr + toWrite) % this._storageCapacity());
      return toWrite;
    }
    pop(elements) {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      if (wr === rd) {
        return 0;
      }
      const isArray = !Number.isInteger(elements);
      const toRead = Math.min(this._availableRead(rd, wr), isArray ? elements.length : elements);
      if (isArray) {
        const firstPart = Math.min(this._storageCapacity() - rd, toRead);
        const secondPart = toRead - firstPart;
        this._copy(this.storage, rd, elements, 0, firstPart);
        this._copy(this.storage, 0, elements, firstPart, secondPart);
      }
      Atomics.store(this.read_ptr, 0, (rd + toRead) % this._storageCapacity());
      return toRead;
    }
    get empty() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return wr === rd;
    }
    get full() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return (wr + 1) % this._capacity !== rd;
    }
    get capacity() {
      return this._capacity - 1;
    }
    get availableRead() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return this._availableRead(rd, wr);
    }
    get availableWrite() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return this._availableWrite(rd, wr);
    }
    _availableRead(rd, wr) {
      if (wr > rd) {
        return wr - rd;
      }
      return wr + this._storageCapacity() - rd;
    }
    _availableWrite(rd, wr) {
      let rv = rd - wr - 1;
      if (wr >= rd) {
        rv += this._storageCapacity();
      }
      return rv;
    }
    _storageCapacity() {
      return this._capacity;
    }
    _copy(input, offsetInput, output, offsetOutput, size) {
      for (let i = 0; i < size; i++) {
        output[offsetOutput + i] = input[offsetInput + i];
      }
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.RingBuffer)
      ModuleScope.RingBuffer = RingBuffer2;
  }
  return RingBuffer2;
};
var RingBuffer_default = getRingBuffer;

// src/WamArrayRingBuffer.js
var getWamArrayRingBuffer = (moduleId) => {
  const audioWorkletGlobalScope = globalThis;
  class WamArrayRingBuffer {
    static DefaultArrayCapacity = 2;
    static getStorageForEventCapacity(RingBuffer2, arrayLength, arrayType, maxArrayCapacity = void 0) {
      if (maxArrayCapacity === void 0)
        maxArrayCapacity = WamArrayRingBuffer.DefaultArrayCapacity;
      else
        maxArrayCapacity = Math.max(maxArrayCapacity, WamArrayRingBuffer.DefaultArrayCapacity);
      if (!arrayType.BYTES_PER_ELEMENT) {
        throw new Error("Pass in a ArrayBuffer subclass");
      }
      const capacity = arrayLength * maxArrayCapacity;
      return RingBuffer2.getStorageForCapacity(capacity, arrayType);
    }
    constructor(RingBuffer2, sab, arrayLength, arrayType, maxArrayCapacity = void 0) {
      if (!arrayType.BYTES_PER_ELEMENT) {
        throw new Error("Pass in a ArrayBuffer subclass");
      }
      this._arrayLength = arrayLength;
      this._arrayType = arrayType;
      this._arrayElementSizeBytes = arrayType.BYTES_PER_ELEMENT;
      this._arraySizeBytes = this._arrayLength * this._arrayElementSizeBytes;
      this._sab = sab;
      if (maxArrayCapacity === void 0)
        maxArrayCapacity = WamArrayRingBuffer.DefaultArrayCapacity;
      else
        maxArrayCapacity = Math.max(maxArrayCapacity, WamArrayRingBuffer.DefaultArrayCapacity);
      this._arrayArray = new arrayType(this._arrayLength);
      this._rb = new RingBuffer2(this._sab, arrayType);
    }
    write(array) {
      if (array.length !== this._arrayLength)
        return false;
      const elementsAvailable = this._rb.availableWrite;
      if (elementsAvailable < this._arrayLength)
        return false;
      let success = true;
      const elementsWritten = this._rb.push(array);
      if (elementsWritten != this._arrayLength)
        success = false;
      return success;
    }
    read(array, newest) {
      if (array.length !== this._arrayLength)
        return false;
      const elementsAvailable = this._rb.availableRead;
      if (elementsAvailable < this._arrayLength)
        return false;
      if (newest && elementsAvailable > this._arrayLength)
        this._rb.pop(elementsAvailable - this._arrayLength);
      let success = false;
      const elementsRead = this._rb.pop(array);
      if (elementsRead === this._arrayLength)
        success = true;
      return success;
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.WamArrayRingBuffer)
      ModuleScope.WamArrayRingBuffer = WamArrayRingBuffer;
  }
  return WamArrayRingBuffer;
};
var WamArrayRingBuffer_default = getWamArrayRingBuffer;

// src/WamEnv.js
var initializeWamEnv = (apiVersion) => {
  const audioWorkletGlobalScope = globalThis;
  if (audioWorkletGlobalScope.AudioWorkletProcessor && audioWorkletGlobalScope.webAudioModules)
    return;
  const moduleScopes = /* @__PURE__ */ new Map();
  const groups = /* @__PURE__ */ new Map();
  class WamEnv {
    constructor() {
    }
    get apiVersion() {
      return apiVersion;
    }
    getModuleScope(moduleId) {
      if (!moduleScopes.has(moduleId))
        moduleScopes.set(moduleId, {});
      return moduleScopes.get(moduleId);
    }
    getGroup(groupId, groupKey) {
      const group = groups.get(groupId);
      if (group.validate(groupKey))
        return group;
      else
        throw "Invalid key";
    }
    addGroup(group) {
      if (!groups.has(group.groupId))
        groups.set(group.groupId, group);
    }
    removeGroup(group) {
      groups.delete(group.groupId);
    }
    addWam(wam) {
      const group = groups.get(wam.groupId);
      group.addWam(wam);
    }
    removeWam(wam) {
      const group = groups.get(wam.groupId);
      group.removeWam(wam);
    }
    connectEvents(groupId, fromId, toId, output = 0) {
      const group = groups.get(groupId);
      group.connectEvents(fromId, toId, output);
    }
    disconnectEvents(groupId, fromId, toId, output) {
      const group = groups.get(groupId);
      group.disconnectEvents(fromId, toId, output);
    }
    emitEvents(from, ...events) {
      const group = groups.get(from.groupId);
      group.emitEvents(from, ...events);
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    if (!audioWorkletGlobalScope.webAudioModules)
      audioWorkletGlobalScope.webAudioModules = new WamEnv();
  }
};
var WamEnv_default = initializeWamEnv;

// src/WamGroup.js
var initializeWamGroup = (groupId, groupKey) => {
  const audioWorkletGlobalScope = globalThis;
  class WamGroup {
    constructor(groupId2, groupKey2) {
      this._groupId = groupId2;
      this._validate = (key) => {
        return key == groupKey2;
      };
      this._processors = /* @__PURE__ */ new Map();
      this._eventGraph = /* @__PURE__ */ new Map();
    }
    get groupId() {
      return this._groupId;
    }
    get processors() {
      return this._processors;
    }
    get eventGraph() {
      return this._eventGraph;
    }
    validate(groupKey2) {
      return this._validate(groupKey2);
    }
    addWam(wam) {
      this._processors.set(wam.instanceId, wam);
    }
    removeWam(wam) {
      if (this._eventGraph.has(wam))
        this._eventGraph.delete(wam);
      this._eventGraph.forEach((outputMap) => {
        outputMap.forEach((set) => {
          if (set && set.has(wam))
            set.delete(wam);
        });
      });
      this._processors.delete(wam.instanceId);
    }
    connectEvents(fromId, toId, output) {
      const from = this._processors.get(fromId);
      const to = this._processors.get(toId);
      let outputMap;
      if (this._eventGraph.has(from)) {
        outputMap = this._eventGraph.get(from);
      } else {
        outputMap = [];
        this._eventGraph.set(from, outputMap);
      }
      if (outputMap[output]) {
        outputMap[output].add(to);
      } else {
        const set = /* @__PURE__ */ new Set();
        set.add(to);
        outputMap[output] = set;
      }
    }
    disconnectEvents(fromId, toId, output) {
      const from = this._processors.get(fromId);
      if (!this._eventGraph.has(from))
        return;
      const outputMap = this._eventGraph.get(from);
      if (typeof toId === "undefined") {
        outputMap.forEach((set) => {
          if (set)
            set.clear();
        });
        return;
      }
      const to = this._processors.get(toId);
      if (typeof output === "undefined") {
        outputMap.forEach((set) => {
          if (set)
            set.delete(to);
        });
        return;
      }
      if (!outputMap[output])
        return;
      outputMap[output].delete(to);
    }
    emitEvents(from, ...events) {
      if (!this._eventGraph.has(from))
        return;
      const downstream = this._eventGraph.get(from);
      downstream.forEach((set) => {
        if (set)
          set.forEach((wam) => wam.scheduleEvents(...events));
      });
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    audioWorkletGlobalScope.webAudioModules.addGroup(new WamGroup(groupId, groupKey));
  }
};
var WamGroup_default = initializeWamGroup;

// src/WamEventRingBuffer.js
var getWamEventRingBuffer = (moduleId) => {
  const audioWorkletGlobalScope = globalThis;
  class WamEventRingBuffer2 {
    static DefaultExtraBytesPerEvent = 64;
    static WamEventBaseBytes = 4 + 1 + 8;
    static WamAutomationEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 2 + 8 + 1;
    static WamTransportEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 4 + 8 + 8 + 1 + 1 + 1;
    static WamMidiEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 1 + 1 + 1;
    static WamBinaryEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 4;
    static getStorageForEventCapacity(RingBuffer2, eventCapacity, maxBytesPerEvent = void 0) {
      if (maxBytesPerEvent === void 0)
        maxBytesPerEvent = WamEventRingBuffer2.DefaultExtraBytesPerEvent;
      else
        maxBytesPerEvent = Math.max(maxBytesPerEvent, WamEventRingBuffer2.DefaultExtraBytesPerEvent);
      const capacity = (Math.max(WamEventRingBuffer2.WamAutomationEventBytes, WamEventRingBuffer2.WamTransportEventBytes, WamEventRingBuffer2.WamMidiEventBytes, WamEventRingBuffer2.WamBinaryEventBytes) + maxBytesPerEvent) * eventCapacity;
      return RingBuffer2.getStorageForCapacity(capacity, Uint8Array);
    }
    constructor(RingBuffer2, sab, parameterIds, maxBytesPerEvent = void 0) {
      this._eventSizeBytes = {};
      this._encodeEventType = {};
      this._decodeEventType = {};
      const wamEventTypes = ["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc", "wam-info"];
      wamEventTypes.forEach((type, encodedType) => {
        let byteSize = 0;
        switch (type) {
          case "wam-automation":
            byteSize = WamEventRingBuffer2.WamAutomationEventBytes;
            break;
          case "wam-transport":
            byteSize = WamEventRingBuffer2.WamTransportEventBytes;
            break;
          case "wam-mpe":
          case "wam-midi":
            byteSize = WamEventRingBuffer2.WamMidiEventBytes;
            break;
          case "wam-osc":
          case "wam-sysex":
          case "wam-info":
            byteSize = WamEventRingBuffer2.WamBinaryEventBytes;
            break;
          default:
            break;
        }
        this._eventSizeBytes[type] = byteSize;
        this._encodeEventType[type] = encodedType;
        this._decodeEventType[encodedType] = type;
      });
      this._parameterCode = 0;
      this._parameterCodes = {};
      this._encodeParameterId = {};
      this._decodeParameterId = {};
      this.setParameterIds(parameterIds);
      this._sab = sab;
      if (maxBytesPerEvent === void 0)
        maxBytesPerEvent = WamEventRingBuffer2.DefaultExtraBytesPerEvent;
      else
        maxBytesPerEvent = Math.max(maxBytesPerEvent, WamEventRingBuffer2.DefaultExtraBytesPerEvent);
      this._eventBytesAvailable = Math.max(WamEventRingBuffer2.WamAutomationEventBytes, WamEventRingBuffer2.WamTransportEventBytes, WamEventRingBuffer2.WamMidiEventBytes, WamEventRingBuffer2.WamBinaryEventBytes) + maxBytesPerEvent;
      this._eventBytes = new ArrayBuffer(this._eventBytesAvailable);
      this._eventBytesView = new DataView(this._eventBytes);
      this._rb = new RingBuffer2(this._sab, Uint8Array);
      this._eventSizeArray = new Uint8Array(this._eventBytes, 0, 4);
      this._eventSizeView = new DataView(this._eventBytes, 0, 4);
    }
    _writeHeader(byteSize, type, time) {
      let byteOffset = 0;
      this._eventBytesView.setUint32(byteOffset, byteSize);
      byteOffset += 4;
      this._eventBytesView.setUint8(byteOffset, this._encodeEventType[type]);
      byteOffset += 1;
      this._eventBytesView.setFloat64(byteOffset, Number.isFinite(time) ? time : -1);
      byteOffset += 8;
      return byteOffset;
    }
    _encode(event) {
      let byteOffset = 0;
      const { type, time } = event;
      switch (event.type) {
        case "wam-automation":
          {
            if (!(event.data.id in this._encodeParameterId))
              break;
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const { data } = event;
            const encodedParameterId = this._encodeParameterId[data.id];
            const { value, normalized } = data;
            this._eventBytesView.setUint16(byteOffset, encodedParameterId);
            byteOffset += 2;
            this._eventBytesView.setFloat64(byteOffset, value);
            byteOffset += 8;
            this._eventBytesView.setUint8(byteOffset, normalized ? 1 : 0);
            byteOffset += 1;
          }
          break;
        case "wam-transport":
          {
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const { data } = event;
            const {
              currentBar,
              currentBarStarted,
              tempo,
              timeSigNumerator,
              timeSigDenominator,
              playing
            } = data;
            this._eventBytesView.setUint32(byteOffset, currentBar);
            byteOffset += 4;
            this._eventBytesView.setFloat64(byteOffset, currentBarStarted);
            byteOffset += 8;
            this._eventBytesView.setFloat64(byteOffset, tempo);
            byteOffset += 8;
            this._eventBytesView.setUint8(byteOffset, timeSigNumerator);
            byteOffset += 1;
            this._eventBytesView.setUint8(byteOffset, timeSigDenominator);
            byteOffset += 1;
            this._eventBytesView.setUint8(byteOffset, playing ? 1 : 0);
            byteOffset += 1;
          }
          break;
        case "wam-mpe":
        case "wam-midi":
          {
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const { data } = event;
            const { bytes } = data;
            let b = 0;
            while (b < 3) {
              this._eventBytesView.setUint8(byteOffset, bytes[b]);
              byteOffset += 1;
              b++;
            }
          }
          break;
        case "wam-osc":
        case "wam-sysex":
        case "wam-info":
          {
            let bytes = null;
            if (event.type === "wam-info") {
              const { data } = event;
              bytes = new TextEncoder().encode(data.instanceId);
            } else {
              const { data } = event;
              bytes = data.bytes;
            }
            const numBytes = bytes.length;
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize + numBytes, type, time);
            this._eventBytesView.setUint32(byteOffset, numBytes);
            byteOffset += 4;
            const bytesRequired = byteOffset + numBytes;
            if (bytesRequired > this._eventBytesAvailable)
              console.error(`Event requires ${bytesRequired} bytes but only ${this._eventBytesAvailable} have been allocated!`);
            const buffer = new Uint8Array(this._eventBytes, byteOffset, numBytes);
            buffer.set(bytes);
            byteOffset += numBytes;
          }
          break;
        default:
          break;
      }
      return new Uint8Array(this._eventBytes, 0, byteOffset);
    }
    _decode() {
      let byteOffset = 0;
      const type = this._decodeEventType[this._eventBytesView.getUint8(byteOffset)];
      byteOffset += 1;
      let time = this._eventBytesView.getFloat64(byteOffset);
      if (time === -1)
        time = void 0;
      byteOffset += 8;
      switch (type) {
        case "wam-automation": {
          const encodedParameterId = this._eventBytesView.getUint16(byteOffset);
          byteOffset += 2;
          const value = this._eventBytesView.getFloat64(byteOffset);
          byteOffset += 8;
          const normalized = !!this._eventBytesView.getUint8(byteOffset);
          byteOffset += 1;
          if (!(encodedParameterId in this._decodeParameterId))
            break;
          const id = this._decodeParameterId[encodedParameterId];
          const event = {
            type,
            time,
            data: {
              id,
              value,
              normalized
            }
          };
          return event;
        }
        case "wam-transport": {
          const currentBar = this._eventBytesView.getUint32(byteOffset);
          byteOffset += 4;
          const currentBarStarted = this._eventBytesView.getFloat64(byteOffset);
          byteOffset += 8;
          const tempo = this._eventBytesView.getFloat64(byteOffset);
          byteOffset += 8;
          const timeSigNumerator = this._eventBytesView.getUint8(byteOffset);
          byteOffset += 1;
          const timeSigDenominator = this._eventBytesView.getUint8(byteOffset);
          byteOffset += 1;
          const playing = this._eventBytesView.getUint8(byteOffset) == 1;
          byteOffset += 1;
          const event = {
            type,
            time,
            data: {
              currentBar,
              currentBarStarted,
              tempo,
              timeSigNumerator,
              timeSigDenominator,
              playing
            }
          };
          return event;
        }
        case "wam-mpe":
        case "wam-midi": {
          const bytes = [0, 0, 0];
          let b = 0;
          while (b < 3) {
            bytes[b] = this._eventBytesView.getUint8(byteOffset);
            byteOffset += 1;
            b++;
          }
          const event = {
            type,
            time,
            data: { bytes }
          };
          return event;
        }
        case "wam-osc":
        case "wam-sysex":
        case "wam-info": {
          const numBytes = this._eventBytesView.getUint32(byteOffset);
          byteOffset += 4;
          const bytes = new Uint8Array(numBytes);
          bytes.set(new Uint8Array(this._eventBytes, byteOffset, numBytes));
          byteOffset += numBytes;
          if (type === "wam-info") {
            const instanceId = new TextDecoder().decode(bytes);
            const data = { instanceId };
            return { type, time, data };
          } else {
            const data = { bytes };
            return { type, time, data };
          }
        }
        default:
          break;
      }
      return false;
    }
    write(...events) {
      const numEvents = events.length;
      let bytesAvailable = this._rb.availableWrite;
      let numSkipped = 0;
      let i = 0;
      while (i < numEvents) {
        const event = events[i];
        const bytes = this._encode(event);
        const eventSizeBytes = bytes.byteLength;
        let bytesWritten = 0;
        if (bytesAvailable >= eventSizeBytes) {
          if (eventSizeBytes === 0)
            numSkipped++;
          else
            bytesWritten = this._rb.push(bytes);
        } else
          break;
        bytesAvailable -= bytesWritten;
        i++;
      }
      return i - numSkipped;
    }
    read() {
      if (this._rb.empty)
        return [];
      const events = [];
      let bytesAvailable = this._rb.availableRead;
      let bytesRead = 0;
      while (bytesAvailable > 0) {
        bytesRead = this._rb.pop(this._eventSizeArray);
        bytesAvailable -= bytesRead;
        const eventSizeBytes = this._eventSizeView.getUint32(0);
        const eventBytes = new Uint8Array(this._eventBytes, 0, eventSizeBytes - 4);
        bytesRead = this._rb.pop(eventBytes);
        bytesAvailable -= bytesRead;
        const decodedEvent = this._decode();
        if (decodedEvent)
          events.push(decodedEvent);
      }
      return events;
    }
    setParameterIds(parameterIds) {
      this._encodeParameterId = {};
      this._decodeParameterId = {};
      parameterIds.forEach((parameterId) => {
        let parameterCode = -1;
        if (parameterId in this._parameterCodes)
          parameterCode = this._parameterCodes[parameterId];
        else {
          parameterCode = this._generateParameterCode();
          this._parameterCodes[parameterId] = parameterCode;
        }
        this._encodeParameterId[parameterId] = parameterCode;
        this._decodeParameterId[parameterCode] = parameterId;
      });
    }
    _generateParameterCode() {
      if (this._parameterCode > 65535)
        throw Error("Too many parameters have been registered!");
      return this._parameterCode++;
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.WamEventRingBuffer)
      ModuleScope.WamEventRingBuffer = WamEventRingBuffer2;
  }
  return WamEventRingBuffer2;
};
var WamEventRingBuffer_default = getWamEventRingBuffer;

// src/addFunctionModule.js
var addFunctionModule = (audioWorklet, processorFunction, ...injection) => {
  const text = `(${processorFunction.toString()})(${injection.map((s) => JSON.stringify(s)).join(", ")});`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
  return audioWorklet.addModule(url);
};
var addFunctionModule_default = addFunctionModule;

// src/WamParameter.js
var getWamParameter = (moduleId) => {
  const audioWorkletGlobalScope = globalThis;
  class WamParameter {
    constructor(info) {
      this.info = info;
      this._value = info.defaultValue;
    }
    set value(value) {
      this._value = value;
    }
    get value() {
      return this._value;
    }
    set normalizedValue(valueNorm) {
      this.value = this.info.denormalize(valueNorm);
    }
    get normalizedValue() {
      return this.info.normalize(this.value);
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.WamParameter)
      ModuleScope.WamParameter = WamParameter;
  }
  return WamParameter;
};
var WamParameter_default = getWamParameter;

// src/WamParameterInfo.js
var getWamParameterInfo = (moduleId) => {
  const audioWorkletGlobalScope = globalThis;
  const normExp = (x, e) => e === 0 ? x : x ** 1.5 ** -e;
  const denormExp = (x, e) => e === 0 ? x : x ** 1.5 ** e;
  const normalize = (x, min, max, e = 0) => min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
  const denormalize = (x, min, max, e = 0) => min === 0 && max === 1 ? denormExp(x, e) : denormExp(x, e) * (max - min) + min;
  const inRange = (x, min, max) => x >= min && x <= max;
  class WamParameterInfo {
    constructor(id, config = {}) {
      let {
        type,
        label,
        defaultValue,
        minValue,
        maxValue,
        discreteStep,
        exponent,
        choices,
        units
      } = config;
      if (type === void 0)
        type = "float";
      if (label === void 0)
        label = "";
      if (defaultValue === void 0)
        defaultValue = 0;
      if (choices === void 0)
        choices = [];
      if (type === "boolean" || type === "choice") {
        discreteStep = 1;
        minValue = 0;
        if (choices.length)
          maxValue = choices.length - 1;
        else
          maxValue = 1;
      } else {
        if (minValue === void 0)
          minValue = 0;
        if (maxValue === void 0)
          maxValue = 1;
        if (discreteStep === void 0)
          discreteStep = 0;
        if (exponent === void 0)
          exponent = 0;
        if (units === void 0)
          units = "";
      }
      const errBase = `Param config error | ${id}: `;
      if (minValue >= maxValue)
        throw Error(errBase.concat("minValue must be less than maxValue"));
      if (!inRange(defaultValue, minValue, maxValue))
        throw Error(errBase.concat("defaultValue out of range"));
      if (discreteStep % 1 || discreteStep < 0) {
        throw Error(errBase.concat("discreteStep must be a non-negative integer"));
      } else if (discreteStep > 0 && (minValue % 1 || maxValue % 1 || defaultValue % 1)) {
        throw Error(errBase.concat("non-zero discreteStep requires integer minValue, maxValue, and defaultValue"));
      }
      if (type === "choice" && !choices.length) {
        throw Error(errBase.concat("choice type parameter requires list of strings in choices"));
      }
      this.id = id;
      this.label = label;
      this.type = type;
      this.defaultValue = defaultValue;
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.discreteStep = discreteStep;
      this.exponent = exponent;
      this.choices = choices;
      this.units = units;
    }
    normalize(value) {
      return normalize(value, this.minValue, this.maxValue, this.exponent);
    }
    denormalize(valueNorm) {
      return denormalize(valueNorm, this.minValue, this.maxValue, this.exponent);
    }
    valueString(value) {
      if (this.choices)
        return this.choices[value];
      if (this.units !== "")
        return `${value} ${this.units}`;
      return `${value}`;
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.WamParameterInfo)
      ModuleScope.WamParameterInfo = WamParameterInfo;
  }
  return WamParameterInfo;
};
var WamParameterInfo_default = getWamParameterInfo;

// src/WamParameterInterpolator.js
var getWamParameterInterpolator = (moduleId) => {
  const audioWorkletGlobalScope = globalThis;
  const samplesPerQuantum = 128;
  const nullTableKey = "0_0";
  class WamParameterInterpolator {
    static _tables;
    static _tableReferences;
    constructor(info, samplesPerInterpolation, skew = 0) {
      if (!WamParameterInterpolator._tables) {
        WamParameterInterpolator._tables = { nullTableKey: new Float32Array(0) };
        WamParameterInterpolator._tableReferences = { nullTableKey: [] };
      }
      this.info = info;
      this.values = new Float32Array(samplesPerQuantum);
      this._tableKey = nullTableKey;
      this._table = WamParameterInterpolator._tables[this._tableKey];
      this._skew = 2;
      const { discreteStep } = info;
      this._discrete = !!discreteStep;
      this._N = this._discrete ? 0 : samplesPerInterpolation;
      this._n = 0;
      this._startValue = info.defaultValue;
      this._endValue = info.defaultValue;
      this._currentValue = info.defaultValue;
      this._deltaValue = 0;
      this._inverted = false;
      this._changed = true;
      this._filled = 0;
      if (!this._discrete)
        this.setSkew(skew);
      else
        this._skew = 0;
      this.setStartValue(this._startValue);
    }
    _removeTableReference(oldKey) {
      if (oldKey === nullTableKey)
        return;
      const { id } = this.info;
      const references = WamParameterInterpolator._tableReferences[oldKey];
      if (references) {
        const index = references.indexOf(id);
        if (index !== -1)
          references.splice(index, 1);
        if (references.length === 0) {
          delete WamParameterInterpolator._tables[oldKey];
          delete WamParameterInterpolator._tableReferences[oldKey];
        }
      }
    }
    setSkew(skew) {
      if (this._skew === skew || this._discrete)
        return;
      if (skew < -1 || skew > 1)
        throw Error("skew must be in range [-1.0, 1.0]");
      const newKey = [this._N, skew].join("_");
      const oldKey = this._tableKey;
      const { id } = this.info;
      if (newKey === oldKey)
        return;
      if (WamParameterInterpolator._tables[newKey]) {
        const references = WamParameterInterpolator._tableReferences[newKey];
        if (references)
          references.push(id);
        else
          WamParameterInterpolator._tableReferences[newKey] = [id];
      } else {
        let e = Math.abs(skew);
        e = Math.pow(3 - e, e * (e + 2));
        const linear = e === 1;
        const N = this._N;
        const table = new Float32Array(N + 1);
        if (linear)
          for (let n = 0; n <= N; ++n)
            table[n] = n / N;
        else
          for (let n = 0; n <= N; ++n)
            table[n] = (n / N) ** e;
        WamParameterInterpolator._tables[newKey] = table;
        WamParameterInterpolator._tableReferences[newKey] = [id];
      }
      this._removeTableReference(oldKey);
      this._skew = skew;
      this._tableKey = newKey;
      this._table = WamParameterInterpolator._tables[this._tableKey];
    }
    setStartValue(value, fill = true) {
      this._n = this._N;
      this._startValue = value;
      this._endValue = value;
      this._currentValue = value;
      this._deltaValue = 0;
      this._inverted = false;
      if (fill) {
        this.values.fill(value);
        this._changed = true;
        this._filled = this.values.length;
      } else {
        this._changed = false;
        this._filled = 0;
      }
    }
    setEndValue(value) {
      if (value === this._endValue)
        return;
      this._n = 0;
      this._startValue = this._currentValue;
      this._endValue = value;
      this._deltaValue = this._endValue - this._startValue;
      this._inverted = this._deltaValue > 0 && this._skew >= 0 || this._deltaValue <= 0 && this._skew < 0;
      this._changed = false;
      this._filled = 0;
    }
    process(startSample, endSample) {
      if (this.done)
        return;
      const length = endSample - startSample;
      let fill = 0;
      const change = this._N - this._n;
      if (this._discrete || !change)
        fill = length;
      else {
        if (change < length) {
          fill = Math.min(length - change, samplesPerQuantum);
          endSample -= fill;
        }
        if (endSample > startSample) {
          if (this._inverted) {
            for (let i = startSample; i < endSample; ++i) {
              const tableValue = 1 - this._table[this._N - ++this._n];
              this.values[i] = this._startValue + tableValue * this._deltaValue;
            }
          } else {
            for (let i = startSample; i < endSample; ++i) {
              const tableValue = this._table[++this._n];
              this.values[i] = this._startValue + tableValue * this._deltaValue;
            }
          }
        }
        if (fill > 0) {
          startSample = endSample;
          endSample += fill;
        }
      }
      if (fill > 0) {
        this.values.fill(this._endValue, startSample, endSample);
        this._filled += fill;
      }
      this._currentValue = this.values[endSample - 1];
      if (this._n === this._N) {
        if (!this._changed)
          this._changed = true;
        else if (this._filled >= this.values.length) {
          this.setStartValue(this._endValue, false);
          this._changed = true;
          this._filled = this.values.length;
        }
      }
    }
    get done() {
      return this._changed && this._filled === this.values.length;
    }
    is(value) {
      return this._endValue === value && this.done;
    }
    destroy() {
      this._removeTableReference(this._tableKey);
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.WamParameterInterpolator)
      ModuleScope.WamParameterInterpolator = WamParameterInterpolator;
  }
  return WamParameterInterpolator;
};
var WamParameterInterpolator_default = getWamParameterInterpolator;

// src/WamProcessor.js
var getWamProcessor = (moduleId) => {
  const audioWorkletGlobalScope = globalThis;
  const {
    AudioWorkletProcessor,
    webAudioModules
  } = audioWorkletGlobalScope;
  const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
  const {
    RingBuffer: RingBuffer2,
    WamEventRingBuffer: WamEventRingBuffer2,
    WamParameter,
    WamParameterInterpolator
  } = ModuleScope;
  class WamProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super(options);
      const {
        groupId,
        moduleId: moduleId2,
        instanceId,
        useSab
      } = options.processorOptions;
      if (!moduleId2)
        throw Error("must provide moduleId argument in processorOptions!");
      if (!instanceId)
        throw Error("must provide instanceId argument in processorOptions!");
      this.groupId = groupId;
      this.moduleId = moduleId2;
      this.instanceId = instanceId;
      this._samplesPerQuantum = 128;
      this._compensationDelay = 0;
      this._parameterInfo = {};
      this._parameterState = {};
      this._parameterInterpolators = {};
      this._eventQueue = [];
      this._pendingResponses = {};
      this._useSab = !!useSab && !!globalThis.SharedArrayBuffer;
      this._eventSabReady = false;
      this._audioToMainEventSab = null;
      this._mainToAudioEventSab = null;
      this._eventWriter = null;
      this._eventReader = null;
      this._initialized = false;
      this._destroyed = false;
      webAudioModules.addWam(this);
      this.port.onmessage = this._onMessage.bind(this);
      if (this._useSab)
        this._configureSab();
    }
    getCompensationDelay() {
      return this._compensationDelay;
    }
    scheduleEvents(...events) {
      let i = 0;
      while (i < events.length) {
        this._eventQueue.push({ id: 0, event: events[i] });
        i++;
      }
    }
    emitEvents(...events) {
      webAudioModules.emitEvents(this, ...events);
    }
    clearEvents() {
      this._eventQueue = [];
    }
    process(inputs, outputs, parameters) {
      if (!this._initialized)
        return true;
      if (this._destroyed)
        return false;
      if (this._eventSabReady)
        this.scheduleEvents(...this._eventReader.read());
      const processingSlices = this._getProcessingSlices();
      let i = 0;
      while (i < processingSlices.length) {
        const { range, events } = processingSlices[i];
        const [startSample, endSample] = range;
        let j = 0;
        while (j < events.length) {
          this._processEvent(events[j]);
          j++;
        }
        this._interpolateParameterValues(startSample, endSample);
        this._process(startSample, endSample, inputs, outputs, parameters);
        i++;
      }
      return true;
    }
    destroy() {
      this._destroyed = true;
      this.port.close();
      webAudioModules.removeWam(this);
    }
    _generateWamParameterInfo() {
      return {};
    }
    _initialize() {
      this._parameterState = {};
      this._parameterInterpolators = {};
      this._parameterInfo = this._generateWamParameterInfo();
      Object.keys(this._parameterInfo).forEach((parameterId) => {
        const info = this._parameterInfo[parameterId];
        this._parameterState[parameterId] = new WamParameter(this._parameterInfo[parameterId]);
        this._parameterInterpolators[parameterId] = new WamParameterInterpolator(info, 256);
      });
    }
    _configureSab() {
      const eventCapacity = 2 ** 10;
      const parameterIds = Object.keys(this._parameterInfo);
      if (this._eventSabReady) {
        this._eventWriter.setParameterIds(parameterIds);
        this._eventReader.setParameterIds(parameterIds);
      }
      this.port.postMessage({ eventSab: { eventCapacity, parameterIds } });
    }
    async _onMessage(message) {
      if (message.data.request) {
        const {
          id,
          request,
          content
        } = message.data;
        const response = { id, response: request };
        const requestComponents = request.split("/");
        const verb = requestComponents[0];
        const noun = requestComponents[1];
        response.content = "error";
        if (verb === "get") {
          if (noun === "parameterInfo") {
            let { parameterIds } = content;
            if (!parameterIds.length)
              parameterIds = Object.keys(this._parameterInfo);
            const parameterInfo = {};
            let i = 0;
            while (i < parameterIds.length) {
              const parameterId = parameterIds[i];
              parameterInfo[parameterId] = this._parameterInfo[parameterId];
              i++;
            }
            response.content = parameterInfo;
          } else if (noun === "parameterValues") {
            let { normalized, parameterIds } = content;
            response.content = this._getParameterValues(normalized, parameterIds);
          } else if (noun === "state") {
            response.content = this._getState();
          } else if (noun === "compensationDelay") {
            response.content = this.getCompensationDelay();
          }
        } else if (verb === "set") {
          if (noun === "parameterValues") {
            const { parameterValues } = content;
            this._setParameterValues(parameterValues, true);
            delete response.content;
          } else if (noun === "state") {
            const { state } = content;
            this._setState(state);
            delete response.content;
          }
        } else if (verb === "add") {
          if (noun === "event") {
            const { event } = content;
            this._eventQueue.push({ id, event });
            return;
          }
        } else if (verb === "remove") {
          if (noun === "events") {
            const ids = this._eventQueue.map((queued) => queued.id);
            this.clearEvents();
            response.content = ids;
          }
        } else if (verb === "connect") {
          if (noun === "events") {
            const { wamInstanceId, output } = content;
            this._connectEvents(wamInstanceId, output);
            delete response.content;
          }
        } else if (verb === "disconnect") {
          if (noun === "events") {
            const { wamInstanceId, output } = content;
            this._disconnectEvents(wamInstanceId, output);
            delete response.content;
          }
        } else if (verb === "initialize") {
          if (noun === "processor") {
            this._initialize();
            this._initialized = true;
            delete response.content;
          } else if (noun === "eventSab") {
            const { mainToAudioEventSab, audioToMainEventSab } = content;
            this._audioToMainEventSab = audioToMainEventSab;
            this._mainToAudioEventSab = mainToAudioEventSab;
            const parameterIds = Object.keys(this._parameterInfo);
            this._eventWriter = new WamEventRingBuffer2(RingBuffer2, this._audioToMainEventSab, parameterIds);
            this._eventReader = new WamEventRingBuffer2(RingBuffer2, this._mainToAudioEventSab, parameterIds);
            this._eventSabReady = true;
            delete response.content;
          }
        }
        this.port.postMessage(response);
      } else if (message.data.destroy) {
        this.destroy();
      }
    }
    _onTransport(transportData) {
      console.error("_onTransport not implemented!");
    }
    _onMidi(midiData) {
      console.error("_onMidi not implemented!");
    }
    _onSysex(sysexData) {
      console.error("_onMidi not implemented!");
    }
    _onMpe(mpeData) {
      console.error("_onMpe not implemented!");
    }
    _onOsc(oscData) {
      console.error("_onOsc not implemented!");
    }
    _setState(state) {
      if (state.parameterValues)
        this._setParameterValues(state.parameterValues, false);
    }
    _getState() {
      return { parameterValues: this._getParameterValues(false) };
    }
    _getParameterValues(normalized, parameterIds) {
      const parameterValues = {};
      if (!parameterIds || !parameterIds.length)
        parameterIds = Object.keys(this._parameterState);
      let i = 0;
      while (i < parameterIds.length) {
        const id = parameterIds[i];
        const parameter = this._parameterState[id];
        parameterValues[id] = {
          id,
          value: normalized ? parameter.normalizedValue : parameter.value,
          normalized
        };
        i++;
      }
      return parameterValues;
    }
    _setParameterValues(parameterUpdates, interpolate) {
      const parameterIds = Object.keys(parameterUpdates);
      let i = 0;
      while (i < parameterIds.length) {
        this._setParameterValue(parameterUpdates[parameterIds[i]], interpolate);
        i++;
      }
    }
    _setParameterValue(parameterUpdate, interpolate) {
      const { id, value, normalized } = parameterUpdate;
      const parameter = this._parameterState[id];
      if (!parameter)
        return;
      if (!normalized)
        parameter.value = value;
      else
        parameter.normalizedValue = value;
      const interpolator = this._parameterInterpolators[id];
      if (interpolate)
        interpolator.setEndValue(parameter.value);
      else
        interpolator.setStartValue(parameter.value);
    }
    _interpolateParameterValues(startIndex, endIndex) {
      const parameterIds = Object.keys(this._parameterInterpolators);
      let i = 0;
      while (i < parameterIds.length) {
        this._parameterInterpolators[parameterIds[i]].process(startIndex, endIndex);
        i++;
      }
    }
    _connectEvents(wamInstanceId, output) {
      webAudioModules.connectEvents(this.groupId, this.instanceId, wamInstanceId, output);
    }
    _disconnectEvents(wamInstanceId, output) {
      if (typeof wamInstanceId === "undefined") {
        webAudioModules.disconnectEvents(this.groupId, this.instanceId);
        return;
      }
      webAudioModules.disconnectEvents(this.groupId, this.instanceId, wamInstanceId, output);
    }
    _getProcessingSlices() {
      const response = "add/event";
      const { currentTime, sampleRate } = audioWorkletGlobalScope;
      const eventsBySampleIndex = {};
      let i = 0;
      while (i < this._eventQueue.length) {
        const { id, event } = this._eventQueue[i];
        const offsetSec = event.time - currentTime;
        const sampleIndex = offsetSec > 0 ? Math.round(offsetSec * sampleRate) : 0;
        if (sampleIndex < this._samplesPerQuantum) {
          if (eventsBySampleIndex[sampleIndex])
            eventsBySampleIndex[sampleIndex].push(event);
          else
            eventsBySampleIndex[sampleIndex] = [event];
          if (id)
            this.port.postMessage({ id, response });
          else if (this._eventSabReady)
            this._eventWriter.write(event);
          else
            this.port.postMessage({ event });
          this._eventQueue.shift();
          i = -1;
        } else
          break;
        i++;
      }
      const processingSlices = [];
      const keys = Object.keys(eventsBySampleIndex);
      if (keys[0] !== "0") {
        keys.unshift("0");
        eventsBySampleIndex["0"] = [];
      }
      const lastIndex = keys.length - 1;
      i = 0;
      while (i < keys.length) {
        const key = keys[i];
        const startSample = parseInt(key);
        const endSample = i < lastIndex ? parseInt(keys[i + 1]) : this._samplesPerQuantum;
        processingSlices.push({ range: [startSample, endSample], events: eventsBySampleIndex[key] });
        i++;
      }
      return processingSlices;
    }
    _processEvent(event) {
      switch (event.type) {
        case "wam-automation":
          this._setParameterValue(event.data, true);
          break;
        case "wam-transport":
          this._onTransport(event.data);
          break;
        case "wam-midi":
          this._onMidi(event.data);
          break;
        case "wam-sysex":
          this._onSysex(event.data);
          break;
        case "wam-mpe":
          this._onMpe(event.data);
          break;
        case "wam-osc":
          this._onOsc(event.data);
          break;
        default:
          break;
      }
    }
    _process(startSample, endSample, inputs, outputs, parameters) {
      console.error("_process not implemented!");
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    if (!ModuleScope.WamProcessor)
      ModuleScope.WamProcessor = WamProcessor;
  }
  return WamProcessor;
};
var WamProcessor_default = getWamProcessor;

// src/WamNode.js
var RingBuffer = RingBuffer_default();
var WamEventRingBuffer = WamEventRingBuffer_default();
var WamNode = class extends AudioWorkletNode {
  static async addModules(audioContext, moduleId) {
    const { audioWorklet } = audioContext;
    await addFunctionModule_default(audioWorklet, RingBuffer_default, moduleId);
    await addFunctionModule_default(audioWorklet, WamEventRingBuffer_default, moduleId);
    await addFunctionModule_default(audioWorklet, WamArrayRingBuffer_default, moduleId);
    await addFunctionModule_default(audioWorklet, WamParameter_default, moduleId);
    await addFunctionModule_default(audioWorklet, WamParameterInfo_default, moduleId);
    await addFunctionModule_default(audioWorklet, WamParameterInterpolator_default, moduleId);
    await addFunctionModule_default(audioWorklet, WamProcessor_default, moduleId);
  }
  constructor(module, options) {
    const { audioContext, groupId, moduleId, instanceId } = module;
    options.processorOptions = {
      groupId,
      moduleId,
      instanceId,
      ...options.processorOptions
    };
    super(audioContext, moduleId, options);
    this.module = module;
    this._supportedEventTypes = /* @__PURE__ */ new Set(["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc"]);
    this._messageId = 1;
    this._pendingResponses = {};
    this._pendingEvents = {};
    this._useSab = false;
    this._eventSabReady = false;
    this._destroyed = false;
    this.port.onmessage = this._onMessage.bind(this);
  }
  get groupId() {
    return this.module.groupId;
  }
  get moduleId() {
    return this.module.moduleId;
  }
  get instanceId() {
    return this.module.instanceId;
  }
  async getParameterInfo(...parameterIds) {
    const request = "get/parameterInfo";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { parameterIds }
      });
    });
  }
  async getParameterValues(normalized, ...parameterIds) {
    const request = "get/parameterValues";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { normalized, parameterIds }
      });
    });
  }
  async setParameterValues(parameterValues) {
    const request = "set/parameterValues";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { parameterValues }
      });
    });
  }
  async getState() {
    const request = "get/state";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({ id, request });
    });
  }
  async setState(state) {
    const request = "set/state";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { state }
      });
    });
  }
  async getCompensationDelay() {
    const request = "get/compensationDelay";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({ id, request });
    });
  }
  addEventListener(type, callback, options) {
    if (this._supportedEventTypes.has(type))
      super.addEventListener(type, callback, options);
  }
  removeEventListener(type, callback, options) {
    if (this._supportedEventTypes.has(type))
      super.removeEventListener(type, callback, options);
  }
  scheduleEvents(...events) {
    let i = 0;
    const numEvents = events.length;
    if (this._eventSabReady) {
      i = this._eventWriter.write(...events);
    }
    while (i < numEvents) {
      const event = events[i];
      const request = "add/event";
      const id = this._generateMessageId();
      let processed = false;
      new Promise((resolve, reject) => {
        this._pendingResponses[id] = resolve;
        this._pendingEvents[id] = () => {
          if (!processed)
            reject();
        };
        this.port.postMessage({
          id,
          request,
          content: { event }
        });
      }).then((resolved) => {
        processed = true;
        delete this._pendingEvents[id];
        this._onEvent(event);
      }).catch((rejected) => {
        delete this._pendingResponses[id];
      });
      i++;
    }
  }
  async clearEvents() {
    const request = "remove/events";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      const ids = Object.keys(this._pendingEvents);
      if (ids.length) {
        this._pendingResponses[id] = resolve;
        this.port.postMessage({ id, request });
      }
    }).then((clearedIds) => {
      clearedIds.forEach((clearedId) => {
        this._pendingEvents[clearedId]();
        delete this._pendingEvents[clearedId];
      });
    });
  }
  connectEvents(toId, output) {
    const request = "connect/events";
    const id = this._generateMessageId();
    new Promise((resolve, reject) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { wamInstanceId: toId, output }
      });
    });
  }
  disconnectEvents(toId, output) {
    const request = "disconnect/events";
    const id = this._generateMessageId();
    new Promise((resolve, reject) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { wamInstanceId: toId, output }
      });
    });
  }
  destroy() {
    if (this._audioToMainInterval)
      clearInterval(this._audioToMainInterval);
    this.port.postMessage({ destroy: true });
    this.port.close();
    this.disconnect();
    this._destroyed = true;
  }
  _generateMessageId() {
    return this._messageId++;
  }
  async _initialize() {
    const request = "initialize/processor";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({ id, request });
    });
  }
  _onMessage(message) {
    const { data } = message;
    const { response, event, eventSab } = data;
    if (response) {
      const { id, content } = data;
      const resolvePendingResponse = this._pendingResponses[id];
      if (resolvePendingResponse) {
        delete this._pendingResponses[id];
        resolvePendingResponse(content);
      }
    } else if (eventSab) {
      this._useSab = true;
      const { eventCapacity, parameterIds } = eventSab;
      if (this._eventSabReady) {
        this._eventWriter.setParameterIds(parameterIds);
        this._eventReader.setParameterIds(parameterIds);
        return;
      }
      this._mainToAudioEventSab = WamEventRingBuffer.getStorageForEventCapacity(RingBuffer, eventCapacity);
      this._audioToMainEventSab = WamEventRingBuffer.getStorageForEventCapacity(RingBuffer, eventCapacity);
      this._eventWriter = new WamEventRingBuffer(RingBuffer, this._mainToAudioEventSab, parameterIds);
      this._eventReader = new WamEventRingBuffer(RingBuffer, this._audioToMainEventSab, parameterIds);
      const request = "initialize/eventSab";
      const id = this._generateMessageId();
      new Promise((resolve, reject) => {
        this._pendingResponses[id] = resolve;
        this.port.postMessage({
          id,
          request,
          content: {
            mainToAudioEventSab: this._mainToAudioEventSab,
            audioToMainEventSab: this._audioToMainEventSab
          }
        });
      }).then((resolved) => {
        this._eventSabReady = true;
        this._audioToMainInterval = setInterval(() => {
          const events = this._eventReader.read();
          events.forEach((e) => {
            this._onEvent(e);
          });
        }, 100);
      });
    } else if (event)
      this._onEvent(event);
  }
  _onEvent(event) {
    const { type } = event;
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      detail: event
    }));
  }
};

// src/apiVersion.js
var apiVersion_default = "2.0.0-alpha.3";

// src/initializeWamHost.js
var initializeWamHost = async (audioContext, hostGroupId = `wam-host-${performance.now().toString()}`, hostGroupKey = performance.now().toString()) => {
  await addFunctionModule_default(audioContext.audioWorklet, WamEnv_default, apiVersion_default);
  await addFunctionModule_default(audioContext.audioWorklet, WamGroup_default, hostGroupId, hostGroupKey);
  return [hostGroupId, hostGroupKey];
};
var initializeWamHost_default = initializeWamHost;

//# sourceMappingURL=index.js.map


/***/ })

};
//# sourceMappingURL=aa41186d7a69c75e00e6.worklet.js.map