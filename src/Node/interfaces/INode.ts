import { NodeTypeEnum } from "../enums/NodeTypeEnum";

export interface INode {
    id: number;
    type: NodeTypeEnum;
    isInput:  boolean;
    isHidden: boolean;
    isOutput: boolean;

    equals(other: INode) : boolean;
}
