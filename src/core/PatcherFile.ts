import Patcher from "./Patcher";
import ProjectItem from "./file/ProjectItem";

export default class PatcherFile extends ProjectItem {
    type = "patcher" as const;
    async instantiate() {
        const patcher: Patcher = new Patcher(this);
        await patcher.init(this.data, this.name);
        return patcher;
    }
}
