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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






class AudioEditor extends _file_FileEditor__WEBPACK_IMPORTED_MODULE_3__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "audio", void 0);

    _defineProperty(this, "player", new _AudioPlayer__WEBPACK_IMPORTED_MODULE_1__.default(this));

    _defineProperty(this, "recorder", new _AudioRecorder__WEBPACK_IMPORTED_MODULE_2__.default(this));

    _defineProperty(this, "state", {
      playing: "stopped",
      monitoring: false,
      loop: true,
      recording: false,
      cursor: 0,
      selRange: null,
      viewRange: [0, 0],
      enabledChannels: [],
      plugins: new Array(10).fill(undefined),
      pluginsEnabled: new WeakSet(),
      pluginsShowing: new WeakSet(),
      preFxGain: 0,
      postFxGain: 0
    });

    _defineProperty(this, "handleSetAudio", () => {
      const {
        cursor,
        selRange,
        viewRange
      } = this.state;
      const {
        length,
        numberOfChannels
      } = this;
      if (cursor > length) this.setCursor(length);
      if (selRange && selRange[1] > length) this.setSelRange(selRange);
      if (viewRange[1] > length) this.setViewRange(viewRange);

      if (this.state.enabledChannels.length !== numberOfChannels) {
        const enabledChannels = new Array(numberOfChannels).fill(true);
        this.state.enabledChannels.slice(numberOfChannels).forEach((v, i) => enabledChannels[i] = v);
        this.setState({
          enabledChannels
        });
        this.emit("enabledChannels", enabledChannels);
      }

      this.emit("setAudio");
    });

    _defineProperty(this, "handlePlayerEnded", cursor => {
      const playing = "stopped";
      this.setState({
        playing
      });
      this.emit("playing", playing);
      this.setCursor(cursor);
    });

    _defineProperty(this, "handleInputChanged", async deviceId => {
      await this.recorder.newSearch(deviceId);
      if (this.state.monitoring) this.player.startMonitoring();
    });
  }

  static async fromProjectItem(_ref) {
    let {
      file,
      env,
      project,
      instanceId
    } = _ref;
    const audio = file instanceof _TempAudioFile__WEBPACK_IMPORTED_MODULE_4__.default ? file.data : await file.instantiate({
      env,
      project,
      instanceId
    });
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

  emitPluginsChanged() {
    const {
      plugins,
      pluginsEnabled,
      pluginsShowing
    } = this.state;
    this.emit("pluginsChanged", {
      plugins: plugins.slice(),
      pluginsEnabled: plugins.map(p => pluginsEnabled.has(p)),
      pluginsShowing: plugins.map(p => pluginsShowing.has(p))
    });
  }

  emitUIResized() {
    this.emit("uiResized");
  }

  emitSelRangeToPlay() {
    this.emit("selRangeToPlay", this.state.selRange);
  }

  zoomH(refIn, factor) {
    // factor = 1 as zoomIn, -1 as zoomOut
    const {
      viewRange
    } = this.state;
    const {
      length
    } = this;
    const [viewStart, viewEnd] = viewRange;
    const viewLength = viewEnd - viewStart;
    const minRange = Math.min(length, 5);
    const ref = Math.max(0, Math.min(length, Math.round(refIn)));

    if (ref < viewStart || ref > viewEnd) {
      const start = Math.max(0, Math.min(length - viewLength, Math.round(ref - viewLength / 2)));
      const end = Math.max(viewLength, Math.min(length, Math.round(ref + viewLength / 2)));
      const range = [start, end];
      this.setState({
        viewRange: range
      });
      this.emit("viewRange", range);
    } else if (factor < 0 || viewLength > minRange) {
      const multiplier = 1.5 ** -factor;
      const start = ref - (ref - viewStart) * multiplier;
      const end = ref + (viewEnd - ref) * multiplier;
      this.setViewRange([start, end]);
    }
  }

  scrollH(speed) {
    // spped = 1 as one full viewRange
    const {
      viewRange
    } = this.state;
    const {
      length
    } = this;
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
    this.setState({
      enabledChannels
    });
    this.emit("enabledChannels", enabledChannels);
  }

  setLoop(loop) {
    this.setState({
      loop
    });
    this.emit("loop", loop);
  }

  setRecording(recording) {
    this.setState({
      recording
    });
    this.emit("recording", recording);
  }

  setCursor(cursorIn, fromPlayer) {
    const shouldReplay = !fromPlayer && this.state.playing === "playing";
    if (shouldReplay) this.stop();
    const {
      length
    } = this;
    const cursor = Math.max(0, Math.min(length, Math.round(cursorIn)));
    this.setState({
      cursor
    });
    this.emit("cursor", cursor);
    if (shouldReplay) this.play();
  }

  setSelRange(range) {
    if (!range) {
      this.setState({
        selRange: null
      });
      this.emit("selRange", null);
      return;
    }

    const {
      length
    } = this;
    let [start, end] = range;
    if (end < start) [start, end] = [end, start];
    start = Math.max(0, Math.min(length - 1, Math.round(start)));
    end = Math.max(1, Math.min(length, Math.round(end)));

    if (start === end) {
      this.setState({
        selRange: null
      });
      this.emit("selRange", null);
      return;
    }

    const selRange = [start, end];
    this.setState({
      selRange,
      cursor: start
    });
    this.emit("selRange", selRange);
    this.emit("cursor", start);
  }

  setSelRangeToAll() {
    const {
      length
    } = this;
    const selRange = [0, length];
    this.setState({
      selRange
    });
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
    const {
      length
    } = this;
    let [start, end] = range;
    if (end < start) [start, end] = [end, start];
    const minRange = Math.min(length, 5);
    start = Math.max(0, Math.min(length - minRange, Math.round(start)));
    end = Math.max(minRange, Math.min(length, Math.round(end)));
    const viewRange = [start, end];
    this.setState({
      viewRange
    });
    this.emit("viewRange", viewRange);
  }

  setViewRangeToAll() {
    const {
      length
    } = this;
    const viewRange = [0, length];
    this.setState({
      viewRange
    });
    this.emit("viewRange", viewRange);
  }

  async cut() {
    const {
      selRange
    } = this.state;
    if (!selRange) return;
    const [selStart, selEnd] = selRange;
    this.setSelRange(null);
    this.clipboard = await this.instance.removeFromRange(selStart, selEnd);
    const oldAudio = this.clipboard;
    this.emit("cutEnd", {
      range: [selStart, selEnd],
      oldAudio
    });
  }

  async copy() {
    const {
      selRange
    } = this.state;
    if (!selRange) return;
    const [selStart, selEnd] = selRange;
    this.clipboard = await this.instance.pick(selStart, selEnd, true);
  }

  async paste() {
    const {
      clipboard
    } = this;
    if (!clipboard) return;
    const {
      cursor,
      selRange
    } = this.state;

    if (selRange) {
      const [selStart, selEnd] = selRange;
      const oldAudio = await this.instance.pasteToRange(clipboard, selStart, selEnd);
      this.emit("pasted", {
        range: [selStart, selEnd],
        audio: clipboard,
        oldAudio
      });
    } else {
      this.instance.insertToCursor(clipboard, cursor);
      this.emit("pasted", {
        cursor,
        audio: clipboard
      });
    }
  }

  async delete() {
    const {
      selRange
    } = this.state;
    if (!selRange) return;
    const [selStart, selEnd] = selRange;
    this.setSelRange(null);
    const oldAudio = await this.instance.removeFromRange(selStart, selEnd);
    this.emit("deleted", {
      range: [selStart, selEnd],
      oldAudio
    });
  }

  async silence() {
    const {
      selRange
    } = this.state;
    if (!selRange) return;
    const silenced = await this.instance.silence(selRange);
    if (silenced) this.emit("silenced", silenced);
  }

  async insertSilence(length) {
    if (!length) return;
    const {
      cursor
    } = this.state;
    const inserted = await this.instance.insertSilence(length, cursor);
    if (inserted) this.emit("insertedSilence", inserted);
  }

  async reverse() {
    const {
      selRange
    } = this.state;
    const [selStart, selEnd] = selRange || [0, this.length];
    const audio = await this.instance.pick(selStart, selEnd, true);
    audio.reverse();
    const oldAudio = await this.instance.pasteToRange(audio, selStart, selEnd);
    this.emit("reversed", {
      range: [0, this.length],
      audio,
      oldAudio
    });
  }

  async inverse() {
    const {
      selRange
    } = this.state;
    const [selStart, selEnd] = selRange || [0, this.length];
    const audio = await this.instance.pick(selStart, selEnd, true);
    audio.inverse();
    const oldAudio = await this.instance.pasteToRange(audio, selStart, selEnd);
    this.emit("inversed", {
      range: [selStart, selEnd],
      audio,
      oldAudio
    });
  }

  async fade(gain) {
    const {
      selRange,
      enabledChannels
    } = this.state;
    if (!selRange) return;
    const faded = await this.instance.fade(gain, ...selRange, enabledChannels);
    if (faded) this.emit("faded", faded);
  }

  async fadeIn(length, exponent) {
    const {
      enabledChannels
    } = this.state;
    const faded = await this.instance.fadeIn(length, exponent, enabledChannels);
    if (faded) this.emit("fadedIn", faded);
  }

  async fadeOut(length, exponent) {
    const {
      enabledChannels
    } = this.state;
    const faded = await this.instance.fadeOut(length, exponent, enabledChannels);
    if (faded) this.emit("fadedOut", faded);
  }

  async resample(to) {
    if (to <= 0) return;
    const oldAudio = await this.instance.clone();
    if (oldAudio.sampleRate === to) return;
    const audio = await this.instance.render(to);
    this.instance.setAudio(audio);
    this.emit("resampled", {
      audio,
      oldAudio
    });
  }

  async remixChannels(mix) {
    const oldAudio = await this.instance.clone();
    const audio = await this.instance.render(undefined, mix);
    this.instance.setAudio(audio);
    this.emit("remixed", {
      audio,
      oldAudio
    });
  }

  async applyPlugins(selected) {
    const {
      selRange,
      plugins,
      pluginsEnabled,
      preFxGain,
      postFxGain
    } = this.state;
    if (plugins.every(p => !p || !pluginsEnabled.has(p))) return;
    if (selected && !selRange) return;
    const oldAudio = selected ? await this.instance.pick(...selRange) : await this.instance.clone();
    const audio = await oldAudio.render(undefined, undefined, true, {
      plugins,
      pluginsEnabled,
      preFxGain,
      postFxGain
    });
    if (selected) await this.instance.pasteToRange(audio, ...selRange);else this.instance.setAudio(audio);
    plugins.forEach((p, i) => {
      if (!p) return;
      this.setPluginEnabled(i, false);
    });
    this.emit("pluginsApplied", _objectSpread(_objectSpread({}, selected ? {
      range: selRange
    } : {}), {}, {
      audio,
      oldAudio
    }));
  }

  play() {
    const playing = "playing";
    this.setState({
      playing
    });
    this.emit("playing", playing);
    this.player.play();
  }

  pause() {
    const playing = "paused";
    this.setState({
      playing
    });
    this.emit("playing", playing);
    this.player.stop();
  }

  resume() {
    const playing = "playing";
    this.setState({
      playing
    });
    this.emit("playing", playing);
    this.player.play();
  }

  stop() {
    const playing = "stopped";
    this.setState({
      playing
    });
    this.emit("playing", playing);
    this.player.stop();
  }

  startMonitoring() {
    const monitoring = true;
    this.setState({
      monitoring
    });
    this.emit("monitoring", monitoring);
    this.player.startMonitoring();
  }

  stopMonitoring() {
    const monitoring = false;
    this.setState({
      monitoring
    });
    this.emit("monitoring", monitoring);
    this.player.stopMonitoring();
  }

  async startRecord() {
    this.stop();
    const started = await this.recorder.start();
    if (!started) return;
    this.setState({
      recording: true
    });
    this.emit("recording", true);
  }

  async stopRecord() {
    await this.recorder.stop();
    this.setState({
      recording: false
    });
    this.emit("recording", false);
  }

  async addPlugin(url, index) {
    this.env.taskMgr.newTask(this, "Adding Plugin...", () => this.player.addPlugin(url, index));
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
    const {
      plugins,
      pluginsShowing
    } = this.state;
    const plugin = plugins[index];
    if (!plugin) return;
    if (showing) pluginsShowing.add(plugin);else pluginsShowing.delete(plugin);
    this.emitPluginsChanged();
  }

  setPreFxGain(gain) {
    this.state.preFxGain = gain;
    const {
      playing,
      monitoring
    } = this.state;
    if (monitoring || playing === "playing") this.player.preFxGainNode.gain.setTargetAtTime((0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.dbtoa)(gain), this.env.audioCtx.currentTime, 0.01);
  }

  setPostFxGain(gain) {
    this.state.postFxGain = gain;
    const {
      playing,
      monitoring
    } = this.state;
    if (monitoring || playing === "playing") this.player.postFxGainNode.gain.setTargetAtTime((0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.dbtoa)(gain), this.env.audioCtx.currentTime, 0.01);
  }

  async destroy() {
    this._isReady = false;
    this.instance.off("setAudio", this.handleSetAudio);
    if (this.state.recording) await this.stopRecord();
    if (this.state.playing !== "stopped") this.stop();

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
    return ["faded", "fadedIn", "fadedOut", "cutEnd", "pasted", "deleted", "silenced", "insertedSilence", "reversed", "inversed", "resampled", "remixed", "recorded"];
  }

  async undoOf(editor, eventName, eventData) {
    if (eventName === "faded") {
      const e = eventData;
      const {
        range: [selStart, selEnd],
        oldAudio
      } = e;
      await editor.instance.pasteToRange(oldAudio, selStart, selEnd);
    } else if (eventName === "fadedIn") {
      const e = eventData;
      const {
        length,
        oldAudio
      } = e;
      await editor.instance.pasteToRange(oldAudio, 0, length);
    } else if (eventName === "fadedOut") {
      const e = eventData;
      const {
        length,
        oldAudio
      } = e;
      const l = editor.instance.audioBuffer.length;
      await editor.instance.pasteToRange(oldAudio, l - length, l);
    } else if (eventName === "cutEnd") {
      const e = eventData;
      const {
        range: [cursor],
        oldAudio
      } = e;
      await editor.instance.insertToCursor(oldAudio, cursor);
    } else if (eventName === "pasted") {
      const e = eventData;
      const {
        range,
        cursor,
        audio,
        oldAudio
      } = e;

      if (range) {
        await editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
      } else {
        await editor.instance.removeFromRange(cursor, cursor + audio.length);
      }
    } else if (eventName === "deleted") {
      const e = eventData;
      const {
        range: [cursor],
        oldAudio
      } = e;
      await editor.instance.insertToCursor(oldAudio, cursor);
    } else if (eventName === "silenced") {
      const e = eventData;
      const {
        range: [from, to],
        oldAudio
      } = e;
      await editor.instance.pasteToRange(oldAudio, from, to);
    } else if (eventName === "insertedSilence") {
      const e = eventData;
      const {
        range: [from, to]
      } = e;
      await editor.instance.removeFromRange(from, to);
    } else if (eventName === "reversed") {
      const e = eventData;
      const {
        range: [from, to],
        oldAudio
      } = e;
      await editor.instance.pasteToRange(oldAudio, from, to);
    } else if (eventName === "inversed") {
      const e = eventData;
      const {
        range: [from, to],
        oldAudio
      } = e;
      await editor.instance.pasteToRange(oldAudio, from, to);
    } else if (eventName === "resampled") {
      const e = eventData;
      const {
        oldAudio
      } = e;
      editor.instance.setAudio(oldAudio);
    } else if (eventName === "remixed") {
      const e = eventData;
      const {
        oldAudio
      } = e;
      editor.instance.setAudio(oldAudio);
    } else if (eventName === "recorded") {
      const e = eventData;
      const {
        range,
        cursor,
        audio,
        oldAudio
      } = e;

      if (range) {
        await editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
      } else {
        await editor.instance.removeFromRange(cursor, cursor + audio.length);
      }
    }
  }

  async redoOf(editor, eventName, eventData) {
    if (eventName === "faded") {
      const e = eventData;
      const {
        range: [selStart, selEnd],
        audio
      } = e;
      await editor.instance.pasteToRange(audio, selStart, selEnd);
    } else if (eventName === "fadedIn") {
      const e = eventData;
      const {
        length,
        audio
      } = e;
      await editor.instance.pasteToRange(audio, 0, length);
    } else if (eventName === "fadedOut") {
      const e = eventData;
      const {
        length,
        audio
      } = e;
      const l = audio.length;
      await editor.instance.pasteToRange(audio, l - length, l);
    } else if (eventName === "cutEnd") {
      const e = eventData;
      const {
        range: [selStart, selEnd]
      } = e;
      await editor.instance.removeFromRange(selStart, selEnd);
    } else if (eventName === "pasted") {
      const e = eventData;
      const {
        range,
        cursor,
        audio,
        oldAudio
      } = e;

      if (range) {
        await editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
      } else {
        await editor.instance.insertToCursor(audio, cursor);
      }
    } else if (eventName === "deleted") {
      const e = eventData;
      const {
        range: [selStart, selEnd]
      } = e;
      await editor.instance.removeFromRange(selStart, selEnd);
    } else if (eventName === "silenced") {
      const e = eventData;
      const {
        range: [from, to],
        audio
      } = e;
      await editor.instance.pasteToRange(audio, from, to);
    } else if (eventName === "insertedSilence") {
      const e = eventData;
      const {
        range: [cursor],
        audio
      } = e;
      await editor.instance.insertToCursor(audio, cursor);
    } else if (eventName === "reversed") {
      const e = eventData;
      const {
        range: [from, to],
        audio
      } = e;
      await editor.instance.pasteToRange(audio, from, to);
    } else if (eventName === "inversed") {
      const e = eventData;
      const {
        range: [from, to],
        audio
      } = e;
      await editor.instance.pasteToRange(audio, from, to);
    } else if (eventName === "resampled") {
      const e = eventData;
      const {
        audio
      } = e;
      editor.instance.setAudio(audio);
    } else if (eventName === "remixed") {
      const e = eventData;
      const {
        audio
      } = e;
      editor.instance.setAudio(audio);
    } else if (eventName === "recorded") {
      const e = eventData;
      const {
        range,
        cursor,
        audio,
        oldAudio
      } = e;

      if (range) {
        await editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
      } else {
        await editor.instance.insertToCursor(audio, cursor);
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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class AudioPlayer {
  get audioCtx() {
    return this.editor.audioCtx;
  }

  get destination() {
    return this.audioCtx.destination;
  }

  get loop() {
    var _this$bufferSourceNod;

    return (_this$bufferSourceNod = this.bufferSourceNode) === null || _this$bufferSourceNod === void 0 ? void 0 : _this$bufferSourceNod.loop;
  }

  updateCursor() {
    if (!this.bufferSourceNode) return;
    this.editor.setCursor(this.getCurrentSample(), true);
    this.scheduleUpdateCursor();
  }

  constructor(_editor) {
    _defineProperty(this, "editor", void 0);

    _defineProperty(this, "dummyAnalyserNode", void 0);

    _defineProperty(this, "preFxGainNode", void 0);

    _defineProperty(this, "postFxGainNode", void 0);

    _defineProperty(this, "playing", void 0);

    _defineProperty(this, "currentSample", void 0);

    _defineProperty(this, "currentTime", void 0);

    _defineProperty(this, "currentChannels", void 0);

    _defineProperty(this, "bufferSourceNode", void 0);

    _defineProperty(this, "splitterNode", void 0);

    _defineProperty(this, "mergerNode", void 0);

    _defineProperty(this, "postAnalyserNode", void 0);

    _defineProperty(this, "monitoring", void 0);

    _defineProperty(this, "mediaStreamSourceNode", void 0);

    _defineProperty(this, "offset", void 0);

    _defineProperty(this, "duration", void 0);

    _defineProperty(this, "handleLoopChanged", loopIn => {
      const {
        bufferSourceNode,
        editor
      } = this;
      if (!bufferSourceNode) return;
      const {
        buffer,
        loop
      } = bufferSourceNode;
      if (loop === loopIn) return;
      const {
        sampleRate
      } = buffer;
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
        if (selRange) bufferSourceNode.stop(this.currentTime + (selRange[1] - this.currentSample) / sampleRate);else bufferSourceNode.stop(Number.MAX_VALUE);
      }
    });

    _defineProperty(this, "handleSelRangeChanged", selRange => {
      const {
        bufferSourceNode
      } = this;
      if (!bufferSourceNode) return;
      const {
        buffer,
        loop
      } = bufferSourceNode;
      const {
        sampleRate
      } = buffer;

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
        if (selRange) bufferSourceNode.stop(this.currentTime + (selRange[1] - this.currentSample) / sampleRate);else bufferSourceNode.stop(Number.MAX_VALUE);
      }
    });

    _defineProperty(this, "handleEnded", () => {
      const {
        bufferSourceNode
      } = this;
      if (!bufferSourceNode) return;
      this.editor.handlePlayerEnded(this.getCurrentSample());
      this.bufferSourceNode.removeEventListener("ended", this.handleEnded);
      this.bufferSourceNode.disconnect();
      this.splitterNode.disconnect();
      this.mergerNode.disconnect();
      delete this.bufferSourceNode;
      delete this.splitterNode;
      delete this.mergerNode;
    });

    _defineProperty(this, "handleEnabledChannelsChanged", enabledChannels => {
      const {
        bufferSourceNode
      } = this;
      if (!bufferSourceNode) return;
      this.currentChannels.forEach((enabled, i) => {
        if (enabledChannels[i] !== enabled) {
          if (enabledChannels[i]) this.splitterNode.connect(this.mergerNode, i, i);else this.splitterNode.disconnect(this.mergerNode, i, i);
        }
      });
      this.currentChannels = enabledChannels.slice();
    });

    _defineProperty(this, "updateCursorScheduled", false);

    _defineProperty(this, "$updateCursorRaf", -1);

    _defineProperty(this, "updateCursorCallback", () => {
      this.$updateCursorRaf = -1;
      this.updateCursorScheduled = false;
      this.updateCursor();
    });

    _defineProperty(this, "scheduleUpdateCursor", () => {
      if (this.updateCursorScheduled) return;
      if (this.$updateCursorRaf === -1) this.$updateCursorRaf = requestAnimationFrame(this.updateCursorCallback);
      this.updateCursorScheduled = true;
    });

    this.editor = _editor;
    this.playing = false;
    this.monitoring = false; // this.destination.channelInterpretation = "discrete";

    this.dummyAnalyserNode = this.audioCtx.createAnalyser();
    this.preFxGainNode = this.audioCtx.createGain();
    this.postFxGainNode = this.audioCtx.createGain();
    this.postFxGainNode.connect(this.destination);
    this.editor.on("loop", this.handleLoopChanged);
    this.editor.on("selRangeToPlay", this.handleSelRangeChanged);
    this.editor.on("enabledChannels", this.handleEnabledChannelsChanged);
  }

  async init() {
    const audioWorklet = this.audioCtx.audioWorklet;
    await _worklets_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_0__.default.register(audioWorklet);
    this.postAnalyserNode = new _worklets_TemporalAnalyser__WEBPACK_IMPORTED_MODULE_0__.default(this.audioCtx);
    this.postFxGainNode.connect(this.postAnalyserNode);
  }

  async destroy() {
    if (this.playing) this.stop();
    await this.postAnalyserNode.destroy();
  }

  getCurrentSample() {
    var _this$editor$state;

    const {
      buffer
    } = this.bufferSourceNode;
    const delta = (this.audioCtx.currentTime - this.currentTime) * buffer.sampleRate;
    const selRange = ((_this$editor$state = this.editor.state) === null || _this$editor$state === void 0 ? void 0 : _this$editor$state.selRange) || [0, buffer.length];
    this.currentSample += delta;
    this.currentTime = this.audioCtx.currentTime;

    if (this.loop) {
      if (this.currentSample > selRange[1]) this.currentSample = (this.currentSample - selRange[0]) % (selRange[1] - selRange[0]) + selRange[0];
    } else {
      if (this.currentSample > selRange[1]) this.currentSample = selRange[1];
    }

    return ~~this.currentSample;
  }

  play() {
    this.stop();
    const audio = this.editor;
    const {
      cursor,
      selRange,
      enabledChannels,
      preFxGain,
      postFxGain,
      loop
    } = this.editor.state;
    const {
      sampleRate,
      numberOfChannels,
      audioBuffer
    } = audio;
    const offset = (selRange ? selRange[0] : cursor) / sampleRate;
    const duration = selRange ? (selRange[1] - selRange[0]) / sampleRate : undefined;
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
      if (enabled && i < numberOfChannels) this.splitterNode.connect(this.mergerNode, i, i);
    });
    this.mergerNode.connect(this.preFxGainNode);
    if (!this.monitoring) this.connectPlugins();
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
      if (duration) bufferSourceNode.stop(this.currentTime + duration);else bufferSourceNode.stop(Number.MAX_VALUE);
    }

    this.playing = true;
    this.scheduleUpdateCursor();
  }

  stop() {
    if (!this.bufferSourceNode) return;
    this.bufferSourceNode.stop();
    this.bufferSourceNode.removeEventListener("ended", this.handleEnded);
    this.bufferSourceNode.disconnect();
    this.splitterNode.disconnect();
    this.mergerNode.disconnect();
    if (!this.monitoring) this.disconnectPlugins();
    delete this.bufferSourceNode;
    delete this.splitterNode;
    delete this.mergerNode;
    this.playing = false;
  }

  startMonitoring() {
    this.stopMonitoring();
    const sourceNode = this.editor.recorder.node;
    if (!sourceNode) return;
    this.mediaStreamSourceNode = sourceNode;
    if (!this.playing) this.connectPlugins();
    this.mediaStreamSourceNode.connect(this.preFxGainNode);
    this.monitoring = true;
  }

  stopMonitoring() {
    if (!this.mediaStreamSourceNode) return;
    this.mediaStreamSourceNode.disconnect(this.preFxGainNode);
    if (!this.playing) this.disconnectPlugins();
    delete this.mediaStreamSourceNode;
    this.monitoring = false;
  }

  connectPlugins() {
    const {
      plugins,
      pluginsEnabled
    } = this.editor.state;
    let firstPluginNode;
    let lastPluginNode;
    plugins.forEach(p => {
      if (!p) return;
      if (!pluginsEnabled.has(p)) return;
      if (!firstPluginNode) firstPluginNode = p.audioNode;
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
    const {
      plugins,
      pluginsEnabled
    } = this.editor.state;
    this.preFxGainNode.disconnect();
    let lastPluginNode;
    plugins.forEach(p => {
      if (!p) return;
      if (!pluginsEnabled.has(p)) return;
      lastPluginNode = p.audioNode;
    });
    if (lastPluginNode) lastPluginNode.disconnect(this.postFxGainNode);
  }

  async addPlugin(url, indexIn) {
    const {
      plugins,
      pluginsEnabled
    } = this.editor.state;
    const {
      default: Plugin
    } = await import(
    /* webpackIgnore: true */
    url);
    const plugin = await Plugin.createInstance(this.audioCtx);
    const {
      audioNode
    } = plugin;
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

    if (!preNode && usingPlugins) preNode = this.preFxGainNode;
    index = indexIn;

    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }

      index++;
    }

    if (!postNode && usingPlugins) postNode = this.postFxGainNode;
    audioNode.connect(this.dummyAnalyserNode);
    if (preNode && postNode) preNode.disconnect(postNode);
    if (preNode) preNode.connect(audioNode);
    if (postNode) audioNode.connect(postNode);
    plugins.splice(indexIn, 0, plugin);
    pluginsEnabled.add(plugin);
    this.editor.emitPluginsChanged();
    return plugin;
  }

  removePlugin(indexIn) {
    const {
      plugins,
      pluginsEnabled
    } = this.editor.state;
    const plugin = plugins[indexIn];
    if (!plugin) return;
    const {
      audioNode
    } = plugin;
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

    if (!preNode && usingPlugins) preNode = this.preFxGainNode;
    index = indexIn + 1;

    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }

      index++;
    }

    if (!postNode && usingPlugins) postNode = this.postFxGainNode;
    audioNode.disconnect();

    if (pluginsEnabled.has(plugin) && preNode) {
      preNode.disconnect(audioNode);
      if (postNode) preNode.connect(postNode);
    }

    if (plugin.audioNode) plugin.audioNode.destroy();
    delete plugins[indexIn];
    plugins.splice(indexIn, 1);
    if (plugins.length < 10) plugins.push(undefined);
    this.editor.emitPluginsChanged();
  }

  movePlugin(fromIndexIn, toIndexIn) {
    const {
      plugins,
      pluginsEnabled
    } = this.editor.state;
    if (!plugins[fromIndexIn]) return;
    const plugin = plugins[fromIndexIn];
    const {
      audioNode
    } = plugin;
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

    if (!preNode && usingPlugins) preNode = this.preFxGainNode;
    index = fromIndexIn + 1;

    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }

      index++;
    }

    if (!postNode && usingPlugins) postNode = this.postFxGainNode;

    if (enabled) {
      if (preNode) preNode.disconnect(audioNode);
      if (postNode) audioNode.disconnect(postNode);
      if (preNode && postNode) preNode.connect(postNode);
    }

    plugins.splice(fromIndexIn, 1);
    preNode = undefined;
    postNode = undefined;
    index = toIndexIn - 1;

    while (index >= 0) {
      if (plugins[index]) {
        preNode = plugins[index].audioNode;
        break;
      }

      index--;
    }

    if (!preNode && usingPlugins) preNode = this.preFxGainNode;
    index = toIndexIn + 1;

    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }

      index++;
    }

    if (!postNode && usingPlugins) postNode = this.postFxGainNode;

    if (enabled) {
      if (preNode && postNode) preNode.disconnect(postNode);
      if (preNode) preNode.connect(audioNode);
      if (postNode) audioNode.connect(postNode);
    }

    plugins.splice(toIndexIn, 0, plugin);
    this.editor.emitPluginsChanged();
  }

  setPluginEnabled(indexIn, enabled) {
    const {
      plugins,
      pluginsEnabled
    } = this.editor.state;
    const plugin = plugins[indexIn];
    if (!plugin) return;
    if (pluginsEnabled.has(plugin) === enabled) return;
    let index = indexIn - 1;
    const {
      audioNode
    } = plugins[indexIn];
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

    if (!preNode && usingPlugins) preNode = this.preFxGainNode;
    index = indexIn + 1;

    while (index < plugins.length) {
      if (plugins[index]) {
        postNode = plugins[index].audioNode;
        break;
      }

      index++;
    }

    if (!postNode && usingPlugins) postNode = this.postFxGainNode;

    if (enabled) {
      if (preNode && postNode) preNode.disconnect(postNode);
      if (preNode) preNode.connect(audioNode);
      if (postNode) audioNode.connect(postNode);
    } else {
      if (preNode) preNode.disconnect(audioNode);
      if (postNode) audioNode.disconnect(postNode);
      if (preNode && postNode) preNode.connect(postNode);
    }

    if (enabled) pluginsEnabled.add(plugin);else pluginsEnabled.delete(plugin);
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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




class AudioRecorder {
  get audioCtx() {
    return this.editor.audioCtx;
  }

  get audio() {
    return this.editor;
  }

  constructor(editor) {
    _defineProperty(this, "editor", void 0);

    _defineProperty(this, "device", void 0);

    _defineProperty(this, "stream", void 0);

    _defineProperty(this, "constraints", {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false
    });

    _defineProperty(this, "node", void 0);

    _defineProperty(this, "transmitter", void 0);

    _defineProperty(this, "overwrittenAudio", void 0);

    _defineProperty(this, "recording", false);

    _defineProperty(this, "$", void 0);

    _defineProperty(this, "$start", void 0);

    _defineProperty(this, "$end", void 0);

    _defineProperty(this, "inPlace", void 0);

    _defineProperty(this, "handleDeviceChange", async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const enums = devices.filter(d => d.kind === "audioinput").map(d => d.label || d.deviceId);

      if (enums.indexOf(this.device) === -1) {
        this.device = devices.find(d => d.deviceId === "default") ? "default" : devices.length ? devices[0].deviceId : "default";
        await this.newSearch(this.device);
      }
    });

    _defineProperty(this, "handleReceiveBuffer", async (bufferIn, $total) => {
      if (!this.recording) return;
      let extended = false;
      const {
        $,
        $start,
        $end,
        inPlace,
        audio,
        overwrittenAudio
      } = this;
      const {
        length,
        numberOfChannels,
        sampleRate
      } = audio;
      const $target = $start + $total;
      const copyLength = (inPlace ? Math.min($target, $end) : $target) - $;

      if (!inPlace && $target > length) {
        // extend current buffer
        const newLength = 2 ** Math.ceil(Math.log(length + sampleRate) / Math.log(2));
        const newBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_0__.default({
          numberOfChannels,
          length: newLength,
          sampleRate
        });

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

            if (!inPlace || $target <= $end) channel.set(bufferIn[i], $);else channel.set(bufferIn[i].subarray(0, copyLength), $);
          }
        }

        audio.waveform.update($, $ + copyLength);
      }

      this.$ += copyLength;
      audio.instance.emit("setAudio");
      this.editor.setCursor(this.$);
      if (extended) this.editor.setViewRange([this.editor.state.viewRange[0], this.audio.length]);

      if (inPlace && this.$ === $end) {
        this.editor.setRecording(false);
        await this.stop();
      }
    });

    _defineProperty(this, "newSearch", async search => {
      if (this.device && this.device === search) return;

      if (this.stream && (this.recording || this.editor.player.monitoring)) {
        this.node.disconnect();
        this.stream.getAudioTracks().forEach(t => t.stop());
        delete this.node;
        delete this.stream;
        delete this.editor.player.mediaStreamSourceNode;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const enums = devices.filter(d => d.kind === "audioinput");

      if (search) {
        const device = devices.find(d => d.kind === "audioinput" && (d.deviceId === search || d.label === search));
        if (device) this.device = device.deviceId;
      } else {
        this.device = enums.length ? enums[0].deviceId : undefined;
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: this.getConstraints(this.device)
      });

      if (this.stream) {
        if (this.recording || this.editor.player.monitoring) {
          this.resetNode();
          this.node.connect(this.transmitter);
          if (this.editor.player.monitoring) this.node.connect(this.editor.player.preFxGainNode);else this.node.connect(this.editor.player.postAnalyserNode);
        } else {
          this.resetNode();
        }
      }
    });

    this.editor = editor;
    navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
  }

  async init() {
    await _worklets_Transmitter__WEBPACK_IMPORTED_MODULE_2__.default.register(this.audioCtx.audioWorklet);
    this.transmitter = new _worklets_Transmitter__WEBPACK_IMPORTED_MODULE_2__.default(this.audioCtx);
    this.transmitter.handleReceiveBuffer = this.handleReceiveBuffer;
    await this.newSearch();
  }

  async destroy() {
    navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
    if (this.recording) await this.stop();
    await this.transmitter.destroy();
  }

  getConstraints(deviceId) {
    return _objectSpread({
      deviceId,
      sampleRate: this.editor.sampleRate || this.audioCtx.sampleRate,
      channelCount: this.editor.numberOfChannels || undefined
    }, this.constraints);
  }

  resetNode() {
    if (this.stream) {
      this.node = this.audioCtx.createMediaStreamSource(this.stream);
      this.node.channelInterpretation = "discrete";
    }
  }

  async start() {
    if (!this.node) return false;
    this.node.connect(this.transmitter);
    if (!this.editor.player.monitoring) this.node.connect(this.editor.player.postAnalyserNode);
    const {
      state,
      ctx,
      length,
      numberOfChannels,
      sampleRate
    } = this.editor;
    const {
      cursor,
      selRange
    } = state;

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
    if (overwrittenBufferLength) this.overwrittenAudio = await _PatcherAudio__WEBPACK_IMPORTED_MODULE_1__.default.fromSilence(ctx, numberOfChannels, overwrittenBufferLength, sampleRate);else this.overwrittenAudio = undefined;
    this.recording = true;
    await this.transmitter.reset();
    await this.transmitter.start();
    return true;
  }

  async stop() {
    this.recording = false;
    if (!this.node) return;
    if (!this.editor.player.monitoring) this.node.disconnect(this.editor.player.postAnalyserNode);
    await this.transmitter.stop();

    if (!this.inPlace && this.$ > this.$end && this.$ < this.audio.length) {
      const [audio] = await this.audio.instance.split(this.$);
      this.audio.instance.setAudio(audio);
      if (this.overwrittenAudio) this.overwrittenAudio.waveform.update();
    } else {
      if (this.overwrittenAudio) {
        if (this.$ < this.$end) {
          const [audio] = await this.overwrittenAudio.split(this.$ - this.$start);
          this.overwrittenAudio.setAudio(audio);
        }

        this.overwrittenAudio.waveform.update();
      }
    }

    const audio = await this.audio.instance.pick(this.$start, this.$, true);
    this.editor.emit("recorded", {
      range: this.inPlace || this.overwrittenAudio ? [this.$start, this.$] : undefined,
      cursor: this.inPlace || this.overwrittenAudio ? undefined : this.$start,
      audio,
      oldAudio: this.overwrittenAudio
    });
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

  concat(that) {
    let numberOfChannels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.numberOfChannels;
    const {
      sampleRate
    } = this;
    const length = this.length + that.length;
    const buffer = new OperableAudioBuffer({
      numberOfChannels,
      length,
      sampleRate
    });
    const from = this.length;

    for (let i = 0; i < numberOfChannels; i++) {
      // const channel = buffer.getChannelData(i);
      // const channel1 = i < buffer1.numberOfChannels ? buffer1.getChannelData(i) : new Float32Array(buffer1.length);
      // const channel2 = i < buffer2.numberOfChannels ? buffer2.getChannelData(i) : new Float32Array(buffer2.length);
      if (i < this.numberOfChannels) buffer.copyToChannel(this.getChannelData(i), i);
      if (i < that.numberOfChannels) buffer.copyToChannel(that.getChannelData(i), i, from); // channel.set(channel1);
      // channel.set(channel2, from);
    }

    return buffer;
  }

  split(from) {
    if (from >= this.length || from <= 0) throw new RangeError("Split point is out of bound"); // split buffer

    const {
      length,
      sampleRate,
      numberOfChannels
    } = this;
    const buffer1 = new OperableAudioBuffer({
      length: from,
      numberOfChannels,
      sampleRate
    });
    const buffer2 = new OperableAudioBuffer({
      length: length - from,
      numberOfChannels,
      sampleRate
    });

    for (let i = 0; i < numberOfChannels; i++) {
      // const channel = buffer.getChannelData(i);
      const channel1 = buffer1.getChannelData(i);
      const channel2 = buffer2.getChannelData(i);
      this.copyFromChannel(channel1, i);
      this.copyFromChannel(channel2, i, from); // channel1.set(channel.subarray(0, from));
      // channel2.set(channel.subarray(from));
    }

    return [buffer1, buffer2];
  }

  write(channel, index, value) {
    if (channel > this.numberOfChannels) throw new Error("Channel written ".concat(channel, " out of range ").concat(this.numberOfChannels));
    if (index > this.length) throw new Error("Index written ".concat(index, " out of range ").concat(this.length));
    this.getChannelData(channel)[index] = value;
  }

  toArray() {
    let shared = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const supportSAB = typeof SharedArrayBuffer !== "undefined";
    const channelData = [];
    const {
      numberOfChannels,
      length
    } = this;

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
/* harmony import */ var _utils_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/math */ "./src/utils/math.ts");
/* harmony import */ var _AudioEditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AudioEditor */ "./src/core/audio/AudioEditor.ts");
/* harmony import */ var _file_FileInstance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../file/FileInstance */ "./src/core/file/FileInstance.ts");
/* harmony import */ var _AudioHistory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AudioHistory */ "./src/core/audio/AudioHistory.ts");
/* harmony import */ var _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./OperableAudioBuffer */ "./src/core/audio/OperableAudioBuffer.ts");
/* harmony import */ var _utils_Waveform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/Waveform */ "./src/utils/Waveform.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







