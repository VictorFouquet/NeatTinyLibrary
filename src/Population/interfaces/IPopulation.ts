import { IEnvironment } from "../../Environment";
import { IIndividual } from "../../Individual";

export interface IPopulation {
    individuals: IIndividual[];
    environment: IEnvironment;

    computeScores(inputs: number[]): void;
    crossOver(): IIndividual[]
    evaluateIndividual(individual: IIndividual, inputs: number[]): number
    evolve(): IIndividual[];
    extinct(speciesIds: number[]): void 
    groupIndividualsBySpecies(): IIndividual[][]
    mutate(individuals: IIndividual[]): void;
}