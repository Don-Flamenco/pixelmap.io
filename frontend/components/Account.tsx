import { shortenIfHex } from '../utils/misc';
import { useAccount } from '../utils/AccountContext';
import { useConnex } from '../utils/useConnex';

const Account = (props: any) => {
    const { account, setAccount } = useAccount();
    const { connex, setConnex } = useConnex();

    const handleSyncLaunch = () => {
        connex.vendor
            .sign('cert', {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: 'Please sign to access Wall of Vame',
                },
            })
            .link('http://wallofvame.io')
            .request({
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: 'Please sign to access Wall of Vame',
                },
            })
            .then((result) => {
                setAccount(result.annex.signer);
                window.localStorage.setItem('address', result.annex.signer);
            })
            .catch((err) => {
                console.log('user cancelled: ', err);
            });
    };

    if (account == '') {
        return (
            <div>
                <button
                    className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-1 mt-2"
                    onClick={handleSyncLaunch}
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={props.signout}
            className="px-1 wovAccount text-gray-900 bg-white hover:bg-gray-100 border border-gray-400 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-1 mt-2"
        >
            <span>{`${shortenIfHex(account, 10)}`}</span>
        </button>
    );
};

export default Account;
