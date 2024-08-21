import { ConnectionId, ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { Innovation } from "../../src/Innovation";
import { Neat } from "../../src/Neat";
import { NodeVariation } from "../../src/Node";

test("Genome should compute its distance to another genome", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs); // N: 1, 2, 3, C: 4, 5 
    
    Innovation.createHiddenNode(); // N: 6
    Innovation.createConnection(1, 4); // C 7
    Innovation.createConnection(2, 4); // C 8
    Innovation.createConnection(4, 3); // C 9
    // Holds C4, C5, C7, C8, C9
    const parent1 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0, true))
    );

    // Holds C4, C5, C8
    const parent2 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [
            new ConnectionId(1,3),
            new ConnectionId(2,3),
            new ConnectionId(2,4)

        ].map(c => new ConnectionVariation(c, 1, false))
    );

    // There should be 1 disjoint, 1 excess, and 3 common
    const disjoint = 1;
    const excess = 1;
    const common = 3;
    const deltaW = 3; // Delta of 1 between each common connection

    const distance = Neat.config.c1 * disjoint +
        Neat.config.c2 * excess +
        deltaW / common;
    expect(parent1.distance(parent2)).toBe(distance);
});

test("Genome should take excess gene from genome containing the highest global innovation number", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs); // N: 1, 2, 3, C: 4, 5 
    // Holds C4, C5
    const parent1 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0, true))
    );

    Innovation.createHiddenNode(); // N: 6
    Innovation.createConnection(1, 4); // C 7
    Innovation.createConnection(2, 4); // C 8
    Innovation.createConnection(4, 3); // C 9

    // Holds C4, C5, C7, C8, C9
    const parent2 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1, false))
    );

    // There should be 0 disjoint, 3 excess, and 2 common
    const disjoint = 0;
    const excess = 3;
    const common = 2;
    const deltaW = 2; // Delta of 1 between each common connection

    const distance = Neat.config.c1 * disjoint +
        Neat.config.c2 * excess +
        deltaW / common;
    expect(parent1.distance(parent2)).toBe(distance);
});
