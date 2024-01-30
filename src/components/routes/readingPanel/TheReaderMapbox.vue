<script setup>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { onMounted, watch } from 'vue'

import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxPlacesLayer from './placesLayer'
import MapboxPersonHistory from './personHistoryLayer'
import { useGlobalState } from '../../../js/store'
import { useCmsStore } from '../../../js/cmsStore'
import { useRoute } from 'vue-router'

const globaleState = useGlobalState()
const cmsStore = useCmsStore()
const route = useRoute()

mapboxgl.accessToken = globalSettings.mapbox.token

let map = null
const mapboxPlaceLayer = new MapboxPlacesLayer()
const mapboxPersonHistory = new MapboxPersonHistory()
const activePerson = globaleState.getActivePerson

onMounted(() => {
  map = new mapboxgl.Map({
    container: 'MapboxBocPlace',
    style: 'mapbox://styles/scicomlab/clnswek4x00ju01qqdhxocjkv',
    center: [13.25, 53.0],
    zoom: 6 // starting zoom,
  })
  map.on('load', () => {
    mapboxPlaceLayer.addMarker(map)
    if (activePerson) {
      mapboxPersonHistory.addLine(map, activePerson)
      mapboxPersonHistory.setupMarkerVisibility(map)
    }
  })
})

watch(
  () => globaleState.getActivePlace,
  (newVal) => {
    const place = cmsStore.mappedPlaces.find((place) => {
      return place.id === newVal
    })

    if (route.name === 'place' || route.name === 'horizon') {
      map.flyTo({
        center: [place.lon, place.lat],
        zoom: 10
      })
    }
  }
)

// watch(
//   () => globaleState.getActivePerson,
//   (activePerson) => {
//     if (activePerson) {
//       mapboxPersonHistory.addLine(map, activePerson)
//       mapboxPersonHistory.setupMarkerVisibility(map)
//       mapboxPersonHistory.fitBounds(map)
//     }
//   }
// )

window.addEventListener('setNewMapPos', (e) => {
  const place = cmsStore.mappedPlaces.find((place) => {
    return place.id === e.detail.id
  })

  map.flyTo({
    center: [place.lon, place.lat],
    zoom: 5
  })
})

watch(
  () => route.fullPath,
  (newVal) => {
    console.log(newVal)

    const name = route.name
    if (name === 'person' || name === 'place') {
      if (name === 'place') {
        const activePlace = globaleState.getActivePlace
        const place = cmsStore.mappedPlaces.find((place) => {
          return place.id === activePlace
        })

        map.flyTo({
          center: [place.lon, place.lat],
          zoom: 6
        })
      }

      if (name === 'person' && globaleState.getActivePerson) {
        mapboxPersonHistory.addLine(map, globaleState.getActivePerson)
        mapboxPersonHistory.setupMarkerVisibility(map)
        mapboxPersonHistory.fitBounds(map)
      }

      setTimeout(() => {
        map.resize()
      }, 10)
    }
  }
)
</script>

<template>
  <div class="container">
    <div id="MapboxBocPlace"></div>
    <div class="overlay"></div>
  </div>
</template>

<style>
.container {
  position: relative;
}
#MapboxBocPlace {
  height: 20rem;
  width: 100%;
  border-radius: var(--normalRadius);
  margin-top: 1rem;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 2rem;
  background: transparent;
  bottom: 0;
  right: 0;
  z-index: 10000;
}
</style>
