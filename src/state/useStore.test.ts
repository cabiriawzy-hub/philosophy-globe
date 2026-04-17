import { describe, it, expect, beforeEach } from 'vitest'
import { useGlobeStore } from './useStore'

describe('useGlobeStore', () => {
  beforeEach(() => {
    useGlobeStore.setState({ hoveredThought: null })
  })

  it('starts with no hovered thought', () => {
    expect(useGlobeStore.getState().hoveredThought).toBeNull()
  })

  it('sets hovered thought', () => {
    const thought = {
      id: 'x',
      emoji: '🌊',
      nameZh: '测试',
      nameEn: 'Test',
      philosopher: '某人',
      year: -500,
      location: { lat: 0, lng: 0, placeName: 'X' },
      shortDescription: '描述'
    }
    useGlobeStore.getState().setHovered(thought)
    expect(useGlobeStore.getState().hoveredThought?.id).toBe('x')
  })

  it('clears hovered thought', () => {
    useGlobeStore.getState().setHovered({
      id: 'y',
      emoji: '🔥',
      nameZh: 'Y',
      nameEn: 'Y',
      philosopher: 'P',
      year: 0,
      location: { lat: 0, lng: 0, placeName: '' },
      shortDescription: ''
    })
    useGlobeStore.getState().setHovered(null)
    expect(useGlobeStore.getState().hoveredThought).toBeNull()
  })
})
