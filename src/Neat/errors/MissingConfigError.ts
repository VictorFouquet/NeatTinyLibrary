import { NeatErrorsEnum } from "../enums";

export class MissingConfigError extends Error {
    constructor(key: string, env: string) {
        const msg = `${NeatErrorsEnum.MissingConfig} Trying to get ${key}. Running in env ${env}.`
        super(msg);
    }
}
