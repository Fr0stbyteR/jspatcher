export interface Options {
    bitDepth: number;
    float?: boolean;
    symmetric?: boolean;
    shared?: boolean;
    sampleRate: number;
}
interface Format {
    formatId: number;
    float: boolean;
    symmetric: boolean;
    numberOfChannels: number;
    sampleRate: number;
    length: number;
    bitDepth: number;
    byteDepth: number;
}

export default class WavEncoder {
    static encode(audioBuffer: Float32Array[], options: Options) {
        const numberOfChannels = audioBuffer.length;
        const length = audioBuffer[0].length;
        const { shared, float } = options;
        const bitDepth = float ? 32 : ((options.bitDepth | 0) || 16);
        const byteDepth = bitDepth >> 3;
        const byteLength = length * numberOfChannels * byteDepth;
        // eslint-disable-next-line no-undef
        const AB = shared ? (globalThis.SharedArrayBuffer || globalThis.ArrayBuffer) : globalThis.ArrayBuffer;
        const ab = new AB((44 + byteLength) * Uint8Array.BYTES_PER_ELEMENT);
        const dataView = new DataView(ab);
        const writer = new Writer(dataView);
        const format: Format = {
            formatId: float ? 0x0003 : 0x0001,
            float,
            numberOfChannels,
            sampleRate: options.sampleRate,
            symmetric: !!options.symmetric,
            length,
            bitDepth,
            byteDepth
        };
        this.writeHeader(writer, format);
        this.writeData(writer, audioBuffer, format);
        return ab;
    }
    private static writeHeader(writer: Writer, format: Format) {
        const { formatId, sampleRate, bitDepth, numberOfChannels, length, byteDepth } = format;
        writer.string("RIFF");
        writer.uint32(writer.dataView.byteLength - 8);
        writer.string("WAVE");
        writer.string("fmt ");
        writer.uint32(16);
        writer.uint16(formatId);
        writer.uint16(numberOfChannels);
        writer.uint32(sampleRate);
        writer.uint32(sampleRate * numberOfChannels * byteDepth);
        writer.uint16(numberOfChannels * byteDepth);
        writer.uint16(bitDepth);
        writer.string("data");
        writer.uint32(length * numberOfChannels * byteDepth);
        return writer.pos;
    }
    private static writeData(writer: Writer, audioBuffer: Float32Array[], format: Format) {
        const { bitDepth, float, length, numberOfChannels, symmetric } = format;
        if (bitDepth === 32 && float) {
            const { dataView, pos } = writer;
            const ab = dataView.buffer;
            const f32View = new Float32Array(ab, pos);
            if (numberOfChannels === 1) {
                f32View.set(audioBuffer[0]);
                return;
            }
            for (let ch = 0; ch < numberOfChannels; ch++) {
                const channel = audioBuffer[ch];
                for (let i = 0; i < length; i++) {
                    f32View[i * numberOfChannels + ch] = channel[i];
                }
            }
            return;
        }
        const encoderOption = float ? "f" : symmetric ? "s" : "";
        const methodName = "pcm" + bitDepth + encoderOption;

        if (!(writer as any)[methodName]) {
            throw new TypeError("Not supported bit depth: " + bitDepth);
        }

        const write = (writer as any)[methodName].bind(writer);

        writer.string("data");
        writer.uint32(length);

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < numberOfChannels; j++) {
                write(audioBuffer[j][i]);
            }
        }
    }
}

class Writer {
    pos = 0;
    dataView: DataView;
    constructor(dataView: DataView) {
        this.dataView = dataView;
    }
    int16(value: number) {
        this.dataView.setInt16(this.pos, value, true);
        this.pos += 2;
    }
    uint16(value: number) {
        this.dataView.setUint16(this.pos, value, true);
        this.pos += 2;
    }
    uint32(value: number) {
        this.dataView.setUint32(this.pos, value, true);
        this.pos += 4;
    }
    string(value: string) {
        for (let i = 0, imax = value.length; i < imax; i++) {
            this.dataView.setUint8(this.pos++, value.charCodeAt(i));
        }
    }
    pcm8(valueIn: number) {
        let value = valueIn;
        value = Math.max(-1, Math.min(value, +1));
        value = (value * 0.5 + 0.5) * 255;
        value = Math.round(value) | 0;
        this.dataView.setUint8(this.pos, value/* , true*/);
        this.pos += 1;
    }
    pcm8s(valueIn: number) {
        let value = valueIn;
        value = Math.round(value * 128) + 128;
        value = Math.max(0, Math.min(value, 255));
        this.dataView.setUint8(this.pos, value/* , true*/);
        this.pos += 1;
    }
    pcm16(valueIn: number) {
        let value = valueIn;
        value = Math.max(-1, Math.min(value, +1));
        value = value < 0 ? value * 32768 : value * 32767;
        value = Math.round(value) | 0;
        this.dataView.setInt16(this.pos, value, true);
        this.pos += 2;
    }
    pcm16s(valueIn: number) {
        let value = valueIn;
        value = Math.round(value * 32768);
        value = Math.max(-32768, Math.min(value, 32767));
        this.dataView.setInt16(this.pos, value, true);
        this.pos += 2;
    }
    pcm24(valueIn: number) {
        let value = valueIn;
        value = Math.max(-1, Math.min(value, +1));
        value = value < 0 ? 0x1000000 + value * 8388608 : value * 8388607;
        value = Math.round(value) | 0;

        const x0 = (value >> 0) & 0xFF;
        const x1 = (value >> 8) & 0xFF;
        const x2 = (value >> 16) & 0xFF;

        this.dataView.setUint8(this.pos + 0, x0);
        this.dataView.setUint8(this.pos + 1, x1);
        this.dataView.setUint8(this.pos + 2, x2);
        this.pos += 3;
    }
    pcm24s(valueIn: number) {
        let value = valueIn;
        value = Math.round(value * 8388608);
        value = Math.max(-8388608, Math.min(value, 8388607));

        const x0 = (value >> 0) & 0xFF;
        const x1 = (value >> 8) & 0xFF;
        const x2 = (value >> 16) & 0xFF;

        this.dataView.setUint8(this.pos + 0, x0);
        this.dataView.setUint8(this.pos + 1, x1);
        this.dataView.setUint8(this.pos + 2, x2);
        this.pos += 3;
    }
    pcm32(valueIn: number) {
        let value = valueIn;
        value = Math.max(-1, Math.min(value, +1));
        value = value < 0 ? value * 2147483648 : value * 2147483647;
        value = Math.round(value) | 0;
        this.dataView.setInt32(this.pos, value, true);
        this.pos += 4;
    }
    pcm32s(valueIn: number) {
        let value = valueIn;
        value = Math.round(value * 2147483648);
        value = Math.max(-2147483648, Math.min(value, +2147483647));
        this.dataView.setInt32(this.pos, value, true);
        this.pos += 4;
    }
    pcm32f(value: number) {
        this.dataView.setFloat32(this.pos, value, true);
        this.pos += 4;
    }
}
