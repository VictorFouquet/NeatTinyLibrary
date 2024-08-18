import { ConnectionVariation } from "../Connection";
import { Genome, IGenome } from "../Genome";
import { InnovationTracker } from "../Innovation";
import { NodeVariation } from "../Node";
import { INeat, INeatConfig } from "./interfaces";
import { NeatConfig } from "./NeatConfig";

export class Neat implements INeat {
    genomes: IGenome[];
    config:  INeatConfig;

    constructor(config: INeatConfig) {
        this.config = config;
        this.genomes = [];
        // When starting the algorithm, all genomes have a fully connected genotype,
        // linking all input nodes to all output nodes,
        // sharing the same topology but variable biases and weights
        for (let i = 0; i < this.config.populationSize; i++) {
            this.genomes.push(new Genome(
                InnovationTracker.nodes.map(n => new NodeVariation(
                    n.id, n.type, Math.random() * 2 - 1
                )),
                InnovationTracker.connections.map(c => new ConnectionVariation(
                    c.id, Math.random() * 2 - 1, true
                ))
            ));
        }
    };

    crossOver(): void {
        throw new Error("Method not implemented.");
    }

    mutate(force: boolean = false, _rand?: number): void {
        for (let genome of this.genomes) {
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
