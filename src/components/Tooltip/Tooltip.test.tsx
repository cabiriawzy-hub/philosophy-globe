import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGlobeStore } from '@/state/useStore'
import Tooltip from './Tooltip'

describe('Tooltip', () => {
  beforeEach(() => {
    useGlobeStore.setState({ hoveredThought: null })
  })

  it('renders nothing when no thought is hovered', () => {
    render(<Tooltip />)
    expect(screen.queryByTestId('tooltip')).toBeNull()
  })

  it('shows thought name, philosopher, and year when hovered', () => {
    useGlobeStore.setState({
      hoveredThought: {
        id: 't',
        emoji: '🌊',
        nameZh: '万物流变',
        nameEn: 'Flux',
        philosopher: '赫拉克利特',
        year: -500,
        location: { lat: 0, lng: 0, placeName: '以弗所' },
        shortDescription: '人不能两次踏入同一条河。'
      }
    })
    render(<Tooltip />)
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    expect(screen.getByText('万物流变')).toBeInTheDocument()
    expect(screen.getByText(/赫拉克利特/)).toBeInTheDocument()
    expect(screen.getByText(/-500|公元前 500/)).toBeInTheDocument()
  })

  it('formats BCE years as "公元前 N"', () => {
    useGlobeStore.setState({
      hoveredThought: {
        id: 't',
        emoji: '🏛️',
        nameZh: '理念论',
        nameEn: 'Forms',
        philosopher: '柏拉图',
        year: -380,
        location: { lat: 0, lng: 0, placeName: '' },
        shortDescription: ''
      }
    })
    render(<Tooltip />)
    expect(screen.getByText(/公元前 380/)).toBeInTheDocument()
  })
})
