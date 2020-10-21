import Patcher from "./Patcher";
import ProjectItem from "./file/ProjectItem";

export default class PatcherFile extends ProjectItem {
    type = "patcher" as const;
    async instantiate() {
        const { env } = this.fileMgr;
        const patcher = new Patcher(env);
        this.inspectInstance(patcher);
        await patcher.init(this.data);
        return patcher;
    }
}
