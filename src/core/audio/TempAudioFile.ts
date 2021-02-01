import AudioEditor from "./AudioEditor";
import PatcherAudio from "./PatcherAudio";
import TempItem from "../file/TempItem";

export default class TempAudioFile extends TempItem {
    type = "audio" as const;
    get data(): PatcherAudio {
        return this._data;
    }
    async instantiate() {
        return this.data;
    }
    async instantiateEditor(): Promise<AudioEditor> {
        return AudioEditor.fromProjectItem(this);
    }
}
