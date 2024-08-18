import { Node, NodeTypeEnum } from "../../src/Node";
import { ConnectionId } from "../../src/Connection";
import { 
    ConnectionExistError,
    InputLinkageError,
    Innovation,
    OutputLinkageError,
    UnknownNodeError
} from "../../src/Innovation";

afterEach(() => {
    Innovation.clear();
});

test("Innovation should initialize the expected inputs and outputs", () => {
    const inputs = 3;
    const outputs = 2;

    expect(Innovation.nodes.length).toStrictEqual(0);

    Innovation.init(inputs, outputs);
    expect(Innovation.nodes.length).toStrictEqual(inputs + outputs);
    expect(Innovation.nodesCount).toStrictEqual(inputs + outputs);
    expect(Innovation.nodes.filter(n => n.isInput).length).toStrictEqual(inputs);
    expect(Innovation.nodes.filter(n => n.isOutput).length).toStrictEqual(outputs);
    expect(Innovation.nodes.filter(n => n.isHidden).length).toStrictEqual(0);
});

test("Innovation should reset before initializing if it already contains data", () => {
    const inputs = 3;
    const outputs = 2;

    expect(Innovation.nodes.length).toStrictEqual(0);

    Innovation.init(inputs, outputs);
    expect(Innovation.nodes.length).toStrictEqual(inputs + outputs);

    const newInputs = 5;
    const newOutputs = 3;
    Innovation.init(newInputs, newOutputs);
    expect(Innovation.nodes.length).toStrictEqual(newInputs + newOutputs);
});

test("Innovation should get the input nodes", () => {
    const inputs = 3;
    const outputs = 2;

    Innovation.init(inputs, outputs);

    const inputNodes = Innovation.inputNodes;
    expect(inputNodes.length).toStrictEqual(inputs);
    expect(inputNodes.every(n => n.isInput)).toStrictEqual(true);
});

test("Innovation should get the output nodes", () => {
    const inputs = 3;
    const outputs = 2;

    Innovation.init(inputs, outputs);

    const outputNodes = Innovation.outputNodes;
    expect(outputNodes.length).toStrictEqual(outputs);
    expect(outputNodes.every(n => n.isOutput)).toStrictEqual(true);
});

test("Innovation should create hidden nodes", () => {
    const count = 3;
    for (let i = 0; i < count; i++) {
        Innovation.createHiddenNode();
    }

    expect(Innovation.nodesCount).toStrictEqual(count);
    expect(Innovation.nodes.every(n => n.isHidden)).toStrictEqual(true);
});

test("Innovation should get a node by id", () => {
    const inputs = 2;
    const outputs = 2;
    const hidden = 2;

    Innovation.init(inputs, outputs);
    for (let i = 0; i < hidden; i++) {
        Innovation.createHiddenNode();
    }

    for (let i = 1; i <= inputs + outputs + hidden; i++) {
        expect(Innovation.getNodeById(i)).not.toBe(null);
    }
    expect(() => Innovation.getNodeById(-1)).toThrow(UnknownNodeError);

    expect(Innovation.getNodeById(1)?.isInput).toBe(true);
    expect(Innovation.getNodeById(2)?.isInput).toBe(true);

    expect(Innovation.getNodeById(3)?.isOutput).toBe(true);
    expect(Innovation.getNodeById(4)?.isOutput).toBe(true);

    expect(Innovation.getNodeById(5)?.isHidden).toBe(true);
    expect(Innovation.getNodeById(6)?.isHidden).toBe(true);
});

test("Innovation should detect if a node exists", () => {
    const node = Innovation.createHiddenNode();
    expect(Innovation.nodeExists(node.id)).toBe(true);
    expect(Innovation.nodeExists(-1)).toBe(false);
});

test("Innovation should create a new connection", () => {
    const inputs = 2;
    const outputs = 1;

    Innovation.init(inputs, outputs);
    
    expect(Innovation.connectionsCount).toStrictEqual(2);
    expect(Innovation.connections.length).toStrictEqual(2);
    
    Innovation.createHiddenNode();
    Innovation.createConnection(1, 4);
    Innovation.createConnection(4, 3);
    const conA = Innovation.connections[2];
    const conB = Innovation.connections[3];

    expect(conA.in).toStrictEqual(1);
    expect(conA.out).toStrictEqual(4);
    expect(conB.in).toStrictEqual(4);
    expect(conB.out).toStrictEqual(3);
});

