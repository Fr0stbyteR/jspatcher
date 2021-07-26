import History from "../file/History";
import AudioEditor, { AudioHistoryEventMap } from "./AudioEditor";

export default class AudioHistory extends History<AudioHistoryEventMap, AudioEditor> {
    get eventListening(): (keyof AudioHistoryEventMap)[] {
        return ["faded", "fadedIn", "fadedOut", "cutEnd", "pasted", "deleted", "silenced", "insertedSilence", "reversed", "inversed", "resampled", "remixed", "recorded"];
    }
    async undoOf(editor: AudioEditor, eventName: keyof AudioHistoryEventMap, eventData?: any) {
        if (eventName === "faded") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [selStart, selEnd], oldAudio } = e;
            await editor.instance.pasteToRange(oldAudio, selStart, selEnd);
        } else if (eventName === "fadedIn") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { length, oldAudio } = e;
            await editor.instance.pasteToRange(oldAudio, 0, length);
        } else if (eventName === "fadedOut") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { length, oldAudio } = e;
            const l = editor.instance.audioBuffer.length;
            await editor.instance.pasteToRange(oldAudio, l - length, l);
        } else if (eventName === "cutEnd") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [cursor], oldAudio } = e;
            await editor.instance.insertToCursor(oldAudio, cursor);
        } else if (eventName === "pasted") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                await editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
            } else {
                await editor.instance.removeFromRange(cursor, cursor + audio.length);
            }
        } else if (eventName === "deleted") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [cursor], oldAudio } = e;
            await editor.instance.insertToCursor(oldAudio, cursor);
        } else if (eventName === "silenced") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [from, to], oldAudio } = e;
            await editor.instance.pasteToRange(oldAudio, from, to);
        } else if (eventName === "insertedSilence") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [from, to] } = e;
            await editor.instance.removeFromRange(from, to);
        } else if (eventName === "reversed") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [from, to], oldAudio } = e;
            await editor.instance.pasteToRange(oldAudio, from, to);
        } else if (eventName === "inversed") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [from, to], oldAudio } = e;
            await editor.instance.pasteToRange(oldAudio, from, to);
        } else if (eventName === "resampled") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { oldAudio } = e;
            editor.instance.setAudio(oldAudio);
        } else if (eventName === "remixed") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { oldAudio } = e;
            editor.instance.setAudio(oldAudio);
        } else if (eventName === "recorded") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                await editor.instance.pasteToRange(oldAudio, range[0], range[0] + audio.length);
            } else {
                await editor.instance.removeFromRange(cursor, cursor + audio.length);
            }
        }
    }
    async redoOf(editor: AudioEditor, eventName: keyof AudioHistoryEventMap, eventData?: any) {
        if (eventName === "faded") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [selStart, selEnd], audio } = e;
            await editor.instance.pasteToRange(audio, selStart, selEnd);
        } else if (eventName === "fadedIn") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { length, audio } = e;
            await editor.instance.pasteToRange(audio, 0, length);
        } else if (eventName === "fadedOut") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { length, audio } = e;
            const l = audio.length;
            await editor.instance.pasteToRange(audio, l - length, l);
        } else if (eventName === "cutEnd") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [selStart, selEnd] } = e;
            await editor.instance.removeFromRange(selStart, selEnd);
        } else if (eventName === "pasted") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                await editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
            } else {
                await editor.instance.insertToCursor(audio, cursor);
            }
        } else if (eventName === "deleted") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [selStart, selEnd] } = e;
            await editor.instance.removeFromRange(selStart, selEnd);
        } else if (eventName === "silenced") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [from, to], audio } = e;
            await editor.instance.pasteToRange(audio, from, to);
        } else if (eventName === "insertedSilence") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [cursor], audio } = e;
            await editor.instance.insertToCursor(audio, cursor);
        } else if (eventName === "reversed") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [from, to], audio } = e;
            await editor.instance.pasteToRange(audio, from, to);
        } else if (eventName === "inversed") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range: [from, to], audio } = e;
            await editor.instance.pasteToRange(audio, from, to);
        } else if (eventName === "resampled") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { audio } = e;
            editor.instance.setAudio(audio);
        } else if (eventName === "remixed") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { audio } = e;
            editor.instance.setAudio(audio);
        } else if (eventName === "recorded") {
            const e: AudioHistoryEventMap[typeof eventName] = eventData;
            const { range, cursor, audio, oldAudio } = e;
            if (range) {
                await editor.instance.pasteToRange(audio, range[0], range[0] + oldAudio.length);
            } else {
                await editor.instance.insertToCursor(audio, cursor);
            }
        }
    }
}
