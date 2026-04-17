import { useGlobeStore } from '@/state/useStore'
import styles from './Tooltip.module.css'

function formatYear(year: number): string {
  if (year < 0) return `公元前 ${Math.abs(year)}`
  return `公元 ${year}`
}

export default function Tooltip() {
  const thought = useGlobeStore((s) => s.hoveredThought)
  if (!thought) return null

  return (
    <div className={styles.tooltip} data-testid="tooltip">
      <span className={styles.emoji}>{thought.emoji}</span>
      <span className={styles.name}>{thought.nameZh}</span>
      <span className={styles.divider}>·</span>
      <span className={styles.meta}>{thought.philosopher}</span>
      <span className={styles.divider}>·</span>
      <span className={styles.meta}>{formatYear(thought.year)}</span>
    </div>
  )
}
