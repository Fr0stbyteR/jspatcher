import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import Env from "./Env";
import FileInstance from "./file/FileInstance";
import { PackageManager } from "./PkgMgr";
import { TSharedData, TSharedDataConsumers } from "./types";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export interface ProjectEventMap {
}

export default class Project extends TypedEventEmitter<ProjectEventMap> {
    readonly env: Env;
    readonly pkgMgr: PackageManager;
    readonly instances: FileInstance[];
    readonly audioCtx = new AudioContext({ latencyHint: 0.00001 });
    readonly data: TSharedData = {};
    readonly dataConsumers: TSharedDataConsumers = {};
    get activePatcher() {
        return this.env.activeInstance;
    }
    constructor(envIn: Env) {
        super();
        this.env = envIn;
        this.pkgMgr = new PackageManager(this);
    }
}
