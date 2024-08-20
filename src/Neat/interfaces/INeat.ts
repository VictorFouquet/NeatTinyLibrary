import { Individual } from "../../Individual/Individual";
import { INeatConfig } from "./INeatConfig";

export interface INeat {
    individuals: Individual[];

    crossOver(): void;
    mutate(force?: boolean, rand?: number): void;
    speciate(): void;
    select(): void;
};
