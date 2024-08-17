import { NodeTypeEnum } from "./enums";
import { INode } from "./interfaces";

export class Node implements INode {
    id:   number;
    type: NodeTypeEnum;

    constructor(id: number, type: NodeTypeEnum) {
        this.id   = id;
        this.type = type;
    }

    isInput():  boolean { return this.type === NodeTypeEnum.Input; }
    isHidden(): boolean { return this.type === NodeTypeEnum.Hidden; }
    isOutput(): boolean { return this.type === NodeTypeEnum.Output; }

    equals(other: Node): boolean { return this.id === other.id; }
}
