export enum InnovationErrorEnum {
    ConnectionAlreadyExist = "Connection already exist",
    UnknownNode = "Connection contains an unknown node",
    UnknownConnection = "Connection could not be found in genome.",
    ForbiddenInputLinkage = "Connection between two input nodes is forbidden",
    ForbiddenOutputLinkage = "Connection between two output nodes is forbidden"
}
