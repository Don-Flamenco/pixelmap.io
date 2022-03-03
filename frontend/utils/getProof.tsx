import { useAccount } from './AccountContext';

const getProof = async () => {
    const { account, setAccount } = useAccount();
    try {
        const proof = await fetch(
            `https://b.wallofvame.io/whitelist/${account}`
        );
        return proof;
    } catch (err) {
        return err;
    }
};
