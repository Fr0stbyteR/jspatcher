import { EventEmitter } from "events";
import { Patcher } from "./Patcher";
export type TLine = { id?: string, src: [string, number], dest: [string, number], disabled?: boolean};
type TEvents = "passData" | "destPosChanged" | "srcPosChanged" | "posChanged";
export class Line extends EventEmitter {
    on: (type: TEvents, listener: (...args: any[]) => void) => this;
    once: (type: TEvents, listener: (...args: any[]) => void) => this;
    off: (type: TEvents, listener: (...args: any[]) => void) => this;
    removeAllListeners: (type: TEvents) => this;
    emit: (type: TEvents, ...args: any[]) => boolean;
    readonly id: string;
    protected src: [string, number];
    protected dest: [string, number];
    protected disabled = false;
    private readonly _patcher: Patcher;
    constructor(patcherIn: Patcher, lineIn: TLine) {
        super();
        this.id = lineIn.id;
        this.src = lineIn.src;
        this.dest = lineIn.dest;
        this.disabled = lineIn.disabled || false;
        this._patcher = patcherIn;
    }
    setSrc(src: [string, number]) {
        const srcID = src[0];
        const srcOutlet = src[1];
        if (srcID === this.src[0] && srcOutlet === this.src[1]) return this;
        this.disable();
        this.src = [srcID, srcOutlet];
        this.enable();
        this.emit("srcPosChanged", this.srcPosition);
        return this;
    }
    getSrc() {
        return this.src;
    }
    setDest(dest: [string, number]) {
        const destID = dest[0];
        const destInlet = dest[1];
        if (destID === this.dest[0] && destInlet === this.dest[1]) return this;
        this.disable();
        this.dest = [destID, destInlet];
        this.enable();
        this.emit("destPosChanged", this.destPosition);
        return this;
    }
    getDest() {
        return this.dest;
    }
    disable(bool?: boolean): Line {
        // tslint:disable-next-line: no-boolean-literal-compare
        if (bool === false) return this.enable();
        if (this.disabled) return this;
        this.disabled = true;
        const srcBox = this.srcBox;
        const destBox = this.destBox;
        if (this._patcher.getLinesByBox(this.srcID, this.destID, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable
        srcBox.disconnectedOutlet(this.srcOutlet, destBox, this.destInlet, this.id);
        destBox.disconnectedInlet(this.destInlet, srcBox, this.srcOutlet, this.id);
        return this;
    }
    enable(bool?: boolean): Line {
        // tslint:disable-next-line: no-boolean-literal-compare
        if (bool === false) return this.disable();
        if (!this.disabled) return this;
        const srcBox = this.srcBox;
        const destBox = this.destBox;
        if (this.srcOutlet >= srcBox.outlets || this.destInlet >= destBox.inlets) return this._patcher.deleteLine(this.id);
        if (this._patcher.getLinesByBox(this.srcID, this.destID, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable
        srcBox.connectedOutlet(this.srcOutlet, destBox, this.destInlet, this.id);
        destBox.connectedInlet(this.destInlet, srcBox, this.srcOutlet, this.id);
        this.disabled = false;
        return this;
    }
    destroy() {
        delete this._patcher.lines[this.id];
        this.disable();
        return this;
    }
    pass(data: any) {
        this.emit("passData", data);
        return this.disabled ? this : this.destBox.fn(data, this.destInlet);
    }
    get positionHash() {
        const destPosition = this.destPosition;
        return destPosition.left * 65536 + destPosition.top;
    }
    get srcPosition() {
        return this._patcher.boxes[this.src[0]].getOutletPosition(this.src[1]);
    }
    get destPosition() {
        return this._patcher.boxes[this.dest[0]].getInletPosition(this.dest[1]);
    }
    get srcID() {
        return this.src[0];
    }
    get srcOutlet() {
        return this.src[1];
    }
    get destID() {
        return this.dest[0];
    }
    get destInlet() {
        return this.dest[1];
    }
    get srcBox() {
        return this._patcher.boxes[this.src[0]];
    }
    get destBox() {
        return this._patcher.boxes[this.dest[0]];
    }
}
