import React, { useContext, useState, useEffect } from 'react';

interface ContextState {
    account: string | '';
    setAccount: React.Dispatch<React.SetStateAction<string>>;
}

const AccountContext = React.createContext({} as ContextState);

export function AccountProvider({ children }) {
    const [account, setAccount] = useState('');

    useEffect(() => {
        if (window.localStorage.getItem('address')) {
            setAccount(window.localStorage.getItem('address'));
        } else {
            setAccount('');
        }
    });
    return (
        <AccountContext.Provider value={{ account, setAccount }}>
            {children}
        </AccountContext.Provider>
    );
}

export function useAccount() {
    return useContext(AccountContext);
}
