import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadThoughtsP1 } from './loadThoughts'

describe('loadThoughtsP1', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('fetches and returns the thoughts array', async () => {
    const mock = [
      {
        id: 'test-1',
        emoji: '🌊',
        nameZh: '测试',
        nameEn: 'Test',
        philosopher: '某人',
        year: -500,
        location: { lat: 0, lng: 0, placeName: 'X' },
        shortDescription: '描述。'
      }
    ]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mock
    }))

    const result = await loadThoughtsP1()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('test-1')
    expect(result[0].emoji).toBe('🌊')
  })

  it('throws when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    await expect(loadThoughtsP1()).rejects.toThrow(/404/)
  })
})
