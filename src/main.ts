import Conv2D from './conv2D';
import MaxPool from './maxPool';
import SoftMax from './softMax';
import { trainingData } from './data';
import { log, divide,subtract, zeros, Matrix } from 'mathjs';

const { images, labels } = trainingData(10);
const softMax = new SoftMax(13 * 13 * 8, 10);

const forward = (image: number[][], label: number): any => {
    const conv = new Conv2D(8);
    const maxPool = new MaxPool();
    image = subtract(divide(image, 255), 0.5) as number[][];
    let output: number[][][] | number[] = conv.forward(image);
    output = maxPool.forward(output);
    output = softMax.forward(output);
    

    const loss = -log(output[label])
    const acc = output.indexOf(Math.max(...output)) === label ? 1 : 0;

    return { output, loss, acc };
}

const train = (image: number[][], label: number, learningRate: number = 0.005) => {
    const { output, loss, acc } = forward(image, label);

    let gradient = (zeros(10) as Matrix).toArray() as number[];
    gradient[label] = -1 / output[label];

    gradient = softMax.backprop(gradient, learningRate) as any;

    return { loss, acc };
};

let totalLoss = 0;
let correctDigits = 0;
images.map((image, index) => {
    const { loss, acc } = train(image, labels[index], 0.05);

    totalLoss += loss;
    correctDigits += acc;

    const printInterval = 10;
    if (index % printInterval === printInterval - 1) {
        console.log(`[Step ${index + 1}] Past ${printInterval} steps: 
                    Average Loss ${totalLoss / printInterval} | 
                    Accuracy: ${correctDigits / printInterval * 100}%`);
        totalLoss = 0
        correctDigits = 0;
    }
});