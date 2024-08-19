import { ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { Innovation } from "../../src/Innovation";
import { NodeVariation } from "../../src/Node";

test("Genome should randomly crossover its joint connections", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs);

    Innovation.createHiddenNode();
    Innovation.createHiddenNode();
    // Link to/from hidden node
    Innovation.createConnection(1, 4);
    Innovation.createConnection(2, 4);
    Innovation.createConnection(1, 5);
    Innovation.createConnection(2, 5);
    Innovation.createConnection(4, 3);
    Innovation.createConnection(4, 5);
    Innovation.createConnection(5, 3);

    // Weight 0, enabled
    const parent1 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0, true))
    );
    // Weight 1, disabled
    const parent2 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1, false))
    );

    const child = parent1.crossover(parent2);

    // Child has herited gene from parent1 xor from parent2
    expect(child.connections.every((c, i) => (
        +(
            c.weight === parent1.connections[i].weight &&
            c.enabled === parent1.connections[i].enabled
        )
        ^+(
            c.weight === parent2.connections[i].weight &&
            c.enabled === parent2.connections[i].enabled
        )
    ))).toBe(true);

    // Child has not herited all its gene from one parent
    expect(
        child.connections.every(c => c.enabled) || 
        child.connections.every(c => !c.enabled)
    ).toBe(false);
});

test("Genome should skip disjoint genes from recessive parent", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs); // N: 1, 2, 3, C: 4, 5 
    const initConns = Innovation.connections;

    Innovation.createHiddenNode(); // N: 6
    Innovation.createConnection(1, 4); // C 7
    Innovation.createConnection(2, 4); // C 8
    Innovation.createConnection(4, 3); // C 9

    const parent1 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0, true))
    );

    Innovation.createHiddenNode(); // N: 10
    const c11 = Innovation.createConnection(1, 5); // C 11
    const c12 = Innovation.createConnection(2, 5); // C 12
    const c13 = Innovation.createConnection(5, 3); // C 13

    const parent2 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        [
            ...initConns.map(c => new ConnectionVariation(c.id, 1, false)),
            new ConnectionVariation(c11.id, 1, false),
            new ConnectionVariation(c12.id, 1, false), 
            new ConnectionVariation(c13.id, 1, false), 
        ]
    );

    // Child 1 with parent1 dominant
    const child1 = parent1.crossover(parent2);
    // Child 2 with parent2 dominant
    const child2 = parent2.crossover(parent1);

    const parent1ConnIds = parent1.connections.map(c => c.globalId);
    const parent2ConnIds = parent2.connections.map(c => c.globalId);

    expect(parent1ConnIds).toEqual([4,5,7,8,9]);
    expect(parent2ConnIds).toEqual([4,5,11,12,13]);

    expect(child1.connections.map(c => c.globalId)).toEqual(parent1ConnIds);
    expect(child2.connections.map(c => c.globalId)).toEqual(parent2ConnIds);
});

test("Genome should keep excess genes from dominant parent", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs); // N: 1, 2, 3, C: 4, 5 
    const parent1 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0, true))
    );
    
    Innovation.createHiddenNode(); // N: 6
    Innovation.createConnection(1, 4); // C 7
    Innovation.createConnection(2, 4); // C 8
    Innovation.createConnection(4, 3); // C 9
    
    const parent2 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1, false))
    );

    // Child with parent2 dominant
    const child = parent2.crossover(parent1);

    const parent1ConnIds = parent1.connections.map(c => c.globalId);
    const parent2ConnIds = parent2.connections.map(c => c.globalId);

    expect(parent1ConnIds).toEqual([4,5]);
    expect(parent2ConnIds).toEqual([4,5,7,8,9]);

    expect(child.connections.map(c => c.globalId)).toEqual(parent2ConnIds);
});

test("Genome should skip excess genes from recessive parent", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs); // N: 1, 2, 3, C: 4, 5 

    const parent1 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0, true))
    );
    
    Innovation.createHiddenNode(); // N: 6
    Innovation.createConnection(1, 4); // C 7
    Innovation.createConnection(2, 4); // C 8
    Innovation.createConnection(4, 3); // C 9
    
    const parent2 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1, false))
    );

    // Child with parent1 dominant
    const child = parent1.crossover(parent2);

    const parent1ConnIds = parent1.connections.map(c => c.globalId);
    const parent2ConnIds = parent2.connections.map(c => c.globalId);

    expect(parent1ConnIds).toEqual([4,5]);
    expect(parent2ConnIds).toEqual([4,5,7,8,9]);

    expect(child.connections.map(c => c.globalId)).toEqual(parent1ConnIds);
});
