import * as React from "react";
import { Menu, Icon, Table, Ref } from "semantic-ui-react";
import Box from "../../core/patcher/Box";
import { ILogInfo } from "../../core/types";
import Env from "../../core/Env";
import { isJSPatcherObject } from "../../core/objects/base/AbstractObject";

interface P {
    env: Env;
    display: boolean;
}

interface S {
    cached: ILogInfo[];
}

export default class Console extends React.PureComponent<P, S> {
    state = { cached: this.props.env.logger.log };
    refTable = React.createRef<HTMLTableElement>();
    logDuringLoading: ILogInfo[] = [];
    handleNewLog = (log: ILogInfo) => {
        this.setState({ cached: this.props.env.logger.log }, this.scrollToEnd);
    };
    handleClear = () => {
        this.props.env.logger.clear();
        this.setState({ cached: this.props.env.logger.log });
    };
    scrollToEnd = () => {
        const table = this.refTable.current;
        if (!table) return;
        table.tBodies[0]?.lastElementChild?.scrollIntoView();
    };
    handleHighlight = (emitter: any) => {
        if ((isJSPatcherObject(emitter)) || (emitter instanceof Box)) emitter.highlight();
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
                <Table.Cell width={12} style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{log.message}</Table.Cell>
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
