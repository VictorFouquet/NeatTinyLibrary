import { ConnectionId } from "../../src/Connection/ConnectionId";
import { ConnectionVariation } from "../../src/Connection/ConnectionVariation";

test("A connection variation should create a deep copy of itself", () => {
    const conVarA = new ConnectionVariation(new ConnectionId(0, 1), 0);
    const conVarB = conVarA.copy();

    expect(conVarA === conVarA).toStrictEqual(true);
    // Make sure both object are not the same
    expect(conVarA === conVarB).toStrictEqual(false);
    // Make sure they still get evaluated to equal each other by custom equals
    expect(conVarA.equals(conVarB)).toStrictEqual(true);
});

test("A connection variation should make a deep copy of itself and mutate its weight", () => {
    const initWeight = 1;
    const conVarA = new ConnectionVariation(new ConnectionId(0, 1), initWeight);
    const mutated = conVarA.mutateWeight();

    expect(conVarA.weight).toStrictEqual(initWeight);
    expect(mutated.equals(conVarA)).toStrictEqual(true);
    expect(mutated.weight).not.toStrictEqual(initWeight);
});

test("A connection variation should make a deep copy of itself and switch its enabled", () => {
    const conVarA = new ConnectionVariation(new ConnectionId(0, 1), 0, true);
    const mutated = conVarA.mutateEnabled();

    expect(conVarA.enabled).toStrictEqual(true);
    expect(mutated.equals(conVarA)).toStrictEqual(true);
    expect(mutated.enabled).toStrictEqual(false);
});
