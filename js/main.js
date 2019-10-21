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
const express = require("express");
const cnn_1 = require("./cnn");
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.listen(port, () => console.log(`App listening on port ${port}!`));
app.use(express.static('public'));
app.get('/train', (req, res) => {
    const cnn = new cnn_1.default();
    res.send(cnn.trainDataset());
});
app.get('/test', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cnn = new cnn_1.default();
        const result = yield cnn.test();
        res.send(result);
    }
    catch (e) {
        next(e);
    }
}));
app.post('/predict', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cnn = new cnn_1.default();
        const predictedNumber = yield cnn.predictAsync(req.body.image);
        res.json(predictedNumber);
    }
    catch (e) {
        next(e);
    }
}));
