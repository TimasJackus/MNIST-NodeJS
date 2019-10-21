import Conv2D from './conv2D';
import MaxPool from './maxPool';
import SoftMax from './softMax';
import { trainingData } from './data';
import { log, divide,subtract, zeros, Matrix } from 'mathjs';

export default class CNN {
    printInterval = 500;
    imagesCount = 1000;
    epochCount = 3;
    trainingImages = trainingData(this.imagesCount, 'training');
    testImages = trainingData(this.imagesCount, 'test');
    filtersCount = 8;
    softMax = new SoftMax(13 * 13 * this.filtersCount, 10, this.filtersCount);
    conv = new Conv2D(this.filtersCount);
    maxPool = new MaxPool();

    constructor() { }

    forward = (image: number[][], label: number): any => {
        const { output } = this.predict(image);
        const loss = -log(output[label])
        const acc = output.indexOf(Math.max(...output)) === label ? 1 : 0;

        return { output, loss, acc };
    };

    predict = (image: number[][]): any => {
        image = subtract(divide(image, 255), 0.5) as number[][];
        let output: number[][][] | number[][] | number[] = this.conv.forward(image);
        output = this.maxPool.forward(output);
        output = this.softMax.forward(output);
        const predicted = output.indexOf(Math.max(...output));

        return { output, predicted };
    };

    train = (image: number[][], label: number, learningRate: number = 0.005) => {
        const { output, loss, acc } = this.forward(image, label);

        let gradient: any = (zeros(10) as Matrix).toArray() as number[];
        gradient[label] = -1 / output[label];

        gradient = this.softMax.backprop(gradient, learningRate) as any;
        gradient = this.maxPool.backprop(gradient) as any;
        this.conv.backprop(gradient, learningRate);

        return { loss, acc };
    };

    shuffle = (a: any) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    trainDataset = () => {
        let totalLoss = 0;
        let correctDigits = 0;
        for (let i = 0; i < this.epochCount; i++) {
            this.shuffle(this.trainingImages);
            this.trainingImages.map((data, index) => {
                const { image, label } = data;
                const { loss, acc } = this.train(image, label);
            
                totalLoss += loss;
                correctDigits += acc;
                
                if (index % this.printInterval === this.printInterval - 1) {
                    console.log(`[Step ${index + 1}] Past ${this.printInterval} steps: 
                                Average Loss ${totalLoss / this.printInterval} | 
                                Accuracy: ${correctDigits / this.printInterval * 100}%`);
                    totalLoss = 0
                    correctDigits = 0;
                }
            });
        }
        this.conv.saveToFile();
        this.softMax.saveToFile();
        console.log('Saving trained model...');
        console.log('Model was successfuly saved.');
    }

    async test() {
        await this.conv.readFromFile();
        await this.softMax.readFromFile();
        let totalLoss = 0;
        let correctDigits = 0;

        this.testImages.map(data => {
            const { image, label } = data;
            const { loss, acc } = this.forward(image, label);
        
            totalLoss += loss;
            correctDigits += acc;
        });

        console.log(`Test loss: ${totalLoss / this.testImages.length} \nTest accuracy: ${correctDigits / this.testImages.length * 100}%`);
    }

    async predictAsync(image: number[][], folder: string = 'trained'): Promise<string> {
        await this.conv.readFromFile(folder);
        await this.softMax.readFromFile(folder);

        return new Promise(resolve => {
            resolve(this.predict(image).predicted)
        });
    }
}