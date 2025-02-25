// src/utils/hotelSearch.ts
import type { Ref } from 'vue'
import type { Destination, Hotel } from '@/components/models'

export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export interface SearchState {
  destination: Ref<string>
  selectedDestination: Ref<Destination | null>
  filteredDestinations: Ref<Destination[]>
  filteredHotels: Ref<Hotel[]>
  valid: Ref<boolean>
  showSuggestions: Ref<boolean>
  currentHotel: Ref<Hotel | null>
  noResults: Ref<boolean>
}

export const clearSearch = (state: SearchState): void => {
  state.destination.value = ''
  state.selectedDestination.value = null
  state.filteredDestinations.value = []
  state.filteredHotels.value = []
  state.valid.value = false
  state.showSuggestions.value = false
  state.currentHotel.value = null
  state.noResults.value = false
}

/**
 * Filtra os hotéis que pertencem à cidade do destino.
 * @param hotels - Lista de hotéis
 * @param destination - Objeto do tipo Destination
 * @returns Array de hotéis filtrados
 */
export function filterHotelsByDestination(hotels: Hotel[], destination: Destination): Hotel[] {
  return hotels.filter(
    (hotel: Hotel) => normalizeText(hotel.address.city) === normalizeText(destination.name),
  )
}

// Interface para agrupar os refs necessários para filtrar destinos
export interface FilterDestinationsState {
  destination: Ref<string>
  destinations: Ref<Destination[]>
  filteredDestinations: Ref<Destination[]>
  showSuggestions: Ref<boolean>
}

export const filterDestinations = (
  value: string | number | null,
  state: FilterDestinationsState,
): void => {
  state.destination.value = value !== null ? String(value) : ''
  if (state.destination.value) {
    state.filteredDestinations.value = state.destinations.value.filter((item) =>
      normalizeText(item.name).includes(normalizeText(state.destination.value)),
    )
    state.showSuggestions.value = true
  } else {
    state.filteredDestinations.value = []
    state.showSuggestions.value = false
  }
}
