import TypedEventEmitter from "../../utils/TypedEventEmitter";
import { isTRect, parseToPrimitive, isTPresentationRect, isRectMovable, isRectResizable } from "../../utils/utils";
import type Patcher from "./Patcher";
import type Line from "./Line";
import type { TBox, TMaxBox, TRect, TPresentationRect } from "../types";
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
    inlets = 0;
    outlets = 0;
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
    /**
     * Main function when receive data from a inlet (base 0)
     */
    fn(inlet: number, data: any) {
        this._object?.fn(inlet, data);
        return this;
    }
    get UI() {
        return this._Object.UI;
    }
    get defaultSize() {
        return this.UI?.defaultSize || [90, 20];
    }
    get meta() {
        return this._object?.meta;
    }
    get outletLines() {
        return this._outletLines;
    }
    get inletLines() {
        return this._inletLines;
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
        // Lines that should be removed will destroy themselves when enable()
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
        // Lines that should be removed will destroy themselves when enable()
        lines.forEach(line => line.enable());
        const linesSetLength = this._outletLines.length;
        if (count > linesSetLength)
            this._outletLines.push(...new Array(count - linesSetLength).fill(null).map(() => new Set<Line>()));
        else if (count < linesSetLength)
            this._outletLines.splice(count);
        this._outletLines.forEach(set => set.forEach(line => line.uiUpdateSrc()));
        this.emit("ioCountChanged", this);
    }
    getInletPos(port: number) {
        const { rect, inlets } = this;
        const [left, top, width] = rect;
        return { top, left: ((left + 10) + (width - 20) * port / (inlets > 1 ? inlets - 1 : 1)) };
    }
    getOutletPos(port: number) {
        const { rect, outlets } = this;
        const [left, top, width, height] = rect;
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
    connectedOutlet(outlet: number, destBoxId: string, destInlet: number, lineId: string) {
        if (this._object) this._object.connectedOutlet(outlet, destBoxId, destInlet, lineId);
        this.emit("connectedPort", { isSrc: true, i: outlet });
        return this;
    }
    connectedInlet(inlet: number, srcBoxId: string, srcOutlet: number, lineId: string) {
        if (this._object) this._object.connectedInlet(inlet, srcBoxId, srcOutlet, lineId);
        this.emit("connectedPort", { isSrc: false, i: inlet });
        return this;
    }
    disconnectedOutlet(outlet: number, destBoxId: string, destInlet: number, lineId: string) {
        if (this._object) this._object.disconnectedOutlet(outlet, destBoxId, destInlet, lineId);
        const last = this._patcher.getLinesBySrcID(this.id)[outlet].length === 1;
        this.emit("disconnectedPort", { isSrc: true, i: outlet, last });
        return this;
    }
    disconnectedInlet(inlet: number, srcBoxId: string, srcOutlet: number, lineId: string) {
        if (this._object) this._object.disconnectedInlet(inlet, srcBoxId, srcOutlet, lineId);
        const last = this._patcher.getLinesByDestID(this.id)[inlet].length === 1;
        this.emit("disconnectedPort", { isSrc: false, i: inlet, last });
        return this;
    }
    isOutletTo(outlet: number, box: Box, inlet: number) {
        const iterator = this._outletLines[outlet].values();
        let r: IteratorResult<Line, Line>;
        while (!(r = iterator.next()).done) {
            const line = r.value;
            if (line.destBox === box && line.destInlet === inlet) return true;
        }
        return false;
    }
    isInletFrom(inlet: number, box: Box, outlet: number) {
        const iterator = this._inletLines[inlet].values();
        let r: IteratorResult<Line, Line>;
        while (!(r = iterator.next()).done) {
            const line = r.value;
            if (line.srcBox === box && line.srcOutlet === outlet) return true;
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
    minWidth() {
        const mostBubbles = this.inlets > this.outlets ? this.inlets : this.outlets;
        const minWidth = mostBubbles ? 20 + (mostBubbles - 1) * 20 : 30;
        return minWidth;
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
        this.inletLines.forEach(set => set.forEach(line => line.uiUpdateDest()));
        this.outletLines.forEach(set => set.forEach(line => line.uiUpdateSrc()));
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
        delete this._patcher.boxes[this.id];
        await this._object?.destroy();
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
        const { id, text, inlets, outlets, rect, background, presentation, presentationRect, args, props, data, zIndex } = this;

        const defaultProps: Record<string, any> = structuredClone(props);
        if (this.meta && (typeof this.meta.props === 'object')) {
            for (const key in this.meta.props) {
                if (this.meta.props[key].alwaysSerialize) {
                    if (!(key in defaultProps)) {
                        defaultProps[key] = this.meta.props[key].default;
                    }
                }
            }
        }

        return JSON.stringify({ id, text, inlets, outlets, rect, background, presentation, presentationRect, args, props: defaultProps, data, zIndex });
    }
    toSerializable(): TBox {
        return JSON.parse(this.toString());
    }
}
