import { Innovation } from "../../src/Innovation"
import { Neat } from "../../src/Neat";
import { NeatConfig } from "../../src/Neat/NeatConfig";

test("Neat should mutate a genome bias", () => {
    Innovation.init(1, 1);
    const config = new NeatConfig();
    config.populationSize = 1;
    const neat = new Neat(() => 1);

    const input = neat.individuals[0].genome.nodes[0];
    const output = neat.individuals[0].genome.nodes[1];
    const sum = input.bias + output.bias;
    expect(input.bias + output.bias).toEqual(sum);
    neat.mutate(
        true, // Forces mutation
        0.1   // Random to target the shift bias mutation
    );
    expect(input.bias + output.bias).not.toEqual(sum);
});

test("Neat should reset a genome connection weight", () => {
    Innovation.init(1, 1);
    const config = new NeatConfig();
    config.populationSize = 1;
    const neat = new Neat(() => 1);

    const connection = neat.individuals[0].genome.connections[0];
    const weight = connection.weight;
    expect(connection.weight).toEqual(weight);
    neat.mutate(
        true, // Forces mutation
        0.2   // Random to target the shift weight mutation
    );
    expect(connection.weight).not.toEqual(weight);
});

test("Neat should shift a genome connection weight", () => {
    Innovation.init(1, 1);
    const config = new NeatConfig();
    config.populationSize = 1;
    const neat = new Neat(() => 1);

    const connection = neat.individuals[0].genome.connections[0];
    const weight = connection.weight;
    expect(connection.weight).toEqual(weight);
    neat.mutate(
        true, // Forces mutation
        0.4   // Random to target the reset weight mutation
    );
    expect(connection.weight).not.toEqual(weight);
});

test("Neat should disable a genome connection", () => {
    Innovation.init(1, 1);
    const config = new NeatConfig();
    config.populationSize = 1;
    const neat = new Neat(() => 1);

    const connection = neat.individuals[0].genome.connections[0];
    const weight = connection.weight;
    expect(connection.enabled).toBe(true);
    neat.mutate(
        true, // Forces mutation
        0.6   // Random to target the switch enabled mutation
    );
    expect(connection.enabled).toBe(false);
});

test("Neat should add a connection to a genome", () => {
    Innovation.init(2, 1);
    const config = new NeatConfig();
    config.populationSize = 1;
    const neat = new Neat(() => 1);

    expect(neat.individuals[0].genome.connections).toHaveLength(2);
    neat.individuals[0].genome.addNode();
    expect(neat.individuals[0].genome.connections).toHaveLength(4);

    neat.mutate(
        true, // Forces mutation
        0.8   // Random to target the add connection mutation
    );
    expect(neat.individuals[0].genome.connections).toHaveLength(5);
});

test("Neat should add a node to a genome", () => {
    Innovation.init(1, 1);
    const config = new NeatConfig();
    config.populationSize = 1;
    const neat = new Neat(() => 1);

    expect(neat.individuals[0].genome.nodes).toHaveLength(2);

    neat.mutate(
        true, // Forces mutation
        1     // Random to target the add node mutation
    );
    expect(neat.individuals[0].genome.nodes).toHaveLength(3);
});
