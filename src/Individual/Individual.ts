import { IGenome } from "../Genome";
import { IIndividual } from "./interfaces";

export class Individual implements IIndividual {
    genome: IGenome;
    fitness: number = 0;
    adjustedFitness: number = 0;
    outputs: number[] = [];

    constructor(genome: IGenome) {
        this.genome = genome;
    }

    get speciesId(): number|null { return this.genome.speciesId; }

    makeDecision(inputs: number[]): void {
        // TODO: update individual's output
    }
}