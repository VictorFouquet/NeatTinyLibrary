import { ConnectionId, ConnectionVariation } from "../../src/Connection";
import { FullyConnectedError, Genome } from "../../src/Genome";
import { InnovationTracker } from "../../src/Innovation";
import { NodeVariation } from "../../src/Node";

test("Genome should add a new connection", () => {
    const inputs = 2;
    const outputs = 1;
    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1))
    );
    const connection = genome.addConnection();
    expect(connection).not.toBe(null);
    expect(InnovationTracker.connectionExists(connection.id));
    expect(connection.in).not.toBe(connection.out);
});

test("Genome should create different connections", () => {
    const inputs = 2;
    const outputs = 1;
    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1))
    );
    /**
     * 2 different connection can be created :
     * in1 -> out
     * in2 -> out
     */
    const connection1 = genome.addConnection();
    const connection2 = genome.addConnection();

    expect(connection1.equals(connection2)).toBe(false);
});

test("Genome should disable a connection", () => {
    const inputs = 2;
    const outputs = 1;
    const connectionId = new ConnectionId(1, 3);
    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
        [ new ConnectionVariation(connectionId, 1) ]
    );

    expect(genome.getConnection(connectionId)?.enabled).toBe(true);
    genome.mutateConnectionEnabled(connectionId);
    expect(genome.getConnection(connectionId)?.enabled).toBe(false);
});

test("Genome should mutate a connection weight", () => {
    const inputs = 2;
    const outputs = 1;
    const connectionId = new ConnectionId(1, 3);
    const weight = 1;
    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
        [ new ConnectionVariation(connectionId, weight) ]
    );

    expect(genome.getConnection(connectionId)?.weight).toBe(weight);
    genome.mutateConnectionWeight(connectionId);
    expect(genome.getConnection(connectionId)?.weight).not.toBe(weight);
});

test("Genome should shift a connection weight", () => {
    const inputs = 2;
    const outputs = 1;
    const connectionId = new ConnectionId(1, 3);
    const weight = 1;
    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
        [ new ConnectionVariation(connectionId, weight) ]
    );

    expect(genome.getConnection(connectionId)?.weight).toBe(weight);
    genome.mutateConnectionWeightShift(connectionId);
    expect(genome.getConnection(connectionId)?.weight).toBeGreaterThanOrEqual(weight - weight * 0.1);
    expect(genome.getConnection(connectionId)?.weight).toBeLessThanOrEqual(weight + weight * 0.1);
});

test("Genome should trigger the creation of a new connection in the InnovationTracker", () => {
    const inputs = 2;
    const outputs = 1;

    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
        [
            new ConnectionVariation(new ConnectionId(1, 3), 1),
            new ConnectionVariation(new ConnectionId(2, 3), 1)
        ]
    );
    // Adding a node will create 2 new connections, so now InnovationTracker should have 4 connections
    genome.addNode();
    expect(InnovationTracker.connections).toHaveLength(4);
    expect(InnovationTracker.connectionsCount).toBe(4);
    // As the genome doesnt have a fully connected network, it should be able to add a new connection
    expect(() => genome.addConnection()).not.toThrow(FullyConnectedError);
    // Now the InnovationTracker should have 5 connections
    expect(InnovationTracker.connections).toHaveLength(5);
    expect(InnovationTracker.connectionsCount).toBe(5);
});
