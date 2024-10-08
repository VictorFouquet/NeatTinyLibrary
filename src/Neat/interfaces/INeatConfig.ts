export interface INeatConfig {
    populationSize:         number;
    resetBiasThreshold:     number;
    mutationThreshold:      number;
    resetWeightThreshold:    number;
    shiftWeightThreshold:   number;
    resetEnabledThreshold:  number;
    addConnectionThreshold: number;
    addNodeThreshold:       number;

    c1: number;
    c2: number;
    c3: number;
}
