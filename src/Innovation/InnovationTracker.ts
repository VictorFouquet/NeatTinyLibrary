import {
    Connection,
    ConnectionId,
    IConnection,
    IConnectionId
} from "../Connection";

import {
    INode,
    Node,
    NodeTypeEnum
} from "../Node";

import  {
    ConnectionExistError,
    InputLinkageError,
    OutputLinkageError,
    UnknownNodeError
} from "./errors";


export class InnovationTracker {
    private static _nodes:      INode[] = [];
    private static _nodesCount: number = 0;

    private static _connections:      IConnection[] = [];
    private static _connectionsCount: number = 0;

    //#region Getters
    static get nodesCount(): number { return InnovationTracker._nodesCount; }
    static get nodes(): INode[] { return InnovationTracker._nodes.slice(); }
    static get inputNodes(): INode[] { return InnovationTracker._nodes.filter(n => n.isInput); }
    static get hiddenNodes(): INode[] { return InnovationTracker._nodes.filter(n => n.isHidden); }
    static get outputNodes(): INode[] { return InnovationTracker._nodes.filter(n => n.isOutput); }
    
    static get connectionsCount(): number { return InnovationTracker._connectionsCount; }
    static get connections(): IConnection[] { return InnovationTracker._connections.slice(); }
    //#endregion

    static init(inputs: number, outputs: number): void {
        if (InnovationTracker._connectionsCount !== 0 || InnovationTracker._nodesCount !== 0)
            InnovationTracker.clear();

        for (let i = 0; i < inputs; i++) {
            InnovationTracker.createInputNode();
        }
        for (let i = 0; i < outputs; i++) {
            InnovationTracker.createOutputNode();
        }

        for (let input of InnovationTracker.inputNodes) {
            for (let output of InnovationTracker.outputNodes) {
                InnovationTracker.getOrCreateConnection(new ConnectionId(input.id, output.id));
            }
        }
    }

    static clear(): void {
        InnovationTracker._nodes = [];
        InnovationTracker._nodesCount = 0;
        InnovationTracker._connections = [];
        InnovationTracker._connectionsCount = 0;
    }

    //#region Nodes
    private static createInputNode(): INode { // Only callable by the init function
        return InnovationTracker.createNodeInternal(NodeTypeEnum.Input);
    }

    static createHiddenNode(): INode {
        return InnovationTracker.createNodeInternal(NodeTypeEnum.Hidden);
    }

    private static createOutputNode(): INode { // Only callable by the init function
        return InnovationTracker.createNodeInternal(NodeTypeEnum.Output);
    }

    static getNodeById(id: number): INode|null {
        const node = InnovationTracker._nodes.filter((n: INode) => n.id === id);
        
        return node.length ? node[0] : null;
    }

    static nodeExists(id: number): boolean {
        return InnovationTracker.getNodeById(id) !== null;
    }

    private static createNodeInternal(type: NodeTypeEnum) {
        InnovationTracker._nodesCount++;

        const node = new Node(
            InnovationTracker._nodesCount,
            type
        );
        InnovationTracker._nodes.push(node);

        return node;
    }
    //#endregion

    //#region Connections
    static createConnection(_in: number, out: number): IConnection {
        InnovationTracker.assertLegalConnexion(_in, out)

        InnovationTracker._connectionsCount++;
        const connection = new Connection(new ConnectionId(_in, out));
        InnovationTracker._connections.push(connection);

        return connection;
    }

    static getConnection(id: IConnectionId): IConnection|null {
        const connection = InnovationTracker._connections.filter((c: IConnection) => c.id.equals(id));
        
        return connection.length === 1 ? connection[0] : null;
    }

    static getOrCreateConnection(id: IConnectionId): IConnection {
        return InnovationTracker.getConnection(id) ?? InnovationTracker.createConnection(id.in, id.out);
    }

    static connectionExists(id: IConnectionId): boolean {
        return this.getConnection(id) !== null;
    }
    //#endregion

    //#region Assertions
    private static assertLegalConnexion(_in: number, out: number) {
        InnovationTracker.assertNodeExist(_in);
        InnovationTracker.assertNodeExist(out);
        InnovationTracker.assertNoInputConnection(_in, out);
        InnovationTracker.assertNoOutputConnection(_in, out);
        InnovationTracker.assertNewConnection(_in, out);        
    }

    private static assertNodeExist(id: number) {
        if (!InnovationTracker.nodeExists(id)) {
            throw new UnknownNodeError(id);
        }
    }

    private static assertNoInputConnection(_in: number, out: number) {
        if (
            InnovationTracker.getNodeById(_in)?.isInput &&
            InnovationTracker.getNodeById(out)?.isInput
        ) {
            throw new InputLinkageError(_in, out);
        }
    }

    private static assertNoOutputConnection(_in: number, out: number) {
        if (
            InnovationTracker.getNodeById(_in)?.isOutput &&
            InnovationTracker.getNodeById(out)?.isOutput
        ) {
            throw new OutputLinkageError(_in, out);
        }
    }

    private static assertNewConnection(_in: number, out: number) {
        if (InnovationTracker.connectionExists(new ConnectionId(_in, out))) {
            throw new ConnectionExistError(_in, out);
        }
    }
    //#endregion
}
