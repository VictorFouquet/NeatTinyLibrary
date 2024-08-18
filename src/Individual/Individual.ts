import { IGenome } from "../Genome";
import { IIndividual } from "./interfaces";

export class Individual implements IIndividual {
    genome: IGenome;
    fitness: number;
    fitnessFn: (arg: any) => number;

    constructor(genome: IGenome, fitnessFn: (arg:any) => number) {
        this.genome = genome;
        this.fitness = 0;
        this.fitnessFn = fitnessFn;
    }
}