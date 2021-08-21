import SubPatcher from "./SubPatcher";
import type Patcher from "../../patcher/Patcher";
// import type { RawPatcher } from "../../types";
import type { IArgsMeta, IJSPatcherObjectMeta } from "../base/AbstractObject";
import type PatcherNode from "../../worklets/PatcherNode";

export default class DspSubPatcher extends SubPatcher {
    static args: IArgsMeta = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }, {
        type: "number",
        optional: true,
        default: 2,
        description: "Inputs"
    }, {
        type: "number",
        optional: true,
        default: 2,
        description: "Outputs"
    }];
    type = "jsaw" as const;
    _: SubPatcher["_"] & { node: PatcherNode } = { ...this._, node: undefined };
    reload = async () => {
        if (this._.patcher) {
            this.disconnectAudio();
            await this.unsubscribePatcher();
        }
        // const { key } = this._;
        let patcher: Patcher;
        // let rawPatcher: RawPatcher;
        try {
            patcher = new this.Patcher({ env: this.patcher.env, project: this.patcher.project });
            await patcher.load(this.data, this.type);
            this._.node = await patcher.getPatcherNode(~~+this.args[1] || 2, ~~+this.args[2] || 2);
            this._.patcher = patcher;
            this.updateUI({ patcher });
        } catch (error) {
            this.error(error);
        } finally {
            this.handlePatcherIOChanged(this._.patcher.meta);
            this.subscribePatcher();
            this.handlePatcherGraphChanged();
            this.connectAudio();
        }
    };
    handlePatcherChanged = () => {
        const rawPatcher = this._.patcher.toSerializable();
        this.setData(rawPatcher);
        this.patcher.emit("changed");
    };
    handlePatcherIOChanged = (meta: IJSPatcherObjectMeta) => {
        this.inlets = meta.inlets.length;
        this.outlets = meta.outlets.length;
        const { inlets, outlets } = meta;
        const { node } = this._;
        this.inletAudioConnections = new Array(this.inlets).fill(null).map((v, index) => ({ node, index }));
        this.outletAudioConnections = new Array(this.outlets).fill(null).map((v, index) => ({ node, index }));
        this.setMeta({ ...this.meta, inlets, outlets, args: SubPatcher.args });
    };
}
