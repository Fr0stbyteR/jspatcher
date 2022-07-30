import ImportedObject from "./ImportedObject";
import Bang, { isBang } from "../base/Bang";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";
import type { ImportedObjectType } from "../../types";

interface IS<Static extends boolean> {
    instance: Static extends true ? undefined : any;
    result: any;
}
type I<Static extends boolean> = Static extends true ? [Bang] : [any | Bang];
type O<Static extends boolean> = Static extends true ? [any] : [any, any];
export default class Getter<Static extends boolean = false> extends ImportedObject<any, {}, I<Static>, O<Static>, [], { sync: boolean }, { loading: boolean }> {
    static importedObjectType: ImportedObjectType = "Getter";
    static description = "Auto-imported getter";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Instance to read"
    }];
    static outlets: IJSPatcherObjectMeta["outlets"] = [{
        type: "anything",
        description: "Value"
    }, {
        type: "anything",
        description: "Instance bypass"
    }];
    static props: IJSPatcherObjectMeta["props"] = {
        sync: {
            type: "boolean",
            default: false,
            description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
        }
    };
    _: IS<Static> = { instance: undefined, result: null };
    handlePreInit = () => {
        this.inlets = 1;
        this.outlets = 2;
    };
    handleInlet = ({ data, inlet }: { data: any; inlet: number }) => {
        if (inlet === 0) {
            if (!isBang(data)) this._.instance = data;
            if (this.execute()) this.output();
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", this.handlePreInit);
        this.on("postInit", this.updatePropertyMetaFromTS);
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
