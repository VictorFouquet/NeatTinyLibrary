import { NodeTypeEnum } from "../enums/NodeTypeEnum";

export interface INode {
    id: number;
    type: NodeTypeEnum;

    equals(other: INode) : boolean;

    isInput():  boolean;
    isHidden(): boolean;
    isOutput(): boolean;
}
