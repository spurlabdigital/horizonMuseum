<script setup>
import { useCmsStore } from '../../../js/cmsStore'
import AListEntry from '../../base/AListEntry.vue'

const cmsStore = useCmsStore()
const persons = cmsStore.getPersons

const sortedPersons = persons.sort((a, b) => {
  if (a.nachname < b.nachname) {
    return -1
  }
  if (a.nachname > b.nachname) {
    return 1
  }

  return 0
})
</script>

<template>
  <div class="PersonPanel">
    <div class="list">
      <span class="spacer"></span>

      <AListEntry
        v-for="person in sortedPersons"
        :key="person.id"
        :name="person.name"
        :link="'biography/' + person.id.split('/').pop()"
        >{{ person.nachname + ', ' + person.vorname }}</AListEntry
      >
    </div>
  </div>
</template>

<style scoped>
.spacer {
  line-height: 3rem;
  display: list-item;
  opacity: 0;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 0;
  height: 100%;
  overflow-y: auto;
}
</style>
