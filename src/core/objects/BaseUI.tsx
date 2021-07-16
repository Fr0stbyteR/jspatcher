import * as React from "react";
import * as Color from "color-js";
import { Icon, SemanticICONS, StrictModalProps, Modal, Dimmer, Loader, Button } from "semantic-ui-react";
import MonacoEditor from "react-monaco-editor";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import Box from "../patcher/Box";
import PatcherEditor from "../patcher/PatcherEditor";
import { BaseObject, DefaultObject, DefaultObjectUIProps } from "./Base";
import { IJSPatcherObject, IPropsMeta, Props } from "./AbstractObject";
import { selectElementPos, selectElementRange } from "../../utils/utils";
import { TFlatPackage, TMetaType } from "../types";
import { ImportedStaticMethodObject } from "../../utils/symbols";
import { StaticMethod } from "./importer/StaticMethod";
import "./Default.scss";
import "./Base.scss";

export interface AbstractUIProps<T extends IJSPatcherObject = IJSPatcherObject> {
    object: T;
    editor: PatcherEditor;
    inDock?: boolean;
    editing: boolean;
    onEditEnd: () => any;
}
export interface AbstractUIState {
    width: number | string;
    height: number | string;
}
export abstract class AbstractUI<
        T extends IJSPatcherObject = IJSPatcherObject,
        P extends Partial<AbstractUIProps<T>> & Record<string, any> = {},
        S extends Partial<AbstractUIState> & Record<string, any> = {}
