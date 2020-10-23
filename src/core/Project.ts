import { TypedEventEmitter } from "../utils/TypedEventEmitter";
import Env from "./Env";
import FileInstance from "./file/FileInstance";
import Patcher from "./Patcher";
import { PackageManager } from "./PkgMgr";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export interface ProjectEventMap {
}

export default class Project extends TypedEventEmitter<ProjectEventMap> {
    readonly env: Env;
    readonly pkgMgr: PackageManager;
    readonly instances: FileInstance[];
    readonly audioCtx = new AudioContext({ latencyHint: 0.00001 });
    activePatcher: Patcher;
    constructor(envIn: Env) {
        super();
        this.env = envIn;
        this.pkgMgr = new PackageManager(this);
    }
}
