import PatcherAudio from "./PatcherAudio";
import ProjectItem from "../file/ProjectItem";

export default class AudioFile extends ProjectItem {
    type = "audio" as const;
    async instantiate() {
        const audio: PatcherAudio = new PatcherAudio(this);
        await audio.init(this.data.slice(0));
        return audio;
    }
}
