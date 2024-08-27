import { IConnectionId } from "../../Connection";
import { IGenome } from "./IGenome";

export interface IGenomeLogger {
    logAddNode(genome: IGenome, id: number, conn1: IConnectionId, conn2: IConnectionId): void;
    logAddConnection(genome: IGenome, connectionId: IConnectionId): void;
    logCrossOver(genome1: IGenome, genome2: IGenome, child: IGenome): void;
};
