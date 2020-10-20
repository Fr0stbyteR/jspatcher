import FileInstance from "../file/FileInstance";

export interface PatcherTextEventMap {
    "changed": { text: string, oldText: string };
}

export default class PatcherText extends FileInstance<PatcherTextEventMap> {
    text: string;
    async init(data: ArrayBuffer) {
        this.text = await new Response(data).text();
    }
    async serialize() {
        return new Blob([this.text]).arrayBuffer();
    }
    clone() {
        const patcherText = new PatcherText();
        patcherText.text = this.text;
        return patcherText;
    }
    setText(text: string) {
        this.text = text;
    }
}
