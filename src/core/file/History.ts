import FileEditor, { FileEditorEventMap } from "./FileEditor";

export default class History<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}, Editor extends FileEditor<any, EventMap> = FileEditor<any, EventMap>> {
    editor: Editor;
    saveTime = 0;
    undoMap: Record<number, { type: keyof EventMap; event: any }> = {};
    redoMap: Record<number, { type: keyof EventMap; event: any }> = {};
    get eventListening(): (keyof EventMap)[] {
        return [];
    }
    capture = true;
    constructor(editorIn: Editor) {
        this.editor = editorIn;
        this.eventListening.forEach(type => this.editor.on(type as keyof EventMap & string, event => this.did(type, event)));
        this.editor.on("saved", this.handleSaved);
    }
    did(type: keyof EventMap, event: any) {
        if (!this.capture) return;
        this.redoMap = {};
        this.undoMap[performance.now()] = { type, event };
        this.emitChanged();
    }
    emitChanged() {
        this.editor.emit("changed");
        this.emitDirty();
    }
    emitDirty() {
        this.editor.emit("dirty", this.isDirty);
    }
    destroy() {
        this.eventListening.forEach(type => this.editor.off(type as keyof EventMap & string, event => this.did(type, event)));
    }
    get isDirty() {
        if (!this.saveTime) return this.isUndoable;
        return this.saveTime !== Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
    }
    get isUndoable() {
        return !!Object.keys(this.undoMap).length;
    }
    get isRedoable() {
        return !!Object.keys(this.redoMap).length;
    }
    handleSaved = () => {
        const lastKey = Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
        this.saveTime = lastKey;
        this.emitDirty();
    };
    async undo() {
        throw new Error("Not implemented.");
    }
    async redo() {
        throw new Error("Not implemented.");
    }
    async undoUntil(timestamp: number) {
        const lastKey = Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
        while (lastKey > timestamp) {
            await this.undo();
        }
    }
    async redoUntil(timestamp: number) {
        const nextKey = Object.keys(this.redoMap).map(v => +v).sort((a, b) => a - b)[0];
        while (nextKey <= timestamp) {
            await this.redo();
        }
    }
}
