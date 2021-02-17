export interface IGuidoWorker {
    init(): Promise<void>
    // ------------------------------------------------------------------------
    // Guido Engine interface;
    start(): void;
    shutdown(): void;
    ar2gr(ar: ARHandler): GRHandler;
    ar2grSettings(ar: ARHandler, settings: GuidoLayoutSettings): GRHandler;
    updateGR(gr: GRHandler): GuidoErrCode;
    updateGRSettings(gr: GRHandler, settings: GuidoLayoutSettings): GuidoErrCode;
    freeAR(ar: ARHandler): void;
    freeGR(gr: GRHandler): void;
    getDefaultLayoutSettings(): GuidoLayoutSettings;

    resizePageToMusic(gr: GRHandler): GuidoErrCode;
    getErrorString(errCode: GuidoErrCode): string;
    showElement(gr: GRHandler, elt: number, status: boolean): GuidoErrCode;

    countVoices(ar: ARHandler): number;
    getPageCount(gr: GRHandler): number;
    getSystemCount(gr: GRHandler, page: number): number;
    duration(gr: GRHandler): GuidoDate;

    findEventPage(gr: GRHandler, date: GuidoDate): number;
    findPageAt(gr: GRHandler, date: GuidoDate): number;
    getPageDate(gr: GRHandler, pageNum: number): GuidoDate;

    gr2SVG(gr: GRHandler, page: number, embedFont: boolean, mappingMode: number): string;
    gr2SVGColored(gr: GRHandler, page: number, r: number, g: number, b: number, embedFont: boolean): string;

    abstractExport(gr: GRHandler, page: number): string;
    binaryExport(gr: GRHandler, page: number): string;
    jsExport(gr: GRHandler, page: number): GuidoErrCode;

    setDefaultPageFormat(format: GuidoPageFormat): void;
    getDefaultPageFormat(): GuidoPageFormat;

    setDrawBoundingBoxes(bmap: number): void;
    getDrawBoundingBoxes(): number;
    getPageFormat(gr: GRHandler, page: number): GuidoPageFormat;

    unit2CM(val: number): number;
    cm2Unit(val: number): number;
    unit2Inches(val: number): number;
    inches2Unit(val: number): number;
    getLineSpace(): number;

    getVersion(): GuidoVersion;
    getFloatVersion(): number;
    getVersionStr(): string;
    checkVersionNums(major: number, minor: number, sub: number): GuidoErrCode;

    markVoice(ar: ARHandler, voicenum: number,
        date: GuidoDate, duration: GuidoDate,
        r: number, g: number, b: number): GuidoErrCode;

    openParser(): GuidoParser;
    closeParser(p: GuidoParser): GuidoErrCode;
    file2AR(p: GuidoParser, file: string): ARHandler;
    string2AR(p: GuidoParser, gmn: string): ARHandler;
    parserGetErrorCode(p: GuidoParser): ParserError;

    openStream(): GuidoStream;
    closeStream(s: GuidoStream): GuidoErrCode;
    getStream(s: GuidoStream): string;
    stream2AR(p: GuidoParser, stream: GuidoStream): ARHandler;
    writeStream(s: GuidoStream, str: string): GuidoErrCode;
    resetStream(s: GuidoStream): GuidoErrCode;

    getParsingTime(ar: ARHandler): number;
    getAR2GRTime(gr: GRHandler): number;
    getOnDrawTime(gr: GRHandler): number;

    // ------------------------------------------------------------------------
    // Guido mappings interface
    getPageMap(gr: GRHandler, page: number, w: number, h: number): string;
    getStaffMap(gr: GRHandler, page: number, w: number, h: number, staff: number): string;
    getVoiceMap(gr: GRHandler, page: number, w: number, h: number, voice: number): string;
    getSystemMap(gr: GRHandler, page: number, w: number, h: number): string;
    getTime(date: GuidoDate, map: string): string;
    getPoint(x: number, y: number, map: string): string;
    getTimeMap(ar: ARHandler): string;
    getPianoRollMap(pr: PianoRoll, width: number, height: number): string;

    // ------------------------------------------------------------------------
    // Guido piano roll interface
    pianoRoll(): GUIDOPianoRollAdapter;

    ar2PianoRoll(type: PianoRollType, ar: ARHandler): PianoRoll;
    destroyPianoRoll(pr: PianoRoll): GuidoErrCode;
    prSetLimits(pr: PianoRoll, limits: LimitParams): GuidoErrCode;
    prEnableKeyboard(pr: PianoRoll, status: boolean): GuidoErrCode;
    prGetKeyboardWidth(pr: PianoRoll, height: number): number;
    prEnableAutoVoicesColoration(pr: PianoRoll, status: boolean): GuidoErrCode;

    prSetVoiceColor(pr: PianoRoll, voice: number, r: number, g: number, b: number, a: number): GuidoErrCode;
    prSetVoiceNamedColor(pr: PianoRoll, voice: number, c: string): GuidoErrCode;
    prRemoveVoiceColor(pr: PianoRoll, voice: number): GuidoErrCode;
    prEnableMeasureBars(pr: PianoRoll, status: boolean): GuidoErrCode;
    prSetPitchLinesDisplayMode(pr: PianoRoll, mode: number): GuidoErrCode;

    proll2svg(pr: PianoRoll, w: number, h: number): string;
    prGetMap(pr: PianoRoll, width: number, height: number): string;

    prSvgExport(pr: PianoRoll, width: number, height: number): string;
    prJsExport(pr: PianoRoll, width: number, height: number): GuidoErrCode;

    // ------------------------------------------------------------------------
    // Reduced Proportional representation
    // no relay for the interface
    reducedProp(): GUIDOReducedProportionalAdapter;

    // ------------------------------------------------------------------------
    // Guido factory interface
    openMusic(): GuidoErrCode;
    closeMusic(): ARHandler;
    openVoice(): GuidoErrCode;
    closeVoice(): GuidoErrCode;
    openChord(): GuidoErrCode;
    closeChord(): GuidoErrCode;
    insertCommata(): GuidoErrCode;

    openEvent(name: string): GuidoErrCode;
    closeEvent(): GuidoErrCode;
    addSharp(): GuidoErrCode;
    addFlat(): GuidoErrCode;
    setEventDots(dots: number): GuidoErrCode;
    setEventAccidentals(acc: number): GuidoErrCode;
    setOctave(oct: number): GuidoErrCode;
    setDuration(numerator: number, denominator: number): GuidoErrCode;

    openTag(name: string, tagID: number): GuidoErrCode;
    openRangeTag(name: string, tagID: number): GuidoErrCode;
    endTag(): GuidoErrCode;
    closeTag(): GuidoErrCode;
    addTagParameterString(val: string): GuidoErrCode;
    addTagParameterInt(val: number): GuidoErrCode;
    addTagParameterFloat(val: number): GuidoErrCode;

    setParameterName(name: string): GuidoErrCode;
    setParameterUnit(unit: string): GuidoErrCode;
}
