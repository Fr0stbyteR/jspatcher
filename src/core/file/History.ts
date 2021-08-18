import FileEditor, { FileEditorEventMap } from "./FileEditor";

interface IHistoryEvent<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> {
    timestamp: number;
    editorId: string;
    eventName: keyof EventMap & string;
    eventData?: EventMap[keyof EventMap & string];
}

export interface IHistoryData<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> {
    /** Current index in the event queue */
    $: number;
    /** Last save Timestamp */
    saveTime: number;
    /** Queued events */
    eventQueue: IHistoryEvent<EventMap>[];
}

/** The class records some events and allows to perform undo/redo with a specific editor. */
export default abstract class History<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}, Editor extends FileEditor<any, EventMap> = FileEditor<any, EventMap>> implements IHistoryData<EventMap> {
    /** Editors to sync and to listen */
    editors: Set<Editor> = new Set();
    saveTime = 0;
    $ = 0;
    eventQueue: IHistoryEvent<EventMap>[] = [];
    /** Can be set to `false` to prevent recording events while undoing/redoing */
    capture = true;
    get eventListening(): (keyof EventMap & string)[] {
        return [];
    }
    get now() {
        if (globalThis.performance) {
            return performance.now() + (performance.timeOrigin || performance.timing.navigationStart);
        }
        return Date.now();
    }
    addEditor(editor: Editor) {
        this.editors.add(editor);
        editor.onAny(this.handleEditorEvent);
        editor.on("saved", this.handleSaved);
        editor.once("destroy", () => this.removeEditor(editor));
    }
    removeEditor(editor: Editor) {
        editor.offAny(this.handleEditorEvent);
        this.editors.delete(editor);
    }
    handleEditorEvent = async (eventName: keyof EventMap & string, eventData: any, editor: Editor) => {
        if (this.eventListening.indexOf(eventName) === -1) return;
        if (!this.capture) return;
        this.capture = false;
        await Promise.all(Array.from(this.editors).filter($editor => $editor !== editor).map($editor => $editor.emit(eventName, eventData)));
        this.capture = true;
        this.eventQueue.splice(this.$);
        this.$ = this.eventQueue.push({ eventName, eventData, timestamp: this.now, editorId: editor.editorId });
        this.emitChanged();
    };
    emitChanged() {
        this.editors.forEach(editor => editor.emit("changed"));
        this.emitDirty();
    }
    emitDirty() {
        const { isDirty } = this;
        this.editors.forEach(editor => editor.emit("dirty", isDirty));
    }
    destroy() {
        this.editors.forEach(editor => this.removeEditor(editor));
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
    abstract undoOf(editor: Editor, eventName: keyof EventMap, eventData?: any): Promise<void>;
    async undo() {
        if (!this.editors.size) return;
        if (!this.isUndoable) return;
        this.capture = false;
        const { eventName, eventData } = this.eventQueue[this.$ - 1];
        await Promise.all(Array.from(this.editors).map(editor => this.undoOf(editor, eventName, eventData)));
        this.$--;
        this.capture = true;
        this.emitChanged();
    }
    abstract redoOf(editor: Editor, eventName: keyof EventMap, eventData?: any): Promise<void>;
    async redo() {
        if (!this.editors.size) return;
        if (!this.isRedoable) return;
        this.capture = false;
        const { eventName, eventData } = this.eventQueue[this.$];
        await Promise.all(Array.from(this.editors).map(editor => this.redoOf(editor, eventName, eventData)));
        this.$++;
        this.capture = true;
        this.emitChanged();
    }
    /** event at timestamp exclusive */
    async undoUntil(timestamp: number) {
        while (this.isUndoable && this.eventQueue[this.$ - 1].timestamp >= timestamp) {
            await this.undo();
        }
    }
    /** event at timestamp inclusive */
    async redoUntil(timestamp: number) {
        while (this.isRedoable && this.eventQueue[this.$].timestamp <= timestamp) {
            await this.redo();
        }
    }
    async setIndex($: number) {
        if ($ < this.$) await this.undoUntil(this.eventQueue[$].timestamp);
        else if ($ > this.$) await this.redoUntil(this.eventQueue[$ - 1].timestamp);
    }
    getSyncData(): IHistoryData<EventMap> {
        const { $, saveTime, eventQueue } = this;
        return { $, saveTime, eventQueue };
    }
    async syncData(data: IHistoryData<EventMap>) {
        this.saveTime = data.saveTime;
        for (let i = 0; i < this.eventQueue.length; i++) {
            const { timestamp } = this.eventQueue[i];
            if (timestamp !== data.eventQueue[i]?.timestamp) {
                await this.undoUntil(timestamp);
                break;
            }
        }
        this.eventQueue = data.eventQueue;
        await this.setIndex(data.$);
    }
}
