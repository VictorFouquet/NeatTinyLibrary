import { Innovation } from "../Innovation";
import { INodeVariation } from "./interfaces";
import { Node } from "./Node";

export class NodeVariation extends Node implements INodeVariation {
    x: number;
    bias: number;
    output: number;

    constructor(id: number, bias: number) {
        const node = Innovation.getNodeById(id);
        super(id, node.globalId, node.type);
        this.x = -1;
        this.bias = bias;
        this.output = 0;
    }

    mutate() : INodeVariation {
        const variation = this.copy();
        variation.bias = Math.random();

        return variation;
    }

    copy() : INodeVariation {
        return new NodeVariation(
            this.id,
            this.bias
        );
    }
};
