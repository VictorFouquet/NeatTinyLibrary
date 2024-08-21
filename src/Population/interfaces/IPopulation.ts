import { IIndividual } from "../../Individual";

export interface IPopulation {
    individuals: IIndividual[];

    computeScores(inputs: number[]): void;
}