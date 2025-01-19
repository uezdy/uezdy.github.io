import styles from "./page.module.css";
import Link from "next/link";

const getData = async () => {
    const response = await fetch("/result.json", {
        cache: "no-cache",
    });
    return await response.json();
};

export default async function Home() {
    const data = await getData();
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
