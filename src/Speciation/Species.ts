import { IGenome } from "../Genome";
import { ISpecies } from "./interfaces";

export class Species implements ISpecies {
    readonly id: number;
    readonly representative: IGenome;

    constructor(id: number, representative: IGenome) {
        this.id = id;
        this.representative = representative;
        representative.speciesId = this.id;
    }
}