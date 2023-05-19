import DefaultObject from "./DefaultHardwareObject";
import type { IHardwarePatcherObjectMeta } from "./AbstractHardwareObject";
import "./InvalidObject.scss";

export default class InvalidObject extends DefaultObject<{}, {}, [any], [undefined]> {
    static description = "invalid object";
    static inlets: IHardwarePatcherObjectMeta["ios"] = [{
        isHot: false,
        type: "anything",
        varLength: true,
        description: "nothing"
    }];
    static props: IHardwarePatcherObjectMeta["props"] = {
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
