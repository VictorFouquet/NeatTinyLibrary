import { EmptyGenomeError, NoConnectionError, FullyConnectedError, UnknownConnectionError, UnknownNodeError } from "./errors";
import { IGenome } from "./interfaces";

import { ConnectionId, ConnectionVariation, IConnectionId, IConnectionVariation } from "../Connection";
import { InnovationTracker } from "../Innovation";
import { INodeVariation, NodeVariation } from "../Node";

export class Genome implements IGenome {
    nodes: INodeVariation[];
    connections: IConnectionVariation[];

    constructor(nodes: INodeVariation[], connections: IConnectionVariation[] = []) {
        this.nodes = nodes;
        this.connections = connections;
    }

    static empty(): IGenome {
        return new Genome([]);
    }

    /**
     * A genome has a fully connected network if:
     * - all its input nodes are connected to all hidden and output nodes
     * - all its hidden nodes are connected to all hidden and output nodes
     * @returns full connectivity status
     */
    isFullyConnected(): boolean {
        for (let node of this.filterOutputNodes()) {
            for (let other of this.filterInputNodes()) {
                if (node.equals(other))
                    continue;
                if (!this.containsConnection(new ConnectionId(node.id, other.id)))
                    return false;
            }
        }
        return true;
    }

    getInputNodes(): INodeVariation[] {
        return this.nodes.filter(n => n.isInput);
    }

    getHiddenNodes(): INodeVariation[] {
        return this.nodes.filter(n => n.isHidden);
    }

    getOutputNodes(): INodeVariation[] {
        return this.nodes.filter(n => n.isOutput);
    }

    filterInputNodes(): INodeVariation[] {
        return this.nodes.filter(n => !n.isInput);
    }

    filterOutputNodes(): INodeVariation[] {
        return this.nodes.filter(n => !n.isOutput);
    }

    distance(other: IGenome): number {
        throw "Distance not implemented";
    }

    addConnection(): IConnectionVariation {
        if (this.isFullyConnected()) {
            throw new FullyConnectedError()
        }
        const validIn = this.filterOutputNodes();
        let nodeA = validIn[Math.floor(Math.random() * validIn.length)];

        // Gets valid nodes to create a connection
        const validOut = this.filterInputNodes().filter(n => !n.equals(nodeA));

        // Selects node B to link to node A
        let index = Math.floor(Math.random() * validOut.length);
        let nodeB = validOut.splice(index, 1)[0];
        // Computes connection id
        let connectionId = new ConnectionId(nodeA.id, nodeB.id);

        // Avoid duplicating a connection inside the genome
        while (this.containsConnection(connectionId) && validOut.length > 0) {
            index = Math.floor(Math.random() * validOut.length);
            nodeB = validOut.splice(index)[0];
            connectionId = new ConnectionId(nodeA.id, nodeB.id);
        }

        // If no linkage could be done from nodeA, restart from beginning
        if (validOut.length === 0 && this.containsConnection(connectionId)) {
            return this.addConnection();
        }

        // Creates the connection reference if needed
        if (!InnovationTracker.connectionExists(connectionId)) {
            InnovationTracker.createConnection(connectionId.in, connectionId.out);
        }
        const connection = new ConnectionVariation(connectionId, 1, true);
        this.connections.push(connection);

        return connection;
    }

    getConnection(id: IConnectionId): IConnectionVariation|null {
        const connectionsFiltered = this.connections.filter(c => c.id.equals(id));
        return connectionsFiltered.length === 1 ? connectionsFiltered[0] : null;
    }

    mutateConnectionWeight(id: IConnectionId): IConnectionVariation {
        const connection = this.getConnection(id);
        if (connection === null)
            throw new UnknownConnectionError(id.in, id.out);

        connection.mutateWeight();
        return connection;
    }

    mutateConnectionWeightShift(id: IConnectionId): IConnectionVariation {
        const connection = this.getConnection(id);
        if (connection === null)
            throw new UnknownConnectionError(id.in, id.out);
        connection.shiftWeight();
        return connection;
    }

    mutateConnectionEnabled(id: IConnectionId): IConnectionVariation {
        const connection = this.getConnection(id);
        if (connection === null)
            throw new UnknownConnectionError(id.in, id.out);

        connection.mutateEnabled();
        return connection;
    }

    containsConnection(id: IConnectionId): boolean {
        return this.getConnection(id) !== null;
    }

    getRandomConnection(): IConnectionVariation {
        if (this.connections.length === 0) {
            throw new NoConnectionError();
        }
        return this.connections[Math.floor(Math.random() * this.connections.length)];
    }

    addNode(): INodeVariation {
        const connection = this.getRandomConnection();
        connection.enabled = false;
        
        const node = InnovationTracker.createHiddenNode();
        
        const variationNode = new NodeVariation(node.id, node.type, Math.random());
        this.nodes.push(variationNode);

        this.connections.push(
            new ConnectionVariation(
                InnovationTracker.getOrCreateConnection(
                    new ConnectionId(connection.in, node.id)
                ).id,
                1
            )
        );

        this.connections.push(
            new ConnectionVariation(
                InnovationTracker.getOrCreateConnection(
                    new ConnectionId(node.id, connection.out)
                ).id,
                connection.weight
            )
        );

        return variationNode;
    }

    getNode(id: number): INodeVariation {
        if (!this.containsNode(id))
            throw new UnknownNodeError(id);
        return this.getNodeInternal(id)!;
    }

    private getNodeInternal(id: number): INodeVariation|null {
        const node = this.nodes.filter(n => n.id === id);
        return node.length === 1 ? node[0] : null;
    }

    getRandomNode(): INodeVariation {
        if (this.nodes.length === 0)
            throw new EmptyGenomeError();
        return this.nodes[Math.floor(Math.random() * this.nodes.length)];
    }

    mutateNodeBias(id: number): INodeVariation {
        const node = this.getNode(id);
        node.bias = Math.random();
        return node;
    }

    removeNode(id: number): INodeVariation {
        const node = this.getNode(id);
        this.nodes.splice(this.nodes.indexOf(node), 1);
        return node;
    }

    containsNode(id: number): boolean {
        return this.getNodeInternal(id) !== null;
    }
}
