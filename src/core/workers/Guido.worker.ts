import type * as GuidoModule from "@grame/guidolib";
import { IGuidoWorker } from "./GuidoWorker.types";
import ProxyWorker from "./ProxyWorker";

class Guido extends ProxyWorker<IGuidoWorker> implements IGuidoWorker {
    private module: GuidoModule;
    private fEngine: GuidoEngineAdapter;
    private fPianoRoll: GUIDOPianoRollAdapter;
    private fScoreMap: GUIDOScoreMap;
    private fFactory: GUIDOFactoryAdapter;
    private fSPR: GUIDOReducedProportionalAdapter;

    async init() {
        const locateFile = (url: string, dir: string) => "../deps/" + url;
        const Module = (await import("@grame/guidolib") as any).default as typeof GuidoModule;
        return new Promise<void>((resolve, reject) => {
            const module = new Module({ locateFile });
            module.onRuntimeInitialized = () => {
                this.module = module;
                this.fEngine = new this.module.GuidoEngineAdapter();
                this.fScoreMap = new this.module.GUIDOScoreMap();
                this.fPianoRoll = new this.module.GUIDOPianoRollAdapter();
                this.fFactory = new this.module.GUIDOFactoryAdapter();
                this.fSPR = new this.module.GUIDOReducedProportionalAdapter();
                this.fEngine.init();
                resolve();
            };
        });
    }

    // ------------------------------------------------------------------------
    // Guido Engine interface
    start() { this.fEngine.init(); }
    shutdown() { this.fEngine.shutdown(); }

    ar2gr(ar: ARHandler) { return this.fEngine.ar2gr(ar); }
    ar2grSettings(ar: ARHandler, settings: GuidoLayoutSettings) { return this.fEngine.ar2grSettings(ar, settings); }
    updateGR(gr: GRHandler) { return this.fEngine.updateGR(gr); }
    updateGRSettings(gr: GRHandler, settings: GuidoLayoutSettings) { return this.fEngine.updateGRSettings(gr, settings); }
    freeAR(ar: ARHandler) { this.fEngine.freeAR(ar); }
    freeGR(gr: GRHandler) { this.fEngine.freeGR(gr); }
    getDefaultLayoutSettings() { return this.fEngine.getDefaultLayoutSettings(); }

    resizePageToMusic(gr: GRHandler) { return this.fEngine.resizePageToMusic(gr); }
    getErrorString(errCode: GuidoErrCode) { return this.fEngine.getErrorString(errCode); }
    showElement(gr: GRHandler, elt: number, status: boolean) { return this.fEngine.showElement(gr, elt, status); }

    countVoices(ar: ARHandler) { return this.fEngine.countVoices(ar); }
    getPageCount(gr: GRHandler) { return this.fEngine.getPageCount(gr); }
    getSystemCount(gr: GRHandler, page: number) { return this.fEngine.getSystemCount(gr, page); }
    duration(gr: GRHandler) { return this.fEngine.duration(gr); }

    findEventPage(gr: GRHandler, date: GuidoDate) { return this.fEngine.findEventPage(gr, date); }
    findPageAt(gr: GRHandler, date: GuidoDate) { return this.fEngine.findPageAt(gr, date); }
    getPageDate(gr: GRHandler, pageNum: number) { return this.fEngine.getPageDate(gr, pageNum); }

    gr2SVG(gr: GRHandler, page: number, embedFont: boolean, mappingMode: number) { return this.fEngine.gr2SVG(gr, page, embedFont, mappingMode); }
    gr2SVGColored(gr: GRHandler, page: number, r: number, g: number, b: number, embedFont: boolean) { return this.fEngine.gr2SVGColored(gr, page, r, g, b, embedFont); }

    abstractExport(gr: GRHandler, page: number) { return this.fEngine.abstractExport(gr, page); }
    binaryExport(gr: GRHandler, page: number) { return this.fEngine.binaryExport(gr, page); }
    jsExport(gr: GRHandler, page: number) { return this.fEngine.javascriptExport(gr, page); }

