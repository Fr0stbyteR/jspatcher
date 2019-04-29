import { EventEmitter } from "events";
import Patcher from "./Patcher";
import { LineEventMap, TLine } from "./types";

export default class Line extends EventEmitter {
    on<K extends keyof LineEventMap>(type: K, listener: (e: LineEventMap[K]) => void) {
        return super.on(type, listener);
    }
    once<K extends keyof LineEventMap>(type: K, listener: (e: LineEventMap[K]) => void) {
        return super.once(type, listener);
    }
    off<K extends keyof LineEventMap>(type: K, listener: (e: LineEventMap[K]) => void) {
        return super.off(type, listener);
    }
    removeAllListeners<K extends keyof LineEventMap>(type: K) {
        return super.removeAllListeners(type);
    }
    emit<K extends keyof LineEventMap>(type: K, e: LineEventMap[K]) {
        return super.emit(type, e);
    }
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
        this.emit("srcPosChanged", this.srcPosition);
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
        this.emit("destPosChanged", this.destPosition);
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
