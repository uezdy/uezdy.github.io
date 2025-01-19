import styles from "./page.module.css";
import {MainPage} from "@/app/components/MainPage";

export default  function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <MainPage/>
            </main>
            <footer className={styles.footer}>

            </footer>
        </div>
    );
}
