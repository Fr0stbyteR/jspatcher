declare module "fftw-js" {
    /**
     * http://www.fftw.org/fftw3_doc/One_002dDimensional-DFTs-of-Real-Data.html
     *
     * @export
     * @class FFT
     */
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
    /**
     * http://www.fftw.org/fftw3_doc/The-Halfcomplex_002dformat-DFT.html
     *
     * @export
     * @class RFFT
     */
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
