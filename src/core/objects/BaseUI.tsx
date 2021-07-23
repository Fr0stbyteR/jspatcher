import * as React from "react";
import { Icon, StrictModalProps, Modal, Dimmer, Loader, Button } from "semantic-ui-react";
import type MonacoEditor from "react-monaco-editor";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import type DefaultObject from "./base/DefaultObject";
import type BaseObject from "./base/BaseObject";
import BaseUI, { BaseUIProps, BaseUIState } from "./base/BaseUI";
import DefaultUI, { DefaultUIProps, DefaultUIState } from "./base/DefaultUI";
import "./Base.scss";

export interface CanvasUIProps<T extends BaseObject = BaseObject> extends BaseUIProps<T> {
    canvasProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLCanvasElement> & React.HTMLAttributes<HTMLCanvasElement>;
    onPaint?: <S extends CanvasUIState = CanvasUIState>(ctx: CanvasRenderingContext2D, state: S) => void;
}
export interface CanvasUIState extends BaseUIState {
    frameRate: number;
}
export class CanvasUI<T extends BaseObject = BaseObject, P extends Partial<CanvasUIProps> & Record<string, any> = {}, S extends Partial<CanvasUIState> & Record<string, any> = {}> extends BaseUI<T, P & CanvasUIProps<T>, S & CanvasUIState> {
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
    }
    componentDidUpdate(prevProps: Readonly<P & CanvasUIProps<T>>, prevState: Readonly<S & CanvasUIState>, snapshot?: any) { // super.componentDidUpdate is not a function
        this.schedulePaint();
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.editor.off("presentation", this.schedulePaint);
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
export interface DefaultPopupUIProps extends DefaultUIProps {
    modalProps: StrictModalProps;
}
export interface DefaultPopupUIState extends DefaultUIState {
    modalOpen: boolean;
}
export class DefaultPopupUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultPopupUIProps> & Record<string, any> = {}, S extends Partial<DefaultPopupUIState> & Record<string, any> = {}> extends DefaultUI<T, P & DefaultPopupUIProps, S & DefaultPopupUIState> {
    state: S & DefaultPopupUIState = {
        ...this.state,
        modalOpen: false
    };
    handleDoubleClick = () => {
        if (this.editor.state.locked) this.setState({ modalOpen: true });
    };
    handleClose = () => this.setState({ modalOpen: false });
    handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    render() {
        const containerProps = { ...this.props.containerProps };
        if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;
        const modalProps = { ...this.props.modalProps };
        if (typeof modalProps.open === "undefined") modalProps.open = this.state.modalOpen;
        if (!modalProps.onClose) modalProps.onClose = this.handleClose;
        return (
            <>
                <DefaultUI {...this.props} containerProps={containerProps} />
                <Modal onKeyDown={this.handleKeyDown} {...modalProps} />
            </>
        );
    }
}
export interface CodePopupUIState extends DefaultPopupUIState {
    editorLoaded: boolean;
}
export class CodePopupUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultPopupUIProps> & Record<string, any> = {}, S extends Partial<CodePopupUIState> & Record<string, any> = {}> extends DefaultPopupUI<T, P, S & CodePopupUIState> {
    static dockable = true;
    state: S & CodePopupUIState = {
        ...this.state,
        editorLoaded: false
    };
    codeEditor: editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    editorLanguage = "javascript";
    get code() {
        return "";
    }
    handleSave = (code: string): any => undefined;
    handleCloseAndSave = () => {
        this.setState({ modalOpen: false });
        this.handleSave(this.codeEditor.getValue());
    };
    handleCodeEditorMount = (monaco: editor.IStandaloneCodeEditor) => this.codeEditor = monaco;
    handleResize = () => ((this.state.editorLoaded && this.codeEditor) ? this.codeEditor.layout() : undefined);
    async componentDidMount() {
        super.componentDidMount();
        window.addEventListener("resize", this.handleResize);
        const reactMonacoEditor = await import("react-monaco-editor");
        this.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        window.removeEventListener("resize", this.handleResize);
    }
    componentDidUpdate(prevProps: Readonly<DefaultPopupUIProps>, prevState: Readonly<S & CodePopupUIState>) {
        if (this.props.inDock) {
            if (this.state.width !== prevState.width || this.state.height !== prevState.height) this.handleResize();
        }
    }
    render() {
        if (this.props.inDock) {
            if (!this.state.editorLoaded) return <Dimmer active><Loader content="Loading" /></Dimmer>;
            return (
                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", width: "100%", height: "100%" }}>
                    <div style={{ flex: "1 1 auto", overflow: "hidden" }}>
                        <this.editorJSX value={this.code} language={this.editorLanguage} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} />
                    </div>
                    <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "row-reverse", padding: "10px" }}>
                        <Button icon="checkmark" content="OK" color="green" onClick={this.handleCloseAndSave} inverted />
                    </div>
                </div>
            );
        }
        const children = (
            <>
                <Modal.Content>
                    <div style={{ height: window.innerHeight * 0.8 }}>
                        {
                            this.state.editorLoaded
                                ? <this.editorJSX value={this.code} language={this.editorLanguage} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} />
                                : <Dimmer active><Loader content="Loading" /></Dimmer>
                        }
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color="red" onClick={this.handleClose} inverted>
                        <Icon name="remove" /> Cancel
                    </Button>
                    <Button color="green" onClick={this.handleCloseAndSave} inverted>
                        <Icon name="checkmark" /> OK
                    </Button>
                </Modal.Actions>
            </>
        );
        const containerProps = { ...this.props.containerProps };
        if (!containerProps.onDoubleClick) containerProps.onDoubleClick = this.handleDoubleClick;
        const modalProps: StrictModalProps = { ...this.props.modalProps, children, open: this.state.modalOpen, onClose: this.handleClose, basic: true, size: "fullscreen" };
        return <DefaultPopupUI {...this.props} modalProps={modalProps} containerProps={containerProps} />;
    }
}

