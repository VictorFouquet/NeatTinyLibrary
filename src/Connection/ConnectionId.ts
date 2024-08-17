import { IConnectionId } from "./interfaces/IConnectionId";

export class ConnectionId implements IConnectionId {
    readonly in:  number;
    readonly out: number;

    constructor(_in: number, out: number) {
        this.in = _in;
        this.out = out;
    }

    equals(other: IConnectionId) : boolean {
        return this.in === other.in && this.out === other.out;
    }
}
