import BaseObject from "../base/BaseObject";
import Bang, { isBang } from "../base/Bang";
import DOMUI, { DOMUIState } from "../base/DOMUI";
import type Env from "../../Env";
import type { IInletsMeta, IOutletsMeta } from "../base/AbstractObject";
import type { FaustNodeInternalState } from "./FaustNode";
import "./Diagram.scss";

export default class diagram extends BaseObject<{}, {}, [Bang | string | FaustNodeInternalState["node"]], [Record<string, string>], [], {}, DOMUIState> {
    static package = "Faust";
    static description = "Get Faust code diagram";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "string",
        description: "Code or FaustNode to compile, bang to output only"
    }];
    static outlets: IOutletsMeta = [{
        type: "string",
        description: "SVG file - SVG code pairs"
    }];
    static UI = class extends DOMUI<diagram> {
        state: DOMUIState = { ...this.state, children: this.props.object._.container ? [this.props.object._.container] : [] };
    };
    _ = { svgs: {} as Record<string, string>, container: undefined as HTMLDivElement };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", async ({ data, inlet }) => {
            const faustCompiler = await (this.env as Env).getFaustCompiler();
            const faustSvgDiagrams = new (this.env as Env).Faust.FaustSvgDiagrams(faustCompiler);
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        this._.svgs = faustSvgDiagrams.from("FaustDSP", typeof data === "string" ? data : data.dspCode, "");
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                if (this._.svgs) {
                    this.outlet(0, this._.svgs);
                    const template = document.createElement("template");
                    const container = document.createElement("div");
                    template.appendChild(container);
                    const mountSvg = (svgStr: string) => {
                        container.innerHTML = svgStr;
                        container.querySelectorAll(".link").forEach((e: HTMLElement) => {
                            if (!e.onclick) return;
                            const fileName = e.onclick.toString().match(/'.+\/(.+)'/)[1];
                            e.onclick = () => mountSvg(this._.svgs[fileName]);
                        });
                    };
                    mountSvg(this._.svgs["process.svg"]);
                    this._.container = container;
                    this.updateUI({ children: [container] });
                }
            }
        });
    }
}
