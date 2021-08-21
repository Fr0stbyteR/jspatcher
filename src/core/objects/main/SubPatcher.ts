import DefaultObject from "../base/DefaultObject";
import SubPatcherUI, { SubPatcherUIState } from "./SubPatcherUI";
import type { ProjectFileEventMap } from "../../file/AbstractProjectFile";
import type Patcher from "../../patcher/Patcher";
import type { PatcherEventMap } from "../../patcher/Patcher";
import type { RawPatcher, PatcherMode } from "../../types";
import type { IArgsMeta, IJSPatcherObjectMeta } from "../base/AbstractObject";

export default class SubPatcher extends DefaultObject<Partial<RawPatcher>, {}, any[], any[], [string, ...number[]], {}, SubPatcherUIState> {
    static package = "SubPatcher";
    static description = "Sub-patcher";
    static args: IArgsMeta = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }];
    static UI = SubPatcherUI;
    _ = { patcher: undefined as Patcher, key: this.box.args[0] };
    type: PatcherMode = "js";
    handlePatcherOutput = ({ outlet, data }: PatcherEventMap["dataOutput"]) => this.outlet(outlet, data);
    handlePatcherDisconnectAudioInlet = (port: number) => this.disconnectAudioInlet(port);
    handlePatcherDisconnectAudioOutlet = (port: number) => this.disconnectAudioOutlet(port);
    handlePatcherConnectAudioInlet = (port: number) => this.connectAudioInlet(port);
    handlePatcherConnectAudioOutlet = (port: number) => this.connectAudioOutlet(port);
    handlePatcherIOChanged = (meta: IJSPatcherObjectMeta) => {
        this.inletAudioConnections = this._.patcher.inletAudioConnections.slice();
        this.outletAudioConnections = this._.patcher.outletAudioConnections.slice();
        this.inlets = meta.inlets.length;
        this.outlets = meta.outlets.length;
        const { inlets, outlets } = meta;
        this.setMeta({ ...this.meta, inlets, outlets, args: SubPatcher.args });
    };
    handlePatcherGraphChanged = () => {
        this.patcher.emit("graphChanged");
    };
    handlePatcherChanged = () => {
        const { patcher } = this._;
        if (patcher.isTemporary) {
            const rawPatcher = patcher.toSerializable();
            this.setData(rawPatcher);
        }
        this.patcher.emit("changed");
    };
    handleFilePathChanged = () => {
        this._.key = this._.patcher.file.projectPath;
    };
    handleSaved = (e: ProjectFileEventMap["saved"]) => {
        if (e.instance === this._.patcher) return;
        this.reload();
    };
    subscribePatcher = async () => {
        const { patcher } = this._;
        if (patcher) {
            await patcher.addObserver(this);
            patcher.on("dataOutput", this.handlePatcherOutput);
            patcher.on("disconnectAudioInlet", this.handlePatcherDisconnectAudioInlet);
            patcher.on("disconnectAudioOutlet", this.handlePatcherDisconnectAudioOutlet);
            patcher.on("connectAudioInlet", this.handlePatcherConnectAudioInlet);
            patcher.on("connectAudioOutlet", this.handlePatcherConnectAudioOutlet);
            patcher.on("ioChanged", this.handlePatcherIOChanged);
            patcher.on("graphChanged", this.handlePatcherGraphChanged);
            patcher.on("changed", this.handlePatcherChanged);
            const { file } = patcher;
            if (file) {
                file.on("destroyed", this.reload);
                file.on("nameChanged", this.handleFilePathChanged);
                file.on("pathChanged", this.handleFilePathChanged);
                file.on("saved", this.handleSaved);
            }
        }
    };
    unsubscribePatcher = async () => {
        const { patcher } = this._;
        if (patcher) {
            patcher.off("dataOutput", this.handlePatcherOutput);
            patcher.off("disconnectAudioInlet", this.handlePatcherDisconnectAudioInlet);
            patcher.off("disconnectAudioOutlet", this.handlePatcherDisconnectAudioOutlet);
            patcher.off("connectAudioInlet", this.handlePatcherConnectAudioInlet);
            patcher.off("connectAudioOutlet", this.handlePatcherConnectAudioOutlet);
            patcher.off("ioChanged", this.handlePatcherIOChanged);
            patcher.off("graphChanged", this.handlePatcherGraphChanged);
            patcher.off("changed", this.handlePatcherChanged);
            const { file } = patcher;
            if (file) {
                file.off("destroyed", this.reload);
                file.off("nameChanged", this.handleFilePathChanged);
                file.off("pathChanged", this.handleFilePathChanged);
                file.off("saved", this.handleSaved);
            }
            await patcher.removeObserver(this); // patcher will be destroyed if no observers left.
        }
    };
    reload = async () => {
        if (this._.patcher) {
            this.disconnectAudio();
            await this.unsubscribePatcher();
        }
        const { key } = this._;
        let patcher: Patcher;
        let rawPatcher: RawPatcher;
        try {
            const { item, newItem } = await this.getSharedItem(key, "patcher", async () => {
                patcher = new this.Patcher({ env: this.patcher.env, project: this.patcher.project });
                await patcher.load(this.data, this.type);
                rawPatcher = patcher.toSerializable();
                return rawPatcher;
            });
            if (newItem) {
                patcher.file = item;
                this.setData(rawPatcher);
            } else {
                patcher = await item.instantiate({ env: this.patcher.env, project: this.patcher.project }) as Patcher;
                this.setData(patcher.toSerializable());
            }
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
    subscribe() {
        super.subscribe();
        this.on("updateArgs", async (args) => {
            if (!this._.patcher) return;
            if (typeof args[0] === "string" || typeof args[0] === "undefined") {
                const newKey = args[0];
                if (newKey !== this._.key) {
                    this._.key = newKey;
                    await this.reload();
                }
            }
        });
        this.on("postInit", this.reload);
        this.on("inlet", ({ data, inlet }) => this._.patcher.fn(data, inlet));
        this.on("destroy", this.unsubscribePatcher);
    }
}
