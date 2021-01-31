import TempItem from "./TempItem";

export default class TempData extends TempItem {
    type = "text" as const;
    async instantiate(): Promise<any> {
        return this.data;
    }
}
