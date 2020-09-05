import { AbstractGroup } from "./AbstractGroup";

export class VGroup extends AbstractGroup {
    adjust() {
        this.items.forEach((item) => {
            item.adjust();
            this.layout.width = Math.max(this.layout.width, item.layout.width + 2 * AbstractGroup.padding);
            this.layout.height += item.layout.height;
        });
        this.layout.height += AbstractGroup.spaceBetween * (this.items.length - 1);
        if (this.layout.width < 1) this.layout.width += 1;
        return this;
    }
    expand(dX: number, dY: number) {
        let vExpandItems = 0;
        this.items.forEach((item) => {
            if (item.layout.sizing === "both" || item.layout.sizing === "vertical") vExpandItems++;
        });
        this.items.forEach((item) => {
            let dX$ = 0;
            let dY$ = 0; // Space available to expand for current item
            if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") {
                dX$ = this.layout.width - 2 * AbstractGroup.padding - item.layout.width;
                item.layout.width += dX$;
            }
            if (item.layout.sizing === "both" || item.layout.sizing === "vertical") {
                dY$ = vExpandItems ? dY / vExpandItems : 0;
                item.layout.height += dY$;
            }
            item.expand(dX$, dY$);
        });
        return this;
    }
    offset() {
        const { labelHeight, padding, spaceBetween } = AbstractGroup;
        const $left = padding;
        let $top = padding + labelHeight;
        const { width } = this.layout;
        this.items.forEach((item) => {
            item.layout.offsetLeft = $left;
            item.layout.offsetTop = $top;
            // center the item
            item.layout.offsetLeft += (width - item.layout.width) / 2 - padding;
            item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
            item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
            item.offset();
            $top += item.layout.height + spaceBetween;
        });
        return this;
    }
}
