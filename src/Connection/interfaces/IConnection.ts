import { IConnectionId } from "./IConnectionId";

export interface IConnection {
    id:  IConnectionId;
    in:  number;
    out: number;

    equals(other: IConnection): boolean;
}
