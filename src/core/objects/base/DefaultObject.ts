import DefaultUI, { DefaultUIState } from "./DefaultUI";
import BaseObject, { BaseObjectProps } from "./BaseObject";
import type { IPropsMeta } from "./AbstractObject";
import type Env from "../../Env";

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
export interface DefaultObjectProps extends DefaultObjectUIProps, BaseObjectProps { }
export default class DefaultObject<
    D extends {} = {},
    S extends {} = {},
    I extends any[] = any[],
    O extends any[] = any[],
    A extends any[] = any[],
    P extends Partial<DefaultObjectProps> & Record<string, any> = {},
    U extends Partial<DefaultUIState> & Record<string, any> = {},
    E extends {} = {}
> extends BaseObject<D, S, I, O, A, P & DefaultObjectProps, U & DefaultUIState, E> {
    static props: IPropsMeta = {
        bgColor: {
            type: "color",
            default: "rgb(41, 60, 71)",
            description: "Background color",
            isUIState: true
        },
        borderColor: {
            type: "color",
            default: "rgb(41, 60, 71)",
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
            enums: ["Lato", "Georgia", "Times New Roman", "Arial", "Tahoma", "Verdana", "Courier New", "Roboto Mono"],
            default: "Roboto Mono",
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
}
