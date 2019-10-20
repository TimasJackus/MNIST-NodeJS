import * as fs from 'fs';

interface IImage {
    label: number;
    image: number[][];
}

type IDataType = 'training' | 'test';

export const trainingData = (amount: number, dataType: IDataType): IImage[] => {
    let dataFileBuffer;
    let labelFileBuffer;

    if (dataType === 'training') {
        if (amount > 60000) amount = 60000;
        dataFileBuffer = fs.readFileSync(__dirname + '/../data/train-images-idx3-ubyte');
        labelFileBuffer  = fs.readFileSync(__dirname + '/../data/train-labels-idx1-ubyte');
    } else {
        if (amount > 10000) amount = 10000;
        dataFileBuffer = fs.readFileSync(__dirname + '/../data/t10k-images-idx3-ubyte');
        labelFileBuffer  = fs.readFileSync(__dirname + '/../data/t10k-labels-idx1-ubyte');
    }

    const images: IImage[] = [];
    
    for (let image = 0; image < amount; image++) { 
        var imagePixels = [];

        for (var y = 0; y <= 27; y++) {
            let row = [];
            for (var x = 0; x <= 27; x++) {
                row.push(dataFileBuffer[(image * 28 * 28) + (x + (y * 28)) + 16]);
            }
            imagePixels.push(row);
        }
    
        images.push({
            image: imagePixels,
            label: labelFileBuffer[image + 8]
        });
    }

    return images;
};