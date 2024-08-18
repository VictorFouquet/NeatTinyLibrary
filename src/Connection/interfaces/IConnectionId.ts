export interface IConnectionId {
    in:  number;
    out: number;

    equals(other: IConnectionId): boolean;
    toString(): string;
}
