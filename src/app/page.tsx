import {Metadata} from "next";
import React from "react";
import styles from "@/app/page.module.css";
import {aboutTopics} from "@/app/services/service.data";
import GroupsMenu from "@/app/components/GroupsMenu";

export const metadata: Metadata = {
    title: 'Генеалогии Беларуси',
    description: 'Телеграм группы по генеалогии Беларуси',
};

export default async function Home() {

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <GroupsMenu groupsList={Object.values(aboutTopics)} />
            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
