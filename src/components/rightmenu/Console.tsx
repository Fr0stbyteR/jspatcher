import * as React from "react";
import { Menu, Icon, Table, Ref } from "semantic-ui-react";
import Box from "../../core/patcher/Box";
import { TPatcherLog } from "../../core/types";
import { BaseObject } from "../../core/objects/Base";
import Env from "../../core/Env";

interface P {
    env: Env;
    display: boolean;
}

interface S {
    cached: TPatcherLog[];
}

export default class Console extends React.PureComponent<P, S> {
    state = { cached: this.props.env.log.slice() };
    refTable = React.createRef<HTMLTableElement>();
    logDuringLoading: TPatcherLog[] = [];
    handleNewLog = (log: TPatcherLog) => {
        this.setState(({ cached }) => ({ cached: [...cached, log] }), this.scrollToEnd);
    };
    handleClear = () => this.setState({ cached: [] });
    scrollToEnd = () => {
        if (!this.refTable.current) return;
        let bottom = true;
        const table = this.refTable.current;
        if (table.scrollTop + table.clientHeight !== table.scrollHeight) bottom = false;
        if (bottom) table.scrollTop = table.scrollHeight;
    };
    handleHighlight = (emitter: any) => {
        if ((emitter instanceof BaseObject) || (emitter instanceof Box)) emitter.highlight();
    };
    componentDidUpdate(prevProps: Readonly<P>) {
        if (this.props.display && this.props.display !== prevProps.display) this.scrollToEnd();
    }
    componentDidMount() {
        this.props.env.on("newLog", this.handleNewLog);
    }
    componentWillUnmount() {
        this.props.env.off("newLog", this.handleNewLog);
    }
    render() {
        if (!this.props.display) return <></>;
        const logs = this.state.cached.map((log, i) => (
            <Table.Row key={i} negative={log.errorLevel === "error"} warning={log.errorLevel === "warn"} positive={log.errorLevel === "info"} onDoubleClick={() => this.handleHighlight(log.emitter)}>
                <Table.Cell width={4}>{log.title}</Table.Cell>
                <Table.Cell width={12}>{log.message}</Table.Cell>
            </Table.Row>
        ));
        return (
            <>
                <div className="console-table-container">
                    <div className="console-table">
                        <Ref innerRef={this.refTable}>
                            <Table inverted celled striped selectable unstackable size="small" compact="very">
                                <Table.Body>
                                    {logs}
                                </Table.Body>
                            </Table>
                        </Ref>
                    </div>
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
