import AudioEditor from "./AudioEditor";
import PatcherAudio from "./PatcherAudio";
import ProjectItem from "../file/ProjectItem";

export default class AudioFile extends ProjectItem {
    type = "audio" as const;
    async instantiate(): Promise<PatcherAudio> {
        return PatcherAudio.fromProjectItem(this);
    }
    async instantiateEditor(): Promise<AudioEditor> {
        return AudioEditor.fromProjectItem(this);
    }
}
