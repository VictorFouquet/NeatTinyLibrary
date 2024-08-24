import { IGenome } from "../../Genome";

export interface INeuralNetwork {
    compute(genome: IGenome, inputs: number[]): number[];
    sortNodesByLayers(genome: IGenome): number[][];
}
