import { Matrix, max, zeros } from 'mathjs';

interface IMaxPoolGenerator {
    imgRegion: number[][][];
    i: number;
    j: number;
}

interface IMaxPool {
    forward(input: number[][][]): number[][][];
    iterateRegions(image: number[][][]): Generator<IMaxPoolGenerator>;
}

export default class MaxPool implements IMaxPool {

    constructor() { }

    *iterateRegions(image: number[][][]): Generator<IMaxPoolGenerator> {
        const height = Math.floor(image.length / 2);
        const width = Math.floor(image[0].length / 2);

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const imgRegion = [];
                imgRegion.push([image[i * 2][j * 2], image[i * 2][j * 2 + 1]]);
                imgRegion.push([image[i * 2 + 1][j * 2], image[i * 2 + 1][j * 2 + 1]]);
                yield { imgRegion, i, j }
            }   
        }
    }

    forward(input: number[][][]): number[][][] {
        let output: number[][][] = [];
        const height = Math.floor(input.length / 2);
        const width = Math.floor(input[0].length / 2);
        const numFilters = input[0][0].length;
        
        for (let i = 0; i < height; i++) {
            const matrix: Matrix = <Matrix> zeros(width, numFilters);
            output.push(<number[][]> matrix.toArray());
        }

        for (const value of this.iterateRegions(input)) {
            const { imgRegion, i, j } = value;

            const maxes = [];
            for (let k = 0; k < 2; k++) {
                maxes.push(max(imgRegion[k], 0));
            }

            output[i][j] = max(maxes, 0);
        }
        return output;
    }
};