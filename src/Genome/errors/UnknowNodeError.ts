import { GenomeErrorEnum } from "../enums";

export class UnknownNodeError extends Error {
    constructor(id: number) {
        const msg = `${GenomeErrorEnum.UnknownNode}. Trying to get node ${id}`;
        super(msg);
    }
}