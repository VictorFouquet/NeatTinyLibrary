import { IGenome } from "../../Genome";

export interface IIndividual {
    genome:    IGenome;
    fitness:   number|null;
    score:     number|null;
    speciesId: number|null;

    fitnessFn:    (arg: number[]) => number;
    computeScore: (arg: number[]) => number;
}