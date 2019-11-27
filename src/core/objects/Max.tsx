import "./Max.scss";
import { TMeta } from "../types";
import { DefaultObject } from "./Base";
import { isNumberArray } from "../../utils";

class DefaultMaxObject<D = {}, S = {}, I extends any[] = [], O extends any[] = [], A extends any[] = [], P = {}, U = {}, E = {}> extends DefaultObject<D, S, I, O, A, P, U, E> {
    static package = "Max";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Max/MSP Objects"
}
class mtof extends DefaultMaxObject<{}, {}, [number | number[]], [number | number[]], [], { base: number }> {
    static description = "Convert a MIDI note number to frequency";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "MIDI note: number | number[]"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "The frequency corresponding to the received MIDI pitch value."
    }];
    static props: TMeta["props"] = {
        base: {
            type: "number",
            default: 440,
            description: 'Sets the "base frequency" used when calculating frequency values (e.g., A = 440.). The default base frequency is 440 Hz'
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            const base = this.box.props.base || 440;
            if (inlet === 0) {
                if (typeof data === "number") {
                    this.outlet(0, base * 2 ** ((data - 69) / 12));
                } else if (isNumberArray(data)) {
                    this.outlet(0, data.map(n => base * 2 ** ((n - 69) / 12)));
                }
            }
        });
    }
}
class ftom extends DefaultMaxObject<{}, {}, [number | number[]], [number | number[]], [], { base: number }> {
    static description = "Convert frequency to a MIDI note number";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "frequency value: number | number[]"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "The MIDI note value that corresponds to the input frequency."
    }];
    static props: TMeta["props"] = {
        base: {
            type: "number",
            default: 440,
            description: 'Sets the "base frequency" used when calculating frequency values (e.g., A = 440.). The default base frequency is 440 Hz'
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            const base = this.box.props.base || 440;
            if (inlet === 0) {
                if (typeof data === "number") {
                    this.outlet(0, Math.log(data / base) / Math.log(2) * 12 + 69);
                } else if (isNumberArray(data)) {
                    this.outlet(0, data.map(n => Math.log(n / base) / Math.log(2) * 12 + 69));
                }
            }
        });
    }
}

export default {
    ftom,
    mtof
};
