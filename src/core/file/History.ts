import FileInstance, { FileInstanceEventMap } from "./FileInstance";

export default class History<EventMap extends Record<string, any> & Partial<FileInstanceEventMap> = {}> {
    instance: FileInstance<EventMap>;
    saveTime = 0;
    undoMap: Record<number, { type: keyof EventMap; event: any }> = {};
    redoMap: Record<number, { type: keyof EventMap; event: any }> = {};
    eventListening: (keyof EventMap)[] = [];
    capture = true;
    constructor(instanceIn: FileInstance<EventMap>) {
        this.instance = instanceIn;
        this.eventListening.forEach(type => this.instance.on(type as Extract<keyof EventMap, string>, event => this.did(type, event)));
        this.instance.on("saved", this.handleSaved);
    }
    did(type: keyof EventMap, event: any) {
        if (!this.capture) return;
        this.redoMap = {};
        this.undoMap[performance.now()] = { type, event };
        this.emitChanged();
    }
    emitChanged() {
        this.instance.emit("changed");
        this.emitDirty();
    }
    emitDirty() {
        this.instance.emit("dirty", this.isDirty);
    }
    destroy() {
        this.eventListening.forEach(type => this.instance.off(type as Extract<keyof EventMap, string>, event => this.did(type, event)));
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
