import { IConnection } from "./interfaces/IConnection";
import { IConnectionId } from "./interfaces/IConnectionId";

export class Connection implements IConnection {
    id:  IConnectionId;
    in:  number;
    out: number;

    constructor(id: IConnectionId) {
        this.id  = id;
        this.in  = id.in;
        this.out = id.out;
    }

    equals(other: IConnection): boolean {
        return this.id.equals(other.id);
    }
}
