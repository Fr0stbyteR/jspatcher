import { AbstractGroup } from "./AbstractGroup";

export class HGroup extends AbstractGroup {
    adjust() {
        this.items.forEach((item) => {
            item.adjust();
            this.layout.width += item.layout.width;
            this.layout.height = Math.max(this.layout.height, item.layout.height + 2 * AbstractGroup.padding + AbstractGroup.labelHeight);
        });
        this.layout.width += AbstractGroup.spaceBetween * (this.items.length - 1);
        if (this.layout.width < 1) this.layout.width += 1;
        return this;
    }
    expand(dX: number) {
        let hExpandItems = 0;
        this.items.forEach((item) => { // Count items that need to expand horizontally
            if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") hExpandItems++;
        });
        this.items.forEach((item) => {
            let dX$ = 0;
            let dY$ = 0; // Space available to expand for current item
            if (item.layout.sizing === "both" || item.layout.sizing === "horizontal") {
                dX$ = hExpandItems ? dX / hExpandItems : 0;
                item.layout.width += dX$;
            }
            if (item.layout.sizing === "both" || item.layout.sizing === "vertical") {
                dY$ = this.layout.height - 2 * AbstractGroup.padding - AbstractGroup.labelHeight - item.layout.height;
                item.layout.height += dY$;
            }
            item.expand(dX$, dY$);
        });
        return this;
    }
    offset() {
        const { labelHeight, padding, spaceBetween } = AbstractGroup;
        let $left = padding;
        const $top = padding + labelHeight;
        const { height } = this.layout;
        this.items.forEach((item) => {
            item.layout.offsetLeft = $left;
            item.layout.offsetTop = $top;
            // center the item
            item.layout.offsetTop += (height - labelHeight - item.layout.height) / 2 - padding;
            item.layout.left = (this.layout.left || 0) + item.layout.offsetLeft;
            item.layout.top = (this.layout.top || 0) + item.layout.offsetTop;
            item.offset();
            $left += item.layout.width + spaceBetween;
        });
        return this;
    }
}
