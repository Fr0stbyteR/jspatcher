import TemporaryProjectFolder from "./TemporaryProjectFolder";
import AbstractProjectItemManager from "./AbstractProjectItemManager";
import type { IProjectFileOrFolder } from "./AbstractProjectItem";

export default class TemporaryProjectItemManager extends AbstractProjectItemManager {
    root: TemporaryProjectFolder;
    async empty() {
        return true;
    }
    async init(clean?: boolean) {
        this.root = new TemporaryProjectFolder(this, null, null);
        await this.root.init();
        this.emit("ready");
        return this;
    }
    getProjectItemFromPath(path: string) {
        const pathArray = path.split("/");
        const itemArray: IProjectFileOrFolder[] = [this.root];
        for (let i = 0; i < pathArray.length; i++) {
            const id = pathArray[i];
            if (id.length === 0) continue;
            if (id === ".") continue;
            if (id === "..") {
                itemArray.pop();
                continue;
            }
            const cur = itemArray[itemArray.length - 1];
            if (cur.isFolder === false) throw new Error(`${cur.name} from path ${path} is not a folder`);
            const next = cur.findItem(id);
            if (!next) throw new Error(`Cannot find ${id} from path ${path}`);
            itemArray.push(next);
        }
        return itemArray[itemArray.length - 1];
    }
}
