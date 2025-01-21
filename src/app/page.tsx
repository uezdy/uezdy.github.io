import styles from "./page.module.css";
import { promises as fs } from 'fs';
import * as path from 'path';

export default async function Home() {
    const pathJSON = path.join('public/result.json');
    const file = await fs.readFile(pathJSON, 'utf8');
    const data = JSON.parse(file);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {data.messages.length}
            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
