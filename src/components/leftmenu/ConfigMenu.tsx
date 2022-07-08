import * as React from "react";
import { Icon, Dropdown } from "semantic-ui-react";
import Env from "../../core/Env";
import EnvOptionsManager, { EnvOptions } from "../../core/EnvOptionsManager";
import VERSION from "../../version";
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
    onReload = async () => {
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) registration.unregister();
        }
        const cacheNames = await caches.keys();
        const cacheName = cacheNames.find(n => n.includes("JSPatcher"));
        if (cacheName) await caches.delete(cacheName);
        window.location.reload();
    };
    render() {
        return (
            <>
                <Dropdown item={true} icon={<Icon name="cog" color="grey" inverted />}>
                    <Dropdown.Menu style={{ minWidth: "max-content", zIndex: 200 }}>
                        <Dropdown.Item onClick={() => this.setState({ envOptionsModalOpen: true })} text="Options..." />
                        <Dropdown.Item href="https://github.com/fr0stbyter/jspatcher" target="_blank" text="Visit GitHub" />
                        <Dropdown.Item disabled text={`Version: ${VERSION}`} />
                        <Dropdown.Item onClick={this.onReload} text="Force Reload" />
                    </Dropdown.Menu>
                </Dropdown>
                <EnvOptionsModal {...this.props} open={this.state.envOptionsModalOpen} onReset={this.onResetEnvOptionsModal} onClose={this.onCloseEnvOptionsModal} onConfirm={this.onConfirmEnvOptionsModal} />
            </>
        );
    }
}
