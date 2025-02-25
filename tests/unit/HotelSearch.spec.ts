import {
  normalizeText,
  clearSearch,
  SearchState,
  filterHotelsByDestination,
  filterDestinations,
  FilterDestinationsState,
} from '@/utils/hotelSearch'
import { getStarRating, getAmenityIcon } from '@/utils/hotelDisplay'
import { ref } from 'vue'
import { initializePagination, onLoadMore } from '@/utils/hotelPagination'
import type { Destination, Hotel } from '@/components/models'

describe('clearSearch', () => {
  test('clearSearch resets the search state', () => {
    const destination = ref('São Paulo')
    const selectedDestination = ref<Destination | null>({
      placeId: '1',
      name: 'São Paulo',
      state: { shortname: 'SP', name: 'São Paulo' },
    })
    const filteredDestinations = ref<Destination[]>([
      { placeId: '1', name: 'São Paulo', state: { shortname: 'SP', name: 'São Paulo' } },
    ])
    const mockHotel: Hotel = {
      id: 1,
      name: 'Hotel Exemplo',
      description: 'Um hotel de teste',
      stars: 4,
      price: 100,
      address: {
        fullAddress: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
      },
      thumb: 'https://via.placeholder.com/150',
      images: ['https://via.placeholder.com/300'],
    }
    const filteredHotels = ref<Hotel[]>([mockHotel])
    const valid = ref(true)
    const showSuggestions = ref(true)
    const currentHotel = ref<Hotel | null>(mockHotel)
    const noResults = ref(true)

    const state: SearchState = {
      destination,
      selectedDestination,
      filteredDestinations,
      filteredHotels,
      valid,
      showSuggestions,
      currentHotel,
      noResults,
    }

    clearSearch(state)

    expect(destination.value).toBe('')
    expect(selectedDestination.value).toBeNull()
    expect(filteredDestinations.value).toEqual([])
    expect(filteredHotels.value).toEqual([])
    expect(valid.value).toBe(false)
    expect(showSuggestions.value).toBe(false)
    expect(currentHotel.value).toBeNull()
    expect(noResults.value).toBe(false)
  })
})

describe('normalizeText', () => {
  test('normalizeText removes accents and lowercases text', () => {
    expect(normalizeText('São Paulo')).toBe('sao paulo')
  })
})

