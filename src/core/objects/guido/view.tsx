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

interface Props extends GuidoLayoutSettings {
    bgColor: string;
}

export default class GuidoView extends UIObject<{}, State, [string | $ARHandler], [string[]], [], Props, DOMUIState> {
    static package = "Guido";
    static description = "Get Guido Graphic Representation from code";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "string",
        description: "Guido AR / GMN code to compile and display"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "SVG codes"
    }];
    static props: TPropsMeta<Props> = {
        bgColor: {
            type: "color",
            default: "white",
            description: "Background color"
        },
        systemsDistance: {
            type: "number",
            default: 75,
            description: "Control distance between systems, distance is in internal units (default value: 75)"
        },
        systemsDistribution: {
            type: "number",
            default: 1,
            description: "control systems distribution. Possible values: 1 = auto, 2 = always, 3 = never"
        },
        systemsDistribLimit: {
            type: "number",
            default: 0.25,
            description: "Maximum distance allowed between two systems, for automatic distribution mode. Distance is relative to the height of the inner page. Default value: 0.25 (that is: 1/4 of the page height)"
        },
        force: {
            type: "number",
            default: 750,
            description: "force value of the Space-Force function typical values range from 400 to 1500. Default value: 750"
        },
        spring: {
            type: "number",
            default: 1.1,
            description: "the spring parameter typical values range from 1 to 5. Default value: 1.1"
        },
        neighborhoodSpacing: {
            type: "number",
            default: 0,
            description: "boolean value to tell the engine to use the Neighborhood spacing algorithm or not (default value: 0)"
        },
        optimalPageFill: {
            type: "number",
            default: 0,
            description: "boolean value to tell the engine to use the optimal page fill algorithm or not (default value: 0)"
        },
        resizePage2Music: {
            type: "number",
            default: 1,
            description: "boolean value to tell the engine to resize page to music (default value: 1)"
        },
        proportionalRenderingForceMultiplicator: {
            type: "number",
            default: 0,
            description: "float value to tell the engine what is the force multiplicator applied to proportional rendering If value is 0, proportional mode is not enabled, otherwise value corresponds to the force multiplicator value (default value: 0)"
        },
        checkLyricsCollisions: {
            type: "number",
            default: 0,
            description: "used to check lyrics and resolve collisions (default value is false)"
        }
    };
    static UI = class extends DOMUI<GuidoView> {
        state: DOMUIState = { ...this.state, children: this.object.state.container ? [this.object.state.container] : [], containerProps: { style: { backgroundColor: this.object.props.bgColor } } };
    };
    state: State = { gmn: undefined, svgs: [], container: undefined, parser: undefined, ar: undefined, gr: undefined };
    subscribe() {
        super.subscribe();
        const processAR = async () => {
            const guido = this.patcher.env.guidoWorker;
            const { parser, gmn } = this.state;
            const ar = await guido.string2AR(parser, gmn);
            if (this.state.gr) await guido.freeGR(this.state.gr);
            if (this.state.ar) await guido.freeAR(this.state.ar);
            this.setState({ ar, gr: undefined });
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
        const updateGR = async () => {
            const guido = this.patcher.env.guidoWorker;
            const { gr } = this.state;
            if (gr) {
                const { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions } = this.props;
                const settings = { systemsDistance, systemsDistribution, systemsDistribLimit, force, spring, neighborhoodSpacing, optimalPageFill, resizePage2Music, proportionalRenderingForceMultiplicator, checkLyricsCollisions };
                await guido.updateGRSettings(gr, settings);
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
        const processFromAR = async (ar: $ARHandler) => {
            try {
                const guido = this.patcher.env.guidoWorker;
                if (this.state.gr) await guido.freeGR(this.state.gr);
                if (this.state.ar) await guido.freeAR(this.state.ar);
                this.setState({ ar, gr: undefined });
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
                } else if (typeof data === "number") {
                    processFromAR(data);
                }
            }
        });
        this.on("updateProps", async (props) => {
            if ("bgColor" in props) {
                this.updateUI({ containerProps: { style: { backgroundColor: props.bgColor } } });
            }
            if (Object.keys(props).filter(v => v !== "bgColor").length) {
                if (!this.state.gr) return;
                try {
                    await updateGR();
                    await processSVG();
                } catch (error) {
                    this.error(error);
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
