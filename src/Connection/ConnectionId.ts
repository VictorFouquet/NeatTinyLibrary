import { IConnectionId } from "./interfaces";

export class ConnectionId implements IConnectionId {
    readonly in:  number;
    readonly out: number;
    private readonly _string: string;

    constructor(_in: number, out: number) {
        this.in = _in;
        this.out = out;
        this._string = `${_in}_${out}`;
    }

    equals(other: IConnectionId) : boolean {
        return this.in === other.in && this.out === other.out;
    }

    toString(): string {
        return this._string;
    }
}
