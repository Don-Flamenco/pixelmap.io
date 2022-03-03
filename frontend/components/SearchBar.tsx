import React, { useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';

export default function SearchBar() {
    const router = useRouter();
    let [keyword, setKeyword] = useState('');

    const handleOnChange = (event: any) => {
        const { value } = event.target;
        setKeyword(value);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (keyword.length < 5 && !isNaN(parseInt(keyword))) {
            //go to tile number page
            router.push({
                pathname: '/tile/[id]',
                query: { id: parseInt(keyword) },
            });
        } else if (keyword.length === 40 || keyword.length === 42) {
            //search owner listings
            router.push({
                pathname: '/owner/[address]',
                query: { address: parseInt(keyword) },
            });
        } else {
            //dont search
        }
    };

    return (
        <div className="flex">
            <div className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-400 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-1 mt-2">
                <form
                    // magnifying glass
                    className="relative text-gray-400"
                    onSubmit={handleSubmit}
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-2 flex items-center">
                        <SearchIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                        id="desktop-search"
                        className="font-gray-100 text-black text-md py-1 pl-9 my-0 placeholder-black-900 focus:outline-none focus:bg-white-200 focus:placeholder-gray-100 transition duration-150"
                        placeholder="Search"
                        type="text"
                        name="search"
                        value={keyword}
                        onChange={handleOnChange}
                    />
                </form>
            </div>
        </div>
    );
}
