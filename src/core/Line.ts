import Patcher from "./Patcher";
import { MappedEventEmitter } from "../utils/MappedEventEmitter";
import { LineEventMap, TLine, TLineType, TMetaType } from "./types";
import { BaseAudioObject, AnyObject } from "./objects/Base";

export default class Line extends MappedEventEmitter<LineEventMap> {
    static isConnectableByAudio(from: AnyObject, outlet: number, to: AnyObject, inlet: number) {
        if (!(from instanceof BaseAudioObject)) return false;
        if (!(to instanceof BaseAudioObject)) return false;
        const fromConnection = from.outletConnections[outlet];
        const toConnection = to.inletConnections[inlet];
        if (!fromConnection) return false;
        if (!toConnection) return false;
        if (!fromConnection.node) return false;
        if (!toConnection.node) return false;
        return true;
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
        if (srcBox) srcBox.object.on("metaChanged", this.updateType);
        if (destBox) destBox.object.on("metaChanged", this.updateType);
    }
    get isConnectableByAudio() {
        if (this._patcher.props.mode !== "js") return false;
        return Line.isConnectableByAudio(this.srcBox.object, this.srcOutlet, this.destBox.object, this.destInlet);
    }
    setSrc(src: [string, number]) {
        const srcID = src[0];
        const srcOutlet = src[1];
        if (srcID === this.src[0] && srcOutlet === this.src[1]) return this;
        this.srcBox.object.off("metaChanged", this.updateType);
        this.disable();
        this.src = [srcID, srcOutlet];
        this.enable();
        this.srcBox.object.on("metaChanged", this.updateType);
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
        this.destBox.object.off("metaChanged", this.updateType);
        this.disable();
        this.dest = [destID, destInlet];
        this.enable();
        this.destBox.object.on("metaChanged", this.updateType);
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
        if (this.isConnectableByAudio) {
            const from = (this.srcBox.object as BaseAudioObject).outletConnections[this.srcOutlet];
            const to = (this.destBox.object as BaseAudioObject).inletConnections[this.destInlet];
            if (from && to && from.node && to.node) {
                const isAudioParam = to.node instanceof AudioParam;
                try {
                    if (isAudioParam) from.node.disconnect(to.node as AudioParam, from.index);
                    else from.node.disconnect(to.node as AudioNode, from.index, to.index);
                } catch (e) {
                    this._patcher.error((e as Error).message);
                }
            }
        }
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
        if (this.isConnectableByAudio) {
            const from = (this.srcBox.object as BaseAudioObject).outletConnections[this.srcOutlet];
            const to = (this.destBox.object as BaseAudioObject).inletConnections[this.destInlet];
            if (from && to && from.node && to.node) {
                const isAudioParam = to.node instanceof AudioParam;
                try {
                    if (isAudioParam) from.node.connect(to.node as AudioParam, from.index);
                    else from.node.connect(to.node as AudioNode, from.index, to.index);
                } catch (e) {
                    this._patcher.error((e as Error).message);
                }
            }
        }
        srcBox.connectedOutlet(this.srcOutlet, destBox, this.destInlet, this.id);
        destBox.connectedInlet(this.destInlet, srcBox, this.srcOutlet, this.id);
        this.disabled = false;
        return this;
    }
    destroy() {
        this.destBox.object.off("metaChanged", this.updateType);
        this.srcBox.object.off("metaChanged", this.updateType);
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
    }
    get type(): TLineType {
        return this._type;
    }
}
