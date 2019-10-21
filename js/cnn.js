"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const conv2D_1 = require("./conv2D");
const maxPool_1 = require("./maxPool");
const softMax_1 = require("./softMax");
const data_1 = require("./data");
const mathjs_1 = require("mathjs");
class CNN {
    constructor() {
        this.imagesCount = 5;
        this.epochCount = 1;
        this.trainingImages = data_1.trainingData(this.imagesCount, 'training');
        this.testImages = data_1.trainingData(this.imagesCount, 'test');
        this.softMax = new softMax_1.default(13 * 13 * 8, 10);
        this.conv = new conv2D_1.default(8);
        this.maxPool = new maxPool_1.default();
        this.forward = (image, label) => {
            const { output } = this.predict(image);
            const loss = -mathjs_1.log(output[label]);
            const acc = output.indexOf(Math.max(...output)) === label ? 1 : 0;
            return { output, loss, acc };
        };
        this.predict = (image) => {
            image = mathjs_1.subtract(mathjs_1.divide(image, 255), 0.5);
            let output = this.conv.forward(image);
            output = this.maxPool.forward(output);
            output = this.softMax.forward(output);
            const predicted = output.indexOf(Math.max(...output));
            return { output, predicted };
        };
        this.train = (image, label, learningRate = 0.005) => {
            const { output, loss, acc } = this.forward(image, label);
            let gradient = mathjs_1.zeros(10).toArray();
            gradient[label] = -1 / output[label];
            gradient = this.softMax.backprop(gradient, learningRate);
            gradient = this.maxPool.backprop(gradient);
            this.conv.backprop(gradient, learningRate);
            return { loss, acc };
        };
        this.shuffle = (a) => {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        };
        this.trainDataset = () => {
            let totalLoss = 0;
            let correctDigits = 0;
            for (let i = 0; i < this.epochCount; i++) {
                this.shuffle(this.trainingImages);
                this.trainingImages.map((data, index) => {
                    const { image, label } = data;
                    const { loss, acc } = this.train(image, label);
                    totalLoss += loss;
                    correctDigits += acc;
                });
            }
            this.conv.saveToFile();
            this.softMax.saveToFile();
            return `Average Loss ${totalLoss / this.trainingImages.length / this.epochCount} <br />
                Accuracy: ${correctDigits / this.trainingImages.length / this.epochCount * 100}%`;
        };
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.conv.readFromFile();
            yield this.softMax.readFromFile();
            let totalLoss = 0;
            let correctDigits = 0;
            this.testImages.map(data => {
                const { image, label } = data;
                const { loss, acc } = this.forward(image, label);
                totalLoss += loss;
                correctDigits += acc;
            });
            return new Promise(resolve => {
                resolve(`Test loss: ${totalLoss / this.testImages.length} <br />
                    Test accuracy: ${correctDigits / this.testImages.length * 100}%`);
            });
        });
    }
    predictAsync(image) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.conv.readFromFile();
            yield this.softMax.readFromFile();
            return new Promise(resolve => {
                resolve(this.predict(image).predicted);
            });
        });
    }
}
exports.default = CNN;
