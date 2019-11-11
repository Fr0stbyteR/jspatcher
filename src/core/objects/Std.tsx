import * as Util from "util";
import { DefaultObject, Bang } from "./Base";
import Patcher from "../Patcher";
import Box from "../Box";
import "./Std.scss";
import { TMeta } from "../types";

class StdObject<D = {}, S = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P = {}, U = {}> extends DefaultObject<D, S, I, O, A, P, U> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            package: "Std",
            author: "Fr0stbyteR",
            version: "1.0.0",
            description: "Standard Object"
        };
    }
}

class print extends StdObject<{}, { title: string }, [any], [], [string]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Print to console",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Anything to stringify"
            }],
            args: [{
                type: "string",
                optional: true,
                default: "Print",
                description: "Title"
            }]
        };
    }
    state = { title: "Print" };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (args[0]) this.state.title = args[0];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) {
                    this.patcher.newLog("none", this.state.title, "Bang");
                } else {
                    this.patcher.newLog("none", this.state.title, typeof data === "string" ? data : Util.inspect(data));
                }
            }
        });
    }
}
export default { print };
