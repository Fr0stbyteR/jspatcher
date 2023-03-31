import type { WamNode } from "@webaudiomodules/api";
import TypedEventEmitter from "../../../utils/TypedEventEmitter";
import type Patcher from "./Patcher";
import type { TLine, TLineType } from "../../types";
import type { TMetaType } from "../objects/base/AbstractObject";

export interface LineEventMap {
    "passData": any;
    "destPosChanged": { top: number; left: number };
    "srcPosChanged": { top: number; left: number };
    "posChanged": TargetLine;
    "typeChanged": TLineType;
}

export default class TargetLine extends TypedEventEmitter<LineEventMap> {
    static compare(line1: TargetLine, line2: TargetLine) {
        return line2.positionHash - line1.positionHash;
    }
    readonly id: string;
    src: [string, number];
    dest: [string, number];
    disabled = true;
    private _type: TLineType;
    private readonly _patcher: Patcher;
    constructor(patcherIn: Patcher, lineIn: TLine) {
        super();
        this.id = lineIn.id;
        this.src = lineIn.src;
        this.dest = lineIn.dest;
        this.disabled = true;
        this._patcher = patcherIn;
        const { srcBox, destBox } = this;
        this._type = this.calcType();
        if (srcBox) {
            srcBox.on("metaUpdated", this.updateType);
            // srcBox.addOutletLine(this);
            srcBox.addLine(this);
        }
        if (destBox) {
            destBox.on("metaUpdated", this.updateType);
            // destBox.addInletLine(this);
            destBox.addLine(this);
        }
    }
    get presentation() {
        return this.srcBox && this.srcBox.presentation && this.destBox && this.destBox.presentation;
    }
    setSrc(src: [string, number]) {
        const srcId = src[0];
        const srcOutlet = src[1];
        if (srcId === this.src[0] && srcOutlet === this.src[1]) return this;
        this.srcBox.off("metaUpdated", this.updateType);
        this.disable();
        // this.srcBox.removeOutletLine(this);
        this.srcBox.removeLine(this);
        this.src = [srcId, srcOutlet];
        // this.srcBox.addOutletLine(this);
        this.srcBox.addLine(this);
        this.enable();
        this.srcBox.on("metaUpdated", this.updateType);
        this.updateType();
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
        const destId = dest[0];
        const destInlet = dest[1];
        if (destId === this.dest[0] && destInlet === this.dest[1]) return this;
        this.destBox.off("metaUpdated", this.updateType);
        this.disable();
        // this.destBox.removeInletLine(this);
        this.srcBox.removeLine(this);
        this.dest = [destId, destInlet];
        // this.destBox.addInletLine(this);
        this.srcBox.addLine(this);
        this.enable();
        this.destBox.on("metaUpdated", this.updateType);
        this.updateType();
        return this.uiUpdateDest();
    }
    getDest() {
        return this.dest;
    }
    uiUpdateDest() {
        this.emit("destPosChanged", this.destPos);
        return this;
    }
    disable(bool?: boolean): TargetLine {
        if (bool === false) return this.enable();
        if (this.disabled) return this;
        this.disabled = true;
        const { srcBox, destBox } = this;
        if (this._patcher.getLinesByBox(this.srcId, this.destId, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable
        srcBox.disconnectedIo(this.srcOutlet, destBox.id, this.destInlet, this.id);
        destBox.disconnectedIo(this.destInlet, srcBox.id, this.srcOutlet, this.id);
        // srcBox.disconnectedOutlet(this.srcOutlet, destBox.id, this.destInlet, this.id);
        // destBox.disconnectedInlet(this.destInlet, srcBox.id, this.srcOutlet, this.id);
        return this;
    }
    enable(bool?: boolean): TargetLine {
        if (bool === false) return this.disable();
        if (!this.disabled) return this;
        const { srcBox, destBox } = this;
        if (this.srcOutlet >= srcBox.ios || this.destInlet >= destBox.ios) return this._patcher.deleteLine(this.id);
        if (this._patcher.getLinesByBox(this.srcId, this.destId, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable
        this.disabled = false;
        srcBox.connectedIo(this.srcOutlet, destBox.id, this.destInlet, this.id);
        destBox.connectedIo(this.destInlet, srcBox.id, this.srcOutlet, this.id);
        // srcBox.connectedOutlet(this.srcOutlet, destBox.id, this.destInlet, this.id);
        // destBox.connectedInlet(this.destInlet, srcBox.id, this.srcOutlet, this.id);
        return this;
    }
    destroy() {
        this.destBox.off("metaUpdated", this.updateType);
        this.srcBox.off("metaUpdated", this.updateType);
        this.disable();
        this.srcBox.removeLine(this);
        this.destBox.removeLine(this);
        // this.srcBox.removeOutletLine(this);
        // this.destBox.removeInletLine(this);
        delete this._patcher.lines[this.id];
        return this;
    }
    // pass(data: any) {
    //     this.emit("passData", data);
    //     return this.disabled ? this : this.destBox.fn(this.destInlet, data);
    // }
    get positionHash() {
        const { top, left } = this._patcher.boxes[this.dest[0]].getIoPos(this.dest[1]);
        return left * 65536 + top;
    }
    get srcPos() {
        return this._patcher.boxes[this.src[0]].getIoPos(this.src[1]);
    }
    get destPos() {
        return this._patcher.boxes[this.dest[0]].getIoPos(this.dest[1]);
    }
    get srcId() {
        return this.src[0];
    }
    get srcOutlet() {
        return this.src[1];
    }
    get destId() {
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
    private calcType() {
        const srcMeta = this.srcBox.object.meta.ios;
        const destMeta = this.destBox.object.meta.ios;
        let srcType: TMetaType = "anything";
        let destType: TMetaType = "anything";
        if (srcMeta[this.srcOutlet]) srcType = srcMeta[this.srcOutlet].type;
        else if (srcMeta[srcMeta.length - 1] && srcMeta[srcMeta.length - 1].varLength) srcType = srcMeta[srcMeta.length - 1].type;
        if (destMeta[this.destInlet]) destType = destMeta[this.destInlet].type;
        else if (destMeta[destMeta.length - 1] && destMeta[destMeta.length - 1].varLength) destType = destMeta[destMeta.length - 1].type;
        return srcType === "signal" && destType === "signal" ? "audio" : "normal";
    }
    updateType = () => {
        const type = this.calcType();
        if (type !== this._type) {
            this._type = type;
            this.emit("typeChanged", type);
        }
    };
    get type(): TLineType {
        return this._type;
    }
    toString() {
        return JSON.stringify(this.toSerializable());
    }
    toSerializable(): TLine {
        const { id, src, dest, disabled } = this;
        return { id, src: [...src], dest: [...dest], disabled };
    }
}
