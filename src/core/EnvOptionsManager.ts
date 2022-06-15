import { uuid } from "../utils/utils";
import Env from "./Env";
import { AudioDisplayOptions, AudioUnitOptions, LiveShareOptions, TAudioUnit } from "./types";

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface EnvOptions {
    language: "en" | "zh-CN";
    autoSave: boolean;
    audioUnit: TAudioUnit;
    audioUnitOptions: AudioUnitOptions;
    audioDisplayOptions: AudioDisplayOptions;
    liveShare: LiveShareOptions;
    runtime: boolean;
    noUI: boolean;
}

export interface PartialEnvOptions extends DeepPartial<EnvOptions> {}

export default class EnvOptionsManager {
    static get defaultOptions(): EnvOptions {
        return {
            language: "en",
            autoSave: false,
            audioUnit: "time",
            audioUnitOptions: {
                bpm: 60,
                beatsPerMeasure: 4,
                division: 16
            },
            audioDisplayOptions: {
                frameRate: 60,
                bgColor: "black",
                gridColor: "rgb(0, 53, 0)",
                phosphorColor: "rgb(67, 217, 150)",
                hueOffset: 0,
                seperatorColor: "grey",
                cursorColor: "rgba(191, 0, 0)",
                fftSize: 2048,
                fftOverlap: 2,
                fftWindowFunction: "blackmanHarris",
                fftDrawThreshold: -120
            },
            liveShare: {
                server: "",
                hostRoomId: uuid(),
                hostPassword: "",
                hostPermission: "read",
                joinRoomId: "",
                nickname: `User${uuid().substring(0, 3)}`,
                joinPassword: ""
            },
            runtime: false,
            noUI: false
        };
    }
    private _env: Env;
    private _currentOptions = EnvOptionsManager.defaultOptions;
    private _localStorageKey = "__JSPatcher_Patcher_Options";
    get currentOptions() {
        return this._currentOptions;
    }
    constructor(env: Env) {
        this._env = env;
        const localStorageOptionsStr = localStorage.getItem(this._localStorageKey);
        if (localStorageOptionsStr) {
            const localStorageOptions = JSON.parse(localStorageOptionsStr) as EnvOptions;
            delete localStorageOptions.runtime;
            delete localStorageOptions.noUI;
            this.setOptions(localStorageOptions);
        }
    }
    setOptions(options: PartialEnvOptions) {
        const oldOptions = this._currentOptions;
        this._currentOptions = JSON.parse(JSON.stringify(oldOptions));
        for (const key in this._currentOptions) {
            if (key in options) {
                if (typeof (this._currentOptions as any)[key] === "object") {
                    for (const key2 in (this._currentOptions as any)[key]) {
                        if (key2 in (options as any)[key]) {
                            (this._currentOptions as any)[key][key2] = (options as any)[key][key2];
                        }
                    }
                } else {
                    (this._currentOptions as any)[key] = (options as any)[key];
                }
            }
        }
        this._env.emit("options", { oldOptions, options: this._currentOptions });
        localStorage.setItem(this._localStorageKey, JSON.stringify(this._currentOptions));
    }
}
