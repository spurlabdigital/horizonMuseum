<script setup>
const props = defineProps({
  link: String
})
</script>

<template>
  <router-link :to="props.link" class="link">mehr erfahren</router-link>
</template>

<style scoped>
.link {
}
</style>
