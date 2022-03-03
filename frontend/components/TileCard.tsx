import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { shortenIfHex, formatPrice, cleanUrl, veseaLink } from '../utils/misc';
import TileImage from './TileImage';
import { WovMapTile } from '../common/WovMapTile';
import { fetchSingleTile } from '../utils/api';
import { mintTile } from '../utils/mintTile';
import { buyTile } from '../utils/buyTile';
import { useAccount } from '../utils/AccountContext';
import { whitelistMint } from '../utils/whitelistMint';

interface TileCardProps {
    tile: WovMapTile;
    large?: boolean;
    setRefresh: any;
    tileCardRefresh: any;
    whitelistActive;
}

export default function TileCard({
    tile,
    large,
    setRefresh,
    whitelistActive,
}: TileCardProps) {
    const ownerName = shortenIfHex(tile.owner, 8);

    const [purchaseButton, setPurchaseButton] = useState([
        'Purchase',
        'blue',
        '',
    ]);
    const [tileImage, setTileImage] = useState(tile.image_data);
    const { account, setAccount } = useAccount();
    const [confirmationMessage, setConfirmationMessage] = useState(['', '']);
    const [mintButton, setMintButton] = useState(['Mint vNFT', 'blue', '']);

    useEffect(() => {
        !account
            ? setConfirmationMessage(['Connect Your Wallet', 'black'])
            : setConfirmationMessage(['', '']);
    }, [account]);

    const handleMint = async (id: number) => {
        setMintButton(['Waiting on wallet...', 'gray', 'pointer-events-none']);
        try {
            const result = await mintTile(id);

            if (result) {
                const waitForUpdate = await setInterval(async () => {
                    const result = await fetchSingleTile(String(id));

                    setConfirmationMessage(['Success!', 'blue']);
                    if (result.owner != '') {
                        clearInterval(waitForUpdate);
                        setRefresh(Date.now());
                    }
                }, 2000);
            } else {
                setConfirmationMessage(['TX Failed :(', 'red']);
            }
        } catch {
            setConfirmationMessage(['TX Failed :(', 'red']);
            setMintButton(['Mint vNFT', 'blue', '']);
        }
    };

    const handleWhitelistMint = async (id: number) => {
        setMintButton(['Waiting on wallet...', 'gray', 'pointer-events-none']);
        try {
            const result = await whitelistMint(id);

            if (result) {
                const waitForUpdate = await setInterval(async () => {
                    const result = await fetchSingleTile(String(id));

                    setConfirmationMessage(['Success!', 'blue']);
                    if (result.owner != '') {
                        clearInterval(waitForUpdate);
                        setRefresh(Date.now());
                    }
                }, 2000);
            } else {
                setConfirmationMessage(['TX Failed :(', 'red']);
            }
        } catch {
            setConfirmationMessage(['TX Failed :(', 'red']);
            setMintButton(['Mint vNFT', 'blue', '']);
        }
    };

    const handleBuyTile = async (id: number, price: number) => {
        setPurchaseButton([
            'Waiting on wallet...',
            'gray',
            'pointer-events-none',
        ]);

        try {
            const result = await buyTile(id, price);

            if (result) {
                const waitForUpdate = await setInterval(async () => {
                    const result = await fetchSingleTile(String(id));

                    setConfirmationMessage(['Success!', 'blue']);
                    if (result.owner == account) {
                        clearInterval(waitForUpdate);
                        setRefresh(Date.now());
                    }
                }, 2000);
            } else {
                setConfirmationMessage(['TX Failed :(', 'red']);
            }
        } catch {
            setConfirmationMessage(['TX Failed :(', 'red']);
            setPurchaseButton(['Purchase', 'blue', '']);
        }
    };

    const handlePriceDisplay = () => {
        if (
            whitelistActive.active &&
            !whitelistActive.claimed &&
            tile.owner == ''
        ) {
            return 'FREE';
        }
        if (tile.owner == '') {
            return '1000 VET';
        }
        if (tile.price) {
            return `${tile.price} VET`;
        }

        return `--`;
    };

    return (
        <div className=" flex flex-col border border-gray-300">
            <div className={'basis-full h-12 bg-blue-500 flex'}>
                <h3
                    className={`ml-4 text-white font-bold self-center ${
                        large ? 'md:text-3xl' : 'text-xl'
                    } relative`}
                >
                    vNFT #{tile.id}
                </h3>
            </div>
            <div
                className={`relative flex px-4 pt-3  space-x-4 ${
                    large ? 'md:p-8 md:space-x-8' : ''
                }`}
            >
                <div className={'flex items-center ml-2'}>
                    <div className="bg-gray-200 border mr-2">
                        <TileImage
                            className={`${
                                large
                                    ? 'h-20 w-20 md:h-40 md:w-40'
                                    : 'h-16 w-16 md:h-20 md:w-20'
                            }`}
                            image={tileImage}
                        />
                    </div>
                </div>
                <div
                    className={`flex-grow-1 space-y-1 ${
                        large ? 'md:space-y-3' : ''
                    }`}
                >
                    <table className={'border-separate'}>
                        <tbody>
                            <tr className={'row'}>
                                <th className={'col text-right'}>
                                    <span className={'text-sm text-gray-700'}>
                                        Owner:
                                    </span>
                                </th>

                                <td className={'pl-2'}>
                                    <Link href={`/owner/${tile.owner}`}>
                                        {ownerName}
                                    </Link>
                                </td>
                            </tr>
                            <tr className={'row'}>
                                <th className={'col text-right'}>
                                    <span className={'text-sm text-gray-700'}>
                                        Name:
                                    </span>
                                </th>

                                <td className={'pl-2'}>{tile.name}</td>
                            </tr>
                            <tr className={'row'}>
                                <th className={'col text-right'}>
                                    <span className={'text-sm text-gray-700'}>
                                        Website:
                                    </span>
                                </th>

                                <td className={'pl-2'}>
                                    <a
                                        href={cleanUrl(tile.url)}
                                        className={`text-blue-600 break-all truncate text-sm whitespace-normal ${
                                            large ? 'md:text-base' : ''
                                        }`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {tile.url}
                                    </a>
                                </td>
                            </tr>
                            <tr className={'row'}>
                                <th className={'col text-right'}>
                                    <span className={'text-sm text-gray-700'}>
                                        Price:
                                    </span>
                                </th>

                                <td className={'pl-2'}>
                                    {handlePriceDisplay()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={`px-2 py-2 ${large ? 'md:px-8 md:py-4' : ''}`}>
                <div className="flex justify-between items-center">
                    {((!tile.owner && account && !whitelistActive.active) ||
                        (!tile.owner &&
                            account &&
                            whitelistActive.active &&
                            whitelistActive.claimed)) && (
                        <div>
                            <a
                                className={`${mintButton[2]} m-2 inline-block px-6 py-3 border-2 border-${mintButton[1]}-500 text-${mintButton[1]}-500 bg-white font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                                onClick={() => handleMint(tile.id)}
                            >
                                {`${mintButton[0]}`}
                            </a>
                        </div>
                    )}
                    {!tile.owner &&
                        account &&
                        whitelistActive.active &&
                        !whitelistActive.claimed && (
                            <div>
                                <a
                                    className={`${mintButton[2]} m-2 inline-block px-6 py-3 border-2 border-${mintButton[1]}-500 text-${mintButton[1]}-500 bg-white font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                                    onClick={() => handleWhitelistMint(tile.id)}
                                >
                                    {`${mintButton[0]}`}
                                </a>
                            </div>
                        )}

                    {tile.owner == account && account != '' && (
                        <div>
                            <Link href={`/dashboard/`}>
                                <a
                                    className={`m-2 inline-block px-6 py-3 border-2 border-blue-500 text-blue-500 bg-white font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                                >
                                    {'Edit vNFT'}
                                </a>
                            </Link>
                        </div>
                    )}
                    {account &&
                        tile.owner != '' &&
                        tile.owner != account &&
                        tile.price == 0 && (
                            <div>
                                <span
                                    className={`m-2 inline-block px-6 py-3 border-2 border-gray-500 text-gray-500 bg-white font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                                >
                                    {'Not for sale'}
                                </span>
                            </div>
                        )}
                    {account && tile.owner != account && tile.price != 0 && (
                        <div>
                            <a
                                className={`${purchaseButton[2]} m-2 inline-block px-6 py-3 border-2 border-${purchaseButton[1]}-500 text-${purchaseButton[1]}-500 bg-white font-medium text-xs leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                                onClick={() =>
                                    handleBuyTile(tile.id, tile.price)
                                }
                            >
                                {`${purchaseButton[0]}`}
                            </a>
                        </div>
                    )}
                    {confirmationMessage && (
                        <span
                            className={`m-2 inline-block px-6 py-3 text-${confirmationMessage[1]}-500 bg-white font-medium text-sm leading-tight rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                        >
                            {confirmationMessage[0]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
