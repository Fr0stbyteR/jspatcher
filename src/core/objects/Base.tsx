import { IJSPatcherObjectMeta, TRect } from "../types";
import AbstractObject from "./AbstractObject";
import { BaseUIState, DefaultUI, DefaultUIState } from "./BaseUI";
import "./Default.scss";
import "./Base.scss";

export interface BaseObjectAdditionalProps {
    background: boolean;
    presentation: boolean;
    rect: TRect;
    presentationRect: TRect;
}
export interface BaseObjectProps extends BaseObjectAdditionalProps, BaseUIState {}
export class BaseObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends Partial<BaseObjectProps> & Record<string, any> = {},
    U extends Partial<BaseUIState> & Record<string, any> = {}, E extends {} = {}
> extends AbstractObject<D, S, I, O, A, P & BaseObjectProps, U & BaseUIState, E> {
    static props: IJSPatcherObjectMeta["props"] = {
        hidden: {
            type: "boolean",
            default: false,
            description: "Hide on lock",
            isUIState: true
        },
        background: {
            type: "boolean",
            default: false,
            description: "Include in background"
        },
        presentation: {
            type: "boolean",
            default: false,
            description: "Include in presentation"
        },
        rect: {
            type: "object",
            default: [],
            description: "Position and dimensions in patch"
        },
        presentationRect: {
            type: "object",
            default: [],
            description: "Position and dimensions in presentation"
        },
        ignoreClick: {
            type: "boolean",
            default: false,
            description: "Ignore Click",
            isUIState: true
        },
        hint: {
            type: "string",
            default: "",
            description: "Hint on hover",
            isUIState: true
        }
    };
    static get meta(): IJSPatcherObjectMeta {
        const thisName = this._name;
        const superMeta = Object.getPrototypeOf(this).meta;
        const superProps = superMeta.props;
        const thisProps = this.props;
        for (const key in thisProps) {
            thisProps[key].group = key in superProps ? superProps[key].group : thisName;
        }
        return {
            package: this.package,
            name: this._name,
            icon: this.icon,
            author: this.author,
            version: this.version,
            description: this.description,
            inlets: [...this.inlets],
            outlets: [...this.outlets],
            args: [...this.args],
            props: {
                ...superProps,
                ...thisProps
            }
        };
    }
    subscribe() {
        super.subscribe();
        this.on("metaChanged", meta => this.box.emit("metaChanged", meta));
        this.on("dataUpdated", data => this.box.emit("dataUpdated", data));
        this.on("update", this.updateBox);
        const isUIStateKey = (x: any): x is keyof (U & BaseUIState) => this.meta.props[x] && this.meta.props[x].isUIState;
        const updateUIFromProps = (props: Partial<P & BaseObjectProps>) => {
            if (props) {
                const uiState: Partial<U & BaseUIState> = {};
                for (const key in props) {
                    if (isUIStateKey(key)) uiState[key as keyof (U & BaseUIState)] = props[key] as any;
                }
                this.updateUI(uiState);
            }
        };
        this.on("updateProps", updateUIFromProps);
    }
}
export interface DefaultObjectUIProps {
    bgColor: string;
    borderColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: "normal" | "italic" | "oblique";
    fontWeight: "normal" | "bold" | "lighter" | "bolder" | number;
    textAlign: "center" | "left" | "right";
}
export interface DefaultObjectProps extends DefaultObjectUIProps, BaseObjectProps {}
export class DefaultObject<
    D extends {} = {}, S extends {} = {},
    I extends any[] = any[], O extends any[] = any[],
    A extends any[] = any[], P extends Partial<DefaultObjectProps> & Record<string, any> = {},
    U extends Partial<DefaultUIState> & Record<string, any> = {}, E extends {} = {}
> extends BaseObject<D, S, I, O, A, P & DefaultObjectProps, U & DefaultUIState, E> {
    static props: IJSPatcherObjectMeta["props"] = {
        bgColor: {
            type: "color",
            default: "rgb(51, 51, 51)",
            description: "Background color",
            isUIState: true
        },
        borderColor: {
            type: "color",
            default: "rgb(125, 126, 132)",
            description: "Border color",
            isUIState: true
        },
        textColor: {
            type: "color",
            default: "rgb(255, 255, 255)",
            description: "Text color",
            isUIState: true
        },
        fontFamily: {
            type: "enum",
            enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New"],
            default: "Lato",
            description: "Font family",
            isUIState: true
        },
        fontSize: {
            type: "number",
            default: 12,
            description: "Text font size",
            isUIState: true
        },
        fontStyle: {
            type: "enum",
            enums: ["normal", "italic", "oblique"],
            default: "normal",
            description: "Text style",
            isUIState: true
        },
        fontWeight: {
            type: "string",
            default: "normal",
            description: 'Text style: "normal" | "bold" | "lighter" | "bolder" | number',
            isUIState: true
        },
        textAlign: {
            type: "enum",
            enums: ["left", "center", "right"],
            default: "left",
            description: "Text style",
            isUIState: true
        }
    };
    static UI = DefaultUI;
}

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
