"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs_1 = require("mathjs");
class MaxPool {
    constructor() { }
    *iterateRegions(image) {
        const height = Math.floor(image.length / 2);
        const width = Math.floor(image[0].length / 2);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const imgRegion = [];
                imgRegion.push([image[i * 2][j * 2], image[i * 2][j * 2 + 1]]);
                imgRegion.push([image[i * 2 + 1][j * 2], image[i * 2 + 1][j * 2 + 1]]);
                yield { imgRegion, i, j };
            }
        }
    }
    forward(input) {
        let output = [];
        const height = Math.floor(input.length / 2);
        const width = Math.floor(input[0].length / 2);
        const numFilters = input[0][0].length;
        for (let i = 0; i < height; i++) {
            const matrix = mathjs_1.zeros(width, numFilters);
            output.push(matrix.toArray());
        }
        for (const value of this.iterateRegions(input)) {
            const { imgRegion, i, j } = value;
            const maxes = [];
            for (let k = 0; k < 2; k++) {
                maxes.push(mathjs_1.max(imgRegion[k], 0));
            }
            output[i][j] = mathjs_1.max(maxes, 0);
        }
        return output;
    }
}
exports.default = MaxPool;
;
