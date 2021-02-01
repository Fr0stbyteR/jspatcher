export interface IItem {
    /**
     * Initial type of item given by Faust compiler
     */
    type: TFaustUIType;
    /**
     * Initial item label given by Faust compiler
     */
    label: string;
    /**
     * Calculated layout
     */
    layout: TLayoutProp;

    /**
     * Adjust group width and height by its items' dimensions
     */
    adjust(): this;
    /**
     * Expand flexible items within a group
     *
     * @param {number} dX - Extra horizontal spaces that this group could take
     * @param {number} dY - Extra vertical spaces that this group could take
     */
    expand(dX: number, dY: number): this;

    /**
     * calculate all the items' absolute coordination (in grids)
     */
    offset(): this;
}
