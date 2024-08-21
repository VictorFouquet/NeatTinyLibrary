import { SpeciesErrorEnum } from "../enums";

export class UnknownExtinctError extends Error {
    constructor(id: number) {
        const msg = `${SpeciesErrorEnum.UnknownExtinct} Trying to extinct ${id}.`;
        super(msg);
    }
}
