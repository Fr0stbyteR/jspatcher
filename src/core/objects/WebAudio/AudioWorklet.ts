import { Bang, DefaultObject } from "../Base";
import Box from "../../Box";
import Patcher from "../../Patcher";
import { TMeta } from "../../types";

export default class audioWorklet extends DefaultObject<{}, {}, [Bang, string], [AudioWorklet, Bang]> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Get currrent patcher's audio worklet from context",
            inlets: [{
                isHot: true,
                type: "bang",
                description: "Output current audio worklet"
            }, {
                isHot: true,
                type: "string",
                description: "Code to add as module"
            }],
            outlets: [{
                type: "object",
                description: "Current audio worklet"
            }, {
                type: "bang",
                description: "Output a bang while module is added"
            }],
            args: [],
            props: []
        };
    }
    state = {};
    audioWorklet: AudioWorklet;
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 2;
        if (!this.patcher.env.audioCtx.audioWorklet) this.error("AudioWorklet not found.");
        else this.audioWorklet = this.patcher.env.audioCtx.audioWorklet;
    }
    fn<I extends [Bang, string], $ extends keyof Pick<I, number>>(data: I[$], inlet: $) {
        if (inlet === 0) {
            if (data instanceof Bang) this.outlet(0, this.audioWorklet);
        } else if (inlet === 1) {
            if (typeof data === "string") {
                try {
                    const url = window.URL.createObjectURL(new Blob([data], { type: "text/javascript" }));
                    this.audioWorklet.addModule(url)
                        .then(() => this.outlet(1, new Bang()))
                        .catch((e: Error) => this.error(e.message));
                } catch (e) {
                    this.error((e as Error).message);
                }
            }
        }
        return this;
    }
}
