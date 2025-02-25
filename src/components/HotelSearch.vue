<template>
  <q-layout>
    <q-page-container :class="{ 'drawer-open': drawer }">
      <q-page class="custom-bg q-pa-none" :class="{ 'drawer-openx': drawer }">
        <q-col :cols="12" class="q-mx-auto">
          <q-row>
            <q-col>
              <div class="title-div" data-test="title">Reservar hotel</div>
              <q-input
                :model-value="inputValue"
                label="Destino"
                placeholder="Digite o destino do hotel"
                outlined
                @update:model-value="filterDestinations"
                class="select"
              />
              <q-list v-if="showSuggestions" class="suggestions-list" fit>
                <q-item
                  v-for="(item, index) in filteredDestinations"
                  :key="index"
                  clickable
                  @click="selectDestination(item)"
                >
                  <q-item-section> {{ item.name }} - {{ item.state.shortname }} </q-item-section>
                </q-item>
              </q-list>

              <div class="botton-search">
                <q-btn
                  v-if="valid"
                  class="custom-position"
                  unelevated
                  rounded
                  color="primary"
                  label="Limpar busca"
                  @click="clearSearch"
                />
                <q-btn
                  v-else
                  class="custom-position"
                  unelevated
                  rounded
                  color="primary"
                  label=" Buscar hotel "
                  :disable="!inputValue.trim()"
                  @click="search"
                />
              </div>
            </q-col>
          </q-row>

          <q-btn-toggle
            v-model="selectedFilter"
            class="btn-toggle"
            color="#C0C0C0"
            text-color="black"
            toggle-color="blue"
            :options="[
              { label: 'Menor Preço', value: 'price' },
              { label: 'Melhor Avaliado', value: 'rating' },
            ]"
          />

          <div v-if="noResults" class="no-results-message" data-test="no-results">
            <q-icon name="hotel" size="lg" class="q-mb-sm" />
            <h3>Nenhum hotel encontrado</h3>
            <p>Não encontramos hotéis disponíveis para este destino.</p>
            <p>Tente ajustar sua busca ou verificar o nome digitado.</p>
          </div>

          <q-card v-if="paginatedHotels.length" class="q-mt-md gray-card">
            <q-card-section>
              <q-list>
                <section
                  v-for="(hotel, index) in paginatedHotels"
                  :key="index"
                  class="hotel-section"
                >
                  <q-card>
                    <q-card-section>
                      <q-item>
                        <q-item-section avatar>
                          <q-img
                            :src="hotel.thumb"
                            :alt="hotel.name"
                            width="350px"
                            height="250px"
                            @click="selectHotel(hotel)"
                          />
                        </q-item-section>

                        <q-item-section class="hotel-name-section">
                          <q-item-label class="hotel-name">{{ hotel.name }}</q-item-label>

                          <q-item-label class="hotel-adress"
                            >{{ hotel.address.fullAddress }} - {{ hotel.address.city }} -
                            {{ hotel.address.state }}</q-item-label
                          >
                          <q-item-label caption>
                            <div class="star-rating">
                              <b>{{ hotel.stars }}.0</b> {{ getStarRating(hotel.stars) }}
                              <span class="separator">|</span>
                              <span class="amenities-icons">
                                <q-icon
                                  v-for="(amenity, i) in hotel.amenities"
                                  :key="i"
                                  :name="getAmenityIcon(amenity.key)"
                                  size="15px"
                                  class="q-mx-xs"
                                />
                              </span>
                            </div>
                          </q-item-label>
                          <q-btn label="Reembolsável" class="btn-reem" />
                        </q-item-section>

                        <q-item-section side class="price-container">
                          <br />
                          <div>
                            <br />
                            <q-item-label caption>
                              <h3 class="text-h3">A partir de :</h3>
                              R$
                              <span class="price">{{ hotel.price }} </span>
                              {{ '/á noite' }}
                              <br />
                              <br />
                              {{ 'impostos inclusos' }}
                            </q-item-label>
                            <br />
                          </div>
                          <br />
                          <q-btn label="Selecionar" rounded color="primary" class="select-btn" />
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                  </q-card>
                </section>
              </q-list>

              <q-infinite-scroll @load="onLoadMore" :offset="250" :disable="!hasMoreItems">
                <template v-slot:loading>
                  <div class="row justify-center q-my-md">
                    <div v-if="hasMoreItems">
                      <q-spinner-dots color="primary" size="40px" />
                    </div>
                    <div v-else class="text-center text-grey q-py-md">
                      <h3>{{ 'Você chegou ao final! Não há mais hotéis para exibir 🏁' }}</h3>
                    </div>
                  </div>
                </template>
              </q-infinite-scroll>
            </q-card-section>
          </q-card>

          <q-drawer
            v-model="drawer"
            side="left"
            overlay
            behavior="mobile"
            content-class="q-pa-md"
            :width="600"
          >
            <div v-if="currentHotel">
              <q-btn flat icon="close" @click="closeDrawer" class="q-mb-md" />

              <div>
                <h4 class="text-name">{{ currentHotel.name }}</h4>
                <q-item-label class="adress-text"
                  >{{ hotel.address.fullAddress }} - {{ hotel.address.city }} -
                  {{ hotel.address.state }}</q-item-label
                >
                <br />
              </div>

              <q-carousel
                v-if="validImages.length > 0"
                v-model="slide"
                swipeable
                animated
                control-color="primary"
                navigation
                infinite
                autoplay
                :key="currentHotel.id"
              >
                <q-carousel-slide
                  v-for="(img, index) in validImages"
                  :key="index"
                  :name="index.toString()"
                  :img-src="img"
                />
              </q-carousel>

              <div class="star-text">{{ hotel.stars }}.0 {{ getStarRating(hotel.stars) }}</div>
              <p class="description-tx">{{ currentHotel.description }}</p>

              <div class="image-counter q-mt-sm">
                {{ Number(slide) + 1 }} / {{ validImages.length }}
              </div>
            </div>
          </q-drawer>
        </q-col>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue'
