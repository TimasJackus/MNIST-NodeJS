"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conv2D_1 = require("./conv2D");
const maxPool_1 = require("./maxPool");
const softMax_1 = require("./softMax");
const data_1 = require("./data");
const mathjs_1 = require("mathjs");
const { images, labels } = data_1.trainingData(1000);
const forward = (image, label) => {
    const conv = new conv2D_1.default(8);
    const maxPool = new maxPool_1.default();
    const softMax = new softMax_1.default(13 * 13 * 8, 10);
    let output = conv.forward(image);
    output = maxPool.forward(output);
    const outputs = softMax.forward(output);
    const loss = -mathjs_1.log(outputs[label]);
    const acc = outputs.indexOf(Math.max(...outputs)) === label ? 1 : 0;
    return { outputs, loss, acc };
};
let totalLoss = 0;
let correctDigits = 0;
images.map((image, index) => {
    const { loss, acc } = forward(image, labels[index]);
    totalLoss += loss;
    correctDigits += acc;
    const printInterval = 1000;
    if (index % printInterval === printInterval - 1) {
        console.log(`[Step ${index + 1}] Past ${printInterval} steps: Average Loss ${totalLoss / printInterval} | Accuracy: ${correctDigits}`);
        totalLoss = 0;
        correctDigits = 0;
    }
});
