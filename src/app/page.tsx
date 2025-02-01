import {Metadata} from "next";
import React from "react";
import styles from "@/app/page.module.css";
import {aboutGroups} from "@/app/services/service.data";
import GroupsMenu from "@/app/components/GroupsMenu";

export const metadata: Metadata = {
    title: 'Генеалогии Беларуси',
    description: 'Телеграм группы по генеалогии Беларуси',
    icons: [
        {
            url: '/favicon.svg',
            type: 'image/svg+xml',
            sizes: 'any',
            rel: 'icon'
        }
    ],
    keywords: ['Беларусь', 'генеалогия', 'поиск', 'губерния', 'уезд'],
    referrer: 'origin',
    robots: { index: true, follow: true }
};

export default async function Home() {

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <GroupsMenu groupsList={Object.values(aboutGroups)} />
            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
