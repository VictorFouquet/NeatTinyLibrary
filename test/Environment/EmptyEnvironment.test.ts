import { Genome } from "../../src/Genome";
import { IIndividual, Individual } from "../../src/Individual";
import { EmptyEnvironment } from "./EmptyEnvironment.mock";

test("Mock empty environment should return the same result as its argument functions", () => {
    const trig = Math.random() > 0.5;
    const score = Math.random();
    const shouldTrigger = () => trig;
    const getInput = (indiv: IIndividual) => [1,2,3];
    const handleDecision = (indiv: IIndividual) => {};
    const evaluate = (indiv: IIndividual) => score;
    const update = () => {};

    const mock = new EmptyEnvironment(
        shouldTrigger,
        getInput,
        handleDecision,
        evaluate,
        update
    );
    const indiv = new Individual(new Genome([]));
    expect(mock.shouldTriggerNewGeneration()).toBe(shouldTrigger());
    expect(mock.getInput(indiv)).toEqual(getInput(indiv));
    expect(mock.handleDecision(indiv)).toBe(undefined);
    expect(mock.evaluate(indiv)).toEqual(evaluate(indiv));
    expect(mock.update()).toBe(undefined);
});