> extends React.PureComponent<AbstractUIProps<T> & P, S & AbstractUIState> {
    /**
     * Sizing rule
     */
    static sizing: "horizontal" | "vertical" | "both" | "ratio";
    /**
     * Default Size while object is created.
     */
    static defaultSize: [number, number];
    /**
     * If set to true, call this.props.onEditEnd at some point
     */
    static editableOnUnlock: boolean;
    /**
     * If this UI can be displayed elsewhere
     */
    static dockable: boolean;
    state: S & AbstractUIState = {
        ...this.state,
        ...this.objectProps,
        width: this.box.getWidth(this.editor.state.presentation),
        height: this.box.getHeight(this.editor.state.presentation)
    };
    get dockable() {
        return (this.constructor as typeof AbstractUI).dockable;
    }
    get object(): T {
        return this.props.object;
    }
    get patcher() {
        return this.props.object.patcher;
    }
    get editor() {
        return this.props.editor;
    }
    get box(): Box<T> {
        return this.props.object.box;
    }
    get objectProps() {
        const props: Partial<Props<T>> = {};
        const objectProps = this.object.meta.props as IPropsMeta<Props<T>>;
        for (const key in objectProps) {
            if (objectProps[key].isUIState) props[key] = (this.object as any).getProp(key);
        }
        return props;
    }
    private _handleUIUpdate = (e?: Pick<S & AbstractUIState, keyof (S & AbstractUIState)>) => (e ? this.setState(e) : this.forceUpdate());
    private _handleResized = () => {
        const width = this.box.getWidth(this.editor.state.presentation);
        const height = this.box.getHeight(this.editor.state.presentation);
        if (width !== this.state.width || height !== this.state.height) this.setState({ width, height });
    };
    componentDidMount() {
        delete this.box._editing;
        this.object.on("updateUI", this._handleUIUpdate);
        if (this.dockable && this.props.inDock) return;
        this.box.on("rectChanged", this._handleResized);
        this.box.on("presentationRectChanged", this._handleResized);
        this.editor.on("presentation", this._handleResized);
    }
    componentWillUnmount() {
        this.object.off("updateUI", this._handleUIUpdate);
        if (this.dockable && this.props.inDock) return;
        this.box.off("rectChanged", this._handleResized);
        this.box.off("presentationRectChanged", this._handleResized);
        this.editor.off("presentation", this._handleResized);
    }
    render() {
        return <></>;
    }
}
export interface BaseUIProps<T extends BaseObject = BaseObject> extends AbstractUIProps<T> {
    containerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    additionalClassName?: string;
}
export interface BaseUIState extends AbstractUIState {
    hidden: boolean;
    ignoreClick: boolean;
    hint: string;
}
export class BaseUI<T extends BaseObject = BaseObject, P extends Partial<BaseUIProps<T>> & Record<string, any> = {}, S extends Partial<BaseUIState> & Record<string, any> = {}> extends AbstractUI<T, P & BaseUIProps<T>, S & BaseUIState> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "horizontal";
    static defaultSize: [number, number] = [90, 20];
    static editableOnUnlock = false;
    static dockable = false;
    state: S & BaseUIState = {
        ...this.state,
        background: this.box.background || false,
        presentation: this.box.presentation || false
    };
    private _handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.editor.state.locked) e.currentTarget.title = this.state.hint;
    };
    private _handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.title = "";
    render() {
        const { object } = this;
        const packageName = "package-" + object.meta.package.toLowerCase();
        const className = packageName + "-" + object.meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container"];
        if (this.props.additionalClassName) classArray.push(this.props.additionalClassName);
        if (this.state.hidden) classArray.push("hidden");
        if (this.state.ignoreClick) classArray.push("ignore-click");
        return (
            <div className={classArray.join(" ")} {...this.props.containerProps} onMouseEnter={this._handleMouseEnter} onMouseLeave={this._handleMouseLeave}>
                {this.props.children}
            </div>
        );
    }
}
export interface DefaultUIProps<T extends DefaultObject = DefaultObject> extends BaseUIProps<T> {
    textContainerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    prependProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    spanProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement>;
    appendProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
}
export interface DefaultUIState extends BaseUIState, DefaultObjectUIProps {
    text: string;
    loading: boolean;
}
interface DefaultUIDropdownObjectsItem { key: string; icon: SemanticICONS; description: string }
interface DefaultUIDropdownObjectsProps { lib: TFlatPackage; query: string; staticMethodOnly?: boolean; onSelect: (e: React.MouseEvent<HTMLTableRowElement>, value: string) => void }
interface DefaultUIDropdownObjectsState { $: number; items: DefaultUIDropdownObjectsItem[] }
class DefaultUIDropdownObjects extends React.Component<DefaultUIDropdownObjectsProps, DefaultUIDropdownObjectsState> {
    state: DefaultUIDropdownObjectsState = { $: -1, items: [] };
    refTBody = React.createRef<HTMLTableSectionElement>();
    next() {
        const { items, $ } = this.state;
        this.setState({ $: Math.min(items.length - 1, $ + 1) });
        if ($ >= 0 && this.refTBody.current && items[$ + 1]) {
            const table = this.refTBody.current.parentElement;
            const row = (this.refTBody.current.children[$ + 1] as HTMLTableRowElement);
            if (row.offsetTop + row.offsetHeight > table.scrollTop + table.offsetHeight) row.scrollIntoView(false);
        }
    }
    prev() {
        const { items, $ } = this.state;
        this.setState({ $: Math.max(-1, $ - 1) });
        if ($ >= 0 && this.refTBody.current && items[$ - 1]) {
            const table = this.refTBody.current.parentElement;
            const row = (this.refTBody.current.children[$ - 1] as HTMLTableRowElement);
            if (row.offsetTop < table.scrollTop) row.scrollIntoView(true);
        }
    }
    get current() {
        return this.state.items[this.state.$];
    }
    static getItems(propsIn: DefaultUIDropdownObjectsProps) {
        const { lib, query, staticMethodOnly } = propsIn;
        const keys = Object.keys(lib).sort();
        const items: DefaultUIDropdownObjectsItem[] = [];
        for (let i = 0; i < keys.length; i++) {
            if (items.length >= 16) break;
            const key = keys[i];
            if (key.startsWith(query)) {
                const o = lib[key];
                const { icon, description } = o.meta;
                if (staticMethodOnly) {
                    if ((o as typeof StaticMethod)[ImportedStaticMethodObject]) {
                        items.push({ key, icon, description });
                    }
                } else {
                    items.push({ key, icon, description });
                }
            }
        }
        return items;
    }
    componentDidMount() {
        this.setState({ items: DefaultUIDropdownObjects.getItems(this.props), $: -1 });
    }
    shouldComponentUpdate(nextProps: Readonly<DefaultUIDropdownObjectsProps>, nextState: Readonly<DefaultUIDropdownObjectsState>, context: any) {
        if (nextProps.query !== this.props.query || nextProps.staticMethodOnly !== this.props.staticMethodOnly) {
            this.setState({ items: DefaultUIDropdownObjects.getItems(nextProps), $: -1 });
            return false;
        }
        if (nextState.$ !== this.state.$ || nextState.items !== this.state.items) return true;
        return false;
    }
    render() {
        return (
            <div className="box-ui-text-dropdown">
                <table className="ui small inverted selectable striped unstackable very compact table box-ui-text-autocomplete">
                    <tbody ref={this.refTBody}>
                        {this.state.items.map((option, i) => (
                            <tr key={option.key} className={i === this.state.$ ? "focused" : ""} onMouseDown={e => this.props.onSelect(e, option.key)}>
                                <td>{option.icon ? <Icon inverted={true} size="small" name={option.icon} /> : undefined}</td>
                                <td>{option.key}</td>
                                <td>{option.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
interface DefaultUIDropdownArgvItem { key: string | number; type: TMetaType; optional?: boolean; varLength?: boolean; description: string }
interface DefaultUIDropdownArgvProps { obj: typeof IJSPatcherObject; argv: string[]; onSelect: (e: React.MouseEvent<HTMLTableRowElement>, value: string | number) => void }
interface DefaultUIDropdownArgvState { $: number; items: DefaultUIDropdownArgvItem[] }
class DefaultUIDropdownArgv extends React.Component<DefaultUIDropdownArgvProps, DefaultUIDropdownArgvState> {
    state: DefaultUIDropdownArgvState = { $: -1, items: [] };
    refTBody = React.createRef<HTMLTableSectionElement>();
    next() {}
    prev() {}
    get current() {
        return this.state.items[this.state.$];
    }
    static getItems(propsIn: DefaultUIDropdownArgvProps) {
        const { obj } = propsIn;
        const { args, props } = obj.meta;
        const items: DefaultUIDropdownArgvItem[] = [];
        for (let i = 0; i < args.length; i++) {
            const { type, optional, varLength, description } = args[i];
            items.push({ key: i, type, optional, varLength, description });
        }
        Object.keys(props).reverse().forEach((key) => {
            const { type, description } = props[key];
            items.push({ key, type, description });
        });
        return items;
    }
    componentDidMount() {
        this.setState({ items: DefaultUIDropdownArgv.getItems(this.props), $: -1 });
    }
    shouldComponentUpdate(nextProps: Readonly<DefaultUIDropdownArgvProps>, nextState: Readonly<DefaultUIDropdownArgvState>, context: any) {
        if (nextProps.obj !== this.props.obj || nextProps.argv !== this.props.argv) {
            this.setState({ items: DefaultUIDropdownArgv.getItems(nextProps), $: -1 });
            return false;
        }
        if (nextState.$ !== this.state.$ || nextState.items !== this.state.items) return true;
        return false;
    }
    render() {
        return (
            <div className="box-ui-text-dropdown">
                <table className="ui small inverted selectable striped unstackable very compact table box-ui-text-autocomplete">
                    <tbody ref={this.refTBody}>
                        {this.state.items.map((option, i) => (
                            <tr key={option.key} className={i === this.state.$ ? "focused" : ""} onMouseDown={e => this.props.onSelect(e, option.key)}>
                                {
                                    typeof option.key === "number"
                                        ? <>
                                            <td><Icon inverted={true} size="small" name="ellipsis horizontal" /></td>
                                            <td>{option.optional ? `[${option.varLength ? "..." : ""}arg${option.key}]` : `${option.varLength ? "..." : ""}arg${option.key}`}</td>
                                        </>
                                        : <>
                                            <td><Icon inverted={true} size="small" name="at" /></td>
                                            <td>{option.key}</td>
                                        </>
                                }
                                <td style={{ color: "#30a0a0" }}>{option.type}</td>
                                <td>{option.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
export class DefaultUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultUIProps> & Record<string, any> = {}, S extends Partial<DefaultUIState> & Record<string, any> = {}> extends BaseUI<T, P & DefaultUIProps<T>, S & DefaultUIState> {
    static editableOnUnlock = true;
    state: S & DefaultUIState = {
        ...this.state,
        text: this.box.text || "",
        loading: false
    };
    refSpan = React.createRef<HTMLSpanElement>();
    refDropdownObject = React.createRef<DefaultUIDropdownObjects>();
    refDropdownArgv = React.createRef<DefaultUIDropdownArgv>();
    componentDidMount() {
        super.componentDidMount();
        if (this.props.editing) this.toggleEdit(this.props.editing);
    }
    componentDidUpdate(prevProps: Readonly<P & DefaultUIProps>, prevState: Readonly<S & DefaultUIState>) {
        if (this.props.editing !== prevProps.editing) this.toggleEdit(this.props.editing);
    }
    toggleEdit(toggle: boolean) {
        const { patcher, box, editor } = this;
        if (editor.state.locked) return;
        if (!this.refSpan.current) return;
        const span = this.refSpan.current;
        if (toggle) {
            editor.selectOnly(box.id);
            this.setState({ text: span.textContent }, () => {
                span.focus();
                selectElementRange(span);
            });
        } else {
            window.getSelection().removeAllRanges();
            patcher.changeBoxText(box.id, span.textContent);
            this.setState({ text: span.textContent });
        }
    }
    handleMouseDown = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleClick = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
        if (!this.props.editing) return;
        if (e.key === "Enter") {
            e.preventDefault();
            if (this.refDropdownObject.current && this.refSpan.current) {
                const { current } = this.refDropdownObject.current;
                if (current) {
                    const text = this.getApplied(current.key);
                    this.refSpan.current.textContent = text;
                    this.setState({ text });
                }
            }
            return;
        }
        if (e.key === " " || e.key === "Tab") {
            if (this.refDropdownObject.current && this.refSpan.current) {
                const span = this.refSpan.current;
                const { current } = this.refDropdownObject.current;
                if (current) {
                    const text = this.getApplied(current.key);
                    this.refSpan.current.textContent = text;
                    selectElementPos(span, text.length);
                    this.setState({ text });
                }
            }
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            if (this.refDropdownObject.current) {
                if (e.key === "ArrowUp") this.refDropdownObject.current.prev();
                else if (e.key === "ArrowDown") this.refDropdownObject.current.next();
            }
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    handleKeyUp = () => {
        if (!this.refSpan.current) return;
        if (this.refSpan.current.textContent === this.state.text) return;
        this.setState({ text: this.refSpan.current.textContent });
    };
    get dropdownQuery() {
        let { text } = this.state;
        if (!this.props.editing || !text.length) return { Dropdown: undefined, query: undefined };
        if (text.startsWith("new ")) text = text.slice(4);
        else if (text.startsWith("func ")) text = text.slice(5);
        const splitted = text.split(/\s/);
        if (splitted.length === 1) return { Dropdown: DefaultUIDropdownObjects, query: splitted[0] };
        const [className, ...argv] = splitted;
        const obj = this.patcher.activeLib[className];
        if (!obj) return { Dropdown: undefined, query: undefined };
        return { Dropdown: DefaultUIDropdownArgv, query: { obj, argv } };
    }
    getApplied(textIn: string) {
        let { text } = this.state;
        let keyword = "";
        if (text.startsWith("new ")) {
            keyword = "new ";
            text = text.slice(4);
        } else if (text.startsWith("func ")) {
            keyword = "func ";
            text = text.slice(5);
        }
        const splitted = text.split(/\s/);
        if (splitted.length === 1) {
            return `${keyword}${textIn}`;
        }
        return textIn;
    }
    handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    };
    handleSelect = (e: React.MouseEvent<HTMLTableRowElement>, textIn: string) => {
        e.preventDefault();
        if (this.refSpan.current) {
            const span = this.refSpan.current;
            const text = this.getApplied(textIn);
            this.refSpan.current.textContent = text;
            selectElementPos(span, text.length);
            this.setState({ text });
        }
    };
    render() {
        const { object, dropdownQuery } = this;
        const textContainerStyle: React.CSSProperties = {
            borderColor: this.state.borderColor,
            backgroundColor: this.state.bgColor
        };
        if (this.state.loading) {
            const bgColor = Color(this.state.bgColor);
            const gradIsWhite = bgColor.getLightness() < 0.5;
            const gradColor = gradIsWhite ? bgColor.lightenByAmount(0.25) : bgColor.darkenByAmount(0.25);
            textContainerStyle.backgroundImage = `linear-gradient(to right, ${this.state.bgColor} 0%, ${gradColor.toCSS()} 20%, ${this.state.bgColor} 40%, ${this.state.bgColor} 200%)`;
        }
        const spanStyle: React.CSSProperties = {
            color: this.state.textColor,
            fontFamily: `${this.state.fontFamily}, Tahoma, sans-serif`,
            fontSize: this.state.fontSize,
            fontWeight: this.state.fontWeight,
            fontStyle: this.state.fontStyle,
            textAlign: this.state.textAlign
        };
        const textContainerProps = { ...this.props.textContainerProps };
        textContainerProps.style = { ...textContainerProps.style, ...textContainerStyle };
        const spanProps = { ...this.props.spanProps };
        spanProps.style = { ...spanProps.style, ...spanStyle };
        const { Dropdown, query } = dropdownQuery;
        return (
            <BaseUI additionalClassName="box-ui-default" {...this.props}>
                <div className={"box-ui-text-container" + (this.state.loading ? " loading" : "")} {...textContainerProps}>
                    <div className="box-ui-text-container-prepend" {...this.props.prependProps}>
                        {object.meta.icon ? <Icon inverted={true} size="small" name={object.meta.icon} /> : null}
                    </div>
                    <span contentEditable={this.props.editing} className={"editable" + (this.props.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} onBlur={this.props.onEditEnd} suppressContentEditableWarning={true} {...spanProps}>
                        {object.box.text}
                    </span>
                    {
                        Dropdown === DefaultUIDropdownObjects && typeof query === "string"
                            ? <DefaultUIDropdownObjects lib={this.patcher.activeLib} query={query} onSelect={this.handleSelect} staticMethodOnly={this.state.text.startsWith("new ")} ref={this.refDropdownObject} />
                            : Dropdown === DefaultUIDropdownArgv && typeof query === "object"
                                ? <DefaultUIDropdownArgv obj={query.obj} argv={query.argv} onSelect={this.handleSelect} ref={this.refDropdownArgv} />
                                : undefined
                    }
                    <div className="box-ui-text-container-append" {...this.props.appendProps} />
                </div>
            </BaseUI>
        );
    }
}
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
