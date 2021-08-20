import * as React from "react";
import { Menu, Input, Table, Checkbox, CheckboxProps, Button } from "semantic-ui-react";
import PatcherEditor from "../../core/patcher/PatcherEditor";
import type Env from "../../core/Env";
import type { EnvEventMap } from "../../core/Env";
import type { PackageInfo } from "../../core/PackageManager";

export default class Packages extends React.PureComponent<{ env: Env }, { editor: PatcherEditor; packages: PackageInfo[]; adding: boolean }> {
    state = { editor: this.props.env.activeEditor instanceof PatcherEditor ? this.props.env.activeEditor : null, packages: this.props.env.activeEditor instanceof PatcherEditor ? this.props.env.activeEditor.instance.state.pkgMgr.packagesInfo : [], adding: false };
    refTable = React.createRef<HTMLTableElement>();
    handleEnvActiveEditor = ({ editor }: EnvEventMap["activeEditor"]) => {
        this.state.editor?.instance.off("libChanged", this.handleLibChanged);
        if (editor instanceof PatcherEditor) {
            editor.instance.on("libChanged", this.handleLibChanged);
            this.setState({ editor, packages: editor.instance.state.pkgMgr.packagesInfo });
        } else {
            this.setState({ editor: null, packages: [] });
        }
    };
    handleLibChanged = () => {
        this.setState({ packages: this.state.editor.instance.state.pkgMgr.packagesInfo });
    };
    handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const tdID = e.currentTarget.parentElement.nextSibling as HTMLTableRowElement;
        const tdURL = tdID.nextSibling as HTMLTableRowElement;
        const id = tdID.getElementsByTagName("input")[0].value.trim();
        const url = tdURL.getElementsByTagName("input")[0].value.trim();
        if (id && url) {
            this.setState({ adding: true });
            await this.state.editor.instance.addPackage(id, url);
            this.setState({ adding: false });
        }
    };
    handleCheck = (e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        const tdID = e.currentTarget.parentElement.nextSibling as HTMLTableRowElement;
        const tdURL = tdID.nextSibling as HTMLTableRowElement;
        const id = tdID.innerText;
        const url = tdURL.innerText;
        if (data.checked) this.state.editor.instance.addPackage(id, url);
        else this.state.editor.instance.removePackage(id);
    };
    handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const row = e.currentTarget.parentElement.parentElement.parentElement as HTMLTableRowElement;
            const btn = row.firstChild.firstChild as HTMLButtonElement;
            btn.click();
        }
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };
    handleInputNameKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const cell = e.currentTarget.parentElement.parentElement as HTMLTableCellElement;
        const inputURL = cell.nextSibling.firstChild.firstChild as HTMLInputElement;
        if (!inputURL.value || inputURL.value.startsWith("https://unpkg.com/")) inputURL.value = `https://unpkg.com/${e.currentTarget.value}`;
    };
    componentDidMount() {
        this.props.env.on("activeEditor", this.handleEnvActiveEditor);
        this.state.editor?.on("ready", this.handleLibChanged);
        this.state.editor?.instance.on("libChanged", this.handleLibChanged);
    }
    componentWillUnmount() {
        this.props.env.off("activeEditor", this.handleEnvActiveEditor);
        this.state.editor?.off("ready", this.handleLibChanged);
        this.state.editor?.instance.off("libChanged", this.handleLibChanged);
    }
    render() {
        const logs = this.state.packages.map(({ id, url, enabled, isBuiltIn }, i) => (
            <Table.Row key={i}>
                <Table.Cell style={{ paddingTop: "0px", paddingBottom: "0px" }} width={1}>
                    {
                        isBuiltIn
                            ? undefined
                            : <Checkbox checked={enabled} size="mini" onClick={this.handleCheck} title={enabled ? "Disable the package" : "Enable the package"} />
                    }
                </Table.Cell>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{url}</Table.Cell>
            </Table.Row>
        ));
        return (
            <>
                <Table inverted celled striped selectable unstackable singleLine size="small" compact="very">
                    <Table.Body>
                        {logs}
                        <Table.Row key="input">
                            <Table.Cell style={{ padding: 0 }} width={1}>
                                <Button icon="add" size="mini" compact inverted disabled={this.state.adding} loading={this.state.adding} onClick={this.handleAdd} title="Add a package" />
                            </Table.Cell>
                            <Table.Cell width={4} style={{ padding: 0 }}>
                                <Input fluid size="mini" placeholder={"Namespace"} onKeyDown={this.handleInputKeyDown} onKeyUp={this.handleInputNameKeyUp} />
                            </Table.Cell>
                            <Table.Cell style={{ padding: 0 }}>
                                <Input fluid size="mini" placeholder={"URL"} onKeyDown={this.handleInputKeyDown} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Menu icon inverted size="mini">
                </Menu>
            </>
        );
    }
}
