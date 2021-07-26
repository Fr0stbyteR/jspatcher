import { WebAudioModule, WamNode } from "wamsdk/src/api";
import { Bang, BaseObject, isBang } from "../Base";
import { TMIDIEvent, TBPF, IJSPatcherObjectMeta, IInletMeta, IOutletMeta } from "../../types";
import { DOMUI, DOMUIState } from "../BaseUI";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";

class PluginUI extends DOMUI<Plugin> {
    state: DOMUIState = { ...this.state, children: this.object.state.children };
}

export type S = { node: WamNode; plugin: WebAudioModule; children: ChildNode[] };
type I = [Bang | number | string | TMIDIEvent | Record<string, TBPF>, ...TBPF[]];
type O = (null | WamNode)[];
export default class Plugin extends BaseObject<{}, S, I, O, [string], {}, DOMUIState> {
    static description = "Dynamically load WebAudioModule";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the instance, url to load, or a param-bpf map, or a MIDI event"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "object",
        description: "WebAudioModule instance"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: false,
        description: "WebAudioModule URL"
    }];
    static UI = PluginUI;
    state = { merger: undefined, splitter: undefined, node: undefined, plugin: undefined, children: [] } as S;
    async load(url: string) {
        let WAPCtor: typeof WebAudioModule;
        let plugin: WebAudioModule;
        try {
            WAPCtor = (await import(/* webpackIgnore: true */url)).default;
        } catch (e) {
            this.error(e.message);
        }
        let node: AudioNode;
        let element: HTMLElement;
        try {
            plugin = await WAPCtor.createInstance(this.audioCtx);
            node = plugin.audioNode;
            element = await plugin.createGui() as HTMLElement;
        } catch (e) {
            if (e) this.error((e as Error).message);
            return;
        }
        this.disconnectAudio();
        this.handleDestroy();
        element.style.width = "100%";
        element.style.height = "100%";
        element.style.position = "absolute";
        this.state.children = [element];
        this.updateUI({ children: this.state.children });
        node.channelInterpretation = "discrete";
        const inlets = node.numberOfInputs;
        const outlets = node.numberOfOutputs;
        Object.assign(this.state, { node, plugin } as S);
        const Ctor = this.constructor as typeof Plugin;
        const firstInletMeta = Ctor.inlets[0];
        const firstInletSignalMeta: IInletMeta = { ...firstInletMeta, type: "signal" };
        const inletMeta: IInletMeta = { isHot: false, type: "signal", description: "Node connection" };
        const audioParamInletMeta: IInletMeta = { isHot: false, type: "number", description: ": bpf or node connection" };
        const outletMeta: IOutletMeta = { type: "signal", description: "Node connection" };
        const lastOutletMeta = Ctor.outlets[0];
        const factoryMeta = Ctor.meta;
        for (let i = 0; i < inlets; i++) {
            if (i === 0) factoryMeta.inlets[i] = inlets ? firstInletSignalMeta : firstInletMeta;
            else factoryMeta.inlets[i] = inletMeta;
            this.inletAudioConnections[i] = { node, index: i };
        }
        for (let i = 0; i < outlets; i++) {
            factoryMeta.outlets[i] = outletMeta;
            this.outletAudioConnections[i] = { node, index: i };
        }
        factoryMeta.outlets[outlets] = lastOutletMeta;
        const paramInfo = await plugin.audioNode.getParameterInfo();
        const params = Object.keys(paramInfo);
        for (let i = inlets || 1; i < (inlets || 1) + params.length; i++) {
            const path = params[i - (inlets || 1)];
            const param = paramInfo[path];
            const { defaultValue, minValue, maxValue } = param;
            factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
        }
        this.setMeta(factoryMeta);
        this.inlets = (inlets || 1) + params.length;
        this.outlets = outlets + 1;
        this.connectAudio();
        this.outlet(this.outlets - 1, this.state.node);
    }
    handleDestroy = () => {
        const { node, plugin } = this.state;
        if (node) {
            node.disconnect();
            node.disconnectEvents();
        }
        if (plugin) {
            plugin.audioNode.destroy();
            if (this.state.children?.[0]) plugin.destroyGui(this.state.children[0] as Element);
        }
    };
    handlePreInit = () => undefined as any;
    handlePostInit = async () => {
        if (this.box.args[0]) await this.load(this.box.args[0]);
        this.on("updateArgs", this.handleUpdateArgs);
    };
    handleUpdateArgs = async (args: Partial<[string]>): Promise<void> => {
        if (typeof args[0] === "string") await this.load(this.box.args[0]);
    };
    handleInlet = async ({ data, inlet }: { data: I[number]; inlet: number }) => {
        if (inlet === 0) {
            if (isBang(data)) {
                if (this.state.node) this.outlet(this.outlets - 1, this.state.node);
            } else if (typeof data === "string") {
                await this.load(data);
            } else if (isMIDIEvent(data)) {
                const bytes = Array.from(data) as [number, number, number];
                if (this.state.node) this.state.node.scheduleEvents({ type: "midi", data: { bytes }, time: this.audioCtx.currentTime });
            } else if (typeof data === "object") {
                if (this.state.node) {
                    for (const key in data) {
                        try {
                            const bpf = decodeLine((data as Record<string, TBPF>)[key]);
                            let t = 0;
                            bpf.forEach((a) => {
                                if (a.length > 1) t += a[1];
                                this.state.node.scheduleEvents({ type: "automation", data: { id: key, value: a[0], normalized: false }, time: this.audioCtx.currentTime + t });
                            });
                            // else this.state.node.setParam(key, bpf[bpf.length - 1][0]);
                        } catch (e) {
                            this.error(e.message);
                        }
                    }
                }
            }
        } else {
            const con = this.inletAudioConnections[inlet].node;
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
        this.on("inlet", this.handleInlet);
        this.on("destroy", this.handleDestroy);
    }
}
