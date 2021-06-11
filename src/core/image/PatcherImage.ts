import FileInstance from "../file/FileInstance";
import ImageFile from "./ImageFile";
import ImageEditor from "./ImageEditor";

export interface PatcherImageEventMap {}

export default class PatcherImage extends FileInstance<PatcherImageEventMap, ImageFile> {
    static async fromProjectItem(item: ImageFile) {
        return new this(item).init(item.data);
    }
    objectURL: string;
    async getEditor() {
        const editor = new ImageEditor(this);
        return editor.init();
    }
    async init(data?: ArrayBuffer) {
        if (data) this.objectURL = URL.createObjectURL(await new Response(data).blob());
        else this.objectURL = "";
        this._isReady = true;
        this.emit("ready");
        return this;
    }
    async serialize() {
        return (await fetch(this.objectURL)).arrayBuffer();
    }
    clone() {
        const patcherText = new PatcherImage(this.ctx);
        patcherText.objectURL = this.objectURL;
        return patcherText;
    }
}
