<template>
  <div class="q-pa-md">
    <HotelSearch />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HotelSearch from 'src/components/HotelSearch.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    HotelSearch,
  },
})
</script>

<style scoped></style>
