export interface ThoughtP1 {
  id: string
  emoji: string
  nameZh: string
  nameEn: string
  philosopher: string
  year: number
  location: {
    lat: number
    lng: number
    placeName: string
  }
  shortDescription: string
}
