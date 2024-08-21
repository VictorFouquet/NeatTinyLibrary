import { IGenome } from "../Genome";
import { UnknownSpeciesError } from "./errors";
import { ISpecies } from "./interfaces";
import { Species } from "./Species";

export class Speciation {
    private static _species: { [id: number]: ISpecies } = {}
    private static _currentGeneration: number[] = [];
    private static _previousGeneration: number[] = [];

    static get species(): ISpecies[] { return Object.values(Speciation._species); }
    static get currentGeneration(): number[] { return Speciation._currentGeneration.slice(); }
    static get previousGeneration(): number[] { return Speciation._previousGeneration.slice(); }

    static clear(): void {
        Speciation._species = {}
        Speciation._currentGeneration = [];
        Speciation._previousGeneration = [];
        SpeciationIdBuilder.Clear();
    }

    static createSpecies(representative: IGenome): ISpecies {
        const id = SpeciationIdBuilder.Next();
        Speciation._species[id] = new Species(id, representative);
        return Speciation._species[id];
    }

    static exists(id: number): boolean {
        return Speciation._species[id] !== undefined;
    }

    static getSpecies(id: number): ISpecies {
        if (!Speciation.exists(id)) {
            throw new UnknownSpeciesError(id);
        }
        return Speciation._species[id];
    }

    static speciate(genome: IGenome, threshold: number = 4): number {
        for (let id of Speciation._previousGeneration) {
            const distance = genome.distance(Speciation._species[id].representative);
            if (distance < threshold) {
                genome.speciesId = id;
                return id;
            }
        }
        for (let id of Speciation._currentGeneration) {
            const distance = genome.distance(Speciation._species[id].representative);
            if (distance < threshold) {
                genome.speciesId = id;
                return id;
            }
        }
        const species = Speciation.createSpecies(genome);
        Speciation._species[species.id] = species;
        Speciation._currentGeneration.push(species.id);
        genome.speciesId = species.id;

        return species.id;
    }
}

class SpeciationIdBuilder {
    private static _current = 0;

    static Next(): number {
        this._current++;
        return SpeciationIdBuilder._current;
    }

    static Exists(id: number): boolean {
        return id <= SpeciationIdBuilder._current; 
    }

    static Clear(): void {
        SpeciationIdBuilder._current = 0;
    }
}