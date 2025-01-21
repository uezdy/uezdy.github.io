import styles from "./page.module.css";
import {promises as fs} from 'fs';
import * as path from 'path';
import {Metadata} from "next";
import Message from "@/app/components/Message";
import React from "react";
import TopicsMenu from "@/app/components/TopicsMenu";

const pathJSON = path.join('public/result.json');
const file = await fs.readFile(pathJSON, 'utf8');
const data = JSON.parse(file);

export const metadata: Metadata = {
    title: "Уезды Беларуси (Генеалогия Беларуси)",
    description: `Группа для общения на тему генеалогии Беларуси. Обмен опытом, поиск совета и помощи. При вступлении рекомендуется назвать ваши искомые уезды, чтобы найти единомышленников по вашим местам.`,
};


export default async function Home() {
    const topics: any = [];

    return (
        <div className={styles.page}>
            <TopicsMenu topics={topics} />
            <main className={styles.main}>
                {
                    data.messages.map((msg: any) => {
                        if (msg.action === 'topic_created') {
                            topics.push(msg);
                        }
                        return msg.text ? <Message key={msg.id} msg={msg}/> : <></>
                    })
                }


            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
