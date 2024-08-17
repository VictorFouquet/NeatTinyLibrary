import { Connection, ConnectionId } from "../../src/Connection";

test("Two connection should be equal if they share the same connection id", () => {
    const connectionIdA = new ConnectionId(0, 1);
    const connectionIdB = new ConnectionId(1, 2);

    const connectionA = new Connection(connectionIdA);
    const connectionB = new Connection(connectionIdA);
    const connectionC = new Connection(connectionIdB);
    
    expect(connectionA.equals(connectionB)).toStrictEqual(true);
    expect(connectionA.equals(connectionC)).toStrictEqual(false);
});
