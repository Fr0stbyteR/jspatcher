import * as React from "react";
import UIObject from "./Base";
import { BaseUI, BaseUIState } from "../base/DOMUI";
import { isBang } from "../base/index.jspatpkg";
import type { IJSPatcherObjectMeta, IPropsMeta } from "../../types";
import type PatcherImage from "../../image/PatcherImage";
import type PersistentProjectFile from "../../file/PersistentProjectFile";

interface U extends P {
    url: string;
}
class ImgUI extends BaseUI<img, P, U> {
    static sizing: "horizontal" | "vertical" | "both" | "ratio" = "both";
    static defaultSize: [number, number] = [210, 90];
    state: U & BaseUIState = { ...this.state, url: this.object.state.url };
    render() {
        const { objectFit, objectPosition, scroll } = this.state;
        return (
            <BaseUI {...this.props}>
                <div style={{ position: "absolute", width: "100%", height: "100%", display: "block", overflow: "auto" }}>
                    <img src={this.state.url} style={{ position: "absolute", ...(scroll ? {} : { width: "100%", height: "100%" }), objectFit, objectPosition }} />
                </div>
            </BaseUI>
        );
    }
}

interface S {
    key: string;
    image: PatcherImage;
    file: PersistentProjectFile;
    url: string;
}
interface P {
    scroll: boolean;
    objectFit: "fill" | "cover" | "contain" | "none" | "scale-down";
    objectPosition: string;
}
export default class img extends UIObject<{}, S, [string | HTMLImageElement], [HTMLImageElement], [string], P, U> {
    static description = "Display an image";
    static inlets: IJSPatcherObjectMeta["inlets"] = [{
        isHot: true,
        type: "anything",
        description: "Image file name or url"
    }];
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: true,
        description: "Image file name or url"
    }];
    static props: IPropsMeta<P> = {
        scroll: {
            type: "boolean",
            default: false,
            description: "Allow overflow-scroll",
            isUIState: true
        },
        objectFit: {
            type: "enum",
            enums: ["fill", "cover", "contain", "none", "scale-down"],
            default: "contain",
            description: "CSS object-fit property",
            isUIState: true
        },
        objectPosition: {
            type: "string",
            default: "50% 50%",
            description: 'CSS object-position property, for example "50% 50%" or "left top"',
            isUIState: true
        }
    };
    static UI = ImgUI;
    state: S = { key: this.box.args[0]?.toString(), image: undefined, file: undefined, url: "" };
    subscribe() {
        super.subscribe();
        const handleFilePathChanged = () => {
            this.setState({ key: this.state.file?.projectPath });
        };
        const subsribeItem = async () => {
            const { image, file } = this.state;
            if (image) await image.addObserver(this);
            if (file) {
                file.on("destroyed", reload);
                file.on("nameChanged", handleFilePathChanged);
                file.on("pathChanged", handleFilePathChanged);
            }
        };
        const unsubscribeItem = async () => {
            const { image, file } = this.state;
            if (file) {
                file.off("destroyed", reload);
                file.off("nameChanged", handleFilePathChanged);
                file.off("pathChanged", handleFilePathChanged);
            }
            if (image) await image.removeObserver(this);
        };
        const reload = async () => {
            await unsubscribeItem();
            const { key } = this.state;
            let image: PatcherImage;
            let url: string;
            try {
                const { item } = await this.getSharedItem(key, "image");
                image = await item.instantiate(this.patcher.env, this.patcher.project) as PatcherImage;
                this.setState({ image, file: item });
                url = image.objectURL;
            } catch {
                url = key;
            } finally {
                this.setState({ url });
                this.updateUI({ url });
                await subsribeItem();
            }
        };
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("postInit", reload);
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "string") {
                const oldKey = this.state.key;
                const key = args[0]?.toString();
                this.setState({ key });
                if (key !== oldKey) reload();
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    if (typeof data === "string") {
                        this.setState({ key: data });
                        reload();
                    }
                }
            }
        });
        this.on("destroy", unsubscribeItem);
    }
}
