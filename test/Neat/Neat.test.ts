import { Innovation } from "../../src/Innovation"
import { Neat } from "../../src/Neat";

test("Neat should create a Genome population with the same topology", () => {
    const genomeCount = 3;
    
    Innovation.init(2, 1);
    const neat = new Neat(() => 1);

    for (let individual of neat.individuals) {
        const genome = individual.genome;
        expect(genome.connections).toHaveLength(2);
        expect(genome.connections[0].in).toBe(1);
        expect(genome.connections[0].out).toBe(3);
        expect(genome.connections[1].in).toBe(2);
        expect(genome.connections[1].out).toBe(3);
    }
});
