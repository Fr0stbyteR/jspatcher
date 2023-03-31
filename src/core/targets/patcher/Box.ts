import TypedEventEmitter from "../../../utils/TypedEventEmitter";
import { isTRect, parseToPrimitive, isTPresentationRect, isRectMovable, isRectResizable } from "../../../utils/utils";
import type Patcher from "./Patcher";
import type TargetLine from "./TargetLine";
import type { TBox, TRect, TPresentationRect } from "../types";
import type { Args, Data, IJSPatcherObject, JSPatcherObjectEventMap, ObjectUpdateOptions, Props, State } from "../objects/base/AbstractObject";

export interface BoxEventMap extends Pick<JSPatcherObjectEventMap<any, any, any, any, any, any, any>, "metaUpdated" | "argsUpdated" | "propsUpdated" | "dataUpdated" | "stateUpdated"> {
    "rectChanged": Box;
    "presentationRectChanged": Box;
    "backgroundChanged": Box;
    "presentationChanged": Box;
    "textChanged": Box;
    "error": string;
    "connectedPort": { isSrc: boolean; i: number; last?: false };
    "disconnectedPort": { isSrc: boolean; i: number; last: boolean };
    "ioCountChanged": Box;
}

export default class Box<T extends IJSPatcherObject = IJSPatcherObject> extends TypedEventEmitter<BoxEventMap> {
    readonly id: string;
    text = "";
    ios = 0;
    rect: TRect;
    background: boolean;
    presentation: boolean;
    presentationRect: TPresentationRect;
    /** A timestamp to order boxes UI on z-axis, default = 0, negative = send to back, positive = bring to front */
    zIndex: number;
    data: Data<T>;
    args: Args<T>;
    props: Props<T>;
    _editing: boolean;
    private _parsed: { class: string; args: Args<T>; props: Props<T> };
    private _object: T;
    private _Object: typeof IJSPatcherObject;
    private readonly _patcher: Patcher;
    private readonly _lines: Set<TargetLine>[];
    constructor(patcherIn: Patcher, boxIn: TBox) {
        super();
        this.id = boxIn.id;
        this.text = boxIn.text;
        this.args = (boxIn.args || []) as Args<T>;
        this.props = (boxIn.props || {}) as Props<T>;
        this.ios = boxIn.ios;
        // this._inletLines = new Array(this.inlets).fill(null).map(() => new Set<TargetLine>());
        // this._outletLines = new Array(this.outlets).fill(null).map(() => new Set<TargetLine>());
        this._lines = new Array(this.ios).fill(null).map(() => new Set<TargetLine>());
        this.rect = boxIn.rect;
        this.background = boxIn.background;
        this.presentation = boxIn.presentation;
        this.presentationRect = boxIn.presentationRect;
        if (!this.presentationRect) this.presentationRect = this.rect.slice() as TRect;
        this.zIndex = boxIn.zIndex || 0;
        this.data = boxIn.data || (boxIn as any).prevData?.storage || {};
        this._editing = !!boxIn._editing;
        this._patcher = patcherIn;
        this.on("dataUpdated", () => this._patcher.emitChanged());
        this.on("argsUpdated", () => this._patcher.emitChanged());
        this.on("propsUpdated", () => this._patcher.emitChanged());
    }
    async init() {
        this._parsed = Box.parseObjText(this.text) as { class: string; args: Args<T>; props: Props<T> };
        const newMeta = this._patcher.getObjectMeta(this._parsed);
        for (const key in this.props) {
            if (!newMeta.props[key]) delete this.props[key];
        }
        if (this._parsed.args.length) this.args = this._parsed.args;
        Object.assign(this.props, this._parsed.props);
        const Constructor = this._patcher.getObjectConstructor(this._parsed);
        if (Constructor === this._patcher.activeLib.InvalidObject) {
            this.error(`Object ${this._parsed.class} not found.`);
        }
        this._Object = Constructor;
        if (!this.size.every(v => v > 0)) this.size = this.defaultSize;
        if (!isTPresentationRect(this.presentationRect) || (this.presentationSize.every(v => typeof v === "number") && !this.presentationSize.every(v => v > 0))) this.presentationSize = this.defaultSize;
        if (this.objectInit) {
            this._object = new Constructor(this, this._patcher) as T;
            await this._object.init();
        }
        return this;
    }
    async postInit() {
        await this._object?.postInit();
        return this;
    }
    // /**
    //  * Main function when receive data from a inlet (base 0)
    //  */
    // fn(inlet: number, data: any) {
    //     this._object?.fn(inlet, data);
    //     return this;
    // }
    get UI() {
        return this._Object.UI;
    }
    get defaultSize() {
        return this.UI?.defaultSize || [90, 20];
    }
    get meta() {
        return this._object?.meta;
    }
    // get outletLines() {
    //     return this._outletLines;
    // }
    // get inletLines() {
    //     return this._inletLines;
    // }
    get lines() {
        return this._lines;
    }
    get objectInit() {
        return this._patcher.props.objectInit;
    }
    get object() {
        return this._object;
    }
    set object(oIn: T) {
        this._object = oIn;
    }
    get Object() {
        return this._Object;
    }
    get parsed() {
        return this._parsed;
    }
    // TODO -- we'll need a more correct paradigm to handle which inlet this line connects to
    addLine(line: TargetLine) {
        const index = line.destInlet;
        if (!this._lines[index]) this._lines[index] = new Set<TargetLine>();
        this._lines[index].add(line);
    }
    removeLine(line: TargetLine) {
        const index = line.destInlet;
        if (this._lines[index]) this._lines[index].delete(line);
    }
    setIos(count: number) {
        const lines = this.allLines;
        lines.forEach(line => line.disable());
        this.ios = count;
        // Lines that should be removed will destroy themselves when enable()
        lines.forEach(line => line.enable());
        const linesSetLength = this._lines.length;
        if (count > linesSetLength) this._lines.push(...new Array(count - linesSetLength).fill(null).map(() => new Set<TargetLine>()));
        else if (count < linesSetLength) this._lines.splice(count);
        this._lines.forEach(set => set.forEach(line => line.uiUpdateDest()));
        this.emit("ioCountChanged", this);
    }
    // TODO -- this will need to be modified for the new patcher schema
    getIoPos(port: number) {
        const { rect, ios } = this;
        const [left, top, width] = rect;
        return { top, left: ((left + 10) + (width - 20) * port / (ios > 1 ? ios - 1 : 1)) };
    }
    get iosPositions() {
        const positions = [];
        for (let i = 0; i < this.ios; i++) {
            positions[i] = this.getIoPos(i);
        }
        return positions;
    }
    // TODO -- this is maintained out of legacy reasons and can likely be removed
    get allLines() {
        const lines = new Set<TargetLine>();
        this._lines.forEach(set => set.forEach(line => lines.add(line)));
        return lines;
    }
    // called when an I/O is connected or disconnected
    connectedIo(io: number, destBoxId: string, destIo: number, lineId: string) {
        if (this._object) this._object.connectedIo(io, destBoxId, destIo, lineId);
        this.emit("connectedPort", { isSrc: true, i: io });
        return this;
    }
    disconnectedIo(io: number, destBoxId: string, destIo: number, lineId: string) {
        if (this._object) this._object.disconnectedIo(io, destBoxId, destIo, lineId);
        const last = this._patcher.getLinesBySrcID(this.id)[io].length === 1;
        this.emit("disconnectedPort", { isSrc: true, i: io, last });
        return this;
    }
    isConnectedTo(io: number, box: Box, other_io: number) {
        const iterator = this._lines[io].values();
        let r: IteratorResult<TargetLine, TargetLine>;
        while (!(r = iterator.next()).done) {
            const line = r.value;
            if (line.destBox === box && line.destInlet === other_io)
                return true;
        }
        return false;
    }
    async changeText(textIn: string, force?: boolean) {
        if (!force && textIn === this.text) return this;
        const { defaultSize: oldDefaultSize } = this;
        this.allLines.forEach(line => line.disable());
        await this._object?.destroy();
        this.text = textIn;
        this.args = [] as Args<T>;
        await this.init();
        this.allLines.forEach(line => line.enable());
        const { defaultSize } = this;
        if (!defaultSize.every((v, i) => v === oldDefaultSize[i])) {
            this.size = defaultSize;
            this.presentationSize = defaultSize;
        }
        this.emit("textChanged", this);
        this._object?.setMeta(this._object.meta);
        await this.postInit();
        return this;
    }
    update(e: { args?: any[]; props?: Record<string, any> }) {
        const { args, props } = e;
        if (args) this.args = args as Args<T>;
        if (props) {
            if (isTRect(props.rect)) {
                this.setRect(props.rect);
                delete props.rect;
            }
            if (isTPresentationRect(props.presentationRect)) {
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
        return this.presentationRect.slice(0, 2) as [number | string, number | string];
    }
    set presentationPosition([leftIn, topIn]: [number | string, number | string]) {
        const [left, top, width, height] = this.presentationRect;
        this.setPresentationRect([typeof leftIn === "number" || typeof leftIn === "string" ? leftIn : left, typeof topIn === "number" || typeof topIn === "string" ? topIn : top, width, height] as TPresentationRect);
    }
    get size() {
        return this.rect.slice(2) as [number, number];
    }
    set size([widthIn, heightIn]: [number, number]) {
        const [left, top, width, height] = this.rect;
        this.setRect([left, top, widthIn || width, heightIn || height] as TRect);
    }
    get presentationSize() {
        return this.presentationRect.slice(2) as [number | string, number | string];
    }
    set presentationSize([widthIn, heightIn]: [number | string, number | string]) {
        const [left, top, width, height] = this.presentationRect;
        this.setPresentationRect([left, top, widthIn || width, heightIn || height] as TPresentationRect);
    }
    getLeft(inPresentation = false) {
        const rectKey = inPresentation ? "presentationRect" : "rect";
        return this[rectKey][0];
    }
    setLeft(leftIn: number | string, inPresentation = false) {
        const positionKey = inPresentation ? "presentationPosition" : "position";
        this[positionKey] = [leftIn as any, undefined];
    }
    getTop(inPresentation = false) {
        const rectKey = inPresentation ? "presentationRect" : "rect";
        return this[rectKey][1];
    }
    setTop(topIn: number | string, inPresentation = false) {
        const positionKey = inPresentation ? "presentationPosition" : "position";
        this[positionKey] = [undefined, topIn as any];
    }
    getWidth(inPresentation = false) {
        const rectKey = inPresentation ? "presentationRect" : "rect";
        return this[rectKey][2];
    }
    setWidth(widthIn: number | string, inPresentation = false) {
        const sizeKey = inPresentation ? "presentationSize" : "size";
        this[sizeKey] = [widthIn as any, undefined];
    }
    getHeight(inPresentation = false) {
        const rectKey = inPresentation ? "presentationRect" : "rect";
        return this[rectKey][3];
    }
    setHeight(heightIn: number | string, inPresentation = false) {
        const sizeKey = inPresentation ? "presentationSize" : "size";
        this[sizeKey] = [undefined, heightIn as any];
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
        if (!isTRect(rect)) return this;
        rect[0] = Math.max(0, rect[0]);
        rect[1] = Math.max(0, rect[1]);
        rect[2] = Math.max(15, rect[2]);
        rect[3] = Math.max(15, rect[3]);
        this.rect = rect;
        // TODO -- the UI needs updating to handle I/O instead of inlet or outlet
        this.lines.forEach(set => set.forEach(line => line.uiUpdateDest()));
        this.emit("rectChanged", this);
        return this;
    }
    setPresentationRect(rect: TPresentationRect) {
        if (!isTPresentationRect(rect)) return this;
        if (typeof rect[0] === "number") rect[0] = Math.max(0, rect[0]);
        if (typeof rect[1] === "number") rect[1] = Math.max(0, rect[1]);
        if (typeof rect[2] === "number") rect[2] = Math.max(15, rect[2]);
        if (typeof rect[3] === "number") rect[3] = Math.max(15, rect[3]);
        this.presentationRect = rect;
        this.emit("presentationRectChanged", this);
        return this;
    }
    getIsMovable(inPresentation = false) {
        if (!inPresentation) return true;
        return isRectMovable(this.presentationRect);
    }
    getIsResizable(inPresentation = false) {
        if (!inPresentation) return true;
        return isRectResizable(this.presentationRect);
    }
    setZIndex(zIndex: number) {
        const oldZIndex = this.zIndex;
        this.zIndex = zIndex;
        this.undoable({ oldZIndex, zIndex });
        this._patcher.emit("zIndexChanged", { boxId: this.id, zIndex });
    }
    error(text: string) {
        this.emit("error", text);
        this._patcher.newLog("error", "Patcher", text, this);
    }
    highlight() {
        this._patcher.emit("highlightBox", this.id);
    }
    highlightPort(isSrc: boolean, portIndex: number) {
        this._patcher.emit("highlightPort", { boxId: this.id, isSrc, i: portIndex });
    }
    undoable(e: { oldArgs?: Args<T>; args?: Args<T>; oldProps?: Props<T>; props?: Props<T>; oldState?: State<T>; state?: State<T>; oldZIndex: number; zIndex?: number }) {
        this._patcher.boxChanged(this.id, e);
    }
    async changeObject({ args, props, state, zIndex }: { args?: Args<T>; props?: Props<T>; state?: State<T>; zIndex?: number }, options?: ObjectUpdateOptions) {
        if (args) await this._object?.updateArgs(args, options);
        if (props) await this._object?.updateProps(props, options);
        if (state) await this._object?.updateState(state, options);
    }
    async destroy() {
        this.allLines.forEach(line => this._patcher.deleteLine(line.id));
        await this._object?.destroy();
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
        const objOut: { class: string; args: any[]; props: Record<string, any> } = { class: "", args: [], props: {} };
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
    toString() {
        const { id, text, ios, rect, background, presentation, presentationRect, args, props, data, zIndex } = this;
        return JSON.stringify({ id, text, ios, rect, background, presentation, presentationRect, args, props, data, zIndex });
    }
    toSerializable(): TBox {
        return JSON.parse(this.toString());
    }
}
