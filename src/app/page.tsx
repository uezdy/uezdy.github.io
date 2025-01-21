import styles from "./page.module.css";
import { promises as fs } from 'fs';
import * as path from 'path';
import {Metadata} from "next";
import Message from "@/app/components/Message";

const pathJSON = path.join('public/result.json');
const file = await fs.readFile(pathJSON, 'utf8');
const data = JSON.parse(file);

export const metadata: Metadata = {
    title: "Уезды Беларуси (Генеалогия Беларуси)",
    description: `Группа для общения на тему генеалогии Беларуси. Обмен опытом, поиск совета и помощи. При вступлении рекомендуется назвать ваши искомые уезды, чтобы найти единомышленников по вашим местам.`,
};


export default async function Home() {

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {
                    data.messages.map((msg: any) => {
                       return msg.text ? <Message key={msg.id} msg={msg} /> : <></>
                    })
                }


            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
