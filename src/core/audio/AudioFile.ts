import AudioEditor from "./AudioEditor";
import ProjectItem from "../file/ProjectItem";

export default class AudioFile extends ProjectItem {
    type = "audio" as const;
    async instantiate(): Promise<AudioEditor> {
        return AudioEditor.fromProjectItem(this);
    }
}
