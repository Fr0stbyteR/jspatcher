import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import Env, { EnvEventMap } from "./Env";
import { AnyFileInstance } from "./file/FileInstance";

export type TSplitMode = "none" | "row" | "column";

export type TSplitDirection = "left" | "right" | "top" | "bottom";

export interface EditorContainerState {
    instances: AnyFileInstance[];
    children: EditorContainer[];
    mode: TSplitMode;
}

export interface EditorContainerEventMap {
    "state": EditorContainerState;
}

export default class EditorContainer extends TypedEventEmitter<EditorContainerEventMap> {
    readonly _env: Env;
    readonly id = performance.now();
    readonly parent: EditorContainer;
    instances: AnyFileInstance[] = [];
    mode: TSplitMode = "none";
    children: EditorContainer[] = [];
    private _active = false;
    get active() {
        return this._active;
    }
    constructor(env: Env, parent: EditorContainer = null, mode: TSplitMode = "none", instances: AnyFileInstance[] = []) {
        super();
        this._env = env;
        this.mode = mode;
        this.instances = instances;
        this.parent = parent;
        if (!parent) this._active = true;
        this._env.on("activeInstance", this.handleActiveInstance);
        this._env.on("openInstance", this.handleOpenInstance);
    }
    handleActiveInstance = ({ instance }: EnvEventMap["activeInstance"]) => {
        if (this.instances.indexOf(instance) !== -1) this._active = true;
        else this._active = false;
        this.emitState();
    };
    handleOpenInstance = (instance: EnvEventMap["openInstance"]) => {
        if (this.active) this.instances = [...this.instances, instance];
        const handleInstanceDestroy = () => {
            this.instances = this.instances.filter(i => i !== instance);
            if (!this.instances.length) this.destroy();
            instance.off("destroy", handleInstanceDestroy);
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
        this.emitState();
    }
    destroy() {
        if (this.parent) {
            this.parent.unsplit();
            this._env.off("activeInstance", this.handleActiveInstance);
            this._env.off("openInstance", this.handleOpenInstance);
        } else {
            this.instances = [];
        }
        this.emitState();
    }
    emitState() {
        const { instances, children, mode } = this;
        this.emit("state", { instances, children, mode });
    }
}
