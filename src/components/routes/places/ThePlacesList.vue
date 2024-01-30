<script setup>
import { useCmsStore } from '../../../js/cmsStore'
import AListEntry from '../../base/AListEntry.vue'

const cmsStore = useCmsStore()
const places = cmsStore.getPlaces
</script>

<template>
  <div class="PersonPanel">
    <div class="list">
      <span class="spacer"></span>
      <AListEntry
        v-for="place in places"
        :key="place.id"
        :name="place.name"
        :link="'place/' + place.id.split('/').pop()"
      >
        {{ place.name }}
      </AListEntry>
    </div>
  </div>
</template>

<style scoped>
.spacer {
  line-height: 3rem;
  opacity: 0;
  display: list-item;
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
