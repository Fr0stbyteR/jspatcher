import DefaultObject from "./DefaultObject";
import type { IJSPatcherObjectMeta } from "./AbstractObject";
import "./InvalidObject.scss";

export default class InvalidObject extends DefaultObject<{}, {}, [any], [undefined]> {
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
