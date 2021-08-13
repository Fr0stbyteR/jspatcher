import * as React from "react";
import { StrictModalProps, Modal } from "semantic-ui-react";
import BaseObject from "./base/BaseObject";
import DefaultObject from "./base/DefaultObject";
import Patcher, { PatcherEventMap } from "../patcher/Patcher";
import FaustNode, { FaustNodeState } from "./faust/FaustNode";
import PatcherUI from "../../components/editors/patcher/PatcherUI";
import PatcherEditorUI from "../../components/editors/PatcherEditorUI";
import LeftMenu from "../../components/leftmenu/LeftMenu";
import PatcherEditor from "../patcher/PatcherEditor";
import BaseUI, { BaseUIState } from "./base/BaseUI";
import type { ProjectFileEventMap } from "../file/AbstractProjectFile";
import "./SubPatcher.scss";
import { RawPatcher, PatcherMode } from "../types";
import { IJSPatcherObjectMeta } from "./base/AbstractObject";
import DefaultPopupUI, { DefaultPopupUIState, DefaultPopupUIProps } from "./base/DefaultPopupUI";

interface SubPatcherUIState {
    patcher: Patcher;
    timestamp: number;
    editor: PatcherEditor;
}

export class SubPatcherUI extends DefaultPopupUI<patcher, {}, SubPatcherUIState> {
    state: SubPatcherUIState & DefaultPopupUIState = {
        ...this.state,
        patcher: this.object.state.patcher,
        timestamp: performance.now(),
        editor: undefined
    };
    static dockable = true;
    handleChanged = () => {
        if (this.state.editor.isTemporary) this.state.editor.save();
    };
    handleDoubleClick = () => {
        if (this.editor.state.locked) this.setState({ modalOpen: true }, () => this.state.editor.setActive());
    };
    handleClose = () => this.setState({ modalOpen: false }, () => this.props.editor.setActive());
    handleMouseDownModal = (e: React.MouseEvent) => e.stopPropagation();
    componentDidMount() {
        super.componentDidMount();
        if (this.state.patcher) {
            const Editor = this.editor.constructor as typeof PatcherEditor;
            const editor = new Editor(this.object.state.patcher);
            this.setState({ editor });
            editor.init();
            editor.on("changed", this.handleChanged);
        }
    }
    componentDidUpdate(prevProps: Readonly<DefaultPopupUIProps>, prevState: Readonly<SubPatcherUIState & DefaultPopupUIState>) {
        if (prevState.patcher !== this.state.patcher) {
            if (this.state.editor) {
                this.state.editor.off("changed", this.handleChanged);
                this.state.editor.destroy();
            }
            if (this.state.patcher) {
                const Editor = this.editor.constructor as typeof PatcherEditor;
                const editor = new Editor(this.object.state.patcher);
                this.setState({ timestamp: performance.now(), editor });
                editor.init();
                editor.on("changed", this.handleChanged);
            } else {
                this.setState({ timestamp: performance.now(), editor: undefined });
            }
        }
        super.componentDidUpdate(prevProps, prevState);
    }
    componentWillUnmount() {
        this.state.editor?.off("changed", this.handleChanged);
        super.componentWillUnmount();
    }
    render() {
        const content = <div style={{ height: "100%", width: "100%", display: "flex", position: "relative" }}>
            <div className="ui-flex-row" style={{ flex: "1 1 auto", overflow: "auto" }}>
                <div className="ui-left">
                    <LeftMenu env={this.env} lang={this.env.language} noFileMgr />
                </div>
                <div className="ui-center">
                    {
                        this.state.editor
                            ? <PatcherEditorUI key={this.state.timestamp} editor={this.state.editor} env={this.env} lang={this.env.language} />
                            : undefined
                    }
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
export class patcher extends DefaultObject<Partial<RawPatcher>, SubPatcherState, any[], any[], [string], {}, SubPatcherUIState> {
    static package = "SubPatcher";
    static description = "Sub-patcher";
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }];
    state: SubPatcherState = { patcher: undefined, key: this.box.args[0] };
    static UI = SubPatcherUI;
    type: PatcherMode = "js";
    subscribe() {
        super.subscribe();
        const handlePatcherOutput = ({ outlet, data }: PatcherEventMap["dataOutput"]) => this.outlet(outlet, data);
        const handlePatcherDisconnectAudioInlet = (port: number) => this.disconnectAudioInlet(port);
        const handlePatcherDisconnectAudioOutlet = (port: number) => this.disconnectAudioOutlet(port);
        const handlePatcherConnectAudioInlet = (port: number) => this.connectAudioInlet(port);
        const handlePatcherConnectAudioOutlet = (port: number) => this.connectAudioOutlet(port);
        const handlePatcherIOChanged = (meta: IJSPatcherObjectMeta) => {
            this.inletAudioConnections = this.state.patcher.inletAudioConnections.slice();
            this.outletAudioConnections = this.state.patcher.outletAudioConnections.slice();
            this.inlets = meta.inlets.length;
            this.outlets = meta.outlets.length;
            const { inlets, outlets } = meta;
            this.setMeta({ ...this.meta, inlets, outlets, args: patcher.args });
        };
        const handlePatcherGraphChanged = () => {
            this.patcher.emit("graphChanged");
        };
        const handlePatcherChanged = () => {
            const { patcher } = this.state;
            if (patcher.isTemporary) {
                const rawPatcher = this.state.patcher.toSerializable();
                this.setData(rawPatcher);
            }
            this.patcher.emit("changed");
        };
        const handleFilePathChanged = () => {
            this.setState({ key: this.state.patcher.file.projectPath });
        };
        const handleSaved = (e: ProjectFileEventMap["saved"]) => {
            if (e.instance === this.state.patcher) return;
            reload();
        };
        const subscribePatcher = async () => {
            const { patcher } = this.state;
            if (patcher) {
                await patcher.addObserver(this);
                patcher.on("dataOutput", handlePatcherOutput);
                patcher.on("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
                patcher.on("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
                patcher.on("connectAudioInlet", handlePatcherConnectAudioInlet);
                patcher.on("connectAudioOutlet", handlePatcherConnectAudioOutlet);
                patcher.on("ioChanged", handlePatcherIOChanged);
                patcher.on("graphChanged", handlePatcherGraphChanged);
                patcher.on("changed", handlePatcherChanged);
                const { file } = patcher;
                if (file) {
                    file.on("destroyed", reload);
                    file.on("nameChanged", handleFilePathChanged);
                    file.on("pathChanged", handleFilePathChanged);
                    file.on("saved", handleSaved);
                }
            }
        };
        const unsubscribePatcher = async () => {
            const { patcher } = this.state;
            if (patcher) {
                patcher.off("dataOutput", handlePatcherOutput);
                patcher.off("disconnectAudioInlet", handlePatcherDisconnectAudioInlet);
                patcher.off("disconnectAudioOutlet", handlePatcherDisconnectAudioOutlet);
                patcher.off("connectAudioInlet", handlePatcherConnectAudioInlet);
                patcher.off("connectAudioOutlet", handlePatcherConnectAudioOutlet);
                patcher.off("ioChanged", handlePatcherIOChanged);
                patcher.off("graphChanged", handlePatcherGraphChanged);
                patcher.off("changed", handlePatcherChanged);
                const { file } = patcher;
                if (file) {
                    file.off("destroyed", reload);
                    file.off("nameChanged", handleFilePathChanged);
                    file.off("pathChanged", handleFilePathChanged);
                    file.off("saved", handleSaved);
                }
                await patcher.removeObserver(this); // patcher will be destroyed if no observers left.
            }
        };
        const reload = async () => {
            if (this.state.patcher) {
                this.disconnectAudio();
                await unsubscribePatcher();
            }
            const { key } = this.state;
            let patcher: Patcher;
            let rawPatcher: RawPatcher;
            try {
                const { item, newItem } = await this.getSharedItem(key, "patcher", async () => {
                    patcher = new this.Patcher({ env: this.patcher.env, project: this.patcher.project });
                    await patcher.load(this.data, this.type);
                    rawPatcher = patcher.toSerializable();
                    return rawPatcher;
                });
                if (newItem) {
                    patcher.file = item;
                    this.setData(rawPatcher);
                } else {
                    patcher = await item.instantiate({ env: this.patcher.env, project: this.patcher.project }) as Patcher;
                    this.setData(patcher.toSerializable());
                }
                this.setState({ patcher });
                this.updateUI({ patcher });
            } catch (error) {
                this.error(error);
            } finally {
                handlePatcherIOChanged(this.state.patcher.meta);
                subscribePatcher();
                handlePatcherGraphChanged();
                this.connectAudio();
            }
        };
        this.on("updateArgs", async (args) => {
            if (!this.state.patcher) return;
            if (typeof args[0] === "string" || typeof args[0] === "undefined") {
                const newKey = args[0];
                if (newKey !== this.state.key) {
                    this.setState({ key: newKey });
                    await reload();
                }
            }
        });
        this.on("postInit", reload);
        this.on("inlet", ({ data, inlet }) => this.state.patcher.fn(data, inlet));
        this.on("destroy", unsubscribePatcher);
    }
}
interface FaustPatcherState extends FaustNodeState, SubPatcherState {
    code: string;
}
export class faustPatcher extends FaustNode<Partial<RawPatcher>, FaustPatcherState, [string, number], { patcher: Patcher }> {
    static package = "SubPatcher";
    static description = "Faust Sub-patcher, compiled to AudioNode";
    static args: IJSPatcherObjectMeta["args"] = [{
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
    state: FaustPatcherState = { code: undefined, merger: undefined, splitter: undefined, node: undefined, voices: ~~Math.max(0, this.box.args[1]), patcher: undefined, key: this.box.args[0] };
    static UI = SubPatcherUI;
    type: "faust" | "gen" = "faust";
    handleFilePathChanged = () => {
        this.setState({ key: this.state.patcher.file.projectPath });
    };
    handleSaved = (e: ProjectFileEventMap["saved"]) => {
        if (e.instance === this.state.patcher) return;
        this.reload();
    };
    subscribePatcher = async () => {
        const { patcher } = this.state;
        if (patcher) {
            await patcher.addObserver(this);
            patcher.on("graphChanged", this.handleGraphChanged);
            patcher.on("changed", this.handlePatcherChanged);
            const { file } = patcher;
            if (file) {
                file.on("destroyed", this.reload);
                file.on("nameChanged", this.handleFilePathChanged);
                file.on("pathChanged", this.handleFilePathChanged);
                file.on("saved", this.handleSaved);
            }
        }
    };
    unsubscribePatcher = async () => {
        const { patcher } = this.state;
        if (patcher) {
            patcher.off("graphChanged", this.handleGraphChanged);
            patcher.off("changed", this.handlePatcherChanged);
            const { file } = patcher;
            if (file) {
                file.off("destroyed", this.reload);
                file.off("nameChanged", this.handleFilePathChanged);
                file.off("pathChanged", this.handleFilePathChanged);
                file.off("saved", this.handleSaved);
            }
            await patcher.removeObserver(this); // patcher will be destroyed if no observers left.
        }
    };
    async compilePatcher() {
        const code = this.state.patcher.toFaustDspCode();
        if (code && code !== this.state.code) {
            this.state.code = code;
            await this.newNode(code, this.state.voices);
        }
    }
    handleGraphChanged = async () => {
        await this.compilePatcher();
        this.patcher.emit("graphChanged");
    };
    handlePatcherChanged = () => {
        const { patcher } = this.state;
        if (patcher.isTemporary) {
            const rawPatcher = this.state.patcher.toSerializable();
            this.setData(rawPatcher);
        }
        this.patcher.emit("changed");
    };
    reload = async () => {
        if (this.state.patcher) {
            this.disconnectAudio();
            await this.unsubscribePatcher();
        }
        const { key } = this.state;
        let patcher: Patcher;
        let rawPatcher: RawPatcher;
        try {
            const { item, newItem } = await this.getSharedItem(key, "patcher", async () => {
                patcher = new this.Patcher({ env: this.patcher.env, project: this.patcher.project });
                await patcher.load(this.data, this.type);
                rawPatcher = patcher.toSerializable();
                return rawPatcher;
            });
            if (newItem) {
                patcher.file = item;
                this.setData(rawPatcher);
            } else {
                patcher = await item.instantiate({ env: this.patcher.env, project: this.patcher.project }) as Patcher;
                this.setData(patcher.toSerializable());
            }
            this.setState({ patcher });
            this.updateUI({ patcher });
        } catch (error) {
            this.error(error);
        } finally {
            await this.subscribePatcher();
            await this.handleGraphChanged();
            this.connectAudio();
        }
    };
    handlePreInit = () => {};
    handleUpdateArgs = async (args: Partial<[string, number]>): Promise<void> => {
        if (!this.state.patcher) return;
        const { voices, key } = this.state;
        let newKey = key;
        let newVoices = voices;
        if (typeof args[0] === "string" || typeof args[0] === "undefined") {
            newKey = args[0];
            if (newKey !== key) this.setState({ key: newKey });
        }
        if (typeof args[1] === "number") {
            newVoices = ~~Math.max(0, args[1]);
            this.setState({ voices: newVoices });
        }
        if (newKey !== key) {
            await this.reload();
        } else if (newVoices !== voices) {
            this.disconnectAudio();
            await this.compilePatcher();
            this.connectAudio();
        }
    };
    handlePostInit = this.reload;
    subscribe() {
        super.subscribe();
        this.on("destroy", this.unsubscribePatcher);
    }
}
export class gen extends faustPatcher {
    static description = "Gen Sub-patcher, compiled to AudioNode";
    type: "faust" | "gen" = "gen";
}
export class BPatcherUI extends BaseUI<patcher, {}, SubPatcherUIState> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "both";
    static defaultSize: [number, number] = [210, 90];
    state: SubPatcherUIState & BaseUIState = {
        ...this.state,
        patcher: this.object.state.patcher,
        timestamp: performance.now(),
        editor: undefined
    };
    handleChanged = () => {
        if (this.state.editor.isTemporary) this.state.editor.save();
    };
    componentDidMount() {
        super.componentDidMount();
        if (this.state.patcher) {
            const Editor = this.editor.constructor as typeof PatcherEditor;
            const editor = new Editor(this.object.state.patcher);
            this.setState({ editor });
            editor.init();
            editor.on("changed", this.handleChanged);
        }
    }
    componentDidUpdate(prevProps: any, prevState: Readonly<SubPatcherUIState & BaseUIState>) {
        if (prevState.patcher !== this.state.patcher) {
            if (this.state.editor) {
                this.state.editor.off("changed", this.handleChanged);
                this.state.editor.destroy();
            }
            if (this.state.patcher) {
                const Editor = this.editor.constructor as typeof PatcherEditor;
                const editor = new Editor(this.object.state.patcher);
                this.setState({ timestamp: performance.now(), editor });
                editor.init();
                editor.on("changed", this.handleChanged);
            } else {
                this.setState({ timestamp: performance.now(), editor: undefined });
            }
        }
    }
    componentWillUnmount() {
        this.state.editor?.off("changed", this.handleChanged);
        super.componentWillUnmount();
    }
    static dockable = true;
    render() {
        if (this.props.inDock) {
            return (
                <div style={{ height: "100%", width: "100%", display: "flex" }}>
                    {
                        this.state.editor
                            ? <PatcherEditorUI key={this.state.timestamp} editor={this.state.editor} env={this.env} lang={this.env.language} />
                            : undefined
                    }
                </div>
            );
        }
        const children = (
            <div style={{ height: "100%", width: "100%", display: "flex" }}>
                {
                    this.state.editor
                        ? <PatcherUI key={this.state.timestamp} editor={this.state.editor} transparent runtime />
                        : undefined
                }
            </div>
        );
        return <BaseUI {...this.props} children={children} />;
    }
}
export class bpatcher extends patcher {
    static props = BaseObject.props;
    static UI = BPatcherUI as any;
}

export default {
    patcher,
    p: patcher,
    faustPatcher,
    pfaust: faustPatcher,
    gen,
    bpatcher
};
