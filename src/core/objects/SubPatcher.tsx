import * as React from "react";
import { StrictModalProps, Modal } from "semantic-ui-react";
import { DefaultObject, DefaultAudioObject, BaseAudioObject } from "./Base";
import Patcher from "../patcher/Patcher";
import { TMeta, TMetaType, PatcherEventMap, TAudioNodeOutletConnection, TAudioNodeInletConnection, RawPatcher, PatcherMode } from "../types";
import { DefaultPopupUI, DefaultPopupUIState, BaseUI, BaseUIState } from "./BaseUI";
import "./SubPatcher.scss";
import FaustNode, { FaustNodeState } from "./faust/FaustNode";
import PatcherUI from "../../components/PatcherUI";
import PatcherEditorUI from "../../components/editors/PatcherEditorUI";
import LeftMenu from "../../components/leftmenu/LeftMenu";
import PatcherFile from "../patcher/PatcherFile";

export class In extends DefaultObject<{}, { index: number }, [], [any], [number], { description: string; type: Exclude<TMetaType, "signal" | "enum"> }> {
    static package = "SubPatcher";
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
    state = { index: undefined as number };
    handlePatcherInlet = ({ data, inlet }: PatcherEventMap["inlet"]) => {
        if (inlet === this.state.index - 1) this.outlet(0, data);
    };
    subscribe() {
        super.subscribe();
        this.on("metaChanged", () => this.patcher.changeIO());
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
            const { meta } = this;
            if (typeof props.description === "string") meta.outlets[0].description = props.description;
            if (typeof props.type === "string") meta.outlets[0].type = props.type || "anything";
            this.meta = meta;
        });
        this.patcher.on("inlet", this.handlePatcherInlet);
        this.on("destroy", () => {
            this.patcher.off("inlet", this.handlePatcherInlet);
            this.patcher.changeIO();
        });
    }
}

export class Out extends DefaultObject<{}, { index: number }, [any], [], [number], { description: string; type: Exclude<TMetaType, "signal" | "enum"> }> {
    static package = "SubPatcher";
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
    state = { index: undefined as number };
    subscribe() {
        super.subscribe();
        this.on("metaChanged", () => this.patcher.changeIO());
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
            const { meta } = this;
            if (typeof props.description === "string") meta.inlets[0].description = props.description;
            if (typeof props.type === "string") meta.inlets[0].type = props.type || "anything";
            this.meta = meta;
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
    static package = "SubPatcher";
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
    };
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: ""
    }];
    outletConnections: TAudioNodeOutletConnection[] = [{ node: undefined as GainNode, index: 0 }];
    _duringInit = true;
    state = { index: undefined as number };
    subscribe() {
        super.subscribe();
        this.on("metaChanged", () => this.patcher.changeIO());
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
            const { meta } = this;
            if (typeof props.description === "string") meta.outlets[0].description = props.description;
            this.meta = meta;
        });
        this.on("destroy", () => {
            this.patcher.inspectAudioIO();
            this.patcher.changeIO();
        });
    }
}

export class AudioOut extends DefaultAudioObject<{}, { index: number }, [any], [], [number], { description: string }> {
    static package = "SubPatcher";
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
    };
    static inlets: TMeta["inlets"] = [{
        type: "signal",
        description: "",
        isHot: true
    }];
    inletConnections: TAudioNodeInletConnection[] = [{ node: undefined as GainNode, index: 0 }];
    _duringInit = true;
    state = { index: undefined as number };
    subscribe() {
        super.subscribe();
        this.on("metaChanged", () => this.patcher.changeIO());
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
            const { meta } = this;
            if (typeof props.description === "string") meta.outlets[0].description = props.description;
            this.meta = meta;
        });
        this.on("destroy", () => {
            this.patcher.inspectAudioIO();
            this.patcher.changeIO();
        });
    }
}