    setDefaultPageFormat(format: GuidoPageFormat) { this.fEngine.setDefaultPageFormat(format); }
    getDefaultPageFormat() { return this.fEngine.getDefaultPageFormat(); }

    setDrawBoundingBoxes(bmap: number) { this.fEngine.setDrawBoundingBoxes(bmap); }
    getDrawBoundingBoxes() { return this.fEngine.getDrawBoundingBoxes(); }
    getPageFormat(gr: GRHandler, page: number) { return this.fEngine.getPageFormat(gr, page); }

    unit2CM(val: number) { return this.fEngine.unit2CM(val); }
    cm2Unit(val: number) { return this.fEngine.cm2Unit(val); }
    unit2Inches(val: number) { return this.fEngine.unit2Inches(val); }
    inches2Unit(val: number) { return this.fEngine.inches2Unit(val); }
    getLineSpace() { return this.fEngine.getLineSpace(); }

    getVersion() { return this.fEngine.getVersion(); }
    getFloatVersion() { const v = this.fEngine.getVersion(); return parseFloat(v.major + "." + v.minor + v.sub); }
    getVersionStr() { return this.fEngine.getVersionStr(); }
    checkVersionNums(major: number, minor: number, sub: number) { return this.fEngine.checkVersionNums(major, minor, sub); }

    markVoice(ar: ARHandler, voicenum: number, date: GuidoDate, duration: GuidoDate, r: number, g: number, b: number) { return this.fEngine.markVoice(ar, voicenum, date, duration, r, g, b); }

    openParser() { return this.fEngine.openParser(); }
    closeParser(p: GuidoParser) { return this.fEngine.closeParser(p); }
    file2AR(p: GuidoParser, file: string) { return this.fEngine.file2AR(p, file); }
    string2AR(p: GuidoParser, gmn: string) { return this.fEngine.string2AR(p, gmn); }
    parserGetErrorCode(p: GuidoParser) { return this.fEngine.parserGetErrorCode(p); }

    openStream() { return this.fEngine.openStream(); }
    closeStream(s: GuidoStream) { return this.fEngine.closeStream(s); }
    getStream(s: GuidoStream) { return this.fEngine.getStream(s); }
    stream2AR(p: GuidoParser, stream: GuidoStream) { return this.fEngine.stream2AR(p, stream); }
    writeStream(s: GuidoStream, str: string) { return this.fEngine.writeStream(s, str); }
    resetStream(s: GuidoStream) { return this.fEngine.resetStream(s); }

    getParsingTime(ar: ARHandler) { return this.fEngine.getParsingTime(ar); }
    getAR2GRTime(gr: GRHandler) { return this.fEngine.getAR2GRTime(gr); }
    getOnDrawTime(gr: GRHandler) { return this.fEngine.getOnDrawTime(gr); }

    // ------------------------------------------------------------------------
    // Guido mappings interface
    getPageMap(gr: GRHandler, page: number, w: number, h: number) { return this.fScoreMap.getPageMap(gr, page, w, h); }
    getStaffMap(gr: GRHandler, page: number, w: number, h: number, staff: number) { return this.fScoreMap.getStaffMap(gr, page, w, h, staff); }
    getVoiceMap(gr: GRHandler, page: number, w: number, h: number, voice: number) { return this.fScoreMap.getVoiceMap(gr, page, w, h, voice); }
    getSystemMap(gr: GRHandler, page: number, w: number, h: number) { return this.fScoreMap.getSystemMap(gr, page, w, h); }
    getTime(date: GuidoDate, map: string) { return this.fScoreMap.getTime(date, map); }
    getPoint(x: number, y: number, map: string) { return this.fScoreMap.getPoint(x, y, map); }
    getTimeMap(ar: ARHandler) { return this.fScoreMap.getTimeMap(ar); }
    getPianoRollMap(pr: PianoRoll, width: number, height: number) { return this.fScoreMap.getPianoRollMap(pr, width, height); }

    // ------------------------------------------------------------------------
    // Guido piano roll interface
    pianoRoll() { return this.fPianoRoll; }

