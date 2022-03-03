import React from 'react';
import { useAccount } from '../utils/AccountContext';

export default function MapToggles({
    showOwned,
    setShowOwned,
    showForSale,
    setShowForSale,
    showMintable,
    setShowMintable,
}) {
    const { account, setAccount } = useAccount();

    return (
        <div className="flex space-x-4">
            <span className="toggleButtons bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-100 bg-white border border-gray-400 text-gray-500  hover:bg-gray-100 rounded-lg px-3 py-2 text-center inline-flex items-center mx-1 mb-1 mt-2">
                <label className="my-0">
                    <input
                        type="checkbox"
                        className=""
                        checked={showMintable}
                        onChange={(e) =>
                            setShowMintable(e.currentTarget.checked)
                        }
                    />

                    <span className="font-normal text-sm ml-2">Mintable</span>
                </label>
            </span>

            {account && account != '' && (
                <span className="toggleButtons bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-100 bg-white border border-gray-400 text-gray-500  hover:bg-gray-100 rounded-lg px-3 py-2 text-center inline-flex items-center mx-1 mb-1 mt-2">
                    <label className="my-0">
                        <input
                            type="checkbox"
                            className=""
                            checked={showOwned}
                            onChange={(e) =>
                                setShowOwned(e.currentTarget.checked)
                            }
                        />
                        <span className="font-normal text-sm ml-2">Owned</span>
                    </label>
                </span>
            )}
            <span className="toggleButtons bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-100 bg-white border border-gray-400 text-gray-500  hover:bg-gray-100 rounded-lg px-3 py-2 text-center inline-flex items-center mx-1 mb-1 mt-2">
                <label className="my-0 flex-col">
                    <input
                        type="checkbox"
                        className=""
                        checked={showForSale}
                        onChange={(e) =>
                            setShowForSale(e.currentTarget.checked)
                        }
                    />

                    <span className="font-normal text-sm ml-2 whitespace-nowrap">
                        For Sale
                    </span>
                </label>
            </span>
        </div>
    );
}
