import { ConnectionId, ConnectionVariation } from "../../src/Connection";

test("A connection variation should create a deep copy of itself", () => {
    const conVarA = new ConnectionVariation(new ConnectionId(0, 1), 0);
    const conVarB = conVarA.copy();

    expect(conVarA === conVarA).toStrictEqual(true);
    // Make sure both object are not the same
    expect(conVarA === conVarB).toStrictEqual(false);
    // Make sure they still get evaluated to equal each other by custom equals
    expect(conVarA.equals(conVarB)).toStrictEqual(true);
});

test("A connection variation should mutate its weight", () => {
    const initWeight = 1;

    const conVarA = new ConnectionVariation(new ConnectionId(0, 1), initWeight);
    expect(conVarA.weight).toStrictEqual(initWeight);

    conVarA.mutateWeight();
    expect(conVarA.weight).not.toStrictEqual(initWeight);
});

test("A connection variation should tweak its node by 10% max", () => {
    const conVarA = new ConnectionVariation(new ConnectionId(0, 1), 1, true);
    conVarA.shiftWeight();
    expect(conVarA.weight).toBeGreaterThanOrEqual(0.9);
    expect(conVarA.weight).toBeLessThanOrEqual(1.1);
});

test("A connection variation should switch its enabled state", () => {
    const conVarA = new ConnectionVariation(new ConnectionId(0, 1), 0, true);
    expect(conVarA.enabled).toStrictEqual(true);

    conVarA.mutateEnabled();
    expect(conVarA.enabled).toStrictEqual(false);
});
