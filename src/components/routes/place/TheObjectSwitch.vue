<script setup>
import { useCmsStore } from '../../../js/cmsStore'
import { useRoute, useRouter } from 'vue-router'
import { global } from 'three/nodes'
import { useGlobalState } from '../../../js/store'

const cms = useCmsStore()
const globalStore = useGlobalState()
const route = useRoute()
const router = useRouter()

function doShiftRight() {
  if (route.name === 'place') {
    shiftPlace(-1)
  } else {
    shiftPerson(-1)
  }
}

function doShiftLeft() {
  if (route.name === 'place') {
    shiftPlace(1)
  } else {
    shiftPerson(1)
  }
}

function shiftPlace(value) {
  const activePlace = globalStore.getActivePlace

  const index = cms.mappedPlaces.findIndex((place) => {
    return place.id === activePlace
  })

  const newIndex = mod(index + value, cms.mappedPlaces.length)
  const newPlace = cms.mappedPlaces[newIndex].id

  const event = new CustomEvent('gotoID', { detail: { id: newPlace } })
  window.dispatchEvent(event)
  router.push({ name: 'place', params: { id: newPlace } })
}

function shiftPerson(value) {
  const activePlace = globalStore.getActivePerson

  const index = cms.de.persons.findIndex((place) => {
    return place.id.split('/').pop() === activePlace
  })

  const newIndex = mod(index + value, cms.de.persons.length)
  const newPerson = cms.de.persons[newIndex].id.split('/').pop()

  globalStore.setActivePerson(newPerson)

  router.push({ name: 'person', params: { id: newPerson } })
}

function mod(n, m) {
  return ((n % m) + m) % m
}
</script>

<template>
  <div class="navButtons">
    <div class="navButton pre" @click="doShiftLeft">
      <img src="../../../assets/icons/arrow.svg" alt="pre" />
    </div>

    <div class="navButton" @click="doShiftRight">
      <img src="../../../assets/icons/arrow.svg" alt="pre" />
    </div>
  </div>
</template>

<style scoped>
.navButtons {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.navButton {
  height: 2rem;
  min-width: 3rem;
  padding: 0 2rem;
  border-radius: var(--buttonRadius);
  background: #ff9c7aab;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pre {
  transform: rotate(180deg);
}
</style>
