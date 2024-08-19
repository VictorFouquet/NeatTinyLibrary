import { Connection, ConnectionId, IConnection, IConnectionId } from "../Connection";
import { ConnectionExistError, UnknownNodeError, UnknownConnectionError, InputLinkageError, OutputLinkageError } from "./errors";
import { INode, Node, NodeTypeEnum } from "../Node";

export class Innovation {
    //#region Getters
    static get nodesCount(): number { return InnovationBuilder.nodesCount; }
    static get nodes(): INode[] { return InnovationBuilder.nodes.slice(); }
    static get inputNodes(): INode[] { return InnovationBuilder.nodes.filter(n => n.isInput); }
    static get hiddenNodes(): INode[] { return InnovationBuilder.nodes.filter(n => n.isHidden); }
    static get outputNodes(): INode[] { return InnovationBuilder.nodes.filter(n => n.isOutput); }
    
    static get connectionsCount(): number { return InnovationBuilder.connectionsCount; }
    static get connections(): IConnection[] { return InnovationBuilder.connections.slice(); }
    //#endregion

    static init(inputs: number, outputs: number): void {
        if (InnovationBuilder.connectionsCount !== 0 || InnovationBuilder.nodesCount !== 0)
            InnovationBuilder.Clear();

        for (let i = 0; i < inputs; i++) {
            Innovation.createInputNode();
        }
        for (let i = 0; i < outputs; i++) {
            Innovation.createOutputNode();
        }

        for (let input of Innovation.inputNodes) {
            for (let output of Innovation.outputNodes) {
                Innovation.getOrCreateConnection(new ConnectionId(input.id, output.id));
            }
        }
    }

    static clear(): void {
        InnovationBuilder.Clear();
    }

    //#region Nodes
    private static createInputNode(): INode { // Only callable by the init function
        return InnovationBuilder.CreateNode(NodeTypeEnum.Input);
    }

    static createHiddenNode(): INode {
        return InnovationBuilder.CreateNode(NodeTypeEnum.Hidden);
    }

    private static createOutputNode(): INode { // Only callable by the init function
        return InnovationBuilder.CreateNode(NodeTypeEnum.Output);
    }

    static getNodeById(id: number): INode {
        if (!InnovationBuilder.NodeExist(id)) {
            throw new UnknownNodeError(id);
        }
        
        return InnovationBuilder.GetNode(id);
    }

    static nodeExists(id: number): boolean {
        return InnovationBuilder.NodeExist(id);
    }
    //#endregion

    //#region Connections
    static createConnection(_in: number, out: number): IConnection {
        Innovation.assertLegalConnexion(_in, out);
        return InnovationBuilder.CreateConnection(_in, out);
    }

    static getConnection(id: IConnectionId): IConnection {
        return InnovationBuilder.GetConnection(id);
    }

    static getOrCreateConnection(id: IConnectionId): IConnection {
        if (InnovationBuilder.ConnectionExist(id))
            return InnovationBuilder.GetConnection(id);
        return InnovationBuilder.CreateConnection(id.in, id.out);
    }

    static connectionExists(id: IConnectionId): boolean {
        return InnovationBuilder.ConnectionExist(id);
    }
    //#endregion

    //#region Assertions
    private static assertLegalConnexion(_in: number, out: number) {
        Innovation.assertNoInputConnection(_in, out);
        Innovation.assertNoOutputConnection(_in, out);
    }

    private static assertNoInputConnection(_in: number, out: number) {
        if (
            InnovationBuilder.GetNode(_in)?.isInput &&
            InnovationBuilder.GetNode(out)?.isInput
        ) {
            throw new InputLinkageError(_in, out);
        }
    }

    private static assertNoOutputConnection(_in: number, out: number) {
        if (
            InnovationBuilder.GetNode(_in)?.isOutput &&
            InnovationBuilder.GetNode(out)?.isOutput
        ) {
            throw new OutputLinkageError(_in, out);
        }
    }
    //#endregion
};

class InnovationBuilder {
    private static _nodes: { [id: number]: INode } = {};
    private static _nodesCount: number = 0;

    private static _connections: { [id: number]: IConnection } = {};
    private static _connectionsCount: number = 0;

