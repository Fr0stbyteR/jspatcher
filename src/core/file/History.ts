import FileEditor, { FileEditorEventMap } from "./FileEditor";

/** The class records some events and allows to perform undo/redo with a specific editor. */
export default abstract class History<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}, Editor extends FileEditor<any, EventMap> = FileEditor<any, EventMap>> {
    /** Related editor */
    editor: Editor;
    /** Last save Timestamp */
    saveTime = 0;
    /** Current index in the event queue */
    $ = 0;
    eventQueue: { timestamp: number; eventName: keyof EventMap & string; eventData?: EventMap[keyof EventMap & string] }[] = [];
    /** Can be set to `false` to prevent recording events while undoing/redoing */
    capture = true;
    get eventListening(): (keyof EventMap & string)[] {
        return [];
    }
    get now() {
        if (globalThis.performance) {
            if ("timeOrigin" in performance) return performance.now() + performance.timeOrigin;
            return performance.now() + performance.timing.navigationStart;
        }
        return Date.now();
    }
    handleEditorEvent = ({ eventName, eventData }: { eventName: keyof EventMap & string; eventData?: any}) => {
        if (this.eventListening.indexOf(eventName) === -1) return;
        if (!this.capture) return;
        this.eventQueue.splice(this.$);
        this.$ = this.eventQueue.push({ eventName, eventData, timestamp: this.now });
        this.emitChanged();
    };
    constructor(editorIn: Editor) {
        this.editor = editorIn;
        this.editor.onAny(this.handleEditorEvent);
        this.editor.on("saved", this.handleSaved);
    }
    emitChanged() {
        this.editor.emit("changed");
        this.emitDirty();
    }
    emitDirty() {
        this.editor.emit("dirty", this.isDirty);
    }
    destroy() {
        this.editor.offAny(this.handleEditorEvent);
    }
    get isDirty() {
        if (!this.saveTime) return this.isUndoable;
        return this.saveTime !== this.eventQueue[this.$ - 1]?.timestamp;
    }
    get isUndoable() {
        return this.$ !== 0;
    }
    get isRedoable() {
        return this.$ !== this.eventQueue.length;
    }
    handleSaved = () => {
        this.saveTime = this.eventQueue[this.$ - 1]?.timestamp;
        this.emitDirty();
    };
    async undo(of?: (eventName: keyof EventMap & string, eventData?: any) => any) {
        if (!this.editor) return;
        if (!this.isUndoable) return;
        this.capture = false;
        const { eventName, eventData } = this.eventQueue[this.$ - 1];
        await of?.(eventName, eventData);
        this.$--;
        this.capture = true;
        this.emitChanged();
    }
    async redo(of?: (eventName: keyof EventMap & string, eventData?: any) => any) {
        if (!this.editor) return;
        if (!this.isRedoable) return;
        this.capture = false;
        const { eventName, eventData } = this.eventQueue[this.$];
        await of?.(eventName, eventData);
        this.$++;
        this.capture = true;
        this.emitChanged();
    }
    /** event at timestamp exclusive */
    async undoUntil(timestamp: number) {
        while (this.isUndoable && this.eventQueue[this.$ - 1].timestamp > timestamp) {
            await this.undo();
        }
    }
    /** event at timestamp inclusive */
    async redoUntil(timestamp: number) {
        while (this.isRedoable && this.eventQueue[this.$].timestamp <= timestamp) {
            await this.redo();
        }
    }
}
