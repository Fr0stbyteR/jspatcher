import { BaseObject } from "./objects/Base";
import { TSharedData, TSharedDataConsumers } from "./types";
import Patcher from "./Patcher";
import { SharedDataNoValue } from "../utils/symbols";

export default class SharedData {
    private data: TSharedData;
    private $data: TSharedDataConsumers;
    private pData: TSharedData;
    private $pData: TSharedDataConsumers;
    constructor(patcher: Patcher) {
        this.data = patcher.env.data;
        this.$data = patcher.env.dataConsumers;
        this.pData = patcher.data;
        this.$pData = patcher._state.dataConsumers;
    }
    set(cat: string, keyIn: string, data: any, consumer: BaseObject) {
        const isLocal = keyIn.startsWith("#");
        const key = isLocal ? keyIn.slice(1) : keyIn;
        const db = isLocal ? this.pData : this.data;
        const $db = isLocal ? this.$pData : this.$data;
        if (!(cat in db)) {
            db[cat] = {};
            $db[cat] = {};
        }
        if (!(key in db[cat])) {
            db[cat][key] = {};
            $db[cat][key] = new Set<BaseObject>();
        }
        db[cat][key] = data;
        $db[cat][key].forEach((o) => {
            if (o === consumer) return;
            o.emit("sharedDataUpdated", { category: cat, key, data });
        });
    }
    get(cat: string, keyIn: string) {
        const isLocal = keyIn.startsWith("#");
        const key = isLocal ? keyIn.slice(1) : keyIn;
        const db = isLocal ? this.pData : this.data;
        if (!(cat in db)) return SharedDataNoValue;
        if (!(key in db[cat])) return SharedDataNoValue;
        return db[cat][key];
    }
    subscribe(cat: string, keyIn: string, consumer: BaseObject) {
        const isLocal = keyIn.startsWith("#");
        const key = isLocal ? keyIn.slice(1) : keyIn;
        const db = isLocal ? this.pData : this.data;
        const $db = isLocal ? this.$pData : this.$data;
        if (!(cat in db)) {
            db[cat] = {};
            $db[cat] = {};
        }
        if (!(key in db[cat])) {
            db[cat][key] = {};
            $db[cat][key] = new Set<BaseObject>();
        }
        $db[cat][key].add(consumer);
    }
    unsubscribe(cat: string, keyIn: string, consumer: BaseObject) {
        const isLocal = keyIn.startsWith("#");
        const key = isLocal ? keyIn.slice(1) : keyIn;
        const $db = isLocal ? this.$pData : this.$data;
        if (!(cat in $db)) return;
        if (!(key in $db[cat])) return;
        $db[cat][key].delete(consumer);
        if (!$db[cat][key].size) {
            const db = isLocal ? this.pData : this.data;
            delete $db[cat][key];
            delete db[cat][key];
        }
    }
    mergeEnvData(dbIn: TSharedData) {
        const db = this.data;
        const $db = this.$data;
        for (const cat in dbIn) {
            if (!(cat in db)) {
                db[cat] = {};
                $db[cat] = {};
            }
            for (const key in dbIn[cat]) {
                if (!(key in db[cat])) {
                    db[cat][key] = dbIn[cat][key];
                    $db[cat][key] = new Set<BaseObject>();
                }
            }
        }
    }
}
