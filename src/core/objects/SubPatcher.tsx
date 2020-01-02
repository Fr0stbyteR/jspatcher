import * as React from "react";
import { StrictModalProps, Modal } from "semantic-ui-react";
import { DefaultObject, DefaultAudioObject } from "./Base";
import Patcher from "../Patcher";
import { TPatcherMode, TMeta, TMetaType, PatcherEventMap, TAudioNodeOutletConnection, TAudioNodeInletConnection } from "../types";
import { DefaultPopupUI, DefaultPopupUIState } from "./BaseUI";
import UI from "../../components/UI";
import "./SubPatcher.scss";

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
        if (inlet === this.state.index - 1) this.outlet(0, data);
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 1;
        });
        this.on("postInit", () => this.patcher.changeIO());
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
        this.on("postInit", () => this.patcher.changeIO());
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
            if (inlet === 0) this.patcher.outlet(this.state.index - 1, data);
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
    _duringInit = true;
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
            this.inlets = 0;
            this.outlets = 1;
        });
        this.on("postInit", () => {
            this._duringInit = false;
            this.connectAudio();
            this.patcher.changeIO();
            this.patcher.connectAudioInlet(this.state.index - 1);
            this.patcher.inspectAudioIO();
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
                    this.patcher.inletAudioConnections[$ - 1] = { node, index: 0 };
                }
                const { node } = this.patcher.inletAudioConnections[$ - 1];
                this.outletConnections[0].node = node;
                if (!this._duringInit) {
                    this.connectAudio();
                    this.patcher.changeIO();
                    this.patcher.connectAudioInlet($ - 1);
                    this.patcher.inspectAudioIO();
                }
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
    _duringInit = true;
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
        this.on("postInit", () => {
            this._duringInit = false;
            this.connectAudio();
            this.patcher.changeIO();
            this.patcher.connectAudioInlet(this.state.index - 1);
            this.patcher.inspectAudioIO();
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
                    this.patcher.outletAudioConnections[$ - 1] = { node, index: 0 };
                }
                const { node } = this.patcher.outletAudioConnections[$ - 1];
                this.inletConnections[0].node = node;
                if (!this._duringInit) {
                    this.connectAudio();
                    this.patcher.changeIO();
                    this.patcher.connectAudioOutlet($ - 1);
                    this.patcher.inspectAudioIO();
                }
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

export class SubPatcherUI extends DefaultPopupUI<patcher, {}, { patcher: Patcher }> {
    state: { patcher: Patcher } & DefaultPopupUIState = {
        ...this.state,
        patcher: this.object.data
    }
    render() {
        const children = (
            <>
                <Modal.Content style={{ height: "100%" }}>
                    <div style={{ height: "100%", width: "100%", display: "flex" }}>
                        <UI patcher={this.state.patcher} />
                    </div>
                </Modal.Content>
            </>
        );
        const containerProps = { ...this.props.containerProps };
        if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;
        const modalProps: StrictModalProps & { onKeyDown: any } = { ...this.props.modalProps, children, className: "subpatcher", open: this.state.modalOpen, onClose: this.handleClose, onKeyDown: undefined, basic: true, size: "fullscreen", closeIcon: true };
        return <DefaultPopupUI {...this.props} modalProps={modalProps} containerProps={containerProps} />;
    }
}
type TSubPatcherState = { map: TSubPatchersMap; key: string; mode: TPatcherMode };
export class patcher extends DefaultAudioObject<Patcher, TSubPatcherState, any[], any[], [TPatcherMode, string], {}, { patcher: Patcher }> {
    static description = "Sub-patcher";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }, { // TODO Separate other modes
        type: "enum",
        enums: ["js", "max", "gen", "faust"],
        optional: true,
        default: "js",
        description: "Mode of the subpatcher"
    }];
    state: TSubPatcherState = { map: subPatchersMap, key: "", mode: "js" };
    _meta: TMeta = patcher.meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
    }
    uiComponent = SubPatcherUI;
    subscribe() {
        super.subscribe();
        const handlePatcherOutlet = ({ outlet, data }: PatcherEventMap["outlet"]) => this.outlet(outlet, data);
        const handlePatcherDisconnectAudioInlet = (port: number) => this.disconnectAudioInlet(port);
        const handlePatcherDisconnectAudioOutlet = (port: number) => this.disconnectAudioOutlet(port);
        const handlePatcherConnectAudioInlet = (port: number) => this.connectAudioInlet(port);
        const handlePatcherConnectAudioOutlet = (port: number) => this.connectAudioOutlet(port);
        const handlePatcherIOChanged = (meta: TMeta) => {
            this.inletConnections = this.data.inletAudioConnections.slice();
            this.outletConnections = this.data.outletAudioConnections.slice();
            this.inlets = meta.inlets.length;
            this.outlets = meta.outlets.length;
            const { inlets, outlets } = meta;
            this.meta = { ...this._meta, inlets, outlets, args: patcher.args };
        };
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
            if (!(this.data instanceof Patcher)) return;
            patcher.off("outlet", handlePatcherOutlet);
            patcher.off("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
            patcher.off("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
            patcher.off("connectAudioInlet", handlePatcherConnectAudioInlet);
            patcher.off("connectAudioOutlet", handlePatcherConnectAudioOutlet);
            patcher.off("ioChanged", handlePatcherIOChanged);
        };
        const handlePatcherReset = () => {
            handlePatcherIOChanged(this.data.meta);
            this.updateUI({ patcher: this.data });
        };
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 0;
            if (this.data.boxes) {
                const patcher = new Patcher(this.patcher.env);
                this.data = patcher;
                patcher.load(this.data);
            }
        });
        this.on("postInit", async () => {
            if (!(this.data instanceof Patcher)) {
                const patcher = new Patcher(this.patcher.env);
                this.data = patcher;
                await patcher.load({}, this.state.mode);
            }
            handlePatcherReset();
            subscribePatcher();
            this.connectAudio();
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
        this.on("inlet", ({ data, inlet }) => this.data.fn(data, inlet));
    }
}

export default {
    in: In,
    out: Out,
    "in~": AudioIn,
    "out~": AudioOut,
    patcher
};
