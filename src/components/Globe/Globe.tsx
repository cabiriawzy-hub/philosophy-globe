import { useEffect, useRef } from 'react'
import GlobeGL, { type GlobeMethods } from 'react-globe.gl'
import type { ThoughtP1 } from '@/types/thought'
import { useGlobeStore } from '@/state/useStore'
import styles from './Globe.module.css'

interface GlobeProps {
  thoughts: ThoughtP1[]
  width: number
  height: number
}

export default function Globe({ thoughts, width, height }: GlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const setHovered = useGlobeStore((s) => s.setHovered)

  useEffect(() => {
    if (!globeRef.current) return
    globeRef.current.pointOfView({ lat: 25, lng: 60, altitude: 2.2 }, 0)
    const controls = globeRef.current.controls() as {
      autoRotate: boolean
      autoRotateSpeed: number
    }
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.3
  }, [])

  return (
    <div className={styles.container}>
      <GlobeGL
        ref={globeRef}
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgAAIAAAUAAen63NgAAAAASUVORK5CYII="
        showAtmosphere={true}
        atmosphereColor="#6aa9ff"
        atmosphereAltitude={0.18}
        htmlElementsData={thoughts}
        htmlLat={(d: object) => (d as ThoughtP1).location.lat}
        htmlLng={(d: object) => (d as ThoughtP1).location.lng}
        htmlAltitude={0.01}
        htmlElement={(d: object) => {
          const t = d as ThoughtP1
          const el = document.createElement('div')
          el.textContent = t.emoji
          el.style.fontSize = '20px'
          el.style.filter = 'drop-shadow(0 0 6px rgba(106,169,255,0.6))'
          el.style.cursor = 'pointer'
          el.style.pointerEvents = 'auto'
          el.style.transition = 'transform 0.15s, filter 0.15s'
          el.onmouseenter = () => {
            setHovered(t)
            el.style.transform = 'scale(1.4)'
            el.style.filter = 'drop-shadow(0 0 12px rgba(255,255,255,0.9))'
          }
          el.onmouseleave = () => {
            setHovered(null)
            el.style.transform = 'scale(1)'
            el.style.filter = 'drop-shadow(0 0 6px rgba(106,169,255,0.6))'
          }
          return el
        }}
      />
    </div>
  )
}
