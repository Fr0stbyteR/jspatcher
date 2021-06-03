import Worker from "./Guido.worker.ts"; // eslint-disable-line import/extensions
import { IGuidoFactory, IGuidoWorker } from "./GuidoWorker.types";
import ProxyMain from "./ProxyMain";
import "@shren/guidolib/guido2-webfont/stylesheet.css";
import { MessagePortRequest } from "./Worker";

export default class GuidoWorker extends ProxyMain<{}, IGuidoWorker> implements IGuidoFactory {
    static Worker = Worker;
    static fnNames: (keyof IGuidoWorker)[] = ["init", "start", "shutdown", "ar2gr", "ar2grSettings", "updateGR", "updateGRSettings", "freeAR", "freeGR", "getDefaultLayoutSettings", "resizePageToMusic", "getErrorString", "showElement", "countVoices", "getPageCount", "getSystemCount", "duration", "findEventPage", "findPageAt", "getPageDate", "gr2SVG", "gr2SVGColored", "abstractExport", "binaryExport", "jsExport", "setDefaultPageFormat", "getDefaultPageFormat", "setDrawBoundingBoxes", "getDrawBoundingBoxes", "getPageFormat", "unit2CM", "cm2Unit", "unit2Inches", "inches2Unit", "getLineSpace", "getVersion", "getFloatVersion", "getVersionStr", "checkVersionNums", "markVoice", "openParser", "closeParser", "file2AR", "string2AR", "parserGetErrorCode", "openStream", "closeStream", "getStream", "stream2AR", "writeStream", "resetStream", "getParsingTime", "getAR2GRTime", "getOnDrawTime", "getPageMap", "getStaffMap", "getVoiceMap", "getSystemMap", "getTime", "getPoint", "getTimeMap", "getPianoRollMap", "pianoRoll", "ar2PianoRoll", "destroyPianoRoll", "prSetLimits", "prEnableKeyboard", "prGetKeyboardWidth", "prEnableAutoVoicesColoration", "prSetVoiceColor", "prSetVoiceNamedColor", "prRemoveVoiceColor", "prEnableMeasureBars", "prSetPitchLinesDisplayMode", "proll2svg", "prGetMap", "prSvgExport", "prJsExport", "reducedProp", "_openMusic", "_closeMusic", "_openVoice", "_closeVoice", "_openChord", "_closeChord", "_insertCommata", "_openEvent", "_closeEvent", "_addSharp", "_addFlat", "_setEventDots", "_setEventAccidentals", "_setOctave", "_setDuration", "_openTag", "_openRangeTag", "_endTag", "_closeTag", "_addTagParameterString", "_addTagParameterInt", "_addTagParameterFloat", "_setParameterName", "_setParameterUnit", "__closeMusic"];

    openMusic: () => void;
    openVoice: () => void;
    closeVoice: () => void;
    openChord: () => void;
    closeChord: () => void;
    insertCommata: () => void;
    openEvent: (name: string) => void;
    closeEvent: () => void;
    addSharp: () => void;
    addFlat: () => void;
    setEventDots: (dots: number) => void;
    setEventAccidentals: (acc: number) => void;
    setOctave: (oct: number) => void;
    setDuration: (numerator: number, denominator: number) => void;
    openTag: (name: string, tagID: number) => void;
    openRangeTag: (name: string, tagID: number) => void;
    endTag: () => void;
    closeTag: () => void;
    addTagParameterString: (val: string) => void;
    addTagParameterInt: (val: number) => void;
    addTagParameterFloat: (val: number) => void;
    setParameterName: (name: string) => void;
    setParameterUnit: (unit: string) => void;

    _factoryQueue: MessagePortRequest<IGuidoFactory>[] = [];

    constructor() {
        super();
        const factoryMethodNames: (keyof IGuidoFactory)[] = ["openMusic", "openVoice", "closeVoice", "openChord", "closeChord", "insertCommata", "openEvent", "closeEvent", "addSharp", "addFlat", "setEventDots", "setEventAccidentals", "setOctave", "setDuration", "openTag", "openRangeTag", "endTag", "closeTag", "addTagParameterString", "addTagParameterInt", "addTagParameterFloat", "setParameterName", "setParameterUnit"];
        factoryMethodNames.forEach(call => this[call] = (...args: any[]) => this._factoryQueue.push({ id: null, call, args: args as any }));
    }
    async closeMusic() {
        const result = this.__closeMusic(this._factoryQueue);
        this._factoryQueue = [];
        return result;
    }
}
