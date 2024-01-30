<script setup>
import { useCmsStore } from '../../../js/cmsStore'
import { onMounted, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import 'mapbox-gl/dist/mapbox-gl.css'
import PlacesMapboxPlacePanel from '../places/PlacesMapboxPlacePanel.vue'
import { useRoute } from 'vue-router'

// console.log('mapboxConfig', mapboxConfig)
mapboxgl.accessToken = globalSettings.mapbox.token

const cmsStore = useCmsStore()
const activePlace = ref(cmsStore.getPlaces[0])

const places = cmsStore.getPlaces
const locationsGeodata = []

const geojson = {
  type: 'FeatureCollection',
  features: []
}

for (let place of places) {
  locationsGeodata.push(place)
  const feature = {
    type: 'Feature',
    properties: {
      description: place.name,
      icon: 'marker'
    },
    geometry: {
      type: 'Point',
      coordinates: [place.location.lon, place.location.lat]
    }
  }
  geojson.features.push(feature)
}

let map = null

onMounted(() => {
  map = new mapboxgl.Map({
    container: 'MapPlaces',
    style: globalSettings.mapbox.darkmode,
    center: [13.25, 53.0],
    zoom: 6 // starting zoom
  })

  window.map = map.on('load', () => {
    for (const location of locationsGeodata) {
      const el = document.createElement('div')
      el.className = ''
      el.innerHTML = ''
      el.style.padding = '1rem'
      el.innerHTML = `<div class="MapBoxDot" />`
      el.addEventListener('click', () => {
        activePlace.value = location
        map.flyTo({
          center: [location.location.lon, location.location.lat],
          zoom: 8,
          speed: 0.75
        })
      })
      new mapboxgl.Marker(el)
        .setLngLat([location.location.lon, location.location.lat])
        .addTo(map)
    }
    map.resize()
  })
})

function resetActivePlace() {
  activePlace.value = null
}

function getPlace(step) {
  const places = cmsStore.getPlaces
  const index = places.findIndex((place) => {
    return place.id === activePlace.value.id
  })

  const newIndex = mod(index + step, places.length)
  activePlace.value = places[newIndex]

  const lonLat = [
    activePlace.value.location.lon,
    activePlace.value.location.lat
  ]
  map.flyTo({
    center: lonLat,
    zoom: 8,
    speed: 0.75
  })
}

function mod(n, m) {
  return ((n % m) + m) % m
}

const route = useRoute()
watch(
  () => route.name,
  (newVal) => {
    if (newVal === 'map') {
      setTimeout(() => {
        map.resize()
      }, 10)
    }
  }
)
</script>

<template>
  <div class="MapBoxTile">
    <div id="MapPlaces"></div>
    <PlacesMapboxPlacePanel
      :content="activePlace"
      @close="resetActivePlace"
      @onNext="getPlace(1)"
      @onPrev="getPlace(-1)"
    />
    <div class="overlay" />
  </div>
</template>

<style>
.MapBoxTile {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}
#MapPlaces {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}

.MapBoxDot {
  cursor: pointer;
  background-color: #ff7700;
  border: 3px solid white;
  border-radius: 50%;
  width: 0.9rem;
  height: 0.9rem;
  text-align: center;
  color: white;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 0.9rem;
  padding-top: 0.2rem;
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
