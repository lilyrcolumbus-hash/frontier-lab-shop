export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  role: 'user' | 'admin'
  locale: 'en' | 'es'
  createdAt: Date
}

export interface GrowJournalEntry {
  id: string
  userId: string
  species: string
  speciesSlug: string
  method: string
  substrate: string
  startDate: Date
  notes: string
  status: 'inoculated' | 'colonizing' | 'pinning' | 'fruiting' | 'harvested'
  photos: string[]
  createdAt: Date
  updatedAt: Date
}
