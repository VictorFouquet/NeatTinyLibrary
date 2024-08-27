import { IGenome } from "../Genome";
import { INeuralNetwork, NeuralNetwork } from "../NeuralNetwork";
import { IIndividual } from "./interfaces";

export class Individual implements IIndividual {
    genome: IGenome;
    neuralNetwork: INeuralNetwork;
    fitness: number = 0;
    adjustedFitness: number = 0;
    outputs: number[] = [];

    constructor(genome: IGenome, nn: INeuralNetwork = new NeuralNetwork()) {
        this.genome = genome;
        this.neuralNetwork = nn;
    }

    get speciesId(): number|null { return this.genome.speciesId; }

    makeDecision(inputs: number[]): void {
        this.outputs = this.neuralNetwork.compute(this.genome, inputs);
    }
}