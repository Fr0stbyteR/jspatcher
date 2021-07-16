import * as Util from "util";
import UIObject from "./Base";
import ButtonUI from "./ButtonUI";
import { IJSPatcherObjectMeta } from "../../types";
import { Bang } from "../Base";
import { BaseUI } from "../BaseUI";

class MessageUI extends ButtonUI<message> {
    static editableOnUnlock = true;
    handleChanged = (text: string) => this.object.handleUpdateArgs([text]);
    handleClick = (e: React.MouseEvent) => {
        if (this.editor.state.locked) this.object.outlet(0, this.object.state.buffer);
    };
}
export default class message extends UIObject<{ text: string }, { buffer: any; editing: boolean }, [any, any], [any], [any], {}, { text: string }> {
    static description = "Message";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Trigger output the message"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the message"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Message to send"
    }];
    state = { buffer: new Bang(), editing: false };
    handleUpdateArgs = (args: any[]) => {
        if (typeof args[0] !== "undefined") {
            this.setData({ text: this.stringify(args[0]) });
            this.state.buffer = this.parse(args[0]);
        } else {
            this.state.buffer = new Bang();
        }
        this.updateUI({ text: this.data.text });
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("postInit", () => {
            const args = this.box.args;
            if (typeof this.data.text === "string") this.state.buffer = this.parse(this.data.text);
            else if (typeof args[0] !== "undefined") {
                if (typeof this.data.text !== "string") {
                    this.setData({ text: this.stringify(args[0]) });
                    this.state.buffer = args[0];
                }
            } else {
                this.setData({ text: "" });
                this.state.buffer = new Bang();
            }
            this.on("updateArgs", this.handleUpdateArgs);
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) this.outlet(0, this.state.buffer);
            else if (inlet === 1) this.handleUpdateArgs([data]);
        });
    }
    parse(o: any) {
        if (typeof o === "string") {
            if (o.length > 0) {
                try {
                    return JSON.parse(o);
                } catch (e) {
                    return o;
                }
            }
            return new Bang();
        }
        return o;
    }
    stringify(o: any) {
        if (typeof o === "string") return o;
        try {
            return JSON.stringify(o);
        } catch (e) {
            return Util.inspect(o);
        }
    }
    static UI: typeof BaseUI = MessageUI;
}
