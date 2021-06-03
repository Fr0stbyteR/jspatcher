import type * as GuidoModule from "@shren/guidolib";
import { IGuidoFactory, IGuidoWorker } from "./GuidoWorker.types";
import ProxyWorker from "./ProxyWorker";
import { MessagePortRequest } from "./Worker";

class Guido extends ProxyWorker<IGuidoWorker> implements IGuidoWorker {
    private module: GuidoModule;
    private fEngine: GuidoEngineAdapter;
    private fPianoRoll: GUIDOPianoRollAdapter;
    private fScoreMap: GUIDOScoreMap;
    private fFactory: GUIDOFactoryAdapter;
    private fSPR: GUIDOReducedProportionalAdapter;

    private $oMap: ClassHandle[] = [];

    private $2o($: number) {
        return this.$oMap[$];
    }
    private o2$(o: ClassHandle) {
        const i = this.$oMap.indexOf(o);
        if (i !== -1) return i;
        return this.$oMap.push(o) - 1;
    }

    async init() {
        const locateFile = (url: string, dir: string) => "../deps/" + url;
        const Module = (await import("@shren/guidolib") as any).default as typeof GuidoModule;
        this.module = await new Module({ locateFile });
        this.fEngine = new this.module.GuidoEngineAdapter();
        this.fScoreMap = new this.module.GUIDOScoreMap();
        this.fPianoRoll = new this.module.GUIDOPianoRollAdapter();
        this.fFactory = new this.module.GUIDOFactoryAdapter();
        this.fSPR = new this.module.GUIDOReducedProportionalAdapter();
        this.fEngine.init();
    }

    // ------------------------------------------------------------------------
    // Guido Engine interface
    start() { this.fEngine.init(); }
    shutdown() { this.fEngine.shutdown(); }

    ar2gr(ar: $ARHandler) { return this.o2$(this.fEngine.ar2gr(this.$2o(ar))); }
    ar2grSettings(ar: $ARHandler, settings: GuidoLayoutSettings) { return this.o2$(this.fEngine.ar2grSettings(this.$2o(ar), settings)); }
    updateGR(gr: $GRHandler) { return this.fEngine.updateGR(this.$2o(gr)); }
    updateGRSettings(gr: $GRHandler, settings: GuidoLayoutSettings) { return this.fEngine.updateGRSettings(this.$2o(gr), settings); }
    freeAR(ar: $ARHandler) { this.fEngine.freeAR(this.$2o(ar)); }
    freeGR(gr: $GRHandler) { this.fEngine.freeGR(this.$2o(gr)); }
    getDefaultLayoutSettings() { return this.fEngine.getDefaultLayoutSettings(); }

    resizePageToMusic(gr: $GRHandler) { return this.fEngine.resizePageToMusic(this.$2o(gr)); }
    getErrorString(errCode: GuidoErrCode) { return this.fEngine.getErrorString(errCode); }
    showElement(gr: $GRHandler, elt: number, status: boolean) { return this.fEngine.showElement(this.$2o(gr), elt, status); }

    countVoices(ar: $ARHandler) { return this.fEngine.countVoices(this.$2o(ar)); }
    getPageCount(gr: $GRHandler) { return this.fEngine.getPageCount(this.$2o(gr)); }
    getSystemCount(gr: $GRHandler, page: number) { return this.fEngine.getSystemCount(this.$2o(gr), page); }
    duration(gr: $GRHandler) { return this.fEngine.duration(this.$2o(gr)); }

    findEventPage(gr: $GRHandler, date: GuidoDate) { return this.fEngine.findEventPage(this.$2o(gr), date); }
    findPageAt(gr: $GRHandler, date: GuidoDate) { return this.fEngine.findPageAt(this.$2o(gr), date); }
    getPageDate(gr: $GRHandler, pageNum: number) { return this.fEngine.getPageDate(this.$2o(gr), pageNum); }

    gr2SVG(gr: $GRHandler, page: number, embedFont: boolean, mappingMode: number) { return this.fEngine.gr2SVG(this.$2o(gr), page, embedFont, mappingMode); }
    gr2SVGColored(gr: $GRHandler, page: number, r: number, g: number, b: number, embedFont: boolean) { return this.fEngine.gr2SVGColored(this.$2o(gr), page, r, g, b, embedFont); }

    abstractExport(gr: $GRHandler, page: number) { return this.fEngine.abstractExport(this.$2o(gr), page); }
    binaryExport(gr: $GRHandler, page: number) { return this.fEngine.binaryExport(this.$2o(gr), page); }
    jsExport(gr: $GRHandler, page: number) { return this.fEngine.javascriptExport(this.$2o(gr), page); }

