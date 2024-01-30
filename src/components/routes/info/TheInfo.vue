<script setup>
import { useCmsStore } from '../../../js/cmsStore'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, ref } from 'vue'
import blocks_image from '../../blocks/image.vue'
import blocks_text from '../../blocks/text.vue'
import blocks_quelle from '../../blocks/quelle.vue'

const cmsStore = useCmsStore()
const route = useRoute()
let content = {}
onBeforeMount(() => {
  if (route.params.id) {
    content = cmsStore.getInfoSites.find((place) => {
      const cleandId = place.id.split('/').pop()
      return cleandId === route.params.id
    })
  }
})

const blocks = computed(() => {
  if (route.name !== 'info') {
    return []
  }
  const id = route.params.id
  const content = cmsStore.getInfoSites.find((place) => {
    const cleandId = place.id.split('/').pop()
    return cleandId === id
  })
  if (content.blocks) {
    return content.blocks
  } else {
    return []
  }
})
const components = {
  image: blocks_image,
  text: blocks_text,
  quelle: blocks_quelle
}
</script>

<template>
  <div class="PersonPanel" v-if="content">
    <router-link to="/info" class="back">
      <svg
        width="11"
        height="18"
        viewBox="0 0 11 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vector"
          d="M9 16L2 9L9 2"
          stroke="#4B4B4B"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </router-link>
    <div class="Name">
      {{ content.name }}
    </div>

    <component
      v-for="block in blocks"
      :is="components[block.type]"
      :key="block.id"
      :content="block"
    />

    <div class="addSpace" />
  </div>
</template>

<style scoped>
.PersonPanel {
  background: rgba(207, 199, 196, 0.81);
}

.back {
  position: absolute;
  top: 1.5rem;
  left: -0.5rem;
  padding: 1rem;
  display: flex;
  z-index: 10000;
}

.Name {
  color: var(--middleGrey);
  padding: 1rem;
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  max-width: calc(100% - 5rem);
  letter-spacing: 0.065rem;
}
</style>
