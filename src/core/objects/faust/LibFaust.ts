import type { Faust } from "faust2webaudio";
import Bang, { isBang } from "../base/Bang";
import type { IInletsMeta, IOutletsMeta } from "../base/AbstractObject";

import DefaultObject from "../base/DefaultObject";

export default class libFaust extends DefaultObject<{}, {}, [Bang], [Faust]> {
    static package = "Faust";
    static description = "Get LibFaust instance";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "bang",
        description: "Output LibFaust instance"
    }];
    static outlets: IOutletsMeta = [{
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
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.outlet(0, await this.env.getFaust());
            }
        });
    }
}
