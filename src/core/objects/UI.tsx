/* eslint-disable object-property-newline */
import * as React from "react";
import * as Util from "util";
import { Dimmer, Loader, Icon, StrictDropdownItemProps, StrictDropdownProps, Dropdown, DropdownProps } from "semantic-ui-react";
import MonacoEditor from "react-monaco-editor";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { Bang, BaseObject, AnyObject } from "./Base";
import "./UI.scss";
import { TMeta, TPropsMeta } from "../types";
import { BaseUI, BaseUIProps, BaseUIState, ShadowDOMUIState, ShadowDOMUI } from "./BaseUI";
import { selectElementRange, isNumberArray } from "../../utils/utils";

class UIObject<D = {}, S = {}, I extends any[] = any[], O extends any[] = any[], A extends any[] = any[], P = {}, U = {}, E = {}> extends BaseObject<D, S, I, O, A, P, U, E> {
    static package = "UI";
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "UI Object";
}

type ButtonUIState = { text: string; loading: boolean } & BaseUIState;
export class ButtonUI<T extends BaseObject<{ text: string }, { editing: boolean }, any, any, any, any, { text: string }>> extends BaseUI<T, {}, ButtonUIState> {
    state: ButtonUIState = { ...this.state, loading: false, text: this.props.object.data.text };
    refSpan = React.createRef<HTMLSpanElement>();
    componentDidMount() {
        super.componentDidMount();
        if (this.props.editing) this.toggleEdit(this.props.editing);
    }
    componentDidUpdate(prevProps: Readonly<BaseUIProps>) {
        if (this.props.editing !== prevProps.editing) this.toggleEdit(this.props.editing);
    }
    handleChanged = (text: string) => {};
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
            span.blur();
            this.setState({ text: span.textContent });
            this.handleChanged(span.textContent);
        }
    }
    handleMouseDown = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleClickSpan = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleClick = (e: React.MouseEvent) => {};
    handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
        if (!this.props.editing) return;
        if (e.key === "Enter") {
            e.preventDefault();
            return;
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    handlePaste = (e: React.ClipboardEvent) => {
        if (!this.props.editing) return;
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    };
    render() {
        const { object } = this;
        const classArray = ["box-ui-button", "ui", "button", "compact", "mini"];
        return (
            <BaseUI {...this.props} additionalClassName={classArray.join(" ")} containerProps={{ onClick: this.handleClick }}>
                <div className="box-ui-text-container">
                    {object.meta.icon ? <Icon inverted={true} loading={this.state.loading} size="small" name={this.state.loading ? "spinner" : object.meta.icon} /> : null}
                    <span contentEditable={this.props.editing} className={"editable" + (this.props.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClickSpan} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onBlur={this.props.onEditEnd} suppressContentEditableWarning={true}>
                        {this.state.text}
                    </span>
                </div>
            </BaseUI>
        );
    }
}
class MessageUI extends ButtonUI<message> {
    static editableOnUnlock = true;
    handleChanged = (text: string) => this.object.handleUpdateArgs([text]);
    handleClick = (e: React.MouseEvent) => {
        if (this.patcher.state.locked) this.object.outlet(0, this.object.state.buffer);
    };
}
class message extends UIObject<{ text: string }, { buffer: any; editing: boolean }, [any, any], [any], [any], {}, { text: string }> {
    static description = "Message";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Trigger output the message"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the message"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Message to send"
    }];
    state = { buffer: new Bang(), editing: false };
    handleUpdateArgs = (args: any[]) => {
        if (typeof args[0] !== "undefined") {
            this.data.text = this.stringify(args[0]);
            this.state.buffer = this.parse(args[0]);
        } else {
            this.state.buffer = new Bang();
        }
        this.updateUI({ text: this.data.text });
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("postInit", () => {
            const args = this.box.args;
            if (typeof this.data.text === "string") this.state.buffer = this.parse(this.data.text);
            else if (typeof args[0] !== "undefined") {
                if (typeof this.data.text !== "string") {
                    this.data.text = this.stringify(args[0]);
                    this.state.buffer = args[0];
                }
            } else {
                this.data.text = "";
                this.state.buffer = new Bang();
            }
            this.on("updateArgs", this.handleUpdateArgs);
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) this.outlet(0, this.state.buffer);
            else if (inlet === 1) this.handleUpdateArgs([data]);
        });
    }
    parse(o: any) {
        if (typeof o === "string") {
            if (o.length > 0) {
                try {
                    return JSON.parse(o);
                } catch (e) {
                    return o;
                }
            }
            return new Bang();
        }
        return o;
    }
    stringify(o: any) {
        if (typeof o === "string") return o;
        return Util.inspect(o);
    }
    static ui: typeof BaseUI = MessageUI;
}
class CommentUI extends BaseUI<comment> {
    static editableOnUnlock = true;
    refSpan = React.createRef<HTMLSpanElement>();
    componentDidMount() {
        super.componentDidMount();
        if (this.props.editing) this.toggleEdit(this.props.editing);
    }
    componentDidUpdate(prevProps: Readonly<BaseUIProps>) {
        if (this.props.editing !== prevProps.editing) this.toggleEdit(this.props.editing);
    }
    toggleEdit(toggle: boolean) {
        const { patcher, box } = this;
        if (patcher.state.locked) return;
        if (!this.refSpan.current) return;
        const span = this.refSpan.current;
        if (toggle) {
            patcher.selectOnly(box.id);
            span.focus();
            selectElementRange(span);
        } else {
            window.getSelection().removeAllRanges();
            span.blur();
            this.props.object.data.value = span.textContent;
        }
    }
    handleMouseDown = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleClick = (e: React.MouseEvent) => (this.props.editing ? e.stopPropagation() : null);
    handleKeyDown = (e: React.KeyboardEvent) => { // propagate for parent for focus on boxUI
        if (!this.props.editing) return;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
    };
    render() {
        const object = this.props.object;
        return (
            <BaseUI {...this.props}>
                <span contentEditable={this.props.editing} className={"editable" + (this.props.editing ? " editing" : "")} ref={this.refSpan} onMouseDown={this.handleMouseDown} onClick={this.handleClick} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onBlur={this.props.onEditEnd} suppressContentEditableWarning={true}>
                    {object.data.value}
                </span>
            </BaseUI>
        );
    }
}
export class comment extends UIObject<{ value: string }, {}, [], [], [string]> {
    static description = "Text Comment";
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        description: "Initial text"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 0;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (!this.data.hasOwnProperty("value")) this.data.value = args.join(" ");
        });
    }
    static ui: typeof BaseUI = CommentUI;
}
type CodeUIState = { language: string; value: string; editorLoaded: boolean; editing: boolean } & BaseUIState;
export class CodeUI extends BaseUI<AnyObject, {}, CodeUIState> {
    static sizing = "both" as const;
    static defaultSize: [number, number] = [400, 225];
    state: CodeUIState = { ...this.state, editing: false, value: this.box.data.value, language: "javascript", editorLoaded: false };
    codeEditor: editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    handleCodeEditorMount = (monaco: editor.IStandaloneCodeEditor) => {
        this.codeEditor = monaco;
        this.object.emit("editorLoaded");
        monaco.onDidBlurEditorText(() => this.object.emit("editorBlur", monaco.getValue()));
    };
    handleResize = () => (this.state.editorLoaded ? this.codeEditor.layout() : undefined);
    handleChange = (value: string, event: editor.IModelContentChangedEvent) => {
        this.setState({ value });
        this.object.data.value = value;
    };
    handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    handleKeyUp = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    async componentDidMount() {
        super.componentDidMount();
        const reactMonacoEditor = await import("react-monaco-editor");
        this.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
    }
    render() {
        return (
            <BaseUI {...this.props} containerProps={{ onKeyDown: this.handleKeyDown, onKeyUp: this.handleKeyUp }}>
                {
                    this.state.editorLoaded
                        ? <this.editorJSX value={this.state.value} language={this.state.language} theme="vs-dark" editorDidMount={this.handleCodeEditorMount} onChange={this.handleChange} options={{ fontSize: 12 }} width={this.state.width} height={this.state.height} />
                        : <Dimmer active><Loader content="Loading" /></Dimmer>
                }
            </BaseUI>
        );
    }
}
export class code extends UIObject<{ value: string }, {}, [Bang, string], [string], [string], {}, { language: string; value: string }, { editorBlur: string; editorLoaded: never }> {
    static description = "Code Editor";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "bang",
        description: "Trigger output the code"
    }, {
        isHot: false,
        type: "string",
        description: "Set the code"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "string",
        description: "Code"
    }];
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        default: "javascript",
        description: "language"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
            if (typeof this.box.data.value === "undefined") this.box.data.value = "";
        });
        this.on("editorLoaded", () => this.updateUI({ language: this.box.args[0] || "javascript" }));
        this.on("updateArgs", (args) => {
            if (args[0]) this.updateUI({ language: args[0] });
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data instanceof Bang) this.outlet(0, this.box.data.value);
            } else if (inlet === 1) {
                const value = typeof data === "string" ? data : `${data}`;
                this.updateUI({ value });
                this.box.data.value = value;
            }
        });
    }
    static ui: typeof BaseUI = CodeUI;
}
type MenuProps = Required<Pick<
    StrictDropdownProps,
    "clearable" | "closeOnBlur" | "closeOnChange" | "closeOnEscape" | "deburr"
    | "defaultOpen" | "defaultValue" | "direction" | "disabled" | "error" | "lazyLoad"
    | "minCharacters" | "multiple" | "noResultsMessage" | "options" | "placeholder"
    | "scrolling" | "search" | "selectOnBlur" | "selectOnNavigation" | "simple"
    | "tabIndex" | "text" | "upward" | "wrapSelection"
