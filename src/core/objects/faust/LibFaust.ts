import { Faust } from "faust2webaudio";
import { Bang, isBang } from "../base/index.jspatpkg";
import { IJSPatcherObjectMeta } from "../../types";
import DefaultObject from "../base/DefaultObject";

export default class libFaust extends DefaultObject<{}, {}, [Bang], [Faust]> {
    static package = "Faust";
    static description = "Get LibFaust instance";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Output LibFaust instance"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "LibFaust instance"
    }];
    state = {};
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.outlet(0, this.patcher.env.faust);
            }
        });
    }
}
