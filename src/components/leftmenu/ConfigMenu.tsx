import * as React from "react";
import { MenuItemProps, Menu, Icon, Header, Dropdown } from "semantic-ui-react";
import Env from "../../core/Env";
import EnvOptionsManager, { EnvOptions } from "../../core/EnvOptionsManager";
import VERSION from "../../scripts/version";
import EnvOptionsModal from "../modals/EnvOptionsModal";

export default class ConfigMenu extends React.PureComponent<{ env: Env; lang: string }, { envOptionsModalOpen: boolean }> {
    state = {
        envOptionsModalOpen: false
    };
    onCloseEnvOptionsModal = (options: EnvOptions) => {
        this.props.env.options = options;
        this.setState({ envOptionsModalOpen: false });
    };
    onConfirmEnvOptionsModal = () => {
        this.setState({ envOptionsModalOpen: false });
    };
    onResetEnvOptionsModal = () => {
        this.props.env.options = EnvOptionsManager.defaultOptions;
    };
    render() {
        return (
            <>
                <Dropdown item={true} icon={<Icon name="cog" color="grey" inverted />}>
                    <Dropdown.Menu style={{ minWidth: "max-content", zIndex: 200 }}>
                        <Dropdown.Item onClick={() => this.setState({ envOptionsModalOpen: true })} text="Options..." />
                        <Dropdown.Item href="https://github.com/fr0stbyter/jspatcher" target="_blank" text="Visit GitHub" />
                        <Dropdown.Item disabled text={`Version: ${VERSION}`} />
                    </Dropdown.Menu>
                </Dropdown>
                <EnvOptionsModal {...this.props} open={this.state.envOptionsModalOpen} onReset={this.onResetEnvOptionsModal} onClose={this.onCloseEnvOptionsModal} onConfirm={this.onConfirmEnvOptionsModal} />
            </>
        );
    }
}
