<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useGlobalState } from '../../../js/store'
import RootPatch from '../../../threejs/root.js'

const globalState = useGlobalState()

const showARPanel = computed(() => {
  return globalState.showAR
})

onMounted(() => {
  window.rootPatch = new RootPatch()
})
</script>

<template>
  <div id="ThreejsPanel" />
</template>

<style scoped>
.gpsIcon {
  position: absolute;
  margin: 0.5rem 0rem;
  padding: 1rem;
  top: 0;
  left: 0;
  z-index: 1;
}

#ThreejsPanel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
