import { ConnectionVariation } from "../Connection";
import { Genome } from "../Genome";
import { Individual } from "../Individual/Individual";
import { Innovation } from "../Innovation";
import { NodeVariation } from "../Node";
import { INeat, INeatConfig } from "./interfaces";
import { NeatConfig } from "./NeatConfig";

export class Neat implements INeat {
    private static _config:  INeatConfig = NeatConfig.GetInstance();

    individuals: Individual[];

    constructor(fitnessFn: (arg: any) => number) {
        this.individuals = [];
        // When starting the algorithm, all genomes have a fully connected ,
        // linking all input nodes to all output nodes,
        // sharing the same topology but variable biases and weights
        for (let i = 0; i < Neat.config.populationSize; i++) {
            this.individuals.push(new Individual(
                new Genome(
                    Innovation.nodes.map(n => new NodeVariation(
                        n.id, Math.random() * 2 - 1
                    )),
                    Innovation.connections.map(c => new ConnectionVariation(
                        c.id, Math.random() * 2 - 1, true
                    ))
                )
            ));
        }
    };

    static get config(): INeatConfig { return Neat._config; };

    crossOver(): void {
        throw new Error("Method not implemented.");
    }

    mutate(force: boolean = false, _rand?: number): void {

    }

    speciate(): void {
        throw new Error("Method not implemented.");
    }
    select(): void {
        throw new Error("Method not implemented.");
    }
}
