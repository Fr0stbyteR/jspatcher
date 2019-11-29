import { MappedEventEmitter } from "../utils";
import Patcher from "./Patcher";
import { AnyObject } from "./objects/Base";
import { BoxEventMap, TBox, TMaxBox, Data, Args, Props, Inputs } from "./types";

export default class Box<T extends AnyObject = AnyObject> extends MappedEventEmitter<BoxEventMap> {
    id: string;
    text = "";
    inlets = 0;
    outlets = 0;
    rect: [number, number, number, number];
    background: boolean;
    presentation: boolean;
    presentationRect: [number, number, number, number];
    data: Data<T>;
    args: Args<T>;
    props: Props<T>;
    _editing = false;
    private _parsed: { class: string; args: Args<T>; props: Props<T> };
    private _object: T;
    private _patcher: Patcher;
    constructor(patcherIn: Patcher, boxIn: TBox) {
        super();
        this.id = boxIn.id;
        this.text = boxIn.text;
        this.args = (boxIn.args || []) as Args<T>;
        this.props = (boxIn.props || {}) as Props<T>;
        this.inlets = boxIn.inlets;
        this.outlets = boxIn.outlets;
        const maxBoxIn = boxIn as unknown as TMaxBox["box"];
        this.rect = boxIn.rect || maxBoxIn.patching_rect;
        this.background = boxIn.background || !!maxBoxIn.background;
        this.presentation = boxIn.presentation || !!maxBoxIn.presentation;
        this.presentationRect = boxIn.presentationRect || maxBoxIn.presentation_rect;
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
        this._object = this._patcher.createObject(this._parsed, this) as T;
        this._editing = false;
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
    get ui() {
        return this._object.ui;
    }
    get uiRef() {
        return this._object.uiRef;
    }
    get uiComponent() {
        return this._object.uiComponent;
    }
    get meta() {
        return this._object.meta;
    }
    get outletLines() {
        return this._patcher.getLinesBySrcID(this.id);
    }
    get inletLines() {
        return this._patcher.getLinesByDestID(this.id);
    }
    get object() {
        return this._object;
    }
    get parsed() {
        return this._parsed;
    }
    setInlets(count: number) {
        const lines = this.allLines;
        lines.forEach(el => this._patcher.lines[el].disable());
        this.inlets = count;
        lines.forEach(el => this._patcher.lines[el].enable());
        this.inletLines.forEach(el => el.forEach(id => this._patcher.lines[id].uiUpdateDest()));
        this.emit("ioCountChanged", this);
        this._patcher.emit("graphChanged");
    }
    setOutlets(count: number) {
        const lines = this.allLines;
        lines.forEach(el => this._patcher.lines[el].disable());
        this.outlets = count;
        lines.forEach(el => this._patcher.lines[el].enable());
        this.outletLines.forEach(el => el.forEach(id => this._patcher.lines[id].uiUpdateSrc()));
        this.emit("ioCountChanged", this);
        this._patcher.emit("graphChanged");
    }
    getInletPos(port: number) {
        return { top: this.rect[1], left: ((this.rect[0] + 10) + (this.rect[2] - 20) * port / (this.inlets > 1 ? this.inlets - 1 : 1)) };
    }
    getOutletPos(port: number) {
        return { top: this.rect[1] + this.rect[3], left: ((this.rect[0] + 10) + (this.rect[2] - 20) * port / (this.outlets > 1 ? this.outlets - 1 : 1)) };
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
        const lines: { [key: string]: boolean } = {};
        this.inletLines.forEach(el => el.forEach(id => lines[id] = true));
        this.outletLines.forEach(el => el.forEach(id => lines[id] = true));
        return Object.keys(lines);
    }
    // called when inlet or outlet are connected or disconnected
    connectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        if (this._object) this._object.connectedOutlet(outlet, destBox, destInlet, lineID);
        this.emit("connectedPort", { isSrc: true, i: outlet });
        this._patcher.emit("graphChanged");
        return this;
    }
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        if (this._object) this._object.connectedInlet(inlet, srcBox, srcOutlet, lineID);
        this.emit("connectedPort", { isSrc: false, i: inlet });
        this._patcher.emit("graphChanged");
        return this;
    }
    disconnectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        if (this._object) this._object.disconnectedOutlet(outlet, destBox, destInlet, lineID);
        const last = this._patcher.getLinesBySrcID(this.id)[outlet].length === 1;
        this.emit("disconnectedPort", { isSrc: true, i: outlet, last });
        this._patcher.emit("graphChanged");
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        if (this._object) this._object.disconnectedInlet(inlet, srcBox, srcOutlet, lineID);
        const last = this._patcher.getLinesByDestID(this.id)[inlet].length === 1;
        this.emit("disconnectedPort", { isSrc: false, i: inlet, last });
        this._patcher.emit("graphChanged");
        return this;
    }
    isOutletTo(outlet: number, box: Box, inlet: number) {
        const outletLines = this.outletLines[outlet];
        for (let i = 0; i < outletLines.length; i++) {
            const line = this._patcher.lines[outletLines[i]];
            if (line.destBox === box && line.destInlet === inlet) return true;
        }
        return false;
    }
    isInletFrom(inlet: number, box: Box, outlet: number) {
        const inletLines = this.inletLines[inlet];
        for (let i = 0; i < inletLines.length; i++) {
            const line = this._patcher.lines[inletLines[i]];
            if (line.srcBox === box && line.srcOutlet === outlet) return true;
        }
        return false;
    }
    changeText(textIn: string) {
        if (textIn === this.text) return this;
        this.text = textIn;
        const lines = this.allLines;
        lines.forEach(el => this._patcher.lines[el].disable());
        this.args = [] as Args<T>;
        this.init();
        lines.forEach(el => this._patcher.lines[el].enable());
        const { defaultSize } = this._object.uiComponent;
        if (defaultSize && defaultSize.every(v => typeof v === "number" && v > 0) && defaultSize.length === 2) this.size = defaultSize;
        this.emit("textChanged", this);
        this._patcher.emit("graphChanged");
        return this;
    }
    update(e: { args?: any[]; props?: { [key: string]: any } }) {
        const { args, props } = e;
        if (args) this.args = Object.assign(this.args, args);
        if (props) this.props = Object.assign(this.props, props);
        this.emit("updatedFromObject", { args, props });
        return this;
    }
    setRect(rect: [number, number, number, number]) {
        if (rect.every((v, i) => v === this.rect[i])) return this;
        if (!rect.every(v => typeof v === "number")) return this;
        if (rect.length !== 4) return this;
        this.rect = rect;
        this.allLines.forEach(id => this._patcher.lines[id].uiUpdateDest());
        this.emit("rectChanged", this);
        return this;
    }
    set position([leftIn, topIn]: [number, number]) {
        const [left, top, width, height] = this.rect;
        this.setRect([leftIn || left, topIn || top, width, height] as [number, number, number, number]);
    }
    set size([widthIn, heightIn]: [number, number]) {
        const [left, top, width, height] = this.rect;
        this.setRect([left, top, widthIn || width, heightIn || height] as [number, number, number, number]);
    }
    get left() {
        return this.rect[0];
    }
    set left(leftIn: number) {
        this.position = [leftIn, 0];
    }
    get top() {
        return this.rect[1];
    }
    set top(topIn: number) {
        this.position = [0, topIn];
    }
    get width() {
        return this.rect[2];
    }
    set width(widthIn: number) {
        this.size = [widthIn, 0];
    }
    get height() {
        return this.rect[3];
    }
    set height(heightIn: number) {
        this.size = [0, heightIn];
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
        this.emit("presentationChanged", this);
        return this;
    }
    setPresentationRect(rect: [number, number, number, number]) {
        if (rect.every((v, i) => v === this.presentationRect[i])) return this;
        this.presentationRect = rect;
        this.emit("presentationRectChanged", this);
        return this;
    }
    highlightPort(isSrc: boolean, i: number, highlight: boolean) {
        this.emit("highlightPort", { isSrc, i, highlight });
    }
    destroy() {
        const lineAsDest = this.inletLines;
        const lineAsSrc = this.outletLines;
        lineAsDest.forEach(el => el.forEach(el => this._patcher.deleteLine(el)));
        lineAsSrc.forEach(el => el.forEach(el => this._patcher.deleteLine(el)));
        this._object.destroy();
        delete this._patcher.boxes[this.id];
        this._patcher.emit("graphChanged");
        return this;
    }
    static parseObjText(strIn: string) {
        const parseToPrimitive = (value: any) => {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value.toString();
            }
        };
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
