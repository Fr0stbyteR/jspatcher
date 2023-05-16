import SubPatcherUI from "./SubPatcherUI";
import FaustFFT, { FaustFFTInternalState } from "../faust/FaustFFT";
import type Patcher from "../../patcher/Patcher";
import type { ProjectFileEventMap } from "../../file/AbstractProjectFile";
import type { RawPatcher } from "../../types";
import type { IJSPatcherObjectMeta } from "../base/AbstractObject";

interface InternalState extends FaustFFTInternalState {
    patcher: Patcher;
    key: string;
    code: string;
}
export default class FaustFFTPatcher extends FaustFFT<Partial<RawPatcher>, {}, [string?], {}, { patcher: Patcher }> {
    static package = "SubPatcher";
    static description = "Use Faust Sub-patcher for spectral processing inside an AudioWorklet, each input <: real, imag, bin, real, imag :> each output";
    static args: IJSPatcherObjectMeta["args"] = [{
        type: "string",
        optional: true,
        default: "",
        description: "Name of the subpatcher"
    }];
    static UI = SubPatcherUI;
    _: InternalState = {
        merger: undefined,
        splitter: undefined,
        node: undefined,
        fftNode: undefined,
        params: [],
        voices: 0,
        patcher: undefined,
        key: this.box.args[0],
        code: undefined
    };
    type: "faust" | "gen" = "faust";
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
            patcher.on("graphChanged", this.handleGraphChanged);
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
            patcher.off("graphChanged", this.handleGraphChanged);
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
    async compilePatcher() {
        const code = this._.patcher.toFaustDspCode();
        if (code && code !== this._.code) {
            this._.code = code;
            await this.newNode(code);
        }
    }
    handleGraphChanged = async () => {
        await this.compilePatcher();
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
                await patcher?.destroy();
                patcher = await item.instantiate({ env: this.patcher.env, project: this.patcher.project }) as Patcher;
                this.setData(patcher.toSerializable());
            }
            this._.patcher = patcher;
            this.updateUI({ patcher });
        } catch (error) {
            this.error(error);
        } finally {
            await this.subscribePatcher();
            await this.handleGraphChanged();
            this.connectAudio();
        }
    };
    handlePreInit = () => {};
    handleUpdateArgs = async (args: Partial<[string, number]>): Promise<void> => {
        if (!this._.patcher) return;
        const { key } = this._;
        let newKey = key;
        if (typeof args[0] === "string" || typeof args[0] === "undefined") {
            newKey = args[0];
            if (newKey !== key) this._.key = newKey;
        }
        if (newKey !== key) {
            await this.reload();
        }
    };
    handlePostInit = this.reload;
    subscribe() {
        super.subscribe();
        this.on("destroy", this.unsubscribePatcher);
    }
}
