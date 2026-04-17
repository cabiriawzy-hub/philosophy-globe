import { useEffect, useState } from 'react'
import type { ThoughtP1 } from '@/types/thought'
import { loadThoughtsP1 } from '@/data/loadThoughts'
import Globe from '@/components/Globe/Globe'
import Tooltip from '@/components/Tooltip/Tooltip'
import styles from './App.module.css'

export default function App() {
  const [thoughts, setThoughts] = useState<ThoughtP1[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    loadThoughtsP1()
      .then(setThoughts)
      .catch((err: Error) => setLoadError(err.message))
  }, [])

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (loadError) {
    return (
      <div className={styles.error}>
        数据加载失败：{loadError}
      </div>
    )
  }

  if (thoughts.length === 0) {
    return <div className={styles.loading}>加载思想宇宙中…</div>
  }

  return (
    <div className={styles.app}>
      <Globe thoughts={thoughts} width={size.width} height={size.height} />
      <Tooltip />
      <header className={styles.header}>
        <h1 className={styles.title}>
          哲学思想宇宙
          <span className={styles.subtitle}>
            {thoughts.length} 思想 · 轴心时代起步
          </span>
        </h1>
      </header>
      <footer className={styles.footer}>
        P1 骨架 · 数据源：自生成 · 地球：react-globe.gl
      </footer>
    </div>
  )
}
