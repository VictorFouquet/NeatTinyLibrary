import { EmptyGenomeError, NoConnectionError, FullyConnectedError, UnknownConnectionError, UnknownNodeError } from "./errors";
import { IGenome } from "./interfaces";

import { ConnectionId, ConnectionVariation, IConnectionId, IConnectionVariation } from "../Connection";
import { Innovation } from "../Innovation";
import { INodeVariation, NodeVariation } from "../Node";
import { Neat } from "../Neat";
import { GenomeLogger } from "./GenomeLogger";

export class Genome implements IGenome {
    private static currentId = 0;
    private static logger = new GenomeLogger();

    static empty(): IGenome {
        return new Genome([]);
    }
    id: number;
    nodes: INodeVariation[];
    connections: IConnectionVariation[];
    speciesId: number = -1;
    stack = 0;


    constructor(nodes: INodeVariation[], connections: IConnectionVariation[] = []) {
        Genome.currentId++;
        this.id = Genome.currentId;
        this.nodes = nodes;
        this.connections = connections;
        this.setNodesX();
    }

    /**
     * A genome has a fully connected network if:
     * - all its input nodes are connected to all hidden and output nodes
     * - all its hidden nodes are connected to all hidden and output nodes
     * @returns full connectivity status
     */
    isFullyConnected(): boolean { // TODO: update for nodes x comparison
        const sorted = this.nodes.sort((a,b) => a.x - b.x);
        let legal = 0;
        for (let i = 0; i < sorted.length; i++) {
            for (let j = 0; j < sorted.length; j++) {
                if (
                    sorted[i].id !== sorted[j].id && // Cant link node to itself
                    sorted[i].x <= sorted[j].x &&    // Cant link from right to left
                    !sorted[j].isInput &&            // Cant link towards input
                    !sorted[i].isOutput &&           // Cant link from output
                    // Cant duplicate connection
                    !this.containsConnection(new ConnectionId(sorted[i].id, sorted[j].id)) &&
                    // Cant make connection bi directional
                    !this.containsConnection(new ConnectionId(sorted[j].id, sorted[i].id))
                )
                    return false;
            }
        }
        return true;
    }

    distance(other: IGenome): number {
        const thisHighestInnovNumber  = this.alignedConnections()[this.connections.length-1].globalId;
        const otherHighestInnovNumber = other.alignedConnections()[other.connections.length-1].globalId;
        const [indiv1, indiv2] = thisHighestInnovNumber > otherHighestInnovNumber
            ? [ this, other ]
            : [ other, this ];

        let idx1 = 0;
        let idx2 = 0;
        let disjoint = 0;
        let excess = 0;
        let common = 0;
        let weightDelta = 0;
        let x = 0;
        while (idx1 < indiv1.connections.length && idx2 < indiv2.connections.length && x < 500) {
            x++;
            const con1 = indiv1.connections[idx1];
            const con2 = indiv2.connections[idx2];

            if (con1.globalId === con2.globalId) {
                idx1++;
                idx2++;
                common++;
                weightDelta += Math.abs(con1.weight - con2.weight);
            } else if (con1.globalId > con2.globalId) {
                idx2++;
                disjoint++;
            } else {
                idx1++;
                disjoint++;
            }
        }
        //console.log("X1", x)
        if (x == 500) {
            console.log("Alert1", indiv1.connections.length, indiv2.connections.length)
        }

        excess += indiv1.connections.length - idx1;
        const n = Math.min(1, Math.max(20, indiv1.connections.length > indiv2.connections.length
            ? indiv1.connections.length
            : indiv2.connections.length));

        return (Neat.config.c1 ?? 1) * disjoint / n +
            (Neat.config.c2 ?? 1) * excess / n +
            (Neat.config.c3 ?? 1) * weightDelta / common;
    }

    crossover(other: IGenome): IGenome {
        const childConns = this.crossoverConnections(other);
        const child = new Genome(this.getNodesFromConnections(childConns), childConns);
        
        return child;
    }

