import UIObject from "./Base";
import { DOMUI, DOMUIState } from "../base/DOMUI";
import { IJSPatcherObjectMeta, IPropsMeta } from "../../types";
import { isBang } from "../base/index.jspatpkg";

export class ViewUI extends DOMUI<view> {
    state: DOMUIState = { ...this.state, children: this.object.state.children, containerProps: this.object.getProp("containerProps") };
}
export interface ViewProps {
    shadow: boolean;
    containerProps: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;
}
export default class view extends UIObject<{}, { children: ChildNode[] }, [string | Element], [], [string], ViewProps, DOMUIState> {
    static description = "View HTML Element";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "HTML string or HTMLElement object to view"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: true,
        description: "initial innerHTML"
    }];
    static props: IPropsMeta<ViewProps> = {
        shadow: {
            type: "boolean",
            default: true,
            description: "Whether children should be attached to a Shadow DOM",
            isUIState: true
        },
        containerProps: {
            type: "object",
            default: {},
            description: "Available under non-shadow mode, the props for div container",
            isUIState: true
        }
    };
    static UI = ViewUI;
    state = { children: [] as ChildNode[] };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (typeof this.box.args[0] === "string") {
                const template = document.createElement("template");
                template.innerHTML = this.box.args[0];
                this.state.children = Array.from(template.content.children);
                this.updateUI({ children: this.state.children });
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    if (typeof data === "string") {
                        const template = document.createElement("template");
                        template.innerHTML = data;
                        this.state.children = Array.from(template.content.children);
                    } else if (data instanceof Element) {
                        this.state.children = [data];
                    }
                    this.updateUI({ children: this.state.children });
                }
            }
        });
    }
}
