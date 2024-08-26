import { IGenome } from "../Genome";
import { ActivationFunctions } from "./ActivationFunctions";
import { INeuralNetwork } from "./interfaces";

export class NeuralNetwork implements INeuralNetwork {
    inputActivation: (x: number) => number;
    hiddenActivation: (x: number) => number = ActivationFunctions.relu;
    outputActivation: (x: number) => number = ActivationFunctions.sigmoid;

    constructor(
        inputActivation: (x: number) => number = ActivationFunctions.linear,
        hiddenActivation: (x: number) => number = ActivationFunctions.relu,
        outputActivation: (x: number) => number = ActivationFunctions.sigmoid
    ) {
        this.inputActivation = inputActivation;
        this.hiddenActivation = hiddenActivation;
        this.outputActivation = outputActivation;
    }

    compute(genome: IGenome, inputs: number[]): number[] {
        for (let node of genome.nodes) {
            node.output = 0;
        }
        const inputNodes = genome.getInputNodes();

        for (let i = 0; i < inputNodes.length; i++) {
            inputNodes[i].output = this.inputActivation(inputs[i]);
        }
        const layers = genome.sortNodesByLayer();

        for (let i = 0; i < layers.length; i++) {
            const connections = genome.connections.filter(c => layers[i].includes(c.in));
            for (let connection of connections) {
                const inNode = genome.getNode(connection.in)!;
                const outNode = genome.getNode(connection.out)!;
                outNode.output += this.hiddenActivation((inNode.output + inNode.bias) * connection.weight);
            }
        }

        return genome.getOutputNodes().map(n => this.outputActivation(n.output + n.bias));
    }
}
