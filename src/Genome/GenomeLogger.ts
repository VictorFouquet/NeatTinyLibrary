import { IConnectionId } from "../Connection";
import { IGenome } from "./interfaces";
import { IGenomeLogger } from "./interfaces/IGenomeLogger";
import * as fs from "fs";

export class GenomeLogger implements IGenomeLogger {
    output = `./${Date.now().toString()}_genome_log.txt`;

    logAddNode(genome: IGenome, id: number, conn1: IConnectionId, conn2: IConnectionId): void {
        const node = genome.getNode(id)!;
        let message = `[ADD_NODE] Genome ${genome.id} has added node ${node.id} of type ${node.type} with x ${node.x}\n`;
        message += `[ADD_NODE] It create the connections ${conn1.in}-${conn1.out} and ${conn2.in}-${conn2.out}\n`
        fs.appendFileSync(this.output, message);
    }

    logAddConnection(genome: IGenome, connectionId: IConnectionId): void {
        const message = `[ADD_CON] Genome ${genome.id} has added connection ${connectionId.in}-${connectionId.out}\n`;
        fs.appendFileSync(this.output, message);
    }

    logCrossOver(genome1: IGenome, genome2: IGenome, child: IGenome): void {
        let message = `[CROSS] Genome ${genome1.id} was crossover with ${genome2.id} creating ${child.id}\n`;
        for (let connection of child.connections) {
            message += `[CROSS] It inherited connection ${connection.id.toString()}\n`;
        }
        fs.appendFileSync(this.output, message);
    }
    
}