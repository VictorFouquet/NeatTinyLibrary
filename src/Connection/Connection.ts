import { IConnection, IConnectionId } from "./interfaces";

export class Connection implements IConnection {
    readonly id:       IConnectionId;
    readonly in:       number;
    readonly out:      number;
    readonly globalId: number;

    constructor(id: IConnectionId, globalId: number) {
        this.id  = id;
        this.in  = id.in;
        this.out = id.out;
        this.globalId = globalId
    }

    equals(other: IConnection): boolean {
        return this.id.equals(other.id);
    }
}
