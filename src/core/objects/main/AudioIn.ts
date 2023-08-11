import type { TAudioNodeOutletConnection } from "../../types";
import type { IArgsMeta, IOutletsMeta, IPropsMeta } from "../base/AbstractObject";
import DefaultObject from "../base/DefaultObject";

interface P {
    description: string;
}

export default class AudioIn extends DefaultObject<{}, {}, [], [any], [number], P> {
    static isPatcherInlet = "audio" as const;
    static package = "SubPatcher";
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
        type: "signal",
        description: ""
    }];
    static docs: string = "common/docs/AudioIn.html";
    outletAudioConnections: TAudioNodeOutletConnection[] = [{ node: undefined as GainNode, index: 0 }];
    private _duringInit = true;
    protected get index() {
        return Math.max(1, ~~this.box.args[0] || 1);
    }
    protected _ = { index: this.index };
    protected emitPatcherChangeIO = () => this.patcher.changeIO();
    subscribe() {
        super.subscribe();
        this.on("metaUpdated", this.emitPatcherChangeIO);
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 1;
        });
        this.on("postInit", () => {
            const { index } = this;
            this.patcher.connectAudioInlet(index - 1);
            this.disconnectAudio();
            if (!this.patcher.inletAudioConnections[index - 1]) {
                const node = this.audioCtx.createGain();
                node.channelInterpretation = "discrete";
                this.patcher.inletAudioConnections[index - 1] = { node, index: 0 };
            }
            const { node } = this.patcher.inletAudioConnections[index - 1];
            this.outletAudioConnections[0].node = node;
            const outlet0 = { ...this.meta.outlets[0] };
            const description = this.getProp("description");
            if (typeof description === "string") outlet0.description = description;
            this.setMeta({ outlets: [outlet0] });
            this._duringInit = false;
            this.connectAudio();
            this.patcher.connectAudioInlet(index - 1);
            this.patcher.inspectAudioIO();
            this.emitPatcherChangeIO();
        });
        this.on("updateArgs", () => {
            const { index } = this;
            if (index !== this._.index) {
                this._.index = index;
                this.patcher.disconnectAudioInlet(index - 1);
                this.disconnectAudio();
                if (!this.patcher.inletAudioConnections[index - 1]) {
                    const node = this.audioCtx.createGain();
                    node.channelInterpretation = "discrete";
                    this.patcher.inletAudioConnections[index - 1] = { node, index: 0 };
                }
                const { node } = this.patcher.inletAudioConnections[index - 1];
                this.outletAudioConnections[0].node = node;
                if (!this._duringInit) {
                    this.connectAudio();
                    this.patcher.connectAudioInlet(index - 1);
                    this.patcher.inspectAudioIO();
                    this.emitPatcherChangeIO();
                }
            }
        });
        this.on("updateProps", (props) => {
            const outlet0 = { ...this.meta.outlets[0] };
            if (typeof props.description === "string") outlet0.description = props.description;
            this.setMeta({ outlets: [outlet0] });
            this.emitPatcherChangeIO();
        });
        this.on("destroy", () => {
            this.patcher.inspectAudioIO();
            this.emitPatcherChangeIO();
        });
    }
}
