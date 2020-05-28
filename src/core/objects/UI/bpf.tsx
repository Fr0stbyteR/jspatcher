import * as React from "react";
import UIObject from "./Base";
import { Bang } from "../Base";
import { BaseUI, BaseUIState } from "../BaseUI";
import { TBPF, TStrictBPF, TBPFPoint, TMeta, TPropsMeta } from "../../types";
import { decodeBPF } from "../../../utils/utils";
import { normExp, round, scaleClip } from "../../../utils/math";

interface BPFData {
    points: TStrictBPF;
}
interface BPFUIProps {
    domain: number;
    range: [number, number];
    fontFamily: string;
    fontSize: number;
    fontFace: "regular" | "bold" | "italic" | "bold italic";
    textColor: string;
    pointColor: string;
    lineColor: string;
    bgColor: string;
}
interface BPFUIState extends BPFData, BaseUIState, BPFUIProps {
    ghostPoint: TBPFPoint;
}

export class BPFUI<T extends bpf> extends BaseUI<T, {}, BPFUIState> {
    static sizing = "both" as const;
    static defaultSize: [number, number] = [450, 300];
    state: BPFUIState = { ...this.state, points: this.object.data.points, ghostPoint: undefined };
    dragged = false;
    mouseDown = false;
    refG = React.createRef<SVGGElement>();
    handleResized = () => {
        if (this.refG.current) {
            this.refG.current.style.transformOrigin = "0";
            requestAnimationFrame(() => this.refG.current.style.transformOrigin = "center");
        }
    };
    componentDidMount() {
        super.componentDidMount();
        this.box.on("rectChanged", this.handleResized);
        this.box.on("presentationRectChanged", this.handleResized);
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.box.off("rectChanged", this.handleResized);
        this.box.off("presentationRectChanged", this.handleResized);
    }
    handleMouseMove = () => {
        this.setState({ ghostPoint: undefined });
    };
    handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
        this.dragged = false;
        const { points } = this.state;
        const svg = e.currentTarget;
        let { left, top, width, height } = svg.getBoundingClientRect();
        left += 0.025 * width;
        top += 0.025 * height;
        width *= 0.95;
        height *= 0.95;
        const normalizedX = (e.clientX - left) / width;
        const normalizedY = 1 - (e.clientY - top) / height;
        const [x, y] = this.denormalizePoint(normalizedX, normalizedY);
        const { index: $point, point } = this.getInsertPoint(x, y);
        points.splice($point, 0, point);
        this.setState({ points: points.slice() });
        this.object.setData({ points: this.state.points });
    };
    handleMouseMoveLine = (e: React.MouseEvent<SVGLineElement>) => {
        if (this.mouseDown) return;
        e.stopPropagation();
        const line = e.currentTarget;
        if (e.altKey) {
            line.style.cursor = "ns-resize";
            return;
        }
        line.style.cursor = "unset";
        const { domain } = this.state;
        const svg = line.parentElement.parentElement;
        let { left, width } = svg.getBoundingClientRect();
        left += 0.025 * width;
        width *= 0.95;
        const normalizedX = (e.clientX - left) / width;
        const { point } = this.getInsertPoint(normalizedX * domain);
        this.setState({ ghostPoint: point });
    };
    handleMouseDownLine = (e: React.MouseEvent<SVGLineElement>) => {
        e.stopPropagation();
        this.dragged = false;
        this.mouseDown = true;
        const line = e.currentTarget;
        const { points, domain, range } = this.state;
        const svg = line.parentElement.parentElement;
        let { left, top, width, height } = svg.getBoundingClientRect();
        left += 0.025 * width;
        top += 0.025 * height;
        width *= 0.95;
        height *= 0.95;
        if (e.altKey) {
            const i = +line.getAttribute("values");
            const prev = points[i];
            const next = points[i + 1];
            const { clientY } = e;
            const handleMouseMove = (e: MouseEvent) => {
                this.dragged = true;
                let [rangeMin, rangeMax] = range;
                if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];
                const rangeInterval = rangeMax - rangeMin;
                if (!rangeInterval) return;
                const delta = (e.clientY - clientY) / height * rangeInterval;
                points[i] = prev.slice() as TBPFPoint;
                points[i][1] = Math.min(rangeMax, Math.max(rangeMin, prev[1] - delta));
                if (next) {
                    points[i + 1] = next.slice() as TBPFPoint;
                    points[i + 1][1] = Math.min(rangeMax, Math.max(rangeMin, next[1] - delta));
                }
                this.setState({ points: points.slice() });
                this.object.setData({ points: this.state.points });
            };
            const handleMouseUp = () => {
                this.mouseDown = false;
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            const normalizedX = (e.clientX - left) / width;
            const { index: $point, point } = this.getInsertPoint(normalizedX * domain);
            const limits = [
                points[$point - 1][0] / domain * width + left,
                points[$point] ? points[$point][0] / domain * width + left : left + width
            ];
            points.splice($point, 0, point);
            this.setState({ points: points.slice() });
            this.object.setData({ points: this.state.points });
            const handleMouseMove = (e: MouseEvent) => {
                this.dragged = true;
                const clientX = Math.max(limits[0], Math.min(limits[1], e.clientX));
                const clientY = Math.max(top, Math.min(top + height, e.clientY));
                const normalized = [(clientX - left) / width, 1 - (clientY - top) / height] as const;
                const [x, y] = this.denormalizePoint(...normalized);
                const point: TBPFPoint = [x, y, 0];
                points[$point] = point;
                this.setState({ points: points.slice() });
                this.object.setData({ points: this.state.points });
            };
            const handleMouseUp = () => {
                this.mouseDown = false;
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
    };
    handleMouseDownCircle = (e: React.MouseEvent<SVGCircleElement>) => {
        e.stopPropagation();
        this.dragged = false;
        const { points, domain } = this.state;
        const circle = e.currentTarget;
        const svg = circle.parentElement.parentElement;
        let { left, top, width, height } = svg.getBoundingClientRect();
        left += 0.05 * width;
        top += 0.05 * height;
        width *= 0.9;
        height *= 0.9;
        const i = +circle.getAttribute("values");
        const limits = [
            points[i - 1] ? points[i - 1][0] / domain * width + left : left,
            points[i + 1] ? points[i + 1][0] / domain * width + left : left + width
        ];
        const [x, y] = this.normalizePoint(points[i][0], points[i][1]);
        const circleX = left + x * width;
        const circleY = top + (1 - y) * height;
        const handleMouseMove = (e: MouseEvent) => {
            this.dragged = true;
            const clientX = Math.max(limits[0], Math.min(limits[1], e.shiftKey || Math.abs(circleX - e.clientX) > 5 ? e.clientX : circleX));
            const clientY = Math.max(top, Math.min(top + height, e.shiftKey || Math.abs(circleY - e.clientY) > 5 ? e.clientY : circleY));
            const normalized = [(clientX - left) / width, 1 - (clientY - top) / height] as const;
            const [x, y] = this.denormalizePoint(...normalized);
            const point = [x, y, 0];
            points[i] = point as TBPFPoint;
            this.setState({ points: points.slice() });
            this.object.setData({ points: this.state.points });
        };
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleDoubleClickCircle = (e: React.MouseEvent<SVGCircleElement>) => {
        e.stopPropagation();
        if (this.dragged) return;
        const circle = e.currentTarget;
        const i = +circle.getAttribute("values");
        const { points } = this.state;
        points.splice(i, 1);
        this.setState({ points: points.slice() });
        this.object.setData({ points: this.state.points });
    };
    getInsertPoint(x: number, yIn?: number, e = 0): { index: number; point: TBPFPoint } {
        const { points } = this.state;
        let $point = 0;
        let prev = points[0];
        let next: TBPFPoint;
        while ($point < points.length) {
            next = points[$point];
            if (next[0] > x) break;
            prev = next;
            $point++;
        }
        if (prev === next) return { index: $point, point: [x, typeof yIn === "number" ? yIn : prev[1], e] };
        if (typeof yIn === "number") return { index: $point, point: [x, yIn, e] };
        const exponent = prev[2] || 0;
        const normalizedX = (x - prev[0]) / (next[0] - prev[0]);
        const normalizedY = normExp(normalizedX, exponent);
        const y = prev[1] + normalizedY * (next[1] - prev[1]);
        return { index: $point, point: [x, y, e] };
    }
    get normalizedPoints() {
        const { domain, range, points } = this.state;
        let [rangeMin, rangeMax] = range;
        if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];
        const rangeInterval = rangeMax - rangeMin;
        return points.map(point => [point[0] / domain, rangeInterval ? (point[1] - rangeMin) / rangeInterval : 0.5]);
    }
    normalizePoint(x: number, y: number) {
        const { domain, range } = this.state;
        let [rangeMin, rangeMax] = range;
        if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];
        const rangeInterval = rangeMax - rangeMin;
        return [x / domain, rangeInterval ? (y - rangeMin) / rangeInterval : 0.5];
    }
    denormalizePoint(x: number, y: number) {
        const { domain, range } = this.state;
        let [rangeMin, rangeMax] = range;
        if (rangeMin > rangeMax) [rangeMin, rangeMax] = [rangeMax, rangeMin];
        const rangeInterval = rangeMax - rangeMin;
        return [x * domain, y * rangeInterval + rangeMin];
    }
    get font() {
        const { fontFace, fontSize, fontFamily } = this.state;
        return `${fontFace === "regular" ? "" : fontFace} ${fontSize}px ${fontFamily}, sans-serif`;
    }
    render() {
        const { normalizedPoints, font, state } = this;
        const { domain, points, textColor, ghostPoint, lineColor, pointColor, bgColor } = state;
        const circles: JSX.Element[] = [];
        const lines: JSX.Element[] = [];
        const linesEvents: JSX.Element[] = [];
        const texts: JSX.Element[] = [];
        let prevX: string;
        let prevY: string;
        for (let i = 0; i < normalizedPoints.length; i++) {
            const point = normalizedPoints[i];
            const x = point[0] * 100 + "%";
            const y = (1 - point[1]) * 100 + "%";
            const textAnchor = point[0] < 0.5 ? "start" : "end";
            const textX = point[0] * 100 + (point[0] < 0.5 ? 2 : -2) + "%";
            const textY = (1 - point[1]) * 100 + (point[1] < 0.5 ? -1 : 4) + "%";
            const textStyle: React.CSSProperties = {
                userSelect: "none",
                WebkitUserSelect: "none",
                pointerEvents: "none",
                font, // stylelint-disable-line font-family-no-missing-generic-family-keyword
                fill: textColor
            };
            circles.push(<circle key={i} cx={x} cy={y} r={4} values={`${i}`} fill={pointColor} onMouseDown={this.handleMouseDownCircle} onDoubleClick={this.handleDoubleClickCircle} />);
            texts.push(<text textAnchor={textAnchor} key={`${i}_text`} x={textX} y={textY} style={textStyle} >{`${round(points[i][0], 0.01)}, ${round(points[i][1], 0.01)}`}</text>);
            if (prevX && prevY) {
                lines.push(<line key={`${i - 1}_line`} x1={prevX} y1={prevY} x2={x} y2={y} stroke={lineColor} strokeWidth={2} />);
                linesEvents.push(<line key={`${i - 1}_events`} x1={prevX} y1={prevY} x2={x} y2={y} values={`${i - 1}`} stroke="transparent" strokeWidth={10} onMouseDown={this.handleMouseDownLine} onMouseMove={this.handleMouseMoveLine} />);
            }
            prevX = x;
            prevY = y;
        }
        let ghostCircle: JSX.Element;
        if (ghostPoint) {
            const point = this.normalizePoint(ghostPoint[0], ghostPoint[1]);
            const x = point[0] * 100 + "%";
            const y = (1 - point[1]) * 100 + "%";
            ghostCircle = <circle key="ghostPoint" cx={x} cy={y} r={4} fill={pointColor} style={{ opacity: 0.25, pointerEvents: "none" }} />;
        }
        if (points.length && points[points.length - 1][0] !== domain) {
            const i = points.length - 1;
            lines.push(<line key={`${i}_line`} x1={prevX} y1={prevY} x2="100%" y2={prevY} stroke={lineColor} strokeWidth={2} />);
            linesEvents.push(<line key={`${i}_events`} x1={prevX} y1={prevY} x2="100%" y2={prevY} values={`${i}`} stroke="transparent" strokeWidth={10} onMouseDown={this.handleMouseDownLine} onMouseMove={this.handleMouseMoveLine} />);
        }
        return (
            <BaseUI {...this.props} containerProps={{ style: { height: "100%", width: "100%" } }}>
                <svg width="100%" height="100%" style={{ backgroundColor: bgColor }} onMouseMove={this.handleMouseMove} onDoubleClick={this.handleDoubleClick}>
                    <g ref={this.refG} transform="scale(0.95, 0.95)" style={{ transformOrigin: "center" }}>
                        {texts}
                        {ghostCircle}
                        {lines}
                        {linesEvents}
                        {circles}
                    </g>
                </svg>
            </BaseUI>
        );
    }
}
export default class bpf extends UIObject<BPFData, {}, [TBPF | Bang], [TStrictBPF], [], BPFUIProps, BPFUIProps & BPFData> {
    static description = "Break-point function editor";
    static inlets: TMeta["inlets"] = [{
        type: "anything",
        isHot: true,
        description: "Display & output a bpf, bang to output"
    }, {
        type: "anything",
        isHot: true,
        description: "Display without output"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "BPF triggered"
    }];
    static props: TPropsMeta<BPFUIProps> = {
        domain: {
            type: "number",
            default: 1000,
            description: "X-axis range, starts from 0",
            isUIState: true
        },
        range: {
            type: "object",
            default: [0, 1],
            description: "Y-axis range, [low, high]",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "rgba(0, 255, 255, 1)",
            description: "Text color",
            isUIState: true
        },
        fontFamily: {
            type: "enum",
            enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
            default: "Arial",
            description: "Font family",
            isUIState: true
        },
        fontSize: {
            type: "number",
            default: 10,
            description: "Text font size",
            isUIState: true
        },
        fontFace: {
            type: "enum",
            enums: ["regular", "bold", "italic", "bold italic"],
            default: "regular",
            description: "Text style",
            isUIState: true
        },
        pointColor: {
            type: "color",
            default: "white",
            description: "Text color",
            isUIState: true
        },
        lineColor: {
            type: "color",
            default: "white",
            description: "Line color",
            isUIState: true
        },
        bgColor: {
            type: "color",
            default: "rgba(0, 0, 0, 0.5)",
            description: "Background color",
            isUIState: true
        }
    };
    static ui = BPFUI;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
            if (!this.data.points) this.data.points = [];
        });
        let prevRange: [number, number];
        let prevDomain: number;
        this.on("postInit", () => {
            prevRange = this.getProp("range");
            prevDomain = this.getProp("domain");
        });
        this.on("updateProps", () => {
            const range = this.getProp("range");
            if (prevRange && prevRange !== range) {
                const points = this.data.points.map(p => [p[0], scaleClip(p[1], prevRange[0], prevRange[1], range[0], range[1]), p[2]] as TBPFPoint);
                this.setData({ points });
                this.updateUI(this.data);
                prevRange = range;
            }
            const domain = this.getProp("domain");
            if (typeof prevDomain === "number" && prevDomain !== domain) {
                const points = this.data.points.map(p => [scaleClip(p[0], 0, prevDomain, 0, domain), p[1], p[2]] as TBPFPoint);
                this.setData({ points });
                this.updateUI(this.data);
                prevDomain = domain;
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (data instanceof Bang) {
                if (inlet === 0) this.outlet(0, this.data.points.map(p => [p[1], p[0], p[2]]));
            } else {
                let points: TStrictBPF;
                try {
                    points = decodeBPF(data, 3) as TStrictBPF;
                } catch (e) {
                    this.error("Cannot decode inlet BPF");
                }
                this.setData({ points });
                this.updateUI(this.data);
            }
        });
    }
}
