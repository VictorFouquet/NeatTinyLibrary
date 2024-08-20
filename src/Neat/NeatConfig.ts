import { INeatConfig } from "./interfaces";
import { MissingConfigError } from "./errors";
import { Config } from "./configs";

export class NeatConfig implements INeatConfig {
    private static _instance: NeatConfig;
    private static _allowedEnvs = ["dev", "default", "prod", "test"];

    private static readonly c1Default = 1;
    private static readonly c2Default = 1;
    private static readonly c3Default = 1;

    static GetInstance(config?: INeatConfig) {
        if (NeatConfig._instance === undefined) {
            NeatConfig._instance = new NeatConfig(config);
        }
        return NeatConfig._instance;
    }

    readonly populationSize:         number;
    readonly mutationThreshold:      number;
    readonly resetWeightThreshold:   number;
    readonly shiftWeightThreshold:   number;
    readonly resetEnabledThreshold:  number;
    readonly addConnectionThreshold: number;
    readonly addNodeThreshold:       number;
    readonly resetBiasThreshold:     number;
    readonly c1: number;
    readonly c2: number;
    readonly c3: number;

    private constructor(config_?: INeatConfig) {
        const env = process.env.NODE_ENV ?? "default";
        const config = config_
            ? config_
            :  NeatConfig._allowedEnvs.includes(env)
                ? Config[env]
                : Config["default"];

        if (!("populationSize" in config))
            throw new MissingConfigError("populationSize", env);
        else
            this.populationSize = config.populationSize;

        if (!("mutationThreshold" in config))
            throw new MissingConfigError("mutationThreshold", env);
        else
            this.mutationThreshold = config.mutationThreshold;

        if (!("resetWeightThreshold" in config))
            throw new MissingConfigError("resetWeightThreshold", env);
        else
            this.resetWeightThreshold = config.resetWeightThreshold;

        if (!("shiftWeightThreshold" in config))
            throw new MissingConfigError("shiftWeightThreshold", env);
        else
            this.shiftWeightThreshold = config.shiftWeightThreshold;

        if (!("resetEnabledThreshold" in config))
            throw new MissingConfigError("resetEnabledThreshold", env);
        else
            this.resetEnabledThreshold = config.resetEnabledThreshold;

        if (!("addConnectionThreshold" in config))
            throw new MissingConfigError("addConnectionThreshold", env);
        else
            this.addConnectionThreshold = config.addConnectionThreshold;

        if (!("addNodeThreshold" in config))
            throw new MissingConfigError("ADD_NODE_THRESHOLD", env);
        else
            this.addNodeThreshold = config.addNodeThreshold;

        if (!("resetBiasThreshold" in config))
            throw new MissingConfigError("resetBiasThreshold", env);
        else
            this.resetBiasThreshold = config.resetBiasThreshold;

        this.c1 = config.c1 === undefined ? NeatConfig.c1Default : config.c1;
        this.c2 = config.c2 === undefined ? NeatConfig.c2Default : config.c2;
        this.c3 = config.c3 === undefined ? NeatConfig.c3Default : config.c3;
    }
}
