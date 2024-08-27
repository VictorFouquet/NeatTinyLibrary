import { IGenome } from "../Genome";
import { ForbiddenExtinctError, UnknownExtinctError, UnknownSpeciesError } from "./errors";
import { ISpecies } from "./interfaces";
import { Species } from "./Species";

export class Speciation {
    private static _species: { [id: number]: ISpecies } = {}
    private static _activeSpecies: number[] = [];

    static get species(): ISpecies[] { return Object.values(Speciation._species); }
    static get activeSpecies(): number[] { return Speciation._activeSpecies.slice(); }

    static clear(): void {
        Speciation._species = {}
        Speciation._activeSpecies = [];
        SpeciationIdBuilder.Clear();
    }

    static createSpecies(representative: IGenome, active: boolean = false): ISpecies {
        const id = SpeciationIdBuilder.Next();

        Speciation._species[id] = new Species(id, representative);
        if (active) {
            Speciation._activeSpecies.push(id);
        }
        return Speciation._species[id];
    }

    static exists(id: number): boolean {
        return SpeciationIdBuilder.Exists(id);
    }

    static getSpecies(id: number): ISpecies {
        if (!SpeciationIdBuilder.Exists(id)) {
            throw new UnknownSpeciesError(id);
        }
        return Speciation._species[id];
    }

    static setScore(id: number, score: number): void {
        if (!SpeciationIdBuilder.Exists(id)) {
            throw new UnknownSpeciesError(id);
        }

        if (this._species[id].score === score) {
            this._species[id].noImprovement++;
        }

        this._species[id].score = score;
    }

    static speciate(genome: IGenome, threshold: number = 4): number {
        for (let id of Speciation._activeSpecies) {
            const distance = genome.distance(Speciation._species[id].representative);
            if (distance < threshold) {
                genome.speciesId = id;
                return id;
            }
        }

        const species = Speciation.createSpecies(genome, false);

        Speciation._species[species.id] = species;
        Speciation._activeSpecies.push(species.id);
        genome.speciesId = species.id;

        return species.id;
    }

    static extinct(id: number): void {
        if (!Speciation.exists(id)) {
            throw new UnknownExtinctError(id);
        }

        if (Speciation._species[id].extinct) {
            throw new ForbiddenExtinctError(id);
        }

        Speciation._species[id].extinct = true;

        if (Speciation._activeSpecies.includes(id))
            Speciation._activeSpecies.splice(Speciation._activeSpecies.indexOf(id), 1);
    }
}

class SpeciationIdBuilder {
    private static _current = 0;

    static Next(): number {
        this._current++;
        return SpeciationIdBuilder._current;
    }

    static Exists(id: number): boolean {
        return id > 0 && id <= SpeciationIdBuilder._current; 
    }

    static Clear(): void {
        SpeciationIdBuilder._current = 0;
    }
}