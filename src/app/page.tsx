import styles from "./page.module.css";

export const dynamic = 'force-static';

export default async function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                0
            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
