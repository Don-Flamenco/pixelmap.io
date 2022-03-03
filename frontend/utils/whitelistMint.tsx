import { MINT_PRICE, GAS, NODE, NETWORK } from '../constants/misc';
import { WOV_CONTRACT } from '../constants/addresses';

const whitelistMintAbi = {
    inputs: [
        {
            internalType: 'bytes32[]',
            name: '_merkleProof',
            type: 'bytes32[]',
        },
        {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
        },
        {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
        },
    ],
    name: 'whiteListMint',
    outputs: [
        {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
        },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
};

export const whitelistMint = async (id: number) => {
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

        let proof;
        await fetch(`https://b.wallofvame.io/whitelist/proof/${account}`).then(
            (res) => res.json().then((_proof) => (proof = _proof))
        );

        console.log('proof', proof);

        const setTileMethod = connex.thor
            .account(WOV_CONTRACT)
            .method(whitelistMintAbi);

        const clause = setTileMethod.asClause(proof, account, id);

        await connex.vendor
            .sign('tx', [{ ...clause }])
            .signer(account)
            .link('https://wallofvame.io')
            .comment(`Sign to mint vNFT ID# ${id}`)
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
