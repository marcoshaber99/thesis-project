import styles from "./Loading.module.css";
import { Spinner } from "./spinner";

export function Loading() {
  return (
    <div className={styles.loading}>
      <Spinner />
    </div>
  );
}
