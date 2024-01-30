<script setup>
import { computed } from 'vue'
import RedPanel from '../../base/ARedPanel.vue'
import APanelHeader from '../../base/ARedPanelHeader.vue'
import ALinkPersonButtons from '../ar/ALinkPersonButtons.vue'
import AViewMore from '../ar/AViewMore.vue'
import { useCmsStore } from '../../../js/cmsStore'

const props = defineProps({
  content: Object
})

const cms = useCmsStore()

const placeID = computed(() => {
  return props.content.id.split('/').pop()
})

const distanceString = computed(() => {
  const distance = cms.mappedPlaces.find((place) => {
    if (place.id === placeID.value) {
      return place.distance
    }
  })

  if (distance) {
    return distance.distance.toFixed(0) + ' km entfernt'
  } else {
    return ''
  }
})

const emit = defineEmits(['onNext', 'onPrev'])

function next() {
  emit('onNext')
}

function prev() {
  emit('onPrev')
}
</script>

<template>
  <RedPanel v-if="props.content" class="noCross">
    <transition name="fade" mode="out-in" style="--delay: 0s">
      <span class="distance" :key="distanceString">{{ distanceString }} </span>
    </transition>
    <transition name="fade" mode="out-in" style="--delay: 0.25s">
      <APanelHeader
        :key="props.content.name"
        :text="props.content.name"
        class="centerText"
      />
    </transition>
    <div class="navButtons">
      <div class="navButton pre" @click="prev">
        <img src="../../../assets/icons/arrow.svg" alt="pre" />
      </div>
      <div class="navButton">
        <AViewMore :to="'/place/' + placeID" />
      </div>

      <div class="navButton" @click="next">
        <img src="../../../assets/icons/arrow.svg" alt="pre" />
      </div>
    </div>
    <ALinkPersonButtons :placeID="placeID" link="person" />
  </RedPanel>
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
