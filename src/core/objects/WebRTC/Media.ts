import { StrictDropdownItemProps } from "semantic-ui-react";
import { Bang } from "../Base";
import { DefaultWebRTCObject } from "./Base";
import { TMeta } from "../../types";

export class mediaDevices extends DefaultWebRTCObject<{}, {}, [Bang | MediaDeviceKind[]], [MediaDeviceInfo[], StrictDropdownItemProps[]], MediaDeviceKind[]> {
    static description = "Enumerate media devices";
    static inlets: TMeta["inlets"] = [{
        isHot: true,
        type: "object",
        description: "Bang to enumerate, MediaDeviceKind[] to use a filter"
    }];
    static outlets: TMeta["outlets"] = [{
        type: "object",
        description: "Array of MediaDeviceInfo"
    }, {
        type: "object",
        description: "Array of DropdownItemProps"
    }];
    static args: TMeta["args"] = [{
        type: "string",
        varLength: true,
        optional: true,
        default: "audioinput audiooutput videoinput",
        description: "Output only kinds of devices"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                let filters: MediaDeviceKind[];
                if (data instanceof Bang) {
                    filters = this.box.args.slice();
                    if (!filters.length) filters.push("audioinput", "audiooutput", "videoinput");
                } else {
                    filters = data.slice();
                }
                const devices = await navigator.mediaDevices.enumerateDevices();
                const options = devices.filter(d => filters.indexOf(d.kind) !== -1).map((d, key) => {
                    const { kind, deviceId, label } = d;
                    return { key, icon: { audioinput: "microphone", audiooutput: "volume up", videoinput: "camera" }[kind], text: label || deviceId, value: deviceId };
                });
                this.outletAll([devices, options]);
            }
        });
    }
}
