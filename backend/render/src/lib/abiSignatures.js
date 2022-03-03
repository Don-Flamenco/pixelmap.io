const abiTileUpdatedEvent = {
    anonymous: false,
    inputs: [
        {
            indexed: false,
            internalType: 'uint256',
            name: 'location',
            type: 'uint256',
        },
    ],
    name: 'TileUpdated',
    type: 'event',
};

const abiTile = {
    inputs: [
        {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
        },
    ],
    name: 'getTile',
    outputs: [
        {
            internalType: 'string',
            name: 'name',
            type: 'string',
        },
        {
            internalType: 'string',
            name: 'image_data',
            type: 'string',
        },
        {
            internalType: 'string',
            name: 'url',
            type: 'string',
        },
        {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
        },
        {
            internalType: 'address',
            name: 'owner',
            type: 'address',
        },
        {
            internalType: 'address',
            name: 'approved',
            type: 'address',
        },
    ],
    stateMutability: 'view',
    type: 'function',
};

const abiMint = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
        },
        {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
        },
        {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
        },
    ],
    name: 'Transfer',
    type: 'event',
};

module.exports = {
    abiTile,
    abiTileUpdatedEvent,
    abiMint,
};
