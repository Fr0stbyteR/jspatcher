import * as React from "react";
import BaseUI, { BaseUIProps, BaseUIState } from "./BaseUI";
import type BaseObject from "./BaseObject";

export interface CanvasUIProps<T extends BaseObject = BaseObject> extends BaseUIProps<T> {
    canvasProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLCanvasElement> & React.HTMLAttributes<HTMLCanvasElement>;
    onPaint?: <S extends CanvasUIState = CanvasUIState>(ctx: CanvasRenderingContext2D, state: S) => void;
}
export interface CanvasUIState extends BaseUIState {
    frameRate: number;
}
export default class CanvasUI<T extends BaseObject = BaseObject, P extends Partial<CanvasUIProps> & Record<string, any> = {}, S extends Partial<CanvasUIState> & Record<string, any> = {}> extends BaseUI<T, P & CanvasUIProps<T>, S & CanvasUIState> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "both";
    refCanvas = React.createRef<HTMLCanvasElement>();
    paintScheduled = false;
    $paintRaf = -1;
    get canvas() {
        return this.refCanvas.current;
    }
    get ctx() {
        return this.refCanvas.current ? this.refCanvas.current.getContext("2d") : null;
    }
    fullSize(): [number, number] {
        const { width, height } = this.state;
        const { canvas, ctx } = this;
        if (!ctx) return [0, 0];
        if (typeof width === "number" && typeof height === "number") {
            if (ctx.canvas.width !== width) ctx.canvas.width = width;
            if (ctx.canvas.height !== height) ctx.canvas.height = height;
            return [width, height];
        }
        const rect = canvas.getBoundingClientRect();
        const w = typeof width === "number" ? width : ~~rect.width;
        const h = typeof height === "number" ? height : ~~rect.height;
        if (ctx.canvas.width !== w) ctx.canvas.width = w;
        if (ctx.canvas.height !== h) ctx.canvas.height = h;
        return [w, h];
    }
    paintCallback = () => {
        this.$paintRaf = (-1 * Math.round(Math.abs(60 / this.state.frameRate))) || -1;
        this.paintScheduled = false;
        this.paint();
    };
    noPaintCallback = () => {
        this.$paintRaf++;
        this.paintScheduled = false;
        this.schedulePaint();
    };
    schedulePaint = () => {
        if (this.editor.state.presentation && !this.box.presentation) return;
        if (this.paintScheduled) return;
        if (this.$paintRaf === -1) this.$paintRaf = requestAnimationFrame(this.paintCallback);
        else if (this.$paintRaf < -1) requestAnimationFrame(this.noPaintCallback);
        this.paintScheduled = true;
    };
    componentDidMount() {
        super.componentDidMount();
        this.schedulePaint();
        this.editor.on("presentation", this.schedulePaint);
        window.addEventListener("resize", this.schedulePaint);
    }
    componentDidUpdate(prevProps: Readonly<P & CanvasUIProps<T>>, prevState: Readonly<S & CanvasUIState>, snapshot?: any) { // super.componentDidUpdate is not a function
        this.schedulePaint();
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.editor.off("presentation", this.schedulePaint);
        window.removeEventListener("resize", this.schedulePaint);
        if (this.paintScheduled) cancelAnimationFrame(this.$paintRaf);
    }
    paint() {
        if (this.props.onPaint) this.props.onPaint(this.ctx, this.state);
    }
    render() {
        const canvasProps = { ...this.props.canvasProps };
        const defaultCanvasStyle: React.CSSProperties = { position: "absolute", display: "inline-block", width: "100%", height: "100%" };
        canvasProps.style = { ...defaultCanvasStyle, ...canvasProps.style };
        return (
            <BaseUI {...this.props}>
                <canvas
                    ref={this.refCanvas}
                    {...canvasProps}
                />
            </BaseUI>
        );
    }
}
