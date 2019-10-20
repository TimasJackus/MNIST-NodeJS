"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
;
exports.trainingData = (amount) => {
    const dataFileBuffer = fs.readFileSync(__dirname + '/../data/train-images-idx3-ubyte');
    const labelFileBuffer = fs.readFileSync(__dirname + '/../data/train-labels-idx1-ubyte');
    const images = [];
    const labels = [];
    for (let image = 0; image < amount; image++) {
        var imagePixels = [];
        for (var y = 0; y <= 27; y++) {
            let row = [];
            for (var x = 0; x <= 27; x++) {
                row.push(dataFileBuffer[(image * 28 * 28) + (x + (y * 28)) + 16]);
            }
            imagePixels.push(row);
        }
        images.push(imagePixels);
        labels.push(labelFileBuffer[image + 8]);
    }
    return { images, labels };
};
