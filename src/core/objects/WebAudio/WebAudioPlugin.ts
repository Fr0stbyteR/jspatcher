import { Bang, BaseAudioObject } from "../Base";
import { TMIDIEvent, TBPF, TMeta, TInletMeta, TOutletMeta } from "../../types";
import { DOMUI, DOMUIState } from "../BaseUI";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";

interface WebAudioPluginManifest {
    documentation: string;
    name: string;
    thumbnail: string;
    vendor: string;
    category: string;
    version: string;
}
declare class WebAudioPluginNode extends AudioNode {
    inputChannelCount(): number;
    outputChannelCount(): number;
    onMidi(data: number[] | Uint8Array): any;
    setParam(key: string, value: number): any;
    getParam(key: string): number;
}
declare class WebAudioPlugin {
    constructor(audioCtx: AudioContext, baseUrl: string)
    load(): Promise<WebAudioPluginNode>;
    loadGui(): Promise<ChildNode>;
}
const AWN: typeof AudioWorkletNode = window.AudioWorkletNode ? AudioWorkletNode : null;

class PluginUI extends DOMUI<Plugin> {
    state: DOMUIState = { ...this.state, children: this.object.state.children };
}

export type S = { merger: ChannelMergerNode; splitter: ChannelSplitterNode; node: WebAudioPluginNode; children: ChildNode[] };
type I = [Bang | number | string | TMIDIEvent | { [key: string]: TBPF }, ...TBPF[]];
type O = (null | AudioNode)[];
export default class Plugin extends BaseAudioObject<{}, S, I, O, [string], {}, DOMUIState> {
    static description = "Dynamically load WebAudioPlugin";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the instance, url to load, or a param-bpf map, or a MIDI event"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "WebAudioPlugin instance"
    }];
    static args: TMeta["args"] = [{
        type: "string",
        optional: false,
        description: "WebAudioPlugin URL"
    }];
    static ui = PluginUI;
    state = { merger: undefined, splitter: undefined, node: undefined, children: [] } as S;
    _meta: TMeta = Plugin.meta;
    get meta() {
        return this._meta;
    }
    set meta(metaIn: TMeta) {
        this._meta = metaIn;
        this.emit("metaChanged", this._meta);
    }
    async load(url: string) {
        const address = `${url}/main.js`;
        let name: string;
        let vendor: string;
        let Constructor: typeof WebAudioPlugin;
        try {
            const r = await fetch(`${url}/main.json`);
            const manifest = await r.json() as WebAudioPluginManifest;
            name = manifest.name;
            vendor = manifest.vendor;
        } catch (e) {
            this.error(e.message);
        }
        const executor = (resolve: (script: HTMLScriptElement) => void, reject: (reason?: Error) => void) => {
            const script = document.createElement("script");
            script.async = true;
            script.src = address;
            script.type = "module";
            script.addEventListener("load", () => resolve(script));
            script.addEventListener("error", () => reject(new Error(`Error loading script: ${address}`)));
            script.addEventListener("abort", () => reject(new Error(`Script loading aborted: ${address}`)));
            document.head.appendChild(script);
        };
        try {
            await new Promise(executor);
            Constructor = window[vendor + name as any] as unknown as typeof WebAudioPlugin;
        } catch (e) {
            if (e) this.error((e as Error).message);
        }
        this.disconnectAudio();
        this.handleDestroy();
        const factory = new Constructor(this.audioCtx, url);
        const node = await factory.load();
        const element = await factory.loadGui();
        this.state.children = [element];
        this.updateUI({ children: this.state.children });

        let splitter: ChannelSplitterNode;
        let merger: ChannelMergerNode;
        node.channelInterpretation = "discrete";
        const { audioCtx } = this.patcher.env;
        const inlets = node.inputChannelCount();
        const outlets = node.outputChannelCount();
        if (inlets) {
            merger = audioCtx.createChannelMerger(inlets);
            merger.channelInterpretation = "discrete";
            merger.connect(node, 0, 0);
        }
        if (outlets) {
            splitter = audioCtx.createChannelSplitter(outlets);
            node.connect(splitter, 0, 0);
        }
        Object.assign(this.state, { merger, splitter, node } as S);
        const Ctor = this.constructor as typeof Plugin;
        const firstInletMeta = Ctor.inlets[0];
        const firstInletSignalMeta: TInletMeta = { ...firstInletMeta, type: "signal" };
        const inletMeta: TInletMeta = { isHot: false, type: "signal", description: "Node connection" };
        const audioParamInletMeta: TInletMeta = { isHot: false, type: "signal", description: ": bpf or node connection" };
        const outletMeta: TOutletMeta = { type: "signal", description: "Node connection" };
        const lastOutletMeta = Ctor.outlets[0];
        const factoryMeta = Ctor.meta;
        for (let i = 0; i < inlets; i++) {
            if (i === 0) factoryMeta.inlets[i] = inlets ? firstInletSignalMeta : firstInletMeta;
            else factoryMeta.inlets[i] = inletMeta;
            this.inletConnections[i] = { node: merger, index: i };
        }
        for (let i = 0; i < outlets; i++) {
            factoryMeta.outlets[i] = outletMeta;
            this.outletConnections[i] = { node: splitter, index: i };
        }
        factoryMeta.outlets[outlets] = lastOutletMeta;
        if (node instanceof AWN) {
            const audioParams: string[] = [];
            node.parameters.forEach((v, k) => audioParams.push(k));
            for (let i = inlets || 1; i < (inlets || 1) + audioParams.length; i++) {
                const path = audioParams[i - (inlets || 1)];
                const param = node.parameters.get(path);
                const { defaultValue, minValue, maxValue } = param;
                factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
                this.inletConnections[i] = { node: param };
            }
        }
        this.meta = factoryMeta;
        this.inlets = (inlets || 1) + (node instanceof AWN ? node.parameters.size : 0);
        this.outlets = outlets + 1;
        this.connectAudio();
        this.outlet(this.outlets - 1, this.state.node);
    }
    handleDestroy = () => {
        const { merger, node } = this.state;
        if (merger) merger.disconnect();
        if (node) {
            node.disconnect();
            // node.destroy();
        }
    };
    handlePreInit = () => undefined as any;
    handlePostInit = async () => {
        if (this.box.args[0]) await this.load(this.box.args[0]);
    };
    handleUpdateArgs = async (args: Partial<[string]>): Promise<void> => {
        if (typeof args[0] === "string") await this.load(this.box.args[0]);
    };
    handleInlet = async ({ data, inlet }: { data: I[number]; inlet: number }) => {
        if (inlet === 0) {
            if (data instanceof Bang) {
                if (this.state.node) this.outlet(this.outlets - 1, this.state.node);
            } else if (typeof data === "string") {
                await this.load(data);
            } else if (isMIDIEvent(data)) {
                if (this.state.node) this.state.node.onMidi(data);
            } else if (typeof data === "object") {
                if (this.state.node) {
                    for (const key in data) {
                        try {
                            const bpf = decodeLine((data as { [key: string]: TBPF })[key]);
                            if (this.state.node instanceof AWN) this.applyBPF(this.state.node.parameters.get(key), bpf);
                            else this.state.node.setParam(key, bpf[bpf.length - 1][0]);
                        } catch (e) {
                            this.error(e.message);
                        }
                    }
                }
            }
        } else if (this.state.node instanceof AWN) {
            const con = this.inletConnections[inlet].node;
            if (con instanceof AudioParam) {
                try {
                    const bpf = decodeLine(data as TBPF);
                    this.applyBPF(con, bpf);
                } catch (e) {
                    this.error(e.message);
                }
            }
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
        this.on("postInit", this.handlePostInit);
        this.on("updateArgs", this.handleUpdateArgs);
        this.on("inlet", this.handleInlet);
        this.on("destroy", this.handleDestroy);
    }
}
