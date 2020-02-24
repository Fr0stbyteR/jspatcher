import JSPAudioNode from "./AudioNode";
import { TMeta, TPropsMeta } from "../../types";
import { Bang } from "../Base";

interface Constraints extends MediaTrackConstraintSet {
    deviceId: string;
    autoGainControl: boolean;
    channelCount: number;
    echoCancellation: boolean;
    latency: number;
    noiseSuppression: boolean;
    sampleRate: number;
    sampleSize: number;
}
export class AudioIn extends JSPAudioNode<MediaStreamAudioSourceNode, { search: string; stream: MediaStream }, [string | Bang], [null, MediaStreamAudioSourceNode], [string], Constraints> {
    static description = "Get Audio input from device name or ID";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "string to fetch device name or ID, bang to output Node"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "signal",
        description: "Node connection"
    }, {
        type: "object",
        description: "Instance: MediaStreamAudioSourceNode"
    }];
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "Device name or ID"
    }];
    static props: TPropsMeta<Omit<Constraints, "deviceId">> = {
        autoGainControl: {
            type: "boolean",
            default: false,
            description: "Automatic gain control"
        },
        channelCount: {
            type: "number",
            default: undefined,
            description: "The number of independent channels of sound"
        },
        echoCancellation: {
            type: "boolean",
            default: false,
            description: "Remove all the sound being played from the input signals recorded by the microphones"
        },
        latency: {
            type: "number",
            default: undefined,
            description: "The latency or latency range, in seconds"
        },
        noiseSuppression: {
            type: "boolean",
            default: false,
            description: "Noise suppression"
        },
        sampleRate: {
            type: "number",
            default: undefined,
            description: "The sample rate in samples per second for the audio data"
        },
        sampleSize: {
            type: "number",
            default: undefined,
            description: "The linear sample size in bits"
        }
    }
    state = { node: undefined as MediaStreamAudioSourceNode, stream: undefined as MediaStream, search: undefined as string };
    newSearch = async (search?: string) => {
        this.state.search = search;
        let deviceId;
        if (search) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const device = devices.find(d => d.kind === "audioinput" && (d.deviceId === search || d.label === search));
            if (device) deviceId = device.deviceId;
        }
        this.state.stream = await navigator.mediaDevices.getUserMedia({ audio: this.getConstraints(deviceId) });
        if (this.state.stream) this.resetNode();
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("postInit", () => {
            const search = this.box.args[0];
            this.newSearch(search);
        });
        this.on("updateArgs", (args: [string?]) => {
            this.newSearch(args[0]);
        });
        this.on("updateProps", () => {
            this.newSearch(this.state.search);
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (!(data instanceof Bang)) {
                    await this.newSearch(data);
                }
                if (this.node) this.outlet(1, this.node);
            }
        });
    }
    getConstraints(deviceId?: string): Constraints {
        return {
            deviceId,
            autoGainControl: this.getProp("autoGainControl"),
            channelCount: this.getProp("channelCount"),
            echoCancellation: this.getProp("echoCancellation"),
            latency: this.getProp("latency"),
            noiseSuppression: this.getProp("noiseSuppression"),
            sampleRate: this.getProp("sampleRate"),
            sampleSize: this.getProp("sampleSize")
        };
    }
    resetNode() {
        this.disconnectAudio();
        this.node = this.audioCtx.createMediaStreamSource(this.state.stream);
        this.node.channelInterpretation = "discrete";
        this.outletConnections[0] = { node: this.node, index: 0 };
        this.connectAudio();
    }
}
