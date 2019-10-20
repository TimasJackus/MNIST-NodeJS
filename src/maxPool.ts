import { Matrix, max, zeros } from 'mathjs';
import { IMaxPool, IMaxPoolGenerator } from './interfaces';

export default class MaxPool implements IMaxPool {
    _input: number[][][];
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
        this._input = input;

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

    backprop(d_L_d_out: number[][][]): number[][][] {
        let d_L_d_input: number[][][] = [];
        for (let i = 0; i < this._input.length; i++) {
            const matrix: Matrix = <Matrix> zeros(this._input[0].length, this._input[0][0].length);
            d_L_d_input.push(<number[][]> matrix.toArray());
        }

        for (const value of this.iterateRegions(this._input)) {
            const { imgRegion, i, j } = value;

            const height = imgRegion.length;
            const width = imgRegion[0].length;
            const numFilters = imgRegion[0][0].length;

            const maxes = [];
            for (let k = 0; k < 2; k++) {
                maxes.push(max(imgRegion[k], 0));
            }

            const amax = max(maxes, 0);

            for (let k = 0; k < height; k++) {
                for (let l = 0; l < width; l++) {
                    for (let m = 0; m < numFilters; m++) {
                        if (imgRegion[k][l][m] === amax[m]) {
                            d_L_d_input[i * 2 + k][j * 2 + l][m] = d_L_d_out[i][j][m];
                        }
                    }
                }
            }
        }

        return d_L_d_input;
    }
};