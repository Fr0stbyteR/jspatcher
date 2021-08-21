import type { TAudioNodeInletConnection } from "../../types";
import type { IArgsMeta, IInletsMeta, IPropsMeta } from "../base/AbstractObject";
import DefaultObject from "../base/DefaultObject";

export default class AudioOut extends DefaultObject<{}, { index: number }, [any], [], [number], { description: string }> {
    static package = "SubPatcher";
    static description = "Patcher outlet (audio)";
    static args: IArgsMeta = [{
        type: "number",
        optional: false,
        default: 1,
        description: "Outlet index (1-based)"
    }];
    static props: IPropsMeta = {
        description: {
            type: "string",
            default: "",
            description: "Description text"
        }
    };
    static inlets: IInletsMeta = [{
        type: "signal",
        description: "",
        isHot: true
    }];
    inletAudioConnections: TAudioNodeInletConnection[] = [{ node: undefined as GainNode, index: 0 }];
    private _duringInit = true;
    protected get index() {
        return Math.max(1, ~~this.box.args[0] || 1);
    }
    protected _ = { index: this.index };
    protected emitPatcherChangeIO = () => {
        this.patcher.inspectAudioIO();
        this.patcher.changeIO();
    };
    subscribe() {
        super.subscribe();
        this.on("metaUpdated", this.emitPatcherChangeIO);
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("postInit", () => {
            this._duringInit = false;
            this.connectAudio();
            this.patcher.connectAudioInlet(this.state.index - 1);
            this.emitPatcherChangeIO();
        });
        this.on("updateArgs", () => {
            const { index } = this;
            if (index !== this._.index) {
                this._.index = index;
                this.patcher.disconnectAudioOutlet(index - 1);
                this.disconnectAudio();
                if (!this.patcher.outletAudioConnections[index - 1]) {
                    const node = this.audioCtx.createGain();
                    node.channelInterpretation = "discrete";
                    this.patcher.outletAudioConnections[index - 1] = { node, index: 0 };
                }
                const { node } = this.patcher.outletAudioConnections[index - 1];
                this.inletAudioConnections[0].node = node;
                if (!this._duringInit) {
                    this.connectAudio();
                    this.patcher.connectAudioOutlet(index - 1);
                    this.emitPatcherChangeIO();
                }
            }
        });
        this.on("updateProps", (props) => {
            const inlet0 = { ...this.meta.inlets[0] };
            if (typeof props.description === "string") inlet0.description = props.description;
            this.setMeta({ inlets: [inlet0] });
            this.emitPatcherChangeIO();
        });
        this.on("destroy", () => {
            this.emitPatcherChangeIO();
        });
    }
}