const mockHotel2: Hotel = {
  id: 2,
  name: 'Hotel Exemplo 2',
  description: 'Descrição 2',
  stars: 5,
  price: 200,
  address: {
    fullAddress: 'Outra rua, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  thumb: 'https://via.placeholder.com/150',
  images: ['https://via.placeholder.com/300'],
}

const mockHotel1: Hotel = {
  id: 1,
  name: 'Hotel Exemplo 1',
  description: 'Descrição 1',
  stars: 4,
  price: 100,
  address: {
    fullAddress: 'Rua Exemplo, 123',
    city: 'São Paulo',
    state: 'SP',
  },
  thumb: 'https://via.placeholder.com/150',
  images: ['https://via.placeholder.com/300'],
}

const mockDestination: Destination = {
  placeId: '1',
  name: 'São Paulo',
  state: { shortname: 'SP', name: 'São Paulo' },
}

describe('filterHotelsByDestination', () => {
  test('filterHotelsByDestination returns only hotels from the specified destination', () => {
    const hotels: Hotel[] = [mockHotel1, mockHotel2]
    const filtered = filterHotelsByDestination(hotels, mockDestination)
    expect(filtered).toEqual([mockHotel1])
  })
})

describe('filterDestinations', () => {
  test('filterDestinations filters destinations based on input', () => {
    const destination = ref('')
    const destinations = ref<Destination[]>([
      { placeId: '1', name: 'São Paulo', state: { shortname: 'SP', name: 'São Paulo' } },
      { placeId: '2', name: 'Rio de Janeiro', state: { shortname: 'RJ', name: 'Rio de Janeiro' } },
      { placeId: '3', name: 'Santos', state: { shortname: 'SP', name: 'Santos' } },
    ])
    const filteredDestinations = ref<Destination[]>([])
    const showSuggestions = ref(false)

    const state: FilterDestinationsState = {
      destination,
      destinations,
      filteredDestinations,
      showSuggestions,
    }

    filterDestinations('São', state)
    expect(destination.value).toBe('São')
    expect(showSuggestions.value).toBe(true)
    expect(filteredDestinations.value).toEqual([
      { placeId: '1', name: 'São Paulo', state: { shortname: 'SP', name: 'São Paulo' } },
    ])

    filterDestinations('', state)
    expect(destination.value).toBe('')
    expect(showSuggestions.value).toBe(false)
    expect(filteredDestinations.value).toEqual([])
  })
})

const mockHotels: Hotel[] = [
  {
    id: 1,
    name: 'Hotel 1',
    description: 'Descrição 1',
    stars: 4,
    price: 100,
    address: {
      fullAddress: 'Rua 1, 123',
      city: 'Cidade A',
      state: 'Estado A',
    },
    thumb: 'https://via.placeholder.com/150',
    images: ['https://via.placeholder.com/300'],
  },
  {
    id: 2,
    name: 'Hotel 2',
    description: 'Descrição 2',
    stars: 5,
    price: 150,
    address: {
      fullAddress: 'Rua 2, 456',
      city: 'Cidade A',
      state: 'Estado A',
    },
    thumb: 'https://via.placeholder.com/150',
    images: ['https://via.placeholder.com/300'],
  },
  {
    id: 3,
    name: 'Hotel 3',
    description: 'Descrição 3',
    stars: 3,
    price: 80,
    address: {
      fullAddress: 'Rua 3, 789',
      city: 'Cidade A',
      state: 'Estado A',
    },
    thumb: 'https://via.placeholder.com/150',
    images: ['https://via.placeholder.com/300'],
  },
  {
    id: 4,
    name: 'Hotel 4',
    description: 'Descrição 4',
    stars: 4,
    price: 120,
    address: {
      fullAddress: 'Rua 4, 101',
      city: 'Cidade A',
      state: 'Estado A',
    },
    thumb: 'https://via.placeholder.com/150',
    images: ['https://via.placeholder.com/300'],
  },
]

describe('initializePagination', () => {
  test('should set currentPage to 0, paginatedHotels with first itemsPerPage and hasMoreItems correctly', () => {
    const filteredHotels = ref(mockHotels)
    const paginatedHotels = ref<Hotel[]>([])
    const currentPage = ref(5)
    const hasMoreItems = ref(false)
    const itemsPerPage = 2

    initializePagination(filteredHotels, paginatedHotels, currentPage, itemsPerPage, hasMoreItems)

    expect(currentPage.value).toBe(0)
    expect(paginatedHotels.value).toEqual(mockHotels.slice(0, itemsPerPage))
    expect(hasMoreItems.value).toBe(mockHotels.length > itemsPerPage)
  })
})

describe('onLoadMore', () => {
  test('should load the next hotels page if there are items', (done) => {
    const filteredHotels = ref(mockHotels)
    const paginatedHotels = ref<Hotel[]>(mockHotels.slice(0, 2))
    const currentPage = ref(0)
    const hasMoreItems = ref(true)
    const itemsPerPage = 2

    onLoadMore(filteredHotels, paginatedHotels, currentPage, itemsPerPage, hasMoreItems, (stop) => {
      expect(currentPage.value).toBe(1)
      expect(paginatedHotels.value).toEqual(mockHotels.slice(0, 4))
      expect(hasMoreItems.value).toBe(mockHotels.length > paginatedHotels.value.length)
      done()
    })
  })

  test('must set hasMoreItems to false if there are no more items', (done) => {
    const smallHotels = mockHotels.slice(0, 3)
    const filteredHotels = ref(smallHotels)
    const paginatedHotels = ref<Hotel[]>(smallHotels) // Todos os itens já foram carregados
    const currentPage = ref(0)
    const hasMoreItems = ref(true)
    const itemsPerPage = 2

    onLoadMore(filteredHotels, paginatedHotels, currentPage, itemsPerPage, hasMoreItems, (stop) => {
      expect(hasMoreItems.value).toBe(false)
      done()
    })
  })
})

describe('getStarRating', () => {
  it('must return the correct number of stars, with a maximum of 5', () => {
    expect(getStarRating(3)).toBe('⭐⭐⭐')
    expect(getStarRating(5)).toBe('⭐⭐⭐⭐⭐')
    expect(getStarRating(6)).toBe('⭐⭐⭐⭐⭐') // máximo 5
    expect(getStarRating(0)).toBe('')
  })
})

describe('getAmenityIcon', () => {
  it('should return the correct icon for known keys', () => {
    expect(getAmenityIcon('WI_FI')).toBe('wifi')
    expect(getAmenityIcon('ROOM_SERVICE')).toBe('local_hotel')
  })

  it('should return "help_outline" for unknown keys', () => {
    expect(getAmenityIcon('DESCONHECIDO')).toBe('help_outline')
  })
})
