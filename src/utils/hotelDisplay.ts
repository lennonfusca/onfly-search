// src/utils/hotelDisplay.ts

/**
 * Retorna uma string com a quantidade de estrelas (máximo 5) representada por emojis.
 * @param stars Número de estrelas
 * @returns Uma string com as estrelas, por exemplo, '⭐⭐⭐'
 */
export function getStarRating(stars: number): string {
  const numStars = Math.floor(Number(stars))
  return '⭐'.repeat(numStars > 5 ? 5 : numStars)
}

/**
 * Retorna o ícone correspondente à chave do amenity.
 * @param key Chave do amenity
 * @returns O nome do ícone correspondente ou 'help_outline' se não encontrado.
 */
export function getAmenityIcon(key: string): string {
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
}
