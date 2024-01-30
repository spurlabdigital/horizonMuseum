<script setup>
import { useCmsStore } from '../js/cmsStore'
import TheHeader from './TheHeader.vue'
import TheSidebar from './TheSidebar.vue'
import TheThreejsView from './routes/home/TheThreejs.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import TheMap from './routes/map/TheMap.vue'
import TheBiographies from './routes/biographies/TheBiographies.vue'
import ThePlacesList from './routes/places/ThePlacesList.vue'
import TheInfoList from './routes/info/TheInfoList.vue'
import TheInfo from './routes/info/TheInfo.vue'
import TheReadingPanel from './routes/readingPanel/TheReadingPanel.vue'
import TheArSearchBox from './routes/ar/TheArSearchBox.vue'
import TheHome from './routes/home/TheHome.vue'
import router from '../js/router'

const cmsStore = useCmsStore()
cmsStore.fetchData()

const route = useRoute()

const initTime = ref(true)
setTimeout(() => {
  initTime.value = false
}, 1000)

let lastInteraction = Date.now()

setInterval(() => {
  if (Date.now() - lastInteraction > 1000 * 60 * 5) {
    router.push({ name: 'Home' })
    lastInteraction = Date.now()
  }
}, 1000 * 60)

window.addEventListener('click', () => {
  lastInteraction = Date.now()
})

window.addEventListener('touchend', () => {
  lastInteraction = Date.now()
})

// const routeName = computed(() => route.fullPath)
//
// const showMap = computed(() => {
//   console.log(route.name === 'map')
//   if (initTime.value) return true
//   return route.name === 'map'
// })

const routeName = computed(() => route.name)
function showItem(name) {
  if (initTime.value) return true
  return routeName.value === name
}

const showReadingPanel = computed(() => {
  if (initTime.value) return true
  return routeName.value === 'person' || routeName.value === 'place'
})
</script>

<template>
  <template v-if="cmsStore.loaded">
    <router-view />
    <TheHeader />
    <TheThreejsView />
    <transition name="fade">
      <TheHome v-show="showItem('Home')" />
    </transition>

    <TheArSearchBox v-show="showItem('horizon')" />
    <TheReadingPanel v-show="showReadingPanel" />

    <transition name="fade">
      <TheInfoList v-show="showItem('infoList')" />
    </transition>
    <transition name="fade">
      <TheInfo v-show="showItem('info')" />
    </transition>
    <transition name="fade">
      <ThePlacesList v-show="showItem('places')" />
    </transition>
    <transition name="fade">
      <TheBiographies v-show="showItem('biographies')" />
    </transition>
    <transition name="fade">
      <TheMap v-show="showItem('map')" />
    </transition>
    <TheSidebar />
  </template>
</template>

<style scoped></style>
