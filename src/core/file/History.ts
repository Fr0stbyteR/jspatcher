import TypedEventEmitter from "../../utils/TypedEventEmitter";
import { getTimestamp } from "../../utils/utils";
import FileEditor, { FileEditorEventMap } from "./FileEditor";

export interface HistoryEventMap {
    "change": IHistoryEvent<any>;
}

export interface IHistoryEvent<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> {
    timestamp: number;
    editorId: string;
    fileId: string;
    eventName?: keyof EventMap & string;
    eventData?: EventMap[keyof EventMap & string];
    currentHistoryIndex: number;
}

export interface IHistoryData<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> {
    /** Current index in the event queue */
    $: number;
    /** Queued events */
    eventQueue: IHistoryEvent<EventMap>[];
}

/** The class records some events and allows to perform undo/redo with a specific editor. */
export default abstract class History<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}, Editor extends FileEditor<any, EventMap> = FileEditor<any, EventMap>> extends TypedEventEmitter<HistoryEventMap> implements IHistoryData<EventMap> {
    /** Editors to sync and to listen */
    editors: Set<Editor> = new Set();
    $ = 0;
    /** index of the save */
    $save = 0;
    eventQueue: IHistoryEvent<EventMap>[] = [];
    /** Can be set to `false` to prevent recording events while undoing/redoing */
    capture = true;
    get eventListening(): (keyof EventMap & string)[] {
        return [];
    }
    get now() {
        return getTimestamp();
    }
    get firstEditor(): Editor {
        return this.editors.values().next().value;
    }

    addEditor(editor: Editor) {
        this.editors.add(editor);
        editor.onAny(this.handleEditorEvent);
        editor.on("saved", this.handleSaved);
        editor.once("destroy", () => this.removeEditor(editor));
        editor.once("ready", async () => {
            const { $ } = this;
            this.$ = 0;
            if ($) await this.redoUntil(this.eventQueue[$ - 1].timestamp);
        });
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
        const event: IHistoryEvent<EventMap> = {
            eventName,
            eventData,
            timestamp: this.now,
            editorId: editor.editorId,
            fileId: editor.file?.id,
            currentHistoryIndex: this.eventQueue.length
        };
        this.$ = this.eventQueue.push(event);
        this.emitChanged(event);
    };
    emitChanged(event?: IHistoryEvent<EventMap>) {
        if (event) this.emit("change", event);
        else this.emit("change", { currentHistoryIndex: this.$, timestamp: this.now, editorId: this.firstEditor.editorId, fileId: this.firstEditor.file?.id });
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
        return this.$save !== this.$;
    }
    get isUndoable() {
        return this.$ !== 0;
    }
    get isRedoable() {
        return this.$ !== this.eventQueue.length;
    }
    handleSaved = () => {
        this.$save = this.$;
        this.emitDirty();
    };
    abstract undoOf(editor: Editor, eventName: keyof EventMap, eventData?: any): Promise<void>;
    async undo(passive = false, ...editors: Editor[]) {
        if (!this.isUndoable) return;
        this.capture = false;
        const { eventName, eventData } = this.eventQueue[this.$ - 1];
        await Promise.all((editors.length ? editors : Array.from(this.editors)).map(editor => this.undoOf(editor, eventName, eventData)));
        this.$--;
        this.capture = true;
        if (!passive) this.emitChanged();
    }
    abstract redoOf(editor: Editor, eventName: keyof EventMap, eventData?: any): Promise<void>;
    async redo(passive = false, ...editors: Editor[]) {
        if (!this.isRedoable) return;
        this.capture = false;
        const { eventName, eventData } = this.eventQueue[this.$];
        await Promise.all((editors.length ? editors : Array.from(this.editors)).map(editor => this.redoOf(editor, eventName, eventData)));
        this.$++;
        this.capture = true;
        if (!passive) this.emitChanged();
    }
    /** event at timestamp exclusive */
    async undoUntil(timestamp: number, passive = false, ...editors: Editor[]) {
        while (this.isUndoable && this.eventQueue[this.$ - 1].timestamp >= timestamp) {
            await this.undo(passive, ...editors);
        }
    }
    /** event at timestamp inclusive */
    async redoUntil(timestamp: number, passive = false, ...editors: Editor[]) {
        while (this.isRedoable && this.eventQueue[this.$].timestamp <= timestamp) {
            await this.redo(passive, ...editors);
        }
    }
    async setIndex($: number, passive = false) {
        if ($ < this.$) await this.undoUntil(this.eventQueue[$].timestamp, passive);
        else if ($ > this.$) await this.redoUntil(this.eventQueue[$ - 1].timestamp, passive);
    }
    getSyncData(): IHistoryData<EventMap> {
        const { $, eventQueue } = this;
        return { $, eventQueue };
    }
    async syncData(data: IHistoryData<EventMap>) {
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
    async mergeEvents(...events: IHistoryEvent<EventMap>[]) {
        if (!events.length) return;
        const sortedEvents = events.sort((a, b) => a.timestamp - b.timestamp);
        for (const event of sortedEvents) {
            const $ = event.currentHistoryIndex;
            if (event.eventData) {
                this.setIndex($ - 1, true);
                this.eventQueue.splice(this.$ - 1);
                this.eventQueue.push(event.eventData);
                this.setIndex($, true);
            } else {
                this.setIndex($, true);
            }
        }
    }
}
