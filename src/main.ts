import Conv2D from './conv2D';
import MaxPool from './maxPool';
import SoftMax from './softMax';
import { trainingData } from './data';
import { log, divide,subtract, zeros, Matrix } from 'mathjs';

const printInterval = 1000;
const imagesCount = 15000;
const epochCount = 3;
const trainingImages = trainingData(imagesCount, 'training');
const testImages = trainingData(imagesCount, 'test');
const softMax = new SoftMax(13 * 13 * 8, 10);
const conv = new Conv2D(8);
const maxPool = new MaxPool();

const forward = (image: number[][], label: number): any => {
    image = subtract(divide(image, 255), 0.5) as number[][];
    let output: number[][][] | number[][] | number[] = conv.forward(image);
    output = maxPool.forward(output);
    output = softMax.forward(output);
    

    const loss = -log(output[label])
    const acc = output.indexOf(Math.max(...output)) === label ? 1 : 0;

    return { output, loss, acc };
}

const train = (image: number[][], label: number, learningRate: number = 0.005) => {
    const { output, loss, acc } = forward(image, label);

    let gradient: any = (zeros(10) as Matrix).toArray() as number[];
    gradient[label] = -1 / output[label];

    gradient = softMax.backprop(gradient, learningRate) as any;
    // console.log(gradient);
    gradient = maxPool.backprop(gradient) as any;
    conv.backprop(gradient, learningRate);

    return { loss, acc };
};

const shuffle = (a: any) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let totalLoss = 0;
let correctDigits = 0;

for (let i = 0; i < epochCount; i++) {
    shuffle(trainingImages);
    trainingImages.map((data, index) => {
        const { image, label } = data;
        const { loss, acc } = train(image, label);
    
        totalLoss += loss;
        correctDigits += acc;
    
        if (index % printInterval === printInterval - 1) {
            console.log(`[Step ${index + 1}] Past ${printInterval} steps: 
                        Average Loss ${totalLoss / printInterval} | 
                        Accuracy: ${correctDigits / printInterval * 100}%`);
            totalLoss = 0
            correctDigits = 0;
        }
    });
}


totalLoss = 0;
correctDigits = 0;
testImages.map(data => {
    const { image, label } = data;
    const { loss, acc } = forward(image, label);

    totalLoss += loss;
    correctDigits += acc;
});

console.log(`Test loss: ${totalLoss / testImages.length}`);
console.log(`Test accuracy: ${correctDigits / testImages.length * 100}%`);