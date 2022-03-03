import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { WovMapTile } from '../common/WovMapTile';

export function shortenIfHex(hex: string, length = 12) {
    if (hex.length < length) {
        return hex;
    }
    return `${hex.substring(0, length + 2)}…${hex.substring(
        hex.length - length
    )}`;
}

export function formatVechainStatsLink(address: string) {
    return `https://vechainstats.com/account/${address}`;
}

export const parseBalance = (
    value: BigNumberish,
    decimals = 18,
    decimalsToDisplay = 3
) => {
    return new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'decimal',
    }).format(parseFloat(formatUnits(value, decimals)));
};

export const cleanUrl = (url: string) => {
    let regex = new RegExp('^(http|https)://', 'i');

    if (regex.test(url)) {
        return url;
    } else {
        return `https://${url}`;
    }
};

export const formatPrice = (tile: WovMapTile) => {
    let price = tile.openseaPrice;

    if (price === 0.0 || price === undefined) {
        return '–';
    }

    return `${price}`;
};

// vesea
export const openseaLink = (id: number) => {
    return `https://opensea.io/assets/${process.env.NEXT_PUBLIC_PIXELMAP_WRAPPER_CONTRACT}/${id}`;
};

export const veseaLink = (id: number) => {
    return `https://www.vesea.io/assets?collection=wall_of_vame&id=${id}`;
};

export const convertEthToWei = (price: string) => {
    return parseUnits(price || '0', 'ether');
};
