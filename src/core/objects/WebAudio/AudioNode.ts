import { BaseObject, TMeta } from "../Base";
import Box from "../../Box";

export default abstract class JSPAudioNode<T extends AudioNode = AudioNode, S = {}, I extends "signal"[] = [], O extends ("signal" | "object")[] = [], A extends any[] = [], P = {}> extends BaseObject<{}, { node: T } & S, I, O, A, P> {
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
        if (outlet >= from.state.node.numberOfOutputs) return false;
        if (inlet >= to.state.node.numberOfInputs) return false;
        return true;
    }
    keepAlive() {}
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        const srcObj = srcBox.object;
        if (JSPAudioNode.isConnectable(srcObj, srcOutlet, this, inlet)) srcObj.state.node.connect(this.state.node, srcOutlet, inlet);
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        const srcObj = srcBox.object;
        if (JSPAudioNode.isConnectable(srcObj, srcOutlet, this, inlet)) srcObj.state.node.disconnect(this.state.node, srcOutlet, inlet);
        return this;
    }
    connectAll() {
        const inletLines = this.inletLines;
        for (let inlet = 0; inlet < this.inlets; inlet++) {
            for (let j = 0; j < inletLines[inlet].length; j++) {
                const line = this.patcher.lines[inletLines[inlet][j]];
                const srcObj = line.srcBox.object;
                const srcOutlet = line.srcOutlet;
                if (JSPAudioNode.isConnectable(srcObj, srcOutlet, this, inlet)) srcObj.state.node.connect(this.state.node, srcOutlet, inlet);
            }
        }
        const outletLines = this.outletLines;
        for (let outlet = 0; outlet < this.outlets; outlet++) {
            for (let j = 0; j < outletLines[outlet].length; j++) {
                const line = this._patcher.lines[outletLines[outlet][j]];
                const destObj = line.destBox.object;
                const destInlet = line.destInlet;
                if (JSPAudioNode.isConnectable(this, outlet, destObj, destInlet)) this.state.node.connect(destObj.state.node, outlet, destInlet);
            }
        }
        return this;
    }
    disconnectAll() {
        const inletLines = this.inletLines;
        for (let inlet = 0; inlet < this.inlets; inlet++) {
            for (let j = 0; j < inletLines[inlet].length; j++) {
                const line = this.patcher.lines[inletLines[inlet][j]];
                const srcObj = line.srcBox.object;
                const srcOutlet = line.srcOutlet;
                if (JSPAudioNode.isConnectable(srcObj, srcOutlet, this, inlet)) srcObj.state.node.disconnect(this.state.node, srcOutlet, inlet);
            }
        }
        const outletLines = this.outletLines;
        for (let outlet = 0; outlet < this.outlets; outlet++) {
            for (let j = 0; j < outletLines[outlet].length; j++) {
                const line = this._patcher.lines[outletLines[outlet][j]];
                const destObj = line.destBox.object;
                const destInlet = line.destInlet;
                if (JSPAudioNode.isConnectable(this, outlet, destObj, destInlet)) this.state.node.disconnect(destObj.state.node, outlet, destInlet);
            }
        }
        return this;
    }
}

declare class AnyJSPAudioNode extends JSPAudioNode<any, any, any, any, any, any> {}
