<script setup>
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalState } from '../../js/store'
import { useCmsStore } from '../../js/cmsStore'
import TheObjectSwitch from '../routes/place/TheObjectSwitch.vue'
import ALinkPersonButtons from '../routes/ar/ALinkPersonButtons.vue'

const route = useRoute()
const mode = computed(() => {
  return route.name === 'place' ? 'place' : 'person'
})

const showHeadline = computed(() => {
  return route.name === 'place' || route.name === 'person'
})

const globalState = useGlobalState()
const person = computed(() => {
  return cmsStore.getPersonBySubID(globalState.activePerson)
})

const cmsStore = useCmsStore()

const place = computed(() => {
  return cmsStore.getPlacesBySubID(globalState.activePlace)
})

const distanceString = computed(() => {
  const distance = cmsStore.mappedPlaces.find((place) => {
    if (place.id === globalState.activePlace) {
      return place.distance
    }
  })

  if (distance) {
    return distance.distance.toFixed(0) + ' km entfernt'
  } else {
    return ''
  }
})

const headline = computed(() => {
  if (mode.value === 'place') {
    return place.value.name
  } else {
    return person.value.vorname + ' ' + person.value.nachname
  }
})

const subline = computed(() => {
  if (mode.value === 'place') {
    return distanceString.value
  } else {
    if (person.value.geburtsName) {
      return 'geb. ' + person.value.geburtsName
    } else {
      return ''
    }
  }
})
</script>

<template>
  <div class="Header" v-if="showHeadline">
    <RouterLink to="/horizon" class="CameraIcon">
      <img src="../../assets/icons/cross.svg" alt="camera" />
    </RouterLink>
    <div class="Headline">{{ headline }}</div>
    <div class="Subline">{{ subline }}</div>

    <TheObjectSwitch />
  </div>
</template>

<style scoped>
.Header {
  margin: -1rem -1rem 0 -1rem;
  padding: 8rem 1rem 1rem 1rem;
  height: 20rem;
  position: sticky;
  //background: rgba(207, 199, 196);
  text-align: center;
  top: -1rem;
  color: white;

  z-index: 10;
}

.CameraIcon {
  top: 2rem;
  left: 2rem;
  position: absolute;
  z-index: 1;
  pointer-events: all;
  width: 3rem;
  height: 3rem;
  right: 1rem;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
  border-radius: 50%;
  background: #ff9c7aab;
}
.CameraIcon img {
  width: 1rem;
  height: 1em;
  opacity: 0.8;
  margin-top: 1rem;
}

.Headline {
  //color: var(--middleGrey);
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 800;

  height: 6rem;
  display: grid;
  align-items: end;
  line-height: normal;
  letter-spacing: 0.065rem;
}

.Subline {
  font-size: 1.2rem;
  opacity: 0.3;
  margin-top: 0.5rem;
}
</style>
