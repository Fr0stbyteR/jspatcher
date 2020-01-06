declare module "fftw-js" {
    export class FFT {
        size: number;
        rptr: number;
        cptr: number;
        r: Float32Array;
        c: Float32Array;
        fplan: number;
        iplan: number;
        forward(real: Parameters<Float32Array["set"]>[0]): Float32Array;
        inverse(cpx: Parameters<Float32Array["set"]>[0]): Float32Array;
        dispose(): void;
        constructor(size: number);
    }
    export class RFFT {
        size: number;
        rptr: number;
        cptr: number;
        r: Float32Array;
        c: Float32Array;
        fplan: number;
        iplan: number;
        forward(real: Parameters<Float32Array["set"]>[0]): Float32Array;
        inverse(cpx: Parameters<Float32Array["set"]>[0]): Float32Array;
        dispose(): void;
        constructor(size: number);
    }
}
