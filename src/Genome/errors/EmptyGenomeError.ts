import { GenomeErrorEnum } from "../enums";

export class EmptyGenomeError extends Error {
    constructor() {
        super(GenomeErrorEnum.EmptyGenome);
    }
}
