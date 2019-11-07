import { BaseObject, TMeta, Bang } from "../Base";
import Box from "../../Box";
import { TAudioNodeInletConnection, TAudioNodeOutletConnection } from "../../types";

export default abstract class JSPAudioNode<T extends AudioNode = AudioNode, S = {}, I extends [Bang?, ...any[]] = [], O extends (null | any | T)[] = [], A extends any[] = [], P = {}> extends BaseObject<{}, { node: T } & S, I, O, A, P> {
    static get _meta(): TMeta {
        return {
            ...super.meta,
            package: "WebAudio",
            icon: "volume up",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "WebAudio Nodes implementation"
        };
    }
    static hasAudioNode(o: any): o is AnyJSPAudioNode {
        if (!(o instanceof JSPAudioNode)) return false;
        if (!o.state.node) return false;
        if (!(o.state.node instanceof AudioNode)) return false;
        return true;
    }
    static isConnectable(from: any, outlet: number, to: any, inlet: number) {
        if (!this.hasAudioNode(from)) return false;
        if (!this.hasAudioNode(to)) return false;
        if (!from.outletConnections[outlet]) return false;
        if (!to.inletConnections[inlet]) return false;
        return true;
    }
    static applyCurve(param: AudioParam, curve: number[][], audioCtx: AudioContext) {
        param.cancelScheduledValues(audioCtx.currentTime);
        let t = 0;
        curve.forEach((a) => {
            if (a.length === 1) {
                param.setValueAtTime(a[0], audioCtx.currentTime + t);
            } else if (a.length > 1) {
                t += a[1];
                if (a.length === 3 && a[2] === 1) {
                    param.exponentialRampToValueAtTime(a[0], audioCtx.currentTime + t);
                } else {
                    param.linearRampToValueAtTime(a[0], audioCtx.currentTime + t);
                }
            }
        });
    }
    set node(nodeIn: T) {
        this.state.node = nodeIn;
    }
    get node() {
        return this.state.node;
    }
    get audioCtx() {
        return this.patcher._state.audioCtx;
    }
    inletConnections: TAudioNodeInletConnection[] = [];
    outletConnections: TAudioNodeOutletConnection[] = [];
    keepAlive() {}
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        const srcObj = srcBox.object;
        if (JSPAudioNode.isConnectable(srcObj, srcOutlet, this, inlet)) {
            const from = (srcObj as AnyJSPAudioNode).outletConnections[srcOutlet];
            const to = this.inletConnections[inlet];
            const isAudioParam = to.node instanceof AudioParam;
            if (isAudioParam) from.node.connect(to.node as AudioParam, from.index);
            else from.node.connect(to.node as AudioNode, from.index, to.index);
        }
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        const srcObj = srcBox.object;
        if (JSPAudioNode.isConnectable(srcObj, srcOutlet, this, inlet)) {
            const from = (srcObj as AnyJSPAudioNode).outletConnections[srcOutlet];
            const to = this.inletConnections[inlet];
            const isAudioParam = to.node instanceof AudioParam;
            if (isAudioParam) from.node.disconnect(to.node as AudioParam, from.index);
            else from.node.disconnect(to.node as AudioNode, from.index, to.index);
        }
        return this;
    }
    connectAll() {
        const inletLines = this.inletLines;
        for (let inlet = 0; inlet < this.inlets; inlet++) {
            for (let j = 0; j < inletLines[inlet].length; j++) {
                const line = this.patcher.lines[inletLines[inlet][j]];
                const { srcBox, srcOutlet, id } = line;
                this.connectedInlet(inlet, srcBox, srcOutlet, id);
            }
        }
        const outletLines = this.outletLines;
        for (let outlet = 0; outlet < this.outlets; outlet++) {
            for (let j = 0; j < outletLines[outlet].length; j++) {
                const line = this._patcher.lines[outletLines[outlet][j]];
                const { destBox, destInlet } = line;
                const destObj = destBox.object;
                if (JSPAudioNode.isConnectable(this, outlet, destObj, destInlet)) {
                    const from = this.outletConnections[outlet];
                    const to = (destObj as AnyJSPAudioNode).inletConnections[outlet];
                    const isAudioParam = to.node instanceof AudioParam;
                    if (isAudioParam) from.node.connect(to.node as AudioParam, from.index);
                    else from.node.connect(to.node as AudioNode, from.index, to.index);
                }
            }
        }
        return this;
    }
    disconnectAll() {
        const inletLines = this.inletLines;
        for (let inlet = 0; inlet < this.inlets; inlet++) {
            for (let j = 0; j < inletLines[inlet].length; j++) {
                const line = this.patcher.lines[inletLines[inlet][j]];
                const { srcBox, srcOutlet, id } = line;
                this.disconnectedInlet(inlet, srcBox, srcOutlet, id);
            }
        }
        const outletLines = this.outletLines;
        for (let outlet = 0; outlet < this.outlets; outlet++) {
            for (let j = 0; j < outletLines[outlet].length; j++) {
                const line = this._patcher.lines[outletLines[outlet][j]];
                const { destBox, destInlet } = line;
                const destObj = destBox.object;
                if (JSPAudioNode.isConnectable(this, outlet, destObj, destInlet)) {
                    const from = this.outletConnections[outlet];
                    const to = (destObj as AnyJSPAudioNode).inletConnections[outlet];
                    const isAudioParam = to.node instanceof AudioParam;
                    if (isAudioParam) from.node.disconnect(to.node as AudioParam, from.index);
                    else from.node.disconnect(to.node as AudioNode, from.index, to.index);
                }
            }
        }
        return this;
    }
}

declare class AnyJSPAudioNode extends JSPAudioNode<any, any, any, any, any, any> {}
