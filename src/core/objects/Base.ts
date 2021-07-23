import { IJSPatcherObjectMeta } from "../types";
import BaseObject from "./base/BaseObject";
import DefaultObject from "./base/DefaultObject";
import "./Default.scss";
import "./Base.scss";

export class EmptyObject extends DefaultObject<{}, { editing: boolean }, [any], [any]> {
    static author = "Fr0stbyteR";
    static version = "1.0.0";
    static description = "Bypass input";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "output same thing"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "output same thing"
    }];
    state = { editing: false };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.outlets = 1;
            this.inlets = 1;
        });
        this.on("inlet", ({ data }) => this.outlet(0, data));
    }
}

export class InvalidObject extends DefaultObject<{}, {}, [any], [undefined]> {
    static description = "invalid object";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: false,
        type: "anything",
        varLength: true,
        description: "nothing"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        varLength: true,
        description: "nothing"
    }];
    static props: IJSPatcherObjectMeta["props"] = {
        bgColor: {
            type: "color",
            default: "rgb(128, 64, 64)",
            description: "Background color",
            isUIState: true
        }
    };
    subscribe() {
        this.patcher.on("libChanged", () => this.box.changeText(this.box.text, true));
    }
}
export class Bang {
    isBang = true;
    toString() {
        return "bang";
    }
}
export const isBang = (x: any): x is Bang => typeof x === "object" && x?.isBang;
export default { BaseObject, EmptyObject, InvalidObject };
