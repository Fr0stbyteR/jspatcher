import DefaultObject from "./DefaultHardwareObject";
import type { IHardwarePatcherObjectMeta, IIoMeta } from "./AbstractHardwareObject";
import { BasePin, IoPosition } from "../../types";

export default class EmptyObject extends DefaultObject<{}, { editing: boolean }, [any], [any]> {
    static author = "Corvus Prudens";
    static version = "1.0.0";
    static description = "Bypass input";
    static ios: IHardwarePatcherObjectMeta["ios"] = [
        ...Array.from({length: 4}, (_, i) => ({
            isHot: true,
            pin: { pinName: "", tie: true},
            type: "anything",
            description: "output same thing"
        } as IIoMeta)),
    ];
    state = { editing: false };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.ios = [
                ...['T', 'B', 'L', 'R'].map(edge => ({
                    edge,
                    position: 0.5,
                } as IoPosition))
            ]
        });
        // this.on("inlet", ({ data }) => this.outlet(0, data));
    }
}
