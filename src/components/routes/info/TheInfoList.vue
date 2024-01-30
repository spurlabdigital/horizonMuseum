<script setup>
import { useCmsStore } from '../../../js/cmsStore'
import AListEntry from '../../base/AListEntry.vue'

const cmsStore = useCmsStore()
const sites = cmsStore.getInfoSites
</script>

<template>
  <div class="PersonPanel">
    <div class="list">
      <div class="spacer"></div>
      <AListEntry
        v-for="infoSite in sites"
        :key="infoSite.id"
        :name="infoSite.name"
        :link="'info/' + infoSite.id.split('/').pop()"
        >{{ infoSite.name }}</AListEntry
      >
    </div>
  </div>
</template>

<style scoped>
.PersonPanel {
}
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
