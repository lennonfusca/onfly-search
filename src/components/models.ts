export interface Destination {
  name: string
  state: { shortname: string; name: string }
  placeId: string
}

export interface Hotel {
  id: number // Adicione essa linha
  name: string
  description: string // Adicione essa linha
  address: {
    fullAddress: string
    city: string
    state: string
  }
  price: number
  stars: number
  thumb?: string
  images?: string[]
  // Outras propriedades que você precisar...
  amenities?: { key: string; label: string }[]
}
