import { ConnectionVariation } from "../Connection";
import { Genome, IGenome } from "../Genome";
import { Individual } from "../Individual/Individual";
import { InnovationTracker } from "../Innovation";
import { NodeVariation } from "../Node";
import { INeat, INeatConfig } from "./interfaces";

export class Neat implements INeat {
    individuals: Individual[];
    config:  INeatConfig;

    constructor(config: INeatConfig, fitnessFn: (arg: any) => number) {
        this.config = config;
        this.individuals = [];
        // When starting the algorithm, all genomes have a fully connected genotype,
        // linking all input nodes to all output nodes,
        // sharing the same topology but variable biases and weights
        for (let i = 0; i < this.config.populationSize; i++) {
            this.individuals.push(new Individual(
                new Genome(
                    InnovationTracker.nodes.map(n => new NodeVariation(
                        n.id, n.type, Math.random() * 2 - 1
                    )),
                    InnovationTracker.connections.map(c => new ConnectionVariation(
                        c.id, Math.random() * 2 - 1, true
                    ))
                ),
                fitnessFn
            ));
        }
    };

    crossOver(): void {
        throw new Error("Method not implemented.");
    }

    mutate(force: boolean = false, _rand?: number): void {
        for (let individual of this.individuals) {
            const genome = individual.genome;
            if (force === false && Math.random() < this.config.mutationThreshold) {
                continue;
            }
            const rand = _rand !== undefined ? _rand : Math.random();
            let sum = this.config.resetBiasThreshold;
            if (rand < sum && genome.nodes.length > 0) {
                genome.mutateNodeBias(genome.getRandomNode().id);
                continue;
            }

            sum += this.config.shiftWeightThreshold;
            if (rand < sum && genome.connections.length > 0) {
                genome.mutateConnectionWeightShift(genome.getRandomConnection().id);
                continue;
            }

            sum += this.config.resetWeighThreshold;
            if (rand < sum && genome.connections.length > 0) {
                genome.mutateConnectionWeight(genome.getRandomConnection().id);
                continue;
            }

            sum += this.config.resetEnabledThreshold;
            if (rand < sum && genome.connections.length > 0) {
                genome.mutateConnectionEnabled(genome.getRandomConnection().id);
                continue;
            }

            sum += this.config.addConnectionThreshold;
            if (rand < sum && !genome.isFullyConnected()) {
                genome.addConnection();
                continue;
            }

            genome.addNode();
        }
    }

    speciate(): void {
        throw new Error("Method not implemented.");
    }
    select(): void {
        throw new Error("Method not implemented.");
    }
}
