export interface IMaxPoolGenerator {
    imgRegion: number[][][];
    i: number;
    j: number;
};

export interface IMaxPool {
    forward(input: number[][][]): number[][][];
    iterateRegions(image: number[][][]): Generator<IMaxPoolGenerator>;
};
