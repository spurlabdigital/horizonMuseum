<script setup>
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle'
import ACard from './ASwipeCard.vue'
import AButton from './AButton.vue'
import { useCmsStore } from '../../../js/cmsStore'
// register Swiper custom elements
register()

const cmsStore = useCmsStore()
</script>

<template>
  <div class="PersonPanel">
    <div class="TheIntroScreen">
      <div class="Headline">
        <h1>{{ cmsStore.getStartPage.headline }}</h1>
        <h2>{{ cmsStore.getStartPage.subline }}</h2>
      </div>

      <!--      <img src="../../../assets/images/Horizon_Startseite.jpg" />-->

      <div class="textBlock">
        {{ cmsStore.getStartPage.text }}
      </div>

      <router-link to="/horizon">
        <AButton text="Start" class="buttonPos" />
      </router-link>

      <swiper-container
        :slides-per-view="1"
        :centered-slides="true"
        :pagination="{ clickable: true }"
      >
        <swiper-slide
          v-for="block in cmsStore.getStartPage.blocks"
          :key="block.id"
        >
          <ACard :text="block.content.text" />
        </swiper-slide>
      </swiper-container>
    </div>
  </div>
</template>

<style scoped>
.PersonPanel {
  width: 100%;
  display: grid;
  justify-items: center;
}

.TheIntroScreen {
  padding: 8rem 0rem;
  width: 25rem;
  position: absolute;
}

.textBlock {
  padding-top: 4rem;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  font-size: 0.85rem;
  font-style: normal;
  font-weight: 700;
  line-height: 150.023%; /* 2.62538rem */
  letter-spacing: 0.105rem;
}

h1 {
  color: #ff6632;
  font-size: 6rem;
  font-weight: 900;
  line-height: normal;
  letter-spacing: 0.24rem;
  padding-bottom: 2rem;
  text-align: center;
}

h2 {
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  letter-spacing: 0.25925rem;
}

.swiper-pagination-bullet {
  background: white !important;
}
</style>
