import { TMeta } from "../../types";
import { DOMUI, DOMUIState } from "../BaseUI";
import UIObject from "../UI/Base";

interface State {
    svgs: string[];
    container: HTMLDivElement;
    parser: GuidoParser;
    ar: ARHandler;
    gr: GRHandler;
}

export default class GuidoView extends UIObject<{}, State, [string], [string], [], GuidoLayoutSettings, DOMUIState> {
    static package = "Guido";
    static description = "Get Guido Graphic Representation from code";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "string",
        description: "Guido code to compile and display"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "string",
        description: "SVG code"
    }];
    static UI = class extends DOMUI<GuidoView> {
        state: DOMUIState = { ...this.state, children: this.props.object.state.container ? [this.props.object.state.container] : [] };
    };
    state: State = { svgs: [], container: undefined, parser: undefined, ar: undefined, gr: undefined };
    subscribe() {
        super.subscribe();
        const process = async (gmn: string) => {
            const guido = this.patcher.env.guidoWorker;
            const { parser } = this.state;
            let { ar, gr } = this.state;
            if (ar) await guido.freeAR(ar);
            if (gr) await guido.freeGR(gr);
            this.setState({ ar: undefined, gr: undefined });
            ar = await guido.string2AR(parser, gmn);
            this.setState({ ar });
            if (ar) {
                const { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions } = this.props;
                const settings = { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions };
                gr = await guido.ar2grSettings(this.state.ar, settings);
                this.setState({ gr });
            } else {
                const error = await guido.parserGetErrorCode(parser);
                this.error(error);
                return;
            }
            if (gr) {
                const pagesCount = await guido.getPageCount(gr);
                const svgs = await Promise.all(new Array(pagesCount).fill(null).map((v, i) => guido.gr2SVGColored(gr, i + 1, 0, 0, 0, false)));
                this.setState({ svgs });
                const template = document.createElement("template");
                const container = document.createElement("div");
                template.appendChild(container);
                for (const svg of svgs) {
                    const svgContainer = document.createElement("div");
                    svgContainer.innerHTML = svg;
                    container.appendChild(svgContainer);
                }
                this.setState({ container });
                this.updateUI({ children: [container] });
            }
        };
        this.on("postInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("postInit", async () => {
            const parser = await this.patcher.env.guidoWorker.openParser();
            this.setState({ parser });
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (typeof data === "string") {
                    process(data);
                }
            }
        });
        this.on("destroy", async () => {
            const guido = this.patcher.env.guidoWorker;
            const { ar, gr, parser } = this.state;
            if (ar) await guido.freeAR(ar);
            if (gr) await guido.freeGR(gr);
            if (parser) await guido.closeParser(parser);
        });
    }
}
