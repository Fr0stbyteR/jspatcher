import { TMeta, Bang } from "../Base";
import { ImportedObjectUI, ImportedObject } from "./ImportedObject";

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
    state = { instance: undefined } as S<Static>;
    inlets = 2;
    outlets = 2;
    fn(data: any, inlet: number) {
        if (inlet === 0) {
            if (!(data instanceof Bang)) this.state.instance = data;
            let result;
            try {
                result = this.state.instance[this.name];
            } catch (e) {
                this.error(e);
                return this;
            }
            this.outletAll([this.state.instance, result] as O<Static>);
        } else if (inlet === 1) {
            try {
                this.state.instance[this.name] = data;
            } catch (e) {
                this.error(e);
                return this;
            }
        }
        return this;
    }
    get ui(): typeof ImportedObjectUI {
        return PropertyUI;
    }
}
