import PatcherAudio from "./PatcherAudio";
import ProjectItem from "../file/ProjectItem";

export default class AudioFile extends ProjectItem {
    type = "audio" as const;
    async instantiate() {
        const { env } = this.fileMgr;
        const audio = new PatcherAudio(env);
        this.inspectInstance(audio);
        await audio.init(this.data);
        return audio;
    }
}
