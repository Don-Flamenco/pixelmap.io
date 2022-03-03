module.exports = {
    // publicRuntimeConfig: {
    //   NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    // },

    images: {
        domains: [
            'api.pixelmap.dev',
            'api.pixelmap.io',
            'localhost',
            'pixelmap.art',
            'b.wallofvame.io',
        ],
        minimumCacheTTL: 60,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};
