import { NODE, NETWORK } from '../constants/misc';
import { WOV_CONTRACT } from '../constants/addresses';
const convert = require('ethereum-unit-converter');

const buyTileAbi = {
    constant: false,
    inputs: [
        {
            name: 'location',
            type: 'uint256',
        },
    ],
    name: 'buyTile',
    outputs: [],
    payable: true,
    type: 'function',
};
export const buyTile = async (id: number, price: number) => {
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
        const buyTileMethod = connex.thor
            .account(WOV_CONTRACT)
            .method(buyTileAbi)
            .value(priceWei);

        const clause = buyTileMethod.asClause(id);

        const comment = `Buy tile #${id} for ${price} VET`;

        await connex.vendor
            .sign('tx', [{ ...clause }])
            .signer(account)
            .link('https://wallofvame.io')
            .comment(comment)
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
