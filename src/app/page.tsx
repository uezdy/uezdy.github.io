import styles from "./page.module.css";
import {promises as fs} from 'fs';
import * as path from 'path';
import {Metadata} from "next";
import React from "react";
import TopicsMenu from "@/app/components/TopicsMenu";
import {TGMessage} from "@/app/components/types";

const messages: Array<TGMessage> = [];
const files = await fs.readdir(path.resolve('public/uezdy'), 'utf8')

files.forEach(async (file: any) => {
    const pathJSON = path.join('public/uezdy', file);
    const fileData = await fs.readFile(pathJSON, 'utf8');
    const data = JSON.parse(fileData);
    messages.push(...data);
});

export const metadata: Metadata = {
    title: "Уезды Беларуси (Генеалогия Беларуси)",
    description: `Группа для общения на тему генеалогии Беларуси. Обмен опытом, поиск совета и помощи. При вступлении рекомендуется назвать ваши искомые уезды, чтобы найти единомышленников по вашим местам.`,
};


export default async function Home() {
    const topics: any = [];

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