class PatcherAudio extends _file_FileInstance__WEBPACK_IMPORTED_MODULE_2__.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "audioBuffer", void 0);

    _defineProperty(this, "waveform", void 0);

    _defineProperty(this, "_history", new _AudioHistory__WEBPACK_IMPORTED_MODULE_3__.default());
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
    const audioBuffer = Object.setPrototypeOf(bufferIn, _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_4__.default.prototype);
    audio.audioBuffer = audioBuffer;
    audio.waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_5__.default(audio);
    await audio.waveform.generate();
    await audio.emit("postInit");
    audio._isReady = true;
    await audio.emit("ready");
    return audio;
  }

  static async fromSilence(optionsIn, numberOfChannels, length, sampleRate) {
    const audio = new PatcherAudio(optionsIn);
    audio.audioBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_4__.default({
      length,
      numberOfChannels,
      sampleRate
    });
    audio.waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_5__.default(audio);
    audio.waveform.generateEmpty(numberOfChannels, length);
    await audio.emit("postInit");
    audio._isReady = true;
    await audio.emit("ready");
    return audio;
  }

  async getEditor() {
    const editor = new _AudioEditor__WEBPACK_IMPORTED_MODULE_1__.default(this);
    return editor.init();
  }

  get audioCtx() {
    var _this$project;

    return ((_this$project = this.project) === null || _this$project === void 0 ? void 0 : _this$project.audioCtx) || this.env.audioCtx;
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

  async init(data) {
    const {
      audioCtx
    } = this;
    await this.env.taskMgr.newTask(this, "Initializing Audio", async onUpdate => {
      onUpdate("Decoding Audio...");

      if (data !== null && data !== void 0 && data.byteLength) {
        const audioBuffer = await audioCtx.decodeAudioData(data);
        this.audioBuffer = Object.setPrototypeOf(audioBuffer, _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_4__.default.prototype);
      } else {
        this.audioBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_4__.default({
          length: 1,
          numberOfChannels: 1,
          sampleRate: audioCtx.sampleRate
        });
      }

      onUpdate("Generating Waveform...");
      this.waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_5__.default(this);
      await this.waveform.generate();
    });
    this.on("setAudio", () => this.emit("changed"));
    await this.emit("postInit");
    this._isReady = true;
    await this.emit("ready");
    return this;
  }

  async initWithOptions(options) {
    const {
      length = 1,
      numberOfChannels = 1,
      sampleRate = this.audioCtx.sampleRate
    } = options;
    this.audioBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_4__.default({
      length,
      numberOfChannels,
      sampleRate
    });
    this.waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_5__.default(this);
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

  async serialize() {
    let optionsIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      bitDepth: 32,
      float: true
    };
    return this.env.taskMgr.newTask(this, "Encoding audio WAVE...", () => {
      const audioData = this.audioBuffer.toArray(true);

      const options = _objectSpread({
        sampleRate: this.audioBuffer.sampleRate,
        bitDepth: 32,
        float: true
      }, optionsIn);

      return this.env.wavEncoderWorker.encode(audioData, options);
    });
  }

  encodeFFmpegWorker(wav, inputFileName, outputFileName) {
    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    return this.env.taskMgr.newTask(this, "Encoding audio ".concat(outputFileName, "..."), async onUpdate => {
      const ffmpegWorker = await this.env.getFFmpeg(); // const handleProgress = (ratio: number) => onUpdate(`Encoding: ${(ratio * 100).toFixed(2)}%`);

      ffmpegWorker.on("ffout", onUpdate);
      ffmpegWorker.on("fferr", onUpdate);
      ffmpegWorker.on("info", onUpdate); // ffmpegWorker.on("progress", handleProgress);

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
        ffmpegWorker.off("info", onUpdate); // ffmpegWorker.off("progress", handleProgress);
      }
    });
  }

  async encodeMp3(bitrate) {
    const wav = new Uint8Array(await this.serialize({
      shared: true
    }));
    const inputFileName = "in.wav";
    const outputFileName = "out.mp3";
    return this.encodeFFmpegWorker(wav, inputFileName, outputFileName, "-codec:a", "libmp3lame", "-b:a", "".concat(bitrate, "k"));
  }

  async encodeAac(bitrate) {
    const wav = new Uint8Array(await this.serialize({
      shared: true
    }));
    const inputFileName = "in.wav";
    const outputFileName = "out.m4a";
    return this.encodeFFmpegWorker(wav, inputFileName, outputFileName, "-codec:a", "aac", "-b:a", "".concat(bitrate, "k"));
  }

  async clone() {
    const audio = new PatcherAudio({
      env: this.env,
      project: this.project,
      file: this.file
    });
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

  async silence(range) {
    const [selStart, selEnd] = range;
    const length = selEnd - selStart;
    const audio = await PatcherAudio.fromSilence({
      env: this.env,
      project: this.project,
      file: this.file
    }, this.numberOfChannels, length, this.sampleRate);
    const oldAudio = await this.pasteToRange(audio, selStart, selEnd);
    return {
      range: [selStart, selEnd],
      audio,
      oldAudio
    };
  }

  async insertSilence(length, from) {
    if (!length) return null;
    const audio = await PatcherAudio.fromSilence({
      env: this.env,
      project: this.project,
      file: this.file
    }, this.numberOfChannels, length, this.sampleRate);
    this.insertToCursor(audio, from);
    return {
      range: [from, from + length],
      audio
    };
  }

  reverse() {
    this.audioBuffer.reverse();
    this.waveform.reverse();
  }

  inverse() {
    this.audioBuffer.inverse();
    this.waveform.inverse();
  }

  async concat(that) {
    let numberOfChannels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.audioBuffer.numberOfChannels;
    const audio = new PatcherAudio({
      env: this.env,
      project: this.project,
      file: this.file
    });
    const audioBuffer = this.audioBuffer.concat(that.audioBuffer, numberOfChannels);
    audio.audioBuffer = audioBuffer;
    const waveform = this.waveform.concat(that.waveform, audio, numberOfChannels);
    await audio.initWith({
      audioBuffer,
      waveform
    });
    return audio;
  }

  async split(from) {
    const audio1 = new PatcherAudio({
      env: this.env,
      project: this.project,
      file: this.file
    });
    const audio2 = new PatcherAudio({
      env: this.env,
      project: this.project,
      file: this.file
    });
    const [ab1, ab2] = this.audioBuffer.split(from);
    audio1.audioBuffer = ab1;
    audio2.audioBuffer = ab2;
    const [wf1, wf2] = this.waveform.split(from, audio1, audio2);
    await audio1.initWith({
      audioBuffer: ab1,
      waveform: wf1
    });
    await audio2.initWith({
      audioBuffer: ab2,
      waveform: wf2
    });
    return [audio1, audio2];
  }

  async pick(from, to) {
    let clone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let picked;
    let audioBuffer;
    let waveform;

    if (from <= 0 && to >= this.length) {
      picked = new PatcherAudio({
        env: this.env,
        project: this.project,
        file: this.file
      });

      if (clone) {
        audioBuffer = this.audioBuffer.clone();
        waveform = this.waveform.clone();
      } else {
        audioBuffer = this.audioBuffer;
        waveform = this.waveform;
      }

      await picked.initWith({
        audioBuffer,
        waveform
      });
      return picked; // eslint-disable-next-line no-else-return
    } else if (from <= 0) {
      picked = (await this.split(to))[0];
    } else if (to >= this.length) {
      picked = (await this.split(from))[1];
    } else {
      const p0 = (await this.split(to))[0];
      picked = (await p0.split(from))[1];
    }

    if (clone) picked.waveform = picked.waveform.clone();
    return picked;
  }

  async removeFromRange(from, to) {
    if (from === 0 && to === this.length) {
      const old = await this.clone();
      const {
        numberOfChannels,
        sampleRate
      } = this.audioBuffer;
      const audioBuffer = new _OperableAudioBuffer__WEBPACK_IMPORTED_MODULE_4__.default({
        length: 1,
        numberOfChannels,
        sampleRate
      });
      const waveform = new _utils_Waveform__WEBPACK_IMPORTED_MODULE_5__.default(this);
      this.setAudio({
        audioBuffer,
        waveform
      });
      this.setCursor(from);
      return old; // eslint-disable-next-line no-else-return
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
      return old; // eslint-disable-next-line no-else-return
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

  async fade(gain, from, to, enabledChannels) {
    const oldAudio = await this.pick(from, to, true);
    const factor = (0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.dbtoa)(gain);

    for (let c = 0; c < this.numberOfChannels; c++) {
      if (!enabledChannels[c]) return null;
      const channel = this.audioBuffer.getChannelData(c);

      for (let i = from; i < to; i++) {
        channel[i] *= factor;
      }
    }

    this.waveform.update(from, to);
    const audio = await this.pick(from, to, true);
    return {
      gain,
      range: [from, to],
      audio,
      oldAudio
    };
  }

  async fadeIn(lengthIn, exponent, enabledChannels) {
    const length = Math.max(0, Math.min(this.length, ~~lengthIn));
    if (!length) return null;
    const oldAudio = await this.pick(0, length, true);

    for (let c = 0; c < this.numberOfChannels; c++) {
      if (!enabledChannels[c]) return null;
      const channel = this.audioBuffer.getChannelData(c);

      for (let i = 0; i < length; i++) {
        channel[i] *= (0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.normExp)(i / length, exponent);
      }
    }

    this.waveform.update(0, length);
    const audio = await this.pick(0, length, true);
    return {
      length,
      exponent,
      audio,
      oldAudio
    };
  }

  async fadeOut(lengthIn, exponent, enabledChannels) {
    const l = this.length;
    const length = Math.max(0, Math.min(l, ~~lengthIn));
    if (!length) return null;
    const oldAudio = await this.pick(l - length, l, true);

    for (let c = 0; c < this.numberOfChannels; c++) {
      if (!enabledChannels[c]) return null;
      const channel = this.audioBuffer.getChannelData(c);

      for (let i = 0; i < length; i++) {
        channel[l - i] *= (0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.normExp)(i / length, exponent);
      }
    }

    this.waveform.update(l - length, l);
    const audio = await this.pick(l - length, l, true);
    return {
      length,
      exponent,
      audio,
      oldAudio
    };
  }

  write(channel, index, value) {
    this.audioBuffer.write(channel, index, value);
    this.waveform.update(index, index + 1);
  }

  async render(sampleRateIn, mix, applyPlugins, pluginsOptions) {
    return this.env.taskMgr.newTask(this, "Rendering audio...", async () => {
      let {
        length
      } = this;
      const needResample = sampleRateIn && this.sampleRate !== sampleRateIn;
      const needRemix = mix && (mix.length !== this.numberOfChannels || !(0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.isIdentityMatrix)(mix));
      if (!needResample && !needRemix && !applyPlugins) return this;
      if (needResample) length = Math.ceil(length * sampleRateIn / this.sampleRate);
      const numberOfChannels = mix ? mix.length : this.numberOfChannels;
      const sampleRate = sampleRateIn || this.sampleRate;
      let mixBuffer;

      if (!needRemix) {
        mixBuffer = this.audioBuffer;
      } else {
        await this.env.taskMgr.newTask(this, "Remixing audio...", () => {
          mixBuffer = new AudioBuffer({
            numberOfChannels,
            length: this.length,
            sampleRate: this.sampleRate
          });

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

      if (!applyPlugins && !needResample) return PatcherAudio.fromNativeAudioBuffer({
        env: this.env,
        project: this.project,
        file: this.file
      }, mixBuffer);
      const offlineAudioCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
      const source = offlineAudioCtx.createBufferSource();
      source.buffer = mixBuffer;

      if (applyPlugins) {
        await this.env.taskMgr.newTask(this, "Applying plugins...", async onUpdate => {
          const {
            plugins,
            pluginsEnabled,
            preFxGain,
            postFxGain
          } = pluginsOptions;
          const preFxGainNode = offlineAudioCtx.createGain();
          preFxGainNode.gain.value = (0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.dbtoa)(preFxGain);
          const postFxGainNode = offlineAudioCtx.createGain();
          postFxGainNode.gain.value = (0,_utils_math__WEBPACK_IMPORTED_MODULE_0__.dbtoa)(postFxGain);
          source.connect(preFxGainNode);
          let lastNode = preFxGainNode;

          for (const plugin of plugins) {
            if (!plugin) continue;
            if (!pluginsEnabled.has(plugin)) continue;
            onUpdate(plugin.name);

            try {
              const Plugin = Object.getPrototypeOf(plugin).constructor;
              const p = await Plugin.createInstance(offlineAudioCtx);
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
        return PatcherAudio.fromNativeAudioBuffer({
          env: this.env,
          project: this.project,
          file: this.file
        }, bufferOut);
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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Node = class Node extends AudioWorkletNode {
  static get fnNames() {
    return [];
  }

  constructor(context, name, options) {
    var _this;

    super(context, name, options);
    _this = this;

    _defineProperty(this, "_disposed", false);

    const resolves = {};
    const rejects = {};
    let messagePortRequestId = 1;

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
    }; // eslint-disable-next-line


    const call = function call(_call) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return new Promise((resolve, reject) => {
        const id = messagePortRequestId++;
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
var _window$jspatcherEnv, _window$jspatcherEnv$, _window$jspatcherEnv2, _window$jspatcherEnv3, _window$jspatcherEnv4, _window$jspatcherEnv5, _window$jspatcherEnv6, _window$jspatcherEnv7;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const registeredProcessors = ((_window$jspatcherEnv = window.jspatcherEnv) === null || _window$jspatcherEnv === void 0 ? void 0 : (_window$jspatcherEnv$ = _window$jspatcherEnv.AudioWorkletRegister) === null || _window$jspatcherEnv$ === void 0 ? void 0 : _window$jspatcherEnv$.registeredProcessors) || new WeakMap();
const registeringProcessors = ((_window$jspatcherEnv2 = window.jspatcherEnv) === null || _window$jspatcherEnv2 === void 0 ? void 0 : (_window$jspatcherEnv3 = _window$jspatcherEnv2.AudioWorkletRegister) === null || _window$jspatcherEnv3 === void 0 ? void 0 : _window$jspatcherEnv3.registeringProcessors) || new WeakMap();
const resolves = ((_window$jspatcherEnv4 = window.jspatcherEnv) === null || _window$jspatcherEnv4 === void 0 ? void 0 : (_window$jspatcherEnv5 = _window$jspatcherEnv4.AudioWorkletRegister) === null || _window$jspatcherEnv5 === void 0 ? void 0 : _window$jspatcherEnv5.resolves) || {};
const rejects = ((_window$jspatcherEnv6 = window.jspatcherEnv) === null || _window$jspatcherEnv6 === void 0 ? void 0 : (_window$jspatcherEnv7 = _window$jspatcherEnv6.AudioWorkletRegister) === null || _window$jspatcherEnv7 === void 0 ? void 0 : _window$jspatcherEnv7.rejects) || {};
class AudioWorkletRegister {
  static async registerProcessor(audioWorklet, processorId, processor) {
    this.registeringProcessors.get(audioWorklet).add(processorId);

    try {
      for (var _len = arguments.length, injection = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        injection[_key - 3] = arguments[_key];
      }

      const url = typeof processor === "string" ? processor : URL.createObjectURL(new Blob(["(".concat(processor.toString(), ")(").concat([processorId, ...injection].map(JSON.stringify).join(", "), ");")], {
        type: "text/javascript"
      }));
      await audioWorklet.addModule(url);
      this.resolves[processorId].forEach(f => f());
      this.registeringProcessors.get(audioWorklet).delete(processorId);
      this.registeredProcessors.get(audioWorklet).add(processorId);
    } catch (e) {
      this.rejects[processorId].forEach(f => f(e));
    }

    this.rejects[processorId] = [];
    this.resolves[processorId] = [];
  }

  static async register(audioWorklet, processorId, processor) {
    if (!this.resolves[processorId]) this.resolves[processorId] = [];
    if (!this.rejects[processorId]) this.rejects[processorId] = [];
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
    if (registered) return Promise.resolve();
    if (registering) return promise;

    if (!registered && audioWorklet) {
      for (var _len2 = arguments.length, injection = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        injection[_key2 - 3] = arguments[_key2];
      }

      this.registerProcessor(audioWorklet, processorId, processor, ...injection);
    }

    return promise;
  }

}

_defineProperty(AudioWorkletRegister, "registeredProcessors", registeredProcessors);

_defineProperty(AudioWorkletRegister, "registeringProcessors", registeringProcessors);

_defineProperty(AudioWorkletRegister, "resolves", resolves);

_defineProperty(AudioWorkletRegister, "rejects", rejects);

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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // eslint-disable-line import/extensions



const processorId = "__JSPatcher_TemporalAnalyser";
class TemporalAnalyserNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor(context) {
    super(context, processorId, {
      numberOfInputs: 1,
      numberOfOutputs: 0
    });
    const _destroy = this.destroy;

    this.destroy = async () => {
      await _destroy.call(this);
      this._disposed = true;
    };
  }

}

_defineProperty(TemporalAnalyserNode, "processorId", processorId);

_defineProperty(TemporalAnalyserNode, "register", audioWorklet => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__.default.register(audioWorklet, processorId, (_TemporalAnalyser_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default())));

_defineProperty(TemporalAnalyserNode, "fnNames", ["getRms", "getAbsMax", "getZcr", "getEstimatedFreq", "getBuffer", "gets", "destroy"]);

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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // eslint-disable-line import/extensions



const processorId = "__JSPatcher_Transmitter";
class TransmitterNode extends _AudioWorkletProxyNode__WEBPACK_IMPORTED_MODULE_1__.default {
  constructor(context) {
    super(context, processorId, {
      numberOfInputs: 1,
      numberOfOutputs: 0
    });

    _defineProperty(this, "handleReceiveBuffer", void 0);

    const _destroy = this.destroy;

    this.destroy = async () => {
      await _destroy.call(this);
      this._disposed = true;
    };
  }

  setBuffer(_ref) {
    let {
      buffer,
      $total
    } = _ref;
    if (this.handleReceiveBuffer) this.handleReceiveBuffer(buffer, $total);
  }

}

_defineProperty(TransmitterNode, "processorId", processorId);

_defineProperty(TransmitterNode, "register", audioWorklet => _AudioWorkletRegister__WEBPACK_IMPORTED_MODULE_2__.default.register(audioWorklet, processorId, (_Transmitter_worklet_ts__WEBPACK_IMPORTED_MODULE_0___default())));

_defineProperty(TransmitterNode, "fnNames", ["start", "stop", "reset", "destroy"]);

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
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Waveform {
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
    return Object.keys(this).filter(v => +v).map(v => +v).sort((a, b) => a - b);
  }

  constructor(patcherAudioIn, waveformDataIn) {
    _defineProperty(this, "worker", void 0);

    _defineProperty(this, "_patcherAudio", void 0);

    this.worker = patcherAudioIn.env.waveformWorker;
    this.patcherAudio = patcherAudioIn;
    if (!waveformDataIn) return;
    Object.keys(waveformDataIn).filter(v => +v).map(v => +v).forEach(stepLength => {
      const stepData = waveformDataIn[stepLength];
      this[stepLength] = [];
      const newStepData = this[stepLength];
      if (stepData.length) newStepData.idx = stepData.idx.slice();

      for (let c = 0; c < stepData.length; c++) {
        const {
          min,
          max
        } = stepData[c];
        newStepData[c] = {
          min: min.slice(),
          max: max.slice()
        };
      }
    });
  }

  clone() {
    return new Waveform(this.patcherAudio, this);
  }

  async generate() {
    const audioChannelData = this.audioBuffer.toArray(true);
    const data = await this.worker.generate(audioChannelData, Waveform.stepsFactor);

    for (const key in data) {
      this[key] = data[key];
    }
  }

  generateEmpty(numberOfChannels, l) {
    const {
      stepsFactor
    } = Waveform;

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
        stepData[c] = {
          min: minData,
          max: maxData
        };
      }
    }
  }

  generateStep(stepLength) {
    const {
      stepsFactor
    } = Waveform;
    const {
      audioBuffer: buffer
    } = this;
    if (!this[stepLength]) this[stepLength] = [];
    const l = buffer.length;
    let maxInStep;
    let minInStep;

    if (stepLength === stepsFactor) {
      // recalculate from samples
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
              if (samp > maxInStep) maxInStep = samp;
              if (samp < minInStep) minInStep = samp;
            }
          }

          minData[i] = minInStep;
          maxData[i] = maxInStep;
        }

        this[stepLength][c] = {
          min: minData,
          max: maxData
        };
      }
    } else {
      // calculate from lower level
      const {
        idx: prevIdx
      } = this[stepLength / stepsFactor];
      const stepsCount = Math.ceil(prevIdx.length / 16);
      const idxData = new Int32Array(stepsCount);

      for (let i = 0; i < idxData.length; i++) {
        idxData[i] = prevIdx[i * stepsFactor];
      }

      this[stepLength].idx = idxData;

      for (let c = 0; c < buffer.numberOfChannels; c++) {
        const minData = new Float32Array(stepsCount);
        const maxData = new Float32Array(stepsCount);
        const {
          min: prevMin,
          max: prevMax
        } = this[stepLength / stepsFactor][c];

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
              if (sampMax > maxInStep) maxInStep = sampMax;
              if (sampMin < minInStep) minInStep = sampMin;
            }
          }

          minData[i] = minInStep;
          maxData[i] = maxInStep;
        }

        this[stepLength][c] = {
          min: minData,
          max: maxData
        };
      }
    }

    return this[stepLength];
  }

  update() {
    let from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.audioBuffer.length;
    const {
      stepsFactor
    } = Waveform;
    const {
      audioBuffer: buffer
    } = this;
    const l = buffer.length;

    for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
      let stepData;

      if (this[stepLength]) {
        stepData = this[stepLength];
        let {
          idx: idxData
        } = stepData; // check if need expansion

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
          let {
            min: minData,
            max: maxData
          } = stepData[c];

          if (expand) {
            const min = new Float32Array(idxData.length);
            const max = new Float32Array(idxData.length);
            min.set(minData);
            max.set(maxData);
            minData = min;
            maxData = max;
            stepData[c] = {
              min: minData,
              max: maxData
            };
          } // index range to rebuild data


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
            // recalculate from samples
            for (let i = $from; i < $to; i++) {
              const $0 = idxData[i];
              const $1 = i === idxData.length - 1 ? l : idxData[i + 1];

              for (let j = $0; j < $1; j++) {
                const samp = samples[j];

                if (j === $0) {
                  maxInStep = samp;
                  minInStep = samp;
                } else {
                  if (samp > maxInStep) maxInStep = samp;
                  if (samp < minInStep) minInStep = samp;
                }
              }

              minData[i] = minInStep;
              maxData[i] = maxInStep;
            }
          } else {
            const {
              idx: prevIdx
            } = this[stepLength / stepsFactor];
            const {
              min: prevMin,
              max: prevMax
            } = this[stepLength / stepsFactor][c];

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
                  if (sampMax > maxInStep) maxInStep = sampMax;
                  if (sampMin < minInStep) minInStep = sampMin;
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
    this.steps.forEach(stepLength => {
      const stepData = this[stepLength];

      for (let c = 0; c < stepData.length; c++) {
        const {
          min,
          max
        } = stepData[c];

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
    this.steps.forEach(stepLength => {
      const stepData = this[stepLength];

      if (stepData.length) {
        const {
          idx
        } = stepData;
        idx.reverse();

        for (let i = 0; i < idx.length; i++) {
          idx[i] = length - idx[i];
        }

        idx.set(idx.subarray(0, -1), 1);
        idx[0] = 0;
      }

      for (let c = 0; c < stepData.length; c++) {
        const {
          min,
          max
        } = stepData[c];
        min.reverse();
        max.reverse();
      }
    });
  }
  /**
   * Returns a new Waveform instance concatenating this and another waveform
   *
   * @param {Waveform} that waveform to concat
   * @param {PatcherAudio} patcherAudio result PatcherAudio
   * @param {number} [numberOfChannels=patcherAudio.audioBuffer.numberOfChannels] number of channels
   */


  concat(that, patcherAudio) {
    let numberOfChannels = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : patcherAudio.audioBuffer.numberOfChannels;
    const {
      stepsFactor
    } = Waveform;
    const {
      length: l
    } = patcherAudio.audioBuffer;
    const from = this.length;
    const waveform = new Waveform(patcherAudio);

    for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
      const stepData = [];
      let stepData1 = this[stepLength];
      let stepData2 = that[stepLength];
      waveform[stepLength] = stepData;

      if (!stepData1) {
        // recalculate data1
        stepData1 = this.generateStep(stepLength);
      }

      if (!stepData2) {
        // recalculate data2
        stepData2 = that.generateStep(stepLength);
      }

      const {
        idx: idxData1
      } = stepData1;
      const {
        idx: idxData2
      } = stepData2;
      const idxData = new Int32Array(idxData1.length + idxData2.length);
      idxData.set(idxData1);
      idxData.set(idxData2, idxData1.length);

      for (let j = idxData1.length; j < idxData.length; j++) {
        idxData[j] += from;
      }

      stepData.idx = idxData;

      for (let c = 0; c < numberOfChannels; c++) {
        const {
          min: minData1,
          max: maxData1
        } = stepData1[c] || {};
        const {
          min: minData2,
          max: maxData2
        } = stepData2[c] || {};
        const minData = new Float32Array(idxData1.length + idxData2.length);
        const maxData = new Float32Array(idxData1.length + idxData2.length);
        if (minData1) minData.set(minData1);
        if (minData2) minData.set(minData2, idxData1.length);
        if (maxData1) maxData.set(maxData1);
        if (maxData2) maxData.set(maxData2, idxData1.length);
        stepData[c] = {
          min: minData,
          max: maxData
        };
      }
    }

    return waveform;
  }
  /**
   * Split this Waveform into two instances.
   *
   * @param {number} from Split point in sample
   * @param {PatcherAudio} patcherAudio1 Splitted PatcherAudio 1
   * @param {PatcherAudio} patcherAudio2 Splitted PatcherAudio 2
   * @returns {[Waveform, Waveform]} Splitted Waveforms
   */


  split(from, patcherAudio1, patcherAudio2) {
    const {
      audioBuffer: buffer
    } = this;
    const l = buffer.length;
    if (from >= l || from <= 0) throw new RangeError("Split point is out of bound");
    const {
      audioBuffer: audioBuffer1
    } = patcherAudio1;
    const {
      audioBuffer: audioBuffer2
    } = patcherAudio2; // split waveform

    const waveform1 = new Waveform(patcherAudio1);
    const waveform2 = new Waveform(patcherAudio2);
    const waveformKeys = this.steps;

    for (let i = 0; i < waveformKeys.length; i++) {
      const stepLength = waveformKeys[i];
      const stepData = this[stepLength];
      const stepData1 = [];
      const stepData2 = [];
      waveform1[stepLength] = stepData1;
      waveform2[stepLength] = stepData2;
      const {
        idx
      } = stepData;
      let $data; // index of data to split from, next buffer index if split between

      let splitBetween = false;

      for (let i = 1; i <= idx.length; i++) {
        const $ = i === idx.length ? l : idx[i];

        if ($ >= from) {
          splitBetween = $ !== from;
          $data = i;
          break;
        }
      } // split index data for every channel


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
        // split data
        let {
          min: minData1,
          max: maxData1
        } = stepData[c];

        if ($data !== idx.length) {
          minData1 = minData1.subarray(0, $data);
          maxData1 = maxData1.subarray(0, $data);
        }

        stepData1[c] = {
          min: minData1,
          max: maxData1
        };
        let {
          min: minData2,
          max: maxData2
        } = stepData[c];

        if ($data - 1 !== 0) {
          minData2 = minData2.subarray($data - +splitBetween);
          maxData2 = maxData2.subarray($data - +splitBetween);
        }

        stepData2[c] = {
          min: minData2,
          max: maxData2
        }; // recalculate

        if (splitBetween) {
          let maxInStep;
          let minInStep;

          if (i === 0) {
            // calculate from samples
            // ending of first part
            const channel1 = audioBuffer1.getChannelData(c);

            for (let j = idxData1[idxData1.length - 1]; j < from; j++) {
              const samp = channel1[j];

              if (j === 0) {
                maxInStep = samp;
                minInStep = samp;
              } else {
                if (samp > maxInStep) maxInStep = samp;
                if (samp < minInStep) minInStep = samp;
              }
            }

            minData1[idxData1.length - 1] = minInStep;
            maxData1[idxData1.length - 1] = maxInStep; // starting of second part

            const channel2 = audioBuffer2.getChannelData(c);

            for (let j = 0; j < (idxData2.length === 1 ? audioBuffer2.length : idxData2[1]); j++) {
              const samp = channel2[j];

              if (j === 0) {
                maxInStep = samp;
                minInStep = samp;
              } else {
                if (samp > maxInStep) maxInStep = samp;
                if (samp < minInStep) minInStep = samp;
              }
            }

            minData2[0] = minInStep;
            maxData2[0] = maxInStep;
          } else {
            // calculate from lower level
            const {
              idx: prevIdx1
            } = waveform1[waveformKeys[i - 1]];
            const {
              min: prevMin1,
              max: prevMax1
            } = waveform1[waveformKeys[i - 1]][c]; // ending of first part

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
                if (sampMax > maxInStep) maxInStep = sampMax;
                if (sampMin < minInStep) minInStep = sampMin;
              }
            }

            minData1[idxData1.length - 1] = minInStep;
            maxData1[idxData1.length - 1] = maxInStep;
            const {
              idx: prevIdx2
            } = waveform2[waveformKeys[i - 1]];
            const {
              min: prevMin2,
              max: prevMax2
            } = waveform2[waveformKeys[i - 1]][c]; // starting of second part

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
                if (sampMax > maxInStep) maxInStep = sampMax;
                if (sampMin < minInStep) minInStep = sampMin;
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
  /**
   * Find an existing waveform with a precision (could be samples per pixel)
   * returning a waveform that is sufficient to the precision.
   * (step is the largest value smaller than the precision)
   */


  findStep(precision) {
    const key = this.steps.reduce((acc, cur) => cur < precision && cur > (acc || 0) ? cur : acc, undefined);
    if (!key) return null;
    return this[key];
  }

}

_defineProperty(Waveform, "stepsFactor", 16);

/***/ }),

/***/ "./src/utils/math.ts":
/*!***************************!*\
  !*** ./src/utils/math.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./src/core/worklets/TemporalAnalyser.worklet.ts":
/*!*******************************************************!*\
  !*** ./src/core/worklets/TemporalAnalyser.worklet.ts ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "js/7ae8201faea4de318b7a.worklet.js";

/***/ }),

/***/ "./src/core/worklets/Transmitter.worklet.ts":
/*!**************************************************!*\
  !*** ./src/core/worklets/Transmitter.worklet.ts ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "js/2da973d99ed3f3263f1b.worklet.js";

/***/ })

};
//# sourceMappingURL=ff5b9ebb2570e528fa11.worklet.js.map