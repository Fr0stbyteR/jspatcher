import * as React from "react";
import { ColorResult, ChromePicker } from "react-color";
import { Checkbox, DropdownProps, DropdownItemProps, Dropdown, Table, Menu, Label } from "semantic-ui-react";
import type Box from "../../core/patcher/Box";
import type PatcherEditor from "../../core/patcher/PatcherEditor";
import type Patcher from "../../core/patcher/Patcher";
import type { TPatcherProps, TPublicPatcherProps } from "../../core/patcher/Patcher";
import type { IArgsMeta, IJSPatcherObjectMeta, IPropsMeta } from "../../core/objects/base/AbstractObject";
import type { TRect, TPresentationRect } from "../../core/types";

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
    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") e.currentTarget.blur();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
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
    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") e.currentTarget.blur();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    componentWillUnmount() {
        if (this.state.inputEditing && this.refInput.current) this.props.onChange(this.refInput.current.value, this.props.itemKey);
    }
    render() {
        return this.state.inputEditing
            ? <input ref={this.refInput} className="inspector-input" defaultValue={this.props.value} onBlur={this.handleStringInputBlur} onKeyDown={this.handleInputKeyDown} />
            : <span className="inspector-value string" onClick={this.handleClickInput}>{this.props.value}</span>;
    }
}
interface InspectorColorProps {
    itemKey: number | string;
    value: string;
    onChange: (value: string, key: number | string) => any;
}
interface InspectorColorState {
    showColorPicker: boolean;
    color: string;
}
class InspectorColorItem extends React.PureComponent<InspectorColorProps, InspectorColorState> {
    state = { showColorPicker: false, color: this.props.value };
    handleClickColorSpan = () => this.setState({ showColorPicker: true });
    handleClickCover = (e: React.MouseEvent) => {
        this.setState({ showColorPicker: false });
        e.stopPropagation();
    };
    handleChangeColor = (e: ColorResult) => {
        const colorResult = e.rgb;
        const color = `rgba(${colorResult.r}, ${colorResult.g}, ${colorResult.b}, ${colorResult.a})`;
        this.setState({ color });
    };
    handleChangeCompleteColor = (e: ColorResult) => {
        this.props.onChange(this.state.color, this.props.itemKey);
    };
    handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    componentDidUpdate(prevProps: Readonly<InspectorColorProps>) {
        if (prevProps.value !== this.props.value) {
            this.setState({ color: this.props.value });
        }
    }
    render() {
        return (
            <>
                <span className="inspector-value color" style={{ backgroundColor: this.props.value }} onClick={this.handleClickColorSpan} onKeyDown={this.handleKeyDown}>
                    {
                        this.state.showColorPicker
                            ? <>
                                <div className="color-picker-fullscreen-cover" onClick={this.handleClickCover} />
                                <ChromePicker color={this.state.color} disableAlpha={false} onChange={this.handleChangeColor} onChangeComplete={this.handleChangeCompleteColor} />
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
    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") e.currentTarget.blur();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
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
    meta: MetaType extends "arg" ? IArgsMeta[number] : IPropsMeta[number];
    value: any;
    itemKey: MetaType extends "arg" ? number : string;
    onChange: (value: any, key: MetaType extends "arg" ? number : string) => any;
};
class InspectorItem<MetaType extends "arg" | "prop"> extends React.PureComponent<InspectorItemProps<MetaType>, { showColorPicker: boolean; inputEditing: boolean }> {
    state = { showColorPicker: false, inputEditing: false };
    refInput = React.createRef<HTMLInputElement>();
    key: MetaType extends "arg" ? number : string;
    metaItem(meta: MetaType extends "arg" ? IArgsMeta[number] : IPropsMeta[number], value: any) {
        const { type } = meta;
        const itemProps = { itemKey: this.key, value, onChange: this.props.onChange };
        if ((meta as IArgsMeta[number]).varLength) {
            if (type === "enum") return <InspectorEnumItem {...itemProps} multiple options={(meta.enums as any[]).map((text, i) => ({ text, key: i, value: text }))} />;
            return <InpectorAnythingItem {...itemProps} />;
        }
        if (type === "boolean") return <InspectorBooleanItem {...itemProps} />;
        if (type === "number") return <InspectorNumberItem {...itemProps} />;
        if (type === "string") return <InspectorStringItem {...itemProps} />;
        if (type === "color") return <InspectorColorItem {...itemProps} />;
        if (type === "enum") return <InspectorEnumItem {...itemProps} options={(meta.enums as any[]).map((text, i) => ({ text, key: i, value: text }))} />;
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
    meta: IJSPatcherObjectMeta;
    args: any[];
    props: Record<string, any>;
    patcherProps: TPublicPatcherProps;
    rect: TRect;
    presentationRect: TPresentationRect;
};
export default class Inspector extends React.PureComponent<{ editor: PatcherEditor }, InspectorState> {
    state: InspectorState = { meta: null, args: [], props: {}, rect: null, presentationRect: null, patcherProps: this.props.editor.publicProps };
    boxes: Box[];
    box: Box;
    handleBoxUpdate = (e: { args?: any[]; props?: Record<string, any> }) => this.setState({ args: e.args || [], props: e.props || {} });
    handleBoxRectChanged = (box: Box) => this.setState({ rect: box.rect.slice() as TRect });
    handleBoxPresentationRectChanged = (box: Box) => this.setState({ presentationRect: box.presentationRect.slice() as TRect });
    unSubscribeBox = (force?: boolean) => {
        if (this.box && (force || this.boxes.indexOf(this.box) === -1)) {
            this.box.off("argsUpdated", this.handleBoxUpdate);
            this.box.off("propsUpdated", this.handleBoxUpdate);
            this.box.off("rectChanged", this.handleBoxRectChanged);
            this.box.off("presentationRectChanged", this.handleBoxPresentationRectChanged);
            this.box.off("textChanged", this.handleSelected);
            this.box = null;
        }
    };
    subscribeBox = () => {
        if (!this.box && this.boxes.length) {
            this.box = this.boxes[0];
            this.box.on("argsUpdated", this.handleBoxUpdate);
            this.box.on("propsUpdated", this.handleBoxUpdate);
            this.box.on("rectChanged", this.handleBoxRectChanged);
            this.box.on("presentationRectChanged", this.handleBoxPresentationRectChanged);
            this.box.on("textChanged", this.handleSelected);
        }
    };
    handleSelected = () => {
        const boxes = this.props.editor.state.selected.filter(id => id.startsWith("box") && this.props.editor.boxes[id]).map(id => this.props.editor.boxes[id]);
        this.boxes = boxes;
        this.unSubscribeBox();
        this.subscribeBox();
        if (boxes.length === 0) {
            this.setState({ meta: null, args: [], props: {}, rect: null, presentationRect: null, patcherProps: this.props.editor.publicProps });
            return;
        }
        const { meta: boxMeta, args, props, rect, presentationRect, presentation, background } = boxes[0];
        if (boxes.length === 1) {
            this.setState({ meta: boxMeta, args: args.slice(), props: { ...props, presentation, background }, rect, presentationRect });
            return;
        }
        const meta: IJSPatcherObjectMeta = { ...boxMeta };
        const commonProps: IPropsMeta = { ...boxMeta.props };
        for (const key in commonProps) {
            const prop = commonProps[key];
            if (key === "rect" || key === "presentationRect") {
                delete commonProps[key];
                continue;
            }
            const useDefault = !(key in props);
            const value = key === "presentation" ? presentation
                : key === "background" ? background
                    : useDefault ? prop.default : (props as any)[key];
            for (let j = 1; j < boxes.length; j++) {
                let found = false;
                const $box = boxes[j];
                const $props = $box.props;
                const $metaProps: IPropsMeta = $box.meta.props;
                const $presentation = $box.presentation;
                const $background = $box.background;
                for (const $key in $metaProps) {
                    const $prop = $metaProps[$key];
                    const $useDefault = !($key in $props);
                    const $value = $key === "presentation" ? $presentation
                        : $key === "background" ? $background
                            : $useDefault ? $prop.default : ($props as any)[$key];
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
        const commonArgs = boxMeta.args.slice();
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
        const additionalProps: Record<string, any> = {};
        if ("presentation" in commonProps) additionalProps.presentation = presentation;
        if ("background" in commonProps) additionalProps.background = background;
        this.setState({ meta, args, props: { ...props, ...additionalProps }, rect: null, presentationRect: null });
    };
    handlePatcherPropsChanged = () => this.setState({ patcherProps: this.props.editor.publicProps });
    componentDidMount() {
        this.handleSelected();
        this.props.editor.on("selected", this.handleSelected);
        this.props.editor.instance.on("propsChanged", this.handlePatcherPropsChanged);
    }
    componentWillUnmount() {
        this.unSubscribeBox(true);
        this.props.editor.off("selected", this.handleSelected);
        this.props.editor.instance.off("propsChanged", this.handlePatcherPropsChanged);
    }
    handleChange = (value: any, key: number | string) => {
        if (!this.box) return;
        if (typeof key === "number") {
            const args = this.box.args.slice();
            if (this.box.meta.args[key].varLength && Array.isArray(value)) {
                args.splice(key);
                args.push(...value);
            } else {
                args[key] = value;
            }
            this.boxes.forEach(box => box.changeObject({ args }, { undoable: true }));
        } else if (key === "rect") {
            this.boxes.forEach(box => box.setRect(value));
        } else if (key === "presentationRect") {
            this.boxes.forEach(box => box.setPresentationRect(value));
        } else {
            this.boxes.forEach(box => box.changeObject({ props: { [key]: value } }, { undoable: true }));
        }
        this.handleSelected();
    };
    handlePatcherChange = (value: any, key: keyof TPatcherProps) => this.props.editor.instance.setProps({ [key]: value });
    render() {
        const { meta, args, props } = this.state;
        const table: JSX.Element[] = [];
        if (!meta) { // Patcher Inspector
            table.push(
                <Table.Row key={"__division_patcher_props"} active>
                    <Table.Cell colSpan={2} width={16} className="division-name">Patcher</Table.Cell>
                </Table.Row>
            );
            const P = this.props.editor.instance.constructor as typeof Patcher;
            Object.keys(P.props).forEach((nameIn) => {
                const name = nameIn as keyof typeof Patcher["props"];
                const propMeta = P.props[name];
                const value = this.state.patcherProps[name];
                const item = <InspectorPropItem {...this.props} key={name} patcher={this.props.editor.instance} itemKey={name} meta={propMeta} value={value} onChange={this.handlePatcherChange} />;
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
                    <InspectorArgItem {...this.props} key={i} patcher={this.props.editor.instance} itemKey={i} meta={argMeta} value={value} onChange={this.handleChange} />
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
                const item = <InspectorPropItem {...this.props} key={name} patcher={this.props.editor.instance} itemKey={name} meta={propMeta} value={value} onChange={this.handleChange} />;
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
        const boxIds = this.props.editor.state.selected.filter(id => id.startsWith("box")).map(s => +s.slice(4)).sort((a, b) => a - b);
        return (
            <>
                <div className="inspector-table-container">
                    <div className="inspector-table">
                        <Table className="last-table" inverted celled striped selectable unstackable size="small" compact="very">
                            <Table.Body>
                                {table}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <Menu icon inverted size="mini">
                    <Label.Group size="mini" color="grey">
                        {boxIds.length ? boxIds.map(id => <Label style={{ margin: ".5em" }} key={id} content={id} />) : <Label style={{ margin: ".5em" }} content="Patcher" />}
                    </Label.Group>
                </Menu>
            </>
        );
    }
}
