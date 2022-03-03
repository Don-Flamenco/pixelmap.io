import getConfig from 'next/config';
import { WovMapTile } from '../common/WovMapTile';

const { publicRuntimeConfig } = getConfig();

export const fetchTiles = async () => {
    try {
        const res = await fetch('https://b.wallofvame.io/metadata/');
        const tiles: Array<WovMapTile> = await res.json();
        return tiles;
    } catch (err) {
        return [];
    }
};

export const fetchSingleTile = async (id: string) => {
    let tile: WovMapTile;
    if (id != undefined) {
        try {
            const res = await fetch(`https://b.wallofvame.io/metadata/${id}`);
            tile = await res.json();
        } catch (err) {}
    }

    return tile;
};
