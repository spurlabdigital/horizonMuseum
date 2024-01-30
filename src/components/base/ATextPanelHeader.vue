<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'aHeader',
  props: {
    headline: {
      type: String,
      required: true
    },
    subline: {
      type: String
    },
    link: {
      type: Object
    }
  }
})
</script>

<template>
  <div class="Header">
    <RouterLink to="/horizon" class="CameraIcon">
      <img src="../../assets/icons/back.svg" alt="camera" />
    </RouterLink>
    <div class="Headline">{{ headline }}</div>
    <div class="Subline">{{ subline }}</div>
  </div>
</template>

<style scoped>
.Header {
  margin: -1rem -1rem 0 -1rem;
  padding: 10rem 1rem 1rem 1rem;
  min-height: 8rem;
  position: sticky;
  background: rgba(207, 199, 196);
  text-align: center;
  top: -1rem;
  z-index: 10;
}
.CameraIcon {
  top: 1rem;
  left: 1rem;
  position: absolute;
  z-index: 1;
  pointer-events: all;
  width: 4rem;
  right: 1rem;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
}

.Headline {
  color: var(--middleGrey);
  font-size: 1.625rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  letter-spacing: 0.065rem;
}
.Subline {
  font-size: 1.2rem;
  opacity: 0.3;
  margin-top: 0.5rem;
}
</style>
