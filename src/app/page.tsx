import {Metadata} from "next";
import React from "react";
import styles from "@/app/uezdy/page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Генеалогии Беларуси',
    description: 'Телеграм группы по генеалогии Беларуси',
};

export default async function Home() {

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Link href="/uezdy">Уезды Беларуси (Генеалогия Беларуси)</Link>
            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
