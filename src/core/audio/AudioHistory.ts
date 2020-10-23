import History from "../file/History";
import PatcherAudio, { PatcherAudioEventMap } from "./PatcherAudio";

export default class AudioHistory extends History<PatcherAudioEventMap> {
    instance: PatcherAudio;
    eventListening: (keyof PatcherAudioEventMap)[] = ["faded", "fadedIn", "fadedOut", "cutEnd", "pasted", "deleted", "silenced", "insertedSilence", "resampled", "remixed", "recorded"];
    async undo() {
        if (!this.instance) return;
        if (!this.isUndoable) return;
        const lastKey = Object.keys(this.undoMap).map(v => +v).sort((a, b) => b - a)[0];
        const { type, event } = this.undoMap[lastKey];
        if (type === "faded") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [selStart, selEnd], oldAudio } = e;
            this.instance.pasteToRange(oldAudio, selStart, selEnd);
        } else if (type === "fadedIn") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { length, oldAudio } = e;
            this.instance.pasteToRange(oldAudio, 0, length);
        } else if (type === "fadedOut") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { length, oldAudio } = e;
            const l = this.instance.audioBuffer.length;
            this.instance.pasteToRange(oldAudio, l - length, l);
        } else if (type === "cutEnd") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [cursor], oldAudio } = e;
            this.instance.insertToCursor(oldAudio, cursor);
        } else if (type === "pasted") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                this.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
            } else {
                this.instance.removeFromRange(cursor, cursor + audio.length);
            }
        } else if (type === "deleted") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [cursor], oldAudio } = e;
            this.instance.insertToCursor(oldAudio, cursor);
        } else if (type === "silenced") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [from, to], oldAudio } = e;
            this.instance.pasteToRange(oldAudio, from, to);
        } else if (type === "insertedSilence") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [from, to] } = e;
            this.instance.removeFromRange(from, to);
        } else if (type === "reversed") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [from, to], oldAudio } = e;
            this.instance.pasteToRange(oldAudio, from, to);
        } else if (type === "inversed") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [from, to], oldAudio } = e;
            this.instance.pasteToRange(oldAudio, from, to);
        } else if (type === "resampled") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { oldAudio } = e;
            this.instance.setAudio(oldAudio);
        } else if (type === "remixed") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { oldAudio } = e;
            this.instance.setAudio(oldAudio);
        } else if (type === "recorded") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                this.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
            } else {
                this.instance.removeFromRange(cursor, cursor + audio.length);
            }
        }
        this.redoMap[lastKey] = this.undoMap[lastKey];
        delete this.undoMap[lastKey];
        this.emitChanged();
    }
    async redo() {
        if (!this.instance) return;
        if (!this.isRedoable) return;
        const nextKey = Object.keys(this.redoMap).map(v => +v).sort((a, b) => a - b)[0];
        const { type, event } = this.redoMap[nextKey];
        if (type === "faded") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [selStart, selEnd], audio } = e;
            this.instance.pasteToRange(audio, selStart, selEnd);
        } else if (type === "fadedIn") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { length, audio } = e;
            this.instance.pasteToRange(audio, 0, length);
        } else if (type === "fadedOut") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { length, audio } = e;
            const l = audio.length;
            this.instance.pasteToRange(audio, l - length, l);
        } else if (type === "cutEnd") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [selStart, selEnd] } = e;
            this.instance.removeFromRange(selStart, selEnd);
        } else if (type === "pasted") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                this.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
            } else {
                this.instance.insertToCursor(audio, cursor);
            }
        } else if (type === "deleted") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [selStart, selEnd] } = e;
            this.instance.removeFromRange(selStart, selEnd);
        } else if (type === "silenced") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [from, to], audio } = e;
            this.instance.pasteToRange(audio, from, to);
        } else if (type === "insertedSilence") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [cursor], audio } = e;
            this.instance.insertToCursor(audio, cursor);
        } else if (type === "reversed") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [from, to], audio } = e;
            this.instance.pasteToRange(audio, from, to);
        } else if (type === "inversed") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range: [from, to], audio } = e;
            this.instance.pasteToRange(audio, from, to);
        } else if (type === "resampled") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { audio } = e;
            this.instance.setAudio(audio);
        } else if (type === "remixed") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { audio } = e;
            this.instance.setAudio(audio);
        } else if (type === "recorded") {
            const e: PatcherAudioEventMap[typeof type] = event;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                this.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
            } else {
                this.instance.insertToCursor(audio, cursor);
            }
        }
        this.undoMap[nextKey] = this.redoMap[nextKey];
        delete this.redoMap[nextKey];
        this.emitChanged();
    }
}
