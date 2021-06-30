import Patcher from "./Patcher";
import PatcherEditor from "./PatcherEditor";
import TemporaryProjectFile from "../file/TemporaryProjectFile";
import type { RawPatcher } from "../types";
import type { IJSPatcherEnv } from "../Env";
import type { IProject } from "../Project";

export default class TempPatcherFile extends TemporaryProjectFile<RawPatcher> {
    get type() {
        return "patcher" as const;
    }
    async instantiate(envIn: IJSPatcherEnv, projectIn?: IProject) {
        const patcher = new Patcher(envIn, projectIn, this);
        await patcher.load(this.data);
        return patcher;
    }
    async instantiateEditor(envIn: IJSPatcherEnv, projectIn?: IProject) {
        return PatcherEditor.fromProjectItem(this, envIn, projectIn);
    }
}
