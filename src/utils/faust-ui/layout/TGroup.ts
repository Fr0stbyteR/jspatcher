import { AbstractGroup } from "./AbstractGroup";

export class TGroup extends AbstractGroup {
    static tabLayout = {
        width: 2,
        height: 1
    };
    adjust() {
        this.items.forEach((item) => {
            item.adjust();
            this.layout.width = Math.max(this.layout.width, item.layout.width + 2 * AbstractGroup.padding);
            this.layout.height = Math.max(this.layout.height, item.layout.height + 2 * AbstractGroup.padding + TGroup.labelHeight);
        });
        const tabsCount = this.items.length;
        this.layout.width = Math.max(this.layout.width, tabsCount * TGroup.tabLayout.width + 2 * TGroup.padding);
        this.layout.height += TGroup.tabLayout.height;
        if (this.layout.width < 1) this.layout.width += 1;
        return this;
    }
    expand() {
        const tabsCount = this.items.length;
        this.items.forEach((item) => {
            let dY$ = 0; // Space available to expand for current item
            let dX$ = 0;
            if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") dX$ = this.layout.width - 2 * AbstractGroup.padding - item.layout.width;
            if (item.layout.sizing === "both" || item.layout.sizing === "vertical") dY$ = this.layout.height - 2 * AbstractGroup.padding - AbstractGroup.labelHeight - (tabsCount ? TGroup.tabLayout.height : 0) - item.layout.height;
            item.expand(dX$, dY$);
        });
        return this;
    }
    offset() {
        const { labelHeight, padding } = AbstractGroup;
        const $left = padding;
        const $top = padding + labelHeight + TGroup.tabLayout.height;
        this.items.forEach((item) => {
            item.layout.offsetLeft = $left;
            item.layout.offsetTop = $top;
            item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
            item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
            item.offset();
        });
        return this;
    }
}
