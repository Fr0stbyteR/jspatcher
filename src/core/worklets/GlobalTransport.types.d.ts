export interface IGlobalTransportProcessor {
    _getTick(): number;
    _setTick(tick: number): void;
    destroy(): void;
}

export interface IGlobalTransportNode {
    updateTick(tick: Uint32Array): void;
}

export type GlobalTransportParameter = "playing" | "timeSigNumerator" | "timeSigDenominator" | "tempo";
