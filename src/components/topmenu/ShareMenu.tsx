import * as React from "react";
import { Button, Dropdown, Form, Header, Input, Menu } from "semantic-ui-react";
import type Env from "../../core/Env";
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
    ping: number;
}

export default class ShareMenu extends React.PureComponent<P, S> {
    state = {
        liveShare: this.props.env.liveShare,
        liveShareOptions: this.props.env.options.liveShare,
        showPanel: false,
        ping: -1
    };
    render() {
        return (
            <>
                <Menu.Item active={this.state.showPanel} onClick={() => this.setState(({ showPanel }) => ({ showPanel: !showPanel }))}>Share</Menu.Item>
                {this.state.showPanel
                    ? <div className="menu-share-container ui dropdown menu">
                        <Form size="mini">
                            <Form.Field inline>
                                <label>Server URL</label>
                                <Input
                                    value={this.state.liveShareOptions.server}
                                    onChange={(e, { value }) => this.props.env.options = { liveShare: { server: value } }}
                                />
                            </Form.Field>
                            <Button size="mini" color="green" onClick={() => this.state.liveShare.pingServer(this.state.liveShareOptions.server)}>Ping Server</Button>
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
                            <Button size="mini" color="green" onClick={() => this.state.liveShare.hostRoom(this.state.liveShareOptions.hostRoomId, this.state.liveShareOptions.hostPermission)}>Create Room</Button>
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
                            <Form.Field inline>
                                <label>User name</label>
                                <Input
                                    value={this.state.liveShareOptions.username}
                                    onChange={(e, { value }) => this.props.env.options = { liveShare: { username: value } }}
                                />
                            </Form.Field>
                            <Button size="mini" color="orange" onClick={() => this.state.liveShare.join(this.state.liveShareOptions.joinRoomId, this.state.liveShareOptions.joinPassword, this.state.liveShareOptions.username)}>Join Room</Button>
                        </Form>
                    </div>
                    : undefined
                }
            </>
        );
    }
}
