import History, { IHistoryEvent } from "../file/History";
import PatcherEditor, { PatcherHistoryEventMap } from "./HardwareEditor";

export default class PatcherHistory extends History<PatcherHistoryEventMap, PatcherEditor> {
    get eventListening(): (keyof PatcherHistoryEventMap)[] {
        return [
            "create", "delete", "changeBoxText", "boxChanged",
            "changeLineA", "changeLineB", "moved", "resized", "propsChanged"
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
            const { boxId, oldArgs, oldProps, oldState, oldZIndex } = e;
            await editor.changeBox(boxId, { args: oldArgs, props: oldProps, state: oldState, zIndex: oldZIndex });
        } else if (eventName === "moved") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { selected, delta, presentation } = e;
            const d = { x: -1 * delta.x, y: -1 * delta.y };
            editor.move(selected, d, presentation);
            editor.moveEnd(selected, d);
        } else if (eventName === "changeLineA") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { lineId, oldA } = e;
            editor.changeLineA(lineId, oldA[0], oldA[1]);
        } else if (eventName === "changeLineB") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { lineId, oldB } = e;
            editor.changeLineB(lineId, oldB[0], oldB[1]);
        } else if (eventName === "create") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            await editor.delete(e);
        } else if (eventName === "resized") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { selected, delta, type: t, presentation } = e;
            const d = { x: -1 * delta.x, y: -1 * delta.y };
            editor.resize(selected, d, t, presentation);
            editor.resizeEnd(selected, d, t);
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
            const { boxId, args, props, state, zIndex } = e;
            await editor.changeBox(boxId, { args, props, state, zIndex });
        } else if (eventName === "moved") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { selected, delta, presentation } = e;
            editor.move(selected, delta, presentation);
            editor.moveEnd(selected, delta);
        } else if (eventName === "changeLineA") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { lineId, newA } = e;
            editor.changeLineA(lineId, newA[0], newA[1]);
        } else if (eventName === "changeLineB") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { lineId, newB } = e;
            editor.changeLineB(lineId, newB[0], newB[1]);
        } else if (eventName === "delete") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            await editor.delete(e);
        } else if (eventName === "resized") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            const { selected, delta, type: t, presentation } = e;
            editor.resize(selected, delta, t, presentation);
            editor.resizeEnd(selected, delta, t);
        } else if (eventName === "propsChanged") {
            const e: PatcherHistoryEventMap[typeof eventName] = eventData;
            editor.instance.setProps(e.props);
        }
    }
    async mergeChanges(...events: IHistoryEvent<PatcherHistoryEventMap>[]) {
        this.editors.forEach(e => e.state.selectAfterEdit = false);
        const merged = await super.mergeChanges(...events);
        this.editors.forEach(e => e.state.selectAfterEdit = true);
        return merged;
    }
}
