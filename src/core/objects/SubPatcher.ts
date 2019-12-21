import { DefaultObject, DefaultAudioObject } from "./Base";
import Patcher from "../Patcher";
import { TPatcherMode, TMeta, TMetaType, PatcherEventMap, TAudioNodeOutletConnection, TAudioNodeInletConnection } from "../types";

export class In extends DefaultObject<{}, { index: number }, [], [any], [number], { description: string; type: Exclude<TMetaType, "signal" | "enum"> }> {
    static description = "Patcher inlet (data)";
    static args: TMeta["args"] = [{
        type: "number",
        optional: false,
        default: 1,
        description: "Inlet index (1-based)"
    }];
    static props: TMeta["props"] = {
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
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: ""
    }];
    _meta: TMeta = In.meta;
    state = { index: undefined as number };
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
        this.patcher.changeIO();
    }
    handlePatcherInlet = ({ data, inlet }: PatcherEventMap["inlet"]) => {
        if (inlet === this.state.index) this.outlet(0, data);
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            const $ = Math.max(1, ~~args[0]);
            if ($ !== this.state.index) {
                this.state.index = $;
                this.box.args[0] = $;
                this.patcher.changeIO();
            }
        });
        this.on("updateProps", (props) => {
            if (typeof props.description === "string") this._meta.outlets[0].description = props.description;
            if (typeof props.type === "string") this._meta.outlets[0].type = props.type || "anything";
            this.meta = this._meta;
        });
        this.patcher.on("inlet", this.handlePatcherInlet);
        this.on("destroy", () => {
            this.patcher.off("inlet", this.handlePatcherInlet);
            this.patcher.changeIO();
        });
    }
}

export class Out extends DefaultObject<{}, { index: number }, [any], [], [number], { description: string; type: Exclude<TMetaType, "signal" | "enum"> }> {
    static description = "Patcher outlet (data)";
    static args: TMeta["args"] = [{
        type: "number",
        optional: false,
        default: 1,
        description: "Outlet index (1-based)"
    }];
    static props: TMeta["props"] = {
        description: {
            type: "string",
            default: "",
            description: "Description text"
        },
        type: {
            type: "enum",
            enums: ["string", "number", "boolean", "object", "function", "anything", "bang", "color"],
            default: "anything",
            description: "Outlet data type"
        }
    };
    static inlets: TMeta["inlets"] = [{
        type: "anything",
        description: "",
        isHot: true
    }];
    _meta: TMeta = Out.meta;
    state = { index: undefined as number };
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
        this.patcher.changeIO();
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            const $ = Math.max(1, ~~args[0]);
            if ($ !== this.state.index) {
                this.state.index = $;
                this.box.args[0] = $;
                this.patcher.changeIO();
            }
        });
        this.on("updateProps", (props) => {
            if (typeof props.description === "string") this._meta.inlets[0].description = props.description;
            if (typeof props.type === "string") this._meta.inlets[0].type = props.type || "anything";
            this.meta = this._meta;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) this.patcher.outlet(this.box.args[0], data);
        });
        this.on("destroy", () => {
            this.patcher.changeIO();
        });
    }
}

export class AudioIn extends DefaultAudioObject<{}, { index: number }, [], [any], [number], { description: string }> {
    static description = "Patcher inlet (audio)";
    static args: TMeta["args"] = [{
        type: "number",
        optional: false,
        default: 1,
        description: "Inlet index (1-based)"
    }];
    static props: TMeta["props"] = {
        description: {
            type: "string",
            default: "",
            description: "Description text"
        }
    }
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: ""
    }];
    outletConnections: TAudioNodeOutletConnection[] = [{ node: undefined as GainNode, index: 0 }];
    _meta: TMeta = AudioIn.meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
        this.patcher.changeIO();
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            const $ = Math.max(1, ~~args[0]);
            if ($ !== this.state.index) {
                this.patcher.disconnectAudioInlet(this.state.index);
                this.disconnectAudio();
                this.state.index = $;
                this.box.args[0] = $;
                if (!this.patcher.inletAudioConnections[$ - 1]) {
                    const node = this.audioCtx.createGain();
                    node.channelInterpretation = "discrete";
                    node.channelCountMode = "explicit";
                    this.patcher.inletAudioConnections[$ - 1] = { node, index: 0 };
                }
                const { node } = this.patcher.inletAudioConnections[$ - 1];
                this.outletConnections[0].node = node;
                this.connectAudio();
                this.patcher.changeIO();
                this.patcher.connectAudioInlet($ - 1);
                this.patcher.inspectAudioIO();
            }
        });
        this.on("updateProps", (props) => {
            if (typeof props.description === "string") this._meta.outlets[0].description = props.description;
            this.meta = this._meta;
        });
        this.on("destroy", () => {
            this.patcher.inspectAudioIO();
            this.patcher.changeIO();
        });
    }
}

