import History from "../file/History";
import AudioEditor, { AudioEditorEventMap } from "./AudioEditor";

export default class AudioHistory extends History<AudioEditorEventMap, AudioEditor> {
    editor: AudioEditor = this.editor;
    get eventListening(): (keyof AudioEditorEventMap)[] {
        return ["faded", "fadedIn", "fadedOut", "cutEnd", "pasted", "deleted", "silenced", "insertedSilence", "resampled", "remixed", "recorded"];
    }
    async undo() {
        if (!this.editor) return;
        if (!this.isUndoable) return;
        const lastKey = Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
        const { type, event } = this.undoMap[lastKey];
        if (type === "faded") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [selStart, selEnd], oldAudio } = e;
            await this.editor.instance.pasteToRange(oldAudio, selStart, selEnd);
        } else if (type === "fadedIn") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { length, oldAudio } = e;
            await this.editor.instance.pasteToRange(oldAudio, 0, length);
        } else if (type === "fadedOut") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { length, oldAudio } = e;
            const l = this.editor.instance.audioBuffer.length;
            await this.editor.instance.pasteToRange(oldAudio, l - length, l);
        } else if (type === "cutEnd") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [cursor], oldAudio } = e;
            await this.editor.instance.insertToCursor(oldAudio, cursor);
        } else if (type === "pasted") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                await this.editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
            } else {
                await this.editor.instance.removeFromRange(cursor, cursor + audio.length);
            }
        } else if (type === "deleted") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [cursor], oldAudio } = e;
            await this.editor.instance.insertToCursor(oldAudio, cursor);
        } else if (type === "silenced") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [from, to], oldAudio } = e;
            await this.editor.instance.pasteToRange(oldAudio, from, to);
        } else if (type === "insertedSilence") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [from, to] } = e;
            await this.editor.instance.removeFromRange(from, to);
        } else if (type === "reversed") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [from, to], oldAudio } = e;
            await this.editor.instance.pasteToRange(oldAudio, from, to);
        } else if (type === "inversed") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [from, to], oldAudio } = e;
            await this.editor.instance.pasteToRange(oldAudio, from, to);
        } else if (type === "resampled") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { oldAudio } = e;
            this.editor.instance.setAudio(oldAudio);
        } else if (type === "remixed") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { oldAudio } = e;
            this.editor.instance.setAudio(oldAudio);
        } else if (type === "recorded") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                await this.editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
            } else {
                await this.editor.instance.removeFromRange(cursor, cursor + audio.length);
            }
        }
        this.redoMap[lastKey] = this.undoMap[lastKey];
        delete this.undoMap[lastKey];
        this.emitChanged();
    }
    async redo() {
        if (!this.editor) return;
        if (!this.isRedoable) return;
        const nextKey = Object.keys(this.redoMap).map(v => +v).sort((a, b) => a - b)[0];
        const { type, event } = this.redoMap[nextKey];
        if (type === "faded") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [selStart, selEnd], audio } = e;
            await this.editor.instance.pasteToRange(audio, selStart, selEnd);
        } else if (type === "fadedIn") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { length, audio } = e;
            await this.editor.instance.pasteToRange(audio, 0, length);
        } else if (type === "fadedOut") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { length, audio } = e;
            const l = audio.length;
            await this.editor.instance.pasteToRange(audio, l - length, l);
        } else if (type === "cutEnd") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [selStart, selEnd] } = e;
            await this.editor.instance.removeFromRange(selStart, selEnd);
        } else if (type === "pasted") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                await this.editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
            } else {
                await this.editor.instance.insertToCursor(audio, cursor);
            }
        } else if (type === "deleted") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [selStart, selEnd] } = e;
            await this.editor.instance.removeFromRange(selStart, selEnd);
        } else if (type === "silenced") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [from, to], audio } = e;
            await this.editor.instance.pasteToRange(audio, from, to);
        } else if (type === "insertedSilence") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [cursor], audio } = e;
            await this.editor.instance.insertToCursor(audio, cursor);
        } else if (type === "reversed") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [from, to], audio } = e;
            await this.editor.instance.pasteToRange(audio, from, to);
        } else if (type === "inversed") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range: [from, to], audio } = e;
            await this.editor.instance.pasteToRange(audio, from, to);
        } else if (type === "resampled") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { audio } = e;
            this.editor.instance.setAudio(audio);
        } else if (type === "remixed") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { audio } = e;
            this.editor.instance.setAudio(audio);
        } else if (type === "recorded") {
            const e: AudioEditorEventMap[typeof type] = event;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                await this.editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
            } else {
                await this.editor.instance.insertToCursor(audio, cursor);
            }
        }
        this.undoMap[nextKey] = this.redoMap[nextKey];
        delete this.redoMap[nextKey];
        this.emitChanged();
    }
}
