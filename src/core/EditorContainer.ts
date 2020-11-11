import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import Env, { EnvEventMap } from "./Env";
import { AnyFileInstance } from "./file/FileInstance";

export type TSplitMode = "none" | "row" | "column";

export type TSplitDirection = "left" | "right" | "top" | "bottom";

export interface EditorContainerState {
    instances: AnyFileInstance[];
    children: EditorContainer[];
    mode: TSplitMode;
    activeInstance: AnyFileInstance;
}

export interface EditorContainerEventMap {
    "state": EditorContainerState;
}

export default class EditorContainer extends TypedEventEmitter<EditorContainerEventMap> {
    readonly _env: Env;
    readonly id = performance.now();
    readonly parent: EditorContainer;
    activeInstance: AnyFileInstance;
    instances: AnyFileInstance[] = [];
    mode: TSplitMode = "none";
    children: EditorContainer[] = [];
    setActive() {
        this._env.activeEditorContainer = this;
    }
    get active() {
        return this._env.activeEditorContainer === this;
    }
    get isDirty(): boolean {
        return !this.instances.every(i => !i.isDirty) && this.children.every(c => !c.isDirty);
    }
    constructor(env: Env, parent: EditorContainer = null, mode: TSplitMode = "none", instances: AnyFileInstance[] = []) {
        super();
        this._env = env;
        this.mode = mode;
        this.instances = instances;
        this.activeInstance = instances[0];
        this.parent = parent;
        if (!parent) this.setActive();
        this._env.on("activeInstance", this.handleActiveInstance);
        this._env.on("openInstance", this.handleOpenInstance);
    }
    handleActiveInstance = ({ instance }: EnvEventMap["activeInstance"]) => {
        if (this.instances.indexOf(instance) !== -1) {
            this.activeInstance = instance;
            this.setActive();
        }
        this.emitState();
    };
    handleOpenInstance = (instance: EnvEventMap["openInstance"]) => {
        if (this.active) this.instances = [...this.instances, instance];
        this.activeInstance = instance;
        const handleInstanceDestroy = () => {
            this.instances = this.instances.filter(i => i !== instance);
            if (!this.instances.length) this.destroy();
            instance.off("destroy", handleInstanceDestroy);
            this.activeInstance = this.instances[this.instances.length - 1];
            this.setActive();
            this.emitState();
        };
        instance.on("destroy", handleInstanceDestroy);
        this.emitState();
    };

    split(direction: TSplitDirection) {
        if (this.mode !== "none") throw new Error(`The Container is already splitted as ${this.mode}`);
        const container = new EditorContainer(this._env, this, "none", this.instances);
        const newContainer = new EditorContainer(this._env, this, "none");
        if (direction === "bottom" || direction === "right") this.children = [container, newContainer];
        else this.children = [newContainer, container];
        if (direction === "bottom" || direction === "top") this.mode = "column";
        else this.mode = "row";
        this.instances = [];
        this.emitState();
        return { container, newContainer };
    }
    unsplit() {
        if (this.mode === "none") throw new Error("The Container is not splitted.");
        this.mode = "none";
        this.instances = [...this.children[0].instances, ...this.children[1].instances];
        this.children = [];
        this.setActive();
        this.emitState();
    }
    destroy() {
        if (this.parent) {
            this.parent.unsplit();
            this._env.off("activeInstance", this.handleActiveInstance);
            this._env.off("openInstance", this.handleOpenInstance);
        } else {
            this.instances = [];
            this.activeInstance = null;
            this.setActive();
        }
        this.emitState();
    }
    emitState() {
        const { instances, children, mode, activeInstance } = this;
        this.emit("state", { instances, children, mode, activeInstance });
    }
}
