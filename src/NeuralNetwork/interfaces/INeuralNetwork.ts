import { IGenome } from "../../Genome";

export interface INeuralNetwork {
    inputActivation: (x: number) => number;
    hiddenActivation: (x: number) => number;
    outputActivation: (x: number) => number;

    compute(genome: IGenome, inputs: number[]): number[];
    sortNodesByLayers(genome: IGenome): number[][];
}
