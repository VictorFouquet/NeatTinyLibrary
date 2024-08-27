export class ActivationFunctions {
    static sigmoid (x: number): number { return 1 / (1 + Math.exp(-x)); }
    static relu    (x: number): number { return x < 0 ? 0 : x; }
    static tanh    (x: number): number { return Math.tanh(x); }
    static linear  (x:number):  number { return x };
}
