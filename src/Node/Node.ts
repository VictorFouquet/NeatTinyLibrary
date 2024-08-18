import { NodeTypeEnum } from "./enums";
import { INode } from "./interfaces";

export class Node implements INode {
    private readonly _id:       number;
    private readonly _type:     NodeTypeEnum;
    private readonly _isInput:  boolean;
    private readonly _isHidden: boolean;
    private readonly _isOutput: boolean;

    constructor(id: number, type: NodeTypeEnum) {
        this._id   = id;
        this._type = type;
        this._isInput = type === NodeTypeEnum.Input;
        this._isHidden = type === NodeTypeEnum.Hidden;
        this._isOutput = type === NodeTypeEnum.Output;
    }

    get id(): number { return this._id; }
    get type(): NodeTypeEnum { return this._type; }
    get isInput():  boolean { return this._isInput; }
    get isHidden(): boolean { return this._isHidden; }
    get isOutput(): boolean { return this._isOutput; }

    equals(other: Node): boolean { return this._id === other.id; }
}
