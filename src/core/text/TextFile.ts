import PatcherText from "./PatcherText";
import ProjectItem from "../file/ProjectItem";

export default class TextFile extends ProjectItem {
    type = "text" as const;
    async instantiate() {
        const text = new PatcherText();
        this.inspectInstance(text);
        await text.init(this.data);
        return text;
    }
}
