import { Bang, DefaultObject, isBang } from "../Base";
import { IJSPatcherObjectMeta } from "../../types";

export default class audioContext extends DefaultObject<{}, {}, [Bang], [AudioContext]> {
    static description = "Get currrent patcher's audio context";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Output current audio context"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "Current audio context"
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
                if (isBang(data)) this.outlet(0, this.patcher.audioCtx);
            }
        });
    }
}
