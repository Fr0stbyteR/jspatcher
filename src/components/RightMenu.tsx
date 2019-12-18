import * as React from "react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { Menu, Icon, MenuItemProps, Header, Loader, Dimmer, Table, Ref, Checkbox, Dropdown, DropdownProps, DropdownItemProps } from "semantic-ui-react";
import { ChromePicker, ColorResult } from "react-color";
import MonacoEditor from "react-monaco-editor";
import Patcher from "../core/Patcher";
import Box from "../core/Box";
import "./RightMenu.scss";
import { TPatcherLog, TMeta, TArgsMeta, TPropsMeta, TRect } from "../core/types";

enum TPanels {
    None = "None",
    Console = "Console",
    Inspector = "Inspector",
    Code = "Code"
}
class Console extends React.PureComponent<{ patcher: Patcher }, { cached: TPatcherLog[] }> {
    state = { cached: this.props.patcher.state.log.slice() };
    refTable = React.createRef<HTMLTableElement>();
    logDuringLoading: TPatcherLog[] = [];
    handleNewLog = (log: TPatcherLog) => {
        let bottom = true;
        let table: HTMLTableElement;
        if (this.refTable.current) {
            table = this.refTable.current;
            if (table.scrollTop + table.clientHeight !== table.scrollHeight) bottom = false;
        }
        const cached = this.state.cached;
        cached.push(log);
        this.setState({ cached }, () => (table && bottom ? table.scrollTop = table.scrollHeight : undefined));
    }
    handleClear = () => {
        this.setState({ cached: [] });
    }
    componentDidMount() {
        this.props.patcher.on("newLog", this.handleNewLog);
    }
    componentWillUnmount() {
        this.props.patcher.off("newLog", this.handleNewLog);
    }
    render() {
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
                    <Menu.Item onClick={this.handleClear}>
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
    }
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
    }
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
    handleClickColorSpan = () => this.setState({ showColorPicker: !this.state.showColorPicker });
    handleChangeColor = (e: ColorResult) => this.props.onChange(e.hex, this.props.itemKey);
    render() {
        return (
            <>
                <span className="inspector-value color" style={{ backgroundColor: this.props.value }} onClick={this.handleClickColorSpan}>
                    {
                        this.state.showColorPicker
                            ? <>
                                <div className="color-picker-fullscreen-cover" onClick={this.handleClickColorSpan} />
                                <ChromePicker color={this.props.value} onChange={this.handleChangeColor} />
                            </>
                            : <></>
                    }
                </span>
            </>
        );
    }
}
class InspectorEnumItem extends React.PureComponent<{ itemKey: number | string; value: string | number | boolean; onChange: (value: string | number | boolean, key: number | string) => any; options: DropdownItemProps[] }> {
    handleChangeDropdown = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => this.props.onChange(data.value as string | number | boolean, this.props.itemKey);
    render() {
        return <Dropdown className="inspector-value enum" size="mini" options={this.props.options} value={this.props.value} onChange={this.handleChangeDropdown} />;
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
    }
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
    args: TMeta["args"];
    props: TMeta["props"];
    rect: TRect;
    presentationRect: TRect;
};
class Inspector extends React.PureComponent<{ patcher: Patcher }, InspectorState> {
    state: InspectorState = { meta: null, args: [], props: {}, rect: null, presentationRect: null };
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
        const boxes = this.props.patcher.state.selected.filter(id => id.includes("box") && this.props.patcher.boxes[id]).map(id => this.props.patcher.boxes[id]);
        this.boxes = boxes;
        this.unSubscribeBox();
        this.subscribeBox();
        if (boxes.length === 0) {
            this.setState({ meta: null, args: [], props: {}, rect: null, presentationRect: null });
            return;
        }
        const { meta, args, props, rect, presentationRect } = boxes[0];
        if (boxes.length === 1) {
            this.setState({ meta, args, props, rect, presentationRect });
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
            const value = useDefault ? prop.default : props[key];
            for (let j = 1; j < boxes.length; j++) {
                let found = false;
                const $props = boxes[j].props;
                const $metaProps = boxes[j].meta.props;
                for (const $key in $metaProps) {
                    const $prop = $metaProps[$key];
                    const $value = typeof $props[$key] === "undefined" ? $prop.default : $props[$key];
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
        this.setState({ meta, args, props, rect: null, presentationRect: null });
    };
    componentDidMount() {
        this.handleSelected();
        this.props.patcher.on("selected", this.handleSelected);
        this.props.patcher.on("deselected", this.handleSelected);
    }
    componentWillUnmount() {
        this.unSubscribeBox(true);
        this.props.patcher.off("selected", this.handleSelected);
        this.props.patcher.off("deselected", this.handleSelected);
    }
    handleChange = (value: any, key: number | string) => {
        if (!this.box) return;
        if (typeof key === "number") {
            const state: any[] = [];
            if (this.box.meta.args[key].varLength && Array.isArray(value)) {
                value.forEach((v, i) => state[i + key] = v);
            } else {
                state[key] = value;
            }
            this.boxes.forEach(box => box.object.update(state));
        } else {
            const state: { [key: string]: any } = {};
            state[key] = value;
            this.boxes.forEach(box => box.object.update(undefined, state));
        }
        this.handleSelected();
    };
    render() {
        const { meta, args, props } = this.state;
        if (!meta) {
            return (
                <Menu icon inverted size="mini">
                </Menu>
            );
        }
        const table: JSX.Element[] = [];
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
    handleGraphChanged = () => {
        if (!this.props.patcher.state.isLoading && this.state.editorLoaded) this.setState({ value: this.code });
    };
    handleResize = () => (this.state.editorLoaded ? this.codeEditor.layout() : undefined);
    async componentDidMount() {
        const reactMonacoEditor = await import("react-monaco-editor");
        this.editorJSX = reactMonacoEditor.default;
        this.setState({ editorLoaded: true });
        this.props.patcher.on("loaded", this.handleGraphChanged);
        this.props.patcher.on("graphChanged", this.handleGraphChanged);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        this.props.patcher.off("loaded", this.handleGraphChanged);
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
export default class RightMenu extends React.PureComponent<{ patcher: Patcher }, { active: TPanels; codePanel: boolean; audioOn: boolean }> {
    state = { active: TPanels.None, codePanel: false, audioOn: false };
    refDivPane = React.createRef<HTMLDivElement>();
    refCode = React.createRef<CodeEditor>();
    refConsole = React.createRef<Console>();
    refInspector = React.createRef<Inspector>();
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
        const curWidth = this.refDivPane.current.getBoundingClientRect().width;
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
    }
    handleAudioSwitch = () => {
        const audioCtx = this.props.patcher.env.audioCtx;
        if (this.state.audioOn) audioCtx.suspend();
        else audioCtx.resume();
    }
    handleAudioCtxStateChange = () => {
        const audioCtx = this.props.patcher.env.audioCtx;
        const { state } = audioCtx;
        this.setState({ audioOn: state === "running" });
    }
    handlePatcherLoaded = () => {
        const codePanel = this.props.patcher.props.mode === "faust" || this.props.patcher.props.mode === "gen";
        this.setState({ active: TPanels.None, codePanel });
    }
    componentDidMount() {
        const audioCtx = this.props.patcher.env.audioCtx;
        audioCtx.addEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.on("loaded", this.handlePatcherLoaded);
    }
    componentWillUnmount() {
        const audioCtx = this.props.patcher.env.audioCtx;
        audioCtx.removeEventListener("statechange", this.handleAudioCtxStateChange);
        this.props.patcher.off("loaded", this.handlePatcherLoaded);
    }
    render() {
        return (
            <>
                <Menu icon vertical inverted size="mini" fixed={"left"} id="right-menu">
                    <Menu.Item name={TPanels.Console} active={this.state.active === TPanels.Console} onClick={this.handleItemClick}>
                        <Icon name="bars" color={this.state.active === TPanels.Console ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Inspector} active={this.state.active === TPanels.Inspector} onClick={this.handleItemClick}>
                        <Icon name="info" color={this.state.active === TPanels.Inspector ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <Menu.Item name={TPanels.Code} hidden={!this.state.codePanel} active={this.state.active === TPanels.Code} onClick={this.handleItemClick}>
                        <Icon name="code" color={this.state.active === TPanels.Code ? "teal" : "grey"} inverted />
                    </Menu.Item>
                    <div style={{ flex: "1 1 auto" }}></div>
                    <Menu.Item name="Audio Switch" active={false} onClick={this.handleAudioSwitch}>
                        <Icon name={this.state.audioOn ? "volume up" : "volume off"} color={this.state.audioOn ? "teal" : "grey"} inverted />
                    </Menu.Item>
                </Menu>
                <div id="right-pane" hidden={this.state.active === TPanels.None} ref={this.refDivPane}>
                    <Header as="h5" inverted color="grey" content={this.state.active} />
                    <div id="right-pane-code-editor" hidden={this.state.active !== TPanels.Code}>
                        {this.state.active === TPanels.Code ? <CodeEditor { ...this.props } ref={this.refCode} /> : <></> }
                    </div>
                    <div id="right-pane-inspector" hidden={this.state.active !== TPanels.Inspector}>
                        {this.state.active === TPanels.Inspector ? <Inspector { ...this.props } ref={this.refInspector} /> : <></> }
                    </div>
                    <div id="right-pane-console" hidden={this.state.active !== TPanels.Console}>
                        <Console { ...this.props } ref={this.refConsole} />
                    </div>
                </div>
                <div className="resize-handler resize-handler-w" onMouseDown={this.handleResizeMouseDown} hidden={this.state.active === TPanels.None}></div>
            </>
        );
    }
}
