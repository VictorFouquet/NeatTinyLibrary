import { IIndividual, Individual } from "../Individual";
import { Neat } from "../Neat";
import { Speciation } from "../Speciation";
import { IPopulation } from "./interfaces";

export class Population implements IPopulation {
    private _currentGeneration: { [id: number]: IIndividual[] } = {};
    individuals: IIndividual[];
    averageScore: number = 0;
    fitnessFn: (individual: IIndividual, inputs: number[]) => number;

    constructor(
        fitnessFn: (individual: IIndividual, inputs: number[]) => number,
        individuals: IIndividual[] = []
    ) {
        this.individuals = individuals;
        this.fitnessFn = fitnessFn;
    }

    computeScores(inputs: number[]): void {
        // Assign each individual to its species according to its genome
        this.groupIndividualsBySpecies();
        let speciesCount = 0;
        for (let [species, individuals] of Object.entries(this._currentGeneration)) {
            speciesCount++;
            let speciesScore = 0;
            for (let individual of individuals) {
                individual.fitness = this.evaluateIndividual(individual, inputs);
                individual.adjustedFitness = individual.fitness / individuals.length;
                speciesScore += individual.adjustedFitness;
            }
            const averageScore = speciesScore / individuals.length;
            this.averageScore += averageScore;
            Speciation.setScore(+species, averageScore);
        }
        if (speciesCount > 0)
            this.averageScore /= speciesCount;
    }

    evaluateIndividual(individual: IIndividual, inputs: number[]): number {
        return this.fitnessFn(individual, inputs);
    }

    crossOver(): IIndividual[] {
        const newGeneration: IIndividual[] = [];
        for (let [species, individuals] of Object.entries(this._currentGeneration)) {
            const offspringCount = Math.round(
                Speciation.getSpecies(+species).score / 
                this.averageScore * 
                individuals.length
            );
            
            const parentsToSave = Math.max(1, offspringCount * 0.2);
            const childrenToCreate = offspringCount - parentsToSave;
            for (let i = 0; i < childrenToCreate; i++) {
                let parent1 = individuals[Math.floor(Math.random() * individuals.length)];
                let parent2 = parent1;
                while (parent1 === parent2 && individuals.length > 1) {
                    parent2 = individuals[Math.floor(Math.random() * individuals.length)];
                }
                if (parent1.adjustedFitness! < parent2.adjustedFitness!) {
                    [parent1, parent2] = [parent2, parent1];
                }
                const childGenome = parent1.genome.crossover(parent2.genome);
                childGenome.speciesId = +species;
                newGeneration.push(new Individual(childGenome));
            }

            const parents = individuals.slice();
            for (let i = 0; i < parentsToSave; i++) {
                newGeneration.push(parents.splice(Math.floor(Math.random() * parents.length), 1)[0])
            }
        }

        return newGeneration;
    }

    groupIndividualsBySpecies(): IIndividual[][] {
        this._currentGeneration = {};

        for (let individual of this.individuals) {
            Speciation.speciate(individual.genome);

            if (this._currentGeneration[individual.speciesId!] === undefined) {
                this._currentGeneration[individual.speciesId!] = [];
            }

            this._currentGeneration[individual.speciesId!].push(individual);
        }

        return Object.values(this._currentGeneration).filter(group => group.length > 0);
    }

    extinct(speciesIds: number[]): void {
        // Extincts species that didnt improve
        for (let speciesId of speciesIds) {
            const species = Speciation.getSpecies(speciesId);
            if (species.noImprovement === 15) {
                Speciation.extinct(speciesId);
            }
        }
        // Extincts species that no longer have individuals
        for (let speciesId of Speciation.activeSpecies) {
            if (
                !speciesIds.includes(speciesId) &&
                !Speciation.getSpecies(speciesId).extinct
            ) {
                Speciation.extinct(speciesId)
            }
        }
    }

    mutate(individuals: IIndividual[], force: boolean = false, rand_?: number): void {
        for (let indiv of individuals) {
            if (force === false && Math.random() < Neat.config.mutationThreshold) {
                continue;
            }

            const genome = indiv.genome;

            const rand = rand_ !== undefined ? rand_ : Math.random();
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

            sum += Neat.config.resetWeightThreshold;
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

    evolve(inputs: number[]): void {
        // this.computeScores(inputs);
        // const offspring = this.crossOver();
        // this.extinct(offspring.map(i => i.speciesId!));
        // this.mutate(offspring);
        // this._currentGeneration = {};
        // this.groupIndividualsBySpecies();
    }
}
