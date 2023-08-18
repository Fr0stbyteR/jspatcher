import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import Env from "../../core/Env";
import VERSION from "../../version";

interface P {
    env: Env;
    lang: string;
}

interface S {}

export default class EditMenu extends React.PureComponent<P, S> {
    state: S = {};
    handleGettingStarted = async () => {
        await this.props.env.openPatcherFromURL("../help/getting-started/intro.jspat");
    };
    handleTutorial101 = async () => {
        await this.props.env.openPatcherFromURL("../help/getting-started/101.jspat");
    };
    handleReload = async () => {
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) registration.unregister();
        }
        const cacheNames = await caches.keys();
        const cacheName = cacheNames.find(n => n.includes("JSPatcher"));
        if (cacheName) await caches.delete(cacheName);
        window.location.reload();
    };
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <Dropdown item={true} icon={false} text="Help">
                <Dropdown.Menu style={{ minWidth: "max-content" }}>
                    <Dropdown.Item onClick={this.handleGettingStarted} text="Getting Started" />
                    <Dropdown.Item onClick={this.handleTutorial101} text="Tutorial 101" />
                    <Dropdown.Divider />
                    <Dropdown.Item href="https://github.com/fr0stbyter/jspatcher" target="_blank" text="Visit GitHub" />
                    <Dropdown.Item disabled text={`Version: ${VERSION}`} />
                    <Dropdown.Item onClick={this.handleReload} text="Force Reload" />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
