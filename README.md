# NEAT Tiny Library

This project implements the **NEAT** algorithm from scratch, following the official [paper](https://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf).

## Usage

### Requirements

`Node ^19.9.0`, `Typescript ^4.5.4` and a package manager (`npm`, `yarn`) installed on your machine.

Depending on your package manager, run either `npm install` or `yarn install`.

### Scripts

- `npm run test` : runs all the unit tests using `jest` and `babel`
- `npm run coverage` : runs all the unit tests and displays the code coverage
- `npm run build` : transpiles the Typescript code to Javascript (outputs to `./dist` folder at the project's root)

## Algorithm

### Encoding

#### Nodes

Nodes are stored in two different formats, reference nodes (abbreviated as `Nodes` in the code) and variation nodes (`VariationNodes` in the code).

##### Reference Nodes

These nodes are used to keep track of the node `id` and `type`.

A node can be of three different types (see `./src/Node/enums/NodeTypeEnums.ts`):
- `input`
- `hidden`
- `output`

##### Variation Nodes

These nodes are used to store individual variation for a given reference node.

They keep track of a node's weight so that they can evolve individually though refering to the same abstract entity.

Two variation nodes will be considered to be the same node if they share the same node id.

#### Connections

Connections represent a linkage between two nodes.

Connections are stored in two different formats, reference connections (abbreviated as `Connection` in the code) and variation connections (`VariationConnection` in the code).

##### Connection Id

A ConnectionId is a simple object holding two values, `in` and `out`, being the ids of the input and output nodes respectively.

Two connection ids are considered the same if their `in` and `out` values are respectively the same.

##### Reference Connections

These connections are responsible of keeping track of the connection's `ConnectionId`, the input node's id (`in`), and the output node's id (`out`).

##### Variation Connections

These connections are used to evolve a linkage between two nodes without modifying the reference connection's structure.

They keep track of a connection's `weight` and `enabled` status.

Two connection variations are considered the same if they share the same connection id, even if their wheight and enabled status are different.

#### Innovation tracker

This static object is responsible of :
- keeping track of all the created nodes and connections
- initializing the first input and output nodes
- creating new hidden nodes
- creating new connections between existing nodes
- ensuring every node or connection creation is valid

The InnovationTracker will throw an error when creating a new connection if the connection :
- contains at least one unexisting node
- links two input nodes
- links two output nodes
- already exists

The innovation tracker can retrieve all the `inputNodes` and `outputNodes`.

It is also responsible of retrieving any node or connection by its id, and making sure any node or connection does exist.