export class AudioOut extends DefaultAudioObject<{}, { index: number }, [any], [], [number], { description: string }> {
    static description = "Patcher outlet (audio)";
    static args: TMeta["args"] = [{
        type: "number",
        optional: false,
        default: 1,
        description: "Outlet index (1-based)"
    }];
    static props: TMeta["props"] = {
        description: {
            type: "string",
            default: "",
            description: "Description text"
        }
    }
    static inlets: TMeta["inlets"] = [{
        type: "signal",
        description: "",
        isHot: true
    }];
    inletConnections: TAudioNodeInletConnection[] = [{ node: undefined as GainNode, index: 0 }];
    _meta: TMeta = AudioOut.meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
        this.patcher.changeIO();
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            const $ = Math.max(1, ~~args[0]);
            if ($ !== this.state.index) {
                this.patcher.disconnectAudioOutlet(this.state.index);
                this.disconnectAudio();
                this.state.index = $;
                this.box.args[0] = $;
                if (!this.patcher.outletAudioConnections[$ - 1]) {
                    const node = this.audioCtx.createGain();
                    node.channelInterpretation = "discrete";
                    node.channelCountMode = "explicit";
                    this.patcher.outletAudioConnections[$ - 1] = { node, index: 0 };
                }
                const { node } = this.patcher.outletAudioConnections[$ - 1];
                this.inletConnections[0].node = node;
                this.connectAudio();
                this.patcher.changeIO();
                this.patcher.connectAudioInlet($ - 1);
                this.patcher.inspectAudioIO();
            }
        });
        this.on("updateProps", (props) => {
            if (typeof props.description === "string") this._meta.outlets[0].description = props.description;
            this.meta = this._meta;
        });
        this.on("destroy", () => {
            this.patcher.inspectAudioIO();
            this.patcher.changeIO();
        });
    }
}

export type TSubPatchersMap = { [key: string]: Patcher };
const subPatchersMap: TSubPatchersMap = {};

type TSubPatcherState = { map: TSubPatchersMap; key: string; mode: TPatcherMode };
export class patcher extends DefaultAudioObject<Patcher, TSubPatcherState, any[], any[], [TPatcherMode, string]> {
    static description = "Sub-patcher";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "js",
        description: "Mode of the subpatcher"
    }, {
        type: "enum",
        enums: ["js", "max", "gen", "faust"],
        optional: true,
        default: "js",
        description: "Mode of the subpatcher"
    }];
    state: TSubPatcherState = { map: subPatchersMap, key: "", mode: "js" };
    _meta: TMeta = AudioOut.meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
    }
    subscribe() {
        super.subscribe();
        const handlePatcherOutlet = ({ outlet, data }: PatcherEventMap["outlet"]) => this.outlet(outlet, data);
        const handlePatcherDisconnectAudioInlet = (port: number) => this.disconnectAudioInlet(port);
        const handlePatcherDisconnectAudioOutlet = (port: number) => this.disconnectAudioOutlet(port);
        const handlePatcherConnectAudioInlet = (port: number) => this.connectAudioInlet(port);
        const handlePatcherConnectAudioOutlet = (port: number) => this.connectAudioOutlet(port);
        const handlePatcherIOChanged = (meta: TMeta) => this.meta = { ...this._meta, ...meta, args: patcher.args };
        const subscribePatcher = () => {
            const patcher = this.data;
            patcher.on("outlet", handlePatcherOutlet);
            patcher.on("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
            patcher.on("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
            patcher.on("connectAudioInlet", handlePatcherConnectAudioInlet);
            patcher.on("connectAudioOutlet", handlePatcherConnectAudioOutlet);
            patcher.on("ioChanged", handlePatcherIOChanged);
        };
        const unsubscribePatcher = () => {
            const patcher = this.data;
            if (!patcher) return;
            patcher.off("outlet", handlePatcherOutlet);
            patcher.off("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
            patcher.off("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
            patcher.off("connectAudioInlet", handlePatcherConnectAudioInlet);
            patcher.off("connectAudioOutlet", handlePatcherConnectAudioOutlet);
            patcher.off("ioChanged", handlePatcherIOChanged);
        };
        const handlePatcherReset = () => {
            this.meta = { ...this._meta, ...this.data.meta, args: patcher.args };
        };
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 0;
        });
        this.on("postInit", () => {
            if (!(this.data instanceof Patcher)) {
                const patcher = new Patcher(this.patcher.env);
                patcher.load({}, this.state.mode);
                this.data = patcher;
                handlePatcherReset();
                subscribePatcher();
                this.connectAudio();
            }
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "string") {
                const newKey = args[0] || "";
                if (newKey !== this.state.key) {
                    unsubscribePatcher();
                    this.disconnectAudio();
                    if (!this.state.map[newKey]) {
                        const patcher = new Patcher(this.patcher.env);
                        patcher.load({}, this.state.mode);
                        if (newKey) this.state.map[newKey] = patcher;
                        this.data = patcher;
                    } else {
                        this.data = this.state.map[newKey];
                    }
                    handlePatcherReset();
                    subscribePatcher();
                    this.connectAudio();
                    this.state.key = newKey;
                }
            }
            if (["js", "max", "gen", "faust"].indexOf(args[1]) >= 0) this.state.mode = args[1] as TPatcherMode;
        });
    }
}

export default {
    in: In,
    out: Out,
    "in~": AudioIn,
    "out~": AudioOut,
    patcher
};
