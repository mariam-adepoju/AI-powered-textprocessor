import styles from "./header.module.css";
export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.nav}>
        <h1 className={styles.title}>Text Processor</h1>
        <p>Detect language,translate and summarize </p>
      </div>
    </div>
  );
}
