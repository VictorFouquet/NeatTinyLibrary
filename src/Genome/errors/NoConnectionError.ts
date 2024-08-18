import { GenomeErrorEnum } from "../enums";

export class NoConnectionError extends Error {
    constructor() {
        super(GenomeErrorEnum.NoConnection);
    }
}
