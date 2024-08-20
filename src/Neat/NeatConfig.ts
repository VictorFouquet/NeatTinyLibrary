import dotenvFlow from "dotenv-flow";

import { INeatConfig } from "./interfaces";
import { MissingConfigError } from "./errors";

export class NeatConfig implements INeatConfig {
    populationSize:         number;
    mutationThreshold:      number;
    resetWeighThreshold:    number;
    shiftWeightThreshold:   number;
    resetEnabledThreshold:  number;
    addConnectionThreshold: number;
    addNodeThreshold:       number;
    resetBiasThreshold:     number;
    c1: number;
    c2: number;
    c3: number;

    constructor() {
        dotenvFlow.config();

        if (process.env.POPULATION_SIZE === undefined)
            throw new MissingConfigError("POPULTATION SIZE");
        else
            this.populationSize = +process.env.POPULATION_SIZE;

        if (process.env.MUTATION_THRESHOLD === undefined)
            throw new MissingConfigError("MUTATION_THRESHOLD");
        else
            this.mutationThreshold = +process.env.MUTATION_THRESHOLD;

        if (process.env.RESET_WEIGHT_THRESHOLD === undefined)
            throw new MissingConfigError("RESET_WEIGHT_THRESHOLD")
        else
            this.resetWeighThreshold = +process.env.RESET_WEIGHT_THRESHOLD;

        if (process.env.SHIFT_WEIGHT_THRESHOLD === undefined)
            throw new MissingConfigError("SHIFT_WEIGHT_THRESHOLD")
        else
            this.shiftWeightThreshold = +process.env.SHIFT_WEIGHT_THRESHOLD;

        if (process.env.RESET_ENABLED_THRESHOLD === undefined)
            throw new MissingConfigError("RESET_ENABLED_THRESHOLD")
        else
            this.resetEnabledThreshold = +process.env.RESET_ENABLED_THRESHOLD;

        if (process.env.ADD_CONNECTION_THRESHOLD === undefined)
            throw new MissingConfigError("ADD_CONNECTION_THRESHOLD")
        else
            this.addConnectionThreshold = +process.env.ADD_CONNECTION_THRESHOLD;

        if (process.env.ADD_NODE_THRESHOLD === undefined)
            throw new MissingConfigError("ADD_NODE_THRESHOLD")
        else
            this.addNodeThreshold = +process.env.ADD_NODE_THRESHOLD;

        if (process.env.RESET_BIAS_THRESHOLD === undefined)
            throw new MissingConfigError("RESET_BIAS_THRESHOLD")
        else
            this.resetBiasThreshold = +process.env.RESET_BIAS_THRESHOLD;

        this.c1 = process.env.C1 === undefined ? 1 : +process.env.C1;
        this.c2 = process.env.C2 === undefined ? 1 : +process.env.C2;
        this.c3 = process.env.C3 === undefined ? 1 : +process.env.C3;
    }
}
