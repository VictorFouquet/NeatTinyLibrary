import { ConnectionVariation } from "../../src/Connection";
import { Genome } from "../../src/Genome";
import { Innovation } from "../../src/Innovation"
import { NeuralNetwork } from "../../src/NeuralNetwork";
import { NodeVariation } from "../../src/Node";

test("Neural network should feedforward data in a fully connected network with no hidden layer", () => {
    Innovation.init(2, 1);
    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    );
    const neuralNetwork = new NeuralNetwork();

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
    const neuralNetwork = new NeuralNetwork();

    expect(neuralNetwork.compute(genome, [-1, -1])).toEqual([1.5]);
    expect(neuralNetwork.compute(genome, [0, -1])).toEqual([2.25]);
    expect(neuralNetwork.compute(genome, [0, 0])).toEqual([3]);
    expect(neuralNetwork.compute(genome, [1, -1])).toEqual([3]);
    expect(neuralNetwork.compute(genome, [1, 0])).toEqual([3.75]);
    expect(neuralNetwork.compute(genome, [1, 1])).toEqual([4.5]);
})

test("Neural network should order nodes by layers whithout hidden layer", () => {
    Innovation.init(2, 1);
    Innovation.createHiddenNode();
    Innovation.createConnection(1, 4);
    Innovation.createConnection(2, 4);
    Innovation.createConnection(4, 3);

    const genome = new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    );
    const nn = new NeuralNetwork();

    expect(nn.sortNodesByLayers(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    ))).toEqual([[1,2],[4],[3]]);

    Innovation.createHiddenNode();
    Innovation.createConnection(1, 5);
    Innovation.createConnection(2, 5);
    Innovation.createConnection(5, 3);

    expect(nn.sortNodesByLayers(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    ))).toEqual([[1,2],[4,5],[3]]);

    Innovation.createHiddenNode();
    Innovation.createConnection(4, 6);
    Innovation.createConnection(5, 6);
    Innovation.createConnection(6, 3);

    expect(nn.sortNodesByLayers(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    ))).toEqual([[1,2],[4,5],[6],[3]]);

    Innovation.createHiddenNode();
    Innovation.createConnection(1, 7);
    Innovation.createConnection(2, 7);
    Innovation.createConnection(7, 4);

    expect(nn.sortNodesByLayers(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    ))).toEqual([[1,2],[5,7],[4],[6],[3]]);

    Innovation.createConnection(7, 5);
    expect(nn.sortNodesByLayers(new Genome(
        Innovation.nodes.map(n => new NodeVariation(n.id, 1)),
        Innovation.connections.map(c => new ConnectionVariation(c.id, 0.5, true))
    ))).toEqual([[1,2],[7],[4,5],[6],[3]]);
});
