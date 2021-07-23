import AbstractObject, { IJSPatcherObjectMeta, IPropsMeta } from "./AbstractObject";
import type { TRect } from "../../types";
import type { BaseUIState } from "./BaseUI";

export interface BaseObjectAdditionalProps {
    background: boolean;
    presentation: boolean;
    rect: TRect;
    presentationRect: TRect;
}
export interface BaseObjectProps extends BaseObjectAdditionalProps, BaseUIState {}
export default class BaseObject<
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends Partial<BaseObjectProps> & Record<string, any> = {},
    U extends Partial<BaseUIState> & Record<string, any> = {},
    E extends {} = {}
> extends AbstractObject<D, S, I, O, A, P & BaseObjectProps, U & BaseUIState, E> {
    static props: IPropsMeta = {
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
            default: [0, 0, 90, 20],
            description: "Position and dimensions in patch"
        },
        presentationRect: {
            type: "object",
            default: [0, 0, 90, 20],
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
            thisProps[key as keyof IPropsMeta<BaseObjectProps>].group = key in superProps ? superProps[key].group : thisName;
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
