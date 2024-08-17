import { InnovationErrorEnum } from "./enums/InnovationErrorEnum";

export class OutputLinkageError extends Error {
    constructor(_in: number, out: number) {
        const msg = `${InnovationErrorEnum.ForbiddenOutputLinkage}. Cannot link ${_in} to ${out}.`
        super(msg);
    }
}
