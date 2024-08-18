import { NeatErrorsEnum } from "../enums";

export class MissingConfigError extends Error {
    constructor(key: string) {
        const msg = `${NeatErrorsEnum.MissingConfig} Trying to get ${key}.`
        super(msg);
    }
}