export class SubPatcherUI extends DefaultPopupUI<patcher, {}, { patcher: Patcher; timestamp: number }> {
    state: { patcher: Patcher; timestamp: number } & DefaultPopupUIState = {
        ...this.state,
        patcher: this.object.state.patcher,
        timestamp: performance.now()
    };
    static dockable = true;
    handleDoubleClick = () => {
        if (this.patcher.state.locked) this.setState({ modalOpen: true }, () => this.props.object.patcher.env.activeInstance = this.state.patcher);
    };
    handleClose = () => this.setState({ modalOpen: false }, () => this.props.object.patcher.env.activeInstance = this.props.object.patcher);
    handleMouseDownModal = (e: React.MouseEvent) => e.stopPropagation();
    componentDidUpdate(prevProps: any, prevState: Readonly<{ patcher: Patcher; timestamp: number } & BaseUIState>) {
        if (prevState.patcher !== this.state.patcher) this.setState({ timestamp: performance.now() });
    }
    render() {
        const content = <div style={{ height: "100%", width: "100%", display: "flex", position: "relative" }}>
            <div className="ui-flex-row" style={{ flex: "1 1 auto", overflow: "auto" }}>
                <div className="ui-left">
                    <LeftMenu env={this.props.object.patcher.env} lang={this.props.object.patcher.env.language} noFileMgr />
                </div>
                <div className="ui-center">
                    <PatcherEditorUI key={this.state.timestamp} patcher={this.state.patcher} env={this.props.object.patcher.env} lang={this.props.object.patcher.env.language} />
                </div>
            </div>
        </div>;
        const children = (
            <Modal.Content style={{ height: "100%", width: "100%", position: "relative" }} onMouseDown={this.handleMouseDownModal}>
                {content}
            </Modal.Content>
        );
        if (this.props.inDock) return children;
        const containerProps = { ...this.props.containerProps };
        if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;
        const modalProps: StrictModalProps & { onKeyDown: any } = { ...this.props.modalProps, children, className: "subpatcher", open: this.state.modalOpen, onClose: this.handleClose, onKeyDown: undefined, basic: true, size: "fullscreen", closeIcon: true };
        return <DefaultPopupUI {...this.props} modalProps={modalProps} containerProps={containerProps} />;
    }
}
interface SubPatcherState {
    patcher: Patcher;
    key: string;
}
export class patcher extends DefaultAudioObject<Partial<RawPatcher>, SubPatcherState, any[], any[], [string], {}, { patcher: Patcher }> {
    static package = "SubPatcher";
    static description = "Sub-patcher";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }];
    state: SubPatcherState = { patcher: new (this.patcher.constructor as typeof Patcher)(this.patcher.project), key: this.box.args[0] };
    static ui = SubPatcherUI;
    type: PatcherMode = "js";
    subscribe() {
        super.subscribe();
        const handlePatcherOutlet = ({ outlet, data }: PatcherEventMap["outlet"]) => this.outlet(outlet, data);
        const handlePatcherDisconnectAudioInlet = (port: number) => this.disconnectAudioInlet(port);
        const handlePatcherDisconnectAudioOutlet = (port: number) => this.disconnectAudioOutlet(port);
        const handlePatcherConnectAudioInlet = (port: number) => this.connectAudioInlet(port);
        const handlePatcherConnectAudioOutlet = (port: number) => this.connectAudioOutlet(port);
        const handlePatcherIOChanged = (meta: TMeta) => {
            this.inletConnections = this.state.patcher.inletAudioConnections.slice();
            this.outletConnections = this.state.patcher.outletAudioConnections.slice();
            this.inlets = meta.inlets.length;
            this.outlets = meta.outlets.length;
            const { inlets, outlets } = meta;
            this.meta = { ...this.meta, inlets, outlets, args: patcher.args };
        };
        const handlePatcherGraphChanged = (passive?: boolean) => {
            if (!passive && this.state.key) {
                if (!this.state.patcher.file) {
                    this.sharedData.set("patcher", this.state.key, this.state.patcher.toSerializable(), this);
                }
            }
            this.patcher.emit("graphChanged");
        };
        const handlePatcherChanged = () => this.patcher.emit("changed");
        const handleFilePathChanged = () => {
            this.state.key = this.state.patcher.file.projectPath;
        };
        const subscribePatcher = () => {
            const { patcher, key } = this.state;
            patcher.on("outlet", handlePatcherOutlet);
            patcher.on("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
            patcher.on("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
            patcher.on("connectAudioInlet", handlePatcherConnectAudioInlet);
            patcher.on("connectAudioOutlet", handlePatcherConnectAudioOutlet);
            patcher.on("ioChanged", handlePatcherIOChanged);
            patcher.on("graphChanged", handlePatcherGraphChanged);
            patcher.on("changed", handlePatcherChanged);
            if (key) {
                const patcherFile = patcher.file;
                if (patcherFile) {
                    patcherFile.on("destroyed", reload);
                    patcherFile.on("nameChanged", handleFilePathChanged);
                    patcherFile.on("pathChanged", handleFilePathChanged);
                    patcherFile.on("saved", reload);
                } else {
                    this.sharedData.subscribe("patcher", key, this);
                }
            }
        };
        const unsubscribePatcher = async () => {
            const { patcher, key } = this.state;
            patcher.off("outlet", handlePatcherOutlet);
            patcher.off("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
            patcher.off("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
            patcher.off("connectAudioInlet", handlePatcherConnectAudioInlet);
            patcher.off("connectAudioOutlet", handlePatcherConnectAudioOutlet);
            patcher.off("ioChanged", handlePatcherIOChanged);
            patcher.off("graphChanged", handlePatcherGraphChanged);
            patcher.off("changed", handlePatcherChanged);
            await patcher.unload();
            if (key) {
                const patcherFile = this.state.patcher.file;
                if (patcherFile) {
                    patcherFile.off("destroyed", reload);
                    patcherFile.off("nameChanged", handleFilePathChanged);
                    patcherFile.off("pathChanged", handleFilePathChanged);
                    patcherFile.off("saved", reload);
                } else {
                    this.sharedData.unsubscribe("patcher", this.state.key, this);
                }
            }
            const newPatcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
            await newPatcher.load({}, this.type);
            this.state.patcher = newPatcher;
        };
        const handlePatcherReset = () => {
            handlePatcherIOChanged(this.state.patcher.meta);
            this.updateUI({ patcher: this.state.patcher });
        };
        const reload = async () => {
            this.disconnectAudio();
            await unsubscribePatcher();
            const { args } = this.box;
            if (typeof args[0] === "string" || typeof args[0] === "undefined") this.state.key = args[0];
            const { key } = this.state;
            if (key) {
                this.data = {};
                try {
                    if (key.match(/\//)) {
                        const patcherFile = this.patcher.env.fileMgr.getProjectItemFromPath(key) as PatcherFile;
                        const patcher = await patcherFile.instantiate();
                        this.state.patcher = patcher;
                    } else {
                        throw new Error(`${key} is not a path`);
                    }
                } catch {
                    const shared: RawPatcher = this.sharedData.get("patcher", key);
                    if (typeof shared === "object") {
                        const patcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
                        await patcher.load(shared, this.type);
                        this.state.patcher = patcher;
                    } else {
                        this.sharedData.set("patcher", key, this.state.patcher.toSerializable(), this);
                    }
                }
            } else {
                const { data } = this;
                const patcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
                await patcher.load(data, this.type);
                this.state.patcher = patcher;
                this.data = this.state.patcher.toSerializable();
            }
            handlePatcherReset();
            subscribePatcher();
            handlePatcherGraphChanged(true);
            this.connectAudio();
        };
        this.on("preInit", async () => {
            await this.state.patcher.load({}, this.type);
        });
        this.on("updateArgs", async (args) => {
            if (typeof args[0] === "string" || typeof args[0] === "undefined") {
                const newKey = args[0];
                if (newKey !== this.state.key) await reload();
            }
        });
        this.on("postInit", async () => {
            await reload();
        });
        this.on("inlet", ({ data, inlet }) => this.state.patcher.fn(data, inlet));
        this.on("sharedDataUpdated", reload);
        this.on("destroy", unsubscribePatcher);
    }
}
interface FaustPatcherState extends FaustNodeState, SubPatcherState {
    code: string;
}
export class faustPatcher extends FaustNode<Partial<RawPatcher>, FaustPatcherState, [string, number], { patcher: Patcher }> {
    static package = "SubPatcher";
    static description = "Faust Sub-patcher, compiled to AudioNode";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }, {
        type: "number",
        optional: true,
        default: 0,
        description: "Polyphonic instrument voices count"
    }];
    static ui = SubPatcherUI;
    type: "faust" | "gen" = "faust";
    state = { code: undefined, merger: undefined, splitter: undefined, node: undefined, voices: 0, patcher: new (this.patcher.constructor as typeof Patcher)(this.patcher.project), key: this.box.args[0] } as FaustPatcherState;
    handleFilePathChanged = () => {
        this.state.key = this.state.patcher.file.projectPath;
    };
    subscribePatcher = () => {
        const { patcher, key } = this.state;
        patcher.on("graphChanged", this.handleGraphChanged);
        patcher.on("changed", this.handlePatcherChanged);
        if (key) {
            const patcherFile = patcher.file;
            if (patcherFile) {
                patcherFile.on("destroyed", this.reload);
                patcherFile.on("nameChanged", this.handleFilePathChanged);
                patcherFile.on("pathChanged", this.handleFilePathChanged);
                patcherFile.on("saved", this.reload);
            } else {
                this.sharedData.subscribe("patcher", key, this);
            }
        }
    };
    unsubscribePatcher = async () => {
        const { patcher, key } = this.state;
        patcher.off("graphChanged", this.handleGraphChanged);
        patcher.off("changed", this.handlePatcherChanged);
        await patcher.unload();
        if (key) {
            const patcherFile = this.state.patcher.file;
            if (patcherFile) {
                patcherFile.off("destroyed", this.reload);
                patcherFile.off("nameChanged", this.handleFilePathChanged);
                patcherFile.off("pathChanged", this.handleFilePathChanged);
                patcherFile.off("saved", this.reload);
            } else {
                this.sharedData.unsubscribe("patcher", this.state.key, this);
            }
        }
        const newPatcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
        await newPatcher.load({}, this.type);
        this.state.patcher = newPatcher;
    };
    handlePatcherReset = () => {
        this.updateUI({ patcher: this.state.patcher });
    };
    handleGraphChanged = async (passive?: boolean) => {
        if (!passive && this.state.key) {
            if (!this.state.patcher.file) {
                this.sharedData.set("patcher", this.state.key, this.state.patcher.toSerializable(), this);
            }
        }
        const code = this.state.patcher.toFaustDspCode();
        if (code && code !== this.state.code) {
            this.state.code = code;
            await this.newNode(code, this.state.voices);
        }
        this.patcher.emit("graphChanged");
    };
    handlePatcherChanged = () => this.patcher.emit("changed");
    reload = async () => {
        this.disconnectAudio();
        await this.unsubscribePatcher();
        const { args } = this.box;
        if (typeof args[0] === "string" || typeof args[0] === "undefined") this.state.key = args[0];
        if (typeof args[1] === "number") this.state.voices = ~~Math.max(0, args[1]);
        const { key } = this.state;
        if (key) {
            this.data = {};
            try {
                if (key.match(/\//)) {
                    const patcherFile = this.patcher.env.fileMgr.getProjectItemFromPath(key) as PatcherFile;
                    const patcher = await patcherFile.instantiate();
                    this.state.patcher = patcher;
                } else {
                    throw new Error(`${key} is not a path`);
                }
            } catch {
                const shared: RawPatcher = this.sharedData.get("patcher", key);
                if (typeof shared === "object") {
                    const patcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
                    await patcher.load(shared, this.type);
                    this.state.patcher = patcher;
                } else {
                    this.sharedData.set("patcher", key, this.state.patcher.toSerializable(), this);
                }
            }
        } else {
            const { data } = this;
            const patcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
            await patcher.load(data, this.type);
            this.state.patcher = patcher;
            this.data = this.state.patcher.toSerializable();
        }
        this.handlePatcherReset();
        this.subscribePatcher();
        await this.handleGraphChanged(true);
        this.connectAudio();
    };
    handlePreInit = async () => {
        await this.state.patcher.load({}, this.type);
    };
    handleUpdateArgs = async (args: Partial<[string, number]>): Promise<void> => {
        if (typeof args[0] === "string" || typeof args[0] === "undefined") {
            const key = args[0];
            if (key !== this.state.key) {
                await this.reload();
            } else {
                if (typeof args[1] === "number") {
                    const voices = ~~Math.max(0, args[1]);
                    if (voices !== this.state.voices) {
                        this.state.voices = voices;
                        this.disconnectAudio();
                        const code = this.state.patcher.toFaustDspCode();
                        if (code && code !== this.state.code) {
                            this.state.code = code;
                            await this.newNode(code, this.state.voices);
                        }
                        this.connectAudio();
                    }
                }
            }
        }
    };
    handlePostInit = async () => {
        await this.reload();
    };
    subscribe() {
        super.subscribe();
        this.on("sharedDataUpdated", this.reload);
        this.on("destroy", this.unsubscribePatcher);
    }
}
export class gen extends faustPatcher {
    static description = "Gen Sub-patcher, compiled to AudioNode";
    type: "faust" | "gen" = "gen";
}
export class BPatcherUI extends BaseUI<patcher, {}, { patcher: Patcher; timestamp: number }> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "both";
    static defaultSize: [number, number] = [210, 90];
    state: { patcher: Patcher; timestamp: number } & BaseUIState = {
        ...this.state,
        patcher: this.object.state.patcher,
        timestamp: performance.now()
    };
    componentDidUpdate(prevProps: any, prevState: Readonly<{ patcher: Patcher; timestamp: number } & BaseUIState>) {
        if (prevState.patcher !== this.state.patcher) this.setState({ timestamp: performance.now() });
    }
    static dockable = true;
    render() {
        if (this.props.inDock) {
            return (
                <div style={{ height: "100%", width: "100%", display: "flex" }}>
                    <PatcherEditorUI key={this.state.timestamp} patcher={this.state.patcher} env={this.props.object.patcher.env} lang={this.props.object.patcher.env.language} />
                </div>
            );
        }
        const children = (
            <div style={{ height: "100%", width: "100%", display: "flex" }}>
                <PatcherUI key={this.state.timestamp} patcher={this.state.patcher} transparent runtime />
            </div>
        );
        return <BaseUI {...this.props} children={children} />;
    }
}
export class bpatcher extends BaseAudioObject<Partial<RawPatcher>, SubPatcherState, any[], any[], [string], {}, { patcher: Patcher }> {
    static package = "SubPatcher";
    static description = "Sub-patcher";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }];
    state: SubPatcherState = { patcher: new (this.patcher.constructor as typeof Patcher)(this.patcher.project), key: this.box.args[0] };
    static ui = BPatcherUI;
    type: PatcherMode = "js";
    subscribe() {
        super.subscribe();
        const handlePatcherOutlet = ({ outlet, data }: PatcherEventMap["outlet"]) => this.outlet(outlet, data);
        const handlePatcherDisconnectAudioInlet = (port: number) => this.disconnectAudioInlet(port);
        const handlePatcherDisconnectAudioOutlet = (port: number) => this.disconnectAudioOutlet(port);
        const handlePatcherConnectAudioInlet = (port: number) => this.connectAudioInlet(port);
        const handlePatcherConnectAudioOutlet = (port: number) => this.connectAudioOutlet(port);
        const handlePatcherIOChanged = (meta: TMeta) => {
            this.inletConnections = this.state.patcher.inletAudioConnections.slice();
            this.outletConnections = this.state.patcher.outletAudioConnections.slice();
            this.inlets = meta.inlets.length;
            this.outlets = meta.outlets.length;
            const { inlets, outlets } = meta;
            this.meta = { ...this.meta, inlets, outlets, args: patcher.args };
        };
        const handlePatcherGraphChanged = (passive?: boolean) => {
            if (!passive && this.state.key) {
                if (!this.state.patcher.file) {
                    this.sharedData.set("patcher", this.state.key, this.state.patcher.toSerializable(), this);
                }
            }
            this.patcher.emit("graphChanged");
        };
        const handlePatcherChanged = () => this.patcher.emit("changed");
        const handleFilePathChanged = () => {
            this.state.key = this.state.patcher.file.projectPath;
        };
        const subscribePatcher = () => {
            const { patcher, key } = this.state;
            patcher.on("outlet", handlePatcherOutlet);
            patcher.on("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
            patcher.on("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
            patcher.on("connectAudioInlet", handlePatcherConnectAudioInlet);
            patcher.on("connectAudioOutlet", handlePatcherConnectAudioOutlet);
            patcher.on("ioChanged", handlePatcherIOChanged);
            patcher.on("graphChanged", handlePatcherGraphChanged);
            patcher.on("changed", handlePatcherChanged);
            if (key) {
                const patcherFile = patcher.file;
                if (patcherFile) {
                    patcherFile.on("destroyed", reload);
                    patcherFile.on("nameChanged", handleFilePathChanged);
                    patcherFile.on("pathChanged", handleFilePathChanged);
                    patcherFile.on("saved", reload);
                } else {
                    this.sharedData.subscribe("patcher", key, this);
                }
            }
        };
        const unsubscribePatcher = async () => {
            const { patcher, key } = this.state;
            patcher.off("outlet", handlePatcherOutlet);
            patcher.off("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
            patcher.off("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
            patcher.off("connectAudioInlet", handlePatcherConnectAudioInlet);
            patcher.off("connectAudioOutlet", handlePatcherConnectAudioOutlet);
            patcher.off("ioChanged", handlePatcherIOChanged);
            patcher.off("graphChanged", handlePatcherGraphChanged);
            patcher.off("changed", handlePatcherChanged);
            await patcher.unload();
            if (key) {
                const patcherFile = this.state.patcher.file;
                if (patcherFile) {
                    patcherFile.off("destroyed", reload);
                    patcherFile.off("nameChanged", handleFilePathChanged);
                    patcherFile.off("pathChanged", handleFilePathChanged);
                    patcherFile.off("saved", reload);
                } else {
                    this.sharedData.unsubscribe("patcher", this.state.key, this);
                }
            }
            const newPatcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
            await newPatcher.load({}, this.type);
            this.state.patcher = newPatcher;
        };
        const handlePatcherReset = () => {
            handlePatcherIOChanged(this.state.patcher.meta);
            this.updateUI({ patcher: this.state.patcher });
        };
        const reload = async () => {
            this.disconnectAudio();
            await unsubscribePatcher();
            const { args } = this.box;
            if (typeof args[0] === "string" || typeof args[0] === "undefined") this.state.key = args[0];
            const { key } = this.state;
            if (key) {
                this.data = {};
                try {
                    if (key.match(/\//)) {
                        const patcherFile = this.patcher.env.fileMgr.getProjectItemFromPath(key) as PatcherFile;
                        const patcher = await patcherFile.instantiate();
                        this.state.patcher = patcher;
                    } else {
                        throw new Error(`${key} is not a path`);
                    }
                } catch {
                    const shared: RawPatcher = this.sharedData.get("patcher", key);
                    if (typeof shared === "object") {
                        const patcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
                        await patcher.load(shared, this.type);
                        this.state.patcher = patcher;
                    } else {
                        this.sharedData.set("patcher", key, this.state.patcher.toSerializable(), this);
                    }
                }
            } else {
                const { data } = this;
                const patcher = new (this.patcher.constructor as typeof Patcher)(this.patcher.project);
                await patcher.load(data, this.type);
                this.state.patcher = patcher;
                this.data = this.state.patcher.toSerializable();
            }
            handlePatcherReset();
            subscribePatcher();
            handlePatcherGraphChanged(true);
            this.connectAudio();
        };
        this.on("preInit", async () => {
            await this.state.patcher.load({}, this.type);
        });
        this.on("updateArgs", async (args) => {
            if (typeof args[0] === "string" || typeof args[0] === "undefined") {
                const newKey = args[0];
                if (newKey !== this.state.key) await reload();
            }
        });
        this.on("postInit", async () => {
            await reload();
        });
        this.on("inlet", ({ data, inlet }) => this.state.patcher.fn(data, inlet));
        this.on("sharedDataUpdated", reload);
        this.on("destroy", unsubscribePatcher);
    }
}

export default {
    in: In,
    out: Out,
    "in~": AudioIn,
    "out~": AudioOut,
    patcher,
    p: patcher,
    faustPatcher,
    pfaust: faustPatcher,
    gen,
    bpatcher
};
