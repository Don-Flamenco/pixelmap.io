import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import EditTile from '../../components/EditTile';
import ImageEditorModal from '../../components/ImageEditorModal';
import { fetchTiles } from '../../utils/api';
import { compressTileCode } from '../../utils/ImageUtils';
import { saveTileData } from '../../utils/saveData';
import Layout from '../../components/Layout';
import { useAccount } from '../../utils/AccountContext';
import { WovMapTile } from '../../common/WovMapTile';

function Edit() {
    const [tiles, setTiles] = useState<WovMapTile[]>([]);
    const [ownedTiles, setOwnedTiles] = useState<WovMapTile[]>([]);
    const [isOpenImageEditor, setIsOpenImageEditor] = useState<boolean>(false);
    const [savingChanges, setSavingChanges] = useState([
        'Save Changes',
        'blue',
        '',
    ]);
    const [imageEditorTile, setImageEditorTile] = useState<WovMapTile>({
        id: 0,
    });

    const { account, setAccount } = useAccount();

    // fetch all tiles
    useEffect(() => {
        fetchTiles().then((_tiles) => {
            setTiles(_tiles);
        });
    }, []);

    // filter owned tiles
    useEffect(() => {
        if (account) {
            let owned = tiles.filter((tile: WovMapTile) => {
                return tile.owner.toLowerCase() === account.toLowerCase();
            });

            owned = owned.map((tile: WovMapTile) => {
                let _tile;
                if (tile.price == 0) {
                    _tile = {
                        ...tile,
                        priceDisabled: true,
                        newPrice: '',
                    };
                } else {
                    _tile = {
                        ...tile,
                        priceDisabled: false,
                        newPrice: String(tile.price),
                    };
                }
                return _tile;
            });

            setOwnedTiles([...owned]);
        }
    }, [account, tiles]);

    const handlePriceChange = (price: string, index: number) => {
        let _tiles = ownedTiles;
        _tiles[index].newPrice = price;
        setOwnedTiles([..._tiles]);
    };

    const handleNameChange = (name: string, index: number) => {
        let _tiles = ownedTiles;
        _tiles[index].name = name;

        setOwnedTiles([..._tiles]);
    };

    const handleLinkChange = (link: string, index: number) => {
        let _tiles = ownedTiles;
        _tiles[index].url = link;

        setOwnedTiles([..._tiles]);
    };

    const handleImageChange = (image: string) => {
        let _tiles = ownedTiles;

        _tiles = _tiles.map((tile: WovMapTile) => {
            if (tile.id === imageEditorTile.id) {
                tile.image_data = image;
            }

            return tile;
        });

        setOwnedTiles([..._tiles]);
    };

    const openImageEditor = (tile: WovMapTile) => {
        setImageEditorTile(tile);
        setIsOpenImageEditor(true);
    };

    const handleSave = async (tile: WovMapTile) => {
        setSavingChanges([
            'Waiting on wallet...',
            'gray',
            'pointer-events-none',
        ]);
        let compressedImage = await compressTileCode(tile.image_data);
        let formattedPrice;
        if (tile.newPrice == '') {
            formattedPrice = 0;
        } else {
            formattedPrice = parseInt(tile.newPrice);
        }
        try {
            let result = await saveTileData(
                tile.id,
                tile.name,
                compressedImage,
                tile.url,
                formattedPrice
            );
            if (result) {
                setTimeout(() => {
                    setSavingChanges([
                        'Success!',
                        'blue',
                        'pointer-events-none',
                    ]);
                }, 5000);
                setTimeout(() => {
                    setSavingChanges(['Save Changes', 'blue', '']);
                }, 6000);
            } else {
                setTimeout(() => {
                    setSavingChanges([
                        'TX Failed!',
                        'red',
                        'pointer-events-none',
                    ]);
                }, 1000);
                setTimeout(() => {
                    setSavingChanges(['Save Changes', 'blue', '']);
                }, 3000);
            }
        } catch {
            setTimeout(() => {
                setSavingChanges(['TX Failed!', 'red', 'pointer-events-none']);
            }, 1000);
            setTimeout(() => {
                setSavingChanges(['Save Changes', 'blue', '']);
            }, 3000);
        }
    };

    const handleForSaleToggleChange = async (
        toggle: boolean,
        index: number
    ) => {
        let _tiles = ownedTiles;
        _tiles[index].priceDisabled = !ownedTiles[index].priceDisabled;
        if (_tiles[index].priceDisabled == true) {
            _tiles[index].newPrice = '';
        } else {
            _tiles[index].newPrice = String(ownedTiles[index].price);
        }
        setOwnedTiles([..._tiles]);
    };

    return (
        <>
            <Head>
                <title>Dashboard | Wall of Vame</title>
            </Head>
            <Layout>
                <main className="w-full max-w-2xl mx-auto mt-12 sm:mt-24 min-h-80 px-3">
                    {!account && (
                        <div className="bg-white rounded-md border p-6 shadow-md">
                            <h1 className="text-3xl font-bold mb-4 text-blue-600 ">
                                Connect your wallet to view your purchased
                                vNFTs.
                            </h1>
                        </div>
                    )}
                    {account && ownedTiles.length == 0 && (
                        <div className="bg-white rounded-md border p-6 shadow-md">
                            <h1 className="text-3xl font-bold mb-4 text-blue-600 ">
                                vNFTs you purchase will be displayed here.
                            </h1>
                        </div>
                    )}
                    <div className="">
                        {ownedTiles.map(
                            (ownedTile: WovMapTile, index: number) => (
                                <EditTile
                                    tile={ownedTile}
                                    index={index}
                                    handleImageEditor={openImageEditor}
                                    handleLinkChange={handleLinkChange}
                                    handleNameChange={handleNameChange}
                                    handlePriceChange={handlePriceChange}
                                    handleForSaleToggleChange={
                                        handleForSaleToggleChange
                                    }
                                    handleSave={handleSave}
                                    savingChanges={savingChanges}
                                    key={ownedTile.id}
                                />
                            )
                        )}
                    </div>

                    <ImageEditorModal
                        isOpen={isOpenImageEditor}
                        setIsOpen={(val: boolean) => setIsOpenImageEditor(val)}
                        tile={imageEditorTile}
                        changeImage={handleImageChange}
                    />
                </main>
            </Layout>
        </>
    );
}

export default Edit;
