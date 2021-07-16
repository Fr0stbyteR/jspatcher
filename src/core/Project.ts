import TypedEventEmitter from "../utils/TypedEventEmitter";
import Env from "./Env";
import FileInstance from "./file/FileInstance";
import { PackageManager } from "./PkgMgr";
import { TDependencies, IPropsMeta } from "./types";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export interface ProjectEventMap {
    "propsChanged": Partial<ProjectProps>;
    "save": never;
    "unload": never;
}
export interface ProjectProps {
    dependencies: TDependencies;
    name: string;
    author: string;
    version: string;
}

export interface IProject extends TypedEventEmitter<ProjectEventMap> {
    pkgMgr: PackageManager;
}

export default class Project extends TypedEventEmitter<ProjectEventMap> {
    static props: IPropsMeta<ProjectProps> = {
        dependencies: {
            type: "object",
            description: "Project dependencies [id, url]",
            default: []
        },
        name: {
            type: "string",
            description: "Project name",
            default: "Untitled"
        },
        author: {
            type: "string",
            description: "Author",
            default: "Anonymous"
        },
        version: {
            type: "string",
            description: "Current version",
            default: "0.0.0"
        }
    };
    readonly env: Env;
    readonly pkgMgr: PackageManager;
    readonly instances: FileInstance[];
    readonly audioCtx = new AudioContext({ latencyHint: 0.00001 });
    readonly props: ProjectProps = {
        dependencies: Project.props.dependencies.default,
        name: Project.props.name.default,
        author: Project.props.author.default,
        version: Project.props.version.default
    };
    constructor(envIn: Env) {
        super();
        this.env = envIn;
        this.pkgMgr = new PackageManager(this.env.pkgMgr);
    }
    setProps(props: Partial<ProjectProps>) {
        let changed = false;
        for (const keyIn in props) {
            const key = keyIn as keyof ProjectProps;
            if (this.props[key] === props[key]) continue;
            changed = true;
            (this.props as any)[key] = props[key];
        }
        if (changed) this.emit("propsChanged", props);
    }
    async save() {
        await this.emit("save");
    }
    async load(clean = false) {
        await this.env.fileMgr.init(clean);
    }
    async unload() {
        for (const i of this.env.instances) {
            if (i.project === this) await i.destroy();
        }
        await this.emit("unload");
    }
}
