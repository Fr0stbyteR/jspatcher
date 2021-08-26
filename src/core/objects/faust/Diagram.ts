import BaseObject from "../base/BaseObject";
import Bang, { isBang } from "../base/Bang";
import DOMUI, { DOMUIState } from "../base/DOMUI";
import type Env from "../../Env";
import type { IInletsMeta, IOutletsMeta } from "../base/AbstractObject";
import type { FaustNodeInternalState } from "./FaustNode";
import "./Diagram.scss";

export default class diagram extends BaseObject<{}, {}, [Bang | string | FaustNodeInternalState["node"]], [string], [], {}, DOMUIState> {
    static package = "Faust";
    static description = "Get Faust code diagram";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "string",
        description: "Code or FaustNode to compile, bang to output only"
    }];
    static outlets: IOutletsMeta = [{
        type: "string",
        description: "SVG code"
    }];
    static UI = class extends DOMUI<diagram> {
        state: DOMUIState = { ...this.state, children: this.props.object._.container ? [this.props.object._.container] : [] };
    };
    _ = { svg: "", container: undefined as HTMLDivElement };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", async ({ data, inlet }) => {
            const faust = await (this.env as Env).getFaust();
            if (inlet === 0) {
                if (!isBang(data)) {
                    try {
                        this._.svg = faust.getDiagram(typeof data === "string" ? data : data.dspCode, { "-I": ["libraries/", "project/"] });
                    } catch (e) {
                        this.error(e);
                        return;
                    }
                }
                if (this._.svg) {
                    this.outlet(0, this._.svg);
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
                    container.innerHTML = this._.svg;
                    this._.container = container;
                    this.updateUI({ children: [container] });
                }
            }
        });
    }
}
