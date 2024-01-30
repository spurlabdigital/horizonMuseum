<script setup>
import RedPanel from '../../base/ARedPanel.vue'
import APanelHeader from '../../base/ARedPanelHeader.vue'
import { computed, ref, watch } from 'vue'
import { useGlobalState } from '../../../js/store'
import { useCmsStore } from '../../../js/cmsStore'
import ALinkPersonButtons from './ALinkPersonButtons.vue'
import { useRoute, useRouter } from 'vue-router'
import AViewMore from './AViewMore.vue'

const globalStore = useGlobalState()
const cms = useCmsStore()

const activePlaceID = computed(() => {
  return globalStore.activePlace
})

const activePanelContent = computed(() => {
  return cms.getPlacesByID('standorte/' + activePlaceID.value)
})

const distance = computed(() => {
  return (
    cms.mappedPlaces
      .find((place) => {
        return place.id === activePlaceID.value.split('/').pop()
      })
      .distance.toFixed(0) + ' km entfernt'
  )
})

function doShiftRight() {
  shift(-1)
}

function doShiftLeft() {
  shift(1)
}

function shift(value) {
  const index = cms.mappedPlaces.findIndex((place) => {
    return place.id === activePlaceID.value.split('/').pop()
  })

  const newIndex = mod(index + value, cms.mappedPlaces.length)
  const newPlace = cms.mappedPlaces[newIndex].id

  const event = new CustomEvent('gotoID', { detail: { id: newPlace } })
  window.dispatchEvent(event)
}

function mod(n, m) {
  return ((n % m) + m) % m
}

const route = useRoute()
const showSearchBox = computed(() => {
  return route.name === 'horizon'
})
</script>

<template>
  <transition name="fade">
    <RedPanel v-if="activePanelContent && showSearchBox" class="noCross">
      <transition name="fade" mode="out-in" style="--delay: 0s">
        <span class="distance" :key="distance">{{ distance }} </span>
      </transition>
      <transition name="fade" mode="out-in" style="--delay: 0.25s">
        <APanelHeader
          :key="activePanelContent.name"
          :text="activePanelContent.name"
          class="centerText"
        />
      </transition>
      <div class="navButtons">
        <div class="navButton pre" @click="doShiftLeft">
          <img src="../../../assets/icons/arrow.svg" alt="pre" />
        </div>
        <div class="navButton">
          <AViewMore :to="'/place/' + activePanelContent.id.split('/').pop()" />
        </div>

        <div class="navButton" @click="doShiftRight">
          <img src="../../../assets/icons/arrow.svg" alt="pre" />
        </div>
      </div>

      <ALinkPersonButtons
        :placeID="activePanelContent.id.split('/').pop()"
        link="person"
      />
    </RedPanel>
  </transition>
</template>

<style scoped>
.distance {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;

  /* Subheadline */
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.0525rem;
}

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

<style>
.noCross .closeIcon {
  display: none;
}

.centerText {
  text-align: center;
}
</style>
