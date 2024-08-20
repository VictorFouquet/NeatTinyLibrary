import { ConnectionVariation } from "../Connection";
import { Genome, IGenome } from "../Genome";
import { Individual } from "../Individual/Individual";
import { Innovation } from "../Innovation";
import { NodeVariation } from "../Node";
import { INeat, INeatConfig } from "./interfaces";
import { NeatConfig } from "./NeatConfig";

export class Neat implements INeat {
    private static _config:  INeatConfig = new NeatConfig();

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
                ),
                fitnessFn
            ));
        }
    };

    static get config(): INeatConfig { return Neat._config; };

    crossOver(): void {
        throw new Error("Method not implemented.");
    }

    mutate(force: boolean = false, _rand?: number): void {
        for (let individual of this.individuals) {
            const genome = individual.genome;
            if (force === false && Math.random() < Neat.config.mutationThreshold) {
                continue;
            }
            const rand = _rand !== undefined ? _rand : Math.random();
            let sum = Neat.config.resetBiasThreshold;
            if (rand < sum && genome.nodes.length > 0) {
                genome.mutateNodeBias(genome.getRandomNode().id);
                continue;
            }

            sum += Neat.config.shiftWeightThreshold;
            if (rand < sum && genome.connections.length > 0) {
                genome.mutateConnectionWeightShift(genome.getRandomConnection().id);
                continue;
            }

            sum += Neat.config.resetWeighThreshold;
            if (rand < sum && genome.connections.length > 0) {
                genome.mutateConnectionWeight(genome.getRandomConnection().id);
                continue;
            }

            sum += Neat.config.resetEnabledThreshold;
            if (rand < sum && genome.connections.length > 0) {
                genome.mutateConnectionEnabled(genome.getRandomConnection().id);
                continue;
            }

            sum += Neat.config.addConnectionThreshold;
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
