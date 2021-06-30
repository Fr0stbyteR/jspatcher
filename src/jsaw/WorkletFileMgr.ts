import PersistentProjectItemManager from "../core/file/PersistentProjectItemManager";
import type { IWorkletEnvProcessor } from "../core/worklets/WorkletEnv.types";

export default class WorkletFileManager extends PersistentProjectItemManager {
    readonly env: IWorkletEnvProcessor;
}
