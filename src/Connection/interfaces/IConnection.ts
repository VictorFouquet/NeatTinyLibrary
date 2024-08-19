import { IConnectionId } from "./IConnectionId";

export interface IConnection {
    id:       IConnectionId;
    globalId: number
    in:       number;
    out:      number;

    equals(other: IConnection): boolean;
}
