import { IIndividual } from "../Individual";
import { Speciation } from "../Speciation";
import { IPopulation } from "./interfaces";

export class Population implements IPopulation {
    individuals: IIndividual[];
    
    constructor(individuals: IIndividual[] = []) {
        this.individuals = individuals;
    }

    computeScores(inputs: number[]): void {
        // Assign each individual to its species according to its genome
        const grouped = this.groupIndividualsBySpecies();

        for (let individuals of grouped) {
            let speciesScore = 0;
            for (let individual of individuals) {
                speciesScore += individual.computeScore(inputs);
            }
            Speciation.setScore(individuals[0].speciesId!, speciesScore);
        }
    }

    groupIndividualsBySpecies(): IIndividual[][] {
        const assignedIndividuals: { [id: string]: IIndividual[] } = {};

        for (let individual of this.individuals) {
            Speciation.speciate(individual.genome);

            if (assignedIndividuals[individual.speciesId!] === undefined) {
                assignedIndividuals[individual.speciesId!] = [];
            }

            assignedIndividuals[individual.speciesId!].push(individual);
        }

        return Object.values(assignedIndividuals);
    }
}