export class DivContainer extends React.PureComponent<{ containerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>; children?: ChildNode[] }, { root: HTMLDivElement }> {
    root = React.createRef<HTMLDivElement>();
    state = { root: undefined as HTMLDivElement };
    componentDidMount() {
        const root = this.root.current;
        if (this.props.children) this.props.children.forEach(v => root.appendChild(v));
        this.setState({ root });
    }
    componentDidUpdate(prevProps: Readonly<{ children: ChildNode[] }>, prevState: Readonly<{ root: HTMLDivElement }>) {
        if (!this.state.root) return;
        if (this.props.children !== prevProps.children) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.root.innerHTML = "";
            this.props.children.forEach(v => this.state.root.appendChild(v));
        }
    }
    render() {
        const { containerProps } = this.props;
        const containerStyle: React.CSSProperties = { width: "100%", height: "100%", position: "absolute", display: "block", overflow: "auto", ...((containerProps && containerProps.style) ? containerProps.style : {}) };
        return (
            <div {...containerProps} style={containerStyle} ref={this.root} />
        );
    }
}
export class ShadowDOMContainer extends React.PureComponent<{ children: ChildNode[] }, { root: ShadowRoot }> {
    root = React.createRef<HTMLDivElement>();
    state = { root: undefined as ShadowRoot };
    componentDidMount() {
        const root = this.root.current.attachShadow({ mode: "open" });
        if (this.props.children) this.props.children.forEach(v => root.appendChild(v));
        this.setState({ root });
    }
    componentDidUpdate(prevProps: Readonly<{ children: ChildNode[] }>, prevState: Readonly<{ root: ShadowRoot }>) {
        if (!this.state.root) return;
        if (this.props.children !== prevProps.children) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.root.innerHTML = "";
            this.props.children.forEach(v => this.state.root.appendChild(v));
        }
    }
    render() {
        return (
            <div style={{ width: "100%", height: "100%", position: "absolute", display: "block", overflow: "auto" }} ref={this.root} />
        );
    }
}
export interface DOMUIState extends BaseUIState {
    shadow: boolean;
    containerProps: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    children: ChildNode[];
}
export class DOMUI<T extends BaseObject = BaseObject, P extends Partial<BaseUIProps> & Record<string, any> = {}, S extends Partial<DOMUIState> & Record<string, any> = {}> extends BaseUI<T, P & BaseUIProps<T>, S & DOMUIState> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "both";
    static defaultSize: [number, number] = [210, 90];
    state: S & DOMUIState = { ...this.state, shadow: false, containerProps: {}, children: [] };
    render() {
        return (
            <BaseUI {...this.props}>
                {this.state.shadow ? <ShadowDOMContainer children={this.state.children} /> : <DivContainer containerProps={this.state.containerProps} children={this.state.children} />}
            </BaseUI>
        );
    }
}
