import styles from "./page.module.css";
import {promises as fs} from 'fs';
import * as path from 'path';
import {Metadata} from "next";
import React from "react";
import TopicsMenu from "@/app/components/TopicsMenu";
import {TGMessage} from "@/app/components/types";

const pathJSON = path.join('public/uezdy/uezdy.json');
const file = await fs.readFile(pathJSON, 'utf8');
const messages: Array<TGMessage> = JSON.parse(file);

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
