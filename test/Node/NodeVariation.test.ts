import { Innovation } from "../../src/Innovation";
import { NodeTypeEnum, NodeVariation } from "../../src/Node";


test("A variation node should make a deep copy of itself", () => {
    Innovation.init(1,1);
    const nodeA = new NodeVariation(1, 0.0);
    const nodeB = nodeA.copy();

    expect(nodeA === nodeA).toStrictEqual(true);
    expect(nodeA === nodeB).not.toStrictEqual(true);
    expect(nodeA.equals(nodeB)).toStrictEqual(true);
});

test("A variation node should mutate its deep copy bias", () => {
    Innovation.init(1,1);
    const initialBias = 1;
    const nodeA = new NodeVariation(1, initialBias);

    expect(nodeA.bias).toStrictEqual(initialBias);

    const nodeB = nodeA.mutate();
    expect(nodeA.bias).toStrictEqual(initialBias);
    expect(nodeB.bias).not.toStrictEqual(initialBias);
})