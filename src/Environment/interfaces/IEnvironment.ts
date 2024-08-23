import { IIndividual } from "../../Individual";

export interface IEnvironment {
    shouldTriggerNewGeneration(): boolean;
    getInput(indiv: IIndividual): number[];
    evaluate(indiv: IIndividual, output: number[]): number;
    update(): void;
}