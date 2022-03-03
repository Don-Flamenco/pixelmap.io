import { useContext } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

import styles from '../styles/pages/Home.module.scss';

export default function Layout(props: any) {
    return (
        <div
            className={`relative w-full min-h-screen flex flex-col ${styles.wovBg}`}
        >
            <Header user={props.user} />

            {props.children}

            <Footer />
        </div>
    );
}
