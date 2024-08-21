import { IIndividual } from "../../Individual";

export interface IPopulation {
    individuals: IIndividual[];

    fitnessFn: (individual: IIndividual, inputs: number[]) => number;
    computeScores(inputs: number[]): void;
}