<script setup>
import { useCmsStore } from '../../../js/cmsStore'
import { useRoute, useRouter } from 'vue-router'

const cms = useCmsStore()

const route = useRoute()
const router = useRouter()

function doShiftRight() {
  shift(-1)
}

function doShiftLeft() {
  shift(1)
}

function shift(value) {
  if (route.params.id === undefined) {
    return
  }
  const activePlace = route.params.id

  const index = cms.mappedPlaces.findIndex((place) => {
    return place.id === activePlace
  })

  const newIndex = mod(index + value, cms.mappedPlaces.length)
  const newPlace = cms.mappedPlaces[newIndex].id

  router.push({ name: 'place', params: { id: newPlace } })
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
  background: rgba(255, 255, 255, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}
.pre {
  transform: rotate(180deg);
}
</style>