import type { Hotel, Destination } from './models'

export default defineComponent({
  name: 'HotelSearch',
  setup() {
    // Dados e estados existentes
    const destinations = ref<Destination[]>([])
    const hotels = ref<Hotel[]>([])
    const destination = ref('')
    const filteredDestinations = ref<Destination[]>([])
    const selectedDestination = ref<Destination | null>(null)
    const showSuggestions = ref(false)
    const filteredHotels = ref<Hotel[]>([])
    const slide = ref(0)
    const currentHotel = ref<Hotel | null>(null)
    const valid = ref(false)
    const selectedFilter = ref('price')
    const noResults = ref(false)
    const drawer = ref(false)
    const currentPage = ref(0)
    const itemsPerPage = 10
    const paginatedHotels = ref<Hotel[]>([])
    const hasMoreItems = ref(true)
    const hotel = ref({
      name: 'Hotel Exemplo',
      stars: 4,
      amenities: [{ key: 'wifi' }, { key: 'pool' }],
      address: {
        fullAddress: 'Rua Exemplo, 123',
        city: 'São Paulo',
        state: 'SP',
      },
    })

    const inputValue = computed(() => {
      if (selectedDestination.value) {
        return `${selectedDestination.value.name} - ${selectedDestination.value.state.shortname}`
      }
      return destination.value
    })

    // Computed que filtra imagens válidas
    const validImages = computed(() => {
      return currentHotel.value && currentHotel.value.images
        ? currentHotel.value.images.filter((img) => !!img)
        : []
    })

    const selectHotel = (hotel: Hotel) => {
      currentHotel.value = hotel
      console.log('Hotel selecionado:', hotel)
      slide.value = 0
      drawer.value = true
    }

    const initializePagination = () => {
      currentPage.value = 0
      paginatedHotels.value = filteredHotels.value.slice(0, itemsPerPage)
      hasMoreItems.value = filteredHotels.value.length > itemsPerPage
    }

    const onLoadMore = (index: number, done: (stop?: boolean) => void) => {
      setTimeout(() => {
        const startIndex = (currentPage.value + 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const nextItems = filteredHotels.value.slice(startIndex, endIndex)

        if (nextItems.length > 0) {
          paginatedHotels.value = [...paginatedHotels.value, ...nextItems]
          currentPage.value++
          hasMoreItems.value = filteredHotels.value.length > paginatedHotels.value.length
        } else {
          hasMoreItems.value = false
        }

        done(!hasMoreItems.value)
      }, 500)
    }

    watch(filteredHotels, () => {
      initializePagination()
    })

    const closeDrawer = () => {
      drawer.value = false
    }

    onMounted(async () => {
      try {
        const [placeResponse, hotelResponse] = await Promise.all([
          fetch('/data/place.json').then((res) => res.json()),
          fetch('/data/hotel.json').then((res) => res.json()),
        ])

        if (Array.isArray(hotelResponse)) {
          hotels.value = hotelResponse.reduce((acc, group) => {
            return acc.concat(group.hotels || [])
          }, [])
        } else {
          hotels.value = hotelResponse.hotels ?? []
        }

        filteredHotels.value = hotels.value
        destinations.value = placeResponse
        filteredDestinations.value = placeResponse
      } catch (error) {
        console.error('❌ Erro ao carregar os arquivos JSON:', error)
      }
    })

    const filterDestinations = (value: string | number | null) => {
      destination.value = value !== null ? String(value) : ''
      if (destination.value) {
        filteredDestinations.value = destinations.value.filter((item) =>
          normalizeText(item.name).includes(normalizeText(destination.value)),
        )
        showSuggestions.value = true
      } else {
        filteredDestinations.value = []
        showSuggestions.value = false
      }
    }

    const applyFilter = () => {
      if (selectedFilter.value === 'price') {
        filteredHotels.value = [...filteredHotels.value].sort((a, b) => a.price - b.price)
      } else if (selectedFilter.value === 'rating') {
        filteredHotels.value = [...filteredHotels.value].sort((a, b) => b.stars - a.stars)
      }
      initializePagination()
    }

    watch(selectedFilter, applyFilter)

    const selectDestination = (item: Destination) => {
      selectedDestination.value = item
      destination.value = item.name
      showSuggestions.value = false
    }

    const search = () => {
      noResults.value = false // Reseta o estado

      if (selectedDestination.value) {
        filterHotelsByDestination(selectedDestination.value)
        valid.value = true
        initializePagination()

        // Verifica se não encontrou resultados
        noResults.value = filteredHotels.value.length === 0
      } else {
        const foundDestination = destinations.value.find((item) => item.name === destination.value)
        if (foundDestination) {
          selectedDestination.value = foundDestination
          filterHotelsByDestination(foundDestination)

          // Verifica se não encontrou resultados
          noResults.value = filteredHotels.value.length === 0
        }
      }
    }

    const clearSearch = () => {
      destination.value = ''
      selectedDestination.value = null
      filteredDestinations.value = []
      filteredHotels.value = []
      valid.value = false
      showSuggestions.value = false
      currentHotel.value = null
      noResults.value = false
    }

    const normalizeText = (text: string): string => {
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
    }

    const filterHotelsByDestination = (destination: Destination) => {
      filteredHotels.value = hotels.value.filter(
        (hotel: Hotel) => normalizeText(hotel.address.city) === normalizeText(destination.name),
      )
      console.log('Hotéis filtrados:', filteredHotels.value)
    }

    return {
      destination,
      filteredDestinations,
      selectedDestination,
      showSuggestions,
      filterDestinations,
      selectDestination,
      search,
      filteredHotels,
      slide,
      currentHotel,
      selectHotel,
      inputValue,
      valid,
      selectedFilter,
      clearSearch,
      validImages,
      drawer,
      closeDrawer,
      hotel,
      noResults,
      paginatedHotels,
      hasMoreItems,
      onLoadMore,
    }
  },

  methods: {
    getStarRating(stars: number): string {
      const numStars = Math.floor(Number(stars))
      return '⭐'.repeat(numStars > 5 ? 5 : numStars)
    },
    getAmenityIcon(key: string) {
      const iconsMap: Record<string, string> = {
        WI_FI: 'wifi',
        RESTAURANT: 'restaurant',
        ROOM_SERVICE: 'local_hotel',
        PARKING: 'directions_car',
        MEETING_ROOM: 'meeting_room',
        LAUNDRY: 'local_laundry_service',
        PUB: 'local_bar',
        POOL: 'pool',
        AIR_CONDITIONING: 'ac_unit',
        PETS: 'pets',
        SAFE: 'security',
      }
      return iconsMap[key] || 'help_outline'
    },
  },
})
</script>
