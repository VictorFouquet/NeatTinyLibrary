import { InnovationErrorEnum } from "./enums/InnovationErrorEnum";

export class ConnectionExistError extends Error {
    constructor(_in: number, out: number) {
        const msg = `${InnovationErrorEnum.ConnectionAlreadyExist}. Cannot link ${_in} to ${out}.`
        super(msg);
    }
}
