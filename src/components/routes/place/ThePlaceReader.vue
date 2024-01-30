<script setup>
import { useGlobalState } from '../../../js/store'
import { computed } from 'vue'
import blocks_image from '../../blocks/image.vue'
import blocks_text from '../../blocks/text.vue'
import blocks_quelle from '../../blocks/quelle.vue'
import { useRoute } from 'vue-router'
import { useCmsStore } from '../../../js/cmsStore'
import ALinkPersonButtons from '../ar/ALinkPersonButtons.vue'

const components = {
  image: blocks_image,
  text: blocks_text,
  quelle: blocks_quelle
}

const cmsStore = useCmsStore()
const place = computed(() => {
  return cmsStore.getPlacesBySubID(globalStore.activePlace)
})

const globalStore = useGlobalState()
const placeID = computed(() => {
  return globalStore.activePlace
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="place" :key="place.id">
      <ALinkPersonButtons :placeID="placeID" />

      <div class="singlePanel">
        <component
          v-for="block in place.blocks"
          :is="components[block.type]"
          :key="block.id"
          :content="block"
        />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.linkedPersons {
  padding: 0.5rem 1rem;
}

.singlePanel {
  margin-top: 2rem;
  overflow: hidden;
  border-radius: 0.9375rem;
  padding-bottom: 1rem;
  background: rgba(255, 255, 255, 0.4);
}
</style>
