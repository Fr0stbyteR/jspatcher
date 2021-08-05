import DefaultUI, { DefaultUIState } from "./DefaultUI";
import type Env from "../../Env";
import type BaseObject from "./BaseObject";
import type { IJSPatcherObjectMeta } from "./AbstractObject";
import type { DefaultObjectProps } from "./DefaultObject";

export default <
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends Partial<DefaultObjectProps> & Record<string, any> = {},
    U extends Partial<DefaultUIState> & Record<string, any> = {},
    E extends {} = {}
>(O: typeof BaseObject) => class extends O<D, S, I, O, A, P & DefaultObjectProps, U & DefaultUIState, E> {
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
    get env() {
        return super.env as Env;
    }
};
