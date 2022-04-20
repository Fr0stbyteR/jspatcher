import type { FaustCompiler } from "@shren/faustwasm";
import Bang, { isBang } from "../base/Bang";
import type { IInletsMeta, IOutletsMeta } from "../base/AbstractObject";

import DefaultObject from "../base/DefaultObject";

export default class faustCompiler extends DefaultObject<{}, {}, [Bang], [FaustCompiler]> {
    static package = "Faust";
    static description = "Get FaustCompiler instance";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "bang",
        description: "Output FaustCompiler instance"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "FaustCompiler instance"
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
                if (isBang(data)) this.outlet(0, await this.env.getFaustCompiler());
            }
        });
    }
}
