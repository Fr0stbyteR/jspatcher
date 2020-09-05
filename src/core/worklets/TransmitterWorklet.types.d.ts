export interface ITransmitterProcessor {
    reset(): void;
    start(): void;
    stop(): void;
    destroy(): void;
}
export interface ITransmitterNode {
    setBuffer(e: { buffer: Float32Array[]; $total: number }): void;
}
export type TransmitterParameters = never;
