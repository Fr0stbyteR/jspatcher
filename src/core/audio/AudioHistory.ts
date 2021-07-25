import History from "../file/History";
import AudioEditor, { AudioEditorEventMap } from "./AudioEditor";

export default class AudioHistory extends History<AudioEditorEventMap, AudioEditor> {
    editor: AudioEditor = this.editor;
    get eventListening(): (keyof AudioEditorEventMap)[] {
        return ["faded", "fadedIn", "fadedOut", "cutEnd", "pasted", "deleted", "silenced", "insertedSilence", "resampled", "remixed", "recorded"];
    }
    async undo() {
        super.undo(async (eventName, eventData) => {
            if (eventName === "faded") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [selStart, selEnd], oldAudio } = e;
                await this.editor.instance.pasteToRange(oldAudio, selStart, selEnd);
            } else if (eventName === "fadedIn") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { length, oldAudio } = e;
                await this.editor.instance.pasteToRange(oldAudio, 0, length);
            } else if (eventName === "fadedOut") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { length, oldAudio } = e;
                const l = this.editor.instance.audioBuffer.length;
                await this.editor.instance.pasteToRange(oldAudio, l - length, l);
            } else if (eventName === "cutEnd") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [cursor], oldAudio } = e;
                await this.editor.instance.insertToCursor(oldAudio, cursor);
            } else if (eventName === "pasted") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range, cursor, audio, oldAudio } = e;
                if (range) {
                    await this.editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
                } else {
                    await this.editor.instance.removeFromRange(cursor, cursor + audio.length);
                }
            } else if (eventName === "deleted") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [cursor], oldAudio } = e;
                await this.editor.instance.insertToCursor(oldAudio, cursor);
            } else if (eventName === "silenced") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [from, to], oldAudio } = e;
                await this.editor.instance.pasteToRange(oldAudio, from, to);
            } else if (eventName === "insertedSilence") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [from, to] } = e;
                await this.editor.instance.removeFromRange(from, to);
            } else if (eventName === "reversed") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [from, to], oldAudio } = e;
                await this.editor.instance.pasteToRange(oldAudio, from, to);
            } else if (eventName === "inversed") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [from, to], oldAudio } = e;
                await this.editor.instance.pasteToRange(oldAudio, from, to);
            } else if (eventName === "resampled") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { oldAudio } = e;
                this.editor.instance.setAudio(oldAudio);
            } else if (eventName === "remixed") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { oldAudio } = e;
                this.editor.instance.setAudio(oldAudio);
            } else if (eventName === "recorded") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range, cursor, audio, oldAudio } = e;
                if (range) {
                    await this.editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
                } else {
                    await this.editor.instance.removeFromRange(cursor, cursor + audio.length);
                }
            }
        });
    }
    async redo() {
        super.redo(async (eventName, eventData) => {
            if (eventName === "faded") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [selStart, selEnd], audio } = e;
                await this.editor.instance.pasteToRange(audio, selStart, selEnd);
            } else if (eventName === "fadedIn") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { length, audio } = e;
                await this.editor.instance.pasteToRange(audio, 0, length);
            } else if (eventName === "fadedOut") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { length, audio } = e;
                const l = audio.length;
                await this.editor.instance.pasteToRange(audio, l - length, l);
            } else if (eventName === "cutEnd") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [selStart, selEnd] } = e;
                await this.editor.instance.removeFromRange(selStart, selEnd);
            } else if (eventName === "pasted") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range, cursor, audio, oldAudio } = e;
                if (range) {
                    await this.editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
                } else {
                    await this.editor.instance.insertToCursor(audio, cursor);
                }
            } else if (eventName === "deleted") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [selStart, selEnd] } = e;
                await this.editor.instance.removeFromRange(selStart, selEnd);
            } else if (eventName === "silenced") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [from, to], audio } = e;
                await this.editor.instance.pasteToRange(audio, from, to);
            } else if (eventName === "insertedSilence") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [cursor], audio } = e;
                await this.editor.instance.insertToCursor(audio, cursor);
            } else if (eventName === "reversed") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [from, to], audio } = e;
                await this.editor.instance.pasteToRange(audio, from, to);
            } else if (eventName === "inversed") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range: [from, to], audio } = e;
                await this.editor.instance.pasteToRange(audio, from, to);
            } else if (eventName === "resampled") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { audio } = e;
                this.editor.instance.setAudio(audio);
            } else if (eventName === "remixed") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { audio } = e;
                this.editor.instance.setAudio(audio);
            } else if (eventName === "recorded") {
                const e: AudioEditorEventMap[typeof eventName] = eventData;
                const { range, cursor, audio, oldAudio } = e;
                if (range) {
                    await this.editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
                } else {
                    await this.editor.instance.insertToCursor(audio, cursor);
                }
            }
        });
    }
}
