import { Bang, BaseObject, isBang } from "../Base";
import { TMeta } from "../../types";
import { DOMUI, DOMUIState } from "../BaseUI";
import { DefaultFaustDynamicNodeState } from "../dsp/FaustDynamicNode";
import "./Diagram.scss";

export default class diagram extends BaseObject<{}, { svg: string, container: HTMLDivElement }, [Bang | string | DefaultFaustDynamicNodeState["node"]], [string], [], {}, DOMUIState> {
    static package = "Faust";
    static description = "Get Faust code diagram";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "string",
        description: "Code or FaustNode to compile, bang to output only"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "string",
        description: "SVG code"
    }];
    static UI = class extends DOMUI<diagram> {
        state: DOMUIState = { ...this.state, children: this.props.object.state.container ? [this.props.object.state.container] : [] };
    };
    state = { svg: "", container: undefined as HTMLDivElement };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            const { faust } = this.patcher.env;
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        this.state.svg = faust.getDiagram(typeof data === "string" ? data : data.dspCode, { "-I": ["libraries/", "project/"] });
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                if (this.state.svg) {
                    this.outlet(0, this.state.svg);
                    const template = document.createElement("template");
                    const container = document.createElement("div");
                    container.addEventListener("click", (e) => {
                        let target = e.target as HTMLElement;
                        while (target !== container && !(target instanceof SVGAElement)) {
                            target = target.parentElement;
                        }
                        if (target === container) return;
                        if (target instanceof SVGAElement) {
                            e.preventDefault();
                            const fileName = target.href.baseVal;
                            const svg = faust.fs.readFile("FaustDSP-svg/" + fileName, { encoding: "utf8" }) as string;
                            container.innerHTML = svg;
                        }
                    });
                    template.appendChild(container);
                    container.innerHTML = this.state.svg;
                    this.state.container = container;
                    this.updateUI({ children: [container] });
                }
            }
        });
    }
}
