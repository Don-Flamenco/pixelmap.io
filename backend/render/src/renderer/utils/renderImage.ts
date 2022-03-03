// eslint-disable-next-line @typescript-eslint/no-var-requires
const Jimp = require('jimp');
import { decompressTileCode } from './decompressTileCode';

export async function renderImage(tileImageData: string, outputPath: string) {
    let decompressed = await decompressTileCode(tileImageData);
    if (decompressed.length < 768) {
        decompressed =
            'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc11c11ffffffffffffffffffffffffffffffffffffffffffc11c11ffffffffffffffffffffffffffffffffffffffffffc22c22ffffffffffffffffffffffffffffffffffffffffffc11c22ffffffffffffffffffffffffffffffffffffffffffc11c22ffffffffffffffffffffffffffffffffffffffffffc11c11ffffffffffffffffffffffffffffffffffffffffffc11c11ffffffffffffffffffffffffffffffffffffffffffc11c11ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc11c22ffffffffffffffffffffffffffffffffffffffffffc11c11fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    }

    if (decompressed.length >= 768) {
        // OWN IMAGE

        const imageDataArray = decompressed.match(/.{1,3}/g);

        let counter = 0;

        const image = await new Jimp(16, 16);

        for (let x = 0; x <= 15; x++) {
            for (let y = 0; y <= 15; y++) {
                const index = counter;
                const hexstr = imageDataArray[index];
                const newhex =
                    hexstr.substr(0, 1) +
                    hexstr.substr(0, 1) +
                    hexstr.substr(1, 1) +
                    hexstr.substr(1, 1) +
                    hexstr.substr(2, 1) +
                    hexstr.substr(2, 1);
                image.setPixelColor(parseInt('0x' + newhex + 'FF', 16), y, x);
                counter++;
            }
        }
        await image
            .resize(512, 512, 'nearestNeighbor')
            .quality(100)
            .write(outputPath);
    } else {
        console.error('Not saving image, invalid image data found!');
        throw new Error(`Invalid image data found: ${decompressed} `);
    }
}
