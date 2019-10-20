"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = require("mathjs");
class Conv2D {
    constructor(numFilters) {
        this.numFilters = numFilters;
        this.filters = mathjs_1.divide(mathjs_1.random([numFilters, 3, 3]), 9);
    }
    forward(input) {
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
}
exports.default = Conv2D;
;
