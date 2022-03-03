import { WovMapImage } from './WovMapImage';

export interface WovMapTile {
    id?: number; // The ID of the actual tile
    name?: string; // Name input by tile owner
    image?: string;
    image_data?: string; // Image of the tile as a hex triplet (optionally Base91 encoded with Pako compression)
    url?: string; // URL link on the tile
    price?: number; // Current price (on the OG contract)
    owner?: string; // Current owner (Ethereum HEX address)
    wrapped?: boolean; // Wrapped in ERC721 contract?
    openseaPrice?: number; // Price currently listed on OpenSea
    newPrice?: string;
    updating?: string; // No clue
    errorMessage?: string; // No clue
    forSale?: string;
    priceDisabled?: boolean;
}
