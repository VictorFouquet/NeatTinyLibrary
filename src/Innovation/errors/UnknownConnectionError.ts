import { InnovationErrorEnum } from "./enums";

export class UnknownConnectionError extends Error {
    constructor(_in: number, out: number) {
        const message = `${InnovationErrorEnum.UnknownConnection}. Trying to get connection from ${_in} to ${out}.`;
        super(message);
    }
}
