import * as React from "react";
import { Menu, Input, Table, Button } from "semantic-ui-react";
import Patcher from "../../core/Patcher";

export default class Packages extends React.PureComponent<{ patcher: Patcher; }, { imports: [string, string][]; adding: boolean; }> {
    state = { imports: this.props.patcher.state.pkgMgr.imported.slice(), adding: false };
    refTable = React.createRef<HTMLTableElement>();
    handleLibChanged = () => {
        this.setState({ imports: this.props.patcher.state.pkgMgr.imported.slice() });
    };
    handleAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const tdID = e.currentTarget.parentElement.nextSibling as HTMLTableRowElement;
        const tdURL = tdID.nextSibling as HTMLTableRowElement;
        const id = tdID.getElementsByTagName("input")[0].value.trim();
        const url = tdURL.getElementsByTagName("input")[0].value.trim();
        if (id && url) {
            this.setState({ adding: true });
            try {
                await this.props.patcher.addPackage(id, url);
            } catch (e) {
                this.setState({ adding: false });
                this.props.patcher.error(`Loading dependency: ${id} from ${url} failed`);
            }
            this.setState({ adding: false });
        }
    };
    handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const tdID = e.currentTarget.parentElement.nextSibling as HTMLTableRowElement;
        const tdURL = tdID.nextSibling as HTMLTableRowElement;
        // const id = tdID.innerText;
        const url = tdURL.innerText;
        this.props.patcher.removePackage(url);
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
        this.props.patcher.on("ready", this.handleLibChanged);
        this.props.patcher.on("libChanged", this.handleLibChanged);
        this.props.patcher.on("propsChanged", this.handleLibChanged);
    }
    componentWillUnmount() {
        this.props.patcher.off("ready", this.handleLibChanged);
        this.props.patcher.off("libChanged", this.handleLibChanged);
        this.props.patcher.off("propsChanged", this.handleLibChanged);
    }
    render() {
        const logs = this.state.imports.map(([id, url], i) => (
            <Table.Row key={i}>
                <Table.Cell style={{ padding: 0 }} width={1}>
                    <Button icon="minus" size="mini" compact inverted color="red" onClick={this.handleRemove} title="Remove the package" />
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
