import Worker from "./Guido.worker.ts"; // eslint-disable-line import/extensions
import { IGuidoWorker } from "./GuidoWorker.types";
import ProxyMain from "./ProxyMain";
import "@grame/guidolib/guido2-webfont/stylesheet.css";

export default class GuidoWorker extends ProxyMain<{}, IGuidoWorker> {
    static Worker = Worker;
    static fnNames: (keyof IGuidoWorker)[] = ["init", "start", "shutdown", "ar2gr", "ar2grSettings", "updateGR", "updateGRSettings", "freeAR", "freeGR", "getDefaultLayoutSettings", "resizePageToMusic", "getErrorString", "showElement", "countVoices", "getPageCount", "getSystemCount", "duration", "findEventPage", "findPageAt", "getPageDate", "gr2SVG", "gr2SVGColored", "abstractExport", "binaryExport", "jsExport", "setDefaultPageFormat", "getDefaultPageFormat", "setDrawBoundingBoxes", "getDrawBoundingBoxes", "getPageFormat", "unit2CM", "cm2Unit", "unit2Inches", "inches2Unit", "getLineSpace", "getVersion", "getFloatVersion", "getVersionStr", "checkVersionNums", "markVoice", "openParser", "closeParser", "file2AR", "string2AR", "parserGetErrorCode", "openStream", "closeStream", "getStream", "stream2AR", "writeStream", "resetStream", "getParsingTime", "getAR2GRTime", "getOnDrawTime", "getPageMap", "getStaffMap", "getVoiceMap", "getSystemMap", "getTime", "getPoint", "getTimeMap", "getPianoRollMap", "pianoRoll", "ar2PianoRoll", "destroyPianoRoll", "prSetLimits", "prEnableKeyboard", "prGetKeyboardWidth", "prEnableAutoVoicesColoration", "prSetVoiceColor", "prSetVoiceNamedColor", "prRemoveVoiceColor", "prEnableMeasureBars", "prSetPitchLinesDisplayMode", "proll2svg", "prGetMap", "prSvgExport", "prJsExport", "reducedProp", "openMusic", "closeMusic", "openVoice", "closeVoice", "openChord", "closeChord", "insertCommata", "openEvent", "closeEvent", "addSharp", "addFlat", "setEventDots", "setEventAccidentals", "setOctave", "setDuration", "openTag", "openRangeTag", "endTag", "closeTag", "addTagParameterString", "addTagParameterInt", "addTagParameterFloat", "setParameterName", "setParameterUnit"];
}