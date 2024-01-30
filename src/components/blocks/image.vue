<template>
  <img :src="imageSrc" :alt="imageAlt" v-if="imageSrc" />
</template>

<script>
export default {
  name: 'blocks_image',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageSrc() {
      if (this.content.content.image) {
        if (globalSettings.cmsURL.includes('localhost')) {
          let imageID = this.content.content.image[0]
          imageID = imageID.replace('file://', globalSettings.cmsURL + 'files/')
          return imageID
        } else {
          const imageID = this.content.content.image[0].split('/').pop()
          const magicPath = globalSettings.cmsURL + '@/file/'
          return magicPath + imageID
        }
      } else {
        return null
      }
    },
    imageAlt() {
      return this.content.content.alt
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
