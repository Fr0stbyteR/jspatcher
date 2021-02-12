import { FaustAudioWorkletNode } from "faust2webaudio";
import { TFaustUI } from "faust2webaudio/src/types";
import { FaustUI } from "../../../utils/faust-ui/FaustUI";
import { TMeta } from "../../types";
import { BaseObject } from "../Base";
import { DOMUI, DOMUIState } from "../BaseUI";

interface S {
    node: FaustAudioWorkletNode;
    faustUI: FaustUI;
    root: HTMLDivElement;
}

export default class ui extends BaseObject<{}, S, [FaustAudioWorkletNode], [Record<string, number>], [], {}, DOMUIState> {
    static package = "faust";
    static description = "Display a Faust UI";
    static inlets: TMeta["inlets"] = [{
        isHot: false,
        type: "object",
        description: "Compiled Faust AudioWorkletNode"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "Changed parameter name-value map"
    }];
    static UI = class extends DOMUI<ui> {
        state: DOMUIState = { ...this.state, children: this.props.object.state.root ? [this.props.object.state.root] : [] };
        componentDidMount() {
            super.componentDidMount();
            this.props.object.state.faustUI?.resize();
        }
    };
    state: S = { node: undefined, faustUI: undefined, root: undefined };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("postInit", () => this.updateUI({ shadow: false }));
        const handleParamChangedByDSP = (e: CustomEvent<{ path: string, value: number }>) => {
            this.state.faustUI?.paramChangeByDSP(e.detail.path, e.detail.value);
        };
        const handleDestroyDSP = (e: CustomEvent<{ target: FaustAudioWorkletNode }>) => {
            e.detail.target?.removeEventListener("paramChanged", handleParamChangedByDSP);
            e.detail.target?.removeEventListener("destroy", handleDestroyDSP);
        };
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof FaustAudioWorkletNode) {
                    this.state.node?.removeEventListener("paramChanged", handleParamChangedByDSP);
                    const ui = data.getUI() as TFaustUI;
                    const root = document.createElement("div");
                    root.style.width = "100%";
                    root.style.height = "100%";
                    root.style.margin = "0";
                    root.style.position = "absolute";
                    root.style.overflow = "auto";
                    root.style.display = "flex";
                    root.style.flexDirection = "column";
                    const faustUI = new FaustUI({ ui, root, listenWindowMessage: false, listenWindowResize: false });
                    this.setState({ faustUI });
                    faustUI.paramChangeByUI = (path: string, value: number) => {
                        this.outlet(0, { [path]: value });
                    };
                    if (!data.outputHandler) data.outputHandler = (path, value) => data.dispatchEvent(new CustomEvent("paramChanged", { detail: { path, value } }));
                    data.destroy = () => {
                        data.dispatchEvent(new CustomEvent("destroy", { detail: { target: data } }));
                        data.port.postMessage({ type: "destroy" });
                        data.port.close();
                        delete data.plotHandler;
                        delete data.outputHandler;
                    };
                    data.addEventListener("paramChanged", handleParamChangedByDSP);
                    data.addEventListener("destroy", handleDestroyDSP);
                    this.updateUI({ children: [root] });
                    this.state.root = root;
                    faustUI.resize();
                }
            }
        });
        this.on("destroy", () => {
            this.state.node?.removeEventListener("paramChanged", handleParamChangedByDSP);
            this.state.node?.removeEventListener("destroy", handleDestroyDSP);
        });
        const handleResize = () => {
            if (this.state.faustUI) this.state.faustUI.resize();
        };
        this.box.on("rectChanged", handleResize);
        this.box.on("presentationRectChanged", handleResize);
    }
}
