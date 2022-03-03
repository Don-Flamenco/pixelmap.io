// import React, { useState, useEffect, createContext } from 'react';

import { AccountProvider } from '../utils/AccountContext';

import '../styles/globals.css';

function App({ Component, pageProps }) {
    return (
        <AccountProvider>
            <Component {...pageProps} />
        </AccountProvider>
    );
}

export default App;
