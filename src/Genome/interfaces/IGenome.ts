import { IConnectionId, IConnectionVariation } from "../../Connection";
import { INodeVariation } from "../../Node";

export interface IGenome {
    nodes: INodeVariation[];
    connections: IConnectionVariation[];

    distance(other: IGenome): number;

    isFullyConnected(): boolean;

    getInputNodes():     INodeVariation[];
    getHiddenNodes():    INodeVariation[];
    getOutputNodes():    INodeVariation[];
    filterInputNodes():  INodeVariation[];
    filterOutputNodes(): INodeVariation[];

    getConnection(id: IConnectionId):               IConnectionVariation|null;
    getRandomConnection():                          IConnectionVariation;
    addConnection():                                IConnectionVariation;
    mutateConnectionWeight(id: IConnectionId):      IConnectionVariation;
    mutateConnectionWeightShift(id: IConnectionId): IConnectionVariation
    mutateConnectionEnabled(id: IConnectionId):     IConnectionVariation;
    containsConnection(id: IConnectionId):          boolean;

    getNode(id: number):        INodeVariation|null;
    getRandomNode():            INodeVariation;
    addNode():                  INodeVariation;
    mutateNodeBias(id: number): INodeVariation;
    removeNode(id: number):     INodeVariation;
    containsNode(id: number):   boolean;
}
