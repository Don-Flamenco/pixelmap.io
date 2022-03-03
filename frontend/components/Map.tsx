import React, { useState, useEffect } from 'react';
import MapToggles from './MapToggles';
import MapTiles from './MapTiles';
import TileOverlay from './TileOverlay';
import styles from '../styles/components/Map.module.scss';
import { WovMapTile } from '../common/WovMapTile';
import { useAccount } from '../utils/AccountContext';

export default function Map(props: any) {
    const [showOwned, setShowOwned] = useState(false);
    const [showForSale, setShowForSale] = useState(false);
    const [showMintable, setShowMintable] = useState(false);
    const [mintableTiles, setMintableTiles] = useState(false);
    const [ownedTiles, setOwnedTiles] = useState(false);
    const [forSaleTiles, setForSaleTiles] = useState(false);
    const { account, setAccount } = useAccount();
    const [whitelistActive, setWhitelistActive] = useState<any>({
        active: false,
        claimed: false,
    });

    const toggleForSale = (value: boolean) => {
        setShowForSale(value);
        //setShowOwned( false );
    };
    const toggleMintable = (value: boolean) => {
        setShowMintable(value);
    };

    const toggleOwnedTiles = (value: boolean) => {
        setShowOwned(value);
        //setShowForSale( false );
    };

    useEffect(() => {
        if (account) {
            (async () => {
                const res = await fetch(
                    `https://b.wallofvame.io/whitelist/active/${account}`
                ).then((res) =>
                    res.json().then((response) =>
                        setWhitelistActive({
                            active: response.active,
                            claimed: response.claimed,
                        })
                    )
                );
            })();
        } else {
            setWhitelistActive({
                active: false,
                claimed: false,
            });
        }
    }, [account]);

    useEffect(() => {
        setOwnedTiles(
            props.tiles.filter((tile: WovMapTile) => {
                return (
                    account &&
                    account != '' &&
                    account.toLowerCase() === tile.owner.toLowerCase()
                );
            })
        );

        setForSaleTiles(
            props.tiles.filter((tile: WovMapTile) => {
                return tile.price && tile.price != 0;
            })
        );

        setMintableTiles(
            props.tiles.filter((tile: WovMapTile) => {
                return tile.owner == '';
            })
        );
    }, [props.tiles, account]);

    return (
        <div>
            <div className="max-w-map mx-auto px-3 flex justify-between">
                <MapToggles
                    showOwned={showOwned}
                    setShowOwned={toggleOwnedTiles}
                    showForSale={showForSale}
                    setShowForSale={toggleForSale}
                    showMintable={showMintable}
                    setShowMintable={toggleMintable}
                />

                {/* <ToggleTheme theme={theme} toggleTheme={toggleTheme} /> */}
            </div>

            <div
                className="overflow-auto p-2"
                style={{ touchAction: 'manipulation' }}
            >
                <div
                    className={`${styles.tileMap} backdrop-filter backdrop-blur-lg bg-white backdrop-filter backdrop-blur-xl bg-opacity-80`}
                >
                    {showOwned && (
                        <div className="absolute left-0 top-0 w-map h-map grid grid-cols-map grid-rows-map z-20 pointer-events-none ">
                            <TileOverlay
                                tiles={ownedTiles}
                                bgColor="bg-blue-600"
                            />
                        </div>
                    )}

                    {showForSale && (
                        <div className="absolute left-0 top-0 w-map h-map grid grid-cols-map grid-rows-map z-20 pointer-events-none ">
                            <TileOverlay
                                tiles={forSaleTiles}
                                bgColor="bg-green-600"
                            />
                        </div>
                    )}

                    {showMintable && (
                        <div className="absolute left-0 top-0 w-map h-map grid grid-cols-map grid-rows-map z-20 pointer-events-none ">
                            <TileOverlay
                                tiles={mintableTiles}
                                bgColor="bg-green-600"
                            />
                        </div>
                    )}

                    <div className="relative w-map h-map grid grid-cols-map grid-rows-map z-20">
                        <MapTiles
                            tiles={props.tiles}
                            setRefresh={props.setRefresh}
                            tileCardRefresh={props.tileCardRefresh}
                            whitelistActive={whitelistActive}
                        />
                    </div>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="absolute inset-0 z-10"
                        src="https://b.wallofvame.io/img/wov.png"
                        alt="WOV Map"
                        object-fit="fill"
                    />
                </div>
            </div>
        </div>
    );
}
