export interface WavEncoderOptions {
    bitDepth: number;
    float?: boolean;
    symmetric?: boolean;
    shared?: boolean;
    sampleRate: number;
}
export interface IWavEncoderWorker {
    encode(audioBuffer: Float32Array[], options: WavEncoderOptions): ArrayBuffer | SharedArrayBuffer;
}
