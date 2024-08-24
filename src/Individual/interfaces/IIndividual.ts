import { IGenome } from "../../Genome";
import { INeuralNetwork } from "../../NeuralNetwork";

export interface IIndividual {
    genome:          IGenome;
    neuralNetwork:   INeuralNetwork;
    fitness:         number;
    adjustedFitness: number;
    speciesId:       number|null;
    outputs:         number[];

    makeDecision(inputs: number[]): void;
}