import { IGenome } from "../Genome";
import { IIndividual } from "./interfaces";

export class Individual implements IIndividual {
    genome: IGenome;
    fitness: number = 0;
    adjustedFitness: number = 0;
    _speciesId: number|null;

    constructor(genome: IGenome) {
        this.genome = genome;
        this._speciesId = genome.speciesId;
    }

    get speciesId(): number|null { return this.genome.speciesId; }
}