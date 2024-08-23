import { Genome } from "../../src/Genome";
import { IIndividual, Individual } from "../../src/Individual";
import { EmptyEnvironment } from "./EmptyEnvironment.mock";

test("Mock empty environment should return the same result as its argument functions", () => {
    const trig = Math.random() > 0.5;
    const score = Math.random();
    const shouldTrigger = () => trig;
    const getInput = (indiv: IIndividual) => [1,2,3];
    const evaluate = (indiv: IIndividual, output: number[]) => score;
    const update = () => {};
    const mock = new EmptyEnvironment(
        shouldTrigger,
        getInput,
        evaluate,
        update
    );
    const indiv = new Individual(new Genome([]));
    expect(mock.shouldTriggerNewGeneration()).toBe(shouldTrigger());
    expect(mock.getInput(indiv)).toEqual(getInput(indiv));
    expect(mock.evaluate(indiv, [0])).toEqual(evaluate(indiv, [0]));
    expect(mock.update()).toBe(undefined);
});
