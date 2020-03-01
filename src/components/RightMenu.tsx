import * as React from "react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { Menu, Icon, MenuItemProps, Header, Loader, Dimmer, Table, Ref, Checkbox, Dropdown, DropdownProps, DropdownItemProps } from "semantic-ui-react";
import { ChromePicker, ColorResult } from "react-color";
import MonacoEditor from "react-monaco-editor";
import Patcher from "../core/Patcher";
import Box from "../core/Box";
import { TPatcherLog, TMeta, TArgsMeta, TPropsMeta, TRect, TPatcherProps, TPublicPatcherProps } from "../core/types";
import "./RightMenu.scss";
import { BaseUI } from "../core/objects/BaseUI";

enum TPanels {
    None = "None",
    Console = "Console",
    Inspector = "Inspector",
    Code = "Code",
    Dock = "Dock"
}
class Console extends React.PureComponent<{ patcher: Patcher; display: boolean }, { cached: TPatcherLog[] }> {
    state = { cached: this.props.patcher.state.log.slice() };
    refTable = React.createRef<HTMLTableElement>();
    logDuringLoading: TPatcherLog[] = [];
    handleNewLog = (log: TPatcherLog) => {
        const cached = this.state.cached.slice();
        cached.push(log);
        this.setState({ cached }, this.scrollToEnd);
    };
    handleClear = () => this.setState({ cached: [] });
    scrollToEnd = () => {
        if (!this.refTable.current) return;
        let bottom = true;
        const table = this.refTable.current;
        if (table.scrollTop + table.clientHeight !== table.scrollHeight) bottom = false;
        if (bottom) table.scrollTop = table.scrollHeight;
    };
    componentDidUpdate(prevProps: Readonly<{ patcher: Patcher; display: boolean }>) {
        if (this.props.display && this.props.display !== prevProps.display) this.scrollToEnd();
    }
    componentDidMount() {
        this.props.patcher.on("newLog", this.handleNewLog);
    }
    componentWillUnmount() {
        this.props.patcher.off("newLog", this.handleNewLog);
    }
    render() {
        if (!this.props.display) return <></>;
        const logs = this.state.cached.map((log, i) => (
            <Table.Row key={i} negative={log.errorLevel === "error"} warning={log.errorLevel === "warn"} positive={log.errorLevel === "info"}>
                <Table.Cell width={4}>{log.title}</Table.Cell>
                <Table.Cell width={12}>{log.message}</Table.Cell>
            </Table.Row>
        ));
        return (
            <>
                <Ref innerRef={this.refTable}>
                    <Table inverted celled striped selectable unstackable size="small" compact="very">
                        <Table.Body>
                            {logs}
                        </Table.Body>
                    </Table>
                </Ref>
                <Menu icon inverted size="mini">
                    <Menu.Item onClick={this.handleClear} title="Clear">
                        <Icon name="delete" inverted />
                    </Menu.Item>
                </Menu>
            </>
        );
    }
}
class InspectorBooleanItem extends React.PureComponent<{ itemKey: number | string; value: boolean; onChange: (value: boolean, key: number | string) => any }> {
    handleChangeCheckbox = () => this.props.onChange(!this.props.value, this.props.itemKey);
    render() {
        return <Checkbox className="inspector-value boolean" fitted checked={this.props.value} onChange={this.handleChangeCheckbox} />;
    }
}
class InspectorNumberItem extends React.PureComponent<{ itemKey: number | string; value: number; onChange: (value: number, key: number | string) => any }, { inputEditing: boolean }> {
    state = { inputEditing: false };
    refInput = React.createRef<HTMLInputElement>();
    handleClickInput = () => this.setState({ inputEditing: true }, () => (this.refInput.current ? this.refInput.current.focus() : undefined));
    handleNumberInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.props.onChange(+e.currentTarget.value, this.props.itemKey);
        this.setState({ inputEditing: false });
    };
    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => (e.key === "Enter" ? e.currentTarget.blur() : undefined);
    componentWillUnmount() {
        if (this.state.inputEditing && this.refInput.current) this.props.onChange(+this.refInput.current.value, this.props.itemKey);
    }
    render() {
        return this.state.inputEditing
            ? <input ref={this.refInput} type="number" className="inspector-input" defaultValue={this.props.value} onBlur={this.handleNumberInputBlur} onKeyDown={this.handleInputKeyDown} />
            : <span className="inspector-value number" onClick={this.handleClickInput}>{this.props.value}</span>;
    }
}
class InspectorStringItem extends React.PureComponent<{ itemKey: number | string; value: string; onChange: (value: string, key: number | string) => any }, { inputEditing: boolean }> {
    state = { inputEditing: false };
    refInput = React.createRef<HTMLInputElement>();
    handleClickInput = () => this.setState({ inputEditing: true }, () => (this.refInput.current ? this.refInput.current.focus() : undefined));
    handleStringInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.props.onChange(e.currentTarget.value, this.props.itemKey);
        this.setState({ inputEditing: false });
    };
    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => (e.key === "Enter" ? e.currentTarget.blur() : undefined);
    componentWillUnmount() {
        if (this.state.inputEditing && this.refInput.current) this.props.onChange(this.refInput.current.value, this.props.itemKey);
    }
    render() {
        return this.state.inputEditing
            ? <input ref={this.refInput} className="inspector-input" defaultValue={this.props.value} onBlur={this.handleStringInputBlur} onKeyDown={this.handleInputKeyDown} />
            : <span className="inspector-value string" onClick={this.handleClickInput}>{this.props.value}</span>;
    }
}
class InspectorColorItem extends React.PureComponent<{ itemKey: number | string; value: string; onChange: (value: string, key: number | string) => any }, { showColorPicker: boolean }> {
    state = { showColorPicker: false };
    handleClickColorSpan = () => this.setState({ showColorPicker: true });
    handleClickCover = (e: React.MouseEvent) => {
        this.setState({ showColorPicker: false });
        e.stopPropagation();
    };
    handleChangeColor = (e: ColorResult) => this.props.onChange(e.hex, this.props.itemKey);
    render() {
        return (
            <>
                <span className="inspector-value color" style={{ backgroundColor: this.props.value }} onClick={this.handleClickColorSpan}>
                    {
                        this.state.showColorPicker
                            ? <>
                                <div className="color-picker-fullscreen-cover" onClick={this.handleClickCover} />
                                <ChromePicker color={this.props.value} onChange={this.handleChangeColor} />
                            </>
                            : <></>
                    }
                </span>
            </>
        );
    }
}
class InspectorEnumItem extends React.PureComponent<{ itemKey: number | string; value: DropdownProps["value"]; onChange: (value: DropdownProps["value"], key: number | string) => any; options: DropdownItemProps[]; multiple?: boolean }> {
    handleChangeDropdown = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => this.props.onChange(data.value, this.props.itemKey);
    render() {
        return <Dropdown className="inspector-value enum" size="mini" options={this.props.options} value={this.props.value} onChange={this.handleChangeDropdown} multiple={this.props.multiple} />;
    }
}
class InspectorObjectItem extends React.PureComponent<{ itemKey: number | string; value: any; onChange: (value: any, key: number | string) => any }, { inputEditing: boolean }> {
    state = { inputEditing: false };
    refInput = React.createRef<HTMLInputElement>();
    handleClickInput = () => this.setState({ inputEditing: true }, () => (this.refInput.current ? this.refInput.current.focus() : undefined));
    handleObjectInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value;
        try {
            value = JSON.parse(value);
        } catch (e) {} // eslint-disable-line no-empty
        this.props.onChange(value, this.props.itemKey);
        this.setState({ inputEditing: false });
    };
    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => (e.key === "Enter" ? e.currentTarget.blur() : undefined);
    componentWillUnmount() {
        if (this.state.inputEditing && this.refInput.current) {
            let value = this.refInput.current.value;
            try {
                value = JSON.parse(value);
            } catch (e) {} // eslint-disable-line no-empty
            this.props.onChange(value, this.props.itemKey);
        }
    }
    render() {
        const value = this.props.value;
        return this.state.inputEditing
            ? <input ref={this.refInput} className="inspector-input" defaultValue={typeof value === "string" ? value : JSON.stringify(value)} onBlur={this.handleObjectInputBlur} onKeyDown={this.handleInputKeyDown} />
            : <span className="inspector-value object" onClick={this.handleClickInput}>{typeof value === "string" ? `"${value}"` : JSON.stringify(value)}</span>;
    }
}
class InpectorAnythingItem extends InspectorObjectItem {}
type InspectorItemProps<MetaType extends "arg" | "prop"> = {
    patcher: Patcher;
    meta: MetaType extends "arg" ? TArgsMeta[number] : TPropsMeta[number];
    value: any;
    itemKey: MetaType extends "arg" ? number : string;
    onChange: (value: any, key: MetaType extends "arg" ? number : string) => any;
};
class InspectorItem<MetaType extends "arg" | "prop"> extends React.PureComponent<InspectorItemProps<MetaType>, { showColorPicker: boolean; inputEditing: boolean }> {
    state = { showColorPicker: false, inputEditing: false };
    refInput = React.createRef<HTMLInputElement>();
    key: MetaType extends "arg" ? number : string;
    metaItem(meta: MetaType extends "arg" ? TArgsMeta[number] : TPropsMeta[number], value: any) {
        const { type } = meta;
        const itemProps = { itemKey: this.key, value, onChange: this.props.onChange };
        if ((meta as TArgsMeta[number]).varLength) {
            if (type === "enum") return <InspectorEnumItem {...itemProps} multiple options={meta.enums.map((text, i) => ({ text, key: i, value: text }))} />;
            return <InpectorAnythingItem {...itemProps} />;
        }
        if (type === "boolean") return <InspectorBooleanItem {...itemProps} />;
        if (type === "number") return <InspectorNumberItem {...itemProps} />;
        if (type === "string") return <InspectorStringItem {...itemProps} />;
        if (type === "color") return <InspectorColorItem {...itemProps} />;
        if (type === "enum") return <InspectorEnumItem {...itemProps} options={meta.enums.map((text, i) => ({ text, key: i, value: text }))} />;
        if (type === "object") return <InspectorObjectItem {...itemProps} />;
        if (type === "anything") return <InpectorAnythingItem {...itemProps} />;
        return <></>;
    }
    render() {
        return <></>;
    }
}
class InspectorArgItem extends InspectorItem<"arg"> {
    key = this.props.itemKey;
    render() {
        const { type, optional, varLength, description } = this.props.meta;
        const title = `${description.length ? `${description}: ` : ""}${type}`;
        return (
            <Table.Row>
                <Table.Cell width={4} title={title}>
                    {varLength ? "..." : ""}arg{this.props.itemKey}{optional ? "?" : ""}
                </Table.Cell>
                <Table.Cell className="inspector-value-cell" width={12}>{this.metaItem(this.props.meta, this.props.value)}</Table.Cell>
            </Table.Row>
        );
    }
}
class InspectorPropItem extends InspectorItem<"prop"> {
    key = this.props.itemKey;
    render() {
        const { type, description } = this.props.meta;
        const title = `${description.length ? `${description}: ` : ""}${type}`;
        return (
            <Table.Row>
                <Table.Cell width={6} title={title}>{this.props.itemKey}</Table.Cell>
                <Table.Cell width={10} className="inspector-value-cell">{this.metaItem(this.props.meta, this.props.value)}</Table.Cell>
            </Table.Row>
        );
    }
}
type InspectorState = {
    meta: TMeta;
    args: any[];
    props: { [key: string]: any };
    patcherProps: TPublicPatcherProps;
    rect: TRect;
    presentationRect: TRect;
};
class Inspector extends React.PureComponent<{ patcher: Patcher }, InspectorState> {
    state: InspectorState = { meta: null, args: [], props: {}, rect: null, presentationRect: null, patcherProps: this.props.patcher.publicProps };
    boxes: Box[];
    box: Box;
    handleBoxUpdate = (e: { args?: any[]; props?: { [key: string]: any } }) => this.setState({ args: e.args || [], props: e.props || {} });
    handleBoxRectChanged = (box: Box) => this.setState({ rect: box.rect.slice() as TRect });
    handleBoxPresentationRectChanged = (box: Box) => this.setState({ presentationRect: box.presentationRect.slice() as TRect });
    unSubscribeBox = (force?: boolean) => {
        if (this.box && (force || this.boxes.indexOf(this.box) === -1)) {
            this.box.off("updatedFromObject", this.handleBoxUpdate);
            this.box.off("rectChanged", this.handleBoxRectChanged);
            this.box.off("presentationRectChanged", this.handleBoxPresentationRectChanged);
            this.box.off("textChanged", this.handleSelected);
            this.box = null;
        }
    };
    subscribeBox = () => {
        if (!this.box && this.boxes.length) {
            this.box = this.boxes[0];
            this.box.on("updatedFromObject", this.handleBoxUpdate);
            this.box.on("rectChanged", this.handleBoxRectChanged);
            this.box.on("presentationRectChanged", this.handleBoxPresentationRectChanged);
            this.box.on("textChanged", this.handleSelected);
        }
    };
    handleSelected = () => {
        const boxes = this.props.patcher.state.selected.filter(id => id.startsWith("box") && this.props.patcher.boxes[id]).map(id => this.props.patcher.boxes[id]);
        this.boxes = boxes;
        this.unSubscribeBox();
        this.subscribeBox();
        if (boxes.length === 0) {
            this.setState({ meta: null, args: [], props: {}, rect: null, presentationRect: null });
            return;
        }
        const { meta, args, props, rect, presentationRect, presentation, background } = boxes[0];
        if (boxes.length === 1) {
            this.setState({ meta, args: args.slice(), props: { ...props, presentation, background }, rect, presentationRect });
            return;
        }
        const commonProps = { ...meta.props };
        for (const key in commonProps) {
            const prop = commonProps[key];
            if (key === "rect" || key === "presentationRect") {
                delete commonProps[key];
                continue;
            }
            const useDefault = !(key in props);
            const value = key === "presentation" ? presentation
                : key === "background" ? background
                    : useDefault ? prop.default : props[key];
            for (let j = 1; j < boxes.length; j++) {
                let found = false;
                const $box = boxes[j];
                const $props = $box.props;
                const $metaProps = $box.meta.props;
                const $presentation = $box.presentation;
                const $background = $box.background;
                for (const $key in $metaProps) {
                    const $prop = $metaProps[$key];
                    const $useDefault = !($key in $props);
                    const $value = $key === "presentation" ? $presentation
                        : $key === "background" ? $background
                            : $useDefault ? $prop.default : $props[$key];
                    if (key === $key && value === $value) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    delete commonProps[key];
                    break;
                }
            }
        }
        meta.props = commonProps;
        const commonArgs = meta.args.slice();
        for (let i = commonArgs.length - 1; i >= 0; i--) {
            const arg = commonArgs[i];
            const useDefault = !(i in arg);
            const value = useDefault ? arg.default : args[i];
            const varLength = !!arg.varLength;
            for (let j = 1; j < boxes.length; j++) {
                let found = false;
                const $args = boxes[j].args;
                const $metaArgs = boxes[j].meta.args;
                for (let k = 0; k < $metaArgs.length; k++) {
                    const $arg = $metaArgs[k];
                    const $value = typeof $args[k] === "undefined" ? $arg.default : $args[k];
                    const $varLength = !!$arg.varLength;
                    if (k === i && value === $value && varLength === $varLength) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    commonArgs.splice(i, 1);
                    break;
                }
            }
        }
        meta.args = commonArgs;
        const additionalProps: { [key: string]: any } = {};
        if ("presentation" in commonProps) additionalProps.presentation = presentation;
        if ("background" in commonProps) additionalProps.background = background;
        this.setState({ meta, args, props: { ...props, ...additionalProps }, rect: null, presentationRect: null });
    };
    handlePatcherPropsChanged = () => this.setState({ patcherProps: this.props.patcher.publicProps });
    componentDidMount() {
        this.handleSelected();
        this.props.patcher.on("selected", this.handleSelected);
        this.props.patcher.on("deselected", this.handleSelected);
        this.props.patcher.on("propsChanged", this.handlePatcherPropsChanged);
    }
    componentWillUnmount() {
        this.unSubscribeBox(true);
        this.props.patcher.off("selected", this.handleSelected);
        this.props.patcher.off("deselected", this.handleSelected);
        this.props.patcher.off("propsChanged", this.handlePatcherPropsChanged);
    }
    handleChange = (value: any, key: number | string) => {
        if (!this.box) return;
        if (typeof key === "number") {
            const state = this.box.args.slice();
            if (this.box.meta.args[key].varLength && Array.isArray(value)) {
                state.splice(key);
                state.push(...value);
            } else {
                state[key] = value;
            }
            this.boxes.forEach(box => box.object.update(state));
        } else if (key === "rect") {
            this.boxes.forEach(box => box.setRect(value));
        } else {
            this.boxes.forEach(box => box.object.update(undefined, { [key]: value }));
        }
        this.handleSelected();
    };
    handlePatcherChange = (value: any, key: keyof TPatcherProps) => this.props.patcher.setProps({ [key]: value });
    render() {
        const { meta, args, props } = this.state;
        const table: JSX.Element[] = [];
        if (!meta) { // Patcher Inspector
            table.push(
                <Table.Row key={"__division_patcher_props"} active>
                    <Table.Cell colSpan={2} width={16} className="division-name">Patcher</Table.Cell>
                </Table.Row>
            );
            Object.keys(Patcher.props).forEach((nameIn) => {
                const name = nameIn as keyof typeof Patcher["props"];
                const propMeta = Patcher.props[name];
                const value = this.state.patcherProps[name];
                const item = <InspectorPropItem {...this.props} key={name} itemKey={name} meta={propMeta} value={value} onChange={this.handlePatcherChange} />;
                table.push(item);
            });
        } else {
            table.push(
                <Table.Row key={"__division_args"} active>
                    <Table.Cell colSpan={2} width={16} className="division-name">Arguments</Table.Cell>
                </Table.Row>
            );
            meta.args.forEach((argMeta, i) => {
                if (!argMeta) return;
                const { default: defaultValue, varLength } = argMeta;
                const value = varLength ? args.slice(i) : typeof args[i] === "undefined" ? defaultValue : args[i];
                table.push(
                    <InspectorArgItem {...this.props} key={i} itemKey={i} meta={argMeta} value={value} onChange={this.handleChange} />
                );
            });
            table.push(
                <Table.Row key={"__division_props"} active>
                    <Table.Cell colSpan={2} width={16} className="division-name">Properties</Table.Cell>
                </Table.Row>
            );
            let lastGroup: string;
            Object.keys(meta.props).forEach((name) => {
                const propMeta = meta.props[name];
                const { default: defaultValue, group } = propMeta;
                const value = name === "rect" ? this.state.rect
                    : name === "presentationRect" ? this.state.presentationRect
                        : typeof props[name] === "undefined" ? defaultValue : props[name];
                const item = <InspectorPropItem {...this.props} key={name} itemKey={name} meta={propMeta} value={value} onChange={this.handleChange} />;
                if (group !== lastGroup) {
                    lastGroup = group;
                    table.push(
                        <Table.Row key={"__division_" + group} active>
                            <Table.Cell colSpan={2} width={16} className="group-name">{group}</Table.Cell>
                        </Table.Row>
                    );
                }
                table.push(item);
            });
        }
        return (
            <>
                <Table className="last-table" inverted celled striped selectable unstackable size="small" compact="very">
                    <Table.Body>
                        {table}
                    </Table.Body>
                </Table>
                <Menu icon inverted size="mini">
                </Menu>
            </>
        );
    }
}
class CodeEditor extends React.PureComponent<{ patcher: Patcher }, { value: string; editorLoaded: boolean }> {
    state = { value: this.code, editorLoaded: false };
    codeEditor: editor.IStandaloneCodeEditor;
    editorJSX: typeof MonacoEditor;
    handleCodeEditorMount = (monaco: editor.IStandaloneCodeEditor) => this.codeEditor = monaco;
    handleGraphChanged = (e?: string[]) => {
        if (!e && !this.props.patcher.state.isLoading && this.state.editorLoaded) this.setState({ value: this.code });
    };
    handleResize = () => (this.state.editorLoaded ? this.codeEditor.layout() : undefined);
    async componentDidMount() {
        const reactMonacoEditor = await import("react-monaco-editor");
        this.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
        this.props.patcher.on("loading", this.handleGraphChanged);
        this.props.patcher.on("graphChanged", this.handleGraphChanged);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        this.props.patcher.off("loading", this.handleGraphChanged);
        this.props.patcher.off("graphChanged", this.handleGraphChanged);
        window.removeEventListener("resize", this.handleResize);
    }
    render() {
        return this.state.editorLoaded
            ? <this.editorJSX value={this.state.value} language="faust" theme="vs-dark" editorDidMount={this.handleCodeEditorMount} options={{ fontSize: 12 }} />
            : <Dimmer active><Loader content="Loading" /></Dimmer>;
    }
    get code() {
        return this.props.patcher.props.mode === "faust" ? this.props.patcher.toFaustDspCode() : "";
    }
}
class UIDock extends React.PureComponent<{ patcher: Patcher; display: boolean }, { box: Box }> {
    state = { box: undefined as Box };
    refDiv = React.createRef<HTMLDivElement>();
    refUI = React.createRef<BaseUI>();
    handleDestroy = () => this.setState({ box: undefined });
    handleDock = (box: Box) => {
        if (this.state.box) this.state.box.object.off("destroy", this.handleDestroy);
        box.object.on("destroy", this.handleDestroy);
        this.setState({ box });
    };
    handlePatcherLoading = () => {
        if (this.state.box) {
            this.state.box.object.off("destroy", this.handleDestroy);
            this.setState({ box: undefined });
        }
    };
    handleResize = () => {
        if (this.refDiv.current && this.refUI.current) {
            const { width, height } = this.refDiv.current.getBoundingClientRect();
            this.refUI.current.setState({ width, height });
        }
    };
    handleClear = () => {
        if (this.state.box) {
            this.state.box.object.off("destroy", this.handleDestroy);
            this.setState({ box: undefined });
        }
    };
    componentDidMount() {
        this.props.patcher.on("loading", this.handlePatcherLoading);
        this.props.patcher.on("dockUI", this.handleDock);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        if (this.state.box) this.state.box.object.off("destroy", this.handleDestroy);
        this.props.patcher.off("loading", this.handlePatcherLoading);
        this.props.patcher.off("dockUI", this.handleDock);
        window.removeEventListener("resize", this.handleResize);
    }
    render() {
        if (!this.props.display) return <></>;
        const { box } = this.state;
        const ctrlKey = this.props.patcher.env.os === "MacOS" ? "Cmd" : "Ctrl";
        return (
            <>
                <div className="dock-ui" ref={this.refDiv}>
                    {
                        box
                            ? <box.uiComponent object={box.object} editing={false} onEditEnd={() => undefined} inDock ref={this.refUI} />
                            : <div className="dock-ui-default">{ctrlKey} + Enter on selected box to dock UI</div>
                    }
                </div>
                <Menu icon inverted size="mini">
                    <Menu.Item onClick={this.handleClear} title="Clear">
                        <Icon name="delete" inverted />
                    </Menu.Item>
                </Menu>
            </>
        );
    }
}
export default class RightMenu extends React.PureComponent<{ patcher: Patcher }, { active: TPanels; codePanel: boolean; audioOn: boolean }> {
    state = { active: TPanels.None, codePanel: false, audioOn: this.props.patcher.env.audioCtx.state === "running" };
    refDivPane = React.createRef<HTMLDivElement>();
    refCode = React.createRef<CodeEditor>();
    refConsole = React.createRef<Console>();
    refInspector = React.createRef<Inspector>();
    refDock = React.createRef<UIDock>();
    handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        if (this.state.active === data.name) {
            this.setState({ active: TPanels.None });
        } else {
            this.setState({ active: data.name as TPanels }, () => {
                if (data.name === TPanels.Code && this.refCode.current && this.refCode.current.codeEditor) {
                    this.refCode.current.codeEditor.layout();
                }
            });
        }
    };
    handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const origin = { x: e.pageX, y: e.pageY };
        const rect = this.refDivPane.current.getBoundingClientRect();
        const { width: curWidth } = rect;
        const panel = this.state.active;
        const handleMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.refDivPane.current && e.movementX) {
                const width = curWidth - (e.pageX - origin.x);
                if (width < 100) {
                    this.setState({ active: TPanels.None });
                } else {
                    if (this.state.active === TPanels.None) this.setState({ active: panel });
                    this.refDivPane.current.style.width = width + "px";
                    if (this.state.active === TPanels.Code && this.refCode.current && this.refCode.current.codeEditor) {
                        this.refCode.current.codeEditor.layout();
                    }
                    if (this.state.active === TPanels.Dock && this.refDock.current) {
                        this.refDock.current.handleResize();
                    }
                }
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };
    handleAudioSwitch = () => {
        const audioCtx = this.props.patcher.env.audioCtx;
        if (this.state.audioOn) audioCtx.suspend();
        else audioCtx.resume();
    };
    handleAudioCtxStateChange = () => {
        const audioCtx = this.props.patcher.env.audioCtx;
        const { state } = audioCtx;
        this.setState({ audioOn: state === "running" });
    };
    handlePatcherLoading = (loading?: string[]) => {
        if (loading) return;
        const codePanel = this.props.patcher.props.mode === "faust" || this.props.patcher.props.mode === "gen";
        this.setState({ active: TPanels.None, codePanel });
    };
    handleDock = () => this.setState({ active: TPanels.Dock });
    componentDidMount() {
        const audioCtx = this.props.patcher.env.audioCtx;
        audioCtx.addEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.on("loading", this.handlePatcherLoading);
        this.props.patcher.on("dockUI", this.handleDock);
        this.handlePatcherLoading();
    }
    componentWillUnmount() {
        const audioCtx = this.props.patcher.env.audioCtx;
        audioCtx.removeEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.off("loading", this.handlePatcherLoading);
        this.props.patcher.off("dockUI", this.handleDock);
    }
    render() {
        return (
            <>
                <Menu icon vertical inverted size="mini" className="right-menu">
                    <Menu.Item name={TPanels.Console} active={this.state.active === TPanels.Console} onClick={this.handleItemClick} title={TPanels.Console}>
                        <Icon name="bars" color={this.state.active === TPanels.Console ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Inspector} active={this.state.active === TPanels.Inspector} onClick={this.handleItemClick} title={TPanels.Inspector}>
                        <Icon name="info" color={this.state.active === TPanels.Inspector ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Code} hidden={!this.state.codePanel} active={this.state.active === TPanels.Code} onClick={this.handleItemClick} title={TPanels.Code}>
                        <Icon name="code" color={this.state.active === TPanels.Code ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Dock} hidden={this.state.codePanel} active={this.state.active === TPanels.Dock} onClick={this.handleItemClick} title={TPanels.Dock}>
                        <Icon name="edit" color={this.state.active === TPanels.Dock ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <div style={{ flex: "1 1 auto" }}></div>
                    <Menu.Item name="Audio Switch" active={false} onClick={this.handleAudioSwitch} title="Audio Switch">
                        <Icon name={this.state.audioOn ? "volume up" : "volume off"} color={this.state.audioOn ? "teal" : "grey"} inverted />
                    </Menu.Item>
                </Menu>
                <div className="right-pane" hidden={this.state.active === TPanels.None} ref={this.refDivPane}>
                    <Header as="h5" inverted color="grey" content={this.state.active} />
                    <div className="right-pane-code-editor" hidden={this.state.active !== TPanels.Code}>
                        {this.state.active === TPanels.Code ? <CodeEditor { ...this.props } ref={this.refCode} /> : <></> }
                    </div>
                    <div className="right-pane-inspector" hidden={this.state.active !== TPanels.Inspector}>
                        {this.state.active === TPanels.Inspector ? <Inspector { ...this.props } ref={this.refInspector} /> : <></> }
                    </div>
                    <div className="right-pane-console" hidden={this.state.active !== TPanels.Console}>
                        <Console { ...this.props } ref={this.refConsole} display={this.state.active === TPanels.Console} />
                    </div>
                    <div className="right-pane-dock" hidden={this.state.active !== TPanels.Dock}>
                        <UIDock { ...this.props } ref={this.refDock} display={this.state.active === TPanels.Dock} />
                    </div>
                </div>
                <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeMouseDown} hidden={this.state.active === TPanels.None}></div>
            </>
        );
    }
}
