import { IGenome } from "../Genome";
import { IIndividual } from "./interfaces";

export class Individual implements IIndividual {
    genome: IGenome;
    fitness: number|null;
    score:   number|null;
    _speciesId: number|null;

    fitnessFn: (arg: number[]) => number;

    constructor(genome: IGenome, fitnessFn: (arg:number[]) => number) {
        this.genome = genome;
        this.fitness = null;
        this.score = null;
        this._speciesId = genome.speciesId;

        this.fitnessFn = fitnessFn;
    }

    get speciesId(): number|null { return this.genome.speciesId; }

    computeScore(arg: number[]): number {
        this.score = this.fitnessFn(arg);
        return this.score;
    }
}