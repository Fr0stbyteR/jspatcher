import BaseObject from "../base/BaseObject";
import type { IArgsMeta, IOutletsMeta, IPropsMeta } from "../base/AbstractObject";
import type { PatcherEventMap } from "../../patcher/Patcher";

interface P {
    description: string;
}

export default class Param extends BaseObject<{}, {}, [], [Float32Array], [string], P> {
    static description = "Patcher outlet (data)";
    static args: IArgsMeta = [{
        type: "string",
        optional: false,
        default: "",
        description: "Parameter name"
    }];
    static props: IPropsMeta<P> = {
        description: {
            type: "string",
            default: "",
            description: "Description text"
        }
    };
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: ""
    }];
    protected handlePatcherInput = ({ param, buffer }: PatcherEventMap["paramInput"]) => {
        if (this.args[0] === param) this.outlet(0, buffer);
    };
    protected emitPatcherChangeIO = () => this.patcher.changeIO();
    subscribe() {
        super.subscribe();
        this.on("metaUpdated", this.emitPatcherChangeIO);
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 1;
        });
        this.on("postInit", this.emitPatcherChangeIO);
        this.on("updateArgs", this.emitPatcherChangeIO);
        this.on("updateProps", (props) => {
            const outlet0 = { ...this.meta.outlets[0] };
            if (typeof props.description === "string") outlet0.description = props.description;
            this.setMeta({ outlets: [outlet0] });
            this.emitPatcherChangeIO();
        });
        if (this.env.thread === "AudioWorklet") this.patcher.on("paramInput", this.handlePatcherInput);
        this.on("destroy", () => {
            this.patcher.off("paramInput", this.handlePatcherInput);
            this.patcher.changeIO();
        });
    }
}
