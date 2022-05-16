import TypedEventEmitter from "../../utils/TypedEventEmitter";
import { getTimestamp } from "../../utils/utils";
import FileEditor, { FileEditorEventMap } from "./FileEditor";

export interface HistoryEventMap {
    "change": IHistoryEvent<any>;
}

export interface IHistoryEvent<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> {
    timestamp: number;
    editorId?: string;
    fileId: string;
    eventName?: keyof EventMap & string;
    eventData?: EventMap[keyof EventMap & string];
    prevHistoryIndex: number;
    nextHistoryIndex: number;
}

export interface IHistoryData<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}> {
    /** Current index in the event queue */
    $: number;
    /** Queued events */
    eventQueue: IHistoryEvent<EventMap>[];
}

/** The class records some events and allows to perform undo/redo with a specific editor. */
export default abstract class History<EventMap extends Record<string, any> & Partial<FileEditorEventMap> = {}, Editor extends FileEditor<any, EventMap> = FileEditor<any, EventMap>> extends TypedEventEmitter<HistoryEventMap> {
    /** Editors to sync and to listen */
    editors: Set<Editor> = new Set();
    $ = 0;
    /** index of the save */
    $save = 0;
    eventQueue: IHistoryEvent<EventMap>[] = [];
    /** Another event queue including index changes. There's no going back here. */
    changes: IHistoryEvent<EventMap>[] = [];
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
    get fileId() {
        return this.firstEditor.file?.id;
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
            prevHistoryIndex: this.$,
            nextHistoryIndex: this.$ + 1
        };
        this.$ = this.eventQueue.push(event);
        this.emitChanged(event);
    };
    emitChanged(event: IHistoryEvent<EventMap>) {
        this.changes.push(event);
        this.emit("change", event);
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
        if (!passive) this.emitChanged({ prevHistoryIndex: this.$ + 1, nextHistoryIndex: this.$, timestamp: this.now, fileId: this.fileId });
    }
    abstract redoOf(editor: Editor, eventName: keyof EventMap, eventData?: any): Promise<void>;
    async redo(passive = false, ...editors: Editor[]) {
        if (!this.isRedoable) return;
        this.capture = false;
        const { eventName, eventData } = this.eventQueue[this.$];
        await Promise.all((editors.length ? editors : Array.from(this.editors)).map(editor => this.redoOf(editor, eventName, eventData)));
        this.$++;
        this.capture = true;
        if (!passive) this.emitChanged({ prevHistoryIndex: this.$ - 1, nextHistoryIndex: this.$, timestamp: this.now, fileId: this.fileId });
    }
    /** event at index exclusive */
    async undoUntil($: number, passive = false, ...editors: Editor[]) {
        while (this.isUndoable && $ < this.$) {
            await this.undo(passive, ...editors);
        }
    }
    /** event at timestamp inclusive */
    async redoUntil($: number, passive = false, ...editors: Editor[]) {
        while (this.isRedoable && $ > this.$) {
            await this.redo(passive, ...editors);
        }
    }
    async setIndex($: number, passive = false) {
        if ($ < this.$) await this.undoUntil($, passive);
        else if ($ > this.$) await this.redoUntil($, passive);
    }
    getSyncData()/* : IHistoryData<EventMap> */ {
        // const { $, eventQueue } = this;
        // return { $, eventQueue };
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
    async mergeChanges(...changes: IHistoryEvent<EventMap>[]) {
        if (!changes.length) return;
        const sortedChanges = changes.filter(e => e.fileId === this.fileId).sort((a, b) => a.timestamp - b.timestamp);
        if (!sortedChanges.length) return;
        const t0 = sortedChanges[0].timestamp;
        let $change = this.changes.length;
        while ($change && this.changes[$change - 1].timestamp > t0) {
            $change--;
        }
        const unmerge = this.changes.splice($change);
        await this.unmergeChanges(...unmerge);
        for (const change of sortedChanges) {
            const { nextHistoryIndex: $, prevHistoryIndex: $prev, eventData } = change;
            if (eventData) {
                if (this.$ !== $prev) await this.setIndex($prev, true);
                this.eventQueue.splice($prev);
                this.eventQueue.push(change);
                await this.setIndex($, true);
            }
            await this.setIndex($, true);
            this.changes.push(change);
        }
    }
    async unmergeChanges(...changes: IHistoryEvent<EventMap>[]) {
        if (!changes.length) return;
        const sortedChanges = changes.filter(e => e.fileId === this.fileId).sort((a, b) => a.timestamp - b.timestamp);
        if (!sortedChanges.length) return;
        let $change = changes.length - 1;
        this.capture = false;
        while ($change >= 0) {
            const { eventName, eventData, prevHistoryIndex, timestamp } = changes[$change];
            if (eventData) {
                await Promise.all((Array.from(this.editors)).map(editor => this.undoOf(editor, eventName, eventData)));
                this.$ = prevHistoryIndex;
                const i = this.eventQueue.findIndex(e => e.timestamp === timestamp);
                if (i >= 0) this.eventQueue.splice(i);
            } else {
                await this.setIndex(prevHistoryIndex, true);
            }
            const i = this.changes.findIndex(e => e.timestamp === timestamp);
            if (i >= 0) this.changes.splice(i, 1);
            $change--;
        }
        this.capture = true;
    }
}
