import { ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { Innovation } from "../../src/Innovation"
import { ActivationFunctions, NeuralNetwork } from "../../src/NeuralNetwork";
import { NodeVariation } from "../../src/Node";

test("Neural network should feedforward data in a fully connected network with no hidden layer", () => {
    Innovation.init(2, 1);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    );
    const neuralNetwork = new NeuralNetwork(
        ActivationFunctions.linear,
        ActivationFunctions.linear,
        ActivationFunctions.linear
    );

    expect(neuralNetwork.compute(genome, [-1, -1])).toEqual([1]);
    expect(neuralNetwork.compute(genome, [0, -1])).toEqual([1.5]);
    expect(neuralNetwork.compute(genome, [0, 0])).toEqual([2]);
    expect(neuralNetwork.compute(genome, [1, -1])).toEqual([2]);
    expect(neuralNetwork.compute(genome, [1, 0])).toEqual([2.5]);
    expect(neuralNetwork.compute(genome, [1, 1])).toEqual([3]);
});

test("Neural network should feedforward data in a fully connected network with one hidden layer", () => {
    Innovation.init(2, 1);
    Innovation.createHiddenNode();
    Innovation.createConnection(1, 4);
    Innovation.createConnection(2, 4);
    Innovation.createConnection(4, 3);

    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    );
    const neuralNetwork = new NeuralNetwork(
        ActivationFunctions.linear,
        ActivationFunctions.linear,
        ActivationFunctions.linear
    );

    expect(neuralNetwork.compute(genome, [-1, -1])).toEqual([1.5]);
    expect(neuralNetwork.compute(genome, [0, -1])).toEqual([2.25]);
    expect(neuralNetwork.compute(genome, [0, 0])).toEqual([3]);
    expect(neuralNetwork.compute(genome, [1, -1])).toEqual([3]);
    expect(neuralNetwork.compute(genome, [1, 0])).toEqual([3.75]);
    expect(neuralNetwork.compute(genome, [1, 1])).toEqual([4.5]);
})
