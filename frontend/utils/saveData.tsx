import { NODE, NETWORK } from '../constants/misc';
import { WOV_CONTRACT } from '../constants/addresses';
const convert = require('ethereum-unit-converter');

const setTileAbi = {
    inputs: [
        {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
        },
        {
            internalType: 'string',
            name: 'name',
            type: 'string',
        },
        {
            internalType: 'string',
            name: 'image_data',
            type: 'string',
        },
        {
            internalType: 'string',
            name: 'url',
            type: 'string',
        },
        {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
        },
    ],
    name: 'setTileData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
};

export const saveTileData = async (
    id: number,
    name: string,
    image: string,
    url: string,
    price: number
) => {
    return new Promise<boolean>(async (res, rej) => {
        let connex;
        const account = window.localStorage.getItem('address');
        if (!window.connex) {
            const { Connex } = await import('@vechain/connex');
            connex = new Connex({
                node: NODE,
                network: NETWORK,
            });
        } else {
            connex = window.connex;
        }

        let priceWei = convert(price, 'ether', 'wei');

        const setTileMethod = connex.thor
            .account(WOV_CONTRACT)
            .method(setTileAbi);

        const clause = setTileMethod.asClause(id, name, image, url, priceWei);
        let commentPrice;
        if (price != 0) {
            commentPrice = price + ' VET';
        } else {
            commentPrice = '[not for sale]';
            price = 0;
        }

        await connex.vendor
            .sign('tx', [{ ...clause }])
            .signer(account)
            .link('https://wallofvame.io')
            .comment(
                `Update vNFT ID# ${id} information || Name: ${name} || URL: ${url} || Price: ${commentPrice}
            `
            )
            .request([{ ...clause }])
            .then(async (transaction) => {
                (async () => {
                    const waitForUpdate = await setInterval(async () => {
                        const result = await connex.thor
                            .transaction(transaction.txid)
                            .getReceipt()
                            .then((tx) => {
                                return tx;
                            });

                        if (result != null) {
                            clearInterval(waitForUpdate);
                            // reverted = true means it failed
                            res(!result.reverted);
                        }
                    }, 2000);
                })();
            })
            .catch((err) => {
                console.error(err);
                rej(false);
            });
    });
};
