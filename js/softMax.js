"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = require("mathjs");
const fs = require("fs");
class SoftMax {
    constructor(inputLength, outputLength) {
        this.weights = mathjs_1.divide(mathjs_1.random([inputLength, outputLength]), inputLength);
        this.biases = mathjs_1.zeros(outputLength).toArray();
        this.inputLength = inputLength;
        this.outputLength = outputLength;
    }
    forward(input) {
        const flattened = [];
        this._inputShape = [input.length, input[0].length, input[0][0].length];
        this._outputLength = this.outputLength;
        input.forEach(array => {
            flattened.push(...mathjs_1.flatten(array));
        });
        this._input = flattened;
        const totals = mathjs_1.add(mathjs_1.multiply(flattened, this.weights), this.biases);
        this._totals = totals;
        const expValues = mathjs_1.exp(totals);
        return mathjs_1.divide(expValues, mathjs_1.sum(expValues));
    }
    backprop(gradient, learningRate) {
        for (let i = 0; i < gradient.length; i++) {
            if (gradient[i] === 0)
                continue;
            const totalsExp = mathjs_1.exp(this._totals);
            const totalsExpSum = mathjs_1.sum(totalsExp);
            let d_out_d_t = mathjs_1.divide(mathjs_1.multiply(-totalsExp[i], totalsExp), Math.pow(totalsExpSum, 2));
            d_out_d_t[i] = totalsExp[i] * (totalsExpSum - totalsExp[i]) / (Math.pow(totalsExpSum, 2));
            let d_t_d_w = this._input;
            let d_t_d_b = 1;
            let d_t_d_inputs = this.weights;
            let d_L_d_t = mathjs_1.multiply(gradient[i], d_out_d_t);
            let d_L_d_w = mathjs_1.multiply(mathjs_1.transpose([d_t_d_w]), [d_L_d_t]);
            let d_L_d_b = mathjs_1.multiply(d_L_d_t, d_t_d_b);
            let d_L_d_inputs = mathjs_1.multiply(d_t_d_inputs, d_L_d_t);
            this.weights = mathjs_1.subtract(this.weights, mathjs_1.multiply(learningRate, d_L_d_w));
            this.biases = mathjs_1.subtract(this.biases, mathjs_1.multiply(learningRate, d_L_d_b));
            return mathjs_1.reshape(d_L_d_inputs, [13, 13, 8]);
        }
    }
    saveToFile() {
        fs.writeFile("./trained/weights", JSON.stringify(this.weights), (err) => {
            if (err)
                throw err;
        });
        fs.writeFile("./trained/biases", JSON.stringify(this.biases), (err) => {
            if (err)
                throw err;
        });
    }
    readWeights() {
        return new Promise((resolve, reject) => {
            fs.readFile('./trained/weights', 'utf8', (err, data) => {
                if (err)
                    throw err;
                this.weights = JSON.parse(data);
                resolve(true);
            });
        });
    }
    readBiases() {
        return new Promise((resolve, reject) => {
            fs.readFile('./trained/biases', 'utf8', (err, data) => {
                if (err)
                    throw err;
                this.biases = JSON.parse(data);
                resolve(true);
            });
        });
    }
    readFromFile() {
        return Promise.all([this.readBiases(), this.readWeights()]);
    }
}
exports.default = SoftMax;
