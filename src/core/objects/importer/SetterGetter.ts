import ImportedObject from "./ImportedObject";
import Bang, { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";
import type { ImportedObjectType } from "../../types";

interface IS<Static extends boolean> {
    instance: Static extends true ? undefined : any;
    input: any;
    result: any;
}
type I<Static extends boolean> = Static extends true ? [any] : [any | Bang, any];
type O<Static extends boolean> = Static extends true ? [any] : [any, any];

export default class SetterGetter<Static extends boolean = false> extends ImportedObject<any, {}, I<Static>, O<Static>, [any], { sync: boolean }, { loading: boolean }> {
    static importedObjectType: ImportedObjectType = "SetterGetter";
    static description = "Auto-imported setter / getter";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Instance to manipulate"
    }, {
        isHot: false,
        type: "anything",
        description: "Set the value, bang to void"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }, {
        type: "anything",
        description: "Instance bypass"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "anything",
        optional: true,
        varLength: false,
        description: "Initial value to set"
    }];
    static props: IJSPatcherObjectMeta["props"] = {
        sync: {
            type: "boolean",
            default: false,
            description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
        }
    };
    initialInlets = 2;
    initialOutlets = 2;
    _: IS<Static> = { instance: undefined, input: new Bang(), result: null };
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this._.instance = data;
            if (typeof this._.instance === "undefined") return;
            if (!isBang(this._.input)) {
                try {
                    this._.instance[this.name] = this._.input;
                } catch (e) {
                    this.error(e);
                    return;
                }
            }
            if (this.execute()) this.output();
        } else if (inlet === 1) {
            this._.input = data;
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = this.initialInlets;
            this.outlets = this.initialOutlets;
            handleUpdateArgs(this.args);
        });
        this.on("postInit", this.updatePropertyMetaFromTS);
        const handleUpdateArgs = (args: [any?]) => {
            if (args.length) this._.input = args[0];
        };
        this.on("updateArgs", handleUpdateArgs);
        this.on("inlet", this.handleInlet);
    }
    execute() {
        try {
            this._.result = this._.instance[this.name];
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this._.result, this._.instance] as O<Static>);
    output() {
        if (this._.result instanceof Promise && !this.getProp("sync")) {
            this.loading = true;
            this._.result.then((r) => {
                this.loading = false;
                this._.result = r;
                this.callback();
            }, (r) => {
                this.loading = false;
                this.error(r);
            });
            return this;
        }
        return this.callback();
    }
    set loading(loading: boolean) {
        this.updateUI({ loading });
    }
}
