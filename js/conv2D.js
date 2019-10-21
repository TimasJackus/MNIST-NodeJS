"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = require("mathjs");
const fs = require("fs");
class Conv2D {
    constructor(numFilters) {
        this.numFilters = numFilters;
        this.filters = mathjs_1.divide(mathjs_1.random([numFilters, 3, 3]), 9);
    }
    *iterateRegions(image) {
        const height = image.length;
        const width = image[0].length;
        for (let i = 0; i < height - 2; i++) {
            for (let j = 0; j < width - 2; j++) {
                const imgRegion = [];
                imgRegion.push([image[i][j], image[i][j + 1], image[i][j + 2]]);
                imgRegion.push([image[i + 1][j], image[i + 1][j + 1], image[i + 1][j + 2]]);
                imgRegion.push([image[i + 2][j], image[i + 2][j + 1], image[i + 2][j + 2]]);
                yield { imgRegion, i, j };
            }
        }
    }
    forward(input) {
        this._input = input;
        const height = input.length;
        const width = input[0].length;
        let output = [];
        for (let i = 0; i < height - 2; i++) {
            const matrix = mathjs_1.zeros(width - 2, this.numFilters);
            output.push(matrix.toArray());
        }
        for (let value of this.iterateRegions(input)) {
            const { imgRegion, i, j } = value;
            output[i][j] = [];
            for (let k = 0; k < this.numFilters; k++) {
                output[i][j].push(mathjs_1.sum(mathjs_1.dotMultiply(imgRegion, this.filters[k])));
            }
        }
        return output;
    }
    backprop(d_L_d_out, learningRate) {
        const d_L_d_filters = [];
        const filters = this.filters;
        const numFilters = filters.length;
        const width = filters[0].length;
        const height = filters[0][0].length;
        for (let i = 0; i < numFilters; i++) {
            const matrix = mathjs_1.zeros(width, height);
            d_L_d_filters.push(matrix.toArray());
        }
        for (let value of this.iterateRegions(this._input)) {
            const { imgRegion, i, j } = value;
            for (let f = 0; f < this.numFilters; f++) {
                d_L_d_filters[f] = mathjs_1.add(d_L_d_filters[f], mathjs_1.multiply(d_L_d_out[i][j][f], imgRegion));
            }
        }
        const subtracted = [];
        for (let index = 0; index < d_L_d_filters.length; index++) {
            subtracted.push(mathjs_1.subtract(this.filters[index], mathjs_1.multiply(d_L_d_filters[index], learningRate)));
        }
        this.filters = subtracted;
    }
    saveToFile() {
        return fs.writeFile("./trained/filters", JSON.stringify(this.filters), (err) => {
            if (err)
                throw err;
        });
    }
    readFromFile() {
        return new Promise((resolve, reject) => {
            fs.readFile('./trained/filters', 'utf8', (err, data) => {
                if (err)
                    throw err;
                this.filters = JSON.parse(data);
                resolve(true);
            });
        });
    }
}
exports.default = Conv2D;
;
