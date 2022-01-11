import PatcherAudio from "../../audio/PatcherAudio";
import Patcher from "../../patcher/Patcher";
import DefaultImporter from "../importer/DefaultImporter";

export default async () => DefaultImporter.import("api", {
    Patcher,
    PatcherAudio
}, true);
