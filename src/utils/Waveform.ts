import PatcherAudio from "../core/audio/PatcherAudio";
import { WaveformData, WaveformStepData } from "../core/types";
import WaveformWorker from "../core/workers/WaveformWorker";

export default class Waveform implements WaveformData {
    static stepsFactor = 16;
    [step: number]: WaveformStepData;
    worker: WaveformWorker;
    private readonly patcherAudio: PatcherAudio;

    constructor(patcherAudioIn: PatcherAudio, waveformDataIn?: WaveformData) {
        this.worker = patcherAudioIn.env.waveformWorker;
        this.patcherAudio = patcherAudioIn;
        if (!waveformDataIn) return;
        Object.keys(waveformDataIn).filter(v => +v).map(v => +v).forEach((stepLength) => {
            const stepData = waveformDataIn[stepLength];
            this[stepLength] = [];
            const newStepData = this[stepLength];
            if (stepData.length) newStepData.idx = stepData.idx.slice();
            for (let c = 0; c < stepData.length; c++) {
                const { min, max } = stepData[c];
                newStepData[c] = { min: min.slice(), max: max.slice() };
            }
        });
    }
    get audioBuffer() {
        return this.patcherAudio.audioBuffer;
    }
    get length() {
        return this.audioBuffer.length;
    }
    clone() {
        return new Waveform(this.patcherAudio, this);
    }
    async generate() {
        const audioChannelData = this.audioBuffer.toArray(true);
        const data = await this.worker.generate(audioChannelData, Waveform.stepsFactor);
        for (const key in data) {
            this[key] = data[key];
        }
    }
    generateEmpty(numberOfChannels: number, l: number) {
        const { stepsFactor } = Waveform;
        for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
            const stepData: WaveformStepData = [];
            this[stepLength] = stepData;
            const stepsCount = Math.ceil(l / stepLength);
            const idxData = new Int32Array(stepsCount);
            for (let i = 0; i < idxData.length; i++) {
                idxData[i] = i * stepLength;
            }
            stepData.idx = idxData;
            for (let c = 0; c < numberOfChannels; c++) {
                const minData = new Float32Array(stepsCount);
                const maxData = new Float32Array(stepsCount);
                stepData[c] = { min: minData, max: maxData };
            }
        }
    }
    generateStep(stepLength: number) {
        const { stepsFactor } = Waveform;
        const { audioBuffer: buffer } = this;
        if (!this[stepLength]) this[stepLength] = [];
        const l = buffer.length;
        let maxInStep;
        let minInStep;
        if (stepLength === stepsFactor) { // recalculate from samples
            const stepsCount = Math.ceil(l / stepLength);
            const idxData = new Int32Array(stepsCount);
            for (let i = 0; i < idxData.length; i++) {
                idxData[i] = i * stepLength;
            }
            this[stepLength].idx = idxData;
            for (let c = 0; c < buffer.numberOfChannels; c++) {
                const minData = new Float32Array(stepsCount);
                const maxData = new Float32Array(stepsCount);
                const channel = buffer.getChannelData(c);
                for (let i = 0; i < idxData.length; i++) {
                    const $0 = idxData[i];
                    const $1 = i === idxData.length - 1 ? l : idxData[i + 1];
                    for (let j = $0; j < $1; j++) {
                        const samp = channel[j];
                        if (j === $0) {
                            maxInStep = samp;
                            minInStep = samp;
                        } else {
                            if (samp > maxInStep) maxInStep = samp;
                            if (samp < minInStep) minInStep = samp;
                        }
                    }
                    minData[i] = minInStep;
                    maxData[i] = maxInStep;
                }
                this[stepLength][c] = { min: minData, max: maxData };
            }
        } else { // calculate from lower level
            const { idx: prevIdx } = this[stepLength / stepsFactor];
            const stepsCount = Math.ceil(prevIdx.length / 16);
            const idxData = new Int32Array(stepsCount);
            for (let i = 0; i < idxData.length; i++) {
                idxData[i] = prevIdx[i * stepsFactor];
            }
            this[stepLength].idx = idxData;
            for (let c = 0; c < buffer.numberOfChannels; c++) {
                const minData = new Float32Array(stepsCount);
                const maxData = new Float32Array(stepsCount);
                const { min: prevMin, max: prevMax } = this[stepLength / stepsFactor][c];
                for (let i = 0; i < idxData.length; i++) {
                    const $prev0 = i * stepsFactor;
                    const $prev1 = i === idxData.length - 1 ? prevIdx.length : ((i + 1) * stepsFactor);
                    for (let j = $prev0; j < $prev1; j++) {
                        const sampMax = prevMax[j];
                        const sampMin = prevMin[j];
                        if (j === $prev0) {
                            maxInStep = sampMax;
                            minInStep = sampMin;
                        } else {
                            if (sampMax > maxInStep) maxInStep = sampMax;
                            if (sampMin < minInStep) minInStep = sampMin;
                        }
                    }
                    minData[i] = minInStep;
                    maxData[i] = maxInStep;
                }
                this[stepLength][c] = { min: minData, max: maxData };
            }
        }
        return this[stepLength];
    }
    update(from = 0, to = this.audioBuffer.length) {
        const { stepsFactor } = Waveform;
        const { audioBuffer: buffer } = this;
        const l = buffer.length;
        for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
            let stepData: WaveformStepData;
            if (this[stepLength]) {
                stepData = this[stepLength];
                let { idx: idxData } = stepData;
                // check if need expansion
                let expand = 0;
                const oldLength = idxData[idxData.length - 1] + stepLength;
                if (l > oldLength) {
                    expand = Math.ceil((l - oldLength) / stepLength);
                    const newLength = idxData.length + expand;
                    const newIdxData = new Int32Array(newLength);
                    newIdxData.set(idxData);
                    for (let i = idxData.length, j = oldLength; i < newIdxData.length; i++, j += stepLength) {
                        newIdxData[i] = j;
                    }
                    idxData = newIdxData;
                }
                stepData.idx = idxData;
                for (let c = 0; c < buffer.numberOfChannels; c++) {
                    const samples = buffer.getChannelData(c);
                    let { min: minData, max: maxData } = stepData[c];
                    if (expand) {
                        const min = new Float32Array(idxData.length);
                        const max = new Float32Array(idxData.length);
                        min.set(minData);
                        max.set(maxData);
                        minData = min;
                        maxData = max;
                        stepData[c] = { min: minData, max: maxData };
                    }
                    // index range to rebuild data
                    let $from: number;
                    let $to: number;
                    for (let i = 1; i <= idxData.length; i++) {
                        const $ = i === idxData.length ? l : idxData[i];
                        if (typeof $from === "undefined" && $ > from) {
                            $from = i - 1;
                        }
                        if (typeof $to === "undefined" && $ >= to) {
                            $to = i;
                            break;
                        }
                    }
                    let maxInStep;
                    let minInStep;
                    if (stepLength === stepsFactor) { // recalculate from samples
                        for (let i = $from; i < $to; i++) {
                            const $0 = idxData[i];
                            const $1 = i === idxData.length - 1 ? l : idxData[i + 1];
                            for (let j = $0; j < $1; j++) {
                                const samp = samples[j];
                                if (j === $0) {
                                    maxInStep = samp;
                                    minInStep = samp;
                                } else {
                                    if (samp > maxInStep) maxInStep = samp;
                                    if (samp < minInStep) minInStep = samp;
                                }
                            }
                            minData[i] = minInStep;
                            maxData[i] = maxInStep;
                        }
                    } else {
                        const { idx: prevIdx } = this[stepLength / stepsFactor];
                        const { min: prevMin, max: prevMax } = this[stepLength / stepsFactor][c];
                        for (let i = $from; i < $to; i++) {
                            let $prev0 = Math.min(prevIdx.length - 1, i * stepsFactor);
                            const idx0 = idxData[i];
                            if (prevIdx[$prev0] < idx0) {
                                do {
                                    $prev0++;
                                } while ($prev0 < prevIdx.length - 1 && prevIdx[$prev0] < idx0);
                            } else if (prevIdx[$prev0] > idx0) {
                                do {
                                    $prev0--;
                                } while ($prev0 > 0 && prevIdx[$prev0] > idx0);
                            }
                            let $prev1;
                            if (i === idxData.length - 1) {
                                $prev1 = prevIdx.length;
                            } else {
                                $prev1 = Math.min(prevIdx.length, (i + 1) * stepsFactor);
                                const idx1 = idxData[i + 1];
                                if (prevIdx[$prev1] < idx1) {
                                    do {
                                        $prev1++;
                                    } while ($prev1 < prevIdx.length && prevIdx[$prev1] < idx1);
                                } else if (prevIdx[$prev1] > idx1) {
                                    do {
                                        $prev1--;
                                    } while ($prev1 > 1 && prevIdx[$prev1] > idx1);
                                }
                            }
                            for (let j = $prev0; j < $prev1; j++) {
                                const sampMin = prevMin[j];
                                const sampMax = prevMax[j];
                                if (j === $prev0) {
                                    maxInStep = sampMax;
                                    minInStep = sampMin;
                                } else {
                                    if (sampMax > maxInStep) maxInStep = sampMax;
                                    if (sampMin < minInStep) minInStep = sampMin;
                                }
                            }
                            minData[i] = minInStep;
                            maxData[i] = maxInStep;
                        }
                    }
                }
            } else {
                this.generateStep(stepLength);
            }
        }
    }
    inverse() {
        Object.keys(this).filter(v => +v).map(v => +v).forEach((stepLength) => {
            const stepData = this[stepLength];
            for (let c = 0; c < stepData.length; c++) {
                const { min, max } = stepData[c];
                for (let i = 0; i < min.length; i++) {
                    const $max = -min[i];
                    const $min = -max[i];
                    min[i] = $min;
                    max[i] = $max;
                }
            }
        });
    }
    reverse() {
        Object.keys(this).filter(v => +v).map(v => +v).forEach((stepLength) => {
            const stepData = this[stepLength];
            if (stepData.length) {
                const { idx } = stepData;
                idx.reverse();
                for (let i = 0; i < idx.length; i++) {
                    idx[i] = length - idx[i];
                }
                idx.set(idx.subarray(0, -1), 1);
                idx[0] = 0;
            }
            for (let c = 0; c < stepData.length; c++) {
                const { min, max } = stepData[c];
                min.reverse();
                max.reverse();
            }
        });
    }
    /**
     * Returns a new Waveform instance concatenating this and another waveform
     *
     * @param {Waveform} that waveform to concat
     * @param {PatcherAudio} patcherAudio result PatcherAudio
     * @param {number} [numberOfChannels=patcherAudio.audioBuffer.numberOfChannels] number of channels
     */
    concat(that: Waveform, patcherAudio: PatcherAudio, numberOfChannels: number = patcherAudio.audioBuffer.numberOfChannels) {
        const { stepsFactor } = Waveform;
        const { length: l } = patcherAudio.audioBuffer;
        const from = this.length;
        const waveform = new Waveform(patcherAudio);
        for (let stepLength = stepsFactor; stepLength <= l / stepsFactor; stepLength *= stepsFactor) {
            const stepData: WaveformStepData = [];
            let stepData1 = this[stepLength];
            let stepData2 = that[stepLength];
            waveform[stepLength] = stepData;
            if (!stepData1) { // recalculate data1
                stepData1 = this.generateStep(stepLength);
            }
            if (!stepData2) { // recalculate data2
                stepData2 = that.generateStep(stepLength);
            }
            const { idx: idxData1 } = stepData1;
            const { idx: idxData2 } = stepData2;
            const idxData = new Int32Array(idxData1.length + idxData2.length);
            idxData.set(idxData1);
            idxData.set(idxData2, idxData1.length);
            for (let j = idxData1.length; j < idxData.length; j++) {
                idxData[j] += from;
            }
            stepData.idx = idxData;
            for (let c = 0; c < numberOfChannels; c++) {
                const { min: minData1, max: maxData1 } = stepData1[c] || {};
                const { min: minData2, max: maxData2 } = stepData2[c] || {};
                const minData = new Float32Array(idxData1.length + idxData2.length);
                const maxData = new Float32Array(idxData1.length + idxData2.length);
                if (minData1) minData.set(minData1);
                if (minData2) minData.set(minData2, idxData1.length);
                if (maxData1) maxData.set(maxData1);
                if (maxData2) maxData.set(maxData2, idxData1.length);
                stepData[c] = { min: minData, max: maxData };
            }
        }
        return waveform;
    }
    /**
     * Split this Waveform into two instances.
     *
     * @param {number} from Split point in sample
     * @param {PatcherAudio} patcherAudio1 Splitted PatcherAudio 1
     * @param {PatcherAudio} patcherAudio2 Splitted PatcherAudio 2
     * @returns {[Waveform, Waveform]} Splitted Waveforms
     */
    split(from: number, patcherAudio1: PatcherAudio, patcherAudio2: PatcherAudio): [Waveform, Waveform] {
        const { audioBuffer: buffer } = this;
        const l = buffer.length;
        if (from >= l || from <= 0) throw new RangeError("Split point is out of bound");
        const { audioBuffer: audioBuffer1 } = patcherAudio1;
        const { audioBuffer: audioBuffer2 } = patcherAudio2;
        // split waveform
        const waveform1 = new Waveform(patcherAudio1);
        const waveform2 = new Waveform(patcherAudio2);
        const waveformKeys = Object.keys(this).filter(v => +v).map(v => +v).sort((a, b) => a - b);
        for (let i = 0; i < waveformKeys.length; i++) {
            const stepLength = waveformKeys[i];
            const stepData = this[stepLength];
            const stepData1: WaveformStepData = [];
            const stepData2: WaveformStepData = [];
            waveform1[stepLength] = stepData1;
            waveform2[stepLength] = stepData2;
            const { idx } = stepData;
            let $data: number; // index of data to split from, next buffer index if split between
            let splitBetween = false;
            for (let i = 1; i <= idx.length; i++) {
                const $ = i === idx.length ? l : idx[i];
                if ($ >= from) {
                    splitBetween = $ !== from;
                    $data = i;
                    break;
                }
            }
            // split index data for every channel
            let idxData1 = idx.slice();
            let idxData2 = idx.slice();
            if ($data !== idx.length) {
                idxData1 = idxData1.subarray(0, $data);
            }
            if ($data - 1 !== 0) {
                idxData2 = idxData2.subarray($data - +splitBetween);
                for (let j = 0; j < idxData2.length; j++) {
                    idxData2[j] = j === 0 ? 0 : idxData2[j] - from;
                }
            }
            stepData1.idx = idxData1;
            stepData2.idx = idxData2;
            for (let c = 0; c < buffer.numberOfChannels; c++) {
                // split data
                let { min: minData1, max: maxData1 } = stepData[c];
                if ($data !== idx.length) {
                    minData1 = minData1.subarray(0, $data);
                    maxData1 = maxData1.subarray(0, $data);
                }
                stepData1[c] = { min: minData1, max: maxData1 };
                let { min: minData2, max: maxData2 } = stepData[c];
                if ($data - 1 !== 0) {
                    minData2 = minData2.subarray($data - +splitBetween);
                    maxData2 = maxData2.subarray($data - +splitBetween);
                }
                stepData2[c] = { min: minData2, max: maxData2 };
                // recalculate
                if (splitBetween) {
                    let maxInStep;
                    let minInStep;
                    if (i === 0) { // calculate from samples
                        // ending of first part
                        const channel1 = audioBuffer1.getChannelData(c);
                        for (let j = idxData1[idxData1.length - 1]; j < from; j++) {
                            const samp = channel1[j];
                            if (j === 0) {
                                maxInStep = samp;
                                minInStep = samp;
                            } else {
                                if (samp > maxInStep) maxInStep = samp;
                                if (samp < minInStep) minInStep = samp;
                            }
                        }
                        minData1[idxData1.length - 1] = minInStep;
                        maxData1[idxData1.length - 1] = maxInStep;
                        // starting of second part
                        const channel2 = audioBuffer2.getChannelData(c);
                        for (let j = 0; j < (idxData2.length === 1 ? audioBuffer2.length : idxData2[1]); j++) {
                            const samp = channel2[j];
                            if (j === 0) {
                                maxInStep = samp;
                                minInStep = samp;
                            } else {
                                if (samp > maxInStep) maxInStep = samp;
                                if (samp < minInStep) minInStep = samp;
                            }
                        }
                        minData2[0] = minInStep;
                        maxData2[0] = maxInStep;
                    } else { // calculate from lower level
                        const { idx: prevIdx1 } = waveform1[waveformKeys[i - 1]];
                        const { min: prevMin1, max: prevMax1 } = waveform1[waveformKeys[i - 1]][c];
                        // ending of first part
                        let $prev1 = prevIdx1.length - 1;
                        const idx1 = idxData1[idxData1.length - 1];
                        while (prevIdx1[$prev1] > idx1) {
                            $prev1--;
                        }
                        for (let k = $prev1; k < prevIdx1.length; k++) {
                            const sampMax = prevMax1[k];
                            const sampMin = prevMin1[k];
                            if (k === $prev1) {
                                maxInStep = sampMax;
                                minInStep = sampMin;
                            } else {
                                if (sampMax > maxInStep) maxInStep = sampMax;
                                if (sampMin < minInStep) minInStep = sampMin;
                            }
                        }
                        minData1[idxData1.length - 1] = minInStep;
                        maxData1[idxData1.length - 1] = maxInStep;
                        const { idx: prevIdx2 } = waveform2[waveformKeys[i - 1]];
                        const { min: prevMin2, max: prevMax2 } = waveform2[waveformKeys[i - 1]][c];
                        // starting of second part
                        let $prev2 = 1;
                        if (idxData2.length > 1) {
                            const idx2 = idxData2[1];
                            while (prevIdx2[$prev2] < idx2) {
                                $prev2++;
                            }
                        }
                        for (let k = 0; k < $prev2; k++) {
                            const sampMax = prevMax2[k];
                            const sampMin = prevMin2[k];
                            if (k === $prev2) {
                                maxInStep = sampMax;
                                minInStep = sampMin;
                            } else {
                                if (sampMax > maxInStep) maxInStep = sampMax;
                                if (sampMin < minInStep) minInStep = sampMin;
                            }
                        }
                        minData2[0] = minInStep;
                        maxData2[0] = maxInStep;
                    }
                }
            }
        }
        return [waveform1, waveform2];
    }
}
