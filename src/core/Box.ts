import Patcher from "./Patcher";
import Line from "./Line";
import { MappedEventEmitter } from "../utils/MappedEventEmitter";
import { isTRect, parseToPrimitive } from "../utils/utils";
import { BoxEventMap, TBox, TMaxBox, Data, Args, Props, Inputs, TRect } from "./types";
import { AnyObject } from "./objects/Base";

export default class Box<T extends AnyObject = AnyObject> extends MappedEventEmitter<BoxEventMap> {
    id: string;
    text = "";
    inlets = 0;
    outlets = 0;
    rect: TRect;
    background: boolean;
    presentation: boolean;
    presentationRect: TRect;
    data: Data<T>;
    args: Args<T>;
    props: Props<T>;
    _editing: boolean;
    private _parsed: { class: string; args: Args<T>; props: Props<T> };
    private _object: T;
    private _objectConstructor: typeof AnyObject;
    private readonly _patcher: Patcher;
    private readonly _inletLines: Set<Line>[];
    private readonly _outletLines: Set<Line>[];
    constructor(patcherIn: Patcher, boxIn: TBox) {
        super();
        this.id = boxIn.id;
        this.text = boxIn.text;
        this.args = (boxIn.args || []) as Args<T>;
        this.props = (boxIn.props || {}) as Props<T>;
        this.inlets = boxIn.inlets;
        this.outlets = boxIn.outlets;
        this._inletLines = new Array(this.inlets).fill(null).map(() => new Set<Line>());
        this._outletLines = new Array(this.outlets).fill(null).map(() => new Set<Line>());
        const maxBoxIn = boxIn as unknown as TMaxBox["box"];
        this.rect = boxIn.rect || maxBoxIn.patching_rect;
        this.background = boxIn.background || !!maxBoxIn.background;
        this.presentation = boxIn.presentation || !!maxBoxIn.presentation;
        this.presentationRect = boxIn.presentationRect || maxBoxIn.presentation_rect;
        if (!this.presentationRect) this.presentationRect = this.rect.slice() as TRect;
        this.data = boxIn.data || ((boxIn as any).prevData ? (boxIn as any).prevData.storage : {});
        this._editing = !!boxIn._editing;
        this._patcher = patcherIn;
        this.setMaxListeners(64);
    }
    init() {
        this._parsed = Box.parseObjText(this.text) as { class: string; args: Args<T>; props: Props<T> };
        const newMeta = this._patcher.getObjectMeta(this._parsed);
        for (const key in this.props) {
            if (!newMeta.props[key]) delete this.props[key];
        }
        if (this._parsed.args.length) this.args = this._parsed.args;
        Object.assign(this.props, this._parsed.props);
        const Constructor = this._patcher.getObjectConstructor(this._parsed);
        this._objectConstructor = Constructor;
        if (!this.size.every(v => v > 0)) this.size = this.defaultSize;
        this._object = new Constructor(this, this._patcher) as T;
        this._object.init();
        this._object.postInit();
    }
    /**
     * Main function when receive data from a inlet (base 0)
     *
     * @template I
     * @param {Inputs<T>[I]} data
     * @param {I} inlet
     * @returns
     * @memberof Box
     */
    fn<I extends keyof Pick<Inputs<T>, number>>(data: Inputs<T>[I], inlet: I) {
        this._object.fn(data, inlet);
        return this;
    }
    get uiComponent() {
        return this._objectConstructor.ui;
    }
    get defaultSize() {
        return this.uiComponent.defaultSize;
    }
    get meta() {
        return this._object.meta;
    }
    get outletLines() {
        return this._outletLines;
    }
    get inletLines() {
        return this._inletLines;
    }
    get object() {
        return this._object;
    }
    set object(oIn: T) {
        this._object = oIn;
    }
    get objectConstructor() {
        return this._objectConstructor;
    }
    get parsed() {
        return this._parsed;
    }
    addInletLine(line: Line) {
        const index = line.destInlet;
        if (!this._inletLines[index]) this._inletLines[index] = new Set<Line>();
        this._inletLines[index].add(line);
    }
    removeInletLine(line: Line) {
        const index = line.destInlet;
        if (this._inletLines[index]) this._inletLines[index].delete(line);
    }
    addOutletLine(line: Line) {
        const index = line.srcOutlet;
        if (!this._outletLines[index]) this._outletLines[index] = new Set<Line>();
        this._outletLines[index].add(line);
    }
    removeOutletLine(line: Line) {
        const index = line.srcOutlet;
        if (this._outletLines[index]) this._outletLines[index].delete(line);
    }
    setInlets(count: number) {
        const lines = this.allLines;
        lines.forEach(line => line.disable());
        this.inlets = count;
        lines.forEach(line => line.enable());
        const linesSetLength = this._inletLines.length;
        if (count > linesSetLength) this._inletLines.push(...new Array(count - linesSetLength).fill(null).map(() => new Set<Line>()));
        else if (count < linesSetLength) this._inletLines.splice(count);
        this._inletLines.forEach(set => set.forEach(line => line.uiUpdateDest()));
        this.emit("ioCountChanged", this);
    }
    setOutlets(count: number) {
        const lines = this.allLines;
        lines.forEach(line => line.disable());
        this.outlets = count;
        lines.forEach(line => line.enable());
        const linesSetLength = this._outletLines.length;
        if (count > linesSetLength) this._outletLines.push(...new Array(count - linesSetLength).fill(null).map(() => new Set<Line>()));
        else if (count < linesSetLength) this._outletLines.splice(count);
        this._outletLines.forEach(set => set.forEach(line => line.uiUpdateSrc()));
        this.emit("ioCountChanged", this);
    }
    getInletPos(port: number) {
        const { left, top, width, inlets } = this;
        return { top, left: ((left + 10) + (width - 20) * port / (inlets > 1 ? inlets - 1 : 1)) };
    }
    getOutletPos(port: number) {
        const { left, top, width, height, outlets } = this;
        return { top: top + height, left: ((left + 10) + (width - 20) * port / (outlets > 1 ? outlets - 1 : 1)) };
    }
    get inletsPositions() {
        const positions = [];
        for (let i = 0; i < this.inlets; i++) {
            positions[i] = this.getInletPos(i);
        }
        return positions;
    }
    get outletsPositions() {
        const positions = [];
        for (let i = 0; i < this.outlets; i++) {
            positions[i] = this.getOutletPos(i);
        }
        return positions;
    }
    get allLines() {
        const lines = new Set<Line>();
        this._inletLines.forEach(set => set.forEach(line => lines.add(line)));
        this._outletLines.forEach(set => set.forEach(line => lines.add(line)));
        return lines;
    }
    // called when inlet or outlet are connected or disconnected
    connectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        if (this._object) this._object.connectedOutlet(outlet, destBox, destInlet, lineID);
        this.emit("connectedPort", { isSrc: true, i: outlet });
        return this;
    }
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        if (this._object) this._object.connectedInlet(inlet, srcBox, srcOutlet, lineID);
        this.emit("connectedPort", { isSrc: false, i: inlet });
        return this;
    }
    disconnectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        if (this._object) this._object.disconnectedOutlet(outlet, destBox, destInlet, lineID);
        const last = this._patcher.getLinesBySrcID(this.id)[outlet].length === 1;
        this.emit("disconnectedPort", { isSrc: true, i: outlet, last });
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        if (this._object) this._object.disconnectedInlet(inlet, srcBox, srcOutlet, lineID);
        const last = this._patcher.getLinesByDestID(this.id)[inlet].length === 1;
        this.emit("disconnectedPort", { isSrc: false, i: inlet, last });
        return this;
    }
    isOutletTo(outlet: number, box: Box, inlet: number) {
        const outletLines = Array.from(this._outletLines[outlet]);
        for (let i = 0; i < outletLines.length; i++) {
            const line = outletLines[i];
            if (line.destBox === box && line.destInlet === inlet) return true;
        }
        return false;
    }
    isInletFrom(inlet: number, box: Box, outlet: number) {
        const inletLines = Array.from(this._inletLines[inlet]);
        for (let i = 0; i < inletLines.length; i++) {
            const line = inletLines[i];
            if (line.srcBox === box && line.srcOutlet === outlet) return true;
        }
        return false;
    }
    changeText(textIn: string, force?: boolean) {
        if (!force && textIn === this.text) return this;
        const { defaultSize: oldDefaultSize } = this;
        this.allLines.forEach(line => line.disable());
        this._object.destroy();
        this.text = textIn;
        this.args = [] as Args<T>;
        this.init();
        this.allLines.forEach(line => line.enable());
        const { defaultSize } = this;
        if (!defaultSize.every((v, i) => v === oldDefaultSize[i])) {
            this.size = defaultSize;
            this.presentationSize = defaultSize;
        }
        this.emit("textChanged", this);
        this._object.emit("metaChanged", this._object.meta);
        return this;
    }
    update(e: { args?: any[]; props?: { [key: string]: any } }) {
        const { args, props } = e;
        if (args) this.args = args as Args<T>;
        if (props) {
            if (isTRect(props.rect)) {
                this.setRect(props.rect);
                delete props.rect;
            }
            if (isTRect(props.presentationRect)) {
                this.setPresentationRect(props.presentationRect);
                delete props.presentationRect;
            }
            if (typeof props.presentation === "boolean") {
                this.setPresentation(props.presentation);
                delete props.presentation;
            }
            if (typeof props.background === "boolean") {
                this.setBackground(props.background);
                delete props.background;
            }
            this.props = Object.assign(this.props, props);
        }
        this.emit("updatedFromObject", { args, props });
        return this;
    }
    get position() {
        return this.rect.slice(0, 2) as [number, number];
    }
    set position([leftIn, topIn]: [number, number]) {
        const [left, top, width, height] = this.rect;
        this.setRect([typeof leftIn === "number" ? leftIn : left, typeof topIn === "number" ? topIn : top, width, height] as TRect);
    }
    get presentationPosition() {
        return this.presentationRect.slice(0, 2) as [number, number];
    }
    set presentationPosition([leftIn, topIn]: [number, number]) {
        const [left, top, width, height] = this.presentationRect;
        this.setPresentationRect([typeof leftIn === "number" ? leftIn : left, typeof topIn === "number" ? topIn : top, width, height] as TRect);
    }
    get size() {
        return this.rect.slice(2) as [number, number];
    }
    set size([widthIn, heightIn]: [number, number]) {
        const [left, top, width, height] = this.rect;
        this.setRect([left, top, widthIn || width, heightIn || height] as TRect);
    }
    get presentationSize() {
        return this.presentationRect.slice(2) as [number, number];
    }
    set presentationSize([widthIn, heightIn]: [number, number]) {
        const [left, top, width, height] = this.presentationRect;
        this.setPresentationRect([left, top, widthIn || width, heightIn || height] as TRect);
    }
    get left() {
        const rectKey = this._patcher._state.presentation ? "presentationRect" : "rect";
        return this[rectKey][0];
    }
    set left(leftIn: number) {
        const positionKey = this._patcher._state.presentation ? "presentationPosition" : "position";
        this[positionKey] = [leftIn, undefined];
    }
    get top() {
        const rectKey = this._patcher._state.presentation ? "presentationRect" : "rect";
        return this[rectKey][1];
    }
    set top(topIn: number) {
        const positionKey = this._patcher._state.presentation ? "presentationPosition" : "position";
        this[positionKey] = [undefined, topIn];
    }
    get width() {
        const rectKey = this._patcher._state.presentation ? "presentationRect" : "rect";
        return this[rectKey][2];
    }
    set width(widthIn: number) {
        const sizeKey = this._patcher._state.presentation ? "presentationSize" : "size";
        this[sizeKey] = [widthIn, undefined];
    }
    get height() {
        const rectKey = this._patcher._state.presentation ? "presentationRect" : "rect";
        return this[rectKey][3];
    }
    set height(heightIn: number) {
        const sizeKey = this._patcher._state.presentation ? "presentationSize" : "size";
        this[sizeKey] = [undefined, heightIn];
    }
    setBackground(bool: boolean) {
        if (!!this.background === !!bool) return this;
        this.background = bool;
        this.emit("backgroundChanged", this);
        return this;
    }
    setPresentation(bool: boolean) {
        if (!!this.presentation === !!bool) return this;
        this.presentation = bool;
        if (bool) this.presentationRect = this.rect.slice() as TRect;
        this.emit("presentationChanged", this);
        return this;
    }
    setRect(rect: TRect) {
        if (rect.every((v, i) => v === this.rect[i])) return this;
        if (!rect.every(v => typeof v === "number")) return this;
        if (rect.length !== 4) return this;
        rect[0] = Math.max(0, rect[0]);
        rect[1] = Math.max(0, rect[1]);
        rect[2] = Math.max(15, rect[2]);
        rect[3] = Math.max(15, rect[3]);
        this.rect = rect;
        this.inletLines.forEach(set => set.forEach(line => line.uiUpdateDest()));
        this.outletLines.forEach(set => set.forEach(line => line.uiUpdateSrc()));
        this.emit("rectChanged", this);
        return this;
    }
    setPresentationRect(rect: TRect) {
        if (rect.every((v, i) => v === this.presentationRect[i])) return this;
        if (!rect.every(v => typeof v === "number")) return this;
        if (rect.length !== 4) return this;
        rect[0] = Math.max(0, rect[0]);
        rect[1] = Math.max(0, rect[1]);
        rect[2] = Math.max(15, rect[2]);
        rect[3] = Math.max(15, rect[3]);
        this.presentationRect = rect;
        this.emit("presentationRectChanged", this);
        return this;
    }
    highlightPort(isSrc: boolean, i: number, highlight: boolean) {
        this.emit("highlightPort", { isSrc, i, highlight });
    }
    destroy() {
        this.allLines.forEach(line => this._patcher.deleteLine(line.id));
        this._object.destroy();
        delete this._patcher.boxes[this.id];
        return this;
    }
    static parseObjText(strIn: string) {
        const REGEX = /`([^`]*)`|[^\s]+/gi;
        const strArray = [];
        let match = REGEX.exec(strIn);
        while (match != null) {
            // Index 1 in the array is the captured group if it exists
            // Index 0 is the matched text, which we use if no captured group exists
            strArray.push(match[1] ? match[1] : match[0]);
            // Each call to exec returns the next regex match as an array
            match = REGEX.exec(strIn);
        }
        const objOut: { class: string; args: any[]; props: { [key: string]: any } } = { class: "", args: [], props: {} };
        let lastProp;
        if (strArray.length) objOut.class = strArray.shift();
        while (strArray.length) {
            const el = strArray.shift();
            if (typeof lastProp === "undefined" && el.charAt(0) !== "@") { // is arg, to push
                try {
                    objOut.args.push(JSON.parse(el));
                } catch (e) {
                    objOut.args.push(el);
                }
                continue;
            }
            if (el.length > 1 && el.charAt(0) === "@") { // is prop key
                lastProp = el.substr(1);
                objOut.props[lastProp] = [];
                continue;
            }
            try { // is prop value
                objOut.props[lastProp].push(JSON.parse(el));
            } catch (e) {
                objOut.props[lastProp].push(el);
            }
        }
        for (const key in objOut.props) { // no value = true, one value need to parse, else array
            if (objOut.props[key].length === 0) objOut.props[key] = true;
            else if (objOut.props[key].length === 1) objOut.props[key] = parseToPrimitive(objOut.props[key][0]);
            else objOut.props[key] = parseToPrimitive(objOut.props[key].join(" "));
        }
        return objOut;
    }
}
