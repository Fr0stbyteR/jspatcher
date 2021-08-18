import FaustPatcher from "./FaustPatcher";

export default class GenPatcher extends FaustPatcher {
    static description = "Gen Sub-patcher, compiled to AudioNode";
    type: "faust" | "gen" = "gen";
}
