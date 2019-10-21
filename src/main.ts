import * as express from 'express';
import CNN from './cnn';

const app = express();
const port = 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.listen(port, () => console.log(`App listening on port ${port}!`))
app.use(express.static('public'));

app.get('/train', (req: any, res: any) => {
    const cnn = new CNN();
    res.send("Training started, you can look process at console.");
    cnn.trainDataset();
});

app.get('/test', (req: any, res: any, next) => {
    const cnn = new CNN();
    res.send("Testing started, you can look process at console.");
    cnn.test();
});

app.post('/predict', async (req: any, res: any, next) => {
    try {
        const cnn = new CNN();
        const predictedNumber = await cnn.predictAsync(req.body.image, 'trainedFrontend');
        res.json(predictedNumber);
    } catch(e) {
        next(e);
    }
});