<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  text: String
})
</script>

<template>
  <div class="Card">
    <span v-html="props.text"></span>
  </div>
</template>

<style scoped>
.Card {
  border-radius: var(--buttonRadius);
  padding: 2rem 2rem;
  margin: 2rem;

  background: linear-gradient(
      0deg,
      rgba(255, 102, 50, 0.1) 0%,
      rgba(255, 102, 50, 0.1) 100%
    ),
    rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);

  font-size: 0.75rem;
  font-weight: 700;
  line-height: 140.023%;
  letter-spacing: 0.0525rem;

  color: rgba(255, 255, 255, 0.85);
  font-style: normal;
}
</style>
