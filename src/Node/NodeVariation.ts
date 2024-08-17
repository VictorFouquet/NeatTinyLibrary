import { NodeTypeEnum } from "./enums/NodeTypeEnum";
import { INodeVariation } from "./interfaces";
import { Node } from "./Node";

export class NodeVariation extends Node implements INodeVariation {
    bias: number;

    constructor(id: number, type: NodeTypeEnum, bias: number) {
        super(id, type);
        this.bias = bias;
    }

    mutate() : NodeVariation {
        const variation = this.copy();
        variation.bias = Math.random();

        return variation;
    }

    copy() : NodeVariation {
        return new NodeVariation(
            this.id,
            this.type,
            this.bias
        );
    }
};
