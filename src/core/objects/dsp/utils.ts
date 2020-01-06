export const energy = (signal: Float32Array) => {
    let sum = 0;
    let sample = 0;
    for (let i = 0; i < signal.length; i++) {
        sample = signal[i];
        sum += sample * sample;
    }
    return sum;
};
export const rms = (signal: Float32Array) => Math.sqrt(energy(signal) / signal.length);
