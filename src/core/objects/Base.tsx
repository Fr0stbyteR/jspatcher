import { EventEmitter } from "events";
import * as React from "react";
import { Patcher } from "../Patcher";
import { Box } from "../Box";
import "./Base.scss";
export type TInletsMeta = {
    isHot: boolean,
    type: "anything" | "signal" | "object" | "number" | "boolean" | string,
    varLength: boolean,
    description: string
}[];
export type TOutletMeta = {
    type: "anything" | "signal" | "object" | "number" | "boolean" | string,
    varLength: boolean,
    description: string
}[];
export type TArgsMeta = {
    type: "anything" | "signal" | "object" | "number" | "boolean" | string,
    optional: boolean,
    varLength: boolean,
    description: string
}[];
export type TPropsMeta = {
    name: string
    type: "anything" | "signal" | "object" | "number" | "boolean" | string,
    description: string
}[];
export type TMeta = {
    package: string, // div will have class "package-name" "package-name-objectname"
    name: string,
    icon: string, // semantic icon to display in UI
    author: string,
    version: string,
    description: string,
    inlets: TInletsMeta,
    outlets: TOutletMeta,
    args: TArgsMeta,
    props: TPropsMeta
};
export class BaseObject extends EventEmitter {
    static get _meta() {
        return {
            package: "Base", // div will have class "package-name" "package-name-objectname"
            name: this.name,
            icon: "code", // semantic icon to display in UI
            author: "",
            version: "0.0.0",
            description: "",
            inlets: [],
            outlets: [],
            args: [],
            props: []
        } as TMeta;
    }
    get _meta() {
        return (this.constructor as any)["_meta"];
    }
    _patcher: Patcher;
    _box: Box;
    _mem: object;
    constructor(box: Box, patcher: Patcher) {
        super();
        // patcher object outside, use _ for pre`vent recursive stringify
        this._patcher = patcher;
        // the box which create this instance, use _ for prevent recursive stringify
        this._box = box;
        // should save all temporary variables here
        this._mem = {};
        // usually do this after initialization
        // this.update(box._args, box._props);
    }
    // build new ui on page, return a React Component, override this
    ui() {
        return <DefaultUI object={this} />;
    }
    // when arguments and @properties are changed, can use this in constructor
    update(args: any[], props: { [key: string]: any }) {
        return this;
    }
    // main function when receive data from a inlet (base 0)
    fn(data: any, inlet: number) {
        return this;
    }
    // use this function to output data with ith outlet.
    outlet(outlet: number, data: any) {
        if (outlet >= this.outlets) return this;
        const outletLines = this.outletLines[outlet].sort((id1, id2) => {
            return this._patcher.lines[id2].positionHash - this._patcher.lines[id1].positionHash;
        });
        for (let j = 0; j < outletLines.length; j++) {
            const lineID = outletLines[j];
            this._patcher.lines[lineID].pass(data);
        }
        return this;
    }
    destroy() {
        return this;
    }
    // called when inlet or outlet are connected or disconnected
    connectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        return this;
    }
    connectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        return this;
    }
    disconnectedOutlet(outlet: number, destBox: Box, destInlet: number, lineID: string) {
        return this;
    }
    disconnectedInlet(inlet: number, srcBox: Box, srcOutlet: number, lineID: string) {
        return this;
    }
    // output to console
    post(data: string) {
        this._patcher.newLog(0, this._meta.name, data);
        return this;
    }
    error(data: string) {
        this._patcher.newLog(1, this._meta.name, data);
        return this;
    }
    info(data: string) {
        this._patcher.newLog(-2, this._meta.name, data);
        return this;
    }
    warn(data: string) {
        this._patcher.newLog(-1, this._meta.name, data);
        return this;
    }
    get inlets() {
        return this._box.inlets;
    }
    get outlets() {
        return this._box.outlets;
    }
    set inlets(i: number) {
        this._box.inlets = i;
    }
    set outlets(i: number) {
        this._box.outlets = i;
    }
    get outletLines() {
        return this._box.outletLines;
    }
    get inletLines() {
        return this._box.inletLines;
    }
    get class() {
        return this.constructor.name;
    }
}
class EmptyObject extends BaseObject {
    static get _meta(): TMeta {
        return Object.assign(BaseObject._meta, {
            name: this.name,
            author: "Fr0stbyteR",
            version: "1.0.0",
            icon: "",
            description: "Bypass input",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "output same thing"
            }],
            outlets: [{
                type: "anything",
                description: "output same thing"
            }]
        });
    }
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.outlets = 1;
        this.inlets = 1;
    }
    fn(data: any, inlet: number) {
        this.outlet(0, data);
        return this;
    }
}
class InvalidObject extends BaseObject {
    static get _meta(): TMeta {
        return Object.assign(BaseObject._meta, {
            name: this.name,
            icon : "",
            description : "invalid object",
            inlets : [{
                isHot : false,
                type : "anything",
                description : "nothing"
            }],
            outlets : [{
                type : "anything",
                description : "nothing"
            }]
        });
    }
}
export class DefaultUI extends React.Component {
    props: { object: BaseObject };
    render() {
        const object = this.props.object;
        const packageName = "package-" + object._meta.package.toLowerCase();
        const className = packageName + "-" + object._meta.name.toLowerCase();
        const classArray = [packageName, className, "box-ui-container", "box-ui-default"];
        return (
            <div className={classArray.join(" ")}>
                <div className="box-ui-text-container">
                    <i className={object._meta.icon ? ("small icon " + object._meta.icon) : ""} />
                    <span className="editable">
                        {object._box.text}
                    </span>
                </div>
            </div>
        );
    }
}
export default {
    BaseObject,
    EmptyObject,
    InvalidObject
};
