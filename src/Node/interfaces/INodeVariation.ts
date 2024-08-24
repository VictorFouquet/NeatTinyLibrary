import { INode } from "./INode";

export interface INodeVariation extends INode {
    bias:   number;
    output: number;
    mutate(): INodeVariation;
    copy():   INodeVariation;
}
