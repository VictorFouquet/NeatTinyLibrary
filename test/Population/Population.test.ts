import { ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { IIndividual } from "../../src/Individual";
import { Individual } from "../../src/Individual/Individual";
import { Innovation } from "../../src/Innovation"
import { Config } from "../../src/Neat";
import { NeatConfig } from "../../src/Neat/NeatConfig";
import { NodeVariation } from "../../src/Node";
import { Population } from "../../src/Population";
import { Speciation } from "../../src/Speciation";

const config = Config.test;
config.populationSize = 1;
NeatConfig.GetInstance(config);

let indiv1: IIndividual;
let indiv2: IIndividual;
let indiv3: IIndividual;
let indiv4: IIndividual;

const fitnessFnSwitch = (indiv: IIndividual, inputs: number[]) => {
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

beforeEach(() => {
    Speciation.clear();
    Innovation.init(2,1);
    indiv1 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    indiv2 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));
    indiv3 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ));
    indiv4 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ));
})

test("Population should group individuals by species", () => {
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
    const population = new Population(
        fitnessFnSwitch,
        [ indiv1, indiv2, indiv3, indiv4]
    );

    population.computeScores([]);
    expect(indiv1.fitness).toBe(1);
    expect(indiv1.adjustedFitness).toBe(0.5);
    expect(indiv3.fitness).toBe(3);
    expect(indiv3.adjustedFitness).toBe(1.5);
    expect(indiv2.fitness).toBe(2);
    expect(indiv2.adjustedFitness).toBe(1);
    expect(indiv4.fitness).toBe(6);
    expect(indiv4.adjustedFitness).toBe(3)

    // Species 1 contains 2 individuals, 1 and 3
    // score = ( (1 / 2) + (3 / 2) ) / 2
    expect(Speciation.getSpecies(1).score).toBe(1);
    // Species 1 contains 2 individuals, 1 and 3
    // score = ( (2 / 2) + (6 / 2) ) / 2
    expect(Speciation.getSpecies(2).score).toBe(2);

});

test("Population should compute species and individuals scores", () => {
    const population = new Population(
        fitnessFnSwitch,
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


test("Population should mutate a genome bias", () => {
    Innovation.init(1, 1);
    const individual = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    ))
    const population = new Population(
        (indiv: IIndividual, inputs: number[]) => 1,
        [ individual ]
    );
    const input = individual.genome.nodes[0];
    const output = individual.genome.nodes[1];
    const sum = input.bias + output.bias;
    expect(input.bias + output.bias).toEqual(sum);
    population.mutate(
        [ individual ],
        true,
        0.1   // Random to target the shift bias mutation
    );
    expect(input.bias + output.bias).not.toEqual(sum);
});

test("Population should reset a genome connection weight", () => {
    Innovation.init(1, 1);
    const individual = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    ))
    const population = new Population(
        (indiv: IIndividual, inputs: number[]) => 1,
        [ individual ]
    );

    const connection = individual.genome.connections[0];
    const weight = connection.weight;
    expect(connection.weight).toEqual(weight);
    population.mutate(
        [ individual ],
        true,
        0.2   // Random to target the shift weight mutation
    );
    expect(connection.weight).not.toEqual(weight);
});

test("Neat should shift a genome connection weight", () => {
    Innovation.init(1, 1);
    const individual = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    ))
    const population = new Population(
        (indiv: IIndividual, inputs: number[]) => 1,
        [ individual ]
    );

    const connection = individual.genome.connections[0];
    const weight = connection.weight;
    expect(connection.weight).toEqual(weight);
    population.mutate(
        [ individual ],
        true,
        0.4   // Random to target the reset weight mutation
    );
    expect(connection.weight).not.toEqual(weight);
});

test("Neat should disable a genome connection", () => {
    Innovation.init(1, 1);
    const individual = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    ))
    const population = new Population(
        (indiv: IIndividual, inputs: number[]) => 1,
        [ individual ]
    );

    const connection = individual.genome.connections[0];

    expect(connection.enabled).toBe(true);
    population.mutate(
        [ individual ],
        true,
        0.6   // Random to target the switch enabled mutation
    );
    expect(connection.enabled).toBe(false);
});

test("Neat should add a connection to a genome", () => {
    Innovation.init(2, 1);
    const individual = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    ))
    const population = new Population(
        (indiv: IIndividual, inputs: number[]) => 1,
        [ individual ]
    );

    expect(individual.genome.connections).toHaveLength(2);
    individual.genome.addNode();
    expect(individual.genome.connections).toHaveLength(4);

    population.mutate(
        [ individual ],
        true,
        0.8   // Random to target the add connection mutation
    );
    expect(individual.genome.connections).toHaveLength(5);
});

test("Neat should add a node to a genome", () => {
    Innovation.init(1, 1);
    const individual = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 1))
    ))
    const population = new Population(
        (indiv: IIndividual, inputs: number[]) => 1,
        [ individual ]
    );
    expect(individual.genome.nodes).toHaveLength(2);

    population.mutate(
        [ individual ],
        true,
        1     // Random to target the add node mutation
    );
    expect(individual.genome.nodes).toHaveLength(3);
});
