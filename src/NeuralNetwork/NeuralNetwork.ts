import { IGenome } from "../Genome";
import { INeuralNetwork } from "./interfaces";

export class NeuralNetwork implements INeuralNetwork {
    sortNodesByLayers(genome: IGenome): number[][] {
        const layers: number[][] = [genome.getInputNodes().map(n => n.id)];
        let nodesToLink = [
            ...genome.getHiddenNodes().map(n => n.id),
            ...genome.getOutputNodes().map(n => n.id)
        ];
        const linked = layers[0].slice();

        while (nodesToLink.length !== 0) {
            const layer: number[] = [];
            for (let node of nodesToLink) {
                let nodeAsOutConnections = genome.connections.filter(c => c.out === node);
                if (nodeAsOutConnections.every(c => linked.includes(c.in))) {
                    layer.push(node);
                }
            }

            linked.push(...layer);
            nodesToLink = nodesToLink.filter(n => !(linked.includes(n)));
            layers.push(layer);
        }

        return layers;
    }

    compute(genome: IGenome, inputs: number[]): number[] {
        for (let node of genome.nodes) {
            node.output = 0;
        }
        const inputNodes = genome.getInputNodes();

        for (let i = 0; i < inputNodes.length; i++) {
            inputNodes[i].output = inputs[i];
        }
        const layers = this.sortNodesByLayers(genome);

        for (let i = 0; i < layers.length; i++) {
            const connections = genome.connections.filter(c => layers[i].includes(c.in));
            for (let connection of connections) {
                const inNode = genome.getNode(connection.in)!;
                const outNode = genome.getNode(connection.out)!;
                outNode.output += (inNode.output + inNode.bias) * connection.weight;
            }
        }

        return genome.getOutputNodes().map(n => n.output + n.bias);
    }
}
