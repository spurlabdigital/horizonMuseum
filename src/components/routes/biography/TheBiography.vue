<script setup>
import { useGlobalState } from '../../../js/store'

import { computed, onBeforeMount, onMounted, ref } from 'vue'
import blocks_image from '../../blocks/image.vue'
import blocks_text from '../../blocks/text.vue'
import blocks_quelle from '../../blocks/quelle.vue'
import MapboxBoxPerson from './TheBiographyMapbox.vue'

import { useRouter, useRoute } from 'vue-router'
import { useCmsStore } from '../../../js/cmsStore'
import AHeader from '../../base/ATextPanelHeader.vue'
import TheBiographySwitch from './TheBiographySwitch.vue'

const cmsStore = useCmsStore()
const route = useRoute()

onBeforeMount(() => {
  if (route.params.id) {
    const person = cmsStore.getPersons.find((person) => {
      const cleandId = person.id.split('/').pop()
      return cleandId === route.params.id
    })
    globalState.setActivePerson(person)
  }
})

const components = {
  image: blocks_image,
  text: blocks_text,
  quelle: blocks_quelle
}

const globalState = useGlobalState()
const person = computed(() => globalState.activePerson)

const blocks = ref(null)
const panel = ref(null)

function log(event) {
  const block = blocks.value[event]
  const distance = block.getBoundingClientRect().top
  window.scroll({
    top: distance - 150,
    behavior: 'smooth'
  })
}

const arLink = computed(() => {
  return {
    name: 'horizon-biography',
    params: { id: person.value.id.split('/').pop() }
  }
})

const geburtsName = computed(() => {
  if (person.value.geburtsName) {
    return 'geb. ' + person.value.geburtsName
  } else {
    return ''
  }
})

function buildThresholdList() {
  let thresholds = []
  let numSteps = 20

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps
    thresholds.push(ratio)
  }

  thresholds.push(0)
  return thresholds
}

const activeBlock = ref('')

function observe() {
  const elements = document.querySelectorAll('.observe')
  const observerOptions = {
    root: null,
    threshold: buildThresholdList(),
    rootMargin: '50px'
  }

  const tempObject = {}
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      const target = entry.target

      tempObject[target.id] = entry.intersectionRatio
      if (entry.isIntersecting) {
        const sorted = Object.keys(tempObject).sort(
          (a, b) => tempObject[b] - tempObject[a]
        )

        if (activeBlock.value === '' || activeBlock.value !== sorted[0]) {
          //trigger custom event
          const event = new CustomEvent('blockChanged', {
            detail: sorted[0]
          })
          window.dispatchEvent(event)
        }

        activeBlock.value = sorted[0]
      }
    })
  }

  const observer = new IntersectionObserver(observerCallback, observerOptions)
  elements.forEach((element) => {
    observer.observe(element)
  })
}

onMounted(() => {
  setTimeout(() => {
    observe()
  }, 100)
})
</script>

<template>
  <div v-if="person" class="PersonPanel" ref="panel">
    <a-header
      :subline="geburtsName + '\n' + person.time"
      :headline="person.vorname + ' ' + person.nachname"
      :link="arLink"
    />

    <TheBiographySwitch />

    <MapboxBoxPerson @markerClicked="log" />

    <ul>
      <li
        v-for="(station, index) in person.stations"
        :key="station.id"
        :id="station.location"
        class="observe singlePanel"
      >
        <div class="stationHeader">
          <div class="stationIndex">{{ index + 1 }}</div>
          <router-link
            :to="{
              name: 'place',
              params: { id: station.location.split('/').pop() }
            }"
            class="stationName"
          >
            {{ station.name }}
          </router-link>
        </div>
        <div class="blocks" ref="blocks">
          <component
            v-for="block in station.blocks"
            :is="components[block.type]"
            :key="block.id"
            :content="block"
          />
        </div>
      </li>
    </ul>
    <div class="addSpace" />
  </div>
</template>

<style scoped>
.PersonPanel {
  background: rgba(207, 199, 196, 1);
}
.singlePanel {
  margin-top: 1rem;
  padding-top: 1rem;
  overflow: hidden;
  border-radius: var(--normalRadius);

  padding-bottom: 1rem;
  background: rgba(255, 255, 255, 0.4);
}
.stationHeader {
  display: flex;
  align-items: center;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1.5rem;
}

.stationIndex {
  border-radius: 50%;
  border: 2px solid var(--white);
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  display: grid;
  justify-items: center;
  align-items: center;
  color: var(--white);
  background: var(--orange);
  font-weight: 900;
  font-size: 0.8rem;
}

.stationName {
  margin-left: 1rem;
  font-weight: 900;
  font-size: 1rem;
  text-decoration: underline var(--orange) 3px;
  color: rgba(0, 0, 0, 0.75);
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.05894rem;
}
</style>
