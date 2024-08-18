import { Node, NodeTypeEnum } from "../../src/Node";
import { ConnectionId } from "../../src/Connection";
import { 
    ConnectionExistError,
    InputLinkageError,
    InnovationTracker,
    OutputLinkageError,
    UnknownNodeError
} from "../../src/Innovation";

afterEach(() => {
    InnovationTracker.clear();
});

test("InnovationTracker should initialize the expected inputs and outputs", () => {
    const inputs = 3;
    const outputs = 2;

    expect(InnovationTracker.nodes.length).toStrictEqual(0);

    InnovationTracker.init(inputs, outputs);
    expect(InnovationTracker.nodes.length).toStrictEqual(inputs + outputs);
    expect(InnovationTracker.nodesCount).toStrictEqual(inputs + outputs);
    expect(InnovationTracker.nodes.filter(n => n.isInput).length).toStrictEqual(inputs);
    expect(InnovationTracker.nodes.filter(n => n.isOutput).length).toStrictEqual(outputs);
    expect(InnovationTracker.nodes.filter(n => n.isHidden).length).toStrictEqual(0);
});

test("InnovationTracker should reset before initializing if it already contains data", () => {
    const inputs = 3;
    const outputs = 2;

    expect(InnovationTracker.nodes.length).toStrictEqual(0);

    InnovationTracker.init(inputs, outputs);
    expect(InnovationTracker.nodes.length).toStrictEqual(inputs + outputs);

    const newInputs = 5;
    const newOutputs = 3;
    InnovationTracker.init(newInputs, newOutputs);
    expect(InnovationTracker.nodes.length).toStrictEqual(newInputs + newOutputs);
});

test("InnovationTracker should get the input nodes", () => {
    const inputs = 3;
    const outputs = 2;

    InnovationTracker.init(inputs, outputs);

    const inputNodes = InnovationTracker.inputNodes;
    expect(inputNodes.length).toStrictEqual(inputs);
    expect(inputNodes.every(n => n.isInput)).toStrictEqual(true);
});

test("InnovationTracker should get the output nodes", () => {
    const inputs = 3;
    const outputs = 2;

    InnovationTracker.init(inputs, outputs);

    const outputNodes = InnovationTracker.outputNodes;
    expect(outputNodes.length).toStrictEqual(outputs);
    expect(outputNodes.every(n => n.isOutput)).toStrictEqual(true);
});

test("InnovationTracker should create hidden nodes", () => {
    const count = 3;
    for (let i = 0; i < count; i++) {
        InnovationTracker.createHiddenNode();
    }

    expect(InnovationTracker.nodesCount).toStrictEqual(count);
    expect(InnovationTracker.nodes.every(n => n.isHidden)).toStrictEqual(true);
});

test("InnovationTracker should get a node by id", () => {
    const inputs = 2;
    const outputs = 2;
    const hidden = 2;

    InnovationTracker.init(inputs, outputs);
    for (let i = 0; i < hidden; i++) {
        InnovationTracker.createHiddenNode();
    }

    for (let i = 1; i <= inputs + outputs + hidden; i++) {
        expect(InnovationTracker.getNodeById(i)).not.toBe(null);
    }
    expect(InnovationTracker.getNodeById(-1)).toBe(null);

    expect(InnovationTracker.getNodeById(1)?.isInput).toBe(true);
    expect(InnovationTracker.getNodeById(2)?.isInput).toBe(true);

    expect(InnovationTracker.getNodeById(3)?.isOutput).toBe(true);
    expect(InnovationTracker.getNodeById(4)?.isOutput).toBe(true);

    expect(InnovationTracker.getNodeById(5)?.isHidden).toBe(true);
    expect(InnovationTracker.getNodeById(6)?.isHidden).toBe(true);
});

test("InnovationTracker should detect if a node exists", () => {
    const node = InnovationTracker.createHiddenNode();
    expect(InnovationTracker.nodeExists(node.id)).toBe(true);
    expect(InnovationTracker.nodeExists(-1)).toBe(false);
});

test("InnovationTracker should create a new connection", () => {
    const inputs = 2;
    const outputs = 1;

    InnovationTracker.init(inputs, outputs);
    
    expect(InnovationTracker.connectionsCount).toStrictEqual(2);
    expect(InnovationTracker.connections.length).toStrictEqual(2);
    
    InnovationTracker.createHiddenNode();
    InnovationTracker.createConnection(1, 4);
    InnovationTracker.createConnection(4, 3);
    const conA = InnovationTracker.connections[2];
    const conB = InnovationTracker.connections[3];

    expect(conA.in).toStrictEqual(1);
    expect(conA.out).toStrictEqual(4);
    expect(conB.in).toStrictEqual(4);
    expect(conB.out).toStrictEqual(3);
});

test("InnovationTracker should get a connection by id", () => {
    const inputs = 2;
    const outputs = 1;
    
    InnovationTracker.init(inputs, outputs);

    const connectionId = new ConnectionId(1, 3);
    expect(InnovationTracker.getConnection(connectionId)).not.toBe(null);
});

