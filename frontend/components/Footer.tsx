export default function Footer() {
    return (
        <footer className="relative bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-100 bg-white border border-gray-400 p-5">
            <div className="text-center md:text-left md:flex md:justify-between">
                <div className="space-x-6 ">
                    <a
                        className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-400 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-1 mt-2"
                        href={`https://insight.vecha.in/#/main/accounts/0xBAe19E8C489402A6Da101d872961563A1B8F0F59/`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Wall of Vame Contract
                    </a>
                </div>
                <div>
                    <a
                        className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-400 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-1 mt-2"
                        href={`https://twitter.com/KenErwin88`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Created in 2016 by kenerwin88
                    </a>
                    <a
                        className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-400 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-1 mt-2"
                        href={`https://twitter.com/DonFlamencoVET`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Forked in 2022 by DonFlamenco
                    </a>
                </div>
            </div>
        </footer>
    );
}
