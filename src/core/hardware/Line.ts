import type { WamNode } from "@webaudiomodules/api";
import TypedEventEmitter from "../../utils/TypedEventEmitter";
import type Patcher from "./Patcher";
import type { THardwareLine, THardwareLineType } from "./types";
import type { IJSPatcherObject, TMetaType } from "../objects/base/AbstractObject";

export interface HardwareLineEventMap {
    "passData": any;
    "bPosChanged": { top: number; left: number };
    "aPosChanged": { top: number; left: number };
    "posChanged": HardwareLine;
    "typeChanged": THardwareLineType;
}

export default class HardwareLine extends TypedEventEmitter<HardwareLineEventMap> {
    static compare(line1: HardwareLine, line2: HardwareLine) {
        return line2.positionHash - line1.positionHash;
    }
    readonly id: string;
    aIo: [string, number];
    bIo: [string, number];
    disabled = true;
    private _type: THardwareLineType;
    private readonly _patcher: Patcher;
    constructor(patcherIn: Patcher, lineIn: THardwareLine) {
        super();
        this.id = lineIn.id;
        this.aIo = lineIn.aIo;
        this.bIo = lineIn.bIo;
        this.disabled = true;
        this._patcher = patcherIn;
        const { aBox, bBox } = this;
        this._type = this.calcType();
        if (aBox) {
            aBox.on("metaUpdated", this.updateType);
            aBox.addIoLine(this, true);
        }
        if (bBox) {
            bBox.on("metaUpdated", this.updateType);
            bBox.addIoLine(this, false);
        }
    }
    get presentation() {
        return this.aBox && this.aBox.presentation && this.bBox && this.bBox.presentation;
    }
    setA(a: [string, number]) {
        const aId = a[0];
        const aIo = a[1];
        if (aId === this.aIo[0] && aIo === this.aIo[1]) return this;
        this.aBox.off("metaUpdated", this.updateType);
        this.disable();
        this.aBox.removeIoLine(this, true);
        this.aIo = [aId, aIo];
        this.aBox.addIoLine(this, true);
        this.enable();
        this.aBox.on("metaUpdated", this.updateType);
        this.updateType();
        return this.uiUpdateA();
    }
    getA() {
        return this.aIo;
    }
    uiUpdateA() {
        this.emit("aPosChanged", this.aPos);
        return this;
    }
    setB(b: [string, number]) {
        const bId = b[0];
        const bIo = b[1];
        if (bId === this.bIo[0] && bIo === this.bIo[1]) return this;
        this.aBox.off("metaUpdated", this.updateType);
        this.disable();
        this.bBox.removeIoLine(this, false);
        this.bIo = [bId, bIo];
        this.bBox.removeIoLine(this, false);
        this.enable();
        this.bBox.on("metaUpdated", this.updateType);
        this.updateType();
        return this.uiUpdateB();
    }
    getB() {
        return this.aIo;
    }
    uiUpdateB() {
        this.emit("bPosChanged", this.bPos);
        return this;
    }
    disable(bool?: boolean): HardwareLine {
        if (bool === false)
            return this.enable();
        if (this.disabled)
            return this;
        this.disabled = true;
        const { aBox, bBox } = this;
        if (this._patcher.getLinesByBox(this.aId, this.bId, this.aIo[1], this.bIo[1]).length > 1)
            return this; // not last cable
        aBox.disconnectedIo(this.aIo[1], this.bIo[1], bBox.id, this.id);
        bBox.disconnectedIo(this.bIo[1], this.aIo[1], aBox.id, this.id);
        return this;
    }
    enable(bool?: boolean): HardwareLine {
        if (bool === false)
            return this.disable();
        if (!this.disabled)
            return this;
        const { aBox, bBox } = this;
        if (this.aIo[1] >= aBox.ios.length || this.bIo[1] >= bBox.ios.length)
            return this._patcher.deleteLine(this.id);
        if (this._patcher.getLinesByBox(this.aId, this.bId, this.aIo[1], this.bIo[1]).length > 1)
            return this; // not last cable
        this.disabled = false;
        aBox.connectedIo(this.aIo[1], this.bIo[1], bBox.id, this.id);
        bBox.connectedIo(this.bIo[1], this.aIo[1], aBox.id, this.id);
        return this;
    }
    destroy() {
        this.bBox.off("metaUpdated", this.updateType);
        this.aBox.off("metaUpdated", this.updateType);
        this.disable();
        this.aBox.removeIoLine(this, true);
        this.bBox.removeIoLine(this, false);
        delete this._patcher.lines[this.id];
        return this;
    }
    pass(data: any) {
        this.emit("passData", data);
        return this.disabled ? this : this.bBox.fn(this.bIo[1], data);
    }
    get positionHash() {
        const { top, left } = this._patcher.boxes[this.bIo[0]].getIoPos(this.bIo[1]);
        return left * 65536 + top;
    }
    get aPos() {
        return this._patcher.boxes[this.aIo[0]].getIoPos(this.aIo[1]);
    }
    get bPos() {
        return this._patcher.boxes[this.bIo[0]].getIoPos(this.bIo[1]);
    }
    get aId() {
        return this.aIo[0];
    }
    // get srcOutlet() {
    //     return this.src[1];
    // }
    get bId() {
        return this.bIo[0];
    }
    // get destInlet() {
    //     return this.bIo[1];
    // }
    get aBox() {
        return this._patcher.boxes[this.aIo[0]];
    }
    get bBox() {
        return this._patcher.boxes[this.bIo[0]];
    }
    private calcType() {
        // const srcMeta = this.srcBox.object.meta.outlets;
        // const destMeta = this.destBox.object.meta.inlets;
        // let srcType: TMetaType = "anything";
        // let destType: TMetaType = "anything";
        // if (srcMeta[this.srcOutlet]) srcType = srcMeta[this.srcOutlet].type;
        // else if (srcMeta[srcMeta.length - 1] && srcMeta[srcMeta.length - 1].varLength) srcType = srcMeta[srcMeta.length - 1].type;
        // if (destMeta[this.destInlet]) destType = destMeta[this.destInlet].type;
        // else if (destMeta[destMeta.length - 1] && destMeta[destMeta.length - 1].varLength) destType = destMeta[destMeta.length - 1].type;
        // return srcType === "signal" && destType === "signal" ? "audio" : "normal";

        // TODO -- complete this implementation
        return "analog" as THardwareLineType;
    }
    updateType = () => {
        const type = this.calcType();
        if (type !== this._type) {
            this._type = type;
            this.emit("typeChanged", type);
        }
    };
    get type(): THardwareLineType {
        return this._type;
    }
    toString() {
        return JSON.stringify(this.toSerializable());
    }
    toSerializable(): THardwareLine {
        const { id, aIo, bIo, disabled } = this;
        return { id, aIo: [...aIo], bIo: [...bIo], disabled };
    }
}
