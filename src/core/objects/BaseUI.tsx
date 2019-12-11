import * as React from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";
import Box from "../Box";
import "./Default.scss";
import "./Base.scss";
import { BaseUIState, DefaultUIState } from "../types";
import { AbstractObject, BaseObject, AnyObject, DefaultObject } from "./Base";
import { selectElementPos, selectElementRange } from "../../utils";

export type AbstractUIProps<T extends AbstractObject = AbstractObject> = {
    object: T;
    editing: boolean;
    onEditEnd: () => any;
}
export abstract class AbstractUI<
        T extends AbstractObject = AbstractObject,
        P extends Partial<AbstractUIProps<T>> & { [key: string]: any } = {},
        S extends { [key: string]: any } = {}
> extends React.Component<AbstractUIProps<T> & P, S> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio";
    static defaultSize: [number, number];
    state = {} as Readonly<S>;
    get object(): T {
        return this.props.object;
    }
    get patcher() {
        return this.props.object.patcher;
    }
    get box(): Box<T> {
        return this.props.object.box;
    }
    componentDidMount() {
        delete this.box._editing;
        this.object.on("uiUpdate", e => this.setState(e));
    }
    componentWillUnmount() {
        this.object.off("uiUpdate", e => this.setState(e));
    }
    render() {
        return <></>;
    }
}
export type BaseUIProps = {
    containerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    additionalClassName?: string;
} & AbstractUIProps;
export class BaseUI<T extends BaseObject = AnyObject, P extends Partial<BaseUIProps> & { [key: string]: any } = {}, S extends Partial<BaseUIState> & { [key: string]: any } = {}> extends AbstractUI<T, P & BaseUIProps, S & BaseUIState> {
    state: S & BaseUIState = {
        ...this.state,
        hidden: this.box.props.hidden || false,
        background: this.box.background || false,
        presentation: this.box.presentation || false,
        ignoreClick: this.box.props.ignoreClick || false,
        hint: this.box.props.hint || ""
    };
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "horizontal";
    editableOnUnlock = false;
    handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((this.props.object as T).patcher.state.locked) e.currentTarget.title = this.state.hint;
    }
    handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.title = "";
    render() {
        const { object } = this;
        const packageName = "package-" + object.meta.package.toLowerCase();
        const className = packageName + "-" + object.meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container", this.props.additionalClassName];
        if (this.state.hidden) classArray.push("hidden");
        if (this.state.ignoreClick) classArray.push("ignore-click");
        return (
            <div className={classArray.join(" ")} {...this.props.containerProps} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                {this.props.children}
            </div>
        );
    }
}
export type DefaultUIProps = {
    textContainerProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    prependProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
    spanProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement>;
    appendProps?: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
} & BaseUIProps;
export type DefaultUIAdditionalState = { text: string; loading: boolean; dropdown$: number };
export class DefaultUI<T extends DefaultObject = DefaultObject, P extends Partial<DefaultUIProps> & { [key: string]: any } = {}, S extends Partial<DefaultUIState & DefaultUIAdditionalState> & { [key: string]: any } = {}> extends BaseUI<T, P & DefaultUIProps, S & DefaultUIState & DefaultUIAdditionalState> {
    editableOnUnlock = true;
    state: S & DefaultUIState & DefaultUIAdditionalState = {
        ...this.state,
        bgColor: this.box.props.bgColor || "rgb(51, 51, 51)",
        borderColor: this.box.props.borderColor || "rgb(125, 126, 132)",
        textColor: this.box.props.textColor || "rgb(255, 255, 255)",
        fontFamily: this.box.props.fontFamily || "Lato",
        fontSize: this.box.props.fontSize || 12,
        fontStyle: this.box.props.fontStyle || "normal",
        fontWeight: this.box.props.fontWeight || "normal",
        textAlign: this.box.props.textAlign || "left",
        text: this.box.text || "",
        loading: false,
        dropdown$: -1
    };
    refSpan = React.createRef<HTMLSpanElement>();
    refDropdown = React.createRef<HTMLTableSectionElement>();
    dropdownOptions: { key: string; value: string; text: string; icon: SemanticICONS; description: string }[] = [];
    componentDidMount() {
        super.componentDidMount();
        this.toggleEdit(this.props.editing);
    }
    componentDidUpdate(prevProps: Readonly<P & DefaultUIProps>) {
        if (this.props.editing !== prevProps.editing) this.toggleEdit(this.props.editing);
    }
    toggleEdit(toggle: boolean) {
        const { patcher, box } = this;
        if (patcher.state.locked) return;
        if (!this.refSpan.current) return;
        const span = this.refSpan.current;
        if (toggle) {
            patcher.selectOnly(box.id);
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
            if (this.state.dropdown$ >= 0 && this.dropdownOptions[this.state.dropdown$] && this.refSpan.current) {
                this.refSpan.current.textContent = this.state.text.split(" ").slice(0, -1).concat(this.dropdownOptions[this.state.dropdown$].key).join(" ");
            }
            return;
        }
        if ((e.key === " " || e.key === "Tab") && this.refSpan.current) {
            if (this.state.dropdown$ >= 0 && this.dropdownOptions[this.state.dropdown$]) {
                const span = this.refSpan.current;
                const text = this.state.text.split(" ").slice(0, -1).concat(this.dropdownOptions[this.state.dropdown$].key).join(" ") + " ";
                span.textContent = text;
                selectElementPos(span, text.length);
                this.setState({ text, dropdown$: -1 });
            }
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            let dropdown$;
            if (e.key === "ArrowUp") dropdown$ = Math.max(-1, this.state.dropdown$ - 1);
            if (e.key === "ArrowDown") dropdown$ = Math.min(this.dropdownOptions.length - 1, this.state.dropdown$ + 1);
            this.setState({ dropdown$ });
            if (dropdown$ >= 0 && this.refDropdown.current && this.dropdownOptions[this.state.dropdown$]) {
                (this.refDropdown.current.children[dropdown$] as HTMLTableRowElement).scrollIntoView(false);
            }
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    handleKeyUp = () => {
        if (!this.refSpan.current) return;
        if (this.refSpan.current.textContent === this.state.text) return;
        const { patcher } = this;
        this.dropdownOptions = [];
        const splitted = this.refSpan.current.textContent.split(" ");
        if (splitted.length === 1) {
            const keys = Object.keys(patcher.state.lib).sort();
            for (let i = 0; i < keys.length; i++) {
                if (this.dropdownOptions.length > 10) break;
                const key = keys[i];
                if (key.startsWith(splitted[splitted.length - 1])) {
                    const o = patcher.state.lib[key];
                    this.dropdownOptions.push({ key, value: key, text: key, icon: o.meta.icon, description: o.meta.description });
                }
            }
        } else if (splitted[0] === "new" && splitted.length === 2) {
            const keys = Object.keys(patcher.state.lib).sort();
            for (let i = 0; i < keys.length; i++) {
                if (this.dropdownOptions.length > 10) break;
                const key = keys[i];
                if (key.startsWith(splitted[splitted.length - 1])) {
                    const o = patcher.state.lib[key];
                    if (o.meta.description === "Auto-imported static method") {
                        this.dropdownOptions.push({ key, value: key, text: key, icon: o.meta.icon, description: o.meta.description });
                    }
                }
            }
        }
        this.setState({ text: this.refSpan.current.textContent });
    }
    handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    }
    handleMouseDownDropdown = (e: React.MouseEvent, key: string, i: number) => {
        e.preventDefault();
        if (i >= 0 && this.dropdownOptions[i] && this.refSpan.current) {
            const span = this.refSpan.current;
            const text = this.state.text.split(" ").slice(0, -1).concat(this.dropdownOptions[i].key).join(" ");
            span.textContent = text;
            selectElementPos(span, text.length);
            this.setState({ text, dropdown$: i });
        }
    }
    render() {
        const { object } = this;
        const textContainerStyle: React.CSSProperties = {
            borderColor: this.state.borderColor,
            color: this.state.textColor,
            fontFamily: `${this.state.fontFamily}, Tahoma, sans-serif`,
            fontSize: this.state.fontSize,
            fontWeight: this.state.fontWeight,
            fontStyle: this.state.fontStyle,
            textAlign: this.state.textAlign
        };
        return (
            <BaseUI {...this.props} additionalClassName="box-ui-default" containerProps={{ style: { backgroundColor: this.state.bgColor } }}>
                <div className="box-ui-text-container" {...this.props.textContainerProps} style={textContainerStyle}>
                    <div className="box-ui-text-container-prepend" {...this.props.prependProps}>
                        {object.meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object.meta.icon} /> : null}
                    </div>
                    <span contentEditable={this.props.editing} className={"editable" + (this.props.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} onBlur={this.props.onEditEnd} suppressContentEditableWarning={true} {...this.props.spanProps}>
                        {object.box.text}
                    </span>
                    {
                        this.props.editing && this.state.text.length
                            ? <div className="box-ui-text-dropdown">
                                <table className="ui small inverted selectable striped unstackable very compact table box-ui-text-autocomplete">
                                    <tbody ref={this.refDropdown}>
                                        {this.dropdownOptions.map((option, i) => (
                                            <tr key={option.key} className={i === this.state.dropdown$ ? "focused" : ""} onMouseDown={e => this.handleMouseDownDropdown(e, option.key, i)}>
                                                <td>{option.icon ? <Icon inverted={true} size="small" name={option.icon} /> : undefined}</td>
                                                <td>{option.key}</td>
                                                <td>{option.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            : undefined
                    }
                    <div className="box-ui-text-container-append" {...this.props.appendProps}>
                    </div>
                </div>
            </BaseUI>
        );
    }
}
