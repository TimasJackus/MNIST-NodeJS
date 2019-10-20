import { MathArray, Matrix, zeros, random, divide, dotMultiply, sum, add, multiply, subtract } from 'mathjs';

export default class Conv2D {
    private numFilters: number;
    private filters: MathArray;
    private _input: number[][];

    constructor(numFilters: number) {
        this.numFilters = numFilters;

        this.filters = <MathArray> divide(random([numFilters, 3, 3]), 9);
    }

    *iterateRegions(image: number[][]) {
        const height = image.length;
        const width = image[0].length;

        for (let i = 0; i < height - 2; i++) {
            for (let j = 0; j < width - 2; j++) {
                const imgRegion = [];
                imgRegion.push([image[i][j], image[i][j + 1], image[i][j + 2]]);
                imgRegion.push([image[i + 1][j], image[i + 1][j + 1], image[i + 1][j + 2]]);
                imgRegion.push([image[i + 2][j], image[i + 2][j + 1], image[i + 2][j + 2]]);
                yield { imgRegion, i, j }
            }   
        }
    }

    forward(input: number[][]) {
        this._input = input;
        const height = input.length;
        const width = input[0].length;
        let output: number[][][] = [];
        for (let i = 0; i < height- 2; i++) {
            const matrix: Matrix = <Matrix> zeros(width - 2, this.numFilters);
            output.push(<number[][]> matrix.toArray());
        }

        for (let value of this.iterateRegions(input)) {
            const { imgRegion, i, j } = value;
            output[i][j] = [];
            for (let k = 0; k < this.numFilters; k++) {
                output[i][j].push(sum(<Matrix> dotMultiply(imgRegion, this.filters[k])));
            }
        }

        return output;
    }

    backprop(d_L_d_out: number[][][], learningRate: number): void {
        const d_L_d_filters: number[][][] = [];
        const filters: any = this.filters;
        const numFilters = filters.length;
        const width = filters[0].length;
        const height = filters[0][0].length;
        
        for (let i = 0; i < numFilters; i++) {
            const matrix: Matrix = <Matrix> zeros(width, height);
            d_L_d_filters.push(<number[][]> matrix.toArray());
        }

        for (let value of this.iterateRegions(this._input)) {
            const { imgRegion, i, j } = value;
            for (let f = 0; f < this.numFilters; f++) {
                d_L_d_filters[f] = add(d_L_d_filters[f], multiply(d_L_d_out[i][j][f], imgRegion)) as number[][];
            }
        }

        const subtracted: any = [];

        for (let index = 0; index < d_L_d_filters.length; index++) {
            subtracted.push(subtract(this.filters[index], multiply(d_L_d_filters[index], learningRate)));
        }

        this.filters = subtracted;
    }
};