test("InnovationTracker should state if a connection exists", () => {
    const inputs = 2;
    const outputs = 1;
    
    InnovationTracker.init(inputs, outputs);

    expect(InnovationTracker.connectionExists(new ConnectionId(1, 3))).toBe(true);
    expect(InnovationTracker.connectionExists(new ConnectionId(2, 3))).toBe(true);
    expect(InnovationTracker.connectionExists(new ConnectionId(1, 4))).toBe(false);
});

test("InnovationTracker should throw an unknown node error if a new connection refers to an unexisting node", () => {
    const inputs = 2;
    const outputs = 1;
    InnovationTracker.init(inputs, outputs);

    expect(() => InnovationTracker.createConnection(1, 3)).not.toThrow(UnknownNodeError);
    expect(() => InnovationTracker.createConnection(-1, 1)).toThrow(UnknownNodeError);
});

test("InnovationTracker should throw an input linkage error if a new connection links two input nodes", () => {
    const inputs = 2;
    const outputs = 1;
    InnovationTracker.init(inputs, outputs);

    expect(() => InnovationTracker.createConnection(1, 3)).not.toThrow(InputLinkageError);
    expect(() => InnovationTracker.createConnection(1, 2)).toThrow(InputLinkageError);
});

test("InnovationTracker should throw an output linkage error if a new connection links two output nodes", () => {
    const inputs = 2;
    const outputs = 1;
    InnovationTracker.init(inputs, outputs);

    expect(() => InnovationTracker.createConnection(1, 3)).not.toThrow(OutputLinkageError);
    expect(() => InnovationTracker.createConnection(3, 3)).toThrow(OutputLinkageError);
});

test("InnovationTracker should throw an already exist error if a new connection links two already linked nodes", () => {
    const inputs = 2;
    const outputs = 1;
    InnovationTracker.init(inputs, outputs);

    // Innovation tracker has yet initialized fully connected genotype
    expect(() => InnovationTracker.createConnection(1, 3)).toThrow(ConnectionExistError);
});

test("InnovationTracker should not have its node list affected after a get", () => {
    const inputs = 2;
    const outputs = 1;
    const nodesCount = inputs + outputs;

    InnovationTracker.init(inputs, outputs);
    expect(InnovationTracker.nodes.length).toStrictEqual(nodesCount);
    expect(InnovationTracker.nodesCount).toStrictEqual(nodesCount);

    const nodes = InnovationTracker.nodes;
    nodes.push(new Node(nodesCount + 1, NodeTypeEnum.Hidden));

    expect(InnovationTracker.nodes.length).toStrictEqual(nodesCount);
    expect(InnovationTracker.nodesCount).toStrictEqual(nodesCount);
});

test("InnovationTracker should not have its node list affected after a get input", () => {
    const inputs = 2;
    const outputs = 1;
    const nodesCount = inputs + outputs;

    InnovationTracker.init(inputs, outputs);
    expect(InnovationTracker.nodes.length).toStrictEqual(nodesCount);
    expect(InnovationTracker.nodesCount).toStrictEqual(nodesCount);

    const nodes = InnovationTracker.inputNodes;
    nodes.push(new Node(nodesCount + 1, NodeTypeEnum.Hidden));

    expect(InnovationTracker.nodes.length).toStrictEqual(nodesCount);
    expect(InnovationTracker.nodesCount).toStrictEqual(nodesCount);
});

test("InnovationTracker should not have its node list affected after a get hidden", () => {
    const inputs = 2;
    const outputs = 1;
    const nodesCount = inputs + outputs;

    InnovationTracker.init(inputs, outputs);
    expect(InnovationTracker.nodes.length).toStrictEqual(nodesCount);
    expect(InnovationTracker.nodesCount).toStrictEqual(nodesCount);

    const nodes = InnovationTracker.hiddenNodes;
    nodes.push(new Node(nodesCount + 1, NodeTypeEnum.Hidden));

    expect(InnovationTracker.nodes.length).toStrictEqual(nodesCount);
    expect(InnovationTracker.nodesCount).toStrictEqual(nodesCount);
});

test("InnovationTracker should not have its node list affected after a get outputs", () => {
    const inputs = 2;
    const outputs = 1;
    const nodesCount = inputs + outputs;

    InnovationTracker.init(inputs, outputs);
    expect(InnovationTracker.nodes.length).toStrictEqual(nodesCount);
    expect(InnovationTracker.nodesCount).toStrictEqual(nodesCount);

    const nodes = InnovationTracker.outputNodes;
    nodes.push(new Node(nodesCount + 1, NodeTypeEnum.Hidden));

    expect(InnovationTracker.nodes.length).toStrictEqual(nodesCount);
    expect(InnovationTracker.nodesCount).toStrictEqual(nodesCount);
});
