import React, { useState, useEffect } from 'react';
import TilePopover from './TilePopover';
import { WovMapTile } from '../common/WovMapTile';

function MapTiles({ tiles, setRefresh, tileCardRefresh, whitelistActive }) {
    let [currentTile, setCurrentTile] = useState<WovMapTile | null>();
    let [tileElement, setTileElement] = useState<HTMLButtonElement | null>();
    let [currentTileIndex, setCurrentTileIndex] = useState<number>();

    const handleClick = (tileIndex: number, ref: HTMLButtonElement) => {
        setCurrentTileIndex(tileIndex);
        setCurrentTile(tiles[tileIndex]);
        setTileElement(ref);
    };

    useEffect(() => {
        setCurrentTile(tiles[currentTileIndex]);
    }, [tiles]);

    return (
        <>
            {tiles.map((tile: WovMapTile, idx: number) => (
                <button
                    key={idx}
                    onClick={(e) => {
                        handleClick(idx, e.currentTarget);
                    }}
                    className="block w-4 h-4 ring-green-600 hover:ring hover:bg-green-500 hover:bg-opacity-40 hover:ring-opacity-100"
                ></button>
            ))}

            <TilePopover
                tile={currentTile}
                referenceElement={tileElement}
                setRefresh={setRefresh}
                tileCardRefresh={tileCardRefresh}
                whitelistActive={whitelistActive}
            />
        </>
    );
}

export default React.memo(MapTiles);
