import { ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { IIndividual } from "../../src/Individual";
import { Individual } from "../../src/Individual/Individual";
import { Innovation } from "../../src/Innovation"
import { NodeVariation } from "../../src/Node";
import { Population } from "../../src/Population";
import { Speciation } from "../../src/Speciation";

beforeEach(() => {
    Speciation.clear();
})

test("Population should group individuals by species", () => {
    Innovation.init(2,1);

    const indiv1 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv2 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));
    const indiv3 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv4 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));

    const fitnessFn = (indiv: IIndividual, args: number[]) => 1;

    const population = new Population(
        fitnessFn,
        [ indiv1, indiv2, indiv3, indiv4 ]
    );

    const grouped = population.groupIndividualsBySpecies();
    expect(grouped.length).toBe(2);
    expect(grouped[0]).toEqual([indiv1, indiv3]);
    expect(grouped[1]).toEqual([indiv2, indiv4]);
});

test("Population should compute species and individuals scores", () => {
    Innovation.init(2,1);

    const indiv1 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv2 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));
    const indiv3 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv4 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));

    const fitnessFn = (indiv: IIndividual, inputs: number[]) => {
        switch(indiv) {
            case indiv1:
                return 1;
            case indiv2:
                return 10;
            case indiv3:
                return 3;
            case indiv4:
                return 30;
            default:
                return 0;
        }
    }
    const population = new Population(
        fitnessFn,
        [ indiv1, indiv2, indiv3, indiv4]
    );

    population.computeScores([]);
    // Species 1 contains 2 individuals, 1 and 3
    // score = ( (1 / 2) + (3 / 2) ) / 2
    expect(Speciation.getSpecies(1).score).toBe(1);
    // Species 1 contains 2 individuals, 1 and 3
    // score = ( (10 / 2) + (30 / 2) ) / 2
    expect(Speciation.getSpecies(2).score).toBe(10);
    // Individual fitness should not have been affected
    expect(indiv1.fitness).toBe(1);
    expect(indiv3.fitness).toBe(3);
    expect(indiv2.fitness).toBe(10);
    expect(indiv4.fitness).toBe(30);
});

test("Population should compute species and individuals scores", () => {
    Innovation.init(2,1);

    const indiv1 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv2 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));
    const indiv3 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv4 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));

    const fitnessFn = (indiv: IIndividual, inputs: number[]) => {
        switch(indiv) {
            case indiv1:
                return 1;
            case indiv2:
                return 2;
            case indiv3:
                return 3;
            case indiv4:
                return 6;
            default:
                return 0;
        }
    }
    const population = new Population(
        fitnessFn,
        [ indiv1, indiv2, indiv3, indiv4]
    );

    population.computeScores([]);
    const offspring = population.crossOver();
    // Species 1 has round(1 / 1.5 * 2) = 1 individual (parent only)
    const species1 = offspring.filter(i => i.speciesId === 1);
    expect(species1.length).toBe(1);
    expect([indiv1, indiv3].includes(species1[0])).toBe(true);
    // Species 2 has round(2 / 1.5 * 2) = 3 individual (2 children 1 parent)
    const species2 = offspring.filter(i => i.speciesId === 2);
    expect(species2.length).toBe(3);
    // Parents are added after children
    const parent = species2.pop();
    expect([indiv2, indiv4].includes(parent!));
    expect([indiv1, indiv2, indiv3, indiv4].includes(species2[0])).toBe(false);
    expect([indiv1, indiv2, indiv3, indiv4].includes(species2[1])).toBe(false);
});

test("Population should extinct the species that didnt improve for 15 generations", () => {
    Innovation.init(2,1);

    const indiv1 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv2 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));
    const indiv3 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv4 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));

    const fitnessFn = (indiv: IIndividual, inputs: number[]) => 0
    const population = new Population(
        fitnessFn,
        [ indiv1, indiv2, indiv3, indiv4]
    );

    population.groupIndividualsBySpecies();
    const species1 = Speciation.getSpecies(1);
    expect(species1.score).toBe(0);
    for (let i = 0; i < 15; i++) {
        Speciation.setScore(species1.id, 0);
    }
    expect(species1.noImprovement).toBe(15);
    population.extinct([1, 2]);
    expect(species1.extinct).toBe(true);
    expect(Speciation.activeSpecies.length).toBe(1);
});

test("Population should extinct the species that no longer have individuals in the new generation", () => {
    Innovation.init(2,1);

    const indiv1 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv2 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));
    const indiv3 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    const indiv4 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));

    const fitnessFn = (indiv: IIndividual, inputs: number[]) => 0
    const population = new Population(
        fitnessFn,
        [ indiv1, indiv2, indiv3, indiv4]
    );

    population.groupIndividualsBySpecies();
    population.extinct([2]);
    expect(Speciation.getSpecies(1).extinct).toBe(true);
    expect(Speciation.getSpecies(2).extinct).toBe(false);
    expect(Speciation.activeSpecies.length).toBe(1);
});
