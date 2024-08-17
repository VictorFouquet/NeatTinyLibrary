import { InnovationErrorEnum } from "./enums/InnovationErrorEnum";

export class UnknownNodeError extends Error {
    constructor(unknown: number) {
        super(`${InnovationErrorEnum.UnknownNode}. Node ${unknown} could not be found`);
    }
}
