import { IEnvironment } from "../../src/Environment";
import { IIndividual } from "../../src/Individual";

export class EmptyEnvironment implements IEnvironment {
    _shouldTrigger: () => boolean;
    _getInput: (indiv: IIndividual) => number[];
    _handleDecision: (indiv: IIndividual) => void;
    _evaluate: (indiv: IIndividual) => number;
    _update: () => void; 

    constructor(
        _shouldTrigger: () => boolean,
        _getInput: (indiv: IIndividual) => number[],
        _handleDecision: (indiv: IIndividual) => void,
        _evaluate: (indiv: IIndividual) => number,
        _update: () => void
    ) {
        this._shouldTrigger = _shouldTrigger;
        this._getInput = _getInput;
        this._handleDecision = _handleDecision;
        this._evaluate = _evaluate;
        this._update = _update; 
    }

    shouldTriggerNewGeneration(): boolean {
        return this._shouldTrigger();
    }

    getInput(indiv: IIndividual): number[] {
        return this._getInput(indiv);
    }

    handleDecision(indiv: IIndividual): void {
        this._handleDecision(indiv);
    }

    evaluate(indiv: IIndividual): number {
        return this._evaluate(indiv);
    }

    update(): void {
        this._update();
    }
};
