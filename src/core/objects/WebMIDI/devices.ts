import { StrictDropdownItemProps } from "semantic-ui-react";
import { Bang, isBang } from "../Base";
import { DefaultWebMIDIObject } from "./Base";
import { TMeta, TPropsMeta } from "../../types";

export class midiDevices extends DefaultWebMIDIObject<{}, { midiAccess: WebMidi.MIDIAccess }, [Bang | WebMidi.MIDIPortType[]], [WebMidi.MIDIPort[], StrictDropdownItemProps[]], WebMidi.MIDIPortType[], { autoUpdate: boolean }> {
    static description = "Enumerate MIDI devices";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "object",
        description: "Bang to enumerate, MIDIPortType[] to use a filter"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "Array of MIDIPort"
    }, {
        type: "object",
        description: "Array of DropdownItemProps"
    }];
    static args: TMeta["args"] = [{
        type: "enum",
        varLength: true,
        optional: true,
        enums: ["input", "output"],
        default: ["input", "output"],
        description: "Output only kinds of devices"
    }];
    static props: TPropsMeta<{ autoUpdate: boolean }> = {
        autoUpdate: {
            type: "boolean",
            default: true,
            description: "Auto output devices when devices change"
        }
    };
    state = { midiAccess: undefined as WebMidi.MIDIAccess };
    handleDeviceChange = async () => {
        if (!this.getProp("autoUpdate")) return;
        const filters = this.box.args.slice();
        if (!filters.length) filters.push("input", "output");
        const { midiAccess } = this.state;
        if (!midiAccess) {
            this.error("MIDIAccess not available.");
            return;
        }
        const devices: WebMidi.MIDIPort[] = [];
        if (filters.indexOf("input") !== -1) midiAccess.inputs.forEach(v => devices.push(v));
        if (filters.indexOf("output") !== -1) midiAccess.outputs.forEach(v => devices.push(v));
        const options = devices.map((d, key) => {
            const { type, name, id } = d;
            return { key, icon: { input: "sign-in", output: "sign-out" }[type], text: name || id, value: id };
        });
        this.outletAll([devices, options]);
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("postInit", async () => {
            try {
                const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
                this.state.midiAccess = midiAccess;
                midiAccess.addEventListener("statechange", this.handleDeviceChange);
                if (this.getProp("autoUpdate")) this.handleDeviceChange();
            } catch (e) {
                this.error(e);
            }
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                let filters: WebMidi.MIDIPortType[];
                if (isBang(data)) {
                    filters = this.box.args.slice();
                    if (!filters.length) filters.push("input", "output");
                } else {
                    filters = data.slice();
                }
                const { midiAccess } = this.state;
                if (!midiAccess) {
                    this.error("MIDIAccess not available.");
                    return;
                }
                const devices: WebMidi.MIDIPort[] = [];
                if (filters.indexOf("input") !== -1) midiAccess.inputs.forEach(v => devices.push(v));
                if (filters.indexOf("output") !== -1) midiAccess.outputs.forEach(v => devices.push(v));
                const options = devices.map((d, key) => {
                    const { type, name, id } = d;
                    return { key, icon: { input: "sign-in", output: "sign-out" }[type], text: name || id, value: id };
                });
                this.outletAll([devices, options]);
            }
        });
        this.on("destroy", () => {
            if (this.state.midiAccess) this.state.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
        });
    }
}
