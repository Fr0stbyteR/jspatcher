export default class Bang {
    isBang = true;
    toString() {
        return "bang";
    }
}

export const isBang = (x: any): x is Bang => typeof x === "object" && x?.isBang;
