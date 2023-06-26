import type PersistentProjectFile from "../../../file/PersistentProjectFile";
import type PatcherImage from "../../../image/PatcherImage";
import type { IArgsMeta, IIosMeta, IPropsMeta } from "./AbstractHardwareObject";
import UIObject from "./UIObject";
import ImgUI, { ImgUIState } from "./ImageObjectUI";

interface IS {
    key: string;
    image: PatcherImage;
    file: PersistentProjectFile;
    url: string;
    element: HTMLImageElement;
    scale: number;
}

export interface ImgProps {
    scroll: boolean;
    objectFit: "fill" | "cover" | "contain" | "none" | "scale-down";
    objectPosition: string;
    opacity: number;
}

async function getImageDimensions(url: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
            reject(new Error(`Could not load image at ${url}`));
        };
        img.src = url;
    });
}

export default class ImageObject<
    D extends {} = {},
    S extends {} = {},
    IO extends any[] = any[],
    I extends any[] = any[],
    O extends any[] = any[],
    A extends [HTMLImageElement] & any[] = [HTMLImageElement],
    P extends ImgProps & {} = ImgProps,
    U extends ImgUIState & any = ImgUIState,
    E extends {} = {}
> extends UIObject<D, S, IO, I, O, A, P, U, E> {

    static description = "Display an image";
    // static inlets: IIosMeta = [{
    //     isHot: true,
    //     type: "anything",
    //     description: "Image file name or url"
    // }];
    // static args: IArgsMeta = [{
    //     type: "string",
    //     optional: true,
    //     description: "Image file name or url"
    // }];
    static props: IPropsMeta<ImgProps> = {
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
        },
        opacity: {
            type: "number",
            default: 1,
            description: "Opacity of the image (0-1)",
            isUIState: true
        }
    };
    static UI = ImgUI;
    _: IS = { key: this.box.args[0]?.toString(), image: undefined, file: undefined, url: "", element: undefined, scale: 1.0 };
    subscribe() {
        super.subscribe();
        const handleFilePathChanged = () => {
            this._.key = this._.file?.projectPath;
        };
        const subscribeItem = async () => {
            const { image, file } = this._;
            if (image) await image.addObserver(this);
            if (file) {
                file.on("destroyed", reload);
                file.on("nameChanged", handleFilePathChanged);
                file.on("pathChanged", handleFilePathChanged);
            }
        };
        const unsubscribeItem = async () => {
            const { image, file } = this._;
            if (file) {
                file.off("destroyed", reload);
                file.off("nameChanged", handleFilePathChanged);
                file.off("pathChanged", handleFilePathChanged);
            }
            if (image) await image.removeObserver(this);
        };
        const reload = async () => {
            await unsubscribeItem();
            const { key } = this._;
            let image: PatcherImage;
            let url: string;
            try {
                const { item } = await this.getSharedItem(key, "image");
                image = await item.instantiate({ env: this.patcher.env, project: this.patcher.project }) as PatcherImage;
                this._.image = image;
                this._.file = item;
                url = image.objectURL;
            } catch {
                url = key;
            } finally {
                this._.url = url;
                this.updateUI({ url });
                await subscribeItem();
            }
        };
        // this.on("preInit", () => {
        //     this.ios = [{ edge: 'T', position: 0.5 }];
        // });
        this.on("postInit", async () => {
            await reload();
            // console.log(this._.url);
            const { width, height } = await getImageDimensions(this._.url);
            this.box.setHeight(height * this._.scale || 100);
            this.box.setWidth(width * this._.scale || 100);
            this.patcher.changeIO();
        });
        // this.on("updateArgs", (args) => {
        //     if (typeof args[0] === "string") {
        //         const oldKey = this._.key;
        //         const key = args[0]?.toString();
        //         this._.key = key;
        //         if (key !== oldKey) reload();
        //     }
        // });
        // this.on("inlet", async ({ data, inlet }) => {
        //     if (inlet === 0) {
        //         if (isBang(data)) {
        //             this.outlet(0, this._.element);
        //         } else if (typeof data === "string") {
        //             this._.key = data;
        //             reload();
        //         } else if (typeof data === "object" && data instanceof HTMLImageElement) {
        //             this._.key = data.src;
        //             reload();
        //         }
        //     }
        // });
        this.on("destroy", () => { unsubscribeItem(); this.patcher.changeIO(); });
    }
}
