import AudioWorkletProxyProcessor from "./AudioWorkletProxyProcessor";
import type { AudioWorkletGlobalScope, TypedAudioParamDescriptor } from "./TypedAudioWorklet";
import type { GlobalTransportParameter, IGlobalTransportNode, IGlobalTransportProcessor } from "./GlobalTransport.types";
import type WorkletEnvProcessor from "./WorkletEnv.worklet";

const processorId = "__JSPatcher_GlobalTransport";
declare const globalThis: AudioWorkletGlobalScope & { SharedArrayBuffer: typeof SharedArrayBuffer | typeof ArrayBuffer; Atomics: typeof Atomics };
if (!globalThis.SharedArrayBuffer) globalThis.SharedArrayBuffer = ArrayBuffer;
const { registerProcessor, sampleRate, jspatcherEnv } = globalThis;

export default class GlobalTransportProcessor extends AudioWorkletProxyProcessor<IGlobalTransportProcessor, IGlobalTransportNode, GlobalTransportParameter> implements IGlobalTransportProcessor {
    static fnNames: (keyof IGlobalTransportNode)[] = ["updateTick"];
    static get parameterDescriptors(): TypedAudioParamDescriptor<GlobalTransportParameter>[] {
        return [{
            defaultValue: 0,
            maxValue: 1,
            minValue: 0,
            name: "playing"
        }, {
            defaultValue: 120,
            maxValue: 240,
            minValue: 1,
            name: "tempo"
        }, {
            defaultValue: 4,
            maxValue: 128,
            minValue: 1,
            name: "timeSigDenominator"
        }, {
            defaultValue: 4,
            maxValue: 128,
            minValue: 1,
            name: "timeSigNumerator"
        }];
    }
    private destroyed = false;
    private timeOffset = globalThis.currentTime;
    tickOffset = 0;
    private tempo = 60;
    private currentTick = new Uint32Array(new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT));
    private getSampsPerTick(tempo: number) {
        const secondsPerBeat = 60 / tempo;
        return secondsPerBeat * sampleRate / 240;
    }
    private getTickPerSamps(tempo: number) {
        const ticksPerMinute = tempo * 240;
        return ticksPerMinute / 60 / sampleRate;
    }
    constructor(options: AudioWorkletNodeOptions) {
        super(options);
        this.updateTick(this.currentTick);
        (jspatcherEnv as WorkletEnvProcessor).globalTransport = this;
    }
    _getTick() {
        return Atomics.load(this.currentTick, 0);
    }
    _setTick(tick: number) {
        this.tickOffset = tick;
        this.timeOffset = globalThis.currentTime;
        Atomics.store(this.currentTick, 0, ~~this.tickOffset);
        this.updateTick(this.currentTick);
    }
    getSamplesUntil(tick: number) {
        return this.getSampsPerTick(this.tempo) * (tick - this.tickOffset);
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<GlobalTransportParameter, Float32Array>) {
        if (this.destroyed) return false;
        if (!parameters.playing[0]) return true;
        const bufferSize = outputs[0][0].length;
        let tick = 0;
        if (parameters.tempo.length > 1) {
            for (let i = 0; i < parameters.tempo.length; i++) {
                const $tempo = parameters.tempo[i];
                const $ticks = this.getTickPerSamps($tempo);
                tick += $ticks;
            }
        } else {
            const $tempo = parameters.tempo[0];
            const $ticks = this.getTickPerSamps($tempo);
            tick += $ticks * bufferSize;
        }
        this.tempo = parameters.tempo[parameters.tempo.length - 1];
        this._setTick(this.tickOffset + tick);
        return true;
    }
    destroy() {
        this.destroyed = true;
        this._disposed = true;
    }
}

try {
    registerProcessor(processorId, GlobalTransportProcessor);
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
}
