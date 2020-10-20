import Worker from "./FileMgr.worker.ts"; // eslint-disable-line import/extensions
import { IFileManagerWorker } from "./FileMgrWorker.types";
import ProxyMain from "./ProxyMain";

export default class FileManagerWorker extends ProxyMain<{}, IFileManagerWorker> {
    static Worker = Worker;
    static fnNames: (keyof IFileManagerWorker)[] = ["init", "mkdir", "createFile", "rename", "exists", "readdir", "readFile", "unlink", "isFile"];
}
