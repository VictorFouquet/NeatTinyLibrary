import { IConnection } from "./IConnection";

export interface IConnectionVariation extends IConnection {
    weight:  number;
    enabled: boolean;

    copy():          IConnectionVariation;
    mutateWeight():  IConnectionVariation;
    shiftWeight():   IConnectionVariation;
    mutateEnabled(): IConnectionVariation;
}
