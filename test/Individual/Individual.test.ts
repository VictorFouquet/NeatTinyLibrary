import { Genome } from "../../src/Genome";
import { Individual } from "../../src/Individual/Individual";
import { Innovation } from "../../src/Innovation";
import { NodeVariation } from "../../src/Node";

test("Individual should compute its score", () => {
    Innovation.init(1, 2);
    const genome = new Genome(Innovation.nodes.map(n => new NodeVariation(n.id, 1)));
    const individual = new Individual(genome, (arg: number[]) => 1);

    expect(individual.score).toBe(null);
    expect(individual.computeScore([])).toBe(1);
    expect(individual.score).toBe(1);
});
