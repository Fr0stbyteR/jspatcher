import { DefaultWebMIDIObject } from "./Base";
import { IJSPatcherObjectMeta } from "../../types";
import { Bang, isBang } from "../Base";

export class midiIn extends DefaultWebMIDIObject<{}, { midiAccess: WebMidi.MIDIAccess; search: string; port: WebMidi.MIDIInput }, [string | Bang], [Uint8Array, WebMidi.MIDIInput], [string]> {
    static description = "Get MIDI input from device name or ID";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "string to fetch device name or ID, bang to output MIDI port instance"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "MIDI message: Uint8Array"
    }, {
        type: "object",
        description: "Instance: MIDIPort"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Device name or ID"
    }];
    state = { midiAccess: undefined as WebMidi.MIDIAccess, search: undefined as string, port: undefined as WebMidi.MIDIInput };
    handleDeviceChange = async () => {
        const { midiAccess } = this.state;
        if (!midiAccess) {
            this.error("MIDIAccess not available.");
            return;
        }
        const devices: WebMidi.MIDIInput[] = [];
        midiAccess.inputs.forEach(v => devices.push(v));
        const enums = devices.map(d => d.name || d.id);
        const { meta } = this;
        meta.args[0] = { ...midiIn.args[0], type: "enum", enums };
        this.setMeta(meta);
    };
    handleMIDIMessage = (e: WebMidi.MIDIMessageEvent) => this.outlet(0, e.data);
    newSearch = async (search?: string) => {
        this.state.search = search;
        const { midiAccess } = this.state;
        if (!midiAccess) {
            this.error("MIDIAccess not available.");
            return;
        }
        const devices: WebMidi.MIDIInput[] = [];
        midiAccess.inputs.forEach(v => devices.push(v));
        for (let i = 0; i < devices.length; i++) {
            const port = devices[i];
            if (!search || port.id === search || port.name === search) {
                if (port !== this.state.port) {
                    if (this.state.port) this.state.port.removeEventListener("midimessage", this.handleMIDIMessage);
                    this.state.port = port;
                    port.addEventListener("midimessage", this.handleMIDIMessage);
                    break;
                }
            }
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("postInit", async () => {
            const search = this.box.args[0];
            try {
                const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
                this.state.midiAccess = midiAccess;
                midiAccess.addEventListener("statechange", this.handleDeviceChange);
                this.handleDeviceChange();
                this.newSearch(search);
            } catch (e) {
                this.error(e);
            }
        });
        this.on("updateArgs", (args: [string?]) => {
            this.newSearch(args[0]);
        });
        this.on("updateProps", () => {
            this.newSearch(this.state.search);
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    await this.newSearch(data);
                }
                if (this.state.port) this.outlet(1, this.state.port);
            }
        });
        this.on("destroy", () => {
            if (this.state.midiAccess) this.state.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
            if (this.state.port) this.state.port.removeEventListener("midimessage", this.handleMIDIMessage);
        });
    }
}

export class midiOut extends DefaultWebMIDIObject<{}, { midiAccess: WebMidi.MIDIAccess; search: string; port: WebMidi.MIDIOutput }, [Uint8Array | number[] | string | Bang], [WebMidi.MIDIOutput], [string]> {
    static description = "Get MIDI output from device name or ID";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Uint8Array or number[] to output MIDI message, string to fetch device name or ID, bang to output MIDI port instance"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "Instance: MIDIPort"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Device name or ID"
    }];
    state = { midiAccess: undefined as WebMidi.MIDIAccess, search: undefined as string, port: undefined as WebMidi.MIDIOutput };
    handleDeviceChange = async () => {
        const { midiAccess } = this.state;
        if (!midiAccess) {
            this.error("MIDIAccess not available.");
            return;
        }
        const devices: WebMidi.MIDIOutput[] = [];
        midiAccess.outputs.forEach(v => devices.push(v));
        const enums = devices.map(d => d.name || d.id);
        const { meta } = this;
        meta.args[0] = { ...midiOut.args[0], type: "enum", enums };
        this.setMeta(meta);
    };
    newSearch = async (search?: string) => {
        this.state.search = search;
        const { midiAccess } = this.state;
        if (!midiAccess) {
            this.error("MIDIAccess not available.");
            return;
        }
        const devices: WebMidi.MIDIOutput[] = [];
        midiAccess.outputs.forEach(v => devices.push(v));
        for (let i = 0; i < devices.length; i++) {
            const port = devices[i];
            if (!search || port.id === search || port.name === search) {
                this.state.port = port;
                break;
            }
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("postInit", async () => {
            const search = this.box.args[0];
            try {
                const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
                this.state.midiAccess = midiAccess;
                midiAccess.addEventListener("statechange", this.handleDeviceChange);
                this.handleDeviceChange();
                this.newSearch(search);
            } catch (e) {
                this.error(e);
            }
        });
        this.on("updateArgs", (args: [string?]) => {
            this.newSearch(args[0]);
        });
        this.on("updateProps", () => {
            this.newSearch(this.state.search);
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    if (typeof data === "string") {
                        await this.newSearch(data);
                    } else {
                        if (this.state.port) this.state.port.send(data);
                        return;
                    }
                }
                if (this.state.port) this.outlet(0, this.state.port);
            }
        });
        this.on("destroy", () => {
            if (this.state.midiAccess) this.state.midiAccess.removeEventListener("statechange", this.handleDeviceChange);
        });
    }
}
