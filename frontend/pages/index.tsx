import Head from 'next/head';

import Map from '../components/Map';
import { fetchTiles } from '../utils/api';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

function Home() {
    const [refresh, setRefresh] = useState(Date.now());
    const [tileCardRefresh, setTileCardRefresh] = useState(Date.now());

    let [tiles, setTiles] = useState<any>();

    useEffect(() => {
        const result = async () => {
            const _tiles = await fetchTiles();
            setTiles(_tiles);
        };
        result();
    }, []);

    useEffect(() => {
        const result = async () => {
            const _tiles = await fetchTiles();
            setTiles(_tiles);
            setTileCardRefresh(Date.now());
        };
        result();
    }, [refresh]);

    if (!tiles) {
        return '';
    } else {
        return (
            <>
                <Layout>
                    <Head>
                        <title>
                            Wall of Vame: Own a piece of Vechain History!
                        </title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <main className="py-8 md:py-12 lg:py-4">
                        <Map
                            tiles={tiles}
                            setRefresh={setRefresh}
                            tileCardRefresh={tileCardRefresh}
                        />
                    </main>
                </Layout>
            </>
        );
    }
}

// export async function getStaticProps() {
//     const tiles = await fetchTiles();

//     return {
//         props: {
//             tiles: tiles,
//         },
//         revalidate: 10,
//     };
// }

export default Home;
