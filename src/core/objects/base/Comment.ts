import BaseObject from "./BaseObject";
import type { IArgsMeta, IPropsMeta } from "./AbstractObject";
import type { CommentUIState } from "./CommentUI";

export interface CommentProps {
    bgColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    fontStyle: "normal" | "italic" | "oblique";
    fontWeight: "normal" | "bold" | "lighter" | "bolder" | number;
    textAlign: "center" | "left" | "right";
    textDecoration: "none" | "underline" | "overline" | "line-through";
}

export default class comment extends BaseObject<{ value: string }, {}, [string], [], [string], CommentProps, CommentUIState> {
    static description = "Text Comment";
    static docs: string = "common/docs/Comment.html";
    static args: IArgsMeta = [{
        type: "string",
        optional: true,
        varLength: true,
        description: "Initial text"
    }];
    static props: IPropsMeta<CommentProps> = {
        bgColor: {
            type: "color",
            default: "transparent",
            description: "Background color",
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
        },
        textDecoration: {
            type: "enum",
            enums: ["none", "underline", "overline", "line-through"],
            default: "none",
            description: "Text decoration",
            isUIState: true
        }
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("updateArgs", (args) => {
            if (!this.data.hasOwnProperty("value")) this.setData({ value: args.join(" ") });
        });
        this.on("inlet", ({ data, inlet }) => {
            if (typeof data === "string") {
                this.setData({ value: data });
                this.updateUI({ value: data });
            }
        });
    }
}
