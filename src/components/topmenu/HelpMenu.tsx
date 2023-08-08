import * as React from "react";
import { Button, Dropdown, Modal } from "semantic-ui-react";
// import AudioEditor from "../../core/audio/AudioEditor";
import Env, { EnvEventMap } from "../../core/Env";
import VERSION from "../../version";
import { Placeholder } from "semantic-ui-react";

const loaderDivStyle = {
    marginLeft: '1em'
}

interface P {
    env: Env;
    lang: string;
}

interface S {
    aboutOpen: boolean;
    backendVersions: { "web": string, "photosynthesis": string };
}

export default class HelpMenu extends React.PureComponent<P, S> {
    state: S = {
        aboutOpen: false,
        backendVersions: { "web": null, "photosynthesis": null },
    };
    // handleLocked = (locked: boolean) => this.setState({ locked });
    // componentDidMount() {
    //     this.props.env.on("activeEditor", this.handleActiveEditor);
    // }
    // componentWillUnmount() {
    //     this.props.env.off("activeEditor", this.handleActiveEditor);
    // }
    render() {
        return (
            <Dropdown closeOnChange item={true} icon={false} text="Help">
                <Dropdown.Menu style={{ minWidth: "max-content" }}>
                    <Dropdown.Item onClick={async () => {
                        this.setState({ aboutOpen: true });

                        if (this.state.backendVersions["web"] && this.state.backendVersions["photosynthesis"]) return;
                        const versionUrl = `${process.env.API_DOMAIN}/version`;
                        const response = await fetch(versionUrl);
                        const json = await response.json();
                        this.setState({ backendVersions: json });
                    }} text="About" />
                    <Modal
                        size='mini'
                        open={this.state.aboutOpen}
                        onClose={() => this.setState({ aboutOpen: false })}
                        basic
                    >
                        <Modal.Header>About Bell</Modal.Header>
                        <Modal.Content>
                            <p>Patcher version: {VERSION}</p>
                            <p>Web version: {this.state.backendVersions.web ? this.state.backendVersions.web : "fetching..."}</p>
                            <p>Photosynthesis version: {this.state.backendVersions.photosynthesis ? this.state.backendVersions.photosynthesis : "fetching..."}</p>
                            <hr />
                            <p>The patching environment is based on jspatcher and licensed under the GNU General Public License v3.</p>
                            <p>Original Author: shren (<a href="https://github.com/Fr0stbyteR" target="_blank">Fr0stbyteR</a>)</p>
                            <p><a href="https://github.com/CorvusPrudens/jspatcher" target="_blank">Source code.</a></p>
                            <p><a href="https://www.gnu.org/licenses/gpl-3.0.txt" target="_blank">GPL License Text</a></p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button inverted color="grey" size="mini" onClick={() => this.setState({ aboutOpen: false })}>Close</Button>
                        </Modal.Actions>
                    </Modal>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
