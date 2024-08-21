import { ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { Individual } from "../../src/Individual/Individual";
import { Innovation } from "../../src/Innovation"
import { NodeVariation } from "../../src/Node";
import { Population } from "../../src/Population";
import { Speciation } from "../../src/Speciation";

test("Population should group individuals by species", () => {
    Innovation.init(2,1);
    const fitnessFn = (args: number[]) => 1;
    const indiv1 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ), fitnessFn);
    const indiv2 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ), fitnessFn);
    const indiv3 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ), fitnessFn);
    const indiv4 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ), fitnessFn);

    const population = new Population([
        indiv1, indiv2, indiv3, indiv4
    ]);

    const grouped = population.groupIndividualsBySpecies();
    expect(grouped.length).toBe(2);
    expect(grouped[0]).toEqual([indiv1, indiv3]);
    expect(grouped[1]).toEqual([indiv2, indiv4]);
});

test("Population should compute species and individuals scores", () => {
    Innovation.init(2,1);
    const fitnessFn1 = (args: number[]) => 1;
    const fitnessFn2 = (args: number[]) => 10;

    const indiv1 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ), fitnessFn1);
    const indiv2 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ), fitnessFn2);
    const indiv3 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 10))
    ), fitnessFn1);
    const indiv4 = new Individual(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, -10)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, -10))
    ), fitnessFn2);

    const population = new Population([
        indiv1, indiv2, indiv3, indiv4
    ]);

    population.computeScores([]);

    expect(Speciation.getSpecies(1).score).toBe(2);
    expect(Speciation.getSpecies(2).score).toBe(20);
    expect(indiv1.score).toBe(1);
    expect(indiv3.score).toBe(1);
    expect(indiv2.score).toBe(10);
    expect(indiv4.score).toBe(10);
});