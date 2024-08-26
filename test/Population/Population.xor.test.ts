import { ConnectionVariation } from "../../src/Connection";
import { IEnvironment } from "../../src/Environment";
import { Genome } from "../../src/Genome";
import { IIndividual, Individual } from "../../src/Individual";
import { Innovation } from "../../src/Innovation";
import { ActivationFunctions, NeuralNetwork } from "../../src/NeuralNetwork";
import { NodeVariation } from "../../src/Node";
import { Population } from "../../src/Population";

class XorEnviromnent implements IEnvironment {
    current: number = 0;
    dataset = [
        { X: [0, 0], Y: [0, 1] },
        { X: [1, 0], Y: [1, 0] },
        { X: [0, 1], Y: [1, 0] },
        { X: [1, 1], Y: [0, 1] },
    ];

    shouldTriggerNewGeneration(): boolean {
        if (this.current === 4) {
            this.current = 0;
            this.shuffle();
            return true;
        }
        return false;
    }

    getInput(indiv: IIndividual): number[] {
        return this.dataset[this.current].X;
    }

    handleDecision(indiv: IIndividual): void {
        const deltaA = Math.abs(indiv.outputs[0] - this.dataset[this.current].Y[0]);
        const deltaB = Math.abs(indiv.outputs[1] - this.dataset[this.current].Y[1]);
        indiv.fitness += 2 - deltaA - deltaB;
    }

    evaluate(indiv: IIndividual): number {
        return indiv.fitness;
    }

    update(): void {
        this.current++;
    }

    private shuffle() {
        for (var i = this.dataset.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.dataset[i];
            this.dataset[i] = this.dataset[j];
            this.dataset[j] = temp;
        }
    }
}

test("Population should solve Xor problem", () => {
    Innovation.init(2, 2);
    const individuals: IIndividual[] = [];
    for (let i = 0; i < 50; i++) {
        individuals.push(new Individual(
            new Genome(
                Innovation.nodes.map(n => new NodeVariation(n.id, 1 - 2 * Math.random())),
                Innovation.connections.map(c => new ConnectionVariation(c.id, 1 - 2 * Math.random()))
            ),
            new NeuralNetwork(
                ActivationFunctions.linear,
                ActivationFunctions.sigmoid,
                ActivationFunctions.sigmoid
            )
        ));
    }
    const xorEnv = new XorEnviromnent();
    const population = new Population(xorEnv, individuals);

    for (let i = 0; i < 400; i++) {
        population.live();
        console.log(population.averageScore);
    }

    const fittest = population.individuals.sort((a,b) => b.fitness - a.fitness)[0];
    fittest.makeDecision([0, 0])
    expect(fittest.outputs[0]).toBeLessThan(0.5)
    fittest.makeDecision([1, 1])
    expect(fittest.outputs[0]).toBeLessThan(0.5)
    fittest.makeDecision([1, 0])
    expect(fittest.outputs[0]).toBeGreaterThan(0.5)
    fittest.makeDecision([0, 1])
    expect(fittest.outputs[0]).toBeGreaterThan(0.5)

})