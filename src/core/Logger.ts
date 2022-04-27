import { getTimestamp } from "../utils/utils";
import { ILogInfo } from "./types";

export default class Logger {
    _log: ILogInfo[] = [];
    clearTime = 0;
    push(log: ILogInfo) {
        this._log.push(log);
    }
    clear() {
        this.clearTime = getTimestamp();
    }
    get log() {
        return this._log.filter(l => l.timestamp > this.clearTime);
    }
}
