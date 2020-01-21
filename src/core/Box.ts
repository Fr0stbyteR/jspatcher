import { isTRect } from "../utils/utils";
import { MappedEventEmitter } from "../utils/MappedEventEmitter";
import Patcher from "./Patcher";
import { AnyObject } from "./objects/Base";
import { BoxEventMap, TBox, TMaxBox, Data, Args, Props, Inputs, TRect } from "./types";

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
        this._patcher.createObject(this._parsed, this);
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
    set object(oIn: T) {
        this._object = oIn;
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
    }
    setOutlets(count: number) {
        const lines = this.allLines;
        lines.forEach(el => this._patcher.lines[el].disable());
        this.outlets = count;
        lines.forEach(el => this._patcher.lines[el].enable());
        this.outletLines.forEach(el => el.forEach(id => this._patcher.lines[id].uiUpdateSrc()));
        this.emit("ioCountChanged", this);
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
    changeText(textIn: string, force?: boolean) {
        if (!force && textIn === this.text) return this;
        this.allLines.forEach(el => this._patcher.lines[el].disable());
        this._object.destroy();
        this.text = textIn;
        this.args = [] as Args<T>;
        this.init();
        this.allLines.forEach(el => this._patcher.lines[el].enable());
        const { defaultSize } = this._object.uiComponent;
        if (defaultSize && defaultSize.every(v => typeof v === "number" && v > 15) && defaultSize.length === 2) {
            this.size = defaultSize;
            this.presentationSize = defaultSize;
        }
        this.emit("textChanged", this);
        this._object.emit("metaChanged", this._object.meta);
        return this;
    }
    update(e: { args?: any[]; props?: { [key: string]: any } }) {
        const { args, props } = e;
        if (args) this.args = Object.assign(this.args, args);
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
    set position([leftIn, topIn]: [number, number]) {
        const [left, top, width, height] = this.rect;
        this.setRect([typeof leftIn === "number" ? leftIn : left, typeof topIn === "number" ? topIn : top, width, height] as TRect);
    }
    set presentationPosition([leftIn, topIn]: [number, number]) {
        const [left, top, width, height] = this.presentationRect;
        this.setPresentationRect([typeof leftIn === "number" ? leftIn : left, typeof topIn === "number" ? topIn : top, width, height] as TRect);
    }
    set size([widthIn, heightIn]: [number, number]) {
        const [left, top, width, height] = this.rect;
        this.setRect([left, top, widthIn || width, heightIn || height] as TRect);
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
        this.inletLines.forEach(el => el.forEach(id => this._patcher.lines[id].uiUpdateDest()));
        this.outletLines.forEach(el => el.forEach(id => this._patcher.lines[id].uiUpdateSrc()));
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
        this.allLines.forEach(el => this._patcher.deleteLine(el));
        this._object.destroy();
        delete this._patcher.boxes[this.id];
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
