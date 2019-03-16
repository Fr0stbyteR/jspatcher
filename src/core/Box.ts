import { EventEmitter } from "events";
import { Patcher } from "./Patcher";
import { BaseObject } from "./objects/Base";
export type TBox = { id?: string, text: string, inlets: number, outlets: number, rect: [number, number, number, number], data?: { [key: string]: any } };
type TEvents = "rectChanged" | "textChanged" | "highlightPort";
export class Box extends EventEmitter {
    on: (type: TEvents, listener: (...args: any[]) => void) => this;
    once: (type: TEvents, listener: (...args: any[]) => void) => this;
    off: (type: TEvents, listener: (...args: any[]) => void) => this;
    removeAllListeners: (type: TEvents) => this;
    emit: (type: TEvents, ...args: any[]) => boolean;
    id: string;
    text = "";
    inlets = 0;
    outlets = 0;
    rect: [number, number, number, number];
    data = {} as { [key: string]: any };
    private _parsed: { class: string, args: any[], props: { [key: string]: any } };
    private _object: BaseObject;
    private _patcher: Patcher;
    constructor(patcherIn: Patcher, boxIn: TBox) {
        super();
        this.id = boxIn.id;
        this.text = boxIn.text;
        this.inlets = boxIn.inlets;
        this.outlets = boxIn.outlets;
        this.rect = boxIn.rect || (boxIn as any).patching_rect;
        this.data = boxIn.data || ((boxIn as any).prevData ? (boxIn as any).prevData.storage : {});
        this._patcher = patcherIn;
    }
    init() {
        this._parsed = Box.parseObjText(this.text);
        this._object = this._patcher.createObject(this._parsed, this);
    }
    // main function when receive data from a inlet (base 0)
    fn(data: any, inlet: number) {
        this._object.fn(data, inlet);
        return this;
    }
    get ui() {
        return this._object.ui();
    }
    get meta() {
        return this._object._meta;
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
    getInletPosition(port: number) {
        return { top: this.rect[1], left: ((this.rect[0] + 10) + (this.rect[2] - 20) * port / (this.inlets > 1 ? this.inlets - 1 : 1)) };
    }
    getOutletPosition(port: number) {
        return { top: this.rect[1] + this.rect[3], left: ((this.rect[0] + 10) + (this.rect[2] - 20) * port / (this.outlets > 1 ? this.outlets - 1 : 1)) };
    }
    get inletsPositions() {
        const positions = [];
        for (let i = 0; i < this.inlets; i++) {
            positions[i] = this.getInletPosition(i);
        }
        return positions;
    }
    get outletsPositions() {
        const positions = [];
        for (let i = 0; i < this.outlets; i++) {
            positions[i] = this.getOutletPosition(i);
        }
        return positions;
    }
    get allLines() {
        const lines = [] as string[];
        const lineAsDest = this._patcher.getLinesByDestID(this.id);
        const lineAsSrc = this._patcher.getLinesBySrcID(this.id);
        lineAsDest.forEach(el => el.forEach(el => lines.push(el)));
        lineAsSrc.forEach(el => el.forEach(el => lines.push(el)));
        return lines;
    }
    // called when inlet or outlet are connected or disconnected
    connectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        if (this._object) this._object.connectedOutlet(outlet, destBox, destInlet, lineID);
        return this;
    }
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        if (this._object) this._object.connectedInlet(inlet, srcBox, srcOutlet, lineID);
        return this;
    }
    disconnectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        if (this._object) this._object.disconnectedOutlet(outlet, destBox, destInlet, lineID);
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        if (this._object) this._object.disconnectedInlet(inlet, srcBox, srcOutlet, lineID);
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
        const parsed = Box.parseObjText(textIn);
        // if same class and name
        if (this._parsed.class === parsed.class) {
            this._parsed = parsed;
            this._object.update(parsed.args, parsed.props);
        } else {
            // else new box
            const lines = this.allLines;
            lines.forEach(el => this._patcher.lines[el].disable());
            this._parsed = parsed;
            this._object = this._patcher.createObject(parsed, this);
            lines.forEach(el => this._patcher.lines[el].enable());
        }
        this.emit("textChanged", this);
        return this;
    }
    setRect(rect: [number, number, number, number]) {
        this.rect = rect;
        this.emit("rectChanged", this);
        const lineAsDest = this._patcher.getLinesByDestID(this.id);
        const lineAsSrc = this._patcher.getLinesBySrcID(this.id);
        lineAsDest.forEach(el => el.forEach(el => this._patcher.lines[el].uiUpdateDest()));
        lineAsSrc.forEach(el => el.forEach(el => this._patcher.lines[el].uiUpdateSrc()));
        return this;
    }
    highlightPort(isSrc: boolean, i: number, highlight: boolean) {
        this.emit("highlightPort", isSrc, i, highlight);
    }
    destroy() {
        const lineAsDest = this.inletLines;
        const lineAsSrc = this.outletLines;
        lineAsDest.forEach(el => el.forEach(el => this._patcher.deleteLine(el)));
        lineAsSrc.forEach(el => el.forEach(el => this._patcher.deleteLine(el)));
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
        const REGEX = /"([^"]*)"|[^\s]+/gi;
        const strArray = [];
        let match = REGEX.exec(strIn);
        while (match != null) {
            // Index 1 in the array is the captured group if it exists
            // Index 0 is the matched text, which we use if no captured group exists
            strArray.push(match[1] ? match[1] : match[0]);
            // Each call to exec returns the next regex match as an array
            match = REGEX.exec(strIn);
        }
        const objOut = { class: "", args: [], props: {} } as { class: string, args: any[], props: { [key: string]: any } };
        let lastProp;
        if (strArray.length) objOut.class = strArray.shift();
        while (strArray.length) {
            const el = strArray.shift();
            if (typeof lastProp === "undefined" && el.charAt(0) !== "@") {
                try {
                    objOut.args.push(JSON.parse(el));
                } catch (e) {
                    objOut.args.push(el);
                }
                continue;
            }
            if (el.length > 1 && el.charAt(0) === "@") {
                lastProp = el.substr(1);
                objOut.props[lastProp] = [];
                continue;
            }
            try {
                objOut.props[lastProp].push(JSON.parse(el));
            } catch (e) {
                objOut.props[lastProp].push(el);
            }
        }
        for (const key in objOut.props) {
            if (objOut.props[key].length === 0) objOut.props[key] = true;
            else if (objOut.props[key].length === 1) objOut.props[key] = parseToPrimitive(objOut.props[key][0]);
        }
        return objOut;
    }
}
