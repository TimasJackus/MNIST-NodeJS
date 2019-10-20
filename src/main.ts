import Conv2D from './conv2D';
import MaxPool from './maxPool';
import SoftMax from './softMax';
import { trainingData } from './data';
import { log, divide,subtract } from 'mathjs';

const { images, labels } = trainingData(1);

const forward = (image: number[][], label: number): any => {
    const conv = new Conv2D(8);
    const maxPool = new MaxPool();
    const softMax = new SoftMax(13 * 13 * 8, 10);
    image = subtract(divide(image, 255), 0.5) as number[][];
    let output = conv.forward(image);
    output = maxPool.forward(output);
    const outputs = softMax.forward(output);

    const loss = -log(outputs[label])
    const acc = outputs.indexOf(Math.max(...outputs)) === label ? 1 : 0;

    return { outputs, loss, acc };
}

let totalLoss = 0;
let correctDigits = 0;
images.map((image, index) => {
    const { loss, acc } = forward(image, labels[index]);

    totalLoss += loss;
    correctDigits += acc;

    const printInterval = 5;
    if (index % printInterval === printInterval - 1) {
        console.log(`[Step ${index + 1}] Past ${printInterval} steps: Average Loss ${totalLoss / printInterval} | Accuracy: ${correctDigits}`);
        totalLoss = 0;
        correctDigits = 0;
    }
});