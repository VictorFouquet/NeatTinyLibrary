import { IGenome } from "../../Genome";

export interface ISpecies {
    id: number;
    representative: IGenome;
    extinct: boolean;
}
