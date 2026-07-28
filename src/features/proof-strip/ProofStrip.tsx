import styles from './ProofStrip.module.css';

const dimensions = [
  { label: 'Operating mode', value: 'Production-minded' },
  { label: 'Sweet spot', value: 'Systems + tooling' },
  { label: 'Working style', value: 'Clarity + ownership' },
  { label: 'Interface', value: 'Human-friendly' },
] as const;

export const ProofStrip = () => (
  <aside className={styles.strip} aria-label="Positioning summary">
    <dl className={styles.inner}>
      {dimensions.map((dimension) => (
        <div className={styles.item} key={dimension.label}>
          <dt>{dimension.label}</dt>
          <dd>{dimension.value}</dd>
        </div>
      ))}
    </dl>
  </aside>
);
