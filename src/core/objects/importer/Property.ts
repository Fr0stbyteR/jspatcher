import ImportedObject, { ImportedObjectUI } from "./ImportedObject";
import Bang, { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";

export class PropertyUI extends ImportedObjectUI<Property> {
    prependColor = "rgb(220, 200, 170)";
}
type S<Static extends boolean> = { instance: Static extends true ? undefined : any };
type I<Static extends boolean> = Static extends true ? [Bang, any] : [any | Bang, any];
type O<Static extends boolean> = Static extends true ? [any] : [any, any];
type A<Static extends boolean> = Static extends true ? [any] : [];

export default class Property<Static extends boolean = false> extends ImportedObject<any, S<Static>, I<Static>, O<Static>, A<Static>, {}, {}> {
    static description = "Auto-imported property";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Constructor argument, output instance constructed"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Constructor argument"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }, {
        type: "anything",
        description: "Instance bypass"
    }];
    state: S<Static> = { instance: undefined };
    handlePreInit = () => {
        this.inlets = 2;
        this.outlets = 2;
    };
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this.state.instance = data;
            let result;
            try {
                result = this.state.instance[this.name];
            } catch (e) {
                this.error(e);
            }
            this.outletAll([result, this.state.instance] as O<Static>);
        } else if (inlet === 1) {
            try {
                this.state.instance[this.name] = data;
            } catch (e) {
                this.error(e);
            }
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
        this.on("inlet", this.handleInlet);
    }
    static UI: typeof ImportedObjectUI = PropertyUI;
}
