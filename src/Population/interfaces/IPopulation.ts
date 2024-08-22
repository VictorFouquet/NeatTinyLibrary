import { IIndividual } from "../../Individual";

export interface IPopulation {
    individuals: IIndividual[];

    computeScores(inputs: number[]): void;
    crossOver(): IIndividual[]
    evaluateIndividual(individual: IIndividual, inputs: number[]): number
    extinct(speciesIds: number[]): void 
    fitnessFn: (individual: IIndividual, inputs: number[]) => number;
    groupIndividualsBySpecies(): IIndividual[][]
}