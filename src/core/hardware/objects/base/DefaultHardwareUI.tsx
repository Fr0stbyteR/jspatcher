import * as React from "react";
import * as Color from "color-js";
import { SemanticICONS, Icon } from "semantic-ui-react";
import { ImportedStaticMethodObject } from "../../../../utils/symbols";
import { selectElementRange, selectElementPos } from "../../../../utils/utils";
// import StaticMethod from "../../../importer/StaticMethod";
import BaseUI, { BaseUIProps, BaseUIState } from "./BaseHardwareUI";
import type { TFlatPackage } from "../../../types";
import type { IHardwarePatcherObject, THardwareMetaType } from "./AbstractHardwareObject";
import type DefaultObject from "./DefaultHardwareObject";
import type { DefaultObjectUIProps } from "./DefaultHardwareObject";
import "./DefaultHardwareUI.scss";

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
interface DefaultUIDropdownArgvItem { key: string | number; type: THardwareMetaType; optional?: boolean; varLength?: boolean; description: string }
interface DefaultUIDropdownArgvProps { obj: typeof IHardwarePatcherObject; argv: string[]; onSelect: (e: React.MouseEvent<HTMLTableRowElement>, value: string | number) => void }
interface DefaultUIDropdownArgvState { $: number; items: DefaultUIDropdownArgvItem[] }
class DefaultUIDropdownArgv extends React.Component<DefaultUIDropdownArgvProps, DefaultUIDropdownArgvState> {
    state: DefaultUIDropdownArgvState = { $: -1, items: [] };
    refTBody = React.createRef<HTMLTableSectionElement>();
    next() { }
    prev() { }
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
export default class DefaultUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultUIProps> & Record<string, any> = {}, S extends Partial<DefaultUIState> & Record<string, any> = {}> extends BaseUI<T, P & DefaultUIProps<T>, S & DefaultUIState> {
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
                    this.props.onContentsChanged();
                }
            }
            return;
        }
        if (e.key === "Tab") {
            if (this.refDropdownObject.current && this.refSpan.current) {
                const span = this.refSpan.current;
                const { current } = this.refDropdownObject.current;
                if (current) {
                    const text = this.getApplied(current.key);
                    this.refSpan.current.textContent = text;
                    selectElementPos(span, text.length);
                    this.setState({ text });
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    this.props.onContentsChanged();
                    return;
                } else {
                    const items = this.refDropdownObject.current.state.items;
                    if (items.length) {
                        const text = this.getApplied(items[0].key);
                        this.refSpan.current.textContent = text;
                        selectElementPos(span, text.length);
                        this.setState({ text });
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        this.props.onContentsChanged();
                        return;
                    }
                }
            }
        }
        if (e.key === " ") {
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

        if (e.key.length === 1 || e.key == "Backspace") {
            this.props.onContentsChanged();
        }
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
