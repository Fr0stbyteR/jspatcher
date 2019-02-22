import { EventEmitter } from "events";
import { Patcher } from "./Patcher";
import { BaseObject } from "./objects/Base";
export type TBox = { id?: string, text: string, inlets: number, outlets: number, patching_rect: [number, number, number, number], data?: { [key: string]: any } };
type TEvents = "changeRect";
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
    patching_rect: [number, number, number, number];
    data = {} as { [key: string]: any };
    _parsed: { class: string, args: any[], props: { [key: string]: any } };
    private _object: BaseObject;
    private _patcher: Patcher;
    constructor(patcherIn: Patcher, boxIn: TBox) {
        super();
        Object.assign(this, boxIn);
        this._patcher = patcherIn;
    }
    init() {
        this._parsed = Box.parseObjText(this.text);
        this._object = this._patcher.createObject(this._parsed, this);
    }
    // main function when receive data from a inlet (base 0)
    fn(data: any, inlet: number) {
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
            return this;
        }
        // else new box
        const lines = this.allLines;
        lines.forEach(el => this._patcher.lines[el].disable());
        this._parsed = parsed;
        this._object = this._patcher.createObject(parsed, this);
        lines.forEach(el => this._patcher.lines[el].enable());
        return this;
    }
    changeRect() {
        this.emit("changeRect", this.patching_rect);
        const lineAsDest = this._patcher.getLinesByDestID(this.id);
        const lineAsSrc = this._patcher.getLinesBySrcID(this.id);
        lineAsDest.forEach(el => el.forEach(el => this._patcher.lines[el].emit("changeDestPos")));
        lineAsSrc.forEach(el => el.forEach(el => this._patcher.lines[el].emit("changeSrcPos")));
        return this;
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
