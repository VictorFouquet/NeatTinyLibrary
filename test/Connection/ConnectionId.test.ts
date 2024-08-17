import { ConnectionId } from "../../src/Connection/ConnectionId";

test("Two connection ids should be equal if both their in and out nodes are the same", () => {
    const inA = 0;
    const inB = 1;

    const outA = 2;
    const outB = 3;

    const conIdA = new ConnectionId(inA, outA);
    const conIdB = new ConnectionId(inA, outA);
    expect(conIdA.equals(conIdB)).toStrictEqual(true);

    const conIdC = new ConnectionId(inA, outB);
    const conIdD = new ConnectionId(inB, outA);
    expect(conIdA.equals(conIdC)).toStrictEqual(false);
    expect(conIdA.equals(conIdD)).toStrictEqual(false);
});