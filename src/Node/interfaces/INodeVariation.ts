import { INode } from "./INode";

export interface INodeVariation extends INode {
    bias: number;

    mutate(): INodeVariation;
    copy():   INodeVariation;
}
