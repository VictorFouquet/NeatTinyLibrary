import { IIndividual } from "../../Individual";

export interface IEnvironment {
    shouldTriggerNewGeneration(): boolean;
    getInput(indiv: IIndividual): number[];
    handleDecision(indiv: IIndividual): void;
    evaluate(indiv: IIndividual): number;
    update(): void;
}