interface YinParams {
    threshold: number;
    sampleRate: number;
    probabilityThreshold: number;
}

const detect = (bufferIn: Float32Array, paramsIn?: Partial<YinParams>) => {
    const { threshold = 0.1, sampleRate = 48000, probabilityThreshold = 0.1 } = paramsIn;
    let bufferSize = 1;
    while (bufferSize < bufferIn.length) {
        bufferSize *= 2;
    }
    bufferSize /= 2;

    const yinBufferSize = bufferSize / 2;
    const yinBuffer = new Float32Array(yinBufferSize);

    let prob = 0;
    let tau;
    let delta;

    for (let t = 1; t < yinBufferSize; t++) {
        for (let i = 0; i < yinBufferSize; i++) {
            delta = bufferIn[i] - bufferIn[i + t];
            yinBuffer[t] += delta * delta;
        }
    }
    yinBuffer[0] = 1;
    yinBuffer[1] = 1;
    let runningSum = 0;
    for (let t = 1; t < yinBufferSize; t++) {
        runningSum += yinBuffer[t];
        yinBuffer[t] *= t / runningSum;
    }
    for (tau = 2; tau < yinBufferSize; tau++) {
        if (yinBuffer[tau] < threshold) {
            while (tau + 1 < yinBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
                tau++;
            }
            prob = 1 - yinBuffer[tau];
            break;
        }
    }
    if (tau === yinBufferSize || yinBuffer[tau] >= threshold) {
        return null;
    }
    if (prob < probabilityThreshold) {
        return null;
    }
    let betterTau;
    let x0;
    let x2;
    if (tau < 1) {
        x0 = tau;
    } else {
        x0 = tau - 1;
    }
    if (tau + 1 < yinBufferSize) {
        x2 = tau + 1;
    } else {
        x2 = tau;
    }
    if (x0 === tau) {
        if (yinBuffer[tau] <= yinBuffer[x2]) {
            betterTau = tau;
        } else {
            betterTau = x2;
        }
    } else if (x2 === tau) {
        if (yinBuffer[tau] <= yinBuffer[x0]) {
            betterTau = tau;
        } else {
            betterTau = x0;
        }
    } else {
        const s0 = yinBuffer[x0];
        const s1 = yinBuffer[tau];
        const s2 = yinBuffer[x2];
        betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
    }

    return sampleRate / betterTau;
};
export default detect;
