import TempItem from "../file/TempItem";
import PatcherAudio from "./PatcherAudio";

export default class TempAudioFile extends TempItem {
    type = "audio" as const;
    get data(): PatcherAudio {
        return this._data;
    }
    async instantiate() {
        this.data.on("changed", () => this.save(this.data));
        return this.data;
    }
}
