import { Bang, BaseObject } from "../Base";
import { TMeta } from "../../types";
import { ShadowDOMUI, ShadowDOMUIState } from "../BaseUI";

export default class diagram extends BaseObject<{}, { svg: string }, [Bang | string], [string], [], {}, ShadowDOMUIState> {
    static package = "Faust";
    static description = "Get Faust code diagram";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "string",
        description: "Code to compile, bang to output only"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "string",
        description: "SVG code"
    }];
    static ui = ShadowDOMUI;
    state = { svg: "" };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            const { faust } = this.patcher.env;
            if (inlet === 0) {
                if (!(data instanceof Bang)) {
                    try {
                        this.state.svg = faust.getDiagram(data, { "-I": ["libraries/", "project/"] });
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
                    this.updateUI({ children: [container] });
                }
            }
        });
    }
}
