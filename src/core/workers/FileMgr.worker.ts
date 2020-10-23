/* eslint-disable no-new */
import IndexedDB from "browserfs/dist/node/backend/IndexedDB";
import { FileFlag } from "browserfs/dist/node/core/file_flag";
import { Buffer } from "buffer";
import "../../scripts/PatchBrowserFSPreloadFile";
import { IFileManagerWorker } from "./FileMgrWorker.types";
import ProxyWorker from "./ProxyWorker";

class FileMgr extends ProxyWorker<IFileManagerWorker> {
    fs: IndexedDB;
    init() {
        return new Promise<true>((resolve, reject) => IndexedDB.Create({ storeName: "JSPatcher" }, (e, r) => {
            if (e) {
                reject(e);
            } else {
                this.fs = r;
                resolve(true);
            }
        }));
    }
    mkdir(path: string) {
        return new Promise<true>((resolve, reject) => this.fs.mkdir(path, 0o777, e => (e ? reject(e) : resolve(true))));
    }
    createFile(path: string, data: Uint8Array) {
        Object.setPrototypeOf(data, Buffer.prototype);
        return new Promise<true>((resolve, reject) => {
            this.fs.createFile(path, new FileFlag("w"), 0o777, (e, r) => (
                e ? reject(e) : r.write((data as Buffer), 0, data.byteLength, null, e => (
                    e ? reject(e) : r.close(e => (e ? reject(e) : resolve(true)))
                ))
            ));
        });
    }
    rename(oldPath: string, newPath: string) {
        return new Promise<true>((resolve, reject) => this.fs.rename(oldPath, newPath, e => (e ? reject(e) : resolve(true))));
    }
    exists(path: string) {
        return new Promise<boolean>(resolve => this.fs.exists(path, resolve));
    }
    readdir(path: string) {
        return new Promise<string[]>((resolve, reject) => this.fs.readdir(path, (e, r) => (e ? reject(e) : resolve(r))));
    }
    readFile(path: string) {
        return new Promise<ArrayBuffer>((resolve, reject) => this.fs.readFile(path, null, new FileFlag("r"), (e, r) => (e ? reject(e) : resolve((r as Buffer).buffer))));
    }
    unlink(path: string) {
        return new Promise<true>((resolve, reject) => this.fs.unlink(path, e => (e ? reject(e) : resolve(true))));
    }
    isFile(path: string) {
        return new Promise<boolean>((resolve, reject) => this.fs.stat(path, false, (e, r) => (e ? reject(e) : resolve(r.isFile()))));
    }
    empty() {
        return new Promise<true>((resolve, reject) => this.fs.empty(e => (e ? reject(e) : resolve(true))));
    }
}
new FileMgr();
