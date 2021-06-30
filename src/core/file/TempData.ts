import TemporaryProjectFile from "./TemporaryProjectFile";

export default class TempData extends TemporaryProjectFile {
    get type() {
        return "unknown" as const;
    }
    async instantiate(): Promise<any> {
        return this.data;
    }
}
