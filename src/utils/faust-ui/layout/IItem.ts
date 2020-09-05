export interface IItem {
    /**
     * Initial type of item given by Faust compiler
     *
     * @type {TFaustUIType}
     * @memberof IItem
     */
    type: TFaustUIType;
    /**
     * Initial item label given by Faust compiler
     *
     * @type {string}
     * @memberof IItem
     */
    label: string;
    /**
     * Calculated layout
     *
     * @type {TLayoutProp}
     * @memberof IItem
     */
    layout: TLayoutProp;

    /**
     * Adjust group width and height by its items' dimensions
     *
     * @returns {this}
     * @memberof AbstractGroup
     */
    adjust();
    /**
     * Expand flexible items within a group
     *
     * @param {number} dX - Extra horizontal spaces that this group could take
     * @param {number} dY - Extra vertical spaces that this group could take
     * @returns {this}
     * @memberof AbstractGroup
     */
    expand(dX: number, dY: number);

    /**
     * calculate all the items' absolute coordination (in grids)
     *
     * @returns {this}
     * @memberof AbstractGroup
     */
    offset();
}
