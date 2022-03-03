// eslint-disable-next-line @typescript-eslint/no-var-requires
const pako = require('pako');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const base91 = require('node-base91');

// Decompress the Tile if it's compressed
export function decompressTileCode(tileCodeString) {
    if (tileCodeString == null) {
        return '';
    }
    if (typeof tileCodeString === 'string') {
        if (tileCodeString.startsWith('b#')) {
            // Using substring to remove the b#
            try {
                const pakotest = pako.inflate(
                    base91.decode(tileCodeString.substr(2)),
                    {
                        to: 'string',
                    }
                );
                return pakotest;
            } catch {
                return '';
            }
        } else {
            return tileCodeString.trim();
        }
    }
    return tileCodeString.trim();
}
