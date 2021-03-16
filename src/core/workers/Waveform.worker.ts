import { IWaveformWorker } from "./WaveformWorker.types";
import { WaveformData, WaveformStepData } from "../types";
import ProxyWorker from "./ProxyWorker";

const SAB = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;
class Waveform extends ProxyWorker<IWaveformWorker> implements IWaveformWorker {
    generate(buffer: Float32Array[], stepsFactor = 16) {
        const waveformData: WaveformData = {};
        if (buffer.length === 0) return waveformData;
        const l = buffer[0].length;
        for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
            const stepData: WaveformStepData = [];
            waveformData[stepLength] = stepData;
            const stepsCount = Math.ceil(l / stepLength);
            const idxData = new Int32Array(new SAB(stepsCount * Int32Array.BYTES_PER_ELEMENT));
            for (let i = 0; i < idxData.length; i++) {
                idxData[i] = i * stepLength;
            }
            stepData.idx = idxData;
            for (let channel = 0; channel < buffer.length; channel++) {
                const samples = buffer[channel];
                const minData = new Float32Array(new SAB(stepsCount * Float32Array.BYTES_PER_ELEMENT));
                const maxData = new Float32Array(new SAB(stepsCount * Float32Array.BYTES_PER_ELEMENT));
                stepData[channel] = { min: minData, max: maxData };
                let maxInStep: number;
                let minInStep: number;
                let $step: number;
                let step: number;
                if (stepLength === stepsFactor) {
                    let samp: number;
                    for (let i = 0; i < l; i++) {
                        samp = samples[i];
                        $step = i % stepsFactor;
                        step = ~~(i / stepsFactor);
                        if ($step === 0) {
                            maxInStep = samp;
                            minInStep = samp;
                        } else {
                            if (samp > maxInStep) maxInStep = samp;
                            if (samp < minInStep) minInStep = samp;
                        }
                        if ($step === stepsFactor - 1 || $step === l - 1) {
                            minData[step] = minInStep;
                            maxData[step] = maxInStep;
                        }
                    }
                } else {
                    const { idx: prevIdx } = waveformData[stepLength / stepsFactor];
                    const { min: prevMin, max: prevMax } = waveformData[stepLength / stepsFactor][channel];
                    let sampMin: number;
                    let sampMax: number;
                    for (let i = 0; i < prevIdx.length; i++) {
                        sampMin = prevMin[i];
                        sampMax = prevMax[i];
                        $step = i % stepsFactor;
                        step = ~~(i / stepsFactor);
                        if ($step === 0) {
                            maxInStep = sampMax;
                            minInStep = sampMin;
                        } else {
                            if (sampMax > maxInStep) maxInStep = sampMax;
                            if (sampMin < minInStep) minInStep = sampMin;
                        }
                        if ($step === stepsFactor - 1) {
                            minData[step] = minInStep;
                            maxData[step] = maxInStep;
                        }
                    }
                }
            }
        }
        return waveformData;
    }
}
// eslint-disable-next-line no-new
new Waveform();
