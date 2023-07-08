import Bang from "./objects/base/Bang";

export type Token = number | string | Bang;

export class Message extends Array<Token> {
    static from(tokens: Token[]) {
        const newArr = new Message();

        for (let i = 0; i < tokens.length; i++) {
            newArr[i] = tokens[i];
        }

        return newArr;
    }


    startsWith(value: Token) {
        if (this.length) {
            return this[0] === value;
        }
        return false;
    }

    endsWith(value: Token) {
        if (this.length) {
            return this[this.length - 1] === value;
        }
        return false;
    }

    // Produces a function that iterates over two lists,
    // performs the given operation on any pair of numbers,
    // and returns the shortest collection between the two
    arithmetic(op: (a: number, b: number) => number) {
        return (other: Message) => {
            const result = new Message();
            const minLength = Math.min(this.length, other.length);

            for (let i = 0; i < minLength; i++) {
                if (typeof this[i] === 'number' && typeof other[i] === 'number') {
                    result.push(op(this[i] as number, other[i] as number));
                } else {
                    result.push(this[i]);
                }
            }

            return result;
        }
    }
}

export function isMessage(value: any) {
    return value instanceof Message;
}

export function extractFirst(data: any) {
    if (data instanceof Message || data instanceof Array) {
        return data[0];
    } else {
        return data;
    }
}
