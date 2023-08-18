import type { FaustAudioWorkletNode } from "@grame/faustwasm/dist/esm";
import type { FaustUI } from "@shren/faust-ui";
import DOMUI, { DOMUIState } from "../base/DOMUI";
import BaseObject from "../base/BaseObject";
import type { IInletsMeta, IOutletsMeta } from "../base/AbstractObject";

interface IS {
    node: FaustAudioWorkletNode;
    faustUI: FaustUI;
    root: HTMLDivElement;
}

export default class ui extends BaseObject<{}, {}, [FaustAudioWorkletNode], [Record<string, number>], [], {}, DOMUIState> {
    static package = "faust";
    static description = "Display a Faust UI";
    static inlets: IInletsMeta = [{
        isHot: false,
        type: "object",
        description: "Compiled Faust AudioWorkletNode"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "Changed parameter name-value map"
    }];
    static UI = class extends DOMUI<ui> {
        state: DOMUIState = { ...this.state, children: this.props.object._.root ? [this.props.object._.root] : [] };
        componentDidMount() {
            super.componentDidMount();
            this.props.object._.faustUI?.resize();
        }
    };
    _: IS = { node: undefined, faustUI: undefined, root: undefined };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("postInit", () => this.updateUI({ shadow: false }));
        const handleParamChangedByDSP = (e: CustomEvent<{ path: string; value: number }>) => {
            this._.faustUI?.paramChangeByDSP(e.detail.path, e.detail.value);
        };
        const handleDestroyDSP = (e: CustomEvent<{ target: FaustAudioWorkletNode }>) => {
            e.detail.target?.removeEventListener("paramChanged", handleParamChangedByDSP);
            e.detail.target?.removeEventListener("destroy", handleDestroyDSP);
        };
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof AudioWorkletNode) {
                    this._.node?.removeEventListener("paramChanged", handleParamChangedByDSP);
                    this._.node?.removeEventListener("destroy", handleDestroyDSP);
                    this._.node = data;
                    const ui = data.getUI();
                    const root = document.createElement("div");
                    root.style.width = "100%";
                    root.style.height = "100%";
                    root.style.margin = "0";
                    root.style.position = "absolute";
                    root.style.overflow = "auto";
                    root.style.display = "flex";
                    root.style.flexDirection = "column";
                    const { FaustUI } = (await import("@shren/faust-ui"));
                    const faustUI = new FaustUI({ ui, root, listenWindowMessage: false, listenWindowResize: false });
                    this._.faustUI = faustUI;
                    faustUI.paramChangeByUI = (path: string, value: number) => {
                        this.outlet(0, { [path]: value });
                    };
                    if (!data.getOutputParamHandler()) data.setOutputParamHandler((path, value) => data.dispatchEvent(new CustomEvent("paramChanged", { detail: { path, value } })));
                    data.destroy = () => {
                        data.dispatchEvent(new CustomEvent("destroy", { detail: { target: data } }));
                        data.port.postMessage({ type: "destroy" });
                        data.port.close();
                        data.setOutputParamHandler(null);
                        data.setPlotHandler(null);
                    };
                    data.addEventListener("paramChanged", handleParamChangedByDSP);
                    data.addEventListener("destroy", handleDestroyDSP);
                    this.updateUI({ children: [root] });
                    this._.root = root;
                    faustUI.resize();
                }
            }
        });
        this.on("destroy", () => {
            this._.node?.removeEventListener("paramChanged", handleParamChangedByDSP);
            this._.node?.removeEventListener("destroy", handleDestroyDSP);
        });
        const handleResize = () => {
            this._.faustUI?.resize();
        };
        this.box.on("rectChanged", handleResize);
        this.box.on("presentationRectChanged", handleResize);
    }
}
