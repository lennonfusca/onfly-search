import type { Ref } from 'vue'
import type { Hotel } from '@/components/models'

/**
 * Inicializa a paginação:
 * - Reseta a página atual para 0.
 * - Define os hotéis paginados como os primeiros `itemsPerPage` itens de `filteredHotels`.
 * - Define `hasMoreItems` como true se existirem mais itens.
 */
export function initializePagination(
  filteredHotels: Ref<Hotel[]>,
  paginatedHotels: Ref<Hotel[]>,
  currentPage: Ref<number>,
  itemsPerPage: number,
  hasMoreItems: Ref<boolean>,
): void {
  currentPage.value = 0
  paginatedHotels.value = filteredHotels.value.slice(0, itemsPerPage)
  hasMoreItems.value = filteredHotels.value.length > itemsPerPage
}

/**
 * Carrega mais hotéis (para paginação infinita).
 * - Calcula os próximos itens com base na página atual.
 * - Se houver itens, adiciona-os aos `paginatedHotels` e incrementa a página.
 * - Atualiza `hasMoreItems` de acordo com a quantidade total de hotéis.
 * - Chama a função `done` passando `true` se não houver mais itens.
 */
export function onLoadMore(
  filteredHotels: Ref<Hotel[]>,
  paginatedHotels: Ref<Hotel[]>,
  currentPage: Ref<number>,
  itemsPerPage: number,
  hasMoreItems: Ref<boolean>,
  done: (stop?: boolean) => void,
): void {
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
