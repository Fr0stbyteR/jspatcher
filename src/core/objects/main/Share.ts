import { LiveShareEventMap } from "../../LiveShare";
import Box from "../../patcher/Box";
import { IInletsMeta, IOutletsMeta, IPropsMeta } from "../base/AbstractObject";
import DefaultObject from "../base/DefaultObject";

export type ObjectsState = Record<string, any>;
export interface ShareProps {
    mode: "default" | "hosted";
}

export interface ShareInternalState {
    boxInspected: Set<string>;
    stateUpdateIds: Set<string>;
}

export default class share extends DefaultObject<{}, {}, [], [never, never, LiveShareEventMap["objectState"]], [], ShareProps> {
    static description = "Store and recall settings";
    static inlets: IInletsMeta = [];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Connect to objects to include in the state observer"
    }, {
        type: "anything",
        description: "Connect to Objects to exclude in the state observer"
    }, {
        type: "object",
        description: "New state data when received"
    }];
    static props: IPropsMeta<ShareProps> = {
        mode: {
            type: "enum",
            default: "default",
            enums: ["default", "hosted"],
            description: "hosted = only the room owner can update states, default = everyone can update states"
        }
    };
    _: ShareInternalState = { boxInspected: new Set(), stateUpdateIds: new Set() };
    get included() {
        const included = new Set<Box>();
        this.outletLines[0]?.forEach(l => included.add(l.destBox));
        return included;
    }
    get excluded() {
        const excluded = new Set<Box>();
        this.outletLines[2]?.forEach(l => excluded.add(l.destBox));
        return excluded;
    }
    get boxesInspected() {
        const { included, excluded } = this;
        const boxes = included.size ? included : new Set(Object.values(this.patcher.boxes));
        for (const b of excluded) {
            boxes.delete(b);
        }
        return boxes;
    }
    handleStateUpdated = ({ id }: { id?: string }) => {
        if (id && this._.stateUpdateIds.has(id)) {
            this._.stateUpdateIds.delete(id);
            return;
        }
        const fileId = this.patcher.file?.id;
        if (!fileId) return;
        const { liveShare } = this.env;
        if (!liveShare.inRoom) return;
        if (this.getProp("mode") === "hosted" && !liveShare.isOwner) return;
        const { boxesInspected } = this;
        const data: Record<string, any> = {};
        for (const b of boxesInspected) {
            data[b.id] = b.object.state;
        }
        liveShare.updateState(fileId, data);
    };
    handleReceivedState = (e: LiveShareEventMap["objectState"]) => {
        const fileId = this.patcher.file?.id;
        if (!fileId) return;
        const state = e.state[fileId];
        if (!state) return;
        const { boxesInspected } = this;
        for (const b of boxesInspected) {
            const id = this.env.generateId(this);
            this._.stateUpdateIds.add(id);
            if (b.id in state) b.object.updateState(state[b.id], { id });
        }
        this.outlet(2, e);
    };
    updateBoxInspected() {
        const oldBoxes = this._.boxInspected;
        const newBoxes = [...this.boxesInspected];
        for (const boxId of [...oldBoxes]) {
            const found = newBoxes.find(b => b.id === boxId);
            if (!found) {
                oldBoxes.delete(boxId);
                this.patcher.boxes[boxId]?.object.off("stateUpdated", this.handleStateUpdated);
            }
        }
        for (const box of newBoxes) {
            if (!oldBoxes.has(box.id)) {
                oldBoxes.add(box.id);
                box.object.on("stateUpdated", this.handleStateUpdated);
            }
        }
    }
    handlePatcherReady = () => {
        const fileId = this.patcher.file?.id;
        if (!fileId) return;
        const { liveShare } = this.env;
        if (!liveShare.inRoom) return;
        this.handleReceivedState({ username: null, state: this.env.liveShare.objectState });
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 5;
        });
        this.on("postInit", () => {
            this.env.liveShare.on("objectState", this.handleReceivedState);
            if (!this.env.liveShare.inRoom) return;
            if (!this.patcher.isReady) this.env.once("ready", this.handlePatcherReady);
            else this.handlePatcherReady();
        });
        this.on("connectedOutlet", ({ outlet }) => {
            if (outlet === 0 || outlet === 2) this.updateBoxInspected();
        });
        this.on("disconnectedOutlet", ({ outlet }) => {
            if (outlet === 0 || outlet === 2) this.updateBoxInspected();
        });
        this.on("destroy", () => {
            this.patcher.off("ready", this.handlePatcherReady);
            this.env.liveShare.off("objectState", this.handleReceivedState);
            this._.boxInspected.forEach(boxId => this.patcher.boxes[boxId]?.object.off("stateUpdated", this.handleStateUpdated));
        });
    }
}
