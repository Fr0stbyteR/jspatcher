import * as React from "react";
import JSPAudioNode from "./AudioNode";
import { TMeta, TPropsMeta } from "../../types";
import { Bang } from "../Base";
import { DefaultUI } from "../BaseUI";

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
    };
    state = { node: undefined as MediaStreamAudioSourceNode, stream: undefined as MediaStream, search: undefined as string };
    handleDeviceChange = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const enums = devices.filter(d => d.kind === "audioinput").map(d => d.label || d.deviceId);
        const { meta } = this;
        meta.args[0] = { ...AudioIn.args[0], type: "enum", enums };
        this.meta = meta;
    };
    newSearch = async (search?: string) => {
        this.state.search = search;
        let deviceId: string;
        if (search) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const device = devices.find(d => d.kind === "audioinput" && (d.deviceId === search || d.label === search));
            if (device) deviceId = device.deviceId;
        }
        this.state.stream = await navigator.mediaDevices.getUserMedia({ audio: this.getConstraints(deviceId) });
        if (this.state.stream) this.resetNode();
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("postInit", () => {
            const search = this.box.args[0];
            navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
            this.handleDeviceChange();
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
        this.on("destroy", () => {
            navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
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
        if (this.state.stream) {
            this.node = this.audioCtx.createMediaStreamSource(this.state.stream);
            this.node.channelInterpretation = "discrete";
        }
        this.outletConnections[0] = { node: this.node, index: 0 };
        this.connectAudio();
    }
}
const supportSetSinkId = window.MediaStreamAudioDestinationNode && HTMLMediaElement.prototype.setSinkId;
export class AudioOut extends JSPAudioNode<MediaStreamAudioDestinationNode | AudioDestinationNode, { search?: string; audio?: HTMLAudioElement; msadn?: MediaStreamAudioDestinationNode }, [string | Bang], [null, MediaStreamAudioDestinationNode | AudioDestinationNode], [string], Constraints> {
    static description = "Get Audio output from device name or ID (if supported)";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "signal",
        description: "Node connection, string to fetch device name or ID, bang to output Node"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: `Instance: ${supportSetSinkId ? "MediaStreamAudioDestinationNode | " : ""}AudioDestinationNode`
    }];
    static args = supportSetSinkId ? AudioIn.args : [];
    static props = supportSetSinkId ? AudioIn.props : {};
    static ui = supportSetSinkId ? class AudioOutUI extends DefaultUI<AudioOut> {
        refContainer = React.createRef<HTMLDivElement>();
        componentDidMount() {
            super.componentDidMount();
            const div = this.refContainer.current;
            const { audio } = this.object.state;
            if (div && audio) {
                audio.style.display = "none";
                div.appendChild(audio);
            }
        }
        render() {
            const textContainerProps = { ...this.props.textContainerProps, ref: this.refContainer };
            return (
                <DefaultUI textContainerProps={textContainerProps} {...this.props} />
            );
        }
    } : DefaultUI;
    state = supportSetSinkId ? { node: this.audioCtx.destination, msadn: this.audioCtx.createMediaStreamDestination(), audio: new Audio(), search: undefined as string } : { node: this.audioCtx.destination };
    inletConnections = [{ node: this.node, index: 0 }];
    handleDeviceChange = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const enums = devices.filter(d => d.kind === "audiooutput").map(d => d.label || d.deviceId);
        const { meta } = this;
        meta.args[0] = { ...AudioOut.args[0], type: "enum", enums };
        this.meta = meta;
    };
    newSearch = async (search?: string) => {
        if (!supportSetSinkId) return;
        this.state.search = search;
        if (!search || search === "default") {
            this.resetNode();
            return;
        }
        const { audio } = this.state;
        let deviceId = audio.sinkId || "default";
        const devices = await navigator.mediaDevices.enumerateDevices();
        const device = devices.find(d => d.kind === "audiooutput" && (d.deviceId === search || d.label === search));
        if (device) deviceId = device.deviceId;
        if (audio.sinkId !== deviceId) {
            if (audio.played) audio.pause();
            audio.setSinkId(deviceId);
            audio.play();
        }
        this.resetNode(true);
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("postInit", () => {
            this.node.channelInterpretation = "discrete";
            if (supportSetSinkId) {
                this.state.msadn.channelInterpretation = "discrete";
                const { audio, msadn } = this.state;
                const { stream } = msadn;
                if ("srcObject" in audio) audio.srcObject = stream;
                else (audio as HTMLAudioElement).src = URL.createObjectURL(stream);
                const search = this.box.args[0];
                navigator.mediaDevices.addEventListener("devicechange", this.handleDeviceChange);
                this.on("destroy", () => {
                    navigator.mediaDevices.removeEventListener("devicechange", this.handleDeviceChange);
                });
                this.handleDeviceChange();
                this.newSearch(search);
            }
        });
        this.on("updateArgs", (args: [string]) => {
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
    resetNode(msadn?: boolean) {
        if (msadn) {
            if (this.node !== this.state.msadn) {
                this.disconnectAudio();
                this.node = this.state.msadn;
                this.inletConnections[0] = { node: this.node, index: 0 };
                this.connectAudio();
            }
        } else {
            if (this.node !== this.audioCtx.destination) {
                this.disconnectAudio();
                this.node = this.audioCtx.destination;
                this.inletConnections[0] = { node: this.node, index: 0 };
                this.connectAudio();
            }
        }
    }
}
