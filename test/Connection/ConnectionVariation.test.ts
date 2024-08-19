import { ConnectionId, ConnectionVariation } from "../../src/Connection";
import { Innovation } from "../../src/Innovation";


const CONNECTION = Innovation.createConnection(
    Innovation.createHiddenNode().id,
    Innovation.createHiddenNode().id
);


test("A connection variation should create a deep copy of itself", () => {    
    const cv = new ConnectionVariation(CONNECTION.id, 0.0);
    const cv_ = cv.copy();

    expect(cv === cv).toStrictEqual(true);
    // Make sure both object are not the same
    expect(cv === cv_).toStrictEqual(false);
    // Make sure they still get evaluated to equal each other by custom equals
    expect(cv.equals(cv_)).toStrictEqual(true);
});

test("A connection variation should mutate its weight", () => {
    const initWeight = 1;

    const cv = new ConnectionVariation(CONNECTION.id, initWeight);
    expect(cv.weight).toStrictEqual(initWeight);

    cv.mutateWeight();
    expect(cv.weight).not.toStrictEqual(initWeight);
});

test("A connection variation should tweak its node by 10% max", () => {
    const cv = new ConnectionVariation(CONNECTION.id, 1, true);
    cv.shiftWeight();
    expect(cv.weight).toBeGreaterThanOrEqual(0.9);
    expect(cv.weight).toBeLessThanOrEqual(1.1);
});

test("A connection variation should switch its enabled state", () => {
    const cv = new ConnectionVariation(CONNECTION.id, 0, true);
    expect(cv.enabled).toStrictEqual(true);

    cv.mutateEnabled();
    expect(cv.enabled).toStrictEqual(false);
});