>>;
type MenuUIState = { value: StrictDropdownProps["value"] } & MenuProps;
class MenuUI extends BaseUI<menu, {}, MenuUIState> {
    state: MenuUIState & BaseUIState = {
        ...this.state,
        value: this.object.getProp("defaultValue")
    };
    handleChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const { value } = data;
        this.setState({ value });
        this.object.outlet(0, value);
    };
    handleQuery = (query: number | string | number[] | string[]) => {
        const { options } = this.state;
        let value;
        if (typeof query === "number") {
            if (options[query]) {
                value = options[query].value;
            }
        } else if (typeof query === "string") {
            const found = options.find(o => o.text === query);
            if (found) {
                value = found.value;
            }
        } else if (isNumberArray(query)) {
            value = query.filter(i => !!options[i]).map(i => options[i].value);
        } else {
            value = options.filter(o => query.indexOf(o.text as string) !== -1).map(o => o.value);
        }
        if (value) {
            this.setState({ value });
            this.object.outlet(0, value);
        }
    };
    componentDidMount() {
        super.componentDidMount();
        this.object.on("query", this.handleQuery);
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.object.off("query", this.handleQuery);
    }
    render() {
        const {
            clearable, closeOnBlur, closeOnChange, closeOnEscape, deburr,
            defaultOpen, defaultValue, direction, disabled, error, lazyLoad,
            minCharacters, multiple, noResultsMessage, options, placeholder,
            scrolling, search, selectOnBlur, selectOnNavigation, simple,
            tabIndex, text, upward, wrapSelection, value
        } = this.state;
        const dropdownProps = {
            clearable, closeOnBlur, closeOnChange, closeOnEscape, deburr,
            defaultOpen, defaultValue, direction, disabled, error, lazyLoad,
            minCharacters, multiple, noResultsMessage, options, placeholder,
            scrolling, search, selectOnBlur, selectOnNavigation, simple,
            tabIndex, text, upward, wrapSelection, value
        };
        return (
            <BaseUI {...this.props}>
                <Dropdown {...dropdownProps} selection fluid onChange={this.handleChange} />
            </BaseUI>
        );
    }
}
export class menu extends UIObject<{}, {}, [number | string | number[] | string[], StrictDropdownItemProps[]], [any], [], MenuProps, MenuUIState, { query: number | string | number[] | string[] }> {
    static description = "Dropdown Menu";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "number or display text or array to select item(s)"
    }, {
        isHot: false,
        type: "object",
        description: "Array of DropdownItemProps: { key, icon, text, value, ... }"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "anything",
        description: "Selected value"
    }];
    static args: TMeta["args"] = [{
        type: "anything",
        varLength: true,
        optional: true,
        default: undefined,
        description: "Initial value(s)"
    }];
    static props: TPropsMeta<MenuProps> = {
        clearable: {
            type: "boolean",
            default: false,
            description: "Using the clearable setting will let users remove their selection",
            isUIState: true
        },
        closeOnBlur: {
            type: "boolean",
            default: true,
            description: "Whether or not the menu should close when the dropdown is blurred",
            isUIState: true
        },
        closeOnChange: {
            type: "boolean",
            default: undefined,
            description: "Whether or not the menu should close when a value is selected",
            isUIState: true
        },
        closeOnEscape: {
            type: "boolean",
            default: true,
            description: "Whether or not the dropdown should close when the escape key is pressed",
            isUIState: true
        },
        deburr: {
            type: "boolean",
            default: false,
            description: "Whether or not the dropdown should strip diacritics in options and input search",
            isUIState: true
        },
        defaultOpen: {
            type: "boolean",
            default: false,
            description: "Initial value of open",
            isUIState: true
        },
        defaultValue: {
            type: "anything",
            default: undefined,
            description: "Initial value or value array if multiple",
            isUIState: true
        },
        direction: {
            type: "enum",
            enums: ["left", "right"],
            default: "left",
            description: "A dropdown menu can open to the left or to the right",
            isUIState: true
        },
        disabled: {
            type: "boolean",
            default: false,
            description: " A disabled dropdown menu or item does not allow user interaction",
            isUIState: true
        },
        error: {
            type: "boolean",
            default: false,
            description: "An errored dropdown can alert a user to a problem",
            isUIState: true
        },
        lazyLoad: {
            type: "boolean",
            default: false,
            description: "A dropdown can defer rendering its options until it is open",
            isUIState: true
        },
        minCharacters: {
            type: "number",
            default: 1,
            description: "The minimum characters for a search to begin showing results",
            isUIState: true
        },
        multiple: {
            type: "boolean",
            default: false,
            description: "A selection dropdown can allow multiple selections",
            isUIState: true
        },
        noResultsMessage: {
            type: "string",
            default: "No results found",
            description: "Message to display when there are no results",
            isUIState: true
        },
        options: {
            type: "anything",
            default: [],
            description: "Array of Dropdown.Item props",
            isUIState: true
        },
        placeholder: {
            type: "string",
            default: "",
            description: "Placeholder text",
            isUIState: true
        },
        scrolling: {
            type: "boolean",
            default: false,
            description: "A dropdown can have its menu scroll",
            isUIState: true
        },
        search: {
            type: "boolean",
            default: false,
            description: "A selection dropdown can allow a user to search through a large list of choices",
            isUIState: true
        },
        selectOnBlur: {
            type: "boolean",
            default: true,
            description: "Whether the highlighted item should be selected on blur",
            isUIState: true
        },
        selectOnNavigation: {
            type: "boolean",
            default: true,
            description: "Whether dropdown should select new option when using keyboard shortcuts.",
            isUIState: true
        },
        simple: {
            type: "boolean",
            default: false,
            description: "A dropdown menu can open to the left or to the right",
            isUIState: true
        },
        tabIndex: {
            type: "anything",
            default: undefined,
            description: "A dropdown can receive focus",
            isUIState: true
        },
        text: {
            type: "string",
            default: undefined,
            description: "The text displayed in the dropdown, usually for the active item",
            isUIState: true
        },
        upward: {
            type: "boolean",
            default: false,
            description: "Controls whether the dropdown will open upward",
            isUIState: true
        },
        wrapSelection: {
            type: "boolean",
            default: false,
            description: "Selection will wrap to end or start on press ArrowUp or ArrowDown",
            isUIState: true
        }
    };
    static ui = MenuUI;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this.emit("query", data as number | string | number[] | string[]);
            } else {
                const options = data as StrictDropdownItemProps[];
                this.update(undefined, { options });
            }
        });
    }
}
export class view extends UIObject<{}, {}, [string | Element], [], [string], {}, ShadowDOMUIState> {
    static description = "View HTML Element";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "HTML string or HTMLElement object to view"
    }];
    static args: TMeta["args"] = [{
        type: "string",
        optional: true,
        description: "initial innerHTML"
    }];
    static ui = ShadowDOMUI;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (typeof this.box.args[0] === "string") {
                const template = document.createElement("template");
                template.innerHTML = this.box.args[0];
                this.updateUI({ children: Array.from(template.children) });
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!(data instanceof Bang)) {
                    if (typeof data === "string") {
                        const template = document.createElement("template");
                        template.innerHTML = data;
                        this.updateUI({ children: Array.from(template.content.children) });
                    } else if (data instanceof Element) {
                        this.updateUI({ children: [data] });
                    }
                }
            }
        });
    }
}
export default { message, comment, code, menu, view };
