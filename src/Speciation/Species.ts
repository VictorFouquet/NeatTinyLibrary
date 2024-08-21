import { IGenome } from "../Genome";
import { ISpecies } from "./interfaces";

export class Species implements ISpecies {
    readonly id: number;
    readonly representative: IGenome;
    extinct: boolean;

    constructor(id: number, representative: IGenome) {
        this.id = id;
        this.representative = representative;
        this.extinct = false;

        representative.speciesId = this.id;
    }
}