import { Layout } from "./layout/Layout";
import "./index.scss";
import { AbstractItem } from "./components/AbstractItem";
import { Group } from "./components/Group";
import { FaustUIGroupProps } from "./components/types";

type TOptions = {
    root: HTMLDivElement;
    ui?: TFaustUI;
    listenWindowResize?: boolean;
    listenWindowMessage?: boolean;
};

/**
 * The main class of UI constructor,
 * listening to `resize` window event to resize component,
 * listening to `message` window event to change UI or param value.
 * See readme.
 *
 * @export
 * @class FaustUI
 */
export class FaustUI {
    componentMap: { [path: string]: AbstractItem<any>[] } = {};
    DOMroot: HTMLDivElement;
    faustUIRoot: Group;
    hostWindow: Window;
    grid: number;
    private _ui: TFaustUI;
    private _layout: TLayoutProp;
    /**
     * Calculate incoming UI's layout, bind window events
     * @param {TOptions} options
     * @memberof FaustUI
     */
    constructor(options: TOptions) {
        const { root, ui: uiIn, listenWindowResize, listenWindowMessage } = options;
        this.DOMroot = root;
        this.ui = uiIn || [];
        if (typeof listenWindowResize === "undefined" || listenWindowResize === true) {
            window.addEventListener("resize", () => {
                this.resize();
            });
        }
        if (typeof listenWindowMessage === "undefined" || listenWindowMessage === true) {
            window.addEventListener("message", (e) => {
                const { data, source } = e;
                this.hostWindow = source as Window;
                const { type } = data;
                if (!type) return;
                if (type === "ui") {
                    this.ui = data.ui;
                } else if (type === "param") {
                    const { path, value } = data;
                    this.paramChangeByDSP(path, value);
                }
            });
        }
    }
    /**
     * Render the UI to DOM root
     *
     * @memberof FaustUI
     */
    mount() {
        this.componentMap = {};
        this.DOMroot.innerHTML = "";
        const props: FaustUIGroupProps = {
            label: "",
            type: "vgroup",
            items: this.ui,
            style: {
                grid: this.grid,
                width: this.layout.width,
                height: this.layout.height,
                left: this.layout.offsetLeft,
                top: this.layout.offsetTop
            },
            isRoot: true,
            emitter: this
        };
        this.faustUIRoot = new Group(props);
        this.faustUIRoot.componentWillMount();
        this.faustUIRoot.mount();
        this.DOMroot.appendChild(this.faustUIRoot.container);
        this.faustUIRoot.componentDidMount();
    }
    /**
     * This method should be called by components to register itself to map.
     *
     * @param {string} path
     * @param {AbstractItem<any>} item
     * @memberof FaustUI
     */
    register(path: string, item: AbstractItem<any>) {
        if (this.componentMap[path]) this.componentMap[path].push(item);
        else this.componentMap[path] = [item];
    }
    /**
     * Notify the component to change its value.
     *
     * @param {string} path
     * @param {number} value
     * @memberof FaustUI
     */
    paramChangeByDSP(path: string, value: number) {
        if (this.componentMap[path]) this.componentMap[path].forEach(item => item.setState({ value }));
    }
    /**
     * Can be overriden, called by components when its value is changed by user.
     *
     * @memberof FaustUI
     */
    paramChangeByUI = (path: string, value: number) => {
        if (!this.hostWindow) return;
        this.hostWindow.postMessage({ path, value, type: "param" }, "*");
    };
    /**
     * Calculate UI layout in grid then calculate grid size.
     *
     * @memberof FaustUI
     */
    calc() {
        const { items, layout } = Layout.calc(this.ui);
        this._ui = items;
        this._layout = layout;
        this.calcGrid();
    }
    /**
     * Calculate grid size by DOM root size and layout size in grids.
     *
     * @returns
     * @memberof FaustUI
     */
    calcGrid() {
        const { width, height } = this.DOMroot.getBoundingClientRect();
        const grid = Math.max(40, Math.min(width / this._layout.width, height / this._layout.height));
        this.grid = grid;
        return grid;
    }
    /**
     * Force recalculate grid size and resize UI
     *
     * @returns
     * @memberof FaustUI
     */
    resize() {
        if (!this.faustUIRoot) return;
        this.calcGrid();
        this.faustUIRoot.setState({ style: { grid: this.grid } });
    }
    get ui() {
        return this._ui;
    }
    set ui(uiIn) {
        this._ui = uiIn;
        this.calc();
        this.mount();
    }
    get layout() {
        return this._layout;
    }
}