    private crossoverConnections(other: IGenome): IConnectionVariation[] {
        const childConns: IConnectionVariation[] = [];
        const parent1Conns = this.alignedConnections();
        const parent2Conns = other.alignedConnections();

        let idx1 = 0;
        let idx2 = 0;
        let x = 0;
        while (idx1 < parent1Conns.length && idx2 < parent2Conns.length && x < 50) {
            x++
            if (parent1Conns[idx1].globalId === parent2Conns[idx2].globalId) {
                childConns.push(Math.random() > 0.5 ? parent1Conns[idx1] : parent2Conns[idx2]);
                idx1++;
                idx2++;
            } else if (parent1Conns[idx1].globalId > parent2Conns[idx2].globalId) {
                idx2++;
            } else {
                childConns.push(parent1Conns[idx1]);
                idx1++;
            }
        }
        //console.log("X5", x)
        if (x == 50) {
            console.log("Alert5")
        }

        const nodes = this.getNodesFromConnections(childConns);
        const checkGenome = new Genome(nodes, childConns);
        checkGenome.setNodesX();
        Genome.logger.logCrossOver(this, other, checkGenome);
        if (idx1 < parent1Conns.length) {
            childConns.push(...(parent1Conns.splice(idx1).filter(c => checkGenome.connectionIsLegal(c.in, c.out))));
        }

        return childConns;
    }

    addConnection(): IConnectionVariation {
        this.stack ++;
        if (this.isFullyConnected() || this.getLegalConnections().length === 0) {
            throw new FullyConnectedError()
        }
        const validIn = this.filterOutputNodes();
        let nodeA = validIn.splice(Math.floor(Math.random() * validIn.length), 1)[0];

        // Gets valid nodes to create a connection
        const validOut = this.filterInputNodes().filter(n => !n.equals(nodeA));

        if (this.stack === 49) {
            // console.log("Connections", this.connections)
            // console.log("CHECK BEFORE", nodeA, validIn, validOut)
        }
        // Selects node B to link to node A
        let index = Math.floor(Math.random() * validOut.length);
        let nodeB = validOut.splice(index, 1)[0];
        // Computes connection id
        let connectionId = new ConnectionId(nodeA.id, nodeB.id);

        // Avoid duplicating a connection inside the genome
        let x = 0;
        while (!this.connectionIsLegal(nodeA.id, nodeB.id) && validOut.length > 0 && x < 50) {
            x++;
            index = Math.floor(Math.random() * validOut.length);
            nodeB = validOut.splice(index)[0];
            connectionId = new ConnectionId(nodeA.id, nodeB.id);
        }
        //console.log("X2", x)
        if (x == 50) {
            console.log("Alert2")
        }

        // If no linkage could be done from nodeA, restart from beginning
        if (validOut.length === 0 && !this.connectionIsLegal(nodeA.id, nodeB.id) && this.stack < 50) {
            //console.log("STACK", this.stack)
            if (this.stack === 49) {
                console.log(this.connections, this.nodes)
            }
            return this.addConnection();
        }

        // Creates the connection reference if needed
        if (!Innovation.connectionExists(connectionId)) {
            Innovation.createConnection(connectionId.in, connectionId.out);
        }
        const connection = new ConnectionVariation(connectionId, 1, true);
        this.connections.push(connection);
        this.setNodesX();

        Genome.logger.logAddConnection(this, connection);

        return connection;
    }

