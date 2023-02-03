import DefaultObject from "./DefaultObject";
import type { IArgsMeta, IInletsMeta, IOutletsMeta, IPropsMeta } from "./AbstractObject";

export default class Listen extends DefaultObject<{}, {}, [EventTarget, string], [Event], [string], { once: boolean }> {
    static description = "Listen to EventTarget events";
    static inlets: IInletsMeta = [{
        isHot: false,
        type: "object",
        description: "Event target to listen"
    }, {
        isHot: false,
        type: "string",
        description: "Event name to listen"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "Event emitted"
    }];
    static args: IArgsMeta = [{
        type: "string",
        description: "Event name to listen",
        optional: false
    }];
    static props: IPropsMeta<{ once: boolean }> = {
        once: {
            type: "boolean",
            description: "Listen only once the event until next target received",
            default: false
        }
    };
    _: { target: EventTarget; name: string } = { target: window, name: this.args[0] };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        const listener = (e: Event) => this.outlet(0, e);
        const onceListener = (e: Event) => {
            unsubscribe();
            this.outlet(0, e);
        };
        const unsubscribe = () => {
            if (!this._.target) return;
            if (typeof this._.name !== "string") return;
            this._.target.removeEventListener(this._.name, listener);
            this._.target.removeEventListener(this._.name, onceListener);
        };
        const subscribe = () => {
            if (!this._.target) return;
            if (typeof this._.name !== "string") return;
            this._.target.addEventListener(this._.name, this.getProp("once") ? onceListener : listener);
        };
        this.on("postInit", subscribe);
        this.on("updateArgs", (args) => {
            unsubscribe();
            this._.name = args[0];
            subscribe();
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data !== this._.target) {
                    unsubscribe();
                    this._.target = data as EventTarget;
                    subscribe();
                }
            } else if (inlet === 1) {
                if (data !== this._.name) {
                    unsubscribe();
                    this._.name = data as string;
                    subscribe();
                }
            }
        });
        this.on("destroy", unsubscribe);
    }
}