test("Innovation should get a connection by id", () => {
    const inputs = 2;
    const outputs = 1;
    
    Innovation.init(inputs, outputs);

    const connectionId = new ConnectionId(1, 3);
    expect(Innovation.getConnection(connectionId)).not.toBe(null);
});

test("Innovation should state if a connection exists", () => {
    const inputs = 2;
    const outputs = 1;
    
    Innovation.init(inputs, outputs);

    expect(Innovation.connectionExists(new ConnectionId(1, 3))).toBe(true);
    expect(Innovation.connectionExists(new ConnectionId(2, 3))).toBe(true);
    expect(Innovation.connectionExists(new ConnectionId(1, 4))).toBe(false);
});

test("Innovation should throw an unknown node error if a new connection refers to an unexisting node", () => {
    const inputs = 2;
    const outputs = 1;
    Innovation.init(inputs, outputs);

    expect(() => Innovation.createConnection(1, 3)).not.toThrow(UnknownNodeError);
    expect(() => Innovation.createConnection(-1, 1)).toThrow(UnknownNodeError);
});

test("Innovation should throw an input linkage error if a new connection links two input nodes", () => {
    const inputs = 2;
    const outputs = 1;
    Innovation.init(inputs, outputs);

    expect(() => Innovation.createConnection(1, 3)).not.toThrow(InputLinkageError);
    expect(() => Innovation.createConnection(1, 2)).toThrow(InputLinkageError);
});

test("Innovation should throw an output linkage error if a new connection links two output nodes", () => {
    const inputs = 2;
    const outputs = 1;
    Innovation.init(inputs, outputs);

    expect(() => Innovation.createConnection(1, 3)).not.toThrow(OutputLinkageError);
    expect(() => Innovation.createConnection(3, 3)).toThrow(OutputLinkageError);
});

test("Innovation should throw an already exist error if a new connection links two already linked nodes", () => {
    const inputs = 2;
    const outputs = 1;
    Innovation.init(inputs, outputs);

    // Innovation tracker has yet initialized fully connected genotype
    expect(() => Innovation.createConnection(1, 3)).toThrow(ConnectionExistError);
});

test("Innovation should not have its node list affected after a get", () => {
    const inputs = 2;
    const outputs = 1;
    const nodesCount = inputs + outputs;

    Innovation.init(inputs, outputs);
    expect(Innovation.nodes.length).toStrictEqual(nodesCount);
    expect(Innovation.nodesCount).toStrictEqual(nodesCount);

    const nodes = Innovation.nodes;
    nodes.pop();

    expect(Innovation.nodes.length).toStrictEqual(nodesCount);
    expect(Innovation.nodesCount).toStrictEqual(nodesCount);
});

test("Innovation should not have its node list affected after a get input", () => {
    const inputs = 2;
    const outputs = 1;
    const nodesCount = inputs + outputs;

    Innovation.init(inputs, outputs);
    expect(Innovation.nodes.length).toStrictEqual(nodesCount);
    expect(Innovation.nodesCount).toStrictEqual(nodesCount);

    const nodes = Innovation.inputNodes;
    nodes.pop();

    expect(Innovation.nodes.length).toStrictEqual(nodesCount);
    expect(Innovation.nodesCount).toStrictEqual(nodesCount);
});

test("Innovation should not have its node list affected after a get hidden", () => {
    const inputs = 2;
    const outputs = 1;
    const nodesCount = inputs + outputs;

    Innovation.init(inputs, outputs);
    expect(Innovation.nodes.length).toStrictEqual(nodesCount);
    expect(Innovation.nodesCount).toStrictEqual(nodesCount);

    const nodes = Innovation.hiddenNodes;
    nodes.pop();

    expect(Innovation.nodes.length).toStrictEqual(nodesCount);
    expect(Innovation.nodesCount).toStrictEqual(nodesCount);
});

test("Innovation should not have its node list affected after a get outputs", () => {
    const inputs = 2;
    const outputs = 1;
    const nodesCount = inputs + outputs;

    Innovation.init(inputs, outputs);
    expect(Innovation.nodes.length).toStrictEqual(nodesCount);
    expect(Innovation.nodesCount).toStrictEqual(nodesCount);

    const nodes = Innovation.outputNodes;
    nodes.pop();

    expect(Innovation.nodes.length).toStrictEqual(nodesCount);
    expect(Innovation.nodesCount).toStrictEqual(nodesCount);
});
