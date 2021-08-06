import TypedEventEmitter from "../utils/TypedEventEmitter";
import { ab2str, str2ab } from "../utils/utils";
import type Env from "./Env";
import type FileInstance from "./file/FileInstance";
import type PersistentProjectFile from "./file/PersistentProjectFile";
import type { IJSPatcherEnv } from "./Env";
import type { IPropsMeta } from "./objects/base/AbstractObject";
import type { IPackageManager } from "./PkgMgr";
import type { TDependencies } from "./types";

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
    pkgMgr: IPackageManager;
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
    readonly projectFilename = ".jspatproj";
    readonly env: IJSPatcherEnv;
    readonly pkgMgr: IPackageManager;
    readonly instances: FileInstance[];
    readonly props: ProjectProps = {
        dependencies: Project.props.dependencies.default,
        name: Project.props.name.default,
        author: Project.props.author.default,
        version: Project.props.version.default
    };
    get audioCtx() {
        return (this.env as Env).audioCtx;
    }
    constructor(envIn: IJSPatcherEnv, pkgMgr: IPackageManager) {
        super();
        this.env = envIn;
        this.pkgMgr = pkgMgr;
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
        await this.init();
    }
    async init() {
        try {
            const item = this.env.fileMgr.getProjectItemFromPath(`./${this.projectFilename}`) as PersistentProjectFile;
            const json = JSON.parse(ab2str(item.data)) as ProjectProps;
            this.setProps(json);
        } catch (error) {
            const data = str2ab(JSON.stringify(this.props));
            await this.env.fileMgr.projectRoot.addFile(this.projectFilename, data);
        }
    }
    async unload() {
        for (const i of this.env.instances) {
            if (i.project === this) await i.destroy();
        }
        await this.emit("unload");
    }
}
