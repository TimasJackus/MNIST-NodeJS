"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = require("mathjs");
class SoftMax {
    constructor(inputLength, outputLength) {
        this.weights = mathjs_1.divide(mathjs_1.random([inputLength, outputLength]), inputLength);
        this.biases = mathjs_1.zeros(outputLength).toArray();
        this.inputLength = inputLength;
        this.outputLength = outputLength;
    }
    forward(input) {
        const flattened = [];
        input.forEach(array => {
            flattened.push(...mathjs_1.flatten(array));
        });
        const totals = mathjs_1.multiply(flattened, this.weights);
        const expValues = mathjs_1.exp(totals);
        return mathjs_1.divide(expValues, mathjs_1.sum(expValues));
    }
}
exports.default = SoftMax;
