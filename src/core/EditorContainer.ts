import TypedEventEmitter from "../utils/TypedEventEmitter";
import Env, { EnvEventMap } from "./Env";
import { IFileEditor } from "./file/FileEditor";
import Patcher from "./patcher/Patcher";
import PatcherEditor from "./patcher/PatcherEditor";
import HardwarePatcherEditor from "./hardware/HardwareEditor";

export type TSplitMode = "none" | "row" | "column";

export type TSplitDirection = "left" | "right" | "top" | "bottom";

export interface EditorContainerState {
    editors: IFileEditor[];
    children: EditorContainer[];
    mode: TSplitMode;
    activeEditor: IFileEditor;
}

export interface EditorContainerEventMap {
    "state": EditorContainerState;
}

export default class EditorContainer extends TypedEventEmitter<EditorContainerEventMap> {
    readonly _env: Env;
    readonly id = performance.now();
    readonly parent: EditorContainer;
    activeEditor: IFileEditor;
    editors: IFileEditor[] = [];
    mode: TSplitMode = "none";
    children: EditorContainer[] = [];
    setActive() {
        this._env.activeEditorContainer = this;
    }
    get active() {
        return this._env.activeEditorContainer === this;
    }
    get isDirty(): boolean {
        return !this.editors.every(i => !i.isDirty) && this.children.every(c => !c.isDirty);
    }
    getDescendantInstances() {
        if (this.editors) return this.editors.slice();
        const editors: IFileEditor[] = [];
        for (const container of this.children) {
            editors.push(...container.getDescendantInstances());
        }
        return editors;
    }
    constructor(env: Env, parent: EditorContainer = null, mode: TSplitMode = "none", editors: IFileEditor[] = []) {
        super();
        this._env = env;
        this.mode = mode;
        this.editors = editors;
        this.activeEditor = editors[0];
        this.parent = parent;
        if (!parent) this.setActive();
        this._env.on("activeEditor", this.handleActiveEditor);
        this._env.on("openEditor", this.handleOpenEditor);
    }
    findEditorFromId(id: string) {
        return this.getDescendantInstances().find(i => i.editorId === id);
    }
    handleActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => {
        if (this.editors.indexOf(editor) !== -1) {
            this.activeEditor = editor;
            this.setActive();
        }
        this.emitState();
    };
    handleOpenEditor = (editor: EnvEventMap["openEditor"]) => {
        if (this.active) this.editors = [...this.editors, editor];
        this.activeEditor = editor;

        if (editor instanceof PatcherEditor || editor instanceof HardwarePatcherEditor) {
            const onHelp = async () => {
                const boxes = editor.state.selected.filter(id => id.startsWith("box") && editor.boxes[id]).map(id => editor.boxes[id]);
                if (boxes.length === 0) {
                    return;
                }

                const box = boxes[0];
                if (box.meta.helpFiles.length > 0) {
                    const url = box.meta.helpFiles[0];
                    const fullUrl = `https://web-patcher.sfo3.cdn.digitaloceanspaces.com/help/${url}`
                    try {
                        const helpFile = await (await fetch(fullUrl)).json();

                        const patcher = new Patcher({ env: this._env, project: this._env.currentProject });
                        await patcher.load(helpFile, "bell");
                        const newEditor = await patcher.getEditor();
                        this._env.openEditor(newEditor);
                    } catch (e) {
                        this._env.newLog("error", "Help File", "Error fetching help file. Please try again.")
                    }
                } else {
                    this._env.newLog("info", "Help File", "This object does not yet have a help file.")
                }
            };

            if (editor instanceof PatcherEditor) {
                editor.on("help", onHelp);
            } else if (editor instanceof HardwarePatcherEditor) {
                editor.on("help", onHelp);
            }
        }

        const handleInstanceDestroy = () => {
            this.editors = this.editors.filter(i => i !== editor);
            if (!this.editors.length) this.destroy();
            editor.off("destroy", handleInstanceDestroy);
            this.activeEditor = this.editors[this.editors.length - 1];
            this.setActive();
            this.emitState();
        };
        editor.on("destroy", handleInstanceDestroy);
        this.emitState();
    };

    split(direction: TSplitDirection) {
        if (this.mode !== "none") throw new Error(`The Container is already splitted as ${this.mode}`);
        const container = new EditorContainer(this._env, this, "none", this.editors);
        const newContainer = new EditorContainer(this._env, this, "none");
        if (direction === "bottom" || direction === "right") this.children = [container, newContainer];
        else this.children = [newContainer, container];
        if (direction === "bottom" || direction === "top") this.mode = "column";
        else this.mode = "row";
        this.editors = [];
        this.emitState();
        return { container, newContainer };
    }
    unsplit() {
        if (this.mode === "none") throw new Error("The Container is not splitted.");
        this.mode = "none";
        this.editors = [...this.children[0].editors, ...this.children[1].editors];
        this.children = [];
        this.setActive();
        this.emitState();
    }
    destroy() {
        if (this.parent) {
            this.parent.unsplit();
            this._env.off("activeEditor", this.handleActiveEditor);
            this._env.off("openEditor", this.handleOpenEditor);
        } else {
            this.editors = [];
            this.activeEditor = null;
            this.setActive();
        }
        this.emitState();
    }
    emitState() {
        const { editors, children, mode, activeEditor } = this;
        this.emit("state", { editors, children, mode, activeEditor });
    }
}
