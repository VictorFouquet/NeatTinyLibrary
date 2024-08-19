import { ConnectionId, ConnectionVariation } from "../../src/Connection";
import { EmptyGenomeError, FullyConnectedError, Genome, NoConnectionError, UnknownConnectionError, UnknownNodeError } from "../../src/Genome";
import { Innovation } from "../../src/Innovation";
import { NodeVariation } from "../../src/Node";

test("Genome should throw an error when trying to add a connection to a fully connected network", () => {
    const inputs = 2;
    const outputs = 1;
    Innovation.init(inputs, outputs);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1))
    );

    expect(() => genome.addConnection()).not.toThrow(FullyConnectedError);
    expect(() => genome.addConnection()).not.toThrow(FullyConnectedError);
    expect(() => genome.addConnection()).toThrow(FullyConnectedError);
});

test("Genome should not link a hidden node to itself", () => {
    const inputs = 2; // 1, 2
    const outputs = 1; // 3
    Innovation.init(inputs, outputs); // 4, 5
    Innovation.createHiddenNode(); // 6

    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [ // Fully connected
            ...Innovation.connections.map(c => new ConnectionVariation(c.id, 0.0, true)),
            new ConnectionVariation(Innovation.createConnection(1, 4).id, 1),
            new ConnectionVariation(Innovation.createConnection(2, 4).id, 1),
            new ConnectionVariation(Innovation.createConnection(4, 3).id, 1),
        ]
    );
    expect(genome.isFullyConnected()).toBe(true);
    expect(() => genome.addConnection()).toThrow(FullyConnectedError);
});

test("Genome should throw an error when trying to add a neuron if no connection exists", () => {
    const genome = Genome.empty();
    expect(() => genome.addNode()).toThrow(NoConnectionError);
});

test("Genome should throw an error when trying to mutate an unexisting connection", () => {
    const genome = Genome.empty();
    expect(() => genome.mutateConnectionEnabled(new ConnectionId(-1, -1))).toThrow(UnknownConnectionError);
    expect(() => genome.mutateConnectionWeight(new ConnectionId(-1, -1))).toThrow(UnknownConnectionError);
});

test("Genome should throw an error when trying to mutate an unexisting node", () => {
    const genome = Genome.empty();
    expect(() => genome.mutateNodeBias(-1)).toThrow(UnknownNodeError);
});

test("Genome should throw an error when trying to get a random node when empty", () => {
    const genome = Genome.empty();
    expect(() => genome.getRandomNode()).toThrow(EmptyGenomeError);
});

test("Genome should throw an error when trying to shift an unknown connection weight", () => {
    const inputs = 2;
    const outputs = 1;
    const connectionId = new ConnectionId(1, 3);
    const weight = 1;
    Innovation.init(inputs, outputs);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [ new ConnectionVariation(connectionId, weight) ]
    );

    expect(() => genome.mutateConnectionWeightShift(new ConnectionId(-1, -2))).toThrow(UnknownConnectionError);
});
