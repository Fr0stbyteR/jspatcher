import History from "../file/History";
import PatcherEditor, { PatcherHistoryEventMap } from "./PatcherEditor";

export default class PatcherHistory extends History<PatcherHistoryEventMap, PatcherEditor> {
    get eventListening(): (keyof PatcherHistoryEventMap)[] {
        return [
            "create", "delete", "changeBoxText", "boxChanged",
            "changeLineSrc", "changeLineDest", "moved", "resized", "propsChanged"
        ];
    }
    async undoOf(editor: PatcherEditor, eventName: keyof PatcherHistoryEventMap, eventData?: any) {
        if (eventName === "delete") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            await editor.create(e);
        } else if (eventName === "changeBoxText") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { boxId, oldText } = e;
            await editor.instance.changeBoxText(boxId, oldText);
        } else if (eventName === "boxChanged") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { boxId, oldArgs, oldProps, oldState } = e;
            await editor.changeBox(boxId, { args: oldArgs, props: oldProps, state: oldState });
        } else if (eventName === "moved") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { selected, delta, presentation } = e;
            const d = { x: -1 * delta.x, y: -1 * delta.y };
            editor.move(selected, d, presentation);
            editor.moveEnd(d);
        } else if (eventName === "changeLineSrc") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { lineId, oldSrc } = e;
            editor.changeLineSrc(lineId, oldSrc[0], oldSrc[1]);
        } else if (eventName === "changeLineDest") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { lineId, oldDest } = e;
            editor.changeLineDest(lineId, oldDest[0], oldDest[1]);
        } else if (eventName === "create") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            await editor.delete(e);
        } else if (eventName === "resized") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { selected, delta, type: t, presentation } = e;
            const d = { x: -1 * delta.x, y: -1 * delta.y };
            editor.resize(selected, d, t, presentation);
            editor.resizeEnd(d, t);
        } else if (eventName === "propsChanged") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            editor.instance.setProps(e.oldProps);
        }
    }
    async redoOf(editor: PatcherEditor, eventName: keyof PatcherHistoryEventMap, eventData?: any) {
        if (eventName === "create") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            await editor.create(e);
        } else if (eventName === "changeBoxText") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { boxId, text } = e;
            await editor.instance.changeBoxText(boxId, text);
        } else if (eventName === "boxChanged") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { boxId, args, props, state } = e;
            await editor.changeBox(boxId, { args, props, state });
        } else if (eventName === "moved") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { selected, delta, presentation } = e;
            editor.move(selected, delta, presentation);
            editor.moveEnd(delta);
        } else if (eventName === "changeLineSrc") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { lineId, src } = e;
            editor.changeLineSrc(lineId, src[0], src[1]);
        } else if (eventName === "changeLineDest") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { lineId, dest } = e;
            editor.changeLineDest(lineId, dest[0], dest[1]);
        } else if (eventName === "delete") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            await editor.delete(e);
        } else if (eventName === "resized") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { selected, delta, type: t, presentation } = e;
            editor.resize(selected, delta, t, presentation);
            editor.resizeEnd(delta, t);
        } else if (eventName === "propsChanged") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            editor.instance.setProps(e.props);
        }
    }
}
