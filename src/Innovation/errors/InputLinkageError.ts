import { InnovationErrorEnum } from "./enums/InnovationErrorEnum";

export class InputLinkageError extends Error {
    constructor(_in: number, out: number) {
        const msg = `${InnovationErrorEnum.ForbiddenInputLinkage}. Cannot link ${_in} to ${out}.`
        super(msg);
    }
}
