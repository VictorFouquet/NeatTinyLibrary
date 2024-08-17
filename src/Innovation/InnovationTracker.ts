import {
    Connection,
    ConnectionId,
    IConnection,
    IConnectionId
} from "../Connection";
import { NodeTypeEnum } from "../Node/enums/NodeTypeEnum";
import { INode } from "../Node/interfaces";
import { Node } from "../Node"
import  {
    ConnectionExistError,
    InputLinkageError,
    OutputLinkageError,
    UnknownNodeError
} from "./errors";

export class InnovationTracker {
    static nodes:      INode[] = [];
    static nodesCount: number = 0;

    static connections:      IConnection[] = [];
    static connectionsCount: number = 0;

    static init(inputs: number, outputs: number): void {
        if (InnovationTracker.connectionsCount !== 0 || InnovationTracker.nodesCount !== 0)
            InnovationTracker.clear();

        for (let i = 0; i < inputs; i++) {
            InnovationTracker.createInputNode();
        }
        for (let i = 0; i < outputs; i++) {
            InnovationTracker.createOutputNode();
        }
    }

    static clear(): void {
        InnovationTracker.nodes = [];
        InnovationTracker.nodesCount = 0;
        InnovationTracker.connections = [];
        InnovationTracker.connectionsCount = 0;
    }

    //#region Nodes
    private static createInputNode(): INode { // Only callable by the init function
        return InnovationTracker.createNodeInternal(NodeTypeEnum.Input);
    }

    static getInputNodes(): INode[] {
        return InnovationTracker.nodes.filter(n => n.isInput());
    }

    static createHiddenNode(): INode {
        return InnovationTracker.createNodeInternal(NodeTypeEnum.Hidden);
    }

    private static createOutputNode(): INode { // Only callable by the init function
        return InnovationTracker.createNodeInternal(NodeTypeEnum.Output);
    }

    static getOutputNodes(): INode[] {
        return InnovationTracker.nodes.filter(n => n.isOutput());
    }

    static getNodeById(id: number): INode|null {
        const node = InnovationTracker.nodes.filter((n: INode) => n.id === id);
        
        return node.length ? node[0] : null;
    }

    static nodeExists(id: number): boolean {
        return InnovationTracker.getNodeById(id) !== null;
    }

    private static createNodeInternal(type: NodeTypeEnum) {
        InnovationTracker.nodesCount++;

        const node = new Node(
            InnovationTracker.nodesCount,
            type
        );
        InnovationTracker.nodes.push(node);

        return node;
    }
    //#endregion

    //#region Connections
    static createConnection(_in: number, out: number): IConnection {
        InnovationTracker.assertLegalConnexion(_in, out)

        InnovationTracker.connectionsCount++;
        const connection = new Connection(new ConnectionId(_in, out));
        InnovationTracker.connections.push(connection);

        return connection;
    }

    static getConnection(id: IConnectionId): IConnection|null {
        const connection = InnovationTracker.connections.filter((c: IConnection) => c.id.equals(id));
        
        return connection.length === 1 ? connection[0] : null;
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
            InnovationTracker.getNodeById(_in)?.isInput() &&
            InnovationTracker.getNodeById(out)?.isInput()
        ) {
            throw new InputLinkageError(_in, out);
        }
    }

    private static assertNoOutputConnection(_in: number, out: number) {
        if (
            InnovationTracker.getNodeById(_in)?.isOutput() &&
            InnovationTracker.getNodeById(out)?.isOutput()
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
