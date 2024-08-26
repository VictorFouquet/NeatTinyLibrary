import { INode } from "./INode";

export interface INodeVariation extends INode {
    x:      number;
    bias:   number;
    output: number;
    mutate(): INodeVariation;
    copy():   INodeVariation;
}