    ar2PianoRoll(type: PianoRollType, ar: ARHandler) { return this.fPianoRoll.ar2PianoRoll(type, ar); }
    destroyPianoRoll(pr: PianoRoll) { return this.fPianoRoll.destroyPianoRoll(pr); }
    prSetLimits(pr: PianoRoll, limits: LimitParams) { return this.fPianoRoll.setLimits(pr, limits); }
    prEnableKeyboard(pr: PianoRoll, status: boolean) { return this.fPianoRoll.enableKeyboard(pr, status); }
    prGetKeyboardWidth(pr: PianoRoll, height: number) { return this.fPianoRoll.getKeyboardWidth(pr, height); }
    prEnableAutoVoicesColoration(pr: PianoRoll, status: boolean) { return this.fPianoRoll.enableAutoVoicesColoration(pr, status); }

    prSetVoiceColor(pr: PianoRoll, voice: number, r: number, g: number, b: number, a: number) { return this.fPianoRoll.setRGBColorToVoice(pr, voice, r, g, b, a); }
    prSetVoiceNamedColor(pr: PianoRoll, voice: number, c: string) { return this.fPianoRoll.setColorToVoice(pr, voice, c); }
    prRemoveVoiceColor(pr: PianoRoll, voice: number) { return this.fPianoRoll.removeColorToVoice(pr, voice); }
    prEnableMeasureBars(pr: PianoRoll, status: boolean) { return this.fPianoRoll.enableMeasureBars(pr, status); }
    prSetPitchLinesDisplayMode(pr: PianoRoll, mode: number) { return this.fPianoRoll.setPitchLinesDisplayMode(pr, mode); }

    proll2svg(pr: PianoRoll, w: number, h: number) { return this.fPianoRoll.svgExport(pr, w, h); }
    prGetMap(pr: PianoRoll, width: number, height: number) { return this.fPianoRoll.getMap(pr, width, height); }

    prSvgExport(pr: PianoRoll, width: number, height: number) { return this.fPianoRoll.svgExport(pr, width, height); }
    prJsExport(pr: PianoRoll, width: number, height: number) { return this.fPianoRoll.javascriptExport(pr, width, height); }

    // ------------------------------------------------------------------------
    // Reduced Proportional representation
    // no relay for the interface
    reducedProp() { return this.fSPR; }

    // ------------------------------------------------------------------------
    // Guido factory interface
    openMusic() { return this.fFactory.openMusic(); }
    closeMusic() { return this.fFactory.closeMusic(); }
    openVoice() { return this.fFactory.openVoice(); }
    closeVoice() { return this.fFactory.closeVoice(); }
    openChord() { return this.fFactory.openChord(); }
    closeChord() { return this.fFactory.closeChord(); }
    insertCommata() { return this.fFactory.insertCommata(); }

    openEvent(name: string) { return this.fFactory.openEvent(name); }
    closeEvent() { return this.fFactory.closeEvent(); }
    addSharp() { return this.fFactory.addSharp(); }
    addFlat() { return this.fFactory.addFlat(); }
    setEventDots(dots: number) { return this.fFactory.setEventDots(dots); }
    setEventAccidentals(acc: number) { return this.fFactory.setEventAccidentals(acc); }
    setOctave(oct: number) { return this.fFactory.setOctave(oct); }
    setDuration(numerator: number, denominator: number) { return this.fFactory.setDuration(numerator, denominator); }

    openTag(name: string, tagID: number) { return this.fFactory.openTag(name, tagID); }
    openRangeTag(name: string, tagID: number) { return this.fFactory.openRangeTag(name, tagID); }
    endTag() { return this.fFactory.endTag(); }
    closeTag() { return this.fFactory.closeTag(); }
    addTagParameterString(val: string) { return this.fFactory.addTagParameterString(val); }
    addTagParameterInt(val: number) { return this.fFactory.addTagParameterInt(val); }
    addTagParameterFloat(val: number) { return this.fFactory.addTagParameterFloat(val); }

    setParameterName(name: string) { return this.fFactory.setParameterName(name); }
    setParameterUnit(unit: string) { return this.fFactory.setParameterUnit(unit); }
}
// eslint-disable-next-line no-new
new Guido();
