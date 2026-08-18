import { usePortfolio } from '../../app/PortfolioContext';
import { flagshipWork } from '../../data/work';
import styles from './FeaturedWork.module.css';

export function FeaturedWork() {
  const { dispatch } = usePortfolio();

  return (
    <article className={styles.work}>
      <p className={styles.context}>{flagshipWork.context}</p>
      <h3 className={styles.title}>{flagshipWork.title}</h3>
      <p className={styles.result}>{flagshipWork.result}</p>
      <div className={styles.footer}>
        <button
          className={styles.workAction}
          type="button"
          onClick={() => dispatch({ type: 'OPEN_APP', appId: 'work' })}
        >
          View Work
        </button>
      </div>
    </article>
  );
}
