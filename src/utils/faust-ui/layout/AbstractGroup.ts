/* eslint-disable @typescript-eslint/no-unused-vars */
import { IItem } from "./IItem";
import { AbstractItem } from "./AbstractItem";

export abstract class AbstractGroup implements IItem {
    static padding = 0.2;
    static labelHeight = 0.25;
    static spaceBetween = 0.1;
    isRoot: boolean;
    type: TFaustUIGroupType;
    label: string;
    items: (AbstractGroup | AbstractItem)[];
    layout: TLayoutProp;

    constructor(group: { type: TFaustUIGroupType; label: string; items: (AbstractGroup | AbstractItem)[] }, isRoot?: boolean) {
        this.isRoot = !!isRoot;
        Object.assign(this, group);
        const { hasHSizingDesc, hasVSizingDesc } = this;
        const sizing = hasHSizingDesc && hasVSizingDesc ? "both" : hasHSizingDesc ? "horizontal" : hasVSizingDesc ? "vertical" : "none";
        this.layout = {
            type: group.type,
            width: AbstractGroup.padding * 2,
            height: AbstractGroup.padding * 2 + AbstractGroup.labelHeight,
            sizing
        };
    }
    adjust() {
        throw new Error("Method not implemented.");
    }
    expand(dX: number, dY: number) {
        throw new Error("Method not implemented.");
    }
    offset() {
        throw new Error("Method not implemented.");
    }

    /**
     * find recursively if the group has horizontal-sizable item
     *
     * @readonly
     * @type {boolean}
     * @memberof AbstractGroup
     */
    get hasHSizingDesc(): boolean {
        return !!this.items.find((item) => {
            if (item instanceof AbstractGroup) return item.hasHSizingDesc;
            return item.layout.sizing === "horizontal" || item.layout.sizing === "both";
        });
    }
    /**
     * find recursively if the group has vertical-sizable item
     *
     * @readonly
     * @type {boolean}
     * @memberof AbstractGroup
     */
    get hasVSizingDesc(): boolean {
        return !!this.items.find((item) => {
            if (item instanceof AbstractGroup) return item.hasVSizingDesc;
            return item.layout.sizing === "vertical" || item.layout.sizing === "both";
        });
    }
}
