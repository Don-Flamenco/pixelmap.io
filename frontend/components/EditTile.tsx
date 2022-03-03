import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

import TileImage from './TileImage';
import { WovMapTile } from '../common/WovMapTile';

type Props = {
    tile: WovMapTile;
    index: number;
    handleImageEditor;
    handleLinkChange;
    handleNameChange;
    handlePriceChange;
    handleSave;
    handleForSaleToggleChange;
    savingChanges;
};

function EditTile({
    tile,
    index,
    handleImageEditor,
    handleLinkChange,
    handleNameChange,
    handlePriceChange,
    handleSave,
    handleForSaleToggleChange,
    savingChanges,
}: Props) {
    return (
        <Disclosure key={tile.id}>
            {({ open }) => (
                <div className="mb-3">
                    <Disclosure.Button
                        className={`relative flex items-center py-3 px-4 bg-white w-full text-left font-medium border-solid border-2 border-gray-500 ${
                            open ? 'border-b-0' : ''
                        }`}
                    >
                        <div className="bg-gray-200 h-6 w-6 mr-3">
                            <TileImage
                                image={tile.image_data}
                                className="h-full w-full"
                            />
                        </div>

                        <span>Tile #{tile.id}</span>

                        <div className="ml-auto">
                            {open && (
                                <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                            )}

                            {!open && (
                                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            )}
                        </div>
                    </Disclosure.Button>

                    <Disclosure.Panel className="relative container bg-white py-6 px-8 border-2 border-gray-500">
                        <>
                            <div className="flex flex-wrap justify-center space-x-12">
                                <div className="bg-gray-200 h-48 w-48">
                                    <button
                                        onClick={() => handleImageEditor(tile)}
                                        className="block group relative"
                                    >
                                        <div className="z-10 absolute inset-0 bg-gray-900 bg-opacity-70 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                            <span className="text-white">
                                                Change image
                                            </span>
                                        </div>
                                        <TileImage
                                            image={tile.image_data}
                                            className="h-48 w-48 z-10"
                                        />
                                    </button>
                                </div>
                                <div className="flex flex-col">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="mt-1 border-2 p-2"
                                            value={tile.name}
                                            onChange={(e) =>
                                                handleNameChange(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="link"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            URL
                                        </label>
                                        <input
                                            type="text"
                                            name="link"
                                            id="link"
                                            className="mt-1 border-2 p-2"
                                            value={tile.url}
                                            onChange={(e) =>
                                                handleLinkChange(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="price"
                                            className="block text-sm font-medium text-gray-700 flex justify-between"
                                        >
                                            Price (VET){' '}
                                            <span className="text-sm text-gray-400 ">
                                                3.5% fee
                                            </span>
                                        </label>

                                        <input
                                            type="string"
                                            name="price"
                                            id="price"
                                            className="mt-1 border-2 p-2"
                                            value={tile.newPrice}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    e.target.value.replace(
                                                        /\D+/g,
                                                        ''
                                                    ),
                                                    index
                                                )
                                            }
                                            disabled={tile.priceDisabled}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-center w-full mb-2">
                                            <label
                                                htmlFor={`${tile.id}ForSale`}
                                                className="flex items-center cursor-pointer"
                                            >
                                                <div className="relative">
                                                    <input
                                                        id={`${tile.id}ForSale`}
                                                        type="checkbox"
                                                        className={`sr-only`}
                                                        checked={
                                                            !tile.priceDisabled
                                                        }
                                                        onChange={(e) => {
                                                            handleForSaleToggleChange(
                                                                e.target
                                                                    .checked,
                                                                index
                                                            );
                                                        }}
                                                    />

                                                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>

                                                    <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                                                </div>

                                                <div className="ml-3 text-gray-700 font-medium">
                                                    List for sale
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* {
                                        <div className="mb-3">
                                            <p className="p-1 mb-1">
                                                Price: {formatPrice(tile)}
                                            </p>
                                            <span className="text-mdtext-gray-600">
                                                Set the price on{' '}
                                                <a
                                                    className="text-blue-500 underline"
                                                    href={veseaLink(tile.id)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    VeSea
                                                </a>
                                            </span>
                                        </div>
                                    } */}
                                </div>
                            </div>
                            <div className="flex justify-around mt-2">
                                <button
                                    type="button"
                                    className={`${savingChanges[2]} inline-block px-6 py-2 border-2 border-${savingChanges[1]}-500 text-${savingChanges[1]}-500 font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                                    onClick={() => handleSave(tile)}
                                >
                                    {savingChanges[0]}
                                </button>
                            </div>
                        </>
                    </Disclosure.Panel>
                </div>
            )}
        </Disclosure>
    );
}
export default EditTile;
