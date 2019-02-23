import { BaseObject, Bang } from "./Base";
import { Patcher } from "../Patcher";
import { Box } from "../Box";
class JSUnaryOp extends BaseObject {
    static get _meta() {
        return { ...BaseObject._meta,
            package: "Op",
            icon: "",
            description: "Unary Operation",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "First element"
            }],
            outlets: [{
                type: "anything",
                description: "Result"
            }]
        };
    }
    _mem: { result: any };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 1;
        this.outlets = 1;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) {
        this._mem.result = 0;
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0 && data instanceof Bang) {
            this.outlet(0, this._mem.result);
            return this;
        }
        if (inlet === 0) {
            try {
                this._mem.result = this.execute(data);
                this.outlet(0, this._mem.result);
            } catch (e) {
                this.error(e);
            }
        }
        return this;
    }
    execute(a: any) {
        return;
    }
}

class JSBinaryOp extends BaseObject {
    static get _meta() {
        return { ...BaseObject._meta,
            package: "Op",
            description: "Binary Operation",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "First element"
            }, {
                isHot: false,
                type: "anything",
                description: "Second element"
            }],
            outlets: [{
                type: "anything",
                description: "Result"
            }],
            args: [{
                type: "anything",
                optional: true,
                default: 0,
                description: "Initial second element"
            }]
        };
    }
    _mem: { arg: any, result: any };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 2;
        this.outlets = 1;
        this._mem.arg = 0;
        this._mem.result = 0;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) {
        this._mem.arg = 0;
        this._mem.result = 0;
        if (args.length === 0) return this;
        this._mem.arg = args[0];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0 && data instanceof Bang) {
            this.outlet(0, this._mem.result);
            return this;
        }
        if (inlet === 1) {
            this._mem.arg = data;
        }
        if (inlet === 0) {
            try {
                this._mem.result = this.execute(data, this._mem.arg);
                this.outlet(0, this._mem.result);
            } catch (e) {
                this.error(e);
            }
        }
        return this;
    }
    execute(a: any, b: any) {
        return;
    }
}

class JSTernaryOp extends BaseObject {
    static get _meta() {
        return { ...BaseObject._meta,
            package: "Op",
            description: "Ternary Operation",
            inlets: [{
                isHot: true,
                type: "anything",
                description: "Test"
            }, {
                isHot: false,
                type: "anything",
                description: "True output"
            }, {
                isHot: false,
                type: "anything",
                description: "False output"
            }],
            outlets: [{
                type: "anything",
                description: "Result"
            }],
            args: [{
                type: "anything",
                optional: true,
                default: true,
                description: "Initial true output"
            }, {
                type: "anything",
                optional: true,
                default: false,
                description: "Initial false output"
            }]
        };
    }
    _mem: { args: any[], result: any };
    constructor(box: Box, patcher: Patcher) {
        super(box, patcher);
        this.inlets = 3;
        this.outlets = 1;
        this._mem.args = [true, false];
        this._mem.result = true;
        this.update(box.parsed.args, box.parsed.props);
    }
    update(args: any[], props: { [key: string]: any }) {
        this._mem.args = [true, false];
        this._mem.result = true;
        if (args.length === 0) return this;
        this._mem.args[0] = args[0];
        this._mem.args[1] = args[1];
        return this;
    }
    fn(data: any, inlet: number) {
        if (inlet === 0 && data instanceof Bang) {
            this.outlet(0, this._mem.result);
            return this;
        }
        if (inlet === 1) {
            this._mem.args[0] = data;
        }
        if (inlet === 2) {
            this._mem.args[1] = data;
        }
        if (inlet === 0) {
            try {
                this._mem.result = data ? this._mem.args[0] : this._mem.args[1];
                this.outlet(0, this._mem.result);
            } catch (e) {
                this.error(e);
            }
        }
        return this;
    }
}

class Add extends JSBinaryOp {
    execute(a: any, b: any) {
        return a + b;
    }
}

class Sub extends JSBinaryOp {
    execute(a: any, b: any) {
        return a - b;
    }
}

class Mul extends JSBinaryOp {
    execute(a: any, b: any) {
        return a * b;
    }
}

class Div extends JSBinaryOp {
    execute(a: any, b: any) {
        return a / b;
    }
}

class Exp extends JSBinaryOp {
    execute(a: any, b: any) {
        return a ** b;
    }
}

class Mod extends JSBinaryOp {
    execute(a: any, b: any) {
        return a % b;
    }
}

class Inc extends JSUnaryOp {
    execute(a: any) {
        // tslint:disable-next-line: no-parameter-reassignment
        return ++a;
    }
}

class Dec extends JSUnaryOp {
    execute(a: any) {
        // tslint:disable-next-line: no-parameter-reassignment
        return --a;
    }
}

class Eql extends JSBinaryOp {
    execute(a: any, b: any) {
        // tslint:disable-next-line: triple-equals
        return a == b;
    }
}

class EqlS extends JSBinaryOp {
    execute(a: any, b: any) {
        return a === b;
    }
}

class NEql extends JSBinaryOp {
    execute(a: any, b: any) {
        // tslint:disable-next-line: triple-equals
        return a != b;
    }
}

class NEqlS extends JSBinaryOp {
    execute(a: any, b: any) {
        return a !== b;
    }
}

class Gtr extends JSBinaryOp {
    execute(a: any, b: any) {
        return a > b;
    }
}

class Geq extends JSBinaryOp {
    execute(a: any, b: any) {
        return a >= b;
    }
}

class Lss extends JSBinaryOp {
    execute(a: any, b: any) {
        return a < b;
    }
}

class Leq extends JSBinaryOp {
    execute(a: any, b: any) {
        return a <= b;
    }
}

class And extends JSBinaryOp {
    execute(a: any, b: any) {
        return a && b;
    }
}

class Or extends JSBinaryOp {
    execute(a: any, b: any) {
        return a || b;
    }
}

class Not extends JSUnaryOp {
    execute(a: any) {
        return !a;
    }
}

class Typeof extends JSUnaryOp {
    execute(a: any) {
        return typeof a;
    }
}

class Instanceof extends JSBinaryOp {
    execute(a: any, b: any) {
        return a instanceof b;
    }
}

export default {
    Typeof,
    Instanceof,
    "+": Add,
    "-": Sub,
    "*": Mul,
    "/": Div,
    "**": Exp,
    "%": Mod,
    "++": Inc,
    "--": Dec,
    "==": Eql,
    "===": EqlS,
    "!=": NEql,
    "!==": NEqlS,
    ">": Gtr,
    ">=": Geq,
    "<": Lss,
    "<=": Leq,
    "&&": And,
    "||": Or,
    "!": Not,
    "?": JSTernaryOp
};
