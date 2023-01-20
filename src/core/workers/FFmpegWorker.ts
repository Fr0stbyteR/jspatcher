import { createFFmpeg, FFmpeg, LogCallback, ProgressCallback } from "@ffmpeg/ffmpeg";
import TypedEventEmitter from "../../utils/TypedEventEmitter";

export interface FFmpegWorkerEventMap {
    "ready": never;
    "info": string;
    "ffout": string;
    "fferr": string;
    "progress": number;
}

export default class FFmpegWorker extends TypedEventEmitter<FFmpegWorkerEventMap> {
    ffmpeg: FFmpeg;
    isBusy = true;
    isReady = false;
    async init() {
        if (this.ffmpeg?.isLoaded) return;
        this.ffmpeg = createFFmpeg({ corePath: new URL("./deps/ffmpeg-core.js", location.href).href });
        await this.ffmpeg.load();
        const handleLogger = (e: Parameters<LogCallback>[0]) => this.emit(e.type as "info" | "fferr" | "ffout", e.message);
        const handleProgress = (e: Parameters<ProgressCallback>[0]) => this.emit("progress", e.ratio);
        this.ffmpeg.setLogger(handleLogger);
        this.ffmpeg.setProgress(handleProgress);
        this.isReady = true;
        this.isBusy = false;
    }
    async run({ data, input, output, args }: { data: Uint8Array; input: string; output: string; args: string[] }) {
        if (this.isBusy) {
            throw new Error("FFmpeg is busy");
        }
        this.isBusy = true;
        try {
            this.ffmpeg.FS("writeFile", input, data);
            await this.ffmpeg.run(...args);
            return this.ffmpeg.FS("readFile", output);
        } finally {
            this.isBusy = false;
        }
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
