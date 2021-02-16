import AudioWorkletProxyNode from "./AudioWorkletProxyNode";
import processorURL from "./Importer.worklet.ts"; // eslint-disable-line import/extensions
import AudioWorkletRegister from "./AudioWorkletRegister";
import { IImporterNode, IImporterProcessor, ObjectDescriptor, TAbstractPackage } from "./ImporterWorklet.types";
import { ImporterDirSelfObject } from "../../utils/symbols";
import { TPackage } from "../types";
import { StaticMethod } from "../objects/importer/StaticMethod";
import { StaticSetter } from "../objects/importer/StaticSetter";
import { StaticSetterGetter } from "../objects/importer/StaticSetterGetter";
import { StaticGetter } from "../objects/importer/StaticGetter";
import { StaticProperty } from "../objects/importer/StaticProperty";
import { Method } from "../objects/importer/Method";
import { SetterGetter } from "../objects/importer/SetterGetter";
import { Setter } from "../objects/importer/Setter";
import { Getter } from "../objects/importer/Getter";
import { Property } from "../objects/importer/Property";
import { AnyImportedObject } from "../objects/importer/ImportedObject";

export const processorID = "__JSPatcher_Importer";
export default class ImporterNode extends AudioWorkletProxyNode<IImporterNode, IImporterProcessor> implements IImporterNode {
    static processorID = processorID;
    static register = (audioWorklet: AudioWorklet) => AudioWorkletRegister.register(audioWorklet, processorID, processorURL);
    static fnNames: (keyof IImporterProcessor)[] = ["importGlobalThis"];
    constructor(context: BaseAudioContext) {
        super(context, processorID, { numberOfInputs: 1, numberOfOutputs: 0 });
        const _destroy = this.destroy;
        this.destroy = async () => {
            await _destroy.call(this);
            this._disposed = true;
        };
    }
    getObjectFromDescriptor(descriptor: ObjectDescriptor) {
        const Ctors = {
            StaticMethod,
            StaticSetter,
            StaticSetterGetter,
            StaticGetter,
            StaticProperty,
            Method,
            Setter,
            SetterGetter,
            Getter,
            Property
        };
        const { ctor, path, name } = descriptor;
        const Super = Ctors[ctor] as typeof AnyImportedObject;
        return class extends Super {
            static package = "AudioWorklet";
            static root = globalThis;
            static path = path;
            static get _name() { return name; }
        };
    }
    async import() {
        const $self = ImporterDirSelfObject;
        const self = "__JSPatcher_Importer_ImporterDirSelfObject";
        const pkg = await this.importGlobalThis("AudioWorklet");
        const rec = (pkg: TAbstractPackage, out: TPackage = {}) => {
            for (const key in pkg) {
                const e = pkg[key];
                if (e?.isObjectDescriptor) {
                    const newObj = this.getObjectFromDescriptor(e as ObjectDescriptor);
                    if (key === self) out[$self as any] = newObj;
                    else out[key] = newObj;
                } else {
                    out[key] = {} as TPackage;
                    rec(e as TAbstractPackage, out[key] as TPackage);
                }
            }
            return out;
        };
        return rec(pkg);
    }
}
