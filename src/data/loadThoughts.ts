import type { ThoughtP1 } from '@/types/thought'

export async function loadThoughtsP1(): Promise<ThoughtP1[]> {
  const response = await fetch('/data/thoughts-p1.json')
  if (!response.ok) {
    throw new Error(`Failed to load thoughts: ${response.status}`)
  }
  return response.json() as Promise<ThoughtP1[]>
}
