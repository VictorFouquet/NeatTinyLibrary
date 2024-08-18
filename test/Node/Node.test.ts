import { Innovation } from "../../src/Innovation";
import { Node, NodeTypeEnum } from "../../src/Node";

test("Two variation nodes should be equal if they share the same id", () => {
    const nodeA = new Node(0, 0, NodeTypeEnum.Hidden);
    const nodeB = new Node(nodeA.id, nodeA.globalId, NodeTypeEnum.Hidden);
    const nodeC = new Node(1, 1, NodeTypeEnum.Hidden);

    expect(nodeA.equals(nodeB)).toStrictEqual(true);
    expect(nodeA.equals(nodeC)).toStrictEqual(false);
    expect(nodeB.equals(nodeC)).toStrictEqual(false);
});

test("An input node should only return true to isInput call", () => {
    const node = new Node(0, 0, NodeTypeEnum.Input);
    expect(node.isInput).toStrictEqual(true);
    expect(node.isHidden).toStrictEqual(false);
    expect(node.isOutput).toStrictEqual(false);
});

test("A hidden node should only return true to isHidden call", () => {
    const node = new Node(0, 0, NodeTypeEnum.Hidden);
    expect(node.isInput).toStrictEqual(false);
    expect(node.isHidden).toStrictEqual(true);
    expect(node.isOutput).toStrictEqual(false);
});

test("An output node should only return true to isOutput call", () => {
    const node = new Node(0, 0, NodeTypeEnum.Output);
    expect(node.isInput).toStrictEqual(false);
    expect(node.isHidden).toStrictEqual(false);
    expect(node.isOutput).toStrictEqual(true);
});
