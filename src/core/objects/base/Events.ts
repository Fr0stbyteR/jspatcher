import DefaultObject from "./DefaultObject";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "./AbstractObject";

type EventType = "window" | "document";

export default class Listen extends DefaultObject<{}, {}, [EventType, string], [Event], [EventType, string], {}> {
    static description = "Listen to window/document events";
    static inlets: IInletsMeta = [{
        isHot: false,
        type: "enum",
        enums: ["window", "document"],
        description: 'Event target to listen: "window" | "document"'
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
        type: "enum",
        enums: ["window", "document"],
        description: 'Event target to listen: "window" | "document"',
        optional: false
    }, {
        type: "string",
        description: "Event name to listen",
        optional: false
    }];
    _: { type: EventType; name: string } = { type: this.args[0], name: this.args[1] };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        const listener = (e: Event) => this.outlet(0, e);
        const unsubscribe = () => {
            const eventTarget = this._.type === "document" ? document : this._.type === "window" ? window : null;
            if (!eventTarget) return;
            if (typeof this._.name !== "string") return;
            eventTarget.removeEventListener(this._.name, listener);
        };
        const subscribe = () => {
            const eventTarget = this._.type === "document" ? document : this._.type === "window" ? window : null;
            if (!eventTarget) return;
            if (typeof this._.name !== "string") return;
            eventTarget.addEventListener(this._.name, listener);
        };
        this.on("postInit", subscribe);
        this.on("updateArgs", (args) => {
            unsubscribe();
            this._.type = args[0];
            this._.name = args[1];
            subscribe();
        });
        this.on("destroy", unsubscribe);
    }
}
