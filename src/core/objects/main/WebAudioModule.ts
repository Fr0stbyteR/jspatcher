import type { WebAudioModule, WamNode } from "@webaudiomodules/api";
import Bang, { isBang } from "../base/Bang";
import BaseObject from "../base/BaseObject";
import DOMUI, { DOMUIState } from "../base/DOMUI";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";
import type Env from "../../Env";
import type { TMIDIEvent, TBPF } from "../../types";
import type { IInletMeta, IOutletMeta, IInletsMeta, IOutletsMeta, IArgsMeta } from "../base/AbstractObject";

class PluginUI extends DOMUI<Plugin> {
    state: DOMUIState = { ...this.state, children: this.object._.children };
}

export interface IS {
    splitter: ChannelSplitterNode;
    merger: ChannelMergerNode;
    node: WamNode;
    plugin: WebAudioModule;
    params: string[];
    children: ChildNode[];
}

type I = [Bang | number | string | TMIDIEvent | Record<string, TBPF>, ...TBPF[]];
type O = (null | WamNode)[];
export default class Plugin extends BaseObject<{}, {}, I, O, [string], {}, DOMUIState> {
    static description = "Dynamically load WebAudioModule";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "A bang to output the instance, url to load, or a param-bpf map, or a MIDI event"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "WebAudioModule instance"
    }];
    static args: IArgsMeta = [{
        type: "string",
        optional: false,
        description: "WebAudioModule URL"
    }];
    static UI = PluginUI;
    _: IS = { merger: undefined, splitter: undefined, node: undefined, plugin: undefined, params: [], children: [] };
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
            plugin = await WAPCtor.createInstance((this.env as Env).wamGroupId, this.audioCtx);
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
        this._.children = [element];
        this.updateUI({ children: this._.children });
        node.channelInterpretation = "discrete";
        const inlets = node.numberOfInputs;
        const outlets = node.numberOfOutputs;
        Object.assign(this._, { node, plugin });
        const Ctor = this.constructor as typeof Plugin;
        const firstInletMeta = Ctor.inlets[0];
        const firstInletSignalMeta: IInletMeta = { ...firstInletMeta, type: "signal" };
        const inletMeta: IInletMeta = { isHot: false, type: "signal", description: "Node connection" };
        const audioParamInletMeta: IInletMeta = { isHot: false, type: "number", description: ": bpf or node connection" };
        const outletMeta: IOutletMeta = { type: "signal", description: "Node connection" };
        const lastOutletMeta = Ctor.outlets[0];
        const factoryMeta = Ctor.meta as this["meta"];
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
        this._.params = params;
        for (let i = inlets || 1; i < (inlets || 1) + params.length; i++) {
            const path = params[i - (inlets || 1)];
            const param = paramInfo[path];
            const { defaultValue, minValue, maxValue, label } = param;
            factoryMeta.inlets[i] = { ...audioParamInletMeta, description: `${label || path}${audioParamInletMeta.description}: ${defaultValue} (${minValue} - ${maxValue})` };
        }
        this.setMeta(factoryMeta);
        this.inlets = (inlets || 1) + params.length;
        this.outlets = outlets + 1;
        this.connectAudio();
        this.outlet(this.outlets - 1, this._.node);
    }
    handleDestroy = () => {
        const { node, plugin } = this._;
        if (node) {
            node.disconnect();
            node.disconnectEvents();
        }
        if (plugin) {
            plugin.audioNode.destroy();
            if (this._.children?.[0]) plugin.destroyGui(this._.children[0] as Element);
        }
    };
    handlePreInit = () => undefined as any;
    handlePostInit = async () => {
        await this.handleUpdateArgs(this.args);
    };
    handleUpdateArgs = async (args: Partial<[string]>): Promise<void> => {
        if (typeof args[0] === "string") await this.load(this.box.args[0]);
    };
    handleInlet = async ({ data, inlet }: { data: I[number]; inlet: number }) => {
        if (inlet === 0) {
            if (isBang(data)) {
                if (this._.node) this.outlet(this.outlets - 1, this._.node);
            } else if (typeof data === "string") {
                await this.load(data);
            } else if (isMIDIEvent(data)) {
                const bytes = Array.from(data) as [number, number, number];
                if (this._.node) this._.node.scheduleEvents({ type: "wam-midi", data: { bytes }, time: this.audioCtx.currentTime });
            } else if (typeof data === "object") {
                if (this._.node) {
                    for (const key in data) {
                        try {
                            const bpf = decodeLine((data as Record<string, TBPF>)[key]);
                            let t = 0;
                            bpf.forEach((a) => {
                                if (a.length > 1) t += a[1];
                                this._.node.scheduleEvents({ type: "wam-automation", data: { id: key, value: a[0], normalized: false }, time: this.audioCtx.currentTime + t });
                            });
                            // else this._.node.setParam(key, bpf[bpf.length - 1][0]);
                        } catch (e) {
                            this.error(e.message);
                        }
                    }
                }
            }
        } else {
            if (inlet >= this._.node.numberOfInputs) {
                const key = this._.params[inlet - this._.node.numberOfInputs];
                if (typeof key !== "string") return;
                try {
                    const bpf = decodeLine(data as TBPF);
                    let t = 0;
                    bpf.forEach((a) => {
                        if (a.length > 1) t += a[1];
                        this._.node.scheduleEvents({ type: "wam-automation", data: { id: key, value: a[0], normalized: false }, time: this.audioCtx.currentTime + t });
                    });
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
