import { SpeciesErrorEnum } from "../enums";

export class ForbiddenExtinctError extends Error {
    constructor(id: number) {
        const msg = `${SpeciesErrorEnum.ForbiddenExtinct} Trying to extinct ${id}.`;
        super(msg);
    }
}
