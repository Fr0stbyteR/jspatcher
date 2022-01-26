import type { SemanticICONS } from "semantic-ui-react";
import FileEditor from "../file/FileEditor";
import History from "../file/History";
import type PersistentProjectFile from "../file/PersistentProjectFile";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";
import type PatcherVideo from "./PatcherVideo";

export interface VideoEditorEventMap {}

export default class VideoEditor extends FileEditor<PatcherVideo, VideoEditorEventMap> {
    static async fromProjectItem({ file, env, project, instanceId }: { file: PersistentProjectFile; env: IJSPatcherEnv; project?: IProject; instanceId: string }) {
        const image = await file.instantiate({ env, project, instanceId }) as PatcherVideo;
        const editor = new this(image);
        return editor.init();
    }
    readonly _history: History<Partial<VideoEditorEventMap>, this>;
    get fileExtension() {
        return "mp4";
    }
    get fileIcon(): SemanticICONS {
        return "video";
    }
    get history() {
        return this._history;
    }
    async init() {
        if (!this.instance.isReady) {
            await new Promise<void>((resolve, reject) => {
                const handleReady = () => {
                    resolve();
                    this.instance.off("ready", handleReady);
                };
                this.instance.on("ready", handleReady);
            });
        }
        this._isReady = true;
        this.emit("ready");
        return this;
    }
    async undo() {}
    async redo() {}
    async copy() {}
    async cut() {}
    async paste() {}
    async deleteSelected() {}
    async selectAll() {}
    onUiResized() {}
}
