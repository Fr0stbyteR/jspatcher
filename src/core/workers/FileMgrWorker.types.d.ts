export interface IFileManagerWorker {
    init(): Promise<true>;
    mkdir(path: string): Promise<true>;
    createFile(path: string, data: Uint8Array): Promise<true>;
    rename(oldPath: string, newPath: string): Promise<true>;
    exists(path: string): Promise<boolean>;
    readdir(path: string): Promise<string[]>;
    readFile(path: string): Promise<ArrayBuffer>;
    unlink(path: string): Promise<true>;
    isFile(path: string): Promise<boolean>;
}
