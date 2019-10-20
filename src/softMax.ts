import { MathArray, divide, random, zeros, flatten, Matrix, multiply, exp, sum } from "mathjs";

export default class SoftMax {
    biases: number[];
    weights: MathArray;
    inputLength: number;
    outputLength: number;

    constructor(inputLength: number, outputLength: number) {
        this.weights = <MathArray> divide(random([inputLength, outputLength]), inputLength);
        this.biases = <number[]> (<Matrix> zeros(outputLength)).toArray();
        this.inputLength = inputLength;
        this.outputLength = outputLength;
    }

    forward(input: number[][][]): number[] {
        const flattened: number[] = [];
        input.forEach(array => {
            flattened.push(...<number[]>flatten(array));
        });
        
        const totals = multiply(flattened, this.weights);
        const expValues = exp(<number[]> totals);
        return <number[]> divide(expValues, sum(expValues));
    }
}