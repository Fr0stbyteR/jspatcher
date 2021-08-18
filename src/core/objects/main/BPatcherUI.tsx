import * as React from "react";
import PatcherEditorUI from "../../../components/editors/PatcherEditorUI";
import BaseUI, { BaseUIState } from "../base/BaseUI";
import PatcherUI from "../../../components/editors/patcher/PatcherUI";
import type SubPatcher from "./SubPatcher";
import type PatcherEditor from "../../patcher/PatcherEditor";
import type { SubPatcherUIState } from "./SubPatcherUI";
import "./BPatcherUI.scss";

export default class BPatcherUI extends BaseUI<SubPatcher, {}, SubPatcherUIState> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "both";
    static defaultSize: [number, number] = [210, 90];
    state: SubPatcherUIState & BaseUIState = {
        ...this.state,
        patcher: this.object._.patcher,
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
            const editor = new Editor(this.object._.patcher);
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
                const editor = new Editor(this.object._.patcher);
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
