import { ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { Innovation } from "../../src/Innovation"
import { NodeVariation } from "../../src/Node";
import { Speciation, UnknownSpeciesError } from "../../src/Speciation";

beforeEach(() => {
    Speciation.clear();
});

test("Speciation should create new species", () => {
    Innovation.init(2, 1);
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 1)));
    const species = Speciation.createSpecies(genome);

    expect(species.representative).toBe(genome);
    expect(species.id).toBe(1);
});

test("Speciation should get species", () => {
    Innovation.init(2, 1);
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 1)));
    const species = Speciation.createSpecies(genome);

    expect(Speciation.getSpecies(species.id)).toBe(species);
});

test("Speciation should check if a species exists", () => {
    Innovation.init(2, 1);
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 1)));
    const species = Speciation.createSpecies(genome);

    expect(Speciation.exists(species.id)).toBe(true);
});

test("Speciation should throw error when getting unknown species", () => {
    Innovation.init(2, 1);

    expect(() => Speciation.getSpecies(-1)).toThrow(UnknownSpeciesError);
});

test("Speciation should assign a genome its speciesId when creation a new species", () => {
    Innovation.init(2, 1);
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 1)));
    const species = Speciation.createSpecies(genome);

    expect(genome.speciesId).toBe(species.id);
});

test("Speciation should categorize a genome in its corresponding species", () => {
    Innovation.init(2, 1);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    );
    Innovation.createHiddenNode();
    Innovation.createConnection(1,4);
    Innovation.createConnection(2,4);
    Innovation.createConnection(4,3);
    const genome2 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    );

    // According to the formula
    // d = C1 * disjoint / n + C2 * excess / n + C3 * W
    // d = 1 * 0 / 1 + 1 * 3 / 1 + 1 * 0
    // d = 3
    // Set threshold to 4 to have both genomes in same species
    console.log(genome.distance(genome2))
    console.log(genome, genome2)
    const speciesId = Speciation.speciate(genome, 4);
    expect(genome.speciesId).toBe(speciesId);

    expect(Speciation.speciate(genome2, 4)).toBe(speciesId);
    expect(genome2.speciesId).toBe(speciesId);
});

test("Speciation should create a new species if a genome doesnt fit in anyone existing", () => {
    Innovation.init(2, 1);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    );
    Innovation.createHiddenNode();
    Innovation.createConnection(1,4);
    Innovation.createConnection(2,4);
    Innovation.createConnection(4,3);
    const genome2 = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    );

    // According to the formula
    // d = C1 * disjoint / n + C2 * excess / n + C3 * W
    // d = 1 * 0 / 1 + 1 * 3 / 1 + 1 * 0
    // d = 3
    // Set threshold to 2 to have genomes in different species
    console.log(genome.distance(genome2))
    console.log(genome, genome2)
    const speciesId = Speciation.speciate(genome, 2);
    expect(genome.speciesId).toBe(speciesId);

    const speciesId2 = Speciation.speciate(genome2, 2);
    expect(genome2.speciesId).toBe(speciesId2);
    expect(speciesId2).not.toBe(speciesId);
});
