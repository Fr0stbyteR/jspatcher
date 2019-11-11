import { Bang } from "../Base";
import { ImportedObjectUI, ImportedObject } from "./ImportedObject";
import { TMeta } from "../../types";

export class PropertyUI extends ImportedObjectUI<Property> {
    prependColor = "rgb(220, 200, 170)";
}
type S<Static extends boolean> = { instance: Static extends true ? undefined : any };
type I<Static extends boolean> = Static extends true ? [Bang, any] : [any | Bang, any];
type O<Static extends boolean> = Static extends true ? [any] : [any, any];
type A<Static extends boolean> = Static extends true ? [any] : [];
export class Property<Static extends boolean = false> extends ImportedObject<any, S<Static>, I<Static>, O<Static>, A<Static>, {}, {}> {
    static get meta(): TMeta {
        return {
            ...super.meta,
            description: "Auto-imported property",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Instance to read, bang to get the value"
            }, {
                isHot: false,
                type: "anything",
                description: "Set the value"
            }],
            outlets: [{
                type: "anything",
                description: "Instance bypass"
            }, {
                type: "anything",
                description: "Value"
            }]
        };
    }
    state: S<Static> = { instance: undefined };
    handlePreInit = () => {
        this.inlets = 2;
        this.outlets = 2;
    };
    handleInlet: (e: { data: any; inlet: number }) => void = ({ data, inlet }) => {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.instance = data;
            let result;
            try {
                result = this.state.instance[this.name];
            } catch (e) {
                this.error(e);
            }
            this.outletAll([this.state.instance, result] as O<Static>);
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
    uiComponent: typeof ImportedObjectUI = PropertyUI;
}