    addNode(): INodeVariation {
        const connection = this.getRandomConnection();
        connection.enabled = false;

        const node = Innovation.createHiddenNode();
        const variationNode = new NodeVariation(node.id, Math.random());

        this.nodes.push(variationNode);

        const conn1 = new ConnectionVariation(
            Innovation.getOrCreateConnection(
                new ConnectionId(connection.in, node.id)
            ).id,
            1
        );
        const conn2 = new ConnectionVariation(
            Innovation.getOrCreateConnection(
                new ConnectionId(node.id, connection.out)
            ).id,
            connection.weight
        )
        this.connections.push(conn1, conn2);

        this.setNodesX();
        Genome.logger.logAddNode(this, node.id, conn1, conn2);

        return variationNode;
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

    mutateNodeBias(id: number): INodeVariation {
        const node = this.getNode(id);
        node.bias = Math.random();
        return node;
    }

    containsConnection(id: IConnectionId): boolean {
        return this.getConnection(id) !== null;
    }

    connectionIsLegal(in_: number, out: number): boolean {
        if (!this.containsNode(in_) || !this.containsNode(out)) {
            console.log("ALERT", this.id, in_, out)
        }
        const node1 = this.getNode(in_);
        const node2 = this.getNode(out);
        return node1.id !== node2.id &&      // Cant link node to itself
                node1.x <= node2.x &&        // Cant link from right to left
                !node2.isInput &&            // Cant link towards input
                !node1.isOutput &&           // Cant link from output
                // Cant duplicate connection
                !this.containsConnection(new ConnectionId(node1.id, node2.id)) &&
                // Cant make connection bi directional
                !this.containsConnection(new ConnectionId(node2.id, node1.id))
        // return this.getNode(in_).x <= this.getNode(out).x &&
        //        !this.containsConnection(new ConnectionId(in_, out)) &&
        //        !this.containsConnection(new ConnectionId(out, in_));
    }

    getLegalConnections(): IConnectionId[] {
        const legal: IConnectionId[] = [];
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.nodes.length; j++) {
                if (i === j || this.nodes[j].x === 0) {
                    continue;
                }
                if (this.connectionIsLegal(this.nodes[i].id, this.nodes[j].id)) {
                    legal.push(new ConnectionId(
                        this.nodes[i].id, this.nodes[j].id
                    ));
                }
            }
        }
        return legal;
    }
    
    getConnection(id: IConnectionId): IConnectionVariation|null {
        const connectionsFiltered = this.connections.filter(c => c.id.equals(id));
        return connectionsFiltered.length === 1 ? connectionsFiltered[0] : null;
    }

    getRandomConnection(): IConnectionVariation {
        if (this.connections.length === 0) {
            throw new NoConnectionError();
        }
        return this.connections[Math.floor(Math.random() * this.connections.length)];
    }

    alignedConnections(): IConnectionVariation[] {
        return this.connections.sort((a,b) => a.globalId - b.globalId).map(c => c.copy());
    }

    getInputNodes(): INodeVariation[] { return this.nodes.filter(n => n.isInput); }

    getHiddenNodes(): INodeVariation[] { return this.nodes.filter(n => n.isHidden); }

    getOutputNodes(): INodeVariation[] { return this.nodes.filter(n => n.isOutput); }

    filterInputNodes(): INodeVariation[] { return this.nodes.filter(n => !n.isInput); }

    filterOutputNodes(): INodeVariation[] { return this.nodes.filter(n => !n.isOutput); }

    sortNodesByLayer(): number[][] {
        const layers: number[][] = [this.getInputNodes().map(n => n.id)];
        let nodesToLink = [
            ...this.getHiddenNodes().map(n => n.id),
            ...this.getOutputNodes().map(n => n.id)
        ];
        const linked = layers[0].slice();
        let x = 0;
        while (nodesToLink.length !== 0 && x < 50) {
            x++;
            const layer: number[] = [];
            for (let node of nodesToLink) {
                let nodeAsOutConnections = this.connections.filter(c => c.out === node);
                if (nodeAsOutConnections.every(c => linked.includes(c.in))) {
                    layer.push(node);
                }
            }
            
            linked.push(...layer);
            nodesToLink = nodesToLink.filter(n => !(linked.includes(n)));
            layers.push(layer);
        }
        //console.log("X3", x)
        if (x == 50) {
            console.log("Alert3", this.id, nodesToLink, linked, this.connections, this.nodes)
        }

        return layers;
    }

    setNodesX(): void {
        const layered = this.sortNodesByLayer();
        const increment = 1 / (layered.length - 1);
        let currentX = 0;
        for (let i = 0; i < layered.length; i++) {
            for (let id of layered[i]) {
                const node = this.getNode(id);
                node.x = currentX;
            }
            currentX += increment;
        }
    }

    containsNode(id: number): boolean { return this.getNodeInternal(id) !== null; }

    getNode(id: number): INodeVariation {
        if (!this.containsNode(id))
            throw new UnknownNodeError(id);
        return this.getNodeInternal(id)!;
    }

    getRandomNode(): INodeVariation {
        if (this.nodes.length === 0)
            throw new EmptyGenomeError();
        return this.nodes[Math.floor(Math.random() * this.nodes.length)];
    }

    removeNode(id: number): INodeVariation {
        const node = this.getNode(id);
        this.nodes.splice(this.nodes.indexOf(node), 1);
        return node;
    }

    private getNodeInternal(id: number): INodeVariation|null {
        const node = this.nodes.filter(n => n.id === id);
        return node.length === 1 ? node[0] : null;
    }

    private getNodesFromConnections(conns: IConnectionVariation[]): INodeVariation[] {
        const nodes: INodeVariation[] = [];
        const nodesIds = new Set<number>();

        for (let conn of conns) {
            const nodeInId = conn.id.in;
            const nodeOutId = conn.id.out;

            if (!nodesIds.has(nodeInId)) {
                nodes.push(this.nodes.filter(n => n.id === nodeInId)[0]);
                nodesIds.add(nodeInId);
            }
            if (!nodesIds.has(nodeOutId)) {
                nodes.push(this.nodes.filter(n => n.id === nodeOutId)[0]);
                nodesIds.add(nodeOutId);
            }
        }

        return nodes;
    }
}
