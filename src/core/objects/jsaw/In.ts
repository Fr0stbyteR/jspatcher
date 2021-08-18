import BaseObject from "../base/BaseObject";
import type { IArgsMeta, IOutletsMeta, IPropsMeta, TMetaType } from "../base/AbstractObject";
import type { PatcherEventMap } from "../../patcher/Patcher";

interface P {
    description: string;
    type: Exclude<TMetaType, "signal" | "enum">;
}

export default class In extends BaseObject<{}, {}, [], [any], [number], P> {
    static isPatcherInlet = "data" as const;
    static description = "Patcher inlet (data)";
    static args: IArgsMeta = [{
        type: "number",
        optional: false,
        default: 1,
        description: "Inlet index (1-based)"
    }];
    static props: IPropsMeta<P> = {
        description: {
            type: "string",
            default: "",
            description: "Description text"
        },
        type: {
            type: "enum",
            enums: ["string", "number", "boolean", "object", "function", "anything", "bang", "color"],
            default: "anything",
            description: "Inlet data type"
        }
    };
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: ""
    }];
    protected get index() {
        return Math.max(1, ~~this.box.args[0] || 1);
    }
    protected _ = { index: this.index };
    protected handlePatcherInput = ({ data, inlet }: PatcherEventMap["dataInput"]) => {
        if (inlet === this.index - 1) this.outlet(0, data);
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
        this.on("updateArgs", () => {
            const { index } = this;
            if (index !== this._.index) {
                this._.index = index;
                this.patcher.changeIO();
            }
        });
        this.on("updateProps", (props) => {
            const outlet0 = { ...this.meta.outlets[0] };
            if (typeof props.description === "string") outlet0.description = props.description;
            if (typeof props.type === "string") outlet0.type = props.type || "anything";
            this.setMeta({ outlets: [outlet0] });
            this.emitPatcherChangeIO();
        });
        if (this.env.thread === "AudioWorklet") this.patcher.on("dataInput", this.handlePatcherInput);
        this.on("destroy", () => {
            this.patcher.off("dataInput", this.handlePatcherInput);
            this.patcher.changeIO();
        });
    }
}
