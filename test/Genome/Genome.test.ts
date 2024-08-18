import { ConnectionId, ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { Innovation } from "../../src/Innovation";
import { NodeVariation } from "../../src/Node";

test("Empty genome should not contain any node or connections", () => {
    const genome = Genome.empty();

    expect(genome.connections.length).toBe(0);
    expect(genome.nodes.length).toBe(0);
});

test("Genome should detect when its network is fully connected", () => {
    const inputs = 2;
    const outputs = 1;
    Innovation.init(inputs, outputs);

    const genomeA = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [
            new ConnectionVariation(new ConnectionId(1, 3), 0),
            new ConnectionVariation(new ConnectionId(2, 3), 0)
        ]
    );
    expect(genomeA.isFullyConnected()).toBe(true);

    const genomeB = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1))
    );
    expect(genomeB.isFullyConnected()).toBe(false);
});
