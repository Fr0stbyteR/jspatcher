import * as React from "react";
import { Button, Dropdown, Form, Header, Input, Label, Menu, Table } from "semantic-ui-react";
import type Env from "../../core/Env";
import { EnvEventMap } from "../../core/Env";
import type LiveShare from "../../core/LiveShare";
import type { LiveShareOptions } from "../../core/types";
import "./ShareMenu.scss";

interface P {
    env: Env;
    lang: string;
}

interface S {
    liveShare: LiveShare;
    liveShareOptions: LiveShareOptions;
    showPanel: boolean;
    liveShareState: LiveShare["state"];
    loginError: boolean;
}

export default class ShareMenu extends React.PureComponent<P, S> {
    state = {
        liveShare: this.props.env.liveShare,
        liveShareOptions: this.props.env.options.liveShare,
        showPanel: false,
        liveShareState: this.props.env.liveShare.state,
        loginError: false
    };
    handleClickLogin = async () => {
        if (this.state.liveShareState.clientId) {
            await this.state.liveShare.logout();
        } else {
            try {
                this.setState({ loginError: false });
                await this.state.liveShare.login(this.state.liveShareOptions.server, this.state.liveShareOptions.nickname);
            } catch (error) {
                this.setState({ loginError: true });
            }
        }
    };
    handleOptions = ({ options: { liveShare } }: EnvEventMap["options"]) => this.setState({ liveShareOptions: liveShare });
    handleState = (liveShareState: LiveShare["state"]) => this.setState({ liveShareState });
    componentDidMount() {
        this.props.env.on("options", this.handleOptions);
        this.state.liveShare.on("state", this.handleState);
    }
    componentWillUnmount() {
        this.props.env.off("options", this.handleOptions);
        this.state.liveShare.off("state", this.handleState);
    }
    render() {
        const { showPanel, liveShareState, liveShareOptions, loginError } = this.state;
        const { socketState, clientId, roomInfo, ping } = liveShareState;
        return (
            <>
                <Menu.Item active={showPanel} onClick={() => this.setState(({ showPanel }) => ({ showPanel: !showPanel }))}>
                    {"Share"}
                    {socketState === "open"
                        ? (roomInfo
                            ? <Label style={{ padding: "1px 5px", margin: "-1px 0px -1px 8px" }} size="mini" color="green">{roomInfo.clients.length}</Label>
                            : <Label size="mini" circular color="green" empty />)
                        : <Label size="mini" circular color="grey" empty />
                    }
                </Menu.Item>
                {showPanel
                    ? <div className="menu-share-container ui dropdown menu">
                        <Form size="mini">
                            <Form.Field inline>
                                <label>Server URL</label>
                                <Input
                                    action={{
                                        icon: clientId ? "sign-out" : "sign-in",
                                        color: clientId ? "red" : "green",
                                        basic: true,
                                        size: "mini",
                                        title: clientId ? "Disconnect" : "Connect",
                                        onClick: this.handleClickLogin
                                    }}
                                    disabled={!!clientId}
                                    error={loginError}
                                    label={clientId ? `${~~ping || 0}ms` : undefined}
                                    value={this.state.liveShareOptions.server}
                                    onChange={(e, { value }) => this.props.env.options = { liveShare: { server: value } }}
                                    placeholder="ws://"
                                />
                            </Form.Field>
                            <Form.Field inline>
                                <label>Nick name</label>
                                <Input
                                    value={this.state.liveShareOptions.nickname}
                                    disabled={!!clientId}
                                    onChange={(e, { value }) => this.props.env.options = { liveShare: { nickname: value } }}
                                />
                            </Form.Field>
                            {clientId
                                ? roomInfo
                                    ? <>
                                        <Header as="h6">Room {roomInfo.roomId}</Header>
                                        <div className="menu-share-room-info">
                                            <Table size="small" compact="very" unstackable>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell width={8}>Name</Table.HeaderCell>
                                                        <Table.HeaderCell textAlign="right" width={4}>Ping</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {roomInfo.clients.map(({ clientId, ping, nickname }) => (
                                                        <Table.Row key={clientId} className="menu-share-room-client">
                                                            <Table.Cell className="menu-share-room-client client-nickname">{nickname}</Table.Cell>
                                                            <Table.Cell textAlign="right" style={{ backgroundColor: ping < 200 ? "#80FF80" : ping < 500 ? "#FF8000" : "FF8080" }}>{~~ping}ms</Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                </Table.Body>
                                            </Table>
                                        </div>
                                        <Button size="mini" color="orange" onClick={() => this.state.liveShare.leaveRoom()}>Leave Room</Button>
                                        {roomInfo.userIsOwner ? <Button size="mini" color="red" onClick={() => this.state.liveShare.closeRoom()}>Close Room</Button> : undefined}
                                    </>
                                    : <>
                                        <Header>Host Room</Header>
                                        <Form.Field inline>
                                            <label>Room ID</label>
                                            <Input
                                                value={this.state.liveShareOptions.hostRoomId}
                                                onChange={(e, { value }) => this.props.env.options = { liveShare: { hostRoomId: value } }}
                                            />
                                        </Form.Field>
                                        <Form.Field inline>
                                            <label>Room Password</label>
                                            <Input
                                                value={this.state.liveShareOptions.hostPassword}
                                                onChange={(e, { value }) => this.props.env.options = { liveShare: { hostPassword: value } }}
                                            />
                                        </Form.Field>
                                        <Form.Field inline>
                                            <label>Room Permission</label>
                                            <Dropdown
                                                options={(["write", "read"] as const).map(l => ({ text: l, value: l }))}
                                                value={this.state.liveShareOptions.hostPermission}
                                                onChange={(e, { value }) => this.props.env.options = { liveShare: { hostPermission: value as "write" | "read" } }}
                                            />
                                        </Form.Field>
                                        <Button size="mini" color="green" onClick={() => this.state.liveShare.hostRoom(this.state.liveShareOptions.hostRoomId, this.state.liveShareOptions.joinPassword, this.state.liveShareOptions.hostPermission)}>Create Room</Button>
                                        <Header>Join Room</Header>
                                        <Form.Field inline>
                                            <label>Room ID</label>
                                            <Input
                                                value={this.state.liveShareOptions.joinRoomId}
                                                onChange={(e, { value }) => this.props.env.options = { liveShare: { joinRoomId: value } }}
                                            />
                                        </Form.Field>
                                        <Form.Field inline>
                                            <label>Room Password</label>
                                            <Input
                                                value={this.state.liveShareOptions.joinPassword}
                                                onChange={(e, { value }) => this.props.env.options = { liveShare: { joinPassword: value } }}
                                            />
                                        </Form.Field>
                                        <Button size="mini" color="orange" onClick={() => this.state.liveShare.join(this.state.liveShareOptions.joinRoomId, this.state.liveShareOptions.joinPassword, this.state.liveShareOptions.nickname)}>Join Room</Button>
                                    </>
                                : undefined
                            }
                        </Form>
                    </div>
                    : undefined
                }
            </>
        );
    }
}
