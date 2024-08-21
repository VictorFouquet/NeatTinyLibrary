import { IIndividual, Individual } from "../Individual";
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

            }
            Speciation.setScore(individuals[0].speciesId!, speciesScore);
        }
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
}
