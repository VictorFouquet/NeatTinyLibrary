import { ConnectionId, ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { InnovationTracker } from "../../src/Innovation";
import { NodeTypeEnum, NodeVariation } from "../../src/Node";

test("Genome should get its input nodes", () => {
    const nodes = [
        new NodeVariation(1, NodeTypeEnum.Input, 0),
        new NodeVariation(2, NodeTypeEnum.Input, 0),
        new NodeVariation(3, NodeTypeEnum.Output, 0)
    ];
    const genome = new Genome(nodes);
    expect(genome.getInputNodes().length).toBe(2);
    expect(genome.getInputNodes().every(n => n.isInput)).toBe(true);
});

test("Genome should get its hidden nodes", () => {
    const nodes = [
        new NodeVariation(1, NodeTypeEnum.Input, 0),
        new NodeVariation(2, NodeTypeEnum.Input, 0),
        new NodeVariation(3, NodeTypeEnum.Hidden, 0),
        new NodeVariation(4, NodeTypeEnum.Hidden, 0),
        new NodeVariation(5, NodeTypeEnum.Hidden, 0),
        new NodeVariation(6, NodeTypeEnum.Output, 0)
    ];
    const genome = new Genome(nodes);
    expect(genome.getHiddenNodes().length).toBe(3);
    expect(genome.getHiddenNodes().every(n => n.isHidden)).toBe(true);
});

test("Genome should get its output nodes", () => {
    const nodes = [
        new NodeVariation(1, NodeTypeEnum.Input, 0),
        new NodeVariation(2, NodeTypeEnum.Output, 0),
        new NodeVariation(3, NodeTypeEnum.Output, 0)
    ];
    const genome = new Genome(nodes);
    expect(genome.getOutputNodes().length).toBe(2);
    expect(genome.getOutputNodes().every(n => n.isOutput)).toBe(true);
});

test("Genome should filter its input nodes", () => {
    const nodes = [
        new NodeVariation(1, NodeTypeEnum.Input, 0),
        new NodeVariation(2, NodeTypeEnum.Input, 0),
        new NodeVariation(3, NodeTypeEnum.Hidden, 0),
        new NodeVariation(4, NodeTypeEnum.Hidden, 0),
        new NodeVariation(5, NodeTypeEnum.Hidden, 0),
        new NodeVariation(6, NodeTypeEnum.Output, 0)
    ];
    const genome = new Genome(nodes);
    expect(genome.filterInputNodes().length).toBe(4);
    expect(genome.filterInputNodes().every(n => !n.isInput)).toBe(true);
});

test("Genome should filter its output nodes", () => {
    const nodes = [
        new NodeVariation(1, NodeTypeEnum.Input, 0),
        new NodeVariation(2, NodeTypeEnum.Input, 0),
        new NodeVariation(3, NodeTypeEnum.Hidden, 0),
        new NodeVariation(4, NodeTypeEnum.Hidden, 0),
        new NodeVariation(5, NodeTypeEnum.Hidden, 0),
        new NodeVariation(6, NodeTypeEnum.Output, 0)
    ];
    const genome = new Genome(nodes);
    expect(genome.filterOutputNodes().length).toBe(5);
    expect(genome.filterOutputNodes().every(n => !n.isOutput)).toBe(true);
});

test("Genome should add a hidden node to its network", () => {
    const inputs = 2;
    const outputs = 1;
    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
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

    expect(InnovationTracker.nodes.length).toBe(3);
    expect(InnovationTracker.nodesCount).toBe(3);
    expect(InnovationTracker.hiddenNodes.length).toBe(0);

    const node = genome.addNode();
    
    expect(node.id).toBe(4);
    expect(node.type).toBe(NodeTypeEnum.Hidden);
    
    expect(InnovationTracker.nodes.length).toBe(4);
    expect(InnovationTracker.nodesCount).toBe(4);
    expect(InnovationTracker.hiddenNodes.length).toBe(1);
});

test("Genome should disable the previous connection and create two new connections when adding a node", () => {
    const inputs = 2;
    const outputs = 1;
    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
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
    expect(InnovationTracker.connections.length).toBe(4)
    // 1->3 has been disabled
    expect(genome.connections[0].in).toBe(1);
    expect(genome.connections[0].out).toBe(3);
    expect(genome.connections[0].enabled).toBe(false);
    expect(InnovationTracker.connections[0].in).toBe(1);
    expect(InnovationTracker.connections[0].out).toBe(3);
    // 1->4 has been created and enabled
    expect(genome.connections[1].in).toBe(1);
    expect(genome.connections[1].out).toBe(4);
    expect(genome.connections[1].enabled).toBe(true);
    expect(InnovationTracker.connections[2].in).toBe(1);
    expect(InnovationTracker.connections[2].out).toBe(4);
    // 4->3 has been created and enabled
    expect(genome.connections[2].in).toBe(4);
    expect(genome.connections[2].out).toBe(3);
    expect(genome.connections[2].enabled).toBe(true);
    expect(InnovationTracker.connections[3].in).toBe(4);
    expect(InnovationTracker.connections[3].out).toBe(3);
});

test("Genome should properly set the wheights of the new connections when adding a node", () => {
    const inputs = 2;
    const outputs = 1;
    const originalWeight = 2;
    const defaultWeight = 1;

    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
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

    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
    );
    const bias = genome.getNode(1).bias;
    expect(bias).toStrictEqual(genome.getNode(1).bias);
    genome.mutateNodeBias(1);
    expect(bias).not.toStrictEqual(genome.getNode(1).bias);
});

test("Genome should remove a node", () => {
    const inputs = 2;
    const outputs = 1;

    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
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

    InnovationTracker.init(inputs, outputs);
    const genome = new Genome(
        InnovationTracker.nodes.map(n => new NodeVariation(n.id, n.type, 1)),
    );

    expect(genome.getRandomNode()).not.toBeNull();
    expect(() => genome.getRandomNode()).not.toThrow(Error);
});
