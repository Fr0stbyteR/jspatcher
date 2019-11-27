import { Bang, DefaultObject } from "../Base";
import { TMeta } from "../../types";

export default class audioContext extends DefaultObject<{}, {}, [Bang], [AudioContext]> {
    static description = "Get currrent patcher's audio context";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Output current audio context"
    }];
    static outlets: TMeta["outlets"] = [{
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
                if (data instanceof Bang) this.outlet(0, this.patcher.env.audioCtx);
            }
        });
    }
}
