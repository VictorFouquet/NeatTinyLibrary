import { IGenome } from "../../Genome";

export interface IIndividual {
    genome:          IGenome;
    fitness:         number;
    adjustedFitness: number;
    speciesId:       number|null;
    outputs:         number[];

    makeDecision(inputs: number[]): void;
}