    setDefaultPageFormat(format: GuidoPageFormat) { this.fEngine.setDefaultPageFormat(format); }
    getDefaultPageFormat() { return this.fEngine.getDefaultPageFormat(); }

    setDrawBoundingBoxes(bmap: number) { this.fEngine.setDrawBoundingBoxes(bmap); }
    getDrawBoundingBoxes() { return this.fEngine.getDrawBoundingBoxes(); }
    getPageFormat(gr: $GRHandler, page: number) { return this.fEngine.getPageFormat(this.$2o(gr), page); }

    unit2CM(val: number) { return this.fEngine.unit2CM(val); }
    cm2Unit(val: number) { return this.fEngine.cm2Unit(val); }
    unit2Inches(val: number) { return this.fEngine.unit2Inches(val); }
    inches2Unit(val: number) { return this.fEngine.inches2Unit(val); }
    getLineSpace() { return this.fEngine.getLineSpace(); }

    getVersion() { return this.fEngine.getVersion(); }
    getFloatVersion() { const v = this.fEngine.getVersion(); return parseFloat(v.major + "." + v.minor + v.sub); }
    getVersionStr() { return this.fEngine.getVersionStr(); }
    checkVersionNums(major: number, minor: number, sub: number) { return this.fEngine.checkVersionNums(major, minor, sub); }

    markVoice(ar: $ARHandler, voicenum: number, date: GuidoDate, duration: GuidoDate, r: number, g: number, b: number) { return this.fEngine.markVoice(this.$2o(ar), voicenum, date, duration, r, g, b); }

    openParser() { return this.o2$(this.fEngine.openParser()); }
    closeParser(p: $GuidoParser) { return this.fEngine.closeParser(this.$2o(p)); }
    file2AR(p: $GuidoParser, file: string) { return this.o2$(this.fEngine.file2AR(this.$2o(p), file)); }
    string2AR(p: $GuidoParser, gmn: string) { return this.o2$(this.fEngine.string2AR(this.$2o(p), gmn)); }
    parserGetErrorCode(p: $GuidoParser) { return this.fEngine.parserGetErrorCode(this.$2o(p)); }

    openStream() { return this.o2$(this.fEngine.openStream()); }
    closeStream(s: $GuidoStream) { return this.fEngine.closeStream(this.$2o(s)); }
    getStream(s: $GuidoStream) { return this.fEngine.getStream(this.$2o(s)); }
    stream2AR(p: $GuidoParser, stream: $GuidoStream) { return this.o2$(this.fEngine.stream2AR(this.$2o(p), this.$2o(stream))); }
    writeStream(s: $GuidoStream, str: string) { return this.fEngine.writeStream(this.$2o(s), str); }
    resetStream(s: $GuidoStream) { return this.fEngine.resetStream(this.$2o(s)); }

    getParsingTime(ar: $ARHandler) { return this.fEngine.getParsingTime(this.$2o(ar)); }
    getAR2GRTime(gr: $GRHandler) { return this.fEngine.getAR2GRTime(this.$2o(gr)); }
    getOnDrawTime(gr: $GRHandler) { return this.fEngine.getOnDrawTime(this.$2o(gr)); }

    // ------------------------------------------------------------------------
    // Guido mappings interface
    getPageMap(gr: $GRHandler, page: number, w: number, h: number) { return this.fScoreMap.getPageMap(this.$2o(gr), page, w, h); }
    getStaffMap(gr: $GRHandler, page: number, w: number, h: number, staff: number) { return this.fScoreMap.getStaffMap(this.$2o(gr), page, w, h, staff); }
    getVoiceMap(gr: $GRHandler, page: number, w: number, h: number, voice: number) { return this.fScoreMap.getVoiceMap(this.$2o(gr), page, w, h, voice); }
    getSystemMap(gr: $GRHandler, page: number, w: number, h: number) { return this.fScoreMap.getSystemMap(this.$2o(gr), page, w, h); }
    getTime(date: GuidoDate, map: string) { return this.fScoreMap.getTime(date, map); }
    getPoint(x: number, y: number, map: string) { return this.fScoreMap.getPoint(x, y, map); }
    getTimeMap(ar: $ARHandler) { return this.fScoreMap.getTimeMap(this.$2o(ar)); }
    getPianoRollMap(pr: $PianoRoll, width: number, height: number) { return this.fScoreMap.getPianoRollMap(this.$2o(pr), width, height); }

    // ------------------------------------------------------------------------
    // Guido piano roll interface
    pianoRoll() { return this.fPianoRoll; }

