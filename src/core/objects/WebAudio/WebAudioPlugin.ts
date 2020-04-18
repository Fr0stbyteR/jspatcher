import { Bang, BaseAudioObject } from "../Base";
import { TMIDIEvent, TBPF, TMeta, TInletMeta, TOutletMeta } from "../../types";
import { DOMUI, DOMUIState } from "../BaseUI";
import { isMIDIEvent, decodeLine } from "../../../utils/utils";

declare type TypedEvent<T extends string | number | symbol = never, I extends EventInit = {}> = {
    [K in keyof I]: I[K];
} & Event & { type: T };
declare interface TypedEventTarget<M extends Record<string, EventInit & Record<string, any>> = {}> extends EventTarget {
    addEventListener<K extends keyof M>(type: K, listener: (e: TypedEvent<K, M[K]>) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof M>(type: K, listener: (e: TypedEvent<K, M[K]>) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
declare interface WebAudioPluginCreateOptions<S extends Record<string, any> = {}> {
    state?: Partial<S>;
}
/**
 * `WebAudioPlugin` main interface
 *
 * @interface WebAudioPlugin
 * @extends {TypedEventTarget<E>}
 * @template P `AudioParam` names, e.g. `"gain" | "feedback" | "ratio"`
 * @template S State type, e.g. `{ id: string, color: string }`
 * @template E Event map, e.g. `{ midiMessage: { data: Uint8Array } }`
 */
declare interface WebAudioPlugin<P extends string = never, S extends Record<string, any> = {}, E extends Record<string, EventInit & Record<string, any>> = {}> extends TypedEventTarget<E> {
    initialize(state?: Partial<S>): this;
    setState(state: Partial<S>): void;
    getState(): S;
    getParam(key: P): AudioParam;
    setParam(key: P, value: number): void;
    createAudioNode(options?: WebAudioPluginCreateOptions<S>): Promise<AudioNode>;
    createElement(options?: WebAudioPluginCreateOptions<S>): Promise<Element>;
}
declare const WebAudioPlugin: {
    prototype: WebAudioPlugin;
    new <P extends string = never, S extends Record<string, any> = {}, E extends Record<string, EventInit & Record<string, any>> = {}>(audioContext: AudioContext): WebAudioPlugin<P, S, E>;
};
// let ac: AudioContext;
// const w = new WebAudioPlugin<"gain" | "feedback" | "ratio", { a: number }, { midiMessage: { data: Uint8Array } }>(ac);
// w.addEventListener("midiMessage", e => e.data);
// w.setParam("feedback", 1);
// w.setState({ a: 2 });

const AWN: typeof AudioWorkletNode = window.AudioWorkletNode ? AudioWorkletNode : null;

class PluginUI extends DOMUI<Plugin> {
    state: DOMUIState = { ...this.state, children: this.object.state.children };
}

export type S = { node: AudioNode; children: ChildNode[] };
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
    async load(url: string) {
        let Constructor: typeof WebAudioPlugin;
        try {
            const m = await import(/* webpackIgnore: true */url);
            Constructor = m.default;
        } catch (e) {
            this.error(e.message);
        }
        let node: AudioNode;
        let element: Element;
        try {
            const factory = new Constructor(this.audioCtx);
            node = await factory.createAudioNode();
            element = await factory.createElement();
        } catch (e) {
            if (e) this.error((e as Error).message);
            return;
        }
        this.disconnectAudio();
        this.handleDestroy();
        this.state.children = [element];
        this.updateUI({ children: this.state.children });
        node.channelInterpretation = "discrete";
        const inlets = node.numberOfInputs;
        const outlets = node.numberOfOutputs;
        Object.assign(this.state, { node } as S);
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
            this.inletConnections[i] = { node, index: i };
        }
        for (let i = 0; i < outlets; i++) {
            factoryMeta.outlets[i] = outletMeta;
            this.outletConnections[i] = { node, index: i };
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
        const { node } = this.state;
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
                // if (this.state.node) this.state.node.onMidi(data);
            } else if (typeof data === "object") {
                if (this.state.node) {
                    for (const key in data) {
                        try {
                            const bpf = decodeLine((data as { [key: string]: TBPF })[key]);
                            if (this.state.node instanceof AWN) this.applyBPF(this.state.node.parameters.get(key), bpf);
                            // else this.state.node.setParam(key, bpf[bpf.length - 1][0]);
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
