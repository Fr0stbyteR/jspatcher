import { FaustAudioWorkletNode } from "faust2webaudio";
import { TFaustUI } from "faust2webaudio/src/types";
import { FaustUI } from "../../../utils/faust-ui/FaustUI";
import { TMeta } from "../../types";
import { BaseObject } from "../Base";
import { DOMUI, DOMUIState } from "../BaseUI";

export default class ui extends BaseObject<{}, { faustUI: FaustUI }, [FaustAudioWorkletNode], [Record<string, number>], [], {}, DOMUIState> {
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
    static ui = DOMUI;
    state: { faustUI: FaustUI } = { faustUI: undefined };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("postInit", () => this.updateUI({ shadow: false }));
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof FaustAudioWorkletNode) {
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
                    this.updateUI({ children: [root] });
                    faustUI.resize();
                }
            }
        });
        const handleResize = () => {
            if (this.state.faustUI) this.state.faustUI.resize();
        };
        this.box.on("rectChanged", handleResize);
        this.box.on("presentationRectChanged", handleResize);
    }
}
