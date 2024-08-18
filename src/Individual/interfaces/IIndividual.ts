import { IGenome } from "../../Genome";

export interface IIndividual {
    genome:    IGenome;
    fitness:   number;

    fitnessFn: (arg: any) => number;
}