import { EventEmitter } from "events";

export abstract class AbstractComponent<T = { [key: string]: any }> extends EventEmitter {
    on<K extends keyof T>(type: K & string, listener: (e: T[K]) => void) {
        return super.on(type, listener);
    }
    once<K extends keyof T>(type: K & string, listener: (e: T[K]) => void) {
        return super.once(type, listener);
    }
    off<K extends keyof T>(type: K & string, listener: (e: T[K]) => void) {
        return super.off(type, listener);
    }
    removeAllListeners<K extends keyof T>(type: K & string) {
        return super.removeAllListeners(type);
    }
    emit<K extends keyof T>(type: K & string, e?: T[K]) {
        return super.emit(type, e);
    }
    /**
     * The default state of the component.
     *
     * @static
     * @type {{ [key: string]: any }}
     * @memberof Component
     */
    static defaultProps: { [key: string]: any } = {};
    get defaultProps() {
        return (this.constructor as typeof AbstractComponent).defaultProps as T;
    }
    /**
     * Here stores corrent state of component
     * change the state with `setState` method to fire state events
     * then UI parts will get notified and rerender
     *
     * @type {T}
     * @memberof Component
     */
    state: T;
    /**
     * Frame count in order to reduce frame rate
     *
     * @private
     * @type {number}
     * @memberof Component
     */
    private $frame = 0;
    /**
     * Frame reducing factor, 1 = render at every browser rendering tick, 2 will skip one every two ticks.
     *
     * @type {number}
     * @memberof Component
     */
    frameReduce = 1;
    /**
     * Here stores current `requestAnimationFrame` reference
     * if we have a new state to render, we cancel the old one
     *
     * @private
     * @type {number}
     * @memberof Component
     */
    private $raf: number;
    /**
     * `requestAnimationFrame` callback
     *
     * @private
     * @memberof Component
     */
    private raf = () => {
        this.$frame++;
        if (this.$frame % this.frameReduce !== 0) {
            this.$raf = window.requestAnimationFrame(this.raf);
            return;
        }
        this.$raf = undefined;
        this.tasks.forEach(f => f());
        this.tasks = [];
    };
    /**
     * tasks to execute in next redering tick
     *
     * @private
     * @memberof Component
     */
    private tasks: (() => any)[] = [];
    /**
     * Initiate default state with incoming state.
     * @param {T} [props]
     * @memberof AbstractItem
     */
    constructor(props?: T) {
        super();
        this.state = { ...this.defaultProps, ...props };
        return this;
    }
    /**
     * set internal state and fire events for UI parts subscribed
     *
     * @param {{ [K in keyof T]?: T[K] }} newState
     * @returns
     * @memberof Component
     */
    setState(newState: { [K in keyof T]?: T[K] }) {
        let shouldUpdate = false;
        for (const key in newState) {
            const stateKey = key as keyof T & string;
            const stateValue = newState[stateKey];
            if (stateKey in this.state && this.state[stateKey] !== stateValue) {
                this.state[stateKey] = stateValue;
                shouldUpdate = true;
            } else return;
            if (shouldUpdate) this.emit(stateKey, this.state[stateKey]);
        }
    }
    /**
     * Use this method to request a new rendering
     * schedule what you need to do in next render tick in `raf` callback
     *
     * @returns
     * @memberof Component
     */
    schedule(func: () => any) {
        if (this.tasks.indexOf(func) === -1) this.tasks.push(func);
        if (this.$raf) return;
        this.$raf = window.requestAnimationFrame(this.raf);
    }
}
