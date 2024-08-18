import { GenomeErrorEnum } from "../enums";

export class FullyConnectedError extends Error {
    constructor() {
        super(GenomeErrorEnum.FullyConnected);
    }
}
