<script setup>
import TheTextPanelHeader from '../../base/TheTextPanelHeader.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TheBiographyReader from '../biography/TheBiographyReader.vue'
import ThePlaceReader from '../place/ThePlaceReader.vue'
import TheReaderMapbox from './TheReaderMapbox.vue'

const route = useRoute()

const mode = computed(() => {
  return route.name
})

const readingPanelBox = ref(null)

watch(
  () => route.fullPath,
  () => {
    readingPanelBox.value.scrollTop = 0
  }
)
</script>

<template>
  <div class="PersonPanel sidebar">
    <TheTextPanelHeader />
    <div class="scrollContainer" ref="readingPanelBox">
      <TheReaderMapbox />
      <TheBiographyReader v-if="mode === 'person'" />
      <ThePlaceReader v-if="mode === 'place'" />
    </div>
  </div>
</template>

<style scoped>
.PersonPanel {
  padding: 0;
}

.scrollContainer {
  height: calc(100vh - 20rem);
  padding: 1rem;
  overflow-y: scroll;
}
</style>
