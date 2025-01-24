import styles from "./page.module.css";
import {Metadata} from "next";
import React from "react";
import TopicsMenu from "@/app/components/TopicsMenu";
import {messages} from "@/app/services/service.data";

export const metadata: Metadata = {
    title: "Уезды Беларуси (Генеалогия Беларуси)",
    description: `Группа для общения на тему генеалогии Беларуси. Обмен опытом, поиск совета и помощи. При вступлении рекомендуется назвать ваши искомые уезды, чтобы найти единомышленников по вашим местам.`,
};


export default async function Home() {

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <TopicsMenu messages={messages}/>
            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
