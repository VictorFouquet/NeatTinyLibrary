import { IGenome } from "../Genome";
import { ISpecies } from "./interfaces";

export class Species implements ISpecies {
    readonly id: number;
    readonly representative: IGenome;
    extinct: boolean;
    score: number;
    noImprovement: number = 0;

    constructor(id: number, representative: IGenome) {
        this.id = id;
        this.representative = representative;
        this.extinct = false;
        this.score = 0;

        representative.speciesId = this.id;
    }
}