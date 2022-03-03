import Image from 'next/image';
import Link from 'next/link';
import { NavLink } from './NavLink';

import Account from './Account';
import SearchBar from './SearchBar';
import logo from '../public/assets/images/crown.svg';
import { useAccount } from '../utils/AccountContext';
import { useState } from 'react';

const navigation = [
    { name: 'Wall', link: '/', target: '_self' },
    { name: 'Dashboard', link: '/dashboard', target: '_self' },
    { name: 'About', link: '/about', target: '_self' },
];

export default function Header(props: any) {
    const { account, setAccount } = useAccount();

    const activeLink = 'border-b border-blue-200';

    const handleSignOut = () => {
        window.localStorage.removeItem('address');
        setAccount('');
    };

    return (
        <header
            className={`wovShadow relative bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-100 bg-white border border-gray-400`}
        >
            <nav
                className="relative border-b-1 md:border-none border-gray-200"
                aria-label="Global"
            >
                <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3">
                    <div className="flex items-center flex-1">
                        <div className="flex items-center justify-between w-full md:w-auto">
                            <Link href="/">
                                <a className="w-10 h-10 md:h-10 md:w-10 mt-3">
                                    <span className="sr-only">
                                        Wall of Vame
                                    </span>
                                    <Image
                                        // className="w-full h-auto"
                                        src={logo}
                                        alt="Wall of Vame"
                                    />
                                </a>
                            </Link>
                        </div>

                        <div className="hidden md:flex md:mx-8 md:items-center md:flex-grow ">
                            <div className="flex space-x-6 items-center ">
                                <SearchBar />

                                {navigation.map((item) => {
                                    if (item.link) {
                                        return (
                                            <NavLink
                                                key={item.name}
                                                href={item.link}
                                            >
                                                <a
                                                    className={`text-gray-500 font-semibold text-center inline-flex items-center mr-2 mb-1 mt-2 px-5 py-2.5`}
                                                >
                                                    {item.name}
                                                </a>
                                            </NavLink>
                                        );
                                    } else {
                                        return (
                                            <a
                                                key={item.name}
                                                href={item.link}
                                                className="inline-flex items-center px-4 py-1 border border-white shadow-sm text-sm font-semibold rounded-full text-white bg-blur hover:opacity-80 transition duration-150"
                                                target={item.target}
                                            >
                                                {item.name}
                                            </a>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Account
                            account={account}
                            setAccount={setAccount}
                            signout={handleSignOut}
                        />
                    </div>
                </div>

                <div className="px-3 md:px-6 py-3 flex flex-wrap justify-start space-x-6 md:hidden">
                    {/* <SearchBar /> */}

                    {navigation.map((item) => {
                        if (item.link) {
                            return (
                                <Link key={item.name} href={item.link}>
                                    <a className="text-sm font-semibold text-gray-600 transition duration-150">
                                        {item.name}
                                    </a>
                                </Link>
                            );
                        } else {
                            return (
                                <a
                                    key={item.name}
                                    href={item.link}
                                    className="text-sm font-semibold text-gray-600 transition duration-150"
                                    target={item.target}
                                >
                                    {item.name}
                                </a>
                            );
                        }
                    })}
                </div>
            </nav>
        </header>
    );
}
