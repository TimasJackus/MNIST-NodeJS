import { MathArray, Matrix, zeros, random, divide, dotMultiply, sum } from 'mathjs';

export default class Conv2D {
    private numFilters: number;
    private filters: MathArray;

    constructor(numFilters: number) {
        this.numFilters = numFilters;

        this.filters = <MathArray> divide(random([numFilters, 3, 3]), 9);
    }

    forward(input: number[][]) {
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
};