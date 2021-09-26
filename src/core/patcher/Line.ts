import type { WamNode } from "wamsdk";
import TypedEventEmitter from "../../utils/TypedEventEmitter";
import type Patcher from "./Patcher";
import type { TLine, TLineType } from "../types";
import type { IJSPatcherObject, TMetaType } from "../objects/base/AbstractObject";

export interface LineEventMap {
    "passData": any;
    "destPosChanged": { top: number; left: number };
    "srcPosChanged": { top: number; left: number };
    "posChanged": Line;
    "typeChanged": TLineType;
}

export default class Line extends TypedEventEmitter<LineEventMap> {
    static isConnectableByAudio(from: IJSPatcherObject, outlet: number, to: IJSPatcherObject, inlet: number) {
        const fromConnection = from?.outletAudioConnections[outlet];
        const toConnection = to?.inletAudioConnections[inlet];
        if (!fromConnection) return false;
        if (!toConnection) return false;
        if (!fromConnection.node) return false;
        if (!toConnection.node) return false;
        return true;
    }
    static isWamNode(x: any): x is WamNode {
        return typeof x === "object" && x !== null && x?.module?.isWebAudioModule;
    }
    static compare(line1: Line, line2: Line) {
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
            srcBox.addOutletLine(this);
        }
        if (destBox) {
            destBox.on("metaUpdated", this.updateType);
            destBox.addInletLine(this);
        }
    }
    get isConnectableByAudio() {
        if (this._patcher.props.mode !== "js") return false;
        return Line.isConnectableByAudio(this.srcBox.object, this.srcOutlet, this.destBox.object, this.destInlet);
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
        this.srcBox.removeOutletLine(this);
        this.src = [srcId, srcOutlet];
        this.srcBox.addOutletLine(this);
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
        this.destBox.removeInletLine(this);
        this.dest = [destId, destInlet];
        this.destBox.addInletLine(this);
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
    disable(bool?: boolean): Line {
        if (bool === false) return this.enable();
        if (this.disabled) return this;
        this.disabled = true;
        const { srcBox, destBox } = this;
        if (this._patcher.getLinesByBox(this.srcId, this.destId, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable
        if (this.isConnectableByAudio) {
            const from = this.srcBox.object.outletAudioConnections[this.srcOutlet];
            const to = this.destBox.object.inletAudioConnections[this.destInlet];
            if (from && to && from.node && to.node) {
                const isAudioParam = to.node instanceof AudioParam;
                try {
                    if (isAudioParam) from.node.disconnect(to.node as AudioParam, from.index);
                    else from.node.disconnect(to.node as AudioNode, from.index, to.index);
                    if (Line.isWamNode(from.node) && Line.isWamNode(to.node)) from.node.disconnectEvents(to.node);
                } catch (e) {
                    this._patcher.error((e as Error).message);
                }
            }
        }
        srcBox.disconnectedOutlet(this.srcOutlet, destBox.id, this.destInlet, this.id);
        destBox.disconnectedInlet(this.destInlet, srcBox.id, this.srcOutlet, this.id);
        return this;
    }
    enable(bool?: boolean): Line {
        if (bool === false) return this.disable();
        if (!this.disabled) return this;
        const { srcBox, destBox } = this;
        if (this.srcOutlet >= srcBox.outlets || this.destInlet >= destBox.inlets) return this._patcher.deleteLine(this.id);
        if (this._patcher.getLinesByBox(this.srcId, this.destId, this.srcOutlet, this.destInlet).length > 1) return this; // not last cable
        if (this.isConnectableByAudio) {
            const from = this.srcBox.object.outletAudioConnections[this.srcOutlet];
            const to = this.destBox.object.inletAudioConnections[this.destInlet];
            if (from && to && from.node && to.node) {
                const isAudioParam = to.node instanceof AudioParam;
                try {
                    if (isAudioParam) from.node.connect(to.node as AudioParam, from.index);
                    else from.node.connect(to.node as AudioNode, from.index, to.index);
                    if (Line.isWamNode(from.node) && Line.isWamNode(to.node)) from.node.connectEvents(to.node);
                } catch (e) {
                    this._patcher.error((e as Error).message);
                }
            }
        }
        srcBox.connectedOutlet(this.srcOutlet, destBox.id, this.destInlet, this.id);
        destBox.connectedInlet(this.destInlet, srcBox.id, this.srcOutlet, this.id);
        this.disabled = false;
        return this;
    }
    destroy() {
        this.destBox.off("metaUpdated", this.updateType);
        this.srcBox.off("metaUpdated", this.updateType);
        this.disable();
        this.srcBox.removeOutletLine(this);
        this.destBox.removeInletLine(this);
        delete this._patcher.lines[this.id];
        return this;
    }
    pass(data: any) {
        this.emit("passData", data);
        return this.disabled ? this : this.destBox.fn(this.destInlet, data);
    }
    get positionHash() {
        const { top, left } = this._patcher.boxes[this.dest[0]].getInletPos(this.dest[1]);
        return left * 65536 + top;
    }
    get srcPos() {
        return this._patcher.boxes[this.src[0]].getOutletPos(this.src[1]);
    }
    get destPos() {
        return this._patcher.boxes[this.dest[0]].getInletPos(this.dest[1]);
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
        const srcMeta = this.srcBox.object.meta.outlets;
        const destMeta = this.destBox.object.meta.inlets;
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
