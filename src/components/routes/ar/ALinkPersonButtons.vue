<script setup>
import { computed, defineProps } from 'vue'
import { useCmsStore } from '../../../js/cmsStore'
import anime from 'animejs'

const props = defineProps({
  placeID: String,
  link: {
    type: String,
    default: 'person'
  }
})

const cmsStore = useCmsStore()
const persons = computed(() => {
  return cmsStore.getPlacesBySubID(props.placeID).persons
})
</script>

<template>
  <div class="listPersons">
    <div>Verknüpfte Personen</div>

    <ul class="nameList">
      <transition-group name="list">
        <router-link
          :to="{ name: link, params: { id: person.id.split('/').pop() } }"
          class="personButton"
          v-for="(person, index) in persons"
          :key="person.id"
          :data-index="index"
        >
          {{ person.vorname + ' ' + person.nachname }}
        </router-link>
      </transition-group>
    </ul>
  </div>
</template>

<style scoped>
.listPersons {
  text-align: center;
  width: 100%;
  position: relative;
  padding: 0.5rem 0.5rem;
  border-radius: var(--normalRadius);
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.0525rem;
}

.nameList {
  padding-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
  min-height: 6rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.personButton {
  border-radius: var(--buttonRadius);
  background: rgba(255, 255, 255, 0);
  border: 1px solid #ff9c7aab;
  padding: 0.5rem;
  color: white;
  text-align: center;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.06rem;
}
</style>
