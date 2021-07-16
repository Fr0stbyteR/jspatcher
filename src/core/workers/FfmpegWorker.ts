import type * as ffmpeg from "ffmpeg.js";
import TypedEventEmitter from "../../utils/TypedEventEmitter";

export interface FFmpegWorkerEventMap {
    "ready": never;
    "run": never;
    "stdout": string;
    "stderr": string;
    "exit": number;
    "done": ffmpeg.Result;
    "error": string;
    "abort": string;
}

export default class FFmpegWorker extends TypedEventEmitter<FFmpegWorkerEventMap> {
    worker: ffmpeg.Worker;
    isBusy = true;
    isReady = false;
    async init() {
        return new Promise<void>((resolve, reject) => {
            try {
                const handleReady = () => {
                    this.off("ready", handleReady);
                    this.isReady = true;
                    this.isBusy = false;
                    resolve();
                };
                this.on("ready", handleReady);
                this.worker = new Worker("./deps/ffmpeg.js-audio/ffmpeg-worker-audio.js");
                this.worker.onmessage = opts => this.emit(opts.data.type as keyof FFmpegWorkerEventMap, opts.data.data);
            } catch (e) {
                reject(e);
            }
        });
    }
    async run(opts: ffmpeg.Options) {
        if (this.isBusy) {
            return new Promise<ffmpeg.Result>((resolve, reject) => {
                const handleExit = async () => {
                    try {
                        const result = await this.run(opts);
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    } finally {
                        this.on("exit", handleExit);
                    }
                };
                this.on("exit", handleExit);
            });
        }
        this.isBusy = true;
        return new Promise<ffmpeg.Result>((resolve, reject) => {
            let log = "";
            let err: Error;
            const handleDone = (result: ffmpeg.Result) => {
                this.off("done", handleDone);
                this.off("stdout", handleStd);
                this.off("stderr", handleStd);
                this.off("exit", handleExit);
                if (err) reject(err);
                else resolve(result);
            };
            const handleStd = (msg: string) => {
                log += `${msg}\n`;
            };
            const handleExit = (code: number) => {
                this.isBusy = false;
                if (code) err = new Error(log);
            };
            this.worker.postMessage({ type: "run", ...opts });
            this.on("done", handleDone);
            this.on("stdout", handleStd);
            this.on("stderr", handleStd);
            this.on("exit", handleExit);
        });
    }
}
/*
ch1 = shengEnv.editor.currentFileState.buffer.getChannelData(0);
ch2 = shengEnv.editor.currentFileState.buffer.getChannelData(1);
ab = new ArrayBuffer(ch1.byteLength + ch2.byteLength);
f32View = new Float32Array(ab);
f32View.set(ch1);
f32View.set(ch2, ch1.length)
inputFileName = "test.f32le"; outputFileName = "out.wav";
res = shengEnv.fileMgr.state.ffmpeg({
    MEMFS: [{ data: ab, name: inputFileName }],
    arguments: ["-f", "f32le_planar", "-ac", "2", "-ar", "48000", "-i", inputFileName, outputFileName]
});
temp1 = res.MEMFS[0].data
*/
