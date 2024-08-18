import { IGenome } from "../../Genome";
import { INeatConfig } from "./INeatConfig";

export interface INeat {
    genomes: IGenome[];
    config: INeatConfig;

    crossOver(): void;
    mutate(force?: boolean, rand?: number): void;
    speciate(): void;
    select(): void;
};
