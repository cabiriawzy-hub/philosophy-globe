import { create } from 'zustand'
import type { ThoughtP1 } from '@/types/thought'

interface GlobeStore {
  hoveredThought: ThoughtP1 | null
  setHovered: (thought: ThoughtP1 | null) => void
}

export const useGlobeStore = create<GlobeStore>((set) => ({
  hoveredThought: null,
  setHovered: (thought) => set({ hoveredThought: thought })
}))
