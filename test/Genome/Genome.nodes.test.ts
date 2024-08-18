import { ConnectionId, ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { Innovation } from "../../src/Innovation";
import { NodeTypeEnum, NodeVariation } from "../../src/Node";

test("Genome should get its input nodes", () => {
    Innovation.init(2, 1);
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 0.0)));
    expect(genome.getInputNodes().length).toBe(2);
    expect(genome.getInputNodes().every(n => n.isInput)).toBe(true);
});

test("Genome should get its hidden nodes", () => {
    Innovation.init(2, 1);
    Innovation.createHiddenNode();
    Innovation.createHiddenNode();
    Innovation.createHiddenNode();
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 0.0)));
    expect(genome.getHiddenNodes().length).toBe(3);
    expect(genome.getHiddenNodes().every(n => n.isHidden)).toBe(true);
});

test("Genome should get its output nodes", () => {
    Innovation.init(1,2);
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 0.0)));
    expect(genome.getOutputNodes().length).toBe(2);
    expect(genome.getOutputNodes().every(n => n.isOutput)).toBe(true);
});

test("Genome should filter its input nodes", () => {
    Innovation.init(3,2);
    Innovation.createHiddenNode();
    Innovation.createHiddenNode();
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 0.0)));
    expect(genome.filterInputNodes().length).toBe(4);
    expect(genome.filterInputNodes().every(n => !n.isInput)).toBe(true);
});

test("Genome should filter its output nodes", () => {
    Innovation.init(4,1);
    Innovation.createHiddenNode();
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 0.0)));
    expect(genome.filterOutputNodes().length).toBe(5);
    expect(genome.filterOutputNodes().every(n => !n.isOutput)).toBe(true);
});

test("Genome should add a hidden node to its network", () => {
    const inputs = 2;
    const outputs = 1;
    Innovation.init(inputs, outputs);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [
            new ConnectionVariation(
                new ConnectionId(1, 3),
                1,
                true
            )
        ]
    );

    expect(genome.connections.length).toBe(1);
    expect(genome.connections[0].enabled).toBe(true);

    expect(genome.nodes.length).toBe(3)

    expect(Innovation.nodes.length).toBe(3);
    expect(Innovation.nodesCount).toBe(3);
    expect(Innovation.hiddenNodes.length).toBe(0);

    const node = genome.addNode();
    
    expect(node.id).toBe(4);
    expect(node.type).toBe(NodeTypeEnum.Hidden);
    
    expect(Innovation.nodes.length).toBe(4);
    expect(Innovation.nodesCount).toBe(4);
    expect(Innovation.hiddenNodes.length).toBe(1);
});

test("Genome should disable the previous connection and create two new connections when adding a node", () => {
    const inputs = 2;
    const outputs = 1;
    Innovation.init(inputs, outputs);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [
            new ConnectionVariation(
                new ConnectionId(1, 3),
                1,
                true
            )
        ]
    );

    expect(genome.connections.length).toBe(1);
    expect(genome.connections[0].enabled).toBe(true);

    genome.addNode();
    // The old connection still exists and two new connections have been made
    expect(genome.connections.length).toBe(3);
    expect(Innovation.connections.length).toBe(4)
    // 1->3 has been disabled
    expect(genome.connections[0].in).toBe(1);
    expect(genome.connections[0].out).toBe(3);
    expect(genome.connections[0].enabled).toBe(false);
    expect(Innovation.connections[0].in).toBe(1);
    expect(Innovation.connections[0].out).toBe(3);
    // 1->4 has been created and enabled
    expect(genome.connections[1].in).toBe(1);
    expect(genome.connections[1].out).toBe(4);
    expect(genome.connections[1].enabled).toBe(true);
    expect(Innovation.connections[2].in).toBe(1);
    expect(Innovation.connections[2].out).toBe(4);
    // 4->3 has been created and enabled
    expect(genome.connections[2].in).toBe(4);
    expect(genome.connections[2].out).toBe(3);
    expect(genome.connections[2].enabled).toBe(true);
    expect(Innovation.connections[3].in).toBe(4);
    expect(Innovation.connections[3].out).toBe(3);
});

test("Genome should properly set the wheights of the new connections when adding a node", () => {
    const inputs = 2;
    const outputs = 1;
    const originalWeight = 2;
    const defaultWeight = 1;

    Innovation.init(inputs, outputs);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [ new ConnectionVariation(new ConnectionId(1, 3), originalWeight) ]
    );

    genome.addNode();
    expect(genome.connections[0].weight).toBe(originalWeight);
    expect(genome.connections[1].weight).toBe(defaultWeight);
    expect(genome.connections[2].weight).toBe(originalWeight);
});

test("Genome should mutate a node's bias", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
    );
    const bias = genome.getNode(1).bias;
    expect(bias).toStrictEqual(genome.getNode(1).bias);
    genome.mutateNodeBias(1);
    expect(bias).not.toStrictEqual(genome.getNode(1).bias);
});

test("Genome should remove a node", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [ new ConnectionVariation(new ConnectionId(1, 3), 1) ]
    );

    genome.addNode();
    expect(genome.getNode(4)).not.toBe(null);
    genome.removeNode(4);
    expect(genome.containsNode(4)).toBe(false);
});

test("Genome should get a random node", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
    );

    expect(genome.getRandomNode()).not.toBeNull();
    expect(() => genome.getRandomNode()).not.toThrow(Error);
});
