import { SpeciesErrorEnum } from "../enums";

export class UnknownSpeciesError extends Error {
    constructor(id: number) {
        const msg = `${SpeciesErrorEnum.UnknownSpecies} Trying to get with id ${id}.`;
        super(msg);
    }
}