    ar2PianoRoll(type: PianoRollType, ar: $ARHandler) { return this.o2$(this.fPianoRoll.ar2PianoRoll(type, this.$2o(ar))); }
    destroyPianoRoll(pr: $PianoRoll) { return this.fPianoRoll.destroyPianoRoll(this.$2o(pr)); }
    prSetLimits(pr: $PianoRoll, limits: LimitParams) { return this.fPianoRoll.setLimits(this.$2o(pr), limits); }
    prEnableKeyboard(pr: $PianoRoll, status: boolean) { return this.fPianoRoll.enableKeyboard(this.$2o(pr), status); }
    prGetKeyboardWidth(pr: $PianoRoll, height: number) { return this.fPianoRoll.getKeyboardWidth(this.$2o(pr), height); }
    prEnableAutoVoicesColoration(pr: $PianoRoll, status: boolean) { return this.fPianoRoll.enableAutoVoicesColoration(this.$2o(pr), status); }

    prSetVoiceColor(pr: $PianoRoll, voice: number, r: number, g: number, b: number, a: number) { return this.fPianoRoll.setRGBColorToVoice(this.$2o(pr), voice, r, g, b, a); }
    prSetVoiceNamedColor(pr: $PianoRoll, voice: number, c: string) { return this.fPianoRoll.setColorToVoice(this.$2o(pr), voice, c); }
    prRemoveVoiceColor(pr: $PianoRoll, voice: number) { return this.fPianoRoll.removeColorToVoice(this.$2o(pr), voice); }
    prEnableMeasureBars(pr: $PianoRoll, status: boolean) { return this.fPianoRoll.enableMeasureBars(this.$2o(pr), status); }
    prSetPitchLinesDisplayMode(pr: $PianoRoll, mode: number) { return this.fPianoRoll.setPitchLinesDisplayMode(this.$2o(pr), mode); }

    proll2svg(pr: $PianoRoll, w: number, h: number) { return this.fPianoRoll.svgExport(this.$2o(pr), w, h); }
    prGetMap(pr: $PianoRoll, width: number, height: number) { return this.fPianoRoll.getMap(this.$2o(pr), width, height); }

    prSvgExport(pr: $PianoRoll, width: number, height: number) { return this.fPianoRoll.svgExport(this.$2o(pr), width, height); }
    prJsExport(pr: $PianoRoll, width: number, height: number) { return this.fPianoRoll.javascriptExport(this.$2o(pr), width, height); }

    // ------------------------------------------------------------------------
    // Reduced Proportional representation
    // no relay for the interface
    reducedProp() { return this.fSPR; }

    // ------------------------------------------------------------------------
    // Guido factory interface
    _openMusic() { return this.fFactory.openMusic(); }
    _closeMusic() { return this.o2$(this.fFactory.closeMusic()); }
    _openVoice() { return this.fFactory.openVoice(); }
    _closeVoice() { return this.fFactory.closeVoice(); }
    _openChord() { return this.fFactory.openChord(); }
    _closeChord() { return this.fFactory.closeChord(); }
    _insertCommata() { return this.fFactory.insertCommata(); }

    _openEvent(name: string) { return this.fFactory.openEvent(name); }
    _closeEvent() { return this.fFactory.closeEvent(); }
    _addSharp() { return this.fFactory.addSharp(); }
    _addFlat() { return this.fFactory.addFlat(); }
    _setEventDots(dots: number) { return this.fFactory.setEventDots(dots); }
    _setEventAccidentals(acc: number) { return this.fFactory.setEventAccidentals(acc); }
    _setOctave(oct: number) { return this.fFactory.setOctave(oct); }
    _setDuration(numerator: number, denominator: number) { return this.fFactory.setDuration(numerator, denominator); }

    _openTag(name: string, tagID: number) { return this.fFactory.openTag(name, tagID); }
    _openRangeTag(name: string, tagID: number) { return this.fFactory.openRangeTag(name, tagID); }
    _endTag() { return this.fFactory.endTag(); }
    _closeTag() { return this.fFactory.closeTag(); }
    _addTagParameterString(val: string) { return this.fFactory.addTagParameterString(val); }
    _addTagParameterInt(val: number) { return this.fFactory.addTagParameterInt(val); }
    _addTagParameterFloat(val: number) { return this.fFactory.addTagParameterFloat(val); }

    _setParameterName(name: string) { return this.fFactory.setParameterName(name); }
    _setParameterUnit(unit: string) { return this.fFactory.setParameterUnit(unit); }

    __closeMusic(factoryQueue: MessagePortRequest<IGuidoFactory>[]) {
        for (const request of factoryQueue) {
            const { call, args } = request;
            const internalCall = `_${call}` as `_${keyof IGuidoFactory}`;
            (this[internalCall] as any)(...args);
        }
        return this._closeMusic();
    }
}
// eslint-disable-next-line no-new
new Guido();
