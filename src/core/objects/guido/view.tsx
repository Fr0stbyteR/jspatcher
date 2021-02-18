import { TMeta, TPropsMeta } from "../../types";
import { DOMUI, DOMUIState } from "../BaseUI";
import UIObject from "../UI/Base";

interface State {
    gmn: string;
    svgs: string[];
    container: HTMLDivElement;
    parser: $GuidoParser;
    ar: $ARHandler;
    gr: $GRHandler;
}

export default class GuidoView extends UIObject<{}, State, [string], [string[]], [], GuidoLayoutSettings, DOMUIState> {
    static package = "Guido";
    static description = "Get Guido Graphic Representation from code";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "string",
        description: "Guido code to compile and display"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "SVG codes"
    }];
    static props: TPropsMeta<GuidoLayoutSettings> = {
        systemsDistance: {
            type: "number",
            default: 75,
            description: "System distance"
        },
        systemsDistribution: {
            type: "number",
            default: 0,
            description: "0 = auto, 1 = always, 2 = never"
        },
        systemsDistribLimit: {
            type: "number",
            default: 25,
            description: "Maximum distance"
        },
        force: {
            type: "number",
            default: 750,
            description: "Force"
        },
        spring: {
            type: "number",
            default: 110,
            description: "Spring"
        },
        neighborhoodSpacing: {
            type: "number",
            default: 0,
            description: "Neighborhood spacing, 0 / 1"
        },
        optimalPageFill: {
            type: "number",
            default: 0,
            description: "Optimum page fill, 0 / 1"
        },
        resizePage2Music: {
            type: "number",
            default: 1,
            description: "Resize page to music, 0 / 1"
        },
        proportionalRenderingForceMultiplicator: {
            type: "number",
            default: 0,
            description: "Proportional Rendering Force Multiplicator"
        },
        checkLyricsCollisions: {
            type: "number",
            default: 0,
            description: "Check lyrics collisions"
        }
    };
    static UI = class extends DOMUI<GuidoView> {
        state: DOMUIState = { ...this.state, children: this.props.object.state.container ? [this.props.object.state.container] : [] };
    };
    state: State = { gmn: undefined, svgs: [], container: undefined, parser: undefined, ar: undefined, gr: undefined };
    subscribe() {
        super.subscribe();
        const processAR = async () => {
            const guido = this.patcher.env.guidoWorker;
            const { parser, gmn } = this.state;
            const ar = await guido.string2AR(parser, gmn);
            if (this.state.ar) await guido.freeAR(this.state.ar);
            this.setState({ ar });
        };
        const processGR = async () => {
            const guido = this.patcher.env.guidoWorker;
            const { parser, ar } = this.state;
            if (ar) {
                const { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions } = this.props;
                const settings = { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions };
                const gr = await guido.ar2grSettings(ar, settings);
                if (this.state.gr) await guido.freeGR(this.state.gr);
                this.setState({ gr });
            } else {
                const error = await guido.parserGetErrorCode(parser);
                throw error;
            }
        };
        const processSVG = async () => {
            const guido = this.patcher.env.guidoWorker;
            const { gr } = this.state;
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
                this.outlet(0, svgs);
            }
        };
        const process = async () => {
            try {
                await processAR();
                await processGR();
                await processSVG();
            } catch (error) {
                this.error(error);
            }
        };
        this.on("preInit", () => {
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
                    this.setState({ gmn: data });
                    process();
                }
            }
        });
        this.on("updateProps", async () => {
            if (!this.state.gmn) return;
            try {
                await processGR();
                await processSVG();
            } catch (error) {
                this.error(error);
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
