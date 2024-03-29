import { MathArray, divide, random, zeros, flatten, Matrix, multiply, exp, sum, transpose, subtract, reshape, add } from "mathjs";
import * as fs from 'fs';

export default class SoftMax {
    biases: number[];
    weights: any;
    inputLength: number;
    outputLength: number;
    filterNum: number;
    // Cached props
    _inputShape: number[];
    _outputLength: number;
    _input: number[];
    _totals: number[];

    constructor(inputLength: number, outputLength: number, filterNum: number) {
        this.filterNum = filterNum;
        this.weights = <MathArray>divide(random([inputLength, outputLength]), inputLength);
        this.biases = <number[]>(<Matrix>zeros(outputLength)).toArray();
        this.inputLength = inputLength;
        this.outputLength = outputLength;
    }

    forward(input: number[][][]): number[] {
        const flattened: number[] = [];

        this._inputShape = [input.length, input[0].length, input[0][0].length];
        this._outputLength = this.outputLength;

        input.forEach(array => {
            flattened.push(...<number[]>flatten(array));
        });

        this._input = flattened;

        const totals = add(multiply(flattened, this.weights), this.biases);
        this._totals = totals as number[];

        const expValues = exp(<number[]>totals);
        return <number[]>divide(expValues, sum(expValues));
    }

    backprop(gradient: number[], learningRate: number): Matrix {
        for (let i = 0; i < gradient.length; i++) {
            if (gradient[i] === 0) continue;

            const totalsExp = exp(this._totals as number[]) as number[];
            const totalsExpSum = sum(totalsExp);

            let d_out_d_t = divide(multiply(-totalsExp[i], totalsExp), totalsExpSum ** 2) as number[];
            d_out_d_t[i] = totalsExp[i] * (totalsExpSum - totalsExp[i]) / (totalsExpSum ** 2);

            let d_t_d_w = this._input;
            let d_t_d_b = 1;
            let d_t_d_inputs = this.weights;

            let d_L_d_t = multiply(gradient[i], d_out_d_t) as number[];

            let d_L_d_w = multiply(transpose([d_t_d_w]), [d_L_d_t]) as number[][];
            let d_L_d_b = multiply(d_L_d_t, d_t_d_b);
            let d_L_d_inputs = multiply(d_t_d_inputs, d_L_d_t);

            // this.weights = divide(subtract(this.weights, multiply(learningRate, d_L_d_w)), this.inputLength);
            this.weights = subtract(this.weights, multiply(learningRate, d_L_d_w));
            this.biases = subtract(this.biases, multiply(learningRate, d_L_d_b)) as number[];

            return reshape(d_L_d_inputs, [13, 13, this.filterNum]) as Matrix;
        }
    }

    saveToFile() {
        fs.writeFile("./trained/weights", JSON.stringify(this.weights), (err) => {
            if (err) throw err;
        });
        fs.writeFile("./trained/biases", JSON.stringify(this.biases), (err) => {
            if (err) throw err;
        });
    }

    readWeights(folder: string) {
        return new Promise((resolve, reject) => {
            fs.readFile('./' + folder + '/weights', 'utf8', (err, data) => {
                if (err) throw err;
                this.weights = JSON.parse(data);
                resolve(true);
            });
        });
    }

    readBiases(folder: string) {
        return new Promise((resolve, reject) => {
            fs.readFile('./' + folder + '/biases', 'utf8', (err, data) => {
                if (err) throw err;
                this.biases = JSON.parse(data);
                resolve(true);
            });
        });
    }

    readFromFile(folder: string = 'trained') {
        return Promise.all([this.readBiases(folder), this.readWeights(folder)]);
    }
}