    static get nodesCount(): number { return InnovationBuilder._nodesCount; }
    static get nodes(): INode[] { return Object.values(InnovationBuilder._nodes); }

    static get connectionsCount(): number { return InnovationBuilder._connectionsCount; }
    static get connections(): IConnection[] { return Object.values(InnovationBuilder._connections); }

    static CreateNode(nodeType: NodeTypeEnum): INode {
        const nodeId = InnovationIdBuilder.Node();
        InnovationBuilder._nodesCount++;
        InnovationBuilder._nodes[nodeId] = new Node(nodeId, InnovationIdBuilder.GlobalId, nodeType);

        return InnovationBuilder._nodes[nodeId];
    }

    static NodeExist(id: number): boolean {
        return id in InnovationBuilder._nodes;
    }

    static GetNode(id: number): INode {
        if (!InnovationBuilder.NodeExist(id)) {
            throw new UnknownNodeError(id);
        }
        return InnovationBuilder._nodes[id];
    }

    static CreateConnection(in_: number, out: number): IConnection {
        const connectionId = InnovationIdBuilder.Connection(in_, out);
        const id = InnovationIdBuilder.ConnectionGlobal(connectionId);
        
        if (InnovationBuilder.ConnectionExist(connectionId)) {
            throw new ConnectionExistError(in_, out);
        }
        InnovationBuilder._connectionsCount++;
        InnovationBuilder._connections[id] = new Connection(connectionId, InnovationIdBuilder.GlobalId);

        return InnovationBuilder._connections[id];
    }

    static ConnectionExist(id: IConnectionId): boolean {
        if (InnovationIdBuilder.ConnectionExists(id))
            return InnovationIdBuilder.ConnectionGlobal(id) in InnovationBuilder._connections;
        return false;
    }

    static GetConnection(id: IConnectionId): IConnection {
        if (!InnovationBuilder.ConnectionExist(id)) {
            throw new UnknownConnectionError(id.in, id.out);
        }
        return InnovationBuilder._connections[InnovationIdBuilder.ConnectionGlobal(id)];
    }

    static Clear(): void {
        InnovationBuilder._nodes = {};
        InnovationBuilder._nodesCount = 0;
        InnovationBuilder._connections = {};
        InnovationBuilder._connectionsCount = 0;

        InnovationIdBuilder.Clear();
    }
};

class InnovationIdBuilder {
    private static _nodeId   = 0;
    private static _globalId = 0;
    private static _nodeToGlobal: { [id: number]: number } = {};
    private static _connectionToGlobal: { [id: string]: number } = {};

    static get GlobalId(): number { return InnovationIdBuilder._globalId; };

    static Node(): number {
        InnovationIdBuilder._nodeId++;
        InnovationIdBuilder._globalId++;

        InnovationIdBuilder._nodeToGlobal[
            InnovationIdBuilder._nodeId
        ] = InnovationIdBuilder._globalId;

        return InnovationIdBuilder._nodeId;
    }

    static NodeGlobal(id: number) {
        if (!(id in InnovationIdBuilder._nodeToGlobal)) {
            throw new UnknownNodeError(id);
        }
        return InnovationIdBuilder._nodeToGlobal[id];
    }

    static Connection(in_: number, out: number): ConnectionId {
        const connectionId = new ConnectionId(in_, out);
        if (!(connectionId.toString() in InnovationIdBuilder._connectionToGlobal)) {
            InnovationIdBuilder._globalId++;
            InnovationIdBuilder._connectionToGlobal[connectionId.toString()] = InnovationIdBuilder._globalId;
        }
        return connectionId;
    }

    static ConnectionGlobal(id: IConnectionId): number {
        if (!InnovationIdBuilder.ConnectionExists(id)) {
            throw new UnknownConnectionError(id.in, id.out);
        }
        return InnovationIdBuilder._connectionToGlobal[id.toString()];
    }

    static ConnectionExists(id: IConnectionId): boolean {
        return id.toString() in InnovationIdBuilder._connectionToGlobal;
    }

    static Clear(): void {
        InnovationIdBuilder._nodeId = 0;
        InnovationIdBuilder._globalId = 0;
        InnovationIdBuilder._nodeToGlobal = {};
        InnovationIdBuilder._connectionToGlobal = {};
    } 
};
