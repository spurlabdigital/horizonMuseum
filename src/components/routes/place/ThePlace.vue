<script setup>
import { useGlobalState } from '../../../js/store'
import { computed, onBeforeMount, ref } from 'vue'
import blocks_image from '../../blocks/image.vue'
import blocks_text from '../../blocks/text.vue'
import blocks_quelle from '../../blocks/quelle.vue'
import AHeader from '../../base/ATextPanelHeader.vue'
import { calcDistance } from '../../../threejs/vvv/geoHelper'
import { useRoute } from 'vue-router'
import { useCmsStore } from '../../../js/cmsStore'
import MapboxBoxPlace from './ThePlaceMapbox.vue'
import ALinkPersonButtons from '../ar/ALinkPersonButtons.vue'
import ThePlaceSwitch from './ThePlaceSwitch.vue'

const components = {
  image: blocks_image,
  text: blocks_text,
  quelle: blocks_quelle
}

const route = useRoute()
const cmsStore = useCmsStore()
const place = computed(() => {
  return cmsStore.getPlacesBySubID(route.params.id)
})

const globalStore = useGlobalState()

const distance = computed(() => {
  const distance = calcDistance(
    place.value.location.lat,
    place.value.location.lon,
    globalStore.gps.latitude,
    globalStore.gps.longitude
  )
  return distance.toFixed(0) + ' km entfernt'
})

const arLink = computed(() => {
  return {
    name: 'horizon-place',
    params: { id: place.value.id.split('/').pop() }
  }
})

const lonLat = computed(() => {
  return {
    lat: Number(place.value.location.lat),
    lon: Number(place.value.location.lon)
  }
})
const routeName = computed(() => route.fullPath.split('/').pop())
</script>

<template>
  <div v-if="place" class="PersonPanel">
    <AHeader :subline="distance" :headline="place.name" :link="arLink" />
    <ThePlaceSwitch />
    <ALinkPersonButtons :placeID="place.id.split('/').pop()" />
    <MapboxBoxPlace :lat="lonLat.lat" :long="lonLat.lon" :mapName="routeName" />

    <div class="singlePanel">
      <component
        v-for="block in place.blocks"
        :is="components[block.type]"
        :key="block.id"
        :content="block"
      />
    </div>
  </div>
</template>

<style scoped>
.linkedPersons {
  padding: 0.5rem 1rem;
}

.PersonPanel {
  background: rgba(207, 199, 196, 1);
}
.singlePanel {
  margin-top: 1rem;
  overflow: hidden;
  border-radius: 0.9375rem;
  padding-bottom: 1rem;
  background: rgba(255, 255, 255, 0.4);
}
</style>
