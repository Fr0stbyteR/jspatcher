import { EventEmitter } from "events";
import Patcher from "./Patcher";
import { LineEventMap, TLine, TLineType } from "./types";

export default class Line extends EventEmitter<LineEventMap> {
    readonly id: string;
    src: [string, number];
    dest: [string, number];
    disabled = true;
    private readonly _patcher: Patcher;
    constructor(patcherIn: Patcher, lineIn: TLine) {
        super();
        this.id = lineIn.id;
        this.src = lineIn.src;
        this.dest = lineIn.dest;
        this.disabled = true;
        this._patcher = patcherIn;
    }
    setSrc(src: [string, number]) {
        const srcID = src[0];
        const srcOutlet = src[1];
        if (srcID === this.src[0] && srcOutlet === this.src[1]) return this;
        this.disable();
        this.src = [srcID, srcOutlet];
        this.enable();
        return this.uiUpdateSrc();
    }
    getSrc() {
        return this.src;
    }
    uiUpdateSrc() {
        this.emit("srcPosChanged", this.srcPos);
        return this;
    }
    setDest(dest: [string, number]) {
        const destID = dest[0];
        const destInlet = dest[1];
        if (destID === this.dest[0] && destInlet === this.dest[1]) return this;
        this.disable();
        this.dest = [destID, destInlet];
        this.enable();
        return this.uiUpdateDest();
    }
    getDest() {
        return this.dest;
    }
    uiUpdateDest() {
        this.emit("destPosChanged", this.destPos);
        return this;
    }
    disable(bool?: boolean): Line {
        if (bool === false) return this.enable();
        if (this.disabled) return this;
        this.disabled = true;
        const { srcBox, destBox } = this;
        if (this._patcher.getLinesByBox(this.srcID, this.destID, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable
        srcBox.disconnectedOutlet(this.srcOutlet, destBox, this.destInlet, this.id);
        destBox.disconnectedInlet(this.destInlet, srcBox, this.srcOutlet, this.id);
        return this;
    }
    enable(bool?: boolean): Line {
        if (bool === false) return this.disable();
        if (!this.disabled) return this;
        const { srcBox, destBox } = this;
        if (this.srcOutlet >= srcBox.outlets || this.destInlet >= destBox.inlets) return this._patcher.deleteLine(this.id);
        if (this._patcher.getLinesByBox(this.srcID, this.destID, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable
        srcBox.connectedOutlet(this.srcOutlet, destBox, this.destInlet, this.id);
        destBox.connectedInlet(this.destInlet, srcBox, this.srcOutlet, this.id);
        this.disabled = false;
        return this;
    }
    destroy() {
        this.disable();
        delete this._patcher.lines[this.id];
        return this;
    }
    pass(data: any) {
        this.emit("passData", data);
        return this.disabled ? this : this.destBox.fn(data, this.destInlet);
    }
    get positionHash() {
        const destPos = this.destPos;
        return destPos.left * 65536 + destPos.top;
    }
    get srcPos() {
        return this._patcher.boxes[this.src[0]].getOutletPos(this.src[1]);
    }
    get destPos() {
        return this._patcher.boxes[this.dest[0]].getInletPos(this.dest[1]);
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
    get type(): TLineType {
        return this.srcBox.object.meta.inlets[this.srcOutlet].type === "signal" && this.srcBox.object.meta.outlets[this.destInlet].type === "signal" ? "audio" : "normal";
    }
}
