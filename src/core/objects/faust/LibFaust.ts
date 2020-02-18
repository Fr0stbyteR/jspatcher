import { Faust } from "faust2webaudio";
import { Bang, DefaultObject } from "../Base";
import { TMeta } from "../../types";

export default class libFaust extends DefaultObject<{}, {}, [Bang], [Faust]> {
    static description = "Get LibFaust instance";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Output LibFaust instance"
    }];
    static outlets: TMeta["outlets"] = [{
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
                if (data instanceof Bang) this.outlet(0, this.patcher.env.faust);
            }
        });
    }
}
