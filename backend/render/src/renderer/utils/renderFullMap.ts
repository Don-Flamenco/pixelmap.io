// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createCanvas, loadImage } = require('canvas');
import { decompressTileCode } from './decompressTileCode';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('graceful-fs');

// Create full tile canvas for front end performance. Keep the empty tiles transparent for
// background control on frontend.

export function renderFullMap(tiles, outputPath) {
  // if (!tiles || tiles.length !== 3969) {
  //   throw new Error('Tile array is NOT 3,969 tiles!');
  // } //only create map if tiles array is complete

  const width = 81 * 16; //81 tiles across
  const height = 49 * 16; //49 tiles down

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, width, height);

  let row = 0;
  let col = 0;
  for (let i = 0; i < tiles.length; i++) {
    let image_data;
    if (tiles[i].image_data == '') {
      // console.log('no image_data found');
      image_data = '';
    } else {
      image_data = tiles[i].image_data;
    }
    let hex = decompressTileCode(image_data);

    if (i > 0 && i % 81 === 0) {
      row++;
      col = 0;
    }

    if (hex.length === 768) {
      hex = hex.match(/.{1,3}/g);

      let index = 0;

      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          context.fillStyle = `#${hex[index]}`;
          context.fillRect(x + 16 * col, y + 16 * row, 1, 1);
          index++;
        }
      }
    }

    col++;
  }
  // console.log('image written');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFile(outputPath, buffer, (err) => {
    // console.log(err);
  });
}
