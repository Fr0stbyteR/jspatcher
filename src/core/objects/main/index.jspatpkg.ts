import In from "./In";
import Out from "./Out";
import AudioIn from "./AudioIn";
import AudioOut from "./AudioOut";
import SubPatcher from "./SubPatcher";
import FaustPatcher from "./FaustPatcher";
import GenPatcher from "./GenPatcher";
import BPatcher from "./BPatcher";
import DspSubPatcher from "./DspSubPatcher";
import Buffer from "./Buffer";
import Record from "./Record";
import Plugin from "./WebAudioModule";
import share from "./Share";

export default async () => ({
    in: In,
    out: Out,
    "in~": AudioIn,
    "out~": AudioOut,
    patcher: SubPatcher,
    p: SubPatcher,
    pdsp: DspSubPatcher,
    faustPatcher: FaustPatcher,
    pfaust: FaustPatcher,
    gen: GenPatcher,
    bpatcher: BPatcher,
    "buffer~": Buffer,
    "record~": Record,
    "plugin~": Plugin,
    share
});
