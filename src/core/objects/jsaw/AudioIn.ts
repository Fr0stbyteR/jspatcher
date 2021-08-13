import BaseObject from "../base/BaseObject";
import type { IArgsMeta, IOutletsMeta, IPropsMeta } from "../base/AbstractObject";
import type { PatcherEventMap } from "../../patcher/Patcher";

interface P {
    description: string;
}

export default class AudioIn extends BaseObject<{}, {}, [], [number, number], [number], P> {
    static isPatcherInlet = "audio" as const;
    static description = "Patcher inlet (audio)";
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
        }
    };
    static outlets: IOutletsMeta = [{
        type: "number",
        description: "Sample value"
    }, {
        type: "number",
        description: "Sample index"
    }];
    protected get index() {
        return Math.max(1, ~~this.box.args[0] || 1);
    }
    protected _ = { index: this.index };
    protected handlePatcherInput = ({ input, index, sample }: PatcherEventMap["audioInput"]) => {
        if (input === this.index - 1) this.outletAll([sample, index]);
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
            if (this.index !== this._.index) {
                this._.index = this.index;
                this.patcher.changeIO();
            }
        });
        this.on("updateProps", (props) => {
            const outlet0 = { ...this.meta.outlets[0] };
            if (typeof props.description === "string") outlet0.description = props.description;
            this.setMeta({ outlets: [outlet0] });
            this.emitPatcherChangeIO();
        });
        this.patcher.on("audioInput", this.handlePatcherInput);
        this.on("destroy", () => {
            this.patcher.off("audioInput", this.handlePatcherInput);
            this.patcher.changeIO();
        });
    }
}
