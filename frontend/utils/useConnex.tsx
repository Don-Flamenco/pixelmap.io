import { useState, useEffect } from 'react';
import ConnexClass from '@vechain/connex';
import { NODE, NETWORK } from '../constants/misc';

export const useConnex = () => {
    const [connex, setConnex] = useState<ConnexClass>();

    useEffect(() => {
        if (!window.connex) {
            const initConnex = async () => {
                const { Connex } = await import('@vechain/connex');
                const connex = new Connex({
                    node: NODE,
                    network: NETWORK,
                });
                setConnex(connex);
            };
            initConnex();
        } else {
            setConnex(window.connex);
        }
    }, []);
    return { connex, setConnex };
};
