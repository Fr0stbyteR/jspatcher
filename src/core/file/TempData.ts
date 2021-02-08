import TempItem from "./TempItem";

export default class TempData extends TempItem {
    type = "unknown" as const;
    async instantiate(): Promise<any> {
        return this.data;
    }
}
